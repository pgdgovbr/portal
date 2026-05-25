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

