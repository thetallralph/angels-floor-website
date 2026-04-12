import type { Product, BlogArticle, SalesPoint } from '$lib/stores/app';
import { browser } from '$app/environment';

/**
 * Content loader — Hybrid approach:
 * - At build time (SSR/prerender): reads from src/content/ static files
 * - At runtime (browser on IONOS): fetches from PHP API (api/data/live/)
 *
 * This gives us SEO (pre-rendered HTML) + dynamic updates (CMS changes visible immediately)
 */

const API_BASE = '/api';

// --- API fetcher (runtime only) ---

async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
	if (!browser) return null;

	try {
		const res = await fetch(`${API_BASE}/${endpoint}`);
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

// --- Static file loaders (build time fallback) ---

async function loadStaticProducts(): Promise<Product[]> {
	const productModules = import.meta.glob('/src/content/products/*.json');
	const products: Product[] = [];

	for (const path in productModules) {
		const module = (await productModules[path]()) as { default?: Product } | Product;
		const product = 'default' in module ? module.default : module;
		if (product) products.push(product as Product);
	}

	return products.sort((a, b) => a.name.localeCompare(b.name));
}

async function loadStaticPageContent(
	pageName: string
): Promise<Record<string, unknown> | null> {
	try {
		const pageModules = import.meta.glob('/src/content/pages/*.json');
		const path = `/src/content/pages/${pageName}.json`;

		if (path in pageModules) {
			const module = (await pageModules[path]()) as
				| { default?: Record<string, unknown> }
				| Record<string, unknown>;
			return ('default' in module ? (module.default ?? null) : module) as Record<
				string,
				unknown
			> | null;
		}

		return null;
	} catch {
		return null;
	}
}

async function loadStaticSettings(
	settingName: string
): Promise<Record<string, unknown> | null> {
	try {
		const settingsModules = import.meta.glob('/src/content/settings/*.json');
		const path = `/src/content/settings/${settingName}.json`;

		if (path in settingsModules) {
			const module = (await settingsModules[path]()) as
				| { default?: Record<string, unknown> }
				| Record<string, unknown>;
			return ('default' in module ? (module.default ?? null) : module) as Record<
				string,
				unknown
			> | null;
		}

		return null;
	} catch {
		return null;
	}
}

// --- Public API (used by pages) ---

export async function loadProducts(): Promise<Product[]> {
	// Try API first (runtime), fallback to static files (build time)
	const apiProducts = await fetchFromAPI<Product[]>('content.php?type=products');
	if (apiProducts && apiProducts.length > 0) {
		return apiProducts.sort((a, b) => a.name.localeCompare(b.name));
	}
	return loadStaticProducts();
}

export async function loadBlogArticles(): Promise<BlogArticle[]> {
	const apiArticles = await fetchFromAPI<BlogArticle[]>('content.php?type=blog');
	if (apiArticles && apiArticles.length > 0) {
		return apiArticles.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
	}

	// Fallback to static
	const articleModules = import.meta.glob('/src/content/blog/*.json');
	const articles: BlogArticle[] = [];
	for (const path in articleModules) {
		const module = (await articleModules[path]()) as { default?: BlogArticle } | BlogArticle;
		const article = 'default' in module ? module.default : module;
		if (article) articles.push(article as BlogArticle);
	}
	return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function loadSalesPoints(): Promise<SalesPoint[]> {
	const apiPoints = await fetchFromAPI<SalesPoint[]>('content.php?type=sales-points');
	if (apiPoints && apiPoints.length > 0) return apiPoints;

	// Fallback to static
	const salesPointModules = import.meta.glob('/src/content/sales-points/*.json');
	const salesPoints: SalesPoint[] = [];
	for (const path in salesPointModules) {
		const module = (await salesPointModules[path]()) as
			| { default?: SalesPoint }
			| SalesPoint;
		const salesPoint = 'default' in module ? module.default : module;
		if (salesPoint) salesPoints.push(salesPoint as SalesPoint);
	}
	return salesPoints;
}

export async function loadPageContent(
	pageName: string
): Promise<Record<string, unknown> | null> {
	const apiContent = await fetchFromAPI<Record<string, unknown>>(
		`content.php?type=pages&id=${pageName}`
	);
	if (apiContent) return apiContent;
	return loadStaticPageContent(pageName);
}

export async function loadSettings(
	settingName: string
): Promise<Record<string, unknown> | null> {
	const apiSettings = await fetchFromAPI<Record<string, unknown>>(
		`content.php?type=settings&id=${settingName}`
	);
	if (apiSettings) return apiSettings;
	return loadStaticSettings(settingName);
}

// --- Helper functions ---

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
	// Try API direct fetch first
	const apiProduct = await fetchFromAPI<Product>(`content.php?type=products&id=${slug}`);
	if (apiProduct) return apiProduct;

	const products = await loadProducts();
	return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
	const products = await loadProducts();
	return products.filter((p) => p.featured);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
	const products = await loadProducts();
	if (category === 'all') return products;
	return products.filter((p) => p.category === category);
}

export async function getRecentArticles(limit: number = 3): Promise<BlogArticle[]> {
	const articles = await loadBlogArticles();
	return articles.slice(0, limit);
}

export async function getArticleById(id: string): Promise<BlogArticle | undefined> {
	const apiArticle = await fetchFromAPI<BlogArticle>(`content.php?type=blog&id=${id}`);
	if (apiArticle) return apiArticle;

	const articles = await loadBlogArticles();
	return articles.find((a) => a.id === id);
}

export async function searchProducts(query: string): Promise<Product[]> {
	const products = await loadProducts();
	const lowercaseQuery = query.toLowerCase();

	return products.filter(
		(p) =>
			p.name.toLowerCase().includes(lowercaseQuery) ||
			p.description.toLowerCase().includes(lowercaseQuery) ||
			p.benefits.some((b) => b.toLowerCase().includes(lowercaseQuery))
	);
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
