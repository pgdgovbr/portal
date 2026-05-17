// landing-app.jsx — composição no design canvas

function App() {
  return (
    <DesignCanvas>
      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="recomendacoes"
        title="Recomendações de UX"
        subtitle="Respostas às 7 decisões abertas no briefing. Cards de spec rápida pro Code seguir."
      >
        {[
          {
            num: "1",
            ttl: "Identidade visual",
            dec: "Paleta própria, derivada da existente. Adiciono ocre #C77400 reposicionado como acento editorial (não warning).",
            why: "Mantém memória visual com o app, mas a landing ganha respiração editorial: tipografia maior, mais espaço em branco, acento quente em CTAs e destaques. Não vira gov.br genérico."
          },
          {
            num: "2",
            ttl: "URL da app autenticada",
            dec: "/app",
            why: "Curto, claro, técnico. /dashboard tem ruído com o conceito \"dashboard do papel X\". /painel mistura com /conformidade que já é painel."
          },
          {
            num: "3",
            ttl: "Hero",
            dec: "Screenshot real do dashboard em browser chrome estilizado, com 2 anotações flutuantes pequenas. Sem vídeo no fold (LCP).",
            why: "Screenshots reais > mockups inventados. Decisor de TI quer ver UI real antes de investir 30 minutos na demo. Anotações flutuantes (\"Em produção · MGI\", \"4 papéis · 1 sistema\") inserem prova social sem ser cringe."
          },
          {
            num: "4",
            ttl: "Screenshots reais na landing",
            dec: "Sim, em destaque — hero + cada mini-jornada (criativa C) usa screenshot real.",
            why: "É o melhor argumento de venda. 35+ capturas disponíveis em docs/."
          },
          {
            num: "5",
            ttl: "Grade de personas",
            dec: "Cards visuais com avatares iniciais+cor, agrupados por jornada — 4 recomendados em destaque, resto em <details> colapsável.",
            why: "10 personas direto na cara é paralisia. \"Comece por aqui\" com Marta/Ana/Carlos/Maria cobre os 4 papéis principais. Quem quer experimentar mais (chefia 2, admin), expande."
          },
          {
            num: "6",
            ttl: "OAuth Google",
            dec: "Mantido, mas secundário — abaixo do Gov.br com divisor \"ou\".",
            why: "Gov.br é o padrão oficial brasileiro. Mas em alguns órgãos só o Google institucional funciona — não remover."
          },
          {
            num: "7",
            ttl: "Banner \"instância demo\"",
            dec: "Persistente em rotas internas, faixa fina no topo, dispensável com X (memoriza por sessão). Botão \"Trocar persona\" no header.",
            why: "Discreto mas presente — alguém que abre uma página em outro dia precisa saber que é demo. Trocar persona vira ação de primeira classe (caso de uso comum em demo). Não desenhei essa parte específica nessa entrega; lembrete pro Code."
          },
        ].map((d, i) => (
          <DCArtboard key={i} id={`rec-${d.num}`} label={`${d.num} · ${d.ttl}`} width={760} height={360}>
            <div className="lp" style={{ padding: 32, background: "transparent" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--c-ink-editorial)", color: "white", fontFamily: "var(--ff-display)", fontWeight: 800, fontSize: 17, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{d.num}</span>
                <div>
                  <div className="lp-eyebrow">Decisão</div>
                  <h3 className="lp-h3" style={{ fontSize: 22, marginTop: 4 }}>{d.ttl}</h3>
                </div>
              </div>
              <div style={{ background: "white", padding: 16, borderRadius: 10, borderLeft: "3px solid var(--c-success)", marginBottom: 12 }}>
                <div className="lp-eyebrow" style={{ color: "var(--c-success)", marginBottom: 6 }}><span className="dot" style={{ background: "var(--c-success)" }} />Recomendação</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink-editorial)", margin: 0, lineHeight: 1.45 }}>{d.dec}</p>
              </div>
              <div style={{ background: "var(--c-paper-2)", padding: 16, borderRadius: 10 }}>
                <div className="lp-eyebrow" style={{ marginBottom: 6 }}>Por quê</div>
                <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: 0, lineHeight: 1.55 }}>{d.why}</p>
              </div>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="marca"
        title="Marca · 4 propostas + decisão"
        subtitle="O wordmark é trocável (PGD Libre ↔ PGD Livre). Foco está no símbolo. Veja as 4 e me diga qual seguir."
      >
        <DCArtboard id="logo-comp" label="Comparativo · 4 variantes" width={1080} height={680}>
          <div className="lp" style={{ padding: 48, background: "var(--c-paper)" }}>
            <div className="lp-eyebrow" style={{ marginBottom: 12 }}>Variantes propostas</div>
            <h2 className="lp-h2" style={{ fontSize: 30, marginBottom: 36 }}>Qual marca define o produto?</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }}>
              {[
                { Comp: LogoA, ttl: "A · Geométrico institucional", desc: "Quadrado escuro com letra inicial + ponto verde de \"ativo\". Memória visual com o logo atual implementado. Refinamento mínimo do que existe." },
                { Comp: LogoB, ttl: "B · Três barras (P/G/D)",       desc: "Três barras horizontais empilhadas com cores diferentes — metáfora visual do ciclo plano-execução-avaliação. Cresce com a paleta do produto." },
                { Comp: LogoC, ttl: "C · Pactuação",                  desc: "Duas formas espelhadas que se tocam — bilateral. Conceitualmente forte mas pode parecer mais marca de mediação que de gestão." },
                { Comp: LogoD, ttl: "D · Ciclo (3 arcos)",            desc: "Três arcos formando círculo — ciclo do PGD. Mais ilustrativo, menos institucional." },
              ].map((v, i) => (
                <div key={i} style={{ background: "white", padding: 28, borderRadius: 14, border: "1px solid rgba(11,20,38,0.08)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
                    <v.Comp name="PGD Libre" size="lg" />
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
                    <v.Comp name="PGD Livre" size="md" />
                    <span style={{ fontSize: 11, color: "var(--c-muted)" }}>versão PT</span>
                  </div>
                  <strong style={{ fontSize: 14.5, color: "var(--c-ink-editorial)" }}>{v.ttl}</strong>
                  <p style={{ fontSize: 13, color: "var(--c-ink-2)", margin: "6px 0 0", lineHeight: 1.5 }}>{v.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: "18px 22px", background: "var(--c-accent-soft)", border: "1px solid rgba(199,116,0,0.22)", borderRadius: 12, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-accent)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-display)", fontWeight: 800 }}>!</span>
              <div style={{ flex: 1, fontSize: 13.5, color: "var(--c-accent-deep)", lineHeight: 1.5 }}>
                <strong>Minha recomendação: A (geométrico institucional).</strong> Mantém memória visual do produto já implementado,
                é o mais sóbrio (alinhado ao alvo decisor de TI), e o wordmark se troca facilmente quando você renomear o produto.
              </div>
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="logo-onuse" label="Marca em uso · dark mode e tamanhos" width={1080} height={520}>
          <div style={{ padding: 0, background: "var(--c-paper)" }}>
            <div style={{ background: "white", padding: 48, borderBottom: "1px solid rgba(11,20,38,0.06)" }}>
              <div className="lp-eyebrow" style={{ marginBottom: 18 }}>Light · sobre fundo claro</div>
              <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
                <LogoA name="PGD Libre" size="sm" />
                <LogoA name="PGD Libre" size="md" />
                <LogoA name="PGD Libre" size="lg" />
                <LogoA name="PGD Libre" size="xl" />
              </div>
            </div>
            <div style={{ background: "var(--c-ink-editorial)", padding: 48 }}>
              <div className="lp-eyebrow" style={{ marginBottom: 18, color: "rgba(255,255,255,0.55)" }}>Dark · sobre fundo escuro</div>
              <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
                <LogoA name="PGD Libre" onDark size="sm" />
                <LogoA name="PGD Libre" onDark size="md" />
                <LogoA name="PGD Libre" onDark size="lg" />
                <LogoA name="PGD Libre" onDark size="xl" />
              </div>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="landing"
        title="Landing Page (/)"
        subtitle="Página pública institucional. Long-scroll. Alvo: decisor de TI/Inovação de outro órgão pensando em adotar."
      >
        <DCArtboard id="landing-full" label="Landing · full-page (≈ 5400px)" width={1440} height={5400}>
          <ScreenLanding />
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="login"
        title="Login (/login)"
        subtitle="Oficiais e demo no mesmo viewport. Acesso via Gov.br/Google + escolha de persona pra explorar a demo."
      >
        <DCArtboard id="login-full" label="Login · viewport completo" width={1440} height={900}>
          <ScreenLogin />
        </DCArtboard>
        <DCArtboard id="app-handoff" label="/app · referência (não muda design)" width={1080} height={460}>
          <ScreenAppHandoff />
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="components"
        title="Componentes da landing · isolados"
        subtitle="Cada bloco como artboard separado, pra facilitar implementação Svelte e revisão peça a peça."
      >
        <DCArtboard id="cmp-hero" label="HeroBanner" width={1440} height={620}>
          <div className="lp"><HeroBanner screenshot="screenshots/servidor-dashboard.png" /></div>
        </DCArtboard>

        <DCArtboard id="cmp-stat" label="StatBar" width={1440} height={220}>
          <div className="lp"><StatBar /></div>
        </DCArtboard>

        <DCArtboard id="cmp-jornada" label="JornadaPersona · 1 instância" width={1200} height={520}>
          <div className="lp" style={{ padding: "0 48px" }}>
            <JornadaPersona
              persona="Ana Silva"
              role="Servidora"
              accent={{ bg: "#E6EEF8", fg: "#0F3D8C" }}
              screenshot="screenshots/servidor-meu-plano.png"
              items={[
                "Criar e assinar o próprio plano de trabalho.",
                "Registrar a execução mensal com lembrete automático.",
                "Receber avaliações com transparência, e contestar quando discordar.",
                "Acompanhar do celular: registro no mobile.",
              ]}
              demoEmail="servidor1"
            />
          </div>
        </DCArtboard>

        <DCArtboard id="cmp-timeline" label="ConformidadeTimeline" width={1440} height={500}>
          <div className="lp lp-section dark" style={{ padding: "56px 0", margin: 0 }}>
            <div className="lp-wrap">
              <div className="lp-eyebrow"><span className="dot" style={{ background: "#F5A623" }} />Conformidade automatizada</div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 26, fontWeight: 700, color: "white", margin: "12px 0 0", letterSpacing: "-0.018em" }}>A lei do PGD em uma linha do tempo viva.</h3>
              <ConformidadeTimeline />
            </div>
          </div>
        </DCArtboard>

        <DCArtboard id="cmp-banner" label="BannerInstalar" width={1080} height={280}>
          <div className="lp"><BannerInstalar /></div>
        </DCArtboard>

        <DCArtboard id="cmp-footer" label="FooterInstitucional" width={1440} height={460}>
          <div className="lp"><FooterInstitucional /></div>
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="login-blocks"
        title="Componentes do Login · isolados"
        subtitle="Os dois cards da tela de login, pra ver isolados em detalhe."
      >
        <DCArtboard id="lg-oficial" label="LoginOficial · card Gov.br + Google" width={460} height={520}>
          <div className="lp" style={{ padding: 24, background: "var(--c-paper)" }}>
            <LoginOficial />
          </div>
        </DCArtboard>

        <DCArtboard id="lg-demo" label="LoginDemo · card grade de personas" width={620} height={1000}>
          <div className="lp" style={{ padding: 24, background: "var(--c-paper)" }}>
            <LoginDemo />
          </div>
        </DCArtboard>
      </DCSection>

      {/* ════════════════════════════════════════════════════════════ */}
      <DCSection
        id="mobile"
        title="Mobile · Landing + Login"
        subtitle="Versões mobile das duas telas-chave. O hero mobile usa screenshot do produto mobile real."
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
