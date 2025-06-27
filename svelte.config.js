// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import adapter from '@sveltejs/adapter-static';



/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			entries: [
				'/',
				'/blog',
				'/sponsors',
				'/contact',
				'/admin',
				'/caroussel',
				'/auth/sign-up',
				'/auth/login',
				'/auth/oauth',
				'/auth/reset',
				'/auth/reset/callback',
				'/admin/projects/1',
				'/admin/projects/2',
				'/admin/projects/3',
				// '/admin/projects/4',
				// '/admin/projects/5',
				// '/admin/projects/6',
				// '/admin/projects/8',
				'/admin/orders',
				'/admin/screen-share',
				'/admin/treso',
				'/admin/orders/new',
				'/admin/users/',
				'/admin/wip',
				'/admin/profile',
			]
		}
	},
	preprocess: vitePreprocess(),

};

export default config;
