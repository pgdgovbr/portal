<script lang="ts">
	import NotaBadge from '$lib/components/NotaBadge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const registro = $derived((data as any).registro);

	function formatDate(d: string) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
	}

	const aval = $derived(registro?.avaliacoes?.[0]);
	const podeRecursar = $derived(
		aval?.nota && (aval.nota === 4 || aval.nota === 5) && aval.dataAvaliacao
			? Math.ceil((new Date().getTime() - new Date(aval.dataAvaliacao).getTime()) / (1000 * 60 * 60 * 24)) <= 10
			: false
	);
</script>

<svelte:head>
	<title>Avaliação — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:900px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<span>Avaliação</span>
	</div>

	{#if !registro || !aval}
		<p style="color:var(--c-muted)">Avaliação não encontrada.</p>
	{:else}
		<div class="pg-head">
			<div>
				<div class="pg-eyebrow">Avaliação recebida</div>
				<h1 class="pg-title">Avaliação de {formatDate(registro.periodoInicio)}</h1>
				<p class="pg-sub">Avaliado por {aval.avaliador?.nome} em {formatDate(aval.dataAvaliacao)}</p>
			</div>
			{#if podeRecursar}
				<a href="/meu-plano/avaliacao/{registro.id}/recurso" class="btn btn-danger">
					<Icon name="alert-circle" size={16} /> Contestar avaliação
				</a>
			{/if}
		</div>

		<div class="g-1-2">
			<!-- Nota grande -->
			<div class="col" style="gap:var(--gap-sec)">
				<div class="card" style="text-align:center; padding:40px 28px">
					<div style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--c-muted); margin-bottom:16px">
						Nota atribuída
					</div>
					<div style="font-family:var(--ff-display); font-size:80px; font-weight:800; letter-spacing:-0.04em; line-height:1; color:var(--c-nota-{aval.nota})">
						{aval.nota}
					</div>
					<div style="margin-top:16px">
						<NotaBadge nota={aval.nota} />
					</div>
				</div>

				{#if podeRecursar}
					<div class="banner urgent">
						<span class="icon"><Icon name="alert-triangle" size={20} /></span>
						<div>
							<div class="ttl">Você pode contestar esta avaliação</div>
							<div class="sub">Prazo: 10 dias a partir da publicação. Reste até {formatDate(new Date(new Date(aval.dataAvaliacao).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString())}.</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Detalhes -->
			<div class="col" style="gap:var(--gap-sec)">
				{#if aval.justificativa}
					<section class="card">
						<div class="card-hd">
							<h2>Justificativa</h2>
						</div>
						<p style="font-size:14.5px; color:var(--c-ink-2); line-height:1.7; font-style:italic">
							"{aval.justificativa}"
						</p>
					</section>
				{/if}

				<section class="card">
					<div class="card-hd">
						<h2>Sua execução registrada</h2>
					</div>
					<p style="font-size:14px; color:var(--c-ink-2); line-height:1.7; white-space:pre-wrap">
						{registro.descricaoAtividades}
					</p>
				</section>
			</div>
		</div>
	{/if}
</div>
