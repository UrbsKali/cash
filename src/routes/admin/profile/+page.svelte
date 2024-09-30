<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { userdata } from '$lib/store';

	export let user = {
		name: 'Urbain',
		email: 'davincibot@devinci.fr',
		avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png'
	};

	userdata.subscribe((value) => {
		if (value) {
			user = value;
			loadPage().catch(console.error);
		}
	});

	async function loadPage() {
		console.log('loading page');
	}

	async function LogOut() {
		supabase.auth.signOut().then(() => {
			window.location.href = `${window.location.origin}/login`;
		});
	}
</script>

<h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Votre Profil</h2>

<div class="flex flex-col gap-5">
	<div
		id="user-profile"
        data-role={user.role}
		class="flex flex-col items-center justify-center w-full h-full p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white sm:w-1/2 sm:mx-auto lg:w-1/2"
	>
		<div
			class="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full dark:bg-gray-700"
		>
			<img src={user?.avatar} alt="avatar" class="w-32 h-32 rounded-full" />
		</div>
		<div class="mt-4 text-center">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{user?.email}
			</p>
		</div>

		<div>
			<!--Member of X project, role-->
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{user?.projectName?.join(', ')}
			</h3>
		</div>
	</div>
	<div
		class="flex flex-col items-center justify-center w-full h-full p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white sm:w-1/2 sm:mx-auto lg:w-1/2"
	>
		<!-- reset password button, log out-->
		<button
			class="w-full px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:focus:ring-primary-700"
			on:click={(e) => {
				e.preventDefault();
                window.location.href = `${window.location.origin}/password-reset?redirect=/admin/profile`;
			}}
		>
			Réinitialiser le mot de passe
		</button>
		<button
			class="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:focus:ring-red-700"
			on:click={LogOut}
		>
			Se déconnecter
		</button>
	</div>
</div>

<style>
    /* Add a after el to #user-profile, with the user role on the top right corner, and adjust color depending on the role */
    #user-profile {
        position: relative;
    }

    #user-profile::after {
        content: attr(data-role);
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.25rem 0.5rem;
        border-radius: 0 0.5rem 0 0.5rem;
    }
    #user-profile[data-role="admin"]::after {
        background-color: #f50b0b;
        color: #fff;
    }
    #user-profile[data-role="cdp"]::after {
        background-color: #10b981;
        color: #fff;
    }
    #user-profile[data-role="member"]::after {
        background-color: #3b82f6;
        color: #fff;
    }
    #user-profile[data-role="bureau"]::after {
        background-color: #ef4444;
        color: #fff;
    }

</style>