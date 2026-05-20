import type PocketBase from 'pocketbase';
import type { RecordModel } from 'pocketbase';
import { createPB } from '$lib/server/pocketbase';
import type { TrainingCategory } from '$lib/admin/types';

export interface PublicTraining {
	id: string;
	slug: string;
	title: string;
	category: TrainingCategory;
	price: number;
	duration_days: number;
	description: string;
	image: string;
}

function mapRecord(pb: PocketBase, record: RecordModel): PublicTraining {
	const filename = typeof record.image === 'string' ? record.image : '';
	return {
		id: record.id,
		slug: record.slug,
		title: record.title,
		category: (record.category as TrainingCategory) || 'agroalimentaire',
		price: Number(record.price ?? 0),
		duration_days: Number(record.duration_days ?? 0),
		description: record.description || '',
		image: filename ? pb.files.getURL(record, filename, { thumb: '800x800' }) : ''
	};
}

export async function loadTrainingsFromPB(): Promise<PublicTraining[]> {
	try {
		const pb = createPB();
		const records = await pb.collection('trainings').getFullList({
			filter: 'published = true',
			sort: 'category,order_index'
		});
		return records.map((r) => mapRecord(pb, r));
	} catch {
		return [];
	}
}

export async function loadTrainingBySlug(slug: string): Promise<PublicTraining | null> {
	try {
		const pb = createPB();
		const record = await pb.collection('trainings').getFirstListItem(
			`slug = "${slug.replace(/"/g, '\\"')}" && published = true`
		);
		return mapRecord(pb, record);
	} catch {
		return null;
	}
}
