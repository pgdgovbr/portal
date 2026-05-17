// landing-ui.jsx — componentes da Landing + Login

// ── TopNavLanding (pública) ─────────────────────────────────────────────
const TopNavLanding = ({ authed, onDark }) => (
  <nav className={`lp-nav ${onDark ? "on-dark" : ""}`} style={{
    display: "flex", alignItems: "center",
    padding: "20px 32px",
    maxWidth: "var(--w-wide)", margin: "0 auto",
    gap: 32,
  }}>
    <Logo name="PGD Libre" onDark={onDark} size="md" />
    <ul style={{
      display: "flex", gap: 4, margin: 0, padding: 0, listStyle: "none",
      flex: 1, justifyContent: "center",
    }}>
      {[
        { href: "#produto",        label: "Produto" },
        { href: "#conformidade",   label: "Conformidade" },
        { href: "#para-quem",      label: "Para quem" },
        { href: "#open-source",    label: "Open source" },
      ].map(it => (
        <li key={it.href}>
          <a href={it.href} style={{
            padding: "8px 14px",
            fontSize: 14, fontWeight: 500,
            color: onDark ? "rgba(255,255,255,0.78)" : "var(--c-ink-2)",
            textDecoration: "none",
            borderRadius: 6,
            transition: "color .12s",
          }}>{it.label}</a>
        </li>
      ))}
    </ul>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <a href="https://github.com/pgdgovbr" style={{
        padding: "8px 14px", fontSize: 14, fontWeight: 500,
        color: onDark ? "rgba(255,255,255,0.78)" : "var(--c-ink-2)",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z"/>
        </svg>
        GitHub
      </a>
      {authed
        ? <a href="/app" className="lp-btn lp-btn-primary lp-btn-sm">Entrar no app →</a>
        : <a href="/login" className="lp-btn lp-btn-primary lp-btn-sm">Entrar</a>}
    </div>
  </nav>
);

// ── HeroBanner ─────────────────────────────────────────────────────────
const HeroBanner = ({ screenshot }) => (
  <section style={{ padding: "48px 0 88px", position: "relative" }}>
    <div className="lp-wrap-wide" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1.1fr",
      gap: 64,
      alignItems: "center",
    }}>
      {/* Coluna esquerda · copy */}
      <div>
        <div className="lp-eyebrow" style={{ marginBottom: 22 }}>
          <span className="dot" />
          <span>Software livre · Programa de Gestão e Desempenho</span>
        </div>

        <h1 className="lp-h1">
          O PGD do seu órgão fora da&nbsp;planilha.
        </h1>

        <p className="lp-lede" style={{ marginTop: 26 }}>
          Plataforma de código aberto que implementa o Decreto&nbsp;11.072/2022
          e as Instruções Normativas 24 e 52/2023 — da pactuação bilateral
          entre servidor e chefia ao envio automático para a API PGD Central
          do MGI.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
          <a href="/login" className="lp-btn lp-btn-primary lp-btn-lg">
            Ver demonstração ao vivo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="https://github.com/pgdgovbr" className="lp-btn lp-btn-outline lp-btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z"/></svg>
            Ver no GitHub
          </a>
        </div>

        {/* Tira-gosto técnico */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32 }}>
          {["SvelteKit", "FastAPI", "PostgreSQL", "GraphQL", "MIT License"].map(s => (
            <span key={s} className="lp-chip">{s}</span>
          ))}
        </div>

        {/* Crédito institucional sutil */}
        <p style={{ marginTop: 40, fontSize: 13, color: "var(--c-muted)", lineHeight: 1.6 }}>
          Implementação <strong style={{ color: "var(--c-ink-2)" }}>Secretaria de Governo Digital (SGD)</strong>
          <br />Plataforma <strong style={{ color: "var(--c-ink-2)" }}>Secretaria de Gestão (SEGES)</strong> · Ministério da Gestão e da Inovação
        </p>
      </div>

      {/* Coluna direita · screenshot */}
      <div style={{ position: "relative" }}>
        <BrowserFrame url="pgd.gov.br" src={screenshot} />

        {/* Anotações flutuantes */}
        <div style={{
          position: "absolute",
          top: 64, right: -28,
          background: "var(--c-success)", color: "white",
          padding: "8px 14px", borderRadius: 999,
          fontSize: 12, fontWeight: 600,
          boxShadow: "0 6px 20px rgba(22, 136, 33, 0.35)",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "white", animation: "pulse 2s infinite" }} />
          Em produção · MGI
        </div>

        <div style={{
          position: "absolute",
          bottom: -22, left: -32,
          background: "white",
          padding: "12px 16px",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(11, 20, 38, 0.10), 0 0 0 1px rgba(11, 20, 38, 0.08)",
          display: "flex", gap: 14, alignItems: "center",
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--c-success-soft)", color: "var(--c-success)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.35 }}>
            <strong style={{ display: "block" }}>4 papéis · 1 sistema</strong>
            <span style={{ color: "var(--c-muted)" }}>servidor · chefia · gestor · admin</span>
          </div>
        </div>
      </div>
    </div>

    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
  </section>
);

// ── BrowserFrame ───────────────────────────────────────────────────────
const BrowserFrame = ({ url = "pgd.gov.br", src, alt = "Screenshot do PGD Libre", maxHeight }) => (
  <div className="lp-browser">
    <div className="lp-browser-bar">
      <span className="lp-browser-dot" style={{ background: "#FF5F57" }} />
      <span className="lp-browser-dot" style={{ background: "#FEBC2E" }} />
      <span className="lp-browser-dot" style={{ background: "#28C840" }} />
      <span className="lp-browser-url">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-success)" }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {url}
      </span>
    </div>
    <div className="lp-browser-body" style={maxHeight ? { maxHeight, overflow: "hidden" } : null}>
      <img src={src} alt={alt} />
    </div>
  </div>
);

// ── Stats inline (barra de números pós-hero) ───────────────────────────
const StatBar = () => (
  <section style={{ padding: "0 0 64px" }}>
    <div className="lp-wrap-wide">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
        padding: "40px 0",
        borderTop: "1px solid rgba(11, 20, 38, 0.08)",
        borderBottom: "1px solid rgba(11, 20, 38, 0.08)",
      }}>
        {[
          { num: "37", lbl: "requisitos funcionais\ndo marco normativo implementados" },
          { num: "4",  lbl: "papéis hierárquicos\nservidor · chefia · gestor · admin" },
          { num: "100%", lbl: "código aberto\nlicença MIT, em github.com/pgdgovbr" },
          { num: "1", lbl: "instância demonstrativa\nrodando agora no Cloud Run" },
        ].map((s, i) => (
          <div key={i} style={{
            paddingLeft: i > 0 ? 32 : 0,
            borderLeft: i > 0 ? "1px solid rgba(11, 20, 38, 0.08)" : "none",
          }}>
            <div className="lp-stat-num">{s.num}</div>
            <div className="lp-stat-label" style={{ whiteSpace: "pre-line" }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { TopNavLanding, HeroBanner, BrowserFrame, StatBar });
