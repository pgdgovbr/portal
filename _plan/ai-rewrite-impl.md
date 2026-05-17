# Plano — Reescrever com IA (Registro de Execução)

## Contexto

O Registro de Execução mensal do servidor é o ponto do PGD que mais sofre com texto vago, mal estruturado e difícil de avaliar — leva a avaliações injustas, recursos e risco jurídico. A feature **"Reescrever com IA"** ajuda o servidor a **reestruturar (não substituir)** seu texto, segundo um de 4 templates (Por entrega, Cronológico, Por contribuição, STAR), preservando os fatos. Quando informação falta, a IA marca `[precisa de detalhe]` em vez de inventar.

Design completo entregue pelo Claude Design em `https://api.anthropic.com/v1/design/h/KRZHXnzyPYSYj6xRF3ElDg` — bundle baixado para `/tmp/design-ai-rewrite/pgd-libre/`. Os arquivos-chave já lidos:
- `handoff-ai-rewrite.md` — spec funcional completa (estados, prompts, endpoint, auditoria, rate limit, LGPD)
- `ai-rewrite.jsx` — protótipo do `AIRewritePanel` (estados editing/previewing, side-by-side, 4 templates com `sample`)

**Decisões já tomadas** (confirmadas com o usuário):
- **Provider**: AWS Bedrock via `boto3` (mesmas credenciais do DGB clipping, padrão estabelecido no workspace)
- **Modelo**: `us.anthropic.claude-haiku-4-5-20251001-v1:0` (Haiku 4.5 — barato, rápido, qualidade suficiente para reescrita determinística)
- **Transporte**: HTTP REST síncrono (sem SSE — output ~300-800 tokens em ~3s, spinner basta)

## Referências (read once antes de codar)

- Backend padrão de Bedrock (espelhar): `/Users/nitai/dev/destaquesgovbr/clipping/src/clipping/consolidator.py` (boto3 + retry + ClientError + ThrottlingException backoff). Auth via env vars já em uso no workspace: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`.
- Backend onde encaixar: `pgd-libre/src/services/plano_trabalho.py` já tem `registrar_execucao()`; ARE modelo em `src/models/plano.py:AvaliacaoRegistrosExecucao`.
- Frontend onde encaixar: `portal/src/routes/meu-plano/registrar/+page.svelte` (wizard 4 steps; step 1 = textarea de descrição com mín. 50 chars; já tem auto-save visual debounced).
- Tokens CSS já existem: `--c-status-aval` (roxo), `--c-warning-soft`, `--ff-mono`, `--r-md`, `--r-sm` em `portal/src/app.css`.

## Estratégia TDD (red → green → refactor para tudo)

Cada unidade tem ciclo TDD obrigatório. Ordem dentro de cada fase:

1. **Red**: escrever os testes da unidade antes de qualquer código de produção. Rodar e confirmar que falham com o erro esperado.
2. **Green**: escrever o código mínimo para os testes passarem. Não otimizar nem antecipar funcionalidade não testada.
3. **Refactor**: limpar duplicação, melhorar nomes, mantendo tests verdes.

**Tipos de teste por camada:**

| Camada | Framework | Caminho padrão | Foco |
|---|---|---|---|
| Service backend (`ai_rewrite.py`) | pytest + unittest.mock | `pgd-libre/tests/test_ai_rewrite_service.py` | Lógica pura: build de prompt, retry, parser de resposta. Bedrock client mockado. |
| Modelo + migração | pytest com fixture `db` | `pgd-libre/tests/test_ai_rewrite_model.py` | Persistência: insert, query rate-limit, FK |
| Endpoint REST | pytest + httpx AsyncClient | `pgd-libre/tests/test_ai_rewrite_api.py` | Headers, status codes, payloads, RBAC, 429/503. Service mockado. |
| Componente Svelte | Vitest + @testing-library/svelte | `portal/src/lib/components/AIRewritePanel.test.ts` | Render, interações, fetch mock |
| Constantes/helpers JS | Vitest puro | `portal/src/lib/ai-rewrite-constants.test.ts` | Conteúdo dos templates |
| Page integration | Vitest com mock fetch global | `portal/src/routes/meu-plano/registrar/page.test.ts` | Botão habilita, painel abre, undo, chip |
| **E2E completo** | Playwright | `portal/e2e/ai-rewrite.spec.ts` | Jornada real: login, abrir painel, mock backend, aplicar, desfazer |

**Gate de cada PR (executar localmente):**
- `pytest -q --tb=short` no pgd-libre (todos os testes, não só os novos)
- `npm run check` no portal (svelte-check + ts)
- `npm test` no portal (Vitest)
- `npm run test:e2e -- ai-rewrite.spec.ts` para o E2E novo
- Snapshot do schema GraphQL: `pytest tests/test_schema_snapshot.py` (não deve mudar — endpoint é REST)

## Pré-requisitos (uma vez, fora da implementação)

1. Mover bundle de design já baixado (`/tmp/design-ai-rewrite/pgd-libre/*`) para `portal/_design/from-claude-design/` substituindo o conteúdo anterior. O conteúdo novo é superset (inclui pactuação + landing + ai-rewrite). Antes: confirmar com `diff` quais arquivos vão sobrescritos.
2. Configurar `.env` local do `pgd-libre`:
   ```
   AWS_ACCESS_KEY_ID=...        # mesmas do .env do clipping
   AWS_SECRET_ACCESS_KEY=...
   AWS_DEFAULT_REGION=us-east-1
   BEDROCK_MODEL_ID=us.anthropic.claude-haiku-4-5-20251001-v1:0
   AI_REWRITE_RATE_LIMIT_PER_HOUR=10
   ```
3. Em produção (Cloud Run pgd-libre), adicionar essas envs via Terraform/Secret Manager — fora do escopo deste plano (anotar follow-up).

## Fase A — Backend (`pgd-libre`)

### A1. Dependência boto3

`pgd-libre/requirements.txt` (ou `pyproject.toml`): adicionar `boto3 = "^1.34"`. Reinstalar local (`pip install -r requirements-dev.txt`) e rebuild container Docker.

### A2. Configuração Pydantic

`pgd-libre/src/config.py` — adicionar campos:
```python
aws_region: str = "us-east-1"
bedrock_model_id: str = "us.anthropic.claude-haiku-4-5-20251001-v1:0"
bedrock_max_retries: int = 3
bedrock_max_tokens: int = 1500
ai_rewrite_rate_limit_per_hour: int = 10
```

### A3. Service `ai_rewrite.py` (TDD red → green)

Criar `pgd-libre/src/services/ai_rewrite.py`. Espelha o padrão de `consolidator.py` do clipping:

```python
import boto3, json, time, random
from botocore.exceptions import ClientError
from loguru import logger

AI_SYSTEM_PROMPT = """..."""  # copiar exatamente do handoff §4.1

TEMPLATES: dict[str, str] = {
    "entrega": "Estruture como uma lista numerada de ENTREGAS...",  # do handoff §4.4
    "cronologico": "...",
    "contribuicao": "...",
    "star": "...",
}

class RewriteError(Exception): ...

async def reescrever_registro(
    *, texto_atual: str, template_id: str, instrucao_adicional: str
) -> tuple[str, int, int, int]:
    """Retorna (texto_reescrito, tokens_in, tokens_out, latency_ms)."""
    # 1. Validar template_id está em TEMPLATES
    # 2. Montar messages user (texto + template_desc + instrucao)
    # 3. invoke_model com retry 3x e ThrottlingException backoff
    # 4. Extrair texto + usage.input_tokens + usage.output_tokens
    # 5. Retornar tupla
```

**Testes** (`tests/test_ai_rewrite.py`):
- `test_template_id_invalido_lanca_erro`
- `test_constroi_messages_com_system_e_user_corretos` (mockando bedrock client)
- `test_retry_em_throttling_exception` (3 tentativas com backoff)
- `test_propaga_erro_apos_max_retries`
- `test_extrai_texto_e_tokens_da_resposta`

### A4. Modelo de auditoria de uso

Tabela nova `ai_rewrite_events` (migração Alembic). Campos:
```python
class AIRewriteEvent(Base):
    id: UUID (pk)
    user_id: int (FK users)
    registro_id: UUID | None (FK avaliacoes_registros_execucao; nullable porque registro ainda pode ser rascunho não-persistido)
    template_id: str
    instrucao_custom: bool
    chars_in: int
    chars_out: int
    tokens_in: int
    tokens_out: int
    latency_ms: int
    model: str
    applied: bool = False  # vira True quando servidor clica "Aplicar"
    parent_event_id: UUID | None  # liga "aplicado" ao "gerado"
    created_at: datetime
    ip_address: str | None
```

Service helpers em `ai_rewrite.py`: `registrar_evento_geracao(...)`, `marcar_evento_aplicado(event_id)`.

### A5. Rate limit

Função helper `verificar_rate_limit(user_id) -> tuple[bool, int]` — retorna `(allowed, retry_after_seconds)`. Conta `AIRewriteEvent` da última 1h por user_id e compara com `settings.ai_rewrite_rate_limit_per_hour` (default 10).

### A6. Endpoint REST `POST /api/ai/rewrite-registro`

Criar `pgd-libre/src/api/ai_rewrite.py` (FastAPI router, similar a `src/api/sync.py`). NÃO via GraphQL — REST é mais simples para esta feature isolada e segue o padrão DGB.

```python
from fastapi import APIRouter, Depends, HTTPException, Request, Response

router = APIRouter(prefix="/api/ai", tags=["ai"])

class RewriteRequest(BaseModel):
    registro_id: uuid.UUID | None = None
    texto_atual: str  # min_length=80
    template_id: Literal["entrega", "cronologico", "contribuicao", "star"]
    instrucao_adicional: str

class RewriteResponse(BaseModel):
    event_id: uuid.UUID
    rewritten_text: str
    latency_ms: int
    tokens_in: int
    tokens_out: int

@router.post("/rewrite-registro", response_model=RewriteResponse)
async def rewrite_registro(
    payload: RewriteRequest,
    response: Response,
    request: Request,
    user: User = Depends(get_current_user),  # exige autenticação
    db: AsyncSession = Depends(get_db),
):
    # 1. Verificar user.role == SERVIDOR (apenas servidores)
    # 2. Rate limit; se excedido: raise 429 + Retry-After
    # 3. Se registro_id passado: validar que pertence ao user (segurança)
    # 4. Chamar service.reescrever_registro(...)
    # 5. service.registrar_evento_geracao(...)
    # 6. Em caso de timeout/erro do LLM: raise 503 com mensagem clara
    # 7. Retornar RewriteResponse
```

Endpoint complementar `POST /api/ai/rewrite-registro/{event_id}/applied` — marca o evento como aplicado (call quando servidor clica "Aplicar reescrita").

Registrar router em `src/main.py`.

**Testes E2E REST** (`tests/test_ai_rewrite_api.py`, mockando bedrock):
- `test_endpoint_exige_autenticacao` (401 sem cookie)
- `test_endpoint_rejeita_chefia` (403 para chefe_imediato)
- `test_endpoint_rate_limit_excedido_retorna_429` (popular 10 events, 11ª retorna 429)
- `test_endpoint_texto_curto_retorna_422` (< 80 chars)
- `test_endpoint_template_invalido_retorna_422`
- `test_endpoint_sucesso_retorna_texto_reescrito` (mock bedrock retornando texto fixo)
- `test_endpoint_503_em_throttling_persistente`
- `test_endpoint_applied_marca_evento_como_aplicado`

### A7. Regenerar snapshot do schema GraphQL

Como este endpoint é REST, não muda o schema GraphQL — só rodar `pytest tests/test_schema_snapshot.py` para garantir que nada mais quebrou.

## Fase B — Frontend (`portal`)

### B1. Componente `AIRewritePanel.svelte`

Criar `portal/src/lib/components/AIRewritePanel.svelte`. Espelha exatamente o protótipo `ai-rewrite.jsx`. Estrutura runes:

```typescript
interface Props {
  originalText: string;
  registroId?: string;  // se já persistido
  onApply: (rewrittenText: string, eventId: string) => void;
  onCancel: () => void;
}

let { originalText, registroId, onApply, onCancel }: Props = $props();

let stage = $state<'editing' | 'previewing'>('editing');
let template = $state<'entrega' | 'cronologico' | 'contribuicao' | 'star'>('entrega');
let userPrompt = $state(AI_USER_PROMPT_DEFAULT);
let showSysPrompt = $state(false);
let loading = $state(false);
let rewrittenText = $state('');
let eventId = $state('');
let error = $state('');
let warningGaps = $state(0);  // conta ocorrências de [...]
```

Constantes em `portal/src/lib/ai-rewrite-constants.ts`:
- `AI_SYSTEM_PROMPT` (apenas para exibir no `<details>` colapsável; backend é a fonte real)
- `AI_USER_PROMPT_DEFAULT`
- `AI_TEMPLATES` (4 itens com `id`, `nome`, `icon`, `desc` — sem `sample`, isso vem do backend)

Visual: copiar fielmente das estilizações inline de `ai-rewrite.jsx` (gradiente roxo `--c-status-aval`, sparkles SVG inline, side-by-side com `gridTemplateColumns: '1fr 1fr'`, alerta amarelo quando texto contém `[`).

**Função `handleRewrite()`**:
```typescript
async function handleRewrite() {
  loading = true;
  error = '';
  try {
    const res = await fetch('/api/ai/rewrite-registro', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registro_id: registroId ?? null,
        texto_atual: originalText,
        template_id: template,
        instrucao_adicional: userPrompt,
      }),
    });
    if (res.status === 429) {
      const retry = res.headers.get('Retry-After') ?? '60';
      error = `Você usou suas reescritas desta hora. Tente em ${Math.ceil(parseInt(retry)/60)} min.`;
      return;
    }
    if (res.status === 503) {
      error = 'A IA demorou demais. Tente novamente.';
      return;
    }
    if (!res.ok) {
      error = 'Algo deu errado. Tente outro template.';
      return;
    }
    const json = await res.json();
    rewrittenText = json.rewritten_text;
    eventId = json.event_id;
    warningGaps = (rewrittenText.match(/\[[^\]]+\]/g) ?? []).length;
    stage = 'previewing';
  } catch {
    error = 'Erro de conexão. Tente novamente.';
  } finally {
    loading = false;
  }
}
```

**`handleApply()`** chama `POST /api/ai/rewrite-registro/{event_id}/applied` e depois invoca `onApply(rewrittenText, eventId)`.

**Testes** (`AIRewritePanel.test.ts`):
- Render inicial: ver título "Reescrever com IA", 4 cards de template (radio), template "entrega" default
- Clicar em template muda seleção visual
- Editar `userPrompt` reflete no `<textarea>`
- Abrir `<details>` mostra `AI_SYSTEM_PROMPT`
- Clicar em "Reescrever" mostra "Reescrevendo…" e dispara fetch (mock `vi.stubGlobal('fetch', ...)`)
- Após mock response, transiciona para `previewing` e mostra side-by-side
- Texto com `[xxx]` mostra alerta amarelo com contador
- "Aplicar reescrita" chama `onApply` com o texto
- 429 mostra mensagem específica
- 503 mostra mensagem específica

### B2. Integração na rota `/meu-plano/registrar`

Modificar `portal/src/routes/meu-plano/registrar/+page.svelte`:

1. **Adicionar import**: `import AIRewritePanel from '$lib/components/AIRewritePanel.svelte';`
2. **Adicionar state**:
   ```typescript
   let aiPanelOpen = $state(false);
   let lastAIEventId = $state('');
   let preAIText = $state('');  // pra "desfazer"
   let aiAppliedAt = $state<Date | null>(null);
   ```
3. **No bloco do step 1** (Descrição), acima do `<textarea>` à direita do label, adicionar o botão pill roxo:
   ```svelte
   <button
     class="btn-ai-rewrite"
     disabled={descricao.length < 80}
     onclick={() => { aiPanelOpen = true; }}
     title={descricao.length < 80 ? 'Escreva pelo menos um parágrafo para usar a IA' : ''}
   >
     <svg>...sparkles</svg> Reescrever com IA
   </button>
   ```
4. **Logo abaixo do `<textarea>`**, renderizar painel quando aberto:
   ```svelte
   {#if aiPanelOpen}
     <AIRewritePanel
       originalText={descricao}
       onApply={(novo, eventId) => {
         preAIText = descricao;
         descricao = novo;
         lastAIEventId = eventId;
         aiAppliedAt = new Date();
         aiPanelOpen = false;
         autoSave();
       }}
       onCancel={() => { aiPanelOpen = false; }}
     />
   {/if}
   ```
5. **Chip "desfazer"** abaixo do textarea:
   ```svelte
   {#if aiAppliedAt && !descricaoFoiEditadaAposIA}
     <div class="ai-undo-chip">
       ✨ Reescrito com IA · há {tempoRelativo(aiAppliedAt)} ·
       <button onclick={() => { descricao = preAIText; aiAppliedAt = null; }}>desfazer</button>
     </div>
   {/if}
   ```
   Some quando servidor edita o textarea (rastrear com `$effect`) ou após 60s.

### B3. CSS

Adicionar em `portal/src/app.css` (ou em scoped style do `AIRewritePanel.svelte`):
- `.btn-ai-rewrite` — pill com gradient roxo, ícone sparkles, tamanho compacto
- `.ai-undo-chip` — chip discreto com botão "desfazer" inline

### B4. Banner LGPD (uma vez)

No primeiro uso, mostrar pequeno texto dentro do painel (estado editing):

> _"O texto do seu registro será enviado a um modelo de linguagem (AWS Bedrock — Claude Haiku 4.5) para reformatação. Não é usado para treinar IA. [saber mais]"_

Não bloqueante. Não precisa armazenamento por enquanto — sempre mostra. (Follow-up: marcar opt-in no perfil do user.)

## Fase C — Verificação end-to-end

1. **Setup**:
   - Backend: `cd pgd-libre && docker compose up -d`; rodar migration; rodar seed.
   - Garantir `.env` com `AWS_*` corretas.
   - Frontend: `cd portal && npm run dev`.
2. **Teste manual happy path**:
   - Login como Ana Silva → `/meu-plano/registrar`
   - Step 0: preencher datas → Próximo
   - Step 1: digitar texto vago de >80 chars (ex: "Trabalhei na migração e fiz reuniões.") → botão "Reescrever com IA" habilita
   - Clicar → painel abre em estado editing
   - Escolher template "Por entrega" → editar instrução → "Reescrever"
   - Spinner ~3s → painel mostra side-by-side com texto reorganizado
   - Se IA marcou `[precisa de detalhe]`, alerta amarelo aparece
   - "Aplicar reescrita" → textarea substituído, painel fecha, chip "desfazer" aparece
   - "desfazer" → texto original volta
3. **Testes defensivos**:
   - Texto <80 chars → botão desabilitado
   - Apertar Reescrever 11x em 1h → 11ª deve retornar 429 com mensagem
   - Bedrock indisponível (matar boto3 via mock ou desconectar internet) → 503 com mensagem
4. **Auditoria**:
   - Verificar tabela `ai_rewrite_events` ganha 1 evento por geração
   - Aplicar → mesmo evento ganha `applied = true`
5. **Local CI checks**:
   - `pytest` no pgd-libre (sem regressões; novos testes verdes)
   - `npm test && npm run check` no portal
   - `npm run test:e2e -- ai-rewrite.spec.ts` (Playwright; backend mockado via `page.route('/api/ai/rewrite-registro')`)

### E2E Playwright — `portal/e2e/ai-rewrite.spec.ts`

Cobertura mínima:
- `botão Reescrever desabilitado quando texto < 80 chars` — preencher 50 chars, esperar `disabled`
- `painel abre quando clica no botão habilitado` — preencher 100 chars, clicar, ver header "Reescrever com IA"
- `fluxo happy path: editing → previewing → applied → undo` — mock `/api/ai/rewrite-registro` retornando texto fixo; navegar pelo painel; aplicar; verificar textarea trocou; clicar "desfazer"; verificar voltou
- `429 mostra mensagem de rate limit` — mock retornando `status: 429, headers: {'Retry-After': '300'}`
- `503 mostra mensagem de erro de IA` — mock retornando 503
- `Refinar volta para editing preservando template e instrução` — happy path até previewing, clicar Refinar
- `alerta amarelo aparece quando resposta contém [...]` — mock retornando texto com `[precisa de detalhe]`

Fixture: `asServidor` de `e2e/fixtures.ts` (Ana Silva já tem PT ativo). Cada teste usa `page.route('/api/ai/rewrite-registro', route => route.fulfill({...}))` para mockar o backend — não precisa de Bedrock real no CI.

## Fora do escopo (follow-ups explícitos)

- **Reescrita no recurso de avaliação** (mencionado no handoff §11.3) — outra PR.
- **Opt-out no perfil do usuário** — outra PR.
- **Dashboard admin de adoção da feature** (taxas de aplicação por unidade) — outra PR.
- **Provisionar `AWS_*` envs em Cloud Run via Terraform** — outra PR no repo `infra/`.
- **Streaming SSE** se output ficar longo no futuro — refator não urgente.

## Arquivos críticos

### Criar
- `pgd-libre/src/services/ai_rewrite.py`
- `pgd-libre/src/api/ai_rewrite.py`
- `pgd-libre/src/models/ai_rewrite.py` (modelo `AIRewriteEvent`)
- `pgd-libre/alembic/versions/<hash>_add_ai_rewrite_events.py`
- `pgd-libre/tests/test_ai_rewrite.py`
- `pgd-libre/tests/test_ai_rewrite_api.py`
- `portal/src/lib/components/AIRewritePanel.svelte`
- `portal/src/lib/components/AIRewritePanel.test.ts`
- `portal/src/lib/ai-rewrite-constants.ts`

### Modificar
- `pgd-libre/requirements.txt` (+boto3)
- `pgd-libre/src/config.py` (+aws_region, +bedrock_*, +ai_rewrite_rate_limit_per_hour)
- `pgd-libre/src/main.py` (registrar router /api/ai)
- `pgd-libre/.env.example` (documentar envs novos)
- `portal/src/routes/meu-plano/registrar/+page.svelte` (botão + painel + chip undo)
- `portal/src/app.css` (.btn-ai-rewrite, .ai-undo-chip)
- `portal/_design/from-claude-design/` (substituir pelo bundle novo de `/tmp/design-ai-rewrite/pgd-libre/`)
