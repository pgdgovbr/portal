// landing-ui.jsx — TopNav, Hero e BrowserFrame da Landing

const LP_NAME = "PGD Livre";

// ── TopNavLanding (pública) ─────────────────────────────────────────────
const TopNavLanding = ({ onDark }) =>
<nav className={`lp-nav ${onDark ? "on-dark" : ""}`} style={{
  display: "flex", alignItems: "center",
  padding: "20px 32px",
  maxWidth: "var(--w-wide)", margin: "0 auto",
  gap: 32
}}>
    <Logo name={LP_NAME} onDark={onDark} size="md" />
    <ul style={{
    display: "flex", gap: 4, margin: 0, padding: 0, listStyle: "none",
    flex: 1, justifyContent: "center"
  }}>
      {[
    { href: "#norma", label: "Atendimento à norma" },
    { href: "#ia", label: "Inteligência generativa" },
    { href: "#conformidade", label: "Conformidade" },
    { href: "#arquitetura", label: "Arquitetura" }].
    map((it) =>
    <li key={it.href}>
          <a href={it.href} style={{
        padding: "8px 14px",
        fontSize: 14, fontWeight: 500,
        color: onDark ? "rgba(255,255,255,0.78)" : "var(--c-ink-2)",
        textDecoration: "none",
        borderRadius: 6,
        transition: "color .12s"
      }}>{it.label}</a>
        </li>
    )}
    </ul>
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <a href="https://pgdgovbr.github.io/docs/" style={{
      fontSize: 14, fontWeight: 500,
      color: onDark ? "rgba(255,255,255,0.78)" : "var(--c-ink-2)",
      textDecoration: "none"
    }}>
        Documentação
      </a>
      <a href="https://github.com/pgdgovbr" style={{
      fontSize: 14, fontWeight: 500,
      color: onDark ? "rgba(255,255,255,0.78)" : "var(--c-ink-2)",
      textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6
    }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z" />
        </svg>
        Repositório
      </a>
      <a href="/login" className="lp-btn lp-btn-primary lp-btn-sm">Acessar demonstração</a>
    </div>
  </nav>;


// ── BrowserFrame ───────────────────────────────────────────────────────
const BrowserFrame = ({ url = "pgd.gov.br", src, children, alt = "PGD Livre", maxHeight }) =>
<div className="lp-browser">
    <div className="lp-browser-bar">
      <span className="lp-browser-dot" style={{ background: "#FF5F57" }} />
      <span className="lp-browser-dot" style={{ background: "#FEBC2E" }} />
      <span className="lp-browser-dot" style={{ background: "#28C840" }} />
      <span className="lp-browser-url">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-success)" }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          {url}
      </span>
    </div>
    <div className="lp-browser-body" style={maxHeight ? { maxHeight, overflow: "hidden" } : null} data-comment-anchor="69c8a3ffc7-div-71-5">
      {children ? children : <img src={src} alt={alt} />}
    </div>
  </div>;


// ── HeroBanner ─────────────────────────────────────────────────────────
const HeroBanner = ({ children, screenshot }) =>
<section style={{ padding: "56px 0 96px", position: "relative" }}>
    <div className="lp-wrap-wide" style={{
    display: "grid",
    gridTemplateColumns: "1fr 1.15fr",
    gap: 72,
    alignItems: "center"
  }}>
      {/* Coluna esquerda · copy */}
      <div>
        <div className="lp-eyebrow" style={{ marginBottom: 24 }}>
          <span className="dot" />
          <span>Software Livre · Programa de Gestão e Desempenho</span>
        </div>

        <h1 className="lp-h1" style={{ fontSize: 56, lineHeight: 1.08 }}>
          Gestão de desempenho conforme a norma,<br />
          com a inteligência do nosso tempo.
        </h1>

        <p className="lp-lede" style={{ marginTop: 28, fontSize: 19 }}>
          Plataforma institucional, aderente integralmente ao Decreto 11.072/2022
          e às Instruções Normativas 24/2023 e 52/2023 — da pactuação bilateral
          do plano de trabalho à integração nativa com a API PGD Central do MGI,
          com apoio de inteligência generativa na escrita e revisão dos textos.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
          <a href="/login" className="lp-btn lp-btn-primary lp-btn-lg">
            Acessar demonstração
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a href="https://pgdgovbr.github.io/docs/" className="lp-btn lp-btn-outline lp-btn-lg">
            Ver documentação
          </a>
        </div>

        {/* Crédito institucional sutil */}
        <div style={{ marginTop: 44, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", borderTop: "1px solid rgba(11,20,38,0.08)", paddingTop: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Implementação</div>
            <div style={{ fontSize: 14, color: "var(--c-ink-editorial)", fontWeight: 600, marginTop: 4 }}>Secretaria de Governo Digital (SGD)</div>
          </div>
          <span style={{ width: 1, height: 32, background: "rgba(11,20,38,0.12)" }} />
          <div>
            <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Plataforma</div>
            <div style={{ fontSize: 14, color: "var(--c-ink-editorial)", fontWeight: 600, marginTop: 4 }}>Secretaria de Gestão (SEGES)</div>
          </div>
        </div>
      </div>

      {/* Coluna direita · screenshot interativo (estrela = IA) */}
      <div style={{ position: "relative" }}>
        <BrowserFrame url="pgd.meu-orgao.gov.br/meu-plano/registrar">{children}</BrowserFrame>

        {/* Anotação flutuante: GenAI em produção */}
        <div style={{
        position: "absolute",
        top: 56, right: -32,
        background: "var(--c-status-aval)", color: "white",
        padding: "9px 14px", borderRadius: 999,
        fontSize: 12, fontWeight: 600,
        boxShadow: "0 6px 20px rgba(92, 45, 145, 0.35)",
        display: "inline-flex", alignItems: "center", gap: 8
      }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
          </svg>
          Inteligência generativa integrada
        </div>

        <div style={{
        position: "absolute",
        bottom: -22, left: -28,
        background: "white",
        padding: "13px 18px",
        borderRadius: 12,
        boxShadow: "0 10px 28px rgba(11, 20, 38, 0.10), 0 0 0 1px rgba(11, 20, 38, 0.08)",
        display: "flex", gap: 14, alignItems: "center"
      }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--c-success-soft)", color: "var(--c-success)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.35 }}>
            <strong style={{ display: "block" }}>Aderente à norma</strong>
            <span style={{ color: "var(--c-muted)" }}>servidor · chefia · gestor · admin</span>
          </div>
        </div>
      </div>
    </div>
  </section>;


// ── Stats inline (barra de números pós-hero) ───────────────────────────
const StatBar = () =>
<section style={{ padding: "0 0 72px" }}>
    <div className="lp-wrap-wide">
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 32,
      padding: "44px 0",
      borderTop: "1px solid rgba(11, 20, 38, 0.08)",
      borderBottom: "1px solid rgba(11, 20, 38, 0.08)"
    }}>
        {[
      { num: "37", lbl: "requisitos funcionais da norma\nimplementados integralmente" },
      { num: "4", lbl: "papéis hierárquicos\nservidor · chefia · gestor · admin" },
      { num: "AGPL-3.0", lbl: "código sob software livre\nCC-BY-4.0 para conteúdo" },
      { num: "IaC", lbl: "infraestrutura como código\nem Terraform, deploy reproduzível" }].
      map((s, i) =>
      <div key={i} style={{
        paddingLeft: i > 0 ? 32 : 0,
        borderLeft: i > 0 ? "1px solid rgba(11, 20, 38, 0.08)" : "none"
      }}>
            <div className="lp-stat-num" style={{ fontSize: typeof s.num === "string" && s.num.length > 3 ? 38 : 64 }}>{s.num}</div>
            <div className="lp-stat-label" style={{ whiteSpace: "pre-line" }}>{s.lbl}</div>
          </div>
      )}
      </div>
    </div>
  </section>;


Object.assign(window, { TopNavLanding, HeroBanner, BrowserFrame, StatBar, LP_NAME });