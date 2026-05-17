<!--
  Card individual de selo de conformidade.
  Ícone SVG vai via snippet "icon" (children). Recebe título, subtítulo e
  status opcional ("implementado" verde ou "em conformidade" ocre).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		ttl: string;
		sub: string;
		status?: 'implementado' | 'em conformidade';
		icon: Snippet;
	}

	let { ttl, sub, status, icon }: Props = $props();
</script>

<div class="selo">
	<div class="icon-wrap">
		{@render icon()}
	</div>
	<h3>{ttl}</h3>
	<p>{sub}</p>
	{#if status}
		<span class="status" class:implementado={status === 'implementado'}>
			<span class="dot"></span>
			{status === 'implementado' ? 'Implementado' : 'Em conformidade'}
		</span>
	{/if}
</div>

<style>
	.selo {
		background: white;
		border: 1px solid rgba(11, 20, 38, 0.1);
		border-radius: 12px;
		padding: 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		position: relative;
	}
	.icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		background: var(--c-paper-2);
		color: var(--c-ink-editorial);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	h3 {
		font-family: var(--ff-display);
		font-size: 16px;
		font-weight: 700;
		margin: 0;
		color: var(--c-ink-editorial);
		line-height: 1.3;
	}
	p {
		font-size: 13px;
		color: var(--c-ink-2);
		margin: 0;
		line-height: 1.5;
		flex: 1;
	}
	.status {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--c-accent);
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.status.implementado {
		color: var(--c-success);
	}
	.status .dot {
		width: 6px;
		height: 6px;
		border-radius: 3px;
		background: currentColor;
	}
</style>
