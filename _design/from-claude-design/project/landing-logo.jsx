// landing-logo.jsx — propostas de marca pra PGD Libre / PGD Livre.
// 1 sistema único, 4 variações pra você escolher.

// ── Variante A · Geométrica institucional (atual + refino) ─────────────
const LogoA = ({ name = "PGD Libre", onDark = false, size = "md" }) => {
  const dim = { sm: 26, md: 32, lg: 44, xl: 60 }[size];
  const dotSize = { sm: 7, md: 9, lg: 12, xl: 16 }[size];
  const fz = { sm: 12, md: 15, lg: 20, xl: 28 }[size];
  const wmFz = { sm: 14, md: 17, lg: 23, xl: 32 }[size];
  return (
    <span className={`lp-mark ${onDark ? "on-dark" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: dim/3 }}>
      <span style={{
        width: dim, height: dim,
        borderRadius: dim * 0.25,
        background: onDark ? "white" : "var(--c-ink-editorial)",
        color: onDark ? "var(--c-ink-editorial)" : "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: fz,
        letterSpacing: "-0.02em", position: "relative",
      }}>
        P
        <span style={{
          position: "absolute",
          right: -dotSize/3, bottom: -dotSize/3,
          width: dotSize, height: dotSize,
          borderRadius: dotSize/2,
          background: "var(--c-mark-dot)",
          boxShadow: `0 0 0 2px ${onDark ? "var(--c-ink-editorial)" : "var(--c-paper)"}`,
        }} />
      </span>
      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: wmFz, letterSpacing: "-0.018em", color: onDark ? "white" : "var(--c-ink-editorial)" }}>
        {name}
      </span>
    </span>
  );
};

// ── Variante B · Símbolo PGD em camadas (três traços = três papéis) ────
const LogoB = ({ name = "PGD Libre", onDark = false, size = "md" }) => {
  const dim = { sm: 28, md: 36, lg: 50, xl: 68 }[size];
  const wmFz = { sm: 14, md: 17, lg: 24, xl: 34 }[size];
  const stroke = onDark ? "white" : "var(--c-ink-editorial)";
  const accent = "var(--c-accent)";
  const ok = "var(--c-success)";
  return (
    <span className={`lp-mark ${onDark ? "on-dark" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: dim/3 }}>
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        {/* 3 barras horizontais empilhadas: representam plano-execução-avaliação */}
        <rect x="6"  y="10" width="36" height="6" rx="2" fill={stroke} />
        <rect x="6"  y="21" width="24" height="6" rx="2" fill={accent} />
        <rect x="6"  y="32" width="30" height="6" rx="2" fill={ok} />
      </svg>
      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: wmFz, letterSpacing: "-0.018em", color: onDark ? "white" : "var(--c-ink-editorial)" }}>
        {name}
      </span>
    </span>
  );
};

// ── Variante C · Aperto de mão (pactuação bilateral) — abstrato ────────
const LogoC = ({ name = "PGD Libre", onDark = false, size = "md" }) => {
  const dim = { sm: 28, md: 36, lg: 50, xl: 68 }[size];
  const wmFz = { sm: 14, md: 17, lg: 24, xl: 34 }[size];
  const ink = onDark ? "white" : "var(--c-ink-editorial)";
  const accent = "var(--c-accent)";
  return (
    <span className={`lp-mark ${onDark ? "on-dark" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: dim/3 }}>
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        {/* duas formas de "C" espelhadas que se tocam — pactuação */}
        <path d="M16 8 A 16 16 0 0 0 16 40" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <path d="M32 8 A 16 16 0 0 1 32 40" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <circle cx="24" cy="24" r="3" fill={ink} />
      </svg>
      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: wmFz, letterSpacing: "-0.018em", color: onDark ? "white" : "var(--c-ink-editorial)" }}>
        {name}
      </span>
    </span>
  );
};

// ── Variante D · Ciclo (3 setas formando círculo) ──────────────────────
const LogoD = ({ name = "PGD Libre", onDark = false, size = "md" }) => {
  const dim = { sm: 28, md: 36, lg: 50, xl: 68 }[size];
  const wmFz = { sm: 14, md: 17, lg: 24, xl: 34 }[size];
  const ink = onDark ? "white" : "var(--c-ink-editorial)";
  return (
    <span className={`lp-mark ${onDark ? "on-dark" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: dim/3 }}>
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        {/* 3 arcos coloridos formando círculo de ciclo */}
        <path d="M24 6 A 18 18 0 0 1 39.6 15" stroke="var(--c-primary)" strokeWidth="5" strokeLinecap="round" />
        <path d="M39.6 33 A 18 18 0 0 1 8.4 33" stroke="var(--c-success)" strokeWidth="5" strokeLinecap="round" />
        <path d="M8.4 15 A 18 18 0 0 1 24 6"   stroke="var(--c-accent)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4" fill={ink} />
      </svg>
      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: wmFz, letterSpacing: "-0.018em", color: onDark ? "white" : "var(--c-ink-editorial)" }}>
        {name}
      </span>
    </span>
  );
};

// Variante padrão (a que eu recomendo para o produto): A — geométrica institucional
const Logo = LogoA;

Object.assign(window, { Logo, LogoA, LogoB, LogoC, LogoD });
