<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/Icon.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import type { PageData } from './$types';

	let {
		data,
		form,
	}: {
		data: PageData;
		form: {
			error?: string;
			planoCriadoId?: string;
			contribuicoesCriadas?: number;
		} | null;
	} = $props();

	const user = $derived((data as any).user);
	const planosEntregas = $derived((data as any).planosEntregas ?? []);
	const participante = $derived((data as any).participante ?? null);

	// Retomada de falha parcial — preservados entre submits via hidden inputs.
	let planoCriadoId = $state<string>('');
	let contribuicoesCriadas = $state<number>(0);
	let submitError = $state<string | null>(null);

	$effect(() => {
		if (form?.error) submitError = form.error;
		if (form?.planoCriadoId) planoCriadoId = form.planoCriadoId;
		if (typeof form?.contribuicoesCriadas === 'number')
			contribuicoesCriadas = form.contribuicoesCriadas;
		// Sucesso → server fez redirect; nada a fazer aqui.
	});

	const STEPS = [
		'Período',
		'Modalidade & carga',
		'Critérios de avaliação',
		'Contribuições',
		'Revisão',
	];

	const MODALIDADES = [
		{ value: 'PRESENCIAL', label: 'Presencial', sub: 'Sem teletrabalho' },
		{ value: 'TELETRABALHO_PARCIAL', label: 'TT Parcial', sub: 'Até 50% do tempo' },
		{ value: 'TELETRABALHO_INTEGRAL', label: 'TT Integral', sub: '100% do tempo' },
	];

	const CARGA_OPCOES = [20, 30, 40, 0] as const;

	// Banner "Dica" — só visível na primeira criação (cookie pgd_pact_wizard_seen)
	function readCookie(name: string): string | null {
		if (typeof document === 'undefined') return null;
		const entry = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
		return entry ? decodeURIComponent(entry.split('=')[1]) : null;
	}
	function setCookie(name: string, value: string, days = 365) {
		if (typeof document === 'undefined') return;
		const exp = new Date(Date.now() + days * 86400000).toUTCString();
		document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
	}

	let dicaVisible = $state(readCookie('pgd_pact_wizard_seen') !== '1');
	function dismissDica() {
		dicaVisible = false;
		setCookie('pgd_pact_wizard_seen', '1');
	}

	let step = $state(0);
	let loading = $state(false);
	let savedAt = $state<Date | null>(null);

	// Step 0 — Período + vínculo opcional
	let dataInicio = $state('');
	let dataFim = $state('');
	let planoEntregasId = $state<string>('');

	// Step 1 — Modalidade & carga
	let modalidade = $state('TELETRABALHO_PARCIAL');
	let cargaHoras = $state(40);
	let cargaCustom = $state('');

	// Step 2 — Critérios
	let criterios = $state<string[]>([
		'Cumprimento de prazos das entregas vinculadas',
		'Qualidade técnica dos produtos entregues',
		'Comunicação efetiva com a equipe',
	]);
	let novoCriterio = $state('');

	// Step 3 — Contribuições
	interface Contribuicao {
		tipo: number;
		descricao: string;
		percentual: number;
		idPlanoEntregas?: string;
	}
	let contribuicoes = $state<Contribuicao[]>([]);
	let novoTipo = $state(2);
	let novaDesc = $state('');
	let novoPct = $state(10);
	let novoIdPe = $state<string>('');

	const duracaoMeses = $derived(() => {
		if (!dataInicio || !dataFim) return '';
		const d1 = new Date(dataInicio);
		const d2 = new Date(dataFim);
		const meses = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 30));
		return meses > 0 ? `${meses} ${meses === 1 ? 'mês' : 'meses'}` : '';
	});

	const cargaEfetiva = $derived(() => {
		const h = cargaHoras || parseInt(cargaCustom) || 0;
		if (!dataInicio || !dataFim || !h) return null;
		const d1 = new Date(dataInicio);
		const d2 = new Date(dataFim);
		const semanas = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7));
		return { h, semanas, total: semanas * h };
	});

	const totalPct = $derived(contribuicoes.reduce((a, c) => a + c.percentual, 0));
	const restantePct = $derived(100 - totalPct);

	const canAdvance = $derived(
		step === 0
			? !!(dataInicio && dataFim && new Date(dataFim) > new Date(dataInicio))
			: step === 1
				? cargaHoras > 0 || parseInt(cargaCustom) > 0
				: step === 2
					? criterios.length > 0
					: step === 3
						? totalPct === 100 && contribuicoes.length > 0
						: true
	);

	const TIPO_COLORS = ['', 'var(--c-primary)', 'var(--c-success)', 'var(--c-status-aval, #b45309)'];

	function autoSave() {
		savedAt = new Date();
	}

	function setCriterio(i: number, val: string) {
		criterios = criterios.map((c, idx) => (idx === i ? val : c));
	}
	function removeCriterio(i: number) {
		criterios = criterios.filter((_, idx) => idx !== i);
	}
	function addCriterio() {
		if (novoCriterio.trim()) {
			criterios = [...criterios, novoCriterio.trim()];
			novoCriterio = '';
		}
	}

	function addContribuicao() {
		if (!novaDesc.trim() || novoPct <= 0 || novoPct > restantePct) return;
		const c: Contribuicao = {
			tipo: novoTipo,
			descricao: novaDesc.trim(),
			percentual: novoPct,
		};
		if (novoTipo === 1 && novoIdPe) c.idPlanoEntregas = novoIdPe;
		contribuicoes = [...contribuicoes, c];
		novaDesc = '';
		novoPct = Math.min(10, restantePct);
		novoIdPe = '';
		autoSave();
	}
	function removeContribuicao(i: number) {
		contribuicoes = contribuicoes.filter((_, idx) => idx !== i);
	}

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
	}

	// Submit handler: form action no servidor cuida das mutations sequenciais
	// num único try/catch — qualquer falha retorna `planoCriadoId` + `contribuicoesCriadas`
	// para o cliente, permitindo retomada idempotente sem criar PT órfão.
	function onSubmit() {
		loading = true;
		submitError = null;
		dismissDica();
		return async ({
			result,
			update,
		}: {
			result: { type: string };
			update: () => Promise<void>;
		}) => {
			await update();
			loading = false;
			// Sucesso (`redirect`) já foi processado pelo enhance; falhas chegam via `form` prop.
			if (result.type === 'failure') {
				// erros já estarão em `form.error` via $effect acima
			}
		};
	}
</script>

<svelte:head>
	<title>Criar meu plano de trabalho — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:1200px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<span>Criar plano</span>
	</div>

	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Criando seu plano de trabalho</div>
			<h1 class="pg-title">Como você vai contribuir?</h1>
			<p class="pg-sub">
				Etapa {step + 1} de {STEPS.length} · <strong>{STEPS[step]}</strong>
			</p>
		</div>
		<div class="row" style="gap:10px; align-items:center">
			{#if savedAt}
				<span style="font-size:12.5px; color:var(--c-muted)">
					Rascunho salvo às {savedAt.toLocaleTimeString('pt-BR', {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</span>
			{/if}
			<a href="/meu-plano" class="btn btn-ghost btn-sm">
				<Icon name="x" size={14} /> Sair
			</a>
		</div>
	</div>

	<div class="card" style="padding:22px 28px; margin-bottom:var(--gap-sec)">
		<Stepper steps={STEPS} current={step} />
	</div>

	{#if dicaVisible}
		<div
			data-testid="wizard-dica-banner"
			style="background:var(--c-info-soft, #eff6ff); border:1px solid var(--c-info, #3b82f6)22; border-radius:var(--r-md); padding:12px 16px; margin-bottom:var(--gap-sec); display:flex; gap:12px; align-items:flex-start"
		>
			<Icon name="info" size={18} />
			<div
				style="flex:1; font-size:13px; color:var(--c-primary-ink, #0f172a); line-height:1.55"
			>
				<strong>Dica:</strong> contribuições do <strong>tipo 1</strong> precisam estar vinculadas
				a entregas do plano da sua unidade — pergunte à sua chefia se tiver dúvida.
				<strong>Tipo 2</strong> é livre (capacitação, gestão); <strong>tipo 3</strong> apoia
				entregas de outras unidades.
			</div>
			<button
				class="tn-iconbtn"
				style="width:24px;height:24px"
				onclick={dismissDica}
				aria-label="Fechar dica"
			>
				<Icon name="x" size={12} />
			</button>
		</div>
	{/if}

	{#if submitError}
		<div
			role="alert"
			data-testid="wizard-submit-error"
			style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; border-radius:var(--r-md); padding:12px 16px; margin-bottom:var(--gap-sec); display:flex; gap:10px; align-items:flex-start"
		>
			<Icon name="alert-triangle" size={18} />
			<div style="flex:1; font-size:13px; line-height:1.5">
				<strong>Não foi possível salvar.</strong> {submitError}
				{#if planoCriadoId}
					<div style="margin-top:6px; font-size:12px; color:#7f1d1d">
						Rascunho parcial preservado — ao tentar novamente, o sistema retomará do ponto da falha.
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<form
		method="POST"
		use:enhance={onSubmit}
		class="g-2-1"
	>
		<input type="hidden" name="dataInicio" value={dataInicio} />
		<input type="hidden" name="dataFim" value={dataFim} />
		<input
			type="hidden"
			name="cargaHoras"
			value={cargaHoras || parseInt(cargaCustom) || 0}
		/>
		<input type="hidden" name="planoEntregasId" value={planoEntregasId} />
		<input type="hidden" name="criterios" value={JSON.stringify(criterios)} />
		<input
			type="hidden"
			name="contribuicoes"
			value={JSON.stringify(contribuicoes)}
		/>
		<input type="hidden" name="planoCriadoId" value={planoCriadoId} />
		<input
			type="hidden"
			name="contribuicoesCriadas"
			value={String(contribuicoesCriadas)}
		/>
		<section class="card">
			<div class="card-hd">
				<div>
					<h2>
						{step === 0 && 'Período do plano'}
						{step === 1 && 'Modalidade e carga horária'}
						{step === 2 && 'Como você quer ser avaliado(a)?'}
						{step === 3 && 'Suas contribuições'}
						{step === 4 && 'Revisão final'}
					</h2>
					<p>
						{step === 0 && 'Defina o intervalo de vigência. Máximo de 1 ano.'}
						{step === 1 && 'Escolha modalidade e horas semanais disponíveis.'}
						{step === 2 && 'Liste critérios objetivos que orientarão as notas mensais.'}
						{step === 3 && 'Some 100% da sua carga em atividades concretas.'}
						{step === 4 && 'Confira tudo antes de enviar à chefia ou salvar como rascunho.'}
					</p>
				</div>
			</div>

			<div class="stack-20">
				{#if step === 0}
					<div class="field">
						<label for="periodo">Vigência</label>
						<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px">
							<div class="input-prefix">
								<span class="pf">Início</span>
								<input
									id="data-inicio"
									type="date"
									class="input"
									aria-label="Início"
									bind:value={dataInicio}
									oninput={autoSave}
								/>
							</div>
							<div class="input-prefix">
								<span class="pf">Fim</span>
								<input
									id="data-fim"
									type="date"
									class="input"
									aria-label="Fim"
									bind:value={dataFim}
									oninput={autoSave}
								/>
							</div>
							<div class="input-prefix">
								<span class="pf">Duração</span>
								<input
									class="input"
									aria-label="Duração"
									value={duracaoMeses()}
									disabled
									style="background:var(--c-surface-2)"
								/>
							</div>
						</div>
						<div class="help">
							Planos semestrais (~6 meses) são o padrão recomendado pelo MGI.
						</div>
					</div>

					<div class="field">
						<label for="vincPe">Vincular a um plano de entregas (opcional)</label>
						{#if planosEntregas.length > 0}
							<select id="vincPe" class="select" bind:value={planoEntregasId}>
								<option value="">Sem vínculo direto</option>
								{#each planosEntregas as pe}
									<option value={pe.id}
										>{pe.idPlanoEntregas} · {pe.dataInicio} → {pe.dataTermino}</option
									>
								{/each}
							</select>
							<div class="help">
								Você pode vincular contribuições específicas a entregas no próximo passo.
							</div>
						{:else}
							<div class="help">Nenhum plano de entregas disponível no momento.</div>
						{/if}
					</div>
				{:else if step === 1}
					<div class="field">
						<label>Modalidade de execução</label>
						<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px">
							{#each MODALIDADES as m}
								<label
									style="padding:14px; border:{modalidade === m.value
										? '2px solid var(--c-primary)'
										: '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-md); cursor:pointer; background:{modalidade ===
									m.value
										? 'var(--c-primary-soft)'
										: 'white'}"
								>
									<input
										type="radio"
										bind:group={modalidade}
										value={m.value}
										style="display:none"
									/>
									<div
										style="font-weight:700; font-size:14px; color:{modalidade === m.value
											? 'var(--c-primary)'
											: 'var(--c-ink)'}"
									>
										{m.label}
									</div>
									<div style="font-size:12px; color:var(--c-muted); margin-top:2px">
										{m.sub}
									</div>
								</label>
							{/each}
						</div>
					</div>

					<div class="field">
						<label>Carga horária semanal</label>
						<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px">
							{#each CARGA_OPCOES as h}
								<label
									style="padding:18px; text-align:center; border:{cargaHoras === h && h !== 0
										? '2px solid var(--c-primary)'
										: '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-md); cursor:pointer; background:{cargaHoras ===
										h && h !== 0
										? 'var(--c-primary-soft)'
										: 'white'}"
								>
									<input type="radio" bind:group={cargaHoras} value={h} style="display:none" />
									<div
										style="font-family:var(--ff-display); font-weight:800; font-size:26px; color:{cargaHoras ===
											h && h !== 0
											? 'var(--c-primary)'
											: 'var(--c-ink)'}"
									>
										{h || '—'}
									</div>
									<div style="font-size:12px; color:var(--c-muted); margin-top:4px">
										{h ? 'horas/semana' : 'Outra'}
									</div>
								</label>
							{/each}
						</div>
						{#if cargaHoras === 0}
							<div class="input-prefix" style="margin-top:10px; max-width:180px">
								<input
									type="number"
									class="input"
									bind:value={cargaCustom}
									placeholder="ex: 25"
									min="1"
									max="44"
									aria-label="Carga horária customizada"
								/>
								<span class="pf">h/sem</span>
							</div>
						{/if}
					</div>

					{#if cargaEfetiva()}
						<div
							style="padding:16px; background:var(--c-surface-2); border-radius:var(--r-md); border:1px solid var(--c-border)"
						>
							<div style="display:flex; justify-content:space-between; align-items:center">
								<div>
									<div style="font-size:12.5px; color:var(--c-muted)">
										{cargaEfetiva()!.semanas} semanas × {cargaEfetiva()!.h}h
									</div>
									<div
										style="font-family:var(--ff-display); font-weight:800; font-size:28px; color:var(--c-ink); margin-top:4px"
									>
										{cargaEfetiva()!.total.toLocaleString('pt-BR')} horas
									</div>
								</div>
								<div style="text-align:right; font-size:12.5px; color:var(--c-muted)">
									estimado no período
								</div>
							</div>
						</div>
					{/if}
				{:else if step === 2}
					<div class="stack-12">
						{#each criterios as c, i}
							<div
								style="display:flex; gap:12px; align-items:center; padding:12px 14px; border:1px solid var(--c-border); border-radius:var(--r-md); background:white"
							>
								<span class="numdot">{i + 1}</span>
								<input
									class="input"
									value={c}
									oninput={(e) => setCriterio(i, (e.target as HTMLInputElement).value)}
									style="flex:1; border:0; padding:0; font-size:14px; background:transparent; box-shadow:none"
									aria-label="Critério {i + 1}"
								/>
								<button
									class="tn-iconbtn"
									type="button"
									style="width:32px;height:32px;color:var(--c-danger)"
									onclick={() => removeCriterio(i)}
									aria-label="Remover critério"
								>
									<Icon name="x" size={14} />
								</button>
							</div>
						{/each}
					</div>

					<div class="field">
						<label for="novo-crit">Novo critério</label>
						<div style="display:flex; gap:8px">
							<input
								id="novo-crit"
								class="input"
								bind:value={novoCriterio}
								placeholder="Descreva o critério…"
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addCriterio();
									}
								}}
							/>
							<button
								class="btn btn-ghost"
								onclick={addCriterio}
								disabled={!novoCriterio.trim()}
								type="button">Adicionar</button
							>
						</div>
					</div>
				{:else if step === 3}
					{#if contribuicoes.length > 0}
						<div
							style="display:flex; height:14px; border-radius:8px; overflow:hidden; background:var(--c-bg-deep, #f1f5f9)"
						>
							{#each contribuicoes as c}
								<div
									style="width:{c.percentual}%; background:{TIPO_COLORS[
										c.tipo
									]}; border-right:2px solid white"
									title="{c.percentual}% · {c.descricao}"
								></div>
							{/each}
						</div>
					{/if}

					<div class="stack-12">
						{#each contribuicoes as c, i}
							<div
								style="display:flex; gap:14px; align-items:flex-start; padding:16px; border:1px solid var(--c-border); border-radius:var(--r-md)"
							>
								<div
									style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:{TIPO_COLORS[
										c.tipo
									]};color:white;font-weight:800;font-size:13px;flex:none"
								>
									{c.tipo}
								</div>
								<div style="flex:1">
									<div style="font-weight:600; font-size:14px">{c.descricao}</div>
									<div style="margin-top:6px; display:flex; align-items:center; gap:10px">
										<div
											style="flex:1; max-width:200px; height:6px; border-radius:3px; background:var(--c-bg-deep, #f1f5f9); overflow:hidden"
										>
											<div
												style="width:{c.percentual}%; height:100%; background:{TIPO_COLORS[
													c.tipo
												]}; border-radius:3px"
											></div>
										</div>
										<span
											style="font-family:var(--ff-display); font-weight:700; font-size:13px"
											>{c.percentual}%</span
										>
									</div>
								</div>
								<button
									class="tn-iconbtn"
									type="button"
									style="width:32px;height:32px;color:var(--c-danger)"
									onclick={() => removeContribuicao(i)}
									aria-label="Remover contribuição"
								>
									<Icon name="x" size={14} />
								</button>
							</div>
						{/each}

						<div
							style="padding:16px; border:1.5px dashed var(--c-border-strong); border-radius:var(--r-md)"
						>
							<div class="stack-16">
								<div class="field">
									<label>Tipo</label>
									<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px">
										{#each [1, 2, 3] as t}
											<label
												style="padding:10px 8px; text-align:center; border:{novoTipo === t
													? '2px solid var(--c-primary)'
													: '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-sm); cursor:pointer; background:{novoTipo ===
												t
													? 'var(--c-primary-soft)'
													: 'white'}"
											>
												<input
													type="radio"
													bind:group={novoTipo}
													value={t}
													style="display:none"
												/>
												<div
													style="width:26px;height:26px;border-radius:50%;background:{TIPO_COLORS[
														t
													]};color:white;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 6px"
												>
													{t}
												</div>
												<div
													style="font-size:11px; color:var(--c-ink-2); line-height:1.3"
												>
													{t === 1
														? 'Entrega da unidade'
														: t === 2
															? 'Não vinculada'
															: 'Outra unidade'}
												</div>
											</label>
										{/each}
									</div>
								</div>
								{#if novoTipo === 1 && planosEntregas.length > 0}
									<div class="field">
										<label for="contrib-pe">Entrega vinculada</label>
										<select id="contrib-pe" class="select" bind:value={novoIdPe}>
											<option value="">Selecione…</option>
											{#each planosEntregas as pe}
												<option value={pe.id}
													>{pe.idPlanoEntregas}</option
												>
											{/each}
										</select>
									</div>
								{/if}
								<div class="field">
									<label for="contrib-desc">Descrição</label>
									<textarea
										id="contrib-desc"
										class="textarea"
										rows={3}
										bind:value={novaDesc}
										placeholder="Ex: Mentoria semanal, sustentação de chamados…"
										style="min-height:72px"
									></textarea>
								</div>
								<div class="field">
									<label for="contrib-pct">% da carga horária</label>
									<div style="display:flex; gap:10px; align-items:center">
										<input
											type="range"
											min="1"
											max={Math.max(restantePct, 1)}
											bind:value={novoPct}
											style="flex:1; accent-color:var(--c-primary)"
											aria-label="Percentual"
										/>
										<div class="input-prefix" style="width:90px">
											<input
												id="contrib-pct"
												type="number"
												class="input"
												bind:value={novoPct}
												min="1"
												max={restantePct}
												style="text-align:right; padding:8px"
											/>
											<span
												class="pf"
												style="border-left:0; border-right:1px solid var(--c-border-strong); border-radius:0 var(--r-sm) var(--r-sm) 0"
												>%</span
											>
										</div>
									</div>
									<div class="help">Disponível: {restantePct}%</div>
								</div>
								<button
									class="btn btn-primary"
									type="button"
									onclick={addContribuicao}
									disabled={!novaDesc.trim() || novoPct <= 0 || novoPct > restantePct}
								>
									<Icon name="plus" size={14} /> Adicionar contribuição
								</button>
							</div>
						</div>
					</div>
				{:else if step === 4}
					<div class="stack-20">
						<div>
							<div
								style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"
							>
								<h3 style="font-family:var(--ff-display); font-size:16px; margin:0">
									Período
								</h3>
								<button class="btn btn-ghost btn-sm" type="button" onclick={() => (step = 0)}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<div
								style="background:var(--c-surface-2); padding:14px; border-radius:var(--r-md); border:1px solid var(--c-border)"
							>
								<div style="display:flex; gap:16px">
									<span style="color:var(--c-muted); font-size:13px; width:160px">Vigência</span>
									<strong>{formatDate(dataInicio)} → {formatDate(dataFim)}</strong>
								</div>
							</div>
						</div>

						<div>
							<div
								style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"
							>
								<h3 style="font-family:var(--ff-display); font-size:16px; margin:0">
									Modalidade & carga
								</h3>
								<button class="btn btn-ghost btn-sm" type="button" onclick={() => (step = 1)}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<div
								style="background:var(--c-surface-2); padding:14px; border-radius:var(--r-md); border:1px solid var(--c-border)"
							>
								<div style="display:flex; gap:16px; padding-bottom:10px">
									<span style="color:var(--c-muted); font-size:13px; width:160px"
										>Modalidade</span
									>
									<strong>{MODALIDADES.find((m) => m.value === modalidade)?.label}</strong>
								</div>
								<div style="display:flex; gap:16px">
									<span style="color:var(--c-muted); font-size:13px; width:160px"
										>Carga semanal</span
									>
									<strong>{cargaHoras || cargaCustom}h</strong>
								</div>
							</div>
						</div>

						<div>
							<div
								style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"
							>
								<h3 style="font-family:var(--ff-display); font-size:16px; margin:0">
									Critérios
								</h3>
								<button class="btn btn-ghost btn-sm" type="button" onclick={() => (step = 2)}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<ol
								style="background:var(--c-surface-2); border-radius:var(--r-md); border:1px solid var(--c-border); padding:14px 14px 14px 30px; margin:0; font-size:13.5px; line-height:1.8"
							>
								{#each criterios as c}
									<li>{c}</li>
								{/each}
							</ol>
						</div>

						<div>
							<div
								style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"
							>
								<h3 style="font-family:var(--ff-display); font-size:16px; margin:0">
									Contribuições
								</h3>
								<button class="btn btn-ghost btn-sm" type="button" onclick={() => (step = 3)}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<div
								style="background:var(--c-surface-2); padding:6px; border-radius:var(--r-md); border:1px solid var(--c-border)"
							>
								{#each contribuicoes as c}
									<div
										style="display:flex; gap:10px; align-items:center; padding:10px 8px"
									>
										<div
											style="width:26px;height:26px;border-radius:50%;background:{TIPO_COLORS[
												c.tipo
											]};color:white;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex:none"
										>
											{c.tipo}
										</div>
										<div style="flex:1; font-size:13px; font-weight:500">{c.descricao}</div>
										<span
											style="font-family:var(--ff-display); font-weight:700; font-size:14px"
											>{c.percentual}%</span
										>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="divider" style="margin-top:28px"></div>
			<div class="row" style="justify-content:space-between">
				<div>
					{#if step > 0}
						<button class="btn btn-ghost" type="button" onclick={() => step--}>
							<Icon name="chevron-left" size={16} /> Voltar
						</button>
					{:else}
						<a href="/meu-plano" class="btn btn-ghost">Cancelar</a>
					{/if}
				</div>
				<div class="row" style="gap:10px">
					{#if step < STEPS.length - 1}
						<button class="btn btn-ghost" type="button" onclick={autoSave}>
							Salvar e sair
						</button>
						<button
							class="btn btn-primary"
							type="button"
							onclick={() => {
								step++;
								autoSave();
							}}
							disabled={!canAdvance}
						>
							Próximo <Icon name="chevron-right" size={16} />
						</button>
					{:else}
						<button
							class="btn btn-ghost"
							type="submit"
							formaction="?/salvarRascunho"
							disabled={loading}
						>
							{#if loading}Salvando…{:else}Salvar rascunho{/if}
						</button>
						<button
							class="btn btn-primary btn-lg"
							type="submit"
							formaction="?/assinarEnviar"
							disabled={loading}
						>
							{#if loading}
								Enviando…
							{:else}
								<Icon name="send" size={16} /> Assinar e enviar para chefia
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</section>

		<div class="col" style="gap:var(--gap-sec)">
			<section class="card">
				<div class="card-hd"><h2 style="font-size:16px">Resumo</h2></div>
				<div class="stack-12">
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Servidor</span>
						<strong>{user?.name ?? '—'}</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Período</span>
						<strong
							>{dataInicio && dataFim
								? `${formatDate(dataInicio)} → ${formatDate(dataFim)}`
								: '—'}</strong
						>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Modalidade</span>
						<strong>{MODALIDADES.find((m) => m.value === modalidade)?.label ?? '—'}</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Carga semanal</span>
						<strong>{cargaHoras || cargaCustom || '—'} h</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Critérios</span>
						<strong>{criterios.length}</strong>
					</div>
					{#if step >= 3}
						<div class="divider"></div>
						<div style="display:flex; justify-content:space-between; font-size:13px">
							<span style="color:var(--c-muted)">Contribuições</span>
							<span
								style="color:{totalPct === 100
									? 'var(--c-success)'
									: 'var(--c-warning)'}; font-weight:700">{totalPct}%</span
							>
						</div>
					{/if}
				</div>
			</section>

			{#if step === 3}
				<section class="card" style="border-left:3px solid var(--c-info)">
					<div class="kicker" style="color:var(--c-info)">
						<Icon name="info" size={13} /> O que é "% da carga"?
					</div>
					<p
						style="font-size:12.5px; color:var(--c-ink-2); margin:10px 0 0; line-height:1.55"
					>
						A soma das contribuições deve cobrir 100% da sua carga semanal. Se você tem 30h/sem,
						uma contribuição de 40% representa 12h dedicadas àquela atividade.
					</p>
				</section>
			{/if}

			{#if step === 4}
				<section class="card" style="border-top:3px solid var(--c-success)">
					<div class="kicker" style="color:var(--c-success)">
						<Icon name="check" size={13} /> Próximos passos
					</div>
					<ol
						style="padding-left:18px; margin-top:12px; font-size:13px; color:var(--c-ink-2); line-height:1.7"
					>
						<li>Você assina e envia para sua chefia</li>
						<li>A chefia revisa, ajusta se necessário e assina</li>
						<li>Plano entra em execução</li>
						<li>Registros mensais começam após a vigência</li>
					</ol>
				</section>
			{/if}
		</div>
	</form>
</div>
