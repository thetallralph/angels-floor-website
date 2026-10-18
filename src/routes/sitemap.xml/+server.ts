import type { RequestHandler } from './$types';
import { loadProducts } from '$lib/cms/content';
import { loadTrainingsFromPB } from '$lib/cms/trainings';
import { LOCALES, localizeHref } from '$lib/i18n/routing';

/** Public pages, by French path (the English URL is derived via `localizeHref`). */
const STATIC_PAGES = [
	'/',
	'/produits',
	'/formations',
	'/points-de-vente',
	'/grossistes',
	'/a-propos',
	'/impact',
	'/contact',
	'/cgv',
	'/mentions-legales'
];

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One <url> per language, each listing every language version as an alternate. */
function urlEntries(origin: string, frPath: string): string {
	const alternates = LOCALES.map(
		(l) =>
			`<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(origin + localizeHref(frPath, l))}"/>`
	).join('');
	return LOCALES.map(
		(l) => `<url><loc>${escapeXml(origin + localizeHref(frPath, l))}</loc>${alternates}</url>`
	).join('\n');
}

export const GET: RequestHandler = async ({ url }) => {
	const [products, trainings] = await Promise.all([
		loadProducts().catch(() => []),
		loadTrainingsFromPB().catch(() => [])
	]);

	const paths = [
		...STATIC_PAGES,
		...products.map((p) => `/produits/${p.slug}`),
		...trainings.map((t) => `/formations/${t.slug}`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map((p) => urlEntries(url.origin, p)).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
