<script lang="ts">
	import '../app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import { userStore } from '$lib/stores/user';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	$effect(() => {
		if (data.user) userStore.set(data.user);
	});

	// Rotas com TopNav próprio (landing + login). Em /, /login e seus filhos
	// não renderizamos o TopNav autenticado mesmo quando logado.
	const publicPaths = $derived(
		$page.url.pathname === '/' || $page.url.pathname.startsWith('/login')
	);
</script>

<svelte:head>
	<title>PGD Livre</title>
</svelte:head>

{#if data.user && !publicPaths}
	<TopNav user={data.user} />
{/if}

<main>
	{@render children()}
</main>
