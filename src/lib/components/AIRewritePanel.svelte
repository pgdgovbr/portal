<script lang="ts">
	import Icon from './Icon.svelte';
	import {
		AI_SYSTEM_PROMPT,
		AI_USER_PROMPT_DEFAULT,
		AI_TEMPLATES,
		type TemplateId,
	} from '$lib/ai-rewrite-constants';

	interface Props {
		originalText: string;
		registroId?: string;
		onApply: (rewrittenText: string, eventId: string) => void;
		onCancel: () => void;
	}

	let { originalText, registroId, onApply, onCancel }: Props = $props();

	let stage = $state<'editing' | 'previewing'>('editing');
	let template = $state<TemplateId>('entrega');
	let userPrompt = $state(AI_USER_PROMPT_DEFAULT);
	let loading = $state(false);
	let applying = $state(false);
	let rewrittenText = $state('');
	let eventId = $state('');
	let error = $state('');

	const tpl = $derived(AI_TEMPLATES.find((t) => t.id === template)!);
	const warningGaps = $derived((rewrittenText.match(/\[[^\]]+\]/g) ?? []).length);
	const userPromptWords = $derived(
		userPrompt
			.trim()
			.split(/\s+/)
			.filter((w) => w.length > 0).length,
	);

	async function handleRewrite() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/ai/rewrite-registro', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					registro_id: registroId ?? null,
					texto_atual: originalText,
					template_id: template,
					instrucao_adicional: userPrompt,
				}),
			});

			if (res.status === 429) {
				const retry = parseInt(res.headers.get('Retry-After') ?? '60', 10);
				const mins = Math.ceil(retry / 60);
				error = `Você usou suas reescritas desta hora. Tente em ${mins} min.`;
				return;
			}
			if (res.status === 503) {
				error = 'A IA demorou demais ou está temporariamente indisponível. Tente novamente.';
				return;
			}
			if (!res.ok) {
				error = 'Algo deu errado. Tente outro template ou refine a instrução.';
				return;
			}

			const data = await res.json();
			rewrittenText = data.rewritten_text;
			eventId = data.event_id;
			stage = 'previewing';
		} catch {
			error = 'Erro de conexão com o servidor. Tente novamente.';
		} finally {
			loading = false;
		}
	}

	async function handleApply() {
		applying = true;
		try {
			await fetch(`/api/ai/rewrite-registro/${eventId}/applied`, {
				method: 'POST',
				credentials: 'include',
			});
		} catch {
			// não bloqueia aplicação na UI mesmo se a chamada de audit falhar
		} finally {
			applying = false;
			onApply(rewrittenText, eventId);
		}
	}

	function backToEditing() {
		stage = 'editing';
		error = '';
	}
</script>

<div class="ai-panel" role="region" aria-label="Reescrever com IA">
	<header class="ai-head">
		<span class="ai-spark" aria-hidden="true">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
				stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
				<path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" opacity=".6" />
			</svg>
		</span>
		<div class="ai-head-text">
			<div class="ai-title-row">
				<strong>Reescrever com IA</strong>
				<span class="ai-beta">BETA</span>
			</div>
			<div class="ai-sub">
				{#if stage === 'editing'}
					Escolha um template e ajuste a instrução. O sistema preserva fatos do seu texto original.
				{:else}
					Resultado pronto. Compare com o texto atual antes de aplicar.
				{/if}
			</div>
		</div>
		<button class="ai-close" onclick={onCancel} aria-label="Fechar painel">
			<Icon name="x" size={15} />
		</button>
	</header>

	{#if error}
		<div class="ai-error" role="alert">{error}</div>
	{/if}

	{#if stage === 'editing'}
		<div class="ai-section">
			<div class="ai-kicker">Template de estrutura</div>
			<div class="ai-grid">
				{#each AI_TEMPLATES as t (t.id)}
					<button
						type="button"
						class="ai-tpl-card"
						class:is-active={template === t.id}
						onclick={() => (template = t.id)}
						aria-pressed={template === t.id}
					>
						<span class="ai-tpl-icon">
							<Icon name={t.icon} size={14} stroke={2.2} />
						</span>
						<div>
							<div class="ai-tpl-name">{t.nome}</div>
							<div class="ai-tpl-desc">{t.desc}</div>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div class="field" style="margin-bottom:12px">
			<label for="ai-userprompt" style="display:flex; justify-content:space-between">
				<span>Instrução adicional para a IA</span>
				<span class="ai-hint">opcional · você pode editar</span>
			</label>
			<textarea
				id="ai-userprompt"
				class="textarea"
				bind:value={userPrompt}
				style="min-height:70px; font-size:13px"
			></textarea>
		</div>

		<details class="ai-sysprompt">
			<summary>
				<Icon name="chevR" size={13} stroke={2.2} />
				Ver prompt do sistema (fixo, não editável)
			</summary>
			<pre>{AI_SYSTEM_PROMPT}</pre>
		</details>

		<div class="ai-actions">
			<button class="btn btn-ghost btn-sm" onclick={onCancel}>Cancelar</button>
			<button class="btn btn-sm ai-primary" disabled={loading} onclick={handleRewrite}>
				{#if loading}
					<Icon name="refresh" size={14} class="spinning" /> Reescrevendo…
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
					Reescrever
				{/if}
			</button>
		</div>
	{:else}
		<div class="ai-preview-head">
			<span class="ai-tpl-badge">
				<Icon name={tpl.icon} size={11} stroke={2.4} /> {tpl.nome}
			</span>
			<span class="ai-hint">· {userPromptWords} palavras de instrução</span>
			<button class="btn btn-ghost btn-sm ai-refine" onclick={backToEditing}>
				<Icon name="edit" size={11} /> Refinar
			</button>
		</div>

		<div class="ai-side">
			<div>
				<div class="ai-kicker ai-kicker-muted">Texto atual</div>
				<pre class="ai-pre ai-pre-old">{originalText || '(seu texto)'}</pre>
			</div>
			<div>
				<div class="ai-kicker ai-kicker-aval">
					<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
					Proposta da IA
				</div>
				<pre class="ai-pre ai-pre-new">{rewrittenText}</pre>
			</div>
		</div>

		{#if warningGaps > 0}
			<div class="ai-gaps" role="status">
				<Icon name="info" size={14} />
				<div>
					<strong>{warningGaps} lacuna{warningGaps === 1 ? '' : 's'} marcada{warningGaps === 1 ? '' : 's'}</strong>
					com <code>[ ... ]</code>. A IA não inventa fatos — revise e preencha antes de submeter.
				</div>
			</div>
		{/if}

		<div class="ai-actions">
			<button class="btn btn-ghost btn-sm" onclick={onCancel}>Cancelar</button>
			<button class="btn btn-ghost btn-sm" onclick={backToEditing}>
				<Icon name="edit" size={13} /> Ajustar instrução
			</button>
			<button class="btn btn-sm ai-primary" disabled={applying} onclick={handleApply}>
				<Icon name="check" size={13} stroke={2.4} /> Aplicar reescrita
			</button>
		</div>
	{/if}
</div>

<style>
	.ai-panel {
		border-radius: var(--r-md, 12px);
		border: 1.5px solid color-mix(in srgb, var(--c-status-aval, #5c2d91) 20%, transparent);
		background: linear-gradient(180deg, #faf7fe 0%, white 60%);
		padding: 18px;
		margin-top: 12px;
		position: relative;
	}
	.ai-head {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-bottom: 14px;
	}
	.ai-spark {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: var(--c-status-aval, #5c2d91);
		color: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.ai-head-text {
		flex: 1;
	}
	.ai-title-row {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.ai-title-row strong {
		font-size: 14.5px;
		color: var(--c-status-aval, #5c2d91);
	}
	.ai-beta {
		background: #efe8f7;
		color: var(--c-status-aval, #5c2d91);
		font-size: 10.5px;
		padding: 2px 7px;
		border-radius: 999px;
		font-weight: 700;
	}
	.ai-sub {
		font-size: 12px;
		color: var(--c-muted, #5a6677);
		margin-top: 2px;
	}
	.ai-close {
		width: 30px;
		height: 30px;
		border-radius: 6px;
		border: 1px solid var(--c-border, #d8dde6);
		background: white;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.ai-error {
		background: var(--c-danger-soft, #fbe6e6);
		border: 1px solid color-mix(in srgb, var(--c-danger, #b91c1c) 30%, transparent);
		color: var(--c-danger, #b91c1c);
		padding: 10px 12px;
		border-radius: var(--r-sm, 8px);
		font-size: 13px;
		margin-bottom: 14px;
	}
	.ai-section {
		margin-bottom: 14px;
	}
	.ai-kicker {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--c-muted, #5a6677);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 8px;
	}
	.ai-kicker-muted {
		color: var(--c-muted, #5a6677);
	}
	.ai-kicker-aval {
		color: var(--c-status-aval, #5c2d91);
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.ai-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.ai-tpl-card {
		padding: 12px;
		border: 1.5px solid var(--c-border-strong, #c4cad4);
		border-radius: var(--r-sm, 8px);
		background: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.12s;
		display: flex;
		gap: 10px;
		align-items: flex-start;
		text-align: left;
	}
	.ai-tpl-card.is-active {
		border: 2px solid var(--c-status-aval, #5c2d91);
		background: white;
	}
	.ai-tpl-icon {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		background: #efe8f7;
		color: var(--c-status-aval, #5c2d91);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		margin-top: 1px;
	}
	.ai-tpl-card.is-active .ai-tpl-icon {
		background: var(--c-status-aval, #5c2d91);
		color: white;
	}
	.ai-tpl-name {
		font-weight: 700;
		font-size: 12.5px;
		color: var(--c-ink, #16223a);
	}
	.ai-tpl-desc {
		font-size: 11px;
		color: var(--c-muted, #5a6677);
		margin-top: 2px;
		line-height: 1.4;
	}
	.ai-hint {
		font-size: 11px;
		color: var(--c-muted, #5a6677);
		font-weight: 500;
	}
	.ai-sysprompt {
		background: rgba(92, 45, 145, 0.04);
		border: 1px solid rgba(92, 45, 145, 0.12);
		border-radius: var(--r-sm, 8px);
		padding: 10px 12px;
		margin-bottom: 16px;
	}
	.ai-sysprompt summary {
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--c-status-aval, #5c2d91);
	}
	.ai-sysprompt pre {
		font-family: var(--ff-mono, ui-monospace, monospace);
		font-size: 11.5px;
		line-height: 1.55;
		color: var(--c-ink-2, #2d3a52);
		white-space: pre-wrap;
		margin-top: 10px;
		margin-bottom: 0;
		max-height: 200px;
		overflow: auto;
	}
	.ai-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}
	.ai-primary {
		background: var(--c-status-aval, #5c2d91);
		color: white;
		border-color: var(--c-status-aval, #5c2d91);
	}
	.ai-primary:hover:not(:disabled) {
		filter: brightness(1.1);
	}
	.ai-preview-head {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}
	.ai-tpl-badge {
		background: var(--c-status-aval, #5c2d91);
		color: white;
		font-size: 11px;
		padding: 3px 8px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-weight: 600;
	}
	.ai-refine {
		margin-left: auto;
		font-size: 11.5px;
		padding: 4px 8px;
	}
	.ai-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: 14px;
	}
	.ai-pre {
		padding: 12px;
		font-size: 11.5px;
		line-height: 1.55;
		font-family: var(--ff-body, system-ui, sans-serif);
		white-space: pre-wrap;
		margin: 0;
		max-height: 280px;
		overflow: auto;
		border-radius: var(--r-sm, 8px);
	}
	.ai-pre-old {
		background: var(--c-surface-2, #f5f6f9);
		border: 1px solid var(--c-border, #d8dde6);
		color: var(--c-muted, #5a6677);
	}
	.ai-pre-new {
		background: white;
		border: 1.5px solid color-mix(in srgb, var(--c-status-aval, #5c2d91) 20%, transparent);
		color: var(--c-ink, #16223a);
	}
	.ai-gaps {
		background: var(--c-warning-soft, #fff5e6);
		border: 1px solid rgba(199, 116, 0, 0.22);
		border-radius: var(--r-sm, 8px);
		padding: 10px 12px;
		margin-bottom: 12px;
		display: flex;
		gap: 10px;
		align-items: flex-start;
		font-size: 12px;
		color: var(--c-ink-2, #2d3a52);
		line-height: 1.5;
	}
	.ai-gaps strong {
		color: var(--c-warning, #c77400);
	}
	.ai-gaps code {
		font-family: var(--ff-mono, ui-monospace, monospace);
		background: white;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 11.5px;
	}
	@media (max-width: 640px) {
		.ai-grid {
			grid-template-columns: 1fr;
		}
		.ai-side {
			grid-template-columns: 1fr;
		}
	}
	:global(.spinning) {
		animation: ai-spin 1s linear infinite;
	}
	@keyframes ai-spin {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
