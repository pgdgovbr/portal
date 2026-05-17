import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

const BACKEND_URL =
	env.PUBLIC_BACKEND_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app';

/**
 * GET /api/demo-login?email=...&name=...&role=...
 *
 * Endpoint server-side que delega para o backend `/auth/dev-login` e seta
 * o cookie `access_token` no domínio do próprio portal (cross-domain entre
 * Cloud Run subdomains não funciona).
 *
 * Funciona como link tradicional — UX progressive enhanced, mas sem JS.
 */
export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const email = url.searchParams.get('email');
	const name = url.searchParams.get('name') ?? '';
	const role = url.searchParams.get('role');

	if (!email || !role) {
		error(400, 'email e role obrigatórios');
	}

	const params = new URLSearchParams({ email, name, role });
	let res: Response;
	try {
		res = await fetch(`${BACKEND_URL}/auth/dev-login?${params}`, {
			method: 'POST',
		});
	} catch {
		error(503, 'Backend indisponível');
	}

	if (!res.ok) {
		// 403 vem de produção; 400 de role inválida; outros — repassar mensagem
		error(res.status, await res.text().catch(() => 'Falha ao fazer login demo'));
	}

	const data = await res.json();
	const token: string | undefined = data?.token;
	if (!token) error(502, 'Resposta do backend sem token');

	cookies.set('access_token', token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 8,
	});

	redirect(303, '/app');
};
