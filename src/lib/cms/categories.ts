import type { RecordModel } from 'pocketbase';
import { createPB } from '$lib/server/pocketbase';
import { DEFAULT_CATEGORIES, type Category } from '$lib/admin/types';

function mapCategory(pb: ReturnType<typeof createPB>, record: RecordModel): Category {
	const filename = typeof record.image === 'string' ? record.image : '';
	return {
		id: record.id,
		slug: record.slug,
		name: record.name,
		description: record.description || '',
		order: record.order ?? 0,
		image: filename ? pb.files.getURL(record, filename) : '',
		imageFilename: filename,
		published: Boolean(record.published)
	};
}

/**
 * Load categories from PocketBase.
 * Falls back to DEFAULT_CATEGORIES if the collection isn't provisioned yet,
 * so the public site keeps working before the admin runs the bootstrap.
 */
export async function loadCategoriesFromPB(): Promise<Category[]> {
	try {
		const pb = createPB();
		const records = await pb.collection('categories').getFullList({ sort: 'order,name' });
		if (records.length === 0) {
			return DEFAULT_CATEGORIES.map((c, i) => ({ id: `default-${i}`, ...c }));
		}
		return records.map((r) => mapCategory(pb, r));
	} catch {
		return DEFAULT_CATEGORIES.map((c, i) => ({ id: `default-${i}`, ...c }));
	}
}
