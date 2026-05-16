import { describe, it, expect } from 'vitest';
import { urgencyClass, urgencyLabel, initialsFrom, NOTAS } from './types';

describe('urgencyClass', () => {
	it('retorna urg-late para daysLeft negativo', () => {
		expect(urgencyClass(-1)).toBe('urg-late');
		expect(urgencyClass(-10)).toBe('urg-late');
	});

	it('retorna urg-late para daysLeft zero (hoje = vencido)', () => {
		expect(urgencyClass(0)).toBe('urg-late');
	});

	it('retorna urg-warn para daysLeft entre 1 e 7 inclusive', () => {
		expect(urgencyClass(1)).toBe('urg-warn');
		expect(urgencyClass(7)).toBe('urg-warn');
	});

	it('retorna urg-ok para daysLeft maior que 7', () => {
		expect(urgencyClass(8)).toBe('urg-ok');
		expect(urgencyClass(30)).toBe('urg-ok');
	});
});

describe('urgencyLabel', () => {
	it('retorna texto com "vencido" para daysLeft negativo', () => {
		expect(urgencyLabel(-3)).toMatch(/vencido/i);
	});

	it('retorna texto com "hoje" ou "vence hoje" para daysLeft zero', () => {
		expect(urgencyLabel(0)).toMatch(/hoje/i);
	});

	it('retorna texto com número de dias para daysLeft positivo', () => {
		const label = urgencyLabel(5);
		expect(label).toMatch(/5/);
		expect(label).toMatch(/dia/i);
	});

	it('retorna texto com número de dias para daysLeft = 1', () => {
		const label = urgencyLabel(1);
		expect(label).toMatch(/1/);
	});
});

describe('initialsFrom', () => {
	it('retorna as duas primeiras letras de nome + sobrenome', () => {
		expect(initialsFrom('Ana Beatriz Costa')).toBe('AC');
	});

	it('retorna as duas primeiras letras de nome único (sem espaço)', () => {
		expect(initialsFrom('Felipe')).toBe('FE');
	});

	it('retorna ?? para string vazia', () => {
		expect(initialsFrom('')).toBe('??');
	});

	it('retorna ?? para apenas espaços', () => {
		expect(initialsFrom('   ')).toBe('??');
	});

	it('funciona com nomes com múltiplas palavras', () => {
		expect(initialsFrom('Carlos Eduardo Mendes Silva')).toBe('CS');
	});
});

describe('NOTAS', () => {
	it('nota 1 tem label Excepcional', () => {
		expect(NOTAS[1].label).toBe('Excepcional');
	});

	it('nota 2 tem label Alto desempenho', () => {
		expect(NOTAS[2].label).toBe('Alto desempenho');
	});

	it('nota 3 tem label Adequado', () => {
		expect(NOTAS[3].label).toBe('Adequado');
	});

	it('nota 4 tem label Insuficiente', () => {
		expect(NOTAS[4].label).toBe('Insuficiente');
	});

	it('nota 5 tem label Insatisfatório', () => {
		expect(NOTAS[5].label).toBe('Insatisfatório');
	});

	it('nota 2 tem color verde', () => {
		expect(NOTAS[2].color).toBe('#168821');
	});

	it('nota 1 tem color verde-escuro', () => {
		expect(NOTAS[1].color).toBe('#0C4A1A');
	});

	it('nota 5 tem color vermelho', () => {
		expect(NOTAS[5].color).toBe('#B91C1C');
	});

	it('todas as 5 notas existem', () => {
		for (let n = 1; n <= 5; n++) {
			expect(NOTAS[n as 1 | 2 | 3 | 4 | 5]).toBeDefined();
			expect(NOTAS[n as 1 | 2 | 3 | 4 | 5].label).toBeTruthy();
			expect(NOTAS[n as 1 | 2 | 3 | 4 | 5].color).toBeTruthy();
		}
	});
});
