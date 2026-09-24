/* ==========================================================================
   KAPTUR — STATE STORE & LOCAL STORAGE MANAGER
   ========================================================================== */

const STORAGE_KEY = 'kaptur_app_state_v2';

// Initial Mock Seed Data
const defaultState = {
  currentUser: {
    id: 'usr_101',
    name: 'Julien Mercer',
    email: 'julien.mercer@kaptur.studio',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    instagram: 'julienmercer_studio',
    role: 'Photographe',
    specialty: 'Portrait & Mode',
    city: 'Paris',
    country: 'France',
    bio: 'Photographe professionnel basé à Paris. Spécialisé dans les portraits éditoriaux, la mode haute couture et la création d\'images de marque à forte identité.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    website: 'https://julienmercer.com',
    plan: 'Pro', // 'Standard' or 'Pro'
    equipment: ['Canon EOS R5', 'RF 85mm f/1.2L', 'Profoto B10X', 'Lightroom Classic', 'Capture One Pro'],
    portfolio: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
    ],
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
      pin: '4829',
      isPasswordProtected: true,
      allowDownloads: true,
      viewsCount: 142,
      downloadsCount: 38,
      shareToken: 'vogue-automne-2026',
      photos: [
        { id: 'p1', title: 'Look 01 - Robe Soie', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80', size: '14.2 MB' },
        { id: 'p2', title: 'Look 02 - Manteau Laine', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80', size: '18.6 MB' },
        { id: 'p3', title: 'Portrait Cadré', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80', size: '16.1 MB' },
        { id: 'p4', title: 'Accessoires Cuir', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&auto=format&fit=crop&q=80', size: '12.4 MB' },
        { id: 'p5', title: 'Lumière Naturelle Studio', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80', size: '15.9 MB' }
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
      pin: '1234',
      isPasswordProtected: true,
      allowDownloads: true,
      viewsCount: 389,
      downloadsCount: 194,
      shareToken: 'elodie-thomas-mariage',
      photos: [
        { id: 'p6', title: 'Cérémonie Laïque', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80', size: '11.8 MB' },
        { id: 'p7', title: 'Échange des Alliances', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80', size: '13.5 MB' },
        { id: 'p8', title: 'Vin d\'Honneur', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&auto=format&fit=crop&q=80', size: '15.1 MB' }
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
      pin: '9988',
      isPasswordProtected: false,
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
      message: 'Élodie Vasseur a téléchargé 45 photos Haute Définition de la galerie "Mariage Domaine de Chamarande".',
      timestamp: 'Il y a 15 minutes',
      read: false
    },
    {
      id: 'n2',
      type: 'dm',
      title: 'Nouveau message privé Pro',
      message: 'Camille Roche (Photographe Mode) vous a envoyé un message : "Bonjour Julien, es-tu disponible pour un shooting de marque à Lyon ?"',
      timestamp: 'Il y a 2 heures',
      read: false
    },
    {
      id: 'n3',
      type: 'invoice',
      title: 'Facture Payée',
      message: 'La facture #KAP-2026-042 (1 850,00 €) a été réglée par Maison de Haute Couture Lumière.',
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
      status: 'Paid', // Paid, Pending, Overdue
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
        specialty: 'Branding & Identité visuelle',
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
      phone: '+33 6 12 34 56 78',
      whatsapp: '+33612345678',
      instagram: 'julienmercer_studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      isPro: true,
      isOnline: true,
      bio: 'Portraits éditoriaux & campagnes de mode.',
      cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pro_201',
      name: 'Camille Roche',
      role: 'Directrice Artistique',
      specialty: 'Branding & Design UI',
      city: 'Lyon',
      country: 'France',
      phone: '+33 6 98 76 54 32',
      whatsapp: '+33698765432',
      instagram: 'camille_roche_da',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      isPro: true,
      isOnline: true,
      bio: 'Création d\'identités visuelles luxe & minimalistes.',
      cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pro_202',
      name: 'Marc-Antoine Duprès',
      role: 'Photographe Architecture',
      specialty: 'Immobilier & Intérieurs',
      city: 'Bruxelles',
      country: 'Belgique',
      phone: '+32 470 12 34 56',
      whatsapp: '+32470123456',
      instagram: 'marcantoine_archi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      isPro: true,
      bio: 'Photographie d\'espaces contemporains et d\'hôtels de prestige.',
      cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pro_203',
      name: 'Sophie Moreau',
      role: 'Photographe Événementiel',
      specialty: 'Édition & Packaging',
      city: 'Marseille',
      country: 'France',
      phone: '+33 6 55 44 33 22',
      whatsapp: '+33655443322',
      instagram: 'sophiemoreau_design',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      isPro: true,
      bio: 'Design de livres d\'art, catalogues et identités de marques.',
      cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pro_204',
      name: 'Alexandre Fontaine',
      role: 'Photographe Culinaire & Lifestyle',
      specialty: 'Gastronomie & Hospitality',
      city: 'Genève',
      country: 'Suisse',
      phone: '+41 22 123 45 67',
      whatsapp: '+41221234567',
      instagram: 'alexandre_fontaine_food',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      isPro: true,
      bio: 'Mise en lumière des créations de chefs étoilés et domaines viticoles.',
      cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80'
      ]
    }
  ],

  conversations: [
    {
      id: 'conv_201',
      otherPro: {
        id: 'pro_201',
        name: 'Camille Roche',
        role: 'Directrice Artistique',
        specialty: 'Branding & Design UI',
        city: 'Lyon',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        isPro: true,
        isOnline: true
      },
      lastMessage: 'Je suis disponible pour la collab le mois prochain !',
      lastTimestamp: '10:42',
      unread: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Bonjour Julien, as-tu des dispos pour un projet à Lyon ?', timestamp: '10:30' },
        { id: 'm2', sender: 'me', text: 'Salut Camille ! Oui complètement, de quel type de shooting s\'agit-il ?', timestamp: '10:35' },
        { id: 'm3', sender: 'them', text: 'Je suis disponible pour la collab le mois prochain !', timestamp: '10:42' }
      ]
    }
  ]
};

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
        if (!Array.isArray(state.conversations) || state.conversations.length === 0) {
          state.conversations = JSON.parse(JSON.stringify(defaultState.conversations));
        }
        return state;
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
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

  // Action Methods
  getUser() {
    return this.state.currentUser;
  }

  updateProfile(profileData) {
    this.state.currentUser = { ...this.state.currentUser, ...profileData };
    if (this.state.prosDirectory) {
      const idx = this.state.prosDirectory.findIndex(p => p.id === this.state.currentUser.id);
      if (idx !== -1) {
        this.state.prosDirectory[idx] = { ...this.state.prosDirectory[idx], ...profileData };
      }
    }
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
      if (window.openAlertModal) {
        window.openAlertModal({
          title: "Limite d'archivage atteinte",
          message: "Vous pouvez avoir au maximum 2 galeries archivées en même temps. Veuillez restaurer ou supprimer définitivement une galerie archivée d'abord.",
          icon: "archive"
        });
      } else if (window.openCustomToast) {
        window.openCustomToast("Limite archivage atteinte ! Vous pouvez avoir au maximum 2 galeries archivées en même temps.", "warning");
      }
      return false;
    }
    const g = this.getGalleryById(id);
    if (g) {
      g.status = 'archived';
      g.archivedDate = new Date().toISOString();
      this.addNotification({
        type: 'system',
        title: 'Galerie Archivée',
        message: `La galerie "${g.title}" a été archivée. Une place active a été libérée.`
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
      if (window.openAlertModal) {
        window.openAlertModal({
          title: "Limite de Galeries Actives Atteinte",
          message: `Votre formule ${user.plan} autorise jusqu'à ${maxActive} galeries actives. Veuillez archiver ou supprimer une galerie active avant de pouvoir restaurer cette galerie.`,
          icon: "zap"
        });
      } else if (window.openCustomToast) {
        window.openCustomToast(`Limite de galeries actives atteinte (${maxActive} max pour votre formule ${user.plan}). Veuillez archiver ou supprimer une galerie active.`, 'warning');
      }
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

  addGallery(galleryData) {
    this.checkExpiredArchives();
    const user = this.getUser();
    const activeCount = this.getActiveGalleries().length;
    const maxLimit = user.plan === 'Pro' ? 6 : 4;

    if (activeCount >= maxLimit) {
      if (window.openAlertModal) {
        window.openAlertModal({
          title: "Limite de Galeries Actives Atteinte",
          message: `Votre formule ${user.plan} autorise jusqu'à ${maxLimit} galeries actives simultanément. Vous pouvez archiver une galerie active pour libérer une place, ou passer à l'offre Pro.`,
          icon: "zap"
        });
      } else if (window.openCustomToast) {
        window.openCustomToast(`Limite de galeries actives atteinte ! Votre formule ${user.plan} autorise jusqu'à ${maxLimit} galeries actives simultanément.`, 'warning');
      }
      return null;
    }

    const newId = 'gal_' + Date.now();
    const newGallery = {
      id: newId,
      title: galleryData.title || 'Nouvelle Galerie',
      clientName: galleryData.clientName || 'Client',
      clientEmail: galleryData.clientEmail || '',
      coverImage: galleryData.coverImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: galleryData.expiryDate || '2026-12-31',
      status: 'active',
      pin: galleryData.pin || '1234',
      isPasswordProtected: !!galleryData.pin,
      allowDownloads: true,
      viewsCount: 0,
      downloadsCount: 0,
      shareToken: (galleryData.title || 'galerie').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random()*1000),
      photos: Array.isArray(galleryData.photos) ? galleryData.photos : []
    };
    this.state.galleries.unshift(newGallery);
    
    // Add activity notification
    this.addNotification({
      type: 'system',
      title: 'Galerie Créée',
      message: `La galerie "${newGallery.title}" a été publiée.`
    });

    this.saveState();
    return newGallery;
  }

  incrementGalleryView(galleryId) {
    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      gallery.viewsCount = (gallery.viewsCount || 0) + 1;
      this.saveState();
    }
  }

  incrementGalleryDownload(galleryId, photoCount = 1) {
    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      gallery.downloadsCount = (gallery.downloadsCount || 0) + photoCount;
      this.addNotification({
        type: 'download',
        title: 'Téléchargement Client',
        message: `${gallery.clientName} a téléchargé ${photoCount} photo(s) HD de la galerie "${gallery.title}".`
      });
      this.saveState();
    }
  }

  getNotifications() {
    return this.state.notifications;
  }

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

  getInvoices() {
    return this.state.invoices;
  }

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
      message: `La facture ${newInv.number} pour ${newInv.clientName} (${newInv.total.toFixed(0)} €) a été créée.`
    });
    this.saveState();
    return newInv;
  }

  getProById(id) {
    if (!Array.isArray(this.state.prosDirectory)) return null;
    return this.state.prosDirectory.find(p => p.id === id);
  }

  getConversations() {
    if (!Array.isArray(this.state.conversations)) {
      this.state.conversations = JSON.parse(JSON.stringify(defaultState.conversations || []));
    }
    return this.state.conversations;
  }

  getOrCreateConversation(proOrId) {
    if (!Array.isArray(this.state.conversations)) {
      this.state.conversations = JSON.parse(JSON.stringify(defaultState.conversations || []));
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
          country: pro.country,
          avatar: pro.avatar,
          isPro: pro.isPro !== false,
          isOnline: pro.isOnline !== false
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

  getPros(query = '', cityFilter = '', proOnly = false) {
    return this.state.prosDirectory.filter(pro => {
      const matchQuery = !query || pro.name.toLowerCase().includes(query.toLowerCase()) || pro.specialty.toLowerCase().includes(query.toLowerCase()) || pro.role.toLowerCase().includes(query.toLowerCase());
      const matchCity = !cityFilter || pro.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchPro = !proOnly || pro.isPro;
      return matchQuery && matchCity && matchPro;
    });
  }

  resetDemoState() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }
}

export const store = new Store();
