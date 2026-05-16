import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';

type Role = 'servidor' | 'chefe' | 'gestor' | 'admin';

function authFile(role: Role) {
	return `e2e/auth/${role}.json`;
}

// Cria variantes do `test` com storageState pré-carregado por papel
export const asServidor = base.extend<{ page: Page }>({
	storageState: authFile('servidor'),
});

export const asChefe = base.extend<{ page: Page }>({
	storageState: authFile('chefe'),
});

export const asGestor = base.extend<{ page: Page }>({
	storageState: authFile('gestor'),
});

export const asAdmin = base.extend<{ page: Page }>({
	storageState: authFile('admin'),
});

export { expect };
