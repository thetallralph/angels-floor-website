import type { PageServerLoad } from './$types';
import { loadTrainingsFromPB } from '$lib/cms/trainings';

export const load: PageServerLoad = async () => {
	const trainings = await loadTrainingsFromPB();
	return { trainings };
};
