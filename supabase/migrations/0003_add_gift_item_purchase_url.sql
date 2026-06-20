-- Link de afiliado opcional pra compra direta do presente (qualquer categoria).
-- Independente do fluxo de claim/reserva — só um atalho de compra.
alter table gift_items add column purchase_url text;
