<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		ator: string;
		dataAssinatura?: string;
		onAssinar?: () => void;
		onDevolver?: () => void;
	}

	let { ator, dataAssinatura, onAssinar, onDevolver }: Props = $props();

	let check1 = $state(false);
	let check2 = $state(false);
	let check3 = $state(false);
	const pode = $derived(check1 && check2 && check3);

	const itens = [
		'Li o plano completo — período, contribuições e critérios de avaliação',
		'Concordo com as atividades e percentuais propostos',
		'Estou ciente das declarações de ausência de prejuízo no exercício das atividades'
	];

	function setCheck(i: number, v: boolean) {
		if (i === 0) check1 = v;
		else if (i === 1) check2 = v;
		else if (i === 2) check3 = v;
	}
	function getCheck(i: number) {
		return i === 0 ? check1 : i === 1 ? check2 : check3;
	}
</script>

{#if dataAssinatura}
	<div class="assinatura-card assinatura-assinada">
		<span class="assinatura-icon-ok">
			<Icon name="check" size={22} stroke={2.4} />
		</span>
		<div class="assinatura-info">
			<div class="assinatura-titulo">Você assinou esta versão</div>
			<div class="assinatura-meta">{ator} · em {dataAssinatura}</div>
		</div>
		<button type="button" class="btn btn-ghost btn-sm">
			<Icon name="download" size={13} /> Comprovante
		</button>
	</div>
{:else}
	<div class="assinatura-card assinatura-pendente">
		<div class="kicker assinatura-kicker">
			<Icon name="check" size={13} stroke={2.4} /> Antes de assinar
		</div>
		<p class="assinatura-desc">
			Confirme cada item abaixo. Sua assinatura tem peso de pactuação formal entre você e {ator ||
				'o outro lado'}.
		</p>

		<div class="stack-12 assinatura-checks">
			{#each itens as texto, i}
				<label class="assinatura-check" class:checked={getCheck(i)}>
					<input
						type="checkbox"
						checked={getCheck(i)}
						onchange={(e) => setCheck(i, (e.currentTarget as HTMLInputElement).checked)}
					/>
					<span>{texto}</span>
				</label>
			{/each}
		</div>

		<div class="assinatura-actions">
			<button
				type="button"
				class="btn btn-primary btn-lg assinatura-btn-confirm"
				disabled={!pode}
				onclick={onAssinar}
			>
				<Icon name="check" size={16} stroke={2.4} /> Assinar e ativar plano
			</button>
			<button type="button" class="btn btn-ghost btn-lg" onclick={onDevolver}>
				<Icon name="edit" size={15} /> Devolver para ajustes
			</button>
		</div>

		<p class="assinatura-rodape">
			Devolver para ajustes <strong>zera a assinatura do outro lado</strong> — ele(a) precisará
			reassinar depois.
		</p>
	</div>
{/if}

<style>
	.assinatura-card {
		border-radius: var(--r-lg);
		background: white;
	}

	.assinatura-pendente {
		padding: 24px;
		border: 1.5px solid color-mix(in srgb, var(--c-primary) 20%, transparent);
		border-top: 3px solid var(--c-primary);
		box-shadow: var(--sh-md);
	}

	.assinatura-assinada {
		padding: 22px;
		background: linear-gradient(135deg, var(--c-success-soft) 0%, white 60%);
		border: 1px solid color-mix(in srgb, var(--c-success) 13%, transparent);
		border-left: 3px solid var(--c-success);
		display: flex;
		gap: 14px;
		align-items: center;
	}

	.assinatura-icon-ok {
		width: 44px;
		height: 44px;
		border-radius: var(--r-md);
		background: var(--c-success);
		color: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}

	.assinatura-info {
		flex: 1;
	}
	.assinatura-titulo {
		font-weight: 700;
		font-size: 15px;
		color: var(--c-ink);
	}
	.assinatura-meta {
		font-size: 13px;
		color: var(--c-muted);
		margin-top: 2px;
	}

	.assinatura-kicker {
		color: var(--c-primary);
	}

	.assinatura-desc {
		font-size: 13.5px;
		color: var(--c-ink-2);
		margin: 10px 0 16px;
		line-height: 1.55;
	}

	.assinatura-checks {
		margin-bottom: 18px;
	}

	.assinatura-check {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		padding: 12px;
		border-radius: var(--r-sm);
		background: var(--c-surface-2);
		border: 1px solid var(--c-border);
		cursor: pointer;
		transition: all 0.12s;
		font-size: 13.5px;
		color: var(--c-ink-2);
		line-height: 1.5;
	}
	.assinatura-check.checked {
		background: var(--c-primary-soft);
		border-color: color-mix(in srgb, var(--c-primary) 20%, transparent);
	}
	.assinatura-check input {
		margin-top: 2px;
		accent-color: var(--c-primary);
		flex: none;
		width: 16px;
		height: 16px;
	}

	.assinatura-actions {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.assinatura-btn-confirm {
		flex: 1;
	}
	.assinatura-btn-confirm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.assinatura-rodape {
		font-size: 11.5px;
		color: var(--c-muted);
		margin: 14px 0 0;
		text-align: center;
		line-height: 1.5;
	}
</style>
