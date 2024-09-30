import adapter from '@sveltejs/adapter-auto';

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
				'/admin',
				'/sign-up',
				'/login',
				'/password-reset',
				'/debug',
				'/admin/projects/1',
				'/admin/projects/2',
				'/admin/projects/3',
				'/admin/orders',
				'/admin/orders/new',
				'/admin/users/',
				'/admin/wip',
				'/admin/profile',
			]
		}
	}
};

export default config;
