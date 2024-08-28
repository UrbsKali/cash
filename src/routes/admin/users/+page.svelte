<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let headers = ['Nom', 'Rôle', 'Projet', 'Actions'];
	let total_items = 0;

	async function loadPage(page, step = 20) {
		let items = [];
		const { data, error } = await supabase
			.from('profiles')
			.select('id, username, role, project(*), avatar_url')
			.range(page * step, (page + 1) * step);

		data.forEach((el) => {
			
			items.push([
				{ value: el.username, data: el.id, avatar: el.avatar_url },
				{ value: el.role },
				{ value: el.project?.name || 'Aucun', data: el.project?.id }
			]);
		});
		return items;
	}

	onMount(async () => {
		const { count, error } = await supabase
			.from('profiles')
			.select('*', { count: 'estimated', head: true });
		total_items = count;
		if (error) {
			console.error(error);
			return;
		}
	});
</script>

<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Utilisateurs</h2>
<Table {headers} {total_items} {loadPage} />

<style></style>
