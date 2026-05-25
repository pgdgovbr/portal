// screens-servidor.jsx — Servidor flow screens
// Dashboard, Meu Plano, Registrar Execução, Contestar Avaliação

// ── Screen 1: Dashboard (Servidor) ─────────────────────────────────────
const ScreenDashboardServidor = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Dashboard · Servidor">
      <TopNav role="servidor" active="home" alerts={3} user={{ name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" }} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Início</div>
            <h1 className="pg-title">Olá, Nitai</h1>
            <p className="pg-sub">Você tem 1 registro de execução pendente e 1 avaliação recebida.</p>
          </div>
          <div style={{ textAlign: "right", color: "var(--c-muted)", fontSize: 13.5 }}>
            <div>Quarta-feira</div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, color: "var(--c-ink)", fontSize: 18, marginTop: 2 }}>15 mai 2026</div>
          </div>
        </div>

        {/* Urgency banner */}
        <div className="banner" style={{ marginBottom: "var(--gap-sec)" }}>
          <span className="icon"><Icon name="alert" size={20} stroke={2} /></span>
          <div style={{ flex: 1 }}>
            <div className="ttl">Registro de execução do mês de abril ainda pendente</div>
            <div className="sub">O prazo legal encerra em <strong>10 de maio</strong>. Você tem 6 dias para descrever o que executou no período.</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <UrgencyPill daysLeft={6} />
            <button className="btn btn-primary">Registrar agora <Icon name="arrowR" size={16} /></button>
          </div>
        </div>

        <div className="g-2-1">
          {/* Left: Plano de Trabalho summary */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd">
                <div>
                  <span className="kicker"><Icon name="file" size={13} /> Plano de Trabalho ativo</span>
                  <h2 style={{ marginTop: 8 }}>Plano 2026/1 · CGTIC</h2>
                  <p>1º semestre · 01 fev 2026 → 31 jul 2026 · 30h/sem</p>
                </div>
                <StatusBadge status="execucao" />
              </div>

              <div className="g-3" style={{ gap: 18, marginBottom: 22 }}>
                <div className="plaque">
                  <div className="kpi-label">Progresso</div>
                  <div className="kpi-num">42%</div>
                  <div className="bar thin" style={{ marginTop: 8 }}><i style={{ width: "42%" }} /></div>
                </div>
                <div className="plaque">
                  <div className="kpi-label">Contribuições</div>
                  <div className="kpi-num">4</div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>somam 100% da carga</div>
                </div>
                <div className="plaque">
                  <div className="kpi-label">Próximo registro</div>
                  <div className="kpi-num" style={{ color: "var(--c-warning)" }}>10 mai</div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>período abril/2026</div>
                </div>
              </div>

              <a href="#" style={{ color: "var(--c-primary)", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
                Abrir meu plano completo <Icon name="arrowR" size={14} />
              </a>
            </section>

            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Avaliação recebida</h2>
                  <p>Período de março/2026 · avaliado por Carlos Mendes em 12 abr</p>
                </div>
                <button className="btn btn-ghost btn-sm">Ver detalhes <Icon name="chevR" size={14} /></button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "10px 4px 4px" }}>
                <div style={{ flex: 1 }}>
                  <NotaBadge nota={2} />
                  <p style={{ marginTop: 12, color: "var(--c-ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                    "Entregas concluídas dentro do prazo, com qualidade técnica acima da média.
                    Atuação destacada na revisão da arquitetura de integração com o SIAPE."
                  </p>
                </div>
                <div style={{
                  width: 120, padding: "14px 16px",
                  borderRadius: "var(--r-md)",
                  background: "linear-gradient(135deg, var(--c-success-soft) 0%, #C9E8CE 100%)",
                  textAlign: "center", border: "1px solid var(--c-success)22"
                }}>
                  <div style={{ fontFamily: "var(--ff-display)", fontSize: 48, fontWeight: 800, color: "var(--c-success)", lineHeight: 1, letterSpacing: "-0.04em" }}>2</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-success)", marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>de 5</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: side column */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Próximos prazos</h2></div>
              <div className="stack-12">
                {[
                  { d: "10 mai", t: "Registrar execução · abril/2026", urg: 6 },
                  { d: "10 jun", t: "Registrar execução · maio/2026", urg: 37 },
                  { d: "01 jul", t: "Avaliação semestral", urg: 58 },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 48, textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, color: "var(--c-ink)" }}>{p.d.split(" ")[0]}</div>
                      <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>{p.d.split(" ")[1]}</div>
                    </div>
                    <div style={{ flex: 1, fontSize: 13.5 }}>{p.t}</div>
                    <UrgencyPill daysLeft={p.urg} />
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="card-hd">
                <h2 style={{ fontSize: 17 }}>Notificações recentes</h2>
                <a href="#" style={{ fontSize: 13, color: "var(--c-primary)", fontWeight: 600 }}>Ver todas</a>
              </div>
              <div className="stack-12">
                {[
                  { ic: "ok",   it: "Avaliação de março publicada",       ag: "há 3 dias" },
                  { ic: "warn", it: "Lembrete: registrar abril até 10/05", ag: "há 5 dias" },
                  { ic: "info", it: "Plano de Entregas aprovado",          ag: "há 2 sem" },
                ].map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div className={`nf-icon ${n.ic}`} style={{ width: 32, height: 32 }}>
                      <Icon name={n.ic === "ok" ? "check" : n.ic === "warn" ? "alert" : "info"} size={15} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: "var(--c-ink)", fontWeight: 500 }}>{n.it}</div>
                      <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>{n.ag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ background: "linear-gradient(135deg, #0F3D8C 0%, #1351B4 100%)", color: "white", border: "none" }}>
              <div style={{ fontSize: 12, opacity: .85, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Resumo do semestre</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
                <div>
                  <div style={{ fontFamily: "var(--ff-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>3/6</div>
                  <div style={{ fontSize: 13, opacity: .8, marginTop: 6 }}>registros submetidos</div>
                </div>
                <Spark data={[2, 2, 3, 2, 2, 0]} color="rgba(255,255,255,0.85)" w={100} h={36} />
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                {["fev", "mar", "abr", "mai", "jun", "jul"].map((m, i) => (
                  <div key={m} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: 6, borderRadius: 3,
                      background: i < 2 ? "rgba(255,255,255,0.85)" : i === 2 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)",
                    }} />
                    <div style={{ fontSize: 10.5, opacity: .75, marginTop: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{m}</div>
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

// ── Screen 2: Meu Plano de Trabalho ────────────────────────────────────
const ScreenMeuPlano = ({ density, histView }) => {
  const periodos = [
    { mes: "Mar 2026", per: "01–31 mar", reg: "07 abr", avl: "12 abr", aval: "Carlos Mendes", nota: 2 },
    { mes: "Fev 2026", per: "01–28 fev", reg: "06 mar", avl: "11 mar", aval: "Carlos Mendes", nota: 3 },
    { mes: "Abr 2026", per: "01–30 abr", reg: null,     avl: null,     aval: "—",              nota: null, pendente: true },
  ];

  const renderHist = () => {
    if (histView === "kanban") {
      const cols = [
        { ttl: "Pendente registro", items: periodos.filter(p => p.pendente), c: "var(--c-warning)" },
        { ttl: "Aguardando avaliação", items: [], c: "var(--c-info)" },
        { ttl: "Avaliados", items: periodos.filter(p => !p.pendente), c: "var(--c-status-aval)" },
      ];
      return (
        <div className="g-3" style={{ gap: 14 }}>
          {cols.map((col, i) => (
            <div key={i} style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-md)", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: col.c }} />
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--c-ink-2)" }}>{col.ttl}</div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--c-muted)", background: "white", padding: "2px 7px", borderRadius: 10 }}>{col.items.length}</span>
              </div>
              <div className="stack-12">
                {col.items.map((p, j) => (
                  <div key={j} style={{ background: "white", borderRadius: "var(--r-sm)", padding: 12, border: "1px solid var(--c-border)" }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.mes}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>{p.per}</div>
                    {p.nota ? <div style={{ marginTop: 8 }}><NotaBadge nota={p.nota} /></div> : <div style={{ marginTop: 8 }}><UrgencyPill daysLeft={6} /></div>}
                  </div>
                ))}
                {col.items.length === 0 && <div style={{ fontSize: 12, color: "var(--c-muted-2)", textAlign: "center", padding: 12 }}>—</div>}
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (histView === "cards") {
      return (
        <div className="g-3" style={{ gap: 14 }}>
          {periodos.map((p, i) => (
            <div key={i} style={{ padding: 18, border: "1px solid var(--c-border)", borderRadius: "var(--r-md)", background: p.pendente ? "var(--c-warning-soft)" : "var(--c-surface)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: p.pendente ? "var(--c-warning)" : "var(--c-muted)" }}>{p.mes}</div>
              <div style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, marginTop: 4, color: "var(--c-ink)" }}>{p.per}</div>
              <div className="divider" />
              {p.pendente ? (
                <>
                  <UrgencyPill daysLeft={6} />
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 12, width: "100%" }}>Registrar execução</button>
                </>
              ) : (
                <>
                  <NotaBadge nota={p.nota} />
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 8 }}>Registro {p.reg} · avaliado {p.avl}</div>
                  <div style={{ fontSize: 12, color: "var(--c-ink-2)", marginTop: 2 }}>por {p.aval}</div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
    // tabela (default)
    return (
      <table className="tbl">
        <thead><tr>
          <th>Período</th><th>Registro</th><th>Avaliação</th><th>Avaliado por</th><th>Nota</th><th></th>
        </tr></thead>
        <tbody>
          {periodos.map((p, i) => (
            <tr key={i}>
              <td><strong>{p.mes}</strong><div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>{p.per}</div></td>
              <td>{p.reg || <span style={{ color: "var(--c-warning)", fontWeight: 600 }}>Pendente</span>}</td>
              <td>{p.avl || "—"}</td>
              <td>{p.aval}</td>
              <td>{p.nota ? <NotaBadge nota={p.nota} /> : <UrgencyPill daysLeft={6} />}</td>
              <td style={{ textAlign: "right" }}>
                {p.pendente
                  ? <button className="btn btn-primary btn-sm">Registrar</button>
                  : <button className="btn btn-ghost btn-sm">Detalhes</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Meu Plano de Trabalho">
      <TopNav role="servidor" active="plano" alerts={3} user={{ name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" }} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span><span>Meu Plano de Trabalho</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Plano 2026/1 · CGTIC</div>
            <h1 className="pg-title">Coordenação-Geral de TI e Comunicações</h1>
            <p className="pg-sub">Plano de Trabalho do 1º semestre, vinculado ao Plano de Entregas “Modernização do parque tecnológico 2026”.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar PDF</button>
            <button className="btn btn-primary">Registrar execução de abril</button>
          </div>
        </div>

        <div className="g-2-1">
          {/* main */}
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
                  <div className="kpi-label">Carga horária</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, marginTop: 6 }}>30 h/sem</div>
                </div>
                <div>
                  <div className="kpi-label">Modalidade</div>
                  <div style={{ marginTop: 6 }}><ModalidadeBadge codigo={3} /></div>
                </div>
              </div>

              <div className="divider" />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink-2)" }}>Progresso do semestre</div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>42% concluído</div>
              </div>
              <div className="bar"><i style={{ width: "42%" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--c-muted)", marginTop: 6 }}>
                <span>01 fev</span><span>15 mai (hoje)</span><span>31 jul</span>
              </div>
            </section>

            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>Contribuições ao plano</h2>
                  <p>4 contribuições · soma 100% da carga horária disponível</p>
                </div>
              </div>
              {[
                { t: 1, ttl: "Migração da base SIAPE para PostgreSQL 16", desc: "Vinculada à entrega «Migração de bancos legados» do Plano de Entregas da CGTIC.", pct: "35%" },
                { t: 1, ttl: "Revisão de APIs de integração com Gov.br", desc: "Vinculada à entrega «Adesão obrigatória ao Gov.br ID».", pct: "30%" },
                { t: 2, ttl: "Mentoria de novos servidores da CGTIC",     desc: "Atividade não vinculada a entrega — desenvolvimento de equipe.", pct: "20%" },
                { t: 3, ttl: "Apoio à CGRH na adoção de SSO",            desc: "Vinculada à entrega da CGRH «Unificação de identidades».", pct: "15%" },
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
                  <p>Registros de execução e avaliações da chefia</p>
                </div>
                <span className="bdg bdg-warning"><span className="dot" />1 pendente</span>
              </div>
              {renderHist()}
            </section>
          </div>

          {/* side */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Linha do tempo</h2></div>
              <StatusTimeline items={[
                { label: "Plano elaborado", date: "22 jan 2026", note: "Por Carlos Mendes (chefia imediata)" },
                { label: "Aprovado", date: "28 jan 2026" },
                { label: "Iniciado em execução", date: "01 fev 2026" },
                { label: "Em execução", date: "Desde 01 fev · há 103 dias", current: true, note: "Registros mensais até dia 10 do mês seguinte." },
                { label: "Conclusão prevista", date: "31 jul 2026", future: true },
                { label: "Avaliação final", date: "até 20 ago 2026", future: true },
              ]} />
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Critérios de avaliação</h2></div>
              <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.6 }}>
                Definidos pela chefia ao aprovar o plano:
              </p>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", marginTop: 10, lineHeight: 1.7 }}>
                <li>Cumprimento de prazos das entregas vinculadas</li>
                <li>Qualidade técnica da documentação produzida</li>
                <li>Comunicação efetiva com áreas envolvidas</li>
                <li>Iniciativa em proposição de melhorias</li>
              </ul>
            </section>

            <section className="card" style={{ borderLeft: "3px solid var(--c-warning)" }}>
              <div className="kicker" style={{ color: "var(--c-warning)" }}><Icon name="info" size={13} /> Sobre prazos</div>
              <p style={{ fontSize: 13, color: "var(--c-ink-2)", marginTop: 10, lineHeight: 1.55 }}>
                Como seu plano tem duração maior que 30 dias, o registro de execução deve ser feito
                <strong> mensalmente, até o dia 10 do mês seguinte</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 3: Registrar Execução (Wizard) ──────────────────────────────
const REGISTRO_ORIGINAL = `• Finalizei a migração de 3 tabelas críticas do SIAPE para o PostgreSQL 16, incluindo
  servidores_pgd, planos_trabalho_legado e registros_envio. Total de 1,2M de linhas migradas
  com 0 erros, validação por checksum aprovada.

• Conduzi 2 sessões de mentoria com novos servidores da CGTIC sobre infraestrutura
  como código (Terraform), totalizando 4h de capacitação.

• Iniciei revisão de 4 endpoints da integração Gov.br ID — 2 já documentados e
  publicados no portal de APIs internas. Os outros 2 dependem do aval da CGRH para
  fechar contrato de SLA.

• Apoiei a CGRH em 1 reunião técnica sobre adesão ao SSO unificado (16/abr).`;

// aiInitialState pode ser "closed" (default), "editing" ou "previewing"
const ScreenRegistrar = ({ density, aiInitialState = "closed" }) => {
  const [aiOpen, setAiOpen]   = React.useState(aiInitialState !== "closed");
  const [aiStage, setAiStage] = React.useState(aiInitialState === "previewing" ? "previewing" : "editing");
  const [texto, setTexto]     = React.useState(REGISTRO_ORIGINAL);

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Registrar Execução · wizard">
      <TopNav role="servidor" active="plano" alerts={3} user={{ name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" }} />
      <div className="pg" style={{ maxWidth: 1080 }}>
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <span>Registrar execução · abril/2026</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Registro mensal</div>
            <h1 className="pg-title">Registrar execução de abril</h1>
            <p className="pg-sub">Descreva os trabalhos realizados no período. O registro será enviado à chefia para avaliação.</p>
          </div>
          <UrgencyPill daysLeft={6} label="Vence em 10 mai · 6 dias" />
        </div>

        <div className="card" style={{ padding: "22px 28px", marginBottom: "var(--gap-sec)" }}>
          <Stepper steps={["Período", "Descrição da execução", "Ocorrências", "Revisão e envio"]} current={1} />
        </div>

        <div className="g-2-1">
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>2. Descrição da execução</h2>
                <p>O que você executou no período de avaliação? Liste contribuições, entregas e atividades concretas.</p>
              </div>
              <span className="kicker"><Icon name="clock" size={13} /> Auto-salvo · há 12s</span>
            </div>

            <div className="stack-20">
              <div className="field">
                <label>Período avaliativo</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="input-prefix">
                    <span className="pf">De</span>
                    <input className="input" defaultValue="01/04/2026" />
                  </div>
                  <div className="input-prefix">
                    <span className="pf">Até</span>
                    <input className="input" defaultValue="30/04/2026" />
                  </div>
                </div>
                <div className="help">O período não pode sobrepor registros anteriores.</div>
              </div>

              <div className="field">
                <label htmlFor="exec" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Descrição dos trabalhos executados</span>
                  {!aiOpen && (
                    <button
                      type="button"
                      onClick={() => { setAiOpen(true); setAiStage("editing"); }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "linear-gradient(90deg, var(--c-status-aval) 0%, #7B3FB8 100%)",
                        color: "white", border: 0,
                        padding: "6px 12px", borderRadius: 999,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        fontFamily: "inherit",
                        boxShadow: "0 2px 6px rgba(92, 45, 145, .25)",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                      </svg>
                      Reescrever com IA
                    </button>
                  )}
                </label>
                <textarea
                  id="exec"
                  className="textarea"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  style={{ minHeight: aiOpen ? 180 : 280 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--c-muted)" }}>
                  <span className="help">Vincule, quando possível, às contribuições do seu plano. Mín. 50 caracteres.</span>
                  <span style={{ fontFamily: "var(--ff-display)", fontWeight: 600 }}>{texto.length} / 2000</span>
                </div>

                {aiOpen && (
                  <AIRewritePanel
                    initialState={aiStage}
                    originalText={texto}
                    onCancel={() => setAiOpen(false)}
                    onApply={(novoTexto) => { setTexto(novoTexto); setAiOpen(false); }}
                  />
                )}
              </div>

              <div style={{ background: "var(--c-info-soft)", padding: "14px 16px", borderRadius: "var(--r-md)", display: "flex", gap: 12 }}>
                <Icon name="info" size={18} className="" />
                <div style={{ fontSize: 13, color: "var(--c-primary-ink)", lineHeight: 1.55 }}>
                  <strong>Dica:</strong> registros que mencionam <em>contribuição</em>, <em>entrega</em> ou <em>atividade</em>
                  com data e número facilitam a avaliação da chefia e reduzem chance de contestação.
                </div>
              </div>
            </div>

            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost">Salvar rascunho</button>
                <button className="btn btn-primary">Próximo: Ocorrências <Icon name="arrowR" size={16} /></button>
              </div>
            </div>
          </section>

          {/* side */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Suas contribuições</h2></div>
              <p style={{ fontSize: 12.5, color: "var(--c-muted)", margin: "0 0 14px" }}>Vincule sua execução a uma ou mais:</p>
              <div className="stack-12">
                {[
                  { t: 1, ttl: "Migração SIAPE → PG16", pct: "35%" },
                  { t: 1, ttl: "Revisão APIs Gov.br", pct: "30%" },
                  { t: 2, ttl: "Mentoria de novos", pct: "20%" },
                  { t: 3, ttl: "Apoio CGRH · SSO", pct: "15%" },
                ].map((c, i) => (
                  <label key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked={i < 4} />
                    <span className={`contrib-tipo t${c.t}`} style={{ width: 24, height: 24, fontSize: 11 }}>{c.t}</span>
                    <div style={{ flex: 1, fontSize: 13 }}>{c.ttl}</div>
                    <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, color: "var(--c-muted)" }}>{c.pct}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="clock" size={13} /> Prazo legal</div>
              <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                Registros mensais devem ser submetidos até o <strong>dia 10 do mês seguinte</strong>.
                Após esse prazo, a chefia recebe alerta de atraso.
              </p>
              <div style={{ marginTop: 14, padding: "10px 12px", background: "white", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>10 mai 2026</span>
                <UrgencyPill daysLeft={6} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 4: Contestar Avaliação ──────────────────────────────────────
const ScreenContestar = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Contestar Avaliação">
      <TopNav role="servidor" active="plano" alerts={3} user={{ name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" }} />
      <div className="pg" style={{ maxWidth: 1080 }}>
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <a href="#">Avaliação mar/2026</a><span className="sep">/</span>
          <span>Contestar</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow" style={{ color: "var(--c-danger)" }}>Recurso de avaliação</div>
            <h1 className="pg-title">Contestar avaliação de março</h1>
            <p className="pg-sub">Você tem até <strong>22 de maio</strong> para apresentar recurso à avaliação recebida.</p>
          </div>
          <UrgencyPill daysLeft={7} label="7 dias para protocolar" />
        </div>

        <div className="g-2-1">
          <section className="card">
            {/* Avaliação recebida (read-only) */}
            <div style={{ background: "var(--c-surface-2)", padding: "18px 20px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border)", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div className="kicker">Avaliação recebida · Mar 2026</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <NotaBadge nota={4} />
                    <span style={{ fontSize: 13, color: "var(--c-muted)" }}>por Carlos Mendes · 12 abr 2026</span>
                  </div>
                </div>
                <div style={{ width: 84, height: 84, borderRadius: "var(--r-md)", background: "var(--c-warning-soft)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--c-warning)33" }}>
                  <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 44, color: "var(--c-warning)", lineHeight: 1 }}>4</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-ink-2)", marginTop: 8 }}>Justificativa da chefia:</div>
              <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "6px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>
                "Entregas atrasadas em relação ao planejado. A migração das tabelas estava
                prevista para 15/mar e foi concluída apenas em 04/abr. Não há registro de
                comunicação prévia sobre o atraso à chefia."
              </p>
            </div>

            <div className="card-hd">
              <div>
                <h2>Sua argumentação</h2>
                <p>Apresente fatos, datas e evidências que sustentem seu recurso.</p>
              </div>
            </div>

            <div className="stack-20">
              <div className="field">
                <label htmlFor="rec">Justificativa do recurso</label>
                <textarea
                  id="rec"
                  className="textarea"
                  placeholder="Descreva por que discorda da avaliação. Referencie datas, ocorrências e contribuições do plano."
                  defaultValue={
`Discordo da nota 4 pelos motivos a seguir:

1. O atraso da migração foi comunicado à chefia em 12/mar via e-mail (anexo 1)
   e mensagem no Mattermost (#cgtic-pgd), apontando dependência externa do
   time de Infraestrutura para liberação do ambiente PG16.

2. A liberação efetiva da infra ocorreu em 28/mar — atraso de 13 dias atribuível
   a fator externo. Solicito reconsideração com base no art. X da IN 24/2023,
   que prevê desconsideração de impedimentos não-atribuíveis ao servidor.`
                  }
                  style={{ minHeight: 220 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--c-muted)" }}>
                  <span className="help">Mín. 100 caracteres. Anexos opcionais.</span>
                  <span style={{ fontFamily: "var(--ff-display)", fontWeight: 600 }}>432 / 4000</span>
                </div>
              </div>

              <div className="field">
                <label>Anexar evidências (opcional)</label>
                <div style={{ border: "2px dashed var(--c-border-strong)", borderRadius: "var(--r-md)", padding: 22, textAlign: "center", color: "var(--c-muted)" }}>
                  <Icon name="cloudUp" size={28} />
                  <div style={{ fontSize: 13.5, marginTop: 8 }}><strong style={{ color: "var(--c-primary)" }}>Clique para enviar</strong> ou arraste arquivos</div>
                  <div style={{ fontSize: 11.5, marginTop: 4 }}>PDF, PNG, JPG · máx. 10MB cada</div>
                </div>
              </div>
            </div>

            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>
                Ao protocolar, sua chefia tem <strong>10 dias</strong> para responder.
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost">Cancelar</button>
                <button className="btn btn-primary"><Icon name="paperPlane" size={15} /> Protocolar recurso</button>
              </div>
            </div>
          </section>

          {/* side */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Como funciona</div>
              <ol style={{ paddingLeft: 18, marginTop: 12, fontSize: 13, color: "var(--c-ink-2)", lineHeight: 1.7 }}>
                <li>Você protocola o recurso (prazo: 10 dias após a avaliação)</li>
                <li>A chefia tem 10 dias para responder</li>
                <li>Se mantida, você pode escalar à instância superior</li>
              </ol>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 15 }}>Sua descrição original</h2></div>
              <p style={{ fontSize: 12.5, color: "var(--c-muted)", margin: "-6px 0 12px" }}>O que você registrou em 07 abr 2026:</p>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", lineHeight: 1.55, padding: 12, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)" }}>
                "Trabalhei na migração das tabelas SIAPE para PG16 (parcialmente concluída,
                dependência de liberação da infra), mentoria de novos servidores (2 sessões)
                e início da revisão dos endpoints Gov.br ID..."
              </p>
              <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8 }}>Ver completa <Icon name="arrowR" size={12} /></a>
            </section>

            <section className="card" style={{ background: "var(--c-danger-soft)", border: "1px solid var(--c-danger)33" }}>
              <div className="kicker" style={{ color: "var(--c-danger)" }}><Icon name="alert" size={13} /> Importante</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                Após protocolado, o recurso não pode ser editado. Revise antes de enviar.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  ScreenDashboardServidor, ScreenMeuPlano, ScreenRegistrar, ScreenContestar,
});
