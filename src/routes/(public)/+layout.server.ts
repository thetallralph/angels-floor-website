import { loadCmsOverrides } from '$lib/cms/load';
import { pageIdFromPath } from '$lib/cms/pages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const pageId = pageIdFromPath(url.pathname);
	if (!pageId) {
		return { cms: { text: {}, image: {}, gallery: {} } };
	}
	const cms = await loadCmsOverrides(pageId);
	return { cms };
};
