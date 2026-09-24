/* ==========================================================================
   KAPTUR — CLIENT PORTAL / CLIENT SPACE VIEW
   ========================================================================== */

import { store } from '../store.js';

// Helper Modal: Custom Invoice PDF Preview & Direct Download Modal
function openInvoicePreviewModal(inv) {
  let modal = document.getElementById('preview-inv-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'preview-inv-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const photographer = store.getUser() || { name: 'Julien Mercer', role: 'Photographe Mode' };

  modal.innerHTML = `
    <div class="modal-card max-w-2xl bg-white text-slate-900 p-8 space-y-6 rounded-2xl shadow-2xl text-left border border-slate-200 animate-fade-in relative">
      
      <!-- Printable Invoice Container for PDF generator -->
      <div id="invoice-pdf-printable" class="space-y-6 bg-white p-2">
        
        <!-- Document Header -->
        <div class="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-extrabold text-2xl tracking-tight text-slate-900">KAPTUR</span>
              <span class="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">STUDIO PRO</span>
            </div>
            <p class="text-xs text-slate-500 font-semibold">${photographer.name} • ${photographer.role}</p>
            <p class="text-xs text-slate-500">${photographer.city || 'Paris'}, ${photographer.country || 'France'}</p>
          </div>

          <div class="text-right space-y-1">
            <span class="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">FACTURE ACQUITTÉE</span>
            <h2 class="text-xl font-bold font-mono text-slate-800 pt-1">${inv.number}</h2>
            <p class="text-xs text-slate-500">Émise le : ${inv.issueDate}</p>
          </div>
        </div>

        <!-- Bill To & Bill From Section -->
        <div class="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
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
        <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
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
        <div class="flex items-center justify-between pt-4 border-t border-slate-200">
          <div class="text-xs text-slate-500 space-y-1">
            <p>Document officiel émis via la plateforme Kaptur.</p>
            <p class="font-mono text-[11px]">TVA non applicable, art. 293 B du CGI</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-500 uppercase font-bold">Total Payé</div>
            <div class="text-2xl font-black text-slate-900 font-mono">${inv.total.toFixed(0)} €</div>
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

// Helper Modal: Photo Lightbox Carousel Modal with Next/Prev Arrows & Selection
function openPhotoLightboxModal(photos, initialIndex, selectedPhotoIds, onToggleSelect) {
  let currentIndex = initialIndex;

  let modal = document.getElementById('photo-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'photo-lightbox-modal';
    modal.className = 'modal-overlay z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  function updateView() {
    const photo = photos[currentIndex];
    const isSelected = selectedPhotoIds && typeof selectedPhotoIds.has === 'function' && selectedPhotoIds.has(photo.id || photo.url);

    modal.innerHTML = `
      <div class="relative max-w-5xl w-full flex flex-col items-center justify-center space-y-4 animate-fade-in">
        
        <!-- Top Bar: Counter + Select Toggle + Close -->
        <div class="w-full flex items-center justify-between text-white bg-slate-900/80 px-6 py-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
          <div class="text-xs font-mono text-slate-300">
            Photo <span class="font-bold text-sky-400 text-sm">${currentIndex + 1}</span> / ${photos.length}
          </div>

          <div class="flex items-center gap-4">
            <!-- Select Toggle Checkbox Button -->
            <button id="btn-lightbox-select" class="btn btn-sm ${isSelected ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'btn-secondary text-slate-300'} text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-2 transition-all">
              <i data-lucide="${isSelected ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
              <span>${isSelected ? 'Sélectionnée' : 'Sélectionner'}</span>
            </button>

            <!-- Close Lightbox -->
            <button id="btn-close-lightbox" class="btn-icon btn-ghost text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>
        </div>

        <!-- Main Image + Arrow Navigation -->
        <div class="relative w-full flex items-center justify-center min-h-[350px] max-h-[75vh]">
          
          <!-- Left Arrow -->
          <button id="btn-prev-lightbox" class="absolute left-3 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-sky-500 hover:border-sky-400 flex items-center justify-center transition-all shadow-xl">
            <i data-lucide="chevron-left" class="w-6 h-6"></i>
          </button>

          <!-- Image -->
          <img src="${photo.url}" alt="${photo.title || 'Photo HD'}" class="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-white/15 shadow-2xl">

          <!-- Right Arrow -->
          <button id="btn-next-lightbox" class="absolute right-3 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-sky-500 hover:border-sky-400 flex items-center justify-center transition-all shadow-xl">
            <i data-lucide="chevron-right" class="w-6 h-6"></i>
          </button>
        </div>

        <!-- Image Title / Caption -->
        <div class="text-xs text-slate-300 font-semibold bg-slate-900/60 px-4 py-1.5 rounded-full border border-white/10">
          ${photo.title || 'Photo Haute Définition'}
        </div>

      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    modal.querySelector('#btn-close-lightbox').addEventListener('click', () => modal.classList.add('hidden'));

    modal.querySelector('#btn-prev-lightbox').addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      updateView();
    });

    modal.querySelector('#btn-next-lightbox').addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % photos.length;
      updateView();
    });

    modal.querySelector('#btn-lightbox-select').addEventListener('click', (e) => {
      e.stopPropagation();
      onToggleSelect(photo);
      updateView();
    });
  }

  updateView();
}

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
export function renderClientPortalView(container, params) {
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
