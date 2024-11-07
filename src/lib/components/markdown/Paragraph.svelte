<script>
	export let pre = false;
</script>

{#if pre}
	<pre class="font-mono text-sm text-gray-900 dark:text-white"><slot /></pre>
{:else}
	<p class="text-base text-justify text-gray-900 dark:text-white"><slot /></p>
{/if}
