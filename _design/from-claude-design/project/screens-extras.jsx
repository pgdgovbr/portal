// screens-extras.jsx — Telas P1/P2 que faltavam
// - Plano de Entregas (Tela 8) — criar/editar pela chefia
// - Gestão Institucional (Tela 13) — admin
// - Perfil do Participante (Tela 15) — visão completa do servidor

// ── Tela 8: Plano de Entregas (Chefia) ─────────────────────────────────
const ScreenPlanoEntregas = ({ density }) => {
  const entregas = [
    { id: "E-21", ttl: "Renovação do portal de serviços da CGTIC",          resp: "Lucas Pereira",       prazo: "30 jun", status: "execucao", prog: 65, contrib: 3 },
    { id: "E-22", ttl: "Migração da base SIAPE para PostgreSQL 16",         resp: "Ana Beatriz Costa",   prazo: "15 jul", status: "execucao", prog: 78, contrib: 2 },
    { id: "E-23", ttl: "Adesão obrigatória ao Gov.br ID",                   resp: "Ana Beatriz Costa",   prazo: "31 jul", status: "aprovado", prog: 30, contrib: 4 },
    { id: "E-24", ttl: "Catálogo de APIs internas",                          resp: "Renata Santos",       prazo: "30 set", status: "aprovado", prog: 12, contrib: 2 },
    { id: "E-25", ttl: "Unificação de identidades · apoio à CGRH",          resp: "Felipe Ribeiro",      prazo: "31 ago", status: "aprovado", prog: 0,  contrib: 2 },
    { id: "E-26", ttl: "Dashboards de observabilidade",                      resp: "Juliana Almeida",     prazo: "30 nov", status: "rascunho", prog: 0,  contrib: 0 },
    { id: "E-27", ttl: "Atualização do sistema de protocolos",               resp: "Marcos Oliveira",     prazo: "15 dez", status: "rascunho", prog: 0,  contrib: 0 },
  ];

  const totalContrib = entregas.reduce((a, e) => a + e.contrib, 0);
  const concluidas = 0; // mock
  const emRisco = 1;

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Plano de Entregas · Chefia">
      <TopNav role="chefia" active="planos" alerts={6} user={{ name: "Carlos Mendes", role: "Chefia · CGTIC", initials: "CM" }} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Planos</a><span className="sep">/</span>
          <span>Modernização do parque tecnológico 2026</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Plano de Entregas · CGTIC · 2026/1</div>
            <h1 className="pg-title">Modernização do parque tecnológico</h1>
            <p className="pg-sub">7 entregas planejadas · 5 em execução · vincula 14 contribuições de 11 servidores.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost"><Icon name="download" size={15} /> Exportar</button>
            <button className="btn btn-ghost"><Icon name="edit" size={15} /> Editar metadados</button>
            <button className="btn btn-primary"><Icon name="plus" size={15} /> Nova entrega</button>
          </div>
        </div>

        {/* Header status strip */}
        <section className="card" style={{ padding: 22, marginBottom: "var(--gap-sec)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr) 2fr", gap: 24, alignItems: "center" }}>
            <div>
              <div className="kpi-label">Status</div>
              <div style={{ marginTop: 6 }}><StatusBadge status="execucao" /></div>
            </div>
            <div>
              <div className="kpi-label">Período</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 15, marginTop: 6 }}>01 fev → 31 dez</div>
            </div>
            <div>
              <div className="kpi-label">Entregas</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22, marginTop: 4 }}>{entregas.length}</div>
            </div>
            <div>
              <div className="kpi-label">Concluídas</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22, marginTop: 4, color: "var(--c-success)" }}>{concluidas}</div>
            </div>
            <div>
              <div className="kpi-label">Em risco</div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22, marginTop: 4, color: "var(--c-warning)" }}>{emRisco}</div>
            </div>
            <div>
              <div className="kpi-label" style={{ marginBottom: 8 }}>Progresso global</div>
              <div className="bar"><i style={{ width: "47%" }} /></div>
              <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span>01 fev</span><span><strong style={{ color: "var(--c-ink)", fontFamily: "var(--ff-display)" }}>47%</strong></span><span>31 dez</span>
              </div>
            </div>
          </div>
        </section>

        <div className="g-2-1">
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Entregas do plano</h2>
                <p>Arraste para reordenar prioridade. Clique em "+" para adicionar.</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <select className="select" style={{ width: 160 }}><option>Todos os status</option></select>
                <select className="select" style={{ width: 180 }}><option>Todos responsáveis</option></select>
              </div>
            </div>

            <div className="stack-12">
              {entregas.map((e, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  padding: 16, border: "1px solid var(--c-border)", borderRadius: "var(--r-md)",
                  background: e.status === "rascunho" ? "var(--c-surface-2)" : "white"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2, color: "var(--c-muted-2)" }}>
                    <Icon name="dots" size={14} /><Icon name="dots" size={14} />
                  </div>
                  <div style={{
                    fontFamily: "var(--ff-mono)", fontSize: 11, fontWeight: 700,
                    color: "var(--c-muted)", padding: "4px 8px",
                    background: "var(--c-surface-2)", borderRadius: 4,
                    flex: "none", marginTop: 1
                  }}>{e.id}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 14.5, color: "var(--c-ink)" }}>{e.ttl}</strong>
                      <StatusBadge status={e.status} />
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--c-muted)", marginTop: 6, flexWrap: "wrap" }}>
                      <span><Icon name="users" size={12} className="" /> {e.resp}</span>
                      <span><Icon name="calendar" size={12} className="" /> Prazo {e.prazo}</span>
                      <span><Icon name="file" size={12} className="" /> {e.contrib} contribuição{e.contrib === 1 ? "" : "ões"} vinculada{e.contrib === 1 ? "" : "s"}</span>
                    </div>
                    {e.prog > 0 && (
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                        <div className="bar thin" style={{ flex: 1, maxWidth: 220 }}>
                          <i style={{ width: `${e.prog}%`, background: e.prog >= 70 ? "var(--c-success)" : e.prog >= 30 ? "var(--c-primary)" : "var(--c-warning)" }} />
                        </div>
                        <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13 }}>{e.prog}%</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="edit" size={14} /></button>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="dots" size={14} /></button>
                  </div>
                </div>
              ))}
              <button style={{
                padding: 16,
                border: "1.5px dashed var(--c-border-strong)",
                borderRadius: "var(--r-md)",
                background: "transparent", color: "var(--c-muted)",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8,
                fontSize: 13.5, fontWeight: 600,
              }}>
                <Icon name="plus" size={16} /> Adicionar entrega
              </button>
            </div>
          </section>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Vínculos · servidores</h2></div>
              <p style={{ fontSize: 12.5, color: "var(--c-muted)", margin: "-6px 0 12px" }}>{totalContrib} contribuições de 11 servidores vinculam a este plano.</p>
              <div className="stack-12">
                {[
                  { n: "Ana Beatriz Costa", q: 2 },
                  { n: "Lucas Pereira",     q: 2 },
                  { n: "Renata Santos",     q: 2 },
                  { n: "Juliana Almeida",   q: 1 },
                  { n: "Felipe Ribeiro",    q: 1 },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="av av-sm" style={{ background: avatarColor(s.n), color: "white" }}>{initialsOf(s.n)}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{s.n}</span>
                    <span style={{ fontSize: 12, color: "var(--c-muted)" }}>{s.q} entrega{s.q === 1 ? "" : "s"}</span>
                  </div>
                ))}
                <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Ver todos (11) <Icon name="arrowR" size={12} />
                </a>
              </div>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Marcos do período</h2></div>
              <StatusTimeline items={[
                { label: "Plano elaborado", date: "15 jan 2026" },
                { label: "Aprovado pela Diretoria", date: "28 jan 2026" },
                { label: "Em execução", date: "Desde 01 fev · há 103 dias", current: true, note: "5 entregas em andamento, 2 ainda em rascunho." },
                { label: "Revisão semestral", date: "30 jul 2026", future: true },
                { label: "Conclusão prevista", date: "31 dez 2026", future: true },
              ]} />
            </section>

            <section className="card" style={{ background: "var(--c-warning-soft)", borderLeft: "3px solid var(--c-warning)" }}>
              <div className="kicker" style={{ color: "var(--c-warning)" }}><Icon name="alert" size={13} /> Atenção</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                A entrega <strong>E-23</strong> (Gov.br ID) está em risco — apenas 30% de progresso a 47 dias do prazo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tela 13: Gestão Institucional ──────────────────────────────────────
const ScreenInstitucional = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Institucional · Admin">
      <TopNav role="admin" active="institucional" alerts={4} user={{ name: "Pedro Almeida", role: "Administrador · TI/RH", initials: "PA" }} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Configuração institucional do PGD</div>
            <h1 className="pg-title">Gestão institucional</h1>
            <p className="pg-sub">Unidades, atos normativos e parâmetros de envio à API PGD Central do MGI.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Última sincronização há 14 min</span>
            <button className="btn btn-ghost"><Icon name="refresh" size={15} /> Sincronizar com SIORG</button>
          </div>
        </div>

        <div className="tabs">
          <span className="tab active">Unidades autorizadoras</span>
          <span className="tab">Unidades instituidoras</span>
          <span className="tab">Atos normativos</span>
          <span className="tab">Parâmetros de envio</span>
        </div>

        {/* Card-resumo do órgão */}
        <section className="card" style={{ padding: 28, marginBottom: "var(--gap-sec)", background: "linear-gradient(135deg, var(--c-primary) 0%, #1351B4 100%)", color: "white", border: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, opacity: .85, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Unidade autorizadora · órgão</div>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>Ministério X · Secretaria Executiva</h2>
              <p style={{ fontSize: 14, opacity: .85, margin: 0 }}>Aprova e supervisiona o programa de gestão e desempenho do órgão.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: .8, textTransform: "uppercase", letterSpacing: ".08em" }}>Código SIORG</div>
              <div style={{ fontFamily: "var(--ff-mono)", fontWeight: 700, fontSize: 20, marginTop: 4 }}>00001-001</div>
              <span className="bdg" style={{ background: "rgba(255,255,255,.18)", color: "white", marginTop: 10, fontSize: 11 }}>
                <Icon name="check" size={11} stroke={2.5} /> Sincronizada à API Central
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 22, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.18)" }}>
            <div><div style={{ fontSize: 11, opacity: .8 }}>Unidades instituidoras</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22 }}>4</div></div>
            <div><div style={{ fontSize: 11, opacity: .8 }}>Participantes ativos</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22 }}>342</div></div>
            <div><div style={{ fontSize: 11, opacity: .8 }}>Planos vigentes</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22 }}>310</div></div>
            <div><div style={{ fontSize: 11, opacity: .8 }}>Atos normativos</div><div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22 }}>3</div></div>
          </div>
        </section>

        {/* Tabela Unidades */}
        <section className="card" style={{ marginBottom: "var(--gap-sec)" }}>
          <div className="card-hd">
            <div>
              <h2>Unidades instituidoras</h2>
              <p>Subunidades autorizadas a participar do PGD dentro do órgão.</p>
            </div>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={14} /> Nova unidade</button>
          </div>

          <table className="tbl">
            <thead><tr>
              <th>Sigla</th>
              <th>Nome</th>
              <th>Código SIORG</th>
              <th>Chefia</th>
              <th>Participantes</th>
              <th>Modalidades autorizadas</th>
              <th>API Central</th>
              <th></th>
            </tr></thead>
            <tbody>
              {[
                { sig: "CGTIC", n: "Coordenação-Geral de TI e Comunicações", siorg: "00001-101", chefe: "Carlos Mendes",      parts: 14, mods: [1,2,3], sync: "ok" },
                { sig: "CGRH",  n: "Coordenação-Geral de Recursos Humanos",  siorg: "00001-102", chefe: "Mariana Andrade",    parts: 12, mods: [1,2],    sync: "ok" },
                { sig: "CGOF",  n: "Coordenação-Geral de Orçamento e Finanças", siorg: "00001-103", chefe: "Tiago Vasconcelos", parts: 16, mods: [1,2,3], sync: "warn" },
                { sig: "CGLOG", n: "Coordenação-Geral de Logística",         siorg: "00001-104", chefe: "Helena Borges",      parts:  8, mods: [1,2],    sync: "ok" },
              ].map((u, i) => (
                <tr key={i}>
                  <td>
                    <div style={{
                      width: 36, height: 36, borderRadius: "var(--r-sm)",
                      background: "var(--c-primary-soft)", color: "var(--c-primary)",
                      fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 11,
                      display: "inline-flex", alignItems: "center", justifyContent: "center"
                    }}>{u.sig}</div>
                  </td>
                  <td><strong style={{ fontSize: 13.5 }}>{u.n}</strong></td>
                  <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{u.siorg}</td>
                  <td style={{ fontSize: 13 }}>{u.chefe}</td>
                  <td><strong style={{ fontFamily: "var(--ff-display)" }}>{u.parts}</strong></td>
                  <td style={{ display: "flex", gap: 4, padding: "var(--pad-row) 12px", border: 0, flexWrap: "wrap" }}>
                    {u.mods.map(m => <ModalidadeBadge key={m} codigo={m} />)}
                  </td>
                  <td>
                    {u.sync === "ok"
                      ? <span className="bdg bdg-success" style={{ fontSize: 11 }}><Icon name="check" size={11} stroke={2.5} /> Sincronizada</span>
                      : <span className="bdg bdg-warning" style={{ fontSize: 11 }}><span className="dot" />Pendente</span>}
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost btn-sm">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Atos normativos card */}
        <div className="g-2-1">
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Atos normativos vigentes</h2>
                <p>Instrumentos legais que autorizam o PGD no órgão.</p>
              </div>
              <button className="btn btn-soft btn-sm"><Icon name="plus" size={13} /> Anexar ato</button>
            </div>
            <div className="stack-12">
              {[
                { tipo: "Portaria", num: "PRT/MX/2025-128", desc: "Aprova o Programa de Gestão e Desempenho no âmbito do Ministério X", data: "12 dez 2025", vig: true,  doc: "portaria-128-2025.pdf" },
                { tipo: "Instrução Normativa", num: "IN 24/2023", desc: "Regulamento geral do PGD no governo federal (referência)",       data: "28 jul 2023", vig: true,  doc: "in-24-2023.pdf" },
                { tipo: "Portaria", num: "PRT/MX/2024-072", desc: "Revogada — primeira versão do PGD no órgão",                             data: "03 abr 2024", vig: false, doc: "portaria-072-2024.pdf" },
              ].map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, padding: 14,
                  border: "1px solid var(--c-border)", borderRadius: "var(--r-md)",
                  background: a.vig ? "white" : "var(--c-surface-2)",
                  opacity: a.vig ? 1 : 0.7
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--r-md)",
                    background: a.vig ? "var(--c-primary-soft)" : "var(--c-bg-deep)",
                    color: a.vig ? "var(--c-primary)" : "var(--c-muted)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none"
                  }}>
                    <Icon name="file" size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="bdg bdg-neutral" style={{ fontSize: 10.5 }}>{a.tipo}</span>
                      <strong style={{ fontSize: 13.5, fontFamily: "var(--ff-mono)" }}>{a.num}</strong>
                      {a.vig
                        ? <span className="bdg bdg-success" style={{ fontSize: 10.5 }}>Vigente</span>
                        : <span className="bdg bdg-neutral" style={{ fontSize: 10.5 }}>Revogada</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--c-ink-2)", marginTop: 4, lineHeight: 1.45 }}>{a.desc}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 4, fontFamily: "var(--ff-mono)" }}>{a.doc} · publicado em {a.data}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="download" size={14} /></button>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="dots" size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Parâmetros de envio</h2></div>
              <div className="stack-12">
                {[
                  ["URL da API Central", "https://api.pgd.gestao.gov.br"],
                  ["Token de acesso",    "••••••••••••3a2f"],
                  ["Frequência de sync", "A cada 30 minutos"],
                  ["Reenvio em erro",    "Até 5 tentativas"],
                  ["Servidores notificados", "pedro.almeida@orgao.gov.br"],
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: i < 4 ? "1px solid var(--c-divider)" : "0" }}>
                    <span style={{ color: "var(--c-muted)" }}>{r[0]}</span>
                    <strong style={{ fontFamily: r[0].includes("URL") || r[0].includes("Token") ? "var(--ff-mono)" : "inherit", fontSize: 12.5 }}>{r[1]}</strong>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 14, width: "100%" }}><Icon name="settings" size={13} /> Editar parâmetros</button>
            </section>

            <section className="card" style={{ background: "var(--c-info-soft)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Sobre o SIORG</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                O código de cada unidade deve corresponder ao cadastro no Sistema de Informações Organizacionais do Governo Federal (SIORG) para que a API Central aceite os envios.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tela 15: Perfil do Participante ────────────────────────────────────
const ScreenPerfilParticipante = ({ density }) => {
  const SERV = {
    nome: "Ana Beatriz Costa",
    siape: "1928374",
    cpf: "123.456.789-00",
    email: "ana.costa@orgao.gov.br",
    cargo: "Analista em Tecnologia da Informação",
    und: "CGTIC",
    chefe: "Carlos Mendes",
    desde: "Ativa no PGD desde 12 jan 2024",
  };

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Perfil do Participante">
      <TopNav role="chefia" active="equipe" alerts={6} user={{ name: "Carlos Mendes", role: "Chefia · CGTIC", initials: "CM" }} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Equipe</a><span className="sep">/</span>
          <a href="#">Participantes</a><span className="sep">/</span>
          <span>{SERV.nome}</span>
        </div>

        {/* Header com foto e dados */}
        <section className="card" style={{ padding: 28, marginBottom: "var(--gap-sec)" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <span className="av" style={{
              width: 88, height: 88, fontSize: 28, fontWeight: 800,
              background: avatarColor(SERV.nome), color: "white",
              boxShadow: "0 4px 14px rgba(15, 25, 50, .12)"
            }}>{initialsOf(SERV.nome)}</span>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{SERV.nome}</h1>
                  <p style={{ fontSize: 14.5, color: "var(--c-ink-2)", margin: "4px 0 0" }}>{SERV.cargo} · {SERV.und}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm"><Icon name="paperPlane" size={13} /> Mensagem</button>
                  <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> Exportar dados</button>
                  <button className="btn btn-ghost btn-sm"><Icon name="dots" size={13} /></button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <span className="bdg bdg-success"><span className="dot" />Ativa no PGD</span>
                <ModalidadeBadge codigo={3} />
                <span className="bdg bdg-success">TCR vigente</span>
                <span className="bdg bdg-info">Plano 2026/1 em execução</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--c-divider)" }}>
                <div><div className="kpi-label">SIAPE</div><div style={{ fontFamily: "var(--ff-mono)", fontWeight: 700, marginTop: 4 }}>{SERV.siape}</div></div>
                <div><div className="kpi-label">CPF</div><div style={{ fontFamily: "var(--ff-mono)", fontWeight: 700, marginTop: 4 }}>{SERV.cpf}</div></div>
                <div><div className="kpi-label">E-mail</div><div style={{ fontWeight: 600, marginTop: 4, fontSize: 13 }}>{SERV.email}</div></div>
                <div><div className="kpi-label">Chefia</div><div style={{ fontWeight: 600, marginTop: 4, fontSize: 13 }}>{SERV.chefe}</div></div>
              </div>
            </div>
          </div>
        </section>

        <div className="tabs">
          <span className="tab active">Visão geral</span>
          <span className="tab">Planos de Trabalho</span>
          <span className="tab">Avaliações <span style={{ marginLeft: 4, fontSize: 10.5, background: "var(--c-success-soft)", color: "var(--c-success)", padding: "1px 7px", borderRadius: 10 }}>11</span></span>
          <span className="tab">TCR</span>
          <span className="tab">Afastamentos</span>
        </div>

        <div className="g-2-1">
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            {/* Histórico de planos */}
            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Histórico de planos de trabalho</h2>
                  <p>4 planos vinculados desde o ingresso no PGD.</p>
                </div>
              </div>
              <table className="tbl">
                <thead><tr>
                  <th>Período</th><th>Carga</th><th>Status</th><th>Avaliação média</th><th></th>
                </tr></thead>
                <tbody>
                  <tr style={{ background: "var(--c-primary-soft)" }}>
                    <td><strong>2026/1</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01 fev → 31 jul</div></td>
                    <td>30 h/sem</td>
                    <td><StatusBadge status="execucao" /></td>
                    <td><span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><NotaBadge nota={2} /><span style={{ fontSize: 11.5, color: "var(--c-muted)" }}>(2 av.)</span></span></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Abrir</button></td>
                  </tr>
                  <tr>
                    <td><strong>2025/2</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01 ago → 31 jan</div></td>
                    <td>30 h/sem</td>
                    <td><StatusBadge status="avaliado" /></td>
                    <td><NotaBadge nota={2} /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Abrir</button></td>
                  </tr>
                  <tr>
                    <td><strong>2025/1</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01 fev → 31 jul</div></td>
                    <td>30 h/sem</td>
                    <td><StatusBadge status="avaliado" /></td>
                    <td><NotaBadge nota={3} /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Abrir</button></td>
                  </tr>
                  <tr>
                    <td><strong>2024/2</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>01 ago → 31 jan</div></td>
                    <td>40 h/sem</td>
                    <td><StatusBadge status="avaliado" /></td>
                    <td><NotaBadge nota={3} /></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Abrir</button></td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Avaliações recebidas */}
            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Distribuição de avaliações</h2>
                  <p>11 avaliações recebidas · média 2,4 · 1 recurso protocolado</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120, paddingTop: 10 }}>
                {[
                  { p: "ago/24", n: 3 }, { p: "set/24", n: 3 }, { p: "out/24", n: 2 },
                  { p: "nov/24", n: 3 }, { p: "dez/24", n: 2 }, { p: "jan/25", n: 3 },
                  { p: "fev/25", n: 2 }, { p: "mar/25", n: 2 }, { p: "abr/25", n: 2 },
                  { p: "fev/26", n: 3 }, { p: "mar/26", n: 2 },
                ].map((a, i) => {
                  const colors = ["", "var(--c-nota-1)", "var(--c-nota-2)", "var(--c-nota-3)", "var(--c-nota-4)", "var(--c-nota-5)"];
                  const h = (6 - a.n) * 18 + 6;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div style={{ height: h, background: colors[a.n], width: "100%", borderRadius: "var(--r-sm) var(--r-sm) 0 0", position: "relative" }}>
                          <span style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 13, color: colors[a.n] }}>{a.n}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>{a.p}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            {/* TCR */}
            <section className="card">
              <div className="card-hd">
                <h2 style={{ fontSize: 16 }}>Termo de Ciência e Responsabilidade</h2>
                <span className="bdg bdg-success"><span className="dot" />Vigente</span>
              </div>
              <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-md)", padding: 14, border: "1px solid var(--c-border)" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 36, height: 44, background: "white", border: "1px solid var(--c-border)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <Icon name="file" size={18} className="" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>TCR-2026-1928374.pdf</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>Assinado em 28 jan 2026 · válido até 27 jan 2028</div>
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: "100%" }}><Icon name="download" size={13} /> Baixar TCR assinado</button>
            </section>

            {/* Afastamentos */}
            <section className="card">
              <div className="card-hd">
                <h2 style={{ fontSize: 16 }}>Afastamentos registrados</h2>
                <button className="btn btn-ghost btn-sm"><Icon name="plus" size={13} /></button>
              </div>
              <div className="stack-12">
                {[
                  { tipo: "Férias regulamentares",          per: "14 jul – 02 ago 2026", dias: 15, fut: true },
                  { tipo: "Licença saúde",                   per: "18 – 22 set 2025",     dias: 5,  fut: false },
                  { tipo: "Curso (capacitação 40h)",         per: "12 – 16 mai 2025",     dias: 5,  fut: false },
                  { tipo: "Férias regulamentares",          per: "06 – 26 jan 2025",     dias: 15, fut: false },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--c-divider)" : "0" }}>
                    <Icon name="calendar" size={16} className="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{a.tipo}</div>
                      <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>{a.per} · {a.dias} dias úteis</div>
                    </div>
                    {a.fut && <span className="bdg bdg-info" style={{ fontSize: 10.5 }}>Previsto</span>}
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="history" size={13} /> Atividade recente</div>
              <div className="stack-12" style={{ marginTop: 10 }}>
                {[
                  { t: "Registrou execução de março/2026", q: "há 5 sem" },
                  { t: "Recebeu avaliação · nota 2",       q: "há 4 sem" },
                  { t: "Plano 2026/1 iniciou execução",    q: "há 14 sem" },
                  { t: "Assinou TCR 2026",                  q: "há 16 sem" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--c-ink-2)" }}>
                    <span>{a.t}</span><span style={{ color: "var(--c-muted)" }}>{a.q}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ScreenPlanoEntregas, ScreenInstitucional, ScreenPerfilParticipante });
