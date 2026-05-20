import { loadCmsOverrides } from '$lib/cms/load';
import { pageIdFromPath } from '$lib/cms/pages';
import { loadCategoriesFromPB } from '$lib/cms/categories';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const pageId = pageIdFromPath(url.pathname);
	const [cms, categories] = await Promise.all([
		pageId ? loadCmsOverrides(pageId) : Promise.resolve({ text: {}, image: {}, gallery: {} }),
		loadCategoriesFromPB()
	]);

	const footerCategories = categories
		.filter((c) => c.published !== false)
		.map((c) => ({ slug: c.slug, name: c.name }));

	return { cms, footerCategories };
};
