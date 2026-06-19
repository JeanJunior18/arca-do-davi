-- Enums
create type gift_category as enum ('REGISTRY_ITEM', 'DIAPER_PACK');
create type gift_status as enum ('AVAILABLE', 'CLAIMED', 'FULFILLED');
create type baby_age_stage as enum ('NEWBORN', 'THREE_MONTHS', 'SIX_MONTHS', 'NINE_MONTHS', 'ONE_YEAR');

-- rsvps
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  companion_count integer not null default 0 check (companion_count >= 0),
  whatsapp_number text not null,
  created_at timestamptz not null default now()
);

-- gift_items
create table gift_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  category gift_category not null,
  size_label text,
  quantity_needed integer not null default 1 check (quantity_needed > 0),
  status gift_status not null default 'AVAILABLE',
  created_at timestamptz not null default now()
);

-- gift_claims
create table gift_claims (
  id uuid primary key default gen_random_uuid(),
  gift_item_id uuid not null references gift_items(id) on delete cascade,
  guest_name text not null,
  guest_whatsapp text,
  quantity_claimed integer not null default 1 check (quantity_claimed > 0),
  created_at timestamptz not null default now()
);

-- guestbook_messages
create table guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text not null check (char_length(message) <= 500),
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- gallery_photos
create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  age_label baby_age_stage not null,
  image_url text not null,
  display_order integer not null
);

-- RPC: claim atômico de presente da categoria REGISTRY_ITEM
create or replace function claim_gift_item(
  p_gift_item_id uuid,
  p_guest_name text,
  p_guest_whatsapp text default null
) returns gift_claims
language plpgsql
security definer
as $$
declare
  v_updated_rows integer;
  v_claim gift_claims;
begin
  update gift_items
    set status = 'CLAIMED'
    where id = p_gift_item_id and status = 'AVAILABLE';

  get diagnostics v_updated_rows = row_count;

  if v_updated_rows = 0 then
    raise exception 'ALREADY_CLAIMED';
  end if;

  insert into gift_claims (gift_item_id, guest_name, guest_whatsapp, quantity_claimed)
  values (p_gift_item_id, p_guest_name, p_guest_whatsapp, 1)
  returning * into v_claim;

  return v_claim;
end;
$$;

grant execute on function claim_gift_item(uuid, text, text) to anon;

-- Trigger: DIAPER_PACK passa a FULFILLED quando soma >= necessário (overshoot permitido)
create or replace function check_diaper_pack_fulfillment()
returns trigger
language plpgsql
as $$
declare
  v_total integer;
  v_needed integer;
begin
  select quantity_needed into v_needed from gift_items where id = new.gift_item_id;
  select coalesce(sum(quantity_claimed), 0) into v_total
    from gift_claims where gift_item_id = new.gift_item_id;

  if v_total >= v_needed then
    update gift_items set status = 'FULFILLED' where id = new.gift_item_id;
  end if;

  return new;
end;
$$;

create trigger trg_diaper_pack_fulfillment
after insert on gift_claims
for each row
execute function check_diaper_pack_fulfillment();

-- RLS
alter table rsvps enable row level security;
alter table gift_items enable row level security;
alter table gift_claims enable row level security;
alter table guestbook_messages enable row level security;
alter table gallery_photos enable row level security;

-- rsvps: insert público; SEM policy de select pra anon (leitura só via service role)
create policy rsvps_insert_anon on rsvps for insert to anon with check (true);

-- gift_items: leitura pública; escrita só via dashboard/service role (sem policy)
create policy gift_items_select_public on gift_items for select to anon using (true);

-- gift_claims: insert público (cobre o insert direto de diaper pack);
-- SEM policy de select pra anon (não expõe quem reservou o quê)
create policy gift_claims_insert_anon on gift_claims for insert to anon with check (true);

-- guestbook_messages: insert público; leitura pública só do que está aprovado
create policy guestbook_insert_anon on guestbook_messages for insert to anon with check (true);
create policy guestbook_select_approved on guestbook_messages for select to anon using (is_approved = true);

-- gallery_photos: leitura pública apenas
create policy gallery_select_public on gallery_photos for select to anon using (true);
