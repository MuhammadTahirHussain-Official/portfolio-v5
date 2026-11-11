/* Muhammad Tahir Hussain — Issue #1. Vanilla JS + GSAP + Lenis, no build step.
   The case files are read from the GitHub API on every visit. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = !reduce && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const USER = 'MuhammadTahirHussain-Official';

  /* starburst polygons */
  function burst(points, inner = .72, jitter = .08, seed = 1) {
    let s = seed * 9301 + 49297; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }, out = [];
    for (let i = 0; i < points * 2; i++) { const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2, rad = (i % 2 ? inner : 1) * (1 - r() * jitter) * 50; out.push(`${(50 + Math.cos(a) * rad).toFixed(1)}% ${(50 + Math.sin(a) * rad).toFixed(1)}%`); }
    return `polygon(${out.join(',')})`;
  }
  $('#splashB').style.setProperty('--burst', burst(14, .7, .1, 3));
  $('.cover__halo').style.setProperty('--burst', burst(22, .8, .1, 5));
  $('.cover__burst').style.setProperty('--burst', burst(12, .7, .06, 8));
  $('#year').textContent = new Date().getFullYear();
  $('#issueDate').textContent = new Date().toLocaleString('en', { month: 'short', year: 'numeric' });

  /* ═════════ GitHub ═════════ description → panel text · website → "Live" tag · topic "portfolio-hide" → hidden */
  const META = {
    'PAI-Sales-DataAnalysis': ['Store Sales Ecuador', 'Three million retail rows, five raw files, one clean table.'],
    'cropglobe-transfer': ['CropGlobe Transfer', 'A pre-registered study of cross-region crop-type transfer.'],
    'Predictive-Typing-Engine-In-C-That-Predict-Your-Next-Word-': ['Veryx Engine', 'It predicts your next word. Written in plain C.'],
    'Weather-Management-System-with-AI-assistant': ['StormWatch', 'A weather desk in C++17 with an LLM sidekick.'],
    'Professional-Airline-Management-System': ['Nexus Air', 'A whole airline, simulated in object-oriented C++.'],
    'Professional-Hospital-Management-System': ['Hospital Management', 'Records, search and sorting in a C console app.'],
    'Advance-arithmetic-quiz-system-with-timer-in-c': ['Arithmetic Quiz', 'Beat the clock. Levels, timeouts, progression.'],
    'Alien-Invasion-Game-in-Python': ['Alien Invasion', 'An arcade shooter built with Pygame.'],
    'Medicine-Inventory-Website': ['Medicine Inventory', 'A searchable stock website with a PHP backend.'],
    'My-Coding-Game-Journey': ['Coding Game Journey', 'Daily timed coding clashes, solved in C.'],
    'Basic-to-Advance-C-plus-plus': ['Basic to Advanced C++', 'C++20 from first steps upward.'],
  };
  const HIDE = new Set(['portfolio', 'portfolio-v2', 'portfolio-v3', 'portfolio-v4', 'portfolio-v5', USER]);
  const SNAPSHOT = [['PAI-Sales-DataAnalysis', 'Python'], ['cropglobe-transfer', 'Jupyter Notebook'], ['Basic-to-Advance-C-plus-plus', 'C++'], ['Medicine-Inventory-Website', 'HTML'], ['My-Coding-Game-Journey', 'C'], ['Alien-Invasion-Game-in-Python', 'Python'], ['Weather-Management-System-with-AI-assistant', 'C++'], ['Professional-Airline-Management-System', 'C++'], ['Professional-Hospital-Management-System', 'C'], ['Predictive-Typing-Engine-In-C-That-Predict-Your-Next-Word-', 'C'], ['Advance-arithmetic-quiz-system-with-timer-in-c', 'C']]
    .map(([name, language]) => ({ name, language, html_url: `https://github.com/${USER}/${name}` }));
  const pretty = (n) => n.replace(/[-_]+/g, ' ').trim().replace(/\b[a-z]/g, (c) => c.toUpperCase());
  const norm = (r) => { const m = META[r.name] || [], lang = r.language === 'Jupyter Notebook' ? 'Jupyter' : r.language || 'Code';
    return { title: m[0] || pretty(r.name), desc: r.description || m[1] || `A ${lang} project.`, lang, url: r.html_url, home: /^https?:\/\//.test(r.homepage || '') ? r.homepage : '' }; };
  async function loadRepos() {
    const KEY = 'mth.v5.repos'; let cached = null; try { cached = JSON.parse(localStorage.getItem(KEY)); } catch {}
    if (cached && Date.now() - cached.t < 6e5) return [cached.list, 'Synced from GitHub'];
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 5000);
      const r = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { signal: ctl.signal, headers: { Accept: 'application/vnd.github+json' } }); clearTimeout(timer);
      if (!r.ok) throw 0;
      const list = (await r.json()).filter((x) => !x.fork && !x.archived && !HIDE.has(x.name) && !(x.topics || []).includes('portfolio-hide')).map(norm);
      if (!list.length) throw 0; try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), list })); } catch {} return [list, 'Live from GitHub'];
    } catch { return cached ? [cached.list, 'GitHub unreachable. Last saved list'] : [SNAPSHOT.map(norm), 'GitHub unreachable. Saved list']; }
  }

  const COL = ['p-yel', 'p-paper', 'p-red', 'p-ink', 'p-paper', 'p-yel'], SFX = ['BAM!', 'ZAP!', 'POW!', 'WHAM!', 'KA-POW!', 'ZOOM!', 'CRASH!', 'BOOM!'];
  loadRepos().then(([list, note]) => {
    const grid = $('#caseGrid');
    list.forEach((r, i) => {
      const a = el('article', 'panel case ' + COL[i % COL.length]); a.tabIndex = 0; a.setAttribute('role', 'link');
      const f = el('div', 'case__f'); f.append(el('span', '', r.lang));
      if (r.home) { const live = el('a', 'case__live', 'Live'); live.href = r.home; live.target = '_blank'; live.rel = 'noopener'; const w = el('span', 'case__live'); w.append(live); f.append(w); }
      f.append(el('b', '', 'Read →'));
      a.append(el('i', 'num', '#' + String(i + 1).padStart(2, '0')), el('h3', '', r.title), el('p', '', r.desc), f, el('b', 'sfx', SFX[i % SFX.length]));
      const open = (e) => { if (e.target.closest('a')) return; window.open(r.url, '_blank', 'noopener'); };
      a.addEventListener('click', open); a.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(e); }); grid.append(a);
    });
    $('#caseN').textContent = String(list.length).padStart(2, '0'); $('#sync').textContent = `${note} · ${list.length} files`;
    const langs = [...new Set(list.map((r) => r.lang).filter((l) => l !== 'Code' && l !== 'Jupyter'))].slice(0, 5);
    const tools = [...new Set([...langs, 'PyTorch', 'pandas', 'Streamlit', 'Plotly', 'Jupyter', 'Git', 'CMake', 'Hugging Face', 'Kaggle'])], pc = ['p-yel', 'p-red', 'p-blu', 'p-ink'];
    tools.forEach((t, i) => { const li = el('li'), b = el('b', pc[i % 4], t); b.style.setProperty('--burst', burst(10 + (i % 4) * 2, .74, .08, i + 2)); li.append(b); $('#powerList').append(li); });
    if (animate) { pop($$('.case')); pop($$('.powers li'), true); ScrollTrigger.refresh(); }
  });

  /* ═════════ portrait → comic art: posterised colour, solid blacks, inked edges ═════════ */
  function comicify(src) {
    return new Promise((res) => {
      const img = new Image(); img.onload = () => {
        try {
          const w = 760, h = Math.round(w * img.naturalHeight / img.naturalWidth), c = document.createElement('canvas'); c.width = w; c.height = h;
          const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h); const im = x.getImageData(0, 0, w, h), d = im.data, n = w * h, lum = new Float32Array(n);
          for (let i = 0; i < n; i++) lum[i] = d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114;
          const q = (v) => clamp(Math.round(v / 48) * 48, 0, 255);
          for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
            const i = y * w + xx, k = i * 4; if (d[k + 3] < 40) continue; const L = lum[i];
            let edge = 0; if (xx > 0 && xx < w - 1 && y > 0 && y < h - 1) { const gx = lum[i - w + 1] + 2 * lum[i + 1] + lum[i + w + 1] - lum[i - w - 1] - 2 * lum[i - 1] - lum[i + w - 1], gy = lum[i + w - 1] + 2 * lum[i + w] + lum[i + w + 1] - lum[i - w - 1] - 2 * lum[i - w] - lum[i - w + 1]; edge = Math.abs(gx) + Math.abs(gy); }
            if (L < 46 || edge > 150) { d[k] = 20; d[k + 1] = 18; d[k + 2] = 28; }
            else if (L < 78 && (xx + y) % 6 < 2) { d[k] = 20; d[k + 1] = 18; d[k + 2] = 28; }           // hatched mid-shadows
            else { const s = 1.45; d[k] = q(L + (d[k] - L) * s + 10); d[k + 1] = q(L + (d[k + 1] - L) * s + 10); d[k + 2] = q(L + (d[k + 2] - L) * s + 10); }
            d[k + 3] = d[k + 3] > 128 ? 255 : 0;
          }
          x.putImageData(im, 0, 0); res(c.toDataURL('image/png'));
        } catch { res(src); }
      }; img.onerror = () => res(src); img.src = src;
    });
  }
  const art = comicify('assets/img/portrait.webp').then((url) => { $('#hero').src = url; $('#hero2').src = url; });

  /* click anywhere: an action word */
  const WORDS = ['POW!', 'BAM!', 'ZAP!', 'WHAM!', 'BOOM!', 'KAPOW!'], PC = ['p-yel', 'p-red', 'p-blu']; let wi = 0;
  if (!reduce) addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, .case')) return; const p = el('div', 'pow'), b = el('b', PC[wi % 3], WORDS[wi % WORDS.length]); b.style.setProperty('--burst', burst(12, .68, .1, ++wi)); p.append(b); p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px'; document.body.append(p);
    p.animate([{ transform: `scale(.2) rotate(${-30 + Math.random() * 20}deg)`, opacity: 1 }, { transform: `scale(1.15) rotate(${-8 + Math.random() * 16}deg)`, opacity: 1, offset: .35 }, { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: .7 }, { transform: 'scale(1.3)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.3,1.6,.5,1)' }).onfinish = () => p.remove();
  });

  let lenis = null, vel = 0;
  const go = (id) => { const t = $(id); if (t) lenis ? lenis.scrollTo(t, { duration: 1.3 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (!a) return; e.preventDefault(); go(a.getAttribute('href')); });

  if (!animate) { $('#loader').remove(); return; }

  /* ═════════ motion ═════════ */
  gsap.registerPlugin(ScrollTrigger);
  if (typeof Lenis !== 'undefined') { lenis = new Lenis({ duration: 1.05 }); lenis.on('scroll', (l) => { vel = l.velocity; ScrollTrigger.update(); }); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; }

  // panels slam onto the page
  function pop(els, spin) { els.forEach((p) => gsap.set(p, { opacity: 0, scale: .55, rotation: (Math.random() - .5) * (spin ? 80 : 14), y: 50 }));
    ScrollTrigger.batch(els, { start: 'top 90%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: .7, ease: 'back.out(2.2)', stagger: .07, clearProps: 'transform,opacity' }) }); }
  pop($$('.grid--origin .panel'));
  $$('.head').forEach((h) => gsap.from(h.children, { scale: 2.6, opacity: 0, rotation: -14, duration: .55, ease: 'back.out(1.6)', stagger: .12, scrollTrigger: { trigger: h, start: 'top 85%', once: true } }));
  $$('.grid--origin .sfx').forEach((s) => gsap.from(s, { scale: 4, opacity: 0, duration: .45, ease: 'back.out(3)', scrollTrigger: { trigger: s, start: 'top 80%', once: true } }));
  gsap.from('.p-wide .bubble', { scale: 0, rotation: -12, transformOrigin: '25% 100%', duration: .8, ease: 'elastic.out(1,.55)', scrollTrigger: { trigger: '.p-wide', start: 'top 75%', once: true } });
  gsap.from('.title--end span', { xPercent: (i) => (i ? 60 : -60), opacity: 0, duration: .8, ease: 'back.out(1.8)', stagger: .12, scrollTrigger: { trigger: '#end', start: 'top 65%', once: true } });
  gsap.from('.end__me', { yPercent: 40, opacity: 0, duration: .8, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.end__row', start: 'top 80%', once: true } });
  gsap.from('.end .bubble', { scale: 0, transformOrigin: '30% 100%', duration: .8, ease: 'elastic.out(1,.5)', scrollTrigger: { trigger: '.end__row', start: 'top 60%', once: true } });
  gsap.from('.btn', { scale: 0, duration: .5, ease: 'back.out(3)', stagger: .1, scrollTrigger: { trigger: '.end__row', start: 'top 55%', once: true }, clearProps: 'transform' });

  // cover: layers shift with the pointer and peel apart on scroll
  const layers = $$('#cover [data-depth]').map((n) => ({ n, d: +n.dataset.depth, qx: gsap.quickTo(n, 'x', { duration: .7, ease: 'power3' }), qy: gsap.quickTo(n, 'y', { duration: .7, ease: 'power3' }) }));
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) $('#cover').addEventListener('pointermove', (e) => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; layers.forEach((l) => { l.qx(-x * 34 * l.d); l.qy(-y * 22 * l.d); }); });
  gsap.to('.cover .t1', { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '#cover', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.cover .t3', { xPercent: 12, ease: 'none', scrollTrigger: { trigger: '#cover', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('#hero', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '#cover', start: 'top top', end: 'bottom top', scrub: true } });

  // ticker
  const band = $('#band'); let bx = 0; gsap.ticker.add(() => { const half = band.scrollWidth / 2; bx -= 1.4 + Math.min(Math.abs(vel), 60) * .5; if (bx <= -half) bx += half; band.style.transform = `translateX(${bx.toFixed(1)}px) skewX(${clamp(vel * -.5, -14, 14)}deg)`; });

  /* intro: WHAM! then the cover is drawn */
  const loader = $('#loader'); let done = false; if (lenis) lenis.stop(); scrollTo(0, 0);
  gsap.set('.cover .title span', { xPercent: -130, opacity: 0 }); gsap.set('.cover__hero', { yPercent: 105 }); gsap.set('.cover__burst, .cover__halo', { scale: 0 }); gsap.set('.cover__tag, .cover__box, .cover__turn, .mast > *', { opacity: 0, y: 30 });
  function start() {
    if (done) return; done = true; window.__started = true; if (lenis) lenis.start();
    gsap.timeline()
      .to('#splashB', { scale: 9, rotation: 40, duration: .7, ease: 'power3.in' })
      .set(loader, { display: 'none' })
      .to('.cover__halo', { scale: 1, duration: .6, ease: 'back.out(2)', clearProps: 'transform' }, '-=.1')
      .to('.cover__hero', { yPercent: 0, duration: .8, ease: 'back.out(1.5)' }, '<')
      .to('.cover .title span', { xPercent: 0, opacity: 1, duration: .6, ease: 'back.out(1.7)', stagger: .11 }, '-=.6')
      .to('.cover__burst', { scale: 1, duration: .6, ease: 'elastic.out(1,.45)' }, '-=.25')
      .to('.cover__tag, .cover__box, .cover__turn, .mast > *', { opacity: 1, y: 0, duration: .45, ease: 'back.out(2)', stagger: .06 }, '-=.4')
      .add(() => { loader.remove(); ScrollTrigger.refresh(); });
  }
  const fonts = document.fonts && document.fonts.load ? document.fonts.load('400 60px Bangers').catch(() => {}) : Promise.resolve();
  Promise.all([art, fonts, new Promise((r) => setTimeout(r, 900))]).then(start); setTimeout(start, 4500);
  addEventListener('load', () => ScrollTrigger.refresh());
})();
