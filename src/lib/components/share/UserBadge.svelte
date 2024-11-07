<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { loadUserdata, hideOnClickOutside } from '$lib/utils';
	import { userdata } from '$lib/store';

	export let user = {
		name: 'Urbain',
		email: 'davincibot@devinci.fr',
		avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png'
	};

	export let fixed = true;

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

	onMount(async () => {
		const dropdown = document.querySelector('#dropdown');
		setupDropdown();
		document.body.appendChild(dropdown);

		onresize = () => {
			setupDropdown();
		};

		if (skip) return;
		await loadUserdata();
	});

	const LogOut = () => {
		supabase.auth.signOut().then(() => {
			window.location.href = `/`;
		});
	};
</script>

<button
	type="button"
	class="flex mx-3 text-sm bg-gray-800 rounded-full focus:ring-3 focus:ring-gray-700 md:mr-0"
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
	<img class="w-8 h-8 rounded-full" src={user.avatar} alt="user avatar" />
</button>
<!-- Dropdown menu -->
<div
	class="{fixed
		? 'fixed'
		: 'absolute'} z-50 hidden w-56 my-4 text-base list-none bg-gray-900 divide-y divide-gray-700 shadow bg-opacity-20 rounded-xl backdrop-blur-lg border border-gray-700 overflow-hidden"
	id="dropdown"
>
	<div class="px-4 py-3">
		<span class="block text-sm font-semibold text-white">{user.name}</span>
		<span class="block text-sm text-white truncate">{user.email}</span>
	</div>
	<ul class="py-1 text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="/user/"
				class="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white bg-opacity-80">Profil</a
			>
		</li>
		<li>
			<a
				href="/user/notifications"
				class="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white bg-opacity-80"
				>Notifications</a
			>
		</li>
		<li>
			<a
				href="/user/settings"
				class="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white bg-opacity-80"
				>Paramètres</a
			>
		</li>
	</ul>
	{#if ['membre', 'admin', 'cdp', 'bureau'].includes(user?.role)}
		<ul class="py-1 text-gray-300" aria-labelledby="dropdown">
			<li>
				<a
					href="/admin/"
					class="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white bg-opacity-80"
					>Pannel Admin</a
				>
			</li>
		</ul>
	{/if}
	<ul class="py-1 text-gray-300" aria-labelledby="dropdown">
		<li>
			<a
				href="#"
				class="block px-4 py-2 text-sm hover:bg-red-700 hover:text-white bg-opacity-80 hover:bg-opacity-50"
				on:click={LogOut}>Déconnexion</a
			>
		</li>
	</ul>
</div>

<style></style>
