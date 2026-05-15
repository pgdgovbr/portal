<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>Relatórios — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Gestão</div>
			<h1 class="pg-title">Relatórios</h1>
			<p class="pg-sub">Indicadores e relatórios de acompanhamento do PGD</p>
		</div>
	</div>

	<div class="g-3" style="margin-bottom:var(--gap-sec)">
		{#each [
			{ icon: 'clipboard', title: 'Sem Plano de Trabalho', desc: 'Servidores com TCR ativo sem plano', badge: null },
			{ icon: 'alert-triangle', title: 'Avaliações Pendentes', desc: 'Registros aguardando avaliação da chefia', badge: null },
			{ icon: 'trending-up', title: 'Progresso por Unidade', desc: 'Percentual de execução por unidade', badge: null },
			{ icon: 'star', title: 'Distribuição de Notas', desc: 'Histograma de avaliações 1–5', badge: null },
			{ icon: 'calendar', title: 'Registros em Atraso', desc: 'Servidores que perderam o prazo', badge: null },
			{ icon: 'check-circle', title: 'Conformidade API', desc: 'Status de envio à API PGD Central', badge: null },
		] as card, i}
			<div class="card" style="cursor:pointer" role="button" tabindex="0">
				<div class="row" style="margin-bottom:12px; gap:12px">
					<div style="width:40px; height:40px; border-radius:var(--r-md); background:var(--c-primary-soft); display:flex; align-items:center; justify-content:center; color:var(--c-primary)">
						<Icon name={card.icon} size={20} />
					</div>
					<div style="flex:1">
						<div style="font-weight:700; font-size:15px">{card.title}</div>
						<div style="font-size:13px; color:var(--c-muted)">{card.desc}</div>
					</div>
				</div>
				<button class="btn btn-soft btn-sm" style="width:100%">
					Gerar relatório <Icon name="arrow-right" size={14} />
				</button>
			</div>
		{/each}
	</div>
</div>
