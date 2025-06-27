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
			data: { session },
			error
		} = await supabase.auth.getSession();
		if (session && auth_type === AuthType.login) {
			if (isOpenID()) {
				const redirectUrl = buildRedirectUrlWithParams(
					'https://lxilsopqfrtwsitzalkm.supabase.co/functions/v1/auth/authorize'
				);
				window.location.href = redirectUrl;
			} else {
				// If the user is already logged in, redirect to the specified redirect_uri
				goto(redirect_uri);
			}
		}
		if (error && auth_type === AuthType.reset) {
			console.log(session);
		}
		if (error && auth_type == AuthType.register) {
			console.error(error);
			alert(
				"Votre lien d'invitation a expiré, veuillez contacter Urbain Lantrès pour avoir un autre lien"
			);
		}

		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'PASSWORD_RECOVERY' && session) {
				email = session?.user?.email || '';
			} else if (event === 'SIGNED_OUT') {
				// Handle sign out if needed
			}
		});

		email = session?.user?.email || '';
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
				// If OpenID SSO parameters are present, redirect to the original redirect_uri with auth code
				if (isOpenID()) {
					const redirectUrl = buildRedirectUrlWithParams(
						'https://lxilsopqfrtwsitzalkm.supabase.co/functions/v1/auth/authorize'
					);
					window.location.href = redirectUrl;
				} else {
					// Otherwise, just redirect to the specified redirect_uri
					goto(redirect_uri);
				}
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
							goto(`https://davincibot.fr/auth/login`);
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

	function isOpenID() {
		const urlParams = new URLSearchParams(window.location.search);
		return (
			urlParams.has('client_id') &&
			urlParams.has('redirect_uri') &&
			urlParams.has('response_type') &&
			urlParams.has('state') &&
			urlParams.has('scope') &&
			urlParams.has('code_challenge') &&
			urlParams.has('code_challenge_method')
		);
	}

	function getOpenIDParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const openIdParams = {};

		// Extract OpenID SSO parameters
		const ssoParams = [
			'client_id',
			'redirect_uri',
			'response_type',
			'state',
			'scope',
			'code_challenge',
			'code_challenge_method'
		];

		ssoParams.forEach((param) => {
			const value = urlParams.get(param);
			if (value) {
				openIdParams[param] = value;
			}
		});

		return openIdParams;
	}

	function buildRedirectUrlWithParams(baseUrl) {
		const openIdParams = getOpenIDParams();

		// If we have OpenID parameters, we need to redirect to the original redirect_uri with auth code
		const redirectParams = new URLSearchParams();

		// Add the authorization code (this would typically come from your auth flow)
		// For now, we'll use a placeholder - you'll need to get the actual code from Supabase

		for (const [key, value] of Object.entries(openIdParams)) {
			redirectParams.append(key, value);
		}
		const url = `${baseUrl}?${redirectParams.toString()}`;
		return url;
	}
</script>

<section class="">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a class="flex items-center mb-6 text-2xl font-semibold text-white" href="/">
			<img class="h-20 mr-2" src="/white_logo.webp" alt="logo" />
		</a>
		<div
			class="w-full rounded-xl border-[3.5px] shadow border-dark-blue-gray md:mt-0 sm:max-w-md xl:p-0"
		>
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
					{auth_type}
				</h1>
				<form class="space-y-4 md:space-y-6" on:submit|preventDefault={handleAuth}>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-white">Votre email</label>
						<input
							type="email"
							name="email"
							id="email"
							class="border-2 rounded-lg block w-full p-2.5 bg-transparent border-dark-blue-gray placeholder-dark-light-blue-faded text-dark-light-blue focus:ring-blue-500 focus:border-blue-500"
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
							class="border-2 rounded-lg block w-full p-2.5 bg-transparent border-dark-blue-gray placeholder-dark-light-blue-faded text-dark-light-blue focus:ring-blue-500 focus:border-blue-500"
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
								class="border-2 rounded-lg block w-full p-2.5 bg-transparent border-dark-blue-gray placeholder-dark-light-blue-faded text-dark-light-blue focus:ring-blue-500 focus:border-blue-500"
								bind:value={password_confirm}
							/>
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="px-4 py-2 font-bold rounded-xl hover:bg-dark-light-blue hover:text-dark-blue text-dark-light-blue border-[3.25px] transition-all border-dark-light-blue w-full focus:outline-none text-center bg-transparent focus:ring-dark-blue-gray focus:ring-4 disabled:opacity-50"
						>{loading ? 'Chargement ...' : auth_type}</button
					>
				</form>
			</div>
			{#if auth_type === AuthType.login}
				<div
					class="flex items-center justify-center px-4 py-2 text-sm text-gray-400 border-t rounded-b-lg border-dark-blue-gray"
				>
					<a href="/auth/reset" class="hover:underline">Mot de passe oublié ?</a>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
</style>
