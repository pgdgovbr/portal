import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import EdicoesTimeline from './EdicoesTimeline.svelte';
import type { TimelineEntry } from './EdicoesTimeline.svelte';

const baseItems: TimelineEntry[] = [
	{ tipo: 'criou', papel: 'servidor', autor: 'Lucas Ramos', quando: '01 mai · 09:00' },
	{
		tipo: 'editou',
		papel: 'servidor',
		autor: 'Lucas Ramos',
		quando: '02 mai · 14:30',
		descricao: 'ajustou contribuições',
		diff: [
			{ campo: 'carga_horaria_disponivel', de: '40h', para: '36h', mono: true },
			{ campo: 'data_termino', de: '30/11/2026', para: '20/12/2026' }
		]
	},
	{
		tipo: 'assinou',
		papel: 'servidor',
		autor: 'Lucas Ramos',
		quando: '03 mai · 10:15'
	},
	{
		tipo: 'enviou',
		papel: 'servidor',
		autor: 'Lucas Ramos',
		quando: '03 mai · 10:16'
	},
	{
		tipo: 'devolveu',
		papel: 'chefia',
		autor: 'Carlos Souza',
		quando: '04 mai · 16:00'
	},
	{
		tipo: 'pactuou',
		papel: 'chefia',
		autor: 'Carlos Souza',
		quando: '05 mai · 11:00'
	}
];

describe('EdicoesTimeline — render dos tipos', () => {
	it('renderiza um item por tipo', () => {
		render(EdicoesTimeline, { props: { items: baseItems } });
		expect(screen.getByText(/Criou plano/i)).toBeInTheDocument();
		expect(screen.getByText(/Editou/i)).toBeInTheDocument();
		expect(screen.getByText(/Assinou/i)).toBeInTheDocument();
		expect(screen.getByText(/Devolveu para ajustes/i)).toBeInTheDocument();
		expect(screen.getByText(/Enviou para revisão/i)).toBeInTheDocument();
		expect(screen.getByText(/Pactuação concluída/i)).toBeInTheDocument();
	});

	it('renderiza autor e data de cada item', () => {
		render(EdicoesTimeline, { props: { items: baseItems } });
		const lucasOcurrencias = screen.getAllByText(/Lucas Ramos/);
		expect(lucasOcurrencias.length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText(/01 mai · 09:00/).length).toBeGreaterThanOrEqual(1);
	});

	it('exibe badge "Servidor" para papel=servidor', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[0]] } });
		expect(screen.getByText(/Servidor/)).toBeInTheDocument();
	});

	it('exibe badge "Chefia" para papel=chefia', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[4]] } });
		expect(screen.getByText(/Chefia/)).toBeInTheDocument();
	});

	it('renderiza lista como <ol>', () => {
		const { container } = render(EdicoesTimeline, { props: { items: baseItems } });
		expect(container.querySelector('ol')).not.toBeNull();
	});
});

describe('EdicoesTimeline — diff', () => {
	it('item com diff exibe contador "N campos alterados"', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[1]] } });
		expect(screen.getByText(/2 campos alterados/i)).toBeInTheDocument();
	});

	it('item com 1 campo alterado mostra "1 campo alterado" (singular)', () => {
		const item: TimelineEntry = {
			tipo: 'editou',
			papel: 'servidor',
			autor: 'Lucas',
			quando: '01 mai',
			diff: [{ campo: 'data_inicio', de: '01/05', para: '02/05' }]
		};
		render(EdicoesTimeline, { props: { items: [item] } });
		expect(screen.getByText(/1 campo alterado\b/i)).toBeInTheDocument();
	});

	it('diff fica colapsado por padrão (não exibe valores)', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[1]] } });
		expect(screen.queryByText('40h')).toBeNull();
		expect(screen.queryByText('36h')).toBeNull();
	});

	it('click no botão expande o diff revelando os valores', async () => {
		render(EdicoesTimeline, { props: { items: [baseItems[1]] } });
		const toggle = screen.getByRole('button', { name: /2 campos alterados/i });
		await fireEvent.click(toggle);
		expect(screen.getByText('40h')).toBeInTheDocument();
		expect(screen.getByText('36h')).toBeInTheDocument();
		expect(screen.getByText('30/11/2026')).toBeInTheDocument();
		expect(screen.getByText('20/12/2026')).toBeInTheDocument();
	});

	it('click no botão duas vezes colapsa o diff de novo', async () => {
		render(EdicoesTimeline, { props: { items: [baseItems[1]] } });
		const toggle = screen.getByRole('button', { name: /2 campos alterados/i });
		await fireEvent.click(toggle);
		await fireEvent.click(toggle);
		expect(screen.queryByText('40h')).toBeNull();
	});

	it('defaultExpanded abre o item indicado já no render', () => {
		render(EdicoesTimeline, { props: { items: baseItems, defaultExpanded: 1 } });
		expect(screen.getByText('40h')).toBeInTheDocument();
	});

	it('item sem diff não renderiza o botão "campos alterados"', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[0]] } });
		expect(screen.queryByRole('button', { name: /campos alterados/i })).toBeNull();
	});
});

describe('EdicoesTimeline — descricao opcional', () => {
	it('item com descricao exibe-a junto do label', () => {
		render(EdicoesTimeline, { props: { items: [baseItems[1]] } });
		expect(screen.getByText(/ajustou contribuições/)).toBeInTheDocument();
	});
});

describe('EdicoesTimeline — items vazios', () => {
	it('renderiza sem erro quando items é lista vazia', () => {
		const { container } = render(EdicoesTimeline, { props: { items: [] } });
		expect(container.querySelector('ol')).not.toBeNull();
	});
});
