<script>
	export let align = 'left';
	export let header = false;
	export let text = '';
</script>

{#if header}
	<th class="px-4 py-2 border">{text}</th>
{:else}
	<td class="px-4 py-2 border">{text}</td>
{/if}
