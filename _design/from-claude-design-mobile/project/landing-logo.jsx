// landing-logo.jsx — Marca "PGD Livre" — Variante B (três barras horizontais)
//
// Decisão final: nome do produto é "PGD Livre" (PT-BR).
// Símbolo: três barras empilhadas representando o ciclo plano-execução-avaliação.

const Logo = ({ name = "PGD Livre", onDark = false, size = "md", barColor }) => {
  const dim = { sm: 28, md: 36, lg: 50, xl: 68 }[size];
  const wmFz = { sm: 14, md: 17, lg: 24, xl: 34 }[size];
  const ink = onDark ? "white" : "var(--c-ink-editorial)";
  const accent = barColor || "var(--c-accent)";
  const ok = "var(--c-success)";
  return (
    <span className={`lp-mark ${onDark ? "on-dark" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: dim/3 }}>
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6"  y="10" width="36" height="6" rx="2" fill={ink} />
        <rect x="6"  y="21" width="24" height="6" rx="2" fill={accent} />
        <rect x="6"  y="32" width="30" height="6" rx="2" fill={ok} />
      </svg>
      <span style={{ fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: wmFz, letterSpacing: "-0.018em", color: onDark ? "white" : "var(--c-ink-editorial)" }}>
        {name}
      </span>
    </span>
  );
};

// Aliases pra compatibilidade
const LogoA = Logo;
const LogoB = Logo;
const LogoC = Logo;
const LogoD = Logo;

Object.assign(window, { Logo, LogoA, LogoB, LogoC, LogoD });
