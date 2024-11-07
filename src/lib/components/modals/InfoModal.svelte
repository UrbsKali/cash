<script>
	import { get_current_component } from 'svelte/internal';
	import { hideOnClickOutside } from '$lib/utils';
	import { onMount } from 'svelte';

	const current_component = get_current_component();

	export let message = 'La commande a été passée avec succès.';
	export let type = 'success';

	let id = `${type}Popup-${Math.random().toString(36).substring(7)}`;

	export let onClose = (e) => {
		window.location.reload();
	};

	let __onClose = (e) => {
		// remove componant from tree
		current_component.$destroy();
		onClose(e);
	};

	export let action = [
		{
			text: 'Suivant',
			callback: __onClose,
			is_main: true
		}
	];

	$: {
		// add close to all callback
		action = action.map((el) => {
			return {
				...el,
				callback: () => {
					el.callback();
					current_component.$destroy();
				}
			};
		});
	}

	onMount(() => {
		const popup = document.querySelector(`#MultiPopup`);
		hideOnClickOutside(popup, __onClose);
	});
</script>

<div
	{id}
	tabindex="-1"
	class="fixed top-0 left-0 right-0 z-50 items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto md:inset-0 backdrop-blur-sm"
>
	<div class="relative flex w-full h-full max-w-md p-4 m-auto">
		<!-- Modal content -->
		<div
			class="relative p-4 m-auto text-center bg-gray-800 rounded-lg shadow sm:p-5"
			id="MultiPopup"
		>
			<button
				type="button"
				class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
				on:click={__onClose}
			>
				<svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path></svg
				>
				<span class="sr-only">Close modal</span>
			</button>
			<div
				class="w-12 h-12 rounded-full {type == 'success' ? 'bg-green-900' : ''} {type == 'error'
					? 'bg-red-900'
					: ''} {type == 'warning' ? 'bg-yellow-900' : ''} {type == 'info'
					? 'bg-opacity-0'
					: ''} p-2 flex items-center justify-center mx-auto mb-3.5"
			>
				{#if type === 'success'}
					<svg
						aria-hidden="true"
						class="w-8 h-8text-green-400"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path></svg
					>
				{:else if type === 'error'}
					<svg
						class="w-8 h-8 text-red-400"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				{:else if type === 'warning'}
					<svg
						class="w-8 h-8 text-yellow-400"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				{:else if type === 'info'}
					<svg
						class="w-8 h-8 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				{/if}
				<span class="sr-only">Action modal</span>
			</div>
			<p class="mb-4 text-lg font-semibold text-white">{message}</p>
			<div class="flex flex-row justify-center space-x-2">
				{#each action as el}
					<button
						type="button"
						class="px-3 py-2 text-sm font-medium text-center text-white rounded-lg {el.is_main
							? 'bg-primary-600 hover:bg-primary-700'
							: 'border-white border'} focus:ring-4 focus:outline-none focus:ring-primary-900"
						on:click={el.callback}
					>
						{el.text}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
