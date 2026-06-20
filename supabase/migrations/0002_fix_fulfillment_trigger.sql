-- O trigger original disparava pra qualquer insert em gift_claims, inclusive os
-- vindos da RPC claim_gift_item (REGISTRY_ITEM), sobrescrevendo o status 'CLAIMED'
-- pra 'FULFILLED'. Fulfillment por soma de quantidade é regra exclusiva de
-- DIAPER_PACK (regra de negócio #2 do domain model) — REGISTRY_ITEM nunca deveria
-- passar por essa lógica.
create or replace function check_diaper_pack_fulfillment()
returns trigger
language plpgsql
as $$
declare
  v_total integer;
  v_needed integer;
  v_category gift_category;
begin
  select quantity_needed, category into v_needed, v_category
    from gift_items where id = new.gift_item_id;

  if v_category != 'DIAPER_PACK' then
    return new;
  end if;

  select coalesce(sum(quantity_claimed), 0) into v_total
    from gift_claims where gift_item_id = new.gift_item_id;

  if v_total >= v_needed then
    update gift_items set status = 'FULFILLED' where id = new.gift_item_id;
  end if;

  return new;
end;
$$;
