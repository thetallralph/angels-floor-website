import type { Product, BlogArticle, SalesPoint } from '$lib/stores/app';

// Load all products from CMS
export async function loadProducts(): Promise<Product[]> {
  const productModules = import.meta.glob('/src/content/products/*.json');
  const products: Product[] = [];
  
  for (const path in productModules) {
    const module = await productModules[path]() as { default?: Product } | Product;
    const product = 'default' in module ? module.default : module;
    if (product) products.push(product as Product);
  }
  
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

// Load all blog articles from CMS
export async function loadBlogArticles(): Promise<BlogArticle[]> {
  const articleModules = import.meta.glob('/src/content/blog/*.json');
  const articles: BlogArticle[] = [];
  
  for (const path in articleModules) {
    const module = await articleModules[path]() as { default?: BlogArticle } | BlogArticle;
    const article = 'default' in module ? module.default : module;
    if (article) articles.push(article as BlogArticle);
  }
  
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Load all sales points from CMS
export async function loadSalesPoints(): Promise<SalesPoint[]> {
  const salesPointModules = import.meta.glob('/src/content/sales-points/*.json');
  const salesPoints: SalesPoint[] = [];
  
  for (const path in salesPointModules) {
    const module = await salesPointModules[path]() as { default?: SalesPoint } | SalesPoint;
    const salesPoint = 'default' in module ? module.default : module;
    if (salesPoint) salesPoints.push(salesPoint as SalesPoint);
  }
  
  return salesPoints;
}

// Load page content
export async function loadPageContent(pageName: string): Promise<Record<string, unknown> | null> {
  try {
    const module = await import(`/src/content/pages/${pageName}.json`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load page content for ${pageName}:`, error);
    return null;
  }
}

// Load site settings
export async function loadSettings(settingName: string): Promise<Record<string, unknown> | null> {
  try {
    const module = await import(`/src/content/settings/${settingName}.json`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load settings for ${settingName}:`, error);
    return null;
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find(p => p.slug === slug);
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(p => p.featured);
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await loadProducts();
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

// Get recent blog articles
export async function getRecentArticles(limit: number = 3): Promise<BlogArticle[]> {
  const articles = await loadBlogArticles();
  return articles.slice(0, limit);
}

// Get blog article by ID
export async function getArticleById(id: string): Promise<BlogArticle | undefined> {
  const articles = await loadBlogArticles();
  return articles.find(a => a.id === id);
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await loadProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.benefits.some(b => b.toLowerCase().includes(lowercaseQuery))
  );
}

// Get product categories with counts
export async function getCategories() {
  const products = await loadProducts();
  
  return [
    { id: 'all', name: 'Tous les produits', count: products.length },
    { id: 'fonio', name: 'Gamme Fonio', count: products.filter(p => p.category === 'fonio').length },
    { id: 'baobab', name: 'Pulpe de Baobab', count: products.filter(p => p.category === 'baobab').length },
    { id: 'nere-fagara', name: 'Néré & Fagara', count: products.filter(p => p.category === 'nere-fagara').length },
    { id: 'mangue', name: 'Produits Mangue', count: products.filter(p => p.category === 'mangue').length },
    { id: 'bisbab', name: 'Biscuits Baobab', count: products.filter(p => p.category === 'bisbab').length }
  ];
}