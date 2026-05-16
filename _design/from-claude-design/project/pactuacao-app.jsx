// pactuacao-app.jsx — composição final do canvas do workflow de pactuação.

function App() {
  return (
    <DesignCanvas>

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="decisoes"
        title="7 decisões de UX — recomendações"
        subtitle="Respostas concretas para a seção 6 do briefing. Cada card vira spec para o Code seguir."
      >
        <DCArtboard id="d1" label="Decisão 1 · Wizard ou form único?" width={880} height={520}>
          <DecisionCard
            num={1}
            titulo="Edição: wizard ou form único?"
            problema="Hoje a chefia usa wizard de 5 passos. Pós-criação, faz sentido tela única com seções editáveis."
            decisao="Wizard só na primeira criação. Pós-criação e em ajustes, tela única com auto-save debounced."
            racional="Servidor que está criando o primeiro PT precisa de hand-holding. Quem já passou pelo fluxo conhece os campos — wizard vira atrito. A tela /meu-plano/[id]/editar é uma tela única segmentada (Período / Modalidade / Contribuições / Critérios) com Stepper só em /meu-plano/criar."
          />
        </DCArtboard>

        <DCArtboard id="d2" label="Decisão 2 · Como mostrar diff?" width={880} height={560}>
          <DecisionCard
            num={2}
            titulo="Como sinalizar o diff entre versões?"
            problema="3 alternativas: inline (cada campo destaca antes/agora), timeline expansível, ou side-by-side."
            decisao="Timeline com entradas expansíveis · diff side-by-side por campo dentro de cada entrada."
            racional="Diff inline polui a tela de edição quando os campos não mudaram. Side-by-side puro é caro de manter pra PTs grandes. Timeline + diff sob demanda casa com o resto do sistema (StatusTimeline já é o padrão), e mantém a interface limpa: quem quer ver detalhe, expande. Quando há mudanças não-lidas, a tela /revisar mostra um card-resumo separado «A chefia ajustou X campos» (igual ao mockup)."
          />
        </DCArtboard>

        <DCArtboard id="d3" label="Decisão 3 · Cancelar plano" width={880} height={400}>
          <DecisionCard
            num={3}
            titulo='"Cancelar plano" em rascunho'
            problema="É destrutivo mas reversível (servidor pode criar de novo)."
            decisao="Menu overflow (kebab), não botão destacado. Confirmação inline antes."
            racional="O botão Salvar/Assinar/Voltar já saturam o eixo de ações primárias. Cancelar mora no kebab no header. Confirmação inline (não modal) porque a ação não é catastrófica. Texto: «Descartar rascunho?» — não «Cancelar plano» (cancelar tem conotação errada — PT cancelado é estado final)."
          />
        </DCArtboard>

        <DCArtboard id="d4" label="Decisão 4 · Metáfora 'passa a bola'" width={880} height={520}>
          <DecisionCard
            num={4}
            titulo="Metáfora visual de 'passa a bola'"
            problema="Emojis (📝 → 📤 → ⏳)? Cores de fundo? Mascote?"
            decisao="Ícone + cor de borda + texto. Sem emojis. Sem mascote. Tom institucional preservado."
            racional="3 variantes do OwnershipBanner (veja seção «Componentes novos»): comigo-editor (azul primário · ícone edit), comigo-revisor (amarelo warning · ícone clock), com-outro (cinza · ícone paperPlane). Cada banner é persistente no topo da tela enquanto há bola, e some quando o estado avança. O texto é direto («Este plano está com você para ajustes») — não metáfora ('a bola está com você')."
          />
        </DCArtboard>

        <DCArtboard id="d5" label="Decisão 5 · Wizard do servidor" width={880} height={480}>
          <DecisionCard
            num={5}
            titulo="Wizard de criação pelo servidor"
            problema="Reaproveitar os 5 passos da chefia ou simplificar?"
            decisao="Reaproveita os 5 passos. Adiciona tooltips contextuais e banner de dicas. Step 1 inclui CTA inline para clonar."
            racional={"Os 5 steps (Período → Modalidade & carga → Critérios → Contribuições → Revisão) cobrem o que a IN exige. Cortar steps gera plano incompleto. O que muda: (a) copy mais didática em cada step; (b) tooltip ao lado de termos técnicos («o que é modalidade?», «como escolher carga?»); (c) banner amarelo só na primeira criação explicando os tipos 1/2/3 de contribuição; (d) link «conversar com sua chefia» persistente no aside."}
          />
        </DCArtboard>

        <DCArtboard id="d6" label="Decisão 6 · Estado vazio do /meu-plano" width={880} height={440}>
          <DecisionCard
            num={6}
            titulo="Estado vazio de /meu-plano"
            problema="Hoje mostra 'Solicite à sua chefia'. Agora vira 'Crie seu plano' + 'Clonar plano anterior'."
            decisao="Dois CTAs lado a lado: «Criar do zero» (primário, destacado) + «Clonar plano anterior» (secundário, só se há histórico). Texto de apoio explicando o fluxo bilateral."
            racional={`Sem onboarding modal — o estado vazio já é o onboarding. Lista de planos anteriores no aside reforça que clonar é uma opção real. Bloco "Casos especiais" no aside menciona que a chefia pode criar em situações excepcionais (recém-chegado, ausência) — sem destacar, pra não distrair do caminho padrão.`}
          />
        </DCArtboard>

        <DCArtboard id="d7" label="Decisão 7 · Notificação 'plano recebido'" width={880} height={480}>
          <DecisionCard
            num={7}
            titulo="Notificação de 'plano recebido'"
            problema="Banner no dashboard? Toast? Sino com badge?"
            decisao="Combinar: sino com badge (já existe) + card destacado no dashboard + e-mail. O card some quando a ação é tomada."
            racional={"Toast é insuficiente — desaparece. Banner sozinho dá pouco contexto. Combinação: (1) ao receber, sino ganha badge vermelho; (2) dashboard mostra card «Plano aguardando sua assinatura» no topo, replicando o OwnershipBanner com botão direto «Revisar agora»; (3) e-mail dispara em paralelo (backend já trata). Ao assinar ou ajustar, card some e badge zera. Sem regra de fadeout por tempo — é uma ação legal, deve ficar até resolver."}
          />
        </DCArtboard>
      </DCSection>

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="status-badges"
        title="StatusBadge expandido — 8 estados"
        subtitle="Spec visual dos 3 novos status (rascunho participante/chefia, aguardando assinatura) + os 5 existentes."
      >
        <DCArtboard id="sb-spec" label="Catálogo de status" width={1080} height={760}>
          <div className="pgd-app" data-density="confortavel" style={{ padding: 36, background: "transparent" }}>
            <div className="pg-eyebrow">Spec · StatusBadge V2</div>
            <h2 style={{ fontFamily: "var(--ff-display)", fontSize: 22, fontWeight: 700, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
              8 estados do Plano de Trabalho
            </h2>
            <p style={{ color: "var(--c-muted)", fontSize: 13.5, marginBottom: 24, maxWidth: "60ch" }}>
              Os 3 estados novos respeitam a paleta existente — verde para "concluído"/avaliado segue como está, azul primário marca "rascunho do servidor" (papel padrão), roxo marca "rascunho da chefia" (exceção), amarelo marca pendência de ação humana.
            </p>

            <div className="card">
              <table className="tbl">
                <thead><tr>
                  <th>Status</th><th>Visual</th><th>Quando</th><th>Quem tem a bola</th>
                </tr></thead>
                <tbody>
                  {[
                    { s: "RASCUNHO_PARTICIPANTE",            when: "Servidor está elaborando",                    bola: "Servidor" },
                    { s: "AGUARDANDO_ASSINATURA_CHEFIA",      when: "Servidor assinou, chefia precisa decidir",    bola: "Chefia" },
                    { s: "RASCUNHO_CHEFIA",                   when: "Chefia ajustou ou criou (exceção)",           bola: "Chefia" },
                    { s: "AGUARDANDO_ASSINATURA_PARTICIPANTE",when: "Chefia assinou, servidor precisa decidir",    bola: "Servidor" },
                    { s: "EM_EXECUCAO",                       when: "Ambos assinaram a mesma versão",              bola: "—" },
                    { s: "CONCLUIDO",                         when: "Período encerrado, aguardando avaliação",     bola: "—" },
                    { s: "AVALIADO",                          when: "Avaliação final publicada",                   bola: "—" },
                    { s: "CANCELADO",                         when: "Descartado antes da execução",                bola: "—" },
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

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="ownership"
        title="OwnershipBanner — 8 contextos"
        subtitle="Banner persistente no topo de qualquer tela do PT. Comunica em quem está a bola. 3 visuais × 2 perspectivas + 2 readonly."
      >
        <DCArtboard id="ob-1" label="Comigo · editor (rascunho participante, servidor vê)" width={1100} height={180}>
          <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
            <OwnershipBanner variant="comigo-editor" atorOutro="Carlos Mendes (chefia)" />
          </div>
        </DCArtboard>

        <DCArtboard id="ob-2" label="Comigo · revisor (aguardando minha assinatura)" width={1100} height={180}>
          <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
            <OwnershipBanner variant="comigo-revisor" atorOutro="Ana Beatriz" diasEspera={2} mostrarDiff />
          </div>
        </DCArtboard>

        <DCArtboard id="ob-3" label="Com outro · enviei, aguardando" width={1100} height={180}>
          <div className="pgd-app" data-density="confortavel" style={{ padding: 24, background: "transparent" }}>
            <OwnershipBanner variant="com-outro" atorOutro="Carlos Mendes" diasEspera={1} />
          </div>
        </DCArtboard>
      </DCSection>

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="comps-novos"
        title="Componentes novos"
        subtitle="AssinaturaCard (com checkboxes de pactuação), EdicoesTimeline com diff expansível e CloneDialog."
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

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="telas-novas"
        title="Telas novas · fluxo do servidor"
        subtitle="As 3 rotas que precisam ser criadas em /meu-plano + estado vazio refinado."
      >
        <DCArtboard id="t-vazio" label="01 · /meu-plano · estado vazio (criar/clonar)" width={1280} height={1040}>
          <ScreenMeuPlanoVazio density="confortavel" />
        </DCArtboard>

        <DCArtboard id="t-criar" label="02 · /meu-plano/criar · wizard (step 4)" width={1280} height={1100}>
          <ScreenMeuPlanoCriar density="confortavel" />
        </DCArtboard>

        <DCArtboard id="t-editar" label="03 · /meu-plano/[id]/editar · tela única (bola comigo editor)" width={1280} height={1700}>
          <ScreenMeuPlanoEditar density="confortavel" />
        </DCArtboard>

        <DCArtboard id="t-revisar" label="04 · /meu-plano/[id]/revisar · aguardando minha assinatura" width={1280} height={1300}>
          <ScreenMeuPlanoRevisar density="confortavel" />
        </DCArtboard>
      </DCSection>

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="telas-chefia"
        title="Mudanças nas telas da chefia"
        subtitle="Lista da equipe ganha badges novos; detalhe do PT ganha OwnershipBanner e modo 'revisar'."
      >
        <DCArtboard id="t-eq" label="05 · /equipe · com badges de pactuação" width={1280} height={900}>
          <ScreenEquipeComBadges density="confortavel" />
        </DCArtboard>

        <DCArtboard id="t-pt-rev" label="06 · /equipe/planos-trabalho/[id] · chefia revisando" width={1280} height={1700}>
          <ScreenChefiaRevisar density="confortavel" />
        </DCArtboard>
      </DCSection>

      {/* ──────────────────────────────────────────────────────────── */}
      <DCSection
        id="mobile"
        title="Mobile das 3 telas-chave"
        subtitle="A pactuação pode chegar fora de hora — precisa funcionar no celular."
      >
        <DCArtboard id="m-vazio" label="M1 · /meu-plano vazio" width={460} height={950}>
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ScreenMobileMeuPlanoVazio />
          </div>
        </DCArtboard>

        <DCArtboard id="m-revisar" label="M2 · Servidor revisa plano ajustado pela chefia" width={460} height={950}>
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ScreenMobileMeuPlanoRevisar />
          </div>
        </DCArtboard>

        <DCArtboard id="m-chefia" label="M3 · Chefia revisa plano recebido do servidor" width={460} height={950}>
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ScreenMobileChefiaRevisar />
          </div>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
