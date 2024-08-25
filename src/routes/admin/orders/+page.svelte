<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';

	let headers = ['Objet', 'Date', 'Projet', 'Status', 'Actions']
	let items = []

	onMount(async () => {
		const { data, error } = await supabase
			.from('orders')
			.select('id, user_id, project_id, status')
	})

</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Mes Commandes</h2>
<Table {headers} {items} type="commande" type_accord='une'/>

<style></style>
