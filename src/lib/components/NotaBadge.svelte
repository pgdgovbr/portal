<script lang="ts">
	import type { Nota } from '$lib/types';
	import { NOTAS } from '$lib/types';

	interface Props {
		nota: Nota | number;
	}
	let { nota }: Props = $props();

	const cfg = $derived(NOTAS[nota as Nota] ?? { label: String(nota), color: '#6B7280', bg: '#ECEFF4' });
</script>

<span
	class="bdg"
	style="background:{cfg.bg}; color:{cfg.color}"
	role="img"
	aria-label="Nota {nota}: {cfg.label}"
>
	{nota} — {cfg.label}
</span>
