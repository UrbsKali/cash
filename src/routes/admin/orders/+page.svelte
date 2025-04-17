<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { statusText, loadUserdata } from '$lib/utils';
	import { userdata } from '$lib/store';

	import ReadModal from '$lib/components/modals/ReadModal.svelte';
	import Table from '$lib/components/admin/Table.svelte';

	let user;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
		}
	});

	let headers = ['Objet', 'Date', 'Dernière MàJ', 'Prix', 'Projet', 'Membre', 'Status', 'Actions'];
	let dbInfo = {
		table: 'orders',
		key: 'id, creationDate, projectId(id, name), status, lastUpdate, items(*), requestedBy(*), name',
		ordering: 'lastUpdate:desc'
	};

	let filters = [
		{
			category: 'Projet',
			value: 'projectId',
			options: [
				{ name: 'CDR', value: '1', active: true },
				{ name: 'Travelers', value: '2', active: true },
				{ name: 'Exodus', value: '3', active: true },
				{ name: 'Pôle Event', value: '6', active: true },
				{ name: 'Pôle Com', value: '4', active: true },
				{ name: 'Pôle Formation', value: '5', active: true },
				{ name: 'Bureau', value: '8', active: true },
				{ name: 'Mini-projets', value: '9', active: true }
			]
		},
		{
			category: 'Status',
			value: 'status',
			options: [
				{ name: 'En attente', value: 'pendingCDP","pendingTreso' },
				{ name: 'Validé par le CDP', value: 'approvedCDP', active: true },
				{ name: 'A commander', value: 'approvedTreso' },
				{ name: 'Commandé', value: 'ordered' },
				{ name: 'Terminé', value: 'completed' },
				{ name: 'Refusé', value: 'canceled","refusedTreso","refusedCDP' }
			]
		}
	];

	let actions = [
		{
			title: 'Voir',
			type: 'view',
			handler: async (e) => {
				// get the info from the order
				const id = e.target.closest('tr').querySelector('th').dataset.utils;

				const { data, error } = await supabase
					.from('orders')
					.select('id, creationDate, projectId, status, lastUpdate, items(*), comment')
					.eq('id', id)
					.single();

				if (error) {
					console.error(error);
					return;
				}
				const price = data.items.reduce((acc, item, i) => acc + item.price * item.quantity, 0);
				const name = data.items.map((item) => item.name).join(', ');

				let items = [];
				data.items.forEach((item, i) => {
					items.push({
						name: item.name,
						quantity: item.quantity,
						price: `${item.price} €`,
						id: item.id,
						link: item.link
					});
				});

				console.log(items);
				let custom_actions = [
					{
						title: 'Valider',
						type: 'validate',
						handler: async (e) => {
							let new_status = 'approvedCDP';
							if (user.role == 'bureau' || user.role == 'admin') {
								new_status = 'approvedTreso';
							}

							const { data, error } = await supabase
								.from('orders')
								.update({ status: new_status })
								.eq('id', id)
								.select();

							if (error) {
								console.error(error);
								return;
							}
							if (data) {
								window.location.reload();
							}
						}
					}
				];

				if (user.role == 'bureau' || user.role == 'admin') {
					custom_actions = [
						{
							title: [
								{ value: 'approvedTreso', name: 'Valider' },
								{ value: 'processingOrder', name: 'Commande en cours' },
								{ value: 'ordered', name: 'Commandé' },
								{ value: 'completed', name: 'Terminé' }
							],
							type: 'selector',
							handler: async (e) => {
								let new_status = e.target.value;

								const { data, error } = await supabase
									.from('orders')
									.update({ status: new_status })
									.eq('id', id)
									.select();

								if (error) {
									console.error(error);
									return;
								}
								if (data) {
									window.location.reload();
								}
							}
						}
					];
				}

				new ReadModal({
					target: document.body,
					props: {
						values: {
							header: {
								title: name,
								price: price
							},
							body: [
								{
									label: 'Objets',
									value: [...items]
								},
								{
									label: 'Détails',
									value: data.comment ?? 'Pas de détails'
								},
								{
									label: 'Status',
									type: data.status
								}
							]
						},
						open: true,
						actions: [
							...custom_actions,
							{
								title: 'Refuser',
								type: 'delete',
								handler: async (e) => {
									let new_status = 'refusedCDP';
									if (user.role == 'bureau' || user.role == 'admin') {
										new_status = 'refusedTreso';
									}

									const { data, error } = await supabase
										.from('orders')
										.update({ status: new_status })
										.eq('id', id)
										.select();

									if (error) {
										console.error(error);
										return;
									}
									if (data) {
										window.location.reload();
									}
								}
							}
						],
						id: 'readModal'
					}
				});
			}
		}
	];
	function parseItems(data) {
		let items = [];
		data.forEach((el) => {
			const price =
				Math.round(el.items.reduce((acc, item, i) => acc + item.price * item.quantity, 0) * 100) /
				100;
			const name = el.name.length > 30 ? el.name.slice(0, 30) + '...' : el.name;
			items.push([
				{ value: name, data: el.id },
				{ value: el.creationDate.toLocaleString().split('T')[0] },
				{ value: el.lastUpdate.toLocaleString().split('T')[0] },
				{ value: price + ' €' },
				{ value: el.projectId.name, data: el.projectId.id },
				{ value: el.requestedBy.username, data: el.requestedBy.id },
				{ value: statusText[el.status] }
			]);
		});
		return items;
	}

	onMount(async () => {
		if (!user) {
			await loadUserdata();
		}
		if (user.role == 'cdp') {
			filters = filters.splice(1, 1);
			filters = [
				...filters,
				{
					category: 'hidden',
					value: 'projectId',
					options: [{ name: 'CDP project', value: user.projectId[0], active: true }]
				}
			];
		}
	});
</script>

<div class="w-full py-2 sm:px-8 lg:px-16">
	<h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Commandes</h2>
</div>
<div class="w-full py-2 sm:px-8 lg:px-16">
	<div class="bg-gray-800 rounded-lg">
		<Table
			{headers}
			{actions}
			{dbInfo}
			{filters}
			{parseItems}
			type="commande"
			type_accord="une"
			searchable="name"
		/>
	</div>
</div>

<style></style>
