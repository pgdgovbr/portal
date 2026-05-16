<script lang="ts">
	import type { StatusPlano } from '$lib/types';
	import Icon from './Icon.svelte';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		status: StatusPlano | string;
		size?: Size;
		showIcon?: boolean;
	}
	let { status, size = 'md', showIcon = true }: Props = $props();

	type Config = { cls: string; label: string; icon?: string };

	const CONFIG: Record<string, Config> = {
		// Novos estados de pactuação
		RASCUNHO_PARTICIPANTE: { cls: 'sbg sbg-draft-srv', label: 'Rascunho · servidor', icon: 'edit' },
		RASCUNHO_CHEFIA: { cls: 'sbg sbg-draft-chf', label: 'Rascunho · chefia', icon: 'edit' },
		AGUARDANDO_ASSINATURA_CHEFIA: {
			cls: 'sbg sbg-await-chf',
			label: 'Aguardando chefia',
			icon: 'clock'
		},
		AGUARDANDO_ASSINATURA_PARTICIPANTE: {
			cls: 'sbg sbg-await-srv',
			label: 'Aguardando servidor',
			icon: 'clock'
		},
		// Estados existentes
		EM_EXECUCAO: { cls: 'sbg sbg-exec', label: 'Em execução', icon: 'check' },
		CONCLUIDO: { cls: 'sbg sbg-conc', label: 'Concluído', icon: 'check' },
		AVALIADO: { cls: 'sbg sbg-aval', label: 'Avaliado', icon: 'star' },
		CANCELADO: { cls: 'sbg sbg-cancel', label: 'Cancelado', icon: 'x' },
		// Legados — alguns lugares ainda mandam essas strings
		APROVADO: { cls: 'sbg sbg-await-chf', label: 'Aprovado', icon: 'check' },
		PENDENTE: { cls: 'bdg bdg-warning', label: 'Pendente' },
		DEFERIDO: { cls: 'bdg bdg-success', label: 'Deferido' },
		INDEFERIDO: { cls: 'bdg bdg-danger', label: 'Indeferido' }
	};

	const cfg = $derived(CONFIG[status] ?? { cls: 'bdg bdg-neutral', label: status });
	const fontSize = $derived(size === 'lg' ? 13.5 : size === 'sm' ? 11 : 12);
	const iconSize = $derived(fontSize + 1);
</script>

<span class={cfg.cls} style:font-size="{fontSize}px" role="status">
	{#if showIcon && cfg.icon}
		<Icon name={cfg.icon} size={iconSize} stroke={2.2} />
	{:else if !cfg.icon}
		<span class="dot" aria-hidden="true"></span>
	{/if}
	{cfg.label}
</span>
