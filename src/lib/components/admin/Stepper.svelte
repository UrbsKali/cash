<script>
	import Icon from '../share/Icon.svelte';

	export let steps = [
		{
			done: true,
			icon: 'link'
		},
		{
			done: true,
			icon: 'shipping'
		},
		{
			done: false,
			icon: 'done'
		}
	];
</script>

<ol class="flex justify-center w-full">
	{#each steps as step, i}
		<li
			class="flex items-center {i < steps.length - 1
				? step.done
					? "text-primary-500 w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-primary-400 after:border-4 after:inline-block"
					: " w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-700 after:border-4 after:inline-block"
				: ''}"
		>
			<span
				class="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0
					{step.icon === 'cancel' ? 'bg-red-500' : step.done ? 'bg-primary-500' : 'bg-gray-700'}"
			>
				<Icon name={step.icon} size="6" fill={'gray-100'} />
			</span>
		</li>
	{/each}
	<svg style="display: none;" class="fill-gray-100">
		<rect width="1" height="1" fill="currentColor" />
	</svg>
</ol>
