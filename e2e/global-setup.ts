import { test as setup, expect } from '@playwright/test';
import path from 'path';

const BACKEND = 'http://localhost:8000';

const USERS = [
	{
		file: 'e2e/auth/servidor.json',
		email: 'servidor@test.pgd',
		name: 'Ana Beatriz Costa',
		role: 'servidor',
	},
	{
		file: 'e2e/auth/chefe.json',
		email: 'chefe@test.pgd',
		name: 'Carlos Mendes',
		role: 'chefe_imediato',
	},
	{
		file: 'e2e/auth/gestor.json',
		email: 'gestor@test.pgd',
		name: 'Marina Gestora',
		role: 'gestor_unidade',
	},
	{
		file: 'e2e/auth/admin.json',
		email: 'admin@test.pgd',
		name: 'Pedro Admin',
		role: 'admin',
	},
];

for (const u of USERS) {
	setup(`criar auth state — ${u.role}`, async ({ page, context }) => {
		// Chama o endpoint dev-login do backend
		const res = await page.request.post(`${BACKEND}/auth/dev-login`, {
			params: { email: u.email, name: u.name, role: u.role },
		});
		expect(res.ok(), `dev-login falhou para ${u.role}: ${await res.text()}`).toBe(true);

		// O backend já define o cookie access_token na resposta
		// Salva o estado de auth para ser reutilizado pelos testes
		await context.storageState({ path: u.file });
	});
}
