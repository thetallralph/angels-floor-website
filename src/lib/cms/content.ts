import type { Product, BlogArticle, SalesPoint } from '$lib/stores/app';
import { createPB } from '$lib/server/pocketbase';
import type { RecordModel } from 'pocketbase';

function mapProduct(record: RecordModel): Product {
	return {
		id: record.id,
		slug: record.slug,
		name: record.name,
		category: record.category,
		price: record.price,
		description: record.description || '',
		detailedDescription: record.detailed_description || '',
		image: record.images?.length
			? createPB().files.getURL(record, record.images[0])
			: '',
		images: record.images?.map((img: string) => createPB().files.getURL(record, img)) || [],
		benefits: record.benefits || [],
		nutritionalInfo: record.nutritional_info || {},
		usage: record.usage || '',
		packaging: record.packaging || '',
		origin: record.origin || '',
		certification: record.certification || '',
		inStock: record.in_stock ?? true,
		featured: record.featured ?? false
	};
}

function mapBlogArticle(record: RecordModel): BlogArticle {
	return {
		id: record.id,
		title: record.title,
		excerpt: record.excerpt || '',
		content: record.content || '',
		image: record.cover_image
			? createPB().files.getURL(record, record.cover_image)
			: '',
		category: record.category || 'Actualites',
		date: record.date || record.created,
		author: record.author || '',
		readTime: record.read_time || 5,
		tags: record.tags || []
	};
}

function mapSalesPoint(record: RecordModel): SalesPoint {
	return {
		id: record.id,
		name: record.name,
		address: record.address || '',
		coordinates: [record.latitude || 0, record.longitude || 0],
		type: record.type || 'detaillant',
		contact: record.contact || '',
		email: record.email || '',
		hours: record.hours || ''
	};
}

export async function loadProducts(): Promise<Product[]> {
	const pb = createPB();
	const records = await pb.collection('products').getFullList({ sort: 'order,name' });
	return records.map(mapProduct);
}

export async function loadBlogArticles(): Promise<BlogArticle[]> {
	const pb = createPB();
	const records = await pb.collection('blog').getFullList({
		sort: '-date',
		filter: 'published = true'
	});
	return records.map(mapBlogArticle);
}

export async function loadSalesPoints(): Promise<SalesPoint[]> {
	const pb = createPB();
	const records = await pb.collection('sales_points').getFullList({
		filter: 'active = true',
		sort: 'name'
	});
	return records.map(mapSalesPoint);
}

export async function loadPageContent(
	pageName: string
): Promise<Record<string, unknown> | null> {
	try {
		const pb = createPB();
		const record = await pb.collection('pages').getFirstListItem(`slug = "${pageName}"`);
		return record.content as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function loadSettings(
	settingName: string
): Promise<Record<string, unknown> | null> {
	try {
		const pb = createPB();
		const record = await pb.collection('settings').getFirstListItem(`key = "${settingName}"`);
		return record.value as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
	try {
		const pb = createPB();
		const record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`);
		return mapProduct(record);
	} catch {
		return undefined;
	}
}

export async function getFeaturedProducts(): Promise<Product[]> {
	const pb = createPB();
	const records = await pb.collection('products').getFullList({
		filter: 'featured = true',
		sort: 'order,name'
	});
	return records.map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
	const pb = createPB();
	const filter = category === 'all' ? '' : `category = "${category}"`;
	const records = await pb.collection('products').getFullList({
		filter,
		sort: 'order,name'
	});
	return records.map(mapProduct);
}

export async function getRecentArticles(limit: number = 3): Promise<BlogArticle[]> {
	const pb = createPB();
	const records = await pb.collection('blog').getList(1, limit, {
		sort: '-date',
		filter: 'published = true'
	});
	return records.items.map(mapBlogArticle);
}

export async function getArticleById(id: string): Promise<BlogArticle | undefined> {
	try {
		const pb = createPB();
		const record = await pb.collection('blog').getOne(id);
		return mapBlogArticle(record);
	} catch {
		return undefined;
	}
}

export async function searchProducts(query: string): Promise<Product[]> {
	const pb = createPB();
	const records = await pb.collection('products').getFullList({
		filter: `name ~ "${query}" || description ~ "${query}"`,
		sort: 'order,name'
	});
	return records.map(mapProduct);
}

export async function getCategories() {
	const products = await loadProducts();

	return [
		{ id: 'all', name: 'Tous les produits', count: products.length },
		{
			id: 'fonio',
			name: 'Gamme Fonio',
			count: products.filter((p) => p.category === 'fonio').length
		},
		{
			id: 'baobab',
			name: 'Pulpe de Baobab',
			count: products.filter((p) => p.category === 'baobab').length
		},
		{
			id: 'nere-fagara',
			name: 'Néré & Fagara',
			count: products.filter((p) => p.category === 'nere-fagara').length
		},
		{
			id: 'mangue',
			name: 'Produits Mangue',
			count: products.filter((p) => p.category === 'mangue').length
		},
		{
			id: 'bisbab',
			name: 'Biscuits Baobab',
			count: products.filter((p) => p.category === 'bisbab').length
		}
	];
}
