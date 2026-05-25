// landing-mobile-page.jsx — Landing pública /mobile · página inteira responsiva
//
// É a Landing v2 reorganizada para telas estreitas (≤ 480px ideal, fluida até ~640px).
// NÃO é o mockup em iPhone — é a página real que o servidor vê quando abre pgd.gov.br
// no celular. Header sticky, hero compacto, seções empilhadas, tipografia recalibrada.

const MLP_COLOR_PRIMARY = "var(--c-ink-editorial)";
const MLP_COLOR_INK2 = "var(--c-ink-2)";
const MLP_COLOR_PAPER = "var(--c-paper)";
const MLP_COLOR_PAPER2 = "var(--c-paper-2)";

// ─── Header sticky ─────────────────────────────────────────────────────
const MLPHeader = ({ menuOpen, onToggleMenu }) => (
  <header style={{
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(252, 251, 248, 0.92)",
    backdropFilter: "saturate(180%) blur(10px)",
    WebkitBackdropFilter: "saturate(180%) blur(10px)",
    borderBottom: "1px solid rgba(11,20,38,0.06)",
  }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 18px", maxWidth: 720, margin: "0 auto",
    }}>
      <a href="#top" style={{ textDecoration: "none" }}>
        <Logo name="PGD Livre" size="sm" />
      </a>
      <button
        onClick={onToggleMenu}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        style={{
          width: 40, height: 40, borderRadius: 10,
          border: "1px solid rgba(11,20,38,0.1)",
          background: "white", color: MLP_COLOR_PRIMARY,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
        }}
      >
        {menuOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        )}
      </button>
    </div>

    {/* Drawer */}
    {menuOpen && (
      <div style={{
        position: "absolute", top: "100%", left: 0, right: 0,
        background: "var(--c-paper)",
        borderBottom: "1px solid rgba(11,20,38,0.08)",
        boxShadow: "0 12px 30px -18px rgba(11,20,38,0.25)",
        padding: "8px 18px 20px",
      }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[
            { href: "#norma", label: "Atendimento à norma" },
            { href: "#ia", label: "Inteligência generativa" },
            { href: "#conformidade", label: "Conformidade" },
            { href: "#arquitetura", label: "Arquitetura" },
            { href: "https://pgdgovbr.github.io/docs/", label: "Documentação", ext: true },
            { href: "https://github.com/pgdgovbr", label: "Repositório", ext: true },
          ].map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                onClick={onToggleMenu}
                target={it.ext ? "_blank" : undefined}
                rel={it.ext ? "noreferrer" : undefined}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 4px",
                  fontSize: 15, fontWeight: 500, color: MLP_COLOR_PRIMARY,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(11,20,38,0.05)",
                }}
              >
                <span>{it.label}</span>
                {it.ext && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M7 17L17 7M9 7h8v8"/></svg>
                )}
              </a>
            </li>
          ))}
        </ul>
        <a href="/login" className="lp-btn lp-btn-primary" style={{ justifyContent: "center", padding: "13px", width: "100%", marginTop: 14 }}>
          Acessar demonstração
        </a>
      </div>
    )}
  </header>
);

// ─── Eyebrow padronizado ───────────────────────────────────────────────
const MLPEyebrow = ({ children, dotColor }) => (
  <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 12 }}>
    <span className="dot" style={dotColor ? { background: dotColor } : null} />
    {children}
  </div>
);

// ─── H2 mobile ──────────────────────────────────────────────────────────
const MLPH2 = ({ children, dark }) => (
  <h2 style={{
    fontFamily: "var(--ff-display)",
    fontSize: 24, fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.18,
    margin: "0 0 14px",
    color: dark ? "white" : "var(--c-ink-editorial)",
  }}>{children}</h2>
);

// ─── ArqItem mobile (lista de bullets com check) ───────────────────────
const MLPArqItem = ({ ttl, sub }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
    <span style={{
      flex: "none",
      width: 24, height: 24, borderRadius: 7,
      background: "var(--c-success-soft)", color: "var(--c-success)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      marginTop: 2,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <strong style={{ fontSize: 14, color: "var(--c-ink-editorial)", display: "block", lineHeight: 1.35 }}>{ttl}</strong>
      <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: "4px 0 0", lineHeight: 1.5 }}>{sub}</p>
    </div>
  </div>
);

// ─── Roadmap item mobile ───────────────────────────────────────────────
const MLPRoadmapItem = ({ ttl, desc, tag }) => (
  <div style={{
    background: "white", border: "1px solid rgba(11,20,38,0.08)",
    borderRadius: 12, padding: 16,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
      <strong style={{ fontSize: 13.5, color: "var(--c-ink-editorial)", lineHeight: 1.35 }}>{ttl}</strong>
      {tag && (
        <span className="lp-chip accent" style={{ fontSize: 10, flex: "none", padding: "3px 8px" }}>{tag}</span>
      )}
    </div>
    <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
  </div>
);

// ─── Selo conformidade mobile ──────────────────────────────────────────
const MLPSelo = ({ icon, ttl, sub, status }) => (
  <div style={{
    background: "white", border: "1px solid rgba(11,20,38,0.08)",
    borderRadius: 12, padding: 14,
    display: "flex", flexDirection: "column", gap: 10,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        width: 36, height: 36, borderRadius: 9,
        background: "var(--c-paper-2)", color: "var(--c-ink-editorial)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none",
      }}>{icon}</span>
      <strong style={{ fontSize: 13.5, color: "var(--c-ink-editorial)", lineHeight: 1.25 }}>{ttl}</strong>
    </div>
    <p style={{ fontSize: 12, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>{sub}</p>
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
      color: status === "em conformidade" ? "var(--c-success)" : "var(--c-muted)",
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: status === "em conformidade" ? "var(--c-success)" : "var(--c-muted)" }} />
      {status}
    </span>
  </div>
);

// ─── Linha do tempo do ciclo (vertical em mobile) ───────────────────────
const MLPCicloTimeline = () => {
  const etapas = [
    { titulo: "Pactuação", prazo: "1º ao 5º dia útil do mês", desc: "Servidor e chefia acordam o Plano de Trabalho." },
    { titulo: "Execução & Registro", prazo: "Durante o mês", desc: "Registros mensais com apoio da IA, sem inventar fatos." },
    { titulo: "Avaliação", prazo: "Em até 20 dias úteis do fim do ciclo", desc: "Chefia avalia com base em critérios institucionais." },
    { titulo: "Sincronização API Central", prazo: "Automática", desc: "Envio ao MGI sem ação manual; eventos auditáveis." },
  ];
  return (
    <div style={{ marginTop: 22, position: "relative" }}>
      {/* linha vertical */}
      <div style={{
        position: "absolute", left: 11, top: 6, bottom: 6, width: 2,
        background: "rgba(255,255,255,0.15)",
      }} />
      {etapas.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: i === etapas.length - 1 ? 0 : 22, position: "relative" }}>
          <span style={{
            flex: "none", width: 24, height: 24, borderRadius: 12,
            background: "var(--c-accent)", color: "var(--c-ink-editorial)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 11,
            border: "3px solid var(--c-ink-editorial)",
            zIndex: 1,
          }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 14, color: "white", display: "block", lineHeight: 1.3 }}>{e.titulo}</strong>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10.5, color: "var(--c-accent)", marginTop: 3, letterSpacing: ".02em" }}>{e.prazo}</div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.74)", margin: "6px 0 0", lineHeight: 1.5 }}>{e.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ScreenLandingMobilePage — a página completa
// ═══════════════════════════════════════════════════════════════════════
const ScreenLandingMobilePage = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div id="top" className="lp" data-screen-label="Landing Mobile · pública v2" style={{
      background: MLP_COLOR_PAPER,
      minHeight: "100vh",
      maxWidth: 640, margin: "0 auto",
      overflowX: "hidden",
    }}>
      <MLPHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />

      {/* ════════════ HERO ════════════ */}
      <section style={{ padding: "32px 20px 28px" }}>
        <MLPEyebrow>Software Livre · PGD</MLPEyebrow>
        <h1 style={{
          fontFamily: "var(--ff-display)",
          fontSize: "clamp(28px, 8.4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-0.028em",
          lineHeight: 1.06,
          margin: "0 0 18px",
        }}>
          Gestão de desempenho conforme a norma, com inteligência do nosso tempo.
        </h1>
        <p style={{ fontSize: 15.5, color: MLP_COLOR_INK2, lineHeight: 1.55, margin: "0 0 22px" }}>
          Plataforma institucional aderente ao <strong>Decreto 11.072/2022</strong> e às
          <strong> IN 24/2023</strong> e <strong>52/2023</strong>, com integração nativa à API PGD Central do MGI.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          <a href="/login" className="lp-btn lp-btn-primary" style={{ justifyContent: "center", padding: "14px", fontSize: 15 }}>
            Acessar demonstração
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="https://pgdgovbr.github.io/docs/" className="lp-btn lp-btn-outline" style={{ justifyContent: "center", padding: "14px", fontSize: 15 }}>
            Ver documentação
          </a>
        </div>

        {/* Showcase do app · phone mockup centrado, claramente "uma tela do produto"
            e não o app que o usuário está usando agora */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          padding: "8px 0 4px",
        }}>
          <div style={{
            width: "100%", maxWidth: 268,
            padding: 8,
            borderRadius: 32,
            background: "linear-gradient(180deg, #1d2333 0%, #0B1426 100%)",
            boxShadow:
              "0 28px 60px -24px rgba(11, 20, 38, 0.45), " +
              "0 12px 28px -14px rgba(11, 20, 38, 0.25), " +
              "0 0 0 1px rgba(11, 20, 38, 0.10)",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{
              position: "absolute",
              top: 14, left: "50%", transform: "translateX(-50%)",
              width: 72, height: 18, borderRadius: 10,
              background: "#0B1426",
              zIndex: 2,
            }} />
            <div style={{
              borderRadius: 24,
              overflow: "hidden",
              background: "white",
              aspectRatio: "706 / 1506",
            }}>
              <img
                src="screenshots/mobile-registrar-ia.png"
                alt="Servidor registrando execução com apoio da IA"
                style={{ width: "100%", display: "block" }}
                fetchpriority="high"
              />
            </div>
          </div>

          {/* Caption — sinal explícito de "isto é uma demonstração de tela" */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontSize: 10.5, color: "var(--c-muted)",
            fontFamily: "var(--ff-mono)",
            letterSpacing: ".04em",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3" /><circle cx="12" cy="18" r="1" /></svg>
            Tela real · Registrar execução com IA
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section style={{ padding: "0 20px 8px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
          background: "rgba(11,20,38,0.08)",
          borderRadius: 14, overflow: "hidden",
          border: "1px solid rgba(11,20,38,0.06)",
        }}>
          {[
            { num: "37", lbl: "requisitos funcionais da norma implementados" },
            { num: "4",  lbl: "papéis hierárquicos: servidor, chefia, gestor, sistema" },
            { num: "AGPL", lbl: "código · CC-BY no conteúdo e documentação" },
            { num: "API", lbl: "integração nativa com a PGD Central do MGI" },
          ].map((s, i) => (
            <div key={i} style={{ background: MLP_COLOR_PAPER, padding: "18px 14px" }}>
              <div style={{
                fontFamily: "var(--ff-display)",
                fontSize: s.num.length > 3 ? 20 : 28,
                fontWeight: 800, letterSpacing: "-0.025em",
                color: "var(--c-ink-editorial)", lineHeight: 1,
              }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 8, lineHeight: 1.4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ 1. NORMA ════════════ */}
      <section id="norma" style={{ padding: "44px 20px", background: MLP_COLOR_PAPER2, marginTop: 32 }}>
        <MLPEyebrow>Atendimento à norma</MLPEyebrow>
        <MLPH2>Aderência integral ao marco normativo brasileiro.</MLPH2>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 14px" }}>
          O <strong>Decreto 11.072/2022</strong> instituiu o PGD no serviço público federal. As <strong>IN 24/2023</strong> e <strong>52/2023</strong> definiram
          prazos, responsabilidades e o ciclo completo de avaliação.
        </p>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 18px" }}>
          O PGD Livre implementa <strong>37 requisitos</strong> derivados desses instrumentos, com prazos legais
          transformados em alertas, notificações e eventos auditáveis.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Decreto 11.072/2022", "IN 24/2023", "IN 52/2023", "API PGD Central"].map(t => (
            <span key={t} className="lp-chip legal" style={{ fontSize: 10.5 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ════════════ 2. CICLO (DARK) ════════════ */}
      <section style={{ padding: "44px 20px", background: "var(--c-ink-editorial)", color: "rgba(255,255,255,0.92)" }}>
        <MLPEyebrow dotColor="var(--c-accent)">
          <span style={{ color: "rgba(255,255,255,0.62)" }}>Ciclo da norma</span>
        </MLPEyebrow>
        <MLPH2 dark>Da pactuação ao envio à API Central, sem ação manual.</MLPH2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.74)", lineHeight: 1.6, margin: "0 0 4px" }}>
          Cada etapa do ciclo está amarrada ao prazo da norma. O sistema notifica antes do vencimento,
          registra em log imutável e sincroniza com a API PGD Central.
        </p>
        <MLPCicloTimeline />
      </section>

      {/* ════════════ 3. IA ════════════ */}
      <section id="ia" style={{ padding: "44px 20px" }}>
        <MLPEyebrow dotColor="var(--c-status-aval)">Inteligência generativa</MLPEyebrow>
        <MLPH2>IA aplicada à escrita e revisão dos textos.</MLPH2>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 22px" }}>
          Sem hype, sem caixa-preta. Cada uso resolve uma dor real do servidor ou da chefia — com lacunas
          sinalizadas e nada inventado.
        </p>

        {/* Disponível na demo */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--c-success-soft)", color: "var(--c-success)",
          padding: "5px 12px", borderRadius: 999,
          fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
          marginBottom: 12,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--c-success)" }} />
          Disponível na demonstração
        </span>

        <div style={{
          background: "white",
          border: "1.5px solid rgba(92, 45, 145, 0.18)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 26,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{
              width: 44, height: 44, borderRadius: 10,
              background: "linear-gradient(135deg, var(--c-status-aval) 0%, #7B3FB8 100%)",
              color: "white",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" opacity=".6" />
              </svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 16.5, fontWeight: 700, margin: 0, color: "var(--c-ink-editorial)", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                Reescrita assistida do Registro de Execução
              </h3>
            </div>
          </div>
          <p style={{ fontSize: 13, color: MLP_COLOR_INK2, margin: "0 0 12px", lineHeight: 1.55 }}>
            O servidor descreve o que executou. A IA reestrutura em um template institucional —
            preservando todos os fatos. Quando falta informação, sinaliza{" "}
            <code style={{ fontFamily: "var(--ff-mono)", fontSize: 11.5, background: "var(--c-paper-2)", padding: "1px 5px", borderRadius: 4 }}>[precisa de detalhe]</code>{" "}
            em vez de inventar.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Por entrega", "Cronológico", "Por contribuição", "STAR"].map(t => (
              <span key={t} className="lp-chip" style={{ background: "#EFE8F7", color: "var(--c-status-aval)", border: "1px solid rgba(92, 45, 145, 0.18)", fontSize: 10.5 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Em desenvolvimento */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--c-accent-soft)", color: "var(--c-accent-deep)",
          padding: "5px 12px", borderRadius: 999,
          fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
          marginBottom: 12,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--c-accent)" }} />
          Em desenvolvimento
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <MLPRoadmapItem
            ttl="PárcIA · IA Parceira do Servidor"
            desc="App nativo dedicado: registro por áudio, formatação por IA, notificações de prazo no celular."
            tag="App nativo"
          />
          <MLPRoadmapItem
            ttl="Resumo automático de PT e execuções"
            desc="A chefia recebe um resumo do plano e das execuções antes da avaliação, com links para o original."
          />
          <MLPRoadmapItem
            ttl="Rascunho de avaliação com o tom da chefia"
            desc="A partir do histórico, a IA propõe um rascunho que respeita o estilo da chefia — sempre editável."
          />
        </div>
      </section>

      {/* ════════════ 4. CONFORMIDADE ════════════ */}
      <section id="conformidade" style={{ padding: "44px 20px", background: MLP_COLOR_PAPER2 }}>
        <MLPEyebrow>Conformidade e padrões</MLPEyebrow>
        <MLPH2>Construído para o serviço público.</MLPH2>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 22px" }}>
          Aderência a padrões de privacidade, acessibilidade, interoperabilidade e segurança — testáveis
          no código, não apenas declarados.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MLPSelo status="em conformidade" ttl="LGPD" sub="Lei 13.709/2018. Autenticação, log imutável, retenção e anonimização." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          } />
          <MLPSelo status="em conformidade" ttl="WCAG 2.1 AA" sub="Contrastes, navegação por teclado, foco visível. Padrão W3C." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
          } />
          <MLPSelo status="em conformidade" ttl="e-MAG" sub="Modelo de Acessibilidade em Governo Eletrônico." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v6H4zM4 14h16v6H4z" /></svg>
          } />
          <MLPSelo status="implementado" ttl="e-PING" sub="Padrões de Interoperabilidade. Integração com a API PGD Central." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
          } />
          <MLPSelo status="implementado" ttl="CSP & segurança" sub="Content Security Policy testada. Headers HTTP por padrão." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          } />
          <MLPSelo status="implementado" ttl="Auditoria imutável" sub="Cada ato vira evento auditável persistido — sem rota de delete." icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></svg>
          } />
        </div>
      </section>

      {/* ════════════ 5. ARQUITETURA ════════════ */}
      <section id="arquitetura" style={{ padding: "44px 20px" }}>
        <MLPEyebrow>Arquitetura</MLPEyebrow>
        <MLPH2>Software Livre, desacoplado e auditável.</MLPH2>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 22px" }}>
          Decisões tomadas para o órgão manter o controle dos próprios dados, evitar dependência de
          fornecedor único e crescer sem reescrita.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 22 }}>
          <MLPArqItem
            ttl="Software Livre · AGPL-3.0 + CC-BY-4.0"
            sub="Código sob AGPL-3.0; conteúdo sob CC-BY-4.0. Sem dependência de fornecedor único."
          />
          <MLPArqItem
            ttl="Backend desacoplado em GraphQL"
            sub="Permite frontends próprios, integrações analíticas e o app PárcIA, sem reescrita."
          />
          <MLPArqItem
            ttl="Infraestrutura como código"
            sub="Provisão em Terraform. Deploy reproduzível em qualquer nuvem, com auditoria de mudança."
          />
          <MLPArqItem
            ttl="Workflow com agentes de IA"
            sub="Pipeline integrado com Claude Code: ciclos de entrega em horas, com revisão humana."
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
          {["SvelteKit", "FastAPI", "GraphQL", "PostgreSQL", "Docker", "Terraform", "Claude Code"].map(t => (
            <span key={t} className="lp-chip" style={{ fontSize: 10.5 }}>{t}</span>
          ))}
        </div>

        {/* Diagrama integração — empilhado */}
        <div style={{
          background: MLP_COLOR_PAPER2,
          borderRadius: 14,
          padding: 18,
          border: "1px solid rgba(11,20,38,0.08)",
        }}>
          <div className="lp-eyebrow" style={{ fontSize: 10.5, marginBottom: 14 }}>Diagrama · integração</div>

          <div style={{
            background: "white", border: "1.5px solid var(--c-primary)",
            borderRadius: 10, padding: 14, marginBottom: 12,
            boxShadow: "0 6px 18px -10px rgba(15, 61, 140, 0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <strong style={{ color: "var(--c-primary)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".08em" }}>Seu órgão</strong>
              <span className="lp-chip" style={{ fontSize: 9.5, padding: "3px 7px" }}>self-hosted</span>
            </div>
            <Logo name="PGD Livre" size="sm" />
            <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--c-muted)", lineHeight: 1.45 }}>
              Auto-hospedada na infraestrutura do próprio órgão.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "2px 0 8px" }}>
            <span style={{ flex: 1, height: 1, background: "rgba(11,20,38,0.12)" }} />
            <span style={{ fontSize: 9.5, fontFamily: "var(--ff-mono)", color: "var(--c-muted)" }}>HTTPS · GraphQL</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--c-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
            <span style={{ flex: 1, height: 1, background: "rgba(11,20,38,0.12)" }} />
          </div>

          <div style={{
            background: "var(--c-ink-editorial)", color: "white",
            borderRadius: 10, padding: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <strong style={{ color: "rgba(255,255,255,0.7)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".08em" }}>MGI</strong>
              <span className="lp-chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)", fontSize: 9.5, padding: "3px 7px" }}>obrigatória</span>
            </div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 14 }}>API PGD Central</div>
            <div style={{ marginTop: 6, fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
              Consolida participantes, planos e avaliações do PGD nos órgãos federais.
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 6. ROADMAP ════════════ */}
      <section style={{ padding: "44px 20px", background: MLP_COLOR_PAPER2 }}>
        <MLPEyebrow dotColor="var(--c-accent)">Em desenvolvimento</MLPEyebrow>
        <MLPH2>O que vem a seguir.</MLPH2>
        <p style={{ fontSize: 14, color: MLP_COLOR_INK2, lineHeight: 1.6, margin: "0 0 20px" }}>
          Roadmap aberto, público, ajustável às prioridades dos órgãos parceiros.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <MLPRoadmapItem ttl="Exportação em CSV, JSON e YAML" desc="Para análise externa e auditoria por órgãos de controle." />
          <MLPRoadmapItem ttl="Exportação de PDF em lote" desc="Planos e registros de uma unidade inteira em um arquivo." />
          <MLPRoadmapItem ttl="Integração com GitHub Projects" desc="Importação de PTs e execuções a partir de issues e milestones." tag="SaaS" />
          <MLPRoadmapItem ttl="Integração com Jira, Trello, Notion" desc="Conectores para as ferramentas já adotadas pelas equipes." tag="SaaS" />
          <MLPRoadmapItem ttl="Notificações multicanal" desc="E-mail, Telegram, Web Push, webhooks. Configuração granular." />
        </div>
      </section>

      {/* ════════════ CTA FINAL ════════════ */}
      <section style={{ padding: "44px 20px", background: "var(--c-ink-editorial)", textAlign: "center" }}>
        <div className="lp-eyebrow" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.62)", marginBottom: 14, justifyContent: "center" }}>
          <span className="dot" style={{ background: "var(--c-accent)" }} />
          Demonstração pública
        </div>
        <h2 style={{
          fontFamily: "var(--ff-display)",
          fontSize: 24, fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: "0 0 14px",
          color: "white",
        }}>
          Conheça a plataforma com personas reais do PGD.
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, margin: "0 0 22px" }}>
          Em produção, o acesso é via Gov.br. Na demonstração, escolha um perfil e explore o fluxo completo.
        </p>
        <a href="/login" className="lp-btn" style={{
          background: "white", color: "var(--c-ink-editorial)",
          justifyContent: "center", padding: "14px 22px",
          width: "100%", fontSize: 15,
        }}>
          Acessar demonstração
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ padding: "28px 20px 40px", background: "var(--c-ink-editorial)", color: "rgba(255,255,255,0.7)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Logo name="PGD Livre" onDark size="sm" />
        <p style={{ fontSize: 12, marginTop: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.55)" }}>
          Implementação SGD · Plataforma SEGES · Ministério da Gestão e da Inovação em Serviços Públicos
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
          {[
            { href: "https://pgdgovbr.github.io/docs/", label: "Documentação" },
            { href: "https://github.com/pgdgovbr", label: "Repositório" },
            { href: "#norma", label: "Atendimento à norma" },
            { href: "#arquitetura", label: "Arquitetura" },
            { href: "#conformidade", label: "Conformidade" },
            { href: "/login", label: "Demonstração" },
          ].map(it => (
            <li key={it.label}>
              <a href={it.href} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{it.label}</a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10.5 }}>AGPL-3.0</span>
          <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10.5 }}>CC-BY-4.0</span>
          <span className="lp-chip" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10.5 }}>v2.0</span>
        </div>
      </footer>
    </div>
  );
};

Object.assign(window, { ScreenLandingMobilePage });

const __mlpRoot = ReactDOM.createRoot(document.getElementById("root"));
__mlpRoot.render(<ScreenLandingMobilePage />);
