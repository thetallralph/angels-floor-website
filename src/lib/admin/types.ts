/**
 * Angel's Floor CMS — Types
 */

export interface SEOFields {
	metaTitle?: string;
	metaDescription?: string;
	ogImage?: string;
}

export interface Product extends SEOFields {
	_id?: string;
	_status?: 'published' | 'draft' | 'modified';
	_hasDraft?: boolean;
	_isPublished?: boolean;
	id: string;
	slug: string;
	name: string;
	category: string;
	price: number;
	description: string;
	detailedDescription?: string;
	image: string;
	images?: string[];
	/** Raw PocketBase filenames for the `images` file field. Set by enrichRecordImages(). */
	imageFilenames?: string[];
	benefits?: string[];
	nutritionalInfo?: {
		calories?: number;
		protein?: number;
		carbs?: number;
		fiber?: number;
		fat?: number;
		vitamins?: string[];
		minerals?: string[];
		iron?: number;
		calcium?: number;
	};
	usage?: string;
	packaging?: string;
	origin?: string;
	certification?: string;
	featured: boolean;
}

export interface BlogPost extends SEOFields {
	_id?: string;
	_status?: 'published' | 'draft' | 'modified';
	id: string;
	title: string;
	excerpt: string;
	content: string;
	image: string;
	category: string;
	date: string;
	author: string;
	readTime: number;
	tags?: string[];
}

export interface SalesPoint {
	_id?: string;
	_status?: 'published' | 'draft' | 'modified';
	id: string;
	name: string;
	address: string;
	coordinates: { lat: number; lng: number };
	type: string;
	contact: string;
	email?: string;
	hours?: string;
}

export interface PageContent {
	_id?: string;
	[key: string]: unknown;
}

export interface SiteSettings {
	siteName: string;
	description: string;
	email: string;
	phone: string;
	address: string;
	social: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		linkedin?: string;
		youtube?: string;
	};
}

export interface Category {
	id: string;
	slug: string;
	name: string;
	description?: string;
	order: number;
}

/** Fallback used when the PocketBase `categories` collection isn't provisioned yet. */
export const DEFAULT_CATEGORIES: Array<Omit<Category, 'id'>> = [
	{ slug: 'fonio', name: 'Gamme Fonio', order: 1 },
	{ slug: 'baobab', name: 'Pulpe de Baobab', order: 2 },
	{ slug: 'nere-fagara', name: 'Néré & Fagara', order: 3 },
	{ slug: 'mangue', name: 'Produits Mangue', order: 4 },
	{ slug: 'bisbab', name: 'Biscuits Baobab', order: 5 }
];

/** @deprecated use `loadCategoriesFromPB()` / `listCategories()`. Kept for legacy code paths. */
export const PRODUCT_CATEGORIES = DEFAULT_CATEGORIES.map((c) => ({
	value: c.slug,
	label: c.name
}));

export const BLOG_CATEGORIES = [
	{ value: 'Recettes', label: 'Recettes' },
	{ value: 'Bienfaits', label: 'Bienfaits' },
	{ value: 'Actualités Entreprise', label: 'Actualités Entreprise' },
	{ value: 'Communauté', label: 'Communauté' }
] as const;
