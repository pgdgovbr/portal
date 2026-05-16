import { describe, it, expect } from 'vitest';
import {
	auditEventsToTimeline,
	formatarQuandoPtBr,
	obterUltimaSubmissao,
	calcularDiffDesdeUltimaSubmissao,
	obterChefiaQueEnviou,
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
				criterios_avaliacao: 'antigo',
				data_termino: '2026-11-30',
				campo_irrelevante: 'foo',
				// trabalho_noturno aparece no audit log mas não está no schema GraphQL,
				// então é deliberadamente ignorado pelo diff.
				trabalho_noturno: false
			},
			newValues: {
				data_inicio: '2026-06-01',
				carga_horaria_disponivel: 36,
				criterios_avaliacao: 'novo',
				data_termino: '2026-12-31',
				campo_irrelevante: 'bar',
				trabalho_noturno: true
			}
		});
		const [t] = auditEventsToTimeline([ev], contexto);
		const campos = (t.diff ?? []).map((d) => d.campo);
		expect(campos).toContain('data_inicio');
		expect(campos).toContain('data_termino');
		expect(campos).toContain('carga_horaria_disponivel');
		expect(campos).toContain('criterios_avaliacao');
		expect(campos).not.toContain('campo_irrelevante');
		expect(campos).not.toContain('trabalho_noturno');
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

describe('obterUltimaSubmissao', () => {
	it('retorna null se nenhum evento for envio para o outro lado', () => {
		const events: AuditLogEntry[] = [
			makeEvent({ id: 1, action: 'CREATE', newValues: { data_inicio: '2026-05-01' } }),
			makeEvent({ id: 2, action: 'UPDATE', newValues: { data_inicio: '2026-06-01' } })
		];
		expect(obterUltimaSubmissao(events)).toBeNull();
	});

	it('retorna newValues da última transição com acao=enviar_para_outro_lado', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				newValues: { acao: 'enviar_para_outro_lado', data_inicio: '2026-05-01' },
				createdAt: '2026-05-01T09:00:00Z'
			}),
			makeEvent({
				id: 2,
				action: 'UPDATE',
				newValues: { data_inicio: '2026-06-01' },
				createdAt: '2026-05-02T09:00:00Z'
			}),
			makeEvent({
				id: 3,
				action: 'UPDATE',
				newValues: { acao: 'enviar_para_outro_lado', data_inicio: '2026-07-01' },
				createdAt: '2026-05-03T09:00:00Z'
			})
		];
		const snap = obterUltimaSubmissao(events);
		expect(snap).not.toBeNull();
		expect(snap?.['data_inicio']).toBe('2026-07-01');
	});

	it('ignora evento de "enviar" feito pela chefia se filtrado por papel servidor', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: 'lucas@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado', data_inicio: '2026-05-01' },
				createdAt: '2026-05-01T09:00:00Z'
			}),
			makeEvent({
				id: 2,
				action: 'UPDATE',
				userEmail: 'carlos@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado', data_inicio: '2026-07-01' },
				createdAt: '2026-05-03T09:00:00Z'
			})
		];
		// Filtra apenas envios do servidor (participanteEmail)
		const snap = obterUltimaSubmissao(events, { userEmail: 'lucas@pgd-demo.gov.br' });
		expect(snap?.['data_inicio']).toBe('2026-05-01');
	});
});

describe('calcularDiffDesdeUltimaSubmissao', () => {
	const planoAtual = {
		dataInicio: '2026-06-01',
		dataTermino: '2026-12-31',
		cargaHorariaDisponivel: 36,
		criteriosAvaliacao: 'novo'
	};

	it('quando não há submissão anterior retorna lista vazia', () => {
		const diff = calcularDiffDesdeUltimaSubmissao([], planoAtual);
		expect(diff).toEqual([]);
	});

	it('compara o snapshot da última submissão com o plano atual', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				newValues: {
					acao: 'enviar_para_outro_lado',
					data_inicio: '2026-05-01',
					data_termino: '2026-12-31',
					carga_horaria_disponivel: 40,
					criterios_avaliacao: 'antigo',
					// trabalho_noturno está no audit mas não no schema — não deve gerar diff
					trabalho_noturno: false
				}
			})
		];
		const diff = calcularDiffDesdeUltimaSubmissao(events, planoAtual);
		const campos = diff.map((d) => d.campo);
		expect(campos).toContain('data_inicio');
		expect(campos).toContain('carga_horaria_disponivel');
		expect(campos).toContain('criterios_avaliacao');
		expect(campos).not.toContain('trabalho_noturno');
		expect(campos).not.toContain('data_termino');
	});

	it('valores iguais não aparecem no diff', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				newValues: {
					acao: 'enviar_para_outro_lado',
					data_inicio: '2026-06-01'
				}
			})
		];
		const diff = calcularDiffDesdeUltimaSubmissao(events, planoAtual);
		expect(diff.find((d) => d.campo === 'data_inicio')).toBeUndefined();
	});
});

describe('obterChefiaQueEnviou', () => {
	it('retorna null quando não há nenhum envio da chefia', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: 'lucas@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' }
			})
		];
		expect(obterChefiaQueEnviou(events, 'lucas@pgd-demo.gov.br')).toBeNull();
	});

	it('retorna email da chefia do último envio para o participante', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: 'lucas@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-01T09:00:00Z'
			}),
			makeEvent({
				id: 2,
				action: 'UPDATE',
				userEmail: 'carlos@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-02T10:00:00Z'
			})
		];
		const r = obterChefiaQueEnviou(events, 'lucas@pgd-demo.gov.br');
		expect(r).not.toBeNull();
		expect(r?.email).toBe('carlos@pgd-demo.gov.br');
	});

	it('ignora envios do próprio participante e pega último de outra pessoa', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: 'chefe-antigo@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-01T09:00:00Z'
			}),
			makeEvent({
				id: 2,
				action: 'UPDATE',
				userEmail: 'lucas@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-02T09:00:00Z'
			}),
			makeEvent({
				id: 3,
				action: 'UPDATE',
				userEmail: 'chefe-novo@pgd-demo.gov.br',
				newValues: { acao: 'enviar_para_outro_lado' },
				createdAt: '2026-05-03T09:00:00Z'
			})
		];
		const r = obterChefiaQueEnviou(events, 'lucas@pgd-demo.gov.br');
		expect(r?.email).toBe('chefe-novo@pgd-demo.gov.br');
	});

	it('ignora eventos sem userEmail', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: null,
				newValues: { acao: 'enviar_para_outro_lado' }
			})
		];
		expect(obterChefiaQueEnviou(events, 'lucas@pgd-demo.gov.br')).toBeNull();
	});

	it('ignora eventos que não sejam UPDATE com acao=enviar_para_outro_lado', () => {
		const events: AuditLogEntry[] = [
			makeEvent({
				id: 1,
				action: 'UPDATE',
				userEmail: 'carlos@pgd-demo.gov.br',
				newValues: { acao: 'assinar' }
			}),
			makeEvent({
				id: 2,
				action: 'CREATE',
				userEmail: 'carlos@pgd-demo.gov.br',
				newValues: {}
			})
		];
		expect(obterChefiaQueEnviou(events, 'lucas@pgd-demo.gov.br')).toBeNull();
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
