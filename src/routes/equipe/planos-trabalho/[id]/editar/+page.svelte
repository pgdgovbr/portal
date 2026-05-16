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

	const plano = $derived(data.plano);
	const historico = $derived(data.historico ?? []);
	const participanteNome = $derived(data.participanteNome ?? 'Servidor');

	// Snapshot inicial — edições do usuário não voltam a sincronizar
	// (auto-save persiste no backend).
	const initialPlano = untrack(() => data.plano);
	let dataInicio = $state<string>(initialPlano?.dataInicio ?? '');
	let dataTermino = $state<string>(initialPlano?.dataTermino ?? '');
	let cargaHorariaDisponivel = $state<number>(initialPlano?.cargaHorariaDisponivel ?? 0);
	let criteriosAvaliacao = $state<string>(initialPlano?.criteriosAvaliacao ?? '');

	// Indicador de auto-save
	let ultimoSalvoEm = $state<Date | null>(null);
	let salvando = $state(false);
	let erroSave = $state<string | null>(null);

	let nowTick = $state(Date.now());
	$effect(() => {
		const id = setInterval(() => {
			nowTick = Date.now();
		}, 1000);
		return () => clearInterval(id);
	});

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
			pendingPatch = { ...patch, ...pendingPatch };
		} finally {
			salvando = false;
		}
	}

	function debouncedSave(patch: Record<string, unknown>) {
		pendingPatch = { ...pendingPatch, ...patch };
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			void flushSave();
		}, 800);
	}

	function onCampoChange(campo: string, valor: unknown) {
		debouncedSave({ [campo]: valor });
	}

	$effect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
				debounceTimer = null;
			}
		};
	});

	let enviando = $state(false);

	async function assinarEEnviar() {
		if (!plano) return;
		// Aguarda save em voo antes de enviar (race-safety, ver Fase 5).
		while (salvando) {
			await new Promise((r) => setTimeout(r, 50));
		}
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		await flushSave();
		if (erroSave) return;

		enviando = true;
		try {
			await gqlFetch(ENVIAR_MUTATION, { planoId: plano.id });
			await invalidateAll();
			await goto('/equipe?enviou=ok');
		} catch (e) {
			erroSave = e instanceof Error ? e.message : 'Erro ao enviar plano';
		} finally {
			enviando = false;
		}
	}

	function formatDateBr(iso: string): string {
		if (!iso) return '—';
		const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
		const d = m
			? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
			: new Date(iso);
		return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Ajustar plano · {plano?.idPlanoTrabalho ?? ''} — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/equipe">Equipe</a>
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
				<h1 class="pg-title">Ajustando plano de {participanteNome}</h1>
				<p class="pg-sub">
					{plano.idPlanoTrabalho ?? '—'} · {formatDateBr(plano.dataInicio)} → {formatDateBr(plano.dataTermino)}
				</p>
			</div>
		</div>

		<OwnershipBanner
			variant="comigo-editor"
			atorOutro="{participanteNome} (servidor)"
			onEnviar={assinarEEnviar}
		/>

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
				</section>

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
							Nenhuma contribuição cadastrada.
						</p>
					{/if}
				</section>

				<section class="card" data-testid="card-criterios">
					<div class="card-hd"><h2>4. Critérios de avaliação</h2></div>
					<div class="field">
						<label for="criterios">Critérios usados para avaliar entregas</label>
						<textarea
							id="criterios"
							class="input"
							rows="4"
							bind:value={criteriosAvaliacao}
							onchange={() => onCampoChange('criteriosAvaliacao', criteriosAvaliacao)}
						></textarea>
					</div>
				</section>

				<section class="card cta-card">
					<div style="display:flex; gap:14px; align-items:center">
						<div style="flex:1">
							<div class="cta-eyebrow">Pronto?</div>
							<h3 class="cta-title">Assinar e devolver para o servidor</h3>
							<p class="cta-sub">
								{participanteNome} receberá uma notificação e poderá revisar suas alterações.
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

	@media (max-width: 640px) {
		.cta-card {
			position: sticky;
			bottom: 0;
			z-index: 5;
		}
	}
</style>
