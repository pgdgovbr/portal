<!--
  Marca "PGD Livre" — Variante B (três barras horizontais).
  As barras representam o ciclo plano-execução-avaliação.
-->
<script lang="ts">
	interface Props {
		name?: string;
		onDark?: boolean;
		size?: 'sm' | 'md' | 'lg' | 'xl';
	}

	let { name = 'PGD Livre', onDark = false, size = 'md' }: Props = $props();

	const dimMap = { sm: 28, md: 36, lg: 50, xl: 68 } as const;
	const fzMap = { sm: 14, md: 17, lg: 24, xl: 34 } as const;
	const dim = $derived(dimMap[size]);
	const fz = $derived(fzMap[size]);
</script>

<span
	class="lp-mark"
	class:on-dark={onDark}
	style="display:inline-flex; align-items:center; gap:{dim / 3}px"
>
	<svg
		width={dim}
		height={dim}
		viewBox="0 0 48 48"
		fill="none"
		aria-hidden="true"
	>
		<rect x="6" y="10" width="36" height="6" rx="2" fill={onDark ? 'white' : 'var(--c-ink-editorial)'} />
		<rect x="6" y="21" width="24" height="6" rx="2" fill="var(--c-accent)" />
		<rect x="6" y="32" width="30" height="6" rx="2" fill="var(--c-success)" />
	</svg>
	<span
		style="font-family:var(--ff-display); font-weight:800; font-size:{fz}px; letter-spacing:-0.018em; color:{onDark
			? 'white'
			: 'var(--c-ink-editorial)'}"
	>
		{name}
	</span>
</span>
