<script>
	export let pre = false;
</script>

{#if pre}
	<pre class="font-mono text-sm text-white"><slot /></pre>
{:else}
	<p class="text-base text-justify text-white"><slot /></p>
{/if}
