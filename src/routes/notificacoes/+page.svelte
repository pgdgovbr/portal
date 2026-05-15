<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const notificacoes = $derived((data as any).notificacoes ?? []);

	function formatDate(d: string) {
		if (!d) return '—';
		const date = new Date(d);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'hoje';
		if (diffDays === 1) return 'ontem';
		if (diffDays < 7) return `há ${diffDays} dias`;
		return date.toLocaleDateString('pt-BR');
	}

	function iconFor(titulo: string) {
		if (titulo.toLowerCase().includes('avali')) return 'star';
		if (titulo.toLowerCase().includes('prazo') || titulo.toLowerCase().includes('venc')) return 'alert-triangle';
		if (titulo.toLowerCase().includes('aprovado') || titulo.toLowerCase().includes('conclu')) return 'check-circle';
		return 'bell';
	}
</script>

<svelte:head>
	<title>Notificações — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:800px">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Central de</div>
			<h1 class="pg-title">Notificações</h1>
		</div>
		{#if notificacoes.filter((n: any) => !n.lida).length > 0}
			<button class="btn btn-ghost btn-sm">
				Marcar todas como lidas
			</button>
		{/if}
	</div>

	{#if notificacoes.length === 0}
		<div class="card" style="text-align:center; padding:64px">
			<Icon name="bell" size={40} />
			<h2 style="margin-top:16px; font-size:18px">Nenhuma notificação</h2>
			<p style="color:var(--c-muted); margin-top:8px">Você está em dia com tudo.</p>
		</div>
	{:else}
		<section class="card" style="padding:0; overflow:hidden">
			{#each notificacoes as n (n.id)}
				<div
					style="display:flex; gap:14px; padding:16px 20px; border-bottom:1px solid var(--c-divider); background:{!n.lida ? 'var(--c-primary-soft)' : 'transparent'}"
				>
					<div style="width:36px; height:36px; border-radius:var(--r-sm); background:{!n.lida ? 'var(--c-primary)' : 'var(--c-surface-2)'}; display:flex; align-items:center; justify-content:center; color:{!n.lida ? 'white' : 'var(--c-muted)'}; flex:none">
						<Icon name={iconFor(n.titulo)} size={16} />
					</div>
					<div style="flex:1">
						<div style="font-weight:{!n.lida ? '700' : '500'}; font-size:14.5px; color:var(--c-ink)">
							{n.titulo}
						</div>
						{#if n.corpo}
							<div style="font-size:13.5px; color:var(--c-ink-2); margin-top:3px; line-height:1.5">
								{n.corpo}
							</div>
						{/if}
						<div style="font-size:12px; color:var(--c-muted); margin-top:4px">
							{formatDate(n.criadaEm)}
						</div>
					</div>
					{#if !n.lida}
						<div style="width:8px; height:8px; border-radius:50%; background:var(--c-primary); margin-top:6px; flex:none" aria-label="Não lida"></div>
					{/if}
				</div>
			{/each}
		</section>
	{/if}
</div>
