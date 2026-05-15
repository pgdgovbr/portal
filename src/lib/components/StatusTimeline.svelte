<script lang="ts">
	export interface TimelineItem {
		label: string;
		date?: string;
		state: 'done' | 'current' | 'pending';
	}

	interface Props {
		items: TimelineItem[];
	}
	let { items }: Props = $props();
</script>

<ol class="timeline" aria-label="Linha do tempo do plano">
	{#each items as item, i}
		<li class="tl-item" data-state={item.state}>
			<div class="tl-marker" aria-hidden="true">
				{#if item.state === 'done'}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6L9 17l-5-5" />
					</svg>
				{/if}
			</div>
			{#if i < items.length - 1}
				<div class="tl-line" aria-hidden="true"></div>
			{/if}
			<div class="tl-content">
				<span class="tl-label">{item.label}</span>
				{#if item.date}
					<span class="tl-date">{item.date}</span>
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: flex-start;
		gap: 0;
	}

	.tl-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		position: relative;
	}

	.tl-marker {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		z-index: 1;
		transition: all .2s;
	}

	[data-state="done"] .tl-marker {
		background: var(--c-success);
		color: white;
		border: 2px solid var(--c-success);
	}

	[data-state="current"] .tl-marker {
		background: var(--c-surface);
		color: var(--c-primary);
		border: 2px solid var(--c-primary);
		box-shadow: 0 0 0 4px var(--c-primary-soft);
	}

	[data-state="pending"] .tl-marker {
		background: var(--c-surface);
		border: 2px solid var(--c-border-strong);
		color: var(--c-muted-2);
	}

	.tl-line {
		position: absolute;
		top: 14px;
		left: 50%;
		width: 100%;
		height: 2px;
		background: var(--c-border);
		z-index: 0;
	}

	[data-state="done"] .tl-line {
		background: var(--c-success);
	}

	.tl-content {
		margin-top: 8px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tl-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--c-ink-2);
	}

	[data-state="pending"] .tl-label {
		color: var(--c-muted);
	}

	.tl-date {
		font-size: 11px;
		color: var(--c-muted);
	}
</style>
