import type { PageServerLoad } from './$types';
import { loadTrainingsFromPB } from '$lib/cms/trainings';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ url }) => {
	const trainings = await loadTrainingsFromPB(localeFromUrl(url));
	return { trainings };
};
