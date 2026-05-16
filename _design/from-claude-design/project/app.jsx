// app.jsx — main composition: design canvas + tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "densidade": "espacosa",
  "histView": "tabela"
}/*EDITMODE-END*/;

// Decisão de design: seletor de nota fixado na Variante A (Blocos coloridos).
const NOTA_STYLE = "blocos";

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Defensive: re-announce tweak availability to the host a few times after
  // mount, in case the initial postMessage from <TweaksPanel> raced the host's
  // listener and the toolbar toggle missed it.
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
        <DCSection
          id="fluxo-servidor"
          title="Fluxo do Servidor (Ana)"
          subtitle="P0 do MVP — Dashboard, Plano, Registro mensal, Avaliação recebida, Recurso."
        >
          <DCArtboard id="dashboard-srv" label="01 · Dashboard (Servidor)" width={1280} height={1100}>
            <ScreenDashboardServidor density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="meu-plano" label="02 · Meu Plano de Trabalho" width={1280} height={1700}>
            <ScreenMeuPlano density={t.densidade} histView={t.histView} />
          </DCArtboard>
          <DCArtboard id="registrar" label="03 · Registrar Execução (wizard)" width={1280} height={1280}>
            <ScreenRegistrar density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="detalhe-aval" label="04 · Detalhe de avaliação publicada" width={1080} height={1000}>
            <ScreenDetalheAvaliacao density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="contestar" label="05 · Contestar Avaliação (recurso)" width={1280} height={1400}>
            <ScreenContestar density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="empty-state" label="06 · Primeiro acesso (sem plano)" width={1280} height={1200}>
            <ScreenEmptyState density={t.densidade} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="fluxo-chefia"
          title="Fluxo da Chefia (Carlos)"
          subtitle="Telas 1–6 da perspectiva do chefe imediato — visão de equipe, planos sob sua gestão, avaliações."
        >
          <DCArtboard id="dashboard-chf" label="07 · Dashboard (Chefia)" width={1280} height={1000}>
            <ScreenDashboardChefia density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="lista-equipe" label="08 · Lista da Equipe" width={1440} height={1100}>
            <ScreenListaEquipe density={t.densidade} view={t.histView} />
          </DCArtboard>
          <DCArtboard id="plano-entregas" label="09 · Plano de Entregas" width={1280} height={1500}>
            <ScreenPlanoEntregas density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="detalhe-plano" label="10 · Detalhe do Plano de Trabalho" width={1280} height={1500}>
            <ScreenDetalhePlano density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="avaliar" label="11 · Avaliar Registro" width={1280} height={1400}>
            <ScreenAvaliar density={t.densidade} notaStyle={NOTA_STYLE} />
          </DCArtboard>
          <DCArtboard id="perfil-part" label="12 · Perfil do Participante" width={1280} height={1500}>
            <ScreenPerfilParticipante density={t.densidade} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="wizard"
          title="Wizard · Criar Plano de Trabalho"
          subtitle="Fluxo de 5 etapas para a chefia criar um plano: participante, carga, critérios, contribuições, revisão."
        >
          <DCArtboard id="wizard-1" label="13 · Wizard 1 — Participante & período" width={1280} height={1100}>
            <ScreenWizardStep1 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wizard-2" label="14 · Wizard 2 — Carga horária" width={1280} height={1100}>
            <ScreenWizardStep2 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wizard-3" label="15 · Wizard 3 — Critérios de avaliação" width={1280} height={1000}>
            <ScreenWizardStep3 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wizard-4" label="16 · Wizard 4 — Contribuições" width={1280} height={1500}>
            <ScreenWizardStep4 density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="wizard-5" label="17 · Wizard 5 — Revisão e envio" width={1280} height={1700}>
            <ScreenWizardStep5 density={t.densidade} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="fluxo-gestor"
          title="Fluxo do Gestor (Beatriz) & Admin"
          subtitle="Visão consolidada de várias unidades, relatórios legais, cadastros e tratamento de erros."
        >
          <DCArtboard id="dashboard-gst" label="18 · Dashboard (Gestor)" width={1280} height={1200}>
            <ScreenDashboardGestor density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="relatorios" label="19 · Relatórios" width={1280} height={1400}>
            <ScreenRelatorios density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="participantes" label="20 · Lista de Participantes" width={1440} height={1300}>
            <ScreenListaParticipantes density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="cadastrar" label="21 · Cadastrar Participante" width={1080} height={1400}>
            <ScreenCadastrarParticipante density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="conformidade" label="22 · Painel de Conformidade" width={1280} height={1400}>
            <ScreenConformidade density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="erro-sync" label="23 · Erro de sincronização (drill-down)" width={1280} height={1200}>
            <ScreenErroSync density={t.densidade} />
          </DCArtboard>
          <DCArtboard id="institucional" label="24 · Gestão Institucional" width={1280} height={1500}>
            <ScreenInstitucional density={t.densidade} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="sistema"
          title="Transversais"
          subtitle="Notificações compartilhadas entre todos os papéis."
        >
          <DCArtboard id="notificacoes" label="25 · Notificações (inbox)" width={1080} height={1100}>
            <ScreenNotificacoes density={t.densidade} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="mobile"
          title="Mobile · Servidor & Chefia"
          subtitle="Registrar execução no celular antes do prazo (servidor) e avaliar a equipe em movimento (chefia)."
        >
          <DCArtboard id="mob-dash-srv" label="M1 · Dashboard (Servidor)" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileDashboard />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-reg" label="M2 · Registrar Execução" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileRegistrar />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-dash-chf" label="M3 · Dashboard (Chefia)" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileDashboardChefia />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-equipe" label="M4 · Lista da Equipe (Chefia)" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileEquipe />
            </div>
          </DCArtboard>
          <DCArtboard id="mob-avaliar" label="M5 · Avaliar Registro (Chefia)" width={460} height={950}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <ScreenMobileAvaliar />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="componentes"
          title="Componentes em destaque"
          subtitle="Seletor de nota 1–5 (decisão: blocos coloridos) e linha do tempo de status."
        >
          <DCArtboard id="nota-blocos" label="Seletor de nota · Variante A (final)" width={720} height={460}>
            <ComponentNotaVariants style="blocos" />
          </DCArtboard>
          <DCArtboard id="timeline" label="Linha do tempo · status do plano" width={520} height={680}>
            <ComponentTimeline />
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
          Aplica em <strong>Lista da Equipe</strong> (Chefia) e no <strong>Histórico</strong> em Meu Plano.
        </div>

      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
