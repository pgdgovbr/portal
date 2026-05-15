<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import UrgencyPill from '$lib/components/UrgencyPill.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { userStore } from '$lib/stores/user';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const user = $derived($userStore);
	const firstName = $derived(user?.name.split(' ')[0] ?? '');

	const planosTrabalho = $derived<any[]>((data as any).planosTrabalho ?? []);
	const planoAtivo = $derived(planosTrabalho.find((p) => p.status === 'EM_EXECUCAO') ?? null);
	const notificacoes = $derived<any[]>((data as any).notificacoes ?? []);
	const participantes = $derived<any[]>((data as any).participantes ?? []);
	const avaliacoesPendentes = $derived<any[]>((data as any).avaliacoesPendentes ?? []);

	function daysUntil(dateStr: string): number {
		const target = new Date(dateStr);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}
</script>

<svelte:head>
	<title>Início — PGD Libre</title>
</svelte:head>

<div class="pg">
	{#if user?.role === 'servidor'}

		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Início</div>
				<h1 class="pg-title">Olá, {firstName}</h1>
				<p class="pg-sub">
					{#if planoAtivo}
						Plano ativo: {planoAtivo.unidadeAutorizadoraNome ?? 'sua unidade'}.
					{:else}
						Você não tem plano de trabalho ativo no momento.
					{/if}
				</p>
			</div>
			<div style="text-align:right; color:var(--c-muted); font-size:13.5px">
				<div>{new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}</div>
				<div style="font-family:var(--ff-display); font-weight:700; color:var(--c-ink); font-size:18px; margin-top:2px">
					{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
				</div>
			</div>
		</div>

		{#if !planoAtivo}
			<div class="banner urgent" style="margin-bottom:var(--gap-sec)">
				<span class="icon"><Icon name="alert-circle" size={20} /></span>
				<div style="flex:1">
					<div class="ttl">Você ainda não tem um Plano de Trabalho ativo</div>
					<div class="sub">Solicite à sua chefia a criação de um plano para iniciar a execução em teletrabalho.</div>
				</div>
			</div>
		{/if}

		<div class="g-2-1">
			<div class="col" style="gap:var(--gap-sec)">
				{#if planoAtivo}
					<section class="card">
						<div class="card-hd">
							<div>
								<span class="kicker">
									<Icon name="clipboard" size={13} /> Plano de Trabalho ativo
								</span>
								<h2 style="margin-top:8px">{planoAtivo.unidadeAutorizadoraNome}</h2>
								<p>
									{new Date(planoAtivo.dataInicio).toLocaleDateString('pt-BR')}
									→ {new Date(planoAtivo.dataFim).toLocaleDateString('pt-BR')}
								</p>
							</div>
							<StatusBadge status={planoAtivo.status} />
						</div>

						<div class="g-3" style="gap:18px; margin-bottom:22px">
							<div class="plaque">
								<div class="kpi-label">Contribuições</div>
								<div class="kpi-num">{planoAtivo.contribuicoes?.length ?? 0}</div>
							</div>
							<div class="plaque">
								<div class="kpi-label">Prazo do plano</div>
								<div class="kpi-num" style="font-size:20px">
									{new Date(planoAtivo.dataFim).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
								</div>
							</div>
							<div class="plaque">
								<div class="kpi-label">Dias restantes</div>
								<div class="kpi-num" style="font-size:20px">
									<UrgencyPill daysLeft={daysUntil(planoAtivo.dataFim)} />
								</div>
							</div>
						</div>

						<div class="row">
							<a href="/meu-plano/registrar" class="btn btn-primary">
								<Icon name="plus" size={15} /> Registrar execução
							</a>
							<a href="/meu-plano" style="color:var(--c-primary); font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:6px">
								Ver plano completo <Icon name="arrow-right" size={14} />
							</a>
						</div>
					</section>
				{/if}

				<section class="card">
					<div class="card-hd">
						<h2>Acesso rápido</h2>
					</div>
					<div class="stack-12">
						<a href="/meu-plano/registrar" class="btn btn-ghost" style="justify-content:flex-start; width:100%">
							<Icon name="plus" size={16} /> Registrar execução mensal
						</a>
						<a href="/meu-plano" class="btn btn-ghost" style="justify-content:flex-start; width:100%">
							<Icon name="clipboard" size={16} /> Ver meu plano de trabalho
						</a>
						<a href="/notificacoes" class="btn btn-ghost" style="justify-content:flex-start; width:100%">
							<Icon name="bell" size={16} /> Notificações
						</a>
					</div>
				</section>
			</div>

			<div class="col" style="gap:var(--gap-sec)">
				<section class="card">
					<div class="card-hd">
						<h2 style="font-size:17px">Notificações recentes</h2>
						<a href="/notificacoes" style="font-size:13px; color:var(--c-primary); font-weight:600">Ver todas</a>
					</div>
					{#if notificacoes.length === 0}
						<p style="color:var(--c-muted); font-size:14px">Nenhuma notificação recente.</p>
					{:else}
						<div class="stack-12">
							{#each notificacoes.slice(0, 5) as n (n.id)}
								<div class="row">
									<Icon name="bell" size={15} />
									<div style="flex:1">
										<div style="font-size:13.5px; font-weight:500">{n.titulo}</div>
										<div style="font-size:11.5px; color:var(--c-muted)">
											{new Date(n.criadaEm).toLocaleDateString('pt-BR')}
										</div>
									</div>
									{#if !n.lida}
										<span class="bdg bdg-info" style="font-size:10px">Nova</span>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		</div>

	{:else if user?.role === 'chefe_imediato'}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Início · Chefia Imediata</div>
				<h1 class="pg-title">Bom dia, {firstName}</h1>
				<p class="pg-sub">
					{participantes.length} servidores na equipe
					· {avaliacoesPendentes.length} avaliações pendentes.
				</p>
			</div>
		</div>

		<div class="g-4" style="margin-bottom:var(--gap-sec)">
			<div class="card" style="padding:22px">
				<div class="kpi-label">Servidores na equipe</div>
				<div class="kpi-num" style="margin-top:4px">{participantes.length}</div>
			</div>
			<div class="card" style="padding:22px">
				<div class="kpi-label">Avaliações pendentes</div>
				<div class="kpi-num" style="margin-top:4px; color:var(--c-warning)">{avaliacoesPendentes.length}</div>
			</div>
			<div class="card" style="padding:22px">
				<div class="kpi-label">Planos em execução</div>
				<div class="kpi-num" style="margin-top:4px">
					{participantes.filter((p: any) => p.planosTrabalho?.some((pl: any) => pl.status === 'EM_EXECUCAO')).length}
				</div>
			</div>
			<div class="card" style="padding:22px">
				<div class="kpi-label">Registros em atraso</div>
				<div class="kpi-num" style="margin-top:4px; color:var(--c-danger)">—</div>
			</div>
		</div>

		<div class="g-2-1">
			<section class="card">
				<div class="card-hd">
					<div>
						<h2>Avaliações pendentes</h2>
						<p>Você tem até 20 dias após o registro do servidor para avaliar.</p>
					</div>
					<a href="/equipe" style="font-size:13px; color:var(--c-primary); font-weight:600">Ver equipe →</a>
				</div>

				{#if avaliacoesPendentes.length === 0}
					<p style="color:var(--c-muted); font-size:14px">Nenhuma avaliação pendente.</p>
				{:else}
					<div class="stack-12">
						{#each avaliacoesPendentes.slice(0, 5) as reg (reg.id)}
							<div class="row" style="padding:10px 12px; background:var(--c-surface-2); border-radius:var(--r-md); border:1px solid var(--c-border)">
								<div class="av av-md" style="background:var(--c-primary); color:white">
									{reg.planoTrabalho?.participante?.nome?.split(' ').slice(0,2).map((w: string) => w[0]).join('') ?? '?'}
								</div>
								<div style="flex:1">
									<div style="font-weight:600">{reg.planoTrabalho?.participante?.nome}</div>
									<div style="font-size:12.5px; color:var(--c-muted)">
										Enviado em {new Date(reg.dataEnvio).toLocaleDateString('pt-BR')}
									</div>
								</div>
								<a href="/equipe/planos-trabalho/{reg.planoTrabalho?.id}" class="btn btn-primary btn-sm">Avaliar</a>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<div class="col" style="gap:var(--gap-sec)">
				<section class="card">
					<div class="card-hd"><h2 style="font-size:17px">Ações rápidas</h2></div>
					<div class="stack-12">
						<a href="/equipe" class="btn btn-primary" style="justify-content:flex-start; width:100%">
							<Icon name="users" size={16} /> Ver equipe completa
						</a>
						<a href="/equipe/planos-trabalho/novo" class="btn btn-ghost" style="justify-content:flex-start; width:100%">
							<Icon name="plus" size={16} /> Criar Plano de Trabalho
						</a>
					</div>
				</section>
			</div>
		</div>

	{:else if user?.role === 'gestor_unidade'}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Início · Gestor de Unidade</div>
				<h1 class="pg-title">Olá, {firstName}</h1>
			</div>
		</div>
		<div class="g-3">
			<a href="/conformidade" class="card" style="text-decoration:none; display:block">
				<Icon name="check-circle" size={24} />
				<div class="kpi-label" style="margin-top:10px">Painel de Conformidade</div>
				<div style="font-size:13px; color:var(--c-muted); margin-top:4px">Sincronização com API PGD Central</div>
			</a>
			<a href="/relatorios" class="card" style="text-decoration:none; display:block">
				<Icon name="bar-chart" size={24} />
				<div class="kpi-label" style="margin-top:10px">Relatórios</div>
				<div style="font-size:13px; color:var(--c-muted); margin-top:4px">Visualizar indicadores</div>
			</a>
		</div>

	{:else if user?.role === 'admin'}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Início · Administrador</div>
				<h1 class="pg-title">Olá, {firstName}</h1>
			</div>
		</div>
		<div class="g-3">
			<a href="/admin/participantes" class="card" style="text-decoration:none; display:block">
				<Icon name="users" size={24} />
				<div class="kpi-label" style="margin-top:10px">Participantes</div>
				<div style="font-size:13px; color:var(--c-muted); margin-top:4px">Cadastrar e gerenciar</div>
			</a>
			<a href="/conformidade" class="card" style="text-decoration:none; display:block">
				<Icon name="check-circle" size={24} />
				<div class="kpi-label" style="margin-top:10px">Conformidade</div>
				<div style="font-size:13px; color:var(--c-muted); margin-top:4px">Painel de sincronização</div>
			</a>
			<a href="/admin/institucional" class="card" style="text-decoration:none; display:block">
				<Icon name="settings" size={24} />
				<div class="kpi-label" style="margin-top:10px">Institucional</div>
				<div style="font-size:13px; color:var(--c-muted); margin-top:4px">Unidades e atos normativos</div>
			</a>
		</div>

	{:else}
		<div class="pg-head">
			<h1 class="pg-title">Carregando...</h1>
		</div>
	{/if}
</div>
