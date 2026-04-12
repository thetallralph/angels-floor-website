/**
 * Angel's Floor CMS — Types
 */

export interface Product {
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
	inStock: boolean;
	featured: boolean;
}

export interface BlogPost {
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

export const PRODUCT_CATEGORIES = [
	{ value: 'fonio', label: 'Fonio' },
	{ value: 'baobab', label: 'Baobab' },
	{ value: 'nere-fagara', label: 'Néré & Fagara' },
	{ value: 'mangue', label: 'Mangue' },
	{ value: 'bisbab', label: 'Biscuits Baobab' }
] as const;

export const BLOG_CATEGORIES = [
	{ value: 'Recettes', label: 'Recettes' },
	{ value: 'Bienfaits', label: 'Bienfaits' },
	{ value: 'Actualités Entreprise', label: 'Actualités Entreprise' },
	{ value: 'Communauté', label: 'Communauté' }
] as const;
