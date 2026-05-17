import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

const BACKEND_URL =
	env.PUBLIC_BACKEND_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app';

/**
 * POST /api/logout — limpa cookie do portal e (best-effort) avisa o backend.
 * Sempre redireciona 303 para /, mesmo se o backend estiver offline.
 */
export const POST: RequestHandler = async ({ cookies, fetch }) => {
	const token = cookies.get('access_token');
	if (token) {
		try {
			await fetch(`${BACKEND_URL}/auth/logout`, {
				method: 'POST',
				headers: { Cookie: `access_token=${token}` },
			});
		} catch {
			// backend offline — segue limpando localmente
		}
	}
	cookies.delete('access_token', { path: '/' });
	redirect(303, '/');
};
