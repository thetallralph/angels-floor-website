import type { Product } from '$lib/stores/app.js';
import productsData from './products.json';

// Legacy mock data — superseded by the PocketBase-backed loaders in $lib/cms/content.ts.
// Kept temporarily as a typed fallback; the JSON shape predates the BPV-driven schema.
export const products: Product[] = productsData as unknown as Product[];

export const categories = [
  { id: 'all', name: 'Tous les produits', count: products.length },
  { id: 'fonio', name: 'Gamme Fonio', count: products.filter(p => p.category === 'fonio').length },
  { id: 'baobab', name: 'Pulpe de Baobab', count: products.filter(p => p.category === 'baobab').length },
  { id: 'nere-fagara', name: 'Néré & Fagara', count: products.filter(p => p.category === 'nere-fagara').length },
  { id: 'mangue', name: 'Produits Mangue', count: products.filter(p => p.category === 'mangue').length },
  { id: 'bisbab', name: 'Biscuits Baobab', count: products.filter(p => p.category === 'bisbab').length }
];

export const featuredProducts = products.filter(p => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}