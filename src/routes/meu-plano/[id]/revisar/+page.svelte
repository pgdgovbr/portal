<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import OwnershipBanner from '$lib/components/OwnershipBanner.svelte';
	import AssinaturaCard from '$lib/components/AssinaturaCard.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ModalidadeBadge from '$lib/components/ModalidadeBadge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const plano = $derived((data as any).plano);
	const diff = $derived(((data as any).diff ?? []) as Array<{
		campo: string;
		de: string;
		para: string;
		mono?: boolean;
	}>);
	const chefiaNome = $derived((data as any).chefiaNome as string);

	const planoId = $derived(plano?.id ?? '');

	const CAMPO_LABEL: Record<string, string> = {
		data_inicio: 'Data de início',
		data_termino: 'Data de término',
		carga_horaria_disponivel: 'Carga horária',
		criterios_avaliacao: 'Critérios de avaliação',
		trabalho_noturno: 'Trabalho noturno'
	};

	function labelCampo(campo: string): string {
		return CAMPO_LABEL[campo] ?? campo;
	}

	const totalCampos = $derived(diff.length);
	const camposLabel = $derived(totalCampos === 1 ? '1 campo' : `${totalCampos} campos`);

	let confirmandoDevolver = $state(false);
	let saving = $state(false);
	let errorMsg = $state<string | null>(null);

	const GRAPHQL_URL = $derived(
		env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app/graphql'
	);

	async function callMutation(query: string, variables: Record<string, unknown>): Promise<void> {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ query, variables })
		});
		const { errors } = await res.json();
		if (errors?.length) throw new Error(errors[0].message);
	}

	async function assinar() {
		if (saving) return;
		saving = true;
		errorMsg = null;
		try {
			await callMutation(
				`mutation AssinarPt($planoId: ID!) {
					assinarPt(planoId: $planoId) { id status }
				}`,
				{ planoId }
			);
			goto('/meu-plano?assinou=ok');
		} catch (err) {
			errorMsg = (err as Error).message ?? 'Erro ao assinar.';
		} finally {
			saving = false;
		}
	}

	function pedirDevolver() {
		confirmandoDevolver = true;
	}

	function cancelarDevolver() {
		confirmandoDevolver = false;
	}

	async function confirmarDevolver() {
		if (saving) return;
		saving = true;
		errorMsg = null;
		try {
			// "No-op": revalida o estado atual passando o mesmo valor de cargaHorariaDisponivel.
			// O backend trata como UPDATE pelo servidor, zera a assinatura da chefia
			// e devolve o PT para RASCUNHO_PARTICIPANTE.
			await callMutation(
				`mutation EditarPlanoTrabalho($planoId: ID!, $input: EditarPlanoTrabalhoInput!) {
					editarPlanoTrabalho(planoId: $planoId, input: $input) { id status }
				}`,
				{
					planoId,
					input: { cargaHorariaDisponivel: plano.cargaHorariaDisponivel }
				}
			);
			goto(`/meu-plano/${planoId}/editar`);
		} catch (err) {
			errorMsg = (err as Error).message ?? 'Erro ao devolver para ajustes.';
			confirmandoDevolver = false;
		} finally {
			saving = false;
		}
	}

	function fmtDataPtBr(iso: string | null | undefined): string {
		if (!iso) return '—';
		try {
			const d = new Date(iso);
			return new Intl.DateTimeFormat('pt-BR', {
				day: '2-digit',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			}).format(d);
		} catch {
			return iso;
		}
	}

	function fmtPeriodo(inicio: string | undefined, fim: string | undefined): string {
		if (!inicio || !fim) return '—';
		try {
			const fmt = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });
			return `${fmt.format(new Date(inicio))} → ${fmt.format(new Date(fim))}`;
		} catch {
			return `${inicio} → ${fim}`;
		}
	}
</script>

<svelte:head>
	<title>Revisar plano · {plano?.idPlanoTrabalho ?? ''} — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<span>{plano?.idPlanoTrabalho ?? planoId} · revisar</span>
	</div>

	<div class="pg-head">
		<div>
			<div style="display:flex; gap:10px; align-items:center; margin-bottom:4px">
				<StatusBadge status="AGUARDANDO_ASSINATURA_PARTICIPANTE" />
			</div>
			<h1 class="pg-title">Revisar seu plano de trabalho</h1>
			<p class="pg-sub">
				{chefiaNome} ajustou o plano e devolveu para sua revisão. Confira o que mudou.
			</p>
		</div>
	</div>

	<OwnershipBanner
		variant="comigo-revisor"
		atorOutro={chefiaNome}
		mostrarDiff={diff.length > 0}
	/>

	{#if errorMsg}
		<div class="banner urgent" role="alert" style="margin-bottom:var(--gap-sec, 24px)">
			<span class="icon"><Icon name="alert-triangle" size={20} /></span>
			<div>
				<div class="ttl">Erro</div>
				<div class="sub">{errorMsg}</div>
			</div>
		</div>
	{/if}

	<div class="g-2-1">
		<!-- Plano em modo leitura -->
		<div class="col" style="gap:var(--gap-sec)">
			{#if diff.length > 0}
				<section class="card card-warning-left">
					<div class="kicker kicker-warning">
						<Icon name="alert" size={13} />
						A chefia ajustou {camposLabel}
					</div>
					<div style="margin-top:12px">
						{#each diff as item}
							<div class="diff-row">
								<div class="kicker diff-row-kicker">{labelCampo(item.campo)}</div>
								<div class="diff-grid">
									<div class="diff-old" class:mono={item.mono}>{item.de}</div>
									<Icon name="arrowR" size={14} />
									<div class="diff-new" class:mono={item.mono}>{item.para}</div>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<section class="card">
				<div class="card-hd"><h2>Plano completo (leitura)</h2></div>
				<div class="kpi-row">
					<div>
						<div class="kpi-label">Período</div>
						<div class="kpi-val">{fmtPeriodo(plano?.dataInicio, plano?.dataTermino)}</div>
					</div>
					<div>
						<div class="kpi-label">Modalidade</div>
						<div style="margin-top:4px">
							<ModalidadeBadge modalidade={plano?.modalidade ?? 'TELETRABALHO_PARCIAL'} />
						</div>
					</div>
					<div>
						<div class="kpi-label">Carga</div>
						<div class="kpi-val">{plano?.cargaHorariaDisponivel ?? '—'} h/sem</div>
					</div>
					<div>
						<div class="kpi-label">Contribuições</div>
						<div class="kpi-val">{plano?.contribuicoes?.length ?? 0}</div>
					</div>
				</div>

				<div class="divider"></div>
				<div class="kicker">Contribuições</div>
				<div style="margin-top:10px">
					{#each (plano?.contribuicoes ?? []) as c (c.id)}
						<div class="contrib">
							<span class="contrib-tipo t{c.tipoContribuicao ?? 1}"
								>{c.tipoContribuicao ?? 1}</span
							>
							<div style="flex:1">
								<div class="contrib-desc">{c.descricao}</div>
							</div>
							<div class="contrib-pct">{c.percentualContribuicao}%</div>
						</div>
					{/each}
				</div>

				{#if plano?.criteriosAvaliacao}
					<div class="divider"></div>
					<div class="kicker">Critérios de avaliação</div>
					<p class="criterios-text">{plano.criteriosAvaliacao}</p>
				{/if}
			</section>
		</div>

		<!-- Side: assinatura + status -->
		<div class="col" style="gap:var(--gap-sec)">
			{#if confirmandoDevolver}
				<section class="card card-warning-left">
					<div class="kicker kicker-warning">
						<Icon name="alert" size={13} /> Tem certeza?
					</div>
					<p class="confirm-text">
						Isso vai zerar a assinatura de <strong>{chefiaNome}</strong>. Tem certeza?
					</p>
					<div class="confirm-actions">
						<button
							type="button"
							class="btn btn-primary"
							disabled={saving}
							onclick={confirmarDevolver}
						>
							<Icon name="edit" size={14} /> Sim, ajustar
						</button>
						<button type="button" class="btn btn-ghost" onclick={cancelarDevolver}>Não</button>
					</div>
				</section>
			{:else}
				<AssinaturaCard
					ator="{chefiaNome} (chefia)"
					onAssinar={assinar}
					onDevolver={pedirDevolver}
				/>
			{/if}

			<section class="card">
				<div class="card-hd"><h2 style="font-size:16px">Status das assinaturas</h2></div>
				<div class="stack-12">
					<div class="assina-status assina-status-ok">
						<span class="assina-pill assina-pill-ok">
							<Icon name="check" size={14} stroke={2.4} />
						</span>
						<div style="flex:1">
							<div class="assina-nome">Chefia · {chefiaNome}</div>
							<div class="assina-meta">
								Assinou em {fmtDataPtBr(plano?.dataAssinaturaChefia)}
							</div>
						</div>
					</div>
					<div class="assina-status assina-status-warn">
						<span class="assina-pill assina-pill-warn">
							<Icon name="clock" size={13} stroke={2.2} />
						</span>
						<div style="flex:1">
							<div class="assina-nome">Você · {plano?.participante?.nome ?? 'Servidor'}</div>
							<div class="assina-pending">Pendente</div>
						</div>
					</div>
				</div>
			</section>

			<section class="card">
				<div class="card-hd"><h2 style="font-size:16px">O que acontece</h2></div>
				<ul class="info-list">
					<li>
						<strong>Assinar</strong> ativa o plano (status muda para "Em execução") — você e a chefia
						ficam pactuados.
					</li>
					<li>
						<strong>Devolver para ajustes</strong> zera a assinatura da chefia e o plano volta para
						seu rascunho — você pode editar livremente antes de reenviar.
					</li>
				</ul>
			</section>
		</div>
	</div>
</div>

<style>
	.card-warning-left {
		border-left: 3px solid var(--c-warning);
	}
	.kicker-warning {
		color: var(--c-warning);
		display: inline-flex;
		gap: 6px;
		align-items: center;
	}

	.diff-row {
		padding: 12px;
		background: var(--c-surface-2);
		border-radius: var(--r-sm);
		margin-bottom: 10px;
	}
	.diff-row:last-child {
		margin-bottom: 0;
	}
	.diff-row-kicker {
		font-size: 10.5px;
		margin-bottom: 6px;
	}
	.diff-grid {
		display: grid;
		grid-template-columns: 1fr 16px 1fr;
		gap: 10px;
		align-items: center;
	}
	.diff-old {
		padding: 8px 10px;
		background: var(--c-danger-soft);
		color: var(--c-ink-2);
		border-radius: 4px;
		font-size: 13px;
		text-decoration: line-through;
	}
	.diff-new {
		padding: 8px 10px;
		background: var(--c-success-soft);
		color: var(--c-ink);
		border-radius: 4px;
		font-size: 13px;
		font-weight: 600;
	}
	.diff-old.mono,
	.diff-new.mono {
		font-family: var(--ff-mono, monospace);
	}

	.kpi-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 18px;
	}
	.kpi-val {
		font-weight: 700;
		font-family: var(--ff-display);
		margin-top: 4px;
	}
	.contrib-desc {
		font-weight: 600;
		color: var(--c-ink);
		font-size: 14px;
	}
	.criterios-text {
		font-size: 14px;
		color: var(--c-ink-2);
		line-height: 1.6;
		margin-top: 8px;
		white-space: pre-wrap;
	}

	.confirm-text {
		font-size: 14px;
		color: var(--c-ink-2);
		margin: 10px 0 16px;
		line-height: 1.55;
	}
	.confirm-actions {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.assina-status {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		border-radius: var(--r-sm);
	}
	.assina-status-ok {
		background: var(--c-success-soft);
	}
	.assina-status-warn {
		background: var(--c-warning-soft);
		border: 1.5px solid var(--c-warning);
	}
	.assina-pill {
		width: 28px;
		height: 28px;
		border-radius: 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.assina-pill-ok {
		background: var(--c-success);
		color: white;
	}
	.assina-pill-warn {
		background: white;
		color: var(--c-warning);
		border: 2px solid var(--c-warning);
	}
	.assina-nome {
		font-weight: 600;
		font-size: 13px;
	}
	.assina-meta {
		font-size: 11.5px;
		color: var(--c-muted);
	}
	.assina-pending {
		font-size: 11.5px;
		color: var(--c-warning);
		font-weight: 600;
	}

	.info-list {
		margin: 0;
		padding-left: 18px;
		font-size: 13.5px;
		color: var(--c-ink-2);
		line-height: 1.6;
	}
	.info-list li + li {
		margin-top: 8px;
	}

	@media (max-width: 640px) {
		.kpi-row {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
