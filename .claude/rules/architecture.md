---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Architecture & SOLID conventions

Arquitetura em camadas (ports & adapters). Direção de dependência:
domain -> application -> infrastructure/app. Nunca o inverso.

## Camadas

- `domain/entities/` — tipos puros em TypeScript. Sem import de React,
  Next.js ou Supabase.
- `domain/repositories/` — só interfaces (ports). Sem implementação.
- `application/use-cases/` — uma função por use case, recebe uma instância
  de repositório como parâmetro (injeção via construtor/factory), valida
  input com `zod`, chama o repositório, devolve um resultado tipado. Sem
  import de nada em `infrastructure/`.
- `infrastructure/supabase/` — implementações concretas (adapters), cada uma
  recebendo um `SupabaseClient` via construtor — nunca instancia o client
  dentro do próprio repositório. Único lugar do projeto autorizado a
  importar `@supabase/supabase-js`.
- `app/actions/` — Server Actions (`'use server'`). Composition root: é o
  único lugar que conecta uma implementação concreta de `infrastructure/` a
  um use case de `application/`. Sem lógica de negócio ou validação aqui —
  isso já aconteceu no use case.
- `components/ui/` — primitivos de apresentação, sem lógica de negócio, sem
  fetch de dados.
- `components/sections/` — um componente por seção de domínio (Hero, Rsvp,
  GiftRegistry, Gallery, Guestbook, Footer). Server Component por padrão; só
  a folha interativa (um formulário, um botão de claim) é Client Component.

## Mapeamento SOLID

- **SRP** — um componente de formulário nunca chama o Supabase direto; um
  repositório nunca decide regra de negócio; um use case nunca renderiza nada.
- **OCP** — o comportamento por categoria de presente (`REGISTRY_ITEM` vs
  `DIAPER_PACK`) é um strategy map indexado por `GiftCategory`, não um
  `if/else` espalhado pelos componentes. Nova categoria no futuro = nova
  entrada no map, sem editar branch existente.
- **LSP** — qualquer implementação de `GiftRepository` precisa devolver os
  mesmos formatos de resultado tipado pros casos esperados (ex:
  `{ success: false, reason: 'ALREADY_CLAIMED' }`), nunca lançar throw pra um
  resultado de negócio esperado.
- **ISP** — quatro interfaces de repositório pequenas (`RsvpRepository`,
  `GiftRepository`, `GuestbookRepository`, `GalleryRepository`). Nunca
  fundir num repositório genérico.
- **DIP** — `application/use-cases/` e `app/actions/` dependem das
  interfaces em `domain/repositories/`, nunca de uma classe concreta do
  Supabase diretamente.

Schema completo e regras de negócio detalhadas: @docs/domain-model.md