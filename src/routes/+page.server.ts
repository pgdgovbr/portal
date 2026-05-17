import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Landing pública. Se já houver sessão, vai direto para o app.
 */
export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user) redirect(302, '/app');
	return {};
};
