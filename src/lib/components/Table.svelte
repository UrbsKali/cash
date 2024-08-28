<script>
	// @ts-nocheck
	import { onMount, afterUpdate } from 'svelte';
	import { initFlowbite } from 'flowbite';
	import CrudForm from './CrudForm.svelte';
	import ReadModal from './ReadModal.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let headers = ['Nom', 'Email', 'Rôle', 'Actions'];
	export let total_items = 0;
	export let actions = [
		{ type: 'delete', title: 'Supprimer', icon: 'trash', handler: (e) => {} }
		//{ type: 'edit', title: 'Editer', icon: 'edit', handler: (e) => {} }
		//{ type: 'view', title: 'Voir plus', icon: 'eyes', handler: (e) => {} }
	];
	export let type = 'utilisateur';
	export let type_accord = 'un';
	
	// CrudForm props and methods
	export let fields = [];
	export let onSubmit = null;
	export let onEdit = null;
	export let loadPage = null;
	
	let items = [];
	let current_page = 1;
	let page = [];

	$: {
		page = [];
		for (let i = 1; i <= total_items / items.length; i++) {
			page.push(i);
		}
	}

	let selectedHandler = (e) => {
		console.log(e);
	};
	let selectedAction = 'Ajouter';

	$: if (headers[headers.length - 1] == 'Actions') {
		items.forEach((item) => {
			if (item[item.length - 1] != 'Actions') item.push('Actions');
		});
	}

	onMount(async () => {
		items = await loadPage(0);
		initFlowbite();
	});
	afterUpdate(() => {
		initFlowbite();
	});
</script>

<section class="bg-gray-50 dark:bg-gray-900 sm:p-5">
	<div class="mx-auto max-w-screen-xl sm:px-4 lg:px-12">
		<div class="bg-white dark:bg-gray-800 relative shadow-md rounded-lg ">
			<div
				class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
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
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Search"
								required=""
							/>
						</div>
					</form>
				</div>
				<div
					class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
				>
					{#if onSubmit != null}
						<button
							type="button"
							class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
							id="CrudModalButton"
							data-modal-target="CrudModal"
							data-modal-toggle="CrudModal"
							on:click={(e) => {
								selectedAction = 'Ajouter';
								selectedHandler = onSubmit;
								const modal = FlowbiteInstances.getInstance('Modal', 'CrudModal');
								modal.show();
							}}
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
					<div class="flex items-center space-x-3 w-full md:w-auto">
						<button
							id="filterDropdownButton"
							data-dropdown-toggle="filterDropdown"
							class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								class="h-4 w-4 mr-2 text-gray-400"
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
							id="filterDropdown"
							class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
						>
							<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">WIIIIP</h6>
							<ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
								<li class="flex items-center">
									<input
										id="apple"
										type="checkbox"
										value=""
										class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
									/>
									<label
										for="apple"
										class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">CDR</label
									>
								</li>
								<li class="flex items-center">
									<input
										id="fitbit"
										type="checkbox"
										value=""
										class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
									/>
									<label
										for="fitbit"
										class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
										>Travelers</label
									>
								</li>
							</ul>
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
											class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
											data-utils={key.data || ''}
										>
											{#if key.avatar}
												<div class="flex items-center space-x-2 mr-2">
													<img src={key.avatar} class="rounded-full w-8 h-8" alt="user face" />
												</div>
											{/if}
											{key.value}</th
										>
									{:else if key.value === item[item.length - 1].value && headers[headers.length - 1] === 'Actions' && item.length > 2}
										<td class="px-4 py-3 flex items-center justify-end">
											<button
												id="{i}-dropdown-button"
												data-dropdown-toggle="{i}-dropdown"
												class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
												type="button"
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
											<div
												id="{i}-dropdown"
												class="hidden z-20  w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
											>
												<ul
													class="py-1 text-sm text-gray-700 dark:text-gray-200"
													aria-labelledby="{i}-dropdown-button"
												>
													{#each actions as item}
														<div class="py-1">
															<a
																href="#"
																on:click={async (e) => {
																	if (item.type === 'delete') {
																		selectedAction = 'Supprimer';
																	} else if (item.type === 'edit') {
																		selectedAction = 'Editer';
																		selectedHandler = onEdit;
																	}
																	await item.handler(e);
																}}
																class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
																>{item.title}</a
															>
														</div>
													{/each}
												</ul>
											</div>
										</td>
									{:else}
										<td class="px-4 py-3" data-utils={key.data || ''}>{key.value}</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<nav
				class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
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
					{#each page as p}
						<li>
							{#if p == current_page}
								<a
									href="#"
									aria-current="page"
									class="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
									>{p}</a
								>
							{:else}
								<a
									href="#"
									class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
									>{p}</a
								>
							{/if}
						</li>
					{/each}

					<li>
						<a
							href="#"
							class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
	<CrudForm {type} {fields} {type_accord} action={selectedAction} onSubmit={selectedHandler} />
	<ReadModal />
</section>

<style></style>
