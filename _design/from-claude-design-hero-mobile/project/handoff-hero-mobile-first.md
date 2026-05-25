# Handoff · Hero mobile-first (desktop + mobile)

> Para o **Claude Code**. Complemento aos handoffs [`landing-v2`](./handoff-landing-v2.md) e [`landing-mobile`](./handoff-landing-mobile.md). Documento focado **apenas no hero** — mudou a estratégia visual em ambas as versões (desktop e mobile). O resto da landing fica como já documentado.

---

## 1. A decisão central

**O hero agora mostra um phone mockup com uma tela real do produto.** Em desktop e em mobile. Mesmo asset, mesmo tratamento visual base, escalas diferentes.

**Por quê:**
1. O PGD Livre é **majoritariamente consumido em celular** — servidor registrando execução no caminho de casa, chefia validando entre reuniões. O hero deve refletir isso.
2. O roadmap inclui o **app PárcIA** (IA Parceira do Servidor, app nativo). Mostrar mobile no hero já planta a semente.
3. **LCP**: a versão anterior do desktop renderizava o `ScreenRegistrar` real do app em `transform: scale(0.5)` dentro de um browser frame. Custoso. Trocar por imagem estática melhora drasticamente.
4. **Manutenção**: uma única imagem serve desktop e mobile. Zero duplicação.

---

## 2. O asset

| Campo | Valor |
|---|---|
| Caminho | `screenshots/mobile-registrar-ia.png` |
| Dimensões | 706×1506 (já cropado — original era 722×1522, removi 8px de cada lado pra eliminar margem residual do screenshot manual) |
| Aspect ratio | `706 / 1506` (≈ 0.469, ou ≈ 21.4 : 45.7) |
| Tela retratada | `/meu-plano/registrar` — wizard, passo 2 ("Descrição da execução"), com o botão "Reescrever com IA" visível em destaque |
| Persona | Ana (Servidora) — `AS` no avatar |
| Estado da IA | Aguardando preencher o textarea — o botão "Reescrever com IA" está visível mas inativo |

**Decisão deliberada**: o screenshot está num estado "antes da IA agir" para que o usuário entenda a affordance. Se trocarmos por estado "depois" (com o painel de reescrita aberto), perdemos a captura clara do botão lilás.

**Na implementação SvelteKit**: gerar 2 tamanhos com `srcset` (`706w` e `1412w`) e usar `loading="eager"` + `fetchpriority="high"`. Considerar versão WebP/AVIF.

---

## 3. Hero · DESKTOP

### Estrutura

Layout em 2 colunas com grid `1.25fr 0.95fr` (copy ganha mais peso; phone ocupa a coluna direita centralizado).

```
[ Copy column ──────────────────── ]   [ Phone mockup ]
  Eyebrow                                   ▄▄▄▄▄
  H1 (56px, 2 linhas)                      █     █
  Lede (19px)                              █ img █
  [Primary CTA] [Outline CTA]              █     █
  ─────────────                             █     █
  Implementação SGD · Plataforma SEGES      ▀▀▀▀▀
```

### O Phone Mockup (desktop)

**Componente novo a criar em Svelte**: `<PhoneFrame size="lg">`. Especificação:

```css
/* Wrapper externo · bezel do device */
width: 360px;
padding: 10px;
border-radius: 36px;
background: linear-gradient(180deg, #1d2333 0%, #0B1426 100%);
box-shadow:
  0 40px 80px -30px rgba(11,20,38,0.45),
  0 18px 40px -18px rgba(11,20,38,0.30),
  0 0 0 1px rgba(11,20,38,0.10);
position: relative;
```

```css
/* Notch · ilha no topo */
position: absolute;
top: 18px;
left: 50%;
transform: translateX(-50%);
width: 96px;
height: 22px;
border-radius: 12px;
background: #0B1426;
z-index: 2;
```

```css
/* Tela interna · contém a imagem */
border-radius: 28px;
overflow: hidden;
background: white;
aspect-ratio: 706 / 1506;
```

### Anotações flutuantes (mantidas, mas reposicionadas)

A versão anterior tinha 2 callouts posicionados em relação ao browser frame (que era mais largo). Agora estão posicionados em relação à coluna direita inteira (não à phone), pra não invadirem o bezel:

```css
/* "Inteligência generativa integrada" · pill roxo, top-right */
position: absolute;
top: 64px;
right: 0;
z-index: 2;
/* estilo: background var(--c-status-aval), color white, padding 9px 14px, border-radius 999px */
```

```css
/* "Aderente à norma · 4 papéis" · card branco, bottom-left */
position: absolute;
bottom: 64px;
left: 0;
z-index: 2;
/* estilo: background white, padding 13px 18px, border-radius 12px, shadow + 1px border */
```

### Mudança no `HeroBanner`

O componente desktop `<HeroBanner>` **não envolve mais o filho num `<BrowserFrame>`**. Agora apenas:

1. Renderiza a coluna copy
2. Renderiza um wrapper `position: relative` com `{children}` no centro
3. Posiciona os 2 callouts em volta

A consequência: o componente filho (`<HeroScreenAIRewrite>`) decide seu próprio "frame" — agora é o `<PhoneFrame>`. Antes era o `<BrowserFrame>` injetado pelo pai.

---

## 4. Hero · MOBILE

### Estrutura

Layout em 1 coluna empilhada:

```
[ Eyebrow ]
[ H1 grande (clamp 28-36px) ]
[ Lede ]
[ Primary CTA full-width ]
[ Outline CTA full-width ]
   ↓ centered showcase ↓
   [ Phone mockup menor ]
   "📱 Tela real · Registrar execução com IA"
```

### O Phone Mockup (mobile)

Mesma anatomia do desktop, **menor**:

```css
/* Wrapper externo */
width: 100%;
max-width: 268px;
padding: 8px;
border-radius: 32px;
background: linear-gradient(180deg, #1d2333 0%, #0B1426 100%);
box-shadow:
  0 28px 60px -24px rgba(11, 20, 38, 0.45),
  0 12px 28px -14px rgba(11, 20, 38, 0.25),
  0 0 0 1px rgba(11, 20, 38, 0.10);
position: relative;
```

```css
/* Notch */
top: 14px;
width: 72px;
height: 18px;
border-radius: 10px;
background: #0B1426;
```

```css
/* Tela interna */
border-radius: 24px;
aspect-ratio: 706 / 1506;
```

**Largura máxima 268px** — propositalmente menor que o container. Isso é a chave da estratégia visual.

### A caption explícita (anti-confusão)

**Decisão crítica:** o screenshot, sozinho, gerou ambiguidade — o testador sentiu que podia ser confundido com o app real (especialmente porque o screenshot já contém um header com "PGD Livre", igual à landing). Para resolver, adicionei:

```jsx
<div style={{
  display: "inline-flex", alignItems: "center", gap: 7,
  fontSize: 10.5, color: "var(--c-muted)",
  fontFamily: "var(--ff-mono)",
  letterSpacing: ".04em",
}}>
  <svg /* ícone de phone */ />
  Tela real · Registrar execução com IA
</div>
```

A caption fica **logo abaixo do phone mockup**, em mono uppercase pra acentuar o caráter de "rótulo técnico". Junto com o bezel escuro e o notch, três sinais redundantes garantem que o usuário entende "isto é uma demonstração, não a UI ativa".

### Decisões removidas

A versão anterior do mobile tinha 3 chips abaixo do hero — **"IA em produção"**, **"API PGD Central"**, **"Gov.br"**. **Foram removidos.** Motivos:

1. Sem rótulo categórico ("isto é o quê — feature? integração? selo?")
2. Cada um é coberto com mais contexto nas seções logo abaixo (IA em produção → "Inteligência generativa" com badge verde; API PGD Central → chip mono em "Atendimento à norma"; Gov.br → CTA final + footer)
3. A caption do phone já estabelece o que o screenshot mostra — não precisa de tags adicionais

Não recriar.

---

## 5. Componente `<PhoneFrame>` em Svelte (sugestão)

Um componente reusável que serve desktop e mobile:

```svelte
<!-- PhoneFrame.svelte -->
<script>
  /** @type {"sm" | "lg"} — sm para mobile (268px), lg para desktop (360px) */
  export let size = "lg";

  $: dims = size === "lg"
    ? { width: 360, padding: 10, radius: 36, inner: 28, notchTop: 18, notchW: 96, notchH: 22 }
    : { width: 268, padding: 8,  radius: 32, inner: 24, notchTop: 14, notchW: 72, notchH: 18 };
</script>

<div class="phone-frame"
  style:max-width="{dims.width}px"
  style:padding="{dims.padding}px"
  style:border-radius="{dims.radius}px">
  <div class="phone-notch"
    style:top="{dims.notchTop}px"
    style:width="{dims.notchW}px"
    style:height="{dims.notchH}px" />
  <div class="phone-screen"
    style:border-radius="{dims.inner}px">
    <slot />
  </div>
</div>

<style>
  .phone-frame {
    width: 100%;
    background: linear-gradient(180deg, #1d2333 0%, #0B1426 100%);
    box-shadow:
      0 40px 80px -30px rgba(11,20,38,0.45),
      0 18px 40px -18px rgba(11,20,38,0.30),
      0 0 0 1px rgba(11,20,38,0.10);
    position: relative;
  }
  .phone-notch {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #0B1426;
    border-radius: 10px;
    z-index: 2;
  }
  .phone-screen {
    overflow: hidden;
    background: white;
    aspect-ratio: 706 / 1506;
  }
  .phone-screen :global(img) {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
```

E o uso:

```svelte
<!-- Desktop hero -->
<PhoneFrame size="lg">
  <img src="/screenshots/mobile-registrar-ia.png"
       alt="Servidor registrando execução com apoio da IA"
       fetchpriority="high"
       loading="eager" />
</PhoneFrame>

<!-- Mobile hero -->
<PhoneFrame size="sm">
  <img src="/screenshots/mobile-registrar-ia.png"
       alt="Servidor registrando execução com apoio da IA"
       fetchpriority="high"
       loading="eager" />
</PhoneFrame>
<p class="phone-caption">
  <svg><!-- phone icon --></svg>
  Tela real · Registrar execução com IA
</p>
```

Centrar o phone no container mobile com `flex-direction: column; align-items: center`.

---

## 6. Especificações do mockup · checklist visual

Ao implementar, conferir 1 por 1:

### Bezel
- [ ] Gradient `linear-gradient(180deg, #1d2333 0%, #0B1426 100%)` — não um cinza chapado
- [ ] `box-shadow` triple-layer (drop pesado em baixo + drop médio + 1px ring) — não single shadow
- [ ] Border-radius diferente do screen interno (externo > interno) — cria a ilusão de espessura do device

### Notch
- [ ] `position: absolute` em relação ao bezel, não ao screen
- [ ] Cor `#0B1426` (igual ao final do gradient do bezel) — faz o notch desaparecer no escuro do bezel
- [ ] Width proporcional ao tamanho (`96px` lg, `72px` sm) — não fixo

### Screen
- [ ] `aspect-ratio: 706 / 1506` — não `height: auto` com width livre. Trava a proporção.
- [ ] `overflow: hidden` no screen — o `border-radius` interno só funciona se o overflow cortar a imagem.

### Imagem
- [ ] `width: 100%; display: block; height: auto;` — deixa o aspect-ratio do parent governar.
- [ ] `loading="eager"` + `fetchpriority="high"` na versão do hero (LCP).

### Caption (só mobile)
- [ ] Mono (`var(--ff-mono)`), `font-size: 10.5px`, cor `var(--c-muted)`
- [ ] Ícone de phone (SVG inline ~11×11px) à esquerda do texto
- [ ] Texto **literal**: `"Tela real · Registrar execução com IA"` — não traduzir, não encurtar
- [ ] Espaçamento `gap: 12px` entre o phone e a caption no eixo vertical

---

## 7. Performance · LCP

O hero é o LCP da landing. Cuidados:

1. **Preload da imagem no `<head>`**:
   ```html
   <link rel="preload" as="image"
         href="/screenshots/mobile-registrar-ia.png"
         fetchpriority="high">
   ```
2. **Servir em WebP** (com fallback PNG via `<picture>`)
3. **2 resoluções** (`706w`, `1412w` via `srcset`) — DPR-aware
4. **Não usar `transform: scale()` em nada do hero** — quebra LCP
5. **Fonte do H1 (Manrope 800) preloaded também** — `<link rel="preload" as="font" type="font/woff2" crossorigin>`

Meta de LCP: < 1.8s em 3G simulado.

---

## 8. Como NÃO implementar (anti-padrões)

❌ **Não usar um device frame "iPhone realista"** com botões físicos, alto-falante, câmera. Polui a atenção. O bezel limpo + notch sutil basta.

❌ **Não tiltar o phone** ("3D perspective" rotation). Vai contra a estética editorial sóbria do projeto. Phone reto.

❌ **Não animar (`float`, `tilt`, `parallax`)** no hero. O conteúdo é institucional, não consumer. Movimento só atrapalha.

❌ **Não adicionar reflexão/glare** no screen. Cai na estética AI-slop.

❌ **Não substituir o screenshot por um `<iframe>` do app real** em produção. O custo de LCP não compensa.

❌ **Não traduzir a caption** ("Real screen · ...") — mantém PT-BR.

❌ **Não voltar com os 3 chips ("IA em produção" / "API PGD Central" / "Gov.br")** que existiam antes. Redundantes com o conteúdo abaixo.

---

## 9. Acessibilidade

- [ ] `<img>` com `alt` descritivo: `"Servidor registrando execução com apoio da IA"` — não `"screenshot"` nem `"phone"` (são ruído pra leitor de tela)
- [ ] A caption "Tela real · Registrar execução com IA" é texto real (não `aria-label`) — leitor de tela lê.
- [ ] O notch e o bezel são puramente decorativos → `aria-hidden="true"` nos dois elementos
- [ ] Ícone SVG na caption: `aria-hidden="true"` (a palavra "Tela" já diz tudo)

---

## 10. O que mudou em cada arquivo do protótipo (referência)

| Arquivo | Mudança |
|---|---|
| `screenshots/mobile-registrar-ia.png` | **Novo asset** · 706×1506 (cropado de 722×1522) |
| `landing-mobile-page.jsx` | Hero substituído: phone bezel + screenshot + caption. 3 chips removidos. |
| `landing-screens.jsx` · `HeroScreenAIRewrite` | Era `ScreenRegistrar` em scale. Agora é `<div>` com phone bezel + screenshot estático. |
| `landing-ui.jsx` · `HeroBanner` | Removido o wrap `<BrowserFrame>` ao redor de `{children}`. Grid mudou de `1fr 1.15fr` → `1.25fr 0.95fr`. Posições dos callouts ajustadas. |

---

## 11. Decisões finais (não voltar atrás)

1. **Asset único** para desktop e mobile · `mobile-registrar-ia.png`, 706×1506
2. **Mesmo `<PhoneFrame>` em 2 tamanhos** (`sm` 268px / `lg` 360px) — não 2 componentes diferentes
3. **Caption no mobile, sem caption no desktop** — no desktop os 2 callouts flutuantes já fazem o trabalho de "isto é o produto, com IA, aderente à norma"
4. **Sem chips no hero do mobile** — removidos. Cobertos com mais contexto nas seções abaixo
5. **Gradient `#1d2333 → #0B1426` no bezel** — não preto chapado. Dá profundidade
6. **Notch sim, bordas físicas do device não** — bezel minimalista, não fotorrealista
7. **`aspect-ratio` no screen, não height fixo** — protege contra crops futuros do asset
8. **`fetchpriority="high"` na imagem do hero** — é o LCP

---

## 12. Decisões em aberto pra Code tomar

1. **Versão WebP/AVIF do screenshot** — gerar na build ou pre-gerar manualmente?
2. **Servir o screenshot por CDN vs estático local** — se for CDN, garantir CORS e cache headers.
3. **A11y test com leitor de tela mobile (TalkBack/VoiceOver)** — confirmar que a ordem de leitura faz sentido: H1 → lede → CTAs → "Tela real · Registrar execução com IA" + alt do screenshot.
4. **Variante dark mode do mockup** — se a landing ganhar dark mode, o phone bezel já é escuro; só verificar o contraste da caption.

---

Qualquer dúvida sobre o porquê de uma especificação, me chame. As decisões foram tomadas em iteração — não chute valores diferentes.
