<script>
	import { onMount } from 'svelte';
	import { userdata } from '$lib/store';
	import { loadUserdata } from '$lib/utils';
	import CrudForm from '../../lib/components/CrudForm.svelte';
	import Table from '../../lib/components/Table.svelte';
	import { initFlowbite } from 'flowbite';

	let skip = false;
	let user;

	userdata.subscribe((value) => {
		if (value) {
			user = value;
			skip = true;
		}
	});

	let headers = ['Objet', 'Date', 'Prix', 'Quantité', 'Status', 'Actions'];
	let items = [];

	let fields = [
		{
			name: 'Objet',
			type: 'text',
			value: '',
			wide: false
		},
		{
			name: 'Prix',
			type: 'number',
			value: '',
			placeholder: '15.5',
			wide: false,
			min: 0,
			step: 0.01
		},
		{
			name: 'Quantité',
			type: 'number',
			value: '',
			placeholder: '1',
			wide: false,
			min: 0,
			step: 1
		},
		{
			name: 'Lien',
			type: 'text',
			value: '',
			wide: true
		},
		{
			name: 'Infos',
			type: 'textarea',
			value: '',
			wide: true
		}
	];

	onMount(async () => {
		if (skip) return;
		await loadUserdata();
		initFlowbite;
	});
</script>

<div class=" w-full flex justify-between items-center px-8 lg:px-16">
	<h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
		Bonjour {user?.name}
	</h2>
</div>
<div class="w-full py-2  px-8 lg:px-16">
	<p class="text-gray-700 dark:text-gray-300">
		Voici la liste de vos commandes. Vous pouvez en ajouter, modifier ou supprimer.
	</p>
</div>
<div>
	<Table {headers} {fields} {items} type="commande" type_accord="une" />
</div>
