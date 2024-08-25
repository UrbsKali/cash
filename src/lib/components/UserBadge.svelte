<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { config } from '$lib/config';
	import { initFlowbite } from 'flowbite';

	export let user = {
		name: 'Mascode',
		email: 'mascode@oblivion-esport.fr',
		avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png'
	};

	onMount(async () => {
		const {
			data: { session },
			error
		} = await supabase.auth.getSession();
		if (error) {
			console.error(error);
			return;
		}
		if (session) {
			// fetch user data
			const { data, error } = await supabase
				.from('profiles')
				.select('username,avatar_url')
				.eq('id', session.user.id)
				.single();
			if (error) {
				console.error(error);
				return;
			}
			user.email = session.user.email || user.email;
			user.name = data.username || user.email.split('@')[0];
			user.avatar = data.avatar_url || user.avatar;
			initFlowbite();
		}
	});

	const LogOut = () => {
		supabase.auth.signOut().then(() => {
			window.location.href = `${window.location.origin}${config.basePath}/login?redirect=${window.location.pathname}`;
		});
	};
</script>

<button
	type="button"
	class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
	id="user-menu-button"
	aria-expanded="false"
	data-dropdown-toggle="dropdown"
>
	<span class="sr-only">Open user menu</span>
	<img class="w-8 h-8 rounded-full" src={user.avatar} alt="user photo" />
</button>
<!-- Dropdown menu -->
<div
	class="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
	id="dropdown"
>
	<div class="py-3 px-4">
		<span class="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
		<span class="block text-sm text-gray-900 truncate dark:text-white">{user.email}</span>
	</div>
	<ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="#"
				class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
				>Profil</a
			>
		</li>
		<li>
			<a
				href="#"
				class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
				>Paramètres</a
			>
		</li>
	</ul>
	<ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="#"
				class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				on:click={LogOut}>Déconnexion</a
			>
		</li>
	</ul>
</div>

<style></style>
