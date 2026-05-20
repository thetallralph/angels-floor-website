import type { RecordModel } from 'pocketbase';
import { createPB } from '$lib/server/pocketbase';
import type { SalesPoint as AdminSalesPoint, SalesPointType } from '$lib/admin/types';
import { salesPoints as SEED_SALES_POINTS } from '$lib/data/salesPoints';

/**
 * Public-site shape. Keeps `coordinates: { lat, lng }` so the existing public
 * page doesn't have to be rewritten.
 */
export interface PublicSalesPoint {
	id: string;
	name: string;
	address: string;
	department: string;
	city: string;
	coordinates: { lat: number; lng: number };
	phone?: string;
	hours?: string;
	type: SalesPointType;
}

function mapRecord(record: RecordModel): PublicSalesPoint {
	return {
		id: record.id,
		name: record.name,
		address: record.address || '',
		department: record.department || '',
		city: record.city || '',
		coordinates: { lat: Number(record.lat ?? 0), lng: Number(record.lng ?? 0) },
		phone: record.phone || '',
		hours: record.hours || '',
		type: (record.type as SalesPointType) || 'boutique'
	};
}

function seedFallback(): PublicSalesPoint[] {
	return SEED_SALES_POINTS.map((p) => ({
		id: p.id,
		name: p.name,
		address: p.address,
		department: p.department,
		city: p.city,
		coordinates: { lat: p.coordinates.lat, lng: p.coordinates.lng },
		phone: p.phone,
		hours: p.hours,
		type: p.type
	}));
}

/**
 * Load sales points from PocketBase. Falls back to the static seed data if the
 * collection isn't provisioned yet, so the public site keeps working before
 * the admin runs the bootstrap.
 */
export async function loadSalesPointsFromPB(): Promise<PublicSalesPoint[]> {
	try {
		const pb = createPB();
		const records = await pb
			.collection('sales_points')
			.getFullList({ sort: 'department,city,name' });
		if (records.length === 0) return seedFallback();
		return records.map(mapRecord);
	} catch {
		return seedFallback();
	}
}

// Re-export the admin type name for consumers that want it.
export type { AdminSalesPoint };
