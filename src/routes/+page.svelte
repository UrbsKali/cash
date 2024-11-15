<script>
	import Sponsor from '$lib/components/others/Sponsor.svelte';
	import Topbar from '$lib/components/share/Topbar.svelte';
	import CtaButton from '$lib/components/utils/CTAButton.svelte';
</script>

<Topbar />

<div class="flex flex-col h-full gap-8 pt-48 mx-32">
	<div class="justify-start w-7/12">
		<div class="flex flex-col justify-start gap-4 full text-start">
			<div class="flex flex-col gap-5">
				<h1 class=" text-6xl font-extrabold tracking-[4.10px] pr-5">
					DaVinciBot dépasse <wbr />les voies du binaire.
				</h1>
				<p class="self-stretch text-xl tracking-wider text-blue-gray dark:text-dark-blue-gray">
					DaVinciBot rassemble des étudiants de l'ESILV, de l'EMLV et de l'IIM du Pôle Universitaire
					Léonard de Vinci autour d'activités, de projets innovants et de nombreuses formations,
					dans le but de faire exceller ses membres dans leurs études et leur vie professionnelle.
				</p>
			</div>
			<div class="flex gap-8">
				<CtaButton>Nos Projets</CtaButton>
				<CtaButton secondary={true}>Soutenez nous</CtaButton>
			</div>
		</div>
		<div class="flex flex-col justify-center w-full mt-32">
			<h2 class="text-base font-bold">Nos soutiens</h2>
			<Sponsor />
		</div>
	</div>
</div>

<style>
</style>
