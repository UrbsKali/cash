<script>
	import { userdata } from '$lib/store';
	import { loadUserdata } from '$lib/utils';
	import { onMount } from 'svelte';
	import UserBadge from './UserBadge.svelte';
	import { page } from '$app/stores';

	let user;
	let skip = false;
	let enable_cursor = true;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
		}
	});

	page.subscribe((value) => {
		// only client side
		if (typeof window !== 'undefined') {
			enable_cursor = document.querySelector('.cursor') != null;
			if (!enable_cursor) {
				document.addEventListener('DOMContentLoaded', () => {
					enable_cursor = document.querySelector('.cursor') != null;
				});
			}
		}
	});

	onMount(async () => {
		if (!skip) await loadUserdata();
		enable_cursor = document.querySelector('.cursor') != null;
		// check after full page load
		if (!enable_cursor) {
			document.addEventListener('DOMContentLoaded', () => {
				enable_cursor = document.querySelector('.cursor') != null;
			});
		}
	});
</script>

<section class={enable_cursor ? 'enable-cursor' : ''}>
	<nav
		class="border-b px-4 py-2.5 border-gray-700 fixed left-0 right-0 top-0 z-50 backdrop-blur-lg"
	>
		<div class="flex flex-wrap items-center justify-between">
			<div class="flex items-center justify-start">
				<button
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
				<a href="/" class="flex items-center justify-between mr-4">
					<img src="/white_logo.webp" class="h-12 mr-3" alt="DaVinciBot Logo" />
					<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
				</a>
			</div>
			<div class="items-center hidden md:flex">
				<ul class="flex gap-10">
					<li>
						<a
							href="/"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>Actus</a
						>
					</li>
					<li>
						<a
							href="/tournaments"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>Tournois</a
						>
					</li>
					<li>
						<a
							href="/"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>Staff</a
						>
					</li>

					<li>
						<a
							href="/"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>Contact</a
						>
					</li>
				</ul>
			</div>
			<div class="gap-5">
				{#if user}
					<UserBadge />
				{:else}
					<a
						class="inline-flex items-center px-3 py-2 m-auto text-sm font-medium text-center text-white border border-white rounded-lg focus:ring-4 focus:ring-white focus:outline-none bg-opacity-10 hover:bg-gray-900"
						href="/register"
					>
						Register
					</a>
					<a
						class="inline-flex items-center px-3 py-2 m-auto text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
						href="/login"
					>
						Login
					</a>
				{/if}
			</div>
		</div>
	</nav>
</section>

<style>
</style>
