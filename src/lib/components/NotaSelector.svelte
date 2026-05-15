<script lang="ts">
	import type { Nota } from '$lib/types';
	import { NOTAS } from '$lib/types';

	interface Props {
		value?: Nota | null;
		onchange?: (nota: Nota) => void;
		disabled?: boolean;
	}
	let { value = $bindable(null), onchange, disabled = false }: Props = $props();

	const notas: Nota[] = [1, 2, 3, 4, 5];

	function select(n: Nota) {
		if (disabled) return;
		value = n;
		onchange?.(n);
	}
</script>

<div class="nota-selector" role="radiogroup" aria-label="Selecionar nota de avaliação">
	{#each notas as n}
		{@const cfg = NOTAS[n]}
		<button
			type="button"
			class="nota-btn"
			class:selected={value === n}
			style="--nota-color:{cfg.color}; --nota-bg:{cfg.bg}"
			aria-pressed={value === n}
			aria-label="Nota {n}: {cfg.label}"
			{disabled}
			onclick={() => select(n)}
		>
			<span class="nota-num">{n}</span>
			<span class="nota-label">{cfg.label}</span>
		</button>
	{/each}
</div>

<style>
	.nota-selector {
		display: flex;
		gap: 8px;
	}

	.nota-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 14px 8px;
		border-radius: var(--r-md);
		border: 2px solid transparent;
		background: var(--nota-bg);
		color: var(--nota-color);
		cursor: pointer;
		transition: all .15s;
		font-family: var(--ff-body);
	}

	.nota-btn:hover:not(:disabled) {
		border-color: var(--nota-color);
		transform: translateY(-1px);
		box-shadow: var(--sh-sm);
	}

	.nota-btn:focus-visible {
		outline: 2px solid var(--nota-color);
		outline-offset: 2px;
	}

	.nota-btn.selected {
		border-color: var(--nota-color);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--nota-color) 20%, transparent);
	}

	.nota-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.nota-num {
		font-family: var(--ff-display);
		font-size: 22px;
		font-weight: 800;
		line-height: 1;
	}

	.nota-label {
		font-size: 11.5px;
		font-weight: 600;
		text-align: center;
		line-height: 1.2;
	}
</style>
