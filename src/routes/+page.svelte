<script>
	import UserBadge from '$lib/components/UserBadge.svelte';
	import { config } from '$lib/config';
	import { onMount } from 'svelte';

	let url = '/admin';

	onMount(() => {
		url = window.location.origin + config.basePath + '/admin';
		console.log(config.basePath);
		console.log(url);
	});
</script>

<section></section>

<style>
</style>
