<script>
	export let items = [{ text: '', href: '' }];
	export let title = '';
</script>

<div class="flex flex-col text-left h-full justify-between content-between">
	<p class="font-bold dark:text-white uppercase pb-1">{title}</p>
	<div class="flex flex-col">
		{#each items as item}
			<a href={item.href} class="text-dark-blue-gray"> {@html item.text} </a>
		{/each}
	</div>
</div>
