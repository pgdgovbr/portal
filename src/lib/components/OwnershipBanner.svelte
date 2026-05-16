<script lang="ts">
	import Icon from './Icon.svelte';

	export type OwnershipVariant = 'comigo-editor' | 'comigo-revisor' | 'com-outro';

	interface Props {
		variant: OwnershipVariant;
		atorOutro: string;
		diasEspera?: number;
		mostrarDiff?: boolean;
		onAssinar?: () => void;
		onAjustar?: () => void;
		onVerDiff?: () => void;
		onSalvarSair?: () => void;
		onEnviar?: () => void;
		onLembrar?: () => void;
	}

	let {
		variant,
		atorOutro,
		diasEspera,
		mostrarDiff = false,
		onAssinar,
		onAjustar,
		onVerDiff,
		onSalvarSair,
		onEnviar,
		onLembrar
	}: Props = $props();

	function diasLabel(d: number): string {
		return d === 1 ? '1 dia' : `${d} dias`;
	}

	const cfg = $derived.by(() => {
		switch (variant) {
			case 'comigo-editor':
				return {
					icon: 'edit',
					titulo: 'Este plano está com você para ajustes',
					sub: `Você pode editar livremente. Quando terminar, assine e envie para ${atorOutro}.`,
					modifier: 'editor'
				};
			case 'comigo-revisor':
				return {
					icon: 'clock',
					titulo: 'Aguardando sua assinatura',
					sub:
						diasEspera != null
							? `${atorOutro} enviou este plano há ${diasLabel(diasEspera)}.`
							: `${atorOutro} enviou este plano.`,
					modifier: 'revisor'
				};
			case 'com-outro':
				return {
					icon: 'paperPlane',
					titulo: `Plano enviado para ${atorOutro}`,
					sub:
						diasEspera != null
							? `Aguardando assinatura há ${diasLabel(diasEspera)}. Você acompanha mas não pode editar até receber de volta.`
							: 'Aguardando assinatura. Você acompanha mas não pode editar até receber de volta.',
					modifier: 'outro'
				};
		}
	});
</script>

<div
	class="ownership-banner ownership-{cfg.modifier}"
	role="status"
	aria-live="polite"
>
	<div class="ownership-icon">
		<Icon name={cfg.icon} size={22} stroke={1.8} />
	</div>
	<div class="ownership-text">
		<div class="ownership-title">{cfg.titulo}</div>
		<div class="ownership-sub">{cfg.sub}</div>
	</div>

	{#if variant === 'comigo-revisor'}
		<div class="ownership-actions">
			{#if mostrarDiff}
				<button type="button" class="btn btn-ghost btn-sm" onclick={onVerDiff}>
					<Icon name="history" size={14} /> Ver o que mudou
				</button>
			{/if}
			<button type="button" class="btn btn-ghost btn-sm" onclick={onAjustar}>
				<Icon name="edit" size={14} /> Ajustar
			</button>
			<button type="button" class="btn btn-primary" onclick={onAssinar}>
				<Icon name="check" size={15} stroke={2.4} /> Assinar
			</button>
		</div>
	{:else if variant === 'comigo-editor'}
		<div class="ownership-actions">
			<button type="button" class="btn btn-ghost btn-sm" onclick={onSalvarSair}
				>Salvar e sair</button
			>
			<button type="button" class="btn btn-primary" onclick={onEnviar}>
				<Icon name="paperPlane" size={15} /> Assinar e enviar
			</button>
		</div>
	{:else if variant === 'com-outro'}
		<div class="ownership-actions">
			<button type="button" class="btn btn-ghost btn-sm" onclick={onLembrar}>
				<Icon name="bell" size={14} /> Lembrar
			</button>
		</div>
	{/if}
</div>

<style>
	.ownership-banner {
		display: flex;
		gap: 18px;
		align-items: center;
		padding: 18px 22px;
		border-radius: var(--r-lg);
		border-left: 4px solid var(--c-border-strong);
		background: var(--c-surface-2);
		box-shadow: var(--sh-sm);
		margin-bottom: var(--gap-sec, 24px);
	}

	.ownership-editor {
		background: linear-gradient(
			90deg,
			var(--c-primary-soft) 0%,
			rgba(230, 238, 248, 0.3) 100%
		);
		border-left-color: var(--c-primary);
	}

	.ownership-revisor {
		background: linear-gradient(
			90deg,
			var(--c-warning-soft) 0%,
			rgba(252, 241, 220, 0.3) 100%
		);
		border-left-color: var(--c-warning);
	}

	.ownership-outro {
		background: var(--c-surface-2);
		border-left-color: var(--c-border-strong);
	}

	.ownership-icon {
		width: 44px;
		height: 44px;
		border-radius: var(--r-md);
		background: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		box-shadow: var(--sh-sm);
	}
	.ownership-editor .ownership-icon {
		color: var(--c-primary);
	}
	.ownership-revisor .ownership-icon {
		color: var(--c-warning);
	}
	.ownership-outro .ownership-icon {
		color: var(--c-muted);
	}

	.ownership-text {
		flex: 1;
		min-width: 0;
	}
	.ownership-title {
		font-weight: 700;
		font-size: 15px;
		color: var(--c-ink);
	}
	.ownership-sub {
		color: var(--c-ink-2);
		font-size: 13.5px;
		margin-top: 3px;
		line-height: 1.5;
	}

	.ownership-actions {
		display: flex;
		gap: 10px;
		align-items: center;
		flex: none;
	}

	@media (max-width: 640px) {
		.ownership-banner {
			flex-direction: column;
			align-items: flex-start;
		}
		.ownership-actions {
			width: 100%;
			justify-content: flex-end;
		}
	}
</style>
