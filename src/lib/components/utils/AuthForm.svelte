<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	import SucessModal from '../modals/InfoModal.svelte';

	const AuthType = {
		login: 'Login',
		register: 'Inscription',
		reset: 'Changement du mot de passe'
	};

	export let redirect_uri = '/';
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
	let password_confirm = '';

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
			window.location.href = '/login';
		}

		if (error && auth_type == AuthType.register) {
			console.error(error);
			alert(
				"Votre lien d'invitation a expiré, veuillez contacter Urbain Lantrès pour avoir un autre lien"
			);
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
				goto(redirect_uri);
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
			if (password !== password_confirm) {
				alert('Les mots de passe ne correspondent pas.');
				return;
			}
			const { data, error } = await supabase.auth.updateUser({
				password: password
			});
			if (error) throw error;
			if (data) {
				goto(redirect_uri);
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
						message:
							'Vous avez bien été inscrit. Vous allez être redirigé vers la page de connexion.',
						onClose: () => {
							goto(`https://davincibot.fr/login`);
						}
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
			return window.location.origin;
		} else {
			return redirect_uri;
		}
	}
</script>

<section class="">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<!-- svelte-ignore a11y-missing-attribute -->
		<a class="flex items-center mb-6 text-2xl font-semibold text-white">
			<img class="h-20 mr-2" src="/white_logo.webp" alt="logo" />
		</a>
		<div
			class="w-full bg-gray-800 border border-gray-700 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
		>
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
					DaVinciBot - {auth_type}
				</h1>
				<form class="space-y-4 md:space-y-6" on:submit|preventDefault={handleAuth}>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-white">Votre email</label>
						<input
							type="email"
							name="email"
							id="email"
							class=" border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
							placeholder="davincibot@devinci.fr"
							disabled={auth_type === AuthType.reset || auth_type === AuthType.register}
							bind:value={email}
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-white"
							>Votre mot de passe</label
						>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							class=" border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							bind:value={password}
						/>
					</div>
					{#if auth_type === AuthType.reset || auth_type === AuthType.register}
						<div>
							<label for="password-confirm" class="block mb-2 text-sm font-medium text-white"
								>Confirmer votre mot de passe</label
							>
							<input
								type="password"
								name="password-confirm"
								id="password-confirm"
								placeholder="••••••••"
								class=" border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
								bind:value={password_confirm}
							/>
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="w-full focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
						>{loading ? 'Chargement ...' : auth_type}</button
					>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
</style>
