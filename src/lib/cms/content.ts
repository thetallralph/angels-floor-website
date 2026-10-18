import type { Product, BlogArticle } from '$lib/stores/app';
import { createPB } from '$lib/server/pocketbase';
import { loadCategoriesFromPB } from '$lib/cms/categories';
import type { RecordModel } from 'pocketbase';
import type { Locale } from '$lib/i18n/routing';
import { localizeRecord } from './translate';

function mapProduct(source: RecordModel, locale: Locale = 'fr'): Product {
  const pb = createPB();
  const record = localizeRecord(source, 'products', locale);
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    subtitle: record.subtitle || '',
    tagline: record.tagline || '',
    specialMention: record.special_mention || '',
    qualityClaims: Array.isArray(record.quality_claims) ? record.quality_claims : [],
    category: record.category,
    price: record.price,
    description: record.description || '',
    detailedDescription: record.detailed_description || '',
    image: record.images?.length ? pb.files.getURL(record, record.images[0]) : '',
    images: record.images?.map((img: string) => pb.files.getURL(record, img)) || [],
    benefits: record.benefits || [],
    variants: Array.isArray(record.variants) ? record.variants : [],
    tags: Array.isArray(record.tags) ? record.tags : [],
    preparation: record.preparation || undefined,
    nutritionalInfo: record.nutritional_info || undefined,
    conservation: record.conservation || '',
    usage: record.usage || '',
    packaging: record.packaging || '',
    origin: record.origin || '',
    certification: record.certification || '',
    featured: record.featured ?? false,
    published: record.published ?? true
  };
}

function mapBlogArticle(record: RecordModel): BlogArticle {
  return {
    id: record.id,
    title: record.title,
    excerpt: record.excerpt || '',
    content: record.content || '',
    image: record.cover_image ? createPB().files.getURL(record, record.cover_image) : '',
    category: record.category || 'Actualites',
    date: record.date || record.created,
    author: record.author || '',
    readTime: record.read_time || 5,
    tags: record.tags || []
  };
}

export async function loadProducts(locale: Locale = 'fr'): Promise<Product[]> {
  const pb = createPB();
  const records = await pb.collection('products').getFullList({
    filter: 'published = true',
    sort: 'order,name'
  });
  return records.map((r) => mapProduct(r, locale));
}

export async function loadBlogArticles(): Promise<BlogArticle[]> {
  const pb = createPB();
  const records = await pb.collection('blog').getFullList({
    sort: '-date',
    filter: 'published = true'
  });
  return records.map(mapBlogArticle);
}

export async function loadPageContent(pageName: string): Promise<Record<string, unknown> | null> {
  try {
    const pb = createPB();
    const record = await pb.collection('pages').getFirstListItem(`slug = "${pageName}"`);
    return record.content as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function loadSettings(settingName: string): Promise<Record<string, unknown> | null> {
  try {
    const pb = createPB();
    const record = await pb.collection('settings').getFirstListItem(`key = "${settingName}"`);
    return record.value as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = 'fr'
): Promise<Product | undefined> {
  try {
    const pb = createPB();
    const record = await pb
      .collection('products')
      .getFirstListItem(`slug = "${slug}" && published = true`);
    return mapProduct(record, locale);
  } catch {
    return undefined;
  }
}

export async function getFeaturedProducts(locale: Locale = 'fr'): Promise<Product[]> {
  const pb = createPB();
  const records = await pb.collection('products').getFullList({
    filter: 'featured = true && published = true',
    sort: 'order,name'
  });
  return records.map((r) => mapProduct(r, locale));
}

export async function getProductsByCategory(
  category: string,
  locale: Locale = 'fr'
): Promise<Product[]> {
  const pb = createPB();
  const filter =
    category === 'all' ? 'published = true' : `category = "${category}" && published = true`;
  const records = await pb.collection('products').getFullList({
    filter,
    sort: 'order,name'
  });
  return records.map((r) => mapProduct(r, locale));
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

export async function searchProducts(query: string, locale: Locale = 'fr'): Promise<Product[]> {
  const pb = createPB();
  const records = await pb.collection('products').getFullList({
    filter: `(name ~ "${query}" || description ~ "${query}") && published = true`,
    sort: 'order,name'
  });
  return records.map((r) => mapProduct(r, locale));
}

export async function getCategories(locale: Locale = 'fr') {
  const [products, categories] = await Promise.all([
    loadProducts(locale),
    loadCategoriesFromPB(locale)
  ]);

  return [
    {
      id: 'all',
      name: locale === 'en' ? 'All products' : 'Tous les produits',
      count: products.length
    },
    ...categories.map((c) => ({
      id: c.slug,
      name: c.name,
      count: products.filter((p) => p.category === c.slug).length
    }))
  ];
}
