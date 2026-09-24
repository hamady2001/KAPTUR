/* ==========================================================================
   KAPTUR — AUTHENTICATION VIEW (LOGIN & REGISTRATION)
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderAuthView(container, params) {
  const isRegister = params.get('tab') === 'register';
  const preSelectedPlan = params.get('plan') || 'Pro';

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div class="card max-w-md w-full p-8 bg-surface border border-border-strong shadow-2xl">
        
        <!-- Header & Logo -->
        <div class="text-center mb-8">
          <a href="#landing" class="inline-flex items-center gap-3 mb-4">
            <div class="logo-icon bg-accent text-white flex items-center justify-center rounded-lg font-bold text-xl w-10 h-10">K</div>
            <span class="font-bold text-2xl tracking-tight">KAPTUR</span>
          </a>
          <p class="text-sm text-muted">Accédez à votre espace professionnel Kaptur</p>
        </div>

        <!-- Auth Tabs -->
        <div class="flex border-b border-border-subtle mb-6 text-center font-semibold text-sm">
          <button id="tab-btn-login" class="flex-1 py-3 border-b-2 ${!isRegister ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-main'} transition-colors">
            Connexion
          </button>
          <button id="tab-btn-register" class="flex-1 py-3 border-b-2 ${isRegister ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-main'} transition-colors">
            Créer un compte
          </button>
        </div>

        <!-- LOGIN FORM -->
        <form id="form-login" class="${isRegister ? 'hidden' : 'block'} space-y-4">
          <div class="form-group">
            <label class="form-label">Adresse Email</label>
            <input type="email" id="login-email" class="form-input" value="julien.mercer@kaptur.studio" required placeholder="nom@studio.fr">
          </div>

          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label">Mot de passe</label>
              <a href="javascript:void(0)" class="text-xs text-accent hover:underline">Mot de passe oublié ?</a>
            </div>
            <input type="password" id="login-password" class="form-input" value="••••••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary w-full btn-lg mt-4">
            <i data-lucide="log-in"></i>
            <span>Se connecter</span>
          </button>
        </form>

        <!-- REGISTER FORM -->
        <form id="form-register" class="${!isRegister ? 'hidden' : 'block'} space-y-4">
          
          <div class="form-group">
            <label class="form-label">Choix de l'abonnement</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="cursor-pointer">
                <input type="radio" name="reg-plan" value="Standard" class="peer hidden" ${preSelectedPlan === 'Standard' ? 'checked' : ''}>
                <div class="p-3 rounded-xl bg-surface-subtle border border-border-subtle peer-checked:border-accent peer-checked:bg-sky-500/10 text-center transition-all">
                  <div class="font-bold text-sm text-main">Abonnement Standard</div>
                  <div class="text-xs text-muted mt-0.5">2 000 FCFA / mois</div>
                </div>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="reg-plan" value="Pro" class="peer hidden" ${preSelectedPlan === 'Pro' || preSelectedPlan !== 'Standard' ? 'checked' : ''}>
                <div class="p-3 rounded-xl bg-surface-subtle border border-border-subtle peer-checked:border-amber-500 peer-checked:bg-amber-500/10 text-center transition-all">
                  <div class="font-bold text-sm text-amber-400">Abonnement Pro</div>
                  <div class="text-xs text-muted mt-0.5">3 000 FCFA / mois</div>
                </div>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nom complet</label>
            <input type="text" id="reg-name" class="form-input" placeholder="Ex: Julien Mercer" required>
          </div>



          <div class="form-group">
            <label class="form-label">Ville d'exercice</label>
            <input type="text" id="reg-city" class="form-input" placeholder="Ex: Paris, Lyon, Bruxelles" required>
          </div>

          <div class="form-group">
            <label class="form-label">Adresse Email</label>
            <input type="email" id="reg-email" class="form-input" placeholder="contact@vottestudio.fr" required>
          </div>

          <div class="form-group">
            <label class="form-label">Numéro de téléphone</label>
            <input type="tel" id="reg-phone" class="form-input" placeholder="Ex: +33 6 12 34 56 78" required>
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input type="password" id="reg-password" class="form-input" placeholder="••••••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary w-full btn-lg mt-4">
            <i data-lucide="user-plus"></i>
            <span>Créer mon profil Kaptur</span>
          </button>
        </form>

      </div>
    </div>
  `;

  // Bind Tab Switching Events
  const tabLogin = container.querySelector('#tab-btn-login');
  const tabRegister = container.querySelector('#tab-btn-register');
  const formLogin = container.querySelector('#form-login');
  const formRegister = container.querySelector('#form-register');

  tabLogin.addEventListener('click', () => {
    tabLogin.className = 'flex-1 py-3 border-b-2 border-accent text-accent font-semibold text-sm';
    tabRegister.className = 'flex-1 py-3 border-b-2 border-transparent text-muted hover:text-main font-semibold text-sm';
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.className = 'flex-1 py-3 border-b-2 border-accent text-accent font-semibold text-sm';
    tabLogin.className = 'flex-1 py-3 border-b-2 border-transparent text-muted hover:text-main font-semibold text-sm';
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  // Bind Form Submissions
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    store.updateProfile({ isLoggedIn: true });
    router.navigate('dashboard');
  });

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#reg-name').value;
    const city = container.querySelector('#reg-city').value;
    const email = container.querySelector('#reg-email').value;
    const phone = container.querySelector('#reg-phone').value;
    const selectedPlan = container.querySelector('input[name="reg-plan"]:checked')?.value || 'Pro';

    store.updateProfile({
      name,
      role: 'Photographe',
      city,
      email,
      phone,
      plan: selectedPlan,
      isLoggedIn: true
    });

    router.navigate('dashboard');
  });
}

