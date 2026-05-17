import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

/**
 * Rotas públicas — não exigem autenticação:
 *   /            → landing pública (institucional)
 *   /login       → escolha de persona demo ou redirect Gov.br
 *   /api/demo-login → endpoint server que chama backend dev-login
 *   /auth/*      → callbacks OAuth do backend (sempre liberado)
 *
 * Qualquer outra rota sem cookie `access_token` redireciona para
 * `/login?next=<path>` — preserva intenção pra retornar após login.
 */
const PUBLIC_PATHS = new Set(['/', '/login']);

function isPublicPath(path: string): boolean {
	if (PUBLIC_PATHS.has(path)) return true;
	if (path.startsWith('/auth/') || path === '/auth') return true;
	if (path.startsWith('/api/demo-login')) return true;
	if (path.startsWith('/api/logout')) return true;
	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	// OAuth callback: backend passa o JWT como ?token= porque cookies cross-domain
	// não funcionam entre subdomínios distintos de *.a.run.app.
	const queryToken = event.url.searchParams.get('token');
	if (queryToken) {
		event.cookies.set('access_token', queryToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 8,
		});
		redirect(302, '/app');
	}

	const token = event.cookies.get('access_token');
	const path = event.url.pathname;

	if (!token && !isPublicPath(path)) {
		redirect(302, `/login?next=${encodeURIComponent(path)}`);
	}

	return resolve(event);
};
