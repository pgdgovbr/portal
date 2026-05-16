import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RevisarPage from './+page.svelte';
import * as navigation from '$app/navigation';

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

// Guard contra regressão "silent success" no callMutation (PR #8 review):
// se o backend devolver 500/401 sem JSON válido, a página NÃO pode redirecionar
// para /equipe?assinou=ok como se tivesse sucedido — tem que exibir erro.
describe('/equipe/planos-trabalho/[id]/revisar — tratamento de erro HTTP', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	});

	function stubFetch500() {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', {
					status: 500,
					headers: { 'Content-Type': 'text/plain' }
				})
			)
		);
	}

	it('assinar() com fetch 500 NÃO chama goto e exibe banner de erro', async () => {
		stubFetch500();
		const { container } = render(RevisarPage, { props: { data: makeData() } });

		// O AssinaturaCard exige 3 checkboxes confirmados antes do botão habilitar.
		const checks = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		for (const c of checks) await fireEvent.click(c);

		await fireEvent.click(screen.getByRole('button', { name: /Assinar e ativar plano/i }));
		await new Promise((r) => setTimeout(r, 10));

		expect(global.fetch).toHaveBeenCalled();
		expect(navigation.goto).not.toHaveBeenCalled();
		// Banner de erro com role="alert"
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();

		vi.unstubAllGlobals();
	});

	it('confirmarDevolver() com fetch 500 NÃO chama goto e exibe banner de erro', async () => {
		stubFetch500();
		render(RevisarPage, { props: { data: makeData() } });

		// Abre confirmação inline
		await fireEvent.click(screen.getByRole('button', { name: /Devolver para ajustes/i }));
		await fireEvent.click(screen.getByRole('button', { name: /Sim, ajustar e devolver/i }));
		await new Promise((r) => setTimeout(r, 10));

		expect(global.fetch).toHaveBeenCalled();
		expect(navigation.goto).not.toHaveBeenCalled();
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();

		vi.unstubAllGlobals();
	});
});
