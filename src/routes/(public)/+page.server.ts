import type { PageServerLoad } from './$types';
import { getFeaturedProducts } from '$lib/cms/content';

export const load: PageServerLoad = async () => {
	const featuredProducts = await getFeaturedProducts();
	return {
		featuredProducts: featuredProducts.slice(0, 3)
	};
};
