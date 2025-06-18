<script>
	import { navigating } from '$app/stores';

	export let menu = [{ title: 'fill me', icon: 'timer', uri: '/admin' }];
	export let open = false;
	export let close = () => {};
	export let noicon = false;
	export let bgClass = 'bg-gray-800';
	export let activeClass = 'hover:bg-gray-700';

	let buttons_state = {};

	navigating.subscribe((value) => {
		if (value) {
			loadSidebar(value.to.route.id);
		}
	});

	function loadSidebar(path) {
		const current_route = path;
		menu = menu.map((item) => {
			if (item.uri === current_route) {
				item.active = true;
			} else {
				item.active = false;
			}
			return item;
		});
	}
</script>

<section>
	<aside
		class="fixed top-0 left-0 z-10 w-64 h-screen transition-transform md:translate-x-0 border-r pt-14 border-gray-700
			{!open ? '-translate-x-full' : 'translate-x-0'}"
		aria-label="Sidenav"
		id="drawer-navigation"
	>
		<div class="h-full px-3 py-5 overflow-y-auto {bgClass}">
			<ul class="space-y-2">
				{#each menu as item}
					{#if item.sub}
						<li>
							<button
								type="button"
								class="flex items-center w-full p-2 text-base font-medium text-white transition duration-75 rounded-lg group {activeClass}"
								on:click={() => {
									if (buttons_state[item.title] === undefined) {
										buttons_state[item.title] = false;
									}
									buttons_state[item.title] = !buttons_state[item.title];
								}}
							>
								{#if !noicon || !item.icon}
									<ion-icon name={item.icon} class="text-2xl"></ion-icon>
								{/if}

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
							<ul class="{buttons_state[item.title] ? '' : 'hidden'} py-2 space-y-2">
								{#each item.sub as sub_item}
									<li>
										<a
											href={sub_item.uri}
											class="flex items-center w-full p-2 text-base font-medium text-white transition duration-75 rounded-lg pl-11 group hover:bg-gray-700"
											on:click={() => {
												if (typeof close === 'function') close();
											}}>{sub_item.title}</a
										>
									</li>
								{/each}
							</ul>
						</li>
					{:else}
						<li>
							<a
								href={item.uri}
								class="flex items-center p-2 text-base font-medium rounded-lg text-white hover:bg-gray-700 group {item.active
									? 'bg-gray-700'
									: ''}"
								on:click={() => {
									if (typeof close === 'function') close();
								}}
							>
								{#if !noicon || !item.icon}
									<ion-icon name={item.icon} class="text-2xl"></ion-icon>
								{/if}
								<span class="ml-3">{item.title}</span>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<div
			class="absolute bottom-0 left-0 z-10 justify-center hidden w-full p-4 space-x-4 bg-gray-800 lg:flex"
		></div>
	</aside>
	<script
		type="module"
		src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
	></script>
	<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</section>

<style>
</style>
