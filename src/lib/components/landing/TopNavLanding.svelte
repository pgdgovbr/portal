<script lang="ts">
	import Logo from './Logo.svelte';

	let menuOpen = $state(false);

	const NAV_LINKS = [
		{ href: '#norma', label: 'Norma' },
		{ href: '#ia', label: 'IA' },
		{ href: '#conformidade', label: 'Conformidade' },
		{ href: '#arquitetura', label: 'Arquitetura' }
	];

	const DRAWER_LINKS = [
		{ href: '#norma', label: 'Atendimento à norma' },
		{ href: '#ia', label: 'Inteligência generativa' },
		{ href: '#conformidade', label: 'Conformidade' },
		{ href: '#arquitetura', label: 'Arquitetura' },
		{ href: 'https://pgdgovbr.github.io/docs/', label: 'Documentação', external: true },
		{ href: 'https://github.com/pgdgovbr', label: 'Repositório', external: true }
	];

	function closeMenu() {
		menuOpen = false;
	}

	$effect(() => {
		if (!menuOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeMenu();
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	});
</script>

<header class="lp-topnav" aria-label="Cabeçalho da landing">
	<div class="lp-wrap-wide lp-topnav-inner">
		<a href="/" aria-label="PGD Livre — início" class="lp-topnav-brand">
			<Logo size="md" />
		</a>

		<nav class="lp-topnav-nav" aria-label="Navegação primária">
			{#each NAV_LINKS as link (link.href)}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<div class="lp-topnav-cta">
			<a href="https://pgdgovbr.github.io/docs/" class="lp-btn lp-btn-sm lp-btn-outline">
				Documentação
			</a>
			<a href="https://github.com/pgdgovbr" class="lp-btn lp-btn-sm lp-btn-outline">Repositório</a>
			<a href="/login" class="lp-btn lp-btn-sm lp-btn-primary">Acessar demonstração</a>
		</div>

		<button
			type="button"
			class="lp-topnav-burger"
			class:is-open={menuOpen}
			aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
			aria-expanded={menuOpen}
			aria-controls="lp-mobile-drawer"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{#if menuOpen}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			{:else}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M3 6h18M3 12h18M3 18h18" />
				</svg>
			{/if}
		</button>
	</div>

	{#if menuOpen}
		<div
			id="lp-mobile-drawer"
			class="lp-mobile-drawer"
			role="dialog"
			aria-modal="true"
			aria-label="Menu de navegação"
		>
			<ul>
				{#each DRAWER_LINKS as item, i (item.href)}
					<li style="--i:{i}">
						<a
							href={item.href}
							onclick={closeMenu}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noreferrer' : undefined}
						>
							<span>{item.label}</span>
							{#if item.external}
								<svg
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M7 17L17 7M9 7h8v8" />
								</svg>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
			<a href="/login" class="lp-btn lp-btn-primary drawer-cta" onclick={closeMenu}>
				Acessar demonstração
			</a>
		</div>
	{/if}
</header>

<style>
	.lp-topnav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(252, 251, 248, 0.85);
		backdrop-filter: saturate(180%) blur(10px);
		-webkit-backdrop-filter: saturate(180%) blur(10px);
		border-bottom: 1px solid rgba(11, 20, 38, 0.06);
	}
	.lp-topnav-inner {
		display: flex;
		align-items: center;
		gap: 32px;
		padding-top: 16px;
		padding-bottom: 16px;
	}
	.lp-topnav-brand {
		text-decoration: none;
	}
	.lp-topnav-nav {
		display: flex;
		gap: 28px;
		margin-left: 8px;
	}
	.lp-topnav-nav a {
		color: var(--c-ink-2);
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: color 0.15s ease;
	}
	.lp-topnav-nav a:hover {
		color: var(--c-ink-editorial);
	}
	.lp-topnav-cta {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.lp-topnav-burger {
		display: none;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		border: 1px solid rgba(11, 20, 38, 0.1);
		background: white;
		color: var(--c-ink-editorial);
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		transition: border-color 180ms ease, background 180ms ease;
	}
	.lp-topnav-burger.is-open {
		border-color: var(--c-accent);
		background: var(--c-paper-2);
	}

	/* Drawer */
	.lp-mobile-drawer {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--c-paper);
		border-bottom: 1px solid rgba(11, 20, 38, 0.08);
		box-shadow: 0 12px 30px -18px rgba(11, 20, 38, 0.25);
		padding: 8px 20px 20px;
		animation: drawer-slide-down 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
		transform-origin: top center;
	}
	.lp-mobile-drawer ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.lp-mobile-drawer li {
		opacity: 0;
		transform: translateY(-4px);
		animation: drawer-item 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(80ms + var(--i) * 25ms);
	}
	.lp-mobile-drawer a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 4px;
		font-size: 15px;
		font-weight: 500;
		color: var(--c-ink-editorial);
		text-decoration: none;
		border-bottom: 1px solid rgba(11, 20, 38, 0.05);
	}
	.lp-mobile-drawer a svg {
		opacity: 0.5;
	}
	.lp-mobile-drawer .drawer-cta {
		justify-content: center;
		padding: 13px;
		width: 100%;
		margin-top: 14px;
	}

	@keyframes drawer-slide-down {
		from {
			opacity: 0;
			transform: translateY(-12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes drawer-item {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lp-mobile-drawer,
		.lp-mobile-drawer li {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}

	@media (max-width: 1024px) {
		.lp-topnav-nav {
			display: none;
		}
	}
	@media (max-width: 900px) {
		.lp-topnav-cta a:not(.lp-btn-primary) {
			display: none;
		}
	}
	@media (max-width: 719px) {
		.lp-topnav-inner {
			padding-top: 12px;
			padding-bottom: 12px;
			padding-left: 18px;
			padding-right: 18px;
			max-width: 720px;
			gap: 12px;
		}
		.lp-topnav-cta {
			display: none;
		}
		.lp-topnav-burger {
			display: inline-flex;
		}
	}
</style>
