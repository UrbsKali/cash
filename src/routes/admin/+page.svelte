<script>
	import { onMount } from 'svelte';
	import { userdata } from '$lib/store';
	import { loadUserdata } from '$lib/utils';
	import Table from '../../lib/components/Table.svelte';
	import { initFlowbite } from 'flowbite';
	import { supabase } from '$lib/supabaseClient';
	import ReadModal from '../../lib/components/ReadModal.svelte';
	import { statusText } from '$lib/utils';


	let skip = false;
	let user;
	let total_items = 0;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
			skip = true;
		}
	});

	let headers = ['Objets', 'Date de création','Dernière mise à jour', 'Prix', 'Status', 'Actions'];

	let actions = [
		{
			title: 'Voir',
			type: 'view',
			handler: async (e) => {
				// get the info from the order
				const id = e.target.closest('tr').querySelector('td').dataset.utils;

				const { data, error } = await supabase
					.from('orders')
					.select(
						'id, creationDate, projectId, status, lastUpdate, items(*), comment'
					)
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
					items.push({ name: item.name, quantity: item.quantity, price: `${item.price} €`, id: item.id });
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
								title: 'Supprimer',
								type: 'delete',
								handler: async (e) => {
									const {data, error} = await supabase.from('orders').delete().eq('id', id).select().single();
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
		const { data, error } = await supabase
			.from('orders')
			.select(
				'id, creationDate, projectId, status, lastUpdate, items(*)'
			)
			.eq('requestedBy', user.id)
			.range(page * step, (page + 1) * step);
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
				{ value: statusText[el.status] }
			]);
		});
		return items;
	}

	onMount(async () => {
		if (skip) return;
		await loadUserdata();
		initFlowbite();
		const { count, error } = await supabase
			.from('orders')
			.select('*', { count: 'estimated', head: true })
			.eq('requestedBy', user.id);
		if (error) {
			console.error(error);
			return;
		}
		total_items = count;
	});
</script>

<div class=" w-full flex justify-between items-center sm:px-8 lg:px-16">
	<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
		Bonjour {user?.name ?? 'utilisateur'}
	</h2>
</div>
<div class="w-full py-2 sm:px-8 lg:px-16">
	<p class="text-gray-700 dark:text-gray-300">
		Voici la liste de vos commandes. Vous pouvez en ajouter, modifier ou supprimer.
	</p>
</div>
<div>
	<Table {headers} {total_items} {loadPage} {actions} type="commande" type_accord="une" />
</div>
