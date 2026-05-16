import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RevisarPage from './+page.svelte';
import * as navigation from '$app/navigation';

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	preloadCode: vi.fn(),
	preloadData: vi.fn(),
	pushState: vi.fn(),
	replaceState: vi.fn(),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn(),
	onNavigate: vi.fn()
}));

const basePlano = {
	id: 'pt-1',
	idPlanoTrabalho: 'PT-2026-08',
	participanteId: 'p-99',
	status: 'AGUARDANDO_ASSINATURA_PARTICIPANTE' as const,
	dataInicio: '2026-08-01',
	dataTermino: '2027-01-31',
	cargaHorariaDisponivel: 30,
	criteriosAvaliacao: 'novo',
	contribuicoes: [
		{ id: 'c1', descricao: 'Contribuição A', percentualContribuicao: 60, tipoContribuicao: 1 },
		{ id: 'c2', descricao: 'Contribuição B', percentualContribuicao: 40, tipoContribuicao: 2 }
	],
	dataAssinaturaParticipante: null,
	dataAssinaturaChefia: '2026-05-14T16:08:00Z',
	modalidade: 'TELETRABALHO_PARCIAL',
	unidadeAutorizadoraNome: 'SEGES/MGI',
	participante: {
		id: 'p-99',
		nome: 'Lucas Pereira',
		matriculaSiape: '2840193',
		email: 'lucas@pgd-demo.gov.br'
	}
};

const baseDiff = [
	{ campo: 'criterios_avaliacao', de: 'antigo', para: 'novo', mono: false }
];

function makeData(over: Record<string, unknown> = {}) {
	return {
		user: { id: 1, email: 'lucas@pgd-demo.gov.br', name: 'Lucas Pereira', role: 'servidor' },
		plano: basePlano,
		historico: [],
		diff: baseDiff,
		chefiaNome: 'Carlos Mendes',
		...over
	};
}

// Stub fetch para as mutations
function stubMutationOk() {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			new Response(JSON.stringify({ data: { assinarPt: {}, editarPlanoTrabalho: {} } }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			})
		)
	);
}

describe('/meu-plano/[id]/revisar (+page.svelte)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renderiza OwnershipBanner variant comigo-revisor', () => {
		render(RevisarPage, { props: { data: makeData() } });
		// O OwnershipBanner do variant comigo-revisor tem título "Aguardando sua assinatura"
		expect(screen.getByText(/Aguardando sua assinatura/i)).toBeInTheDocument();
	});

	it('cita o nome da chefia no banner', () => {
		render(RevisarPage, { props: { data: makeData() } });
		// O banner menciona o atorOutro (Carlos Mendes)
		const matches = screen.getAllByText(/Carlos Mendes/);
		expect(matches.length).toBeGreaterThan(0);
	});

	it('renderiza card "A chefia ajustou X campos" com a contagem do diff', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByText(/A chefia ajustou 1 campo/i)).toBeInTheDocument();
	});

	it('renderiza AssinaturaCard (com 3 checkboxes)', () => {
		const { container } = render(RevisarPage, { props: { data: makeData() } });
		const checks = container.querySelectorAll('input[type="checkbox"]');
		expect(checks.length).toBe(3);
	});

	it('renderiza card "Status das assinaturas" com chefia assinada', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByRole('heading', { name: /Status das assinaturas/i })).toBeInTheDocument();
		// chefia tem nome
		const matches = screen.getAllByText(/Carlos Mendes/);
		expect(matches.length).toBeGreaterThan(0);
	});

	it('click em "Devolver para ajustes" mostra confirmação inline', async () => {
		render(RevisarPage, { props: { data: makeData() } });
		await fireEvent.click(screen.getByRole('button', { name: /Devolver para ajustes/i }));
		expect(screen.getByText(/zerar a assinatura/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Sim, ajustar/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Não/i })).toBeInTheDocument();
	});

	it('confirmação positiva chama mutation editarPlanoTrabalho e redireciona para /editar', async () => {
		stubMutationOk();
		render(RevisarPage, { props: { data: makeData() } });

		await fireEvent.click(screen.getByRole('button', { name: /Devolver para ajustes/i }));
		await fireEvent.click(screen.getByRole('button', { name: /Sim, ajustar/i }));

		// Tempo pra promise resolver
		await new Promise((r) => setTimeout(r, 10));

		const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
		expect(fetchMock).toHaveBeenCalled();
		const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
		expect(callBody.query).toMatch(/editarPlanoTrabalho/);
		expect(navigation.goto).toHaveBeenCalledWith('/meu-plano/pt-1/editar');

		vi.unstubAllGlobals();
	});

	it('click em "Não" cancela a confirmação', async () => {
		render(RevisarPage, { props: { data: makeData() } });
		await fireEvent.click(screen.getByRole('button', { name: /Devolver para ajustes/i }));
		expect(screen.getByText(/zerar a assinatura/i)).toBeInTheDocument();
		await fireEvent.click(screen.getByRole('button', { name: /^Não/i }));
		expect(screen.queryByText(/zerar a assinatura/i)).not.toBeInTheDocument();
	});

	it('click em "Assinar e ativar plano" (após 3 checks) chama mutation assinarPt', async () => {
		stubMutationOk();
		const { container } = render(RevisarPage, { props: { data: makeData() } });

		const checks = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		for (const c of checks) await fireEvent.click(c);

		await fireEvent.click(screen.getByRole('button', { name: /Assinar e ativar plano/i }));
		await new Promise((r) => setTimeout(r, 10));

		const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
		expect(fetchMock).toHaveBeenCalled();
		const callBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
		expect(callBody.query).toMatch(/assinarPt/);
		expect(navigation.goto).toHaveBeenCalled();

		vi.unstubAllGlobals();
	});

	it('renderiza contribuições no modo leitura', () => {
		render(RevisarPage, { props: { data: makeData() } });
		expect(screen.getByText('Contribuição A')).toBeInTheDocument();
		expect(screen.getByText('Contribuição B')).toBeInTheDocument();
	});

	it('sem diff (chefia não alterou) NÃO renderiza card amarelo', () => {
		render(RevisarPage, { props: { data: makeData({ diff: [] }) } });
		expect(screen.queryByText(/A chefia ajustou/i)).not.toBeInTheDocument();
	});
});
