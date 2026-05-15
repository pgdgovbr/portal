<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ModalidadeBadge from '$lib/components/ModalidadeBadge.svelte';
	import { initialsFrom } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const participantes = $derived((data as any).participantes ?? []);
	let busca = $state('');

	const filtered = $derived(
		busca.trim()
			? participantes.filter(
					(p: any) =>
						p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
						p.siape?.includes(busca) ||
						p.email?.toLowerCase().includes(busca.toLowerCase())
				)
			: participantes
	);
</script>

<svelte:head>
	<title>Participantes — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Administração</div>
			<h1 class="pg-title">Participantes</h1>
			<p class="pg-sub">{participantes.length} participantes cadastrados</p>
		</div>
		<a href="/admin/participantes/novo" class="btn btn-primary">
			<Icon name="plus" size={16} /> Cadastrar participante
		</a>
	</div>

	<div class="row" style="margin-bottom:20px">
		<div style="flex:1; position:relative">
			<span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--c-muted); display:flex"><Icon name="search" size={16} /></span>
			<input
				type="search"
				class="input"
				placeholder="Buscar por nome, SIAPE ou e-mail…"
				bind:value={busca}
				style="padding-left:40px"
				aria-label="Buscar participante"
			/>
		</div>
	</div>

	<section class="card" style="padding:0; overflow:hidden">
		<table class="tbl">
			<thead>
				<tr>
					<th>Participante</th>
					<th>SIAPE</th>
					<th>CPF</th>
					<th>Modalidade</th>
					<th>Planos</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if filtered.length === 0}
					<tr>
						<td colspan="6" style="text-align:center; padding:40px; color:var(--c-muted)">
							{busca ? 'Nenhum resultado.' : 'Nenhum participante cadastrado.'}
						</td>
					</tr>
				{:else}
					{#each filtered as p (p.id)}
						<tr>
							<td>
								<div class="row" style="gap:12px">
									<div class="av av-md" style="background:var(--c-primary); color:white">
										{initialsFrom(p.nome ?? '')}
									</div>
									<div>
										<div style="font-weight:600">{p.nome}</div>
										<div style="font-size:12px; color:var(--c-muted)">{p.email ?? ''}</div>
									</div>
								</div>
							</td>
							<td style="font-size:13px; color:var(--c-muted)">{p.siape ?? '—'}</td>
							<td style="font-size:13px; color:var(--c-muted)">
								{p.cpf ? p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '—'}
							</td>
							<td>
								{#if p.modalidadeExecucao}
									<ModalidadeBadge modalidade={p.modalidadeExecucao} />
								{:else}
									<span style="color:var(--c-muted)">—</span>
								{/if}
							</td>
							<td>
								{#if p.planosTrabalho?.length}
									{@const ativo = p.planosTrabalho.find((pl: any) => pl.status === 'EM_EXECUCAO')}
									{#if ativo}
										<StatusBadge status="EM_EXECUCAO" />
									{:else}
										<span style="font-size:13px; color:var(--c-muted)">{p.planosTrabalho.length} plano(s)</span>
									{/if}
								{:else}
									<span class="bdg bdg-neutral">Sem plano</span>
								{/if}
							</td>
							<td style="text-align:right">
								<a href="/equipe/participantes/{p.id}" class="btn btn-ghost btn-sm">Ver</a>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</section>
</div>
