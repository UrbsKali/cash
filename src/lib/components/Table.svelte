<script>
	// @ts-nocheck
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { hashCode, saveSettings, loadSettings, hideOnClickOutside } from '$lib/utils';
	import { supabase } from '$lib/supabaseClient';
	import CrudForm from './CrudForm.svelte';
	import ReadModal from './ReadModal.svelte';

	export let actions = [];
	export let headers = ['Nom', 'Email', 'Rôle', 'Actions'];
	export let filters = [];
	export let dbInfo = {}; // { table: 'users', key: 'id, email, role'}

	export let type = 'utilisateur';
	export let type_accord = 'un';
	export let parseItems = null;
	export let size = 10;

	export let addNew = null;

	let hash = hashCode(dbInfo);
	let can_update_settings = false;

	const filtersStore = writable(filters);

	$: {
		filtersStore.set(filters);
		if (can_update_settings) saveSettings(hash, filters);
	}

	let items = [];
	let current_page = 0;
	let total_items = 0;
	let page = [];

	$: {
		page = [];
		if (items.length > 0) {
			for (let i = 0; i <= total_items / size; i++) {
				page = [...page, i + 1];
			}
		}
	}

	/**
	 * Load the page of items
	 * @param {number} page - The page number
	 * @param {string} filter - The filter to apply to the query (optional, default '')
	 * @param {number} step - The number of items per page (optional, default 5 items)
	 * @returns {none} - Sets the items variable
	 */
	async function loadPage(page, filter = '', step = size) {
		let items = [];

		let query = supabase.from(dbInfo.table).select(dbInfo.key, { count: 'estimated', head: false });

		if (filter) {
			filter = filter.split('&');
			for (let i = 0; i < filter.length; i++) {
				query = query.filter(...filter[i].split(':'));
			}
		}

		const { data, error, count } = await query.range(page * step, (page + 1) * step - 1);
		if (error) {
			console.error(error);
			return;
		}
		total_items = count;
		items = parseItems ? parseItems(data) : data;

		return items;
	}

	function getFiltersString(filters) {
		let filtersString = '';
		// remove el from array if active is false
		// copy array
		let tmp = JSON.parse(JSON.stringify(filters));
		tmp.forEach((el) => {
			el.options = el.options.filter((option) => option.active);
		});
		// create string
		tmp.forEach((el) => {
			if (el.options.length > 0) {
				filtersString += `${el.value}:in:("${el.options.map((option) => option.value).join('","')}")&`;
			}
		});
		return filtersString.slice(0, -1);
	}

	let mounted = false;
	let filter_state = false;

	filtersStore.subscribe(async (value) => {
		if (!mounted) return;
		const filtersString = getFiltersString(value);
		items = await loadPage(0, filtersString);
		current_page = 0;
	});

	onMount(async () => {
		let tmp = loadSettings(hash);
		if (tmp.length > 0) {
			filters = tmp;
		}
		items = await loadPage(0, getFiltersString(filters));
		mounted = true;

		const dropdown = document.querySelector('#filterDropdown-' + hash);
		setupDropdown();
		document.body.appendChild(dropdown);
	});

	function setupDropdown() {
		// set position of the popup just below the button
		const dropdown = document.querySelector('#filterDropdown-' + hash);
		const rect = document.getElementById('filterDropdownButton').getBoundingClientRect();
		dropdown.style.top = 'calc(' + rect.bottom + 'px + 0.5rem)';
		if (window.innerWidth < 768) {
			dropdown.style.left = rect.left + 'px';
			dropdown.style.width = rect.width + 'px';
		} else {
			dropdown.style.left = 'calc(' + rect.left + 'px - 1.5rem)';
		}
	}

	onresize = () => {
		setupDropdown();
	};

	onDestroy(() => {
		const dropdown = document.querySelector('#filterDropdown-' + hash);
		dropdown.remove();
	});
</script>

<section class="bg-gray-50 dark:bg-gray-900 sm:p-5">
	<div class="max-w-screen-xl mx-auto sm:px-4 lg:px-12">
		<div class="relative bg-white rounded-lg shadow-md dark:bg-gray-800">
			<div
				class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4"
			>
				<div class="w-full md:w-1/2">
					<form class="flex items-center">
						<label for="simple-search" class="sr-only">Rechercher</label>
						<div class="relative w-full">
							<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg
									aria-hidden="true"
									class="w-5 h-5 text-gray-500 dark:text-gray-400"
									fill="currentColor"
									viewbox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="simple-search"
								class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Search"
								required=""
							/>
						</div>
					</form>
				</div>
				<div
					class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3"
				>
					{#if addNew != null}
						<button
							type="button"
							class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
							id="addNewButton"
							on:click={addNew}
						>
							<svg
								class="h-3.5 w-3.5 mr-2"
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
							Ajouter {type_accord}
							{type}
						</button>
					{/if}
					<div class="flex items-center w-full space-x-3 md:w-auto">
						<button
							id="filterDropdownButton"
							class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
							type="button"
							on:click={(e) => {
								const el = document.querySelector('#filterDropdown-' + hash);
								el.classList.toggle('hidden');
								e.stopPropagation();
								hideOnClickOutside(el);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								class="w-4 h-4 mr-2 text-gray-400"
								viewbox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
									clip-rule="evenodd"
								/>
							</svg>
							Filtres
							<svg
								class="-mr-1 ml-1.5 w-5 h-5"
								fill="currentColor"
								viewbox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									clip-rule="evenodd"
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								/>
							</svg>
						</button>
						<div
							id="filterDropdown-{hash}"
							class="absolute z-10 hidden p-3 bg-white rounded-lg shadow md:w-48 dark:bg-gray-700 w-72"
						>
							{#each filters as filter, i}
								{#if filter.category != 'hidden'}
									{#if i > 0}
										<hr class="my-3 border-gray-200 dark:border-gray-600" />
									{/if}
									<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
										{filter.category}
									</h6>
									<ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
										{#each filter.options as option}
											<li class="flex items-center">
												<input
													id={option.name}
													type="checkbox"
													value={option.value}
													checked={option.active}
													class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
													on:change={(e) => {
														e.preventDefault();
														can_update_settings = true;
														console.log('can update localstorage');
														option.active = e.target.checked;
														filtersStore.set(filters);
													}}
												/>
												<label
													for={option.name}
													class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
													>{option.name}</label
												>
											</li>
										{/each}
									</ul>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							{#each headers as item}
								{#if item === 'Actions'}
									<th scope="col" class="px-4 py-3">
										<span class="sr-only">Actions</span>
									</th>
								{:else}
									<th scope="col" class="px-4 py-3">{item}</th>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each items as item, i}
							<tr class="border-b dark:border-gray-700">
								{#each item as key}
									{#if key.value === item[0].value && headers[0] === 'Nom'}
										<th
											scope="row"
											class="flex items-center px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
											data-utils={key.data || ''}
										>
											{#if key.avatar}
												<div class="flex items-center mr-2 space-x-2">
													<img src={key.avatar} class="w-8 h-8 rounded-full" alt="user face" />
												</div>
											{/if}
											{key.value}</th
										>
									{:else}
										<td class="px-4 py-3" data-utils={key.data || ''}>{key.value}</td>
									{/if}
								{/each}
								{#if actions.length > 0}
									<td class="flex items-center justify-end px-4 py-3">
										<button
											id="{i}-dropdown-button"
											data-dropdown-toggle="{i}-dropdown"
											class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
											type="button"
											on:click={(e) => {
												actions.find((el) => el.type == 'view').handler(e);
											}}
										>
											<svg
												class="w-5 h-5"
												aria-hidden="true"
												fill="currentColor"
												viewbox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
												/>
											</svg>
										</button>
									</td>
								{/if}
							</tr>{/each}
					</tbody>
				</table>
			</div>
			<nav
				class="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
				aria-label="Table navigation"
			>
				<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
					Showing
					<span class="font-semibold text-gray-900 dark:text-white">{items.length}</span>
					of
					<span class="font-semibold text-gray-900 dark:text-white">{total_items}</span>
				</span>
				<ul class="inline-flex items-stretch -space-x-px">
					<li>
						<a
							href="#"
							class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
							on:click={async (e) => {
								e.preventDefault();
								current_page--;
								if (current_page < 0) current_page = 0;
								items = await loadPage(current_page, getFiltersString(filters));
							}}
						>
							<span class="sr-only">Previous</span>
							<svg
								class="w-5 h-5"
								aria-hidden="true"
								fill="currentColor"
								viewbox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</li>
					{#if page.length < 5}
						{#each page as p}
							{#if p == current_page + 1}
								<li>
									<a
										href="#"
										aria-current="page"
										class="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
										>{p}</a
									>
								</li>
							{:else}
								<li>
									<a
										href="#"
										class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
										on:click={async (e) => {
											e.preventDefault();
											current_page = p - 1;
											items = await loadPage(current_page, getFiltersString(filters));
										}}>{p}</a
									>
								</li>
							{/if}
						{/each}
					{:else}
						{#if current_page != 0}
							<li>
								<a
									href="#"
									class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
									on:click={async (e) => {
										e.preventDefault();
										current_page = 0;
										items = await loadPage(current_page, getFiltersString(filters));
									}}>{1}</a
								>
							</li>
						{/if}
						<li>
							<a
								href="#"
								aria-current="page"
								class="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
								>{current_page + 1}</a
							>
						</li>
						{#if current_page != page.length - 1}
							<li>
								<a
									href="#"
									class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
									on:click={async (e) => {
										e.preventDefault();
										current_page = page.length - 1;
										items = await loadPage(current_page, getFiltersString(filters));
									}}>{page.length}</a
								>
							</li>
						{/if}
					{/if}

					<li>
						<a
							href="#"
							class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
							on:click={async (e) => {
								e.preventDefault();
								current_page++;
								if (current_page >= total_items / size) current_page = total_items / size - 1;
								items = await loadPage(current_page, getFiltersString(filters));
							}}
						>
							<span class="sr-only">Next</span>
							<svg
								class="w-5 h-5"
								aria-hidden="true"
								fill="currentColor"
								viewbox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</section>

<style></style>
