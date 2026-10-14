/**
 * Component-side i18n helpers.
 *
 * The current locale is derived from `page.url`, so these helpers are reactive
 * in templates and `$derived`, and must only be called while a component is
 * rendering (template, `$derived`, event handlers) — not at module top level
 * or in `load` functions (use `localeFromUrl(url)` there).
 */
import { page } from '$app/state';
import { LOCALE_TAGS, localeFromPath, localizeHref, type Locale } from './routing';

export * from './routing';

export function getLocale(): Locale {
	return localeFromPath(page.url.pathname);
}

/** Pick the string for the current locale: `t('Produits', 'Products')`. */
export function t(fr: string, en: string): string {
	return getLocale() === 'en' ? en : fr;
}

/** Localize a French site-internal link: `href('/produits')` → `/en/products` in English. */
export function href(path: string): string {
	return localizeHref(path, getLocale());
}

export function formatNumber(n: number): string {
	return new Intl.NumberFormat(LOCALE_TAGS[getLocale()]).format(n);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
	return new Date(date).toLocaleDateString(
		LOCALE_TAGS[getLocale()],
		options ?? { day: 'numeric', month: 'long', year: 'numeric' }
	);
}
