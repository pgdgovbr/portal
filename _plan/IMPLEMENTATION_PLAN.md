# Plano — Portal SvelteKit (PGD Libre Frontend)

## Contexto

O backend do PGD Libre está estável e rodando em produção (`https://pgd-libre-klvx64dufq-rj.a.run.app`). O design foi finalizado no Claude Design: 25 telas desktop + 5 mobile, arquivos extraídos em `portal/_plan/pgd-libre/project/`. A pasta `portal/` existe mas não tem projeto SvelteKit ainda — apenas os artefatos de design em `_plan/`.

Stack confirmada: **SvelteKit** + **urql** (GraphQL) + **graphql-codegen** (TypeScript types). Sem library de UI externa — componentes próprios a partir do `ui.jsx` do design.

---

## Fase 1 — Scaffolding do projeto SvelteKit

### 1.1 Criar projeto

```bash
cd /Users/nitai/dev/destaquesgovbr/pgd-libre
npm create svelte@latest portal -- --template skeleton --types typescript --no-prettier --no-eslint --no-playwright
cd portal
npm install
```

Instalar dependências:
```bash
npm install @urql/svelte graphql
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
```

### 1.2 Configurar `svelte.config.js`

- Adapter: `@sveltejs/adapter-node` (Cloud Run roda Node)
- Alias `$lib` para `src/lib`

```bash
npm install -D @sveltejs/adapter-node
```

### 1.3 Variáveis de ambiente

`portal/.env.example` (não commitar `.env`):
```
PUBLIC_GRAPHQL_URL=https://pgd-libre-klvx64dufq-rj.a.run.app/graphql
PUBLIC_BACKEND_URL=https://pgd-libre-klvx64dufq-rj.a.run.app
```

### 1.4 Exportar schema GraphQL e gerar types

```bash
# No repo pgd-libre:
source .venv/bin/activate
strawberry export-schema src.main:app > portal/schema.graphql

# No portal:
cd portal
npx graphql-codegen --config codegen.ts
```

`portal/codegen.ts`:
```ts
import type { CodegenConfig } from '@graphql-codegen/cli';
export default {
  schema: './schema.graphql',
  documents: ['src/**/*.svelte', 'src/**/*.ts'],
  generates: {
    'src/lib/gql/': { preset: 'client' }
  }
} satisfies CodegenConfig;
```

---

## Fase 2 — Design Tokens

**Origem:** `portal/_plan/pgd-libre/project/tokens.css`  
**Destino:** `portal/src/app.css`

Copiar `tokens.css` integralmente como base do `app.css`. Adicionar:
- Import das fontes Public Sans e Manrope via Google Fonts
- Reset CSS minimalista
- Estratégia `data-density` no `<html>` (default: sem atributo = "confortavel")

Valores chave a preservar:
- `--c-primary: #0F3D8C`, `--c-success: #168821`
- `--r-lg: 16px` (cards), `--r-pill: 999px` (urgency pills)
- Notas: 1=`#0C4A1A` / 2=`#168821` / 3=`#0F3D8C` / 4=`#C77400` / 5=`#B91C1C`
- Status: cancelado=`#6B7280` / aprovado=`#0F3D8C` / execução=`#168821` / concluído=`#0C4A1A` / avaliado=`#5C2D91`

---

## Fase 3 — Biblioteca de Componentes (`src/lib/components/`)

Converter `ui.jsx` mantendo as APIs do protótipo. Cada componente é um arquivo `.svelte`.

### Componentes prioritários (P0)

| Componente | Props | Notas |
|---|---|---|
| `Icon.svelte` | `name: string, size?: number` | Biblioteca SVG interna — copiar paths de `ui.jsx` |
| `TopNav.svelte` | `role: UserRole` | Navegação horizontal; itens variam por papel |
| `StatusBadge.svelte` | `status: string` | Pílula com cor do design system |
| `NotaBadge.svelte` | `nota: 1\|2\|3\|4\|5` | Badge colorido por nota |
| `UrgencyPill.svelte` | `daysLeft: number` | Verde >7d / amarelo ≤7d / vermelho vencido |
| `NotaSelector.svelte` | `bind:value: number` | Blocos coloridos — Variante A (decisão final do design) |
| `StatusTimeline.svelte` | `items: TimelineItem[]` | Passado (check) / presente (halo) / futuro (vazio) |
| `Stepper.svelte` | `steps: string[], current: number` | Wizard de criação de plano |

### Componentes P1

| Componente | Props |
|---|---|
| `ModalidadeBadge.svelte` | `modalidade: string` |
| `Spark.svelte` | `data: number[]` | Sparkline |
| `DataTable.svelte` | Tabela genérica com sort/filter |

### Estrutura de arquivos

```
src/lib/
  components/
    Icon.svelte
    TopNav.svelte
    StatusBadge.svelte
    NotaBadge.svelte
    ModalidadeBadge.svelte
    UrgencyPill.svelte
    NotaSelector.svelte
    StatusTimeline.svelte
    Stepper.svelte
    Spark.svelte
    DataTable.svelte
  gql/             ← gerado pelo codegen
  stores/
    user.ts        ← store reativo do usuário logado
  utils/
    urgency.ts     ← calcular daysLeft e cor
    nota.ts        ← mapeamento nota → label/cor
```

---

## Fase 4 — Autenticação e Contexto de Usuário

### 4.1 Rota raiz redireciona para login

`src/hooks.server.ts`: se não há cookie `access_token`, redirecionar para `{PUBLIC_BACKEND_URL}/auth/login/google`.

```ts
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('access_token');
  if (!token && !event.url.pathname.startsWith('/auth')) {
    return Response.redirect(`${BACKEND_URL}/auth/login/google`);
  }
  return resolve(event);
};
```

### 4.2 Query `me` no layout raiz

`src/routes/+layout.server.ts`: executar query `{ me { id email name role } }` com o cookie, injetar no `$page.data`. Redireciona para login se 401.

### 4.3 Store de usuário

`src/lib/stores/user.ts`: writable store populado pelo layout. Usado pelo `TopNav` para selecionar itens.

---

## Fase 5 — Estrutura de Rotas

```
src/routes/
  +layout.svelte          ← TopNav + slot + data-density no <html>
  +layout.server.ts       ← query me, injeta user
  +page.svelte            ← Dashboard (adapta por role)
  
  meu-plano/
    +page.svelte            ← Meu Plano de Trabalho (tela 2)
    registrar/
      +page.svelte          ← Registrar Execução wizard 4 steps (tela 3)
    avaliacao/[id]/
      +page.svelte          ← Detalhe da avaliação (tela 4)
      recurso/
        +page.svelte        ← Contestar avaliação (tela 5)
  
  equipe/
    +page.svelte            ← Lista da Equipe — tabela/kanban/cards (tela 8)
    participantes/[id]/
      +page.svelte          ← Perfil do participante — 5 abas (tela 12/P2)
    planos-trabalho/
      novo/
        +page.svelte        ← Wizard 5 steps criar plano (telas 13-17)
      [id]/
        +page.svelte        ← Detalhe do plano (visão chefia) (tela 10)
    planos-entregas/[id]/
      +page.svelte          ← Criar/editar entregas da unidade (tela 9)
  
  conformidade/
    +page.svelte            ← Painel de conformidade (tela 22)
    erro/[id]/
      +page.svelte          ← Drill-down erro sync (tela 23)
  
  relatorios/
    +page.svelte            ← 6 cards + relatório inline (tela 19)
  
  admin/
    participantes/
      +page.svelte          ← Lista de participantes (tela 20)
      novo/
        +page.svelte        ← Cadastrar participante (tela 21)
    institucional/
      +page.svelte          ← Unidades/atos/parâmetros (tela 24)
  
  notificacoes/
    +page.svelte            ← Inbox (tela 25)
```

---

## Fase 6 — Implementação das Telas (ordem de prioridade)

### P0 — Bloqueia o MVP

**Sequência de implementação:**

1. **`+layout.svelte`** — TopNav com navegação por papel, slot de conteúdo, `data-density` padrão "confortavel"

2. **`/` Dashboard** (tela 1) — Role-adaptive:
   - Servidor: banner urgência, plano ativo, avaliação recebida, próximos prazos
   - Chefia: KPIs do time, avaliações priorizadas
   - Gestor: visão consolidada multi-unidade
   - Admin: atalhos rápidos
   - Query: `{ me { ... } listarPlanosTrabalho(...) minhasNotificacoes(...) }`

3. **`/meu-plano`** (tela 2) — KPIs do plano, contribuições, histórico de períodos
   - Query: `listarPlanosTrabalho(participante_id: me.id)`

4. **`/meu-plano/registrar`** (tela 3) — Wizard 4 steps com auto-save
   - Step 1: período (data início/fim)
   - Step 2: campo texto "O que fiz"
   - Step 3: ocorrências (opcional)
   - Step 4: revisão e envio
   - Mutation: `registrarExecucao`

5. **`/equipe`** (tela 8) — Lista 12+ servidores, 3 views (tabela/kanban/cards), filtros
   - Query: `listarParticipantes(unidade_autorizadora_id: ...)`

6. **`/equipe/planos-trabalho/[id]`** (tela 10) — Detalhe do plano (visão chefia)
   - Query: `planoTrabalho(id)` com contribuições e histórico

7. **Avaliar Registro** (tela 11) — Split-view: descrição readonly + form avaliação
   - `NotaSelector` (blocos coloridos, Variante A)
   - Justificativa obrigatória para notas 1, 4 e 5
   - Mutation: `avaliarRegistrosExecucao`

### P1 — Core, não bloqueia

8. **`/equipe/planos-trabalho/novo`** — Wizard 5 steps criar plano
9. **`/admin/participantes/novo`** — Cadastrar participante com validação lateral
10. **`/conformidade`** — Painel sync API Central
11. **`/relatorios`** — 6 cards + relatório inline "Sem plano"

### P2 — Completa o sistema

12. **`/meu-plano/avaliacao/[id]/recurso`** — Contestar avaliação
13. **`/admin/institucional`** — Tabs: unidades / atos normativos / parâmetros
14. **`/notificacoes`** — Inbox
15. **`/equipe/participantes/[id]`** — Perfil completo 5 abas
16. **`/equipe/planos-entregas/[id]`** — Criar/editar entregas

---

## Fase 7 — Mobile

Sem library externa. Estratégia: `data-viewport="mobile"` no `<html>` via media query no `+layout.svelte` (JS) e media queries no CSS.

Telas que precisam de adaptação mobile (do protótipo):
- M1 Dashboard Servidor → `/`
- M2 Registrar Execução → `/meu-plano/registrar`
- M3 Dashboard Chefia → `/`
- M4 Lista da Equipe → `/equipe`
- M5 Avaliar Registro → split-view vira fullscreen

Padrão mobile:
- Tab bar inferior fixa com 4 itens
- Headers compactos com ações primárias visíveis
- Listas em cards verticais
- CTAs sticky no rodapé do formulário

---

## Fase 8 — Acessibilidade e Qualidade

- **axe-core** no build: `npm install -D @axe-core/cli` + script `npm run a11y`
- Todos os componentes com atributos ARIA corretos (roles, labels, live regions)
- Contraste ≥ 4.5:1 (já garantido pelos tokens do design)
- Navegação por teclado: `focus-visible` styles nos componentes interativos
- Validação de formulários: mensagens de erro inline, não apenas cor

---

## Arquivos críticos

**Referência (ler, não editar):**
- `portal/_plan/pgd-libre/project/tokens.css` — design tokens
- `portal/_plan/pgd-libre/project/ui.jsx` — componentes compartilhados (APIs)
- `portal/_plan/pgd-libre/project/screens-servidor.jsx` — telas 1-6
- `portal/_plan/pgd-libre/project/screens-chefia.jsx` — telas 7-11 + dados mock
- `portal/_plan/pgd-libre/project/screens-wizard.jsx` — wizard 5 steps
- `portal/_plan/pgd-libre/project/screens-gestor.jsx` — telas 18-20
- `portal/_plan/pgd-libre/project/screens-sistema.jsx` — conformidade + notificações
- `portal/_plan/pgd-libre/project/screens-misc.jsx` — detalhe avaliação, cadastrar, erro sync
- `portal/_plan/pgd-libre/project/screens-extras.jsx` — plano entregas, institucional, perfil
- `portal/_plan/pgd-libre/project/screens-mobile.jsx` — 5 telas mobile

**A criar:**
- `portal/src/app.css` — tokens + reset + fontes
- `portal/src/lib/components/*.svelte` — biblioteca de componentes
- `portal/src/hooks.server.ts` — auth redirect
- `portal/src/routes/+layout.svelte` e `+layout.server.ts`
- `portal/schema.graphql` — exportado do backend
- `portal/codegen.ts` — configuração graphql-codegen

**Backend (apenas referência para GraphQL):**
- `pgd-libre/src/graphql/schema.py` — queries e mutations disponíveis
- `pgd-libre/src/graphql/participante.py` — tipos GraphQL

---

## Verificação end-to-end

```bash
# 1. Projeto compila sem erros TypeScript
cd portal && npm run check

# 2. Codegen roda sem erros
npm run codegen   # precisa do schema.graphql exportado

# 3. Dev server sobe
npm run dev       # http://localhost:5173

# 4. Fluxo de auth:
# - Acessar http://localhost:5173 sem cookie → redireciona para backend Google OAuth
# - Login Google → callback → cookie set → volta para dashboard

# 5. Dashboard renderiza com dados reais
# - Verificar que TopNav mostra papel correto
# - Verificar urgency pills aparecem nos prazos

# 6. Fluxo A (golden path): registrar execução
# Dashboard → /meu-plano → /meu-plano/registrar → wizard 4 steps → confirmação

# 7. Fluxo B (golden path): avaliar registro
# Dashboard → /equipe → plano de um servidor → NotaSelector → confirmar

# 8. Acessibilidade
npm run a11y      # axe-core sem erros críticos
```

---

## Sequenciamento sugerido (PRs)

| PR | Conteúdo | Tempo estimado |
|---|---|---|
| PR1 | Scaffolding + tokens + codegen config | ~2h |
| PR2 | Componentes base (Icon, TopNav, badges, UrgencyPill, NotaSelector, StatusTimeline, Stepper) | ~4h |
| PR3 | Auth hooks + layout + Dashboard P0 | ~3h |
| PR4 | /meu-plano + /meu-plano/registrar (P0) | ~3h |
| PR5 | /equipe + avaliar registro (P0) | ~4h |
| PR6 | P1 screens (wizard criar plano, cadastrar participante, conformidade, relatórios) | ~5h |
| PR7 | P2 screens + mobile adaptations | ~4h |
