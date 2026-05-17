// screens-gestor.jsx — Trio do Gestor (Beatriz, diretora de área)
// Dashboard Gestor, Relatórios, Lista de Participantes (compartilhada com Chefia/Admin)

const GESTOR = { name: "Beatriz Moreira", role: "Gestora · Diretoria de TI", initials: "BM" };

// ── Dashboard do Gestor ────────────────────────────────────────────────
const ScreenDashboardGestor = ({ density }) => {
  const unidades = [
    { sigla: "CGTIC",  nome: "Coord.-Geral de TI",        chefe: "Carlos Mendes",   total: 12, exec: 10, atrasados: 1, conform: 92 },
    { sigla: "CGRH",   nome: "Coord.-Geral de RH",         chefe: "Mariana Andrade", total:  9, exec:  9, atrasados: 0, conform: 100 },
    { sigla: "CGOF",   nome: "Coord.-Geral de Orçamento",  chefe: "Tiago Vasconcelos", total: 14, exec: 13, atrasados: 2, conform: 86 },
    { sigla: "CGLOG",  nome: "Coord.-Geral de Logística",  chefe: "Helena Borges",   total:  8, exec:  6, atrasados: 0, conform: 95 },
  ];

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Dashboard · Gestor">
      <TopNav role="gestor" active="home" alerts={2} user={GESTOR} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Diretoria de TI · 4 unidades · 43 servidores</div>
            <h1 className="pg-title">Visão consolidada da Diretoria</h1>
            <p className="pg-sub">Acompanhe conformidade, ritmo de avaliações e alertas das unidades sob sua gestão.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select className="select" style={{ width: 200 }}><option>Maio · 2026</option><option>Abril · 2026</option><option>Q1 2026</option></select>
            <button className="btn btn-ghost"><Icon name="download" size={15} /> Exportar visão</button>
          </div>
        </div>

        {/* Strip de KPIs consolidados */}
        <div className="g-4" style={{ marginBottom: "var(--gap-sec)" }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Conformidade da Diretoria</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <span className="kpi-num" style={{ color: "var(--c-success)" }}>93%</span>
              <span className="urg urg-ok" style={{ fontSize: 11 }}>+2 pts</span>
            </div>
            <Spark data={[86, 88, 89, 91, 92, 91, 93]} color="var(--c-success)" w={140} h={32} />
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Planos em execução</div>
            <div className="kpi-num" style={{ marginTop: 4 }}>38</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>de 43 servidores</div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Avaliações pendentes</div>
            <div className="kpi-num" style={{ color: "var(--c-warning)", marginTop: 4 }}>11</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>4 vencem em ≤ 3 dias</div>
          </div>
          <div className="card" style={{ padding: 20, borderColor: "var(--c-danger)33" }}>
            <div className="kpi-label" style={{ color: "var(--c-danger)" }}>Registros em atraso</div>
            <div className="kpi-num" style={{ color: "var(--c-danger)", marginTop: 4 }}>3</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>em 2 unidades</div>
          </div>
        </div>

        <div className="g-2-1">
          {/* Tabela por unidade */}
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Conformidade por unidade</h2>
                <p>Visão por subárea da Diretoria de TI · maio/2026</p>
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> CSV</button>
            </div>
            <table className="tbl">
              <thead><tr>
                <th>Unidade</th><th>Chefia</th><th>Servidores</th><th>Em execução</th><th>Em atraso</th><th>Conformidade</th><th></th>
              </tr></thead>
              <tbody>
                {unidades.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{
                          width: 32, height: 32, borderRadius: "var(--r-sm)",
                          background: "var(--c-primary-soft)", color: "var(--c-primary)",
                          fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 11,
                          display: "inline-flex", alignItems: "center", justifyContent: "center"
                        }}>{u.sigla}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.nome}</div>
                          <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>{u.sigla}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{u.chefe}</td>
                    <td><strong style={{ fontFamily: "var(--ff-display)" }}>{u.total}</strong></td>
                    <td><strong style={{ fontFamily: "var(--ff-display)", color: "var(--c-success)" }}>{u.exec}</strong></td>
                    <td>
                      {u.atrasados > 0
                        ? <span style={{ color: "var(--c-danger)", fontFamily: "var(--ff-display)", fontWeight: 700 }}>{u.atrasados}</span>
                        : <span style={{ color: "var(--c-muted-2)" }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 130 }}>
                        <div className="bar thin" style={{ flex: 1 }}>
                          <i style={{ width: `${u.conform}%`, background: u.conform >= 95 ? "var(--c-success)" : u.conform >= 90 ? "var(--c-primary)" : "var(--c-warning)" }} />
                        </div>
                        <strong style={{ fontFamily: "var(--ff-display)", fontSize: 13, minWidth: 38, textAlign: "right" }}>{u.conform}%</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Detalhes</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Lado */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Alertas da diretoria</h2></div>
              <div className="stack-12">
                {[
                  { ic: "warn", ttl: "3 registros em atraso", sub: "CGTIC (1) · CGOF (2)" },
                  { ic: "info", ttl: "4 avaliações vencem em 3 dias", sub: "CGOF (3) · CGTIC (1)" },
                  { ic: "warn", ttl: "2 servidores sem plano ativo", sub: "CGTIC · CGLOG" },
                  { ic: "ok",   ttl: "Conformidade subiu para 93%", sub: "+2 pts vs. abril" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--c-divider)" : "0" }}>
                    <div className={`nf-icon ${a.ic}`} style={{ width: 32, height: 32 }}>
                      <Icon name={a.ic === "ok" ? "check" : a.ic === "warn" ? "alert" : "info"} size={15} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.ttl}</div>
                      <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Distribuição de notas</h2></div>
              <p style={{ fontSize: 12.5, color: "var(--c-muted)", margin: "-6px 0 14px" }}>Últimas 30 avaliações da diretoria</p>
              {[
                { n: 1, q: 4,  c: "var(--c-nota-1)", lbl: "Excepcional" },
                { n: 2, q: 12, c: "var(--c-nota-2)", lbl: "Alto desempenho" },
                { n: 3, q: 10, c: "var(--c-nota-3)", lbl: "Adequado" },
                { n: 4, q: 3,  c: "var(--c-nota-4)", lbl: "Inadequado" },
                { n: 5, q: 1,  c: "var(--c-nota-5)", lbl: "Não executado" },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 6, background: d.c, color: "white",
                    fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 12,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flex: "none"
                  }}>{d.n}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "var(--c-ink-2)" }}>{d.lbl}</div>
                    <div className="bar thin" style={{ marginTop: 4, background: "var(--c-bg-deep)" }}>
                      <i style={{ width: `${d.q / 30 * 100}%`, background: d.c }} />
                    </div>
                  </div>
                  <strong style={{ fontFamily: "var(--ff-display)", fontSize: 14, minWidth: 22, textAlign: "right" }}>{d.q}</strong>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Relatórios ─────────────────────────────────────────────────────────
const ScreenRelatorios = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Relatórios · Gestor">
      <TopNav role="gestor" active="relatorios" alerts={2} user={GESTOR} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Diretoria de TI</div>
            <h1 className="pg-title">Relatórios</h1>
            <p className="pg-sub">Visões agregadas para acompanhamento legal e gerencial. Exporte como CSV ou PDF.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost"><Icon name="settings" size={15} /> Relatório personalizado</button>
            <button className="btn btn-primary"><Icon name="plus" size={15} /> Agendar envio</button>
          </div>
        </div>

        {/* Cards de relatórios disponíveis */}
        <div className="g-3" style={{ marginBottom: "var(--gap-sec)" }}>
          {[
            { ic: "alert",   c: "var(--c-warning)", ttl: "Servidores sem Plano de Trabalho",   q: 5,  sub: "Servidores ativos sem plano em vigência" },
            { ic: "clock",   c: "var(--c-danger)",  ttl: "Registros em atraso",                 q: 3,  sub: "Registros de execução não submetidos no prazo" },
            { ic: "check",   c: "var(--c-warning)", ttl: "Avaliações pendentes",                q: 11, sub: "Registros aguardando avaliação da chefia" },
            { ic: "file",    c: "var(--c-primary)", ttl: "Planos sem entregas vinculadas",      q: 2,  sub: "Planos com 100% em contribuições tipo 2" },
            { ic: "chart",   c: "var(--c-status-aval)", ttl: "Distribuição de notas",            q: 30, sub: "Últimos 30 dias · todas as unidades" },
            { ic: "flag",    c: "var(--c-success)", ttl: "Recursos em andamento",                q: 1,  sub: "Avaliações contestadas aguardando resposta" },
          ].map((r, i) => (
            <div key={i} className="card" style={{ cursor: "pointer", transition: "transform .1s" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--r-md)",
                  background: `${r.c}1A`, color: r.c,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none"
                }}>
                  <Icon name={r.ic} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink)" }}>{r.ttl}</div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2, lineHeight: 1.45 }}>{r.sub}</div>
                </div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 28, color: r.c, letterSpacing: "-0.02em", lineHeight: 1 }}>{r.q}</div>
              </div>
              <div className="divider" style={{ margin: "14px 0 12px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "var(--c-muted)" }}>Atualizado há 14 min</span>
                <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Abrir <Icon name="arrowR" size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Relatório aberto · exemplo "Servidores sem Plano" */}
        <section className="card">
          <div className="card-hd">
            <div>
              <h2>Servidores sem Plano de Trabalho</h2>
              <p>5 servidores ativos no PGD sem plano em vigência · referência 15/05/2026</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> CSV</button>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> PDF</button>
              <button className="btn btn-soft btn-sm"><Icon name="paperPlane" size={13} /> Enviar por e-mail</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
            <div className="input-prefix" style={{ flex: 1, maxWidth: 320 }}>
              <span className="pf"><Icon name="search" size={14} /></span>
              <input className="input" placeholder="Buscar por nome ou SIAPE…" />
            </div>
            <select className="select" style={{ width: 200 }}><option>Todas as unidades</option></select>
            <select className="select" style={{ width: 180 }}><option>Todos os motivos</option></select>
          </div>

          <table className="tbl">
            <thead><tr>
              <th>Servidor</th><th>SIAPE</th><th>Unidade</th><th>Chefia</th><th>TCR</th><th>Motivo</th><th>Há</th><th></th>
            </tr></thead>
            <tbody>
              {[
                { nome: "Felipe Ribeiro",  siape: "1947382", und: "CGTIC", chefe: "Carlos Mendes",     tcr: true,  motivo: "Aguardando criação do plano",     dias: 12 },
                { nome: "Mariana Castro",  siape: "1748202", und: "CGTIC", chefe: "Carlos Mendes",     tcr: false, motivo: "TCR vencido — necessária renovação", dias: 28 },
                { nome: "André Pinheiro",  siape: "1839204", und: "CGTIC", chefe: "Carlos Mendes",     tcr: true,  motivo: "Afastamento médico até 22/05",     dias: 35 },
                { nome: "Roberta Nunes",   siape: "2018472", und: "CGOF",  chefe: "Tiago Vasconcelos", tcr: true,  motivo: "Plano anterior concluído",         dias: 4  },
                { nome: "Eduardo Vilela",  siape: "1937402", und: "CGOF",  chefe: "Tiago Vasconcelos", tcr: false, motivo: "TCR pendente de assinatura",       dias: 18 },
              ].map((s, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="av av-sm" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
                      <strong>{s.nome}</strong>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{s.siape}</td>
                  <td>{s.und}</td>
                  <td style={{ fontSize: 13 }}>{s.chefe}</td>
                  <td>
                    {s.tcr
                      ? <span className="bdg bdg-success"><Icon name="check" size={11} stroke={2.5} /> Vigente</span>
                      : <span className="bdg bdg-danger"><span className="dot" />Vencido</span>}
                  </td>
                  <td style={{ fontSize: 13 }}>{s.motivo}</td>
                  <td>
                    {s.dias > 30
                      ? <span style={{ color: "var(--c-danger)", fontWeight: 700 }}>{s.dias}d</span>
                      : s.dias > 14
                        ? <span style={{ color: "var(--c-warning)", fontWeight: 700 }}>{s.dias}d</span>
                        : <span style={{ color: "var(--c-muted)" }}>{s.dias}d</span>}
                  </td>
                  <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Ver perfil</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

// ── Lista de Participantes (Chefia/Admin/Gestor) ───────────────────────
const ScreenListaParticipantes = ({ density }) => {
  // Mistura ativos + desligados + de várias unidades para mostrar a diferença
  // em relação à "Lista da Equipe".
  const PARTS = [
    { nome: "Nitai Bezerra",  siape: "1928374", und: "CGTIC", cargo: "Analista de TI",  ativo: true,  mod: 3, tcr: "Vigente", plano: "execucao", since: "01/02/2026" },
    { nome: "Lucas Pereira",      siape: "2840193", und: "CGTIC", cargo: "Analista de TI",  ativo: true,  mod: 2, tcr: "Vigente", plano: "execucao", since: "01/02/2026" },
    { nome: "Mariana Andrade",    siape: "1740285", und: "CGRH",  cargo: "Chefe CGRH",      ativo: true,  mod: 1, tcr: "Vigente", plano: "execucao", since: "10/01/2026" },
    { nome: "Felipe Ribeiro",     siape: "1947382", und: "CGTIC", cargo: "Analista de TI",  ativo: true,  mod: 3, tcr: "Vigente", plano: "aprovado", since: "—" },
    { nome: "Mariana Castro",     siape: "1748202", und: "CGTIC", cargo: "Téc. de TI",      ativo: true,  mod: 2, tcr: "Vencido", plano: "rascunho", since: "—" },
    { nome: "Bruno Tavares",      siape: "1892374", und: "CGTIC", cargo: "Analista de TI",  ativo: true,  mod: 2, tcr: "Vigente", plano: "rascunho", since: "—" },
    { nome: "Helena Borges",      siape: "1648392", und: "CGLOG", cargo: "Chefe CGLOG",     ativo: true,  mod: 2, tcr: "Vigente", plano: "execucao", since: "15/01/2026" },
    { nome: "Tiago Vasconcelos",  siape: "1729483", und: "CGOF",  cargo: "Chefe CGOF",      ativo: true,  mod: 1, tcr: "Vigente", plano: "execucao", since: "08/01/2026" },
    { nome: "Roberta Nunes",      siape: "2018472", und: "CGOF",  cargo: "Analista Orçam.", ativo: true,  mod: 3, tcr: "Vigente", plano: "rascunho", since: "—" },
    { nome: "Camila Souza",       siape: "1857361", und: "CGTIC", cargo: "Analista de TI",  ativo: true,  mod: 3, tcr: "Vigente", plano: "execucao", since: "01/02/2026" },
    { nome: "Pedro Lacerda",      siape: "1834928", und: "CGOF",  cargo: "Téc. Orçamento",  ativo: false, mod: 1, tcr: "—",       plano: "cancelado", since: "Desligado em 12/04/2026" },
    { nome: "Sandra Coutinho",    siape: "1729841", und: "CGRH",  cargo: "Analista RH",     ativo: false, mod: 2, tcr: "—",       plano: "cancelado", since: "Desligada em 28/03/2026" },
  ];

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Lista de Participantes · Admin">
      <TopNav role="admin" active="participantes" alerts={4} user={{ name: "Pedro Almeida", role: "Administrador · TI/RH", initials: "PA" }} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Participantes do PGD · órgão</div>
            <h1 className="pg-title">Lista de Participantes</h1>
            <p className="pg-sub">348 cadastrados · 342 ativos · 6 desligados nos últimos 12 meses</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost"><Icon name="download" size={15} /> Exportar CSV</button>
            <button className="btn btn-primary"><Icon name="plus" size={15} /> Cadastrar participante</button>
          </div>
        </div>

        {/* Filtros */}
        <div className="card" style={{ padding: 14, marginBottom: "var(--gap-sec)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="input-prefix" style={{ flex: 1, maxWidth: 320, minWidth: 220 }}>
            <span className="pf"><Icon name="search" size={14} /></span>
            <input className="input" placeholder="Buscar por nome, SIAPE ou unidade…" />
          </div>
          <select className="select" style={{ width: 170 }}><option>Todas as situações</option><option>Ativos no PGD</option><option>Desligados</option></select>
          <select className="select" style={{ width: 170 }}><option>Todas as unidades</option><option>CGTIC</option><option>CGRH</option><option>CGOF</option><option>CGLOG</option></select>
          <select className="select" style={{ width: 180 }}><option>Todas as modalidades</option></select>
          <select className="select" style={{ width: 150 }}><option>TCR · todos</option><option>Vigente</option><option>Vencido</option></select>
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--c-muted)" }}>{PARTS.length} mostrados</span>
        </div>

        <section className="card" style={{ padding: 0 }}>
          <table className="tbl">
            <thead><tr>
              <th>Servidor</th>
              <th>SIAPE</th>
              <th>Unidade</th>
              <th>Cargo</th>
              <th>Situação</th>
              <th>Modalidade</th>
              <th>TCR</th>
              <th>Plano atual</th>
              <th></th>
            </tr></thead>
            <tbody>
              {PARTS.map((p, i) => (
                <tr key={i} style={!p.ativo ? { opacity: 0.65 } : null}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="av av-sm" style={{ background: p.ativo ? avatarColor(p.nome) : "var(--c-muted-2)", color: "white" }}>{initialsOf(p.nome)}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--c-ink)" }}>{p.nome}</div>
                        <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>{p.since}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{p.siape}</td>
                  <td>{p.und}</td>
                  <td style={{ fontSize: 13 }}>{p.cargo}</td>
                  <td>
                    {p.ativo
                      ? <span className="bdg bdg-success"><span className="dot" />Ativo</span>
                      : <span className="bdg bdg-neutral"><span className="dot" />Desligado</span>}
                  </td>
                  <td><ModalidadeBadge codigo={p.mod} /></td>
                  <td>
                    {p.tcr === "Vigente" && <span className="bdg bdg-success" style={{ fontSize: 11 }}>Vigente</span>}
                    {p.tcr === "Vencido" && <span className="bdg bdg-danger" style={{ fontSize: 11 }}>Vencido</span>}
                    {p.tcr === "—" && <span style={{ color: "var(--c-muted-2)" }}>—</span>}
                  </td>
                  <td><StatusBadge status={p.plano} /></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost btn-sm">Ver perfil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderTop: "1px solid var(--c-border)", fontSize: 12.5, color: "var(--c-muted)" }}>
            <span>Mostrando 12 de 348 · página 1 de 29</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-ghost btn-sm" disabled style={{ opacity: .4 }}>← Anterior</button>
              <button className="btn btn-ghost btn-sm">Próxima →</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

Object.assign(window, { ScreenDashboardGestor, ScreenRelatorios, ScreenListaParticipantes });
