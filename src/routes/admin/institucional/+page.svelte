<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let activeTab = $state('unidades-autorizadoras');

	const TABS = [
		{ id: 'unidades-autorizadoras', label: 'Unidades Autorizadoras' },
		{ id: 'unidades-instituidoras', label: 'Unidades Instituidoras' },
		{ id: 'atos-normativos', label: 'Atos Normativos' },
		{ id: 'parametros', label: 'Parâmetros de Envio' },
	];
</script>

<svelte:head>
	<title>Gestão Institucional — PGD Libre</title>
</svelte:head>

<div class="pg">
	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Administração</div>
			<h1 class="pg-title">Gestão Institucional</h1>
			<p class="pg-sub">Configurações estruturais do órgão para o PGD</p>
		</div>
	</div>

	<nav class="tabs" aria-label="Seções de gestão institucional">
		{#each TABS as tab}
			<button
				class="tab"
				class:active={activeTab === tab.id}
				onclick={() => activeTab = tab.id}
				aria-selected={activeTab === tab.id}
				role="tab"
			>
				{tab.label}
			</button>
		{/each}
	</nav>

	{#if activeTab === 'unidades-autorizadoras'}
		<div class="card">
			<div class="card-hd">
				<div>
					<h2>Unidades Autorizadoras</h2>
					<p>Unidades que autorizam a participação no PGD</p>
				</div>
				<button class="btn btn-primary btn-sm">
					<Icon name="plus" size={14} /> Adicionar
				</button>
			</div>
			<p style="color:var(--c-muted); font-size:14px">Nenhuma unidade autorizadora cadastrada.</p>
		</div>

	{:else if activeTab === 'unidades-instituidoras'}
		<div class="card">
			<div class="card-hd">
				<div>
					<h2>Unidades Instituidoras</h2>
					<p>Unidades que instituem os Planos de Entregas</p>
				</div>
				<button class="btn btn-primary btn-sm">
					<Icon name="plus" size={14} /> Adicionar
				</button>
			</div>
			<p style="color:var(--c-muted); font-size:14px">Nenhuma unidade instituidora cadastrada.</p>
		</div>

	{:else if activeTab === 'atos-normativos'}
		<div class="card">
			<div class="card-hd">
				<div>
					<h2>Atos Normativos</h2>
					<p>Portarias, instruções normativas e outros atos que fundamentam o PGD</p>
				</div>
				<button class="btn btn-primary btn-sm">
					<Icon name="plus" size={14} /> Adicionar
				</button>
			</div>
			<p style="color:var(--c-muted); font-size:14px">Nenhum ato normativo cadastrado.</p>
		</div>

	{:else if activeTab === 'parametros'}
		<div class="card">
			<div class="card-hd">
				<div>
					<h2>Parâmetros de Envio à API Central</h2>
					<p>Configurações para integração com a API PGD do MGI</p>
				</div>
			</div>
			<div class="stack-20">
				<div class="field">
					<label for="api-url">URL da API PGD Central</label>
					<input id="api-url" type="url" class="input" placeholder="https://api.gestao.gov.br/pgd/..." />
				</div>
				<div class="field">
					<label for="cod-unidade">Código da Unidade Gestora (SIORG)</label>
					<input id="cod-unidade" type="text" class="input" placeholder="123456" />
				</div>
				<div class="row" style="justify-content:flex-end">
					<button class="btn btn-primary">Salvar parâmetros</button>
				</div>
			</div>
		</div>
	{/if}
</div>
