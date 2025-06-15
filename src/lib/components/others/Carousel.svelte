<script>
	import { onMount } from 'svelte';

	export let time = 50;

	let carouselContainer;
	let carouselInner;

	let elOne;
	let elTwo;

	onMount(() => {
		const carouselHeight = carouselContainer.getBoundingClientRect().height;
		carouselContainer.style.height = `${carouselHeight}px`;

		const carouselInnerWidth =
			elOne.getBoundingClientRect().width + elTwo.getBoundingClientRect().width;
		carouselInner.style.width = `${carouselInnerWidth + 32}px`;

		carouselInner.style.animationDuration = `${time}s`;
	});
</script>

<div class="w-full h-full">
	<div class="relative w-full h-full py-5 overflow-hidden carrousel" bind:this={carouselContainer}>
		<div class="flex carousel-inner" bind:this={carouselInner}>
			<div class="flex items-center h-full gap-8" bind:this={elOne}>
				<slot></slot>
			</div>
			<div class="flex items-center h-full gap-8 pl-8" bind:this={elTwo}>
				<slot></slot>
			</div>
		</div>
	</div>
</div>

<style>
	.carousel-inner {
		animation: slidein 50s linear infinite;
	}

	.carrousel::after {
		content: '';
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform: translateY(-100%);
		background: linear-gradient(90deg, rgb(1, 1, 40) 0%, rgba(1, 1, 40, 0) 50%, #010128 100%);
	}

	@keyframes slidein {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}
</style>
