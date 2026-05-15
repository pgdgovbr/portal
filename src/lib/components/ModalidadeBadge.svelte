<script lang="ts">
	interface Props {
		modalidade: string;
	}
	let { modalidade }: Props = $props();

	const MAP: Record<string, { label: string; cls: string }> = {
		TELETRABALHO_INTEGRAL: { label: 'Teletrabalho Integral', cls: 'bdg-info' },
		TELETRABALHO_PARCIAL:  { label: 'Teletrabalho Parcial',  cls: 'bdg-info' },
		PRESENCIAL:            { label: 'Presencial',            cls: 'bdg-neutral' },
	};

	const cfg = $derived(MAP[modalidade] ?? { label: modalidade, cls: 'bdg-neutral' });
</script>

<span class="bdg {cfg.cls}">{cfg.label}</span>
