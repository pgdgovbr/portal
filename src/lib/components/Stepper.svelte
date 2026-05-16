<script lang="ts">
	interface Props {
		steps: string[];
		current: number;
	}
	let { steps, current }: Props = $props();
</script>

<nav class="stepper" aria-label="Etapas do formulário">
	{#each steps as step, i}
		{@const state = i < current ? 'done' : i === current ? 'current' : 'pending'}
		<div
			class="step"
			class:step-done={state === 'done'}
			data-state={state}
			data-done={state === 'done' ? 'true' : undefined}
			aria-current={state === 'current' ? 'step' : undefined}
		>
			<div class="step-dot" aria-hidden="true">
				{#if state === 'done'}
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
				{:else}
					{i + 1}
				{/if}
			</div>
			<span class="step-label">{step}</span>
		</div>
		{#if i < steps.length - 1}
			<div class="step-connector" aria-hidden="true"></div>
		{/if}
	{/each}
</nav>

<style>
	.stepper {
		display: flex;
		align-items: center;
		gap: 0;
	}

	.step {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: none;
	}

	.step-connector {
		flex: 1;
		height: 1px;
		background: var(--c-border);
		margin: 0 12px;
		min-width: 24px;
	}

	.step-dot {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 700;
		font-family: var(--ff-display);
		flex: none;
		transition: all .15s;
	}

	[data-state="done"] .step-dot {
		background: var(--c-success);
		color: white;
		border: 2px solid var(--c-success);
	}

	[data-state="current"] .step-dot {
		background: var(--c-primary);
		color: white;
		border: 2px solid var(--c-primary);
		box-shadow: 0 0 0 3px var(--c-primary-soft);
	}

	[data-state="pending"] .step-dot {
		background: var(--c-surface);
		color: var(--c-muted);
		border: 2px solid var(--c-border-strong);
	}

	.step-label {
		font-size: 13px;
		font-weight: 600;
	}

	[data-state="done"] .step-label { color: var(--c-success); }
	[data-state="current"] .step-label { color: var(--c-primary); }
	[data-state="pending"] .step-label { color: var(--c-muted); }
</style>
