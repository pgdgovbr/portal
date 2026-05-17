// landing-ui2.jsx — Componentes da segunda metade da Landing

// ── NormaTimeline (substitui ConformidadeTimeline antigo) ──────────────
// Mantém o nome ConformidadeTimeline exportado para compatibilidade.
const ConformidadeTimeline = () => {
  const steps = [
    { ttl: "Pactuação bilateral",  prazo: null,         art: "Decreto 11.072/2022 · Art. 11",  desc: "Servidor e chefia firmam o plano com dupla assinatura. Ajustes derrubam a assinatura do outro, preservando rastro." },
    { ttl: "Execução",             prazo: null,         art: "IN 24/2023 · Art. 28",            desc: "Período avaliativo aberto. Servidor executa as contribuições nos percentuais pactuados." },
    { ttl: "Registro de execução", prazo: "10 dias",    art: "IN 24/2023 · Art. 31",            desc: "Servidor descreve o realizado ao fim de cada período. Notificação automática antes do vencimento." },
    { ttl: "Avaliação",            prazo: "20 dias",    art: "IN 24/2023 · Art. 33",            desc: "Chefia atribui nota 1 a 5. Justificativa obrigatória para notas 1, 4 e 5." },
    { ttl: "Recurso",              prazo: "10 dias",    art: "IN 24/2023 · Art. 35",            desc: "Servidor pode contestar avaliações 4 ou 5. Chefia responde em até 10 dias." },
    { ttl: "Envio à API Central",  prazo: "automático", art: "IN 24/2023 · Art. 16",            desc: "Planos e avaliações sincronizam com a API PGD Central do MGI. Erros aparecem no painel administrativo." },
  ];

  return (
    <div style={{ marginTop: 56, position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ position: "relative", paddingRight: i < steps.length - 1 ? 18 : 0 }}>
            {i < steps.length - 1 && (
              <span style={{
                position: "absolute",
                top: 18, left: 36, right: -18,
                height: 2,
                background: "rgba(255,255,255,0.18)",
                zIndex: 0,
              }} />
            )}
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

// ── Selo de conformidade (card individual) ─────────────────────────────
const SeloConformidade = ({ icon, ttl, sub, status }) => (
  <div style={{
    background: "white",
    border: "1px solid rgba(11, 20, 38, 0.10)",
    borderRadius: 12,
    padding: 22,
    display: "flex", flexDirection: "column", gap: 12,
    position: "relative",
  }}>
    <div style={{
      width: 44, height: 44,
      borderRadius: 10,
      background: "var(--c-paper-2)",
      color: "var(--c-ink-editorial)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>{icon}</div>
    <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 16, fontWeight: 700, margin: 0, color: "var(--c-ink-editorial)", lineHeight: 1.3 }}>
      {ttl}
    </h3>
    <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5, flex: 1 }}>{sub}</p>
    {status && (
      <span style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
        color: status === "implementado" ? "var(--c-success)" : "var(--c-accent)",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: status === "implementado" ? "var(--c-success)" : "var(--c-accent)" }} />
        {status === "implementado" ? "Implementado" : "Em conformidade"}
      </span>
    )}
  </div>
);

// ── Diferencial card (mantido para compatibilidade) ────────────────────
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
    }}>{icon}</div>
    <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 19, fontWeight: 700, margin: 0, color: "var(--c-ink-editorial)", lineHeight: 1.3 }}>
      {ttl}
    </h3>
    <p style={{ fontSize: 14.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.55, flex: 1 }}>{desc}</p>
    {foot && (
      <div style={{ marginTop: 4, paddingTop: 14, borderTop: "1px solid rgba(11, 20, 38, 0.06)", fontSize: 12, color: "var(--c-muted)" }}>
        {foot}
      </div>
    )}
  </div>
);

// ── RoadmapItem ────────────────────────────────────────────────────────
const RoadmapItem = ({ ttl, desc, tag }) => (
  <div style={{
    background: "white",
    border: "1px solid rgba(11, 20, 38, 0.08)",
    borderLeft: "3px solid var(--c-accent)",
    borderRadius: 10,
    padding: "18px 22px",
    display: "flex", gap: 16, alignItems: "flex-start",
  }}>
    <span style={{
      flex: "none",
      width: 28, height: 28, borderRadius: 8,
      background: "var(--c-accent-soft)", color: "var(--c-accent-deep)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <strong style={{ fontSize: 14.5, color: "var(--c-ink-editorial)" }}>{ttl}</strong>
        {tag && <span className="lp-chip accent" style={{ fontSize: 10.5 }}>{tag}</span>}
      </div>
      <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "6px 0 0", lineHeight: 1.55 }}>{desc}</p>
    </div>
  </div>
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
          <Logo name="PGD Livre" onDark size="md" />
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.55, maxWidth: 380, color: "rgba(255,255,255,0.62)" }}>
            Plataforma de software livre para a gestão do Programa de Gestão e Desempenho
            no serviço público federal brasileiro.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>AGPL-3.0</span>
            <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>CC-BY-4.0</span>
          </div>
        </div>

        {[
          { ttl: "Plataforma", links: [
            { l: "Demonstração", h: "/login" },
            { l: "Documentação", h: "https://pgdgovbr.github.io/docs/" },
            { l: "Repositório", h: "https://github.com/pgdgovbr" },
            { l: "O que é o PGD Livre", h: "https://pgdgovbr.github.io/docs/sobre/pgd-libre/" },
          ]},
          { ttl: "Conceitos do PGD", links: [
            { l: "Programa de Gestão", h: "https://pgdgovbr.github.io/docs/conceitos/programa/" },
            { l: "Pactuação bilateral", h: "https://pgdgovbr.github.io/docs/conceitos/pactuacao-bilateral/" },
            { l: "Papéis e responsabilidades", h: "https://pgdgovbr.github.io/docs/conceitos/papeis/" },
            { l: "Glossário", h: "https://pgdgovbr.github.io/docs/conceitos/glossario/" },
          ]},
          { ttl: "Jornadas da demonstração", links: [
            { l: "Como acessar a demo", h: "https://pgdgovbr.github.io/docs/demo/acesso/" },
            { l: "Jornada do Servidor", h: "https://pgdgovbr.github.io/docs/demo/jornada-servidor/" },
            { l: "Jornada da Chefia", h: "https://pgdgovbr.github.io/docs/demo/jornada-chefia/" },
            { l: "Jornada do Gestor e Admin", h: "https://pgdgovbr.github.io/docs/demo/jornada-gestor/" },
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

      <div style={{
        marginTop: 28,
        display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Implementação</div>
            <div style={{ fontSize: 14, color: "white", fontWeight: 600, marginTop: 4 }}>Secretaria de Governo Digital · SGD</div>
          </div>
          <span style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Plataforma</div>
            <div style={{ fontSize: 14, color: "white", fontWeight: 600, marginTop: 4 }}>Secretaria de Gestão · SEGES</div>
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

// JornadaPersona e BannerInstalar removidos da v2 (não usados na nova estrutura).
// Mantidos como stubs vazios para compatibilidade de import.
const JornadaPersona = () => null;
const BannerInstalar = () => null;

Object.assign(window, {
  ConformidadeTimeline,
  SeloConformidade,
  DiferencialCard,
  RoadmapItem,
  FooterInstitucional,
  JornadaPersona,
  BannerInstalar,
});
