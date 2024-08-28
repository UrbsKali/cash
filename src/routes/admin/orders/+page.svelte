<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let headers = ['Objet', 'Date', 'Projet', 'Status', 'Actions']
	let items = []

	onMount(async () => {
		const { data, error } = await supabase
			.from('orders')
			.select('id, creationDate, projectId, status, lastUpdate, tags, priority')
			.order('creationDate', { ascending: false });
		if (error) {
			console.error(error);
			return;
		}
		items = data;
	})

</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Commandes</h2>
<Table {headers} {items} type="commande" type_accord='une'/>

<style></style>
