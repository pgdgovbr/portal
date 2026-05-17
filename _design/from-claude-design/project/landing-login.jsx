// landing-login.jsx — tela de login com 3 caminhos (Gov.br, Google, demo)

// Personas do seed
const PERSONAS = [
  { email: "servidor7@pgd-demo.gov.br", nome: "Marta Silva",    role: "servidor",        roleLabel: "Servidora",  ctx: "Sem plano — pode criar do zero", dest: "primeira jornada", grupo: "recomendados" },
  { email: "servidor1@pgd-demo.gov.br", nome: "Ana Silva",      role: "servidor",        roleLabel: "Servidora",  ctx: "Plano em execução; tem plano anterior para clonar", dest: "fluxo completo", grupo: "recomendados" },
  { email: "chefe1@pgd-demo.gov.br",    nome: "Carlos Souza",   role: "chefe_imediato",  roleLabel: "Chefia",     ctx: "Tem recurso pendente para responder", dest: "fluxo da chefia", grupo: "recomendados" },
  { email: "gestor@pgd-demo.gov.br",    nome: "Maria Fernanda", role: "gestor_unidade",  roleLabel: "Gestor",     ctx: "Aprova Plano de Entregas; vê conformidade", dest: "visão gestor", grupo: "recomendados" },

  { email: "servidor4@pgd-demo.gov.br", nome: "Lucas Ramos",    role: "servidor",        roleLabel: "Servidor",   ctx: "Plano em rascunho (ainda editando)", grupo: "servidor" },
  { email: "servidor6@pgd-demo.gov.br", nome: "Felipe Costa",   role: "servidor",        roleLabel: "Servidor",   ctx: "Chefia ajustou — aguarda assinatura dele", grupo: "servidor" },
  { email: "servidor2@pgd-demo.gov.br", nome: "João Santos",    role: "servidor",        roleLabel: "Servidor",   ctx: "Avaliação aguardando + convocação pendente", grupo: "servidor" },
  { email: "servidor3@pgd-demo.gov.br", nome: "Carla Mendes",   role: "servidor",        roleLabel: "Servidora",  ctx: "Avaliação nota 2; afastamento encerrado", grupo: "servidor" },

  { email: "chefe2@pgd-demo.gov.br",    nome: "Beatriz Lima",   role: "chefe_imediato",  roleLabel: "Chefia",     ctx: "Plano do Pedro aguardando assinatura dela", grupo: "chefia" },
  { email: "admin@pgd-demo.gov.br",     nome: "Roberto Admin",  role: "admin",           roleLabel: "Admin",      ctx: "Vê todos os erros de sync com API Central", grupo: "outros" },
];

// Avatar deterministico
const personaColor = (nome) => {
  const palette = [
    { bg: "#E6EEF8", fg: "#0F3D8C" },
    { bg: "#E2F2E4", fg: "#168821" },
    { bg: "#FCF1DC", fg: "#C77400" },
    { bg: "#EFE8F7", fg: "#5C2D91" },
    { bg: "#FBE6E6", fg: "#B91C1C" },
    { bg: "#DCEDF9", fg: "#0E7490" },
  ];
  let h = 0;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
};
const personaInitials = (nome) => nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

// ── Persona Card ───────────────────────────────────────────────────────
const PersonaCard = ({ persona, recommended }) => {
  const c = personaColor(persona.nome);
  return (
    <a href={`/auth/dev-login?email=${persona.email}&name=${encodeURIComponent(persona.nome)}&role=${persona.role}`} style={{
      display: "flex", gap: 12, alignItems: "center",
      padding: 14,
      background: "white",
      border: recommended ? "1.5px solid var(--c-primary)" : "1px solid rgba(11, 20, 38, 0.08)",
      boxShadow: recommended ? "0 0 0 4px rgba(15, 61, 140, 0.08)" : "none",
      borderRadius: 12,
      textDecoration: "none", color: "inherit",
      transition: "all .12s ease",
      position: "relative",
    }}>
      <span style={{
        width: 42, height: 42, borderRadius: 11,
        background: c.bg, color: c.fg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 14,
        flex: "none",
      }}>{personaInitials(persona.nome)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ fontSize: 14.5, color: "var(--c-ink-editorial)" }}>{persona.nome}</strong>
          <span style={{ fontSize: 11, color: c.fg, fontWeight: 600, background: c.bg, padding: "2px 8px", borderRadius: 999 }}>
            {persona.roleLabel}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--c-muted)", marginTop: 4, lineHeight: 1.45 }}>{persona.ctx}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-muted)", flex: "none" }}><path d="M9 6l6 6-6 6"/></svg>
    </a>
  );
};

// ── Login Card (oficiais) ──────────────────────────────────────────────
const LoginOficial = () => (
  <div style={{
    background: "white",
    border: "1px solid rgba(11, 20, 38, 0.08)",
    borderRadius: 16,
    padding: 36,
    boxShadow: "0 1px 3px rgba(11, 20, 38, 0.04)",
  }}>
    <div className="lp-eyebrow" style={{ marginBottom: 12 }}>
      <span className="dot" style={{ background: "var(--c-primary)" }} />
      Acesso oficial
    </div>
    <h2 className="lp-h3" style={{ fontSize: 26, marginBottom: 8 }}>Entrar no PGD Libre</h2>
    <p style={{ fontSize: 14, color: "var(--c-muted)", margin: "0 0 28px", lineHeight: 1.5 }}>
      Use sua conta oficial gov.br ou Google institucional.
    </p>

    <a href="/auth/login/govbr" className="lp-btn lp-btn-govbr lp-btn-lg" style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
      <span style={{
        width: 22, height: 22, borderRadius: 4,
        background: "white", color: "var(--c-primary)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 11,
      }}>br</span>
      Entrar com Gov.br
    </a>

    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
      <span style={{ flex: 1, height: 1, background: "rgba(11, 20, 38, 0.08)" }} />
      <span style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>ou</span>
      <span style={{ flex: 1, height: 1, background: "rgba(11, 20, 38, 0.08)" }} />
    </div>

    <a href="/auth/login/google" className="lp-btn lp-btn-outline lp-btn-lg" style={{ width: "100%", justifyContent: "center", padding: "15px" }}>
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Entrar com Google
    </a>

    <p style={{ fontSize: 12, color: "var(--c-muted)", margin: "26px 0 0", lineHeight: 1.5, textAlign: "center" }}>
      Ao entrar você concorda com a <a href="#" style={{ color: "var(--c-primary)" }}>política de privacidade</a> e os termos de uso da plataforma.
    </p>
  </div>
);

// ── Login Demo ─────────────────────────────────────────────────────────
const LoginDemo = ({ initialFocus }) => {
  const recomendadas = PERSONAS.filter(p => p.grupo === "recomendados");
  const servidores   = PERSONAS.filter(p => p.grupo === "servidor");
  const chefia       = PERSONAS.filter(p => p.grupo === "chefia");
  const outros       = PERSONAS.filter(p => p.grupo === "outros");

  return (
    <div style={{
      background: "var(--c-paper-2)",
      border: "1px solid rgba(11, 20, 38, 0.08)",
      borderRadius: 16,
      padding: 36,
      position: "relative",
    }}>
      {/* Banner amarelo */}
      <div style={{
        background: "var(--c-accent-soft)",
        border: "1px solid rgba(199, 116, 0, 0.22)",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 24,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}>
          <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <div style={{ fontSize: 12.5, color: "var(--c-accent-deep)", lineHeight: 1.5 }}>
          <strong>Instância de demonstração.</strong> Dados fictícios podem ser resetados.
          Esta tela não aparece em produção real.
        </div>
      </div>

      <div className="lp-eyebrow" style={{ marginBottom: 12 }}>
        <span className="dot" style={{ background: "var(--c-accent)" }} />
        Explorar como demonstração
      </div>
      <h2 className="lp-h3" style={{ fontSize: 26, marginBottom: 8 }}>Escolha uma persona</h2>
      <p style={{ fontSize: 14, color: "var(--c-muted)", margin: "0 0 24px", lineHeight: 1.5 }}>
        Cada persona tem dados e ações reais simulados — explore o sistema pela perspectiva dela.
      </p>

      {/* Recomendados */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--c-accent)" }}>★</span> Comece por aqui
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {recomendadas.map((p, i) => <PersonaCard key={i} persona={p} recommended />)}
        </div>
      </div>

      {/* Outros — colapsável visualmente (sempre aberto neste mock) */}
      <details open style={{ marginTop: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
          Mais personas ({servidores.length + chefia.length + outros.length})
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </summary>

        {[
          { ttl: "Servidores", lista: servidores },
          { ttl: "Chefia",     lista: chefia },
          { ttl: "Admin",      lista: outros },
        ].filter(g => g.lista.length).map((g, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-muted)", marginBottom: 8 }}>{g.ttl}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {g.lista.map((p, j) => <PersonaCard key={j} persona={p} />)}
            </div>
          </div>
        ))}
      </details>
    </div>
  );
};

Object.assign(window, { PERSONAS, PersonaCard, LoginOficial, LoginDemo });
