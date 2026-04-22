import { initPB } from './api';
import { DEFAULT_CATEGORIES, type Category } from './types';

function map(record: Record<string, unknown>): Category {
	return {
		id: String(record.id),
		slug: String(record.slug || ''),
		name: String(record.name || ''),
		description: String(record.description || ''),
		order: Number(record.order ?? 0)
	};
}

/** Returns null if the `categories` collection doesn't exist yet. */
export async function listCategories(): Promise<Category[] | null> {
	const pb = await initPB();
	try {
		const records = await pb.collection('categories').getFullList({ sort: 'order,name' });
		return records.map((r) => map(r as Record<string, unknown>));
	} catch (err: unknown) {
		if (isMissingCollectionError(err)) return null;
		throw err;
	}
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
	const pb = await initPB();
	const record = await pb.collection('categories').create(data);
	await ensureCategoryInProductsSchema(data.slug);
	return map(record as Record<string, unknown>);
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
	const pb = await initPB();
	const record = await pb.collection('categories').update(id, data);
	if (data.slug) await ensureCategoryInProductsSchema(data.slug);
	return map(record as Record<string, unknown>);
}

export async function deleteCategory(id: string): Promise<void> {
	const pb = await initPB();
	await pb.collection('categories').delete(id);
	// Leave the slug in products.category values as an orphan — removing it
	// would break any legacy product still referencing it.
}

/**
 * Ensure the given slug is in the products.category select's allowed values.
 * No-op if already present. Requires superuser.
 */
async function ensureCategoryInProductsSchema(slug: string): Promise<void> {
	if (!slug) return;
	const pb = await initPB();
	const coll = await pb.collections.getOne('products');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fields = (coll as any).fields as Array<Record<string, unknown>>;
	const categoryField = fields.find((f) => f.name === 'category');
	if (!categoryField || categoryField.type !== 'select') return;
	const values = Array.isArray(categoryField.values) ? [...categoryField.values] : [];
	if (values.includes(slug)) return;
	values.push(slug);
	const nextFields = fields.map((f) =>
		f.name === 'category' ? { ...f, values } : f
	);
	await pb.collections.update('products', { fields: nextFields });
}

/**
 * One-shot: create the PocketBase `categories` collection with public read rules
 * and seed the 5 default categories. Requires the current user to be a superuser.
 */
export async function bootstrapCategoriesCollection(): Promise<void> {
	const pb = await initPB();

	try {
		await pb.collections.getOne('categories');
	} catch {
		await pb.collections.create({
			name: 'categories',
			type: 'base',
			listRule: '',
			viewRule: '',
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{ name: 'slug', type: 'text', required: true },
				{ name: 'name', type: 'text', required: true },
				{ name: 'description', type: 'text', required: false },
				{ name: 'order', type: 'number', required: false }
			],
			indexes: ['CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)']
		});
	}

	const existing = await pb.collection('categories').getFullList();
	const existingSlugs = new Set(existing.map((r) => String(r.slug)));
	for (const cat of DEFAULT_CATEGORIES) {
		if (!existingSlugs.has(cat.slug)) {
			await pb.collection('categories').create(cat);
		}
	}
}

function isMissingCollectionError(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const e = err as { status?: number; message?: string };
	return e.status === 404 || /missing collection|not found/i.test(e.message || '');
}
