<!--
  Timeline vertical do ciclo da norma (variante mobile).
  Estrutura DOM diferente da horizontal: linha contínua à esquerda + bolinhas
  numeradas com border que "interrompem" a linha. Condensa as 6 etapas do
  desktop em 4 (handoff-landing-mobile.md §5.5).
-->
<script lang="ts">
	interface Etapa {
		titulo: string;
		prazo: string;
		desc: string;
	}

	const ETAPAS: Etapa[] = [
		{
			titulo: 'Pactuação',
			prazo: '1º ao 5º dia útil do mês',
			desc: 'Servidor e chefia acordam o Plano de Trabalho.'
		},
		{
			titulo: 'Execução & Registro',
			prazo: 'Durante o mês',
			desc: 'Registros mensais com apoio da IA, sem inventar fatos.'
		},
		{
			titulo: 'Avaliação',
			prazo: 'Em até 20 dias úteis do fim do ciclo',
			desc: 'Chefia avalia com base em critérios institucionais.'
		},
		{
			titulo: 'Sincronização API Central',
			prazo: 'Automática',
			desc: 'Envio ao MGI sem ação manual; eventos auditáveis.'
		}
	];
</script>

<div class="ciclo-mobile-wrap">
	<span class="linha" aria-hidden="true"></span>
	{#each ETAPAS as etapa, i (etapa.titulo)}
		<div class="etapa" style="--i:{i}">
			<span class="bolinha">{i + 1}</span>
			<div class="conteudo">
				<strong class="titulo">{etapa.titulo}</strong>
				<div class="prazo">{etapa.prazo}</div>
				<p class="desc">{etapa.desc}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.ciclo-mobile-wrap {
		margin-top: 22px;
		position: relative;
	}
	.linha {
		position: absolute;
		left: 11px;
		top: 6px;
		bottom: 6px;
		width: 2px;
		background: rgba(255, 255, 255, 0.15);
	}
	.etapa {
		display: flex;
		gap: 14px;
		padding-bottom: 22px;
		position: relative;
		opacity: 0;
		transform: scale(0.96) translateY(4px);
		transition:
			opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: calc(var(--i) * 80ms);
	}
	.etapa:last-child {
		padding-bottom: 0;
	}
	:global(.in-view) .etapa {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
	.bolinha {
		flex: none;
		width: 24px;
		height: 24px;
		border-radius: 12px;
		background: var(--c-accent);
		color: var(--c-ink-editorial);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--ff-display);
		font-weight: 800;
		font-size: 11px;
		border: 3px solid var(--c-ink-editorial);
		z-index: 1;
	}
	.conteudo {
		flex: 1;
		min-width: 0;
	}
	.titulo {
		font-size: 14px;
		color: white;
		display: block;
		line-height: 1.3;
		font-weight: 700;
	}
	.prazo {
		font-family: var(--ff-mono, ui-monospace, monospace);
		font-size: 10.5px;
		color: var(--c-accent);
		margin-top: 3px;
		letter-spacing: 0.02em;
	}
	.desc {
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.74);
		margin: 6px 0 0;
		line-height: 1.5;
	}
	@media (prefers-reduced-motion: reduce) {
		.etapa {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
