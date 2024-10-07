<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { config } from '$lib/config';
	import { loadUserdata, hideOnClickOutside } from '$lib/utils';
	import { userdata } from '$lib/store';

	export let user = {
		name: 'Urbain',
		email: 'davincibot@devinci.fr',
		avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png'
	};

	let skip = false;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
			skip = true;
		}
	});

	function setupDropdown() {
		// set position of the popup just below the button
		const dropdown = document.querySelector('#dropdown');
		const rect = document.querySelector('#user-menu-button').getBoundingClientRect();
		dropdown.style.top = 'calc(' + rect.bottom + 'px - 0.25rem)';
		dropdown.style.left = 'calc(' + rect.left + 'px - 12.05rem)';
	}

	onresize = () => {
		setupDropdown();
	};	

	onMount(async () => {
		const dropdown = document.querySelector('#dropdown');
		setupDropdown();
		document.body.appendChild(dropdown);

		if (skip) return;
		await loadUserdata();
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
	on:click={(e) => {
		const dropdown = document.querySelector('#dropdown');
		dropdown.classList.toggle('hidden');
		e.stopPropagation();
		hideOnClickOutside(dropdown);
	}}
>
	<span class="sr-only">Open user menu</span>
	<img class="w-8 h-8 rounded-full" src={user.avatar} alt="user photo" />
</button>
<!-- Dropdown menu -->
<div
	class="absolute z-50 hidden w-56 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
	id="dropdown"
>
	<div class="px-4 py-3">
		<span class="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
		<span class="block text-sm text-gray-900 truncate dark:text-white">{user.email}</span>
	</div>
	<ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="/admin/profile"
				class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				>Profil</a
			>
		</li>
		<li>
			<a
				href="#"
				class="block px-4 py-2 text-sm hover:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-400"
				>Work in progress..</a
			>
		</li>
	</ul>
	<ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="#"
				class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				on:click={LogOut}>Déconnexion</a
			>
		</li>
	</ul>
</div>

<style></style>
