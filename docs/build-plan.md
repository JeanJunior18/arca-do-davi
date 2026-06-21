# Arca do Davi — Plano de Construção

Documento de handoff pra um agente de desenvolvimento (ex: Claude Code). Cada etapa tem um prompt pronto pra colar. Siga em ordem — cada prompt assume que as etapas anteriores já foram aplicadas e estão no repositório. Não pule etapas mesmo que pareçam pequenas: a separação existe para manter SOLID real, não decorativo.

---

## 0. Decisões já fechadas (não renegociar com o agente)

- **Stack**: Next.js 16 (App Router, Turbopack como bundler default), TypeScript estrito, Tailwind CSS, Supabase (Postgres + Storage), deploy na Vercel.
- **Regra inegociável de segurança**: nenhuma chave do Supabase chega ao browser. Toda comunicação com o Supabase acontece em Server Components, Server Actions ou Route Handlers. Arquivos com `'use client'` no topo nunca importam `@supabase/supabase-js` nem nada de `infrastructure/`.
- **Duas chaves, dois propósitos**: `SUPABASE_ANON_KEY` (sem prefixo `NEXT_PUBLIC_`) é usada nos Server Actions de escrita pública (RSVP, claim de presente, mensagem do mural) — respeitando RLS, princípio do menor privilégio. `SUPABASE_SERVICE_ROLE_KEY` é usada exclusivamente dentro de `app/internal/guest-log/` — ignora RLS, só pra essa leitura administrativa.
- **Cache no Next 16**: o modelo de cache agora é opt-in via `"use cache"`. Por padrão tudo roda dinâmico a cada request — não adicione `"use cache"` em nenhuma seção que lê `gift_items`, `rsvps` ou `guestbook_messages`, porque esses dados mudam em tempo real (status de presente reservado, por exemplo) e cache manual aqui criaria dados desatualizados na tela.
- **Arquitetura em camadas (SOLID aplicado)**:

```
src/
  domain/
    entities/          → tipos puros, zero dependências externas
    enums/
    repositories/       → interfaces (ports)
  application/
    use-cases/          → regras de negócio, dependem só das interfaces
  infrastructure/
    supabase/            → implementações concretas (adapters), só importado server-side
  config/
    event.config.ts      → conteúdo estático do evento
  app/
    actions/              → Server Actions = composition root
    internal/guest-log/   → rota oculta, service role
    page.tsx               → página única com seções por âncora
  components/
    ui/         → primitivos sem lógica de negócio
    sections/   → uma seção por domínio (Hero, RSVP, Gift, Gallery, Guestbook)
    forms/
    gift/
```

**Mapeamento SOLID:**
- *SRP*: formulário não chama Supabase; repositório não decide regra de negócio; use case não renderiza nada.
- *OCP*: comportamento por categoria de presente (`REGISTRY_ITEM` vs `DIAPER_PACK`) fica num strategy map — nova categoria no futuro não toca código existente.
- *LSP*: qualquer implementação de `GiftRepository` devolve os mesmos tipos de resultado pros casos esperados (ex: "já reservado" é um valor de retorno tipado, nunca um `throw` não tratado).
- *ISP*: quatro interfaces pequenas (`RsvpRepository`, `GiftRepository`, `GuestbookRepository`, `GalleryRepository`) em vez de um repositório genérico.
- *DIP*: use cases e Server Actions dependem das interfaces em `domain/repositories`; a implementação concreta só é amarrada no composition root (`app/actions/*.ts`).

---

## Etapa 1 — Bootstrap do projeto

**Objetivo**: criar o esqueleto do projeto e travar a convenção de pastas antes de qualquer lógica.

```
Crie um projeto Next.js 16 com `npx create-next-app@latest arca-do-davi` (App Router,
TypeScript estrito, Tailwind CSS, ESLint, sem src/ directory customization além do
padrão). Configure path aliases no tsconfig.json: "@/domain/*", "@/application/*",
"@/infrastructure/*", "@/components/*", "@/config/*".

Crie a seguinte estrutura de pastas vazias dentro de src/:
domain/entities, domain/enums, domain/repositories,
application/use-cases,
infrastructure/supabase,
config,
components/ui, components/sections, components/forms, components/gift,
app/actions, app/internal/guest-log.

Instale @supabase/supabase-js e zod (validação de input).

Não escreva nenhuma lógica de negócio ainda — só estrutura. Garanta que `next dev`
roda sem erro (Turbopack já é o bundler default no Next 16, não precisa configurar).

Crie um AGENTS.md na raiz documentando:
1. A estrutura de pastas acima e o papel de cada camada.
2. Regra inegociável: nenhum arquivo com 'use client' no topo pode importar
   @supabase/supabase-js ou qualquer arquivo de infrastructure/.
3. Regra de cache: não usar a diretiva "use cache" em nenhuma seção que leia
   gift_items, rsvps ou guestbook_messages — esses dados precisam ser sempre
   dinâmicos/frescos por request.
```

**Definição de pronto**: projeto roda localmente, estrutura existe, `AGENTS.md` documenta as duas regras.

---

## Etapa 2 — Domain layer (entidades, enums, interfaces de repositório)

**Objetivo**: tipos puros e contratos, sem nenhuma dependência de Supabase ou React.

```
Dentro de src/domain/, crie os seguintes arquivos EXATAMENTE como especificado
(nomenclatura em inglês, sem nenhuma dependência externa nesses arquivos):

// domain/enums/gift-category.ts
export enum GiftCategory {
  REGISTRY_ITEM = 'REGISTRY_ITEM',
  DIAPER_PACK = 'DIAPER_PACK',
}

// domain/enums/gift-status.ts
export enum GiftStatus {
  AVAILABLE = 'AVAILABLE',
  CLAIMED = 'CLAIMED',
  FULFILLED = 'FULFILLED',
}

// domain/enums/baby-age-stage.ts
export enum BabyAgeStage {
  NEWBORN = 'NEWBORN',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  NINE_MONTHS = 'NINE_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
}

// domain/entities/rsvp.ts
export interface Rsvp {
  id: string;
  guestName: string;
  companionCount: number;
  whatsappNumber: string;
  createdAt: string;
}

// domain/entities/gift-item.ts
export interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: GiftCategory;
  sizeLabel: string | null;
  quantityNeeded: number;
  status: GiftStatus;
  createdAt: string;
}

// domain/entities/gift-claim.ts
export interface GiftClaim {
  id: string;
  giftItemId: string;
  guestName: string;
  guestWhatsapp: string | null;
  quantityClaimed: number;
  createdAt: string;
}

// domain/entities/guestbook-message.ts
export interface GuestbookMessage {
  id: string;
  guestName: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

// domain/entities/gallery-photo.ts
export interface GalleryPhoto {
  id: string;
  ageLabel: BabyAgeStage;
  imageUrl: string;
  displayOrder: number;
}

Agora crie as interfaces de repositório (ports) em domain/repositories/.
São contratos — sem implementação, sem import de supabase-js:

// domain/repositories/rsvp-repository.ts
export interface RsvpRepository {
  create(input: {
    guestName: string;
    companionCount: number;
    whatsappNumber: string;
  }): Promise<Rsvp>;
  listAll(): Promise<Rsvp[]>; // só deve ser chamado por código que usa service role
}

// domain/repositories/gift-repository.ts
export type ClaimRegistryItemResult =
  | { success: true; claim: GiftClaim }
  | { success: false; reason: 'ALREADY_CLAIMED' };

export interface GiftRepository {
  listItems(): Promise<GiftItem[]>;
  claimRegistryItem(input: {
    giftItemId: string;
    guestName: string;
    guestWhatsapp?: string;
  }): Promise<ClaimRegistryItemResult>;
  claimDiaperPack(input: {
    giftItemId: string;
    guestName: string;
    guestWhatsapp?: string;
    quantity: number;
  }): Promise<GiftClaim>;
}

// domain/repositories/guestbook-repository.ts
export interface GuestbookRepository {
  create(input: { guestName: string; message: string }): Promise<GuestbookMessage>;
  listApproved(): Promise<GuestbookMessage[]>;
}

// domain/repositories/gallery-repository.ts
export interface GalleryRepository {
  listOrdered(): Promise<GalleryPhoto[]>;
}

Importe os tipos necessários nos arquivos de repositório (import type das entities).
Não crie nenhuma implementação ainda — isso é só o contrato.
```

**Definição de pronto**: `domain/` compila isoladamente, zero import de `@supabase/supabase-js` ou `react` em qualquer arquivo dessa camada.

---

## Etapa 3 — Migrations SQL no Supabase

**Objetivo**: schema, função atômica de claim, trigger de fulfillment, RLS.

```
Crie o arquivo supabase/migrations/0001_init.sql com exatamente este conteúdo
(não altere nomes de tabela, função ou policy — eles têm que bater com o código
das próximas etapas):

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

Aplique essa migration no projeto Supabase via Supabase CLI ou cole no SQL Editor
do dashboard. Depois, crie um bucket de Storage público chamado "media" pra guardar
as imagens dos gift_items e das gallery_photos.
```

**Definição de pronto**: tabelas, função, trigger e policies existem no projeto Supabase; bucket `media` criado como público.

---

## Etapa 4 — Infrastructure layer (clients + implementações dos repositórios)

**Objetivo**: os únicos arquivos do projeto que tocam `@supabase/supabase-js`.

```
Dentro de src/infrastructure/supabase/, crie:

1. anon-server-client.ts — factory que cria um SupabaseClient usando
   process.env.SUPABASE_URL e process.env.SUPABASE_ANON_KEY (NUNCA com prefixo
   NEXT_PUBLIC_). Esse client é usado nas escritas/leituras públicas que respeitam RLS.

2. service-role-client.ts — factory que cria um SupabaseClient usando
   process.env.SUPABASE_URL e process.env.SUPABASE_SERVICE_ROLE_KEY. Comente
   explicitamente no topo do arquivo: "Usar SOMENTE dentro de
   app/internal/guest-log/. Esse client ignora RLS."

3. Uma implementação por interface de domain/repositories, recebendo o
   SupabaseClient via construtor (injeção de dependência — não instancie o
   client dentro do repositório):

   - rsvp-repository.supabase.ts implementa RsvpRepository
     (tabela rsvps, mapeando snake_case do banco pra camelCase da entity)
   - gift-repository.supabase.ts implementa GiftRepository
     - listItems: select * from gift_items
     - claimRegistryItem: chama supabase.rpc('claim_gift_item', {...}); se a
       RPC lançar erro com mensagem 'ALREADY_CLAIMED', capture e retorne
       { success: false, reason: 'ALREADY_CLAIMED' } em vez de propagar o throw
       (a interface exige isso — é o requisito de LSP que já travamos)
     - claimDiaperPack: insert direto em gift_claims
   - guestbook-repository.supabase.ts implementa GuestbookRepository
   - gallery-repository.supabase.ts implementa GalleryRepository
     (select * from gallery_photos order by display_order asc)

Cada implementação faz o mapeamento snake_case -> camelCase manualmente num
mapper privado dentro do próprio arquivo (não precisa de lib externa).

Nenhum desses arquivos pode ser importado por um arquivo com 'use client' no
topo — eles só existem pra serem usados dentro de Server Actions ou Server
Components.
```

**Definição de pronto**: cada implementação satisfaz a interface correspondente (TypeScript não reclama), e `grep -r "use client"` cruzado com imports de `infrastructure/` não retorna nenhum arquivo.

---

## Etapa 5 — Application layer (use cases)

**Objetivo**: regra de negócio isolada, validação de input via zod, zero conhecimento de Supabase ou Next.js.

```
Dentro de src/application/use-cases/, crie uma função por use case. Cada função
recebe a dependência (repositório) já instanciada como parâmetro — não importe
nem instancie nada de infrastructure/ aqui dentro. Use zod só pra validar o
shape do input antes de chamar o repositório.

- confirm-attendance.use-case.ts
  Valida: guestName (string, min 2 chars), companionCount (int >= 0),
  whatsappNumber (string, formato brasileiro básico /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).
  Chama rsvpRepository.create(...).

- list-rsvps.use-case.ts
  Chama rsvpRepository.listAll() e retorna junto um agregado:
  { rsvps, totalConfirmed } onde totalConfirmed = rsvps.length +
  sum(companionCount de todos).

- list-gift-items.use-case.ts
  Chama giftRepository.listItems(), agrupa por category antes de retornar:
  { registryItems: GiftItem[], diaperPacks: GiftItem[] }.

- claim-registry-item.use-case.ts
  Valida giftItemId (uuid) e guestName (min 2 chars). Chama
  giftRepository.claimRegistryItem(...) e repassa o resultado tipado
  (ClaimRegistryItemResult) sem transformação.

- claim-diaper-pack.use-case.ts
  Valida giftItemId, guestName, quantity (int > 0). Sem teto de validação —
  overshoot é permitido por regra de negócio. Chama
  giftRepository.claimDiaperPack(...).

- leave-guestbook-message.use-case.ts
  Valida guestName (min 2 chars) e message (string, 1 a 500 chars). Chama
  guestbookRepository.create(...).

- list-guestbook-messages.use-case.ts
  Chama guestbookRepository.listApproved().

- list-gallery-photos.use-case.ts
  Chama galleryRepository.listOrdered().

Se a validação do zod falhar, a função deve retornar/lançar um erro com uma
mensagem clara o suficiente pro Server Action conseguir devolver feedback de
formulário pro usuário (não precisa ser estruturado demais — uma exception
com .message já basta nessa camada).
```

**Definição de pronto**: cada use case tem teste unitário simples passando um repositório fake/mock que implementa a interface — se isso compilar e rodar sem importar Supabase, a camada está corretamente isolada.

---

## Etapa 6 — Server Actions (composition root)

**Objetivo**: é aqui que infrastructure encontra application — e só aqui.

```
Dentro de src/app/actions/, crie um arquivo por domínio, cada um com 'use server'
no topo:

- rsvp.actions.ts
  export async function confirmAttendanceAction(formData: FormData)
  Dentro da função: instancia o anon-server-client, instancia
  SupabaseRsvpRepository com esse client, chama confirmAttendance use case
  passando os campos extraídos do FormData. Retorna { success: boolean,
  message?: string } serializável pro client component.

- gift.actions.ts
  export async function claimRegistryItemAction(...)
  export async function claimDiaperPackAction(...)
  Mesmo padrão: instancia client + repository + use case dentro da action.

- guestbook.actions.ts
  export async function leaveMessageAction(formData: FormData)
  Mesmo padrão.

Nenhuma dessas actions deve conter lógica de validação ou regra de negócio —
isso já está no use case. A action só faz: extrair input do FormData,
instanciar as dependências concretas, chamar o use case, formatar o retorno
pro client.

Para leitura de dados nas páginas (list-gift-items, list-guestbook-messages,
list-gallery-photos), não use Server Actions — chame os use cases diretamente
dentro do Server Component da seção, já que é leitura, não mutação.
```

**Definição de pronto**: nenhum Server Action ou Server Component de leitura importa `@supabase/supabase-js` diretamente — sempre passa pelas implementações de `infrastructure/`.

---

## Etapa 7 — Event config (conteúdo estático)

```
Crie src/config/event.config.ts exportando um objeto const tipado com os dados
reais do evento (placeholders por enquanto, ajustáveis depois sem tocar em
nenhum componente):

export const eventConfig = {
  childName: 'Davi',
  ageLabel: '1 aninho',
  eventDate: '2025-05-25',
  eventTime: '16:00',
  venueName: 'Buffet Alegria',
  venueAddress: 'Rua das Flores, 123 — Jardim das Oliveiras, São Paulo – SP',
  googleMapsUrl: 'https://maps.google.com/?q=...',
  bibleVerse: {
    text: 'Dois a dois eles entraram na arca, como Deus havia ordenado a Noé.',
    reference: 'Gênesis 7:9',
  },
  pix: {
    key: '...',
    qrCodeImageUrl: '...',
  },
} as const;

Esse arquivo não tem nenhuma lógica, é só dado. Componentes importam de
@/config/event.config diretamente.
```

---

## Etapa 8 — Design system (mobile-first, tema arca de Noé)

```
Configure o Tailwind com tokens de cor aproximando a paleta de referência
(ribbon verde-oliva, fundo bege, cards em creme) — algo como:

  primary (verde-oliva): #5F6F44 / variações 50 a 900
  background (bege): #F5F0E6
  surface (creme dos cards): #FAF6EE
  accent text (texto sobre o ribbon): #FFFFFF

Use uma fonte serifada/script (ex: Google Font "Playfair Display" ou similar)
só pro título do nome da criança, e uma sans-serif pro resto.

Crie componentes primitivos em src/components/ui/ — Button, Card, Badge,
SectionContainer, Input, Textarea — todos mobile-first (base styles pensados
pra 375-414px, breakpoints md/lg expandindo depois). Nenhum desses componentes
contém lógica de negócio nem importa Server Actions diretamente — eles só
recebem props e emitem eventos via callback.
```

---

## Etapa 9 — Seções (componentes de feature)

```
Crie em src/components/sections/ uma seção por domínio, cada uma um arquivo
próprio:

- hero-section.tsx — Server Component, lê eventConfig, mostra título/ribbon/texto.
- info-cards-section.tsx — Server Component, lê eventConfig (data/horário/local).
- rsvp-section.tsx — Server Component que renderiza components/forms/rsvp-form.tsx
  (Client Component com useActionState chamando confirmAttendanceAction).
- gift-registry-section.tsx — Server Component que chama list-gift-items
  use case diretamente, renderiza components/gift/gift-card.tsx por item.
  gift-card.tsx é Client Component: se category é REGISTRY_ITEM, mostra botão
  "quero dar esse presente" chamando claimRegistryItemAction; se é DIAPER_PACK,
  mostra input de quantidade + botão chamando claimDiaperPackAction. Implemente
  essa diferença de comportamento como um strategy map (categoria -> config de
  UI), não como if/else solto no componente — é o ponto de OCP da Etapa 0.
  Use useOptimistic pra feedback imediato no claim, já que é uma ação que o
  usuário espera ver responder na hora.
- gallery-section.tsx — Server Component, chama list-gallery-photos use case,
  renderiza carrossel (Client Component só pro controle de navegação do carrossel).
- guestbook-section.tsx — Server Component que renderiza o form (Client
  Component chamando leaveMessageAction) e a lista de mensagens aprovadas
  (lida direto via list-guestbook-messages use case).
- footer-section.tsx — Server Component, versículo + créditos.

Todas as seções recebem um id de âncora (id="presenca", id="presentes", etc)
batendo com os nomes do menu de navegação do design de referência.
```

---

## Etapa 10 — Montagem da página + navegação

```
Em src/app/page.tsx, monte a página única empilhando as seções na ordem:
Hero -> InfoCards -> Rsvp -> GiftRegistry -> Gallery -> Guestbook -> Footer.

Crie um componente de navegação sticky no topo com os links de âncora
(Início, Presença, Presentes, Como Chegar, Galeria, Mensagens) com smooth
scroll. Em telas mobile (a maioria dos visitantes vai abrir pelo WhatsApp no
celular), colapse o menu num botão de hambúrguer.

A seção "Como Chegar" não existe como seção própria no plano de domínio —
é parte de InfoCards, com um link/botão "Ver localização" usando
eventConfig.googleMapsUrl. Ajuste o id de âncora do menu pra apontar pra
dentro de info-cards-section.
```

---

## Etapa 11 — Seed, variáveis de ambiente e deploy

```
1. Crie .env.local.example listando (sem valores reais):
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   Nenhuma variável aqui deve ter prefixo NEXT_PUBLIC_.

2. Escreva um script de seed (supabase/seed.sql ou um script Node único,
   sua escolha) inserindo os gift_items e gallery_photos placeholder —
   me avise quais fotos/itens reais você vai trocar depois.

3. Configure as mesmas três variáveis de ambiente no painel da Vercel
   (Production + Preview), sempre como server-side env vars.

4. Rode `next build` localmente antes do primeiro deploy pra garantir que
   nenhum arquivo client-side está tentando importar algo de infrastructure/
   (isso quebraria o build, o que é o comportamento correto e esperado).
```

---

## Checklist final de QA (rodar manualmente após o deploy)

- UC-01: confirmar presença com e sem acompanhantes — aparece em `rsvps`.
- UC-02/03: reservar um `REGISTRY_ITEM` — status muda pra `CLAIMED`; tentar reservar de novo no mesmo item (duas abas) — a segunda tentativa recebe `ALREADY_CLAIMED`.
- UC-04: reservar `DIAPER_PACK` parcial, depois reservar excedente — status só vira `FULFILLED` quando a soma bate, overshoot não dá erro.
- UC-05/06: deixar mensagem — aparece imediatamente no mural.
- UC-07: galeria mostra as 5 fases na ordem certa.
- Abrir o DevTools em qualquer página pública, checar a aba Network/Sources: nenhuma string de `SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_ANON_KEY` deve aparecer no bundle JS enviado ao browser.