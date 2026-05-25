// pactuacao-mobile.jsx — Mobile das telas-chave do workflow de pactuação
// - Servidor revisa PT no celular (caso comum: notificação no caminho do trabalho)
// - Chefia assina PT recebido no celular
// - Estado vazio /meu-plano no mobile (criar/clonar)

const USR_SRV_M = { name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" };

// Pequenos componentes mobile (reuso parcial do screens-mobile.jsx existente)
const PactNav = ({ title, back, right }) => (
  <div style={{
    height: 52, padding: "0 16px",
    display: "flex", alignItems: "center", gap: 12,
    borderBottom: "1px solid var(--c-border)",
    background: "white"
  }}>
    {back && <button className="tn-iconbtn" style={{ width: 36, height: 36, marginLeft: -8 }}><Icon name="arrowL" size={18} /></button>}
    <div style={{ flex: 1, fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>{title}</div>
    {right}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// Mobile · /meu-plano vazio (servidor)
// ═══════════════════════════════════════════════════════════════════════
const ScreenMobileMeuPlanoVazio = () => (
  <IOSDevice width={402} height={874}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)" }} className="pgd-app" data-density="confortavel">
      <PactNav title="Meu Plano" />
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <div style={{ textAlign: "center", padding: "16px 8px 24px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--c-primary-soft)", color: "var(--c-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="handshake" size={30} stroke={1.4} />
          </div>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 19, fontWeight: 700, margin: "14px 0 4px" }}>
            Sem plano em vigência
          </h2>
          <p style={{ fontSize: 13, color: "var(--c-muted)", margin: 0, lineHeight: 1.55 }}>
            Crie seu próximo plano. Sua chefia precisa concordar antes do início.
          </p>
        </div>

        {/* CTA primário grande */}
        <a href="#" style={{
          display: "block", padding: 18,
          background: "var(--c-primary)",
          borderRadius: "var(--r-md)",
          textDecoration: "none", color: "white",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: "rgba(255,255,255,.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon name="plus" size={20} stroke={2.2} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Criar plano do zero</div>
              <div style={{ fontSize: 12, opacity: .85, marginTop: 2 }}>Wizard guiado em 5 passos</div>
            </div>
            <Icon name="arrowR" size={18} />
          </div>
        </a>

        <a href="#" style={{
          display: "block", padding: 16,
          background: "white",
          border: "1.5px solid var(--c-border-strong)",
          borderRadius: "var(--r-md)",
          textDecoration: "none", color: "inherit",
          marginBottom: 18,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "#EFE8F7", color: "var(--c-status-aval)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon name="file" size={18} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Clonar plano anterior</div>
              <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>PT-2025-08 disponível</div>
            </div>
            <Icon name="arrowR" size={16} className="" />
          </div>
        </a>

        {/* Como funciona */}
        <div className="card" style={{ borderLeft: "3px solid var(--c-info)", padding: 14 }}>
          <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Como funciona</div>
          <ol style={{ paddingLeft: 18, fontSize: 12, color: "var(--c-ink-2)", margin: "8px 0 0", lineHeight: 1.7 }}>
            <li>Você cria o plano (rascunho)</li>
            <li>Edita e ajusta à vontade</li>
            <li>Assina e envia para a chefia</li>
            <li>Chefia revisa e assina</li>
            <li>Plano entra em execução</li>
          </ol>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderTop: "1px solid var(--c-border)", background: "white", padding: "8px 0 28px", display: "flex" }}>
        {[
          { id: "home",  lbl: "Início",   icon: "home" },
          { id: "plano", lbl: "Meu Plano", icon: "file", active: true },
          { id: "hist",  lbl: "Histórico", icon: "history" },
          { id: "notif", lbl: "Alertas",   icon: "bell" },
        ].map(t => (
          <div key={t.id} style={{ flex: 1, textAlign: "center", color: t.active ? "var(--c-primary)" : "var(--c-muted)", padding: "6px 0" }}>
            <Icon name={t.icon} size={22} stroke={t.active ? 2.2 : 1.6} />
            <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: t.active ? 700 : 500 }}>{t.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  </IOSDevice>
);

// ═══════════════════════════════════════════════════════════════════════
// Mobile · /meu-plano/[id]/revisar (servidor)
// ═══════════════════════════════════════════════════════════════════════
const ScreenMobileMeuPlanoRevisar = () => {
  const [check1, setCheck1] = React.useState(false);
  const [check2, setCheck2] = React.useState(false);
  const [check3, setCheck3] = React.useState(false);
  const pode = check1 && check2 && check3;
  return (
    <IOSDevice width={402} height={874}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)" }} className="pgd-app" data-density="confortavel">
        <PactNav title="Revisar plano" back right={<button className="tn-iconbtn" style={{ width: 36, height: 36, marginRight: -4 }}><Icon name="dots" size={18} /></button>} />

        <div style={{ flex: 1, overflow: "auto", padding: "0 0 100px" }}>
          {/* Banner ownership */}
          <div style={{
            padding: 16, margin: 12,
            background: "var(--c-warning-soft)",
            borderRadius: "var(--r-md)",
            borderLeft: "4px solid var(--c-warning)",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <Icon name="clock" size={18} stroke={2} className="" />
              <strong style={{ fontSize: 14 }}>Aguardando sua assinatura</strong>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>
              Carlos Mendes ajustou o plano e devolveu há <strong>1 dia</strong>.
            </p>
          </div>

          {/* O que mudou */}
          <div style={{ padding: "0 16px", marginBottom: 14 }}>
            <div className="kicker" style={{ marginBottom: 8 }}><Icon name="alert" size={13} /> A chefia ajustou 2 campos</div>
            <div style={{ padding: 12, background: "white", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Contribuição 1 · percentual</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ flex: 1, padding: "6px 8px", background: "var(--c-danger-soft)", borderRadius: 4, fontSize: 12.5, textDecoration: "line-through" }}>40%</span>
                <Icon name="arrowR" size={12} />
                <span style={{ flex: 1, padding: "6px 8px", background: "var(--c-success-soft)", borderRadius: 4, fontSize: 12.5, fontWeight: 600 }}>35%</span>
              </div>
            </div>
            <div style={{ padding: 12, background: "white", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)" }}>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Critério 4</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ padding: "6px 8px", background: "var(--c-danger-soft)", borderRadius: 4, fontSize: 12, textDecoration: "line-through" }}>Iniciativa em proposição de melhorias</span>
                <span style={{ padding: "6px 8px", background: "var(--c-success-soft)", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>Iniciativa em proposição de melhorias documentadas mensalmente</span>
              </div>
            </div>
            <a href="#" style={{ display: "inline-flex", gap: 4, alignItems: "center", marginTop: 10, color: "var(--c-primary)", fontSize: 12.5, fontWeight: 600 }}>
              <Icon name="history" size={12} /> Ver histórico completo
            </a>
          </div>

          {/* Plano resumido */}
          <div style={{ padding: "0 16px", marginBottom: 14 }}>
            <div className="kicker" style={{ marginBottom: 8 }}>Plano completo</div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Período</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, marginTop: 2 }}>ago/26 → jan/27</div></div>
                <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Carga</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, marginTop: 2 }}>30 h/sem</div></div>
              </div>
              <ModalidadeBadge codigo={3} />
              <div className="divider" style={{ margin: "12px 0" }} />
              <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700, marginBottom: 8 }}>4 contribuições · 100%</div>
              {[40, 25, 20, 15].map((p, i) => <div key={i} className="bar thin" style={{ marginBottom: 4 }}><i style={{ width: `${p}%` }} /></div>)}
            </div>
          </div>

          {/* Confirmações */}
          <div style={{ padding: "0 16px" }}>
            <div className="kicker" style={{ marginBottom: 10 }}><Icon name="check" size={13} stroke={2.5} /> Antes de assinar</div>
            <div className="stack-12">
              {[
                { v: check1, set: setCheck1, t: "Li o plano completo" },
                { v: check2, set: setCheck2, t: "Concordo com atividades e percentuais" },
                { v: check3, set: setCheck3, t: "Ciente das declarações de ausência de prejuízo" },
              ].map((c, i) => (
                <label key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: 12,
                  background: c.v ? "var(--c-primary-soft)" : "white",
                  border: c.v ? "1px solid var(--c-primary)33" : "1px solid var(--c-border)",
                  borderRadius: "var(--r-sm)",
                }}>
                  <input type="checkbox" checked={c.v} onChange={(e) => c.set(e.target.checked)} style={{ marginTop: 2, accentColor: "var(--c-primary)", flex: "none" }} />
                  <span style={{ fontSize: 13, color: "var(--c-ink-2)", lineHeight: 1.45 }}>{c.t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky bottom CTAs */}
        <div style={{ padding: "10px 16px 28px", background: "white", borderTop: "1px solid var(--c-border)", display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: "none", padding: "12px 14px" }}><Icon name="edit" size={15} /></button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: "13px 16px", fontSize: 14, opacity: pode ? 1 : .5 }}
            disabled={!pode}
          >
            <Icon name="check" size={16} stroke={2.4} /> Assinar e ativar
          </button>
        </div>
      </div>
    </IOSDevice>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// Mobile · Chefia revisa plano (notificação no caminho)
// ═══════════════════════════════════════════════════════════════════════
const ScreenMobileChefiaRevisar = () => (
  <IOSDevice width={402} height={874}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)" }} className="pgd-app" data-density="confortavel">
      <PactNav title="Plano de Nitai" back right={<button className="tn-iconbtn" style={{ width: 36, height: 36, marginRight: -4 }}><Icon name="dots" size={18} /></button>} />

      <div style={{ flex: 1, overflow: "auto", padding: "0 0 100px" }}>
        {/* Servidor header */}
        <div style={{ padding: 16, background: "white", borderBottom: "1px solid var(--c-border)", display: "flex", gap: 12, alignItems: "center" }}>
          <span className="av av-md" style={{ background: avatarColor("Nitai Bezerra"), color: "white" }}>NB</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>Nitai Bezerra</div>
            <div style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "var(--ff-mono)" }}>SIAPE 1928374 · CGTIC</div>
          </div>
          <StatusBadgeV2 status="AGUARDANDO_ASSINATURA_CHEFIA" size="sm" />
        </div>

        {/* Banner */}
        <div style={{
          margin: 12, padding: 14,
          background: "var(--c-warning-soft)",
          borderRadius: "var(--r-md)",
          borderLeft: "4px solid var(--c-warning)"
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
            <Icon name="clock" size={16} stroke={2} className="" />
            <strong style={{ fontSize: 14 }}>Aguardando sua assinatura</strong>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: 0 }}>Nitai enviou há <strong>2 dias</strong>.</p>
        </div>

        {/* Plano resumido */}
        <div style={{ padding: "0 16px", marginBottom: 14 }}>
          <div className="card" style={{ padding: 14 }}>
            <div className="kicker" style={{ marginBottom: 10 }}>Resumo do plano</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Período</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, marginTop: 2 }}>ago → jan</div></div>
              <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Modalidade</div><div style={{ marginTop: 2 }}><ModalidadeBadge codigo={3} /></div></div>
              <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Carga</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, marginTop: 2 }}>30 h/sem</div></div>
              <div><div style={{ fontSize: 10.5, color: "var(--c-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Contribuições</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, marginTop: 2 }}>4 · 100%</div></div>
            </div>
            <a href="#" style={{ marginTop: 12, fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
              Ver plano completo <Icon name="arrowR" size={12} />
            </a>
          </div>
        </div>

        {/* Contribuições */}
        <div style={{ padding: "0 16px", marginBottom: 14 }}>
          <div className="kicker" style={{ marginBottom: 8 }}>Contribuições propostas</div>
          {[
            { t: 1, ttl: "Implementação do módulo de cadastro PGD", pct: 40 },
            { t: 1, ttl: "Migração de banco para PG16",              pct: 25 },
            { t: 2, ttl: "Sustentação e atendimento",                pct: 20 },
            { t: 3, ttl: "Apoio à CGRH · SSO",                       pct: 15 },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", background: "white", borderRadius: "var(--r-sm)", marginBottom: 6, border: "1px solid var(--c-border)" }}>
              <span className={`contrib-tipo t${c.t}`} style={{ width: 22, height: 22, fontSize: 11 }}>{c.t}</span>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{c.ttl}</div>
              <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13 }}>{c.pct}%</span>
            </div>
          ))}
        </div>

        {/* Assinatura status */}
        <div style={{ padding: "0 16px" }}>
          <div className="kicker" style={{ marginBottom: 8 }}>Status</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 10, background: "var(--c-success-soft)", borderRadius: "var(--r-sm)", marginBottom: 6 }}>
            <span style={{ width: 24, height: 24, borderRadius: 12, background: "var(--c-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={12} stroke={2.4} /></span>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>Nitai assinou</span>
            <span style={{ fontSize: 11, color: "var(--c-muted)" }}>12 mai</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 10, background: "var(--c-warning-soft)", border: "1.5px solid var(--c-warning)", borderRadius: "var(--r-sm)" }}>
            <span style={{ width: 24, height: 24, borderRadius: 12, background: "white", border: "2px solid var(--c-warning)", color: "var(--c-warning)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon name="clock" size={11} stroke={2.2} /></span>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>Você · pendente</span>
            <span style={{ fontSize: 11, color: "var(--c-warning)", fontWeight: 600 }}>há 2d</span>
          </div>
        </div>
      </div>

      {/* Sticky CTAs */}
      <div style={{ padding: "10px 16px 28px", background: "white", borderTop: "1px solid var(--c-border)", display: "flex", gap: 8 }}>
        <button className="btn btn-ghost" style={{ flex: "none", padding: "12px 14px" }}><Icon name="edit" size={15} /></button>
        <button className="btn btn-primary" style={{ flex: 1, padding: "13px 16px", fontSize: 14 }}>
          <Icon name="check" size={16} stroke={2.4} /> Revisar e assinar
        </button>
      </div>
    </div>
  </IOSDevice>
);

Object.assign(window, {
  ScreenMobileMeuPlanoVazio, ScreenMobileMeuPlanoRevisar, ScreenMobileChefiaRevisar,
});
