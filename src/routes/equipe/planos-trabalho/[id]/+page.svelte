<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import NotaBadge from '$lib/components/NotaBadge.svelte';
	import NotaSelector from '$lib/components/NotaSelector.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import { initialsFrom } from '$lib/types';
	import type { Nota } from '$lib/types';
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const plano = $derived((data as any).plano);

	// Avaliar registro
	let registroSelecionado = $state<any>(null);
	let nota = $state<Nota | null>(null);
	let justificativa = $state('');
	let loadingAval = $state(false);

	const justificativaObrigatoria = $derived(nota === 1 || nota === 4 || nota === 5);
	const canSubmitAval = $derived(
		nota !== null && (!justificativaObrigatoria || justificativa.trim().length >= 10)
	);

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function abrirAvaliar(reg: any) {
		registroSelecionado = reg;
		nota = null;
		justificativa = '';
	}

	async function enviarAvaliacao() {
		if (!registroSelecionado || !nota) return;
		loadingAval = true;
		try {
			const mutation = `
				mutation Avaliar($input: AvaliarRegistroInput!) {
					avaliarRegistrosExecucao(input: $input) {
						id
						nota
					}
				}
			`;
			const GRAPHQL_URL = env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app/graphql';
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					query: mutation,
					variables: {
						input: {
							registroExecucaoId: registroSelecionado.id,
							nota,
							justificativa: justificativa || null
						}
					}
				})
			});
			const { errors } = await res.json();
			if (errors?.length) throw new Error(errors[0].message);
			registroSelecionado = null;
			// Recarregar a página para mostrar a avaliação
			window.location.reload();
		} catch {
			alert('Erro ao enviar avaliação. Tente novamente.');
		} finally {
			loadingAval = false;
		}
	}

	const registros = $derived(
		plano?.contribuicoes?.flatMap((c: any) => c.registrosExecucao ?? []) ?? []
	);
	const registrosPendentes = $derived(registros.filter((r: any) => r.status === 'ENVIADO'));
</script>

<svelte:head>
	<title>Plano de Trabalho — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/equipe">Equipe</a>
		<span class="sep">/</span>
		<span>Plano de Trabalho</span>
	</div>

	{#if !plano}
		<p style="color:var(--c-muted)">Carregando…</p>
	{:else}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">{plano.unidadeAutorizadoraNome}</div>
				<h1 class="pg-title">{plano.participante?.nome}</h1>
				<p class="pg-sub">
					SIAPE {plano.participante?.siape} ·
					{formatDate(plano.dataInicio)} → {formatDate(plano.dataFim)} ·
					{plano.totalHorasDisponiveis}h/sem
				</p>
			</div>
			<div class="row">
				<StatusBadge status={plano.status} />
				<a href="/equipe/participantes/{plano.participante?.id}" class="btn btn-ghost btn-sm">
					Ver perfil completo
				</a>
			</div>
		</div>

		<div class="g-2-1">
			<!-- Main -->
			<div class="col" style="gap:var(--gap-sec)">

				{#if registrosPendentes.length > 0}
					<div class="banner" style="margin-bottom:0">
						<span class="icon"><Icon name="alert-triangle" size={20} /></span>
						<div style="flex:1">
							<div class="ttl">{registrosPendentes.length} registro(s) aguardando avaliação</div>
							<div class="sub">Você tem até 20 dias após o envio para avaliar cada registro.</div>
						</div>
					</div>
				{/if}

				<!-- KPIs -->
				<section class="card">
					<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px">
						<div>
							<div class="kpi-label">Status</div>
							<div style="margin-top:6px"><StatusBadge status={plano.status} /></div>
						</div>
						<div>
							<div class="kpi-label">Contribuições</div>
							<div class="kpi-num" style="font-size:24px; margin-top:6px">
								{plano.contribuicoes?.length ?? 0}
							</div>
						</div>
						<div>
							<div class="kpi-label">Registros</div>
							<div class="kpi-num" style="font-size:24px; margin-top:6px">
								{registros.length}
							</div>
						</div>
					</div>
				</section>

				<!-- Registros de execução -->
				<section class="card">
					<div class="card-hd">
						<div>
							<h2>Registros de execução</h2>
							<p>Períodos enviados pelo servidor para avaliação</p>
						</div>
						{#if registrosPendentes.length > 0}
							<span class="bdg bdg-warning">
								<span class="dot"></span>
								{registrosPendentes.length} pendente(s)
							</span>
						{/if}
					</div>

					{#if registros.length === 0}
						<p style="color:var(--c-muted); font-size:14px">Nenhum registro enviado ainda.</p>
					{:else}
						<div class="stack-12">
							{#each registros as reg (reg.id)}
								{@const aval = reg.avaliacoes?.[0]}
								<div style="padding:14px; border-radius:var(--r-md); border:1px solid var(--c-border); background:{reg.status === 'ENVIADO' ? 'var(--c-warning-soft)' : 'var(--c-surface)'}">
									<div class="row" style="margin-bottom:10px; justify-content:space-between">
										<div>
											<div style="font-weight:600">
												{formatDate(reg.periodoInicio)}
												{#if reg.periodoFim} → {formatDate(reg.periodoFim)}{/if}
											</div>
											<div style="font-size:12.5px; color:var(--c-muted)">
												Enviado em {formatDate(reg.dataEnvio)}
											</div>
										</div>
										<StatusBadge status={reg.status} />
									</div>

									{#if reg.descricaoAtividades}
										<p style="font-size:13.5px; color:var(--c-ink-2); line-height:1.6; margin-bottom:10px; white-space:pre-wrap">
											{reg.descricaoAtividades.slice(0, 200)}{reg.descricaoAtividades.length > 200 ? '…' : ''}
										</p>
									{/if}

									{#if aval}
										<NotaBadge nota={aval.nota} />
										{#if aval.justificativa}
											<p style="font-size:13px; color:var(--c-muted); margin-top:6px; font-style:italic">
												"{aval.justificativa}"
											</p>
										{/if}
									{:else if reg.status === 'ENVIADO'}
										<button
											class="btn btn-primary btn-sm"
											onclick={() => abrirAvaliar(reg)}
										>
											Avaliar este registro
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>

			<!-- Sidebar -->
			<div class="col" style="gap:var(--gap-sec)">
				<!-- Participante -->
				<section class="card">
					<div class="card-hd"><h2 style="font-size:17px">Participante</h2></div>
					<div class="row" style="gap:12px; margin-bottom:14px">
						<div class="av av-lg" style="background:var(--c-primary); color:white">
							{initialsFrom(plano.participante?.nome ?? '')}
						</div>
						<div>
							<div style="font-weight:700">{plano.participante?.nome}</div>
							<div style="font-size:13px; color:var(--c-muted)">SIAPE {plano.participante?.siape}</div>
							<div style="font-size:13px; color:var(--c-muted)">{plano.participante?.email ?? ''}</div>
						</div>
					</div>
					<a href="/equipe/participantes/{plano.participante?.id}" class="btn btn-ghost btn-sm" style="width:100%">
						Ver perfil completo
					</a>
				</section>

				<!-- Critérios -->
				{#if plano.criteriosAvaliacao}
					<section class="card">
						<div class="card-hd"><h2 style="font-size:17px">Critérios de avaliação</h2></div>
						<p style="font-size:13.5px; color:var(--c-ink-2); line-height:1.6">
							{plano.criteriosAvaliacao}
						</p>
					</section>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Modal Avaliar Registro -->
{#if registroSelecionado}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) registroSelecionado = null; }}
		onkeydown={(e) => { if (e.key === 'Escape') registroSelecionado = null; }}
	>
		<div class="modal-box">
			<div class="modal-head">
				<h2 id="modal-title">Avaliar registro de execução</h2>
				<button class="tn-iconbtn" onclick={() => registroSelecionado = null} aria-label="Fechar">
					<Icon name="x" size={18} />
				</button>
			</div>

			<div class="g-1-2" style="gap:20px">
				<!-- Execução (leitura) -->
				<div>
					<div class="kpi-label" style="margin-bottom:8px">Descrição do servidor</div>
					<div style="font-size:13.5px; color:var(--c-ink-2); line-height:1.6; white-space:pre-wrap; background:var(--c-surface-2); padding:14px; border-radius:var(--r-md); border:1px solid var(--c-border); max-height:300px; overflow-y:auto">
						{registroSelecionado.descricaoAtividades ?? 'Sem descrição.'}
					</div>
					{#if registroSelecionado.ocorrencias}
						<div style="margin-top:12px">
							<div class="kpi-label" style="margin-bottom:6px">Ocorrências</div>
							<div style="font-size:13px; color:var(--c-muted)">
								{registroSelecionado.ocorrencias}
							</div>
						</div>
					{/if}
				</div>

				<!-- Form avaliação -->
				<div class="stack-20">
					<div class="field">
						<label for="nota-selector">Nota</label>
						<div id="nota-selector">
							<NotaSelector bind:value={nota} />
						</div>
					</div>

					{#if justificativaObrigatoria}
						<div class="field">
							<label for="justif">
								Justificativa <span style="color:var(--c-danger)">*</span>
							</label>
							<div class="help">Obrigatória para notas 1, 4 e 5.</div>
							<textarea
								id="justif"
								class="textarea"
								rows={5}
								placeholder="Descreva o motivo da nota atribuída…"
								bind:value={justificativa}
								aria-required="true"
							></textarea>
						</div>
					{:else}
						<div class="field">
							<label for="justif-opt">Justificativa</label>
							<div class="help optional">Recomendada para contextualizar a avaliação.</div>
							<textarea
								id="justif-opt"
								class="textarea"
								rows={4}
								placeholder="Comentários adicionais (opcional)…"
								bind:value={justificativa}
							></textarea>
						</div>
					{/if}

					<button
						class="btn btn-primary btn-lg"
						onclick={enviarAvaliacao}
						disabled={!canSubmitAval || loadingAval}
						style="width:100%"
					>
						{#if loadingAval}Enviando…{:else}<Icon name="check" size={16} /> Confirmar avaliação{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(14, 23, 38, .55);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		padding: 24px;
	}
	.modal-box {
		background: var(--c-surface);
		border-radius: var(--r-xl);
		box-shadow: var(--sh-lg);
		padding: 28px;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		overflow-y: auto;
	}
	.modal-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 22px;
	}
	.modal-head h2 {
		font-size: 20px;
		font-weight: 700;
		margin: 0;
	}
</style>
