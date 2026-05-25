// app.jsx — Composição consolidada: PGD Libre (sistema completo) + Pactuação Bilateral.
//
// Mudança de paradigma vs. versão anterior:
// • O Servidor é o ator padrão da criação do Plano de Trabalho (alinhado ao
//   Dec. 11.072/2022 art. 11 e à IN 24/2023 art. 19).
// • A Chefia cria PT apenas em casos de exceção (servidor recém-chegado,
//   afastamento prolongado, etc.).
// • Pactuação bilateral: dupla assinatura, "passa a bola", diff entre versões.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "densidade": "espacosa",
  "histView": "tabela"
}/*EDITMODE-END*/;

// Decisão de design: seletor de nota fixado na Variante A (Blocos coloridos).
const NOTA_STYLE = "blocos";

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Reanuncia disponibilidade do Tweaks ao host após mount.
  React.useEffect(() => {
    const announce = () => window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    announce();
    const t1 = setTimeout(announce, 200);
    const t2 = setTimeout(announce, 1000);
    const t3 = setTimeout(announce, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <>
      <DesignCanvas>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* DECISÕES DE UX · referência rápida (vem do briefing da pactuação) */}
        <DCSection
          id="decisoes"
          title="Decisões de UX · pactuação bilateral"
          subtitle="Cards de spec que orientam a implementação. Resumo das 7 decisões do briefing original."
        >
          <DCArtboard id="d1" label="1 · Wizard ou form único?" width={880} height={520}>
            <DecisionCard
              num={1}
              titulo="Edição: wizard ou form único?"
              problema="Servidor cria o PT pela primeira vez (5 passos) e depois ajusta múltiplas vezes durante a pactuação."
              decisao="Wizard só na primeira criação. Pós-criação e em ajustes, tela única com auto-save debounced."
              racional="Servidor que está criando o primeiro PT precisa de hand-holding. Quem já passou pelo fluxo conhece os campos — wizard vira atrito. /meu-plano/[id]/editar é tela única segmentada (Período / Modalidade / Contribuições / Critérios). Stepper só em /meu-plano/criar."
            />
          </DCArtboard>

          <DCArtboard id="d2" label="2 · Como mostrar diff?" width={880} height={560}>
            <DecisionCard
              num={2}
              titulo="Como sinalizar o diff entre versões?"
              problema="3 alternativas: inline, timeline expansível, ou side-by-side."
              decisao="Timeline com entradas expansíveis · diff side-by-side por campo dentro de cada entrada."
              racional="Diff inline polui a tela de edição. Side-by-side puro é caro pra PTs grandes. Timeline + diff sob demanda casa com o StatusTimeline do sistema. Quando há mudanças não-lidas, a tela /revisar mostra card-resumo «A chefia ajustou X campos»."
            />
          </DCArtboard>

          <DCArtboard id="d3" label="3 · Cancelar plano em rascunho" width={880} height={400}>
            <DecisionCard
              num={3}
              titulo='"Cancelar plano" em rascunho'
              problema="É destrutivo mas reversível (servidor pode criar de novo)."
              decisao="Menu overflow (kebab), não botão destacado. Confirmação inline antes."
              racional="Cancelar mora no kebab no header. Confirmação inline (não modal). Texto: «Descartar rascunho?» — não «Cancelar plano» (cancelar tem conotação errada — PT cancelado é estado final)."
            />
          </DCArtboard>

          <DCArtboard id="d4" label="4 · Metáfora 'passa a bola'" width={880} height={520}>
            <DecisionCard
              num={4}
              titulo="Metáfora visual de 'passa a bola'"
              problema="Emojis? Cores de fundo? Mascote?"
              decisao="Ícone + cor de borda + texto. Sem emojis. Sem mascote. Tom institucional preservado."
              racional="3 variantes do OwnershipBanner: comigo-editor (azul · ícone edit), comigo-revisor (amarelo · ícone clock), com-outro (cinza · ícone paperPlane). Persistente no topo. Texto direto («Este plano está com você para ajustes»), não metáfora."
            />
          </DCArtboard>

          <DCArtboard id="d5" label="5 · Wizard do servidor" width={880} height={480}>
            <DecisionCard
              num={5}
              titulo="Wizard de criação pelo servidor"
              problema="Servidor é o ator padrão. Reaproveitar 5 passos ou simplificar?"
              decisao="Reaproveita os 5 passos. Adiciona tooltips contextuais e banner de dicas. Step 1 inclui CTA inline para clonar."
              racional={"5 steps (Período → Modalidade & carga → Critérios → Contribuições → Revisão) cobrem o que a IN exige. Cortar gera plano incompleto. O que muda: copy didática, tooltips em termos técnicos, banner só na primeira criação explicando tipos 1/2/3 de contribuição."}
            />
          </DCArtboard>

          <DCArtboard id="d6" label="6 · Estado vazio do /meu-plano" width={880} height={440}>
            <DecisionCard
              num={6}
              titulo="Estado vazio de /meu-plano"
              problema="Sem PT vigente, o que o servidor vê?"
              decisao="Dois CTAs lado a lado: «Criar do zero» (primário) + «Clonar plano anterior» (secundário, só se há histórico). Texto explica o fluxo bilateral."
              racional={`Sem onboarding modal — o estado vazio é o onboarding. Lista de planos anteriores no aside reforça que clonar é opção real. Bloco "Casos especiais" no aside menciona que a chefia pode criar em situações excepcionais.`}
            />
          </DCArtboard>

          <DCArtboard id="d7" label="7 · Notificação 'plano recebido'" width={880} height={480}>
            <DecisionCard
              num={7}
              titulo="Notificação de 'plano recebido'"
              problema="Como avisar o revisor que recebeu PT para assinar?"
              decisao="Sino com badge + card destacado no dashboard + e-mail. Card persiste até a ação ser tomada."
              racional={"Toast desaparece. Banner sozinho dá pouco contexto. Combinação: sino ganha badge; dashboard mostra card «Plano aguardando sua assinatura» replicando o OwnershipBanner. E-mail dispara em paralelo. Ao assinar/ajustar, card some."}
            />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* COMPONENTES DO SISTEMA DE PACTUAÇÃO */}
        <DCSection
          id="status-badges"
          title="StatusBadge expandido — 8 estados"
          subtitle="Os 3 novos status da pactuação (rascunho, aguardando assinatura) + os 5 existentes."
        >
          <DCArtboard id="sb-spec" label="Catálogo de status do Plano de Trabalho" width={1080} height={760}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 36, background: "transparent" }}>
              <div className="pg-eyebrow">Spec · StatusBadge V2</div>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
                8 estados do Plano de Trabalho
              </h2>
              <p style={{ color: "var(--c-muted)", fontSize: 13.5, marginBottom: 24, maxWidth: "60ch" }}>
                Os 3 estados novos respeitam a paleta existente — azul primário marca "rascunho do servidor" (papel padrão),
                roxo marca "rascunho da chefia" (exceção), amarelo marca pendência de ação humana.
              </p>
              <div className="card">
                <table className="tbl">
                  <thead><tr>
                    <th>Status</th><th>Visual</th><th>Quando</th><th>Quem tem a bola</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { s: "RASCUNHO_PARTICIPANTE",             when: "Servidor está elaborando",                  bola: "Servidor" },
                      { s: "AGUARDANDO_ASSINATURA_CHEFIA",      when: "Servidor assinou, chefia precisa decidir",  bola: "Chefia" },
                      { s: "RASCUNHO_CHEFIA",                   when: "Chefia ajustou ou criou (exceção)",         bola: "Chefia" },
                      { s: "AGUARDANDO_ASSINATURA_PARTICIPANTE",when: "Chefia assinou, servidor precisa decidir",  bola: "Servidor" },
                      { s: "EM_EXECUCAO",                       when: "Ambos assinaram a mesma versão",            bola: "—" },
                      { s: "CONCLUIDO",                         when: "Período encerrado, aguardando avaliação",   bola: "—" },
                      { s: "AVALIADO",                          when: "Avaliação final publicada",                 bola: "—" },
                      { s: "CANCELADO",                         when: "Descartado antes da execução",              bola: "—" },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12, fontWeight: 600 }}>{r.s}</td>
                        <td><StatusBadgeV2 status={r.s} /></td>
                        <td style={{ fontSize: 13, color: "var(--c-ink-2)" }}>{r.when}</td>
                        <td>{r.bola === "—" ? <span style={{ color: "var(--c-muted-2)" }}>—</span> : <span className="bdg bdg-neutral">{r.bola}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="ownership-banner"
          title="OwnershipBanner — contextos"
          subtitle="Banner persistente no topo de qualquer tela do PT. Comunica em quem está a bola."
        >
          <DCArtboard id="ob-1" label="Comigo · editor (bola comigo para editar)" width={1100} height={180}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
              <OwnershipBanner variant="comigo-editor" atorOutro="Carlos Mendes (chefia)" />
            </div>
          </DCArtboard>
          <DCArtboard id="ob-2" label="Comigo · revisor (aguardando minha assinatura)" width={1100} height={180}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
              <OwnershipBanner variant="comigo-revisor" atorOutro="Nitai" diasEspera={2} mostrarDiff />
            </div>
          </DCArtboard>
          <DCArtboard id="ob-3" label="Com outro · enviei, aguardando" width={1100} height={180}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
              <OwnershipBanner variant="com-outro" atorOutro="Carlos Mendes" diasEspera={1} />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="comps-pactuacao"
          title="Componentes da pactuação"
          subtitle="AssinaturaCard, EdicoesTimeline com diff expansível, CloneDialog."
        >
          <DCArtboard id="ac-1" label="AssinaturaCard · antes de assinar" width={520} height={520}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
              <AssinaturaCard ator="Carlos Mendes (chefia)" />
            </div>
          </DCArtboard>
          <DCArtboard id="ac-2" label="AssinaturaCard · já assinada" width={520} height={140}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
              <AssinaturaCard ator="Carlos Mendes" dataAssinatura="14 mai 2026 · 16:08" />
            </div>
          </DCArtboard>
          <DCArtboard id="et" label="EdicoesTimeline · com diff expansível" width={560} height={820}>
            <div className="pgd-app" data-density="confortavel" style={{ padding: 28, background: "transparent" }}>
              <div className="kicker" style={{ marginBottom: 16 }}>Histórico desde a criação</div>
              <EdicoesTimeline items={TIMELINE_EXEMPLO} defaultExpanded={1} />
            </div>
          </DCArtboard>
          <DCArtboard id="cd" label="CloneDialog · modal" width={760} height={620}>
            <div className="pgd-app" data-density="confortavel" style={{ position: "relative", height: 580, background: "var(--c-bg-deep)" }}>
              <CloneDialog plano="PT-2025-08 · 1º sem/2025" onCancel={() => {}} onClone={() => {}} />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="comps-base"
          title="Componentes do sistema · base"
          subtitle="Seletor de nota 1–5 (decisão final: blocos coloridos) e linha do tempo de status."
        >
          <DCArtboard id="nota-blocos" label="Seletor de nota · Variante A (final)" width={720} height={460}>
            <ComponentNotaVariants style="blocos" />
          </DCArtboard>
          <DCArtboard id="timeline" label="Linha do tempo · status do plano" width={520} height={680}>
            <ComponentTimeline />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FLUXO DO SERVIDOR (NITAI) — pactuação no centro */}
        <DCSection
          id="fluxo-servidor"
          title="Fluxo do Servidor (Nitai)"
          subtitle="Persona principal. Servidor é quem cria o plano por padrão — segue Dec. 11.072/2022 art. 11."
        >
          <DCArtboard id="srv-01-dashboard" label="01 · Dashboard (Servidor)" width={1280} height={1100}>
            <ScreenDashboardServidor density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-02-vazio" label="02 · /meu-plano — vazio (criar/clonar)" width={1280} height={1040}>
            <ScreenMeuPlanoVazio density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-03-criar" label="03 · /meu-plano/criar — wizard servidor" width={1280} height={1100}>
            <ScreenMeuPlanoCriar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-04-editar" label="04 · /meu-plano/[id]/editar — tela única (bola comigo, edição)" width={1280} height={1700}>
            <ScreenMeuPlanoEditar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-05-revisar" label="05 · /meu-plano/[id]/revisar — aguarda minha assinatura" width={1280} height={1300}>
            <ScreenMeuPlanoRevisar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-06-meuplano" label="06 · /meu-plano — em execução" width={1280} height={1700}>
            <ScreenMeuPlano density={t.densidade} histView={t.histView} />
          </DCArtboard>

          <DCArtboard id="srv-07-registrar" label="07 · Registrar Execução (wizard)" width={1280} height={1280}>
            <ScreenRegistrar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-07b-ai-editing" label="07b · Registrar + IA (configurar reescrita)" width={1280} height={1600}>
            <ScreenRegistrar density={t.densidade} aiInitialState="editing" />
          </DCArtboard>

          <DCArtboard id="srv-07c-ai-preview" label="07c · Registrar + IA (revisar resultado)" width={1280} height={1700}>
            <ScreenRegistrar density={t.densidade} aiInitialState="previewing" />
          </DCArtboard>

          <DCArtboard id="srv-08-detalhe-aval" label="08 · Detalhe da avaliação publicada" width={1080} height={1000}>
            <ScreenDetalheAvaliacao density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-09-contestar" label="09 · Contestar Avaliação (recurso)" width={1280} height={1400}>
            <ScreenContestar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="srv-10-primeiro-acesso" label="10 · Primeiro acesso (sem TCR · caso exceção)" width={1280} height={1200}>
            <ScreenEmptyState density={t.densidade} />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FLUXO DA CHEFIA (CARLOS) — revisor por padrão */}
        <DCSection
          id="fluxo-chefia"
          title="Fluxo da Chefia (Carlos)"
          subtitle="Revisa o que o servidor enviou. Pode ajustar (devolve para o servidor reassinar) ou assinar (vira em execução)."
        >
          <DCArtboard id="chf-01-dashboard" label="11 · Dashboard (Chefia)" width={1280} height={1000}>
            <ScreenDashboardChefia density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="chf-02-equipe" label="12 · /equipe — lista com badges de pactuação" width={1280} height={900}>
            <ScreenEquipeComBadges density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="chf-03-equipe-legado" label="12b · /equipe — tabela / kanban / cards (densidade)" width={1440} height={1100}>
            <ScreenListaEquipe density={t.densidade} view={t.histView} />
          </DCArtboard>

          <DCArtboard id="chf-04-revisar-pt" label="13 · /equipe/planos-trabalho/[id] — revisar PT do servidor" width={1280} height={1700}>
            <ScreenChefiaRevisar density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="chf-05-detalhe" label="14 · Detalhe do Plano de Trabalho (Em execução)" width={1280} height={1500}>
            <ScreenDetalhePlano density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="chf-06-avaliar" label="15 · Avaliar Registro mensal" width={1280} height={1400}>
            <ScreenAvaliar density={t.densidade} notaStyle={NOTA_STYLE} />
          </DCArtboard>

          <DCArtboard id="chf-07-perfil" label="16 · Perfil do Participante" width={1280} height={1500}>
            <ScreenPerfilParticipante density={t.densidade} />
          </DCArtboard>

          <DCArtboard id="chf-08-plano-entregas" label="17 · Plano de Entregas da unidade" width={1280} height={1500}>
            <ScreenPlanoEntregas density={t.densidade} />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* WIZARD COMO CHEFIA — CASO EXCEÇÃO */}
        <DCSection
          id="wizard-chefia"
          title="Wizard · Chefia criando PT (caso exceção)"
          subtitle="Servidor é o ator padrão. Chefia usa este fluxo quando servidor está afastado, recém-chegado ou indisponível. Mesmos 5 passos."
        >
          <DCArtboard id="wzc-1" label="18 · Wizard (chefia) 1 — Participante & período" width={1280} height={1100}>
            <ScreenWizardStep1 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wzc-2" label="19 · Wizard (chefia) 2 — Carga horária" width={1280} height={1100}>
            <ScreenWizardStep2 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wzc-3" label="20 · Wizard (chefia) 3 — Critérios de avaliação" width={1280} height={1000}>
            <ScreenWizardStep3 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wzc-4" label="21 · Wizard (chefia) 4 — Contribuições" width={1280} height={1500}>
            <ScreenWizardStep4 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wzc-5" label="22 · Wizard (chefia) 5 — Revisão e envio" width={1280} height={1700}>
            <ScreenWizardStep5 density={t.densidade} />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FLUXO DO GESTOR & ADMIN */}
        <DCSection
          id="fluxo-gestor"
          title="Fluxo do Gestor (Beatriz) & Admin"
          subtitle="Visão consolidada de várias unidades, relatórios legais, cadastros e tratamento de erros de sync."
        >
          <DCArtboard id="gst-01-dashboard" label="23 · Dashboard (Gestor)" width={1280} height={1200}>
            <ScreenDashboardGestor density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-02-relatorios" label="24 · Relatórios" width={1280} height={1400}>
            <ScreenRelatorios density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-03-participantes" label="25 · Lista de Participantes" width={1440} height={1300}>
            <ScreenListaParticipantes density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-04-cadastrar" label="26 · Cadastrar Participante" width={1080} height={1400}>
            <ScreenCadastrarParticipante density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-05-conformidade" label="27 · Painel de Conformidade" width={1280} height={1400}>
            <ScreenConformidade density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-06-erro-sync" label="28 · Erro de sincronização (drill-down)" width={1280} height={1200}>
            <ScreenErroSync density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="gst-07-institucional" label="29 · Gestão Institucional" width={1280} height={1500}>
            <ScreenInstitucional density={t.densidade} />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* TRANSVERSAIS */}
        <DCSection
          id="sistema"
          title="Transversais"
          subtitle="Notificações compartilhadas entre todos os papéis."
        >
          <DCArtboard id="tr-notificacoes" label="30 · Notificações (inbox)" width={1080} height={1100}>
            <ScreenNotificacoes density={t.densidade} />
          </DCArtboard>
        </DCSection>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* MOBILE */}
        <DCSection
          id="mobile"
          title="Mobile · Servidor & Chefia"
          subtitle="A pactuação pode chegar fora de hora — precisa funcionar no celular. Registro de execução também."
        >
          <DCArtboard id="mob-srv-vazio" label="M1 · Servidor · /meu-plano vazio" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileMeuPlanoVazio />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-srv-revisar" label="M2 · Servidor · revisa ajuste da chefia" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileMeuPlanoRevisar />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-srv-dash" label="M3 · Servidor · Dashboard" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileDashboard />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-srv-reg" label="M4 · Servidor · Registrar Execução" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileRegistrar />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-chf-revisar" label="M5 · Chefia · revisa PT recebido" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileChefiaRevisar />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-chf-dash" label="M6 · Chefia · Dashboard" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileDashboardChefia />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-chf-equipe" label="M7 · Chefia · Lista da Equipe" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileEquipe />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-chf-avaliar" label="M8 · Chefia · Avaliar Registro" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileAvaliar />
            </div>
          </DCArtboard>
        </DCSection>

      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Sistema visual" />
        <TweakRadio
          label="Densidade"
          value={t.densidade}
          options={["compacta", "confortavel", "espacosa"]}
          onChange={(v) => setTweak("densidade", v)}
        />
        <TweakSection label="Visualização (listas)" />
        <TweakRadio
          label="Equipe & histórico"
          value={t.histView}
          options={["tabela", "kanban", "cards"]}
          onChange={(v) => setTweak("histView", v)}
        />
        <div style={{ padding: "2px 14px 8px", fontSize: 10.5, color: "rgba(0,0,0,.55)", lineHeight: 1.5 }}>
          Aplica em <strong>Lista da Equipe (legado)</strong> e no <strong>Histórico</strong> em Meu Plano.
        </div>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
