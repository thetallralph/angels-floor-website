/**
 * Angel's Floor CMS — Types
 */

export interface SEOFields {
	metaTitle?: string;
	metaDescription?: string;
	ogImage?: string;
}

/**
 * A purchasable variation of a product (size, flavor…).
 * `flavor`/`label` are optional — many products only vary by size.
 * `price` is the variant's price in FCFA. When set, it overrides the product-level price.
 */
export interface ProductVariant {
	size?: string;
	flavor?: string;
	/** Free-form modifier like "Dragée", "Sachet", "Bocal". */
	label?: string;
	sku?: string;
	price?: number;
}

/** A single preparation method described by the BPV (e.g. "Bouillie", "Pâte"). */
export interface Recipe {
	name: string;
	steps: string[];
}

/**
 * BPV column 4: Utilisation / Préparation.
 * `ratio` is the universal proportion (e.g. "1 mesure = 8 mesures d'eau"),
 * `recipes` lists one or more named preparation methods.
 */
export interface Preparation {
	ratio?: string;
	recipes: Recipe[];
}

/**
 * BPV column 6: Compositions nutritionnelles.
 * Values are stored as strings so the BPV's source form ("80g", "352 kCal") is preserved as written.
 */
export interface Nutrition {
	per?: string;
	energy?: string;
	carbs?: string;
	protein?: string;
	fiber?: string;
	fat?: string;
	minerals?: string[];
	vitamins?: string[];
}

export interface Product extends SEOFields {
	_id?: string;
	_status?: 'published' | 'draft' | 'modified';
	_hasDraft?: boolean;
	_isPublished?: boolean;
	id: string;
	slug: string;
	name: string;
	/** Secondary product line shown under the main name (e.g. "PURS GRAINS DE FONIO"). */
	subtitle?: string;
	/** Marketing slogan on the front of the label (e.g. "Optez pour votre bien-être !"). */
	tagline?: string;
	/** Single highlighted mention badged on the label (e.g. "SANS GLUTEN"). */
	specialMention?: string;
	/** Quality / process claims — distinct from marketing benefits (e.g. ["100% Naturel", "HACCP"]). */
	qualityClaims?: string[];
	category: string;
	price: number;
	description: string;
	detailedDescription?: string;
	image: string;
	images?: string[];
	/** Raw PocketBase filenames for the `images` file field. Set by enrichRecordImages(). */
	imageFilenames?: string[];
	benefits?: string[];
	variants?: ProductVariant[];
	tags?: string[];
	preparation?: Preparation;
	nutritionalInfo?: Nutrition;
	conservation?: string;
	usage?: string;
	packaging?: string;
	origin?: string;
	certification?: string;
	featured: boolean;
	published?: boolean;
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

export type SalesPointType = 'boutique' | 'supermarché' | 'marché' | 'pharmacie';

export interface SalesPoint {
	id: string;
	name: string;
	address: string;
	department: string;
	city: string;
	lat: number;
	lng: number;
	type: SalesPointType;
	phone?: string;
	hours?: string;
}

export const SALES_POINT_TYPES: Array<{ value: SalesPointType; label: string }> = [
	{ value: 'boutique', label: 'Boutique' },
	{ value: 'supermarché', label: 'Supermarché' },
	{ value: 'marché', label: 'Marché' },
	{ value: 'pharmacie', label: 'Pharmacie' }
];

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
	/** Resolved image URL (set by mapCategory). Empty string if no image. */
	image?: string;
	/** Raw PocketBase filename for the `image` file field. */
	imageFilename?: string;
	published?: boolean;
}

/** Fallback used when the PocketBase `categories` collection isn't provisioned yet. */
export const DEFAULT_CATEGORIES: Array<Omit<Category, 'id'>> = [
	{ slug: 'fonio', name: 'Fonio', order: 1, published: true },
	{ slug: 'baobab', name: 'Baobab', order: 2, published: true },
	{ slug: 'nere', name: 'Néré', order: 3, published: true },
	{ slug: 'mangue', name: 'Mangue', order: 4, published: true },
	{ slug: 'papaye', name: 'Papaye', order: 5, published: true },
	{ slug: 'autres', name: 'Autres produits', order: 6, published: true }
];

/** @deprecated use `loadCategoriesFromPB()` / `listCategories()`. Kept for legacy code paths. */
export const PRODUCT_CATEGORIES = DEFAULT_CATEGORIES.map((c) => ({
	value: c.slug,
	label: c.name
}));

export type TrainingCategory = 'agroalimentaire' | 'cosmetique';

export interface Training {
	id: string;
	slug: string;
	title: string;
	category: TrainingCategory;
	price: number;
	duration_days: number;
	description?: string;
	order_index: number;
	published: boolean;
	/** Resolved image URL (set by enrichRecordImages). Empty string if no image. */
	image?: string;
	/** Raw PocketBase filename for the `image` file field. */
	imageFilename?: string;
}

export const TRAINING_CATEGORIES: Array<{ value: TrainingCategory; label: string }> = [
	{ value: 'agroalimentaire', label: 'Agroalimentaire' },
	{ value: 'cosmetique', label: 'Cosmétique' }
];

export const BLOG_CATEGORIES = [
	{ value: 'Recettes', label: 'Recettes' },
	{ value: 'Bienfaits', label: 'Bienfaits' },
	{ value: 'Actualités Entreprise', label: 'Actualités Entreprise' },
	{ value: 'Communauté', label: 'Communauté' }
] as const;
