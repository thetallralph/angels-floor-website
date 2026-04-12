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
				// Routes dynamiques et assets gérés par le serveur
				if (path.startsWith('/produits/') || path.startsWith('/admin/') ||
				    path.startsWith('/uploads/') || path.startsWith('/api/')) {
					return;
				}
				throw new Error(`404: ${path}`);
			},
			handleMissingId: 'warn'
		}
	}
};

export default config;
