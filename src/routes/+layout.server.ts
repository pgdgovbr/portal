import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

const GRAPHQL_URL = env.PUBLIC_GRAPHQL_URL ?? 'https://pgd-livre-klvx64dufq-rj.a.run.app/graphql';
const BACKEND_URL = env.PUBLIC_BACKEND_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app';

const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('access_token');
	if (!token) return { user: null };

	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `access_token=${token}`
			},
			body: JSON.stringify({ query: ME_QUERY })
		});

		if (!res.ok) {
			redirect(302, `${BACKEND_URL}/auth/login/google`);
		}

		const { data, errors } = await res.json();

		if (errors || !data?.me) {
			redirect(302, `${BACKEND_URL}/auth/login/google`);
		}

		return { user: data.me };
	} catch {
		redirect(302, `${BACKEND_URL}/auth/login/google`);
	}
};
