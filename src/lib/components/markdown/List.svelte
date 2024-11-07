<script>
	export let ordered = false;
	export let start = 1;
	export let loose = false;
</script>

<div class="py-2 pl-4">
	{#if ordered}
		<ol class="list-decimal list-inside">
			<slot />
		</ol>
	{:else}
		<ul class="list-disc list-inside">
			<slot />
		</ul>
	{/if}
</div>
