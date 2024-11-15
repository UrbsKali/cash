<script>
	import '../app.css';
</script>

<svelte:head>
	<title>DaVinciBot</title>
	<meta name="description" content="DaVinciBot. L'association de robotique étudiante." />
	<meta name="keywords" content="DaVinciBot, association, robot, robotique, étudiant, esilv" />
	<meta name="author" content="DaVinciBot" />
	<meta name="robots" content="index, follow" />

	<!-- meta og -->
	<meta property="og:title" content="DaVinciBot" />
	<meta property="og:description" content="DaVinciBot. L'association de robotique étudiante." />
	<meta property="og:image" content="/dvb_og_img.png" />
	<meta property="og:url" content="https://davincibot.fr" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DaVinciBot" />
	<meta property="og:locale" content="fr_FR" />

	<!-- meta twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@DaVinciBot" />
	<meta name="twitter:creator" content="@DaVinciBot" />
	<meta name="twitter:title" content="DaVinciBot" />
	<meta name="twitter:description" content="DaVinciBot. L'association de robotique étudiante." />
	<meta name="twitter:image" content="/dvb_og_img.png" />
	<meta name="twitter:image:alt" content="DaVinciBot" />
	<meta name="twitter:url" content="https://davincibot.fr" />
	<meta name="twitter:domain" content="davincibot.fr" />
	<meta name="twitter:card" content="summary_large_image" />

	<!-- meta favicon -->
	<link rel="icon" type="image/png" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/favicon.png" />
	<link rel="mask-icon" href="/favicon.png" color="#000000" />
	<link rel="shortcut icon" href="/favicon.png" />

	<!-- font -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen antialiased text-black bg-white dark:bg-dark-blue dark:text-white min-w-screen font-['Almarai']"
>
	<slot />
</div>
