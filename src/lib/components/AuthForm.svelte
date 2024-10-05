<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { config } from '$lib/config';
	import SucessModal from './SucessModal.svelte';

	const AuthType = {
		login: 'Login',
		register: 'Inscription',
		reset: 'Changement du mot de passe'
	};

	export let redirect_uri = config.basePath + '/';
	/**
	 * {'login' | 'register' | 'reset'}
	 */
	export let auth_type = AuthType.login;

	if (
		auth_type !== AuthType.login &&
		auth_type !== AuthType.register &&
		auth_type !== AuthType.reset
	) {
		// try to parse it
		auth_type = AuthType[auth_type.toLowerCase()] || AuthType.login;
	}

	let loading = false;
	let email = '';
	let password = '';

	onMount(async () => {
		redirect_uri = parseRedirectURI(redirect_uri);
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();
		if (user && auth_type === AuthType.login) {
			window.location.href = redirect_uri;
		}
		if (error && auth_type === AuthType.reset) {
			console.error(error);
			window.location.href = config.basePath + '/login';
		}

		if (error && auth_type == AuthType.register){
			console.error(error)
			alert("Votre lien d'invitation a expiré, veuillez contacter Urbain Lantrès pour avoir un autre lien");
		}

		email = user?.email || '';
	});

	const handleLogin = async () => {
		try {
			loading = true;
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			});
			if (error) throw error;
			if (data) {
				window.location.href = redirect_uri;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleReset = async () => {
		try {
			loading = true;
			const { data, error } = await supabase.auth.updateUser({
				password: password
			});
			if (error) throw error;
			if (data) {
				window.location.href = redirect_uri;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleRegister = async () => {
		try {
			loading = true;

			const { data, error } = await supabase.auth.updateUser({
				password: password
			});
			if (error) throw error;
			if (data) {
				// show success message
				new SucessModal({
					target: document.body,
					props: {
						title: 'Inscription réussie',
						message:
							'Vous avez bien été inscrit. Vous allez être redirigé vers la page de connexion.',
						open: true,
						onclose: () => {
							open = false;
							current_component.$destroy();
							window.location.href = `${currentOrigin()}/login`;
						},
						id: 'successModal'
					}
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleAuth = async () => {
		if (auth_type === AuthType.login) {
			await handleLogin();
		} else if (auth_type === AuthType.reset) {
			await handleReset();
		} else if (auth_type === AuthType.register) {
			await handleRegister();
		}
	};

	function parseRedirectURI(redirect_uri) {
		const urlParams = new URLSearchParams(window.location.search);
		const redirect = urlParams.get('redirect');
		if (redirect) {
			return redirect;
		} else if (redirect_uri == '/') {
			return window.location.origin + config.basePath;
		} else {
			return config.basePath + redirect_uri;
		}
	}
</script>

<section class="">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<!-- svelte-ignore a11y-missing-attribute -->
		<a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
			<img class="h-20 mr-2" src="/white_logo.webp" alt="logo" />
		</a>
		<div
			class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1
					class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
				>
					DaVinciBot - {auth_type}
				</h1>
				<form class="space-y-4 md:space-y-6" on:submit|preventDefault={handleAuth}>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>Votre email</label
						>
						<input
							type="email"
							name="email"
							id="email"
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
							placeholder="davincibot@devinci.fr"
							disabled={auth_type === AuthType.reset || auth_type === AuthType.register}
							bind:value={email}
						/>
					</div>
					<div>
						<label
							for="password"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>Votre mot de passe</label
						>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							bind:value={password}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full text-white bg-primary-300 hover:bg-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
						>{loading ? 'Chargement ...' : auth_type}</button
					>
				</form>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
</style>
