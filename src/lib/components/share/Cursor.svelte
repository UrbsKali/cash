<script>
	import { onMount } from 'svelte';

	let cursor;
	let cursorInner;
	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;
	let dampening = 0.1;
	let hover = false;

	onMount(() => {
		document.addEventListener('mousemove', (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		const buttons = document.querySelectorAll('button, a, .cursor-hover');

		buttons.forEach((button) => {
			button.addEventListener('mouseenter', () => {
				hover = true;
			});

			button.addEventListener('mouseleave', () => {
				hover = false;
			});
		});

		requestAnimationFrame(animateCursor);
	});

	function animateCursor() {
		cursorX += (mouseX - cursorX) * dampening;
		cursorY += (mouseY - cursorY) * dampening;

		cursor.style.transform = `translate3d(${cursorX + 4 - 24}px, ${cursorY + 4 - 24}px, 0) scale(${hover ? 1.5 : 1})`;
		cursorInner.style.transform = `translate3d(${mouseX + 20 - 24}px, ${mouseY + 20 - 24}px, 0) scale(${hover ? 1 : 1})`;

		requestAnimationFrame(animateCursor);
	}
</script>

<div class="hidden sm:block">
	<div class="cursor" bind:this={cursor}></div>
	<div class="cursor-inner" bind:this={cursorInner}></div>
</div>

<style>
	:global(.enable-cursor) {
		cursor: none;
	}
	:global(.enable-cursor *):hover {
		cursor: none;
	}

	.cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		border: 2px solid #fff;
		border-radius: 50%;
		pointer-events: none;
		transition: transform 0.15s ease-out;
		z-index: 1000;
	}

	.cursor-inner {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background-color: #fff;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1000;
	}

	.cursor,
	.cursor-inner {
		mix-blend-mode: difference;
	}
</style>
