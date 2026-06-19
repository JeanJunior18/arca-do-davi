# Identidade visual — Arca do Davi

Referência de design pra qualquer componente em `src/components/`. Tema:
Arca de Noé / safari de bebê, em aquarela, paleta terrosa e suave.

Mockup de referência (desktop + mobile) foi fornecido pelo usuário em
2026-06-19. Se o arquivo de imagem for adicionado ao repo, colocar em
`docs/design/` e linkar aqui.

## Paleta de cores

| Uso | Cor aproximada | Onde aparece |
|---|---|---|
| Fundo principal | creme / off-white quente (`#F7F1E3` aprox.) | background de toda a página |
| Acento primário | verde oliva escuro (`#5C6E3F` aprox.) | títulos, texto de nav, botões, faixa do "1 ANINHO", ícones de linha |
| Acento secundário | terracota / marrom claro (`#C8956D` aprox.) | madeira da arca, detalhes ilustrados |
| Texto de corpo | marrom-acinzentado (`#6B6256` aprox.) | parágrafos, descrições |
| Pastel decorativo | arco-íris suave (rosa, amarelo, azul, verde claro) | arco-íris atrás da arca, nuvens |

Botões: fundo verde oliva sólido, texto creme, cantos arredondados (pill ou
border-radius grande), ícone opcional ao lado do texto (♡, 📍, 📱, ✎).

## Tipografia

- **Display/script** (apenas a palavra "Davi" e frases de destaque em itálico
  no mobile, ex: "Vai ser uma grande aventura com você!"): fonte cursiva
  manuscrita (estilo Caveat / Dancing Script / Allura).
- **Títulos de seção e nav**: caixa alta, letter-spacing largo, peso médio —
  serve tanto pra nav ("INÍCIO", "PRESENÇA"...) quanto pra headings
  ("CONFIRME SUA PRESENÇA", "LISTA DE PRESENTES").
- **Corpo**: sans-serif limpa, line-height generoso, sem caixa alta.

## Iconografia

Ícones de linha (outline), traço fino, cor verde oliva: calendário, relógio,
pin de localização, caixa de presente, coração, fralda, smartphone, lápis.
Coração (♡) é usado como divisor decorativo entre título e subtítulo em
quase toda seção.

## Ilustração

Aquarela do tema Arca de Noé: arca de madeira com elefante, leão, zebra,
girafas, macaco, pombo, arco-íris ao fundo. Mesma arte é reaproveitada no
hero desktop, no topo do mobile e numa faixa decorativa no rodapé do mobile.

## Estrutura de seções (mapeia pra `components/sections/`)

1. **NavBar** — ícone de âncora + links horizontais (desktop only;
   no mobile a navegação por âncora não aparece como barra fixa no mockup).
2. **Hero** — desktop: duas colunas (texto + ilustração da arca). Mobile:
   empilhado (intro → título → faixa "1 ANINHO" → ilustração → subtítulo
   em itálico).
3. **EventInfo** — data / horário / local, com botão "Ver localização".
   Desktop: cartão horizontal com os 3 itens + botão ao lado. Mobile: lista
   vertical dos mesmos itens, sem botão (some no card mobile do mockup).
4. **RsvpSection** — heading + subtítulo + form (nome, quantidade de
   acompanhantes, whatsapp) + botão "Confirmar presença".
   Campos do form mapeiam 1:1 com `rsvps` (`guest_name`, `companion_count`,
   `whatsapp_number`) — ver @docs/domain-model.md.
5. **GiftSection** — heading + subtítulo + 3 cards (Lista de Presentes / Pix
   Presente / Fraldas), cada um com ícone, título, descrição curta e botão
   próprio. Os 3 cards mapeiam pra duas origens de dados diferentes:
   "Lista de Presentes" e "Fraldas" são `gift_items` filtrados por
   `category` (`REGISTRY_ITEM` / `DIAPER_PACK`); "Pix Presente" é conteúdo
   estático de `config/event.config.ts` (não é um gift_item — regra de
   negócio #3 do domain model).
6. **GallerySection** — heading + carousel horizontal de fotos com label de
   idade abaixo de cada uma. Os 5 labels do mockup (RECÉM-NASCIDO, 3 MESES,
   6 MESES, 9 MESES, 1 ANO) correspondem exatamente ao enum `BabyAgeStage`.
7. **GuestbookSection** — heading + subtítulo + botão "Deixar mensagem"
   (abre form/modal pra escrever no mural).
8. **Footer** — ilustração pequena da arca + citação bíblica (Gênesis 7:9)
   em itálico.
9. **Mobile-only: ShareQrCode** — bloco com QR code (moldura branca
   arredondada com cantos em verde oliva) + botão "Escaneie-me". É a versão
   mobile do convite compartilhável, aponta pra mesma URL da página.

## Notas de implementação

- O carousel da galeria e os cards de presente devem ser primitivos sem
  lógica de negócio em `components/ui/` (ex: `Card`, `Carousel`, `Button`,
  `SectionHeading` com o divisor de coração), compostos pelas seções em
  `components/sections/`.
- Mobile e desktop reaproveitam o mesmo conteúdo/dados — a diferença é só de
  layout (colunas vs. stack, card horizontal vs. lista vertical). Não criar
  componentes de dados duplicados por breakpoint; resolver com CSS
  responsivo (Tailwind) num único componente sempre que possível.
