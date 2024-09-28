<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let headers = ['Nom', 'Rôle', 'Projets', 'Actions'];

	
	let dbInfo = {
		table: 'profiles',
		key: 'id, username, role, avatar_url, member_of(project(id, name))'
	};


	let filters = [
		
		
	];
	function parseItems(data) {
		let items = [];
		data.forEach((el) => {
			const project = el.member_of.map((el) => el.project.name).join(', ');
			items.push([
				{ value: el.username, data: el.id, avatar: el.avatar_url },
				{ value: el.role },
				{ value: project }
			]);
		});
		return items;
	}

</script>

<h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Utilisateurs</h2>
<Table {headers} {parseItems} {filters} {dbInfo} />

<style></style>
