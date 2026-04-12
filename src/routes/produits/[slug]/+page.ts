import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProductBySlug } from '$lib/cms/content';

export const load: PageLoad = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    error(404, 'Produit non trouvé');
  }

  return {
    product
  };
};