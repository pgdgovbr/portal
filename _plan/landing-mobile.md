# Plano — Landing Page Mobile (responsividade ≤ 720px)

## Contexto

A landing pública em `/` ([portal/src/routes/+page.svelte](pgdgovbr/portal/src/routes/+page.svelte)) hoje só tem dois breakpoints (`max-width: 900px` e `560px`) feitos para reflowar grids de 2/3-col em 1-col, mas mantém o mesmo DOM e tipografia escalada manualmente. Em mobile real (iPhone 14 Pro 393px, Pixel 7 412px) quebra em vários pontos:

- TopNav esconde as 4 anchors centrais mas mantém 3 CTAs lado-a-lado que estouram a barra
- Timeline horizontal do ciclo quebra em 1-col mas perde o sentido visual de "fluxo"
- Selos de conformidade ficam minúsculos
- Hero não tem screenshot — só texto, sem âncora visual
- Statbar 1-col fica esticado, sem identidade de "moldura"
- Sem CTA secundário após scroll longo

Acabei de produzir um novo design do Claude Design especificamente para mobile. O handoff (`handoff-landing-mobile.md` no bundle baixado) detalha 11 transformações por seção, fazendo **redesenho de layout** (não só `flex-direction: column`) em 4 delas (TopNav, Ciclo, Hero, CTA final).

**Estratégia escolhida:** **Opção A do handoff** — um único `+page.svelte`, mobile-first com media queries dividindo as variantes. Sem rota `/m` separada, sem duplicação de conteúdo, SEO único, SSR uniforme.

**Stack alvo:** SvelteKit 2 · Svelte 5 runes · adapter-node. Tokens em `portal/src/lib/landing.css`.

---

## Direção estética (após revisão `frontend-design`)

**Aesthetic commitment: "Editorial Institucional Contemporâneo"** — referência: caderno impresso de Ministério brasileiro × NYT Magazine × Stripe docs. Refinado, deliberado, gravidade de serviço público combinada com precisão contemporânea.

**Constraints institucionais (NÃO MEXER):**
- Fontes: Public Sans (body) + Manrope (display) — Public Sans é padrão Gov.br e e-Digital. Não trocar.
- Cor primária: `--c-primary: #0F3D8C` (azul Gov.br institucional).
- Paleta editorial existente em `landing.css`: papers cream + ink-editorial deep navy + ocre `--c-accent`. Manter, mas **usar o ocre mais** no mobile como elemento de marca.

**O que torna isso memorável (1 coisa):** o **motion contido com timing editorial** — entradas escalonadas (stagger 60ms), drawer com slide-down ease-out-expo, números do statbar contando up no viewport. Nada decorativo; tudo amplia hierarquia.

**Refinamentos a aplicar (além do handoff):**

1. **Motion (NOVO — handoff não prescreve):**
   - **Hero reveal on load:** H1 → lede → CTAs → chips, com `animation-delay` em stagger de 60ms cada. `translateY(8px) → 0`, opacity `0 → 1`, duração 420ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
   - **Section reveal on scroll:** `IntersectionObserver` adiciona classe `.in-view`; eyebrow + H2 fadeam up 12px → 0 em 380ms. Stagger por filhos quando aplicável (cards, items).
   - **Drawer mobile:** slide-down 240ms `ease-out-expo`; backdrop com fade 200ms; reverse mais rápido (160ms) ao fechar. Links no drawer com stagger 25ms cada.
   - **Statbar:** quando entra no viewport, números numéricos (37, 4) contam de 0 até o valor em 900ms `ease-out-quart`. "AGPL" e "IaC" fadeam normal.
   - **CicloTimelineMobile:** bolinhas numeradas têm `transform: scale(0.85)` inicial, animam para `1.0` com stagger 80ms quando seção entra no viewport.
   - **CTA hover:** seta `→` translate-x +2px com transição 180ms.
   - **Tudo guarded por `@media (prefers-reduced-motion: reduce)`** — vira instantâneo.

2. **Typography refinements:**
   - `font-variant-numeric: tabular-nums` em `.lp-stat-num` (alinhamento perfeito do grid 2×2 do statbar mobile).
   - `font-feature-settings: 'ss01'` no H1 se Manrope suportar (alternativas estilísticas; testar visualmente — fallback grace).
   - Letter-spacing do H1 mobile vai um clique mais apertado: `-0.032em` (em vez de `-0.028em`) — densidade editorial em telas pequenas.
   - `text-wrap: balance` no H1 e H2 (já tem `pretty` em `.lp h1,h2,h3` — mas `balance` é melhor para títulos curtos).

3. **Foco e estados (atmosféricos):**
   - **Custom focus ring institucional:** `outline: 2px solid var(--c-accent); outline-offset: 3px; border-radius: inherit;` para todos os botões e links da landing — substitui o anel azul genérico do browser. O ocre carimba o produto sem comprometer contraste.
   - **Hover de RoadmapItem:** border-color de `rgba(11,20,38,0.08)` → `rgba(11,20,38,0.16)` + sombra discreta `0 4px 12px -8px rgba(11,20,38,0.18)`, transição 200ms.
   - **Hover de PersonaCard (já existe em `/login`)** — não tocar, fora do escopo.
   - **Hamburger button mobile:** quando `aria-expanded="true"`, fundo vira `var(--c-paper-2)` e border `var(--c-ink-editorial)`. Indica estado, não é só toggle visual.

4. **Atmosféricos sutis (low-cost, high-character):**
   - **Subtle paper grain** em sections `.cream`: `background-image` SVG noise embutido em data-URL (~200 bytes), opacity 0.025. Inspirado em impressão offset. Aplicar **apenas em desktop** se rodar mal no Android low-end.
   - **Vinheta sutil na seção CTA final mobile:** `radial-gradient(ellipse at center top, transparent 60%, rgba(0,0,0,0.25))` no background dark — cria foco no botão central sem ser dramático.
   - **Hero browser frame mobile:** `box-shadow: 0 30px 60px -25px rgba(11,20,38,0.30), 0 0 0 1px rgba(11,20,38,0.08)` (já no `.lp-browser`) — aceitar como está; sem perspective 3D (over-design).

5. **Color refinement — usar o ocre mais no mobile:**
   - Chip "IA em produção" no hero mobile: filled `var(--c-status-aval)` (roxo) — handoff dita. **Mantenho.**
   - Drawer hamburger ativo: borda ocre `1px solid var(--c-accent)`.
   - Scroll progress indicator (top de 2px sticky): gradiente `linear-gradient(to right, var(--c-primary), var(--c-accent))` proporcional ao scroll. **Opcional — só se tempo permitir; é o tipo de detalhe que recompensa quem rola até o fim.**

6. **Detalhes do CTA final mobile (handoff §5.10):**
   - O botão branco no fundo escuro pede um halo: `box-shadow: 0 0 0 6px rgba(255,255,255,0.06), 0 12px 24px -12px rgba(0,0,0,0.6)`. Sutil — diz "destino primário" sem gritar.
   - A seta `→` no texto do botão tem `transition: transform 200ms ease-out`; no hover do botão (ou tap-ativo no mobile), `translateX(4px)`.

7. **Decisões de design registradas (para review futuro):**
   - **Drawer com animação** (handoff §11.2 deixou em aberto): vamos com slide-down 240ms `ease-out-expo`. Justificativa: o backdrop-filter blur + slide-down conta a história de "veil sobre conteúdo", consistente com a estética editorial.
   - **CTA final só no mobile** (handoff §11.3): mantido. Desktop já tem hero forte + statbar; mobile rola muito e precisa rede de segurança.
   - **6 → 4 etapas no ciclo mobile** (handoff §11.4): mantido. Storytelling continua intacto.
   - **Custom focus ring com ocre**: decisão minha — ocre é o sinal de "produto", azul Gov.br é institucional. Foco é momento do produto.

Tudo isso é additive ao plano original; nenhum item conflita com as 5 fases já listadas. Vou implementar essas refinements **dentro das fases correspondentes** (Fase 1 absorve tokens novos; Fase 2 absorve animação do drawer; Fase 3 absorve scroll triggers; Fase 4 absorve focus rings e grain).

---

## Pré-requisitos (antes da Fase 1)

1. **Salvar o bundle do design** em `portal/_design/from-claude-design-mobile/`:
   ```bash
   mkdir -p portal/_design/from-claude-design-mobile
   cp -r /tmp/design-landing-mobile/pgd-libre/* portal/_design/from-claude-design-mobile/
   ```
   *(o `_design/from-claude-design/` original fica intocado para histórico)*

2. **Copiar screenshot do hero mobile** para `portal/static/screenshots/`:
   ```bash
   mkdir -p portal/static/screenshots
   cp /tmp/design-landing-mobile/pgd-libre/project/screenshots/mobile-servidor.png portal/static/screenshots/mobile-servidor.png
   ```

3. **Confirmar `prefers-reduced-motion`** já é considerado em `tokens.css` global (se sim, reusar; se não, adicionar no escopo da landing).

---

## Estratégia TDD

Cada componente nova/alterada: Vitest + happy-dom, render + interação. Específico do mobile:

| Camada | Framework | Caminho |
|---|---|---|
| Componente Svelte | Vitest + @testing-library/svelte | `portal/src/lib/components/landing/<X>.test.ts` |
| Drawer interaction (Esc, click outside) | Vitest user-event | `portal/src/lib/components/landing/TopNavLanding.test.ts` |
| Snapshot visual responsivo | Playwright `page.setViewportSize()` | `portal/e2e/landing-mobile.spec.ts` |

**Gate por PR (local):**
- `npm test && npm run check`
- `npm run test:e2e -- landing-mobile.spec.ts` (na PR final)

---

## Fase 1 — Tokens e base responsiva

### 1.1 Adicionar tokens mobile em `landing.css`

Apêndice ao final de [portal/src/lib/landing.css](pgdgovbr/portal/src/lib/landing.css), sem remover nada:

```css
:root {
  /* Mobile padding utilities */
  --lp-section-py-mobile: 44px;
  --lp-section-px-mobile: 20px;

  /* Mobile typography */
  --fz-h1-mobile-min: 28px;
  --fz-h1-mobile-pref: 8.4vw;
  --fz-h1-mobile-max: 36px;
  --fz-h2-mobile: 24px;
  --fz-lede-mobile: 15.5px;
  --fz-body-mobile: 14px;
}

@media (max-width: 719px) {
  .lp-section { padding: var(--lp-section-py-mobile) var(--lp-section-px-mobile); }
  .lp-wrap, .lp-wrap-wide { padding: 0; }
  .lp-h1 {
    font-size: clamp(var(--fz-h1-mobile-min), var(--fz-h1-mobile-pref), var(--fz-h1-mobile-max));
    line-height: 1.06;
    letter-spacing: -0.028em;
  }
  .lp-h2 { font-size: var(--fz-h2-mobile); }
  .lp-lede { font-size: var(--fz-lede-mobile); }
}
```

**Não substituir** os tokens existentes — só adicionar os mobile-specific.

### 1.2 `viewport-fit=cover` no `<svelte:head>`

Verificar `portal/src/app.html` — se houver `<meta name="viewport">` lá, atualizar para incluir `viewport-fit=cover`. Caso contrário, adicionar no `+page.svelte`.

---

## Fase 2 — Componentes alterados

### 2.1 `TopNavLanding.svelte` → drawer mobile

Refatorar [portal/src/lib/components/landing/TopNavLanding.svelte](pgdgovbr/portal/src/lib/components/landing/TopNavLanding.svelte):

- Adicionar `let menuOpen = $state(false)` (Svelte 5 runes)
- Em mobile (≤ 719px): esconder nav e 3 CTAs; mostrar botão hamburguer (40×40px, border-radius 10)
- Drawer com 6 links (Norma, IA, Conformidade, Arquitetura, Documentação, Repositório) + CTA primária full-width
- A11y: `aria-expanded={menuOpen}`, `aria-label="Abrir menu"`, `Escape` fecha, `aria-modal="true"` quando aberto
- Click em link fecha drawer (`onclick={() => (menuOpen = false)}`)

Estilos do drawer seguem `landing-mobile-page.jsx` linhas 50-92:
- `position: absolute; top: 100%; left: 0; right: 0`
- `box-shadow: 0 12px 30px -18px rgba(11,20,38,0.25)`
- Background `var(--c-paper)` sólido

**Testes** (`TopNavLanding.test.ts`):
- `test_drawer_inicia_fechado`
- `test_clique_hamburguer_abre_drawer`
- `test_esc_fecha_drawer`
- `test_clique_em_link_fecha_drawer`
- `test_aria_expanded_reflete_estado`

### 2.2 `CicloTimelineMobile.svelte` — componente novo

Criar `portal/src/lib/components/landing/CicloTimelineMobile.svelte`. **DOM diferente** do horizontal — não é o mesmo com `flex-direction: column`:

- Linha vertical contínua à esquerda (`position: absolute; left: 11px; top: 6px; bottom: 6px; width: 2px`)
- 4 etapas (não 6) — condensação intencional do handoff §5.5:
  1. Pactuação — *1º ao 5º dia útil do mês*
  2. Execução & Registro — *Durante o mês*
  3. Avaliação — *Em até 20 dias úteis do fim do ciclo*
  4. Sincronização API Central — *Automática*
- Bolinha numerada (24×24, ocre, `border: 3px solid var(--c-ink-editorial)` cria efeito de "interromper" a linha)
- Título em branco, prazo em mono ocre, descrição em branco translúcido

Estrutura completa do array em `landing-mobile-page.jsx` linhas 180-185.

Em [+page.svelte](pgdgovbr/portal/src/routes/+page.svelte), trocar condicionalmente:
```svelte
<div class="ciclo-desktop"><ConformidadeTimeline /></div>
<div class="ciclo-mobile"><CicloTimelineMobile /></div>
```
```css
@media (max-width: 719px) {
  .ciclo-desktop { display: none; }
}
@media (min-width: 720px) {
  .ciclo-mobile { display: none; }
}
```

**Testes** (`CicloTimelineMobile.test.ts`):
- `test_renderiza_4_etapas`
- `test_cada_etapa_tem_titulo_prazo_e_desc`

### 2.3 `FooterInstitucional.svelte` — grid 2-col em mobile

Em [portal/src/lib/components/landing/FooterInstitucional.svelte](pgdgovbr/portal/src/lib/components/landing/FooterInstitucional.svelte):

Atualmente o `@media (max-width: 560px)` vira tudo 1-col. Trocar para uma estrutura mais densa em `≤ 719px`:

- Bloco logo + tagline + chips licenças (full-width no topo)
- 2-col grid com 4 colunas de links comprimidas em 2 colunas
- Créditos em parágrafo único

Não precisa criar componente novo — só ajustar CSS no breakpoint `≤ 719px`.

---

## Fase 3 — `+page.svelte` mobile transformations

Trabalhar em [portal/src/routes/+page.svelte](pgdgovbr/portal/src/routes/+page.svelte). Cada transformação em media query isolada `@media (max-width: 719px)`.

### 3.1 Hero — adicionar screenshot mobile

Antes dos chips, adicionar (apenas mobile via CSS):
```svelte
<div class="lp-hero-mobile-shot">
  <div class="lp-browser">
    <div class="lp-browser-bar">
      <span class="lp-browser-dot" style="background: #FF5F57"></span>
      <span class="lp-browser-dot" style="background: #FEBC2E"></span>
      <span class="lp-browser-dot" style="background: #28C840"></span>
      <span class="lp-browser-url">pgd.gov.br</span>
    </div>
    <img
      src="/screenshots/mobile-servidor.png"
      alt="Tela do servidor no PGD Livre"
      fetchpriority="high"
    />
  </div>
</div>
```

```css
.lp-hero-mobile-shot { display: none; }
@media (max-width: 719px) {
  .lp-hero-mobile-shot { display: block; margin: 24px 0 14px; }
}
```

CTAs no mobile: `flex-direction: column`, `width: 100%`, padding `14px`.

Chips no mobile: substituir os 2 atuais ("Aderente à norma", "Inteligência generativa integrada") por 3: "IA em produção" (filled roxo), "API PGD Central", "Gov.br" — usar `display: none` no desktop / mobile conforme variant.

### 3.2 Statbar — 2×2 com moldura em mobile

```css
@media (max-width: 719px) {
  .lp-stat-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: rgba(11,20,38,0.08);
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(11,20,38,0.06);
  }
  .lp-stat-grid > div {
    background: var(--c-paper);
    padding: 18px 14px;
    margin: 0;
  }
  .lp-stat-num { font-size: 28px; }
  .lp-stat-num.text { font-size: 20px; }  /* aplicar em "AGPL" e "IaC" */
}
```

Adicionar `class:text={isNonNumeric}` no `<div class="lp-stat-num">` para os valores "AGPL" e "IaC".

### 3.3 Seção "Norma"

Reduzir padding-y para 44px no mobile via `--lp-section-py-mobile` (já feito na Fase 1.1). Manter texto.

### 3.4 Seção "Ciclo" (dark)

Mantém background `var(--c-ink-editorial)`. Esconder `ConformidadeTimeline`, mostrar `CicloTimelineMobile` (Fase 2.2). Os `ciclo-links` (3 anchors abaixo) ficam ocultos em mobile via:
```css
@media (max-width: 719px) {
  .ciclo-links { display: none; }
}
```

### 3.5 Seção "IA"

Sticky desktop fica `position: static` em mobile (já tem `@media (max-width: 900px)`). Confirmar que continua valendo em 719px. Card de "Reescrita assistida" muda de `flex-direction: row` para `column` (já tem em 560px — verificar e ajustar breakpoint para 719px).

### 3.6 Seção "Conformidade" (cream)

- Mobile: grid `2-col`, **6 selos** (cortar 2 — Multi-tenant e Acesso Gov.br, handoff §5.7)
- Cards menores: ícone 36×36, título inline, status pill no rodapé

Implementação: adicionar `class="desktop-only"` nos 2 selos a esconder; CSS:
```css
@media (max-width: 719px) {
  .selos-grid { grid-template-columns: 1fr 1fr; }
  .selos-grid > .desktop-only { display: none; }
}
```

### 3.7 Seção "Arquitetura"

- `arq-grid` vira 1-col, gap 32px (já tem em 900px — confirmar ainda válido em 719px)
- Diagrama (`.arq-diagram`) vai abaixo dos itens, pilha vertical mantendo os 3 blocos (órgão / conector / MGI). Já funciona — só ajustar paddings internos.

### 3.8 Seção "Roadmap" (cream)

`roadmap-grid` em mobile: 1-col (já tem), **5 cards** (cortar "PárcIA · IA Parceira do Servidor" — já aparece na seção IA, handoff §5.9):
```svelte
<RoadmapItem class="desktop-only" ttl="Aplicativo PárcIA..." />
```

### 3.9 Seção CTA final (NOVA — só mobile)

Antes do `<FooterInstitucional />`, adicionar `<section class="lp-mobile-cta">` que só aparece em mobile:

```svelte
<section class="lp-mobile-cta">
  <span class="lp-eyebrow"><span class="dot acc"></span> Demonstração pública</span>
  <h2>Conheça a plataforma com personas reais do PGD.</h2>
  <p>Em produção, o acesso é via Gov.br. Na demonstração, escolha um perfil e explore o fluxo completo.</p>
  <a href="/login" class="lp-btn lp-mobile-cta-btn">Acessar demonstração →</a>
</section>
```

```css
.lp-mobile-cta { display: none; }
@media (max-width: 719px) {
  .lp-mobile-cta {
    display: block;
    padding: 44px 20px;
    background: var(--c-ink-editorial);
    color: white;
    text-align: center;
  }
  .lp-mobile-cta h2 { color: white; font-size: 24px; margin: 14px 0; }
  .lp-mobile-cta p { color: rgba(255,255,255,0.7); margin-bottom: 22px; }
  .lp-mobile-cta-btn { background: white; color: var(--c-ink-editorial); width: 100%; justify-content: center; }
}
```

Conteúdo exato em `landing-mobile-page.jsx` linhas 562-589.

---

## Fase 4 — Performance e A11y

### 4.1 Performance

- [ ] **`fetchpriority="high"`** no img do hero mobile
- [ ] **`loading="lazy"`** em imagens fora do fold (não há outras na landing por enquanto)
- [ ] **Preload Manrope 800** via `<link rel="preload" as="font">` em `portal/src/app.html` se possível
- [ ] Fallback para `backdrop-filter` em GPU low-end:
  ```css
  @supports not (backdrop-filter: blur(1px)) {
    .lp-topnav { background: var(--c-paper); }
  }
  ```
- [ ] **`srcset`** (1x/2x) do screenshot só se vier a observar gargalo de LCP — opcional na primeira passada

### 4.2 A11y

- [ ] Drawer: `aria-expanded`, `aria-label="Abrir menu"`, `aria-modal="true"` quando aberto
- [ ] `Esc` fecha drawer (listener no `document` enquanto aberto, via `$effect`)
- [ ] Focar primeiro link ao abrir drawer (minimal focus management — trap completo é polimento)
- [ ] Targets táteis ≥ 44×44px nos CTAs e links do drawer
- [ ] `prefers-reduced-motion`: remover `backdrop-filter`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .lp-topnav { backdrop-filter: none; background: var(--c-paper); }
  }
  ```

---

## Fase 5 — Testes E2E e smoke

### 5.1 Playwright `portal/e2e/landing-mobile.spec.ts`

```ts
test('landing renderiza em viewport mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });  // iPhone 14 Pro
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.lp-hero-mobile-shot img')).toBeVisible();
});

test('drawer abre, navega e fecha com Esc', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  const hamburger = page.getByRole('button', { name: /abrir menu/i });
  await hamburger.click();
  await expect(page.getByRole('link', { name: 'Atendimento à norma' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'Atendimento à norma' })).not.toBeVisible();
});

test('timeline mobile tem 4 etapas', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  const etapas = page.locator('.ciclo-mobile .etapa');
  await expect(etapas).toHaveCount(4);
});

test('cta final aparece só em mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  await expect(page.locator('.lp-mobile-cta')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.lp-mobile-cta')).not.toBeVisible();
});
```

### 5.2 Smoke manual

- Chrome DevTools → iPhone 14 Pro (393×852)
- Pixel 7 (412×915)
- Tablet landscape (834×1194 iPad) — verificar entre 720px e 1024px
- iOS/Safari real via local network (se possível)

Verificar: scroll suave, drawer fecha em link, hero img carrega rápido, sem reflow visível, fontes não trocam (FOUT), `backdrop-filter` aplicado no header.

---

## Fase 6 — Revisão Playwright seção-por-seção (NOVA)

Antes de declarar pronto, **Playwright em modo navegação dirigida** para inspeção visual e funcional de **cada seção** da landing nos 3 viewports principais (393, 720, 1440). Não é só E2E de fluxo — é varredura QA.

### 6.1 Spec dedicada `portal/e2e/landing-review.spec.ts`

Para cada combinação `(viewport × seção)`:

1. Navega para `/` no viewport indicado.
2. Scrolla até a seção pelo seletor ou âncora (`#norma`, `#ia`, `#conformidade`, `#arquitetura`).
3. Aguarda `networkidle` + 300ms para animações settle.
4. Tira screenshot full-section com `page.locator('section#X').screenshot({ path: ... })`.
5. Asserta:
   - Nenhum elemento overflow-x na viewport (`document.documentElement.scrollWidth <= window.innerWidth + 1`).
   - Textos não cortados (`elementHandle.evaluate(el => el.scrollWidth <= el.clientWidth)` em headings).
   - Imagens carregaram (`naturalWidth > 0`).
   - Contraste mínimo nos botões primários (via `@axe-core/playwright` rodado por seção).
6. Em **mobile**: também testa interação local da seção:
   - Hero: clica CTA → assert URL `/login`.
   - Ciclo: assert 4 bolinhas visíveis (no horizontal desktop seriam 6).
   - Conformidade: assert exatamente 6 selos visíveis (não 8).
   - Roadmap: assert exatamente 5 cards (não 6).
   - CTA final: assert visível só no mobile, com botão `→ /login`.

### 6.2 Estrutura

```ts
const VIEWPORTS = [
  { name: 'mobile', width: 393, height: 852 },
  { name: 'tablet', width: 720, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const SECTIONS = [
  { id: 'hero',          selector: 'section.lp-hero' },
  { id: 'statbar',       selector: 'section.lp-stat' },
  { id: 'norma',         selector: '#norma' },
  { id: 'ciclo',         selector: 'section.dark[data-section="ciclo"]' },
  { id: 'ia',            selector: '#ia' },
  { id: 'conformidade',  selector: '#conformidade' },
  { id: 'arquitetura',   selector: '#arquitetura' },
  { id: 'roadmap',       selector: 'section[data-section="roadmap"]' },
  { id: 'mobile-cta',    selector: '.lp-mobile-cta', mobileOnly: true },
  { id: 'footer',        selector: 'footer.lp-footer' },
];

for (const vp of VIEWPORTS) {
  test.describe(`landing @${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });
    for (const section of SECTIONS) {
      if (section.mobileOnly && vp.name !== 'mobile') continue;
      test(`section ${section.id} renders cleanly`, async ({ page }) => {
        await page.goto('/');
        const loc = page.locator(section.selector);
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await expect(loc).toBeVisible();
        await loc.screenshot({ path: `e2e/screenshots/landing/${vp.name}/${section.id}.png` });
        // overflow check
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  });
}
```

### 6.3 Asserts específicos por viewport mobile

```ts
test('mobile: timeline tem 4 etapas (não 6)', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  await expect(page.locator('.ciclo-mobile .etapa')).toHaveCount(4);
});

test('mobile: conformidade tem 6 selos visíveis', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  const visibleSelos = page.locator('.selos-grid > *:visible');
  await expect(visibleSelos).toHaveCount(6);
});

test('mobile: roadmap tem 5 cards visíveis', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  const visibleRoadmap = page.locator('.roadmap-grid > *:visible');
  await expect(visibleRoadmap).toHaveCount(5);
});

test('mobile: drawer abre/fecha com Esc, navega', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  await page.getByRole('button', { name: /abrir menu/i }).click();
  await expect(page.getByRole('link', { name: 'Atendimento à norma' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'Atendimento à norma' })).not.toBeVisible();
});

test('mobile: cta final visível e leva a /login', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/');
  const cta = page.locator('.lp-mobile-cta a[href="/login"]');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/login/);
});
```

### 6.4 Axe a11y por seção

```ts
import AxeBuilder from '@axe-core/playwright';

test(`a11y @ section ${section.id}`, async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .include(section.selector)
    .analyze();
  expect(results.violations).toEqual([]);
});
```

*(Se `@axe-core/playwright` não estiver instalado, adicionar `npm i -D @axe-core/playwright` como parte da Fase 6.)*

### 6.5 Output do relatório

- Pasta `portal/e2e/screenshots/landing/{mobile,tablet,desktop}/*.png` com 1 PNG por seção × viewport.
- Resumo no terminal: `30 sections passed, 0 overflow, 0 a11y violations`.
- Em CI: anexar screenshots como artefatos do job (opcional, mas útil para PR review).

### 6.6 Critério "pronto para merge"

- [ ] Todas as 30+ combinações (10 seções × 3 viewports, considerando mobile-only) passam.
- [ ] Zero overflow horizontal em qualquer viewport.
- [ ] Zero violações axe críticas/sérias.
- [ ] Screenshots inspecionados visualmente (5 min — humano olha pra cada). Anota qualquer ajuste em issue.
- [ ] Comparar contra protótipo `PGD Livre - Landing Mobile.html` no Chrome DevTools — diferenças intencionais? Listar.

---

## Ordem de execução (1 PR único)

Conforme `[[feedback_local_first_dev]]`, tudo em um único PR `feat/landing-mobile-responsivo`. Implementar internamente na ordem das fases (1 → 6), commitando em incrementos lógicos para facilitar revisão:

1. Commit 1: pré-requisitos — bundle em `_design/`, screenshot em `static/`, tokens em `landing.css`, viewport-fit (Fase 1)
2. Commit 2: `TopNavLanding` com drawer + animação + `CicloTimelineMobile` novo + testes (Fase 2 + refinamentos)
3. Commit 3: transformações em `+page.svelte` — hero, statbar, secções 3.1-3.8 + motion stagger (Fase 3)
4. Commit 4: CTA final novo + Footer 2-col + perf + a11y + focus rings ocre (Fases 3.9, 4)
5. Commit 5: Playwright E2E spec base + landing-review por seção × viewport (Fases 5 + 6)
6. Commit 6: smoke manual + ajustes finais documentados em commit message

Gate antes de push: `npm test && npm run check && npm run test:e2e`. CI roda os mesmos checks como gate final.

---

## Fora do escopo

- Mobile no `/login` ou `/app` (handoff cobre apenas `/`)
- Animação avançada do drawer (slide-down 200ms) — pode entrar polimento se sobrar tempo
- Foco trap completo (mínimo: focar primeiro link ao abrir)
- Detecção real de safe-area com `env(safe-area-inset-*)` no CSS (só o `viewport-fit=cover` está)
- PWA / manifest / push notifications
- i18n da landing (continua pt-BR)
- Otimização do hero desktop com `ScreenRegistrar` (handoff só fala do mobile)

---

## Decisões em aberto (default conforme handoff)

| Pergunta | Decisão default | Onde reverter |
|---|---|---|
| Manter `landing-mobile-page.jsx` no repo como referência? | Sim, em `portal/_design/from-claude-design-mobile/` | n/a |
| Drawer com animação de entrada? | Não no MVP (instantâneo) | Adicionar `transition: transform 200ms` em PR de polimento |
| CTA final no desktop também? | Não, só mobile | Remover `display: none` no breakpoint desktop |
| Timeline mobile: 4 ou 6 etapas? | **4** (handoff condensou) | Estender `etapas` em `CicloTimelineMobile.svelte` |
| Selos mobile: 6 ou 8? | **6** (corta Multi-tenant + Gov.br) | Remover `.desktop-only` dos 2 selos |
| Roadmap mobile: 5 ou 6? | **5** (corta PárcIA — já aparece em IA) | Remover `.desktop-only` do card PárcIA |

---

## Arquivos críticos

### Criar
- `portal/_design/from-claude-design-mobile/` (cópia do bundle de design)
- `portal/static/screenshots/mobile-servidor.png`
- `portal/src/lib/components/landing/CicloTimelineMobile.svelte`
- `portal/src/lib/components/landing/CicloTimelineMobile.test.ts`
- `portal/e2e/landing-mobile.spec.ts` (E2E fluxos chave — Fase 5)
- `portal/e2e/landing-review.spec.ts` (varredura por seção × viewport — Fase 6)
- `portal/e2e/screenshots/landing/{mobile,tablet,desktop}/*.png` (gerados pelo Fase 6)

### Modificar
- `portal/src/lib/landing.css` (apêndice mobile tokens + media queries base)
- `portal/src/lib/components/landing/TopNavLanding.svelte` (estado drawer + variant mobile)
- `portal/src/lib/components/landing/TopNavLanding.test.ts` (testes drawer)
- `portal/src/lib/components/landing/FooterInstitucional.svelte` (grid 2-col mobile)
- `portal/src/routes/+page.svelte` (todas as transformações Fase 3)
- `portal/src/app.html` (viewport-fit=cover + preload Manrope — opcional)
