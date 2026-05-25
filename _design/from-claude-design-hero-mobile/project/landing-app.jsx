// landing-app.jsx — composição no design canvas (Landing v2 institucional)

function App() {
  return (
    <DesignCanvas>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="landing"
        title="Landing Page (/)"
        subtitle="Página pública institucional · v2 formal · Decisor de TI/Inovação como alvo · sem CTAs frívolos."
      >
        <DCArtboard id="landing-full" label="Landing · full-page" width={1440} height={5800}>
          <ScreenLanding />
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="login"
        title="Login (/login) · apenas demo"
        subtitle="Acesso oficial via Gov.br é feito por redirect direto em produção real. Esta tela só aparece em instâncias de demonstração."
      >
        <DCArtboard id="login-full" label="Login · viewport completo" width={1440} height={1100}>
          <ScreenLogin />
        </DCArtboard>
        <DCArtboard id="app-handoff" label="/app · referência (não muda design)" width={1080} height={460}>
          <ScreenAppHandoff />
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="marca"
        title="Marca · PGD Livre (Variante B · três barras)"
        subtitle="Decisão final. Três barras horizontais empilhadas representam o ciclo plano-execução-avaliação."
      >
        <DCArtboard id="logo-onuse" label="Marca em uso · light e dark, todos os tamanhos" width={1080} height={520}>
          <div style={{ padding: 0, background: "var(--c-paper)" }}>
            <div style={{ background: "white", padding: 48, borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
              <div className="lp-eyebrow" style={{ marginBottom: 18 }}>Light · sobre fundo claro</div>
              <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
                <Logo name="PGD Livre" size="sm" />
                <Logo name="PGD Livre" size="md" />
                <Logo name="PGD Livre" size="lg" />
                <Logo name="PGD Livre" size="xl" />
              </div>
            </div>
            <div style={{ background: "var(--c-ink-editorial)", padding: 48 }}>
              <div className="lp-eyebrow" style={{ marginBottom: 18, color: "rgba(255,255,255,0.55)" }}>Dark · sobre fundo escuro</div>
              <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
                <Logo name="PGD Livre" onDark size="sm" />
                <Logo name="PGD Livre" onDark size="md" />
                <Logo name="PGD Livre" onDark size="lg" />
                <Logo name="PGD Livre" onDark size="xl" />
              </div>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="mobile"
        title="Mobile · Landing + Login"
        subtitle="Versões responsivas das duas telas-chave."
      >
        <DCArtboard id="m-landing" label="Mobile · Landing" width={460} height={950}>
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ScreenMobileLanding />
          </div>
        </DCArtboard>
        <DCArtboard id="m-login" label="Mobile · Login" width={460} height={950}>
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ScreenMobileLogin />
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
