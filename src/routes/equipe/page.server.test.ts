import { describe, it, expect, vi, afterEach } from 'vitest';
import { load, derivarAcaoChefia } from './+page.server';

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? undefined : undefined),
	};
}

function makeLoadEvent(token?: string) {
	return {
		cookies: makeCookies(token),
	} as unknown as Parameters<typeof load>[0];
}

function makeFetchMock(payload: Record<string, unknown>) {
	return vi.fn(async () =>
		new Response(JSON.stringify({ data: payload, errors: null }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	);
}

// Backend returns matriculaSiape (not siape)
const mockPInput = { id: '1', nome: 'João Silva', matriculaSiape: '123456', email: 'joao@gov.br' };
// Load function adds siape alias and planosTrabalho
const mockPOutput = { ...mockPInput, siape: '123456', planosTrabalho: [] };

describe('+page.server (equipe) — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('com participantes → retorna { participantes } com siape e planosTrabalho', async () => {
		vi.stubGlobal(
			'fetch',
			makeFetchMock({ listarParticipantes: [mockPInput], listarPlanosTrabalho: [] })
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({
			participantes: [mockPOutput],
			pendentesChefia: 0,
			primeiroPendenteId: null,
		});
	});

	it('lista vazia → retorna { participantes: [] }', async () => {
		vi.stubGlobal(
			'fetch',
			makeFetchMock({ listarParticipantes: [], listarPlanosTrabalho: [] })
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({ participantes: [], pendentesChefia: 0, primeiroPendenteId: null });
	});

	it('gqlFetch lança erro → fallback seguro com listas/contadores zerados', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({ participantes: [], pendentesChefia: 0, primeiroPendenteId: null });
	});

	it('sem token → gqlFetch chamado com undefined; retorna resultado do servidor', async () => {
		const fetchMock = makeFetchMock({ listarParticipantes: [mockPInput], listarPlanosTrabalho: [] });
		vi.stubGlobal('fetch', fetchMock);

		const result = await load(makeLoadEvent(undefined));

		expect(fetchMock).toHaveBeenCalledOnce();

		const callArgs = fetchMock.mock.calls[0] as unknown[];
		const headers = (callArgs[1] as RequestInit).headers as Record<string, string>;
		expect(headers['Cookie']).toBeUndefined();

		expect(result).toMatchObject({ participantes: [mockPOutput] });
	});

	it('mapeia status novos (RASCUNHO_PARTICIPANTE, AGUARDANDO_ASSINATURA_CHEFIA) e calcula acao', async () => {
		vi.stubGlobal(
			'fetch',
			makeFetchMock({
				listarParticipantes: [mockPInput, { ...mockPInput, id: '2', nome: 'Maria', matriculaSiape: '999' }],
				listarPlanosTrabalho: [
					{ id: 'pt-a', participanteId: '1', status: 2, dataInicio: '2026-01-01', dataTermino: '2026-06-01', contribuicoes: [] },
					{ id: 'pt-b', participanteId: '2', status: 5, dataInicio: '2026-01-01', dataTermino: '2026-06-01', contribuicoes: [] },
				],
			})
		);

		const result = (await load(makeLoadEvent('fake-token'))) as any;
		const p1 = result.participantes.find((p: any) => p.id === '1');
		const p2 = result.participantes.find((p: any) => p.id === '2');
		expect(p1.planosTrabalho[0].status).toBe('AGUARDANDO_ASSINATURA_CHEFIA');
		expect(p1.planosTrabalho[0].acao).toBe('assinar');
		expect(p2.planosTrabalho[0].status).toBe('RASCUNHO_PARTICIPANTE');
		expect(p2.planosTrabalho[0].acao).toBe('aguardar');
		expect(result.pendentesChefia).toBe(1);
		expect(result.primeiroPendenteId).toBe('pt-a');
	});

	it('pendentesChefia conta múltiplos PTs aguardando assinatura', async () => {
		vi.stubGlobal(
			'fetch',
			makeFetchMock({
				listarParticipantes: [mockPInput, { ...mockPInput, id: '2' }, { ...mockPInput, id: '3' }],
				listarPlanosTrabalho: [
					{ id: 'pt-a', participanteId: '1', status: 2, dataInicio: '2026-01-01', dataTermino: '2026-06-01', contribuicoes: [] },
					{ id: 'pt-b', participanteId: '2', status: 2, dataInicio: '2026-01-01', dataTermino: '2026-06-01', contribuicoes: [] },
					{ id: 'pt-c', participanteId: '3', status: 3, dataInicio: '2026-01-01', dataTermino: '2026-06-01', contribuicoes: [] },
				],
			})
		);

		const result = (await load(makeLoadEvent('fake-token'))) as any;
		expect(result.pendentesChefia).toBe(2);
		expect(result.primeiroPendenteId).toBe('pt-a'); // primeiro encontrado na flatMap
	});
});

describe('derivarAcaoChefia', () => {
	it('AGUARDANDO_ASSINATURA_CHEFIA → "assinar"', () => {
		expect(derivarAcaoChefia('AGUARDANDO_ASSINATURA_CHEFIA')).toBe('assinar');
	});
	it('RASCUNHO_CHEFIA → "assinar"', () => {
		expect(derivarAcaoChefia('RASCUNHO_CHEFIA')).toBe('assinar');
	});
	it('RASCUNHO_PARTICIPANTE → "aguardar"', () => {
		expect(derivarAcaoChefia('RASCUNHO_PARTICIPANTE')).toBe('aguardar');
	});
	it('AGUARDANDO_ASSINATURA_PARTICIPANTE → "aguardar"', () => {
		expect(derivarAcaoChefia('AGUARDANDO_ASSINATURA_PARTICIPANTE')).toBe('aguardar');
	});
	it('EM_EXECUCAO → "ver"', () => {
		expect(derivarAcaoChefia('EM_EXECUCAO')).toBe('ver');
	});
	it('null → "aguardar"', () => {
		expect(derivarAcaoChefia(null)).toBe('aguardar');
	});
});
