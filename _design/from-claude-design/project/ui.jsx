// ui.jsx — shared UI atoms for PGD Libre
// Loaded as a non-module script; everything is attached to window at the end.

// ── Icons (inline SVG, stroke-based for consistency) ────────────────────
const Icon = ({ name, size = 18, stroke = 1.6, className }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", className };
  const paths = {
    home:        <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    file:        <><path d="M14 3H6v18h12V7l-4-4z" /><path d="M14 3v4h4" /></>,
    edit:        <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></>,
    users:       <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M22 21a6 6 0 0 0-8-5.6" /><circle cx="17" cy="9" r="3" /></>,
    check:       <><path d="M5 12l5 5L20 7" /></>,
    bell:        <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    search:      <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    calendar:    <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    clock:       <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevR:       <><path d="M9 6l6 6-6 6" /></>,
    chevD:       <><path d="M6 9l6 6 6-6" /></>,
    chart:       <><path d="M3 21h18" /><path d="M6 17V9" /><path d="M11 17V5" /><path d="M16 17v-6" /><path d="M21 17v-3" /></>,
    settings:    <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    plus:        <><path d="M12 5v14M5 12h14" /></>,
    arrowR:      <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    arrowL:      <><path d="M19 12H5M11 18l-6-6 6-6" /></>,
    alert:       <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></>,
    info:        <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></>,
    download:    <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
    refresh:     <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>,
    eye:         <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    flag:        <><path d="M4 21V4" /><path d="M4 4h12l-2 4 2 4H4" /></>,
    star:        <><polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9 12 2" /></>,
    paperPlane:  <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></>,
    cloudUp:     <><path d="M16 16l-4-4-4 4" /><path d="M12 12v9" /><path d="M20.4 14.5A5 5 0 0 0 18 5h-1.3A8 8 0 1 0 4 15.3" /></>,
    triangle:    <><path d="M12 4 4 20h16L12 4z" /></>,
    x:           <><path d="M18 6 6 18M6 6l18 18" /></>,
    dots:        <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
    history:     <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
    handshake:   <><path d="M2 12l4-4 4 2 4-4 4 2 4-2v8l-4 2-4-2-4 4-4-2-4 4z" /></>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
};

// ── TopNav (horizontal, SaaS-style) ────────────────────────────────────
const TopNav = ({ role = "servidor", active, user, alerts = 0 }) => {
  const items = {
    servidor: [
      { id: "home", label: "Início", icon: "home" },
      { id: "plano", label: "Meu Plano", icon: "file" },
      { id: "historico", label: "Histórico", icon: "history" },
      { id: "notif", label: "Notificações", icon: "bell" },
    ],
    chefia: [
      { id: "home", label: "Início", icon: "home" },
      { id: "equipe", label: "Equipe", icon: "users" },
      { id: "planos", label: "Planos", icon: "file" },
      { id: "avaliacoes", label: "Avaliações", icon: "check" },
    ],
    gestor: [
      { id: "home", label: "Início", icon: "home" },
      { id: "relatorios", label: "Relatórios", icon: "chart" },
      { id: "conform", label: "Conformidade", icon: "check" },
      { id: "participantes", label: "Participantes", icon: "users" },
    ],
    admin: [
      { id: "home", label: "Início", icon: "home" },
      { id: "conform", label: "Conformidade", icon: "chart" },
      { id: "participantes", label: "Participantes", icon: "users" },
      { id: "institucional", label: "Institucional", icon: "settings" },
    ],
  }[role];
  const u = user || { name: "Nitai Bezerra", role: "Servidor · Analista", initials: "NB" };
  return (
    <nav className="tn">
      <div className="tn-logo">
        <span className="tn-logo-mark">PG</span>
        <span>PGD Libre</span>
      </div>
      <div className="tn-nav">
        {items.map(it => (
          <a key={it.id} href="#" className={active === it.id ? "active" : ""}>
            {it.label}
          </a>
        ))}
      </div>
      <div className="tn-right">
        <button className="tn-iconbtn" aria-label="Buscar"><Icon name="search" size={18} /></button>
        <button className="tn-iconbtn" aria-label="Notificações">
          <Icon name="bell" size={18} />
          {alerts > 0 && <span className="dot" />}
        </button>
        <button className="tn-user">
          <span className="av av-sm" style={{ background: "var(--c-primary)", color: "white" }}>{u.initials}</span>
          <span style={{ textAlign: "left" }}>
            <div className="name">{u.name}</div>
            <div className="role">{u.role}</div>
          </span>
          <Icon name="chevD" size={14} />
        </button>
      </div>
    </nav>
  );
};

// ── Status badges ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    cancelado:   { cls: "bdg-neutral", label: "Cancelado" },
    aprovado:    { cls: "bdg-info",    label: "Aprovado" },
    execucao:    { cls: "bdg-success", label: "Em execução" },
    concluido:   { cls: "bdg-success", label: "Concluído" },
    avaliado:    { cls: "bdg-purple",  label: "Avaliado" },
    pendente:    { cls: "bdg-warning", label: "Pendente" },
    atrasado:    { cls: "bdg-danger",  label: "Atrasado" },
    rascunho:    { cls: "bdg-neutral", label: "Rascunho" },
  };
  const v = map[status] || map.aprovado;
  return <span className={`bdg ${v.cls}`}><span className="dot" />{v.label}</span>;
};

const NotaBadge = ({ nota }) => {
  const m = {
    1: { lbl: "Excepcional", c: "var(--c-nota-1)", bg: "#DCEDDF" },
    2: { lbl: "Alto desempenho", c: "var(--c-nota-2)", bg: "var(--c-success-soft)" },
    3: { lbl: "Adequado", c: "var(--c-nota-3)", bg: "var(--c-info-soft)" },
    4: { lbl: "Inadequado", c: "var(--c-nota-4)", bg: "var(--c-warning-soft)" },
    5: { lbl: "Não executado", c: "var(--c-nota-5)", bg: "var(--c-danger-soft)" },
  }[nota];
  return (
    <span className="bdg" style={{ background: m.bg, color: m.c }}>
      <strong style={{ fontFamily: "var(--ff-display)", marginRight: 2 }}>{nota}</strong>
      {m.lbl}
    </span>
  );
};

const ModalidadeBadge = ({ codigo }) => {
  const m = {
    1: "Presencial",
    2: "TT Parcial",
    3: "TT Integral",
    4: "TT Exterior (VIII)",
    5: "TT Exterior (§7º)",
  }[codigo] || "Presencial";
  return <span className="bdg bdg-neutral">{m}</span>;
};

// Urgency pill — derived from "days remaining"
const UrgencyPill = ({ daysLeft, label }) => {
  let cls = "urg-ok";
  let text = label || `${daysLeft} dias restantes`;
  if (daysLeft < 0) { cls = "urg-late"; text = label || `Vencido há ${-daysLeft} dia${-daysLeft===1?"":"s"}`; }
  else if (daysLeft <= 7) { cls = "urg-warn"; text = label || `${daysLeft} dia${daysLeft===1?"":"s"} restante${daysLeft===1?"":"s"}`; }
  return <span className={`urg ${cls}`}><span className="dot" />{text}</span>;
};

// ── Nota Selector (1–5) — 3 visual styles, switchable via tweak ─────────
const NotaSelector = ({ value, onChange, style = "blocos", disabled }) => {
  const handle = (v) => () => { if (onChange && !disabled) onChange(v); };
  const items = [
    { n: 1, lbl: "Excepcional",     c: "var(--c-nota-1)" },
    { n: 2, lbl: "Alto desempenho", c: "var(--c-nota-2)" },
    { n: 3, lbl: "Adequado",        c: "var(--c-nota-3)" },
    { n: 4, lbl: "Inadequado",      c: "var(--c-nota-4)" },
    { n: 5, lbl: "Não executado",   c: "var(--c-nota-5)" },
  ];

  if (style === "estrelas") {
    // 5 = best in stars metaphor, but our scale flips. Show 5 stars + an
    // explicit label so semantics stay clear.
    const cur = items.find(i => i.n === value);
    // Map: 1 ★★★★★, 2 ★★★★, 3 ★★★, 4 ★★, 5 ★
    const filled = value ? 6 - value : 0;
    return (
      <div className="ns-stars">
        <div className="ns-stars-row">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              type="button"
              className={`ns-star ${i <= filled ? "on" : ""}`}
              onClick={handle(6 - i)}
              aria-label={`Nota ${6 - i}`}
            >
              <Icon name="star" size={28} stroke={1.4} />
            </button>
          ))}
        </div>
        {cur && (
          <div className="ns-stars-lbl">
            <strong style={{ color: cur.c, fontFamily: "var(--ff-display)" }}>Nota {cur.n}</strong>
            <span style={{ color: "var(--c-muted)" }}> · {cur.lbl}</span>
          </div>
        )}
      </div>
    );
  }

  if (style === "radio") {
    return (
      <div className="ns-radio">
        {items.map(it => (
          <label
            key={it.n}
            className={`ns-radio-item ${value === it.n ? "on" : ""}`}
            style={value === it.n ? { borderColor: it.c, boxShadow: `0 0 0 3px ${it.c}22` } : null}
            onClick={handle(it.n)}
          >
            <span className="ns-radio-dot" style={value === it.n ? { background: it.c, borderColor: it.c } : null} />
            <span className="ns-radio-num" style={{ color: value === it.n ? it.c : "var(--c-ink)" }}>{it.n}</span>
            <span className="ns-radio-lbl">{it.lbl}</span>
          </label>
        ))}
      </div>
    );
  }

  // blocos (default)
  return (
    <div className="ns-blocos">
      {items.map(it => (
        <button
          key={it.n}
          type="button"
          className={`ns-bloco ${value === it.n ? "on" : ""}`}
          onClick={handle(it.n)}
          style={value === it.n ? { background: it.c, borderColor: it.c, color: "white" } : null}
        >
          <span className="ns-bloco-num">{it.n}</span>
          <span className="ns-bloco-lbl">{it.lbl}</span>
        </button>
      ))}
    </div>
  );
};

// ── Timeline of plan status ─────────────────────────────────────────────
const StatusTimeline = ({ items }) => {
  // items: [{ status, date, label, current, future }]
  return (
    <ol className="tl">
      {items.map((it, i) => (
        <li key={i} className={`tl-item ${it.current ? "current" : ""} ${it.future ? "future" : ""}`}>
          <span className="tl-dot">
            {it.future ? null : <Icon name="check" size={12} stroke={2.4} />}
          </span>
          <div className="tl-body">
            <div className="tl-ttl">{it.label}</div>
            <div className="tl-meta">{it.date}</div>
            {it.note && <div className="tl-note">{it.note}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
};

// ── Wizard stepper ──────────────────────────────────────────────────────
const Stepper = ({ steps, current }) => (
  <div className="stepper">
    {steps.map((s, i) => {
      const done = i < current;
      const cur = i === current;
      return (
        <React.Fragment key={i}>
          <div className={`stp ${done ? "done" : ""} ${cur ? "cur" : ""}`}>
            <span className="stp-dot">
              {done ? <Icon name="check" size={13} stroke={2.6} /> : i + 1}
            </span>
            <span className="stp-lbl">{s}</span>
          </div>
          {i < steps.length - 1 && <span className="stp-line" />}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Sparkline (tiny) ────────────────────────────────────────────────────
const Spark = ({ data = [], color = "var(--c-primary)", w = 120, h = 36 }) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

// ── Inject component-specific styles once ────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("pgd-ui-css")) {
  const s = document.createElement("style");
  s.id = "pgd-ui-css";
  s.textContent = `
  /* Nota Selector — blocos */
  .ns-blocos { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
  .ns-bloco {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 18px 10px; border-radius: var(--r-md);
    background: var(--c-surface); border: 1.5px solid var(--c-border-strong);
    cursor: pointer; transition: all .15s; text-align: center;
  }
  .ns-bloco:hover { border-color: var(--c-primary); }
  .ns-bloco-num { font-family: var(--ff-display); font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .ns-bloco-lbl { font-size: 12px; color: var(--c-muted); font-weight: 600; }
  .ns-bloco.on .ns-bloco-lbl { color: rgba(255,255,255,.85); }

  /* Nota Selector — radio */
  .ns-radio { display: flex; flex-direction: column; gap: 8px; }
  .ns-radio-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    border: 1.5px solid var(--c-border-strong); border-radius: var(--r-md);
    cursor: pointer; transition: all .12s; background: var(--c-surface);
  }
  .ns-radio-item:hover { border-color: var(--c-primary); }
  .ns-radio-dot {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid var(--c-border-strong); background: white;
    flex: none;
  }
  .ns-radio-num { font-family: var(--ff-display); font-weight: 700; font-size: 18px; min-width: 16px; }
  .ns-radio-lbl { font-size: 14px; color: var(--c-ink-2); font-weight: 500; }

  /* Nota Selector — estrelas */
  .ns-stars { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .ns-stars-row { display: flex; gap: 4px; }
  .ns-star { background: transparent; border: 0; cursor: pointer; padding: 4px; color: var(--c-border-strong); transition: color .12s, transform .1s; }
  .ns-star:hover { transform: scale(1.08); }
  .ns-star.on { color: #E5A50A; }
  .ns-star.on svg { fill: #FCD34D; }
  .ns-stars-lbl { font-size: 14px; }

  /* Timeline */
  .tl { list-style: none; padding: 0; margin: 0; }
  .tl-item { display: flex; gap: 14px; position: relative; padding-bottom: 18px; }
  .tl-item::before {
    content: ""; position: absolute; left: 11px; top: 24px; bottom: -4px;
    width: 2px; background: var(--c-success);
  }
  .tl-item.future::before { background: var(--c-border); }
  .tl-item:last-child::before { display: none; }
  .tl-dot {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--c-success); color: white;
    display: inline-flex; align-items: center; justify-content: center;
    flex: none; z-index: 1;
    box-shadow: 0 0 0 3px var(--c-success-soft);
  }
  .tl-item.future .tl-dot { background: white; border: 2px solid var(--c-border-strong); box-shadow: none; }
  .tl-item.current .tl-dot { background: var(--c-primary); box-shadow: 0 0 0 3px var(--c-primary-soft), 0 0 0 6px rgba(15, 61, 140, .12); }
  .tl-body { flex: 1; padding-top: 1px; }
  .tl-ttl { font-weight: 600; color: var(--c-ink); font-size: 14px; }
  .tl-item.future .tl-ttl { color: var(--c-muted); font-weight: 500; }
  .tl-meta { font-size: 12.5px; color: var(--c-muted); margin-top: 1px; }
  .tl-note { font-size: 13px; color: var(--c-ink-2); margin-top: 6px; padding: 8px 10px; background: var(--c-surface-2); border-radius: var(--r-sm); border-left: 3px solid var(--c-primary); }

  /* Stepper */
  .stepper { display: flex; align-items: center; gap: 0; }
  .stp { display: flex; align-items: center; gap: 10px; }
  .stp-dot {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--c-bg-deep); color: var(--c-muted);
    display: inline-flex; align-items: center; justify-content: center;
    font-family: var(--ff-display); font-weight: 700; font-size: 13px;
    transition: all .15s; flex: none;
  }
  .stp-lbl { font-size: 13.5px; font-weight: 500; color: var(--c-muted); white-space: nowrap; }
  .stp.cur .stp-dot { background: var(--c-primary); color: white; box-shadow: 0 0 0 4px var(--c-primary-soft); }
  .stp.cur .stp-lbl { color: var(--c-ink); font-weight: 600; }
  .stp.done .stp-dot { background: var(--c-success); color: white; }
  .stp.done .stp-lbl { color: var(--c-ink-2); font-weight: 500; }
  .stp-line { flex: 1; height: 2px; background: var(--c-border); margin: 0 14px; min-width: 28px; }
  .stp.done ~ .stp-line { background: var(--c-success); }

  /* Contribution row */
  .contrib { display: flex; gap: 14px; align-items: flex-start; padding: var(--pad-row) 0; border-top: 1px solid var(--c-divider); }
  .contrib:first-child { border-top: 0; padding-top: 0; }
  .contrib-tipo {
    width: 30px; height: 30px; border-radius: var(--r-sm);
    display: inline-flex; align-items: center; justify-content: center;
    font-family: var(--ff-display); font-weight: 800; font-size: 13px;
    flex: none;
  }
  .contrib-tipo.t1 { background: var(--c-primary-soft); color: var(--c-primary); }
  .contrib-tipo.t2 { background: var(--c-success-soft); color: var(--c-success); }
  .contrib-tipo.t3 { background: #EFE8F7; color: var(--c-status-aval); }
  .contrib-meta { font-size: 12px; color: var(--c-muted); margin-top: 2px; }
  .contrib-pct {
    font-family: var(--ff-display); font-weight: 700; font-size: 18px;
    letter-spacing: -0.01em; color: var(--c-ink); white-space: nowrap;
  }

  /* Notif item */
  .nf {
    display: flex; gap: 14px; padding: 14px 18px;
    border-radius: var(--r-md); transition: background .12s;
    cursor: pointer; border: 1px solid transparent;
  }
  .nf:hover { background: var(--c-surface-2); border-color: var(--c-border); }
  .nf.unread { background: rgba(15, 61, 140, .03); }
  .nf-icon { width: 36px; height: 36px; border-radius: var(--r-sm); display: inline-flex; align-items: center; justify-content: center; flex: none; }
  .nf-icon.info { background: var(--c-primary-soft); color: var(--c-primary); }
  .nf-icon.warn { background: var(--c-warning-soft); color: var(--c-warning); }
  .nf-icon.ok   { background: var(--c-success-soft); color: var(--c-success); }
  .nf-icon.purp { background: #EFE8F7; color: var(--c-status-aval); }
  .nf-ttl { font-weight: 600; font-size: 14px; color: var(--c-ink); }
  .nf-msg { font-size: 13.5px; color: var(--c-ink-2); margin-top: 2px; }
  .nf-time { font-size: 12px; color: var(--c-muted); margin-top: 4px; }
  .nf-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-primary); margin-top: 14px; flex: none; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  Icon, TopNav, StatusBadge, NotaBadge, ModalidadeBadge,
  UrgencyPill, NotaSelector, StatusTimeline, Stepper, Spark,
});
