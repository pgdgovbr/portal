<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import { env } from '$env/dynamic/public';

	let nome = $state('');
	let siape = $state('');
	let cpf = $state('');
	let email = $state('');
	let modalidade = $state('TELETRABALHO_INTEGRAL');
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	// Validação em tempo real (lateral)
	const cpfValid = $derived(cpf.replace(/\D/g, '').length === 11);
	const siapeValid = $derived(/^\d{7}$/.test(siape));
	const emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (!nome.trim()) e.nome = 'Nome é obrigatório';
		if (!siapeValid) e.siape = 'SIAPE deve ter 7 dígitos';
		if (!cpfValid) e.cpf = 'CPF inválido';
		if (email && !emailValid) e.email = 'E-mail inválido';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;

		loading = true;
		try {
			const mutation = `
				mutation CadastrarParticipante($input: CadastrarParticipanteInput!) {
					cadastrarParticipante(input: $input) {
						id
						nome
					}
				}
			`;
			const GRAPHQL_URL = env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-livre-klvx64dufq-rj.a.run.app/graphql';
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					query: mutation,
					variables: {
						input: {
							nome: nome.trim(),
							siape,
							cpf: cpf.replace(/\D/g, ''),
							email: email || null,
							modalidadeExecucao: modalidade
						}
					}
				})
			});
			const { data, errors: gqlErrors } = await res.json();
			if (gqlErrors?.length) throw new Error(gqlErrors[0].message);
			goto('/admin/participantes?novo=' + data.cadastrarParticipante.id);
		} catch (err: any) {
			errors = { _global: err.message ?? 'Erro ao cadastrar. Tente novamente.' };
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Cadastrar Participante — PGD Libre</title>
</svelte:head>

<div class="pg" style="max-width:900px">
	<div class="crumb">
		<a href="/">Início</a>
		<span class="sep">/</span>
		<a href="/admin/participantes">Participantes</a>
		<span class="sep">/</span>
		<span>Cadastrar</span>
	</div>

	<div class="pg-head">
		<div>
			<div class="pg-eyebrow">Administração</div>
			<h1 class="pg-title">Cadastrar Participante</h1>
			<p class="pg-sub">Registre um servidor para participação no PGD</p>
		</div>
	</div>

	<div class="g-1-2">
		<!-- Validação lateral -->
		<div class="col" style="gap:12px">
			<section class="card">
				<div class="card-hd"><h2 style="font-size:17px">Validação automática</h2></div>
				<div class="stack-12">
					<div class="row">
						<Icon name={nome.trim() ? 'check-circle' : 'alert-circle'} size={16} />
						<span style="font-size:13.5px; color:{nome.trim() ? 'var(--c-success)' : 'var(--c-muted)'}">
							Nome completo
						</span>
					</div>
					<div class="row">
						<Icon name={siapeValid ? 'check-circle' : 'alert-circle'} size={16} />
						<span style="font-size:13.5px; color:{siapeValid ? 'var(--c-success)' : 'var(--c-muted)'}">
							SIAPE válido (7 dígitos)
						</span>
					</div>
					<div class="row">
						<Icon name={cpfValid ? 'check-circle' : 'alert-circle'} size={16} />
						<span style="font-size:13.5px; color:{cpfValid ? 'var(--c-success)' : 'var(--c-muted)'}">
							CPF válido (11 dígitos)
						</span>
					</div>
					<div class="row">
						<Icon name={!email || emailValid ? 'check-circle' : 'alert-circle'} size={16} />
						<span style="font-size:13.5px; color:{!email || emailValid ? 'var(--c-success)' : 'var(--c-muted)'}">
							E-mail válido
						</span>
					</div>
				</div>
			</section>

			<section class="card" style="border-left:3px solid var(--c-info)">
				<div class="kicker" style="color:var(--c-info)">
					<Icon name="info" size={13} /> Atenção
				</div>
				<p style="font-size:13px; color:var(--c-ink-2); margin-top:10px; line-height:1.6">
					O participante precisará de uma conta ativa (Google ou Gov.br) para acessar o sistema.
					O login é feito com o e-mail corporativo.
				</p>
			</section>
		</div>

		<!-- Formulário -->
		<section class="card">
			<form onsubmit={submit} novalidate>
				<div class="stack-20">
					{#if errors._global}
						<div class="banner urgent">
							<span class="icon"><Icon name="alert-circle" size={18} /></span>
							<div>
								<div class="ttl">Erro</div>
								<div class="sub">{errors._global}</div>
							</div>
						</div>
					{/if}

					<div class="field">
						<label for="nome">Nome completo <span style="color:var(--c-danger)">*</span></label>
						<input id="nome" type="text" class="input" bind:value={nome} aria-required="true" placeholder="Ex.: Ana Beatriz Costa" />
						{#if errors.nome}<div style="color:var(--c-danger); font-size:12.5px">{errors.nome}</div>{/if}
					</div>

					<div class="g-2" style="gap:16px">
						<div class="field">
							<label for="siape">SIAPE <span style="color:var(--c-danger)">*</span></label>
							<input
								id="siape"
								type="text"
								class="input"
								maxlength="7"
								bind:value={siape}
								aria-required="true"
								placeholder="1234567"
							/>
							{#if errors.siape}<div style="color:var(--c-danger); font-size:12.5px">{errors.siape}</div>{/if}
						</div>
						<div class="field">
							<label for="cpf">CPF <span style="color:var(--c-danger)">*</span></label>
							<input
								id="cpf"
								type="text"
								class="input"
								maxlength="14"
								bind:value={cpf}
								aria-required="true"
								placeholder="000.000.000-00"
							/>
							{#if errors.cpf}<div style="color:var(--c-danger); font-size:12.5px">{errors.cpf}</div>{/if}
						</div>
					</div>

					<div class="field">
						<label for="email">E-mail institucional</label>
						<div class="help optional">Será usado para receber notificações e como login.</div>
						<input id="email" type="email" class="input" bind:value={email} placeholder="servidor@orgao.gov.br" />
						{#if errors.email}<div style="color:var(--c-danger); font-size:12.5px">{errors.email}</div>{/if}
					</div>

					<div class="field">
						<label for="modalidade">Modalidade de execução <span style="color:var(--c-danger)">*</span></label>
						<select id="modalidade" class="select" bind:value={modalidade} aria-required="true">
							<option value="TELETRABALHO_INTEGRAL">Teletrabalho Integral</option>
							<option value="TELETRABALHO_PARCIAL">Teletrabalho Parcial</option>
							<option value="PRESENCIAL">Presencial</option>
						</select>
					</div>

					<div class="row" style="justify-content:flex-end; gap:10px; margin-top:8px">
						<a href="/admin/participantes" class="btn btn-ghost">Cancelar</a>
						<button type="submit" class="btn btn-primary btn-lg" disabled={loading}>
							{#if loading}
								Cadastrando…
							{:else}
								<Icon name="check" size={16} /> Cadastrar participante
							{/if}
						</button>
					</div>
				</div>
			</form>
		</section>
	</div>
</div>
