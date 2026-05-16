# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # dev server → http://localhost:5173
npm run build         # production build
npm run check         # svelte-check (TypeScript + Svelte)
npm test              # Vitest unit/component tests (run once)
npm run test:watch    # Vitest in watch mode
npm run test:coverage # Vitest with coverage report
npm run test:e2e      # Playwright E2E (auto-starts frontend; requires backend at localhost:8000)
npm run test:all      # Vitest + Playwright
npm run codegen       # regenerate src/lib/gql/graphql.ts from schema.graphql
```

To run a single Vitest test file:
```bash
npx vitest run src/routes/meu-plano/page.server.test.ts
```

## Environment variables

Local `.env`:
```
PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
PUBLIC_BACKEND_URL=http://localhost:8000
```

Both default to the Cloud Run URL if unset — always set them locally.

## Architecture

**Data flow:** All GraphQL calls go through `src/lib/graphql.ts → gqlFetch()`, which forwards the `access_token` cookie as a `Cookie` header to the backend. Every `+page.server.ts` calls `gqlFetch()` directly using the token from `cookies.get('access_token')`. There is no client-side urql store in use.

**Auth:** `src/hooks.server.ts` redirects any unauthenticated request to `{PUBLIC_BACKEND_URL}/auth/login/google`. The backend sets the `access_token` httpOnly cookie after OAuth and redirects back to the frontend.

**User propagation:** `+layout.server.ts` runs a `me` query on every request and returns `{ user }`. All `+page.server.ts` files call `await parent()` to access `user` without repeating the query.

**Svelte 5 runes:** `svelte.config.js` enforces runes mode for all non-`node_modules` files. Always use `$state`, `$derived`, `$props()` — never the legacy `export let` / `$:` syntax.

**Domain types:** `src/lib/types.ts` is the source of truth for `UserRole`, `StatusPlano`, `Nota`, NOTAS lookup table, STATUS_LABELS, ROLE_LABELS, and urgency utilities (`urgencyClass`, `urgencyLabel`). The `userStore` in `src/lib/stores/user.ts` is set once from layout data and used by components.

**Generated types:** `src/lib/gql/graphql.ts` is auto-generated from `schema.graphql`. Do not edit it by hand.

## Route map

| Route | Role | Purpose |
|---|---|---|
| `/` | all | Dashboard (role-branched: servidor vs chefe_imediato) |
| `/meu-plano` | servidor | Active plan, execution records, evaluations |
| `/meu-plano/registrar` | servidor | Register monthly execution |
| `/meu-plano/avaliacao/[id]` | servidor | View evaluation detail, open appeal |
| `/equipe` | chefe_imediato | Team list with pending action badges |
| `/equipe/participantes/[id]` | chefe_imediato | Participant detail |
| `/equipe/planos-trabalho/[id]` | chefe_imediato | Plan detail, evaluate records |
| `/equipe/planos-trabalho/novo` | chefe_imediato | Create new work plan |
| `/equipe/planos-entregas/[id]` | chefe_imediato | Delivery plan detail |
| `/conformidade` | gestor/admin | API sync error panel |
| `/relatorios` | gestor/admin | Reports |
| `/notificacoes` | all | Notification list |
| `/admin/participantes` | admin | All participants |
| `/admin/institucional` | admin | Org config |

## Testing

### Vitest (unit/component)

- `environment: 'happy-dom'` — not jsdom (Svelte 5 incompatible)
- `resolve.conditions: ['browser']` — critical: forces Svelte to use the client build; without this, `mount()` throws "not available on server"
- SvelteKit module mocks in `src/test-mocks/` (`$app/stores`, `$app/navigation`, `$env/dynamic/public`)
- Server load functions tested by mocking `fetch` with `vi.stubGlobal('fetch', vi.fn(...))`
- `redirect()` throws — test with `expect(fn).rejects.toMatchObject({ status: 302 })`
- `error()` inside a `try/catch` is re-caught — always move null-checks **outside** try blocks in server loads

### Playwright (E2E)

- Requires backend at `localhost:8000`; frontend is auto-started by `playwright.config.ts`
- `e2e/global-setup.ts` creates pre-authenticated sessions via `POST /auth/dev-login` for each role, stored in `e2e/auth/*.json`
- Use `asServidor`, `asChefe`, `asGestor`, `asAdmin` fixtures from `e2e/fixtures.ts` — not the raw `test` from Playwright
- `fullyParallel: false` — tests run serially to avoid DB race conditions

## GraphQL codegen

`schema.graphql` is generated from the backend, then codegen produces `src/lib/gql/graphql.ts`:

```bash
# Export schema from running backend (inside pgd-libre dir)
source .venv/bin/activate
python -c "from src.graphql.schema import schema; print(schema.as_str())" > ../portal/schema.graphql

# Generate TypeScript types
cd ../portal && npm run codegen
```
