/* ----------------------------------------------------------------------
 * views-extra.js — additional page templates registered onto Views.ROUTES
 *
 * Keeps the main views.js readable while still giving every sidebar
 * entry a polished destination.
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  const I  = (n, c) => Icons.get(n, { size: 18, class: c || '' });
  const I_ = (n, s, c) => Icons.get(n, { size: s || 18, class: c || '' });
  const D  = () => DEMO;

  /* shared helpers replicated from views.js (kept local so this file is independent) */
  function pageHead(title, sub, crumbs, right) {
    const c = (crumbs || []).map((cr, i, arr) =>
      i < arr.length - 1
        ? '<a href="' + (cr.route || '#/') + '">' + cr.title + '</a><span class="crumb-sep">/</span>'
        : '<span>' + cr.title + '</span>'
    ).join(' ');
    return ''
      + '<div class="page-head"><div>'
      + (crumbs ? '<div class="crumb">' + c + '</div>' : '')
      + '<h1 class="page-title" style="margin-top:6px">' + title + '</h1>'
      + (sub ? '<p class="page-sub">' + sub + '</p>' : '')
      + '</div>'
      + (right ? '<div style="display:flex;gap:8px;flex-wrap:wrap">' + right + '</div>' : '')
      + '</div>';
  }
  function section(title, body, sub) {
    return '<section class="mb-8 animate-fade-up">'
      + '<div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:10px">'
      + '<div><h2 style="font-family:DM Sans,Inter;font-weight:700;font-size:15px">' + title + '</h2>'
      + (sub ? '<p class="text-xs text-muted mt-1">' + sub + '</p>' : '')
      + '</div></div>' + body + '</section>';
  }
  function statTile(label, value, change, trend, icon, color) {
    color = color || 'iris';
    return '<div class="card card-pad hover-lift">'
      + '<div class="flex items-center justify-between">'
      + '<span class="text-[11px] uppercase tracking-wider text-muted font-semibold">' + label + '</span>'
      + '<span class="grid place-items-center w-8 h-8 rounded-lg" style="background:rgb(var(--' + color + ')/.12);color:rgb(var(--' + color + '))">' + I(icon) + '</span>'
      + '</div>'
      + '<div class="mt-3" style="font-family:DM Sans,Inter;font-weight:700;font-size:24px">' + value + '</div>'
      + (change ? '<div class="text-xs mt-2 flex items-center gap-1 ' + (trend === 'up' ? 'text-emerald' : 'text-rose') + '">'
              + I_(trend === 'up' ? 'trending-up' : 'trending-down', 14)
              + '<span>' + change + '</span><span class="text-muted">vs last</span></div>' : '')
      + '</div>';
  }

  /* ────────────────────────────────────────────────────────────────
   * DASHBOARDS
   * ──────────────────────────────────────────────────────────────── */
  function viewAnalytics() {
    return pageHead('Analytics Dashboard', 'Audience, traffic, conversion — at-a-glance numbers and trend lines.',
        [{title:'Dashboards'}, {title:'Analytics'}],
        '<button class="btn btn-secondary">' + I('refresh') + '<span>Refresh</span></button>'
        + '<button class="btn btn-primary">' + I('download') + '<span>Export</span></button>')
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Page views',    '184,210', '+18.2%', 'up', 'eye',         'iris')
      + statTile('Sessions',      '24,892',  '+12.4%', 'up', 'activity',    'fuchsia')
      + statTile('Bounce rate',   '24.1%',   '-2.4%',  'up', 'trending-down','emerald')
      + statTile('Avg. session',  '3m 21s',  '+12s',   'up', 'clock',       'cyan')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>Visitors vs sessions</h3></div><div class="p-4" data-chart="area-compare"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Top channels</h3></div><div class="p-4 flex flex-col items-center" data-chart="donut-channels"></div></div>'
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'
      + '  <div class="card"><div class="card-head"><h3>Traffic by country</h3></div>'
      + '    <table class="t-table"><thead><tr><th>Country</th><th class="text-right">Visitors</th><th class="text-right">%</th></tr></thead><tbody>'
      + ['🇺🇸 United States|42,810|34', '🇬🇧 United Kingdom|18,200|14', '🇩🇪 Germany|14,500|12', '🇦🇿 Azerbaijan|9,830|8', '🇯🇵 Japan|8,210|7'].map(r => { const [c,v,p] = r.split('|'); return '<tr><td>' + c + '</td><td class="text-right font-mono">' + v + '</td><td class="text-right"><div class="flex items-center justify-end gap-2"><div class="h-1.5 rounded-full bg-soft w-20"><div class="h-full rounded-full" style="width:' + p + '%;background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)))"></div></div><span class="text-muted text-xs">' + p + '%</span></div></td></tr>'; }).join('')
      + '    </tbody></table></div>'
      + '  <div class="card"><div class="card-head"><h3>Funnel</h3></div><div class="p-4 space-y-3">'
      + [['Landing page', 100, 'iris'], ['Sign-up form', 64, 'fuchsia'], ['Email verified', 52, 'cyan'], ['Onboarded', 38, 'emerald'], ['Activated', 24, 'amber']].map(([s,p,c]) =>
          '<div><div class="flex justify-between text-sm mb-1"><span>' + s + '</span><span class="font-mono">' + p + '%</span></div><div class="h-3 rounded-full bg-soft overflow-hidden"><div style="width:' + p + '%;height:100%;background:linear-gradient(90deg,rgb(var(--' + c + ')),rgb(var(--iris)))"></div></div></div>').join('')
      + '  </div></div>'
      + '</div>';
  }

  function viewCRM() {
    const pipeline = [['Leads', 24, 'iris'], ['Qualified', 16, 'fuchsia'], ['Proposal', 8, 'amber'], ['Negotiation', 5, 'cyan'], ['Closed Won', 12, 'emerald']];
    return pageHead('CRM Dashboard', 'Pipeline, customers, activity — built for sales teams.', [{title:'Dashboards'}, {title:'CRM'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Open deals',     '65',       '+12',   'up', 'flame',    'iris')
      + statTile('Pipeline value', '$1.84M',   '+24%',  'up', 'dollar',   'fuchsia')
      + statTile('Win rate',       '28.4%',    '+3.1%', 'up', 'trophy',   'emerald')
      + statTile('Avg. deal size', '$28,300',  '+8%',   'up', 'briefcase','amber')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">'
      + '  <div class="card"><div class="card-head"><h3>Sales pipeline</h3></div><div class="p-4 space-y-3">'
      + pipeline.map(([s,n,c]) => '<div class="flex items-center gap-3"><span class="w-28 text-sm">' + s + '</span><div class="flex-1 h-8 rounded-lg bg-soft relative overflow-hidden"><div class="absolute inset-y-0 left-0 flex items-center px-3 text-white text-xs font-semibold" style="width:' + (n*3) + 'px;background:linear-gradient(90deg,rgb(var(--' + c + ')),rgb(var(--iris)))">' + n + ' deals</div></div></div>').join('')
      + '  </div></div>'
      + '  <div class="card"><div class="card-head"><h3>Revenue forecast</h3></div><div class="p-4" data-chart="line-revenue"></div></div>'
      + '</div>'
      + '<div class="card"><div class="card-head"><h3>Recent contacts</h3></div>'
      + '<table class="t-table"><thead><tr><th>Customer</th><th>Company</th><th>Stage</th><th class="text-right">Value</th><th>Owner</th><th>Next step</th></tr></thead><tbody>'
      + D().USERS.map((u, i) => '<tr><td><div class="flex items-center gap-2">' + D().avatarFor(u.name) + u.name + '</div></td><td>' + ['Mercatum','Praesidio','Atlas Docs','Iconos','Helix Ops','Apexsoft','Foundry','Nebula'][i % 8] + '</td><td><span class="pill pill-' + ['iris','fuchsia','amber','cyan','emerald'][i % 5] + '">' + pipeline[i % 5][0] + '</span></td><td class="text-right font-mono">$' + (12000 + i * 4200).toLocaleString() + '</td><td>' + u.role + '</td><td class="text-muted">Follow-up call</td></tr>').join('')
      + '</tbody></table></div>';
  }

  function viewFinance() {
    return pageHead('Finance Dashboard', 'Cash flow, P&L, expense breakdown.', [{title:'Dashboards'}, {title:'Finance'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Cash on hand',   '$1.42M', '+$182k', 'up',  'wallet',   'iris')
      + statTile('Revenue (MTD)',  '$284k',  '+12%',   'up',  'dollar',   'emerald')
      + statTile('Expenses (MTD)', '$142k',  '+4.2%',  'up',  'credit-card','amber')
      + statTile('Net profit',     '$142k',  '+24%',   'up',  'trending-up','fuchsia')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>Cash flow — last 12 months</h3></div><div class="p-4" data-chart="line-revenue-lg"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Expense breakdown</h3></div><div class="p-4 flex flex-col items-center" data-chart="donut-channels"></div></div>'
      + '</div>'
      + '<div class="card"><div class="card-head"><h3>Recent transactions</h3></div>'
      + '<table class="t-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="text-right">Amount</th><th>Status</th></tr></thead><tbody>'
      + [['2026-05-25','Stripe payout','Income',24820,'completed'],['2026-05-24','AWS bill','Infrastructure',-1280,'completed'],['2026-05-24','Notion subscription','Software',-32,'completed'],['2026-05-23','Customer #9822','Income',142,'completed'],['2026-05-22','Office rent','Facilities',-3200,'pending']].map(([d,desc,cat,amt,st]) => '<tr><td class="font-mono text-xs">' + d + '</td><td>' + desc + '</td><td><span class="pill pill-muted">' + cat + '</span></td><td class="text-right font-mono ' + (amt > 0 ? 'text-emerald' : 'text-rose') + '">' + (amt > 0 ? '+' : '') + '$' + Math.abs(amt).toLocaleString() + '</td><td><span class="pill pill-' + (st === 'completed' ? 'emerald' : 'amber') + '">' + st + '</span></td></tr>').join('')
      + '</tbody></table></div>';
  }

  function viewEcom() {
    return pageHead('E-commerce Dashboard', 'Orders, products, customers — single-page overview.', [{title:'Dashboards'}, {title:'E-commerce'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Orders (24h)',    '1,248', '+8.4%', 'up', 'cart',    'iris')
      + statTile('Revenue',         '$142k', '+12%',  'up', 'dollar',  'emerald')
      + statTile('AOV',             '$114',  '+$8',   'up', 'package', 'fuchsia')
      + statTile('Conversion',      '3.2%',  '+0.4%', 'up', 'gauge',   'cyan')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>Sales</h3></div><div class="p-4" data-chart="bar-sales"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Top categories</h3></div><div class="p-4 flex flex-col items-center" data-chart="donut-channels"></div></div>'
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'
      + '  <div class="card"><div class="card-head"><h3>Top products</h3></div><table class="t-table"><thead><tr><th>Product</th><th class="text-right">Sales</th><th class="text-right">Stock</th></tr></thead><tbody>'
      + D().PRODUCTS.slice(0,6).map(p => '<tr><td><div><strong>' + p.name + '</strong><div class="text-xs text-muted">' + p.sku + '</div></div></td><td class="text-right font-mono">' + p.sales + '</td><td class="text-right">' + p.stock + '</td></tr>').join('')
      + '</tbody></table></div>'
      + '  <div class="card"><div class="card-head"><h3>Recent orders</h3></div><table class="t-table"><thead><tr><th>ID</th><th>Customer</th><th class="text-right">Amount</th><th>Status</th></tr></thead><tbody>'
      + D().ORDERS.map(o => '<tr><td>' + o.id + '</td><td>' + o.cust + '</td><td class="text-right font-mono">$' + o.amount.toFixed(2) + '</td><td><span class="pill pill-' + (o.status === 'completed' ? 'emerald' : o.status === 'pending' ? 'amber' : o.status === 'failed' ? 'rose' : 'iris') + '">' + o.status + '</span></td></tr>').join('')
      + '</tbody></table></div></div>';
  }

  function viewCrypto() {
    const coins = [['BTC', 'Bitcoin', 67421, 2.4], ['ETH', 'Ethereum', 3842, -1.2], ['SOL', 'Solana', 142, 5.8], ['ADA', 'Cardano', 0.58, 0.4], ['DOT', 'Polkadot', 7.2, -2.1]];
    return pageHead('Crypto Dashboard', 'Portfolio, prices, holdings — neon dark vibe.', [{title:'Dashboards'}, {title:'Crypto'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Portfolio value', '$284,210', '+8.2%', 'up', 'wallet', 'iris')
      + statTile('24h change',      '+$22,420', '+12%',  'up', 'trending-up', 'emerald')
      + statTile('Holdings',        '12 coins', '',      '',   'package', 'fuchsia')
      + statTile('Yield (APR)',     '8.4%',     '+0.2%', 'up', 'flame',   'amber')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>BTC / USD — 7d</h3><span class="pill pill-emerald">+2.4%</span></div><div class="p-4" data-chart="line-revenue-lg"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Allocation</h3></div><div class="p-4 flex flex-col items-center" data-chart="donut-channels"></div></div>'
      + '</div>'
      + '<div class="card"><div class="card-head"><h3>Markets</h3></div><table class="t-table"><thead><tr><th>Symbol</th><th>Name</th><th class="text-right">Price</th><th class="text-right">24h</th><th class="text-right">Chart</th></tr></thead><tbody>'
      + coins.map(([s,n,p,ch]) => '<tr><td><span class="font-bold">' + s + '</span></td><td>' + n + '</td><td class="text-right font-mono">$' + p.toLocaleString() + '</td><td class="text-right font-mono ' + (ch > 0 ? 'text-emerald' : 'text-rose') + '">' + (ch > 0 ? '+' : '') + ch + '%</td><td class="text-right"><svg width="80" height="24" viewBox="0 0 80 24"><polyline points="0,' + (12 - ch * 2) + ' 20,' + (12 + ch) + ' 40,' + (12 - ch) + ' 60,' + (12 + ch * 1.5) + ' 80,' + (12 - ch * 2) + '" stroke="' + (ch > 0 ? '#10b981' : '#f43f5e') + '" stroke-width="2" fill="none"/></svg></td></tr>').join('')
      + '</tbody></table></div>';
  }

  function viewNFT() {
    return pageHead('NFT Marketplace', 'Browse, bid, mint — gradient hero card grid.', [{title:'Dashboards'}, {title:'NFT'}])
      + '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">'
      + statTile('Floor price', '4.2 ETH', '+0.4', 'up', 'dollar', 'iris')
      + statTile('Volume (24h)','142 ETH', '+18%', 'up', 'flame',  'fuchsia')
      + statTile('Owners',      '8,201',   '+212', 'up', 'users',  'cyan')
      + '</div>'
      + section('Featured drop',
        '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">'
        + Array.from({length:8}, (_,i) => {
          const grads = ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef','#10b981,#06b6d4','#f43f5e,#fb923c','#22d3ee,#6366f1','#84cc16,#06b6d4','#d946ef,#f43f5e'];
          return '<div class="card overflow-hidden hover-lift"><div class="aspect-square relative" style="background:linear-gradient(135deg,' + grads[i] + ')"><span class="absolute top-2 right-2 pill pill-iris" style="background:rgba(255,255,255,.2);color:#fff;border:0">#' + (1200 + i) + '</span><div class="absolute inset-0 grid place-items-center text-white/80" style="font-family:DM Sans;font-size:34px;font-weight:700">' + (i+1) + '</div></div>'
            + '<div class="p-3"><div class="flex justify-between items-center"><div><div class="font-semibold text-sm">Iridescence #' + (i+1) + '</div><div class="text-xs text-muted">@studio_drop</div></div><div class="text-right"><div class="font-mono font-bold text-sm">' + (1.5 + i * 0.3).toFixed(1) + ' ETH</div><div class="text-[10px] text-emerald">+' + (i+1) + ' bids</div></div></div></div></div>';
        }).join('')
        + '</div>');
  }

  function viewIoT() {
    return pageHead('IoT · Smart Home', 'Device telemetry + automations.', [{title:'Dashboards'}, {title:'IoT'}])
      + '<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">'
      + statTile('Active devices', '24/26', '2 offline', 'up', 'cpu', 'iris')
      + statTile('Power usage',    '4.2 kW', '-12%', 'up', 'zap', 'emerald')
      + statTile('Temperature',    '21.4°C', 'stable', '', 'flame', 'amber')
      + statTile('Automations',    '18',     '+2', 'up', 'sparkles', 'fuchsia')
      + '</div>'
      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">'
      + '<div class="card xl:col-span-2"><div class="card-head"><h3>Power (24h)</h3></div><div class="p-4" data-chart="area-compare"></div></div>'
      + '<div class="card"><div class="card-head"><h3>Quick controls</h3></div><div class="p-4 grid grid-cols-2 gap-3">'
      + [['Living room lights', true, 'sun', 'amber'], ['Thermostat', true, 'flame', 'rose'], ['Front door', false, 'lock', 'emerald'], ['Security cam', true, 'video', 'cyan'], ['Fridge', true, 'box', 'iris'], ['Wifi', true, 'wifi', 'fuchsia']].map(([n,on,icon,c]) =>
          '<div class="bg-soft rounded-xl p-3 border border-[rgb(var(--line))] hover-lift cursor-pointer"><div class="flex items-center justify-between"><span class="grid place-items-center w-9 h-9 rounded-lg" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I(icon) + '</span><span class="switch ' + (on ? 'is-on' : '') + '" data-toggle></span></div><div class="text-sm font-semibold mt-2">' + n + '</div><div class="text-[11px] text-muted">' + (on ? 'On' : 'Off') + '</div></div>').join('')
      + '</div></div>'
      + '</div>';
  }

  function viewDevOps() {
    return pageHead('DevOps · Server metrics', 'Live CPU, memory, deploys, logs.', [{title:'Dashboards'}, {title:'DevOps'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Uptime',       '99.98%', '99.95% (30d)', 'up', 'activity', 'emerald')
      + statTile('Avg latency',  '142ms',  '-12ms',        'up', 'zap',      'iris')
      + statTile('Error rate',   '0.04%',  '-0.01%',       'up', 'alert-circle','rose')
      + statTile('Deploys (7d)', '24',     '+6',           'up', 'rocket',   'fuchsia')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">'
      + '  <div class="card"><div class="card-head"><h3>CPU usage</h3></div><div class="p-4" data-chart="line-revenue"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Memory / Disk</h3></div><div class="p-4" data-chart="bar-sales"></div></div>'
      + '</div>'
      + '<div class="card"><div class="card-head"><h3>Recent deployments</h3></div><table class="t-table"><thead><tr><th>SHA</th><th>Service</th><th>Author</th><th>Status</th><th>Duration</th><th>When</th></tr></thead><tbody>'
      + [['7a6ee68','frontend','Vugar','passed','42s','2m ago'],['db2ea96','api','Alex','passed','38s','12m ago'],['1333497','frontend','Sarah','running','—','24m ago'],['58219ac','worker','Leo','failed','12s','1h ago'],['b8e3210','api','Maya','passed','51s','2h ago']].map(([s,svc,a,st,d,w]) => '<tr><td class="font-mono text-xs">' + s + '</td><td>' + svc + '</td><td>' + a + '</td><td><span class="pill pill-' + (st === 'passed' ? 'emerald' : st === 'failed' ? 'rose' : 'amber') + '">' + st + '</span></td><td class="font-mono text-xs">' + d + '</td><td class="text-muted">' + w + '</td></tr>').join('')
      + '</tbody></table></div>';
  }

  function viewStreaming() {
    const scenes = D().PEXELS;
    return pageHead('Streaming · OBS style',
        'Live viewers, scene switcher, chat, performance metrics.',
        [{title:'Dashboards'}, {title:'Streaming'}],
        '<button class="btn btn-secondary btn-xs">' + I('settings') + '<span>Settings</span></button>'
        + '<button class="btn btn-danger btn-xs">' + I('pause') + '<span>End stream</span></button>')
      + '<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">'
      + statTile('Live viewers',  '1,842', '+212', 'up', 'eye',         'iris')
      + statTile('Bitrate',       '6 Mbps','stable','', 'activity',     'emerald')
      + statTile('Dropped frames','0.2%',  '-0.1%','up', 'alert-circle','amber')
      + statTile('Subs (24h)',    '+42',   '+12%', 'up', 'star',        'fuchsia')
      + '</div>'

      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2 overflow-hidden">'
      + '    <div class="card-head"><h3>Live preview</h3><div class="flex gap-2 items-center"><span class="text-xs text-muted">scene: <strong>Main camera</strong></span><span class="pill" style="background:rgb(var(--emerald)/.14);color:rgb(var(--emerald))">● 1080p / 60fps</span></div></div>'
      + '    <div class="p-3">'
      + '      <div class="live-preview"><img src="' + scenes[2].large + '" alt="Live preview">'
      + '        <span class="live-badge">LIVE</span>'
      + '        <span class="viewer-count">' + I_('eye', 12) + '1,842</span>'
      + '        <div class="scene-overlay"><div class="text-[10px] uppercase tracking-wider opacity-70">Now playing</div><div class="font-semibold">"Building the iridescent admin"</div></div>'
      + '      </div>'
      + '      <div class="mt-3 grid grid-cols-4 gap-2">'
      +          scenes.slice(0, 4).map((p, i) => '<button class="relative aspect-video rounded-lg overflow-hidden ' + (i === 2 ? 'ring-2 ring-[rgb(var(--iris))]' : 'opacity-70 hover:opacity-100') + '"><img src="' + p.thumb + '" class="w-full h-full object-cover" alt=""><span class="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">Scene ' + (i+1) + '</span></button>').join('')
      + '      </div>'
      + '    </div>'
      + '  </div>'

      + '  <div class="card flex flex-col h-[560px]">'
      + '    <div class="card-head"><h3>Live chat</h3><span class="pill pill-iris">' + I_('users', 12) + ' 124 online</span></div>'
      + '    <div class="flex-1 overflow-y-auto p-3 space-y-2 text-sm">'
      +        Array.from({length: 14}, (_, i) => {
                const who = ['neon_42','iris_dev','aurora_fan','spectrum','cyber_kid','prism_artist','viewer_88','glow_up'][i % 8];
                const msg = ['great stream!','love the gradient 💜','what theme is this?','iridescent UI ftw','keep going!','can you share the code?','this is amazing','+1','💜','🚀','GG','where can I get this?','best stream today','♥️♥️♥️'][i];
                return '<div class="flex gap-2 items-start"><span class="avatar shrink-0" style="width:24px;height:24px;font-size:10px">' + who.slice(0,2).toUpperCase() + '</span><div><span class="font-semibold text-iris">' + who + '</span> <span class="text-ink-2">' + msg + '</span></div></div>';
              }).join('')
      + '    </div>'
      + '    <div class="p-3 border-t border-[rgb(var(--line))] flex gap-2"><input class="input" placeholder="Say something…"><button class="btn btn-primary">' + I('send') + '</button></div>'
      + '  </div>'
      + '</div>'

      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + '  <div class="card"><div class="card-head"><h3>Performance</h3></div><div class="p-4" data-chart="line-revenue"></div></div>'
      + '  <div class="card"><div class="card-head"><h3>Audio mixer</h3></div><div class="p-4 space-y-3">'
      +    [['Mic',62,'iris'],['Music',38,'fuchsia'],['Game',75,'cyan'],['Alerts',45,'emerald']].map(([n,v,c]) =>
            '<div class="flex items-center gap-3"><span class="text-xs font-semibold w-14">' + n + '</span>'
            + '<input type="range" value="' + v + '" max="100" class="flex-1 accent-[rgb(var(--' + c + '))]">'
            + '<span class="text-xs font-mono w-9 text-right">' + v + '%</span></div>'
          ).join('')
      + '  </div></div>'
      + '  <div class="card"><div class="card-head"><h3>Top supporters</h3></div><div class="p-2">'
      +    D().USERS.slice(0,5).map((u, i) => '<div class="p-2 flex items-center gap-3">' + D().avatarFor(u.name) + '<div class="flex-1"><div class="font-semibold text-sm">' + u.name + '</div><div class="text-[11px] text-muted">' + ['Tier 3','Tier 2','Tier 2','Tier 1','Tier 1'][i] + ' subscriber</div></div><span class="pill pill-amber">⭐ ' + (50 - i * 8) + '</span></div>').join('')
      + '  </div></div>'
      + '</div>';
  }

  function viewGaming() {
    return pageHead('Game HUD · Leaderboard · Inventory', 'XP, quests, loot — gaming-flavoured dashboard.', [{title:'Dashboards'}, {title:'Gaming'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">'
      + statTile('Level',     '47',     '+1 today', 'up', 'star',    'iris')
      + statTile('XP',        '12,840', '+812',     'up', 'flame',   'fuchsia')
      + statTile('Gold',      '24,201', '+1,202',   'up', 'crown',   'amber')
      + statTile('Achievements','58/120','+3',      'up', 'trophy',  'emerald')
      + '</div>'
      + '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">'
      + '  <div class="card xl:col-span-2"><div class="card-head"><h3>Leaderboard — Season 4</h3></div><table class="t-table"><thead><tr><th>#</th><th>Player</th><th class="text-right">Score</th><th class="text-right">Wins</th></tr></thead><tbody>'
      + D().USERS.map((u, i) => '<tr><td><span class="font-bold ' + (i < 3 ? 'text-amber' : '') + '">' + (i+1) + (i === 0 ? ' 👑' : '') + '</span></td><td><div class="flex items-center gap-2">' + D().avatarFor(u.name) + u.name + '</div></td><td class="text-right font-mono">' + (24800 - i * 1240).toLocaleString() + '</td><td class="text-right">' + (142 - i * 8) + '</td></tr>').join('')
      + '</tbody></table></div>'
      + '  <div class="card"><div class="card-head"><h3>Inventory</h3></div><div class="p-3 grid grid-cols-4 gap-2">'
      + Array.from({length: 16}, (_, i) => '<div class="aspect-square rounded-lg border border-[rgb(var(--line))] grid place-items-center" style="background:linear-gradient(135deg,rgb(var(--' + ['iris','fuchsia','cyan','emerald'][i % 4] + ')/.15),transparent)">' + (i < 8 ? I_(['star','flame','crown','trophy','shield','zap','sparkles','heart'][i], 22, 'text-' + ['iris','fuchsia','cyan','emerald','amber','rose','iris','fuchsia'][i]) : '<span class="text-muted">+</span>') + '</div>').join('')
      + '  </div></div>'
      + '</div>';
  }

  /* ────────────────────────────────────────────────────────────────
   * LAYOUTS
   * ──────────────────────────────────────────────────────────────── */
  function viewLayouts() {
    return pageHead('Page layouts', 'Common structural patterns — sidebar, split, dock, sticky.', [{title:'Layout'}, {title:'Page layouts'}])
      + section('Holy-grail layout (sidebar + topbar + content + footer)',
        '<div class="card overflow-hidden"><div class="grid" style="grid-template-columns:160px 1fr;grid-template-rows:48px 1fr 36px;height:280px"><div class="row-span-3 border-r border-[rgb(var(--line))] bg-soft p-3"><div class="font-semibold text-xs mb-2 text-muted">SIDEBAR</div><div class="space-y-1 text-sm">' + ['Dashboard','Customers','Settings'].map(t => '<div class="p-1 rounded">' + t + '</div>').join('') + '</div></div><div class="border-b border-[rgb(var(--line))] flex items-center px-3 text-xs text-muted">TOPBAR</div><div class="p-4 text-muted">Main content area</div><div class="border-t border-[rgb(var(--line))] text-xs text-muted px-3 flex items-center">FOOTER</div></div></div>')
      + section('Centered single column',
        '<div class="card card-pad text-center py-12"><h3 class="font-bold text-xl">Hero title</h3><p class="text-sm text-muted mt-2 max-w-md mx-auto">Center the content with max-w + mx-auto. Great for marketing pages and onboarding.</p><button class="btn btn-primary mt-4">Get started</button></div>')
      + section('3-column with rails',
        '<div class="grid grid-cols-12 gap-3"><div class="card card-pad col-span-3"><h4 class="font-semibold">Left rail</h4><p class="text-xs text-muted mt-1">Filters / nav</p></div><div class="card card-pad col-span-6"><h4 class="font-semibold">Main</h4><p class="text-xs text-muted mt-1">Primary content</p></div><div class="card card-pad col-span-3"><h4 class="font-semibold">Right rail</h4><p class="text-xs text-muted mt-1">Side panel</p></div></div>');
  }

  function viewSplit() {
    return pageHead('Split pane · Resizable', 'Drag the divider — pure JS resizing.', [{title:'Layout'}, {title:'Split'}])
      + section('Horizontal split',
        '<div class="card overflow-hidden h-80 flex" data-mount="split"><div id="split-a" class="bg-soft flex-shrink-0 p-4 border-r border-[rgb(var(--line))]" style="width:40%"><h4 class="font-semibold">Left pane</h4><p class="text-xs text-muted mt-1">Drag the divider →</p></div><div id="split-bar" class="w-1 cursor-col-resize hover:bg-[rgb(var(--iris))] transition-colors"></div><div class="flex-1 p-4"><h4 class="font-semibold">Right pane</h4><p class="text-xs text-muted mt-1">…to resize the panels.</p></div></div>');
  }

  function viewDocks() {
    return pageHead('Dockable windows · IDE style', 'Panels you can pin to any side. Visual demo.', [{title:'Layout'}, {title:'Docks'}])
      + '<div class="card overflow-hidden">'
      + '  <div class="grid h-[480px]" style="grid-template-columns:200px 1fr 200px;grid-template-rows:1fr 140px">'
      + '    <div class="bg-soft border-r border-[rgb(var(--line))] row-span-1 p-3"><div class="font-semibold text-xs text-muted mb-2">EXPLORER</div><div class="text-sm space-y-1">' + ['📁 src/','  📁 components/','  📁 pages/','  📄 app.js','📄 README.md'].map(t => '<div class="hover:bg-[rgb(var(--iris-soft))] rounded px-1">' + t + '</div>').join('') + '</div></div>'
      + '    <div class="p-4 font-mono text-sm overflow-auto"><div class="text-muted">// VGF26 — main.js</div><div><span class="text-iris">import</span> { Icons } <span class="text-iris">from</span> <span class="text-emerald">"./icons"</span>;</div><div><span class="text-iris">export</span> <span class="text-iris">function</span> <span class="text-fuchsia-500">boot</span>() {</div><div>  <span class="text-iris">return</span> Icons.get(<span class="text-emerald">"sparkles"</span>);</div><div>}</div></div>'
      + '    <div class="bg-soft border-l border-[rgb(var(--line))] p-3"><div class="font-semibold text-xs text-muted mb-2">OUTLINE</div><ul class="text-sm space-y-1">' + ['boot()','render()','dispatch()'].map(t => '<li class="hover:bg-[rgb(var(--iris-soft))] rounded px-1">' + t + '</li>').join('') + '</ul></div>'
      + '    <div class="bg-soft border-t border-[rgb(var(--line))] col-span-3 p-3 font-mono text-xs overflow-auto"><div class="text-emerald">✓ build succeeded in 412ms</div><div class="text-muted">[VGF26] router ready</div><div class="text-muted">[VGF26] 220 routes registered</div></div>'
      + '  </div></div>';
  }

  function viewSticky() {
    return pageHead('Sticky chrome — header / sidebar / footer', 'CSS sticky positioning patterns.', [{title:'Layout'}, {title:'Sticky'}])
      + section('Sticky table header',
        '<div class="card overflow-hidden" style="max-height:320px;overflow-y:auto"><table class="t-table"><thead><tr><th>#</th><th>Item</th><th class="text-right">Value</th></tr></thead><tbody>'
        + Array.from({length: 25}, (_, i) => '<tr><td>' + (i+1) + '</td><td>Item ' + (i+1) + '</td><td class="text-right font-mono">$' + (100 + i * 42).toLocaleString() + '</td></tr>').join('')
        + '</tbody></table></div>')
      + section('Sticky bottom action bar',
        '<div class="card relative" style="min-height:240px"><div class="card-pad"><p class="text-sm">Scroll content here…</p></div><div class="sticky bottom-0 bg-[rgb(var(--bg-card))] border-t border-[rgb(var(--line))] p-3 flex justify-end gap-2"><button class="btn btn-secondary">Cancel</button><button class="btn btn-primary">Save changes</button></div></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * KANBAN / TIMELINE (standalone)
   * ──────────────────────────────────────────────────────────────── */
  function viewTree() {
    /* Recursive helper — flag `open` decides whether a folder starts expanded. */
    function renderNode(n, depth) {
      const isFolder = !!(n.children && n.children.length);
      const open = n.open !== false && depth < 2;
      return ''
        + '<li class="tree-node' + (open ? ' is-open' : '') + '">'
        + '  <div class="tree-row">'
        + '    <span class="tree-caret ' + (isFolder ? (open ? 'is-open' : '') : 'is-leaf') + '">' + (isFolder ? I_('chevron-right', 12) : '') + '</span>'
        + '    <span class="tree-icon">' + I_(n.icon || (isFolder ? 'folder' : 'file'), 16, isFolder ? 'text-iris' : '') + '</span>'
        + '    <span class="flex-1 truncate">' + n.label + '</span>'
        + (n.badge ? '<span class="pill pill-muted">' + n.badge + '</span>' : '')
        + (n.size  ? '<span class="text-[10.5px] text-muted font-mono">' + n.size + '</span>' : '')
        + '  </div>'
        + (isFolder
            ? '<ul class="tree-children" style="' + (open ? '' : 'display:none') + '">' + n.children.map((c) => renderNode(c, depth + 1)).join('') + '</ul>'
            : '')
        + '</li>';
    }

    const project = {
      label: 'admin-panel-vgf26', icon: 'folder', open: true, children: [
        { label: 'assets', icon: 'folder', open: true, children: [
          { label: 'css', icon: 'folder', children: [
            { label: 'app.css', icon: 'file', size: '14 KB' },
          ]},
          { label: 'js', icon: 'folder', open: true, children: [
            { label: 'app.js',          icon: 'file', size: '6 KB' },
            { label: 'icons.js',        icon: 'file', size: '21 KB' },
            { label: 'i18n.js',         icon: 'file', size: '7 KB' },
            { label: 'nav.js',          icon: 'file', size: '8 KB' },
            { label: 'views.js',        icon: 'file', size: '24 KB' },
            { label: 'views-extra.js',  icon: 'file', size: '48 KB' },
            { label: 'components.js',   icon: 'file', size: '18 KB' },
            { label: 'data.js',         icon: 'file', size: '4 KB' },
          ]},
          { label: 'img', icon: 'folder', children: [
            { label: 'favicon.svg', icon: 'file', size: '0.4 KB' },
          ]},
        ]},
        { label: 'index.html',  icon: 'file', size: '3 KB' },
        { label: 'README.md',   icon: 'file', size: '6 KB' },
        { label: 'LICENSE',     icon: 'file', size: '1 KB' },
        { label: '.gitignore',  icon: 'file', size: '0.2 KB' },
      ]
    };

    const dept = {
      label: 'Studio org', icon: 'building', open: true, children: [
        { label: 'Design',      icon: 'palette',   children: [{ label: 'Alex Rivera', icon: 'user' }, { label: 'Olivia Chen', icon: 'user' }] },
        { label: 'Engineering', icon: 'code-2',    children: [{ label: 'Leo Kuznetsov', icon: 'user' }, { label: 'Yuki Tanaka', icon: 'user' }] },
        { label: 'Marketing',   icon: 'sparkles',  children: [{ label: 'Tomás Silva', icon: 'user' }] },
        { label: 'Support',     icon: 'message-circle', children: [{ label: 'Aida Mammadli', icon: 'user' }] },
      ]
    };

    return pageHead('Tree view',
        'Expand / collapse hierarchical data — files, folders, organisations.',
        [{title:'Data'}, {title:'Tree'}])
      + section('File explorer',
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">'
        + '<div class="card card-pad"><div class="flex items-center justify-between mb-2"><h4 class="font-semibold text-sm">Project files</h4><div class="flex gap-1"><button class="btn btn-ghost btn-xs">' + I_('plus', 12) + '</button><button class="btn btn-ghost btn-xs">' + I_('refresh', 12) + '</button></div></div>'
        + '<ul data-mount="tree" class="font-mono text-[12.5px] space-y-0.5">' + renderNode(project, 0) + '</ul></div>'
        + '<div class="card card-pad"><h4 class="font-semibold text-sm mb-2">Organisation</h4>'
        + '<ul data-mount="tree" class="space-y-0.5">' + renderNode(dept, 0) + '</ul></div>'
        + '</div>',
        'Click any row to set focus; click a folder to expand or collapse it.')
      + section('Selectable tree (deep nesting)',
        '<div class="card card-pad max-w-md"><ul data-mount="tree" class="space-y-0.5">'
        + renderNode({
            label: 'Continents', icon: 'globe', open: true, children: [
              { label: 'Europe', open: true, children: [
                { label: 'Azerbaijan', icon: 'pin' },
                { label: 'Germany',    icon: 'pin' },
                { label: 'Portugal',   icon: 'pin' },
              ]},
              { label: 'Asia', children: [{ label: 'Japan', icon: 'pin' }, { label: 'Korea', icon: 'pin' }] },
              { label: 'North America', children: [{ label: 'Canada', icon: 'pin' }, { label: 'USA', icon: 'pin' }] },
            ]
          }, 0)
        + '</ul></div>');
  }

  function viewKanban() {
    return pageHead('Kanban board', 'Drag cards between columns (visual demo).', [{title:'Data'}, {title:'Kanban'}])
      + '<div class="grid grid-cols-1 md:grid-cols-4 gap-3">'
      + [['Backlog', ['Add CSV export', 'Document shortcuts', 'Refactor sidebar', 'i18n: TR, ES'], 'muted'],
         ['In progress', ['Wire chart tooltips', 'Theme generator UI', 'A11y audit'], 'amber'],
         ['Review', ['Aurora hue tuning', 'Modal portal fix'], 'iris'],
         ['Done', ['Iridescent tokens', 'Sidebar collapse', 'Toast portal'], 'emerald']].map(([t, items, c]) =>
        '<div class="card card-pad"><div class="flex justify-between items-center mb-3"><div class="flex items-center gap-2"><span class="pill-dot" style="background:rgb(var(--' + c + '))"></span><h5 class="font-semibold">' + t + '</h5></div><span class="text-xs text-muted">' + items.length + '</span></div>'
        + items.map(item => '<div class="bg-soft border border-[rgb(var(--line))] rounded-lg p-3 mb-2 hover:border-[rgb(var(--iris))] cursor-grab"><div class="font-medium text-sm">' + item + '</div><div class="text-[11px] text-muted mt-1 flex items-center justify-between"><span>' + I_('clock', 11) + ' 2h ago</span><div class="flex"><span class="avatar" style="width:20px;height:20px;font-size:9px">VF</span></div></div></div>').join('')
        + '<button class="text-xs text-muted hover:text-iris mt-1">+ Add card</button></div>'
      ).join('')
      + '</div>';
  }

  function viewTimeline() {
    return pageHead('Timeline · Activity feed', 'Chronological events with gradient ring.', [{title:'Data'}, {title:'Timeline'}])
      + section('Project timeline',
        '<div class="card card-pad"><ol class="relative border-l-2 border-[rgb(var(--iris)/.25)] pl-6 space-y-5">'
        + D().ACTIVITIES.map(a =>
          '<li class="relative"><span class="absolute -left-[33px] top-1 w-4 h-4 rounded-full" style="background:linear-gradient(135deg,rgb(var(--' + a.color + ')),rgb(var(--iris)));box-shadow:0 0 0 3px rgb(var(--bg))"></span>'
          + '<div class="text-[11px] text-muted">' + a.when + ' ago</div>'
          + '<div class="text-sm mt-1"><strong>' + a.who + '</strong> <span class="text-muted">' + a.what + '</span> ' + a.obj + '</div></li>').join('')
        + '</ol></div>');
  }

  function viewPagination() {
    return pageHead('Pagination + Infinite scroll', 'Both patterns side by side.', [{title:'Data'}, {title:'Pagination'}])
      + section('Numbered pagination',
        '<div class="card card-pad flex flex-wrap gap-3 items-center justify-center">'
        + '<button class="btn btn-secondary btn-xs">' + I_('chevron-left', 14) + ' Prev</button>'
        + [1,2,3,'…',8,9,10].map((p,i) => '<button class="btn ' + (p === 2 ? 'btn-primary' : 'btn-secondary') + ' btn-xs" style="min-width:32px">' + p + '</button>').join('')
        + '<button class="btn btn-secondary btn-xs">Next ' + I_('chevron-right', 14) + '</button>'
        + '</div>')
      + section('Load more / infinite scroll',
        '<div class="card card-pad space-y-2"><div class="grid gap-2">' + Array.from({length: 6}, (_, i) => '<div class="bg-soft rounded-lg p-3 text-sm">Item ' + (i+1) + '</div>').join('') + '</div><button class="btn btn-secondary w-full justify-center mt-3">' + I('refresh') + '<span>Load more</span></button></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * MEDIA (gallery, carousel, image-zoom, marquee, media-player, maps)
   * ──────────────────────────────────────────────────────────────── */
  function viewGallery() {
    const photos = D().PEXELS;
    const heights = [200, 280, 240, 320, 200, 260, 220, 300, 240, 280, 200, 320, 240, 200, 280, 220, 260, 240, 300, 200];

    function tile(p, i, h) {
      return '<button type="button" class="pex-tile break-inside-avoid block w-full text-left" '
        + 'data-lightbox="' + p.large + '" data-title="' + p.title + '" data-tag="' + p.tag + '" '
        + 'style="height:' + h + 'px">'
        + '  <img src="' + p.thumb + '" alt="' + p.title + '" loading="lazy">'
        + '  <div class="overlay"><div class="meta"><h5>' + p.title + '</h5><span>' + p.tag + '</span></div></div>'
        + '</button>';
    }

    return pageHead('Gallery · Masonry · Lightbox',
        'Click any tile to open the lightbox · arrow keys ← → to navigate · ESC to close.',
        [{title:'Media'}, {title:'Gallery'}])
      + section('Masonry gallery',
        '<div class="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3" data-lightbox-group>'
        + photos.slice(0, 12).map((p, i) => tile(p, i, heights[i])).join('')
        + '</div>')
      + section('Fixed-grid gallery',
        '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-lightbox-group>'
        + photos.slice(12, 20).map((p, i) => '<button type="button" class="pex-tile block aspect-square w-full" data-lightbox="' + p.large + '" data-title="' + p.title + '" data-tag="' + p.tag + '"><img src="' + p.thumb + '" alt="' + p.title + '" loading="lazy"><div class="overlay"><div class="meta"><h5>' + p.title + '</h5><span>' + p.tag + '</span></div></div></button>').join('')
        + '</div>')
      + section('Filmstrip',
        '<div class="card card-pad overflow-x-auto"><div class="flex gap-3 min-w-max" data-lightbox-group>'
        + photos.slice(0, 8).map((p) => '<button type="button" class="pex-tile shrink-0" data-lightbox="' + p.large + '" data-title="' + p.title + '" data-tag="' + p.tag + '" style="width:160px;height:120px"><img src="' + p.thumb + '" alt="' + p.title + '" loading="lazy"></button>').join('')
        + '</div></div>');
  }

  function viewCarousel() {
    const slides = D().PEXELS.slice(0, 5);
    const cards = D().PEXELS.slice(5, 11);
    return pageHead('Carousel · Slider · Swiper',
        'Auto-advance every 5s · arrow nav · click dots to jump · pause on hover.',
        [{title:'Media'}, {title:'Carousel'}])
      + section('Full-width hero carousel',
        '<div class="card overflow-hidden">'
        + '  <div class="carousel" data-mount="carousel">'
        + '    <div class="carousel-track">'
        +        slides.map((p) =>
                  '<div class="carousel-slide" style="background-image:url(' + p.large + ')">'
                  + '  <div class="scrim"></div>'
                  + '  <div class="caption"><span class="pill" style="background:rgba(255,255,255,.2);color:#fff;border:0">' + p.tag + '</span>'
                  + '    <h3 class="mt-2">' + p.title + '</h3>'
                  + '    <p>Curated by VGF26 Studio · royalty-free photography from Pexels.</p>'
                  + '  </div>'
                  + '</div>'
                ).join('')
        + '    </div>'
        + '    <button class="carousel-nav prev">' + I('chevron-left') + '</button>'
        + '    <button class="carousel-nav next">' + I('chevron-right') + '</button>'
        + '    <div class="carousel-dots"></div>'
        + '  </div>'
        + '</div>')

      + section('Coverflow / card slider',
        '<div class="card overflow-hidden p-5">'
        + '  <div class="carousel" data-mount="carousel" style="aspect-ratio:auto;height:340px;border-radius:14px;background:rgb(var(--bg-soft))">'
        + '    <div class="carousel-track">'
        +        cards.map((p) =>
                  '<div class="carousel-slide" style="background:transparent;display:grid;place-items:center;padding:20px"><div class="card overflow-hidden" style="width:300px;max-width:90%">'
                  + '<div style="height:200px;background-image:url(' + p.thumb + ');background-size:cover;background-position:center"></div>'
                  + '<div class="card-pad"><h4 class="font-semibold">' + p.title + '</h4><div class="text-xs text-muted mt-1">' + p.tag + '</div></div>'
                  + '</div></div>'
                ).join('')
        + '    </div>'
        + '    <button class="carousel-nav prev">' + I('chevron-left') + '</button>'
        + '    <button class="carousel-nav next">' + I('chevron-right') + '</button>'
        + '    <div class="carousel-dots"></div>'
        + '  </div>'
        + '</div>')

      + section('Logo slider · infinite marquee',
        '<div class="card card-pad marquee"><div class="marquee-track">'
        + Array.from({length: 12}, (_, i) => '<div class="font-bold text-xl text-muted px-4 whitespace-nowrap">' + ['Mercatum', 'Ledger', 'Atlas', 'PaySec', 'Helix', 'QuantTrade', 'Iconos', 'ApexBank', 'Foundry', 'Praesidio', 'Natcusp', 'Nebula'][i] + '</div>').join('')
        + Array.from({length: 12}, (_, i) => '<div class="font-bold text-xl text-muted px-4 whitespace-nowrap">' + ['Mercatum', 'Ledger', 'Atlas', 'PaySec', 'Helix', 'QuantTrade', 'Iconos', 'ApexBank', 'Foundry', 'Praesidio', 'Natcusp', 'Nebula'][i] + '</div>').join('')
        + '</div></div>');
  }

  function viewImageZoom() {
    const photos = D().PEXELS;
    return pageHead('Image Zoom · Cropper · Compare',
        'Hover to zoom · drag the slider to compare · drag inside the crop to reposition.',
        [{title:'Media'}, {title:'Image tools'}])

      + section('Hover zoom',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
        + '  <div class="card card-pad"><h4 class="font-semibold mb-3 text-sm">Zoom on hover · #1</h4>'
        + '    <div class="zoom-host aspect-video"><img src="' + photos[0].large + '" alt="' + photos[0].title + '"></div>'
        + '    <div class="text-xs text-muted mt-2">' + photos[0].title + ' · ' + photos[0].tag + '</div>'
        + '  </div>'
        + '  <div class="card card-pad"><h4 class="font-semibold mb-3 text-sm">Zoom on hover · #2</h4>'
        + '    <div class="zoom-host aspect-video"><img src="' + photos[4].large + '" alt="' + photos[4].title + '"></div>'
        + '    <div class="text-xs text-muted mt-2">' + photos[4].title + ' · ' + photos[4].tag + '</div>'
        + '  </div>'
        + '</div>')

      + section('Before / after compare slider',
        '<div class="card card-pad"><div class="compare" data-mount="compare">'
        + '  <img src="' + photos[2].large + '" alt="After" style="filter:saturate(1.2) contrast(1.05)">'
        + '  <div class="clip"><img src="' + photos[2].large + '" alt="Before" style="filter:grayscale(.85) brightness(.9)"></div>'
        + '  <span class="compare-label" style="left:12px;">Before</span>'
        + '  <span class="compare-label" style="right:12px;">After</span>'
        + '  <div class="handle"></div>'
        + '</div><div class="text-xs text-muted mt-2 text-center">Drag the white handle or click anywhere to set the split.</div></div>')

      + section('Image cropper',
        '<div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">'
        + '  <div class="card card-pad"><h4 class="font-semibold mb-3 text-sm">Source image · drag corners (visual demo)</h4>'
        + '    <div class="relative aspect-video rounded-xl overflow-hidden bg-soft">'
        + '      <img src="' + photos[7].large + '" class="w-full h-full object-cover opacity-50">'
        + '      <div class="absolute" style="top:15%;left:20%;right:25%;bottom:15%;outline:2px dashed #fff;outline-offset:-1px;background-image:url(' + photos[7].large + ');background-size:200%;background-position:30% 40%;box-shadow:0 0 0 9999px rgba(0,0,0,.55)">'
        + '        <span class="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-sm border-2 border-[rgb(var(--iris))] cursor-nw-resize"></span>'
        + '        <span class="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-sm border-2 border-[rgb(var(--iris))] cursor-ne-resize"></span>'
        + '        <span class="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-sm border-2 border-[rgb(var(--iris))] cursor-sw-resize"></span>'
        + '        <span class="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-sm border-2 border-[rgb(var(--iris))] cursor-se-resize"></span>'
        + '      </div>'
        + '    </div>'
        + '  </div>'
        + '  <div class="card card-pad"><h4 class="font-semibold mb-3 text-sm">Preview · 1:1</h4>'
        + '    <div class="aspect-square rounded-xl overflow-hidden mb-3"><img src="' + photos[7].large + '" class="w-full h-full object-cover" style="object-position:30% 40%"></div>'
        + '    <label class="label">Aspect ratio</label>'
        + '    <select class="select mb-2"><option>Free</option><option>1:1</option><option>4:3</option><option>16:9</option></select>'
        + '    <button class="btn btn-primary w-full justify-center">' + I('download') + '<span>Export crop</span></button>'
        + '  </div>'
        + '</div>')

      + section('Image filters',
        '<div class="card card-pad"><div class="grid grid-cols-2 md:grid-cols-4 gap-3">'
        + [['Original',''],['B&W','filter:grayscale(1)'],['Vintage','filter:sepia(.6) contrast(1.1)'],['Cool','filter:hue-rotate(180deg) saturate(1.2)']].map(([t, css], i) =>
            '<div class="text-center"><div class="aspect-square rounded-xl overflow-hidden mb-2"><img src="' + photos[11].thumb + '" class="w-full h-full object-cover" style="' + css + '" alt=""></div><div class="text-xs font-semibold">' + t + '</div></div>'
          ).join('')
        + '</div></div>');
  }

  function viewMarquee() {
    return pageHead('Marquee · Logo slider · Ticker', 'Infinite horizontal scroll.', [{title:'Media'}, {title:'Marquee'}])
      + section('Horizontal marquee',
        '<div class="card card-pad marquee"><div class="marquee-track">'
        + Array.from({length: 20}, (_, i) => '<div class="flex items-center gap-2 px-3 whitespace-nowrap"><span class="pill pill-' + (['iris','fuchsia','emerald','amber','cyan'][i % 5]) + '">' + ['BTC','ETH','SOL','ADA','DOT'][i % 5] + '</span><span class="font-mono text-sm">$' + (67000 + i * 142).toLocaleString() + '</span></div>').join('')
        + Array.from({length: 20}, (_, i) => '<div class="flex items-center gap-2 px-3 whitespace-nowrap"><span class="pill pill-' + (['iris','fuchsia','emerald','amber','cyan'][i % 5]) + '">' + ['BTC','ETH','SOL','ADA','DOT'][i % 5] + '</span><span class="font-mono text-sm">$' + (67000 + i * 142).toLocaleString() + '</span></div>').join('')
        + '</div></div>');
  }

  function viewMediaPlayer() {
    return pageHead('Video / Audio Player', 'Custom HTML5 player UI with progress + controls.', [{title:'Media'}, {title:'Player'}])
      + section('Video player',
        '<div class="card overflow-hidden"><div class="aspect-video relative" style="background:linear-gradient(135deg,#1a063d,#5618b5)"><div class="absolute inset-0 grid place-items-center"><button class="grid place-items-center w-20 h-20 rounded-full text-white" style="background:rgba(255,255,255,.2);backdrop-filter:blur(10px)">' + I_('play', 32) + '</button></div></div>'
        + '<div class="p-4"><div class="h-1.5 rounded-full bg-soft mb-3"><div style="width:42%;height:100%;background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)))" class="rounded-full"></div></div>'
        + '<div class="flex items-center gap-3"><button class="tb-icon-btn">' + I('skip-back') + '</button><button class="tb-icon-btn" style="background:rgb(var(--iris));color:#fff;border-color:transparent">' + I('play') + '</button><button class="tb-icon-btn">' + I('skip-forward') + '</button><span class="text-xs text-muted font-mono">02:34 / 06:12</span><div class="flex-1"></div><button class="tb-icon-btn">' + I('volume') + '</button><button class="tb-icon-btn">' + I('expand') + '</button></div></div></div>')
      + section('Audio waveform',
        '<div class="card card-pad"><div class="flex items-center gap-3"><button class="grid place-items-center w-12 h-12 rounded-full text-white" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">' + I('play') + '</button>'
        + '<div class="flex-1 flex items-center gap-[2px] h-12">' + Array.from({length: 60}, (_, i) => '<div class="w-1 rounded-full" style="height:' + (10 + Math.abs(Math.sin(i * 0.3)) * 35) + 'px;background:linear-gradient(180deg,rgb(var(--iris)),rgb(var(--fuchsia)));opacity:' + (i < 20 ? 1 : 0.35) + '"></div>').join('') + '</div>'
        + '<span class="text-xs text-muted font-mono">01:24 / 03:42</span></div></div>');
  }

  function viewMaps() {
    return pageHead('Map · Heatmap', 'Geo visualisation (simplified SVG world map).', [{title:'Media'}, {title:'Maps'}])
      + section('World heat',
        '<div class="card card-pad"><div class="aspect-[2/1] rounded-xl relative overflow-hidden" style="background:linear-gradient(135deg,#1a063d,#421389)">'
        + '<svg viewBox="0 0 800 400" class="w-full h-full opacity-50"><circle cx="200" cy="160" r="60" fill="rgba(124,58,237,.6)"/><circle cx="380" cy="140" r="80" fill="rgba(216,70,239,.5)"/><circle cx="540" cy="180" r="50" fill="rgba(34,211,238,.6)"/><circle cx="640" cy="220" r="40" fill="rgba(16,185,129,.6)"/></svg>'
        + '<div class="absolute bottom-4 left-4 right-4 grid grid-cols-2 md:grid-cols-4 gap-2">' + [['🇺🇸 USA','42k'],['🇩🇪 DE','18k'],['🇦🇿 AZ','9k'],['🇯🇵 JP','8k']].map(([c,n]) => '<div class="bg-white/10 backdrop-blur-md rounded-lg p-2 text-white"><div class="text-xs opacity-70">' + c + '</div><div class="font-bold">' + n + '</div></div>').join('') + '</div>'
        + '</div></div>')
      + section('Calendar heatmap',
        '<div class="card card-pad"><div class="grid gap-[3px]" style="grid-template-columns:repeat(53,minmax(0,1fr))">'
        + Array.from({length: 7 * 53}, (_, i) => { const v = Math.random(); const c = v < 0.2 ? 'rgb(var(--line-soft))' : v < 0.4 ? 'rgb(var(--iris)/.3)' : v < 0.6 ? 'rgb(var(--iris)/.5)' : v < 0.8 ? 'rgb(var(--iris)/.75)' : 'rgb(var(--iris))'; return '<div class="aspect-square rounded-[2px]" style="background:' + c + '" title="' + Math.round(v * 12) + ' commits"></div>'; }).join('')
        + '</div><div class="flex justify-end items-center gap-2 mt-3 text-xs text-muted"><span>Less</span>' + ['.15','.3','.5','.75','1'].map(o => '<div class="w-3 h-3 rounded-[2px]" style="background:rgb(var(--iris)/' + o + ')"></div>').join('') + '<span>More</span></div></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * FORMS — pickers / upload / otp / editor / search / wizard
   * ──────────────────────────────────────────────────────────────── */
  function viewPickers() {
    return pageHead('Date · Time · Color pickers', 'Native inputs styled and a colour grid.', [{title:'Forms'}, {title:'Pickers'}])
      + section('Date & time',
        '<div class="card card-pad grid grid-cols-1 md:grid-cols-3 gap-4">'
        + '<div><label class="label">Date</label><input type="date" class="input"></div>'
        + '<div><label class="label">Time</label><input type="time" class="input"></div>'
        + '<div><label class="label">Date + time</label><input type="datetime-local" class="input"></div>'
        + '</div>')
      + section('Color picker',
        '<div class="card card-pad flex gap-4 items-center"><input type="color" value="#7c3aed" class="w-16 h-16 rounded-xl cursor-pointer border border-[rgb(var(--line))]">'
        + '<div class="flex flex-wrap gap-2">'
        + ['#7c3aed','#d846ef','#22d3ee','#10b981','#f59e0b','#f43f5e','#06b6d4','#84cc16','#6366f1','#ec4899'].map(c => '<button class="w-8 h-8 rounded-lg ring-2 ring-transparent hover:ring-[rgb(var(--iris))]" style="background:' + c + '"></button>').join('')
        + '</div></div>');
  }

  function viewUpload() {
    return pageHead('File upload · Drag & drop', 'HTML5 drag-drop with preview.', [{title:'Forms'}, {title:'Upload'}])
      + section('Drop zone',
        '<div class="card card-pad"><label class="block border-2 border-dashed border-[rgb(var(--line))] hover:border-[rgb(var(--iris))] rounded-xl p-10 text-center cursor-pointer transition-colors"><div class="text-iris mx-auto grid place-items-center w-14 h-14 rounded-xl mb-3" style="background:rgb(var(--iris)/.12)">' + I_('cloud-upload', 28) + '</div><div class="font-semibold">Drag & drop files here</div><div class="text-xs text-muted mt-1">or click to browse · max 10MB each</div><input type="file" multiple class="hidden"></label></div>')
      + section('Uploaded files',
        '<div class="card card-pad space-y-2">'
        + [['design-tokens.json', 24, 'completed'], ['screenshot.png', 1240, 'completed'], ['video-render.mp4', 8420, 'uploading']].map(([n, kb, st]) =>
            '<div class="flex items-center gap-3 p-3 bg-soft rounded-lg"><span class="text-iris">' + I('file') + '</span><div class="flex-1"><div class="text-sm font-medium">' + n + '</div><div class="text-xs text-muted">' + kb + ' KB</div>' + (st === 'uploading' ? '<div class="h-1 rounded-full bg-soft mt-2"><div class="h-full rounded-full" style="width:64%;background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)))"></div></div>' : '') + '</div>'
            + '<span class="pill pill-' + (st === 'completed' ? 'emerald' : 'amber') + '">' + st + '</span>'
            + '<button class="tb-icon-btn">' + I_('x', 14) + '</button></div>').join('')
        + '</div>');
  }

  function viewOTP() {
    return pageHead('OTP · PIN input', 'Per-digit boxes with auto-advance.', [{title:'Forms'}, {title:'OTP'}])
      + section('6-digit OTP',
        '<div class="card card-pad text-center"><h3 class="font-semibold mb-1">Verify your phone</h3><p class="text-sm text-muted mb-5">We sent a 6-digit code to +994 ****-**-12</p>'
        + '<div class="flex gap-2 justify-center" data-mount="otp">'
        + Array.from({length: 6}, (_, i) => '<input class="input text-center font-mono text-xl" maxlength="1" style="width:48px;height:56px;font-weight:600" data-otp="' + i + '"' + (i === 0 ? ' autofocus' : '') + '>').join('')
        + '</div><div class="mt-5 text-xs text-muted">Didn\'t receive a code? <a href="#" class="text-iris">Resend</a></div></div>');
  }

  function viewEditor() {
    return pageHead('Rich text · Markdown · Code editors', 'Toolbar, monospace gutter, syntax-style colours.', [{title:'Forms'}, {title:'Editor'}])
      + section('Rich text',
        '<div class="card overflow-hidden"><div class="card-head !p-2 flex gap-1 overflow-x-auto">'
        + ['Bold','Italic','Underline','|','H1','H2','|','• List','1. List','|','Link','Image','Quote','Code'].map(t => t === '|' ? '<div class="w-px bg-[rgb(var(--line))]"></div>' : '<button class="btn btn-ghost btn-xs">' + t + '</button>').join('')
        + '</div><div class="p-4 min-h-[160px]" contenteditable><h2 class="font-bold text-lg mb-2">Welcome to VGF26</h2><p class="text-sm">This is an editable region. Click to type, or use the toolbar above.</p></div></div>')
      + section('Markdown',
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">'
        + '<div class="card"><div class="card-head"><h3>Markdown</h3></div><textarea class="textarea border-0 rounded-none" style="min-height:200px;font-family:JetBrains Mono,monospace;font-size:13px"># Welcome\n\nThis is **bold** and this is _italic_.\n\n- Item 1\n- Item 2\n\n```js\nconst x = 42;\n```</textarea></div>'
        + '<div class="card"><div class="card-head"><h3>Preview</h3></div><div class="p-4 prose prose-sm max-w-none"><h1 class="font-bold text-xl mb-2">Welcome</h1><p>This is <strong>bold</strong> and this is <em>italic</em>.</p><ul class="list-disc pl-5"><li>Item 1</li><li>Item 2</li></ul><pre class="code-block">const x = 42;</pre></div></div>'
        + '</div>')
      + section('Code editor',
        '<div class="card overflow-hidden"><div class="card-head !p-2 flex justify-between"><div class="flex gap-1">' + ['app.js','icons.js','app.css'].map((f,i) => '<button class="btn btn-xs ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + '">' + f + '</button>').join('') + '</div><div class="flex gap-2 text-xs text-muted">' + I_('terminal',14) + 'JavaScript</div></div>'
        + '<div class="p-4 font-mono text-sm" style="background:rgb(var(--bg-soft))"><div class="flex"><div class="text-muted pr-4 text-right select-none">' + Array.from({length: 8}, (_, i) => (i+1)).join('<br>') + '</div><div class="flex-1"><div><span class="text-iris">import</span> { Icons } <span class="text-iris">from</span> <span class="text-emerald">"./icons"</span>;</div><div></div><div><span class="text-iris">export function</span> <span class="text-fuchsia-500">boot</span>() {</div><div>  <span class="text-cyan">const</span> el = document.getElementById(<span class="text-emerald">"app"</span>);</div><div>  el.innerHTML = Icons.get(<span class="text-emerald">"sparkles"</span>);</div><div>  <span class="text-iris">return</span> el;</div><div>}</div></div></div></div></div>');
  }

  function viewSearch() {
    return pageHead('Search · Filter · Autocomplete', 'Global search bar with suggestions.', [{title:'Forms'}, {title:'Search'}])
      + section('Search with suggestions',
        '<div class="card card-pad"><div class="relative max-w-xl"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">' + I('search') + '</span>'
        + '<input class="input" placeholder="Search products, customers, orders…" style="padding-left:40px"></div>'
        + '<div class="mt-3 max-w-xl bg-soft rounded-xl p-2 space-y-1">'
        + ['Iridescent Mesh Tee', 'Aurora Hoodie', 'Spectrum Sneakers', 'Sarah Jenkins (customer)', '#9822 (order)'].map(s => '<div class="p-2 rounded-lg hover:bg-[rgb(var(--iris-soft))] cursor-pointer flex items-center gap-3 text-sm"><span class="text-muted">' + I('arrow-right') + '</span><span class="flex-1">' + s + '</span><span class="pill pill-muted">jump</span></div>').join('')
        + '</div></div>')
      + section('Filter panel',
        '<div class="card card-pad"><div class="grid grid-cols-1 md:grid-cols-4 gap-3"><div><label class="label">Category</label><select class="select"><option>All</option><option>Apparel</option><option>Footwear</option></select></div><div><label class="label">Status</label><select class="select"><option>All</option><option>Active</option><option>Draft</option></select></div><div><label class="label">Min price</label><input class="input" type="number" placeholder="0"></div><div><label class="label">Max price</label><input class="input" type="number" placeholder="∞"></div></div>'
        + '<div class="flex gap-2 mt-4"><button class="btn btn-primary">Apply</button><button class="btn btn-ghost">Reset</button></div></div>');
  }

  function viewWizard() {
    return pageHead('Wizard · Stepper form', 'Multi-step flow with progress indicator.', [{title:'Forms'}, {title:'Wizard'}])
      + section('3-step onboarding',
        '<div class="card card-pad"><div class="flex items-center gap-2 mb-6">'
        + ['Profile','Workspace','Invite team'].map((s,i) => {
            const state = i === 0 ? 'done' : i === 1 ? 'current' : 'next';
            return '<div class="flex items-center gap-2 ' + (i < 2 ? 'flex-1' : '') + '"><div class="grid place-items-center w-9 h-9 rounded-full font-bold text-sm" style="background:' + (state === 'done' ? 'linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff' : state === 'current' ? 'rgb(var(--iris));color:#fff' : 'rgb(var(--line));color:rgb(var(--muted))') + '">' + (state === 'done' ? '✓' : (i+1)) + '</div><div><div class="text-xs ' + (state === 'next' ? 'text-muted' : 'font-semibold') + '">' + s + '</div></div>' + (i < 2 ? '<div class="flex-1 h-px bg-[rgb(var(--line))] ml-2"></div>' : '') + '</div>';
          }).join('')
        + '</div>'
        + '<h3 class="font-semibold mb-3">Set up your workspace</h3>'
        + '<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="label">Workspace name</label><input class="input" value="My studio"></div><div><label class="label">URL</label><div class="flex"><span class="input rounded-r-none flex items-center px-3 text-muted" style="height:40px;width:auto">vgf26.app/</span><input class="input rounded-l-none border-l-0" value="my-studio"></div></div></div>'
        + '<div class="flex justify-between mt-5 pt-4 border-t border-[rgb(var(--line))]"><button class="btn btn-secondary">' + I('chevron-left') + '<span>Back</span></button><button class="btn btn-primary">Continue<span>' + I('chevron-right') + '</span></button></div></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * NAVIGATION — menus, tabs, breadcrumb, stepper, bottom, fab
   * ──────────────────────────────────────────────────────────────── */
  function viewMenus() {
    function megaPanel(key, cols) {
      return '<div data-mega-panel="' + key + '" class="mega-panel is-hidden">'
        + '  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">'
        +    cols.map(([title, items]) => '<div><div class="text-[10.5px] uppercase tracking-wider text-muted font-bold mb-2">' + title + '</div><ul class="space-y-1">'
              + items.map(([t, d, ic, c]) => '<li><a href="#" class="flex gap-3 p-2 rounded-lg hover:bg-[rgb(var(--iris-soft))]"><span class="grid place-items-center w-8 h-8 rounded-lg shrink-0" style="background:rgb(var(--' + (c || 'iris') + ')/.14);color:rgb(var(--' + (c || 'iris') + '))">' + I_(ic, 14) + '</span><span><span class="block text-sm font-semibold">' + t + '</span><span class="block text-[11px] text-muted">' + d + '</span></span></a></li>').join('')
              + '</ul></div>').join('')
        + '  </div>'
        + '</div>';
    }

    return pageHead('Mega menu · Dropdown · Context',
        'Hover or click a trigger — mega panels animate in, click outside or ESC to close.',
        [{title:'Nav'}, {title:'Menus'}])

      + section('Mega menu',
        '<div class="card card-pad"><nav class="mega-host" data-mount="mega" style="position:relative;display:flex;gap:6px;align-items:center">'
        + '  <span class="font-bold mr-4" style="font-family:DM Sans;font-size:16px">VGF26</span>'
        +      ['products','solutions','resources'].map((k) => '<button data-mega-trigger="' + k + '" class="mega-trigger">' + (k.charAt(0).toUpperCase() + k.slice(1)) + ' ' + I_('chevron-down', 12) + '</button>').join('')
        + '  <a href="#" class="mega-trigger">Pricing</a>'
        + '  <a href="#" class="mega-trigger">Docs</a>'
        + '  <div class="ml-auto flex gap-2"><button class="btn btn-ghost btn-xs">Sign in</button><button class="btn btn-primary btn-xs">Get started</button></div>'
        +      megaPanel('products', [
                ['Build', [['Cards','20 card variants','card-stack','iris'],['Tables','Sortable + sticky','table','fuchsia'],['Charts','Inline SVG charts','chart-line','cyan']]],
                ['Compose', [['Forms','Inputs · pickers · editors','edit','emerald'],['Navigation','Tabs · menus · breadcrumb','menu','amber'],['Overlays','Modal · toast · popover','card-stack','rose']]],
                ['Polish', [['Effects','Glass · tilt · particles','sparkles','iris'],['Charts','Line · bar · radar','chart-pie','fuchsia'],['Icons','140+ stroke-only SVGs','box','cyan']]],
              ])
        +      megaPanel('solutions', [
                ['For Startups', [['Launch fast','Pre-built dashboards','rocket','iris'],['Iterate','Live theme generator','palette','fuchsia']]],
                ['For Enterprises', [['Scale','SSO + audit','shield','emerald'],['Govern','Role matrix','users','amber']]],
                ['For Agencies', [['Templates','Re-skin in minutes','sparkles-2','cyan'],['Brand','Multi-tenant theming','palette','rose']]],
              ])
        +      megaPanel('resources', [
                ['Learn', [['Documentation','Component recipes','file','iris'],['Changelog','What\'s new','history','fuchsia']]],
                ['Connect', [['GitHub','Source on GitHub','github','cyan'],['Community','Discord server','message-circle','emerald']]],
                ['Get help', [['Support','24/5 priority','help-circle','amber'],['Status','Uptime board','activity','rose']]],
              ])
        + '</nav></div>')

      + section('Dropdown · Context menu',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
        + '<div class="card card-pad"><h4 class="font-semibold mb-2 text-sm">Click to open</h4>'
        + '<div data-tab-set><button data-tab="open" class="btn btn-secondary">Options ' + I_('chevron-down', 14) + '</button>'
        + '<div data-tab-panel="open" class="is-active mt-2 inline-block w-56 bg-[rgb(var(--bg-card))] border border-[rgb(var(--line))] rounded-xl shadow-lg py-2">'
        + ['Edit', 'Duplicate', 'Archive', '|', 'Delete'].map(t => t === '|' ? '<div class="my-1 h-px bg-[rgb(var(--line))]"></div>' : '<div class="px-4 py-2 hover:bg-[rgb(var(--iris-soft))] cursor-pointer text-sm ' + (t === 'Delete' ? 'text-rose' : '') + '">' + t + '</div>').join('')
        + '</div></div></div>'

        + '<div class="card card-pad"><h4 class="font-semibold mb-2 text-sm">Right-click context (demo)</h4>'
        + '<div class="border-2 border-dashed border-[rgb(var(--line))] rounded-xl p-8 text-center text-muted text-sm">Right-click anywhere<br><span class="text-[11px]">(visual demo only)</span></div>'
        + '<div class="mt-3 w-56 bg-[rgb(var(--bg-card))] border border-[rgb(var(--line))] rounded-xl shadow-lg py-2">'
        + [['copy','Copy'],['scissors','Cut'],['clipboard','Paste'],['|',''],['edit','Rename'],['trash','Delete']].map(([ic, t]) => ic === '|' ? '<div class="my-1 h-px bg-[rgb(var(--line))]"></div>' : '<div class="px-4 py-2 hover:bg-[rgb(var(--iris-soft))] cursor-pointer text-sm flex items-center gap-2 ' + (t === 'Delete' ? 'text-rose' : '') + '">' + I_(ic === 'scissors' ? 'x' : ic === 'clipboard' ? 'file' : ic, 14) + t + '</div>').join('')
        + '</div></div>'
        + '</div>');
  }

  function viewTabs() {
    /* shared content payloads for each tab key */
    const payload = {
      overview: '<h4 class="font-semibold text-lg mb-2">Workspace overview</h4><p class="text-sm text-muted">Quick stats and recent activity across your team.</p><div class="grid grid-cols-3 gap-3 mt-4">' + ['Members','Projects','Storage'].map((t, i) => '<div class="bg-soft rounded-lg p-3"><div class="text-[10px] uppercase tracking-wider text-muted">' + t + '</div><div class="font-bold text-xl mt-1">' + [24, 8, '64GB'][i] + '</div></div>').join('') + '</div>',
      members:  '<h4 class="font-semibold text-lg mb-2">Members</h4><ul class="space-y-2">' + D().USERS.slice(0,5).map(u => '<li class="flex items-center gap-3 p-2 rounded-lg hover:bg-soft">' + D().avatarFor(u.name) + '<div class="flex-1"><div class="font-semibold text-sm">' + u.name + '</div><div class="text-xs text-muted">' + u.role + ' · ' + u.loc + '</div></div><span class="pill pill-' + (u.status === 'online' ? 'emerald' : u.status === 'busy' ? 'rose' : 'muted') + '">' + u.status + '</span></li>').join('') + '</ul>',
      settings: '<h4 class="font-semibold text-lg mb-2">Settings</h4><div class="space-y-3"><div class="flex items-center justify-between"><span class="text-sm">Enable two-factor auth</span><span class="switch is-on" data-toggle></span></div><div class="flex items-center justify-between"><span class="text-sm">Email notifications</span><span class="switch is-on" data-toggle></span></div><div class="flex items-center justify-between"><span class="text-sm">Public profile</span><span class="switch" data-toggle></span></div></div>',
      billing:  '<h4 class="font-semibold text-lg mb-2">Billing</h4><div class="bg-soft rounded-xl p-4"><div class="text-xs text-muted">Current plan</div><div class="font-bold text-2xl mt-1">Pro · $29/mo</div><div class="text-xs text-muted mt-1">Next invoice: 25 Jun 2026</div><button class="btn btn-primary mt-3 btn-xs">Manage subscription</button></div>',
    };

    function tabBtn(k, label, cls, activeKey) { return '<button data-tab="' + k + '" class="' + cls + (k === activeKey ? ' is-active' : '') + '">' + label + '</button>'; }
    function panel(k, body, activeKey) { return '<div data-tab-panel="' + k + '" class="' + (k === activeKey ? 'is-active' : '') + '">' + body + '</div>'; }

    return pageHead('Tabs · Vertical · Pills · Animated',
        'Every variant is fully interactive — click any tab to swap the content.',
        [{title:'Nav'}, {title:'Tabs'}])

      + section('Underline tabs',
        '<div class="card tab-set" data-tab-set>'
        + '  <div class="card-head !p-0 border-b border-[rgb(var(--line))] tab-underline"><div class="flex">'
        +      ['overview','members','settings','billing'].map((k) => tabBtn(k, k.charAt(0).toUpperCase() + k.slice(1), '', 'overview')).join('')
        + '  </div></div>'
        + '  <div class="card-pad">'
        +      ['overview','members','settings','billing'].map((k) => panel(k, payload[k], 'overview')).join('')
        + '  </div>'
        + '</div>')

      + section('Pill / segmented tabs',
        '<div class="card card-pad tab-set" data-tab-set>'
        + '  <div class="tab-pills">'
        +      ['day','week','month','year'].map((k) => tabBtn(k, k.charAt(0).toUpperCase() + k.slice(1), '', 'week')).join('')
        + '  </div>'
        + '  <div class="mt-4">'
        +      ['day','week','month','year'].map((k) => panel(k, '<div class="bg-soft rounded-xl p-4 text-sm">Showing <strong>' + k + '</strong> data — bar chart, summary, etc.</div>', 'week')).join('')
        + '  </div>'
        + '</div>')

      + section('Vertical tabs',
        '<div class="card overflow-hidden tab-set" data-tab-set>'
        + '  <div class="grid grid-cols-[200px_1fr]">'
        + '    <div class="bg-soft p-2 border-r border-[rgb(var(--line))] flex flex-col gap-1">'
        +        ['overview','members','settings','billing'].map((k) => tabBtn(k, k.charAt(0).toUpperCase() + k.slice(1), 'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[rgb(var(--bg-card))] data-[active=true]:bg-[rgb(var(--iris-soft))] data-[active=true]:text-iris [&.is-active]:bg-[rgb(var(--iris-soft))] [&.is-active]:text-iris [&.is-active]:font-semibold', 'overview')).join('')
        + '    </div>'
        + '    <div class="p-5">'
        +        ['overview','members','settings','billing'].map((k) => panel(k, payload[k], 'overview')).join('')
        + '    </div>'
        + '  </div>'
        + '</div>')

      + section('Icon tabs',
        '<div class="card tab-set" data-tab-set>'
        + '  <div class="card-head !p-0 border-b border-[rgb(var(--line))] tab-underline"><div class="flex">'
        +      [['overview','layout-dashboard'],['members','users'],['settings','settings'],['billing','credit-card']].map(([k,ic]) => '<button data-tab="' + k + '" class="' + (k === 'overview' ? 'is-active' : '') + '" style="padding:14px 18px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px"><span>' + I(ic) + '</span><span>' + k.charAt(0).toUpperCase() + k.slice(1) + '</span></button>').join('')
        + '  </div></div>'
        + '  <div class="card-pad">'
        +      ['overview','members','settings','billing'].map((k) => panel(k, payload[k], 'overview')).join('')
        + '  </div>'
        + '</div>');
  }

  function viewBreadcrumb() {
    return pageHead('Breadcrumb · 8 variants',
        'Slash, chevron, dot, pills, gradient, with icons, with dropdown, condensed.',
        [{title:'Nav'}, {title:'Breadcrumb'}])
      + section('Classic separators',
        '<div class="card card-pad space-y-5">'
        + '<div><div class="label">Slash separators</div><nav class="text-sm flex items-center gap-2"><a href="#" class="text-iris">Home</a><span class="text-muted">/</span><a href="#" class="text-iris">Library</a><span class="text-muted">/</span><a href="#" class="text-iris">Data</a><span class="text-muted">/</span><span>Customer.csv</span></nav></div>'
        + '<div><div class="label">Chevron separators</div><nav class="text-sm flex items-center gap-2"><a href="#" class="flex items-center gap-1 text-iris">' + I_('home', 14) + 'Home</a><span class="text-muted">' + I_('chevron-right', 14) + '</span><a href="#" class="text-iris">Projects</a><span class="text-muted">' + I_('chevron-right', 14) + '</span><span>VGF26</span></nav></div>'
        + '<div><div class="label">Dot separators</div><nav class="text-sm flex items-center gap-2"><a href="#" class="text-iris">Workspace</a><span class="text-muted text-xs">●</span><a href="#" class="text-iris">Team</a><span class="text-muted text-xs">●</span><span>Settings</span></nav></div>'
        + '<div><div class="label">Arrow separators</div><nav class="text-sm flex items-center gap-2 font-mono"><a href="#" class="text-iris">api</a><span class="text-muted">→</span><a href="#" class="text-iris">v1</a><span class="text-muted">→</span><a href="#" class="text-iris">users</a><span class="text-muted">→</span><span>42</span></nav></div>'
        + '</div>')

      + section('Styled crumbs',
        '<div class="card card-pad space-y-5">'
        + '<div><div class="label">Pill segments</div><nav class="text-sm flex items-center"><a href="#" class="px-3 py-1.5 rounded-l-lg bg-soft hover:bg-[rgb(var(--iris-soft))]">Dashboard</a><span class="text-muted px-1">›</span><a href="#" class="px-3 py-1.5 bg-soft hover:bg-[rgb(var(--iris-soft))]">Analytics</a><span class="text-muted px-1">›</span><span class="px-3 py-1.5 rounded-r-lg" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">Reports</span></nav></div>'
        + '<div><div class="label">With icons</div><nav class="text-sm flex items-center gap-2">' + [['home','Home','iris'],['folder','Documents','fuchsia'],['file','contract.pdf','muted']].map(([ic, l, c], i, arr) => '<a href="#" class="flex items-center gap-1.5 ' + (i === arr.length - 1 ? '' : 'text-iris') + '"><span class="text-' + c + '">' + I_(ic, 14) + '</span>' + l + '</a>' + (i < arr.length - 1 ? '<span class="text-muted">/</span>' : '')).join('') + '</nav></div>'
        + '<div><div class="label">Condensed (...)</div><nav class="text-sm flex items-center gap-2"><a href="#" class="text-iris">Home</a><span class="text-muted">/</span><button class="px-2 py-0.5 rounded bg-soft text-xs">…</button><span class="text-muted">/</span><a href="#" class="text-iris">Projects</a><span class="text-muted">/</span><span>VGF26</span></nav></div>'
        + '<div><div class="label">With dropdown</div><nav class="text-sm flex items-center gap-2"><a href="#" class="text-iris">Workspaces</a><span class="text-muted">/</span><button class="text-iris flex items-center gap-1">Studio ' + I_('chevron-down', 12) + '</button><span class="text-muted">/</span><span>Components</span></nav></div>'
        + '</div>');
  }

  function viewStepper() {
    function stateCls(i, cur) { return i < cur ? 'step-done' : i === cur ? 'step-current' : 'step-future'; }

    return pageHead('Stepper · 6 variants',
        'Horizontal · vertical · numbered · with icons · progress bar · circular.',
        [{title:'Nav'}, {title:'Stepper'}])

      + section('Horizontal numbered',
        '<div class="card card-pad"><div class="flex items-center">'
        + ['Account', 'Verify', 'Profile', 'Done'].map((s,i) =>
            '<div class="flex items-center ' + (i < 3 ? 'flex-1' : '') + '">'
            + '<div class="flex flex-col items-center gap-2 shrink-0"><div class="step-bullet ' + stateCls(i, 2) + '">' + (i < 2 ? '✓' : (i+1)) + '</div><div class="text-xs ' + (i > 2 ? 'text-muted' : 'font-semibold') + '">' + s + '</div></div>'
            + (i < 3 ? '<div class="step-line ' + (i < 2 ? 'is-done' : '') + ' mx-3"></div>' : '')
            + '</div>').join('')
        + '</div></div>')

      + section('Horizontal with icons',
        '<div class="card card-pad"><div class="flex items-center">'
        + [['user-plus','Create account'],['mail','Verify email'],['user','Profile setup'],['check-circle','All done']].map(([ic, s],i) =>
            '<div class="flex items-center ' + (i < 3 ? 'flex-1' : '') + '">'
            + '<div class="flex flex-col items-center gap-2 shrink-0"><div class="step-bullet ' + stateCls(i, 1) + '">' + I_(i < 1 ? 'check' : ic, 16) + '</div><div class="text-xs ' + (i > 1 ? 'text-muted' : 'font-semibold') + '">' + s + '</div></div>'
            + (i < 3 ? '<div class="step-line ' + (i < 1 ? 'is-done' : '') + ' mx-3"></div>' : '')
            + '</div>').join('')
        + '</div></div>')

      + section('Vertical (timeline-style)',
        '<div class="card card-pad max-w-md">'
        + [['Order placed','Order #9822 received','done'],['Processing','Picking & packing','done'],['Shipped','UPS tracking 1Z…','current'],['Delivered','Estimated 28 May','future']].map(([t, d, st],i,arr) =>
            '<div class="flex gap-4">'
            + '<div class="flex flex-col items-center"><div class="step-bullet ' + (st === 'done' ? 'step-done' : st === 'current' ? 'step-current' : 'step-future') + '">' + (st === 'done' ? '✓' : (i+1)) + '</div>' + (i < arr.length - 1 ? '<div class="step-vline ' + (st === 'done' ? 'is-done' : '') + ' min-h-[40px]"></div>' : '') + '</div>'
            + '<div class="pb-6 ' + (i === arr.length - 1 ? 'pb-0' : '') + '"><div class="font-semibold text-sm">' + t + '</div><div class="text-xs text-muted mt-1">' + d + '</div></div>'
            + '</div>').join('')
        + '</div>')

      + section('Progress bar stepper',
        '<div class="card card-pad">'
        + '<div class="flex justify-between mb-2 text-xs"><span class="font-semibold">Step 3 of 5</span><span class="text-muted">60% complete</span></div>'
        + '<div class="h-2 rounded-full bg-soft overflow-hidden"><div style="width:60%;height:100%;background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)))"></div></div>'
        + '<div class="flex justify-between mt-3 text-xs text-muted">' + ['Plan', 'Design', 'Build', 'Test', 'Ship'].map((s, i) => '<span class="' + (i <= 2 ? 'text-iris font-semibold' : '') + '">' + s + '</span>').join('') + '</div>'
        + '</div>')

      + section('Circular progress (single)',
        '<div class="card card-pad flex items-center gap-6 flex-wrap"><div class="relative w-24 h-24"><svg viewBox="0 0 96 96" class="-rotate-90 w-full h-full"><circle cx="48" cy="48" r="40" stroke="rgb(var(--line))" stroke-width="8" fill="none"/><circle cx="48" cy="48" r="40" stroke="url(#cp-grad)" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="100.5"/><defs><linearGradient id="cp-grad"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#d846ef"/></linearGradient></defs></svg><div class="absolute inset-0 grid place-items-center"><div class="text-center"><div class="font-bold text-lg">3/5</div><div class="text-[10px] text-muted">steps</div></div></div></div><div><div class="font-semibold">Onboarding</div><div class="text-sm text-muted mt-1">3 of 5 steps complete · est. 2 minutes left</div><button class="btn btn-primary btn-xs mt-3">Continue</button></div></div>')

      + section('Compact dots (mobile-style)',
        '<div class="card card-pad flex items-center justify-center gap-2">'
        + Array.from({length: 5}, (_, i) => '<span class="block rounded-full ' + (i < 2 ? 'w-2 h-2 bg-[rgb(var(--iris))]' : i === 2 ? 'w-6 h-2 bg-[rgb(var(--iris))]' : 'w-2 h-2 bg-[rgb(var(--line))]') + '"></span>').join('')
        + '<span class="ml-3 text-xs text-muted font-mono">3 / 5</span></div>');
  }

  function viewBottomNav() {
    return pageHead('Bottom · Top · Hamburger nav', 'Mobile navigation patterns.', [{title:'Nav'}, {title:'Bottom'}])
      + section('Bottom nav (mobile)',
        '<div class="card overflow-hidden" style="max-width:380px"><div class="aspect-[9/16] relative bg-soft"><div class="p-4 h-full"><div class="text-sm text-muted text-center mt-8">App content area</div></div>'
        + '<div class="absolute bottom-0 inset-x-0 bg-[rgb(var(--bg-card))] border-t border-[rgb(var(--line))] flex">' + [['Home','home',true],['Search','search'],['Inbox','message-circle'],['Profile','user']].map(([t,i,a]) => '<button class="flex-1 py-3 grid place-items-center ' + (a ? 'text-iris' : 'text-muted') + '"><span class="grid place-items-center mb-1">' + I_(i, 22) + '</span><span class="text-[10px]">' + t + '</span></button>').join('') + '</div></div></div>');
  }

  function viewFAB() {
    return pageHead('Floating Action Button', 'Primary action, anchored to a corner.', [{title:'Nav'}, {title:'FAB'}])
      + section('Single FAB',
        '<div class="card overflow-hidden relative h-72 bg-soft"><div class="absolute bottom-4 right-4"><button class="grid place-items-center w-14 h-14 rounded-full shadow-glow text-white" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">' + I_('plus', 22) + '</button></div></div>')
      + section('Speed dial',
        '<div class="card overflow-hidden relative h-72 bg-soft"><div class="absolute bottom-4 right-4 flex flex-col items-end gap-2">'
        + [['Add note','edit','iris'],['Upload','upload','cyan'],['Invite','user-plus','fuchsia']].map(([l,i,c]) => '<div class="flex items-center gap-2"><span class="bg-[rgb(var(--bg-card))] border border-[rgb(var(--line))] rounded-lg px-3 py-1 text-xs shadow-sm">' + l + '</span><button class="grid place-items-center w-10 h-10 rounded-full text-white shadow-md" style="background:rgb(var(--' + c + '))">' + I(i) + '</button></div>').join('')
        + '<button class="grid place-items-center w-14 h-14 rounded-full shadow-glow text-white" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)))">' + I_('plus', 22) + '</button>'
        + '</div></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * Overlays popovers / banner / states
   * ──────────────────────────────────────────────────────────────── */
  function viewPopovers() {
    return pageHead('Popover · Tooltip', 'Inline floating panels triggered by hover or click.', [{title:'Overlays'}, {title:'Popover'}])
      + section('Tooltips',
        '<div class="card card-pad flex flex-wrap gap-3">'
        + ['top','bottom','left','right'].map(pos => '<div class="relative group inline-block"><button class="btn btn-secondary">Hover (' + pos + ')</button><div class="absolute ' + (pos === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : pos === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : pos === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : 'left-full top-1/2 -translate-y-1/2 ml-2') + ' bg-[rgb(var(--ink))] text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Tooltip on ' + pos + '</div></div>').join('')
        + '</div>')
      + section('Popover with content',
        '<div class="card card-pad"><div class="relative inline-block group"><button class="btn btn-primary">Click for popover</button>'
        + '<div class="absolute top-full mt-2 left-0 w-72 bg-[rgb(var(--bg-card))] border border-[rgb(var(--line))] rounded-xl shadow-lg p-4 opacity-0 group-focus-within:opacity-100 transition-opacity"><h5 class="font-semibold">Popover title</h5><p class="text-xs text-muted mt-1">Popovers can host any content — text, forms, even charts.</p><div class="flex gap-2 mt-3"><button class="btn btn-xs btn-primary">Action</button><button class="btn btn-xs btn-ghost">Dismiss</button></div></div></div></div>');
  }

  function viewBanner() {
    return pageHead('Announcement banner', 'Top-of-page notification banners.', [{title:'Overlays'}, {title:'Banner'}])
      + '<div class="space-y-3">'
      + ['iris', 'emerald', 'amber', 'rose'].map(c => '<div class="card rounded-2xl px-4 py-3 flex items-center gap-3" style="background:linear-gradient(90deg,rgb(var(--' + c + ')/.15),rgb(var(--' + c + ')/.05));border-color:rgb(var(--' + c + ')/.3)"><div class="grid place-items-center w-8 h-8 rounded-full" style="background:rgb(var(--' + c + ')/.2);color:rgb(var(--' + c + '))">' + I('sparkles') + '</div><div class="flex-1 text-sm"><strong>VGF26 v1.2 is here!</strong> · 14 new components and 6 fresh dashboards.</div><a href="#" class="text-iris text-sm font-semibold">View →</a><button class="text-muted hover:text-ink">' + I_('x', 16) + '</button></div>').join('')
      + '</div>';
  }

  function viewStates() {
    return pageHead('Empty · Error · Success states', 'What to show when there\'s nothing — or something went wrong.', [{title:'Overlays'}, {title:'States'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      + [['empty','box','iris','No projects yet','Create your first project to start.','Create project'],['success','check-circle','emerald','All done!','Your changes have been saved successfully.','Continue'],['error','alert-circle','rose','Something went wrong','We couldn\'t reach the server. Try again.','Retry'],['offline','wifi','amber','You\'re offline','Some features may not be available.','Reconnect']].map(([k,icon,c,t,b,btn]) =>
        '<div class="card card-pad text-center py-10"><div class="mx-auto grid place-items-center w-16 h-16 rounded-2xl mb-3" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I_(icon, 28) + '</div><h3 class="font-bold text-lg">' + t + '</h3><p class="text-sm text-muted mt-2 max-w-xs mx-auto">' + b + '</p><button class="btn btn-primary mt-4">' + btn + '</button></div>').join('')
      + '</div>';
  }

  /* ────────────────────────────────────────────────────────────────
   * EFFECTS — glow / tilt / parallax / transitions / cursor / confetti
   * ──────────────────────────────────────────────────────────────── */
  function viewGlow() {
    return pageHead('Glow · Gradient border · Shadow', 'Surface treatments and highlights.', [{title:'Effects'}, {title:'Glow'}])
      + section('Glow on hover',
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'
        + ['iris', 'fuchsia', 'cyan'].map(c => '<div class="card card-pad text-center hover-lift" style="transition:box-shadow .3s" onmouseover="this.style.boxShadow=\'0 0 0 2px rgb(var(--' + c + ')/.4), 0 20px 40px -10px rgb(var(--' + c + ')/.4)\'" onmouseout="this.style.boxShadow=\'\'"><div class="grid place-items-center w-12 h-12 rounded-xl mx-auto mb-3" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I('sparkles') + '</div><h4 class="font-semibold">' + c + ' glow</h4></div>').join('')
        + '</div>')
      + section('Shadows depth scale',
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-4">'
        + [['sm','shadow-sm'],['md','shadow-md'],['lg','shadow-lg'],['glow','shadow-[var(--shadow-glow)]']].map(([t,c]) => '<div class="card card-pad text-center ' + c + '"><span class="text-sm font-mono">' + t + '</span></div>').join('')
        + '</div>');
  }

  function viewTilt() {
    return pageHead('Tilt · 3D Rotate · Hover Zoom', 'Mouse-tracking 3D card hover.', [{title:'Effects'}, {title:'Tilt'}])
      + section('Hover tilt',
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + Array.from({length: 3}, (_, i) => '<div class="tilt-card card card-pad text-center" style="background:linear-gradient(135deg,rgb(var(--' + ['iris','fuchsia','cyan'][i] + ')/.1),rgb(var(--bg-card)))"><div class="text-iris mb-2 grid place-items-center w-12 h-12 mx-auto rounded-xl" style="background:rgb(var(--iris)/.14)">' + I('sparkles-2') + '</div><h4 class="font-semibold">Tilt card ' + (i+1) + '</h4><p class="text-xs text-muted mt-1">Hover to see the 3D tilt.</p></div>').join('')
        + '</div>');
  }

  function viewParallax() {
    return pageHead('Parallax · Scroll reveal · Intersection', 'Scroll-triggered animations.', [{title:'Effects'}, {title:'Parallax'}])
      + section('Parallax hero',
        '<div class="card overflow-hidden relative h-72 grid place-items-center" style="background:radial-gradient(circle at center,#d846ef33,transparent 70%),linear-gradient(180deg,#1a063d,#5618b5)"><div class="aurora-blob aurora-blob--cyan" style="position:absolute;top:30%;left:50%;width:60%;height:80%;transform:translateX(-50%)"></div><div class="relative text-white text-center"><h3 style="font-family:DM Sans;font-size:36px;font-weight:700">Parallax aurora</h3><p class="mt-2 opacity-80">Scroll the page to see depth.</p></div></div>')
      + section('Scroll reveal cards',
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + Array.from({length: 3}, (_, i) => '<div class="card card-pad animate-fade-up" style="animation-delay:' + (i * 0.1) + 's"><h4 class="font-semibold">Reveal #' + (i+1) + '</h4><p class="text-xs text-muted mt-1">Cards fade and slide up as they appear.</p></div>').join('')
        + '</div>');
  }

  function viewTransitions() {
    return pageHead('Page · Route · Micro animations', 'Smooth transitions across every interaction.', [{title:'Effects'}, {title:'Transitions'}])
      + section('Hover micro-animations',
        '<div class="card card-pad flex flex-wrap gap-3">'
        + '<button class="btn btn-primary transition-transform active:scale-95">Press scale</button>'
        + '<button class="btn btn-secondary transition-all hover:translate-y-[-2px]">Hover lift</button>'
        + '<button class="btn btn-secondary transition-colors hover:bg-[rgb(var(--iris))] hover:text-white hover:border-transparent">Color shift</button>'
        + '<button class="btn btn-ghost group"><span class="transition-transform group-hover:rotate-180">' + I('refresh') + '</span><span>Rotate icon</span></button>'
        + '</div>');
  }

  function viewCursor() {
    return pageHead('Cursor trail · Magnetic button', 'Mouse-following effects (simplified demos).', [{title:'Effects'}, {title:'Cursor'}])
      + section('Magnetic button',
        '<div class="card card-pad py-12 grid place-items-center"><button class="btn btn-primary text-lg px-8 py-4 transition-transform">Hover near me</button></div>');
  }

  function viewConfetti() {
    return pageHead('Confetti · Fireworks · Floating', 'Celebration animations.', [{title:'Effects'}, {title:'Confetti'}])
      + section('Trigger confetti',
        '<div class="card card-pad text-center py-10" data-mount="confetti"><div class="text-iris mx-auto grid place-items-center w-16 h-16 rounded-2xl mb-3" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">' + I_('star', 28) + '</div><h3 class="font-bold text-lg">Celebrate the moment</h3><p class="text-sm text-muted mt-2">Confetti animations are great for completion screens.</p><button class="btn btn-primary mt-4" data-act="confetti">🎉 Fire confetti</button></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * CHARTS — scatter, sparkline, candle, heatmap
   * ──────────────────────────────────────────────────────────────── */
  function viewScatter() {
    return pageHead('Scatter · Bubble · Tree map', 'Non-time-series visualisations.', [{title:'Charts'}, {title:'Scatter'}])
      + section('Scatter plot',
        '<div class="card"><div class="card-head"><h3>Customer satisfaction vs revenue</h3></div>'
        + '<svg viewBox="0 0 600 280" class="w-full p-4">'
        + Array.from({length: 24}, () => { const x = 40 + Math.random() * 540, y = 30 + Math.random() * 220, r = 5 + Math.random() * 15; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(124, 58, 237, .35)" stroke="#7c3aed"/>'; }).join('')
        + '<line x1="40" y1="250" x2="580" y2="250" stroke="rgb(var(--line))"/><line x1="40" y1="30" x2="40" y2="250" stroke="rgb(var(--line))"/>'
        + '</svg></div>');
  }

  function viewSparkline() {
    return pageHead('Sparklines · Gauges', 'Tiny trend charts and dial gauges.', [{title:'Charts'}, {title:'Sparklines'}])
      + section('Sparklines in stat tiles',
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-4">'
        + Array.from({length: 4}, (_, i) => {
            const c = ['iris','fuchsia','emerald','amber'][i];
            const data = Array.from({length: 20}, () => Math.random() * 30 + 5);
            const max = Math.max(...data);
            const points = data.map((v, j) => (j * 8) + ',' + (40 - (v / max) * 35)).join(' ');
            return '<div class="card card-pad"><div class="text-[11px] uppercase tracking-wider text-muted">Sparkline ' + (i+1) + '</div><div class="font-bold text-2xl mt-1" style="font-family:DM Sans">' + (1240 + i * 824) + '</div><svg width="160" height="40" viewBox="0 0 160 40" class="mt-2"><polyline points="' + points + '" stroke="rgb(var(--' + c + '))" stroke-width="2" fill="none"/></svg></div>';
          }).join('')
        + '</div>')
      + section('Gauges',
        '<div class="card card-pad flex gap-8 flex-wrap justify-center">'
        + [62, 88, 34].map(p => {
            const c = 2 * Math.PI * 36;
            return '<div class="text-center"><svg width="120" height="120" viewBox="0 0 96 96" class="-rotate-90"><circle cx="48" cy="48" r="36" stroke="rgb(var(--line))" stroke-width="10" fill="none"/><circle cx="48" cy="48" r="36" stroke="url(#g-' + p + ')" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c - c * p / 100) + '"/><defs><linearGradient id="g-' + p + '"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#d846ef"/></linearGradient></defs></svg><div class="font-mono font-bold text-2xl">' + p + '<span class="text-sm text-muted">%</span></div></div>';
          }).join('')
        + '</div>');
  }

  function viewCandle() {
    return pageHead('Candlestick · OHLC', 'Trading charts.', [{title:'Charts'}, {title:'Candle'}])
      + section('OHLC chart',
        '<div class="card"><div class="card-head"><h3>BTC / USD · 1h</h3></div><div class="p-4">'
        + '<svg viewBox="0 0 700 240" class="w-full h-60">'
        + Array.from({length: 35}, (_, i) => { const x = 20 + i * 18; const c1 = 50 + Math.random() * 100; const c2 = 50 + Math.random() * 100; const o = Math.min(c1, c2); const h = o - 10 - Math.random() * 20; const l = Math.max(c1, c2) + 10 + Math.random() * 20; const up = c2 > c1; return '<line x1="' + (x + 6) + '" x2="' + (x + 6) + '" y1="' + h + '" y2="' + l + '" stroke="' + (up ? '#10b981' : '#f43f5e') + '"/><rect x="' + x + '" y="' + Math.min(c1, c2) + '" width="12" height="' + Math.abs(c2 - c1) + '" fill="' + (up ? '#10b981' : '#f43f5e') + '"/>'; }).join('')
        + '</svg>'
        + '</div></div>');
  }

  function viewHeatmap() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dow    = ['Mon','','Wed','','Fri','',''];
    /* Generate the heatmap cells with tooltip data. */
    const cells = Array.from({length: 7 * 53}, (_, idx) => {
      const week = Math.floor(idx / 7), day = idx % 7;
      const v = Math.max(0, Math.round((Math.random() * Math.random()) * 14));
      const lvl = v === 0 ? 0 : v <= 2 ? 1 : v <= 5 ? 2 : v <= 9 ? 3 : 4;
      const date = new Date(2026, 0, 1 + (week * 7) + day);
      const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      return '<div class="cal-cell gh-l' + lvl + '" data-v="' + v + '" data-l="' + label + '" style="aspect-ratio:1;border-radius:3px"></div>';
    });
    return pageHead('Heatmap · Calendar matrix',
        'Density across the 365-day grid — hover any cell for the daily total.',
        [{title:'Charts'}, {title:'Heatmap'}])
      + section('Activity heatmap — 2026',
        '<div class="card card-pad chart-host" data-chart="cal-heatmap">'
        + '  <div class="flex justify-between items-center mb-3"><h4 class="font-semibold text-sm">1,284 contributions</h4>'
        + '    <div class="flex items-center gap-2 text-[11px] text-muted"><span>Less</span>'
        + ['gh-l0','gh-l1','gh-l2','gh-l3','gh-l4'].map(c => '<div class="' + c + '" style="width:11px;height:11px;border-radius:3px"></div>').join('')
        + '      <span>More</span></div></div>'
        + '  <div class="cal-heat">'
        + '    <div class="dow">' + dow.map(d => '<div>' + d + '</div>').join('') + '</div>'
        + '    <div class="body">'
        + '      <div class="months">' + months.map(m => '<div>' + m + '</div>').join('') + '</div>'
        + '      <div class="gh-grid" style="grid-auto-flow:column;grid-template-columns:repeat(53,minmax(0,1fr));grid-template-rows:repeat(7,minmax(0,1fr))">'
        +          cells.join('')
        + '      </div>'
        + '    </div>'
        + '  </div>'
        + '</div>')
      + section('Hourly distribution',
        '<div class="card card-pad chart-host" data-chart="hour-heat">'
        + '  <div class="grid" style="grid-template-columns:80px repeat(24,minmax(0,1fr));gap:3px;font-size:10px;color:rgb(var(--muted))">'
        + '    <div></div>' + Array.from({length:24}, (_,h) => '<div class="text-center">' + (h%4===0?h:'') + '</div>').join('')
        +      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => '<div class="flex items-center">' + d + '</div>' + Array.from({length:24}, (_,h) => { const v = Math.round(Math.random() * 12); const lvl = v === 0 ? 0 : v <= 2 ? 1 : v <= 5 ? 2 : v <= 8 ? 3 : 4; return '<div class="cal-cell gh-l' + lvl + '" data-v="' + v + '" data-l="' + d + ' · ' + String(h).padStart(2,'0') + ':00" style="aspect-ratio:1;border-radius:3px"></div>'; }).join('')).join('')
        + '  </div>'
        + '</div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * COMMERCE — storefront / cart / checkout / compare / billing
   * ──────────────────────────────────────────────────────────────── */
  function viewStorefront() {
    return pageHead('Marketplace storefront', 'Product catalogue with filters.', [{title:'Commerce'}, {title:'Storefront'}])
      + '<div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">'
      + '<aside class="card card-pad"><h4 class="font-semibold mb-3">Filters</h4>'
      + '<div class="space-y-3 text-sm"><div><label class="label">Category</label><select class="select"><option>All</option><option>Apparel</option><option>Footwear</option><option>Accessory</option></select></div><div><label class="label">Price</label><input type="range" min="0" max="500" class="w-full accent-[rgb(var(--iris))]"></div><div><label class="label">In stock only</label><span class="switch is-on" data-toggle></span></div></div></aside>'
      + '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">'
      + D().PRODUCTS.map((p, i) => '<div class="card overflow-hidden hover-lift"><div class="aspect-square relative" style="background:linear-gradient(135deg,' + ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef','#10b981,#06b6d4'][i % 4] + ')"><span class="absolute top-2 right-2 pill pill-iris" style="background:rgba(255,255,255,.2);color:#fff;border:0">$' + p.price + '</span></div><div class="p-3"><div class="font-semibold text-sm truncate">' + p.name + '</div><div class="text-xs text-muted">' + p.cat + '</div><button class="btn btn-primary btn-xs w-full justify-center mt-2">Add to cart</button></div></div>').join('')
      + '</div></div>';
  }

  function viewCart() {
    return pageHead('Shopping cart · Wishlist', 'Cart line items + totals.', [{title:'Commerce'}, {title:'Cart'}])
      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + '<div class="card lg:col-span-2"><div class="card-head"><h3>Your cart (3)</h3></div><div class="divide-y divide-[rgb(var(--line-soft))]">'
      + D().PRODUCTS.slice(0, 3).map((p, i) => '<div class="flex items-center gap-4 p-4"><div class="w-16 h-16 rounded-lg flex-shrink-0" style="background:linear-gradient(135deg,' + ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef'][i] + ')"></div><div class="flex-1"><div class="font-semibold">' + p.name + '</div><div class="text-xs text-muted">' + p.sku + '</div></div><div class="flex items-center gap-2"><button class="tb-icon-btn w-7 h-7">' + I_('minus', 12) + '</button><span class="font-mono">1</span><button class="tb-icon-btn w-7 h-7">' + I_('plus', 12) + '</button></div><div class="font-mono font-bold w-20 text-right">$' + p.price + '</div><button class="text-rose hover:bg-[rgb(var(--rose)/.1)] p-2 rounded-lg">' + I('trash') + '</button></div>').join('')
      + '</div></div>'
      + '<div class="card card-pad h-fit"><h4 class="font-semibold mb-3">Order summary</h4><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-muted">Subtotal</span><span class="font-mono">$297.00</span></div><div class="flex justify-between"><span class="text-muted">Shipping</span><span class="font-mono">$12.00</span></div><div class="flex justify-between"><span class="text-muted">Tax</span><span class="font-mono">$24.72</span></div><div class="divider-h"></div><div class="flex justify-between font-bold text-base"><span>Total</span><span class="font-mono">$333.72</span></div></div><button class="btn btn-primary w-full justify-center mt-4">Checkout</button></div>'
      + '</div>';
  }

  function viewCheckout() {
    return pageHead('Multi-step checkout', 'Shipping → payment → review.', [{title:'Commerce'}, {title:'Checkout'}])
      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + '<div class="card lg:col-span-2"><div class="card-head"><h3>Shipping address</h3></div>'
      + '<div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="label">First name</label><input class="input" value="Vugar"></div><div><label class="label">Last name</label><input class="input" value="Familoglu"></div><div class="md:col-span-2"><label class="label">Address</label><input class="input" value="Nizami St. 96"></div><div><label class="label">City</label><input class="input" value="Baku"></div><div><label class="label">Postal code</label><input class="input" value="AZ1000"></div></div>'
      + '<div class="p-4 border-t border-[rgb(var(--line))] flex justify-between"><button class="btn btn-secondary">Back to cart</button><button class="btn btn-primary">Continue to payment</button></div></div>'
      + '<div class="card card-pad h-fit"><h4 class="font-semibold mb-3">Order summary</h4><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-muted">3 items</span><span class="font-mono">$297.00</span></div><div class="flex justify-between"><span class="text-muted">Shipping</span><span class="font-mono">$12.00</span></div><div class="divider-h"></div><div class="flex justify-between font-bold text-base"><span>Total</span><span class="font-mono">$333.72</span></div></div></div>'
      + '</div>';
  }

  function viewCompare() {
    return pageHead('Product comparison · Quick view', 'Side-by-side feature matrix.', [{title:'Commerce'}, {title:'Compare'}])
      + '<div class="card overflow-x-auto"><table class="t-table">'
      + '<thead><tr><th></th>' + D().PRODUCTS.slice(0,3).map(p => '<th class="text-center">' + p.name + '</th>').join('') + '</tr></thead>'
      + '<tbody>'
      + [['Price', '$49', '$89', '$159'], ['Category', 'Apparel', 'Apparel', 'Footwear'], ['Stock', '142', '87', '41'], ['Rating', '★★★★★', '★★★★☆', '★★★★★'], ['Free shipping', '✓', '✓', '—']].map(([k, ...v]) => '<tr><td><strong>' + k + '</strong></td>' + v.map(x => '<td class="text-center font-mono">' + x + '</td>').join('') + '</tr>').join('')
      + '</tbody></table></div>';
  }

  function viewBilling() {
    return pageHead('Billing · Subscription · API keys', 'Manage plan, payment, and integration secrets.', [{title:'Commerce'}, {title:'Billing'}])
      + section('Current plan',
        '<div class="card card-pad flex flex-wrap gap-4 items-center justify-between"><div><div class="text-xs text-muted">Current plan</div><div class="font-bold text-2xl mt-1" style="font-family:DM Sans">Pro · <span class="text-iris">$29/mo</span></div><div class="text-xs text-muted mt-1">Renews on May 25, 2027</div></div><div class="flex gap-2"><button class="btn btn-secondary">Change plan</button><button class="btn btn-danger">Cancel</button></div></div>')
      + section('Payment methods',
        '<div class="card divide-y divide-[rgb(var(--line-soft))]">'
        + [['Visa •••• 4242', 'Expires 12/27', 'default'],['Mastercard •••• 8819', 'Expires 03/26', '']].map(([n,e,d]) => '<div class="p-4 flex items-center gap-3"><span class="text-iris">' + I('credit-card') + '</span><div class="flex-1"><div class="font-medium">' + n + '</div><div class="text-xs text-muted">' + e + '</div></div>' + (d ? '<span class="pill pill-iris">' + d + '</span>' : '') + '<button class="btn btn-ghost btn-xs">Edit</button></div>').join('')
        + '</div>')
      + section('API keys',
        '<div class="card overflow-hidden"><div class="card-head"><h3>Keys</h3><button class="btn btn-primary btn-xs">' + I_('plus',14) + 'New key</button></div>'
        + '<table class="t-table"><thead><tr><th>Name</th><th>Key</th><th>Created</th><th></th></tr></thead><tbody>'
        + [['Production','sk_live_••••••••42','2 days ago'],['Staging','sk_test_••••••••91','12 days ago']].map(([n,k,d]) => '<tr><td><strong>' + n + '</strong></td><td class="font-mono text-xs">' + k + '</td><td class="text-muted">' + d + '</td><td class="text-right"><button class="btn btn-ghost btn-xs">Copy</button> <button class="btn btn-danger btn-xs">Revoke</button></td></tr>').join('')
        + '</tbody></table></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * LANDING — hero, features, faq, testimonials, contact, navbar-footer
   * ──────────────────────────────────────────────────────────────── */
  function viewHero() {
    return pageHead('Hero · CTA sections', 'Top-of-page heroes that convert.', [{title:'Landing'}, {title:'Hero'}])
      + section('Gradient hero',
        '<div class="card overflow-hidden relative" style="background:linear-gradient(135deg,#5618b5,#7c3aed,#d846ef,#06b6d4);background-size:200% 200%;animation:aurora-pan 12s ease-in-out infinite"><div class="relative p-12 md:p-20 text-white text-center"><span class="pill" style="background:rgba(255,255,255,.2);color:#fff;border:0">✨ NEW · v1.2</span><h1 style="font-family:DM Sans;font-size:48px;font-weight:700;line-height:1.1" class="mt-4">Build admin panels<br>at the speed of light.</h1><p class="mt-4 max-w-xl mx-auto opacity-90">220+ components, 3 languages, zero npm install.</p><div class="mt-6 flex gap-3 justify-center"><button class="btn btn-lg" style="background:#fff;color:#7c3aed">Start free</button><button class="btn btn-lg" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)">Watch demo</button></div></div></div>')
      + section('Split hero with image',
        '<div class="card overflow-hidden grid md:grid-cols-2"><div class="p-8 md:p-12 flex flex-col justify-center"><span class="pill pill-iris">PRODUCTIVITY</span><h2 style="font-family:DM Sans;font-size:32px;font-weight:700;line-height:1.1" class="mt-3">Ship 10x faster with VGF26.</h2><p class="text-sm text-muted mt-3">A complete admin template that just works — light, dark, multi-lingual, accessible.</p><div class="mt-5 flex gap-2"><button class="btn btn-primary">Get started →</button><button class="btn btn-secondary">Documentation</button></div></div><div class="min-h-[300px]" style="background:linear-gradient(135deg,#7c3aed,#d846ef)"></div></div>');
  }

  function viewFeatures() {
    return pageHead('Features · About sections', 'Marketing feature grids.', [{title:'Landing'}, {title:'Features'}])
      + section('Feature grid',
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + [['Zero build','rocket','iris','Open index.html — done. No npm install, no bundler.'],['Multi-language','languages','fuchsia','AZ, EN, RU built in. Switch on the fly.'],['Dark mode','moon','cyan','Polished light & dark themes with no flash on load.'],['SVG icons','sparkles','emerald','140+ icons, function-call API, copy-paste ready.'],['Charts','chart-line','amber','Inline SVG line, bar, pie, radar — no library needed.'],['Modal portal','card-stack','rose','Replaces native confirm/prompt with proper dialogs.']].map(([t,i,c,d]) =>
          '<div class="card card-pad hover-lift"><div class="grid place-items-center w-12 h-12 rounded-xl mb-3" style="background:rgb(var(--' + c + ')/.14);color:rgb(var(--' + c + '))">' + I(i) + '</div><h4 class="font-semibold">' + t + '</h4><p class="text-xs text-muted mt-1">' + d + '</p></div>').join('')
        + '</div>');
  }

  function viewFAQ() {
    return pageHead('FAQ accordion', 'Common questions in a collapsible list.', [{title:'Landing'}, {title:'FAQ'}])
      + section('FAQ',
        '<div class="card divide-y divide-[rgb(var(--line-soft))]">'
        + [['Is VGF26 really free?','Yes — MIT licensed. Use it in personal or commercial projects.'],['Do I need a framework?','No. Plain HTML, TailwindCSS Play CDN, and vanilla JS. Open index.html.'],['Can I customize the theme?','Yes — edit the CSS tokens in assets/css/app.css or use the live theme generator.'],['Are the icons production-ready?','Yes — 140+ stroke-only SVG icons that render at any size.'],['How do I add a new language?','Add an entry to STR in assets/js/i18n.js and call I18n.setLang(\'xx\').'],['Does it work offline?','Yes after first load — Tailwind CSS and fonts cache automatically.']].map(([q,a],i) =>
          '<details ' + (i === 0 ? 'open' : '') + ' class="group"><summary class="p-4 cursor-pointer list-none flex justify-between items-center font-semibold"><span>' + q + '</span><span class="text-iris transition-transform group-open:rotate-180">' + I_('chevron-down', 18) + '</span></summary><div class="px-4 pb-4 text-sm text-muted">' + a + '</div></details>').join('')
        + '</div>');
  }

  function viewTestimonials() {
    return pageHead('Testimonials section', 'Social proof with avatar + quote cards.', [{title:'Landing'}, {title:'Testimonials'}])
      + section('Wall of love',
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
        + Array.from({length: 6}, (_, i) => {
          const quotes = ["VGF26 saved us 3 weeks of design work.","Finally a dark mode that doesn't look bolted-on.","The gradient borders alone are worth it.","Best admin template I've used. Period.","Open source done right.","Iridescent UI feels like the future."];
          return '<div class="card card-pad"><div class="flex gap-1 text-amber">★★★★★</div><p class="mt-2 text-sm leading-relaxed">"' + quotes[i] + '"</p><div class="flex items-center gap-3 mt-4 pt-3 border-t border-[rgb(var(--line))]">' + D().avatarFor(D().USERS[i].name) + '<div><div class="font-semibold text-sm">' + D().USERS[i].name + '</div><div class="text-xs text-muted">' + D().USERS[i].role + '</div></div></div></div>';
        }).join('')
        + '</div>');
  }

  function viewContact() {
    return pageHead('Contact · Newsletter', 'Get in touch + email capture.', [{title:'Landing'}, {title:'Contact'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
      + '<div class="card card-pad"><h3 class="font-semibold text-lg mb-3">Contact us</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="label">Name</label><input class="input" placeholder="Your name"></div><div><label class="label">Email</label><input class="input" type="email" placeholder="you@vgf26.io"></div><div class="md:col-span-2"><label class="label">Message</label><textarea class="textarea" placeholder="What can we help with?"></textarea></div></div><button class="btn btn-primary mt-4">' + I('send') + '<span>Send</span></button></div>'
      + '<div class="card card-pad" style="background:linear-gradient(135deg,rgb(var(--iris)/.08),rgb(var(--fuchsia)/.08))"><div class="text-iris mb-2">' + I_('mail', 28) + '</div><h3 class="font-semibold text-lg">Get product updates</h3><p class="text-sm text-muted mt-1">One email per week — release notes and new components.</p><div class="flex gap-2 mt-4"><input class="input" placeholder="you@email.com"><button class="btn btn-primary">Subscribe</button></div><p class="text-[11px] text-muted mt-3">No spam. Unsubscribe anytime.</p></div>'
      + '</div>';
  }

  function viewNavbarFooter() {
    return pageHead('Navbar · Footer · Sticky bar',
        '4 navbar styles · 3 footer styles · 4 sticky bar variants — drop-in patterns.',
        [{title:'Landing'}, {title:'Chrome'}])

      /* ── Navbars ───────────────────────────────────────────── */
      + section('1. Standard navbar with auth buttons',
        '<div class="card overflow-hidden"><nav class="flex items-center justify-between p-4">'
        + '<div class="flex items-center gap-2 font-bold" style="font-family:DM Sans;font-size:18px">' + I_('sparkles', 22, 'text-iris') + '<span>VGF26</span></div>'
        + '<div class="hidden md:flex items-center gap-6 text-sm">' + ['Products', 'Solutions', 'Pricing', 'Docs'].map(t => '<a href="#" class="hover:text-iris">' + t + '</a>').join('') + '</div>'
        + '<div class="flex gap-2"><button class="btn btn-ghost btn-xs">Sign in</button><button class="btn btn-primary btn-xs">Get started</button></div>'
        + '</nav></div>')

      + section('2. Centered navbar with split logo',
        '<div class="card overflow-hidden"><nav class="grid grid-cols-3 items-center p-4">'
        + '<div class="flex gap-4 text-sm">' + ['Shop', 'Stories', 'Atelier'].map(t => '<a href="#" class="hover:text-iris">' + t + '</a>').join('') + '</div>'
        + '<div class="text-center font-bold" style="font-family:DM Sans;font-size:22px;letter-spacing:.04em">VGF26</div>'
        + '<div class="flex gap-3 justify-end items-center text-sm"><button class="tb-icon-btn">' + I('search') + '</button><button class="tb-icon-btn">' + I('user') + '</button><button class="tb-icon-btn">' + I('cart') + '<span class="badge">3</span></button></div>'
        + '</nav></div>')

      + section('3. Dark gradient navbar with mega menu',
        '<div class="card overflow-hidden" style="background:linear-gradient(135deg,#1a063d,#421389);color:#fff">'
        + '<nav class="flex items-center justify-between p-4 backdrop-blur"><div class="flex items-center gap-6">'
        + '<div class="flex items-center gap-2 font-bold" style="font-family:DM Sans;font-size:18px">' + I_('sparkles', 22) + '<span>VGF26</span></div>'
        + '<div class="hidden md:flex items-center gap-1 text-sm">' + ['Products ▾', 'Pricing', 'Customers', 'Resources ▾'].map(t => '<a href="#" class="px-3 py-2 rounded-lg hover:bg-white/10">' + t + '</a>').join('') + '</div>'
        + '</div>'
        + '<div class="flex gap-2"><button class="btn" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.18)">Log in</button><button class="btn" style="background:#fff;color:rgb(var(--iris))">Try free</button></div>'
        + '</nav></div>')

      + section('4. Transparent navbar over hero',
        '<div class="card overflow-hidden relative" style="background-image:url(' + D().PEXELS[14].large + ');background-size:cover;background-position:center;min-height:240px">'
        + '<div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(0,0,0,.5),transparent)"></div>'
        + '<nav class="relative flex items-center justify-between p-5 text-white">'
        + '<div class="flex items-center gap-2 font-bold" style="font-family:DM Sans;font-size:18px">' + I_('sparkles', 22) + '<span>VGF26</span></div>'
        + '<div class="hidden md:flex items-center gap-6 text-sm">' + ['Home', 'Tours', 'Stays', 'Contact'].map(t => '<a href="#" class="hover:opacity-80">' + t + '</a>').join('') + '</div>'
        + '<button class="btn" style="background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px)">Book now →</button>'
        + '</nav>'
        + '<div class="relative px-5 pb-6 pt-12 text-white"><div style="font-family:DM Sans;font-size:32px;font-weight:700">Discover the mountain road</div><div class="text-sm opacity-80 mt-1">Curated travel · handpicked routes</div></div>'
        + '</div>')

      /* ── Footers ───────────────────────────────────────────── */
      + section('5. Mega footer (4 columns + newsletter)',
        '<div class="card card-pad">'
        + '<div class="grid grid-cols-2 md:grid-cols-6 gap-8">'
        + '<div class="col-span-2 md:col-span-2"><div class="flex items-center gap-2 font-bold mb-2" style="font-family:DM Sans">' + I_('sparkles', 22, 'text-iris') + '<span class="text-lg">VGF26</span></div>'
        + '  <p class="text-sm text-muted">The iridescent admin studio — 220+ components, 3 languages, zero build.</p>'
        + '  <div class="flex gap-2 mt-4">' + ['github','message-circle','mail','globe'].map(i => '<button class="tb-icon-btn">' + I(i) + '</button>').join('') + '</div>'
        + '</div>'
        + [['Product',['Features','Pricing','Changelog','Integrations']],['Resources',['Docs','API','Blog','Tutorials']],['Company',['About','Customers','Careers','Press']]].map(([t, items]) =>
            '<div><div class="font-semibold text-xs uppercase tracking-wider text-muted mb-3">' + t + '</div><ul class="space-y-2 text-sm">' + items.map(l => '<li><a href="#" class="hover:text-iris">' + l + '</a></li>').join('') + '</ul></div>'
          ).join('')
        + '<div><div class="font-semibold text-xs uppercase tracking-wider text-muted mb-3">Subscribe</div><p class="text-xs text-muted mb-3">Get release notes once a week.</p><div class="flex"><input class="input rounded-r-none" placeholder="you@email.com"><button class="btn btn-primary rounded-l-none">→</button></div></div>'
        + '</div>'
        + '<div class="divider-h my-6"></div>'
        + '<div class="flex flex-wrap justify-between items-center gap-3 text-xs text-muted"><span>© 2026 VGF26 · MIT License</span><div class="flex gap-4"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Status</a><a href="#">Cookies</a></div><span>Made with 💜 in Baku</span></div>'
        + '</div>')

      + section('6. Minimal footer',
        '<div class="card card-pad flex flex-wrap justify-between items-center gap-3">'
        + '<div class="flex items-center gap-2 font-bold" style="font-family:DM Sans">' + I_('sparkles', 18, 'text-iris') + '<span>VGF26</span></div>'
        + '<div class="text-xs text-muted">© 2026 · MIT License · v1.0.0</div>'
        + '<div class="flex gap-3 text-xs"><a href="#" class="text-iris">Twitter</a><a href="#" class="text-iris">GitHub</a><a href="#" class="text-iris">Discord</a></div>'
        + '</div>')

      + section('7. Dark CTA footer',
        '<div class="card overflow-hidden" style="background:linear-gradient(135deg,#1a063d,#421389);color:#fff"><div class="p-8 text-center">'
        + '<h3 style="font-family:DM Sans;font-size:28px;font-weight:700">Build your studio with VGF26</h3>'
        + '<p class="opacity-80 mt-2">Open-source · MIT · zero npm install</p>'
        + '<div class="flex gap-3 justify-center mt-5"><button class="btn" style="background:#fff;color:rgb(var(--iris))">Start free →</button><button class="btn" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)">View on GitHub</button></div>'
        + '<div class="text-xs opacity-60 mt-6">© 2026 VGF26 · Made with 💜 in Baku</div>'
        + '</div></div>')

      /* ── Sticky bars ───────────────────────────────────────── */
      + section('8. Cookie consent banner',
        '<div class="card overflow-hidden"><div class="p-5 flex flex-wrap items-center gap-4">'
        + '<div class="grid place-items-center w-12 h-12 rounded-xl shrink-0" style="background:rgb(var(--amber)/.14);color:rgb(var(--amber))">' + I_('cookie' in {} ? 'cookie' : 'flame', 22) + '</div>'
        + '<div class="flex-1"><div class="font-semibold">We use cookies</div><div class="text-xs text-muted mt-1">By clicking "Accept all" you agree to our cookie policy. You can manage preferences anytime.</div></div>'
        + '<div class="flex gap-2"><button class="btn btn-ghost btn-xs">Preferences</button><button class="btn btn-secondary btn-xs">Reject all</button><button class="btn btn-primary btn-xs">Accept all</button></div>'
        + '</div></div>')

      + section('9. Announcement bar with CTA',
        '<div class="card overflow-hidden" style="background:linear-gradient(90deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff"><div class="p-3 flex items-center justify-center gap-3 text-sm">'
        + I('sparkles-2') + '<span><strong>VGF26 v1.2 is here!</strong> · 14 new components and 6 fresh dashboards.</span><a href="#" class="underline font-semibold">View changelog →</a><button class="ml-3 opacity-75 hover:opacity-100">' + I_('x', 14) + '</button>'
        + '</div></div>')

      + section('10. Mobile bottom action bar',
        '<div class="card overflow-hidden max-w-md"><div class="p-3 border-t border-[rgb(var(--line))] flex gap-2 items-center">'
        + '<div class="flex-1"><div class="text-[10px] text-muted">Total</div><div class="font-bold text-lg">$142.50</div></div>'
        + '<button class="btn btn-secondary">' + I('heart') + '</button>'
        + '<button class="btn btn-primary flex-1 justify-center">Add to cart</button>'
        + '</div></div>')

      + section('11. Newsletter bar',
        '<div class="card card-pad" style="background:linear-gradient(135deg,rgb(var(--iris)/.08),rgb(var(--fuchsia)/.08))">'
        + '<div class="flex flex-wrap items-center gap-4">'
        + '<div class="grid place-items-center w-12 h-12 rounded-xl shrink-0" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">' + I('mail') + '</div>'
        + '<div class="flex-1"><div class="font-semibold">Subscribe to product updates</div><div class="text-xs text-muted">One email per week. Release notes & new components.</div></div>'
        + '<div class="flex gap-2 w-full sm:w-auto"><input class="input" placeholder="you@email.com" style="min-width:240px"><button class="btn btn-primary">Subscribe</button></div>'
        + '</div></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * AUTH — forgot, biometric, offline
   * ──────────────────────────────────────────────────────────────── */
  function viewForgot() {
    return pageHead('Forgot · Reset · Verify', 'Account recovery flows.', [{title:'Auth'}, {title:'Forgot'}])
      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + [['Forgot password','We\'ll email you a reset link.','Email','Send link'],['Reset password','Choose a new password.','New password','Save password'],['Verify email','We sent a code to your email.','6-digit code','Verify']].map(([t,d,l,b]) => '<div class="card card-pad text-center py-8"><div class="grid place-items-center w-14 h-14 rounded-2xl mx-auto mb-3" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">' + I_('key', 24) + '</div><h3 class="font-bold">' + t + '</h3><p class="text-xs text-muted mt-1 mb-4">' + d + '</p><input class="input mb-2" placeholder="' + l + '"><button class="btn btn-primary w-full justify-center">' + b + '</button></div>').join('')
      + '</div>';
  }

  function viewBiometric() {
    return pageHead('Biometric · Face ID · Fingerprint', 'Modern auth methods.', [{title:'Auth'}, {title:'Biometric'}])
      + section('Choose your method',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
        + '<div class="card card-pad text-center py-10 hover-lift cursor-pointer"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl text-iris" style="background:rgb(var(--iris)/.14)">' + I_('fingerprint', 40) + '</div><h3 class="font-bold mt-4">Touch ID</h3><p class="text-sm text-muted mt-1">Place your finger on the sensor</p></div>'
        + '<div class="card card-pad text-center py-10 hover-lift cursor-pointer"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl text-fuchsia-500" style="background:rgb(var(--fuchsia)/.14)">' + I_('face', 40) + '</div><h3 class="font-bold mt-4">Face ID</h3><p class="text-sm text-muted mt-1">Look at the camera</p></div>'
        + '</div>');
  }

  function viewOffline() {
    return pageHead('Offline · PWA states', 'When the network is gone.', [{title:'Auth'}, {title:'Offline'}])
      + section('Offline screen',
        '<div class="card card-pad text-center py-12"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl text-amber" style="background:rgb(var(--amber)/.14)">' + I_('wifi', 40) + '</div><h3 class="font-bold text-xl mt-4">You\'re offline</h3><p class="text-sm text-muted mt-2 max-w-md mx-auto">Some features may not be available until you reconnect.</p><button class="btn btn-primary mt-4">' + I('refresh') + '<span>Retry</span></button></div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * INSPIRED — notion / trello / linear / discord / spotify / etc.
   * ──────────────────────────────────────────────────────────────── */
  function viewNotion() {
    return pageHead('Notion-style editor', 'Block-based editing surface.', [{title:'Inspired'}, {title:'Notion'}])
      + '<div class="card card-pad max-w-3xl mx-auto"><div class="text-muted text-sm mb-2">Press <span class="kbd">/</span> for commands</div><h1 contenteditable style="font-family:DM Sans;font-size:36px;font-weight:700" class="mb-4 outline-none">My iridescent doc</h1><div contenteditable class="outline-none space-y-3"><p>This is a regular paragraph block. Press enter for the next block, slash for commands.</p><div class="bg-soft border-l-4 border-iris pl-4 py-2 rounded-r-lg"><div class="text-xs text-iris font-semibold mb-1">CALLOUT</div>This is a callout block. Use it for tips, warnings, or notes.</div><h2 style="font-family:DM Sans;font-size:24px;font-weight:700">Heading two</h2><ul class="space-y-1 list-disc pl-5"><li>A bullet list item</li><li>Another bullet list item</li></ul><div class="code-block"><span class="text-iris">function</span> iridescent() { <span class="text-iris">return</span> <span class="text-emerald">"✨"</span>; }</div></div></div>';
  }

  function viewTrello() {
    return viewKanban().replace('Kanban board', 'Trello-style board');
  }

  function viewLinear() {
    return pageHead('Linear-style issue tracker', 'Clean issue list with priority + status.', [{title:'Inspired'}, {title:'Linear'}])
      + '<div class="card overflow-hidden"><div class="card-head !p-3 flex gap-2 overflow-x-auto">' + ['All','In progress','Backlog','Done','Cancelled'].map((t,i) => '<button class="btn btn-xs ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + '">' + t + '</button>').join('') + '</div>'
      + '<div class="divide-y divide-[rgb(var(--line-soft))]">'
      + ['Refactor sidebar component','Add CSV export to data table','i18n strings: Turkish + Spanish','Fix dark mode shadow contrast','Document keyboard shortcuts','Aurora hue tuning for AAA contrast'].map((t,i) => '<div class="flex items-center gap-3 p-3 hover:bg-soft cursor-pointer"><span class="font-mono text-xs text-muted w-16">VGF-' + (120 + i) + '</span><span class="pill pill-' + ['amber','iris','muted','rose','emerald','fuchsia'][i] + '">' + ['high','urgent','low','medium','done','review'][i] + '</span><span class="flex-1 text-sm">' + t + '</span><span class="text-xs text-muted">' + D().USERS[i % D().USERS.length].name.split(' ')[0] + '</span><span class="text-xs text-muted">' + (i+1) + 'd</span></div>').join('')
      + '</div></div>';
  }

  function viewDiscord() {
    return pageHead('Discord-style workspace', '3-pane chat layout.', [{title:'Inspired'}, {title:'Discord'}])
      + '<div class="card overflow-hidden grid grid-cols-[80px_220px_1fr] h-[640px]">'
      + '<div class="bg-[rgb(var(--bg-soft))] p-2 space-y-2 border-r border-[rgb(var(--line))]">' + ['VG','MR','LD','AT'].map((s,i) => '<div class="avatar w-12 h-12 mx-auto ' + (i === 0 ? 'ring-2 ring-iris' : '') + '" style="font-size:14px">' + s + '</div>').join('') + '<button class="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-soft text-iris hover:bg-[rgb(var(--iris-soft))]">' + I('plus') + '</button></div>'
      + '<div class="border-r border-[rgb(var(--line))] p-3 bg-soft"><div class="font-bold mb-3">VGF26 Studio</div><div class="text-xs text-muted uppercase tracking-wider mb-2">Channels</div>' + D().CHANNELS.map(c => '<div class="flex items-center justify-between p-2 rounded-lg ' + (c.active ? 'bg-[rgb(var(--iris-soft))] text-iris font-semibold' : 'hover:bg-[rgb(var(--bg-card))] text-muted') + ' cursor-pointer text-sm"><span>' + c.id + '</span>' + (c.unread ? '<span class="pill pill-iris" style="font-size:9px">' + c.unread + '</span>' : '') + '</div>').join('') + '</div>'
      + '<div class="flex flex-col"><div class="p-4 border-b border-[rgb(var(--line))] flex items-center justify-between"><div class="font-bold flex items-center gap-2">' + I('message-circle') + '<span># design</span></div></div>'
      + '<div class="flex-1 overflow-y-auto p-4 space-y-4">' + D().CHAT.map(m => '<div class="flex gap-3">' + D().avatarFor(m.who) + '<div><div class="flex items-baseline gap-2"><strong>' + m.who + '</strong><span class="text-[10px] text-muted">' + m.time + '</span></div><div class="text-sm text-ink-2">' + m.text + '</div></div></div>').join('') + '</div>'
      + '<div class="p-3 border-t border-[rgb(var(--line))]"><input class="input" placeholder="Message #design"></div></div></div>';
  }

  function viewSpotify() {
    return pageHead('Spotify-style player', 'Dark green player chrome.', [{title:'Inspired'}, {title:'Spotify'}])
      + '<div class="card overflow-hidden bg-ink text-white"><div class="p-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4"><div class="aspect-square rounded-xl shadow-2xl" style="background:linear-gradient(135deg,#7c3aed,#d846ef,#06b6d4)"></div><div class="flex flex-col justify-end"><div class="text-xs uppercase tracking-wider opacity-70">Album</div><h2 style="font-family:DM Sans;font-size:36px;font-weight:700" class="mt-1">Aurora Frequencies</h2><div class="text-sm opacity-80 mt-1">VGF26 Studio · 2026 · 12 songs · 42 min</div><div class="mt-4 flex gap-2"><button class="grid place-items-center w-12 h-12 rounded-full bg-emerald-500 text-black">' + I_('play', 22) + '</button><button class="tb-icon-btn bg-transparent border-white/20 text-white">' + I('heart') + '</button></div></div></div>'
      + '<div class="px-6 pb-6"><table class="w-full text-sm"><thead><tr class="text-xs uppercase tracking-wider opacity-60 border-b border-white/10"><th class="text-left py-2 w-8">#</th><th class="text-left py-2">Title</th><th class="text-left py-2">Album</th><th class="text-right py-2">⏱</th></tr></thead><tbody>' + Array.from({length: 6}, (_, i) => '<tr class="hover:bg-white/5"><td class="py-2">' + (i+1) + '</td><td><div class="font-semibold">Iridescence ' + (i+1) + '</div><div class="text-xs opacity-60">VGF26 Studio</div></td><td class="opacity-60">Aurora Frequencies</td><td class="text-right opacity-60">3:' + (10 + i * 5) + '</td></tr>').join('') + '</tbody></table></div></div>';
  }

  function viewApple() {
    return pageHead('Apple-style hero', 'Edge-to-edge product showcase.', [{title:'Inspired'}, {title:'Apple'}])
      + '<div class="card overflow-hidden text-center py-20" style="background:radial-gradient(circle at center,rgb(var(--iris)/.15),transparent 60%)"><div style="font-family:DM Sans;font-size:14px;font-weight:600;letter-spacing:.1em;text-transform:uppercase" class="text-iris">VGF26 Pro</div><h1 style="font-family:DM Sans;font-size:72px;font-weight:700;line-height:1" class="mt-3 bg-gradient-to-br from-iris-500 to-fuchsia-500 bg-clip-text text-transparent">Designed for tomorrow.</h1><p class="mt-4 text-lg text-muted">The most ambitious admin studio we\'ve ever made.</p><div class="mt-6 flex gap-3 justify-center"><a href="#" class="text-iris underline">Learn more ›</a><a href="#" class="text-iris underline">Buy ›</a></div></div>';
  }

  function viewVercel() {
    return pageHead('Vercel dark gradient', 'Deep dark + neon edges.', [{title:'Inspired'}, {title:'Vercel'}])
      + '<div class="card overflow-hidden bg-ink text-white"><div class="relative p-16 text-center" style="background:radial-gradient(circle at top,rgba(255,255,255,.08),transparent 60%)"><h1 style="font-family:DM Sans;font-size:56px;font-weight:700;line-height:1">Ship faster.</h1><p class="mt-3 opacity-70">Deploy in seconds, scale to millions, zero config.</p><div class="mt-5 flex gap-2 justify-center"><button class="btn" style="background:#fff;color:#000">Start Deploying →</button><button class="btn" style="background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15)">Get a Demo</button></div></div></div>';
  }

  function viewStripe() {
    return pageHead('Stripe-style gradient UI', 'Soft pastels and gradient backgrounds.', [{title:'Inspired'}, {title:'Stripe'}])
      + '<div class="card overflow-hidden"><div class="p-12" style="background:linear-gradient(180deg,#fafbff 0%,#f3f4ff 100%)"><div class="grid md:grid-cols-2 gap-8 items-center"><div><div class="pill pill-iris">Payments infrastructure</div><h1 style="font-family:DM Sans;font-size:42px;font-weight:700;line-height:1.1" class="mt-4">Financial infrastructure for the internet</h1><p class="text-sm text-muted mt-4">Millions of companies of all sizes use VGF26 online to accept payments, send payouts, and manage their businesses online.</p><button class="btn btn-primary mt-5">Start now →</button></div><div class="aspect-square rounded-2xl shadow-2xl" style="background:linear-gradient(135deg,#a855f7,#ec4899,#22d3ee);background-size:200% 200%;animation:aurora-pan 10s ease-in-out infinite"></div></div></div></div>';
  }

  function viewAirbnb() {
    const grads = ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef','#10b981,#06b6d4','#f43f5e,#fb923c','#22d3ee,#6366f1','#84cc16,#06b6d4','#d946ef,#f43f5e'];
    const cities = ['Baku, AZ','Berlin, DE','Tokyo, JP','Lisbon, PT','New York, US','Paris, FR','Seoul, KR','Sydney, AU'];
    const titles = ['Iridescent loft','Aurora suite','Spectrum apartment','Prism penthouse','Glass villa','Crystal cabin','Neon studio','Holo retreat'];
    return pageHead('Airbnb-style card grid',
        'Image-first listing cards with heart toggle, rating, distance and price.',
        [{title:'Inspired'}, {title:'Airbnb'}],
        '<button class="btn btn-secondary btn-xs">' + I('sliders') + '<span>Filters</span></button>')
      + '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">'
      + Array.from({length: 8}, (_, i) =>
          '<article class="lst-card">'
          + '  <div class="lst-cover" style="background:linear-gradient(135deg,' + grads[i] + ')">'
          + '    <button class="lst-heart" data-act="heart" aria-label="Save">' + I_('heart', 18) + '</button>'
          + '    <span class="absolute top-3 left-3 pill" style="background:rgba(255,255,255,.92);color:#0b0a14;border:0">Guest favourite</span>'
          + '    <div class="lst-dots">' + [0,1,2,3,4].map(j => '<span class="' + (j === 0 ? 'is-on' : '') + '"></span>').join('') + '</div>'
          + '  </div>'
          + '  <div class="mt-3 px-1">'
          + '    <div class="flex justify-between items-start gap-2">'
          + '      <div class="font-semibold text-[14px] truncate">' + titles[i] + ' in ' + cities[i] + '</div>'
          + '      <div class="text-[12px] flex items-center gap-1 shrink-0">★ <span class="font-semibold">' + (4.7 + Math.random() * 0.25).toFixed(2) + '</span></div>'
          + '    </div>'
          + '    <div class="text-[12.5px] text-muted mt-0.5">' + (i + 3) + ' hour drive · Hosted by ' + D().USERS[i].name.split(' ')[0] + '</div>'
          + '    <div class="text-[12.5px] text-muted">12 – 18 Nov · ' + (i + 1) + ' guests</div>'
          + '    <div class="mt-2 text-[14px]"><span class="font-bold">$' + (89 + i * 24) + '</span><span class="text-muted"> night · </span><span class="text-muted underline">$' + ((89 + i * 24) * 6) + ' total</span></div>'
          + '  </div>'
          + '</article>'
        ).join('')
      + '</div>';
  }

  function viewGithub() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    /* Generate cells column-by-column (52 weeks × 7 days). */
    const cells = [];
    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const v = Math.max(0, Math.round((Math.random() * Math.random()) * 14));
        const lvl = v === 0 ? 0 : v <= 2 ? 1 : v <= 5 ? 2 : v <= 9 ? 3 : 4;
        const date = new Date(2025, 4, 25);
        date.setDate(date.getDate() + (w * 7) + d);
        const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        cells.push('<div class="gh-cell gh-l' + lvl + '" data-v="' + v + '" data-l="' + label + '"></div>');
      }
    }
    return pageHead('GitHub-style contribution graph',
        '53-week activity heatmap — theme-aware, hover for the daily count.',
        [{title:'Inspired'}, {title:'GitHub'}])
      + section('@vugarfamiloglu · 1,284 contributions in the last year',
        '<div class="card card-pad chart-host" data-chart="gh-graph">'
        + '  <div class="cal-heat">'
        + '    <div class="dow"><div></div><div>Mon</div><div></div><div>Wed</div><div></div><div>Fri</div><div></div></div>'
        + '    <div class="body">'
        + '      <div class="months">' + months.map(m => '<div>' + m + '</div>').join('') + '</div>'
        + '      <div class="gh-grid" style="grid-auto-flow:column;grid-template-rows:repeat(7,minmax(0,1fr))">' + cells.join('') + '</div>'
        + '    </div>'
        + '  </div>'
        + '  <div class="flex justify-between items-center mt-4 text-xs text-muted">'
        + '    <span>Learn how we count contributions</span>'
        + '    <div class="flex items-center gap-2"><span>Less</span>' + ['gh-l0','gh-l1','gh-l2','gh-l3','gh-l4'].map(c => '<div class="' + c + '" style="width:11px;height:11px;border-radius:2px"></div>').join('') + '<span>More</span></div>'
        + '  </div>'
        + '</div>')
      + section('Contribution stats',
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'
        + statTile('Total commits',    '1,284',  '+182 this month', 'up', 'git',    'iris')
        + statTile('Longest streak',   '42 days','current 14',      'up', 'flame',  'fuchsia')
        + statTile('Pull requests',    '208',    '+34',             'up', 'arrow-up-right', 'cyan')
        + '</div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * SPECIALTY — video-call, whiteboard, calendar, flow, reels, qr, dock, gamify
   * ──────────────────────────────────────────────────────────────── */
  function viewVideoCall() {
    return pageHead('Video call · Screen share', 'Group video grid with controls.', [{title:'Specialty'}, {title:'Video call'}])
      + '<div class="card overflow-hidden"><div class="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">'
      + Array.from({length: 6}, (_, i) => '<div class="aspect-video rounded-xl relative overflow-hidden" style="background:linear-gradient(135deg,' + ['#7c3aed,#d846ef','#06b6d4,#7c3aed','#f59e0b,#d846ef','#10b981,#06b6d4','#f43f5e,#fb923c','#22d3ee,#6366f1'][i] + ')"><div class="absolute inset-0 grid place-items-center"><div class="avatar" style="width:64px;height:64px;font-size:24px">' + D().USERS[i].name.split(' ').map(x=>x[0]).join('') + '</div></div><div class="absolute bottom-2 left-2 text-white text-xs bg-black/30 backdrop-blur-md rounded-lg px-2 py-1">' + D().USERS[i].name + (i === 0 ? ' (you)' : '') + '</div>' + (i === 0 ? '<span class="absolute top-2 right-2 text-white">' + I('mic') + '</span>' : '') + '</div>').join('')
      + '</div>'
      + '<div class="p-4 border-t border-[rgb(var(--line))] flex justify-center gap-2"><button class="tb-icon-btn">' + I('mic') + '</button><button class="tb-icon-btn">' + I('video') + '</button><button class="tb-icon-btn">' + I('monitor') + '</button><button class="tb-icon-btn">' + I('message-circle') + '</button><button class="grid place-items-center w-12 h-12 rounded-xl text-white" style="background:rgb(var(--rose))">' + I('x') + '</button></div></div>';
  }

  function viewWhiteboard() {
    return pageHead('Whiteboard · Mind map (XMind style)',
        'Click any node to collapse / expand its subtree. Curved SVG connectors redraw automatically.',
        [{title:'Specialty'}, {title:'Mind map'}],
        '<button class="btn btn-secondary btn-xs">' + I('plus') + '<span>Add node</span></button>'
        + '<button class="btn btn-primary btn-xs">' + I('download') + '<span>Export</span></button>')
      + section('Studio brainstorm',
        '<div class="card overflow-hidden">'
        + '  <div class="card-head !p-3 flex justify-between items-center">'
        + '    <div class="flex gap-2 items-center"><span class="pill pill-iris">' + I_('sparkles-2', 12) + 'XMind-style</span><span class="text-xs text-muted">Click a node to collapse</span></div>'
        + '    <div class="flex gap-1"><button class="tb-icon-btn">' + I_('minimize', 14) + '</button><button class="tb-icon-btn">' + I_('expand', 14) + '</button><button class="tb-icon-btn">' + I_('refresh', 14) + '</button></div>'
        + '  </div>'
        + '  <div class="mindmap-host" data-mount="mindmap" style="min-height:540px"></div>'
        + '</div>');
  }

  function viewCalendar() {
    return pageHead('Calendar · Scheduler', 'Month view with event chips.', [{title:'Specialty'}, {title:'Calendar'}])
      + '<div class="card overflow-hidden"><div class="card-head"><h3>May 2026</h3><div class="flex gap-1"><button class="tb-icon-btn">' + I('chevron-left') + '</button><button class="tb-icon-btn">' + I('chevron-right') + '</button></div></div>'
      + '<div class="grid grid-cols-7 text-center text-xs text-muted font-semibold border-b border-[rgb(var(--line))] p-2">' + ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => '<div>' + d + '</div>').join('') + '</div>'
      + '<div class="grid grid-cols-7" style="grid-auto-rows:90px">'
      + Array.from({length: 35}, (_, i) => { const day = i - 3; const valid = day > 0 && day <= 31; const today = day === 25; const events = valid && (day === 12 || day === 18 || day === 25 || day === 28) ? [['Sprint','iris'],['Demo','fuchsia'],['Lunch','emerald']].slice(0, 1 + (day % 3)) : []; return '<div class="border-r border-b border-[rgb(var(--line-soft))] p-2 ' + (today ? 'bg-[rgb(var(--iris-soft))]' : '') + '"><div class="text-xs font-semibold ' + (valid ? '' : 'text-muted') + ' ' + (today ? 'text-iris' : '') + '">' + (valid ? day : '') + '</div>' + events.map(([e,c]) => '<div class="text-[10px] mt-1 px-1.5 py-0.5 rounded truncate" style="background:rgb(var(--' + c + ')/.15);color:rgb(var(--' + c + '))">' + e + '</div>').join('') + '</div>'; }).join('')
      + '</div></div>';
  }

  function viewFlow() {
    function node(name, role, root) {
      return '<div class="orgchart-node' + (root ? ' is-root' : '') + '"><h5>' + name + '</h5><div class="role">' + role + '</div></div>';
    }
    return pageHead('Org chart · Node graph',
        'Hierarchical chart of teams with SVG-style connectors.',
        [{title:'Specialty'}, {title:'Org chart'}])
      + section('Studio org',
        '<div class="card card-pad overflow-x-auto"><div class="orgchart" style="min-width:780px">'
        + '  <div class="orgchart-row">' + node('Vugar Familoglu', 'CEO / Founder', true) + '</div>'
        + '  <div class="orgchart-row is-multi">'
        +      node('Sarah Jenkins', 'Head of Product')
        +      node('Leo Kuznetsov', 'Head of Engineering')
        +      node('Tomás Silva',  'Head of Marketing')
        + '  </div>'
        + '  <div class="orgchart-row is-multi" style="gap:18px">'
        +      node('Alex Rivera', 'Designer')
        +      node('Maya Patel',  'DevOps')
        +      node('Yuki Tanaka', 'Engineer')
        +      node('Olivia Chen', 'Data')
        +      node('Aida Mammadli','Support')
        + '  </div>'
        + '</div></div>')
      + section('Node graph (flow)',
        '<div class="card card-pad overflow-hidden h-80 relative bg-soft">'
        + '<svg viewBox="0 0 800 320" class="w-full h-full">'
        + '<defs><linearGradient id="flow-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c3aed" stop-opacity=".8"/><stop offset="1" stop-color="#d846ef" stop-opacity=".8"/></linearGradient></defs>'
        + [['M170,160 C260,160 280,80 380,80','M170,160 C260,160 280,160 380,160','M170,160 C260,160 280,240 380,240','M510,80 C600,80 600,160 660,160','M510,160 C600,160 600,160 660,160','M510,240 C600,240 600,160 660,160'].map(d => '<path d="' + d + '" stroke="url(#flow-c)" stroke-width="2" fill="none"/>').join('')]
        + [['Input',90,160,'#7c3aed'],['Filter',420,80,'#d846ef'],['Transform',420,160,'#22d3ee'],['Validate',420,240,'#10b981'],['Output',700,160,'#7c3aed']].map(([t,x,y,c]) => '<g><rect x="' + (x-50) + '" y="' + (y-22) + '" width="100" height="44" rx="12" fill="rgb(var(--bg-card))" stroke="' + c + '" stroke-width="2"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="13" font-weight="600" fill="rgb(var(--ink))">' + t + '</text></g>').join('')
        + '</svg></div>');
  }

  function viewReels() {
    return pageHead('Reels · Stories · Feed', 'Vertical short-video viewer.', [{title:'Specialty'}, {title:'Reels'}])
      + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">'
      + Array.from({length: 4}, (_, i) => '<div class="aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer hover-lift" style="background:linear-gradient(180deg,#000,' + ['#7c3aed','#d846ef','#06b6d4','#10b981'][i] + ')"><div class="absolute inset-0 grid place-items-center text-white"><button class="grid place-items-center w-16 h-16 rounded-full" style="background:rgba(255,255,255,.2);backdrop-filter:blur(10px)">' + I_('play', 28) + '</button></div><div class="absolute bottom-3 left-3 right-3 text-white"><div class="flex items-center gap-2"><div class="avatar w-8 h-8" style="font-size:11px">' + D().USERS[i].name.split(' ').map(x=>x[0]).join('') + '</div><div class="font-semibold text-sm">@' + D().USERS[i].name.toLowerCase().replace(' ','') + '</div></div><div class="text-xs mt-1 opacity-80">Behind the scenes</div></div></div>').join('')
      + '</div>';
  }

  function viewQR() {
    return pageHead('QR code generator · Barcode', 'Stylised QR with brand gradient.', [{title:'Specialty'}, {title:'QR'}])
      + section('Generate QR',
        '<div class="grid md:grid-cols-2 gap-4">'
        + '<div class="card card-pad"><label class="label">Content</label><input class="input mb-3" value="https://github.com/vugarfamiloglu/admin-panel-vgf26"><label class="label">Style</label><select class="select"><option>Default</option><option>Rounded</option><option>Gradient</option></select></div>'
        + '<div class="card card-pad grid place-items-center"><div class="p-4 rounded-2xl" style="background:linear-gradient(135deg,rgb(var(--iris)/.1),rgb(var(--fuchsia)/.1))"><svg width="200" height="200" viewBox="0 0 25 25" class="text-iris">' + Array.from({length: 25}, (_, y) => Array.from({length: 25}, (_, x) => { if ((x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17)) { const corner = (x === 0 || y === 0 || x === 6 || y === 6 || (x === 0 + (x > 17 ? 18 : 0))); if (x < 7 && y < 7 && (x === 0 || y === 0 || x === 6 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5))) return '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>'; if (x > 17 && y < 7 && (x === 18 || y === 0 || x === 24 || y === 6 || (x > 19 && x < 23 && y > 1 && y < 5))) return '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>'; if (x < 7 && y > 17 && (x === 0 || y === 18 || x === 6 || y === 24 || (x > 1 && x < 5 && y > 19 && y < 23))) return '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>'; return ''; } return Math.random() > 0.55 ? '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>' : ''; }).join('')).join('') + '</svg></div></div>'
        + '</div>');
  }

  function viewDock() {
    return pageHead('macOS dock · Dynamic Island', 'Magnified dock + pill island.', [{title:'Specialty'}, {title:'Dock'}])
      + section('Dock',
        '<div class="card card-pad py-12 grid place-items-center bg-soft">'
        + '<div class="flex items-end gap-2 px-4 py-2 rounded-2xl" style="background:rgba(255,255,255,.5);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.4)">'
        + ['sparkles','message-circle','mail','music','video','settings','folder','globe'].map((i, idx) => '<div class="w-12 h-12 rounded-xl grid place-items-center text-white hover:scale-125 transition-transform" style="background:linear-gradient(135deg,rgb(var(--' + ['iris','fuchsia','cyan','emerald','amber','rose','iris','fuchsia'][idx] + ')),rgb(var(--iris)))">' + I_(i, 22) + '</div>').join('')
        + '</div></div>')
      + section('Dynamic island',
        '<div class="card card-pad py-12 grid place-items-center"><div class="px-5 py-3 rounded-full text-white flex items-center gap-3" style="background:#000;min-width:280px"><div class="grid place-items-center w-8 h-8 rounded-full" style="background:rgb(var(--iris))">' + I('music') + '</div><div class="flex-1"><div class="text-sm font-semibold">Iridescence #1</div><div class="text-xs opacity-60">VGF26 Studio</div></div>' + I_('play', 18) + '</div></div>');
  }

  function viewGamify() {
    return pageHead('Gamification · XP · Quests', 'Duolingo-style progress system.', [{title:'Specialty'}, {title:'Gamify'}])
      + '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
      + '<div class="card card-pad text-center"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl mb-3" style="background:linear-gradient(135deg,rgb(var(--iris)),rgb(var(--fuchsia)));color:#fff">' + I_('flame', 34) + '</div><div class="font-bold text-2xl" style="font-family:DM Sans">42 day</div><div class="text-sm text-muted">streak</div></div>'
      + '<div class="card card-pad text-center"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl mb-3" style="background:linear-gradient(135deg,rgb(var(--amber)),rgb(var(--rose)));color:#fff">' + I_('crown', 34) + '</div><div class="font-bold text-2xl" style="font-family:DM Sans">12,840</div><div class="text-sm text-muted">XP earned</div></div>'
      + '<div class="card card-pad text-center"><div class="grid place-items-center w-20 h-20 mx-auto rounded-2xl mb-3" style="background:linear-gradient(135deg,rgb(var(--emerald)),rgb(var(--cyan)));color:#fff">' + I_('trophy', 34) + '</div><div class="font-bold text-2xl" style="font-family:DM Sans">58</div><div class="text-sm text-muted">achievements</div></div>'
      + '</div>'
      + section('Quest tracker',
        '<div class="card card-pad space-y-3">'
        + [['Daily streak goal','7 / 7','iris'],['Complete 3 lessons','2 / 3','amber'],['Score 50 XP','42 / 50','emerald']].map(([t, p, c]) => { const [a, b] = p.split(' / '); const pct = Math.round((+a / +b) * 100); return '<div><div class="flex justify-between mb-1"><span class="text-sm font-semibold">' + t + '</span><span class="font-mono text-sm">' + p + '</span></div><div class="h-3 rounded-full bg-soft overflow-hidden"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,rgb(var(--' + c + ')),rgb(var(--iris)))"></div></div></div>'; }).join('')
        + '</div>');
  }

  /* ────────────────────────────────────────────────────────────────
   * SYSTEM — a11y / security / logs / monitoring
   * ──────────────────────────────────────────────────────────────── */
  function viewA11y() {
    return pageHead('Accessibility controls', 'Font size, contrast, motion.', [{title:'System'}, {title:'A11y'}])
      + section('Reader preferences',
        '<div class="card card-pad space-y-4">'
        + '<div class="flex items-center justify-between"><span class="text-sm">Reduce motion</span><span class="switch" data-toggle></span></div>'
        + '<div class="flex items-center justify-between"><span class="text-sm">High contrast</span><span class="switch" data-toggle></span></div>'
        + '<div class="flex items-center justify-between"><span class="text-sm">Underline links</span><span class="switch is-on" data-toggle></span></div>'
        + '<div><label class="label">Font size</label><input type="range" min="80" max="140" value="100" class="w-full accent-[rgb(var(--iris))]"><div class="text-xs text-muted mt-1 flex justify-between"><span>Smaller</span><span>Default</span><span>Larger</span></div></div>'
        + '<div><label class="label">Spacing</label><input type="range" min="80" max="140" value="100" class="w-full accent-[rgb(var(--iris))]"></div>'
        + '</div>');
  }

  function viewSecurity() {
    return pageHead('Security · API keys', 'Sessions, 2FA, audit log.', [{title:'System'}, {title:'Security'}])
      + section('Active sessions',
        '<div class="card overflow-hidden"><table class="t-table"><thead><tr><th>Device</th><th>Location</th><th>Signed in</th><th></th></tr></thead><tbody>'
        + [['MacBook Pro · Chrome','Baku, AZ','2 min ago','current'],['iPhone 15 · Safari','Baku, AZ','3 days ago',''],['Windows · Edge','Berlin, DE','2 weeks ago','']].map(([d,l,t,c]) => '<tr><td><div class="flex items-center gap-2">' + I_(d.includes('iPhone') ? 'smartphone' : 'monitor', 18, 'text-iris') + d + '</div></td><td>' + l + '</td><td class="text-muted">' + t + '</td><td class="text-right">' + (c === 'current' ? '<span class="pill pill-emerald">this device</span>' : '<button class="btn btn-danger btn-xs">Sign out</button>') + '</td></tr>').join('')
        + '</tbody></table></div>')
      + section('Two-factor authentication',
        '<div class="card card-pad flex items-center justify-between"><div><div class="font-semibold">Authenticator app</div><div class="text-xs text-muted">TOTP, ~30s rotation</div></div><span class="pill pill-emerald">ENABLED</span></div>');
  }

  function viewLogs() {
    const lines = [['INFO','router','renderRoute("/dashboard")'],['DBG ','i18n','loaded locale "en"'],['INFO','sb','sidebar collapsed'],['WARN','net','request retried (1/3)'],['INFO','toast','dismissed'],['ERR ','crash','TypeError: cannot read'],['INFO','router','renderRoute("/cards")']];
    return pageHead('Logs viewer · JSON · Diff', 'Live tail of app events.', [{title:'System'}, {title:'Logs'}])
      + '<div class="card overflow-hidden">'
      + '<div class="card-head"><h3>Live tail</h3><div class="flex gap-2"><button class="btn btn-xs btn-secondary">Pause</button><button class="btn btn-xs btn-secondary">Clear</button></div></div>'
      + '<div class="bg-ink text-emerald font-mono text-xs p-4 h-80 overflow-y-auto">'
      + lines.map(([lv, src, msg]) => '<div><span class="text-muted">' + new Date().toISOString().slice(11, 23) + '</span> <span class="' + (lv === 'ERR ' ? 'text-rose' : lv === 'WARN' ? 'text-amber' : lv === 'DBG ' ? 'text-cyan' : 'text-iris') + '">' + lv + '</span> <span class="opacity-60">[' + src + ']</span> ' + msg + '</div>').join('')
      + '</div></div>';
  }

  function viewMonitoring() {
    return pageHead('Monitoring · Status indicator', 'Service health board.', [{title:'System'}, {title:'Monitoring'}])
      + '<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">'
      + statTile('Overall status', 'All green', '99.98% uptime', 'up', 'check-circle', 'emerald')
      + statTile('Active incidents', '0', 'last 7d',           '',   'alert-circle', 'iris')
      + statTile('Avg response',   '142ms', '-12ms',           'up', 'zap',          'cyan')
      + statTile('Requests / s',   '12,420', '+1.4k',          'up', 'activity',     'fuchsia')
      + '</div>'
      + '<div class="card overflow-hidden"><div class="card-head"><h3>Services</h3></div>'
      + '<div class="divide-y divide-[rgb(var(--line-soft))]">'
      + [['api','Operational','99.99%','emerald'],['frontend','Operational','100%','emerald'],['database','Operational','99.97%','emerald'],['cdn','Degraded','99.5%','amber'],['email','Operational','100%','emerald'],['payments','Operational','99.98%','emerald']].map(([n,s,u,c]) => '<div class="p-4 flex items-center justify-between"><div class="flex items-center gap-3"><span class="w-2.5 h-2.5 rounded-full" style="background:rgb(var(--' + c + '))"></span><strong>' + n + '</strong></div><div class="flex items-center gap-4"><span class="text-muted text-sm font-mono">' + u + '</span><span class="pill pill-' + c + '">' + s + '</span></div></div>').join('')
      + '</div></div>';
  }

  /* ────────────────────────────────────────────────────────────────
   * Register all new routes onto Views.ROUTES
   * ──────────────────────────────────────────────────────────────── */
  const NEW_ROUTES = {
    /* dashboards */
    '#/dashboards/analytics':  viewAnalytics,
    '#/dashboards/crm':        viewCRM,
    '#/dashboards/finance':    viewFinance,
    '#/dashboards/ecommerce':  viewEcom,
    '#/dashboards/crypto':     viewCrypto,
    '#/dashboards/nft':        viewNFT,
    '#/dashboards/iot':        viewIoT,
    '#/dashboards/devops':     viewDevOps,
    '#/dashboards/streaming':  viewStreaming,
    '#/dashboards/gaming':     viewGaming,

    /* layouts */
    '#/layouts':           viewLayouts,
    '#/layouts/split':     viewSplit,
    '#/layouts/docks':     viewDocks,
    '#/layouts/sticky':    viewSticky,

    /* data */
    '#/kanban':            viewKanban,
    '#/timeline':          viewTimeline,
    '#/pagination':        viewPagination,
    '#/tree':              viewTree,

    /* media */
    '#/gallery':           viewGallery,
    '#/carousel':          viewCarousel,
    '#/image-zoom':        viewImageZoom,
    '#/marquee':           viewMarquee,
    '#/media-player':      viewMediaPlayer,
    '#/maps':              viewMaps,

    /* forms */
    '#/forms/pickers':     viewPickers,
    '#/forms/upload':      viewUpload,
    '#/forms/otp':         viewOTP,
    '#/forms/editor':      viewEditor,
    '#/forms/search':      viewSearch,
    '#/forms/wizard':      viewWizard,

    /* navigation */
    '#/nav/menus':         viewMenus,
    '#/nav/tabs':          viewTabs,
    '#/nav/breadcrumb':    viewBreadcrumb,
    '#/nav/stepper':       viewStepper,
    '#/nav/bottom':        viewBottomNav,
    '#/nav/fab':           viewFAB,

    /* overlays */
    '#/overlays/popovers': viewPopovers,
    '#/overlays/banner':   viewBanner,
    '#/overlays/states':   viewStates,

    /* effects */
    '#/effects/glow':         viewGlow,
    '#/effects/tilt':         viewTilt,
    '#/effects/parallax':     viewParallax,
    '#/effects/transitions':  viewTransitions,
    '#/effects/cursor':       viewCursor,
    '#/effects/confetti':     viewConfetti,

    /* charts */
    '#/charts/scatter':    viewScatter,
    '#/charts/sparkline':  viewSparkline,
    '#/charts/candle':     viewCandle,
    '#/charts/heatmap':    viewHeatmap,

    /* commerce */
    '#/commerce/storefront': viewStorefront,
    '#/commerce/cart':       viewCart,
    '#/commerce/checkout':   viewCheckout,
    '#/commerce/compare':    viewCompare,
    '#/commerce/billing':    viewBilling,

    /* landing */
    '#/pages/hero':          viewHero,
    '#/pages/features':      viewFeatures,
    '#/pages/faq':           viewFAQ,
    '#/pages/testimonials':  viewTestimonials,
    '#/pages/contact':       viewContact,
    '#/pages/navbar-footer': viewNavbarFooter,

    /* auth */
    '#/auth/forgot':       viewForgot,
    '#/auth/biometric':    viewBiometric,
    '#/errors/offline':    viewOffline,

    /* inspired */
    '#/inspired/notion':   viewNotion,
    '#/inspired/trello':   viewTrello,
    '#/inspired/linear':   viewLinear,
    '#/inspired/discord':  viewDiscord,
    '#/inspired/spotify':  viewSpotify,
    '#/inspired/apple':    viewApple,
    '#/inspired/vercel':   viewVercel,
    '#/inspired/stripe':   viewStripe,
    '#/inspired/airbnb':   viewAirbnb,
    '#/inspired/github':   viewGithub,

    /* specialty */
    '#/specialty/video-call': viewVideoCall,
    '#/specialty/whiteboard': viewWhiteboard,
    '#/specialty/calendar':   viewCalendar,
    '#/specialty/flow':       viewFlow,
    '#/specialty/reels':      viewReels,
    '#/specialty/qr':         viewQR,
    '#/specialty/dock':       viewDock,
    '#/specialty/gamify':     viewGamify,

    /* system */
    '#/system/a11y':       viewA11y,
    '#/system/security':   viewSecurity,
    '#/system/logs':       viewLogs,
    '#/system/monitoring': viewMonitoring,
  };

  /* Merge into the existing ROUTES table without overwriting authored entries. */
  Object.keys(NEW_ROUTES).forEach((k) => {
    if (!global.Views.ROUTES[k]) global.Views.ROUTES[k] = NEW_ROUTES[k];
  });
})(window);
