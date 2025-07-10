<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	import { loadUserdata } from '$lib/utils';
	import { userdata } from '$lib/store';

	import { Pie } from 'svelte-chartjs';

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let selectedProjectId;
	let project = {};
	let skip = false;
	let user;
	let showDropdown = false;

	let year = new Date().getFullYear();

	userdata.subscribe(async (value) => {
		if (value) {
			user = value;
			selectedProjectId = user.projects.length > 0 ? user.projects[0].id : undefined;

			if (user.allProjects) {
				user.allProjects.forEach((p) => {
					if (!user.projects.some((proj) => proj.id === p.value)) {
						// Only add projects that are not already in the user's projects
						user.projects.push({
							id: p.value,
							name: p.name,
							debut: p.debut
						});
					}
				});
			}

			if (selectedProjectId) {
				await loadPage();
			}
			skip = true;
		}
	});

	let data = {
		labels: ['Budget restant', 'Dépenses'],
		datasets: [
			{
				data: [1, 1],
				backgroundColor: ['#36A2EB', '#FF6384'],
				hoverBackgroundColor: ['#36A2EB', '#FF6384']
			}
		]
	};
	$: data.datasets[0].data = [
		project.budget?.budget - project.budget?.cost < 0
			? 0
			: project.budget?.budget - project.budget?.cost,
		project.budget?.cost
	];

	async function fetchProject() {
		if (!selectedProjectId) {
			return { name: 'Aucun projet sélectionné', budget: { budget: 0, year: 0 } };
		}
		let { data, error } = await supabase
			.from('projects')
			.select('id, name, debut, budget(budget, year)')
			.eq('id', selectedProjectId)
			.eq('budget.current', true)
			.single();

		if (error) {
			console.error(error);
			return;
		}
		data.budget = data.budget[0];
		return data;
	}

	onMount(async () => {
		await loadPage();
		if (!skip) {
			await loadUserdata();
		}
	});

	async function loadPage() {
		project = await fetchProject();
		if (selectedProjectId == 0) {
			project.budget = { budget: 0, year: year, cost: 0 };
		}
		const { data, error } = await supabase.rpc('get_project_cost', {
			projectid: selectedProjectId,
			year: project?.budget?.year
		});
		if (error) {
			console.error(error);
			return;
		}
		project.budget.cost = data;
	}
	async function handleSelect(event) {
		selectedProjectId = event.target.value;
		await loadPage();
	}
</script>

<div class="flex flex-col items-start justify-center w-full gap-4 px-4 py-8">
	<div class="flex items-center justify-between w-full">
		<h2
			class="self-center w-full mb-4 text-4xl font-bold tracking-tight text-center text-white align-middle"
		>
			{#if user?.projects?.length > 1}
				<div class="relative inline-block min-w-96">
					<button
						class="flex items-center justify-between w-full p-2 text-4xl font-bold text-white bg-gray-900 rounded-md"
						on:click={() => (showDropdown = !showDropdown)}
						type="button"
					>
						{user.projects.find((p) => p.id === selectedProjectId)?.name ||
							'Sélectionner un projet'}
						<svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{#if showDropdown}
						<ul class="absolute z-10 w-full mt-1 bg-gray-800 shadow-lg rounded-xl">
							{#each user.projects as p}
								<li>
									<button
										class="w-full px-4 py-2 text-xl text-left text-white hover:bg-gray-700"
										on:click={() => {
											selectedProjectId = p.id;
											showDropdown = false;
											handleSelect({ target: { value: p.id } });
										}}
									>
										{p.name}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<script>
					let showDropdown = false;
					// Optional: close dropdown on outside click
					function handleClickOutside(event) {
						if (!event.target.closest('.relative')) showDropdown = false;
					}
					$: {
						if (showDropdown) {
							window.addEventListener('click', handleClickOutside);
						} else {
							window.removeEventListener('click', handleClickOutside);
						}
					}
				</script>
			{:else}
				{project.name}
				<span class="text-xl italic text-gray-400">({project.debut?.split('-')[0]})</span>
			{/if}
		</h2>
	</div>
	<div class="flex flex-col items-center justify-center w-full gap-2 sm:w-80">
		<div class="flex items-center justify-around w-full">
			<h3 class="text-2xl font-bold tracking-tight text-white">Budget</h3>
			<div class="flex items-center space-x-2">
				<span class="text-xl font-bold tracking-tight text-white"
					>{project.budget?.budget ?? 0} €</span
				>
				<span class="text-xl font-bold tracking-tight text-white"
					>({project.budget?.year ?? 0})</span
				>
			</div>
		</div>
		{#if project.budget?.cost}
			<p class="text-xl font-bold tracking-tight text-white">
				Dépenses : {project.budget.cost} €
			</p>
		{/if}
		{#if project.budget?.budget - project.budget?.cost < 0}
			<p class="text-xl font-bold tracking-tight text-red-500">Dépassement de budget !</p>
		{/if}
		<div class="w-80">
			<Pie {data} options={{ responsive: true }} />
		</div>
	</div>
</div>
