import type { PageServerLoad } from './$types';
import { loadSalesPointsFromPB } from '$lib/cms/salesPoints';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ url }) => {
	const salesPoints = await loadSalesPointsFromPB(localeFromUrl(url));
	return { salesPoints };
};
