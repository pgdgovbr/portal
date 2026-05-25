import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import CicloTimelineMobile from './CicloTimelineMobile.svelte';

describe('CicloTimelineMobile', () => {
	it('renderiza 4 etapas (condensação do handoff)', () => {
		const { container } = render(CicloTimelineMobile);
		const etapas = container.querySelectorAll('.etapa');
		expect(etapas.length).toBe(4);
	});

	it('cada etapa tem título, prazo e descrição', () => {
		const { container } = render(CicloTimelineMobile);
		const etapas = container.querySelectorAll('.etapa');
		etapas.forEach((etapa) => {
			expect(etapa.querySelector('.titulo')).toBeTruthy();
			expect(etapa.querySelector('.prazo')).toBeTruthy();
			expect(etapa.querySelector('.desc')).toBeTruthy();
		});
	});

	it('bolinhas estão numeradas de 1 a 4', () => {
		const { container } = render(CicloTimelineMobile);
		const bolinhas = container.querySelectorAll('.bolinha');
		const numeros = Array.from(bolinhas).map((b) => b.textContent?.trim());
		expect(numeros).toEqual(['1', '2', '3', '4']);
	});

	it('exibe as etapas chave da norma', () => {
		render(CicloTimelineMobile);
		expect(screen.getByText('Pactuação')).toBeInTheDocument();
		expect(screen.getByText('Execução & Registro')).toBeInTheDocument();
		expect(screen.getByText('Avaliação')).toBeInTheDocument();
		expect(screen.getByText('Sincronização API Central')).toBeInTheDocument();
	});
});
