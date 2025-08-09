import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProductBySlug } from '$lib/data/products.js';

export const load: PageLoad = ({ params }) => {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    error(404, 'Produit non trouvé');
  }
  
  return {
    product
  };
};