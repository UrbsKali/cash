<script>
	import Table from '$lib/components/admin/Table.svelte';
	import CrudForm from '$lib/components/modals/CrudForm.svelte';
	import SucessModal from '$lib/components/modals/InfoModal.svelte';

	import { supabase } from '$lib/supabaseClient';

	async function addNew() {
		new CrudForm({
			target: document.body,
			props: {
				fields: [
					{
						name: 'Valeur',
						type: 'number',
						id: 'price',
						required: true,
						placeholder: '0.00'
					},
					{ name: 'TVA', type: 'number', required: true, placeholder: '0.00' },
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
								price: data.price,
								tva: data.tva,
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
					let extension = logoFile.name.split('.').pop();

					const { data: _, error: err } = await supabase.storage
						.from('proof')
						.upload(`invoices/${row.id}.${extension}`, logoFile, {
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

	const dbInfo = {
		table: 'spending',
		fields: '*'
	};

	const headers = ['Valeur', 'TVA', 'Date', 'Description', 'Actions'];

	function parseItems(items) {
		let parsedItems = [];
		items.forEach((item) => {
			parsedItems.push([
				{ value: item.price },
				{ value: item.tva },
				{ value: item.date },
				{ value: item.description }
			]);
		});
		return parsedItems;
	}
</script>

<div>
	<!-- Stats -->
</div>
<div class="w-full py-2 sm:px-8 lg:px-16">
	<div class="bg-gray-800 rounded-lg">
		<Table {addNew} {parseItems} {dbInfo} {headers} type="ligne" type_accord="une" />
	</div>
</div>
