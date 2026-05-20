import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug, loadProducts } from '$lib/cms/content';

export const load: PageServerLoad = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    error(404, 'Produit non trouvé');
  }

  const all = await loadProducts();
  const crossSell: Record<string, string[]> = { baobab: ['nere'], nere: ['baobab'] };
  const relatedSlugs = new Set([product.category, ...(crossSell[product.category] ?? [])]);
  const similarProducts = all
    .filter((p) => p.id !== product.id && relatedSlugs.has(p.category))
    .slice(0, 3);

  return {
    product,
    similarProducts
  };
};