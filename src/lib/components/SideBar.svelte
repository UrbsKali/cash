<script>
	// @ts-nocheck
	import { onMount, afterUpdate } from 'svelte';
	import { initFlowbite } from 'flowbite';
	import { config } from '$lib/config';
	import { navigating } from '$app/stores';


	export let menu = [{ title: 'fill me', icon: 'timer', uri: '/admin' }];
	let current_route = '';

	onMount(() => {
		loadSidebar();
	});
	afterUpdate(() => {
		loadSidebar();
	});


	navigating.subscribe((value) => {
		loadSidebar();
	});

	function loadSidebar() {
		current_route = config.basePath + window.location.pathname.slice(0, -1);
		menu = menu.map((item) => {
			if (item.uri === current_route) {
				item.active = true;
			} else {
				item.active = false;
			}
			return item;
		});
		initFlowbite();
	}
</script>

<section>
	<aside
		class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
		aria-label="Sidenav"
		id="drawer-navigation"
	>
		<div class="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
			<ul class="space-y-2">
				{#each menu as item}
					{#if item.sub}
						<li>
							<button
								type="button"
								class="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
								aria-controls="dropdown-pages"
								data-collapse-toggle="dropdown-pages-{item.title.toLowerCase()}"
							>
								<ion-icon name={item.icon} class=" text-2xl"></ion-icon>

								<span class="flex-1 ml-3 text-left whitespace-nowrap">{item.title}</span>
								<svg
									aria-hidden="true"
									class="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
							<ul id="dropdown-pages-{item.title.toLowerCase()}" class="hidden py-2 space-y-2">
								{#each item.sub as sub_item}
									<li>
										<a
											href={sub_item.uri}
											class="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
											>{sub_item.title}</a
										>
									</li>
								{/each}
							</ul>
						</li>
					{:else}
						<li>
							<a
								href={item.uri}
								class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {item.active
									? 'bg-gray-100 dark:bg-gray-700'
									: ''}"
							>
								<ion-icon name={item.icon} class=" text-2xl"></ion-icon>

								<span class="ml-3">{item.title}</span>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<div
			class="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-white dark:bg-gray-800 z-20"
		></div>
	</aside>
	<script
		type="module"
		src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
	></script>
	<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</section>

<style></style>
