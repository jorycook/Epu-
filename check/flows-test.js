// Flows and saved progress: the app as a learner taps through it, on an iPhone-sized screen (390 x 844, touch, an
// iPhone's user agent), against the built site as GitHub Pages would serve it.
//   A  a first visit: the install page and its button; the goal screen's three steps to a plan; Main and its tab bar;
//      the level box to Levels and back; a study day of A1 unit 1 (grammar: Teach, Compare, Drill, Exam; words: the
//      sound step, the scene, Spell and the exam question; the listening item), right and wrong answers; day 2's reading;
//      the week test; the next day's notebook and Review; the level exam (part 1 handed in); Progress; every reload.
//   B  the placement check from the goal screen (out and back in, all three parts), the level it gives (A2), the level
//      kept across a reload, a switch back to A1 with each level's plan kept.
//      Then the app closed part way through the check, and a level switch to a level with no plan yet.
//   C  Leer, Escribir and Hablar: how a learner gets to them (Progreso's "Más práctica"), then a little of a round in each.
//   D  saved data that does not fit: garbage, wrong types, odd values, storage that throws, another copy's save.
//   F  a lesson left part way (two of four words written) and reopened after a reload.
//   G  two tabs of the app open at once.
//   H  the last written week (whichever it is: A1 unit 4 today): the week before it leads on to it; its review day by
//      taps, every lesson (the drill's answer sheet with its button in view, the week's words written again, the
//      reading); its week test; then the learner stays on that week, on the path, on Progreso and on Niveles, across
//      a reload, and no week that is written is said to be waiting to be written.
//   I  home and motivation: the review that waits put in front of the day (the tab bars' count, the row on the week
//      path and on the day, the review's options in another order, its way on to the day); a sitting's size and the
//      notebook holding a due answer back; the door back to the plan (the date chip, Progreso's «Rearmar mi plan»,
//      «Guardar el plan» and «Cancelar»); the days with study and the greeting after days away; practice where the
//      written path ends; the first mini exam, from the tab to its result.
//   E  every one of the 21 screens reached, with no page error, no console error and nothing blank.
// usage: node check/flows-test.js [site folder]      (default: ../docs, the built site as it is; about 7 minutes)
//   ONLY=A,B,C,D,F,G,H runs some parts (E reports on what ran); PORT=8795 picks the port (default: any free one).
//   (ONLY=I runs part I alone; with it the whole suite takes about two minutes more.)
// Screenshots (device scale 1) go to check/out/flows/. Exit code 1 when a check fails.
// Chromium stands in for Safari (WebKit cannot run here): the user agent, the screen and touch are an iPhone's.
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const DIR = path.resolve(process.argv[2] || path.join(ROOT, 'docs'));
const OUT = path.join(__dirname, 'out', 'flows');
const ONLY = (process.env.ONLY || '').split(',').map((x) => x.trim()).filter(Boolean);
const want = (part) => !ONLY.length || ONLY.includes(part);
/* saved progress is kept under the folder the app is served from */
const KEY = 'epua.v1:/';
const FIELDS = ['started', 'level', 'plans', 'plan', 'cur', 'done', 'tests', 'exams', 'mistakes', 'tp', 'set', 'placement', 'typed', 'profile', 'exposure', 'seen'];
const SCREENS = ['Goal', 'Placement', 'Main', 'Today', 'Levels', 'Progress', 'Teach', 'Compare', 'Drill', 'Exam', 'Words', 'Reading', 'Listening', 'WeekTest', 'Notebook', 'Review', 'ExamTab', 'LevelExam', 'Leer', 'Escribir', 'Hablar'];
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const DAY = 864e5;

/* ---------- reporting ---------- */
const failures = [];
const passes = [];
let part = '';
const ev = (x) => (typeof x === 'string' ? x : JSON.stringify(x));
function ok(cond, what, evidence) {
  if (cond) return true;
  const e = evidence === undefined ? '' : ev(evidence).slice(0, 700);
  failures.push({ part, what, evidence: e });
  console.log(`  FAIL [${part}] ${what}${e ? '\n        ' + e : ''}`);
  return false;
}
const pass = (what) => { passes.push(`[${part}] ${what}`); console.log(`  ok   ${what}`); };
/* a check that is passed when it holds and reported when it does not */
const check = (cond, what, evidence) => { if (ok(cond, what, evidence)) pass(what); return !!cond; };

/* ---------- the site, served as GitHub Pages serves it: every file as it is, 404 for anything else ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
function serve() {
  return new Promise((done, fail) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x/').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(DIR, p);
      if (!f.startsWith(DIR) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      fs.createReadStream(f).pipe(res);
    });
    server.on('error', fail);
    server.listen(+(process.env.PORT || 0), '127.0.0.1', () => done(server));
  });
}
let BASE = '';

/* ---------- the phone ---------- */
const phone = (browser, extra) => browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: IPHONE, ...(extra || {}) });
/* every page: console errors and warnings, page errors and failed requests are written down against the part */
const problems = [];
async function newPage(ctx, label) {
  const page = await ctx.newPage();
  page.__label = label;
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push({ part, page: label, what: m.type() + ': ' + m.text().slice(0, 300) }); });
  page.on('pageerror', (e) => problems.push({ part, page: label, what: 'pageerror: ' + String(e).slice(0, 300) }));
  page.on('response', (r) => { if (r.status() >= 400) problems.push({ part, page: label, what: 'HTTP ' + r.status() + ' ' + r.url() }); });
  page.on('requestfailed', (r) => problems.push({ part, page: label, what: 'request failed ' + r.url() + ' ' + ((r.failure() && r.failure().errorText) || '') }));
  /* a day other than today, kept for the tab across reloads (the course reads window.__gnNow, see gn-course.js C.now) */
  await page.addInitScript(() => { try { const t = sessionStorage.getItem('flows.now'); if (t) window.__gnNow = +t; } catch (e) {} });
  return page;
}
async function ready(page) {
  await page.waitForSelector('#gn-stage > .sc-host', { timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('gn-ready'), null, { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
}
async function go(page, url) { await page.goto(BASE + url); await ready(page); }
async function reload(page) { await page.reload(); await ready(page); }

/* ---------- what is on the screen ---------- */
const screenOf = (page) => page.evaluate(() => {
  const h = document.querySelector('#gn-stage > .sc-host');
  const inner = h && h.querySelector('.sc-host');
  return inner ? inner.getAttribute('data-sc-name') : h ? h.getAttribute('data-sc-name') : null;
});
const text = async (page) => (await page.evaluate(() => (document.querySelector('#gn-stage') || document.body).innerText || '')).replace(/\s+/g, ' ');
const has = async (page, t) => (await text(page)).includes(t);
const saved = async (page) => page.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'NOT JSON: ' + localStorage.getItem(k); } }, KEY);
const storageKeys = (page) => page.evaluate(() => Object.keys(localStorage));
/* the visible buttons and links, for the evidence when a tap finds nothing */
const controls = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage button, #gn-stage a')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map((el) => (el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label') + '] ' : '') + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)).slice(0, 40));
const health = (page) => page.evaluate(() => {
  const stage = document.querySelector('#gn-stage');
  const h = stage && stage.querySelector(':scope > .sc-host');
  const inner = h && h.querySelector('.sc-host');
  const vis = stage ? [...stage.querySelectorAll('*')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; }).length : 0;
  const t = ((stage && stage.innerText) || '').replace(/\s+/g, ' ').trim();
  const root = (inner || h) && (inner || h).firstElementChild;
  const box = root ? root.getBoundingClientRect() : null;
  return {
    name: inner ? inner.getAttribute('data-sc-name') : h ? h.getAttribute('data-sc-name') : null,
    chars: t.length,
    visible: vis,
    errors: [...document.querySelectorAll('.sc-logic-error,.sc-placeholder-error')].map((e) => e.textContent.slice(0, 200)),
    unresolved: document.querySelectorAll('.sc-interp.sc-missing,.sc-interp.sc-unresolved').length,
    box: box ? Math.round(box.width) + 'x' + Math.round(box.height) : null,
    shown: document.documentElement.classList.contains('gn-ready') && getComputedStyle(stage).visibility === 'visible',
    head: t.slice(0, 90),
  };
});
/* every screen seen: how it was reached (a tap in the app, or the ?gntest hook) */
const reached = {};
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') });
async function look(page, label, opts) {
  opts = opts || {};
  await page.waitForTimeout(opts.wait == null ? 280 : opts.wait);
  const h = await health(page);
  if (h.name && !reached[h.name]) reached[h.name] = { how: opts.how || 'tap', at: part + ': ' + label };
  /* every link a learner can see on the way, to know which screens lead where */
  if ((opts.how || 'tap') === 'tap') (await page.evaluate(() => [...document.querySelectorAll('#gn-stage a[href]')].map((a) => a.getAttribute('href')))).forEach((x) => hrefsSeen.add(x));
  ok(!h.errors.length, `${label}: the ${h.name} screen should have no logic error`, h.errors);
  ok(h.shown && h.chars > 20 && h.visible > 5 && h.box === '390x844', `${label}: the ${h.name} screen should not be blank`, h);
  ok(!h.unresolved, `${label}: ${h.name} should have no unresolved holes`, h.unresolved);
  if (opts.expect) ok(h.name === opts.expect, `${label}: should be on ${opts.expect}`, { on: h.name, head: h.head });
  if (opts.shot) await shot(page, opts.shot);
  return h;
}

/* ---------- taps ---------- */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (t) => new RegExp('^\\s*' + esc(t) + '\\s*$');
/* what: text (a substring, or a RegExp for the whole label), { sel }, or { aria } */
function control(page, what) {
  if (what && what.sel) return page.locator(what.sel).first();
  if (what && what.aria) return page.locator(`#gn-stage [aria-label="${what.aria}"]`).first();
  return page.locator('#gn-stage').locator('button, a').filter({ hasText: what }).first();
}
const desc = (what) => (what && what.sel ? what.sel : what && what.aria ? '[' + what.aria + ']' : String(what));
async function tap(page, what, wait = 450, force) {
  try {
    /* force: a finger on a control that says it is shut (aria-disabled), to see that nothing happens */
    await control(page, what).tap({ timeout: 5000, force: !!force });
  } catch (e) {
    const err = new Error(`could not tap "${desc(what)}" on ${await screenOf(page)}: ${String(e.message).split('\n')[0]}`);
    err.controls = await controls(page);
    throw err;
  }
  await page.waitForTimeout(wait);
}
const pressed = async (page, what) => (await control(page, what).getAttribute('aria-pressed')) === 'true';
const shut = async (page, what) => { const c = control(page, what); return (await c.isDisabled()) || (await c.getAttribute('aria-disabled')) === 'true'; };
/* a finger held on an element (touchstart, a pause, touchend), through the browser's own touch input */
async function hold(page, what, ms) {
  const box = await control(page, what).boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await page.waitForTimeout(ms);
  const during = await text(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(300);
  await cdp.detach();
  return during;
}
/* a day later (or earlier), for every reload of this tab */
const setDay = (page, offset) => page.evaluate((t) => { if (t) sessionStorage.setItem('flows.now', String(t)); else sessionStorage.removeItem('flows.now'); }, offset ? Date.now() + offset * DAY : 0);
const isoIn = (page, n) => page.evaluate((n) => { const C = window.gnCourse; return C.addDays(C.today(C.now()), n); }, n);

/* ---------- answering lesson questions as the course has them ---------- */
const itemsOf = (page, ids) => page.evaluate((ids) => {
  const C = window.gnCourse;
  return ids.map((x) => {
    const it = typeof x === 'string' ? C.item(x) : x;
    return it && { id: it.id, kind: it.kind, answer: it.answer, options: (it.options || []).map((o) => C.plain(o)), tiles: (it.tiles || []).map((t) => C.plain(t)) };
  });
}, ids);
/* a choice by its number and text (the option buttons read "1Iporã"), a build by its tiles in order (or reversed, wrong).
   anyPlace: by its text alone, whatever number it carries (the notebook's review shows the options in another order) */
async function answerOne(page, it, right, anyPlace) {
  if (it.kind === 'choice') {
    const k = right ? it.answer : (it.answer % it.options.length) + 1;
    await tap(page, new RegExp('^\\s*' + (anyPlace ? '\\d+' : k) + '\\s*' + esc(it.options[k - 1]) + '\\s*$'), 250);
    return k;
  }
  if (it.kind === 'build') {
    const order = right ? it.tiles : it.tiles.slice().reverse();
    /* a tile in the bank is named by its text (Drill, Exam) or "Poner …" (Review) */
    for (const t of order) await tap(page, { sel: `#gn-stage button[aria-label="${t}"], #gn-stage button[aria-label="Poner ${t}"]` }, 180);
    return order.join(' ');
  }
  throw new Error('no way to answer a ' + it.kind + ' item here: ' + it.id);
}

/* a key of the spelling pad (Spell), by the letter on it */
const padKey = (k) => ({ sel: `xpath=//*[@id="gn-stage"]//button[span[@lang="gn" and normalize-space(.)="${k}"]]` });
/* the words of a day's writing step, with the keys each needs (its hard letters, as Spell asks for them) */
const spellList = (page, sid) => page.evaluate((sid) => {
  const C = window.gnCourse;
  const S = window.gnSpell;
  const w = C.day(sid).words;
  return w.spell.map((id) => w.words.filter((x) => x.id === id)[0]).map((x) => ({ gn: x.gn, keys: S.cells(x.gn).filter(S.hard).map((g) => S.norm(g).toLowerCase()) }));
}, sid);
/* one word written three times (copy, with hints, from memory) */
async function spellOne(page, w) {
  for (let pass = 0; pass < 3; pass++) {
    for (const k of w.keys) await tap(page, padKey(k), 160);
    await page.waitForTimeout(1250);
  }
  await page.waitForFunction(() => ![...document.querySelectorAll('#gn-stage button')].some((b) => /Escribí la palabra primero/.test(b.textContent)), null, { timeout: 4000 }).catch(() => {});
}

/* ---------- A: one learner, from the first visit to the next day ---------- */
async function partA(browser) {
  const ctx = await phone(browser);
  const page = await newPage(ctx, 'learner A');
  /* every request to keep the screen awake is counted */
  await page.addInitScript(() => {
    window.__locks = 0;
    if (navigator.wakeLock && navigator.wakeLock.request) { const r = navigator.wakeLock.request.bind(navigator.wakeLock); navigator.wakeLock.request = (t) => { window.__locks += 1; return r(t); }; }
  });
  const locks = () => page.evaluate(() => window.__locks);

  part = 'A1 first visit';
  await go(page, '');
  let h = await look(page, 'first visit', { expect: 'Install', shot: 'A01-install' });
  check(await has(page, "Agregá Epu'ã a tu pantalla de inicio") && await has(page, 'Seguir en el navegador'), 'a first visit in Safari on an iPhone shows the install page', h.head);
  check((await storageKeys(page)).length === 0, 'nothing is stored on a first visit', await storageKeys(page));
  await tap(page, 'Seguir en el navegador', 700);
  h = await look(page, 'Seguir en el navegador', { expect: 'Goal', shot: 'A02-goal-why' });
  check(await has(page, '¿Para qué querés aprender guaraní?'), 'Seguir en el navegador opens the app on the goal screen', h.head);
  await reload(page);
  check((await screenOf(page)) === 'Goal', 'a reload in the same visit does not bring the install page back', await screenOf(page));

  part = 'A2 goal';
  await tap(page, exact('hablar con mi familia'), 250);
  await tap(page, exact('mi trabajo'), 300);
  check(await pressed(page, exact('hablar con mi familia')) && await pressed(page, exact('mi trabajo')), 'step 1: two reasons are picked');
  check(await shut(page, exact('vivo en Paraguay')), 'step 1: a third reason is shut once two are picked');
  check(await has(page, '¿En qué trabajás?'), 'step 1: "mi trabajo" asks which field');
  await tap(page, exact('salud'), 250);
  await tap(page, exact('casa'), 250);
  await tap(page, exact('WhatsApp'), 250);
  check((await storageKeys(page)).join() === KEY + '.browser', 'step 1: nothing is saved while the goal is being set (only the choice to stay in the browser, with its date)', await storageKeys(page));
  await tap(page, 'Siguiente', 500);
  h = await look(page, 'goal step 2', { expect: 'Goal' });
  check(await has(page, '¿Desde dónde empezás?'), 'step 1 leads to step 2', h.head);
  await tap(page, { aria: 'Volver al paso anterior' }, 500);
  check(await has(page, '¿Para qué querés aprender guaraní?') && await pressed(page, exact('salud')) && await pressed(page, exact('WhatsApp')), 'the back arrow returns to step 1 with its answers kept');
  await tap(page, 'Siguiente', 500);
  await tap(page, exact('sé de qué se habla en casa'), 250);
  await tap(page, exact('frases hechas'), 300);
  check(!(await has(page, 'Hacer la prueba')), 'step 2: one step between understanding and speaking offers no placement check');
  await tap(page, exact('casi todo, pero me cuesta hablar'), 300);
  check(await has(page, 'Entendés más de lo que hablás.') && await has(page, 'Hacer la prueba'), 'step 2: a gap of two steps offers the placement check');
  await shot(page, 'A03-goal-start');
  await tap(page, exact('Elegir mi nivel'), 500);
  h = await look(page, 'goal step 3', { expect: 'Goal', shot: 'A04-goal-plan' });
  check(await pressed(page, { sel: '#gn-stage button[aria-label^="A1,"]' }) && await shut(page, { sel: '#gn-stage button[aria-label^="A2,"]' }), 'step 3: A1 is picked and A2 (not written yet) is shut');
  await tap(page, { sel: '#gn-stage button[aria-haspopup="dialog"]' }, 500);
  await shot(page, 'A05-goal-sheet');
  await tap(page, 'En 3 meses', 300);
  await tap(page, 'Listo', 500);
  const in3 = await page.evaluate(() => { const C = window.gnCourse; const T = C.today(C.now()); const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(T); const mo = +m[2] - 1 + 3; const y = +m[1] + Math.floor(mo / 12); const mm = ((mo % 12) + 12) % 12; const last = new Date(Date.UTC(y, mm + 1, 0)).getUTCDate(); return y + '-' + String(mm + 1).padStart(2, '0') + '-' + String(Math.min(+m[3], last)).padStart(2, '0'); });
  const left = await page.evaluate((d) => window.gnCourse.daysBetween(window.gnCourse.today(window.gnCourse.now()), d), in3);
  check(await has(page, 'En 3 meses') && await has(page, 'faltan ' + left + ' días'), `step 3: the target sheet sets "En 3 meses" (${in3}, faltan ${left} días)`, (await text(page)).slice(0, 400));
  await tap(page, /^\s*45 min/, 300);
  check(await pressed(page, /^\s*45 min/), 'step 3: 45 minutes a day is picked');
  check(await has(page, 'Entra todo, una sesión por día'), 'step 3: the plan note says all of A1 fits one session a day', (await text(page)).slice(0, 500));
  /* the ñandutí on Kaguare's vest: before the goal only its frame (the radial threads, no ring, an empty hub); weaving
     the first thread brings the cross-thread ring and fills the hub */
  const brooch = () => page.evaluate(() => {
    const g = document.querySelector('#gn-stage svg[aria-label*="ñandutí del nivel"] g[transform="translate(43 61.2) scale(0.42)"]');
    const threads = g && g.querySelector('path[stroke-width="0.8"]');
    const hub = g && g.querySelector('circle[r="4"]');
    if (!threads || !hub) return null;
    const d = threads.getAttribute('d') || '';
    return { ring: /A15\.4 15\.4/.test(d), threads: (d.match(/L/g) || []).length, hub: getComputedStyle(hub).fill };
  });
  const unwoven = await brooch();
  check(unwoven && !unwoven.ring && unwoven.threads === 8 && /255, 255, 255/.test(unwoven.hub), 'step 3: before the goal the ñandutí is only its frame: eight radial threads, no ring, the hub empty', unwoven);
  await tap(page, 'Tejé el primer hilo', 800);
  const woven = await brooch();
  check(woven && woven.ring && woven.threads === 8 && /194, 51, 111/.test(woven.hub), 'step 3: weaving the first thread brings the ring and fills the hub', woven);
  await shot(page, 'A06-goal-woven');
  {
    /* the ritual sets the goal: from here a reopened app opens on the week path (before, closing the app here lost it all) */
    const w = await saved(page);
    check(w && w.started === true && w.level === 'A1' && w.plan && w.plan.start === (await isoIn(page, 0)) && w.plan.target === in3 && w.plan.minutes === 45 && w.profile && w.profile.work === 'salud', 'step 3: weaving the first thread saves the goal: started, the plan as chosen and the answers', w);
  }
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 800);
  h = await look(page, 'Empezar', { expect: 'Main', shot: 'A07-main' });
  const today = await isoIn(page, 0);
  let s = await saved(page);
  check(s && s.v === 1 && s.started === true && s.level === 'A1', 'Empezar saves a started learner at A1', s);
  check(s && s.plan && s.plan.start === today && s.plan.target === in3 && s.plan.pace === 'fit' && s.plan.minutes === 45, 'the plan is saved as chosen: from today, a target in 3 months, 45 minutes', s && s.plan);
  check(s && s.profile && s.profile.why.join() === 'familia,trabajo' && s.profile.work === 'salud' && s.profile.where.join() === 'casa,whatsapp' && s.profile.understand === 3 && s.profile.speak === 1, 'the goal screen\'s answers are saved as the profile', s && s.profile);
  check(s && Object.keys(s).sort().join() === ['v'].concat(FIELDS).sort().join(), 'only the 16 fields (and v) are saved', s && Object.keys(s));
  check(await has(page, 'Semana 1 de 8') && await has(page, "Mba'éichapa") && await has(page, 'faltan ' + left + ' días'), 'Main shows week 1 of 8 and the days left to the target', h.head);

  part = 'A3 tabs and levels';
  const TABS = [['Cuaderno', 'Notebook'], ['Examen', 'ExamTab'], ['Progreso', 'Progress'], ['Camino', 'Main']];
  const tabsOk = [];
  for (const [from, fromScreen] of TABS) {
    if ((await screenOf(page)) !== fromScreen) await tap(page, { sel: `#gn-stage nav a:has-text("${from}")` }, 450);
    for (const [to, screen] of TABS) {
      if (to === from) continue;
      await tap(page, { sel: `#gn-stage nav a:has-text("${to}")` }, 450);
      await look(page, `tab ${from} → ${to}`, { wait: 0 });
      const at = await screenOf(page);
      tabsOk.push(at === screen ? '' : `${from}→${to}: ${at}`);
      await tap(page, { sel: `#gn-stage nav a:has-text("${from}")` }, 450);
    }
  }
  check(tabsOk.every((x) => !x), 'the tab bar of Main, Notebook, ExamTab and Progress leads to each of the other three', tabsOk.filter(Boolean));
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 450);
  await shot(page, 'A08-notebook-empty');
  await tap(page, { aria: 'Nivel A1, cambiar de nivel' }, 600);
  h = await look(page, 'level box', { expect: 'Levels', shot: 'A09-levels' });
  check(await has(page, 'Tu nivel · 0 de 56 sesiones · Semana 1'), 'the level box opens Levels with A1 as the learner\'s level', h.head);
  await tap(page, { sel: '#gn-stage a[href="Goal.dc.html"]' }, 500, true);
  check((await screenOf(page)) === 'Levels', 'a level not written yet (A2) does nothing when tapped', await screenOf(page));
  await tap(page, { aria: 'Volver al camino de la semana' }, 600);
  check((await screenOf(page)) === 'Main', 'the back arrow on Levels returns to Main', await screenOf(page));
  await tap(page, { aria: 'Nivel A1, cambiar de nivel' }, 600);
  await tap(page, { sel: '#gn-stage a[aria-current="true"]' }, 600);
  check((await screenOf(page)) === 'Main' && (await saved(page)).level === 'A1', 'the current level\'s card on Levels returns to Main, the level unchanged', await screenOf(page));

  await partA4(page);
  await partA5(page);
  await partA6(page);
  await partA7(page);
  await partA8(page);
  await partA9(ctx, page);
  return { ctx, page };
}

/* A5: day 2's reading, answered wrong (straight from Today: the skill card opens before the grammar is done) */
async function partA5(page) {
  part = 'A5 day 2: reading';
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
  let h = await look(page, 'Main → day 2', { expect: 'Today' });
  check(await has(page, 'Semana 1 · Día 2') && await has(page, 'SIGUIENTE'), 'the card opens day 2 (tomorrow\'s, marked SIGUIENTE)', h.head);
  await tap(page, { sel: '#gn-stage a[href="Reading.dc.html"]' }, 700);
  h = await look(page, 'Today → Reading', { expect: 'Reading', shot: 'A29-reading' });
  const it = await page.evaluate(() => { const C = window.gnCourse; const x = C.day('a1u01d2').skill.item; return { id: x.id, kind: 'choice', answer: x.answer, options: x.options.map((o) => C.plain(o)) }; });
  await tap(page, exact('Ore'), 400);
  check(await has(page, 'nosotros'), 'reading: a tapped word shows what it means', (await text(page)).slice(0, 400));
  await shot(page, 'A30-reading-gloss');
  await tap(page, { aria: 'Cerrar el significado' }, 300);
  check(await shut(page, 'Respondé'), 'reading: Respondé is shut until an answer is picked');
  const k = await answerOne(page, it, false);
  await tap(page, 'Respondé', 500);
  await shot(page, 'A31-reading-wrong');
  const m = (await saved(page)).mistakes;
  check(m[0] && m[0].src === it.id && m[0].due === (await isoIn(page, 1)), 'reading: the wrong answer goes to the notebook, due tomorrow', m.map((x) => x.src));
  check(!(await has(page, '¡Correcto!')), 'reading: answer ' + k + ' is marked wrong', (await text(page)).slice(0, 200));
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  h = await look(page, 'Reading → Today', { expect: 'Today' });
  check(((await saved(page)).done.a1u01d2 || {}).r === 1, 'reading: the item is saved done (r 1) even when wrong', (await saved(page)).done);
  await tap(page, { aria: 'Volver al camino de la semana' }, 600);
  check((await screenOf(page)) === 'Main', 'Today\'s back arrow returns to Main', await screenOf(page));
}

/* A6: the week test from the week path: 20 questions, two answered wrong */
async function partA6(page) {
  part = 'A6 week test';
  await tap(page, { aria: 'Día 7, prueba de la semana' }, 700);
  let h = await look(page, 'Main → WeekTest', { expect: 'WeekTest', shot: 'A32-weektest-intro' });
  check(await has(page, '20 preguntas en formato de examen'), 'the week test node opens its intro (20 questions)', h.head);
  await tap(page, 'Empezar la prueba', 800);
  h = await look(page, 'WeekTest → Exam', { expect: 'Exam', shot: 'A33-weektest-q1' });
  check(await has(page, 'PRUEBA DE LA SEMANA') && /20:00|19:5\d/.test(await text(page)), 'the week test runs in the exam screen with a 20-minute clock', h.head);
  const ids = await page.evaluate(() => window.gnCourse.unit(1).test);
  const list = await itemsOf(page, ids);
  const wrong = [0, 12];
  for (let i = 0; i < list.length; i++) {
    await answerOne(page, list[i], !wrong.includes(i));
    if (i === 14) await shot(page, 'A34-weektest-reading');
    await tap(page, i < list.length - 1 ? 'Siguiente' : exact('Terminar'), 350);
  }
  h = await look(page, 'week test result', { expect: 'Exam', shot: 'A35-weektest-result' });
  check(await has(page, 'Prueba de la semana terminada') && (await page.locator('#gn-stage h1').first().textContent()).trim() === '18', 'the week test ends 18 of 20', (await text(page)).slice(0, 200));
  await tap(page, { sel: '#gn-stage a[href="WeekTest.dc.html"]' }, 800);
  h = await look(page, 'Exam → WeekTest result', { expect: 'WeekTest', shot: 'A36-weektest-stamp' });
  const s = await saved(page);
  const t = s.tests && s.tests.a1u01t;
  check(t && t.score === 18 && t.of === 20 && t.areas && Object.keys(t.areas).length >= 3, 'the week test result is saved: 18 of 20, by area', t);
  check(s.mistakes.length === 5 && s.mistakes[0].src === list[12].id && s.mistakes[1].src === list[0].id, 'the week test\'s two errors are in the notebook (5 in all)', s.mistakes.map((x) => x.src));
  check(await has(page, '18') && await has(page, '2 errores fueron a tu cuaderno'), 'the week test page shows its result and the errors kept', (await text(page)).slice(0, 300));
  await tap(page, 'Ver errores', 700);
  h = await look(page, 'WeekTest → Notebook', { expect: 'Notebook', shot: 'A37-notebook-today' });
  check(await has(page, 'En el cuaderno · 5'), 'the notebook holds the five mistakes', (await text(page)).slice(0, 300));
  check(!(await has(page, 'Repasar ahora')), 'the notebook has nothing to review on the day the mistakes were made', (await text(page)).slice(0, 300));
}

/* A7: the next day: the app reopened, the notebook's review; one answered wrong again */
async function partA7(page) {
  part = 'A7 next day: notebook and review';
  const before = await saved(page);
  await setDay(page, 1);
  await reload(page);
  let h = await look(page, 'reopened the next day', { expect: 'Main', shot: 'A38-main-next-day' });
  check(JSON.stringify(await saved(page)) === JSON.stringify(before), 'opening the app again changes nothing that was saved', { before: before && Object.keys(before), now: Object.keys((await saved(page)) || {}) });
  await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 600);
  h = await look(page, 'Notebook the next day', { expect: 'Notebook', shot: 'A39-notebook-next-day' });
  check(await has(page, 'Para repasar hoy') && await has(page, 'Repasar ahora'), 'the next day the notebook asks for a review', (await text(page)).slice(0, 300));
  const due = await page.evaluate(() => { const C = window.gnCourse; const s = JSON.parse(localStorage.getItem('epua.v1:/')); return C.due(s.mistakes.filter((m) => C.levelOf(m.src) === 'A1'), C.now()).map((m) => m.src); });
  check(due.length === 5, 'all five mistakes are due the next day', due);
  const lr = await page.evaluate(() => window.__locks);
  await tap(page, 'Repasar ahora', 700);
  h = await look(page, 'Notebook → Review', { expect: 'Review', shot: 'A40-review-1' });
  check((await page.evaluate(() => window.__locks)) > lr, 'the review keeps the screen awake', await page.evaluate(() => window.__locks));
  const list = await itemsOf(page, due);
  const right = {};
  for (let i = 0; i < list.length; i++) {
    const it = list[i];
    right[it.id] = i !== 1;
    /* the review shows a choice's options in another order every day: they are tapped by their text */
    await answerOne(page, it, right[it.id], true);
    if (it.kind === 'build') await tap(page, 'Comprobar', 400);
    await page.waitForTimeout(300);
    if (i === 1) await shot(page, 'A41-review-wrong');
    await tap(page, i < list.length - 1 ? 'Siguiente' : 'Listo', 500);
  }
  h = await look(page, 'review summary', { expect: 'Review', shot: 'A42-review-done' });
  check(await has(page, 'Repaso terminado') && await has(page, 'Repasaste las 5 preguntas de hoy'), 'the review ends on its summary', (await text(page)).slice(0, 300));
  const tomorrow = await isoIn(page, 1);
  const in3 = await isoIn(page, 3);
  const m = (await saved(page)).mistakes;
  const moved = m.filter((x) => right[x.src]).every((x) => x.step === 1 && x.due === in3 && x.last === 'right');
  const back = m.filter((x) => !right[x.src]).every((x) => x.step === 0 && x.due === tomorrow && x.last === 'wrong');
  check(m.length === 5 && moved && back, 'the review is saved: right answers come back in 3 days, the wrong one tomorrow', m.map((x) => [x.src, x.step, x.due, x.last]));
  await tap(page, 'Volver al cuaderno', 600);
  h = await look(page, 'Review → Notebook', { expect: 'Notebook', shot: 'A43-notebook-after' });
  check(!(await has(page, 'Repasar ahora')), 'after the review nothing more is due today', (await text(page)).slice(0, 300));
}

/* A8: the level exam: the tab, the briefing, part 1 answered and handed in, put aside for another day */
async function partA8(page) {
  part = 'A8 level exam';
  const locksBefore = await page.evaluate(() => window.__locks);
  await tap(page, { sel: '#gn-stage nav a:has-text("Examen")' }, 600);
  let h = await look(page, 'tab → ExamTab', { expect: 'ExamTab' });
  await tap(page, { sel: '#gn-stage a[href="LevelExam.dc.html"]' }, 800);
  h = await look(page, 'ExamTab → LevelExam', { expect: 'LevelExam', shot: 'A44-levelexam' });
  check(await has(page, 'Cinco partes, dos grupos') && await has(page, 'Empezar la parte 1'), 'the level exam opens on its briefing', h.head);
  check((await page.evaluate(() => document.querySelector('meta[name="theme-color"]').content)) === '#1B2440' && (await page.evaluate(() => window.__locks)) > locksBefore, 'in the level exam the status-bar strip is ink and the screen is kept awake');
  await tap(page, 'Empezar la parte 1', 700);
  const P1 = await page.evaluate(() => { const C = window.gnCourse; const t = window.__gnExtra['exam-a1'].parts.P1.tasks; const out = []; t.forEach((x) => (x.items || []).forEach((it) => out.push({ id: it.id, answer: it.answer, options: it.options.map((o) => C.plain(o)) }))); return out; });
  for (let i = 0; i < P1.length; i++) {
    const it = P1[i];
    const k = i === 2 ? (it.answer % it.options.length) + 1 : it.answer;
    await tap(page, new RegExp('^\\s*' + k + '\\s*' + esc(it.options[k - 1]) + '\\s*$'), 300);
    await tap(page, i < P1.length - 1 ? exact('Siguiente') : exact('Hoja de respuestas'), 400);
  }
  await shot(page, 'A45-levelexam-sheet');
  await tap(page, exact('Entregar'), 800);
  h = await look(page, 'part 1 handed in', { expect: 'LevelExam', shot: 'A46-levelexam-break' });
  check(await has(page, 'Antes de la parte 2') && await has(page, 'Lo entregado ya quedó guardado'), 'handing in part 1 leads to the break before part 2', h.head);
  const e = ((await saved(page)).exams || {}).A1;
  check(e && e.partial === true && (e.done || []).join() === 'P1' && e.parts && e.parts.P1 && e.parts.P1.right === P1.length - 1 && e.parts.P1.of === P1.length, 'the sitting is saved put aside, with part 1 handed in (' + (P1.length - 1) + ' of ' + P1.length + ')', e);
  await tap(page, 'Seguir otro día', 700);
  h = await look(page, 'Seguir otro día', { expect: 'ExamTab', shot: 'A47-examtab-sitting' });
  check((await page.evaluate(() => document.querySelector('meta[name="theme-color"]').content)) === '#F4F5F9', 'back on the tab the status-bar strip is the ground colour again');
  const tabText = await text(page);
  check(/parte 2|1 de 5|Seguir/i.test(tabText), 'the exam tab shows the sitting in progress', tabText.slice(0, 400));
}

/* A9: Progress, then everything kept across reloads, a new tab and the Home Screen */
async function partA9(ctx, page) {
  part = 'A9 progress';
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  let h = await look(page, 'tab → Progress', { expect: 'Progress', shot: 'A48-progress' });
  await tap(page, exact('familia'), 400);
  const x = (await saved(page)).exposure;
  check(x && (x.with || []).join() === 'familia' && /^\d{4}-\d\d-\d\d$/.test(x.week), 'Progress: "lo usé" with familia is saved for the week', x);

  part = 'A10 progress kept';
  const before = await saved(page);
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
  await tap(page, 'Empezar con la regla', 600);
  check((await screenOf(page)) === 'Teach', 'in a lesson again (day 2\'s teach page)', await screenOf(page));
  await reload(page);
  h = await look(page, 'reload in a lesson', { expect: 'Main', shot: 'A49-main-reloaded' });
  check((await screenOf(page)) === 'Main', 'a reload in the middle of a lesson reopens on the week path, not the lesson', await screenOf(page));
  const s = await saved(page);
  check(s.plan && s.plan.target === before.plan.target && s.plan.minutes === 45 && s.level === 'A1', 'after the reload: the plan and the level are kept', [s.plan, s.level]);
  check(s.done.a1u01d1 && s.done.a1u01d1.g === 3 && s.done.a1u01d1.k === 1 && s.done.a1u01d1.r === 1 && s.done.a1u01d2.r === 1, 'after the reload: the days done are kept', s.done);
  check(s.mistakes.length === 5 && s.tests.a1u01t.score === 18 && s.exams.A1.partial === true && s.typed.length === 4 && s.exposure.with[0] === 'familia', 'after the reload: the mistakes, the week test, the exam sitting, the words typed and the week\'s "lo usé" are kept', { m: s.mistakes.length, t: s.tests, typed: s.typed });
  check((await page.locator('#gn-stage a[aria-label="Día 1, sellado. Abrilo de nuevo"]').count()) === 1 && (await page.locator('#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]').count()) === 1, 'after the reload: day 1 and the week test are stamped on the path', await controls(page));
  check((await page.locator('#gn-stage a[aria-label="Nivel A1, cambiar de nivel"]').count()) === 1, 'after the reload: the level box says A1');
  await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 600);
  check(await has(page, 'En el cuaderno · 5'), 'after the reload: the notebook lists the five mistakes', (await text(page)).slice(0, 200));
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  check(await pressed(page, exact('familia')), 'after the reload: Progress still has "lo usé" with familia');
  /* the level exam put aside comes back where it was */
  await tap(page, { sel: '#gn-stage nav a:has-text("Examen")' }, 600);
  await tap(page, 'Seguir con la parte 2', 800);
  h = await look(page, 'Seguir con la parte 2', { expect: 'LevelExam', shot: 'A51-levelexam-resumed' });
  check(await has(page, 'Seguir con la parte 2') && await has(page, 'entregada') && !(await has(page, 'Empezar la parte 1')), 'after the reload the exam tab resumes the sitting: part 1 handed in, part 2 next', (await text(page)).slice(0, 300));
  await tap(page, { aria: 'Volver a la pestaña Examen' }, 600);
  check((await screenOf(page)) === 'ExamTab' && ((await saved(page)).exams.A1.done || []).join() === 'P1', 'leaving it again keeps part 1 handed in', (await saved(page)).exams.A1.done);
  /* the week test's result, opened again from the path: its onward button */
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { sel: '#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]' }, 600);
  check((await screenOf(page)) === 'WeekTest' && await has(page, '18'), 'the stamped week test node opens its result again', await screenOf(page));
  const onward = ((await page.locator('#gn-stage a[href="Main.dc.html"]').last().textContent()) || '').trim();
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]' }, 600);
  const week = ((await text(page)).match(/Semana \d+ de \d+/) || [''])[0];
  /* week 2 is written now: the button offers it only once week 1 is whole. Here days 3 to 6 are not done, so it reads
     Volver and stays on week 1 */
  check(/Volver/.test(onward) && !/A la semana/.test(onward) && /Semana 1 /.test(week), `the week test's "${onward}" button leads back to its own week while that week is not whole (Main at "${week}"; week 2 opens once week 1 is done)`, { button: onward, landedOn: week });
  /* day 1 opened again: its words were typed before, so the writing step says so */
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { sel: '#gn-stage a[aria-label="Día 1, sellado. Abrilo de nuevo"]' }, 600);
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 600);
  await tap(page, 'Siguiente: las palabras', 500);
  check(await has(page, 'Ya escribiste todas las palabras de esta escena'), 'a stamped day opened again: the words typed before are remembered', (await text(page)).slice(0, 500));
  check(JSON.stringify((await saved(page)).done.a1u01d1) === JSON.stringify(s.done.a1u01d1), 'going over a stamped day again never undoes it', (await saved(page)).done.a1u01d1);

  /* a new Safari tab in the same week: «Seguir en el navegador» is remembered, so the app opens at once, everything kept */
  const tab = await newPage(ctx, 'learner A, new tab');
  await go(tab, '');
  check((await screenOf(tab)) === 'Main' && (await tab.locator('#gn-stage a[aria-label="Día 1, sellado. Abrilo de nuevo"]').count()) === 1, 'a new Safari tab within a week of «Seguir en el navegador» opens the app at once, on the week path with day 1 stamped', await screenOf(tab));
  /* eight days later the install page is offered again, and from it the learner is back on the week path */
  await setDay(tab, 8);
  await reload(tab);
  check((await screenOf(tab)) === 'Install', 'a visit more than a week later shows the install page again', await screenOf(tab));
  await tap(tab, 'Seguir en el navegador', 700);
  check((await screenOf(tab)) === 'Main' && (await tab.locator('#gn-stage a[aria-label="Día 1, sellado. Abrilo de nuevo"]').count()) === 1, 'from the install page, a learner with a plan lands on the week path with day 1 stamped', await screenOf(tab));
  await tab.close();
  /* the same phone, opened from the Home Screen: straight in */
  const home = await newPage(ctx, 'learner A, Home Screen');
  await home.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  await go(home, '');
  check((await screenOf(home)) === 'Main', 'opened from the Home Screen, the app starts on the week path with the saved progress', await screenOf(home));
  await shot(home, 'A50-home-screen');
  await home.close();
}

/* A4: day 1 of A1 unit 1, from Today, every lesson; the drill's first item and one exam-style item answered wrong */
async function partA4(page) {
  part = 'A4 day 1: grammar';
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
  let h = await look(page, 'Main card', { expect: 'Today', shot: 'A10-today' });
  check(await has(page, 'Semana 1 · Día 1') && await has(page, 'Saludar y despedirse'), 'the week path\'s card opens day 1 on Today', h.head);
  await tap(page, 'Empezar con la regla', 700);
  h = await look(page, 'Today → Teach', { expect: 'Teach', shot: 'A11-teach-1' });
  check(await has(page, "Mba'éichapa? · Iporã"), 'the teach page opens on the day\'s first form', h.head);
  await tap(page, { aria: 'Escuchar el ejemplo 1' }, 300);
  check(await pressed(page, { aria: 'Escuchar el ejemplo 1' }), 'an example\'s sound button lights up (the silent stand-in) when tapped');
  await tap(page, 'Siguiente:', 600);
  h = await look(page, 'teach page 2', { expect: 'Teach' });
  check(/Jajotopáta/.test(h.head), 'the second teach page shows the second form', h.head);
  check(((await saved(page)).tp || 0) === 1, 'the teach page reached is saved (tp 1)', (await saved(page)).tp);
  await tap(page, exact('Comparar'), 700);
  h = await look(page, 'Teach → Compare', { expect: 'Compare', shot: 'A12-compare' });
  const cmp = await page.evaluate(() => { const C = window.gnCourse; const it = C.day('a1u01d1').grammar.compare.check; return { answer: it.answer, options: it.options.map((o) => C.plain(o)) }; });
  const cmpWrong = cmp.options[cmp.answer % cmp.options.length];
  await tap(page, exact(cmpWrong), 400);
  const cmpText = await text(page);
  await tap(page, exact(cmp.options[cmp.answer - 1]), 400);
  check(cmpText !== (await text(page)), 'the comparison\'s quick check answers a wrong pick and then the right one');
  await tap(page, 'A la práctica', 700);
  h = await look(page, 'Compare → Drill', { expect: 'Drill', shot: 'A13-drill-1' });
  check(((await saved(page)).done.a1u01d1 || {}).g === 1, 'the teach page and comparison count as the first grammar step (g 1)', (await saved(page)).done);
  const drill = await itemsOf(page, await page.evaluate(() => window.gnCourse.day('a1u01d1').grammar.drill));
  for (let i = 0; i < drill.length; i++) {
    await answerOne(page, drill[i], i !== 0);
    await tap(page, 'Respondé', 450);
    if (i === 0) {
      await shot(page, 'A14-drill-wrong');
      check(await has(page, 'Guardado en tu cuaderno de errores. Vuelve mañana.'), 'drill: a wrong answer says it went to the notebook', (await text(page)).slice(0, 300));
      const m = (await saved(page)).mistakes;
      check(m.length === 1 && m[0].src === drill[0].id && m[0].due === (await isoIn(page, 1)) && m[0].step === 0, 'drill: the wrong answer is saved in the notebook at once, due tomorrow', m);
    } else if (drill[i].kind === 'build' && i === 4) {
      await shot(page, 'A15-drill-build');
      check(!(await has(page, 'Guardado en tu cuaderno')), 'drill: the tiles in order are right', (await text(page)).slice(0, 300));
    }
    await tap(page, i < drill.length - 1 ? 'Siguiente' : 'Terminar la práctica', 600);
  }
  h = await look(page, 'end of drill', { expect: 'Today' });
  check(((await saved(page)).done.a1u01d1 || {}).g === 2 && (await saved(page)).mistakes.length === 1, 'the drill done is saved (g 2), with its one mistake', (await saved(page)).done);
  await tap(page, exact('Al examen'), 700);
  h = await look(page, 'Today → Exam', { expect: 'Exam', shot: 'A16-exam' });
  check(await has(page, 'EXAMEN · SIN AYUDAS') && /2:[0-9]{2}/.test(await text(page)), 'the exam-style step opens with its clock', h.head);
  const exam = await itemsOf(page, await page.evaluate(() => window.gnCourse.day('a1u01d1').grammar.exam));
  for (let i = 0; i < exam.length; i++) {
    await answerOne(page, exam[i], i !== 1);
    await tap(page, i < exam.length - 1 ? 'Siguiente' : exact('Terminar'), 500);
  }
  h = await look(page, 'exam result', { expect: 'Exam', shot: 'A17-exam-result' });
  check(await has(page, 'Examen terminado') && await has(page, '1 error guardado en tu cuaderno. Vuelve mañana.'), 'the exam-style result: done, one error to the notebook', (await text(page)).slice(0, 400));
  check((await page.locator('#gn-stage h1').first().textContent()).trim() === String(exam.length - 1), 'the exam-style score is ' + (exam.length - 1) + ' of ' + exam.length, await page.locator('#gn-stage h1').first().textContent());
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  h = await look(page, 'exam → Today', { expect: 'Today', shot: 'A18-today-grammar-done' });
  let s = await saved(page);
  check(s.done.a1u01d1.g === 3 && s.mistakes.map((m) => m.src).sort().join() === [drill[0].id, exam[1].id].sort().join(), 'the grammar lesson is saved done (g 3) with the drill and exam mistakes', { done: s.done, m: s.mistakes.map((m) => m.src) });

  part = 'A4 day 1: words';
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 700);
  h = await look(page, 'Today → Words', { expect: 'Words', shot: 'A19-words-sound' });
  check(await has(page, 'Las vocales orales') && await has(page, 'PAR 1 DE 4'), 'the words lesson opens on its sound step (Sonido y letra)', h.head);
  const pairs = await page.evaluate(() => window.gnCourse.day('a1u01d1').words.sound.pairs.map((p) => ({ p, said: window.gnSpell.shuffle([0, 1], p[0] + '|' + p[2])[0] })));
  for (let i = 0; i < pairs.length; i++) {
    const play = `#gn-stage button[aria-label="Escuchar la palabra del par ${i + 1}"]`;
    const opt = (k) => ({ sel: `xpath=//*[@id="gn-stage"]//button[@aria-label="Escuchar la palabra del par ${i + 1}"]/following-sibling::div[1]//button[${k + 1}]` });
    check(await shut(page, opt(0)), `sound pair ${i + 1}: the words are shut until the sound is played`);
    await tap(page, { sel: play }, 300);
    const k = i === 1 ? 1 - pairs[i].said : pairs[i].said;
    await tap(page, opt(k), 400);
    const verdict = await page.locator(`xpath=//*[@id="gn-stage"]//button[@aria-label="Escuchar la palabra del par ${i + 1}"]/../following-sibling::div[1]`).first().innerText();
    if (i <= 1) check(i === 1 ? /Era la otra/.test(verdict) : /Iporã/.test(verdict), `sound pair ${i + 1}: a ${i === 1 ? 'wrong' : 'right'} pick is answered (${verdict.replace(/\s+/g, ' ')})`, verdict);
  }
  await shot(page, 'A20-words-pairs');
  await tap(page, 'Siguiente: las palabras', 600);
  h = await look(page, 'scene', { expect: 'Words', shot: 'A21-words-scene' });
  const words = await page.evaluate(() => window.gnCourse.day('a1u01d1').words.words.map((w) => w.gn));
  for (const w of words.slice(1)) await tap(page, exact(w), 200);
  await tap(page, { aria: 'Escuchar la palabra' }, 300);
  check(await has(page, 'Después vas a escribir 4 palabras'), 'the scene says four words are to be written next', (await text(page)).slice(0, 600));
  await tap(page, 'Siguiente: escribir', 700);
  h = await look(page, 'Spell', { expect: 'Words', shot: 'A22-words-spell' });
  check(((await saved(page)).done.a1u01d1 || {}).ks === 1, 'leaving the scene saves the first words step (ks 1)', (await saved(page)).done.a1u01d1);
  check(await shut(page, 'Escribí la palabra primero'), 'Spell: Next is shut until the word is written');
  const spell = await page.evaluate(() => {
    const C = window.gnCourse;
    const S = window.gnSpell;
    const w = C.day('a1u01d1').words;
    return w.spell.map((id) => w.words.filter((x) => x.id === id)[0]).map((x) => ({ gn: x.gn, keys: S.cells(x.gn).filter(S.hard).map((g) => S.norm(g).toLowerCase()) }));
  });
  for (let n = 0; n < spell.length; n++) {
    const w = spell[n];
    for (let pass = 0; pass < 3; pass++) {
      if (n === 0 && pass === 0) {
        /* a wrong key first: named, and nothing goes in */
        /* a near miss: one letter of a two-letter letter (b for mb) */
        const keys = await page.locator('#gn-stage button[aria-label]').evaluateAll((bs) => bs.map((b) => (b.querySelector('span[lang="gn"]') || {}).textContent).filter(Boolean));
        const wrongKey = keys.find((k) => k !== w.keys[0] && w.keys[0].includes(k)) || keys.find((k) => k !== w.keys[0]);
        await tap(page, { sel: `xpath=//*[@id="gn-stage"]//button[span[@lang="gn" and normalize-space(.)="${wrongKey}"]]` }, 350);
        const after = await text(page);
        check(after.includes(w.keys[0] + ' es una sola letra: tocá ' + w.keys[0] + '.'), `Spell: a near miss ("${wrongKey}" for "${w.keys[0]}") is named`, after.slice(0, 300));
        await shot(page, 'A23-spell-wrong-key');
      }
      for (const k of w.keys) await tap(page, { sel: `xpath=//*[@id="gn-stage"]//button[span[@lang="gn" and normalize-space(.)="${k}"]]` }, 160);
      await page.waitForTimeout(1250);
    }
    await page.waitForFunction(() => ![...document.querySelectorAll('#gn-stage button')].some((b) => /Escribí la palabra primero/.test(b.textContent)), null, { timeout: 4000 }).catch(() => {});
    const typed = (await saved(page)).typed || [];
    check(typed.includes(w.gn), `Spell: "${w.gn}" typed three times is saved as typed`, typed);
    await tap(page, n < spell.length - 1 ? 'Siguiente:' : 'Siguiente: la pregunta', 600);
  }
  h = await look(page, 'words check', { expect: 'Words', shot: 'A24-words-check' });
  check(((await saved(page)).done.a1u01d1 || {}).kw === 1, 'the four words written save the second words step (kw 1)', (await saved(page)).done.a1u01d1);
  const kc = await page.evaluate(() => { const C = window.gnCourse; const it = C.day('a1u01d1').words.check; return { id: it.id, answer: it.answer, options: it.options.map((o) => C.plain(o)) }; });
  await tap(page, exact(kc.answer + ' ' + kc.options[kc.answer - 1]), 500);
  check(await has(page, '¡Correcto!'), 'the words lesson\'s exam question: the right answer is marked right', (await text(page)).slice(0, 300));
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  h = await look(page, 'words → Today', { expect: 'Today' });
  s = await saved(page);
  check(s.done.a1u01d1.k === 1 && s.mistakes.length === 2, 'the words lesson is saved done (k 1); a right answer adds no mistake', { d: s.done.a1u01d1, m: s.mistakes.length });

  part = 'A4 day 1: listening';
  const lk = await page.evaluate(() => window.__locks);
  check(lk === 0, 'no wake lock on the goal screen, the tabs, Teach, Compare, Drill, Exam or Words', lk);
  await tap(page, { sel: '#gn-stage a[href="Listening.dc.html"]' }, 700);
  check((await page.evaluate(() => window.__locks)) > lk, 'the listening lesson keeps the screen awake', await page.evaluate(() => window.__locks));
  h = await look(page, 'Today → Listening', { expect: 'Listening', shot: 'A25-listening' });
  const li = await page.evaluate(() => { const C = window.gnCourse; const it = C.day('a1u01d1').skill.item; return { id: it.id, answer: it.answer, n: it.options.length }; });
  check(await shut(page, { sel: '#gn-stage button[aria-label^="Respuesta 1"]' }), 'listening: the answers are shut until the audio has played');
  await tap(page, { aria: 'Reproducir el audio' }, 300);
  const t0 = Date.now();
  await page.waitForFunction(() => { const b = document.querySelector('#gn-stage button[aria-label^="Respuesta 1"]'); return b && !/escuchá primero/.test(b.getAttribute('aria-label')); }, null, { timeout: 45000 });
  pass(`listening: the silent stand-in plays through and opens the answers (${Math.round((Date.now() - t0) / 100) / 10} s)`);
  await tap(page, { sel: `#gn-stage button[aria-label^="Respuesta ${li.answer}"]` }, 600);
  await shot(page, 'A26-listening-answered');
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  h = await look(page, 'listening → Today', { expect: 'Today', shot: 'A27-today-sealed' });
  s = await saved(page);
  check(s.done.a1u01d1.r === 1 && s.mistakes.length === 2, 'the listening item is saved done (r 1), right, so no new mistake', { d: s.done.a1u01d1, m: s.mistakes.length });
  check(await has(page, 'Día 1') && !(await has(page, 'Terminá las tres lecciones')), 'Today: with the three lessons done, the day is sealed', (await text(page)).slice(-200));
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Volver")' }, 700);
  h = await look(page, 'Today → Main', { expect: 'Main', shot: 'A28-main-day1-stamped' });
  check((await page.locator('#gn-stage a[aria-label="Día 1, sellado. Abrilo de nuevo"]').count()) === 1, 'Main: day 1 is stamped', await controls(page));
  /* one session a day: day 2 is dated tomorrow, and opens now as "el próximo" */
  check((await page.locator('#gn-stage a[aria-label="Día 2, el próximo. Abrí el día"]').count()) === 1 && await has(page, 'Pronombres: ñande y ore') && await has(page, 'SIGUIENTE'), 'Main: day 2 (dated tomorrow) is the next one, and its card leads there', await controls(page));
  check((await page.locator('#gn-stage a[aria-label="Nivel A1, cambiar de nivel"]').textContent()).trim() === 'A1' && (await text(page)).includes(' 1 '), 'Main: the stamp count shows 1', (await text(page)).slice(0, 80));
}

/* ---------- B: the placement check from the goal screen, and the level it gives ---------- */
async function partB(browser) {
  const ctx = await phone(browser);
  const page = await newPage(ctx, 'learner B');
  part = 'B1 placement from the goal';
  await go(page, '');
  await tap(page, 'Seguir en el navegador', 700);
  await tap(page, exact('vivo en Paraguay'), 250);
  await tap(page, exact('calle y mercado'), 250);
  await tap(page, 'Siguiente', 500);
  await tap(page, exact('todo'), 250);
  await page.locator('#gn-stage button').filter({ hasText: exact('nada') }).nth(1).tap();
  await page.waitForTimeout(300);
  check(await has(page, 'Hacer la prueba'), 'step 2: understanding "todo" and speaking "nada" offers the placement check');
  await tap(page, 'Hacer la prueba', 800);
  let h = await look(page, 'Hacer la prueba', { expect: 'Placement', shot: 'B01-placement-self' });
  check(await has(page, 'Prueba de ubicación · Parte 1 de 3'), 'the goal screen\'s card opens the placement check at part 1', h.head);
  let s = await saved(page);
  check(s && s.profile && s.profile.why.join() === 'paraguay' && s.profile.where.join() === 'calle' && s.profile.understand === 4 && s.profile.speak === 0 && !s.plan, 'the answers of steps 1 and 2 are saved on the way to the check (no plan yet)', s);
  /* what is kept at this moment, to reopen the app with it later (B3) */
  const duringCheck = await page.evaluate((k) => localStorage.getItem(k), KEY);
  /* out of the check and back in: the goal screen's step 2 with its answers */
  await tap(page, { aria: 'Salir de la prueba de ubicación' }, 700);
  h = await look(page, 'placement closed', { expect: 'Goal' });
  check(await has(page, '¿Desde dónde empezás?') && await pressed(page, exact('todo')), 'closing the check returns to step 2 with its answers', h.head);
  await tap(page, 'Hacer la prueba', 800);
  /* part 1: understanding yes up to B1, speaking yes up to A2 */
  const yes = [true, true, true, false, true, true, false, false];
  for (let i = 0; i < yes.length; i++) {
    await page.locator('#gn-stage button').filter({ hasText: exact(yes[i] ? 'Sí' : 'No') }).nth(i).tap();
    await page.waitForTimeout(120);
  }
  await tap(page, 'Siguiente', 700);
  h = await look(page, 'placement part 2', { expect: 'Placement', shot: 'B02-placement-question' });
  check(await has(page, 'Parte 2 de 3'), 'all eight statements answered, part 2 (understanding) opens', h.head);
  /* part 2: every question answered right; a listening one is played first (its options stay shut until then) */
  let n = 0;
  let listened = 0;
  while (n < 8 && (await has(page, 'Parte 2 de 3'))) {
    const cur = await page.evaluate(() => {
      const C = window.gnCourse;
      const shown = [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => b.textContent.replace(/^\s*\d+/, '').trim());
      const it = window.__gnExtra.placement.items.find((x) => x.options.map((o) => C.plain(o).trim()).join('|') === shown.join('|'));
      return it ? { id: it.id, answer: it.answer, options: it.options.map((o) => C.plain(o)), listening: !!(it.audio && it.audio.length) } : { shown };
    });
    if (!cur.id) throw Object.assign(new Error('placement: the question on screen is not in the data'), { controls: cur.shown });
    if (cur.listening) {
      check(await shut(page, new RegExp('^\\s*1\\s*' + esc(cur.options[0]))), `placement ${cur.id}: a listening question's options are shut until it is played`);
      await tap(page, { aria: 'Escuchar el audio' }, 300);
      await page.waitForFunction(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].some((b) => !b.disabled), null, { timeout: 45000 });
      listened += 1;
    }
    await tap(page, new RegExp('^\\s*' + cur.answer + '\\s*' + esc(cur.options[cur.answer - 1]) + '\\s*$'), 250);
    await tap(page, { sel: '#gn-stage button:has-text("Siguiente"):not([disabled])' }, 500);
    n += 1;
  }
  check(n === 6 && listened === 3, `part 2 asked all ${n} questions, ${listened} of them listened to first`, { n, listened });
  h = await look(page, 'placement part 3', { expect: 'Placement', shot: 'B03-placement-production' });
  check(await has(page, 'Parte 3 de 3'), 'part 3 (speaking) follows', h.head);
  await tap(page, /^\s*A2/, 300);
  await tap(page, 'Ver mi resultado', 800);
  h = await look(page, 'placement result', { expect: 'Placement', shot: 'B04-placement-result' });
  check(await has(page, 'Tu autoevaluación: comprensión B1 · producción A2.') && await has(page, 'Empezar en A2'), 'the result: understanding B1, speaking A2, the plan starts at A2', (await text(page)).slice(0, 500));
  s = await saved(page);
  check(s.placement && s.placement.comp === 'B1' && s.placement.prod === 'A2' && s.placement.start === 'A2' && s.placement.measured === true && s.placement.self && s.placement.self.comp === 'B1', 'the placement is saved: comprensión B1, producción A2, start A2', s.placement);
  const afterResult = await page.evaluate((k) => localStorage.getItem(k), KEY);

  part = 'B2 the level it gives';
  await tap(page, 'Empezar en A2', 800);
  h = await look(page, 'Empezar en A2', { expect: 'Goal', shot: 'B05-goal-a2' });
  check(await has(page, 'Tu prueba de ubicación: comprensión B1 · producción A2.') && await pressed(page, { sel: '#gn-stage button[aria-label^="A2,"]' }), 'the goal screen opens at step 3 with A2 picked and the placement named', (await text(page)).slice(0, 400));
  check(await has(page, 'Las lecciones de A2 están en preparación.'), 'step 3 says A2 is still being written and offers A1 meanwhile', (await text(page)).slice(0, 600));
  await tap(page, 'Tejé el primer hilo', 800);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 800);
  h = await look(page, 'A2 week path', { expect: 'Main', shot: 'B06-main-a2' });
  check((await page.locator('#gn-stage a[aria-label="Nivel A2, cambiar de nivel"]').count()) === 1 && await has(page, 'Esta semana se está escribiendo'), 'Main at A2: the level box says A2 and the week is still being written', h.head);
  s = await saved(page);
  check(s.level === 'A2' && s.plan && s.plan.start === (await isoIn(page, 0)) && s.placement.start === 'A2', 'saved: level A2 with its plan', [s.level, s.plan]);
  await reload(page);
  check((await screenOf(page)) === 'Main' && (await page.locator('#gn-stage a[aria-label="Nivel A2, cambiar de nivel"]').count()) === 1, 'after a reload the learner is still at A2', await screenOf(page));
  /* back to A1, a level that is written: its own goal step 3 the first time; A2's plan is kept for a return */
  await tap(page, { aria: 'Nivel A2, cambiar de nivel' }, 600);
  h = await look(page, 'Levels at A2', { expect: 'Levels', shot: 'B07-levels-a2' });
  await tap(page, { sel: '#gn-stage a[href="Goal.dc.html"]:has-text("Acceso")' }, 800);
  h = await look(page, 'Levels → A1', { expect: 'Goal' });
  check(await pressed(page, { sel: '#gn-stage button[aria-label^="A1,"]' }) && await has(page, 'Tejé el primer hilo'), 'picking A1 on Levels opens its goal step 3 (A1 has no plan yet)', (await text(page)).slice(0, 300));
  /* this goal screen was opened by a level switch: can the learner change their mind and go back to A2's path? */
  await tap(page, { aria: 'Volver al paso anterior' }, 400);
  await tap(page, { aria: 'Volver al paso anterior' }, 400);
  const way = await page.locator('#gn-stage [aria-label="Volver al camino"], #gn-stage [aria-label="Volver al paso anterior"]').count();
  check(way > 0, 'after a level switch to a level with no plan, the goal screen still has a way back to the path the learner came from', { step: (await text(page)).slice(0, 60), backControls: way, saved: { level: (await saved(page)).level, plan: (await saved(page)).plan } });
  await tap(page, 'Siguiente', 400);
  await tap(page, exact('Elegir mi nivel'), 500);
  /* a date of the learner's own, 40 days away: too close for one session a day, so some days have two */
  const mine = await isoIn(page, 40);
  await tap(page, { sel: '#gn-stage button[aria-haspopup="dialog"]' }, 500);
  await tap(page, 'Elegir una fecha', 400);
  await page.locator('#gn-stage input[type="date"]').fill(mine);
  await page.waitForTimeout(300);
  await shot(page, 'B08-goal-own-date');
  await tap(page, 'Listo', 500);
  check(await has(page, 'Tu fecha') && await has(page, 'faltan 40 días') && await has(page, 'algunos días tienen dos'), `step 3: an own date (${mine}) is taken, and the plan says some days have two sessions`, (await text(page)).slice(0, 700));
  await tap(page, 'Tejé el primer hilo', 800);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 800);
  h = await look(page, 'A1 week path', { expect: 'Main', shot: 'B09-main-a1-two-a-day' });
  check(await has(page, 'Tu plan pide 2 sesiones por día.') && await has(page, 'faltan 40 días'), 'Main: the card says the plan asks for 2 sessions a day, 40 days left', h.head);
  s = await saved(page);
  check(s.level === 'A1' && s.plan && s.plan.target === mine && s.plan.pace === 'fit' && s.plans && s.plans.A2 && s.plans.A2.start === s.plan.start, 'saved: level A1 with its own date, and A2\'s plan kept', [s.level, s.plan, s.plans]);
  await reload(page);
  check((await screenOf(page)) === 'Main' && (await page.locator('#gn-stage a[aria-label="Nivel A1, cambiar de nivel"]').count()) === 1 && (await has(page, 'Saludar y despedirse')), 'after a reload the learner is at A1, on day 1', await screenOf(page));
  const back = await page.evaluate(() => window.gnApp.start());
  check(back.plans && back.plans.A2 && back.placement && back.placement.start === 'A2' && back.profile && back.profile.why[0] === 'paraguay', 'read back after the reload: A2\'s plan, the placement and the profile', { plans: back.plans, placement: back.placement });
  await ctx.close();

  /* B3: the app closed part way: during the check, and after its result but before "Empezar en A2" (reopened from
     the Home Screen with exactly what B1 had saved at those two moments) */
  part = 'B3 closed part way through the placement';
  for (const [label, state] of [['during the check', duringCheck], ['after the result', afterResult]]) {
    const c = await phone(browser);
    const p = await newPage(c, 'placement ' + label);
    await p.addInitScript((v) => { Object.defineProperty(navigator, 'standalone', { get: () => true }); if (!sessionStorage.getItem('seeded')) { localStorage.setItem('epua.v1:/', v); sessionStorage.setItem('seeded', '1'); } }, state);
    await go(p, '');
    await look(p, 'reopened ' + label, { expect: 'Goal', shot: 'B10-reopened-' + label.replace(/\s+/g, '-') });
    if (label === 'during the check') {
      check(await pressed(p, exact('vivo en Paraguay')) && await pressed(p, exact('calle y mercado')), 'reopened during the placement check: the goal screen shows the answers already saved (profile)', { on: (await text(p)).slice(0, 60), pressed: await p.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed="true"]')].map((b) => b.textContent.trim())) });
    } else {
      check(await pressed(p, { sel: '#gn-stage button[aria-label^="A2,"]' }), 'reopened after the placement result: step 3 has A2 picked, the level the result started the plan at', { pressed: await p.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed="true"]')].map((b) => (b.getAttribute('aria-label') || b.textContent).trim())), line: (await text(p)).match(/Tu prueba de ubicación[^.]*\./) });
    }
    await c.close();
  }
}

/* ---------- C: read, type, speak ---------- */
const hrefsSeen = new Set();
async function partC(browser) {
  part = 'C1 how a learner gets to Leer, Escribir, Hablar';
  /* the links of the other 18 screens, opened fresh and part way through (with the ?gntest hook), added to those the
     flows saw: does any lead to the three sections? */
  {
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'link survey');
    const day = (n) => { const d = new Date(Date.now() + n * DAY); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const full = { g: 3, k: 1, r: 1 };
    const sample = '&level=A1&plan=' + encodeURIComponent(JSON.stringify({ start: day(-3), target: day(60), pace: 'fit', minutes: 30 })) + '&done=' + encodeURIComponent(JSON.stringify({ a1u01d1: full, a1u01d2: full, a1u01d3: full, a1u01d4: { g: 1 } })) + '&cur=a1u01d4';
    for (const name of SCREENS.filter((x) => !['Leer', 'Escribir', 'Hablar'].includes(x))) {
      for (const extra of ['', sample]) {
        await go(page, '?gntest&screen=' + name + extra);
        (await page.evaluate(() => [...document.querySelectorAll('#gn-stage a[href]')].map((a) => a.getAttribute('href')))).forEach((x) => hrefsSeen.add(x));
      }
    }
    await ctx.close();
  }
  const links = [...hrefsSeen].sort();
  const to = links.filter((x) => /^(Leer|Escribir|Hablar)\.dc\.html/.test(x));
  check(to.length > 0, 'some screen of the app links to Leer, Escribir or Hablar', 'links seen on every screen the flows reached: ' + links.join(' '));
  /* and in the screens' own code (assets/screens.js): no screen navigates there */
  const code = fs.readFileSync(path.join(DIR, 'assets', 'screens.js'), 'utf8');
  const calls = {};
  for (const name of ['Leer', 'Escribir', 'Hablar']) {
    const re = new RegExp("(?:nav|go)\\(\\s*'" + name + "'\\s*\\)", 'g');
    const defs = code.split(/YK\.define\(/).slice(1).map((chunk) => ({ name: (/^\s*'([^']+)'/.exec(chunk) || [])[1], n: (chunk.match(re) || []).length }));
    calls[name] = defs.filter((d) => d.n && d.name !== name).map((d) => d.name);
  }
  check(Object.values(calls).some((l) => l.length), 'some screen calls go(\'Leer\'), go(\'Escribir\') or go(\'Hablar\')', calls);

  part = 'C2 Leer, Escribir, Hablar reached by taps and played';
  const ctx = await phone(browser);
  const page = await newPage(ctx, 'satellites');
  /* a learner with a plan, opening the app from the Home Screen: the three sections are a tap away on Progreso */
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  await page.addInitScript((v) => {
    Object.defineProperty(navigator, 'standalone', { get: () => true });
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('epua.v1:/', v); sessionStorage.setItem('seeded', '1'); }
    window.__locks = 0;
    if (navigator.wakeLock && navigator.wakeLock.request) { const r = navigator.wakeLock.request.bind(navigator.wakeLock); navigator.wakeLock.request = (t) => { window.__locks += 1; return r(t); }; }
  }, JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: today, target: null, pace: 'fit', minutes: 30 } }));
  const fromProgress = async (label, screen, shotName) => {
    if ((await screenOf(page)) !== 'Progress') await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
    await tap(page, { sel: `#gn-stage a[aria-label="${label}"]` }, 700);
    return look(page, screen + ' from Progreso', { expect: screen, shot: shotName });
  };
  /* Leer: a phrase held down shows its parts; let go, it joins the list of what was looked at */
  await go(page, '');
  check((await screenOf(page)) === 'Main', 'the learner opens the app on the week path', await screenOf(page));
  let h = await fromProgress('Leer', 'Leer', 'C01-leer');
  const during = await hold(page, exact('Che réra'), 700);
  await shot(page, 'C02-leer-after-hold');
  check(/Che mi réra nombre/.test(during) && during.includes('me llamo') && during.includes('Gramática'), 'Leer: holding a phrase shows its parts (che · réra), its meaning and its grammar', during.slice(0, 400));
  const focused = await page.evaluate(() => (document.activeElement && document.activeElement.tagName === 'BUTTON' ? document.activeElement.textContent.trim() : ''));
  check(!(await text(page)).includes('me llamo (mi nombre)'), 'Leer: lifting the finger closes the lens', { lensStillOpen: true, focusedAfterLift: focused, why: 'Chromium focuses the phrase button after touchend, and its onFocus holds the phrase again (Leer.dc.html items[].focus); Safari on iPhone does not focus buttons on tap' });
  check(await has(page, '1 / 19 frases'), 'Leer: the phrase held joins "Lo que miraste" (1 / 19)', (await text(page)).slice(-300));
  await tap(page, 'Pytyvõ · Ayuda', 500);
  const sw = page.locator('#gn-stage button[role="switch"]').first();
  const was = await sw.getAttribute('aria-checked');
  await sw.tap();
  await page.waitForTimeout(250);
  check((await sw.getAttribute('aria-checked')) !== was, 'Leer: a switch in the help sheet flips', [was, await sw.getAttribute('aria-checked')]);
  await tap(page, 'Mboty · Cerrar', 400);
  await tap(page, { aria: 'Cerrar la lectura' }, 600);
  check((await screenOf(page)) === 'Progress', 'Leer closes to Progreso, where «Más práctica» opened it', await screenOf(page));

  /* Escribir: the first word typed on the game's own keyboard */
  h = await fromProgress('Escribir', 'Escribir', 'C03-escribir');
  /* the word to type is the one in the info line under the stage (the round's order is shuffled); its keys, as the
     game's keyboard names them */
  const word = await page.evaluate(() => {
    const C = window.gnCourse;
    const line = [...document.querySelectorAll('#gn-stage span[lang="gn"]')].find((x) => !x.closest('[aria-hidden="true"]') && x.nextElementSibling && x.nextElementSibling.tagName === 'SPAN' && x.parentElement.children.length === 2);
    const w = line ? line.textContent.trim() : '';
    const NASAL = { 'ã': 'a', 'ẽ': 'e', 'ĩ': 'i', 'õ': 'o', 'ũ': 'u', 'ỹ': 'y' };
    const ACUTE = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y' };
    const name = (c) => (c === 'y' ? 'y, vocal guaraní' : c === 'ñ' ? 'eñe' : c === "'" ? 'puso, el corte de la voz' : c === ' ' ? 'Espacio' : c);
    const keys = [];
    C.chars(w).forEach((g) => {
      const lo = g.toLowerCase();
      if (lo !== g) keys.push('Mayúscula');
      if (NASAL[lo]) keys.push(NASAL[lo] + ' nasal');
      else if (lo === 'g\u0303') keys.push('g nasal');
      else if (ACUTE[lo]) keys.push('Acento (tilde aguda)', name(ACUTE[lo]));
      else keys.push(name(lo));
    });
    return { w, keys };
  });
  const before = await text(page);
  const half = Math.max(1, word.keys.length - 1);
  for (const k of word.keys.slice(0, half)) await tap(page, { aria: k }, 110);
  const mid = await text(page);
  await shot(page, 'C04-escribir-typing');
  for (const k of word.keys.slice(half)) await tap(page, { aria: k }, 110);
  await page.waitForTimeout(800);
  const after = await text(page);
  await shot(page, 'C05-escribir-typed');
  check(word.w && mid !== before && !/Esa no/.test(mid), `Escribir: the on-screen keys type the first word, "${word.w}" (${word.keys.join(' · ')})`, { word, mid: mid.slice(0, 160) });
  check(/^\s*1 sin error seguidas/.test(after), `Escribir: "${word.w}" typed without a slip counts 1 in a row`, after.slice(0, 160));
  await tap(page, { aria: 'Pausa o salir de la ronda' }, 500);
  await tap(page, 'Salir de la ronda', 600);
  check((await screenOf(page)) === 'Progress', 'Escribir: the pause menu leaves to Progreso, where it was opened', await screenOf(page));

  /* Hablar: a round of "Escuchá y elegí": a card picked */
  h = await fromProgress('Hablar', 'Hablar', 'C06-hablar');
  check((await page.evaluate(() => window.__locks)) >= 1, 'Hablar keeps the screen awake');
  const canvasWords = (await text(page)).match(/En el lienzo[^.]*\./);
  ok(!canvasWords, 'Hablar\'s intro, as the app shows it, should not talk about the design canvas ("el lienzo") or a «Simular toma» button', canvasWords && canvasWords[0]);
  await tap(page, 'Empezar', 2600);
  await shot(page, 'C07-hablar-round');
  /* the cards keep falling (never still, so no wait for them to settle): a finger on the lowest one in view */
  const card = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('#gn-stage button:not([aria-label])')].filter((b) => !/Saltear|despacio|Escuchar|Empezar/.test(b.textContent)).map((b) => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim(), x: r.x + r.width / 2, y: r.y + r.height / 2, top: r.top }; }).filter((c) => c.top > 100 && c.y < 560);
    cs.sort((a, b) => b.y - a.y);
    return { n: cs.length, c: cs[0] || null };
  });
  const pre = await text(page);
  if (card.c) await page.touchscreen.tap(card.c.x, card.c.y);
  await page.waitForTimeout(900);
  const post = await text(page);
  await shot(page, 'C08-hablar-picked');
  check(card.c && post !== pre, `Hablar: a falling card ("${card.c && card.c.t}", ${card.n} in view) can be picked and the game answers`, { card, pre: pre.slice(0, 160), post: post.slice(0, 160) });
  await tap(page, { aria: 'Pausa o salir de la ronda' }, 500);
  await tap(page, 'Salir de la ronda', 600);
  check((await screenOf(page)) === 'Progress', 'Hablar: the pause menu leaves to Progreso, where it was opened', await screenOf(page));
  await ctx.close();
}

/* ---------- F: a lesson left part way: what was done in it is kept across a reload ---------- */
async function partF(browser) {
  part = 'F words lesson left part way';
  const ctx = await phone(browser);
  const page = await newPage(ctx, 'learner F');
  await page.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  await go(page, '');
  check((await screenOf(page)) === 'Goal', 'from the Home Screen a first visit opens the goal screen at once', await screenOf(page));
  await tap(page, 'Siguiente', 400);
  await tap(page, exact('Empezar en A1'), 400);
  await tap(page, 'Tejé el primer hilo', 600);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 700);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 600);
  await tap(page, 'Siguiente: las palabras', 500);
  await tap(page, 'Siguiente: escribir', 600);
  const list = await spellList(page, 'a1u01d1');
  for (const w of list.slice(0, 2)) {
    await spellOne(page, w);
    await tap(page, 'Siguiente:', 600);
  }
  await tap(page, { aria: 'Cerrar la lección' }, 600);
  let h = await look(page, 'words closed part way', { expect: 'Today', shot: 'F01-today-words-part-way' });
  const pills = await page.locator('#gn-stage a[href="Words.dc.html"]').first().innerText();
  let s = await saved(page);
  check(s.done.a1u01d1 && s.done.a1u01d1.ks === 1 && !s.done.a1u01d1.kw && s.typed.join() === list.slice(0, 2).map((w) => w.gn).join(), 'left after two of four words: the scene step and the two words typed are saved', { done: s.done.a1u01d1, typed: s.typed });
  await reload(page);
  check((await screenOf(page)) === 'Main', 'reopened: the week path', await screenOf(page));
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 700);
  h = await look(page, 'words reopened', { expect: 'Words', shot: 'F02-words-reopened' });
  check(await has(page, 'ESCRIBIR') && await has(page, '1 / 2') && await has(page, list[2].gn), `reopened, the words lesson goes on at the writing step with the two words left (${list[2].gn} first)`, (await text(page)).slice(0, 300));
  for (const w of list.slice(2)) {
    await spellOne(page, w);
    await tap(page, 'Siguiente:', 600);
  }
  s = await saved(page);
  check(s.done.a1u01d1.kw === 1 && s.typed.length === 4, 'the last two words written: the writing step is saved (kw 1) with all four words', { done: s.done.a1u01d1, typed: s.typed });
  check(pills.length > 0, 'Today shows the words lesson part way', pills);
  await ctx.close();
}

/* ---------- G: two tabs of the app in the same Safari ---------- */
async function partG(browser) {
  part = 'G two tabs at once';
  const ctx = await phone(browser);
  const one = await newPage(ctx, 'tab one');
  await one.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  await go(one, '');
  await tap(one, 'Siguiente', 400);
  await tap(one, exact('Empezar en A1'), 400);
  await tap(one, 'Tejé el primer hilo', 600);
  await tap(one, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 700);
  /* a second tab opened on the same address, left on the week path */
  const two = await newPage(ctx, 'tab two');
  await two.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  await go(two, '');
  check((await screenOf(two)) === 'Main', 'a second tab opens on the week path too', await screenOf(two));
  /* in the first tab: day 1's drill, its first answer wrong (a mistake saved at once) */
  await tap(one, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
  await tap(one, 'Empezar con la regla', 600);
  await tap(one, 'Siguiente:', 500);
  await tap(one, exact('Comparar'), 600);
  await tap(one, 'A la práctica', 600);
  const drill = await itemsOf(one, await one.evaluate(() => window.gnCourse.day('a1u01d1').grammar.drill));
  await answerOne(one, drill[0], false);
  await tap(one, 'Respondé', 500);
  const mid = await saved(one);
  check(mid.mistakes.length === 1 && mid.done.a1u01d1 && mid.done.a1u01d1.g === 1, 'tab one: the mistake and the first grammar step are saved', { m: mid.mistakes.length, done: mid.done });
  /* the second tab, still showing the state it opened with, is used: one tap on its tab bar */
  await tap(two, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 600);
  const after = await saved(two);
  check(after.mistakes.length === 1 && after.done.a1u01d1 && after.done.a1u01d1.g === 1, 'a tap in a second, older tab does not wipe what the first tab saved', { mistakes: after.mistakes.length, done: after.done });
  await reload(one);
  await tap(one, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 500);
  const nb = await text(one);
  check(nb.includes('En el cuaderno · 1'), 'after reopening, the first tab\'s mistake is still in the notebook', { notebook: nb.slice(0, 160), saved: (await saved(one)).mistakes.length });
  await ctx.close();
}

/* ---------- D: saved data that does not fit ---------- */
async function partD(browser) {
  part = 'D saved data that does not fit';
  const iso = (n) => { const d = new Date(Date.now() + n * DAY); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const plan = { start: iso(-1), target: null, pace: 'fit', minutes: 30 };
  const deep = {
    v: 1, started: true, level: 'A1', plan,
    done: { a1u01d1: { g: 'NaN', k: Infinity, r: -1, ks: null }, a1u01d2: null, a1u01t: { g: 3 }, a1u01d1x: { g: 3 }, a1u01d3: { g: 2.6, kw: '1', r: 1e9 } },
    tests: { a1u01t: { score: 1.5, of: 20, areas: { grammar: { right: 9, of: 3 }, foo: { right: 1, of: 1 } } }, a1u02t: { score: 25, of: 20 }, a1u01d1: { score: 1, of: 1 } },
    exams: { A1: { parts: { P1: { right: 'x', of: -2 }, P9: {} }, done: 'P1', a: [1, 2], picks: { x: 'y' }, text: { P4: 5 }, rate: [], used: { P1: 'x' }, prev: { prev: { prev: {} } }, partial: 'yes', until: 'tomorrow', level: 'A1' }, B1: { level: 'A1' } },
    mistakes: [{ src: 'a1u01d1.d1', due: '2026-13-45', at: 'x', step: 99, wrong: ['x'] }, { src: 'a1x.1', wrong: 'A la escuela', due: iso(0) }, { src: 'pl.1' }, 5, 'x', { src: {} }, { src: 'a1u01d1.d1', wrong: 'again' }],
    typed: ['ñande', 5, null, 'x'.repeat(200)], placement: { comp: 'A2', prod: 'C9' }, profile: { why: ['a', 'b', 'c'], where: 'casa', understand: '3', speak: 9, work: {} },
    exposure: { week: iso(0), with: 'familia' }, cur: 'a1u01t', tp: 3.7, set: 'test',
    seen: [iso(-2), '2026-13-45', 5, null, iso(-2), 'ayer', iso(-9), { d: 1 }],
  };
  const many = { v: 1, started: true, level: 'A1', plan, typed: Array.from({ length: 20000 }, (_, i) => 'w' + i), mistakes: Array.from({ length: 3000 }, (_, i) => ({ src: 'a1u01d' + (1 + (i % 6)) + '.d' + (1 + (i % 6)), wrong: 'x', at: Date.now(), step: 0, due: iso(0) })), done: {} };
  const CASES = [
    ['not JSON', 'not json', 'Goal'],
    ['cut-off JSON', '{"started":true,"plan":{"start":"2026-11-0', 'Goal'],
    ['an array', '[]', 'Goal'],
    ['null', 'null', 'Goal'],
    ['a number', '42', 'Goal'],
    ['a string', '"hola"', 'Goal'],
    ['true', 'true', 'Goal'],
    ['an empty object', '{}', 'Goal'],
    ['every field the wrong type', JSON.stringify({ v: 1, started: 'yes', level: 5, plan: [], plans: 'x', cur: 7, done: [], tests: 'x', exams: 9, mistakes: {}, tp: 'x', set: [], placement: [], typed: 'abc', profile: 'x', exposure: [], seen: 'ayer' }), 'Goal'],
    ['a plan, the rest odd deep down', JSON.stringify(deep), 'Main'],
    ['__proto__ keys', '{"__proto__":{"started":true,"plan":{"start":"2026-01-01"}},"done":{"__proto__":{"g":3}},"constructor":{"prototype":{"x":1}},"mistakes":[{"src":"__proto__"}]}', 'Goal'],
    ['a very large save', JSON.stringify(many), 'Main'],
    ['a level not written yet (C2)', JSON.stringify({ v: 1, started: true, level: 'C2', plan }), 'Main'],
    ['a plan that starts in a month', JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(30), target: null, pace: 'fit', minutes: 15 } }), 'Main'],
    ['a target before the start', JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(0), target: iso(-10), pace: 'fit', minutes: 30 } }), 'Main'],
    ['started, its plan broken, progress kept', JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: 'x' }, done: { a1u01d1: { g: 3, k: 1, r: 1 } } }), 'Goal'],
    ['a later version (v 2)', JSON.stringify({ v: 2, started: true, level: 'A1', plan, future: { x: 1 } }), 'Main'],
  ];
  for (const [label, value, expect] of CASES) {
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'saved: ' + label);
    await page.addInitScript(([k, v]) => {
      Object.defineProperty(navigator, 'standalone', { get: () => true });
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); }
    }, [KEY, value]);
    const t0 = Date.now();
    let started = true;
    try { await go(page, ''); } catch (e) { started = false; }
    const ms = Date.now() - t0;
    const h = started ? await look(page, 'saved ' + label, { wait: 100 }) : { name: null };
    const mine = () => problems.filter((p) => p.page === 'saved: ' + label).map((p) => p.what);
    ok(started && h.name === expect && !mine().length, `saved ${label}: the app should start on ${expect} without an error`, { on: h.name, ms, problems: mine() });
    if (!started || h.name !== expect) { await ctx.close(); continue; }
    /* use it a little: on Main, every tab and the day; on Goal, the three steps to a plan */
    let used = true;
    try {
      if (expect === 'Main') {
        for (const t of ['Cuaderno', 'Examen', 'Progreso', 'Camino']) { await tap(page, { sel: `#gn-stage nav a:has-text("${t}")` }, 350); await look(page, `saved ${label}: tab ${t}`, { wait: 0, shot: label.startsWith('a plan, the rest') ? 'D-deep-' + t : null }); }
        const card = page.locator('#gn-stage a[href="Today.dc.html"]:has-text("Empezar"), #gn-stage a[href="WeekTest.dc.html"]:has-text("Empezar")');
        if (await card.count()) { await card.first().tap(); await page.waitForTimeout(500); await look(page, `saved ${label}: the card`, { wait: 0 }); }
        if (label.startsWith('a plan, the rest')) {
          await go(page, '');
          await tap(page, { sel: '#gn-stage nav a:has-text("Examen")' }, 400);
          const sitting = page.locator('#gn-stage a[href="LevelExam.dc.html"]');
          if (await sitting.count()) { await sitting.first().tap(); await page.waitForTimeout(600); await look(page, `saved ${label}: the level exam`, { wait: 0 }); }
        }
      } else {
        /* a learner with progress at some level opens the goal screen at step 3 */
        if (!(await has(page, 'Tejé el primer hilo'))) {
          await tap(page, 'Siguiente', 400);
          await tap(page, exact('Empezar en A1'), 400);
        } else pass(`saved ${label}: the goal screen opens at step 3 (the progress is known)`);
        await tap(page, 'Tejé el primer hilo', 600);
        await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 600);
        await look(page, `saved ${label}: goal set again`, { expect: 'Main', wait: 0 });
      }
    } catch (e) { used = false; ok(false, `saved ${label}: the app should stay usable`, String(e.message).split('\n')[0]); }
    /* what is saved now is clean: only the course's fields, already in the form the app reads back */
    const clean = await page.evaluate((FIELDS) => {
      let s = null;
      try { s = JSON.parse(localStorage.getItem('epua.v1:/')); } catch (e) { return { err: 'not JSON' }; }
      if (!s || typeof s !== 'object') return { err: 'nothing saved', s };
      const back = window.gnApp.start();
      const odd = Object.keys(s).filter((k) => k !== 'v' && FIELDS.indexOf(k) < 0);
      const differ = FIELDS.filter((f) => JSON.stringify(s[f] === undefined ? null : s[f]) !== JSON.stringify(back[f] === undefined ? null : back[f]));
      return { odd, differ, proto: ({}).started !== undefined || ({}).x !== undefined };
    }, FIELDS);
    ok(used && !clean.err && !clean.odd.length && !clean.differ.length && !clean.proto, `saved ${label}: after a tap the save is rewritten clean`, clean);
    if (used && !mine().length && !clean.err && !clean.odd.length && !clean.differ.length) pass(`saved ${label}: starts on ${expect} in ${ms} ms, stays usable, saved clean`);
    await ctx.close();
  }

  /* storage that throws (a browser that refuses it): the app still starts and works, it just saves nothing */
  {
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'storage throws');
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'standalone', { get: () => true });
      const no = () => { throw new DOMException('denied', 'SecurityError'); };
      Storage.prototype.getItem = no; Storage.prototype.setItem = no; Storage.prototype.removeItem = no;
    });
    await go(page, '');
    await look(page, 'storage throws', { expect: 'Goal' });
    await tap(page, 'Siguiente', 400);
    await tap(page, exact('Empezar en A1'), 400);
    await tap(page, 'Tejé el primer hilo', 600);
    await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 600);
    await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 400);
    const p = problems.filter((x) => x.page === 'storage throws');
    check((await screenOf(page)) === 'Notebook' && !p.length, 'storage that throws: the app starts on Goal, a plan can be made and the tabs work, with no error', p);
    /* nothing can be kept: does the learner hear of it anywhere (the goal screen, the path, the notebook)? */
    const saying = await page.evaluate(() => window.gnApp.saving());
    const told = /no se guarda|no se puede guardar|sin guardar|no queda guardado|no se va a guardar/i.test(await text(page));
    await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 400);
    const toldMain = /no se guarda|no se puede guardar|sin guardar|no queda guardado|no se va a guardar/i.test(await text(page));
    ok(told || toldMain, 'storage that throws: the learner should be told that progress is not being kept on this device', { gnAppSaving: saying, main: (await text(page)).slice(0, 160) });
    await ctx.close();
  }
  /* another copy of the app on the same site keeps its own save */
  {
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'other copy');
    await page.addInitScript((v) => { Object.defineProperty(navigator, 'standalone', { get: () => true }); localStorage.setItem('epua.v1:/otra/', v); }, JSON.stringify({ v: 1, started: true, level: 'A1', plan }));
    await go(page, '');
    check((await screenOf(page)) === 'Goal', 'a save of another copy (epua.v1:/otra/) is not read by this one', await screenOf(page));
    await ctx.close();
  }
}

/* ---------- H: the last written week, to its end ---------- */
async function partH(browser) {
  part = 'H1 the week before the last written one';
  const ctx = await phone(browser);
  const page = await newPage(ctx, 'learner H');
  await page.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  await go(page, '');
  /* the written weeks, as the course has them today (the suite is not tied to four) */
  const W = await page.evaluate(() => { const C = window.gnCourse; C.setLevel('A1'); return { units: C.units().length, last: C.sessions().filter((s) => s.ready).reduce((n, s) => Math.max(n, s.unit), 0) }; });
  if (W.last < 2) { pass('only one week is written: nothing more to check here'); await ctx.close(); return; }
  const n = W.last;
  const sid = (u, d) => 'a1u' + String(u).padStart(2, '0') + (d === 't' ? 't' : 'd' + d);
  const full = { g: 3, ks: 1, kw: 1, k: 1, r: 1 };
  const result = (u) => ({ id: sid(u, 't'), score: 18, of: 20, used: 640, areas: { vocab: { right: 5, of: 6 }, grammar: { right: 7, of: 8 }, reading: { right: 3, of: 3 }, listening: { right: 3, of: 3 } }, at: Date.now() - 2 * DAY });
  /* a learner with every week before the last whole, and the last week's five study days done: its review day and its
     test are still to do. Every word the weeks asked to write is in `typed`, as after doing them */
  const seed = await page.evaluate(([n, fullJ]) => {
    const C = window.gnCourse;
    const full = JSON.parse(fullJ);
    const done = {};
    const typed = [];
    C.sessions().forEach((s) => {
      if (!s.ready || s.kind === 'test' || s.unit > n || (s.unit === n && s.day === 6)) return;
      done[s.id] = full;
      const w = C.day(s.id).words;
      (w.spell || []).forEach((id) => { const x = w.words.filter((y) => y.id === id)[0]; if (x && typed.indexOf(x.gn) < 0) typed.push(x.gn); });
    });
    return { done, typed, start: C.addDays(C.today(C.now()), -7 * n) };
  }, [n, JSON.stringify(full)]);
  const tests = {};
  for (let u = 1; u < n; u++) tests[sid(u, 't')] = result(u);
  const plan = { start: seed.start, target: null, pace: 'fit', minutes: 30 };
  /* the week before, opened as its test's result (the ?gntest hook: the path shows one week, and this one is behind):
     that week is whole and the next is written, so the button leads on to it */
  const hook = (screen, cur) => '?gntest&screen=' + screen + '&level=A1&plan=' + encodeURIComponent(JSON.stringify(plan)) + '&done=' + encodeURIComponent(JSON.stringify(seed.done)) + '&tests=' + encodeURIComponent(JSON.stringify(tests)) + (cur ? '&cur=' + cur : '');
  await go(page, hook('WeekTest', sid(n - 1, 't')));
  let h = await look(page, 'week ' + (n - 1) + "'s test result", { expect: 'WeekTest', how: 'hook' });
  const before = ((await page.locator('#gn-stage a[href="Main.dc.html"]').last().textContent()) || '').trim();
  check(before === 'A la semana ' + n, `with week ${n - 1} whole and week ${n} written, its test's button reads «A la semana ${n}»`, before);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("A la semana")' }, 600);
  check(await has(page, 'Semana ' + n + ' de ' + W.units), `«A la semana ${n}» lands on week ${n}'s path`, (await text(page)).slice(0, 120));

  part = 'H2 the last written week: its review day';
  /* the same learner as saved progress, opened from the Home Screen */
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, started: true, level: 'A1', plan, plans: {}, cur: null, done: seed.done, tests, exams: {}, mistakes: [], tp: 0, set: 'day', placement: null, typed: seed.typed, profile: null, exposure: null })]);
  await go(page, '');
  h = await look(page, 'the last written week', { expect: 'Main', shot: 'H01-main-last-week' });
  const D6 = sid(n, 6);
  check(await has(page, 'Semana ' + n + ' de ' + W.units) && (await page.locator('#gn-stage a[aria-label^="Día 6"]').count()) === 1 && await has(page, 'Repaso de la semana'), `the app opens on week ${n}, its review day next`, h.head);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
  h = await look(page, 'Main → day 6', { expect: 'Today' });
  check(await has(page, 'Semana ' + n + ' · Día 6'), 'the card opens the review day', h.head);
  await tap(page, 'Empezar con el repaso', 700);
  h = await look(page, 'Today → Compare', { expect: 'Compare', shot: 'H02-compare' });
  const cmp = await page.evaluate((id) => { const C = window.gnCourse; const it = C.day(id).grammar.compare.check; return { answer: it.answer, options: it.options.map((o) => C.plain(o)) }; }, D6);
  await tap(page, exact(cmp.options[cmp.answer % cmp.options.length]), 350);
  await tap(page, exact(cmp.options[cmp.answer - 1]), 350);
  await tap(page, 'A la práctica', 700);
  h = await look(page, 'Compare → Drill', { expect: 'Drill' });
  /* the drill: after every answer the sheet's button is whole and above the strip kept for the home indicator, however
     long the reasons are (they scroll inside the sheet) */
  const drill = await itemsOf(page, await page.evaluate((id) => window.gnCourse.day(id).grammar.drill, D6));
  const low = [];
  for (let i = 0; i < drill.length; i++) {
    await answerOne(page, drill[i], i % 2 === 1);
    await tap(page, 'Respondé', 500);
    const b = await page.evaluate(() => { const a = [...document.querySelectorAll('#gn-stage a[href="Today.dc.html"]')].filter((x) => /Siguiente|Terminar la práctica/.test(x.textContent)).pop(); const r = a && a.getBoundingClientRect(); return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom), label: a.textContent.trim() } : null; });
    if (!b || b.bottom > 844 - 34 + 1 || b.top < 0) low.push({ item: drill[i].id, button: b });
    if (i === 0) await shot(page, 'H03-drill-wrong');
    await tap(page, i < drill.length - 1 ? 'Siguiente' : 'Terminar la práctica', 550);
  }
  check(low.length === 0, `drill of ${D6}: after each of the ${drill.length} answers the button to go on is in view, above the bottom 34 px`, low);
  h = await look(page, 'end of drill', { expect: 'Today' });
  await tap(page, exact('Al examen'), 700);
  const exam = await itemsOf(page, await page.evaluate((id) => window.gnCourse.day(id).grammar.exam, D6));
  for (let i = 0; i < exam.length; i++) {
    await answerOne(page, exam[i], true);
    await tap(page, i < exam.length - 1 ? 'Siguiente' : exact('Terminar'), 500);
  }
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  let s = await saved(page);
  check(s.done[D6] && s.done[D6].g === 3, 'the review day\'s grammar lesson is saved done (g 3)', s.done[D6]);
  /* the words: the sound step, the scene, then the week's words written again (they were typed on their own days) */
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 700);
  h = await look(page, 'Today → Words', { expect: 'Words', shot: 'H04-words-sound' });
  const pairs = await page.evaluate((id) => ((window.gnCourse.day(id).words.sound || {}).pairs || []).length, D6);
  for (let i = 0; i < pairs; i++) {
    await tap(page, { sel: `#gn-stage button[aria-label="Escuchar la palabra del par ${i + 1}"]` }, 300);
    await tap(page, { sel: `xpath=//*[@id="gn-stage"]//button[@aria-label="Escuchar la palabra del par ${i + 1}"]/following-sibling::div[1]//button[1]` }, 350);
  }
  await tap(page, 'Siguiente: las palabras', 600);
  const list = await spellList(page, D6);
  const again = list.filter((w) => seed.typed.includes(w.gn)).length;
  check(again > 0 && await has(page, 'Después vas a escribir de nuevo ' + (list.length === 1 ? '1 palabra' : list.length + ' palabras') + ' de la semana'), `the review day asks for its ${list.length} words again (${again} of them were written on their own days)`, (await text(page)).slice(-260));
  await shot(page, 'H05-words-scene');
  await tap(page, 'Siguiente: escribir', 700);
  for (let k = 0; k < list.length; k++) {
    if (k === 0) check(await has(page, '1 / ' + list.length) && await has(page, list[0].gn), 'the writing step opens on the first of them', (await text(page)).slice(0, 200));
    await spellOne(page, list[k]);
    await tap(page, k < list.length - 1 ? 'Siguiente:' : 'Siguiente: la pregunta', 600);
  }
  s = await saved(page);
  check(s.done[D6].kw === 1 && s.typed.length === seed.typed.length + list.length - again, 'the words written again save the writing step (kw 1); no word is kept twice', { done: s.done[D6], typed: s.typed.length });
  const kc = await page.evaluate((id) => { const C = window.gnCourse; const it = C.day(id).words.check; return { answer: it.answer, options: it.options.map((o) => C.plain(o)) }; }, D6);
  await tap(page, exact(kc.answer + ' ' + kc.options[kc.answer - 1]), 500);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  /* opened again, the review's words are not asked a third time */
  await tap(page, { sel: '#gn-stage a[href="Words.dc.html"]' }, 700);
  await tap(page, 'Siguiente: las palabras', 500);
  check(await has(page, 'Ya escribiste todas las palabras de esta escena'), 'the review day\'s words lesson opened again asks for none', (await text(page)).slice(-220));
  await tap(page, { aria: 'Cerrar la lección' }, 600);
  /* the reading or listening */
  const skill = await page.evaluate((id) => { const C = window.gnCourse; const k = C.day(id).skill; return { kind: k.kind, id: k.item.id, answer: k.item.answer, options: k.item.options.map((o) => C.plain(o)) }; }, D6);
  if (skill.kind === 'listening') {
    await tap(page, { sel: '#gn-stage a[href="Listening.dc.html"]' }, 700);
    await tap(page, { aria: 'Reproducir el audio' }, 300);
    await page.waitForFunction(() => { const b = document.querySelector('#gn-stage button[aria-label^="Respuesta 1"]'); return b && !/escuchá primero/.test(b.getAttribute('aria-label')); }, null, { timeout: 90000 });
    await tap(page, { sel: `#gn-stage button[aria-label^="Respuesta ${skill.answer}"]` }, 600);
  } else {
    await tap(page, { sel: '#gn-stage a[href="Reading.dc.html"]' }, 700);
    h = await look(page, 'Today → Reading', { expect: 'Reading', shot: 'H06-reading' });
    await answerOne(page, { kind: 'choice', answer: skill.answer, options: skill.options }, true);
    await tap(page, 'Respondé', 500);
  }
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Siguiente")' }, 700);
  h = await look(page, 'skill → Today', { expect: 'Today', shot: 'H07-today-sealed' });
  check(await has(page, '¡Día 6 completo!'), 'with its three lessons done the review day is sealed', (await text(page)).slice(-200));
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Volver")' }, 700);

  part = 'H3 the last written week: its test, and after it';
  h = await look(page, 'Today → Main', { expect: 'Main' });
  check(await has(page, 'PRUEBA'), 'with the six days stamped the path offers the week test', h.head);
  await tap(page, { sel: '#gn-stage a[href="WeekTest.dc.html"]:has-text("Empezar")' }, 700);
  await tap(page, 'Empezar la prueba', 800);
  const items = await itemsOf(page, await page.evaluate((u) => window.gnCourse.unit(u).test, n));
  const hidden = [];
  for (let i = 0; i < items.length; i++) {
    /* a question opens with its answers in view: none under the button (the clock is running) */
    const under = await page.evaluate(() => { const sc = [...document.querySelectorAll('#gn-stage div')].filter((d) => /auto/.test(getComputedStyle(d).overflowY))[0]; return sc ? sc.scrollHeight - sc.clientHeight : 0; });
    if (items[i].kind === 'choice' && under > 1) hidden.push(items[i].id + ': ' + under + ' px');
    await answerOne(page, items[i], i !== 3 && i !== 11);
    await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 350);
  }
  check(hidden.length === 0, `week ${n}'s test: each of its choice questions opens with every answer in view`, hidden);
  await tap(page, { sel: '#gn-stage a[href="WeekTest.dc.html"]' }, 800);
  h = await look(page, 'the last week\'s test result', { expect: 'WeekTest', shot: 'H08-weektest-result' });
  s = await saved(page);
  check(s.tests[sid(n, 't')] && s.tests[sid(n, 't')].score === items.length - 2 && await has(page, '¡Semana ' + n + ' completa!'), `week ${n}'s test is saved (${items.length - 2} of ${items.length}) and the week is whole`, s.tests[sid(n, 't')]);
  const onward = ((await page.locator('#gn-stage a[href="Main.dc.html"]').last().textContent()) || '').trim();
  check(/Volver/.test(onward) && !/A la semana/.test(onward), `after the last written week the button offers no week that is not written (it reads «${onward}»)`, onward);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Volver")' }, 700);
  /* the learner stays on the last week done; the callout names the week after it, the only one not written */
  const waits = (t) => (t.match(/La semana (\d+) se abre cuando esté escrita/) || [])[1];
  const atEnd = async (label) => {
    const t = await text(page);
    const here = (t.match(/Semana (\d+) de \d+/) || [])[1];
    check(here === String(n) && t.includes('SEMANA ' + n + ' · COMPLETA'), `${label}: the path shows week ${n}, the last one done, complete`, t.slice(0, 200));
    if (n < W.units) check(waits(t) === String(n + 1), `${label}: the only week said to be waiting to be written is week ${n + 1}`, t.slice(0, 260));
    else check(!waits(t), `${label}: no week is said to be waiting to be written`, t.slice(0, 260));
  };
  h = await look(page, 'after the last written week', { expect: 'Main', shot: 'H09-main-after' });
  await atEnd('after the test');
  s = await saved(page);
  check(s.cur === null && Object.keys(s.tests).length === n, 'saved: no session in use, and the ' + n + ' week tests', { cur: s.cur, tests: Object.keys(s.tests) });
  await reload(page);
  await atEnd('reopened');
  check((await page.locator('#gn-stage a[aria-label$="sellado. Abrilo de nuevo"]').count()) === 6 && (await page.locator('#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]').count()) === 1, 'reopened: the six days and the test of that week can be opened again from the path');
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  check(await has(page, 'Unidad ' + n + ' de ' + W.units), `Progreso says «Unidad ${n} de ${W.units}»`, (await text(page)).slice(0, 160));
  await shot(page, 'H10-progress-after');
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { aria: 'Nivel A1, cambiar de nivel' }, 600);
  check(await has(page, 'Tu nivel · ' + 7 * n + ' de ' + 7 * W.units + ' sesiones · Semana ' + n), `Niveles says «Tu nivel · ${7 * n} de ${7 * W.units} sesiones · Semana ${n}»`, (await text(page)).match(/Tu nivel[^A-Z]*/));
  await tap(page, { aria: 'Volver al camino de la semana' }, 600);
  /* a lesson screen opened from Progreso (no day picked on the path) still has a day to show: the last one written */
  await go(page, '');
  await tap(page, { sel: '#gn-stage a[aria-label="Día 6, sellado. Abrilo de nuevo"]' }, 600);
  check(await has(page, 'Semana ' + n + ' · Día 6'), 'a stamped day of the last week opens again from the path', (await text(page)).slice(0, 80));
  await ctx.close();
}

/* ---------- I: home and motivation ----------
   The review that waits is put in front of the day (the tab bars' count, the week path's and the day's row, the review's
   way on to the day); a sitting has a size and the notebook holds a due answer back; the door back to the plan (the date
   chip, Progreso's «Rearmar mi plan», the goal screen's «Guardar el plan»); the days with study and the return after
   days away; practice where the written path ends, and the first mini exam. Learners are seeded as saved progress and
   opened from the Home Screen. */
async function partI(browser) {
  const iso = (n) => { const d = new Date(Date.now() + n * DAY); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const full = { g: 3, ks: 1, kw: 1, k: 1, r: 1 };
  const days = (unit, upTo) => { const d = {}; for (let k = 1; k <= upTo; k++) d['a1u0' + unit + 'd' + k] = full; return d; };
  const m = (src, o) => Object.assign({ src, wrong: 'x', at: Date.now() - DAY, step: 0, due: iso(0) }, o || {});
  const result = (id) => ({ id, score: 18, of: 20, used: 640, areas: { vocab: { right: 5, of: 6 }, grammar: { right: 7, of: 8 }, reading: { right: 3, of: 3 }, listening: { right: 3, of: 3 } }, at: Date.now() - 2 * DAY });
  const learner = async (label, state) => {
    const ctx = await phone(browser);
    const page = await newPage(ctx, label);
    await page.addInitScript(([k, v]) => {
      Object.defineProperty(navigator, 'standalone', { get: () => true });
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); }
    }, [KEY, JSON.stringify(Object.assign({ v: 1, started: true, level: 'A1' }, state))]);
    await go(page, '');
    return { ctx, page };
  };
  const tabLabel = (page) => page.locator('#gn-stage nav a[href="Notebook.dc.html"]').getAttribute('aria-label');
  const toTab = (page, name) => tap(page, { sel: `#gn-stage nav a:has-text("${name}")` }, 500);
  /* every item of a review sitting answered right, to its summary */
  const reviewAll = async (page, ids) => {
    const list = await itemsOf(page, ids);
    for (let i = 0; i < list.length; i++) {
      await answerOne(page, list[i], true, true);
      if (list[i].kind === 'build') await tap(page, 'Comprobar', 400);
      await page.waitForTimeout(250);
      await tap(page, i < list.length - 1 ? 'Siguiente' : 'Listo', 450);
    }
  };

  part = 'I1 the review in front of the day';
  {
    const due = ['a1u01d3.d1', 'a1u01d2.d1', 'a1u01d1.d1'];
    const { ctx, page } = await learner('review first', { plan: { start: iso(-3), target: iso(60), pace: 'fit', minutes: 30 }, done: days(1, 3), mistakes: due.map((id) => m(id)), seen: [iso(-3), iso(-2), iso(-1)] });
    let h = await look(page, 'Main with a review due', { expect: 'Main', shot: 'I01-main-due' });
    const marks = [];
    for (const t of ['Camino', 'Examen', 'Progreso', 'Cuaderno']) { await toTab(page, t); marks.push(await tabLabel(page)); await look(page, 'tab ' + t + ' with a review due', { wait: 0 }); }
    check(marks.every((x) => x === 'Cuaderno, 3 para repasar hoy'), 'the Cuaderno tab says «3 para repasar hoy» on the four tab bars', marks);
    check(await has(page, 'Para repasar hoy') && (await page.locator('#gn-stage svg[aria-label="Respuesta correcta"]').count()) === 0 && (await text(page)).split('la respuesta, al repasar').length - 1 === 3, 'Notebook: an entry due today keeps what was answered and holds its right answer back', (await text(page)).slice(0, 400));
    await toTab(page, 'Camino');
    check(await has(page, 'Antes de empezar · 2 min') && await has(page, '3 para repasar'), 'Main: the callout puts the review in front of the day, with what it takes', (await text(page)).slice(0, 400));
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
    h = await look(page, 'Today with a review due', { expect: 'Today', shot: 'I02-today-due' });
    check(await has(page, 'Antes de empezar') && await has(page, '3 para repasar · unos 2 min'), 'Today: the same row stands above the three lessons', (await text(page)).slice(0, 300));
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    h = await look(page, 'Today → Review', { expect: 'Review', shot: 'I03-review' });
    const list = await itemsOf(page, due);
    const shown = await page.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => (b.textContent || '').trim().replace(/^\d+\s*/, '')));
    check(await has(page, '1 / 3') && shown.slice().sort().join('|') === list[0].options.slice().sort().join('|') && shown.join('|') !== list[0].options.join('|'), 'Review: the question has its options in another order than the lesson had them', { lesson: list[0].options, shown });
    const numbers = await page.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => (b.textContent || '').trim().match(/^\d+/)[0]).join(''));
    check(numbers === list[0].options.map((_, k) => k + 1).join(''), 'Review: the buttons are numbered in the order shown', numbers);
    await reviewAll(page, due);
    h = await look(page, 'review summary', { expect: 'Review', shot: 'I04-review-done' });
    check(await has(page, 'Repaso terminado') && await has(page, 'Seguir con el día 4') && await has(page, 'Volver al cuaderno'), 'the review ends with the way on to the day, and the way back to the notebook', (await text(page)).slice(0, 300));
    await tap(page, 'Seguir con el día 4', 700);
    h = await look(page, 'Review → Today', { expect: 'Today' });
    check(await has(page, 'Semana 1 · Día 4') && !(await has(page, 'para repasar')) && await has(page, 'Aprendé la regla'), '«Seguir con el día 4» opens day 4, with nothing left to review', h.head);
    const s = await saved(page);
    check(s.mistakes.every((x) => x.step === 1 && x.due === iso(3)) && s.cur === 'a1u01d4' && s.seen.join() === [iso(-3), iso(-2), iso(-1), iso(0)].join(), 'saved: the three answers moved on, day 4 is the day in use, and today is a day with study', { m: s.mistakes.map((x) => [x.step, x.due]), cur: s.cur, seen: s.seen });
    await tap(page, { aria: 'Volver al camino de la semana' }, 600);
    check((await tabLabel(page)) === 'Cuaderno' && !(await has(page, 'Antes de empezar')), 'Main after the review: no count on the tab, no row on the callout', (await text(page)).slice(0, 300));
    await ctx.close();
  }

  part = 'I2 a sitting has a size';
  {
    /* 20 mistakes due for days, the plan at 15 minutes a day: a sitting is 8 (a third of the day at 0.6 min a question) */
    const ids = [];
    for (let d = 1; d <= 5; d++) for (let k = 1; k <= 4; k++) ids.push('a1u01d' + d + '.d' + k);
    const { ctx, page } = await learner('sitting', { plan: { start: iso(-12), target: null, pace: 'fit', minutes: 15 }, done: days(1, 5), mistakes: ids.map((id, k) => m(id, { at: Date.now() - (10 + k) * DAY, due: iso(-9) })), seen: [iso(-1)] });
    let h = await look(page, 'Main with 20 due', { expect: 'Main' });
    check((await tabLabel(page)) === 'Cuaderno, 8 para repasar hoy' && await has(page, '8 para repasar') && await has(page, 'Antes de empezar · 5 min'), 'with 20 due and 15 minutes a day, the week path asks for 8 (about 5 minutes)', (await text(page)).slice(0, 400));
    await toTab(page, 'Cuaderno');
    h = await look(page, 'Notebook with 20 due', { expect: 'Notebook', shot: 'I05-notebook-sitting' });
    check(await has(page, '8 preguntas · unos 5 min') && await has(page, 'Hay 20 esperando. Hoy van las 8 más viejas; las otras 12 quedan para los próximos días.') && await has(page, 'En el cuaderno · 20'), 'Notebook: 8 for today of the 20 that wait, and it says so', (await text(page)).slice(0, 400));
    await tap(page, 'Repasar ahora', 700);
    h = await look(page, 'Notebook → Review', { expect: 'Review' });
    check(await has(page, '1 / 8'), 'Review: the sitting is 8 questions', (await text(page)).slice(0, 120));
    /* the oldest go first: the eight made longest ago, asked in the notebook's own order */
    await reviewAll(page, ids.slice(12));
    h = await look(page, 'sitting summary', { expect: 'Review', shot: 'I06-review-sitting-done' });
    check(await has(page, 'Repasaste las 8 preguntas de hoy. Quedan 12 para los próximos días.'), 'the summary says what was reviewed and what waits', (await text(page)).slice(0, 300));
    const s = await saved(page);
    const moved = s.mistakes.filter((x) => x.step === 1).map((x) => x.src).sort().join();
    check(moved === ids.slice(12).sort().join() && s.mistakes.filter((x) => x.due <= iso(0)).length === 12, 'saved: the 8 oldest moved on, the other 12 stay due', { moved, due: s.mistakes.filter((x) => x.due <= iso(0)).length });
    await tap(page, 'Volver al cuaderno', 600);
    h = await look(page, 'Notebook after the sitting', { expect: 'Notebook', shot: 'I07-notebook-sitting-done' });
    check(await has(page, 'listo por hoy') && await has(page, 'Quedan 12 para los próximos días.') && await has(page, 'Repasar 8 más') && (await tabLabel(page)) === 'Cuaderno', 'Notebook: the day\'s sitting is done, 12 wait, and more is on offer, not asked for', (await text(page)).slice(0, 300));
    check((await page.locator('#gn-stage svg[aria-label="Respuesta correcta"]').count()) === 8, 'Notebook: the 8 reviewed show their right answers again', await page.locator('#gn-stage svg[aria-label="Respuesta correcta"]').count());
    await toTab(page, 'Camino');
    check(!(await has(page, 'para repasar')), 'Main: nothing more is asked today', (await text(page)).slice(0, 300));
    await toTab(page, 'Cuaderno');
    await tap(page, 'Repasar 8 más', 700);
    check((await screenOf(page)) === 'Review' && await has(page, '1 / 8'), '«Repasar 8 más» opens one more sitting', (await text(page)).slice(0, 120));
    await ctx.close();
  }

  part = 'I3 the door back to the plan';
  {
    /* 20 days into a 60-day plan with 8 sessions done: behind */
    const state = { plan: { start: iso(-20), target: iso(40), pace: 'fit', minutes: 30 }, done: Object.assign(days(1, 6), { a1u02d1: full }), tests: { a1u01t: result('a1u01t') }, seen: [iso(-1)] };
    const { ctx, page } = await learner('replan', state);
    let h = await look(page, 'Main behind the plan', { expect: 'Main', shot: 'I08-main-behind' });
    const chip = page.locator('#gn-stage a[href="GoalPlan.dc.html"]');
    check((await chip.count()) === 1 && (await chip.getAttribute('aria-label')) === 'Faltan 40 días para tu fecha meta. Cambiar el plan', 'Main: the date chip is a link back to the plan', await chip.count());
    const before = await saved(page);
    await chip.tap();
    await page.waitForTimeout(600);
    h = await look(page, 'chip → Goal', { expect: 'Goal', shot: 'I09-goal-replan' });
    check(await has(page, 'Te quedan 48 de 56 sesiones') && await has(page, 'Guardar el plan') && await has(page, 'Cancelar') && await has(page, 'El plan se arma de nuevo desde hoy') && !(await has(page, 'Tejé el primer hilo')) && !(await has(page, 'Ñepyrũ · Empezar')), 'the goal screen opens at its third step on the plan that exists: what is left, «Guardar el plan», «Cancelar»', (await text(page)).slice(0, 500));
    await tap(page, 'Cancelar', 600);
    check((await screenOf(page)) === 'Main' && JSON.stringify((await saved(page)).plan) === JSON.stringify(before.plan), '«Cancelar» goes back to the week path and leaves the plan as it was', (await saved(page)).plan);
    await toTab(page, 'Progreso');
    h = await look(page, 'Progress behind the plan', { expect: 'Progress', shot: 'I10-progress-behind' });
    check(await has(page, 'días atrás') && await has(page, 'Rearmar mi plan') && await has(page, "Epu'ã ha eñepyrũjey"), 'Progreso: behind the plan, it offers to make the plan again', (await text(page)).slice(0, 300));
    await tap(page, 'Rearmar mi plan', 600);
    check((await screenOf(page)) === 'Goal' && await has(page, 'Guardar el plan'), '«Rearmar mi plan» opens the goal screen at the plan', await screenOf(page));
    await tap(page, 'Guardar el plan', 700);
    h = await look(page, 'plan made again', { expect: 'Main', shot: 'I11-main-replanned' });
    let s = await saved(page);
    check(s.plan.start === iso(0) && s.plan.from === 8 && s.plan.target === iso(40) && s.plan.minutes === 30 && JSON.stringify(s.done) === JSON.stringify(before.done) && JSON.stringify(s.tests) === JSON.stringify(before.tests), 'saved: the plan starts today at the ninth session (from 8), the date and the progress as they were', s.plan);
    check(await has(page, 'HOY · 3 LECCIONES') && (await page.locator('#gn-stage a[aria-label="Día 2, hoy. Abrí el día"]').count()) === 1, 'Main: the next day is today\'s again', (await text(page)).slice(0, 300));
    await toTab(page, 'Progreso');
    check(await has(page, 'Vas al día') && !(await has(page, 'Rearmar mi plan')), 'Progreso: on time again, and the offer is gone', (await text(page)).slice(0, 200));
    await reload(page);
    s = await saved(page);
    check(s.plan.from === 8 && await has(page, 'HOY · 3 LECCIONES'), 'reopened: the plan made again is kept', s.plan);
    await ctx.close();
  }
  {
    const { ctx, page } = await learner('no date', { plan: { start: iso(-2), target: null, pace: 'fit', minutes: 30 }, done: days(1, 2), seen: [iso(-2), iso(-1)] });
    const chip = page.locator('#gn-stage a[href="GoalPlan.dc.html"]');
    check((await chip.textContent()).trim() === 'a tu ritmo' && (await chip.getAttribute('aria-label')) === 'Vas a tu ritmo, sin fecha meta. Cambiar el plan', 'Main: with no date the chip says «a tu ritmo», and is the same door', await chip.textContent());
    await chip.tap();
    await page.waitForTimeout(600);
    check((await screenOf(page)) === 'Goal' && await has(page, 'Te quedan 54 de 56 sesiones') && await has(page, 'Guardar el plan'), 'it opens the goal screen at the plan', (await text(page)).slice(0, 300));
    await ctx.close();
  }

  part = 'I4 the days with study and the return';
  {
    /* four days with study, the last one five days ago, two mistakes due */
    const state = { plan: { start: iso(-9), target: null, pace: 'fit', minutes: 30 }, done: days(1, 4), mistakes: [m('a1u01d3.d1'), m('a1u01d2.d1')], seen: [iso(-9), iso(-8), iso(-6), iso(-5)] };
    const { ctx, page } = await learner('back after days', state);
    let h = await look(page, 'Main after five days away', { expect: 'Main', shot: 'I12-main-back' });
    const strip = () => page.locator('#gn-stage [aria-label^="Tus últimos 7 días"]').getAttribute('aria-label');
    const risen = () => page.locator('#gn-stage svg[aria-label^="Kaguare se levantó"]').count();
    check(await has(page, '¡Volviste!') && await has(page, "Opu'ã · Se levantó") && await has(page, 'Empezá con algo corto: 2 para repasar, un minuto.') && await has(page, 'Seguir con el día 5') && (await risen()) === 1, 'Main greets the learner back: Opu\'ã, Kaguare up on his hind legs, something short first, then the day', (await text(page)).slice(0, 400));
    check((await strip()) === 'Tus últimos 7 días: 2 días con estudio. Hoy todavía no.', 'Main: the last seven days say what they were', await strip());
    const before = await saved(page);
    await toTab(page, 'Progreso');
    check(await has(page, '4 días con estudio · volviste una vez'), 'Progreso counts the days with study and the returns', (await text(page)).slice(0, 200));
    await toTab(page, 'Camino');
    check(JSON.stringify((await saved(page)).seen) === JSON.stringify(before.seen), 'looking around is not study: no day is added for it', (await saved(page)).seen);
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]:has-text("Repasar")' }, 700);
    h = await look(page, 'the greeting → Review', { expect: 'Review' });
    const one = (await itemsOf(page, ['a1u01d3.d1']))[0];
    await answerOne(page, one, true, true);
    await page.waitForTimeout(300);
    let s = await saved(page);
    check(s.seen.join() === state.seen.concat([iso(0)]).join(), 'saved: the first answer makes today a day with study', s.seen);
    await tap(page, { aria: 'Salir del repaso' }, 600);
    await toTab(page, 'Camino');
    h = await look(page, 'Main on the day of return', { expect: 'Main', shot: 'I13-main-returned' });
    check(!(await has(page, '¡Volviste!')) && (await risen()) === 1 && (await strip()) === 'Tus últimos 7 días: 3 días con estudio. Hoy volviste.', 'Main, once something is done: the day is back, today carries the mark of the return, Kaguare stays up', await strip());
    await toTab(page, 'Progreso');
    check(await has(page, '5 días con estudio · volviste 2 veces'), 'Progreso: one more day, one more return', (await text(page)).slice(0, 200));
    await reload(page);
    check((await saved(page)).seen.length === 5 && (await risen()) === 1, 'reopened: the days are kept', (await saved(page)).seen);
    await ctx.close();
  }
  {
    /* more than a week away, with a week sealed: its review day is the short thing on offer */
    const { ctx, page } = await learner('back after a week', { plan: { start: iso(-20), target: null, pace: 'fit', minutes: 30 }, done: Object.assign(days(1, 6), { a1u02d1: full }), tests: { a1u01t: result('a1u01t') }, seen: [iso(-12), iso(-11), iso(-10)] });
    let h = await look(page, 'Main after ten days away', { expect: 'Main', shot: 'I14-main-back-week' });
    check(await has(page, '¡Volviste!') && await has(page, 'Repasar la semana 1') && await has(page, 'Seguir con el día 2'), 'after a week or more away, the last review day sealed is offered before the next new day', (await text(page)).slice(0, 400));
    await tap(page, 'Repasar la semana 1', 700);
    h = await look(page, 'the greeting → week 1\'s review day', { expect: 'Today' });
    check(await has(page, 'Semana 1 · Día 6') && await has(page, 'DÍA SELLADO'), '«Repasar la semana 1» opens that week\'s review day, sealed as it was', h.head);
    await ctx.close();
  }
  {
    /* a save from before the app kept the days: nothing is claimed, nobody is greeted back, and the record starts */
    const { ctx, page } = await learner('no days kept', { plan: { start: iso(-30), target: null, pace: 'fit', minutes: 30 }, done: days(1, 3) });
    const strip = await page.locator('#gn-stage [aria-label^="Tus últimos 7 días"]').getAttribute('aria-label');
    check(!(await has(page, '¡Volviste!')) && strip === 'Tus últimos 7 días: 0 días con estudio. Hoy todavía no.' && (await page.locator('#gn-stage svg[aria-label^="Kaguare con el ñandutí"]').count()) === 1, 'a save with no days kept loads as before: the usual callout, Kaguare standing', strip);
    await ctx.close();
  }

  part = 'I5 where the written path ends';
  {
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'end of the path');
    await page.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
    await go(page, '');
    /* every written session done, as the course has them today */
    const W = await page.evaluate((fullJ) => {
      const C = window.gnCourse;
      C.setLevel('A1');
      const done = {};
      const tests = [];
      C.sessions().forEach((s) => { if (!s.ready) return; if (s.kind === 'test') tests.push(s.id); else done[s.id] = JSON.parse(fullJ); });
      const minis = C.minis('A1').map((x) => ({ id: x.id, n: x.n, after: x.after, ready: x.ready, items: x.items }));
      return { done, tests, minis, last: C.sessions().filter((s) => s.ready).reduce((n, s) => Math.max(n, s.unit), 0), units: C.units().length };
    }, JSON.stringify(full));
    const tests = {};
    W.tests.forEach((id) => { tests[id] = result(id); });
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(-7 * W.last), target: null, pace: 'fit', minutes: 30 }, done: W.done, tests, seen: [iso(-6)] })]);
    await go(page, '');
    let h = await look(page, 'Main at the end of the written path', { expect: 'Main', shot: 'I15-main-end' });
    const links = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-labelledby="mientras-tanto"] a')].map((a) => a.getAttribute('href')));
    check(await has(page, 'MIENTRAS TANTO') && links.join() === 'Notebook.dc.html,Leer.dc.html,Escribir.dc.html,Hablar.dc.html', 'Main, with every written session done: the card leads to the notebook and to Leer, Escribir and Hablar', links);
    check(await has(page, '¡Volviste!') && await has(page, "Opu'ã · Se levantó") && (await page.locator('#gn-stage svg[aria-label^="Kaguare se levantó"]').count()) === 1, 'back after six days with no day left to do: the same greeting stands over those links', (await text(page)).slice(0, 400));
    await tap(page, { sel: '#gn-stage [aria-labelledby="mientras-tanto"] a[href="Leer.dc.html"]' }, 700);
    h = await look(page, 'Main → Leer', { expect: 'Leer' });
    check((await saved(page)).seen.join() === [iso(-6), iso(0)].join(), 'opening a practice section makes today a day with study', (await saved(page)).seen);
    await go(page, '');
    await tap(page, { sel: '#gn-stage a[aria-label="Día 6, sellado. Abrilo de nuevo"]' }, 600);
    h = await look(page, 'a sealed day', { expect: 'Today', shot: 'I16-today-sealed' });
    const more = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-labelledby="un-rato-mas"] a')].map((a) => a.getAttribute('href')));
    check(await has(page, '¿Un rato más?') && more.join() === 'Leer.dc.html,Escribir.dc.html,Hablar.dc.html', 'a sealed day offers a little more: Leer, Escribir, Hablar', more);
    await tap(page, { sel: '#gn-stage [aria-labelledby="un-rato-mas"] a[href="Hablar.dc.html"]' }, 700);
    h = await look(page, 'Today → Hablar', { expect: 'Hablar' });

    part = 'I6 the first mini exam';
    const mini = W.minis[0];
    await go(page, '');
    await toTab(page, 'Examen');
    h = await look(page, 'ExamTab with the mini exam open', { expect: 'ExamTab', shot: 'I17-examtab-mini' });
    check(mini.ready && mini.items.length === 20 && await has(page, 'Mini examen 1') && await has(page, '20 preguntas de las semanas 1 a ' + mini.after + ' · 20 min') && (await page.locator('#gn-stage a[aria-label="Empezar el mini examen 1"]').count()) === 1, 'the Examen tab opens the first mini exam once its last week test is done', (await text(page)).slice(-500));
    await tap(page, { aria: 'Empezar el mini examen 1' }, 800);
    h = await look(page, 'ExamTab → the mini exam', { expect: 'Exam', shot: 'I18-mini-exam' });
    const clock = ((await page.locator('#gn-stage [role="timer"]').textContent()) || '').trim();
    check(await has(page, 'MINI EXAMEN 1') && /^(20:00|19:5\d)$/.test(clock), 'the mini exam runs on the exam-style screen with a 20-minute clock', clock);
    const items = await itemsOf(page, mini.items);
    const byArea = await page.evaluate((ids) => { const C = window.gnCourse; const n = {}; ids.forEach((id) => { const a = C.item(id).area; n[a] = (n[a] || 0) + 1; }); return n; }, mini.items);
    check(byArea.vocab === 6 && byArea.grammar === 8 && byArea.reading === 3 && byArea.listening === 3, 'its 20 questions are a week test\'s mix: 6 Palabras, 8 Gramática, 3 Lectura, 3 Escucha', byArea);
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], i !== 2 && i !== 9);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    h = await look(page, 'mini exam result', { expect: 'Exam', shot: 'I19-mini-result' });
    check(await has(page, 'Mini examen 1 terminado') && (await page.locator('#gn-stage h1').first().textContent()).trim() === '18', 'the mini exam ends 18 of 20', (await text(page)).slice(0, 200));
    await tap(page, { sel: '#gn-stage a[href="ExamTab.dc.html"]:has-text("Siguiente")' }, 800);
    h = await look(page, 'the mini exam → ExamTab', { expect: 'ExamTab', shot: 'I20-examtab-mini-done' });
    let s = await saved(page);
    const r = s.tests && s.tests[mini.id];
    check(r && r.score === 18 && r.of === 20 && r.areas && r.areas.vocab && r.areas.vocab.of === 6 && s.mistakes.length === 2 && s.mistakes.map((x) => x.src).sort().join() === [mini.items[2], mini.items[9]].sort().join(), 'saved: the result under ' + mini.id + ', by area, and its two errors in the notebook', { r, m: s.mistakes.map((x) => x.src) });
    check(await has(page, 'Último resultado: 18 de 20') && (await page.locator('#gn-stage a[aria-label="Hacer otra vez el mini examen 1"]').count()) === 1, 'the Examen tab shows the last result, and «Otra vez»', (await text(page)).slice(-500));
    /* taken again and left by the cross on its result page: that result is kept too (17 of 20 this time) */
    await tap(page, { aria: 'Hacer otra vez el mini examen 1' }, 800);
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], i > 2);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    await tap(page, { aria: 'Salir del mini examen 1' }, 800);
    s = await saved(page);
    check((await screenOf(page)) === 'ExamTab' && s.tests[mini.id].score === 17 && await has(page, 'Último resultado: 17 de 20'), 'the cross on the result page keeps the result too', s.tests[mini.id]);
    await reload(page);
    s = await saved(page);
    check(s.tests[mini.id] && s.tests[mini.id].score === 17 && Object.keys(s.tests).length === W.tests.length + 1, 'reopened: the mini exam\'s result is kept with the week tests', Object.keys(s.tests));
    check((await page.locator('#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]').count()) === 1, 'reopened: the week path is as it was', await controls(page));
    await toTab(page, 'Progreso');
    check(await has(page, 'Palabras') && (await page.locator('#gn-stage [aria-label^="Palabras: ' + 5 * W.tests.length + ' de ' + 6 * W.tests.length + '"]').count()) === 1, 'Progreso counts the week tests by area, not the mini exam (its questions are theirs)', await page.evaluate(() => [...document.querySelectorAll('#gn-stage [role="img"][aria-label^="Palabras"]')].map((e) => e.getAttribute('aria-label'))));
    await ctx.close();
  }
  {
    /* before the last week test of its half, the mini exam waits and says after what */
    const { ctx, page } = await learner('mini waits', { plan: { start: iso(-3), target: null, pace: 'fit', minutes: 30 }, done: days(1, 3), seen: [iso(-1)] });
    await toTab(page, 'Examen');
    const after = await page.evaluate(() => window.gnCourse.minis('A1')[0].after);
    check(await has(page, 'Después de la semana ' + after) && (await page.locator('#gn-stage a[href="Exam.dc.html"]').count()) === 0, 'the mini exam waits behind the week test of week ' + after + ', and says so', (await text(page)).slice(-400));
    await ctx.close();
  }
}

(async () => {
  if (!fs.existsSync(path.join(DIR, 'index.html'))) throw new Error('no app in ' + DIR);
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  BASE = 'http://localhost:' + server.address().port + '/';
  console.log('serving ' + DIR + ' at ' + BASE);
  const browser = await chromium.launch();
  const parts = [['A', partA], ['B', partB], ['C', partC], ['D', partD], ['F', partF], ['G', partG], ['H', partH]];
  parts.push(['I', partI]);
  for (const [name, fn] of parts) {
    if (!want(name)) continue;
    try {
      const r = await fn(browser);
      if (r && r.ctx) await r.ctx.close();
    } catch (e) {
      ok(false, `part ${name} stopped: ${String(e.message || e).split('\n')[0]}`, e.controls || String(e.stack || '').split('\n').slice(0, 3).join(' | '));
    }
  }
  part = 'E every screen';
  const how = SCREENS.map((n) => n + ': ' + (reached[n] ? reached[n].how + ' (' + reached[n].at + ')' : 'NOT REACHED'));
  console.log('  how each screen was reached:\n    ' + how.join('\n    '));
  const ran = ['A', 'B', 'C'].every(want);
  if (ran) {
    check(SCREENS.every((n) => reached[n]), 'all 21 screens were reached at least once (each checked: no logic error, nothing blank, no unresolved hole)', SCREENS.filter((n) => !reached[n]));
    const hooked = SCREENS.filter((n) => reached[n] && reached[n].how !== 'tap');
    check(!hooked.length, 'every screen is reached by taps from the first visit', 'only through the ?gntest hook: ' + hooked.join(', '));
  }
  part = 'E console';
  const noisy = problems.filter((p) => !/favicon/.test(p.what));
  check(noisy.length === 0, 'no console error, console warning, page error or failed request on any page', noisy.slice(0, 12));
  await browser.close();
  server.close();
  console.log('\n' + passes.length + ' checks passed, ' + failures.length + ' failed');
  if (failures.length) {
    console.log('FAILURES:');
    failures.forEach((f) => console.log(`- [${f.part}] ${f.what}${f.evidence ? '\n    ' + f.evidence : ''}`));
  }
  console.log(failures.length ? 'FLOWS TEST: ' + failures.length + ' problem(s)' : 'FLOWS TEST PASS');
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error('FLOWS TEST CRASH', e); process.exit(2); });
