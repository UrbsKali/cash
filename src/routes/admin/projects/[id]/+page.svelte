<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import { Pie } from 'svelte-chartjs';

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let slug;
	let project = {};

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
	$: data.datasets[0].data = [project.budget?.budget - project.budget?.cost, project.budget?.cost];

	page.subscribe((value) => {
		if (value) {
			slug = value.params.id;
			loadPage().catch(console.error);
		}
	});

	async function fetchProject() {
		let { data, error } = await supabase
			.from('projects')
			.select('id, name, debut, budget(budget, year)')
			.eq('id', slug)
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
	});

	async function loadPage() {
		project = await fetchProject();
		const { data, error } = await supabase.rpc('get_project_cost', {
			projectid: slug,
			year: project.budget.year
		});
		if (error) {
			console.error(error);
			return;
		}
		project.budget.cost = data;
		console.log(project.budget.cost);
	}
</script>

<div class="flex items-center justify-between w-full sm:px-8 lg:px-16">
	<h2 class="mb-4 text-4xl font-bold tracking-tight text-white align-middle">
		{project.name}
		<span class="text-xl italic text-gray-400">({project.debut?.split('-')[0]})</span>
	</h2>
</div>
<div class="flex flex-col items-center justify-center w-full gap-2 sm:w-80">
	<div class="flex items-center justify-around w-full">
		<h3 class="text-2xl font-bold tracking-tight text-white">Budget</h3>
		<div class="flex items-center space-x-2">
			<span class="text-xl font-bold tracking-tight text-white"
				>{project.budget?.budget ?? 0} €</span
			>
			<span class="text-xl font-bold tracking-tight text-white">({project.budget?.year ?? 0})</span>
		</div>
	</div>
	{#if project.budget?.cost}
		<p class="text-xl font-bold tracking-tight text-white">
			Dépenses : {project.budget.cost} €
		</p>
	{/if}
	{#if project.budget?.budget - project.budget?.cost < 0}
		<p class="text-xl font-bold tracking-tight text-red-400 text-red-500">
			Dépassement de budget !
		</p>
	{/if}
	<div class="w-80">
		<Pie {data} options={{ responsive: true }} />
	</div>
</div>
