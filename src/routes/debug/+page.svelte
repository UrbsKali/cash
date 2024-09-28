<script>
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let data, error;

	onMount(async () => {
		// get secret key from supabase vault
		({ data, error } = await supabase.rpc('get_service_key'));
		console.log(data);
	});
</script>

<h1>Debug</h1>
<p>{data}</p>
