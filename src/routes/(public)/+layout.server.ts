import { loadCmsOverrides } from '$lib/cms/load';
import { pageIdFromPath } from '$lib/cms/pages';
import { loadCategoriesFromPB } from '$lib/cms/categories';
import { delocalizePath, localeFromUrl } from '$lib/i18n/routing';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const locale = localeFromUrl(url);
	const pageId = pageIdFromPath(delocalizePath(url.pathname));
	const [cms, categories] = await Promise.all([
		pageId ? loadCmsOverrides(pageId, locale) : Promise.resolve({ text: {}, image: {}, gallery: {} }),
		loadCategoriesFromPB(locale)
	]);

	const footerCategories = categories
		.filter((c) => c.published !== false)
		.map((c) => ({ slug: c.slug, name: c.name }));

	return { locale, cms, footerCategories };
};
