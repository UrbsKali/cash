<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';

	let items = [0];
	let current = 0;
</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
	Nouvelle Commande
</h2>
<div class="ml-10">
	<h3 class=" mb-2 text-2xl tracking-tight font-bold text-gray-900 dark:text-white">Objets</h3>
	<div class="pl-5">
		{#each items as i}
			<div class="flex flex-col sm:flex-row items-center">
				<div class="my-5 w-20 sm:mr-5">
					<a
						type="button"
						class="flex items-center justify-center text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-primary-600 hover:border-transparent transition-all focus:outline-none dark:focus:ring-primary-800 border-dashed border-2 border-gray-100"
						href=""
						on:click={(e) => {
							e.preventDefault();
							items = items.filter((item) => item !== i);
						}}
					>
						-
					</a>
				</div>
				<div class="grid md:grid-flow-col gap-5 grid-flow-row w-full">
					<div>
						<label for="brand">Nom</label>
						<input
							type="text"
							name="brand"
							id="brand"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="bgvdcgbv"
							required=""
							value=""
						/>
					</div>
					<div>
						<label for="brand">Lien</label>
						<input
							type="text"
							name="brand"
							id="brand"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="bgvdcgbv"
							required=""
							value=""
						/>
					</div>
					<div>
						<label for="brand">Prix</label>
						<input
							type="number"
							name="brand"
							id="brand"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="15.5"
							required="true"
							value=""
						/>
					</div>
				</div>
			</div>
		{/each}

		<div class="my-5">
			<a
				type="button"
				class="flex items-center justify-center text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-primary-600 hover:border-transparent transition-all focus:outline-none dark:focus:ring-primary-800 border-dashed border-2 border-gray-100"
				href=""
				on:click={(e) => {
					e.preventDefault();
					items = [...items, current + 1];
					current = current + 1;
				}}
			>
				<svg
					class="h-3.5 w-3.5 fill-gray-100"
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
			</a>
		</div>
	</div>
	<h3 class=" mb-2 text-2xl tracking-tight font-bold text-gray-900 dark:text-white">Détails</h3>
</div>

<style></style>
