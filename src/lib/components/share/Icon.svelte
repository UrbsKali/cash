<script>
	export let name = '';
	export let fill = '';
	export let size = '';
</script>

<i class="w-{size} aspect-square fill-{fill} text-{fill}">
	<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
		<use href={`/assets/img/icon/${name}.svg`} width="100%" height="100%" />
	</svg>
</i>
