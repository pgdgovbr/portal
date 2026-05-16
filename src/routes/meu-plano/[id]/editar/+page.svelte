<script lang="ts">
	import { untrack } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import OwnershipBanner from '$lib/components/OwnershipBanner.svelte';
	import EdicoesTimeline from '$lib/components/EdicoesTimeline.svelte';
	import { gqlFetch } from '$lib/graphql';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const plano = $derived((data as any).plano);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const historico = $derived<any[]>((data as any).historico ?? []);

	// Estado dos campos editáveis (snapshot inicial do data;
	// edições do usuário não voltam a sincronizar — auto-save persiste no backend).
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const initialPlano = untrack(() => (data as any).plano);
	let dataInicio = $state<string>(initialPlano?.dataInicio ?? '');
	let dataTermino = $state<string>(initialPlano?.dataTermino ?? '');
	let cargaHorariaDisponivel = $state<number>(initialPlano?.cargaHorariaDisponivel ?? 0);
	let criteriosAvaliacao = $state<string>(initialPlano?.criteriosAvaliacao ?? '');
	let trabalhoNoturno = $state<boolean>(false);

	// Indicador de auto-save
	let ultimoSalvoEm = $state<Date | null>(null);
	let salvando = $state(false);
	let erroSave = $state<string | null>(null);

	// Tick reativo p/ "Auto-salvo há Ns" — incrementado a cada 1s
	let nowTick = $state(Date.now());

	if (typeof window !== 'undefined') {
		const id = setInterval(() => {
			nowTick = Date.now();
		}, 1000);
		// cleanup ao desmontar via $effect.root → simples: deixa rodar enquanto a página vive
		// (em SPA, sair da rota recria o componente)
		void id;
	}

	const segundosDesdeSalvo = $derived(
		ultimoSalvoEm ? Math.max(0, Math.floor((nowTick - ultimoSalvoEm.getTime()) / 1000)) : null
	);

	const labelAutoSave = $derived.by(() => {
		if (salvando) return 'Salvando...';
		if (erroSave) return null;
		if (segundosDesdeSalvo == null) return null;
		if (segundosDesdeSalvo < 5) return 'Auto-salvo agora';
		if (segundosDesdeSalvo < 60) return `Auto-salvo há ${segundosDesdeSalvo}s`;
		const min = Math.floor(segundosDesdeSalvo / 60);
		return `Auto-salvo há ${min}min`;
	});

	// Debounce de auto-save
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let pendingPatch: Record<string, unknown> = {};

	const EDITAR_MUTATION = `
		mutation EditarPlano($planoId: ID!, $input: EditarPlanoTrabalhoInput!) {
			editarPlanoTrabalho(planoId: $planoId, input: $input) {
				id
				status
			}
		}
	`;

	const ENVIAR_MUTATION = `
		mutation EnviarPt($planoId: ID!) {
			enviarPtParaOutroLado(planoId: $planoId) { id status }
		}
	`;

	const CANCELAR_MUTATION = `
		mutation CancelarPt($planoId: ID!) {
			cancelarPlanoTrabalho(planoId: $planoId) { id status }
		}
	`;

	async function flushSave() {
		if (!plano || Object.keys(pendingPatch).length === 0) return;
		const patch = pendingPatch;
		pendingPatch = {};
		salvando = true;
		erroSave = null;
		try {
			await gqlFetch(EDITAR_MUTATION, { planoId: plano.id, input: patch });
			ultimoSalvoEm = new Date();
		} catch (e) {
			erroSave = e instanceof Error ? e.message : 'Erro ao salvar';
			// Reinjeta o patch para nova tentativa em próxima edição
			pendingPatch = { ...patch, ...pendingPatch };
		} finally {
			salvando = false;
		}
	}

	function debouncedSave(patch: Record<string, unknown>) {
		pendingPatch = { ...pendingPatch, ...patch };
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			void flushSave();
		}, 800);
	}

	function onCampoChange(campo: string, valor: unknown) {
		debouncedSave({ [campo]: valor });
	}

	// Menu overflow
	let menuAberto = $state(false);

	async function descartarRascunho() {
		if (!plano) return;
		const ok = confirm('Tem certeza que quer descartar este rascunho? Esta ação não pode ser desfeita.');
		if (!ok) return;
		try {
			await gqlFetch(CANCELAR_MUTATION, { planoId: plano.id });
			await goto('/meu-plano');
		} catch (e) {
			erroSave = e instanceof Error ? e.message : 'Erro ao descartar rascunho';
		}
	}

	let enviando = $state(false);

	async function assinarEEnviar() {
		if (!plano) return;
		// Garante que pendências de auto-save foram salvas antes de enviar
		if (debounceTimer) clearTimeout(debounceTimer);
		await flushSave();
		if (erroSave) return;

		enviando = true;
		try {
			await gqlFetch(ENVIAR_MUTATION, { planoId: plano.id });
			await invalidateAll();
			await goto('/meu-plano');
		} catch (e) {
			erroSave = e instanceof Error ? e.message : 'Erro ao enviar plano';
		} finally {
			enviando = false;
		}
	}

	function formatDateBr(iso: string): string {
		if (!iso) return '—';
		const d = new Date(iso);
		return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Editar Plano de Trabalho — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<span>{plano?.idPlanoTrabalho ?? plano?.id} · editar</span>
	</div>

	{#if !plano}
		<p style="color:var(--c-muted)">Plano não encontrado.</p>
	{:else}
		<div class="pg-head">
			<div>
				<div style="display:flex; gap:10px; align-items:center; margin-bottom:4px">
					<StatusBadge status={plano.status} />
					{#if labelAutoSave}
						<span class="auto-save-indicator" data-testid="auto-save-indicator">
							{labelAutoSave}
						</span>
					{/if}
				</div>
				<h1 class="pg-title">Plano de Trabalho</h1>
				<p class="pg-sub">
					{plano.idPlanoTrabalho ?? '—'} · {formatDateBr(plano.dataInicio)} → {formatDateBr(plano.dataTermino)} · ainda não enviado
				</p>
			</div>
			<div style="display:flex; gap:8px; position:relative">
				<button type="button" class="btn btn-ghost btn-sm">
					<Icon name="download" size={13} /> Exportar PDF
				</button>
				<button
					type="button"
					class="tn-iconbtn"
					aria-label="Mais opções"
					aria-haspopup="menu"
					aria-expanded={menuAberto}
					onclick={() => (menuAberto = !menuAberto)}
				>
					<Icon name="dots" size={16} />
				</button>
				{#if menuAberto}
					<div class="overflow-menu" role="menu">
						<button
							type="button"
							role="menuitem"
							class="overflow-menu-item overflow-danger"
							onclick={() => {
								menuAberto = false;
								void descartarRascunho();
							}}
						>
							<Icon name="x" size={13} /> Descartar rascunho
						</button>
					</div>
				{/if}
			</div>
		</div>

		<OwnershipBanner variant="comigo-editor" atorOutro="sua chefia" onEnviar={assinarEEnviar} />

		{#if erroSave}
			<div class="erro-banner" role="alert">
				<Icon name="alert-triangle" size={16} /> {erroSave}
				<button type="button" class="btn btn-ghost btn-sm" onclick={() => (erroSave = null)}>
					Fechar
				</button>
			</div>
		{/if}

		<div class="g-2-1">
			<div class="col" style="gap:var(--gap-sec)">
				<!-- 1. Período & vínculo -->
				<section class="card" data-testid="card-periodo">
					<div class="card-hd">
						<h2>1. Período &amp; vínculo</h2>
					</div>
					<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
						<div class="field">
							<label for="data-inicio">Início</label>
							<input
								id="data-inicio"
								type="date"
								class="input"
								bind:value={dataInicio}
								onchange={() => onCampoChange('dataInicio', dataInicio)}
							/>
						</div>
						<div class="field">
							<label for="data-termino">Fim</label>
							<input
								id="data-termino"
								type="date"
								class="input"
								bind:value={dataTermino}
								onchange={() => onCampoChange('dataTermino', dataTermino)}
							/>
						</div>
					</div>
				</section>

				<!-- 2. Modalidade & carga -->
				<section class="card" data-testid="card-modalidade">
					<div class="card-hd"><h2>2. Modalidade &amp; carga</h2></div>
					<div class="field" style="max-width:280px">
						<label for="carga-horaria">Carga horária semanal (horas)</label>
						<input
							id="carga-horaria"
							type="number"
							class="input"
							min="1"
							max="44"
							bind:value={cargaHorariaDisponivel}
							onchange={() => onCampoChange('cargaHorariaDisponivel', cargaHorariaDisponivel)}
						/>
					</div>
					<div class="field" style="margin-top:14px">
						<label style="display:flex; gap:8px; align-items:center; font-weight:500">
							<input
								type="checkbox"
								bind:checked={trabalhoNoturno}
								onchange={() => onCampoChange('trabalhoNoturno', trabalhoNoturno)}
							/>
							Trabalho noturno autorizado
						</label>
					</div>
				</section>

				<!-- 3. Contribuições -->
				<section class="card" data-testid="card-contribuicoes">
					<div class="card-hd">
						<div>
							<h2>3. Contribuições</h2>
							<p>{plano.contribuicoes?.length ?? 0} adicionada(s)</p>
						</div>
					</div>
					{#if plano.contribuicoes?.length}
						<div class="list">
							{#each plano.contribuicoes as c (c.id)}
								<div class="list-item">
									<div class="numdot">{c.percentualContribuicao}%</div>
									<div style="flex:1">
										<div style="font-weight:600; font-size:14px">{c.descricao}</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p style="color:var(--c-muted); font-size:13.5px">
							Nenhuma contribuição cadastrada. Adicione contribuições via wizard de criação.
						</p>
					{/if}
				</section>

				<!-- 4. Critérios de avaliação -->
				<section class="card" data-testid="card-criterios">
					<div class="card-hd"><h2>4. Critérios de avaliação</h2></div>
					<div class="field">
						<label for="criterios">Critérios usados pela chefia para avaliar entregas</label>
						<textarea
							id="criterios"
							class="input"
							rows="4"
							bind:value={criteriosAvaliacao}
							onchange={() => onCampoChange('criteriosAvaliacao', criteriosAvaliacao)}
						></textarea>
					</div>
				</section>

				<!-- CTA: assinar e enviar -->
				<section class="card cta-card">
					<div style="display:flex; gap:14px; align-items:center">
						<div style="flex:1">
							<div class="cta-eyebrow">Pronto?</div>
							<h3 class="cta-title">Assinar e enviar para chefia</h3>
							<p class="cta-sub">
								Sua chefia receberá uma notificação e poderá revisar.
							</p>
						</div>
						<button
							type="button"
							class="btn btn-lg cta-btn"
							disabled={enviando}
							onclick={assinarEEnviar}
						>
							<Icon name="paperPlane" size={16} />
							{enviando ? 'Enviando...' : 'Assinar e enviar'}
						</button>
					</div>
				</section>
			</div>

			<!-- Sidebar -->
			<div class="col" style="gap:var(--gap-sec)">
				<section class="card">
					<div class="card-hd">
						<h2 style="font-size:16px">Histórico desde a criação</h2>
					</div>
					{#if historico.length === 0}
						<p style="color:var(--c-muted); font-size:13px">Sem edições registradas ainda.</p>
					{:else}
						<EdicoesTimeline items={historico} />
					{/if}
				</section>

				<section class="card" style="background:var(--c-surface-2)">
					<div class="kicker">
						<Icon name="info" size={13} /> Atalhos
					</div>
					<div class="stack-12" style="margin-top:12px">
						<button
							type="button"
							class="btn btn-ghost btn-sm"
							style="width:100%; justify-content:flex-start"
						>
							<Icon name="download" size={13} /> Exportar PDF para revisar offline
						</button>
						<button
							type="button"
							class="btn btn-ghost btn-sm overflow-danger"
							style="width:100%; justify-content:flex-start"
							onclick={descartarRascunho}
						>
							<Icon name="x" size={13} /> Descartar rascunho
						</button>
					</div>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.auto-save-indicator {
		font-size: 12.5px;
		color: var(--c-muted);
	}

	.erro-banner {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		border-radius: var(--r-md);
		background: var(--c-danger-soft, #fbe6e6);
		color: var(--c-danger, #b91c1c);
		border-left: 4px solid var(--c-danger, #b91c1c);
		margin-bottom: var(--gap-sec, 24px);
		font-size: 13.5px;
	}
	.erro-banner button {
		margin-left: auto;
	}

	.overflow-menu {
		position: absolute;
		top: 36px;
		right: 0;
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--r-md);
		box-shadow: var(--sh-md);
		min-width: 200px;
		padding: 6px;
		z-index: 50;
	}
	.overflow-menu-item {
		width: 100%;
		text-align: left;
		padding: 8px 12px;
		background: transparent;
		border: 0;
		border-radius: var(--r-sm);
		font-size: 13.5px;
		cursor: pointer;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.overflow-menu-item:hover {
		background: var(--c-surface-2);
	}
	.overflow-danger {
		color: var(--c-danger, #b91c1c);
	}

	.cta-card {
		background: linear-gradient(135deg, var(--c-primary) 0%, #1351b4 100%);
		color: white;
		border: none;
	}
	.cta-eyebrow {
		font-size: 12px;
		opacity: 0.85;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
	}
	.cta-title {
		font-family: var(--ff-display);
		font-weight: 700;
		font-size: 20px;
		margin: 4px 0 0;
		letter-spacing: -0.01em;
		color: white;
	}
	.cta-sub {
		font-size: 13px;
		opacity: 0.85;
		margin: 4px 0 0;
	}
	.cta-btn {
		background: white;
		color: var(--c-primary);
	}
</style>
