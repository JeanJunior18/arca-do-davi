-- Permite sincronizar gift_items a partir de uma fonte externa (ex: lista do
-- Mercado Livre) de forma idempotente — re-rodar o sync atualiza a linha em
-- vez de duplicar. NULL pra presentes cadastrados manualmente sem origem
-- externa; UNIQUE padrão do Postgres já permite múltiplos NULL sem conflito.
alter table gift_items add column external_id text unique;
