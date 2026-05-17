import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ConformidadeTimeline from './ConformidadeTimeline.svelte';

describe('ConformidadeTimeline', () => {
	it('renderiza 6 etapas do ciclo', () => {
		render(ConformidadeTimeline);
		expect(screen.getByText('Pactuação bilateral')).toBeInTheDocument();
		expect(screen.getByText('Execução')).toBeInTheDocument();
		expect(screen.getByText('Registro de execução')).toBeInTheDocument();
		expect(screen.getByText('Avaliação')).toBeInTheDocument();
		expect(screen.getByText('Recurso')).toBeInTheDocument();
		expect(screen.getByText('Envio à API Central')).toBeInTheDocument();
	});

	it('exibe prazos das etapas com prazo legal', () => {
		render(ConformidadeTimeline);
		expect(screen.getAllByText('10 dias').length).toBeGreaterThan(0);
		expect(screen.getByText('20 dias')).toBeInTheDocument();
		expect(screen.getByText('automático')).toBeInTheDocument();
	});

	it('referencia artigos do decreto e IN', () => {
		render(ConformidadeTimeline);
		expect(screen.getByText(/Decreto 11.072\/2022 · Art. 11/)).toBeInTheDocument();
		expect(screen.getByText(/IN 24\/2023 · Art. 33/)).toBeInTheDocument();
	});

	it('numera as etapas de 1 a 6', () => {
		const { container } = render(ConformidadeTimeline);
		const nums = container.querySelectorAll('.num');
		expect(nums).toHaveLength(6);
		expect(nums[0].textContent?.trim()).toBe('1');
		expect(nums[5].textContent?.trim()).toBe('6');
	});
});
