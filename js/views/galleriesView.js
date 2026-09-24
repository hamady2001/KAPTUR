/* ==========================================================================
   KAPTUR — GALLERIES & PHOTO MANAGEMENT VIEW
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderGalleriesView(container, params) {
  const galleries = store.getGalleries();
  const showNewModal = params.get('action') === 'new';

  container.innerHTML = `
    <div class="page-container space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight">Vos Galeries Clients</h1>
          <p class="text-sm text-muted">Gérez vos collections de photos, définissez les mots de passe et générez des liens d'accès.</p>
        </div>

        <button id="btn-create-gallery" class="btn btn-primary">
          <i data-lucide="plus"></i>
          <span>Créer une galerie</span>
        </button>
      </div>

      <!-- Galleries Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${galleries.map(g => {
          const cardCover = (g.photos && g.photos.length > 0 && g.photos[0].url)
            ? g.photos[0].url
            : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';
          return `
          <div class="card p-4 space-y-4 card-hover">
            <div class="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
              <img src="${cardCover}" alt="${g.title}" class="w-full h-full object-cover">
              <div class="absolute top-2 right-2 flex gap-1">
                <span class="badge ${g.isPasswordProtected ? 'badge-success' : 'badge-subtle'}">
                  <i data-lucide="${g.isPasswordProtected ? 'lock' : 'globe'}" class="w-3 h-3"></i>
                  ${g.isPasswordProtected ? 'PIN: ' + g.pin : 'Accès Public'}
                </span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-xs text-subtle mb-1">
                <span>Créée le ${g.createdDate}</span>
                <span>Expire le ${g.expiryDate}</span>
              </div>
              <h3 class="font-bold text-lg truncate">${g.title}</h3>
              <p class="text-sm text-muted truncate">${g.clientName} (${g.clientEmail || 'Sans email'})</p>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-2 p-2 rounded-lg bg-surface-subtle text-center text-xs">
              <div>
                <div class="font-bold text-main">${g.photos.length}</div>
                <div class="text-subtle">Photos</div>
              </div>
              <div>
                <div class="font-bold text-accent">${g.viewsCount}</div>
                <div class="text-subtle">Vues</div>
              </div>
              <div>
                <div class="font-bold text-emerald-400">${g.downloadsCount}</div>
                <div class="text-subtle">Downloads</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-2 border-t border-border-subtle">
              <button class="btn btn-secondary btn-sm flex-1 btn-open-gallery" data-id="${g.id}">
                <i data-lucide="folder-open" class="w-3.5 h-3.5"></i> Gérer
              </button>
              <a href="#client-portal?token=${g.shareToken}" class="btn btn-outline btn-sm btn-icon" title="Voir comme le client">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </a>
              <button class="btn btn-outline btn-sm btn-icon btn-copy-share" data-token="${g.shareToken}" title="Copier le lien d'accès">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
          `;
        }).join('')}
      </div>

    </div>

    <!-- CREATE GALLERY MODAL -->
    <div id="new-gallery-modal" class="modal-overlay ${showNewModal ? '' : 'hidden'}">
      <div class="modal-card">
        <div class="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
          <h3 class="text-xl font-bold">Créer une nouvelle galerie client</h3>
          <button id="btn-close-modal" class="btn-icon btn-ghost text-muted hover:text-main">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form id="form-new-gallery" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Titre du shooting / projet</label>
            <input type="text" id="g-title" class="form-input" placeholder="Ex: Shooting Lookbook Printemps" required>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Nom du Client</label>
              <input type="text" id="g-client-name" class="form-input" placeholder="Ex: Marque Horizon" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email Client (Notifications)</label>
              <input type="email" id="g-client-email" class="form-input" placeholder="client@horizon.com">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Code PIN de protection (4 chiffres)</label>
              <input type="text" id="g-pin" class="form-input" placeholder="1234" maxlength="4" value="4829">
            </div>
            <div class="form-group">
              <label class="form-label">Date d'expiration</label>
              <input type="date" id="g-expiry" class="form-input" value="2026-11-30">
            </div>
          </div>

          <!-- Drag & Drop Upload Zone Simulator -->
          <div class="form-group">
            <label class="form-label">Importation des photos HD</label>
            <div class="p-8 border-2 border-dashed border-border-strong rounded-xl text-center bg-surface-subtle/50 hover:bg-surface-subtle transition-colors cursor-pointer">
              <i data-lucide="upload-cloud" class="w-10 h-10 text-accent mx-auto mb-2"></i>
              <div class="font-semibold text-sm">Glissez-déposez vos fichiers JPG / PNG / RAW ici</div>
              <div class="text-xs text-subtle mt-1">Glissez jusqu'à 500 photos HD (Fichiers démo automatiques)</div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" id="btn-cancel-modal" class="btn btn-ghost">Annuler</button>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="check"></i>
              <span>Publier la Galerie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Bind Open Create Modal
  const modal = container.querySelector('#new-gallery-modal');
  const btnCreate = container.querySelector('#btn-create-gallery');
  const btnClose = container.querySelector('#btn-close-modal');
  const btnCancel = container.querySelector('#btn-cancel-modal');

  btnCreate.addEventListener('click', () => modal.classList.remove('hidden'));
  btnClose.addEventListener('click', () => modal.classList.add('hidden'));
  btnCancel.addEventListener('click', () => modal.classList.add('hidden'));

  // Form Submission
  const form = container.querySelector('#form-new-gallery');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = container.querySelector('#g-title').value;
    const clientName = container.querySelector('#g-client-name').value;
    const clientEmail = container.querySelector('#g-client-email').value;
    const pin = container.querySelector('#g-pin').value;
    const expiryDate = container.querySelector('#g-expiry').value;

    const newGal = store.addGallery({
      title,
      clientName,
      clientEmail,
      pin,
      expiryDate,
      coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    });

    modal.classList.add('hidden');
    router.navigate('gallery-detail', { id: newGal.id });
  });

  // Bind Gallery Detail click
  container.querySelectorAll('.btn-open-gallery').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      router.navigate('gallery-detail', { id });
    });
  });

  // Copy share links
  container.querySelectorAll('.btn-copy-share').forEach(btn => {
    btn.addEventListener('click', () => {
      const token = btn.getAttribute('data-token');
      const url = `${window.location.origin}${window.location.pathname}#client-portal?token=${token}`;
      navigator.clipboard.writeText(url);
      if (window.openShareModal) {
        window.openShareModal({
          title: `Lien d'accès Client`,
          subtitle: 'Le lien d\'accès sécurisé à la galerie client a été copié.',
          url: url,
          shareToken: token
        });
      } else if (window.openCustomToast) {
        window.openCustomToast('✨ Lien d\'accès client copié dans le presse-papier !', 'success');
      }
    });
  });
}

// GALLERY DETAIL VIEW
export function renderGalleryDetailView(container, params) {
  const galleryId = params.get('id');
  const gallery = store.getGalleryById(galleryId) || store.getGalleries()[0];

  container.innerHTML = `
    <div class="page-container space-y-6">
      
      <!-- Top Navigation Bar -->
      <div class="flex items-center justify-between border-b border-border-subtle pb-4">
        <div class="flex items-center gap-3">
          <a href="#galleries" class="btn-icon btn-secondary" title="Retour aux galeries">
            <i data-lucide="arrow-left"></i>
          </a>
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight">${gallery.title}</h1>
            <p class="text-sm text-muted">Client : ${gallery.clientName} (${gallery.clientEmail || 'Aucun email'})</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a href="#client-portal?token=${gallery.shareToken}" class="btn btn-outline">
            <i data-lucide="external-link"></i>
            <span>Tester l'Espace Client</span>
          </a>
          <button id="btn-copy-client-link" class="btn btn-primary">
            <i data-lucide="link"></i>
            <span>Copier le lien Client</span>
          </button>
        </div>
      </div>

      <!-- Settings & Stats Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-accent-glow text-accent flex items-center justify-center">
            <i data-lucide="lock"></i>
          </div>
          <div>
            <div class="text-xs text-subtle">Code PIN Client</div>
            <div class="font-bold font-mono text-base">${gallery.pin || 'Aucun PIN'}</div>
          </div>
        </div>

        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <i data-lucide="eye"></i>
          </div>
          <div>
            <div class="text-xs text-subtle">Consultations Vues</div>
            <div class="font-bold text-base">${gallery.viewsCount} vues</div>
          </div>
        </div>

        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <i data-lucide="download"></i>
          </div>
          <div>
            <div class="text-xs text-subtle">Téléchargements HD</div>
            <div class="font-bold text-base">${gallery.downloadsCount} fois</div>
          </div>
        </div>

        <div class="card p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-subtle text-muted flex items-center justify-center">
            <i data-lucide="calendar"></i>
          </div>
          <div>
            <div class="text-xs text-subtle">Expiration</div>
            <div class="font-bold text-base">${gallery.expiryDate}</div>
          </div>
        </div>
      </div>

      <!-- Photo Grid -->
      <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <h2 class="text-lg font-bold">Photos dans cette galerie (${gallery.photos ? gallery.photos.length : 0})</h2>
          <button id="btn-add-more-photos" class="btn bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Importer des photos (PC/Mobile)</span>
          </button>
          <input type="file" id="g-detail-file-input" class="hidden" multiple accept="image/*">
        </div>

        <div class="photo-masonry-grid">
          ${gallery.photos ? gallery.photos.map((p, idx) => `
            <div class="photo-item group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900">
              <img src="${p.url}" alt="${p.title}">
              <div class="photo-actions opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-slate-950/60 p-4 flex items-center justify-center gap-2">
                <a href="${p.url}" target="_blank" class="btn-icon btn-secondary" title="Agrandir HD">
                  <i data-lucide="maximize-2"></i>
                </a>
                <button class="btn-icon bg-red-500/80 hover:bg-red-600 text-white btn-delete-photo-item" data-idx="${idx}" title="Supprimer la photo">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          `).join('') : ''}
        </div>
      </div>

    </div>
  `;

  // Bind copy link
  const btnCopy = container.querySelector('#btn-copy-client-link');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const url = `${window.location.origin}${window.location.pathname}#client-portal?token=${gallery.shareToken}`;
      navigator.clipboard.writeText(url);
      if (window.openShareModal) {
        window.openShareModal({
          title: `Lien Client`,
          subtitle: 'Le lien d\'accès sécurisé vers l\'espace client a été copié.',
          url: url,
          shareToken: gallery.shareToken
        });
      } else if (window.openCustomToast) {
        window.openCustomToast('✨ Lien Client copié dans le presse-papier !', 'success');
      }
    });
  }

  // Helper: Canvas Image Compressor for LocalStorage Safety
  function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (file.size <= 300 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onerror = (err) => reject(err);
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = (err) => reject(err);
        img.onload = () => {
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
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Bind real file photo import
  const btnAdd = container.querySelector('#btn-add-more-photos');
  const fileInputDetail = container.querySelector('#g-detail-file-input');

  if (btnAdd && fileInputDetail) {
    btnAdd.addEventListener('click', () => fileInputDetail.click());
    fileInputDetail.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
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
          store.addPhotosToGallery(gallery.id, newPhotos);
          renderGalleryDetailView(container, new URLSearchParams(`id=${gallery.id}`));
        }
      }
    });
  }

  // Bind delete single photo
  container.querySelectorAll('.btn-delete-photo-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (!isNaN(idx) && gallery.photos && gallery.photos[idx]) {
        if (window.openConfirmModal) {
          window.openConfirmModal({
            title: 'Supprimer cette photo ?',
            message: 'Voulez-vous vraiment retirer cette photo de la galerie ?',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            isDanger: true,
            icon: 'trash-2',
            onConfirm: () => {
              gallery.photos.splice(idx, 1);
              gallery.coverImage = (gallery.photos && gallery.photos.length > 0)
                ? gallery.photos[0].url
                : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';
              store.saveState();
              if (window.openToast) window.openToast('Photo supprimée de la galerie.', 'warning');
              renderGalleryDetailView(container, params);
            }
          });
        } else {
          gallery.photos.splice(idx, 1);
          gallery.coverImage = (gallery.photos && gallery.photos.length > 0)
            ? gallery.photos[0].url
            : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80';
          store.saveState();
          renderGalleryDetailView(container, params);
        }
      }
    });
  });
}
