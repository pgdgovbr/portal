import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import EditarChefiaPage from './+page.svelte';

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidateAll: vi.fn()
}));

vi.mock('$lib/graphql', () => ({
	gqlFetch: vi.fn(async () => ({ editarPlanoTrabalho: { id: '42', status: 2 } }))
}));

function makePlano(over: Record<string, unknown> = {}) {
	return {
		id: '42',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: 'p-99',
		status: 'AGUARDANDO_ASSINATURA_CHEFIA',
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'Cumprir prazos',
		planoEntregasId: null,
		contribuicoes: [
			{ id: 'c1', descricao: 'Entrega X', percentualContribuicao: 100 }
		],
		dataAssinaturaParticipante: '2026-05-12T15:00:00Z',
		dataAssinaturaChefia: null,
		criadoPorRole: 'servidor',
		...over
	};
}

function makeData(over: Record<string, unknown> = {}) {
	return {
		user: null,
		plano: makePlano(),
		historico: [],
		participanteNome: 'Lucas Pereira',
		...over
	} as any;
}

describe('/equipe/planos-trabalho/[id]/editar +page.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renderiza título com nome do participante', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		expect(
			screen.getByRole('heading', { name: /Ajustando plano de Lucas Pereira/i })
		).toBeInTheDocument();
	});

	it('renderiza breadcrumb com link para /equipe', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		expect(screen.getByRole('link', { name: /^Equipe$/ })).toHaveAttribute('href', '/equipe');
	});

	it('renderiza cards de período, modalidade, contribuições e critérios', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		expect(screen.getByTestId('card-periodo')).toBeInTheDocument();
		expect(screen.getByTestId('card-modalidade')).toBeInTheDocument();
		expect(screen.getByTestId('card-contribuicoes')).toBeInTheDocument();
		expect(screen.getByTestId('card-criterios')).toBeInTheDocument();
	});

	it('renderiza inputs editáveis preenchidos com valores do plano', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		const inicio = screen.getByLabelText(/Início/i) as HTMLInputElement;
		const fim = screen.getByLabelText(/Fim/i) as HTMLInputElement;
		const carga = screen.getByLabelText(/Carga horária/i) as HTMLInputElement;
		expect(inicio.value).toBe('2026-08-01');
		expect(fim.value).toBe('2027-01-31');
		expect(carga.value).toBe('30');
	});

	it('renderiza CTA "Assinar e enviar" (presente no OwnershipBanner e no card final)', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		const botoes = screen.getAllByRole('button', { name: /Assinar e enviar/i });
		expect(botoes.length).toBeGreaterThan(0);
	});

	it('renderiza contribuições do plano', () => {
		render(EditarChefiaPage, { props: { data: makeData() } });
		expect(screen.getByText('Entrega X')).toBeInTheDocument();
	});

	it('quando plano é null, mostra mensagem de não encontrado', () => {
		render(EditarChefiaPage, { props: { data: { plano: null, historico: [], participanteNome: '' } as any } });
		expect(screen.getByText(/Plano não encontrado/i)).toBeInTheDocument();
	});
});
