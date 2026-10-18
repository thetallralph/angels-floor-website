import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

const COOKIE_NAME = 'guide_access';

export const load: PageServerLoad = ({ cookies }) => {
	// Sans GUIDE_PASSWORD, le guide reste fermé : aucun mot de passe par défaut.
	const configured = Boolean(env.GUIDE_PASSWORD);
	const hasAccess = configured && cookies.get(COOKIE_NAME) === 'granted';
	return { hasAccess, configured };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		if (!env.GUIDE_PASSWORD) {
			return { error: 'Guide désactivé : mot de passe non configuré.' };
		}

		const data = await request.formData();
		const password = data.get('password')?.toString().trim();

		if (password !== env.GUIDE_PASSWORD) {
			return { error: 'Mot de passe incorrect' };
		}

		cookies.set(COOKIE_NAME, 'granted', {
			path: '/guide-gestion',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		// Recharge le guide sur son adresse propre (sans « ?/login »).
		redirect(303, '/guide-gestion');
	}
};
