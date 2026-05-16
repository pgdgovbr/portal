import { load } from './+page.server';

// Backend retorna shape do schema atual; o server map para o formato do componente
const mockBackendNotif = {
	id: '1',
	tipoEvento: 'AVALIACAO_REALIZADA',
	conteudo: 'Você tem uma avaliação para realizar.',
	enviada: true,
	enviadaEm: '2025-05-01T08:00:00Z',
	createdAt: '2025-05-01T08:00:00Z',
};

function makeFetchWith(data: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data, errors: null }),
		})
	);
}

function makeEvent() {
	return {
		cookies: { get: vi.fn().mockReturnValue('fake-token') },
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server — load (notificacoes)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('with notifications → mapeia para shape { id, titulo, corpo, lida, criadaEm }', async () => {
		makeFetchWith({ minhasNotificacoes: [mockBackendNotif] });

		const result = (await load(makeEvent())) as {
			notificacoes: { id: string; titulo: string; corpo: string; lida: boolean }[];
		};

		expect(result.notificacoes).toHaveLength(1);
		expect(result.notificacoes[0].id).toBe('1');
		// AVALIACAO_REALIZADA é traduzido pelo server
		expect(result.notificacoes[0].titulo).toMatch(/avalia/i);
		expect(result.notificacoes[0].corpo).toBe(mockBackendNotif.conteudo);
		expect(result.notificacoes[0].lida).toBe(true); // enviadaEm preenchida
	});

	it('empty list → returns { notificacoes: [] }', async () => {
		makeFetchWith({ minhasNotificacoes: [] });

		const result = await load(makeEvent());

		expect(result).toEqual({ notificacoes: [] });
	});

	it('fetch throws → returns { notificacoes: [] }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeEvent());

		expect(result).toEqual({ notificacoes: [] });
	});
});
