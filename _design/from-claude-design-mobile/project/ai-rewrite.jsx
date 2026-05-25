// ai-rewrite.jsx — Painel inline de reescrita por IA do "Registro de Execução"
//
// Comportamento:
//   1. Estado "editing": usuário escolhe template e ajusta instrução
//      adicional (user prompt). System prompt é fixo, exibido em accordion.
//   2. Estado "previewing": mostra resultado em side-by-side com a versão
//      atual. Botões Aplicar / Refinar / Cancelar.
//
// O painel não chama API real — para o protótipo, "AI_TEMPLATES[id].sample"
// é um output plausível pronto. Em produção, system + user prompts vão para
// um endpoint LLM e o resultado preenche o painel.

const AI_SYSTEM_PROMPT = `Você é um assistente especializado em comunicação institucional do serviço público federal brasileiro. Sua tarefa é REESCREVER o "Registro de Execução" mensal de um servidor participante do Programa de Gestão e Desempenho (PGD), seguindo o template indicado.

Regras invioláveis:
1. NÃO invente fatos, datas, números, sistemas ou nomes não citados pelo usuário.
2. NÃO altere o sentido das entregas relatadas.
3. Use linguagem formal, em português brasileiro, voz ativa, 1ª pessoa do singular.
4. Preserve referências a contribuições do Plano de Trabalho quando o usuário mencionar.
5. Quando o registro original for vago, NÃO complete com suposições — sinalize a lacuna entre colchetes: [precisa de detalhe].
6. Mantenha verbos no pretérito perfeito (entreguei, conduzi, documentei).
7. Se o template exigir métrica e ela não estiver no texto, deixe [quantificar] no lugar.

Saída: SOMENTE o texto reescrito, sem comentários, sem introdução, sem instruções adicionais.`;

const AI_USER_PROMPT_DEFAULT = `Reescreva o texto acima usando o template selecionado.

Destaque entregas concretas e evite generalidades. Vincule cada item, quando possível, a uma contribuição do meu plano. Se algum trecho estiver vago, sinalize com [precisa de detalhe] em vez de inventar.`;

const AI_TEMPLATES = [
  {
    id: "entrega",
    nome: "Por entrega",
    icon: "check",
    desc: "Lista cada entrega/atividade com data, resultado mensurável e contribuição vinculada.",
    sample:
`ENTREGA 1 · Migração SIAPE → PostgreSQL 16
  Vinculada à contribuição: «Migração de banco de dados para PG16» (25%)
  Resultado: 3 tabelas migradas (servidores_pgd, planos_trabalho_legado, registros_envio).
  Volume: 1.2M de linhas. Validação por checksum: aprovada. Erros: 0.

ENTREGA 2 · Mentoria técnica em IaC (Terraform)
  Vinculada à contribuição: «Mentoria semanal de novos servidores» (5%)
  Resultado: 2 sessões conduzidas com novos servidores da CGTIC. Carga total: 4h.

ENTREGA 3 · Revisão de endpoints Gov.br ID
  Vinculada à contribuição: «Revisão de APIs Gov.br ID» (30%)
  Resultado: 4 endpoints analisados; 2 documentados e publicados no portal de APIs internas.
  Pendência: 2 endpoints aguardam aval da CGRH para fechamento de SLA.

ENTREGA 4 · Apoio à CGRH no SSO unificado
  Vinculada à contribuição: «Apoio à CGRH · SSO» (10%)
  Resultado: participação em 1 reunião técnica de adesão (16/abr).`
  },
  {
    id: "cronologico",
    nome: "Cronológico",
    icon: "calendar",
    desc: "Narrativa semanal/diária. Útil quando há muita reunião e o ritmo importa.",
    sample:
`SEMANA 1 (01–05/abr)
  Iniciei o planejamento da migração SIAPE → PG16, validei o ambiente e mapeei dependências.
  Realizei a primeira sessão de mentoria com novos servidores (Terraform, 2h).

SEMANA 2 (08–12/abr)
  Executei a migração das 3 tabelas críticas (1.2M linhas) com validação por checksum.
  Iniciei revisão dos endpoints da integração Gov.br ID.

SEMANA 3 (15–19/abr)
  Apoiei a CGRH em reunião técnica de adesão ao SSO unificado (16/abr).
  Documentei 2 endpoints Gov.br ID no portal de APIs internas.

SEMANA 4 (22–30/abr)
  Conduzi a segunda sessão de mentoria com novos servidores (2h).
  Iniciei tratativa com a CGRH para aval dos demais 2 endpoints — [aguarda retorno].`
  },
  {
    id: "contribuicao",
    nome: "Por contribuição do plano",
    icon: "file",
    desc: "Agrupa por contribuição do Plano de Trabalho. Facilita a avaliação da chefia.",
    sample:
`CONTRIBUIÇÃO 1 · Migração de banco para PG16 (25%)
  • Concluí a migração de 3 tabelas críticas do SIAPE (servidores_pgd,
    planos_trabalho_legado, registros_envio) — 1.2M de linhas, 0 erros, checksum aprovado.

CONTRIBUIÇÃO 2 · Revisão de APIs Gov.br ID (30%)
  • Analisei 4 endpoints; documentei e publiquei 2 no portal de APIs internas.
  • Os outros 2 dependem do aval da CGRH — [aguarda retorno da chefia da CGRH].

CONTRIBUIÇÃO 3 · Mentoria de novos servidores (5%)
  • Conduzi 2 sessões sobre IaC com Terraform — 4h totais.

CONTRIBUIÇÃO 4 · Apoio à CGRH no SSO (10%)
  • Participei de 1 reunião técnica de adesão (16/abr).`
  },
  {
    id: "star",
    nome: "STAR",
    icon: "star",
    desc: "Situação · Tarefa · Ação · Resultado. Formal, ideal em ano de avaliação de desempenho.",
    sample:
`SITUAÇÃO
  Em abril, o órgão tinha a meta de concluir a primeira onda da modernização da camada
  de dados (PG16) e avançar na revisão das integrações Gov.br ID.

TAREFA
  Conduzir a migração das 3 tabelas críticas do SIAPE, revisar os endpoints Gov.br ID
  do meu escopo, apoiar a CGRH no SSO unificado e mentorar novos servidores.

AÇÃO
  Planejei, validei e executei a migração com checksum. Analisei e documentei endpoints.
  Conduzi sessões de mentoria. Participei de reuniões técnicas com a CGRH.

RESULTADO
  3 tabelas migradas (1.2M linhas, 0 erros). 2 de 4 endpoints documentados — [2 pendentes
  com a CGRH]. 4h de capacitação entregues. Acompanhamento da adesão ao SSO em curso.`
  },
];

// ── Component ──────────────────────────────────────────────────────────
const AIRewritePanel = ({ initialState = "editing", onApply, onCancel, originalText, defaultTemplate = "entrega" }) => {
  const [stage, setStage]       = React.useState(initialState);
  const [template, setTemplate] = React.useState(defaultTemplate);
  const [userPrompt, setUserPrompt] = React.useState(AI_USER_PROMPT_DEFAULT);
  const [showSysPrompt, setShowSysPrompt] = React.useState(false);
  const [loading, setLoading]   = React.useState(false);

  const tpl = AI_TEMPLATES.find(t => t.id === template);

  const handleRewrite = () => {
    setLoading(true);
    // Simula chamada à API. Em produção, POST {systemPrompt, userPrompt, original, templateId}
    setTimeout(() => {
      setLoading(false);
      setStage("previewing");
    }, 700);
  };

  return (
    <div style={{
      borderRadius: "var(--r-md)",
      border: "1.5px solid var(--c-status-aval)33",
      background: "linear-gradient(180deg, #FAF7FE 0%, white 60%)",
      padding: 18,
      marginTop: 12,
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--c-status-aval)", color: "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flex: "none",
        }}>
          {/* sparkles icon inline */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
            <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" opacity=".6" />
          </svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <strong style={{ fontSize: 14.5, color: "var(--c-status-aval)" }}>Reescrever com IA</strong>
            <span className="bdg" style={{ background: "#EFE8F7", color: "var(--c-status-aval)", fontSize: 10.5, padding: "2px 7px" }}>BETA</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>
            {stage === "editing" && "Escolha um template e ajuste a instrução. O sistema preserva fatos do seu texto original."}
            {stage === "previewing" && "Resultado pronto. Compare com o texto atual antes de aplicar."}
          </div>
        </div>
        <button
          className="tn-iconbtn"
          style={{ width: 30, height: 30 }}
          onClick={() => onCancel && onCancel()}
          aria-label="Fechar"
        >
          <Icon name="x" size={15} />
        </button>
      </div>

      {stage === "editing" && (
        <>
          {/* Template selector */}
          <div style={{ marginBottom: 14 }}>
            <div className="kicker" style={{ marginBottom: 8 }}>Template de estrutura</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {AI_TEMPLATES.map(t => (
                <label key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    padding: 12,
                    border: template === t.id
                      ? "2px solid var(--c-status-aval)"
                      : "1.5px solid var(--c-border-strong)",
                    borderRadius: "var(--r-sm)",
                    background: template === t.id ? "white" : "rgba(255,255,255,0.6)",
                    cursor: "pointer", transition: "all .12s",
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: template === t.id ? "var(--c-status-aval)" : "#EFE8F7",
                    color: template === t.id ? "white" : "var(--c-status-aval)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flex: "none", marginTop: 1,
                  }}>
                    <Icon name={t.icon} size={14} stroke={2} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--c-ink)" }}>{t.nome}</div>
                    <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* User prompt */}
          <div className="field" style={{ marginBottom: 12 }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Instrução adicional para a IA</span>
              <span style={{ fontSize: 11, color: "var(--c-muted)", fontWeight: 500 }}>opcional · você pode editar</span>
            </label>
            <textarea
              className="textarea"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              style={{ minHeight: 70, fontSize: 13 }}
            />
          </div>

          {/* System prompt accordion */}
          <details
            open={showSysPrompt}
            onToggle={(e) => setShowSysPrompt(e.target.open)}
            style={{
              background: "rgba(92, 45, 145, 0.04)",
              border: "1px solid rgba(92, 45, 145, 0.12)",
              borderRadius: "var(--r-sm)",
              padding: "10px 12px",
              marginBottom: 16,
            }}
          >
            <summary style={{
              cursor: "pointer", listStyle: "none",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12.5, fontWeight: 600, color: "var(--c-status-aval)",
            }}>
              <Icon name={showSysPrompt ? "chevD" : "chevR"} size={13} stroke={2.2} />
              Ver prompt do sistema (fixo, não editável)
            </summary>
            <pre style={{
              fontFamily: "var(--ff-mono)", fontSize: 11.5, lineHeight: 1.55,
              color: "var(--c-ink-2)",
              whiteSpace: "pre-wrap", marginTop: 10, marginBottom: 0,
              maxHeight: 200, overflow: "auto",
            }}>{AI_SYSTEM_PROMPT}</pre>
          </details>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onCancel && onCancel()}>Cancelar</button>
            <button
              className="btn btn-sm"
              style={{ background: "var(--c-status-aval)", color: "white", borderColor: "var(--c-status-aval)" }}
              onClick={handleRewrite}
              disabled={loading}
            >
              {loading
                ? <><Icon name="refresh" size={14} className="spinning" /> Reescrevendo…</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg> Reescrever</>
              }
            </button>
          </div>
        </>
      )}

      {stage === "previewing" && (
        <>
          {/* Template + instruction badges */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span className="bdg" style={{ background: "var(--c-status-aval)", color: "white", fontSize: 11 }}>
              <Icon name={tpl.icon} size={11} stroke={2.4} /> {tpl.nome}
            </span>
            <span style={{ fontSize: 11.5, color: "var(--c-muted)" }}>· {(userPrompt || "").split(/\s+/).length} palavras de instrução</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: "auto", fontSize: 11.5, padding: "4px 8px" }}
              onClick={() => setStage("editing")}
            >
              <Icon name="edit" size={11} /> Refinar
            </button>
          </div>

          {/* Side-by-side antes/depois */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Texto atual</div>
              <pre style={{
                background: "var(--c-surface-2)",
                border: "1px solid var(--c-border)",
                borderRadius: "var(--r-sm)",
                padding: 12, fontSize: 11.5, lineHeight: 1.55,
                fontFamily: "var(--ff-body)",
                whiteSpace: "pre-wrap", margin: 0,
                maxHeight: 280, overflow: "auto",
                color: "var(--c-muted)",
              }}>{originalText || "(seu texto)"}</pre>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--c-status-aval)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
                Proposta da IA
              </div>
              <pre style={{
                background: "white",
                border: "1.5px solid var(--c-status-aval)33",
                borderRadius: "var(--r-sm)",
                padding: 12, fontSize: 11.5, lineHeight: 1.55,
                fontFamily: "var(--ff-body)",
                whiteSpace: "pre-wrap", margin: 0,
                maxHeight: 280, overflow: "auto",
                color: "var(--c-ink)",
              }}>{tpl.sample}</pre>
            </div>
          </div>

          {/* Aviso de [precisa de detalhe] */}
          {tpl.sample.includes("[") && (
            <div style={{
              background: "var(--c-warning-soft)",
              border: "1px solid rgba(199, 116, 0, 0.22)",
              borderRadius: "var(--r-sm)",
              padding: "10px 12px", marginBottom: 12,
              display: "flex", gap: 10, alignItems: "flex-start",
              fontSize: 12, color: "var(--c-ink-2)", lineHeight: 1.5,
            }}>
              <Icon name="info" size={14} className="" />
              <div>
                <strong style={{ color: "var(--c-warning)" }}>2 lacunas marcadas</strong> com{" "}
                <code style={{ fontFamily: "var(--ff-mono)", background: "white", padding: "1px 5px", borderRadius: 3, fontSize: 11.5 }}>[ ... ]</code>.
                A IA não inventa fatos — revise e preencha antes de submeter.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onCancel && onCancel()}>Cancelar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setStage("editing")}>
              <Icon name="edit" size={13} /> Ajustar instrução
            </button>
            <button
              className="btn btn-sm"
              style={{ background: "var(--c-status-aval)", color: "white", borderColor: "var(--c-status-aval)" }}
              onClick={() => onApply && onApply(tpl.sample)}
            >
              <Icon name="check" size={13} stroke={2.4} /> Aplicar reescrita
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// CSS pra spinner
if (typeof document !== "undefined" && !document.getElementById("ai-rewrite-css")) {
  const s = document.createElement("style");
  s.id = "ai-rewrite-css";
  s.textContent = `
    .spinning { animation: ai-spin 1s linear infinite; }
    @keyframes ai-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { AIRewritePanel, AI_SYSTEM_PROMPT, AI_USER_PROMPT_DEFAULT, AI_TEMPLATES });
