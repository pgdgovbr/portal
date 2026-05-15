<script lang="ts">
	import type { StatusPlano } from '$lib/types';
	import { STATUS_LABELS } from '$lib/types';

	interface Props {
		status: StatusPlano | string;
	}
	let { status }: Props = $props();

	const CONFIG: Record<string, { cls: string; label: string }> = {
		APROVADO:     { cls: 'bdg-info',    label: 'Aprovado' },
		EM_EXECUCAO:  { cls: 'bdg-success', label: 'Em execução' },
		CONCLUIDO:    { cls: 'bdg-success', label: 'Concluído' },
		AVALIADO:     { cls: 'bdg-purple',  label: 'Avaliado' },
		CANCELADO:    { cls: 'bdg-neutral', label: 'Cancelado' },
		PENDENTE:     { cls: 'bdg-warning', label: 'Pendente' },
		DEFERIDO:     { cls: 'bdg-success', label: 'Deferido' },
		INDEFERIDO:   { cls: 'bdg-danger',  label: 'Indeferido' },
	};

	const cfg = $derived(CONFIG[status] ?? { cls: 'bdg-neutral', label: status });
</script>

<span class="bdg {cfg.cls}" role="status">
	<span class="dot" aria-hidden="true"></span>
	{cfg.label}
</span>
