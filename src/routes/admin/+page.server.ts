import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Redirect to the static admin panel
  throw redirect(301, '/admin/index.html');
};