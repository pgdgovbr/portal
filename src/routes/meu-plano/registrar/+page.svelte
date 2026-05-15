<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import { env } from '$env/dynamic/public';

	const STEPS = ['Período', 'Descrição da execução', 'Ocorrências', 'Revisão e envio'];

	let step = $state(0);
	let loading = $state(false);
	let autoSavedAt = $state<Date | null>(null);
	let autoSaveTimer: ReturnType<typeof setTimeout>;

	// Form state
	let periodoInicio = $state('');
	let periodoFim = $state('');
	let descricao = $state('');
	let ocorrencias = $state('');
	let contribuicaoId = $state('');

	function autoSave() {
		clearTimeout(autoSaveTimer);
		autoSaveTimer = setTimeout(() => {
			autoSavedAt = new Date();
		}, 1000);
	}

	async function submit() {
		loading = true;
		try {
			const mutation = `
				mutation RegistrarExecucao($input: RegistrarExecucaoInput!) {
					registrarExecucao(input: $input) {
						id
						status
					}
				}
			`;

			const GRAPHQL_URL =
				env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app/graphql';

			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					query: mutation,
					variables: {
						input: {
							contribuicaoId,
							periodoInicio,
							periodoFim,
							descricaoAtividades: descricao,
							ocorrencias: ocorrencias || null
						}
					}
				})
			});

			const { data, errors } = await res.json();
			if (errors?.length) throw new Error(errors[0].message);

			goto('/meu-plano?registro=enviado');
		} catch (err) {
			alert('Erro ao enviar registro. Tente novamente.');
		} finally {
			loading = false;
		}
	}

	function next() {
		if (step < STEPS.length - 1) step++;
	}

	function prev() {
		if (step > 0) step--;
	}

	const canAdvance = $derived(
		step === 0 ? periodoInicio && periodoFim :
		step === 1 ? descricao.trim().length >= 50 :
		true
	);
</script>

<svelte:head>
	<title>Registrar Execução — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:1080px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<span>Registrar execução</span>
	</div>

	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Registro mensal</div>
			<h1 class="pg-title">Registrar execução</h1>
			<p class="pg-sub">Descreva os trabalhos realizados no período. O registro será enviado à chefia para avaliação.</p>
		</div>
		<UrgencyPill daysLeft={6} />
	</div>

	<div class="card" style="padding:22px 28px; margin-bottom:var(--gap-sec)">
		<Stepper steps={STEPS} current={step} />
	</div>

	<div class="g-2-1">
		<section class="card">
			<div class="card-hd">
				<div>
					<h2>{step + 1}. {STEPS[step]}</h2>
					{#if step === 1}
						<p>Liste contribuições, entregas e atividades concretas realizadas.</p>
					{/if}
				</div>
				{#if autoSavedAt}
					<span class="kicker" aria-live="polite">
						<Icon name="check" size={13} /> Auto-salvo ·
						{autoSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
					</span>
				{/if}
			</div>

			<div class="stack-20">
				{#if step === 0}
					<!-- Step 1: Período -->
					<div class="field">
						<label for="inicio">Período de execução</label>
						<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
							<div class="input-prefix">
								<span class="pf">De</span>
								<input
									id="inicio"
									type="date"
									class="input"
									bind:value={periodoInicio}
									oninput={autoSave}
									aria-required="true"
								/>
							</div>
							<div class="input-prefix">
								<span class="pf">Até</span>
								<input
									type="date"
									class="input"
									bind:value={periodoFim}
									oninput={autoSave}
									aria-required="true"
								/>
							</div>
						</div>
						<div class="help">O período não pode sobrepor registros anteriores.</div>
					</div>

				{:else if step === 1}
					<!-- Step 2: Descrição -->
					<div class="field">
						<label for="desc">Descrição dos trabalhos executados</label>
						<textarea
							id="desc"
							class="textarea"
							rows={10}
							placeholder="Descreva detalhadamente as atividades realizadas no período, incluindo entregas concretas, participação em reuniões relevantes, documentos produzidos, etc."
							bind:value={descricao}
							oninput={autoSave}
							aria-required="true"
							aria-describedby="desc-help"
							style="min-height:200px"
						></textarea>
						<div id="desc-help" class="help">
							Mínimo 50 caracteres.
							<span style="margin-left:8px; color:{descricao.length < 50 ? 'var(--c-danger)' : 'var(--c-success)'}">
								{descricao.length} caracteres
							</span>
						</div>
					</div>

				{:else if step === 2}
					<!-- Step 3: Ocorrências -->
					<div class="field">
						<label for="ocorr">Ocorrências no período</label>
						<div class="help optional">Licenças médicas, férias, impedimentos, afastamentos.</div>
						<textarea
							id="ocorr"
							class="textarea"
							rows={6}
							placeholder="Registre se houve algum período de afastamento, licença ou impedimento que afetou a execução das atividades."
							bind:value={ocorrencias}
							oninput={autoSave}
						></textarea>
					</div>

				{:else if step === 3}
					<!-- Step 4: Revisão -->
					<div class="stack-16">
						<div class="plaque">
							<div class="kpi-label">Período avaliativo</div>
							<div style="font-weight:600; margin-top:4px">
								{periodoInicio ? new Date(periodoInicio).toLocaleDateString('pt-BR') : '—'}
								→
								{periodoFim ? new Date(periodoFim).toLocaleDateString('pt-BR') : '—'}
							</div>
						</div>

						<div class="plaque">
							<div class="kpi-label">Descrição da execução</div>
							<div style="margin-top:8px; font-size:14px; line-height:1.6; white-space:pre-wrap">
								{#if descricao}{descricao}{:else}<em style="color:var(--c-muted)">Não preenchida</em>{/if}
							</div>
						</div>

						{#if ocorrencias}
							<div class="plaque">
								<div class="kpi-label">Ocorrências</div>
								<div style="margin-top:8px; font-size:14px; line-height:1.6">{ocorrencias}</div>
							</div>
						{/if}

						<div class="banner" style="border-left-color:var(--c-info)">
							<span class="icon" style="color:var(--c-info)"><Icon name="info" size={18} /></span>
							<div>
								<div class="ttl">Atenção</div>
								<div class="sub">Após o envio, o registro não poderá ser editado. A chefia terá até 20 dias para avaliá-lo.</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Navigation buttons -->
			<div class="row" style="margin-top:28px; justify-content:space-between">
				<div>
					{#if step > 0}
						<button class="btn btn-ghost" onclick={prev} type="button">
							<Icon name="chevron-left" size={16} /> Voltar
						</button>
					{:else}
						<a href="/meu-plano" class="btn btn-ghost">Cancelar</a>
					{/if}
				</div>
				<div>
					{#if step < STEPS.length - 1}
						<button
							class="btn btn-primary"
							onclick={next}
							type="button"
							disabled={!canAdvance}
						>
							Próximo <Icon name="chevron-right" size={16} />
						</button>
					{:else}
						<button
							class="btn btn-primary btn-lg"
							onclick={submit}
							type="button"
							disabled={loading}
						>
							{#if loading}
								Enviando…
							{:else}
								<Icon name="send" size={16} /> Enviar registro
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</section>

		<!-- Sidebar -->
		<div class="col" style="gap:var(--gap-sec)">
			<section class="card" style="border-left:3px solid var(--c-info)">
				<div class="kicker" style="color:var(--c-info)">
					<Icon name="info" size={13} /> Sobre este registro
				</div>
				<p style="font-size:13px; color:var(--c-ink-2); margin-top:10px; line-height:1.6">
					O registro deve cobrir todas as atividades realizadas no período.
					Seja específico: mencione entregas, documentos, reuniões e resultados concretos.
				</p>
			</section>

			<section class="card" style="border-left:3px solid var(--c-warning)">
				<div class="kicker" style="color:var(--c-warning)">
					<Icon name="clock" size={13} /> Prazo legal
				</div>
				<p style="font-size:13px; color:var(--c-ink-2); margin-top:10px; line-height:1.6">
					Planos com duração &gt; 30 dias devem ter registro enviado
					<strong>até o dia 10 do mês seguinte</strong>.
				</p>
				<div style="margin-top:10px">
					<UrgencyPill daysLeft={6} />
				</div>
			</section>
		</div>
	</div>
</div>
