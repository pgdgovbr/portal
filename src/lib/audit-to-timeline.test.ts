import { describe, it, expect } from 'vitest';
import {
	auditEventsToTimeline,
	formatarQuandoPtBr,
	type AuditLogEntry
} from './audit-to-timeline';

const contexto = {
	participanteEmail: 'lucas@pgd-demo.gov.br',
	chefiaEmail: 'carlos@pgd-demo.gov.br'
};

function makeEvent(over: Partial<AuditLogEntry>): AuditLogEntry {
	return {
		id: 1,
		tableName: 'plano_trabalho',
		recordId: 'PT-1',
		action: 'UPDATE',
		userId: 1,
		userEmail: contexto.participanteEmail,
		oldValues: null,
		newValues: null,
		createdAt: '2026-05-01T09:00:00Z',
		...over
	};
}

describe('auditEventsToTimeline — mapeamento de tipo', () => {
	it('CREATE → tipo "criou"', () => {
		const ev = makeEvent({ action: 'CREATE' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('criou');
	});

	it('UPDATE + acao=enviar_para_outro_lado → tipo "enviou"', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			newValues: { acao: 'enviar_para_outro_lado' }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('enviou');
	});

	it('UPDATE + acao=assinar + status=3 (EM_EXECUCAO) → "pactuou"', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			newValues: { acao: 'assinar', status: 3 }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('pactuou');
	});

	it('UPDATE + acao=assinar (status != 3) → "assinou"', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			newValues: { acao: 'assinar', status: 2 }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('assinou');
	});

	it('UPDATE outros (ex.: editar campos) → "editou"', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { data_inicio: '2026-05-01' },
			newValues: { data_inicio: '2026-06-01' }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('editou');
	});

	it('UPDATE + acao=devolver → "devolveu"', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			newValues: { acao: 'devolver' }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.tipo).toBe('devolveu');
	});
});

describe('auditEventsToTimeline — papel', () => {
	it('email do participante → papel=servidor', () => {
		const ev = makeEvent({ userEmail: 'lucas@pgd-demo.gov.br', action: 'CREATE' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.papel).toBe('servidor');
	});

	it('email da chefia → papel=chefia', () => {
		const ev = makeEvent({ userEmail: 'carlos@pgd-demo.gov.br', action: 'UPDATE' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.papel).toBe('chefia');
	});

	it('email desconhecido cai como servidor por padrão', () => {
		const ev = makeEvent({ userEmail: 'random@gov.br', action: 'UPDATE' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.papel).toBe('servidor');
	});
});

describe('auditEventsToTimeline — autor', () => {
	it('usa userEmail como autor por padrão', () => {
		const ev = makeEvent({ userEmail: 'lucas@pgd-demo.gov.br' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.autor).toBe('lucas@pgd-demo.gov.br');
	});

	it('autor "sistema" quando userEmail ausente', () => {
		const ev = makeEvent({ userEmail: null });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.autor.toLowerCase()).toContain('sistema');
	});
});

describe('auditEventsToTimeline — diff de campos do plano', () => {
	it('diferença em data_inicio gera DiffItem', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { data_inicio: '2026-05-01' },
			newValues: { data_inicio: '2026-06-01' }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.diff).toEqual([
			{ campo: 'data_inicio', de: '2026-05-01', para: '2026-06-01', mono: false }
		]);
	});

	it('valor inalterado não gera diff', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { data_inicio: '2026-05-01' },
			newValues: { data_inicio: '2026-05-01' }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.diff ?? []).toEqual([]);
	});

	it('diff inclui apenas campos relevantes do plano', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: {
				data_inicio: '2026-05-01',
				carga_horaria_disponivel: 40,
				trabalho_noturno: false,
				criterios_avaliacao: 'antigo',
				data_termino: '2026-11-30',
				campo_irrelevante: 'foo'
			},
			newValues: {
				data_inicio: '2026-06-01',
				carga_horaria_disponivel: 36,
				trabalho_noturno: true,
				criterios_avaliacao: 'novo',
				data_termino: '2026-12-31',
				campo_irrelevante: 'bar'
			}
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		const campos = (t.diff ?? []).map((d) => d.campo);
		expect(campos).toContain('data_inicio');
		expect(campos).toContain('data_termino');
		expect(campos).toContain('carga_horaria_disponivel');
		expect(campos).toContain('criterios_avaliacao');
		expect(campos).toContain('trabalho_noturno');
		expect(campos).not.toContain('campo_irrelevante');
	});

	it('carga_horaria_disponivel é marcada como mono', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { carga_horaria_disponivel: 40 },
			newValues: { carga_horaria_disponivel: 36 }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		const item = (t.diff ?? []).find((d) => d.campo === 'carga_horaria_disponivel');
		expect(item?.mono).toBe(true);
	});

	it('valores numéricos são serializados em string', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { carga_horaria_disponivel: 40 },
			newValues: { carga_horaria_disponivel: 36 }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		const item = (t.diff ?? []).find((d) => d.campo === 'carga_horaria_disponivel');
		expect(item?.de).toBe('40');
		expect(item?.para).toBe('36');
	});

	it('booleanos são serializados como Sim/Não', () => {
		const ev = makeEvent({
			action: 'UPDATE',
			oldValues: { trabalho_noturno: false },
			newValues: { trabalho_noturno: true }
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		const item = (t.diff ?? []).find((d) => d.campo === 'trabalho_noturno');
		expect(item?.de).toMatch(/Não/);
		expect(item?.para).toMatch(/Sim/);
	});
});

describe('formatarQuandoPtBr', () => {
	it('formata "DD mmm · HH:mm" em PT-BR', () => {
		const s = formatarQuandoPtBr('2026-05-15T14:30:00Z');
		// Esperamos algo como "15 mai · 11:30" (depende do fuso)
		expect(s).toMatch(/^\d{2} [a-zç]{3,4} · \d{2}:\d{2}$/);
	});

	it('aceita Date também', () => {
		const s = formatarQuandoPtBr(new Date('2026-05-15T14:30:00Z'));
		expect(s).toMatch(/^\d{2} [a-zç]{3,4} · \d{2}:\d{2}$/);
	});
});

describe('auditEventsToTimeline — formatação do quando', () => {
	it('quando vem formatado em PT-BR (DD mmm · HH:mm)', () => {
		const ev = makeEvent({ createdAt: '2026-05-15T14:30:00Z' });
		const [t] = auditEventsToTimeline([ev], contexto);
		expect(t.quando).toMatch(/^\d{2} [a-zç]{3,4} · \d{2}:\d{2}$/);
	});
});

describe('auditEventsToTimeline — múltiplos eventos', () => {
	it('preserva a ordem dos eventos de entrada', () => {
		const events: AuditLogEntry[] = [
			makeEvent({ id: 1, action: 'CREATE', createdAt: '2026-05-01T09:00:00Z' }),
			makeEvent({ id: 2, action: 'UPDATE', createdAt: '2026-05-02T10:00:00Z' }),
			makeEvent({
				id: 3,
				action: 'UPDATE',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-03T11:00:00Z'
			})
		];
		const ts = auditEventsToTimeline(events, contexto);
		expect(ts.length).toBe(3);
		expect(ts[0].tipo).toBe('criou');
		expect(ts[1].tipo).toBe('editou');
		expect(ts[2].tipo).toBe('enviou');
	});
});
