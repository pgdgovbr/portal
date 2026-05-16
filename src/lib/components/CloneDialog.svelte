<script lang="ts" module>
	/**
	 * Calcula o próximo semestre civil (1/Jan–30/Jun ou 1/Jul–31/Dez) a partir de hoje.
	 * Se hoje está no 1º semestre, devolve 2º semestre do mesmo ano;
	 * caso contrário devolve 1º semestre do ano seguinte.
	 */
	export function proximoSemestre(hoje: Date = new Date()): {
		inicio: Date;
		fim: Date;
	} {
		const ano = hoje.getFullYear();
		const mes = hoje.getMonth(); // 0..11
		if (mes < 6) {
			return { inicio: new Date(ano, 6, 1), fim: new Date(ano, 11, 31) };
		}
		return { inicio: new Date(ano + 1, 0, 1), fim: new Date(ano + 1, 5, 30) };
	}

	function pad(n: number): string {
		return n < 10 ? `0${n}` : `${n}`;
	}

	export function toInputDate(d: Date): string {
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	}
</script>

<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		planoId: string;
		open: boolean;
		onCancel: () => void;
		onClone: (params: {
			idPlanoTrabalhoNovo: string;
			dataInicio: string;
			dataTermino: string;
		}) => Promise<void>;
	}

	let { planoId, open, onCancel, onClone }: Props = $props();

	const def = proximoSemestre();
	let dataInicio = $state(toInputDate(def.inicio));
	let dataTermino = $state(toInputDate(def.fim));
	let idPlanoTrabalhoNovo = $state('');
	let submitting = $state(false);

	const valido = $derived.by(() => {
		if (!dataInicio || !dataTermino) return false;
		return new Date(dataTermino) > new Date(dataInicio);
	});

	function gerarIdNovo(base: string): string {
		const stamp = Date.now().toString(36);
		return `${base}-clone-${stamp}`;
	}

	async function submit() {
		if (!valido || submitting) return;
		submitting = true;
		try {
			const idNovo = idPlanoTrabalhoNovo.trim() || gerarIdNovo(planoId);
			await onClone({
				idPlanoTrabalhoNovo: idNovo,
				dataInicio,
				dataTermino
			});
		} finally {
			submitting = false;
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.stopPropagation();
			onCancel();
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="clone-overlay" onclick={onCancel}>
		<div
			class="clone-dialog"
			role="dialog"
			aria-modal="true"
			aria-labelledby="clone-title"
			tabindex="-1"
			onkeydown={onKeyDown}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="clone-header">
				<span class="clone-icon">
					<Icon name="file" size={22} />
				</span>
				<div class="clone-header-text">
					<h3 id="clone-title" class="clone-title">Clonar plano de trabalho</h3>
					<p class="clone-sub">
						Você está clonando o plano <strong>{planoId}</strong>.
					</p>
				</div>
				<button
					type="button"
					class="tn-iconbtn clone-close"
					aria-label="Fechar"
					onclick={onCancel}
				>
					<Icon name="x" size={16} />
				</button>
			</div>

			<div class="clone-info">
				<strong>Vamos copiar:</strong>
				<ul>
					<li>Modalidade de execução</li>
					<li>Critérios de avaliação</li>
					<li>Contribuições e percentuais</li>
				</ul>
				<div class="clone-info-foot">Você poderá ajustar tudo antes de enviar para a chefia.</div>
			</div>

			<div class="clone-datas">
				<div class="field">
					<label for="clone-data-inicio">
						<Icon name="calendar" size={13} /> Data de início
					</label>
					<input
						id="clone-data-inicio"
						type="date"
						class="input"
						bind:value={dataInicio}
					/>
				</div>
				<div class="field">
					<label for="clone-data-termino">
						<Icon name="calendar" size={13} /> Data de término
					</label>
					<input
						id="clone-data-termino"
						type="date"
						class="input"
						bind:value={dataTermino}
					/>
				</div>
			</div>

			<div class="clone-actions">
				<button type="button" class="btn btn-ghost" onclick={onCancel}>Cancelar</button>
				<button
					type="button"
					class="btn btn-primary"
					disabled={!valido || submitting}
					onclick={submit}
				>
					<Icon name="file" size={15} /> Clonar e editar
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.clone-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 25, 50, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		z-index: 1000;
	}

	.clone-dialog {
		background: white;
		border-radius: var(--r-lg);
		box-shadow: var(--sh-lg);
		width: 540px;
		max-width: 100%;
		padding: 28px;
	}
	.clone-dialog:focus {
		outline: none;
	}

	.clone-header {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin-bottom: 18px;
	}
	.clone-icon {
		width: 44px;
		height: 44px;
		border-radius: var(--r-md);
		background: var(--c-primary-soft);
		color: var(--c-primary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.clone-header-text {
		flex: 1;
	}
	.clone-title {
		font-family: var(--ff-display, inherit);
		font-size: 19px;
		font-weight: 700;
		margin: 0;
		letter-spacing: -0.01em;
	}
	.clone-sub {
		font-size: 13.5px;
		color: var(--c-muted);
		margin: 4px 0 0;
		line-height: 1.5;
	}
	.clone-sub strong {
		color: var(--c-ink);
	}
	.clone-close {
		width: 32px;
		height: 32px;
	}

	.clone-info {
		padding: 14px;
		background: var(--c-surface-2);
		border-radius: var(--r-md);
		border: 1px solid var(--c-border);
		font-size: 13px;
		color: var(--c-ink-2);
		margin-bottom: 18px;
		line-height: 1.55;
	}
	.clone-info strong {
		color: var(--c-ink);
	}
	.clone-info ul {
		margin: 8px 0 0;
		padding-left: 18px;
		line-height: 1.7;
	}
	.clone-info-foot {
		margin-top: 10px;
		font-size: 12px;
		color: var(--c-muted);
	}

	.clone-datas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 22px;
	}

	.clone-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	@media (max-width: 640px) {
		.clone-datas {
			grid-template-columns: 1fr;
		}
	}
</style>
