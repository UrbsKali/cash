<script>
	export let secondary = false;
	export let href = '';

	let classes = secondary
		? 'bg-transparent text-dark-light-blue'
		: ' bg-dark-light-blue text-dark-blue ';
</script>

{#if href}
	<a {href}>
		<button
			class="px-4 py-2 font-bold rounded-xl {classes} border-[3.25px] border-dark-light-blue"
			type="button"
		>
			<slot></slot>
		</button>
	</a>
{:else}
	<button
		class="px-6 py-2 text-lg font-bold rounded-xl {classes} border-[3.25px] border-dark-light-blue"
		type="button"
	>
		<slot></slot>
	</button>
{/if}
