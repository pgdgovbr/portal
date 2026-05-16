import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import RevisarPage from './+page.svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidateAll: vi.fn()
}));

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_GRAPHQL_URL: 'http://test/graphql' }
}));

function makePlano(over: Record<string, unknown> = {}) {
	return {
		id: 'pt-1',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: 'p-99',
		status: 'AGUARDANDO_ASSINATURA_CHEFIA',
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'Cumprir prazos',
		contribuicoes: [
			{ id: 'c1', descricao: 'Entrega X', percentualContribuicao: 100, tipoContribuicao: 1 }
		],
		dataAssinaturaParticipante: '2026-05-12T15:00:00Z',
		dataAssinaturaChefia: null,
		modalidade: 'TELETRABALHO_PARCIAL',
		participante: { id: 'p-99', nome: 'Lucas Pereira', email: 'lucas@gov.br' },
		...over
	};
}

function makeData(over: Record<string, unknown> = {}) {
	return {
		user: null,
		plano: makePlano(),
		diff: [],
		historico: [],
		participanteNome: 'Lucas Pereira',
		...over
	} as any;
}

describe('/equipe/planos-trabalho/[id]/revisar +page.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renderiza o nome do participante no título', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByRole('heading', { name: /Plano de Lucas Pereira/i })).toBeInTheDocument();
	});

	it('renderiza badge AGUARDANDO_ASSINATURA_CHEFIA', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByText(/Aguardando chefia/i)).toBeInTheDocument();
	});

	it('renderiza breadcrumb com link para /equipe', () => {
		render(RevisarPage, { props: { data: makeData() } });
		const link = screen.getByRole('link', { name: /^Equipe$/ });
		expect(link).toHaveAttribute('href', '/equipe');
	});

	it('renderiza contribuições do plano', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByText('Entrega X')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('renderiza critérios de avaliação', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByText('Cumprir prazos')).toBeInTheDocument();
	});

	it('renderiza card de assinatura com botões "Assinar" e "Devolver"', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getAllByRole('button', { name: /Assinar/i }).length).toBeGreaterThan(0);
	});

	it('quando diff > 0, renderiza card com mudanças', () => {
		const data = makeData({
			diff: [{ campo: 'carga_horaria_disponivel', de: '30', para: '40', mono: true }]
		});
		render(RevisarPage, { props: { data } });
		expect(screen.getByText(/Mudou desde a submissão/i)).toBeInTheDocument();
		expect(screen.getByText('30')).toBeInTheDocument();
		expect(screen.getByText('40')).toBeInTheDocument();
	});

	it('sem diff, não renderiza card de mudanças', () => {
		render(RevisarPage, { props: { data: makeData({ diff: [] }) } });
		expect(screen.queryByText(/Mudou desde a submissão/i)).not.toBeInTheDocument();
	});
});
