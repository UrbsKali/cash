<script>
	export let name = '';
	export let fill = '';
	export let size = '';
</script>

<i class="w-{size} aspect-square fill-{fill}  text-{fill}">
	<svg>
		<use src="/assets/img/icon/{name}.svg" />
	</svg>
</i>
