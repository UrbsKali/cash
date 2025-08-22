<script>
	export let depth = 1;
	export let text = '';
</script>

{#if depth === 1}
	<h1 class="pb-4 text-3xl font-bold tracking-tight text-white"><slot>{text}</slot></h1>
{:else if depth === 2}
	<h2 class="py-4 text-2xl font-bold tracking-tight text-white"><slot>{text}</slot></h2>
{:else if depth === 3}
	<h3 class="py-4 text-xl font-bold tracking-tight text-white"><slot>{text}</slot></h3>
{:else if depth === 4}
	<h4 class="py-4 text-lg font-bold tracking-tight text-white"><slot>{text}</slot></h4>
{:else if depth === 5}
	<h5 class="py-4 text-base font-bold tracking-tight text-white"><slot>{text}</slot></h5>
{:else if depth === 6}
	<h6 class="py-4 text-sm font-bold tracking-tight text-white"><slot>{text}</slot></h6>
{/if}
