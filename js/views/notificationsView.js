/* ==========================================================================
   KAPTUR — NOTIFICATIONS VIEW
   ========================================================================== */

import { store } from '../store.js';
import { router } from '../router.js';

export function renderNotificationsView(container) {
  const notifs = store.getNotifications();

  container.innerHTML = `
    <div class="page-container space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight">Vos Notifications</h1>
          <p class="text-sm text-muted mt-1">Gérez vos alertes de téléchargements, factures et messages de la communauté.</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button id="btn-mark-all-read" class="btn btn-secondary btn-sm text-xs">
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
        <div class="card p-12 text-center text-muted space-y-4 max-w-md mx-auto my-8 border border-border-subtle">
          <div class="w-14 h-14 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-center mx-auto text-subtle">
            <i data-lucide="bell-off" class="w-7 h-7"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-main">Aucune notification</h3>
            <p class="text-xs text-muted mt-1">Vos alertes apparaîtront ici au fur et à mesure des téléchargements et interactions.</p>
          </div>
        </div>
      ` : `
        <!-- Notification Cards List -->
        <div class="space-y-3 max-w-4xl">
          ${notifs.map(n => {
            const iconBg = n.type === 'download' ? 'bg-green-500/10 text-emerald-400 border-emerald-500/30' : n.type === 'dm' ? 'bg-pro-gold-glow text-gold border-amber-500/30' : 'bg-accent-glow text-accent border-sky-500/30';
            const iconName = n.type === 'download' ? 'download' : n.type === 'dm' ? 'message-square' : 'bell';
            
            return `
              <div class="card p-4 flex items-start gap-3.5 ${!n.read ? 'border-l-4 border-l-accent bg-surface-subtle/60' : 'border-border-subtle bg-surface'} card-hover transition-all group">
                
                <!-- Icon -->
                <div class="w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center shrink-0 mt-0.5">
                  <i data-lucide="${iconName}" class="w-4 h-4"></i>
                </div>

                <!-- Text Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="font-bold text-sm text-main truncate">${n.title}</h3>
                    <span class="text-[11px] text-subtle font-mono shrink-0">${n.timestamp}</span>
                  </div>
                  <p class="text-xs text-muted mt-1 leading-relaxed">${n.message}</p>
                </div>

                <!-- Actions: Unread indicator & Delete Button -->
                <div class="flex items-center gap-2 shrink-0 self-center">
                  ${!n.read ? `<span class="w-2 h-2 rounded-full bg-accent shadow-sm" title="Non lue"></span>` : ''}
                  <button class="btn-delete-single-notif btn-icon btn-ghost text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity w-7 h-7" data-id="${n.id}" title="Supprimer la notification">
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
  const btnMark = container.querySelector('#btn-mark-all-read');
  if (btnMark) {
    btnMark.addEventListener('click', () => {
      store.markAllNotificationsRead();
      if (window.openCustomToast) window.openCustomToast('✨ Toutes les notifications ont été marquées comme lues', 'success');
      renderNotificationsView(container);
    });
  }

  // Bind Clear All Notifications
  const btnClearAll = container.querySelector('#btn-clear-all-notifs');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      store.clearAllNotifications();
      if (window.openCustomToast) window.openCustomToast('✨ Toutes vos notifications ont été effacées', 'success');
      renderNotificationsView(container);
    });
  }

  // Bind Delete Single Notification
  container.querySelectorAll('.btn-delete-single-notif').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      store.deleteNotification(id);
      if (window.openCustomToast) window.openCustomToast('✨ Notification supprimée', 'success');
      renderNotificationsView(container);
    });
  });
}
