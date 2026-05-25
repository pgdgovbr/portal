// landing-screens.jsx — Landing (/) e Login (/login) · v2 institucional

// ═══════════════════════════════════════════════════════════════════════
// HeroScreenAIRewrite · phone mockup com a tela real de "Registrar execução"
// com o botão "Reescrever com IA" em destaque. Mobile-first: o produto é
// majoritariamente consumido em celular.
// ═══════════════════════════════════════════════════════════════════════
const HeroScreenAIRewrite = () =>
<div style={{
  width: 360,
  borderRadius: 36,
  padding: 10,
  background: "linear-gradient(180deg, #1d2333 0%, #0B1426 100%)",
  boxShadow:
    "0 40px 80px -30px rgba(11,20,38,0.45), " +
    "0 18px 40px -18px rgba(11,20,38,0.30), " +
    "0 0 0 1px rgba(11,20,38,0.10)",
  position: "relative",
}}>
    {/* Notch sutil */}
    <div style={{
      position: "absolute",
      top: 18, left: "50%", transform: "translateX(-50%)",
      width: 96, height: 22, borderRadius: 12,
      background: "#0B1426",
      zIndex: 2,
    }} />
    {/* Tela */}
    <div style={{
      borderRadius: 28,
      overflow: "hidden",
      background: "white",
      aspectRatio: "706 / 1506",
    }}>
      <img
        src="screenshots/mobile-registrar-ia.png"
        alt="Servidor registrando execução com apoio da IA"
        style={{ width: "100%", display: "block" }}
        fetchpriority="high"
      />
    </div>
  </div>;


// ═══════════════════════════════════════════════════════════════════════
// Landing Page (/)
// ═══════════════════════════════════════════════════════════════════════
const ScreenLanding = () =>
<div className="lp" data-screen-label="Landing · pública v2">
    <TopNavLanding />

    <HeroBanner>
      <HeroScreenAIRewrite />
    </HeroBanner>

    <StatBar />

    {/* ────── 1. Atendimento à norma ────── */}
    <section className="lp-section cream" id="norma">
      <div className="lp-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 100 }}>
            <div className="lp-eyebrow"><span className="dot" />Atendimento à norma</div>
            <h2 className="lp-h2" style={{ marginTop: 18 }}>
              Aderência integral ao marco normativo brasileiro.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--c-ink-2)", marginBottom: 22 }}>
              O <strong>Decreto 11.072/2022</strong> instituiu o Programa de Gestão e Desempenho no
              serviço público federal. As Instruções Normativas <strong>24/2023</strong> e <strong>52/2023</strong> definiram prazos,
              responsabilidades, pactuação bilateral e o ciclo completo de avaliação.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--c-ink-2)", marginBottom: 22 }}>
              O PGD Livre implementa <strong>os 37 requisitos funcionais</strong> derivados desses
              instrumentos, sem omissões nem interpretações parciais. Cada etapa do fluxo está amarrada
              ao artigo correspondente, com prazos legais transformados em alertas, notificações e
              eventos auditáveis.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--c-ink-2)" }}>
              É o que permite a um órgão adotar a plataforma com a tranquilidade de que estará em conformidade
              <strong> por construção</strong>, e não por adaptação posterior.
            </p>

            <div style={{ marginTop: 36, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Decreto 11.072/2022", "IN 24/2023", "IN 52/2023", "API PGD Central"].map((t) =>
            <span key={t} className="lp-chip legal">{t}</span>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ────── 2. Linha do tempo do ciclo (norma viva) ────── */}
    <section className="lp-section dark" style={{ background: "var(--c-ink-editorial)" }}>
      <div className="lp-wrap" data-comment-anchor="8aecdc3474-div-71-7">
        <div style={{ maxWidth: 760 }}>
          <div className="lp-eyebrow"><span className="dot" style={{ background: "var(--c-accent)" }} />Ciclo da norma</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14, color: "white" }}>
            Da pactuação ao envio à API Central, sem ação manual.
          </h2>
          <p className="lp-lede" style={{ color: "rgba(255,255,255,0.74)" }}>
            Cada etapa do ciclo está amarrada ao prazo da norma. O sistema notifica antes do vencimento,
            registra o evento em log imutável e sincroniza com a API PGD Central — automatizando
            o que tradicionalmente exigia planilhas e e-mails.
          </p>
        </div>
        <ConformidadeTimeline />
      </div>
    </section>

    {/* ────── 3. Inteligência generativa ────── */}
    <section className="lp-section" id="ia">
      <div className="lp-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 100 }}>
            <div className="lp-eyebrow"><span className="dot" style={{ background: "var(--c-status-aval)" }} />Inteligência generativa</div>
            <h2 className="lp-h2" style={{ marginTop: 18 }}>
              IA aplicada à escrita e revisão dos textos.
            </h2>
            <p style={{ fontSize: 14, color: "var(--c-muted)", marginTop: 16, lineHeight: 1.55 }}>
              Sem hype, sem caixa-preta. Cada uso de IA na plataforma resolve uma dor real do servidor
              ou da chefia — com prompt aberto, lacunas sinalizadas e nada inventado.
            </p>
          </div>

          <div>
            {/* Disponível na demonstração */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--c-success-soft)", color: "var(--c-success)",
                padding: "5px 12px", borderRadius: 999,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em"
              }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--c-success)" }} />
                  Disponível na demonstração
                </span>
              </div>

              <div style={{
              background: "white",
              border: "1.5px solid rgba(92, 45, 145, 0.18)",
              borderRadius: 14,
              padding: 28,
              display: "flex", gap: 22, alignItems: "flex-start"
            }}>
                <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: "linear-gradient(135deg, var(--c-status-aval) 0%, #7B3FB8 100%)",
                color: "white",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none"
              }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                    <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" opacity=".6" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 21, fontWeight: 700, margin: 0, color: "var(--c-ink-editorial)", letterSpacing: "-0.015em" }}>
                    Reescrita assistida do Registro de Execução
                  </h3>
                  <p style={{ fontSize: 14.5, color: "var(--c-ink-2)", margin: "10px 0 14px", lineHeight: 1.6 }}>
                    O servidor descreve o que executou no mês. A IA reestrutura segundo um template institucional —
                    por entrega, cronológico, por contribuição do plano ou STAR — preservando todos os fatos do
                    texto original. Quando faltar informação, sinaliza <code style={{ fontFamily: "var(--ff-mono)", fontSize: 12.5, background: "var(--c-paper-2)", padding: "1px 6px", borderRadius: 4 }}>[precisa de detalhe]</code> em vez de inventar.
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Por entrega", "Cronológico", "Por contribuição", "STAR"].map((t) =>
                  <span key={t} className="lp-chip" style={{ background: "#EFE8F7", color: "var(--c-status-aval)", border: "1px solid rgba(92, 45, 145, 0.18)", fontSize: 11 }}>{t}</span>
                  )}
                  </div>
                  <a href="https://pgdgovbr.github.io/docs/servidor/registrar-execucao/"
                     style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--c-status-aval)", textDecoration: "none" }}>
                    Detalhes da reescrita
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Em desenvolvimento (IA) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--c-accent-soft)", color: "var(--c-accent-deep)",
                padding: "5px 12px", borderRadius: 999,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em"
              }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--c-accent)" }} />
                  Em desenvolvimento
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <RoadmapItem
                ttl="PárcIA · IA Parceira do Servidor"
                desc="Aplicativo dedicado ao servidor, com registro de execução por áudio, formatação por IA, notificações granulares e alertas de prazo no celular."
                tag="App nativo" />
              
                <RoadmapItem
                ttl="Resumo automático de PT e execuções"
                desc="Para a chefia revisar com agilidade: a IA produz um resumo do plano e das execuções do período antes da avaliação, com links para o trecho original." />
              
                <RoadmapItem
                ttl="Rascunho de avaliação com o tom da chefia"
                desc="A partir do histórico de avaliações da chefia, a IA propõe um rascunho que respeita o estilo, formalidade e critérios habituais — sempre editável antes do envio." />
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ────── 4. Conformidade e padrões (selos) ────── */}
    <section className="lp-section cream" id="conformidade">
      <div className="lp-wrap">
        <div style={{ maxWidth: 720, marginBottom: 40 }}>
          <div className="lp-eyebrow"><span className="dot" />Conformidade e padrões</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14 }}>
            Construído para o serviço público.
          </h2>
          <p className="lp-lede">
            Aderência a padrões de privacidade, acessibilidade, interoperabilidade e segurança que o
            serviço público federal exige — testáveis no código, não apenas declarados.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <SeloConformidade
          status="em conformidade"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
          ttl="LGPD"
          sub="Autenticação institucional, log imutável de auditoria, base para retenção e anonimização. Lei 13.709/2018." />
        
          <SeloConformidade
          status="em conformidade"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>}
          ttl="WCAG 2.1 AA"
          sub="Contrastes validados, navegação por teclado e foco visível nos componentes-chave. Padrão internacional W3C." />
        
          <SeloConformidade
          status="em conformidade"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v6H4zM4 14h16v6H4z" /></svg>}
          ttl="e-MAG"
          sub="Modelo de Acessibilidade em Governo Eletrônico. Aderência às diretrizes brasileiras alinhadas ao WCAG." />
        
          <SeloConformidade
          status="implementado"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>}
          ttl="e-PING"
          sub="Padrões de Interoperabilidade do Governo Eletrônico. Integração nativa com a API PGD Central do MGI." />
        
          <SeloConformidade
          status="implementado"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          ttl="CSP e cabeçalhos de segurança"
          sub="Content Security Policy testada no backend. Headers HTTP de segurança aplicados por padrão." />
        
          <SeloConformidade
          status="implementado"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></svg>}
          ttl="Auditoria imutável"
          sub="Cada criação, edição, assinatura, devolução e ato de avaliação gera evento auditável persistido — sem rota de delete." />
        
          <SeloConformidade
          status="implementado"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>}
          ttl="Multi-tenant com isolamento"
          sub="Uma instância pode servir múltiplos órgãos com isolamento total de dados — útil para shared services." />
        
          <SeloConformidade
          status="implementado"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11h-6M19 8v6" /></svg>}
          ttl="Acesso institucional via Gov.br"
          sub="Identidade federada do cidadão e do servidor público brasileiro. Padrão único de autenticação." />
        
        </div>
      </div>
    </section>

    {/* ────── 5. Arquitetura ────── */}
    <section className="lp-section" id="arquitetura">
      <div className="lp-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="lp-eyebrow"><span className="dot" />Arquitetura</div>
            <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 18 }}>
              Software Livre, desacoplado e auditável.
            </h2>
            <p className="lp-lede" style={{ marginBottom: 22, maxWidth: "60ch" }}>
              Cada decisão arquitetural foi tomada para manter o controle do órgão sobre seus dados,
              evitar dependência de fornecedor único e permitir crescimento sem reescrita.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              <ArqItem
              ttl="Software Livre · AGPL-3.0 e CC-BY-4.0"
              sub="Código sob AGPL-3.0; conteúdo e documentação sob CC-BY-4.0. Sem dependência de fornecedor único, com garantia de auditabilidade." />
            
              <ArqItem
              ttl="Backend desacoplado em GraphQL"
              sub="Possibilita frontends próprios do órgão, integrações analíticas e o próprio aplicativo mobile PárcIA, sem reescrita." />
            
              <ArqItem
              ttl="Infraestrutura como código (IaC)"
              sub="Provisão completa em Terraform. Deploy reproduzível em qualquer provedor de nuvem, com auditoria de mudança de infraestrutura e facilidade de manutenção." />
            
              <ArqItem
              ttl="Workflow de desenvolvimento com agentes"
              sub="Pipeline integrado com Claude Code permite ciclos de entrega de funcionalidades em horas — não em meses — preservando qualidade e revisão humana." />
            
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["SvelteKit · Svelte 5", "FastAPI", "Strawberry GraphQL", "PostgreSQL", "Docker", "Terraform", "Claude Code"].map((t) =>
            <span key={t} className="lp-chip">{t}</span>
            )}
            </div>
          </div>

          {/* Diagrama-mockup: integração */}
          <div style={{
          background: "var(--c-paper-2)",
          borderRadius: 16,
          padding: 32,
          border: "1px solid rgba(11,20,38,0.08)",
          position: "relative"
        }}>
            <div className="lp-eyebrow" style={{ marginBottom: 18 }}>Diagrama · integração</div>

            {/* Órgão (este sistema) */}
            <div style={{
            background: "white", border: "1.5px solid var(--c-primary)",
            borderRadius: 12, padding: 18, marginBottom: 18,
            boxShadow: "0 6px 20px -10px rgba(15, 61, 140, 0.3)"
          }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ color: "var(--c-primary)", fontSize: 13, textTransform: "uppercase", letterSpacing: ".08em" }}>Seu órgão</strong>
                <span className="lp-chip" style={{ fontSize: 10.5 }}>self-hosted</span>
              </div>
              <Logo name="PGD Livre" size="sm" />
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--c-muted)" }}>
                Plataforma auto-hospedada na infraestrutura do próprio órgão.
              </div>
            </div>

            {/* Seta */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "4px 0" }}>
              <span style={{ flex: 1, height: 1, background: "var(--c-border-strong)" }} />
              <span style={{ fontSize: 11, fontFamily: "var(--ff-mono)", color: "var(--c-muted)" }}>HTTPS · GraphQL · sync automático</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              <span style={{ flex: 1, height: 1, background: "var(--c-border-strong)" }} />
            </div>

            {/* API Central */}
            <div style={{
            background: "var(--c-ink-editorial)", color: "white",
            borderRadius: 12, padding: 18, marginTop: 14
          }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textTransform: "uppercase", letterSpacing: ".08em" }}>MGI</strong>
                <span className="lp-chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)", fontSize: 10.5 }}>obrigatória por norma</span>
              </div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16 }}>API PGD Central</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                Plataforma central do MGI que consolida participantes, planos e avaliações do PGD em todos os órgãos federais.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ────── 6. Roadmap técnico (em desenvolvimento, lista) ────── */}
    <section className="lp-section cream">
      <div className="lp-wrap">
        <div style={{ maxWidth: 720, marginBottom: 36 }}>
          <div className="lp-eyebrow"><span className="dot" style={{ background: "var(--c-accent)" }} />Em desenvolvimento</div>
          <h2 className="lp-h2" style={{ marginTop: 18, marginBottom: 14 }}>
            O que vem a seguir.
          </h2>
          <p className="lp-lede">
            Iniciativas em construção que expandem o alcance da plataforma. Roadmap aberto,
            público, ajustável às prioridades dos órgãos parceiros.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <RoadmapItem
          ttl="Exportação de dados em CSV, JSON e YAML"
          desc="Para análise externa, integrações analíticas e auditoria por órgãos de controle." />
        
          <RoadmapItem
          ttl="Exportação de PDF em lote"
          desc="Planos de Trabalho e registros de execução de uma unidade inteira em um arquivo, para arquivo institucional." />
        
          <RoadmapItem
          ttl="Integração com GitHub Projects"
          desc="Importação automática de Planos de Trabalho e execuções a partir de issues e milestones. Ideal para equipes de desenvolvimento de software."
          tag="Integração SaaS" />
        
          <RoadmapItem
          ttl="Integração com plataformas de gestão"
          desc="Conectores para Jira, Trello, Notion e demais ferramentas de gestão de projetos já adotadas pelas equipes."
          tag="Integração SaaS" />
        
          <RoadmapItem
          ttl="Painel de notificações multicanal"
          desc="Configuração granular por evento e por canal: e-mail institucional, Telegram, Web Push, webhooks." />
        
          <RoadmapItem
          ttl="Aplicativo PárcIA · IA parceira do servidor"
          desc="App dedicado com registro por áudio, alertas de prazo, lembretes contextuais e atalhos para registro mensal."
          tag="Aplicativo nativo" />
        
        </div>
      </div>
    </section>

    <FooterInstitucional />
  </div>;


// ── ArqItem (item da seção arquitetura) ────────────────────────────────
const ArqItem = ({ ttl, sub }) =>
<div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
    <span style={{
    flex: "none",
    width: 28, height: 28, borderRadius: 8,
    background: "var(--c-success-soft)", color: "var(--c-success)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    marginTop: 2
  }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
    </span>
    <div>
      <strong style={{ fontSize: 15, color: "var(--c-ink-editorial)" }}>{ttl}</strong>
      <p style={{ fontSize: 13.5, color: "var(--c-ink-2)", margin: "4px 0 0", lineHeight: 1.55 }}>{sub}</p>
    </div>
  </div>;


// ═══════════════════════════════════════════════════════════════════════
// Login Page (/login) — APENAS DEMO
// ═══════════════════════════════════════════════════════════════════════
const ScreenLogin = () =>
<div className="lp" data-screen-label="Login · apenas demo" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(11, 20, 38, 0.06)" }}>
      <Logo name="PGD Livre" size="md" />
      <a href="/" style={{ fontSize: 13, color: "var(--c-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        Voltar à página inicial
      </a>
    </div>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: 720 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="lp-h2" style={{ fontSize: 34 }}>Demonstração do PGD Livre</h1>
          <p className="lp-lede" style={{ margin: "14px auto 0", fontSize: 17 }}>
            Esta é uma instância de demonstração. Em produção real, o acesso é feito
            exclusivamente via Gov.br.
          </p>
        </div>

        <LoginDemo />
      </div>
    </div>
  </div>;


// ═══════════════════════════════════════════════════════════════════════
// /app — referência (não muda design)
// ═══════════════════════════════════════════════════════════════════════
const ScreenAppHandoff = () =>
<div className="pgd-app" data-density="confortavel" data-screen-label="/app · dashboard autenticado" style={{ padding: 40 }}>
    <div className="pg-eyebrow" style={{ marginBottom: 12 }}>Sem trabalho de design novo aqui</div>
    <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 12px" }}>
      /app — é o dashboard atual movido de rota
    </h2>
    <p style={{ color: "var(--c-muted)", fontSize: 14.5, lineHeight: 1.55, maxWidth: "60ch", margin: "0 0 24px" }}>
      A home autenticada passa a viver em <code style={{ fontFamily: "var(--ff-mono)", fontSize: 13, background: "var(--c-surface-2)", padding: "1px 6px", borderRadius: 4 }}>/app</code>.
      A raiz <code style={{ fontFamily: "var(--ff-mono)", fontSize: 13, background: "var(--c-surface-2)", padding: "1px 6px", borderRadius: 4 }}>/</code> exibe esta landing institucional.
    </p>

    <div className="card" style={{ borderLeft: "3px solid var(--c-primary)", padding: 18 }}>
      <div className="kicker" style={{ color: "var(--c-primary)" }}>Resumo das mudanças de rota</div>
      <ul style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--c-ink-2)", margin: "10px 0 0", lineHeight: 1.8 }}>
        <li>Mover dashboard de <code style={{ fontFamily: "var(--ff-mono)" }}>/+page.svelte</code> → <code style={{ fontFamily: "var(--ff-mono)" }}>/app/+page.svelte</code></li>
        <li>Criar <code style={{ fontFamily: "var(--ff-mono)" }}>/+page.svelte</code> como Landing pública</li>
        <li><code style={{ fontFamily: "var(--ff-mono)" }}>/login</code> exibe apenas demo (instâncias com <code style={{ fontFamily: "var(--ff-mono)" }}>PUBLIC_DEMO_MODE=true</code>); em produção real, redireciona direto para Gov.br</li>
        <li>Remover qualquer referência a OAuth Google das telas oficiais</li>
        <li>Redirect pós-login: <code style={{ fontFamily: "var(--ff-mono)" }}>/auth/login/govbr → /app</code></li>
      </ul>
    </div>
  </div>;


Object.assign(window, { ScreenLanding, ScreenLogin, ScreenAppHandoff, HeroScreenAIRewrite, ArqItem });