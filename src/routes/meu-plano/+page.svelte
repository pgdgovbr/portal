<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import NotaBadge from '$lib/components/NotaBadge.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const planos = $derived((data as any).planosTrabalho ?? []);
	const planoAtivo = $derived(
		planos.find((p: any) => p.status === 'EM_EXECUCAO') ?? planos[0] ?? null
	);

	const registrosPlano = $derived<any[]>(
		planoAtivo?.contribuicoes?.flatMap((c: any) => c.registrosExecucao ?? []) ?? []
	);

	let viewMode = $state<'tabela' | 'cards'>('tabela');

	function daysUntil(dateStr: string): number {
		if (!dateStr) return 0;
		const target = new Date(dateStr);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Meu Plano de Trabalho — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<span>Meu Plano de Trabalho</span>
	</div>

	{#if !planoAtivo}
		<div class="pg-head">
			<h1 class="pg-title">Meu Plano de Trabalho</h1>
		</div>
		<div class="card" style="text-align:center; padding:48px">
			<Icon name="clipboard" size={40} />
			<h2 style="margin-top:16px; font-size:20px">Nenhum plano de trabalho ativo</h2>
			<p style="color:var(--c-muted); margin-top:8px">Solicite à sua chefia a criação de um Plano de Trabalho para você.</p>
		</div>
	{:else}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">{planoAtivo.unidadeAutorizadoraNome}</div>
				<h1 class="pg-title">{planoAtivo.unidadeAutorizadoraNome}</h1>
				<p class="pg-sub">
					{formatDate(planoAtivo.dataInicio)} → {formatDate(planoAtivo.dataFim)}
					· {planoAtivo.totalHorasDisponiveis}h/sem
					· {planoAtivo.modalidade?.replace('_', ' ')}
				</p>
			</div>
			<div class="row">
				<a href="/meu-plano/registrar" class="btn btn-primary">
					<Icon name="plus" size={16} /> Registrar execução
				</a>
			</div>
		</div>

		<div class="g-2-1">
			<!-- Main content -->
			<div class="col" style="gap:var(--gap-sec)">
				<!-- KPIs -->
				<section class="card">
					<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px">
						<div>
							<div class="kpi-label">Status</div>
							<div style="margin-top:6px"><StatusBadge status={planoAtivo.status} /></div>
						</div>
						<div>
							<div class="kpi-label">Período</div>
							<div style="font-family:var(--ff-display); font-weight:700; font-size:16px; margin-top:6px">
								{new Date(planoAtivo.dataInicio).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}
								→
								{new Date(planoAtivo.dataFim).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' })}
							</div>
						</div>
						<div>
							<div class="kpi-label">Contribuições</div>
							<div class="kpi-num" style="font-size:24px; margin-top:6px">
								{planoAtivo.contribuicoes?.length ?? 0}
							</div>
						</div>
						<div>
							<div class="kpi-label">Prazo restante</div>
							<div style="margin-top:6px">
								<UrgencyPill daysLeft={daysUntil(planoAtivo.dataFim)} />
							</div>
						</div>
					</div>
				</section>

				<!-- Contribuições -->
				{#if planoAtivo.contribuicoes?.length}
					<section class="card">
						<div class="card-hd">
							<div>
								<h2>Contribuições</h2>
								<p>Atividades vinculadas ao plano</p>
							</div>
						</div>
						<div class="list">
							{#each planoAtivo.contribuicoes as contrib (contrib.id)}
								<div class="list-item">
									<div class="numdot">{contrib.percentualContribuicao}%</div>
									<div style="flex:1">
										<div style="font-weight:600; font-size:14px">{contrib.descricao}</div>
										<div style="font-size:12.5px; color:var(--c-muted); margin-top:2px">
											{contrib.registrosExecucao?.length ?? 0} registro(s)
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Histórico de períodos -->
				<section class="card">
					<div class="card-hd">
						<h2>Histórico de períodos</h2>
						<div class="row">
							<button
								class="btn btn-ghost btn-sm"
								class:btn-soft={viewMode === 'tabela'}
								onclick={() => viewMode = 'tabela'}
							>Tabela</button>
							<button
								class="btn btn-ghost btn-sm"
								class:btn-soft={viewMode === 'cards'}
								onclick={() => viewMode = 'cards'}
							>Cards</button>
						</div>
					</div>

					{#if registrosPlano.length === 0}
						<p style="color:var(--c-muted); font-size:14px">Nenhum registro de execução enviado ainda.</p>
					{:else if viewMode === 'tabela'}
						<table class="tbl">
							<thead>
								<tr>
									<th>Período</th>
									<th>Enviado em</th>
									<th>Status</th>
									<th>Nota</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{#each registrosPlano as reg (reg.id)}
									{@const aval = reg.avaliacoes?.[0]}
									<tr>
										<td>
											{#if reg.periodoInicio}
												<strong>{formatDate(reg.periodoInicio)}</strong>
												<div style="font-size:11.5px; color:var(--c-muted)">{formatDate(reg.periodoFim)}</div>
											{:else}
												<strong>—</strong>
											{/if}
										</td>
										<td>{formatDate(reg.dataEnvio)}</td>
										<td><StatusBadge status={reg.status} /></td>
										<td>
											{#if aval?.nota}
												<NotaBadge nota={aval.nota} />
											{:else}
												<span style="color:var(--c-muted)">—</span>
											{/if}
										</td>
										<td style="text-align:right">
											{#if aval?.nota}
												<a href="/meu-plano/avaliacao/{reg.id}" class="btn btn-ghost btn-sm">
													Ver avaliação
												</a>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<div class="g-3" style="gap:14px">
							{#each registrosPlano as reg (reg.id)}
								{@const aval = reg.avaliacoes?.[0]}
								<div style="padding:18px; border:1px solid var(--c-border); border-radius:var(--r-md); background:var(--c-surface)">
									<div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--c-muted)">
										{formatDate(reg.periodoInicio)}
									</div>
									<div class="divider"></div>
									{#if aval?.nota}
										<NotaBadge nota={aval.nota} />
										<div style="font-size:12px; color:var(--c-muted); margin-top:8px">
											por {aval.avaliador?.nome ?? '—'} em {formatDate(aval.dataAvaliacao)}
										</div>
										<a href="/meu-plano/avaliacao/{reg.id}" class="btn btn-ghost btn-sm" style="margin-top:12px; width:100%">
											Ver avaliação
										</a>
									{:else}
										<StatusBadge status={reg.status} />
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>

			<!-- Sidebar -->
			<div class="col" style="gap:var(--gap-sec)">
				<section class="card">
					<div class="card-hd"><h2 style="font-size:17px">Ações</h2></div>
					<div class="stack-12">
						<a href="/meu-plano/registrar" class="btn btn-primary" style="width:100%; justify-content:flex-start">
							<Icon name="plus" size={16} /> Registrar execução
						</a>
						<button class="btn btn-ghost" style="width:100%; justify-content:flex-start">
							<Icon name="download" size={16} /> Exportar PDF
						</button>
					</div>
				</section>

				<section class="card">
					<div class="card-hd"><h2 style="font-size:17px">Outros planos</h2></div>
					{#if planos.length <= 1}
						<p style="color:var(--c-muted); font-size:13px">Nenhum histórico anterior.</p>
					{:else}
						<div class="stack-12">
							{#each planos.filter((p: any) => p.id !== planoAtivo.id) as p (p.id)}
								<div class="row">
									<StatusBadge status={p.status} />
									<div style="flex:1; font-size:13px">
										{formatDate(p.dataInicio)} → {formatDate(p.dataFim)}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</div>
