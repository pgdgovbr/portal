# Handoff · Landing Page institucional + Login simplificado

> Para o **Claude Code**. Esta é a segunda fase da landing do PGD Livre. Inverteu o tom (mais formal e institucional) e mudou estrutura, identidade visual e fluxo de login. Tudo está em um único bundle HTML estático na raiz: `PGD Livre - Landing.html`.

---

## 1. Resumo do que muda

Comparado à versão anterior:

| Antes | Agora |
|---|---|
| "PGD Libre" | **"PGD Livre"** (PT-BR — em todos os lugares) |
| "Lei", "código aberto", "Open source" | **"Norma", "Software Livre"** (sem exceções) |
| Marca: quadrado com letra | **Marca: três barras horizontais** representando ciclo plano-execução-avaliação |
| Login com Gov.br + Google + Demo | **Login com APENAS demo** (Gov.br fica fora — em produção real é redirect direto, não tela) |
| Comparações com outras soluções | Removidas. Foco em **completude da norma** + **diferenciais técnicos** |
| Tom playful com pitches comerciais | **Tom formal e arrojado**, sem hype |
| Sem destaque para IA | **Seção própria "Inteligência generativa"** com 1 feature disponível + 3 em desenvolvimento |
| Sem conformidade visível | **8 selos de conformidade** (LGPD, WCAG 2.1 AA, e-MAG, e-PING, CSP, Audit, Multi-tenant, Gov.br) |
| Hero com screenshot estático do dashboard | **Hero com o app real renderizando** a tela de Registrar Execução com painel IA ativo |
| Cloud Run / GCP citados | **Sem menção a provedor de nuvem** — só "IaC com Terraform, deploy reproduzível em qualquer nuvem" |

---

## 2. Arquivos do bundle

Tudo na raiz. Para implementação SvelteKit, você lerá esses arquivos como **referência visual** — não copia direto.

```
PGD Livre - Landing.html     ← entry point (carrega React + Babel via CDN)
landing-tokens.css           ← extensão dos tokens com vocabulário editorial (lp-*)
landing-logo.jsx             ← Marca · Variante B (três barras)
landing-ui.jsx               ← TopNav, BrowserFrame, HeroBanner, StatBar
landing-ui2.jsx              ← ConformidadeTimeline (no escuro), SeloConformidade, RoadmapItem, FooterInstitucional
landing-login.jsx            ← LoginDemo (apenas), PersonaCard, PERSONAS do seed
landing-screens.jsx          ← ScreenLanding (página inteira) + ScreenLogin + ScreenAppHandoff + HeroScreenAIRewrite + ArqItem
landing-mobile.jsx           ← Versões mobile · iPhone frames
landing-app.jsx              ← Composição no design canvas (4 seções: Landing, Login, Marca, Mobile)
```

E o protótipo do app continua disponível em `PGD Libre.html` para você embutir telas reais no hero (HeroScreenAIRewrite usa `ScreenRegistrar` do app).

---

## 3. Estrutura final da Landing (`/`)

Long-scroll, 8 blocos:

1. **TopNav** — Logo · 4 anchors (Norma / IA / Conformidade / Arquitetura) · Documentação · Repositório · CTA "Acessar demonstração"
2. **Hero** — H1 forte: _"Gestão de desempenho conforme a norma, com a inteligência do nosso tempo."_ — Browser frame à direita com `ScreenRegistrar` renderizado (estado `editing` da IA). Anotações flutuantes: chip roxo "Inteligência generativa integrada" + card verde "Aderente à norma · 4 papéis".
3. **StatBar** — 37 requisitos · 4 papéis · AGPL-3.0 + CC-BY-4.0 · IaC
4. **Atendimento à norma** — Discurso institucional sobre Decreto 11.072/2022 + IN 24 e 52/2023. Termina com CTA "Saiba mais sobre o Programa de Gestão →"
5. **Ciclo da norma** (dark section) — Timeline horizontal com 6 etapas + prazos da norma + artigos. Termina com 3 links: Pactuação bilateral, Papéis, Glossário.
6. **Inteligência generativa** — Sticky left + 1 card grande à direita:
   - **Disponível na demonstração** (verde): "Reescrita assistida do Registro de Execução" + 4 templates + link "Detalhes da reescrita →"
   - **Em desenvolvimento** (laranja): PárcIA, Resumo automático, Rascunho de avaliação com tom da chefia
7. **Conformidade e padrões** (cream) — 8 selos em grid 3-col: LGPD, WCAG 2.1 AA, e-MAG, e-PING, CSP, Auditoria imutável, Multi-tenant, Acesso via Gov.br
8. **Arquitetura** — 4 itens (Software Livre AGPL/CC-BY, GraphQL desacoplado, IaC Terraform, Workflow com agentes) + diagrama de integração com API PGD Central
9. **Em desenvolvimento** (cream) — Grade 2-col com 6 cards: CSV/JSON/YAML, PDF lote, GitHub Projects, plataformas SaaS, multicanal de notificações, PárcIA
10. **Footer** — Logo + 3 colunas de links (Plataforma, Conceitos do PGD, Jornadas da demonstração) + créditos SGD/SEGES/MGI + licenças

---

## 4. Estrutura final do Login (`/login`)

Tela simplificada — em produção real é redirect direto pro Gov.br, não tela.

- Header: Logo + link "Voltar à página inicial"
- Título: "Demonstração do PGD Livre" + lede explicando que em prod o acesso é via Gov.br
- Link "Ver as jornadas guiadas da demonstração →" (vai pra docs)
- Card único `LoginDemo`:
  - Banner amarelo de aviso (instância demo, dados resetáveis)
  - "Comece por aqui" com 4 personas recomendadas (servidor pactuando, servidor com PT em execução, chefia, gestor)
  - `<details>` colapsável com as outras 6 personas (servidor, chefia, admin)
- Cada `PersonaCard` aciona `GET /auth/dev-login?email=...&name=...&role=...`

---

## 5. Personas do seed (referência)

10 personas mapeadas em `PERSONAS` (em `landing-login.jsx`):

| Email | Nome | Role | Contexto |
|---|---|---|---|
| servidor7@pgd-demo.gov.br | Marta Silva | servidor | Sem plano — pode criar do zero |
| servidor1@pgd-demo.gov.br | **Nitai Bezerra** | servidor | Plano em execução; tem plano anterior para clonar |
| chefe1@pgd-demo.gov.br | Carlos Souza | chefe_imediato | Tem recurso pendente para responder |
| gestor@pgd-demo.gov.br | Maria Fernanda | gestor_unidade | Aprova Plano de Entregas; vê conformidade |
| servidor4@pgd-demo.gov.br | Lucas Ramos | servidor | Plano em rascunho |
| servidor6@pgd-demo.gov.br | Felipe Costa | servidor | Chefia ajustou — aguarda assinatura |
| servidor2@pgd-demo.gov.br | João Santos | servidor | Avaliação aguardando + convocação |
| servidor3@pgd-demo.gov.br | Carla Mendes | servidor | Avaliação nota 2; afastamento encerrado |
| chefe2@pgd-demo.gov.br | Beatriz Lima | chefe_imediato | Plano do Pedro aguardando assinatura dela |
| admin@pgd-demo.gov.br | Roberto Admin | admin | Vê erros de sync com API Central |

Os 4 primeiros aparecem em destaque ("Comece por aqui"); os outros 6 em `<details>` colapsável.

---

## 6. Marca · Variante B (três barras)

```
[ barra preta  longa  ]
[ barra ocre   curta  ]   PGD Livre
[ barra verde  média  ]
```

Componente: `Logo` em `landing-logo.jsx`. Props: `name` (default "PGD Livre"), `onDark` (boolean), `size` ("sm" | "md" | "lg" | "xl").

Cores das barras:
- Top: `var(--c-ink-editorial)` (no light) / `white` (no dark)
- Meio: `var(--c-accent)` (ocre)
- Bottom: `var(--c-success)` (verde)

Wordmark: Manrope 800, letter-spacing -0.018em.

---

## 7. Tokens visuais a copiar

`landing-tokens.css` define o vocabulário editorial complementar aos tokens do app:

```css
--c-paper:         #FCFBF8;   /* off-white quente, fundo da landing */
--c-paper-2:       #F4F2EC;   /* contraste sutil para seções "cream" */
--c-ink-editorial: #0B1426;   /* preto profundo para headings */
--c-accent:        #C77400;   /* ocre — reposicionado como acento editorial */
--c-accent-soft:   #FCF1DC;
--c-accent-deep:   #8A4D00;

--fz-display-xl:   76px;       /* H1 do hero (override para 56px no inline) */
--fz-display-md:   40px;       /* H2 de seção */
--fz-lede:         20px;       /* parágrafo destaque */

--w-content:       1200px;
--w-wide:          1360px;
```

Plus utility classes prefixadas `lp-*`: `lp`, `lp-wrap`, `lp-wrap-wide`, `lp-section`, `lp-section.cream`, `lp-section.dark`, `lp-h1`, `lp-h2`, `lp-h3`, `lp-lede`, `lp-eyebrow`, `lp-btn` (`-primary` | `-outline` | `-govbr` | `-lg` | `-sm`), `lp-chip` (`-legal` | `accent` | `success`), `lp-browser` (frame estilizado).

Não usam Tailwind nem CSS-in-JS. Tudo via tokens + utility classes — fácil de portar pra Svelte.

---

## 8. Rotas a implementar

Mantém o desenho técnico do handoff anterior:

| Rota | Estado | O que faz |
|---|---|---|
| `/` | Pública, sem auth | Renderiza a landing (este handoff) |
| `/login` | Pública, sem auth | Em instâncias com `PUBLIC_DEMO_MODE=true`, mostra o card de demo. Em produção real, **redireciona direto** pra `/auth/login/govbr`. |
| `/app` ou `/dashboard` | Autenticada | O que hoje é `/` no portal — apenas mover de rota |
| `/auth/login/govbr` | Backend | Já existe |
| `/auth/dev-login` | Backend, só em modo demo | Já existe |

Importante: **remover toda referência a Google OAuth** das telas oficiais. O Google ficou só pra dev/teste local; não aparece em UI.

---

## 9. Links da documentação integrados

A landing referencia 11 páginas da [documentação publicada](https://pgdgovbr.github.io/docs/):

| Seção da landing | Link | Destino |
|---|---|---|
| TopNav | "Documentação" | `/` (raiz da docs) |
| Hero | "Ver documentação" | `/` (raiz da docs) |
| Atendimento à norma | "Saiba mais sobre o Programa de Gestão →" | `/conceitos/programa/` |
| Ciclo da norma | "Sobre a pactuação bilateral →" | `/conceitos/pactuacao-bilateral/` |
| Ciclo da norma | "Papéis e responsabilidades →" | `/conceitos/papeis/` |
| Ciclo da norma | "Glossário do PGD →" | `/conceitos/glossario/` |
| Card IA (reescrita) | "Detalhes da reescrita →" | `/servidor/registrar-execucao/` |
| Login | "Ver as jornadas guiadas da demonstração →" | `/demo/acesso/` |
| Footer · Plataforma | "O que é o PGD Livre" | `/sobre/pgd-libre/` |
| Footer · Plataforma | "Repositório" | `https://github.com/pgdgovbr` |
| Footer · Conceitos do PGD | 4 links | `/conceitos/{programa,pactuacao-bilateral,papeis,glossario}/` |
| Footer · Jornadas da demonstração | 4 links | `/demo/{acesso,jornada-servidor,jornada-chefia,jornada-gestor}/` |

Todos os links externos abrem na mesma janela (sem `target="_blank"` por enquanto — sinaliza se quiser mudar).

---

## 10. Decisões já feitas (não voltar atrás)

1. **Marca** — Variante B (três barras) é final. O ponto verde no canto do quadrado das versões anteriores foi descartado.
2. **Nome** — "PGD Livre" (PT-BR), em todos os lugares. Sem "Libre".
3. **Sem Google** — em nenhuma tela pública, em nenhum diagrama de integração.
4. **Sem "em produção"** — o sistema ainda não está no MGI. Tudo é "em construção" ou "disponível na demonstração".
5. **Sem cloud provider** — nada de "Cloud Run", "GCP", "AWS". Só "IaC com Terraform · qualquer nuvem".
6. **"Norma", não "Lei"** — Decreto e Instruções Normativas são "Norma".
7. **"Software Livre", não "Open Source"** — sempre. Inclui chips, headings e copy.
8. **Licenças** — AGPL-3.0 para código + CC-BY-4.0 para conteúdo/docs. Visíveis no footer.
9. **Hero IA** — usa `aiInitialState="editing"` (mais limpo) e não `"previewing"`.
10. **Tom** — institucional formal mas arrojado. CTAs fortes são bem-vindos; pitches comerciais não.

---

## 11. Compatibilidade SvelteKit

Conversão direta dos componentes React do bundle para Svelte 5:

| React (no bundle) | Svelte (a criar) |
|---|---|
| `<Logo size onDark name>` | `<Logo size onDark name />` props equivalentes |
| `<TopNavLanding>` | `<TopNavLanding />` — links são apenas anchors estáticos |
| `<HeroBanner>{children}</HeroBanner>` | `<HeroBanner><slot /></HeroBanner>` |
| `<BrowserFrame url>{children}</BrowserFrame>` | `<BrowserFrame url><slot /></BrowserFrame>` |
| `<ConformidadeTimeline />` | `<ConformidadeTimeline />` — array hardcoded de 6 steps |
| `<SeloConformidade icon ttl sub status />` | igual |
| `<RoadmapItem ttl desc tag />` | igual |
| `<ArqItem ttl sub />` | igual |
| `<FooterInstitucional />` | igual |
| `<PersonaCard persona recommended />` | igual |
| `<LoginDemo />` | igual |

**`HeroScreenAIRewrite`** merece atenção: é o `ScreenRegistrar` do app embutido com `transform: scale(0.5)` e `aiInitialState="editing"`. Na implementação SvelteKit, você pode:
- Opção A (mais simples): substituir por um **screenshot estático** da tela renderizada em `editing`
- Opção B (mais "viva"): renderizar a tela real do app em `<iframe>` ou via subrota — só não inclui SSR pra evitar peso no LCP

Recomendo **opção A** para a landing. O componente vivo é só visual aqui, não interativo (`pointer-events: none`).

---

## 12. Acessibilidade · checklist

- [x] Headings hierárquicos (h1 → h2 → h3, sem pulos)
- [x] Contrastes validados (preto editorial sobre off-white passa AAA; chips coloridos passam AA)
- [x] Foco visível em links e botões (browser default + outline cor primária)
- [x] Texto alt em imagens (em screenshots)
- [x] Sem dependência de cor pra transmitir significado (chips têm ícone + texto)
- [ ] **Validar com axe-core na build** — não rodei localmente
- [ ] **Testar com leitor de tela** (NVDA / VoiceOver) — feedback humano

---

## 13. SEO e meta tags

Não desenhei meta tags no bundle (é canvas, não página real). Para a versão Svelte, sugerir:

```html
<title>PGD Livre · Software Livre para o Programa de Gestão e Desempenho</title>
<meta name="description" content="Plataforma de software livre aderente ao Decreto 11.072/2022 e às IN 24/2023 e 52/2023. Da pactuação bilateral ao envio à API PGD Central do MGI.">
<meta name="author" content="Secretaria de Governo Digital (SGD) · Ministério da Gestão e da Inovação">
<meta name="keywords" content="PGD, Programa de Gestão e Desempenho, Decreto 11.072, gov.br, software livre, AGPL">
<meta property="og:title" content="PGD Livre">
<meta property="og:description" content="Gestão de desempenho conforme a norma, com a inteligência do nosso tempo.">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:image" content="/og-image.png">
<link rel="canonical" href="https://pgd.example.gov.br/">
```

OG image: gerar um a partir do hero (1200×630).

---

## 14. Performance · checklist

- [x] Sem vídeo no fold (LCP < 2s alcançável)
- [x] Fonts via `@import` de Google Fonts (Manrope + Public Sans)
- [ ] **Preload critical fonts** na build Svelte
- [ ] **Lazy-load** screenshots abaixo do fold
- [ ] **Otimizar PNG** dos screenshots (atualmente em `screenshots/` no protótipo — devem virar WebP/AVIF na implementação)
- [ ] **SSR** da landing inteira

---

## 15. Ordem sugerida de implementação

Em PRs separados pra reduzir risco:

1. **Mover dashboard** de `/+page.svelte` → `/app/+page.svelte`. Atualizar `+layout.server.ts` para tratar rotas públicas vs privadas. Redirect pós-login → `/app`.
2. **Criar tokens da landing** — copiar `landing-tokens.css` para `app.css` (ou módulo separado). Validar que o vocabulário `lp-*` não conflita com o existente.
3. **Componentes atômicos** — `Logo.svelte` (Variante B), `TopNavLanding.svelte`, `Footer.svelte`. Cada um com testes.
4. **Componentes de conteúdo** — `ConformidadeTimeline.svelte`, `SeloConformidade.svelte`, `RoadmapItem.svelte`, `ArqItem.svelte`, `BrowserFrame.svelte`.
5. **`/+page.svelte`** — montar a landing inteira usando os componentes.
6. **`/login/+page.svelte`** — montar a tela de demo. Garantir que em produção real (`PUBLIC_DEMO_MODE` falso) ela redireciona pra `/auth/login/govbr`.
7. **Componentes da demo** — `PersonaCard.svelte`, `LoginDemo.svelte`. Conectar ao `/auth/dev-login` existente.
8. **Mobile responsivo** — media queries no CSS; layout do hero vira 1 coluna abaixo de 900px.
9. **SEO + meta tags + OG image** — última etapa, depois que copy estiver estabilizada.
10. **Validação axe-core + leitor de tela** — antes do deploy.

---

## 16. Decisões em aberto pra você (Code) tomar

1. **`/app` ou `/dashboard`?** — Sugeri `/app` (curto, claro). Confirme antes de fazer todas as referências.
2. **Logo SVG separado vs componente** — Para o `<title>` da página e og-image, vamos precisar de um SVG estático. Posso gerar se quiser.
3. **Política de cookies / aviso LGPD** — A landing não tem cookies próprios (e o uso de fonts CDN é leve). Confirma se precisa de banner.
4. **Imagens vs componentes vivos no hero** — Recomendei screenshot estático (opção A na §11). Confirme.

---

## 17. O que NÃO está no bundle (não esquecer na implementação)

- 404 / 500 pages com o mesmo visual da landing
- Sitemap.xml + robots.txt
- `og-image.png` (1200×630)
- Favicons (16, 32, 192, 512, apple-touch-icon)
- Analytics — definir antes de deploy

---

## 18. Como abrir o protótipo

`PGD Livre - Landing.html` na raiz. Abra em qualquer navegador. Use o pan/zoom do canvas pra ver as seções. Os artboards são:

- **Landing · full-page** — landing inteira (≈5800px)
- **Login · viewport completo** — tela `/login`
- **/app · referência** — só placeholder; o design da app não muda
- **Marca em uso · light e dark** — todos os tamanhos da Variante B
- **Mobile · Landing** e **Mobile · Login** — iPhone frames

---

Qualquer dúvida sobre intenção ou comportamento, me chame. Não invente; o handoff prefere ser explícito ao invés de adivinhar.
