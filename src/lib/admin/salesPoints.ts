import { initPB } from './api';
import { SALES_POINT_TYPES, type SalesPoint, type SalesPointType } from './types';

/** Fields the admin UI reads/writes. Kept in sync with `ensureSalesPointsSchema`. */
const REQUIRED_FIELDS = ['name', 'address', 'department', 'city', 'type'] as const;

function normalizeType(value: unknown): SalesPointType {
  const raw = String(value ?? '');
  return SALES_POINT_TYPES.some((t) => t.value === raw) ? (raw as SalesPointType) : 'boutique';
}

function map(record: Record<string, unknown>): SalesPoint {
  return {
    id: String(record.id),
    name: String(record.name || ''),
    address: String(record.address || ''),
    department: String(record.department || ''),
    city: String(record.city || ''),
    situation: String(record.situation || ''),
    type: normalizeType(record.type),
    // `contact` is the legacy column name from the first PocketBase schema.
    phone: String(record.phone || record.contact || ''),
    hours: record.hours ? String(record.hours) : ''
  };
}

/**
 * Turn a PocketBase error into something an admin can act on.
 * PB answers a failed create with a generic "Failed to create record." and puts
 * the real, per-field reason in the response body — which is exactly what we need
 * to show when a column is missing or a select value is rejected.
 */
export function describePBError(err: unknown, fallback = 'Erreur'): string {
  if (!err || typeof err !== 'object') return fallback;
  const e = err as {
    message?: string;
    response?: { message?: string; data?: Record<string, { message?: string }> };
    data?: { message?: string; data?: Record<string, { message?: string }> };
  };
  const body = e.response ?? e.data ?? {};
  const fieldErrors = body.data ?? {};
  const details = Object.entries(fieldErrors)
    .map(([field, detail]) => `${field} : ${detail?.message || 'valeur invalide'}`)
    .join(' · ');
  const base = body.message || e.message || fallback;
  return details ? `${base} — ${details}` : base;
}

/** Returns null if the `sales_points` collection doesn't exist yet. */
export async function listSalesPoints(): Promise<SalesPoint[] | null> {
  const pb = await initPB();
  try {
    const records = await pb
      .collection('sales_points')
      .getFullList({ sort: 'department,city,name' });
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

type PBField = Record<string, unknown> & { name?: string; type?: string; system?: boolean };

function desiredFields(): PBField[] {
  return [
    { name: 'name', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
    { name: 'department', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'situation', type: 'text', required: false },
    {
      name: 'type',
      type: 'select',
      required: true,
      maxSelect: 1,
      values: SALES_POINT_TYPES.map((t) => t.value)
    },
    { name: 'phone', type: 'text', required: false },
    { name: 'hours', type: 'text', required: false }
  ];
}

/**
 * Create the `sales_points` collection, or repair one that drifted from this schema.
 *
 * The original PocketBase schema used `latitude`/`longitude`/`active`/`contact`; the admin
 * UI writes `situation`/`phone`. Any leftover *required* column the UI no longer sends makes
 * every create fail with a bare "Failed to create record.", so repairing means: add the
 * missing columns, drop the `required` flag on everything we don't send, and widen the `type`
 * select so previously stored values keep validating. Requires superuser auth.
 */
export async function ensureSalesPointsSchema(): Promise<void> {
  const pb = await initPB();

  let collection;
  try {
    collection = await pb.collections.getOne('sales_points');
  } catch {
    await pb.collections.create({
      name: 'sales_points',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: desiredFields()
    });
    return;
  }

  const fields = [...((collection.fields || []) as PBField[])];

  for (const field of fields) {
    if (field.system) continue;
    const name = String(field.name || '');

    // A required column the admin form never fills would reject every save.
    if (!REQUIRED_FIELDS.includes(name as (typeof REQUIRED_FIELDS)[number])) {
      field.required = false;
    }

    // Keep values stored under an older list (accents, casing, `detaillant`…) valid.
    if (name === 'type' && field.type === 'select') {
      const existing = Array.isArray(field.values) ? (field.values as string[]) : [];
      field.values = Array.from(new Set([...existing, ...SALES_POINT_TYPES.map((t) => t.value)]));
      field.maxSelect = 1;
    }
  }

  for (const wanted of desiredFields()) {
    if (fields.some((f) => f.name === wanted.name)) continue;
    // Never required on an existing collection: stored records have no value for it yet.
    fields.push({ ...wanted, required: false });
  }

  await pb.collections.update(collection.id, { fields, listRule: '', viewRule: '' });
}

function isMissingCollectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { status?: number; message?: string };
  return e.status === 404 || /missing collection|not found/i.test(e.message || '');
}
