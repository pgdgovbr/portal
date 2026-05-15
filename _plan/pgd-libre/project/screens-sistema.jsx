// screens-sistema.jsx — Notificações, Painel de Conformidade,
// e cards de "componentes em destaque" para o canvas.

// ── Notificações (inbox) ───────────────────────────────────────────────
const ScreenNotificacoes = ({ density }) => {
  const items = [
    { ic: "ok",   ttl: "Avaliação de março publicada",         msg: "Carlos Mendes avaliou seu registro de execução de março/2026 com nota 2 (Alto desempenho).", t: "há 3 dias · 12 abr", unread: true, tag: "Avaliação" },
    { ic: "warn", ttl: "Registrar execução de abril",           msg: "Seu prazo encerra em 10 de maio. Você ainda não submeteu a descrição da execução do mês.", t: "há 5 dias · 10 abr", unread: true, tag: "Prazo" },
    { ic: "purp", ttl: "Recurso respondido por Carlos Mendes",   msg: "Seu recurso à avaliação de fevereiro foi parcialmente acatado. A nota foi alterada de 4 para 3.", t: "há 8 dias · 07 abr", unread: true, tag: "Recurso" },
    { ic: "info", ttl: "Plano de Entregas «Modernização 2026» aprovado", msg: "O Plano de Entregas vinculado às suas contribuições foi aprovado pela autoridade superior.", t: "há 12 dias · 03 abr", unread: false, tag: "Sistema" },
    { ic: "ok",   ttl: "Avaliação de fevereiro publicada",       msg: "Carlos Mendes avaliou seu registro de execução de fevereiro/2026 com nota 3 (Adequado).", t: "há 6 sem · 11 mar", unread: false, tag: "Avaliação" },
    { ic: "info", ttl: "Critérios de avaliação atualizados",     msg: "Sua chefia atualizou os critérios de avaliação do plano 2026/1. Revise antes do próximo registro.", t: "há 8 sem · 22 fev", unread: false, tag: "Sistema" },
    { ic: "info", ttl: "Plano de Trabalho 2026/1 iniciado",       msg: "Seu plano entrou em fase de execução. Primeiro registro de execução deve ser feito até 10 de março.", t: "há 14 sem · 01 fev", unread: false, tag: "Sistema" },
  ];

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Notificações">
      <TopNav role="servidor" active="notif" alerts={3} user={{ name: "Ana Beatriz Costa", role: "Servidora · Analista", initials: "AC" }} />
      <div className="pg" style={{ maxWidth: 1080 }}>
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Caixa de entrada</div>
            <h1 className="pg-title">Notificações</h1>
            <p className="pg-sub">3 não lidas · você receberá alertas de prazos, avaliações e recursos aqui.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost"><Icon name="check" size={15} /> Marcar todas como lidas</button>
            <button className="btn btn-ghost"><Icon name="settings" size={15} /> Preferências</button>
          </div>
        </div>

        <div className="tabs">
          <span className="tab active">Todas <span style={{ marginLeft: 6, fontSize: 11, background: "var(--c-primary-soft)", color: "var(--c-primary)", padding: "1px 8px", borderRadius: 10 }}>7</span></span>
          <span className="tab">Não lidas <span style={{ marginLeft: 6, fontSize: 11, background: "var(--c-danger-soft)", color: "var(--c-danger)", padding: "1px 8px", borderRadius: 10 }}>3</span></span>
          <span className="tab">Prazos</span>
          <span className="tab">Avaliações</span>
          <span className="tab">Recursos</span>
        </div>

        <div className="card" style={{ padding: 12 }}>
          {items.map((n, i) => (
            <div key={i} className={`nf ${n.unread ? "unread" : ""}`}>
              <div className={`nf-icon ${n.ic}`}>
                <Icon name={n.ic === "ok" ? "check" : n.ic === "warn" ? "alert" : n.ic === "purp" ? "flag" : "info"} size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="nf-ttl">{n.ttl}</span>
                  <span className="bdg bdg-neutral" style={{ fontSize: 10.5, padding: "2px 8px" }}>{n.tag}</span>
                </div>
                <div className="nf-msg">{n.msg}</div>
                <div className="nf-time">{n.t}</div>
              </div>
              {n.unread && <span className="nf-unread-dot" />}
              <button className="tn-iconbtn" style={{ width: 32, height: 32, alignSelf: "center" }}><Icon name="dots" size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Painel de Conformidade (Admin / Gestor) ────────────────────────────
const ScreenConformidade = ({ density }) => {
  const KPI = ({ label, total, ok, pend, err }) => (
    <section className="card">
      <div className="card-hd" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16 }}>{label}</h2>
      </div>
      <div style={{ fontFamily: "var(--ff-display)", fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--c-ink)" }}>{total}</div>
      <div style={{ fontSize: 12.5, color: "var(--c-muted)", marginTop: 2 }}>registros totais</div>

      <div style={{ display: "flex", marginTop: 18, height: 8, borderRadius: 4, overflow: "hidden", background: "var(--c-bg-deep)" }}>
        <div style={{ width: `${ok / total * 100}%`, background: "var(--c-success)" }} />
        <div style={{ width: `${pend / total * 100}%`, background: "var(--c-warning)" }} />
        <div style={{ width: `${err / total * 100}%`, background: "var(--c-danger)" }} />
      </div>

      <div className="stack-12" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: "var(--c-success)", marginRight: 8 }} />Enviados à API Central</span>
          <strong style={{ fontFamily: "var(--ff-display)" }}>{ok}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: "var(--c-warning)", marginRight: 8 }} />Pendentes de envio</span>
          <strong style={{ fontFamily: "var(--ff-display)" }}>{pend}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: "var(--c-danger)", marginRight: 8 }} />Com erro</span>
          <strong style={{ fontFamily: "var(--ff-display)", color: err > 0 ? "var(--c-danger)" : "inherit" }}>{err}</strong>
        </div>
      </div>
    </section>
  );

  const erros = [
    { ent: "Plano de Trabalho", id: "PT-2026-0312", part: "Lucas Pereira",   tipo: "PUT /plano_trabalho", ult: "há 12 min", msg: "422 · cod_unidade_executora ausente"  },
    { ent: "Plano de Entregas", id: "PE-2026-0048", part: "—",               tipo: "POST /plano_entregas", ult: "há 1h",    msg: "409 · entrega duplicada (id_entrega=21)" },
    { ent: "Participante",      id: "P-019842",     part: "Marcos Oliveira", tipo: "PUT /participante",    ult: "há 3h",    msg: "401 · token expirado · necessário reautenticar" },
    { ent: "Plano de Trabalho", id: "PT-2026-0288", part: "Renata Santos",   tipo: "PUT /plano_trabalho", ult: "há 5h",    msg: "503 · API Central indisponível" },
  ];

  return (
    <div className="pgd-app" data-density={density} data-screen-label="Painel de Conformidade · Admin">
      <TopNav role="admin" active="conform" alerts={4} user={{ name: "Pedro Almeida", role: "Administrador · TI/RH", initials: "PA" }} />
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-eyebrow">Integração · API PGD Central</div>
            <h1 className="pg-title">Painel de Conformidade</h1>
            <p className="pg-sub">Status do envio dos dados do órgão para a API PGD Central do MGI. Sincronização automática a cada 30 minutos.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12.5, color: "var(--c-muted)" }}>Última sincronização há 14 min</span>
            <button className="btn btn-ghost"><Icon name="refresh" size={15} /> Sincronizar agora</button>
            <button className="btn btn-primary"><Icon name="download" size={15} /> Relatório completo</button>
          </div>
        </div>

        {/* Top stat strip */}
        <div className="g-4" style={{ marginBottom: "var(--gap-sec)" }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Conformidade global</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
              <span className="kpi-num" style={{ color: "var(--c-success)" }}>96,4%</span>
              <span className="urg urg-ok" style={{ fontSize: 11 }}>+1,2 pts</span>
            </div>
            <Spark data={[88, 91, 93, 92, 94, 95, 96.4]} color="var(--c-success)" w={140} h={32} />
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Participantes ativos</div>
            <div className="kpi-num" style={{ marginTop: 4 }}>342</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>de 348 cadastrados</div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="kpi-label">Envios pendentes</div>
            <div className="kpi-num" style={{ color: "var(--c-warning)", marginTop: 4 }}>23</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>na fila de envio</div>
          </div>
          <div className="card" style={{ padding: 20, borderColor: "var(--c-danger)33" }}>
            <div className="kpi-label" style={{ color: "var(--c-danger)" }}>Registros com erro</div>
            <div className="kpi-num" style={{ color: "var(--c-danger)", marginTop: 4 }}>4</div>
            <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 6 }}>requerem ação manual</div>
          </div>
        </div>

        <div className="g-3" style={{ marginBottom: "var(--gap-sec)" }}>
          <KPI label="Participantes" total={348} ok={324} pend={20} err={4} />
          <KPI label="Planos de Entregas" total={48}  ok={47}  pend={0}  err={1} />
          <KPI label="Planos de Trabalho" total={310} ok={285} pend={18} err={7} />
        </div>

        {/* Erros */}
        <section className="card">
          <div className="card-hd">
            <div>
              <h2>Envios com erro</h2>
              <p>Falhas de sincronização com a API PGD Central. Revise e reprocesse.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> CSV</button>
              <button className="btn btn-soft btn-sm"><Icon name="refresh" size={13} /> Reprocessar tudo</button>
            </div>
          </div>

          <table className="tbl">
            <thead>
              <tr>
                <th>Entidade</th>
                <th>Participante</th>
                <th>Operação</th>
                <th>Mensagem</th>
                <th>Última tentativa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {erros.map((e, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.ent}</div>
                    <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--c-muted)" }}>{e.id}</div>
                  </td>
                  <td>{e.part}</td>
                  <td><span className="bdg bdg-neutral" style={{ fontFamily: "var(--ff-mono)", fontSize: 11 }}>{e.tipo}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Icon name="alert" size={14} className="" />
                      <span style={{ color: "var(--c-danger)", fontSize: 13 }}>{e.msg}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--c-muted)" }}>{e.ult}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm">Inspecionar</button>
                    <button className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>Reprocessar</button>
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

// ── Componentes em destaque — Nota Selector variants ───────────────────
const ComponentNotaVariants = ({ style }) => {
  return (
    <div className="pgd-app" data-density="confortavel" style={{ padding: 40, background: "transparent" }}>
      <div style={{ maxWidth: 720 }}>
        <div className="pg-eyebrow">Componente · seletor de nota 1–5</div>
        <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
          {style === "blocos" && "Variante A · Blocos coloridos"}
          {style === "radio"  && "Variante B · Radio horizontal"}
          {style === "estrelas" && "Variante C · Estrelas com legenda"}
        </h2>
        <p style={{ color: "var(--c-muted)", fontSize: 13.5, marginBottom: 24 }}>
          {style === "blocos" && "Cada nota recebe a cor semântica da escala. Bom para densidade alta e leitura imediata."}
          {style === "radio"  && "Lista vertical com descrição completa ao lado. Bom para chefes que avaliam pouco e querem certeza."}
          {style === "estrelas" && "Metáfora clássica adaptada: nota 1 = melhor = 5 estrelas. Familiar mas exige legenda — pode confundir."}
        </p>
        <div className="card" style={{ background: "var(--c-surface)" }}>
          <NotaSelector value={2} onChange={() => {}} style={style} />
        </div>
      </div>
    </div>
  );
};

// ── Timeline em destaque ───────────────────────────────────────────────
const ComponentTimeline = () => (
  <div className="pgd-app" data-density="confortavel" style={{ padding: 40, background: "transparent" }}>
    <div style={{ maxWidth: 480 }}>
      <div className="pg-eyebrow">Componente · linha do tempo</div>
      <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
        Status do Plano de Trabalho
      </h2>
      <p style={{ color: "var(--c-muted)", fontSize: 13.5, marginBottom: 24 }}>
        Estados passados, presente (com halo) e futuros. Anotações inline quando relevante.
      </p>
      <div className="card">
        <StatusTimeline items={[
          { label: "Plano elaborado", date: "22 jan 2026", note: "Por Carlos Mendes (chefia imediata)" },
          { label: "Aprovado", date: "28 jan 2026" },
          { label: "Em execução", date: "Desde 01 fev · há 103 dias", current: true, note: "Registros mensais até dia 10 do mês seguinte." },
          { label: "Conclusão prevista", date: "31 jul 2026", future: true },
          { label: "Avaliação final", date: "até 20 ago 2026", future: true },
        ]} />
      </div>
    </div>
  </div>
);

Object.assign(window, {
  ScreenNotificacoes, ScreenConformidade,
  ComponentNotaVariants, ComponentTimeline,
});
