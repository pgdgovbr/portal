// landing-screens.jsx — Landing (/) + Login (/login) desktop

// ═══════════════════════════════════════════════════════════════════════
// Landing Page (/)
// ═══════════════════════════════════════════════════════════════════════
const ScreenLanding = () => (
  <div className="lp" data-screen-label="Landing · pública">
    <TopNavLanding />
    <HeroBanner screenshot="screenshots/servidor-dashboard.png" />
    <StatBar />

    {/* ────── Por que existe ────── */}
    <section className="lp-section cream" id="produto">
      <div className="lp-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 100 }}>
            <div className="lp-eyebrow"><span className="dot" />Por que existe</div>
            <h2 className="lp-h2" style={{ marginTop: 18 }}>
              O PGD virou lei. Os sistemas, não.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--c-ink-2)", marginBottom: 22 }}>
              O <strong>Decreto 11.072/2022</strong> instituiu o Programa de Gestão e Desempenho no
              serviço público federal. As Instruções Normativas 24 e 52/2023 definiram prazos,
              responsabilidades e o fluxo de pactuação entre servidor e chefia.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--c-ink-2)", marginBottom: 22 }}>
              Na prática, a maior parte dos órgãos opera o PGD em <em>planilhas Excel</em>, e-mails
              dispersos ou sistemas locais que não conversam com a API PGD Central do MGI.
              Resultado: prazos perdidos, avaliações sem rastro, conformidade frágil.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--c-ink-2)" }}>
              O <strong style={{ color: "var(--c-ink-editorial)" }}>PGD Libre</strong> resolve isso
              como software livre: instalável por qualquer órgão, aderente aos normativos por padrão,
              com sincronização nativa para a API Central — e código aberto para que cada órgão possa
              adaptá-lo sem depender de fornecedor.
            </p>

            <div style={{ marginTop: 36, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Decreto 11.072/2022", "IN 24/2023", "IN 52/2023", "API PGD Central"].map(t => (
                <span key={t} className="lp-chip legal">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ────── Para quem é · Mini-jornadas ────── */}
    <section className="lp-section" id="para-quem">
      <div className="lp-wrap">
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <div className="lp-eyebrow"><span className="dot" />Para quem é</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14 }}>
            Quatro papéis. Uma jornada coesa.
          </h2>
          <p className="lp-lede">
            Cada papel tem dashboard, fluxos e responsabilidades próprias. O sistema acompanha
            o ciclo legal completo, do plano de trabalho ao recurso de avaliação.
          </p>
        </div>

        <JornadaPersona
          persona="Ana Silva"
          role="Servidora"
          accent={{ bg: "#E6EEF8", fg: "#0F3D8C" }}
          screenshot="screenshots/servidor-meu-plano.png"
          items={[
            "Criar e assinar o próprio plano de trabalho — não dependo de a chefia preencher pra mim.",
            "Registrar a execução mensal com lembrete automático antes do prazo legal de 10 dias.",
            "Receber avaliações com transparência, e contestar quando discordar.",
            "Acompanhar do celular: registro pelo mobile no caminho do trabalho.",
          ]}
          demoEmail="servidor1"
        />

        <JornadaPersona
          persona="Carlos Souza"
          role="Chefia imediata"
          accent={{ bg: "#EFE8F7", fg: "#5C2D91" }}
          screenshot="screenshots/chefia-revisar-pt.png"
          items={[
            "Ver a equipe inteira em um painel: quem está pactuando, quem aguarda assinatura, quem precisa de avaliação.",
            "Revisar e assinar os planos enviados pelos servidores. Ajustar quando precisar — o sistema gerencia as assinaturas.",
            "Avaliar cada período com nota 1 a 5 e justificativa nos casos exigidos pela IN.",
            "Responder recursos dentro do prazo legal, sem perder o histórico.",
          ]}
          demoEmail="chefe1"
        />

        <JornadaPersona
          persona="Maria Fernanda"
          role="Gestão de unidade"
          accent={{ bg: "#E2F2E4", fg: "#168821" }}
          screenshot="screenshots/gestor-conformidade.png"
          items={[
            "Aprovar Planos de Entregas das unidades subordinadas com visão consolidada.",
            "Painel de conformidade: ver o que está sincronizado com a API Central do MGI, e o que falhou.",
            "Relatórios de servidores sem plano, prazos vencidos, distribuição de notas por unidade.",
            "Visão de gestão de pessoas alinhada à legislação, sem precisar abrir planilha.",
          ]}
          demoEmail="gestor"
        />
      </div>
    </section>

    {/* ────── Conformidade visível (criativa B) ────── */}
    <section className="lp-section dark" id="conformidade" style={{ background: "var(--c-ink-editorial)" }}>
      <div className="lp-wrap">
        <div style={{ maxWidth: 760 }}>
          <div className="lp-eyebrow"><span className="dot" style={{ background: "#F5A623" }} />Conformidade automatizada</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14, color: "white" }}>
            A lei do PGD em uma linha do tempo viva.
          </h2>
          <p className="lp-lede" style={{ color: "rgba(255,255,255,0.74)" }}>
            Cada etapa do ciclo está amarrada ao prazo do normativo. O sistema notifica antes do vencimento,
            registra o evento auditável e sincroniza com a API Central — sem ação manual da equipe.
          </p>
        </div>

        <ConformidadeTimeline />

        <div style={{ marginTop: 56, padding: "22px 26px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(245, 166, 35, 0.15)", color: "#F5A623", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div style={{ flex: 1, color: "rgba(255,255,255,0.82)", fontSize: 14.5, lineHeight: 1.55 }}>
            <strong style={{ color: "white" }}>Log de auditoria imutável</strong> registra cada criação,
            edição, assinatura e devolução — pronto para fiscalização interna ou de órgão de controle.
          </div>
          <a href="#" className="lp-chip" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.22)" }}>Ver na demo →</a>
        </div>
      </div>
    </section>

    {/* ────── Diferenciais técnicos ────── */}
    <section className="lp-section">
      <div className="lp-wrap">
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <div className="lp-eyebrow"><span className="dot" />Diferenciais</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14 }}>
            Decisões de arquitetura que importam.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          <DiferencialCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12l4-4 4 2 4-4 4 2 4-2v8l-4 2-4-2-4 4-4-2-4 4z"/></svg>}
            ttl="Pactuação bilateral"
            desc="Servidor e chefia firmam o plano com dupla assinatura. Edição derruba a assinatura do outro — sem ambiguidade jurídica."
            foot="Dec. 11.072/2022 · Art. 11"
          />
          <DiferencialCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>}
            ttl="Auditoria automática"
            desc="Cada ação gera um evento imutável. Histórico de edições visível, diff campo a campo, exportável."
          />
          <DiferencialCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>}
            ttl="Interopera com a API Central"
            desc="Envio nativo para a API PGD Central do MGI. Reprocessamento de falhas em painel próprio. Sem integração paralela."
          />
          <DiferencialCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>}
            ttl="Multi-tenant"
            desc="Uma instância pode servir múltiplos órgãos com isolamento total — útil para shared services."
          />
        </div>
      </div>
    </section>

    {/* ────── Open source · diagrama de stack ────── */}
    <section className="lp-section cream" id="open-source">
      <div className="lp-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="lp-eyebrow"><span className="dot" />Open source brasileiro</div>
            <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14 }}>
              Código aberto, licença MIT, sem fornecedor único.
            </h2>
            <p className="lp-lede" style={{ marginBottom: 22 }}>
              O PGD Libre é mantido pela <strong>Secretaria de Governo Digital (SGD)</strong>
              do Ministério da Gestão e da Inovação. Faz parte da organização pública
              <strong> pgdgovbr</strong> no GitHub — infraestrutura cívica brasileira.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              {[
                { num: "MIT",      lbl: "licença permissiva" },
                { num: "Docker",   lbl: "deploy padronizado" },
                { num: "GraphQL",  lbl: "API tipada" },
                { num: "SvelteKit", lbl: "frontend SSR" },
              ].map((s, i) => (
                <div key={i} style={{ background: "white", padding: 16, borderRadius: 10, border: "1px solid rgba(11, 20, 38, 0.08)" }}>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 18, color: "var(--c-ink-editorial)" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://github.com/pgdgovbr" className="lp-btn lp-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z"/></svg>
                pgdgovbr no GitHub
              </a>
              <a href="https://pgdgovbr.github.io/docs/" className="lp-btn lp-btn-outline">Documentação</a>
            </div>
          </div>

          {/* Mockup de "terminal" — instalação em 3 comandos */}
          <div style={{
            background: "var(--c-ink-editorial)",
            borderRadius: 14,
            padding: 26,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "var(--ff-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            boxShadow: "0 20px 50px -20px rgba(11, 20, 38, 0.4)",
          }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
              <span style={{ marginLeft: 12, fontSize: 11, color: "rgba(255,255,255,0.45)" }}># instalando no seu órgão</span>
            </div>
            <div><span style={{ color: "#F5A623" }}>$</span> git clone github.com/pgdgovbr/portal</div>
            <div><span style={{ color: "#F5A623" }}>$</span> cd portal && cp .env.example .env</div>
            <div><span style={{ color: "#F5A623" }}>$</span> docker compose up -d</div>
            <div style={{ marginTop: 14, color: "var(--c-success-soft)", borderTop: "1px dashed rgba(255,255,255,0.12)", paddingTop: 14 }}>
              <span style={{ color: "#1FA336" }}>✓</span> portal rodando em http://localhost:5173
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", marginTop: 18, fontSize: 12, lineHeight: 1.5 }}>
              # configure OAuth Google / Gov.br, ato de autorização<br />
              # e o token da API PGD Central no .env
            </div>
          </div>
        </div>
      </div>
    </section>

    <BannerInstalar />
    <FooterInstitucional />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// Login Page (/login)
// ═══════════════════════════════════════════════════════════════════════
const ScreenLogin = ({ demoFocus }) => (
  <div className="lp" data-screen-label="Login · oficial + demo" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {/* Header compacto */}
    <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11, 20, 38, 0.06)" }}>
      <Logo name="PGD Libre" size="md" />
      <a href="/" style={{ fontSize: 13, color: "var(--c-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
        Voltar para a landing
      </a>
    </div>

    {/* Body */}
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: 1080 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 className="lp-h2" style={{ fontSize: 36 }}>Como você quer entrar?</h1>
          <p className="lp-lede" style={{ margin: "12px auto 0" }}>
            Entre com sua conta oficial ou explore como uma persona da demonstração.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: demoFocus ? "1fr 1.5fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>
          <LoginOficial />
          <LoginDemo />
        </div>

        <p style={{ marginTop: 36, fontSize: 12.5, color: "var(--c-muted)", textAlign: "center", lineHeight: 1.55 }}>
          Numa instância de produção real, o card de demonstração não aparece.
          Você fica apenas com Gov.br e Google institucional.
        </p>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// /app — só uma referência (não muda design)
// ═══════════════════════════════════════════════════════════════════════
const ScreenAppHandoff = () => (
  <div className="pgd-app" data-density="confortavel" data-screen-label="/app · dashboard autenticado" style={{ padding: 40 }}>
    <div className="pg-eyebrow" style={{ marginBottom: 12 }}>Sem trabalho de design novo aqui</div>
    <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 12px" }}>
      /app — é o dashboard atual movido de rota
    </h2>
    <p style={{ color: "var(--c-muted)", fontSize: 14.5, lineHeight: 1.55, maxWidth: "60ch", margin: "0 0 24px" }}>
      A home autenticada que hoje vive em <code style={{ fontFamily: "var(--ff-mono)", fontSize: 13, background: "var(--c-surface-2)", padding: "1px 6px", borderRadius: 4 }}>/</code> deve
      passar a viver em <code style={{ fontFamily: "var(--ff-mono)", fontSize: 13, background: "var(--c-surface-2)", padding: "1px 6px", borderRadius: 4 }}>/app</code>.
      O design da página em si fica como está — esta tela existe apenas como referência da decisão de URL.
    </p>

    <div className="card" style={{ borderLeft: "3px solid var(--c-primary)", padding: 18 }}>
      <div className="kicker" style={{ color: "var(--c-primary)" }}>O que precisa mudar no código</div>
      <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.8 }}>
        <li>Renomear <code style={{ fontFamily: "var(--ff-mono)" }}>src/routes/+page.svelte</code> → <code style={{ fontFamily: "var(--ff-mono)" }}>src/routes/app/+page.svelte</code></li>
        <li>Criar <code style={{ fontFamily: "var(--ff-mono)" }}>src/routes/+page.svelte</code> novo (Landing)</li>
        <li>Atualizar <code style={{ fontFamily: "var(--ff-mono)" }}>+layout.server.ts</code>: rotas públicas (<code style={{ fontFamily: "var(--ff-mono)" }}>/</code>, <code style={{ fontFamily: "var(--ff-mono)" }}>/login</code>) não exigem auth; rotas internas redirecionam para <code style={{ fontFamily: "var(--ff-mono)" }}>/login?next=/app</code></li>
        <li>Ajustar redirect pós-login: <code style={{ fontFamily: "var(--ff-mono)" }}>/auth/login/* → /app</code></li>
      </ul>
    </div>
  </div>
);

Object.assign(window, { ScreenLanding, ScreenLogin, ScreenAppHandoff });
