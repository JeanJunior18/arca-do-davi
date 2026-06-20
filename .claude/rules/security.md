# Security rules (não-negociáveis)

- Arquivos com `'use client'` no topo nunca importam `@supabase/supabase-js`
  nem nada de `src/infrastructure/`. Se um componente precisa de dado do
  servidor, busque num Server Component pai e passe via props, ou chame uma
  Server Action de `src/app/actions/`.
- `SUPABASE_SECRET_KEY` é usada em exatamente dois lugares:
  `src/app/internal/guest-log/page.tsx` e os scripts administrativos em
  `scripts/` (ex: `sync-mercadolivre-gifts.mjs`, que faz seed de
  `gift_items`). Nunca deve aparecer dentro de `src/components/`,
  `src/app/actions/`, nem em nenhum arquivo que entre no bundle do client ou
  do server do Next.js — scripts em `scripts/` rodam fora do Next.js (via
  `node`), nunca são importados pelo app. (Confirmado explicitamente pelo
  usuário em 2026-06-20 — essa ampliação não é decisão unilateral do agente.)
- Nenhuma variável de ambiente com chave do Supabase tem prefixo
  `NEXT_PUBLIC_`. Se aparecer uma, é bug — corrige antes de seguir.
- Não adicione a diretiva `"use cache"` em nenhuma page, layout ou componente
  que leia `gift_items`, `rsvps` ou `guestbook_messages`. Esses dados
  precisam ser dinâmicos a cada request — cache aqui mostraria status de
  claim ou contagem de convidados desatualizados.
- `rsvps` não tem policy de `SELECT` pra `anon` no Postgres, de propósito.
  Não adicione uma. O único caminho de leitura autorizado é o client de
  service role dentro de `app/internal/guest-log/`.
- Antes de todo deploy, rode `next build` localmente e confirme que não falha
  por um client component importando código server-only — essa falha é
  esperada e correta, nunca silencie movendo o import pra outro lugar.