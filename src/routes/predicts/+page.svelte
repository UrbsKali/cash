<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { pushState } from '$app/navigation';

	let predictions = [];
	let matchs = [];
	let date = new Date();
	let casteur = [];
	let casteur_leaderboard = [];

	let tournament = '';
	let use_score = true;

	onMount(async () => {
		// check url date parameter
		const urlParams = new URLSearchParams(window.location.search);
		const dateParam = urlParams.get('date');
		if (dateParam) {
			date = new Date(dateParam);
		}
		fetchinfo(date);
	});

	async function fetchinfo(date) {
		let dateStr = date.toISOString().split('T')[0];
		{
			// get matchs
			const { data, error } = await supabase
				.from('Matchs')
				.select(
					`id, team_one(name, logo_url), team_two(name, logo_url), tournament_id(title), date`
				)
				.lte('date', `${dateStr}T23:59:59`)
				.gte('date', `${dateStr}T00:00:00`);
			matchs = data;
		}
		{
			const { data, error } = await supabase
				.from('Predictions')
				.select(
					`id, match, team(name, logo_url), score, made_by(username, predict_accuracy), result`
				)
				.in(
					'match',
					matchs.map((el) => el.id)
				);
			predictions = data;
			console.log(predictions);
		}
		// get each unique value of made_by
		predictions.forEach((element) => {
			if (!element.score) use_score = false;
			if (casteur.map((el) => el.username).includes(element.made_by.username)) return;
			casteur = [
				...casteur,
				{ username: element.made_by.username, predict_accuracy: element.made_by.predict_accuracy }
			];
		});

		casteur_leaderboard = casteur
			.sort((a, b) => {
				if (a.predict_accuracy == b.predict_accuracy) {
					if (a.username == 'KcKitt') return -1;
					if (b.username == 'KcKitt') return 1;
					return 0;
				}
				return -a.predict_accuracy + b.predict_accuracy;
			})
			.slice(0, 3);
		if (casteur_leaderboard.length < 3) {
			for (let i = casteur_leaderboard.length; i < 3; i++) {
				casteur_leaderboard.push({ username: 'N/A', predict_accuracy: 0 });
			}
		}

		// update url to current date, without reloading the page
		pushState(`${window.location.origin}${window.location.pathname}?date=${dateStr}`);
	}

	const dateOfXDay = (xDay = 1) => {
		let today = new Date(date);
		today.setDate(today.getDate() + xDay);
		date = today;
		return today;
	};
</script>

<svelte:head>
	<title>Prédictions | Oblivion Esport</title>
	<meta name="description" content="Prédiction du jour - Oblivion Esport" />
	<meta name="keywords" content="Predicts, LoL, League of Legends, Tournaments" />
	<meta name="author" content="UrbsKali" />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<meta name="msapplication-TileColor" content="#000000" />
	<meta name="msapplication-TileImage" content="https://oblivion-esport.fr/oblivion.png" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Predicts" />
	<meta name="application-name" content="Predicts" />
	<meta name="msapplication-navbutton-color" content="#000000" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<meta name="og:title" content="Predicts" />
	<meta name="og:description" content="Prédiction du jours - Oblivion Esport" />
	<meta name="og:image" content="/oblivion.png" />
	<meta name="og:url" content="https://oblivion-esport.fr/v2/predicts" />
	<meta name="og:site_name" content="Oblivion Esport" />
</svelte:head>

<LinkButton
	href=""
	text=""
	revert="true"
	target=""
	onClick={async (e) => await fetchinfo(dateOfXDay(-1))}
/>
<LinkButton href="" text="" target="" onClick={async (e) => await fetchinfo(dateOfXDay(1))} />
<h2>{date.toLocaleDateString()}</h2>
<div class="flex flex-row justify-between w-full">
	<div class="horizontal-scroll-except-first-column flex flex-row w-custom">
		<div class="hideout"></div>

		<table class=" border-spacing-x-10 border-spacing-y-2 border-separate -ml-10 table-fixed">
			<thead>
				<tr>
					<th class="w-96">Matchs</th>
					{#each casteur as cast}
						<th
							><div class=" w-36">
								<div class=" font-extrabold text-2xl">
									{Math.round(cast.predict_accuracy * 100)}%
								</div>
								<div class=" uppercase">{cast.username}</div>
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each matchs as match, i}
					<tr>
						<td class=" w-96">
							<div
								class="bg-gray-700 text-gray-300 rounded-t-md flex flex-row items-center p-2 justify-center"
							>
								<div class="tournament p-1">{match.tournament_id.title}</div>
								-
								<div class="date p-1">{new Date(match.date).toLocaleTimeString()}</div>
							</div>
							<div class="bg-white dark:bg-gray-800 p-2 rounded-b-md flex flex-col">
								<div class="grid justify-center pt-2 pb-2 custom-grid">
									<div class="team p-1 flex flex-col items-center">
										<img
											src={match.team_one.logo_url}
											alt=""
											srcset=""
											class=" w-auto h-20 aspect-auto}"
										/>
										{match.team_one.name}
									</div>
									<div class="vs p-1 flex items-center"><img src="/epee.png" alt="" /></div>
									<div class="team p-1 flex flex-col items-center">
										<img src={match.team_two.logo_url} alt="" srcset="" class=" w-auto h-20" />
										{match.team_two.name}
									</div>
								</div>

								<LinkButton href="https://twitch.tv/kckitt_" text="Voir le match" />
							</div>
						</td>
						{#each casteur as cast, index}
							<td class="h-56">
								{#if predictions.find((el) => el.made_by.username == cast.username && el.match == match.id)}
									<div class="flex flex-col items-center align-middle h-56">
										<img
											src={predictions.find(
												(el) => el.made_by.username == cast.username && el.match == match.id
											).team.logo_url}
											alt=""
											class=" w-auto h-20 m-auto {predictions.find(
												(el) => el.made_by.username == cast.username && el.match == match.id
											).result == 'ZERO'
												? 'bnw'
												: ''}"
										/>
									</div>
									{#if use_score}
										<div
											class="flex flex-col items-center align-middle h-56 {predictions.find(
												(el) => el.made_by.username == cast.username && el.match == match.id
											).result == 'FULL'
												? 'text-green-500'
												: predictions.find(
															(el) => el.made_by.username == cast.username && el.match == match.id
													  ).result == 'ZERO'
													? 'text-gray-600 italic'
													: ''}"
										>
											{predictions.find(
												(el) => el.made_by.username == cast.username && el.match == match.id
											).score}
										</div>
									{/if}
								{:else}
									-
								{/if}
							</td>
							{#if index == casteur.length - 1 && i == 1}
								<td class="overflow-hidden"> </td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
		<div>
			<div class="bg-gray-800 shadow-md rounded-md max-w-sm min-w-60 mx-auto mt-16">
				<div class="bg-gray-700 py-2 px-4 rounded-t-md">
					<h2 class="text-xl font-semibold text-gray-300">Leaderboard</h2>
				</div>
				<ul class="divide-y divide-gray-200">
					{#each casteur_leaderboard as cast, index}
						<li class="flex items-center py-4 px-6">
							<span class="text-gray-300 text-lg font-medium mr-4">{index + 1}.</span>
							<div class="flex-1">
								<h3 class="text-lg font-medium text-gray-300">{cast.username}</h3>
								<p class="text-gray-300 text-base">{Math.round(cast.predict_accuracy * 100)} %</p>
							</div>
							<img src="https://oblivion-esport.fr/{index + 1}.png" alt="" class="ml-5 size-10" />
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.bnw {
		filter: grayscale(1);
		z-index: 0;
	}
	.custom-grid {
		grid-template-columns: 1fr 50px 1fr;
	}
	.horizontal-scroll-except-first-column {
		width: 100%;
		overflow: auto;
	}

	.horizontal-scroll-except-first-column > table {
		margin-left: 20em;
	}

	.horizontal-scroll-except-first-column > table > * > tr > th:first-child,
	.horizontal-scroll-except-first-column > table > * > tr > td:first-child {
		position: absolute;
		margin-left: -23em;
		background-color: #111827;
		z-index: 2;
	}

	.horizontal-scroll-except-first-column > table > * > tr > th,
	.horizontal-scroll-except-first-column > table > * > tr > td {
		/* Without this, if a cell wraps onto two lines, the first column
   * will look bad, and may need padding. */
		white-space: nowrap;
	}
	.hideout {
		position: absolute;
		width: 23em;
		background-color: #111827;
		height: 100%;
		z-index: 0;
	}

	.w-custom {
		width: calc(100vw + 20px);
	}

	/*Mobile, let the whole table scroll*/
	@media screen and (max-width: 640px) {
		.horizontal-scroll-except-first-column {
			overflow: auto;
			margin-left: -3em;
		}
		.horizontal-scroll-except-first-column > table {
			margin-left: 0;
			padding-left: 0;
		}
		.horizontal-scroll-except-first-column > table > * > tr > th:first-child,
		.horizontal-scroll-except-first-column > table > * > tr > td:first-child {
			position: relative;
		}
		.hideout {
			display: none;
		}
	}

	/*Scrollbar styling*/

	.horizontal-scroll-except-first-column::-webkit-scrollbar {
		height: 12px;
		margin-left: 25em;
		width: 500px;
		background-color: #111827;
	}
	.horizontal-scroll-except-first-column::-webkit-scrollbar-thumb {
		background-color: #4b5563;
		border-radius: 10px;
	}
</style>
