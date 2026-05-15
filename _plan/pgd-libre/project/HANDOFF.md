# Handoff: PGD Libre — Design → Implementação

Acabei de finalizar a fase de design do frontend do PGD Libre em um protótipo HTML/React (apenas referência visual — você implementará em **SvelteKit + GraphQL** conforme `_projeto/05-frontend-briefing.md`).

## O que está pronto no protótipo

**25 telas desktop + 5 telas mobile + 2 componentes em destaque**, organizadas em 8 seções de um design canvas, cobrindo todos os papéis e prioridades do briefing (P0, P1 e parte do P2):

### Fluxo do Servidor (Ana) — 6 telas
1. Dashboard do servidor (banner de urgência, plano ativo, avaliação recebida, próximos prazos)
2. Meu Plano de Trabalho (KPIs do plano, contribuições, histórico de períodos)
3. Registrar Execução (wizard 4 steps com auto-save, vinculação a contribuições)
4. Detalhe de avaliação publicada (nota grande, justificativa, contexto)
5. Contestar Avaliação / Recurso
6. Primeiro acesso (servidor sem plano — onboarding e FAQ)

### Fluxo da Chefia (Carlos) — 6 telas
7. Dashboard da chefia (KPIs do time, avaliações priorizadas, plano de entregas)
8. Lista da Equipe (12 servidores, 3 visualizações: tabela/kanban/cards)
9. **Plano de Entregas** — criar/editar entregas da unidade, com vínculos a contribuições
10. Detalhe do Plano de Trabalho (visão da chefia, contribuições, histórico)
11. Avaliar Registro (split-view: descrição read-only + form de avaliação)
12. **Perfil completo do Participante** — header com avatar, abas Visão Geral / Planos / Avaliações / TCR / Afastamentos

### Wizard Criar Plano de Trabalho — 5 steps
13–17. Participante & período → Carga horária → Critérios → Contribuições (com barra empilhada, soma deve ser 100%) → Revisão e envio

### Fluxo do Gestor (Beatriz) & Admin — 7 telas
18. Dashboard Gestor (visão consolidada de várias unidades)
19. Relatórios (6 cards + relatório inline "Sem plano de trabalho")
20. Lista de Participantes do órgão
21. Cadastrar Participante (com validação automática lateral)
22. Painel de Conformidade (envios à API PGD Central)
23. Erro de sincronização — drill-down (HTTP 422, histórico de tentativas, como resolver)
24. **Gestão Institucional** — unidades autorizadoras/instituidoras, atos normativos, parâmetros de envio à API

### Transversais
25. Notificações (inbox)

### Mobile · Servidor & Chefia — 5 telas (iPhone frames)
- M1. Mobile · Dashboard (Servidor)
- M2. Mobile · Registrar Execução (Servidor)
- M3. Mobile · Dashboard (Chefia)
- M4. Mobile · Lista da Equipe (Chefia)
- M5. Mobile · Avaliar Registro (Chefia)

### Componentes em destaque
- Seletor de nota 1–5 — Variante A (blocos coloridos, final)
- Linha do tempo · status do plano

## Decisões de design tomadas

**Sistema visual**
- Paleta institucional original (não usa GOV.BR DS direto): primária `#0F3D8C`, sucesso `#168821`, neutros frios. Cores de status e nota seguem o briefing seção 7.
- Tipografia: **Public Sans** (corpo) + **Manrope** (display/números/títulos)
- Cards arredondados (`r-lg = 16px`), espaçamento generoso por padrão, top nav horizontal estilo SaaS
- Pílulas de urgência para todo prazo legal: verde > 7d, amarelo ≤ 7d, vermelho vencido
- **Seletor de nota 1–5: blocos coloridos** (decidido após exploração de 3 variantes)
- **Linha do tempo do plano** com estados passados (check) / presente (halo) / futuros (vazio)
- Densidade configurável: compacta / confortável / espaçosa

**Arquitetura de informação confirmada**
- Top nav por papel (servidor/chefia/gestor/admin)
- Breadcrumbs em telas internas
- Dashboard adaptado ao papel (não é uma tela só para todos)
- Mobile: tab bar inferior de 4 itens, headers fixos com ações primárias visíveis

## Estrutura de arquivos do protótipo

Tudo na raiz do projeto. **Não use estes arquivos em produção** — são apenas referência visual. Copie os tokens, layouts e padrões para SvelteKit.

```
PGD Libre.html             ← entry point, carrega tudo em ordem
HANDOFF.md                 ← este documento
tokens.css                 ← design tokens: cores, tipografia, radii, shadows,
                             densidade (CSS custom properties + data-density)
ui.jsx                     ← componentes compartilhados:
                             - Icon (biblioteca interna de ícones SVG)
                             - TopNav (por papel)
                             - StatusBadge, NotaBadge, ModalidadeBadge
                             - UrgencyPill (cor por dias restantes)
                             - NotaSelector (blocos coloridos, variante final)
                             - StatusTimeline
                             - Stepper (wizard)
                             - Spark (sparkline)

screens-servidor.jsx       ← Fluxo do Servidor (telas 1–5 sem o empty state)
screens-chefia.jsx         ← Fluxo da Chefia base (Dashboard, Lista, Detalhe,
                             Avaliar) + dados mock da EQUIPE (12 servidores)
screens-wizard.jsx         ← Wizard de criação de Plano de Trabalho (5 steps)
screens-gestor.jsx         ← Dashboard Gestor, Relatórios, Lista de Participantes
screens-sistema.jsx        ← Notificações, Painel de Conformidade
screens-misc.jsx           ← Detalhe Avaliação, Empty State, Erro Sync, Cadastrar
screens-extras.jsx         ← Plano de Entregas, Institucional, Perfil do Participante
screens-mobile.jsx         ← 5 telas mobile (Servidor + Chefia) em iPhone frames

app.jsx                    ← composição final no design canvas + tweaks panel
design-canvas.jsx          ← starter de canvas (não relevante p/ produção)
tweaks-panel.jsx           ← starter de tweaks (não relevante p/ produção)
ios-frame.jsx              ← starter de iPhone (não relevante p/ produção)
```

## Como implementar em SvelteKit

1. **Tokens** → adapte `tokens.css` para um `app.css` global do SvelteKit. Os custom properties (`--c-primary`, `--r-md`, etc.) já são CSS puro, basta copiar. Mantenha a estratégia `data-density` no `<html>` ou no `<body>`.

2. **Componentes Svelte** → converta os de `ui.jsx` mantendo as APIs:
   - `<Icon name size />`, `<StatusBadge status />`, `<NotaBadge nota />`, `<UrgencyPill daysLeft />`, `<NotaSelector bind:value />`, `<StatusTimeline {items} />`, `<Stepper {steps} {current} />`, etc.
   - O `<TopNav>` deve receber `role` derivado de `me.role` (query `{ me { id email name role } }` conforme briefing § 8).

3. **Rotas** → siga a hierarquia do briefing § 3:
   - `/` (dashboard adaptado ao papel)
   - `/meu-plano`, `/meu-plano/registrar`, `/meu-plano/avaliacao/[id]`, `/meu-plano/avaliacao/[id]/recurso`
   - `/equipe`, `/equipe/participantes/[id]` (perfil completo), `/equipe/planos-trabalho/[id]`, `/equipe/planos-trabalho/novo` (wizard 5 steps)
   - `/equipe/planos-entregas/[id]` (Tela 9)
   - `/conformidade`, `/conformidade/erro/[id]`
   - `/relatorios`
   - `/admin/participantes`, `/admin/participantes/novo`
   - `/admin/institucional` (com sub-abas: unidades autorizadoras / instituidoras / atos / parâmetros)
   - `/notificacoes`

4. **GraphQL** → use Houdini ou urql conforme briefing. Schemas e queries listados em § 8.

5. **PT-BR em tudo** — nenhum termo técnico do backend deve vazar para a UI. Use o glossário do § 9 do briefing.

6. **Acessibilidade WCAG 2.1 AA** — todos os componentes do protótipo já respeitam contraste ≥ 4.5:1, mas valide com axe-core no build do SvelteKit.

7. **Mobile** — não use lib externa de UI. As telas mobile são apenas o mesmo CSS adaptado: tab bar inferior fixa, headers compactos, listas em cards verticais, CTAs sticky no rodapé. Use media queries no `tokens.css` ou um simples `data-viewport="mobile"` para alternar layouts em rotas críticas (Dashboard, Meu Plano, Registrar, Equipe, Avaliar).

## O que NÃO foi feito no protótipo (fica como TODO)

- Tela de login (briefing § 8 diz que o backend cuida disso — só redirecionar para `/auth/login/google`)
- Versões mobile do Gestor e do Admin (uso desktop predomina nesses papéis)
- Estados de loading / skeleton (o protótipo é estático)
- Estados de erro de rede / API offline (apenas o erro de sync da API Central foi desenhado)

## Como abrir o protótipo

Abra `PGD Libre.html` em qualquer navegador. Use o pan/zoom do canvas para navegar entre as telas. O painel **Tweaks** (botão no toolbar) permite alternar densidade e visualização das listas (tabela/kanban/cards) para validar variações.

---

Qualquer dúvida sobre intenção de design ou interação específica, me chame antes de chutar.
