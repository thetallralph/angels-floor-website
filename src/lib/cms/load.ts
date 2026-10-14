import type { RecordModel } from 'pocketbase';
import { createPB } from '$lib/server/pocketbase';
import type { Locale } from '$lib/i18n/routing';
import type { CmsData } from './context';

/**
 * Fold cms_content records into override maps.
 * Text/richtext overrides are per locale (records without a locale predate i18n
 * and are French). Images and galleries are shared: they're only edited in French.
 */
function collect(pb: ReturnType<typeof createPB>, records: RecordModel[], locale: Locale): CmsData {
	const data: CmsData = { text: {}, image: {}, gallery: {} };
	for (const record of records) {
		const key = record.key as string;
		const type = record.type as string;
		const recordLocale = (record.locale as string) || 'fr';

		if (type === 'image' && record.image) {
			data.image[key] = pb.files.getURL(record, record.image);
		} else if (type === 'gallery' && Array.isArray(record.images) && record.images.length > 0) {
			data.gallery[key] = record.images.map((f: string) => pb.files.getURL(record, f));
		} else if (
			(type === 'text' || type === 'richtext') &&
			record.value &&
			recordLocale === locale
		) {
			data.text[key] = record.value;
		}
	}
	return data;
}

/**
 * Load CMS overrides for a specific page.
 * Returns text overrides, single-image URLs, and gallery URLs keyed by field key.
 */
export async function loadCmsOverrides(page: string, locale: Locale = 'fr'): Promise<CmsData> {
	try {
		const pb = createPB();
		const records = await pb.collection('cms_content').getFullList({
			filter: pb.filter('page = {:page}', { page })
		});
		return collect(pb, records, locale);
	} catch {
		// Collection missing or PB down — return empty overrides silently.
		return { text: {}, image: {}, gallery: {} };
	}
}

export async function loadAllCmsOverrides(locale: Locale = 'fr'): Promise<CmsData> {
	try {
		const pb = createPB();
		const records = await pb.collection('cms_content').getFullList();
		return collect(pb, records, locale);
	} catch {
		return { text: {}, image: {}, gallery: {} };
	}
}
