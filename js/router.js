/* ==========================================================================
   KAPTUR — ROUTER & VIEW RENDERER COORDINATOR
   ========================================================================== */

import { store } from './store.js';
import { renderLandingView } from './views/landingView.js';
import { renderAuthView } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderGalleriesView, renderGalleryDetailView } from './views/galleriesView.js';
import { renderClientPortalView } from './views/clientPortalView.js';
import { renderNotificationsView } from './views/notificationsView.js';
import { renderInvoicesView } from './views/invoicesView.js';
import { renderCommunityView } from './views/communityView.js';
import { renderSearchView } from './views/searchView.js';
import { renderSubscriptionView } from './views/subscriptionView.js';
import { renderProfileView } from './views/profileView.js';

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
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  handleRoute() {
    // Close all open modals on route change to prevent overlay blocks
    document.querySelectorAll('.modal-overlay, #public-pro-modal, #search-pro-modal, #directory-list-modal, #modal-preview-public, #image-lightbox-modal').forEach(m => {
      m.classList.add('hidden');
    });

    const rawHash = window.location.hash.slice(1) || 'landing';
    
    // Parse params (e.g., #gallery-detail?id=gal_01 or #auth?tab=register)
    const [routePath, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');

    const renderer = this.routes[routePath] || this.routes['landing'];

    // Manage App Shell Layout (Public Header vs Private App Sidebar)
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
        if (routePath === 'client-portal') {
          publicHeader.classList.add('hidden'); // Client portal has its own high-end header
        } else {
          publicHeader.classList.remove('hidden');
        }
      }
      if (appView) appView.className = routePath === 'client-portal' ? 'flex-1 w-full min-h-screen pt-0 bg-[#090D14]' : 'flex-1 w-full min-h-screen pt-16';
    } else {
      if (sidebar) sidebar.classList.remove('hidden');
      if (publicHeader) publicHeader.classList.add('hidden');
      if (mobileNav) mobileNav.classList.remove('hidden');
      if (mobileHeader) mobileHeader.classList.remove('hidden');
      if (appView) appView.className = 'flex-1 w-full min-h-screen bg-main';
    }

    // Highlight active nav item
    this.updateActiveNav(routePath);

    // Render View
    if (appView) {
      appView.innerHTML = '';
      renderer(appView, params);
    }

    // Re-initialize Lucide Icons after DOM update
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  updateActiveNav(routePath) {
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
      const route = el.getAttribute('data-route');
      if (route === routePath) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update notification & unread badges
    const user = store.getUser();
    const notifs = store.getNotifications().filter(n => !n.read);
    const convs = store.getConversations().filter(c => c.unread);

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

export const router = new Router();
