import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

const BACKEND_URL =
	env.PUBLIC_BACKEND_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app';
const DEMO_MODE = env.PUBLIC_DEMO_MODE !== 'false';

export const load: PageServerLoad = async ({ parent, url, fetch }) => {
	const { user } = await parent();
	if (user) redirect(302, '/app');

	const next = url.searchParams.get('next') ?? '/app';

	// Em produção real (PUBLIC_DEMO_MODE=false), redireciona direto para Gov.br.
	if (!DEMO_MODE) {
		redirect(302, `${BACKEND_URL}/auth/login/govbr`);
	}

	let personas: unknown[] = [];
	try {
		const res = await fetch(`${BACKEND_URL}/auth/personas-demo`);
		if (res.ok) personas = await res.json();
	} catch {
		// Backend offline: tela renderiza vazia
	}

	return { next, personas };
};
