# Handoff · Landing Mobile (versão responsiva da /)

> Para o **Claude Code**. Complemento do [`handoff-landing-v2.md`](./handoff-landing-v2.md). Esta entrega cobre **a versão mobile responsiva da Landing pública E uma mudança companheira no hero desktop**. O conteúdo, tokens, marca e regras já decididas continuam valendo — aqui o foco é o layout em telas estreitas (≤ 720px) e as transformações específicas que ele exige.

## 0. Mudança companheira no hero desktop

Em paralelo ao desenho mobile, o hero do **desktop** também mudou:

- **Antes:** browser frame com `ScreenRegistrar` real do app em `transform: scale(0.5)` (pesado, complicado, custoso pra LCP).
- **Agora:** **phone mockup portrait** com o screenshot estático `mobile-registrar-ia.png` (mesma imagem usada no mobile).

**Por quê:** o PGD Livre é consumido majoritariamente em celular (servidor registrando execução fora do horário, chefia validando entre reuniões, futuro app PárcIA). Mostrar um phone no hero do site institucional comunica essa direção **muito mais explicitamente** do que uma janela de browser desktop.

**Bônus:** as duas versões (desktop e mobile) passam a usar o mesmo asset (`mobile-registrar-ia.png`), eliminando a manutenção de 2 screenshots e melhorando o LCP do desktop drasticamente (sem precisar montar React de novo dentro do hero).

Implementação no SvelteKit: criar um componente `<PhoneFrame>` simples — `360×~760px`, gradient background `#1d2333 → #0B1426`, padding 10px, border-radius 36px externo / 28px interno, notch sutil (`96×22px`, `#0B1426`), drop shadow forte. Recebe imagem como children ou `src` prop.

Já refletido em `landing-screens.jsx` (`HeroScreenAIRewrite`) e `landing-ui.jsx` (`HeroBanner` com grid `1.25fr 0.95fr` e annotations reposicionadas).

---

---

## 1. Por que existe este documento

A Landing v2 foi desenhada para desktop (1440px de canvas). Em mobile real ela quebra em vários pontos:

- Hero com 2 colunas (texto + browser frame com `ScreenRegistrar` em `scale(0.5)`) → vira ilegível abaixo de 900px.
- TopNav com 4 anchors centrais + 3 ações à direita → não cabe na barra.
- Timeline horizontal do ciclo → corta itens.
- Grid 3-col dos selos → cards minúsculos.
- Diagrama de integração side-by-side → fica empilhado de qualquer jeito, mas com proporções erradas.

Não é só "responsive": várias seções precisam **redesenho de layout** (não só `flex-direction: column`).

O protótipo `PGD Livre - Landing Mobile.html` mostra a solução final. Este doc descreve as transformações em ordem de implementação.

---

## 2. Arquivos novos / alterados

| Arquivo | Função |
|---|---|
| `PGD Livre - Landing Mobile.html` | Entry point standalone (preview da página mobile renderizada em viewport real, não em iPhone frame) |
| `landing-mobile-page.jsx` | Componente `ScreenLandingMobilePage` + 7 subcomponentes `MLP*` (Header, Eyebrow, H2, ArqItem, RoadmapItem, Selo, CicloTimeline) |

O bundle desktop (`PGD Livre - Landing.html`) e seu mockup em iPhone frame (`landing-mobile.jsx` · `ScreenMobileLanding`) ficam intocados — servem como referência visual histórica.

**Atenção:** `landing-mobile.jsx` (mockup em frame iOS) ≠ `landing-mobile-page.jsx` (página real). Não confunda. O primeiro vive dentro do design canvas e existe só pra apresentação; o segundo é o que vira `/+page.svelte` no breakpoint mobile.

---

## 3. Estratégia de implementação no SvelteKit

Duas opções viáveis. Recomendo a **A**.

### Opção A · CSS responsivo no mesmo `+page.svelte` (recomendada)

Uma só rota `/`, um só componente, com media queries dividindo as variantes de layout.

**Prós:**
- Sem duplicação de conteúdo
- SEO único (sem `rel=alternate`)
- Server-side render uniforme
- Atualizações de copy não precisam ser feitas em 2 lugares

**Contras:**
- CSS um pouco mais complexo
- Algumas estruturas precisam mudar de DOM, não só de CSS (a timeline vertical do mobile não é a horizontal "rotacionada")

### Opção B · Rota separada `/m` + redirect por user-agent

Não recomendo. Dá problema de SEO, link compartilhado, e duplica manutenção.

---

## 4. Breakpoints

Adote 3 breakpoints. Tudo é mobile-first.

```css
/* base · mobile (até 719px) */
/* tablet/landscape phone */
@media (min-width: 720px)  { /* 2 colunas começam a aparecer */ }
/* desktop pleno */
@media (min-width: 1024px) { /* layout v2 desktop atual */ }
```

A maioria das transformações é entre **base** e **1024px**. O 720px é um meio-termo opcional pra tablets (não desenhei especificamente).

---

## 5. Transformações por seção

### 5.1 · Header / TopNav

**Desktop:** Logo · 4 anchors centrais · Documentação · Repositório · CTA "Acessar demonstração"
**Mobile:** Logo · botão hamburguer

Mobile abre um **drawer** (sob o header, full-width, com `position: absolute; top: 100%`) com:
- 4 anchors da nav (Norma, IA, Conformidade, Arquitetura)
- 2 links externos (Documentação, Repositório) com ícone "↗"
- CTA primária full-width no rodapé do drawer

O header deve ser **sticky** com `backdrop-filter: blur(10px)` sobre o `--c-paper` translúcido (92% opacidade). No protótipo:

```jsx
position: "sticky", top: 0, zIndex: 50,
background: "rgba(252, 251, 248, 0.92)",
backdropFilter: "saturate(180%) blur(10px)",
borderBottom: "1px solid rgba(11,20,38,0.06)",
```

Estado do drawer: `useState(false)`. Fechar ao clicar em qualquer link (`onClick={onToggleMenu}`).

A11y: `aria-expanded`, `aria-label="Abrir menu"`, esc fecha (adicionar — o protótipo não tem).

### 5.2 · Hero

**Desktop:** 2 colunas — texto à esquerda + **phone mockup com a tela real "Registrar execução"** à direita (mobile-first: o produto é consumido majoritariamente em celular).
**Mobile:** 1 coluna.

- H1 usa `font-size: clamp(28px, 8.4vw, 36px)` pra acompanhar o viewport.
- Lede em 15.5px.
- CTAs primário + outline empilhados em coluna, full-width.
- Screenshot do mesmo screenshot mobile (`screenshots/mobile-registrar-ia.png`), exibido em card arredondado com sombra suave — sem chrome de browser (a imagem já contém o header do app).
- Chips abaixo: "IA em produção" (roxo, cheio) + "API PGD Central" + "Gov.br" (chips neutros). Substituem as "anotações flutuantes" do desktop.

### 5.3 · StatBar

**Desktop:** Strip horizontal com 4 stats grandes (números 64px), separadores verticais.
**Mobile:** Grid 2×2 dentro de uma "moldura" arredondada com 1px de gap interno (efeito de divisórias). Números em 28px (ou 20px quando texto, ex: "AGPL", "API").

Implementação no protótipo:

```jsx
display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
background: "rgba(11,20,38,0.08)",
borderRadius: 14, overflow: "hidden",
border: "1px solid rgba(11,20,38,0.06)",
```

Cada célula é `background: var(--c-paper)`; o `gap: 1` revela o fundo escuro como "linha divisória".

### 5.4 · Atendimento à norma

**Desktop:** 2 colunas (sticky título à esquerda + 3 parágrafos à direita).
**Mobile:** 1 coluna, sem sticky. Mantém o eyebrow, H2, 2 parágrafos (condensados — corte o 3º do desktop, ou mantenha — não é crítico) e o cluster de chips legais.

Background `cream` (`--c-paper-2`). Padding vertical 44px no mobile (vs 88px do desktop).

### 5.5 · Ciclo da norma (dark)

**Desktop:** Timeline **horizontal** com 6 etapas + prazos + artigos.
**Mobile:** Timeline **vertical** com:
- Linha vertical contínua à esquerda
- Bolinhas numeradas (1–4 — sim, condensei de 6 pra 4 etapas no mobile)
- Título da etapa em branco
- Prazo em mono ocre logo abaixo
- Descrição em texto branco translúcido

As 4 etapas mobile (em vez das 6 desktop):
1. **Pactuação** — 1º ao 5º dia útil do mês
2. **Execução & Registro** — Durante o mês
3. **Avaliação** — Em até 20 dias úteis do fim do ciclo
4. **Sincronização API Central** — Automática

**Decisão tomada:** condensar pra mobile reduz fadiga e mantém o ponto principal (ciclo completo + sync sem ação manual). Se o time decidir manter as 6, é só estender o array `etapas` em `MLPCicloTimeline`.

### 5.6 · Inteligência generativa

**Desktop:** Sticky left + 1 card grande com IA disponível + 3 RoadmapItems.
**Mobile:** Empilhado. Eyebrow + H2 + lede. Depois:
- Pill verde "Disponível na demonstração"
- Card de "Reescrita assistida" (border roxo) — ícone à esquerda + título à direita, descrição abaixo, chips de templates abaixo
- Pill ocre "Em desenvolvimento"
- 3 RoadmapItems (PárcIA, Resumo, Rascunho c/ tom da chefia)

Sem links externos no card mobile (o desktop tem "Detalhes da reescrita →"). Removi pra reduzir clique perdido. Reativar se quiser.

### 5.7 · Conformidade e padrões

**Desktop:** Grid 3-col com 8 selos (icon grande + título + descrição + status).
**Mobile:** Grid **2-col** com 6 selos. Cortei 2 (Multi-tenant e Acesso via Gov.br) pra não inflar a seção — eles são repetidos implicitamente em outras partes.

Card mobile mais compacto: ícone 36×36 + título inline, descrição abaixo, status pill no rodapé.

Se quiser manter os 8, é trivial — só incluir mais 2 `MLPSelo` no array.

### 5.8 · Arquitetura

**Desktop:** 2 colunas — itens + chips à esquerda, diagrama side-by-side à direita.
**Mobile:** 1 coluna. Itens empilhados (`MLPArqItem` — 4 deles), chips abaixo, diagrama no fim.

Diagrama mobile = 3 blocos verticais empilhados:
1. **Card branco com border azul** "Seu órgão · self-hosted" + Logo
2. **Conector vertical** com setinha pra baixo e label `HTTPS · GraphQL`
3. **Card escuro** "MGI · API PGD Central" com chip "obrigatória"

### 5.9 · Em desenvolvimento (roadmap)

**Desktop:** Grid 2-col com 6 cards.
**Mobile:** Grid 1-col com 5 cards (cortei o "PárcIA" daqui — já aparece na seção IA).

### 5.10 · CTA final (novo, só no mobile)

**Não existe no desktop.** No mobile adicionei uma seção dark final antes do footer:
- Eyebrow "Demonstração pública"
- H2 "Conheça a plataforma com personas reais do PGD."
- Lede curta
- Botão branco full-width "Acessar demonstração →"

A justificativa: no mobile, o usuário pode rolar muito e perder o CTA do hero. O CTA final é uma rede de segurança natural pra mobile.

Se quiser, replique no desktop também. Não é incoerente — mas tampouco é necessário.

### 5.11 · Footer

**Desktop:** 3 colunas de links + créditos + licenças.
**Mobile:** 1 coluna de links em **grid 2-col** (mais denso), créditos em parágrafo único, licenças em chips inline.

---

## 6. Componentes Svelte sugeridos

Cada `MLP*` no JSX vira um `.svelte`:

| Componente JSX | Svelte | Props |
|---|---|---|
| `MLPHeader` | `MobileHeader.svelte` | (gerencia estado interno do drawer) |
| `MLPEyebrow` | `Eyebrow.svelte` | `dotColor?: string`, slot |
| `MLPH2` | reusa `<h2 class="lp-h2">` com modificador `.mobile` | — |
| `MLPArqItem` | `ArqItem.svelte` | `ttl, sub` (reusa do desktop) |
| `MLPRoadmapItem` | `RoadmapItem.svelte` | `ttl, desc, tag?` (reusa do desktop) |
| `MLPSelo` | `SeloConformidade.svelte` | `icon (slot), ttl, sub, status` (reusa) |
| `MLPCicloTimeline` | `CicloTimelineMobile.svelte` | — (estrutura DOM diferente do horizontal) |

Os 3 últimos podem ser os mesmos do desktop com classe modificadora — `.mobile` ajusta tamanhos de ícone e tipografia.

`CicloTimelineMobile.svelte` precisa ser **componente separado** do horizontal, porque a estrutura DOM muda (linha vertical com `position: absolute`, bolinhas com border, layout em flex-row de cada etapa).

---

## 7. Tokens responsivos a adicionar

`landing-tokens.css` hoje só tem tokens estáticos. Sugiro adicionar variáveis específicas pra mobile:

```css
:root {
  /* Mobile padding · usadas dentro de .lp-section quando estreito */
  --lp-section-py-mobile: 44px;
  --lp-section-px-mobile: 20px;

  /* Mobile typography overrides */
  --fz-h1-mobile-min: 28px;
  --fz-h1-mobile-pref: 8.4vw;
  --fz-h1-mobile-max: 36px;
  --fz-h2-mobile: 24px;
  --fz-lede-mobile: 15.5px;
  --fz-body-mobile: 14px;
}

@media (max-width: 719px) {
  .lp-section { padding: var(--lp-section-py-mobile) var(--lp-section-px-mobile); }
  .lp-wrap, .lp-wrap-wide { padding: 0; }  /* o section já cuida do padding */
  .lp-h1 { font-size: clamp(var(--fz-h1-mobile-min), var(--fz-h1-mobile-pref), var(--fz-h1-mobile-max)); line-height: 1.06; letter-spacing: -0.028em; }
  .lp-h2 { font-size: var(--fz-h2-mobile); }
  .lp-lede { font-size: var(--fz-lede-mobile); }
}
```

Os tamanhos foram calibrados no protótipo — copie-os, não chute novos.

---

## 8. A11y · checklist mobile-específico

- [x] Targets táteis ≥ 44×44px (CTAs, botão hamburguer, links do drawer)
- [x] Tipografia mínima ≥ 14px no corpo, ≥ 12px em chips/labels
- [x] Contraste mantido em todos os blocos dark
- [ ] **Drawer hamburguer com `Esc` fechando** — o protótipo não tem; implementar
- [ ] **`aria-modal="true"` no drawer quando aberto + foco trap** — implementar
- [ ] **Indicador de "scroll para mais"** — opcional, mas útil no hero longo
- [ ] **Reduzir motion** — `prefers-reduced-motion` deve eliminar o `backdrop-filter` se causar problema de perf

---

## 9. Performance · checklist mobile

Mobile é onde LCP importa mais. Cuidados:

- [x] **Screenshot do hero em formato responsivo** — gerar `mobile-servidor.png` em 2 tamanhos (1x e 2x) com `srcset`. O protótipo usa 1 imagem só.
- [ ] **`fetchpriority="high"`** no `<img>` do hero
- [ ] **`loading="lazy"`** em todas as outras imagens (screenshots fora do fold)
- [ ] **Preload da fonte Manrope 800** (display) — é o que aparece no H1 do hero
- [ ] **`backdrop-filter` tem custo de GPU** — testar em Android low-end. Se for problema, trocar por fundo sólido.
- [ ] **Drawer aberto** não deve fazer reflow caro — `position: absolute`, sem layout shift do conteúdo principal

---

## 10. Decisões já tomadas no protótipo (não voltar atrás sem motivo)

1. **CTA final extra no mobile** — sim, adicionado. Útil pra rolagem longa.
2. **6 → 4 etapas** na timeline do ciclo (mobile). Mantém o ponto principal sem inflar.
3. **8 → 6 selos** de conformidade no mobile. Cortei Multi-tenant e Gov.br (redundantes).
4. **6 → 5 cards** no roadmap mobile. Cortei "PárcIA" (já aparece em IA).
5. **Drawer hamburguer** em vez de bottom nav ou menu lateral. Padrão familiar e leve.
6. **Sem `ScreenRegistrar` vivo** no mobile — screenshot estático.
7. **Container max-width 640px centralizado** com moldura sombreada acima de 720px. Garante boa visualização no preview desktop sem virar página desktop.
8. **`viewport-fit=cover`** no meta — pra usar safe-area do iPhone.

---

## 11. Decisões em aberto pra Code tomar

1. **Manter o protótipo standalone `landing-mobile-page.jsx` como referência viva no repo?** Sim, recomendo. Move pra `prototypes/` ou `design/`.
2. **Drawer com animação de entrada?** O protótipo entra instantâneo. Considere `transition: transform 200ms ease` deslizando do topo.
3. **CTA final só no mobile ou também no desktop?** Sugiro só no mobile por ora.
4. **A timeline do ciclo deve ter 4 ou 6 etapas no mobile?** Decidi por 4. Reverter se UX preferir todas.

---

## 12. Ordem sugerida de implementação

Em ordem de risco crescente:

1. **Tokens responsivos** em `landing-tokens.css` (adição, não substituição)
2. **Layout fluido base** — todas as seções com `padding` e tipografia responsivos, sem mudar estrutura DOM
3. **TopNav → MobileHeader** com drawer
4. **StatBar** vira grid 2×2 em mobile
5. **Hero** ganha screenshot estático no mobile (substitui o `ScreenRegistrar` em scale)
6. **CicloTimelineMobile** — componente novo, vertical
7. **Diagrama de integração** vira pilha vertical
8. **CTA final** novo, só no mobile
9. **Footer** vira 1-col com grid 2-col interno

Cada passo tem media query isolada (`@media (max-width: 719px)`) — pode ser PR separado.

---

## 13. Como abrir o protótipo

`PGD Livre - Landing Mobile.html` na raiz. Abra em qualquer navegador. Acima de 720px o protótipo aparece com **moldura sombreada** centralizada (não é a página final desktop — é só o preview da página mobile dentro de viewport largo). Abaixo de 720px, ocupa 100% da tela como página real.

Para testar como mobile real:
- DevTools → modo responsivo → iPhone 14 Pro (393×852) ou Pixel 7 (412×915)
- Ou: salve a URL e abra no celular real

---

## 14. O que NÃO foi feito no protótipo

- Animação de entrada do drawer
- `Esc` fechando o drawer
- Trap de foco quando o drawer está aberto
- Reduzir motion via `prefers-reduced-motion`
- `srcset` no screenshot do hero
- Detecção de safe-area pra notch (o `viewport-fit=cover` está, mas o CSS não usa `env(safe-area-inset-*)`)

Tudo isso é "polimento de produção" e pode entrar no PR final antes do deploy.

---

Qualquer dúvida sobre as condensações (timeline 6→4, selos 8→6, roadmap 6→5), me chame. As decisões foram tomadas pensando em **uma única tela longa de mobile**, não num espelho 1:1 do desktop. Se o time discordar, é trivial expandir — o JSX está organizado em arrays curtos no topo de cada subcomponente.
