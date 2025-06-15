<script>
	// @ts-nocheck

	import { get_current_component } from 'svelte/internal';
	import { hideOnClickOutside } from '$lib/utils';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import Stepper from '../admin/Stepper.svelte';

	const current_component = get_current_component();

	export let values = {
		header: {
			title: 'Pas de détails',
			sub: '-',
			stepper: []
		},
		body: []
	};
	export let files = [];
	export let actions = [];
	export let id = 'readDrawer';

	let current_file = '';
	let current_file_index = 0;
	let scroll_body = null;
	let isMobile = false;
	let files_array = [{ mime: 'application/pdf', url: null }];

	export let onClose = (e) => {};
	let __onClose = (e) => {
		current_component.$destroy();
		onClose(e);
	};

	onMount(async () => {
		const drawer = document.querySelector(`#drawer-${id}`);
		hideOnClickOutside(drawer, __onClose);
		// check if mobile
		if (window.innerWidth < 768) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		if (files && files.length > 0) {
			// get the all signed url from supabase
			const { data: urls } = await supabase.storage.from('proof').createSignedUrls(files, 600);

			for (let i = 0; i < urls.length; i++) {
				if (urls[i].error) {
					console.error(urls[i].error);
					continue;
				}
				// get the blob from the url
				const r = await fetch(urls[i].signedUrl);
				if (!r.ok) {
					console.error('Error fetching blob:', r.statusText);
					continue;
				}
				const b = await r.blob();
				if (!b) {
					console.error('Error getting blob:', r.statusText);
					continue;
				}
				files_array[i] = {
					mime: b.type,
					url: urls[i].signedUrl,
					name: decodeURI(urls[i].signedUrl.split('/')[10].split('?')[0])
				};
				console.log(files_array[i]);
			}
			current_file = files_array[0]?.name;
		}
	});
</script>

<!-- Backdrop -->
<div class="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm" on:click={__onClose}></div>

<!-- Drawer -->
<div
	id={'drawer-' + id}
	tabindex="-1"
	class="fixed top-0 right-0 z-50 flex flex-col h-full transition-transform duration-300 bg-gray-800 shadow-lg w-96"
	style="transform: translateX(0);"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-gray-700">
		<div class="flex flex-col">
			<span class="text-lg font-semibold text-white">{values.header.title}</span>
			{#if values.header.sub}
				<span class="text-sm text-gray-400">{values.header.sub}</span>
			{/if}
		</div>
		<button
			type="button"
			class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
			on:click={__onClose}
		>
			<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			<span class="sr-only">Close drawer</span>
		</button>
	</div>
	{#if values.header.stepper}
		<div class="w-full px-4 py-2 m-auto border-b border-gray-700">
			<Stepper />
		</div>
	{/if}
	<!-- Content -->
	<div class="flex-1 p-4 space-y-4 overflow-y-auto">
		{#if files.length > 0}
			<div>
				<h3 class="mb-2 text-lg font-semibold text-white">Pièces jointes</h3>
				<div class="flex items-center mb-2">
					<button
						class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
						on:click={() => {
							if (current_file_index > 0) {
								current_file_index--;
								current_file = files_array[current_file_index].name;
								scroll_body &&
									(scroll_body.style.transform = `translateX(${(scroll_body.scrollWidth / files.length) * current_file_index}px)`);
							}
						}}
					>
						<svg class="w-5 h-5" fill="white" viewBox="0 0 20 20"
							><path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path></svg
						>
					</button>
					<p class="flex-1 text-sm text-center text-gray-400">
						{current_file || 'Chargement'} - {current_file_index + 1}/{files.length}
					</p>
					<button
						class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
						on:click={() => {
							if (current_file_index < files.length - 1) {
								current_file_index++;
								current_file = files_array[current_file_index].name;
								scroll_body &&
									(scroll_body.style.transform = `translateX(-${(scroll_body.scrollWidth / files.length) * current_file_index}px)`);
							}
						}}
					>
						<svg class="w-5 h-5 rotate-180" fill="white" viewBox="0 0 20 20"
							><path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path></svg
						>
					</button>
				</div>
				<div class="flex h-auto overflow-x-hidden w-full aspect-[1/1.414] gap-2">
					<div class="flex rounded-lg" bind:this={scroll_body}>
						{#each files_array as { mime, url }, i}
							{@const name = decodeURI(url?.split('/')[10].split('?')[0])}
							<div class="flex flex-col w-full">
								{#if mime == 'application/pdf' && !isMobile}
									<iframe src={url} frameborder="0" class="w-full h-full" title={name}></iframe>
								{:else if mime == 'application/pdf' && isMobile}
									<iframe
										src="https://docs.google.com/viewer?url={url}&embedded=true"
										frameborder="0"
										class="w-full h-full"
										title={name}
									></iframe>
								{:else if mime && mime.startsWith('image/')}
									<img src={url} alt={name} class="w-full max-w-full" />
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<dl>
			{#each values.body as { label, value }}
				<dt class="mb-2 font-semibold leading-none text-white">{label}</dt>
				{#if typeof value === 'object'}
					<dd class="mb-4 ml-2 font-light text-gray-400">
						<table class="w-full border-separate">
							<thead class="font-bold">
								<td>Nom</td>
								<td>Quantité</td>
								<td>Prix</td>
								{#if values.body.find((el) => el.label == 'Status')?.type == 'pendingCDP'}
									<td class="w-2.5"></td>
								{/if}
							</thead>
							<tbody>
								{#each value as item}
									<tr data-utils={item.id}>
										<td class="p-2"><a href={item.link} target="_blank">{item.name}</a></td>
										<td>{item.quantity}</td>
										<td>{item.price}</td>
										{#if values.body.find((el) => el.label == 'Status')?.type == 'pendingCDP'}
											<td>
												<button
													type="button"
													class="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
													on:click={async () => {
														const { data, error } = await supabase
															.from('items')
															.delete()
															.match({ id: item.id })
															.select()
															.single();
														if (error || !data) return;
														const tr = document.querySelector(`tr[data-utils="${item.id}"]`);
														tr && tr.remove();
													}}
												>
													<svg
														aria-hidden="true"
														class="w-5 h-5 -mx-2.5"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
															clip-rule="evenodd"
														></path>
													</svg>
												</button>
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</dd>
				{:else}
					<dd class="mb-4 font-light text-gray-400 transition-colors hover:text-gray-300">
						{value}
					</dd>
				{/if}
			{/each}
		</dl>
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-between p-4 border-t border-gray-700">
		{#each actions as { title, type, handler }}
			{#if type == 'selector'}
				<select
					class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
					on:change={handler}
				>
					<option value="" disabled selected>Choisir une option</option>
					{#each title as { name, value }}
						<option {value}>{name}</option>
					{/each}
				</select>
			{/if}
			{#if type == 'edit'}
				<button
					type="button"
					class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					on:click={handler}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-1 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
						></path>
						<path
							fill-rule="evenodd"
							d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
							clip-rule="evenodd"
						></path>
					</svg>
					{title}
				</button>
			{/if}
			{#if type == 'validate'}
				<button
					type="button"
					class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					on:click={handler}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-1.5 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path>
					</svg>
					{title}
				</button>
			{/if}
			{#if type == 'delete'}
				<button
					type="button"
					class="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					on:click={handler}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-1.5 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					{title}
				</button>
			{/if}
		{/each}
	</div>
</div>
