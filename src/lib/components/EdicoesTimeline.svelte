<script lang="ts" module>
	export interface DiffItem {
		campo: string;
		de: string;
		para: string;
		mono?: boolean;
	}

	export type TimelineTipo =
		| 'criou'
		| 'editou'
		| 'assinou'
		| 'devolveu'
		| 'enviou'
		| 'pactuou';

	export type TimelinePapel = 'servidor' | 'chefia';

	export interface TimelineEntry {
		tipo: TimelineTipo;
		papel: TimelinePapel;
		autor: string;
		quando: string;
		descricao?: string;
		diff?: DiffItem[];
	}
</script>

<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		items: TimelineEntry[];
		defaultExpanded?: number;
	}

	let { items, defaultExpanded }: Props = $props();

	function initialExpanded(): Set<number> {
		return defaultExpanded != null ? new Set([defaultExpanded]) : new Set();
	}

	let expanded = $state<Set<number>>(initialExpanded());

	function toggle(i: number) {
		const next = new Set(expanded);
		if (next.has(i)) next.delete(i);
		else next.add(i);
		expanded = next;
	}

	type TipoConfig = { color: string; icon: string; label: string };
	const TIPO: Record<TimelineTipo, TipoConfig> = {
		criou: { color: 'var(--c-primary)', icon: 'plus', label: 'Criou plano' },
		editou: { color: 'var(--c-warning)', icon: 'edit', label: 'Editou' },
		assinou: { color: 'var(--c-success)', icon: 'check', label: 'Assinou' },
		devolveu: { color: 'var(--c-status-aval)', icon: 'arrowL', label: 'Devolveu para ajustes' },
		enviou: { color: 'var(--c-primary)', icon: 'paperPlane', label: 'Enviou para revisão' },
		pactuou: { color: 'var(--c-success)', icon: 'handshake', label: 'Pactuação concluída' }
	};

	function cfg(tipo: TimelineTipo): TipoConfig {
		return TIPO[tipo] ?? TIPO.editou;
	}
</script>

<ol class="edicoes-timeline">
	{#each items as it, i}
		{@const c = cfg(it.tipo)}
		{@const isExpanded = expanded.has(i)}
		{@const hasDiff = !!(it.diff && it.diff.length > 0)}
		{@const isLast = i === items.length - 1}
		<li class="edicao-item" class:is-last={isLast}>
			{#if !isLast}
				<span class="edicao-conector" aria-hidden="true"></span>
			{/if}
			<span class="edicao-dot" style="background:{c.color}; box-shadow: 0 0 0 3px {c.color}1F;">
				<Icon name={c.icon} size={14} stroke={2.3} />
			</span>
			<div class="edicao-body">
				<div class="edicao-cabecalho">
					<strong class="edicao-label">
						{c.label}{#if it.descricao}<span class="edicao-descricao"> · {it.descricao}</span
							>{/if}
					</strong>
					{#if it.papel === 'servidor'}
						<span class="bdg bdg-info edicao-bdg">Servidor</span>
					{:else if it.papel === 'chefia'}
						<span class="bdg bdg-purple edicao-bdg">Chefia</span>
					{/if}
				</div>
				<div class="edicao-meta">{it.autor} · {it.quando}</div>

				{#if hasDiff}
					{@const n = it.diff!.length}
					<button
						type="button"
						class="edicao-toggle"
						onclick={() => toggle(i)}
						aria-expanded={isExpanded}
					>
						<Icon name={isExpanded ? 'chevD' : 'chevR'} size={13} />
						{n}
						{n === 1 ? 'campo alterado' : 'campos alterados'}
					</button>

					{#if isExpanded}
						<div class="edicao-diff">
							{#each it.diff! as d, j}
								<div class="edicao-diff-row" class:not-first={j > 0}>
									<div class="kicker edicao-diff-campo">{d.campo}</div>
									<div class="edicao-diff-grid">
										<div
											class="edicao-diff-de"
											class:mono={d.mono}
										>
											{d.de}
										</div>
										<Icon name="arrowR" size={14} />
										<div
											class="edicao-diff-para"
											class:mono={d.mono}
										>
											{d.para}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.edicoes-timeline {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.edicao-item {
		display: flex;
		gap: 14px;
		position: relative;
		padding-bottom: 18px;
	}
	.edicao-item.is-last {
		padding-bottom: 0;
	}

	.edicao-conector {
		position: absolute;
		left: 13px;
		top: 28px;
		bottom: 0;
		width: 2px;
		background: var(--c-divider);
	}

	.edicao-dot {
		width: 28px;
		height: 28px;
		border-radius: 14px;
		color: white;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		z-index: 1;
	}

	.edicao-body {
		flex: 1;
		padding-top: 2px;
	}

	.edicao-cabecalho {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.edicao-label {
		font-size: 13.5px;
		color: var(--c-ink);
	}
	.edicao-descricao {
		font-weight: 500;
		color: var(--c-ink-2);
	}

	.edicao-bdg {
		font-size: 10.5px;
	}

	.edicao-meta {
		font-size: 12px;
		color: var(--c-muted);
		margin-top: 2px;
	}

	.edicao-toggle {
		margin-top: 8px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 0;
		padding: 0;
		color: var(--c-primary);
		font-size: 12.5px;
		font-weight: 600;
		cursor: pointer;
	}

	.edicao-diff {
		margin-top: 10px;
		background: var(--c-surface-2);
		border-radius: var(--r-md);
		border: 1px solid var(--c-border);
		padding: 14px;
	}

	.edicao-diff-row.not-first {
		padding-top: 12px;
		border-top: 1px solid var(--c-divider);
		margin-top: 12px;
	}

	.edicao-diff-campo {
		margin-bottom: 6px;
		font-size: 10.5px;
	}

	.edicao-diff-grid {
		display: grid;
		grid-template-columns: 1fr 16px 1fr;
		gap: 10px;
		align-items: center;
	}

	.edicao-diff-de {
		padding: 8px 10px;
		background: var(--c-danger-soft);
		color: var(--c-ink-2);
		border-radius: var(--r-sm);
		font-size: 12.5px;
		line-height: 1.4;
		text-decoration: line-through;
		text-decoration-color: color-mix(in srgb, var(--c-danger) 40%, transparent);
	}

	.edicao-diff-para {
		padding: 8px 10px;
		background: var(--c-success-soft);
		color: var(--c-ink);
		border-radius: var(--r-sm);
		font-size: 12.5px;
		line-height: 1.4;
		font-weight: 500;
	}

	.mono {
		font-family: var(--ff-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
	}
</style>
