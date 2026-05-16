import type {
	DiffItem,
	TimelineEntry,
	TimelineTipo,
	TimelinePapel
} from './components/EdicoesTimeline.svelte';

/**
 * Estrutura mínima de um evento de auditoria vindo da query `historicoPlanoTrabalho`.
 * Segue o type `AuditLogEntryType` definido em `schema.graphql`.
 */
export interface AuditLogEntry {
	id: number;
	tableName: string;
	recordId: string;
	action: string; // CREATE | UPDATE | DELETE
	userId?: number | null;
	userEmail?: string | null;
	oldValues?: Record<string, unknown> | null;
	newValues?: Record<string, unknown> | null;
	createdAt: string; // ISO
}

export interface TimelineContexto {
	participanteEmail: string;
	chefiaEmail?: string;
}

/**
 * Campos do PlanoTrabalho exibidos no diff "humano".
 * Tudo o que não estiver aqui é ignorado para evitar barulho na UI.
 *
 * Nota: `trabalho_noturno` existe no audit log do backend mas não está
 * exposto via GraphQL (não está em `PlanoTrabalhoType`). Não incluímos
 * aqui para não gerar diff falso ao comparar com o estado atual do plano.
 */
const CAMPOS_PLANO: Record<string, { mono?: boolean; label?: string }> = {
	data_inicio: {},
	data_termino: {},
	carga_horaria_disponivel: { mono: true },
	criterios_avaliacao: {}
};

/**
 * Mapeia (action, new_values.acao, new_values.status) → tipo de timeline.
 */
function mapTipo(ev: AuditLogEntry): TimelineTipo {
	if (ev.action === 'CREATE') return 'criou';

	const acao = ev.newValues?.['acao'];
	const status = ev.newValues?.['status'];

	if (ev.action === 'UPDATE') {
		if (acao === 'enviar_para_outro_lado') return 'enviou';
		if (acao === 'assinar') {
			// status 3 = EM_EXECUCAO (ver STATUS_PLANO_INT em types.ts)
			if (status === 3) return 'pactuou';
			return 'assinou';
		}
		if (acao === 'devolver') return 'devolveu';
	}
	return 'editou';
}

function mapPapel(ev: AuditLogEntry, ctx: TimelineContexto): TimelinePapel {
	if (ev.userEmail && ctx.chefiaEmail && ev.userEmail === ctx.chefiaEmail) {
		return 'chefia';
	}
	// Default: trata como servidor (participante ou desconhecido)
	return 'servidor';
}

function serializeValue(v: unknown): string {
	if (v === null || v === undefined) return '—';
	if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
	if (typeof v === 'number') return String(v);
	if (typeof v === 'string') return v;
	try {
		return JSON.stringify(v);
	} catch {
		return String(v);
	}
}

function valuesEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a === 'number' && typeof b === 'number') return a === b;
	return serializeValue(a) === serializeValue(b);
}

function buildDiff(ev: AuditLogEntry): DiffItem[] {
	const old = ev.oldValues ?? {};
	const novo = ev.newValues ?? {};
	const out: DiffItem[] = [];
	for (const campo of Object.keys(CAMPOS_PLANO)) {
		const cfg = CAMPOS_PLANO[campo];
		// Ignora se o campo não aparece em nenhum dos lados
		if (!(campo in old) && !(campo in novo)) continue;
		const a = old[campo];
		const b = novo[campo];
		if (valuesEqual(a, b)) continue;
		out.push({
			campo,
			de: serializeValue(a),
			para: serializeValue(b),
			mono: !!cfg.mono
		});
	}
	return out;
}

const MESES_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/**
 * Formata um instante ISO/Date como "DD mmm · HH:mm" em PT-BR.
 * Usa Intl quando disponível, com fallback manual.
 */
export function formatarQuandoPtBr(iso: string | Date): string {
	const d = iso instanceof Date ? iso : new Date(iso);
	if (Number.isNaN(d.getTime())) return '';
	try {
		const dia = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(d);
		const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d).replace(/\.$/, '');
		const hora = new Intl.DateTimeFormat('pt-BR', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		}).format(d);
		return `${dia} ${mes} · ${hora}`;
	} catch {
		const dia = String(d.getDate()).padStart(2, '0');
		const mes = MESES_PT[d.getMonth()];
		const hh = String(d.getHours()).padStart(2, '0');
		const mm = String(d.getMinutes()).padStart(2, '0');
		return `${dia} ${mes} · ${hh}:${mm}`;
	}
}

function nomeAutor(ev: AuditLogEntry): string {
	if (!ev.userEmail) return 'sistema';
	return ev.userEmail;
}

/**
 * Retorna o snapshot (newValues) do último evento de auditoria com
 * `acao === 'enviar_para_outro_lado'`. Quando `filter.userEmail` é passado,
 * restringe-se a eventos daquele autor (útil para isolar "última submissão do servidor").
 *
 * Retorna `null` se não houver tal evento.
 */
export function obterUltimaSubmissao(
	events: AuditLogEntry[],
	filter?: { userEmail?: string }
): Record<string, unknown> | null {
	for (let i = events.length - 1; i >= 0; i--) {
		const ev = events[i];
		if (ev.action !== 'UPDATE') continue;
		if (ev.newValues?.['acao'] !== 'enviar_para_outro_lado') continue;
		if (filter?.userEmail && ev.userEmail !== filter.userEmail) continue;
		return (ev.newValues ?? {}) as Record<string, unknown>;
	}
	return null;
}

/**
 * Mapeamento camelCase (frontend / GraphQL) → snake_case (audit values).
 * Usado para comparar o snapshot da última submissão com o estado atual do plano.
 *
 * Mantemos só campos efetivamente expostos pelo `PlanoTrabalhoType` no GraphQL —
 * `trabalho_noturno` existe no audit log mas não é selecionável, então ignoramos.
 */
const CAMPO_FRONT_TO_AUDIT: Record<string, string> = {
	dataInicio: 'data_inicio',
	dataTermino: 'data_termino',
	cargaHorariaDisponivel: 'carga_horaria_disponivel',
	criteriosAvaliacao: 'criterios_avaliacao'
};

/**
 * Compara o snapshot da última submissão (audit log) com o estado atual do plano
 * (camelCase, vindo da query GraphQL) e devolve a lista de campos que mudaram.
 *
 * Os campos no resultado mantêm os nomes do audit (snake_case) para consistência
 * com `auditEventsToTimeline` / `EdicoesTimeline`.
 */
export function calcularDiffDesdeUltimaSubmissao(
	events: AuditLogEntry[],
	planoAtual: Record<string, unknown>,
	filter?: { userEmail?: string }
): DiffItem[] {
	const snap = obterUltimaSubmissao(events, filter);
	if (!snap) return [];
	const out: DiffItem[] = [];
	for (const [campoFront, campoAudit] of Object.entries(CAMPO_FRONT_TO_AUDIT)) {
		const cfg = CAMPOS_PLANO[campoAudit];
		if (!cfg) continue;
		const a = snap[campoAudit];
		const b = planoAtual[campoFront];
		// Se o campo não existe no snapshot, não conseguimos saber se mudou — ignora.
		if (!(campoAudit in snap)) continue;
		if (b === undefined) continue;
		if (valuesEqual(a, b)) continue;
		out.push({
			campo: campoAudit,
			de: serializeValue(a),
			para: serializeValue(b),
			mono: !!cfg.mono
		});
	}
	return out;
}

/**
 * Procura no audit log o último evento `enviar_para_outro_lado` cujo autor
 * NÃO é o próprio participante — ou seja, o envio da chefia de volta para
 * o servidor (na revisão).
 *
 * Retorna `{ email }` da chefia que enviou, ou `null` se não houver tal evento.
 *
 * Importante: usamos o audit log porque `listarParticipantes` não diz quem é
 * "a chefia" — qualquer heurística baseada em "primeiro participante diferente"
 * é frágil em ambientes reais com várias pessoas.
 */
export function obterChefiaQueEnviou(
	events: AuditLogEntry[],
	participanteEmail: string
): { email: string } | null {
	for (let i = events.length - 1; i >= 0; i--) {
		const ev = events[i];
		if (ev.action !== 'UPDATE') continue;
		if (ev.newValues?.['acao'] !== 'enviar_para_outro_lado') continue;
		if (!ev.userEmail) continue;
		if (ev.userEmail === participanteEmail) continue;
		return { email: ev.userEmail };
	}
	return null;
}

/**
 * Converte uma lista de eventos de auditoria em entradas da timeline de edições.
 * A ordem dos eventos de entrada é preservada.
 */
export function auditEventsToTimeline(
	events: AuditLogEntry[],
	ctx: TimelineContexto
): TimelineEntry[] {
	return events.map((ev) => {
		const tipo = mapTipo(ev);
		const diff = buildDiff(ev);
		const entry: TimelineEntry = {
			tipo,
			papel: mapPapel(ev, ctx),
			autor: nomeAutor(ev),
			quando: formatarQuandoPtBr(ev.createdAt)
		};
		if (diff.length > 0) entry.diff = diff;
		return entry;
	});
}
