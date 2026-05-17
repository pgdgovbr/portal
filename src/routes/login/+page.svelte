<script lang="ts">
	import '$lib/landing.css';
	import Logo from '$lib/components/landing/Logo.svelte';
	import LoginDemo from '$lib/components/landing/LoginDemo.svelte';
	import type { Persona } from '$lib/components/landing/PersonaCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const personas = $derived((data.personas ?? []) as Persona[]);
</script>

<svelte:head>
	<title>Entrar · PGD Livre</title>
	<meta name="description" content="Acesso à demonstração interativa do PGD Livre — escolha uma das personas." />
</svelte:head>

<div class="lp">
	<header class="login-header">
		<div class="lp-wrap-wide login-header-inner">
			<a href="/" aria-label="PGD Livre — voltar à página inicial">
				<Logo size="md" />
			</a>
			<a class="back-link" href="/">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
				Voltar à página inicial
			</a>
		</div>
	</header>

	<main class="login-main">
		<div class="lp-wrap" style="max-width: 720px">
			<div class="login-intro">
				<span class="lp-eyebrow"><span class="dot"></span> Acesso à demonstração</span>
				<h1 class="lp-h2" style="margin-top: 16px">Demonstração do PGD Livre</h1>
				<p class="lp-lede" style="margin-top: 16px">
					Esta instância é exclusivamente para conhecer e testar a plataforma. Em produção
					real, o acesso é feito pelo <strong>Gov.br</strong> — a tela de demonstração não
					aparece.
				</p>
				<p style="margin-top: 12px; font-size: 14.5px">
					<a
						href="https://pgdgovbr.github.io/docs/demo/acesso/"
						style="color: var(--c-primary); font-weight: 600; text-decoration: none"
					>
						Ver as jornadas guiadas da demonstração →
					</a>
				</p>
			</div>

			<div style="margin-top: 36px">
				<LoginDemo {personas} />
			</div>
		</div>
	</main>
</div>

<style>
	.login-header {
		border-bottom: 1px solid rgba(11, 20, 38, 0.06);
		background: white;
	}
	.login-header-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 18px;
		padding-bottom: 18px;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: var(--c-muted);
		text-decoration: none;
	}
	.back-link:hover {
		color: var(--c-ink-editorial);
	}
	.login-main {
		padding: 64px 0 96px;
	}
	.login-intro {
		text-align: center;
		max-width: 640px;
		margin: 0 auto;
	}
	.login-intro .lp-lede {
		margin-left: auto;
		margin-right: auto;
	}
</style>
