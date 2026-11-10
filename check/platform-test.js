// Platform checks for the built Epu'ã app (docs/), the way an iPhone meets it: fitting the 390x844 design to each
// phone (and the note for a phone held sideways), the Home Screen app skipping the install page, the offline copy
// (every file stored, a cold start and every screen offline), picking up a new build, the manifest and the icons,
// the typefaces (served by the app itself, every Guarani letter in the app's own faces, never a fallback), each
// screen's frame (390x844, nothing out of it, taps of 44x44 or more), no request leaving the app's address, the
// licences, and the page's languages (lang="es", lang="gn" on the Guarani).
// The screens are looked at fresh, with a learner part way through unit 1, and with a second learner in the last
// written week (found from the course itself), whose longer words, titles and explanations unit 1 does not have.
// Two kinds of small target are reported as warnings, not failures: words in running text that are as tall as their
// line (44) and reached by a tap in the gap beside them (checked), and the keys of a keyboard's ten-key rows. The
// course's own Spanish strings that quote Guarani (the content format has no markup for it yet) are reported apart
// from the screens' own text, which must tag its Guarani.
//
// usage: node check/platform-test.js [site folder]       (default: docs/, which is only read, never changed)
//   It serves the folder itself, as GitHub Pages serves https://jorycook.github.io/epu-/ (under /epu-/, with
//   GitHub's headers: max-age=600, ETag, 304s), three ways:
//     L  http://localhost:<port>/epu-/   the app's test hooks work here (?gntest&screen=…, ?sw)
//     P  https://127.0.0.2:<port>/epu-/  the production path: not "local" for gn-app.js, so no test hooks, and the
//                                         offline worker registers by itself, as on GitHub Pages (self-signed
//                                         certificate, made with openssl at start)
//     U  https://127.0.0.2:<port>/epu-/  a copy of the folder in a temporary directory, for the update checks
//   Chromium stands in for Safari (WebKit cannot run here).
// env: PLATFORM_OUT  where screenshots go (default check/out/platform), taken at deviceScaleFactor 1
//      ONLY          a comma list of sections: static,fit,install,standalone,offline,update,manifest,fonts,screens
//      CRAWL         controls tapped per screen for the deeper screen inspection (default 8, 0 for none)
//      WALK          taps of a random walk (fixed seed) into each screen, inspecting each state (default 10, 0 for none)
// Exit code 1 when a check fails; WARN lines do not fail the run.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const REPO = path.resolve(__dirname, '..');
const SITE = path.resolve(process.argv[2] || path.join(REPO, 'docs'));
const OUT = path.resolve(process.env.PLATFORM_OUT || path.join(__dirname, 'out', 'platform'));
const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
const CRAWL = process.env.CRAWL === undefined ? 8 : +process.env.CRAWL;
const WALK = process.env.WALK === undefined ? 10 : +process.env.WALK;
const PREFIX = '/epu-/';
/* saved progress is kept per folder the app is served from */
const KEY = 'epua.v1:' + PREFIX;
const SCREENS = ['Goal', 'Placement', 'Main', 'Today', 'Levels', 'Progress', 'Teach', 'Compare', 'Drill', 'Exam', 'Words', 'Reading', 'Listening', 'WeekTest', 'Notebook', 'Review', 'ExamTab', 'LevelExam', 'Leer', 'Escribir', 'Hablar'];
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const MAC_IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15';
/* the phones, full screen in CSS pixels */
const PHONES = [['iPhone SE', 375, 667], ['iPhone 13 mini', 375, 812], ['iPhone 14', 390, 844], ['iPhone 15/16', 393, 852], ['iPhone 16 Pro', 402, 874], ['iPhone 11', 414, 896], ['iPhone 14 Plus', 428, 926], ['iPhone 15 Pro Max', 430, 932], ['iPhone 16 Pro Max', 440, 956]];
/* from the Home Screen, with apple-mobile-web-app-status-bar-style "default", the system keeps the status bar's strip */
const STRIPS = [['iPhone SE', 375, 667, 20], ['iPhone 13 mini', 375, 812, 50], ['iPhone 14', 390, 844, 47], ['iPhone 15/16', 393, 852, 59], ['iPhone 16 Pro', 402, 874, 62], ['iPhone 11', 414, 896, 48], ['iPhone 14 Plus', 428, 926, 47], ['iPhone 15 Pro Max', 430, 932, 59], ['iPhone 16 Pro Max', 440, 956, 62]];
/* Safari with its bars (about): the install page is what shows there */
const SAFARI = [['iPhone SE in Safari', 375, 553], ['iPhone 14 in Safari', 390, 664], ['iPhone 16 Pro in Safari', 402, 692], ['iPhone 16 Pro Max in Safari', 440, 774]];
/* the Guarani letters the app must draw in its own faces, and the puso; then letters typed answers can hold */
const GLYPHS = ['ã', 'ẽ', 'ĩ', 'õ', 'ũ', 'ỹ', 'g̃', 'G̃', 'Ã', 'Ẽ', 'Ĩ', 'Õ', 'Ũ', 'Ỹ', 'ñ', 'Ñ', "'"];
const EXTRA = ['á', 'é', 'í', 'ó', 'ú', 'ý', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ý', 'ch', 'rr', 'mb', 'nd', 'ng', 'nt', '’', 'ʼ'];
const FACES = [['Nunito', 500, 'Nunito-Medium', 'nunito-500.woff2'], ['Nunito', 700, 'Nunito-Bold', 'nunito-700.woff2'], ['Nunito', 800, 'Nunito-ExtraBold', 'nunito-800.woff2'], ['EpuaText', 400, 'EpuaText-Regular', 'epuatext-400.woff2'], ['EpuaText', 700, 'EpuaText-Bold', 'epuatext-700.woff2']];

/* a learner part way through A1 unit 1, dated from today (as the builder's check has it) */
const day = (n) => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const FULL = { g: 3, k: 1, r: 1 };
const SAMPLE = { level: 'A1', plan: { start: day(-3), target: day(60), pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL, a1u01d2: FULL, a1u01d3: FULL, a1u01d4: { g: 1 } }, m: [{ src: 'a1u01d2.d1', wrong: 'ore', at: Date.now() - 864e5, step: 0, due: day(0) }], cur: 'a1u01d4', placement: { comp: 'A2', prod: 'A1', start: 'A1', measured: true } };
const address = (o) => Object.keys(o).map((k) => '&' + k + '=' + encodeURIComponent(typeof o[k] === 'string' ? o[k] : JSON.stringify(o[k]))).join('');
/* the same learner as progress saved on the phone (what a normal start reads back) */
const SAVED = { v: 1, started: true, level: 'A1', plan: SAMPLE.plan, plans: {}, cur: SAMPLE.cur, done: SAMPLE.done, tests: {}, exams: {}, mistakes: SAMPLE.m, tp: 0, set: 'day', placement: SAMPLE.placement, typed: [], profile: null, exposure: null };

/* ---------- results ---------- */
let fails = 0;
let warns = 0;
let SECTION = '';
const FAILS = [];
const ok = (cond, what, evidence) => {
  if (cond) return true;
  fails += 1;
  FAILS.push(SECTION + ': ' + what);
  console.log('  FAIL ' + what + (evidence !== undefined ? ' | ' + (typeof evidence === 'string' ? evidence : JSON.stringify(evidence)) : ''));
  return false;
};
const warn = (what, evidence) => { warns += 1; console.log('  WARN ' + what + (evidence !== undefined ? ' | ' + (typeof evidence === 'string' ? evidence : JSON.stringify(evidence)) : '')); };
const pass = (what) => console.log('  ok   ' + what);
const note = (what) => console.log('  ..   ' + what);
const section = (name) => { SECTION = name; console.log('\n== ' + name); };
const want = (name) => !ONLY.length || ONLY.includes(name);
const r1 = (n) => Math.round(n * 10) / 10;

/* ---------- a static server, as GitHub Pages serves the folder ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
function serve(dir, opts = {}) {
  return new Promise((resolve, reject) => {
    const hits = [];
    /* srv.down = true: the network is gone; every connection is dropped (Playwright's offline mode covers the pages,
       not the browser's own check of sw.js) */
    const srv = { down: false, refused: [] };
    const handler = (req, res) => {
      const url = new URL(req.url, 'http://x');
      const p = decodeURIComponent(url.pathname);
      if (srv.down) { srv.refused.push(p + url.search); req.socket.destroy(); return; }
      hits.push({ path: p, search: url.search, at: Date.now() });
      const send = () => {
        if (p === PREFIX.slice(0, -1)) { res.writeHead(301, { Location: PREFIX + url.search }); res.end(); return; }
        let rel = p.startsWith(PREFIX) ? p.slice(PREFIX.length) : null;
        if (rel !== null && (rel === '' || rel.endsWith('/'))) rel += 'index.html';
        const f = rel === null ? null : path.join(dir, rel);
        if (!f || !f.startsWith(dir + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end('<!doctype html><title>404</title><h1>404</h1>'); return; }
        const body = fs.readFileSync(f);
        const etag = 'W/"' + crypto.createHash('sha1').update(body).digest('hex').slice(0, 20) + '"';
        const headers = { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'max-age=600', ETag: etag, 'Last-Modified': fs.statSync(f).mtime.toUTCString(), 'Access-Control-Allow-Origin': '*' };
        if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); res.end(); return; }
        res.writeHead(200, { ...headers, 'Content-Length': body.length });
        res.end(req.method === 'HEAD' ? undefined : body);
      };
      const wait = opts.slow ? opts.slow(p, url.search) : 0;
      if (wait) setTimeout(send, wait); else send();
    };
    const server = opts.tls ? https.createServer(opts.tls, handler) : http.createServer(handler);
    server.on('error', reject);
    const host = opts.tls ? '127.0.0.2' : '127.0.0.1';
    server.listen(0, host, () => {
      const port = server.address().port;
      const origin = (opts.tls ? 'https://127.0.0.2:' : 'http://localhost:') + port;
      resolve(Object.assign(srv, { server, port, origin, base: origin + PREFIX, hits, dir }));
    });
  });
}
function makeCert(dir) {
  try {
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', path.join(dir, 'key.pem'), '-out', path.join(dir, 'cert.pem'), '-days', '2', '-subj', '/CN=127.0.0.2', '-addext', 'subjectAltName=IP:127.0.0.2'], { stdio: 'ignore' });
    return { key: fs.readFileSync(path.join(dir, 'key.pem')), cert: fs.readFileSync(path.join(dir, 'cert.pem')) };
  } catch (e) { return null; }
}

/* ---------- what every page asks for, and what goes wrong on it ---------- */
const REQUESTS = [];
const BAD = [];
let ORIGINS = [];
/* the answer fields' own styles, read from screens.js (static section), for the typed-letters check (fonts section) */
let INPUT_STYLES = null;
let expect404 = false;
function track(ctx, label) {
  ctx.on('request', (r) => REQUESTS.push({ url: r.url(), label, type: r.resourceType() }));
  ctx.on('response', (r) => { if (r.status() >= 400 && !expect404) BAD.push(label + ': ' + r.status() + ' ' + r.url()); });
  ctx.on('requestfailed', (r) => { if (!ctx.__offline) BAD.push(label + ': failed ' + r.url() + ' ' + ((r.failure() && r.failure().errorText) || '')); });
  return ctx;
}
const watch = (page, logs) => {
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text().slice(0, 240)); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 240)));
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
};
async function phone(browser, w, h, o = {}) {
  const { label, standalone, displayMode, ua, touchPoints, ...rest } = o;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: ua || IPHONE, ignoreHTTPSErrors: true, ...rest });
  track(ctx, label || `${w}x${h}`);
  /* opened from the Home Screen: Safari's navigator.standalone */
  if (standalone) await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'standalone', { get: () => true, configurable: true }); });
  /* the other sign of a Home Screen app, (display-mode: standalone): Chromium's media emulation ignores display-mode,
     so the page's matchMedia answers it */
  if (displayMode) {
    await ctx.addInitScript(() => {
      const real = window.matchMedia.bind(window);
      window.matchMedia = (q) => (/display-mode\s*:\s*standalone/.test(q) ? { matches: true, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } } : real(q));
    });
  }
  if (touchPoints) await ctx.addInitScript((n) => { Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => n, configurable: true }); }, touchPoints);
  return ctx;
}
async function ready(page, wait = 300) {
  await page.waitForSelector('#gn-stage > .sc-host', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.classList.contains('gn-ready'), null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(wait);
}
const screenName = (page) => page.evaluate(() => { const h = document.querySelector('#gn-stage > .sc-host'); const inner = h && h.querySelector('.sc-host'); return inner ? inner.getAttribute('data-sc-name') : h ? h.getAttribute('data-sc-name') : null; });
const logicErrors = (page) => page.evaluate(() => [...document.querySelectorAll('.sc-logic-error,.sc-placeholder-error')].map((e) => e.textContent.slice(0, 200)));
const stageText = async (page) => ((await page.locator('#gn-stage').textContent()) || '').replace(/\s+/g, ' ').trim();
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') });
/* a contact sheet of screenshots, to look at many at once */
async function sheet(browser, name, items, cols = 7, thumb = 195) {
  const page = await browser.newPage({ viewport: { width: cols * (thumb + 10) + 10, height: 600 }, deviceScaleFactor: 1 });
  const cells = items.map(([label, file]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(file).toString('base64')}"><figcaption>${label}</figcaption></figure>`).join('');
  await page.setContent(`<style>body{margin:0;padding:10px;display:flex;flex-wrap:wrap;gap:10px;background:#888;font:12px sans-serif}figure{margin:0;width:${thumb}px}img{width:${thumb}px;display:block;background:#fff}figcaption{color:#fff;padding:2px 0}</style>${cells}`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
  await page.close();
}

/* ---------- in-page measurements (run with page.evaluate) ---------- */
/* where the design sits: the stage's box, its transform, and whether the page itself could scroll */
const PLACE = () => {
  const stage = document.querySelector('#gn-stage');
  const view = document.querySelector('#gn-view');
  const b = stage.getBoundingClientRect();
  const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+),\s*([-\d.]+)\)/.exec(stage.style.transform || '');
  const sc = document.scrollingElement;
  const before = [b.left, b.top];
  window.scrollTo(0, 600);
  view.scrollTop = 600;
  view.scrollLeft = 600;
  stage.scrollTop = 600;
  const a = stage.getBoundingClientRect();
  const scrolled = { doc: [window.scrollX, window.scrollY], view: [view.scrollLeft, view.scrollTop], stage: stage.scrollTop, moved: Math.abs(a.left - before[0]) > 0.5 || Math.abs(a.top - before[1]) > 0.5 };
  window.scrollTo(0, 0);
  view.scrollTop = 0;
  view.scrollLeft = 0;
  stage.scrollTop = 0;
  const cls = document.documentElement.classList;
  return { x: b.left, y: b.top, w: b.width, h: b.height, right: b.right, bottom: b.bottom, t: m ? { tx: +m[1], ty: +m[2], sx: +m[3], sy: +m[4] } : null, vw: innerWidth, vh: innerHeight, docW: sc.scrollWidth, docH: sc.scrollHeight, scrolled, boxed: cls.contains('gn-boxed'), sideways: cls.contains('gn-sideways'), fluid: cls.contains('gn-fluid') };
};
/* what a learner can see of the screen that the phone's screen cuts off: text, controls, icons and pictures whose
   visible part (inside every box of the screen that clips) runs past the window */
const CUT = ([vw, vh]) => {
  const host = document.querySelector('#gn-stage > .sc-host');
  const rootEl = host && host.firstElementChild;
  if (!rootEl) return ['no root'];
  const out = [];
  const shown = (el) => { for (let p = el; p && p !== rootEl.parentElement; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const seen = (from, r) => {
    let l = r.left; let t = r.top; let rr = r.right; let bb = r.bottom;
    for (let p = from; p && p !== rootEl.parentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const q = p.getBoundingClientRect();
      if (cs.overflowX !== 'visible') { l = Math.max(l, q.left); rr = Math.min(rr, q.right); }
      if (cs.overflowY !== 'visible') { t = Math.max(t, q.top); bb = Math.min(bb, q.bottom); }
    }
    return { l, t, r: rr, b: bb, empty: rr - l < 0.5 || bb - t < 0.5 };
  };
  const check = (what, from, r) => {
    const s = seen(from, r);
    if (s.empty) return;
    const cut = [];
    if (s.t < -1) cut.push('top by ' + (-s.t).toFixed(1));
    if (s.b > vh + 1) cut.push('bottom by ' + (s.b - vh).toFixed(1));
    if (s.l < -1) cut.push('left by ' + (-s.l).toFixed(1));
    if (s.r > vw + 1) cut.push('right by ' + (s.r - vw).toFixed(1));
    if (cut.length) out.push(what + ' cut off at the ' + cut.join(', ') + ' px');
  };
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue.trim();
    if (!text || !shown(n.parentElement)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.width > 0.5 && r.height > 0.5) check('text "' + text.slice(0, 32) + '"', n.parentElement, r);
  }
  for (const el of rootEl.querySelectorAll('button, a, input, textarea, select, svg, img')) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0.5 && r.height > 0.5) check(el.tagName.toLowerCase() + ' "' + (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32) + '"', el.parentElement, r);
  }
  return [...new Set(out)];
};
/* one screen at 390x844: its root, what leaves the frame outside a scrolling box, text a box cuts off, text cut short,
   and every tap target under 44x44 */
const INSPECT = (name) => {
  const res = { errors: [], root: null, shell: null, out: [], deco: [], clip: [], hidden: [], trunc: [], small: [], breaks: [], targets: 0 };
  res.errors = [...document.querySelectorAll('#gn-stage .sc-logic-error, #gn-stage .sc-placeholder-error')].map((e) => e.textContent.trim().slice(0, 200));
  const shellRoot = document.querySelector('#gn-stage > .sc-host > div');
  if (shellRoot) res.shell = { w: shellRoot.offsetWidth, h: shellRoot.offsetHeight, sw: shellRoot.scrollWidth, sh: shellRoot.scrollHeight };
  const host = document.querySelector('#gn-stage .sc-host[data-sc-name="' + name + '"]');
  const rootEl = host && host.firstElementChild;
  if (!rootEl) { res.errors.push('no root element for ' + name); return res; }
  const R = rootEl.getBoundingClientRect();
  res.root = { tag: rootEl.tagName.toLowerCase(), w: rootEl.offsetWidth, h: rootEl.offsetHeight, sw: rootEl.scrollWidth, sh: rootEl.scrollHeight, cw: rootEl.clientWidth, ch: rootEl.clientHeight, x: R.left, y: R.top, kids: host.children.length };
  const label = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || el.getAttribute('placeholder') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 48);
  /* Preact keeps a node's listeners in node.l */
  const handlers = (el) => { const l = el.l; return l ? Object.keys(l).filter((k) => l[k] && /^(click|pointerdown|pointerup|touchstart|touchend|mousedown|mouseup)/.test(k)) : []; };
  const shown = (el) => { for (let p = el; p && p !== rootEl.parentElement; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
  /* text kept for screen readers only: a box of a pixel or so that hides what overflows it, or one clipped away */
  const srOnly = (el) => { for (let p = el; p && p !== rootEl; p = p.parentElement) { const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); if ((cs.clip && cs.clip !== 'auto' && cs.position === 'absolute') || (r.width <= 1.5 && r.height <= 1.5 && cs.overflow !== 'visible')) return true; } return false; };
  const NATIVE = /^(button|a|input|textarea|select)$/;
  function* ancestorsOf(el) { for (let p = el.parentElement; p && p !== rootEl.parentElement; p = p.parentElement) yield p; }
  const inGame = (el) => !!el.closest('[aria-hidden="true"]');
  for (const el of rootEl.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (el.closest('svg') && tag !== 'svg') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || !shown(el) || srOnly(el)) continue;
    let sx = false;
    let sy = false;
    for (let p = el.parentElement; p && p !== rootEl.parentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/auto|scroll/.test(cs.overflowY)) sy = true;
      if (/auto|scroll/.test(cs.overflowX)) sx = true;
    }
    const l = r.left - R.left;
    const t = r.top - R.top;
    const rr = r.right - R.left;
    const b = r.bottom - R.top;
    /* in a scrolling box, what sits above (or left of) where its scrolling starts can never be scrolled to */
    for (let p = el.parentElement; p && p !== rootEl.parentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      const ys = /auto|scroll/.test(cs.overflowY);
      const xs = /auto|scroll/.test(cs.overflowX);
      if (!ys && !xs) continue;
      const q = p.getBoundingClientRect();
      const above = q.top + p.clientTop - p.scrollTop - r.top;
      const before = q.left + p.clientLeft - p.scrollLeft - r.left;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim()) || NATIVE.test(tag);
      if (own && ((ys && above > 1) || (xs && before > 1))) res.out.push(`${tag} "${label(el).slice(0, 30)}" starts ${Math.round(Math.max(above, before))} px before its scrolling box can scroll to it`);
      break;
    }
    if ((!sx && (rr > 390.5 || l < -0.5)) || (!sy && (b > 844.5 || t < -0.5))) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
      const line = `${tag} "${label(el).slice(0, 30)}" l=${Math.round(l)} r=${Math.round(rr)} t=${Math.round(t)} b=${Math.round(b)}`;
      /* a game's window (aria-hidden, clipping what moves in and out of it) is animation, not content */
      const game = !!el.closest('[aria-hidden="true"]') && [...ancestorsOf(el)].some((p) => getComputedStyle(p).overflow === 'hidden' && p !== rootEl);
      (!game && (own || NATIVE.test(tag) || handlers(el).length || tag === 'img') ? res.out : res.deco).push(line + (game ? ' (in a game window)' : ''));
    }
    const target = NATIVE.test(tag) || el.getAttribute('role') === 'button' || handlers(el).length > 0;
    if (target && !(tag === 'input' && el.type === 'hidden')) {
      res.targets += 1;
      if (r.width < 43.5 || r.height < 43.5) {
        /* two kinds of small target are known and handled apart (see the summary): a word or phrase inside running
           Guarani text (an inline button in a text block), and a key of a full row of an on-screen keyboard */
        const parent = el.parentElement;
        const inText = /^inline/.test(getComputedStyle(el).display) && !!(parent && parent.closest('[lang="gn"]')) && !/flex|grid/.test(getComputedStyle(parent).display);
        const keyRow = !!el.closest('[role="group"][aria-label^="Teclado"]') && !!parent && parent.querySelectorAll(':scope > button').length >= 9;
        res.small.push({ tag: NATIVE.test(tag) ? tag : tag + '(tap)', label: label(el), w: r1w(r.width), h: r1w(r.height), disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true', kind: inText ? 'text' : keyRow ? 'key' : '' });
      }
    }
    const cs = getComputedStyle(el);
    if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) res.trunc.push(`${tag} "${label(el).slice(0, 40)}" (ellipsis, ${el.scrollWidth - el.clientWidth} px too wide)`);
    /* a line clamp cuts text only when the text, unclamped, would be taller (a tall face can overflow its lines anyway) */
    if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1) {
      const copy = el.cloneNode(true);
      copy.style.webkitLineClamp = 'none';
      copy.style.display = 'block';
      copy.style.overflow = 'visible';
      copy.style.height = 'auto';
      copy.style.maxHeight = 'none';
      copy.style.width = el.getBoundingClientRect().width + 'px';
      el.parentElement.appendChild(copy);
      const full = copy.getBoundingClientRect().height;
      copy.remove();
      if (full > r.height + 1) res.trunc.push(`${tag} "${label(el).slice(0, 40)}" (line clamp ${cs.webkitLineClamp}: ${Math.round(full)} px of text in ${Math.round(r.height)})`);
    }
  }
  function r1w(n) { return Math.round(n * 10) / 10; }
  /* Guarani split by a line break inside a word: never at the puso (BRIEF-core: "Never break a line at the puso"),
     and elsewhere only when a word is too long for its line (overflow-wrap: anywhere) */
  {
    const GNTEXT = /[ãẽĩõũỹÃẼĨÕŨỸ']|[gG]̃/;
    const w2 = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    for (let n = w2.nextNode(); n; n = w2.nextNode()) {
      const s = n.nodeValue;
      const el = n.parentElement;
      if (s.trim().length < 3 || !shown(el) || srOnly(el)) continue;
      const holder = el.closest('[lang]');
      if (!(holder && /^gn/.test(holder.getAttribute('lang'))) && !GNTEXT.test(s)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      if (range.getClientRects().length < 2) continue;
      let prev = null;
      for (let i = 0; i < s.length; i++) {
        if (/\s/.test(s[i]) || /[̀-ͯ]/.test(s[i])) continue;
        range.setStart(n, i);
        range.setEnd(n, i + 1);
        const q = range.getBoundingClientRect();
        if (!q.height) continue;
        if (prev && q.top > prev.top + prev.height * 0.5 && i > 0 && !/\s/.test(s[i - 1])) {
          const before = s.slice(0, i).split(/\s/).pop();
          const after = s.slice(i).split(/\s/)[0];
          res.breaks.push({ word: before + '‸' + after, puso: /['’ʼ]$/.test(before) || /^['’ʼ]/.test(after), box: Math.round(el.getBoundingClientRect().width) });
        }
        prev = q;
      }
    }
  }
  /* text that a box with overflow hidden cuts off (a scrolling box does not count: what is beyond it can be scrolled
     to). The text's line box is taller than its letters, so it counts from the em box, centred in the line box */
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue.trim();
    const el = n.parentElement;
    if (!text || !shown(el) || srOnly(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter((q) => q.width > 0.5 && q.height > 0.5).map((q) => { const pad = Math.max(0, (q.height - fs) / 2); return { left: q.left, right: q.right, top: q.top + pad, bottom: q.bottom - pad }; });
    for (let p = el; p && p !== rootEl.parentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      if (/auto|scroll/.test(cs.overflowY) || /auto|scroll/.test(cs.overflowX)) break;
      const q = p.getBoundingClientRect();
      const bl = q.left + p.clientLeft;
      const bt = q.top + p.clientTop;
      const br = bl + p.clientWidth;
      const bb = bt + p.clientHeight;
      const cut = rects.find((x) => (x.left < bl - 1 || x.right > br + 1 || x.top < bt - 1 || x.bottom > bb + 1));
      if (cut) {
        const by = Math.max(bl - cut.left, cut.right - br, bt - cut.top, cut.bottom - bb);
        /* half in the box is a cut a learner sees; wholly outside it is content the box hides */
        const partly = rects.some((x) => x.right > bl + 0.5 && x.left < br - 0.5 && x.bottom > bt + 0.5 && x.top < bb - 0.5);
        const line = `"${text.slice(0, 40)}" ${partly ? 'cut' : 'hidden'} by ${by.toFixed(1)} px in a ${p.tagName.toLowerCase()} of ${Math.round(p.clientWidth)}x${Math.round(p.clientHeight)} (overflow ${cs.overflowX}/${cs.overflowY}${cs.maxHeight !== 'none' ? ', max-height ' + cs.maxHeight : ''})`;
        if (inGame(el)) res.deco.push(line + ' (in a game window)');
        else if (partly) res.clip.push(line);
        else res.hidden.push(line);
        break;
      }
    }
  }
  return res;
};
/* the screen's languages: how many lang="gn" elements, which lang values, and Guarani-looking text outside lang="gn" */
const LANG = (name) => {
  const host = document.querySelector('#gn-stage .sc-host[data-sc-name="' + name + '"]');
  const rootEl = host && host.firstElementChild;
  const out = { gn: 0, langs: [], untagged: [], labels: [] };
  if (!rootEl) return out;
  out.gn = rootEl.querySelectorAll('[lang="gn"]').length;
  out.langs = [...new Set([...rootEl.querySelectorAll('[lang]')].map((e) => e.getAttribute('lang')))];
  /* letters Spanish never writes (the nasal vowels, ý, g̃) or the puso inside a word */
  const GN = /[ãẽĩõũỹÃẼĨÕŨỸýÝ]|[gG]̃|[a-zñáéíóúý]['’ʼ][a-zñáéíóúýãẽĩõũỹ]/i;
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue;
    if (!GN.test(text)) continue;
    const el = n.parentElement;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const holder = el.closest('[lang]');
    if (holder && /^gn\b/i.test(holder.getAttribute('lang'))) continue;
    out.untagged.push(text.trim().replace(/\s+/g, ' ').slice(0, 60));
  }
  for (const el of rootEl.querySelectorAll('[aria-label]')) if (GN.test(el.getAttribute('aria-label'))) out.labels.push(el.getAttribute('aria-label').slice(0, 60));
  /* a piece that is (part of) one of the course's own strings (gn-course-*.js, gn-extra.js): the content's Spanish
     explanations quote Guarani with no markup for it, so a screen cannot tag it; those are reported apart */
  const C = window.gnCourse;
  if (!window.__contentStrings) {
    const all = [];
    /* down to an example's parts ([level].units[].days[].grammar.points[].examples[].parts[][], thirteen steps) */
    const visit = (v, d) => { if (typeof v === 'string') { all.push(v); if (C && C.plain) all.push(C.plain(v)); } else if (v && typeof v === 'object' && d < 16) Object.keys(v).forEach((k) => visit(v[k], d + 1)); };
    visit(window.__gnCourses || {}, 0);
    visit(window.__gnExtra || {}, 0);
    window.__contentStrings = all;
  }
  out.content = out.untagged.filter((t) => { const x = t.trim().replace(/\s+/g, ' '); return x.length >= 12 && window.__contentStrings.some((c) => c.replace(/\s+/g, ' ').includes(x)); });
  out.untagged = [...new Set(out.untagged)];
  out.labels = [...new Set(out.labels)];
  return out;
};
/* the controls a crawl may tap on a screen: visible, enabled, not the tab bar, one per label */
const CONTROLS = (max) => {
  const all = [...document.querySelectorAll('#gn-stage button, #gn-stage a')];
  const out = [];
  const seen = new Set();
  all.forEach((el, i) => {
    if (out.length >= max || el.closest('nav') || el.disabled) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width < 1 || r.height < 1 || cs.visibility === 'hidden' || cs.pointerEvents === 'none') return;
    const lab = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    if (!lab || seen.has(lab) || /^(Volver|Cerrar|Salir)\b/.test(lab)) return;
    seen.add(lab);
    out.push({ i, label: lab });
  });
  return out;
};

/* ---------- small helpers in Node ---------- */
function pngInfo(file) {
  const b = fs.readFileSync(file);
  if (b.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') return { png: false };
  const chunks = [];
  for (let off = 8; off + 8 <= b.length;) { const len = b.readUInt32BE(off); chunks.push({ type: b.slice(off + 4, off + 8).toString('ascii'), data: b.slice(off + 8, off + 8 + len) }); off += 12 + len; }
  const ihdr = chunks.find((c) => c.type === 'IHDR').data;
  return { png: true, w: ihdr.readUInt32BE(0), h: ihdr.readUInt32BE(4), depth: ihdr[8], colorType: ihdr[9], interlace: ihdr[12], trns: chunks.some((c) => c.type === 'tRNS'), size: b.length };
}
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
/* the answer fields as the screens' templates in screens.js write them */
function answerFields() {
  const js = fs.readFileSync(path.join(SITE, 'assets/screens.js'), 'utf8');
  const fields = [];
  for (const m of js.matchAll(/YK\.define\(("(?:[^"\\]|\\.)*"), ("(?:[^"\\]|\\.)*"), function/g)) {
    const name = JSON.parse(m[1]);
    const tpl = JSON.parse(m[2]);
    for (const f of tpl.matchAll(/<(input|textarea|select)\b([^>]*)>/g)) {
      const attr = (a) => { const x = new RegExp('\\b' + a + '="([^"]*)"').exec(f[2]); return x ? x[1] : null; };
      fields.push({ name, tag: f[1], type: attr('type'), lang: attr('lang'), style: attr('style') || '', autocorrect: attr('autocorrect'), spellcheck: attr('spellcheck'), autocapitalize: attr('autocapitalize'), autocomplete: attr('autocomplete') });
    }
  }
  return fields;
}
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const swInfo = (dir) => {
  const sw = fs.readFileSync(path.join(dir, 'sw.js'), 'utf8');
  return { files: JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]), version: sw.match(/const VERSION = '([0-9a-f]+)'/)[1] };
};
/* the font files' character maps, names and layout features (fontTools) */
const FONT_PY = `
import sys, json
from fontTools.ttLib import TTFont
out = {}
for f in sys.argv[1:]:
    t = TTFont(f)
    names = {}
    for r in t['name'].names:
        try:
            names.setdefault(str(r.nameID), set()).add(r.toUnicode())
        except Exception:
            pass
    feats = lambda tag: sorted({fr.FeatureTag for fr in t[tag].table.FeatureList.FeatureRecord}) if tag in t else []
    out[f] = {'cmap': sorted(t.getBestCmap().keys()), 'names': {k: sorted(v) for k, v in names.items()}, 'gpos': feats('GPOS'), 'gsub': feats('GSUB'), 'flavor': t.flavor, 'upm': t['head'].unitsPerEm, 'asc': t['hhea'].ascent, 'desc': t['hhea'].descent}
print(json.dumps(out))
`;
function fontFacts() {
  const files = FACES.map((f) => path.join(SITE, 'assets/fonts', f[3]));
  try {
    const res = JSON.parse(execFileSync('python3', ['-I', '-c', FONT_PY, ...files], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    const by = {};
    FACES.forEach((f, i) => { by[f[0] + '|' + f[1]] = { ...res[files[i]], cmapSet: new Set(res[files[i]].cmap), file: f[3] }; });
    return by;
  } catch (e) { return null; }
}
/* the face the browser picks for a family and weight among the app's (CSS font matching, no synthesis) */
function faceFor(family, weight) {
  const ws = FACES.filter((f) => f[0] === family).map((f) => f[1]);
  if (!ws.length) return null;
  let pick;
  if (weight >= 400 && weight <= 500) pick = ws.filter((w) => w >= weight && w <= 500).sort((a, b) => a - b)[0] || ws.filter((w) => w < weight).sort((a, b) => b - a)[0] || ws.filter((w) => w > 500).sort((a, b) => a - b)[0];
  else if (weight < 400) pick = ws.filter((w) => w <= weight).sort((a, b) => b - a)[0] || ws.sort((a, b) => a - b)[0];
  else pick = ws.filter((w) => w >= weight).sort((a, b) => a - b)[0] || ws.sort((a, b) => b - a)[0];
  return family + '|' + pick;
}

/* the fonts Chromium used for every piece of text now on the page (CSS.getPlatformFontsForNode); any font that is not
   one of the app's own is a fallback */
async function fontsUsed(page, cdp, facts) {
  const count = await page.evaluate(() => {
    document.querySelectorAll('[data-pt]').forEach((e) => e.removeAttribute('data-pt'));
    let i = 0;
    for (const el of document.querySelectorAll('#gn-stage *, #gn-sideways *')) if ([...el.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim())) el.setAttribute('data-pt', String(i++));
    return i;
  });
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const doc = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '[data-pt]' });
  const used = {};
  const fallbackAt = [];
  for (const id of nodeIds) {
    let fonts = [];
    try { ({ fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id })); } catch (e) { continue; }
    let bad = null;
    for (const f of fonts) {
      const k = (f.isCustomFont ? '' : 'SYSTEM ') + (f.postScriptName || f.familyName);
      used[k] = (used[k] || 0) + f.glyphCount;
      if (!f.isCustomFont) bad = (bad || []).concat(f.familyName + ' ×' + f.glyphCount);
    }
    if (bad) {
      let attrs = [];
      try { ({ attributes: attrs } = await cdp.send('DOM.getAttributes', { nodeId: id })); } catch (e) {}
      const at = attrs.indexOf('data-pt');
      if (at >= 0) fallbackAt.push({ i: attrs[at + 1], fonts: bad });
    }
  }
  const details = fallbackAt.length ? await page.evaluate((list) => list.map(({ i, fonts }) => {
    const el = document.querySelector('[data-pt="' + i + '"]');
    const cs = getComputedStyle(el);
    const text = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.nodeValue).join('').trim();
    return { text, family: cs.fontFamily, weight: +cs.fontWeight, fonts };
  }), fallbackAt) : [];
  for (const d of details) {
    const first = d.family.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    const face = faceFor(first, d.weight);
    const cmap = facts && face && facts[face] ? facts[face].cmapSet : null;
    d.face = face || first;
    d.missing = cmap ? [...new Set([...d.text].filter((ch) => !/\s/.test(ch) && !cmap.has(ch.codePointAt(0))))].map((ch) => ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')) : null;
  }
  return { count, used, fallback: details };
}

/* ---------- the run ---------- */
(async () => {
  if (!fs.existsSync(path.join(SITE, 'index.html'))) throw new Error('no app in ' + SITE);
  fs.mkdirSync(OUT, { recursive: true });
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-platform-'));
  const tls = makeCert(TMP);
  const L = await serve(SITE);
  const P = tls ? await serve(SITE, { tls }) : null;
  ORIGINS = [L.origin, P && P.origin].filter(Boolean);
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  const build = (fs.readFileSync(path.join(SITE, 'assets/build.js'), 'utf8').match(/__gnBuild = "([^"]*)"/) || [])[1];
  const { files: FILES, version: VERSION } = swInfo(SITE);
  console.log(`platform checks: ${SITE} (${build}), sw version ${VERSION}, ${FILES.length} files listed`);
  console.log(`served at ${L.base} (test hooks) and ${P ? P.base + ' (production path)' : '(no https: openssl missing)'}; screenshots in ${OUT}`);
  if (!P) warn('openssl is missing, so the production-path checks (https, no test hooks) are skipped');
  const facts = fontFacts();
  INPUT_STYLES = answerFields().filter((f) => f.type !== 'date').map((f) => ({ name: f.name, tag: f.tag, style: f.style.replace(/\{\{[^}]*\}\}/g, '2px solid #1B2440') }));
  const html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
  let manifest = null;

  // ---------- 1. the files as built ----------
  if (want('static')) {
    section('static: the page, the manifest, the icons, the offline list, the typefaces, the licences');
    ok(/<html[^>]*\blang="es"/.test(html), 'index.html should have <html lang="es">', html.match(/<html[^>]*>/)[0]);
    const metas = { viewport: /<meta name="viewport" content="([^"]*)"/.exec(html), theme: /<meta name="theme-color" content="([^"]*)"/.exec(html), capable: /<meta name="apple-mobile-web-app-capable" content="yes"/.test(html), title: /<meta name="apple-mobile-web-app-title" content="([^"]*)"/.exec(html), bar: /<meta name="apple-mobile-web-app-status-bar-style" content="([^"]*)"/.exec(html), touch: /<link rel="apple-touch-icon" href="([^"]*)"/.exec(html), man: /<link rel="manifest" href="([^"]*)"/.exec(html) };
    ok(metas.viewport && /width=device-width/.test(metas.viewport[1]) && /viewport-fit=cover/.test(metas.viewport[1]), 'the viewport should be device-width with viewport-fit=cover', metas.viewport && metas.viewport[1]);
    ok(metas.capable && metas.title && metas.title[1] === "Epu'ã" && metas.bar && metas.touch && metas.man, 'index.html should carry the Home Screen tags (capable, title, status bar, apple-touch-icon, manifest)', JSON.stringify({ capable: metas.capable, title: metas.title && metas.title[1], bar: metas.bar && metas.bar[1], touch: metas.touch && metas.touch[1], manifest: metas.man && metas.man[1] }));
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    const absolute = refs.filter((u) => /^(\/|[a-z]+:)/i.test(u));
    ok(absolute.length === 0, 'every address in index.html should be relative (the app lives under /epu-/ on GitHub Pages)', absolute.join(', '));
    const missing = refs.filter((u) => !/^(\/|[a-z]+:)/i.test(u)).filter((u) => !fs.existsSync(path.join(SITE, u.split('?')[0])));
    ok(missing.length === 0, 'every file index.html loads should exist', missing.join(', '));

    try { manifest = JSON.parse(fs.readFileSync(path.join(SITE, 'manifest.webmanifest'), 'utf8')); } catch (e) { ok(false, 'manifest.webmanifest should be valid JSON', e.message); }
    if (manifest) {
      const mURL = 'https://jorycook.github.io/epu-/manifest.webmanifest';
      const start = new URL(manifest.start_url || '.', mURL).href;
      const scope = new URL(manifest.scope || '.', mURL).href;
      ok(manifest.name && manifest.short_name && manifest.short_name.length <= 12, 'the manifest should have a name and a short name of 12 characters at most', JSON.stringify([manifest.name, manifest.short_name]));
      ok(start === 'https://jorycook.github.io/epu-/' && scope === 'https://jorycook.github.io/epu-/', 'start_url and scope should both be the app folder', JSON.stringify([start, scope]));
      ok(['standalone', 'fullscreen'].includes(manifest.display), 'display should be standalone', manifest.display);
      ok(manifest.lang === 'es', 'the manifest lang should be es', manifest.lang);
      ok(/^#[0-9A-Fa-f]{6}$/.test(manifest.theme_color || '') && /^#[0-9A-Fa-f]{6}$/.test(manifest.background_color || '') && metas.theme && manifest.theme_color.toUpperCase() === metas.theme[1].toUpperCase(), 'theme_color and background_color should be colours, theme_color the page\'s theme-color', JSON.stringify([manifest.theme_color, manifest.background_color, metas.theme && metas.theme[1]]));
      const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
      const sizes = [];
      for (const ic of icons) {
        const file = path.join(SITE, decodeURIComponent(new URL(ic.src, 'https://x/epu-/manifest.webmanifest').pathname.slice('/epu-/'.length)));
        const info = fs.existsSync(file) ? pngInfo(file) : null;
        ok(info && info.png, `manifest icon ${ic.src} should exist and be a PNG`, info ? JSON.stringify(info) : 'missing');
        if (!info || !info.png) continue;
        ok(ic.type === 'image/png' && ic.sizes === `${info.w}x${info.h}`, `manifest icon ${ic.src} should be what it says: ${ic.sizes} ${ic.type}`, `${info.w}x${info.h}`);
        ok(!ic.purpose || ic.purpose.split(/\s+/).includes('any'), `manifest icon ${ic.src} should be for any use`, ic.purpose);
        sizes.push(info.w);
        if (info.colorType === 4 || info.colorType === 6 || info.trns) note(`${ic.src} has an alpha channel (colour type ${info.colorType}); its pixels are checked below`);
      }
      ok(sizes.includes(192) && sizes.includes(512), 'the manifest should list a 192 and a 512 icon', sizes.join(', '));
      if (!icons.some((ic) => /maskable/.test(ic.purpose || ''))) warn('the manifest has no maskable icon: Android would put the 192/512 icon on a white disc (not an iPhone matter)');
      pass(`manifest: ${icons.length} icons, start ${start}`);
    }
    const touch = metas.touch ? pngInfo(path.join(SITE, metas.touch[1])) : null;
    ok(touch && touch.png && touch.w === 180 && touch.h === 180, 'apple-touch-icon should be a 180x180 PNG', touch && `${touch.w}x${touch.h}`);
    ok(touch && (touch.colorType === 2 || touch.colorType === 0) && !touch.trns, 'apple-touch-icon should have no alpha channel (iOS draws see-through pixels black)', touch && `colour type ${touch.colorType}, tRNS ${touch.trns}`);
    const fav = /<link rel="icon"[^>]*sizes="(\d+)x(\d+)"[^>]*href="([^"]+)"/.exec(html);
    const favInfo = fav ? pngInfo(path.join(SITE, fav[3])) : null;
    ok(favInfo && favInfo.w === +fav[1] && favInfo.h === +fav[2], 'the favicon should be the size it says', favInfo && `${favInfo.w}x${favInfo.h}`);

    /* the sound files (stored when first used, listed apart in sw.js under their own hash) and the studio (estudio/, not the app) are not installed */
    const lazyFiles = Object.keys(JSON.parse((fs.readFileSync(path.join(SITE, 'sw.js'), 'utf8').match(/const LAZY = (\{[\s\S]*?\});/) || [, '{}'])[1]));
    const onDisk = walk(SITE).map((f) => './' + path.relative(SITE, f).split(path.sep).join('/')).filter((f) => !['./sw.js', './.nojekyll'].includes(f) && !f.startsWith('./estudio/'));
    const unlisted = onDisk.filter((f) => !FILES.includes(f) && !lazyFiles.includes(f));
    const ghost = FILES.filter((f) => f !== './' && !onDisk.includes(f)).concat(lazyFiles.filter((f) => !onDisk.includes(f)));
    ok(FILES[0] === './' && unlisted.length === 0 && ghost.length === 0, 'sw.js should list exactly the files of the build (plus ./; the sound files apart)', JSON.stringify({ unlisted, ghost }));
    ok(fs.existsSync(path.join(SITE, '.nojekyll')), 'the site should have .nojekyll (GitHub Pages serves the files as they are)');

    const fontsCss = fs.readFileSync(path.join(SITE, 'assets/fonts.css'), 'utf8');
    const srcs = [...fontsCss.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/['"]/g, ''));
    ok(srcs.length === 5 && srcs.every((u) => /^\.\/fonts\/[\w-]+\.woff2$/.test(u) && fs.existsSync(path.join(SITE, 'assets', u))), 'fonts.css should load five woff2 files of the app\'s own, by relative address', srcs.join(', '));
    ok(!/local\(|@import|googleapis|gstatic/.test(fontsCss), 'fonts.css should not use local(), @import or a font service');
    /* every absolute address in what the app ships: only XML namespaces (not requests) and the licence texts may hold one */
    const external = [];
    for (const f of walk(SITE).filter((x) => /\.(html|js|css|webmanifest)$/.test(x))) {
      const t = fs.readFileSync(f, 'utf8');
      for (const m of t.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"'`)<>\\]*/gi)) if (!/^https?:\/\/www\.w3\.org\//.test(m[0]) && !/^\/\/[a-z0-9.-]*\.(js|css|html)$/i.test(m[0])) external.push(path.relative(SITE, f) + ': ' + m[0].slice(0, 80));
    }
    ok(external.length === 0, 'the app\'s files should hold no address of another site (no font service, no CDN)', [...new Set(external)].slice(0, 12).join(' ; '));
    ok(!/fonts\.googleapis|fonts\.gstatic|cdn\.|unpkg|jsdelivr/i.test(fs.readFileSync(path.join(SITE, 'assets/screens.js'), 'utf8')), 'screens.js should not mention a font service or a CDN');

    /* the answer fields as the screens write them: an input does not take the page's typeface, so each must name the
       app's own; 16 px or more (iOS zooms into a smaller field on focus); no autocorrect or spell check on Guarani */
    {
      const fields = answerFields();
      ok(fields.length > 0, 'the screens should have answer fields to check');
      for (const f of fields) {
        const family = (/font-family:\s*([^;]+)/.exec(f.style) || [])[1] || '';
        const size = +((/font-size:\s*(\d+(?:\.\d+)?)px/.exec(f.style) || [])[1] || 0);
        const where = `${f.name}: <${f.tag}${f.type ? ' type=' + f.type : ''}>`;
        ok(/^'?(EpuaText|Nunito)'?/.test(family.trim()), `${where} should name the app's own typeface (a field does not inherit the page's)`, family || '(none)');
        ok(size >= 16, `${where} should be 16 px or more, or iOS zooms in when it is tapped`, size + ' px');
        if (f.lang === 'gn' && f.type !== 'date') ok(f.autocorrect === 'off' && f.spellcheck === 'false' && f.autocomplete === 'off', `${where} (Guarani) should turn off autocorrect, spell check and autocomplete`, JSON.stringify({ autocorrect: f.autocorrect, spellcheck: f.spellcheck, autocomplete: f.autocomplete, autocapitalize: f.autocapitalize }));
      }
      note('answer fields in the screens: ' + fields.map((f) => `${f.name} ${f.tag}${f.type ? '/' + f.type : ''}${f.lang ? ' lang=' + f.lang : ''}`).join(', '));
    }

    if (facts) {
      for (const [fam, w, ps, file] of FACES) {
        const ff = facts[fam + '|' + w];
        const need = [...GLYPHS, ...EXTRA].join('').normalize('NFC');
        const lack = [...new Set([...need].filter((ch) => !ff.cmapSet.has(ch.codePointAt(0))))].map((ch) => ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'));
        ok(lack.length === 0, `${file}: the character map should hold every Guarani letter, the combining tilde (U+0303), the puso and the apostrophes typed answers can hold`, lack.join(' '));
        ok(ff.flavor === 'woff2', `${file} should be woff2`, ff.flavor);
        ok(ff.gpos.includes('mark') && ff.gsub.includes('ccmp'), `${file} should keep ccmp and mark (they put the tilde of g̃ on its letter)`, JSON.stringify([ff.gpos, ff.gsub]));
        const shown = ['1', '3', '4', '6', '16', '17', '18', '21', '22', '25'].flatMap((id) => ff.names[id] || []);
        ok(ps === (ff.names['6'] || [])[0], `${file}: its PostScript name should be ${ps}`, (ff.names['6'] || []).join());
        if (fam === 'EpuaText') {
          ok(!shown.some((n) => /andika|\bsil\b/i.test(n)), `${file}: no name shown to users may be a Reserved Font Name (Andika, SIL)`, shown.filter((n) => /andika|\bsil\b/i.test(n)).join(' ; '));
          ok((ff.names['0'] || []).some((n) => /SIL International/.test(n)) && (ff.names['13'] || []).some((n) => /Open Font License/.test(n)), `${file} should keep its copyright and licence names`);
        }
      }
      const arrows = ['←', '↑', '→', '↓'].filter((ch) => !facts['Nunito|700'].cmapSet.has(ch.codePointAt(0)));
      if (arrows.length) note(`Nunito lacks ${arrows.join(' ')} (where the screens show them, the fallback check in "screens" names them)`);
      pass('font files: ' + FACES.map((f) => `${f[3]} ${facts[f[0] + '|' + f[1]].cmap.length} characters`).join(', '));
    } else warn('python3 with fontTools is not available: the font files\' character maps are not checked');

    const lic = fs.existsSync(path.join(SITE, 'licenses.txt')) ? fs.readFileSync(path.join(SITE, 'licenses.txt'), 'utf8') : '';
    ok(/Preact 10\.29\.8 \(MIT\)/.test(lic) && /Copyright \(c\) 2015-present Jason Miller/.test(lic) && /Permission is hereby granted, free of charge/.test(lic) && /THE SOFTWARE IS PROVIDED "AS IS"/.test(lic), 'licenses.txt should name Preact 10.29.8 with its MIT licence text');
    /* the shipped Preact is npm's preact 10.29.8, byte for byte (when the app's node_modules is there to compare) */
    const npmPreact = path.join(REPO, 'epua-app/node_modules/preact');
    if (fs.existsSync(path.join(npmPreact, 'package.json'))) {
      const v = JSON.parse(fs.readFileSync(path.join(npmPreact, 'package.json'), 'utf8')).version;
      ok(v === '10.29.8' && sha(fs.readFileSync(path.join(npmPreact, 'dist/preact.min.js'))) === sha(fs.readFileSync(path.join(SITE, 'assets/preact.min.js'))), 'assets/preact.min.js should be preact 10.29.8\'s dist/preact.min.js', v);
    }
    ok(/Nunito[^\n]*Copyright 2014 The Nunito Project Authors/.test(lic), 'licenses.txt should name Nunito with its copyright line');
    ok(/Andika[^\n]*Copyright \(c\) 2004-2022 SIL International[^\n]*Reserved Font Names "Andika" and "SIL"/.test(lic) && /renamed EpuaText/.test(lic) && /epuatext-400\.woff2/.test(lic), 'licenses.txt should name Andika, its Reserved Font Names, and the renamed subset EpuaText and its files');
    const OFL_PARTS = ['SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007', 'PREAMBLE', 'DEFINITIONS', '"Reserved Font Name" refers to any names specified as such', 'PERMISSION & CONDITIONS', '1) Neither the Font Software nor any of its individual components', '2) Original or Modified Versions of the Font Software may be bundled', '3) No Modified Version of the Font Software may use the Reserved Font', '4) The name(s) of the Copyright Holder(s)', '5) The Font Software, modified or unmodified', 'TERMINATION', 'DISCLAIMER', 'OTHER DEALINGS IN THE FONT SOFTWARE.'];
    const lackOfl = OFL_PARTS.filter((s) => !lic.includes(s));
    ok(lackOfl.length === 0, 'licenses.txt should hold the whole SIL Open Font License 1.1', lackOfl.join(' ; '));
    for (const dir of ['nunito', 'andika']) {
      const src = path.join(REPO, 'fonts-src', dir, 'OFL.txt');
      if (!fs.existsSync(src)) continue;
      const t = fs.readFileSync(src, 'utf8').replace(/\r\n?/g, '\n');
      const body = t.slice(t.indexOf('This Font Software is licensed')).replace(/\s+/g, ' ').trim();
      ok(lic.replace(/\s+/g, ' ').includes(body), `licenses.txt should hold ${dir}'s OFL.txt word for word`);
    }
    if (facts) for (const [fam, w, , file] of FACES) { const c = (facts[fam + '|' + w].names['0'] || [])[0]; ok(c && lic.includes(c.replace(/\s+/g, ' ').trim()), `licenses.txt should carry ${file}'s copyright line as the font has it`, c); }
    pass('licenses.txt: ' + lic.length + ' characters');
  }

  // ---------- 2. the design fits every phone ----------
  if (want('fit')) {
    section('fit: the design on each phone, no scroll, no cut-off, no stretch beyond Yaoki\'s rules');
    /* Yaoki's rules (yk-app.js fit), worked out here on their own to compare with what the app does */
    const rule = (vw, vh) => {
      const W = 390; const H = 844; const TOP = 50; const GAP = 8;
      const s = vw / W; const need = H * s;
      if (Math.abs(vh / need - 1) <= 0.02) return { kind: 'stretch', sx: s, sy: vh / H, tx: 0, ty: 0, crop: 0 };
      if (need > vh && (need - vh) / s <= TOP - GAP + 0.03 * H) { const crop = Math.min(TOP - GAP, (need - vh) / s); const sy = vh / (H - crop); return { kind: 'strip', sx: s, sy, tx: 0, ty: -crop * sy, crop }; }
      if (need > vh && vw <= 520) { const k = vh / (H - (TOP - GAP)); return { kind: 'shrink', sx: k, sy: k, tx: (vw - W * k) / 2, ty: -(TOP - GAP) * k, crop: TOP - GAP }; }
      const k = Math.min(s, vh / H);
      return { kind: 'boxed', sx: k, sy: k, tx: (vw - W * k) / 2, ty: (vh - H * k) / 2, crop: 0 };
    };
    const placeOk = (label, r, e, vw, vh) => {
      const t = r.t || {};
      const near = (a, b, d) => Math.abs(a - b) <= d;
      ok(near(t.sx, e.sx, 0.0002) && near(t.sy, e.sy, 0.0002) && near(t.tx, e.tx, 0.02) && near(t.ty, e.ty, 0.02), `${label}: the stage should be placed by Yaoki's ${e.kind} rule`, `got ${JSON.stringify(t)} want sx=${e.sx.toFixed(5)} sy=${e.sy.toFixed(5)} tx=${e.tx.toFixed(2)} ty=${e.ty.toFixed(2)}`);
      const stretch = t.sy / t.sx - 1;
      const allowed = e.kind === 'stretch' ? 0.02 : e.kind === 'strip' ? 0.03 : 0.0001;
      ok(Math.abs(stretch) <= allowed + 0.0005 && (e.kind !== 'strip' || stretch <= 0.0005), `${label}: the design may be stretched by ${(allowed * 100).toFixed(0)}% at most (${e.kind})`, `${(stretch * 100).toFixed(2)}%`);
      if (e.kind === 'stretch') ok(near(r.x, 0, 0.5) && near(r.y, 0, 0.5) && near(r.w, vw, 0.5) && near(r.h, vh, 0.5), `${label}: the design should fill the screen exactly`, JSON.stringify([r.x, r.y, r.w, r.h]));
      else if (e.kind === 'strip') ok(near(r.x, 0, 0.5) && near(r.w, vw, 0.5) && near(r.bottom, vh, 0.6) && r.y < 0 && r.y >= -42 * (vw / 390) - 0.5, `${label}: full width, the bottom at the bottom edge, only the empty top zone left out`, JSON.stringify([r.x, r.y, r.w, r.bottom]));
      else if (e.kind === 'shrink') ok(near(r.bottom, vh, 0.6) && near(r.x * 2 + r.w, vw, 1) && near(r.w / r.h, 390 / 844, 0.002), `${label}: in proportion, centred, the bottom at the bottom edge`, JSON.stringify([r.x, r.y, r.w, r.h]));
      ok(r.docW <= vw + 0.5 && r.docH <= vh + 0.5 && !r.scrolled.moved && r.scrolled.doc[1] === 0 && r.scrolled.view[1] === 0 && r.scrolled.stage === 0, `${label}: the page should not scroll`, JSON.stringify({ docW: r.docW, docH: r.docH, scrolled: r.scrolled }));
      return { stretch, kind: e.kind };
    };
    const summary = [];
    for (const [name, w, h] of PHONES) {
      const ctx = await phone(browser, w, h, { label: 'fit ' + w + 'x' + h, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const logs = [];
      watch(page, logs);
      const e = rule(w, h);
      let cuts = 0;
      let first = null;
      for (const scr of SCREENS) {
        await page.goto(L.base + '?gntest&screen=' + scr + address(SAMPLE));
        await ready(page, 200);
        const r = await page.evaluate(PLACE);
        if (!first) first = placeOk(`${name} ${w}x${h}`, r, e, w, h);
        else if (Math.abs((r.t || {}).sy - e.sy) > 0.0002 || r.scrolled.moved || r.docH > h + 0.5) placeOk(`${name} ${w}x${h} ${scr}`, r, e, w, h);
        const cut = await page.evaluate(CUT, [w, h]);
        cuts += cut.length;
        ok(cut.length === 0, `${name} ${w}x${h} ${scr}: nothing a learner sees may be cut off by the screen's edge`, cut.slice(0, 6).join(' ; '));
        if (scr === 'Main' || (w === 375 && h === 667)) await shot(page, `fit-${w}x${h}-${scr}`);
      }
      /* a swipe on the page moves nothing */
      await page.goto(L.base + '?gntest&screen=Main' + address(SAMPLE));
      await ready(page, 200);
      const b0 = await page.evaluate(() => document.querySelector('#gn-stage').getBoundingClientRect().top);
      await page.mouse.move(8, 8);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(150);
      const b1 = await page.evaluate(() => [document.querySelector('#gn-stage').getBoundingClientRect().top, scrollY]);
      ok(Math.abs(b1[0] - b0) < 0.5 && b1[1] === 0, `${name} ${w}x${h}: a wheel or swipe on the page should move nothing`, JSON.stringify([b0, b1]));
      ok(logs.length === 0, `${name} ${w}x${h}: console problems`, logs.slice(0, 3).join(' ; '));
      summary.push(`${w}x${h} ${e.kind} stretch ${(first.stretch * 100).toFixed(2)}%${e.crop ? ' top ' + e.crop + ' design px left out' : ''}${e.kind === 'shrink' ? ` scale ${e.sx.toFixed(4)}, ${e.tx.toFixed(1)} px each side` : ''}, ${cuts} cut-offs`);
      await ctx.close();
    }
    for (const s of summary) note(s);
    const items = SCREENS.map((s) => [s + ' 375x667', path.join(OUT, `fit-375x667-${s}.png`)]);
    await sheet(browser, 'sheet-fit-375x667', items);
    await sheet(browser, 'sheet-fit-main', PHONES.map(([n, w, h]) => [`${n} ${w}x${h}`, path.join(OUT, `fit-${w}x${h}-Main.png`)]), 9, 150);

    /* from the Home Screen the status bar keeps its strip: the empty top zone gives way, every screen stays clear */
    for (const [name, w, full, bar] of STRIPS) {
      const h = full - bar;
      const ctx = await phone(browser, w, h, { label: 'strip ' + w + 'x' + h, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const e = rule(w, h);
      const all = (w === 393 && h === 793) || (w === 375 && h === 647);
      let cuts = [];
      let first = null;
      for (const scr of all ? SCREENS : ['Main']) {
        await page.goto(L.base + '?gntest&screen=' + scr + address(SAMPLE));
        await ready(page, 200);
        const r = await page.evaluate(PLACE);
        if (!first) first = placeOk(`${name} under a ${bar} px status bar (${w}x${h})`, r, e, w, h);
        const cut = await page.evaluate(CUT, [w, h]);
        if (cut.length) cuts.push(scr + ': ' + cut.slice(0, 3).join(' ; '));
      }
      ok(cuts.length === 0, `${name} ${w}x${h} (Home Screen, status bar ${bar} px): nothing may be cut off`, cuts.slice(0, 6).join(' | '));
      note(`${w}x${h} (${name} from the Home Screen): ${e.kind}, stretch ${(first.stretch * 100).toFixed(2)}%${all ? ', all 21 screens' : ''}`);
      await shot(page, `strip-${w}x${h}-Main`);
      await ctx.close();
    }

    /* a phone held sideways: the note, in the app's own face, and the app back once it is upright */
    const sideways = [['iPhone SE', 667, 375], ['iPhone 14', 844, 390], ['iPhone 16 Pro', 874, 402], ['iPhone 16 Pro Max', 956, 440]];
    for (const [name, w, h] of sideways) {
      const ctx = await phone(browser, w, h, { label: 'sideways ' + w + 'x' + h });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await page.goto(L.base + '?gntest&screen=Main' + address(SAMPLE));
      await ready(page);
      const side = await page.evaluate(() => { const n = document.querySelector('#gn-sideways'); const cs = getComputedStyle(n); const kids = [...n.children].map((c) => c.getBoundingClientRect()); return { cls: document.documentElement.classList.contains('gn-sideways'), display: cs.display, view: getComputedStyle(document.querySelector('#gn-view')).visibility, text: n.textContent.trim().replace(/\s+/g, ' '), inside: kids.every((r) => r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight), gn: n.querySelectorAll('[lang="gn"]').length, font: getComputedStyle(n).fontFamily }; });
      ok(side.cls && side.display === 'flex' && side.view === 'hidden' && /Girá el celular/.test(side.text) && side.inside, `${name} held sideways (${w}x${h}): the note should show instead of the app`, JSON.stringify(side));
      ok(side.gn >= 1, `${name} sideways: Epu'ã in the note should be lang="gn"`);
      const f = await fontsUsed(page, cdp, facts);
      ok(f.fallback.length === 0, `${name} sideways: the note should be drawn in the app's own faces`, JSON.stringify(f.fallback.slice(0, 3)));
      await shot(page, `sideways-${w}x${h}`);
      await page.setViewportSize({ width: h, height: w });
      await page.waitForTimeout(500);
      const up = await page.evaluate(PLACE);
      const e = rule(h, w);
      ok(!up.sideways && Math.abs(up.t.sy - e.sy) < 0.0003 && Math.abs(up.t.sx - e.sx) < 0.0003, `${name}: turned upright again, the app should fit as for ${h}x${w}`, JSON.stringify(up.t));
      await ctx.close();
    }
    /* a window wider than tall without a touch screen (a laptop) shows the design whole, not the note */
    {
      const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1 });
      track(ctx, 'wide window');
      const page = await ctx.newPage();
      await page.goto(L.base + '?gntest&screen=Main');
      await ready(page);
      const r = await page.evaluate(PLACE);
      ok(r.boxed && !r.sideways && Math.abs(r.h - 390) < 0.6, 'a wide window with no touch screen should show the whole design in a frame, not the sideways note', JSON.stringify(r));
      await ctx.close();
    }
    pass('fit: ' + PHONES.length + ' phones x ' + SCREENS.length + ' screens, ' + STRIPS.length + ' status-bar strips, ' + sideways.length + ' sideways');
  }

  // ---------- 3. the first-visit page on each phone (Safari, production path) ----------
  if (want('install') && P) {
    section('install: the Add to Home Screen page on each phone in Safari');
    for (const [name, w, h] of [...PHONES, ...SAFARI]) {
      const ctx = await phone(browser, w, h, { label: 'install ' + w + 'x' + h, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const logs = [];
      watch(page, logs);
      await page.goto(P.base);
      await ready(page);
      const scr = await screenName(page);
      const r = await page.evaluate(() => {
        const root = document.querySelector('#gn-stage .sc-host[data-sc-name="Install"] > div');
        const btn = [...document.querySelectorAll('#gn-stage button')].find((b) => /Seguir en el navegador/.test(b.textContent));
        const b = btn && btn.getBoundingClientRect();
        return root ? { sh: root.scrollHeight, ch: root.clientHeight, sw: root.scrollWidth, cw: root.clientWidth, oy: getComputedStyle(root).overflowY, btn: b ? { top: b.top, bottom: b.bottom, h: b.height } : null, vh: innerHeight, html: document.documentElement.lang } : null;
      });
      ok(scr === 'Install' && r, `${name} ${w}x${h}: Safari on an iPhone should get the install page`, scr);
      if (!r) { await ctx.close(); continue; }
      const scrolls = r.sh > r.ch + 1;
      ok(r.sw <= r.cw + 1, `${name} ${w}x${h}: the install page should not run past the screen's sides`, JSON.stringify(r));
      ok(!scrolls || r.oy === 'auto' || r.oy === 'scroll', `${name} ${w}x${h}: when the install page is taller than the screen it should scroll`, JSON.stringify(r));
      const cut = await page.evaluate(CUT, [w, h]);
      ok(scrolls || cut.length === 0, `${name} ${w}x${h}: nothing on the install page may be cut off`, cut.slice(0, 4).join(' ; '));
      note(`${w}x${h} ${name}: install page ${scrolls ? 'scrolls (' + r.sh + ' in ' + r.ch + ')' : 'fits'}, the button ${r.btn && r.btn.bottom <= r.vh + 0.5 ? 'in view' : 'below the fold'}`);
      ok(logs.length === 0, `${name} ${w}x${h}: console problems on the install page`, logs.slice(0, 3).join(' ; '));
      if ((w === 375 && h === 553) || (w === 390 && h === 664) || (w === 440 && h === 956)) await shot(page, `install-${w}x${h}`);
      await ctx.close();
    }
  }

  // ---------- 4. the Home Screen app skips the install page ----------
  if (want('standalone') && P) {
    section('standalone: opened from the Home Screen, the app starts at once');
    const cases = [
      ['Safari on an iPhone (control)', { }, 'Install'],
      ['iPhone, navigator.standalone', { standalone: true }, 'Goal'],
      ['iPhone, display-mode standalone', { displayMode: true }, 'Goal'],
      ['iPad in Safari (control)', { ua: IPAD }, 'Install'],
      ['iPad, navigator.standalone', { ua: IPAD, standalone: true }, 'Goal'],
      ['iPad with a desktop address (Macintosh, touch)', { ua: MAC_IPAD, touchPoints: 5 }, 'Install'],
      ['iPad with a desktop address, display-mode standalone', { ua: MAC_IPAD, touchPoints: 5, displayMode: true }, 'Goal'],
    ];
    for (const [label, o, want2] of cases) {
      const ctx = await phone(browser, 390, 844, { label, ...o });
      const page = await ctx.newPage();
      const logs = [];
      watch(page, logs);
      await page.goto(P.base);
      await ready(page);
      const scr = await screenName(page);
      const t = await stageText(page);
      const flags = await page.evaluate(() => ({ standalone: navigator.standalone === true, mode: matchMedia('(display-mode: standalone)').matches, device: window.gnApp && window.gnApp.device }));
      ok(scr === want2, `${label}: should open ${want2}`, `opened ${scr} (${JSON.stringify(flags)})`);
      if (want2 !== 'Install') ok(!/Seguir en el navegador|pantalla de inicio/.test(t), `${label}: no word of the install page`);
      if (want2 === 'Install' && /iPad/.test(label)) ok(/en este iPad/.test(t), `${label}: the install page should say iPad`, t.slice(0, 160));
      ok(logs.length === 0, `${label}: console problems`, logs.slice(0, 3).join(' ; '));
      if (label.startsWith('iPhone, navigator')) await shot(page, 'standalone-navigator');
      if (label.startsWith('iPhone, display-mode')) await shot(page, 'standalone-display-mode');
      if (label.startsWith('Safari on an iPhone')) await shot(page, 'install-browser');
      await ctx.close();
    }
    /* the phone in dark mode: the app keeps its light design (color-scheme light), native controls included */
    {
      const ctx = await phone(browser, 390, 844, { label: 'dark mode', standalone: true, colorScheme: 'dark' });
      const page = await ctx.newPage();
      await page.goto(P.base);
      await ready(page);
      const dark = await page.evaluate(() => { const date = document.querySelector('#gn-stage input[type="date"]'); return { media: matchMedia('(prefers-color-scheme: dark)').matches, body: getComputedStyle(document.body).backgroundColor, stage: getComputedStyle(document.querySelector('#gn-stage')).backgroundColor, scheme: getComputedStyle(document.documentElement).colorScheme, date: date ? getComputedStyle(date).colorScheme + ' ' + getComputedStyle(date).backgroundColor : null }; });
      ok(dark.media && dark.body === 'rgb(244, 245, 249)' && dark.stage === 'rgb(244, 245, 249)' && /light/.test(dark.scheme), 'with the phone in dark mode the app should keep its light ground', JSON.stringify(dark));
      await shot(page, 'dark-mode-goal');
      await ctx.close();
    }
    /* a first visit: the first screen is shown once Nunito is in (gn-app.js waits for it, 900 ms at most); the
       Guarani face is not waited for, so when it comes a little later the Guarani text first shows in the next face
       of its stack and then changes */
    {
      const S = await serve(SITE, { tls, slow: (p) => (/epuatext-\d+\.woff2$/.test(p) ? 600 : 0) });
      ORIGINS.push(S.origin);
      const ctx = await phone(browser, 390, 844, { label: 'first paint', standalone: true });
      await ctx.addInitScript(() => {
        const iv = setInterval(() => {
          const h = document.documentElement;
          if (h && h.classList.contains('gn-ready')) { clearInterval(iv); window.__atReveal = { t: Math.round(performance.now()), faces: [...document.fonts].map((f) => f.family.replace(/['"]/g, '') + ' ' + f.weight + ' ' + f.status) }; }
        }, 4);
      });
      await ctx.addInitScript(([k, v]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, v); }, [KEY, JSON.stringify(SAVED)]);
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await page.goto(S.base);
      await page.waitForFunction(() => !!window.__atReveal, null, { timeout: 4000 }).catch(() => {});
      await page.screenshot({ path: path.join(OUT, 'first-paint-early.png') });
      const early = await page.evaluate(() => window.__atReveal);
      await ready(page);
      const used = await fontsUsed(page, cdp, facts);
      /* the faces the first screen draws with (PostScript names), and those of them not in when it was shown */
      const usedFaces = Object.keys(used.used);
      const waiting = (early && early.faces || []).filter((f) => {
        const [family, weight, status] = f.split(' ');
        const face = FACES.find((x) => x[0] === family && String(x[1]) === weight);
        return face && status !== 'loaded' && usedFaces.includes(face[2]);
      });
      if (waiting.length) warn(`first visit (the Guarani face 600 ms behind): the first screen (${await screenName(page)}) is shown at ${early.t} ms while faces it uses are not in yet, so its text changes face after it appears`, waiting.join(', '));
      else note(`first visit: the first screen is shown at ${early && early.t} ms with the faces it uses in (${(early && early.faces || []).join(', ')})`);
      await shot(page, 'first-paint-late');
      /* and opened again from the stored copy, five times: is the Guarani face in when the screen is shown? */
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
      const warm = [];
      for (let i = 0; i < 5; i++) {
        await page.reload();
        await page.waitForFunction(() => !!window.__atReveal, null, { timeout: 4000 }).catch(() => {});
        const at = await page.evaluate(() => window.__atReveal);
        warm.push(at ? at.t + ' ms ' + at.faces.filter((f) => /EpuaText 700/.test(f)).join() : 'no reveal');
      }
      const late = warm.filter((w) => !/EpuaText 700 loaded$/.test(w)).length;
      if (late) warn(`opened from the stored copy, the week path was shown ${late} times of 5 before its Guarani face (EpuaText 700) was in`, warm.join(' ; '));
      else note('opened from the stored copy 5 times: EpuaText 700 was in each time the screen was shown (' + warm.join(' ; ') + ')');
      await ctx.close();
      S.server.close();
    }
    /* with progress saved, the Home Screen app opens on the week path at once */
    {
      const ctx = await phone(browser, 390, 797, { label: 'standalone saved', standalone: true });
      await ctx.addInitScript(([k, v]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, v); }, [KEY, JSON.stringify(SAVED)]);
      const page = await ctx.newPage();
      await page.goto(P.base);
      await ready(page);
      ok((await screenName(page)) === 'Main', 'from the Home Screen with progress saved, the app should open on the week path', await screenName(page));
      await shot(page, 'standalone-saved-390x797');
      await ctx.close();
    }
    pass('standalone: ' + cases.length + ' ways of opening');
  }

  // ---------- 5. the offline copy ----------
  if (want('offline')) {
    section('offline: the worker installs, stores every file, and the app works with no connection');
    const STORED = async () => {
      const out = {};
      for (const k of await caches.keys()) {
        const c = await caches.open(k);
        out[k] = [];
        for (const req of await c.keys()) {
          const res = await c.match(req);
          const buf = await res.clone().arrayBuffer();
          const h = await crypto.subtle.digest('SHA-256', buf);
          out[k].push({ url: req.url, status: res.status, type: res.headers.get('content-type'), size: buf.byteLength, sha: [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('') });
        }
      }
      return out;
    };
    const checkStore = (label, stored, base, dir, version, files) => {
      const keys = Object.keys(stored);
      ok(keys.length === 1 && keys[0] === 'epua:' + PREFIX + ':' + version, `${label}: one store, named after the folder and the version`, JSON.stringify(keys));
      /* the sound files, stored when first used under their own hash (?h=), are not part of the install */
      const list = (stored[keys[0]] || []).filter((e) => !/[?&]h=/.test(e.url));
      const wantUrls = files.map((f) => new URL(f + '?v=' + version, base).href).sort();
      const got = list.map((e) => e.url).sort();
      ok(JSON.stringify(got) === JSON.stringify(wantUrls), `${label}: the store should hold exactly sw.js's ${files.length} files, each under this version`, JSON.stringify({ missing: wantUrls.filter((u) => !got.includes(u)), extra: got.filter((u) => !wantUrls.includes(u)) }));
      const wrong = [];
      for (const e of list) {
        const rel = new URL(e.url).pathname.slice(PREFIX.length) || 'index.html';
        const disk = path.join(dir, rel.endsWith('/') || rel === '' ? 'index.html' : rel);
        if (!fs.existsSync(disk)) { wrong.push(rel + ' not on disk'); continue; }
        const buf = fs.readFileSync(disk);
        if (e.status !== 200 || e.sha !== sha(buf)) wrong.push(`${rel} status ${e.status} ${e.size} bytes, on disk ${buf.length}`);
        if ((TYPES[path.extname(disk)] || '') !== e.type) wrong.push(`${rel} stored as ${e.type}`);
      }
      ok(wrong.length === 0, `${label}: every stored file should be the file on disk, byte for byte, with its type`, wrong.slice(0, 6).join(' ; '));
      return list.length;
    };

    /* a: the worker on the test-hook address (?sw), then every screen with no connection */
    {
      const ctx = await phone(browser, 390, 844, { label: 'offline L', standalone: true });
      const page = await ctx.newPage();
      const logs = [];
      watch(page, logs);
      await page.goto(L.base + '?sw');
      await ready(page);
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
      const n = checkStore('test address', await page.evaluate(STORED), L.base, SITE, VERSION, FILES);
      const reg = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { scope: r.scope, script: r.active && r.active.scriptURL, via: r.updateViaCache }; });
      ok(reg.scope === L.base && reg.script === L.base + 'sw.js', 'the worker\'s scope should be the app folder', JSON.stringify(reg));
      note(`stored ${n} files under epua:${PREFIX}:${VERSION}; worker scope ${reg.scope}, updateViaCache ${reg.via}`);
      await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(SAVED)]);
      const hitsBefore = L.hits.length;
      ctx.__offline = true;
      await ctx.setOffline(true);
      L.down = true;
      L.refused.length = 0;
      await page.reload();
      await ready(page);
      ok((await screenName(page)) === 'Main', 'offline, the app should reopen on the week path from the stored copy', await screenName(page));
      const shots = [];
      for (const scr of SCREENS) {
        const served = [];
        const onResp = (r) => served.push({ url: r.url(), sw: r.fromServiceWorker(), status: r.status() });
        page.on('response', onResp);
        const before = logs.length;
        await page.goto(L.base + '?gntest&screen=' + scr + address(SAMPLE));
        await ready(page);
        page.off('response', onResp);
        const name = await screenName(page);
        const errs = await logicErrors(page);
        const chars = (await stageText(page)).length;
        const faces = await page.evaluate(() => [...document.fonts].map((f) => f.family + ' ' + f.weight + ' ' + f.status));
        const notSw = served.filter((s) => !s.sw || s.status !== 200).map((s) => s.url + ' ' + s.status);
        ok(name === scr && errs.length === 0 && chars > 20, `offline: ${scr} should open and work`, JSON.stringify({ name, errs, chars }));
        ok(notSw.length === 0, `offline: ${scr} should get every file from the stored copy`, notSw.slice(0, 4).join(' ; '));
        ok(!faces.some((f) => /error/.test(f)), `offline: ${scr}: no typeface may fail`, faces.join(', '));
        ok(logs.length === before, `offline: ${scr}: console problems`, logs.slice(before, before + 3).join(' ; '));
        await shot(page, 'offline-' + scr);
        shots.push([scr + ' (offline)', path.join(OUT, 'offline-' + scr + '.png')]);
      }
      await sheet(browser, 'sheet-offline', shots);
      const fontsOk = await page.evaluate(async (faces) => { const got = []; for (const [f, w] of faces) { try { const list = await document.fonts.load(`${w} 16px "${f}"`, "g̃ãẽĩõũỹ'"); got.push(f + ' ' + w + ':' + (list.length === 1 && list[0].status === 'loaded')); } catch (e) { got.push(f + ' ' + w + ': ' + e.message); } } return got; }, FACES);
      ok(fontsOk.every((s) => /:true$/.test(s)), 'offline, all five typefaces should load from the stored copy', fontsOk.join(', '));
      const lic = await page.goto(L.base + 'licenses.txt');
      ok(lic.status() === 200 && /Open Font License/.test(await page.textContent('body')), 'offline, licenses.txt should be there', lic.status());
      const other = await page.goto(L.base + 'no-such-page');
      ok(other.status() === 200 && (await page.locator('#gn-stage').count()) === 1, 'offline, another address in the app folder should open the app', other.status());
      ok(L.hits.length === hitsBefore, 'offline, nothing should reach the server', L.hits.slice(hitsBefore).map((h) => h.path).join(', '));
      if (L.refused.length) note('offline, the browser still tried (and failed) to reach: ' + [...new Set(L.refused)].join(', '));
      L.down = false;
      await ctx.setOffline(false);
      ctx.__offline = false;
      await ctx.close();
    }

    /* b: the production path: the worker registers by itself; the phone is restarted with no connection (a cold start
       of a kept browser profile), and the app is used from the Home Screen */
    if (P) {
      const profile = fs.mkdtempSync(path.join(TMP, 'profile-'));
      const launch = (offline) => chromium.launchPersistentContext(profile, { args: ['--ignore-certificate-errors'], ignoreHTTPSErrors: true, viewport: { width: 390, height: 797 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: IPHONE, offline });
      let ctx = await launch(false);
      track(ctx, 'cold start online');
      await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'standalone', { get: () => true, configurable: true }); });
      let page = ctx.pages()[0] || (await ctx.newPage());
      const logs = [];
      watch(page, logs);
      await page.goto(P.base);
      await ready(page);
      const reg = await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 }).then(() => true, () => false);
      ok(reg, 'on https (the production path), the offline worker should register and take over by itself, with no ?sw');
      if (reg) checkStore('production path', await page.evaluate(STORED), P.base, SITE, VERSION, FILES);
      /* the fonts come from the app's address and, once it is stored, from the stored copy */
      await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(SAVED)]);
      const fontHits = () => P.hits.filter((h) => /\.woff2$/.test(h.path) && !/v=/.test(h.search)).length;
      const fh0 = fontHits();
      await page.reload();
      await ready(page);
      const fromSw = await page.evaluate(() => performance.getEntriesByType('resource').filter((e) => /\.woff2/.test(e.name)).map((e) => ({ url: e.name, sw: e.workerStart > 0 || e.deliveryType === 'cache' || e.transferSize === 0 })));
      ok(fontHits() === fh0 && fromSw.every((e) => e.sw), 'once stored, the typefaces should come from the stored copy, not the network', JSON.stringify({ newHits: fontHits() - fh0, fromSw }));
      await ctx.close();

      ctx = await launch(true);
      ctx.__offline = true;
      track(ctx, 'cold start offline');
      await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'standalone', { get: () => true, configurable: true }); });
      page = ctx.pages()[0] || (await ctx.newPage());
      watch(page, logs);
      const hits0 = P.hits.length;
      P.down = true;
      P.refused.length = 0;
      await page.goto(P.base);
      await ready(page);
      ok((await screenName(page)) === 'Main', 'a cold start with no connection should open the app on the week path', await screenName(page));
      await shot(page, 'offline-cold-start');
      const route = [];
      for (const [tab, scr] of [['Cuaderno', 'Notebook'], ['Examen', 'ExamTab'], ['Progreso', 'Progress'], ['Camino', 'Main']]) {
        await page.locator('#gn-stage nav a').filter({ hasText: tab }).first().tap({ timeout: 5000 });
        await page.waitForTimeout(500);
        route.push(tab + '→' + (await screenName(page)));
        ok((await screenName(page)) === scr && !(await logicErrors(page)).length, `offline cold start: the ${tab} tab should open ${scr}`, await screenName(page));
      }
      /* the day's own button: with a mistake due, the callout also has a row «Antes de empezar: 1 para repasar» */
      await page.locator('#gn-stage a[href="Today.dc.html"], #gn-stage a[href="WeekTest.dc.html"]').filter({ hasText: 'Empezar' }).first().tap({ timeout: 5000 });
      await page.waitForTimeout(600);
      const day1 = await screenName(page);
      /* the saved learner is part way through the day: the day's main action goes on with its lesson */
      const action = page.locator('#gn-stage button, #gn-stage a').filter({ hasText: /Seguir con la práctica|Empezar con la regla|Seguir con/ }).first();
      const actionText = ((await action.textContent().catch(() => '')) || '').trim();
      await action.tap({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(700);
      const lesson = await screenName(page);
      ok(day1 === 'Today' && ['Teach', 'Compare', 'Drill', 'Exam'].includes(lesson) && !(await logicErrors(page)).length, 'offline cold start: the day and its lesson should open', `${day1}, then "${actionText}" opened ${lesson}`);
      await shot(page, 'offline-cold-lesson');
      ok(P.hits.length === hits0, 'offline cold start: nothing should reach the server', P.hits.slice(hits0).map((h) => h.path).join(', '));
      if (P.refused.length) note('offline cold start: the browser tried (and failed) to reach ' + [...new Set(P.refused)].join(', ') + ' (its update check; the app did not need it)');
      P.down = false;
      ok(logs.length === 0, 'production path, online and offline: console problems', logs.slice(0, 4).join(' ; '));
      note('cold start offline: ' + route.join(', ') + ', Today, ' + lesson);
      await ctx.close();
    }
  }

  // ---------- 6. a new build is picked up ----------
  if (want('update') && P) {
    section('update: a new build replaces the stored copy');
    const copy = fs.mkdtempSync(path.join(TMP, 'site-'));
    fs.cpSync(SITE, copy, { recursive: true });
    /* a slow network for one build: its files are answered no sooner than 6.5 s after the first of them was asked for */
    let slowVersion = null;
    let slowFrom = 0;
    const U = await serve(copy, { tls, slow: (p, search) => { if (!slowVersion || !search.includes('v=' + slowVersion)) return 0; if (!slowFrom) slowFrom = Date.now(); return Math.max(0, slowFrom + 6500 - Date.now()); } });
    ORIGINS.push(U.origin);
    const bump = (version, label) => {
      const swf = path.join(copy, 'sw.js');
      fs.writeFileSync(swf, fs.readFileSync(swf, 'utf8').replace(/const VERSION = '[0-9a-f]+';/, `const VERSION = '${version}';`));
      fs.writeFileSync(path.join(copy, 'assets/build.js'), `/* Generated by build.mjs. */\nwindow.__gnBuild = ${JSON.stringify(`Epu'ã ${label} · test · ${version.slice(0, 6)}`)};\n`);
    };
    const ctx = await phone(browser, 390, 797, { label: 'update', standalone: true });
    const page = await ctx.newPage();
    const logs = [];
    watch(page, logs);
    await page.goto(U.base);
    await ready(page);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(SAVED)]);
    await page.reload();
    await ready(page);
    const v1 = await page.evaluate(() => window.__gnBuild);
    ok((await screenName(page)) === 'Main', 'the update copy should open on the week path', await screenName(page));
    const keysOf = () => page.evaluate(() => caches.keys());
    const countOf = (k) => page.evaluate(async (k) => (await (await caches.open(k)).keys()).map((r) => r.url), k);

    /* a: a new build is on the site; the app is opened again (a reload): it should switch at once, before any tap */
    bump('a1a1a1a1a1', '0.1-platform-A');
    const t0 = Date.now();
    await page.reload();
    const gotA = await page.waitForFunction(() => /platform-A/.test(window.__gnBuild || ''), null, { timeout: 20000 }).then(() => true, () => false);
    await ready(page);
    const vA = await page.evaluate(() => window.__gnBuild);
    ok(gotA, 'reopened with a new build on the site, the app should restart into it before the first tap', `was "${v1}", now "${vA}"`);
    note(`new build A up ${((Date.now() - t0) / 1000).toFixed(1)} s after reopening: ${vA}`);
    const kA = await keysOf();
    ok(kA.length === 1 && kA[0] === 'epua:' + PREFIX + ':a1a1a1a1a1', 'after the update, only the new store should be left', JSON.stringify(kA));
    if (kA.length) { const urls = await countOf(kA[0]); ok(urls.length === FILES.length && urls.every((u) => /v=a1a1a1a1a1/.test(u)), 'the new store should hold every file under the new version', urls.length); }
    ok((await screenName(page)) === 'Main' && JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY)) || '{}').plan, 'after the update the progress should be kept and the app on the week path', await screenName(page));
    await shot(page, 'update-after-A');

    /* b: a slow network: the new build is only stored after the first five seconds; the app waits for a quiet moment
       (back to the week path from another tab), never switching under the learner */
    slowVersion = 'b2b2b2b2b2';
    bump('b2b2b2b2b2', '0.1-platform-B');
    const tB = Date.now();
    await page.reload();
    await ready(page);
    /* wait until the slow build has taken over (its store alone is left), then a moment for the app to react */
    let kB = [];
    for (let i = 0; i < 80; i++) { kB = await keysOf(); if (kB.length === 1 && kB[0].endsWith(':b2b2b2b2b2')) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(1500);
    const stillA = await page.evaluate(() => window.__gnBuild);
    note(`slow build B stored and in charge ${((Date.now() - tB) / 1000).toFixed(1)} s after reopening; the app shows "${stillA}"`);
    ok(kB.length === 1 && kB[0] === 'epua:' + PREFIX + ':b2b2b2b2b2', 'the slow new build should still be stored, replacing the old store', JSON.stringify(kB));
    ok(/platform-A/.test(stillA), 'a build that arrives after the first seconds should not restart the app while it is in use', stillA);
    await page.locator('#gn-stage nav a').filter({ hasText: 'Cuaderno' }).first().tap();
    await page.waitForTimeout(500);
    const midway = await page.evaluate(() => window.__gnBuild);
    await page.locator('#gn-stage nav a').filter({ hasText: 'Camino' }).first().tap();
    const gotB = await page.waitForFunction(() => /platform-B/.test(window.__gnBuild || ''), null, { timeout: 15000 }).then(() => true, () => false);
    await ready(page);
    ok(/platform-A/.test(midway) && gotB, 'the waiting build should be switched to on the way back to the week path', JSON.stringify([midway, await page.evaluate(() => window.__gnBuild)]));
    ok((await screenName(page)) === 'Main', 'after the quiet-moment switch, the app should be on the week path', await screenName(page));
    ok(logs.filter((l) => !/Failed to load resource/.test(l)).length === 0, 'updates: console problems', logs.slice(0, 4).join(' ; '));
    await ctx.close();
    U.server.close();
  }

  // ---------- 7. the manifest and the icons as the browser reads them ----------
  if (want('manifest') && P) {
    section('manifest: as Chromium reads it, installability, the icons\' pixels');
    const ctx = await phone(browser, 390, 844, { label: 'manifest', standalone: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await page.goto(P.base);
    await ready(page);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    const res = await page.request.get(P.base + 'manifest.webmanifest');
    ok(res.status() === 200 && /application\/manifest\+json/.test(res.headers()['content-type'] || ''), 'the manifest should be served', res.status() + ' ' + res.headers()['content-type']);
    const m = await cdp.send('Page.getAppManifest', {});
    ok(m.url === P.base + 'manifest.webmanifest' && m.errors.length === 0, 'Chromium should read the manifest with no errors', JSON.stringify(m.errors));
    const parsed = m.manifest || {};
    ok(parsed.startUrl === P.base && parsed.scope === P.base && parsed.display === 'kStandalone' && parsed.id === P.base, 'Chromium should read start_url, scope, id and display as the app folder, standalone', JSON.stringify({ start: parsed.startUrl, scope: parsed.scope, id: parsed.id, display: parsed.display }));
    const inst = await cdp.send('Page.getInstallabilityErrors', {});
    ok(inst.installabilityErrors.length === 0, 'Chromium should find the app installable', JSON.stringify(inst.installabilityErrors));
    const urls = [...(parsed.icons || []).map((i) => i.url), P.base + 'icons/apple-touch-icon.png', P.base + 'icons/favicon-32.png'];
    const px = await page.evaluate(async (urls) => {
      const out = {};
      for (const u of urls) {
        const img = new Image();
        img.src = u;
        try { await img.decode(); } catch (e) { out[u] = { error: String(e) }; continue; }
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let clear = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 255) clear += 1;
        const at = (x, y) => { const i = (y * c.width + x) * 4; return '#' + [d[i], d[i + 1], d[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(); };
        out[u] = { w: c.width, h: c.height, clear, corners: [at(0, 0), at(c.width - 1, 0), at(0, c.height - 1), at(c.width - 1, c.height - 1)] };
      }
      return out;
    }, urls);
    for (const u of urls.slice(0, -1)) {
      const p = px[u];
      ok(p && !p.error && p.clear === 0, `${u.slice(P.base.length)} should be opaque in every pixel`, JSON.stringify(p));
      ok(p && p.corners && p.corners.every((c) => c === '#C2336F'), `${u.slice(P.base.length)} should run its pink tile to the corners (iOS rounds them)`, JSON.stringify(p && p.corners));
    }
    const at = px[P.base + 'icons/apple-touch-icon.png'];
    ok(at && at.w === 180 && at.h === 180, 'apple-touch-icon should decode at 180x180', JSON.stringify(at));
    /* the icons side by side, to look at */
    await page.setContent(`<body style="margin:0;padding:16px;background:#ddd;display:flex;gap:16px;align-items:flex-end">${urls.map((u) => `<figure style="margin:0;text-align:center;font:12px sans-serif"><img src="${u}" style="display:block;border-radius:22%"><figcaption>${u.split('/').pop()} (iOS mask)</figcaption></figure>`).join('')}</body>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, 'icons.png'), fullPage: true });
    pass('manifest and icons read by Chromium');
    await ctx.close();
  }

  // ---------- 8. the typefaces ----------
  if (want('fonts')) {
    section('fonts: served by the app, every Guarani letter in the app\'s own faces');
    const ctx = await phone(browser, 390, 844, { label: 'fonts' });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    const logs = [];
    watch(page, logs);
    await page.goto(L.base + '?gntest&screen=Main' + address(SAMPLE));
    await ready(page);
    const all = [...GLYPHS, ...EXTRA];
    const facesState = await page.evaluate(async ([faces, text]) => {
      for (const [f, w] of faces) await document.fonts.load(`${w} 40px "${f}"`, text);
      return { faces: [...document.fonts].map((f) => ({ family: f.family.replace(/['"]/g, ''), weight: f.weight, status: f.status, display: f.display })), res: performance.getEntriesByType('resource').filter((e) => /\.woff2/.test(e.name)).map((e) => e.name) };
    }, [FACES, all.join('')]);
    ok(facesState.faces.length === 5 && facesState.faces.every((f) => f.status === 'loaded'), 'document.fonts should hold the five faces, all loaded', JSON.stringify(facesState.faces));
    ok(facesState.res.length === 5 && facesState.res.every((u) => u.startsWith(L.base + 'assets/fonts/')), 'the five font files should come from the app\'s own address', facesState.res.join(', '));
    /* each letter drawn in each face twice, with two different fallbacks behind it: the same pixels and width mean the
       face drew it; a control letter the faces lack shows the method sees a fallback */
    const glyphTest = await page.evaluate(async ([faces, glyphs, control]) => {
      const S = 100;
      const c = document.createElement('canvas');
      c.width = 3 * S;
      c.height = 2 * S;
      const g = c.getContext('2d', { willReadFrequently: true });
      const draw = (font, text) => {
        g.clearRect(0, 0, c.width, c.height);
        g.font = font;
        g.fillStyle = '#000';
        g.textBaseline = 'alphabetic';
        g.fillText(text, S * 0.6, S * 1.3);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let h = 2166136261;
        let x0 = 1e9; let y0 = 1e9; let x1 = -1; let y1 = -1;
        const mask = new Uint8Array(c.width * c.height);
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
          const a = d[(y * c.width + x) * 4 + 3];
          h = Math.imul(h ^ a, 16777619) >>> 0;
          if (a > 100) { mask[y * c.width + x] = 1; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
        return { w: g.measureText(text).width, hash: h, box: x1 < 0 ? null : { x0, y0, x1, y1 }, mask };
      };
      const diff = (a, b) => { let x0 = 1e9; let y0 = 1e9; let x1 = -1; let y1 = -1; for (let i = 0; i < a.mask.length; i++) if (a.mask[i] && !b.mask[i]) { const x = i % c.width; const y = (i / c.width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return x1 < 0 ? null : { x0, y0, x1, y1 }; };
      const out = { control: [], faces: [] };
      for (const [f, w] of faces) {
        const mono = `${w} ${S}px "${f}", monospace`;
        const serif = `${w} ${S}px "${f}", serif`;
        const ctl = [draw(mono, control), draw(serif, control)];
        out.control.push(f + ' ' + w + ': ' + (ctl[0].hash !== ctl[1].hash ? 'fallback seen' : 'fallback NOT seen'));
        const res = { face: f + ' ' + w, lack: [], tilde: {} };
        for (const ch of glyphs) {
          const a = draw(mono, ch);
          const b = draw(serif, ch);
          if (a.hash !== b.hash || Math.abs(a.w - b.w) > 0.01) res.lack.push(ch);
        }
        /* where the tilde of g̃ and G̃ sits, against the precomposed ã and Ã of the same face */
        for (const [base, comb, ref, refBase] of [['g', 'g̃', 'ã', 'a'], ['G', 'G̃', 'Ã', 'A']]) {
          const b0 = draw(serif, base); const b1 = draw(serif, comb); const r0 = draw(serif, refBase); const r1 = draw(serif, ref);
          const t = diff(b1, b0); const tr = diff(r1, r0);
          if (!t || !b0.box || !tr || !r0.box) { res.tilde[comb] = { error: 'no tilde drawn' }; continue; }
          const origin = S * 0.6;
          res.tilde[comb] = {
            /* the tilde's middle, as a share of the letter's advance (0.5 is the middle) */
            mid: +(((t.x0 + t.x1) / 2 - origin) / b0.w).toFixed(3), refMid: +(((tr.x0 + tr.x1) / 2 - origin) / r0.w).toFixed(3),
            /* the gap between the tilde's bottom and the letter's top, in px at 100 px, and the precomposed letter's */
            gap: b0.box.y0 - t.y1, refGap: r0.box.y0 - tr.y1,
            /* the tilde's bottom against the precomposed tilde's bottom */
            height: t.y1, refHeight: tr.y1, width: t.x1 - t.x0, refWidth: tr.x1 - tr.x0,
          };
        }
        out.faces.push(res);
      }
      return out;
    }, [FACES, all, 'Ж']);
    ok(glyphTest.control.every((s) => /fallback seen/.test(s)), 'the glyph test should see a fallback for a letter the faces lack (Ж), or it proves nothing', glyphTest.control.join(', '));
    for (const f of glyphTest.faces) {
      ok(f.lack.length === 0, `${f.face}: every Guarani letter should be drawn by the face itself, not a fallback`, f.lack.join(' '));
      for (const [comb, t] of Object.entries(f.tilde)) {
        const good = !t.error && Math.abs(t.mid - t.refMid) <= 0.12 && t.mid > 0.3 && t.mid < 0.75 && t.gap >= -1 && Math.abs(t.height - t.refHeight) <= 8;
        ok(good, `${f.face}: the tilde of ${comb} should sit on its letter like the tilde of the precomposed vowel`, JSON.stringify(t));
      }
    }
    note('tilde of g̃/G̃ (middle as share of the advance; gap above the letter; bottom vs the precomposed vowel\'s): ' + glyphTest.faces.map((f) => f.face + ' ' + Object.entries(f.tilde).map(([k, t]) => `${k} mid ${t.mid}/${t.refMid} gap ${t.gap}/${t.refGap} bottom ${t.height}/${t.refHeight}`).join(', ')).join(' | '));
    /* the same letters as text on the page, and the fonts Chromium says it used for each */
    await page.evaluate(([faces, glyphs]) => {
      const box = document.createElement('div');
      box.id = 'pt-glyphs';
      box.style.cssText = 'position:fixed;left:0;top:0;right:0;z-index:99;background:#fff;padding:10px;font-size:26px;line-height:1.5';
      faces.forEach(([f, w], i) => {
        const row = document.createElement('div');
        row.style.cssText = `font-family:"${f}", sans-serif;font-weight:${w}`;
        const tag = document.createElement('span');
        tag.style.cssText = 'font:12px monospace;display:inline-block;width:110px';
        tag.textContent = f + ' ' + w;
        row.appendChild(tag);
        glyphs.forEach((ch, j) => { const s = document.createElement('span'); s.textContent = ch; s.setAttribute('data-gl', i + ':' + j); s.style.margin = '0 2px'; row.appendChild(s); });
        box.appendChild(row);
      });
      const fb = document.createElement('div');
      fb.style.cssText = 'font-family:serif;font-size:26px;color:#888';
      fb.textContent = 'fallback (serif): ' + glyphs.join(' ');
      box.appendChild(fb);
      document.body.appendChild(box);
    }, [FACES, all]);
    await page.waitForTimeout(200);
    await page.locator('#pt-glyphs').screenshot({ path: path.join(OUT, 'glyphs.png') });
    /* the same letters large, for the tilde of g̃ */
    await page.evaluate(([faces]) => {
      const box = document.createElement('div');
      box.id = 'pt-big';
      box.style.cssText = 'position:fixed;left:0;top:0;right:0;z-index:100;background:#fff;padding:6px;font-size:64px;line-height:1.25';
      faces.forEach(([f, w]) => { const row = document.createElement('div'); row.style.cssText = `font-family:"${f}", sans-serif;font-weight:${w};white-space:nowrap`; row.textContent = 'g̃ G̃ ã Ã ỹ Ỹ ñ \''; box.appendChild(row); });
      document.body.appendChild(box);
    }, [FACES]);
    await page.waitForTimeout(200);
    await page.locator('#pt-big').screenshot({ path: path.join(OUT, 'glyphs-big.png') });
    await page.evaluate(() => document.getElementById('pt-big').remove());
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const doc = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '[data-gl]' });
    const wrong = [];
    for (const id of nodeIds) {
      const { attributes } = await cdp.send('DOM.getAttributes', { nodeId: id });
      const [i, j] = attributes[attributes.indexOf('data-gl') + 1].split(':').map(Number);
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
      if (!(fonts.length === 1 && fonts[0].isCustomFont && fonts[0].postScriptName === FACES[i][2])) wrong.push(`${all[j]} in ${FACES[i][0]} ${FACES[i][1]}: ${fonts.map((f) => f.postScriptName + (f.isCustomFont ? '' : ' (system)') + ' ×' + f.glyphCount).join(' + ')}`);
    }
    ok(wrong.length === 0, 'Chromium should draw every Guarani letter, as text, in the asked face alone', wrong.slice(0, 10).join(' ; '));
    /* typed letters: the answer fields of the screens, with their own styles, holding what a learner types (an iPhone
       turns ' into ’ with smart punctuation) */
    if (INPUT_STYLES && INPUT_STYLES.length) {
      await page.evaluate(() => document.getElementById('pt-glyphs').remove());
      await page.evaluate((list) => {
        const box = document.createElement('div');
        box.id = 'pt-fields';
        box.style.cssText = 'position:fixed;left:0;top:0;width:390px;z-index:99;background:#F4F5F9;padding:8px;display:flex;flex-direction:column;gap:6px';
        list.forEach((f, i) => { const el = document.createElement(f.tag); if (f.tag === 'input') el.type = 'text'; el.setAttribute('style', f.style); el.setAttribute('data-field', String(i)); box.appendChild(el); });
        const plain = document.createElement('input');
        plain.type = 'text';
        plain.setAttribute('data-field', 'plain');
        box.appendChild(plain);
        document.body.appendChild(box);
      }, INPUT_STYLES);
      const typed = "Mba'éichapa g̃uahẽ ñe’ẽ ỹ G̃ Ã Ẽ Ĩ Õ Ũ Ỹ Ñ ʼ";
      for (const sel of [...INPUT_STYLES.map((f, i) => `[data-field="${i}"]`), '[data-field="plain"]']) { await page.click(sel); await page.keyboard.insertText(typed); }
      await page.locator('#pt-fields').screenshot({ path: path.join(OUT, 'typed-fields.png') });
      const tree = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
      const editors = [];
      const visit = (n, field) => {
        if (n.nodeName === 'INPUT' || n.nodeName === 'TEXTAREA') { const a = n.attributes || []; const k = a.indexOf('data-field'); field = k >= 0 ? a[k + 1] : null; }
        if (field !== null && field !== undefined && n.nodeName === 'DIV') editors.push({ id: n.nodeId, field });
        for (const c of [...(n.children || []), ...(n.shadowRoots || [])]) visit(c, field);
      };
      visit(tree.root, null);
      const byField = {};
      for (const e of editors) { const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: e.id }); if (fonts.length) byField[e.field] = fonts.map((f) => f.postScriptName + (f.isCustomFont ? '' : ' (system)')); }
      ok(byField.plain && byField.plain.some((f) => /system/.test(f)), 'control: a field with no typeface of its own should fall back to a system face (else this check proves nothing)', JSON.stringify(byField.plain));
      INPUT_STYLES.forEach((f, i) => ok(byField[i] && byField[i].length && byField[i].every((x) => !/system/.test(x)), `${f.name}'s ${f.tag}: what a learner types should be drawn in the app's own face`, JSON.stringify(byField[i])));
      note('typed text: ' + INPUT_STYLES.map((f, i) => `${f.name} ${f.tag} → ${(byField[i] || []).join('+')}`).join(', ') + `; a plain field → ${(byField.plain || []).join('+')}`);
    }
    pass(`fonts: ${all.length} letters x ${FACES.length} faces drawn in the app's own faces`);
    ok(logs.length === 0, 'fonts: console problems', logs.slice(0, 3).join(' ; '));
    await ctx.close();
  }

  // ---------- 9. every screen's frame, its tap targets, its fonts and its languages ----------
  if (want('screens')) {
    section('screens: 390x844 roots, nothing out of the frame, taps of 44x44, fonts used, lang');
    const ctx = await phone(browser, 390, 844, { label: 'screens', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    const logs = [];
    watch(page, logs);
    await page.goto(L.base + '?gntest&screen=Main');
    await ready(page);
    ok((await page.evaluate(() => document.documentElement.lang)) === 'es', 'the page should be lang="es"');
    const states = new Map();
    const small = new Map();
    const smallKind = new Map();
    const fallback = new Map();
    const untagged = new Map();
    const fromContent = new Set();
    const labels = new Map();
    const wordBreaks = new Map();
    const usedAll = {};
    let rootBad = 0;
    const stateKey = async (scr) => scr + '|' + crypto.createHash('sha1').update((await stageText(page)) + (await page.evaluate(() => document.querySelectorAll('#gn-stage *').length))).digest('hex').slice(0, 12);
    /* a second learner, further on: in the last written week (A1 unit 4 today), its first day done and its second open,
       with a mistake of that week in the notebook. The first sample stands in unit 1, and unit 1 alone hid what the later
       weeks' longer words, titles and explanations do to the screens */
    const far = await page.evaluate(() => {
      const C = window.gnCourse;
      C.setLevel('A1');
      const ready = C.sessions().filter((s) => s.ready);
      const n = ready.reduce((m, s) => Math.max(m, s.unit), 0);
      const it = n > 1 ? C.day(C.sid(n, 1)).grammar.drill.map((x) => (typeof x === 'string' ? C.item(x) : x)).filter((x) => x && x.kind === 'choice')[0] : null;
      return { n, days: ready.filter((s) => s.kind !== 'test' && s.unit < n).map((s) => s.id), tests: ready.filter((s) => s.kind === 'test' && s.unit < n).map((s) => s.id), d1: C.sid(n, 1), d2: C.sid(n, 2), src: it ? it.id : '', wrong: it ? C.plain(it.options[it.answer % it.options.length]) : '' };
    });
    let SAMPLE2 = null;
    if (far.n > 1 && far.src) {
      const done = {};
      far.days.forEach((id) => { done[id] = FULL; });
      done[far.d1] = FULL;
      done[far.d2] = { g: 1 };
      const tests = {};
      far.tests.forEach((id) => { tests[id] = { id, score: 18, of: 20, used: 700, areas: { vocab: { right: 5, of: 5 }, grammar: { right: 8, of: 10 }, reading: { right: 3, of: 3 }, listening: { right: 2, of: 2 } }, at: Date.now() - 864e5 }; });
      SAMPLE2 = { level: 'A1', plan: { start: day(-7 * (far.n - 1) - 1), target: day(60), pace: 'fit', minutes: 30 }, done, tests, m: [{ src: far.src, wrong: far.wrong, at: Date.now() - 864e5, step: 0, due: day(0) }], cur: far.d2, placement: SAMPLE.placement };
      note(`a second learner for the screens: in week ${far.n} (${far.d2} open, a mistake at ${far.src})`);
    }
    const FAR = SAMPLE2 ? 'in week ' + far.n : '';
    const look = async (scr, label) => {
      const key = await stateKey(scr);
      if (states.has(key)) return false;
      const res = await page.evaluate(INSPECT, scr);
      states.set(key, label);
      const where = `${label}`;
      ok(res.errors.length === 0, `${where}: logic errors`, res.errors.join(' ; '));
      if (res.root) {
        const r = res.root;
        const good = r.w === 390 && r.h === 844 && r.sh === 844 && r.sw === 390 && Math.abs(r.x) < 0.5 && Math.abs(r.y) < 0.5 && r.kids === 1;
        if (!good) rootBad += 1;
        ok(good, `${where}: the screen's root should be exactly 390x844 at the frame's corner (scrollHeight 844, scrollWidth 390)`, JSON.stringify(r));
      }
      ok(!res.shell || (res.shell.w === 390 && res.shell.h === 844 && res.shell.sh === 844 && res.shell.sw === 390), `${where}: the app frame should stay 390x844`, JSON.stringify(res.shell));
      ok(res.out.length === 0, `${where}: nothing should leave the frame outside a scrolling box`, res.out.slice(0, 6).join(' ; '));
      if (res.deco.length) warn(`${where}: decoration runs past the frame (clipped by it)`, res.deco.slice(0, 4).join(' ; '));
      ok(res.clip.length === 0, `${where}: no text may be cut off by its box`, res.clip.slice(0, 6).join(' ; '));
      if (res.hidden.length) warn(`${where}: a box hides text that cannot be scrolled to`, res.hidden.slice(0, 6).join(' ; '));
      const pusoBreaks = res.breaks.filter((b) => b.puso);
      ok(pusoBreaks.length === 0, `${where}: a line should never break at the puso`, pusoBreaks.map((b) => `"${b.word}" in a ${b.box} px box`).join(' ; '));
      for (const b of res.breaks.filter((x) => !x.puso)) { const k = `${scr} | "${b.word}" (box ${b.box} px)`; if (!wordBreaks.has(k)) wordBreaks.set(k, where); }
      ok(res.trunc.length === 0, `${where}: no text may be cut short`, res.trunc.slice(0, 6).join(' ; '));
      for (const s of res.small) { const k = `${scr} | ${s.tag} "${s.label}" ${s.w}x${s.h}${s.disabled ? ' (disabled)' : ''}`; if (!small.has(k)) { small.set(k, where); smallKind.set(k, s.kind); } }
      const f = await fontsUsed(page, cdp, facts);
      for (const [k, v] of Object.entries(f.used)) usedAll[k] = (usedAll[k] || 0) + v;
      for (const d of f.fallback) { const k = `${scr} | "${d.text.slice(0, 50)}" in ${d.face}: ${d.fonts.join(', ')}${d.missing && d.missing.length ? ' (the face lacks ' + d.missing.join(' ') + ')' : ''}`; if (!fallback.has(k)) fallback.set(k, where); }
      const lg = await page.evaluate(LANG, scr);
      for (const u of lg.untagged) { const k = `${scr} | "${u}"`; if (!untagged.has(k)) untagged.set(k, where); if (lg.content.includes(u)) fromContent.add(k); }
      for (const u of lg.labels) { const k = `${scr} | aria-label "${u}"`; if (!labels.has(k)) labels.set(k, where); }
      if (res.out.length || res.clip.length || res.trunc.length) await shot(page, 'issue-' + label.replace(/[^\w]+/g, '_').slice(0, 60));
      return true;
    };
    /* the install page too (?install shows it on a developer's machine), as Safari on an iPhone 14 shows it */
    await page.goto(L.base + '?install');
    await ready(page, 250);
    ok((await screenName(page)) === 'Install', 'the install page should open with ?install', await screenName(page));
    await look('Install', 'Install (Safari)');
    for (const scr of SCREENS) {
      for (const [label, extra] of [['fresh', ''], ['part way', address(SAMPLE)]].concat(SAMPLE2 ? [[FAR, address(SAMPLE2)]] : [])) {
        await page.goto(L.base + '?gntest&screen=' + scr + extra);
        await ready(page, 250);
        const lg = await page.evaluate(LANG, scr);
        await look(scr, `${scr} (${label})`);
        if (label !== 'fresh') ok(lg.gn > 0 || (await page.evaluate((s) => !/[ãẽĩõũỹ]|g̃/i.test(document.querySelector('#gn-stage .sc-host[data-sc-name="' + s + '"]').textContent), scr)), `${scr}: a screen that shows Guarani should mark it lang="gn"`, JSON.stringify(lg));
      }
    }
    /* the states of the week path and the screens round it that the three learners above never reach, looked at like the
       others (frame, taps, cut text, fonts, languages): a learner back after ten days, behind the plan, with more to
       review than a day's sitting holds (the greeting on the week path, the notebook's sitting, Progreso's way to make
       the plan again, the goal screen on a plan that exists), and a learner at the end of the written path (the practice
       links on the week path and on a sealed day, the first mini exam on the tab, and under way). Each must be a state
       not seen before, and say what makes it one */
    {
      const more = await page.evaluate(() => {
        const C = window.gnCourse;
        C.setLevel('A1');
        const ready = C.sessions().filter((s) => s.ready);
        const drills = [];
        ready.filter((s) => s.unit === 1 && s.kind !== 'test').forEach((s) => (C.day(s.id).grammar.drill || []).forEach((x) => { const it = typeof x === 'string' ? C.item(x) : x; if (it && it.kind === 'choice' && drills.length < 12) drills.push({ src: it.id, wrong: C.plain(it.options[it.answer % it.options.length]) }); }));
        const reviews = ready.filter((s) => s.kind === 'review');
        return { drills, week1: ready.filter((s) => s.unit === 1 && s.kind !== 'test').map((s) => s.id), all: ready.filter((s) => s.kind !== 'test').map((s) => s.id), tests: ready.filter((s) => s.kind === 'test').map((s) => s.id), last: ready.reduce((m, s) => Math.max(m, s.unit), 0), lastReview: reviews.length ? reviews[reviews.length - 1].id : '', mini: (C.minis('A1')[0] || {}).ready === true };
      });
      const result = (id) => ({ id, score: 18, of: 20, used: 700, areas: { vocab: { right: 5, of: 6 }, grammar: { right: 7, of: 8 }, reading: { right: 3, of: 3 }, listening: { right: 3, of: 3 } }, at: Date.now() - 864e5 });
      const fill = (ids) => { const d = {}; ids.forEach((id) => { d[id] = FULL; }); return d; };
      const BACK = { level: 'A1', plan: { start: day(-20), target: day(40), pace: 'fit', minutes: 15 }, done: fill(more.week1), tests: { a1u01t: result('a1u01t') }, m: more.drills.map((x, k) => ({ src: x.src, wrong: x.wrong, at: Date.now() - (11 + k) * 864e5, step: 0, due: day(-9) })), seen: [day(-12), day(-11), day(-10)] };
      const tests = {};
      more.tests.forEach((id) => { tests[id] = result(id); });
      const END = { level: 'A1', plan: { start: day(-7 * more.last), target: null, pace: 'fit', minutes: 30 }, done: fill(more.all), tests, seen: [day(-2), day(-1)] };
      const cases = [
        ['Main', 'back after days', BACK, '¡Volviste!'],
        ['Notebook', 'back after days', BACK, 'Hay 12 esperando'],
        ['Review', 'back after days', BACK, '1 / 8'],
        ['Progress', 'back after days', BACK, 'Rearmar mi plan'],
        ['Goal', 'a plan that exists', BACK, 'Guardar el plan'],
        ['Main', 'the end of the written path', END, 'MIENTRAS TANTO'],
        ['Today', 'a sealed day', Object.assign({}, END, { cur: more.lastReview }), '¿Un rato más?'],
      ].concat(more.mini ? [['ExamTab', 'the mini exam open', END, 'Mini examen 1'], ['Exam', 'the mini exam under way', Object.assign({}, END, { set: 'mini1' }), 'MINI EXAMEN 1']] : []);
      let seenNew = 0;
      for (const [scr, label, sample, says] of cases) {
        await page.goto(L.base + '?gntest&screen=' + scr + address(sample));
        await ready(page, 250);
        const said = (await stageText(page)).includes(says);
        const fresh = await look(scr, `${scr} (${label})`);
        ok(said && fresh, `${scr} (${label}): the screen should be in that state (it says «${says}»)`, (await stageText(page)).slice(0, 200));
        if (said && fresh) seenNew += 1;
      }
      note(`${seenNew} more states looked at: a learner back after days and behind the plan, and one at the end of the written path`);
    }
    /* one tap deeper: each control of each screen (part way, then in the later week), once, and what it leads to */
    let crawled = 0;
    if (CRAWL > 0) {
      const t0 = Date.now();
      for (const [tag, sample] of [['', SAMPLE]].concat(SAMPLE2 ? [[' (' + FAR + ')', SAMPLE2]] : [])) {
        for (const scr of SCREENS) {
          const url = L.base + '?gntest&screen=' + scr + address(sample);
          await page.goto(url);
          await ready(page, 200);
          const controls = await page.evaluate(CONTROLS, CRAWL);
          for (const c of controls) {
            await page.goto(url);
            await ready(page, 150);
            try { await page.locator('#gn-stage button, #gn-stage a').nth(c.i).click({ timeout: 2500 }); } catch (e) { continue; }
            await page.waitForTimeout(450);
            const now = await screenName(page);
            if (!now) continue;
            if (await look(now, `${scr}${tag} → "${c.label}"${now !== scr ? ' (now ' + now + ')' : ''}`)) crawled += 1;
          }
        }
      }
      note(`crawl: ${crawled} more states in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    /* and a walk further in: from each screen, taps on controls picked at random (a fixed seed), state after state */
    if (WALK > 0) {
      const t0 = Date.now();
      let seed = 20261103;
      const rand = () => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) / 16777216; };
      let walked = 0;
      for (const scr of SCREENS) {
        await page.goto(L.base + '?gntest&screen=' + scr + address(SAMPLE));
        await ready(page, 200);
        const trail = [];
        for (let step = 0; step < WALK; step++) {
          const controls = await page.evaluate(CONTROLS, 60);
          if (!controls.length) break;
          const c = controls[Math.floor(rand() * controls.length)];
          try { await page.locator('#gn-stage button, #gn-stage a').nth(c.i).click({ timeout: 2000 }); } catch (e) { break; }
          trail.push(c.label.slice(0, 24));
          await page.waitForTimeout(450);
          const now = await screenName(page);
          if (!now) break;
          if (await look(now, `${scr} walk: ${trail.map((t) => '"' + t + '"').join(' › ')}${now !== scr ? ' (now ' + now + ')' : ''}`)) walked += 1;
        }
      }
      note(`walk: ${walked} more states in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    note(`inspected ${states.size} states of ${SCREENS.length} screens; fonts used: ${Object.entries(usedAll).map(([k, v]) => k + ' ' + v).join(', ')}`);
    /* words in running text: the narrowest word to tap (Reading) or phrase to hold (Leer), reached by a finger put in
       the gap beside it, off any other word */
    {
      /* the point is 4 px off the word (3 or 2 where the gap is tight), and nearer to it than to any other word: in a
         gap of a few pixels between two words the app opens the nearer one, as it should, so such a gap proves nothing */
      const beside = (sel) => page.evaluate((sel) => {
        const all = [...document.querySelectorAll('#gn-stage ' + sel)].filter((b) => b.getBoundingClientRect().width > 0);
        all.sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width);
        const far = (x, y, q) => Math.hypot(Math.max(q.left - x, 0, x - q.right), Math.max(q.top - y, 0, y - q.bottom));
        for (const b of all) {
          const r = b.getBoundingClientRect();
          const y = r.top + r.height / 2;
          for (const d of [4, 3, 2]) {
            for (const x of [r.right + d, r.left - d]) {
              const at = document.elementFromPoint(x, y);
              if (!at || at.closest(sel) || !at.closest('[lang="gn"]')) continue;
              if (all.some((o) => o !== b && far(x, y, o.getBoundingClientRect()) <= d + 1)) continue;
              return { x, y, i: all.indexOf(b), text: b.textContent.trim(), w: Math.round(r.width * 10) / 10, at: at.tagName.toLowerCase(), off: d };
            }
          }
        }
        return null;
      }, sel);
      for (const [tag, sample] of [['', SAMPLE]].concat(SAMPLE2 ? [[' (' + FAR + ')', SAMPLE2]] : [])) {
        await page.goto(L.base + '?gntest&screen=Reading' + address(sample));
        await ready(page, 250);
        const rd = await beside('button[data-w]');
        if (!rd) ok(false, `Reading${tag}: a short word with a gap beside it should be found for the gap check`);
        else {
          await page.touchscreen.tap(rd.x, rd.y);
          await page.waitForTimeout(400);
          const open = await page.evaluate((i) => { const b = [...document.querySelectorAll('#gn-stage button[data-w]')].filter((x) => x.getBoundingClientRect().width > 0); b.sort((p, q) => p.getBoundingClientRect().width - q.getBoundingClientRect().width); return b[i] && b[i].getAttribute('aria-pressed'); }, rd.i);
          ok(open === 'true', `Reading${tag}: a tap in the gap beside "${rd.text}" (${rd.w} px wide) should open it`, JSON.stringify(rd));
          if (open === 'true') pass(`Reading${tag}: a tap in the gap beside "${rd.text}" (${rd.w} px wide) opens its meaning`);
        }
      }
      await page.goto(L.base + '?gntest&screen=Leer');
      await ready(page, 250);
      const lr = await beside('[data-gn-i]');
      if (!lr) ok(false, 'Leer: a short phrase with a gap beside it should be found for the gap check');
      else {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: lr.x, y: lr.y }] });
        await page.waitForTimeout(450);
        const held = await page.evaluate((i) => { const b = [...document.querySelectorAll('#gn-stage [data-gn-i]')].filter((x) => x.getBoundingClientRect().width > 0); b.sort((p, q) => p.getBoundingClientRect().width - q.getBoundingClientRect().width); return b[i] ? getComputedStyle(b[i]).backgroundColor : ''; }, lr.i);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(300);
        ok(held === 'rgb(255, 233, 176)', `Leer: a finger held in the gap beside "${lr.text}" (${lr.w} px wide) should hold that phrase`, JSON.stringify({ lr, held }));
        if (held === 'rgb(255, 233, 176)') pass(`Leer: a finger held in the gap beside "${lr.text}" (${lr.w} px wide) holds that phrase`);
      }
    }
    /* the tap targets under 44x44, by screen. Two kinds are accepted, with what makes up for their size, and reported:
       - a word or phrase inside running text (Reading's tap-a-word, Leer's hold-a-phrase): as tall as its line (44),
         narrower when the word is short, as an inline target in a sentence may be (WCAG 2.5.5 and 2.5.8 exempt inline
         targets); a tap or hold in the gap beside it reaches it (checked below, "words in running text");
       - a key of a ten-key letter row of an on-screen keyboard (Escribir): 390 px holds ten keys of at most 39 px, as
         the iPhone's own keyboard has (about 32 pt); at least 30 wide and 44 tall. The keyboard's other rows (the
         Guarani row, the space row) are not excepted. */
    const byScreen = {};
    const accepted = { text: [], key: [] };
    for (const [k, v] of small) {
      const m = / (\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)( \(disabled\))?$/.exec(k);
      const w = m ? +m[1] : 0;
      const h = m ? +m[2] : 0;
      const kind = smallKind.get(k) || '';
      if (kind === 'text' && h >= 43.5) { accepted.text.push(k); continue; }
      if (kind === 'key' && h >= 43.5 && w >= 30) { accepted.key.push(k); continue; }
      const [scr, rest] = k.split(' | ');
      (byScreen[scr] = byScreen[scr] || []).push(rest);
    }
    const hard = Object.values(byScreen).reduce((n, l) => n + l.length, 0);
    ok(hard === 0, `every button and link should be at least 44x44: ${hard} are not, on ${Object.keys(byScreen).length} screens`);
    for (const [scr, list] of Object.entries(byScreen)) console.log(`       ${scr}: ${list.length} — ${list.slice(0, 14).join(' ; ')}${list.length > 14 ? ' ; …' : ''}`);
    if (accepted.text.length) warn(`${accepted.text.length} words in running text are 44 px tall but narrower than 44 (inline targets; the gap beside them reaches them)`, accepted.text.slice(0, 8).join(' ; '));
    if (accepted.key.length) warn(`${accepted.key.length} keys of the keyboard's ten-key rows are narrower than 44 (as the system keyboard's are)`, accepted.key.slice(0, 6).join(' ; '));
    ok(fallback.size === 0, `every piece of text should be drawn in the app's own faces: ${fallback.size} fall back to a system font`);
    for (const k of [...fallback.keys()].slice(0, 30)) console.log('       ' + k + '   [' + fallback.get(k) + ']');
    /* the screens' own text must tag its Guarani; the course's Spanish strings that quote Guarani (explanations, notes,
       feedback) have no markup for it in the content format yet: reported, not failed */
    const gnUntagged = [...untagged.keys()].filter((k) => !fromContent.has(k));
    const gnContent = [...untagged.keys()].filter((k) => fromContent.has(k));
    ok(gnUntagged.length === 0, `Guarani text should be inside lang="gn": ${gnUntagged.length} pieces of the screens' own text are not`);
    for (const k of gnUntagged.slice(0, 40)) console.log('       ' + k + '   [' + untagged.get(k) + ']');
    if (gnContent.length) {
      warn(`${gnContent.length} of the course's Spanish strings quote Guarani with no lang="gn" (the content format has no markup for Guarani inside Spanish yet)`);
      for (const k of gnContent.slice(0, 20)) console.log('       ' + k + '   [' + untagged.get(k) + ']');
    }
    if (labels.size) warn(`${labels.size} aria-labels hold Guarani inside a Spanish label (a screen reader reads them with the Spanish voice; an attribute cannot carry lang)`, [...labels.keys()].slice(0, 8).join(' ; '));
    if (wordBreaks.size) {
      warn(`${wordBreaks.size} Guarani words are broken across two lines (overflow-wrap: anywhere; never at the puso, which is checked above)`);
      for (const k of [...wordBreaks.keys()].slice(0, 20)) console.log('       ' + k + '   [' + wordBreaks.get(k) + ']');
    }
    ok(logs.length === 0, 'screens: console problems', logs.slice(0, 5).join(' ; '));
    await ctx.close();
  }

  // ---------- 10. no request leaves the app's address ----------
  section('origin: every request stays on the app\'s own address');
  const outside = [...new Set(REQUESTS.filter((r) => !ORIGINS.some((o) => r.url.startsWith(o + '/')) && !/^(data|blob|about|chrome-extension):/.test(r.url)).map((r) => r.label + ': ' + r.url))];
  ok(outside.length === 0, `no request should leave the app's address (${REQUESTS.length} requests seen)`, outside.slice(0, 10).join(' ; '));
  const fontReq = REQUESTS.filter((r) => r.type === 'font' || /\.woff2?(\?|$)|fonts\.g/.test(r.url));
  ok(fontReq.every((r) => ORIGINS.some((o) => r.url.startsWith(o + PREFIX + 'assets/fonts/'))), 'every font request should be for the app\'s own font files', [...new Set(fontReq.map((r) => r.url))].filter((u) => !/\/assets\/fonts\//.test(u)).slice(0, 5).join(', '));
  ok(BAD.length === 0, 'no request should fail or get an error status', [...new Set(BAD)].slice(0, 10).join(' ; '));
  pass(`${REQUESTS.length} requests, ${fontReq.length} for fonts, all on ${ORIGINS.join(', ')}`);

  await browser.close();
  L.server.close();
  if (P) P.server.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('\n' + (fails ? `PLATFORM TEST: ${fails} problem(s), ${warns} warning(s)` : `PLATFORM TEST PASS (${warns} warning(s))`));
  if (fails) for (const f of [...new Set(FAILS)].slice(0, 80)) console.log('  - ' + f);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
