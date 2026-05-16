# Plano — Implementação Frontend: Pactuação Bilateral (TDD)

## Contexto

O Claude Design entregou o handoff em `portal/_design/from-claude-design/` (extraído do bundle gzip e salvo no repo). O design define:

- **4 componentes novos** + **1 expandido** (`StatusBadge` V2 com 4 estados a mais)
- **6 telas** (3 novas para servidor, 1 ajuste em `/equipe`, 1 nova/ajuste em `/equipe/planos-trabalho/[id]`, 1 estado vazio em `/meu-plano`)
- **Versões mobile** via CSS responsivo (não rotas separadas)
- Decisões de UX já tomadas (7 perguntas do briefing original respondidas)

Backend (Fase A) já está completo e em produção: as mutations e queries que o frontend vai consumir já existem. Pendência conhecida no schema GraphQL:

- O design espera `criarPlanoTrabalhoComoServidor`, `atualizarPlanoTrabalho`, `assinarPlanoTrabalho(papel)`, `ajustarPlanoTrabalho`, `auditEventsPlanoTrabalho`.
- O backend expõe: `criarPlanoTrabalho` (permissão `IsAuthenticated` — service decide role), `editarPlanoTrabalho`, `enviarPtParaOutroLado`, `assinarPt`, `clonarPlanoTrabalho`, `cancelarPlanoTrabalho`, `historicoPlanoTrabalho`.
- O frontend deve usar os nomes do backend; a UI chama os mesmos verbos, só renomeados.

**Caminho dos arquivos do design (referência, salvos no repo):**
- `portal/_design/from-claude-design/project/pactuacao-components.jsx` — JSX dos 4 componentes + StatusBadge V2
- `portal/_design/from-claude-design/project/pactuacao-screens.jsx` — 6 telas desktop
- `portal/_design/from-claude-design/project/pactuacao-mobile.jsx` — 3 versões mobile
- `portal/_design/from-claude-design/project/handoff-to-claude-code.md` — leituras obrigatórias antes de implementar
- `portal/_design/from-claude-design/project/tokens.css` — confirmado compatível com `portal/src/app.css`

**Tokens CSS adicionais** que o design usa e podem não existir hoje: `--c-primary-soft`, `--c-warning-soft`, `--c-success-soft`, `--c-info-soft`, `--c-danger-soft`, `--c-status-aval`, `--c-status-conc`, `--ff-mono`, `--r-pill`, `--r-lg`, `--r-md`, `--r-sm`, `--sh-sm`, `--sh-md`, `--sh-lg`, `--gap-sec`. Validar e adicionar o que faltar em `portal/src/app.css`.

---

## Estratégia TDD

Cada fase segue **red → green → refactor**:

1. **Red:** escrever os testes que falham (vitest unit, page.server.test.ts para load functions, page.test.ts para componentes Svelte 5)
2. **Green:** implementar o código mínimo que faz os testes passarem
3. **Refactor:** limpar duplicação, melhorar nomes, mantendo testes verdes

**Convenções do projeto** (já em `portal/CLAUDE.md`):
- Vitest: `environment: 'happy-dom'`, `resolve.conditions: ['browser']`, mocks em `src/test-mocks/`
- Server load: `vi.stubGlobal('fetch', vi.fn(...))` para mockar gqlFetch
- `redirect()` throws — `expect(fn).rejects.toMatchObject({ status: 302 })`
- `error()` no try/catch é re-pego — null-checks SEMPRE fora do try
- Componentes: render com `@testing-library/svelte`, assertions sobre DOM real

**Tipos de teste por fase:**

| Fase | Tipo | Arquivo padrão |
|---|---|---|
| 1 (tipos) | Vitest pure | `src/lib/types.test.ts` |
| 2 (componentes) | Vitest + Testing Library | `src/lib/components/[Comp].test.ts` |
| 3-8 (rotas) | Server load test + component test | `+page.server.test.ts` + `page.test.ts` |
| 9 (mobile) | Playwright viewport | `e2e/pactuacao-mobile.spec.ts` |
| 10 (E2E) | Playwright full flow | `e2e/pactuacao-*.spec.ts` |

**Gate de cada PR:**
- `npm run check` (svelte-check) sem erros
- `npm test` (Vitest) verde
- Para Fase 10 + integração final: `npm run test:e2e` (Playwright) verde

---

## Fase 1 · Fundação (tipos + tokens + StatusBadge V2)

### 1.1 Tipos em `portal/src/lib/types.ts`

Expandir `StatusPlano` para os 8 estados, adicionar `STATUS_LABELS` para os novos, adicionar helper `ownershipOfStatus`.

```typescript
export type StatusPlano =
  | 'RASCUNHO_PARTICIPANTE'
  | 'RASCUNHO_CHEFIA'
  | 'AGUARDANDO_ASSINATURA_CHEFIA'
  | 'AGUARDANDO_ASSINATURA_PARTICIPANTE'
  | 'EM_EXECUCAO'
  | 'CONCLUIDO'
  | 'AVALIADO'
  | 'CANCELADO';

// Mapeamento backend → frontend (int → string)
export const STATUS_PLANO_INT: Record<number, StatusPlano> = {
  1: 'CANCELADO',
  2: 'AGUARDANDO_ASSINATURA_CHEFIA',  // antigo APROVADO
  3: 'EM_EXECUCAO',
  4: 'CONCLUIDO',
  5: 'RASCUNHO_PARTICIPANTE',
  6: 'RASCUNHO_CHEFIA',
  7: 'AGUARDANDO_ASSINATURA_PARTICIPANTE',
};

export type OwnershipSide = 'participante' | 'chefia' | null;

export function ownershipOfStatus(status: StatusPlano): OwnershipSide {
  switch (status) {
    case 'RASCUNHO_PARTICIPANTE':
    case 'AGUARDANDO_ASSINATURA_PARTICIPANTE':
      return 'participante';
    case 'RASCUNHO_CHEFIA':
    case 'AGUARDANDO_ASSINATURA_CHEFIA':
      return 'chefia';
    default:
      return null;
  }
}
```

Atualizar `STATUS_LABELS` com as 4 novas labels conforme `STATUS_V2` em `pactuacao-components.jsx:12-41`.

### 1.2 Tokens em `portal/src/app.css`

Auditar quais dos tokens listados acima já existem. Adicionar os que faltarem com os valores de `/tmp/design-pactuacao/pgd-libre/project/tokens.css`.

Adicionar também os 8 estilos de status badge (`sbg-draft-srv`, `sbg-draft-chf`, `sbg-await-chf`, `sbg-await-srv`, `sbg-exec`, `sbg-conc`, `sbg-aval`, `sbg-cancel`) — fonte: `pactuacao-components.jsx:440-461`.

### 1.3 `StatusBadge.svelte` V2

Atualizar componente em `portal/src/lib/components/StatusBadge.svelte` para suportar os 8 estados. Suporte a props `size` (`sm` | `md` | `lg`) e `showIcon` (default true).

Atualizar `StatusBadge.test.ts` com casos para os 4 novos estados.

---

## Fase 2 · Componentes atômicos

Criar 4 componentes Svelte 5 (runes), cada um com `.test.ts`. Modo de cabeça: cada `*.svelte` é renderizável isoladamente sem layouts; testes verificam render + interações.

### 2.1 `OwnershipBanner.svelte`

Arquivo: `portal/src/lib/components/OwnershipBanner.svelte`

Props (Svelte 5 runes):
```typescript
interface Props {
  variant: 'comigo-editor' | 'comigo-revisor' | 'com-outro';
  atorOutro: string;
  diasEspera?: number;
  mostrarDiff?: boolean;
  onAssinar?: () => void;
  onAjustar?: () => void;
  onVerDiff?: () => void;
  onSalvarSair?: () => void;
  onEnviar?: () => void;
  onLembrar?: () => void;
}
```

Visual: replicar `pactuacao-components.jsx:59-134` em Svelte. Usar `role="status"` + `aria-live="polite"`.

Testes: render dos 3 variants, click handlers, exibição condicional de "Ver o que mudou".

### 2.2 `AssinaturaCard.svelte`

Arquivo: `portal/src/lib/components/AssinaturaCard.svelte`

Props:
```typescript
interface Props {
  ator: string;                          // nome do outro lado
  dataAssinatura?: string;               // ISO ou formatado; quando truthy, mostra estado "assinado"
  onAssinar?: () => void;
  onDevolver?: () => void;
}
```

Estado interno: 3 checkboxes (runes `$state`). Botão "Assinar e ativar plano" só habilita com os 3 marcados. Quando `dataAssinatura` truthy, renderiza versão verde de confirmação ("Você assinou esta versão").

Replicar `pactuacao-components.jsx:138-222`. Rodapé importante (manter texto exato): _"Devolver para ajustes zera a assinatura do outro lado — ele(a) precisará reassinar depois."_

Testes: estado inicial desabilitado, 3 checks habilitam, click chama callback, estado pós-assinatura.

### 2.3 `EdicoesTimeline.svelte`

Arquivo: `portal/src/lib/components/EdicoesTimeline.svelte`

Props:
```typescript
interface DiffItem {
  campo: string;
  de: string;
  para: string;
  mono?: boolean;
}
interface TimelineEntry {
  tipo: 'criou' | 'editou' | 'assinou' | 'devolveu' | 'enviou' | 'pactuou';
  papel: 'servidor' | 'chefia';
  autor: string;
  quando: string;        // formatado pelo caller
  descricao?: string;
  diff?: DiffItem[];
}
interface Props {
  items: TimelineEntry[];
  defaultExpanded?: number;
}
```

Estado: `Set<number>` de índices expandidos. Replicar `pactuacao-components.jsx:227-336`.

Conversor: precisamos de um helper que transforma os `AuditLogEntryType[]` (vindos de `historicoPlanoTrabalho`) em `TimelineEntry[]`. Onde colocar:

- Criar `portal/src/lib/audit-to-timeline.ts` com função `auditEventsToTimeline(events: AuditLogEntry[]): TimelineEntry[]`
- Mapear `action` + `new_values.acao` para `tipo`: CREATE → `criou`; UPDATE com `acao=enviar_para_outro_lado` → `enviou`; com `acao=assinar` → `assinou` ou `pactuou` (se status final é EM_EXECUCAO); etc.
- Mapear `user_email` → `papel` lendo o email do participante vs chefia (passar como contexto adicional)
- Extrair diff comparando `old_values` × `new_values` (filtrar campos do plano: data_inicio, data_termino, carga_horaria_disponivel, criterios_avaliacao, trabalho_noturno)
- Formatar `created_at` → string PT-BR (DD mmm · HH:mm)

Testes: render de cada tipo, diff expansível, formatação.

### 2.4 `CloneDialog.svelte`

Arquivo: `portal/src/lib/components/CloneDialog.svelte`

Props:
```typescript
interface Props {
  planoId: string;          // id_plano_trabalho do PT origem
  open: boolean;
  onCancel: () => void;
  onClone: (params: { idPlanoTrabalhoNovo: string; dataInicio: string; dataTermino: string }) => Promise<void>;
}
```

Comportamento: modal absoluto (overlay). Pré-preenche datas com semestre seguinte ao hoje (helper `proximoSemestre(): { inicio: Date; fim: Date }`). Submit habilita só com ambas as datas válidas (fim > início).

Replicar `pactuacao-components.jsx:341-401`. A11y: trap focus, `Esc` cancela.

Testes: render, validação de datas, callbacks.

---

## Fase 3 · Tela `/meu-plano` (estado vazio + ownership banner)

Arquivo: `portal/src/routes/meu-plano/+page.svelte` (atualizar) + `+page.server.ts` (estender query).

**Server:** estender a query `MeuPlano` para incluir `meusPlanosTrabalhoAnteriores` (planos concluídos/avaliados/cancelados) — usar `meusPlanosTrabalho` filtrado client-side ou criar query nova. Decisão: filtrar client-side (status >= CONCLUIDO ou CANCELADO).

**Svelte:**
- Branch 1: `planos.length === 0` → renderizar bloco "Como você quer começar?" (`pactuacao-screens.jsx:34-180`)
  - 2 CTAs lado a lado: "Criar plano do zero" → `/meu-plano/criar`, "Clonar plano anterior" → abre `CloneDialog`
  - Aside com card "Planos anteriores" + card "Como funciona" + card "Casos especiais"
- Branch 2: `planos.length > 0`, plano ativo em status de pactuação → renderizar `OwnershipBanner` + link para `/editar` ou `/revisar` conforme dono
- Branch 3: plano em `EM_EXECUCAO` → manter o que existe hoje (tela de detalhe atual)

---

## Fase 4 · Tela `/meu-plano/criar` (wizard)

Novas rotas:
- `portal/src/routes/meu-plano/criar/+page.svelte`
- `portal/src/routes/meu-plano/criar/+page.server.ts`

**Server:** carrega `me` + `planoEntregas` da unidade do servidor (necessário para vincular contribuições tipo 1) — verificar se há query existente; se não, adicionar `listarPlanosEntregasDaMinhaUnidade` ou reusar `listarPlanosEntregas` filtrando.

**Svelte:** wizard de 5 passos reaproveitando `Stepper.svelte`. Estrutura — replicar lógica de `portal/src/routes/equipe/planos-trabalho/novo/+page.svelte`, mas com:
1. `role=servidor` (sem seletor de participante — usa o próprio)
2. Banner "Dica" sobre tipos de contribuição (steps 4) — só na primeira vez (cookie `pgd_pact_wizard_seen` ou contador no user)
3. Submit final chama `criarPlanoTrabalho` (mutation atual aceita servidor) com todos os campos; resposta cria PT em `RASCUNHO_PARTICIPANTE`
4. Após criar PT, chama `editarPlanoTrabalho` para cada contribuição adicionada (ou usa a mutation existente `adicionarContribuicao` — checar)

Após submit bem-sucedido: `goto('/meu-plano/[id]/editar')` se servidor pretende revisar antes de enviar, ou diretamente `enviarPtParaOutroLado` se já assinou no wizard.

**Decisão de UX (do design):** o último step ("Revisão") tem CTA "Assinar e enviar para chefia" — então chamar primeiro `criarPlanoTrabalho` → contribuições → `enviarPtParaOutroLado`. Ou no botão "Salvar como rascunho": só `criarPlanoTrabalho`, redireciona para `/editar`.

---

## Fase 5 · Tela `/meu-plano/[id]/editar`

Novas rotas:
- `portal/src/routes/meu-plano/[id]/editar/+page.svelte`
- `portal/src/routes/meu-plano/[id]/editar/+page.server.ts`

**Server:** query `planoTrabalho(id)` (já existe) + `meuParticipanteId` (para validar ownership; ou usar `me`).

**Svelte:**
- Validar no load: se servidor não é dono, `error(403)`; se status não permite edição (`EM_EXECUCAO`, etc), redirecionar para tela de leitura
- Renderizar `OwnershipBanner` variant=`comigo-editor` no topo
- Tela única segmentada em 4 cards: período/vínculo, modalidade/carga, contribuições, critérios — todos editáveis inline
- Auto-save debounced 800ms via `editarPlanoTrabalho`. Indicador "Auto-salvo há Ns" no header (timer + relativ time helper)
- Card CTA destacado no final: "Assinar e enviar para chefia" → `enviarPtParaOutroLado` → redireciona para `/meu-plano` (mostra status "Aguardando chefia")
- Side: `EdicoesTimeline` com histórico (`historicoPlanoTrabalho` query) + menu overflow com "Descartar rascunho" → `cancelarPlanoTrabalho`

Helper auto-save (`debounce` 800ms): cria função `salvar(patch)` que mantém promise pending, exibe estado "Salvando…" → "Auto-salvo há Ns". Em erro, mostra banner vermelho não-bloqueante.

---

## Fase 6 · Tela `/meu-plano/[id]/revisar`

Novas rotas:
- `portal/src/routes/meu-plano/[id]/revisar/+page.svelte`
- `portal/src/routes/meu-plano/[id]/revisar/+page.server.ts`

**Server:** mesma query do `/editar` mas validar que status é `AGUARDANDO_ASSINATURA_PARTICIPANTE` (sinal de que bola está com o servidor).

**Svelte:** replicar `pactuacao-screens.jsx:486-601`. Layout:
- `OwnershipBanner` variant=`comigo-revisor`, com prop `mostrarDiff`
- Aviso lateral: card "A chefia ajustou X campos" (calcular diff comparando audit log da última submissão do servidor com estado atual)
- Plano em modo leitura: cards de período, modalidade, contribuições, critérios — sem inputs
- Side: `AssinaturaCard` com `onAssinar` → `assinarPt`; `onDevolver` → mostra confirmação inline → `editarPlanoTrabalho` com no-op (vira RASCUNHO_PARTICIPANTE)
  - Confirmação inline: _"Isso vai zerar a assinatura de [Carlos]. Tem certeza?"_ + [Sim, ajustar] [Não]
  - "Sim, ajustar" → chama qualquer endpoint de edição (mesmo no-op), o backend zera assinatura e muda status → redireciona para `/editar`
- Side: card "Status das assinaturas" com check verde para chefia + pending amarelo para servidor

Helper: `obterUltimaSubmissao(historicoEvents)` retorna o estado dos campos na última transição com `acao=enviar_para_outro_lado` para construir o diff "o que mudou desde minha última leitura". Adicionar em `audit-to-timeline.ts`.

---

## Fase 7 · Telas da chefia

### 7.1 `/equipe` com badges novos

Arquivo: `portal/src/routes/equipe/+page.svelte` (atualizar)

- Substituir uso de `StatusBadge` antigo por `StatusBadge V2` com novos estados
- Adicionar coluna "Status do plano" + coluna "Ação" (Revisar e assinar / Detalhes / Aguardar)
- Banner consolidado no topo: "X planos aguardando sua assinatura" → CTA "Ver primeiro pendente"
- Highlight de linhas com `acao === 'assinar'` (background `--c-warning-soft`)

Replicar `pactuacao-screens.jsx:606-688`.

**Server:** estender query atual para incluir status de cada PT.

### 7.2 `/equipe/planos-trabalho/[id]/revisar`

Novas rotas:
- `portal/src/routes/equipe/planos-trabalho/[id]/revisar/+page.svelte`
- `portal/src/routes/equipe/planos-trabalho/[id]/revisar/+page.server.ts`

Variante chefia da `/meu-plano/[id]/revisar`. Replicar `pactuacao-screens.jsx:693-814`. Diferenças:
- Header com avatar do servidor
- `OwnershipBanner` variant=`comigo-revisor` mas `atorOutro = "[nome] (servidora)"`
- Mesma estrutura de `AssinaturaCard` e card "Status das assinaturas"

### 7.3 `/equipe/planos-trabalho/[id]/editar`

Novas rotas:
- `portal/src/routes/equipe/planos-trabalho/[id]/editar/+page.svelte`
- `portal/src/routes/equipe/planos-trabalho/[id]/editar/+page.server.ts`

Variante chefia da `/meu-plano/[id]/editar` para caso de exceção (chefia cria PT). Mesmo layout, só com `OwnershipBanner.atorOutro = "[servidor]"`.

### 7.4 `/equipe/planos-trabalho/novo` — tela de confirmação de exceção

Atualizar `portal/src/routes/equipe/planos-trabalho/novo/+page.svelte` adicionando um step 0 (antes do step "Participante"):

- Card explicativo: _"Você está criando um plano para um servidor. O caminho padrão é o próprio servidor criar — confirme que esta é uma exceção (recém-chegado, ausência prolongada, etc.)"_
- Radio: motivo da exceção (texto livre opcional)
- Botão "Confirmar e continuar" → avança para o wizard atual

---

## Fase 8 · Dashboard: card "Aguardando sua ação"

Arquivo: `portal/src/routes/+page.svelte` (atualizar)

Para `chefe_imediato`: card destacado no topo do dashboard listando PTs com status `AGUARDANDO_ASSINATURA_CHEFIA` (já vem na query atual de chefia). Cada item linka para `/equipe/planos-trabalho/[id]/revisar`.

Para `servidor`: card destacado se `meusPlanosTrabalho` tem item em `AGUARDANDO_ASSINATURA_PARTICIPANTE`. Link para `/meu-plano/[id]/revisar`.

---

## Fase 9 · Mobile (responsivo)

Não criar rotas separadas. Adicionar media queries em cada `+page.svelte` (ou em utilitário CSS compartilhado):
- `@media (max-width: 640px)`: empilhar grids 2-col em 1-col, tab bar inferior fixa, CTAs sticky no rodapé em telas de revisar/editar
- Tela de revisar mobile (`pactuacao-mobile.jsx`): checkboxes condensadas, CTAs sticky no rodapé

Verificação com Playwright: criar 3 testes E2E que simulam viewport mobile e validam que CTAs são clicáveis.

---

## Fase 10 · Atualizar schema codegen e testes E2E

```bash
cd portal
npm run codegen  # atualiza src/lib/gql/graphql.ts
npm run check    # valida tipos
npm run test:e2e # roda Playwright
```

Novos testes E2E em `portal/e2e/`:
- `pactuacao-criar.spec.ts`: Lucas (`servidor4`) cria PT via `/meu-plano/criar`, assina e envia
- `pactuacao-chefia-assina.spec.ts`: Carlos (`chefe1`) revisa PT do Lucas e assina
- `pactuacao-chefia-ajusta.spec.ts`: Carlos devolve para ajustes, Lucas reassina
- `pactuacao-clonar.spec.ts`: Ana clona PT concluído

---

## Ordem de execução (PRs incrementais)

Sugestão do design (handoff §8), adaptada:

```
1. Fase 1 (tipos + tokens + StatusBadge V2)           → PR pequeno, sem comportamento
2. Fase 2 (4 componentes novos com tests)             → PR isolado, testes verdes
3. Fase 3 (/meu-plano estado vazio)                   → desbloquear visualização
4. Fase 4 (/meu-plano/criar)                          → 1ª jornada completa
5. Fase 5 (/meu-plano/[id]/editar)                    → fluxo de auto-save
6. Fase 6 (/meu-plano/[id]/revisar)                   → fechar lado servidor
7. Fase 7.1 + 7.2 (/equipe badges + chefia revisar)   → fechar lado chefia
8. Fase 7.3 + 7.4 (chefia editar + exceção)
9. Fase 8 (dashboard cards)
10. Fase 9 (responsividade mobile)
11. Fase 10 (E2E + validação CI)
```

Cada PR tem que passar `npm run check` (zero erros), `npm test` (vitest), e o último `npm run test:e2e`.

---

## Verificação end-to-end final

1. **Setup:** backend rodando, banco seeded (já tem PTs em todos os estados: Lucas RASCUNHO_PARTICIPANTE, Pedro AGUARDANDO_CHEFIA, Ana/João/Carla EM_EXECUCAO)
2. **Jornada Lucas (rascunho → enviado):** login `servidor4@pgd-demo.gov.br` → `/meu-plano` → ver PT em rascunho com banner → `/editar` → ajustar → "Assinar e enviar" → status muda para AGUARDANDO_ASSINATURA_CHEFIA → notificação aparece para Carlos
3. **Jornada Pedro recebido (chefia ajusta):** login `chefe2@pgd-demo.gov.br` → `/equipe` → ver PT Pedro com badge "Aguardando chefia" → clicar "Revisar e assinar" → tela /revisar → "Devolver para ajustes" → confirmação → status volta a RASCUNHO_CHEFIA → notificação Pedro
4. **Pactuação completa:** Pedro reassina → Beatriz assina → status EM_EXECUCAO, notificação "Plano pactuado" para ambos
5. **Clonagem:** login `servidor1` (Ana) → ver `Planos anteriores` no aside → clicar "Clonar" no plano antigo → modal abre → preencher datas → "Clonar e editar" → redireciona para `/meu-plano/[novo_id]/editar`
6. **Caso exceção (chefia cria):** login Carlos → `/equipe/planos-trabalho/novo` → tela de confirmação de exceção → wizard → "Assinar e enviar para servidor" → status AGUARDANDO_ASSINATURA_PARTICIPANTE
7. **Mobile:** abrir Chrome DevTools modo iPhone 14 (402×874) → repetir jornada Lucas e Carlos
8. **Build:** `npm run build` sem erros
9. **CI:** push para branch e validar Vitest + Playwright + svelte-check

---

## Arquivos críticos a tocar/criar

| Categoria | Caminho |
|---|---|
| Tipos | `portal/src/lib/types.ts` |
| CSS | `portal/src/app.css` |
| Helper | `portal/src/lib/audit-to-timeline.ts` (novo) |
| Componentes | `portal/src/lib/components/StatusBadge.svelte` (atualizar) |
| Componentes novos | `OwnershipBanner.svelte`, `AssinaturaCard.svelte`, `EdicoesTimeline.svelte`, `CloneDialog.svelte` (+ `.test.ts` cada) |
| Rota servidor | `meu-plano/+page.svelte` (atualizar), `meu-plano/criar/`, `meu-plano/[id]/editar/`, `meu-plano/[id]/revisar/` |
| Rota chefia | `equipe/+page.svelte` (atualizar), `equipe/planos-trabalho/[id]/revisar/`, `equipe/planos-trabalho/[id]/editar/`, `equipe/planos-trabalho/novo/+page.svelte` (atualizar) |
| Dashboard | `routes/+page.svelte` (atualizar) |
| Testes E2E | `portal/e2e/pactuacao-*.spec.ts` (4 novos) |
| Capture | `portal/capture-screenshots.ts` (estender com novas telas para refresh das docs) |

---

## Fora do escopo

- Backend (já completo)
- TCR (não muda)
- Avaliações, recursos, relatórios, conformidade, admin
- Mudança de identidade visual / fonts / paleta
- Tela de detalhe do PT em chefia (`/equipe/planos-trabalho/[id]` atual) — só receberá ajustes pontuais (badge, banner condicional)
