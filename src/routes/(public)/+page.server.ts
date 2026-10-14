import type { PageServerLoad } from './$types';
import { getFeaturedProducts } from '$lib/cms/content';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ url }) => {
	const featuredProducts = await getFeaturedProducts(localeFromUrl(url));
	return {
		featuredProducts: featuredProducts.slice(0, 3)
	};
};
