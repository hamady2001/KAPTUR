/* ==========================================================================
   KAPTUR — INVOICES & RECEIPTS VIEW
   ========================================================================== */

import { store } from '../store.js';

export function renderInvoicesView(container) {
  const invoices = store.getInvoices();
  const user = store.getUser();
  const galleries = store.getGalleries();

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.total, 0);

  container.innerHTML = `
    <div class="page-container space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight">Factures & Reçus</h1>
          <p class="text-sm text-muted">Émettez des factures professionnelles conformes pour vos prestations créatives et suivez vos encaissements.</p>
        </div>

        <button id="btn-create-invoice" class="btn btn-primary">
          <i data-lucide="plus"></i>
          <span>Créer une facture</span>
        </button>
      </div>

      <!-- Financial Metrics Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="card p-4">
          <div class="text-xs text-subtle font-medium mb-1">Encaissements Effectués</div>
          <div class="text-2xl font-extrabold text-emerald-400">${totalPaid.toFixed(2)} €</div>
        </div>
        <div class="card p-4">
          <div class="text-xs text-subtle font-medium mb-1">En Attente de Règlement</div>
          <div class="text-2xl font-extrabold text-warning">${totalPending.toFixed(2)} €</div>
        </div>
        <div class="card p-4">
          <div class="text-xs text-subtle font-medium mb-1">Total Factures Émises</div>
          <div class="text-2xl font-extrabold text-main">${invoices.length} factures</div>
        </div>
      </div>

      <!-- Invoices Table Container -->
      <div class="card p-0 overflow-hidden border border-border-subtle">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-surface-subtle text-subtle text-xs uppercase font-bold border-b border-border-subtle">
              <tr>
                <th class="p-4">N° Facture</th>
                <th class="p-4">Client</th>
                <th class="p-4">Date Émission</th>
                <th class="p-4">Échéance</th>
                <th class="p-4">Statut</th>
                <th class="p-4 text-right">Montant TTC</th>
                <th class="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-subtle">
              ${invoices.map(inv => `
                <tr class="hover:bg-surface-subtle/50 transition-colors">
                  <td class="p-4 font-mono font-bold text-accent">${inv.number}</td>
                  <td class="p-4 font-semibold text-main">${inv.clientName}</td>
                  <td class="p-4 text-muted">${inv.issueDate}</td>
                  <td class="p-4 text-muted">${inv.dueDate}</td>
                  <td class="p-4">
                    <span class="badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">
                      ${inv.status === 'Paid' ? 'Payée' : inv.status === 'Pending' ? 'En attente' : 'En retard'}
                    </span>
                  </td>
                  <td class="p-4 text-right font-extrabold text-main">${inv.total.toFixed(2)} €</td>
                  <td class="p-4 text-center">
                    <button class="btn btn-outline btn-sm btn-view-invoice" data-id="${inv.id}">
                      <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                      <span>Imprimer / PDF</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- NEW INVOICE MODAL -->
    <div id="modal-new-invoice" class="modal-overlay hidden">
      <div class="modal-card max-w-md">
        <div class="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
          <h3 class="font-bold text-xl">Créer une facture</h3>
          <button id="btn-close-inv-modal" class="btn-icon btn-ghost text-muted">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form id="form-new-invoice" class="space-y-4">
          
          <!-- Gallery Dropdown Selection -->
          <div class="form-group">
            <label class="form-label text-accent font-semibold flex items-center gap-1.5">
              <i data-lucide="image" class="w-4 h-4"></i>
              <span>Galerie Client</span>
            </label>
            <select id="inv-gallery-select" class="form-input" required>
              <option value="">-- Choisir une galerie client --</option>
              ${galleries.map(g => `<option value="${g.id}">${g.title} (${g.clientName || 'Client Privé'})</option>`).join('')}
            </select>
            <p class="text-[11px] text-muted mt-1">Le nom du client et la prestation seront automatiquement appliqués à la facture.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Montant Total (€ TTC)</label>
              <input type="number" id="inv-amount-ht" class="form-input" placeholder="Ex: 800" required>
            </div>
            <div class="form-group">
              <label class="form-label">Date limite de paiement</label>
              <input type="date" id="inv-due-date" class="form-input" value="2026-10-15">
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" id="btn-cancel-inv-modal" class="btn btn-ghost">Annuler</button>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="check"></i>
              <span>Générer la Facture</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PRINTABLE INVOICE SHEET MODAL -->
    <div id="modal-invoice-preview" class="modal-overlay hidden">
      <div class="modal-card max-w-4xl bg-slate-900 border-none p-0 overflow-hidden">
        <div class="p-4 bg-surface border-b border-border-subtle flex items-center justify-between">
          <span class="font-bold text-sm">Aperçu Facture Conforme</span>
          <div class="flex items-center gap-2">
            <button id="btn-do-print" class="btn btn-primary btn-sm">
              <i data-lucide="printer"></i> Imprimer / Exporter PDF
            </button>
            <button id="btn-close-inv-preview" class="btn-icon btn-ghost text-muted">
              <i data-lucide="x"></i>
            </button>
          </div>
        </div>

        <div id="invoice-sheet-target" class="p-8">
          <!-- Dynamic Invoice Rendered Here -->
        </div>
      </div>
    </div>
  `;

  // Modal Controls
  const modalNew = container.querySelector('#modal-new-invoice');
  const btnCreate = container.querySelector('#btn-create-invoice');
  const btnClose = container.querySelector('#btn-close-inv-modal');
  const btnCancel = container.querySelector('#btn-cancel-inv-modal');

  btnCreate.addEventListener('click', () => modalNew.classList.remove('hidden'));
  btnClose.addEventListener('click', () => modalNew.classList.add('hidden'));
  btnCancel.addEventListener('click', () => modalNew.classList.add('hidden'));

  // Form Submit
  const formNew = container.querySelector('#form-new-invoice');
  formNew.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientName = container.querySelector('#inv-client-name').value;
    const clientEmail = container.querySelector('#inv-client-email').value;
    const desc = container.querySelector('#inv-desc').value;
    const amountHt = parseFloat(container.querySelector('#inv-amount-ht').value) || 1000;
    const dueDate = container.querySelector('#inv-due-date').value;

    store.addInvoice({
      clientName,
      clientEmail,
      dueDate,
      items: [{ description: desc, qty: 1, unitPrice: amountHt }],
      total: amountHt
    });

    modalNew.classList.add('hidden');
    renderInvoicesView(container);
  });

  // Invoice Printable View
  const modalPreview = container.querySelector('#modal-invoice-preview');
  const sheetTarget = container.querySelector('#invoice-sheet-target');
  const btnClosePrev = container.querySelector('#btn-close-inv-preview');

  btnClosePrev.addEventListener('click', () => modalPreview.classList.add('hidden'));

  container.querySelectorAll('.btn-view-invoice').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const inv = invoices.find(i => i.id === id) || invoices[0];

      sheetTarget.innerHTML = `
        <div class="invoice-sheet text-slate-800">
          <div class="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <div class="text-2xl font-black text-slate-900 tracking-tight mb-1">${user.name}</div>
              <div class="text-xs text-slate-500">${user.role} • ${user.city}, ${user.country}</div>
              <div class="text-xs text-slate-500">${user.email}</div>
            </div>

            <div class="text-right">
              <div class="text-2xl font-extrabold text-sky-600">${inv.number}</div>
              <div class="text-xs text-slate-500 font-semibold mt-1">Date : ${inv.issueDate}</div>
              <div class="text-xs text-slate-500">Échéance : ${inv.dueDate}</div>
            </div>
          </div>

          <div class="mb-8 p-4 bg-slate-50 rounded-lg">
            <div class="text-xs uppercase font-bold text-slate-400 mb-1">Facturé à :</div>
            <div class="font-bold text-slate-900 text-lg">${inv.clientName}</div>
            <div class="text-sm text-slate-600">${inv.clientEmail || 'contact@client.fr'}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qté</th>
                <th class="text-right">Prix Unitaire</th>
                <th class="text-right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items.map(it => `
                <tr>
                  <td><strong>${it.description}</strong></td>
                  <td>${it.qty}</td>
                  <td class="text-right">${it.unitPrice.toFixed(2)} €</td>
                  <td class="text-right">${(it.qty * it.unitPrice).toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="flex justify-end mt-6">
            <div class="w-64 space-y-2 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>Sous-total HT :</span>
                <span>${inv.subtotal.toFixed(2)} €</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>TVA (20%) :</span>
                <span>${inv.tax.toFixed(2)} €</span>
              </div>
              <div class="flex justify-between font-extrabold text-lg text-slate-900 border-t pt-2">
                <span>Total TTC :</span>
                <span>${inv.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      `;

      modalPreview.classList.remove('hidden');
    });
  });

  const btnPrint = container.querySelector('#btn-do-print');
  btnPrint.addEventListener('click', () => {
    window.print();
  });
}
