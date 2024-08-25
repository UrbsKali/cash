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
			allowed_roles: ['admin', 'bureau', 'cdp', "membre"]
		},
		{
			title: 'Gestion des projets',
			icon: 'cube-outline',
			allowed_roles: ['admin', 'bureau', 'cdp'],
			sub: [
				{
					title: 'Coupe de France',
					uri: '/admin/wip'
				},
				{
					title: 'Exaudus',
					uri: '/admin/wip'
				},
				{
					title: 'Mate Rov',
					uri: '/admin/wip'
				},
				{
					title: 'Travelers',
					uri: '/admin/wip'
				}
			]
		},
		{
			title: 'Commandes',
			uri: '/admin/orders',
			icon: 'cash-outline',
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
			icon: 'pie-chart-outline',
			allowed_roles: ['admin', 'bureau']
		}
	];

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

		if (!menu.find((el) => el.uri == uri)?.allowed_roles.includes(current_role)) {
			// check if the uri is inside a sub menu
			let found = false;
			menu.forEach((el) => {
				if (!el.sub) return;
				if (el.sub.find((el) => el.uri == uri)) {
					found = true;
				}
			});
			if (!found) window.location.href = `${currentOrigin()}/`;
			// else refer to allowed roles of the parent
			else {
				let parent = menu.find((el) => el.sub?.find((el) => el.uri == uri));
				if (!parent.allowed_roles.includes(current_role)) {
					window.location.href = `${currentOrigin()}/`;
				}
			}
		}

		menu.forEach((el) => {
			if (!el.allowed_roles.includes(current_role)) return;
			__menu = [...__menu, el];
		});
	});
</script>

<div class="antialiased bg-gray-50 dark:bg-gray-900">
	<nav
		class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50"
	>
		<div class="flex flex-wrap justify-between items-center">
			<div class="flex justify-start items-center">
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
					<img src="/white_logo_notext.webp" class="mr-3 h-8" alt="Davincibot Logo" />
					<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
						>DaVinciBot</span
					>
				</a>
			</div>
			<div class="flex items-center lg:order-2">
				<UserBadge />
			</div>
		</div>
	</nav>

	<!-- Sidebar -->
	<SideBar menu={__menu} />

	<main class="p-4 md:ml-64 min-h-screen pt-20">
		<slot />
	</main>
</div>
