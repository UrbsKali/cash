<script>
	import Carousel from '$lib/components/others/Carousel.svelte';
	import Card from '$lib/components/share/Card.svelte';
	import Topbar from '$lib/components/share/Topbar.svelte';
	import CtaButton from '$lib/components/utils/CTAButton.svelte';
	import Footer from '$lib/components/share/Footer.svelte';

	import { onMount } from 'svelte';
</script>

<Topbar />

<div class="relative">
	<div class="-mt-5 md:-mt-64">
		<img
			class="w-full bg-gray-500 opacity-50"
			alt="Précoupe de robotique"
			src="/assets/article/precoupe.jpg"
		/>
	</div>
	<div
		class="-mt-28 md:-mt-72 pt-12 md:pt-0 absolute z-10 w-full bg-gradient-to-b from-white/0 from-0% via-1% via-dark-blue/70 via-2% via-3% via-4% to-5% via-1% via-4% to-dark-blue"
	>
		<div class="flex flex-col h-full gap-8 pt-5 md:pt-28 md:mx-32">
			<div class="flex flex-col text-center lg:flex-row lg:text-start">
				<div class="flex flex-col gap-5 w-fit">
					<h1 class="text-3xl lg:text-4xl xl:text-6xl font-extrabold tracking-[4.10px] md:pr-5">
						DaVinciBot l'association étudiante de robotique.
					</h1>
					<p class="self-stretch tracking-wider md:text-xl text-dark-blue-gray md:pr-24">
						DaVinciBot participe depuis plus de 10 ans à cette compétion organisée par Planet
						Science avec tous les ans une nouvelle équipe, un nouveau thème et de nouveaux défis à
						réaliser.
					</p>
				</div>
				<div class="flex flex-col self-center gap-6 px-0 py-6 md:gap-8 w-80 md:px-4 md:py-4">
					<CtaButton>Nos projets</CtaButton>
					<CtaButton>Soutenez-nous</CtaButton>
				</div>
			</div>

			<div class="flex flex-col gap-4 text-center md:gap-12 md:my-10">
				<h3
					class="text-3xl lg:text-4xl xl:text-6xl font-extrabold tracking-[4.10px] md:pr-5 py-4 md:py-0"
				>
					Articles similaires
				</h3>
				<Carousel>
					<Card
						title="DaVinciBot l'association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l'association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l'association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l'association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
				</Carousel>
			</div>
		</div>
		<Footer />
	</div>
</div>

<style>
</style>
