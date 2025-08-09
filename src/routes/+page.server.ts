import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // This is just for the home page, no error needed
  return {};
};