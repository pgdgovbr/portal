// screens-wizard.jsx — Wizard de criação de Plano de Trabalho (Chefia)
// Mostra step 1 (Participante & período) e step 4 (Contribuições) — os dois
// mais ilustrativos do fluxo.

const CHEFE_W = { name: "Carlos Mendes", role: "Chefia · CGTIC", initials: "CM" };

const WIZARD_STEPS = [
  "Participante & período",
  "Carga horária",
  "Critérios de avaliação",
  "Contribuições",
  "Revisão",
];

// ── Shell genérico do wizard ───────────────────────────────────────────
const WizardShell = ({ children, currentStep, density, screenLabel, participante, headerExtra }) => (
  <div className="pgd-app" data-density={density} data-screen-label={screenLabel}>
    <TopNav role="chefia" active="equipe" alerts={6} user={CHEFE_W} />
    <div className="pg" style={{ maxWidth: 1200 }}>
      <div className="crumb">
        <a href="#">Início</a><span className="sep">/</span>
        <a href="#">Equipe</a><span className="sep">/</span>
        <span>Criar Plano de Trabalho</span>
      </div>

      <div className="pg-head">
        <div>
          <div className="pg-eyebrow">Novo Plano de Trabalho · 2026/1</div>
          <h1 className="pg-title">{participante ? `Plano de Trabalho para ${participante}` : "Criar Plano de Trabalho"}</h1>
          <p className="pg-sub">Etapa {currentStep + 1} de {WIZARD_STEPS.length} · <strong>{WIZARD_STEPS[currentStep]}</strong></p>
        </div>
        {headerExtra}
      </div>

      <div className="card" style={{ padding: "22px 28px", marginBottom: "var(--gap-sec)" }}>
        <Stepper steps={WIZARD_STEPS} current={currentStep} />
      </div>

      {children}
    </div>
  </div>
);

// ── Wizard · Step 1: Participante & período ────────────────────────────
const ScreenWizardStep1 = ({ density }) => (
  <WizardShell
    density={density}
    currentStep={0}
    screenLabel="Wizard · 1 Participante & período"
    headerExtra={
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Rascunho salvo há 8s</span>
        <button className="btn btn-ghost btn-sm"><Icon name="x" size={14} /> Cancelar</button>
      </div>
    }
  >
    <div className="g-2-1">
      <section className="card">
        <div className="card-hd">
          <div>
            <h2>Para quem é este plano?</h2>
            <p>Selecione um servidor com TCR ativo. Apenas servidores sem plano em execução aparecem.</p>
          </div>
        </div>

        <div className="stack-20">
          <div className="field">
            <label>Servidor</label>
            <div style={{ display: "flex", gap: 10, padding: 14, border: "2px solid var(--c-primary)", borderRadius: "var(--r-md)", background: "var(--c-primary-soft)" }}>
              <span className="av av-lg" style={{ background: "var(--c-primary)", color: "white" }}>FR</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "var(--c-ink)", fontSize: 15 }}>Felipe Ribeiro</div>
                <div style={{ fontSize: 12.5, color: "var(--c-muted)" }}>SIAPE 1947382 · Analista de TI · CGTIC</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="bdg bdg-success"><Icon name="check" size={11} stroke={2.5} /> TCR vigente</span>
                  <span className="bdg bdg-neutral">Sem plano ativo</span>
                  <span className="bdg bdg-neutral">Última avaliação: nota 2 (out/2025)</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Trocar</button>
            </div>
            <div className="help">O servidor receberá notificação assim que o plano for aprovado.</div>
          </div>

          <div className="divider" />

          <div className="field">
            <label>Período de vigência do plano</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div className="input-prefix">
                <span className="pf">Início</span>
                <input className="input" defaultValue="01/06/2026" />
              </div>
              <div className="input-prefix">
                <span className="pf">Fim</span>
                <input className="input" defaultValue="30/11/2026" />
              </div>
              <div className="input-prefix">
                <span className="pf">Duração</span>
                <input className="input" defaultValue="6 meses" disabled style={{ background: "var(--c-surface-2)" }} />
              </div>
            </div>
            <div className="help">Máximo de 1 ano por plano. Recomendamos planos semestrais alinhados ao Plano de Entregas.</div>
          </div>

          <div className="field">
            <label>Modalidade de execução</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { c: 1, lbl: "Presencial",        sub: "Sem teletrabalho" },
                { c: 2, lbl: "TT Parcial",        sub: "Até 50% do tempo", active: true },
                { c: 3, lbl: "TT Integral",       sub: "100% do tempo" },
              ].map(m => (
                <label key={m.c} style={{
                  padding: 14,
                  border: m.active ? "2px solid var(--c-primary)" : "1.5px solid var(--c-border-strong)",
                  borderRadius: "var(--r-md)", cursor: "pointer",
                  background: m.active ? "var(--c-primary-soft)" : "white"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: m.active ? "var(--c-primary)" : "var(--c-ink)" }}>{m.lbl}</div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>{m.sub}</div>
                </label>
              ))}
            </div>
            <div className="help">Para modalidades de exterior, use o seletor completo.</div>
          </div>

          <div className="field">
            <label>Vincular ao Plano de Entregas</label>
            <select className="select" defaultValue="mod">
              <option value="mod">Modernização do parque tecnológico 2026 · CGTIC</option>
              <option>Adesão obrigatória ao Gov.br ID · transversal</option>
              <option>Nenhum (plano sem vínculo a entregas)</option>
            </select>
            <div className="help">As contribuições do tipo 1 só poderão ser vinculadas a entregas deste plano.</div>
          </div>
        </div>

        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-ghost" disabled style={{ opacity: .4 }}><Icon name="arrowL" size={16} /> Voltar</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost">Salvar e sair</button>
            <button className="btn btn-primary">Próximo: Carga horária <Icon name="arrowR" size={16} /></button>
          </div>
        </div>
      </section>

      {/* Side */}
      <div className="col" style={{ gap: "var(--gap-sec)" }}>
        <section className="card">
          <div className="card-hd"><h2 style={{ fontSize: 16 }}>Resumo do plano</h2></div>
          <div className="stack-12">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--c-muted)" }}>Servidor</span><strong>Felipe Ribeiro</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--c-muted)" }}>Período</span><strong>jun → nov 2026</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--c-muted)" }}>Duração</span><strong>6 meses</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--c-muted)" }}>Modalidade</span><strong>TT Parcial</strong>
            </div>
            <div className="divider" />
            <div style={{ fontSize: 12, color: "var(--c-muted)", textAlign: "center" }}>
              Próximas etapas: Carga horária · Critérios · Contribuições · Revisão
            </div>
          </div>
        </section>

        <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
          <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Dica</div>
          <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
            Planos mais curtos (3 meses) facilitam ajustes, mas exigem mais ciclos avaliativos.
            Planos de 6 meses são o padrão recomendado pelo MGI.
          </p>
        </section>

        <section className="card" style={{ background: "var(--c-surface-2)" }}>
          <div className="kicker">Servidores aguardando plano (3)</div>
          <div className="stack-12" style={{ marginTop: 10 }}>
            {[
              { n: "Felipe Ribeiro", ok: true },
              { n: "Mariana Castro", ok: false, why: "TCR vencido" },
              { n: "André Pinheiro", ok: false, why: "afastado" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
                <span className="av av-sm" style={{ background: s.ok ? "var(--c-primary)" : "var(--c-muted-2)", color: "white" }}>{initialsOf(s.n)}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{s.n}</span>
                {s.ok
                  ? <span className="bdg bdg-success" style={{ fontSize: 10.5 }}>Pronto</span>
                  : <span className="bdg bdg-neutral" style={{ fontSize: 10.5 }}>{s.why}</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </WizardShell>
);

// ── Wizard · Step 4: Contribuições (a etapa mais rica) ─────────────────
const ScreenWizardStep4 = ({ density }) => {
  const contribs = [
    { t: 1, ttl: "Implementação do módulo de cadastro PGD",     entrega: "Renovação do portal CGTIC", pct: 40, c: "var(--c-primary)" },
    { t: 1, ttl: "Migração de banco de dados para PG16",        entrega: "Modernização da camada de dados", pct: 25, c: "var(--c-primary)" },
    { t: 2, ttl: "Sustentação e atendimento de chamados",       entrega: null,                          pct: 20, c: "var(--c-success)" },
    { t: 3, ttl: "Apoio à CGRH na adoção do SSO unificado",     entrega: "Unificação de identidades · CGRH", pct: 10, c: "var(--c-status-aval)" },
  ];
  const total = contribs.reduce((a, c) => a + c.pct, 0);
  const restante = 100 - total;

  return (
    <WizardShell
      density={density}
      currentStep={3}
      screenLabel="Wizard · 4 Contribuições"
      participante="Felipe Ribeiro"
      headerExtra={
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Rascunho salvo há 4s</span>
          <button className="btn btn-ghost btn-sm"><Icon name="x" size={14} /> Cancelar</button>
        </div>
      }
    >
      {/* Total bar — destaque do step */}
      <section className="card" style={{ padding: 22, marginBottom: "var(--gap-sec)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div className="kicker">Alocação da carga horária</div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 36, letterSpacing: "-0.02em", marginTop: 4 }}>
              <span style={{ color: total === 100 ? "var(--c-success)" : "var(--c-warning)" }}>{total}%</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--c-muted)", marginLeft: 8 }}>de 100%</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            {total === 100
              ? <span className="bdg bdg-success"><Icon name="check" size={12} stroke={2.6} /> Plano completo</span>
              : <span className="bdg bdg-warning"><span className="dot" />Falta alocar {restante}%</span>}
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>{contribs.length} contribuições · {contribs.filter(c => c.t === 1).length} vinculadas a entregas</div>
          </div>
        </div>
        {/* Stacked bar */}
        <div style={{ display: "flex", height: 14, borderRadius: 8, overflow: "hidden", background: "var(--c-bg-deep)" }}>
          {contribs.map((c, i) => (
            <div key={i} style={{ width: `${c.pct}%`, background: c.c, borderRight: "2px solid white" }} title={`${c.pct}% · ${c.ttl}`} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 12, color: "var(--c-muted)", flexWrap: "wrap" }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--c-primary)", marginRight: 6 }} />Tipo 1 · Entrega da unidade</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--c-success)", marginRight: 6 }} />Tipo 2 · Não vinculada</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--c-status-aval)", marginRight: 6 }} />Tipo 3 · Entrega de outra unidade</span>
        </div>
      </section>

      <div className="g-2-1">
        {/* Lista de contribuições */}
        <section className="card">
          <div className="card-hd">
            <div>
              <h2>Contribuições adicionadas</h2>
              <p>Ordenar por arrastar. Soma deve ser exatamente 100% para avançar.</p>
            </div>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={14} /> Adicionar contribuição</button>
          </div>

          <div className="stack-12">
            {contribs.map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: 16,
                border: "1px solid var(--c-border)",
                borderRadius: "var(--r-md)", background: "white",
                position: "relative"
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2, color: "var(--c-muted-2)" }}>
                  <Icon name="dots" size={14} />
                  <Icon name="dots" size={14} />
                </div>
                <span className={`contrib-tipo t${c.t}`} style={{ marginTop: 1 }}>{c.t}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 14.5 }}>{c.ttl}</div>
                  <div className="contrib-meta">
                    {c.entrega
                      ? <>Vinculada à entrega <strong style={{ color: "var(--c-ink-2)" }}>«{c.entrega}»</strong></>
                      : "Atividade não vinculada a entrega"}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="bar thin" style={{ flex: 1, maxWidth: 200 }}>
                      <i style={{ width: `${c.pct}%`, background: c.c }} />
                    </div>
                    <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13 }}>{c.pct}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="edit" size={14} /></button>
                  <button className="tn-iconbtn" style={{ width: 32, height: 32, color: "var(--c-danger)" }}><Icon name="x" size={14} /></button>
                </div>
              </div>
            ))}

            {/* Add card prompt */}
            <button style={{
              padding: 16,
              border: "1.5px dashed var(--c-border-strong)",
              borderRadius: "var(--r-md)",
              background: "transparent",
              color: "var(--c-muted)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 13.5, fontWeight: 600,
            }}>
              <Icon name="plus" size={16} /> Adicionar contribuição ({restante}% restante)
            </button>
          </div>

          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar: Critérios</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost">Salvar e sair</button>
              <button className="btn btn-primary" disabled={total !== 100} style={total !== 100 ? { opacity: .5, cursor: "not-allowed" } : null}>
                Próximo: Revisão <Icon name="arrowR" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Side: form de nova contribuição + dica */}
        <div className="col" style={{ gap: "var(--gap-sec)" }}>
          <section className="card" style={{ borderTop: "3px solid var(--c-primary)" }}>
            <div className="card-hd">
              <div>
                <h2 style={{ fontSize: 17 }}>Nova contribuição</h2>
                <p>Preencha e clique adicionar.</p>
              </div>
            </div>
            <div className="stack-16">
              <div className="field">
                <label>Tipo</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { t: 1, lbl: "Vinculada a entrega da unidade" },
                    { t: 2, lbl: "Não vinculada", active: true },
                    { t: 3, lbl: "Vinculada a outra unidade" },
                  ].map(it => (
                    <label key={it.t} style={{
                      padding: "10px 8px", textAlign: "center",
                      border: it.active ? "2px solid var(--c-primary)" : "1.5px solid var(--c-border-strong)",
                      borderRadius: "var(--r-sm)", cursor: "pointer",
                      background: it.active ? "var(--c-primary-soft)" : "white"
                    }}>
                      <div className={`contrib-tipo t${it.t}`} style={{ margin: "0 auto 6px", width: 26, height: 26, fontSize: 12 }}>{it.t}</div>
                      <div style={{ fontSize: 11, color: "var(--c-ink-2)", lineHeight: 1.3 }}>{it.lbl}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Descrição</label>
                <textarea className="textarea" style={{ minHeight: 80 }} placeholder="Ex: Mentoria de novos servidores em práticas de DevOps..." defaultValue="Mentoria semanal de novos servidores da CGTIC" />
              </div>

              <div className="field">
                <label>% da carga horária</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="range" min="0" max={restante || 100} defaultValue={Math.min(5, restante)} style={{ flex: 1, accentColor: "var(--c-primary)" }} />
                  <div className="input-prefix" style={{ width: 90 }}>
                    <input className="input" defaultValue="5" style={{ textAlign: "right", padding: 8 }} />
                    <span className="pf" style={{ borderLeft: 0, borderRight: "1px solid var(--c-border-strong)", borderRadius: "0 var(--r-sm) var(--r-sm) 0" }}>%</span>
                  </div>
                </div>
                <div className="help">Disponível: {restante}% · usar tudo deixa o plano completo.</div>
              </div>

              <button className="btn btn-primary" style={{ width: "100%" }}><Icon name="plus" size={14} /> Adicionar</button>
            </div>
          </section>

          <section className="card" style={{ background: "var(--c-info-soft)" }}>
            <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Regras do MGI</div>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
              <li>Ao menos 1 contribuição é obrigatória</li>
              <li>Soma deve ser <strong>exatamente 100%</strong></li>
              <li>Contribuições do tipo 1 precisam de entrega vinculada</li>
              <li>Tipo 2 é livre — capacitação, gestão, etc.</li>
            </ul>
          </section>
        </div>
      </div>
    </WizardShell>
  );
};

// ── Wizard · Step 2: Carga horária ─────────────────────────────────────
const ScreenWizardStep2 = ({ density }) => (
  <WizardShell
    density={density}
    currentStep={1}
    screenLabel="Wizard · 2 Carga horária"
    participante="Felipe Ribeiro"
    headerExtra={<span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Rascunho salvo há 6s</span>}
  >
    <div className="g-2-1">
      <section className="card">
        <div className="card-hd">
          <div>
            <h2>Carga horária disponível para o plano</h2>
            <p>Informe a carga semanal e ocorrências previsíveis (férias, eventos institucionais).</p>
          </div>
        </div>

        <div className="stack-20">
          <div className="field">
            <label>Carga horária semanal</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[20, 30, 40, "Outra"].map((h, i) => (
                <label key={i} style={{
                  padding: 18, textAlign: "center",
                  border: h === 40 ? "2px solid var(--c-primary)" : "1.5px solid var(--c-border-strong)",
                  borderRadius: "var(--r-md)", cursor: "pointer",
                  background: h === 40 ? "var(--c-primary-soft)" : "white"
                }}>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 26, color: h === 40 ? "var(--c-primary)" : "var(--c-ink)" }}>
                    {typeof h === "number" ? h : "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 4 }}>{typeof h === "number" ? "horas/semana" : h}</div>
                </label>
              ))}
            </div>
            <div className="help">Carga padrão do cargo de Felipe: 40h. Reduções exigem fundamentação legal.</div>
          </div>

          <div className="field">
            <label>Total estimado no plano</label>
            <div style={{ padding: 16, background: "var(--c-surface-2)", borderRadius: "var(--r-md)", border: "1px solid var(--c-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--c-muted)" }}>26 semanas × 40h</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 32, color: "var(--c-ink)", letterSpacing: "-0.02em", marginTop: 4 }}>1.040 horas</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "var(--c-muted)", lineHeight: 1.5 }}>
                  – 80h férias previstas<br />
                  – 16h eventos<br />
                  <strong style={{ color: "var(--c-ink)" }}>= 944h efetivas</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Ocorrências previstas no período</label>
            <div className="stack-12">
              <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "var(--c-surface-2)", borderRadius: "var(--r-sm)" }}>
                <Icon name="calendar" size={16} className="" />
                <span style={{ flex: 1, fontSize: 13.5 }}><strong>Férias</strong> · 15 dias úteis · 14/jul – 02/ago</span>
                <button className="tn-iconbtn" style={{ width: 28, height: 28 }}><Icon name="x" size={13} /></button>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "var(--c-surface-2)", borderRadius: "var(--r-sm)" }}>
                <Icon name="calendar" size={16} className="" />
                <span style={{ flex: 1, fontSize: 13.5 }}><strong>Congresso CONIP</strong> · 2 dias · 12–13/set</span>
                <button className="tn-iconbtn" style={{ width: 28, height: 28 }}><Icon name="x" size={13} /></button>
              </div>
              <button style={{ padding: 10, border: "1.5px dashed var(--c-border-strong)", borderRadius: "var(--r-sm)", background: "transparent", color: "var(--c-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                + Adicionar ocorrência prevista
              </button>
            </div>
          </div>
        </div>

        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost">Salvar e sair</button>
            <button className="btn btn-primary">Próximo: Critérios <Icon name="arrowR" size={16} /></button>
          </div>
        </div>
      </section>

      <div className="col" style={{ gap: "var(--gap-sec)" }}>
        <section className="card">
          <div className="card-hd"><h2 style={{ fontSize: 16 }}>Resumo do plano</h2></div>
          <div className="stack-12">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Servidor</span><strong>Felipe Ribeiro</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Período</span><strong>jun → nov 2026</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Modalidade</span><strong>TT Parcial</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Carga</span><strong>40 h/sem</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Total efetivo</span><strong>944 h</strong></div>
          </div>
        </section>
        <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
          <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Dica</div>
          <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
            Ocorrências previstas ajudam o servidor a justificar variações de produtividade durante o período.
          </p>
        </section>
      </div>
    </div>
  </WizardShell>
);

// ── Wizard · Step 3: Critérios de avaliação ────────────────────────────
const ScreenWizardStep3 = ({ density }) => {
  const [crits, setCrits] = React.useState([
    "Cumprimento de prazos das entregas vinculadas",
    "Qualidade técnica da documentação produzida",
    "Comunicação efetiva com áreas envolvidas",
    "Iniciativa em proposição de melhorias",
  ]);
  const TEMPLATES = [
    { ttl: "Equipe técnica (TI)",  itens: ["Cumprimento de prazos", "Qualidade da documentação", "Aderência a padrões técnicos", "Colaboração com pares"] },
    { ttl: "Equipe administrativa", itens: ["Pontualidade de entregas", "Atenção a detalhes em relatórios", "Capacidade de priorização"] },
    { ttl: "Liderança / coordenação", itens: ["Articulação interna", "Acompanhamento da equipe", "Comunicação institucional", "Tomada de decisão"] },
  ];

  return (
    <WizardShell
      density={density}
      currentStep={2}
      screenLabel="Wizard · 3 Critérios de avaliação"
      participante="Felipe Ribeiro"
      headerExtra={<span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Rascunho salvo há 3s</span>}
    >
      <div className="g-2-1">
        <section className="card">
          <div className="card-hd">
            <div>
              <h2>Como Felipe será avaliado?</h2>
              <p>Defina critérios objetivos que orientam as notas mensais. Você poderá ajustar mais tarde.</p>
            </div>
            <button className="btn btn-soft btn-sm"><Icon name="plus" size={13} /> Critério customizado</button>
          </div>

          <div className="stack-12">
            {crits.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", border: "1px solid var(--c-border)", borderRadius: "var(--r-md)", background: "white" }}>
                <span className="numdot">{i + 1}</span>
                <input
                  className="input"
                  defaultValue={c}
                  style={{ flex: 1, border: 0, padding: 0, fontSize: 14, background: "transparent", boxShadow: "none" }}
                />
                <button className="tn-iconbtn" style={{ width: 32, height: 32, color: "var(--c-danger)" }}><Icon name="x" size={14} /></button>
              </div>
            ))}
          </div>

          <div className="divider" />
          <div style={{ fontSize: 12.5, color: "var(--c-muted)" }}>
            <strong style={{ color: "var(--c-ink)" }}>{crits.length}</strong> critérios definidos · recomendado entre 3 e 6 para evitar avaliação subjetiva.
          </div>

          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost">Salvar e sair</button>
              <button className="btn btn-primary">Próximo: Contribuições <Icon name="arrowR" size={16} /></button>
            </div>
          </div>
        </section>

        <div className="col" style={{ gap: "var(--gap-sec)" }}>
          <section className="card">
            <div className="card-hd"><h2 style={{ fontSize: 16 }}>Modelos prontos</h2></div>
            <p style={{ fontSize: 12.5, color: "var(--c-muted)", margin: "-6px 0 12px" }}>Substitui os critérios atuais. Personalize depois.</p>
            <div className="stack-12">
              {TEMPLATES.map((tpl, i) => (
                <button key={i} style={{
                  textAlign: "left", padding: 12, border: "1px solid var(--c-border)",
                  borderRadius: "var(--r-sm)", background: i === 0 ? "var(--c-primary-soft)" : "white",
                  cursor: "pointer", width: "100%"
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-ink)" }}>{tpl.ttl}</div>
                  <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>{tpl.itens.length} critérios</div>
                </button>
              ))}
            </div>
          </section>

          <section className="card" style={{ background: "var(--c-info-soft)" }}>
            <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Boas práticas</div>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
              <li>Critérios devem ser <strong>verificáveis</strong> (datas, números, entregas)</li>
              <li>Evite linguagem subjetiva ("ser proativo", "ter postura")</li>
              <li>O servidor verá esses critérios e pode usá-los em recurso</li>
            </ul>
          </section>
        </div>
      </div>
    </WizardShell>
  );
};

// ── Wizard · Step 5: Revisão e envio ───────────────────────────────────
const ScreenWizardStep5 = ({ density }) => (
  <WizardShell
    density={density}
    currentStep={4}
    screenLabel="Wizard · 5 Revisão e envio"
    participante="Felipe Ribeiro"
    headerExtra={<span className="bdg bdg-success"><Icon name="check" size={11} stroke={2.6} /> Pronto para envio</span>}
  >
    <div className="g-2-1">
      <section className="card">
        <div className="card-hd">
          <div>
            <h2>Revisão do plano</h2>
            <p>Confira cada etapa antes de enviar para aprovação. Você ainda pode voltar e ajustar.</p>
          </div>
        </div>

        {[
          {
            ttl: "Participante & período",
            step: 0,
            rows: [
              ["Servidor", "Felipe Ribeiro · SIAPE 1947382"],
              ["Cargo", "Analista de TI · CGTIC"],
              ["Período", "01 jun 2026 → 30 nov 2026 (6 meses)"],
              ["Modalidade", "Teletrabalho Parcial"],
              ["Plano de Entregas", "Modernização do parque tecnológico 2026 · CGTIC"],
            ]
          },
          {
            ttl: "Carga horária",
            step: 1,
            rows: [
              ["Carga semanal", "40 horas"],
              ["Total efetivo", "944 horas (descontadas férias e eventos)"],
              ["Ocorrências previstas", "2 (férias 14/jul–02/ago · CONIP 12–13/set)"],
            ]
          },
          {
            ttl: "Critérios de avaliação",
            step: 2,
            rows: [
              ["Critério 1", "Cumprimento de prazos das entregas vinculadas"],
              ["Critério 2", "Qualidade técnica da documentação produzida"],
              ["Critério 3", "Comunicação efetiva com áreas envolvidas"],
              ["Critério 4", "Iniciativa em proposição de melhorias"],
            ]
          },
        ].map((sec, i) => (
          <div key={i} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="numdot done">{sec.step + 1}</span>
                <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 16, fontWeight: 700, margin: 0, color: "var(--c-ink)" }}>{sec.ttl}</h3>
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /> Editar</button>
            </div>
            <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-md)", padding: "4px 14px", border: "1px solid var(--c-border)" }}>
              {sec.rows.map((r, j) => (
                <div key={j} style={{ display: "flex", padding: "10px 0", borderBottom: j < sec.rows.length - 1 ? "1px solid var(--c-divider)" : "0", gap: 16 }}>
                  <span style={{ fontSize: 12.5, color: "var(--c-muted)", width: 180, flex: "none" }}>{r[0]}</span>
                  <span style={{ fontSize: 13.5, color: "var(--c-ink)", fontWeight: 500 }}>{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contribuições destaque */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="numdot done">4</span>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 16, fontWeight: 700, margin: 0, color: "var(--c-ink)" }}>Contribuições</h3>
              <span className="bdg bdg-success" style={{ marginLeft: 6 }}><Icon name="check" size={11} stroke={2.5} /> 100%</span>
            </div>
            <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /> Editar</button>
          </div>
          <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-md)", padding: 6, border: "1px solid var(--c-border)" }}>
            {[
              { t: 1, ttl: "Implementação do módulo de cadastro PGD", pct: 40 },
              { t: 1, ttl: "Migração de banco de dados para PG16", pct: 25 },
              { t: 2, ttl: "Sustentação e atendimento de chamados", pct: 20 },
              { t: 3, ttl: "Apoio à CGRH na adoção do SSO unificado", pct: 10 },
              { t: 2, ttl: "Mentoria semanal de novos servidores", pct: 5 },
            ].map((c, i) => (
              <div key={i} className="contrib" style={{ padding: "10px 8px" }}>
                <span className={`contrib-tipo t${c.t}`} style={{ width: 26, height: 26, fontSize: 12 }}>{c.t}</span>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{c.ttl}</div>
                <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 14 }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost">Salvar como rascunho</button>
            <button className="btn btn-primary btn-lg"><Icon name="paperPlane" size={15} /> Enviar para aprovação</button>
          </div>
        </div>
      </section>

      <div className="col" style={{ gap: "var(--gap-sec)" }}>
        <section className="card" style={{ borderTop: "3px solid var(--c-success)" }}>
          <div className="kicker" style={{ color: "var(--c-success)" }}><Icon name="check" size={13} /> O que acontece agora</div>
          <ol style={{ paddingLeft: 18, marginTop: 12, fontSize: 13, color: "var(--c-ink-2)", lineHeight: 1.7 }}>
            <li>O plano segue para a autoridade superior (Diretoria)</li>
            <li>Após aprovação, Felipe é notificado e assina ciência</li>
            <li>O plano inicia execução em <strong>01 jun 2026</strong></li>
            <li>Felipe registra execução mensalmente até dia 10 do mês seguinte</li>
            <li>Você avalia cada registro em até 20 dias</li>
          </ol>
        </section>

        <section className="card">
          <div className="card-hd"><h2 style={{ fontSize: 16 }}>Próximas avaliações previstas</h2></div>
          <div className="stack-12">
            {[
              { p: "Jun 2026", d: "até 10 jul · você avalia até 30 jul" },
              { p: "Jul 2026", d: "até 10 ago · com férias" },
              { p: "Ago 2026", d: "até 10 set" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
                <strong>{p.p}</strong>
                <span style={{ color: "var(--c-muted)" }}>{p.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ background: "var(--c-info-soft)" }}>
          <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Lembrete</div>
          <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
            Após o envio, edições exigem nova aprovação da autoridade superior.
          </p>
        </section>
      </div>
    </div>
  </WizardShell>
);

Object.assign(window, { ScreenWizardStep1, ScreenWizardStep2, ScreenWizardStep3, ScreenWizardStep4, ScreenWizardStep5 });
