# Arca do Davi — instruções de projeto

Site de convite e RSVP para o aniversário de 1 ano do Davi. Página única,
mobile-first, sem autenticação de usuário público.

## Stack
- Next.js 16 (App Router, Turbopack), TypeScript estrito, Tailwind CSS
- Supabase: Postgres (RLS habilitado em todas as tabelas) + Storage (bucket `media`, público)
- Deploy: Vercel

## Comandos
- `npm run dev` — servidor local
- `npm run build` — build de produção; rodar localmente antes de todo deploy
- `npm run lint` — ESLint

## Regras inegociáveis (segurança)
Detalhe completo em `.claude/rules/security.md` (carregado em toda sessão).
Resumo: nenhuma chave do Supabase chega ao browser; `SUPABASE_SERVICE_ROLE_KEY`
só é usada em `src/app/internal/guest-log/`; nenhuma env var do Supabase tem
prefixo `NEXT_PUBLIC_`; não usar `"use cache"` em dados mutáveis
(`gift_items`, `rsvps`, `guestbook_messages`).

## Arquitetura
Camadas em `src/domain/ -> src/application/ -> src/infrastructure/ -> src/app/`.
Detalhe completo e mapeamento SOLID em `.claude/rules/architecture.md`.

## Domínio
Entidades, tabelas, enums e regras de negócio (claim atômico de presente,
fulfillment de fralda com overshoot, mural sem moderação): @docs/domain-model.md

## Identidade visual
Paleta, tipografia, iconografia e mapeamento de seções pro mockup de
referência (Arca de Noé / safari de bebê): @docs/visual-identity.md

## Histórico
O roteiro de construção original (prompts por etapa, usados só durante o
bootstrap) está em `docs/build-plan.md`. Não precisa ser relido em sessões de
manutenção — não está importado aqui de propósito, pra não consumir contexto
com algo que já foi executado.