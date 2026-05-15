// screens-misc.jsx — Telas especiais
// - Detalhe de Avaliação publicada (servidor vê)
// - Empty state / primeiro acesso (servidor sem plano)
// - Erro de sincronização individual (drill-down do painel)
// - Cadastrar Participante (admin)

// ── Detalhe de Avaliação Publicada (Servidor) ──────────────────────────
const ScreenDetalheAvaliacao = ({ density }) => {
  const NOTA = 2;
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Detalhe Avaliação · Servidor">
      <TopNav role="servidor" active="plano" alerts={3} user={{ name: "Ana Beatriz Costa", role: "Servidora · Analista", initials: "AC" }} />
      <div className="pg" style={{ maxWidth: 1080 }}>
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <span>Avaliação · março/2026</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Avaliação publicada · período março/2026</div>
            <h1 className="pg-title">Sua avaliação chegou</h1>
            <p className="pg-sub">Carlos Mendes avaliou seu registro em 12 de abril. Você pode contestar até 22 de abril se discordar.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-ghost"><Icon name="download" size={15} /> Comprovante PDF</button>
          </div>
        </div>

        <div className="g-2-1">
          {/* Esquerda: nota grande + justificativa */}
          <section className="card" style={{ background: "linear-gradient(135deg, var(--c-success-soft) 0%, rgba(255,255,255,1) 60%)", borderLeft: "4px solid var(--c-success)" }}>
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <div style={{
                width: 140, height: 140, borderRadius: "var(--r-lg)",
                background: "white", border: "2px solid var(--c-success)33",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                flex: "none"
              }}>
                <div style={{ fontFamily: "var(--ff-display)", fontSize: 80, fontWeight: 800, color: "var(--c-success)", lineHeight: 1, letterSpacing: "-0.05em" }}>{NOTA}</div>
                <div style={{ fontSize: 11, color: "var(--c-success)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>de 5</div>
              </div>
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div className="kicker" style={{ color: "var(--c-success)" }}>Nota {NOTA}</div>
                <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: "6px 0 4px", color: "var(--c-ink)" }}>Alto desempenho</h2>
                <p style={{ color: "var(--c-ink-2)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>
                  Resultado consistentemente acima do esperado nos critérios estabelecidos para o período.
                </p>

                <div className="divider" />

                <div className="kicker">Justificativa da chefia</div>
                <blockquote style={{
                  fontSize: 14.5, color: "var(--c-ink-2)", lineHeight: 1.6,
                  margin: "12px 0 0",
                  padding: "14px 18px",
                  background: "white",
                  borderRadius: "var(--r-md)",
                  borderLeft: "3px solid var(--c-success)",
                  fontStyle: "italic"
                }}>
                  "Entregas concluídas dentro do prazo, com qualidade técnica acima da média.
                  Atuação destacada na revisão da arquitetura de integração com o SIAPE, que
                  evitou retrabalho da CGRH. Boa comunicação sobre dependências externas."
                </blockquote>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--c-muted)" }}>Avaliado por</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                  <span className="av av-sm" style={{ background: "var(--c-primary)", color: "white" }}>CM</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Carlos Mendes</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>Chefia · CGTIC · 12 abr 2026</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--c-muted)" }}>Notas 4 ou 5 podem ser contestadas</div>
                <button className="btn btn-ghost btn-sm" disabled style={{ marginTop: 6, opacity: .5 }}>
                  Contestar (indisponível p/ nota 2)
                </button>
              </div>
            </div>
          </section>

          {/* Direita: contexto */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Critérios avaliados</h2></div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--c-ink-2)", margin: "0", lineHeight: 1.8 }}>
                <li>Cumprimento de prazos das entregas vinculadas</li>
                <li>Qualidade técnica da documentação produzida</li>
                <li>Comunicação efetiva com áreas envolvidas</li>
                <li>Iniciativa em proposição de melhorias</li>
              </ul>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 17 }}>Seu registro original</h2></div>
              <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginBottom: 6 }}>Submetido em 04/04/2026 para o período mar/2026</div>
              <p style={{
                fontSize: 12.5, color: "var(--c-ink-2)", lineHeight: 1.55,
                padding: 12, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)",
                margin: 0
              }}>
                "Finalizei a migração das tabelas SIAPE para PG16 (1,2M de linhas migradas,
                validação por checksum aprovada). Conduzi 2 sessões de mentoria..."
              </p>
              <a href="#" style={{ fontSize: 12.5, color: "var(--c-primary)", fontWeight: 600, marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>
                Ver completo <Icon name="arrowR" size={12} />
              </a>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="history" size={13} /> Histórico</div>
              <div className="stack-12" style={{ marginTop: 12 }}>
                {[{m: "Mar", n: 2}, {m: "Fev", n: 3}, {m: "Jan", n: 3}].map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13 }}>{h.m} 2026</span><NotaBadge nota={h.n} />
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

// ── Empty State / Primeiro Acesso (Servidor sem plano) ─────────────────
const ScreenEmptyState = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Empty State · primeiro acesso">
      <TopNav role="servidor" active="home" alerts={1} user={{ name: "Felipe Ribeiro", role: "Servidor · Analista de TI", initials: "FR" }} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Início</div>
            <h1 className="pg-title">Bem-vindo ao PGD, Felipe</h1>
            <p className="pg-sub">Você ainda não tem um Plano de Trabalho ativo. Aqui está o que vai acontecer a seguir.</p>
          </div>
        </div>

        <div className="g-2-1">
          {/* Onboarding flow */}
          <section className="card" style={{ padding: 36 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                width: 96, height: 96, borderRadius: "50%",
                background: "var(--c-primary-soft)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "var(--c-primary)"
              }}>
                <Icon name="handshake" size={44} stroke={1.4} />
              </div>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 26, fontWeight: 700, margin: "20px 0 8px", letterSpacing: "-0.01em" }}>
                Você foi habilitado para o PGD
              </h2>
              <p style={{ color: "var(--c-muted)", fontSize: 15, maxWidth: "48ch", margin: "0 auto", lineHeight: 1.55 }}>
                O Programa de Gestão e Desempenho permite formalizar seu plano de trabalho semestral
                e registrar sua produção mensalmente. É a base para teletrabalho regular.
              </p>
            </div>

            <div className="divider" />

            <div className="stack-20" style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span className="numdot done" style={{ width: 32, height: 32, fontSize: 14 }}>
                  <Icon name="check" size={15} stroke={2.6} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>TCR assinado <span className="bdg bdg-success" style={{ marginLeft: 8, fontSize: 10.5 }}>Concluído</span></div>
                  <div style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 2 }}>Termo de Ciência e Responsabilidade assinado em 28/01/2026.</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span className="numdot" style={{ width: 32, height: 32, fontSize: 14, background: "var(--c-primary)", boxShadow: "0 0 0 4px var(--c-primary-soft)" }}>2</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>Sua chefia está elaborando seu plano</div>
                  <div style={{ fontSize: 13, color: "var(--c-ink-2)", marginTop: 2, lineHeight: 1.55 }}>
                    Carlos Mendes está definindo as contribuições do seu Plano de Trabalho 2026/2.
                    Início previsto em <strong>01/06/2026</strong>.
                  </div>
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--c-primary-soft)", borderRadius: "var(--r-sm)", fontSize: 12.5, display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="av av-sm" style={{ background: "var(--c-primary)", color: "white" }}>CM</span>
                    <span style={{ flex: 1 }}>Carlos te enviou uma mensagem · há 2 dias</span>
                    <button className="btn btn-ghost btn-sm" style={{ background: "white" }}>Ver</button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: .5 }}>
                <span className="numdot idle" style={{ width: 32, height: 32, fontSize: 14 }}>3</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink-2)" }}>Aprovação superior</div>
                  <div style={{ fontSize: 12.5, color: "var(--c-muted)", marginTop: 2 }}>Diretoria valida o plano antes do início da execução.</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: .5 }}>
                <span className="numdot idle" style={{ width: 32, height: 32, fontSize: 14 }}>4</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-ink-2)" }}>Início da execução</div>
                  <div style={{ fontSize: 12.5, color: "var(--c-muted)", marginTop: 2 }}>Você passa a registrar execução mensalmente.</div>
                </div>
              </div>
            </div>

            <div className="divider" />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--c-muted)", margin: "0 0 12px" }}>Enquanto isso, você pode explorar o sistema:</p>
              <div style={{ display: "inline-flex", gap: 10 }}>
                <button className="btn btn-ghost"><Icon name="info" size={15} /> Como funciona o PGD</button>
                <button className="btn btn-ghost"><Icon name="file" size={15} /> Ver TCR assinado</button>
              </div>
            </div>
          </section>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Avisos importantes</div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.65 }}>
                <li>Sem plano em execução, você não pode usar a modalidade de teletrabalho</li>
                <li>Quando o plano for aprovado, você receberá notificação por e-mail</li>
                <li>Não é necessário fazer nenhuma ação até lá</li>
              </ul>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>FAQ rápido</h2></div>
              <div className="stack-12">
                {[
                  "O que é Plano de Trabalho?",
                  "Como funcionam as avaliações?",
                  "O que acontece se eu não atingir as contribuições?",
                  "Posso recusar uma avaliação?",
                  "Quando posso solicitar teletrabalho integral?",
                ].map((q, i) => (
                  <a key={i} href="#" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--c-divider)" : "0", textDecoration: "none", color: "var(--c-ink-2)" }}>
                    <span style={{ fontSize: 13 }}>{q}</span>
                    <Icon name="chevR" size={14} className="" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Erro de Sincronização (drill-down) ─────────────────────────────────
const ScreenErroSync = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Erro de sincronização · drill-down">
      <TopNav role="admin" active="conform" alerts={4} user={{ name: "Pedro Almeida", role: "Administrador · TI/RH", initials: "PA" }} />
      <div className="pg" style={{ maxWidth: 1180 }}>
        <div className="crumb">
          <a href="#">Conformidade</a><span className="sep">/</span>
          <a href="#">Envios com erro</a><span className="sep">/</span>
          <span>PT-2026-0312</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow" style={{ color: "var(--c-danger)" }}>Falha de sincronização · 4 tentativas</div>
            <h1 className="pg-title">PUT /plano_trabalho · PT-2026-0312</h1>
            <p className="pg-sub">Plano de Trabalho de Lucas Pereira · CGTIC · não foi enviado à API PGD Central por erro de validação.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost"><Icon name="download" size={15} /> Exportar log</button>
            <button className="btn btn-primary"><Icon name="refresh" size={15} /> Reprocessar agora</button>
          </div>
        </div>

        {/* Banner com erro principal */}
        <div className="banner urgent" style={{ marginBottom: "var(--gap-sec)" }}>
          <span className="icon"><Icon name="alert" size={20} stroke={2} /></span>
          <div style={{ flex: 1 }}>
            <div className="ttl">HTTP 422 · cod_unidade_executora ausente</div>
            <div className="sub">O campo obrigatório <code style={{ fontFamily: "var(--ff-mono)", background: "rgba(0,0,0,.06)", padding: "1px 5px", borderRadius: 4 }}>cod_unidade_executora</code> não foi enviado no payload. Cadastre a unidade executora do servidor antes de reprocessar.</div>
          </div>
          <button className="btn btn-soft btn-sm"><Icon name="settings" size={13} /> Corrigir cadastro</button>
        </div>

        <div className="g-2-1">
          {/* Esquerda: detalhes técnicos */}
          <section className="card" style={{ padding: 0 }}>
            <div className="tabs" style={{ margin: 0, padding: "0 24px", borderBottom: "1px solid var(--c-border)" }}>
              <span className="tab active">Histórico de tentativas</span>
              <span className="tab">Payload enviado</span>
              <span className="tab">Resposta da API</span>
              <span className="tab">Comparação</span>
            </div>

            <div style={{ padding: 24 }}>
              <div className="stack-16">
                {[
                  { ord: 4, when: "há 12 min · 15/05 14:38", status: 422, msg: "cod_unidade_executora ausente", autom: true,  cur: true },
                  { ord: 3, when: "há 42 min · 15/05 14:08", status: 422, msg: "cod_unidade_executora ausente", autom: true },
                  { ord: 2, when: "há 1h12 · 15/05 13:38",    status: 422, msg: "cod_unidade_executora ausente", autom: true },
                  { ord: 1, when: "há 1h42 · 15/05 13:08",    status: 422, msg: "cod_unidade_executora ausente", autom: true },
                ].map((t, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, padding: 14,
                    border: `1px solid ${t.cur ? "var(--c-danger)" : "var(--c-border)"}`,
                    borderRadius: "var(--r-md)",
                    background: t.cur ? "var(--c-danger-soft)" : "white"
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "var(--r-sm)",
                      background: "var(--c-danger)", color: "white",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--ff-display)", fontWeight: 800,
                      flex: "none"
                    }}>{t.status}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <strong style={{ fontSize: 14 }}>Tentativa #{t.ord}</strong>
                        {t.autom && <span className="bdg bdg-neutral" style={{ fontSize: 10.5 }}>automática</span>}
                        {t.cur && <span className="bdg bdg-danger" style={{ fontSize: 10.5 }}>última</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--c-muted)", marginTop: 2 }}>{t.when}</div>
                      <div style={{ fontFamily: "var(--ff-mono)", fontSize: 12, color: "var(--c-danger)", marginTop: 6 }}>422 · {t.msg}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm">Ver payload</button>
                  </div>
                ))}

                <div style={{ padding: 14, border: "1.5px dashed var(--c-border-strong)", borderRadius: "var(--r-md)", textAlign: "center", color: "var(--c-muted)", fontSize: 13 }}>
                  Próxima tentativa automática em <strong style={{ color: "var(--c-ink)" }}>15 min</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Direita: contexto */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Sobre este envio</h2></div>
              <div className="stack-12">
                {[
                  ["Entidade", "Plano de Trabalho"],
                  ["ID interno", "PT-2026-0312"],
                  ["Participante", "Lucas Pereira"],
                  ["SIAPE", "2840193"],
                  ["Operação", "PUT /plano_trabalho"],
                  ["Criado em", "15/05/2026 13:00"],
                  ["1ª tentativa", "13:08"],
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--c-muted)" }}>{r[0]}</span>
                    <strong style={{ fontFamily: r[0].includes("ID") || r[0].includes("SIAPE") ? "var(--ff-mono)" : "inherit", fontSize: 12.5 }}>{r[1]}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ borderLeft: "3px solid var(--c-primary)" }}>
              <div className="kicker" style={{ color: "var(--c-primary)" }}><Icon name="info" size={13} /> Como resolver</div>
              <ol style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
                <li>Vá até <a href="#" style={{ color: "var(--c-primary)" }}>Institucional → Unidades</a></li>
                <li>Cadastre a unidade executora de Lucas Pereira (CGTIC.DSI)</li>
                <li>Volte aqui e clique em <strong>Reprocessar agora</strong></li>
              </ol>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12, width: "100%" }}>Ir para cadastro de unidades →</button>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="settings" size={13} /> Ações avançadas</div>
              <div className="stack-12" style={{ marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start" }}><Icon name="x" size={13} /> Pausar tentativas automáticas</button>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start" }}><Icon name="download" size={13} /> Baixar payload completo (JSON)</button>
                <button className="btn btn-danger btn-sm" style={{ width: "100%", justifyContent: "flex-start" }}><Icon name="x" size={13} /> Marcar como não-enviável</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Cadastrar Participante (Admin) ─────────────────────────────────────
const ScreenCadastrarParticipante = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Cadastrar Participante · Admin">
      <TopNav role="admin" active="participantes" alerts={4} user={{ name: "Pedro Almeida", role: "Administrador · TI/RH", initials: "PA" }} />
      <div className="pg" style={{ maxWidth: 1080 }}>
        <div className="crumb">
          <a href="#">Participantes</a><span className="sep">/</span>
          <span>Cadastrar novo</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Novo participante do PGD</div>
            <h1 className="pg-title">Cadastrar participante</h1>
            <p className="pg-sub">Vincule um servidor do quadro ao PGD. O servidor receberá e-mail para assinatura do TCR.</p>
          </div>
        </div>

        <div className="g-2-1">
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Dados do servidor</h2>
                <p>Preencha os dados conforme registro no SIAPE.</p>
              </div>
              <button className="btn btn-soft btn-sm"><Icon name="download" size={13} /> Importar do SIAPE</button>
            </div>

            <div className="stack-20">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label>Nome completo</label>
                  <input className="input" defaultValue="Marina Coutinho Silva" />
                </div>
                <div className="field">
                  <label>Matrícula SIAPE</label>
                  <input className="input" defaultValue="1948372" style={{ fontFamily: "var(--ff-mono)" }} />
                  <div className="help">7 dígitos · será validado contra a base SIAPE.</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label>CPF</label>
                  <input className="input" defaultValue="123.456.789-00" style={{ fontFamily: "var(--ff-mono)" }} />
                </div>
                <div className="field">
                  <label>E-mail institucional</label>
                  <input className="input" defaultValue="marina.silva@orgao.gov.br" />
                </div>
              </div>

              <div className="divider" />
              <div className="kicker">Lotação</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label>Unidade de exercício</label>
                  <select className="select" defaultValue="cgtic"><option value="cgtic">CGTIC · Coord.-Geral de TI</option><option>CGRH</option><option>CGOF</option><option>CGLOG</option></select>
                </div>
                <div className="field">
                  <label>Chefia imediata</label>
                  <select className="select" defaultValue="cm"><option value="cm">Carlos Mendes</option><option>Mariana Andrade</option></select>
                </div>
              </div>

              <div className="field">
                <label>Cargo / função</label>
                <input className="input" defaultValue="Analista em Tecnologia da Informação" />
              </div>

              <div className="divider" />
              <div className="kicker">Modalidade prevista</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { c: 1, lbl: "Presencial",   sub: "Sem teletrabalho" },
                  { c: 2, lbl: "TT Parcial",   sub: "Até 50%", active: true },
                  { c: 3, lbl: "TT Integral",  sub: "100%" },
                ].map(m => (
                  <label key={m.c} style={{
                    padding: 12,
                    border: m.active ? "2px solid var(--c-primary)" : "1.5px solid var(--c-border-strong)",
                    borderRadius: "var(--r-md)", cursor: "pointer",
                    background: m.active ? "var(--c-primary-soft)" : "white"
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: m.active ? "var(--c-primary)" : "var(--c-ink)" }}>{m.lbl}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>{m.sub}</div>
                  </label>
                ))}
              </div>

              <div className="divider" />
              <div className="field">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked />
                  <span>Enviar e-mail de boas-vindas com link para assinatura do TCR</span>
                </label>
              </div>
            </div>

            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-ghost"><Icon name="x" size={15} /> Cancelar</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost">Salvar como rascunho</button>
                <button className="btn btn-primary"><Icon name="check" size={15} /> Cadastrar e enviar TCR</button>
              </div>
            </div>
          </section>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card" style={{ borderTop: "3px solid var(--c-primary)" }}>
              <div className="kicker" style={{ color: "var(--c-primary)" }}><Icon name="info" size={13} /> Próximos passos</div>
              <ol style={{ paddingLeft: 18, fontSize: 13, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.75 }}>
                <li>Servidor recebe e-mail</li>
                <li>Acessa o sistema e assina o TCR</li>
                <li>Chefia (Carlos) é notificada para criar plano</li>
                <li>Você acompanha o status nos relatórios</li>
              </ol>
            </section>

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Validação automática</h2></div>
              <div className="stack-12">
                {[
                  { ttl: "SIAPE encontrado", ok: true,  sub: "Servidor ativo, lotado em CGTIC" },
                  { ttl: "CPF válido",        ok: true,  sub: "Formato e dígito verificador OK" },
                  { ttl: "E-mail institucional", ok: true, sub: "Domínio gov.br autorizado" },
                  { ttl: "Sem cadastro duplicado", ok: true, sub: "SIAPE 1948372 não existe ainda" },
                ].map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 11, background: "var(--c-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <Icon name="check" size={12} stroke={2.6} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{v.ttl}</div>
                      <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>{v.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ background: "var(--c-info-soft)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Dica</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                Use a opção <strong>Importar do SIAPE</strong> para preencher automaticamente nome, CPF e cargo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  ScreenDetalheAvaliacao, ScreenEmptyState, ScreenErroSync, ScreenCadastrarParticipante,
});
