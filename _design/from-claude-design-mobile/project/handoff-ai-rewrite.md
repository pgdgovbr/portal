# Handoff · Reescrever com IA · tela "Registrar Execução"

Para o **Claude Code**. Esta é uma feature de inovação com GenAI no PGD Libre, escopada para a tela de registro mensal de execução do servidor. Já desenhei o comportamento completo e tem protótipo funcional em `PGD Libre.html`, artboards **07b** e **07c**.

## 1. Por que essa feature

O Registro de Execução mensal é o pedaço do PGD que **mais sofre com texto vago, mal estruturado e difícil de avaliar**. A chefia precisa atribuir nota e justificar — texto ruim do servidor leva a:
- Avaliações injustas (chefia "interpreta" o vago para baixo)
- Recursos (servidor contesta e perde tempo de todo mundo)
- Risco jurídico (registros sem rastro auditável de entregas)

A feature **não substitui o texto do servidor por geração automática** — ela **reestrutura** o que ele já escreveu segundo um template, preservando todos os fatos. Quando faltar informação, sinaliza com `[precisa de detalhe]` em vez de inventar.

## 2. UX em uma frase

> "Você escreve do seu jeito. A IA estrutura, você revisa, você decide aplicar."

## 3. Comportamento detalhado

### 3.1 Onde aparece
Tela: `/meu-plano/registrar` (`portal/src/routes/meu-plano/registrar/+page.svelte`)

Botão **"Reescrever com IA"** aparece ao lado direito do label "Descrição dos trabalhos executados", **acima do textarea**. Visual: pill com gradiente roxo (`--c-status-aval` → variant clara), ícone de sparkles, texto branco. Discreto mas visível.

Pré-condição para o botão aparecer: textarea tem **pelo menos 80 caracteres**. Antes disso, fica desabilitado com tooltip "Escreva pelo menos um parágrafo para usar a IA".

### 3.2 Estado "editing" (painel aberto, configurando)

Quando clica, expande **inline abaixo do textarea** um card roxo claro com:

1. **Header** — ícone sparkles + título "Reescrever com IA" + badge "BETA" + texto curto explicando.
2. **Template de estrutura** (radio cards, grid 2×2):
   - **Por entrega** — lista cada entrega com data e resultado mensurável
   - **Cronológico** — narrativa semana a semana
   - **Por contribuição do plano** — agrupado pelas contribuições do PT vigente
   - **STAR** — Situação, Tarefa, Ação, Resultado
3. **Instrução adicional** (textarea, editável) — vem preenchido com o user prompt default. Usuário pode editar antes de aplicar. Default abaixo.
4. **"Ver prompt do sistema"** (`<details>` colapsável, fechado por padrão) — mostra o system prompt em monospace, **somente leitura**. Transparência intencional.
5. **Ações** — botões "Cancelar" (ghost) e "Reescrever" (primário roxo). Durante a chamada, mostra spinner "Reescrevendo…" no botão.

### 3.3 Estado "previewing" (resposta da IA chegou)

Mesmo card transiciona para:

1. **Header atualizado** — badge do template escolhido + contagem de palavras da instrução + link "Refinar" (volta para editing).
2. **Side-by-side** (grid 1:1):
   - **Texto atual** (cinza, gray-50) — `originalText`
   - **Proposta da IA** (borda roxa) — resposta do LLM
3. **Alerta de lacunas** (amarelo) se a resposta contém `[...]` — diz quantas lacunas a IA marcou e que devem ser preenchidas antes de submeter.
4. **Ações** (3 botões):
   - **Cancelar** — fecha o painel, texto original preservado
   - **Ajustar instrução** — volta para "editing" com template e instrução preservados
   - **Aplicar reescrita** — substitui o `textarea`, fecha o painel, gera 1 entrada de **histórico** ("Reescrito com IA · template X · {timestamp}")

### 3.4 Pós-aplicação

- O texto **vai pro `textarea` normal** (editável). Servidor pode ajustar livremente depois.
- Auto-save dispara em seguida (debounce 800ms como já implementado).
- Aparece um chip discreto abaixo do textarea: **"✨ Reescrito com IA · há 4s · desfazer"** (clicar em "desfazer" reverte para o texto pre-IA, com toast confirmando). O chip some quando o servidor edita o textarea ou após 60s.

## 4. Prompts

### 4.1 System prompt (FIXO — não exposto no UI como editável)

Cole literalmente. Tem regras inegociáveis (não inventar, preservar fatos, sinalizar lacunas):

```
Você é um assistente especializado em comunicação institucional do serviço público federal brasileiro. Sua tarefa é REESCREVER o "Registro de Execução" mensal de um servidor participante do Programa de Gestão e Desempenho (PGD), seguindo o template indicado.

Regras invioláveis:
1. NÃO invente fatos, datas, números, sistemas ou nomes não citados pelo usuário.
2. NÃO altere o sentido das entregas relatadas.
3. Use linguagem formal, em português brasileiro, voz ativa, 1ª pessoa do singular.
4. Preserve referências a contribuições do Plano de Trabalho quando o usuário mencionar.
5. Quando o registro original for vago, NÃO complete com suposições — sinalize a lacuna entre colchetes: [precisa de detalhe].
6. Mantenha verbos no pretérito perfeito (entreguei, conduzi, documentei).
7. Se o template exigir métrica e ela não estiver no texto, deixe [quantificar] no lugar.

Saída: SOMENTE o texto reescrito, sem comentários, sem introdução, sem instruções adicionais.
```

### 4.2 User prompt default (EDITÁVEL)

Pré-preenche o textarea de "Instrução adicional". É um exemplo didático que **funciona de verdade** se enviado como está:

```
Reescreva o texto acima usando o template selecionado.

Destaque entregas concretas e evite generalidades. Vincule cada item, quando possível, a uma contribuição do meu plano. Se algum trecho estiver vago, sinalize com [precisa de detalhe] em vez de inventar.
```

### 4.3 Payload final que vai pro LLM

Sugestão de estrutura (mais didático que enviar tudo como string única):

```jsonc
{
  "messages": [
    { "role": "system",
      "content": "<AI_SYSTEM_PROMPT acima>" },
    { "role": "user",
      "content":
        "## Registro original do servidor:\n\n"
      + "{texto do textarea}\n\n"
      + "## Template solicitado: {nome do template}\n\n"
      + "{descrição completa do template — ver seção 4.4}\n\n"
      + "## Instrução adicional do usuário:\n\n"
      + "{user prompt — default ou editado}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 1500
}
```

`temperature: 0.3` deliberado — queremos reorganização determinística, não criatividade.

### 4.4 Definição dos 4 templates

Cada template no front carrega `{id, nome, icon, desc, prompt}`. O `prompt` é o que vai no `system + user message` para guiar a IA. Sugestão:

| ID | Nome | Prompt para a IA |
|---|---|---|
| `entrega` | Por entrega | "Estruture como uma lista numerada de ENTREGAS. Para cada entrega: nome no topo, contribuição vinculada do PT (se houver), e linhas curtas com Resultado, Volume/Quantidade, Pendências. Use formato hierárquico com indentação." |
| `cronologico` | Cronológico | "Estruture em blocos semanais (SEMANA 1, SEMANA 2…). Em cada semana, parágrafo único descrevendo atividades em ordem temporal. Use datas quando o usuário fornecer." |
| `contribuicao` | Por contribuição do plano | "Agrupe as entregas POR CONTRIBUIÇÃO do Plano de Trabalho. Cada bloco começa com o nome da contribuição e percentual. Embaixo, bullets com as atividades vinculadas àquela contribuição." |
| `star` | STAR | "Estruture em 4 blocos exatamente nesta ordem: SITUAÇÃO (contexto do mês), TAREFA (o que tinha que fazer), AÇÃO (o que fez), RESULTADO (entregas concretas mensuráveis). Mantenha 1 parágrafo curto por bloco." |

## 5. Endpoint backend

Sugestão: `POST /api/ai/rewrite-registro` no `pgd-libre` (FastAPI), não direto pro provider de LLM no front. Razões:
1. **Esconder API key** do provider
2. **Auditoria** — toda chamada gravada (servidor, plano, registro_id, template_id, texto antes, texto depois, latência, tokens)
3. **Rate limit** — 10 chamadas/hora por servidor (caso de abuso ou erro de loop)
4. **Fallback** — se o LLM falhar/timeout, retorna 503 com mensagem clara, sem cair em produção

```python
# Pseudocódigo
@router.post("/api/ai/rewrite-registro")
async def rewrite_registro(
    payload: RewriteRequest,
    user: User = Depends(current_user),
):
    # 1. Validar: user é servidor e o registro_id pertence a ele
    # 2. Rate limit: 10/hora
    # 3. Carregar template descrição
    # 4. Montar messages (system + user)
    # 5. Chamar Anthropic/OpenAI (config via env)
    # 6. Logar AuditEvent { tipo: "ai_rewrite_registro", ... }
    # 7. Retornar { rewritten_text, latency_ms, tokens_in, tokens_out }
```

Schema `RewriteRequest`:
```python
class RewriteRequest(BaseModel):
    registro_id: UUID           # registro de execução em rascunho
    texto_atual: str            # snapshot do que está no textarea
    template_id: Literal["entrega", "cronologico", "contribuicao", "star"]
    instrucao_adicional: str    # user prompt (pode ser o default)
```

## 6. Estados a tratar (UX defensivo)

| Caso | Comportamento |
|---|---|
| Texto < 80 chars | Botão desabilitado, tooltip "Escreva pelo menos um parágrafo" |
| LLM responde > 3s | Spinner com "Pensando…" (não "Reescrevendo…" — mais humano) |
| LLM timeout (15s) | Painel mostra erro: "A IA demorou demais. Tente novamente." + botão Refazer |
| LLM retorna texto vazio | "Algo deu errado. Tente outro template." + botão Refazer |
| LLM retorna lixo (heurística: > 2× tamanho do original) | "Resposta inesperada. Verifique antes de aplicar." (alerta amarelo, ainda mostra preview) |
| Servidor sem rascunho ativo (registro_id inválido) | 403 — não chega no botão |
| Rate limit excedido | 429 com header `Retry-After` — front mostra "Você usou suas 10 reescritas desta hora. Tente em X min." |

## 7. Auditoria & telemetria

Toda chamada gera evento no log de auditoria existente:

```python
AuditEvent(
    tipo="ai_rewrite_registro",
    ator_id=user.id,
    entidade_id=registro_id,
    payload={
        "template": template_id,
        "instrucao_custom": instrucao_adicional != AI_USER_PROMPT_DEFAULT,
        "chars_in": len(texto_atual),
        "chars_out": len(rewritten_text),
        "tokens_in": ..., "tokens_out": ...,
        "applied": False,  # atualizado para True se o servidor clicar Aplicar
        "model": "claude-haiku-4-5",  # ou similar
    }
)
```

Quando o servidor clica **Aplicar**, dispara um segundo evento `ai_rewrite_applied` que liga ao primeiro pelo `parent_event_id`. Isso permite medir:
- **Taxa de aplicação** (quantas reescritas viram texto final?)
- **Taxa de refino** (quantos clicam "Ajustar instrução" antes de aplicar?)
- **Templates favoritos**
- **Quanto a feature é usada** (% dos registros que passaram pela IA)

## 8. Privacidade & LGPD

- O texto enviado ao LLM **NÃO é dado sensível por natureza** (descrição de trabalho do servidor), mas é **dado pessoal** (vinculado ao registro nominal).
- Política sugerida:
  - Provider de LLM deve ter contrato com cláusula de **não-treinamento** (Anthropic Claude tem essa garantia padrão na API enterprise)
  - Banner discreto no painel "Editing": _"O texto do seu registro será enviado a um modelo de linguagem ({provider}) para reformatação. Não é usado para treinar IA. [política de privacidade]"_ — pode ser link de "saber mais", não texto bloqueante.
  - Servidor pode optar por desabilitar a feature no perfil (default: habilitada).

## 9. Arquivos do protótipo (referência visual)

```
ai-rewrite.jsx              ← componente AIRewritePanel + constantes
screens-servidor.jsx        ← ScreenRegistrar atualizado para integrar o painel
PGD Libre.html              ← carrega ai-rewrite.jsx antes dos screens
app.jsx                     ← artboards 07b e 07c expõem os 2 estados
```

Para ver:
- Artboard **07 · Registrar Execução (wizard)** — estado padrão, botão "Reescrever com IA" visível
- Artboard **07b · Registrar + IA (configurar reescrita)** — painel aberto em "editing"
- Artboard **07c · Registrar + IA (revisar resultado)** — painel em "previewing" com side-by-side

## 10. Ordem sugerida de implementação

1. **Endpoint backend** (`POST /api/ai/rewrite-registro`) com auditoria. Sem UI ainda.
2. **Componente Svelte `AIRewritePanel.svelte`** isolado, com mock de resposta para desenvolver UX sem queimar tokens.
3. **Integração na rota `/meu-plano/registrar`** — botão, painel, aplicação, chip de undo.
4. **Conectar painel ao endpoint real**, remover mock.
5. **Telemetria** — eventos de auditoria `ai_rewrite_*`.
6. **Rate limit** + estados defensivos da §6.
7. **Banner LGPD** + opção de opt-out no perfil.
8. **Dashboard admin** (futuro) — métricas de adoção da feature por unidade.

## 11. Decisões abertas (perguntar antes de implementar)

1. **Provider do LLM**: Anthropic, OpenAI ou via Bedrock/Vertex? (Recomendo Anthropic direto — não-treinamento garantido, latência boa)
2. **Custo previsto**: 10 reescritas/mês × 5000 servidores × ~2K tokens = ~100M tokens/mês. Em Claude Haiku ≈ US$ 80/mês. Aceitável?
3. **Reescrita também no recurso de avaliação?** O texto do recurso é mais sensível (contestação). Em uma versão futura, mesma feature pode existir lá.
4. **Tradução** para outras línguas: o produto é PT-BR, mas pessoa de Libras (uso de IA pode aproximar). Fora deste escopo.

---

Se algo ficar dúbio, abra `PGD Libre.html`, navegue até o artboard 07b/07c e me chame.
