/**
 * Locale-aware URL helpers. Pure functions — safe to use in hooks, load
 * functions, scripts and components alike.
 *
 * French is the default locale and lives at the site root (`/produits`).
 * English lives under `/en` with translated first segments (`/en/products`).
 * The `reroute` hook maps English URLs back onto the French route tree, so
 * every page exists once in `src/routes/(public)`.
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

/** BCP 47 tags, for `Intl` formatting and `<html lang>`. */
export const LOCALE_TAGS: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' };

/** First path segment of each public page, French → English. */
const SEGMENTS_EN: Record<string, string> = {
	produits: 'products',
	formations: 'training',
	'points-de-vente': 'sales-points',
	grossistes: 'wholesale',
	'a-propos': 'about',
	impact: 'impact',
	contact: 'contact',
	cgv: 'terms',
	'mentions-legales': 'legal-notice',
	'404': '404'
};

const SEGMENTS_FR: Record<string, string> = Object.fromEntries(
	Object.entries(SEGMENTS_EN).map(([fr, en]) => [en, fr])
);

function splitHref(href: string): { path: string; suffix: string } {
	const i = href.search(/[?#]/);
	return i === -1 ? { path: href, suffix: '' } : { path: href.slice(0, i), suffix: href.slice(i) };
}

export function localeFromPath(pathname: string): Locale {
	return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

export function localeFromUrl(url: URL): Locale {
	return localeFromPath(url.pathname);
}

/**
 * Map a public URL path onto the French route tree: `/en/products/x` → `/produits/x`.
 * French paths are returned unchanged, and so are English paths whose first segment
 * isn't a known page (they 404 instead of exposing e.g. `/admin` under `/en`).
 * Used by the `reroute` hook.
 */
export function delocalizePath(pathname: string): string {
	if (localeFromPath(pathname) === 'fr') return pathname;
	const [first = '', ...rest] = pathname.slice('/en/'.length).split('/');
	if (!first) return '/';
	const fr = SEGMENTS_FR[first];
	return fr ? '/' + [fr, ...rest].join('/') : pathname;
}

/**
 * Turn a French site-internal href into its equivalent for `locale`:
 * `/produits/x?a=1#b` → `/en/products/x?a=1#b`.
 *
 * Anything that isn't a known public page (external URLs, `mailto:`, `#hash`,
 * `/admin`, `/api`, static assets…) is returned unchanged, so it is safe to
 * pass any href through it.
 */
export function localizeHref(href: string, locale: Locale): string {
	if (locale === DEFAULT_LOCALE || !href.startsWith('/') || href.startsWith('//')) return href;
	const { path, suffix } = splitHref(href);
	if (localeFromPath(path) === 'en') return href;
	const [first = '', ...rest] = path.slice(1).split('/');
	if (!first) return '/en' + suffix;
	const translated = SEGMENTS_EN[first];
	if (!translated) return href;
	return '/' + ['en', translated, ...rest].join('/') + suffix;
}

/** The same page in another locale, e.g. for the language switcher and hreflang links. */
export function switchLocaleHref(href: string, locale: Locale): string {
	const { path, suffix } = splitHref(href);
	return localizeHref(delocalizePath(path) + suffix, locale);
}
