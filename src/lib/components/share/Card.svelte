<script>
	export let title;
	export let description;
	export let image;
	export let url = '#';
	export let is_big = false;
</script>

<div
	class="flex flex-row items-end gap-5 p-5 bg-opacity-25 bg-center bg-no-repeat bg-cover border border-gray-700 rounded-lg min-h-36 backdrop-blur-lg sm:h-48"
	style="background-image: linear-gradient(rgba(14, 19, 31, 0.3) 0%, rgba(14, 19, 31, 1) 100%), url({image});"
>
	<div class="flex flex-col gap-1">
		<h2 class="text-2xl font-bold text-white">{title}</h2>
		<div class="flex flex-col gap-5">
			<a
				href={url}
				class="px-4 py-2 text-center text-white border rounded-md border-primary-700 backdrop-blur-lg max-w-32 bg-opacity-30 bg-primary-500 hover:bg-opacity-70"
				>Lire l'article</a
			>
		</div>
	</div>
</div>
