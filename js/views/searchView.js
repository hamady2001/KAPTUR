/* ==========================================================================
   KAPTUR — LOCATION-BASED PRO SEARCH VIEW
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderSearchView(container, params) {
  let initialQuery = params.get('q') || '';
  let initialCity = params.get('city') || '';

  function renderList() {
    const pros = store.getPros(initialQuery, initialCity, false);

    container.innerHTML = `
      <div class="page-container space-y-8">
        
        <!-- Page Header -->
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pro-gold-glow border border-yellow-500/30 text-gold text-xs font-bold mb-3">
            <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
            <span>ANNUAIRE GÉOGRAPHIQUE PHOTOGRAPHES PRO</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight mb-2">Photographes Pro.</h1>
          <p class="text-sm text-muted">Recherchez les professionnels de l'image abonnés Pro par ville, spécialité et disponibilité.</p>
        </div>

        <!-- Search Controls Card -->
        <div class="card p-6 bg-surface border border-border-strong space-y-4 shadow-xl">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Keyword / Name Search -->
            <div class="form-group mb-0">
              <label class="form-label">Métier ou Spécialité</label>
              <div class="relative">
                <input type="text" id="search-query" class="form-input" value="${initialQuery}" placeholder="Ex: Mode, Portrait, UI/UX, Architecture...">
              </div>
            </div>

            <!-- City Filter -->
            <div class="form-group mb-0">
              <label class="form-label">Ville ou Région</label>
              <div class="relative">
                <input type="text" id="search-city" class="form-input" value="${initialCity}" placeholder="Ex: Paris, Lyon, Bruxelles, Genève...">
              </div>
            </div>

            <!-- Quick City Shortcuts -->
            <div class="form-group mb-0 flex flex-col justify-end">
              <label class="form-label">Villes fréquentes</label>
              <div class="flex items-center gap-2 flex-wrap">
                <button class="btn btn-outline btn-sm btn-city-tag" data-city="Paris">Paris</button>
                <button class="btn btn-outline btn-sm btn-city-tag" data-city="Lyon">Lyon</button>
                <button class="btn btn-outline btn-sm btn-city-tag" data-city="Bruxelles">Bruxelles</button>
                <button class="btn btn-outline btn-sm btn-city-tag" data-city="Genève">Genève</button>
              </div>
            </div>

          </div>
        </div>

        <!-- Results Header -->
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-muted">
            <strong class="text-main font-bold">${pros.length}</strong> photographe(s) pro trouvé(s)
          </div>
        </div>

        <!-- Pros Vertical List -->
        <div class="flex flex-col gap-3">
          ${pros.map(pro => `
            <div class="card p-4 bg-surface border border-border-strong rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 card-hover ${pro.isPro ? 'border-amber-500/30' : ''}">
              
              <!-- Left: Avatar + Name + Specialty + City (Clickable to view full profile) -->
              <div class="flex items-center gap-4 min-w-0 flex-1 cursor-pointer group btn-view-pro-details" data-id="${pro.id}" title="Cliquer pour voir le profil complet de ${pro.name}">
                <div class="relative flex-shrink-0">
                  <img src="${pro.avatar}" alt="${pro.name}" class="avatar avatar-lg border-2 border-border-strong group-hover:scale-105 transition-transform">
                  <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121824] shadow-md shadow-emerald-500/50" title="En ligne"></span>
                </div>
                
                <div class="min-w-0 space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-base text-main group-hover:text-accent transition-colors truncate">${pro.name}</h3>
                    <span class="badge badge-pro text-[10px] px-2 py-0.5">PRO VÉRIFIÉ</span>
                  </div>
                  <div class="text-xs font-semibold text-accent group-hover:text-main transition-colors truncate">${pro.role} • <span class="text-subtle font-normal">${pro.specialty}</span></div>
                  <div class="flex items-center gap-2 text-xs text-subtle">
                    <span class="inline-flex items-center gap-1 font-mono text-gold">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${pro.city}, ${pro.country}
                    </span>
                    <span>•</span>
                    <span class="text-emerald-400 font-mono font-semibold">${pro.phone || '+33 6 12 34 56 78'}</span>
                  </div>
                </div>
              </div>

              <!-- Center Bio -->
              <div class="hidden lg:block text-xs text-muted max-w-xs flex-1 line-clamp-2">
                ${pro.bio}
              </div>

              <!-- Right Actions: WhatsApp, Instagram & DM Pro -->
              <div class="flex items-center gap-2 flex-wrap shrink-0">
                <a href="https://wa.me/${(pro.whatsapp || pro.phone || '+33612345678').replace(/[^0-9]/g, '')}" target="_blank" class="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm" title="Ouvrir WhatsApp (${pro.phone || '+33 6 12 34 56 78'})">
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                  <span>WhatsApp</span>
                </a>
                <a href="https://instagram.com/${(pro.instagram || (pro.name ? pro.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_photo' : 'kaptur_studio')).replace(/^@/, '')}" target="_blank" class="px-3 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 border border-pink-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm" title="Ouvrir Instagram (@${pro.instagram || 'kaptur_studio'})">
                  <i data-lucide="instagram" class="w-4 h-4"></i>
                  <span>Instagram</span>
                </a>
                <a href="#community?proId=${pro.id}" class="btn btn-primary btn-sm text-xs font-semibold px-3 py-2" title="Envoyer un DM Pro à ${pro.name}">
                  <i data-lucide="message-square" class="w-3.5 h-3.5"></i> <span>DM Pro</span>
                </a>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;

    // Re-bind Lucide
    if (window.lucide) window.lucide.createIcons();

    // Bind Search Input Listeners
    const inputQ = container.querySelector('#search-query');
    const inputC = container.querySelector('#search-city');

    const updateFilter = () => {
      initialQuery = inputQ.value;
      initialCity = inputC.value;
      renderList();
    };

    inputQ.addEventListener('input', updateFilter);
    inputC.addEventListener('input', updateFilter);

    // City tag buttons
    container.querySelectorAll('.btn-city-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        inputC.value = btn.getAttribute('data-city');
        updateFilter();
      });
    });

    // Pro Details Modal Trigger
    container.querySelectorAll('.btn-view-pro-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const proId = btn.getAttribute('data-id');
        const pro = pros.find(p => p.id === proId);
        if (pro) showProDetailsModal(pro);
      });
    });
  }

  function showProDetailsModal(pro) {
    let modal = document.getElementById('search-pro-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'search-pro-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    const cleanPhone = (pro.whatsapp || pro.phone || '+33612345678').replace(/[^0-9]/g, '');
    const phoneDisplay = pro.phone || pro.whatsapp || '+33 6 12 34 56 78';
    const cleanInsta = (pro.instagram || (pro.name ? pro.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_photo' : 'kaptur_studio')).replace(/^@/, '');
    const portfolioPhotos = (pro.portfolio && pro.portfolio.length > 0) ? pro.portfolio.slice(0, 3) : [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
    ];

    modal.innerHTML = `
      <div class="modal-card max-w-xl bg-surface border border-border-strong p-6 space-y-6">
        <div class="flex items-center justify-between border-b border-border-subtle pb-4">
          <div class="flex items-center gap-2">
            <span class="badge badge-pro">PRO VÉRIFIÉ</span>
            <span class="text-xs text-subtle font-mono">${pro.city}, ${pro.country}</span>
          </div>
          <button id="close-search-pro-modal" class="btn-icon btn-ghost text-muted">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img src="${pro.avatar}" alt="${pro.name}" class="avatar avatar-xl border-2 border-accent flex-shrink-0">
          <div class="text-center sm:text-left space-y-2">
            <div>
              <h2 class="text-xl font-extrabold text-main">${pro.name}</h2>
              <p class="text-sm font-semibold text-accent mt-0.5">${pro.role} • ${pro.specialty}</p>
            </div>

            <!-- Compact Direct Contact Buttons & Phone Badge Row (Aligned in 1 Row) -->
            <div class="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-nowrap overflow-x-auto">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-emerald-400 font-mono text-xs font-bold whitespace-nowrap shrink-0">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>${phoneDisplay}</span>
              </span>

              <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn btn-sm bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>WhatsApp</span>
              </a>

              <a href="https://instagram.com/${cleanInsta}" target="_blank" class="btn btn-sm bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
                <i data-lucide="instagram" class="w-3.5 h-3.5"></i>
                <span>Instagram</span>
              </a>
            </div>

            <p class="text-xs text-muted pt-1 line-clamp-2">${pro.bio}</p>
          </div>
        </div>

        <!-- Portfolio Preview (Max 3 Photos - Clickable Lightbox) -->
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-subtle mb-3 flex items-center justify-between">
            <span>Aperçu des travaux récents</span>
            <span class="text-xs text-muted font-normal">(Cliquez sur une photo pour l'agrandir)</span>
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${portfolioPhotos.slice(0, 3).map((img, idx) => `
              <div class="group relative rounded-xl overflow-hidden aspect-[4/3] border border-border-subtle shadow-md cursor-pointer hover:border-accent transition-all btn-zoom-portfolio-img" data-index="${idx}">
                <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="p-2 rounded-full bg-slate-900/90 border border-white/20 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <i data-lucide="maximize-2" class="w-4 h-4 text-sky-400"></i> Agrandir
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <button id="close-search-pro-modal-2" class="btn btn-secondary w-full">Fermer la fiche</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#close-search-pro-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-search-pro-modal-2').addEventListener('click', closeModal);

    modal.querySelectorAll('.btn-zoom-portfolio-img').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        if (window.openImageLightboxModal) {
          window.openImageLightboxModal(portfolioPhotos.slice(0, 3), idx, pro.name);
        }
      });
    });
  }

  renderList();
}
