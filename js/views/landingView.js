/* ==========================================================================
   KAPTUR — LANDING PAGE VIEW
   ========================================================================== */

export function renderLandingView(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-xs font-semibold text-sky-400 mb-6">
        <span class="badge badge-pro">NOUVEAU</span>
        <span>Plateforme tout-en-un pour créateurs visuels</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6 text-white">
        Sublimez la livraison de vos travaux & développez votre activité.
      </h1>

      <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
        Kaptur permet aux <strong class="text-white">photographes professionnels</strong> de présenter leurs portfolios, partager des galeries clients sécurisées, générer des factures et collaborer entre professionnels.
      </p>

      <!-- Main CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <a href="#auth?tab=register" class="btn btn-primary btn-lg w-full sm:w-auto">
          <span>Créer mon profil gratuitement</span>
          <i data-lucide="arrow-right"></i>
        </a>
        <button id="btn-open-directory-modal" class="btn btn-pro btn-lg w-full sm:w-auto">
          <i data-lucide="users"></i>
          <span>Consulter l'annuaire des créateurs Pro</span>
        </button>
      </div>
    </section>

    <!-- STREAMLINED FEATURES SECTION (3 Essential Cards) -->
    <section id="features" class="py-20 px-6 bg-slate-900/50 border-y border-white/10">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold tracking-tight mb-4 text-white">Une suite d'outils essentielle et épurée.</h2>
          <p class="text-slate-400">Concentrez-vous sur votre art, Kaptur s'occupe de la livraison, de l'administration et de votre réseau.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="card card-hover p-8">
            <div class="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-6">
              <i data-lucide="image" class="w-7 h-7"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Galeries Clients Privées</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Partagez vos photos HD dans un écrin élégant. Définissez un code PIN de sécurité, choisissez les droits de téléchargement ZIP et suivez les vus en temps réel.</p>
          </div>

          <!-- Card 2 -->
          <div class="card card-hover p-8">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
              <i data-lucide="file-text" class="w-7 h-7"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Facturation & Reçus Conformes</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Émettez des factures professionnelles avec calcul automatique de la TVA et suivi des règlements. Générez des reçus PDF prêts à être imprimés ou envoyés.</p>
          </div>

          <!-- Card 3 -->
          <div class="card card-hover p-8 border-amber-500/30">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6">
              <i data-lucide="map-pin" class="w-7 h-7"></i>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-xl font-bold text-white">Annuaire Géographique Pro</h3>
              <span class="badge badge-pro">PRO</span>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">Seuls les membres Pro sont référencés par ville et spécialité. Les clients et agences peuvent vous trouver et vous contacter directement via Instagram ou WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PUBLIC ANNUAIRE CTA BANNER ON LANDING PAGE -->
    <section id="annuaire" class="py-20 px-6 max-w-7xl mx-auto">
      <div class="card card-pro p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-amber-500/40 bg-gradient-to-r from-slate-900 via-[#121824] to-amber-950/30">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <i data-lucide="users" class="w-3.5 h-3.5"></i>
            <span>RÉSEAU EXCLUSIF PRO</span>
          </div>
          <h2 class="text-3xl font-extrabold text-white">Consulter l'Annuaire des Créateurs</h2>
          <p class="text-slate-300 text-sm max-w-xl">Accédez à la liste des photographes Pro disponibles par ville avec leurs coordonnées Instagram & WhatsApp directs.</p>
        </div>
        <button id="btn-open-directory-modal-2" class="btn btn-pro btn-lg flex-shrink-0">
          <i data-lucide="list"></i>
          <span>Voir la liste des professionnels</span>
        </button>
      </div>
    </section>

    <!-- PRICING SECTION -->
    <section id="pricing" class="py-20 px-6 max-w-7xl mx-auto border-b border-white/10">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-extrabold tracking-tight mb-4 text-white">Tarifs simples et transparents.</h2>
        <p class="text-slate-400">Choisissez la formule adaptée à votre volume de travail.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Standard Plan -->
        <div class="card flex flex-col justify-between p-8">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">Standard</h3>
              <span class="badge badge-subtle">Pour débuter</span>
            </div>
            <div class="text-4xl font-extrabold mb-6 text-white">2 000 FCFA <span class="text-base font-normal text-slate-400">/ mois</span></div>
            <ul class="space-y-3 text-sm mb-8 text-slate-300">
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> <strong>Jusqu'à 4 Galeries clients actives</strong></li>
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> Protection des galeries par mot de passe PIN</li>
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> Création de factures & reçus conformes</li>
              <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas d'accès à la messagerie privée Pro</li>
              <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas de référencement dans l'annuaire</li>
            </ul>
          </div>
          <a href="#auth?tab=register&plan=Standard" class="btn btn-outline w-full text-center">Rejoindre en Standard</a>
        </div>

        <!-- Pro Plan -->
        <div class="card card-pro flex flex-col justify-between relative overflow-hidden p-8 border-amber-500/40">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-amber-400">Offre Pro</h3>
              <span class="badge badge-pro">RECOMMANDÉ</span>
            </div>
            <div class="text-4xl font-extrabold mb-6 text-amber-400">3 000 FCFA <span class="text-base font-normal text-slate-400">/ mois</span></div>
            <ul class="space-y-3 text-sm mb-8 text-slate-200">
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Jusqu'à 6 Galeries clients actives</strong></li>
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> Protection PIN & Téléchargements ZIP HD</li>
              <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> Création de factures avec logo</li>
              <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Messagerie Privée Communauté Pro</strong></li>
              <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Visibilité Annuaire Géographique + Badge Pro</strong></li>
            </ul>
          </div>
          <a href="#auth?tab=register&plan=Pro" class="btn btn-pro w-full text-center">Devenir Membre Pro</a>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION (4 Essential Accordions) -->
    <section id="faq" class="py-20 px-6 max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold tracking-tight mb-4 text-white">Questions Fréquentes (FAQ)</h2>
        <p class="text-slate-400 text-sm">Tout ce que vous devez savoir avant de commencer avec Kaptur.</p>
      </div>

      <div class="space-y-4">
        <div class="card p-6 cursor-pointer faq-item">
          <div class="flex items-center justify-between font-bold text-lg text-white">
            <span>1. Comment fonctionnent les galeries clients sécurisées par code PIN ?</span>
            <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon"></i>
          </div>
          <div class="text-sm text-slate-400 mt-3 hidden faq-answer">
            Lorsque vous créez une galerie, Kaptur génère un lien d'accès unique. Vous pouvez y associer un code PIN à 4 chiffres. Vos clients saisissent ce code PIN pour déverrouiller et télécharger les photos en résolution originale ZIP.
          </div>
        </div>

        <div class="card p-6 cursor-pointer faq-item">
          <div class="flex items-center justify-between font-bold text-lg text-white">
            <span>2. Qui peut apparaître dans l'annuaire géographique des créateurs ?</span>
            <div class="flex items-center gap-2">
              <span class="badge badge-pro">PRO</span>
              <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon"></i>
            </div>
          </div>
          <div class="text-sm text-slate-400 mt-3 hidden faq-answer">
            Seuls les professionnels abonnés à l'offre <strong>Pro</strong> apparaissent dans l'annuaire géographique. Les clients et agences à la recherche d'un photographe sur Dakar, Paris, Lyon ou Bruxelles peuvent consulter leur fiche et les contacter directement via Instagram ou WhatsApp.
          </div>
        </div>

        <div class="card p-6 cursor-pointer faq-item">
          <div class="flex items-center justify-between font-bold text-lg text-white">
            <span>3. Quelle est la différence entre l'abonnement Standard et Pro ?</span>
            <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon"></i>
          </div>
          <div class="text-sm text-slate-400 mt-3 hidden faq-answer">
            L'offre Standard (2 000 FCFA/mois) autorise jusqu'à 4 galeries actives et la création de factures. L'offre Pro (3 000 FCFA/mois) permet jusqu'à 6 galeries actives, la messagerie privée exclusive entre créateurs et le référencement dans l'annuaire géographique Pro.
          </div>
        </div>

        <div class="card p-6 cursor-pointer faq-item">
          <div class="flex items-center justify-between font-bold text-lg text-white">
            <span>4. Mes clients doivent-ils créer un compte pour télécharger leurs photos ?</span>
            <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon"></i>
          </div>
          <div class="text-sm text-slate-400 mt-3 hidden faq-answer">
            Non ! Aucun compte n'est requis pour vos clients. Ils ouvrent simplement le lien que vous leur fournissez, entrent le code PIN facultatif et téléchargent directement l'album complet en un clic.
          </div>
        </div>
      </div>
    </section>

    <!-- ELEGANT FOOTER (Pied de Page) -->
    <footer class="py-12 px-6 border-t border-white/10 bg-[#090D14] text-sm text-slate-400">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div class="space-y-3 md:col-span-2">
          <div class="flex items-center gap-3">
            <div class="logo-icon bg-sky-400 text-slate-950 flex items-center justify-center rounded-lg font-bold text-base w-7 h-7">K</div>
            <span class="font-bold text-white text-lg tracking-tight">KAPTUR</span>
          </div>
          <p class="text-xs text-slate-400 max-w-sm">La plateforme tout-en-un conçue pour les photographes professionnels : galeries clients, facturation et réseau Pro.</p>
        </div>
        <div>
          <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-3">Plateforme</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="#landing#features" class="hover:text-sky-400">Fonctionnalités</a></li>
            <li><a href="#search" class="hover:text-sky-400">Annuaire des créateurs Pro</a></li>
            <li><a href="#landing#pricing" class="hover:text-sky-400">Tarifs Standard & Pro</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-3">Espace Membre</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="#auth" class="hover:text-sky-400">Connexion</a></li>
            <li><a href="#auth?tab=register" class="hover:text-sky-400">Créer un compte</a></li>
            <li><a href="#client-portal?token=vogue-automne-2026" class="hover:text-sky-400">Démo Galerie Client</a></li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© 2026 Kaptur Inc. Tous droits réservés. Plateforme pour créateurs visuels.</div>
        <div class="flex gap-4">
          <a href="javascript:void(0)" class="hover:text-slate-400">Mentions Légales</a>
          <a href="javascript:void(0)" class="hover:text-slate-400">Confidentialité</a>
        </div>
      </div>
    </footer>
  `;
}
