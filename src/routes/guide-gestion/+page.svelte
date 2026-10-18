<script lang="ts">
	// Guide d'utilisation de l'admin destiné aux gestionnaires du site.
	// Page interne, en français uniquement, hors des groupes (public) et (admin) :
	// pas d'en-tête ni de pied de page du site, non référencée (noindex, absente des menus).
	// Accès protégé par un mot de passe simple (GUIDE_PASSWORD), voir +page.server.ts.
	let { data, form } = $props();

	let activeSection = $state('demarrer');
	let showBackToTop = $state(false);

	const lastUpdated = '18 octobre 2026';

	const sections = [
		{ id: 'demarrer', title: 'Avant de commencer' },
		{ id: 'connexion', title: 'Se connecter' },
		{ id: 'produits', title: 'Produits' },
		{ id: 'categories', title: 'Catégories' },
		{ id: 'formations', title: 'Formations' },
		{ id: 'points-de-vente', title: 'Points de vente' },
		{ id: 'contenu', title: 'Textes & images des pages' },
		{ id: 'anglais', title: 'Version anglaise' },
		{ id: 'medias', title: 'Médias et photos' },
		{ id: 'faq', title: 'Questions fréquentes' }
	];

	// Les sections et champs de « Contenu » portent des noms techniques en anglais.
	const lexique = [
		['Hero', 'Bandeau du haut de la page'],
		['Overline / Kicker', 'Petit sur-titre au-dessus du titre'],
		['Title', 'Titre'],
		['Subtitle', 'Sous-titre'],
		['Description / Desc', 'Texte de présentation'],
		['Stats', 'Chiffres clés (Number = chiffre, Label = libellé)'],
		['Testimonials', 'Témoignages (Quote = citation, Name = nom, Location = ville)'],
		['Wholesale', 'Bloc « Grossistes »'],
		['Cta', "Bloc d'appel à l'action en bas de page"],
		['Slider', "Diaporama de photos de l'accueil"],
		['Body', 'Texte principal (CGV, mentions légales)']
	];

	$effect(() => {
		if (!data.hasAccess) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) activeSection = entry.target.id;
				});
			},
			{ rootMargin: '-30% 0px -60% 0px' }
		);

		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		const onScroll = () => {
			showBackToTop = window.scrollY > 600;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

{#snippet astuce(texte: string)}
	<div class="rounded-2xl bg-primary-green/5 border border-primary-green/15 p-4 text-sm text-neutral-charcoal flex gap-3">
		<span class="font-semibold text-primary-green shrink-0">Astuce</span>
		<span>{@html texte}</span>
	</div>
{/snippet}

{#snippet attention(texte: string)}
	<div class="rounded-2xl bg-accent-gold/10 border border-accent-gold/40 p-4 text-sm text-neutral-charcoal flex gap-3">
		<span class="font-semibold text-neutral-obsidian shrink-0">Attention</span>
		<span>{@html texte}</span>
	</div>
{/snippet}

{#snippet etapes(liste: string[])}
	<ol class="space-y-3">
		{#each liste as etape, i}
			<li class="flex gap-3">
				<span class="flex-shrink-0 w-7 h-7 rounded-full bg-primary-green text-white text-sm font-semibold flex items-center justify-center">{i + 1}</span>
				<span class="pt-0.5">{@html etape}</span>
			</li>
		{/each}
	</ol>
{/snippet}

<svelte:head>
	<title>Guide de gestion du site — Angel's Floor</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !data.hasAccess}
	<!-- Écran de connexion -->
	<main class="bg-neutral-sand min-h-screen font-sans flex items-center justify-center p-4">
		<div class="w-full max-w-md">
			<div class="text-center mb-8">
				<a href="/" class="inline-block mb-6">
					<img src="/angelsfloor-logo.svg" alt="Angel's Floor" class="h-14 w-auto mx-auto" />
				</a>
				<h1 class="text-3xl font-bold text-neutral-obsidian leading-tight">Guide de gestion du site</h1>
				<p class="text-neutral-charcoal mt-2">Accès réservé : saisissez le mot de passe</p>
			</div>

			<div class="bg-white rounded-2xl shadow-lg p-8">
				{#if !data.configured || form?.error}
					<div role="alert" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{data.configured ? form?.error : 'Guide désactivé : mot de passe non configuré.'}
					</div>
				{/if}

				{#if data.configured}
					<form method="POST" action="?/login" class="space-y-4">
						<div>
							<label for="password" class="block text-sm font-semibold text-neutral-obsidian mb-2">Mot de passe</label>
							<!-- svelte-ignore a11y_autofocus -->
							<input
								id="password"
								name="password"
								type="password"
								required
								autofocus
								autocapitalize="none"
								autocomplete="current-password"
								aria-invalid={form?.error ? 'true' : undefined}
								class="w-full rounded-xl border border-neutral-slate-light/40 bg-white px-4 py-3 text-neutral-obsidian focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 focus:outline-none transition-all duration-300"
							/>
						</div>
						<button
							type="submit"
							class="w-full bg-primary-green text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
						>
							Accéder au guide
						</button>
					</form>
				{/if}
			</div>
		</div>
	</main>
{:else}
<div class="bg-neutral-sand min-h-screen font-sans">
	<!-- En-tête -->
	<header class="relative overflow-hidden bg-primary-green text-white">
		<div class="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
		<div class="absolute -bottom-24 left-1/3 w-72 h-72 bg-accent-gold/10 rounded-full blur-3xl"></div>
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
			<a href="/" class="inline-block mb-8">
				<img src="/angelsfloor-logo.svg" alt="Angel's Floor" class="h-12 w-auto brightness-0 invert" />
			</a>
			<div class="flex flex-wrap items-center gap-3 mb-4">
				<span class="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
					Guide des gestionnaires
				</span>
				<span class="text-white/60 text-xs">Mis à jour le {lastUpdated}</span>
			</div>
			<h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">
				Gérer le site <span class="text-accent-gold">Angel's Floor</span>
			</h1>
			<p class="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
				Produits, formations, points de vente, textes et photos des pages, en français et en anglais : tout se gère depuis l'espace d'administration, sans connaissance technique.
			</p>
		</div>
	</header>

	<!-- Corps -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
		<div class="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
			<!-- Sommaire -->
			<aside class="lg:sticky lg:top-8 lg:self-start">
				<div class="bg-white rounded-2xl p-6 shadow-lg">
					<p id="sommaire-label" class="text-xs font-semibold uppercase tracking-wider text-neutral-slate-light mb-4">Sommaire</p>
					<nav aria-labelledby="sommaire-label" class="space-y-1">
						{#each sections as section, i}
							<a
								href="#{section.id}"
								aria-current={activeSection === section.id ? 'location' : undefined}
								class="block rounded-xl px-3 py-2 text-sm transition-all duration-300 {activeSection === section.id ? 'bg-primary-green/10 text-primary-green font-semibold' : 'text-neutral-slate hover:bg-neutral-sand'}"
							>
								<span class="text-neutral-slate-light mr-2">{String(i + 1).padStart(2, '0')}</span>
								{section.title}
							</a>
						{/each}
					</nav>
				</div>
			</aside>

			<!-- Contenu -->
			<article class="space-y-12 max-w-3xl">
				<section id="demarrer" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">1. Avant de commencer</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>
							L'espace d'administration permet de gérer le catalogue (produits, catégories), les formations, les points de vente ainsi que les textes et photos de chaque page du site.
						</p>
						<p>Trois règles à retenir :</p>
						<ul class="space-y-2 list-disc pl-5">
							<li><strong>Les modifications sont en ligne dès l'enregistrement.</strong> Seuls les produits et les formations ont en plus un statut : ils n'apparaissent sur le site qu'une fois <strong>publiés</strong>.</li>
							<li><strong>Le site existe en deux langues.</strong> Chaque texte se saisit en français, puis en anglais. Sans traduction, le site anglais affiche le texte français.</li>
							<li><strong>Vérifiez sur le site.</strong> Après une modification, ouvrez la page concernée (bouton « Voir la page » ou « Aperçu ») pour contrôler le résultat.</li>
						</ul>
					</div>
				</section>

				<section id="connexion" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">2. Se connecter</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						{@render etapes([
							'Ouvrez <a href="/admin/login" class="text-primary-green font-semibold underline">angelsfloor.bj/admin/login</a>.',
							'Saisissez votre <strong>Email</strong> et votre <strong>Mot de passe</strong>, puis cliquez sur « Se connecter ».'
						])}
						<p>
							Le menu de gauche donne accès aux rubriques : <strong>Dashboard</strong>, <strong>Produits</strong>, <strong>Catégories</strong>, <strong>Formations</strong>, <strong>Contenu</strong>, <strong>Médias</strong>, <strong>Points de vente</strong> et <strong>Paramètres</strong>. Le bouton « Déconnexion » se trouve en bas du menu.
						</p>
						{@render astuce('Pour changer votre mot de passe : <strong>Paramètres</strong> › « Changer le mot de passe » (8 caractères minimum). Vous serez ensuite invité à vous reconnecter. Pour créer un accès à une nouvelle personne, contactez le support technique.')}
					</div>
				</section>

				<section id="produits" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">3. Produits</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>La rubrique <strong>Produits</strong> liste tout le catalogue, avec une recherche et un filtre par catégorie.</p>
						{@render etapes([
							'Cliquez sur <strong>« Nouveau produit »</strong>, ou sur l\'icône « Modifier » d\'un produit existant.',
							'Dans « Informations générales », renseignez le <strong>Nom</strong> (le <strong>Slug</strong>, c\'est-à-dire l\'adresse de la page, se remplit tout seul), la <strong>Catégorie</strong>, le <strong>Prix (FCFA)</strong> et les descriptions.',
							'Complétez les blocs utiles : Identité commerciale, Bénéfices, Variantes, Préparation, Composition nutritionnelle, Conservation, Détails.',
							'Ajoutez les photos dans le panneau <strong>Images</strong> (voir ci-dessous).',
							'Cliquez sur <strong>« Sauvegarder »</strong> pour garder un brouillon, ou sur <strong>« Publier »</strong> pour enregistrer et mettre le produit en ligne.'
						])}
						<p>
							Dans la liste, la colonne <strong>Statut</strong> indique « En ligne » ou « Brouillon ». L'icône « Publier » / « Dépublier » d'une ligne met un produit en ligne ou le retire du site sans le supprimer. La case « Publié (visible sur le site) » du formulaire fait la même chose.
						</p>
						<div class="rounded-2xl border border-neutral-light p-4">
							<p class="text-sm font-semibold uppercase tracking-wider text-primary-green mb-2">Photos du produit</p>
							<ul class="space-y-1 text-sm">
								<li>« Uploader » envoie des photos depuis l'ordinateur ; « Depuis la galerie » reprend des photos de la rubrique Médias.</li>
								<li>Jusqu'à 10 photos. <strong>La première est la photo principale</strong> (badge « Principal »).</li>
								<li>L'ordre ne se modifie pas : pour changer la photo principale, retirez celles placées avant elle (croix au survol), puis ajoutez-les de nouveau.</li>
								<li>Les photos sont affichées en carré sur le site : centrez bien le produit.</li>
							</ul>
						</div>
						<ul class="space-y-2 list-disc pl-5">
							<li><strong>Variantes</strong> : taille, parfum, mention et prix. Un prix de variante remplace le prix du produit.</li>
							<li><strong>Produit vedette</strong> (panneau Options) : le produit est mis en avant sur la page d'accueil (3 produits maximum).</li>
							<li><strong>Aperçu</strong> : ouvre une fiche simplifiée du produit tel qu'il est enregistré.</li>
						</ul>
						{@render attention('Changer le <strong>Slug</strong> d\'un produit change l\'adresse de sa page : les liens déjà partagés ne fonctionneront plus. Pour renommer un produit en ligne, changez plutôt son <strong>Nom</strong>.')}
						{@render attention('Enregistrez avant de quitter la page : les modifications non sauvegardées sont perdues sans avertissement.')}
					</div>
				</section>

				<section id="categories" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">4. Catégories</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>Les catégories regroupent les produits (fonio, baobab, mangue…) sur la page Produits.</p>
						{@render etapes([
							'Cliquez sur <strong>« Nouvelle catégorie »</strong>.',
							'Saisissez le <strong>Nom</strong> : le <strong>Slug</strong> se remplit tout seul (minuscules, sans accents, mots séparés par des tirets, par exemple <code class="text-xs bg-neutral-sand px-1.5 py-0.5 rounded">huiles-vegetales</code>).',
							'Indiquez l\'<strong>Ordre</strong> d\'affichage, cochez <strong>« Publiée »</strong> et remplissez la <strong>Version anglaise</strong>.',
							'Cliquez sur <strong>« Sauvegarder »</strong>.'
						])}
						<p>« Publiée » affiche la catégorie dans la liste du pied de page. Un clic sur le badge de statut dans le tableau la publie ou la retire.</p>
						{@render attention('Ne changez pas le Slug d\'une catégorie existante et ne la supprimez pas si des produits y sont rattachés : ils ne seraient plus regroupés correctement.')}
					</div>
				</section>

				<section id="formations" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">5. Formations</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>La rubrique <strong>Formations</strong> alimente la page Formations du site.</p>
						{@render etapes([
							'Cliquez sur <strong>« Nouvelle formation »</strong>.',
							'Renseignez le <strong>Titre</strong>, la <strong>Catégorie</strong> (Agroalimentaire ou Cosmétique), le <strong>Prix (FCFA)</strong>, la <strong>Durée (jours)</strong>, la <strong>Description</strong> et la <strong>Version anglaise</strong>.',
							'Ajoutez une <strong>Image</strong> (JPG, PNG ou WebP). Elle est affichée au format paysage sur le site : gardez le sujet au centre.',
							'Laissez <strong>« Publié (visible sur le site) »</strong> coché, puis cliquez sur « Sauvegarder ».'
						])}
						<p>
							Une formation <strong>dépubliée</strong> disparaît du site sans être supprimée : utilisez l'icône « Publier / Dépublier » de la liste pour une formation temporairement indisponible. L'« Ordre d'affichage » règle sa position.
						</p>
					</div>
				</section>

				<section id="points-de-vente" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">6. Points de vente</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						{@render etapes([
							'Cliquez sur <strong>« Nouveau point de vente »</strong>.',
							'Renseignez le <strong>Nom</strong>, l\'<strong>Adresse</strong>, le <strong>Département</strong>, la <strong>Ville</strong> et le <strong>Type</strong> (Boutique, Supermarché, Marché, Pharmacie).',
							'Ajoutez si possible la <strong>Situation géographique</strong> (repère connu, par exemple « face à la pharmacie X »), le <strong>Téléphone</strong> et les <strong>Horaires</strong>, avec leur version anglaise.',
							'Cliquez sur « Sauvegarder » : le point de vente apparaît aussitôt sur le site.'
						])}
						{@render attention('Les points de vente sont regroupés par département d\'après le texte saisi : écrivez toujours le département de la même façon (par exemple toujours « Littoral », jamais « littoral » ni « Littoral » avec un espace en trop).')}
						<p class="text-sm">Le bouton « Réparer le schéma » est un outil technique : ne l'utilisez qu'à la demande du support.</p>
					</div>
				</section>

				<section id="contenu" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">7. Textes &amp; images des pages</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>
							La rubrique <strong>Contenu</strong> permet de modifier les textes et photos des pages : Accueil, À propos, Impact, Contact, Points de vente, Grossistes, CGV et Mentions légales.
						</p>
						{@render etapes([
							'Choisissez la langue en haut (<strong>FR · Français</strong> ou <strong>EN · English</strong>), puis l\'onglet de la page.',
							'Les champs apparaissent dans l\'ordre de la page, groupés par section. Un badge « MODIFIÉ » signale les champs personnalisés.',
							'Modifiez les textes, puis cliquez sur <strong>« Sauvegarder les textes »</strong>.',
							'Cliquez sur <strong>« Voir la page »</strong> pour vérifier le résultat.'
						])}
						<div class="rounded-2xl border border-neutral-light overflow-hidden">
							<p class="text-sm font-semibold uppercase tracking-wider text-primary-green px-4 pt-4 pb-2">Lexique des noms de sections et de champs</p>
							<table class="w-full text-sm">
								<tbody>
									{#each lexique as [terme, sens]}
										<tr class="border-t border-neutral-light">
											<td class="px-4 py-2 font-semibold text-neutral-obsidian whitespace-nowrap align-top">{terme}</td>
											<td class="px-4 py-2">{sens}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<p>
							<strong>Revenir au texte d'origine :</strong> cliquez sur « Réinitialiser » à côté du champ, ou videz-le et sauvegardez. Les retours à la ligne ne sont pas conservés sur le site.
						</p>
						<p>
							<strong>Images :</strong> « Téléverser une image » (ou « Remplacer ») met la photo en ligne immédiatement. « Réinitialiser » remet la photo d'origine. Formats acceptés : JPG, PNG, WebP, 5 Mo maximum. Il n'y a pas d'outil de recadrage : préparez une photo au bon format (par exemple paysage pour les bandeaux, portrait pour le diaporama de l'accueil).
						</p>
						<p>
							<strong>Diaporama de l'accueil</strong> (Accueil › Hero › Slider) : « Ajouter des images », puis réordonnez-les au survol (« Déplacer avant / après ») ou retirez-les. Dès qu'une image est ajoutée, vos images remplacent <em>toutes</em> les images d'origine : ajoutez donc l'ensemble des photos à faire défiler. « Revenir aux images par défaut » annule tout.
						</p>
						<p>
							<strong>CGV et Mentions légales</strong> : le champ « Body » s'écrit avec un éditeur (Gras, Italique, Titre, Sous-titre, Liste, Citation, Lien…). Le premier enregistrement remplace la mise en page d'origine par votre texte mis en forme.
						</p>
						{@render attention('Sauvegardez avant de changer d\'onglet ou de langue : les textes non sauvegardés sont perdus sans avertissement.')}
						<p class="text-sm">
							Le menu, le pied de page, les numéros de contact du haut de page, la FAQ et les en-têtes des pages Produits et Formations ne sont pas modifiables ici : contactez le support technique.
						</p>
					</div>
				</section>

				<section id="anglais" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">8. Version anglaise</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<ul class="space-y-2 list-disc pl-5">
							<li><strong>Pages</strong> : dans Contenu, passez sur « EN · English » et traduisez les textes. Les images sont communes aux deux langues et se changent depuis la version française.</li>
							<li><strong>Produits</strong> : utilisez le bouton « Anglais » en haut du formulaire. Le texte français s'affiche en gris sous chaque champ pour vous guider. Prix, variantes, photos et valeurs nutritionnelles sont communs.</li>
							<li><strong>Catégories, formations, points de vente</strong> : remplissez le bloc « Version anglaise » du formulaire.</li>
						</ul>
						{@render astuce('Un champ anglais laissé vide affiche le texte français sur le site anglais : rien ne reste vide, mais pensez à traduire.')}
						{@render attention('Pour les bénéfices et les recettes d\'un produit, dès qu\'un élément est saisi en anglais, la liste anglaise remplace entièrement la liste française : traduisez-les tous. Le bouton « Traduire les recettes françaises » reprend les recettes pour les traduire.')}
					</div>
				</section>

				<section id="medias" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">9. Médias et photos</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 text-neutral-slate leading-relaxed">
						<p>
							La rubrique <strong>Médias</strong> est une bibliothèque de photos réutilisables : envoyez-les avec « Uploader », puis ajoutez-les à un produit avec « Depuis la galerie ».
						</p>
						<ul class="space-y-2 list-disc pl-5">
							<li>Utilisez des photos nettes, bien éclairées, de 1200 à 2000 pixels de large.</li>
							<li>Réduisez les fichiers lourds avant l'envoi (5 Mo maximum par image).</li>
							<li>Formats conseillés : JPG ou WebP pour les photos, PNG pour les visuels avec transparence.</li>
						</ul>
					</div>
				</section>

				<section id="faq" class="scroll-mt-8">
					<h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4">10. Questions fréquentes</h2>
					<div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg divide-y divide-neutral-light text-neutral-slate leading-relaxed">
						<div class="pb-4">
							<p class="font-semibold text-neutral-obsidian mb-1">Ma modification n'apparaît pas sur le site.</p>
							<p>Vérifiez que vous avez bien sauvegardé (message de confirmation), puis rechargez la page du site. Pour un texte, vérifiez la langue sélectionnée.</p>
						</div>
						<div class="py-4">
							<p class="font-semibold text-neutral-obsidian mb-1">Le site anglais affiche du français.</p>
							<p>Le texte n'a pas encore été traduit : saisissez sa version anglaise (voir la section 8).</p>
						</div>
						<div class="py-4">
							<p class="font-semibold text-neutral-obsidian mb-1">J'ai fait une erreur dans un texte de page.</p>
							<p>Cliquez sur « Réinitialiser » à côté du champ : le texte d'origine revient, dans cette langue uniquement.</p>
						</div>
						<div class="py-4">
							<p class="font-semibold text-neutral-obsidian mb-1">Ma photo est refusée.</p>
							<p>Elle dépasse probablement 5 Mo ou n'est pas au format JPG, PNG ou WebP. Réduisez-la, puis réessayez.</p>
						</div>
						<div class="pt-4">
							<p class="font-semibold text-neutral-obsidian mb-1">Un problème persiste ?</p>
							<p>Contactez le support technique en précisant la page concernée, ce que vous avez fait et, si possible, une capture d'écran.</p>
						</div>
					</div>
				</section>
			</article>
		</div>
	</div>

	{#if showBackToTop}
		<button
			type="button"
			onclick={scrollToTop}
			aria-label="Revenir en haut"
			class="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary-green text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
			</svg>
		</button>
	{/if}
</div>
{/if}
