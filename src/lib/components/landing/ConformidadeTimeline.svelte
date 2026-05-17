<!--
  Timeline horizontal das 6 etapas do ciclo da norma (dark section).
  Cada etapa: número numerado, prazo opcional (chip), título, descrição e
  referência ao artigo do decreto/IN.
-->
<script lang="ts">
	interface Step {
		ttl: string;
		prazo: string | null;
		art: string;
		desc: string;
	}

	const STEPS: Step[] = [
		{
			ttl: 'Pactuação bilateral',
			prazo: null,
			art: 'Decreto 11.072/2022 · Art. 11',
			desc: 'Servidor e chefia firmam o plano com dupla assinatura. Ajustes derrubam a assinatura do outro, preservando rastro.',
		},
		{
			ttl: 'Execução',
			prazo: null,
			art: 'IN 24/2023 · Art. 28',
			desc: 'Período avaliativo aberto. Servidor executa as contribuições nos percentuais pactuados.',
		},
		{
			ttl: 'Registro de execução',
			prazo: '10 dias',
			art: 'IN 24/2023 · Art. 31',
			desc: 'Servidor descreve o realizado ao fim de cada período. Notificação automática antes do vencimento.',
		},
		{
			ttl: 'Avaliação',
			prazo: '20 dias',
			art: 'IN 24/2023 · Art. 33',
			desc: 'Chefia atribui nota 1 a 5. Justificativa obrigatória para notas 1, 4 e 5.',
		},
		{
			ttl: 'Recurso',
			prazo: '10 dias',
			art: 'IN 24/2023 · Art. 35',
			desc: 'Servidor pode contestar avaliações 4 ou 5. Chefia responde em até 10 dias.',
		},
		{
			ttl: 'Envio à API Central',
			prazo: 'automático',
			art: 'IN 24/2023 · Art. 16',
			desc: 'Planos e avaliações sincronizam com a API PGD Central do MGI. Erros aparecem no painel administrativo.',
		},
	];
</script>

<div class="timeline">
	<div class="grid">
		{#each STEPS as s, i}
			<div class="step">
				{#if i < STEPS.length - 1}
					<span class="connector" aria-hidden="true"></span>
				{/if}
				<div class="head">
					<span class="num" class:first={i === 0}>{i + 1}</span>
					{#if s.prazo}
						<span
							class="prazo"
							style="background:{s.prazo === 'automático' ? 'var(--c-success)' : 'var(--c-accent)'}"
						>
							{s.prazo}
						</span>
					{/if}
				</div>
				<div class="ttl">{s.ttl}</div>
				<p class="desc">{s.desc}</p>
				<span class="art">{s.art}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.timeline {
		margin-top: 56px;
		position: relative;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0;
	}
	.step {
		position: relative;
		padding-right: 18px;
	}
	.step:last-child {
		padding-right: 0;
	}
	.connector {
		position: absolute;
		top: 18px;
		left: 36px;
		right: -18px;
		height: 2px;
		background: rgba(255, 255, 255, 0.18);
		z-index: 0;
	}
	.head {
		position: relative;
		margin-bottom: 18px;
		height: 38px;
	}
	.num {
		width: 36px;
		height: 36px;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.12);
		border: 1.5px solid rgba(255, 255, 255, 0.28);
		color: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--ff-display);
		font-weight: 800;
		font-size: 14px;
		position: relative;
		z-index: 1;
	}
	.num.first {
		background: var(--c-accent);
		border: none;
	}
	.prazo {
		position: absolute;
		top: -10px;
		left: 44px;
		color: white;
		padding: 3px 9px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
	}
	.ttl {
		font-family: var(--ff-display);
		font-weight: 700;
		font-size: 18px;
		color: white;
		margin-bottom: 6px;
		line-height: 1.2;
	}
	.desc {
		font-size: 13.5px;
		color: rgba(255, 255, 255, 0.74);
		line-height: 1.55;
		margin: 0 0 12px;
	}
	.art {
		display: inline-block;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.18);
		padding: 4px 10px;
		border-radius: 999px;
		font-family: var(--ff-mono, ui-monospace, monospace);
		font-size: 10.5px;
	}
	@media (max-width: 1080px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px 0;
		}
		.connector {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
