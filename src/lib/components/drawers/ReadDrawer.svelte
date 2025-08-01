<script>
	// @ts-nocheck

	import { get_current_component } from 'svelte/internal';
	import { hideOnClickOutside } from '$lib/utils';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import Stepper from '../admin/Stepper.svelte';
	import { updateText } from '$lib/utils';

	const current_component = get_current_component();

	export let values = {
		header: { title: 'Pas de détails', sub: '-', stepper: [] },
		body: []
	};
	export let files = [];
	export let actions = [];
	export let fields = [];
	export let id = 'readDrawer';
	export let onSubmit = async () => {};
	export let onClose = (e) => {};

	let isEditing = false;
	function handleSave(e) {
		e.preventDefault();
		onSubmit(e, forms, fields);
		isEditing = false;
	}
	function handleCancel() {
		isEditing = false;
	}

	let current_file = '';
	let current_file_index = 0;
	let scroll_body = null;
	let isMobile = false;
	let files_array = [{ mime: 'application/pdf', url: null }];
	let forms;

	let __onClose = (e) => {
		current_component.$destroy();
		onClose(e);
	};

	function parseValuesToFields() {
		fields.forEach((field) => {
			const fieldKey = field.id || field.name.toLowerCase();
			const bodyItem = values.body.find((item) => {
				const bodyKey = item.id || item.label.toLowerCase();
				return bodyKey === fieldKey;
			});
			if (bodyItem) {
				// Special handling for multiselect fields
				if (field.type === 'multiselect') {
					if (bodyItem.data) field.value = bodyItem.data;
				} else if (field.type === 'select') {
					// set the selected: true value for select fields. data is just value
					field.options.forEach((option) => {
						option.selected = option.value === bodyItem.value;
					});
					field.value = bodyItem.value;
				} else {
					field.value = bodyItem.value;
				}
			}
		});
	}

	onMount(async () => {
		// check if mobile
		if (window.innerWidth < 768) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		if (files && files.length > 0) {
			// get the all signed url from supabase
			const { data: urls } = await supabase.storage.from('proof').createSignedUrls(files, 600);

			for (let i = 0; i < urls.length; i++) {
				if (urls[i].error) {
					console.error(urls[i].error);
					continue;
				}
				// get the blob from the url
				const r = await fetch(urls[i].signedUrl);
				if (!r.ok) {
					console.error('Error fetching blob:', r.statusText);
					continue;
				}
				const b = await r.blob();
				if (!b) {
					console.error('Error getting blob:', r.statusText);
					continue;
				}
				files_array[i] = {
					mime: b.type,
					url: urls[i].signedUrl,
					name: decodeURI(urls[i].signedUrl.split('/')[10].split('?')[0])
				};
				console.log(files_array[i]);
			}
			current_file = files_array[0]?.name;
		}
	});
</script>

<!-- Backdrop -->
<div class="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm" on:click={__onClose}></div>

<!-- Drawer -->
<div
	id={'drawer-' + id}
	tabindex="-1"
	class="fixed top-0 right-0 z-50 flex flex-col h-full transition-transform duration-300 bg-gray-800 shadow-lg w-96"
	style="transform: translateX(0);"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-gray-700">
		<div class="flex flex-col">
			<span class="text-lg font-semibold text-white">{values.header.title}</span>
			{#if values.header.sub}
				<span class="text-sm text-gray-400">{values.header.sub}</span>
			{/if}
		</div>
		<button
			type="button"
			class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
			on:click={__onClose}
		>
			<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			<span class="sr-only">Close drawer</span>
		</button>
	</div>
	{#if values.header.stepper}
		{@const stepper = values.header.stepper}
		<div class="w-full px-4 py-2 m-auto border-b border-gray-700">
			<Stepper steps={stepper} />
		</div>
	{/if}
	<!-- Content -->
	<div class="flex-1 p-4 space-y-4 overflow-y-auto">
		{#if isEditing}
			<form on:submit={handleSave} bind:this={forms}>
				<div class="grid gap-4 mb-4 sm:grid-cols-2">
					{#each fields as field}
						<div class={field.wide ? 'col-span-2' : ''}>
							{#if field.type == 'document' || field.type == 'img'}
								<p class="block mb-2 text-sm font-medium text-white" data-utils={field.data || ''}>
									{field.name}
								</p>
							{:else if field.type !== 'duplicate' && field.type !== 'info'}
								<label
									for={field.id || field.name.toLowerCase()}
									class="block mb-2 text-sm font-medium text-white"
									data-utils={field.data || ''}>{field.name}</label
								>
							{/if}
							{#if field.type === 'select'}
								<select
									id={field.id || field.name.toLowerCase()}
									name={field.id || field.name.toLowerCase()}
									class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									on:change={field.onChange || null}
									readonly={field.readonly || false}
								>
									{#if (field.readonly || false) == false}<option
											selected={!field.autoselect}
											value="NULL">----------</option
										>
									{/if}
									{#each field.options as option}
										<option
											value={option.value}
											data-utils={option.data || ''}
											selected={option.selected}>{option.text}</option
										>
									{/each}
								</select>
							{:else if field.type === 'info'}
								<p
									class="block p-3 mb-2 text-sm text-justify text-gray-200 bg-gray-700 rounded-lg max-w-prose"
								>
									{field.text}
								</p>
							{:else if field.type === 'number'}
								<input
									type="number"
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
									min={field.min || 0}
									max={field.max || 2000}
									step={field.step || 1}
									readonly={field.readonly || false}
								/>
							{:else if field.type === 'textarea'}
								<textarea
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
									readonly={field.readonly || false}
								></textarea>
							{:else if field.type === 'img'}
								<input
									type="file"
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									accept="image/png, image/jpeg"
									class="hidden"
									on:change={field.onChange ||
										((e) => {
											console.log(e.target.files[0]);
											const file = e.target.files[0];
											const reader = new FileReader();
											reader.onload = (e) => (field.value = e.target.result);
											reader.readAsDataURL(file);
										})}
								/>
								<label
									for={field.id || field.name.toLowerCase()}
									class="flex items-center justify-center w-full h-12 border text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
								>
									{#if field.value}
										<img
											id="svelte_breffffffffff"
											src={field.value}
											alt={field.name}
											class="object-contain w-full h-full rounded-lg"
										/>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											class="w-6 h-6 fill-gray-400"
											><path
												d="M12 8.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25V15a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25V9a.75.75 0 0 1 .75-.75Z"
											></path><path
												d="M3 3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Zm2-.5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V7.018a.5.5 0 0 0-.146-.354l-4.018-4.018a.5.5 0 0 0-.354-.146H5Z"
											></path></svg
										>
									{/if}
								</label>
							{:else if field.type === 'document'}
								{#if field.multiple}
									<div
										class="flex items-center flex-col justify-center w-full border text-sm rounded-lg mb-2 p-2.5 bg-gray-700 border-gray-600 text-white"
									>
										{#each field.value as doc, i}
											<div class="flex items-center w-full gap-2 py-1 border-gray-600">
												<svg
													aria-hidden="true"
													height="16"
													viewBox="0 0 16 16"
													version="1.1"
													width="16"
													fill="white"
													data-view-component="true"
													class="octicon octicon-file"
												>
													<path
														d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"
													></path>
												</svg>
												<p>
													{doc.name}
												</p>
												<button
													type="button"
													class="text-gray-400 bg-transparent hover: rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
													on:click={async (e) => {
														field.value = field.value.filter((el) => el.name != doc.name);
														if (field.onRemove) await field.onRemove(e, doc.name);
													}}
												>
													<svg
														aria-hidden="true"
														height="16"
														viewBox="0 0 16 16"
														version="1.1"
														width="16"
														data-view-component="true"
														class="octicon octicon-x"
														fill="white"
													>
														<path
															d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
														></path>
													</svg>
												</button>
											</div>
										{/each}
									</div>
								{/if}
								<input
									type="file"
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									multiple={field.multiple || false}
									accept="image/png, image/jpeg, application/pdf, application/octet-stream"
									class="hidden"
									on:change={field.onChange ||
										((e) => {
											if (field.multiple) {
												const temp_arr = [...e.target.files].map((file) => {
													return { name: file.name, type: file.type };
												});
												for (let i = 0; i < temp_arr.length; i++) {
													if (temp_arr[i].type.split('/')[0] === 'image') {
														const reader = new FileReader();
														reader.onload = (e) => (temp_arr.value = e.target.result);
														reader.readAsDataURL(e.target.files[i]);
													}
												}
												field.value = [...field.value, ...temp_arr];
											} else {
												const file = e.target.files[0];
												field.data = file.type.split('/')[0];
												if (field.data === 'image') {
													const reader = new FileReader();
													reader.onload = (e) => (field.value = e.target.result);
													reader.readAsDataURL(file);
												} else {
													field.value = file;
												}
											}
										})}
								/>
								<label
									for={field.id || field.name.toLowerCase()}
									class="flex items-center justify-center w-full h-12 border text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
								>
									{#if field.value && field.data === 'image' && !field.multiple}
										<img
											id="svelte_breffffffffff"
											src={field.value}
											alt={field.name}
											class="object-contain w-full h-full rounded-lg"
										/>
									{:else if field.value && field.data === 'application' && !field.multiple}
										<p>
											{field.value.name}
										</p>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											class="w-6 h-6 fill-gray-400"
											><path
												d="M12 8.25a.75.75 0 0 1 .75.75v2.25H15a.75.75 0 0 1 0 1.5h-2.25V15a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25V9a.75.75 0 0 1 .75-.75Z"
											></path><path
												d="M3 3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Zm2-.5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V7.018a.5.5 0 0 0-.146-.354l-4.018-4.018a.5.5 0 0 0-.354-.146H5Z"
											></path></svg
										>
									{/if}
								</label>
							{:else if field.type === 'duplicate'}
								<!--Duplicate is a + btn to replicate the last collumn -->
								<button
									type="button"
									class="flex items-center justify-center w-full h-8 border text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									on:click={() => {
										const clean_filter = fields.filter((el) => el.type != 'duplicate');
										let lasts = []; // get the last full row, 1 if wide, 2 if not
										for (let i = clean_filter.length - 1; i >= 0; i--) {
											if (lasts.length == 2) break;
											if (clean_filter[i].wide) {
												lasts.push({ ...clean_filter[i] });
												break;
											} else {
												lasts.push({ ...clean_filter[i] });
											}
										}

										// drop the values of lasts to avoid duplicate
										lasts = lasts.map((el) => {
											el.value = '';
											el.data = '';
											// add number at the end of the id
											const num = parseInt(el.id.match(/\d+/g));
											if (num) {
												el.id = el.id.replace(/\d+/g, num + 1);
											} else {
												el.id = el.id + '_1';
											}
											return el;
										});

										fields = [
											...clean_filter,
											...lasts.reverse(),
											{ type: 'duplicate', wide: true }
										];
									}}
									>+
								</button>
							{:else if field.type === 'autocomplete'}
								<div
									class="relative w-full flex flex-row items-center justify-center border text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
								>
									{#if field.image}
										<img
											src={field.image}
											alt={field.name}
											class="w-6 h-6 mr-1 -ml-1 rounded-full"
										/>
									{/if}
									<input
										type="text"
										id={field.id || field.name.toLowerCase()}
										class=" bordertext-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
										placeholder={field.placeholder || field.name.toLowerCase()}
										required={field.required}
										value={field.value || ''}
										readonly={field.readonly || false}
										name={field.id || field.name.toLowerCase()}
										on:input={async (e) => {
											field.completion = await field.onChange(e);
										}}
									/>
								</div>
								{#if field.completion?.length > 0}
									<div
										class="absolute z-10 block w-full p-2 pl-4 mt-1 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
									>
										{#each field.completion as c}
											<button
												class=" w-full rounded-lg
												flex items-center border-b border-gray-700 {c.image ? 'p-1' : ''} cursor-pointer"
												on:click={async (e) => {
													field.value = c.text;
													field.data = c.value;
													field.completion = [];
													// add image to field if exists
													if (c.image) {
														field.image = c.image;
													}
													// call onSelect function if exists
													if (field.onSelect && field.onSelect.constructor.name == 'AsyncFunction')
														await field.onSelect(c.value);
													if (field.onSelect && field.onSelect.constructor.name == 'Function')
														field.onSelect(c.value);
												}}
											>
												{#if c.image}
													<img src={c.image} alt={c.text} class="w-6 h-6 mr-1 -ml-1 rounded-full" />
												{/if}
												<p>
													{c.text}
												</p>
												<br />
											</button>
										{/each}
									</div>
								{/if}
							{:else if field.type === 'multiselect'}
								<!-- Selected items display -->
								{#if field.value && field.value.length > 0}
									<div class="flex flex-wrap gap-2 mb-2">
										{#each field.value as item}
											<div
												class="flex items-center px-2 py-1 text-sm text-white bg-blue-600 rounded-md"
											>
												{#if item.image}
													<img src={item.image} alt={item.text} class="w-4 h-4 mr-1 rounded-full" />
												{/if}
												<span>{item.text}</span>
												<button
													type="button"
													class="ml-2 text-white hover:text-gray-300"
													on:click={async () => {
														field.value = field.value.filter((v) => v.value !== item.value);
														field.data = field.value.map((v) => v.value);
														if (field.onRemove) {
															if (field.onRemove.constructor.name == 'AsyncFunction')
																await field.onRemove(item.value);
															else field.onRemove(item.value);
														}
													}}
												>
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
														<path
															fill-rule="evenodd"
															d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
															clip-rule="evenodd"
														></path>
													</svg>
												</button>
											</div>
										{/each}
									</div>
								{/if}
								<!-- Search input -->
								<div class="relative w-full">
									<input
										type="text"
										id={field.id || field.name.toLowerCase()}
										class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
										placeholder={field.placeholder || field.name.toLowerCase()}
										value={field.searchTerm || ''}
										readonly={field.readonly || false}
										name={field.id || field.name.toLowerCase()}
										on:input={async (e) => {
											field.searchTerm = e.target.value;
											if (field.searchTerm.length > 0) {
												field.completion = await field.onChange(e);
											} else {
												field.completion = [];
											}
										}}
									/>
									{#if field.completion?.length > 0}
										<div
											class="absolute z-10 block w-full p-2 mt-1 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
										>
											{#each field.completion as c}
												{@const isSelected = field.value?.some((v) => v.value === c.value)}
												{#if !isSelected}
													<button
														type="button"
														class="w-full rounded-lg flex items-center border-b border-gray-700 {c.image
															? 'p-1'
															: ''} cursor-pointer hover:bg-gray-600"
														on:click={async (e) => {
															// Initialize field.value as array if not exists
															if (!field.value) field.value = [];

															// Add selected item to value array
															field.value = [
																...field.value,
																{ text: c.text, value: c.value, image: c.image }
															];
															field.data = field.value.map((v) => v.value);

															// Clear search and completion
															field.searchTerm = '';
															field.completion = [];

															// Clear the input
															e.target.closest('.relative').querySelector('input').value = '';

															// call onSelect function if exists
															if (
																field.onSelect &&
																field.onSelect.constructor.name == 'AsyncFunction'
															)
																await field.onSelect(c.value);
															if (field.onSelect && field.onSelect.constructor.name == 'Function')
																field.onSelect(c.value);
														}}
													>
														{#if c.image}
															<img
																src={c.image}
																alt={c.text}
																class="w-6 h-6 mr-1 -ml-1 rounded-full"
															/>
														{/if}
														<p>{c.text}</p>
													</button>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							{:else if field.type === 'checkbox'}
								<input
									type="checkbox"
									id={field.id || field.name.toLowerCase()}
									name={field.id || field.name.toLowerCase()}
									class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									checked={field.checked || false}
									value={field.value || ''}
									readonly={field.readonly || false}
								/>
							{:else}
								<input
									type={field.type}
									name={field.id || field.name.toLowerCase()}
									id={field.id || field.name.toLowerCase()}
									class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
									placeholder={field.placeholder || field.name.toLowerCase()}
									required={field.required}
									value={field.value || ''}
									readonly={field.readonly || false}
								/>
							{/if}
						</div>
					{/each}
				</div>
				<div class="flex space-x-2">
					<button
						type="submit"
						class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">Save</button
					>
					<button
						type="button"
						class="px-4 py-2 text-gray-400 bg-gray-700 rounded-lg hover:bg-gray-600"
						on:click={handleCancel}>Cancel</button
					>
				</div>
			</form>
		{:else}
			{#if files.length > 0}
				<div>
					<h3 class="mb-2 text-lg font-semibold text-white">Pièces jointes</h3>
					<div class="flex items-center mb-2">
						<button
							class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
							on:click={() => {
								if (current_file_index > 0) {
									current_file_index--;
									current_file = files_array[current_file_index].name;
									scroll_body &&
										(scroll_body.style.transform = `translateX(${(scroll_body.scrollWidth / files.length) * current_file_index}px)`);
								}
							}}
						>
							<svg class="w-5 h-5" fill="white" viewBox="0 0 20 20"
								><path
									fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd"
								></path></svg
							>
						</button>
						<p class="flex-1 text-sm text-center text-gray-400">
							{current_file || 'Chargement'} - {current_file_index + 1}/{files.length}
						</p>
						<button
							class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
							on:click={() => {
								if (current_file_index < files.length - 1) {
									current_file_index++;
									current_file = files_array[current_file_index].name;
									scroll_body &&
										(scroll_body.style.transform = `translateX(-${(scroll_body.scrollWidth / files.length) * current_file_index}px)`);
								}
							}}
						>
							<svg class="w-5 h-5 rotate-180" fill="white" viewBox="0 0 20 20"
								><path
									fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd"
								></path></svg
							>
						</button>
					</div>
					<div class="flex h-auto overflow-x-hidden w-full aspect-[1/1.414] gap-2">
						<div class="flex rounded-lg" bind:this={scroll_body}>
							{#each files_array as { mime, url }, i}
								{@const name = decodeURI(url?.split('/')[10].split('?')[0])}
								<div class="flex flex-col w-full">
									{#if mime == 'application/pdf' && !isMobile}
										<iframe src={url} frameborder="0" class="w-full h-full" title={name}></iframe>
									{:else if mime == 'application/pdf' && isMobile}
										<iframe
											src="https://docs.google.com/viewer?url={url}&embedded=true"
											frameborder="0"
											class="w-full h-full"
											title={name}
										></iframe>
									{:else if mime && mime.startsWith('image/')}
										<img src={url} alt={name} class="w-full max-w-full" />
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<dl>
				{#each values.body as item, i}
					<dt class="mb-2 font-semibold leading-none text-white">{item.label}</dt>
					{#if typeof item.value === 'object'}
						{#if item.value.type == 'updates'}
							<dd class="mb-4 font-light text-gray-400">
								{#each item.value.list as value}
									<span
										class="inline-block px-2 py-1 mb-2 mr-2 text-sm rounded-lg
											{value.type === 'comment'
											? 'bg-white border border-gray-300 text-gray-900'
											: [
														'review-treso-approved',
														'order-processed',
														'order-received',
														'order-completed'
												  ].includes(value.type)
												? 'bg-blue-700 text-white'
												: ['order-canceled', 'review-cdp-refused', 'review-treso-refused'].includes(
															value.type
													  )
													? 'bg-red-800 text-white'
													: 'bg-gray-800 text-white'}"
									>
										{#if value.message}
											<span>{value.message}</span>
										{:else}
											<span class="text-gray-200">{updateText[value.type] || value.type}</span>
										{/if}
										{#if value.user}
											<span class="italic"> - Par {value.user}</span>
										{/if}
										{#if value.date}
											<span class="ml-2 text-xs text-gray-400">({value.date})</span>
										{/if}
									</span>
								{/each}
							</dd>
						{:else if item.value.type == 'items'}
							<dd class="mb-4 ml-2 font-light text-gray-400">
								<table class="w-full border-separate">
									<thead class="font-bold">
										<td>Nom</td>
										<td>Quantité</td>
										<td>Prix</td>
										{#if values.body.find((el) => el.label == 'Status')?.type == 'pendingCDP'}
											<td class="w-2.5"></td>
										{/if}
									</thead>
									<tbody>
										{#each item.value.list as item}
											<tr data-utils={item.id}>
												<td class="p-2"><a href={item.link} target="_blank">{item.name}</a></td>
												<td>{item.quantity}</td>
												<td>{item.price}</td>
												{#if values.body.find((el) => el.label == 'Status')?.type == 'pendingCDP'}
													<td>
														<button
															type="button"
															class="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
															on:click={async () => {
																const { data, error } = await supabase
																	.from('items')
																	.delete()
																	.match({ id: item.id })
																	.select()
																	.single();
																if (error || !data) return;
																const tr = document.querySelector(`tr[data-utils="${item.id}"]`);
																tr && tr.remove();
															}}
														>
															<svg
																aria-hidden="true"
																class="w-5 h-5 -mx-2.5"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fill-rule="evenodd"
																	d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
																	clip-rule="evenodd"
																></path>
															</svg>
														</button>
													</td>
												{/if}
											</tr>
										{/each}
									</tbody>
								</table>
							</dd>
						{/if}
					{:else}
						<dd class="mb-4 font-light text-gray-400 transition-colors hover:text-gray-300">
							{item.value}
						</dd>
					{/if}
				{/each}
			</dl>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-between p-4 space-x-2 border-t border-gray-700">
		<!-- toggle edit mode if fields provided -->
		{#if !isEditing && fields.length > 0}
			<button
				type="button"
				class="text-white inline-flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
				on:click={() => {
					isEditing = true;
					parseValuesToFields();
				}}
			>
				<svg
					aria-hidden="true"
					class="w-5 h-5 mr-1 -ml-1"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
					></path><path
						fill-rule="evenodd"
						d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
						clip-rule="evenodd"
					></path></svg
				>
				Modifier
			</button>
		{/if}
		{#each actions as { title, type, handler }}
			{#if type == 'selector'}
				<select
					class=" border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
					on:change={handler}
				>
					<option value="" disabled selected>Choisir une option</option>
					{#each title as { name, value }}
						<option {value}>{name}</option>
					{/each}
				</select>
			{/if}
			{#if type == 'validate'}
				<button
					type="button"
					class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					on:click={handler}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-1.5 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path>
					</svg>
					{title}
				</button>
			{/if}
			{#if type == 'delete'}
				<button
					type="button"
					class="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					on:click={handler}
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-1.5 -ml-1"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					{title}
				</button>
			{/if}
		{/each}
	</div>
</div>
