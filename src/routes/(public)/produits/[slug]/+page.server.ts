import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug, loadProducts } from '$lib/cms/content';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ params, url }) => {
  const locale = localeFromUrl(url);
  const product = await getProductBySlug(params.slug, locale);

  if (!product) {
    error(404, locale === 'en' ? 'Product not found' : 'Produit non trouvé');
  }

  const all = await loadProducts(locale);
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