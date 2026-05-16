<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import ModalidadeBadge from '$lib/components/ModalidadeBadge.svelte';
	import { initialsFrom } from '$lib/types';
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const participantesDisponiveis = $derived(
		((data as any).participantes ?? []).filter(
			(p: any) => !p.planosTrabalho?.some((pl: any) => pl.status === 'EM_EXECUCAO')
		)
	);

	const STEPS = [
		'Participante & período',
		'Carga horária',
		'Critérios de avaliação',
		'Contribuições',
		'Revisão e envio',
	];

	const MODALIDADES = [
		{ value: 'PRESENCIAL', label: 'Presencial', sub: 'Sem teletrabalho' },
		{ value: 'TELETRABALHO_PARCIAL', label: 'TT Parcial', sub: 'Até 50% do tempo' },
		{ value: 'TELETRABALHO_INTEGRAL', label: 'TT Integral', sub: '100% do tempo' },
	];

	const CARGA_OPCOES = [20, 30, 40, 0] as const;

	const CRITERIOS_TEMPLATE = {
		'Equipe técnica (TI)': [
			'Cumprimento de prazos das entregas vinculadas',
			'Qualidade técnica da documentação produzida',
			'Aderência a padrões técnicos',
			'Colaboração com pares',
		],
		'Equipe administrativa': [
			'Pontualidade de entregas',
			'Atenção a detalhes em relatórios',
			'Capacidade de priorização',
		],
		'Liderança / coordenação': [
			'Articulação interna',
			'Acompanhamento da equipe',
			'Comunicação institucional',
			'Tomada de decisão',
		],
	};

	let step = $state(0);
	let loading = $state(false);
	let savedAt = $state<Date | null>(null);

	// Step 0
	let participanteId = $state('');
	let dataInicio = $state('');
	let dataFim = $state('');
	let modalidade = $state('TELETRABALHO_PARCIAL');

	// Step 1
	let cargaHoras = $state(40);
	let cargaCustom = $state('');

	// Step 2
	let criterios = $state<string[]>([
		'Cumprimento de prazos das entregas vinculadas',
		'Qualidade técnica da documentação produzida',
		'Comunicação efetiva com áreas envolvidas',
		'Iniciativa em proposição de melhorias',
	]);
	let novoCriterio = $state('');

	// Step 3
	interface Contribuicao { tipo: number; descricao: string; percentual: number }
	let contribuicoes = $state<Contribuicao[]>([]);
	let novoTipo = $state(2);
	let novaDesc = $state('');
	let novoPct = $state(10);

	const participanteAtual = $derived(
		participantesDisponiveis.find((p: any) => p.id === participanteId) ?? null
	);

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
		step === 0 ? !!(participanteId && dataInicio && dataFim) :
		step === 1 ? (cargaHoras > 0 || parseInt(cargaCustom) > 0) :
		step === 2 ? criterios.length > 0 :
		step === 3 ? (totalPct === 100 && contribuicoes.length > 0) :
		true
	);

	function autoSave() {
		savedAt = new Date();
	}

	function setCriterio(i: number, val: string) {
		criterios = criterios.map((c, idx) => idx === i ? val : c);
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

	function applyTemplate(itens: string[]) {
		criterios = [...itens];
	}

	function addContribuicao() {
		if (!novaDesc.trim() || novoPct <= 0) return;
		contribuicoes = [...contribuicoes, { tipo: novoTipo, descricao: novaDesc.trim(), percentual: novoPct }];
		novaDesc = '';
		novoPct = Math.min(10, restantePct);
		autoSave();
	}

	function removeContribuicao(i: number) {
		contribuicoes = contribuicoes.filter((_, idx) => idx !== i);
	}

	async function submit() {
		loading = true;
		try {
			const mutation = `
				mutation CriarPlano($input: CriarPlanoTrabalhoInput!) {
					criarPlanoTrabalho(input: $input) { id status }
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
							participanteId,
							dataInicio,
							dataFim,
							modalidade,
							totalHorasDisponiveis: cargaHoras || parseInt(cargaCustom),
							criteriosAvaliacao: criterios.join('\n'),
							contribuicoes: contribuicoes.map(c => ({
								tipo: c.tipo,
								descricao: c.descricao,
								percentualContribuicao: c.percentual,
							})),
						},
					},
				}),
			});
			const { errors } = await res.json();
			if (errors?.length) throw new Error(errors[0].message);
			goto('/equipe?plano=criado');
		} catch {
			alert('Erro ao criar plano. Tente novamente.');
		} finally {
			loading = false;
		}
	}

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
	}

	const TIPO_COLORS = ['', 'var(--c-primary)', 'var(--c-success)', 'var(--c-status-aval)'];
</script>

<svelte:head>
	<title>Criar Plano de Trabalho — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:1200px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/equipe">Equipe</a>
		<span class="sep">/</span>
		<span>Criar Plano de Trabalho</span>
	</div>

	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Novo Plano de Trabalho</div>
			<h1 class="pg-title">
				{participanteAtual ? `Plano para ${participanteAtual.nome}` : 'Criar Plano de Trabalho'}
			</h1>
			<p class="pg-sub">
				Etapa {step + 1} de {STEPS.length} · <strong>{STEPS[step]}</strong>
			</p>
		</div>
		<div class="row" style="gap:10px; align-items:center">
			{#if savedAt}
				<span style="font-size:12.5px; color:var(--c-muted)">
					Rascunho salvo às {savedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
				</span>
			{/if}
			<a href="/equipe" class="btn btn-ghost btn-sm">
				<Icon name="x" size={14} /> Cancelar
			</a>
		</div>
	</div>

	<div class="card" style="padding:22px 28px; margin-bottom:var(--gap-sec)">
		<Stepper steps={STEPS} current={step} />
	</div>

	<div class="g-2-1">
		<section class="card">
			<div class="card-hd">
				<div>
					<h2>
						{step === 0 && 'Para quem é este plano?'}
						{step === 1 && 'Carga horária disponível para o plano'}
						{step === 2 && 'Como o servidor será avaliado?'}
						{step === 3 && 'Contribuições adicionadas'}
						{step === 4 && 'Revisão do plano'}
					</h2>
					<p>
						{step === 0 && 'Selecione um servidor com TCR ativo sem plano em execução.'}
						{step === 1 && 'Informe a carga semanal e ocorrências previsíveis.'}
						{step === 2 && 'Defina critérios objetivos que orientam as notas mensais.'}
						{step === 3 && 'Soma deve ser exatamente 100% para avançar.'}
						{step === 4 && 'Confira cada etapa antes de enviar para aprovação.'}
					</p>
				</div>
				{#if step === 3}
					<button class="btn btn-primary btn-sm" onclick={addContribuicao}>
						<Icon name="plus" size={14} /> Adicionar
					</button>
				{/if}
				{#if step === 2}
					<button class="btn btn-soft btn-sm" onclick={addCriterio}>
						<Icon name="plus" size={13} /> Critério customizado
					</button>
				{/if}
			</div>

			<div class="stack-20">

				<!-- ─── Step 0: Participante & período ─────────────────── -->
				{#if step === 0}
					<div class="field">
						<label for="serv-sel">Servidor</label>
						{#if participanteAtual}
							<div style="display:flex; gap:10px; padding:14px; border:2px solid var(--c-primary); border-radius:var(--r-md); background:var(--c-primary-soft)">
								<span class="av av-lg" style="background:var(--c-primary); color:white">
									{initialsFrom(participanteAtual.nome)}
								</span>
								<div style="flex:1">
									<div style="font-weight:700; color:var(--c-ink); font-size:15px">{participanteAtual.nome}</div>
									<div style="font-size:12.5px; color:var(--c-muted)">SIAPE {participanteAtual.siape}</div>
									<div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap">
										<span class="bdg bdg-success">
											<Icon name="check" size={11} /> TCR vigente
										</span>
										<span class="bdg bdg-neutral">Sem plano ativo</span>
									</div>
								</div>
								<button class="btn btn-ghost btn-sm" onclick={() => participanteId = ''}>Trocar</button>
							</div>
						{:else}
							<select id="serv-sel" class="select" bind:value={participanteId} aria-required="true">
								<option value="">Selecione um servidor…</option>
								{#each participantesDisponiveis as p (p.id)}
									<option value={p.id}>{p.nome} — SIAPE {p.siape}</option>
								{/each}
							</select>
						{/if}
						<div class="help">O servidor receberá notificação assim que o plano for aprovado.</div>
					</div>

					<div class="field">
						<label>Período de vigência</label>
						<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px">
							<div class="input-prefix">
								<span class="pf">Início</span>
								<input type="date" class="input" bind:value={dataInicio} oninput={autoSave} aria-required="true" />
							</div>
							<div class="input-prefix">
								<span class="pf">Fim</span>
								<input type="date" class="input" bind:value={dataFim} oninput={autoSave} aria-required="true" />
							</div>
							<div class="input-prefix">
								<span class="pf">Duração</span>
								<input class="input" value={duracaoMeses()} disabled style="background:var(--c-surface-2)" aria-readonly="true" />
							</div>
						</div>
						<div class="help">Máximo de 1 ano por plano. Recomendamos planos semestrais.</div>
					</div>

					<div class="field">
						<label>Modalidade de execução</label>
						<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px">
							{#each MODALIDADES as m}
								<label style="padding:14px; border:{modalidade === m.value ? '2px solid var(--c-primary)' : '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-md); cursor:pointer; background:{modalidade === m.value ? 'var(--c-primary-soft)' : 'white'}">
									<input type="radio" bind:group={modalidade} value={m.value} style="display:none" />
									<div style="font-weight:700; font-size:14px; color:{modalidade === m.value ? 'var(--c-primary)' : 'var(--c-ink)'}">{m.label}</div>
									<div style="font-size:12px; color:var(--c-muted); margin-top:2px">{m.sub}</div>
								</label>
							{/each}
						</div>
					</div>

				<!-- ─── Step 1: Carga horária ───────────────────────────── -->
				{:else if step === 1}
					<div class="field">
						<label>Carga horária semanal</label>
						<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px">
							{#each CARGA_OPCOES as h}
								<label style="padding:18px; text-align:center; border:{cargaHoras === h && h !== 0 ? '2px solid var(--c-primary)' : '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-md); cursor:pointer; background:{cargaHoras === h && h !== 0 ? 'var(--c-primary-soft)' : 'white'}">
									<input type="radio" bind:group={cargaHoras} value={h} style="display:none" />
									<div style="font-family:var(--ff-display); font-weight:800; font-size:26px; color:{cargaHoras === h && h !== 0 ? 'var(--c-primary)' : 'var(--c-ink)'}">
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
								<input type="number" class="input" bind:value={cargaCustom} placeholder="ex: 25" min="1" max="44" aria-label="Carga horária customizada" />
								<span class="pf">h/sem</span>
							</div>
						{/if}
					</div>

					{#if cargaEfetiva()}
						<div style="padding:16px; background:var(--c-surface-2); border-radius:var(--r-md); border:1px solid var(--c-border)">
							<div style="display:flex; justify-content:space-between; align-items:center">
								<div>
									<div style="font-size:12.5px; color:var(--c-muted)">
										{cargaEfetiva()!.semanas} semanas × {cargaEfetiva()!.h}h
									</div>
									<div style="font-family:var(--ff-display); font-weight:800; font-size:32px; color:var(--c-ink); letter-spacing:-0.02em; margin-top:4px">
										{cargaEfetiva()!.total.toLocaleString('pt-BR')} horas
									</div>
								</div>
								<div style="text-align:right; font-size:12.5px; color:var(--c-muted)">estimado no período</div>
							</div>
						</div>
					{/if}

				<!-- ─── Step 2: Critérios ─────────────────────────────── -->
				{:else if step === 2}
					<div class="stack-12">
						{#each criterios as c, i}
							<div style="display:flex; gap:12px; align-items:center; padding:12px 14px; border:1px solid var(--c-border); border-radius:var(--r-md); background:white">
								<span class="numdot">{i + 1}</span>
								<input
									class="input"
									value={c}
									oninput={(e) => setCriterio(i, (e.target as HTMLInputElement).value)}
									style="flex:1; border:0; padding:0; font-size:14px; background:transparent; box-shadow:none"
									aria-label="Critério {i + 1}"
								/>
								<button class="tn-iconbtn" style="width:32px;height:32px;color:var(--c-danger)" onclick={() => removeCriterio(i)} aria-label="Remover critério">
									<Icon name="x" size={14} />
								</button>
							</div>
						{/each}
					</div>

					<div class="field">
						<label for="novo-crit">Novo critério</label>
						<div style="display:flex; gap:8px">
							<input id="novo-crit" class="input" bind:value={novoCriterio} placeholder="Descreva o critério…" onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCriterio(); }}} />
							<button class="btn btn-ghost" onclick={addCriterio} disabled={!novoCriterio.trim()}>Adicionar</button>
						</div>
					</div>

					<div style="font-size:12.5px; color:var(--c-muted)">
						<strong style="color:var(--c-ink)">{criterios.length}</strong> critérios · recomendado entre 3 e 6.
					</div>

				<!-- ─── Step 3: Contribuições ────────────────────────── -->
				{:else if step === 3}
					{#if contribuicoes.length > 0}
						<!-- Stacked bar -->
						<div style="display:flex; height:14px; border-radius:8px; overflow:hidden; background:var(--c-bg-deep)">
							{#each contribuicoes as c, i}
								<div style="width:{c.percentual}%; background:{TIPO_COLORS[c.tipo]}; border-right:2px solid white" title="{c.percentual}% · {c.descricao}"></div>
							{/each}
						</div>
						<div style="display:flex; gap:16px; font-size:12px; color:var(--c-muted)">
							<span><span style="display:inline-block; width:10px; height:10px; border-radius:3px; background:var(--c-primary); margin-right:6px"></span>Tipo 1 · Entrega da unidade</span>
							<span><span style="display:inline-block; width:10px; height:10px; border-radius:3px; background:var(--c-success); margin-right:6px"></span>Tipo 2 · Não vinculada</span>
							<span><span style="display:inline-block; width:10px; height:10px; border-radius:3px; background:var(--c-status-aval); margin-right:6px"></span>Tipo 3 · Outra unidade</span>
						</div>
					{/if}

					<div class="stack-12">
						{#each contribuicoes as c, i}
							<div style="display:flex; gap:14px; align-items:flex-start; padding:16px; border:1px solid var(--c-border); border-radius:var(--r-md)">
								<div style="width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:{TIPO_COLORS[c.tipo]}; color:white; font-weight:800; font-size:13px; flex:none">{c.tipo}</div>
								<div style="flex:1">
									<div style="font-weight:600; font-size:14px">{c.descricao}</div>
									<div style="margin-top:6px; display:flex; align-items:center; gap:10px">
										<div style="flex:1; max-width:200px; height:6px; border-radius:3px; background:var(--c-bg-deep); overflow:hidden">
											<div style="width:{c.percentual}%; height:100%; background:{TIPO_COLORS[c.tipo]}; border-radius:3px"></div>
										</div>
										<span style="font-family:var(--ff-display); font-weight:700; font-size:13px">{c.percentual}%</span>
									</div>
								</div>
								<button class="tn-iconbtn" style="width:32px;height:32px;color:var(--c-danger)" onclick={() => removeContribuicao(i)} aria-label="Remover contribuição">
									<Icon name="x" size={14} />
								</button>
							</div>
						{/each}

						<!-- Add form -->
						<div style="padding:16px; border:1.5px dashed var(--c-border-strong); border-radius:var(--r-md)">
							<div class="stack-16">
								<div class="field">
									<label>Tipo</label>
									<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px">
										{#each [1, 2, 3] as t}
											<label style="padding:10px 8px; text-align:center; border:{novoTipo === t ? '2px solid var(--c-primary)' : '1.5px solid var(--c-border-strong)'}; border-radius:var(--r-sm); cursor:pointer; background:{novoTipo === t ? 'var(--c-primary-soft)' : 'white'}">
												<input type="radio" bind:group={novoTipo} value={t} style="display:none" />
												<div style="width:26px; height:26px; border-radius:50%; background:{TIPO_COLORS[t]}; color:white; font-weight:800; font-size:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 6px">{t}</div>
												<div style="font-size:11px; color:var(--c-ink-2); line-height:1.3">
													{t === 1 ? 'Entrega da unidade' : t === 2 ? 'Não vinculada' : 'Outra unidade'}
												</div>
											</label>
										{/each}
									</div>
								</div>
								<div class="field">
									<label for="contrib-desc">Descrição</label>
									<textarea id="contrib-desc" class="textarea" rows={3} bind:value={novaDesc} placeholder="Ex: Mentoria semanal, sustentação de chamados…" style="min-height:72px"></textarea>
								</div>
								<div class="field">
									<label for="contrib-pct">% da carga horária</label>
									<div style="display:flex; gap:10px; align-items:center">
										<input type="range" min="1" max={Math.max(restantePct, 1)} bind:value={novoPct} style="flex:1; accent-color:var(--c-primary)" aria-label="Percentual" />
										<div class="input-prefix" style="width:90px">
											<input id="contrib-pct" type="number" class="input" bind:value={novoPct} min="1" max={restantePct} style="text-align:right; padding:8px" />
											<span class="pf" style="border-left:0; border-right:1px solid var(--c-border-strong); border-radius:0 var(--r-sm) var(--r-sm) 0">%</span>
										</div>
									</div>
									<div class="help">Disponível: {restantePct}%</div>
								</div>
								<button class="btn btn-primary" onclick={addContribuicao} disabled={!novaDesc.trim() || novoPct <= 0 || novoPct > restantePct}>
									<Icon name="plus" size={14} /> Adicionar contribuição
								</button>
							</div>
						</div>
					</div>

				<!-- ─── Step 4: Revisão ───────────────────────────────── -->
				{:else if step === 4}
					<div class="stack-20">
						{#each [
							{ ttl: 'Participante & período', step: 0, rows: [
								['Servidor', participanteAtual?.nome ?? '—'],
								['Período', dataInicio && dataFim ? `${formatDate(dataInicio)} → ${formatDate(dataFim)}` : '—'],
								['Modalidade', MODALIDADES.find(m => m.value === modalidade)?.label ?? '—'],
							]},
							{ ttl: 'Carga horária', step: 1, rows: [
								['Carga semanal', `${cargaHoras || cargaCustom}h/semana`],
								['Total estimado', cargaEfetiva() ? `${cargaEfetiva()!.total.toLocaleString('pt-BR')} horas` : '—'],
							]},
						] as sec}
							<div>
								<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
									<div style="display:flex; gap:10px; align-items:center">
										<span class="numdot done">{sec.step + 1}</span>
										<h3 style="font-family:var(--ff-display); font-size:16px; font-weight:700; margin:0">{sec.ttl}</h3>
									</div>
									<button class="btn btn-ghost btn-sm" onclick={() => step = sec.step}>
										<Icon name="edit" size={12} /> Editar
									</button>
								</div>
								<div style="background:var(--c-surface-2); border-radius:var(--r-md); padding:4px 14px; border:1px solid var(--c-border)">
									{#each sec.rows as r, j}
										<div style="display:flex; padding:10px 0; border-bottom:{j < sec.rows.length - 1 ? '1px solid var(--c-divider)' : '0'}; gap:16px">
											<span style="font-size:12.5px; color:var(--c-muted); width:180px; flex:none">{r[0]}</span>
											<span style="font-size:13.5px; font-weight:500">{r[1]}</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}

						<div>
							<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
								<div style="display:flex; gap:10px; align-items:center">
									<span class="numdot done">3</span>
									<h3 style="font-family:var(--ff-display); font-size:16px; font-weight:700; margin:0">Critérios</h3>
								</div>
								<button class="btn btn-ghost btn-sm" onclick={() => step = 2}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<ol style="padding-left:20px; font-size:13.5px; color:var(--c-ink-2); line-height:1.8; margin:0; background:var(--c-surface-2); border-radius:var(--r-md); padding:14px 14px 14px 30px; border:1px solid var(--c-border)">
								{#each criterios as c}<li>{c}</li>{/each}
							</ol>
						</div>

						<div>
							<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
								<div style="display:flex; gap:10px; align-items:center">
									<span class="numdot done">4</span>
									<h3 style="font-family:var(--ff-display); font-size:16px; font-weight:700; margin:0">Contribuições</h3>
									{#if totalPct === 100}
										<span class="bdg bdg-success"><Icon name="check" size={11} /> 100%</span>
									{/if}
								</div>
								<button class="btn btn-ghost btn-sm" onclick={() => step = 3}>
									<Icon name="edit" size={12} /> Editar
								</button>
							</div>
							<div style="background:var(--c-surface-2); border-radius:var(--r-md); padding:6px; border:1px solid var(--c-border)">
								{#each contribuicoes as c}
									<div style="display:flex; gap:10px; align-items:center; padding:10px 8px">
										<div style="width:26px; height:26px; border-radius:50%; background:{TIPO_COLORS[c.tipo]}; color:white; font-weight:800; font-size:12px; display:flex; align-items:center; justify-content:center; flex:none">{c.tipo}</div>
										<div style="flex:1; font-size:13px; font-weight:500">{c.descricao}</div>
										<span style="font-family:var(--ff-display); font-weight:700; font-size:14px">{c.percentual}%</span>
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
						<button class="btn btn-ghost" onclick={() => step--} type="button">
							<Icon name="chevron-left" size={16} /> Voltar
						</button>
					{:else}
						<a href="/equipe" class="btn btn-ghost">Cancelar</a>
					{/if}
				</div>
				<div class="row" style="gap:10px">
					<button class="btn btn-ghost" onclick={autoSave} type="button">Salvar rascunho</button>
					{#if step < STEPS.length - 1}
						<button class="btn btn-primary" onclick={() => { step++; autoSave(); }} type="button" disabled={!canAdvance}>
							Próximo <Icon name="chevron-right" size={16} />
						</button>
					{:else}
						<button class="btn btn-primary btn-lg" onclick={submit} type="button" disabled={loading}>
							{#if loading}Enviando…{:else}<Icon name="send" size={16} /> Enviar para aprovação{/if}
						</button>
					{/if}
				</div>
			</div>
		</section>

		<!-- Sidebar -->
		<div class="col" style="gap:var(--gap-sec)">
			<!-- Resumo -->
			<section class="card">
				<div class="card-hd"><h2 style="font-size:16px">Resumo do plano</h2></div>
				<div class="stack-12">
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Servidor</span>
						<strong>{participanteAtual?.nome ?? '—'}</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Período</span>
						<strong>
							{dataInicio && dataFim ? `${formatDate(dataInicio)} → ${formatDate(dataFim)}` : '—'}
						</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Duração</span>
						<strong>{duracaoMeses() || '—'}</strong>
					</div>
					<div style="display:flex; justify-content:space-between; font-size:13px">
						<span style="color:var(--c-muted)">Modalidade</span>
						<strong>{MODALIDADES.find(m => m.value === modalidade)?.label ?? '—'}</strong>
					</div>
					{#if step >= 3}
						<div class="divider"></div>
						<div style="display:flex; justify-content:space-between; font-size:13px">
							<span style="color:var(--c-muted)">Contribuições</span>
							<span style="color:{totalPct === 100 ? 'var(--c-success)' : 'var(--c-warning)'}; font-weight:700">{totalPct}%</span>
						</div>
					{/if}
				</div>
			</section>

			{#if step === 2}
				<section class="card">
					<div class="card-hd"><h2 style="font-size:16px">Modelos prontos</h2></div>
					<p style="font-size:12.5px; color:var(--c-muted); margin:-6px 0 12px">Substitui os critérios atuais.</p>
					<div class="stack-12">
						{#each Object.entries(CRITERIOS_TEMPLATE) as [nome, itens], i}
							<button
								style="text-align:left; padding:12px; border:1px solid var(--c-border); border-radius:var(--r-sm); background:{i === 0 ? 'var(--c-primary-soft)' : 'white'}; cursor:pointer; width:100%"
								onclick={() => applyTemplate(itens)}
							>
								<div style="font-weight:600; font-size:13px">{nome}</div>
								<div style="font-size:11.5px; color:var(--c-muted); margin-top:2px">{itens.length} critérios</div>
							</button>
						{/each}
					</div>
				</section>
			{/if}

			{#if step === 3}
				<section class="card" style="background:var(--c-info-soft)">
					<div class="kicker" style="color:var(--c-info)"><Icon name="info" size={13} /> Regras do MGI</div>
					<ul style="padding-left:18px; font-size:12.5px; color:var(--c-ink-2); margin:10px 0 0; line-height:1.7">
						<li>Ao menos 1 contribuição é obrigatória</li>
						<li>Soma deve ser <strong>exatamente 100%</strong></li>
						<li>Tipo 1 precisa de entrega vinculada</li>
						<li>Tipo 2 é livre — capacitação, gestão, etc.</li>
					</ul>
				</section>
			{/if}

			{#if step === 4}
				<section class="card" style="border-top:3px solid var(--c-success)">
					<div class="kicker" style="color:var(--c-success)"><Icon name="check" size={13} /> O que acontece agora</div>
					<ol style="padding-left:18px; margin-top:12px; font-size:13px; color:var(--c-ink-2); line-height:1.7">
						<li>O plano segue para aprovação superior</li>
						<li>Após aprovação, o servidor é notificado</li>
						<li>O servidor registra execução mensalmente</li>
						<li>Você avalia cada registro em até 20 dias</li>
					</ol>
				</section>
			{/if}

			<section class="card" style="border-left:3px solid var(--c-info)">
				<div class="kicker" style="color:var(--c-info)"><Icon name="info" size={13} /> Dica</div>
				<p style="font-size:13px; color:var(--c-ink-2); margin:10px 0 0; line-height:1.55">
					Planos de 6 meses são o padrão recomendado pelo MGI. Planos mais curtos exigem mais ciclos avaliativos.
				</p>
			</section>
		</div>
	</div>
</div>
