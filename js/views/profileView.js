/* ==========================================================================
   KAPTUR — PROFESSIONAL PROFILE & SETTINGS VIEW
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderProfileView(container) {
  const user = store.getUser();

  container.innerHTML = `
    <div class="page-container space-y-8">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight">Mon Profil Professionnel</h1>
          <p class="text-sm text-muted">Personnalisez votre fiche publique visible dans l'annuaire géographique Kaptur Pro.</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-preview-public" class="btn btn-outline">
            <i data-lucide="eye"></i>
            <span>Aperçu de ma fiche publique</span>
          </button>
          <button id="btn-save-profile" class="btn btn-primary">
            <i data-lucide="save"></i>
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      <!-- Profile Form Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <!-- Avatar & Quick Overview (1 col) -->
        <div class="space-y-6">
          <div class="card p-6 text-center space-y-4">
            <div class="relative inline-block mx-auto group">
              <img id="img-avatar-preview" src="${user.avatar}" alt="${user.name}" class="avatar avatar-xl border-4 border-sky-400 mx-auto object-cover">
              <button type="button" id="btn-pick-avatar" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-900 cursor-pointer transition-all hover:scale-110" title="Changer ma photo de profil">
                <i data-lucide="camera" class="w-4 h-4"></i>
              </button>
              <input type="file" id="file-avatar-input" accept="image/*" class="hidden">
            </div>

            <div>
              <h3 class="font-bold text-xl text-main">${user.name}</h3>
              <p class="text-sm text-accent font-medium">${user.role}</p>
              <p class="text-xs text-subtle mt-1">${user.city}, ${user.country}</p>
            </div>

            <div class="pt-4 border-t border-border-subtle text-xs text-muted space-y-2 text-left">
              <div class="flex items-center justify-between">
                <span>Site internet :</span>
                <a href="${user.website}" target="_blank" class="text-accent hover:underline truncate max-w-[160px]">${user.website}</a>
              </div>
              <div class="flex items-center justify-between">
                <span>Email :</span>
                <span class="text-main truncate max-w-[160px]">${user.email}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>WhatsApp :</span>
                <span class="text-emerald-400 font-semibold truncate max-w-[160px]">${user.whatsapp || user.phone || 'Non renseigné'}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Instagram :</span>
                <span class="text-pink-400 font-semibold truncate max-w-[160px]">${user.instagram ? '@' + user.instagram.replace(/^@/, '') : 'Non renseigné'}</span>
              </div>
            </div>
          </div>

          <!-- Danger Zone Reset State -->
          <div class="card p-4 border-red-500/20 bg-red-500/5 space-y-2">
            <div class="font-bold text-sm text-danger">Réinitialiser les données démo</div>
            <p class="text-xs text-muted">Efface le stockage local et réinitialise l'application aux données d'origine.</p>
            <button id="btn-reset-app" class="btn btn-danger btn-sm w-full mt-2">Réinitialiser la démo</button>
          </div>
        </div>

        <!-- Detailed Form (2 cols) -->
        <div class="lg:col-span-2 card p-6 space-y-6">
          <h3 class="font-bold text-lg border-b border-border-subtle pb-3">Informations Générales</h3>

          <form id="form-profile-settings" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Nom et Prénom</label>
                <input type="text" id="prof-name" class="form-input" value="${user.name}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Spécialité / Métier</label>
                <input type="text" id="prof-role" class="form-input" value="${user.role}" required>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Ville</label>
                <input type="text" id="prof-city" class="form-input" value="${user.city}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Pays</label>
                <input type="text" id="prof-country" class="form-input" value="${user.country}" required>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Adresse Email</label>
                <input type="email" id="prof-email" class="form-input" value="${user.email}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Numéro WhatsApp / Téléphone (ex: +221 77 123 45 67)</label>
                <input type="tel" id="prof-phone" class="form-input" value="${user.whatsapp || user.phone || ''}">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Identifiant Instagram (ex: @mon.studio)</label>
                <input type="text" id="prof-instagram" class="form-input" placeholder="ex: julienmercer_studio" value="${user.instagram || ''}">
              </div>

              <div class="form-group">
                <label class="form-label">Site Portfolio (Optionnel)</label>
                <input type="url" id="prof-website" class="form-input" value="${user.website || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Biographie / Présentation</label>
              <textarea id="prof-bio" class="form-textarea" rows="4">${user.bio}</textarea>
            </div>

            <input type="hidden" id="prof-avatar" value="${user.avatar}">

            <!-- Portfolio Photos Section (Max 3 Photos with Native File Pickers) -->
            <div class="border-t border-border-subtle pt-5 space-y-4">
              <div>
                <h4 class="font-bold text-sm text-main flex items-center gap-2">
                  <i data-lucide="image" class="w-4 h-4 text-accent"></i>
                  Aperçu de mes travaux récents (3 photos Max)
                </h4>
                <p class="text-xs text-muted mt-0.5">Cliquez sur un emplacement pour choisir une photo depuis votre appareil.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                ${[0, 1, 2].map(idx => {
                  const photoUrl = user.portfolio?.[idx] || '';
                  return `
                    <div class="space-y-2">
                      <label class="form-label text-xs font-bold text-slate-300">Photo ${idx + 1}</label>
                      <div class="relative rounded-xl border border-border-subtle overflow-hidden bg-surface-subtle aspect-[4/3] group flex items-center justify-center shadow-md">
                        <img id="img-port-prev-${idx}" src="${photoUrl || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80'}" class="w-full h-full object-cover ${photoUrl ? '' : 'opacity-40'}">
                        
                        <button type="button" class="btn-pick-port-file absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity text-white text-xs font-semibold cursor-pointer" data-index="${idx}">
                          <i data-lucide="upload-cloud" class="w-6 h-6 text-sky-400"></i>
                          <span>${photoUrl ? 'Changer photo' : 'Importer photo'}</span>
                        </button>

                        <input type="file" id="file-port-input-${idx}" accept="image/*" class="hidden">
                      </div>
                      <input type="hidden" id="prof-port-${idx + 1}" value="${photoUrl}">
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </form>
        </div>

      </div>

    </div>>

      </div>

    </div>

    <!-- PUBLIC PROFILE PREVIEW MODAL -->
    <div id="modal-preview-public" class="modal-overlay hidden">
      <div class="modal-card max-w-2xl bg-surface border border-border-strong p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-border-subtle pb-4">
          <span class="text-xs font-bold text-subtle uppercase tracking-wider">Aperçu Public Fiche Créateur</span>
          <button id="btn-close-public-modal" class="btn-icon btn-ghost text-muted">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="flex items-center gap-6">
          <img src="${user.avatar}" alt="${user.name}" class="avatar avatar-xl border-2 border-accent flex-shrink-0">
          <div class="space-y-2">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-extrabold text-main">${user.name}</h2>
                <span class="badge ${user.plan === 'Pro' ? 'badge-pro' : 'badge-subtle'}">${user.plan}</span>
              </div>
              <p class="text-sm text-accent font-semibold">${user.role}</p>
            </div>

            <!-- Compact Phone & Social Buttons Row (Aligned in 1 Row) -->
            <div class="flex items-center gap-2 pt-1 flex-nowrap overflow-x-auto">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-emerald-400 font-mono text-xs font-bold whitespace-nowrap shrink-0">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>${user.whatsapp || user.phone || 'Non renseigné'}</span>
              </span>

              <a href="https://wa.me/${(user.whatsapp || user.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-sm bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>WhatsApp</span>
              </a>

              ${user.instagram ? `
                <a href="https://instagram.com/${user.instagram.replace(/^@/, '')}" target="_blank" class="btn btn-sm bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0">
                  <i data-lucide="instagram" class="w-3.5 h-3.5"></i>
                  <span>Instagram</span>
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <p class="text-sm text-muted bg-surface-subtle p-4 rounded-xl border border-border-subtle">${user.bio}</p>

        <!-- Portfolio Preview (Max 3 Photos - Clickable Lightbox) -->
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-subtle mb-3 flex items-center justify-between">
            <span>Aperçu des travaux récents</span>
            <span class="text-xs text-muted font-normal">(Cliquez sur une photo pour l'agrandir)</span>
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${(user.portfolio || []).slice(0, 3).map((img, idx) => `
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
          <button id="btn-close-public-modal-2" class="btn btn-secondary w-full sm:w-auto">Fermer l'aperçu</button>
        </div>
      </div>
    </div>
  `;

  // Bind save profile
  const btnSave = container.querySelector('#btn-save-profile');
  btnSave.addEventListener('click', () => {
    const name = container.querySelector('#prof-name').value;
    const role = container.querySelector('#prof-role').value;
    const city = container.querySelector('#prof-city').value;
    const country = container.querySelector('#prof-country').value;
    const email = container.querySelector('#prof-email').value;
    const phone = container.querySelector('#prof-phone').value;
    const whatsapp = container.querySelector('#prof-phone').value;
    const instagram = container.querySelector('#prof-instagram').value;
    const website = container.querySelector('#prof-website').value;
    const bio = container.querySelector('#prof-bio').value;
    const avatar = container.querySelector('#prof-avatar').value;

    const p1 = container.querySelector('#prof-port-1')?.value || '';
    const p2 = container.querySelector('#prof-port-2')?.value || '';
    const p3 = container.querySelector('#prof-port-3')?.value || '';
    const portfolio = [p1, p2, p3].filter(u => u.trim().length > 0).slice(0, 3);

    store.updateProfile({ name, role, city, country, email, phone, whatsapp, instagram, website, bio, avatar, portfolio });
    if (window.openCustomToast) {
      window.openCustomToast('✨ Profil et travaux récents enregistrés avec succès !', 'success');
    }
    renderProfileView(container);
  });

  // Avatar file picker binding
  const fileAvatarInput = container.querySelector('#file-avatar-input');
  const btnPickAvatar = container.querySelector('#btn-pick-avatar');
  const btnBrowseAvatar = container.querySelector('#btn-browse-avatar');
  const imgAvatarPrev = container.querySelector('#img-avatar-preview');
  const inputProfAvatar = container.querySelector('#prof-avatar');

  const triggerAvatarPick = () => fileAvatarInput && fileAvatarInput.click();
  if (btnPickAvatar) btnPickAvatar.addEventListener('click', triggerAvatarPick);
  if (btnBrowseAvatar) btnBrowseAvatar.addEventListener('click', triggerAvatarPick);

  if (fileAvatarInput) {
    fileAvatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          if (imgAvatarPrev) imgAvatarPrev.src = dataUrl;
          if (inputProfAvatar) inputProfAvatar.value = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Portfolio file pickers binding (3 photos)
  container.querySelectorAll('.btn-pick-port-file').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const fileInput = container.querySelector(`#file-port-input-${idx}`);
      if (fileInput) fileInput.click();
    });
  });

  [0, 1, 2].forEach(idx => {
    const fileInput = container.querySelector(`#file-port-input-${idx}`);
    const imgPrev = container.querySelector(`#img-port-prev-${idx}`);
    const urlInput = container.querySelector(`#prof-port-${idx + 1}`);

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            if (imgPrev) {
              imgPrev.src = dataUrl;
              imgPrev.classList.remove('opacity-40');
            }
            if (urlInput) urlInput.value = dataUrl;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // Bind Modal Preview Public
  const modalPublic = container.querySelector('#modal-preview-public');
  const btnPrev = container.querySelector('#btn-preview-public');
  const btnClose1 = container.querySelector('#btn-close-public-modal');
  const btnClose2 = container.querySelector('#btn-close-public-modal-2');

  btnPrev.addEventListener('click', () => modalPublic.classList.remove('hidden'));
  btnClose1.addEventListener('click', () => modalPublic.classList.add('hidden'));
  btnClose2.addEventListener('click', () => modalPublic.classList.add('hidden'));

  modalPublic.querySelectorAll('.btn-zoom-portfolio-img').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index') || '0', 10);
      const userPort = (user.portfolio || []).slice(0, 3);
      if (window.openImageLightboxModal) {
        window.openImageLightboxModal(userPort, idx, user.name);
      }
    });
  });

  // Reset App State
  const btnReset = container.querySelector('#btn-reset-app');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (window.openConfirmModal) {
        window.openConfirmModal({
          title: 'Réinitialiser la démo ?',
          message: 'Voulez-vous vraiment réinitialiser toutes les données de l\'application aux réglages d\'usine ? Cette action effacera vos modifications locales.',
          confirmText: 'Réinitialiser',
          cancelText: 'Annuler',
          isDanger: true,
          icon: 'rotate-ccw',
          onConfirm: () => {
            store.resetDemoState();
            window.location.reload();
          }
        });
      } else if (confirm('Voulez-vous vraiment réinitialiser toutes les données de l\'application aux réglages d\'usine ?')) {
        store.resetDemoState();
        window.location.reload();
      }
    });
  }
}
