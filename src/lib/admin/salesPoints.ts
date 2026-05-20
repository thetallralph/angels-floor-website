import { initPB } from './api';
import { salesPoints as SEED_SALES_POINTS } from '$lib/data/salesPoints';
import { SALES_POINT_TYPES, type SalesPoint, type SalesPointType } from './types';

function map(record: Record<string, unknown>): SalesPoint {
	return {
		id: String(record.id),
		name: String(record.name || ''),
		address: String(record.address || ''),
		department: String(record.department || ''),
		city: String(record.city || ''),
		lat: Number(record.lat ?? 0),
		lng: Number(record.lng ?? 0),
		type: (record.type as SalesPointType) || 'boutique',
		phone: record.phone ? String(record.phone) : '',
		hours: record.hours ? String(record.hours) : ''
	};
}

/** Returns null if the `sales_points` collection doesn't exist yet. */
export async function listSalesPoints(): Promise<SalesPoint[] | null> {
	const pb = await initPB();
	try {
		const records = await pb.collection('sales_points').getFullList({ sort: 'department,city,name' });
		return records.map((r) => map(r as Record<string, unknown>));
	} catch (err: unknown) {
		if (isMissingCollectionError(err)) return null;
		throw err;
	}
}

export async function createSalesPoint(data: Omit<SalesPoint, 'id'>): Promise<SalesPoint> {
	const pb = await initPB();
	const record = await pb.collection('sales_points').create(data);
	return map(record as Record<string, unknown>);
}

export async function updateSalesPoint(
	id: string,
	data: Partial<Omit<SalesPoint, 'id'>>
): Promise<SalesPoint> {
	const pb = await initPB();
	const record = await pb.collection('sales_points').update(id, data);
	return map(record as Record<string, unknown>);
}

export async function deleteSalesPoint(id: string): Promise<void> {
	const pb = await initPB();
	await pb.collection('sales_points').delete(id);
}

/**
 * One-shot: create the PocketBase `sales_points` collection with public read rules
 * and seed the points from `src/lib/data/salesPoints.ts`. Requires superuser auth.
 */
export async function bootstrapSalesPointsCollection(): Promise<void> {
	const pb = await initPB();

	try {
		await pb.collections.getOne('sales_points');
	} catch {
		await pb.collections.create({
			name: 'sales_points',
			type: 'base',
			listRule: '',
			viewRule: '',
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{ name: 'name', type: 'text', required: true },
				{ name: 'address', type: 'text', required: true },
				{ name: 'department', type: 'text', required: true },
				{ name: 'city', type: 'text', required: true },
				{ name: 'lat', type: 'number', required: true },
				{ name: 'lng', type: 'number', required: true },
				{
					name: 'type',
					type: 'select',
					required: true,
					maxSelect: 1,
					values: SALES_POINT_TYPES.map((t) => t.value)
				},
				{ name: 'phone', type: 'text', required: false },
				{ name: 'hours', type: 'text', required: false }
			]
		});
	}

	const existing = await pb.collection('sales_points').getFullList();
	if (existing.length > 0) return;

	for (const seed of SEED_SALES_POINTS) {
		await pb.collection('sales_points').create({
			name: seed.name,
			address: seed.address,
			department: seed.department,
			city: seed.city,
			lat: seed.coordinates.lat,
			lng: seed.coordinates.lng,
			type: seed.type,
			phone: seed.phone || '',
			hours: seed.hours || ''
		});
	}
}

function isMissingCollectionError(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const e = err as { status?: number; message?: string };
	return e.status === 404 || /missing collection|not found/i.test(e.message || '');
}
