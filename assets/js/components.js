/* ----------------------------------------------------------------------
 * Per-page initializers + reusable UI bits (Toast, Modal, Palette,
 * Charts, Particles, DnD, etc.).
 *
 * `Components.mount(root)` is called whenever the router renders a
 * page — it scans for `data-chart`, `data-mount`, etc. and wires them up.
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  const I = (n, opts) => Icons.get(n, opts || {});

  /* ── Toast ──────────────────────────────────────────────────────── */
  function toast(kind, title, body, ttl) {
    const host = document.getElementById('toast-host');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast toast-' + (kind || 'info');
    el.innerHTML =
      '<div class="grid place-items-center w-7 h-7 rounded-lg shrink-0" style="background:rgb(var(--' + (kind==='success'?'emerald':kind==='warn'?'amber':kind==='error'?'rose':'iris') + ')/.14);color:rgb(var(--' + (kind==='success'?'emerald':kind==='warn'?'amber':kind==='error'?'rose':'iris') + '))">'
      + I(kind === 'success' ? 'check-circle' : kind === 'warn' ? 'alert-triangle' : kind === 'error' ? 'alert-circle' : 'info', { size: 16 })
      + '</div>'
      + '<div class="flex-1 pr-2"><div class="font-semibold text-sm">' + (title || 'Notice') + '</div>'
      + (body ? '<div class="text-xs text-muted mt-1">' + body + '</div>' : '') + '</div>'
      + '<button class="text-muted hover:text-iris" style="padding:0">' + I('x', { size: 14 }) + '</button>';
    host.appendChild(el);
    const dismiss = () => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; setTimeout(() => el.remove(), 200); };
    el.querySelector('button').addEventListener('click', dismiss);
    setTimeout(dismiss, ttl || 4500);
  }

  /* ── Modal ─────────────────────────────────────────────────────── */
  function modal(opts) {
    const host = document.getElementById('modal-host');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-panel ' + (opts.size || '') + '">'
      + (opts.title ? '<div class="modal-head"><h3>' + opts.title + '</h3><button class="btn btn-ghost btn-xs" data-close>' + I('x') + '</button></div>' : '')
      + '<div class="modal-body">' + (opts.body || '') + '</div>'
      + (opts.footer !== false ? '<div class="modal-foot">' + (opts.footer || '<button class="btn btn-secondary" data-close>Close</button>') + '</div>' : '')
      + '</div>';
    function close() {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 150);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    if (opts.onMount) opts.onMount(overlay, close);
    document.addEventListener('keydown', onKey);
    host.appendChild(overlay);
    return close;
  }

  function confirmModal(opts) {
    return modal({
      size: 'sm',
      title: opts.title || 'Confirm',
      body: '<p class="text-sm">' + (opts.message || 'Are you sure?') + '</p>',
      footer: '<button class="btn btn-secondary" data-close>' + (opts.cancelLabel || 'Cancel') + '</button>'
            + '<button class="btn ' + (opts.destructive ? 'btn-danger' : 'btn-primary') + '" data-confirm>' + (opts.confirmLabel || 'Confirm') + '</button>',
      onMount: (overlay, close) => {
        overlay.querySelector('[data-confirm]').addEventListener('click', () => { (opts.onConfirm || (()=>{}))(); close(); });
      },
    });
  }

  /* ── Command palette ──────────────────────────────────────────── */
  function openPalette() {
    const close = modal({
      title: 'Command palette',
      size: 'md',
      body:
        '<div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">' + I('search') + '</span>'
        + '<input id="palette-input" class="input" placeholder="Search anything…" style="padding-left:36px;height:44px"></div>'
        + '<div id="palette-results" class="mt-3 max-h-[300px] overflow-y-auto"></div>'
        + '<div class="mt-3 flex items-center justify-between text-[11px] text-muted"><span><span class="kbd">↑</span> <span class="kbd">↓</span> navigate · <span class="kbd">↵</span> open</span><span><span class="kbd">esc</span> close</span></div>',
      footer: false,
      onMount: (overlay, close) => {
        const input = overlay.querySelector('#palette-input');
        const out   = overlay.querySelector('#palette-results');
        const items = [
          ...DEMO.PALETTE_SUGGESTIONS,
          ...(NAV || []).flatMap((s) => s.items.map((it) => ({ label: it.title, route: it.route, hint: s.titleKey?.split('.').pop() || '' }))),
        ];
        let sel = 0;
        function render(q) {
          const filtered = items.filter((it) => !q || it.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
          if (!filtered.length) { out.innerHTML = '<div class="text-center text-sm text-muted py-6">No matches</div>'; return; }
          out.innerHTML = filtered.map((it, i) =>
            '<a href="' + it.route + '" data-i="' + i + '" class="flex items-center gap-3 p-3 rounded-xl ' + (i === sel ? 'bg-[rgb(var(--iris-soft))]' : 'hover:bg-soft') + '">'
            + '<span class="text-iris">' + I('arrow-right', { size: 14 }) + '</span>'
            + '<span class="flex-1">' + it.label + '</span>'
            + '<span class="pill pill-muted">' + it.hint + '</span>'
            + '</a>'
          ).join('');
          out.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close()));
        }
        render('');
        input.addEventListener('input', () => { sel = 0; render(input.value); });
        input.addEventListener('keydown', (e) => {
          const items = out.querySelectorAll('a');
          if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, items.length - 1); render(input.value); e.preventDefault(); }
          if (e.key === 'ArrowUp')   { sel = Math.max(sel - 1, 0);                  render(input.value); e.preventDefault(); }
          if (e.key === 'Enter') { items[sel]?.click(); }
        });
        setTimeout(() => input.focus(), 50);
      },
    });
    return close;
  }

  /* ── Charts (pure SVG, no library) ─────────────────────────────── */
  function chartLine(host, opts) {
    opts = opts || {};
    const w = opts.width || host.clientWidth || 600;
    const h = opts.height || 240;
    const data = opts.data || DEMO.REV;
    const pad = 24;
    const max = Math.max(...data), min = Math.min(...data);
    const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1));
    const ys = data.map((v) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2));
    const path = xs.map((x, i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + ys[i].toFixed(1)).join(' ');
    const area = path + ' L' + xs[xs.length - 1] + ' ' + (h - pad) + ' L' + xs[0] + ' ' + (h - pad) + ' Z';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    host.innerHTML =
      '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
      + '<defs>'
      + '  <linearGradient id="gline" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".35"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></linearGradient>'
      + '  <linearGradient id="gstroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#d846ef"/></linearGradient>'
      + '</defs>'
      + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('')
      + '<path d="' + area + '" fill="url(#gline)"/>'
      + '<path d="' + path + '" stroke="url(#gstroke)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      + xs.map((x, i) => '<circle class="chart-point" cx="' + x + '" cy="' + ys[i] + '" r="4" fill="#fff" stroke="url(#gstroke)" stroke-width="2" data-v="$' + data[i].toLocaleString() + '" data-l="' + months[i % 12] + ' 2026"/>').join('')
      + '<g class="chart-axis">' + xs.map((x, i) => '<text x="' + x + '" y="' + (h - 6) + '" text-anchor="middle">' + months[i % 12] + '</text>').join('') + '</g>'
      + '</svg>';
  }

  function chartBar(host) {
    const data = [40, 65, 35, 80, 52, 90, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const w = host.clientWidth || 600, h = 240, pad = 28;
    const bw = (w - pad * 2) / data.length * 0.6;
    const gap = (w - pad * 2) / data.length;
    const max = Math.max(...data);
    host.innerHTML =
      '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
      + '<defs><linearGradient id="gbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d846ef"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>'
      + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('')
      + data.map((v, i) => {
          const bh = (v / max) * (h - pad * 2);
          const x = pad + i * gap + (gap - bw) / 2;
          const y = h - pad - bh;
          return '<rect class="chart-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="6" fill="url(#gbar)" data-v="' + v + '" data-l="' + labels[i] + '"/>';
        }).join('')
      + '<g class="chart-axis">' + labels.map((l, i) => '<text x="' + (pad + i * gap + gap/2) + '" y="' + (h - 6) + '" text-anchor="middle">' + l + '</text>').join('') + '</g>'
      + '</svg>';
  }

  function chartDonut(host, opts) {
    opts = opts || {};
    const data = opts.data || [
      { label: 'Direct',   value: 38, color: '#7c3aed' },
      { label: 'Organic',  value: 27, color: '#d846ef' },
      { label: 'Referral', value: 18, color: '#22d3ee' },
      { label: 'Social',   value: 12, color: '#10b981' },
      { label: 'Other',    value:  5, color: '#f59e0b' },
    ];
    const total = data.reduce((a, b) => a + b.value, 0);
    const r = 64, cx = 100, cy = 100, inner = 44;
    let acc = -Math.PI / 2;
    const arcs = data.map((d) => {
      const ang = (d.value / total) * Math.PI * 2;
      const a0 = acc, a1 = acc + ang; acc = a1;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const ix0 = cx + inner * Math.cos(a1), iy0 = cy + inner * Math.sin(a1);
      const ix1 = cx + inner * Math.cos(a0), iy1 = cy + inner * Math.sin(a0);
      const large = ang > Math.PI ? 1 : 0;
      return '<path class="chart-slice" d="M' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1 + ' ' + y1
           + ' L' + ix0 + ' ' + iy0 + ' A' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + ix1 + ' ' + iy1 + ' Z" fill="' + d.color + '" data-v="' + d.value + '" data-l="' + d.label + '"/>';
    }).join('');
    host.innerHTML =
      '<svg width="200" height="200" viewBox="0 0 200 200">' + arcs
      + '<text x="100" y="96" text-anchor="middle" style="font-family:DM Sans;font-weight:700;font-size:22px" fill="rgb(var(--ink))">' + total + '%</text>'
      + '<text x="100" y="115" text-anchor="middle" style="font-size:11px" fill="rgb(var(--muted))">distribution</text>'
      + '</svg>'
      + '<ul class="grid grid-cols-2 gap-1 mt-3 text-xs w-full">'
      + data.map((d) => '<li class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm" style="background:' + d.color + '"></span><span class="flex-1">' + d.label + '</span><span class="text-muted">' + d.value + '%</span></li>').join('')
      + '</ul>';
  }

  function chartRadar(host) {
    const data = [{ axis: 'Speed', v: 0.7 }, { axis: 'Memory', v: 0.6 }, { axis: 'A11y', v: 0.85 }, { axis: 'SEO', v: 0.9 }, { axis: 'Polish', v: 0.95 }, { axis: 'Docs', v: 0.65 }];
    const cx = 120, cy = 120, R = 90;
    const ang = (i) => (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const points = data.map((d, i) => [cx + d.v * R * Math.cos(ang(i)), cy + d.v * R * Math.sin(ang(i))]);
    const rings = [0.25, 0.5, 0.75, 1].map((r) =>
      '<polygon points="' + data.map((_, i) => (cx + r * R * Math.cos(ang(i))) + ',' + (cy + r * R * Math.sin(ang(i)))).join(' ') + '" fill="none" stroke="rgb(var(--line))" stroke-dasharray="2 3"/>'
    ).join('');
    const labels = data.map((d, i) => '<text x="' + (cx + (R + 14) * Math.cos(ang(i))) + '" y="' + (cy + (R + 14) * Math.sin(ang(i)) + 3) + '" text-anchor="middle" font-size="10" fill="rgb(var(--muted))">' + d.axis + '</text>').join('');
    host.innerHTML =
      '<svg width="260" height="260" viewBox="0 0 240 240">'
      + rings
      + '<polygon points="' + points.map(p => p.join(',')).join(' ') + '" fill="rgb(124 58 237 / .25)" stroke="rgb(124 58 237)" stroke-width="2"/>'
      + points.map((p, i) => '<circle class="chart-point" cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="rgb(124 58 237)" data-v="' + Math.round(data[i].v * 100) + '%" data-l="' + data[i].axis + '"/>').join('')
      + labels
      + '</svg>';
  }

  function chartArea(host) {
    const w = host.clientWidth || 600, h = 220, pad = 22;
    const a = DEMO.REV.map((v) => v * 0.85);
    const b = DEMO.REV.map((v) => v * 0.55);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function path(d, fillId, stroke) {
      const max = Math.max(...d), min = Math.min(...d);
      const xs = d.map((_, i) => pad + (i * (w - pad * 2)) / (d.length - 1));
      const ys = d.map((v) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2));
      const p = xs.map((x, i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + ys[i].toFixed(1)).join(' ');
      const area = p + ' L' + xs[xs.length - 1] + ' ' + (h - pad) + ' L' + xs[0] + ' ' + (h - pad) + ' Z';
      const dots = xs.map((x, i) => '<circle class="chart-point" cx="' + x + '" cy="' + ys[i] + '" r="3.5" fill="#fff" stroke="' + stroke + '" stroke-width="2" data-v="' + Math.round(d[i]).toLocaleString() + '" data-l="' + (months[i % 12]) + '"/>').join('');
      return '<path d="' + area + '" fill="url(#' + fillId + ')"/><path d="' + p + '" stroke="' + stroke + '" stroke-width="2" fill="none"/>' + dots;
    }
    host.innerHTML =
      '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="chart-grid">'
      + '<defs>'
      + '  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".35"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></linearGradient>'
      + '  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient>'
      + '</defs>'
      + Array.from({length: 4}, (_, i) => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (pad + i * (h - pad * 2) / 3) + '" y2="' + (pad + i * (h - pad * 2) / 3) + '"/>').join('')
      + path(a, 'ga', '#7c3aed')
      + path(b, 'gb', '#22d3ee')
      + '</svg>'
      + '<div class="flex gap-4 text-xs mt-2 px-2"><span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm" style="background:#7c3aed"></span>Visitors</span>'
      + '<span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm" style="background:#22d3ee"></span>Sessions</span></div>';
  }

  /* ── Particle canvas ──────────────────────────────────────────── */
  function particles(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    const pts = Array.from({length: 90}, () => ({
      x: Math.random() * canvas.width / dpr,
      y: Math.random() * canvas.height / dpr,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
    }));
    let raf;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / dpr, h = canvas.height / dpr;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.strokeStyle = 'rgba(124, 58, 237,' + (.18 * (1 - d / 110)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(124, 58, 237, .65)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }

  /* ── Drag & drop reorderable list ─────────────────────────────── */
  function setupDnd(ul) {
    let drag = null;
    ul.querySelectorAll('li').forEach((li) => {
      li.addEventListener('dragstart', () => { drag = li; li.style.opacity = '.4'; });
      li.addEventListener('dragend',   () => { drag = null; li.style.opacity = '1'; });
      li.addEventListener('dragover',  (e) => { e.preventDefault(); });
      li.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!drag || drag === li) return;
        const rect = li.getBoundingClientRect();
        const after = (e.clientY - rect.top) > rect.height / 2;
        ul.insertBefore(drag, after ? li.nextSibling : li);
      });
    });
  }

  /* ── Misc click delegators (per-page) ─────────────────────────── */
  function bindPage(root) {
    /* Password toggle */
    root.querySelectorAll('[data-act="toggle-pw"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = document.getElementById(btn.dataset.target);
        if (!t) return;
        const showing = t.type === 'text';
        t.type = showing ? 'password' : 'text';
        btn.innerHTML = Icons.get(showing ? 'eye' : 'eye-off', { size: 16 });
      });
    });
    /* Toggle switches */
    root.querySelectorAll('[data-toggle]').forEach((s) => {
      s.addEventListener('click', () => s.classList.toggle('is-on'));
    });
    /* Checkboxes */
    root.querySelectorAll('[data-check]').forEach((c) => {
      c.addEventListener('click', () => c.classList.toggle('is-on'));
    });
    /* Radio groups */
    root.querySelectorAll('[data-radio]').forEach((r) => {
      r.addEventListener('click', () => {
        const group = r.dataset.radio;
        root.querySelectorAll('[data-radio="' + group + '"]').forEach((rr) => rr.classList.remove('is-on'));
        r.classList.add('is-on');
      });
    });
    /* Open modal */
    root.querySelectorAll('[data-act="open-modal"]').forEach((b) => {
      b.addEventListener('click', () => modal({
        title: I18n.t('msg.modal.demo_title'),
        size: b.dataset.size === 'sm' ? '' : b.dataset.size === 'lg' ? 'lg' : '',
        body: '<p class="text-sm">' + I18n.t('msg.modal.demo_body') + '</p>',
        footer: '<button class="btn btn-secondary" data-close>' + I18n.t('common.cancel') + '</button>'
              + '<button class="btn btn-primary" data-close>' + I18n.t('common.confirm') + '</button>',
      }));
    });
    root.querySelectorAll('[data-act="open-confirm"]').forEach((b) => {
      b.addEventListener('click', () => confirmModal({
        title: 'Delete project?',
        message: 'This will permanently remove the project and all its data.',
        confirmLabel: 'Delete',
        destructive: true,
        onConfirm: () => toast('success', 'Project deleted'),
      }));
    });
    root.querySelectorAll('[data-act="open-prompt"]').forEach((b) => {
      b.addEventListener('click', () => modal({
        title: 'Rename',
        body: '<label class="label">New name</label><input id="prompt-val" class="input" value="My project">',
        footer: '<button class="btn btn-secondary" data-close>' + I18n.t('common.cancel') + '</button>'
              + '<button class="btn btn-primary" data-act-2="ok">' + I18n.t('common.save') + '</button>',
        onMount: (overlay, close) => {
          overlay.querySelector('[data-act-2="ok"]').addEventListener('click', () => {
            const v = overlay.querySelector('#prompt-val').value;
            toast('success', 'Saved', 'Project name set to “' + v + '”');
            close();
          });
        },
      }));
    });
    /* Toast triggers */
    root.querySelectorAll('[data-act="toast"]').forEach((b) => {
      b.addEventListener('click', () => toast(b.dataset.kind, b.dataset.kind === 'error' ? 'Something went wrong' : 'Heads up', I18n.t('msg.toast.demo')));
    });
    /* Palette */
    root.querySelectorAll('[data-act="open-palette"]').forEach((b) => b.addEventListener('click', openPalette));
    /* Copy buttons */
    root.querySelectorAll('[data-act="copy"]').forEach((b) => {
      b.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(b.dataset.copy); toast('success', I18n.t('common.copied'), b.dataset.copy); }
        catch { toast('error', 'Copy failed', 'Your browser blocked clipboard access.'); }
      });
    });
    /* Lang switch (inside i18n page) */
    root.querySelectorAll('[data-act="set-lang"]').forEach((b) => {
      b.addEventListener('click', () => I18n.setLang(b.dataset.lang));
    });
    /* Live theme tokens */
    root.querySelectorAll('[data-theme-token]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const hex = inp.value;
        const rgb = [parseInt(hex.substr(1,2),16), parseInt(hex.substr(3,2),16), parseInt(hex.substr(5,2),16)].join(' ');
        document.documentElement.style.setProperty('--' + inp.dataset.themeToken, rgb);
        try { localStorage.setItem('vgf26-tok-' + inp.dataset.themeToken, rgb); } catch (_) {}
      });
    });
    /* Rating stars */
    root.querySelectorAll('[data-rating]').forEach((g) => {
      const out = root.querySelector('[data-rating-out]');
      g.querySelectorAll('button').forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const v = +btn.dataset.v;
          g.querySelectorAll('button').forEach((b2, j) => { b2.style.opacity = j < v ? '1' : '.35'; });
          if (out) out.textContent = v + ' / 5';
        });
      });
    });
    /* DnD list */
    const dnd = root.querySelector('#dnd-list');
    if (dnd) setupDnd(dnd);
    /* Charts */
    root.querySelectorAll('[data-chart]').forEach((host) => {
      const kind = host.dataset.chart;
      requestAnimationFrame(() => {
        if (kind === 'line-revenue' || kind === 'line-revenue-lg') chartLine(host, { height: kind.endsWith('lg') ? 280 : 220 });
        else if (kind === 'bar-sales')        chartBar(host);
        else if (kind === 'donut-channels' || kind === 'donut-channels-lg') chartDonut(host);
        else if (kind === 'donut-plans')      chartDonut(host, { data: [
          { label: 'Pro',        value: 58, color: '#7c3aed' },
          { label: 'Starter',    value: 26, color: '#22d3ee' },
          { label: 'Enterprise', value: 16, color: '#d846ef' },
        ]});
        else if (kind === 'radar-skills')     chartRadar(host);
        else if (kind === 'area-compare')     chartArea(host);
      });
    });
    /* Particles */
    root.querySelectorAll('[data-canvas="particles"]').forEach(particles);
    /* Confetti */
    root.querySelectorAll('[data-act="confetti"]').forEach((b) => {
      b.addEventListener('click', () => confetti());
    });
    /* OTP auto-advance */
    const otps = root.querySelectorAll('[data-otp]');
    if (otps.length) {
      otps.forEach((inp, i) => {
        inp.addEventListener('input', () => {
          if (inp.value && i < otps.length - 1) otps[i + 1].focus();
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !inp.value && i > 0) otps[i - 1].focus();
        });
      });
    }
    /* Split-pane resizer */
    root.querySelectorAll('[data-mount="split"]').forEach((box) => {
      const a = box.querySelector('#split-a'), bar = box.querySelector('#split-bar');
      if (!a || !bar) return;
      let drag = false;
      bar.addEventListener('mousedown', () => { drag = true; document.body.style.cursor = 'col-resize'; });
      window.addEventListener('mouseup', () => { drag = false; document.body.style.cursor = ''; });
      window.addEventListener('mousemove', (e) => {
        if (!drag) return;
        const rect = box.getBoundingClientRect();
        const w = ((e.clientX - rect.left) / rect.width) * 100;
        a.style.width = Math.max(15, Math.min(85, w)) + '%';
      });
    });
  }

  /* ── Confetti (vanilla canvas burst) ──────────────────────────── */
  function confetti() {
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;z-index:600;pointer-events:none';
    c.width = window.innerWidth; c.height = window.innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const colors = ['#7c3aed', '#d846ef', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e'];
    const parts = Array.from({length: 120}, () => ({
      x: window.innerWidth / 2, y: window.innerHeight / 2,
      vx: (Math.random() - .5) * 14, vy: -Math.random() * 16 - 4,
      g: 0.45, w: 6 + Math.random() * 8, h: 3 + Math.random() * 6,
      r: Math.random() * Math.PI, vr: (Math.random() - .5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100 + Math.random() * 60,
    }));
    let t = 0;
    function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of parts) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 1;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      t++;
      if (t < 180) requestAnimationFrame(tick);
      else c.remove();
    }
    tick();
  }

  /* ── Dropdown menus (anchored to a button) ─────────────────────── */
  function dropdown(opts) {
    /* Close any open dropdown first. */
    document.querySelectorAll('.dropdown-panel').forEach((p) => p.remove());

    const anchor = opts.anchor;
    if (!anchor) return () => {};
    const r = anchor.getBoundingClientRect();
    const panel = document.createElement('div');
    panel.className = 'dropdown-panel';
    panel.style.minWidth = (opts.width || 300) + 'px';
    if (opts.maxWidth) panel.style.maxWidth = opts.maxWidth + 'px';
    panel.innerHTML = opts.body || '';
    document.body.appendChild(panel);

    /* Position — default below-right. Flip if overflowing. */
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    const align = opts.align || 'right';
    let top  = r.bottom + 8;
    let left = align === 'right' ? r.right - pw : r.left;
    if (left < 8) left = 8;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (top + ph > window.innerHeight - 8) top = r.top - ph - 8;
    panel.style.top = top + 'px';
    panel.style.left = left + 'px';

    function close() {
      document.removeEventListener('mousedown', onDoc, true);
      document.removeEventListener('keydown', onKey);
      panel.style.animation = 'dd-in .12s reverse';
      setTimeout(() => panel.remove(), 110);
    }
    function onDoc(e) {
      if (!panel.contains(e.target) && !anchor.contains(e.target)) close();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('mousedown', onDoc, true);
    document.addEventListener('keydown', onKey);
    if (opts.onMount) opts.onMount(panel, close);
    return close;
  }

  /* ── Chart hover tooltip helper ────────────────────────────────── */
  function ensureTip(host) {
    let tip = host.querySelector('.chart-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'chart-tip';
      host.appendChild(tip);
    }
    return tip;
  }

  /* ── Tree view (recursive, expand/collapse, keyboard nav) ─────── */
  function bindTree(host) {
    host.querySelectorAll('.tree-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        host.querySelectorAll('.tree-row.is-active').forEach((r) => r.classList.remove('is-active'));
        row.classList.add('is-active');
        const node = row.closest('.tree-node');
        const children = node.querySelector(':scope > .tree-children');
        if (children) {
          const open = node.classList.toggle('is-open');
          children.style.display = open ? '' : 'none';
          const caret = row.querySelector('.tree-caret');
          if (caret) caret.classList.toggle('is-open', open);
        }
      });
    });
  }

  /* ── XMind-style mind map ──────────────────────────────────────── *
   * Builds an absolutely-positioned tree from a JS object.  Click any
   * node to collapse / expand its subtree.  SVG bezier connectors are
   * redrawn after every expand. */
  function buildMindMap(host, root) {
    const canvas = document.createElement('div');
    canvas.className = 'mm-canvas';
    host.appendChild(canvas);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    host.insertBefore(svg, canvas);

    const nodes = []; /* { dom, data, side, level, parent, x, y, w, h } */
    const ROW_GAP   = 14;   /* vertical breathing room between any two rows */
    const COL_GAP   = 56;   /* gap between depth columns */
    const PAD_X     = 32;

    function side(i) { return i % 2 === 0 ? 'right' : 'left'; }

    function createNode(data, level, parent, sideOf) {
      const el = document.createElement('div');
      el.className = 'mm-node';
      if (level === 0) el.classList.add('mm-root');
      if (level === 1) el.classList.add('mm-l1');
      if (data.color) el.setAttribute('data-color', data.color);
      el.innerHTML = '<span>' + data.label + '</span>'
        + (data.children && data.children.length ? '<span class="mm-toggle">−</span>' : '');
      el.dataset.collapsed = '0';
      canvas.appendChild(el);
      const obj = { dom: el, data, level, parent, side: sideOf, children: [] };
      if (parent) parent.children.push(obj);
      nodes.push(obj);
      if (data.children) data.children.forEach((c, i) => createNode(c, level + 1, obj, level === 0 ? side(i) : sideOf));
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!data.children || !data.children.length) return;
        const collapsed = el.dataset.collapsed === '1';
        el.dataset.collapsed = collapsed ? '0' : '1';
        el.classList.toggle('mm-collapsed', !collapsed);
        layout();
      });
      return obj;
    }

    function isVisible(n) {
      let p = n.parent;
      while (p) {
        if (p.dom.dataset.collapsed === '1') return false;
        p = p.parent;
      }
      return true;
    }

    /* Compute the per-depth column width — widest node at each depth. */
    function depthColumnWidths() {
      const widths = [];
      nodes.forEach((n) => {
        const w = n.dom.offsetWidth || 160;
        if ((widths[n.level] || 0) < w) widths[n.level] = w;
      });
      return widths;
    }

    /* Tidy-tree style layout — assign y-coordinates via leaf walk,
     * then place each parent at the vertical midpoint of its children
     * (or at its own leaf row if the subtree is collapsed). */
    function layoutSide(roots, dir) {
      let cursor = 0;
      function visit(n) {
        n.h = n.dom.offsetHeight || 38;
        const collapsed = n.dom.dataset.collapsed === '1';
        if (!n.children.length || collapsed) {
          n.y = cursor;
          cursor += n.h + ROW_GAP;
          return;
        }
        n.children.forEach(visit);
        const first = n.children[0], last = n.children[n.children.length - 1];
        n.y = (first.y + last.y + last.h - n.h) / 2;
      }
      roots.forEach(visit);
      return cursor; /* total height of this side */
    }

    function layout() {
      const root = nodes[0];
      const rightKids = root.children.filter((k) => k.side === 'right');
      const leftKids  = root.children.filter((k) => k.side === 'left');

      const cols = depthColumnWidths();
      const rightH = layoutSide(rightKids, 'right');
      const leftH  = layoutSide(leftKids,  'left');
      const totalH = Math.max(rightH, leftH);

      /* Normalise both sides to start at PAD_X top and centre against the root. */
      const rootW = cols[0] || (root.dom.offsetWidth || 200);
      const rootH = root.dom.offsetHeight || 50;

      /* Shift right side so its mid aligns with the centre of the canvas. */
      const rightOffset = (totalH - rightH) / 2;
      const leftOffset  = (totalH - leftH)  / 2;
      function shift(roots, offset) {
        function walk(n) {
          if (!n) return;
          n.y += offset;
          if (n.dom.dataset.collapsed !== '1') n.children.forEach(walk);
        }
        roots.forEach(walk);
      }
      shift(rightKids, rightOffset);
      shift(leftKids,  leftOffset);

      const cx = Math.max(host.clientWidth / 2, rootW / 2 + cols.slice(1).reduce((a, b) => a + b + COL_GAP, 0) + PAD_X);

      /* Root sits centred vertically. */
      root.x = cx - rootW / 2;
      root.y = (totalH - rootH) / 2 + PAD_X;
      root.dom.style.left = root.x + 'px';
      root.dom.style.top  = root.y + 'px';

      /* Place children — x by column, y already computed. */
      function place(n, parentX, parentW, dir) {
        const w = n.dom.offsetWidth || 160;
        const colW = cols[n.level] || w;
        if (dir === 'right') {
          n.x = parentX + parentW + COL_GAP;
        } else {
          n.x = parentX - COL_GAP - w;
        }
        n.dom.style.left = n.x + 'px';
        n.dom.style.top  = (n.y + PAD_X) + 'px';
        if (n.dom.dataset.collapsed === '1') return;
        n.children.forEach((c) => place(c, n.x, w, dir));
      }
      rightKids.forEach((k) => place(k, root.x, rootW, 'right'));
      leftKids.forEach((k)  => place(k, root.x, rootW, 'left'));

      /* Visibility — collapse hidden subtree. */
      nodes.forEach((n) => { n.dom.style.display = isVisible(n) ? '' : 'none'; });

      /* Sizing the canvas. */
      const maxR = Math.max(...nodes.filter(isVisible).map((n) => (n.x || 0) + (n.dom.offsetWidth || 160)));
      const maxB = Math.max(...nodes.filter(isVisible).map((n) => parseFloat(n.dom.style.top) + (n.dom.offsetHeight || 38)));
      const minL = Math.min(...nodes.filter(isVisible).map((n) => n.x || 0));
      const shiftL = minL < PAD_X ? PAD_X - minL : 0;
      if (shiftL) {
        nodes.forEach((n) => {
          if (n.dom.style.display === 'none') return;
          n.x += shiftL;
          n.dom.style.left = n.x + 'px';
        });
      }
      const width = Math.max(host.clientWidth, maxR + shiftL + PAD_X);
      canvas.style.width  = width + 'px';
      canvas.style.height = (maxB + PAD_X) + 'px';
      host.style.minHeight = Math.max(540, maxB + PAD_X * 2) + 'px';

      /* Draw connectors. */
      svg.setAttribute('width', width);
      svg.setAttribute('height', maxB + PAD_X);
      svg.innerHTML = '<defs><linearGradient id="mm-conn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c3aed" stop-opacity=".55"/><stop offset="1" stop-color="#d846ef" stop-opacity=".55"/></linearGradient></defs>';
      nodes.forEach((n) => {
        if (!n.parent || !isVisible(n)) return;
        const pw = n.parent.dom.offsetWidth, ph = n.parent.dom.offsetHeight;
        const cw = n.dom.offsetWidth,         ch = n.dom.offsetHeight;
        const py = parseFloat(n.parent.dom.style.top) + ph / 2;
        const cy = parseFloat(n.dom.style.top)        + ch / 2;
        let x1, x2;
        if (n.side === 'right') { x1 = n.parent.x + pw; x2 = n.x; }
        else                    { x1 = n.parent.x;     x2 = n.x + cw; }
        const mx = (x1 + x2) / 2;
        const path = 'M' + x1 + ' ' + py + ' C ' + mx + ' ' + py + ', ' + mx + ' ' + cy + ', ' + x2 + ' ' + cy;
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', path);
        p.setAttribute('stroke', 'url(#mm-conn)');
        p.setAttribute('stroke-width', n.level === 1 ? '2.5' : '1.5');
        p.setAttribute('fill', 'none');
        svg.appendChild(p);
      });
    }

    createNode(root, 0, null, 'right');
    /* Three passes — first lays everything out at default size, second
     * uses measured widths, third re-runs after fonts settle. */
    requestAnimationFrame(() => { layout(); requestAnimationFrame(() => { layout(); requestAnimationFrame(layout); }); });
    window.addEventListener('resize', () => layout());
  }

  /* ── Extend bindPage with the new behaviours ───────────────────── */
  const originalBindPage = bindPage;
  function bindPageExtended(root) {
    originalBindPage(root);

    /* Tree views */
    root.querySelectorAll('[data-mount="tree"]').forEach(bindTree);

    /* MindMap */
    root.querySelectorAll('[data-mount="mindmap"]').forEach((host) => {
      const data = MINDMAP_DATA;
      buildMindMap(host, data);
    });

    /* Hookup chart tooltips for line + bar + donut charts */
    root.querySelectorAll('[data-chart]').forEach((host) => {
      host.classList.add('chart-host');
      const tip = ensureTip(host);
      host.querySelectorAll('.chart-point').forEach((pt) => {
        pt.addEventListener('mousemove', (e) => {
          const r = host.getBoundingClientRect();
          tip.style.left = (e.clientX - r.left) + 'px';
          tip.style.top  = (e.clientY - r.top) + 'px';
          tip.innerHTML  = '<strong>' + pt.dataset.v + '</strong><span>' + pt.dataset.l + '</span>';
          tip.classList.add('is-on');
        });
        pt.addEventListener('mouseleave', () => tip.classList.remove('is-on'));
      });
      host.querySelectorAll('.chart-bar').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = host.getBoundingClientRect();
          tip.style.left = (e.clientX - r.left) + 'px';
          tip.style.top  = (e.clientY - r.top) + 'px';
          tip.innerHTML  = '<strong>' + b.dataset.v + '</strong><span>' + b.dataset.l + '</span>';
          tip.classList.add('is-on');
        });
        b.addEventListener('mouseleave', () => tip.classList.remove('is-on'));
      });
      host.querySelectorAll('.chart-slice').forEach((s) => {
        s.addEventListener('mousemove', (e) => {
          const r = host.getBoundingClientRect();
          tip.style.left = (e.clientX - r.left) + 'px';
          tip.style.top  = (e.clientY - r.top) + 'px';
          tip.innerHTML  = '<strong>' + s.dataset.v + '%</strong><span>' + s.dataset.l + '</span>';
          tip.classList.add('is-on');
        });
        s.addEventListener('mouseleave', () => tip.classList.remove('is-on'));
      });
      /* Heatmap cells (calendar / GitHub) */
      host.querySelectorAll('.gh-cell, .cal-cell').forEach((cell) => {
        cell.addEventListener('mousemove', (e) => {
          const r = host.getBoundingClientRect();
          tip.style.left = (e.clientX - r.left) + 'px';
          tip.style.top  = (e.clientY - r.top) + 'px';
          tip.innerHTML  = '<strong>' + (cell.dataset.v || '0') + ' commits</strong><span>' + (cell.dataset.l || '') + '</span>';
          tip.classList.add('is-on');
        });
        cell.addEventListener('mouseleave', () => tip.classList.remove('is-on'));
      });
    });

    /* Heart toggle on Airbnb cards */
    root.querySelectorAll('[data-act="heart"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('is-fav');
        btn.innerHTML = Icons.get('heart', { size: 18 });
      });
    });

    /* Lightbox triggers — collect siblings within data-lightbox-group. */
    root.querySelectorAll('[data-lightbox-group]').forEach((group) => {
      const tiles = [...group.querySelectorAll('[data-lightbox]')];
      const items = tiles.map((t) => ({
        src:   t.dataset.lightbox,
        title: t.dataset.title || '',
        tag:   t.dataset.tag   || '',
      }));
      tiles.forEach((t, i) => t.addEventListener('click', () => openLightbox(items, i)));
    });

    /* Carousels */
    root.querySelectorAll('[data-mount="carousel"]').forEach(bindCarousel);

    /* Tabs */
    root.querySelectorAll('[data-tab-set]').forEach(bindTabs);

    /* Mega menus */
    root.querySelectorAll('[data-mount="mega"]').forEach(bindMega);

    /* Image compare slider */
    root.querySelectorAll('[data-mount="compare"]').forEach(bindCompare);
  }

  /* ── Lightbox ───────────────────────────────────────────────── */
  function openLightbox(items, startIdx) {
    let idx = startIdx || 0;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
      '<img class="lightbox-img" src="' + items[idx].src + '" alt="">'
      + '<div class="lightbox-meta">'
      + '  <span class="font-semibold">' + items[idx].title + '</span>'
      + '  <span class="pill">' + items[idx].tag + '</span>'
      + '  <span class="text-white/60 font-mono text-[11px]">' + (idx + 1) + ' / ' + items.length + '</span>'
      + '</div>'
      + '<button class="lightbox-btn lb-prev" aria-label="Previous">' + Icons.get('chevron-left', { size: 22 }) + '</button>'
      + '<button class="lightbox-btn lb-next" aria-label="Next">'     + Icons.get('chevron-right', { size: 22 }) + '</button>'
      + '<button class="lightbox-btn lb-close" aria-label="Close">'   + Icons.get('x', { size: 18 }) + '</button>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function render() {
      overlay.querySelector('.lightbox-img').src = items[idx].src;
      const meta = overlay.querySelector('.lightbox-meta');
      meta.innerHTML = '<span class="font-semibold">' + items[idx].title + '</span>'
        + '<span class="pill">' + items[idx].tag + '</span>'
        + '<span class="text-white/60 font-mono text-[11px]">' + (idx + 1) + ' / ' + items.length + '</span>';
    }
    function close() {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 180);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function prev() { idx = (idx - 1 + items.length) % items.length; render(); }
    function next() { idx = (idx + 1) % items.length; render(); }
    function onKey(e) {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    }
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.lb-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', prev);
    overlay.querySelector('.lb-next').addEventListener('click', next);
    document.addEventListener('keydown', onKey);
  }

  /* ── Carousel ───────────────────────────────────────────────── */
  function bindCarousel(host) {
    const track = host.querySelector('.carousel-track');
    const slides = [...track.children];
    const dotsHost = host.querySelector('.carousel-dots');
    let idx = 0;
    let auto;

    if (dotsHost) {
      dotsHost.innerHTML = slides.map((_, i) => '<button data-i="' + i + '"' + (i === 0 ? ' class="is-on"' : '') + '></button>').join('');
      dotsHost.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(+b.dataset.i, true)));
    }
    function go(n, manual) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      if (dotsHost) dotsHost.querySelectorAll('button').forEach((b, i) => b.classList.toggle('is-on', i === idx));
      if (manual) reset();
    }
    function reset() { clearInterval(auto); auto = setInterval(() => go(idx + 1), 5000); }
    host.querySelector('.carousel-nav.prev')?.addEventListener('click', () => go(idx - 1, true));
    host.querySelector('.carousel-nav.next')?.addEventListener('click', () => go(idx + 1, true));
    host.addEventListener('mouseenter', () => clearInterval(auto));
    host.addEventListener('mouseleave', reset);
    reset();
  }

  /* ── Tabs ───────────────────────────────────────────────────── */
  function bindTabs(host) {
    const buttons = host.querySelectorAll('[data-tab]');
    const panels  = host.querySelectorAll('[data-tab-panel]');
    buttons.forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.tab;
      buttons.forEach((bb) => bb.classList.toggle('is-active', bb === b));
      panels.forEach((p)  => p.classList.toggle('is-active', p.dataset.tabPanel === k));
    }));
  }

  /* ── Mega menu (hover + click) ──────────────────────────────── */
  function bindMega(host) {
    const triggers = host.querySelectorAll('[data-mega-trigger]');
    const panels   = host.querySelectorAll('[data-mega-panel]');
    let hideTimer;

    function show(k) {
      clearTimeout(hideTimer);
      triggers.forEach((t) => t.classList.toggle('is-open', t.dataset.megaTrigger === k));
      panels.forEach((p)   => p.classList.toggle('is-hidden', p.dataset.megaPanel !== k));
    }
    function hideSoon() {
      hideTimer = setTimeout(() => {
        triggers.forEach((t) => t.classList.remove('is-open'));
        panels.forEach((p)   => p.classList.add('is-hidden'));
      }, 200);
    }
    triggers.forEach((t) => {
      t.addEventListener('mouseenter', () => show(t.dataset.megaTrigger));
      t.addEventListener('mouseleave', hideSoon);
      t.addEventListener('click', (e) => { e.stopPropagation(); show(t.dataset.megaTrigger); });
    });
    panels.forEach((p) => {
      p.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      p.addEventListener('mouseleave', hideSoon);
    });
    document.addEventListener('click', (e) => { if (!host.contains(e.target)) hideSoon(); });
  }

  /* ── Image compare slider ───────────────────────────────────── */
  function bindCompare(host) {
    const clip = host.querySelector('.clip');
    const handle = host.querySelector('.handle');
    if (!clip || !handle) return;
    let dragging = false;
    function setPct(pct) {
      pct = Math.max(0, Math.min(100, pct));
      clip.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    function onMove(e) {
      const rect = host.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPct((x / rect.width) * 100);
    }
    handle.addEventListener('mousedown',  () => { dragging = true; });
    handle.addEventListener('touchstart', () => { dragging = true; });
    window.addEventListener('mouseup',   () => { dragging = false; });
    window.addEventListener('touchend',  () => { dragging = false; });
    window.addEventListener('mousemove', (e) => { if (dragging) onMove(e); });
    window.addEventListener('touchmove', (e) => { if (dragging) onMove(e); });
    host.addEventListener('click', onMove);
    setPct(50);
  }

  /* Mind map default data (used by Whiteboard page). */
  const MINDMAP_DATA = {
    label: 'VGF26 Studio',
    children: [
      { label: 'Design System', color: 'iris', children: [
        { label: 'Tokens', children: [{ label: 'Colors' }, { label: 'Spacing' }, { label: 'Radius' }] },
        { label: 'Typography', children: [{ label: 'DM Sans' }, { label: 'Inter' }, { label: 'JetBrains Mono' }] },
        { label: 'Themes', children: [{ label: 'Light' }, { label: 'Dark' }, { label: 'Custom' }] },
      ]},
      { label: 'Components', color: 'fuchsia', children: [
        { label: 'Cards (20)' }, { label: 'Forms' }, { label: 'Charts' }, { label: 'Tables' },
      ]},
      { label: 'i18n', color: 'cyan', children: [
        { label: '🇦🇿 Azerbaijani' }, { label: '🇬🇧 English' }, { label: '🇷🇺 Russian' },
      ]},
      { label: 'Icons (140+)', color: 'emerald', children: [
        { label: 'Layout' }, { label: 'Data' }, { label: 'Social' },
      ]},
      { label: 'Effects', color: 'amber', children: [
        { label: 'Glass' }, { label: 'Aurora' }, { label: 'Particles' }, { label: 'Confetti' },
      ]},
      { label: 'Dashboards', color: 'rose', children: [
        { label: 'Analytics' }, { label: 'CRM' }, { label: 'Crypto' }, { label: 'IoT' },
      ]},
    ],
  };

  global.Components = { mount: bindPageExtended, toast, modal, confirmModal, openPalette, dropdown };
})(window);
