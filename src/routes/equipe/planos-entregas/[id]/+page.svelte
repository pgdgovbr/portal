<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import StatusTimeline from '$lib/components/StatusTimeline.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const plano = $derived((data as any).plano);
	const entregas = $derived(plano?.entregas ?? []);

	let filtroStatus = $state('');
	let filtroResp = $state('');

	const entregasFiltradas = $derived(
		entregas.filter((e: any) => {
			if (filtroStatus && e.status !== filtroStatus) return false;
			if (filtroResp && e.responsavel?.nome !== filtroResp) return false;
			return true;
		})
	);

	const responsaveis = $derived(
		[...new Set(entregas.map((e: any) => e.responsavel?.nome).filter(Boolean))] as string[]
	);

	const concluidas = $derived(entregas.filter((e: any) => e.status === 'CONCLUIDO').length);
	const emRisco = $derived(
		entregas.filter((e: any) => e.progresso !== undefined && e.progresso < 30 && e.status === 'EM_EXECUCAO').length
	);
	const progGlobal = $derived(
		entregas.length > 0
			? Math.round(entregas.reduce((a: number, e: any) => a + (e.progresso ?? 0), 0) / entregas.length)
			: 0
	);

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function progColor(p: number) {
		if (p >= 70) return 'var(--c-success)';
		if (p >= 30) return 'var(--c-primary)';
		return 'var(--c-warning)';
	}
</script>

<svelte:head>
	<title>Plano de Entregas — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/equipe">Equipe</a>
		<span class="sep">/</span>
		<span>Plano de Entregas</span>
	</div>

	{#if !plano}
		<p style="color:var(--c-muted)">Carregando…</p>
	{:else}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Plano de Entregas · {plano.unidadeNome}</div>
				<h1 class="pg-title">{plano.titulo}</h1>
				<p class="pg-sub">
					{entregas.length} entregas planejadas · vincula contribuições de servidores
				</p>
			</div>
			<div class="row" style="gap:10px">
				<button class="btn btn-ghost">
					<Icon name="download" size={15} /> Exportar
				</button>
				<button class="btn btn-primary">
					<Icon name="plus" size={15} /> Nova entrega
				</button>
			</div>
		</div>

		<!-- KPI strip -->
		<section class="card" style="padding:22px; margin-bottom:var(--gap-sec)">
			<div style="display:grid; grid-template-columns:repeat(5,1fr) 2fr; gap:24px; align-items:center">
				<div>
					<div class="kpi-label">Status</div>
					<div style="margin-top:6px"><StatusBadge status={plano.status} /></div>
				</div>
				<div>
					<div class="kpi-label">Período</div>
					<div style="font-family:var(--ff-display); font-weight:700; font-size:15px; margin-top:6px">
						{formatDate(plano.dataInicio)} → {formatDate(plano.dataFim)}
					</div>
				</div>
				<div>
					<div class="kpi-label">Entregas</div>
					<div class="kpi-num" style="font-size:22px; margin-top:4px">{entregas.length}</div>
				</div>
				<div>
					<div class="kpi-label">Concluídas</div>
					<div class="kpi-num" style="font-size:22px; margin-top:4px; color:var(--c-success)">{concluidas}</div>
				</div>
				<div>
					<div class="kpi-label">Em risco</div>
					<div class="kpi-num" style="font-size:22px; margin-top:4px; color:var(--c-warning)">{emRisco}</div>
				</div>
				<div>
					<div class="kpi-label" style="margin-bottom:8px">Progresso global</div>
					<div style="height:8px; background:var(--c-bg-deep); border-radius:4px; overflow:hidden">
						<div style="width:{progGlobal}%; height:100%; background:var(--c-primary); border-radius:4px"></div>
					</div>
					<div style="font-size:12px; color:var(--c-muted); margin-top:6px; display:flex; justify-content:space-between">
						<span>{formatDate(plano.dataInicio)}</span>
						<strong style="color:var(--c-ink); font-family:var(--ff-display)">{progGlobal}%</strong>
						<span>{formatDate(plano.dataFim)}</span>
					</div>
				</div>
			</div>
		</section>

		<div class="g-2-1">
			<!-- Entregas list -->
			<section class="card">
				<div class="card-hd">
					<div>
						<h2>Entregas do plano</h2>
						<p>Clique em uma entrega para editar.</p>
					</div>
					<div class="row" style="gap:8px">
						<select class="select" style="width:160px" bind:value={filtroStatus} aria-label="Filtrar por status">
							<option value="">Todos os status</option>
							<option value="EM_EXECUCAO">Em execução</option>
							<option value="APROVADO">Aprovado</option>
							<option value="RASCUNHO">Rascunho</option>
							<option value="CONCLUIDO">Concluído</option>
						</select>
						{#if responsaveis.length > 0}
							<select class="select" style="width:180px" bind:value={filtroResp} aria-label="Filtrar por responsável">
								<option value="">Todos responsáveis</option>
								{#each responsaveis as r}
									<option value={r}>{r}</option>
								{/each}
							</select>
						{/if}
					</div>
				</div>

				<div class="stack-12">
					{#if entregasFiltradas.length === 0}
						<p style="color:var(--c-muted); font-size:14px; padding:24px 0">Nenhuma entrega encontrada.</p>
					{:else}
						{#each entregasFiltradas as e (e.id)}
							<div style="display:flex; gap:14px; align-items:flex-start; padding:16px; border:1px solid var(--c-border); border-radius:var(--r-md); background:{e.status === 'RASCUNHO' ? 'var(--c-surface-2)' : 'white'}">
								<div style="font-family:var(--ff-mono); font-size:11px; font-weight:700; color:var(--c-muted); padding:4px 8px; background:var(--c-surface-2); border-radius:4px; flex:none; margin-top:1px">{e.id}</div>
								<div style="flex:1; min-width:0">
									<div class="row" style="gap:10px; flex-wrap:wrap">
										<strong style="font-size:14.5px">{e.titulo}</strong>
										<StatusBadge status={e.status} />
									</div>
									<div class="row" style="gap:16px; font-size:12.5px; color:var(--c-muted); margin-top:6px; flex-wrap:wrap">
										{#if e.responsavel?.nome}
											<span><Icon name="users" size={12} /> {e.responsavel.nome}</span>
										{/if}
										{#if e.prazo}
											<span><Icon name="calendar" size={12} /> Prazo {e.prazo}</span>
										{/if}
										{#if e.contribuicoes?.length}
											<span><Icon name="file-text" size={12} /> {e.contribuicoes.length} contribuição{e.contribuicoes.length !== 1 ? 'ões' : ''}</span>
										{/if}
									</div>
									{#if e.progresso > 0}
										<div class="row" style="gap:10px; align-items:center; margin-top:10px">
											<div style="flex:1; max-width:220px; height:6px; background:var(--c-bg-deep); border-radius:3px; overflow:hidden">
												<div style="width:{e.progresso}%; height:100%; background:{progColor(e.progresso)}; border-radius:3px"></div>
											</div>
											<span style="font-family:var(--ff-display); font-weight:700; font-size:13px">{e.progresso}%</span>
										</div>
									{/if}
								</div>
								<button class="tn-iconbtn" style="width:32px;height:32px" aria-label="Editar entrega">
									<Icon name="edit" size={14} />
								</button>
							</div>
						{/each}
					{/if}

					<button style="padding:16px; border:1.5px dashed var(--c-border-strong); border-radius:var(--r-md); background:transparent; color:var(--c-muted); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13.5px; font-weight:600; width:100%">
						<Icon name="plus" size={16} /> Adicionar entrega
					</button>
				</div>
			</section>

			<!-- Sidebar -->
			<div class="col" style="gap:var(--gap-sec)">
				{#if plano.timeline?.length}
					<section class="card">
						<div class="card-hd"><h2 style="font-size:16px">Marcos do período</h2></div>
						<StatusTimeline items={plano.timeline} />
					</section>
				{/if}

				{#if emRisco > 0}
					<section class="card" style="background:var(--c-warning-soft); border-left:3px solid var(--c-warning)">
						<div class="kicker" style="color:var(--c-warning)"><Icon name="alert-triangle" size={13} /> Atenção</div>
						<p style="font-size:12.5px; color:var(--c-ink-2); margin:10px 0 0; line-height:1.55">
							{emRisco} entrega{emRisco !== 1 ? 's estão' : ' está'} em risco — baixo progresso relativo ao prazo.
						</p>
					</section>
				{/if}

				<section class="card" style="border-left:3px solid var(--c-info)">
					<div class="kicker" style="color:var(--c-info)"><Icon name="info" size={13} /> Sobre Plano de Entregas</div>
					<p style="font-size:12.5px; color:var(--c-ink-2); margin:10px 0 0; line-height:1.55">
						As contribuições do tipo 1 dos planos de trabalho vinculam-se às entregas deste plano.
						O progresso é atualizado conforme as avaliações dos registros de execução.
					</p>
				</section>
			</div>
		</div>
	{/if}
</div>
