<script>
	// @ts-nocheck

	export let href = '';
	export let target = '_blank';
	export let text = 'Voir le match';
	export let color = 'primary';
	export let revert = false;
	export let onClick = async (e) => {};
</script>

<a
	{href}
	{target}
	on:click={onClick}
	class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-{color}-700 rounded-lg hover:bg-{color}-800 focus:ring-4 focus:outline-none focus:ring-{color}-300 dark:bg-{color}-600 dark:hover:bg-{color}-700 dark:focus:ring-{color}-800 m-auto"
>
	{!revert ? text : ''}
	<svg
		class="w-3.5 h-3.5 {revert ? 'transform rotate-180 me-2' : 'ms-2'}"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 14 10"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M1 5h12m0 0L9 1m4 4L9 9"
		/>
	</svg>
	{revert ? text : ''}
</a>
