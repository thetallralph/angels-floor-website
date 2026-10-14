import type { PageServerLoad } from './$types';
import { loadProducts, getCategories } from '$lib/cms/content';
import { localeFromUrl } from '$lib/i18n/routing';

export const load: PageServerLoad = async ({ url }) => {
  const locale = localeFromUrl(url);
  const [products, categories] = await Promise.all([
    loadProducts(locale),
    getCategories(locale)
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