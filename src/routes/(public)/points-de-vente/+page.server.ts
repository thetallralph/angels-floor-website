import type { PageServerLoad } from './$types';
import { loadSalesPointsFromPB } from '$lib/cms/salesPoints';

export const load: PageServerLoad = async () => {
	const salesPoints = await loadSalesPointsFromPB();
	return { salesPoints };
};
