# Admin Panel VGF26 — Iridescent Admin Studio

A comprehensive, zero-build admin panel template — **220+ UI components**
across 16 categories, **light and dark themes**, **AZ / EN / RU
internationalization**, and a custom **140+ SVG icon library** — all
served from plain HTML, TailwindCSS (Play CDN), and a few KB of vanilla
JavaScript.

> One distinct aesthetic — *Iridescent UI*. Violet → fuchsia → cyan
> gradients, soft glass surfaces, gentle aurora background blobs. No
> npm install. No build step. Just open `index.html`.

## Highlights

| | |
|---|---|
| **Themes**        | Light + Dark (CSS variables, no flicker on first paint) |
| **Languages**     | 🇦🇿 Azerbaijani · 🇬🇧 English · 🇷🇺 Russian |
| **Components**    | 220+ across 16 sidebar sections |
| **Icons**         | 140+ stroke-only SVGs in `assets/js/icons.js` |
| **Router**        | Hash-based, no frameworks (`#/cards`, `#/charts/line`, …) |
| **Charts**        | Pure inline SVG — line, area, bar, donut, radar (no chart library) |
| **Effects**       | Aurora blobs · particles canvas · glassmorphism · gradient borders · tilt · glow |
| **Modals / Toasts** | Portal-based; ConfirmModal + PromptModal replace native `confirm/prompt` |
| **Command palette** | `⌘K` / `Ctrl+K` opens fuzzy search across all pages |
| **Build step**    | None — runs from disk, GitHub Pages, or any static host |

---

## Quick start

```bash
# Just open the file:
start index.html              # Windows
open  index.html              # macOS
xdg-open index.html            # Linux

# Or serve over HTTP (any static server works):
python -m http.server 5180
# → http://localhost:5180
```

That's it.  No npm install, no build pipeline, no environment variables.

---

## What's inside

```
Admin Panel VGF26/
├── index.html                  # App shell (sidebar / topbar / footer slots)
├── README.md
├── LICENSE                     # MIT
├── img/                        # AdminLTE 4 reference screenshots (input)
└── assets/
    ├── css/
    │   └── app.css            # Theme tokens · Iridescent design system
    ├── img/
    │   └── favicon.svg
    └── js/
        ├── icons.js           # 140+ SVG icons (Icons.get / Icons.svg)
        ├── i18n.js            # Translation engine (AZ / EN / RU)
        ├── data.js            # Demo data (users, orders, products, …)
        ├── nav.js             # Sidebar tree — 16 sections, 220+ leaves
        ├── views.js           # Page templates (router targets)
        ├── components.js      # Toast / Modal / Palette / Charts / DnD / Particles
        └── app.js             # Bootstrap: sidebar + topbar + router + theme + i18n
```

---

## The 16 sidebar sections

1. **Overview**            — Dashboard + 5 specialised dashboards (Analytics, SaaS, CRM, Finance, E-commerce)
2. **Layout & Containers** — Cards (20 variants), Grids (10), Page layouts, Split pane, Docks, Sticky chrome
3. **Data Display**        — Lists (14), Tables (8), Kanban, Tree, Timeline, Pagination, Avatars, Badges, Ratings
4. **Media & Gallery**     — Carousel, Slider, Masonry, Lightbox, Image Zoom / Cropper / Compare, Marquee, Maps
5. **Forms & Input**       — Inputs, Selects, Date/Time/Color pickers, OTP, File upload, Rich text + Markdown + Code editors
6. **Navigation**          — Mega menu, Dropdown, Context, Command palette, Tabs, Breadcrumb, Stepper, FAB
7. **Overlays & Feedback** — Modal, Drawer, Offcanvas, Popover, Tooltip, Toast, Snackbar, Alert, Progress, Skeleton
8. **Effects & Motion**    — Glass / Neumorphism / Frosted, Glow / Gradient border, Tilt / 3D, Parallax, Particles, Aurora, Confetti
9. **Charts & Data Viz**   — Line / Area, Bar / Stacked, Pie / Donut / Radar, Scatter / Bubble / Tree map, Sparkline, Candlestick, Heatmap
10. **Dashboards**         — Admin, Analytics, SaaS, CRM, Finance, E-commerce, Crypto, NFT, IoT / Smart Home, DevTools, Streaming, Gaming HUD
11. **Commerce & SaaS**    — Storefront, Cart, Checkout, Comparison, Pricing, Billing / Subscription / API keys
12. **Landing & Marketing**— Hero / CTA, Features, FAQ, Testimonials, Contact / Newsletter, Navbar / Footer
13. **Auth & Errors**      — Login, Signup, Forgot, Reset, Verify, Biometric / Face ID, 404 / 500 / Maintenance / Offline
14. **Inspired UIs**       — Notion · Trello · Linear · Discord · Spotify · Apple hero · Stripe gradient · Vercel dark · Airbnb cards · GitHub graph
15. **Specialty Widgets**  — AI Chat, Video call, Whiteboard / Mind map, Calendar / Scheduler, Org chart, Reels, QR, macOS dock, Gamification
16. **System**             — Icon library, Theme generator, i18n, Accessibility, Settings, Security / API keys, Logs, Monitoring

> Every sidebar entry is wired to a route in `nav.js`.  Pages without a
> custom view get a polished placeholder linking back to the catalog —
> add a function to `views.js` to author it.

---

## Keyboard shortcuts

| Shortcut       | Action                          |
|----------------|---------------------------------|
| `⌘K` / `Ctrl K`| Open command palette            |
| `⌘/` / `Ctrl /`| Collapse / expand the sidebar   |
| `Esc`          | Close any open modal or palette |

---

## Adding a new component page

1. Add a leaf to `assets/js/nav.js`:
   ```js
   { id: 'my-widget', title: 'My widget', route: '#/widgets/my', icon: 'sparkles' }
   ```
2. Author the view in `assets/js/views.js`:
   ```js
   function viewMyWidget() {
     return pageHead('My widget', 'Description…', [{title: 'Widgets'}, {title: 'My'}])
          + section('Demo', '<div class="card card-pad">Hello world!</div>');
   }
   ```
3. Register the route:
   ```js
   const ROUTES = { …, '#/widgets/my': viewMyWidget };
   ```
4. Done — refresh the page.

---

## Adding a new theme

Open `assets/css/app.css` and duplicate the `:root` token block:

```css
html[data-theme="custom"] {
  --bg:    /* your background rgb triplet */;
  --iris:  /* your primary rgb triplet */;
  /* …override what you need… */
}
```

Then set the value in `localStorage`:

```js
localStorage.setItem('vgf26-theme', 'custom');
location.reload();
```

The pre-paint script in `index.html` honours any `data-theme` value before
React/Vue/etc. would normally hydrate — so there's no flash of unstyled
content.

---

## Adding a new language

Add a top-level entry to `STR` in `assets/js/i18n.js`:

```js
STR.tr = {
  'topbar.search':     'Bir şey ara…',
  'common.dashboard':  'Kontrol Paneli',
  /* … */
};
```

Then any call to `I18n.setLang('tr')` flips the entire UI.

---

## Customising the icon library

`assets/js/icons.js` ships 140+ icons.  Add yours:

```js
LIB['custom-thing'] = '<circle cx="12" cy="12" r="9"/>';
```

Then use it anywhere:

```js
Icons.get('custom-thing', { size: 20, class: 'text-iris' });
```

The icon viewer at `#/system/icons` indexes the library automatically.

---

## Browser support

Tested on the current versions of Chrome, Edge, Firefox, and Safari.  No
polyfills required — modern ES2020 syntax (optional chaining, nullish
coalescing, template literals) is used throughout.

---

## License

MIT © 2026 Vugar Familoglu — see `LICENSE`.
