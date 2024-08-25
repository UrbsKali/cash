<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let headers = ['Nom', 'Rôle', 'Projet', 'Actions']
	let items = []

	onMount(async () => {
		const { data, error } = await supabase
			.from('profiles')
			.select('id, username, avatar_url, project(id, name), role')
		if (error) {
			console.error(error);
			return;
		}
		data.forEach(el => {
			items = [...items, [
				{ value: el.username, data: el.id},
				{ value: el.role},
				{ value: el.project?.name || 'Aucun', data: el.project?.id},
			]];
		});
		console.log(items);
	})

</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Utilisateurs</h2>
<Table {headers} {items}/>

<style></style>
