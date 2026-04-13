import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug } from '$lib/cms/content';

export const load: PageServerLoad = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    error(404, 'Produit non trouvé');
  }

  return {
    product
  };
};