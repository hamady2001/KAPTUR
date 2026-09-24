/* ==========================================================================
   KAPTUR — SUBSCRIPTION MANAGEMENT VIEW (STANDARD vs PRO)
   ========================================================================== */

import { store } from '../store.js';

export function renderSubscriptionView(container) {
  const user = store.getUser();

  function render() {
    const isPro = user.plan === 'Pro';

    container.innerHTML = `
      <div class="page-container space-y-8">
        <div class="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Gestion de votre Abonnement</h1>
            <p class="text-sm text-slate-400">Formule actuelle : <strong class="text-white">${user.plan}</strong></p>
          </div>
          <button id="btn-toggle-sub" class="btn ${isPro ? 'btn-outline' : 'btn-pro'}">
            <span>${isPro ? 'Rétrograder en Standard' : 'Passer à l\'Offre Pro (3 000 FCFA/mois)'}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Standard Plan Card -->
          <div class="card p-8 flex flex-col justify-between ${!isPro ? 'border-2 border-sky-400' : ''}">
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Formule Standard</h3>
              <div class="text-3xl font-extrabold text-white mb-6">2 000 FCFA <span class="text-xs font-normal text-slate-400">/ mois</span></div>
              <ul class="space-y-3 text-sm text-slate-300 mb-8">
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> <strong>Jusqu'à 4 Galeries clients actives</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> <strong>Génération de liens directs & Quota de téléchargement</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> Création de factures conformes</li>
                <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas d'accès à la messagerie privée Pro</li>
                <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas de référencement dans l'annuaire Pro</li>
              </ul>
            </div>
            ${!isPro ? `<span class="badge badge-accent self-center">VOTRE PLAN ACTIF</span>` : ''}
          </div>

          <!-- Pro Plan Card -->
          <div class="card card-pro p-8 flex flex-col justify-between ${isPro ? 'border-2 border-amber-400' : ''}">
            <div>
              <h3 class="text-xl font-bold text-amber-400 mb-2">Formule Pro</h3>
              <div class="text-3xl font-extrabold text-amber-400 mb-6">3 000 FCFA <span class="text-xs font-normal text-slate-400">/ mois</span></div>
              <ul class="space-y-3 text-sm text-slate-200 mb-8">
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Jusqu'à 6 Galeries clients actives</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Génération de liens directs & Quotas personnalisables</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> Création de factures avec logo</li>
                <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Messagerie Privée Communauté Pro</strong></li>
                <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4"></i> <strong>Visibilité Annuaire Géographique + Badge Pro</strong></li>
              </ul>
            </div>
            ${isPro ? `<span class="badge badge-pro self-center">VOTRE PLAN ACTIF</span>` : ''}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    container.querySelector('#btn-toggle-sub').addEventListener('click', () => {
      const user = store.getUser();
      const targetPlan = user.plan === 'Pro' ? 'Standard' : 'Pro';
      if (typeof openPlanConfirmModal === 'function') {
        openPlanConfirmModal(targetPlan, () => {
          const newPlan = store.togglePlan();
          if (typeof openCustomToast === 'function') {
            openCustomToast(`✨ Formule mise à jour : vous êtes désormais en formule ${newPlan} !`, 'success');
          }
          render();
        });
      } else {
        const newPlan = store.togglePlan();
        render();
      }
    });
  }

  render();
}
