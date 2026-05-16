import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

const BACKEND_URL = env.PUBLIC_BACKEND_URL ?? 'https://pgd-libre-klvx64dufq-rj.a.run.app';

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
		redirect(302, '/');
	}

	const token = event.cookies.get('access_token');
	const path = event.url.pathname;

	if (!token && !path.startsWith('/auth')) {
		redirect(302, `${BACKEND_URL}/auth/login/google`);
	}

	return resolve(event);
};
