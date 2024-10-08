<script>
	// @ts-nocheck

	export let type = 'Utilisateur';
	export let type_accord = 'un';
	export let action = 'Ajouter';
	export let fields = [];
	export let id = 'CrudModal';
	export let open = false;

	export let onSubmit = async () => {
		console.log('Submit');
	};

	$: for (let field of fields) {
		if (field.type === 'select' && field.value) {
			field.options = field.options.map((option) => {
				if (option.value === field.value) field.autoselect = true;
				return {
					...option,
					selected: option.value === field.value
				};
			});
		}
	}
</script>

<div
	{id}
	tabindex="-1"
	aria-hidden="true"
	class="{open
		? ''
		: 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full backdrop-blur-sm"
>
	<div class="relative flex w-full h-full p-4 m-auto">
		<!-- Modal content -->
		<div class="relative p-4 m-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 min-w-96" id="CrudPopup">
			<!-- Modal header -->
			<div class="flex justify-between mb-4 rounded-t sm:mb-5">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					{action}
					{type_accord}
					{type}
				</h3>
				<button
					type="button"
					class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
					on:click={() => (open = false)}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path></svg
					>
					<span class="sr-only">Close modal</span>
				</button>
			</div>
			<!-- Modal body -->
			<form action="#">
				<div class="grid gap-4 mb-4 sm:grid-cols-2">
					{#each fields as field}
						<div class={field.wide ? 'col-span-2' : ''}>
							<label
								for="brand"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								data-utils={field.data || ''}>{field.name}</label
							>
							{#if field.type === 'select'}
								<select
									id={field.id || field.name.toLowerCase()}
									name={field.id || field.name.toLowerCase()}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									on:change={field.onChange || null}
								>
									<option selected={!field.autoselect} value="NULL">----------</option>
									{#each field.options as option}
										<option
											value={option.value}
											data-utils={option.data || ''}
											selected={option.selected}>{option.text}</option
										>
									{/each}
								</select>
							{:else if field.type === 'number'}
								<input
									type="number"
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
									min={field.min || 0}
									max={field.max || 2000}
									step={field.step || 1}
								/>
							{:else if field.type === 'textarea'}
								<textarea
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
								></textarea>
							{:else}
								<input
									type={field.type}
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
								/>
							{/if}
						</div>
					{/each}
				</div>
				<button
					type="submit"
					class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					on:click={onSubmit}
				>
					<svg
						class="w-6 h-6 mr-1 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clip-rule="evenodd"
						></path></svg
					>
					{action}
					{type_accord}
					{type}
				</button>
			</form>
		</div>
	</div>
</div>
