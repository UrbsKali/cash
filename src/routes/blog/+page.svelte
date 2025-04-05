<script>
	import Carousel from '$lib/components/others/Carousel.svelte';
	import Card from '$lib/components/share/Card.svelte';
	import Topbar from '$lib/components/share/Topbar.svelte';
	import CtaButton from '$lib/components/utils/CTAButton.svelte';
	import Footer from '$lib/components/share/Footer.svelte';

	import { onMount } from 'svelte';

	onMount(() => {
		const counters = document.querySelectorAll('.counter');

		const animateCount = (counter) => {
			const target = +counter.getAttribute('data-target');
			let count = 0;
			const speed = target / 300;

			const updateCount = () => {
				count += speed;
				if (count < target) {
					counter.innerText = Math.ceil(count);
					requestAnimationFrame(updateCount);
				} else {
					counter.innerText = target;
				}
			};

			updateCount();
		};

		// **Trigger Animation Only When Element is Visible**
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCount(entry.target);
					observer.unobserve(entry.target); // Stop observing once animated
				}
			});
		});

		counters.forEach((counter) => observer.observe(counter));
	});
</script>

<Topbar />

<div class="relative">
	<div class="-mt-5 md:-mt-64">
		<img
			class="bg-gray-500 opacity-50 w-full"
			alt="Précoupe de robotique"
			src="/assets/article/precoupe.jpg"
		/>
	</div>
	<div
		class=" -mt-28 md:-mt-72 pt-12 md:pt-0 absolute z-10 w-full bg-gradient-to-b dark:from-dark-blue/0 from-0% dark:via-dark-blue/60 via-1% dark:via-dark-blue/70 via-2% dark:via-dark-blue/80 via-3% dark:via-dark-blue/90 via-4% dark:to-dark-blue to-5% from-white/0 via-white/60 via-1% via-white/70 via-2% via-white/80 via-3% via-white/90 via-4% to-white"
	>
		<div class=" flex flex-col h-full gap-8 pt-5 md:pt-28 md:mx-32 mx-6">
			<div class="flex md:flex-row flex-col text-center md:text-start">
				<div class="flex flex-col gap-5 w-fit">
					<h1 class="text-xl md:text-3l lg:text-6xl font-extrabold tracking-[4.10px] md:pr-5">
						DaVinciBot l’association <br /> étudiante de robotique.
					</h1>
					<p
						class="self-stretch md:text-xl tracking-wider text-blue-gray dark:text-dark-blue-gray md:pr-24"
					>
						DaVinciBot participe depuis plus de 10 ans à cette compétion organisée par Planet
						Science avec tous les ans une nouvelle équipe, un nouveau thème et de nouveaux défis à
						réaliser.
					</p>
				</div>
				<div class="flex flex-col gap-6 md:gap-8 w-80 px-0 md:px-4 py-6 md:py-4 self-center">
					<CtaButton>Nos projets</CtaButton>
					<CtaButton>Soutenez-nous</CtaButton>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center md:mt-12">
				<div class="flex flex-col w-full md:w-6/12 gap-4 md:gap-12 text-center">
					<h1 class="text-xl md:text-3xl lg:text-6xl font-extrabold tracking-[4.10px] md:pr-5">
						Nos actualités
					</h1>
					<p class="self-stretch md:text-xl tracking-wider text-blue-gray dark:text-dark-blue-gray">
						DaVinciBot organise et participe à des événements de robotique, offrant à ses membres
						des occasions de se perfectionner et de relever des défis concrets. <br /><br />
						L'association propose des compétitions internes et externes, ainsi que des ateliers, permettant
						aux étudiants d'appliquer leurs connaissances et d'innover en robotique.
					</p>
				</div>
				<div class="max-w-full mt-5 md:my-10">
					<Carousel speed={50}>
						<Card
							title="DaVinciBot l’association étudiante de robotique."
							description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
							image="/assets/article/precoupe.jpg"
						/>
						<Card
							title="DaVinciBot l’association étudiante de robotique."
							description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
							image="/assets/article/precoupe.jpg"
						/>
						<Card
							title="DaVinciBot l’association étudiante de robotique."
							description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
							image="/assets/article/precoupe.jpg"
						/>
						<Card
							title="DaVinciBot l’association étudiante de robotique."
							description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
							image="/assets/article/precoupe.jpg"
						/>
					</Carousel>
				</div>
			</div>
			<div class="flex flex-row md:py-10 justify-between px-6 md:px-28">
				<div class="gap-3 flex flex-col">
					<p class="counter text-2xl md:text-4xl self-center font-extrabold" data-target="3">0</p>
					<p class="uppercase text-sm md:text-xl self-center">écoles</p>
				</div>
				<div class="gap-3 flex flex-col">
					<p class="text-2xl md:text-4xl self-center font-extrabold">
						+<span class="counter" data-target="10500">0</span>
					</p>
					<p class="uppercase text-sm md:text-xl self-center">étudiants</p>
				</div>
				<div class="gap-3 flex flex-col">
					<p class="counter text-2xl md:text-4xl self-center font-extrabold" data-target="7">0</p>
					<p class="uppercase text-sm md:text-xl self-center">campus</p>
				</div>
			</div>

			<div class="flex-col flex pt-4 gap-4 md:pt-0 md:gap-0">
				<div class="flex flex-col md:flex-row py-6 gap-10 justify-center items-center">
					<img class="md:w-1/4 rounded-2xl" alt="CDR" src="/assets/projets/CDR.jpg" />
					<div class="flex flex-col h-full justify-between content-between">
						<h1 class="text-2xl md:text-3xl font-extrabold text-center md:text-left">
							Coupe de France de Robotique
						</h1>
						<p
							class="md:text-xl py-2 text-blue-gray dark:text-dark-blue-gray text-center md:text-left"
						>
							Nous participons depuis plus de 10 ans à cette compétition avec tous les ans une
							nouvelle équipe.
						</p>
						<div class="flex flex-col md:block px-0 md:w-80 py-4">
							<CtaButton>Découvrir</CtaButton>
						</div>
					</div>
				</div>
				<div class="flex flex-col md:flex-row py-6 gap-10 justify-center items-center">
					<img class="rounded-2xl md:hidden" alt="Travelers" src="/assets/projets/Travelers.jpg" />
					<div class="flex flex-col h-full justify-between content-between">
						<h1 class="text-2xl md:text-3xl font-extrabold text-center md:text-left">TRAVELERS</h1>
						<p
							class="md:text-xl py-2 text-blue-gray dark:text-dark-blue-gray text-center md:text-left"
						>
							Il s’agit d’un rover tout terrain amphibie dont l’objectif est de pouvoir vivre sur
							Titan, une lune de Saturne.
						</p>
						<div class="flex flex-col md:block px-0 md:w-80 py-4">
							<CtaButton>Découvrir</CtaButton>
						</div>
					</div>
					<img
						class="w-1/4 rounded-2xl hidden md:flex"
						alt="Travelers"
						src="/assets/projets/Travelers.jpg"
					/>
				</div>
				<div class="flex flex-col md:flex-row py-6 gap-10 justify-center items-center">
					<img class="md:w-1/4 rounded-2xl" src="" alt="Exaudus" />
					<div class="flex flex-col h-full justify-between content-between">
						<h1 class="text-2xl md:text-3xl font-extrabold text-center md:text-left">Exaudus</h1>
						<p
							class="md:text-xl py-2 text-blue-gray dark:text-dark-blue-gray text-center md:text-left"
						>
							Nous entamons la conception d’un exosquelette qui pourra contrôler un petit robot
							humanoïde.
						</p>
						<div class="flex flex-col md:block px-0 md:w-80 py-4">
							<CtaButton>Découvrir</CtaButton>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-4 md:gap-12 text-center md:my-10">
				<h1
					class=" md:text-3xl text-xl lg:text-6xl font-extrabold tracking-[4.10px] md:pr-5 py-4 md:py-0"
				>
					Des articles similaires
				</h1>
				<Carousel speed={50}>
					<Card
						title="DaVinciBot l’association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l’association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l’association étudiante de robotique."
						description="Notre équipe a été invitée à participer au lancement de la coupe de france de robotique 2025 à EPITA pour l'annonce du nouveau theme de l'année."
						image="/assets/article/precoupe.jpg"
					/>
					<Card
						title="DaVinciBot l’association étudiante de robotique."
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
