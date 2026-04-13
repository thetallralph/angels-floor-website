import { createPB } from '$lib/server/pocketbase';

export interface CmsOverrides {
	[key: string]: string;
}

/**
 * Load CMS overrides for a specific page.
 * Returns a map of key → value for all overridden content.
 */
export async function loadCmsOverrides(page: string): Promise<CmsOverrides> {
	try {
		const pb = createPB();
		const records = await pb.collection('cms_content').getFullList({
			filter: `page = "${page}" && value != ""`
		});

		const overrides: CmsOverrides = {};
		for (const record of records) {
			if (record.type === 'image' && record.image) {
				overrides[record.key] = pb.files.getURL(record, record.image);
			} else if (record.value) {
				overrides[record.key] = record.value;
			}
		}
		return overrides;
	} catch {
		return {};
	}
}
