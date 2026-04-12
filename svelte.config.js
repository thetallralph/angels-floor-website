import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			strict: false
		}),
		prerender: {
			handleHttpError: ({ path }) => {
				// Les routes dynamiques seront gérées par le fallback SPA
				if (path.startsWith('/produits/') || path.startsWith('/admin/')) {
					return;
				}
				throw new Error(`404: ${path}`);
			},
			handleMissingId: 'warn'
		}
	}
};

export default config;
