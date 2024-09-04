<script>
	import { currentOrigin } from '$lib/config';
	import { get_current_component } from 'svelte/internal';
	const current_component = get_current_component();


	export let title = 'On est bon!';
	export let message = 'La commande a été passée avec succès.';
	export let id = 'successModal';
	export let open = false;
	export let onClose = () => {
		open = false;
		current_component.$destroy();
		window.location.href = `${currentOrigin()}/admin`;
	};
</script>

<div
	{id}
	tabindex="-1"
	aria-hidden="true"
	class="{open
		? ''
		: 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full backdrop-blur-sm"
>
	<div class="relative p-4 w-full max-w-md h-full m-auto flex">
		<!-- Modal content -->
		<div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 m-auto">
			<button
				type="button"
				class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
				data-modal-toggle={id}
				on:click={onClose}
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
				class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5"
			>
				<svg
					aria-hidden="true"
					class="w-8 h-8 text-green-500 dark:text-green-400"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					></path></svg
				>
				<span class="sr-only">{title}</span>
			</div>
			<p class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{message}</p>
			<button
				data-modal-toggle={id}
				type="button"
				class="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900"
				on:click={onClose}
			>
				Suivant
			</button>
		</div>
	</div>
</div>
