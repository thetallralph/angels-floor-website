import type PocketBase from 'pocketbase';
import { initPB } from './api';
import { DEFAULT_CATEGORIES, type Category } from './types';

function map(pb: PocketBase, record: Record<string, unknown>): Category {
	const filename = typeof record.image === 'string' ? record.image : '';
	const imageUrl = filename
		? pb.files.getURL(record as never, filename)
		: '';
	return {
		id: String(record.id),
		slug: String(record.slug || ''),
		name: String(record.name || ''),
		description: String(record.description || ''),
		order: Number(record.order ?? 0),
		image: imageUrl,
		imageFilename: filename,
		published: Boolean(record.published)
	};
}

/** Returns null if the `categories` collection doesn't exist yet. */
export async function listCategories(): Promise<Category[] | null> {
	const pb = await initPB();
	try {
		const records = await pb.collection('categories').getFullList({ sort: 'order,name' });
		return records.map((r) => map(pb, r as Record<string, unknown>));
	} catch (err: unknown) {
		if (isMissingCollectionError(err)) return null;
		throw err;
	}
}

export type CategoryWritable = Partial<Omit<Category, 'id' | 'image' | 'imageFilename'>>;

export async function createCategory(data: Omit<Category, 'id' | 'image' | 'imageFilename'>): Promise<Category> {
	const pb = await initPB();
	const record = await pb.collection('categories').create(data);
	await ensureCategoryInProductsSchema(data.slug);
	return map(pb, record as Record<string, unknown>);
}

export async function updateCategory(id: string, data: CategoryWritable): Promise<Category> {
	const pb = await initPB();
	const record = await pb.collection('categories').update(id, data);
	if (data.slug) await ensureCategoryInProductsSchema(data.slug);
	return map(pb, record as Record<string, unknown>);
}

/** Replace the category image. Pass null to clear. */
export async function saveCategoryImage(id: string, file: File | null): Promise<Category> {
	const pb = await initPB();
	const fd = new FormData();
	if (file) fd.append('image', file);
	else fd.append('image', '');
	const record = await pb.collection('categories').update(id, fd);
	return map(pb, record as Record<string, unknown>);
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
 * and seed the default categories. Requires the current user to be a superuser.
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
				{ name: 'order', type: 'number', required: false },
				{
					name: 'image',
					type: 'file',
					maxSelect: 1,
					maxSize: 5_242_880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
				},
				{ name: 'published', type: 'bool' }
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
