import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gqlFetch } from './graphql';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

function mockFetchOk(data: unknown, errors?: unknown[]) {
	return vi.fn().mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue({ data, errors })
	});
}

function mockFetchStatus(status: number) {
	return vi.fn().mockResolvedValue({ ok: false, status });
}

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('gqlFetch', () => {
	it('successful request returns data', async () => {
		const expected = { me: { id: '1', name: 'Test' } };
		vi.stubGlobal('fetch', mockFetchOk(expected));

		const result = await gqlFetch<typeof expected>('query Me { me { id name } }');

		expect(result).toEqual(expected);
	});

	it('HTTP 500 throws error with "GraphQL request failed"', async () => {
		vi.stubGlobal('fetch', mockFetchStatus(500));

		await expect(gqlFetch('query { me { id } }')).rejects.toThrow('GraphQL request failed: 500');
	});

	it('GraphQL errors in response throws with error message', async () => {
		vi.stubGlobal('fetch', mockFetchOk(null, [{ message: 'Unauthorized' }]));

		await expect(gqlFetch('query { me { id } }')).rejects.toThrow('Unauthorized');
	});

	it('with token includes Cookie header', async () => {
		const fetchMock = mockFetchOk({ me: null });
		vi.stubGlobal('fetch', fetchMock);

		await gqlFetch('query { me { id } }', {}, 'my-token');

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect((init.headers as Record<string, string>)['Cookie']).toBe('access_token=my-token');
	});

	it('without token does not include Cookie header', async () => {
		const fetchMock = mockFetchOk({ me: null });
		vi.stubGlobal('fetch', fetchMock);

		await gqlFetch('query { me { id } }');

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect((init.headers as Record<string, string>)['Cookie']).toBeUndefined();
	});
});
