import { env } from '$env/dynamic/public';

const GRAPHQL_URL = env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app/graphql';

export async function gqlFetch<T = unknown>(
	query: string,
	variables: Record<string, unknown> = {},
	token?: string
): Promise<T> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (token) headers['Cookie'] = `access_token=${token}`;

	const res = await fetch(GRAPHQL_URL, {
		method: 'POST',
		headers,
		body: JSON.stringify({ query, variables })
	});

	if (!res.ok) {
		throw new Error(`GraphQL request failed: ${res.status}`);
	}

	const { data, errors } = await res.json();

	if (errors?.length) {
		throw new Error(errors[0].message);
	}

	return data as T;
}
