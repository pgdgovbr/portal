# Plano — Landing Page institucional + Login simplificado (v2)

## Status

**6/7 PRs mergeadas e em produção** (PRs #10, #11, #15, #16, #17, #18).

A landing está **funcional mas incompleta**: a PR #15 entregou só 3 dos 10 blocos do handoff v2 (Hero, StatBar, Atendimento à norma) + Footer. **Falta a PR-7 com os 6 blocos restantes**, detalhada no final deste plano.

## Contexto

Hoje o portal SvelteKit redireciona direto para `/auth/login/google` em qualquer rota não autenticada — não há página pública, nem escolha de provedor, nem caminho para visitantes explorarem a aplicação sem fazer OAuth.

O design **v2** (bundle baixado em `portal/_design/from-claude-design/` em 2026-05-17) inverteu tom e estrutura vs. a primeira fase: agora é **institucional formal**, com 3 telas:

- `/` — Landing pública (long-scroll, 10 blocos, indexável, sem auth)
- `/login` — Em demo: card único de personas. Em produção real: redirect direto para `/auth/login/govbr`
- `/app` — Dashboard autenticado branched por papel (o que hoje está em `/`)

### Decisões já fechadas pelo handoff v2 (não voltar atrás)

| # | Decisão |
|---|---|
| 1 | **Nome do produto**: `PGD Livre` (PT-BR) em todos os lugares — não `Libre` |
| 2 | **Marca**: Variante B — três barras horizontais empilhadas (ink, ocre, verde) representando ciclo plano-execução-avaliação |
| 3 | **Login pública**: **APENAS demo** na UI. Sem Google. Sem botão Gov.br (em produção real, `/login` redireciona direto sem renderizar) |
| 4 | **Sem "em produção"**: o sistema ainda não está no MGI. Tudo é "em construção" ou "disponível na demonstração" |
| 5 | **Sem cloud provider**: nada de Cloud Run/GCP/AWS na UI. Só "IaC com Terraform · qualquer nuvem" |
| 6 | **"Norma", não "Lei"**: Decreto e INs são "Norma" |
| 7 | **"Software Livre", não "Open Source"** |
| 8 | **Licenças visíveis**: AGPL-3.0 (código) + CC-BY-4.0 (conteúdo/docs) |
| 9 | **Hero IA**: estado `editing` (mais limpo), não `previewing` |
| 10 | **Tom**: institucional formal mas arrojado; CTAs fortes ok; pitches comerciais não |

### URL da app autenticada: `/app` (confirmado pelo usuário)

### Modo demo em produção: `ENVIRONMENT=demo`

Novo valor de enum no backend (além de `development`/`production`). Em `demo`:
- `/auth/dev-login` fica liberado (em `production` bloqueia 403)
- `/auth/personas-demo` expõe a lista canônica de personas
- Cookie é `Secure` (em `development` não)

### 10 Personas (do bundle, fonte de verdade)

| Email | Nome | Role | Grupo | Contexto |
|---|---|---|---|---|
| `servidor7@pgd-demo.gov.br` | Marta Silva | servidor | **recomendado** | Sem plano — cria do zero |
| `servidor1@pgd-demo.gov.br` | Nitai Bezerra | servidor | **recomendado** | PT em execução; tem plano anterior para clonar |
| `chefe1@pgd-demo.gov.br` | Carlos Souza | chefe_imediato | **recomendado** | Recurso pendente para responder |
| `gestor@pgd-demo.gov.br` | Maria Fernanda | gestor_unidade | **recomendado** | Aprova PE; vê conformidade |
| `servidor4@pgd-demo.gov.br` | Lucas Ramos | servidor | servidor | PT em rascunho |
| `servidor6@pgd-demo.gov.br` | Felipe Costa | servidor | servidor | Chefia ajustou — aguarda assinatura |
| `servidor2@pgd-demo.gov.br` | João Santos | servidor | servidor | Avaliação + convocação pendente |
| `servidor3@pgd-demo.gov.br` | Carla Mendes | servidor | servidor | Avaliação nota 2; afastamento encerrado |
| `chefe2@pgd-demo.gov.br` | Beatriz Lima | chefe_imediato | chefia | Plano do Pedro aguardando assinatura |
| `admin@pgd-demo.gov.br` | Roberto Admin | admin | outros | Vê erros de sync com API Central |

> **Nota**: servidor1 mudou de "Ana Silva" para "Nitai Bezerra" no handoff v2. O `seed_demo.py` precisa ser atualizado (ou aceitamos a divergência — o design só usa nome para card). Decisão: **manter Ana Silva no seed** (testes E2E dependem dela) mas expor o `name` que vier no payload — vai funcionar com qualquer nome no card.

---

## Estrutura final da Landing (`/`)

Long-scroll com 10 blocos (do handoff v2 §3):

1. **TopNav** — Logo · 4 anchors (Norma/IA/Conformidade/Arquitetura) · "Documentação" · "Repositório" · CTA "Acessar demonstração"
2. **Hero** — H1: _"Gestão de desempenho conforme a norma, com a inteligência do nosso tempo."_ + `BrowserFrame` à direita com screenshot estático da tela Registrar Execução em estado IA `editing`. Anotações flutuantes (chip roxo IA + card verde "Aderente à norma · 4 papéis")
3. **StatBar** — 4 stats: 37 requisitos · 4 papéis · AGPL-3.0 + CC-BY-4.0 · IaC
4. **Atendimento à norma** — Discurso institucional sobre Decreto 11.072/2022 + IN 24 e 52/2023. CTA "Saiba mais sobre o Programa de Gestão →"
5. **Ciclo da norma** (dark) — Timeline horizontal com 6 etapas + prazos + artigos. 3 links: Pactuação bilateral, Papéis, Glossário
6. **Inteligência generativa** — Sticky left + 1 card grande à direita: Disponível na demo (Reescrita assistida) + Em desenvolvimento (PárcIA, Resumo automático, Rascunho de avaliação)
7. **Conformidade e padrões** (cream) — Grid 3-col com 8 selos: LGPD, WCAG 2.1 AA, e-MAG, e-PING, CSP, Audit, Multi-tenant, Gov.br
8. **Arquitetura** — 4 itens (Software Livre AGPL/CC-BY, GraphQL, IaC Terraform, Workflow com agentes) + diagrama integração API PGD Central
9. **Em desenvolvimento** (cream) — Grade 2-col com 6 cards: CSV/JSON/YAML, PDF lote, GitHub Projects, plataformas SaaS, multicanal de notificações, PárcIA
10. **Footer** — Logo + 3 colunas de links + créditos SGD/SEGES/MGI + licenças

---

## Estrutura final do Login (`/login`)

- Header: Logo + link "Voltar à página inicial"
- Título: "Demonstração do PGD Livre" + lede explicando que em prod o acesso é via Gov.br
- Link "Ver as jornadas guiadas da demonstração →" (vai pra `https://pgdgovbr.github.io/docs/demo/acesso/`)
- Card único `LoginDemo`:
  - Banner amarelo: "Instância de demonstração. Dados fictícios podem ser resetados. Em produção real, o acesso é via Gov.br."
  - Seção "Comece por aqui" (4 cards recomendados, destacados com borda azul)
  - `<details>` colapsável com as outras 6 personas (servidor, chefia, outros)

PersonaCard original do design usa `<a href="/auth/dev-login?email=...&name=...&role=...">` (GET). Implementação real: link aponta para endpoint **portal** `GET /api/demo-login?...` que chama o backend, seta cookie do portal e redireciona para `/app`. Mantém UX progressive (funciona sem JS) sem expor o endpoint backend direto ao navegador (cookie cross-domain não funciona em Cloud Run).

---

## Componentes a criar

Conversão React → Svelte 5 dos componentes do bundle. Para cada um: `.svelte` + `.test.ts`.

| Bundle | Svelte | Responsabilidade |
|---|---|---|
| `landing-logo.jsx → Logo` | `lib/components/landing/Logo.svelte` | 3 barras + wordmark; props `name`, `onDark`, `size` |
| `landing-ui.jsx → TopNavLanding` | `lib/components/landing/TopNavLanding.svelte` | Topo da landing |
| `landing-ui.jsx → HeroBanner` | `lib/components/landing/HeroBanner.svelte` | Wrapper com 2 colunas (texto + slot) |
| `landing-ui.jsx → BrowserFrame` | `lib/components/landing/BrowserFrame.svelte` | Chrome estilizado para screenshot |
| `landing-ui.jsx → StatBar` | `lib/components/landing/StatBar.svelte` | 4 stats em linha |
| `landing-ui2.jsx → ConformidadeTimeline` | `lib/components/landing/ConformidadeTimeline.svelte` | Timeline horizontal escura, 6 steps |
| `landing-ui2.jsx → SeloConformidade` | `lib/components/landing/SeloConformidade.svelte` | Card individual selo |
| `landing-ui2.jsx → RoadmapItem` | `lib/components/landing/RoadmapItem.svelte` | Card seção "Em desenvolvimento" |
| `landing-ui2.jsx → FooterInstitucional` | `lib/components/landing/FooterInstitucional.svelte` | Footer da landing |
| `landing-screens.jsx → ArqItem` | `lib/components/landing/ArqItem.svelte` | Card da seção Arquitetura |
| `landing-login.jsx → PersonaCard` | `lib/components/landing/PersonaCard.svelte` | Card individual de persona |
| `landing-login.jsx → LoginDemo` | `lib/components/landing/LoginDemo.svelte` | Card único da `/login` |

---

## Estratégia TDD (todas as camadas)

Cada unidade segue **red → green → refactor**.

| Camada | Framework | Caminho padrão |
|---|---|---|
| Backend service (config, auth) | pytest + httpx | `pgd-libre/tests/test_auth_*.py` |
| Backend endpoint REST | pytest + httpx AsyncClient | `pgd-libre/tests/test_auth_dev_login.py` |
| Frontend componente Svelte | Vitest + @testing-library/svelte | `portal/src/lib/components/landing/<X>.test.ts` |
| Frontend server load | Vitest com `vi.stubGlobal('fetch')` | `portal/src/routes/<rota>/page.server.test.ts` |
| E2E completo | Playwright | `portal/e2e/landing-login.spec.ts` |

**Gate por PR (local):**
- Backend: `.venv/bin/pytest -q --tb=short` + `ruff check` + `ruff format --check` + `mypy src` + `pytest tests/test_schema_snapshot.py`
- Portal: `npm test && npm run check`
- E2E (na PR final): `npm run test:e2e -- landing-login.spec.ts`

---

## Fase A — Backend (`pgd-libre`)

### A1. Novo valor `demo` no Environment

**`pgd-libre/src/config.py`:**
```python
ENVIRONMENT: Literal["development", "demo", "production"] = "development"
```
Helper `is_demo()` retorna `self.ENVIRONMENT == "demo"`.

**Testes** (`tests/test_config.py`):
- `test_environment_default_eh_development`
- `test_environment_aceita_demo`
- `test_environment_rejeita_valor_arbitrario`

### A2. Liberar `/auth/dev-login` em `demo` + corrigir `secure` cookie

**`pgd-libre/src/auth/router.py`** — `dev_login()`:
- Bloqueia se `ENVIRONMENT == "production"` (mantém)
- Libera em `development` e `demo`
- Cookie `secure=True` em `demo` e `production`, `secure=False` apenas em `development`

**Testes** (`tests/test_auth_dev_login.py`):
- `test_dev_login_liberado_em_development`
- `test_dev_login_liberado_em_demo`
- `test_dev_login_bloqueado_em_production` (403)
- `test_cookie_secure_em_demo`
- `test_cookie_nao_secure_em_development`

### A3. Endpoint `GET /auth/personas-demo`

**Novo:** `pgd-libre/src/auth/personas.py` exporta `PERSONAS_DEMO: list[dict]` — 10 personas conforme handoff v2 (Marta, Nitai, Carlos, Maria Fernanda recomendados; demais).

**`pgd-libre/src/auth/router.py`**:
```python
@router.get("/personas-demo")
async def listar_personas_demo() -> list[dict]:
    if get_settings().ENVIRONMENT == "production":
        raise HTTPException(404)
    return PERSONAS_DEMO
```

**Testes** (`tests/test_personas_endpoint.py`):
- `test_personas_demo_retorna_10_itens`
- `test_personas_demo_404_em_production`
- `test_personas_estrutura_campos` (email, name, role, role_label, ctx, grupo)

### A4. Provisionamento `ENVIRONMENT=demo` no Cloud Run atual

**`pgd-libre/infra/terraform/cloud-run.tf`** — alterar env var de `production` para `demo`.

Commit dispara `terraform-apply.yml` → Cloud Run rollout.

Verificação pós-deploy:
- `curl https://pgd-libre-klvx64dufq-rj.a.run.app/auth/personas-demo` → 200 com 10 itens
- `curl -X POST https://pgd-libre-klvx64dufq-rj.a.run.app/auth/dev-login?email=...&name=...&role=...` → 200 + cookie Secure

### A5. Regenerar snapshot do schema

Mudanças são em REST; rodar `pytest tests/test_schema_snapshot.py` apenas para confirmar.

---

## Fase B — Frontend (`portal`)

### B1. Tokens CSS da landing

Copiar `_design/from-claude-design/project/landing-tokens.css` para `portal/src/lib/landing.css` (módulo separado, importado só pela landing). Tokens introduzidos:
- `--c-paper`, `--c-paper-2`, `--c-ink-editorial`, `--c-accent*`, `--c-mark-dot`
- `--fz-display-xl`, `--fz-display-lg`, `--fz-display-md`, `--fz-display-sm`, `--fz-lede`, `--fz-body-lg`
- `--w-prose`, `--w-content`, `--w-wide`
- Utility classes `lp-*` (prefixadas para não conflitar com `app.css`)

### B2. Reescrita do `hooks.server.ts`

**Atual:** redireciona qualquer rota sem token para `/auth/login/google`.

**Novo:** allowlist de rotas públicas:
```typescript
const PUBLIC_PATHS = ['/', '/login', '/api/demo-login'];
const isPublic = path === '/' || PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/'));
if (!token && !isPublic && !path.startsWith('/auth')) {
    redirect(302, `/login?next=${encodeURIComponent(path)}`);
}
```
Handler de OAuth callback (`?token=` na query): seta cookie + redireciona para `/app`.

**Testes** (`src/hooks.server.test.ts`):
- `test_redirect_protegida_sem_token_vai_login`
- `test_permite_landing_sem_token`
- `test_permite_login_sem_token`
- `test_oauth_callback_redireciona_para_app`

### B3. Mover dashboard atual para `/app`

Criar `portal/src/routes/app/`:
- `+page.server.ts` — copiar de `portal/src/routes/+page.server.ts`
- `+page.svelte` — copiar de `portal/src/routes/+page.svelte`
- No load: `if (!user) redirect(302, '/login?next=/app')`

**Testes** (`portal/src/routes/app/page.server.test.ts`):
- `test_redirect_se_user_null`
- `test_carrega_dashboard_servidor`
- `test_carrega_dashboard_chefia`

### B4. Reescrita do `/` como landing pública

**`portal/src/routes/+page.server.ts`** — passa a ser:
```typescript
export const load: PageServerLoad = async ({ parent }) => {
    const { user } = await parent();
    if (user) redirect(302, '/app');
    return {};
};
```

**`portal/src/routes/+page.svelte`** — landing pública com 10 blocos.

Componentes criados na Fase B5. Hero usa screenshot estático em `static/landing/hero-ai-rewrite.png` (gerado a partir da tela atual ou capturado via Playwright em jornada existente).

### B5. Componentes da landing (TDD por componente)

Criar em `portal/src/lib/components/landing/`:
- `Logo.svelte` (3 barras + wordmark)
- `TopNavLanding.svelte`
- `HeroBanner.svelte`
- `BrowserFrame.svelte`
- `StatBar.svelte`
- `ConformidadeTimeline.svelte` (dark section)
- `SeloConformidade.svelte`
- `RoadmapItem.svelte`
- `ArqItem.svelte`
- `FooterInstitucional.svelte`
- `PersonaCard.svelte`
- `LoginDemo.svelte`

Cada `.svelte` tem `.test.ts` correspondente (render + props + slots).

### B6. Tela `/login`

**`portal/src/routes/login/+page.server.ts`:**
```typescript
export const load: PageServerLoad = async ({ parent, url, fetch }) => {
    const { user } = await parent();
    if (user) redirect(302, '/app');
    const demoMode = env.PUBLIC_DEMO_MODE === 'true';
    if (!demoMode) {
        // Produção real: redirecionar direto pro Gov.br
        redirect(302, `${env.PUBLIC_BACKEND_URL}/auth/login/govbr`);
    }
    const next = url.searchParams.get('next') ?? '/app';
    const personasRes = await fetch(`${env.PUBLIC_BACKEND_URL}/auth/personas-demo`);
    const personas = personasRes.ok ? await personasRes.json() : [];
    return { next, personas };
};
```

**`portal/src/routes/login/+page.svelte`** — renderiza `LoginDemo` com a lista de personas.

**Testes** (`page.server.test.ts`):
- `test_redirect_se_logado`
- `test_redirect_para_govbr_se_demo_off`
- `test_carrega_personas_se_demo_on`

### B7. Endpoint server-side `GET /api/demo-login`

**`portal/src/routes/api/demo-login/+server.ts`:**
```typescript
export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
    const email = url.searchParams.get('email');
    const name = url.searchParams.get('name');
    const role = url.searchParams.get('role');
    if (!email || !role) error(400, 'email e role obrigatórios');
    const params = new URLSearchParams({ email, name: name ?? '', role });
    const res = await fetch(`${env.PUBLIC_BACKEND_URL}/auth/dev-login?${params}`, {
        method: 'POST',
    });
    if (!res.ok) error(503, 'Login demo indisponível');
    const { token } = await res.json();
    cookies.set('access_token', token, {
        path: '/', httpOnly: true, secure: true, sameSite: 'lax',
        maxAge: 60 * 60 * 8,
    });
    redirect(303, '/app');
};
```

PersonaCard aponta para `/api/demo-login?email=...&name=...&role=...` (não direto pro backend).

**Testes:**
- `test_demo_login_400_sem_email`
- `test_demo_login_503_se_backend_off`
- `test_demo_login_redireciona_app_e_seta_cookie`

### B8. Logout

**`portal/src/routes/api/logout/+server.ts`:**
```typescript
export const POST: RequestHandler = async ({ cookies, fetch }) => {
    const token = cookies.get('access_token');
    if (token) {
        await fetch(`${env.PUBLIC_BACKEND_URL}/auth/logout`, {
            method: 'POST',
            headers: { Cookie: `access_token=${token}` },
        }).catch(() => {});
    }
    cookies.delete('access_token', { path: '/' });
    redirect(303, '/');
};
```

`TopNav.svelte` adiciona item "Sair" (form POST + `use:enhance`).

### B9. Atualizar redirects internos

`grep -rn "redirect.*'/" portal/src/routes/` — trocar `'/'` por `'/login'` quando o motivo for "não autenticado".

### B10. `.env.example`

```
PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
PUBLIC_BACKEND_URL=http://localhost:8000
PUBLIC_DEMO_MODE=true
```

### B11. Hero — screenshot estático

Capturar tela `Registrar Execução` com painel IA em `editing` via Playwright. Salvar em `portal/static/landing/hero-ai-rewrite.webp`. Atualizar `capture-screenshots.ts` se necessário.

---

## Fase C — Verificação E2E + Smoke

### C1. Playwright `portal/e2e/landing-login.spec.ts`

Cenários:
- `landing pública renderiza sem auth` → `goto('/')`, ver "PGD Livre"
- `landing redireciona logado para /app`
- `clique em "Acessar demonstração" abre /login`
- `personas demo aparecem (10 cards)` em modo demo
- `selecionar persona Marta Silva faz login` → `/app` com dashboard servidor
- `Logout volta para /`
- `rota protegida sem token redireciona com next`

### C2. Smoke local

1. `docker compose up -d` + seed + `npm run dev`
2. `http://localhost:5173/` (anônimo) → landing
3. Clicar "Acessar demonstração" → `/login`
4. Ver 4 recomendados + 6 em details
5. Clicar Marta → `/app` com dashboard servidor (estado vazio "criar plano")
6. Logout → `/`
7. `/meu-plano` anônimo → `/login?next=/meu-plano`

---

## Ordem de execução (PRs incrementais)

```
PR-1: pgd-libre — A1-A3 + A5 (config + dev-login + personas endpoint + testes)
PR-2: pgd-libre/infra — A4 (Terraform ENVIRONMENT=demo)
PR-3: portal — B1-B3 (tokens + hooks + mover dashboard p/ /app)
PR-4: portal — B4-B5 (landing pública + 12 componentes)
PR-5: portal — B6-B7 (tela /login + /api/demo-login)
PR-6: portal — B8-B10 (logout + redirects + .env)
PR-7: portal — B11 + C (hero screenshot + E2E)
```

Cada PR roda CI local antes de push.

---

## Fora do escopo

- Instalações reais de órgãos (`ENVIRONMENT=production`) — sem demo, sem dev-login, Gov.br obrigatório
- Outros providers OAuth (Microsoft, Keycloak)
- i18n (landing por enquanto pt-BR only)
- 404/500 pages com visual da landing (follow-up)
- `sitemap.xml`, `robots.txt`, `og-image.png`, favicons (follow-up)
- Política de cookies/LGPD persistente — só o banner amarelo "instância demo" no `/login`
- Hero "vivo" (iframe do app) — usar screenshot estático

---

## Arquivos críticos

### Backend criar
- `pgd-libre/src/auth/personas.py`
- `pgd-libre/tests/test_auth_dev_login.py`
- `pgd-libre/tests/test_personas_endpoint.py`
- `pgd-libre/tests/test_config.py` (se não existir)

### Backend modificar
- `pgd-libre/src/config.py` (+`Literal`, `is_demo`)
- `pgd-libre/src/auth/router.py` (gate dev-login, novo endpoint personas, secure cookie)
- `pgd-libre/infra/terraform/cloud-run.tf` (`ENVIRONMENT=demo`)

### Portal criar
- `portal/src/lib/landing.css` (copiado de `_design/.../landing-tokens.css`)
- `portal/src/routes/app/+page.server.ts` (movido)
- `portal/src/routes/app/+page.svelte` (movido)
- `portal/src/routes/login/+page.server.ts`
- `portal/src/routes/login/+page.svelte`
- `portal/src/routes/api/demo-login/+server.ts`
- `portal/src/routes/api/logout/+server.ts`
- `portal/src/lib/components/landing/` (12 componentes Svelte + 12 testes)
- `portal/static/landing/hero-ai-rewrite.webp` (screenshot)
- `portal/e2e/landing-login.spec.ts`

### Portal modificar
- `portal/src/hooks.server.ts` (allowlist + redirect para /login)
- `portal/src/routes/+page.server.ts` (landing — não mais dashboard)
- `portal/src/routes/+page.svelte` (landing)
- `portal/src/routes/+layout.svelte` (TopNav condicional)
- `portal/src/lib/components/TopNav.svelte` (item Sair + logo aponta /app quando logado)
- `portal/.env.example` (+PUBLIC_DEMO_MODE)
- Todos os `+page.server.ts` com `redirect(302, '/')` por "não autenticado" → `'/login'`

---

## PR-7 — Completar landing com 6 blocos restantes

A PR #15 entregou o esqueleto inicial (Hero + StatBar + Atendimento à norma + Footer). Faltam **6 blocos** previstos no handoff v2:

### Componentes novos (TDD por componente)

Cada `.svelte` em `src/lib/components/landing/` com `.test.ts` ao lado:

| Componente | Origem | Função |
|---|---|---|
| `ConformidadeTimeline.svelte` | `landing-ui2.jsx:1-65` | Timeline horizontal escura com 6 etapas do ciclo da norma (números, prazos, artigos do decreto/IN) |
| `SeloConformidade.svelte` | `landing-ui2.jsx:67-99` | Card individual: ícone + título + descrição + status (`implementado`/`em conformidade`) |
| `RoadmapItem.svelte` | `landing-ui2.jsx:128-154` | Item de roadmap com bullet ocre + título + descrição + tag opcional |
| `ArqItem.svelte` | `landing-screens.jsx:403-419` | Item da seção Arquitetura: check verde + título + descrição |
| `IARecursoCard.svelte` (novo) | `landing-screens.jsx:117-156` | Card grande roxo: ícone gradient, título, descrição da reescrita IA, chips dos 4 templates, link "Detalhes" |

### Seções a adicionar em `src/routes/+page.svelte`

Inseridas **entre** o "Atendimento à norma" e o `FooterInstitucional`:

#### Bloco 1 — Ciclo da norma (dark)
- `lp-section dark` com id `#norma` extra (ancora)
- Eyebrow ocre "ciclo da norma"
- H2 "Da pactuação ao envio à API Central, sem ação manual."
- Lede branco-translúcido sobre o ciclo
- `<ConformidadeTimeline />` com 6 steps hardcoded (estão no JSX de referência)

#### Bloco 2 — Inteligência generativa
- `lp-section` com id `#ia`
- Grid 2 colunas (1fr 1.4fr): sticky left com eyebrow roxo + H2 + lede; direita com:
  - Chip verde "Disponível na demonstração" + `IARecursoCard` da Reescrita
  - Chip ocre "Em desenvolvimento" + 3 `RoadmapItem` (PárcIA, Resumo automático, Rascunho com tom da chefia)

#### Bloco 3 — Conformidade e padrões (cream)
- `lp-section cream` com id `#conformidade`
- Eyebrow + H2 "Construído para o serviço público." + lede
- Grid 3-col com 8 `SeloConformidade`: LGPD, WCAG 2.1 AA, e-MAG, e-PING, CSP, Auditoria imutável, Multi-tenant, Acesso institucional via Gov.br
- Cada selo tem `icon` SVG inline, `ttl`, `sub`, `status` ("implementado" ou "em conformidade")

#### Bloco 4 — Arquitetura
- `lp-section` com id `#arquitetura`
- Grid 2 colunas (1.1fr 1fr):
  - Esquerda: eyebrow + H2 "Software Livre, desacoplado e auditável." + lede + 4 `ArqItem` (AGPL+CC-BY, GraphQL desacoplado, IaC Terraform, Workflow com agentes) + chips da stack
  - Direita: diagrama-mockup "Seu órgão (self-hosted)" → seta HTTPS·GraphQL → "MGI API PGD Central"

#### Bloco 5 — Em desenvolvimento (cream)
- `lp-section cream`
- Eyebrow ocre + H2 "O que vem a seguir." + lede
- Grid 2-col com 6 `RoadmapItem`: CSV/JSON/YAML, PDF lote, GitHub Projects, plataformas SaaS, multicanal, PárcIA app

### Tokens CSS adicionais

Verificar se `--c-status-aval` (roxo) está em `app.css` ou `landing.css`. Se não, adicionar.

### Testes mínimos

Para cada componente novo: 3 testes (render básico, props obrigatórias, slot opcional). Para a página, atualizar `src/routes/page.server.test.ts` apenas se a load function mudar — o conteúdo da landing é estático em Svelte template, sem novos testes server-side.

### Verificação

1. `npx vitest run` ✅ (~600 testes)
2. `npm run check` ✅ 0 erros
3. Smoke local: `http://localhost:5173/` mostra os 10 blocos completos
4. CI verde + smoke prod pós-deploy

