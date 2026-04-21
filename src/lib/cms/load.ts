import { createPB } from '$lib/server/pocketbase';
import type { CmsData } from './context';

/**
 * Load CMS overrides for a specific page.
 * Returns text overrides, single-image URLs, and gallery URLs keyed by field key.
 */
export async function loadCmsOverrides(page: string): Promise<CmsData> {
	const data: CmsData = { text: {}, image: {}, gallery: {} };
	try {
		const pb = createPB();
		const records = await pb.collection('cms_content').getFullList({
			filter: `page = "${page}"`
		});

		for (const record of records) {
			const key = record.key as string;
			const type = record.type as string;

			if (type === 'image' && record.image) {
				data.image[key] = pb.files.getURL(record, record.image);
			} else if (type === 'gallery' && Array.isArray(record.images) && record.images.length > 0) {
				data.gallery[key] = record.images.map((f: string) => pb.files.getURL(record, f));
			} else if ((type === 'text' || type === 'richtext') && record.value) {
				data.text[key] = record.value;
			}
		}
	} catch {
		// Collection missing or PB down — return empty overrides silently.
	}
	return data;
}

export async function loadAllCmsOverrides(): Promise<CmsData> {
	const data: CmsData = { text: {}, image: {}, gallery: {} };
	try {
		const pb = createPB();
		const records = await pb.collection('cms_content').getFullList();

		for (const record of records) {
			const key = record.key as string;
			const type = record.type as string;

			if (type === 'image' && record.image) {
				data.image[key] = pb.files.getURL(record, record.image);
			} else if (type === 'gallery' && Array.isArray(record.images) && record.images.length > 0) {
				data.gallery[key] = record.images.map((f: string) => pb.files.getURL(record, f));
			} else if ((type === 'text' || type === 'richtext') && record.value) {
				data.text[key] = record.value;
			}
		}
	} catch {
		// noop
	}
	return data;
}
