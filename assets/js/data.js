/* ----------------------------------------------------------------------
 * Demo data — users, products, transactions, notifications, etc.
 *
 * Pure static fixtures so every page has realistic-looking content
 * without a backend.  Helper RNG is seeded so re-renders are stable.
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  /* tiny seeded RNG (mulberry32) */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const r = rng(2026);

  /* avatar emoji + colored gradients */
  function avatar(initials, gradient) {
    return '<span class="avatar" style="background:' + gradient + '">' + initials + '</span>';
  }
  const GRADS = [
    'linear-gradient(135deg, #7c3aed, #d846ef)',
    'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    'linear-gradient(135deg, #f59e0b, #ec4899)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #f43f5e, #fb923c)',
    'linear-gradient(135deg, #22d3ee, #6366f1)',
    'linear-gradient(135deg, #84cc16, #06b6d4)',
    'linear-gradient(135deg, #d946ef, #f43f5e)',
  ];
  function avatarFor(name) {
    const parts = String(name).split(/\s+/);
    const ini = (parts[0]?.[0] || '?') + (parts[1]?.[0] || '');
    const grad = GRADS[name.charCodeAt(0) % GRADS.length];
    return avatar(ini.toUpperCase(), grad);
  }

  const USERS = [
    { id: 1, name: 'Alex Rivera',    role: 'Designer',    email: 'alex.rivera@vgf26.io',  status: 'online',  loc: 'Baku, AZ',        joined: '2025-03-12' },
    { id: 2, name: 'Sarah Jenkins',  role: 'PM',          email: 'sarah@vgf26.io',         status: 'busy',    loc: 'Berlin, DE',      joined: '2024-11-04' },
    { id: 3, name: 'Leo Kuznetsov',  role: 'Engineer',    email: 'leo.k@vgf26.io',         status: 'online',  loc: 'Almaty, KZ',      joined: '2026-01-22' },
    { id: 4, name: 'Maya Patel',     role: 'DevOps',      email: 'maya@vgf26.io',          status: 'offline', loc: 'Mumbai, IN',      joined: '2024-07-09' },
    { id: 5, name: 'Tomás Silva',    role: 'Marketing',   email: 'tomas@vgf26.io',         status: 'online',  loc: 'Lisbon, PT',      joined: '2025-09-30' },
    { id: 6, name: 'Aida Mammadli',  role: 'Support',     email: 'aida@vgf26.io',          status: 'online',  loc: 'Baku, AZ',        joined: '2026-02-18' },
    { id: 7, name: 'Yuki Tanaka',    role: 'Engineer',    email: 'yuki@vgf26.io',          status: 'busy',    loc: 'Tokyo, JP',       joined: '2024-12-01' },
    { id: 8, name: 'Olivia Chen',    role: 'Data',        email: 'olivia@vgf26.io',        status: 'online',  loc: 'Vancouver, CA',   joined: '2025-05-14' },
  ];

  const PRODUCTS = [
    { id: 'P-2901', name: 'Iridescent Mesh Tee',  sku: 'TEE-001', price: 49.00, stock: 142, cat: 'Apparel',   sales: 312 },
    { id: 'P-2902', name: 'Aurora Hoodie',         sku: 'HOO-014', price: 89.00, stock: 87,  cat: 'Apparel',   sales: 230 },
    { id: 'P-2903', name: 'Spectrum Sneakers',     sku: 'SNK-302', price: 159.00, stock: 41, cat: 'Footwear',  sales: 188 },
    { id: 'P-2904', name: 'Studio Backpack',       sku: 'BAG-201', price: 119.00, stock: 64, cat: 'Accessory', sales: 102 },
    { id: 'P-2905', name: 'Prism Cap',             sku: 'CAP-007', price: 29.00, stock: 220, cat: 'Accessory', sales: 287 },
    { id: 'P-2906', name: 'Holo Card Wallet',      sku: 'WAL-091', price: 39.00, stock: 154, cat: 'Accessory', sales: 173 },
    { id: 'P-2907', name: 'Iridescence Mug',       sku: 'MUG-021', price: 19.00, stock: 412, cat: 'Home',      sales: 510 },
    { id: 'P-2908', name: 'Aurora Lamp',           sku: 'LMP-505', price: 199.00, stock: 12, cat: 'Home',      sales: 38 },
  ];

  const ORDERS = [
    { id: '#9822', cust: 'Sarah Jenkins',  amount: 142.50, status: 'completed', date: '2m ago',  method: 'card' },
    { id: '#9821', cust: 'Tomás Silva',    amount:  89.00, status: 'pending',   date: '8m ago',  method: 'wallet' },
    { id: '#9820', cust: 'Aida Mammadli',  amount:  29.00, status: 'completed', date: '14m ago', method: 'card' },
    { id: '#9819', cust: 'Yuki Tanaka',    amount: 219.00, status: 'shipped',   date: '24m ago', method: 'card' },
    { id: '#9818', cust: 'Leo Kuznetsov',  amount: 178.00, status: 'completed', date: '42m ago', method: 'transfer' },
    { id: '#9817', cust: 'Maya Patel',     amount:  59.00, status: 'failed',    date: '1h ago',  method: 'card' },
    { id: '#9816', cust: 'Olivia Chen',    amount: 308.50, status: 'completed', date: '1h ago',  method: 'card' },
  ];

  const NOTIFICATIONS = [
    { id: 1, kind: 'order',   icon: 'cart',         text: 'New order #9822 from Sarah Jenkins',    time: '2m',  read: false },
    { id: 2, kind: 'team',    icon: 'user-plus',    text: 'Leo K. joined the Design team',          time: '45m', read: false },
    { id: 3, kind: 'warn',    icon: 'alert-circle', text: 'Cloud instance at 90% capacity',         time: '2h',  read: true  },
    { id: 4, kind: 'success', icon: 'check-circle', text: 'V2.4.1 deployed to production',          time: '4h',  read: true  },
    { id: 5, kind: 'note',    icon: 'message-circle', text: 'Maya commented on the Spectrum SKU',   time: '6h',  read: true  },
  ];

  const ACTIVITIES = [
    { who: 'Alex Rivera',   what: 'edited',  obj: 'design tokens', when: '2m',  icon: 'palette',   color: 'iris' },
    { who: 'Sarah Jenkins', what: 'merged',  obj: 'feature/checkout #312', when: '12m', icon: 'git', color: 'emerald' },
    { who: 'Maya Patel',    what: 'deployed', obj: 'v2.4.1 → production', when: '24m', icon: 'rocket', color: 'amber' },
    { who: 'Leo Kuznetsov', what: 'opened',  obj: 'PR #318 — fix ripple bug', when: '38m', icon: 'code-2', color: 'cyan' },
    { who: 'Tomás Silva',   what: 'started', obj: 'campaign “Aurora Drop”',   when: '1h',  icon: 'sparkles', color: 'fuchsia' },
    { who: 'Yuki Tanaka',   what: 'closed',  obj: '12 issues', when: '2h', icon: 'check-circle', color: 'emerald' },
  ];

  const CHANNELS = [
    { id: '#general',   unread: 0,  active: false },
    { id: '#design',    unread: 3,  active: true  },
    { id: '#dev',       unread: 1,  active: false },
    { id: '#marketing', unread: 7,  active: false },
    { id: '#random',    unread: 0,  active: false },
  ];

  const CHAT = [
    { id: 1, who: 'Sarah Jenkins',  text: 'New mockups dropped — let\'s review at 3pm',           time: '14:02', self: false },
    { id: 2, who: 'You',            text: 'Looks great. The card hover state is much smoother now.',time: '14:04', self: true  },
    { id: 3, who: 'Alex Rivera',    text: 'Pulled the latest. Light mode shadows still feel heavy.',time: '14:06', self: false },
    { id: 4, who: 'You',            text: 'I\'ll soften them. Pushing in a minute.',                time: '14:08', self: true  },
  ];

  /* monthly revenue series (12 months, AZN) */
  const REV = (() => {
    const base = 18000; const arr = [];
    for (let i = 0; i < 12; i++) arr.push(Math.round(base + (Math.sin(i / 1.7) + 1) * 6000 + r() * 4000));
    return arr;
  })();

  /* recent search suggestions (for command palette) */
  const PALETTE_SUGGESTIONS = [
    { label: 'Dashboard',         route: '#/',                 hint: 'Overview' },
    { label: 'Cards',             route: '#/cards',            hint: 'Layout' },
    { label: 'Pricing tables',    route: '#/commerce/pricing', hint: 'Commerce' },
    { label: 'Charts · Line',     route: '#/charts/line',      hint: 'Charts' },
    { label: 'Command palette',   route: '#/nav/palette',      hint: 'Navigation' },
    { label: 'Login screen',      route: '#/auth/login',       hint: 'Auth' },
    { label: 'Glassmorphism',     route: '#/effects/morphism', hint: 'Effects' },
    { label: 'AI Chat',           route: '#/specialty/chat',   hint: 'Specialty' },
  ];

  /* ── Pexels stock photography ─────────────────────────────────── *
   * Public-domain photos from pexels.com — direct CDN URLs, no API
   * call required. Tinysrgb auto-compressed for fast loading. */
  function pex(id, title, tag) {
    return {
      thumb: 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=600',
      large: 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=1600',
      title, tag,
    };
  }
  const PEXELS = [
    pex(1366919, 'Mountain peak at dawn',           'Nature'),
    pex(189349,  'Tropical beach',                   'Travel'),
    pex(2104882, 'City night skyline',               'Urban'),
    pex(167699,  'Forest path',                      'Nature'),
    pex(235621,  'Golden hour sunset',               'Landscape'),
    pex(220769,  'Modern architecture',              'Urban'),
    pex(1640777, 'Vibrant food',                     'Lifestyle'),
    pex(302899,  'Espresso pour',                    'Lifestyle'),
    pex(847402,  'Desert dunes',                     'Nature'),
    pex(1933316, 'Aurora over fjord',                'Nature'),
    pex(33109,   'Galaxy stars',                     'Abstract'),
    pex(56866,   'Pink roses',                       'Nature'),
    pex(271624,  'Modern living room',               'Interior'),
    pex(3052361, 'Foggy skyline',                    'Urban'),
    pex(1287145, 'Mountain road',                    'Travel'),
    pex(733176,  'Northern lights',                  'Nature'),
    pex(1430676, 'Tropical island',                  'Travel'),
    pex(417173,  'Snowy mountains',                  'Nature'),
    pex(210186,  'Lake reflection',                  'Landscape'),
    pex(36717,   'Iceberg ocean',                    'Nature'),
  ];

  /* Curated property images for Airbnb-style cards. */
  const PROPERTIES = [
    pex(1571460, 'Iridescent loft',     'Baku, AZ'),
    pex(106399,  'Aurora suite',        'Berlin, DE'),
    pex(2079246, 'Spectrum apartment',  'Tokyo, JP'),
    pex(1571460, 'Prism penthouse',     'Lisbon, PT'),
    pex(323780,  'Glass villa',         'New York, US'),
    pex(259962,  'Crystal cabin',       'Paris, FR'),
    pex(245208,  'Neon studio',         'Seoul, KR'),
    pex(2079249, 'Holo retreat',        'Sydney, AU'),
  ];

  global.DEMO = {
    USERS, PRODUCTS, ORDERS, NOTIFICATIONS, ACTIVITIES, CHANNELS, CHAT, REV,
    PALETTE_SUGGESTIONS, GRADS, PEXELS, PROPERTIES, avatarFor, avatar,
  };
})(window);
