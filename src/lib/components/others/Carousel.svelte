<script>
	import { onMount } from 'svelte';

	export let speed = 10;

	let random = Math.floor(Math.random() * 10000); // Random number to avoid conflicts with multiple carousels

	onMount(() => {
		const carouselContainer = document.querySelector(`#carousel-container-${random}`);
		const carousel = document.querySelector('#carousel-' + random);
		const carouselHeight = carouselContainer.getBoundingClientRect().height;
		carouselContainer.style.height = `${carouselHeight}px`;

		carousel.style.animationDuration = `${speed}s`;
	});
</script>

<div>
	<div id="carousel-container-{random}" class="relative w-full py-5 overflow-hidden carrousel">
		<div
			class="flex items-center justify-center gap-8 align-middle carousel-inner"
			id="carousel-{random}"
		>
			<slot></slot>
		</div>
	</div>
</div>

<style>
	.carousel-inner {
		animation: infinite_scroll 10s linear infinite;
	}

	.carrousel::after {
		content: '';
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform: translateY(-100%);
		background: linear-gradient(
			90deg,
			rgb(255, 255, 255) 0%,
			rgba(255, 255, 255, 0) 50%,
			#fff 100%
		);
	}
	@media (prefers-color-scheme: dark) {
		.carrousel::after {
			background: linear-gradient(90deg, rgb(1, 1, 40) 0%, rgba(1, 1, 40, 0) 50%, #010128 100%);
		}
	}

	@keyframes infinite_scroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-232px);
		}
	}
</style>
