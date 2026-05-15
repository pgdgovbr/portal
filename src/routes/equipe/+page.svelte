<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ModalidadeBadge from '$lib/components/ModalidadeBadge.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import { initialsFrom } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const participantes = $derived((data as any).participantes ?? []);

	let viewMode = $state<'tabela' | 'cards' | 'kanban'>('tabela');
	let busca = $state('');

	const filtered = $derived(
		busca.trim()
			? participantes.filter(
					(p: any) =>
						p.nome.toLowerCase().includes(busca.toLowerCase()) ||
						p.siape?.includes(busca)
				)
			: participantes
	);

	function planoAtivo(p: any) {
		return p.planosTrabalho?.find((pl: any) => pl.status === 'EM_EXECUCAO') ?? null;
	}

	function registrosPendentes(p: any): number {
		const plano = planoAtivo(p);
		if (!plano) return 0;
		return plano.contribuicoes
			?.flatMap((c: any) => c.registrosExecucao ?? [])
			.filter((r: any) => r.status === 'ENVIADO').length ?? 0;
	}

	function avatarColor(nome: string): string {
		const palette = ['#0F3D8C', '#168821', '#5C2D91', '#C77400', '#0E7490', '#B91C1C'];
		let h = 0;
		for (const c of nome) h = (h * 31 + c.charCodeAt(0)) >>> 0;
		return palette[h % palette.length];
	}
</script>

<svelte:head>
	<title>Equipe — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Chefia Imediata</div>
			<h1 class="pg-title">Equipe</h1>
			<p class="pg-sub">{participantes.length} servidores na sua unidade</p>
		</div>
		<div class="row">
			<a href="/equipe/planos-trabalho/novo" class="btn btn-primary">
				<Icon name="plus" size={16} /> Criar Plano de Trabalho
			</a>
		</div>
	</div>

	<!-- Toolbar -->
	<div class="row" style="margin-bottom:20px; gap:12px">
		<div style="flex:1; position:relative">
			<span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--c-muted); display:flex"><Icon name="search" size={16} /></span>
			<input
				type="search"
				class="input"
				placeholder="Buscar por nome ou SIAPE…"
				bind:value={busca}
				style="padding-left:40px"
				aria-label="Buscar participante"
			/>
		</div>
		<div class="row" style="gap:4px">
			{#each [['tabela', 'list'], ['cards', 'users'], ['kanban', 'bar-chart']] as [mode, icon]}
				<button
					class="btn btn-ghost btn-sm"
					class:btn-soft={viewMode === mode}
					onclick={() => viewMode = mode as any}
					aria-pressed={viewMode === mode}
					aria-label="Visualização {mode}"
				>
					<Icon name={icon} size={15} />
				</button>
			{/each}
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="card" style="text-align:center; padding:48px">
			<Icon name="users" size={40} />
			<p style="color:var(--c-muted); margin-top:16px">
				{busca ? 'Nenhum resultado para "' + busca + '"' : 'Nenhum participante encontrado.'}
			</p>
		</div>

	{:else if viewMode === 'tabela'}
		<section class="card" style="padding:0; overflow:hidden">
			<table class="tbl">
				<thead>
					<tr>
						<th>Servidor</th>
						<th>SIAPE</th>
						<th>Modalidade</th>
						<th>Plano ativo</th>
						<th>Avaliações pendentes</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as p (p.id)}
						{@const plano = planoAtivo(p)}
						{@const pendentes = registrosPendentes(p)}
						<tr>
							<td>
								<div class="row" style="gap:12px">
									<div
										class="av av-md"
										style="background:{avatarColor(p.nome)}; color:white"
										aria-hidden="true"
									>
										{initialsFrom(p.nome)}
									</div>
									<div>
										<div style="font-weight:600">{p.nome}</div>
										<div style="font-size:12px; color:var(--c-muted)">{p.email ?? ''}</div>
									</div>
								</div>
							</td>
							<td style="font-size:13px; color:var(--c-muted)">{p.siape ?? '—'}</td>
							<td>
								{#if p.modalidadeExecucao}
									<ModalidadeBadge modalidade={p.modalidadeExecucao} />
								{:else}
									<span style="color:var(--c-muted)">—</span>
								{/if}
							</td>
							<td>
								{#if plano}
									<StatusBadge status={plano.status} />
								{:else}
									<span style="color:var(--c-muted); font-size:13px">Sem plano</span>
								{/if}
							</td>
							<td>
								{#if pendentes > 0}
									<span class="bdg bdg-warning">{pendentes} para avaliar</span>
								{:else}
									<span style="color:var(--c-muted); font-size:13px">—</span>
								{/if}
							</td>
							<td style="text-align:right">
								{#if plano}
									<a href="/equipe/planos-trabalho/{plano.id}" class="btn btn-ghost btn-sm">
										Ver plano
									</a>
								{/if}
								<a href="/equipe/participantes/{p.id}" class="btn btn-ghost btn-sm">
									Perfil
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

	{:else if viewMode === 'cards'}
		<div class="g-3" style="gap:16px">
			{#each filtered as p (p.id)}
				{@const plano = planoAtivo(p)}
				{@const pendentes = registrosPendentes(p)}
				<div class="card">
					<div class="row" style="margin-bottom:14px">
						<div
							class="av av-lg"
							style="background:{avatarColor(p.nome)}; color:white"
							aria-hidden="true"
						>
							{initialsFrom(p.nome)}
						</div>
						<div style="flex:1">
							<div style="font-weight:700; font-size:15px">{p.nome}</div>
							<div style="font-size:12px; color:var(--c-muted)">{p.siape ? 'SIAPE ' + p.siape : ''}</div>
						</div>
					</div>

					{#if p.modalidadeExecucao}
						<ModalidadeBadge modalidade={p.modalidadeExecucao} />
					{/if}

					<div class="divider"></div>

					<div class="row" style="justify-content:space-between; margin-bottom:12px">
						<div style="font-size:13px; color:var(--c-muted)">Plano</div>
						{#if plano}
							<StatusBadge status={plano.status} />
						{:else}
							<span style="font-size:12px; color:var(--c-muted)">Sem plano</span>
						{/if}
					</div>

					{#if pendentes > 0}
						<span class="bdg bdg-warning" style="width:100%; justify-content:center">
							{pendentes} avaliação(ões) pendente(s)
						</span>
					{/if}

					<div class="row" style="margin-top:14px; gap:8px">
						{#if plano}
							<a href="/equipe/planos-trabalho/{plano.id}" class="btn btn-primary btn-sm" style="flex:1">
								Ver plano
							</a>
						{/if}
						<a href="/equipe/participantes/{p.id}" class="btn btn-ghost btn-sm" style="flex:1">
							Perfil
						</a>
					</div>
				</div>
			{/each}
		</div>

	{:else}
		<!-- Kanban view -->
		{@const semPlano = filtered.filter((p: any) => !planoAtivo(p))}
		{@const emExecucao = filtered.filter((p: any) => planoAtivo(p)?.status === 'EM_EXECUCAO')}
		{@const outros = filtered.filter((p: any) => planoAtivo(p) && planoAtivo(p)?.status !== 'EM_EXECUCAO')}

		<div class="g-3" style="gap:16px; align-items:flex-start">
			{#each [
				{ title: 'Em execução', items: emExecucao, color: 'var(--c-success)' },
				{ title: 'Outros status', items: outros, color: 'var(--c-primary)' },
				{ title: 'Sem plano', items: semPlano, color: 'var(--c-muted)' }
			] as col}
				<div style="background:var(--c-surface-2); border-radius:var(--r-md); padding:14px">
					<div class="row" style="margin-bottom:12px">
						<span style="width:8px; height:8px; border-radius:50%; background:{col.color}"></span>
						<div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--c-ink-2)">
							{col.title}
						</div>
						<span style="margin-left:auto; font-size:11px; color:var(--c-muted); background:white; padding:2px 8px; border-radius:10px">
							{col.items.length}
						</span>
					</div>
					<div class="stack-12">
						{#each col.items as p (p.id)}
							<div style="background:white; border-radius:var(--r-sm); padding:12px; border:1px solid var(--c-border)">
								<div class="row" style="gap:10px; margin-bottom:8px">
									<div class="av av-sm" style="background:{avatarColor(p.nome)}; color:white">
										{initialsFrom(p.nome)}
									</div>
									<div style="flex:1">
										<div style="font-weight:600; font-size:13.5px">{p.nome}</div>
										<div style="font-size:11.5px; color:var(--c-muted)">{p.siape ? 'SIAPE ' + p.siape : ''}</div>
									</div>
								</div>
								{#if registrosPendentes(p) > 0}
									<span class="bdg bdg-warning" style="font-size:11px">
										{registrosPendentes(p)} para avaliar
									</span>
								{/if}
							</div>
						{/each}
						{#if col.items.length === 0}
							<div style="font-size:12px; color:var(--c-muted-2); text-align:center; padding:12px">—</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
