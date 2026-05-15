<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const painel = $derived((data as any).painel);

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleString('pt-BR');
	}

	const pct = $derived(
		painel ? Math.round((painel.totalPlanosEnviados / Math.max(painel.totalPlanos, 1)) * 100) : 0
	);
</script>

<svelte:head>
	<title>Conformidade — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">API PGD Central</div>
			<h1 class="pg-title">Painel de Conformidade</h1>
			<p class="pg-sub">Envios à API PGD do Ministério da Gestão (MGI)</p>
		</div>
		<button class="btn btn-primary">
			<Icon name="refresh" size={16} /> Sincronizar agora
		</button>
	</div>

	{#if !painel}
		<div class="card" style="text-align:center; padding:48px; color:var(--c-muted)">
			Painel de conformidade indisponível.
		</div>
	{:else}
		<div class="g-3" style="margin-bottom:var(--gap-sec)">
			<div class="card" style="padding:22px">
				<div class="kpi-label">Planos enviados</div>
				<div class="kpi-num" style="margin-top:4px; color:var(--c-success)">
					{painel.totalPlanosEnviados}
					<span style="font-size:18px; font-weight:400; color:var(--c-muted)">
						/ {painel.totalPlanos}
					</span>
				</div>
				<div class="bar" style="margin-top:10px">
					<i style="width:{pct}%"></i>
				</div>
				<div style="font-size:12px; color:var(--c-muted); margin-top:6px">{pct}% sincronizados</div>
			</div>

			<div class="card" style="padding:22px">
				<div class="kpi-label">Erros de sincronização</div>
				<div class="kpi-num" style="margin-top:4px; color:{painel.erros?.length ? 'var(--c-danger)' : 'var(--c-success)'}">
					{painel.erros?.length ?? 0}
				</div>
			</div>

			<div class="card" style="padding:22px">
				<div class="kpi-label">Última sincronização</div>
				<div style="font-weight:600; font-size:15px; margin-top:8px">
					{formatDate(painel.ultimaSincronizacao)}
				</div>
			</div>
		</div>

		{#if painel.erros?.length}
			<section class="card">
				<div class="card-hd">
					<div>
						<h2>Erros de sincronização</h2>
						<p>Planos que falharam ao ser enviados à API Central</p>
					</div>
				</div>
				<table class="tbl">
					<thead>
						<tr>
							<th>Participante</th>
							<th>Código HTTP</th>
							<th>Mensagem</th>
							<th>Tentativas</th>
							<th>Data</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each painel.erros as erro (erro.id)}
							<tr>
								<td>
									<div style="font-weight:600">{erro.planoTrabalho?.participante?.nome}</div>
									<div style="font-size:12px; color:var(--c-muted)">SIAPE {erro.planoTrabalho?.participante?.siape}</div>
								</td>
								<td>
									<span class="bdg bdg-danger">{erro.httpStatus}</span>
								</td>
								<td style="max-width:300px; font-size:13px; color:var(--c-muted)">
									{erro.mensagem}
								</td>
								<td style="text-align:center">{erro.tentativas}</td>
								<td style="font-size:13px">{formatDate(erro.criadoEm)}</td>
								<td>
									<a href="/conformidade/erro/{erro.id}" class="btn btn-ghost btn-sm">
										Detalhes
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{:else}
			<div class="banner success">
				<span class="icon"><Icon name="check-circle" size={20} /></span>
				<div>
					<div class="ttl">Tudo sincronizado</div>
					<div class="sub">Nenhum erro de envio à API PGD Central.</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
