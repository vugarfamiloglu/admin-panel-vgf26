/* ----------------------------------------------------------------------
 * App bootstrap — sidebar + topbar + footer rendering, hash router,
 * theme manager, sidebar collapse, language switcher, command palette
 * hotkey, sidebar mobile slide-in.
 * ---------------------------------------------------------------------- */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const I = (n, opts) => Icons.get(n, opts || {});

  /* ── VGF26 brand mark — the iridescent faceted diamond. Same artwork as
   * favicon.svg / logo.svg, inlined so it inherits theme colours and renders
   * crisp at any size. Each instance gets a unique gradient-id so multiple
   * marks on one page never share defs. */
  let _markUid = 0;
  function vgfBrandMark(size) {
    const s = size || 36;
    const u = 'm' + (++_markUid);
    return ''
      + '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" aria-hidden="true">'
      + '<defs>'
      +   '<linearGradient id="' + u + 'bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a063d"/><stop offset="100%" stop-color="#5618b5"/></linearGradient>'
      +   '<linearGradient id="' + u + 'i" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>'
      +   '<linearGradient id="' + u + 'u" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#9333ea"/></linearGradient>'
      +   '<linearGradient id="' + u + 'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0abfc"/><stop offset="100%" stop-color="#d846ef"/></linearGradient>'
      +   '<linearGradient id="' + u + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0891b2"/></linearGradient>'
      + '</defs>'
      + '<rect width="64" height="64" rx="14" fill="url(#' + u + 'bg)"/>'
      + '<g transform="translate(32 32)">'
      +   '<path d="M0,-20 L-18,-6 L0,0 Z" fill="url(#' + u + 'i)"/>'
      +   '<path d="M0,-20 L18,-6 L0,0 Z"  fill="url(#' + u + 'u)"/>'
      +   '<path d="M-18,-6 L0,0 L0,20 Z"  fill="url(#' + u + 'c)"/>'
      +   '<path d="M18,-6 L0,0 L0,20 Z"   fill="url(#' + u + 'f)"/>'
      +   '<path d="M0,-20 L-18,-6" stroke="rgba(255,255,255,0.45)" stroke-width="1" fill="none" stroke-linecap="round"/>'
      +   '<circle cx="-7" cy="-12" r="1.6" fill="rgba(255,255,255,0.85)"/>'
      + '</g>'
      + '</svg>';
  }
  /* Expose for views/components that want to render the brand mark. */
  window.VGF = window.VGF || {};
  window.VGF.brandMark = vgfBrandMark;

  /* ── Theme manager ─────────────────────────────────────────────── */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem('vgf26-theme', t); } catch (_) {}
  }
  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }
  function toggleTheme() { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'); renderTopbar(); }

  /* Restore custom theme tokens (set on the theme generator page). */
  ['iris','fuchsia','cyan','emerald','amber','rose'].forEach(k => {
    try {
      const v = localStorage.getItem('vgf26-tok-' + k);
      if (v) document.documentElement.style.setProperty('--' + k, v);
    } catch (_) {}
  });

  /* ── Helper: pick the SINGLE best-matching nav item for the route.
   * Avoids the bug where two items with the same / prefix-overlapping
   * routes both get highlighted simultaneously. */
  function findActiveItemId(route) {
    let exactId = null, bestPrefixId = null, bestPrefixLen = -1;
    for (const sec of (NAV || [])) {
      for (const it of sec.items) {
        if (!it.route) continue;
        if (it.route === route && !exactId) { exactId = it.id; }
        else if (it.route !== '#/' && route.startsWith(it.route + '/') && it.route.length > bestPrefixLen) {
          bestPrefixId = it.id; bestPrefixLen = it.route.length;
        }
      }
    }
    return exactId || bestPrefixId;
  }

  /* ── Sidebar ───────────────────────────────────────────────────── */
  function renderSidebar() {
    const sb = $('#sidebar');
    const route = location.hash || '#/';
    const activeId = findActiveItemId(route);
    sb.innerHTML =
      '<div class="sb-brand">'
      + '  <a href="#/" class="vgf-mark" aria-label="VGF26 home">' + vgfBrandMark(36) + '</a>'
      + '  <div class="sb-brand-name">'
      + '    <div>VGF26</div>'
      + '    <div class="sb-brand-sub">' + I18n.t('app.tagline') + '</div>'
      + '  </div>'
      + '</div>'

      + '<div class="sb-search">'
      + '  <div class="relative">'
      + '    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">' + I('search', { size: 14 }) + '</span>'
      + '    <input id="sb-filter" placeholder="' + I18n.t('sidebar.search_placeholder') + '">'
      + '  </div>'
      + '</div>'

      + '<nav class="sb-scroll">' + (NAV || []).map((section) => {
        const items = section.items.map((it) => {
          const active = it.id === activeId;
          return ''
            + '<a href="' + (it.route || '#') + '" class="sb-link ' + (active ? 'is-active' : '') + '" data-id="' + it.id + '" data-search="' + it.title.toLowerCase() + '">'
            + '  ' + I(it.icon || 'circle', { size: 17 })
            + '  <span class="sb-text">' + it.title + '</span>'
            + (it.badge ? '<span class="sb-badge">' + it.badge + '</span>' : '')
            + '</a>';
        }).join('');
        return '<div class="sb-group" data-section="' + section.id + '">'
          + '  <div class="sb-section-title">' + I18n.t(section.titleKey) + '</div>'
          + items + '</div>';
      }).join('') + '</nav>'

      + '<div class="sb-footer">'
      + '  <div class="avatar" style="width:32px;height:32px;font-size:12px">VF</div>'
      + '  <div class="flex-1 min-w-0"><div class="text-sm font-semibold truncate">Vugar Familoglu</div><div class="text-[10.5px] text-muted truncate">' + I18n.t('app.pro_plan') + '</div></div>'
      + '  <button class="tb-icon-btn" data-act="logout" title="' + I18n.t('common.signout') + '">' + I('log-out', { size: 14 }) + '</button>'
      + '</div>';

    /* Sidebar filter */
    const filterEl = $('#sb-filter', sb);
    filterEl?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      sb.querySelectorAll('.sb-link').forEach((a) => {
        a.style.display = !q || a.dataset.search.includes(q) ? '' : 'none';
      });
      /* Hide section headers when their items all hidden. */
      sb.querySelectorAll('.sb-group').forEach((g) => {
        const visible = [...g.querySelectorAll('.sb-link')].some((a) => a.style.display !== 'none');
        g.style.display = visible ? '' : 'none';
      });
    });

    /* Mobile close after click */
    sb.querySelectorAll('.sb-link').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sb.classList.remove('is-open');
          $('#sidebar-backdrop')?.classList.add('hidden');
        }
      });
    });

    /* Logout */
    sb.querySelector('[data-act="logout"]')?.addEventListener('click', () => {
      Components.confirmModal({
        title: I18n.t('common.signout') + '?',
        message: 'You will be signed out of this session.',
        confirmLabel: I18n.t('common.signout'),
        destructive: true,
        onConfirm: () => Components.toast('info', 'Signed out', 'Demo only — nothing actually changed.'),
      });
    });
  }

  /* ── Topbar ────────────────────────────────────────────────────── */
  function renderTopbar() {
    const tb = $('#topbar');
    const theme = currentTheme();
    const langs = [['en', 'EN'], ['az', 'AZ'], ['ru', 'RU']];
    tb.innerHTML =
      '<button class="tb-icon-btn lg:hidden" data-act="toggle-sidebar" aria-label="Menu">' + I('menu') + '</button>'
      + '<button class="tb-icon-btn hidden lg:grid" data-act="collapse-sidebar" aria-label="Collapse">' + I('menu-collapse') + '</button>'

      + '<button class="tb-pill flex-1 max-w-md text-left text-muted" data-act="open-palette">'
      + '  ' + I('search', { size: 14 })
      + '  <span class="flex-1">' + I18n.t('topbar.search') + '</span>'
      + '  <span class="kbd">⌘ K</span>'
      + '</button>'

      + '<div class="flex items-center gap-1 ml-auto">'
      + '  <div class="hidden sm:flex items-center gap-1 mr-2 pr-2 border-r border-[rgb(var(--line))]">'
      + langs.map(([code, label]) => '<button class="btn btn-xs ' + (I18n.getLang() === code ? 'btn-primary' : 'btn-ghost') + '" data-act="lang" data-lang="' + code + '">' + label + '</button>').join('')
      + '  </div>'
      + '  <button class="tb-icon-btn" data-act="theme" title="' + (theme === 'dark' ? I18n.t('topbar.theme.light') : I18n.t('topbar.theme.dark')) + '">' + I(theme === 'dark' ? 'sun' : 'moon') + '</button>'
      + '  <button class="tb-icon-btn" data-act="fullscreen" title="' + I18n.t('topbar.fullscreen') + '">' + I('expand') + '</button>'
      + '  <button class="tb-icon-btn" data-act="open-messages" title="' + I18n.t('topbar.messages') + '">' + I('message-circle') + '<span class="badge">3</span></button>'
      + '  <button class="tb-icon-btn" data-act="open-notif" title="' + I18n.t('topbar.notifications') + '">' + I('bell') + '<span class="badge">' + DEMO.NOTIFICATIONS.filter(n => !n.read).length + '</span></button>'
      + '  <button class="tb-icon-btn hidden sm:grid ml-2" data-act="open-user" title="' + I18n.t('topbar.profile') + '" style="padding:0;width:34px;height:34px;border-radius:999px;overflow:hidden;border:0"><span class="avatar" style="width:34px;height:34px;font-size:13px;border:0">VF</span></button>'
      + '</div>';

    /* Wire actions */
    tb.querySelector('[data-act="toggle-sidebar"]')?.addEventListener('click', () => {
      $('#sidebar').classList.toggle('is-open');
      $('#sidebar-backdrop').classList.toggle('hidden');
    });
    tb.querySelector('[data-act="collapse-sidebar"]')?.addEventListener('click', () => {
      $('#sidebar').classList.toggle('is-collapsed');
      try { localStorage.setItem('vgf26-collapsed', $('#sidebar').classList.contains('is-collapsed') ? '1' : '0'); } catch (_) {}
    });
    tb.querySelector('[data-act="open-palette"]')?.addEventListener('click', Components.openPalette);
    tb.querySelector('[data-act="theme"]')?.addEventListener('click', toggleTheme);
    tb.querySelector('[data-act="fullscreen"]')?.addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    });
    tb.querySelector('[data-act="open-notif"]')?.addEventListener('click', (e) => openNotifications(e.currentTarget));
    tb.querySelector('[data-act="open-messages"]')?.addEventListener('click', (e) => openMessages(e.currentTarget));
    tb.querySelector('[data-act="open-user"]')?.addEventListener('click', (e) => openUserMenu(e.currentTarget));
    tb.querySelectorAll('[data-act="lang"]').forEach((b) => b.addEventListener('click', () => I18n.setLang(b.dataset.lang)));
  }

  function openNotifications(anchor) {
    const items = DEMO.NOTIFICATIONS;
    const unread = items.filter(n => !n.read).length;
    const body =
      '<div class="dropdown-head">'
      + '  <h4>' + I18n.t('topbar.notifications') + '</h4>'
      + '  <span class="pill pill-iris">' + unread + ' new</span>'
      + '</div>'
      + '<div class="dropdown-body">'
      + items.map(n => {
          const c = n.kind === 'warn' ? 'amber' : n.kind === 'success' ? 'emerald' : 'iris';
          return '<a class="dropdown-item ' + (n.read ? 'opacity-70' : '') + '" href="#">'
            + '  <span class="grid place-items-center w-9 h-9 rounded-full shrink-0" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I(n.icon, { size: 16 }) + '</span>'
            + '  <span class="flex-1"><span class="block">' + n.text + '</span><span class="block text-[11px] text-muted mt-0.5">' + n.time + ' ago</span></span>'
            + (n.read ? '' : '<span class="w-2 h-2 rounded-full shrink-0" style="background:rgb(var(--iris))"></span>')
            + '</a>';
        }).join('')
      + '</div>'
      + '<div class="dropdown-foot">'
      + '  <a class="text-iris text-xs font-semibold" href="#" data-act-2="all">Mark all read</a>'
      + '  <a class="text-iris text-xs font-semibold" href="#">See all →</a>'
      + '</div>';
    Components.dropdown({ anchor, width: 360, maxWidth: 380, body });
  }

  function openMessages(anchor) {
    const body =
      '<div class="dropdown-head"><h4>' + I18n.t('topbar.messages') + '</h4><span class="pill pill-iris">3 unread</span></div>'
      + '<div class="dropdown-body">'
      + DEMO.CHAT.map(m =>
          '<a class="dropdown-item" href="#/specialty/chat">'
          + '  <span class="avatar shrink-0" style="width:36px;height:36px;font-size:12px">' + m.who.split(' ').map(x=>x[0]).join('') + '</span>'
          + '  <span class="flex-1 min-w-0"><span class="flex justify-between"><strong class="text-sm">' + m.who + '</strong><span class="text-[10px] text-muted">' + m.time + '</span></span>'
          + '  <span class="block text-xs text-muted mt-0.5 truncate">' + m.text + '</span></span>'
          + '</a>').join('')
      + '</div>'
      + '<div class="dropdown-foot"><a class="text-iris text-xs font-semibold" href="#/specialty/chat">Open inbox →</a></div>';
    Components.dropdown({ anchor, width: 340, maxWidth: 380, body });
  }

  function openUserMenu(anchor) {
    const theme = currentTheme();
    const lang = I18n.getLang().toUpperCase();
    const body =
      '<div class="dropdown-head" style="display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,rgb(var(--iris)/.12),rgb(var(--fuchsia)/.12))">'
      + '  <span class="avatar" style="width:42px;height:42px;font-size:14px">VF</span>'
      + '  <div style="line-height:1.3"><div class="font-semibold text-sm">Vugar Familoglu</div><div class="text-[11px] text-muted">vugar@vgf26.io</div></div>'
      + '</div>'
      + '<div class="dropdown-body">'
      + '  <a class="dropdown-item" href="#/system/settings">' + I('user', { size: 16, class: 'text-muted' }) + '<span>' + I18n.t('topbar.profile') + '</span></a>'
      + '  <a class="dropdown-item" href="#/system/settings">' + I('settings', { size: 16, class: 'text-muted' }) + '<span>Settings</span></a>'
      + '  <a class="dropdown-item" href="#/system/security">' + I('shield', { size: 16, class: 'text-muted' }) + '<span>Security</span></a>'
      + '  <a class="dropdown-item" href="#/commerce/billing">' + I('credit-card', { size: 16, class: 'text-muted' }) + '<span>Billing</span></a>'
      + '  <div class="dropdown-divider"></div>'
      + '  <a class="dropdown-item" data-act-2="theme">' + I(theme === 'dark' ? 'sun' : 'moon', { size: 16, class: 'text-muted' }) + '<span>' + (theme === 'dark' ? 'Light' : 'Dark') + ' mode</span><span class="ml-auto kbd">⌘D</span></a>'
      + '  <a class="dropdown-item" data-act-2="lang-toggle">' + I('languages', { size: 16, class: 'text-muted' }) + '<span>Language</span><span class="ml-auto pill pill-iris">' + lang + '</span></a>'
      + '  <a class="dropdown-item" href="#/system/i18n">' + I('help-circle', { size: 16, class: 'text-muted' }) + '<span>Help & docs</span></a>'
      + '  <div class="dropdown-divider"></div>'
      + '  <a class="dropdown-item text-rose" data-act-2="logout">' + I('log-out', { size: 16 }) + '<span>' + I18n.t('common.signout') + '</span></a>'
      + '</div>';
    Components.dropdown({
      anchor, width: 260, body,
      onMount: (panel, close) => {
        panel.querySelector('[data-act-2="theme"]')?.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); close(); });
        panel.querySelector('[data-act-2="lang-toggle"]')?.addEventListener('click', (e) => {
          e.preventDefault();
          const order = ['en', 'az', 'ru'];
          const cur = I18n.getLang();
          I18n.setLang(order[(order.indexOf(cur) + 1) % order.length]);
          close();
        });
        panel.querySelector('[data-act-2="logout"]')?.addEventListener('click', (e) => {
          e.preventDefault(); close();
          Components.confirmModal({
            title: I18n.t('common.signout') + '?',
            message: 'You will be signed out of this session.',
            confirmLabel: I18n.t('common.signout'),
            destructive: true,
            onConfirm: () => Components.toast('info', 'Signed out', 'Demo only — nothing actually changed.'),
          });
        });
      },
    });
  }

  /* ── Footer ────────────────────────────────────────────────────── */
  function renderFooter() {
    $('#footer').innerHTML =
      '<span>' + I18n.t('footer.copy') + '</span>'
      + '<span class="font-mono">' + I18n.t('footer.version') + '</span>';
  }

  /* ── Router ────────────────────────────────────────────────────── */
  function renderRoute() {
    const route = location.hash || '#/';
    const view = Views.render(route);
    const root = $('#view');
    root.innerHTML = view;
    Components.mount(root);
    /* Highlight active sidebar item — same single-winner logic. */
    const activeId = findActiveItemId(route);
    $('#sidebar')?.querySelectorAll('.sb-link').forEach((a) => {
      a.classList.toggle('is-active', a.dataset.id === activeId);
    });
    /* Scroll to top */
    window.scrollTo({ top: 0 });
  }

  /* ── Mobile backdrop ─────────────────────────────────────────── */
  function bindBackdrop() {
    $('#sidebar-backdrop')?.addEventListener('click', () => {
      $('#sidebar').classList.remove('is-open');
      $('#sidebar-backdrop').classList.add('hidden');
    });
  }

  /* ── Global hotkeys ──────────────────────────────────────────── */
  function bindHotkeys() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        Components.openPalette();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === '/') {
        e.preventDefault();
        const sb = $('#sidebar');
        sb.classList.toggle('is-collapsed');
      }
    });
  }

  /* ── i18n re-render hook ─────────────────────────────────────── */
  I18n.onChange(() => { renderSidebar(); renderTopbar(); renderFooter(); renderRoute(); });

  /* ── Boot ────────────────────────────────────────────────────── */
  function boot() {
    try {
      if (localStorage.getItem('vgf26-collapsed') === '1') $('#sidebar').classList.add('is-collapsed');
    } catch (_) {}
    renderSidebar();
    renderTopbar();
    renderFooter();
    renderRoute();
    bindBackdrop();
    bindHotkeys();
    window.addEventListener('hashchange', renderRoute);
    /* Pre-paint shows aurora — small welcome toast on first load */
    if (!sessionStorage.getItem('vgf26-greeted')) {
      sessionStorage.setItem('vgf26-greeted', '1');
      setTimeout(() => Components.toast('info', 'Welcome to VGF26', 'Press ⌘K to jump to anything.'), 600);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
