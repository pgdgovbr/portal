// landing-login.jsx — Login simplificado: APENAS demo (sem Gov.br/Google).
// Decisão: instâncias de produção real usam Gov.br via redirect direto; esta tela
// só aparece em instâncias de demonstração. Sem Google em nenhum cenário.

const PERSONAS = [
  { email: "servidor7@pgd-demo.gov.br", nome: "Marta Silva",    role: "servidor",        roleLabel: "Servidora",  ctx: "Sem plano — pode criar do zero", grupo: "recomendados" },
  { email: "servidor1@pgd-demo.gov.br", nome: "Nitai Bezerra",  role: "servidor",        roleLabel: "Servidor",   ctx: "Plano em execução; tem plano anterior para clonar", grupo: "recomendados" },
  { email: "chefe1@pgd-demo.gov.br",    nome: "Carlos Souza",   role: "chefe_imediato",  roleLabel: "Chefia",     ctx: "Tem recurso pendente para responder", grupo: "recomendados" },
  { email: "gestor@pgd-demo.gov.br",    nome: "Maria Fernanda", role: "gestor_unidade",  roleLabel: "Gestor",     ctx: "Aprova Plano de Entregas; vê conformidade", grupo: "recomendados" },

  { email: "servidor4@pgd-demo.gov.br", nome: "Lucas Ramos",    role: "servidor",        roleLabel: "Servidor",   ctx: "Plano em rascunho (ainda editando)", grupo: "servidor" },
  { email: "servidor6@pgd-demo.gov.br", nome: "Felipe Costa",   role: "servidor",        roleLabel: "Servidor",   ctx: "Chefia ajustou — aguarda assinatura dele", grupo: "servidor" },
  { email: "servidor2@pgd-demo.gov.br", nome: "João Santos",    role: "servidor",        roleLabel: "Servidor",   ctx: "Avaliação aguardando + convocação pendente", grupo: "servidor" },
  { email: "servidor3@pgd-demo.gov.br", nome: "Carla Mendes",   role: "servidor",        roleLabel: "Servidora",  ctx: "Avaliação nota 2; afastamento encerrado", grupo: "servidor" },

  { email: "chefe2@pgd-demo.gov.br",    nome: "Beatriz Lima",   role: "chefe_imediato",  roleLabel: "Chefia",     ctx: "Plano do Pedro aguardando assinatura dela", grupo: "chefia" },
  { email: "admin@pgd-demo.gov.br",     nome: "Roberto Admin",  role: "admin",           roleLabel: "Admin",      ctx: "Vê todos os erros de sync com API Central", grupo: "outros" },
];

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

// ── PersonaCard ────────────────────────────────────────────────────────
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

// ── LoginDemo (único card visível na tela /login da v2) ────────────────
const LoginDemo = () => {
  const recomendadas = PERSONAS.filter(p => p.grupo === "recomendados");
  const servidores   = PERSONAS.filter(p => p.grupo === "servidor");
  const chefia       = PERSONAS.filter(p => p.grupo === "chefia");
  const outros       = PERSONAS.filter(p => p.grupo === "outros");

  return (
    <div style={{
      background: "white",
      border: "1px solid rgba(11, 20, 38, 0.08)",
      borderRadius: 16,
      padding: 40,
      boxShadow: "0 1px 3px rgba(11, 20, 38, 0.04)",
    }}>
      <div style={{
        background: "var(--c-accent-soft)",
        border: "1px solid rgba(199, 116, 0, 0.22)",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 28,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}>
          <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <div style={{ fontSize: 12.5, color: "var(--c-accent-deep)", lineHeight: 1.5 }}>
          <strong>Instância de demonstração.</strong> Dados fictícios podem ser resetados.
          Em produção real, o acesso é feito exclusivamente via <strong>Gov.br</strong>.
        </div>
      </div>

      <div className="lp-eyebrow" style={{ marginBottom: 12 }}>
        <span className="dot" style={{ background: "var(--c-primary)" }} />
        Demonstração interativa
      </div>
      <h2 className="lp-h3" style={{ fontSize: 26, marginBottom: 8 }}>Escolha uma persona</h2>
      <p style={{ fontSize: 14, color: "var(--c-muted)", margin: "0 0 28px", lineHeight: 1.5, maxWidth: "60ch" }}>
        Cada persona tem dados e ações reais simulados. Você verá o sistema pela perspectiva dela —
        servidor, chefia, gestor ou administrador.
      </p>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--c-accent)" }}>★</span> Comece por aqui
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {recomendadas.map((p, i) => <PersonaCard key={i} persona={p} recommended />)}
        </div>
      </div>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
          Mais personas ({servidores.length + chefia.length + outros.length})
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </summary>

        {[
          { ttl: "Servidores", lista: servidores },
          { ttl: "Chefia",     lista: chefia },
          { ttl: "Admin",      lista: outros },
        ].filter(g => g.lista.length).map((g, i) => (
          <div key={i} style={{ marginBottom: 16, marginTop: 14 }}>
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

// LoginOficial removido na v2 — apenas demo é exposto.
const LoginOficial = () => null;

Object.assign(window, { PERSONAS, PersonaCard, LoginDemo, LoginOficial });
