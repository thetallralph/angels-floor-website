import { redirect, type Handle } from '@sveltejs/kit';
import { localeFromPath, localizeHref } from '$lib/i18n/routing';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname, search } = event.url;
	const locale = localeFromPath(pathname);

	// `/en/produits/x` (French segment under /en) → `/en/products/x`.
	if (locale === 'en') {
		const translated = localizeHref(pathname.slice('/en'.length), 'en');
		if (translated.startsWith('/en/') && translated !== pathname) {
			redirect(301, translated + search);
		}
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
};
