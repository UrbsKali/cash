<script>
	export let title = '';
	export let description = '';
	export let image = '';
	export let link = '';
</script>

<div class="rounded-xl border-[3.5px] border-dark-light-blue p-4 min-w-[480px] flex flex-col gap-2">
	<div class="flex justify-between">
		<h1 class="text-2xl font-bold">{title}</h1>
	</div>
	<div class="flex gap-10">
		<div class="max-w-[45%]">
			<p class="mb-2 text-sm text-justify text-blue-gray dark:text-dark-blue-gray">{description}</p>
			<a href={link} class=" text-blue-peps dark:text-dark-light-blue">En savoir plus...</a>
		</div>
		<div id="img-mask" class="h-32">
			<img src={image} alt={title} class="h-32 aspect-16/9" />
		</div>
	</div>
</div>

<style>
	#img-mask::after {
		content: '';
		width: 100%;
		height: 100%;
		transform: translateY(-100%);
		position: relative;
		display: block;
		/* add blue transparent filter  */
		background:
			linear-gradient(rgb(2, 50, 255, 0.3), rgba(2, 50, 255, 0.3)),
			url('') no-repeat center center;
		background-size: cover;
	}
	#img-mask img {
		object-fit: cover;
	}
</style>
