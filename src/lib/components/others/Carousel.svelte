<script>
	// Duration in seconds for a full loop
	export let time = 50;
</script>

<div class="w-full h-full">
	<div class="relative w-full h-full py-5 overflow-hidden carrousel">
		<!--
			The inner track duplicates the slot content to create an infinite marquee.
			CSS handles width via max-content, avoiding JS measurements that can be flaky in Firefox.
		-->
		<div class="flex carousel-inner" style={`--duration: ${time}s`}>
			<div class="flex items-center h-full gap-8">
				<slot></slot>
			</div>
			<div class="flex items-center h-full gap-8 pl-8" aria-hidden="true">
				<slot></slot>
			</div>
		</div>
	</div>
</div>

<style>
	.carousel-inner {
		/* Use CSS var for duration to avoid inline animation style precedence issues */
		animation: slidein var(--duration, 50s) linear infinite;
		/* Ensure smooth and stable animation across browsers (esp. Firefox) */
		will-change: transform;
		transform: translateZ(0);
		/* Prevent shrinking and let intrinsic width define the track */
		width: max-content;
		flex: none;
	}

	.carrousel {
		position: relative;
		/* optional background color to match gradient edges; adjust to your theme */
		background-color: transparent;
	}

	.carrousel::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(90deg, rgb(1, 1, 40) 0%, rgba(1, 1, 40, 0) 50%, #010128 100%);
	}

	@keyframes slidein {
		from {
			transform: translateX(0);
		}
		to {
			/* Move by half the track width; with duplicated content this loops seamlessly */
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.carousel-inner {
			animation: none;
		}
	}
</style>
