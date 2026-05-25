<!--
  Item da seção Arquitetura: check verde + título + descrição.
-->
<script lang="ts">
	interface Props {
		ttl: string;
		sub: string;
	}

	let { ttl, sub }: Props = $props();
</script>

<div class="item">
	<span class="check">
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.6"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6L9 17l-5-5" />
		</svg>
	</span>
	<div class="body">
		<strong>{ttl}</strong>
		<p>{sub}</p>
	</div>
</div>

<style>
	.item {
		display: flex;
		gap: 14px;
		align-items: flex-start;
	}
	.check {
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--c-success-soft);
		color: var(--c-success);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 2px;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	strong {
		font-size: 15px;
		color: var(--c-ink-editorial);
	}
	p {
		font-size: 13.5px;
		color: var(--c-ink-2);
		margin: 4px 0 0;
		line-height: 1.55;
	}
</style>
