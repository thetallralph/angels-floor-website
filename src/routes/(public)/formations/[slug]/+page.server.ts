import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadTrainingBySlug, loadTrainingsFromPB } from '$lib/cms/trainings';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = localeFromUrl(url);
	const training = await loadTrainingBySlug(params.slug, locale);
	if (!training) throw error(404, locale === 'en' ? 'Training not found' : 'Formation introuvable');

	const all = await loadTrainingsFromPB(locale);
	const related = all
		.filter((t) => t.id !== training.id && t.category === training.category)
		.slice(0, 3);

	return { training, related };
};
