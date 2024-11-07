<script>
	export let href = '';
	export let title = undefined;
	export let text = '';
</script>

<div class="flex justify-center w-full py-4">
	<img src={href} {title} alt={text} class="w-9/12 h-auto rounded-lg shadow-lg" />
</div>
