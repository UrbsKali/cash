<script>
	export let href = '';
	export let title = undefined;
	export let text = '';
</script>

<div class="flex flex-col justify-center w-full py-4">
	<img src={href} {title} alt={text} class="self-center w-9/12 h-auto rounded-lg shadow-lg" />
	{#if title || text}
		<p class="self-center ml-4 text-sm text-gray-500">{title || text}</p>
	{/if}
</div>
