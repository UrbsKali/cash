<script>
	import Carousel from '$lib/components/others/Carousel.svelte';
	import Card from '$lib/components/share/Card.svelte';
	import Footer from '$lib/components/share/Footer.svelte';
	import Topbar from '$lib/components/share/Topbar.svelte';
	import CtaButton from '$lib/components/utils/CTAButton.svelte';

	import HDSLogo from '$lib/components/share/Logo/HDS.svelte';
	import RSLogo from '$lib/components/share/Logo/RS.svelte';
	import FaulhaberLogo from '$lib/components/share/Logo/Faulhaber.svelte';
	import AlstomLogo from '$lib/components/share/Logo/Alstom.svelte';
	import IFTLogo from '$lib/components/share/Logo/IFT.svelte';
	import GotronicLogo from '$lib/components/share/Logo/Gotronic.svelte';
</script>

<Topbar />

<div class="flex flex-col h-full gap-8 px-4 pt-16 sm:px-8 md:px-16 lg:px-32 md:pt-32 lg:pt-48">
	<div class="justify-start">
		<div class="grid grid-cols-1 md:grid-cols-[2fr_1.5fr] items-center gap-8">
			<div class="flex flex-col justify-start order-2 gap-4 overflow-hidden text-start md:order-1">
				<div class="flex flex-col gap-5">
					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[4.10px] pr-5">
						Ingénieur par vocation<wbr />Robotique par passion
					</h1>
					<p class="self-stretch text-lg tracking-wider sm:text-xl text-dark-blue-gray">
						DaVinciBot rassemble des étudiants de l'ESILV, de l'EMLV et de l'IIM du Pôle
						Universitaire Léonard de Vinci autour d'activités, de projets innovants et de nombreuses
						formations, dans le but de faire exceller ses membres dans leurs études et leur vie
						professionnelle.
					</p>
				</div>
				<div class="flex flex-col gap-4 sm:flex-row sm:gap-8">
					<CtaButton>Nos Projets</CtaButton>
					<CtaButton secondary={true}>Soutenez nous</CtaButton>
				</div>
			</div>
			<img
				src="/assets/projets/rob_shadows.png"
				alt="Robot illustration"
				class="order-1 w-full mx-auto mb-6 md:mb-0 md:order-2 scale-130"
			/>
		</div>

		<div class="flex flex-col justify-center w-full mt-8 2xl:mt-0 sm:w-10/12 md:w-9/12 lg:w-7/12">
			<h2 class="text-base font-bold">Nos soutiens</h2>

			<Carousel>
				<HDSLogo />
				<RSLogo />
				<FaulhaberLogo />
				<AlstomLogo />
				<IFTLogo />
				<GotronicLogo />
			</Carousel>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center mt-12">
		<div class="flex flex-col gap-12 text-left md:text-center md:w-6/12">
			<h1 class="text-6xl font-extrabold tracking-[4.10px] pr-5">Nos actualités</h1>
			<p class="self-stretch text-xl tracking-wider text-dark-blue-gray">
				DaVinciBot organise et participe à des événements de robotique, offrant à ses membres des
				occasions de se perfectionner et de relever des défis concrets. <br /><br />
				L'association propose des compétitions internes et externes, ainsi que des ateliers, permettant
				aux étudiants d'appliquer leurs connaissances et d'innover en robotique.
			</p>
		</div>
		<div class="max-w-full my-10">
			<Carousel time={90}>
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
</div>

<Footer />

<style>
</style>
