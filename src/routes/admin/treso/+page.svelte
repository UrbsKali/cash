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
					{ name: 'Justificatif', type: 'document', required: true, wide: true },
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
						data[key.toLowerCase()] = value;
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
					console.log(row);

					// upload proof
					const logoFile = form_data.get('justificatif');
					console.log(logoFile);

					const { data: _, error: err } = await supabase.storage
						.from('proof')
						.upload(`invoices/${row.id}`, logoFile, {
							cacheControl: '3600',
							upsert: true
						});
					if (err) {
						console.error(err);
						alert("Une erreur est survenue lors de l'envoi du logo");
						return;
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
					{ name: 'Nouveau Justificatif', type: 'document', required: true, wide: true },
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
						value: data.author?.username ?? '',
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
						fdata[key.toLowerCase()] = value;
					}

					console.log(fdata);

					// update spending
					const { data: row, error: error } = await supabase
						.from('spending')
						.update([
							{
								amount: fdata.amount,
								date: fdata.date,
								is_positive: fdata.is_positive,
								description: fdata.description,
								author: fdata.author.uuid
							}
						])
						.eq('id', id)
						.single();

					if (error) {
						console.error(error);
						alert('Une erreur est survenue lors de la création de la dépense');
					}
					console.log(row);

					// upload proof
					// const logoFile = form_data.get('justificatif');
					// console.log(logoFile);

					// const { data: _, error: err } = await supabase.storage
					// 	.from('proof')
					// 	.upload(`invoices/${row.id}`, logoFile, {
					// 		cacheControl: '3600',
					// 		upsert: true
					// 	});
					// if (err) {
					// 	console.error(err);
					// 	alert("Une erreur est survenue lors de l'envoi du logo");
					// 	return;
					// }

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
		fields: 'is_positive, amount, date, author(username)',
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
				{ value: item.author?.username ?? 'Aucun' }
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

				// get the proof
				const { data: dat, error: err } = await supabase.storage
					.from('proof')
					.createSignedUrl(`invoices/${id}`, 600);

				if (err) {
					console.error(err);
					console.log('No proof, skipping');
				}

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
								{ label: 'Date', value: data.date.split('T')[0] },
								{ label: 'Description', value: data.description }
							]
						},

						file: dat?.signedUrl,
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
