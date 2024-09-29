<script>
	import Table from '$lib/components/Table.svelte';
	import { onMount } from 'svelte';
	import { supabase, supabaseUrl } from '$lib/supabaseClient';
	import { createClient } from '@supabase/supabase-js';
	import CrudForm from '../../../lib/components/CrudForm.svelte';
	import SucessModal from '../../../lib/components/SucessModal.svelte';

	let headers = ['Nom', 'Rôle', 'Projets', 'Actions'];

	let dbInfo = {
		table: 'profiles',
		key: 'id, username, role, avatar_url, member_of(project(id, name))'
	};

	let service_key = '';

	let filters = [];
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

	async function addNew() {
		new CrudForm({
			target: document.body,
			props: {
				open: true,
				fields: [
					{
						name: 'Nom',
						type: 'text',
						placeholder: 'Rob, aka Robert',
						required: true,
						wide: true
					},
					{
						name: 'Rôle',
						id: 'role',
						type: 'select',
						options: [
							{ value: 'admin', text: 'Admin' },
							{ value: 'bureau', text: 'Bureau' },
							{ value: 'cdp', text: 'Chef de projet' },
							{ value: 'membre', text: 'Membre' }
						],
						required: true
					},
					{
						name: 'Projet',
						id: 'project',
						type: 'select',
						options: [
							{ value: '1', text: 'CDR' },
							{ value: '2', text: 'Travelers' },
							{ value: '3', text: 'Exaudus' },
							{ value: '8', text: 'Bureau' }
						],
						required: true
					},
					{
						name: 'email',
						type: 'email',
						placeholder: 'davincibot@devinci.fr',
						required: true,
						wide: true
					}
				],
				onSubmit: async (e) => {
					e.preventDefault();
					if (service_key === '') {
						console.error('No service key');
						alert(
							'You do not have the required permissions to perform this action (required: admin)'
						);
						return;
					}

					const form = {
						email: document.querySelector('#email').value,
						role: document.querySelector('#role').value,
						username: document.querySelector('#nom').value,
						project: document.querySelector('#project').value
					};

					if (!form.email) {
						alert('No email provided');
						return;
					}
					if (!form.role) {
						alert('No role provided');
						return;
					}
					if (!form.username) {
						alert('No username provided');
						return;
					}

					{
						// create admin client
						const admin_supabase = createClient(supabaseUrl, service_key, {
							auth: {
								autoRefreshToken: false,
								persistSession: false
							}
						});

						// invite the user with the email
						const { data, error } = await admin_supabase.auth.admin.inviteUserByEmail(form.email);
						if (error) {
							console.error(error);
							alert('An error occured while inviting the user');
							return;
						} else {
							console.log('User invited');
							form.id = data.user.id;
						}
					}

					console.log(form);

					{
						const { data, error } = await supabase.from('profiles').insert({
							id: form.id,
							username: form.username,
							role: form.role
						});
						if (error) {
							console.error(error);
							alert('An error occured while updating the user');
							return;
						} else {
							console.log(data);
						}
					}

					{
						const { data, error } = await supabase.from('member_of').insert({
							profile: form.id,
							project: form.project
						});
						if (error) {
							console.error(error);
							alert('An error occured while adding the user to the project');
							return;
						} else {
							console.log(data);
						}
					}

					new SucessModal({
						target: document.body,
						props: {
							message: 'Utilisateur ajouté avec succès',
							open: true,
							onClose: () => {
								window.location.reload();
							}
						}
					});
				}
			}
		});
	}

	onMount(async () => {
		const { data, error } = await supabase.rpc('get_service_key');
		if (error) {
			console.error(error);
		} else {
			service_key = data;
		}
	});
</script>

<h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Utilisateurs</h2>
<Table {headers} {parseItems} {filters} {dbInfo} {addNew} />

<style></style>
