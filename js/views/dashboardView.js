/* ==========================================================================
   KAPTUR — PHOTOGRAPHER DASHBOARD VIEW
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderDashboardView(container) {
  const user = store.getUser();
  const galleries = store.getGalleries();
  const activeGalleries = store.getActiveGalleries ? store.getActiveGalleries() : galleries;
  const invoices = store.getInvoices();
  const notifications = store.getNotifications();
  const convs = store.getConversations();

  const totalDownloads = activeGalleries.reduce((acc, g) => acc + (g.downloadsCount || 0), 0);
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const unreadDMs = convs.filter(c => c.unread).length;
  const maxGalleries = user.plan === 'Pro' ? 6 : 4;

  container.innerHTML = `
    <div class="page-container space-y-8">
      
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border-subtle shadow-lg">
        <div class="flex items-center gap-4">
          <img src="${user.avatar}" alt="${user.name}" class="avatar avatar-lg border-2 border-accent/50 shadow-md">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-extrabold tracking-tight">Bonjour, ${user.name}</h1>
              <span class="badge ${user.plan === 'Pro' ? 'badge-pro' : 'badge-subtle'}">${user.plan}</span>
            </div>
            <p class="text-sm text-muted mt-1">${user.role} • ${user.city}, ${user.country}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <button id="btn-quick-new-gallery" class="btn btn-primary shadow-md">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Nouvelle Galerie (${activeGalleries.length}/${maxGalleries})</span>
          </button>
          <a href="#invoices" class="btn btn-outline">
            <i data-lucide="file-plus" class="w-4 h-4"></i>
            <span>Créer Facture</span>
          </a>
        </div>
      </div>

      <!-- Key Analytics Metrics Grid (4 KPI Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Metric 1: Active Galleries -->
        <div class="card p-5 flex items-center gap-4 hover:border-accent/40 transition-all shadow-md">
          <div class="w-12 h-12 rounded-xl bg-accent-glow text-accent flex items-center justify-center border border-border-accent shrink-0">
            <i data-lucide="image" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-2xl font-extrabold">${activeGalleries.length} / ${maxGalleries}</div>
            <div class="text-xs text-muted font-medium">Galeries Actives</div>
          </div>
        </div>

        <!-- Metric 2: Total Client Downloads -->
        <div class="card p-5 flex items-center gap-4 hover:border-emerald-500/40 transition-all shadow-md">
          <div class="w-12 h-12 rounded-xl bg-green-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <i data-lucide="download" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-2xl font-extrabold">${totalDownloads}</div>
            <div class="text-xs text-muted font-medium">Téléchargements HD</div>
          </div>
        </div>

        <!-- Metric 3: Total Invoiced Revenue -->
        <div class="card p-5 flex items-center gap-4 hover:border-purple-500/40 transition-all shadow-md">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <i data-lucide="credit-card" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-2xl font-extrabold">${totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            <div class="text-xs text-muted font-medium">Volume Facturé</div>
          </div>
        </div>

        <!-- Metric 4: Unread Pro DMs -->
        <div class="card p-5 flex items-center gap-4 hover:border-amber-500/40 transition-all shadow-md">
          <div class="w-12 h-12 rounded-xl bg-pro-gold-glow text-gold flex items-center justify-center border border-yellow-500/30 shrink-0">
            <i data-lucide="message-square" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-2xl font-extrabold">${unreadDMs}</div>
            <div class="text-xs text-muted font-medium">Messages Pro Non-Lus</div>
          </div>
        </div>

      </div>

      <!-- Quick Navigation & Access Cards Section -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <i data-lucide="compass" class="w-5 h-5 text-accent"></i>
          <span>Accès Rapides & Modules</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card 1: Galeries -->
          <a href="#galleries" class="card p-5 hover:border-accent/50 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-accent-glow text-accent flex items-center justify-center border border-border-accent group-hover:bg-accent group-hover:text-white transition-colors">
                <i data-lucide="grid" class="w-5 h-5"></i>
              </div>
              <div class="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-muted group-hover:text-accent group-hover:bg-accent-glow transition-colors">
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-main group-hover:text-accent transition-colors">Toutes les Galeries</h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">Gérer vos collections, photos HD et liens de téléchargement client.</p>
            </div>
            <div class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted font-medium">
              <span>${activeGalleries.length} galeries actives</span>
              <span class="text-accent font-semibold group-hover:underline">Ouvrir →</span>
            </div>
          </a>

          <!-- Card 2: Factures -->
          <a href="#invoices" class="card p-5 hover:border-purple-500/50 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <i data-lucide="file-text" class="w-5 h-5"></i>
              </div>
              <div class="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-muted group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-main group-hover:text-purple-400 transition-colors">Mes Factures</h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">Générer, exporter en PDF et suivre vos règlements clients.</p>
            </div>
            <div class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted font-medium">
              <span>${invoices.length} factures enregistrées</span>
              <span class="text-purple-400 font-semibold group-hover:underline">Ouvrir →</span>
            </div>
          </a>

          <!-- Card 3: Notifications -->
          <a href="#notifications" class="card p-5 hover:border-emerald-500/50 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-green-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <i data-lucide="bell" class="w-5 h-5"></i>
              </div>
              <div class="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-muted group-hover:text-emerald-400 group-hover:bg-green-500/10 transition-colors">
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-main group-hover:text-emerald-400 transition-colors">Vos Notifications</h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">Alertes en temps réel sur les téléchargements et téléchargements clients.</p>
            </div>
            <div class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted font-medium">
              <span>${notifications.length} alertes en cours</span>
              <span class="text-emerald-400 font-semibold group-hover:underline">Ouvrir →</span>
            </div>
          </a>

          <!-- Card 4: Communauté Pro -->
          <a href="#community" class="card p-5 hover:border-amber-500/50 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-pro-gold-glow text-gold flex items-center justify-center border border-yellow-500/20 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <i data-lucide="users" class="w-5 h-5"></i>
              </div>
              <div class="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-muted group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-main group-hover:text-amber-400 transition-colors">Communauté Pro</h3>
              <p class="text-xs text-muted mt-1 leading-relaxed">Échanger avec les photographes et participer aux discussions.</p>
            </div>
            <div class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-muted font-medium">
              <span>${convs.length} discussions</span>
              <span class="text-amber-400 font-semibold group-hover:underline">Ouvrir →</span>
            </div>
          </a>

        </div>
      </div>

      <!-- Subscription & Quota Status Bar -->
      <div class="card p-5 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-accent-glow text-accent flex items-center justify-center border border-border-accent shrink-0">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-extrabold text-main">Statut du compte : Formule ${user.plan}</h4>
            <p class="text-xs text-muted">Quota de galeries actives : <span class="text-accent font-semibold">${activeGalleries.length}/${maxGalleries}</span> utilisées</p>
          </div>
        </div>
        <a href="#subscription" class="btn btn-secondary btn-sm text-xs px-4 py-2 font-semibold">
          Gérer mon abonnement
        </a>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Bind Quick Gallery Creator Button
  const btnNew = container.querySelector('#btn-quick-new-gallery');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      router.navigate('galleries', { action: 'new' });
    });
  }
}

