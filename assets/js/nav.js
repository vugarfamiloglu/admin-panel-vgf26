/* ----------------------------------------------------------------------
 * Navigation tree.  16 sections, ~220 leaf entries.
 *
 * Each section: { id, titleKey, icon, items }
 * Each item:    { id, title, route, icon?, badge? }
 *
 * `route` is the hash path (#/cards/profile).  If absent, the leaf
 * still renders an "Under construction" page from views.js.
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  const NAV = [
    /* ── Overview ──────────────────────────────────────────────── */
    {
      id: 'overview', titleKey: 'sidebar.section.overview', icon: 'layout-dashboard',
      items: [
        { id: 'home',          title: 'Dashboard',           route: '#/',                icon: 'home' },
        { id: 'analytics',     title: 'Analytics Dashboard', route: '#/dashboards/analytics', icon: 'chart-line' },
        { id: 'saas',          title: 'SaaS Dashboard',      route: '#/dashboards/saas',      icon: 'rocket' },
        { id: 'crm',           title: 'CRM Dashboard',       route: '#/dashboards/crm',       icon: 'users' },
        { id: 'finance',       title: 'Finance Dashboard',   route: '#/dashboards/finance',   icon: 'dollar' },
        { id: 'ecommerce',     title: 'E-commerce Dashboard',route: '#/dashboards/ecommerce', icon: 'cart' },
      ],
    },

    /* ── Layout & containers ───────────────────────────────────── */
    {
      id: 'layout', titleKey: 'sidebar.section.layout', icon: 'grid',
      items: [
        { id: 'cards',         title: 'Cards · 20 variants',           route: '#/cards',            icon: 'card-stack', badge: '20' },
        { id: 'grids',         title: 'Grids · 10 variants',           route: '#/grids',            icon: 'grid',       badge: '10' },
        { id: 'layouts',       title: 'Page Layouts',                  route: '#/layouts',          icon: 'columns' },
        { id: 'split-pane',    title: 'Split Pane · Resizable',        route: '#/layouts/split',    icon: 'panel-right' },
        { id: 'docks',         title: 'Dockable Windows · IDE-style',  route: '#/layouts/docks',    icon: 'sidebar' },
        { id: 'sticky',        title: 'Sticky Header / Sidebar / Footer', route: '#/layouts/sticky', icon: 'arrow-up-right' },
      ],
    },

    /* ── Data display ──────────────────────────────────────────── */
    {
      id: 'data', titleKey: 'sidebar.section.data', icon: 'table',
      items: [
        { id: 'lists',          title: 'Lists · 14 variants',          route: '#/lists',          icon: 'list',  badge: '14' },
        { id: 'tables',         title: 'Tables · 8 variants',          route: '#/tables',         icon: 'table', badge: '8' },
        { id: 'kanban',         title: 'Kanban Board',                 route: '#/kanban',         icon: 'kanban' },
        { id: 'tree',           title: 'Tree View',                    route: '#/tree',           icon: 'tree' },
        { id: 'timeline',       title: 'Timeline · Activity feed',     route: '#/timeline',       icon: 'history' },
        { id: 'pagination',     title: 'Pagination + Infinite scroll', route: '#/pagination',     icon: 'more-horizontal' },
        { id: 'avatars',        title: 'Avatars · Stacks · Groups',    route: '#/avatars',        icon: 'users' },
        { id: 'badges',         title: 'Badges · Chips · Tags',        route: '#/badges',         icon: 'tag' },
        { id: 'ratings',        title: 'Rating Stars · Emoji picker',  route: '#/ratings',        icon: 'star' },
      ],
    },

    /* ── Media ─────────────────────────────────────────────────── */
    {
      id: 'media', titleKey: 'sidebar.section.media', icon: 'image',
      items: [
        { id: 'gallery',       title: 'Gallery · Masonry · Lightbox',  route: '#/gallery',        icon: 'gallery' },
        { id: 'carousel',      title: 'Carousel · Slider · Swiper',    route: '#/carousel',       icon: 'image' },
        { id: 'image-zoom',    title: 'Image Zoom · Cropper · Compare',route: '#/image-zoom',     icon: 'expand' },
        { id: 'marquee',       title: 'Marquee · Logo slider',         route: '#/marquee',        icon: 'arrow-right' },
        { id: 'video',         title: 'Video / Audio Player',          route: '#/media-player',   icon: 'video' },
        { id: 'maps',          title: 'Map · Heatmap',                 route: '#/maps',           icon: 'map' },
      ],
    },

    /* ── Forms ─────────────────────────────────────────────────── */
    {
      id: 'forms', titleKey: 'sidebar.section.forms', icon: 'edit',
      items: [
        { id: 'inputs',        title: 'Inputs · Selects · Toggles',    route: '#/forms/inputs',   icon: 'edit' },
        { id: 'pickers',       title: 'Date · Time · Color pickers',   route: '#/forms/pickers',  icon: 'calendar' },
        { id: 'upload',        title: 'File Upload · Drag & Drop',     route: '#/forms/upload',   icon: 'upload' },
        { id: 'otp',           title: 'OTP / PIN input',               route: '#/forms/otp',      icon: 'key' },
        { id: 'editor',        title: 'Rich Text / Markdown / Code',   route: '#/forms/editor',   icon: 'code-2' },
        { id: 'search-bar',    title: 'Search · Filter · Autocomplete',route: '#/forms/search',   icon: 'search' },
        { id: 'wizard',        title: 'Wizard / Stepper Form',         route: '#/forms/wizard',   icon: 'columns' },
      ],
    },

    /* ── Navigation ────────────────────────────────────────────── */
    {
      id: 'nav', titleKey: 'sidebar.section.nav', icon: 'menu',
      items: [
        { id: 'menus',         title: 'Mega · Dropdown · Context',     route: '#/nav/menus',      icon: 'menu' },
        { id: 'tabs',          title: 'Tabs · Vertical · Pills',       route: '#/nav/tabs',       icon: 'tabs' },
        { id: 'breadcrumb',    title: 'Breadcrumb',                    route: '#/nav/breadcrumb', icon: 'breadcrumb' },
        { id: 'stepper',       title: 'Stepper',                       route: '#/nav/stepper',   icon: 'check-circle' },
        { id: 'palette',       title: 'Command Palette (Cmd+K)',       route: '#/nav/palette',    icon: 'sparkles' },
        { id: 'bottom-nav',    title: 'Bottom / Top / Hamburger Nav',  route: '#/nav/bottom',     icon: 'menu-collapse' },
        { id: 'fab',           title: 'Floating Action Button',        route: '#/nav/fab',        icon: 'plus' },
      ],
    },

    /* ── Overlays & feedback ───────────────────────────────────── */
    {
      id: 'overlays', titleKey: 'sidebar.section.overlays', icon: 'alert-circle',
      items: [
        { id: 'modals',        title: 'Modal · Drawer · Offcanvas',    route: '#/overlays/modals',     icon: 'card-stack' },
        { id: 'popovers',      title: 'Popover · Tooltip',             route: '#/overlays/popovers',   icon: 'message-circle' },
        { id: 'toasts',        title: 'Toast · Snackbar · Alert',      route: '#/overlays/toasts',     icon: 'bell' },
        { id: 'banner',        title: 'Announcement bar',              route: '#/overlays/banner',     icon: 'flag' },
        { id: 'progress',      title: 'Progress · Spinner · Skeleton', route: '#/overlays/progress',   icon: 'refresh' },
        { id: 'empty',         title: 'Empty / Error / Success states',route: '#/overlays/states',     icon: 'info' },
      ],
    },

    /* ── Effects & motion ──────────────────────────────────────── */
    {
      id: 'effects', titleKey: 'sidebar.section.effects', icon: 'sparkles',
      items: [
        { id: 'morphism',      title: 'Glass · Neumorphism · Frosted', route: '#/effects/morphism',    icon: 'sparkles-2' },
        { id: 'glow',          title: 'Glow · Gradient border · Shadow', route: '#/effects/glow',      icon: 'sparkles' },
        { id: 'tilt',          title: 'Tilt · 3D Rotate · Hover Zoom', route: '#/effects/tilt',        icon: 'box' },
        { id: 'parallax',      title: 'Parallax · Reveal · Scroll',    route: '#/effects/parallax',    icon: 'arrow-up-right' },
        { id: 'particles',     title: 'Particle BG · Aurora · Blobs',  route: '#/effects/particles',   icon: 'sparkles-2' },
        { id: 'transitions',   title: 'Page · Route · Micro animations',route:'#/effects/transitions', icon: 'zap' },
        { id: 'cursor',        title: 'Cursor Trail · Magnetic Button',route: '#/effects/cursor',      icon: 'compass' },
        { id: 'confetti',      title: 'Confetti · Fireworks · Floating',route:'#/effects/confetti',    icon: 'star' },
      ],
    },

    /* ── Charts & dataviz ──────────────────────────────────────── */
    {
      id: 'charts', titleKey: 'sidebar.section.charts', icon: 'chart-line',
      items: [
        { id: 'chart-line',    title: 'Line / Area chart',             route: '#/charts/line',        icon: 'chart-line' },
        { id: 'chart-bar',     title: 'Bar / Stacked bar',             route: '#/charts/bar',         icon: 'chart-bar' },
        { id: 'chart-pie',     title: 'Pie · Donut · Radar',           route: '#/charts/pie',         icon: 'chart-pie' },
        { id: 'chart-scatter', title: 'Scatter · Bubble · Tree Map',   route: '#/charts/scatter',     icon: 'chart-radar' },
        { id: 'sparklines',    title: 'Sparklines · Gauges',           route: '#/charts/sparkline',   icon: 'activity' },
        { id: 'candle',        title: 'Candlestick · OHLC',            route: '#/charts/candle',      icon: 'chart-bar' },
        { id: 'heatmap',       title: 'Heatmap · Calendar matrix',     route: '#/charts/heatmap',     icon: 'calendar' },
      ],
    },

    /* ── Dashboards ───────────────────────────────────────────── */
    {
      id: 'dashboards', titleKey: 'sidebar.section.dashboards', icon: 'gauge',
      items: [
        { id: 'admin-board',  title: 'Admin Dashboard',                route: '#/',                    icon: 'home' },
        { id: 'crypto',       title: 'Crypto Dashboard',               route: '#/dashboards/crypto',   icon: 'flame' },
        { id: 'nft',          title: 'NFT Marketplace',                route: '#/dashboards/nft',      icon: 'sparkles' },
        { id: 'iot',          title: 'IoT · Smart Home',               route: '#/dashboards/iot',      icon: 'cpu' },
        { id: 'devops',       title: 'DevTools · Server metrics · Logs', route: '#/dashboards/devops', icon: 'server' },
        { id: 'streaming',    title: 'Streaming · OBS style',          route: '#/dashboards/streaming',icon: 'video' },
        { id: 'gaming',       title: 'Game HUD · Inventory · Leaderboard', route: '#/dashboards/gaming', icon: 'trophy' },
      ],
    },

    /* ── Commerce / SaaS ──────────────────────────────────────── */
    {
      id: 'commerce', titleKey: 'sidebar.section.commerce', icon: 'cart',
      items: [
        { id: 'storefront',   title: 'Marketplace storefront',        route: '#/commerce/storefront',  icon: 'package' },
        { id: 'cart',         title: 'Shopping Cart · Wishlist',      route: '#/commerce/cart',        icon: 'cart' },
        { id: 'checkout',     title: 'Multi-step Checkout',           route: '#/commerce/checkout',    icon: 'credit-card' },
        { id: 'compare',      title: 'Product Comparison · Quick view', route: '#/commerce/compare',   icon: 'columns' },
        { id: 'pricing',      title: 'Pricing Tables',                route: '#/commerce/pricing',     icon: 'dollar' },
        { id: 'billing',      title: 'Billing · Subscription · API Keys', route: '#/commerce/billing', icon: 'wallet' },
      ],
    },

    /* ── Landing / marketing ──────────────────────────────────── */
    {
      id: 'pages', titleKey: 'sidebar.section.pages', icon: 'rocket',
      items: [
        { id: 'hero',         title: 'Hero · CTA Sections',           route: '#/pages/hero',          icon: 'sparkles' },
        { id: 'features',     title: 'Features · About sections',     route: '#/pages/features',      icon: 'puzzle' },
        { id: 'faq',          title: 'FAQ accordion',                 route: '#/pages/faq',           icon: 'help-circle' },
        { id: 'testimonials', title: 'Testimonials',                  route: '#/pages/testimonials',  icon: 'message-circle' },
        { id: 'contact',      title: 'Contact · Newsletter',          route: '#/pages/contact',       icon: 'mail' },
        { id: 'navbar-foot',  title: 'Navbar · Footer · Sticky bar',  route: '#/pages/navbar-footer', icon: 'menu' },
      ],
    },

    /* ── Auth & error ─────────────────────────────────────────── */
    {
      id: 'auth', titleKey: 'sidebar.section.auth', icon: 'lock',
      items: [
        { id: 'login',        title: 'Login / Signup',                route: '#/auth/login',          icon: 'log-in' },
        { id: 'forgot',       title: 'Forgot · Reset · Verify',       route: '#/auth/forgot',         icon: 'key' },
        { id: 'biometric',    title: 'Biometric · Face ID',           route: '#/auth/biometric',      icon: 'fingerprint' },
        { id: '404',          title: '404 · 500 · Maintenance',       route: '#/errors',              icon: 'alert-triangle' },
        { id: 'offline',      title: 'Offline · PWA',                 route: '#/errors/offline',      icon: 'cloud' },
      ],
    },

    /* ── Inspired UIs ─────────────────────────────────────────── */
    {
      id: 'inspired', titleKey: 'sidebar.section.inspired', icon: 'palette',
      items: [
        { id: 'notion',       title: 'Notion-style editor',           route: '#/inspired/notion',     icon: 'edit' },
        { id: 'trello',       title: 'Trello board',                  route: '#/inspired/trello',     icon: 'kanban' },
        { id: 'linear',       title: 'Linear issue tracker',          route: '#/inspired/linear',     icon: 'check-circle' },
        { id: 'discord',      title: 'Discord workspace',             route: '#/inspired/discord',    icon: 'message-circle' },
        { id: 'spotify',      title: 'Spotify player',                route: '#/inspired/spotify',    icon: 'music' },
        { id: 'apple-hero',   title: 'Apple-style hero',              route: '#/inspired/apple',      icon: 'sparkles' },
        { id: 'vercel',       title: 'Vercel dark gradient',          route: '#/inspired/vercel',     icon: 'rocket' },
        { id: 'stripe',       title: 'Stripe gradient UI',            route: '#/inspired/stripe',     icon: 'credit-card' },
        { id: 'airbnb',       title: 'Airbnb card grid',              route: '#/inspired/airbnb',     icon: 'home' },
        { id: 'github',       title: 'GitHub contribution graph',     route: '#/inspired/github',     icon: 'github' },
      ],
    },

    /* ── Specialty ─────────────────────────────────────────────── */
    {
      id: 'specialty', titleKey: 'sidebar.section.specialty', icon: 'puzzle',
      items: [
        { id: 'chat',         title: 'AI Chat interface',             route: '#/specialty/chat',      icon: 'message-circle' },
        { id: 'video-call',   title: 'Video call · Screen share',     route: '#/specialty/video-call',icon: 'video' },
        { id: 'whiteboard',   title: 'Whiteboard · Mind Map · Flow',  route: '#/specialty/whiteboard',icon: 'puzzle' },
        { id: 'calendar',     title: 'Calendar · Scheduler',          route: '#/specialty/calendar',  icon: 'calendar' },
        { id: 'flow',         title: 'Org chart · Node graph',        route: '#/specialty/flow',      icon: 'tree' },
        { id: 'reels',        title: 'Reels · Stories · Feed',        route: '#/specialty/reels',     icon: 'play' },
        { id: 'qr',           title: 'QR generator · Barcode',        route: '#/specialty/qr',        icon: 'qr' },
        { id: 'dock',         title: 'macOS dock · Dynamic Island',   route: '#/specialty/dock',      icon: 'smartphone' },
        { id: 'duolingo',     title: 'Gamification · XP · Quests',    route: '#/specialty/gamify',    icon: 'trophy' },
      ],
    },

    /* ── System ───────────────────────────────────────────────── */
    {
      id: 'system', titleKey: 'sidebar.section.system', icon: 'settings',
      items: [
        { id: 'icons',        title: 'Icon library (140+)',           route: '#/system/icons',        icon: 'box' },
        { id: 'theme',        title: 'Theme generator',               route: '#/system/theme',        icon: 'palette' },
        { id: 'i18n',         title: 'Languages · i18n',              route: '#/system/i18n',         icon: 'languages' },
        { id: 'a11y',         title: 'Accessibility controls',        route: '#/system/a11y',         icon: 'eye' },
        { id: 'settings',     title: 'Settings · Preferences',        route: '#/system/settings',     icon: 'settings' },
        { id: 'security',     title: 'Security · API keys',           route: '#/system/security',     icon: 'shield' },
        { id: 'logs',         title: 'Logs viewer · JSON · Diff',     route: '#/system/logs',         icon: 'code' },
        { id: 'monitoring',   title: 'Monitoring · Status indicator', route: '#/system/monitoring',   icon: 'activity' },
      ],
    },
  ];

  global.NAV = NAV;
})(window);
