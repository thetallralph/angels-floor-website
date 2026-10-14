import type { RecordModel } from 'pocketbase';
import { createPB } from '$lib/server/pocketbase';
import type { Locale } from '$lib/i18n/routing';
import { localizeRecord } from './translate';
import {
  SALES_POINT_TYPES,
  type SalesPoint as AdminSalesPoint,
  type SalesPointType
} from '$lib/admin/types';

/** Public-site shape, mirroring what the admin stores in PocketBase. */
export interface PublicSalesPoint {
  id: string;
  name: string;
  address: string;
  department: string;
  city: string;
  /** Free-text directions entered in the admin, in place of GPS coordinates. */
  situation: string;
  phone?: string;
  hours?: string;
  type: SalesPointType;
}

function normalizeType(value: unknown): SalesPointType {
  const raw = String(value ?? '');
  return SALES_POINT_TYPES.some((t) => t.value === raw) ? (raw as SalesPointType) : 'boutique';
}

function mapRecord(record: RecordModel): PublicSalesPoint {
  return {
    id: record.id,
    name: record.name,
    address: record.address || '',
    department: record.department || '',
    city: record.city || '',
    situation: record.situation || '',
    // `contact` is the legacy column name from the first PocketBase schema.
    phone: record.phone || record.contact || '',
    hours: record.hours || '',
    type: normalizeType(record.type)
  };
}

/**
 * Load sales points from PocketBase.
 *
 * Returns an empty list when the collection is missing or empty: showing the old
 * hard-coded demo points here made the public site advertise addresses that the
 * admin panel didn't list (and that don't exist).
 */
export async function loadSalesPointsFromPB(locale: Locale = 'fr'): Promise<PublicSalesPoint[]> {
  try {
    const pb = createPB();
    const records = await pb
      .collection('sales_points')
      .getFullList({ sort: 'department,city,name' });
    return records.map((r) => mapRecord(localizeRecord(r, 'sales_points', locale)));
  } catch {
    return [];
  }
}

// Re-export the admin type name for consumers that want it.
export type { AdminSalesPoint };
