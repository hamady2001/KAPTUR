/* ==========================================================================
   KAPTUR — PRIVATE PRO COMMUNITY (DIRECT MESSAGING) VIEW
   ========================================================================== */

import { store } from '../store.js';

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

function openEditMsgModal(currentText, onSave) {
  let modal = document.getElementById('edit-msg-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'edit-msg-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card max-w-md bg-surface border border-border-strong p-6 text-left space-y-4 shadow-2xl rounded-2xl animate-fade-in">
      <div class="flex items-center justify-between border-b border-border-subtle pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center border border-accent/30">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </div>
          <h3 class="text-base font-bold text-main">Modifier le message</h3>
        </div>
        <button id="btn-close-edit-msg" class="btn-icon btn-ghost text-muted hover:text-main"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>

      <div class="space-y-2">
        <label class="text-xs text-muted">Corrigez votre texte ci-dessous :</label>
        <textarea id="edit-msg-textarea" class="form-input w-full min-h-[90px] text-sm leading-relaxed p-3 resize-none bg-surface-subtle border-border-subtle" placeholder="Votre message...">${currentText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2 border-t border-border-subtle">
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

function openDeleteMsgModal(onConfirm) {
  let modal = document.getElementById('delete-msg-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'delete-msg-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card max-w-sm bg-surface border border-border-strong p-6 text-center space-y-5 shadow-2xl rounded-2xl animate-fade-in">
      <div class="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
        <i data-lucide="trash-2" class="w-7 h-7"></i>
      </div>

      <div class="space-y-1.5">
        <h3 class="text-lg font-extrabold text-main">Supprimer ce message ?</h3>
        <p class="text-xs text-muted">Voulez-vous vraiment supprimer ce message de la discussion ?</p>
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

function openMsgContextMenu(x, y, msg, convId, refreshCallback) {
  let menu = document.getElementById('msg-context-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'msg-context-menu';
    menu.className = 'fixed z-50 bg-surface border border-border-strong rounded-xl p-1.5 shadow-2xl space-y-1 min-w-[160px] animate-fade-in hidden';
    document.body.appendChild(menu);
  }

  const isMe = msg.sender === 'me';

  menu.innerHTML = `
    <button type="button" id="ctx-copy-msg" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-main hover:bg-surface-subtle transition-colors text-left font-medium text-xs">
      <i data-lucide="copy" class="w-4 h-4 text-accent"></i> Copier le texte
    </button>
    ${isMe ? `
      <button type="button" id="ctx-edit-msg" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-main hover:bg-surface-subtle transition-colors text-left font-medium text-xs">
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
      if (window.openCustomToast) {
        window.openCustomToast('✨ Message copié dans le presse-papier !', 'success');
      }
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

export function renderCommunityView(container, routeParams) {
  const user = store.getUser();

  // Check if target pro query parameter is present (e.g. #community?proId=pro_201)
  const hash = window.location.hash || '';
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const hashParams = new URLSearchParams(queryString);
  const targetProId = (routeParams && routeParams.get('proId')) || hashParams.get('proId') || hashParams.get('with') || hashParams.get('to');

  if (targetProId) {
    store.getOrCreateConversation(targetProId);
  }

  const currentConvs = store.getConversations();
  
  // Active conversation state
  let activeConvId = currentConvs.length > 0 ? currentConvs[0].id : null;
  if (targetProId) {
    const targetConv = currentConvs.find(c => c.otherPro.id === targetProId);
    if (targetConv) activeConvId = targetConv.id;
  }

  function renderChat() {
    const currentConvs = store.getConversations();
    const activeConv = currentConvs.find(c => c.id === activeConvId) || currentConvs[0];

    if (!activeConv) {
      container.innerHTML = `
        <div class="page-container p-12 text-center text-muted space-y-4 max-w-lg mx-auto my-12 bg-surface rounded-2xl border border-border-subtle">
          <i data-lucide="message-square-off" class="w-12 h-12 text-accent mx-auto"></i>
          <h2 class="text-xl font-bold text-main">Aucune conversation en cours</h2>
          <p class="text-sm">Sélectionnez un membre dans l'annuaire Recherche Pro pour échanger directement.</p>
          <a href="#search" class="btn btn-primary inline-flex"><i data-lucide="search"></i><span>Recherche Pro</span></a>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = `
      <div class="page-container space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-extrabold tracking-tight">Communauté Privée Pro</h1>
              <span class="badge badge-pro">RÉSEAU VÉRIFIÉ</span>
            </div>
            <p class="text-sm text-muted">Échanges privés et collaborations directes entre photographes abonnés Pro.</p>
          </div>
        </div>

        ${user.plan !== 'Pro' ? `
          <!-- Pro Upgrade Banner if Standard -->
          <div class="card card-pro p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-pro-gold-glow text-gold flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                <i data-lucide="lock" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gold">Messagerie Privée réservée aux Membres Pro</h3>
                <p class="text-sm text-muted">Passez à la formule Pro pour contacter directement les créateurs de l'annuaire géographique.</p>
              </div>
            </div>
            <a href="#subscription" class="btn btn-pro">Passer à l'offre Pro (3 000 FCFA/mois)</a>
          </div>
        ` : ''}

        <!-- Chat Container Grid -->
        <div class="chat-layout shadow-xl">
          
          <!-- Conversations List (Horizontal scroll bar on mobile, vertical list on desktop) -->
          <div class="chat-thread-list">
            <div class="hidden md:block p-4 border-b border-border-subtle bg-surface-subtle/50">
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
                    ${c.unread ? `<span class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent animate-pulse border-2 border-[#121824]"></span>` : ''}
                  </div>
                  
                  <!-- Desktop Info (Name, Timestamp & Message Preview) -->
                  <div class="chat-thread-info">
                    <div class="flex items-center justify-between mb-0.5">
                      <div class="font-bold text-sm text-main truncate">${c.otherPro.name}</div>
                      <span class="text-[10px] text-subtle font-mono">${c.lastTimestamp}</span>
                    </div>
                    <div class="text-xs text-muted truncate">${c.lastMessage}</div>
                  </div>

                  <!-- Mobile First Name Label -->
                  <div class="chat-thread-mobile-label ${isAct ? 'text-accent font-bold' : 'text-muted'}">
                    ${firstName}
                  </div>

                  <button type="button" class="btn-delete-conv p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg shrink-0 hidden md:block" data-conv-id="${c.id}" title="Supprimer la discussion">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Active Chat Area -->
          ${activeConv ? `
            <div class="flex flex-col flex-1 min-h-0 bg-surface">
              
              <!-- Chat Top Header -->
              <div class="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-subtle/30 shrink-0">
                <div class="flex items-center gap-3 cursor-pointer group btn-open-header-pro" data-id="${activeConv.otherPro.id}" title="Voir le profil complet de ${activeConv.otherPro.name}">
                  <div class="relative flex-shrink-0">
                    <img src="${activeConv.otherPro.avatar}" alt="${activeConv.otherPro.name}" class="avatar avatar-md group-hover:scale-105 transition-transform">
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121824] shadow-sm"></span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-base text-main group-hover:text-accent transition-colors">${activeConv.otherPro.name}</h3>
                      <span class="badge badge-pro">PRO</span>
                      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        En ligne
                      </span>
                    </div>
                    <p class="text-xs text-muted group-hover:text-main transition-colors">${activeConv.otherPro.role} • ${activeConv.otherPro.city}, ${activeConv.otherPro.country}</p>
                  </div>
                </div>

                <a href="#search?q=${encodeURIComponent(activeConv.otherPro.name)}" class="btn btn-outline btn-sm">
                  <i data-lucide="user" class="w-3.5 h-3.5"></i> Profil Pro
                </a>
              </div>

              <!-- Messages Thread -->
              <div class="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                ${activeConv.messages && activeConv.messages.length > 0 ? activeConv.messages.map(m => `
                  <div class="chat-bubble msg-bubble-item ${m.sender === 'me' ? 'chat-bubble-me' : 'chat-bubble-other'} relative group cursor-pointer" data-msg-id="${m.id}">
                    <div>${m.text}</div>
                    <div class="flex items-center justify-between text-[10px] ${m.sender === 'me' ? 'text-slate-900/70' : 'text-subtle'} text-right mt-1 font-mono gap-2">
                      <span>${m.isEdited ? '<span class="italic opacity-90 mr-1">(modifié)</span>' : ''}${m.timestamp}</span>
                    </div>

                    ${m.sender === 'me' ? `
                      <div class="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-surface-subtle border border-border-strong rounded-lg px-1.5 py-0.5 shadow-lg z-10">
                        <button type="button" class="btn-edit-msg text-main hover:text-accent p-1" data-msg-id="${m.id}" data-text="${m.text.replace(/"/g, '&quot;')}" title="Modifier le message">
                          <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                        </button>
                        <button type="button" class="btn-delete-msg text-main hover:text-red-400 p-1" data-msg-id="${m.id}" title="Supprimer le message">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    ` : ''}
                  </div>
                `).join('') : `
                  <div class="m-auto text-center p-8 text-muted space-y-2">
                    <i data-lucide="message-square" class="w-10 h-10 text-accent mx-auto opacity-70"></i>
                    <p class="font-bold text-main text-base">Nouvelle discussion avec ${activeConv.otherPro.name}</p>
                    <p class="text-xs text-muted">Écrivez et envoyez votre premier message ci-dessous.</p>
                  </div>
                `}
              </div>

              <!-- Message Input Form -->
              <form id="form-send-chat" class="p-4 border-t border-border-subtle relative bg-surface-subtle/20 shrink-0">
                <!-- Emoji Picker Popover Bar -->
                <div id="emoji-picker-popover" class="hidden absolute bottom-16 left-4 bg-surface border border-border-strong rounded-2xl p-3 shadow-2xl z-30 animate-fade-in max-w-xs">
                  <div class="text-[11px] font-bold text-muted mb-2 px-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Sélectionner un émoji</span>
                  </div>
                  <div class="grid grid-cols-6 gap-1.5 text-xl">
                    ${['😀', '😂', '😍', '🔥', '📸', '👍', '❤️', '🎉', '✨', '🙏', '💯', '👌', '👏', '😎', '🚀', '📷', '🙌', '⭐'].map(emoji => `
                      <button type="button" class="btn-emoji-item hover:bg-surface-subtle rounded-lg p-1 transition-colors text-center cursor-pointer" data-emoji="${emoji}">${emoji}</button>
                    `).join('')}
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button type="button" id="btn-emoji-toggle" class="btn-icon text-muted hover:text-gold transition-colors p-2 shrink-0" title="Ajouter un émoji">
                    <i data-lucide="smile" class="w-5 h-5"></i>
                  </button>
                  <input type="text" id="chat-input-text" class="form-input flex-1" placeholder="Écrivez votre message privé à ${activeConv.otherPro.name}..." required>
                  <button type="submit" class="btn btn-primary">
                    <i data-lucide="send"></i>
                    <span class="hidden sm:inline">Envoyer</span>
                  </button>
                </div>
              </form>

            </div>
          ` : `
            <div class="flex items-center justify-center text-muted p-8">Sélectionnez une conversation</div>
          `}

        </div>

      </div>
    `;

    // Re-bind Lucide icons
    if (window.lucide) window.lucide.createIcons();

    // Bind thread click
    container.querySelectorAll('.chat-thread-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-conv')) return;
        activeConvId = item.getAttribute('data-conv-id');
        // Mark read
        const conv = currentConvs.find(c => c.id === activeConvId);
        if (conv) conv.unread = false;
        store.saveState();
        renderChat();
      });
    });

    // Bind delete conversation
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

    // Emoji Picker toggle binding
    const btnEmojiToggle = container.querySelector('#btn-emoji-toggle');
    const emojiPopover = container.querySelector('#emoji-picker-popover');
    const chatInput = container.querySelector('#chat-input-text');

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

    // Bind Send Form
    const formSend = container.querySelector('#form-send-chat');
    if (formSend) {
      formSend.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = container.querySelector('#chat-input-text');
        const text = input.value.trim();
        if (text) {
          store.sendMessage(activeConvId, text);
          renderChat();
        }
      });
    }
  }

  renderChat();
}
