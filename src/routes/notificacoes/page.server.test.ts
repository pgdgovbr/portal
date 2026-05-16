import { load } from './+page.server';

const mockNotif = {
	id: '1',
	titulo: 'Avaliação pendente',
	corpo: 'Você tem uma avaliação para realizar.',
	lida: false,
	criadaEm: '2025-05-01T08:00:00Z',
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

	it('with notifications → returns { notificacoes: [mockNotif] }', async () => {
		makeFetchWith({ minhasNotificacoes: [mockNotif] });

		const result = await load(makeEvent());

		expect(result).toEqual({ notificacoes: [mockNotif] });
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
