-- RSVP passa a ser upsert por whatsapp_number: garante unicidade e permite o
-- fluxo de "já existe uma confirmação com esse WhatsApp, quer atualizar a
-- quantidade de acompanhantes?" sem expor leitura pública da tabela — a RPC é
-- security definer, roda fora de RLS (mesmo padrão de claim_gift_item).

alter table rsvps add constraint rsvps_whatsapp_number_key unique (whatsapp_number);

create type rsvp_upsert_status as enum ('CREATED', 'UPDATED', 'ALREADY_EXISTS');

create or replace function upsert_rsvp(
  p_guest_name text,
  p_companion_count integer,
  p_whatsapp_number text,
  p_confirm_update boolean default false
) returns table (
  status rsvp_upsert_status,
  guest_name text,
  companion_count integer
)
language plpgsql
security definer
as $$
declare
  v_existing rsvps;
begin
  select * into v_existing from rsvps where whatsapp_number = p_whatsapp_number;

  if v_existing.id is null then
    insert into rsvps (guest_name, companion_count, whatsapp_number)
    values (p_guest_name, p_companion_count, p_whatsapp_number);

    return query select 'CREATED'::rsvp_upsert_status, p_guest_name, p_companion_count;
  elsif p_confirm_update then
    update rsvps set companion_count = p_companion_count where whatsapp_number = p_whatsapp_number;

    return query select 'UPDATED'::rsvp_upsert_status, v_existing.guest_name, p_companion_count;
  else
    return query select 'ALREADY_EXISTS'::rsvp_upsert_status, v_existing.guest_name, v_existing.companion_count;
  end if;
end;
$$;

grant execute on function upsert_rsvp(text, integer, text, boolean) to anon;

-- Escrita direta não é mais permitida — toda confirmação passa pela RPC acima,
-- que decide entre criar, atualizar ou pedir confirmação.
drop policy if exists rsvps_insert_anon on rsvps;
