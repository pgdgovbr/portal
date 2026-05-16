<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const erro = $derived((data as any).erro);

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleString('pt-BR');
	}
</script>

<svelte:head>
	<title>Erro de Sincronização — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/conformidade">Conformidade</a>
		<span class="sep">/</span>
		<span>Erro {erro?.id ?? ''}</span>
	</div>

	{#if !erro}
		<div class="card" style="text-align:center; padding:48px; color:var(--c-muted)">
			Erro de sincronização não encontrado.
		</div>
	{:else}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">API PGD Central</div>
				<h1 class="pg-title">Erro de Sincronização</h1>
				<p class="pg-sub">Detalhes do erro #{erro.id}</p>
			</div>
			<a href="/conformidade" class="btn btn-ghost">← Voltar a Conformidade</a>
		</div>

		<div class="g-2-1" style="align-items:start">
			<!-- Main card -->
			<section class="card" style="padding:24px">
				<div class="card-hd">
					<h2>Detalhes do erro</h2>
				</div>

				<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:8px">
					<div>
						<div class="kpi-label">Código HTTP</div>
						<div class="kpi-num" style="font-size:28px; margin-top:4px; color:var(--c-danger)">
							{erro.httpStatus}
						</div>
					</div>

					<div>
						<div class="kpi-label">Tentativas</div>
						<div class="kpi-num" style="font-size:28px; margin-top:4px">
							{erro.tentativas}
						</div>
					</div>

					<div style="grid-column:1/-1">
						<div class="kpi-label">Mensagem de erro</div>
						<div style="margin-top:6px; font-size:14px; color:var(--c-ink-2); background:var(--c-surface-2); padding:12px 16px; border-radius:var(--r-md); border:1px solid var(--c-border); font-family:monospace">
							{erro.mensagem}
						</div>
					</div>

					<div>
						<div class="kpi-label">Ocorrido em</div>
						<div style="margin-top:6px; font-size:14px; font-weight:500">
							{formatDate(erro.criadoEm)}
						</div>
					</div>
				</div>
			</section>

			<!-- Participante sidebar -->
			<section class="card" style="padding:24px">
				<div class="card-hd">
					<h2 style="font-size:17px">Plano de Trabalho</h2>
				</div>

				{#if erro.planoTrabalho}
					<div style="margin-top:8px">
						<div class="kpi-label">Participante</div>
						<div style="margin-top:6px; font-weight:700; font-size:15px">
							{erro.planoTrabalho.participante?.nome}
						</div>
						<div style="font-size:13px; color:var(--c-muted); margin-top:2px">
							SIAPE {erro.planoTrabalho.participante?.siape}
						</div>
					</div>

					<a
						href="/equipe/planos-trabalho/{erro.planoTrabalho.id}"
						class="btn btn-ghost btn-sm"
						style="margin-top:16px; width:100%"
					>
						Ver plano de trabalho
					</a>
				{:else}
					<p style="font-size:13px; color:var(--c-muted)">Plano não disponível.</p>
				{/if}
			</section>
		</div>
	{/if}
</div>
