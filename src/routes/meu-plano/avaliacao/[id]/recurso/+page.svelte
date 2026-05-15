<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { env } from '$env/dynamic/public';

	const avaliacaoId = $derived($page.params.id);

	let justificativa = $state('');
	let loading = $state(false);

	const canSubmit = $derived(justificativa.trim().length >= 30);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		loading = true;
		try {
			const mutation = `
				mutation AbrirRecurso($input: AbrirRecursoInput!) {
					abrirRecurso(input: $input) { id status }
				}
			`;
			const GRAPHQL_URL = env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app/graphql';
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					query: mutation,
					variables: { input: { registroExecucaoId: avaliacaoId, justificativa } }
				})
			});
			const { errors } = await res.json();
			if (errors?.length) throw new Error(errors[0].message);
			goto('/meu-plano?recurso=aberto');
		} catch (err: any) {
			alert(err.message ?? 'Erro ao abrir recurso.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Contestar Avaliação — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:800px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/meu-plano">Meu Plano</a>
		<span class="sep">/</span>
		<a href="/meu-plano/avaliacao/{avaliacaoId}">Avaliação</a>
		<span class="sep">/</span>
		<span>Contestar</span>
	</div>

	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Recurso de avaliação</div>
			<h1 class="pg-title">Contestar Avaliação</h1>
			<p class="pg-sub">
				Você pode contestar avaliações com nota 4 ou 5 dentro de 10 dias da publicação.
				A chefia terá até 10 dias para responder.
			</p>
		</div>
	</div>

	<div class="g-1-2">
		<section class="card" style="border-left:3px solid var(--c-warning)">
			<div class="kicker" style="color:var(--c-warning)">
				<Icon name="info" size={13} /> Processo de recurso
			</div>
			<div class="stack-12" style="margin-top:12px; font-size:13.5px; color:var(--c-ink-2); line-height:1.6">
				<p>1. Você descreve os motivos da contestação</p>
				<p>2. A chefia recebe notificação e tem 10 dias para responder</p>
				<p>3. A decisão da chefia é definitiva nesta instância</p>
			</div>
		</section>

		<section class="card">
			<form onsubmit={submit}>
				<div class="stack-20">
					<div class="field">
						<label for="justif">
							Justificativa para contestação
							<span style="color:var(--c-danger)">*</span>
						</label>
						<div class="help">
							Descreva objetivamente os motivos pelos quais discorda da nota atribuída.
							Mencione evidências concretas de trabalho realizado.
						</div>
						<textarea
							id="justif"
							class="textarea"
							rows={8}
							placeholder="Descreva detalhadamente os motivos da contestação, referenciando entregas concretas realizadas no período…"
							bind:value={justificativa}
							aria-required="true"
							style="min-height:180px"
						></textarea>
						<div style="font-size:12px; color:{justificativa.length < 30 ? 'var(--c-danger)' : 'var(--c-success)'}">
							{justificativa.length} caracteres (mínimo 30)
						</div>
					</div>

					<div class="row" style="justify-content:flex-end; gap:10px">
						<a href="/meu-plano/avaliacao/{avaliacaoId}" class="btn btn-ghost">Cancelar</a>
						<button type="submit" class="btn btn-primary btn-lg" disabled={!canSubmit || loading}>
							{#if loading}Enviando…{:else}<Icon name="send" size={16} /> Enviar contestação{/if}
						</button>
					</div>
				</div>
			</form>
		</section>
	</div>
</div>
