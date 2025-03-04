<script>
	export let items = [{ text: '', href: '' }];
	export let title = '';
</script>

<div
	class="flex flex-col text-left h-full justify-between content-between items-center md:items-start mt-5 md:m-0"
>
	<hr class="md:hidden white w-24 h-5 border-white rounded-sm m-1" />
	<p class="font-bold dark:text-white uppercase pb-1">{title}</p>
	<div class="flex flex-col items-center md:items-start">
		{#each items as item}
			<a href={item.href} class="text-dark-blue-gray"> {@html item.text} </a>
		{/each}
	</div>
</div>
