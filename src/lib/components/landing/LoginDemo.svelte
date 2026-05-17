<script lang="ts">
	import PersonaCard, { type Persona } from './PersonaCard.svelte';

	interface Props {
		personas: Persona[];
	}

	let { personas }: Props = $props();

	const recomendadas = $derived(personas.filter((p) => p.grupo === 'recomendados'));
	const servidores = $derived(personas.filter((p) => p.grupo === 'servidor'));
	const chefia = $derived(personas.filter((p) => p.grupo === 'chefia'));
	const outros = $derived(personas.filter((p) => p.grupo === 'outros'));
	const restantesCount = $derived(servidores.length + chefia.length + outros.length);
</script>

<div class="login-demo">
	<div class="warn-banner" role="status">
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="var(--c-accent)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
		</svg>
		<div>
			<strong>Instância de demonstração.</strong> Dados fictícios podem ser resetados. Em
			produção real, o acesso é feito exclusivamente via <strong>Gov.br</strong>.
		</div>
	</div>

	<div class="lp-eyebrow"><span class="dot" style="background: var(--c-primary)"></span> Demonstração interativa</div>
	<h2 class="lp-h3 title">Escolha uma persona</h2>
	<p class="lede">
		Cada persona tem dados e ações reais simulados. Você verá o sistema pela perspectiva dela —
		servidor, chefia, gestor ou administrador.
	</p>

	{#if recomendadas.length > 0}
		<div class="block">
			<div class="block-label">
				<span style="color: var(--c-accent)">★</span> Comece por aqui
			</div>
			<div class="grid">
				{#each recomendadas as p (p.email)}
					<PersonaCard persona={p} recommended />
				{/each}
			</div>
		</div>
	{/if}

	{#if restantesCount > 0}
		<details class="more">
			<summary>
				Mais personas ({restantesCount})
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</summary>

			{#if servidores.length > 0}
				<div class="sub-block">
					<div class="sub-block-label">Servidores</div>
					<div class="grid">
						{#each servidores as p (p.email)}
							<PersonaCard persona={p} />
						{/each}
					</div>
				</div>
			{/if}

			{#if chefia.length > 0}
				<div class="sub-block">
					<div class="sub-block-label">Chefia</div>
					<div class="grid">
						{#each chefia as p (p.email)}
							<PersonaCard persona={p} />
						{/each}
					</div>
				</div>
			{/if}

			{#if outros.length > 0}
				<div class="sub-block">
					<div class="sub-block-label">Admin</div>
					<div class="grid">
						{#each outros as p (p.email)}
							<PersonaCard persona={p} />
						{/each}
					</div>
				</div>
			{/if}
		</details>
	{/if}
</div>

<style>
	.login-demo {
		background: white;
		border: 1px solid rgba(11, 20, 38, 0.08);
		border-radius: 16px;
		padding: 40px;
		box-shadow: 0 1px 3px rgba(11, 20, 38, 0.04);
	}
	.warn-banner {
		background: var(--c-accent-soft);
		border: 1px solid rgba(199, 116, 0, 0.22);
		border-radius: 10px;
		padding: 12px 14px;
		margin-bottom: 28px;
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.warn-banner svg {
		flex: none;
		margin-top: 1px;
	}
	.warn-banner div {
		font-size: 12.5px;
		color: var(--c-accent-deep);
		line-height: 1.5;
	}
	.title {
		font-size: 26px;
		margin-top: 12px;
		margin-bottom: 8px;
	}
	.lede {
		font-size: 14px;
		color: var(--c-muted);
		margin: 0 0 28px;
		line-height: 1.5;
		max-width: 60ch;
	}
	.block {
		margin-bottom: 24px;
	}
	.block-label,
	.sub-block-label {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--c-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.more summary {
		cursor: pointer;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--c-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 14px;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 8px;
		user-select: none;
	}
	.more summary::-webkit-details-marker {
		display: none;
	}
	.sub-block {
		margin-top: 14px;
		margin-bottom: 16px;
	}
	.sub-block-label {
		margin-bottom: 8px;
	}
	@media (max-width: 560px) {
		.login-demo {
			padding: 24px;
		}
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
