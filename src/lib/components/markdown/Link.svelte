<script>
	export let href = '';
	export let title = undefined;
</script>

<a
	{href}
	{title}
	target="_blank"
	rel="noopener noreferrer"
	class="text-blue-400 hover:text-blue-300 underline"
>
	<slot />
	{#if !$$slots.default}
		{title}
	{/if}
</a>
