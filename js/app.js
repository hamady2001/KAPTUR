/* ==========================================================================
   KAPTUR — COMPLETE SAAS PLATFORM JAVASCRIPT ENGINE
   Works seamlessly on both file:// protocol and http:// servers
   ========================================================================== */

(function() {
  'use strict';

  const STORAGE_KEY = 'kaptur_app_state_v2';

  // Sleek Custom Toast Notification System (Replaces browser default alerts)
  function openCustomToast(message, type = 'success') {
    let toast = document.getElementById('custom-app-toast');
    if (toast) toast.remove();

    toast = document.createElement('div');
    toast.id = 'custom-app-toast';
    toast.className = 'fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-[9999] transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto';

    const isSuccess = type === 'success';
    const isWarning = type === 'warning' || type === 'amber';
    const borderClass = isSuccess ? 'border-emerald-500/50 bg-[#121824]/95 text-emerald-300' : isWarning ? 'border-amber-500/50 bg-[#121824]/95 text-amber-300' : 'border-sky-500/50 bg-[#121824]/95 text-sky-300';
    const icon = isSuccess ? 'check-circle' : isWarning ? 'alert-triangle' : 'info';

    toast.innerHTML = `
      <div class="px-5 py-3.5 rounded-2xl border ${borderClass} shadow-2xl flex items-center gap-3.5 text-xs font-bold animate-fade-in backdrop-blur-xl">
        <i data-lucide="${icon}" class="w-5 h-5 shrink-0"></i>
        <span class="leading-snug">${message}</span>
      </div>
    `;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => { if (toast && toast.parentNode) toast.remove(); }, 300);
      }
    }, 4000);
  }

  window.openCustomToast = openCustomToast;
  window.alert = function(msg) {
    if (typeof msg === 'string' && (msg.toLowerCase().includes('limite') || msg.toLowerCase().includes('quota'))) {
      openCustomToast(msg, 'warning');
    } else {
      openCustomToast(msg, 'success');
    }
  };

  // Sleek Plan Change Confirmation Modal
  function openPlanConfirmModal(targetPlan, onConfirm) {
    let existingModal = document.getElementById('custom-confirm-modal');
    if (existingModal) existingModal.remove();

    const isStandard = targetPlan.toLowerCase().includes('standard');
    const titleText = isStandard ? 'Rétrograder en formule Standard ?' : 'Passer à la formule Pro ?';
    const descText = isStandard
      ? 'En rétrogradant vers la formule Standard (2 000 FCFA/mois), votre quota passera à 4 galeries actives simultanées max et vous n\'aurez plus accès à la messagerie privée Pro.'
      : 'En passant à la formule Pro (3 000 FCFA/mois), vous débloquez jusqu\'à 6 galeries actives simultanées, la messagerie privée Pro et le badge vérifié sur l\'annuaire.';
    const confirmBtnClass = isStandard
      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40'
      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold shadow-lg';
    const iconName = isStandard ? 'alert-triangle' : 'zap';
    const iconColor = isStandard ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-amber-400 bg-amber-500/20 border-amber-400/50';

    const modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.className = 'modal-overlay z-[9999]';
    modal.innerHTML = `
      <div class="modal-card max-w-md bg-[#121824] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl ${iconColor} border flex items-center justify-center shrink-0">
            <i data-lucide="${iconName}" class="w-6 h-6"></i>
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-extrabold text-white leading-snug">${titleText}</h3>
            <p class="text-xs text-slate-300 leading-relaxed">${descText}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button id="btn-modal-cancel" class="btn btn-ghost text-xs text-slate-300 hover:text-white px-4 py-2">
            Non, annuler
          </button>
          <button id="btn-modal-confirm" class="btn ${confirmBtnClass} text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>Oui, confirmer</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => {
      modal.classList.add('opacity-0');
      setTimeout(() => { if (modal && modal.parentNode) modal.remove(); }, 200);
    };

    modal.querySelector('#btn-modal-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#btn-modal-confirm').addEventListener('click', () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }

  window.openPlanConfirmModal = openPlanConfirmModal;

  // INITIAL SEED MOCK DATA
  const defaultState = {
    currentUser: {
      id: 'usr_101',
      name: 'Julien Mercer',
      email: 'julien.mercer@kaptur.studio',
      phone: '+33 6 12 34 56 78',
      role: 'Photographe',
      specialty: 'Portrait & Mode',
      city: 'Paris',
      country: 'France',
      bio: 'Photographe professionnel basé à Paris. Spécialisé dans les portraits éditoriaux, la mode haute couture et la création d\'images de marque à forte identité.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      website: 'https://julienmercer.com',
      instagram: 'julienmercer_studio',
      whatsapp: '+33612345678',
      plan: 'Pro',
      equipment: ['Canon EOS R5', 'RF 85mm f/1.2L', 'Profoto B10X', 'Lightroom Classic'],
      isLoggedIn: true
    },

    galleries: [
      {
        id: 'gal_01',
        title: 'Shooting Éditorial Vogue Paris - Automne',
        clientName: 'Maison de Haute Couture Lumière',
        clientEmail: 'contact@lumiere-paris.fr',
        coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        createdDate: '2026-08-28',
        expiryDate: '2026-10-30',
        downloadQuota: 10,
        photosDownloadedCount: 4,
        allowDownloads: true,
        viewsCount: 142,
        downloadsCount: 38,
        shareToken: 'vogue-automne-2026',
        photos: [
          { id: 'p1', title: 'Look 01 - Robe Soie', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80', size: '14.2 MB' },
          { id: 'p2', title: 'Look 02 - Manteau Laine', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80', size: '18.6 MB' },
          { id: 'p3', title: 'Portrait Cadré', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80', size: '16.1 MB' },
          { id: 'p4', title: 'Accessoires Cuir', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&auto=format&fit=crop&q=80', size: '12.4 MB' }
        ]
      },
      {
        id: 'gal_02',
        title: 'Mariage Domaine de Chamarande',
        clientName: 'Élodie & Thomas Vasseur',
        clientEmail: 'elodie.vasseur@gmail.com',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        createdDate: '2026-08-15',
        expiryDate: '2026-11-15',
        downloadQuota: 20,
        photosDownloadedCount: 12,
        allowDownloads: true,
        viewsCount: 389,
        downloadsCount: 194,
        shareToken: 'elodie-thomas-mariage',
        photos: [
          { id: 'p6', title: 'Cérémonie Laïque', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80', size: '11.8 MB' },
          { id: 'p7', title: 'Échange des Alliances', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80', size: '13.5 MB' }
        ]
      },
      {
        id: 'gal_03',
        title: 'Campagne Visuelle Architecture Modernist',
        clientName: 'Cabinet Studio Archviz',
        clientEmail: 'projects@archviz-studio.com',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        createdDate: '2026-08-01',
        expiryDate: '2026-12-31',
        downloadQuota: 5,
        photosDownloadedCount: 2,
        allowDownloads: true,
        viewsCount: 88,
        downloadsCount: 15,
        shareToken: 'archviz-modernist-2026',
        photos: [
          { id: 'p9', title: 'Façade Extérieure Béton', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', size: '21.0 MB' },
          { id: 'p10', title: 'Salon Épuré', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', size: '19.4 MB' }
        ]
      }
    ],

    notifications: [
      {
        id: 'n1',
        type: 'download',
        title: 'Téléchargement de Galerie',
        message: 'Élodie Vasseur a téléchargé des photos de la galerie "Mariage Domaine de Chamarande".',
        timestamp: 'Il y a 15 minutes',
        read: false
      },
      {
        id: 'n2',
        type: 'dm',
        title: 'Nouveau message privé Pro',
        message: 'Camille Roche (Photographe Mode) vous a envoyé un message : "Bonjour Julien, es-tu disponible pour un shooting à Lyon ?"',
        timestamp: 'Il y a 2 heures',
        read: false
      },
      {
        id: 'n3',
        type: 'invoice',
        title: 'Facture Payée',
        message: 'La facture #KAP-2026-042 (3 180,00 €) a été réglée par Maison de Haute Couture Lumière.',
        timestamp: 'Hier à 14:30',
        read: true
      }
    ],

    invoices: [
      {
        id: 'inv_01',
        number: 'KAP-2026-042',
        clientName: 'Maison de Haute Couture Lumière',
        clientEmail: 'contact@lumiere-paris.fr',
        issueDate: '2026-08-20',
        dueDate: '2026-09-20',
        status: 'Paid',
        items: [
          { description: 'Shooting Éditorial Mode (1 journée)', qty: 1, unitPrice: 1500.00 },
          { description: 'Retouche & Post-production (15 visuels HD)', qty: 15, unitPrice: 50.00 },
          { description: 'Cession de droits de diffusion Web & Presse', qty: 1, unitPrice: 400.00 }
        ],
        subtotal: 2650.00,
        tax: 530.00,
        total: 3180.00
      },
      {
        id: 'inv_02',
        number: 'KAP-2026-043',
        clientName: 'Élodie & Thomas Vasseur',
        clientEmail: 'elodie.vasseur@gmail.com',
        issueDate: '2026-08-16',
        dueDate: '2026-09-16',
        status: 'Pending',
        items: [
          { description: 'Prestation Photographie Mariage Complète', qty: 1, unitPrice: 2200.00 },
          { description: 'Livre Photo Prestige 30x30cm', qty: 1, unitPrice: 350.00 }
        ],
        subtotal: 2550.00,
        tax: 0.00,
        total: 2550.00
      }
    ],

    conversations: [
      {
        id: 'conv_1',
        otherPro: {
          id: 'pro_201',
          name: 'Camille Roche',
          role: 'Photographe Mode & Éditorial',
          specialty: 'Shooting Lookbook & Campagnes',
          city: 'Lyon',
          country: 'France',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isPro: true
        },
        lastMessage: 'Bonjour Julien, es-tu disponible pour un shooting de marque à Lyon ?',
        lastTimestamp: '14:20',
        unread: true,
        messages: [
          { id: 'm1', sender: 'them', text: 'Bonjour Julien ! J\'admire beaucoup tes travaux de lumière sur la galerie Vogue.', timestamp: '14:15' },
          { id: 'm2', sender: 'them', text: 'Je prépare la direction artistique d\'une marque d\'horlogerie haut de gamme à Lyon. Es-tu disponible fin septembre pour un shooting produit & porté ?', timestamp: '14:20' }
        ]
      },
      {
        id: 'conv_2',
        otherPro: {
          id: 'pro_202',
          name: 'Marc-Antoine Duprès',
          role: 'Photographe d\'Architecture',
          specialty: 'Architecture & Design Intérieur',
          city: 'Bruxelles',
          country: 'Belgique',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isPro: true
        },
        lastMessage: 'Merci pour la recommandation du Profoto, c\'est parfait pour les intérieurs !',
        lastTimestamp: 'Hier',
        unread: false,
        messages: [
          { id: 'm3', sender: 'me', text: 'Salut Marc-Antoine, si tu cherches une torche légère pour voyager sur Bruxelles, teste la B10X.', timestamp: 'Hier 11:00' },
          { id: 'm4', sender: 'them', text: 'Merci pour la recommandation du Profoto, c\'est parfait pour les intérieurs !', timestamp: 'Hier 16:45' }
        ]
      }
    ],

    prosDirectory: [
      {
        id: 'pro_101',
        name: 'Julien Mercer',
        role: 'Photographe Studio',
        specialty: 'Portrait & Mode',
        city: 'Paris',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        bio: 'Portraits éditoriaux & campagnes de mode pour marques internationales.',
        cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
        instagram: 'julienmercer_studio',
        whatsapp: '+33612345678',
        portfolio: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'pro_201',
        name: 'Camille Roche',
        role: 'Photographe Mode',
        specialty: 'Shooting Lookbook & Mode',
        city: 'Lyon',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        bio: 'Création d\'identités visuelles luxe, direction artistique & design d\'expérience.',
        cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
        instagram: 'camille_roche_da',
        whatsapp: '+33698765432',
        portfolio: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'pro_202',
        name: 'Marc-Antoine Duprès',
        role: 'Photographe Architecture',
        specialty: 'Immobilier & Intérieurs',
        city: 'Bruxelles',
        country: 'Belgique',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        bio: 'Photographie d\'espaces contemporains, résidences d\'architectes et hôtels de prestige.',
        cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        instagram: 'marcantoine_archi',
        whatsapp: '+32470123456',
        portfolio: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'pro_203',
        name: 'Sophie Moreau',
        role: 'Photographe Événementiel',
        specialty: 'Mariages & Événements Corporate',
        city: 'Marseille',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        bio: 'Design de livres d\'art, catalogues d\'exposition et packaging haut de gamme.',
        cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
        instagram: 'sophiemoreau_design',
        whatsapp: '+33655443322',
        portfolio: [
          'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'pro_204',
        name: 'Alexandre Fontaine',
        role: 'Photographe Culinaire',
        specialty: 'Gastronomie & Hospitality',
        city: 'Genève',
        country: 'Suisse',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        bio: 'Mise en lumière des créations de chefs étoilés et domaines viticoles.',
        cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        instagram: 'alex_fontaine_food',
        whatsapp: '+41791234567',
        portfolio: [
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
        ]
      }
    ]
  };

  // STORE MANAGER
  class Store {
    constructor() {
      this.state = this.loadState();
      this.listeners = [];
    }

    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const state = JSON.parse(saved);
          if (state.currentUser) {
            state.currentUser = {
              phone: '+33 6 12 34 56 78',
              whatsapp: '+33612345678',
              instagram: 'julienmercer_studio',
              portfolio: defaultState.currentUser.portfolio,
              ...state.currentUser
            };
            if (!state.currentUser.whatsapp) state.currentUser.whatsapp = state.currentUser.phone || '+33612345678';
            if (!state.currentUser.instagram) state.currentUser.instagram = 'julienmercer_studio';
            if (!Array.isArray(state.currentUser.portfolio) || state.currentUser.portfolio.length === 0) {
              state.currentUser.portfolio = defaultState.currentUser.portfolio;
            }
          }
          if (Array.isArray(state.prosDirectory)) {
            state.prosDirectory = state.prosDirectory.map(p => {
              const def = defaultState.prosDirectory.find(dp => dp.id === p.id) || {};
              const phone = p.phone || def.phone || '+33 6 12 34 56 78';
              const whatsapp = p.whatsapp || def.whatsapp || phone.replace(/[^0-9]/g, '');
              const instagram = p.instagram || def.instagram || 'kaptur_studio';
              const portfolio = Array.isArray(p.portfolio) && p.portfolio.length > 0
                ? p.portfolio.slice(0, 3)
                : (def.portfolio || defaultState.currentUser.portfolio);
              return { ...def, ...p, phone, whatsapp, instagram, portfolio };
            });
          }
          return state;
        }
      } catch (e) {
        console.warn('Failed to load state', e);
      }
      return JSON.parse(JSON.stringify(defaultState));
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('Failed to save state', e);
      }
      this.notifyListeners();
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notifyListeners() {
      this.listeners.forEach(listener => listener(this.state));
    }

    getUser() { return this.state.currentUser; }
    
    updateProfile(data) {
      this.state.currentUser = { ...this.state.currentUser, ...data };
      this.saveState();
    }

    togglePlan() {
      const current = this.state.currentUser.plan;
      this.state.currentUser.plan = current === 'Pro' ? 'Standard' : 'Pro';
      this.saveState();
      return this.state.currentUser.plan;
    }

    checkExpiredArchives() {
      const now = new Date();
      let stateChanged = false;
      this.state.galleries = (this.state.galleries || []).filter(g => {
        if (g.status === 'archived' && g.archivedDate) {
          const archiveTime = new Date(g.archivedDate).getTime();
          const diffDays = (now.getTime() - archiveTime) / (1000 * 3600 * 24);
          if (diffDays >= 15) {
            stateChanged = true;
            this.addNotification({
              type: 'system',
              title: 'Galerie Supprimée (15 jours d\'archivage)',
              message: `La galerie "${g.title}" archivée depuis plus de 15 jours a été supprimée automatiquement et définitivement.`
            });
            return false;
          }
        }
        return true;
      });
      if (stateChanged) this.saveState();
    }

    getDaysRemainingInArchive(archivedDate) {
      if (!archivedDate) return 15;
      const archiveTime = new Date(archivedDate).getTime();
      const now = new Date().getTime();
      const diffDays = (now - archiveTime) / (1000 * 3600 * 24);
      return Math.max(0, Math.ceil(15 - diffDays));
    }

    getGalleries() {
      this.checkExpiredArchives();
      return this.state.galleries;
    }

    getActiveGalleries() {
      this.checkExpiredArchives();
      return this.state.galleries.filter(g => g.status !== 'archived');
    }

    getArchivedGalleries() {
      this.checkExpiredArchives();
      return this.state.galleries.filter(g => g.status === 'archived');
    }

    getGalleryById(id) {
      this.checkExpiredArchives();
      return this.state.galleries.find(g => g.id === id);
    }

    getGalleryByToken(token) {
      this.checkExpiredArchives();
      return this.state.galleries.find(g => g.shareToken === token);
    }

    archiveGallery(id) {
      this.checkExpiredArchives();
      const archived = this.getArchivedGalleries();
      if (archived.length >= 2) {
        openCustomToast("Limite archivage atteinte ! Vous pouvez avoir au maximum 2 galeries archivées en même temps.", 'warning');
        return false;
      }
      const g = this.getGalleryById(id);
      if (g) {
        g.status = 'archived';
        g.archivedDate = new Date().toISOString();
        this.addNotification({
          type: 'system',
          title: 'Galerie Archivée',
          message: `La galerie "${g.title}" a été archivée (conservée 15 jours max). Une place active a été libérée.`
        });
        this.saveState();
        return true;
      }
      return false;
    }

    restoreGallery(id) {
      this.checkExpiredArchives();
      const user = this.getUser();
      const maxActive = user.plan === 'Pro' ? 6 : 4;
      const activeCount = this.getActiveGalleries().length;
      if (activeCount >= maxActive) {
        openCustomToast(`Limite de galeries actives atteinte (${maxActive} max pour votre formule ${user.plan}). Veuillez archiver ou supprimer une galerie active.`, 'warning');
        return false;
      }
      const g = this.getGalleryById(id);
      if (g) {
        g.status = 'active';
        delete g.archivedDate;
        this.addNotification({
          type: 'system',
          title: 'Galerie Restaurée',
          message: `La galerie "${g.title}" est de nouveau active.`
        });
        this.saveState();
        return true;
      }
      return false;
    }

    deleteGalleryPermanently(id) {
      const g = this.getGalleryById(id);
      if (g) {
        this.state.galleries = this.state.galleries.filter(item => item.id !== id);
        this.addNotification({
          type: 'system',
          title: 'Galerie Supprimée',
          message: `La galerie "${g.title}" a été supprimée définitivement.`
        });
        this.saveState();
        return true;
      }
      return false;
    }

    addPhotosToGallery(id, newPhotos) {
      const g = this.getGalleryById(id);
      if (g) {
        if (!Array.isArray(g.photos)) g.photos = [];
        g.photos.unshift(...newPhotos);
        if (newPhotos.length > 0 && newPhotos[0].url) {
          g.coverImage = newPhotos[0].url;
        }
        this.saveState();
        return true;
      }
      return false;
    }

    // Enforce Plan Active Gallery Limits (Standard = 4 max, Pro = 6 max)
    addGallery(gData) {
      this.checkExpiredArchives();
      const user = this.getUser();
      const activeCount = this.getActiveGalleries().length;
      const maxLimit = user.plan === 'Pro' ? 6 : 4;

      if (activeCount >= maxLimit) {
        openCustomToast(`Limite de galeries actives atteinte ! Votre formule ${user.plan} autorise jusqu'à ${maxLimit} galeries actives simultanément.`, 'warning');
        return null;
      }

      const newId = 'gal_' + Date.now();
      const newGal = {
        id: newId,
        title: gData.title || 'Nouvelle Galerie',
        clientName: gData.clientName || 'Client',
        clientEmail: gData.clientEmail || '',
        coverImage: gData.coverImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
        createdDate: new Date().toISOString().split('T')[0],
        expiryDate: gData.expiryDate || '2026-12-31',
        status: 'active',
        downloadQuota: parseInt(gData.downloadQuota) || 10,
        photosDownloadedCount: 0,
        allowDownloads: true,
        viewsCount: 0,
        downloadsCount: 0,
        shareToken: (gData.title || 'galerie').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random()*1000),
        photos: Array.isArray(gData.photos) ? gData.photos : []
      };
      this.state.galleries.unshift(newGal);
      this.addNotification({
        type: 'system',
        title: 'Galerie Publiée',
        message: `La galerie "${newGal.title}" a été créée.`
      });
      this.saveState();
      return newGal;
    }

    incrementGalleryView(id) {
      const g = this.getGalleryById(id);
      if (g) { g.viewsCount = (g.viewsCount || 0) + 1; this.saveState(); }
    }

    incrementGalleryDownload(id, count = 1) {
      const g = this.getGalleryById(id);
      if (g) {
        const currentDownloaded = g.photosDownloadedCount || 0;
        const quota = g.downloadQuota || 10;
        
        if (currentDownloaded >= quota) {
          openCustomToast(`Quota de téléchargement atteint ! Le photographe a autorisé un maximum de ${quota} téléchargement(s) pour cette galerie.`, 'warning');
          return false;
        }

        const allowedToDownload = Math.min(count, quota - currentDownloaded);
        g.photosDownloadedCount = currentDownloaded + allowedToDownload;
        g.downloadsCount = (g.downloadsCount || 0) + allowedToDownload;

        this.addNotification({
          type: 'download',
          title: 'Téléchargement Client',
          message: `${g.clientName} a téléchargé ${allowedToDownload} photo(s) HD. Quota client : ${g.photosDownloadedCount}/${g.downloadQuota}.`
        });
        this.saveState();
        return true;
      }
      return false;
    }

    getNotifications() { return this.state.notifications; }

    addNotification(notif) {
      this.state.notifications.unshift({
        id: 'n_' + Date.now(),
        type: notif.type || 'system',
        title: notif.title,
        message: notif.message,
        timestamp: 'À l\'instant',
        read: false
      });
      this.saveState();
    }

    markAllNotificationsRead() {
      this.state.notifications.forEach(n => n.read = true);
      this.saveState();
    }

    deleteNotification(id) {
      this.state.notifications = this.state.notifications.filter(n => n.id !== id);
      this.saveState();
    }

    deleteNotifications(ids) {
      const idSet = new Set(ids);
      this.state.notifications = this.state.notifications.filter(n => !idSet.has(n.id));
      this.saveState();
    }

    clearAllNotifications() {
      this.state.notifications = [];
      this.saveState();
    }

    getInvoices() { return this.state.invoices; }

    getInvoiceById(id) {
      return this.state.invoices.find(i => i.id === id);
    }

    deleteInvoice(id) {
      const inv = this.getInvoiceById(id);
      if (inv) {
        this.state.invoices = this.state.invoices.filter(i => i.id !== id);
        this.saveState();
        return true;
      }
      return false;
    }

    addInvoice(invData) {
      const totalAmount = parseFloat(invData.total) || 800;
      const newInv = {
        id: 'inv_' + Date.now(),
        number: 'KAP-2026-0' + (this.state.invoices.length + 44),
        clientName: invData.clientName || 'Client',
        clientEmail: invData.clientEmail || '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: invData.dueDate || new Date().toISOString().split('T')[0],
        status: 'Paid',
        description: invData.description || 'Prestation Photographique HD',
        items: invData.items || [{ description: invData.description || 'Prestation Photographique HD', qty: 1, unitPrice: totalAmount }],
        subtotal: totalAmount,
        tax: 0,
        total: totalAmount
      };
      this.state.invoices.unshift(newInv);
      this.addNotification({
        type: 'invoice',
        title: 'Facture Générée',
        message: `Facture ${newInv.number} pour ${newInv.clientName} (${newInv.total.toFixed(0)} €) émise.`
      });
      this.saveState();
      return newInv;
    }

    getConversations() {
      if (!Array.isArray(this.state.conversations) || this.state.conversations.length === 0) {
        this.state.conversations = [
          {
            id: 'conv_201',
            otherPro: {
              id: 'pro_201',
              name: 'Camille Roche',
              role: 'Photographe Mode',
              specialty: 'Shooting Lookbook & Mode',
              city: 'Lyon',
              country: 'France',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
              isPro: true,
              isOnline: true
            },
            lastMessage: 'Je suis disponible pour le shooting le mois prochain !',
            lastTimestamp: '10:42',
            unread: true,
            messages: [
              { id: 'm1', sender: 'them', text: 'Bonjour Julien, as-tu des dispos pour un projet à Lyon ?', timestamp: '10:30' },
              { id: 'm2', sender: 'me', text: 'Salut Camille ! Oui complètement, de quel type de shooting s\'agit-il ?', timestamp: '10:35' },
              { id: 'm3', sender: 'them', text: 'Je suis disponible pour le shooting le mois prochain !', timestamp: '10:42' }
            ]
          }
        ];
      }
      return this.state.conversations;
    }

    getOrCreateConversation(proOrId) {
      if (!Array.isArray(this.state.conversations)) {
        this.getConversations();
      }
      const pro = typeof proOrId === 'string' ? this.getProById(proOrId) : proOrId;
      if (!pro) return null;

      let conv = this.state.conversations.find(c => c && c.otherPro && c.otherPro.id === pro.id);
      if (!conv) {
        conv = {
          id: 'conv_' + Date.now(),
          otherPro: {
            id: pro.id,
            name: pro.name,
            role: pro.role,
            specialty: pro.specialty || pro.role,
            city: pro.city,
            country: pro.country || 'France',
            avatar: pro.avatar,
            isPro: pro.isPro !== false,
            isOnline: true
          },
          lastMessage: 'Aucun message',
          lastTimestamp: 'À l\'instant',
          unread: false,
          messages: []
        };
        this.state.conversations.unshift(conv);
        this.saveState();
      }
      return conv;
    }

    deleteConversation(convId) {
      if (!Array.isArray(this.state.conversations)) return false;
      const initialLength = this.state.conversations.length;
      this.state.conversations = this.state.conversations.filter(c => c.id !== convId);
      if (this.state.conversations.length < initialLength) {
        this.saveState();
        return true;
      }
      return false;
    }

    sendMessage(convId, text) {
      const conv = this.state.conversations.find(c => c.id === convId);
      if (conv) {
        const msg = {
          id: 'm_' + Date.now(),
          sender: 'me',
          text: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        conv.messages.push(msg);
        conv.lastMessage = text;
        conv.lastTimestamp = msg.timestamp;
        this.saveState();
        return msg;
      }
    }

    editMessage(convId, messageId, newText) {
      const conv = this.state.conversations.find(c => c.id === convId);
      if (conv && Array.isArray(conv.messages)) {
        const msg = conv.messages.find(m => m.id === messageId);
        if (msg) {
          msg.text = newText;
          msg.isEdited = true;
          conv.lastMessage = newText;
          this.saveState();
          return true;
        }
      }
      return false;
    }

    deleteMessage(convId, messageId) {
      const conv = this.state.conversations.find(c => c.id === convId);
      if (conv && Array.isArray(conv.messages)) {
        conv.messages = conv.messages.filter(m => m.id !== messageId);
        const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : 'Aucun message';
        conv.lastMessage = lastMsg;
        this.saveState();
        return true;
      }
      return false;
    }

    // ONLY PRO SUBSCRIBERS APPEAR IN THE ANNUAIRE DIRECTORY!
    getPros(query = '', cityFilter = '') {
      return this.state.prosDirectory.filter(pro => {
        if (!pro.isPro) return false;
        const matchQ = !query || pro.name.toLowerCase().includes(query.toLowerCase()) || pro.specialty.toLowerCase().includes(query.toLowerCase()) || pro.role.toLowerCase().includes(query.toLowerCase());
        const matchC = !cityFilter || pro.city.toLowerCase().includes(cityFilter.toLowerCase());
        return matchQ && matchC;
      });
    }

    getProById(id) {
      return this.state.prosDirectory.find(p => p.id === id);
    }

    resetDemoState() {
      localStorage.removeItem(STORAGE_KEY);
      this.state = JSON.parse(JSON.stringify(defaultState));
      this.saveState();
    }
  }

  const store = new Store();

  // Helper Modal: Custom Styled Edit Message Modal
  function openEditMsgModal(currentText, onSave) {
    let modal = document.getElementById('edit-msg-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-msg-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card max-w-md bg-[#121824] border border-white/20 p-6 text-left space-y-4 shadow-2xl rounded-2xl animate-fade-in">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </div>
            <h3 class="text-base font-bold text-white">Modifier le message</h3>
          </div>
          <button id="btn-close-edit-msg" class="btn-icon btn-ghost text-slate-400 hover:text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>

        <div class="space-y-2">
          <label class="text-xs text-slate-400">Corrigez votre texte ci-dessous :</label>
          <textarea id="edit-msg-textarea" class="form-input w-full min-h-[90px] text-sm leading-relaxed p-3 resize-none bg-slate-900 border-white/15" placeholder="Votre message...">${currentText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button id="btn-cancel-edit-msg" class="btn btn-secondary py-2 text-xs">Annuler</button>
          <button id="btn-save-edit-msg" class="btn btn-primary py-2 text-xs font-semibold">Enregistrer les modifications</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const textarea = modal.querySelector('#edit-msg-textarea');
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#btn-close-edit-msg').addEventListener('click', closeModal);
    modal.querySelector('#btn-cancel-edit-msg').addEventListener('click', closeModal);
    modal.querySelector('#btn-save-edit-msg').addEventListener('click', () => {
      const val = textarea ? textarea.value.trim() : '';
      if (val && val !== currentText) {
        closeModal();
        onSave(val);
      } else {
        closeModal();
      }
    });
  }

  // Helper Modal: Custom Styled Delete Individual Message Confirmation Modal
  function openDeleteMsgModal(onConfirm) {
    let modal = document.getElementById('delete-msg-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-msg-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card max-w-sm bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <i data-lucide="trash-2" class="w-7 h-7"></i>
        </div>

        <div class="space-y-1.5">
          <h3 class="text-lg font-extrabold text-white">Supprimer ce message ?</h3>
          <p class="text-xs text-slate-300">Voulez-vous vraiment supprimer ce message de la discussion ?</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button id="btn-cancel-del-msg" class="btn btn-secondary flex-1 py-2 text-xs">Annuler</button>
          <button id="btn-confirm-del-msg" class="btn bg-red-500 hover:bg-red-600 text-white flex-1 py-2 text-xs font-semibold rounded-xl transition-colors">Supprimer</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#btn-cancel-del-msg').addEventListener('click', closeModal);
    modal.querySelector('#btn-confirm-del-msg').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // Helper Modal: Custom Styled Delete Gallery Confirmation Modal
  function openDeleteGalleryModal(gallery, onConfirm) {
    let modal = document.getElementById('delete-gallery-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-gallery-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const titleStr = gallery ? gallery.title : 'cette galerie';

    modal.innerHTML = `
      <div class="modal-card max-w-md bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in relative">
        <button id="btn-close-del-gal-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Fermer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30 shadow-lg shadow-red-500/10">
          <i data-lucide="trash-2" class="w-8 h-8"></i>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-extrabold text-white">Supprimer la galerie ?</h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement la galerie <strong class="text-white font-semibold px-2 py-0.5 rounded bg-slate-900 border border-white/10">"${titleStr}"</strong> ?
          </p>
        </div>

        <div class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 text-left flex items-start gap-3">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400 shrink-0 mt-0.5"></i>
          <span>Ses fichiers associés et ses accès clients seront effacés. <strong>Cette action est irréversible.</strong></span>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button id="btn-cancel-del-gal-modal" class="btn btn-secondary flex-1 py-2.5 text-xs font-semibold rounded-xl">Annuler</button>
          <button id="btn-confirm-del-gal-modal" class="btn bg-red-600 hover:bg-red-500 active:bg-red-700 text-white flex-1 py-2.5 text-xs font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span>Supprimer définitivement</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);

    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.querySelector('#btn-close-del-gal-modal').onclick = closeModal;
    modal.querySelector('#btn-cancel-del-gal-modal').onclick = closeModal;
    modal.querySelector('#btn-confirm-del-gal-modal').onclick = () => {
      closeModal();
      if (onConfirm) onConfirm();
    };
  }

  // Helper Modal: Generic Custom Styled Confirmation Modal
  function openConfirmModal({ title, message, confirmText = 'Confirmer', cancelText = 'Annuler', isDanger = false, icon = 'help-circle', onConfirm }) {
    let modal = document.getElementById('generic-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'generic-confirm-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const iconBg = isDanger ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    const confirmBtnBg = isDanger ? 'bg-red-600 hover:bg-red-500 active:bg-red-700' : 'btn-primary';

    modal.innerHTML = `
      <div class="modal-card max-w-md bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in relative">
        <button id="btn-close-generic-confirm" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Fermer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mx-auto border shadow-lg">
          <i data-lucide="${icon}" class="w-7 h-7"></i>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-extrabold text-white">${title}</h3>
          <p class="text-sm text-slate-300 leading-relaxed">${message}</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button id="btn-cancel-generic-confirm" class="btn btn-secondary flex-1 py-2.5 text-xs font-semibold rounded-xl">${cancelText}</button>
          <button id="btn-ok-generic-confirm" class="btn ${confirmBtnBg} text-white flex-1 py-2.5 text-xs font-bold rounded-xl shadow-lg transition-all">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);

    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    modal.querySelector('#btn-close-generic-confirm').onclick = closeModal;
    modal.querySelector('#btn-cancel-generic-confirm').onclick = closeModal;
    modal.querySelector('#btn-ok-generic-confirm').onclick = () => {
      closeModal();
      if (onConfirm) onConfirm();
    };
  }

  // Helper: Canvas Image Compressor for LocalStorage Safety
  function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("Aucun fichier fourni"));
      if (file.size <= 300 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        const fallbackReader = new FileReader();
        fallbackReader.onload = (e) => resolve(e.target.result);
        fallbackReader.onerror = (err) => reject(err);
        fallbackReader.readAsDataURL(file);
      };
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => resolve(e.target.result);
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (err) {
            resolve(e.target.result);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Helper Toast Notification System
  function openToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[120] flex flex-col gap-3 pointer-events-none max-w-sm w-auto';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'danger' || type === 'error'
      ? 'bg-[#1C1217] border-red-500/40 text-red-200'
      : type === 'warning'
      ? 'bg-[#1C1810] border-amber-500/40 text-amber-200'
      : 'bg-[#0F1C17] border-emerald-500/40 text-emerald-200';

    const iconName = type === 'danger' || type === 'error'
      ? 'alert-circle'
      : type === 'warning'
      ? 'alert-triangle'
      : 'check-circle-2';

    const iconColor = type === 'danger' || type === 'error'
      ? 'text-red-400'
      : type === 'warning'
      ? 'text-amber-400'
      : 'text-emerald-400';

    toast.className = `pointer-events-auto border ${bgClass} p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-slide-up transition-all duration-300`;

    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor} shrink-0"></i>
        <span class="text-xs font-semibold leading-snug">${message}</span>
      </div>
      <button class="toast-close text-slate-400 hover:text-white p-1 shrink-0"><i data-lucide="x" class="w-4 h-4"></i></button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').onclick = removeToast;
    setTimeout(removeToast, duration);
  }

  // Helper Modal: Custom Styled Share Link Modal (Replaces browser alert popup when creating gallery or sharing link)
  function openShareModal({ title = 'Galerie créée avec succès !', subtitle = 'Le lien client a été copié dans votre presse-papier.', url, shareToken }) {
    let modal = document.getElementById('share-client-link-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'share-client-link-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const tokenParam = shareToken || (url && url.includes('token=') ? url.split('token=')[1] : '');

    modal.innerHTML = `
      <div class="modal-card max-w-lg bg-[#121824] border border-white/20 p-6 text-center space-y-6 shadow-2xl rounded-2xl animate-fade-in relative">
        <button id="btn-close-share-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Fermer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <i data-lucide="sparkles" class="w-8 h-8"></i>
        </div>

        <div class="space-y-1.5">
          <h3 class="text-xl font-extrabold text-white">${title}</h3>
          <p class="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">${subtitle}</p>
        </div>

        <!-- Copy Input Group -->
        <div class="space-y-2 text-left bg-slate-900/80 p-4 rounded-xl border border-white/10">
          <label class="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <i data-lucide="link" class="w-3.5 h-3.5 text-sky-400"></i>
            <span>Lien d'accès Client (Sécurisé)</span>
          </label>
          <div class="flex items-center gap-2">
            <input type="text" id="share-modal-url-input" readonly value="${url}" class="form-input text-xs font-mono bg-slate-950 border border-white/15 text-sky-300 font-medium flex-1 rounded-xl p-2.5 selection:bg-sky-500/30">
            <button id="btn-modal-copy-link" class="btn btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-md shadow-sky-500/20">
              <i data-lucide="copy" class="w-4 h-4"></i>
              <span id="btn-modal-copy-label">Copier</span>
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          ${tokenParam ? `
            <a href="#client-portal?token=${tokenParam}" id="btn-modal-test-portal" class="btn btn-secondary w-full sm:flex-1 py-2.5 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="external-link" class="w-4 h-4"></i>
              <span>Tester l'Espace Client</span>
            </a>
          ` : ''}
          <button id="btn-modal-done" class="btn btn-primary w-full sm:flex-1 py-2.5 text-xs font-bold rounded-xl">
            Terminer
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const input = modal.querySelector('#share-modal-url-input');
    const copyBtn = modal.querySelector('#btn-modal-copy-link');
    const copyLabel = modal.querySelector('#btn-modal-copy-label');

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(url);
      if (input) input.select();
      copyBtn.className = 'btn bg-emerald-500 text-white text-xs px-4 py-2.5 font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-md';
      copyLabel.textContent = 'Copié !';
      openToast('✨ Lien client copié dans le presse-papier !', 'success');
      setTimeout(() => {
        copyBtn.className = 'btn btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-md shadow-sky-500/20';
        copyLabel.textContent = 'Copier';
      }, 3000);
    };

    const closeModal = () => modal.classList.add('hidden');
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    modal.querySelector('#btn-close-share-modal').onclick = closeModal;
    modal.querySelector('#btn-modal-done').onclick = closeModal;

    const testBtn = modal.querySelector('#btn-modal-test-portal');
    if (testBtn) {
      testBtn.onclick = () => closeModal();
    }
  }

  // Helper Modal: Custom Styled Alert Modal (Replaces native browser alert for limits & info)
  function openAlertModal({ title = 'Attention', message = '', icon = 'alert-triangle', isDanger = false }) {
    let modal = document.getElementById('generic-alert-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'generic-alert-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const iconBg = isDanger ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

    modal.innerHTML = `
      <div class="modal-card max-w-md bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in relative">
        <button id="btn-close-alert-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Fermer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mx-auto border shadow-lg">
          <i data-lucide="${icon}" class="w-8 h-8"></i>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-extrabold text-white">${title}</h3>
          <p class="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">${message}</p>
        </div>

        <div class="pt-2">
          <button id="btn-ok-alert-modal" class="btn btn-primary w-full py-2.5 text-xs font-bold rounded-xl">
            Compris
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    modal.querySelector('#btn-close-alert-modal').onclick = closeModal;
    modal.querySelector('#btn-ok-alert-modal').onclick = closeModal;
  }

  window.openDeleteGalleryModal = openDeleteGalleryModal;
  window.openConfirmModal = openConfirmModal;
  window.openToast = openToast;
  window.openCustomToast = openToast;
  window.openShareModal = openShareModal;
  window.openAlertModal = openAlertModal;
  window.compressImageFile = compressImageFile;

  // Floating Context Menu for Messages (Right-click desktop / Long press mobile)
  function openMsgContextMenu(x, y, msg, convId, refreshCallback) {
    let menu = document.getElementById('msg-context-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'msg-context-menu';
      menu.className = 'fixed z-50 bg-[#1A2232] border border-white/20 rounded-xl p-1.5 shadow-2xl space-y-1 min-w-[160px] animate-fade-in hidden';
      document.body.appendChild(menu);
    }

    const isMe = msg.sender === 'me';

    menu.innerHTML = `
      <button type="button" id="ctx-copy-msg" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 transition-colors text-left font-medium text-xs">
        <i data-lucide="copy" class="w-4 h-4 text-sky-400"></i> Copier le texte
      </button>
      ${isMe ? `
        <button type="button" id="ctx-edit-msg" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 transition-colors text-left font-medium text-xs">
          <i data-lucide="pencil" class="w-4 h-4 text-amber-400"></i> Modifier le message
        </button>
      ` : ''}
      <button type="button" id="ctx-del-msg" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors text-left font-medium text-xs">
        <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i> Supprimer
      </button>
    `;

    menu.style.left = `${Math.min(x, window.innerWidth - 180)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - 150)}px`;
    menu.classList.remove('hidden');

    if (window.lucide) window.lucide.createIcons();

    const hideMenu = () => menu.classList.add('hidden');

    const onOutsideClick = (e) => {
      if (!menu.contains(e.target)) {
        hideMenu();
        document.removeEventListener('click', onOutsideClick);
        document.removeEventListener('contextmenu', onOutsideClick);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', onOutsideClick);
      document.addEventListener('contextmenu', onOutsideClick);
    }, 10);

    menu.querySelector('#ctx-copy-msg').addEventListener('click', () => {
      hideMenu();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(msg.text);
        openCustomToast('✨ Message copié dans le presse-papier !', 'success');
      }
    });

    const btnEdit = menu.querySelector('#ctx-edit-msg');
    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        hideMenu();
        openEditMsgModal(msg.text, (newText) => {
          store.editMessage(convId, msg.id, newText);
          refreshCallback();
        });
      });
    }

    const btnDel = menu.querySelector('#ctx-del-msg');
    if (btnDel) {
      btnDel.addEventListener('click', () => {
        hideMenu();
        openDeleteMsgModal(() => {
          store.deleteMessage(convId, msg.id);
          refreshCallback();
        });
      });
    }
  }

  // Helper Modal: Custom Styled Delete Conversation Confirmation Modal
  function openDeleteConvModal(name, onConfirm) {
    let modal = document.getElementById('delete-conv-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-conv-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card max-w-sm bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <i data-lucide="trash-2" class="w-7 h-7"></i>
        </div>

        <div class="space-y-1.5">
          <h3 class="text-lg font-extrabold text-white">Supprimer la discussion ?</h3>
          <p class="text-xs text-slate-300">Voulez-vous vraiment supprimer la discussion avec <span class="font-bold text-white">${name}</span> ? Cette action est définitive.</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button id="btn-cancel-del-conv" class="btn btn-secondary flex-1 py-2 text-xs">Annuler</button>
          <button id="btn-confirm-del-conv" class="btn bg-red-500 hover:bg-red-600 text-white flex-1 py-2 text-xs font-semibold rounded-xl transition-colors">Supprimer</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#btn-cancel-del-conv').addEventListener('click', closeModal);
    modal.querySelector('#btn-confirm-del-conv').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // Helper Modal: Public Pro Profile Drawer / Modal
  function openPublicProModal(pro) {
    let modal = document.getElementById('public-pro-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'public-pro-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const instaHandle = (pro.instagram || (pro.name ? pro.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_photo' : 'julienmercer_studio')).replace(/^@/, '');
    const waNumber = (pro.whatsapp || pro.phone || '+33612345678').replace(/[^0-9]/g, '');
    const phoneDisplay = pro.phone || pro.whatsapp || '+33 6 12 34 56 78';
    const portfolioPhotos = (pro.portfolio && pro.portfolio.length > 0) ? pro.portfolio.slice(0, 3) : [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
    ];

    modal.innerHTML = `
      <div class="modal-card max-w-2xl bg-[#121824] border border-white/20 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div class="flex items-center gap-2">
            <span class="badge badge-pro">PRO VÉRIFIÉ</span>
            <span class="text-xs text-slate-400 font-mono">${pro.city}, ${pro.country}</span>
          </div>
          <button id="close-public-pro-modal" class="btn-icon btn-ghost text-slate-400 hover:text-white">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img src="${pro.avatar}" alt="${pro.name}" class="avatar avatar-xl border-2 border-sky-400 flex-shrink-0">
          <div class="text-center sm:text-left space-y-2 w-full">
            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-white">${pro.name}</h2>
              <p class="text-xs sm:text-sm font-semibold text-sky-400 mt-0.5">${pro.role} • ${pro.specialty}</p>
            </div>

            <!-- Compact Direct Contact Buttons & Phone Badge Row -->
            <div class="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>${phoneDisplay}</span>
              </span>

              <a href="https://wa.me/${waNumber}" target="_blank" class="btn btn-sm bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>WhatsApp</span>
              </a>

              <a href="https://instagram.com/${instaHandle}" target="_blank" class="btn btn-sm bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 border border-pink-500/40 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap">
                <i data-lucide="instagram" class="w-3.5 h-3.5"></i>
                <span>Instagram</span>
              </a>
            </div>

            <p class="text-xs text-slate-400 pt-1 line-clamp-2">${pro.bio}</p>
          </div>
        </div>

        <!-- Portfolio Preview (Max 3 Photos - Clickable Lightbox) -->
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Aperçu des travaux récents</span>
            <span class="text-xs text-slate-500 font-normal">(Cliquez sur une photo pour l'agrandir)</span>
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${portfolioPhotos.slice(0, 3).map((img, idx) => `
              <div class="group relative rounded-xl overflow-hidden aspect-[4/3] border border-white/10 shadow-md cursor-pointer hover:border-sky-400/80 transition-all btn-zoom-portfolio-img" data-index="${idx}">
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

        <div class="flex justify-end items-center gap-3 pt-4 border-t border-white/10">
          <button id="close-public-pro-modal-2" class="btn btn-secondary w-full sm:w-auto">Fermer la fiche</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#close-public-pro-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-public-pro-modal-2').addEventListener('click', closeModal);

    // Bind image lightbox zoom listeners (Full Gallery Carousel)
    modal.querySelectorAll('.btn-zoom-portfolio-img').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        openImageLightboxModal(portfolioPhotos.slice(0, 3), idx, pro.name);
      });
    });
  }

  // Universal Image Lightbox Modal Helper with Gallery Carousel Navigation & Perfect Centering
  function openImageLightboxModal(images, startIndex = 0, authorName = '') {
    const list = Array.isArray(images) ? images : [images];
    let currentIndex = (typeof startIndex === 'number' && startIndex >= 0 && startIndex < list.length) ? startIndex : 0;

    let modal = document.getElementById('image-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-lightbox-modal';
      document.body.appendChild(modal);
    }
    modal.className = 'fixed inset-0 bg-black/92 backdrop-blur-md hidden p-4 sm:p-6 flex flex-col items-center justify-center select-none';
    modal.style.zIndex = '999999';

    const render = () => {
      const currentUrl = list[currentIndex] || '';
      const total = list.length;

      modal.innerHTML = `
        <div class="relative flex flex-col items-center justify-center w-full max-w-5xl h-full max-h-[92vh] space-y-3 pointer-events-auto mx-auto my-auto" style="z-index: 9999999;">
          
          <!-- Image Frame Wrapper (Mathematical Flex Center for landscape & portrait) -->
          <div class="relative flex items-center justify-center max-h-[82vh] max-w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black mx-auto">
            
            <!-- Image -->
            <img src="${currentUrl}" class="max-h-[82vh] w-auto max-w-[88vw] object-contain block mx-auto my-auto transition-all duration-200">

            <!-- Close Button (Sits directly on the top-right corner of the photo box) -->
            <button id="close-lightbox-btn" class="absolute top-3 right-3 text-white bg-black/80 hover:bg-rose-600 border border-white/30 p-2.5 rounded-full shadow-2xl transition-all z-50 cursor-pointer flex items-center justify-center backdrop-blur-md group">
              <i data-lucide="x" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
            </button>

            <!-- Previous & Next Arrows (Floating directly on image left and right edges) -->
            ${total > 1 ? `
              <button id="lightbox-prev-btn" class="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/80 hover:bg-sky-500 border border-white/30 p-2.5 sm:p-3 rounded-full shadow-2xl transition-all cursor-pointer hover:scale-110 z-40 backdrop-blur-md">
                <i data-lucide="chevron-left" class="w-6 h-6"></i>
              </button>
              <button id="lightbox-next-btn" class="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/80 hover:bg-sky-500 border border-white/30 p-2.5 sm:p-3 rounded-full shadow-2xl transition-all cursor-pointer hover:scale-110 z-40 backdrop-blur-md">
                <i data-lucide="chevron-right" class="w-6 h-6"></i>
              </button>
            ` : ''}
          </div>

          <!-- Bottom Caption & Counter Badge (Centered) -->
          <div class="flex items-center justify-center gap-3 w-full px-2 mx-auto">
            <div class="text-slate-200 text-xs font-semibold bg-slate-900/90 px-4 py-1.5 rounded-full border border-white/15 shadow-xl flex items-center gap-2">
              <span class="text-sky-400 font-bold">${authorName ? authorName : 'Galerie'}</span>
              <span class="text-slate-500">•</span>
              <span class="font-mono text-emerald-400 font-bold">${currentIndex + 1} / ${total}</span>
            </div>

            ${total > 1 ? `
              <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
                <span class="text-[11px]">Flèches clavier</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">&larr;</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">&rarr;</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const closeModal = () => {
        modal.classList.add('hidden');
        document.removeEventListener('keydown', handleKeyDown);
      };

      modal.querySelector('#close-lightbox-btn').addEventListener('click', closeModal);

      if (total > 1) {
        modal.querySelector('#lightbox-prev-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + total) % total;
          render();
        });
        modal.querySelector('#lightbox-next-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % total;
          render();
        });
      }

      modal.onclick = (e) => {
        if (e.target === modal || e.target.id === 'image-lightbox-modal') closeModal();
      };
    };

    const handleKeyDown = (e) => {
      if (modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') {
        modal.classList.add('hidden');
        document.removeEventListener('keydown', handleKeyDown);
      } else if (e.key === 'ArrowLeft' && list.length > 1) {
        currentIndex = (currentIndex - 1 + list.length) % list.length;
        render();
      } else if (e.key === 'ArrowRight' && list.length > 1) {
        currentIndex = (currentIndex + 1) % list.length;
        render();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    render();
    modal.classList.remove('hidden');
  }
  window.openImageLightboxModal = openImageLightboxModal;

  // Directory List Modal for Landing Page Button Click
  function openDirectoryListModal() {
    let modal = document.getElementById('directory-list-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'directory-list-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const pros = store.getPros(); // Only Pro members

    modal.innerHTML = `
      <div class="modal-card max-w-4xl bg-[#121824] border border-white/20 p-8 space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge badge-pro">ANNUAIRE PRO VÉRIFIÉ</span>
              <span class="text-xs text-slate-400">Photographes professionnels disponibles</span>
            </div>
            <h3 class="text-xl font-bold text-white mt-1">Liste des Membres Pro</h3>
          </div>
          <button id="close-directory-list-modal" class="btn-icon btn-ghost text-slate-400 hover:text-white">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" id="modal-search-q" class="form-input text-xs" placeholder="Filtrer par nom ou spécialité...">
          <input type="text" id="modal-search-city" class="form-input text-xs" placeholder="Filtrer par ville (ex: Paris, Lyon)...">
        </div>

        <div id="directory-list-container" class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          ${pros.map(pro => `
            <div class="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-colors">
              <div class="flex items-center gap-4">
                <img src="${pro.avatar}" alt="${pro.name}" class="avatar avatar-lg border border-amber-500/40 flex-shrink-0">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-base text-white">${pro.name}</h4>
                    <span class="badge badge-pro">PRO</span>
                  </div>
                  <p class="text-xs text-sky-400 font-semibold">${pro.role} • ${pro.specialty}</p>
                  <p class="text-xs text-slate-400 mt-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline text-amber-400"></i> ${pro.city}, ${pro.country}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button class="btn btn-secondary btn-sm btn-open-pro-card" data-id="${pro.id}">
                  <i data-lucide="user" class="w-3.5 h-3.5"></i> Profil & Contacts
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end pt-4 border-t border-white/10">
          <button id="close-directory-list-modal-2" class="btn btn-secondary">Fermer</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#close-directory-list-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-directory-list-modal-2').addEventListener('click', closeModal);

    const inputQ = modal.querySelector('#modal-search-q');
    const inputC = modal.querySelector('#modal-search-city');
    const listContainer = modal.querySelector('#directory-list-container');

    const updateList = () => {
      const filtered = store.getPros(inputQ.value, inputC.value);
      listContainer.innerHTML = filtered.map(pro => `
        <div class="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-colors">
          <div class="flex items-center gap-4">
            <img src="${pro.avatar}" alt="${pro.name}" class="avatar avatar-lg border border-amber-500/40 flex-shrink-0">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-base text-white">${pro.name}</h4>
                <span class="badge badge-pro">PRO</span>
                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  En ligne
                </span>
              </div>
              <p class="text-xs text-sky-400 font-semibold">${pro.role} • ${pro.specialty}</p>
              <p class="text-xs text-slate-400 mt-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline text-amber-400"></i> ${pro.city}, ${pro.country}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm btn-open-pro-card" data-id="${pro.id}">
              <i data-lucide="user" class="w-3.5 h-3.5"></i> Profil & Contacts
            </button>
          </div>
        </div>
      `).join('');
      
      if (window.lucide) window.lucide.createIcons();

      listContainer.querySelectorAll('.btn-open-pro-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const pro = store.getProById(btn.getAttribute('data-id'));
          if (pro) openPublicProModal(pro);
        });
      });
    };

    inputQ.addEventListener('input', updateList);
    inputC.addEventListener('input', updateList);

    listContainer.querySelectorAll('.btn-open-pro-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const pro = store.getProById(btn.getAttribute('data-id'));
        if (pro) openPublicProModal(pro);
      });
    });
  }

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  // 1. LANDING VIEW
  function renderLandingView(container) {
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-xs font-semibold text-sky-400 mb-6">
          <span class="badge badge-pro">NOUVEAU</span>
          <span>Plateforme tout-en-un pour créateurs visuels</span>
        </div>

        <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-4 sm:mb-6 text-white">
          Sublimez la livraison de vos travaux & développez votre activité.
        </h1>

        <p class="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Kaptur permet aux <strong class="text-white">photographes professionnels</strong> de présenter leurs portfolios, partager des galeries clients sécurisées avec quotas de téléchargement, générer des factures et collaborer entre créateurs d'images.
        </p>

        <!-- Main CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
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
      <section id="features" class="py-12 sm:py-20 px-4 sm:px-6 bg-slate-900/50 border-y border-white/10">
        <div class="max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">Une suite d'outils essentielle et épurée.</h2>
            <p class="text-xs sm:text-sm text-slate-400">Concentrez-vous sur votre art, Kaptur s'occupe de la livraison, de l'administration et de votre réseau.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <!-- Card 1 -->
            <div class="card card-hover p-5 sm:p-8">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-5">
                <i data-lucide="image" class="w-6 h-6 sm:w-7 sm:h-7"></i>
              </div>
              <h3 class="text-lg sm:text-xl font-bold mb-2.5 text-white">Galeries Clients & Quotas</h3>
              <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Partagez vos photos HD via un lien direct sécurisé. Définissez le nombre maximum de téléchargements autorisés pour le client et suivez les vus en temps réel.</p>
            </div>

            <!-- Card 2 -->
            <div class="card card-hover p-5 sm:p-8">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                <i data-lucide="file-text" class="w-6 h-6 sm:w-7 sm:h-7"></i>
              </div>
              <h3 class="text-lg sm:text-xl font-bold mb-2.5 text-white">Facturation & Reçus Conformes</h3>
              <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Émettez des factures professionnelles avec calcul automatique de la TVA et suivi des règlements. Générez des reçus PDF prêts à être imprimés ou envoyés.</p>
            </div>

            <!-- Card 3 -->
            <div class="card card-hover p-5 sm:p-8 border-amber-500/30">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5">
                <i data-lucide="map-pin" class="w-6 h-6 sm:w-7 sm:h-7"></i>
              </div>
              <div class="flex items-center gap-2 mb-2.5">
                <h3 class="text-lg sm:text-xl font-bold text-white">Annuaire Géographique Pro</h3>
                <span class="badge badge-pro">PRO</span>
              </div>
              <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">Seuls les membres Pro sont référencés par ville et spécialité. Les clients et agences peuvent vous trouver et vous contacter directement via Instagram ou WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- PUBLIC ANNUAIRE CTA BANNER ON LANDING PAGE -->
      <section id="annuaire" class="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div class="card card-pro p-5 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-amber-500/40 bg-gradient-to-r from-slate-900 via-[#121824] to-amber-950/30">
          <div class="space-y-2.5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <i data-lucide="users" class="w-3.5 h-3.5"></i>
              <span>RÉSEAU EXCLUSIF PRO</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Consulter l'Annuaire des Créateurs</h2>
            <p class="text-slate-300 text-xs sm:text-sm max-w-xl">Accédez à la liste des photographes Pro disponibles par ville avec leurs coordonnées Instagram & WhatsApp directs.</p>
          </div>
          <button id="btn-open-directory-modal-2" class="btn btn-pro btn-lg w-full sm:w-auto flex-shrink-0">
            <i data-lucide="list"></i>
            <span>Voir la liste des professionnels</span>
          </button>
        </div>
      </section>

      <!-- PRICING SECTION -->
      <section id="pricing" class="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-b border-white/10">
        <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">Tarifs simples et transparents.</h2>
          <p class="text-xs sm:text-sm text-slate-400">Choisissez la formule adaptée à votre volume de travail.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <!-- Standard Plan -->
          <div class="card flex flex-col justify-between p-5 sm:p-8">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl sm:text-2xl font-bold text-white">Standard</h3>
                <span class="badge badge-subtle">Pour débuter</span>
              </div>
              <div class="text-3xl sm:text-4xl font-extrabold mb-6 text-white">2 000 FCFA <span class="text-xs sm:text-base font-normal text-slate-400">/ mois</span></div>
              <ul class="space-y-3 text-xs sm:text-sm mb-8 text-slate-300">
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4 shrink-0"></i> <strong>Jusqu'à 4 Galeries clients actives</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4 shrink-0"></i> <strong>Génération de liens directs & Définition du quota</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4 shrink-0"></i> Création de factures & reçus conformes</li>
                <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4 shrink-0"></i> Pas d'accès à la messagerie privée Pro</li>
                <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4 shrink-0"></i> Pas de référencement dans l'annuaire Pro</li>
              </ul>
            </div>
            <a href="#auth?tab=register&plan=Standard" class="btn btn-outline w-full text-center">Rejoindre en Standard</a>
          </div>

          <!-- Pro Plan -->
          <div class="card card-pro flex flex-col justify-between relative overflow-hidden p-5 sm:p-8 border-amber-500/40">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl sm:text-2xl font-bold text-amber-400">Offre Pro</h3>
                <span class="badge badge-pro">RECOMMANDÉ</span>
              </div>
              <div class="text-3xl sm:text-4xl font-extrabold mb-6 text-amber-400">3 000 FCFA <span class="text-xs sm:text-base font-normal text-slate-400">/ mois</span></div>
              <ul class="space-y-3 text-xs sm:text-sm mb-8 text-slate-200">
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4 shrink-0"></i> <strong>Jusqu'à 6 Galeries clients actives</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4 shrink-0"></i> <strong>Génération de liens directs & Quotas personnalisables</strong></li>
                <li class="flex items-center gap-3"><i data-lucide="check" class="text-amber-400 w-4 h-4 shrink-0"></i> Création de factures avec logo</li>
                <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4 shrink-0"></i> <strong>Messagerie Privée Communauté Pro</strong></li>
                <li class="flex items-center gap-3 font-semibold text-white"><i data-lucide="check" class="text-amber-400 w-4 h-4 shrink-0"></i> <strong>Visibilité Annuaire Géographique + Badge Pro</strong></li>
              </ul>
            </div>
            <a href="#auth?tab=register&plan=Pro" class="btn btn-pro w-full text-center">Devenir Membre Pro</a>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section id="faq" class="py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">Questions Fréquentes (FAQ)</h2>
          <p class="text-slate-400 text-xs sm:text-sm">Tout ce que vous devez savoir avant de commencer avec Kaptur.</p>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div class="card p-4 sm:p-6 cursor-pointer faq-item">
            <div class="flex items-center justify-between font-bold text-sm sm:text-base md:text-lg text-white gap-3">
              <span>1. Comment mon client accède-t-il à ses photos et au quota de téléchargement ?</span>
              <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon shrink-0"></i>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 mt-3 hidden faq-answer leading-relaxed">
              Lorsque vous créez une galerie, Kaptur génère un lien d'accès direct. Vous définissez le quota maximum de photos que votre client est autorisé à télécharger (ex: 10 photos). Le client clique sur son lien, consulte ses photos et les télécharge dans la limite de son quota.
            </div>
          </div>

          <div class="card p-4 sm:p-6 cursor-pointer faq-item">
            <div class="flex items-center justify-between font-bold text-sm sm:text-base md:text-lg text-white gap-3">
              <span>2. Qui peut apparaître dans l'annuaire géographique des créateurs ?</span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="badge badge-pro">PRO</span>
                <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon"></i>
              </div>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 mt-3 hidden faq-answer leading-relaxed">
              Seuls les professionnels abonnés à l'offre <strong>Pro</strong> apparaissent dans l'annuaire géographique. Les clients et agences à la recherche d'un photographe sur Dakar, Paris, Lyon ou Bruxelles peuvent consulter leur fiche et les contacter directement via Instagram ou WhatsApp.
            </div>
          </div>

          <div class="card p-4 sm:p-6 cursor-pointer faq-item">
            <div class="flex items-center justify-between font-bold text-sm sm:text-base md:text-lg text-white gap-3">
              <span>3. Quelle est la différence entre l'abonnement Standard et Pro ?</span>
              <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon shrink-0"></i>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 mt-3 hidden faq-answer leading-relaxed">
              L'offre Standard (2 000 FCFA/mois) autorise jusqu'à 4 galeries actives avec quotas et la création de factures. L'offre Pro (3 000 FCFA/mois) permet jusqu'à 6 galeries actives, la messagerie privée exclusive entre créateurs et le référencement dans l'annuaire géographique Pro.
            </div>
          </div>

          <div class="card p-4 sm:p-6 cursor-pointer faq-item">
            <div class="flex items-center justify-between font-bold text-sm sm:text-base md:text-lg text-white gap-3">
              <span>4. Mes clients doivent-ils créer un compte pour télécharger leurs photos ?</span>
              <i data-lucide="chevron-down" class="w-5 h-5 text-sky-400 transition-transform faq-icon shrink-0"></i>
            </div>
            <div class="text-xs sm:text-sm text-slate-400 mt-3 hidden faq-answer leading-relaxed">
              Non ! Aucun compte n'est requis pour vos clients. Ils ouvrent simplement le lien direct que vous leur fournissez et téléchargent leurs photos autorisées en un clic.
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-10 sm:py-12 px-4 sm:px-6 border-t border-white/10 bg-[#090D14] text-sm text-slate-400">
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

    // Bind Directory List Modal Buttons
    const btnDir1 = container.querySelector('#btn-open-directory-modal');
    const btnDir2 = container.querySelector('#btn-open-directory-modal-2');
    if (btnDir1) btnDir1.addEventListener('click', openDirectoryListModal);
    if (btnDir2) btnDir2.addEventListener('click', openDirectoryListModal);

    // Bind FAQ Accordion Clicks
    container.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        const isHidden = answer.classList.contains('hidden');
        if (isHidden) {
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          answer.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  // 2. AUTH VIEW
  function renderAuthView(container, params) {
    const isRegister = params.get('tab') === 'register';
    const prePlan = params.get('plan') || 'Pro';

    container.innerHTML = `
      <div class="min-h-[85vh] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
        <div class="card max-w-md w-full p-5 sm:p-8 bg-[#121824] border border-white/15 shadow-2xl">
          <div class="text-center mb-6 sm:mb-8">
            <a href="#landing" class="inline-flex items-center gap-2.5 mb-3">
              <div class="logo-icon bg-sky-400 text-slate-950 flex items-center justify-center rounded-lg font-bold text-lg sm:text-xl w-9 h-9 sm:w-10 sm:h-10">K</div>
              <span class="font-bold text-xl sm:text-2xl tracking-tight text-white">KAPTUR</span>
            </a>
            <p class="text-xs sm:text-sm text-slate-400">Accédez à votre espace professionnel Kaptur</p>
          </div>

          <div class="flex border-b border-white/10 mb-6 text-center font-semibold text-xs sm:text-sm">
            <button id="tab-btn-login" class="flex-1 py-3 border-b-2 ${!isRegister ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400'}">
              Connexion
            </button>
            <button id="tab-btn-register" class="flex-1 py-3 border-b-2 ${isRegister ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400'}">
              Créer un compte
            </button>
          </div>

          <form id="form-login" class="${isRegister ? 'hidden' : 'block'} space-y-4">
            <div class="form-group">
              <label class="form-label">Email ou téléphone</label>
              <input type="text" id="login-identifier" class="form-input" value="julien.mercer@kaptur.studio" placeholder="Adresse email ou n° de téléphone" required>
            </div>
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label">Mot de passe</label>
                <a href="javascript:void(0)" class="text-xs text-sky-400 hover:underline">Mot de passe oublié ?</a>
              </div>
              <input type="password" id="login-password" class="form-input" value="••••••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg mt-4">
              <i data-lucide="log-in"></i><span>Se connecter</span>
            </button>
          </form>

          <form id="form-register" class="${!isRegister ? 'hidden' : 'block'} space-y-4">
            <div class="form-group">
              <label class="form-label">Choix de l'abonnement</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="cursor-pointer">
                  <input type="radio" name="reg-plan" value="Standard" class="peer hidden" ${prePlan === 'Standard' ? 'checked' : ''}>
                  <div class="p-3 rounded-xl bg-slate-900 border border-white/10 peer-checked:border-sky-400 peer-checked:bg-sky-500/10 text-center transition-all">
                    <div class="font-bold text-sm text-white">Abonnement Standard</div>
                    <div class="text-xs text-slate-400 mt-0.5">2 000 FCFA / mois</div>
                  </div>
                </label>
                <label class="cursor-pointer">
                  <input type="radio" name="reg-plan" value="Pro" class="peer hidden" ${prePlan === 'Pro' || prePlan !== 'Standard' ? 'checked' : ''}>
                  <div class="p-3 rounded-xl bg-slate-900 border border-white/10 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 text-center transition-all">
                    <div class="font-bold text-sm text-amber-400">Abonnement Pro</div>
                    <div class="text-xs text-slate-400 mt-0.5">3 000 FCFA / mois</div>
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
              <input type="email" id="reg-email" class="form-input" placeholder="contact@studio.fr" required>
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
              <i data-lucide="user-plus"></i><span>Créer mon profil Kaptur</span>
            </button>
          </form>
        </div>
      </div>
    `;

    const tabL = container.querySelector('#tab-btn-login');
    const tabR = container.querySelector('#tab-btn-register');
    const formL = container.querySelector('#form-login');
    const formR = container.querySelector('#form-register');

    tabL.addEventListener('click', () => {
      tabL.className = 'flex-1 py-3 border-b-2 border-sky-400 text-sky-400 font-semibold text-sm';
      tabR.className = 'flex-1 py-3 border-b-2 border-transparent text-slate-400 font-semibold text-sm';
      formL.classList.remove('hidden'); formR.classList.add('hidden');
    });

    tabR.addEventListener('click', () => {
      tabR.className = 'flex-1 py-3 border-b-2 border-sky-400 text-sky-400 font-semibold text-sm';
      tabL.className = 'flex-1 py-3 border-b-2 border-transparent text-slate-400 font-semibold text-sm';
      formR.classList.remove('hidden'); formL.classList.add('hidden');
    });

    formL.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = container.querySelector('#login-identifier')?.value || '';
      if (val) {
        const isEmail = val.includes('@');
        store.updateProfile({ [isEmail ? 'email' : 'phone']: val, isLoggedIn: true });
      } else {
        store.updateProfile({ isLoggedIn: true });
      }
      router.navigate('dashboard');
    });

    formR.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedPlan = container.querySelector('input[name="reg-plan"]:checked')?.value || 'Pro';
      store.updateProfile({
        name: container.querySelector('#reg-name').value,
        role: 'Photographe',
        city: container.querySelector('#reg-city').value,
        email: container.querySelector('#reg-email').value,
        phone: container.querySelector('#reg-phone').value,
        plan: selectedPlan,
        isLoggedIn: true
      });
      router.navigate('dashboard');
    });
  }

  // 3. DASHBOARD VIEW
  function renderDashboardView(container) {
    const user = store.getUser();
    const galleries = store.getGalleries();
    const activeGalleries = store.getActiveGalleries ? store.getActiveGalleries() : galleries;
    const invoices = store.getInvoices();
    const notifs = store.getNotifications();
    const convs = store.getConversations();

    const totalDownloads = activeGalleries.reduce((acc, g) => acc + (g.downloadsCount || 0), 0);
    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const unreadDMs = convs.filter(c => c.unread).length;
    const maxGalleries = user.plan === 'Pro' ? 6 : 4;

    container.innerHTML = `
      <div class="page-container space-y-8">
        
        <!-- Welcome Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121824] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
          <div class="flex items-center gap-3 sm:gap-4">
            <img src="${user.avatar}" alt="${user.name}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-sky-500/50 shadow-md shrink-0">
            <div class="min-w-0">
              <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">Bonjour, ${user.name}</h1>
                <span class="badge ${user.plan === 'Pro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-white/10'} px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold">${user.plan}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">${user.role} • ${user.city}, ${user.country}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button id="btn-dash-new-gal" class="btn btn-primary w-full sm:w-auto text-xs sm:text-sm shadow-md hover:shadow-sky-500/20">
              <i data-lucide="plus-circle" class="w-4 h-4"></i><span>Nouvelle Galerie (${activeGalleries.length}/${maxGalleries})</span>
            </button>
            <a href="#invoices" class="btn btn-outline w-full sm:w-auto text-xs sm:text-sm border-white/15 text-slate-200 hover:bg-white/5">
              <i data-lucide="file-plus" class="w-4 h-4"></i><span>Créer Facture</span>
            </a>
          </div>
        </div>

        <!-- Key Analytics Metrics Grid (4 KPI Cards) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Metric 1: Active Galleries -->
          <div class="card p-4 sm:p-5 bg-[#121824] border border-white/10 rounded-2xl flex items-center gap-4 hover:border-sky-500/30 transition-all shadow-md">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
              <i data-lucide="image" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-extrabold text-white">${activeGalleries.length} / ${maxGalleries}</div>
              <div class="text-xs text-slate-400 font-medium">Galeries Actives</div>
            </div>
          </div>

          <!-- Metric 2: Total Client Downloads -->
          <div class="card p-4 sm:p-5 bg-[#121824] border border-white/10 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all shadow-md">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <i data-lucide="download" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-extrabold text-white">${totalDownloads}</div>
              <div class="text-xs text-slate-400 font-medium">Téléchargements HD</div>
            </div>
          </div>

          <!-- Metric 3: Total Invoiced Revenue -->
          <div class="card p-4 sm:p-5 bg-[#121824] border border-white/10 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all shadow-md">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
              <i data-lucide="credit-card" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-extrabold text-white">${totalRevenue.toFixed(2)} €</div>
              <div class="text-xs text-slate-400 font-medium">Volume Facturé</div>
            </div>
          </div>

          <!-- Metric 4: Unread Pro DMs -->
          <div class="card p-4 sm:p-5 bg-[#121824] border border-white/10 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-all shadow-md">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <i data-lucide="message-square" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-extrabold text-white">${unreadDMs}</div>
              <div class="text-xs text-slate-400 font-medium">Messages Pro Non-Lus</div>
            </div>
          </div>
        </div>

        <!-- Quick Navigation & Access Cards Section -->
        <div class="space-y-4">
          <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <i data-lucide="compass" class="w-5 h-5 text-sky-400"></i>
            <span>Accès Rapides & Modules</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <!-- Card 1: Galeries -->
            <a href="#galleries" class="card p-4 sm:p-5 bg-[#121824] border border-white/10 hover:border-sky-500/50 rounded-2xl flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <i data-lucide="grid" class="w-5 h-5"></i>
                </div>
                <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:bg-sky-500/10 transition-colors">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
              </div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base text-white group-hover:text-sky-400 transition-colors">Toutes les Galeries</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">Gérer vos collections, photos HD et liens de téléchargement client.</p>
              </div>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>${activeGalleries.length} galeries actives</span>
                <span class="text-sky-400 font-semibold group-hover:underline">Ouvrir →</span>
              </div>
            </a>

            <!-- Card 2: Factures -->
            <a href="#invoices" class="card p-4 sm:p-5 bg-[#121824] border border-white/10 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <i data-lucide="file-text" class="w-5 h-5"></i>
                </div>
                <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
              </div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base text-white group-hover:text-purple-400 transition-colors">Mes Factures</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">Générer, exporter en PDF et suivre vos règlements clients.</p>
              </div>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>${invoices.length} factures enregistrées</span>
                <span class="text-purple-400 font-semibold group-hover:underline">Ouvrir →</span>
              </div>
            </a>

            <!-- Card 3: Notifications -->
            <a href="#notifications" class="card p-4 sm:p-5 bg-[#121824] border border-white/10 hover:border-emerald-500/50 rounded-2xl flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <i data-lucide="bell" class="w-5 h-5"></i>
                </div>
                <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
              </div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors">Vos Notifications</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">Alertes en temps réel sur les téléchargements clients.</p>
              </div>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>${notifs.length} alertes en cours</span>
                <span class="text-emerald-400 font-semibold group-hover:underline">Ouvrir →</span>
              </div>
            </a>

            <!-- Card 4: Communauté Pro -->
            <a href="#community" class="card p-4 sm:p-5 bg-[#121824] border border-white/10 hover:border-amber-500/50 rounded-2xl flex flex-col justify-between space-y-4 group transition-all duration-200 hover:-translate-y-1 shadow-lg">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <i data-lucide="users" class="w-5 h-5"></i>
                </div>
                <div class="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
              </div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">Communauté Pro</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">Échanger avec les photographes et participer aux discussions.</p>
              </div>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>${convs.length} discussions</span>
                <span class="text-amber-400 font-semibold group-hover:underline">Ouvrir →</span>
              </div>
            </a>

          </div>
        </div>

        <!-- Subscription & Quota Status Bar -->
        <div class="card p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#121824] to-slate-900 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-white">Statut du compte : Formule ${user.plan}</h4>
              <p class="text-xs text-slate-400">Quota de galeries actives : <span class="text-sky-400 font-semibold">${activeGalleries.length}/${maxGalleries}</span> utilisées</p>
            </div>
          </div>
          <a href="#subscription" class="btn btn-secondary btn-sm text-xs px-4 py-2 font-semibold w-full sm:w-auto text-center">
            Gérer mon abonnement
          </a>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const btnNew = container.querySelector('#btn-dash-new-gal');
    if (btnNew) btnNew.addEventListener('click', () => router.navigate('galleries', { action: 'new' }));
  }

  // 4. GALLERIES VIEW
  function renderGalleriesView(container, params) {
    const user = store.getUser();
    const activeGalleries = store.getActiveGalleries();
    const archivedGalleries = store.getArchivedGalleries();
    const currentTab = params.get('tab') || 'active';
    const showModal = params.get('action') === 'new';
    const maxActive = user.plan === 'Pro' ? 6 : 4;

    container.innerHTML = `
      <div class="page-container space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Vos Galeries Clients</h1>
            <p class="text-sm text-slate-400">Gérez vos collections de photos. Quota simultané d'actives selon votre formule (${user.plan}).</p>
          </div>
          <button id="btn-open-new-gal" class="btn btn-primary">
            <i data-lucide="plus"></i><span>Créer une galerie</span>
          </button>
        </div>

        <!-- Quotas Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="card p-4 flex items-center justify-between border-sky-500/30 bg-sky-500/5">
            <div>
              <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Galeries Actives</div>
              <div class="text-2xl font-extrabold text-white mt-1">${activeGalleries.length} <span class="text-sm text-slate-400 font-normal">/ ${maxActive} max (${user.plan})</span></div>
            </div>
            <div class="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-xs">
              ${Math.max(0, maxActive - activeGalleries.length)} place(s) dispo
            </div>
          </div>
          <div class="card p-4 flex items-center justify-between border-amber-500/30 bg-amber-500/5">
            <div>
              <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Galeries Archivées</div>
              <div class="text-2xl font-extrabold text-amber-400 mt-1">${archivedGalleries.length} <span class="text-sm text-slate-400 font-normal">/ 2 max (conservation 15j)</span></div>
            </div>
            <div class="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
              ${Math.max(0, 2 - archivedGalleries.length)} place(s) dispo
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-white/10 pb-1">
          <button id="tab-gal-active" class="btn btn-sm ${currentTab === 'active' ? 'btn-primary' : 'btn-ghost'}">
            <span>Actives (${activeGalleries.length})</span>
          </button>
          <button id="tab-gal-archived" class="btn btn-sm ${currentTab === 'archived' ? 'btn-primary' : 'btn-ghost'}">
            <span>Archivées (${archivedGalleries.length}/2 max)</span>
          </button>
        </div>

        <!-- Tab Contents -->
        <div>
          ${currentTab === 'active' ? `
            ${activeGalleries.length === 0 ? `
              <div class="card p-12 text-center text-slate-400 space-y-4 max-w-md mx-auto my-8">
                <i data-lucide="folder-plus" class="w-12 h-12 text-sky-400 mx-auto"></i>
                <h3 class="font-bold text-lg text-white">Aucune galerie active</h3>
                <p class="text-sm">Créez votre première galerie pour livrer vos visuels à vos clients.</p>
              </div>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${activeGalleries.map(g => {
                  const cardCover = (g.photos && g.photos.length > 0 && g.photos[0].url)
                    ? g.photos[0].url
                    : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';
                  const count = g.photos ? g.photos.length : 0;
                  return `
                    <div class="card p-4 space-y-4 card-hover flex flex-col justify-between border border-white/10">
                      <div>
                        <div class="relative rounded-xl overflow-hidden aspect-video mb-3 bg-slate-900">
                          <img src="${cardCover}" alt="${g.title}" class="w-full h-full object-cover">
                          <div class="absolute top-2 right-2 flex items-center gap-1.5">
                            <span class="badge ${count > 0 ? 'badge-accent' : 'badge-subtle'} text-[10px] font-bold">${count} Photos</span>
                          </div>
                        </div>
                        <h3 class="font-bold text-lg truncate text-white">${g.title}</h3>
                        <p class="text-sm text-slate-400 truncate">Client : ${g.clientName}</p>
                        <div class="text-xs text-slate-500 mt-1 font-mono">Créée le ${g.createdDate}</div>
                      </div>

                      <div class="pt-3 border-t border-white/10 space-y-2">
                        <div class="flex items-center gap-2">
                          <button class="btn btn-secondary btn-sm flex-1 btn-open-gal-detail" data-id="${g.id}">
                            <i data-lucide="folder" class="w-3.5 h-3.5"></i> Détails & Photos
                          </button>
                          <button class="btn bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 btn-sm text-xs font-bold btn-copy-client-link" data-token="${g.shareToken}" title="Copier le lien Client">
                            <i data-lucide="link" class="w-3.5 h-3.5"></i> Lien Client
                          </button>
                        </div>
                        <div class="flex items-center justify-between text-xs pt-1 border-t border-white/5 px-1">
                          <button class="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium btn-archive-gal" data-id="${g.id}">
                            <i data-lucide="archive" class="w-3.5 h-3.5"></i> Archiver
                          </button>
                          <button class="text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-medium btn-delete-gal" data-id="${g.id}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          ` : `
            ${archivedGalleries.length === 0 ? `
              <div class="card p-12 text-center text-slate-400 space-y-4 max-w-md mx-auto my-8">
                <i data-lucide="archive-x" class="w-12 h-12 text-amber-400 mx-auto"></i>
                <h3 class="font-bold text-lg text-white">Aucune galerie archivée</h3>
                <p class="text-sm text-slate-400 max-w-sm mx-auto">Vous pouvez archiver des galeries actives pour libérer de la place dans votre quota.</p>
              </div>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${archivedGalleries.map(g => {
                  const remainingDays = store.getDaysRemainingInArchive(g.archivedDate);
                  return `
                    <div class="card p-4 space-y-4 border-amber-500/30 bg-slate-900/40 flex flex-col justify-between">
                      <div>
                        <div class="relative rounded-xl overflow-hidden aspect-video mb-3 opacity-80">
                          <img src="${g.coverImage}" alt="${g.title}" class="w-full h-full object-cover grayscale">
                          <div class="absolute top-2 right-2">
                            <span class="badge badge-pro font-bold">
                              Auto-suppression dans ${remainingDays}j
                            </span>
                          </div>
                        </div>
                        <h3 class="font-bold text-lg truncate text-white">${g.title}</h3>
                        <p class="text-sm text-slate-400 truncate">${g.clientName}</p>
                        <div class="text-xs text-amber-400/90 mt-2 flex items-center gap-1">
                          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                          <span>Archivée le ${new Date(g.archivedDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div class="pt-3 border-t border-white/10 flex items-center gap-2">
                        <button class="btn btn-pro btn-sm flex-1 btn-restore-gal" data-id="${g.id}">
                          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Restaurer (Active)
                        </button>
                        <button class="btn btn-danger btn-sm btn-delete-gal" data-id="${g.id}" title="Supprimer définitivement">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          `}
        </div>

      </div>

      <!-- CREATE GALLERY MODAL -->
      <div id="modal-new-gal" class="modal-overlay ${showModal ? '' : 'hidden'}">
        <div class="modal-card">
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 class="text-xl font-bold text-white">Créer une galerie client</h3>
            <button id="btn-close-gal-modal" class="btn-icon btn-ghost text-slate-400"><i data-lucide="x"></i></button>
          </div>
          <form id="form-create-gal" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Titre de la galerie / projet</label>
              <input type="text" id="g-title" class="form-input" placeholder="Ex: Shooting Lookbook Automne" required>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Nom du Client</label>
                <input type="text" id="g-client-name" class="form-input" placeholder="Ex: Maison Lumière" required>
              </div>
              <div class="form-group">
                <label class="form-label">Quota max de téléchargements</label>
                <input type="number" id="g-quota" class="form-input" value="10" min="1" max="100" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Importer vos photos HD (Mobile ou PC)</label>
              <div id="g-dropzone" class="border-2 border-dashed border-sky-500/40 hover:border-sky-400 bg-sky-500/5 hover:bg-sky-500/10 p-5 rounded-2xl text-center cursor-pointer transition-all space-y-1.5">
                <i data-lucide="upload-cloud" class="w-8 h-8 text-sky-400 mx-auto"></i>
                <div class="text-xs font-bold text-white">Cliquez pour importer des photos ou glissez-les ici</div>
                <div class="text-[11px] text-slate-400">Sélection multiple (JPG, PNG, WEBP)</div>
                <div id="g-photo-preview-count" class="text-xs font-bold text-emerald-400 pt-1 hidden"></div>
              </div>
              <input type="file" id="g-file-photos" style="opacity:0; position:absolute; z-index:-1; pointer-events:none; width:1px; height:1px;" multiple accept="image/*">
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" id="btn-cancel-gal-modal" class="btn btn-ghost">Annuler</button>
              <button type="submit" class="btn btn-primary"><i data-lucide="check"></i> Publier la Galerie</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Bind Icons
    if (window.lucide) window.lucide.createIcons();

    // Elements
    const modal = container.querySelector('#modal-new-gal');
    const btnOpen = container.querySelector('#btn-open-new-gal');
    const btnClose = container.querySelector('#btn-close-gal-modal');
    const btnCancel = container.querySelector('#btn-cancel-gal-modal');
    const tabActive = container.querySelector('#tab-gal-active');
    const tabArchived = container.querySelector('#tab-gal-archived');

    // Photo file input & dropzone binding for creation modal
    let pendingImportedPhotos = [];
    const fileInputPhotos = container.querySelector('#g-file-photos');
    const dropzonePhotos = container.querySelector('#g-dropzone');
    const countPhotosEl = container.querySelector('#g-photo-preview-count');

    if (dropzonePhotos && fileInputPhotos) {
      dropzonePhotos.addEventListener('click', () => fileInputPhotos.click());
      fileInputPhotos.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          pendingImportedPhotos = [];
          if (countPhotosEl) {
            countPhotosEl.textContent = `⏳ Traitement de ${files.length} photo(s)...`;
            countPhotosEl.classList.remove('hidden');
          }
          for (let idx = 0; idx < files.length; idx++) {
            const f = files[idx];
            try {
              const dataUrl = await compressImageFile(f);
              pendingImportedPhotos.push({
                id: 'p_up_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substr(2, 4),
                title: f.name.replace(/\.[^/.]+$/, ""),
                url: dataUrl,
                size: (f.size / (1024 * 1024)).toFixed(1) + ' MB'
              });
            } catch (err) {
              console.warn('Compression failed for photo:', f.name, err);
            }
          }
          if (countPhotosEl) {
            countPhotosEl.textContent = `✨ ${pendingImportedPhotos.length} photo(s) prête(s) à être publiée(s) !`;
            countPhotosEl.classList.remove('hidden');
          }
        }
      });
    }

    // Tab switching
    tabActive.addEventListener('click', () => {
      renderGalleriesView(container, new URLSearchParams('tab=active'));
    });

    tabArchived.addEventListener('click', () => {
      renderGalleriesView(container, new URLSearchParams('tab=archived'));
    });

    // Create Modal
    btnOpen.addEventListener('click', () => {
      if (activeGalleries.length >= maxActive) {
        openCustomToast(`Limite de galeries actives atteinte ! Votre formule ${user.plan} autorise jusqu'à ${maxActive} galeries actives. Vous pouvez archiver une galerie active pour libérer une place, ou passer à l'offre Pro.`, 'warning');
        return;
      }
      pendingImportedPhotos = [];
      if (countPhotosEl) countPhotosEl.classList.add('hidden');
      modal.classList.remove('hidden');
    });

    btnClose.addEventListener('click', () => modal.classList.add('hidden'));
    btnCancel.addEventListener('click', () => modal.classList.add('hidden'));

    container.querySelector('#form-create-gal').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = container.querySelector('#g-title').value;
      const clientName = container.querySelector('#g-client-name').value;
      const downloadQuota = container.querySelector('#g-quota').value;
      
      const newGalData = { title, clientName, downloadQuota };
      if (pendingImportedPhotos.length > 0) {
        newGalData.photos = pendingImportedPhotos;
        newGalData.coverImage = pendingImportedPhotos[0].url;
      }

      const newGal = store.addGallery(newGalData);
      if (newGal) {
        modal.classList.add('hidden');
        const clientUrl = `${window.location.origin}${window.location.pathname}#client-portal?token=${newGal.shareToken}`;
        navigator.clipboard.writeText(clientUrl);
        openShareModal({
          title: `✨ Galerie "${newGal.title}" créée avec succès !`,
          subtitle: 'Votre galerie est en ligne. Le lien d\'accès sécurisé a été copié dans votre presse-papier.',
          url: clientUrl,
          shareToken: newGal.shareToken
        });
        renderGalleriesView(container, new URLSearchParams('tab=active'));
      }
    });

    // Copy Client Link Buttons
    container.querySelectorAll('.btn-copy-client-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const token = btn.getAttribute('data-token');
        const clientUrl = `${window.location.origin}${window.location.pathname}#client-portal?token=${token}`;
        navigator.clipboard.writeText(clientUrl);
        openShareModal({
          title: `Lien d'accès Client`,
          subtitle: 'Le lien direct vers l\'espace client a été copié dans votre presse-papier.',
          url: clientUrl,
          shareToken: token
        });
      });
    });

    // Detail Buttons
    container.querySelectorAll('.btn-open-gal-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.location.hash = `gallery-detail?id=${id}`;
      });
    });

    // Archive Buttons
    container.querySelectorAll('.btn-archive-gal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (store.archiveGallery(id)) {
          renderGalleriesView(container, new URLSearchParams(`tab=${currentTab}`));
        }
      });
    });

    // Restore Buttons
    container.querySelectorAll('.btn-restore-gal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (store.restoreGallery(id)) {
          renderGalleriesView(container, new URLSearchParams('tab=active'));
        }
      });
    });

    // Delete Permanently Buttons
    container.querySelectorAll('.btn-delete-gal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const g = store.getGalleryById(id);
        if (g) {
          openDeleteGalleryModal(g, () => {
            if (store.deleteGalleryPermanently(id)) {
              if (typeof openCustomToast === 'function') openCustomToast(`La galerie "${g.title}" a été supprimée.`, 'warning');
              renderGalleriesView(container, new URLSearchParams(`tab=${currentTab}`));
            }
          });
        }
      });
    });
  }

  function renderGalleryDetailView(container, params) {
    const id = params.get('id');
    const g = store.getGalleryById(id) || store.getGalleries()[0];

    container.innerHTML = `
      <div class="page-container space-y-6">
        <div class="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <a href="#galleries" class="btn-icon btn-secondary"><i data-lucide="arrow-left"></i></a>
            <div>
              <h1 class="text-2xl font-extrabold tracking-tight text-white">${g.title}</h1>
              <p class="text-sm text-slate-400">Client : ${g.clientName}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <!-- Importer des photos Button -->
            <button id="btn-detail-add-photos" class="btn bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg transition-all">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Importer des photos (PC/Mobile)</span>
            </button>
            <input type="file" id="detail-add-photos-input" style="opacity:0; position:absolute; z-index:-1; pointer-events:none; width:1px; height:1px;" multiple accept="image/*">

            <a href="#client-portal?token=${g.shareToken}" class="btn btn-primary text-xs">
              <i data-lucide="external-link" class="w-4 h-4"></i><span>Voir l'Espace Client</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card p-4"><div class="text-xs text-slate-400">Quota Client</div><div class="font-bold text-white text-lg font-mono">${g.photosDownloadedCount || 0} / ${g.downloadQuota || 10} photos</div></div>
          <div class="card p-4"><div class="text-xs text-slate-400">Consultations</div><div class="font-bold text-sky-400 text-lg">${g.viewsCount} vues</div></div>
          <div class="card p-4"><div class="text-xs text-slate-400">Fichiers Téléchargés</div><div class="font-bold text-emerald-400 text-lg">${g.downloadsCount} fois</div></div>
        </div>

        <div class="space-y-4">
          <h2 class="text-lg font-bold text-white">Photos dans la galerie (${g.photos ? g.photos.length : 0})</h2>
          
          ${(!g.photos || g.photos.length === 0) ? `
            <div class="card p-10 text-center text-slate-400 space-y-3 bg-slate-900/40 border border-white/10 rounded-2xl">
              <i data-lucide="image-off" class="w-10 h-10 text-slate-500 mx-auto"></i>
              <p class="text-sm font-semibold text-white">Aucune photo dans cette galerie pour l'instant</p>
              <p class="text-xs text-slate-400">Cliquez sur le bouton vert en haut <strong class="text-emerald-400">"Importer des photos (PC/Mobile)"</strong> pour ajouter vos clichés.</p>
            </div>
          ` : `
            <div class="photo-masonry-grid">
              ${g.photos.map((p, idx) => `
                <div class="photo-item card-hover group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                  <img src="${p.url}" alt="${p.title}" class="btn-zoom-photo" data-idx="${idx}">
                  <div class="photo-actions opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-slate-950/60 p-4 flex items-center justify-center gap-2">
                    <button class="btn-icon btn-secondary btn-zoom-photo" data-idx="${idx}" title="Aperçu HD / Zoomer"><i data-lucide="maximize-2"></i></button>
                    <button class="btn-icon bg-red-500/80 hover:bg-red-600 text-white btn-delete-photo-item" data-idx="${idx}" title="Supprimer la photo"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind Lightbox Zoom Preview
    container.querySelectorAll('.btn-zoom-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx) && g.photos && g.photos[idx]) {
          openPhotoLightboxModal(g.photos, idx);
        }
      });
    });

    // Bind Detail Import Button
    const btnAddPhotos = container.querySelector('#btn-detail-add-photos');
    const inputAddPhotos = container.querySelector('#detail-add-photos-input');

    const handleImportFiles = async (files) => {
      if (files.length > 0) {
        if (typeof openToast === 'function') openToast(`⏳ Traitement de ${files.length} photo(s)...`, 'warning');
        let newPhotos = [];
        for (let idx = 0; idx < files.length; idx++) {
          const f = files[idx];
          try {
            const dataUrl = await compressImageFile(f);
            newPhotos.push({
              id: 'p_detail_up_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substr(2, 4),
              title: f.name.replace(/\.[^/.]+$/, ""),
              url: dataUrl,
              size: (f.size / (1024 * 1024)).toFixed(1) + ' MB'
            });
          } catch (err) {
            console.warn('Compression error for', f.name, err);
          }
        }
        if (newPhotos.length > 0) {
          store.addPhotosToGallery(g.id, newPhotos);
          g.coverImage = newPhotos[0].url;
          store.saveState();
          if (typeof openToast === 'function') openToast(`✨ ${newPhotos.length} photo(s) importée(s) avec succès !`, 'success');
          renderGalleryDetailView(container, new URLSearchParams(`id=${g.id}`));
        }
      }
    };

    if (btnAddPhotos && inputAddPhotos) {
      btnAddPhotos.addEventListener('click', () => inputAddPhotos.click());
    }
    if (inputAddPhotos) {
      inputAddPhotos.addEventListener('change', (e) => {
        handleImportFiles(Array.from(e.target.files));
      });
    }

    // Delete single photo item inside gallery detail
    container.querySelectorAll('.btn-delete-photo-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx) && g.photos && g.photos[idx]) {
          openConfirmModal({
            title: 'Supprimer cette photo ?',
            message: 'Voulez-vous vraiment retirer cette photo de la galerie ?',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            isDanger: true,
            icon: 'trash-2',
            onConfirm: () => {
              g.photos.splice(idx, 1);
              g.coverImage = (g.photos && g.photos.length > 0)
                ? g.photos[0].url
                : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';
              store.saveState();
              if (typeof openToast === 'function') openToast('Photo supprimée de la galerie.', 'warning');
              renderGalleryDetailView(container, params);
            }
          });
        }
      });
    });
  }

  // Helper Modal: Photo Lightbox Carousel Modal with Next/Prev Arrows & Selection
  function openPhotoLightboxModal(photos, initialIndex = 0, selectedPhotoIds = null, onToggleSelect = null) {
    if (!photos || photos.length === 0) return;
    let currentIndex = Math.max(0, Math.min(initialIndex || 0, photos.length - 1));

    let modal = document.getElementById('photo-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'photo-lightbox-modal';
      modal.className = 'modal-overlay z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    function updateView() {
      const photo = photos[currentIndex];
      const isSelected = (selectedPhotoIds && typeof selectedPhotoIds.has === 'function') ? selectedPhotoIds.has(photo.id || photo.url) : false;

      modal.innerHTML = `
        <div class="relative max-w-5xl w-full flex flex-col items-center justify-center space-y-4 animate-fade-in">
          
          <!-- Top Bar: Counter + Select Toggle + Close -->
          <div class="w-full flex items-center justify-between text-white bg-slate-900/80 px-6 py-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
            <div class="text-xs font-mono text-slate-300">
              Photo <span class="font-bold text-sky-400 text-sm">${currentIndex + 1}</span> / ${photos.length}
            </div>

            <div class="flex items-center gap-3">
              ${onToggleSelect ? `
                <button id="btn-lightbox-select" class="btn btn-sm ${isSelected ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'btn-secondary text-slate-300'} text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-2 transition-all">
                  <i data-lucide="${isSelected ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
                  <span>${isSelected ? 'Sélectionnée' : 'Sélectionner'}</span>
                </button>
              ` : ''}

              <!-- Close Lightbox -->
              <button id="btn-close-lightbox" class="btn-icon btn-ghost text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Fermer (Échap)">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>

          <!-- Main Image + Arrow Navigation -->
          <div class="relative w-full flex items-center justify-center min-h-[350px] max-h-[75vh]">
            
            ${photos.length > 1 ? `
              <!-- Left Arrow -->
              <button id="btn-prev-lightbox" class="absolute left-3 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-sky-500 hover:border-sky-400 flex items-center justify-center transition-all shadow-xl" title="Photo précédente (Flèche gauche)">
                <i data-lucide="chevron-left" class="w-6 h-6"></i>
              </button>
            ` : ''}

            <!-- Image -->
            <img src="${photo.url}" alt="${photo.title || 'Photo HD'}" class="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-white/15 shadow-2xl">

            ${photos.length > 1 ? `
              <!-- Right Arrow -->
              <button id="btn-next-lightbox" class="absolute right-3 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-sky-500 hover:border-sky-400 flex items-center justify-center transition-all shadow-xl" title="Photo suivante (Flèche droite)">
                <i data-lucide="chevron-right" class="w-6 h-6"></i>
              </button>
            ` : ''}
          </div>

          <!-- Image Title / Caption -->
          <div class="text-xs text-slate-300 font-semibold bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
            ${photo.title || 'Photo Haute Définition'}
          </div>

        </div>
      `;

      modal.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();

      const closeModal = () => {
        modal.classList.add('hidden');
        document.removeEventListener('keydown', handleKeydown);
      };

      const handleKeydown = (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft' && photos.length > 1) {
          currentIndex = (currentIndex - 1 + photos.length) % photos.length;
          updateView();
        } else if (e.key === 'ArrowRight' && photos.length > 1) {
          currentIndex = (currentIndex + 1) % photos.length;
          updateView();
        }
      };

      document.removeEventListener('keydown', handleKeydown);
      document.addEventListener('keydown', handleKeydown);

      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };

      modal.querySelector('#btn-close-lightbox').onclick = closeModal;

      const prevBtn = modal.querySelector('#btn-prev-lightbox');
      if (prevBtn) {
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + photos.length) % photos.length;
          updateView();
        };
      }

      const nextBtn = modal.querySelector('#btn-next-lightbox');
      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % photos.length;
          updateView();
        };
      }

      const selectBtn = modal.querySelector('#btn-lightbox-select');
      if (selectBtn && onToggleSelect) {
        selectBtn.onclick = (e) => {
          e.stopPropagation();
          onToggleSelect(photo);
          updateView();
        };
      }
    }

    updateView();
  }

  window.openPhotoLightboxModal = openPhotoLightboxModal;

  // Helper Toast: Sleek Custom Toast Notification (No Browser Alerts)
  function openCustomToast(message, type = 'success') {
    let toast = document.getElementById('custom-app-toast');
    if (toast) toast.remove();

    toast = document.createElement('div');
    toast.id = 'custom-app-toast';
    toast.className = 'fixed top-5 right-5 z-[9999] transition-all duration-300 transform translate-y-0 opacity-100';

    const isSuccess = type === 'success';
    toast.innerHTML = `
      <div class="px-5 py-3.5 rounded-2xl bg-[#121824] border ${isSuccess ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'} shadow-2xl flex items-center gap-3 text-xs font-bold animate-fade-in backdrop-blur-md">
        <i data-lucide="${isSuccess ? 'check-circle' : 'alert-triangle'}" class="w-5 h-5"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      if (toast && toast.parentNode) toast.remove();
    }, 4000);
  }

  // Programmatic Image Downloader (Blob & Data URL for guaranteed cross-origin download)
  async function downloadPhotosDirectly(photosToDownload, galleryTitle = 'Galerie_Kaptur') {
    for (let idx = 0; idx < photosToDownload.length; idx++) {
      const p = photosToDownload[idx];
      const filename = `${galleryTitle.replace(/[^a-z0-9]/gi, '_')}_photo_${idx + 1}.jpg`;
      
      try {
        const response = await fetch(p.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      } catch (err) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 1200;
            canvas.height = img.naturalHeight || 800;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          img.onerror = () => {
            const a = document.createElement('a');
            a.href = p.url;
            a.download = filename;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          img.src = p.url;
        } catch (e) {
          const a = document.createElement('a');
          a.href = p.url;
          a.download = filename;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    }
  }

  // 5. CLIENT PORTAL VIEW (Direct Link Access — Personal Client Space)
  function renderClientPortalView(container, params) {
    try {
      const tokenParam = (params && typeof params.get === 'function') ? params.get('token') : null;
      let gallery = tokenParam ? store.getGalleryByToken(tokenParam) : null;
      
      if (!gallery) {
        const activeGals = store.getActiveGalleries ? store.getActiveGalleries() : [];
        if (activeGals.length > 0) {
          gallery = activeGals[0];
        } else if (store.getGalleries && store.getGalleries().length > 0) {
          gallery = store.getGalleries()[0];
        }
      }

      if (!gallery) {
        gallery = {
          id: 'gal_default',
          title: 'Galerie Client Privée',
          clientName: 'Client Privé',
          clientEmail: '',
          shareToken: 'client-token',
          downloadQuota: 10,
          photosDownloadedCount: 0,
          photos: []
        };
      }

      if (!Array.isArray(gallery.photos)) {
        gallery.photos = [];
      }

      const photographer = store.getUser() || { name: 'Julien Mercer', role: 'Photographe Mode', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' };

      if (gallery.id && typeof store.incrementGalleryView === 'function') {
        store.incrementGalleryView(gallery.id);
      }

      const currentDownloaded = gallery.photosDownloadedCount || 0;
      const quota = gallery.downloadQuota || 10;

      // Selected photo state
      if (!gallery._selectedIds || !(gallery._selectedIds instanceof Set)) {
        gallery._selectedIds = new Set();
      }
      const selectedPhotoIds = gallery._selectedIds;
      const selectedCount = selectedPhotoIds.size;
      const remainingQuota = Math.max(0, quota - selectedCount);

      // Invoice retrieval (ONLY if invoice actually exists for gallery / client)
      let inv = null;
      try {
        const invoices = store.getInvoices ? store.getInvoices() : [];
        inv = invoices.find(i => i && (
          (i.galleryId && i.galleryId === gallery.id) ||
          (i.clientName && gallery.clientName && i.clientName.toLowerCase().trim() === gallery.clientName.toLowerCase().trim())
        )) || null;
      } catch (e) {
        console.warn('Invoice lookup:', e);
      }

      container.innerHTML = `
        <!-- Fixed Sticky Header for Client Space -->
        <header class="sticky top-0 z-30 bg-[#090D14]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-4 sm:px-6 mb-6">
          <div class="max-w-7xl mx-auto space-y-4">
            
            <!-- Welcome Banner for Client -->
            <div class="card p-5 sm:p-6 bg-gradient-to-r from-sky-900/40 via-[#121824] to-amber-900/30 border border-white/15 space-y-3 rounded-2xl shadow-xl">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <div class="logo-icon bg-sky-400 text-slate-950 flex items-center justify-center rounded-lg font-bold text-base w-8 h-8">K</div>
                  <span class="font-bold text-lg tracking-tight text-white">KAPTUR</span>
                  <span class="text-slate-500">|</span>
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                    <span>ESPACE CLIENT PRIVÉ</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <img src="${photographer.avatar}" alt="${photographer.name}" class="w-7 h-7 rounded-full object-cover border border-sky-400/40">
                  <span class="text-xs text-slate-300 hidden sm:inline">Photographe : <strong class="text-white">${photographer.name}</strong></span>
                  ${inv ? `
                    <!-- Download Invoice PDF Button (Only if invoice created) -->
                    <button id="btn-client-dl-invoice" class="btn bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-2 shadow-lg transition-all shrink-0">
                      <i data-lucide="file-text" class="w-4 h-4"></i>
                      <span>Télécharger ma facture (PDF)</span>
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Welcome Title -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Bienvenue, ${gallery.clientName} !</h1>
                  <p class="text-xs sm:text-sm text-slate-300 mt-0.5">Consultez vos clichés HD, cochez vos préférences. Il vous reste <strong class="text-emerald-400 font-bold font-mono">${remainingQuota} photo(s)</strong> à télécharger sur votre quota de ${quota}.</p>
                </div>
              </div>
            </div>

            <!-- Selection Controls & Live Quota Display Bar -->
            <div class="card p-4 bg-[#121824]/95 border border-white/15 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
              <div class="flex items-center gap-3 flex-wrap w-full md:w-auto">
                <!-- Selected Photos Counter Badge -->
                <div class="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-sky-500/30">
                  <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold font-mono text-sm">
                    ${selectedCount}
                  </div>
                  <div>
                    <div class="text-[11px] text-slate-400 font-medium leading-tight">Photos sélectionnées</div>
                    <div class="text-xs font-bold text-white font-mono">${selectedCount} photo(s) cochée(s)</div>
                  </div>
                </div>

                <!-- Remaining Photos Counter Badge (HIGHLIGHTED) -->
                <div class="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border ${remainingQuota > 0 ? 'border-emerald-500/40' : 'border-amber-500/40'}">
                  <div class="w-8 h-8 rounded-lg ${remainingQuota > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} flex items-center justify-center font-bold font-mono text-sm">
                    ${remainingQuota}
                  </div>
                  <div>
                    <div class="text-[11px] text-slate-400 font-medium leading-tight">Quota restant</div>
                    <div class="text-xs font-bold ${remainingQuota > 0 ? 'text-emerald-400' : 'text-amber-400'} font-mono">
                      ${remainingQuota > 0 ? `Il vous reste ${remainingQuota} photo(s)` : `Quota atteint (${quota}/${quota})`}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
                <button id="btn-select-all" class="btn btn-secondary btn-sm text-xs py-2 px-3">
                  <i data-lucide="check-square" class="w-3.5 h-3.5"></i> Tout cocher (${Math.min(quota, gallery.photos.length)})
                </button>
                <button id="btn-dl-selected-zip" class="btn bg-sky-500 hover:bg-sky-600 text-white btn-sm text-xs font-bold shadow-md py-2 px-3">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i> Télécharger la sélection (${selectedCount})
                </button>
              </div>
            </div>

          </div>
        </header>

        <!-- Main Client Space Gallery Grid -->
        <main class="max-w-7xl mx-auto px-6 pb-12">
          <!-- Clean HD Photo Grid with Selection Checkbox Circles -->
          <div class="photo-masonry-grid">
            ${gallery.photos.map((p, idx) => {
              const isSel = selectedPhotoIds.has(p.id || p.url);
              return `
                <div class="photo-item card-hover group relative rounded-xl overflow-hidden border ${isSel ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-white/10'} bg-slate-900 cursor-pointer btn-open-lightbox" data-index="${idx}">
                  <img src="${p.url}" alt="${p.title}" class="w-full h-auto object-cover">
                  
                  <!-- Selection Checkbox Dot Top-Right -->
                  <button class="btn-toggle-select-photo absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center ${isSel ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-white/30 hover:border-white'} transition-all" data-index="${idx}" title="${isSel ? 'Désélectionner' : 'Sélectionner'}">
                    <i data-lucide="${isSel ? 'check' : 'plus'}" class="w-4 h-4"></i>
                  </button>

                  <!-- Hover Overlay -->
                  <div class="photo-actions opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-slate-950/50 p-4 flex items-center justify-center">
                    <span class="btn btn-secondary btn-sm text-xs font-semibold shadow-lg">
                      <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i> Aperçu HD
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </main>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Toggle Select Function
      const toggleSelectPhoto = (photo) => {
        const id = photo.id || photo.url;
        if (selectedPhotoIds.has(id)) {
          selectedPhotoIds.delete(id);
        } else {
          if (selectedPhotoIds.size >= quota) {
            openCustomToast(`Quota de ${quota} photos atteint ! Le photographe a limité la sélection à ${quota} photos max.`, 'warning');
            return;
          }
          selectedPhotoIds.add(id);
        }
        renderClientPortalView(container, params);
      };

      // Client Invoice PDF Download Event
      const btnInv = container.querySelector('#btn-client-dl-invoice');
      if (btnInv) {
        btnInv.addEventListener('click', () => {
          openInvoicePreviewModal(inv);
        });
      }

      // Select All Button
      const btnSelectAll = container.querySelector('#btn-select-all');
      if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
          if (selectedPhotoIds.size === gallery.photos.length) {
            selectedPhotoIds.clear();
          } else {
            selectedPhotoIds.clear();
            gallery.photos.slice(0, quota).forEach(p => selectedPhotoIds.add(p.id || p.url));
          }
          renderClientPortalView(container, params);
        });
      }

      // Download Selected Photos Action
      const btnDlZip = container.querySelector('#btn-dl-selected-zip');
      if (btnDlZip) {
        btnDlZip.addEventListener('click', () => {
          let photosToDownload = gallery.photos.filter(p => selectedPhotoIds.has(p.id || p.url));
          if (photosToDownload.length === 0) {
            photosToDownload = gallery.photos.slice(0, quota);
          }

          if (typeof store.incrementGalleryDownload === 'function') {
            store.incrementGalleryDownload(gallery.id, photosToDownload.length);
          }
          downloadPhotosDirectly(photosToDownload, gallery.title);
          openCustomToast(`✨ Téléchargement de ${photosToDownload.length} photo(s) HD en cours dans vos fichiers !`, 'success');
          renderClientPortalView(container, params);
        });
      }

      // Toggle Checkbox Click
      container.querySelectorAll('.btn-toggle-select-photo').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          if (!isNaN(idx) && gallery.photos[idx]) {
            toggleSelectPhoto(gallery.photos[idx]);
          }
        });
      });

      // Lightbox Modal Open Event
      container.querySelectorAll('.btn-open-lightbox').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.getAttribute('data-index'));
          if (!isNaN(idx) && gallery.photos[idx]) {
            openPhotoLightboxModal(gallery.photos, idx, selectedPhotoIds, (photo) => {
              toggleSelectPhoto(photo);
            });
          }
        });
      });

    } catch (err) {
      console.error('Error rendering ClientPortalView:', err);
      // Fallback gallery render if any error occurs
      const defaultGal = (store.getGalleries && store.getGalleries().length > 0 ? store.getGalleries()[0] : null) || {
        id: 'gal_default',
        title: 'Shooting Éditorial Vogue Paris - Automne',
        clientName: 'Maison de Haute Couture Lumière',
        downloadQuota: 10,
        photos: [
          { id: 'p1', title: 'Look 01 - Robe Soie', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80', size: '14.2 MB' },
          { id: 'p2', title: 'Look 02 - Manteau Laine', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80', size: '18.6 MB' },
          { id: 'p3', title: 'Portrait Cadré', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80', size: '16.1 MB' }
        ]
      };
      const photographer = store.getUser() || { name: 'Julien Mercer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' };
      container.innerHTML = `
        <header class="bg-[#121824]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-6 py-4">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${photographer.avatar}" class="avatar avatar-md border border-amber-500/40">
              <div>
                <div class="font-bold text-base text-white">${defaultGal.title}</div>
                <div class="text-xs text-slate-400">Photographe : <span class="text-sky-400 font-semibold">${photographer.name}</span></div>
              </div>
            </div>
          </div>
        </header>
        <main class="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div class="card p-6 bg-gradient-to-r from-sky-900/30 via-[#121824] to-amber-900/20 border border-white/15 space-y-4 rounded-2xl shadow-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Bienvenue, ${defaultGal.clientName} !</h1>
                <p class="text-sm text-slate-300 mt-1">Consultez vos clichés HD en grand format et téléchargez votre facture officielle.</p>
              </div>
              <button onclick="window.location.hash='invoices'" class="btn bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg shrink-0">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>Télécharger ma facture (PDF)</span>
              </button>
            </div>
          </div>
          <div class="photo-masonry-grid">
            ${defaultGal.photos.map(p => `
              <div class="photo-item card-hover group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                <img src="${p.url}" alt="${p.title}" class="w-full h-auto object-cover">
              </div>
            `).join('')}
          </div>
        </main>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // 6. NOTIFICATIONS VIEW
  function renderNotificationsView(container) {
    const notifs = store.getNotifications();

    container.innerHTML = `
      <div class="page-container space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Vos Notifications</h1>
            <p class="text-sm text-slate-400 mt-1">Gérez vos alertes de téléchargements, factures et messages de la communauté.</p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button id="btn-mark-read" class="btn btn-secondary btn-sm text-xs">
              <i data-lucide="check-check" class="w-4 h-4"></i><span>Tout marquer comme lu</span>
            </button>

            ${notifs.length > 0 ? `
              <button id="btn-clear-all-notifs" class="btn btn-ghost text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <i data-lucide="trash" class="w-4 h-4"></i><span>Tout effacer</span>
              </button>
            ` : ''}
          </div>
        </div>

        ${notifs.length === 0 ? `
          <!-- Empty State -->
          <div class="card p-12 text-center text-slate-400 space-y-4 max-w-md mx-auto my-8 border border-white/10">
            <div class="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <i data-lucide="bell-off" class="w-7 h-7"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-white">Aucune notification</h3>
              <p class="text-xs text-slate-400 mt-1">Vos alertes apparaîtront ici au fur et à mesure des téléchargements et interactions.</p>
            </div>
          </div>
        ` : `
          <!-- Notification Cards List -->
          <div class="space-y-3 max-w-4xl">
            ${notifs.map(n => {
              const iconBg = n.type === 'download' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : n.type === 'dm' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-sky-500/10 text-sky-400 border-sky-500/30';
              const iconName = n.type === 'download' ? 'download' : n.type === 'dm' ? 'message-square' : 'bell';
              
              return `
                <div class="card p-4 flex items-start gap-3.5 ${!n.read ? 'border-l-4 border-l-sky-400 bg-slate-900/60' : 'border-white/10 bg-[#121824]'} card-hover transition-all group">
                  
                  <!-- Icon -->
                  <div class="w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center shrink-0 mt-0.5">
                    <i data-lucide="${iconName}" class="w-4 h-4"></i>
                  </div>

                  <!-- Text Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <h3 class="font-bold text-sm text-white truncate">${n.title}</h3>
                      <span class="text-[11px] text-slate-500 font-mono shrink-0">${n.timestamp}</span>
                    </div>
                    <p class="text-xs text-slate-300 mt-1 leading-relaxed">${n.message}</p>
                  </div>

                  <!-- Actions: Unread indicator & Delete Button -->
                  <div class="flex items-center gap-2 shrink-0 self-center">
                    ${!n.read ? `<span class="w-2 h-2 rounded-full bg-sky-400 shadow-sm" title="Non lue"></span>` : ''}
                    <button class="btn-delete-single-notif btn-icon btn-ghost text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity w-7 h-7" data-id="${n.id}" title="Supprimer la notification">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind Mark All Read
    const btnMark = container.querySelector('#btn-mark-read');
    if (btnMark) {
      btnMark.addEventListener('click', () => {
        store.markAllNotificationsRead();
        openCustomToast('✨ Toutes les notifications ont été marquées comme lues', 'success');
        renderNotificationsView(container);
      });
    }

    // Bind Clear All Notifications
    const btnClearAll = container.querySelector('#btn-clear-all-notifs');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => {
        store.clearAllNotifications();
        openCustomToast('✨ Toutes vos notifications ont été effacées', 'success');
        renderNotificationsView(container);
      });
    }

    // Bind Delete Single Notification
    container.querySelectorAll('.btn-delete-single-notif').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        store.deleteNotification(id);
        openCustomToast('✨ Notification supprimée', 'success');
        renderNotificationsView(container);
      });
    });
  }

  // Helper Modal: Custom Styled Delete Invoice Confirmation Modal
  function openDeleteInvoiceModal(invNumber, clientName, onConfirm) {
    let modal = document.getElementById('delete-inv-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-inv-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card max-w-sm bg-[#121824] border border-white/20 p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <i data-lucide="trash-2" class="w-7 h-7"></i>
        </div>

        <div class="space-y-1.5">
          <h3 class="text-lg font-extrabold text-white">Supprimer la facture ?</h3>
          <p class="text-xs text-slate-300">Voulez-vous vraiment supprimer la facture <span class="font-bold text-white">${invNumber}</span> (${clientName}) ? Cette action est définitive.</p>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button id="btn-cancel-del-inv" class="btn btn-secondary flex-1 py-2 text-xs">Annuler</button>
          <button id="btn-confirm-del-inv" class="btn bg-red-500 hover:bg-red-600 text-white flex-1 py-2 text-xs font-semibold rounded-xl transition-colors">Supprimer</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#btn-cancel-del-inv').addEventListener('click', closeModal);
    modal.querySelector('#btn-confirm-del-inv').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // Helper Modal: Custom Invoice PDF Preview & Direct Download Modal
  function openInvoicePreviewModal(inv) {
    let modal = document.getElementById('preview-inv-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'preview-inv-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const photographer = store.getUser();

    modal.innerHTML = `
      <div class="modal-card max-w-2xl bg-white text-slate-900 p-4 sm:p-8 space-y-4 sm:space-y-6 rounded-2xl shadow-2xl text-left border border-slate-200 animate-fade-in relative">
        
        <!-- Printable Invoice Container for PDF generator -->
        <div id="invoice-pdf-printable" class="space-y-5 sm:space-y-6 bg-white p-1 sm:p-2">
          
          <!-- Document Header -->
          <div class="flex flex-col sm:flex-row items-start justify-between border-b border-slate-200 pb-4 sm:pb-6 gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-extrabold text-2xl tracking-tight text-slate-900">KAPTUR</span>
                <span class="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">STUDIO PRO</span>
              </div>
              <p class="text-xs text-slate-500 font-semibold">${photographer.name} • ${photographer.role}</p>
              <p class="text-xs text-slate-500">${photographer.city || 'Paris'}, ${photographer.country || 'France'}</p>
            </div>

            <div class="text-left sm:text-right space-y-1">
              <span class="inline-block bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">FACTURE ACQUITTÉE</span>
              <h2 class="text-lg sm:text-xl font-bold font-mono text-slate-800 pt-1">${inv.number}</h2>
              <p class="text-xs text-slate-500">Émise le : ${inv.issueDate}</p>
            </div>
          </div>

          <!-- Bill To & Bill From Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
            <div>
              <div class="font-bold text-slate-400 uppercase tracking-wider mb-1">Émetteur (Photographe)</div>
              <div class="font-bold text-slate-900 text-sm">${photographer.name}</div>
              <div class="text-slate-600">${photographer.email || 'julien.mercer@kaptur.studio'}</div>
              <div class="text-slate-600">${photographer.phone || '+33 6 12 34 56 78'}</div>
            </div>
            <div>
              <div class="font-bold text-slate-400 uppercase tracking-wider mb-1">Facturé à (Client)</div>
              <div class="font-bold text-slate-900 text-sm">${inv.clientName}</div>
              <div class="text-slate-600">${inv.clientEmail || 'contact@lumiere-paris.fr'}</div>
              <div class="text-slate-600 font-semibold text-emerald-600 mt-1">Paiement : Reçu & Enregistré</div>
            </div>
          </div>

          <!-- Line Items Table -->
          <div class="responsive-table-wrapper border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table class="w-full text-left">
              <thead class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-3">Prestation / Description</th>
                  <th class="p-3 text-center">Qté</th>
                  <th class="p-3 text-right">Montant Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td class="p-3 font-semibold">${inv.description || 'Prestation Photographique & Édition HD'}</td>
                  <td class="p-3 text-center font-mono">1</td>
                  <td class="p-3 text-right font-bold font-mono text-sm">${inv.total.toFixed(0)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Footer -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-200 gap-3">
            <div class="text-xs text-slate-500 space-y-1">
              <p>Document officiel émis via la plateforme Kaptur.</p>
              <p class="font-mono text-[11px]">TVA non applicable, art. 293 B du CGI</p>
            </div>
            <div class="text-left sm:text-right">
              <div class="text-xs text-slate-500 uppercase font-bold">Total Payé</div>
              <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono">${inv.total.toFixed(0)} €</div>
            </div>
          </div>

        </div>

        <!-- Modal Actions (Non-printable) -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button id="btn-close-inv-preview" class="btn bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 text-xs font-bold rounded-xl transition-colors">Fermer</button>
          <button id="btn-download-inv-pdf" class="btn bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-md">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Télécharger le fichier PDF</span>
          </button>
        </div>

      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const closeModal = () => modal.classList.add('hidden');
    modal.querySelector('#btn-close-inv-preview').addEventListener('click', closeModal);

    modal.querySelector('#btn-download-inv-pdf').addEventListener('click', () => {
      const element = modal.querySelector('#invoice-pdf-printable');
      const filename = `Facture_${inv.number}_${(inv.clientName || 'Client').replace(/[^a-z0-9]/gi, '_')}.pdf`;
      const btn = modal.querySelector('#btn-download-inv-pdf');
      const origText = btn.innerHTML;

      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Génération du PDF...</span>`;
      if (window.lucide) window.lucide.createIcons();

      const downloadFallbackHtml = () => {
        const htmlStr = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title><style>body{font-family:sans-serif;padding:30px;color:#1e293b;}</style></head><body>${element.innerHTML}</body></html>`;
        const blob = new Blob([htmlStr], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename.replace('.pdf', '.html');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        btn.innerHTML = origText;
        if (window.lucide) window.lucide.createIcons();
      };

      if (window.html2pdf) {
        const opt = {
          margin:       0.3,
          filename:     filename,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
          btn.innerHTML = origText;
          if (window.lucide) window.lucide.createIcons();
          openCustomToast('✨ Facture PDF téléchargée avec succès !', 'success');
        }).catch(err => {
          console.warn('html2pdf failed, falling back:', err);
          downloadFallbackHtml();
        });
      } else {
        downloadFallbackHtml();
      }
    });
  }

  // 7. INVOICES VIEW
  function renderInvoicesView(container) {
    const invoices = store.getInvoices();
    const user = store.getUser();
    const galleries = store.getGalleries();

    const totalAmount = invoices.reduce((s, i) => s + (i.total || 0), 0);

    container.innerHTML = `
      <div class="page-container space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Factures</h1>
            <p class="text-sm text-slate-400">Générez des factures professionnelles pour vos clients, prévisualisez-les et téléchargez-les en PDF.</p>
          </div>
          <button id="btn-open-inv-modal" class="btn btn-primary">
            <i data-lucide="plus"></i><span>Créer une facture</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          <div class="card p-4 border-emerald-500/30 bg-emerald-500/5">
            <div class="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Total Facturé</div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">${totalAmount.toFixed(0)} €</div>
          </div>
          <div class="card p-4 border-sky-500/30 bg-sky-500/5">
            <div class="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Nombre de Factures</div>
            <div class="text-2xl font-extrabold text-white font-mono">${invoices.length}</div>
          </div>
        </div>

        <!-- Mobile Stacked Card View (Visible on small screens < 640px) -->
        <div class="block sm:hidden space-y-3">
          ${invoices.map(inv => `
            <div class="card p-4 space-y-3 border border-white/10 bg-[#121824] shadow-md">
              <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <span class="font-mono font-bold text-sky-400 text-sm">${inv.number}</span>
                  <div class="text-[11px] text-slate-400 font-mono">${inv.issueDate}</div>
                </div>
                <div class="text-right">
                  <span class="font-extrabold text-emerald-400 font-mono text-lg">${inv.total.toFixed(0)} €</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-slate-400 font-medium">Client</div>
                  <div class="font-semibold text-white text-sm">${inv.clientName}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="btn btn-secondary btn-sm text-xs btn-preview-inv" data-id="${inv.id}" title="Voir et télécharger le PDF">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> PDF
                  </button>
                  <button class="btn btn-ghost btn-sm text-red-400 hover:bg-red-500/10 p-2 rounded-lg btn-delete-inv-row" data-id="${inv.id}" data-num="${inv.number}" data-client="${inv.clientName}" title="Supprimer">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Desktop Table View (Hidden on mobile < 640px) -->
        <div class="hidden sm:block card p-0 overflow-hidden border border-white/10 shadow-xl">
          <div class="responsive-table-wrapper">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-900 text-slate-400 text-xs uppercase font-bold border-b border-white/10">
                <tr>
                  <th class="p-4">N° Facture</th>
                  <th class="p-4">Client</th>
                  <th class="p-4">Date</th>
                  <th class="p-4 text-right">Montant Total</th>
                  <th class="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                ${invoices.map(inv => `
                  <tr class="hover:bg-slate-900/50 transition-colors">
                    <td class="p-4 font-mono font-bold text-sky-400">${inv.number}</td>
                    <td class="p-4 font-semibold text-white">${inv.clientName}</td>
                    <td class="p-4 text-xs text-slate-400 font-mono">${inv.issueDate}</td>
                    <td class="p-4 text-right font-extrabold text-emerald-400 font-mono text-base">${inv.total.toFixed(0)} €</td>
                    <td class="p-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button class="btn btn-secondary btn-sm text-xs btn-preview-inv" data-id="${inv.id}" title="Voir et télécharger le PDF">
                          <i data-lucide="eye" class="w-3.5 h-3.5"></i> Voir PDF
                        </button>
                        <button class="btn btn-ghost btn-sm text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg btn-delete-inv-row" data-id="${inv.id}" data-num="${inv.number}" data-client="${inv.clientName}" title="Supprimer la facture">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="modal-inv" class="modal-overlay hidden">
        <div class="modal-card max-w-md bg-[#121824] border border-white/20 p-6 space-y-5 rounded-2xl shadow-2xl">
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 class="font-bold text-lg text-white">Créer une nouvelle facture</h3>
            <button id="btn-close-inv" class="btn-icon btn-ghost text-slate-400 hover:text-white"><i data-lucide="x"></i></button>
          </div>

          <form id="form-inv" class="space-y-4">
            
            <!-- Gallery Selection Dropdown -->
            <div class="form-group">
              <label class="form-label text-sky-400 font-semibold flex items-center gap-1.5">
                <i data-lucide="image" class="w-4 h-4"></i>
                <span>Galerie Client</span>
              </label>
              <select id="inv-gallery-select" class="form-input bg-slate-900 border-sky-500/30 text-white focus:border-sky-400" required>
                <option value="">-- Choisir une galerie client --</option>
                ${galleries.map(g => `<option value="${g.id}">${g.title} (${g.clientName || 'Client Privé'})</option>`).join('')}
              </select>
              <p class="text-[11px] text-slate-400 mt-1">Le nom du client et la prestation seront automatiquement dérivés de la galerie.</p>
            </div>

            <div class="form-group">
              <label class="form-label">Montant Total (€)</label>
              <input type="number" id="inv-amount" class="form-input" placeholder="Ex: 800" required>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button type="button" id="btn-cancel-inv" class="btn btn-secondary text-xs py-2">Annuler</button>
              <button type="submit" class="btn btn-primary text-xs py-2 font-semibold"><i data-lucide="check"></i> Générer en PDF</button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const modal = container.querySelector('#modal-inv');
    container.querySelector('#btn-open-inv-modal').addEventListener('click', () => modal.classList.remove('hidden'));
    container.querySelector('#btn-close-inv').addEventListener('click', () => modal.classList.add('hidden'));
    container.querySelector('#btn-cancel-inv').addEventListener('click', () => modal.classList.add('hidden'));

    container.querySelector('#form-inv').addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedGalId = container.querySelector('#inv-gallery-select').value;
      const gallery = galleries.find(g => g.id === selectedGalId) || galleries[0];

      const clientName = gallery ? gallery.clientName : 'Client Privé';
      const description = gallery ? `Prestation Photographique — ${gallery.title}` : 'Prestation Photographique & Édition HD';
      const total = parseFloat(container.querySelector('#inv-amount').value) || 800;
      
      const newInv = store.addInvoice({ clientName, description, total });
      modal.classList.add('hidden');
      renderInvoicesView(container);
      if (newInv) openInvoicePreviewModal(newInv);
    });

    container.querySelectorAll('.btn-preview-inv').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const inv = store.getInvoiceById(id);
        if (inv) openInvoicePreviewModal(inv);
      });
    });

    container.querySelectorAll('.btn-delete-inv-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const num = btn.getAttribute('data-num');
        const client = btn.getAttribute('data-client');
        openDeleteInvoiceModal(num, client, () => {
          store.deleteInvoice(id);
          renderInvoicesView(container);
        });
      });
    });
  }

  // 8. COMMUNITY VIEW (Restricted to PRO plan)
  function renderCommunityView(container, routeParams) {
    const user = store.getUser();
    const isPro = user.plan === 'Pro';

    const hash = window.location.hash || '';
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const hashParams = new URLSearchParams(queryString);
    const targetProId = (routeParams && routeParams.get('proId')) || hashParams.get('proId') || hashParams.get('with') || hashParams.get('to');

    if (targetProId) {
      store.getOrCreateConversation(targetProId);
    }

    const currentConvs = store.getConversations();
    let activeConvId = currentConvs.length > 0 ? currentConvs[0].id : null;
    if (targetProId) {
      const targetConv = currentConvs.find(c => c.otherPro.id === targetProId);
      if (targetConv) activeConvId = targetConv.id;
    }

    if (!isPro) {
      container.innerHTML = `
        <div class="page-container space-y-6">
          <div class="border-b border-white/10 pb-4">
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Communauté Privée Pro</h1>
            <p class="text-sm text-slate-400">Échanges privés et collaborations directes entre professionnels.</p>
          </div>

          <div class="card card-pro p-8 text-center space-y-6 max-w-2xl mx-auto border-amber-500/40 my-12">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <i data-lucide="lock" class="w-8 h-8"></i>
            </div>
            <div>
              <span class="badge badge-pro mb-2">OPTION EXCLUSIVE PRO</span>
              <h2 class="text-2xl font-extrabold text-white">Accès Réservé aux Membres Pro</h2>
              <p class="text-sm text-slate-400 mt-2">La messagerie privée et le réseau direct entre photographes professionnels sont disponibles uniquement avec l'abonnement Pro.</p>
            </div>
            <a href="#subscription" class="btn btn-pro btn-lg inline-flex">
              <i data-lucide="zap"></i>
              <span>Passer à l'offre Pro (3 000 FCFA/mois)</span>
            </a>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    function renderChat() {
      const currentConvs = store.getConversations();
      const activeConv = currentConvs.find(c => c.id === activeConvId) || currentConvs[0];

      if (!activeConv) {
        container.innerHTML = `
          <div class="page-container p-12 text-center text-slate-400 space-y-4 max-w-lg mx-auto my-12 bg-[#121824] rounded-2xl border border-white/10">
            <i data-lucide="message-square-off" class="w-12 h-12 text-sky-400 mx-auto"></i>
            <h2 class="text-xl font-bold text-white">Aucune conversation en cours</h2>
            <p class="text-sm">Sélectionnez un membre dans l'annuaire Recherche Pro pour échanger directement.</p>
            <a href="#search" class="btn btn-primary inline-flex"><i data-lucide="search"></i><span>Recherche Pro</span></a>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      container.innerHTML = `
        <div class="page-container space-y-6">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-extrabold tracking-tight text-white">Communauté Privée Pro</h1>
                <span class="badge badge-pro">RÉSEAU VÉRIFIÉ</span>
              </div>
              <p class="text-sm text-slate-400">Échanges privés entre photographes abonnés Pro.</p>
            </div>
          </div>

          <div class="chat-layout shadow-xl">
            <!-- Conversations List (Horizontal scroll bar on mobile, vertical list on desktop) -->
            <div class="chat-thread-list">
              <div class="hidden md:block p-4 border-b border-white/10 bg-slate-900/40">
                <input type="text" class="form-input text-xs" placeholder="Rechercher une conversation...">
              </div>

              ${currentConvs.map(c => {
                const firstName = c.otherPro.name.split(' ')[0];
                const isAct = c.id === activeConvId;
                return `
                  <div class="chat-thread-item group ${isAct ? 'active' : ''}" data-conv-id="${c.id}">
                    <div class="avatar-wrapper relative flex-shrink-0">
                      <img src="${c.otherPro.avatar}" alt="${c.otherPro.name}" class="avatar avatar-md w-12 h-12 rounded-full object-cover">
                      <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#121824] shadow-sm" title="En ligne"></span>
                      ${c.unread ? `<span class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-sky-400 animate-pulse border-2 border-[#121824]"></span>` : ''}
                    </div>
                    
                    <!-- Desktop Info (Name, Timestamp & Message Preview) -->
                    <div class="chat-thread-info">
                      <div class="flex items-center justify-between mb-0.5">
                        <div class="font-bold text-sm text-white truncate">${c.otherPro.name}</div>
                        <span class="text-[10px] text-slate-400 font-mono">${c.lastTimestamp || ''}</span>
                      </div>
                      <div class="text-xs text-slate-400 truncate">${c.lastMessage}</div>
                    </div>

                    <!-- Mobile First Name Label -->
                    <div class="chat-thread-mobile-label ${isAct ? 'text-sky-400 font-bold' : 'text-slate-300'}">
                      ${firstName}
                    </div>

                    <button type="button" class="btn-delete-conv p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg shrink-0 hidden md:block" data-conv-id="${c.id}" title="Supprimer la discussion">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="flex flex-col flex-1 min-h-0 bg-[#121824]">
              <div class="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3 cursor-pointer group btn-open-header-pro" data-id="${activeConv.otherPro.id}" title="Voir le profil complet de ${activeConv.otherPro.name}">
                  <div class="relative flex-shrink-0">
                    <img src="${activeConv.otherPro.avatar}" class="avatar avatar-md group-hover:scale-105 transition-transform">
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121824] shadow-sm"></span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-base text-white group-hover:text-sky-400 transition-colors">${activeConv.otherPro.name}</h3>
                      <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        En ligne
                      </span>
                    </div>
                    <p class="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">${activeConv.otherPro.role} • ${activeConv.otherPro.city}</p>
                  </div>
                </div>
              </div>

              <div class="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                ${activeConv.messages && activeConv.messages.length > 0 ? activeConv.messages.map(m => `
                  <div class="chat-bubble msg-bubble-item ${m.sender === 'me' ? 'chat-bubble-me' : 'chat-bubble-other'} relative group cursor-pointer" data-msg-id="${m.id}">
                    <div>${m.text}</div>
                    <div class="flex items-center justify-between text-[10px] opacity-75 mt-1 gap-2">
                      <span>${m.isEdited ? '<span class="italic text-sky-300 opacity-90 mr-1">(modifié)</span>' : ''}${m.timestamp}</span>
                    </div>

                    ${m.sender === 'me' ? `
                      <div class="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-[#1A2232] border border-white/20 rounded-lg px-1.5 py-0.5 shadow-lg z-10">
                        <button type="button" class="btn-edit-msg text-slate-300 hover:text-sky-400 p-1" data-msg-id="${m.id}" data-text="${m.text.replace(/"/g, '&quot;')}" title="Modifier le message">
                          <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                        </button>
                        <button type="button" class="btn-delete-msg text-slate-300 hover:text-red-400 p-1" data-msg-id="${m.id}" title="Supprimer le message">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    ` : ''}
                  </div>
                `).join('') : `
                  <div class="m-auto text-center p-8 text-slate-400 space-y-2">
                    <i data-lucide="message-square" class="w-10 h-10 text-sky-400 mx-auto opacity-70"></i>
                    <p class="font-bold text-white text-base">Nouvelle discussion avec ${activeConv.otherPro.name}</p>
                    <p class="text-xs text-slate-400">Écrivez et envoyez votre premier message ci-dessous.</p>
                  </div>
                `}
              </div>

              <form id="form-send-chat" class="p-4 border-t border-white/10 relative shrink-0">
                <!-- Emoji Picker Popover Bar -->
                <div id="emoji-picker-popover" class="hidden absolute bottom-16 left-4 bg-[#1A2232] border border-white/20 rounded-2xl p-3 shadow-2xl z-30 animate-fade-in max-w-xs">
                  <div class="text-[11px] font-bold text-slate-400 mb-2 px-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Sélectionner un émoji</span>
                  </div>
                  <div class="grid grid-cols-6 gap-1.5 text-xl">
                    ${['😀', '😂', '😍', '🔥', '📸', '👍', '❤️', '🎉', '✨', '🙏', '💯', '👌', '👏', '😎', '🚀', '📷', '🙌', '⭐'].map(emoji => `
                      <button type="button" class="btn-emoji-item hover:bg-white/10 rounded-lg p-1 transition-colors text-center cursor-pointer" data-emoji="${emoji}">${emoji}</button>
                    `).join('')}
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button type="button" id="btn-emoji-toggle" class="btn-icon text-slate-400 hover:text-amber-400 transition-colors p-2 shrink-0" title="Ajouter un émoji">
                    <i data-lucide="smile" class="w-5 h-5"></i>
                  </button>
                  <input type="text" id="chat-input" class="form-input flex-1" placeholder="Écrivez votre message privé..." required>
                  <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      container.querySelectorAll('.chat-thread-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-conv')) return;
          activeConvId = item.getAttribute('data-conv-id');
          renderChat();
        });
      });

      container.querySelectorAll('.btn-delete-conv').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const convId = btn.getAttribute('data-conv-id');
          const targetC = currentConvs.find(c => c.id === convId);
          const name = targetC ? targetC.otherPro.name : 'cette personne';
          
          openDeleteConvModal(name, () => {
            store.deleteConversation(convId);
            const remaining = store.getConversations();
            activeConvId = remaining.length > 0 ? remaining[0].id : null;
            renderChat();
          });
        });
      });

      const btnHeaderPro = container.querySelector('.btn-open-header-pro');
      if (btnHeaderPro) {
        btnHeaderPro.addEventListener('click', () => {
          const proId = btnHeaderPro.getAttribute('data-id');
          const pro = store.getProById(proId) || activeConv.otherPro;
          if (pro) openPublicProModal(pro);
        });
      }

      // Emoji Picker toggle binding
      const btnEmojiToggle = container.querySelector('#btn-emoji-toggle');
      const emojiPopover = container.querySelector('#emoji-picker-popover');
      const chatInput = container.querySelector('#chat-input');

      if (btnEmojiToggle && emojiPopover) {
        btnEmojiToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          emojiPopover.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
          if (emojiPopover && !emojiPopover.contains(e.target) && e.target !== btnEmojiToggle) {
            emojiPopover.classList.add('hidden');
          }
        });

        container.querySelectorAll('.btn-emoji-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const emoji = btn.getAttribute('data-emoji');
            if (chatInput) {
              chatInput.value += emoji;
              chatInput.focus();
            }
            emojiPopover.classList.add('hidden');
          });
        });
      }

      // Bind Right-Click (desktop) and Long-Press (mobile) on message bubbles
      container.querySelectorAll('.msg-bubble-item').forEach(bubble => {
        const msgId = bubble.getAttribute('data-msg-id');
        const msg = activeConv.messages ? activeConv.messages.find(m => m.id === msgId) : null;
        if (!msg) return;

        // Desktop Right-Click
        bubble.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          openMsgContextMenu(e.clientX, e.clientY, msg, activeConvId, renderChat);
        });

        // Mobile Long-Press
        let touchTimer = null;
        bubble.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches[0]) {
            const touch = e.touches[0];
            touchTimer = setTimeout(() => {
              openMsgContextMenu(touch.clientX, touch.clientY, msg, activeConvId, renderChat);
            }, 500);
          }
        }, { passive: true });

        bubble.addEventListener('touchend', () => {
          if (touchTimer) clearTimeout(touchTimer);
        });

        bubble.addEventListener('touchmove', () => {
          if (touchTimer) clearTimeout(touchTimer);
        });
      });

      // Edit Message hover button binding
      container.querySelectorAll('.btn-edit-msg').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const msgId = btn.getAttribute('data-msg-id');
          const currentText = btn.getAttribute('data-text');
          openEditMsgModal(currentText, (newText) => {
            store.editMessage(activeConvId, msgId, newText);
            renderChat();
          });
        });
      });

      // Delete Message hover button binding
      container.querySelectorAll('.btn-delete-msg').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const msgId = btn.getAttribute('data-msg-id');
          openDeleteMsgModal(() => {
            store.deleteMessage(activeConvId, msgId);
            renderChat();
          });
        });
      });

      container.querySelector('#form-send-chat').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = container.querySelector('#chat-input').value.trim();
        if (text) {
          store.sendMessage(activeConvId, text);
          renderChat();
        }
      });
    }

    renderChat();
  }

  // 9. SEARCH VIEW (Only Pro members are listed!)
  function renderSearchView(container, params) {
    let q = params.get('q') || '';
    let city = params.get('city') || '';

    function renderList() {
      const pros = store.getPros(q, city); // returns only isPro: true members

      container.innerHTML = `
        <div class="page-container space-y-8">
          <div class="max-w-3xl">
            <span class="badge badge-pro mb-3">ANNUAIRE GÉOGRAPHIQUE PHOTOGRAPHES PRO</span>
            <h1 class="text-3xl font-extrabold tracking-tight mb-2 text-white">Photographes Pro.</h1>
            <p class="text-sm text-slate-400">Recherchez les professionnels de l'image abonnés Pro par ville, spécialité et disponibilité.</p>
          </div>

          <div class="card p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" id="sq" class="form-input" value="${q}" placeholder="Spécialité (ex: Mode, UI/UX, Architecture)">
              <input type="text" id="sc" class="form-input" value="${city}" placeholder="Ville (ex: Paris, Lyon, Bruxelles)">
            </div>
          </div>

          <div class="flex flex-col gap-3">
            ${pros.map(pro => `
              <div class="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 card-hover border border-white/10 ${pro.isPro ? 'border-amber-500/30' : ''}">
                
                <!-- Left: Avatar + Name + Specialization (Clickable to view full profile) -->
                <div class="flex items-center gap-4 min-w-0 flex-1 cursor-pointer group btn-view-pro-search" data-id="${pro.id}" title="Cliquer pour voir le profil complet de ${pro.name}">
                  <div class="relative flex-shrink-0">
                    <img src="${pro.avatar}" class="avatar avatar-lg border border-amber-500/40 group-hover:scale-105 transition-transform">
                    <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121824] shadow-md shadow-emerald-500/50" title="En ligne"></span>
                  </div>
                  
                  <div class="min-w-0 space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-bold text-base text-white group-hover:text-sky-400 transition-colors truncate">${pro.name}</h3>
                      <span class="badge badge-pro text-[10px] px-2 py-0.5">PRO VÉRIFIÉ</span>
                    </div>
                    <div class="text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors truncate">${pro.role} • <span class="text-slate-400 font-normal">${pro.specialty}</span></div>
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                      <span class="inline-flex items-center gap-1 font-mono text-amber-400">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${pro.city}, ${pro.country}
                      </span>
                      <span>•</span>
                      <span class="text-emerald-400 font-mono font-semibold">${pro.phone || '+33 6 12 34 56 78'}</span>
                    </div>
                  </div>
                </div>

                <!-- Center Bio -->
                <div class="hidden lg:block text-xs text-slate-400 max-w-xs flex-1 line-clamp-2">
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

      if (window.lucide) window.lucide.createIcons();

      const inQ = container.querySelector('#sq');
      const inC = container.querySelector('#sc');
      const update = () => { q = inQ.value; city = inC.value; renderList(); };
      inQ.addEventListener('input', update);
      inC.addEventListener('input', update);

      container.querySelectorAll('.btn-view-pro-search').forEach(btn => {
        btn.addEventListener('click', () => {
          const pro = store.getProById(btn.getAttribute('data-id'));
          if (pro) openPublicProModal(pro);
        });
      });
    }

    renderList();
  }

  // 10. SUBSCRIPTION VIEW (Standard vs Pro with exact limits and features)
  function renderSubscriptionView(container) {
    const user = store.getUser();

    function render() {
      const isPro = user.plan === 'Pro';

      container.innerHTML = `
        <div class="page-container space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 class="text-2xl font-extrabold tracking-tight text-white">Gestion de votre Abonnement</h1>
              <p class="text-sm text-slate-400">Formule actuelle : <strong class="text-white">${user.plan}</strong></p>
            </div>
            <button id="btn-toggle-sub" class="btn ${isPro ? 'btn-outline' : 'btn-pro'} w-full sm:w-auto">
              <span>${isPro ? 'Rétrograder en Standard' : 'Passer à l\'Offre Pro (3 000 FCFA/mois)'}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <!-- Standard Plan Card -->
            <div class="card p-5 sm:p-8 flex flex-col justify-between ${!isPro ? 'border-2 border-sky-400' : ''}">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">Formule Standard</h3>
                <div class="text-3xl font-extrabold text-white mb-6">2 000 FCFA <span class="text-xs font-normal text-slate-400">/ mois</span></div>
                <ul class="space-y-3 text-sm text-slate-300 mb-8">
                  <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> <strong>Jusqu'à 4 Galeries clients actives</strong></li>
                  <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> <strong>Génération de liens directs & Quota de téléchargement</strong></li>
                  <li class="flex items-center gap-3"><i data-lucide="check" class="text-sky-400 w-4 h-4"></i> Création de factures & reçus conformes</li>
                  <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas d'accès à la messagerie privée Pro</li>
                  <li class="flex items-center gap-3 text-slate-500 line-through"><i data-lucide="x" class="w-4 h-4"></i> Pas de référencement dans l'annuaire Pro</li>
                </ul>
              </div>
              ${!isPro ? `<span class="badge badge-accent self-center">VOTRE PLAN ACTIF</span>` : ''}
            </div>

            <!-- Pro Plan Card -->
            <div class="card card-pro p-5 sm:p-8 flex flex-col justify-between ${isPro ? 'border-2 border-amber-400' : ''}">
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
        const targetPlan = user.plan === 'Pro' ? 'Standard' : 'Pro';
        openPlanConfirmModal(targetPlan, () => {
          const newPlan = store.togglePlan();
          openCustomToast(`✨ Formule mise à jour : vous êtes désormais en formule ${newPlan} !`, 'success');
          render();
        });
      });
    }

    render();
  }

  // 11. PROFILE VIEW
  function renderProfileView(container) {
    const user = store.getUser();

    container.innerHTML = `
      <div class="page-container space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">Mon Profil Professionnel</h1>
            <p class="text-sm text-slate-400">Personnalisez vos informations publiques.</p>
          </div>
          <button id="btn-save-prof" class="btn btn-primary w-full sm:w-auto">Enregistrer</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div class="card p-4 sm:p-6 text-center space-y-4">
            <div class="relative inline-block mx-auto group">
              <img id="p-avatar-img-prev" src="${user.avatar}" class="avatar avatar-xl mx-auto border-4 border-sky-400 object-cover">
              <button type="button" id="p-btn-pick-avatar" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-900 cursor-pointer transition-all hover:scale-110" title="Changer photo de profil">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
              <input type="file" id="p-file-avatar-input" accept="image/*" class="hidden">
            </div>
            <div>
              <h3 class="font-bold text-xl text-white">${user.name}</h3>
              <p class="text-sm text-sky-400 font-medium">${user.role}</p>
              <p class="text-xs text-slate-400 mt-1">${user.city}, ${user.country}</p>
            </div>
          </div>

          <div class="lg:col-span-2 card p-4 sm:p-6 space-y-4">
            <h3 class="font-bold text-lg text-white border-b border-white/10 pb-2">Informations Profil</h3>
            <form id="form-prof" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group"><label class="form-label">Nom complet</label><input type="text" id="p-name" class="form-input" value="${user.name}"></div>
                <div class="form-group"><label class="form-label">Spécialité / Métier</label><input type="text" id="p-role" class="form-input" value="${user.role}"></div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group"><label class="form-label">Ville</label><input type="text" id="p-city" class="form-input" value="${user.city}"></div>
                <div class="form-group"><label class="form-label">Pays</label><input type="text" id="p-country" class="form-input" value="${user.country}"></div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group"><label class="form-label">Adresse Email</label><input type="email" id="p-email" class="form-input" value="${user.email}"></div>
                <div class="form-group"><label class="form-label">Numéro WhatsApp / Téléphone</label><input type="tel" id="p-phone" class="form-input" value="${user.whatsapp || user.phone || ''}"></div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group"><label class="form-label">Pseudo Instagram (ex: @mon.studio)</label><input type="text" id="p-instagram" class="form-input" placeholder="julienmercer_studio" value="${user.instagram || ''}"></div>
                <div class="form-group"><label class="form-label">Site Portfolio</label><input type="url" id="p-website" class="form-input" value="${user.website || ''}"></div>
              </div>
              <div class="form-group"><label class="form-label">Biographie</label><textarea id="p-bio" class="form-textarea" rows="3">${user.bio}</textarea></div>
              <input type="hidden" id="p-avatar-url" value="${user.avatar}">
              <div class="border-t border-white/10 pt-4 space-y-3">
                <label class="form-label font-bold text-sky-400 flex items-center gap-2">
                  <i data-lucide="image" class="w-4 h-4"></i> Aperçu travaux récents (Max 3 photos)
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  ${[0, 1, 2].map(idx => {
                    const photoUrl = user.portfolio?.[idx] || '';
                    return `
                      <div class="space-y-1.5">
                        <div class="relative rounded-xl border border-white/10 overflow-hidden bg-slate-900 aspect-[4/3] group flex items-center justify-center">
                          <img id="p-img-prev-${idx}" src="${photoUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80'}" class="w-full h-full object-cover ${photoUrl ? '' : 'opacity-40'}">
                          <button type="button" class="p-btn-pick-port absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white text-xs font-semibold cursor-pointer" data-idx="${idx}">
                            <i data-lucide="upload-cloud" class="w-5 h-5 text-sky-400"></i>
                            <span>${photoUrl ? 'Changer' : 'Importer'}</span>
                          </button>
                          <input type="file" id="p-file-port-input-${idx}" accept="image/*" class="hidden">
                        </div>
                        <input type="hidden" id="p-port-${idx + 1}" value="${photoUrl}">
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Avatar upload binding
    const fileAvatarInput = container.querySelector('#p-file-avatar-input');
    const btnPickAvatar = container.querySelector('#p-btn-pick-avatar');
    const imgAvatarPrev = container.querySelector('#p-avatar-img-prev');
    const inputProfAvatar = container.querySelector('#p-avatar-url');

    if (btnPickAvatar) btnPickAvatar.addEventListener('click', () => fileAvatarInput && fileAvatarInput.click());
    if (fileAvatarInput) {
      fileAvatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (imgAvatarPrev) imgAvatarPrev.src = evt.target.result;
            if (inputProfAvatar) inputProfAvatar.value = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Portfolio uploads binding
    container.querySelectorAll('.p-btn-pick-port').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        const fileInput = container.querySelector(`#p-file-port-input-${idx}`);
        if (fileInput) fileInput.click();
      });
    });

    [0, 1, 2].forEach(idx => {
      const fileInput = container.querySelector(`#p-file-port-input-${idx}`);
      const imgPrev = container.querySelector(`#p-img-prev-${idx}`);
      const urlInput = container.querySelector(`#p-port-${idx + 1}`);
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (imgPrev) { imgPrev.src = evt.target.result; imgPrev.classList.remove('opacity-40'); }
              if (urlInput) urlInput.value = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    });

    container.querySelector('#btn-save-prof').addEventListener('click', () => {
      const p1 = container.querySelector('#p-port-1')?.value || '';
      const p2 = container.querySelector('#p-port-2')?.value || '';
      const p3 = container.querySelector('#p-port-3')?.value || '';
      const portfolio = [p1, p2, p3].filter(u => u.trim().length > 0).slice(0, 3);
      const avatar = container.querySelector('#p-avatar-url')?.value || user.avatar;

      store.updateProfile({
        name: container.querySelector('#p-name').value,
        role: container.querySelector('#p-role').value,
        city: container.querySelector('#p-city').value,
        country: container.querySelector('#p-country').value,
        email: container.querySelector('#p-email').value,
        phone: container.querySelector('#p-phone').value,
        whatsapp: container.querySelector('#p-phone').value,
        instagram: container.querySelector('#p-instagram').value,
        website: container.querySelector('#p-website').value,
        bio: container.querySelector('#p-bio').value,
        avatar,
        portfolio
      });
      openCustomToast('✨ Profil et travaux récents enregistrés avec succès !', 'success');
      renderProfileView(container);
    });
  }

  // ROUTER CONTROLLER
  class Router {
    constructor() {
      this.routes = {
        'landing': renderLandingView,
        'auth': renderAuthView,
        'dashboard': renderDashboardView,
        'galleries': renderGalleriesView,
        'gallery-detail': renderGalleryDetailView,
        'client-portal': renderClientPortalView,
        'notifications': renderNotificationsView,
        'invoices': renderInvoicesView,
        'community': renderCommunityView,
        'search': renderSearchView,
        'subscription': renderSubscriptionView,
        'profile': renderProfileView
      };

      window.addEventListener('hashchange', () => this.handleRoute());
    }

    handleRoute() {
      // Close all open modals on route change to prevent overlay blocks
      document.querySelectorAll('.modal-overlay, #public-pro-modal, #search-pro-modal, #directory-list-modal, #modal-preview-public, #image-lightbox-modal').forEach(m => {
        m.classList.add('hidden');
      });

      const rawHash = window.location.hash.slice(1) || 'landing';
      const [routePath, queryString] = rawHash.split('?');
      const params = new URLSearchParams(queryString || '');

      const renderer = this.routes[routePath] || this.routes['landing'];

      const sidebar = document.getElementById('main-sidebar');
      const publicHeader = document.getElementById('main-header');
      const mobileHeader = document.getElementById('mobile-top-header');
      const mobileNav = document.getElementById('mobile-bottom-nav');
      const appView = document.getElementById('app-view');

      const isPublic = (routePath === 'landing' || routePath === 'auth' || routePath === 'client-portal');

      if (isPublic) {
        if (sidebar) sidebar.classList.add('hidden');
        if (mobileNav) mobileNav.classList.add('hidden');
        if (mobileHeader) mobileHeader.classList.add('hidden');
        if (publicHeader) {
          if (routePath === 'client-portal') publicHeader.classList.add('hidden');
          else publicHeader.classList.remove('hidden');
        }
        if (appView) appView.className = routePath === 'client-portal' ? 'flex-1 w-full min-h-screen pt-0 bg-[#090D14]' : 'flex-1 w-full min-h-screen pt-16';
      } else {
        if (sidebar) sidebar.classList.remove('hidden');
        if (publicHeader) publicHeader.classList.add('hidden');
        if (mobileNav) mobileNav.classList.remove('hidden');
        if (mobileHeader) mobileHeader.classList.remove('hidden');
        if (appView) appView.className = 'flex-1 w-full min-h-screen bg-[#090D14]';
      }

      this.updateActiveNav(routePath);

      if (appView) {
        appView.innerHTML = '';
        renderer(appView, params);
      }

      if (window.lucide) window.lucide.createIcons();
      window.scrollTo(0, 0);
    }

    updateActiveNav(routePath) {
      document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
        if (el.getAttribute('data-route') === routePath) el.classList.add('active');
        else el.classList.remove('active');
      });

      const user = store.getUser();
      const notifs = store.getNotifications ? store.getNotifications().filter(n => !n.read) : [];
      const convs = store.getConversations ? store.getConversations().filter(c => c.unread) : [];

      const unreadNotifBadge = document.getElementById('unread-notifs-badge');
      if (unreadNotifBadge) {
        if (notifs.length > 0) {
          unreadNotifBadge.textContent = notifs.length;
          unreadNotifBadge.classList.remove('hidden');
        } else {
          unreadNotifBadge.classList.add('hidden');
        }
      }

      const mobileNotifBadge = document.getElementById('mobile-unread-notifs-badge');
      if (mobileNotifBadge) {
        if (notifs.length > 0) {
          mobileNotifBadge.textContent = notifs.length;
          mobileNotifBadge.classList.remove('hidden');
        } else {
          mobileNotifBadge.classList.add('hidden');
        }
      }

      const unreadDmBadge = document.getElementById('unread-dms-badge');
      if (unreadDmBadge) {
        if (convs.length > 0) {
          unreadDmBadge.textContent = convs.length;
          unreadDmBadge.classList.remove('hidden');
        } else {
          unreadDmBadge.classList.add('hidden');
        }
      }

      const planLabel = document.getElementById('plan-label');
      const proBadge = document.getElementById('sidebar-pro-badge');
      const mobileProBadge = document.getElementById('mobile-pro-badge');
      const mobileAvatar = document.getElementById('mobile-user-avatar');

      if (planLabel) planLabel.textContent = user.plan;
      if (proBadge) {
        if (user.plan === 'Pro') proBadge.classList.remove('hidden');
        else proBadge.classList.add('hidden');
      }
      if (mobileProBadge) {
        if (user.plan === 'Pro') mobileProBadge.classList.remove('hidden');
        else mobileProBadge.classList.add('hidden');
      }
      if (mobileAvatar && user.avatar) {
        mobileAvatar.src = user.avatar;
      }
    }

    navigate(path, paramsObj = {}) {
      const query = new URLSearchParams(paramsObj).toString();
      window.location.hash = query ? `${path}?${query}` : path;
    }
  }

  const router = new Router();

  // APP INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    const updateSidebarUser = (user) => {
      const avatarEl = document.getElementById('sidebar-user-avatar');
      const nameEl = document.getElementById('sidebar-user-name');
      const roleEl = document.getElementById('sidebar-user-role');
      if (avatarEl) avatarEl.src = user.avatar;
      if (nameEl) nameEl.textContent = user.name;
      if (roleEl) roleEl.textContent = user.role;
    };

    store.subscribe((state) => updateSidebarUser(state.currentUser));
    updateSidebarUser(store.getUser());

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.updateProfile({ isLoggedIn: false });
        router.navigate('landing');
      });
    }

    // Trigger initial route renderer
    router.handleRoute();
  });

})();
