<script>
	import { supabase } from '$lib/supabaseClient';
	import { userdata } from '$lib/store';
	import { goto } from '$app/navigation';

	import InfoModal from '$lib/components/modals/InfoModal.svelte';

	let items = [0];
	let current = 0;
	let projectId = -1;
	let projectTitle = {};

	let name = '';

	async function updateProjectTitle() {
		const { data: projects, error } = await supabase.from('projects').select().in('id', projectId);
		if (error) {
			console.error(error);
			return;
		}
		projects.forEach((project) => {
			projectTitle[project.id] = project.name;
		});
	}

	userdata.subscribe((value) => {
		projectId = value?.projectId;
		if (projectId?.length > 0) {
			updateProjectTitle();
		}
		name = value?.name;
	});

	async function onSubmit(e) {
		e.preventDefault();

		if (projectId === -1) {
			alert('Vous devez être connecté à un projet pour pouvoir passer une commande.');
			return;
		}

		const form = e.target.form;
		const data = new FormData(form);
		const object = {};
		data.forEach((value, key) => {
			object[key] = value;
		});

		let itemsArr = Array.from(document.querySelectorAll('.objects'));

		object.items = itemsArr.map((i) => {
			const item = {};
			const itemData = new FormData(i);
			itemData.forEach((value, key) => {
				item[key] = value;
			});
			return item;
		});

		if (object.items.length === 0) {
			alert('Vous devez ajouter au moins un objet.');
			return;
		}
		// check if one of the items is empty
		for (let i = 0; i < object.items.length; i++) {
			if (
				object.items[i].name === '' ||
				object.items[i].lien === '' ||
				object.items[i].price === '' ||
				object.items[i].quantity === '' ||
				object.items[i].price == '0' ||
				object.items[i].quantity == '0'
			) {
				alert('Vous devez remplir tous les champs pour chaque objet.');
				return;
			}
		}

		const order = {
			comment: object.comment,
			projectId: projectId.length > 1 ? object.project : projectId[0],
			name: object.items.reduce((acc, item) => (acc || '') + item.name + ', ', 0).slice(0, -2)
		};

		const { data: orders, error } = await supabase.from('orders').insert([order]).select();
		if (error) {
			console.error(error);
			return;
		}

		// insert items
		const items_ = object.items.map((i) => {
			return {
				name: i.name,
				link: i.lien,
				price: i.price,
				order_id: orders[0].id,
				quantity: i.quantity
			};
		});
		{
			const { error } = await supabase.from('items').insert(items_);
			if (error) {
				console.error(error);
				return;
			}
		}
		new InfoModal({
			target: document.body,
			props: {
				message: 'La commande a été proposé avec succès.',
				type: 'success',
				onClose: () => {
					goto('/admin/');
				}
			}
		});
	}
</script>

<h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
	Nouvelle Commande
</h2>
<div class="sm:ml-10">
	<h3 class="text-2xl font-bold tracking-tight text-gray-900 sm:mb-2 dark:text-white">Objets</h3>
	<form>
		<div class="sm:pl-5">
			{#each items as i}
				<div class="flex flex-col items-center sm:flex-row">
					<div class="w-20 my-5 sm:mr-5">
						<a
							type="button"
							class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all border-2 border-gray-100 border-dashed rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-600 hover:border-transparent focus:outline-none dark:focus:ring-primary-800"
							href=""
							on:click={(e) => {
								e.preventDefault();
								items = items.filter((item) => item !== i);
							}}
						>
							-
						</a>
					</div>
					<form class="grid w-full grid-flow-row gap-5 objects md:grid-flow-col">
						<div>
							<label for="name">Nom</label>
							<input
								type="text"
								name="name"
								id="name"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Vis"
								required=""
								value=""
							/>
						</div>
						<div>
							<label for="lien">Lien</label>
							<input
								type="text"
								name="lien"
								id="lien"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="https://fr.rs-online.com/web/"
								required=""
								value=""
							/>
						</div>
						<div>
							<label for="price">Prix</label>
							<div class="flex">
								<input
									type="number"
									name="price"
									id="price"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-2.5 pl-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="15.5"
									required="true"
									value=""
									step="0.01"
									min="0"
								/>
								<div
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-primary-600 focus:border-primary-600 block w-7 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
								>
									€
								</div>
							</div>
						</div>
						<div>
							<label for="quantity">Quantité</label>
							<input
								type="number"
								name="quantity"
								id="quantity"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="5"
								required="true"
								value=""
								step="1"
								min="1"
							/>
						</div>
					</form>
				</div>
			{/each}

			<div class="my-5">
				<a
					type="button"
					class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all border-2 border-gray-100 border-dashed rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-600 hover:border-transparent focus:outline-none dark:focus:ring-primary-800"
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
		<h3 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Détails</h3>
		<div class="grid gap-5 ml-5 details">
			<div class="col-span-2">
				<label for="comment">Commentaire</label>
				<textarea
					name="comment"
					id="comment"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="Commentaire"
				></textarea>
			</div>
			{#if projectId?.length > 1}
				<div class="col-span-2">
					<label for="project">Sélection du projet</label>
					<select
						name="project"
						id="project"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					>
						{#each Object.entries(projectTitle) as [key, value]}
							<option value={key}>{value}</option>
						{/each}
					</select>
				</div>
			{/if}

			<div class="col-span-2">
				<button
					type="submit"
					class="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-600 hover:border-transparent focus:outline-none dark:focus:ring-primary-800"
					on:click={onSubmit}>Envoyer</button
				>
			</div>
		</div>
	</form>
</div>

<style>
	.objects {
		grid-template-columns: 1fr 2fr 90px 90px;
	}
	@media (max-width: 640px) {
		.objects {
			grid-template-columns: 1fr;
		}
	}
	.details {
		grid-template-columns: 1fr 1fr;
	}
</style>
