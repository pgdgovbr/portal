import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';

function makeEvent(user: unknown) {
	return {
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server (landing) — load', () => {
	it('usuário anônimo: retorna {} (renderiza landing pública)', async () => {
		const result = await load(makeEvent(null));
		expect(result).toEqual({});
	});

	it('usuário logado: redireciona para /app', async () => {
		await expect(
			load(makeEvent({ id: 1, role: 'servidor', name: 'Marta', email: 'marta@x.gov.br' }))
		).rejects.toMatchObject({ status: 302, location: '/app' });
	});
});
