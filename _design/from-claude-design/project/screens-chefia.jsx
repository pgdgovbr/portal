// screens-chefia.jsx — Carlos Mendes (chefe imediato, CGTIC, 12 servidores)
// Telas: Dashboard, Lista da Equipe, Detalhe do Plano, Avaliar Registro.

const CHEFE = { name: "Carlos Mendes", role: "Chefia · CGTIC", initials: "CM" };

// Mock de equipe (12 servidores)
const EQUIPE = [
  { nome: "Nitai Bezerra",  siape: "1928374", mod: 3, status: "execucao", reg: { texto: "Pendente · abr/2026", urg: 6 }, aval: { texto: "—", urg: null }, contrib: 4, prog: 42 },
  { nome: "Lucas Pereira",      siape: "2840193", mod: 2, status: "execucao", reg: { texto: "07 mai", urg: 13 }, aval: { texto: "Avaliar abr/2026", urg: 2 }, contrib: 3, prog: 48 },
  { nome: "Renata Santos",      siape: "1734829", mod: 3, status: "execucao", reg: { texto: "06 mai", urg: 12 }, aval: { texto: "Avaliar abr/2026", urg: 1 }, contrib: 5, prog: 51 },
  { nome: "Juliana Almeida",    siape: "1638204", mod: 2, status: "execucao", reg: { texto: "09 mai", urg: 15 }, aval: { texto: "Avaliar abr/2026", urg: 4 }, contrib: 4, prog: 45 },
  { nome: "Felipe Ribeiro",     siape: "1947382", mod: 3, status: "aprovado", reg: { texto: "—", urg: null }, aval: { texto: "—", urg: null }, contrib: 3, prog: 0 },
  { nome: "Camila Souza",       siape: "1857361", mod: 3, status: "execucao", reg: { texto: "Pendente · abr/2026", urg: -3 }, aval: { texto: "—", urg: null }, contrib: 4, prog: 39 },
  { nome: "Marcos Oliveira",    siape: "2074831", mod: 1, status: "execucao", reg: { texto: "08 mai", urg: 14 }, aval: { texto: "Avaliar abr/2026", urg: 3 }, contrib: 3, prog: 50 },
  { nome: "Patrícia Lima",      siape: "1903728", mod: 2, status: "execucao", reg: { texto: "05 mai", urg: 11 }, aval: { texto: "—", urg: null }, contrib: 4, prog: 47 },
  { nome: "Rodrigo Martins",    siape: "2183920", mod: 1, status: "avaliado", reg: { texto: "Concluído", urg: null }, aval: { texto: "Concluída", urg: null }, contrib: 4, prog: 100 },
  { nome: "Fernanda Cardoso",   siape: "1748392", mod: 3, status: "execucao", reg: { texto: "07 mai", urg: 13 }, aval: { texto: "Avaliar abr/2026", urg: 5 }, contrib: 5, prog: 46 },
  { nome: "Daniel Ferreira",    siape: "1639482", mod: 3, status: "execucao", reg: { texto: "10 mai", urg: 16 }, aval: { texto: "—", urg: null }, contrib: 3, prog: 44 },
  { nome: "Bruno Tavares",      siape: "1892374", mod: 2, status: "rascunho", reg: { texto: "—", urg: null }, aval: { texto: "—", urg: null }, contrib: 0, prog: 0 },
];

// ── Avatar helper ──────────────────────────────────────────────────────
const initialsOf = (nome) => nome.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
const avatarColor = (nome) => {
  const palette = ["#0F3D8C", "#168821", "#5C2D91", "#C77400", "#0E7490", "#B91C1C", "#2563EB", "#1E40AF"];
  let h = 0; for (const c of nome) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
};

// ── Dashboard Chefia ───────────────────────────────────────────────────
const ScreenDashboardChefia = ({ density }) => {
  const pendentes = EQUIPE.filter(e => e.aval.urg !== null).slice(0, 5);
  const atrasados = EQUIPE.filter(e => e.reg.urg !== null && e.reg.urg < 0);

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Dashboard · Chefia">
      <TopNav role="chefia" active="home" alerts={6} user={CHEFE} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Início · Chefia imediata</div>
            <h1 className="pg-title">Bom dia, Carlos</h1>
            <p className="pg-sub">5 avaliações pendentes · 1 servidor com registro atrasado · plano de entregas da CGTIC em revisão.</p>
          </div>
          <div style={{ textAlign: "right", color: "var(--c-muted)", fontSize: 13.5 }}>
            <div>Quarta-feira</div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, color: "var(--c-ink)", fontSize: 18, marginTop: 2 }}>15 mai 2026</div>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="g-4" style={{ marginBottom: "var(--gap-sec)" }}>
          {[
            { lbl: "Servidores ativos",       val: "12", sub: "de 14 no setor",                  c: "var(--c-ink)" },
            { lbl: "Planos em execução",      val: "10", sub: "1 aprovado · 1 rascunho",         c: "var(--c-success)" },
            { lbl: "Avaliações pendentes",    val: "5",  sub: "2 vencem em ≤ 3 dias",            c: "var(--c-warning)" },
            { lbl: "Registros em atraso",     val: "1",  sub: "Camila Souza · abril/2026",       c: "var(--c-danger)" },
          ].map((k, i) => (
            <div className="card" key={i} style={{ padding: 22 }}>
              <div className="kpi-label">{k.lbl}</div>
              <div className="kpi-num" style={{ color: k.c, marginTop: 4 }}>{k.val}</div>
              <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Urgency banners */}
        {atrasados.length > 0 && (
          <div className="banner urgent" style={{ marginBottom: 14 }}>
            <span className="icon"><Icon name="alert" size={20} stroke={2} /></span>
            <div style={{ flex: 1 }}>
              <div className="ttl">{atrasados[0].nome} · registro de abril em atraso</div>
              <div className="sub">Prazo legal venceu há 3 dias. Notifique o servidor ou registre uma ocorrência.</div>
            </div>
            <button className="btn btn-ghost btn-sm">Ver perfil</button>
            <button className="btn btn-primary btn-sm">Notificar</button>
          </div>
        )}

        <div className="g-2-1">
          {/* Avaliações pendentes — destaque */}
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Avaliações que precisam da sua atenção</h2>
                <p>Você tem até 20 dias após o registro do servidor para avaliar.</p>
              </div>
              <a href="#" style={{ fontSize: 13, color: "var(--c-primary)", fontWeight: 600 }}>Ver todas (5) →</a>
            </div>

            <div className="stack-12">
              {pendentes.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", background: i === 0 ? "var(--c-warning-soft)" : "var(--c-surface-2)", borderRadius: "var(--r-md)", border: i === 0 ? "1px solid var(--c-warning)33" : "1px solid var(--c-border)" }}>
                  <span className="av av-md" style={{ background: avatarColor(p.nome), color: "white" }}>{initialsOf(p.nome)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--c-ink)" }}>{p.nome}</div>
                    <div style={{ fontSize: 12.5, color: "var(--c-muted)" }}>SIAPE {p.siape} · Plano 2026/1 · período abr/2026</div>
                  </div>
                  <UrgencyPill daysLeft={p.aval.urg} label={`Avaliar em ${p.aval.urg} dia${p.aval.urg === 1 ? "" : "s"}`} />
                  <button className="btn btn-primary btn-sm">Avaliar</button>
                </div>
              ))}
            </div>
          </section>

          {/* Side */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Conformidade do time</h2></div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: "-0.02em" }}>
                <span style={{ color: "var(--c-success)" }}>92%</span>
                <span style={{ fontSize: 16, color: "var(--c-muted)", fontWeight: 500, marginLeft: 8 }}>em dia</span>
              </div>
              <div className="bar" style={{ marginTop: 14 }}>
                <i style={{ width: "92%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--c-muted)", marginTop: 10 }}>
                <span>11 servidores em dia</span>
                <span>1 em atraso</span>
              </div>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Plano de Entregas da CGTIC</h2></div>
              <div className="kicker">2026/1 · «Modernização do parque tecnológico»</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <StatusBadge status="execucao" />
                <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>47% concluído</span>
              </div>
              <div className="bar thin" style={{ marginTop: 8 }}><i style={{ width: "47%" }} /></div>
              <div className="stack-12" style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>Entregas vinculadas</span><strong>14</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>Concluídas</span><strong style={{ color: "var(--c-success)" }}>7</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>Em risco</span><strong style={{ color: "var(--c-warning)" }}>2</strong>
                </div>
              </div>
            </section>

            <section className="card" style={{ borderLeft: "3px solid var(--c-primary)" }}>
              <div className="kicker" style={{ color: "var(--c-primary)" }}><Icon name="plus" size={13} /> Ação rápida</div>
              <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 12px" }}>Criar Plano de Trabalho para Felipe Ribeiro (sem plano ativo).</p>
              <button className="btn btn-primary btn-sm" style={{ width: "100%" }}><Icon name="plus" size={14} /> Criar Plano de Trabalho</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Lista da Equipe — supports view tweak: tabela / kanban / cards ─────
const ScreenListaEquipe = ({ density, view }) => {
  const renderTabela = () => (
    <table className="tbl">
      <thead>
        <tr>
          <th></th>
          <th>Servidor</th>
          <th>Modalidade</th>
          <th>Plano</th>
          <th>Progresso</th>
          <th>Próximo registro</th>
          <th>Avaliação</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {EQUIPE.map((s, i) => (
          <tr key={i}>
            <td style={{ width: 0 }}>
              <span className="av av-sm" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
            </td>
            <td>
              <div style={{ fontWeight: 600, color: "var(--c-ink)" }}>{s.nome}</div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "var(--ff-mono)" }}>SIAPE {s.siape}</div>
            </td>
            <td><ModalidadeBadge codigo={s.mod} /></td>
            <td><StatusBadge status={s.status} /></td>
            <td style={{ minWidth: 130 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="bar thin" style={{ flex: 1 }}><i style={{ width: `${s.prog}%` }} /></div>
                <span style={{ fontSize: 12, fontFamily: "var(--ff-display)", fontWeight: 600, minWidth: 30, textAlign: "right" }}>{s.prog}%</span>
              </div>
            </td>
            <td>
              {s.reg.urg !== null
                ? <UrgencyPill daysLeft={s.reg.urg} />
                : <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>{s.reg.texto}</span>}
            </td>
            <td>
              {s.aval.urg !== null
                ? <UrgencyPill daysLeft={s.aval.urg} label={`${s.aval.urg}d para avaliar`} />
                : <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>{s.aval.texto}</span>}
            </td>
            <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              {s.aval.urg !== null
                ? <button className="btn btn-primary btn-sm">Avaliar</button>
                : <button className="btn btn-ghost btn-sm">Detalhes</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderKanban = () => {
    const cols = [
      { ttl: "Sem plano",         items: EQUIPE.filter(s => s.status === "rascunho" || s.status === "aprovado"), c: "var(--c-muted)" },
      { ttl: "Em execução",       items: EQUIPE.filter(s => s.status === "execucao" && s.aval.urg === null), c: "var(--c-success)" },
      { ttl: "Avaliação pendente", items: EQUIPE.filter(s => s.aval.urg !== null), c: "var(--c-warning)" },
      { ttl: "Avaliado",          items: EQUIPE.filter(s => s.status === "avaliado"), c: "var(--c-status-aval)" },
    ];
    return (
      <div className="g-4" style={{ gap: 14 }}>
        {cols.map((col, i) => (
          <div key={i} style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-md)", padding: 12, minHeight: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "0 4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: col.c }} />
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--c-ink-2)" }}>{col.ttl}</div>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--c-muted)", background: "white", padding: "2px 7px", borderRadius: 10 }}>{col.items.length}</span>
            </div>
            <div className="stack-12">
              {col.items.map((s, j) => (
                <div key={j} style={{ background: "white", borderRadius: "var(--r-sm)", padding: 12, border: "1px solid var(--c-border)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <span className="av av-sm" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nome}</div>
                      <div style={{ fontSize: 11, color: "var(--c-muted)", fontFamily: "var(--ff-mono)" }}>{s.siape}</div>
                    </div>
                  </div>
                  <ModalidadeBadge codigo={s.mod} />
                  {s.aval.urg !== null && <div style={{ marginTop: 8 }}><UrgencyPill daysLeft={s.aval.urg} label={`${s.aval.urg}d`} /></div>}
                  {s.reg.urg !== null && s.reg.urg < 0 && <div style={{ marginTop: 8 }}><UrgencyPill daysLeft={s.reg.urg} /></div>}
                  <div className="bar thin" style={{ marginTop: 10 }}><i style={{ width: `${s.prog}%` }} /></div>
                </div>
              ))}
              {col.items.length === 0 && <div style={{ fontSize: 12, color: "var(--c-muted-2)", textAlign: "center", padding: 20 }}>—</div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCards = () => (
    <div className="g-3" style={{ gap: 14 }}>
      {EQUIPE.map((s, i) => (
        <div key={i} className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <span className="av av-lg" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nome}</div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "var(--ff-mono)", marginTop: 2 }}>SIAPE {s.siape}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <ModalidadeBadge codigo={s.mod} />
            <StatusBadge status={s.status} />
          </div>
          <div style={{ fontSize: 12, color: "var(--c-muted)", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
            <span>Progresso do plano</span><strong style={{ color: "var(--c-ink)", fontFamily: "var(--ff-display)" }}>{s.prog}%</strong>
          </div>
          <div className="bar thin"><i style={{ width: `${s.prog}%` }} /></div>
          <div className="divider" />
          {s.aval.urg !== null
            ? <UrgencyPill daysLeft={s.aval.urg} label={`Avaliar em ${s.aval.urg} dia${s.aval.urg === 1 ? "" : "s"}`} />
            : s.reg.urg !== null && s.reg.urg < 0
              ? <UrgencyPill daysLeft={s.reg.urg} />
              : <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Sem ações pendentes</span>}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {s.aval.urg !== null
              ? <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Avaliar</button>
              : <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Detalhes</button>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Lista da Equipe · Chefia">
      <TopNav role="chefia" active="equipe" alerts={6} user={CHEFE} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Equipe · CGTIC</div>
            <h1 className="pg-title">Servidores sob minha chefia</h1>
            <p className="pg-sub">12 servidores ativos · 5 avaliações pendentes · 1 registro em atraso</p>
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={16} /> Criar Plano de Trabalho</button>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: 14, marginBottom: "var(--gap-sec)", display: "flex", gap: 12, alignItems: "center" }}>
          <div className="input-prefix" style={{ flex: 1, maxWidth: 360 }}>
            <span className="pf"><Icon name="search" size={14} /></span>
            <input className="input" placeholder="Buscar por nome ou SIAPE…" />
          </div>
          <select className="select" style={{ width: 180 }}><option>Todos os status</option><option>Em execução</option></select>
          <select className="select" style={{ width: 180 }}><option>Todas as modalidades</option><option>Teletrabalho integral</option></select>
          <select className="select" style={{ width: 220 }}><option>Plano de Entregas «Mod. 2026»</option></select>
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--c-muted)" }}>{EQUIPE.length} servidores</span>
        </div>

        <section className="card" style={view === "tabela" ? null : { padding: 16, background: "transparent", border: "none", boxShadow: "none" }}>
          {view === "tabela" && renderTabela()}
          {view === "kanban" && renderKanban()}
          {view === "cards"  && renderCards()}
        </section>
      </div>
    </div>
  );
};

// ── Detalhe do Plano de Trabalho (Chefia) ──────────────────────────────
const ScreenDetalhePlano = ({ density }) => {
  const SERV = { nome: "Lucas Pereira", siape: "2840193", cargo: "Analista de TI", mod: 2 };

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Detalhe do Plano · Chefia">
      <TopNav role="chefia" active="equipe" alerts={6} user={CHEFE} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Equipe</a><span className="sep">/</span>
          <a href="#">{SERV.nome}</a><span className="sep">/</span>
          <span>Plano 2026/1</span>
        </div>

        <div className="pg-head">
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <span className="av av-lg" style={{ background: avatarColor(SERV.nome), color: "white", width: 60, height: 60, fontSize: 18 }}>{initialsOf(SERV.nome)}</span>
            <div>
              <div className="pg-eyebrow">Plano de Trabalho 2026/1</div>
              <h1 className="pg-title" style={{ fontSize: 28 }}>{SERV.nome}</h1>
              <p className="pg-sub" style={{ marginTop: 4 }}>SIAPE {SERV.siape} · {SERV.cargo} · <ModalidadeBadge codigo={SERV.mod} /></p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-ghost"><Icon name="edit" size={15} /> Editar plano</button>
            <button className="btn btn-primary">Avaliar registro de abril</button>
          </div>
        </div>

        <div className="g-2-1">
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div>
                  <div className="kpi-label">Status</div>
                  <div style={{ marginTop: 6 }}><StatusBadge status="execucao" /></div>
                </div>
                <div>
                  <div className="kpi-label">Período</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, marginTop: 6 }}>01 fev → 31 jul</div>
                </div>
                <div>
                  <div className="kpi-label">Carga</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, marginTop: 6 }}>40 h/sem</div>
                </div>
                <div>
                  <div className="kpi-label">Plano de Entregas</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>Modernização 2026</div>
                </div>
              </div>
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink-2)" }}>Progresso do semestre</div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>48% concluído</div>
              </div>
              <div className="bar"><i style={{ width: "48%" }} /></div>
            </section>

            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Contribuições</h2>
                  <p>3 contribuições · soma 100%</p>
                </div>
                <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13} /> Editar</button>
              </div>
              {[
                { t: 1, ttl: "Atualização do portal de serviços", desc: "Entrega «Renovação do portal CGTIC».", pct: "50%" },
                { t: 2, ttl: "Sustentação de sistemas legados", desc: "Atividade contínua, não vinculada a entrega.", pct: "30%" },
                { t: 1, ttl: "Documentação técnica de APIs", desc: "Entrega «Catálogo de APIs internas».", pct: "20%" },
              ].map((c, i) => (
                <div className="contrib" key={i}>
                  <span className={`contrib-tipo t${c.t}`}>{c.t}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 14.5 }}>{c.ttl}</div>
                    <div className="contrib-meta">{c.desc}</div>
                  </div>
                  <div className="contrib-pct">{c.pct}</div>
                </div>
              ))}
            </section>

            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Histórico de períodos avaliativos</h2>
                  <p>3 registros · 2 avaliados · 1 aguardando avaliação</p>
                </div>
                <span className="bdg bdg-warning"><span className="dot" />Avaliação pendente</span>
              </div>
              <table className="tbl">
                <thead><tr>
                  <th>Período</th><th>Registrado em</th><th>Descrição</th><th>Avaliação</th><th></th>
                </tr></thead>
                <tbody>
                  <tr style={{ background: "var(--c-warning-soft)" }}>
                    <td><strong>Abr 2026</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01–30 abr</div></td>
                    <td>05 mai</td>
                    <td style={{ maxWidth: 280, fontSize: 12.5, color: "var(--c-ink-2)" }}>"Concluí a atualização visual do portal..."</td>
                    <td><UrgencyPill daysLeft={2} label="2 dias p/ avaliar" /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-primary btn-sm">Avaliar agora</button></td>
                  </tr>
                  <tr>
                    <td><strong>Mar 2026</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01–31 mar</div></td>
                    <td>04 abr</td>
                    <td style={{ maxWidth: 280, fontSize: 12.5, color: "var(--c-ink-2)" }}>"Trabalhei na release v2.4 do portal..."</td>
                    <td><NotaBadge nota={2} /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Ver detalhe</button></td>
                  </tr>
                  <tr>
                    <td><strong>Fev 2026</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01–28 fev</div></td>
                    <td>06 mar</td>
                    <td style={{ maxWidth: 280, fontSize: 12.5, color: "var(--c-ink-2)" }}>"Implementação dos primeiros..."</td>
                    <td><NotaBadge nota={3} /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Ver detalhe</button></td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Linha do tempo</h2></div>
              <StatusTimeline items={[
                { label: "Plano elaborado", date: "18 jan 2026", note: "Por você (chefia)" },
                { label: "Aprovado", date: "25 jan 2026" },
                { label: "Em execução", date: "Desde 01 fev · há 103 dias", current: true, note: "Lucas tem registrado pontualmente." },
                { label: "Conclusão prevista", date: "31 jul 2026", future: true },
              ]} />
            </section>

            <section className="card">
              <div className="card-hd">
                <h2 style={{ fontSize: 17 }}>Critérios de avaliação</h2>
                <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", margin: "8px 0 0", lineHeight: 1.7 }}>
                <li>Pontualidade nas releases</li>
                <li>Cobertura de testes ≥ 80%</li>
                <li>Documentação atualizada a cada entrega</li>
              </ul>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="info" size={13} /> TCR vigente</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 13 }}>Assinado em 28 jan 2026</span>
                <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600 }}>Ver TCR →</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Avaliar Registro de Execução ───────────────────────────────────────
const ScreenAvaliar = ({ density, notaStyle }) => {
  const [nota, setNota] = React.useState(2);
  const requerJustif = nota === 1 || nota === 4 || nota === 5;
  const SERV = { nome: "Renata Santos", siape: "1734829" };

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Avaliar Registro · Chefia">
      <TopNav role="chefia" active="avaliacoes" alerts={6} user={CHEFE} />
      <div className="pg" style={{ maxWidth: 1180 }}>
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Equipe</a><span className="sep">/</span>
          <a href="#">{SERV.nome}</a><span className="sep">/</span>
          <span>Avaliar registro · abril/2026</span>
        </div>

        <div className="pg-head">
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <span className="av av-lg" style={{ background: avatarColor(SERV.nome), color: "white" }}>{initialsOf(SERV.nome)}</span>
            <div>
              <div className="pg-eyebrow">Avaliação · período abril/2026</div>
              <h1 className="pg-title" style={{ fontSize: 28 }}>Avaliar registro de {SERV.nome.split(" ")[0]}</h1>
              <p className="pg-sub" style={{ marginTop: 4 }}>SIAPE {SERV.siape} · registro submetido em 05 mai 2026</p>
            </div>
          </div>
          <UrgencyPill daysLeft={1} label="1 dia para avaliar" />
        </div>

        <div className="g-2-1">
          {/* Esquerda: contexto do servidor (read-only) */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Descrição submetida pelo servidor</h2>
                  <p>Registro de 05 mai · referente a 01–30 abr 2026</p>
                </div>
                <span className="kicker"><Icon name="eye" size={13} /> Somente leitura</span>
              </div>
              <div style={{ fontSize: 14, color: "var(--c-ink-2)", lineHeight: 1.7, padding: "16px 18px", background: "var(--c-surface-2)", borderRadius: "var(--r-md)", whiteSpace: "pre-line" }}>
{`• Concluí o deploy da v3.1 do portal interno em 18/abr, dentro do prazo previsto.
  Cobertura de testes ficou em 84% (acima da meta de 80%).

• Atendi 23 chamados de sustentação em sistemas legados, sendo 4 incidentes
  classificados como críticos (todos resolvidos em ≤ 4h).

• Documentei 6 endpoints novos da API de cadastro no catálogo de APIs internas.

• Participei da reunião de planejamento da v3.2 (22/abr) e da retrospectiva
  do quadrimestre (29/abr).`}
              </div>

              <div className="divider" />

              <div className="kicker">Contribuições vinculadas pelo servidor</div>
              <div className="stack-12" style={{ marginTop: 12 }}>
                {[
                  { t: 1, ttl: "Atualização do portal de serviços", pct: "50%" },
                  { t: 2, ttl: "Sustentação de sistemas legados", pct: "30%" },
                  { t: 1, ttl: "Documentação técnica de APIs", pct: "20%" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--c-surface-2)", borderRadius: "var(--r-sm)" }}>
                    <span className={`contrib-tipo t${c.t}`} style={{ width: 24, height: 24, fontSize: 11 }}>{c.t}</span>
                    <div style={{ flex: 1, fontSize: 13 }}>{c.ttl}</div>
                    <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13 }}>{c.pct}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div className="kicker">Ocorrências relatadas</div>
              <p style={{ fontSize: 13, color: "var(--c-muted)", margin: "8px 0 0" }}>Nenhuma ocorrência registrada no período.</p>
            </section>
          </div>

          {/* Direita: formulário de avaliação */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card" style={{ borderTop: "3px solid var(--c-primary)" }}>
              <div className="card-hd">
                <div>
                  <h2 style={{ fontSize: 18 }}>Sua avaliação</h2>
                  <p>Escolha a nota e justifique se necessário.</p>
                </div>
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <label>Nota</label>
                <NotaSelector value={nota} onChange={setNota} style={notaStyle} />
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <label>
                  Justificativa {requerJustif
                    ? <span style={{ color: "var(--c-danger)", fontWeight: 700, marginLeft: 6 }}>obrigatória</span>
                    : <span style={{ color: "var(--c-muted)", fontWeight: 500, marginLeft: 6 }}>(opcional)</span>}
                </label>
                <textarea
                  className="textarea"
                  placeholder={requerJustif ? "Descreva os fatos que justificam esta nota..." : "Comentários adicionais (opcional)..."}
                  defaultValue={nota === 2 ? "Entregas dentro do prazo e cobertura de testes acima da meta. Documentação consistente." : ""}
                  style={{ minHeight: 120 }}
                />
                {requerJustif && (
                  <div style={{ fontSize: 12, color: "var(--c-danger)", display: "flex", gap: 6, alignItems: "center" }}>
                    <Icon name="alert" size={13} />
                    Notas 1, 4 e 5 exigem justificativa pela IN 24/2023.
                  </div>
                )}
              </div>

              <div className="field" style={{ marginBottom: 18 }}>
                <label>Data da avaliação</label>
                <input className="input" defaultValue="15/05/2026" style={{ maxWidth: 180 }} />
              </div>

              <div className="divider" />
              <div style={{ background: "var(--c-warning-soft)", padding: "12px 14px", borderRadius: "var(--r-sm)", fontSize: 12.5, color: "var(--c-ink-2)", marginBottom: 18 }}>
                <strong style={{ color: "var(--c-warning)" }}>Atenção:</strong> após confirmar, a avaliação não pode ser editada.
                O servidor terá 10 dias para apresentar recurso se a nota for 4 ou 5.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost">Salvar rascunho</button>
                <button className="btn btn-primary"><Icon name="check" size={16} stroke={2.4} /> Confirmar avaliação</button>
              </div>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="history" size={13} /> Avaliações anteriores</div>
              <div className="stack-12" style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>Mar 2026</span><NotaBadge nota={2} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>Fev 2026</span><NotaBadge nota={3} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  ScreenDashboardChefia, ScreenListaEquipe, ScreenDetalhePlano, ScreenAvaliar,
  initialsOf, avatarColor, EQUIPE,
});
