<script>
	import Topbar from '$lib/components/share/Topbar.svelte';
	import Footer from '$lib/components/share/Footer.svelte';
	export let data;

	const posts = data?.posts || [];
	const featured = posts[0];
	const rest = posts.slice(1);
	function fmt(dateStr) {
		if (!dateStr) return '';
		try {
			return new Date(dateStr).toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}
</script>

<svelte:head>
	<title>Actus — DaVinciBot</title>
	<link rel="canonical" href="https://davincibot.fr/blog/" />
	<meta name="description" content="Dernières nouvelles, projets et coulisses de DaVinciBot." />
	<meta name="robots" content="index,follow" />
	<meta property="og:title" content="Actus — DaVinciBot" />
	<meta
		property="og:description"
		content="Dernières nouvelles, projets et coulisses de DaVinciBot."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://davincibot.fr/blog/" />
	<meta property="og:image" content="https://davincibot.fr/dvb_og_img.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Actus — DaVinciBot" />
	<meta
		name="twitter:description"
		content="Dernières nouvelles, projets et coulisses de DaVinciBot."
	/>
	<meta name="twitter:image" content="https://davincibot.fr/dvb_og_img.png" />
</svelte:head>

<Topbar />

<section class="pt-24 md:pt-28">
	<div class="px-6 md:px-16 lg:px-32">
		<header class="flex flex-col gap-2 mb-6">
			<h1 class="text-3xl font-extrabold tracking-wide md:text-5xl">Actus</h1>
			<p class="text-dark-blue-gray md:text-lg">
				Dernières nouvelles, projets et coulisses de l'association.
			</p>
		</header>

		{#if !posts.length}
			<div class="p-6 text-center text-gray-400 border border-gray-700 rounded-xl">
				Aucun article n'a été publié pour le moment. Revenez bientôt.
			</div>
		{:else if featured}
			<a
				class="grid items-stretch grid-cols-1 gap-6 overflow-hidden transition-colors border border-gray-700 group md:grid-cols-12 rounded-2xl hover:border-dark-light-blue"
				href={`/blog/${featured.slug}`}
			>
				<div class="relative md:col-span-7 bg-gray-800/40">
					<img
						alt={featured.title}
						src={featured.cover}
						class="object-cover w-full transition-opacity h-72 md:h-full opacity-90 group-hover:opacity-100"
					/>
				</div>
				<div class="flex flex-col self-center gap-3 p-6 md:col-span-5">
					<div class="text-sm text-gray-400">{fmt(featured.date)}</div>
					<h2 class="text-2xl font-bold leading-tight md:text-3xl group-hover:text-white">
						{featured.title}
					</h2>
					{#if featured.tags?.length}
						<ul class="flex flex-wrap gap-2 mt-1">
							{#each featured.tags.slice(0, 6) as tag}
								<li
									class="px-2 py-1 text-xs border rounded-md border-dark-light-blue/40 text-dark-light-blue bg-dark-light-blue/10"
								>
									#{tag}
								</li>
							{/each}
						</ul>
					{/if}
					<p class="text-dark-blue-gray line-clamp-4">{featured.description}</p>
					<div class="mt-2 text-dark-light-blue">Lire l'article →</div>
				</div>
			</a>
		{/if}

		{#if rest.length}
			<div class="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3">
				{#each rest as post}
					<a
						class="flex flex-col overflow-hidden transition-colors border border-gray-700 group rounded-xl hover:border-dark-light-blue"
						href={`/blog/${post.slug}`}
					>
						<img src={post.cover} alt={post.title} class="object-cover w-full h-48" />
						<div class="flex flex-col gap-2 p-4">
							<div class="text-xs text-gray-400">{fmt(post.date)}</div>
							<h3 class="text-lg font-semibold group-hover:text-white">{post.title}</h3>
							{#if post.tags?.length}
								<ul class="flex flex-wrap gap-1.5">
									{#each post.tags.slice(0, 5) as tag}
										<li
											class="text-[10px] px-2 py-0.5 rounded border border-dark-light-blue/40 text-dark-light-blue bg-dark-light-blue/10"
										>
											#{tag}
										</li>
									{/each}
								</ul>
							{/if}
							<p class="text-sm text-dark-blue-gray line-clamp-3">{post.description}</p>
							<span class="mt-1 text-sm text-dark-light-blue">Lire →</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-14">
		<Footer />
	</div>
</section>

<style>
	/* line clamp utility fallback if not available */
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
