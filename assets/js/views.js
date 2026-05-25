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
    const head = pageHead('Tables · 8 variants',
      'Data · sortable · sticky · expandable · comparison · responsive · dense · with-charts.',
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

    /* 1 — Data table with filter + export + pagination */
    const dataTable =
      '<div class="card overflow-hidden">'
      + '<div class="card-head"><h3>Inventory</h3><div class="flex items-center gap-2"><input class="input" style="height:32px;width:200px" placeholder="Filter…"><button class="btn btn-secondary btn-xs">' + I_('filter', 14) + 'Filter</button><button class="btn btn-primary btn-xs">' + I_('download', 14) + 'Export</button></div></div>'
      + '<div style="max-height:420px;overflow:auto"><table class="t-table"><thead><tr><th>ID</th><th>Product</th><th>SKU</th><th>Category</th><th class="text-right">Price</th><th class="text-right">Stock</th><th class="text-right">Sales</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      + '<div class="p-3 flex justify-between items-center border-t border-[rgb(var(--line))]"><span class="text-xs text-muted">Showing 1–8 of 248</span><div class="flex gap-1"><button class="btn btn-secondary btn-xs">' + I_('chevron-left',14) + '</button><button class="btn btn-primary btn-xs">1</button><button class="btn btn-secondary btn-xs">2</button><button class="btn btn-secondary btn-xs">3</button><button class="btn btn-secondary btn-xs">' + I_('chevron-right',14) + '</button></div></div>'
      + '</div>';

    /* 2 — Sortable table (visual sort indicators) */
    const sortable =
      '<div class="card overflow-hidden"><table class="t-table">'
      + '<thead><tr>' + ['Customer ↓','Plan','MRR','Joined','Status'].map((h, i) => '<th><div class="flex items-center gap-1 cursor-pointer hover:text-iris">' + h.replace(' ↓', '') + (i === 0 ? '<span class="text-iris">↓</span>' : i === 2 ? '<span class="text-muted">↕</span>' : '') + '</div></th>').join('') + '</tr></thead>'
      + '<tbody>'
      + D().USERS.slice(0, 5).map((u, i) => '<tr><td><div class="flex items-center gap-2">' + D().avatarFor(u.name) + u.name + '</div></td><td><span class="pill pill-' + ['iris','emerald','amber','cyan','fuchsia'][i] + '">' + ['Enterprise','Pro','Starter','Pro','Pro'][i] + '</span></td><td class="text-right font-mono">$' + ((i + 1) * 290).toLocaleString() + '</td><td class="text-muted">' + u.joined + '</td><td><span class="pill pill-' + (u.status === 'online' ? 'emerald' : u.status === 'busy' ? 'amber' : 'muted') + '">' + u.status + '</span></td></tr>').join('')
      + '</tbody></table></div>';

    /* 3 — Sticky header table */
    const sticky =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Sticky header (scroll inside)</h3></div>'
      + '<div style="max-height:280px;overflow-y:auto"><table class="t-table"><thead><tr><th>#</th><th>Item</th><th class="text-right">Stock</th><th class="text-right">Sales</th></tr></thead><tbody>'
      + Array.from({length: 25}, (_, i) => '<tr><td>' + (i+1) + '</td><td>Item ' + (i+1) + '</td><td class="text-right">' + (100 + i * 42) + '</td><td class="text-right">' + (50 + i * 15) + '</td></tr>').join('')
      + '</tbody></table></div></div>';

    /* 4 — Expandable rows */
    const expandable =
      '<div class="card overflow-hidden"><table class="t-table"><thead><tr><th></th><th>Order</th><th>Customer</th><th class="text-right">Amount</th><th>Status</th></tr></thead><tbody>'
      + D().ORDERS.map((o, i) => ''
          + '<tr><td><details ' + (i === 0 ? 'open' : '') + ' class="group"><summary class="list-none cursor-pointer text-iris">' + I_('chevron-right', 14) + '</summary></details></td>'
          + '<td><strong>' + o.id + '</strong></td><td>' + o.cust + '</td><td class="text-right font-mono">$' + o.amount.toFixed(2) + '</td><td><span class="pill pill-' + (o.status === 'completed' ? 'emerald' : o.status === 'pending' ? 'amber' : o.status === 'failed' ? 'rose' : 'iris') + '">' + o.status + '</span></td></tr>'
          + (i === 0 ? '<tr><td colspan="5" class="!p-0"><div class="bg-soft p-4 border-l-4" style="border-color:rgb(var(--iris))"><div class="grid grid-cols-3 gap-3 text-sm"><div><div class="label">Items</div><div>2 × Iridescent Tee · 1 × Hoodie</div></div><div><div class="label">Shipping</div><div>UPS · 1Z9999W99999999999</div></div><div><div class="label">Tracking</div><a href="#" class="text-iris">View →</a></div></div></div></td></tr>' : '')
        ).join('')
      + '</tbody></table></div>';

    /* 5 — Plan comparison */
    const compare =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Plan comparison</h3></div>'
      + '<table class="t-table">'
      + '<thead><tr><th></th><th class="text-center">Starter</th><th class="text-center" style="background:rgb(var(--iris)/.06)">Pro</th><th class="text-center">Enterprise</th></tr></thead>'
      + '<tbody>'
      + [['Projects','5','Unlimited','Unlimited'],['Workspaces','1','5','Unlimited'],['SSO','—','—','✓'],['Audit log','—','✓','✓'],['Custom roles','—','✓','✓'],['Priority support','—','24/5','24/7 SLA']].map(([k,...v]) =>
          '<tr><td><strong>' + k + '</strong></td>' + v.map((x,i) => '<td class="text-center" ' + (i===1 ? 'style="background:rgb(var(--iris)/.04)"' : '') + '>' + (x === '✓' ? '<span class="text-emerald">' + I_('check', 16) + '</span>' : x === '—' ? '<span class="text-muted">—</span>' : x) + '</td>').join('') + '</tr>').join('')
      + '</tbody></table></div>';

    /* 6 — Responsive (stacks on mobile, card list) */
    const responsive =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Responsive card list (mobile-friendly)</h3></div><div class="divide-y divide-[rgb(var(--line-soft))]">'
      + D().USERS.slice(0, 5).map((u) => '<div class="p-4 flex items-center gap-4 flex-wrap"><div class="flex items-center gap-3 flex-1 min-w-0">' + D().avatarFor(u.name) + '<div class="min-w-0"><div class="font-semibold truncate">' + u.name + '</div><div class="text-xs text-muted truncate">' + u.email + '</div></div></div><div class="text-sm text-muted">' + u.role + '</div><div><span class="pill pill-' + (u.status === 'online' ? 'emerald' : u.status === 'busy' ? 'rose' : 'muted') + '">' + u.status + '</span></div><button class="btn btn-ghost btn-xs">' + I_('more-horizontal', 14) + '</button></div>').join('')
      + '</div></div>';

    /* 7 — Dense / striped table */
    const dense =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Dense · striped</h3></div>'
      + '<table class="t-table" style="font-size:11.5px"><thead><tr><th>SKU</th><th>Item</th><th class="text-right">Qty</th><th class="text-right">Cost</th><th class="text-right">Revenue</th><th class="text-right">Margin</th></tr></thead><tbody>'
      + D().PRODUCTS.map((p, i) => '<tr style="background:' + (i % 2 ? 'rgb(var(--bg-soft) / .55)' : 'transparent') + '"><td class="font-mono text-[10.5px]" style="padding:6px 14px">' + p.sku + '</td><td style="padding:6px 14px">' + p.name + '</td><td class="text-right font-mono" style="padding:6px 14px">' + p.stock + '</td><td class="text-right font-mono" style="padding:6px 14px">$' + (p.price * 0.45).toFixed(2) + '</td><td class="text-right font-mono" style="padding:6px 14px">$' + p.price.toFixed(2) + '</td><td class="text-right font-mono text-emerald" style="padding:6px 14px">55%</td></tr>').join('')
      + '</tbody></table></div>';

    /* 8 — Table with inline mini-charts (sparklines) */
    const withCharts =
      '<div class="card overflow-hidden"><div class="card-head"><h3>Performance · with inline sparklines</h3></div>'
      + '<table class="t-table"><thead><tr><th>Metric</th><th>Value</th><th>Trend (7d)</th><th class="text-right">Change</th></tr></thead><tbody>'
      + [['Revenue', '$24,892', 'iris', '+12%', 'emerald'], ['Sessions', '1,842', 'fuchsia', '+8.4%', 'emerald'], ['Bounce', '24%', 'cyan', '-2.1%', 'emerald'], ['Errors', '0.04%', 'rose', '-0.01%', 'emerald'], ['Conversion', '3.2%', 'amber', '+0.4%', 'emerald']].map(([m, v, c, ch, cc]) => {
        const data = Array.from({length: 20}, () => Math.random() * 30 + 5);
        const max = Math.max(...data);
        const points = data.map((d, i) => (i * 8) + ',' + (28 - (d / max) * 24)).join(' ');
        return '<tr><td><strong>' + m + '</strong></td><td class="font-mono">' + v + '</td><td><svg width="160" height="32" viewBox="0 0 160 32"><polyline points="' + points + '" stroke="rgb(var(--' + c + '))" stroke-width="2" fill="none"/></svg></td><td class="text-right font-mono text-' + cc + '">' + ch + '</td></tr>';
      }).join('')
      + '</tbody></table></div>';

    return head
      + section('1 · Data table (filter · export · pagination)', dataTable)
      + section('2 · Sortable header (click columns to sort)', sortable)
      + section('3 · Sticky-header table', sticky)
      + section('4 · Expandable rows', expandable)
      + section('5 · Plan comparison', compare)
      + section('6 · Responsive card-list table', responsive)
      + section('7 · Dense · striped', dense)
      + section('8 · Table with inline sparklines', withCharts);
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
  /* helper — produce a tooltip-enabled line + area combo via inline SVG (no chart builder) */
  function inlineLine(data, opts) {
    opts = opts || {};
    const w = opts.w || 600, h = opts.h || 220, pad = 24;
    const max = Math.max.apply(null, data), min = Math.min.apply(null, data);
    const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1));
    const ys = data.map((v) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2));
    const p = xs.map((x, i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + ys[i].toFixed(1)).join(' ');
    const area = p + ' L' + xs[xs.length - 1] + ' ' + (h - pad) + ' L' + xs[0] + ' ' + (h - pad) + ' Z';
    const labels = opts.labels || data.map((_, i) => '#' + (i+1));
    const color = opts.color || '#7c3aed';
    const fillId = 'fl-' + (opts.id || Math.random().toString(36).slice(2, 7));
    return '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
      + '<defs><linearGradient id="' + fillId + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".35"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>'
      + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('')
      + '<path d="' + area + '" fill="url(#' + fillId + ')"/>'
      + '<path d="' + p + '" stroke="' + color + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      + xs.map((x, i) => '<circle class="chart-point" cx="' + x + '" cy="' + ys[i] + '" r="4" fill="#fff" stroke="' + color + '" stroke-width="2" data-v="' + data[i] + (opts.suffix || '') + '" data-l="' + labels[i] + '"/>').join('')
      + '</svg>';
  }

  function viewChartLine() {
    const head = pageHead('Line / Area · 4 chart variants',
      'Classic, smoothed, multi-series, and stepped — every point hover shows a tooltip.',
      [{title:'Charts'}, {title:'Line'}]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return head
      + section('1 · Default revenue line',
        '<div class="card chart-host" data-chart="passthrough"><div class="card-head"><h3>Last 12 months · $24k → $86k</h3><span class="pill pill-iris">+18%</span></div><div class="p-4">' + inlineLine([24,28,35,42,38,52,61,57,68,74,82,86], {labels: months, color: '#7c3aed', suffix: 'k', id: 'l1'}) + '</div></div>')
      + section('2 · Smoothed line · Cyan',
        '<div class="card chart-host"><div class="card-head"><h3>Active users · weekly</h3></div><div class="p-4">' + inlineLine([1240,1380,1620,1820,2010,2280,2620], {labels:['W1','W2','W3','W4','W5','W6','W7'], color: '#22d3ee', id: 'l2'}) + '</div></div>')
      + section('3 · Multi-series · area compare',
        '<div class="card"><div class="card-head"><h3>Visitors vs sessions</h3></div><div class="p-4" data-chart="area-compare"></div></div>')
      + section('4 · Stepped line · server load',
        '<div class="card chart-host"><div class="card-head"><h3>CPU usage · last hour (%)</h3></div><div class="p-4">'
        + (function(){
            const data = [22,28,31,45,52,48,68,72,65,80,78,88];
            const w = 600, h = 220, pad = 24;
            const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1));
            const ys = data.map((v) => h - pad - (v / 100) * (h - pad * 2));
            let p = 'M' + xs[0] + ' ' + ys[0];
            for (let i = 1; i < xs.length; i++) {
              const midX = (xs[i-1] + xs[i]) / 2;
              p += ' L' + midX + ' ' + ys[i-1] + ' L' + midX + ' ' + ys[i] + ' L' + xs[i] + ' ' + ys[i];
            }
            return '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
              + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('')
              + '<path d="' + p + '" stroke="#10b981" stroke-width="2.5" fill="none"/>'
              + xs.map((x, i) => '<circle class="chart-point" cx="' + x + '" cy="' + ys[i] + '" r="4" fill="#10b981" data-v="' + data[i] + '%" data-l="-' + (12-i) + ' min"/>').join('')
              + '</svg>';
          })()
        + '</div></div>');
  }

  function viewChartBar() {
    const head = pageHead('Bar · 5 chart variants',
      'Vertical bars, horizontal, stacked, grouped and gradient hero — every bar tooltip on hover.',
      [{title:'Charts'}, {title:'Bar'}]);
    const data = [40, 65, 35, 80, 52, 90, 70];
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    return head
      + section('1 · Classic vertical bar',
        '<div class="card"><div class="card-head"><h3>Weekly sales</h3></div><div class="p-4" data-chart="bar-sales"></div></div>')

      + section('2 · Horizontal bar',
        '<div class="card chart-host"><div class="card-head"><h3>Top channels</h3></div><div class="p-5 space-y-3">'
        + [['Direct',92,'iris'],['Organic',78,'fuchsia'],['Referral',64,'cyan'],['Social',45,'emerald'],['Email',28,'amber']].map(([n,v,c]) => '<div><div class="flex justify-between text-xs mb-1"><span class="font-semibold">' + n + '</span><span class="text-muted font-mono">' + v + '%</span></div><div class="h-3 rounded-full bg-soft overflow-hidden"><div class="chart-bar" style="width:' + v + '%;height:100%;background:linear-gradient(90deg,rgb(var(--' + c + ')),rgb(var(--iris)))" data-v="' + v + '%" data-l="' + n + '"></div></div></div>').join('')
        + '</div></div>')

      + section('3 · Stacked bar · cost breakdown',
        '<div class="card chart-host"><div class="card-head"><h3>Quarterly spend (k$)</h3></div><div class="p-5">'
        + (function() {
            const w = 600, h = 240, pad = 30, qs = ['Q1','Q2','Q3','Q4'];
            const segs = [['Salaries', 'iris', [42,48,55,60]], ['Cloud', 'fuchsia', [12,18,14,22]], ['Marketing', 'cyan', [8,14,18,20]], ['Tools', 'emerald', [4,6,5,8]]];
            const totals = qs.map((_, i) => segs.reduce((s, [,,arr]) => s + arr[i], 0));
            const max = Math.max.apply(null, totals);
            const bw = 60, gap = (w - pad * 2) / qs.length;
            let svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
              + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('');
            qs.forEach((q, i) => {
              const cx = pad + i * gap + gap/2;
              let yCur = h - pad;
              segs.forEach(([n, c, arr]) => {
                const v = arr[i], bh = (v / max) * (h - pad * 2);
                yCur -= bh;
                svg += '<rect class="chart-bar" x="' + (cx - bw/2) + '" y="' + yCur + '" width="' + bw + '" height="' + bh + '" fill="rgb(var(--' + c + '))" data-v="' + v + 'k" data-l="' + n + ' · ' + q + '"/>';
              });
              svg += '<text x="' + cx + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="rgb(var(--muted))">' + q + '</text>';
            });
            svg += '</svg>';
            return svg + '<div class="flex gap-3 flex-wrap text-xs mt-3">' + segs.map(([n, c]) => '<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:rgb(var(--' + c + '))"></span>' + n + '</span>').join('') + '</div>';
          })()
        + '</div></div>')

      + section('4 · Grouped bar · before/after',
        '<div class="card chart-host"><div class="card-head"><h3>Performance before vs after launch</h3></div><div class="p-5">'
        + (function() {
            const w = 600, h = 220, pad = 30, cats = ['LCP','FID','CLS','TBT','SI'];
            const a = [4.2, 280, 0.18, 320, 5.1], b = [1.8, 80, 0.04, 110, 2.4];
            const max = Math.max.apply(null, a.concat(b));
            const bw = 18, gap = (w - pad * 2) / cats.length;
            let svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
              + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('');
            cats.forEach((c, i) => {
              const x = pad + i * gap + gap/2;
              const ha = (a[i] / max) * (h - pad * 2);
              const hb = (b[i] / max) * (h - pad * 2);
              svg += '<rect class="chart-bar" x="' + (x - bw - 2) + '" y="' + (h - pad - ha) + '" width="' + bw + '" height="' + ha + '" rx="3" fill="#f43f5e" data-v="' + a[i] + '" data-l="Before · ' + c + '"/>';
              svg += '<rect class="chart-bar" x="' + (x + 2) + '" y="' + (h - pad - hb) + '" width="' + bw + '" height="' + hb + '" rx="3" fill="#10b981" data-v="' + b[i] + '" data-l="After · ' + c + '"/>';
              svg += '<text x="' + x + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="rgb(var(--muted))">' + c + '</text>';
            });
            svg += '</svg>';
            return svg + '<div class="flex gap-3 text-xs mt-3"><span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#f43f5e"></span>Before</span><span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#10b981"></span>After launch</span></div>';
          })()
        + '</div></div>')

      + section('5 · Gradient hero bar (giant column)',
        '<div class="card chart-host"><div class="card-head"><h3>Revenue history</h3></div><div class="p-5">'
        + (function() {
            const w = 600, h = 260, pad = 28, mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const max = Math.max.apply(null, mo.map((_, i) => 30 + i * 6 + (i % 3) * 8));
            const bw = (w - pad * 2) / mo.length * 0.7;
            const gap = (w - pad * 2) / mo.length;
            let svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
              + '<defs><linearGradient id="ghero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d846ef"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>'
              + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('');
            mo.forEach((m, i) => {
              const v = 30 + i * 6 + (i % 3) * 8, bh = (v / max) * (h - pad * 2);
              const x = pad + i * gap + (gap - bw) / 2;
              const y = h - pad - bh;
              svg += '<rect class="chart-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="8" fill="url(#ghero)" data-v="$' + (v * 1000).toLocaleString() + '" data-l="' + m + ' 2026"/>';
              svg += '<text x="' + (pad + i * gap + gap/2) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="10" fill="rgb(var(--muted))">' + m + '</text>';
            });
            svg += '</svg>';
            return svg;
          })()
        + '</div></div>');
  }

  function viewChartPie() {
    const head = pageHead('Pie · Donut · Radar · 5 designs',
      'Donut, simple pie, half-donut gauge, radar — all with hover tooltips.',
      [{title:'Charts'}, {title:'Pie'}]);
    return head
      + section('1 · Donut — traffic source',
        '<div class="card"><div class="card-head"><h3>Channels</h3></div><div class="p-6 grid place-items-center" data-chart="donut-channels-lg"></div></div>')

      + section('2 · Pie (no inner hole) — language usage',
        '<div class="card chart-host"><div class="card-head"><h3>Audience language</h3></div><div class="p-6 grid place-items-center">'
        + (function() {
            const data = [['English',54,'#7c3aed'],['Russian',22,'#d846ef'],['Azerbaijani',18,'#22d3ee'],['Turkish',6,'#10b981']];
            const total = data.reduce((s, d) => s + d[1], 0);
            const r = 84, cx = 100, cy = 100;
            let acc = -Math.PI / 2;
            const arcs = data.map(([n, v, c]) => {
              const ang = (v / total) * Math.PI * 2;
              const a0 = acc, a1 = acc + ang; acc = a1;
              const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
              const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
              const large = ang > Math.PI ? 1 : 0;
              return '<path class="chart-slice" d="M' + cx + ' ' + cy + ' L' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1 + ' ' + y1 + ' Z" fill="' + c + '" data-v="' + v + '" data-l="' + n + '"/>';
            }).join('');
            return '<svg width="200" height="200" viewBox="0 0 200 200">' + arcs + '</svg>'
              + '<ul class="grid grid-cols-2 gap-1 mt-3 text-xs w-full max-w-xs">' + data.map(([n, v, c]) => '<li class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background:' + c + '"></span><span class="flex-1">' + n + '</span><span class="text-muted">' + v + '%</span></li>').join('') + '</ul>';
          })()
        + '</div></div>')

      + section('3 · Half-donut gauge — score',
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + [['Health','86','emerald'],['Risk','24','rose'],['Coverage','62','iris']].map(([t, v, c]) => '<div class="card card-pad text-center"><div class="text-xs uppercase tracking-wider text-muted">' + t + '</div><div class="relative w-40 h-24 mx-auto mt-3">'
            + '<svg viewBox="0 0 100 60" class="w-full h-full"><path d="M5 55 A 45 45 0 0 1 95 55" stroke="rgb(var(--line))" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M5 55 A 45 45 0 0 1 95 55" stroke="rgb(var(--' + c + '))" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="141.3" stroke-dashoffset="' + (141.3 - 141.3 * v / 100) + '"/></svg>'
            + '<div class="absolute inset-0 grid place-items-end pb-2"><div class="font-bold text-3xl" style="font-family:DM Sans;color:rgb(var(--' + c + '))">' + v + '<span class="text-sm text-muted">%</span></div></div>'
            + '</div></div>').join('')
        + '</div>')

      + section('4 · Radar — skills coverage',
        '<div class="card"><div class="card-head"><h3>Capability map</h3></div><div class="p-6 grid place-items-center" data-chart="radar-skills"></div></div>')

      + section('5 · Sunburst-style (donut with center label)',
        '<div class="card"><div class="card-head"><h3>Spending breakdown — May</h3></div><div class="p-6 grid place-items-center" data-chart="donut-plans"></div></div>');
  }

  /* ─────────────────────────────────────────────────────────────────
   * AUTH pages
   * ───────────────────────────────────────────────────────────────── */
  function viewLogin() {
    const head = pageHead('Login & signup · 6 designs',
      'Split-screen aurora hero · centered minimalist · two-step signup · social-only quick start · dark glass · device confirm flow.',
      [{title:'Auth'}, {title:'Login'}]);
    const socialBtns = '<button class="btn btn-secondary justify-center">' + I('github') + '<span>GitHub</span></button><button class="btn btn-secondary justify-center">' + I('mail') + '<span>Google</span></button>';

    return head

      /* ── 1 · Original split-screen aurora hero ── */
      + section('1 · Split-screen aurora hero',
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
        + '  <div class="grid grid-cols-2 gap-2">' + socialBtns + '</div>'
        + '  <p class="text-xs text-center text-muted mt-6">No account? <a href="#" class="text-iris">Create one</a></p>'
        + '</div>'
        + '</div>')

      /* ── 2 · Centered minimal card ── */
      + section('2 · Centered minimalist',
        '<div class="card card-pad max-w-md mx-auto"><div class="text-center mb-6">'
        + '<div class="grid place-items-center w-14 h-14 rounded-2xl mx-auto mb-3 text-white" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">' + I_('sparkles', 28) + '</div>'
        + '<h3 style="font-family:DM Sans;font-weight:700;font-size:22px">Sign in to VGF26</h3>'
        + '<p class="text-sm text-muted mt-1">Continue to your iridescent studio</p></div>'
        + '<label class="label">Email or username</label><input class="input mb-3" placeholder="you@email.com">'
        + '<label class="label">Password</label><div class="relative"><input class="input" type="password" value="iridescent2026" id="pw-mini" style="padding-right:42px"><button class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-iris p-1" data-act="toggle-pw" data-target="pw-mini">' + I_('eye', 16) + '</button></div>'
        + '<button class="btn btn-primary w-full justify-center mt-5">Continue →</button>'
        + '<div class="my-5 flex items-center gap-3 text-xs text-muted"><div class="flex-1 divider-h"></div>OR<div class="flex-1 divider-h"></div></div>'
        + '<div class="grid grid-cols-2 gap-2">' + socialBtns + '</div>'
        + '<p class="text-xs text-center text-muted mt-6">No account? <a href="#" class="text-iris">Create one</a> · <a href="#/auth/forgot" class="text-iris">Forgot password</a></p>'
        + '</div>')

      /* ── 3 · Two-step signup wizard ── */
      + section('3 · Two-step signup (account → workspace)',
        '<div class="card card-pad max-w-xl mx-auto">'
        + '<div class="flex items-center gap-2 mb-6">'
        +    ['Account','Workspace','Invite'].map((t, k) => '<div class="flex items-center ' + (k < 2 ? 'flex-1' : '') + '"><div class="grid place-items-center w-9 h-9 rounded-full font-bold text-sm shrink-0" style="' + (k === 0 ? 'background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff' : k === 1 ? 'background:rgb(var(--iris));color:#fff' : 'background:rgb(var(--line));color:rgb(var(--muted))') + '">' + (k === 0 ? '✓' : (k+1)) + '</div><span class="text-xs ml-2 ' + (k > 1 ? 'text-muted' : 'font-semibold') + '">' + t + '</span>' + (k < 2 ? '<div class="flex-1 h-px mx-3 ' + (k === 0 ? 'bg-iris' : 'bg-[rgb(var(--line))]') + '"></div>' : '') + '</div>').join('')
        + '</div>'
        + '<h3 class="font-semibold text-lg mb-3">Create your workspace</h3>'
        + '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">'
        + '<div><label class="label">Workspace name</label><input class="input" value="Aurora Studio"></div>'
        + '<div><label class="label">URL</label><div class="flex"><span class="input rounded-r-none flex items-center px-3 text-muted" style="height:40px;width:auto">vgf26.app/</span><input class="input rounded-l-none border-l-0" value="aurora"></div></div>'
        + '<div class="md:col-span-2"><label class="label">Team size</label><div class="grid grid-cols-4 gap-2 mt-1">' + ['1','2-9','10-49','50+'].map((t, k) => '<button class="px-3 py-2 rounded-lg border text-sm ' + (k === 1 ? 'bg-[rgb(var(--iris-soft))] text-iris border-iris font-semibold' : 'border-[rgb(var(--line))] text-muted hover:bg-soft') + '">' + t + '</button>').join('') + '</div></div>'
        + '</div>'
        + '<div class="flex justify-between mt-5 pt-4 border-t border-[rgb(var(--line))]"><button class="btn btn-secondary">' + I('chevron-left') + '<span>Back</span></button><button class="btn btn-primary">Continue<span>' + I('chevron-right') + '</span></button></div>'
        + '</div>')

      /* ── 4 · Social-only quick start ── */
      + section('4 · Social-only quick start (no password)',
        '<div class="card card-pad max-w-md mx-auto text-center py-8">'
        + '<div class="grid place-items-center w-16 h-16 rounded-2xl mx-auto mb-4 text-white" style="background:linear-gradient(135deg,#7c3aed,#d846ef)">' + I_('sparkles', 32) + '</div>'
        + '<h3 class="font-bold text-xl" style="font-family:DM Sans">Sign in with one click</h3>'
        + '<p class="text-sm text-muted mt-2 mb-6">We never see your password. Continue with an identity provider you already trust.</p>'
        + '<div class="space-y-2">'
        +    [['github','Continue with GitHub'],['mail','Continue with Google'],['apple' in {} ? 'apple' : 'sparkles','Continue with Apple']].map(([i,t]) => '<button class="btn btn-secondary w-full justify-center py-3">' + I_(i === 'apple' ? 'sparkles' : i, 18) + '<span>' + t + '</span></button>').join('')
        + '</div>'
        + '<div class="my-4 flex items-center gap-3 text-xs text-muted"><div class="flex-1 divider-h"></div>OR<div class="flex-1 divider-h"></div></div>'
        + '<input class="input" placeholder="you@email.com">'
        + '<button class="btn btn-primary w-full justify-center mt-3">Email me a magic link</button>'
        + '<p class="text-[11px] text-muted mt-5">By continuing you agree to the <a href="#" class="text-iris">terms</a></p>'
        + '</div>')

      /* ── 5 · Dark glassmorphism over photo ── */
      + section('5 · Dark glassmorphic over imagery',
        '<div class="card overflow-hidden relative grid place-items-center" style="min-height:520px;background-image:url(' + D().PEXELS[2].large + ');background-size:cover;background-position:center">'
        + '<div class="absolute inset-0" style="background:linear-gradient(135deg,rgba(20,5,50,.78),rgba(80,15,160,.65))"></div>'
        + '<div class="relative rounded-2xl p-8 w-full max-w-md text-white" style="background:rgba(255,255,255,.08);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.15)">'
        + '<div class="font-bold mb-1 flex items-center gap-2" style="font-family:DM Sans;font-size:18px">' + I_('sparkles', 22) + 'VGF26</div>'
        + '<h3 class="font-bold text-2xl mt-4">Welcome back</h3>'
        + '<p class="text-sm opacity-80 mt-1">Sign in to access your dashboard.</p>'
        + '<label class="text-[10px] uppercase tracking-wider opacity-80 mt-5 block">Email</label>'
        + '<input class="mt-1 w-full px-3 py-2 rounded-lg" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff" placeholder="you@email.com">'
        + '<label class="text-[10px] uppercase tracking-wider opacity-80 mt-3 block">Password</label>'
        + '<input class="mt-1 w-full px-3 py-2 rounded-lg" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff" type="password" value="••••••••">'
        + '<button class="btn w-full justify-center mt-5" style="background:#fff;color:rgb(var(--iris))">Sign in</button>'
        + '<p class="text-xs text-center mt-4 opacity-70">No account? <a href="#" class="underline">Sign up</a></p>'
        + '</div>'
        + '</div>')

      /* ── 6 · Device-confirm flow (push to phone) ── */
      + section('6 · Confirm sign-in on your phone',
        '<div class="card card-pad max-w-md mx-auto text-center py-10">'
        + '<div class="grid place-items-center w-20 h-20 rounded-2xl mx-auto mb-4 text-white relative" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">' + I_('smartphone', 36) + '<span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full grid place-items-center text-white text-xs" style="background:rgb(var(--emerald))">' + I_('check', 12) + '</span></div>'
        + '<h3 class="font-bold text-xl" style="font-family:DM Sans">Confirm on your phone</h3>'
        + '<p class="text-sm text-muted mt-2 max-w-xs mx-auto">We sent a push to <strong>iPhone 15 · Baku, AZ</strong>. Tap "Yes, it\'s me" to continue.</p>'
        + '<div class="flex gap-2 justify-center mt-5">'
        +    Array.from({length: 4}, (_,k) => '<div class="grid place-items-center w-12 h-12 font-mono font-bold text-xl rounded-xl border-2 ' + (k < 2 ? 'border-iris bg-[rgb(var(--iris-soft))] text-iris' : 'border-[rgb(var(--line))] text-muted') + '">' + (k < 2 ? ['4','7'][k] : '') + '</div>').join('')
        + '</div>'
        + '<p class="text-xs text-muted mt-4">Pairing code · expires in 02:48</p>'
        + '<button class="btn btn-secondary mt-5">' + I('refresh') + '<span>Try another method</span></button>'
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
    const head = pageHead('Settings · Preferences', 'Profile, account, notifications, security, integrations — every tab fully wired.',
      [{title:'System'}, {title:'Settings'}]);

    const profilePanel =
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">'
      + '<div class="md:col-span-1 text-center"><div class="avatar mx-auto" style="width:96px;height:96px;font-size:36px">VF</div><h4 class="font-semibold mt-3">Vugar Familoglu</h4><p class="text-sm text-muted">vugar@vgf26.io</p><button class="btn btn-secondary mt-3">' + I('upload') + '<span>Upload photo</span></button></div>'
      + '<div class="md:col-span-2 space-y-4">'
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="label">First name</label><input class="input" value="Vugar"></div><div><label class="label">Last name</label><input class="input" value="Familoglu"></div></div>'
      + '<div><label class="label">Bio</label><textarea class="textarea">Indie engineer & designer. Building the iridescent admin studio.</textarea></div>'
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="label">Country</label><select class="select"><option>Azerbaijan</option><option>Germany</option><option>Japan</option></select></div><div><label class="label">Timezone</label><select class="select"><option>Asia/Baku (UTC+4)</option><option>Europe/Berlin (UTC+1)</option></select></div></div>'
      + '<div class="flex justify-end gap-2 pt-2 border-t border-[rgb(var(--line))]"><button class="btn btn-secondary">' + I18n.t('common.cancel') + '</button><button class="btn btn-primary">' + I18n.t('common.save') + '</button></div>'
      + '</div></div>';

    const accountPanel =
      '<div class="max-w-2xl space-y-5">'
      + '<div><label class="label">Email address</label><input class="input" value="vugar@vgf26.io" type="email"><p class="text-[11px] text-muted mt-1">We\'ll send a verification email if you change this.</p></div>'
      + '<div><label class="label">Username</label><div class="flex"><span class="input rounded-r-none flex items-center px-3 text-muted" style="height:40px;width:auto">vgf26.app/</span><input class="input rounded-l-none border-l-0" value="vugar"></div></div>'
      + '<div class="card-pad bg-soft rounded-xl"><h5 class="font-semibold text-sm mb-2">Danger zone</h5><p class="text-xs text-muted mb-3">Permanently delete this account. This cannot be undone.</p><button class="btn btn-danger">Delete account</button></div>'
      + '</div>';

    const notifPanel =
      '<div class="max-w-2xl space-y-4">'
      + [['Product updates', 'Weekly digest with what\'s new', true],
         ['Mentions',        'When someone @mentions you',     true],
         ['Comment replies', 'Replies to your comments',       true],
         ['Marketing',       'Tips, offers, news',             false],
         ['Security alerts', 'Sign-in attempts, password',     true]].map(([t, d, on]) =>
            '<div class="flex items-center justify-between p-3 rounded-xl border border-[rgb(var(--line))]"><div><div class="font-semibold text-sm">' + t + '</div><div class="text-xs text-muted">' + d + '</div></div><span class="switch ' + (on ? 'is-on' : '') + '" data-toggle></span></div>').join('')
      + '</div>';

    const securityPanel =
      '<div class="max-w-2xl space-y-4">'
      + '<div class="card-pad rounded-xl bg-soft"><h5 class="font-semibold text-sm">Password</h5><p class="text-xs text-muted mt-1 mb-3">Last changed 42 days ago</p><button class="btn btn-secondary">Change password</button></div>'
      + '<div class="card-pad rounded-xl bg-soft"><div class="flex items-center justify-between"><div><h5 class="font-semibold text-sm">Two-factor auth</h5><p class="text-xs text-muted mt-1">TOTP authenticator</p></div><span class="pill pill-emerald">ENABLED</span></div></div>'
      + '<div class="card-pad rounded-xl bg-soft"><h5 class="font-semibold text-sm mb-3">Active sessions</h5>'
      +    ['MacBook Pro · Chrome · Baku, AZ · this device', 'iPhone 15 · Safari · Baku, AZ · 3d ago', 'Windows · Edge · Berlin, DE · 2w ago'].map((s, i) => '<div class="flex items-center justify-between py-2 text-sm">' + I_('monitor', 14, 'text-iris') + '<span class="flex-1 ml-2">' + s + '</span>' + (i === 0 ? '<span class="pill pill-emerald">current</span>' : '<button class="btn btn-danger btn-xs">Sign out</button>') + '</div>').join('')
      + '</div></div>';

    const intPanel =
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">'
      + [['Slack', 'message-circle', 'iris', true],['GitHub', 'github', 'fuchsia', true],['Stripe', 'credit-card', 'cyan', false],['Vercel', 'rocket', 'emerald', false],['Figma', 'palette', 'amber', false],['Linear', 'check-circle', 'rose', true]].map(([n, ic, c, on]) =>
          '<div class="card card-pad flex items-center gap-3"><span class="grid place-items-center w-10 h-10 rounded-xl" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I(ic) + '</span><div class="flex-1"><div class="font-semibold text-sm">' + n + '</div><div class="text-[11px] text-muted">' + (on ? 'Connected' : 'Not connected') + '</div></div><button class="btn ' + (on ? 'btn-danger' : 'btn-primary') + ' btn-xs">' + (on ? 'Disconnect' : 'Connect') + '</button></div>').join('')
      + '</div>';

    return head
      + '<div class="card overflow-hidden tab-set" data-tab-set>'
      + '  <div class="card-head !p-0 border-b border-[rgb(var(--line))] tab-underline"><div class="flex flex-wrap">'
      +      [['profile','Profile'],['account','Account'],['notif','Notifications'],['security','Security'],['integrations','Integrations']].map(([k, l], i) => '<button data-tab="' + k + '"' + (i === 0 ? ' class="is-active"' : '') + '>' + l + '</button>').join('')
      + '  </div></div>'
      + '  <div class="p-6">'
      + '    <div data-tab-panel="profile"      class="is-active">' + profilePanel  + '</div>'
      + '    <div data-tab-panel="account">'                          + accountPanel  + '</div>'
      + '    <div data-tab-panel="notif">'                            + notifPanel    + '</div>'
      + '    <div data-tab-panel="security">'                         + securityPanel + '</div>'
      + '    <div data-tab-panel="integrations">'                     + intPanel      + '</div>'
      + '  </div>'
      + '</div>';
  }

  /* ─────────────────────────────────────────────────────────────────
   * Avatars / Badges / Ratings
   * ───────────────────────────────────────────────────────────────── */
  function viewAvatars() {
    const head = pageHead('Avatars · 7 variants',
      'Sizes · stacks · status · shapes · with photo · grouped · gradient ring.',
      [{title:'Data'}, {title:'Avatars'}]);

    const photo = (i) => DEMO.PEXELS && DEMO.PEXELS[i] ? DEMO.PEXELS[i].thumb : '';

    return head
      + section('1 · Sizes',
        '<div class="card card-pad flex items-end gap-3 flex-wrap">'
        + [24, 28, 36, 44, 56, 72, 96].map(s => '<div class="avatar" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * 0.35) + 'px">VF</div>').join('')
        + '</div>')

      + section('2 · Avatar stack with overflow',
        '<div class="card card-pad space-y-3">'
        + '<div class="avatar-stack flex">' + D().USERS.slice(0,6).map(u => '<div class="avatar">' + u.name.split(' ').map(x=>x[0]).join('') + '</div>').join('') + '<div class="avatar" style="background:rgb(var(--line));color:rgb(var(--ink-2))">+12</div></div>'
        + '<div class="avatar-stack flex">' + D().USERS.slice(0,4).map((_,i) => '<div class="avatar" style="width:28px;height:28px;font-size:11px;background:linear-gradient(135deg,' + DEMO.GRADS[i].replace('linear-gradient(135deg, ', '').replace(')', '') + ')"></div>').join('') + '</div>'
        + '</div>')

      + section('3 · Status indicators',
        '<div class="card card-pad flex gap-6 flex-wrap items-center">'
        + ['online', 'busy', 'away', 'offline'].map(s => {
            const c = s === 'online' ? 'emerald' : s === 'busy' ? 'rose' : s === 'away' ? 'amber' : 'muted';
            return '<div class="text-center"><div class="relative inline-block"><div class="avatar">VF</div><span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[rgb(var(--bg))]" style="background:rgb(var(--' + c + '))"></span></div><div class="text-[11px] text-muted mt-1">' + s + '</div></div>';
          }).join('')
        + '</div>')

      + section('4 · Shapes (square, rounded, circle)',
        '<div class="card card-pad flex gap-4 items-center">'
        + [['rounded-none','square'],['rounded-lg','rounded'],['rounded-full','circle']].map(([r, l]) => '<div class="text-center"><div class="grid place-items-center w-14 h-14 ' + r + ' text-white font-bold" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">VF</div><div class="text-[11px] text-muted mt-1">' + l + '</div></div>').join('')
        + '</div>')

      + section('5 · With Pexels photo',
        '<div class="card card-pad flex gap-4 items-center flex-wrap">'
        + [0,1,5,7,11].map((i, idx) => '<div class="text-center"><div class="grid place-items-center rounded-full overflow-hidden" style="width:56px;height:56px;border:2px solid rgb(var(--bg))"><img src="' + photo(i) + '" class="w-full h-full object-cover" alt=""></div><div class="text-[10px] text-muted mt-1">' + D().USERS[idx].name.split(' ')[0] + '</div></div>').join('')
        + '</div>')

      + section('6 · Group card (presence)',
        '<div class="card card-pad max-w-md">'
        + '<div class="flex items-center gap-3 mb-3"><h4 class="font-semibold flex-1">Studio team</h4><div class="text-[11px] text-emerald flex items-center gap-1"><span class="pill-dot" style="background:rgb(var(--emerald))"></span>5 active</div></div>'
        + D().USERS.slice(0, 5).map(u => '<div class="flex items-center gap-3 py-2"><div class="relative">' + D().avatarFor(u.name) + '<span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[rgb(var(--bg-card))]" style="background:rgb(var(--' + (u.status === 'online' ? 'emerald' : u.status === 'busy' ? 'rose' : 'muted') + '))"></span></div><div class="flex-1"><div class="text-sm font-semibold">' + u.name + '</div><div class="text-xs text-muted">' + u.role + '</div></div><button class="btn btn-ghost btn-xs">' + I_('message-circle', 14) + '</button></div>').join('')
        + '</div>')

      + section('7 · Gradient ring (story style)',
        '<div class="card card-pad flex gap-3 flex-wrap">'
        + [0,1,2,3,4,5,6,7].map((i) => '<div class="text-center"><div class="p-[2px] rounded-full" style="background:conic-gradient(from 230deg,#7c3aed,#d846ef,#22d3ee,#10b981,#7c3aed)"><div class="p-[2px] rounded-full" style="background:rgb(var(--bg-card))"><div class="avatar overflow-hidden" style="width:54px;height:54px"><img src="' + photo(i + 2) + '" class="w-full h-full object-cover" alt=""></div></div></div><div class="text-[10px] text-muted mt-1">' + (D().USERS[i] || {name:'You'}).name.split(' ')[0] + '</div></div>').join('')
        + '</div>');
  }

  function viewBadges() {
    const head = pageHead('Badges · Chips · Tags · 9 variants',
      'Status pills · solid · soft · outlined · removable chips · gradient · counter dots · ribbons · category tags.',
      [{title:'Data'}, {title:'Badges'}]);
    return head
      + section('1 · Status pills (dot + label)',
        '<div class="card card-pad space-x-2 space-y-2">'
        + ['iris', 'emerald', 'amber', 'rose', 'cyan', 'fuchsia', 'muted'].map(c => '<span class="pill pill-' + c + '"><span class="pill-dot" style="background:rgb(var(--' + (c === 'muted' ? 'muted' : c) + '))"></span>' + c + '</span>').join('')
        + '</div>')

      + section('2 · Solid (saturated)',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + [['iris','Active'],['emerald','Success'],['amber','Pending'],['rose','Error'],['cyan','Info']].map(([c, l]) => '<span class="pill" style="background:rgb(var(--' + c + '));color:#fff;border:0">' + l + '</span>').join('')
        + '</div>')

      + section('3 · Outlined',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + ['iris', 'emerald', 'amber', 'rose', 'cyan'].map(c => '<span class="pill" style="border:1px solid rgb(var(--' + c + '));color:rgb(var(--' + c + '));background:transparent">' + c + '</span>').join('')
        + '</div>')

      + section('4 · Removable chips',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + ['Design', 'Tokens', 'Iridescent', 'Tailwind', 'Vanilla JS', 'A11y', 'Dark mode'].map(t => '<span class="chip">' + t + ' <button class="text-iris hover:text-rose">' + I_('x',12) + '</button></span>').join('')
        + '</div>')

      + section('5 · Gradient badges',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + [['Pro','iris,fuchsia'],['New','emerald,cyan'],['Beta','amber,rose'],['AI','cyan,iris'],['Hot','rose,amber']].map(([t, g]) => '<span class="pill" style="background:linear-gradient(135deg,rgb(var(--' + g.split(',')[0] + ')),rgb(var(--' + g.split(',')[1] + ')));color:#fff;border:0">' + t + '</span>').join('')
        + '</div>')

      + section('6 · Counter dots (top-right)',
        '<div class="card card-pad flex gap-4">'
        + [['bell','iris',3],['message-circle','fuchsia',12],['mail','cyan',99],['cart','emerald','5+']].map(([ic,c,n]) => '<button class="relative grid place-items-center w-11 h-11 rounded-xl bg-soft border border-[rgb(var(--line))]">' + I(ic) + '<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 grid place-items-center rounded-full text-[10px] font-bold text-white" style="background:rgb(var(--' + c + '));border:2px solid rgb(var(--bg))">' + n + '</span></button>').join('')
        + '</div>')

      + section('7 · Ribbon badges',
        '<div class="card card-pad grid grid-cols-2 md:grid-cols-4 gap-3">'
        + [['Pro','iris'],['New','emerald'],['Sale','rose'],['Hot','amber']].map(([t,c]) => '<div class="relative aspect-video bg-soft rounded-xl flex items-center justify-center"><span class="absolute -top-2 -right-2 px-3 py-1 text-[10px] font-bold text-white rounded-md shadow-md" style="background:rgb(var(--' + c + '))">★ ' + t + '</span><span class="text-muted">Product card</span></div>').join('')
        + '</div>')

      + section('8 · Category tags with icon',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + [['palette','Design','iris'],['code-2','Engineering','fuchsia'],['sparkles','Marketing','cyan'],['shield','Security','emerald'],['flame','Trending','amber']].map(([i,t,c]) => '<span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style="background:rgb(var(--' + c + ')/.12);color:rgb(var(--' + c + '))">' + I_(i, 12) + t + '</span>').join('')
        + '</div>')

      + section('9 · Numeric badges in tables',
        '<div class="card card-pad space-y-2">'
        + ['+12% (up)|emerald','-2.4% (down)|rose','24h|cyan','v1.2.0|iris','beta|amber'].map(s => { const [t,c] = s.split('|'); return '<div class="flex items-center gap-2 text-sm"><span class="font-mono">' + t + '</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">badge</span></div>'; }).join('')
        + '</div>');
  }

  function viewRatings() {
    const head = pageHead('Rating · Emoji · 7 designs',
      'Star rating · half-stars · big rating display · slider · hearts · review summary · emoji reactions.',
      [{title:'Data'}, {title:'Ratings'}]);
    return head
      + section('1 · Interactive star rating',
        '<div class="card card-pad flex items-center gap-3" data-rating="r1">'
        + [1,2,3,4,5].map(i => '<button data-v="' + i + '" class="text-amber transition-transform hover:scale-110" style="font-size:28px">★</button>').join('')
        + '<span class="text-sm text-muted ml-3" data-rating-out>Click to rate</span></div>')

      + section('2 · Half-star display',
        '<div class="card card-pad space-y-2">'
        + [4.5, 3.5, 4.8, 2.5, 5.0].map(v => '<div class="flex items-center gap-2"><div class="relative inline-flex" style="font-size:18px">'
            + '<div class="text-[rgb(var(--line))]">★★★★★</div>'
            + '<div class="absolute inset-0 overflow-hidden text-amber" style="width:' + (v * 20) + '%">★★★★★</div>'
            + '</div><span class="font-mono text-sm">' + v.toFixed(1) + '</span><span class="text-xs text-muted">(' + (Math.floor(Math.random() * 500) + 50) + ' reviews)</span></div>').join('')
        + '</div>')

      + section('3 · Big hero rating',
        '<div class="card card-pad grid grid-cols-1 md:grid-cols-2 gap-6 items-center">'
        + '<div class="text-center"><div style="font-family:DM Sans;font-size:64px;font-weight:700" class="leading-none">4.8</div><div class="text-amber text-xl mt-2">★★★★★</div><div class="text-xs text-muted mt-1">based on 1,284 reviews</div></div>'
        + '<div class="space-y-2">' + [5,4,3,2,1].map(s => { const pct = [82,12,4,1,1][5-s]; return '<div class="flex items-center gap-2 text-sm"><span class="w-3 font-mono">' + s + '</span><span class="text-amber">★</span><div class="flex-1 h-2 rounded-full bg-soft overflow-hidden"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,rgb(var(--amber)),rgb(var(--rose)))"></div></div><span class="text-xs text-muted w-10 text-right">' + pct + '%</span></div>'; }).join('') + '</div>'
        + '</div>')

      + section('4 · Number slider rating',
        '<div class="card card-pad"><div class="flex justify-between mb-2 text-sm"><span class="text-muted">How likely are you to recommend us?</span><strong class="font-mono">8 / 10</strong></div>'
        + '<input type="range" min="0" max="10" value="8" class="w-full accent-[rgb(var(--iris))]">'
        + '<div class="flex justify-between text-[10px] text-muted mt-1"><span>0 Not at all</span><span>10 Very likely</span></div>'
        + '</div>')

      + section('5 · Hearts (like rating)',
        '<div class="card card-pad flex items-center gap-2">'
        + [1,2,3,4,5].map(i => '<button class="' + (i <= 4 ? 'text-rose' : 'text-[rgb(var(--line))]') + ' transition-transform hover:scale-125" style="font-size:24px">♥</button>').join('')
        + '<span class="text-sm text-muted ml-2">4 / 5</span></div>')

      + section('6 · Review summary card',
        '<div class="card card-pad max-w-md"><div class="flex items-center gap-3">' + D().avatarFor('Sarah Jenkins') + '<div class="flex-1"><div class="flex items-center justify-between"><strong class="text-sm">Sarah Jenkins</strong><div class="text-amber" style="font-size:14px">★★★★★</div></div><div class="text-xs text-muted">2 weeks ago · Verified buyer</div></div></div>'
        + '<p class="text-sm mt-3">"VGF26 is the best admin template I\'ve ever used. The gradient cards and dark mode are <em>chef\'s kiss</em>."</p>'
        + '<div class="flex gap-2 mt-3"><button class="btn btn-ghost btn-xs">' + I_('heart', 14) + ' 24</button><button class="btn btn-ghost btn-xs">' + I_('message-circle', 14) + ' Reply</button></div>'
        + '</div>')

      + section('7 · Emoji reactions',
        '<div class="card card-pad flex flex-wrap gap-2">'
        + ['👍 12', '❤️ 8', '🎉 5', '🚀 3', '😂 2', '🤯 1'].map(e => '<button class="pill pill-muted hover:bg-[rgb(var(--iris-soft))] cursor-pointer transition-transform hover:scale-110">' + e + '</button>').join('')
        + '<button class="pill pill-iris cursor-pointer">+ Add</button>'
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
    /* '#/pagination' is owned by views-extra.js (viewPagination). */
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
