// screens-mobile.jsx — iOS mobile mocks (Dashboard servidor + Registrar)
// O caso de uso comum é registrar execução pelo celular antes do prazo.

// ── Mobile chrome helpers ─────────────────────────────────────────────
const MobileNav = ({ title, back, right }) => (
  <div style={{
    height: 52, padding: "0 16px",
    display: "flex", alignItems: "center", gap: 12,
    borderBottom: "1px solid var(--c-border)",
    background: "white", position: "relative", zIndex: 5
  }}>
    {back && <button className="tn-iconbtn" style={{ width: 36, height: 36, marginLeft: -8 }}><Icon name="arrowL" size={18} /></button>}
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>{title}</div>
    </div>
    {right}
  </div>
);

const MobileTabBar = ({ active }) => {
  const tabs = [
    { id: "home", lbl: "Início",     icon: "home" },
    { id: "plano", lbl: "Meu Plano", icon: "file" },
    { id: "hist", lbl: "Histórico",  icon: "history" },
    { id: "notif", lbl: "Alertas",   icon: "bell" },
  ];
  return (
    <div style={{
      borderTop: "1px solid var(--c-border)",
      background: "white",
      padding: "8px 0 28px",
      display: "flex"
    }}>
      {tabs.map(t => (
        <div key={t.id} style={{
          flex: 1, textAlign: "center",
          color: active === t.id ? "var(--c-primary)" : "var(--c-muted)",
          padding: "6px 0",
          position: "relative"
        }}>
          <Icon name={t.icon} size={22} stroke={active === t.id ? 2.2 : 1.6} />
          <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: active === t.id ? 700 : 500 }}>{t.lbl}</div>
          {t.id === "notif" && <span style={{ position: "absolute", top: 4, right: "calc(50% - 14px)", width: 6, height: 6, borderRadius: 3, background: "var(--c-danger)" }} />}
        </div>
      ))}
    </div>
  );
};

// ── Mobile · Dashboard servidor ────────────────────────────────────────
const ScreenMobileDashboard = () => (
  <IOSDevice width={402} height={874}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)", fontFamily: "var(--ff-body)" }} className="pgd-app" data-density="confortavel">
      <MobileNav
        title="PGD Libre"
        right={
          <button className="tn-iconbtn" style={{ width: 36, height: 36, marginRight: -4 }}>
            <Icon name="bell" size={18} />
            <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 4, background: "var(--c-danger)" }} />
          </button>
        }
      />

      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px 24px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>Quarta · 15 mai</div>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "4px 0 0" }}>Olá, Ana</h2>
        </div>

        {/* Banner urgência */}
        <div style={{
          background: "linear-gradient(135deg, var(--c-warning-soft) 0%, white 100%)",
          border: "1px solid var(--c-warning)33",
          borderRadius: "var(--r-lg)",
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-warning)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="alert" size={16} stroke={2.2} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Registro de abril</div>
              <div style={{ fontSize: 12, color: "var(--c-muted)" }}>Vence em 6 dias · 10 mai</div>
            </div>
            <UrgencyPill daysLeft={6} label="6d" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", padding: "12px 16px", fontSize: 14 }}>
            Registrar agora <Icon name="arrowR" size={14} />
          </button>
        </div>

        {/* Plano card */}
        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <div className="kicker" style={{ marginBottom: 4 }}>Plano ativo</div>
          <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Plano 2026/1 · CGTIC</div>
          <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>01 fev → 31 jul · 30h/sem</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <StatusBadge status="execucao" />
            <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 18 }}>42%</span>
          </div>
          <div className="bar thin" style={{ marginTop: 8 }}><i style={{ width: "42%" }} /></div>
          <a href="#" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 13, color: "var(--c-primary)", fontWeight: 600 }}>
            Abrir meu plano <Icon name="arrowR" size={13} />
          </a>
        </div>

        {/* Avaliação recebida */}
        <div className="card" style={{ padding: 16, marginBottom: 14, background: "linear-gradient(135deg, var(--c-success-soft) 0%, white 70%)" }}>
          <div className="kicker" style={{ color: "var(--c-success)", marginBottom: 8 }}><Icon name="check" size={12} stroke={2.5} /> Avaliação recebida · mar/2026</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: "var(--ff-display)", fontSize: 56, fontWeight: 800, color: "var(--c-success)", lineHeight: 1, letterSpacing: "-0.04em" }}>2</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Alto desempenho</div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>por Carlos Mendes · 12 abr</div>
            </div>
          </div>
          <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, marginTop: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>Ver detalhes <Icon name="arrowR" size={12} /></a>
        </div>

        {/* Próximos prazos */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", margin: "8px 4px 8px" }}>Próximos prazos</div>
        <div className="card" style={{ padding: 0 }}>
          {[
            { d: "10", m: "mai", t: "Registrar abril/2026", urg: 6 },
            { d: "10", m: "jun", t: "Registrar maio/2026", urg: 37 },
            { d: "01", m: "jul", t: "Avaliação semestral", urg: 58 },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < 2 ? "1px solid var(--c-divider)" : "0" }}>
              <div style={{ width: 40, textAlign: "center", flex: "none" }}>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16 }}>{p.d}</div>
                <div style={{ fontSize: 10, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>{p.m}</div>
              </div>
              <div style={{ flex: 1, fontSize: 13 }}>{p.t}</div>
              <UrgencyPill daysLeft={p.urg} />
            </div>
          ))}
        </div>
      </div>

      <MobileTabBar active="home" />
    </div>
  </IOSDevice>
);

// ── Mobile · Registrar Execução ────────────────────────────────────────
const ScreenMobileRegistrar = () => (
  <IOSDevice width={402} height={874}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)", fontFamily: "var(--ff-body)" }} className="pgd-app" data-density="confortavel">
      <MobileNav
        title="Registrar abril"
        back
        right={<span className="urg urg-warn" style={{ fontSize: 11 }}><span className="dot" />6d</span>}
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Progress steps (compact) */}
        <div style={{ padding: "16px 16px 12px", background: "white", borderBottom: "1px solid var(--c-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>Etapa 2 de 4</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Descrição</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= 1 ? "var(--c-primary)" : "var(--c-bg-deep)" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 16px" }}>
          {/* Periodo (compact card) */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: "white", border: "1px solid var(--c-border)", borderRadius: "var(--r-md)" }}>
              <div style={{ fontSize: 10.5, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".06em" }}>De</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16 }}>01 abr</div>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", background: "white", border: "1px solid var(--c-border)", borderRadius: "var(--r-md)" }}>
              <div style={{ fontSize: 10.5, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".06em" }}>Até</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16 }}>30 abr</div>
            </div>
          </div>

          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 4px" }}>O que você executou?</h3>
          <p style={{ fontSize: 13, color: "var(--c-muted)", margin: "0 0 14px", lineHeight: 1.45 }}>
            Descreva contribuições, entregas e atividades do período. Mín. 50 caracteres.
          </p>

          {/* Textarea */}
          <textarea
            className="textarea"
            defaultValue={`• Migração SIAPE → PG16 concluída (1,2M linhas)
• 2 sessões de mentoria
• Revisão de 4 endpoints Gov.br ID
• Reunião com CGRH sobre SSO`}
            style={{ minHeight: 180, fontSize: 14, padding: 14, background: "white" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--c-muted)", marginTop: 6, marginBottom: 18 }}>
            <span>Auto-salvo · há 4s</span>
            <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>168 / 2000</span>
          </div>

          {/* Vincular contribuições */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
            Vincular contribuições
          </div>
          <div className="stack-12">
            {[
              { t: 1, ttl: "Migração SIAPE → PG16", pct: "35%", on: true },
              { t: 1, ttl: "Revisão APIs Gov.br",   pct: "30%", on: true },
              { t: 2, ttl: "Mentoria de novos",     pct: "20%", on: true },
              { t: 3, ttl: "Apoio CGRH · SSO",      pct: "15%", on: false },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "center",
                padding: 12, background: "white",
                border: c.on ? "1.5px solid var(--c-primary)" : "1px solid var(--c-border)",
                borderRadius: "var(--r-md)"
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: c.on ? "var(--c-primary)" : "var(--c-bg-deep)",
                  color: c.on ? "white" : "var(--c-muted)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flex: "none"
                }}>
                  {c.on && <Icon name="check" size={12} stroke={2.6} />}
                </span>
                <span className={`contrib-tipo t${c.t}`} style={{ width: 22, height: 22, fontSize: 11 }}>{c.t}</span>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{c.ttl}</div>
                <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 12.5, color: "var(--c-muted)" }}>{c.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{ padding: "12px 16px 28px", background: "white", borderTop: "1px solid var(--c-border)", display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: "none", padding: "12px 16px" }}><Icon name="arrowL" size={16} /></button>
        <button className="btn btn-primary" style={{ flex: 1, padding: "12px 16px", fontSize: 14 }}>
          Próximo: Ocorrências <Icon name="arrowR" size={16} />
        </button>
      </div>
    </div>
  </IOSDevice>
);

// ── Mobile · Dashboard Chefia ──────────────────────────────────────────
const ScreenMobileDashboardChefia = () => (
  <IOSDevice width={402} height={874}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)", fontFamily: "var(--ff-body)" }} className="pgd-app" data-density="confortavel">
      <MobileNav
        title="PGD Libre"
        right={
          <button className="tn-iconbtn" style={{ width: 36, height: 36, marginRight: -4 }}>
            <Icon name="bell" size={18} />
            <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 4, background: "var(--c-danger)" }} />
          </button>
        }
      />

      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px 24px" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>Chefia · CGTIC</div>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", margin: "4px 0 0" }}>Bom dia, Carlos</h2>
        </div>

        {/* KPIs em grid 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { lbl: "Servidores",   v: "12", sub: "ativos",   c: "var(--c-ink)" },
            { lbl: "Avaliações",   v: "5",  sub: "pendentes", c: "var(--c-warning)" },
            { lbl: "Em execução",  v: "10", sub: "planos",   c: "var(--c-success)" },
            { lbl: "Atrasados",    v: "1",  sub: "registro",  c: "var(--c-danger)" },
          ].map((k, i) => (
            <div key={i} className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 10.5, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".06em" }}>{k.lbl}</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 30, color: k.c, lineHeight: 1, marginTop: 6, letterSpacing: "-0.02em" }}>{k.v}</div>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Banner atraso */}
        <div style={{
          background: "linear-gradient(135deg, var(--c-danger-soft) 0%, white 100%)",
          border: "1px solid var(--c-danger)33", borderRadius: "var(--r-lg)",
          padding: 14, marginBottom: 16
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-danger)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="alert" size={16} stroke={2.2} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>Camila Souza · abril atrasado</div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>Venceu há 3 dias</div>
            </div>
          </div>
        </div>

        {/* Avaliações priorizadas */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", margin: "4px 4px 8px" }}>
          Avaliações pendentes
        </div>
        <div className="card" style={{ padding: 0 }}>
          {[
            { n: "Renata Santos",   d: 1, urg: "var(--c-danger)" },
            { n: "Lucas Pereira",   d: 2, urg: "var(--c-warning)" },
            { n: "Marcos Oliveira", d: 3, urg: "var(--c-warning)" },
            { n: "Juliana Almeida", d: 4 },
            { n: "Fernanda Cardoso", d: 5 },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < 4 ? "1px solid var(--c-divider)" : "0" }}>
              <span className="av av-sm" style={{ background: avatarColor(a.n), color: "white" }}>{initialsOf(a.n)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.n}</div>
                <div style={{ fontSize: 11, color: "var(--c-muted)" }}>período abr/2026</div>
              </div>
              <UrgencyPill daysLeft={a.d} label={`${a.d}d`} />
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar Chefia */}
      <div style={{ borderTop: "1px solid var(--c-border)", background: "white", padding: "8px 0 28px", display: "flex" }}>
        {[
          { id: "home",  lbl: "Início",     icon: "home", active: true },
          { id: "eq",    lbl: "Equipe",     icon: "users" },
          { id: "aval",  lbl: "Avaliações", icon: "check" },
          { id: "notif", lbl: "Alertas",    icon: "bell", badge: true },
        ].map(t => (
          <div key={t.id} style={{ flex: 1, textAlign: "center", color: t.active ? "var(--c-primary)" : "var(--c-muted)", padding: "6px 0", position: "relative" }}>
            <Icon name={t.icon} size={22} stroke={t.active ? 2.2 : 1.6} />
            <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: t.active ? 700 : 500 }}>{t.lbl}</div>
            {t.badge && <span style={{ position: "absolute", top: 4, right: "calc(50% - 14px)", width: 6, height: 6, borderRadius: 3, background: "var(--c-danger)" }} />}
          </div>
        ))}
      </div>
    </div>
  </IOSDevice>
);

// ── Mobile · Lista da Equipe (Chefia) ──────────────────────────────────
const ScreenMobileEquipe = () => {
  // Use os mesmos dados de chefia
  const lista = (window.EQUIPE || []).slice(0, 8);
  return (
    <IOSDevice width={402} height={874}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)", fontFamily: "var(--ff-body)" }} className="pgd-app" data-density="confortavel">
        <MobileNav
          title="Equipe"
          right={<button className="tn-iconbtn" style={{ width: 36, height: 36, marginRight: -4 }}><Icon name="plus" size={20} /></button>}
        />

        {/* Filter pill bar */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflow: "auto", background: "white", borderBottom: "1px solid var(--c-border)" }}>
          {["Todos · 12", "Avaliar · 5", "Atrasados · 1", "TT Integral", "TT Parcial"].map((p, i) => (
            <span key={i} style={{
              padding: "6px 12px", borderRadius: 999,
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
              background: i === 0 ? "var(--c-primary)" : "var(--c-surface-2)",
              color: i === 0 ? "white" : "var(--c-ink-2)"
            }}>{p}</span>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "12px 16px 24px" }}>
          <div className="stack-12">
            {lista.map((s, i) => (
              <div key={i} className="card" style={{ padding: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="av av-md" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nome}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "var(--ff-mono)", marginTop: 1 }}>SIAPE {s.siape}</div>
                  </div>
                  <ModalidadeBadge codigo={s.mod} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <div className="bar thin" style={{ flex: 1 }}><i style={{ width: `${s.prog}%` }} /></div>
                  <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 12.5, minWidth: 32, textAlign: "right" }}>{s.prog}%</span>
                </div>
                {(s.aval.urg !== null || (s.reg.urg !== null && s.reg.urg < 0)) && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    {s.aval.urg !== null && <UrgencyPill daysLeft={s.aval.urg} label={`Avaliar em ${s.aval.urg}d`} />}
                    {s.reg.urg !== null && s.reg.urg < 0 && <UrgencyPill daysLeft={s.reg.urg} />}
                    <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto", padding: "4px 10px", fontSize: 11.5 }}>Avaliar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--c-border)", background: "white", padding: "8px 0 28px", display: "flex" }}>
          {[
            { id: "home",  lbl: "Início",     icon: "home" },
            { id: "eq",    lbl: "Equipe",     icon: "users", active: true },
            { id: "aval",  lbl: "Avaliações", icon: "check" },
            { id: "notif", lbl: "Alertas",    icon: "bell", badge: true },
          ].map(t => (
            <div key={t.id} style={{ flex: 1, textAlign: "center", color: t.active ? "var(--c-primary)" : "var(--c-muted)", padding: "6px 0", position: "relative" }}>
              <Icon name={t.icon} size={22} stroke={t.active ? 2.2 : 1.6} />
              <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: t.active ? 700 : 500 }}>{t.lbl}</div>
              {t.badge && <span style={{ position: "absolute", top: 4, right: "calc(50% - 14px)", width: 6, height: 6, borderRadius: 3, background: "var(--c-danger)" }} />}
            </div>
          ))}
        </div>
      </div>
    </IOSDevice>
  );
};

// ── Mobile · Avaliar Registro (Chefia) ─────────────────────────────────
const ScreenMobileAvaliar = () => {
  const [nota, setNota] = React.useState(2);
  const requerJustif = nota === 1 || nota === 4 || nota === 5;
  return (
    <IOSDevice width={402} height={874}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--c-bg)", fontFamily: "var(--ff-body)" }} className="pgd-app" data-density="confortavel">
        <MobileNav title="Avaliar · abr/2026" back right={<UrgencyPill daysLeft={1} label="1d" />} />

        <div style={{ flex: 1, overflow: "auto", padding: "16px 16px 100px" }}>
          {/* Servidor */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <span className="av av-lg" style={{ background: avatarColor("Renata Santos"), color: "white" }}>RS</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Renata Santos</div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>SIAPE 1734829 · CGTIC</div>
            </div>
          </div>

          {/* Descrição (collapsible look) */}
          <div className="card" style={{ padding: 14, marginBottom: 16 }}>
            <div className="kicker" style={{ marginBottom: 8 }}><Icon name="eye" size={12} /> Descrição submetida</div>
            <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.55, maxHeight: 110, overflow: "hidden", position: "relative" }}>
              Concluí o deploy da v3.1 do portal interno em 18/abr, dentro do prazo previsto. Cobertura de testes ficou em 84%. Atendi 23 chamados de sustentação. Documentei 6 endpoints novos da API...
            </p>
            <a href="#" style={{ fontSize: 12, color: "var(--c-primary)", fontWeight: 600, marginTop: 8, display: "inline-block" }}>Ver completo →</a>
          </div>

          {/* Nota */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
            Sua nota
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 14 }}>
            {[
              { n: 1, c: "var(--c-nota-1)" },
              { n: 2, c: "var(--c-nota-2)" },
              { n: 3, c: "var(--c-nota-3)" },
              { n: 4, c: "var(--c-nota-4)" },
              { n: 5, c: "var(--c-nota-5)" },
            ].map(it => (
              <button key={it.n}
                onClick={() => setNota(it.n)}
                style={{
                  padding: "16px 4px", borderRadius: "var(--r-md)",
                  border: `1.5px solid ${nota === it.n ? it.c : "var(--c-border-strong)"}`,
                  background: nota === it.n ? it.c : "white",
                  color: nota === it.n ? "white" : "var(--c-ink)",
                  fontFamily: "var(--ff-display)", fontWeight: 800,
                  fontSize: 24, lineHeight: 1, cursor: "pointer"
                }}>{it.n}</button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: ({1:"var(--c-nota-1)",2:"var(--c-nota-2)",3:"var(--c-nota-3)",4:"var(--c-nota-4)",5:"var(--c-nota-5)"})[nota] }}>
              {({1:"Excepcional",2:"Alto desempenho",3:"Adequado",4:"Inadequado",5:"Não executado"})[nota]}
            </span>
          </div>

          {/* Justificativa */}
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>
            Justificativa {requerJustif ? <span style={{ color: "var(--c-danger)" }}>(obrigatória)</span> : <span style={{ color: "var(--c-muted-2)" }}>(opcional)</span>}
          </label>
          <textarea
            className="textarea"
            placeholder={requerJustif ? "Descreva os fatos que justificam esta nota..." : "Comentários adicionais (opcional)..."}
            defaultValue={nota === 2 ? "Entregas dentro do prazo e cobertura de testes acima da meta." : ""}
            style={{ minHeight: 120, fontSize: 14, background: "white" }}
          />
          {requerJustif && (
            <div style={{ fontSize: 11.5, color: "var(--c-danger)", marginTop: 6, display: "flex", gap: 4, alignItems: "center" }}>
              <Icon name="alert" size={12} /> Notas 1, 4 e 5 exigem justificativa.
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        <div style={{ padding: "12px 16px 28px", background: "white", borderTop: "1px solid var(--c-border)" }}>
          <button className="btn btn-primary" style={{ width: "100%", padding: "14px 16px", fontSize: 14.5 }}>
            <Icon name="check" size={16} stroke={2.4} /> Confirmar avaliação
          </button>
        </div>
      </div>
    </IOSDevice>
  );
};

Object.assign(window, {
  ScreenMobileDashboard, ScreenMobileRegistrar,
  ScreenMobileDashboardChefia, ScreenMobileEquipe, ScreenMobileAvaliar,
});
