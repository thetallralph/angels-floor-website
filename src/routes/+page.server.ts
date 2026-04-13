import type { PageServerLoad } from './$types';
import { loadCmsOverrides } from '$lib/cms/load';

export const load: PageServerLoad = async () => {
  const cms = await loadCmsOverrides('home');
  return { cms };
};