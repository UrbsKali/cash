<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { statusText, loadUserdata } from '$lib/utils';
	import ReadModal from '$lib/components/ReadModal.svelte';
	import { userdata } from '$lib/store';

	let user;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
		}
	});

	let headers = ['Objet', 'Date', 'Dernière MàJ', 'Prix', 'Projet', 'Membre', 'Status', 'Actions'];
	let total_items = 0;

	let actions = [
		{
			title: 'Voir',
			type: 'view',
			handler: async (e) => {
				// get the info from the order
				const id = e.target.closest('tr').querySelector('td').dataset.utils;

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
							},
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

	async function loadPage(page, step = 20) {
		// wait for user data to be loaded before fetching orders

		if (!user) {
			await loadUserdata();
		}

		let items = [];

		let data, error;
		if (user.role == 'bureau' || user.role == 'admin') {
			({ data, error } = await supabase
				.from('orders')
				.select(
					'id, creationDate, projectId(id, name), status, lastUpdate, items(*), requestedBy(*)'
				)
				.range(page * step, (page + 1) * step));
		} else {
			({ data, error } = await supabase
				.from('orders')
				.select(
					'id, creationDate, projectId(id, name), status, lastUpdate, items(*), requestedBy(*)'
				)
				.eq('projectId', user.projectId)
				.range(page * step, (page + 1) * step));
		}
		if (error) {
			console.error(error);
			return;
		}
		data.forEach((el) => {
			const price = el.items.reduce((acc, item, i) => acc + item.price * item.quantity, 0);
			const name = el.items.map((item) => item.name).join(', ');
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
		let count, error;
		if (user.role == 'bureau' || user.role == 'admin') {
			({ count, error } = await supabase
				.from('orders')
				.select('*', { count: 'estimated', head: true }));
		} else {
			({ count, error } = await supabase
				.from('orders')
				.select('*', { count: 'estimated', head: true })
				.eq('projectId', user.projectId));
		}
		if (error) {
			console.error(error);
			return;
		}
		total_items = count;
	});
</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Commandes</h2>
<Table {headers} {total_items} {actions} {loadPage} type="commande" type_accord="une" />

<style></style>
