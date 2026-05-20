import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadTrainingBySlug, loadTrainingsFromPB } from '$lib/cms/trainings';

export const load: PageServerLoad = async ({ params }) => {
	const training = await loadTrainingBySlug(params.slug);
	if (!training) throw error(404, 'Formation introuvable');

	const all = await loadTrainingsFromPB();
	const related = all
		.filter((t) => t.id !== training.id && t.category === training.category)
		.slice(0, 3);

	return { training, related };
};
