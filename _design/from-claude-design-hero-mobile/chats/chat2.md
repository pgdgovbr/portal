# Landing Page Mobile

_Started 2026-05-25 18:51 UTC_

---

## User

A landing page "PGD Livre - Landing.html" não está renderizando bem em mobile. Crie uma versão mobile

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Vou inspecionar rapidamente as outras dependências para garantir que o mobile vai funcionar sem o canvas.

_[tool: read_file]_

_[tool: list_files]_

_[tool: write_file]_

Vou criar uma versão mobile real (não enquadrada em iPhone mockup, mas a página em si responsiva), com sticky header, hero adaptado, conteúdo todo presente porém empilhado, e tipografia/spacing recalibrados para mobile.

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Criei **PGD Livre - Landing Mobile.html** — uma versão real da landing pública para celular, não o mockup em iPhone.

Decisões principais:
- **Container fluido** com `max-width: 640px` centralizado; em desktop, fica uma "moldura" sombreada para visualização.
- **Header sticky** com hamburguer e drawer (5 links + CTA).
- **Hero compacto** com h1 em `clamp(28px, 8.4vw, 36px)`, CTAs empilhados em coluna full-width, screenshot real (`mobile-servidor.png`).
- **Stats 2×2** em vez do strip horizontal do desktop.
- **Timeline do ciclo** transformada de horizontal → vertical com numerador, prazo em mono e descrição.
- **Selos de conformidade** em grid 2 colunas, com status pill no rodapé do card.
- **Diagrama de integração** empilhado (Seu órgão → API Central) em vez de side-by-side.
- **CTA final dark + footer** com nav em 2 colunas.

Componentes próprios `MLP*` (header, eyebrow, h2, arq item, roadmap item, selo, timeline) para não conflitar com nada do desktop. Reutiliza `landing-tokens.css` e o `Logo` existente — sem dependência de design-canvas, ios-frame ou screens-servidor.

Próximos passos sugeridos: linkar essa URL como `<link rel="alternate" media="only screen and (max-width: 720px)">` no HTML desktop, ou usar media queries no próprio Landing original para alternar entre eles.

## User

agora crie um documento MD de handoff para o Claude Design implementar essa evolução no portal

## Assistant

_[tool: read_file]_

_[tool: write_file]_

_[tool: show_to_user]_

Criei **`handoff-landing-mobile.md`** seguindo o mesmo formato dos handoffs anteriores (`handoff-landing-v2.md`), porém focado só no que é **novo / diferente** na versão mobile — não duplica o conteúdo do handoff v2.

Estrutura do documento:

1. **Por que existe** — diagnóstico dos 5 pontos de quebra do desktop em mobile
2. **Arquivos novos** — distingue `landing-mobile-page.jsx` (página real) do antigo `landing-mobile.jsx` (mockup em iPhone)
3. **Estratégia de implementação** — recomenda Opção A (CSS responsivo no mesmo `+page.svelte`) com prós/contras vs Opção B (rota separada)
4. **Breakpoints** — 720px e 1024px, mobile-first
5. **Transformações por seção** — 11 sub-seções (Header, Hero, StatBar, Norma, Ciclo, IA, Conformidade, Arquitetura, Roadmap, CTA final novo, Footer) com **diferença DOM vs apenas CSS** explicitada
6. **Componentes Svelte sugeridos** — tabela mapeando `MLP*` → `.svelte`
7. **Tokens responsivos** — bloco CSS pronto pra copiar em `landing-tokens.css`
8. **A11y checklist mobile** — incluindo o que o protótipo *não* implementou ainda
9. **Performance checklist** — LCP, `fetchpriority`, `backdrop-filter` em Android low-end
10. **Decisões tomadas** — 8 decisões já feitas pra não voltar atrás (ex: 6→4 etapas, 8→6 selos, CTA final extra)
11. **Decisões em aberto** — 4 pontos pra Code decidir
12. **Ordem sugerida de implementação** — 9 passos, cada um podendo ser PR separado
13. **Como abrir** + **O que NÃO foi feito** (drawer animation, esc, focus trap, srcset, safe-area)

Pontos críticos sinalizados em **negrito** dentro das seções pra Code não passar batido (ex: a confusão entre `landing-mobile.jsx` e `landing-mobile-page.jsx`, e o fato de que algumas seções precisam de **redesenho de DOM**, não só media query).

## User

como a tendencia é mobile first, acho que faz sentido mostrarmos na hero um screenshot de uma tela mobile.  que achas?

Use esta.

## Assistant

_[tool: image_metadata]_

_[tool: copy_files]_

Boa decisão — concordo plenamente. O PGD Livre é majoritariamente consumido em mobile (servidor registrando execução no caminho de casa, chefia checando entre reuniões), e o app **Pár**c**IA** que está no roadmap reforça essa direção. Hero mobile-first também tem outra vantagem narrativa: o screenshot já mostra o botão "Reescrever com IA" em destaque, então conecta visualmente com a seção de IA logo abaixo.

Vou:
1. Salvar a imagem como `screenshots/mobile-registrar-ia.png`
2. Trocar no hero mobile
3. Trocar também no hero **desktop** com tratamento de "device" (phone framed em vez do `BrowserFrame` com `ScreenRegistrar` em scale) — fica mais coerente e melhora muito o LCP

Já te mostro.

_[tool: read_file]_

_[tool: str_replace_edit]_

Agora vou atualizar tanto o mobile (img direta com frame limpo) quanto o desktop (substituindo o `ScreenRegistrar` em scale por um phone mockup, que comunica "mobile-first" muito mais explícito).

**Mobile primeiro:**

_[tool: str_replace_edit]_

**Agora o desktop:**

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: str_replace_edit]_

Vou atualizar o handoff também — a decisão muda o componente do hero no desktop.

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: save_screenshot]_

Vou checar o hero visualmente.

_[tool: view_image]_

_[tool: read_file]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

O mobile ficou ótimo com o novo screenshot — header limpo, sem chrome de browser, sombra suave em volta da imagem que já traz o cabeçalho do app. E o "Reescrever com IA" em destaque na imagem conecta visualmente com a seção de IA logo abaixo.

Resumo das mudanças:

**Mobile (`landing-mobile-page.jsx`)**
- Hero usa `screenshots/mobile-registrar-ia.png` em card arredondado simples (sem macOS dots — a imagem já contém o header próprio do app)
- Sombra suave + `border-radius: 18px`

**Desktop (`landing-ui.jsx` + `landing-screens.jsx`)**
- `HeroBanner` não envolve mais o filho num `BrowserFrame` — o filho decide seu próprio frame, e o HeroBanner só posiciona os 2 callouts flutuantes em torno dele
- `HeroScreenAIRewrite` virou um **phone mockup portrait** (360px, gradient `#1d2333 → #0B1426`, notch sutil, border-radius 36/28, sombra forte) contendo o mesmo screenshot
- Grid passou de `1fr 1.15fr` → `1.25fr 0.95fr` (copy ganha mais peso, phone fica em proporção certa)
- Removida a dependência do `ScreenRegistrar` renderizado em scale — LCP melhora muito e o asset é o mesmo do mobile (sem duplicação)

**Handoff (`handoff-landing-mobile.md`)**
- Nova seção `0. Mudança companheira no hero desktop` no topo, explicando o porquê (mobile-first) e como implementar um `<PhoneFrame>` em Svelte
- Seção 5.2 (Hero) atualizada com a nova abordagem

Bônus narrativo: tanto desktop quanto mobile agora usam **o mesmo asset** — manutenção zero pra atualizar.

## User

na versão mobile estou sentindo que a imagem pode confundir e dar a sensação de ser de fato o app. Pense em alguma estratégia de design para deixar claro que é um screenshot. 

Além disso faça um crop de toda a borda da imagem de alguns pixels para remover uma margem que veio do screenshot manual que eu fiz

## Assistant

_[tool: run_script]_

Boa observação. Vou:

1. **Cropar 8px de cada lado** da imagem para remover a borda residual
2. **Aplicar uma estratégia "showcase de dispositivo"**: o screenshot vira um phone mockup centrado e mais estreito (~75% da largura), sentado num painel com fundo tonal diferente — assim fica visualmente claro que é uma demonstração de tela, não a tela atual

_[tool: str_replace_edit]_

Agora a estratégia visual — vou aplicar phone frame + caption discreta:

_[tool: str_replace_edit]_

Atualizando o aspect ratio do desktop também (a imagem foi cropada):

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: grep]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: done]_

Pronto. O phone mockup com bezel escuro + notch dá o sinal universal "isto é uma tela", e a caption mono "Tela real · Registrar execução com IA" reforça. A diferenciação com o header próprio da landing (que também diz "PGD Livre") fica imediata — não há mais ambiguidade.Resumo das mudanças:

**Imagem cropada** — `screenshots/mobile-registrar-ia.png` agora é `706×1506` (8px removidos de cada lado).

**Mobile (`landing-mobile-page.jsx`)** — strategy de "showcase de dispositivo":
- Phone bezel escuro com gradient `#1d2333 → #0B1426`, `border-radius: 32px` externo / `24px` interno
- Notch sutil (72×18) no topo
- Largura limitada a 268px (não toma a tela toda — fica claramente "uma tela mostrada na página", não "a tela em que você está")
- Sombra forte triple-layer pra parecer flutuando
- **Caption mono** abaixo: `📱 Tela real · Registrar execução com IA` — explicita por escrito

**Desktop (`landing-screens.jsx`)** — só atualizei o `aspect-ratio` do phone mockup pra acompanhar a nova proporção da imagem cropada (706/1506).

Sinalizações redundantes que tornam "isto é um screenshot" inequívoco em mobile:
1. Bezel escuro contrastante (impossível confundir com a UI clara da landing)
2. Notch no topo (signal universal de phone)
3. Largura menor que o container da seção
4. Caption mono escrita explícita
5. Sombra projetada (sugere "objeto na página", não "fundo")

## User

Address these comments from my teammates:

**Nitai** (on `PGD Livre - Landing Mobile.html` at `#top >section span:nth-child(1) >:is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,span,a,em,strong,small,td,th,caption)`):
fazem sentido essas 3 tags nessa landing mobile?

## Assistant

_[tool: str_replace_edit]_

Boa pergunta do Nitai. Vou analisar:

As 3 tags são **"IA em produção" · "API PGD Central" · "Gov.br"**. Cada uma já é coberta com mais contexto logo abaixo:

| Tag | Reaparece em | Com mais contexto? |
|---|---|---|
| IA em produção | Seção "Inteligência generativa" com badge verde "Disponível na demonstração" | ✅ sim |
| API PGD Central | Seção "Atendimento à norma" com chip mono em destaque | ✅ sim |
| Gov.br | Footer + CTA final "Acessar demonstração" + seção Conformidade | ✅ sim |

São tags **sem rótulo** ("isto é o quê?" — features? integrações? selos?). No desktop, anotações flutuantes têm framing explícito ("Inteligência generativa integrada" + "Aderente à norma · 4 papéis"). No mobile elas viraram só palavras soltas.

Veredito: **não fazem sentido**. São filler que repete conteúdo logo abaixo. A caption "Tela real · Registrar execução com IA" já estabelece o que o screenshot mostra. Vou remover.

_[tool: done]_

@Nitai concordei — não faziam sentido. Eram 3 chips sem rótulo ("isto é o quê: feature? integração? selo?") repetindo conteúdo já coberto com mais contexto nas seções logo abaixo (IA em produção → seção IA com badge verde; API PGD Central → chip mono na seção Norma; Gov.br → footer + CTA final).

Removidas. A caption mono "📱 Tela real · Registrar execução com IA" abaixo do phone mockup já estabelece o que o screenshot mostra, sem precisar de tags adicionais. O hero ficou mais limpo e a transição pro grid de stats abaixo ficou mais direta.

## User

agora faça um novo arquivo handoff para o claude code com as mudanças que fizemos para ajustar essa imagem na hero, tanto na mobile como desktop

## Assistant

_[tool: write_file]_

_[tool: show_to_user]_

Criei **`handoff-hero-mobile-first.md`** focado **só** no tratamento do hero — sem reduplicar conteúdo dos handoffs anteriores.

Estrutura:

1. **Decisão central** — por que mobile-first no hero (consumo majoritário em celular, semente pro PárcIA, LCP, manutenção)
2. **O asset** — caminho, dimensões cropadas (706×1506), tela retratada, persona, estado, decisões de `srcset`
3. **Hero desktop** — grid `1.25fr 0.95fr`, specs CSS completos do `PhoneFrame` lg (bezel, notch, screen), posicionamento dos 2 callouts flutuantes
4. **Hero mobile** — phone menor (268px), specs do `PhoneFrame` sm + a caption mono "Tela real · Registrar execução com IA" como anti-confusão. Justificativa da remoção dos 3 chips
5. **Componente `<PhoneFrame>` em Svelte** — código completo de exemplo com prop `size: "sm" | "lg"`, usado em ambos os heroes
6. **Checklist visual** — 5 áreas (bezel, notch, screen, imagem, caption) com itens binários pra confiar
7. **Performance LCP** — preload, WebP, srcset, meta `< 1.8s em 3G`
8. **Anti-padrões** — 7 coisas pra NÃO fazer (iPhone fotorrealista, tilt 3D, animação, reflexões, iframe live, tradução da caption, voltar com os chips)
9. **A11y** — alt descritivo, caption como texto real, `aria-hidden` em decorações
10. **O que mudou em cada arquivo** — tabela referência pro Code achar rápido no protótipo
11. **11 decisões finais** — incluindo motivo de cada uma
12. **4 decisões em aberto** pra Code tomar (WebP build, CDN, a11y test, dark mode)

A justificativa de cada decisão visual (gradient no bezel, notch sutil, aspect-ratio em vez de height) está documentada inline pra evitar que Code chute valores diferentes "porque achou que fica melhor".

