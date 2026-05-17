// landing-mobile.jsx — Landing v2 + Login no celular

// ── Mobile · Landing ───────────────────────────────────────────────────
const ScreenMobileLanding = () => (
  <IOSDevice width={402} height={874}>
    <div className="lp" style={{ height: "100%", overflow: "auto", background: "var(--c-paper)" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
        <Logo name="PGD Livre" size="sm" />
        <a href="/login" style={{
          background: "var(--c-ink-editorial)", color: "white",
          padding: "8px 14px", borderRadius: 8,
          fontSize: 12.5, fontWeight: 600, textDecoration: "none",
        }}>Demonstração</a>
      </div>

      {/* Hero mobile */}
      <div style={{ padding: "32px 20px 16px" }}>
        <div className="lp-eyebrow" style={{ marginBottom: 16, fontSize: 10.5 }}>
          <span className="dot" />Software Livre · PGD
        </div>
        <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 16 }}>
          Gestão de desempenho conforme a norma, com inteligência do nosso tempo.
        </h1>
        <p style={{ fontSize: 14, color: "var(--c-ink-2)", lineHeight: 1.55, marginBottom: 20 }}>
          Plataforma institucional aderente ao Decreto 11.072/2022 e às IN 24/2023 e 52/2023,
          com integração nativa à API PGD Central do MGI.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <a href="/login" className="lp-btn lp-btn-primary" style={{ justifyContent: "center", padding: "13px" }}>
            Acessar demonstração
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="https://pgdgovbr.github.io/docs/" className="lp-btn lp-btn-outline" style={{ justifyContent: "center", padding: "13px" }}>
            Ver documentação
          </a>
        </div>
      </div>

      {/* Screenshot mobile (Registrar com IA) */}
      <div style={{ padding: "0 20px 24px" }}>
        <div className="lp-browser" style={{ borderRadius: 12 }}>
          <div className="lp-browser-bar" style={{ padding: "8px 12px" }}>
            <span className="lp-browser-dot" style={{ background: "#FF5F57", width: 8, height: 8 }} />
            <span className="lp-browser-dot" style={{ background: "#FEBC2E", width: 8, height: 8 }} />
            <span className="lp-browser-dot" style={{ background: "#28C840", width: 8, height: 8 }} />
            <span className="lp-browser-url" style={{ fontSize: 10.5 }}>pgd.gov.br</span>
          </div>
          <img src="screenshots/mobile-servidor.png" alt="" style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{
          marginTop: 12,
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--c-status-aval)", color: "white",
          padding: "5px 10px", borderRadius: 999,
          fontSize: 10.5, fontWeight: 700,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
          IA em produção
        </div>
      </div>

      {/* Stats compactos */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(11,20,38,0.08)", borderRadius: 12, overflow: "hidden" }}>
          {[
            { num: "37", lbl: "requisitos da norma" },
            { num: "4",  lbl: "papéis hierárquicos" },
            { num: "AGPL", lbl: "código · CC-BY conteúdo" },
            { num: "GCP", lbl: "infra como código" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--c-paper)", padding: "18px 14px" }}>
              <div style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--c-ink-editorial)", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 6 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Norma · resumo */}
      <div style={{ padding: "32px 20px", background: "var(--c-paper-2)" }}>
        <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 12 }}>
          <span className="dot" />Atendimento à norma
        </div>
        <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", margin: "0 0 14px", lineHeight: 1.2 }}>
          Aderência integral ao marco normativo.
        </h2>
        <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "0 0 16px", lineHeight: 1.55 }}>
          O PGD Livre implementa 37 requisitos derivados do Decreto 11.072/2022 e das IN 24/2023 e 52/2023,
          com prazos legais transformados em alertas auditáveis.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Decreto 11.072", "IN 24/2023", "IN 52/2023", "API PGD Central"].map(t => (
            <span key={t} className="lp-chip legal" style={{ fontSize: 10.5 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* IA section mobile */}
      <div style={{ padding: "32px 20px" }}>
        <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 12 }}>
          <span className="dot" style={{ background: "var(--c-status-aval)" }} />Inteligência generativa
        </div>
        <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", margin: "0 0 14px", lineHeight: 1.2 }}>
          IA aplicada onde gera valor real.
        </h2>
        <div style={{
          background: "white", borderRadius: 12,
          border: "1.5px solid rgba(92, 45, 145, 0.18)",
          padding: 16, marginBottom: 12,
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 9,
              background: "linear-gradient(135deg, var(--c-status-aval) 0%, #7B3FB8 100%)",
              color: "white",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
            </span>
            <div>
              <strong style={{ fontSize: 13.5 }}>Reescrita do Registro</strong>
              <div style={{ fontSize: 10.5, color: "var(--c-success)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Em produção</div>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>
            A IA reestrutura o texto do servidor em 4 templates institucionais, sem inventar fatos.
          </p>
        </div>
      </div>

      {/* Footer mini */}
      <div style={{ padding: "24px 20px 32px", background: "var(--c-ink-editorial)", color: "rgba(255,255,255,0.7)" }}>
        <Logo name="PGD Livre" onDark size="sm" />
        <p style={{ fontSize: 11.5, marginTop: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.55)" }}>
          Implementação SGD · Plataforma SEGES · Ministério da Gestão e da Inovação
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10.5 }}>AGPL-3.0</span>
          <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10.5 }}>CC-BY-4.0</span>
        </div>
      </div>
    </div>
  </IOSDevice>
);

// ── Mobile · Login (apenas demo) ───────────────────────────────────────
const ScreenMobileLogin = () => (
  <IOSDevice width={402} height={874}>
    <div className="lp" style={{ height: "100%", overflow: "auto", background: "var(--c-paper)" }}>
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
        <Logo name="PGD Livre" size="sm" />
        <a href="/" style={{ fontSize: 12, color: "var(--c-muted)" }}>← Voltar</a>
      </div>

      <div style={{ padding: "24px 16px" }}>
        <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.015em", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>
          Demonstração do PGD Livre
        </h1>
        <p style={{ fontSize: 13, color: "var(--c-muted)", textAlign: "center", margin: "0 0 24px", lineHeight: 1.5 }}>
          Em produção real, o acesso é via Gov.br.
        </p>

        <div style={{ background: "white", border: "1px solid rgba(11,20,38,0.08)", borderRadius: 14, padding: 16 }}>
          <div style={{ background: "var(--c-accent-soft)", border: "1px solid rgba(199, 116, 0, 0.22)", borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 11.5, color: "var(--c-accent-deep)", lineHeight: 1.45 }}>
            <strong>Instância de demonstração.</strong> Dados podem ser resetados.
          </div>

          <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 10 }}><span style={{ color: "var(--c-accent)" }}>★</span> Comece por aqui</div>

          {PERSONAS.filter(p => p.grupo === "recomendados").slice(0, 4).map((p, i) => {
            const c = personaColor(p.nome);
            return (
              <a key={i} href={`/auth/dev-login?email=${p.email}&name=${encodeURIComponent(p.nome)}&role=${p.role}`} style={{
                display: "flex", gap: 10, alignItems: "center",
                padding: 12, background: "var(--c-paper-2)", borderRadius: 10,
                marginBottom: 8, textDecoration: "none", color: "inherit",
                border: "1px solid rgba(11,20,38,0.06)",
              }}>
                <span style={{ width: 32, height: 32, borderRadius: 9, background: c.bg, color: c.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 11 }}>{personaInitials(p.nome)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-ink-editorial)" }}>{p.nome}</div>
                  <div style={{ fontSize: 11, color: "var(--c-muted)", lineHeight: 1.4, marginTop: 1 }}>{p.ctx}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-muted)" }}><path d="M9 6l6 6-6 6"/></svg>
              </a>
            );
          })}
          <a href="#" style={{ display: "block", textAlign: "center", padding: "10px 0", fontSize: 12, color: "var(--c-muted)", textDecoration: "none" }}>
            Ver todas as 10 personas →
          </a>
        </div>
      </div>
    </div>
  </IOSDevice>
);

Object.assign(window, { ScreenMobileLanding, ScreenMobileLogin });
