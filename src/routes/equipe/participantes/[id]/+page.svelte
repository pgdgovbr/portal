<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ModalidadeBadge from '$lib/components/ModalidadeBadge.svelte';
	import NotaBadge from '$lib/components/NotaBadge.svelte';
	import { initialsFrom } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const participante = $derived((data as any).participante);

	let tab = $state<'visao' | 'planos' | 'afastamentos'>('visao');

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	const planoAtivo = $derived(
		participante?.planosTrabalho?.find((p: any) => p.status === 'EM_EXECUCAO') ?? null
	);
</script>

<svelte:head>
	<title>Participante — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/equipe">Equipe</a>
		<span class="sep">/</span>
		<span>Participante</span>
	</div>

	{#if !participante}
		<p style="color:var(--c-muted)">Carregando…</p>
	{:else}
		<div class="pg-head">
			<div class="row" style="gap:16px; align-items:center">
				<div class="av av-lg" style="background:var(--c-primary); color:white">
					{initialsFrom(participante.nome ?? '')}
				</div>
				<div>
					<div class="pg-eyebrow">{participante.unidadeNome ?? ''}</div>
					<h1 class="pg-title">{participante.nome}</h1>
					<p class="pg-sub">
						SIAPE {participante.siape} · {participante.cargo ?? '—'} · {participante.email ?? ''}
					</p>
					<div class="row" style="gap:8px; margin-top:8px; flex-wrap:wrap">
						{#if participante.modalidadeExecucao}
							<ModalidadeBadge modalidade={participante.modalidadeExecucao} />
						{/if}
						{#if planoAtivo}
							<StatusBadge status={planoAtivo.status} />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="tabs" role="tablist" aria-label="Seções do perfil">
			<button
				class="tab"
				role="tab"
				aria-selected={tab === 'visao'}
				aria-controls="tab-visao"
				onclick={() => (tab = 'visao')}
			>
				Visão geral
			</button>
			<button
				class="tab"
				role="tab"
				aria-selected={tab === 'planos'}
				aria-controls="tab-planos"
				onclick={() => (tab = 'planos')}
			>
				Planos ({participante.planosTrabalho?.length ?? 0})
			</button>
			<button
				class="tab"
				role="tab"
				aria-selected={tab === 'afastamentos'}
				aria-controls="tab-afastamentos"
				onclick={() => (tab = 'afastamentos')}
			>
				Afastamentos ({participante.afastamentos?.length ?? 0})
			</button>
		</div>

		{#if tab === 'visao'}
			<section class="card" id="tab-visao" role="tabpanel">
				<div class="card-hd"><h2>Dados cadastrais</h2></div>
				<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:14px">
					<div>
						<div class="kpi-label">CPF</div>
						<div style="font-size:14px; margin-top:4px">{participante.cpf ?? '—'}</div>
					</div>
					<div>
						<div class="kpi-label">SIAPE</div>
						<div style="font-size:14px; margin-top:4px">{participante.siape ?? '—'}</div>
					</div>
					<div>
						<div class="kpi-label">Cargo</div>
						<div style="font-size:14px; margin-top:4px">{participante.cargo ?? '—'}</div>
					</div>
					<div>
						<div class="kpi-label">Chefia imediata</div>
						<div style="font-size:14px; margin-top:4px">
							{participante.chefiaImediata?.nome ?? '—'}
						</div>
					</div>
				</div>
			</section>
		{/if}

		{#if tab === 'planos'}
			<section class="card" id="tab-planos" role="tabpanel">
				<div class="card-hd"><h2>Planos de trabalho</h2></div>
				{#if !participante.planosTrabalho?.length}
					<p style="color:var(--c-muted); font-size:14px">Nenhum plano cadastrado.</p>
				{:else}
					<div class="stack-12">
						{#each participante.planosTrabalho as p (p.id)}
							<a
								href="/equipe/planos-trabalho/{p.id}"
								style="display:flex; gap:14px; padding:14px; border:1px solid var(--c-border); border-radius:var(--r-md); text-decoration:none; color:inherit"
							>
								<div style="flex:1">
									<div style="font-weight:600">
										{formatDate(p.dataInicio)} → {formatDate(p.dataFim)}
									</div>
									<div style="font-size:12.5px; color:var(--c-muted); margin-top:4px">
										{p.totalHorasDisponiveis ?? '—'}h/sem
									</div>
								</div>
								<StatusBadge status={p.status} />
							</a>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		{#if tab === 'afastamentos'}
			<section class="card" id="tab-afastamentos" role="tabpanel">
				<div class="card-hd"><h2>Afastamentos</h2></div>
				{#if !participante.afastamentos?.length}
					<p style="color:var(--c-muted); font-size:14px">Nenhum afastamento registrado.</p>
				{:else}
					<div class="stack-12">
						{#each participante.afastamentos as a, i (i)}
							<div
								style="padding:12px; border:1px solid var(--c-border); border-radius:var(--r-md)"
							>
								<div style="font-weight:600">{a.tipo}</div>
								<div style="font-size:12.5px; color:var(--c-muted); margin-top:4px">
									{formatDate(a.dataInicio)} → {formatDate(a.dataFim)} · {a.diasUteis} dias úteis
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	{/if}
</div>

<style>
	.tabs {
		display: flex;
		gap: 4px;
		margin-bottom: var(--gap-sec);
		border-bottom: 1px solid var(--c-border);
	}
	.tab {
		background: transparent;
		border: 0;
		padding: 10px 16px;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--c-muted);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}
	.tab[aria-selected='true'] {
		color: var(--c-primary);
		border-bottom-color: var(--c-primary);
	}
</style>
