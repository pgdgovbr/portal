<!--
  Item de roadmap: bullet ocre (clock icon) + título + descrição + tag opcional.
  Usado nas seções "Inteligência generativa" e "Em desenvolvimento".
-->
<script lang="ts">
	interface Props {
		ttl: string;
		desc: string;
		tag?: string;
	}

	let { ttl, desc, tag }: Props = $props();
</script>

<div class="item">
	<span class="bullet">
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.4"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</svg>
	</span>
	<div class="body">
		<div class="head">
			<strong>{ttl}</strong>
			{#if tag}
				<span class="lp-chip accent">{tag}</span>
			{/if}
		</div>
		<p>{desc}</p>
	</div>
</div>

<style>
	.item {
		background: white;
		border: 1px solid rgba(11, 20, 38, 0.08);
		border-left: 3px solid var(--c-accent);
		border-radius: 10px;
		padding: 18px 22px;
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}
	.bullet {
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--c-accent-soft);
		color: var(--c-accent-deep);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.body {
		flex: 1;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}
	.head strong {
		font-size: 14.5px;
		color: var(--c-ink-editorial);
	}
	p {
		font-size: 13.5px;
		color: var(--c-ink-2);
		margin: 6px 0 0;
		line-height: 1.55;
	}
</style>
