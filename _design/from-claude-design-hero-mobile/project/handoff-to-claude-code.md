# Handoff · Workflow de Pactuação Bilateral do Plano de Trabalho

> **Para o Claude Code.** Este é o handoff da **fase de design** da pactuação bilateral. Você já tem o `portal/_design/handoff-workflow-pactuacao-pt.md` (briefing técnico vindo de você). Este documento descreve **o que eu desenhei**, **onde está**, e **como mapear pro código SvelteKit** que já existe.

---

## 1. Contexto rápido

O design responde a 7 decisões de UX abertas, especifica 4 componentes novos, refina 1 tela existente (`/meu-plano` estado vazio) e desenha 5 telas novas (criar/editar/revisar do servidor + revisar/lista da chefia atualizada). Sistema visual idêntico ao já implementado em `portal/src/app.css` — sem mudança de tokens.

**Onde abrir:** `Pactuação Bilateral.html` na raiz do projeto. Canvas com 16 artboards distribuídos em 7 seções, navegação por pan/zoom.

---

## 2. Recomendações finais das 7 decisões de UX

| # | Pergunta | Decisão | Onde no design |
|---|---|---|---|
| 1 | Wizard ou form único? | **Wizard só na primeira criação** (`/meu-plano/criar`); pós-criação é tela única segmentada com auto-save debounced | Artboard "Decisão 1" + telas 02 e 03 |
| 2 | Como mostrar diff? | **Timeline com entradas expansíveis**, diff side-by-side por campo dentro de cada entrada. Tela /revisar mostra um card-resumo separado quando há mudanças não-lidas | Decisão 2 + componente `EdicoesTimeline` + tela 04 |
| 3 | Cancelar plano em rascunho | **Menu overflow (kebab)** — não botão destacado. Texto: "Descartar rascunho" (não "Cancelar plano") | Decisão 3 + headers das telas |
| 4 | Metáfora "passa a bola" | **Ícone + cor de borda + texto direto** — sem emojis, sem mascote | Decisão 4 + componente `OwnershipBanner` |
| 5 | Wizard do servidor | **Reaproveita os 5 steps da chefia** com tooltips contextuais e banner de dicas só na primeira criação | Decisão 5 + tela 02 |
| 6 | Estado vazio /meu-plano | **Dois CTAs lado a lado** — "Criar do zero" (primário) + "Clonar plano anterior" (secundário, só se há histórico) | Decisão 6 + tela 01 |
| 7 | Notificação "plano recebido" | **Sino + badge + card no dashboard + e-mail.** Card persiste até a ação ser tomada | Decisão 7 |

---

## 3. Estrutura de arquivos do design

```
Pactuação Bilateral.html       ← entry point
pactuacao-components.jsx       ← componentes novos (4) + DecisionCard
pactuacao-screens.jsx          ← 6 telas desktop
pactuacao-mobile.jsx           ← 3 telas mobile
pactuacao-app.jsx              ← composição no DesignCanvas
```

Reusa do trabalho anterior:
- `tokens.css` (100% compatível com `portal/src/app.css`)
- `ui.jsx` — `<Icon>`, `<TopNav>`, `<ModalidadeBadge>`, `<UrgencyPill>`, `<NotaSelector>`, `<Stepper>`
- `design-canvas.jsx`, `ios-frame.jsx` — só infra de apresentação, não vai pro código

---

## 4. Componentes novos · spec

### 4.1 `StatusBadge` expandido (atualizar componente existente)

`portal/src/lib/types.ts` precisa novo enum:
```typescript
export type StatusPlano =
  | 'RASCUNHO_PARTICIPANTE'           // novo
  | 'AGUARDANDO_ASSINATURA_CHEFIA'    // novo
  | 'RASCUNHO_CHEFIA'                 // novo
  | 'AGUARDANDO_ASSINATURA_PARTICIPANTE'  // novo
  | 'EM_EXECUCAO'
  | 'CONCLUIDO'
  | 'AVALIADO'
  | 'CANCELADO';
```

`portal/src/lib/components/StatusBadge.svelte` ganha:
- `RASCUNHO_PARTICIPANTE` → azul primário (`bdg-info` + ícone `edit`)
- `RASCUNHO_CHEFIA` → roxo (variante `bdg-purple` que já existe + ícone `edit`)
- `AGUARDANDO_ASSINATURA_*` → amarelo warning (`bdg-warning` + ícone `clock`)

Ver catálogo visual: artboard "Catálogo de status" no canvas.

### 4.2 `OwnershipBanner.svelte` (novo)

Banner persistente no topo de toda tela de PT. **3 variantes visuais × 2 perspectivas = 8 textos contextuais** (tabela completa no briefing original, seção 5.1).

Props sugeridas:
```typescript
interface Props {
  variant: 'comigo-editor' | 'comigo-revisor' | 'com-outro';
  atorOutro: string;        // "Carlos Mendes (chefia)" ou "Ana Beatriz (servidora)"
  diasEspera?: number;
  mostrarDiff?: boolean;    // mostra botão "Ver o que mudou"
  onAssinar?: () => void;
  onAjustar?: () => void;
  onVerDiff?: () => void;
}
```

Visual:
- **comigo-editor** — fundo gradient `var(--c-primary-soft)`, border-left azul, ícone `edit`, ações "Salvar e sair" + "Assinar e enviar"
- **comigo-revisor** — fundo gradient `var(--c-warning-soft)`, border-left amarelo, ícone `clock`, ações "Ver o que mudou" + "Ajustar" + "Assinar"
- **com-outro** — fundo `var(--c-surface-2)`, border-left cinza, ícone `paperPlane`, ação "Lembrar"

Ver mockup: artboards "OwnershipBanner — 8 contextos".

### 4.3 `AssinaturaCard.svelte` (novo)

Card de assinatura com 3 checkboxes de pactuação. CTA "Assinar e ativar plano" só habilita com os 3 marcados. Botão secundário "Devolver para ajustes" sempre disponível.

Quando já assinou, card colapsa para versão verde de confirmação ("Você assinou esta versão · 14 mai 16:08 · Comprovante").

```typescript
interface Props {
  ator: string;                  // o outro lado, pra contexto
  dataAssinatura?: string;       // se truthy, mostra estado "assinado"
  onAssinar?: () => void;
  onDevolver?: () => void;
}
```

Texto rodapé importante (manter): *"Devolver para ajustes zera a assinatura do outro lado — ele(a) precisará reassinar depois."*

Ver: artboards "AssinaturaCard · antes/depois de assinar".

### 4.4 `EdicoesTimeline.svelte` (novo)

Timeline de eventos audit. Cada item tem `tipo`, `papel` (servidor/chefia), `autor`, `quando`, `descricao` opcional, `diff` opcional (array de mudanças campo a campo).

Tipos:
| Tipo | Cor | Ícone | Label |
|---|---|---|---|
| `criou` | primary | plus | Criou plano |
| `editou` | warning | edit | Editou |
| `assinou` | success | check | Assinou |
| `devolveu` | aval (roxo) | arrowL | Devolveu para ajustes |
| `enviou` | primary | paperPlane | Enviou para revisão |
| `pactuou` | success | handshake | Pactuação concluída |

Entrada com `diff.length > 0` mostra botão "X campos alterados" que expande para painel side-by-side (antes/depois). Diff visual: vermelho-soft com strikethrough × verde-soft destacado, separados por seta.

Pode aceitar prop `defaultExpanded` (índice da entrada a abrir).

Ver: artboard "EdicoesTimeline · com diff expansível".

### 4.5 `CloneDialog.svelte` (novo)

Modal acionado por "Clonar plano anterior" em `/meu-plano` ou no card "Planos anteriores". Mostra:
- Header com id do plano
- Bloco explicativo "Vamos copiar: modalidade, critérios, contribuições"
- 2 date inputs (início, término) — pré-preenchidos com semestre seguinte
- CTA "Clonar e editar" → cria PT em `RASCUNHO_PARTICIPANTE` e redireciona pra `/meu-plano/[novo_id]/editar`

Ver: artboard "CloneDialog · modal".

---

## 5. Telas · onde implementar

### 5.1 Telas novas a criar

| Rota | Arquivo SvelteKit | Mockup |
|---|---|---|
| `/meu-plano` (estado vazio) | atualizar `portal/src/routes/meu-plano/+page.svelte` | Tela 01 |
| `/meu-plano/criar` | criar `portal/src/routes/meu-plano/criar/+page.svelte` + `+page.server.ts` | Tela 02 |
| `/meu-plano/[id]/editar` | criar `portal/src/routes/meu-plano/[id]/editar/+page.svelte` | Tela 03 |
| `/meu-plano/[id]/revisar` | criar `portal/src/routes/meu-plano/[id]/revisar/+page.svelte` | Tela 04 |
| `/equipe/planos-trabalho/[id]/revisar` | criar — variante chefia da tela 04 | Tela 06 |
| `/equipe/planos-trabalho/[id]/editar` | criar — variante chefia da tela 03 (caso exceção) | (reaproveita tela 03 com role=chefia) |

### 5.2 Telas existentes a atualizar

| Rota | Mudança | Mockup |
|---|---|---|
| `/meu-plano` | Quando `planos.length === 0`, renderizar bloco "Como você quer começar?" com 2 CTAs e card de planos anteriores no aside | Tela 01 |
| `/meu-plano` | Quando há PT em rascunho/aguardando, renderizar `OwnershipBanner` no topo | (mesma estética da tela 03/04) |
| `/equipe` | Adicionar coluna "Status do plano" usando StatusBadge V2 + banner consolidado de pendências no topo | Tela 05 |
| `/equipe/planos-trabalho/[id]` | Quando status = `AGUARDANDO_ASSINATURA_CHEFIA`, mostrar `OwnershipBanner` variant=`comigo-revisor` + `AssinaturaCard` no aside + `EdicoesTimeline` na seção principal | Tela 06 |
| `/equipe/planos-trabalho/novo` | Adicionar tela introdutória de exceção: "Você está criando um plano para X. O caminho padrão é o servidor criar — confirme que esta é uma exceção (recém-chegado, ausência, etc.)" | (não desenhei — sugiro card de confirmação antes do step 1) |

### 5.3 Mobile

Os mocks mobile (artboards M1/M2/M3) **não são telas separadas** — são o mesmo layout responsivo ativado por media queries. Foque em:
- M1 (`/meu-plano` vazio mobile): empilhar CTAs verticalmente, tab bar inferior
- M2 (revisar mobile, servidor): CTAs sticky no rodapé com checkboxes condensadas
- M3 (revisar mobile, chefia): mesma estrutura M2 com role=chefia

---

## 6. Mapeamento de queries/mutations GraphQL

O backend (`portal/_plan/workflow-pactuacao-pt.md`) já especifica as mutations. Mapeamento esperado pelas telas:

| Ação na UI | Mutation GraphQL |
|---|---|
| "Criar plano" (servidor) → `/meu-plano/criar` envio | `criarPlanoTrabalhoComoServidor(input)` |
| "Clonar plano anterior" → modal | `clonarPlanoTrabalho(planoId, novoInicio, novoTermino)` |
| Auto-save em `/editar` | `atualizarPlanoTrabalho(planoId, input)` (debounced 800ms) |
| "Assinar e enviar" (servidor após editar) | `assinarPlanoTrabalho(planoId, papel: PARTICIPANTE)` |
| "Ajustar" na tela /revisar (zera assinatura do outro) | `ajustarPlanoTrabalho(planoId)` → transiciona pra `RASCUNHO_*` do ator |
| "Assinar" na tela /revisar | `assinarPlanoTrabalho(planoId, papel)` — última assinatura → `EM_EXECUCAO` |
| "Descartar rascunho" no kebab | `cancelarPlanoTrabalho(planoId)` |
| Polling do histórico de edições | `query auditEventsPlanoTrabalho(planoId)` |

---

## 7. Decisões pequenas e regras de UI a respeitar

1. **Auto-save:** em `/editar`, salvar debounced 800ms. Mostrar indicador discreto no header ("Auto-salvo há 4s") — não toast. Em caso de erro de save, mostrar banner vermelho não-bloqueante.

2. **Confirmação de "Devolver para ajustes":** confirmação inline (não modal). Frase: *"Isso vai zerar a assinatura de [outro lado]. Tem certeza?"* — botão "Sim, ajustar" + "Não".

3. **Tooltip de "tipos de contribuição"** (1/2/3) só na primeira criação (cookie `pgd_wizard_seen` ou contador no usuário).

4. **Bloqueio de submit** quando soma das contribuições ≠ 100% — botão Próximo/Assinar desabilitado, mensagem inline visível.

5. **Notificações:** o dashboard (`/`) precisa de uma seção "Aguardando sua ação" que replica o `OwnershipBanner` variant=comigo-revisor pra cada PT pendente.

6. **A11y:** todo `OwnershipBanner` precisa `role="status"` ou `aria-live="polite"` quando aparece dinamicamente.

7. **Mobile detection:** preferir CSS (`@media (max-width: 640px)`) a JS. Padrão: tab bar inferior fixa, conteúdo scrollável no meio, CTAs sticky no rodapé em telas de ação (revisar/editar).

---

## 8. Ordem sugerida de implementação

Sugestão de PRs/branches independentes pra entregar incremental:

1. **Tipos + StatusBadge V2** — `types.ts` ganha os 4 status novos, badge ganha 4 variantes. Sem mudança de comportamento. Cria base pro resto.
2. **Componentes atômicos** — `OwnershipBanner.svelte`, `AssinaturaCard.svelte`, `EdicoesTimeline.svelte`, `CloneDialog.svelte`. Cada um com `*.test.ts`. Renderizáveis isoladamente em Storybook ou rota de dev.
3. **`/meu-plano` estado vazio** — atualiza a página atual com os 2 CTAs e card de histórico. Sem mutations novas ainda (botões podem ser placeholders).
4. **`/meu-plano/criar`** — wizard de 5 steps reaproveitando estrutura do `/equipe/planos-trabalho/novo` mas com role=servidor. Mutation `criarPlanoTrabalhoComoServidor`. Inclui modal de clonar.
5. **`/meu-plano/[id]/editar`** — tela única segmentada com OwnershipBanner. Auto-save debounced. Botão "Assinar e enviar" → mutation.
6. **`/meu-plano/[id]/revisar`** — só leitura + AssinaturaCard. Mutations de assinar/ajustar.
7. **Chefia: `/equipe` badges + `/equipe/planos-trabalho/[id]` modo revisar** — replica componentes do lado da chefia.
8. **`/equipe/planos-trabalho/novo` (exceção)** — adiciona tela introdutória de confirmação de exceção.
9. **Dashboard: card "Aguardando sua ação"** — pull dos PTs com bola comigo (revisor).
10. **Mobile** — media queries pra empilhamento, sticky CTAs.

---

## 9. Fora do escopo deste handoff

- Backend (já tem plano técnico em `portal/_plan/workflow-pactuacao-pt.md`)
- TCR (briefing menciona como referência futura — manter o design pronto pra reuso)
- Avaliação, recurso, relatórios, conformidade, admin — sem mudanças
- Identidade visual / TopNav / layout geral — preservar

---

## 10. Restrições técnicas reforçadas

- SvelteKit 2 + Svelte 5 com **runes obrigatório** (`$state`, `$derived`, `$props()`)
- `adapter-node`
- WCAG AA — contraste já validado nos tokens, manter labels + navegação por teclado em todos os controles novos (especialmente os checkboxes do `AssinaturaCard`)
- Sem libs novas pesadas — reuso de Motion, Lucide via `Icon.svelte` e CSS variables existentes
- Tipografia (Public Sans + Manrope) e paleta atual **preservadas**

---

Qualquer dúvida sobre intenção de uma micro-interação ou variante, abre o `Pactuação Bilateral.html`, navega até o artboard, e me chama se ainda restar dúvida.
