<script>
	import Table from '$lib/components/admin/Table.svelte';
	import CrudForm from '$lib/components/modals/CrudForm.svelte';
	import SucessModal from '$lib/components/modals/InfoModal.svelte';
	import ReadModal from '$lib/components/modals/ReadModal.svelte';

	import { supabase } from '$lib/supabaseClient';

	async function addNew() {
		new CrudForm({
			target: document.body,
			props: {
				fields: [
					{
						name: 'Valeur',
						type: 'number',
						id: 'amount',
						required: true,
						placeholder: '0.00',
						wide: true
					},
					{
						name: 'Justificatif',
						type: 'document',
						required: true,
						wide: true,
						multiple: true,
						value: []
					},
					{
						name: 'Date effective',
						type: 'date',
						id: 'date',
						required: true
					},
					{
						name: 'Type',
						type: 'select',
						id: 'is_positive',
						required: true,
						options: [
							{ value: 'true', text: 'Bénéfice' },
							{ value: 'false', text: 'Perte' }
						]
					},
					{
						name: 'Description',
						type: 'textarea',
						id: 'description',
						required: true,
						wide: true
					}
				],
				type_accord: 'une',
				type: 'ligne',
				onSubmit: async (e) => {
					// get forms data
					e.preventDefault();
					const form_data = new FormData(e.target.closest('form'));
					let data = {};
					for (let [key, value] of form_data.entries()) {
						if (key.startsWith('justificatif')) {
							const files = document.querySelector('input[name="justificatif"]').files;
							data['justificatif'] = files;
						} else {
							data[key.toLowerCase()] = value;
						}
					}

					// create spending
					const { data: row, error: error } = await supabase
						.from('spending')
						.insert([
							{
								amount: data.amount,
								date: data.date,
								is_positive: data.is_positive,
								description: data.description
							}
						])
						.select('id')
						.single();

					if (error) {
						console.error(error);
						alert('Une erreur est survenue lors de la création de la dépense');
					}

					// upload proof
					const logoFile = data['justificatif'];

					// upload all files
					for (let i = 0; i < logoFile.length; i++) {
						const { data: _, error: err } = await supabase.storage
							.from('proof')
							.upload(`invoices/${row.id}/${logoFile[i].name}`, logoFile[i], {
								cacheControl: '3600',
								upsert: true
							});
						if (err) {
							console.error(err);
							alert("Une erreur est survenue lors de l'envoi du logo");
							return;
						}
					}

					new SucessModal({
						target: document.body,
						props: {
							message: 'La dépense a bien été ajoutée'
						}
					});
				}
			}
		});
	}

	async function edit(e) {
		e.preventDefault();
		const id = e.target.closest('tr').querySelector('th').dataset.utils;
		const [current_uid, current_avatar] = e.target
			.closest('tr')
			.querySelector('td:nth-child(3)')
			.dataset.utils.split('+');
		const current_name = e.target.closest('tr').querySelector('td:nth-child(3)').innerText;

		const { data, error } = await supabase.from('spending').select('*').eq('id', id).single();
		if (error) {
			console.error(error);
			return;
		}
		if (data.description === null || data.description === '') {
			data.description = 'Aucune description';
		}
		if (data.description.includes('Spending for order')) {
			const { data: order, error: err } = await supabase
				.from('orders')
				.select('*')
				.eq('id', parseInt(data.description.split(' ')[3]))
				.single();
			if (err) {
				console.error(err);
				return;
			}
			data.description = order.description ?? 'Aucune description';
			data.name = order.name;
		}
		// get files names
		const { data: file_data, error: err } = await supabase.storage
			.from('proof')
			.list(`invoices/${id}`, {
				limit: 20,
				offset: 0,
				sortBy: { column: 'name', order: 'asc' }
			});
		if (err) {
			console.error(err);
			console.log('No proof, skipping');
		}

		new CrudForm({
			target: document.body,
			props: {
				fields: [
					{
						name: 'Valeur',
						type: 'number',
						id: 'amount',
						required: true,
						placeholder: data.amount ?? '0.00',
						value: data.amount,
						wide: true
					},
					{
						name: 'Justificatif',
						type: 'document',
						required: true,
						wide: true,
						multiple: true,
						value: file_data,
						onRemove: async (e, value) => {
							const { data, error } = await supabase.storage
								.from('proof')
								.remove([`invoices/${id}/${value}`]);
							if (error) {
								console.error(error);
								alert('Une erreur est survenue lors de la suppression du justificatif');
							}
						}
					},
					{
						name: 'Date effective',
						type: 'date',
						id: 'date',
						required: true,
						value: data.date.split('T')[0],
						placeholder: data.date.split('T')[0]
					},
					{
						name: 'Type',
						type: 'select',
						id: 'is_positive',
						required: true,
						options: [
							{ value: 'true', text: 'Bénéfice', selected: data.is_positive },
							{ value: 'false', text: 'Perte', selected: !data.is_positive }
						]
					},
					{
						name: 'Description',
						type: 'textarea',
						id: 'description',
						required: true,
						wide: true,
						value: data.description
					},
					{
						name: 'Auteur',
						type: 'autocomplete',
						id: 'author',
						required: true,
						wide: true,
						value: current_name ?? '',
						data: current_uid,
						image: current_avatar,
						onChange: async (e) => {
							// search through users
							const { data, error } = await supabase
								.from('profiles')
								.select('id, username, avatar_url')
								.ilike('username', `${e.target.value}*`)
								.range(0, 4);
							if (error) {
								console.error(error);
								return;
							}
							// create options
							let options = [];
							for (let i = 0; i < data.length; i++) {
								let el = data[i];
								let avatar = el.avatar_url;
								options.push({ value: el.id, text: el.username, image: avatar });
							}
							return options;
						}
					}
				],
				type_accord: 'une',
				type: 'ligne',
				onSubmit: async (e) => {
					// get forms data
					e.preventDefault();
					const form_data = new FormData(e.target.closest('form'));
					let fdata = {};
					for (let [key, value] of form_data.entries()) {
						if (key.startsWith('author')) {
							const uid = document.querySelector('label[for="author"]').dataset.utils;
							fdata.author = { uid: uid };
						} else if (key.startsWith('justificatif')) {
							const files = document.querySelector('input[name="justificatif"]').files;
							fdata['justificatif'] = files;
						} else {
							fdata[key.toLowerCase()] = value;
						}
					}

					// update spending
					const { data: row, error: error } = await supabase
						.from('spending')
						.update({
							amount: fdata.amount,
							date: fdata.date,
							is_positive: fdata.is_positive,
							description: fdata.description,
							author: fdata.author.uid
						})
						.eq('id', id)
						.select('id')
						.single();
					if (error) {
						console.error(error);
						alert("Une erreur est survenue lors de l'édition de la dépense");
					}

					const logoFile = fdata['justificatif'];
					console.log(logoFile);

					// upload all files
					for (let i = 0; i < logoFile.length; i++) {
						const { data: _, error: err } = await supabase.storage
							.from('proof')
							.upload(`invoices/${row.id}/${logoFile[i].name}`, logoFile[i], {
								cacheControl: '3600',
								upsert: true
							});
						if (err) {
							console.error(err);
							alert("Une erreur est survenue lors de l'envoi du logo");
							return;
						}
					}

					new SucessModal({
						target: document.body,
						props: {
							message: 'La dépense a bien été ajoutée'
						}
					});
				}
			}
		});
	}

	const dbInfo = {
		table: 'spending',
		key: 'id, is_positive, amount, date, author(id, username, avatar_url)',
		ordering: 'date:desc'
	};

	const headers = ['Valeur', 'Date', 'Auteur', 'Actions'];

	function parseItems(items) {
		let parsedItems = [];
		items.forEach((item) => {
			parsedItems.push([
				{
					value: `${item.is_positive ? '+' : '-'} ${item.amount} €`,
					style: item.is_positive ? 'text-green-300' : 'text-red-300',
					data: item.id
				},
				{ value: item.date.split('T')[0] },
				{
					value: item.author?.username ?? 'Aucun',
					data: `${item.author?.id}+${item.author?.avatar_url}`
				}
			]);
		});
		return parsedItems;
	}

	const actions = [
		{
			title: 'Voir',
			type: 'view',
			handler: async (e) => {
				// get the info from the order
				const id = e.target.closest('tr').querySelector('th').dataset.utils;

				const { data, error } = await supabase
					.from('spending')
					.select('id, description, author(username, id), amount, is_positive, date')
					.eq('id', id)
					.single();

				if (error) {
					console.error(error);
					return;
				}
				if (data.description === null || data.description === '') {
					data.description = 'Aucune description';
				}
				if (data.description.includes('Spending for order')) {
					const { data: order, error: err } = await supabase
						.from('orders')
						.select('*')
						.eq('id', parseInt(data.description.split(' ')[3]))
						.single();
					if (err) {
						console.error(err);
						return;
					}
					data.description = order.description ?? 'Aucune description';
					data.name = order.name;
				}

				// get the proof
				const { data: dat, error: err } = await supabase.storage
					.from('proof')
					.list(`invoices/${id}`, {
						limit: 20,
						offset: 0,
						sortBy: { column: 'name', order: 'asc' }
					});

				if (err) {
					console.error(err);
					console.log('No proof, skipping');
				}

				let files = [...dat.map((file) => `invoices/${id}/${file.name}`)];

				new ReadModal({
					target: document.body,
					props: {
						values: {
							header: {
								title: data.name ?? 'Dépense',
								sub: data.date.split('T')[0]
							},
							body: [
								{
									label: 'Valeur',
									value: `${data.amount} €`
								},
								{ label: 'Auteur', value: data.author?.username ?? 'Aucun' },
								{ label: 'Description', value: data.description }
							]
						},

						files: files,
						actions: [
							{
								title: 'Modifier',
								type: 'edit',
								handler: async () => {
									edit(e);
								}
							}
						]
					}
				});
			}
		}
	];
</script>

<div>
	<!-- Stats -->
</div>
<div class="w-full py-2 sm:px-8 lg:px-16">
	<div class="bg-gray-800 rounded-lg">
		<Table {addNew} {parseItems} {dbInfo} {headers} {actions} type="ligne" type_accord="une" />
	</div>
</div>
