// landing-ui2.jsx — componentes da segunda metade da landing + login

// ── Mini-jornada por persona (criativa C) ──────────────────────────────
const JornadaPersona = ({ persona, role, accent, screenshot, items, demoEmail }) => (
  <article style={{
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: 56,
    alignItems: "center",
    padding: "44px 0",
    borderTop: "1px solid rgba(11, 20, 38, 0.07)",
  }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <span style={{
          width: 56, height: 56,
          borderRadius: 14,
          background: accent.bg,
          color: accent.fg,
          fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 22,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{persona.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}</span>
        <div>
          <div className="lp-eyebrow"><span className="dot" style={{ background: accent.fg }} />{role}</div>
          <div style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, marginTop: 2 }}>{persona}</div>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{
              width: 26, height: 26, borderRadius: 13,
              background: "white", border: `1.5px solid ${accent.fg}`,
              color: accent.fg,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 12,
              flex: "none", marginTop: 1,
            }}>{i + 1}</span>
            <span style={{ fontSize: 15.5, color: "var(--c-ink-2)", lineHeight: 1.55 }}>{it}</span>
          </li>
        ))}
      </ul>

      <a href={`/login?demo=${demoEmail}`} className="lp-btn lp-btn-outline" style={{ marginTop: 28 }}>
        Explorar como {persona.split(" ")[0]}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>

    <div style={{ position: "relative" }}>
      <BrowserFrame url="pgd.gov.br" src={screenshot} maxHeight={420} />
    </div>
  </article>
);

// ── Conformidade Timeline (criativa B) ─────────────────────────────────
const ConformidadeTimeline = () => {
  const steps = [
    { ttl: "Pactuação bilateral",  prazo: null,             art: "Dec. 11.072/2022 · Art. 11",  desc: "Servidor e chefia firmam o plano com dupla assinatura. Quem edita primeiro, o outro revisa e contra-assina." },
    { ttl: "Execução",             prazo: null,             art: "IN 24/2023 · Art. 28",         desc: "Período avaliativo aberto. Servidor executa contribuições conforme percentuais pactuados." },
    { ttl: "Registro de execução", prazo: "10 dias",        art: "IN 24/2023 · Art. 31",         desc: "Servidor descreve o que fez ao fim de cada período. Lembrete automático antes do vencimento." },
    { ttl: "Avaliação",            prazo: "20 dias",        art: "IN 24/2023 · Art. 33",         desc: "Chefia avalia o registro com nota de 1 a 5. Nota 1, 4 ou 5 exige justificativa." },
    { ttl: "Recurso",              prazo: "10 dias",        art: "IN 24/2023 · Art. 35",         desc: "Servidor pode contestar avaliações 4 ou 5. Chefia tem 10 dias para responder." },
    { ttl: "Envio à API Central",  prazo: "automático",     art: "IN 24/2023 · Art. 16",         desc: "Todos os planos e avaliações sincronizam com a API PGD Central do MGI. Erros aparecem no painel admin." },
  ];

  return (
    <div style={{ marginTop: 56, position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            position: "relative",
            paddingRight: i < steps.length - 1 ? 18 : 0,
          }}>
            {/* Linha conectora */}
            {i < steps.length - 1 && (
              <span style={{
                position: "absolute",
                top: 18, left: "calc(50% + 18px)", right: "calc(-50% + 18px)",
                height: 2,
                background: "linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.15))",
                zIndex: 0,
              }} />
            )}

            {/* Marker + prazo */}
            <div style={{ position: "relative", marginBottom: 18, height: 38 }}>
              <span style={{
                width: 36, height: 36, borderRadius: 18,
                background: i === 0 ? "var(--c-accent)" : "rgba(255,255,255,0.12)",
                border: i === 0 ? "none" : "1.5px solid rgba(255,255,255,0.28)",
                color: "white",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 14,
                position: "relative", zIndex: 1,
              }}>{i + 1}</span>
              {s.prazo && (
                <span style={{
                  position: "absolute", top: -10, left: 44,
                  background: s.prazo === "automático" ? "var(--c-success)" : "var(--c-accent)",
                  color: "white",
                  padding: "3px 9px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700,
                  whiteSpace: "nowrap",
                }}>{s.prazo}</span>
              )}
            </div>

            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 6, lineHeight: 1.2 }}>
              {s.ttl}
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.74)", lineHeight: 1.55, margin: "0 0 12px" }}>
              {s.desc}
            </p>
            <span className="lp-chip" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)", fontFamily: "var(--ff-mono)", fontSize: 10.5 }}>
              {s.art}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Diferenciais em 4 cards densos ─────────────────────────────────────
const DiferencialCard = ({ icon, ttl, desc, foot }) => (
  <div style={{
    background: "white",
    border: "1px solid rgba(11, 20, 38, 0.08)",
    borderRadius: 14,
    padding: 28,
    display: "flex", flexDirection: "column", gap: 14,
  }}>
    <div style={{
      width: 44, height: 44,
      borderRadius: 10,
      background: "var(--c-paper-2)",
      color: "var(--c-ink-editorial)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 19, fontWeight: 700, margin: 0, color: "var(--c-ink-editorial)", lineHeight: 1.3 }}>
      {ttl}
    </h3>
    <p style={{ fontSize: 14.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.55, flex: 1 }}>
      {desc}
    </p>
    {foot && (
      <div style={{ marginTop: 4, paddingTop: 14, borderTop: "1px solid rgba(11, 20, 38, 0.06)", fontSize: 12, color: "var(--c-muted)" }}>
        {foot}
      </div>
    )}
  </div>
);

// ── Banner "levar pro meu órgão" ───────────────────────────────────────
const BannerInstalar = () => (
  <section style={{ padding: "80px 0" }}>
    <div className="lp-wrap" style={{ maxWidth: 960 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--c-primary) 0%, #1351B4 100%)",
        color: "white",
        borderRadius: 18,
        padding: "44px 48px",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 32, alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorativo: 3 círculos sutis */}
        <div style={{ position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: -120, bottom: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="lp-eyebrow" style={{ color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>
            <span className="dot" style={{ background: "#F5A623" }} />
            Para gestores de TI e Inovação
          </div>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 30, fontWeight: 700, color: "white", margin: "0 0 12px", letterSpacing: "-0.018em", lineHeight: 1.15 }}>
            Quer rodar isso no seu órgão?
          </h2>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.55, maxWidth: 460 }}>
            O PGD Libre é instalável em qualquer órgão público brasileiro.
            Documentação completa de deploy, configuração e integração com o
            ato de autorização do seu órgão.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", position: "relative", zIndex: 1 }}>
          <a href="https://pgdgovbr.github.io/docs/sobre/instalacao" className="lp-btn lp-btn-lg" style={{ background: "white", color: "var(--c-primary)" }}>
            Ver guia de instalação
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Docker · Cloud Run · auto-hospedado</span>
        </div>
      </div>
    </div>
  </section>
);

// ── Footer institucional ───────────────────────────────────────────────
const FooterInstitucional = () => (
  <footer style={{
    background: "var(--c-ink-editorial)",
    color: "rgba(255,255,255,0.72)",
    padding: "64px 0 40px",
    marginTop: 0,
  }}>
    <div className="lp-wrap-wide">
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
        <div>
          <Logo name="PGD Libre" onDark size="md" />
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.55, maxWidth: 380, color: "rgba(255,255,255,0.62)" }}>
            Plataforma de código aberto para gestão do Programa de Gestão e Desempenho
            no serviço público federal brasileiro.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
            <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>MIT License</span>
            <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>v0.4.2</span>
          </div>
        </div>

        {[
          { ttl: "Produto", links: [
            { l: "Demonstração ao vivo", h: "/login" },
            { l: "Documentação", h: "https://pgdgovbr.github.io/docs/" },
            { l: "Para servidores", h: "/login?demo=servidor" },
            { l: "Para chefias", h: "/login?demo=chefia" },
          ]},
          { ttl: "Open source", links: [
            { l: "GitHub", h: "https://github.com/pgdgovbr" },
            { l: "Roadmap", h: "https://pgdgovbr.github.io/docs/sobre/roadmap" },
            { l: "Contribuir", h: "https://github.com/pgdgovbr/portal/blob/main/CONTRIBUTING.md" },
            { l: "Licença MIT", h: "https://github.com/pgdgovbr/portal/blob/main/LICENSE" },
          ]},
          { ttl: "Marco normativo", links: [
            { l: "Decreto 11.072/2022", h: "#" },
            { l: "IN 24/2023", h: "#" },
            { l: "IN 52/2023", h: "#" },
            { l: "API PGD Central", h: "#" },
          ]},
        ].map((c, i) => (
          <div key={i}>
            <div className="lp-eyebrow" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>{c.ttl}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {c.links.map((l, j) => (
                <li key={j}>
                  <a href={l.h} style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, textDecoration: "none" }}>{l.l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <hr style={{ height: 1, background: "rgba(255,255,255,0.1)", border: 0, margin: 0 }} />

      {/* Créditos institucionais — destaque pra SGD */}
      <div style={{
        marginTop: 28,
        display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Implementação</div>
            <div style={{ fontSize: 14, color: "white", fontWeight: 600, marginTop: 4 }}>Secretaria de Governo Digital (SGD)</div>
          </div>
          <span style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Plataforma</div>
            <div style={{ fontSize: 14, color: "white", fontWeight: 600, marginTop: 4 }}>Secretaria de Gestão (SEGES)</div>
          </div>
          <span style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Órgão</div>
            <div style={{ fontSize: 14, color: "white", fontWeight: 600, marginTop: 4 }}>Ministério da Gestão e da Inovação</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "right" }}>
          Faz parte de <a href="https://github.com/pgdgovbr" style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>pgdgovbr</a>,<br />
          infraestrutura cívica brasileira
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { JornadaPersona, ConformidadeTimeline, DiferencialCard, BannerInstalar, FooterInstitucional });
