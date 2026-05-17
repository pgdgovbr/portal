<script lang="ts">
	import '$lib/landing.css';
	import TopNavLanding from '$lib/components/landing/TopNavLanding.svelte';
	import FooterInstitucional from '$lib/components/landing/FooterInstitucional.svelte';
	import ConformidadeTimeline from '$lib/components/landing/ConformidadeTimeline.svelte';
	import SeloConformidade from '$lib/components/landing/SeloConformidade.svelte';
	import RoadmapItem from '$lib/components/landing/RoadmapItem.svelte';
	import ArqItem from '$lib/components/landing/ArqItem.svelte';
	import Logo from '$lib/components/landing/Logo.svelte';
</script>

<svelte:head>
	<title>PGD Livre · Software Livre para o Programa de Gestão e Desempenho</title>
	<meta
		name="description"
		content="Plataforma de software livre aderente ao Decreto 11.072/2022 e às IN 24/2023 e 52/2023. Da pactuação bilateral ao envio à API PGD Central do MGI."
	/>
	<meta
		name="keywords"
		content="PGD, Programa de Gestão e Desempenho, Decreto 11.072, gov.br, software livre, AGPL"
	/>
	<meta property="og:title" content="PGD Livre" />
	<meta
		property="og:description"
		content="Gestão de desempenho conforme a norma, com a inteligência do nosso tempo."
	/>
	<meta property="og:locale" content="pt_BR" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="lp">
	<TopNavLanding />

	<main>
		<section class="lp-section lp-hero">
			<div class="lp-wrap-wide">
				<div class="lp-hero-grid">
					<div class="lp-hero-text">
						<span class="lp-eyebrow">
							<span class="dot"></span>
							Software Livre · AGPL-3.0
						</span>
						<h1 class="lp-h1">
							Gestão de desempenho conforme a norma, com a inteligência do nosso tempo.
						</h1>
						<p class="lp-lede">
							Plataforma aderente ao Decreto 11.072/2022 e às Instruções Normativas 24/2023 e
							52/2023. Da pactuação bilateral do plano de trabalho ao envio à API PGD Central
							do MGI — com auditoria imutável e ferramentas que ajudam a escrever melhor.
						</p>
						<div class="lp-hero-cta">
							<a href="/login" class="lp-btn lp-btn-primary lp-btn-lg">
								Acessar demonstração
							</a>
							<a
								href="https://pgdgovbr.github.io/docs/"
								class="lp-btn lp-btn-outline lp-btn-lg"
							>
								Ver documentação
							</a>
						</div>
						<div class="lp-hero-chips">
							<span class="lp-chip success">Aderente à norma · 4 papéis</span>
							<span class="lp-chip accent">Inteligência generativa integrada</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="lp-section lp-stat">
			<div class="lp-wrap">
				<div class="lp-stat-grid">
					<div>
						<div class="lp-stat-num">37</div>
						<div class="lp-stat-label">requisitos funcionais cobertos</div>
					</div>
					<div>
						<div class="lp-stat-num">4</div>
						<div class="lp-stat-label">papéis (servidor, chefia, gestor, admin)</div>
					</div>
					<div>
						<div class="lp-stat-num">AGPL</div>
						<div class="lp-stat-label">código sob 3.0 + conteúdo CC-BY-4.0</div>
					</div>
					<div>
						<div class="lp-stat-num">IaC</div>
						<div class="lp-stat-label">Terraform · deploy reproduzível</div>
					</div>
				</div>
			</div>
		</section>

		<section id="norma" class="lp-section">
			<div class="lp-wrap">
				<span class="lp-eyebrow"><span class="dot"></span> Atendimento à norma</span>
				<h2 class="lp-h2" style="margin-top: 16px">
					O PGD Livre nasce vinculado à norma — não como ferramenta paralela.
				</h2>
				<p class="lp-lede" style="margin-top: 20px">
					O Decreto 11.072/2022 e as Instruções Normativas conjuntas 24/2023 e 52/2023
					estabelecem como órgãos federais devem operar o Programa de Gestão e Desempenho. A
					plataforma cobre todos os artigos: ato de autorização, ato de instituição,
					pactuação do TCR, plano de entregas, plano de trabalho, registro de execução,
					avaliação, recurso, convocação presencial e desligamento.
				</p>
				<a
					href="https://pgdgovbr.github.io/docs/conceitos/programa/"
					class="lp-btn lp-btn-outline"
					style="margin-top: 28px"
				>
					Saiba mais sobre o Programa de Gestão →
				</a>
			</div>
		</section>

		<!-- Bloco 2: Ciclo da norma (dark) -->
		<section class="lp-section dark" id="ciclo">
			<div class="lp-wrap">
				<div style="max-width: 720px">
					<span class="lp-eyebrow"><span class="dot acc"></span> Ciclo da norma</span>
					<h2 class="lp-h2" style="margin-top: 18px; color: white">
						Da pactuação ao envio à API Central, sem ação manual.
					</h2>
					<p class="lp-lede" style="color: rgba(255,255,255,0.74); margin-top: 18px">
						Cada etapa do ciclo está amarrada ao prazo da norma. O sistema notifica antes do
						vencimento, registra o evento em log imutável e sincroniza com a API PGD Central
						— automatizando o que tradicionalmente exigia planilhas e e-mails.
					</p>
				</div>
				<ConformidadeTimeline />
				<div class="ciclo-links">
					<a href="https://pgdgovbr.github.io/docs/conceitos/pactuacao-bilateral/">
						Sobre a pactuação bilateral →
					</a>
					<a href="https://pgdgovbr.github.io/docs/conceitos/papeis/">
						Papéis e responsabilidades →
					</a>
					<a href="https://pgdgovbr.github.io/docs/conceitos/glossario/">
						Glossário do PGD →
					</a>
				</div>
			</div>
		</section>

		<!-- Bloco 3: Inteligência generativa -->
		<section class="lp-section" id="ia">
			<div class="lp-wrap">
				<div class="ia-grid">
					<div class="ia-sticky">
						<span class="lp-eyebrow">
							<span class="dot" style="background: var(--c-status-aval, #5C2D91)"></span>
							Inteligência generativa
						</span>
						<h2 class="lp-h2" style="margin-top: 18px">
							IA aplicada à escrita e revisão dos textos.
						</h2>
						<p class="ia-lede">
							Sem hype, sem caixa-preta. Cada uso de IA na plataforma resolve uma dor real do
							servidor ou da chefia — com prompt aberto, lacunas sinalizadas e nada inventado.
						</p>
					</div>

					<div>
						<div style="margin-bottom: 36px">
							<div class="ia-section-label">
								<span class="ia-chip ok">
									<span class="dot" style="background: var(--c-success)"></span>
									Disponível na demonstração
								</span>
							</div>
							<div class="ia-card-recurso">
								<div class="ia-card-icon">
									<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
										<path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" opacity=".6" />
									</svg>
								</div>
								<div style="flex: 1">
									<h3 class="ia-card-ttl">Reescrita assistida do Registro de Execução</h3>
									<p class="ia-card-desc">
										O servidor descreve o que executou no mês. A IA reestrutura segundo um
										template institucional — por entrega, cronológico, por contribuição do
										plano ou STAR — preservando todos os fatos do texto original. Quando
										faltar informação, sinaliza
										<code>[precisa de detalhe]</code> em vez de inventar.
									</p>
									<div style="display: flex; gap: 6px; flex-wrap: wrap">
										<span class="lp-chip ia-template-chip">Por entrega</span>
										<span class="lp-chip ia-template-chip">Cronológico</span>
										<span class="lp-chip ia-template-chip">Por contribuição</span>
										<span class="lp-chip ia-template-chip">STAR</span>
									</div>
									<a
										href="https://pgdgovbr.github.io/docs/servidor/registrar-execucao/"
										class="ia-card-link"
									>
										Detalhes da reescrita →
									</a>
								</div>
							</div>
						</div>

						<div>
							<div class="ia-section-label">
								<span class="ia-chip warn">
									<span class="dot" style="background: var(--c-accent)"></span>
									Em desenvolvimento
								</span>
							</div>
							<div style="display: flex; flex-direction: column; gap: 10px">
								<RoadmapItem
									ttl="PárcIA · IA Parceira do Servidor"
									desc="Aplicativo dedicado ao servidor, com registro de execução por áudio, formatação por IA, notificações granulares e alertas de prazo no celular."
									tag="App nativo"
								/>
								<RoadmapItem
									ttl="Resumo automático de PT e execuções"
									desc="Para a chefia revisar com agilidade: a IA produz um resumo do plano e das execuções do período antes da avaliação, com links para o trecho original."
								/>
								<RoadmapItem
									ttl="Rascunho de avaliação com o tom da chefia"
									desc="A partir do histórico de avaliações da chefia, a IA propõe um rascunho que respeita o estilo, formalidade e critérios habituais — sempre editável antes do envio."
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Bloco 4: Conformidade e padrões (cream) -->
		<section class="lp-section cream" id="conformidade">
			<div class="lp-wrap">
				<div style="max-width: 720px; margin-bottom: 40px">
					<span class="lp-eyebrow"><span class="dot"></span> Conformidade e padrões</span>
					<h2 class="lp-h2" style="margin-top: 18px; margin-bottom: 14px">
						Construído para o serviço público.
					</h2>
					<p class="lp-lede">
						Aderência a padrões de privacidade, acessibilidade, interoperabilidade e segurança
						que o serviço público federal exige — testáveis no código, não apenas declarados.
					</p>
				</div>

				<div class="selos-grid">
					<SeloConformidade
						status="em conformidade"
						ttl="LGPD"
						sub="Autenticação institucional, log imutável de auditoria, base para retenção e anonimização. Lei 13.709/2018."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="em conformidade"
						ttl="WCAG 2.1 AA"
						sub="Contrastes validados, navegação por teclado e foco visível nos componentes-chave. Padrão internacional W3C."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="em conformidade"
						ttl="e-MAG"
						sub="Modelo de Acessibilidade em Governo Eletrônico. Aderência às diretrizes brasileiras alinhadas ao WCAG."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v6H4zM4 14h16v6H4z" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="implementado"
						ttl="e-PING"
						sub="Padrões de Interoperabilidade do Governo Eletrônico. Integração nativa com a API PGD Central do MGI."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="implementado"
						ttl="CSP e cabeçalhos de segurança"
						sub="Content Security Policy testada no backend. Headers HTTP de segurança aplicados por padrão."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="implementado"
						ttl="Auditoria imutável"
						sub="Cada criação, edição, assinatura, devolução e ato de avaliação gera evento auditável persistido — sem rota de delete."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="implementado"
						ttl="Multi-tenant com isolamento"
						sub="Uma instância pode servir múltiplos órgãos com isolamento total de dados — útil para shared services."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18v18H3z" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>
						{/snippet}
					</SeloConformidade>

					<SeloConformidade
						status="implementado"
						ttl="Acesso institucional via Gov.br"
						sub="Identidade federada do cidadão e do servidor público brasileiro. Padrão único de autenticação."
					>
						{#snippet icon()}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11h-6M19 8v6" /></svg>
						{/snippet}
					</SeloConformidade>
				</div>
			</div>
		</section>

		<!-- Bloco 5: Arquitetura -->
		<section class="lp-section" id="arquitetura">
			<div class="lp-wrap">
				<div class="arq-grid">
					<div>
						<span class="lp-eyebrow"><span class="dot"></span> Arquitetura</span>
						<h2 class="lp-h2" style="margin-top: 18px; margin-bottom: 18px">
							Software Livre, desacoplado e auditável.
						</h2>
						<p class="lp-lede" style="margin-bottom: 22px; max-width: 60ch">
							Cada decisão arquitetural foi tomada para manter o controle do órgão sobre seus
							dados, evitar dependência de fornecedor único e permitir crescimento sem reescrita.
						</p>

						<div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px">
							<ArqItem
								ttl="Software Livre · AGPL-3.0 e CC-BY-4.0"
								sub="Código sob AGPL-3.0; conteúdo e documentação sob CC-BY-4.0. Sem dependência de fornecedor único, com garantia de auditabilidade."
							/>
							<ArqItem
								ttl="Backend desacoplado em GraphQL"
								sub="Possibilita frontends próprios do órgão, integrações analíticas e o próprio aplicativo mobile PárcIA, sem reescrita."
							/>
							<ArqItem
								ttl="Infraestrutura como código (IaC)"
								sub="Provisão completa em Terraform. Deploy reproduzível em qualquer provedor de nuvem, com auditoria de mudança de infraestrutura e facilidade de manutenção."
							/>
							<ArqItem
								ttl="Workflow de desenvolvimento com agentes"
								sub="Pipeline integrado com Claude Code permite ciclos de entrega de funcionalidades em horas — não em meses — preservando qualidade e revisão humana."
							/>
						</div>

						<div style="display: flex; gap: 8px; flex-wrap: wrap">
							<span class="lp-chip">SvelteKit · Svelte 5</span>
							<span class="lp-chip">FastAPI</span>
							<span class="lp-chip">Strawberry GraphQL</span>
							<span class="lp-chip">PostgreSQL</span>
							<span class="lp-chip">Docker</span>
							<span class="lp-chip">Terraform</span>
							<span class="lp-chip">Claude Code</span>
						</div>
					</div>

					<div class="arq-diagram">
						<span class="lp-eyebrow" style="margin-bottom: 18px">Diagrama · integração</span>

						<div class="arq-box arq-orgao">
							<div class="arq-box-head">
								<strong>Seu órgão</strong>
								<span class="lp-chip" style="font-size: 10.5px">self-hosted</span>
							</div>
							<Logo size="sm" />
							<div class="arq-box-desc">
								Plataforma auto-hospedada na infraestrutura do próprio órgão.
							</div>
						</div>

						<div class="arq-arrow">
							<span class="line"></span>
							<span class="arq-arrow-label">HTTPS · GraphQL · sync automático</span>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M12 5v14M19 12l-7 7-7-7" />
							</svg>
							<span class="line"></span>
						</div>

						<div class="arq-box arq-central">
							<div class="arq-box-head">
								<strong>MGI</strong>
								<span class="lp-chip arq-mgi-chip">obrigatória por norma</span>
							</div>
							<div class="arq-central-ttl">API PGD Central</div>
							<div class="arq-box-desc dark">
								Plataforma central do MGI que consolida participantes, planos e avaliações do
								PGD em todos os órgãos federais.
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Bloco 6: Em desenvolvimento (cream) -->
		<section class="lp-section cream">
			<div class="lp-wrap">
				<div style="max-width: 720px; margin-bottom: 36px">
					<span class="lp-eyebrow">
						<span class="dot" style="background: var(--c-accent)"></span>
						Em desenvolvimento
					</span>
					<h2 class="lp-h2" style="margin-top: 18px; margin-bottom: 14px">
						O que vem a seguir.
					</h2>
					<p class="lp-lede">
						Iniciativas em construção que expandem o alcance da plataforma. Roadmap aberto,
						público, ajustável às prioridades dos órgãos parceiros.
					</p>
				</div>

				<div class="roadmap-grid">
					<RoadmapItem
						ttl="Exportação de dados em CSV, JSON e YAML"
						desc="Para análise externa, integrações analíticas e auditoria por órgãos de controle."
					/>
					<RoadmapItem
						ttl="Exportação de PDF em lote"
						desc="Planos de Trabalho e registros de execução de uma unidade inteira em um arquivo, para arquivo institucional."
					/>
					<RoadmapItem
						ttl="Integração com GitHub Projects"
						desc="Importação automática de Planos de Trabalho e execuções a partir de issues e milestones. Ideal para equipes de desenvolvimento de software."
						tag="Integração SaaS"
					/>
					<RoadmapItem
						ttl="Integração com plataformas de gestão"
						desc="Conectores para Jira, Trello, Notion e demais ferramentas de gestão de projetos já adotadas pelas equipes."
						tag="Integração SaaS"
					/>
					<RoadmapItem
						ttl="Painel de notificações multicanal"
						desc="Configuração granular por evento e por canal: e-mail institucional, Telegram, Web Push, webhooks."
					/>
					<RoadmapItem
						ttl="Aplicativo PárcIA · IA parceira do servidor"
						desc="App dedicado com registro por áudio, alertas de prazo, lembretes contextuais e atalhos para registro mensal."
						tag="Aplicativo nativo"
					/>
				</div>
			</div>
		</section>

		<FooterInstitucional />
	</main>
</div>

<style>
	.lp-hero {
		padding-top: 56px;
		padding-bottom: 96px;
	}
	.lp-hero-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
	}
	.lp-hero-text {
		max-width: 760px;
	}
	.lp-h1 {
		margin-top: 24px;
		max-width: 18ch;
	}
	.lp-hero-cta {
		margin-top: 36px;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
	.lp-hero-chips {
		margin-top: 28px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.lp-stat {
		background: var(--c-paper-2);
		padding-top: 56px;
		padding-bottom: 56px;
	}
	.lp-stat-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 32px;
	}
	@media (max-width: 900px) {
		.lp-stat-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 560px) {
		.lp-hero {
			padding-bottom: 56px;
		}
	}

	/* Bloco 2 — Ciclo da norma (dark) */
	.ciclo-links {
		margin-top: 56px;
		display: flex;
		gap: 28px;
		flex-wrap: wrap;
	}
	.ciclo-links a {
		color: rgba(255, 255, 255, 0.92);
		text-decoration: none;
		font-size: 14.5px;
		font-weight: 500;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
		padding-bottom: 2px;
	}
	.ciclo-links a:hover {
		color: white;
		border-color: white;
	}

	/* Bloco 3 — Inteligência generativa */
	.ia-grid {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 80px;
		align-items: start;
	}
	.ia-sticky {
		position: sticky;
		top: 100px;
	}
	.ia-lede {
		font-size: 14px;
		color: var(--c-muted);
		margin-top: 16px;
		line-height: 1.55;
	}
	.ia-section-label {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
	}
	.ia-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.ia-chip.ok {
		background: var(--c-success-soft);
		color: var(--c-success);
	}
	.ia-chip.warn {
		background: var(--c-accent-soft);
		color: var(--c-accent-deep);
	}
	.ia-chip .dot {
		width: 6px;
		height: 6px;
		border-radius: 3px;
	}
	.ia-card-recurso {
		background: white;
		border: 1.5px solid rgba(92, 45, 145, 0.18);
		border-radius: 14px;
		padding: 28px;
		display: flex;
		gap: 22px;
		align-items: flex-start;
	}
	.ia-card-icon {
		width: 56px;
		height: 56px;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--c-status-aval, #5c2d91) 0%, #7b3fb8 100%);
		color: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.ia-card-ttl {
		font-family: var(--ff-display);
		font-size: 21px;
		font-weight: 700;
		margin: 0;
		color: var(--c-ink-editorial);
		letter-spacing: -0.015em;
	}
	.ia-card-desc {
		font-size: 14.5px;
		color: var(--c-ink-2);
		margin: 10px 0 14px;
		line-height: 1.6;
	}
	.ia-card-desc code {
		font-family: var(--ff-mono, ui-monospace, monospace);
		font-size: 12.5px;
		background: var(--c-paper-2);
		padding: 1px 6px;
		border-radius: 4px;
	}
	.ia-template-chip {
		background: #efe8f7;
		color: var(--c-status-aval, #5c2d91);
		border: 1px solid rgba(92, 45, 145, 0.18);
		font-size: 11px;
	}
	.ia-card-link {
		margin-top: 14px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		color: var(--c-status-aval, #5c2d91);
		text-decoration: none;
	}

	/* Bloco 4 — Conformidade (selos) */
	.selos-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}

	/* Bloco 5 — Arquitetura */
	.arq-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 80px;
		align-items: center;
	}
	.arq-diagram {
		background: var(--c-paper-2);
		border-radius: 16px;
		padding: 32px;
		border: 1px solid rgba(11, 20, 38, 0.08);
		position: relative;
	}
	.arq-box {
		border-radius: 12px;
		padding: 18px;
	}
	.arq-box-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	.arq-box-head strong {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.arq-orgao {
		background: white;
		border: 1.5px solid var(--c-primary);
		margin-bottom: 18px;
		box-shadow: 0 6px 20px -10px rgba(15, 61, 140, 0.3);
	}
	.arq-orgao .arq-box-head strong {
		color: var(--c-primary);
	}
	.arq-arrow {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: center;
		padding: 4px 0;
	}
	.arq-arrow .line {
		flex: 1;
		height: 1px;
		background: rgba(11, 20, 38, 0.18);
	}
	.arq-arrow-label {
		font-size: 11px;
		font-family: var(--ff-mono, ui-monospace, monospace);
		color: var(--c-muted);
	}
	.arq-arrow svg {
		color: var(--c-muted);
	}
	.arq-central {
		background: var(--c-ink-editorial);
		color: white;
		margin-top: 14px;
	}
	.arq-central .arq-box-head strong {
		color: rgba(255, 255, 255, 0.7);
	}
	.arq-mgi-chip {
		background: rgba(255, 255, 255, 0.1) !important;
		color: rgba(255, 255, 255, 0.85) !important;
		border: 1px solid rgba(255, 255, 255, 0.18) !important;
		font-size: 10.5px;
	}
	.arq-central-ttl {
		font-family: var(--ff-display);
		font-weight: 700;
		font-size: 16px;
	}
	.arq-box-desc {
		margin-top: 8px;
		font-size: 12px;
		color: var(--c-muted);
		line-height: 1.5;
	}
	.arq-box-desc.dark {
		color: rgba(255, 255, 255, 0.65);
	}

	/* Bloco 6 — Roadmap */
	.roadmap-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	@media (max-width: 900px) {
		.ia-grid,
		.arq-grid {
			grid-template-columns: 1fr;
			gap: 48px;
		}
		.ia-sticky {
			position: static;
		}
		.selos-grid {
			grid-template-columns: 1fr 1fr;
		}
		.roadmap-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.selos-grid {
			grid-template-columns: 1fr;
		}
		.ia-card-recurso {
			flex-direction: column;
		}
	}
</style>
