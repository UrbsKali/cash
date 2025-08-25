<script>
	export let pre = false;
</script>

{#if pre}
	<pre class="mb-2 font-mono text-sm text-white"><slot /></pre>
{:else}
	<p class="mb-2 text-base text-justify text-white"><slot /></p>
{/if}
