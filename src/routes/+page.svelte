<script lang="ts">
	import '$lib/landing.css';
	import TopNavLanding from '$lib/components/landing/TopNavLanding.svelte';
	import FooterInstitucional from '$lib/components/landing/FooterInstitucional.svelte';
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
</style>
