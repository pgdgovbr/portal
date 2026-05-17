import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import AIRewritePanel from './AIRewritePanel.svelte';

const baseProps = () => ({
	originalText: 'Trabalhei na migração e fiz reuniões. ' + 'Mais texto para passar dos 80 chars facilmente.',
	registroId: undefined as string | undefined,
	onApply: vi.fn(),
	onCancel: vi.fn(),
});

function mockFetchOk(body: object, status = 200, headers: Record<string, string> = {}) {
	const res = new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
	vi.stubGlobal('fetch', vi.fn(async () => res));
}

beforeEach(() => {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () => new Response('{}', { status: 200 })),
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('AIRewritePanel — render inicial', () => {
	it('renderiza header "Reescrever com IA" e badge BETA', () => {
		render(AIRewritePanel, { props: baseProps() });
		expect(screen.getByText(/Reescrever com IA/i)).toBeInTheDocument();
		expect(screen.getByText(/BETA/i)).toBeInTheDocument();
	});

	it('mostra os 4 templates como opções selecionáveis', () => {
		render(AIRewritePanel, { props: baseProps() });
		// pelo menos uma ocorrência de cada nome no DOM
		expect(screen.getAllByText(/Por entrega/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/Cronológico/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/Por contribuição do plano/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/STAR/i).length).toBeGreaterThan(0);
	});

	it('pré-preenche o textarea de "Instrução adicional"', () => {
		const { container } = render(AIRewritePanel, { props: baseProps() });
		const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
		expect(textarea.value.length).toBeGreaterThan(50);
	});

	it('o accordion "Ver prompt do sistema" começa fechado', () => {
		render(AIRewritePanel, { props: baseProps() });
		// `<details>` sem `open` → texto do prompt não visível
		const details = document.querySelector('details') as HTMLDetailsElement;
		expect(details.open).toBe(false);
	});

	it('botão "Reescrever" está habilitado por padrão (template entrega)', () => {
		render(AIRewritePanel, { props: baseProps() });
		const btn = screen.getByRole('button', { name: /^Reescrever$/i });
		expect(btn).not.toBeDisabled();
	});

	it('botão "Cancelar" chama onCancel', async () => {
		const props = baseProps();
		render(AIRewritePanel, { props });
		const btn = screen.getByRole('button', { name: /Cancelar/i });
		await fireEvent.click(btn);
		expect(props.onCancel).toHaveBeenCalled();
	});
});

describe('AIRewritePanel — fluxo editing → previewing', () => {
	it('clicar em Reescrever dispara POST /api/ai/rewrite-registro com payload correto', async () => {
		const fetchSpy = vi.fn(
			async () =>
				new Response(
					JSON.stringify({
						event_id: '00000000-0000-0000-0000-000000000001',
						rewritten_text: 'ENTREGA 1\n  Resultado: ok',
						latency_ms: 1500,
						tokens_in: 100,
						tokens_out: 200,
					}),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
		);
		vi.stubGlobal('fetch', fetchSpy);

		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));

		await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
		const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
		const [url, init] = call;
		expect(url).toBe('/api/ai/rewrite-registro');
		const body = JSON.parse(init.body as string);
		expect(body.template_id).toBe('entrega');
		expect(body.texto_atual.length).toBeGreaterThan(80);
	});

	it('após resposta da API mostra "Proposta da IA" com o texto retornado', async () => {
		mockFetchOk({
			event_id: 'evt-1',
			rewritten_text: 'ENTREGA 1\n  Resultado: ok',
			latency_ms: 1000,
			tokens_in: 100,
			tokens_out: 200,
		});
		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() => expect(screen.getByText(/Proposta da IA/i)).toBeInTheDocument());
		expect(screen.getByText(/ENTREGA 1/)).toBeInTheDocument();
		expect(screen.getAllByText(/Texto atual/i).length).toBeGreaterThan(0);
	});

	it('alerta amarelo aparece quando resposta contém [precisa de detalhe]', async () => {
		mockFetchOk({
			event_id: 'evt-1',
			rewritten_text: 'ENTREGA 1\n  Volume: [quantificar]\n  Pendência: [precisa de detalhe]',
			latency_ms: 1000,
			tokens_in: 100,
			tokens_out: 200,
		});
		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() => expect(screen.getByText(/lacunas marcadas/i)).toBeInTheDocument());
	});
});

describe('AIRewritePanel — aplicar reescrita', () => {
	it('"Aplicar reescrita" chama onApply com texto+eventId', async () => {
		mockFetchOk({
			event_id: 'evt-42',
			rewritten_text: 'Texto reescrito final',
			latency_ms: 1000,
			tokens_in: 100,
			tokens_out: 200,
		});
		const props = baseProps();
		render(AIRewritePanel, { props });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() => screen.getByText(/Proposta da IA/i));

		// Mock segundo fetch para POST applied
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
		);
		await fireEvent.click(screen.getByRole('button', { name: /Aplicar reescrita/i }));
		await waitFor(() => expect(props.onApply).toHaveBeenCalled());
		expect(props.onApply).toHaveBeenCalledWith('Texto reescrito final', 'evt-42');
	});

	it('"Refinar" volta para o estado editing preservando template', async () => {
		mockFetchOk({
			event_id: 'evt-1',
			rewritten_text: 'reescrito',
			latency_ms: 1000,
			tokens_in: 100,
			tokens_out: 200,
		});
		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() => screen.getByText(/Proposta da IA/i));
		await fireEvent.click(screen.getByRole('button', { name: /Refinar/i }));
		// De volta para editing: vê textarea de instrução de novo
		await waitFor(() =>
			expect(screen.getByText(/Template de estrutura/i)).toBeInTheDocument(),
		);
	});
});

describe('AIRewritePanel — erros HTTP', () => {
	it('429 mostra mensagem de rate limit', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(
				async () =>
					new Response(JSON.stringify({ detail: 'limite' }), {
						status: 429,
						headers: { 'Retry-After': '300', 'Content-Type': 'application/json' },
					}),
			),
		);
		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() =>
			expect(screen.getByText(/reescritas desta hora/i)).toBeInTheDocument(),
		);
	});

	it('503 mostra mensagem de IA indisponível', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('{}', { status: 503 })),
		);
		render(AIRewritePanel, { props: baseProps() });
		await fireEvent.click(screen.getByRole('button', { name: /^Reescrever$/i }));
		await waitFor(() =>
			expect(screen.getByText(/IA demorou demais|temporariamente indispon/i)).toBeInTheDocument(),
		);
	});
});
