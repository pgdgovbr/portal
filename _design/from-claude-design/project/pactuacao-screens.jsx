// pactuacao-screens.jsx — Telas do workflow de pactuação bilateral (desktop)
// - MeuPlanoVazio (CTA criar/clonar)
// - MeuPlanoCriar (wizard simplificado)
// - MeuPlanoEditar (tela única + OwnershipBanner)
// - MeuPlanoRevisar (modo decisão: AssinaturaCard)
// - EquipeListaComBadges (mudança em /equipe)
// - PlanoTrabalhoChefiaRevisar (chefia recebendo PT do servidor)

const USR_SRV = { name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" };
const USR_CHF = { name: "Carlos Mendes",     role: "Chefia · CGTIC",       initials: "CM" };

// Dados de uma "edição timeline" típica
const TIMELINE_EXEMPLO = [
  { tipo: "criou",    papel: "servidor", autor: "Nitai",  quando: "10 mai · 09:14",
    descricao: "(clonou do plano PT-2025-08-001)" },
  { tipo: "editou",   papel: "servidor", autor: "Nitai",  quando: "10 mai · 10:22",
    diff: [
      { campo: "Carga horária semanal", de: "40 horas", para: "30 horas" },
      { campo: "Contribuição 1 · percentual", de: "30%", para: "35%" },
    ] },
  { tipo: "editou",   papel: "servidor", autor: "Nitai",  quando: "11 mai · 14:08",
    diff: [
      { campo: "Critério 4", de: "Comunicação institucional", para: "Comunicação efetiva com áreas envolvidas" },
    ] },
  { tipo: "assinou",  papel: "servidor", autor: "Nitai",  quando: "12 mai · 16:30",
    descricao: "como servidor" },
  { tipo: "enviou",   papel: "servidor", autor: "Nitai",  quando: "12 mai · 16:30",
    descricao: "para Carlos Mendes (chefia)" },
];

// ═══════════════════════════════════════════════════════════════════════
// /meu-plano — estado vazio + CTA criar / clonar
// ═══════════════════════════════════════════════════════════════════════
const ScreenMeuPlanoVazio = ({ density, withDialog }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Meu Plano · vazio (criar/clonar)" style={{ position: "relative", minHeight: 980 }}>
      <TopNav role="servidor" active="plano" alerts={1} user={USR_SRV} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span><span>Meu Plano de Trabalho</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Meu Plano de Trabalho</div>
            <h1 className="pg-title">Sem plano em vigência</h1>
            <p className="pg-sub">Crie seu próximo plano. Você descreve as contribuições; sua chefia revisa e assina.</p>
          </div>
        </div>

        <div className="g-2-1">
          {/* CTAs principais */}
          <section className="card" style={{ padding: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--c-primary-soft)", color: "var(--c-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name="handshake" size={36} stroke={1.4} />
              </div>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, margin: "4px 0 6px", letterSpacing: "-0.01em" }}>
                Como você quer começar?
              </h2>
              <p style={{ color: "var(--c-muted)", fontSize: 14, maxWidth: "44ch", margin: "0 auto", lineHeight: 1.55 }}>
                Você pode partir do zero ou aproveitar um plano antigo. Em qualquer caso, sua chefia precisa concordar antes de o plano entrar em vigor.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Criar do zero */}
              <a href="#" style={{
                display: "block", padding: 22,
                border: "2px solid var(--c-primary)",
                background: "var(--c-primary-soft)",
                borderRadius: "var(--r-md)",
                textDecoration: "none", color: "inherit",
                transition: "transform .12s",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: "var(--c-primary)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <Icon name="plus" size={20} stroke={2.2} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>Criar plano do zero</div>
                    <div style={{ fontSize: 12, color: "var(--c-primary)", fontWeight: 600, marginTop: 2 }}>Recomendado para o primeiro plano</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>
                  Wizard guiado em 5 etapas: período, modalidade, carga horária, critérios e contribuições.
                </p>
                <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--c-primary)", fontWeight: 700 }}>
                  Começar <Icon name="arrowR" size={14} />
                </div>
              </a>

              {/* Clonar plano antigo */}
              <a href="#" style={{
                display: "block", padding: 22,
                border: "1.5px solid var(--c-border-strong)",
                background: "white",
                borderRadius: "var(--r-md)",
                textDecoration: "none", color: "inherit",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: "#EFE8F7", color: "var(--c-status-aval)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <Icon name="file" size={20} stroke={1.8} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--c-ink)" }}>Clonar plano anterior</div>
                    <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>Se as atividades mudaram pouco</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>
                  Reaproveita contribuições, critérios e modalidade. Você só ajusta datas e detalhes.
                </p>

                <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--c-surface-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)" }}>
                  <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Disponível</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>PT-2025-08 · 1º sem/2025</div>
                  <div style={{ fontSize: 11.5, color: "var(--c-muted)", marginTop: 2 }}>4 contribuições · concluído com nota média 2</div>
                </div>
              </a>
            </div>

            <div className="divider" />

            <div style={{
              padding: "12px 14px", background: "var(--c-info-soft)",
              borderRadius: "var(--r-sm)", display: "flex", gap: 10, alignItems: "flex-start"
            }}>
              <Icon name="info" size={16} className="" />
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.5 }}>
                <strong>Importante:</strong> a pactuação é bilateral (Dec. 11.072/2022 art. 11). Seu plano só entra em execução após você e sua chefia assinarem a mesma versão.
              </p>
            </div>
          </section>

          {/* Aside — histórico + ajuda */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Planos anteriores</h2></div>
              <div className="stack-12">
                {[
                  { id: "PT-2025-08", per: "ago 2025 → jan 2026", status: "CONCLUIDO", media: 2 },
                  { id: "PT-2025-01", per: "fev 2025 → jul 2025",  status: "AVALIADO",  media: 3 },
                  { id: "PT-2024-08", per: "ago 2024 → jan 2025",  status: "AVALIADO",  media: 3 },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", background: "var(--c-surface-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--ff-mono)", fontWeight: 600, fontSize: 12 }}>{p.id}</div>
                      <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>{p.per}</div>
                    </div>
                    <StatusBadgeV2 status={p.status} size="sm" />
                    <button className="tn-iconbtn" style={{ width: 28, height: 28 }} title="Clonar"><Icon name="file" size={13} /></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> Como funciona</div>
              <ol style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
                <li>Você cria o plano (rascunho)</li>
                <li>Edita à vontade — auto-save</li>
                <li>Assina e envia para sua chefia</li>
                <li>Chefia revisa: assina ou pede ajuste</li>
                <li>Quando os dois assinam, o plano vira <strong>Em execução</strong></li>
              </ol>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="info" size={13} /> Casos especiais</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                Em situações excepcionais — recém-chegado ao órgão, ausência prolongada — sua chefia pode criar o plano por você. Nesse caso, você só precisa revisar e assinar.
              </p>
            </section>
          </div>
        </div>
      </div>

      {withDialog && <CloneDialog plano="PT-2025-08 · 1º sem/2025" onCancel={() => {}} onClone={() => {}} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// /meu-plano/criar — wizard simplificado pro servidor (step 4 mostrado)
// Reaproveita o stepper. Adiciona tooltips contextuais.
// ═══════════════════════════════════════════════════════════════════════
const ScreenMeuPlanoCriar = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Criar plano · servidor (step 4)">
      <TopNav role="servidor" active="plano" alerts={1} user={USR_SRV} />
      <div className="pg" style={{ maxWidth: 1180 }}>
        <div className="crumb">
          <a href="#">Início</a><span className="sep">/</span>
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <span>Criar plano</span>
        </div>

        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Criando seu plano · 2026/2</div>
            <h1 className="pg-title">Como você vai contribuir?</h1>
            <p className="pg-sub">Liste atividades concretas que somam 100% da sua carga. Sua chefia revisa antes de o plano entrar em vigor.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Rascunho salvo há 8s</span>
            <button className="btn btn-ghost btn-sm"><Icon name="x" size={14} /> Sair</button>
          </div>
        </div>

        <div className="card" style={{ padding: "22px 28px", marginBottom: "var(--gap-sec)" }}>
          <Stepper steps={["Período", "Modalidade & carga", "Critérios", "Contribuições", "Revisão"]} current={3} />
        </div>

        {/* Banner explicativo · só visível na primeira criação */}
        <div style={{
          background: "var(--c-info-soft)",
          borderRadius: "var(--r-md)",
          padding: "12px 16px",
          marginBottom: "var(--gap-sec)",
          display: "flex", gap: 12, alignItems: "flex-start",
          border: "1px solid var(--c-info)22",
        }}>
          <Icon name="info" size={18} className="" />
          <div style={{ flex: 1, fontSize: 13, color: "var(--c-primary-ink)", lineHeight: 1.55 }}>
            <strong>Dica:</strong> contribuições do <strong>tipo 1</strong> precisam estar vinculadas a entregas do plano da sua unidade — pergunte à sua chefia se tiver dúvida. <strong>Tipo 2</strong> é livre (capacitação, gestão); <strong>tipo 3</strong> apoia entregas de outras unidades.
            <a href="#" style={{ color: "var(--c-primary)", marginLeft: 6, fontWeight: 600 }}>Saiba mais</a>
          </div>
          <button className="tn-iconbtn" style={{ width: 24, height: 24 }}><Icon name="x" size={12} /></button>
        </div>

        <div className="g-2-1">
          <section className="card">
            <div className="card-hd">
              <div>
                <h2>Suas contribuições</h2>
                <p>2 adicionadas · soma 60% · faltam 40% para fechar</p>
              </div>
              <button className="btn btn-primary btn-sm"><Icon name="plus" size={14} /> Adicionar</button>
            </div>

            <div style={{ padding: 18, background: "var(--c-warning-soft)", borderRadius: "var(--r-md)", border: "1px solid var(--c-warning)33", marginBottom: 18, display: "flex", gap: 18, alignItems: "center" }}>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 32, color: "var(--c-warning)", lineHeight: 1, letterSpacing: "-0.02em" }}>60%</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-warning)", textTransform: "uppercase", letterSpacing: ".06em" }}>de 100%</div>
                <div style={{ height: 6, background: "white", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ width: "60%", height: "100%", background: "var(--c-warning)" }} />
                </div>
              </div>
            </div>

            <div className="stack-12">
              {[
                { t: 1, ttl: "Implementação do módulo de cadastro PGD", entrega: "Renovação do portal CGTIC", pct: 40 },
                { t: 2, ttl: "Sustentação de sistemas legados",         entrega: null,                          pct: 20 },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 16, border: "1px solid var(--c-border)", borderRadius: "var(--r-md)", background: "white" }}>
                  <span className={`contrib-tipo t${c.t}`}>{c.t}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--c-ink)" }}>{c.ttl}</div>
                    <div className="contrib-meta">
                      {c.entrega ? <>Vinculada à entrega <strong style={{ color: "var(--c-ink-2)" }}>«{c.entrega}»</strong></> : "Atividade não vinculada a entrega"}
                    </div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="bar thin" style={{ flex: 1, maxWidth: 220 }}><i style={{ width: `${c.pct}%` }} /></div>
                      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13 }}>{c.pct}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32 }}><Icon name="edit" size={14} /></button>
                    <button className="tn-iconbtn" style={{ width: 32, height: 32, color: "var(--c-danger)" }}><Icon name="x" size={14} /></button>
                  </div>
                </div>
              ))}
              <button style={{
                padding: 16, border: "1.5px dashed var(--c-border-strong)",
                borderRadius: "var(--r-md)", background: "transparent", color: "var(--c-muted)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontSize: 13.5, fontWeight: 600,
              }}>
                <Icon name="plus" size={16} /> Adicionar contribuição (40% restante)
              </button>
            </div>

            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-ghost"><Icon name="arrowL" size={16} /> Voltar</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost">Salvar e sair</button>
                <button className="btn btn-primary" disabled style={{ opacity: .5 }}>Próximo: Revisão <Icon name="arrowR" size={16} /></button>
              </div>
            </div>
          </section>

          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Resumo</h2></div>
              <div className="stack-12">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Período</span><strong>ago/2026 → jan/2027</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Modalidade</span><strong>TT Integral</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Carga semanal</span><strong>30 h</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Critérios</span><strong>4</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--c-muted)" }}>Chefia</span><strong>Carlos Mendes</strong></div>
              </div>
            </section>

            <section className="card" style={{ borderLeft: "3px solid var(--c-info)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> O que é "% da carga"?</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.55 }}>
                A soma das contribuições deve cobrir 100% da sua carga semanal. Se você tem 30h/sem, uma contribuição de 40% representa 12h dedicadas àquela atividade.
              </p>
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker">Não sabe o que listar?</div>
              <p style={{ fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 12px", lineHeight: 1.55 }}>
                Veja as <a href="#" style={{ color: "var(--c-primary)", fontWeight: 600 }}>entregas do plano da CGTIC</a> ou converse com {USR_CHF.name}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// /meu-plano/[id]/editar — tela única com OwnershipBanner (servidor edita)
// Bola comigo (editor).
// ═══════════════════════════════════════════════════════════════════════
const ScreenMeuPlanoEditar = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Meu Plano · editar (rascunho servidor)">
      <TopNav role="servidor" active="plano" alerts={1} user={USR_SRV} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <span>PT-2026-08 · rascunho</span>
        </div>

        <div className="pg-head">
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
              <StatusBadgeV2 status="RASCUNHO_PARTICIPANTE" />
              <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Auto-salvo há 4s</span>
            </div>
            <h1 className="pg-title">Plano de Trabalho 2026/2</h1>
            <p className="pg-sub">PT-2026-08 · ago 2026 → jan 2027 · ainda não enviado</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> Exportar PDF</button>
            <button className="tn-iconbtn"><Icon name="dots" size={16} /></button>
          </div>
        </div>

        <OwnershipBanner variant="comigo-editor" atorOutro="Carlos Mendes (chefia)" />

        <div className="g-2-1">
          {/* Form em seções */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd">
                <h2>1. Período & vínculo</h2>
                <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div className="field"><label>Início</label><input className="input" defaultValue="01/08/2026" /></div>
                <div className="field"><label>Fim</label><input className="input" defaultValue="31/01/2027" /></div>
                <div className="field"><label>Plano de Entregas</label><select className="select"><option>Modernização CGTIC 2026</option></select></div>
              </div>
            </section>

            <section className="card">
              <div className="card-hd"><h2>2. Modalidade & carga</h2></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { c: 1, lbl: "Presencial" },
                  { c: 2, lbl: "TT Parcial" },
                  { c: 3, lbl: "TT Integral", active: true },
                ].map(m => (
                  <label key={m.c} style={{
                    padding: 14, textAlign: "center",
                    border: m.active ? "2px solid var(--c-primary)" : "1.5px solid var(--c-border-strong)",
                    borderRadius: "var(--r-md)", cursor: "pointer",
                    background: m.active ? "var(--c-primary-soft)" : "white"
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: m.active ? "var(--c-primary)" : "var(--c-ink)" }}>{m.lbl}</div>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="field"><label>Carga horária semanal</label><input className="input" defaultValue="30 horas" style={{ maxWidth: 200 }} /></div>
              </div>
            </section>

            <section className="card">
              <div className="card-hd">
                <div>
                  <h2>3. Contribuições</h2>
                  <p>Soma 100% · 4 adicionadas</p>
                </div>
                <button className="btn btn-soft btn-sm"><Icon name="plus" size={13} /> Adicionar</button>
              </div>

              {/* Barra empilhada compacta */}
              <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 14, background: "var(--c-bg-deep)" }}>
                <div style={{ width: "40%", background: "var(--c-primary)" }} />
                <div style={{ width: "25%", background: "var(--c-primary)", borderLeft: "2px solid white" }} />
                <div style={{ width: "20%", background: "var(--c-success)", borderLeft: "2px solid white" }} />
                <div style={{ width: "15%", background: "var(--c-status-aval)", borderLeft: "2px solid white" }} />
              </div>

              {[
                { t: 1, ttl: "Implementação do módulo de cadastro PGD", entrega: "Renovação do portal CGTIC", pct: 40 },
                { t: 1, ttl: "Migração de banco para PG16",              entrega: "Modernização da camada de dados", pct: 25 },
                { t: 2, ttl: "Sustentação e atendimento",                entrega: null, pct: 20 },
                { t: 3, ttl: "Apoio à CGRH · SSO",                       entrega: "Unificação de identidades · CGRH", pct: 15 },
              ].map((c, i) => (
                <div className="contrib" key={i}>
                  <span className={`contrib-tipo t${c.t}`}>{c.t}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 14.5 }}>{c.ttl}</div>
                    <div className="contrib-meta">{c.entrega ? `Vinculada a «${c.entrega}»` : "Não vinculada"}</div>
                  </div>
                  <div className="contrib-pct">{c.pct}%</div>
                  <button className="tn-iconbtn" style={{ width: 28, height: 28 }}><Icon name="edit" size={13} /></button>
                </div>
              ))}
            </section>

            <section className="card">
              <div className="card-hd"><h2>4. Critérios de avaliação</h2></div>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.8 }}>
                <li>Cumprimento de prazos das entregas vinculadas</li>
                <li>Qualidade técnica da documentação produzida</li>
                <li>Comunicação efetiva com áreas envolvidas</li>
                <li>Iniciativa em proposição de melhorias</li>
              </ul>
            </section>

            {/* CTA destacado no final */}
            <section className="card" style={{ background: "linear-gradient(135deg, var(--c-primary) 0%, #1351B4 100%)", color: "white", border: "none" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, opacity: .85, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Pronto?</div>
                  <h3 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 20, margin: "4px 0 0", letterSpacing: "-0.01em" }}>Assinar e enviar para chefia</h3>
                  <p style={{ fontSize: 13, opacity: .85, margin: "4px 0 0" }}>
                    {USR_CHF.name} receberá uma notificação e poderá revisar.
                  </p>
                </div>
                <button className="btn btn-lg" style={{ background: "white", color: "var(--c-primary)" }}>
                  <Icon name="paperPlane" size={16} /> Assinar e enviar
                </button>
              </div>
            </section>
          </div>

          {/* Side */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Histórico desde a criação</h2></div>
              <EdicoesTimeline items={TIMELINE_EXEMPLO.slice(0, 3)} />
            </section>

            <section className="card" style={{ background: "var(--c-surface-2)" }}>
              <div className="kicker"><Icon name="info" size={13} /> Atalhos</div>
              <div className="stack-12" style={{ marginTop: 12 }}>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start" }}>
                  <Icon name="download" size={13} /> Exportar PDF para revisar offline
                </button>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start", color: "var(--c-danger)" }}>
                  <Icon name="x" size={13} /> Descartar rascunho
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// /meu-plano/[id]/revisar — bola comigo (revisor)
// Servidor recebeu PT criado/ajustado pela chefia. Decide: assinar ou ajustar.
// ═══════════════════════════════════════════════════════════════════════
const ScreenMeuPlanoRevisar = ({ density }) => {
  return (
    <div className="pgd-app" data-density={density} data-screen-label="Meu Plano · revisar (aguardando servidor)">
      <TopNav role="servidor" active="plano" alerts={1} user={USR_SRV} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Meu Plano</a><span className="sep">/</span>
          <span>PT-2026-08 · revisar</span>
        </div>

        <div className="pg-head">
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
              <StatusBadgeV2 status="AGUARDANDO_ASSINATURA_PARTICIPANTE" />
            </div>
            <h1 className="pg-title">Revisar seu plano de trabalho</h1>
            <p className="pg-sub">Carlos Mendes ajustou o plano e devolveu para sua revisão. Confira o que mudou.</p>
          </div>
        </div>

        <OwnershipBanner
          variant="comigo-revisor"
          atorOutro="Carlos Mendes"
          diasEspera={1}
          mostrarDiff
        />

        <div className="g-2-1">
          {/* Plano em modo leitura */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            {/* Aviso: chefia mudou X campos */}
            <section className="card" style={{ borderLeft: "3px solid var(--c-warning)" }}>
              <div className="kicker" style={{ color: "var(--c-warning)" }}><Icon name="alert" size={13} /> A chefia ajustou 2 campos</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ padding: 12, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)", marginBottom: 10 }}>
                  <div className="kicker" style={{ fontSize: 10.5, marginBottom: 6 }}>Contribuição 1 · percentual</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 16px 1fr", gap: 10, alignItems: "center" }}>
                    <div style={{ padding: "8px 10px", background: "var(--c-danger-soft)", color: "var(--c-ink-2)", borderRadius: 4, fontSize: 13, textDecoration: "line-through", textDecorationColor: "var(--c-danger)66" }}>40%</div>
                    <Icon name="arrowR" size={14} className="" />
                    <div style={{ padding: "8px 10px", background: "var(--c-success-soft)", color: "var(--c-ink)", borderRadius: 4, fontSize: 13, fontWeight: 600 }}>35%</div>
                  </div>
                </div>
                <div style={{ padding: 12, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)" }}>
                  <div className="kicker" style={{ fontSize: 10.5, marginBottom: 6 }}>Critério 4</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 16px 1fr", gap: 10, alignItems: "center" }}>
                    <div style={{ padding: "8px 10px", background: "var(--c-danger-soft)", color: "var(--c-ink-2)", borderRadius: 4, fontSize: 12.5, textDecoration: "line-through", textDecorationColor: "var(--c-danger)66" }}>Iniciativa em proposição de melhorias</div>
                    <Icon name="arrowR" size={14} className="" />
                    <div style={{ padding: "8px 10px", background: "var(--c-success-soft)", color: "var(--c-ink)", borderRadius: 4, fontSize: 12.5, fontWeight: 500 }}>Iniciativa em proposição de melhorias documentadas mensalmente</div>
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}><Icon name="history" size={13} /> Ver histórico completo</button>
            </section>

            {/* Plano resumido (read-only) */}
            <section className="card">
              <div className="card-hd"><h2>Plano completo (leitura)</h2></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
                <div><div className="kpi-label">Período</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4 }}>ago/26 → jan/27</div></div>
                <div><div className="kpi-label">Modalidade</div><div style={{ marginTop: 4 }}><ModalidadeBadge codigo={3} /></div></div>
                <div><div className="kpi-label">Carga</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4 }}>30 h/sem</div></div>
                <div><div className="kpi-label">Contribuições</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4 }}>4 · 100%</div></div>
              </div>
              <div className="divider" />
              <div className="kicker">Contribuições</div>
              <div style={{ marginTop: 10 }}>
                {[
                  { t: 1, ttl: "Implementação do módulo de cadastro PGD", pct: 35, mudou: true },
                  { t: 1, ttl: "Migração de banco para PG16",              pct: 25 },
                  { t: 2, ttl: "Sustentação e atendimento",                pct: 20 },
                  { t: 3, ttl: "Apoio à CGRH · SSO",                       pct: 20, mudou: true },
                ].map((c, i) => (
                  <div className="contrib" key={i} style={c.mudou ? { background: "rgba(199, 116, 0, .04)" } : null}>
                    <span className={`contrib-tipo t${c.t}`}>{c.t}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
                        {c.ttl}
                        {c.mudou && <span className="bdg bdg-warning" style={{ fontSize: 10.5 }}>alterado</span>}
                      </div>
                    </div>
                    <div className="contrib-pct">{c.pct}%</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side — Assinatura */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <AssinaturaCard ator="Carlos Mendes (chefia)" />

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Status das assinaturas</h2></div>
              <div className="stack-12">
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--c-success-soft)", borderRadius: "var(--r-sm)" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 14, background: "var(--c-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="check" size={14} stroke={2.4} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Chefia · Carlos Mendes</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>Assinou em 14 mai · 16:08</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--c-warning-soft)", borderRadius: "var(--r-sm)", border: "1.5px solid var(--c-warning)" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 14, background: "white", color: "var(--c-warning)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", border: "2px solid var(--c-warning)" }}><Icon name="clock" size={13} stroke={2.2} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Você · {USR_SRV.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-warning)", fontWeight: 600 }}>Pendente</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// /equipe — Lista da Equipe com novos badges de pactuação
// ═══════════════════════════════════════════════════════════════════════
const ScreenEquipeComBadges = ({ density }) => {
  const equipe = [
    { nome: "Nitai Bezerra",  siape: "1928374", status: "AGUARDANDO_ASSINATURA_CHEFIA", urg: 2, mod: 3, prog: 0,  acao: "assinar" },
    { nome: "Lucas Pereira",      siape: "2840193", status: "EM_EXECUCAO",                   urg: null, mod: 2, prog: 48, acao: "ver" },
    { nome: "Renata Santos",      siape: "1734829", status: "RASCUNHO_PARTICIPANTE",         urg: null, mod: 3, prog: 0,  acao: "aguardar" },
    { nome: "Juliana Almeida",    siape: "1638204", status: "EM_EXECUCAO",                   urg: null, mod: 2, prog: 45, acao: "ver" },
    { nome: "Felipe Ribeiro",     siape: "1947382", status: "AGUARDANDO_ASSINATURA_PARTICIPANTE", urg: null, mod: 3, prog: 0, acao: "aguardar" },
    { nome: "Camila Souza",       siape: "1857361", status: "EM_EXECUCAO",                   urg: -3, mod: 3, prog: 39, acao: "ver" },
    { nome: "Bruno Tavares",      siape: "1892374", status: "AGUARDANDO_ASSINATURA_CHEFIA",  urg: 5, mod: 2, prog: 0,  acao: "assinar" },
    { nome: "Marcos Oliveira",    siape: "2074831", status: "EM_EXECUCAO",                   urg: null, mod: 1, prog: 50, acao: "ver" },
  ];
  const pendentes = equipe.filter(e => e.acao === "assinar").length;

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Equipe · com badges de pactuação">
      <TopNav role="chefia" active="equipe" alerts={6} user={USR_CHF} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Equipe · CGTIC</div>
            <h1 className="pg-title">Servidores sob minha chefia</h1>
            <p className="pg-sub">{equipe.length} servidores · <strong style={{ color: "var(--c-warning)" }}>{pendentes} planos aguardando sua assinatura</strong></p>
          </div>
          <button className="btn btn-ghost"><Icon name="plus" size={16} /> Criar plano para um servidor</button>
        </div>

        {/* Banner consolidado de pendências */}
        {pendentes > 0 && (
          <div className="banner" style={{ marginBottom: "var(--gap-sec)", borderLeft: "4px solid var(--c-warning)" }}>
            <span className="icon"><Icon name="clock" size={20} stroke={1.8} /></span>
            <div style={{ flex: 1 }}>
              <div className="ttl">{pendentes} planos de trabalho aguardando sua assinatura</div>
              <div className="sub">Servidores que enviaram o plano pra você revisar e assinar. Sem sua ação, o plano não entra em vigor.</div>
            </div>
            <button className="btn btn-primary">Ver primeiro pendente <Icon name="arrowR" size={15} /></button>
          </div>
        )}

        <section className="card" style={{ padding: 0 }}>
          <table className="tbl">
            <thead><tr>
              <th></th><th>Servidor</th><th>Modalidade</th><th>Status do plano</th><th>Progresso</th><th>Ação</th><th></th>
            </tr></thead>
            <tbody>
              {equipe.map((s, i) => (
                <tr key={i} style={s.acao === "assinar" ? { background: "var(--c-warning-soft)" } : null}>
                  <td style={{ width: 0 }}>
                    <span className="av av-sm" style={{ background: avatarColor(s.nome), color: "white" }}>{initialsOf(s.nome)}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--c-ink)" }}>{s.nome}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "var(--ff-mono)" }}>SIAPE {s.siape}</div>
                  </td>
                  <td><ModalidadeBadge codigo={s.mod} /></td>
                  <td><StatusBadgeV2 status={s.status} /></td>
                  <td style={{ minWidth: 130 }}>
                    {s.status === "EM_EXECUCAO"
                      ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="bar thin" style={{ flex: 1 }}><i style={{ width: `${s.prog}%` }} /></div>
                          <span style={{ fontSize: 12, fontFamily: "var(--ff-display)", fontWeight: 600, minWidth: 30, textAlign: "right" }}>{s.prog}%</span>
                        </div>
                      : <span style={{ color: "var(--c-muted)", fontSize: 12.5 }}>—</span>}
                  </td>
                  <td>
                    {s.acao === "assinar" && <UrgencyPill daysLeft={s.urg} label={`Sua assinatura há ${s.urg}d`} />}
                    {s.acao === "aguardar" && s.status === "RASCUNHO_PARTICIPANTE" && <span style={{ fontSize: 12, color: "var(--c-muted)" }}>servidor elaborando</span>}
                    {s.acao === "aguardar" && s.status === "AGUARDANDO_ASSINATURA_PARTICIPANTE" && <span style={{ fontSize: 12, color: "var(--c-muted)" }}>aguardando servidor</span>}
                    {s.acao === "ver" && s.urg !== null && s.urg < 0 && <UrgencyPill daysLeft={s.urg} />}
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {s.acao === "assinar"
                      ? <button className="btn btn-primary btn-sm">Revisar e assinar</button>
                      : <button className="btn btn-ghost btn-sm">Detalhes</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// /equipe/planos-trabalho/[id] — chefia revisando PT recebido do servidor
// ═══════════════════════════════════════════════════════════════════════
const ScreenChefiaRevisar = ({ density }) => {
  const SERV = { nome: "Nitai Bezerra", siape: "1928374" };

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Chefia · revisar plano do servidor">
      <TopNav role="chefia" active="equipe" alerts={6} user={USR_CHF} />
      <div className="pg">
        <div className="crumb">
          <a href="#">Equipe</a><span className="sep">/</span>
          <a href="#">{SERV.nome}</a><span className="sep">/</span>
          <span>PT-2026-08 · revisar</span>
        </div>

        <div className="pg-head">
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <span className="av av-lg" style={{ background: avatarColor(SERV.nome), color: "white" }}>{initialsOf(SERV.nome)}</span>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                <StatusBadgeV2 status="AGUARDANDO_ASSINATURA_CHEFIA" />
              </div>
              <h1 className="pg-title" style={{ fontSize: 28 }}>Plano de {SERV.nome.split(" ")[0]}</h1>
              <p className="pg-sub" style={{ marginTop: 4 }}>PT-2026-08 · ago 2026 → jan 2027 · enviado há 2 dias</p>
            </div>
          </div>
        </div>

        <OwnershipBanner
          variant="comigo-revisor"
          atorOutro={`${SERV.nome.split(" ")[0]} (servidor)`}
          diasEspera={2}
          mostrarDiff
        />

        <div className="g-2-1">
          {/* Plano em modo leitura, segmentado */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <section className="card">
              <div className="card-hd"><h2>Plano proposto</h2></div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
                <div><div className="kpi-label">Período</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4, fontSize: 14 }}>ago/26 → jan/27</div></div>
                <div><div className="kpi-label">Modalidade</div><div style={{ marginTop: 4 }}><ModalidadeBadge codigo={3} /></div></div>
                <div><div className="kpi-label">Carga</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4 }}>30 h/sem</div></div>
                <div><div className="kpi-label">Contribuições</div><div style={{ fontWeight: 700, fontFamily: "var(--ff-display)", marginTop: 4 }}>4 · 100%</div></div>
              </div>

              <div className="divider" />
              <div className="kicker">Contribuições propostas</div>
              <div style={{ marginTop: 10 }}>
                {[
                  { t: 1, ttl: "Implementação do módulo de cadastro PGD", entrega: "Renovação do portal CGTIC", pct: 40 },
                  { t: 1, ttl: "Migração de banco para PG16",              entrega: "Modernização da camada de dados", pct: 25 },
                  { t: 2, ttl: "Sustentação e atendimento",                entrega: null, pct: 20 },
                  { t: 3, ttl: "Apoio à CGRH · SSO",                       entrega: "Unificação de identidades · CGRH", pct: 15 },
                ].map((c, i) => (
                  <div className="contrib" key={i}>
                    <span className={`contrib-tipo t${c.t}`}>{c.t}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--c-ink)", fontSize: 14 }}>{c.ttl}</div>
                      <div className="contrib-meta">{c.entrega ? `«${c.entrega}»` : "Não vinculada"}</div>
                    </div>
                    <div className="contrib-pct">{c.pct}%</div>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div className="kicker">Critérios de avaliação propostos</div>
              <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
                <li>Cumprimento de prazos das entregas vinculadas</li>
                <li>Qualidade técnica da documentação produzida</li>
                <li>Comunicação efetiva com áreas envolvidas</li>
                <li>Iniciativa em proposição de melhorias</li>
              </ul>
            </section>

            <section className="card">
              <div className="card-hd">
                <h2>Histórico desde a criação</h2>
                <span className="bdg bdg-neutral" style={{ fontSize: 11 }}>5 eventos</span>
              </div>
              <EdicoesTimeline items={TIMELINE_EXEMPLO} defaultExpanded={1} />
            </section>
          </div>

          {/* Side — assinatura */}
          <div className="col" style={{ gap: "var(--gap-sec)" }}>
            <AssinaturaCard ator={SERV.nome.split(" ")[0]} />

            <section className="card">
              <div className="card-hd"><h2 style={{ fontSize: 16 }}>Status das assinaturas</h2></div>
              <div className="stack-12">
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--c-success-soft)", borderRadius: "var(--r-sm)" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 14, background: "var(--c-success)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="check" size={14} stroke={2.4} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Servidora · {SERV.nome}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-muted)" }}>Assinou em 12 mai · 16:30</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--c-warning-soft)", borderRadius: "var(--r-sm)", border: "1.5px solid var(--c-warning)" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 14, background: "white", color: "var(--c-warning)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", border: "2px solid var(--c-warning)" }}><Icon name="clock" size={13} stroke={2.2} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Você · {USR_CHF.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--c-warning)", fontWeight: 600 }}>Pendente · há 2 dias</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="card" style={{ background: "var(--c-info-soft)" }}>
              <div className="kicker" style={{ color: "var(--c-info)" }}><Icon name="info" size={13} /> O que acontece</div>
              <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.7 }}>
                <li>Se você <strong>assinar</strong>, o plano vira «Em execução»</li>
                <li>Se você <strong>devolver para ajustes</strong>, a assinatura da servidora é zerada e ela precisa reassinar</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  ScreenMeuPlanoVazio, ScreenMeuPlanoCriar, ScreenMeuPlanoEditar, ScreenMeuPlanoRevisar,
  ScreenEquipeComBadges, ScreenChefiaRevisar,
  TIMELINE_EXEMPLO,
});
