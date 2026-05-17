<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import NotaBadge from '$lib/components/NotaBadge.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import OwnershipBanner from '$lib/components/OwnershipBanner.svelte';
	import CloneDialog from '$lib/components/CloneDialog.svelte';
	import { ownershipOfStatus, type StatusPlano } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const STATUS_PACTUACAO_SET: ReadonlySet<string> = new Set([
		'RASCUNHO_PARTICIPANTE',
		'RASCUNHO_CHEFIA',
		'AGUARDANDO_ASSINATURA_PARTICIPANTE',
		'AGUARDANDO_ASSINATURA_CHEFIA'
	]);
	const STATUS_TERMINAL_SET: ReadonlySet<string> = new Set([
		'CONCLUIDO',
		'AVALIADO',
		'CANCELADO'
	]);

	const planos = $derived((data as any).planosTrabalho ?? []);
	const planoAtivo = $derived<any>(
		(data as any).planoAtivo ?? planos.find((p: any) => p.status === 'EM_EXECUCAO') ?? null
	);
	const planoEmPactuacao = $derived<any>(
		(data as any).planoEmPactuacao ??
			planos.find((p: any) => STATUS_PACTUACAO_SET.has(p.status)) ??
			null
	);
	const planosAnteriores = $derived<any[]>(
		(data as any).planosAnteriores ??
			planos.filter((p: any) => STATUS_TERMINAL_SET.has(p.status))
	);

	const registrosPlano = $derived<any[]>(
		planoAtivo?.contribuicoes?.flatMap((c: any) => c.registrosExecucao ?? []) ?? []
	);

	let viewMode = $state<'tabela' | 'cards'>('tabela');
	let cloneDialogOpen = $state(false);
	let planoParaClonar = $state<any>(null);

	function daysUntil(dateStr: string): number {
		if (!dateStr) return 0;
		const target = new Date(dateStr);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatPeriodo(ini: string, fim: string): string {
		if (!ini || !fim) return '—';
		const a = new Date(ini).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
		const b = new Date(fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
		return `${a} → ${b}`;
	}

	function abrirClone(p: any) {
		planoParaClonar = p;
		cloneDialogOpen = true;
	}

	function fecharClone() {
		cloneDialogOpen = false;
		planoParaClonar = null;
	}

	async function executarClone(_params: {
		idPlanoTrabalhoNovo: string;
		dataInicio: string;
		dataTermino: string;
	}) {
		// A mutation real será cabeada na Fase 4 (/meu-plano/criar).
		// Por ora, fecha o diálogo — UI completa, integração depois.
		fecharClone();
	}

	// Ownership banner config quando há PT em pactuação
	const ownership = $derived(
		planoEmPactuacao ? ownershipOfStatus(planoEmPactuacao.status as StatusPlano) : null
	);

	// Quem é o "ator outro" (placeholder até termos identidade da chefia no PT)
	const atorOutroPactuacao = $derived(
		planoEmPactuacao?.chefiaNome ?? 'sua chefia'
	);
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

	{#if planoEmPactuacao}
		<!-- ═════════════════════════════════════════════════════
		     Branch 2 — PT em pactuação (rascunho ou aguardando assinatura)
		     ═════════════════════════════════════════════════════ -->
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Meu Plano de Trabalho</div>
				<h1 class="pg-title">Plano em pactuação</h1>
				<p class="pg-sub">
					{formatDate(planoEmPactuacao.dataInicio)} → {formatDate(planoEmPactuacao.dataFim)}
				</p>
			</div>
		</div>

		{#if ownership === 'participante'}
			{#if planoEmPactuacao.status === 'RASCUNHO_PARTICIPANTE'}
				<OwnershipBanner variant="comigo-editor" atorOutro={atorOutroPactuacao} />
				<div class="card" style="padding:22px; text-align:center">
					<p style="color:var(--c-ink-2); margin-bottom:14px">
						Continue ajustando seu rascunho e, quando estiver pronto, assine e envie para sua
						chefia.
					</p>
					<a href={`/meu-plano/${planoEmPactuacao.id}/editar`} class="btn btn-primary">
						<Icon name="edit" size={16} /> Continuar edição
					</a>
				</div>
			{:else}
				<!-- AGUARDANDO_ASSINATURA_PARTICIPANTE -->
				<OwnershipBanner variant="comigo-revisor" atorOutro={atorOutroPactuacao} />
				<div class="card" style="padding:22px; text-align:center">
					<p style="color:var(--c-ink-2); margin-bottom:14px">
						Sua chefia enviou o plano para sua revisão. Confira e assine para iniciar a execução.
					</p>
					<a href={`/meu-plano/${planoEmPactuacao.id}/revisar`} class="btn btn-primary">
						<Icon name="check" size={16} stroke={2.4} /> Revisar e assinar
					</a>
				</div>
			{/if}
		{:else}
			<!-- ownership === 'chefia' → com-outro -->
			<OwnershipBanner variant="com-outro" atorOutro={atorOutroPactuacao} />
			<div class="card" style="padding:22px; text-align:center">
				<p style="color:var(--c-ink-2)">
					Sua chefia recebeu o plano e está revisando. Você pode acompanhar a evolução, mas só
					poderá editar quando ela devolver para ajustes.
				</p>
				<a
					href={`/meu-plano/${planoEmPactuacao.id}/revisar`}
					class="btn btn-ghost"
					style="margin-top:14px"
				>
					Ver detalhes
				</a>
			</div>
		{/if}
	{:else if !planoAtivo}
		<!-- ═════════════════════════════════════════════════════
		     Branch 1 — Sem PT ativo nem em pactuação → estado vazio CTA
		     ═════════════════════════════════════════════════════ -->
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Meu Plano de Trabalho</div>
				<h1 class="pg-title">Sem plano em vigência</h1>
				<p class="pg-sub">
					Crie seu próximo plano. Você descreve as contribuições; sua chefia revisa e assina.
				</p>
			</div>
		</div>

		<div class="g-2-1">
			<!-- CTAs principais -->
			<section class="card vazio-card">
				<div class="vazio-head">
					<div class="vazio-handshake">
						<Icon name="handshake" size={36} stroke={1.4} />
					</div>
					<h2>Como você quer começar?</h2>
					<p>
						Você pode partir do zero ou aproveitar um plano antigo. Em qualquer caso, sua chefia
						precisa concordar antes de o plano entrar em vigor.
					</p>
				</div>

				<div class="vazio-ctas">
					<!-- Criar do zero -->
					<a href="/meu-plano/criar" class="cta cta-primary">
						<div class="cta-head">
							<span class="cta-ico cta-ico-primary">
								<Icon name="plus" size={20} stroke={2.2} />
							</span>
							<div>
								<div class="cta-title">Criar plano do zero</div>
								<div class="cta-eyebrow">Recomendado para o primeiro plano</div>
							</div>
						</div>
						<p class="cta-sub">
							Wizard guiado em 5 etapas: período, modalidade, carga horária, critérios e
							contribuições.
						</p>
						<div class="cta-foot">
							Começar <Icon name="arrowR" size={14} />
						</div>
					</a>

					<!-- Clonar plano anterior -->
					{#if planosAnteriores.length > 0}
						<button
							type="button"
							class="cta cta-secondary"
							onclick={() => abrirClone(planosAnteriores[0])}
						>
							<div class="cta-head">
								<span class="cta-ico cta-ico-secondary">
									<Icon name="file" size={20} stroke={1.8} />
								</span>
								<div>
									<div class="cta-title">Clonar plano anterior</div>
									<div class="cta-eyebrow muted">Se as atividades mudaram pouco</div>
								</div>
							</div>
							<p class="cta-sub">
								Reaproveita contribuições, critérios e modalidade. Você só ajusta datas e
								detalhes.
							</p>
							<div class="cta-tag">
								<div class="cta-tag-eyebrow">Disponível</div>
								<div class="cta-tag-id">{planosAnteriores[0].id}</div>
								<div class="cta-tag-sub">
									{(planosAnteriores[0].contribuicoes?.length ?? 0)} contribuiç{(planosAnteriores[0].contribuicoes?.length ?? 0) === 1 ? 'ão' : 'ões'}
								</div>
							</div>
						</button>
					{/if}
				</div>

				<div class="divider"></div>

				<div class="vazio-info">
					<Icon name="info" size={16} />
					<p>
						<strong>Importante:</strong> a pactuação é bilateral (Dec. 11.072/2022 art. 11). Seu
						plano só entra em execução após você e sua chefia assinarem a mesma versão.
					</p>
				</div>
			</section>

			<!-- Aside — histórico + ajuda -->
			<div class="col" style="gap:var(--gap-sec)">
				<section class="card">
					<div class="card-hd"><h2 style="font-size:16px">Planos anteriores</h2></div>
					{#if planosAnteriores.length === 0}
						<p style="color:var(--c-muted); font-size:13px">
							Nenhum plano concluído ainda.
						</p>
					{:else}
						<div class="stack-12">
							{#each planosAnteriores as p (p.id)}
								<div class="anterior-item">
									<div style="flex:1; min-width:0">
										<div class="anterior-id">{p.id}</div>
										<div class="anterior-per">
											{formatPeriodo(p.dataInicio, p.dataFim)}
										</div>
									</div>
									<StatusBadge status={p.status} size="sm" />
									<button
										type="button"
										class="tn-iconbtn anterior-btn"
										title="Clonar"
										aria-label="Clonar plano {p.id}"
										onclick={() => abrirClone(p)}
									>
										<Icon name="file" size={13} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</section>

				<section class="card howto-card">
					<div class="kicker howto-kicker">
						<Icon name="info" size={13} /> Como funciona
					</div>
					<ol class="howto-steps">
						<li>Você cria o plano (rascunho)</li>
						<li>Edita à vontade — auto-save</li>
						<li>Assina e envia para sua chefia</li>
						<li>Chefia revisa: assina ou pede ajuste</li>
						<li>
							Quando os dois assinam, o plano vira <strong>Em execução</strong>
						</li>
					</ol>
				</section>

				<section class="card especiais-card">
					<div class="kicker"><Icon name="info" size={13} /> Casos especiais</div>
					<p class="especiais-text">
						Em situações excepcionais — recém-chegado ao órgão, ausência prolongada — sua chefia
						pode criar o plano por você. Nesse caso, você só precisa revisar e assinar.
					</p>
				</section>
			</div>
		</div>

		<!-- Aviso legado (fallback) — mantém um sinal claro caso o estado vazio seja desabilitado -->
		<div style="display:none">Nenhum plano de trabalho ativo</div>
	{:else}
		<!-- ═════════════════════════════════════════════════════
		     Branch 3 — PT em EM_EXECUCAO (mantém tela existente)
		     ═════════════════════════════════════════════════════ -->
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
							<div
								style="font-family:var(--ff-display); font-weight:700; font-size:16px; margin-top:6px"
							>
								{new Date(planoAtivo.dataInicio).toLocaleDateString('pt-BR', {
									day: '2-digit',
									month: 'short'
								})}
								→
								{new Date(planoAtivo.dataFim).toLocaleDateString('pt-BR', {
									day: '2-digit',
									month: 'short'
								})}
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
								onclick={() => (viewMode = 'tabela')}>Tabela</button
							>
							<button
								class="btn btn-ghost btn-sm"
								class:btn-soft={viewMode === 'cards'}
								onclick={() => (viewMode = 'cards')}>Cards</button
							>
						</div>
					</div>

					{#if registrosPlano.length === 0}
						<p style="color:var(--c-muted); font-size:14px">
							Nenhum registro de execução enviado ainda.
						</p>
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
												<div style="font-size:11.5px; color:var(--c-muted)">
													{formatDate(reg.periodoFim)}
												</div>
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
								<div
									style="padding:18px; border:1px solid var(--c-border); border-radius:var(--r-md); background:var(--c-surface)"
								>
									<div
										style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--c-muted)"
									>
										{formatDate(reg.periodoInicio)}
									</div>
									<div class="divider"></div>
									{#if aval?.nota}
										<NotaBadge nota={aval.nota} />
										<div style="font-size:12px; color:var(--c-muted); margin-top:8px">
											por {aval.avaliador?.nome ?? '—'} em {formatDate(aval.dataAvaliacao)}
										</div>
										<a
											href="/meu-plano/avaliacao/{reg.id}"
											class="btn btn-ghost btn-sm"
											style="margin-top:12px; width:100%"
										>
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
						<a
							href="/meu-plano/registrar"
							class="btn btn-primary"
							style="width:100%; justify-content:flex-start"
						>
							<Icon name="plus" size={16} /> Registrar execução
						</a>
						<button class="btn btn-ghost" style="width:100%; justify-content:flex-start">
							<Icon name="download" size={16} /> Exportar PDF
						</button>
					</div>
				</section>

				<section class="card" data-testid="aside-planos-anteriores">
					<div class="card-hd"><h2 style="font-size:17px">Planos anteriores</h2></div>
					{#if planosAnteriores.length === 0}
						<p style="color:var(--c-muted); font-size:13px">Nenhum plano concluído ainda.</p>
					{:else}
						<p style="color:var(--c-muted); font-size:12.5px; margin-bottom:10px">
							Aproveite contribuições e critérios de planos antigos como base para o próximo.
						</p>
						<div class="stack-12">
							{#each planosAnteriores as p (p.id)}
								<div class="anterior-item">
									<div style="flex:1; min-width:0">
										<div class="anterior-id">{p.id}</div>
										<div class="anterior-per">
											{formatPeriodo(p.dataInicio, p.dataFim)}
										</div>
									</div>
									<StatusBadge status={p.status} size="sm" />
									<button
										type="button"
										class="tn-iconbtn anterior-btn"
										title="Clonar"
										aria-label="Clonar plano {p.id}"
										onclick={() => abrirClone(p)}
									>
										<Icon name="file" size={13} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		</div>
	{/if}
</div>

<CloneDialog
	open={cloneDialogOpen}
	planoId={planoParaClonar?.id ?? ''}
	onCancel={fecharClone}
	onClone={executarClone}
/>

<style>
	.vazio-card {
		padding: 32px;
	}
	.vazio-head {
		text-align: center;
		margin-bottom: 24px;
	}
	.vazio-handshake {
		width: 76px;
		height: 76px;
		border-radius: 50%;
		background: var(--c-primary-soft);
		color: var(--c-primary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
	}
	.vazio-head h2 {
		font-family: var(--ff-display, inherit);
		font-size: 22px;
		font-weight: 700;
		margin: 4px 0 6px;
		letter-spacing: -0.01em;
	}
	.vazio-head p {
		color: var(--c-muted);
		font-size: 14px;
		max-width: 44ch;
		margin: 0 auto;
		line-height: 1.55;
	}

	.vazio-ctas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.cta {
		display: block;
		text-align: left;
		padding: 22px;
		border-radius: var(--r-md);
		text-decoration: none;
		color: inherit;
		background: white;
		cursor: pointer;
		font: inherit;
		width: 100%;
	}
	.cta-primary {
		border: 2px solid var(--c-primary);
		background: var(--c-primary-soft);
	}
	.cta-secondary {
		border: 1.5px solid var(--c-border-strong);
	}
	.cta:hover {
		transform: translateY(-1px);
		transition: transform 0.12s;
	}

	.cta-head {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		margin-bottom: 12px;
	}
	.cta-ico {
		width: 40px;
		height: 40px;
		border-radius: var(--r-sm);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.cta-ico-primary {
		background: var(--c-primary);
		color: white;
	}
	.cta-ico-secondary {
		background: #efe8f7;
		color: var(--c-status-aval, #5b3a8c);
	}
	.cta-title {
		font-weight: 700;
		font-size: 15px;
		color: var(--c-ink);
	}
	.cta-eyebrow {
		font-size: 12px;
		color: var(--c-primary);
		font-weight: 600;
		margin-top: 2px;
	}
	.cta-eyebrow.muted {
		color: var(--c-muted);
	}
	.cta-sub {
		font-size: 13px;
		color: var(--c-ink-2);
		margin: 0;
		line-height: 1.5;
	}
	.cta-foot {
		margin-top: 14px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--c-primary);
		font-weight: 700;
	}
	.cta-tag {
		margin-top: 14px;
		padding: 10px 12px;
		background: var(--c-surface-2);
		border-radius: var(--r-sm);
		border: 1px solid var(--c-border);
	}
	.cta-tag-eyebrow {
		font-size: 11.5px;
		color: var(--c-muted);
		margin-bottom: 4px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 700;
	}
	.cta-tag-id {
		font-size: 13px;
		font-weight: 600;
		font-family: var(--ff-mono, inherit);
	}
	.cta-tag-sub {
		font-size: 11.5px;
		color: var(--c-muted);
		margin-top: 2px;
	}

	.vazio-info {
		padding: 12px 14px;
		background: var(--c-info-soft);
		border-radius: var(--r-sm);
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.vazio-info p {
		font-size: 12.5px;
		color: var(--c-ink-2);
		margin: 0;
		line-height: 1.5;
	}

	.anterior-item {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 10px 12px;
		background: var(--c-surface-2);
		border-radius: var(--r-sm);
		border: 1px solid var(--c-border);
	}
	.anterior-id {
		font-family: var(--ff-mono, inherit);
		font-weight: 600;
		font-size: 12px;
	}
	.anterior-per {
		font-size: 11.5px;
		color: var(--c-muted);
	}
	.anterior-btn {
		width: 28px;
		height: 28px;
	}

	.howto-card {
		border-left: 3px solid var(--c-info);
	}
	.howto-kicker {
		color: var(--c-info);
	}
	.howto-steps {
		padding-left: 18px;
		font-size: 12.5px;
		color: var(--c-ink-2);
		margin: 10px 0 0;
		line-height: 1.7;
	}

	.especiais-card {
		background: var(--c-surface-2);
	}
	.especiais-text {
		font-size: 12.5px;
		color: var(--c-ink-2);
		margin: 10px 0 0;
		line-height: 1.55;
	}

	@media (max-width: 640px) {
		.vazio-ctas {
			grid-template-columns: 1fr;
		}
	}
</style>
