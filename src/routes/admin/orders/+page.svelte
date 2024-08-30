<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let headers = ['Objet', 'Date', 'Prix', 'Status', 'Projet', 'Actions'];
	let total_items = 0;

	async function loadPage(page, step = 20) {
		let items = [];
		const { data, error } = await supabase
			.from('orders')
			.select('id, creationDate, projectId(id, name), status, lastUpdate, tags, priority, items(*), quantities')
			.order('creationDate', { ascending: false })
			.range(page * step, (page + 1) * step);
		if (error) {
			console.error(error);
			return;
		}
		data.forEach((el) => {
			const price = el.items.reduce((acc, item, i) => acc + item.price * el.quantities[i], 0);
			const name = el.items.map((item) => item.name).join(', ');
			items.push([
				{ value: name },
				{ value: el.creationDate.toLocaleString().split('T')[0] },
				{ value: price + ' €' },
				{ value: el.status },
				{ value: el.projectId.name },
			]);
		});
		return items;
	}

	onMount(async () => {
		const { count, error } = await supabase
			.from('orders')
			.select('*', { count: 'estimated', head: true })
		if (error) {
			console.error(error);
			return;
		}
		total_items = count;
	});
</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Commandes</h2>
<Table {headers} {total_items} {loadPage} type="commande" type_accord="une" />

<style></style>
