# Plano — Portal SvelteKit (PGD Libre Frontend) — TDD-First

## Contexto

Backend estável em produção (`https://pgd-libre-klvx64dufq-rj.a.run.app`) e rodável
localmente via `docker-compose` em `/Users/nitai/dev/destaquesgovbr/pgd-libre/pgd-libre/`.

Stack confirmada: **SvelteKit** + **urql** (GraphQL) + **graphql-codegen** (TypeScript types).
Sem library de UI externa — componentes próprios a partir do design em `portal/_plan/`.

---

## Regras TDD

1. **RED** — escrever o teste que descreve o comportamento esperado (falha).
2. **GREEN** — escrever o mínimo de código para o teste passar.
3. **REFACTOR** — limpar sem quebrar testes.
4. **Nunca avançar de fase com testes vermelhos.**
5. Cada fase termina com `npm test` e `npm run test:e2e` 100% verde.

---

## Stack de Testes

| Camada | Ferramenta | Uso |
|--------|-----------|-----|
| Unitário/componente | **Vitest** + `@testing-library/svelte` | Funções puras, componentes Svelte |
| E2E | **Playwright** | Fluxos completos com backend real |
| Backend local | **docker-compose** | PostgreSQL + FastAPI rodando em :8000 |
| Auth de teste | `POST /auth/dev-login` | Endpoint backend (só ENVIRONMENT≠production) |

---

## Fase 0 — Infraestrutura de Testes

> Pré-requisito de tudo. Não existe "Fase 1" sem esta fase verde.

### 0.1 Instalar dependências de teste

```bash
cd portal

# Vitest + Testing Library
npm install -D vitest @vitest/coverage-v8 \
  @testing-library/svelte @testing-library/jest-dom \
  jsdom

# Playwright
npm install -D @playwright/test
npx playwright install chromium
```

### 0.2 Configurar Vitest

`portal/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    globals: true,
  },
  resolve: { alias: { $lib: '/src/lib' } },
});
```

`portal/src/test-setup.ts`:
```ts
import '@testing-library/jest-dom';
```

### 0.3 Configurar Playwright

`portal/playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  globalSetup: './e2e/global-setup.ts',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 0.4 Endpoint dev-login no backend

Adicionar ao backend `src/auth/router.py`:
```python
@router.post("/dev-login")
async def dev_login(
    email: str, role: str = "servidor", response: Response,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Só funciona fora de production. Cria usuário e retorna cookie."""
    if get_settings().ENVIRONMENT == "production":
        raise HTTPException(403, "Not available in production")
    # criar ou recuperar usuário
    # set cookie access_token
    # return {"ok": True}
```

### 0.5 Playwright global-setup

`portal/e2e/global-setup.ts`:
```ts
// Chama POST /auth/dev-login, salva storageState em e2e/.auth/*.json
// Um estado por papel: servidor, chefe, gestor, admin
```

### 0.6 Scripts npm

```json
"scripts": {
  "test":        "vitest run",
  "test:watch":  "vitest",
  "test:e2e":    "playwright test",
  "test:all":    "npm test && npm run test:e2e"
}
```

**✅ Fase 0 DONE quando:** `npm test` passa (0 testes, só infra ok) + `npm run test:e2e` abre o browser e fecha sem erro.

---

## Fase 1 — Tipos e Utilitários

> `src/lib/types.ts` e `src/lib/graphql.ts`

### Testes a escrever ANTES de implementar:

**`src/lib/types.test.ts`**
- `urgencyClass(-1)` → `'urg-late'`
- `urgencyClass(0)`  → `'urg-late'`
- `urgencyClass(7)`  → `'urg-warn'`
- `urgencyClass(8)`  → `'urg-ok'`
- `urgencyLabel(-3)` → string com "vencido"
- `urgencyLabel(0)`  → string com "hoje"
- `urgencyLabel(5)`  → string com "5 dias"
- `initialsFrom('Ana Beatriz Costa')` → `'AC'`
- `initialsFrom('Felipe')` → `'FE'`
- `initialsFrom('')` → `'??'`
- `NOTAS[1].label` → `'Excepcional'`
- `NOTAS[2].color` → `'#168821'`
- `NOTAS[5].label` → `'Insatisfatório'`

**✅ Fase 1 DONE quando:** `npm test` 100% verde para `types.test.ts`.

---

## Fase 2 — Componentes

> `src/lib/components/*.svelte`

Cada componente tem seu arquivo de teste em `src/lib/components/*.test.ts`.

### 2.1 Icon

- Renderiza SVG com o path correto para cada nome
- Renderiza com `size` customizado
- Renderiza vazio (sem erro) para ícone desconhecido

### 2.2 StatusBadge

- `status='EM_EXECUCAO'` → renderiza texto "Em execução" com cor verde
- `status='APROVADO'` → renderiza texto "Aprovado" com cor azul
- `status='CANCELADO'` → renderiza cor cinza
- Snapshot visual do badge para cada status

### 2.3 NotaBadge

- `nota=1` → renderiza "Excepcional" com background `#E2F2E4`
- `nota=2` → renderiza "Alto desempenho"
- `nota=5` → renderiza "Insatisfatório" com background danger
- Renderiza sem erro para nota inválida

### 2.4 UrgencyPill

- `daysLeft=10` → classe `urg-ok`, texto "10 dias"
- `daysLeft=3` → classe `urg-warn`, texto "3 dias"
- `daysLeft=-1` → classe `urg-late`, texto "vencido" / "ontem"
- `daysLeft=0` → classe `urg-late`, texto "hoje"

### 2.5 NotaSelector

- Renderiza 5 blocos clicáveis
- Clicar no bloco 3 → emite `change` com valor 3 / atualiza `value` bindado
- Bloco selecionado tem border/shadow de destaque
- Sem valor selecionado, nenhum bloco ativo
- `disabled=true` → nenhum bloco é clicável

### 2.6 Stepper

- 3 steps, current=0 → primeiro ativo, outros pending
- 3 steps, current=1 → segundo ativo, primeiro done, terceiro pending
- Renderiza label de cada step

### 2.7 ModalidadeBadge

- `modalidade='PRESENCIAL'` → texto "Presencial"
- `modalidade='TELETRABALHO_PARCIAL'` → texto "TT Parcial"
- `modalidade='TELETRABALHO_INTEGRAL'` → texto "TT Integral"

### 2.8 StatusTimeline

- Renderiza items passados com checkmark
- Renderiza item `current=true` com destaque
- Renderiza items `future=true` sem preenchimento

### 2.9 TopNav

- Renderiza links de navegação conforme `role='servidor'`
- Renderiza links diferentes para `role='chefe_imediato'`
- Link ativo tem destaque visual
- Renderiza nome do usuário

**✅ Fase 2 DONE quando:** `npm test` 100% verde para todos os `*.test.ts` em `components/`.

---

## Fase 3 — Auth e Layout

> `src/hooks.server.ts`, `src/routes/+layout.server.ts`, `src/routes/+layout.svelte`

### Testes Vitest (load functions)

- `hooks.server.ts`: sem cookie → redirect 302 para `/auth/login/google`
- `hooks.server.ts`: com cookie → passa para `resolve(event)`
- `+layout.server.ts`: com token válido → retorna `{ user: { id, name, role } }`
- `+layout.server.ts`: com token inválido → redirect para login

### Testes Playwright E2E

- Acessar `/` sem cookie → redireciona para URL do backend Google OAuth
- Acessar `/` com cookie de `servidor` → renderiza TopNav com role servidor
- Acessar `/` com cookie de `chefe` → renderiza TopNav com role chefe

**✅ Fase 3 DONE quando:** Vitest + Playwright verdes para auth/layout.

---

## Fase 4 — Dashboard `/`

### Vitest — `src/routes/+page.test.ts`

- Com role `servidor` + plano ativo → renderiza seção "Meu Plano"
- Com role `servidor` + sem plano → renderiza estado vazio
- Com role `chefe_imediato` → renderiza KPIs do time
- Com role `admin` → renderiza atalhos de admin

### Playwright E2E — `e2e/dashboard.spec.ts`

- Login como servidor → `/` renderiza "Meu Plano"
- Login como chefe → `/` renderiza "Equipe"
- Urgency pill aparece quando há prazo próximo

**✅ Fase 4 DONE:** todas as variantes do dashboard verde.

---

## Fase 5 — Meu Plano `/meu-plano`

### Vitest

- Load function retorna plano ativo do participante logado
- Renderiza KPIs (contribuições, registros, status)
- Sem plano → estado vazio com CTA

### Playwright E2E — `e2e/meu-plano.spec.ts`

- Login como servidor com plano ativo → vê contribuições listadas
- Clica "Registrar execução" → vai para `/meu-plano/registrar`

**✅ Fase 5 DONE:** verde.

---

## Fase 6 — Registrar Execução `/meu-plano/registrar`

### Vitest

- Step 0: sem datas → botão "Próximo" desabilitado
- Step 0: com datas → botão habilitado
- Step 1: menos de 50 chars → botão desabilitado
- Step 1: ≥50 chars → habilitado
- Step 3 (revisão): mostra valores dos steps anteriores

### Playwright E2E — `e2e/registrar-execucao.spec.ts`

- Fluxo completo: preenche 4 steps → envia → redireciona para `/meu-plano?registro=enviado`
- Cancelar no step 0 → volta para `/meu-plano`
- Voltar no step 2 → está no step 1

**✅ Fase 6 DONE:** verde.

---

## Fase 7 — Detalhe Avaliação `/meu-plano/avaliacao/[id]`

### Vitest + Playwright

- Renderiza nota com cor correta
- Botão "Contestar" só aparece para notas 4 e 5
- Link para `/recurso` funciona

**✅ Fase 7 DONE:** verde.

---

## Fase 8 — Contestar Avaliação `/meu-plano/avaliacao/[id]/recurso`

### Vitest

- Menos de 30 chars → botão desabilitado
- ≥30 chars → habilitado

### Playwright E2E

- Fluxo completo: preenche justificativa → envia → redirect `/meu-plano?recurso=aberto`

**✅ Fase 8 DONE:** verde.

---

## Fase 9 — Lista da Equipe `/equipe`

### Vitest

- Filtro de busca por nome filtra a lista
- Alterna view tabela/kanban/cards sem erro

### Playwright E2E — `e2e/equipe.spec.ts`

- Login como chefe → vê lista de servidores
- Clica em servidor → vai para `/equipe/planos-trabalho/[id]`

**✅ Fase 9 DONE:** verde.

---

## Fase 10 — Detalhe Plano de Trabalho `/equipe/planos-trabalho/[id]`

### Vitest

- Renderiza KPIs (status, contribuições, registros)
- Registros pendentes mostram banner de aviso
- Load function retorna 404 para ID inexistente

### Playwright E2E — `e2e/avaliar-registro.spec.ts`

- Clicar "Avaliar" abre modal
- Selecionar nota → justificativa obrigatória para notas 1, 4, 5
- Enviar avaliação → modal fecha, lista atualiza

**✅ Fase 10 DONE:** verde.

---

## Fase 11 — Wizard Criar Plano `/equipe/planos-trabalho/novo`

### Vitest

- Step 0: sem participante → não avança
- Step 3: contribuições < 100% → botão "Próximo" desabilitado
- Step 3: contribuições = 100% → habilitado
- addContribuicao: acumula corretamente

### Playwright E2E — `e2e/criar-plano.spec.ts`

- Fluxo completo 5 steps → envia → redirect `/equipe?plano=criado`

**✅ Fase 11 DONE:** verde.

---

## Fase 12 — Perfil do Participante `/equipe/participantes/[id]`

### Vitest + Playwright

- Renderiza header com nome, SIAPE, badges
- Tabs alternáveis (Visão geral, Planos, etc.)

**✅ Fase 12 DONE:** verde.

---

## Fase 13 — Plano de Entregas `/equipe/planos-entregas/[id]`

### Vitest + Playwright

- Lista entregas com progresso
- Filtros de status e responsável

**✅ Fase 13 DONE:** verde.

---

## Fase 14 — Conformidade + Erro Sync

### Playwright E2E — `e2e/conformidade.spec.ts`

- Admin acessa `/conformidade` → vê tabela de erros
- Clicar "Inspecionar" → vai para `/conformidade/erro/[id]`
- Renderiza histórico de tentativas

**✅ Fase 14 DONE:** verde.

---

## Fase 15 — Demais telas P1/P2

Cada uma com ciclo RED→GREEN antes de implementar:

- `/relatorios` — 6 cards + relatório inline
- `/admin/participantes` e `/admin/participantes/novo`
- `/admin/institucional` — tabs
- `/notificacoes` — inbox

**✅ Fase 15 DONE:** verde.

---

## Verificação Final

```bash
npm test            # Vitest — 0 erros
npm run test:e2e    # Playwright — 0 erros
npm run build       # SvelteKit build sem erros TypeScript
npm run check       # svelte-check 0 erros 0 warnings
```

---

## Estrutura de arquivos de teste

```
portal/
  vitest.config.ts
  playwright.config.ts
  src/
    test-setup.ts
    lib/
      types.test.ts
      graphql.test.ts
      components/
        Icon.test.ts
        StatusBadge.test.ts
        NotaBadge.test.ts
        UrgencyPill.test.ts
        NotaSelector.test.ts
        Stepper.test.ts
        StatusTimeline.test.ts
        ModalidadeBadge.test.ts
        TopNav.test.ts
    routes/
      +page.test.ts
      meu-plano/
        +page.test.ts
        registrar/+page.test.ts
        avaliacao/[id]/+page.test.ts
        avaliacao/[id]/recurso/+page.test.ts
      equipe/
        +page.test.ts
        planos-trabalho/[id]/+page.test.ts
        planos-trabalho/novo/+page.test.ts
        participantes/[id]/+page.test.ts
        planos-entregas/[id]/+page.test.ts
      conformidade/
        +page.test.ts
        erro/[id]/+page.test.ts
  e2e/
    global-setup.ts
    fixtures.ts
    dashboard.spec.ts
    meu-plano.spec.ts
    registrar-execucao.spec.ts
    avaliacao.spec.ts
    equipe.spec.ts
    avaliar-registro.spec.ts
    criar-plano.spec.ts
    conformidade.spec.ts
```

---

## Notas sobre o backend local

```bash
# Iniciar DB + app em background
cd /Users/nitai/dev/destaquesgovbr/pgd-libre/pgd-libre
docker-compose up -d

# Verificar se está rodando
curl http://localhost:8000/health

# O endpoint dev-login só existe quando ENVIRONMENT != "production"
# Está configurado em .env com ENVIRONMENT=development por padrão
```
