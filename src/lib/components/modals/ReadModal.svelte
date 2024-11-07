<script>
	import { get_current_component } from 'svelte/internal';
	import { hideOnClickOutside } from '$lib/utils';
	import { onMount } from 'svelte';
	const current_component = get_current_component();

	export let values = {
		header: {
			title: 'SKT vs T1',
			sub: '2024-05-17'
		},
		body: [
			{
				label: 'Match',
				value: 'SKT vs T1, Trankil word cup'
			},
			{
				label: 'Date',
				value: '2024-05-17'
			},
			{
				label: 'Prédictions',
				value: 'Victoire de SKT, 2-1' // ou bien 'Match non joué'
			},
			{
				label: 'Utilisateur',
				value: 'Mascode'
			}
		]
	};
	export let actions = [];
	export let id = 'readModal';

	export let onClose = (e) => {};

	let __onClose = (e) => {
		// remove componant from tree
		current_component.$destroy();
		onClose(e);
	};

	onMount(() => {
		const popup = document.querySelector(`#popup-${id}`);
		hideOnClickOutside(popup, __onClose);
	});
</script>

<div
	{id}
	tabindex="-1"
	aria-hidden="true"
	class="fixed top-0 left-0 right-0 z-50 items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto md:inset-0 backdrop-blur-sm"
	data-toggle="true"
>
	<div class="relative flex w-full h-full p-4 m-auto">
		<!-- Modal content -->
		<div
			class="relative p-4 m-auto bg-gray-800 rounded-lg sm:p-5 min-w-96 max-w-[75%] md:max-w-[70%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[50%] modal"
			id="popup-{id}"
		>
			<!-- Modal header -->
			<div class="flex justify-between mb-4 rounded-t sm:mb-5">
				<div class="flex w-full text-lg text-white md:text-xl">
					<h3 class="mr-2 font-semibold">{values.header.title}</h3>
					{#if values.header.sub}
						<p class="font-semibold text-gray-400">- {values.header.sub}</p>
					{/if}
				</div>
				<div>
					<button
						type="button"
						class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 inline-flex hover:bg-gray-600 hover:text-white"
						data-modal-toggle={id}
						on:click={__onClose}
						data-toggle="true"
					>
						<svg
							aria-hidden="true"
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							data-toggle="true"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path></svg
						>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
			</div>
			<dl>
				{#each values.body as { label, value }}
					<dt class="mb-2 font-semibold leading-none text-white">{label}</dt>
					<dd class="mb-4 font-light text-gray-400 transition-colors sm:mb-5 hover:text-gray-300">
						{value}
					</dd>
				{/each}
			</dl>
			<div class="flex items-center justify-between">
				{#each actions as { title, type, handler }}
					{#if type == 'edit'}
						<button
							type="button"
							class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
							on:click={handler}
						>
							<svg
								aria-hidden="true"
								class="w-5 h-5 mr-1 -ml-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
								></path><path
									fill-rule="evenodd"
									d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
									clip-rule="evenodd"
								></path></svg
							>
							{title}
						</button>
					{/if}
					{#if type == 'validate'}
						<button
							type="button"
							class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
							on:click={handler}
						>
							<svg
								aria-hidden="true"
								class="w-5 h-5 mr-1.5 -ml-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								><path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path></svg
							>
							{title}
						</button>
					{/if}
					{#if type == 'delete'}
						<button
							type="button"
							class="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-500 hover:bg-red-600 focus:ring-red-900"
							on:click={handler}
						>
							<svg
								aria-hidden="true"
								class="w-5 h-5 mr-1.5 -ml-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								><path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clip-rule="evenodd"
								></path></svg
							>
							{title}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
