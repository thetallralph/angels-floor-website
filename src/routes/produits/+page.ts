import type { PageLoad } from './$types';
import { loadProducts, getCategories } from '$lib/cms/content';

export const load: PageLoad = async () => {
  const [products, categories] = await Promise.all([
    loadProducts(),
    getCategories()
  ]);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return {
    products,
    categories,
    productsByCategory
  };
};