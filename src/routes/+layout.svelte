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
</script>

<svelte:head>
	<title>PGD Libre</title>
</svelte:head>

{#if data.user}
	<TopNav user={data.user} />
{/if}

<main>
	{@render children()}
</main>
