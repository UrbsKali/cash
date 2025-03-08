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

<div class=" -mt-96">
	<img
		class=" bg-gray-500 opacity-50 w-full overflow-hidden object-cover"
		alt="Précoupe de robotique"
		src="/assets/article/precoupe.jpg"
	/>
</div>
<div class="flex flex-col h-full gap-8 pt-48 mx-32">
	<div class="flex flex-row">
		<div class="flex flex-col gap-5 justify-start w-fit">
			<h1 class=" text-6xl font-extrabold tracking-[4.10px] pr-5">
				DaVinciBot l’association <br /> étudiante de robotique.
			</h1>
			<p class="self-stretch text-xl tracking-wider text-blue-gray dark:text-dark-blue-gray pr-24">
				DaVinciBot participe depuis plus de 10 ans à cette compétion organisée par Planet Science
				avec tous les ans une nouvelle équipe, un nouveau thème et de nouveaux défis à réaliser.
			</p>
		</div>
		<div class="flex flex-col gap-8 w-80 p-4">
			<CtaButton>Nos projets</CtaButton>
			<CtaButton>Soutenez-nous</CtaButton>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center mt-12">
		<div class="flex flex-col w-6/12 gap-12 text-center">
			<h1 class="text-6xl font-extrabold tracking-[4.10px] pr-5">Nos actualités</h1>
			<p class="self-stretch text-xl tracking-wider text-blue-gray dark:text-dark-blue-gray">
				DaVinciBot organise et participe à des événements de robotique, offrant à ses membres des
				occasions de se perfectionner et de relever des défis concrets. <br /><br />
				L'association propose des compétitions internes et externes, ainsi que des ateliers, permettant
				aux étudiants d'appliquer leurs connaissances et d'innover en robotique.
			</p>
		</div>
		<div class="max-w-full my-10">
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
	<div class="flex flex-row py-10 justify-between px-28">
		<div class="gap-3 flex flex-col">
			<p class="counter text-4xl self-center font-extrabold" data-target="3">0</p>
			<p class="uppercase text-xl self-center">écoles</p>
		</div>
		<div class="gap-3 flex flex-col">
			<p class="text-4xl self-center font-extrabold">
				+<span class="counter" data-target="10500">0</span>
			</p>
			<p class="uppercase text-xl self-center">étudiants</p>
		</div>
		<div class="gap-3 flex flex-col">
			<p class="counter text-4xl self-center font-extrabold" data-target="7">0</p>
			<p class="uppercase text-xl self-center">campus</p>
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-row py-6 gap-10 justify-center items-center">
			<img class="w-1/4 rounded-2xl" alt="CDR" src="/assets/projets/CDR.jpg" />
			<div class="flex flex-col h-full justify-between content-between">
				<h1 class="text-3xl font-extrabold">Coupe de France de Robotique</h1>
				<p class="text-xl py-2">
					Nous participons depuis plus de 10 ans à cette compétition avec tous les ans une nouvelle
					équipe.
				</p>
				<div class="w-80 py-4">
					<CtaButton>Découvrir</CtaButton>
				</div>
			</div>
		</div>
		<div class="flex flex-row py-6 gap-10 justify-center items-center">
			<div class="flex flex-col h-full justify-between content-between">
				<h1 class="text-3xl font-extrabold">TRAVELERS</h1>
				<p class="text-xl py-2">
					Il s’agit d’un rover tout terrain amphibie dont l’objectif est de pouvoir vivre sur Titan,
					une lune de Saturne.
				</p>
				<div class="w-80 py-4">
					<CtaButton>Découvrir</CtaButton>
				</div>
			</div>
			<img class="w-1/4 rounded-2xl" alt="Travelers" src="/assets/projets/Travelers.jpg" />
		</div>
		<div class="flex flex-row py-6 gap-10 justify-center items-center">
			<img class="w-1/4 rounded-2xl" src="" alt="Exaudus" />
			<div class="flex flex-col h-full justify-between content-between">
				<h1 class="text-3xl font-extrabold">Exaudus</h1>
				<p class="text-xl py-2">
					Nous entamons la conception d’un exosquelette qui pourra contrôler un petit robot
					humanoïde.
				</p>
				<div class="w-80 py-4">
					<CtaButton>Découvrir</CtaButton>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-12 text-center my-10">
		<h1 class="text-6xl font-extrabold tracking-[4.10px] pr-5">Des articles similaires</h1>
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

<style>
</style>
