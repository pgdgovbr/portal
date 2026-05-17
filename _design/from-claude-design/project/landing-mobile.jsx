// landing-mobile.jsx — Landing + Login no celular

// ── Mobile · Landing (excerto: hero + 1 jornada + CTA) ─────────────────
const ScreenMobileLanding = () => (
  <IOSDevice width={402} height={874}>
    <div className="lp" style={{ height: "100%", overflow: "auto", background: "var(--c-paper)" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
        <Logo name="PGD Libre" size="sm" />
        <button style={{ background: "var(--c-ink-editorial)", color: "white", border: 0, padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}>Entrar</button>
      </div>

      {/* Hero mobile */}
      <div style={{ padding: "32px 20px 16px" }}>
        <div className="lp-eyebrow" style={{ marginBottom: 16, fontSize: 10.5 }}>
          <span className="dot" />Software livre · PGD
        </div>
        <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 16 }}>
          O PGD do seu órgão fora da&nbsp;planilha.
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--c-ink-2)", lineHeight: 1.55, marginBottom: 20 }}>
          Plataforma de código aberto que implementa o Decreto 11.072/2022 e as IN 24 e 52/2023.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <a href="/login" className="lp-btn lp-btn-primary" style={{ justifyContent: "center", padding: "13px" }}>
            Ver demonstração
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="https://github.com/pgdgovbr" className="lp-btn lp-btn-outline" style={{ justifyContent: "center", padding: "13px" }}>Ver no GitHub</a>
        </div>
      </div>

      {/* Screenshot do mobile real */}
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
      </div>

      {/* Stats compactos */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(11,20,38,0.08)", borderRadius: 12, overflow: "hidden" }}>
          {[
            { num: "37", lbl: "requisitos legais" },
            { num: "4",  lbl: "papéis hierárquicos" },
            { num: "100%", lbl: "código aberto" },
            { num: "MIT", lbl: "licença" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--c-paper)", padding: "18px 14px" }}>
              <div style={{ fontFamily: "var(--ff-display)", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--c-ink-editorial)", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 6 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Para quem é · cards verticais */}
      <div style={{ padding: "32px 20px", background: "var(--c-paper-2)" }}>
        <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 12 }}>
          <span className="dot" />Para quem é
        </div>
        <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", margin: "0 0 22px", lineHeight: 1.2 }}>
          Quatro papéis. Uma jornada coesa.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { p: "Ana · Servidora",    c: { bg: "#E6EEF8", fg: "#0F3D8C" }, desc: "Cria plano, registra execução mensal, contesta avaliações." },
            { p: "Carlos · Chefia",    c: { bg: "#EFE8F7", fg: "#5C2D91" }, desc: "Revisa, assina, avalia e responde recursos da equipe." },
            { p: "Maria · Gestão",     c: { bg: "#E2F2E4", fg: "#168821" }, desc: "Aprova Planos de Entregas; vê conformidade da unidade." },
          ].map((j, i) => (
            <div key={i} style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid rgba(11,20,38,0.06)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 9, background: j.c.bg, color: j.c.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 13 }}>
                  {j.p.split(" ")[0][0]}
                </span>
                <strong style={{ fontSize: 14 }}>{j.p}</strong>
              </div>
              <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>{j.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA instalar */}
      <div style={{ padding: "24px 20px" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--c-primary) 0%, #1351B4 100%)",
          color: "white",
          borderRadius: 14,
          padding: 22,
        }}>
          <div className="lp-eyebrow" style={{ color: "rgba(255,255,255,0.65)", fontSize: 10.5, marginBottom: 10 }}>
            <span className="dot" style={{ background: "#F5A623" }} />
            Para gestores de TI
          </div>
          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 19, fontWeight: 700, color: "white", margin: "0 0 8px", lineHeight: 1.2 }}>
            Quer rodar no seu órgão?
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Documentação completa de deploy, integração com Gov.br e API Central.
          </p>
          <a href="#" className="lp-btn lp-btn-sm" style={{ background: "white", color: "var(--c-primary)", justifyContent: "center", width: "100%" }}>
            Ver guia de instalação →
          </a>
        </div>
      </div>

      {/* Footer mini */}
      <div style={{ padding: "24px 20px 32px", background: "var(--c-ink-editorial)", color: "rgba(255,255,255,0.7)", marginTop: 16 }}>
        <Logo name="PGD Libre" onDark size="sm" />
        <p style={{ fontSize: 11.5, marginTop: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.55)" }}>
          Implementação SGD · Plataforma SEGES · Ministério da Gestão e Inovação
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12 }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>GitHub</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>Docs</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>Licença MIT</a>
        </div>
      </div>
    </div>
  </IOSDevice>
);

// ── Mobile · Login ─────────────────────────────────────────────────────
const ScreenMobileLogin = () => (
  <IOSDevice width={402} height={874}>
    <div className="lp" style={{ height: "100%", overflow: "auto", background: "var(--c-paper)" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
        <Logo name="PGD Libre" size="sm" />
        <a href="/" style={{ fontSize: 12, color: "var(--c-muted)" }}>← Voltar</a>
      </div>

      <div style={{ padding: "24px 16px" }}>
        <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.018em", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>
          Como você quer entrar?
        </h1>
        <p style={{ fontSize: 13, color: "var(--c-muted)", textAlign: "center", margin: "0 0 24px", lineHeight: 1.5 }}>
          Conta oficial ou explore como persona da demo.
        </p>

        {/* Login oficial compacto */}
        <div style={{ background: "white", border: "1px solid rgba(11,20,38,0.08)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 12 }}><span className="dot" style={{ background: "var(--c-primary)" }} />Acesso oficial</div>
          <a href="/auth/login/govbr" className="lp-btn lp-btn-govbr" style={{ justifyContent: "center", width: "100%", padding: "13px", marginBottom: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: 3, background: "white", color: "var(--c-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 9 }}>br</span>
            Entrar com Gov.br
          </a>
          <a href="/auth/login/google" className="lp-btn lp-btn-outline" style={{ justifyContent: "center", width: "100%", padding: "13px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </a>
        </div>

        {/* Demo card */}
        <div style={{ background: "var(--c-paper-2)", border: "1px solid rgba(11,20,38,0.08)", borderRadius: 14, padding: 16 }}>
          <div style={{ background: "var(--c-accent-soft)", border: "1px solid rgba(199, 116, 0, 0.22)", borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 11.5, color: "var(--c-accent-deep)", lineHeight: 1.45 }}>
            <strong>Instância de demonstração.</strong> Dados podem ser resetados.
          </div>

          <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 10 }}><span style={{ color: "var(--c-accent)" }}>★</span> Comece por aqui</div>

          {PERSONAS.filter(p => p.grupo === "recomendados").slice(0, 4).map((p, i) => {
            const c = personaColor(p.nome);
            return (
              <a key={i} href={`/auth/dev-login?email=${p.email}&name=${encodeURIComponent(p.nome)}&role=${p.role}`} style={{
                display: "flex", gap: 10, alignItems: "center",
                padding: 12, background: "white", borderRadius: 10,
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
