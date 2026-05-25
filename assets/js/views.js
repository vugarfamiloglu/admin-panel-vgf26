/* ----------------------------------------------------------------------
 * Views — every page is a function returning an HTML string.
 *
 * The router maps hash → view function.  Page-specific bootstrapping
 * (charts, sliders, etc.) lives in components.js#mount(pageId, root).
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  const I  = (n, c) => Icons.get(n, { size: 18, class: c || '' });
  const I_ = (n, s, c) => Icons.get(n, { size: s || 18, class: c || '' });
  const D = () => DEMO;

  /* ── Shared helpers ─────────────────────────────────────────────── */
  function pageHead(title, sub, crumbs, right) {
    const c = (crumbs || []).map((cr, i, arr) =>
      (i < arr.length - 1
        ? '<a href="' + (cr.route || '#/') + '">' + cr.title + '</a><span class="crumb-sep">/</span>'
        : '<span>' + cr.title + '</span>')
    ).join(' ');
    return ''
      + '<div class="page-head">'
      + '  <div>'
      + (crumbs ? '<div class="crumb">' + c + '</div>' : '')
      + '    <h1 class="page-title" style="margin-top:6px">' + title + '</h1>'
      + (sub ? '<p class="page-sub">' + sub + '</p>' : '')
      + '  </div>'
      + (right ? '<div class="page-head-right" style="display:flex;gap:8px;flex-wrap:wrap">' + right + '</div>' : '')
      + '</div>';
  }
  function section(title, body, sub) {
    return ''
      + '<section class="mb-8 animate-fade-up">'
      + '  <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:10px">'
      + '    <div><h2 style="font-family:DM Sans,Inter;font-weight:700;font-size:15px">' + title + '</h2>'
      + (sub ? '<p class="text-xs text-muted mt-1">' + sub + '</p>' : '')
      + '    </div>'
      + '  </div>'
      + '  ' + body
      + '</section>';
  }

  function statTile(label, value, change, trend, icon, color) {
    color = color || 'iris';
    return ''
      + '<div class="card card-pad hover-lift">'
      + '  <div class="flex items-center justify-between">'
      + '    <span class="text-[11px] uppercase tracking-wider text-muted font-semibold">' + label + '</span>'
      + '    <span class="grid place-items-center w-8 h-8 rounded-lg" style="background:rgb(var(--' + color + ')/.12);color:rgb(var(--' + color + '))">' + I(icon) + '</span>'
      + '  </div>'
      + '  <div class="mt-3" style="font-family:DM Sans,Inter;font-weight:700;font-size:24px">' + value + '</div>'
      + (change ? '<div class="text-xs mt-2 flex items-center gap-1 ' + (trend === 'up' ? 'text-emerald' : 'text-rose') + '">'
              + I_(trend === 'up' ? 'trending-up' : 'trending-down', 14)
              + '<span>' + change + '</span><span class="text-muted">vs last week</span></div>' : '')
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * DASHBOARD (home)
   * ───────────────────────────────────────────────────────────────── */
  function viewHome() {
    const tiles =
      statTile(I18n.t('home.stats.users'),    '24,892', '+12%', 'up', 'users', 'iris')
    + statTile(I18n.t('home.stats.revenue'),  '$142,540', '+8.4%', 'up', 'dollar', 'emerald')
    + statTile(I18n.t('home.stats.orders'),   '1,248', '-2.1%', 'down', 'cart', 'amber')
    + statTile(I18n.t('home.stats.uptime'),   '99.98%', '+0.04%', 'up', 'activity', 'cyan');

    const ordersRows = D().ORDERS.map(o =>
      '<tr><td>' + o.id + '</td>'
      + '<td><div class="flex items-center gap-2">' + D().avatarFor(o.cust) + '<span>' + o.cust + '</span></div></td>'
      + '<td>$' + o.amount.toFixed(2) + '</td>'
      + '<td><span class="pill pill-' + (o.status === 'completed' ? 'emerald' : o.status === 'pending' ? 'amber' : o.status === 'failed' ? 'rose' : 'iris') + '">' + o.status + '</span></td>'
      + '<td class="text-muted">' + o.date + '</td></tr>'
    ).join('');

    const activities = D().ACTIVITIES.map(a =>
      '<li class="flex gap-3 py-3 border-b border-[rgb(var(--line-soft))] last:border-0">'
      + '  <span class="grid place-items-center w-9 h-9 rounded-full shrink-0" style="background:rgb(var(--' + a.color + ')/.12);color:rgb(var(--' + a.color + '))">' + I(a.icon) + '</span>'
      + '  <div class="flex-1 text-sm leading-snug">'
      + '    <div><strong>' + a.who + '</strong> <span class="text-muted">' + a.what + '</span> ' + a.obj + '</div>'
      + '    <div class="text-[11px] text-muted mt-1">' + a.when + ' ago</div>'
      + '  </div>'
      + '</li>'
    ).join('');

    return ''
      + pageHead(I18n.t('home.hero.title'), I18n.t('home.hero.sub'),
          [{ title: I18n.t('common.dashboard') }],
          '<button class="btn btn-secondary">' + I('download') + '<span>' + I18n.t('common.export') + '</span></button>'
          + '<button class="btn btn-primary">' + I('plus') + '<span>' + I18n.t('common.create') + '</span></button>')
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">' + tiles + '</div>'

      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2">'
      + '    <div class="card-head"><h3>Revenue overview</h3>'
      + '      <div class="flex gap-1"><button class="btn btn-xs btn-secondary">Week</button><button class="btn btn-xs btn-primary">Month</button><button class="btn btn-xs btn-secondary">Year</button></div>'
      + '    </div>'
      + '    <div class="p-4" data-chart="line-revenue"></div>'
      + '  </div>'
      + '  <div class="card">'
      + '    <div class="card-head"><h3>Channel split</h3></div>'
      + '    <div class="p-4 flex flex-col items-center" data-chart="donut-channels"></div>'
      + '  </div>'
      + '</div>'

      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">'
      + '  <div class="card xl:col-span-2 overflow-hidden">'
      + '    <div class="card-head"><h3>Recent orders</h3><a href="#/commerce/storefront" class="text-iris text-sm">View all →</a></div>'
      + '    <table class="t-table"><thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>When</th></tr></thead>'
      + '    <tbody>' + ordersRows + '</tbody></table>'
      + '  </div>'
      + '  <div class="card">'
      + '    <div class="card-head"><h3>Recent activity</h3></div>'
      + '    <ul class="p-2">' + activities + '</ul>'
      + '  </div>'
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * CARDS — 20 variants
   * ───────────────────────────────────────────────────────────────── */
  function viewCards() {
    const head = pageHead('Cards · 20 variants', 'Glass, profile, product, pricing, stats, testimonial, feature, blog, team — every flavour you might need.',
      [{title:'Layout', route:'#/layouts'}, {title:'Cards'}]);

    const basic =
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'
      + '<div class="card card-pad"><div class="text-iris mb-2">' + I('sparkles') + '</div><h4 class="font-semibold">Basic card</h4><p class="text-sm text-muted mt-1">Simple bordered container with a soft shadow.</p></div>'
      + '<div class="glass-card p-5"><div class="text-iris mb-2">' + I('sparkles-2') + '</div><h4 class="font-semibold">Glass card</h4><p class="text-sm text-muted mt-1">Frosted glass with backdrop blur over the aurora background.</p></div>'
      + '<div class="gradient-border"><div class="card card-pad"><div class="text-fuchsia-500 mb-2">' + I('star') + '</div><h4 class="font-semibold">Gradient border</h4><p class="text-sm text-muted mt-1">Animated gradient outline for highlighting hero items.</p></div></div>'
      + '</div>';

    const profile =
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'
      + D().USERS.slice(0,3).map(u =>
          '<div class="card overflow-hidden hover-lift">'
          + '<div class="h-20" style="background:linear-gradient(135deg,#7c3aed,#d846ef,#06b6d4);background-size:200% 200%;animation:aurora-pan 8s ease-in-out infinite"></div>'
          + '<div class="px-4 pb-4 -mt-7">'
          + '  <div style="width:54px;height:54px;font-size:18px" class="avatar mb-2">' + (u.name.split(' ').map(x=>x[0]).join('')) + '</div>'
          + '  <h4 class="font-semibold">' + u.name + '</h4>'
          + '  <p class="text-xs text-muted">' + u.role + ' · ' + u.loc + '</p>'
          + '  <div class="flex gap-2 mt-3"><button class="btn btn-primary btn-xs">Follow</button><button class="btn btn-secondary btn-xs">Message</button></div>'
          + '</div>'
          + '</div>'
        ).join('')
      + '</div>';

    const product =
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'
      + D().PRODUCTS.slice(0,3).map((p, i) =>
          '<div class="card overflow-hidden hover-lift">'
          + '<div class="aspect-[4/3] relative" style="background:linear-gradient(135deg,' + ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef'][i] + ')">'
          + '  <span class="absolute top-3 right-3 pill pill-iris">NEW</span>'
          + '  <div class="absolute inset-0 grid place-items-center text-white/70" style="font-family:DM Sans;font-size:28px">' + p.name.split(' ')[0] + '</div>'
          + '</div>'
          + '<div class="p-4">'
          + '  <h4 class="font-semibold">' + p.name + '</h4>'
          + '  <p class="text-xs text-muted mt-1">SKU ' + p.sku + ' · stock ' + p.stock + '</p>'
          + '  <div class="flex items-center justify-between mt-3"><span style="font-family:DM Sans;font-weight:700;font-size:18px">$' + p.price.toFixed(2) + '</span>'
          + '    <button class="btn btn-primary btn-xs">' + I_('cart', 14) + '<span>Add</span></button>'
          + '  </div>'
          + '</div>'
          + '</div>'
        ).join('')
      + '</div>';

    const pricing =
      '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + ['Starter|$9|Free forever|Up to 5 projects|Community support|Single workspace',
         'Pro|$29|All Starter, plus|Unlimited projects|Priority support|Custom roles',
         'Enterprise|$99|All Pro, plus|SSO + SCIM|24/7 SLA|Audit log + DLP'].map((row,i) => {
        const [n,p,sub,...f] = row.split('|');
        const featured = i===1;
        return '<div class="' + (featured ? 'gradient-border' : '') + '">'
          + '<div class="card card-pad ' + (featured ? '' : 'hover-lift') + '">'
          + '<div class="flex items-center justify-between"><h4 class="font-semibold">' + n + '</h4>'
          + (featured ? '<span class="pill pill-iris">POPULAR</span>' : '') + '</div>'
          + '<div style="font-family:DM Sans;font-weight:700;font-size:32px" class="mt-3">' + p + '<span class="text-sm text-muted font-normal">/mo</span></div>'
          + '<p class="text-xs text-muted mt-1">' + sub + '</p>'
          + '<ul class="mt-4 space-y-2">' + f.map(x => '<li class="flex items-center gap-2 text-sm">' + I_('check-circle', 16, 'text-emerald') + '<span>' + x + '</span></li>').join('') + '</ul>'
          + '<button class="btn ' + (featured ? 'btn-primary' : 'btn-secondary') + ' w-full justify-center mt-5">Choose ' + n + '</button>'
          + '</div></div>';
      }).join('')
      + '</div>';

    const stats =
      '<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">'
      + statTile('Visitors',   '184.2k', '+18%', 'up',   'eye',         'iris')
      + statTile('Bounce',     '24.1%',  '-2.4%','up',   'trending-down','emerald')
      + statTile('Avg. time',  '3m 21s', '+12s', 'up',   'clock',        'cyan')
      + statTile('Errors',     '0.04%',  '-0.01%','up',  'alert-circle', 'amber')
      + '</div>';

    const testimonials =
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      + [
        ['"VGF26 saved us 3 weeks of design work — the gradient borders alone are art."', 'Sarah Jenkins', 'PM, Mercatum'],
        ['"Finally, a template where dark mode actually looks intentional, not bolted on."', 'Yuki Tanaka', 'Eng, Tokyo'],
      ].map(([q,n,r]) =>
        '<div class="card card-pad">'
        + '  <div class="text-iris">' + I_('message-circle', 22) + '</div>'
        + '  <p class="mt-3 text-base leading-relaxed">' + q + '</p>'
        + '  <div class="flex items-center gap-3 mt-4">' + D().avatarFor(n) + '<div><div class="font-semibold text-sm">' + n + '</div><div class="text-xs text-muted">' + r + '</div></div></div>'
        + '</div>'
      ).join('')
      + '</div>';

    const interactive =
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">'
      + [['Hover lift','hover-lift','sparkles','iris'],
         ['Tilt 3D','tilt-card','box','fuchsia'],
         ['Glow','glow-on-hover','star','cyan'],
         ['Flip','flip-card','refresh','emerald']].map(([t,c,i,color]) =>
        '<div class="card card-pad ' + c + '" style="cursor:pointer">'
        + '  <div class="text-' + color + ' mb-2">' + I(i) + '</div>'
        + '  <h4 class="font-semibold">' + t + '</h4>'
        + '  <p class="text-xs text-muted mt-1">Hover me to see the effect.</p>'
        + '</div>'
      ).join('')
      + '</div>';

    const blog =
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
      + [
        ['Designing for darkness', 'Why we kept the iridescence intact when the lights go out.', '5 min', 'iris'],
        ['Aurora gradients explained','A breakdown of the violet-to-fuchsia-to-cyan ramp we use.','3 min', 'fuchsia'],
        ['Building VGF26 — Day 1','The opening sketch for our admin studio template.','7 min', 'cyan'],
      ].map(([t,s,r,c]) =>
        '<article class="card overflow-hidden hover-lift">'
        + '  <div class="aspect-[16/9] relative" style="background:linear-gradient(135deg,rgb(var(--' + c + ')),rgb(var(--iris)))"></div>'
        + '  <div class="p-4">'
        + '    <span class="pill pill-' + c + '">DESIGN</span>'
        + '    <h4 class="font-semibold mt-2">' + t + '</h4>'
        + '    <p class="text-xs text-muted mt-1">' + s + '</p>'
        + '    <div class="text-[11px] text-muted mt-3 flex items-center gap-1">' + I_('clock',12) + r + ' read</div>'
        + '  </div>'
        + '</article>'
      ).join('')
      + '</div>';

    return head
      + section('Basic · Glass · Gradient border', basic)
      + section('Profile cards', profile)
      + section('Product cards', product)
      + section('Pricing cards', pricing)
      + section('Stats cards', stats)
      + section('Testimonial cards', testimonials)
      + section('Interactive · Hover · Flip · Tilt · Glow', interactive)
      + section('Blog cards', blog);
  }

  /* ─────────────────────────────────────────────────────────────────
   * GRIDS
   * ───────────────────────────────────────────────────────────────── */
  function viewGrids() {
    const head = pageHead('Grids · 10 variants', 'Masonry, Bento, auto-fit, CSS Grid layouts — copy-paste ready.',
      [{title:'Layout', route:'#/layouts'}, {title:'Grids'}]);

    const bento =
      '<div class="grid grid-cols-4 grid-rows-2 gap-3" style="min-height:280px">'
      + '<div class="card card-pad col-span-2 row-span-2"><span class="pill pill-iris">FEATURED</span><h4 class="font-semibold mt-2">Bento — large tile</h4><p class="text-sm text-muted mt-1">Spans 2 columns and 2 rows. Use for hero charts or imagery.</p></div>'
      + '<div class="card card-pad"><h4 class="font-semibold">Small A</h4><p class="text-xs text-muted">1×1</p></div>'
      + '<div class="card card-pad"><h4 class="font-semibold">Small B</h4><p class="text-xs text-muted">1×1</p></div>'
      + '<div class="card card-pad col-span-2"><h4 class="font-semibold">Wide</h4><p class="text-xs text-muted">2×1 — perfect for a recent activity feed.</p></div>'
      + '</div>';

    const masonry =
      '<div class="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3">'
      + [120, 180, 90, 200, 140, 110, 170, 130].map((h,i) =>
        '<div class="card card-pad break-inside-avoid" style="min-height:' + h + 'px">'
        + '<h4 class="font-semibold text-sm">Tile #' + (i+1) + '</h4>'
        + '<p class="text-xs text-muted mt-1">Heights vary, columns pack tightly.</p></div>'
      ).join('')
      + '</div>';

    const autoFit =
      '<div class="grid gap-3" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">'
      + Array.from({length:8}, (_,i) => '<div class="card card-pad"><div class="text-iris mb-1">' + I('grid') + '</div><h4 class="font-semibold text-sm">Card ' + (i+1) + '</h4><p class="text-xs text-muted">auto-fit · min 180px</p></div>').join('')
      + '</div>';

    const splitGrid =
      '<div class="grid grid-cols-12 gap-3">'
      + '<div class="card card-pad col-span-12 md:col-span-8"><h4 class="font-semibold">Main area (8/12)</h4></div>'
      + '<div class="card card-pad col-span-12 md:col-span-4"><h4 class="font-semibold">Sidebar (4/12)</h4></div>'
      + '<div class="card card-pad col-span-6 md:col-span-3"><h4 class="font-semibold">3/12</h4></div>'
      + '<div class="card card-pad col-span-6 md:col-span-3"><h4 class="font-semibold">3/12</h4></div>'
      + '<div class="card card-pad col-span-6 md:col-span-3"><h4 class="font-semibold">3/12</h4></div>'
      + '<div class="card card-pad col-span-6 md:col-span-3"><h4 class="font-semibold">3/12</h4></div>'
      + '</div>';

    return head
      + section('Bento grid', bento, 'Mix wide / tall / small tiles in a 4×2 grid.')
      + section('Masonry grid', masonry, 'CSS columns + break-inside-avoid for true Pinterest-style packing.')
      + section('Auto-fit grid', autoFit, 'grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))')
      + section('Split / dashboard grid', splitGrid, 'Classic 12-column grid with mixed spans.');
  }

  /* ─────────────────────────────────────────────────────────────────
   * LISTS
   * ───────────────────────────────────────────────────────────────── */
  function viewLists() {
    const head = pageHead('Lists · 14 variants', 'Ordered, unordered, nested, tree, drag-drop, virtualized — every kind of list.',
      [{title:'Data', route:'#/lists'}, {title:'Lists'}]);

    const basic =
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      + '<div class="card card-pad"><h4 class="font-semibold mb-2">Unordered</h4><ul class="space-y-2 text-sm">'
        + ['Design tokens', 'Component library', 'Theming engine', 'Internationalization', 'Accessibility audit'].map(x => '<li class="flex items-center gap-2">' + I_('check-circle', 14, 'text-emerald') + x + '</li>').join('')
        + '</ul></div>'
      + '<div class="card card-pad"><h4 class="font-semibold mb-2">Ordered</h4><ol class="space-y-2 text-sm list-decimal pl-5">'
        + ['Sketch the wireframe','Pick the colour ramp','Build the icon library','Wire the router','Ship to GitHub'].map(x => '<li>' + x + '</li>').join('')
        + '</ol></div>'
      + '</div>';

    const nested =
      '<div class="card card-pad"><h4 class="font-semibold mb-2">Nested (tree)</h4>'
      + '<ul class="space-y-1 text-sm">'
      + '  <li><div class="flex items-center gap-2 py-1">' + I_('folder', 16, 'text-iris') + '<strong>src/</strong></div>'
      + '    <ul class="pl-6 space-y-1">'
      + '      <li><div class="flex items-center gap-2 py-1">' + I_('folder', 16, 'text-iris') + '<strong>components/</strong></div>'
      + '        <ul class="pl-6 space-y-1">'
      + '          <li class="flex items-center gap-2 py-1 text-muted">' + I_('file', 16) + 'Button.tsx</li>'
      + '          <li class="flex items-center gap-2 py-1 text-muted">' + I_('file', 16) + 'Card.tsx</li>'
      + '          <li class="flex items-center gap-2 py-1 text-muted">' + I_('file', 16) + 'Modal.tsx</li>'
      + '        </ul></li>'
      + '      <li class="flex items-center gap-2 py-1 text-muted">' + I_('file', 16) + 'app.css</li>'
      + '      <li class="flex items-center gap-2 py-1 text-muted">' + I_('file', 16) + 'index.html</li>'
      + '    </ul></li>'
      + '</ul></div>';

    const dnd =
      '<div class="card card-pad" data-mount="dnd-list">'
      + '<h4 class="font-semibold mb-3">Drag & drop reorderable</h4>'
      + '<ul id="dnd-list" class="space-y-2 text-sm">'
      + ['Sprint planning', 'Daily standup', 'Code review', 'QA testing', 'Deployment', 'Retrospective'].map((x,i) =>
          '<li draggable="true" data-i="' + i + '" class="flex items-center gap-3 p-3 bg-soft rounded-lg cursor-grab active:cursor-grabbing border border-[rgb(var(--line))] hover:border-[rgb(var(--iris))]">'
          + '  <span class="text-muted">' + I_('more-vertical', 14) + '</span>'
          + '  <span class="flex-1">' + x + '</span>'
          + '  <span class="pill pill-muted">Step ' + (i+1) + '</span>'
          + '</li>'
        ).join('') + '</ul></div>';

    const timeline =
      '<div class="card card-pad"><h4 class="font-semibold mb-3">Timeline</h4>'
      + '<ol class="relative border-l-2 border-[rgb(var(--iris)/.25)] pl-6 space-y-5">'
      + [
        ['2026-05-25','Released v1.0','VGF26 1.0 shipped — 220 components, 3 languages.','iris'],
        ['2026-04-12','Beta v0.9','Added Iridescent UI tokens and dark mode.','fuchsia'],
        ['2026-03-01','Alpha v0.5','Initial sidebar + router + 60 components.','cyan'],
        ['2026-01-15','Kickoff','Sketches and design tokens drafted.','emerald'],
      ].map(([d,t,b,c]) =>
        '<li class="relative">'
        + '<span class="absolute -left-[33px] top-1 w-4 h-4 rounded-full" style="background:linear-gradient(135deg,rgb(var(--' + c + ')),rgb(var(--iris)));box-shadow:0 0 0 3px rgb(var(--bg))"></span>'
        + '<time class="text-[11px] text-muted font-mono">' + d + '</time>'
        + '<h5 class="font-semibold mt-1">' + t + '</h5>'
        + '<p class="text-xs text-muted">' + b + '</p>'
        + '</li>'
      ).join('') + '</ol></div>';

    const accordion =
      '<div class="card divide-y divide-[rgb(var(--line-soft))]" data-mount="accordion">'
      + [
        ['How do I add a custom theme?','Edit assets/css/app.css — duplicate the :root tokens block and target [data-theme="<your-name>"]. Then update the topbar theme switcher.'],
        ['Where do I add a new sidebar item?','In assets/js/nav.js. Each item just needs id, title, route (a hash). views.js registers the matching render function.'],
        ['How is i18n handled?','assets/js/i18n.js. Call I18n.setLang(\'az\') and every subscribed view re-renders. Add your keys in the STR object.'],
      ].map(([q,a],i) =>
        '<details ' + (i===0 ? 'open' : '') + ' class="group">'
        + '<summary class="p-4 cursor-pointer list-none flex items-center justify-between font-semibold">'
        + '  <span>' + q + '</span><span class="text-iris transition-transform group-open:rotate-180">' + I_('chevron-down', 18) + '</span>'
        + '</summary>'
        + '<div class="px-4 pb-4 text-sm text-muted">' + a + '</div>'
        + '</details>'
      ).join('') + '</div>';

    const kanban =
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">'
      + [['Backlog', ['Add CSV export', 'Document keyboard shortcuts', 'Refactor sidebar', 'i18n: TR + ES'], 'muted'],
         ['In progress', ['Wire chart tooltips', 'Theme generator UI', 'Accessibility audit'], 'amber'],
         ['Done', ['Iridescent tokens', 'Sidebar collapse', 'Toast portal'], 'emerald']].map(([title, items, color]) =>
        '<div class="card card-pad">'
        + '<div class="flex items-center justify-between mb-3">'
        + '  <div class="flex items-center gap-2"><span class="pill-dot" style="background:rgb(var(--' + color + '))"></span><h5 class="font-semibold">' + title + '</h5></div>'
        + '  <span class="text-xs text-muted">' + items.length + '</span>'
        + '</div>'
        + items.map(t => '<div class="bg-soft border border-[rgb(var(--line))] rounded-lg p-3 mb-2 text-sm hover:border-[rgb(var(--iris))] cursor-grab"><div class="font-medium">' + t + '</div><div class="text-[11px] text-muted mt-1 flex items-center gap-2"><span>' + I_('clock', 11) + '</span>2h ago</div></div>').join('')
        + '</div>'
      ).join('')
      + '</div>';

    return head
      + section('Ordered & unordered', basic)
      + section('Nested / tree view', nested)
      + section('Drag-&-drop reorderable', dnd, 'Native HTML5 DnD — try dragging items.')
      + section('Timeline list', timeline)
      + section('Accordion / collapsible', accordion)
      + section('Kanban board', kanban);
  }

  /* ─────────────────────────────────────────────────────────────────
   * TABLES
   * ───────────────────────────────────────────────────────────────── */
  function viewTables() {
    const head = pageHead('Tables · 8 variants', 'Sortable, sticky, expandable, comparison — production-grade table patterns.',
      [{title:'Data', route:'#/tables'}, {title:'Tables'}]);

    const rows = D().PRODUCTS.map(p =>
      '<tr><td><strong>' + p.id + '</strong></td>'
      + '<td>' + p.name + '</td>'
      + '<td class="font-mono text-xs text-muted">' + p.sku + '</td>'
      + '<td>' + p.cat + '</td>'
      + '<td class="text-right">$' + p.price.toFixed(2) + '</td>'
      + '<td class="text-right"><span class="pill ' + (p.stock < 50 ? 'pill-amber' : 'pill-emerald') + '">' + p.stock + '</span></td>'
      + '<td class="text-right">' + p.sales + '</td>'
      + '<td class="text-right"><button class="btn btn-ghost btn-xs">' + I_('more-horizontal', 14) + '</button></td></tr>'
    ).join('');

    const dataTable =
      '<div class="card overflow-hidden">'
      + '<div class="card-head">'
      + '  <h3>Inventory</h3>'
      + '  <div class="flex items-center gap-2"><input class="input" style="height:32px;width:200px" placeholder="Filter…">'
      + '    <button class="btn btn-secondary btn-xs">' + I_('filter', 14) + 'Filter</button>'
      + '    <button class="btn btn-primary btn-xs">' + I_('download', 14) + 'Export</button>'
      + '  </div>'
      + '</div>'
      + '<div style="max-height:420px;overflow:auto">'
      + '<table class="t-table">'
      + '  <thead><tr><th>ID</th><th>Product</th><th>SKU</th><th>Category</th><th class="text-right">Price</th><th class="text-right">Stock</th><th class="text-right">Sales</th><th></th></tr></thead>'
      + '  <tbody>' + rows + '</tbody>'
      + '</table>'
      + '</div>'
      + '<div class="p-3 flex justify-between items-center border-t border-[rgb(var(--line))]">'
      + '  <span class="text-xs text-muted">Showing 1–8 of 248</span>'
      + '  <div class="flex gap-1">'
      + '    <button class="btn btn-secondary btn-xs">' + I_('chevron-left',14) + '</button>'
      + '    <button class="btn btn-primary btn-xs">1</button>'
      + '    <button class="btn btn-secondary btn-xs">2</button>'
      + '    <button class="btn btn-secondary btn-xs">3</button>'
      + '    <button class="btn btn-secondary btn-xs">' + I_('chevron-right',14) + '</button>'
      + '  </div>'
      + '</div>'
      + '</div>';

    const compare =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Plan comparison</h3></div>'
      + '<table class="t-table">'
      + '<thead><tr><th></th><th class="text-center">Starter</th><th class="text-center" style="background:rgb(var(--iris)/.06)">Pro</th><th class="text-center">Enterprise</th></tr></thead>'
      + '<tbody>'
      + [['Projects','5','Unlimited','Unlimited'],['Workspaces','1','5','Unlimited'],['SSO','—','—','✓'],['Audit log','—','✓','✓'],['Custom roles','—','✓','✓'],['Priority support','—','24/5','24/7 SLA']].map(([k,...v]) =>
          '<tr><td><strong>' + k + '</strong></td>' + v.map((x,i) => '<td class="text-center ' + (i===1 ? '' : '') + '" ' + (i===1 ? 'style="background:rgb(var(--iris)/.04)"' : '') + '>' + (x === '✓' ? '<span class="text-emerald">' + I_('check', 16) + '</span>' : x === '—' ? '<span class="text-muted">—</span>' : x) + '</td>').join('') + '</tr>').join('')
      + '</tbody></table></div>';

    return head
      + section('Data table — sortable, sticky, paginated', dataTable)
      + section('Comparison table', compare);
  }

  /* ─────────────────────────────────────────────────────────────────
   * FORMS
   * ───────────────────────────────────────────────────────────────── */
  function viewFormsInputs() {
    const head = pageHead('Inputs · Selects · Toggles', 'Every form primitive — inputs, selects, switches, checkboxes, radios, textarea.',
      [{title:'Forms', route:'#/forms/inputs'}, {title:'Inputs'}]);

    return head
      + section('Text inputs',
        '<div class="card card-pad grid grid-cols-1 md:grid-cols-2 gap-4">'
        + '<div><label class="label">Email</label><input class="input" placeholder="you@vgf26.io" type="email"></div>'
        + '<div><label class="label">Password</label><div class="input-with-icon" style="position:relative"><input class="input" type="password" placeholder="••••••••" id="pw-1" style="padding-right:42px"><button class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-iris p-1" data-act="toggle-pw" data-target="pw-1">' + I_('eye', 16) + '</button></div></div>'
        + '<div><label class="label">Disabled</label><input class="input" disabled placeholder="Not editable"></div>'
        + '<div><label class="label">With error</label><input class="input" value="invalid@" style="border-color:rgb(var(--rose));box-shadow:0 0 0 3px rgb(var(--rose)/.18)"><span class="text-xs text-rose mt-1 block">Looks like an invalid email.</span></div>'
        + '<div class="md:col-span-2"><label class="label">Bio</label><textarea class="textarea" placeholder="Tell us about yourself…"></textarea></div>'
        + '</div>')

      + section('Toggles & checkboxes',
        '<div class="card card-pad space-y-4">'
        + '<div class="flex items-center justify-between"><span class="text-sm">Enable notifications</span><span class="switch is-on" data-toggle></span></div>'
        + '<div class="flex items-center justify-between"><span class="text-sm">Dark mode auto-switch</span><span class="switch" data-toggle></span></div>'
        + '<div class="divider-h"></div>'
        + '<label class="flex items-center gap-3 cursor-pointer"><span class="checkbox is-on" data-check></span><span class="text-sm">Subscribe to product updates</span></label>'
        + '<label class="flex items-center gap-3 cursor-pointer"><span class="checkbox" data-check></span><span class="text-sm">Receive marketing emails</span></label>'
        + '<div class="divider-h"></div>'
        + '<div class="flex gap-6"><label class="flex items-center gap-2 cursor-pointer"><span class="radio is-on" data-radio="role"></span><span class="text-sm">Admin</span></label>'
        + '<label class="flex items-center gap-2 cursor-pointer"><span class="radio" data-radio="role"></span><span class="text-sm">Editor</span></label>'
        + '<label class="flex items-center gap-2 cursor-pointer"><span class="radio" data-radio="role"></span><span class="text-sm">Viewer</span></label></div>'
        + '</div>')

      + section('Selects & sliders',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
        + '<div class="card card-pad"><label class="label">Country</label><select class="select"><option>Azerbaijan</option><option>Germany</option><option>Japan</option><option>United States</option></select></div>'
        + '<div class="card card-pad"><label class="label">Range — opacity</label><input type="range" min="0" max="100" value="62" class="w-full accent-[rgb(var(--iris))]"><div class="text-xs text-muted mt-1 flex justify-between"><span>0</span><span>62</span><span>100</span></div></div>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * ICONS gallery
   * ───────────────────────────────────────────────────────────────── */
  function viewIcons() {
    const head = pageHead('Icon library', 'All ' + Icons.names().length + ' icons.  Use <code class="kbd">Icons.get(name, opts)</code>.',
      [{title:'System', route:'#/system/icons'}, {title:'Icons'}]);
    const grid =
      '<div class="grid gap-2" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr))">'
      + Icons.names().map(n =>
          '<button class="card card-pad text-center hover-lift cursor-pointer" data-act="copy" data-copy="Icons.get(\'' + n + '\')" title="Click to copy">'
          + '<div class="grid place-items-center h-10 text-iris">' + Icons.get(n, {size: 22}) + '</div>'
          + '<div class="text-[10.5px] text-muted mt-1 font-mono truncate">' + n + '</div>'
          + '</button>').join('')
      + '</div>';
    return head + grid;
  }

  /* ─────────────────────────────────────────────────────────────────
   * COMMAND PALETTE
   * ───────────────────────────────────────────────────────────────── */
  function viewPalette() {
    const head = pageHead('Command palette', 'Cmd+K / Ctrl+K to open. Fuzzy search through every page.',
      [{title:'Navigation', route:'#/nav/palette'}, {title:'Command palette'}]);
    return head
      + section('Try it now',
        '<div class="card card-pad text-center">'
        + '<button class="btn btn-primary" data-act="open-palette">' + I('sparkles') + '<span>Open command palette</span><span class="kbd ml-2" style="background:rgb(255 255 255 / .2);border-color:transparent;color:#fff">⌘K</span></button>'
        + '<p class="text-xs text-muted mt-3">Or press <span class="kbd">⌘ K</span> / <span class="kbd">Ctrl K</span> from anywhere.</p>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * OVERLAYS — modals / toasts / popovers
   * ───────────────────────────────────────────────────────────────── */
  function viewModals() {
    const head = pageHead('Modal · Drawer · Offcanvas', 'Portal-based dialogs that lock the underlying scroll.',
      [{title:'Overlays'}, {title:'Modals'}]);
    return head
      + section('Modal sizes',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + '<button class="btn btn-primary" data-act="open-modal" data-size="sm">Small modal</button>'
        + '<button class="btn btn-primary" data-act="open-modal" data-size="md">Medium modal</button>'
        + '<button class="btn btn-primary" data-act="open-modal" data-size="lg">Large modal</button>'
        + '<button class="btn btn-danger" data-act="open-confirm">Confirm (destructive)</button>'
        + '<button class="btn btn-secondary" data-act="open-prompt">Prompt</button>'
        + '</div>');
  }

  function viewToasts() {
    const head = pageHead('Toast · Snackbar · Alert', 'Stacked top-right with portal rendering.',
      [{title:'Overlays'}, {title:'Toast'}]);
    return head
      + section('Try every kind',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + '<button class="btn btn-secondary" data-act="toast" data-kind="info">Info toast</button>'
        + '<button class="btn btn-secondary" data-act="toast" data-kind="success">Success toast</button>'
        + '<button class="btn btn-secondary" data-act="toast" data-kind="warn">Warning toast</button>'
        + '<button class="btn btn-secondary" data-act="toast" data-kind="error">Error toast</button>'
        + '</div>');
  }

  function viewProgress() {
    const head = pageHead('Progress · Spinner · Skeleton', 'All the loading states you\'ll ever need.',
      [{title:'Overlays'}, {title:'Progress'}]);
    return head
      + section('Linear progress',
        '<div class="card card-pad space-y-4">'
        + '<div><div class="flex justify-between text-xs mb-2"><span class="text-muted">Uploading…</span><span class="font-mono">68%</span></div>'
        + '<div class="h-2 rounded-full overflow-hidden bg-soft"><div style="width:68%;height:100%;background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)))"></div></div></div>'
        + '<div><div class="flex justify-between text-xs mb-2"><span class="text-muted">Indeterminate</span></div>'
        + '<div class="h-2 rounded-full overflow-hidden bg-soft"><div style="width:35%;height:100%;background:linear-gradient(90deg,rgb(var(--cyan)),rgb(var(--iris)));animation:slide 1.5s ease-in-out infinite"></div></div></div>'
        + '<style>@keyframes slide{0%{margin-left:-40%}100%{margin-left:100%}}</style>'
        + '</div>')

      + section('Circular progress',
        '<div class="card card-pad flex items-center gap-8 flex-wrap">'
        + [25, 50, 78, 100].map(p => {
            const c = 2 * Math.PI * 28;
            return '<div class="text-center"><svg width="80" height="80" viewBox="0 0 64 64" class="-rotate-90">'
              + '<circle cx="32" cy="32" r="28" stroke="rgb(var(--line))" stroke-width="6" fill="none"/>'
              + '<circle cx="32" cy="32" r="28" stroke="url(#grad-' + p + ')" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c - c * p/100) + '"/>'
              + '<defs><linearGradient id="grad-' + p + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#d846ef"/></linearGradient></defs>'
              + '</svg><div class="font-mono font-bold mt-1">' + p + '%</div></div>';
          }).join('')
        + '</div>')

      + section('Spinners & dots',
        '<div class="card card-pad flex items-center gap-10 flex-wrap">'
        + '<div class="dot-loader"><span></span><span></span><span></span></div>'
        + '<div class="w-8 h-8 border-4 border-[rgb(var(--line))] border-t-[rgb(var(--iris))] rounded-full" style="animation:spin 1s linear infinite"></div>'
        + '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>'
        + '<div class="text-iris">' + I_('refresh', 24) + '</div>'
        + '</div>')

      + section('Skeleton loaders',
        '<div class="card card-pad space-y-3">'
        + '<div class="flex gap-3 items-center"><div class="skeleton w-12 h-12 rounded-full"></div><div class="flex-1 space-y-2"><div class="skeleton h-3 w-1/3"></div><div class="skeleton h-3 w-1/2"></div></div></div>'
        + '<div class="skeleton h-3 w-full"></div><div class="skeleton h-3 w-4/5"></div><div class="skeleton h-3 w-2/3"></div>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * EFFECTS — Glass / Neumorphism / Glow / Tilt / Particles
   * ───────────────────────────────────────────────────────────────── */
  function viewMorphism() {
    const head = pageHead('Glass · Neumorphism · Frosted', 'Material treatments — pick the right surface for the job.',
      [{title:'Effects'}, {title:'Morphism'}]);
    return head
      + section('Glassmorphism',
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'
        + Array(3).fill(0).map((_,i) => '<div class="glass-card p-5"><div class="text-iris mb-2">' + I('sparkles-2') + '</div><h4 class="font-semibold">Glass tile ' + (i+1) + '</h4><p class="text-xs text-muted mt-1">Frosted with backdrop-filter blur(16px).</p></div>').join('')
        + '</div>')

      + section('Neumorphism',
        '<div class="card-pad rounded-xl2" style="background:rgb(var(--bg-soft));box-shadow:8px 8px 24px rgb(0 0 0 / .06),-8px -8px 24px rgb(255 255 255 / .9)">'
        + '<h4 class="font-semibold mb-3">Soft UI panel</h4>'
        + '<div class="flex gap-3"><button class="rounded-xl px-5 py-3 text-sm font-semibold" style="background:rgb(var(--bg-soft));box-shadow:4px 4px 10px rgb(0 0 0 / .08),-4px -4px 10px rgb(255 255 255 / .8)">Press me</button>'
        + '<button class="rounded-xl px-5 py-3 text-sm font-semibold" style="background:rgb(var(--bg-soft));box-shadow:inset 3px 3px 8px rgb(0 0 0 / .08),inset -3px -3px 8px rgb(255 255 255 / .8)">Pressed</button></div>'
        + '</div>')

      + section('Gradient borders',
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'
        + Array(3).fill(0).map((_,i) => '<div class="gradient-border"><div class="card card-pad"><h4 class="font-semibold">Outlined ' + (i+1) + '</h4><p class="text-xs text-muted mt-1">Animated 3-stop gradient ring around a regular card.</p></div></div>').join('')
        + '</div>');
  }

  function viewParticles() {
    const head = pageHead('Particle · Aurora · Animated background', 'Layered SVG noise + animated blobs.',
      [{title:'Effects'}, {title:'Particles'}]);
    return head
      + section('Aurora blobs',
        '<div class="card overflow-hidden relative h-72">'
        + '<div class="absolute inset-0">'
        + '  <div class="aurora-blob aurora-blob--violet" style="position:absolute;top:-20%;left:-10%;width:60%;height:120%"></div>'
        + '  <div class="aurora-blob aurora-blob--fuchsia" style="position:absolute;top:-20%;right:-10%;width:60%;height:120%"></div>'
        + '  <div class="aurora-blob aurora-blob--cyan" style="position:absolute;bottom:-50%;left:30%;width:60%;height:120%"></div>'
        + '</div>'
        + '<div class="absolute inset-0 grid place-items-center"><div class="text-center"><h3 class="text-2xl font-bold" style="font-family:DM Sans">Iridescent aurora</h3><p class="text-sm text-muted mt-1">Same blobs you see behind the panel.</p></div></div>'
        + '</div>')

      + section('Particle dots',
        '<div class="card overflow-hidden relative h-64" data-particles>'
        + '<canvas data-canvas="particles" class="absolute inset-0 w-full h-full"></canvas>'
        + '<div class="absolute inset-0 grid place-items-center pointer-events-none"><div class="text-center"><h3 class="text-2xl font-bold" style="font-family:DM Sans">300 floating points</h3><p class="text-sm text-muted mt-1">Vanilla canvas — no library.</p></div></div>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * CHARTS — line / bar / pie / radar / sparkline
   * ───────────────────────────────────────────────────────────────── */
  function viewChartLine() {
    const head = pageHead('Line / Area chart', 'Inline SVG line chart, no library dependency.',
      [{title:'Charts'}, {title:'Line'}]);
    return head
      + section('Monthly revenue',
        '<div class="card"><div class="card-head"><h3>Last 12 months</h3></div><div class="p-4" data-chart="line-revenue-lg"></div></div>')
      + section('Comparison area chart',
        '<div class="card"><div class="card-head"><h3>Visitors vs sessions</h3></div><div class="p-4" data-chart="area-compare"></div></div>');
  }
  function viewChartBar() {
    const head = pageHead('Bar / Stacked bar', 'Vertical bars with gradient fills.',
      [{title:'Charts'}, {title:'Bar'}]);
    return head + section('Sales by category', '<div class="card"><div class="card-head"><h3>Weekly sales</h3></div><div class="p-4" data-chart="bar-sales"></div></div>');
  }
  function viewChartPie() {
    const head = pageHead('Pie · Donut · Radar', 'Slice and dial views.',
      [{title:'Charts'}, {title:'Pie'}]);
    return head
      + section('Channels donut', '<div class="card"><div class="card-head"><h3>Traffic source</h3></div><div class="p-6 grid place-items-center" data-chart="donut-channels-lg"></div></div>')
      + section('Radar chart', '<div class="card"><div class="card-head"><h3>Skills coverage</h3></div><div class="p-6 grid place-items-center" data-chart="radar-skills"></div></div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * AUTH pages
   * ───────────────────────────────────────────────────────────────── */
  function viewLogin() {
    const head = pageHead('Login & signup', 'Split-screen auth screens with aurora hero.',
      [{title:'Auth'}, {title:'Login'}]);
    return head
      + section('Demo',
        '<div class="card overflow-hidden grid md:grid-cols-2">'
        + '<div class="relative p-8 text-white overflow-hidden min-h-[420px]" style="background:linear-gradient(135deg,#5618b5,#7c3aed,#d846ef);background-size:200% 200%;animation:aurora-pan 12s ease-in-out infinite">'
        + '  <div style="font-family:DM Sans;font-weight:700;font-size:18px" class="flex items-center gap-2">' + I_('sparkles', 22) + 'VGF26 Studio</div>'
        + '  <h2 style="font-family:DM Sans;font-weight:700;font-size:36px;line-height:1.1" class="mt-16">Welcome to the iridescent admin studio.</h2>'
        + '  <p class="mt-4 text-white/80 text-sm leading-relaxed max-w-sm">220+ components, 3 languages, dark + light themes — and zero npm install required.</p>'
        + '  <div class="mt-10 flex items-center gap-3 text-xs text-white/60"><div class="avatar-stack flex">' + D().USERS.slice(0,4).map(u => '<div class="avatar" style="width:28px;height:28px;font-size:11px">' + u.name.split(' ').map(x=>x[0]).join('') + '</div>').join('') + '</div><span>Trusted by 12,400+ designers and devs</span></div>'
        + '</div>'
        + '<div class="p-8 flex flex-col justify-center">'
        + '  <h3 style="font-family:DM Sans;font-weight:700;font-size:24px">Sign in</h3>'
        + '  <p class="text-sm text-muted mt-1 mb-6">Welcome back — let\'s pick up where you left off.</p>'
        + '  <label class="label">Email</label><input class="input mb-4" value="alex@vgf26.io">'
        + '  <label class="label">Password</label><div class="input-with-icon relative"><input class="input" type="password" value="iridescent2026" id="pw-login" style="padding-right:42px"><button class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-iris p-1" data-act="toggle-pw" data-target="pw-login">' + I_('eye', 16) + '</button></div>'
        + '  <div class="flex items-center justify-between mt-4 text-xs"><label class="flex items-center gap-2 cursor-pointer"><span class="checkbox is-on" data-check></span><span>Remember me</span></label><a href="#/auth/forgot" class="text-iris">Forgot password?</a></div>'
        + '  <button class="btn btn-primary justify-center mt-6">Sign in</button>'
        + '  <div class="my-5 flex items-center gap-3 text-xs text-muted"><div class="flex-1 divider-h"></div>OR<div class="flex-1 divider-h"></div></div>'
        + '  <div class="grid grid-cols-2 gap-2"><button class="btn btn-secondary justify-center">' + I('github') + '<span>GitHub</span></button><button class="btn btn-secondary justify-center">' + I('mail') + '<span>Google</span></button></div>'
        + '  <p class="text-xs text-center text-muted mt-6">No account? <a href="#" class="text-iris">Create one</a></p>'
        + '</div>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * ERROR pages (404 / 500 / Maintenance)
   * ───────────────────────────────────────────────────────────────── */
  function viewErrors() {
    const head = pageHead('Error & state pages', '404, 500, Offline, Maintenance, Empty, Success.',
      [{title:'Auth & Errors'}, {title:'Errors'}]);

    function err(code, title, body, color) {
      return '<div class="card card-pad text-center py-10">'
        + '<div class="mx-auto grid place-items-center w-24 h-24 rounded-full" style="background:linear-gradient(135deg,rgb(var(--' + color + ')),rgb(var(--iris)));color:#fff">'
        + '<span style="font-family:DM Sans;font-weight:700;font-size:34px">' + code + '</span></div>'
        + '<h3 class="mt-4 text-xl font-bold" style="font-family:DM Sans">' + title + '</h3>'
        + '<p class="text-sm text-muted mt-2 max-w-md mx-auto">' + body + '</p>'
        + '<button class="btn btn-primary mt-5">Go home</button>'
        + '</div>';
    }
    return head
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      + err('404', 'Page not found',     'The page you\'re looking for doesn\'t exist or has been moved.', 'iris')
      + err('500', 'Server error',       'Something went wrong on our end. Engineering has been notified.', 'rose')
      + err('503', 'Maintenance',        'We\'re polishing things up. Back in a few minutes.', 'amber')
      + err('OFF', 'Offline',            'No internet connection. Reconnect to continue.', 'cyan')
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * PRICING (Commerce)
   * ───────────────────────────────────────────────────────────────── */
  function viewPricing() {
    return pageHead('Pricing tables · 5 designs',
        'Tiered featured · monthly/yearly toggle · dark enterprise · simple · detailed comparison.',
        [{title:'Commerce'}, {title:'Pricing'}])

      /* ── Variant 1 — Tiered with featured plan ──────────────── */
      + section('Tiered with featured plan',
        '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
        + ['Starter|$9|Free forever|Up to 5 projects|Community support|Single workspace',
           'Pro|$29|All Starter, plus|Unlimited projects|Priority support|Custom roles|Audit log',
           'Enterprise|$99|All Pro, plus|SSO + SCIM|24/7 SLA|DLP + Compliance|Dedicated CSM'].map((row,i) => {
          const [n,p,sub,...f] = row.split('|');
          const featured = i === 1;
          return '<div class="' + (featured ? 'gradient-border' : '') + '">'
            + '<div class="card card-pad ' + (featured ? '' : 'hover-lift') + '" style="min-height:100%">'
            + '<div class="flex items-center justify-between"><h4 class="font-semibold text-lg">' + n + '</h4>'
            + (featured ? '<span class="pill pill-iris">★ POPULAR</span>' : '') + '</div>'
            + '<div style="font-family:DM Sans;font-weight:700;font-size:42px" class="mt-3">' + p + '<span class="text-sm text-muted font-normal">/mo</span></div>'
            + '<p class="text-xs text-muted mt-1">' + sub + '</p>'
            + '<ul class="mt-5 space-y-2">' + f.map(x => '<li class="flex items-center gap-2 text-sm">' + I_('check-circle', 16, 'text-emerald') + '<span>' + x + '</span></li>').join('') + '</ul>'
            + '<button class="btn ' + (featured ? 'btn-primary' : 'btn-secondary') + ' w-full justify-center mt-6">Choose ' + n + '</button>'
            + '</div></div>';
        }).join('')
        + '</div>')

      /* ── Variant 2 — Billing toggle ─────────────────────────── */
      + section('Monthly / yearly toggle (save 20%)',
        '<div class="card card-pad" id="price-toggle-card">'
        + '<div class="flex justify-center mb-6"><div class="price-toggle">'
        + '<button class="is-on" onclick="this.classList.add(\'is-on\');this.nextElementSibling.classList.remove(\'is-on\');document.getElementById(\'price-toggle-card\').querySelectorAll(\'.price-month\').forEach(e=>e.style.display=\'\');document.getElementById(\'price-toggle-card\').querySelectorAll(\'.price-year\').forEach(e=>e.style.display=\'none\')">Monthly</button>'
        + '<button onclick="this.classList.add(\'is-on\');this.previousElementSibling.classList.remove(\'is-on\');document.getElementById(\'price-toggle-card\').querySelectorAll(\'.price-month\').forEach(e=>e.style.display=\'none\');document.getElementById(\'price-toggle-card\').querySelectorAll(\'.price-year\').forEach(e=>e.style.display=\'\')">Yearly · save 20%</button>'
        + '</div></div>'
        + '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + [['Hobby', 0, 0,'Forever free','5 projects','Community support'],
           ['Studio', 19, 182,'Most popular','Unlimited projects','Priority email + chat'],
           ['Team', 49, 470,'Per seat','Everything in Studio','SSO · audit · DLP']].map(([n, m, y, note, ...feats], i) => {
            const featured = i === 1;
            return '<div class="card card-pad hover-lift relative overflow-hidden ' + (featured ? 'ring-2 ring-[rgb(var(--iris))]' : '') + '">'
              + (featured ? '<div class="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold tracking-wider rounded-bl-xl" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">RECOMMENDED</div>' : '')
              + '<div class="text-xs uppercase tracking-wider text-muted font-semibold">' + n + '</div>'
              + '<div class="price-month flex items-baseline gap-1 mt-2"><span style="font-family:DM Sans;font-weight:700;font-size:42px">$' + m + '</span><span class="text-muted text-sm">/ month</span></div>'
              + '<div class="price-year flex items-baseline gap-1 mt-2" style="display:none"><span style="font-family:DM Sans;font-weight:700;font-size:42px">$' + y + '</span><span class="text-muted text-sm">/ year</span></div>'
              + '<div class="text-xs text-muted">' + note + '</div>'
              + '<ul class="mt-5 space-y-2">' + feats.map(x => '<li class="flex items-center gap-2 text-sm">' + I_('check', 14, 'text-emerald') + x + '</li>').join('') + '</ul>'
              + '<button class="btn ' + (featured ? 'btn-primary' : 'btn-secondary') + ' w-full justify-center mt-5">' + (i === 0 ? 'Start free' : 'Start trial') + '</button>'
              + '</div>';
          }).join('')
        + '</div></div>')

      /* ── Variant 3 — Dark enterprise hero ───────────────────── */
      + section('Dark enterprise hero',
        '<div class="grid md:grid-cols-2 gap-4">'
        + '<div class="card price-card-dark card-pad" style="padding:28px">'
        + '<div class="relative"><span class="pill" style="background:rgba(255,255,255,.15);color:#fff;border:0">ENTERPRISE</span>'
        + '<h3 style="font-family:DM Sans;font-size:32px;font-weight:700" class="mt-3">Custom for teams of 100+</h3>'
        + '<div class="flex items-baseline gap-2 mt-4"><span style="font-family:DM Sans;font-size:46px;font-weight:700">Let\'s talk</span></div>'
        + '<p class="opacity-80 text-sm mt-3 max-w-md">Tailored deployment, dedicated CSM, custom SLAs, on-prem options. Built for finance, healthcare, government.</p>'
        + '<ul class="mt-5 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">' + ['Dedicated CSM','99.99% SLA','SSO + SCIM','SOC 2 · ISO 27001','Custom roles','24/7/365 support'].map(x => '<li class="flex items-center gap-2 opacity-90">' + I_('check', 14) + x + '</li>').join('') + '</ul>'
        + '<div class="mt-6 flex gap-2"><button class="btn" style="background:#fff;color:rgb(var(--iris))">Talk to sales →</button><button class="btn" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)">Read whitepaper</button></div>'
        + '</div></div>'

        + '<div class="card card-pad" style="padding:28px"><div class="text-iris">' + I_('shield', 28) + '</div><h4 class="font-semibold text-lg mt-3">Compliance & security</h4>'
        + '<ul class="mt-4 space-y-2 text-sm">' + ['SOC 2 Type II','ISO 27001','GDPR · CCPA','HIPAA-ready','Encrypted at rest + in transit','99.99% uptime SLA'].map(x => '<li class="flex items-center gap-2">' + I_('check-circle', 14, 'text-emerald') + x + '</li>').join('') + '</ul></div>'
        + '</div>')

      /* ── Variant 4 — Simple side-by-side ───────────────────── */
      + section('Simple side-by-side',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">'
        + [['Individual','$12',['Personal use','5 GB storage','Email support']],['Business','$49',['Team workspace','100 GB storage','Live chat','Custom branding']]].map(([n, p, feats]) =>
            '<div class="card card-pad text-center" style="padding:32px">'
            + '<div class="text-xs uppercase tracking-wider text-muted font-bold">' + n + '</div>'
            + '<div style="font-family:DM Sans;font-size:54px;font-weight:700" class="mt-2">' + p + '<span class="text-base text-muted font-normal">/mo</span></div>'
            + '<button class="btn btn-primary w-full justify-center mt-4">Get ' + n + '</button>'
            + '<div class="divider-h my-5"></div>'
            + '<ul class="space-y-2 text-sm text-left">' + feats.map(x => '<li class="flex items-center gap-2">' + I_('check', 14, 'text-emerald') + x + '</li>').join('') + '</ul>'
            + '</div>').join('')
        + '</div>')

      /* ── Variant 5 — Detailed comparison table ─────────────── */
      + section('Detailed comparison table',
        '<div class="card overflow-hidden"><div class="card-head"><h3>Compare every feature</h3></div>'
        + '<table class="t-table">'
        + '<thead><tr><th></th><th class="text-center">Starter</th><th class="text-center" style="background:rgb(var(--iris)/.06)">Pro · $29</th><th class="text-center">Enterprise</th></tr></thead>'
        + '<tbody>' + [
            ['Projects',         '5',          'Unlimited',  'Unlimited'],
            ['Workspaces',       '1',          '5',          'Unlimited'],
            ['Team members',     '3',          '25',         'Unlimited'],
            ['Storage',          '5 GB',       '100 GB',     '1 TB'],
            ['SSO + SCIM',       '—',          '—',          '✓'],
            ['Audit log',        '—',          '✓',          '✓'],
            ['Custom roles',     '—',          '✓',          '✓'],
            ['DLP + Compliance', '—',          '—',          '✓'],
            ['Priority support', '—',          '24/5',       '24/7 SLA'],
            ['Onboarding',       'Self-serve', 'Group',      'Dedicated CSM'],
          ].map(([k, ...v]) =>
            '<tr><td><strong>' + k + '</strong></td>' + v.map((x, i) =>
              '<td class="text-center" ' + (i === 1 ? 'style="background:rgb(var(--iris)/.04)"' : '') + '>' + (x === '✓' ? '<span class="text-emerald">' + I_('check', 16) + '</span>' : x === '—' ? '<span class="text-muted">—</span>' : x) + '</td>').join('') + '</tr>').join('')
        + '</tbody></table></div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * SAAS dashboard (sample dashboard variant)
   * ───────────────────────────────────────────────────────────────── */
  function viewSaaSDash() {
    const head = pageHead('SaaS Dashboard', 'Recurring revenue, churn, plan distribution.',
      [{title:'Dashboards'}, {title:'SaaS'}]);
    const tiles =
      statTile('MRR',          '$28,400', '+12%', 'up', 'dollar', 'iris')
    + statTile('Active subs',  '1,402',   '+34',  'up', 'users',  'emerald')
    + statTile('Churn rate',   '2.3%',    '-0.4%','up', 'trending-down', 'cyan')
    + statTile('NPS',          '64',      '+5',   'up', 'star',    'amber');

    return head
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">' + tiles + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>MRR over time</h3></div><div class="p-4" data-chart="line-revenue"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Plan mix</h3></div><div class="p-4 flex flex-col items-center" data-chart="donut-plans"></div></div>'
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * AI Chat interface
   * ───────────────────────────────────────────────────────────────── */
  function viewChat() {
    const head = pageHead('AI Chat interface', 'Streaming text bubble UI with code blocks and quick actions.',
      [{title:'Specialty'}, {title:'AI Chat'}]);
    const bubbles = D().CHAT.map(m =>
      '<div class="flex gap-3 ' + (m.self ? 'flex-row-reverse' : '') + '">'
      + (m.self ? '<div class="avatar" style="width:32px;height:32px;font-size:12px">YO</div>' : D().avatarFor(m.who))
      + '<div class="max-w-[70%]">'
      + '  <div class="text-[11px] text-muted mb-1 ' + (m.self ? 'text-right' : '') + '">' + m.who + ' · ' + m.time + '</div>'
      + '  <div class="' + (m.self ? 'bg-gradient-to-br from-iris-500 to-fuchsia-500 text-white' : 'bg-soft border border-[rgb(var(--line))]') + ' rounded-2xl p-3 text-sm">' + m.text + '</div>'
      + '</div></div>'
    ).join('');

    return head
      + '<div class="card overflow-hidden grid grid-cols-1 md:grid-cols-4 h-[640px]">'
      + '<div class="md:col-span-1 border-r border-[rgb(var(--line))] flex flex-col"><div class="p-3 border-b border-[rgb(var(--line))]"><input class="input" placeholder="Search chats…"></div>'
      + '<div class="flex-1 overflow-y-auto p-2">'
      + ['Design system', 'Sprint planning', 'Aurora hue tuning', 'Sidebar refactor', 'Daily standup'].map((t,i) => '<div class="p-3 rounded-xl ' + (i===0 ? 'bg-iris-50/40' : '') + ' hover:bg-soft cursor-pointer"><div class="text-sm font-semibold">' + t + '</div><div class="text-[11px] text-muted truncate mt-1">Latest message in this thread…</div></div>').join('')
      + '</div></div>'
      + '<div class="md:col-span-3 flex flex-col">'
      + '<div class="p-4 border-b border-[rgb(var(--line))] flex items-center justify-between"><div class="flex items-center gap-3"><div class="avatar">DS</div><div><div class="font-semibold text-sm">Design system thread</div><div class="text-[11px] text-emerald flex items-center gap-1"><span class="pill-dot" style="background:rgb(var(--emerald))"></span>4 members online</div></div></div><div class="flex gap-1"><button class="tb-icon-btn">' + I_('search', 14) + '</button><button class="tb-icon-btn">' + I_('more-horizontal', 14) + '</button></div></div>'
      + '<div class="flex-1 overflow-y-auto p-4 space-y-4">' + bubbles + '</div>'
      + '<div class="p-3 border-t border-[rgb(var(--line))] flex gap-2 items-center"><button class="tb-icon-btn">' + I_('paperclip', 16) + '</button><input class="input" placeholder="Type a message…"><button class="btn btn-primary">' + I('send') + '</button></div>'
      + '</div>'
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * THEME generator
   * ───────────────────────────────────────────────────────────────── */
  function viewTheme() {
    const head = pageHead('Theme generator', 'Tweak any colour live — values save to localStorage.',
      [{title:'System'}, {title:'Theme'}]);
    return head
      + section('Live preview',
        '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
        + '<div class="card card-pad lg:col-span-2 space-y-3">'
        + ['iris', 'fuchsia', 'cyan', 'emerald', 'amber', 'rose'].map(c =>
            '<div class="flex items-center gap-3"><span class="w-12 text-[11px] uppercase tracking-wider text-muted font-semibold">' + c + '</span>'
            + '<input type="color" data-theme-token="' + c + '" value="' + ({iris:'#7c3aed',fuchsia:'#d846ef',cyan:'#22d3ee',emerald:'#10b981',amber:'#f59e0b',rose:'#f43f5e'})[c] + '" class="w-12 h-9 rounded-lg cursor-pointer border border-[rgb(var(--line))]">'
            + '<div class="flex-1 h-8 rounded-lg" style="background:rgb(var(--' + c + '));box-shadow:0 4px 14px -4px rgb(var(--' + c + ')/.4)"></div></div>'
          ).join('') + '</div>'
        + '<div class="card card-pad"><h4 class="font-semibold mb-3">Preview</h4>'
        + '<button class="btn btn-primary mb-2 w-full justify-center">Primary action</button>'
        + '<button class="btn btn-secondary mb-2 w-full justify-center">Secondary</button>'
        + '<div class="pill pill-iris mr-2">Iris</div><div class="pill pill-emerald mr-2">Emerald</div><div class="pill pill-amber mr-2">Amber</div><div class="pill pill-rose">Rose</div>'
        + '<div class="mt-4 p-3 rounded-xl text-white text-center" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">Hero gradient</div>'
        + '</div></div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * i18n showcase
   * ───────────────────────────────────────────────────────────────── */
  function viewI18n() {
    const head = pageHead('Languages · i18n', 'AZ · EN · RU built in. Switch from the topbar.',
      [{title:'System'}, {title:'i18n'}]);
    return head
      + section('Try every language',
        '<div class="card card-pad"><div class="flex gap-2 mb-4">'
        + I18n.supported.map(l => '<button class="btn ' + (l === I18n.getLang() ? 'btn-primary' : 'btn-secondary') + '" data-lang="' + l + '" data-act="set-lang">' + l.toUpperCase() + '</button>').join('')
        + '</div>'
        + '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">'
        + ['topbar.search', 'common.dashboard', 'common.signin', 'common.signout', 'home.hero.title', 'home.stats.users', 'sidebar.section.layout', 'sidebar.section.charts'].map(k => '<div class="bg-soft rounded-lg p-3"><div class="text-[10px] text-muted font-mono">' + k + '</div><div class="font-semibold mt-1">' + I18n.t(k) + '</div></div>').join('')
        + '</div></div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * Settings (System Settings page)
   * ───────────────────────────────────────────────────────────────── */
  function viewSettings() {
    const head = pageHead('Settings · Preferences', 'Profile, account, notifications, security, integrations.',
      [{title:'System'}, {title:'Settings'}]);
    const tabs = ['Profile', 'Account', 'Notifications', 'Security', 'Integrations'];
    return head
      + '<div class="card overflow-hidden">'
      + '<div class="card-head"><div class="flex gap-2 overflow-x-auto">' + tabs.map((t,i) => '<button class="btn btn-xs ' + (i===0 ? 'btn-primary' : 'btn-ghost') + '">' + t + '</button>').join('') + '</div></div>'
      + '<div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">'
      + '<div class="md:col-span-1 text-center"><div class="avatar mx-auto" style="width:96px;height:96px;font-size:36px">VF</div><h4 class="font-semibold mt-3">Vugar Familoglu</h4><p class="text-sm text-muted">vugar@vgf26.io</p><button class="btn btn-secondary mt-3">Upload photo</button></div>'
      + '<div class="md:col-span-2 space-y-4">'
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="label">First name</label><input class="input" value="Vugar"></div><div><label class="label">Last name</label><input class="input" value="Familoglu"></div></div>'
      + '<div><label class="label">Bio</label><textarea class="textarea">Indie engineer & designer. Building the iridescent admin studio.</textarea></div>'
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="label">Country</label><select class="select"><option>Azerbaijan</option><option>Germany</option><option>Japan</option></select></div><div><label class="label">Timezone</label><select class="select"><option>Asia/Baku (UTC+4)</option><option>Europe/Berlin (UTC+1)</option></select></div></div>'
      + '<div class="flex justify-end gap-2 pt-2 border-t border-[rgb(var(--line))]"><button class="btn btn-secondary">' + I18n.t('common.cancel') + '</button><button class="btn btn-primary">' + I18n.t('common.save') + '</button></div>'
      + '</div></div></div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * Avatars / Badges / Ratings
   * ───────────────────────────────────────────────────────────────── */
  function viewAvatars() {
    const head = pageHead('Avatars · Stacks · Groups', 'Initials, photos, gradients, status dots.',
      [{title:'Data'}, {title:'Avatars'}]);
    return head
      + section('Sizes',
        '<div class="card card-pad flex items-center gap-3">'
        + [24, 28, 36, 44, 56, 72].map(s => '<div class="avatar" style="width:' + s + 'px;height:' + s + 'px;font-size:' + (s * 0.35) + 'px">VF</div>').join('')
        + '</div>')
      + section('Stack',
        '<div class="card card-pad"><div class="avatar-stack flex">'
        + D().USERS.slice(0,6).map(u => '<div class="avatar">' + u.name.split(' ').map(x=>x[0]).join('') + '</div>').join('')
        + '<div class="avatar" style="background:rgb(var(--line));color:rgb(var(--ink-2))">+12</div>'
        + '</div></div>')
      + section('Status indicators',
        '<div class="card card-pad flex gap-6 flex-wrap">'
        + ['online', 'busy', 'offline', 'away'].map(s => {
            const c = s === 'online' ? 'emerald' : s === 'busy' ? 'rose' : s === 'away' ? 'amber' : 'muted';
            return '<div class="relative inline-block"><div class="avatar">VF</div><span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[rgb(var(--bg))]" style="background:rgb(var(--' + c + '))"></span></div>';
          }).join('')
        + '</div>');
  }

  function viewBadges() {
    const head = pageHead('Badges · Chips · Tags', 'Status pills, removable chips, gradient tags.',
      [{title:'Data'}, {title:'Badges'}]);
    return head
      + section('Pill variants',
        '<div class="card card-pad space-x-2 space-y-2">'
        + ['iris', 'emerald', 'amber', 'rose', 'cyan', 'muted'].map(c => '<span class="pill pill-' + c + '"><span class="pill-dot" style="background:rgb(var(--' + (c === 'muted' ? 'muted' : c) + '))"></span>' + c + '</span>').join('')
        + '</div>')
      + section('Removable chips',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + ['Design', 'Tokens', 'Iridescent', 'Tailwind', 'Vanilla JS'].map(t => '<span class="chip">' + t + ' <button class="text-iris">' + I_('x',12) + '</button></span>').join('')
        + '</div>')
      + section('Gradient badges',
        '<div class="card card-pad space-x-2">'
        + ['Pro', 'New', 'Beta', 'AI'].map(t => '<span class="pill" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff;border:0">' + t + '</span>').join('')
        + '</div>');
  }

  function viewRatings() {
    const head = pageHead('Rating Stars · Emoji picker', 'Star rating + emoji reactions.',
      [{title:'Data'}, {title:'Ratings'}]);
    return head
      + section('Star rating',
        '<div class="card card-pad flex flex-col gap-3" data-mount="rating">'
        + '<div class="flex items-center gap-2" data-rating="r1">' + [1,2,3,4,5].map(i => '<button data-v="' + i + '" class="text-amber" style="font-size:24px">★</button>').join('') + '<span class="text-sm text-muted ml-3" data-rating-out>—</span></div>'
        + '</div>')
      + section('Emoji reactions',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + ['👍 12', '❤️ 8', '🎉 5', '🚀 3', '😂 2', '🤯 1'].map(e => '<button class="pill pill-muted hover:bg-[rgb(var(--iris-soft))]">' + e + '</button>').join('')
        + '<button class="pill pill-iris">+ Add</button>'
        + '</div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * GENERIC fallback — used for routes not yet authored
   * ───────────────────────────────────────────────────────────────── */
  function viewGeneric(route) {
    const all = (NAV || []).flatMap(s => s.items).find(i => i.route === route);
    const title = all ? all.title : 'Component preview';
    return pageHead(title, 'This component lives in the catalog. Open assets/js/views.js to author it.',
      [{title:'Catalog'}, {title:title}])

      + '<div class="card card-pad text-center py-12">'
      + '<div class="mx-auto grid place-items-center w-16 h-16 rounded-2xl mb-4" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">' + I_(all?.icon || 'sparkles', 28) + '</div>'
      + '<h3 class="text-xl font-bold" style="font-family:DM Sans">' + title + '</h3>'
      + '<p class="text-sm text-muted mt-2 max-w-md mx-auto">Pick another item from the sidebar — or extend the catalog by adding a view function in <code class="kbd">assets/js/views.js</code> and routing it from <code class="kbd">assets/js/app.js</code>.</p>'
      + '<div class="flex gap-2 justify-center mt-5"><a href="#/" class="btn btn-secondary">' + I('home') + '<span>Home</span></a><a href="#/system/icons" class="btn btn-primary">' + I('box') + '<span>Browse icons</span></a></div>'
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * Route → view mapping
   * ───────────────────────────────────────────────────────────────── */
  const ROUTES = {
    '#/':                      viewHome,
    '#/cards':                 viewCards,
    '#/grids':                 viewGrids,
    '#/lists':                 viewLists,
    '#/tables':                viewTables,
    '#/pagination':            viewTables,
    '#/avatars':               viewAvatars,
    '#/badges':                viewBadges,
    '#/ratings':               viewRatings,
    '#/forms/inputs':          viewFormsInputs,
    '#/overlays/modals':       viewModals,
    '#/overlays/toasts':       viewToasts,
    '#/overlays/progress':     viewProgress,
    '#/effects/morphism':      viewMorphism,
    '#/effects/particles':     viewParticles,
    '#/charts/line':           viewChartLine,
    '#/charts/bar':            viewChartBar,
    '#/charts/pie':            viewChartPie,
    '#/auth/login':            viewLogin,
    '#/errors':                viewErrors,
    '#/commerce/pricing':      viewPricing,
    '#/dashboards/saas':       viewSaaSDash,
    '#/specialty/chat':        viewChat,
    '#/system/icons':          viewIcons,
    '#/system/theme':          viewTheme,
    '#/system/i18n':           viewI18n,
    '#/system/settings':       viewSettings,
    '#/nav/palette':           viewPalette,
  };

  function render(route) {
    const fn = ROUTES[route];
    return fn ? fn() : viewGeneric(route);
  }

  global.Views = { render, ROUTES };
})(window);
