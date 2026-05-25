// pactuacao-components.jsx — Novos componentes do workflow de pactuação bilateral.
// - StatusBadgeV2 (8 estados, incluindo os 3 novos)
// - OwnershipBanner (8 variantes contextuais)
// - AssinaturaCard
// - EdicoesTimeline (com diff expansível)
// - CloneDialog
// - DecisionCard (cards de spec para as 7 decisões de UX)

// ═══════════════════════════════════════════════════════════════════════
// StatusBadge V2 — agora com os 3 novos estados
// ═══════════════════════════════════════════════════════════════════════
const STATUS_V2 = {
  RASCUNHO_PARTICIPANTE: {
    label: "Rascunho · servidor",
    cls: "sbg-draft-srv",
    icon: "edit",
    descricao: "Servidor está elaborando. Edição livre, ainda não assinou.",
  },
  AGUARDANDO_ASSINATURA_CHEFIA: {
    label: "Aguardando chefia",
    cls: "sbg-await-chf",
    icon: "clock",
    descricao: "Servidor assinou. Chefia precisa revisar e assinar.",
  },
  RASCUNHO_CHEFIA: {
    label: "Rascunho · chefia",
    cls: "sbg-draft-chf",
    icon: "edit",
    descricao: "Chefia está elaborando ou ajustando. Servidor visualiza.",
  },
  AGUARDANDO_ASSINATURA_PARTICIPANTE: {
    label: "Aguardando servidor",
    cls: "sbg-await-srv",
    icon: "clock",
    descricao: "Chefia assinou. Servidor precisa revisar e assinar.",
  },
  EM_EXECUCAO: { label: "Em execução", cls: "sbg-exec",  icon: "check",  descricao: "Ambos assinaram. Plano em vigência." },
  CONCLUIDO:   { label: "Concluído",   cls: "sbg-conc",  icon: "check",  descricao: "Período encerrado. Aguardando avaliação final." },
  AVALIADO:    { label: "Avaliado",    cls: "sbg-aval",  icon: "star",   descricao: "Avaliação publicada. Plano arquivado." },
  CANCELADO:   { label: "Cancelado",   cls: "sbg-cancel", icon: "x",     descricao: "Plano descartado antes da execução." },
};

const StatusBadgeV2 = ({ status, showIcon = true, size = "md" }) => {
  const cfg = STATUS_V2[status];
  if (!cfg) return <span className="bdg bdg-neutral">{status}</span>;
  const fontSize = size === "lg" ? 13.5 : size === "sm" ? 11 : 12;
  return (
    <span className={`sbg ${cfg.cls}`} style={{ fontSize }}>
      {showIcon && <Icon name={cfg.icon} size={fontSize + 1} stroke={2.2} />}
      {cfg.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// OwnershipBanner — "passa a bola"
// Variants: comigo-editor, comigo-revisor, com-outro, somente-leitura
// ═══════════════════════════════════════════════════════════════════════
const OwnershipBanner = ({ variant, status, atorAtual, atorOutro, diasEspera, podeAssinar, podeEditar, onAssinar, onAjustar, onVerDiff, mostrarDiff }) => {
  const VAR = {
    "comigo-editor": {
      bg: "linear-gradient(90deg, var(--c-primary-soft) 0%, rgba(230, 238, 248, 0.3) 100%)",
      border: "var(--c-primary)",
      icon: "edit",
      iconColor: "var(--c-primary)",
      iconBg: "white",
      titulo: "Este plano está com você para ajustes",
      sub: `Você pode editar livremente. Quando terminar, assine e envie para ${atorOutro}.`,
    },
    "comigo-revisor": {
      bg: "linear-gradient(90deg, var(--c-warning-soft) 0%, rgba(252, 241, 220, 0.3) 100%)",
      border: "var(--c-warning)",
      icon: "clock",
      iconColor: "var(--c-warning)",
      iconBg: "white",
      titulo: "Aguardando sua assinatura",
      sub: `${atorOutro} enviou este plano${diasEspera != null ? ` há ${diasEspera} dia${diasEspera === 1 ? "" : "s"}` : ""}.`,
    },
    "com-outro": {
      bg: "var(--c-surface-2)",
      border: "var(--c-border-strong)",
      icon: "paperPlane",
      iconColor: "var(--c-muted)",
      iconBg: "white",
      titulo: `Plano enviado para ${atorOutro}`,
      sub: `Aguardando assinatura${diasEspera != null ? ` há ${diasEspera} dia${diasEspera === 1 ? "" : "s"}` : ""}. Você acompanha mas não pode editar até receber de volta.`,
    },
  }[variant];

  if (!VAR) return null;

  return (
    <div style={{
      display: "flex", gap: 18, alignItems: "center",
      padding: "18px 22px",
      borderRadius: "var(--r-lg)",
      borderLeft: `4px solid ${VAR.border}`,
      background: VAR.bg,
      boxShadow: "var(--sh-sm)",
      marginBottom: "var(--gap-sec)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "var(--r-md)",
        background: VAR.iconBg, color: VAR.iconColor,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flex: "none", boxShadow: "var(--sh-sm)"
      }}>
        <Icon name={VAR.icon} size={22} stroke={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>{VAR.titulo}</div>
        <div style={{ color: "var(--c-ink-2)", fontSize: 13.5, marginTop: 3, lineHeight: 1.5 }}>{VAR.sub}</div>
      </div>
      {variant === "comigo-revisor" && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "none" }}>
          {mostrarDiff && <button className="btn btn-ghost btn-sm" onClick={onVerDiff}><Icon name="history" size={14} /> Ver o que mudou</button>}
          <button className="btn btn-ghost btn-sm" onClick={onAjustar}><Icon name="edit" size={14} /> Ajustar</button>
          <button className="btn btn-primary" onClick={onAssinar}><Icon name="check" size={15} stroke={2.4} /> Assinar</button>
        </div>
      )}
      {variant === "comigo-editor" && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "none" }}>
          <button className="btn btn-ghost btn-sm">Salvar e sair</button>
          <button className="btn btn-primary"><Icon name="paperPlane" size={15} /> Assinar e enviar</button>
        </div>
      )}
      {variant === "com-outro" && (
        <div style={{ flex: "none" }}>
          <button className="btn btn-ghost btn-sm"><Icon name="bell" size={14} /> Lembrar</button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AssinaturaCard
// ═══════════════════════════════════════════════════════════════════════
const AssinaturaCard = ({ ator, dataAssinatura, onAssinar, onDevolver }) => {
  const [check1, setCheck1] = React.useState(false);
  const [check2, setCheck2] = React.useState(false);
  const [check3, setCheck3] = React.useState(false);
  const pode = check1 && check2 && check3;

  if (dataAssinatura) {
    return (
      <div style={{
        padding: 22, borderRadius: "var(--r-lg)",
        background: "linear-gradient(135deg, var(--c-success-soft) 0%, white 60%)",
        border: "1px solid var(--c-success)22",
        borderLeft: "3px solid var(--c-success)",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "var(--c-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icon name="check" size={22} stroke={2.4} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>Você assinou esta versão</div>
            <div style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 2 }}>
              {ator} · em {dataAssinatura}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> Comprovante</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 24, borderRadius: "var(--r-lg)",
      background: "white",
      border: "1.5px solid var(--c-primary)33",
      borderTop: "3px solid var(--c-primary)",
      boxShadow: "var(--sh-md)",
    }}>
      <div className="kicker" style={{ color: "var(--c-primary)" }}>
        <Icon name="check" size={13} stroke={2.4} /> Antes de assinar
      </div>
      <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 16px", lineHeight: 1.55 }}>
        Confirme cada item abaixo. Sua assinatura tem peso de pactuação formal entre você e {ator || "o outro lado"}.
      </p>

      <div className="stack-12" style={{ marginBottom: 18 }}>
        {[
          { v: check1, set: setCheck1, t: "Li o plano completo — período, contribuições e critérios de avaliação" },
          { v: check2, set: setCheck2, t: "Concordo com as atividades e percentuais propostos" },
          { v: check3, set: setCheck3, t: "Estou ciente das declarações de ausência de prejuízo no exercício das atividades" },
        ].map((c, i) => (
          <label key={i} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: 12, borderRadius: "var(--r-sm)",
            background: c.v ? "var(--c-primary-soft)" : "var(--c-surface-2)",
            border: c.v ? "1px solid var(--c-primary)33" : "1px solid var(--c-border)",
            cursor: "pointer", transition: "all .12s",
          }}>
            <input type="checkbox" checked={c.v} onChange={(e) => c.set(e.target.checked)} style={{ marginTop: 2, accentColor: "var(--c-primary)", flex: "none", width: 16, height: 16 }} />
            <span style={{ fontSize: 13.5, color: "var(--c-ink-2)", lineHeight: 1.5 }}>{c.t}</span>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ flex: 1, opacity: pode ? 1 : .5, cursor: pode ? "pointer" : "not-allowed" }}
          disabled={!pode}
          onClick={onAssinar}
        >
          <Icon name="check" size={16} stroke={2.4} /> Assinar e ativar plano
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onDevolver}>
          <Icon name="edit" size={15} /> Devolver para ajustes
        </button>
      </div>

      <p style={{ fontSize: 11.5, color: "var(--c-muted)", margin: "14px 0 0", textAlign: "center", lineHeight: 1.5 }}>
        Devolver para ajustes <strong>zera a assinatura do outro lado</strong> — ele(a) precisará reassinar depois.
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// EdicoesTimeline — histórico de edições com diff expansível
// ═══════════════════════════════════════════════════════════════════════
const EdicoesTimeline = ({ items, defaultExpanded }) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded != null ? new Set([defaultExpanded]) : new Set());

  const toggle = (i) => {
    const n = new Set(expanded);
    n.has(i) ? n.delete(i) : n.add(i);
    setExpanded(n);
  };

  const TIPO = {
    criou:     { color: "var(--c-primary)",       icon: "plus",      label: "Criou plano" },
    editou:    { color: "var(--c-warning)",       icon: "edit",      label: "Editou" },
    assinou:   { color: "var(--c-success)",       icon: "check",     label: "Assinou" },
    devolveu:  { color: "var(--c-status-aval)",   icon: "arrowL",    label: "Devolveu para ajustes" },
    enviou:    { color: "var(--c-primary)",       icon: "paperPlane",label: "Enviou para revisão" },
    pactuou:   { color: "var(--c-success)",       icon: "handshake", label: "Pactuação concluída" },
  };

  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((it, i) => {
        const cfg = TIPO[it.tipo] || TIPO.editou;
        const isExpanded = expanded.has(i);
        const hasDiff = it.diff && it.diff.length > 0;
        const isLast = i === items.length - 1;

        return (
          <li key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: isLast ? 0 : 18 }}>
            {!isLast && (
              <span style={{ position: "absolute", left: 13, top: 28, bottom: 0, width: 2, background: "var(--c-divider)" }} />
            )}
            <span style={{
              width: 28, height: 28, borderRadius: 14,
              background: cfg.color, color: "white",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flex: "none", zIndex: 1,
              boxShadow: `0 0 0 3px ${cfg.color}1F`,
            }}>
              <Icon name={cfg.icon} size={14} stroke={2.3} />
            </span>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <strong style={{ fontSize: 13.5, color: "var(--c-ink)" }}>
                  {cfg.label}{it.descricao ? <span style={{ fontWeight: 500, color: "var(--c-ink-2)" }}> · {it.descricao}</span> : null}
                </strong>
                {it.papel === "servidor" && <span className="bdg bdg-info" style={{ fontSize: 10.5 }}>Servidor</span>}
                {it.papel === "chefia"  && <span className="bdg bdg-purple" style={{ fontSize: 10.5 }}>Chefia</span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>
                {it.autor} · {it.quando}
              </div>

              {hasDiff && (
                <button
                  onClick={() => toggle(i)}
                  style={{
                    marginTop: 8,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "transparent", border: 0, padding: 0,
                    color: "var(--c-primary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  <Icon name={isExpanded ? "chevD" : "chevR"} size={13} />
                  {it.diff.length} campo{it.diff.length === 1 ? "" : "s"} alterado{it.diff.length === 1 ? "" : "s"}
                </button>
              )}

              {hasDiff && isExpanded && (
                <div style={{
                  marginTop: 10,
                  background: "var(--c-surface-2)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--c-border)",
                  padding: 14,
                }}>
                  {it.diff.map((d, j) => (
                    <div key={j} style={{ paddingTop: j > 0 ? 12 : 0, borderTop: j > 0 ? "1px solid var(--c-divider)" : 0, marginTop: j > 0 ? 12 : 0 }}>
                      <div className="kicker" style={{ marginBottom: 6, fontSize: 10.5 }}>{d.campo}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 16px 1fr", gap: 10, alignItems: "center" }}>
                        <div style={{
                          padding: "8px 10px",
                          background: "var(--c-danger-soft)",
                          color: "var(--c-ink-2)",
                          borderRadius: "var(--r-sm)",
                          fontSize: 12.5, lineHeight: 1.4,
                          fontFamily: d.mono ? "var(--ff-mono)" : "inherit",
                          textDecoration: "line-through",
                          textDecorationColor: "var(--c-danger)66",
                        }}>{d.de}</div>
                        <Icon name="arrowR" size={14} className="" />
                        <div style={{
                          padding: "8px 10px",
                          background: "var(--c-success-soft)",
                          color: "var(--c-ink)",
                          borderRadius: "var(--r-sm)",
                          fontSize: 12.5, lineHeight: 1.4, fontWeight: 500,
                          fontFamily: d.mono ? "var(--ff-mono)" : "inherit",
                        }}>{d.para}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CloneDialog — modal
// ═══════════════════════════════════════════════════════════════════════
const CloneDialog = ({ plano, onCancel, onClone }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "rgba(15, 25, 50, .45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 40, zIndex: 10,
  }}>
    <div style={{
      background: "white",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--sh-lg)",
      width: 540, maxWidth: "100%",
      padding: 28,
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
        <span style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "var(--c-primary-soft)", color: "var(--c-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Icon name="file" size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>Clonar plano de trabalho</h3>
          <p style={{ fontSize: 13.5, color: "var(--c-muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
            Você está clonando o plano <strong style={{ color: "var(--c-ink)" }}>{plano}</strong>.
          </p>
        </div>
        <button className="tn-iconbtn" style={{ width: 32, height: 32 }} onClick={onCancel}><Icon name="x" size={16} /></button>
      </div>

      <div style={{
        padding: 14, background: "var(--c-surface-2)",
        borderRadius: "var(--r-md)", border: "1px solid var(--c-border)",
        fontSize: 13, color: "var(--c-ink-2)", marginBottom: 18, lineHeight: 1.55,
      }}>
        <strong style={{ color: "var(--c-ink)" }}>Vamos copiar:</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Modalidade de execução</li>
          <li>Critérios de avaliação</li>
          <li>Contribuições e percentuais</li>
        </ul>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--c-muted)" }}>
          Você poderá ajustar tudo antes de enviar para a chefia.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        <div className="field">
          <label><Icon name="calendar" size={13} className="" /> Data de início</label>
          <input className="input" defaultValue="01/08/2026" />
        </div>
        <div className="field">
          <label><Icon name="calendar" size={13} className="" /> Data de término</label>
          <input className="input" defaultValue="31/01/2027" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary" onClick={onClone}><Icon name="file" size={15} /> Clonar e editar</button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// DecisionCard — usado na seção de "7 Decisões de UX"
// ═══════════════════════════════════════════════════════════════════════
const DecisionCard = ({ num, titulo, problema, decisao, racional, children }) => (
  <div className="pgd-app" data-density="confortavel" style={{ padding: 32, background: "transparent", maxWidth: 880 }}>
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 18 }}>
      <span style={{
        width: 48, height: 48, borderRadius: 14,
        background: "var(--c-primary)", color: "white",
        fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 20,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flex: "none", letterSpacing: "-0.02em"
      }}>{num}</span>
      <div style={{ flex: 1 }}>
        <div className="pg-eyebrow">Decisão de UX</div>
        <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 6px" }}>{titulo}</h2>
        <p style={{ color: "var(--c-muted)", margin: 0, fontSize: 14, lineHeight: 1.5 }}>{problema}</p>
      </div>
    </div>

    <div className="card" style={{ borderLeft: "3px solid var(--c-success)", marginBottom: 14 }}>
      <div className="kicker" style={{ color: "var(--c-success)" }}><Icon name="check" size={13} stroke={2.5} /> Decisão</div>
      <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 15, marginTop: 8, lineHeight: 1.5 }}>{decisao}</div>
    </div>

    {racional && (
      <div className="card" style={{ background: "var(--c-surface-2)", marginBottom: children ? 14 : 0 }}>
        <div className="kicker"><Icon name="info" size={13} /> Por quê</div>
        <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "8px 0 0", lineHeight: 1.6 }}>{racional}</p>
      </div>
    )}

    {children}
  </div>
);

// Inject status badge styles
if (typeof document !== "undefined" && !document.getElementById("pgd-pact-css")) {
  const s = document.createElement("style");
  s.id = "pgd-pact-css";
  s.textContent = `
  .sbg {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px;
    border-radius: var(--r-pill);
    font-weight: 600; line-height: 1;
    white-space: nowrap;
    border: 1px solid transparent;
  }
  .sbg-draft-srv  { background: var(--c-info-soft);    color: var(--c-primary);     border-color: var(--c-primary)22; }
  .sbg-draft-chf  { background: #EFE8F7;               color: var(--c-status-aval); border-color: var(--c-status-aval)22; }
  .sbg-await-chf  { background: var(--c-warning-soft); color: var(--c-warning);     border-color: var(--c-warning)33; }
  .sbg-await-srv  { background: var(--c-warning-soft); color: var(--c-warning);     border-color: var(--c-warning)33; }
  .sbg-exec       { background: var(--c-success-soft); color: var(--c-success);     border-color: var(--c-success)22; }
  .sbg-conc       { background: var(--c-success-soft); color: var(--c-status-conc); border-color: var(--c-status-conc)22; }
  .sbg-aval       { background: #EFE8F7;               color: var(--c-status-aval); border-color: var(--c-status-aval)22; }
  .sbg-cancel     { background: #ECEFF4;               color: var(--c-muted);       border-color: var(--c-border-strong); }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  StatusBadgeV2, OwnershipBanner, AssinaturaCard, EdicoesTimeline, CloneDialog, DecisionCard,
  STATUS_V2,
});
