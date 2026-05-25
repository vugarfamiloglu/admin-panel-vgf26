/* ----------------------------------------------------------------------
 * App bootstrap — sidebar + topbar + footer rendering, hash router,
 * theme manager, sidebar collapse, language switcher, command palette
 * hotkey, sidebar mobile slide-in.
 * ---------------------------------------------------------------------- */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const I = (n, opts) => Icons.get(n, opts || {});

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

  /* ── Sidebar ───────────────────────────────────────────────────── */
  function renderSidebar() {
    const sb = $('#sidebar');
    const route = location.hash || '#/';
    sb.innerHTML =
      '<div class="sb-brand">'
      + '  <a href="#/" class="grid place-items-center w-9 h-9 rounded-xl shrink-0" style="background:linear-gradient(135deg,#7c3aed,#d846ef,#22d3ee);background-size:200% 200%;animation:aurora-pan 8s ease-in-out infinite;color:#fff">' + I('sparkles', { size: 18 }) + '</a>'
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
          const active = (it.route === route) || (it.route !== '#/' && route.startsWith(it.route));
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
      + '  <div class="hidden sm:block ml-2"><div class="avatar" style="width:34px;height:34px;font-size:13px">VF</div></div>'
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
    tb.querySelector('[data-act="open-notif"]')?.addEventListener('click', openNotifications);
    tb.querySelector('[data-act="open-messages"]')?.addEventListener('click', openMessages);
    tb.querySelectorAll('[data-act="lang"]').forEach((b) => b.addEventListener('click', () => I18n.setLang(b.dataset.lang)));
  }

  function openNotifications() {
    Components.modal({
      title: I18n.t('topbar.notifications'),
      body: '<ul class="divide-y divide-[rgb(var(--line-soft))]">'
        + DEMO.NOTIFICATIONS.map(n =>
            '<li class="flex gap-3 py-3 ' + (n.read ? 'opacity-70' : '') + '">'
            + '<span class="grid place-items-center w-9 h-9 rounded-full shrink-0" style="background:rgb(var(--' + (n.kind === 'warn' ? 'amber' : n.kind === 'success' ? 'emerald' : 'iris') + ')/.14);color:rgb(var(--' + (n.kind === 'warn' ? 'amber' : n.kind === 'success' ? 'emerald' : 'iris') + '))">' + I(n.icon, { size: 16 }) + '</span>'
            + '<div class="flex-1"><div class="text-sm">' + n.text + '</div><div class="text-[11px] text-muted mt-1">' + n.time + ' ago</div></div>'
            + (n.read ? '' : '<span class="w-2 h-2 rounded-full" style="background:rgb(var(--iris))"></span>')
            + '</li>').join('') + '</ul>',
      footer: '<button class="btn btn-secondary" data-close>Close</button><button class="btn btn-primary" data-close>Mark all read</button>',
    });
  }
  function openMessages() {
    Components.modal({
      title: I18n.t('topbar.messages'),
      body: '<ul class="divide-y divide-[rgb(var(--line-soft))]">'
        + DEMO.CHAT.map(m =>
            '<li class="flex gap-3 py-3"><span class="avatar" style="width:36px;height:36px;font-size:12px">' + m.who.split(' ').map(x=>x[0]).join('') + '</span>'
            + '<div class="flex-1"><div class="flex justify-between"><strong class="text-sm">' + m.who + '</strong><span class="text-[10px] text-muted">' + m.time + '</span></div>'
            + '<div class="text-xs text-muted mt-1">' + m.text + '</div></div></li>').join('') + '</ul>',
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
    /* Highlight active sidebar item */
    $('#sidebar')?.querySelectorAll('.sb-link').forEach((a) => {
      const r = a.getAttribute('href');
      const active = r === route || (r !== '#/' && route.startsWith(r));
      a.classList.toggle('is-active', active);
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
