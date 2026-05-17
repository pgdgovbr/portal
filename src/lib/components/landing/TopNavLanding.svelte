<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<header class="lp-topnav" aria-label="Cabeçalho da landing">
	<div class="lp-wrap-wide lp-topnav-inner">
		<a href="/" aria-label="PGD Livre — início">
			<Logo size="md" />
		</a>

		<nav class="lp-topnav-nav" aria-label="Navegação primária">
			<a href="#norma">Norma</a>
			<a href="#ia">IA</a>
			<a href="#conformidade">Conformidade</a>
			<a href="#arquitetura">Arquitetura</a>
		</nav>

		<div class="lp-topnav-cta">
			<a href="https://pgdgovbr.github.io/docs/" class="lp-btn lp-btn-sm lp-btn-outline">
				Documentação
			</a>
			<a href="https://github.com/pgdgovbr" class="lp-btn lp-btn-sm lp-btn-outline">
				Repositório
			</a>
			<a href="/login" class="lp-btn lp-btn-sm lp-btn-primary">Acessar demonstração</a>
		</div>
	</div>
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
	@media (max-width: 900px) {
		.lp-topnav-nav {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.lp-topnav-cta a:not(.lp-btn-primary) {
			display: none;
		}
	}
</style>
