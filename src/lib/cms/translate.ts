import type { RecordModel } from 'pocketbase';
import type { Locale } from '$lib/i18n/routing';

/**
 * Fields an `en` translation may override, per collection. Anything else in the
 * JSON (prices, variants, slugs…) is ignored so the English version can't drift
 * from the French data the admin keeps up to date.
 */
export const TRANSLATABLE_FIELDS = {
	products: [
		'name',
		'subtitle',
		'tagline',
		'special_mention',
		'quality_claims',
		'description',
		'detailed_description',
		'benefits',
		'preparation',
		'nutritional_info',
		'conservation',
		'usage',
		'packaging',
		'origin',
		'certification'
	],
	categories: ['name', 'description'],
	trainings: ['title', 'description'],
	sales_points: ['situation', 'hours']
} as const;

export type TranslatableCollection = keyof typeof TRANSLATABLE_FIELDS;

function hasContent(value: unknown): boolean {
	if (value == null) return false;
	if (typeof value === 'string') return value.trim() !== '';
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === 'object') return Object.keys(value).length > 0;
	return true;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Overlay a record's `en` JSON field on top of its French fields.
 * Empty English values fall back to French, so a half-translated record still renders.
 * Object fields (preparation, nutritional_info) are merged key by key, so the English
 * side only needs the keys whose text differs (e.g. `minerals`, not `energy: "352 kCal"`).
 */
export function localizeRecord<T extends RecordModel>(
	record: T,
	collection: TranslatableCollection,
	locale: Locale
): T {
	if (locale === 'fr') return record;
	const en = record.en as Record<string, unknown> | null | undefined;
	if (!isPlainObject(en)) return record;
	const merged: Record<string, unknown> = { ...record };
	for (const field of TRANSLATABLE_FIELDS[collection]) {
		const value = en[field];
		if (!hasContent(value)) continue;
		if (isPlainObject(value) && isPlainObject(record[field])) {
			const overrides = Object.entries(value).filter(([, v]) => hasContent(v));
			merged[field] = { ...record[field], ...Object.fromEntries(overrides) };
		} else {
			merged[field] = value;
		}
	}
	return merged as T;
}
