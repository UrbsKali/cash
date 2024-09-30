<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import UserBadge from '$lib/components/UserBadge.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { config, currentOrigin, parseURI } from '$lib/config';

	let current_user = {};
	let current_role = '';

	let menu = [
		{
			title: 'Accueil',
			uri: '/admin',
			icon: 'home-outline',
			allowed_roles: ['admin', 'bureau', 'cdp', 'membre']
		},
		{
			title: 'Gestion des projets',
			icon: 'apps-outline',
			allowed_roles: ['admin', 'bureau', 'cdp'],
			sub: [
				{
					title: 'Coupe de France',
					uri: '/admin/projects/1'
				},
				{
					title: 'Travelers',
					uri: '/admin/projects/2'
				},
				{
					title: 'Exaudus',
					uri: '/admin/projects/3'
				}
			]
		},
		{
			title: 'Commandes',
			uri: '/admin/orders',
			icon: 'card-outline',
			allowed_roles: ['admin', 'bureau', 'cdp']
		},
		{
			title: 'Gestion des membres',
			uri: '/admin/users',
			icon: 'people-outline',
			allowed_roles: ['admin', 'bureau']
		},
		{
			title: 'Gestion de la trésorerie',
			uri: '/admin/wip',
			icon: 'bar-chart-outline',
			allowed_roles: ['admin', 'bureau']
		},
		{
			title: 'Factures',
			uri: '/admin/wip',
			icon: 'attach-outline',
			allowed_roles: ['admin', 'bureau']
		},
		{
			title: 'Devis',
			uri: '/admin/wip',
			icon: 'briefcase-outline',
			allowed_roles: ['admin', 'bureau']
		},
	];

	let custom_uri = [
		{
			title: 'Nouvelle commande',
			uri: '/admin/orders/new',
			icon: 'add-outline',
			allowed_roles: ['admin', 'bureau', 'cdp', 'membre']
		}
	]

	

	let __menu = [];
	menu = parseURI(menu);

	onMount(async () => {
		{
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error(error);
				window.location.href = `${currentOrigin()}/login?redirect=${window.location.pathname}`;
			}
			current_user = data.user;
		}
		{
			const { data, error } = await supabase
				.from('profiles')
				.select('role')
				.eq('id', current_user.id);
			if (error) {
				console.error(error);
				window.location.href = `${currentOrigin()}/`;
			}
			current_role = data[0].role;
		}
		// remove trailing slash if present
		const uri = window.location.pathname.endsWith('/')
			? window.location.pathname.slice(0, -1)
			: window.location.pathname;

		// get the allowed roles for the current uri
		const allowed_roles = searchAllowedRoles([...menu, ...custom_uri], uri);
		if (!allowed_roles.includes(current_role)) {
			window.location.href = `${currentOrigin()}/`;
		}

		menu.forEach((el) => {
			if (!el.allowed_roles.includes(current_role)) return;
			__menu = [...__menu, el];
		});
	});

	function searchAllowedRoles(menu, uri) {
		let roles = [];
		menu.forEach((el) => {
			if (el.uri == uri) {
				roles = el.allowed_roles;
			}
			if (el.sub) {
				el.sub.forEach((el) => {
					if (el.uri == uri) {
						roles = el.allowed_roles;
					}
				});
			}

			// if the params uri is a children of the current uri, save the roles
			if (el.uri == uri.split('/').slice(0, -1).join('/')) {
				roles = el.allowed_roles;
			}
		});
		return roles;
	}
</script>

<div class="min-h-screen overflow-hidden antialiased bg-gray-50 dark:bg-gray-900 min-w-screen" >
	<nav
		class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50 w-screen"
	>
		<div class="flex flex-wrap items-center justify-between">
			<div class="flex items-center justify-start">
				<button
					data-drawer-target="drawer-navigation"
					data-drawer-toggle="drawer-navigation"
					aria-controls="drawer-navigation"
					class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>
					<svg
						aria-hidden="true"
						class="w-6 h-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<svg
						aria-hidden="true"
						class="hidden w-6 h-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="sr-only">Toggle sidebar</span>
				</button>
				<a href="/admin" class="flex items-center justify-between mr-4">
					<img src="/white_logo_notext.webp" class="h-8 mr-3" alt="Davincibot Logo" />
					<span class="self-center hidden text-2xl font-semibold whitespace-nowrap dark:text-white sm:block"
						>DaVinciBot</span
					>
				</a>
			</div>

			<div class="flex items-center lg:order-2">
				<a
					type="button"
					class="flex items-center justify-center p-2 py-2 mr-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:px-4 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
					href="/admin/orders/new"
				>
					<svg
						class="h-3.5 w-3.5 sm:mr-2"
						fill="currentColor"
						viewbox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						/>
					</svg>
					<span class="hidden sm:block">Faire une commande</span>
				</a>
				<UserBadge />
			</div>
		</div>
	</nav>

	<!-- Sidebar -->
	<SideBar menu={__menu} />

	<main class="min-h-screen p-4 pt-20 md:ml-64">
		<slot />
	</main>
</div>

<style>
</style>
