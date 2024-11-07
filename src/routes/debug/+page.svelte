<script>
	import SucessModal from '$lib/components/InfoModal.svelte';
</script>

<button
	on:click={(e) => {
		e.stopPropagation()
		new SucessModal({
			target: document.body,
			props: {
				open: true
			}
		});
	}}
	class="flex items-center justify-center p-2 py-2 mr-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:px-4 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
>
	Show popup
</button>
