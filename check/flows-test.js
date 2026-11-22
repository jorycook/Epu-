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
//   H  the last written week (whichever it is: A1 unit 5 today): the week before it leads on to it; its review day by
//      taps, every lesson (the drill's answer sheet with its button in view, the week's words written again, the
//      reading); its week test; then the learner stays on that week, on the path, on Progreso and on Niveles, across
//      a reload, and no week that is written is said to be waiting to be written.
//   I  home and motivation: the review that waits put in front of the day (the tab bars' count, the row on the week
//      path and on the day, the review's options in another order, its way on to the day); a sitting's size and the
//      notebook holding a due answer back; the door back to the plan (the date chip, Progreso's «Rearmar mi plan»,
//      «Guardar el plan» and «Cancelar»); the days with study and the greeting after days away; practice where the
//      written path ends; the first mini exam, from the tab to its result. Then what a re-test found: an exam closed
//      on its result page, or left by its cross, is taken all the same (a mini exam, a week test, a day's step); the
//      door back to the plan closes in one press to the screen that opened it (its arrow, the system's back,
//      «Cancelar»); the review closes to the screen that opened it, and puts the right answer where neither the
//      lesson had it nor the question's last turn on the track (looked at one, three and seven days later, and
//      walked by answers: three days on, then a week); a save from before the days were kept says since when they
//      are counted. Then what a second check found: the greeting names a whole review day instead of calling it
//      short; Progreso's days line keeps «desde el D/M» while the record is young and the returns after, and its
//      accessible name spells the day out and leaves nothing out; the week path's seven days count only what is on
//      record; the week path's callout ends on its floor; and a week test's result page shows the test taken when
//      the session in use moves under it (the test hook with no session picked).
//   V  the voice of the clips: the tag «voz sintética» on every screen that offers a synthetic clip (there before
//      the tap, outside every live region; what it means said once a visit), a clip really playing and its control
//      back at rest, Listening's status line and the notebook's play card naming the speaker by the clip's cues, the
//      clips the voice must not say and their written stand-ins, Progreso's page that explains the voice and its
//      switch (saved with the progress, off: every screen shows its stand-in and says the voice is off). Then what a
//      review of the voice found: the words lesson's note belongs to the word it is true of (a silent word, a word
//      with a clip, the silent one again); a sound file held back by this test's own server, on each of the eight
//      screens that play clips (while it is on its way the control waits, gives nothing away and no clock runs; when
//      it arrives; when it could not be fetched, or was too long in coming); what the offline worker has stored once
//      there is a plan and once the learner moves on to the next unit (never the whole level); what every screen says
//      when the learner has turned the voice off. Last, two behaviours nothing else covered: the «Modelo» strip of
//      Hablar's comparison plays the model's clip (every play asked of the player is written down), and the
//      placement check says «No se pudo reproducir el audio: así se dice.» when a clip that is there will not start
//      (an audio output that decodes and never runs stands for a phone whose audio is held elsewhere). A build
//      without sound files runs the silent half.
//   S  the app around the screens: an Android phone's way in (the install page, the browser's own question); the system's
//      back (it does what the screen's own X or arrow does, and leaves from the week path; on every routed screen and
//      in a round or an exam under way it is compared with a tap on that control; pressed three times in a row where
//      the control asks first, it never leaves the app); the page's title, the focus on a new screen's heading, a
//      sheet that keeps the focus and gives it back (also where a tapped button gets none, as on an iPhone), zoom; a
//      paste taken back until something is studied on it, Safari's week (and its «Qué hacer», the install page again,
//      one step from the week path); the notice that covers no control and gives way to a sheet; the screens that load
//      after the first ones, slow (with a way back) or missing, the unit's sound waiting for them, and a first paint
//      that says so when the app cannot load.
//   E  every one of the 21 screens reached, with no page error, no console error and nothing blank.
// usage: node check/flows-test.js [site folder]      (default: ../docs, the built site as it is; about 16 minutes)
//   ONLY=A,B,C,D,F,G,H runs some parts (E reports on what ran); PORT=8795 picks the port (default: any free one).
//   (ONLY=I runs part I alone, ONLY=S part S, ONLY=V part V; I and V take about three minutes each.)
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
const FIELDS = ['started', 'level', 'plans', 'plan', 'cur', 'done', 'tests', 'exams', 'mistakes', 'tp', 'set', 'placement', 'typed', 'profile', 'exposure', 'seen', 'seenLate', 'voice'];
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
/* what the server does to chosen files, for part V: hold (a pattern) keeps every answer to a matching file back until
   release() is called (a sound file «on its way», for as long as a check needs: no timing to hope for); fail (a
   pattern) answers 503 (a file that cannot be fetched); hits is every path asked for */
const net = { hold: null, fail: null, waiting: [], hits: [] };
const release = () => { net.hold = null; net.waiting.splice(0).forEach((send) => send()); };
function serve() {
  return new Promise((done, fail) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x/').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(DIR, p);
      if (!f.startsWith(DIR) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return; }
      net.hits.push(p);
      if (net.fail && net.fail.test(p)) { res.writeHead(503, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }); res.end('unavailable'); return; }
      const send = () => {
        if (res.destroyed) return;
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        fs.createReadStream(f).pipe(res);
      };
      if (net.hold && net.hold.test(p)) net.waiting.push(send);
      else send();
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
  /* page.__expect (a pattern): what a check has arranged itself and is not a problem (part V refuses a sound file on
     purpose: the 503, and the browser's line about it) */
  const noted = (what) => { if (!(page.__expect && page.__expect.test(what))) problems.push({ part, page: label, what }); };
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') noted(m.type() + ': ' + m.text().slice(0, 300)); });
  page.on('pageerror', (e) => noted('pageerror: ' + String(e).slice(0, 300)));
  page.on('response', (r) => { if (r.status() >= 400) noted('HTTP ' + r.status() + ' ' + r.url()); });
  page.on('requestfailed', (r) => noted('request failed ' + r.url() + ' ' + ((r.failure() && r.failure().errorText) || '')));
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

/* the score on the exam-style result page: the screen's last heading (its first is the band's title, the screen's own) */
const scoreOf = (page) => page.locator('#gn-stage h1').last().textContent();

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
  check(s && Object.keys(s).sort().join() === ['v'].concat(FIELDS).sort().join(), 'only the 18 fields (and v) are saved', s && Object.keys(s));
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
  check(await has(page, 'Prueba de la semana terminada') && (await scoreOf(page)).trim() === '18', 'the week test ends 18 of 20', (await text(page)).slice(0, 200));
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
  /* with sound in the build the unit's file has come in by now and the example plays its clip; without, the button
     lights up in silence for as long as the words would take (the stand-in) and the page says so */
  if (await page.evaluate(() => (window.__gnSoundFiles || []).length > 0)) await page.waitForFunction(() => window.gnSound.has('a1u01d1.p1.x0'), null, { timeout: 15000 }).catch(() => {});
  const exClip = await page.evaluate(() => window.gnSound.has('a1u01d1.p1.x0'));
  await tap(page, { aria: 'Escuchar el ejemplo 1' }, 300);
  check(await pressed(page, { aria: 'Escuchar el ejemplo 1' }), exClip ? 'an example\'s sound button lights up while its clip plays' : 'an example\'s sound button lights up (the silent stand-in) when tapped');
  check((await has(page, 'Este audio todavía no está grabado.')) === !exClip, exClip ? 'an example with a clip says nothing about a missing recording' : 'the silent stand-in says the audio is not recorded yet');
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
  check((await scoreOf(page)).trim() === String(exam.length - 1), 'the exam-style score is ' + (exam.length - 1) + ' of ' + exam.length, await scoreOf(page));
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
  const liClip = await page.evaluate((id) => ({ has: window.gnSound.has(id), ms: window.gnSound.ms(id) }), li.id);
  await tap(page, { aria: 'Reproducir el audio' }, 300);
  const t0 = Date.now();
  await page.waitForFunction(() => { const b = document.querySelector('#gn-stage button[aria-label^="Respuesta 1"]'); return b && !/escuchá primero|leé primero/.test(b.getAttribute('aria-label')); }, null, { timeout: 45000 });
  const took = Date.now() - t0;
  /* with a clip the answers open when it has played to its end (its own length); without one the transcript stands in
     and the answers open with it, at the first tap */
  if (liClip.has) check(took > liClip.ms - 1500 && took < liClip.ms + 6000, `listening: the clip plays through (${Math.round(liClip.ms / 100) / 10} s long) and then the answers open (${Math.round(took / 100) / 10} s)`, { took, ms: liClip.ms });
  else check(took < 3000 && await has(page, 'Transcripción'), `listening: with no clip the transcript stands in and the answers open with it (${Math.round(took / 100) / 10} s)`, took);
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
  check((await page.locator('#gn-stage a[aria-label="Día 2, el próximo. Abrí el día"]').count()) === 1 && await has(page, 'Decir quién: che, nde, ñande, ore') && await has(page, 'SIGUIENTE'), 'Main: day 2 (dated tomorrow) is the next one, and its card leads there', await controls(page));
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
  /* and in the screens' own code (assets/screens.js and screens-more.js): no screen navigates there */
  const code = ['screens.js', 'screens-more.js'].map((f) => fs.readFileSync(path.join(DIR, 'assets', f), 'utf8')).join('\n');
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
  check(/^\s*(Ehai · Escribir\s*)?1 sin error seguidas/.test(after), `Escribir: "${word.w}" typed without a slip counts 1 in a row`, after.slice(0, 160));
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
    ['a later version (v 2)', JSON.stringify({ v: 2, started: true, level: 'A1', plan, future: { x: 1 } }), 'Main', 'later'],
    ['fields of a newer build, in the same form', JSON.stringify({ v: 1, started: true, level: 'A1', plan, streak: { days: 3, best: 9 }, theme: 'x' }), 'Main', 'extra'],
  ];
  for (const [label, value, expect, kind] of CASES) {
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
    if (kind === 'later') {
      /* a newer build's save: read as far as this build understands it, never written over, and said on the week path */
      const kept = (await page.evaluate((k) => localStorage.getItem(k), KEY)) === value;
      await go(page, '');
      const said = await has(page, 'Hay una versión más nueva de la app');
      ok(used && kept && said && !mine().length, `saved ${label}: the save should be left exactly as it was, and the week path should say a newer version wrote it`, { kept, said, problems: mine() });
      if (used && kept && said && !mine().length) pass(`saved ${label}: starts on ${expect}, stays usable, the save untouched, the learner told`);
      await ctx.close();
      continue;
    }
    /* what is saved now is clean: only the course's fields, already in the form the app reads back (and, as they were,
       the fields this build does not know: a newer build's, in the same form) */
    const clean = await page.evaluate((FIELDS) => {
      let s = null;
      try { s = JSON.parse(localStorage.getItem('epua.v1:/')); } catch (e) { return { err: 'not JSON' }; }
      if (!s || typeof s !== 'object') return { err: 'nothing saved', s };
      const back = window.gnApp.start();
      const odd = Object.keys(s).filter((k) => k !== 'v' && FIELDS.indexOf(k) < 0);
      const differ = FIELDS.filter((f) => JSON.stringify(s[f] === undefined ? null : s[f]) !== JSON.stringify(back[f] === undefined ? null : back[f]));
      return { odd, kept: JSON.stringify(odd.map((k) => s[k])), differ, proto: ({}).started !== undefined || ({}).x !== undefined };
    }, FIELDS);
    const given = kind === 'extra' ? JSON.parse(value) : {};
    const carried = Object.keys(given).filter((k) => k !== 'v' && FIELDS.indexOf(k) < 0);
    const oddOk = !clean.err && JSON.stringify(clean.odd) === JSON.stringify(carried) && clean.kept === JSON.stringify(carried.map((k) => given[k]));
    ok(used && !clean.err && oddOk && !clean.differ.length && !clean.proto, `saved ${label}: after a tap the save is rewritten clean${carried.length ? ', with the fields of a newer build as they were' : ''}`, clean);
    if (used && !mine().length && !clean.err && oddOk && !clean.differ.length) pass(`saved ${label}: starts on ${expect} in ${ms} ms, stays usable, saved clean${carried.length ? ' (' + carried.join(', ') + ' carried along)' : ''}`);
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
  /* a day as Progreso's line prints it («16/11») and as an accessible name says it («16 de noviembre», with the year
     once it is not this year's) */
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const figures = (n) => { const d = new Date(Date.now() + n * DAY); return d.getDate() + '/' + (d.getMonth() + 1); };
  const spoken = (n) => { const d = new Date(Date.now() + n * DAY); return d.getDate() + ' de ' + MES[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' de ' + d.getFullYear() : ''); };
  /* how far above the week-test node the week path's callout ends, in the design's pixels: the path keeps 4 (the
     callout's floor is y 404, the node starts at 408) */
  const calloutGap = (page) => page.evaluate(() => {
    const node = document.querySelector('#gn-stage a[href="WeekTest.dc.html"][aria-label^="Día 7"]');
    const path = node && node.parentElement;
    const card = path && [...path.children].find((el) => el.tagName === 'DIV' && el.style.left === '150px' && el.style.width === '224px');
    if (!node || !card) return null;
    const k = path.getBoundingClientRect().height / path.offsetHeight;
    return +((node.getBoundingClientRect().top - card.getBoundingClientRect().bottom) / k).toFixed(2);
  });
  /* the accessible name of Progreso's days line */
  const daysName = (page) => page.locator('#gn-stage [role="img"][aria-label*="con estudio"]').first().getAttribute('aria-label', { timeout: 1500 }).catch(() => null);
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
    /* the review closes to the screen it was opened from. From the week path's row its cross and the system's back
       lead back to the week path, not to the notebook, and leave nothing in the history */
    const level = () => page.waitForFunction(() => !((history.state && history.state.gn) || 0), null, { timeout: 3000 }).catch(() => {});
    const optionsShown = () => page.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => (b.textContent || '').trim().replace(/^\d+\s*/, '')));
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    const inReview = [await screenOf(page), await depthOf(page)];
    await tap(page, { aria: 'Salir del repaso' }, 600);
    await level();
    check(inReview.join() === 'Review,2' && (await screenOf(page)) === 'Main' && (await depthOf(page)) === 0 && await has(page, 'Antes de empezar'), 'Review, opened from the week path\'s row, closes by its cross to the week path (not to the notebook)', { inReview, now: [await screenOf(page), await depthOf(page)] });
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    await sysBack(page);
    await level();
    check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'the system\'s back from that review leads to the week path too', [await screenOf(page), await depthOf(page)]);
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
    h = await look(page, 'Today with a review due', { expect: 'Today', shot: 'I02-today-due' });
    check(await has(page, 'Antes de empezar') && await has(page, '3 para repasar · unos 2 min'), 'Today: the same row stands above the three lessons', (await text(page)).slice(0, 300));
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    await tap(page, { aria: 'Salir del repaso' }, 600);
    check((await screenOf(page)) === 'Today' && (await depthOf(page)) === 1 && await has(page, 'Semana 1 · Día 4'), 'Review, opened from the day\'s row, closes by its cross to that day', [await screenOf(page), await depthOf(page)]);
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    h = await look(page, 'Today → Review', { expect: 'Review', shot: 'I03-review' });
    const list = await itemsOf(page, due);
    const shown = await optionsShown();
    check(await has(page, '1 / 3') && shown.slice().sort().join('|') === list[0].options.slice().sort().join('|') && shown.join('|') !== list[0].options.join('|'), 'Review: the question has its options in another order than the lesson had them', { lesson: list[0].options, shown });
    /* the right answer's place is set by rule: never where the lesson had it, and, with three options or more, not
       where it stood at the question's last turn on the track either. The track's steps are 1, 3 and 7 days: the same
       question, looked at one, three and seven days later with nothing answered between, has its right answer in
       another place than today each time. (A rule that only looked at the day before brought a question of four
       options back to the same button every third day: answered right, it was asked again «en 3 días» with its
       answer where it had been.) */
    const rightText = list[0].options[list[0].answer - 1];
    const placeToday = shown.indexOf(rightText);
    check(placeToday >= 0 && placeToday !== list[0].answer - 1, 'Review: the right answer is not at the place the lesson gave it', { lesson: list[0].answer, today: placeToday + 1, shown });
    /* the question that opens the review on a later day of this tab, as it is shown: where its right answer stands */
    const lookOn = async (offset) => {
      await setDay(page, offset);
      await reload(page);
      await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
      const opts = await optionsShown();
      return { on: await screenOf(page), same: opts.slice().sort().join('|') === shown.slice().sort().join('|'), place: opts.indexOf(rightText) };
    };
    const later = {};
    for (const gap of [1, 3, 7]) later[gap] = await lookOn(gap);
    const elsewhere = (x, than) => x.on === 'Review' && x.same && x.place >= 0 && x.place !== list[0].answer - 1 && (list[0].options.length < 3 || x.place !== than);
    const places = { lesson: list[0].answer, today: placeToday + 1, in1day: later[1].place + 1, in3days: later[3].place + 1, in7days: later[7].place + 1, options: list[0].options.length };
    check(elsewhere(later[1], placeToday), 'Review, the same question a day later: the right answer is in another place than the day before, and still not the lesson\'s', places);
    check(elsewhere(later[3], placeToday) && elsewhere(later[7], placeToday), 'Review, the same question three and seven days later (the track\'s other two steps): the right answer is in another place than today both times', places);
    await setDay(page, 0);
    await reload(page);
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
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
    /* and by the track itself, as a learner meets it: the three answered right today come back «en 3 días», and that
       day the first of them has its right answer elsewhere than today; answered right again it comes back a week
       after that, elsewhere again */
    const back3 = await lookOn(3);
    const due3 = await has(page, 'Ahora en 3 días');
    await answerOne(page, list[0], true, true);
    await page.waitForTimeout(300);
    const next7 = await has(page, 'Próxima vez: en 1 semana');
    const back10 = await lookOn(10);
    const track = { lesson: list[0].answer, answeredToday: placeToday + 1, backIn3days: back3.place + 1, backAWeekLater: back10.place + 1, due3, next7, due7: await has(page, 'Ahora en 1 semana') };
    check(due3 && elsewhere(back3, placeToday), 'Review, by the track: a question answered right comes back three days later with its right answer in another place', track);
    check(next7 && track.due7 && elsewhere(back10, back3.place), 'and, answered right again, a week after that, in another place again', track);
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
  {
    /* one question left of today's sitting (7 of the 8 answered today) and 21 waiting: the line agrees with the one */
    const waiting = [];
    for (let d = 1; d <= 5; d++) for (let k = 1; k <= 4; k++) waiting.push('a1u01d' + d + '.d' + k);
    waiting.push('a1u01d1.e1');
    const today = [];
    for (let d = 1; d <= 2; d++) for (let k = 1; k <= 4; k++) today.push('a1u02d' + d + '.d' + k);
    const mistakes = today.slice(0, 7).map((id) => m(id, { at: Date.now() - 1000, step: 1, last: 'right', due: iso(3) })).concat(waiting.map((id, k) => m(id, { at: Date.now() - (10 + k) * DAY, due: iso(-9) })));
    const { ctx, page } = await learner('one left today', { plan: { start: iso(-12), target: null, pace: 'fit', minutes: 15 }, done: Object.assign(days(1, 5), days(2, 2)), mistakes, seen: [iso(-1), iso(0)] });
    await toTab(page, 'Cuaderno');
    check(await has(page, 'Hay 21 esperando. Hoy va la más vieja; las otras 20 quedan para los próximos días.') && !(await has(page, 'Hoy van la')), 'Notebook, one question left of today\'s sitting: «Hoy va la más vieja» (not «Hoy van la»)', ((await text(page)).match(/Hay \d+ esperando\.[^.]*\./) || [(await text(page)).slice(0, 200)])[0]);
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
    /* opened on a plan that exists the screen is a door, not the last of three steps: it is one step from the week
       path, and its arrow is «Cancelar» (it used to step back through «¿Desde dónde empezás?» and «¿Para qué querés
       aprender guaraní?»: three presses, and an answer changed on the way was saved) */
    const level = () => page.waitForFunction(() => !((history.state && history.state.gn) || 0), null, { timeout: 3000 }).catch(() => {});
    /* what a way out that saves nothing must leave as it was (the first change rewrites the save in the app's own form) */
    const kept = (x) => JSON.stringify([x.plan, x.profile || null, x.done, x.tests, x.seen]);
    const arrow = page.locator('#gn-stage a[aria-label="Volver al camino sin cambiar el plan"]');
    check((await depthOf(page)) === 1 && (await arrow.count()) === 1 && (await page.locator('#gn-stage [aria-label="Volver al paso anterior"]').count()) === 0, 'the door back to the plan is one step from the week path, and its arrow leaves it (no step back into the first-run questions)', { depth: await depthOf(page), arrows: await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-label^="Volver"]')].map((e) => e.getAttribute('aria-label'))) });
    await arrow.tap();
    await page.waitForTimeout(600);
    await level();
    check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0 && kept(await saved(page)) === kept(before), 'the door\'s arrow goes back to the week path in one press, with nothing asked and nothing saved', [await screenOf(page), await depthOf(page)]);
    await chip.tap();
    await page.waitForTimeout(600);
    await sysBack(page);
    await level();
    check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0 && kept(await saved(page)) === kept(before), 'the system\'s back from the door leaves it in one press too', [await screenOf(page), await depthOf(page), (await text(page)).slice(0, 60)]);
    await chip.tap();
    await page.waitForTimeout(600);
    await tap(page, 'Cancelar', 600);
    check((await screenOf(page)) === 'Main' && JSON.stringify((await saved(page)).plan) === JSON.stringify(before.plan), '«Cancelar» goes back to the week path and leaves the plan as it was', (await saved(page)).plan);
    await toTab(page, 'Progreso');
    h = await look(page, 'Progress behind the plan', { expect: 'Progress', shot: 'I10-progress-behind' });
    check(await has(page, 'días atrás') && await has(page, 'Rearmar mi plan') && await has(page, "Epu'ã ha eñepyrũjey"), 'Progreso: behind the plan, it offers to make the plan again', (await text(page)).slice(0, 300));
    await tap(page, 'Rearmar mi plan', 600);
    check((await screenOf(page)) === 'Goal' && await has(page, 'Guardar el plan'), '«Rearmar mi plan» opens the goal screen at the plan', await screenOf(page));
    /* opened from Progreso, the door closes to Progreso, one step under it: by «Cancelar», by its arrow and by the
       system's back, each in one press (they all used to end on the week path) */
    const deep = await depthOf(page);
    await tap(page, 'Cancelar', 600);
    check(deep === 2 && (await screenOf(page)) === 'Progress' && (await depthOf(page)) === 1 && await has(page, 'Rearmar mi plan') && JSON.stringify((await saved(page)).plan) === JSON.stringify(before.plan), '«Cancelar», from Progreso\'s door, goes back to Progreso and leaves the plan as it was', { deep, now: [await screenOf(page), await depthOf(page)] });
    await tap(page, 'Rearmar mi plan', 600);
    await tap(page, { aria: 'Volver a Progreso sin cambiar el plan' }, 600);
    check((await screenOf(page)) === 'Progress' && (await depthOf(page)) === 1, 'so does the door\'s arrow', [await screenOf(page), await depthOf(page)]);
    await tap(page, 'Rearmar mi plan', 600);
    await sysBack(page);
    check((await screenOf(page)) === 'Progress' && (await depthOf(page)) === 1 && JSON.stringify((await saved(page)).plan) === JSON.stringify(before.plan), 'and the system\'s back, in one press', [await screenOf(page), await depthOf(page), (await text(page)).slice(0, 60)]);
    await tap(page, 'Rearmar mi plan', 600);
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
    check(await has(page, '4 días con estudio · volviste una vez') && !(await has(page, 'desde el')), 'Progreso counts the days with study and the returns (and, for a learner whose days were all kept, says no «desde»)', (await text(page)).slice(0, 200));
    await toTab(page, 'Camino');
    check(JSON.stringify((await saved(page)).seen) === JSON.stringify(before.seen) && (await saved(page)).seenLate === false, 'looking around is not study: no day is added for it (and a learner whose days were kept from the start is not marked seenLate)', (await saved(page)).seen);
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
    /* more than a week away, with a week sealed and nothing due: its review day is where to start. It is a whole day
       of three lessons, so the greeting names it and does not call it short (it said «Empezá con algo corto: el
       repaso de la semana 1…» in front of a drill, an exam step, eight words and a reading) */
    const { ctx, page } = await learner('back after a week', { plan: { start: iso(-20), target: null, pace: 'fit', minutes: 30 }, done: Object.assign(days(1, 6), { a1u02d1: full }), tests: { a1u01t: result('a1u01t') }, seen: [iso(-12), iso(-11), iso(-10)] });
    let h = await look(page, 'Main after ten days away', { expect: 'Main', shot: 'I14-main-back-week' });
    check(await has(page, '¡Volviste!') && await has(page, 'Repasar la semana 1') && await has(page, 'Seguir con el día 2'), 'after a week or more away, the last review day sealed is offered before the next new day', (await text(page)).slice(0, 400));
    check(await has(page, 'Empezá por el repaso de la semana 1, que ya sellaste.') && !(await has(page, 'algo corto')), 'and the greeting says what it is, a week\'s review, without calling a whole review day «algo corto»', ((await text(page)).match(/¡Volviste!.{0,90}/) || [''])[0]);
    await tap(page, 'Repasar la semana 1', 700);
    h = await look(page, 'the greeting → week 1\'s review day', { expect: 'Today' });
    check(await has(page, 'Semana 1 · Día 6') && await has(page, 'DÍA SELLADO'), '«Repasar la semana 1» opens that week\'s review day, sealed as it was', h.head);
    await ctx.close();
  }
  {
    /* back with the week on show whole (its test was the last thing done) and the next day in the week after: the
       button to go on says which week, since «el día 1» would read as a day of the week on show */
    const { ctx, page } = await learner('back, the week whole', { plan: { start: iso(-20), target: null, pace: 'fit', minutes: 30 }, done: days(1, 6), tests: { a1u01t: result('a1u01t') }, cur: 'a1u01t', seen: [iso(-12), iso(-11), iso(-10)] });
    check(await has(page, '¡Volviste!') && await has(page, 'Semana 1 de') && await has(page, 'Seguir: semana 2, día 1') && !(await has(page, 'Seguir con el día 1')), 'back on a week that is whole: the way on names the next week and its day', (await text(page)).slice(0, 400));
    await tap(page, 'Seguir: semana 2, día 1', 700);
    check((await screenOf(page)) === 'Today' && await has(page, 'Semana 2 · Día 1'), 'and it opens that day', (await text(page)).slice(0, 120));
    await ctx.close();
  }
  {
    /* a save from before the app kept the days: nothing is claimed, nobody is greeted back, and the record starts.
       The strip draws six faint dots for the days it knows nothing of, and its name says the same (it said «0 días
       con estudio» of a week the learner may well have studied) */
    const { ctx, page } = await learner('no days kept', { plan: { start: iso(-30), target: null, pace: 'fit', minutes: 30 }, done: days(1, 3) });
    const strip = await page.locator('#gn-stage [aria-label^="Tus últimos 7 días"]').getAttribute('aria-label');
    check(!(await has(page, '¡Volviste!')) && (await page.locator('#gn-stage svg[aria-label^="Kaguare con el ñandutí"]').count()) === 1, 'a save with no days kept loads as before: the usual callout, Kaguare standing', (await text(page)).slice(0, 200));
    check(strip === 'Tus últimos 7 días: todavía no hay ningún día registrado. Hoy todavía no.', 'Main, with no day on record: the last seven days claim nothing (no «0 días con estudio»)', strip);
    await ctx.close();
  }
  {
    /* such a save that already holds things studied (two days sealed, a notebook entry made five days ago): the count
       of days starts with the first thing done now, and Progreso says since when it runs (it used to say «1 día con
       estudio» of a learner who had studied for days). The save is marked for good (seenLate), so it still says so
       once that one old entry has been reviewed; and no day is made up for the time before */
    const { ctx, page } = await learner('days kept from today', { plan: { start: iso(-6), target: null, pace: 'fit', minutes: 30 }, done: days(1, 2), mistakes: [m('a1u01d1.d1', { at: Date.now() - 5 * DAY, due: iso(-4) })] });
    await toTab(page, 'Progreso');
    check(await has(page, '2 de 56 sesiones') && !(await has(page, 'con estudio')), 'Progreso, on a save from before the days were kept: no day is claimed before anything is done', (await text(page)).slice(0, 200));
    await toTab(page, 'Camino');
    await tap(page, { sel: '#gn-stage a[href="Review.dc.html"]' }, 700);
    await answerOne(page, (await itemsOf(page, ['a1u01d1.d1']))[0], true, true);
    await page.waitForTimeout(300);
    await tap(page, { aria: 'Salir del repaso' }, 600);
    await toTab(page, 'Progreso');
    const today = new Date();
    const since = '1 día con estudio desde el ' + today.getDate() + '/' + (today.getMonth() + 1);
    const s = await saved(page);
    check(await has(page, since) && s.seen.join() === iso(0) && s.seenLate === true, 'after the first answer Progreso says since when the days are counted («' + since + '»): the save is marked, and no earlier day is made up', { seen: s.seen, seenLate: s.seenLate, says: ((await text(page)).match(/\d+ días? con estudio[^P]{0,24}/) || [''])[0] });
    /* the line's accessible name spells the day out, the month as a word («16/11» may be read as a fraction) */
    check((await daysName(page)) === '1 día con estudio desde el ' + spoken(0) + '.', 'Progreso: the days line is named for a screen reader with the month as a word («desde el ' + spoken(0) + '»)', await daysName(page));
    await reload(page);
    await toTab(page, 'Progreso');
    check(await has(page, since), 'reopened: it still says so', ((await text(page)).match(/\d+ días? con estudio[^P]{0,24}/) || [''])[0]);
    /* and the week path's strip counts only the days on record, and says since when: of the six days before, drawn
       as faint dots, nothing is known (its name said «0 días con estudio» of them) */
    await toTab(page, 'Camino');
    const strip = await page.locator('#gn-stage [aria-label^="Tus últimos 7 días"]').getAttribute('aria-label');
    check(strip === 'Tus últimos 7 días: 1 día con estudio desde el ' + spoken(0) + '; de antes no hay registro. Hoy ya estudiaste.', 'Main, on such a save: the last seven days count what is on record and say since when («de antes no hay registro»)', strip);
    await ctx.close();
  }
  {
    /* The note «desde el D/M» and the returns never fit the line together, so a save marked seenLate used to lose
       «volviste N veces» for good. While its record is young (under 30 days) the line keeps the note, and the
       accessible name carries both; once the record is 30 days old the line reads as everyone's, returns and all,
       and the name still says since when */
    const state = (seen) => ({ plan: { start: iso(-60), target: null, pace: 'fit', minutes: 30 }, done: days(1, 3), seenLate: true, seen });
    let { ctx, page } = await learner('record began late, young', state([iso(-5), iso(-4), iso(-1)]));
    await toTab(page, 'Progreso');
    const line = async () => ((await text(page)).match(/\d+ días? con estudio.{0,34}?(?= Epu'ã| Por área)/) || [(await text(page)).slice(0, 200)])[0];
    check(await has(page, '3 días con estudio desde el ' + figures(-5)) && !(await has(page, 'volviste')), 'Progreso, a record that began late and is 5 days old: the line says since when («desde el ' + figures(-5) + '»)', await line());
    check((await daysName(page)) === '3 días con estudio desde el ' + spoken(-5) + '. Volviste una vez.', 'and its accessible name carries the return the line has no room for', await daysName(page));
    await ctx.close();
    ({ ctx, page } = await learner('record began late, 40 days ago', state([iso(-40), iso(-39), iso(-20), iso(-1)])));
    await toTab(page, 'Progreso');
    check(await has(page, '4 días con estudio · volviste 2 veces') && !(await has(page, 'desde el')), 'Progreso, the same record 40 days old: the line reads as everyone\'s, with the returns («4 días con estudio · volviste 2 veces»)', await line());
    check((await daysName(page)) === '4 días con estudio desde el ' + spoken(-40) + '. Volviste 2 veces.', 'and its accessible name still says since when the count runs', await daysName(page));
    await ctx.close();
  }
  {
    /* back after ten days with 45 minutes a day: a sitting of 25 questions is where to start, but it is not «algo corto» */
    const ids = [];
    for (let d = 1; d <= 5; d++) for (let k = 1; k <= 4; k++) ids.push('a1u01d' + d + '.d' + k);
    for (let d = 1; d <= 5; d++) for (let k = 1; k <= 3; k++) ids.push('a1u01d' + d + '.e' + k);
    const { ctx, page } = await learner('back, a long review', { plan: { start: iso(-20), target: null, pace: 'fit', minutes: 45 }, done: days(1, 5), mistakes: ids.map((id, k) => m(id, { at: Date.now() - (12 + k) * DAY, due: iso(-10) })), seen: [iso(-12), iso(-11), iso(-10)] });
    check(await has(page, '¡Volviste!') && await has(page, 'Empezá por el repaso: 25 para repasar, 15 minutos.') && !(await has(page, 'algo corto')), 'back with a long sitting (25 questions, 15 minutes): the greeting starts with the review without calling it short', (await text(page)).slice(0, 400));
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
    /* the card is as tall as its lines make it and stands on the floor the path keeps above the week-test node. Its
       small print is drawn 17.4 px a line and was reckoned at 17: with two such lines the card ended 0.8 px low,
       drawn one pixel past its floor */
    check((await calloutGap(page)) >= 3.95, 'Main, the last written week whole: the callout ends on its floor, 4 px above the week-test node (it ended a pixel past it)', await calloutGap(page));
    check(await has(page, '¡Volviste!') && await has(page, "Opu'ã · Se levantó") && (await page.locator('#gn-stage svg[aria-label^="Kaguare se levantó"]').count()) === 1, 'back after six days with no day left to do: the same greeting stands over those links', (await text(page)).slice(0, 400));
    /* the mini exam of the weeks done is open and not taken: the card names it, above what there is to do meanwhile */
    const miniRow = page.locator('#gn-stage a[href="ExamTab.dc.html"][aria-label^="Mini examen"]');
    check(W.minis[0].ready && (await miniRow.count()) === 1 && (await miniRow.getAttribute('aria-label')) === 'Mini examen 1: 20 preguntas, 20 minutos. Abrir la pestaña Examen' && await has(page, '20 preguntas · 20 min'), 'Main, where the written path ends: the card names the mini exam that is open', await miniRow.count());
    await tap(page, { sel: '#gn-stage [aria-labelledby="mientras-tanto"] a[href="Leer.dc.html"]' }, 700);
    h = await look(page, 'Main → Leer', { expect: 'Leer' });
    check((await saved(page)).seen.join() === [iso(-6), iso(0)].join(), 'opening a practice section makes today a day with study', (await saved(page)).seen);
    /* a practice section closes to the door it was opened through: its own way out asks for Progreso, once its only
       door, and the engine leads back to the screen that opened it (by its X, and by the system's back) */
    const level = () => page.waitForFunction(() => !((history.state && history.state.gn) || 0), null, { timeout: 3000 }).catch(() => {});
    await tap(page, { aria: 'Cerrar la lectura' }, 600);
    await level();
    check((await screenOf(page)) === 'Main' && await has(page, 'MIENTRAS TANTO') && (await depthOf(page)) === 0, 'Leer, opened from the week path, closes to the week path (not to Progreso), and leaves nothing in the history', [await screenOf(page), await depthOf(page)]);
    await tap(page, { sel: '#gn-stage [aria-labelledby="mientras-tanto"] a[href="Leer.dc.html"]' }, 700);
    const inLeer = [await screenOf(page), await depthOf(page)];
    await sysBack(page);
    await level();
    check(inLeer.join() === 'Leer,2' && (await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'the system\'s back from Leer opened on the week path leads there too', { inLeer, now: [await screenOf(page), await depthOf(page)] });
    await go(page, '');
    await tap(page, { sel: '#gn-stage a[aria-label="Día 6, sellado. Abrilo de nuevo"]' }, 600);
    h = await look(page, 'a sealed day', { expect: 'Today', shot: 'I16-today-sealed' });
    const more = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-labelledby="un-rato-mas"] a')].map((a) => a.getAttribute('href')));
    check(await has(page, '¿Un rato más?') && more.join() === 'Leer.dc.html,Escribir.dc.html,Hablar.dc.html', 'a sealed day offers a little more: Leer, Escribir, Hablar', more);
    await tap(page, { sel: '#gn-stage [aria-labelledby="un-rato-mas"] a[href="Hablar.dc.html"]' }, 700);
    h = await look(page, 'Today → Hablar', { expect: 'Hablar' });
    await tap(page, { aria: 'Cerrar' }, 600);
    check((await screenOf(page)) === 'Today' && await has(page, '¿Un rato más?') && (await depthOf(page)) === 1, 'Hablar, opened from a sealed day, closes to that day', [await screenOf(page), await depthOf(page)]);

    part = 'I6 the first mini exam';
    const mini = W.minis[0];
    await go(page, '');
    /* with no day left to do the mini exam is the next step: Progreso says so, and the week path's card leads to it */
    await toTab(page, 'Progreso');
    check(await has(page, 'Sigue: Mini examen 1 · 20 preguntas, 20 min') && (await page.locator('#gn-stage a[href="ExamTab.dc.html"]:has-text("Abrir")').count()) === 1, 'Progreso: with no day left to do, the next step is the mini exam', (await text(page)).slice(0, 500));
    await toTab(page, 'Camino');
    await tap(page, { sel: '#gn-stage a[href="ExamTab.dc.html"][aria-label^="Mini examen"]' }, 700);
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
    check(await has(page, 'Mini examen 1 terminado') && (await scoreOf(page)).trim() === '18', 'the mini exam ends 18 of 20', (await text(page)).slice(0, 200));
    {
      /* the result is saved the moment the exam ends, with its errors: its page is still up, no button tapped yet */
      const now = await saved(page);
      check(now.tests && now.tests[mini.id] && now.tests[mini.id].score === 18 && now.tests[mini.id].of === 20 && now.mistakes.length === 2, 'the mini exam\'s result is saved when it ends, on its result page, before any way out is taken', { r: now.tests && now.tests[mini.id], mistakes: now.mistakes.length });
    }
    await tap(page, { sel: '#gn-stage a[href="ExamTab.dc.html"]:has-text("Siguiente")' }, 800);
    h = await look(page, 'the mini exam → ExamTab', { expect: 'ExamTab', shot: 'I20-examtab-mini-done' });
    let s = await saved(page);
    const r = s.tests && s.tests[mini.id];
    check(r && r.score === 18 && r.of === 20 && r.areas && r.areas.vocab && r.areas.vocab.of === 6 && s.mistakes.length === 2 && s.mistakes.map((x) => x.src).sort().join() === [mini.items[2], mini.items[9]].sort().join(), 'saved: the result under ' + mini.id + ', by area, and its two errors in the notebook', { r, m: s.mistakes.map((x) => x.src) });
    check(await has(page, 'Último resultado: 18 de 20') && (await page.locator('#gn-stage a[aria-label="Hacer otra vez el mini examen 1"]').count()) === 1, 'the Examen tab shows the last result, and «Otra vez»', (await text(page)).slice(-500));
    /* taken again (17 of 20 this time) and the app closed on its result page, then opened again: that result is the
       one kept (the save used to wait for the page's button, and the tab went on showing the result before: 18) */
    await tap(page, { aria: 'Hacer otra vez el mini examen 1' }, 800);
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], i > 2);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    check(await has(page, 'Mini examen 1 terminado') && (await scoreOf(page)).trim() === '17', 'taken again, the mini exam ends 17 of 20', (await text(page)).slice(0, 120));
    await reload(page);
    s = await saved(page);
    check((await screenOf(page)) === 'Main' && s.tests[mini.id] && s.tests[mini.id].score === 17, 'closed on its result page and opened again: the mini exam\'s result is kept', s.tests[mini.id]);
    await toTab(page, 'Examen');
    check(await has(page, 'Último resultado: 17 de 20') && (await page.locator('#gn-stage a[aria-label="Hacer otra vez el mini examen 1"]').count()) === 1 && (await page.locator('#gn-stage a[aria-label="Empezar el mini examen 1"]').count()) === 0, 'and the Examen tab shows it as the last result', (await text(page)).slice(-400));
    /* left by the cross of its result page, a third time (all right): kept as well */
    await tap(page, { aria: 'Hacer otra vez el mini examen 1' }, 800);
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], true);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    await tap(page, { aria: 'Salir del mini examen 1' }, 800);
    s = await saved(page);
    check((await screenOf(page)) === 'ExamTab' && s.tests[mini.id].score === 20 && await has(page, 'Último resultado: 20 de 20'), 'the cross on the result page leads to the tab, the result kept', s.tests[mini.id]);
    await reload(page);
    s = await saved(page);
    check(s.tests[mini.id] && s.tests[mini.id].score === 20 && Object.keys(s.tests).length === W.tests.length + 1, 'reopened: the mini exam\'s result is kept with the week tests', Object.keys(s.tests));
    check((await page.locator('#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]').count()) === 1, 'reopened: the week path is as it was', await controls(page));
    check((await page.locator('#gn-stage a[aria-label^="Mini examen"]').count()) === 0 && await has(page, 'MIENTRAS TANTO'), 'Main: once the mini exam is taken its row is gone, and the links stay', await controls(page));
    await toTab(page, 'Progreso');
    check(!(await has(page, 'Sigue: Mini examen')) && await has(page, 'El próximo día se abre cuando esté escrito.'), 'Progreso: the mini exam taken, the next step waits for the next day to be written', (await text(page)).slice(0, 500));
    check(await has(page, 'Palabras') && (await page.locator('#gn-stage [aria-label^="Palabras: ' + 5 * W.tests.length + ' de ' + 6 * W.tests.length + '"]').count()) === 1, 'Progreso counts the week tests by area, not the mini exam (its questions are theirs)', await page.evaluate(() => [...document.querySelectorAll('#gn-stage [role="img"][aria-label^="Palabras"]')].map((e) => e.getAttribute('aria-label'))));
    await ctx.close();
  }
  {
    /* before the last week test of its half, the mini exam waits and says after what */
    const { ctx, page } = await learner('mini waits', { plan: { start: iso(-3), target: null, pace: 'fit', minutes: 30 }, done: days(1, 3), seen: [iso(-1)] });
    await toTab(page, 'Examen');
    const after = await page.evaluate(() => window.gnCourse.minis('A1')[0].after);
    check(await has(page, 'Después de la semana ' + after) && (await page.locator('#gn-stage a[href="Exam.dc.html"]').count()) === 0, 'the mini exam waits behind the week test of week ' + after + ', and says so', (await text(page)).slice(-400));
    /* what the tab says of the mini exams is what they are: the week tests' questions again, on a clock (no audio, no
       mediation, no writing, no oral part: they do not show the level exam's format) */
    check(await has(page, 'Antes, dos mini exámenes repasan con reloj lo que ya hiciste.') && !(await has(page, 'te muestran el formato')), 'the Examen tab says what the mini exams are: a timed review of what was done, not a show of the exam\'s format', (await text(page)).slice(0, 300));
    await ctx.close();
  }

  part = 'I7 an exam closed on its result page';
  {
    /* The exam-style runner saves when the exam ends («Terminar», or the clock at 0): the misses and the result in the
       same moment. It used to save the result only when the result page was left by its button, so a week test closed
       on that page, or left by its cross, was asked for again the next day, with its errors already in the notebook. */
    const { ctx, page } = await learner('week test closed on its result', { plan: { start: iso(-6), target: null, pace: 'fit', minutes: 30 }, done: days(1, 6), seen: [iso(-1)] });
    check(await has(page, 'HOY · PRUEBA'), 'the week\'s six days done: the week path asks for the week test', (await text(page)).slice(0, 300));
    check((await calloutGap(page)) >= 3.95, 'Main, the week test next: its callout, with a line of small print, ends on its floor too, 4 px above the node', await calloutGap(page));
    await tap(page, { sel: '#gn-stage a[href="WeekTest.dc.html"]:has-text("Empezar")' }, 700);
    await tap(page, 'Empezar la prueba', 800);
    const items = await itemsOf(page, await page.evaluate(() => window.gnCourse.unit(1).test));
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], i > 1);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    let h = await look(page, 'the week test\'s result page', { expect: 'Exam', shot: 'I21-weektest-result' });
    let s = await saved(page);
    check(await has(page, 'Prueba de la semana terminada') && s.tests.a1u01t && s.tests.a1u01t.score === 18 && s.tests.a1u01t.of === 20 && s.mistakes.length === 2, 'the week test is saved when it ends, on its result page, with its two errors', { r: s.tests.a1u01t, mistakes: s.mistakes.length });
    /* the page goes on showing the test that was taken (the week is whole now, and the session in use could move on) */
    check((await scoreOf(page)).trim() === '18' && (await page.locator('#gn-stage svg[aria-label="Correcta"]').count()) === 18 && (await page.locator('#gn-stage svg[aria-label="Incorrecta"]').count()) === 2, 'its result page still shows the 20 answers of the test taken', (await text(page)).slice(0, 120));
    await setDay(page, 1);
    await reload(page);
    h = await look(page, 'the next morning', { expect: 'Main', shot: 'I22-main-after-weektest' });
    s = await saved(page);
    check(s.tests.a1u01t && s.tests.a1u01t.score === 18 && !(await has(page, 'HOY · PRUEBA')) && (await page.locator('#gn-stage a[aria-label^="Día 7, prueba de la semana, hecha"]').count()) === 1, 'closed on its result page and opened the next morning: the test is taken, and the week path does not ask for it again', (await text(page)).slice(0, 300));
    await ctx.close();
  }
  {
    /* …and the page goes on showing the test that was taken when the session in use does move under it. Opened from
       the week path the test is the session picked (cur), which stays put, so the check above cannot fail for this.
       Through the app's test hook no session is picked: the session in use is the next one due, which is the week
       test until its result is saved and the next week's first day from that moment on. The result page must still
       show the 20 answers that were given (a runner that read its questions from the app's memory showed «4 de 20»
       there, over the next week's test) */
    const ctx = await phone(browser);
    const page = await newPage(ctx, 'week test with no session picked');
    await go(page, '?gntest&screen=Exam&level=A1&set=test&done=' + encodeURIComponent(JSON.stringify(days(1, 6))));
    const ids = await page.evaluate(() => window.gnCourse.unit(1).test);
    const items = await itemsOf(page, ids);
    /* the first two answered wrong; what the first row of the result page must say the learner answered */
    const firstWrong = await page.evaluate((id) => { const C = window.gnCourse; const it = C.item(id); const k = (it.answer % it.options.length) + 1; return C.plain((Array.isArray(it.short) && it.short[k - 1]) || it.options[k - 1] || ''); }, ids[0]);
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], i > 1);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    await look(page, 'the result page of a week test with no session picked', { expect: 'Exam', how: 'hook' });
    const firstRow = await page.evaluate(() => { const mark = document.querySelector('#gn-stage svg[aria-label="Correcta"], #gn-stage svg[aria-label="Incorrecta"]'); return mark ? mark.parentElement.parentElement.innerText.replace(/\s+/g, ' ').trim() : ''; });
    const marks = [await page.locator('#gn-stage svg[aria-label="Correcta"]').count(), await page.locator('#gn-stage svg[aria-label="Incorrecta"]').count()];
    check(items.length === 20 && await has(page, 'Prueba de la semana terminada') && (await scoreOf(page)).trim() === '18' && marks.join() === '18,2', 'a week test taken with no session picked (the session in use moves on when it is saved): its result page still says 18 of 20', { score: (await scoreOf(page)).trim(), marks });
    check(/^1 · /.test(firstRow) && firstRow.includes('Tu respuesta: ' + firstWrong), 'and its first row is the first question of the test that was taken, with the answer given to it', { firstRow: firstRow.slice(0, 160), firstWrong });
    await ctx.close();
  }
  {
    /* left by the cross of the result page (the week path), and by the system's back: saved all the same */
    const { ctx, page } = await learner('week test left by its cross', { plan: { start: iso(-6), target: null, pace: 'fit', minutes: 30 }, done: days(1, 6), seen: [iso(-1)] });
    await tap(page, { sel: '#gn-stage a[href="WeekTest.dc.html"]:has-text("Empezar")' }, 700);
    await tap(page, 'Empezar la prueba', 800);
    const items = await itemsOf(page, await page.evaluate(() => window.gnCourse.unit(1).test));
    for (let i = 0; i < items.length; i++) {
      await answerOne(page, items[i], true);
      await tap(page, i < items.length - 1 ? 'Siguiente' : exact('Terminar'), 300);
    }
    await tap(page, { aria: 'Salir de la prueba de la semana' }, 700);
    const s = await saved(page);
    check((await screenOf(page)) === 'Main' && s.tests.a1u01t && s.tests.a1u01t.score === 20 && !(await has(page, 'HOY · PRUEBA')), 'the week test\'s result page left by its cross: the result is saved, and the week path moves on', { on: await screenOf(page), r: s.tests.a1u01t });
    await ctx.close();
  }
  {
    /* a day's exam-style step: its three answers given, the app closed on the result page */
    const { ctx, page } = await learner('day step closed on its result', { plan: { start: iso(0), target: null, pace: 'fit', minutes: 30 }, done: { a1u01d1: { g: 2 } }, cur: 'a1u01d1', seen: [iso(0)] });
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
    await tap(page, exact('Al examen'), 800);
    const exam = await itemsOf(page, await page.evaluate(() => window.gnCourse.day('a1u01d1').grammar.exam));
    for (let i = 0; i < exam.length; i++) {
      await answerOne(page, exam[i], i !== 0);
      await tap(page, i < exam.length - 1 ? 'Siguiente' : exact('Terminar'), 400);
    }
    let s = await saved(page);
    check(await has(page, 'Examen terminado') && s.done.a1u01d1.g === 3 && s.mistakes.length === 1, 'a day\'s exam-style step is saved done (g 3) when it ends, on its result page, with its error', { done: s.done.a1u01d1, mistakes: s.mistakes.length });
    await reload(page);
    s = await saved(page);
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
    check(s.done.a1u01d1.g === 3 && (await screenOf(page)) === 'Today' && !(await has(page, 'Al examen')), 'closed on that page and opened again: the grammar lesson is done, and the day does not send the learner to the exam again', { done: s.done.a1u01d1, says: (await text(page)).slice(0, 200) });
    await ctx.close();
  }
}


/* ---------- S: the app around the screens ----------
   An Android phone's way in; the system's back; what a screen reader and a keyboard are given; saved progress that is
   not lost to a paste or to Safari's week; the screens that load after the first ones. (The system's back is played
   through the browser's history, as its back button plays it: a phone's gesture cannot be made here.) */
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-A155M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const depthOf = (page) => page.evaluate(() => (history.state && history.state.gn) || 0);
const focusOf = (page) => page.evaluate(() => { const el = document.activeElement; return !el || el === document.body ? '' : el.tagName.toLowerCase() + ':' + (el.getAttribute('aria-label') || el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 48); });
const noticeOf = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage > .sc-host > div > [role="status"]')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' | '));
/* the controls of the screen that the shell's notice lies over, and the week path's last seven days if it hides them:
   the notice must cover neither */
const noticeOver = (page) => page.evaluate(() => {
  const n = document.querySelector('#gn-stage > .sc-host > div > [role="status"]');
  if (!n) return ['no notice'];
  const r = n.getBoundingClientRect();
  const under = (el) => { const q = el.getBoundingClientRect(); return q.width > 0 && q.height > 0 && Math.min(r.right, q.right) - Math.max(r.left, q.left) > 1 && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 1; };
  const hit = [...document.querySelectorAll('#gn-stage .sc-host .sc-host a, #gn-stage .sc-host .sc-host button, #gn-stage .sc-host .sc-host input, #gn-stage .sc-host .sc-host textarea')].filter(under).map((el) => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30));
  [...document.querySelectorAll('#gn-stage .sc-host .sc-host div')].forEach((el) => { if (el.children.length === 0 && /^Últimos 7 días$/.test(el.textContent.trim()) && under(el)) hit.push('Últimos 7 días'); });
  return hit;
});
const sheetOf = (page) => page.evaluate(() => { const d = document.querySelector('#gn-stage [role="dialog"]'); const a = document.activeElement; return { open: !!d, inert: document.querySelectorAll('#gn-stage [inert]').length, focusIn: !!(d && a && d.contains(a)), behind: !!(a && a.closest && a.closest('[inert]')) }; });
async function sysBack(page) { await page.goBack().catch(() => {}); await page.waitForTimeout(450); }
async function partS(browser) {
  const iso = (n) => { const d = new Date(Date.now() + n * DAY); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const FULL = { g: 3, ks: 1, kw: 1, k: 1, r: 1 };

  part = 'S1 an Android phone';
  let ctx = await phone(browser, { userAgent: ANDROID });
  let page = await newPage(ctx, 'android');
  /* how often the browser is asked to keep what is saved */
  await page.addInitScript(() => { window.__keep = 0; try { const st = navigator.storage; if (st && st.persist) { const real = st.persist.bind(st); st.persist = () => { window.__keep += 1; return real(); }; } } catch (e) {} });
  await page.goto('about:blank');
  await go(page, '');
  let h = await look(page, 'Android first visit', { expect: 'Install', shot: 'S01-install-android' });
  check(await has(page, "Instalá Epu'ã en tu celular") && await has(page, 'Abrí el menú del navegador') && await has(page, '«Instalar app»') && !(await has(page, 'Compartir')), 'a first visit in Chrome on an Android phone shows the install page, with its menu\'s steps', h.head);
  check(await page.evaluate(() => window.gnApp.device === 'celular' && window.gnApp.browser === 'Chrome' && window.gnApp.apart === false), 'the app knows the phone and its browser, and that there the installed app shares the browser\'s progress', await page.evaluate(() => [window.gnApp.device, window.gnApp.browser, window.gnApp.apart]));
  check(await has(page, 'en Chrome: tu progreso es el mismo') && !(await has(page, 'Copiar mi progreso')), 'the page says progress is the same in the browser and the app (no code to copy)', (await text(page)).slice(-160));
  /* the browser's offer (made here: headless Chromium makes none), turned down, then accepted */
  const offer = (answer) => page.evaluate((answer) => { window.__asked = window.__asked || 0; const e = new Event('beforeinstallprompt', { cancelable: true }); e.prompt = () => { window.__asked += 1; }; e.userChoice = Promise.resolve({ outcome: answer }); window.dispatchEvent(e); return e.defaultPrevented; }, answer);
  const held = await offer('dismissed');
  await page.waitForTimeout(250);
  check(held && await has(page, 'Tocá Instalar, acá abajo') && (await control(page, "Instalar Epu'ã").count()) === 1, 'with the browser\'s offer in hand the page shows one button, Instalar', (await text(page)).slice(0, 200));
  await shot(page, 'S02-install-android-offer');
  await tap(page, "Instalar Epu'ã", 400);
  check((await page.evaluate(() => window.__asked)) === 1 && await has(page, 'Abrí el menú del navegador') && (await control(page, "Instalar Epu'ã").count()) === 0, 'the button puts the browser\'s question once; turned down, the menu\'s steps are back', (await text(page)).slice(0, 200));
  await offer('accepted');
  await page.waitForTimeout(250);
  await tap(page, "Instalar Epu'ã", 400);
  check(await has(page, 'ya está instalada') && await has(page, 'Buscá su ícono'), 'accepted, the page says the app is installed and where to find it', (await text(page)).slice(0, 220));
  await tap(page, 'Seguir en el navegador', 700);
  h = await look(page, 'Android: Seguir en el navegador', { expect: 'Goal' });
  await reload(page);
  check((await screenOf(page)) === 'Goal', 'a reload in the same visit does not bring the install page back on Android either', await screenOf(page));

  part = 'S2 the system\'s back';
  check((await depthOf(page)) === 0, 'on the screen the app opens with, the history holds nothing of the app\'s', await depthOf(page));
  await tap(page, exact('hablar con mi familia'), 250);
  await tap(page, 'Siguiente', 500);
  check(await has(page, '¿Desde dónde empezás?') && (await depthOf(page)) === 1 && /^h1:/.test(await focusOf(page)), 'the goal screen\'s second step is one step deep, its heading in focus', { depth: await depthOf(page), focus: await focusOf(page) });
  await sysBack(page);
  check(await has(page, '¿Para qué querés aprender guaraní?') && await pressed(page, exact('hablar con mi familia')) && (await depthOf(page)) === 0, 'back from step 2 is the goal screen\'s own back arrow: step 1, its answers kept', (await text(page)).slice(0, 80));
  await tap(page, 'Siguiente', 400);
  await tap(page, exact('Empezar en A1'), 400);
  check((await depthOf(page)) === 2, 'step 3 is two steps deep', await depthOf(page));
  await tap(page, 'A mi ritmo', 500);
  let sh = await sheetOf(page);
  check(sh.open && sh.inert > 0 && sh.focusIn && (await depthOf(page)) === 3, 'an open sheet takes the focus, puts what is behind it out of reach, and is one step deeper', { sh, depth: await depthOf(page), focus: await focusOf(page) });
  const tabbed = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); tabbed.push(await sheetOf(page)); }
  check(tabbed.every((t) => !t.behind) && tabbed.some((t) => t.focusIn), 'with the sheet open, Tab never lands on anything behind it', tabbed.map((t) => (t.focusIn ? 'sheet' : t.behind ? 'BEHIND' : 'out')).join(' '));
  await sysBack(page);
  sh = await sheetOf(page);
  check(!sh.open && sh.inert === 0 && (await depthOf(page)) === 2 && /^button:A mi ritmo/.test(await focusOf(page)), 'back closes the sheet; the focus returns to the control that opened it, and nothing stays out of reach', { sh, focus: await focusOf(page) });
  check((await page.evaluate(() => window.__keep)) === 0, 'the browser is not asked to keep anything before there is a plan', await page.evaluate(() => window.__keep));
  await tap(page, 'Tejé el primer hilo', 600);
  await tap(page, { sel: '#gn-stage a[href="Main.dc.html"]:has-text("Empezar")' }, 700);
  h = await look(page, 'the week path', { expect: 'Main' });
  check((await depthOf(page)) === 0 && (await page.title()) === "Epu'ã · Camino de la semana" && /^h1:/.test(await focusOf(page)), 'the week path is where the app now opens: nothing in the history, its name in the page\'s title, its heading in focus', { depth: await depthOf(page), title: await page.title(), focus: await focusOf(page) });
  check((await page.evaluate(() => window.__keep)) === 1, 'once there is a plan the browser is asked, once, to keep what is saved', await page.evaluate(() => window.__keep));
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 600);
  check((await screenOf(page)) === 'Today' && (await depthOf(page)) === 1 && (await page.title()) === "Epu'ã · Lecciones del día" && /^h1:/.test(await focusOf(page)), 'the day is one step deep, named in the title, its heading in focus', { depth: await depthOf(page), title: await page.title(), focus: await focusOf(page) });
  await tap(page, 'Empezar con la regla', 600);
  await tap(page, 'Siguiente:', 500);
  check((await screenOf(page)) === 'Teach' && (await depthOf(page)) === 2, 'a lesson is two steps deep, whatever its page', await depthOf(page));
  await sysBack(page);
  check((await screenOf(page)) === 'Today' && (await depthOf(page)) === 1, 'back from a lesson leads to the day, as its X does (it used to leave the app)', await screenOf(page));
  await sysBack(page);
  check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'back from the day leads to the week path', await screenOf(page));
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
  await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 500);
  check((await screenOf(page)) === 'Notebook' && (await depthOf(page)) === 1, 'the tabs are one step deep, however many are visited', await depthOf(page));
  await sysBack(page);
  check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'back from a tab leads to the week path', await screenOf(page));
  /* down by taps and up again by the screens' own controls: the history is level each time, so back never lands on a lesson left behind */
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("con la regla"), #gn-stage a[href="Today.dc.html"]:has-text("Empezar"), #gn-stage a[href="Today.dc.html"]:has-text("Seguir")' }, 600);
  await tap(page, { sel: '#gn-stage a[href^="Teach"], #gn-stage a:has-text("con la regla")' }, 600);
  const deep = [await screenOf(page), await depthOf(page)];
  await tap(page, { aria: 'Cerrar la lección' }, 600);
  const mid = [await screenOf(page), await depthOf(page)];
  await tap(page, { aria: 'Volver al camino de la semana' }, 600);
  check(deep.join() === 'Teach,2' && mid.join() === 'Today,1' && (await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'leaving by the screens\' own X and arrow takes the history back up with them', { deep, mid, now: [await screenOf(page), await depthOf(page)] });
  check(page.url() === BASE, 'the address never changes', page.url());
  /* the page loaded again while two steps deep (a reload in a lesson): the app is back on the week path and counts
     its depth afresh. It takes no step back of its own at the start: under a slow phone that step could be taken
     twice, and the second would leave the app */
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("con la regla"), #gn-stage a[href="Today.dc.html"]:has-text("Empezar"), #gn-stage a[href="Today.dc.html"]:has-text("Seguir")' }, 600);
  await tap(page, { sel: '#gn-stage a[href^="Teach"], #gn-stage a:has-text("con la regla")' }, 600);
  const steps = await page.evaluate(() => history.length);
  await reload(page);
  check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0 && page.url() === BASE && (await page.evaluate(() => history.length)) === steps, 'reloaded in a lesson, the app opens on the week path, level, without a step in the history of its own', { on: await screenOf(page), depth: await depthOf(page), url: page.url() });
  await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 500);
  await sysBack(page);
  check((await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'and back works from there as before', await screenOf(page));
  /* the entries the reload left under the page: one press passes them all (the app takes the rest of the steps down
     itself, each onto an entry that is its own), and the next press leaves */
  await sysBack(page);
  check((await screenOf(page)) === 'Main' && page.url() === BASE && (await depthOf(page)) === 0, 'back passes the entries a reload left behind and stays on the week path', { url: page.url(), depth: await depthOf(page) });
  await sysBack(page);
  check(page.url() === 'about:blank', 'back from the week path leaves the app', page.url());

  part = 'S3 zoom';
  await go(page, '');
  check((await screenOf(page)) === 'Main' && !/user-scalable|maximum-scale/.test(await page.evaluate(() => document.querySelector('meta[name="viewport"]').content)), 'the page does not forbid zoom', await page.evaluate(() => document.querySelector('meta[name="viewport"]').content));
  {
    const cdp = await ctx.newCDPSession(page);
    const placed = () => page.evaluate(() => ({ t: document.querySelector('#gn-stage').style.transform, scale: window.visualViewport ? Math.round(window.visualViewport.scale * 100) / 100 : 1 }));
    const before = await placed();
    await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
    await page.waitForTimeout(500);
    const zoomed = await placed();
    await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
    await page.waitForTimeout(500);
    const after = await placed();
    check(zoomed.scale === 2 && zoomed.t === before.t && after.t === before.t && after.scale === 1, 'pinched to twice its size, the design keeps its place and is twice as large; back at its own size it sits as before', { before, zoomed, after });
    await cdp.detach();
  }
  const noZoom = () => page.evaluate(() => ({ cls: document.documentElement.classList.contains('gn-nozoom'), touch: getComputedStyle(document.body).touchAction }));
  const free = await noZoom();
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
  await tap(page, { sel: '#gn-stage a[aria-label="Escribir"]' }, 800);
  const game = [await screenOf(page), await noZoom(), await page.title(), await focusOf(page)];
  check(free.touch === 'manipulation' && !free.cls && game[0] === 'Escribir' && game[1].cls && game[1].touch === 'pan-x pan-y', 'only the game played with both thumbs keeps two fingers from zooming', { free, game });
  check(game[2] === "Epu'ã · Escribir" && /^h1:Ehai · Escribir/.test(game[3]), 'the typing game has a heading of its own for a screen reader, in focus when the game opens', game.slice(2));
  await sysBack(page);
  check(await has(page, 'Pausa') && (await sheetOf(page)).open && (await screenOf(page)) === 'Escribir', 'back in the game is its own pause button: the round waits', (await text(page)).slice(-200));
  await sysBack(page);
  check(!(await sheetOf(page)).open && (await screenOf(page)) === 'Escribir', 'back on the pause is its «Continuar»: the round goes on', { sheet: await sheetOf(page), on: await screenOf(page) });
  await sysBack(page);
  check((await sheetOf(page)).open && (await screenOf(page)) === 'Escribir' && page.url() === BASE && (await depthOf(page)) === 2, 'a third press pauses again: pressed again and again with no touch in between, back never falls out of the game', { on: await screenOf(page), url: page.url(), depth: await depthOf(page) });
  await tap(page, 'Salir de la ronda', 600);
  check((await screenOf(page)) === 'Progress' && !(await noZoom()).cls && (await depthOf(page)) === 1, 'out of the game, zoom is free again and the history is level', { on: await screenOf(page), depth: await depthOf(page) });
  await ctx.close();

  part = 'S4 a paste taken back';
  {
    const week = {};
    for (let d = 1; d <= 6; d++) week['a1u01d' + d] = FULL;
    const big = JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(-10), target: null, pace: 'fit', minutes: 30 }, done: week, typed: ['maitei'] });
    const small = 'EPUA1:' + Buffer.from(JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(0), target: null, pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL } })).toString('base64');
    ctx = await phone(browser);
    page = await newPage(ctx, 'paste');
    await page.addInitScript(([k, v]) => { Object.defineProperty(navigator, 'standalone', { get: () => true }); if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); } }, [KEY, big]);
    await go(page, '');
    const paste = async () => {
      await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
      await tap(page, 'Pegar un progreso', 500);
      await page.locator('#gn-stage textarea').first().fill(small);
      const was = await page.evaluate((k) => localStorage.getItem(k), KEY);
      await tap(page, 'Usar este progreso', 900);
      return was;
    };
    const was = await paste();
    let s = await saved(page);
    check((await screenOf(page)) === 'Main' && Object.keys(s.done).length === 1 && /Progreso reemplazado/.test(await noticeOf(page)) && /Deshacer/.test(await noticeOf(page)), 'a pasted code replaces the progress, and the week path offers to take it back', { on: await screenOf(page), days: Object.keys(s.done).length, notice: await noticeOf(page) });
    await shot(page, 'S03-pasted');
    await tap(page, { sel: '#gn-stage nav a:has-text("Cuaderno")' }, 400);
    await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 400);
    check(/Deshacer/.test(await noticeOf(page)), 'the offer is still there after a look round', await noticeOf(page));
    await tap(page, 'Deshacer', 900);
    s = await saved(page);
    check((await screenOf(page)) === 'Main' && (await page.evaluate((k) => localStorage.getItem(k), KEY)) === was && Object.keys(s.done).length === 6 && !(await noticeOf(page)), 'Deshacer stores the progress the code replaced again, as it was, and opens the app on it', { days: Object.keys(s.done).length, notice: await noticeOf(page) });
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 400);
    await tap(page, exact('familia'), 400);
    s = await saved(page);
    check(Object.keys(s.done).length === 6 && s.typed.join() === 'maitei' && s.exposure && s.exposure.with.join() === 'familia', 'after the way back the app saves on from the old progress', { days: Object.keys(s.done).length, typed: s.typed, exposure: s.exposure });
    await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 400);
    /* The offer stands while nothing is studied on the pasted progress: a look at a day is no study. The first thing
       done on it (here the week's «lo usé») withdraws the offer: «Deshacer» stores the old save again as it was, and
       would throw away what was done since */
    await paste();
    check((await noticeOver(page)).join() === '', 'on the week path the notice lies over the week\'s card: it covers no control, and not the last seven days', await noticeOver(page));
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar"), #gn-stage a[href="Today.dc.html"]:has-text("Seguir")' }, 500);
    await tap(page, { aria: 'Volver al camino de la semana' }, 500);
    check((await screenOf(page)) === 'Main' && /Deshacer/.test(await noticeOf(page)), 'a day opened and closed is no study: the offer stands', await noticeOf(page));
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 400);
    await tap(page, exact('trabajo'), 400);
    await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 400);
    s = await saved(page);
    check(!(await noticeOf(page)) && !(await page.evaluate(() => window.gnApp.pasted())) && Object.keys(s.done).length === 1 && s.exposure && s.exposure.with.join() === 'trabajo', 'the first thing done on the pasted progress withdraws the offer: nothing studied can be thrown away by «Deshacer»', { notice: await noticeOf(page), days: Object.keys(s.done).length, exposure: s.exposure });
    await paste();
    await tap(page, { aria: 'Cerrar el aviso' }, 400);
    check(!(await noticeOf(page)) && !(await page.evaluate(() => window.gnApp.pasted())), 'closing the notice keeps the pasted progress: no way back is offered after that', await noticeOf(page));
    await reload(page);
    s = await saved(page);
    check(Object.keys(s.done).length === 1 && !(await noticeOf(page)), 'opened again, the pasted progress is the progress, and nothing is offered', { days: Object.keys(s.done).length, notice: await noticeOf(page) });
    await ctx.close();
  }

  part = 'S5 Safari and a page left for a week';
  {
    const save = JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(-10), target: null, pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL } });
    ctx = await phone(browser);
    page = await newPage(ctx, 'safari week');
    await go(page, '');
    check((await screenOf(page)) === 'Install' && await has(page, 'Safari borra lo guardado de las páginas que no abrís por una semana'), 'the install page tells whoever stays in Safari that it deletes what a page saved after a week away', (await text(page)).slice(-220));
    /* a tab kept open: it chose the browser nine days ago and was last told eight days ago */
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v); sessionStorage.setItem(k + '.browser', '1'); sessionStorage.setItem(k + '.told', String(Date.now() - 8 * 864e5)); }, [KEY, save]);
    await reload(page);
    check((await screenOf(page)) === 'Main' && /Safari puede borrar tu progreso/.test(await noticeOf(page)) && /una semana sin abrir la página/.test(await noticeOf(page)) && /Qué hacer/.test(await noticeOf(page)), 'in a tab kept for more than a week, the week path says what Safari does and offers what to do about it', await noticeOf(page));
    check((await noticeOver(page)).join() === '', 'the notice covers no control of the week path, and not the last seven days', await noticeOver(page));
    check((await page.evaluate((k) => localStorage.getItem(k), KEY)) === save, 'opening the app on the week path, its notice laid over the week\'s card, writes nothing: the save is as it was', (await page.evaluate((k) => localStorage.getItem(k), KEY)).slice(0, 120));
    await shot(page, 'S04-safari-week');
    /* «Qué hacer» is the install page again: the steps to the Home Screen, and the code that takes this progress there */
    await tap(page, 'Qué hacer', 600);
    check((await depthOf(page)) === 1, 'that page is one step from the week path', await depthOf(page));
    /* the system's back leads back to the week path, nothing chosen: the notice is there again, the progress as it was */
    await sysBack(page);
    check(page.url() === BASE && (await screenOf(page)) === 'Main' && /Safari puede borrar tu progreso/.test(await noticeOf(page)) && (await depthOf(page)) === 0 && (await saved(page)).done.a1u01d1.g === 3 && (await page.title()) === "Epu'ã · Camino de la semana", 'the system\'s back from that page leads to the week path (it used to leave the app), with nothing chosen', { url: page.url(), on: await screenOf(page), notice: await noticeOf(page), depth: await depthOf(page) });
    await tap(page, 'Qué hacer', 600);
    check((await screenOf(page)) === 'Install' && await has(page, 'Tocá Compartir') && await has(page, 'Copiar mi progreso') && (await page.title()) === "Epu'ã" && /^h1:Agregá/.test(await focusOf(page)), '«Qué hacer» opens the install page: its steps, the code to copy, its heading in focus', { on: await screenOf(page), title: await page.title(), focus: await focusOf(page), text: (await text(page)).slice(-260) });
    await shot(page, 'S04b-safari-week-install');
    await tap(page, 'Seguir en el navegador', 700);
    check((await screenOf(page)) === 'Main' && !(await noticeOf(page)) && (await page.title()) === "Epu'ã · Camino de la semana" && (await saved(page)).done.a1u01d1.g === 3, 'Seguir en el navegador leads back to the week path, the progress as it was, and it is not said again', { on: await screenOf(page), notice: await noticeOf(page), title: await page.title() });
    await reload(page);
    check((await screenOf(page)) === 'Main' && !(await noticeOf(page)), 'nor after a reload, for a week', await noticeOf(page));
    /* another week later it is said again; closed, it keeps quiet for a week too */
    await page.evaluate((k) => sessionStorage.setItem(k + '.told', String(Date.now() - 8 * 864e5)), KEY);
    await reload(page);
    check(/Safari puede borrar tu progreso/.test(await noticeOf(page)), 'a week later it is said again', await noticeOf(page));
    await tap(page, { aria: 'Cerrar el aviso' }, 400);
    await reload(page);
    check((await screenOf(page)) === 'Main' && !(await noticeOf(page)), 'closed, it is not said again for a week', await noticeOf(page));
    await ctx.close();
    /* from the Home Screen there is nothing to say: Safari's rule does not reach the installed app */
    ctx = await phone(browser);
    page = await newPage(ctx, 'home screen week');
    await page.addInitScript(([k, v]) => { Object.defineProperty(navigator, 'standalone', { get: () => true }); localStorage.setItem(k, v); sessionStorage.setItem(k + '.told', String(Date.now() - 30 * 864e5)); }, [KEY, save]);
    await go(page, '');
    check((await screenOf(page)) === 'Main' && !(await noticeOf(page)), 'the app on the Home Screen says nothing of the kind', await noticeOf(page));
    await ctx.close();
  }

  part = 'S6 the screens that load later';
  {
    ctx = await phone(browser);
    /* this page's failed request is the test's own doing: it is not written down with the others */
    page = await ctx.newPage();
    await page.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
    let hold = true;
    let fail = false;
    let release = () => {};
    let asked = 0;
    await page.route('**/assets/screens-more.js', async (route) => { asked += 1; if (fail) return route.abort(); if (hold) await new Promise((r) => { release = r; }); return route.continue().catch(() => {}); });
    /* the sound files the page asks for (a unit's is larger than all the later screens together) */
    const sound = [];
    page.on('request', (r) => { const m = /\/assets\/(gn-sound-[a-z0-9-]+\.js)/.exec(r.url()); if (m && !/gn-sound-index/.test(m[1])) sound.push(m[1]); });
    const start = JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(-1), target: null, pace: 'fit', minutes: 30 } });
    await page.addInitScript(([k, v]) => { localStorage.setItem(k, v); }, [KEY, start]);
    await go(page, '');
    check((await screenOf(page)) === 'Main' && (await page.evaluate(() => window.gnApp.screens())) === 'coming', 'the week path is up and usable while the other screens are still on their way', await page.evaluate(() => window.gnApp.screens()));
    /* where there is sound, the unit's file waits for the screens that play it */
    const hasSound = await page.evaluate(() => (window.__gnSoundFiles || []).length > 0);
    if (hasSound) check(sound.length === 0, 'the unit\'s sound waits for the screens that play it: no sound file is asked for before they are in', sound);
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 500);
    check((await screenOf(page)) === 'Today', 'the day it leads to is in the first file: it opens at once', await screenOf(page));
    await tap(page, { aria: 'Volver al camino de la semana' }, 400);
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 800);
    check(/Cargando…/.test(await noticeOf(page)) && (await control(page, 'Tapykue · Volver').count()) === 0, 'a screen asked for before it is in gets a waiting note in its place', await noticeOf(page));
    /* …and the sound still waits: it shares the line with the screens, so letting it go here brought the lesson up
       later and the sound no sooner (measured on 17 November); the lesson's controls say «Cargando el audio…» meanwhile */
    if (hasSound) check(sound.length === 0, 'a screen of the later file asked for sooner does not let the unit\'s sound go: the screens come first', sound);
    /* on a connection that stalls the note offers the way back after a few seconds (an app from the Home Screen has no
       back of its own); the file is not asked for again */
    await page.waitForTimeout(5000);
    check(/Cargando…/.test(await noticeOf(page)) && (await control(page, 'Tapykue · Volver').count()) === 1 && (await control(page, 'Intentá de nuevo').count()) === 0, 'still waiting after five seconds, the note offers the way back (and no «Intentá de nuevo»: the file is on its way)', await controls(page));
    await shot(page, 'S05a-screens-waiting');
    await tap(page, exact('Tapykue · Volver'), 500);
    check((await screenOf(page)) === 'Main' && asked === 1, 'Volver leads back to the week path while the file is still coming', { on: await screenOf(page), asked });
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 800);
    hold = false;
    release();
    await page.waitForFunction(() => { const el = document.querySelector('#gn-stage .sc-host .sc-host'); return !!el && el.getAttribute('data-sc-name') === 'Progress'; }, null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(200);
    check((await screenOf(page)) === 'Progress' && /^h1:/.test(await focusOf(page)) && asked === 1, 'once the file is in, the screen shows, its heading in focus; the file was asked for once', { on: await screenOf(page), focus: await focusOf(page), asked });
    if (hasSound) {
      await page.waitForFunction(() => !!window.__gnClips && Object.keys(window.__gnClips).length > 0, null, { timeout: 8000 }).catch(() => {});
      check(sound.length === 1 && /^gn-sound-a1-u01\.js$/.test(sound[0]), 'the unit\'s sound file was asked for once in all, and its clips are in', sound);
    }
    /* a visit on which the file cannot be fetched */
    fail = true;
    asked = 0;
    await page.reload();
    await ready(page);
    await page.waitForTimeout(400);
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
    check(/No llegó esta parte de la app/.test(await noticeOf(page)) && (await control(page, 'Intentá de nuevo').count()) === 1 && asked === 1, 'when the file cannot be fetched the app says so, once, and does not ask again and again by itself', { notice: await noticeOf(page), asked });
    await shot(page, 'S05-screens-missing');
    await tap(page, exact('Tapykue · Volver'), 500);
    check((await screenOf(page)) === 'Main', 'Volver leads back to the week path, which is there', await screenOf(page));
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
    fail = false;
    await tap(page, 'Intentá de nuevo', 300);
    await page.waitForFunction(() => { const el = document.querySelector('#gn-stage .sc-host .sc-host'); return !!el && el.getAttribute('data-sc-name') === 'Progress'; }, null, { timeout: 8000 }).catch(() => {});
    check((await screenOf(page)) === 'Progress', 'Intentá de nuevo fetches it and shows the screen', await screenOf(page));
    await ctx.close();
  }

  part = 'S6b a first paint that never ends';
  {
    /* a first visit on which one of the page's own scripts does not arrive: the page's first paint says so, where it
       used to say «Cargando…» for ever (or, without the first screens, «no screen named Install») */
    for (const [what, file] of [['the app\'s own script', 'gn-app.js'], ['the first screens', 'screens.js']]) {
      ctx = await phone(browser);
      /* this page's failed request is the test's own doing: it is not written down with the others */
      page = await ctx.newPage();
      await page.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
      await page.route('**/assets/' + file, (route) => route.abort());
      await page.goto(BASE).catch(() => {});
      await page.waitForTimeout(1200);
      const seen = await page.evaluate(() => ({ ready: document.documentElement.classList.contains('gn-ready'), splash: document.querySelector('#gn-splash').innerText.replace(/\s+/g, ' ').trim(), all: document.body.innerText.replace(/\s+/g, ' ').trim() }));
      check(!seen.ready && /No se pudo cargar\. Revisá tu conexión y abrí la página de nuevo\./.test(seen.splash) && !/Cargando|no screen named/.test(seen.all), `without ${what} (${file}) the first paint says the app could not load, and what to do`, seen);
      if (file === 'gn-app.js') await page.screenshot({ path: path.join(OUT, 'S05b-first-paint-failed.png') });
      await ctx.close();
    }
  }

  part = 'S7 the system\'s back, screen by screen';
  {
    /* Every routed screen, and the states inside a screen whose own way back asks first (a round of a game, an exam
       under way): the system's back must do what a tap on the screen's own X or arrow does. That control is found
       here the way a learner finds it, by where it is and what it shows (the cross or the arrow at the top left of
       the screen), not by the mark the app reads; and it must carry that mark (data-gn-back). The screens are opened
       through the test hooks, on a learner part way through unit 2. */
    const week1 = {};
    for (let d = 1; d <= 6; d++) week1['a1u01d' + d] = FULL;
    const state = { level: 'A1', plan: { start: iso(-8), target: iso(60), pace: 'fit', minutes: 30 }, done: Object.assign({}, week1, { a1u02d1: FULL, a1u02d2: { g: 1 } }), tests: { a1u01t: { id: 'a1u01t', score: 17, of: 20, used: 700, areas: { vocab: { right: 5, of: 6 } }, at: Date.now() - 2 * DAY } }, m: [{ src: 'a1u01d2.d1', wrong: 'ore', at: Date.now() - DAY, step: 0, due: iso(0) }], cur: 'a1u02d2' };
    const at = (screen, more) => '?gntest&screen=' + screen + Object.entries(Object.assign({}, state, more || {})).map(([k, v]) => '&' + k + '=' + encodeURIComponent(typeof v === 'string' ? v : JSON.stringify(v))).join('');
    ctx = await phone(browser);
    page = await newPage(ctx, 'back, screen by screen');
    await page.goto('about:blank');
    const inApp = () => page.url().startsWith(BASE);
    /* what is on the glass: the screen, an open sheet, the goal screen's step, the screen's heading */
    const sig = async () => (inApp() ? page.evaluate(() => {
      const host = document.querySelector('#gn-stage .sc-host .sc-host');
      const d = document.querySelector('#gn-stage [role="dialog"]');
      const h1 = host ? [...host.querySelectorAll('h1')].filter((e) => e.getClientRects().length)[0] : null;
      const bar = host ? host.querySelector('[aria-label^="Paso "]') : null;
      return { screen: host ? host.getAttribute('data-sc-name') : '', sheet: d ? (d.getAttribute('aria-label') || (d.querySelector('h2') || d).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) : '', step: bar ? bar.getAttribute('aria-label') : '', h1: h1 ? h1.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : '' };
    }) : { screen: 'OUT OF THE APP', sheet: '', step: '', h1: '' });
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    /* the screen's own way back, as a learner sees it: the control at the top left that shows a cross or an arrow */
    const ownBack = () => page.evaluate(() => {
      const stage = document.querySelector('#gn-stage');
      const host = stage.querySelector('.sc-host .sc-host');
      if (!host) return null;
      const sr = stage.getBoundingClientRect();
      const k = sr.width / 390;
      const list = [...host.querySelectorAll('a, button')].filter((c) => {
        if (c.closest('[role="dialog"]')) return false;
        const r = c.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        const cx = (r.left + r.width / 2 - sr.left) / k;
        const cy = (r.top + r.height / 2 - sr.top) / k;
        const drawn = [...c.querySelectorAll('path')].map((p) => p.getAttribute('d') || '').join(' ');
        return cx < 60 && cy > 50 && cy < 100 && (drawn.includes('M6 6l12 12M18 6L6 18') || drawn.includes('M15 5l-7 7 7 7'));
      });
      [...stage.querySelectorAll('[data-flows-own]')].forEach((c) => c.removeAttribute('data-flows-own'));
      if (list[0]) list[0].setAttribute('data-flows-own', '1');
      return list.length ? { n: list.length, label: list[0].getAttribute('aria-label') || '', marked: list[0].hasAttribute('data-gn-back') } : null;
    });
    /* a touch on the empty strip at the top of the design: from then on the history is as deep as the app */
    const touch = async () => { await page.touchscreen.tap(195, 22); await page.waitForTimeout(150); };
    const first = async (unit) => (await itemsOf(page, await page.evaluate((u) => window.gnCourse.unit(u).test.slice(0, 1), unit)))[0];
    const answerFirst = async () => { await answerOne(page, await first(2), true); };
    const startPart = () => tap(page, 'Empezar la parte 1', 700);
    const camino = { sel: '#gn-stage nav a:has-text("Camino")' };
    const goal2 = async () => { await tap(page, exact('hablar con mi familia'), 250); await tap(page, 'Siguiente', 500); };
    const goal3 = async () => { await goal2(); await tap(page, exact('Empezar en A1'), 500); };
    const test2 = { set: 'test', cur: 'a1u02t' };
    const cases = [
      ['Today', at('Today')], ['Levels', at('Levels')], ['Teach', at('Teach')], ['Compare', at('Compare')], ['Drill', at('Drill')],
      ['Exam, a day\'s three questions', at('Exam')], ['Words', at('Words')], ['Reading', at('Reading')], ['Listening', at('Listening')],
      ['WeekTest', at('WeekTest', { cur: 'a1u02t' })],
      ['Exam, a week test with nothing answered', at('Exam', test2)],
      ['Exam, a week test under way', at('Exam', test2), answerFirst],
      ['Review', at('Review')],
      ['LevelExam, before it starts', at('LevelExam')],
      ['LevelExam, its first part under way', at('LevelExam'), startPart],
      ['Leer', at('Leer')],
      ['Escribir, a round', at('Escribir')],
      ['Hablar, its menu', at('Hablar')],
      ['Hablar, a round of «Escuchá y elegí»', at('Hablar'), () => tap(page, 'Empezar', 900)],
      ['Hablar, a round of «Repetí y compará»', at('Hablar'), async () => { await tap(page, 'Repetí y compará', 300); await tap(page, 'Empezar', 900); }],
      ['Placement', at('Placement')],
      ['Goal, its second step', '?gntest&screen=Goal', goal2],
      ['Goal, its third step', '?gntest&screen=Goal', goal3],
      ['Goal, opened on a plan that exists', at('Goal')],
      ['Notebook', at('Notebook'), null, camino], ['ExamTab', at('ExamTab'), null, camino], ['Progress', at('Progress'), null, camino],
    ];
    const told = [];
    let walked = 0;
    for (const [label, url, into, other] of cases) {
      const open = async () => { await go(page, url); if (into) await into(); await touch(); };
      await open();
      const before = await sig();
      const mine = await ownBack();
      await sysBack(page);
      const byBack = await sig();
      await open();
      await ownBack();
      if (mine) await page.locator('#gn-stage [data-flows-own="1"]').tap({ timeout: 4000 }).catch(() => {});
      else if (other) await tap(page, other, 0);
      await page.waitForTimeout(450);
      const byOwn = await sig();
      const good = byBack.screen !== 'OUT OF THE APP' && same(byBack, byOwn) && !same(byBack, before) && (mine ? mine.n === 1 && mine.marked : !!other);
      ok(good, `${label}: the system's back should do what ${mine ? 'the screen\'s own «' + mine.label + '» does' : 'leads to the week path'}, and that control should carry data-gn-back`, { before, byBack, byOwn, mine });
      if (good) { walked += 1; told.push(label + ' → ' + byBack.screen + (byBack.sheet ? ' «' + byBack.sheet + '»' : '')); }
    }
    if (walked === cases.length) pass(`the system's back does what the screen's own X or arrow does on all ${walked} screens and states (${told.join('; ')})`);

    /* three presses in a row, no touch in between, where the screen's own way back asks first: its sheet opens, closes
       and opens again, and nothing falls out of the app (the second press used to close the sheet with the history
       already at its end, and the third to leave) */
    for (const [label, url, into, sheet] of [
      ['the level exam', at('LevelExam'), startPart, '¿Salir del examen?'],
      ['a week test under way', at('Exam', test2), answerFirst, '¿Salir de la prueba?'],
      ['a round of Hablar', at('Hablar'), () => tap(page, 'Empezar', 900), 'Pausa'],
    ]) {
      await go(page, url);
      await into();
      await touch();
      const start = await sig();
      const seen = [];
      for (let n = 0; n < 3; n++) { await sysBack(page); seen.push(await sig()); }
      check(seen.every((x) => x.screen === start.screen) && seen[0].sheet === sheet && seen[1].sheet === '' && seen[2].sheet === sheet, `back pressed three times in ${label}: «${sheet}» opens, closes and opens again, and the app is never left`, seen.map((x) => x.screen + (x.sheet ? ' «' + x.sheet + '»' : '')));
      if (label === 'a week test under way') {
        await shot(page, 'S06-weektest-leaving');
        await tap(page, /Seguir con la prueba/, 500);
        check(same(await sig(), start) && /^a:Salir de la prueba de la semana/.test(await focusOf(page)), '«Seguir con la prueba» closes the sheet on the same question, the focus back on the cross', { now: await sig(), focus: await focusOf(page) });
        await tap(page, { aria: 'Salir de la prueba de la semana' }, 500);
        await tap(page, 'Salir sin guardar', 700);
        check((await screenOf(page)) === 'Main', '«Salir sin guardar» leaves the test for the week path', await screenOf(page));
      }
    }
    /* the placement check, opened from the goal screen's second step: back closes it onto that step, and back again is
       the step's own arrow (the history used to be at its end there: the second press left the app) */
    await go(page, '?gntest&screen=Goal');
    await tap(page, exact('vivo en Paraguay'), 250);
    await tap(page, 'Siguiente', 500);
    await tap(page, exact('todo'), 250);
    await page.locator('#gn-stage button').filter({ hasText: exact('nada') }).nth(1).tap();
    await page.waitForTimeout(300);
    await tap(page, 'Hacer la prueba', 800);
    const placed = [await screenOf(page), await depthOf(page)];
    await sysBack(page);
    const closed = await sig();
    await sysBack(page);
    const stepped = await sig();
    check(placed.join() === 'Placement,2' && closed.screen === 'Goal' && /^Paso 2 /.test(closed.step) && stepped.screen === 'Goal' && /^Paso 1 /.test(stepped.step) && inApp(), 'the placement check is one step deeper than the goal step it opened from: back closes it, and back again steps back in the goal', { placed, closed, stepped });

    /* A back that passes over an entry, as Chrome's back button does with one of two entries a single tap added (it
       cannot be made to skip here, so two steps are taken at once): the app takes one step up, to the day, and steps
       forward again, so the history is as deep as the app once more and the next back leads to the week path */
    await go(page, at('Today'));
    await tap(page, { sel: '#gn-stage a[href^="Teach"], #gn-stage a:has-text("la regla")' }, 600);
    const deepAt = [await screenOf(page), await depthOf(page)];
    await page.evaluate(() => { history.go(-2); });
    await page.waitForTimeout(700);
    const upAt = [inApp() ? await screenOf(page) : 'OUT OF THE APP', await depthOf(page)];
    await sysBack(page);
    check(deepAt.join() === 'Teach,2' && upAt.join() === 'Today,1' && inApp() && (await screenOf(page)) === 'Main' && (await depthOf(page)) === 0, 'a back that passes over an entry takes one step up, and the history is level again for the next', { deepAt, upAt, then: [inApp() ? await screenOf(page) : 'OUT OF THE APP', await depthOf(page)] });

    /* the shell's notice is not drawn over an open sheet (its last choice used to lie under the notice) */
    await go(page, at('Main'));
    await page.evaluate((code) => window.gnApp.importProgress(code), 'EPUA1:' + Buffer.from(JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(0), target: null, pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL } })).toString('base64'));
    await page.waitForTimeout(600);
    await tap(page, { sel: '#gn-stage a[href="GoalPlan.dc.html"]' }, 700);
    const onGoal = await noticeOf(page);
    await tap(page, { sel: '#gn-stage button[aria-haspopup="dialog"]' }, 600);
    const overSheet = [(await sheetOf(page)).open, await noticeOf(page)];
    await sysBack(page);
    check(/Progreso reemplazado/.test(onGoal) && overSheet[0] === true && overSheet[1] === '' && !(await sheetOf(page)).open && /Progreso reemplazado/.test(await noticeOf(page)), 'the notice gives way to an open sheet, and is back when the sheet closes', { onGoal, overSheet, after: await noticeOf(page) });

    /* A tap that takes its own control away and leads to another page of the same screen leaves the focus on that
       page's heading, not nowhere: the words lesson, from its sound step to its scene. Where the screen says itself what
       the tap did, in a live region (an exam that ends), the focus is left alone, so nothing cuts that short */
    await go(page, at('Words'));
    const soundStep = await sig();
    await tap(page, 'Siguiente: las palabras', 600);
    const scene = await sig();
    const onHead = await page.evaluate(() => { const host = document.querySelector('#gn-stage .sc-host .sc-host'); const h1 = host ? [...host.querySelectorAll('h1')].filter((e) => e.getClientRects().length)[0] : null; return !!h1 && document.activeElement === h1; });
    check(scene.screen === 'Words' && scene.h1 !== soundStep.h1 && onHead, 'a step of a lesson that takes its own button away opens with the focus on the new step\'s heading (it used to fall nowhere)', { soundStep, scene, focus: await focusOf(page) });
    await go(page, at('Exam'));
    const dayItems = await itemsOf(page, await page.evaluate(() => window.gnCourse.day('a1u02d2').grammar.exam.map((x) => (typeof x === 'string' ? x : x.id))));
    for (let i = 0; i < dayItems.length; i++) {
      await answerOne(page, dayItems[i], true);
      await tap(page, i < dayItems.length - 1 ? 'Siguiente' : exact('Terminar'), 350);
    }
    const spoken = await page.evaluate(() => [...document.querySelectorAll('#gn-stage .sc-host .sc-host [aria-live]')].map((e) => e.textContent.trim()).filter(Boolean).join(' | '));
    check(/Examen terminado: 3 de 3/.test(spoken) && !/^h1:/.test(await focusOf(page)), 'an exam that ends says so itself, in its live region: the focus is not moved over it', { spoken, focus: await focusOf(page) });
    await ctx.close();

    /* An iPhone gives a tapped button no focus: it stays on the heading the app focused when the screen opened. With
       that copied here (a press on a button or a link moves no focus), a sheet that closes must still give the focus
       back to the control that opened it, not to the heading */
    ctx = await phone(browser);
    await ctx.addInitScript(() => { document.addEventListener('mousedown', (e) => { if (e.target.closest && e.target.closest('button, a')) e.preventDefault(); }, true); });
    page = await newPage(ctx, 'focus as an iPhone gives it');
    await go(page, at('Main'));
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
    const onOpen = await focusOf(page);
    await tap(page, 'Pegar un progreso', 600);
    const inSheet = await sheetOf(page);
    await tap(page, 'Cancelar', 600);
    check(/^h1:/.test(onOpen) && inSheet.open && inSheet.focusIn && /^button:Pegar un progreso/.test(await focusOf(page)), 'where a tapped button gets no focus (an iPhone), a closed sheet still gives the focus back to the control that opened it', { onOpen, inSheet, after: await focusOf(page) });
    await ctx.close();

    /* a good code pasted where the save is a newer build's: the sheet says why nothing changed (it used to say the
       code was no good) */
    ctx = await phone(browser);
    page = await newPage(ctx, 'paste on a newer save');
    const newer = JSON.stringify({ v: 2, started: true, level: 'A1', plan: { start: iso(-3), target: null, pace: 'fit', minutes: 30 }, done: week1 });
    await page.addInitScript(([k, v]) => { Object.defineProperty(navigator, 'standalone', { get: () => true }); localStorage.setItem(k, v); }, [KEY, newer]);
    await go(page, '');
    await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 500);
    await tap(page, 'Pegar un progreso', 500);
    await page.locator('#gn-stage textarea').first().fill('EPUA1:' + Buffer.from(JSON.stringify({ v: 1, started: true, level: 'A1', plan: { start: iso(0), target: null, pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL } })).toString('base64'));
    await tap(page, 'Usar este progreso', 700);
    const why = await text(page);
    check((await screenOf(page)) === 'Progress' && /hay una versión más nueva de la app/.test(why) && !/Ese código no sirve/.test(why) && (await page.evaluate((k) => localStorage.getItem(k), KEY)) === newer, 'a good code pasted over a newer build\'s save is refused for what it is: the sheet says a newer version is there, and nothing is written', why.slice(-260));
    await ctx.close();
  }
}

/* ---------- V: the voice of the clips ----------
   Where the build has sound, the clips are a voice model's, and each screen that offers one says so with the same small
   tag, «voz sintética», next to its control, before anything is tapped; a screen reader hears what it means once a
   visit, in the shell's own live region, never in a control's. Progreso has the page that explains the voice, with
   the learner's switch, saved with the progress: off, every screen shows its written stand-in, as a build without
   sound does, and as a clip the voice must not say (sound/silent.json) does with the voice on. Listening's status
   line and the notebook's play card name the speaker by the clip's own cues. A build without sound files runs the
   silent half of this part alone. */
async function partV(browser) {
  const iso = (n) => { const d = new Date(Date.now() + n * DAY); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
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
  /* every tag on show: where it is, and whether a live region holds it (it must not: a tap would say it again) */
  const tags = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage span')].filter((el) => !el.children.length && el.textContent.trim() === 'voz sintética' && el.getBoundingClientRect().width > 0).map((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), live: !!el.closest('[aria-live], [role="status"], [role="alert"]'), px: getComputedStyle(el).fontSize, near: (el.parentElement.parentElement.textContent || '').replace(/\s+/g, ' ').slice(0, 60) };
  }));
  /* what the live regions say of the voice (the note, once a visit). The shell empties its region a few seconds after
     the note, so every change of it is written down from the page's start (VOZ, an init script) and «said once» is
     counted: notes() is every time the note was put in a live region, vozLog() every change, the emptying too */
  const VOZ = () => {
    window.__voz = [];
    let last = '';
    const look = () => { const t = [...document.querySelectorAll('[aria-live]')].map((e) => (e.textContent || '').trim()).filter((x) => /^Voz sintética:/.test(x)).join(' | '); if (t !== last) { last = t; window.__voz.push(t); } };
    new MutationObserver(look).observe(document, { subtree: true, childList: true, characterData: true });
  };
  const notes = (page) => page.evaluate(() => (window.__voz || []).filter(Boolean));
  const vozLog = (page) => page.evaluate(() => (window.__voz || []).slice());
  const clipIn = (page, key) => page.waitForFunction((k) => !!(window.__gnClips && window.__gnClips[k]), key, { timeout: 15000 }).then(() => true, () => false);
  const player = (page, key) => page.evaluate(async (k) => {
    const s = window.gnSound;
    s.on();
    await new Promise((r) => setTimeout(r, 160));
    return { has: s.has(k), kind: s.kind(k), ms: s.ms(k), on: s.on(), at: s.at(), over: s.over(), voice: s.synthetic() };
  }, key);
  const WHO = { N: 'Narrador', F: 'Mujer', M: 'Hombre' };
  const plan = { start: iso(0), target: null, pace: 'fit', minutes: 30 };
  const mistake = (src) => encodeURIComponent(JSON.stringify([{ src, wrong: 'Sin responder', at: 0, step: 0, due: '2020-01-01' }]));

  part = 'V1 the tag «voz sintética»';
  let ctx = await phone(browser);
  await ctx.addInitScript(VOZ);
  let page = await newPage(ctx, 'voice: the screens');
  await go(page, '?gntest&screen=Teach&level=A1&cur=a1u01d1');
  const sound = await page.evaluate(() => (window.__gnSoundFiles || []).length > 0);
  if (!sound) pass('this build has no sound files: the silent half of the part runs');
  if (sound) {
    /* Teach: one tag for the card of examples, there before the first tap; the clip plays and the button returns to rest */
    check(await clipIn(page, 'a1u01d1.p1.x0'), 'Teach: the unit\'s sound arrives (the first example has its clip)');
    let t = await tags(page);
    check(t.length === 1 && !t[0].live && /Ejemplos/.test(t[0].near) && parseFloat(t[0].px) >= 11, 'Teach: the examples card carries the tag «voz sintética» before anything is tapped, outside any live region', t);
    await page.waitForFunction(() => (window.__voz || []).some(Boolean), null, { timeout: 3000 }).catch(() => {});
    check((await notes(page)).length === 1 && !/\|/.test((await notes(page))[0]), 'the note that says what the tag means is in one live region, the shell\'s', await notes(page));
    const noteWas = (await notes(page))[0];
    await tap(page, { aria: 'Escuchar el ejemplo 1' }, 350);
    let p = await player(page, 'a1u01d1.p1.x0');
    check(await pressed(page, { aria: 'Escuchar el ejemplo 1' }), 'Teach: an example\'s sound button lights up while its clip plays');
    check(p.has && p.kind === 'synthetic' && p.ms > 500 && p.on && p.at > 0, 'Teach: the clip is really playing (the audio clock runs, the player is some way into it)', p);
    check(!(await has(page, 'no está grabado')), 'Teach: an example with a clip says nothing about a recording that is missing', (await text(page)).slice(0, 200));
    await page.waitForTimeout(p.ms + 500);
    p = await player(page, 'a1u01d1.p1.x0');
    check(!(await pressed(page, { aria: 'Escuchar el ejemplo 1' })) && p.over >= 0, 'Teach: when the clip ends the button is back at rest', p);
    await tap(page, { aria: 'Escuchar el ejemplo 2' }, 300);
    await tap(page, { aria: 'Escuchar el ejemplo 2' }, 200);
    t = await tags(page);
    const said = await notes(page);
    check(t.length === 1 && said.length === 1 && said[0] === noteWas, 'more taps add no tag and say nothing new: the note is said once, not at every tap', { t, said });
    /* said, the note does not stay in the page for a screen reader to come upon at the end of every later screen: the
       region is emptied a few seconds later, and a tap after that does not bring it back */
    await page.waitForFunction(() => window.__voz.length >= 2 && window.__voz[window.__voz.length - 1] === '', null, { timeout: 12000 }).catch(() => {});
    await tap(page, { aria: 'Escuchar el ejemplo 1' }, 300);
    await tap(page, { aria: 'Escuchar el ejemplo 1' }, 200);
    const log = await vozLog(page);
    const left = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-live]')].filter((el) => /Voz sintética:/.test(el.textContent || '')).length);
    check(log.filter(Boolean).length === 1 && log[log.length - 1] === '' && left === 0, 'a few seconds after it was said the shell\'s live region is empty again, and stays so at the next tap', log.map((x) => x.slice(0, 20)));
    await shot(page, 'V01-teach-tag');

    /* Words: a tag on each pair that plays, on the scene's word, and under «Escuchar» in the spelling pad */
    await go(page, '?gntest&screen=Words&level=A1&cur=a1u01d1');
    await clipIn(page, 'a1u01d1.s0b');
    const pairs = await page.evaluate(() => window.gnCourse.day('a1u01d1').words.sound.pairs.length);
    t = await tags(page);
    check(t.length === pairs && t.every((x) => !x.live && /^PAR \d DE \d/.test(x.near)), `Words: each of the ${pairs} pairs that play carries the tag in its head, before its speaker is tapped`, t);
    await tap(page, { aria: 'Escuchar la palabra del par 1' }, 700);
    /* the pairs' own live lines (the shell's note, said once, is not one of them) */
    const lines = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-live]')].map((el) => el.textContent.trim()).filter((t) => t && !/^Voz sintética:/.test(t)));
    check(lines.some((l) => /¿Cuál escuchaste\?/.test(l)) && !lines.some((l) => /programa|no está grabado/.test(l)) && (await tags(page)).length === pairs, 'Words: after the play the pair asks which word was heard; its live line says nothing of the voice, and no tag is added', lines);
    await shot(page, 'V02-words-pairs');
    await tap(page, 'Siguiente: las palabras', 600);
    t = await tags(page);
    check(t.length === 1 && !t[0].live, 'Words: the scene\'s word card carries the tag, under its speaker', t);
    await tap(page, { aria: 'Escuchar la palabra' }, 300);
    check((await tags(page)).length === 1 && !(await has(page, 'no está grabado')), 'Words: a word with a clip plays without a word about a missing recording');
    await go(page, '?gntest&screen=Words&level=A1&cur=a1u01d1&done=' + encodeURIComponent(JSON.stringify({ a1u01d1: { g: 3, ks: 1 } })));
    await clipIn(page, 'a1u01d1.s0b');
    t = await tags(page);
    const listen = await control(page, { aria: 'Escuchar la palabra' }).boundingBox();
    check(t.length === 1 && !t[0].live && listen && t[0].y >= listen.y + listen.height - 2 && t[0].y < listen.y + listen.height + 16 && t[0].x >= listen.x && t[0].x + t[0].w <= listen.x + listen.width + 1, 'Spell: the tag sits right under «Escuchar», within the button\'s width', { t, listen });
    await shot(page, 'V03-spell-tag');

    /* Listening: the tag at the end of the status line, and the status line keeping time with the clip's own cues */
    await go(page, '?gntest&screen=Listening&level=A1&cur=a1u01d1');
    await clipIn(page, 'a1u01d1.r1');
    /* who the status line names while each line of the clip is said: its speaker, or, for a line of the narrator that
       only says a reply's number («1»), the speaker of the reply it brings in (the two are one row: «Respuesta 1 de 3 · Hombre») */
    const lis = await page.evaluate(() => {
      const C = window.gnCourse;
      const sk = C.day('a1u01d1').skill;
      const said = sk.audio.map((l) => [l[0], C.plain(l[1]).trim()]);
      const who = said.map((l, k) => { let j = k; while (j < said.length - 1 && said[j][0] === 'N' && /^\d{1,2}\.?$/.test(said[j][1])) j += 1; return said[j][0]; });
      return { cues: window.gnSound.cues(sk.item.id), who, ms: window.gnSound.ms(sk.item.id) };
    });
    t = await tags(page);
    const playBox = await control(page, { aria: 'Reproducir el audio' }).boundingBox();
    check(t.length === 1 && !t[0].live && /Tocá el botón para escuchar/.test(t[0].near) && playBox && Math.abs(t[0].y - playBox.y) < 80, 'Listening: the tag stands at the end of the status line, beside the play button, before the first play', { t, playBox });
    check(Array.isArray(lis.cues) && lis.cues.length === lis.who.length, 'Listening: the clip carries a cue for each of its lines', lis);
    /* «Más despacio 0.8×» is shut where the clip has no slower take (the voice has one for one lesson only): it must not
       read as if the lesson's audio were missing */
    const slowTake = await page.evaluate(() => window.gnSound.has('a1u01d1.r1.slow'));
    const lisText = await text(page);
    check(slowTake || (/Más despacio 0\.8×\s*Todavía no hay versión lenta/.test(lisText) && !/no está grabado/.test(lisText)), 'Listening: «Más despacio», shut for a lesson whose clip has no slower take, says exactly that («Todavía no hay versión lenta»), not that something is not recorded', lisText.slice(0, 320));
    await tap(page, { aria: 'Reproducir el audio' }, 0);
    const samples = await page.evaluate(async (ms) => {
      const play = document.querySelector('#gn-stage [aria-label="Reproducir el audio"]');
      const status = play.nextElementSibling.children[1];
      const out = [];
      const t0 = Date.now();
      while (Date.now() - t0 < ms + 2500) {
        out.push({ at: window.gnSound.at(), status: status.textContent });
        if (window.gnSound.over() >= 0) break;
        await new Promise((r) => setTimeout(r, 90));
      }
      return out;
    }, lis.ms);
    /* a sample well inside a line (150 ms clear of its start and of its end) must name that line's speaker */
    const lineOf = (at) => { for (let k = 0; k < lis.cues.length; k++) { const from = k ? lis.cues[k - 1] + 250 : 0; if (at >= from + 150 && at <= lis.cues[k] - 150) return k; } return -1; };
    const inside = samples.map((s) => ({ k: lineOf(s.at), who: (/· (Narrador|Mujer|Hombre)/.exec(s.status) || [])[1] || '', status: s.status })).filter((s) => s.k >= 0);
    const off = inside.filter((s) => s.who !== WHO[lis.who[s.k]]);
    check(inside.length > 40 && off.length === 0, `Listening: while the clip plays, the status line names the speaker of the line being said, by the clip's cues (${inside.length} samples inside the ${lis.cues.length} lines, ${off.length} off)`, off.slice(0, 5));
    const greeting = inside.filter((s) => s.k === 1);
    check(greeting.length >= 3 && greeting.every((s) => s.who === 'Mujer'), `Listening: the woman's greeting is hers on the status line all along (${greeting.length} samples; by the lines' lengths in letters it read «Narrador» for most of it)`, greeting.slice(0, 4));
    /* the sampling stops the moment the player says the clip is over; the screen sees that on its next tick (80 ms) */
    await page.waitForFunction(() => /Escuchaste 1 vez/.test(document.querySelector('#gn-stage').textContent || ''), null, { timeout: 2000 }).catch(() => {});
    check(samples.some((s) => s.at > 1000) && /Escuchaste 1 vez/.test(await text(page)) && (await tags(page)).length === 1, 'Listening: the clip plays to its end, the status says it was heard once, and the tag is still the one', (await text(page)).slice(0, 200));
    await shot(page, 'V04-listening-tag');

    /* Review: the play card carries the tag and, while the clip plays, names who is speaking, outside its live region */
    await go(page, '?gntest&screen=Review&level=A1&m=' + mistake('a1u02d3.r1'));
    await clipIn(page, 'a1u02d3.r1');
    const rev = await page.evaluate(() => { const sk = window.gnCourse.day('a1u02d3').skill; return { cues: window.gnSound.cues(sk.item.id), who: sk.audio.map((l) => l[0]), ms: window.gnSound.ms(sk.item.id) }; });
    t = await tags(page);
    check(t.length === 1 && !t[0].live && /Escuchar/.test(t[0].near), 'Review: a listening item\'s play card carries the tag', t);
    await page.evaluate(() => { window.__card = document.querySelector('#gn-stage [aria-label="Escuchar el audio"]').parentElement; });
    await tap(page, { aria: 'Escuchar el audio' }, 0);
    const heard = await page.evaluate(async (ms) => {
      const out = [];
      const t0 = Date.now();
      while (Date.now() - t0 < ms + 1500) {
        const live = window.__card.querySelector('[aria-live]');
        out.push({ at: window.gnSound.at(), card: window.__card.textContent.replace(/\s+/g, ' '), live: live ? live.textContent : '' });
        if (window.gnSound.over() >= 0) break;
        await new Promise((r) => setTimeout(r, 90));
      }
      return out;
    }, rev.ms);
    const rowOf = (at) => { for (let k = 0; k < rev.cues.length; k++) { const from = k ? rev.cues[k - 1] + 250 : 0; if (at >= from + 200 && at <= rev.cues[k] - 200) return k; } return -1; };
    const named = heard.map((s) => ({ k: rowOf(s.at), who: (/· (Narrador|Mujer|Hombre)/.exec(s.card) || [])[1] || '', live: s.live })).filter((s) => s.k >= 0);
    const wrong = named.filter((s) => s.who !== WHO[rev.who[s.k]]);
    check(named.length > 20 && wrong.length === 0 && ['Mujer', 'Hombre'].every((w) => named.some((s) => s.who === w)), `Review: while the clip plays, the card names who is speaking, the woman and the man in turn (${named.length} samples, ${wrong.length} off)`, wrong.slice(0, 4));
    check(heard.every((s) => !/Narrador|Mujer|Hombre|Línea/.test(s.live)), 'Review: the speaker\'s name stands beside the note, not in its live region (a screen reader does not talk over the clip at every line)', heard.map((s) => s.live).filter((l, i, a) => a.indexOf(l) === i));
    await shot(page, 'V05-review-tag');

    /* the placement check and Hablar */
    await go(page, '?gntest&screen=Hablar&level=A1');
    await clipIn(page, 's0');
    const menu = await text(page);
    check(/Los audios los dice una voz sintética\./.test(menu) && !/cada botón de sonido se ilumina sin sonar/.test(menu), 'Hablar: the menu says the audios are a synthetic voice\'s, not that every sound button lights up in silence', menu.slice(-320));
    const quiet = await page.evaluate(() => { const ids = {}; ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].forEach((p) => { ids[p] = !(window.gnSound.has(p + '.0') && window.gnSound.has(p + '.1')); }); return Object.keys(ids).filter((k) => ids[k]).length; });
    check(quiet === 0 || new RegExp('Todavía no tienen? audio (un par|' + quiet + ' de los 8 pares|los pares)').test(menu), `Hablar: the menu says how many pairs have no audio (${quiet} of 8)`, menu.slice(-320));
    await tap(page, 'Empezar', 1200);
    let dock = [];
    /* The round deals its pairs in an order of its own, and half of them have no clip. A silent card left to fall
       comes back two cards later, so when three silent pairs are dealt first they turn among themselves for good
       and no card with a clip ever comes into play: one round in fourteen, in which this check found no tag
       however long it waited. A silent card shows its word («La palabra · …»): the card that carries it is tapped,
       as a learner does, and the round goes on to the next pair */
    for (let i = 0; i < 40 && !dock.length; i++) {
      dock = await tags(page);
      if (dock.length) break;
      const shown = ((await text(page)).match(/La palabra · (\S+)/) || [])[1];
      if (shown) await page.locator(`xpath=//*[@id="gn-stage"]//button[span[@lang="gn" and normalize-space(.)="${shown}"]]`).first().tap({ timeout: 600 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const round = await text(page);
    check(dock.length === 1 && !dock[0].live && /Tocá la palabra que escuchaste/.test(round), 'Hablar: while a card with a clip is in play, the dock carries the tag, outside its live lines', { dock, round: round.slice(-260) });
    await shot(page, 'V06-hablar-tag');
  }
  await ctx.close();

  part = 'V2 a clip the voice must not say, and a build without sound';
  ctx = await phone(browser);
  page = await newPage(ctx, 'voice: the silent clips');
  /* unit 1 day 3's listening is silent by rule where the voice exists, and silent like every other in a build without sound */
  await go(page, '?gntest&screen=Listening&level=A1&cur=a1u01d3');
  if (sound) await clipIn(page, 'a1u01d3.p1.x0');
  const mute = await page.evaluate(() => !window.gnSound.has(window.gnCourse.day('a1u01d3').skill.item.id));
  check(mute, 'the listening lesson of unit 1 day 3 has no clip (the synthetic voice must not say it: sound/silent.json)');
  let st = await text(page);
  check(/Todavía no está grabado: se reproduce en silencio\./.test(st) && (await tags(page)).length === 0, 'Listening without a clip says so before the tap, and carries no tag', st.slice(0, 260));
  await tap(page, { aria: 'Reproducir el audio' }, 900);
  st = await text(page);
  check(/Transcripción/.test(st) && /Este audio todavía no está grabado: leé lo que se dice\./.test(st) && !(await shut(page, { sel: '#gn-stage button[aria-label^="Respuesta 1"]' })), 'Listening without a clip: the first tap opens the transcript, to be read, and the answers with it', st.slice(0, 300));
  await shot(page, 'V07-listening-silent');
  /* the nasal pairs of unit 1 day 2: no pair plays */
  await go(page, '?gntest&screen=Words&level=A1&cur=a1u01d2');
  if (sound) await clipIn(page, 'a1u01d2.p1.x0');
  st = await text(page);
  check(/MIRÁ Y ELEGÍ/.test(st) && /estos pares todavía no tienen audio/.test(st) && /Tocá el parlante: te mostramos la palabra\./.test(st) && (await tags(page)).length === 0, 'Words: a sound step whose pairs have no clip is read («Mirá y elegí»), says its pairs have no audio yet, and carries no tag', st.slice(0, 300));
  await tap(page, { aria: 'Escuchar la palabra del par 1' }, 500);
  st = await text(page);
  check(/La palabra: /.test(st) && /Este audio todavía no está grabado\./.test(st), 'Words: a pair without a clip shows the word its speaker stands for, and says the audio is not recorded yet', st.slice(0, 400));
  await shot(page, 'V08-words-nasal');
  if (sound) {
    /* unit 1 day 4: one pair silent by rule, two that play */
    await go(page, '?gntest&screen=Words&level=A1&cur=a1u01d4');
    await clipIn(page, 'a1u01d4.s1b');
    st = await text(page);
    const mixed = await tags(page);
    check(/ESCUCHÁ Y ELEGÍ/.test(st) && /Un par todavía no tiene audio: ahí te mostramos la palabra\./.test(st) && mixed.length === 2 && mixed.every((x) => /^PAR [23] DE 3/.test(x.near)), 'Words: with one pair silent and two that play, the step is heard, says one pair has no audio, and tags the two that play', { mixed, st: st.slice(0, 260) });
    await shot(page, 'V09-words-mixed');
    /* a Teach card with one example the voice must not say */
    await go(page, '?gntest&screen=Teach&level=A1&cur=a1u03d5&tp=1');
    await clipIn(page, 'a1u03d5.p2.x0');
    const ex = await page.evaluate(() => { const p = window.gnCourse.day('a1u03d5').grammar.points[1]; return p.examples.map((x, n) => window.gnSound.has(p.id + '.x' + n)); });
    const dumb = ex.indexOf(false);
    check(dumb >= 0 && ex.some(Boolean), 'a Teach card of unit 3 day 5 has examples with a clip and one without', ex);
    if (dumb >= 0) {
      await tap(page, { aria: 'Escuchar el ejemplo ' + (dumb + 1) }, 400);
      st = await text(page);
      check(/Este audio todavía no está grabado\./.test(st) && (await tags(page)).length === 1, 'Teach: the example without a clip says its audio is not recorded yet; the card keeps its one tag for those that play', st.slice(-300));
    }
  }
  await ctx.close();

  part = 'V3 the page that explains the voice, and its switch';
  ({ ctx, page } = await learner('learner V', { plan }));
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  const door = page.locator('#gn-stage button[aria-haspopup="dialog"]:has-text("Voz sintética")');
  if (!sound) {
    check((await door.count()) === 0, 'a build without sound: Progreso offers no page about a voice');
    await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
    await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
    await tap(page, 'Empezar con la regla', 700);
    await tap(page, { aria: 'Escuchar el ejemplo 1' }, 300);
    check(await pressed(page, { aria: 'Escuchar el ejemplo 1' }) && (await has(page, 'Este audio todavía no está grabado.')) && (await tags(page)).length === 0, 'a build without sound: an example\'s button lights up in silence (the stand-in), says the audio is not recorded yet, and no tag shows');
    await ctx.close();
    return;
  }
  check((await door.count()) === 1 && /activada/.test((await door.getAttribute('aria-label')) || '') && (await page.evaluate(() => window.gnSound.synthetic())), 'Progreso has the door «Voz sintética», and a save from before the switch existed loads with the voice on', await door.getAttribute('aria-label').catch(() => null));
  await door.tap();
  await page.waitForTimeout(500);
  const sheet = (await page.locator('#gn-stage [role="dialog"]').textContent()).replace(/\s+/g, ' ');
  check(/un programa/.test(sheet) && /MMS, de Meta/.test(sheet) && /no una persona/.test(sheet) && /ningún hablante nativo/.test(sheet), 'the sheet says what the voice is: a program\'s (Meta\'s MMS), not a person\'s, not yet checked by a native speaker', sheet.slice(0, 260));
  check(/vocales nasales/.test(sheet) && /una sola voz/.test(sheet) && /nombres y los números en castellano/.test(sheet), 'and what it does badly: the nasal vowels (their pairs stay silent), one voice for both speakers of a dialogue, Spanish names and numbers', sheet.slice(200, 560));
  check(/quedan en silencio a propósito/.test(sheet) && /todavía no está grabado/.test(sheet) && /grabaciones de hablantes nativos van a reemplazar/.test(sheet) && /CC BY-NC 4\.0/.test(sheet), 'and that some words wait in silence for a person\'s recording, that recordings will replace the voice, and its licence', sheet.slice(500));
  check(/MB/.test(sheet), 'and what the sound weighs', sheet.slice(600));
  /* what the review of the voice asked the sheet for: the sounds sound/VOICE.md marks «in part» or «not» besides the
     nasal vowels, in a learner's words; the sheet still fitting without a scroll; and the whole text of the licences,
     one step away and one step back */
  check(/A veces falla en la sílaba fuerte, en el puso \('\) después de o, u, y, y en la r al empezar una palabra\./.test(sheet), 'and what else it does badly: the stressed syllable, the puso after o, u and y, the r that opens a word', sheet.slice(200, 640));
  const fit = await page.evaluate(() => { const d = document.querySelector('#gn-stage [role="dialog"]'); const r = d.getBoundingClientRect(); return { scroll: d.scrollHeight, client: d.clientHeight, top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight }; });
  check(fit.scroll <= fit.client + 1 && fit.top >= 0 && fit.bottom <= fit.vh + 1, 'the sheet shows whole, with nothing to scroll', fit);
  await tap(page, { aria: 'Ver el texto de las licencias' }, 900);
  const licText = (await page.locator('#gn-stage [role="dialog"]').textContent()).replace(/\s+/g, ' ');
  check(/^\s*Licencias/.test(licText) && /MMS-TTS/.test(licText) && /CC BY-NC 4\.0/.test(licText) && /creativecommons\.org\/licenses\/by-nc\/4\.0/.test(licText) && /Open Font License/.test(licText) && /Volver/.test(licText), '«Licencias», beside the credit, shows the whole text of the app\'s licences in the sheet: the voice\'s credit with its addresses, the typefaces\' licence', licText.slice(0, 160));
  await shot(page, 'V10b-voice-licences');
  await sysBack(page);
  const backTo = await page.evaluate(() => { const d = document.querySelector('#gn-stage [role="dialog"]'); return d ? d.querySelector('h2').textContent : null; });
  check(backTo === 'Voz sintética' && (await screenOf(page)) === 'Progress', 'the system\'s back from the licences leads one step back, to the sheet (not out of it, not out of the app)', backTo);
  const sw = page.locator('#gn-stage [role="dialog"] [role="switch"]');
  check((await sw.getAttribute('aria-checked')) === 'true' && /Usar la voz sintética/.test((await sw.textContent()) || ''), 'the switch «Usar la voz sintética» is on');
  await look(page, 'the voice sheet', { expect: 'Progress', shot: 'V10-voice-sheet' });
  await sw.tap();
  await page.waitForTimeout(400);
  let s = await saved(page);
  let pl = await page.evaluate(() => ({ voice: window.gnSound.synthetic(), has: window.gnSound.has('a1u01d1.p1.x0'), kind: window.gnSound.kind('a1u01d1.p1.x0'), loaded: !!(window.__gnClips || {})['a1u01d1.p1.x0'] }));
  check(s && s.voice === false && (await sw.getAttribute('aria-checked')) === 'false' && pl.voice === false && !pl.has && pl.kind === '', 'turned off, the switch is saved with the progress (voice: false) and the player has no synthetic clip any more', { saved: s && s.voice, pl });
  await tap(page, 'Listo', 500);
  check(/apagada/.test((await door.getAttribute('aria-label')) || ''), 'the door says the voice is off', await door.getAttribute('aria-label'));
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
  await tap(page, 'Empezar con la regla', 700);
  check((await tags(page)).length === 0, 'with the voice off, the Teach card carries no tag');
  await tap(page, { aria: 'Escuchar el ejemplo 1' }, 350);
  /* (this check asked for «Este audio todavía no está grabado.» here: true of a person's recording, but not the reason
     this learner hears nothing; the review of the voice asked for the sentence to say the voice was turned off) */
  check(await pressed(page, { aria: 'Escuchar el ejemplo 1' }) && (await has(page, 'Apagaste la voz sintética: la activás de nuevo en Progreso.')) && !(await has(page, 'no está grabado')), 'with the voice off, an example\'s button lights up in silence (the stand-in) and says the learner turned the voice off, and where it is turned on again', (await text(page)).slice(-260));
  await shot(page, 'V11-teach-voice-off');
  await reload(page);
  s = await saved(page);
  check(s && s.voice === false && !(await page.evaluate(() => window.gnSound.synthetic())), 'after a reload the voice is still off', s && s.voice);
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  await door.tap();
  await page.waitForTimeout(400);
  await sw.tap();
  await page.waitForTimeout(400);
  s = await saved(page);
  check(s && s.voice === true && (await page.evaluate(() => window.gnSound.synthetic())), 'turned on again, it is saved on', s && s.voice);
  await tap(page, 'Listo', 500);
  await tap(page, { sel: '#gn-stage nav a:has-text("Camino")' }, 500);
  await tap(page, { sel: '#gn-stage a[href="Today.dc.html"]:has-text("Empezar")' }, 700);
  await tap(page, 'Empezar con la regla', 700);
  await clipIn(page, 'a1u01d1.p1.x0');
  await page.waitForTimeout(300);
  check((await tags(page)).length === 1, 'and the tag is back on the Teach card', await tags(page));
  await ctx.close();
  await partVmore(browser, { iso, tags, notes, VOZ, clipIn, plan, mistake });
}

/* ---------- V, the rest: what a review of the voice in the app found, each as the check that would have caught it ---------- */
async function partVmore(browser, h) {
  const { tags, notes, VOZ, clipIn, plan, mistake } = h;
  const U1 = /\/gn-sound-a1-u01\.js$/;
  const stateOf = (page, key) => page.evaluate((k) => window.gnCourse.soundState(k), key);
  const until = (page, key, st, ms) => page.waitForFunction(([k, s]) => window.gnCourse.soundState(k) === s, [key, st], { timeout: ms || 8000 }).then(() => true, () => false);
  /* what the live regions of the screen say (the shell's own, the waiting note of the later screens, is not the screen's) */
  const lives = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-live], #gn-stage [role="status"]')].map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean));
  /* is sound coming out, and how far into its clip is the player? */
  const playing = (page) => page.evaluate(async () => { const s = window.gnSound; s.on(); await new Promise((r) => setTimeout(r, 220)); return { at: s.at(), on: s.on() }; });
  /* a screen opened by the test hook while the server holds a sound file back (mode 'hold': until release()) or
     refuses it (mode 'fail'). The page is not waited for to finish loading: a file that is held back is part of that */
  const open = async (url, file, mode, label) => {
    net.hold = mode === 'hold' ? file : null;
    net.fail = mode === 'fail' ? file : null;
    const ctx = await phone(browser);
    await ctx.addInitScript(VOZ);
    const page = await newPage(ctx, 'voice: ' + label + (mode === 'fail' ? ', its sound file refused' : mode === 'hold' ? ', its sound file held back' : ''));
    if (mode === 'fail') page.__expect = /503|Failed to load resource|gn-sound-/;
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded' });
    await ready(page);
    return { ctx, page };
  };
  const shutAll = async (ctx) => { release(); net.fail = null; await ctx.close(); };
  const NOT = /no está grabado|Todavía no está grabado|todavía no tienen? audio/;
  let ctx;
  let page;
  let t;

  part = 'V4 the words lesson\'s note belongs to the word it is true of';
  ({ ctx, page } = await open('?gntest&screen=Words&level=A1&cur=a1u01d1', null, '', 'the scene\'s words'));
  await clipIn(page, 'a1u01d1.p1.x0');
  /* a day of unit 1 whose scene has a word with a clip and a word without (asked of the player: the clips change) */
  const scene = await page.evaluate(() => {
    const C = window.gnCourse;
    const S = window.gnSound;
    for (const x of C.sessions()) {
      if (x.unit !== 1 || !x.ready || x.kind === 'test') continue;
      const w = (C.day(x.id).words || {}).words || [];
      const loud = w.filter((y) => S.has(x.id + '.w.' + y.id));
      const mute = w.filter((y) => !S.has(x.id + '.w.' + y.id));
      if (loud.length && mute.length) return { sid: x.id, loud: loud[0].gn, mute: mute[0].gn, mute2: (mute[1] || mute[0]).gn, sound: !!(C.day(x.id).words.sound && C.day(x.id).words.sound.focus) };
    }
    return null;
  });
  check(!!scene, 'a day of unit 1 has, in one scene, a word with a clip and a word the voice does not say', scene);
  if (scene) {
    await go(page, '?gntest&screen=Words&level=A1&cur=' + scene.sid);
    await clipIn(page, 'a1u01d1.p1.x0');
    /* a silent pair first, where the day has one: its note used to be the lesson's only one */
    if (scene.sound) {
      const quiet = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-label^="Escuchar la palabra del par"]')].map((b) => b.getAttribute('aria-label')).filter((a, i) => { const card = document.querySelectorAll('#gn-stage [aria-label^="Escuchar la palabra del par"]')[i].parentElement.parentElement; return !/voz sintética/.test(card.textContent); }));
      if (quiet.length) { await tap(page, { aria: quiet[0] }, 500); check(/Este audio todavía no está grabado\./.test(await text(page)), 'a pair without a clip, tapped first, says its audio is not recorded yet', quiet[0]); }
      await tap(page, 'Siguiente: las palabras', 600);
    }
    const word = (gn) => ({ sel: `xpath=//*[@id="gn-stage"]//button[normalize-space(.)="${gn}"]` });
    const card = async () => { const all = await text(page); return { note: /Este audio todavía no está grabado\./.test(all), tag: (await tags(page)).length, live: (await lives(page)).filter((l) => /grabado|Cargando|cargar/.test(l)) }; };
    await tap(page, word(scene.mute), 350);
    await tap(page, { aria: 'Escuchar la palabra' }, 350);
    let c = await card();
    check(c.note && c.tag === 0 && c.live.length === 1 && (await pressed(page, { aria: 'Escuchar la palabra' })), 'the scene: a word without a clip lights its speaker in silence and its card says the audio is not recorded yet, whatever was tapped before', c);
    await tap(page, word(scene.loud), 350);
    c = await card();
    check(!c.note && c.tag === 1, 'another word is picked: the note goes with the word it was true of, and the word with a clip carries the tag', c);
    await tap(page, { aria: 'Escuchar la palabra' }, 450);
    c = await card();
    const p = await playing(page);
    check(!c.note && c.tag === 1 && p.at > 0, 'the word with a clip plays under its tag with no word about a missing recording on its card', { c, p });
    await shot(page, 'V12-scene-word-with-clip');
    await tap(page, word(scene.mute2), 350);
    c = await card();
    check(!c.note && c.tag === 0, 'a silent word picked again: its card says nothing until its speaker is tapped', c);
    await tap(page, { aria: 'Escuchar la palabra' }, 350);
    c = await card();
    check(c.note && c.tag === 0, 'and says it again when it is: every silent word, not once a lesson', c);
    await shot(page, 'V13-scene-silent-word');
  }
  await ctx.close();

  part = 'V5 a sound file on its way, and one that could not be fetched';
  /* Teach */
  const EX = { aria: 'Escuchar el ejemplo 1' };
  ({ ctx, page } = await open('?gntest&screen=Teach&level=A1&cur=a1u01d1', U1, 'hold', 'Teach'));
  t = await text(page);
  check((await stateOf(page, 'a1u01d1.p1.x0')) === 'coming' && /cargando el audio…/.test(t) && !NOT.test(t) && (await tags(page)).length === 0, 'Teach, the unit\'s sound still on its way: the card says «cargando el audio…» where the tag goes, and nothing says the audio is not recorded', t.slice(-220));
  await tap(page, EX, 350);
  t = await text(page);
  check(!(await pressed(page, EX)) && (await lives(page)).includes('Cargando el audio…') && !NOT.test(t), 'Teach: a tapped example waits: nothing lights up, no stand-in runs, and its line says «Cargando el audio…», once, in a polite live region', await lives(page));
  await shot(page, 'V14-teach-waiting');
  release();
  await clipIn(page, 'a1u01d1.p1.x0');
  await page.waitForTimeout(500);
  let pl = await playing(page);
  t = await text(page);
  check(pl.at > 0 && (await pressed(page, EX)) && (await tags(page)).length === 1 && !/[Cc]argando el audio/.test(t) && !NOT.test(t), 'Teach: when the file arrives the example that waited plays by itself, the tag stands where «cargando…» was, and no note is left', { pl, t: t.slice(-160) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Teach&level=A1&cur=a1u01d1', U1, 'fail', 'Teach'));
  await until(page, 'a1u01d1.p1.x0', 'failed');
  await tap(page, EX, 350);
  t = await text(page);
  check((await pressed(page, EX)) && /No se pudo cargar el audio\./.test(t) && !NOT.test(t), 'Teach, the file could not be fetched: the example lights up in silence and says the audio could not be loaded, not that it is not recorded', t.slice(-200));
  await shutAll(ctx);

  /* Words: a sound pair, then the scene's word */
  const PAIR = { aria: 'Escuchar la palabra del par 1' };
  const pairOpts = (page) => page.evaluate(() => [...document.querySelector('#gn-stage [aria-label="Escuchar la palabra del par 1"]').parentElement.querySelectorAll('button[aria-disabled]')].map((b) => b.getAttribute('aria-disabled')));
  const pairKey = (page) => page.evaluate(() => { const p = window.gnCourse.day('a1u01d1').words.sound.pairs[0]; return 'a1u01d1.s0' + (window.gnSpell.shuffle([0, 1], p[0] + '|' + p[2])[0] ? 'b' : 'a'); });
  ({ ctx, page } = await open('?gntest&screen=Words&level=A1&cur=a1u01d1', U1, 'hold', 'Words'));
  const PK = await pairKey(page);
  t = await text(page);
  check((await stateOf(page, PK)) === 'coming' && /cargando el audio…/.test(t) && /escuchá la diferencia en cada par/.test(t) && !NOT.test(t) && !/te mostramos la palabra/.test(t), 'Words, the sound still on its way: the pairs wait («cargando el audio…»), and the step does not say they have no audio', t.slice(0, 260));
  await tap(page, PAIR, 400);
  t = await text(page);
  check(!(await pressed(page, PAIR)) && (await lives(page)).includes('Cargando el audio…') && !/La palabra: /.test(t) && (await pairOpts(page)).every((x) => x === 'true'), 'Words: a tapped pair waits: its word is not shown (that would be the answer), its two options stay shut, its line says «Cargando el audio…»', { lives: await lives(page), opts: await pairOpts(page) });
  await shot(page, 'V15-words-pair-waiting');
  release();
  await clipIn(page, PK);
  await page.waitForTimeout(500);
  pl = await playing(page);
  t = await text(page);
  check(pl.at > 0 && /¿Cuál escuchaste\?/.test(t) && (await pairOpts(page)).every((x) => x === 'false') && (await tags(page)).length >= 1 && !/[Cc]argando el audio/.test(t), 'Words: when the file arrives the pair that waited plays by itself and asks which word was heard; no «cargando» is left', { pl, t: t.slice(0, 200) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Words&level=A1&cur=a1u01d1', U1, 'fail', 'Words'));
  await until(page, PK, 'failed');
  t = await text(page);
  check(/no se pudo cargar el audio de estos pares/.test(t) && /MIRÁ Y ELEGÍ/.test(t) && !NOT.test(t), 'Words, the file could not be fetched: the step is read, and says the audio of its pairs could not be loaded', t.slice(0, 260));
  await tap(page, PAIR, 500);
  t = await text(page);
  check(/La palabra: /.test(t) && /No se pudo cargar el audio\./.test(t) && !NOT.test(t), 'Words: a pair then shows the word its speaker stands for, and says the audio could not be loaded', t.slice(0, 420));
  /* the connection comes back and the file with it: the pair that was read stays read, nothing flips under the learner */
  net.fail = null;
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await clipIn(page, PK);
  await page.waitForTimeout(1500);
  t = await text(page);
  const head1 = await page.evaluate(() => document.querySelector('#gn-stage [aria-label="Escuchar la palabra del par 1"]').parentElement.parentElement.textContent.replace(/\s+/g, ' '));
  check(/¿Cuál era\?/.test(head1) && /No se pudo cargar el audio\./.test(head1) && !/voz sintética/.test(head1) && (await tags(page)).length >= 1, 'Words: the file arrives late: the pair that was read stays read with its note, the pairs not yet tapped get their clips and their tag', head1.slice(0, 200));
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Words&level=A1&cur=a1u01d1', U1, 'hold', 'Words, the scene'));
  await tap(page, 'Siguiente: las palabras', 500);
  const HEAR = { aria: 'Escuchar la palabra' };
  await tap(page, HEAR, 350);
  t = await text(page);
  check(!(await pressed(page, HEAR)) && (await lives(page)).includes('Cargando el audio…') && !NOT.test(t), 'Words, the scene: a word tapped while its clip is on its way waits and says «Cargando el audio…»', await lives(page));
  release();
  await clipIn(page, 'a1u01d1.p1.x0');
  await page.waitForTimeout(500);
  pl = await playing(page);
  t = await text(page);
  const firstWord = await page.evaluate(() => { const w = window.gnCourse.day('a1u01d1').words.words[0]; return window.gnSound.has('a1u01d1.w.' + w.id); });
  check(firstWord ? pl.at > 0 && (await tags(page)).length === 1 && !/[Cc]argando el audio/.test(t) && !NOT.test(t) : !/[Cc]argando el audio/.test(t), 'Words, the scene: when the file arrives the word that waited plays by itself under its tag, with no note left', { pl, firstWord });
  await shutAll(ctx);

  /* Spell: «Escuchar» in the spelling pad */
  const spellUrl = '?gntest&screen=Words&level=A1&cur=a1u01d1&done=' + encodeURIComponent(JSON.stringify({ a1u01d1: { g: 3, ks: 1 } }));
  ({ ctx, page } = await open(spellUrl, U1, 'hold', 'Spell'));
  t = await text(page);
  check(/cargando el audio…/.test(t) && !NOT.test(t) && (await tags(page)).length === 0, 'Spell, the sound still on its way: «cargando el audio…» stands under «Escuchar»', t.slice(-200));
  await tap(page, HEAR, 350);
  check(!(await pressed(page, HEAR)) && (await lives(page)).includes('Cargando el audio…'), 'Spell: «Escuchar», tapped, waits: the line says «Cargando el audio…» and the button does not light up', await lives(page));
  release();
  await clipIn(page, 'a1u01d1.p1.x0');
  await page.waitForTimeout(500);
  const spellClip = await page.evaluate(() => { const w = window.gnCourse.day('a1u01d1').words; return window.gnSound.has('a1u01d1.w.' + w.spell[0]); });
  pl = await playing(page);
  t = await text(page);
  check(spellClip ? pl.at > 0 && (await tags(page)).length === 1 && !/[Cc]argando el audio/.test(t) : !/[Cc]argando el audio/.test(t), 'Spell: when the file arrives the word plays by itself and the tag stands under «Escuchar»', { pl, spellClip });
  await shutAll(ctx);
  ({ ctx, page } = await open(spellUrl, U1, 'fail', 'Spell'));
  await until(page, 'a1u01d1.p1.x0', 'failed');
  await tap(page, HEAR, 300);
  t = await text(page);
  check(/No se pudo cargar el audio\./.test(t) && !NOT.test(t), 'Spell, the file could not be fetched: the line says the audio could not be loaded', t.slice(-260));
  await shutAll(ctx);

  /* Listening: its «Escuchá primero» rule holds while the clip is on its way; then the limit of the wait, and a
     transcript that stays open when the file arrives after all */
  const PLAY = { aria: 'Reproducir el audio' };
  const A1 = { sel: '#gn-stage button[aria-label^="Respuesta 1"]' };
  ({ ctx, page } = await open('?gntest&screen=Listening&level=A1&cur=a1u01d1', U1, 'hold', 'Listening'));
  t = await text(page);
  check((await stateOf(page, 'a1u01d1.r1')) === 'coming' && /Cargando el audio…/.test(t) && !NOT.test(t) && !/Transcripción/.test(t) && (await shut(page, A1)) && /Escuchá primero/.test(t), 'Listening, the sound still on its way: the status line says «Cargando el audio…», not that it is not recorded; no transcript, the answers shut', t.slice(0, 320));
  await tap(page, PLAY, 500);
  t = await text(page);
  check((await lives(page)).includes('Cargando el audio…') && !/Transcripción/.test(t) && (await shut(page, A1)), 'Listening: play, tapped, waits: «Cargando el audio…» is said politely, the transcript stays shut and so do the answers (nothing is given away)', await lives(page));
  await shot(page, 'V16-listening-waiting');
  release();
  await clipIn(page, 'a1u01d1.r1');
  await page.waitForTimeout(600);
  pl = await playing(page);
  t = await text(page);
  check(pl.at > 0 && !/Transcripción/.test(t) && (await shut(page, A1)) && (await tags(page)).length === 1 && !/Cargando el audio/.test(t), 'Listening: when the file arrives the clip plays by itself; no transcript, the answers still wait for the end of the listening, the tag is there', { pl, t: t.slice(0, 260) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Listening&level=A1&cur=a1u01d1', U1, 'hold', 'Listening, too long in coming'));
  const t0 = Date.now();
  const late = await until(page, 'a1u01d1.r1', 'failed', 30000);
  const waited = Date.now() - t0;
  await page.waitForTimeout(300);
  t = await text(page);
  check(late && waited > 17000 && waited < 26000 && /No se pudo cargar el audio: se reproduce en silencio\./.test(t) && !NOT.test(t) && !/Transcripción/.test(t), `Listening, the file too long in coming (the wait ended after ${(waited / 1000).toFixed(1)} s; the engine's limit is 20 s): the status line says the audio could not be loaded, by itself`, t.slice(0, 300));
  await tap(page, PLAY, 700);
  t = await text(page);
  check(/Transcripción/.test(t) && /No se pudo cargar el audio: leé lo que se dice\./.test(t) && !(await shut(page, A1)) && !NOT.test(t), 'Listening: the first tap then opens the transcript and the answers, under «No se pudo cargar el audio: leé lo que se dice.»', t.slice(0, 380));
  release();
  await clipIn(page, 'a1u01d1.r1');
  await page.waitForTimeout(700);
  pl = await playing(page);
  t = await text(page);
  check(/Transcripción/.test(t) && !(await shut(page, A1)) && (await tags(page)).length === 0 && !(pl.at > 0 && pl.on), 'Listening: the file arrives after all: the transcript stays open and the answers too, no tag appears and nothing starts to play (nothing flips under the learner)', { pl, t: t.slice(0, 200) });
  await shot(page, 'V17-listening-late-file');
  await shutAll(ctx);

  /* Review: the notebook's play card */
  const HEARQ = { aria: 'Escuchar el audio' };
  const revUrl = '?gntest&screen=Review&level=A1&m=' + mistake('a1u01d1.r1');
  const optsShut = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].filter((b) => !b.getAttribute('aria-label')).map((b) => b.disabled));
  ({ ctx, page } = await open(revUrl, U1, 'hold', 'Review'));
  t = await text(page);
  check((await stateOf(page, 'a1u01d1.r1')) === 'coming' && /Cargando el audio…/.test(t) && !NOT.test(t) && !/Transcripción/.test(t) && (await optsShut(page)).every(Boolean), 'Review, the sound still on its way: the play card says «Cargando el audio…», the options stay shut and no transcript shows', t.slice(0, 300));
  await tap(page, HEARQ, 400);
  t = await text(page);
  check((await lives(page)).includes('Cargando el audio…') && !/Transcripción/.test(t) && (await optsShut(page)).every(Boolean), 'Review: «Escuchar», tapped, waits: said politely, nothing opened', await lives(page));
  release();
  await clipIn(page, 'a1u01d1.r1');
  await page.waitForTimeout(600);
  pl = await playing(page);
  t = await text(page);
  check(pl.at > 0 && /Sonando…/.test(t) && !/Transcripción/.test(t) && (await tags(page)).length === 1, 'Review: when the file arrives the clip plays by itself («Sonando…»), with its tag and no transcript', { pl, t: t.slice(0, 240) });
  await shutAll(ctx);
  ({ ctx, page } = await open(revUrl, U1, 'fail', 'Review'));
  await until(page, 'a1u01d1.r1', 'failed');
  await page.waitForTimeout(300);
  t = await text(page);
  check(/No se pudo cargar el audio: tocá y leé lo que se dice\./.test(t) && !NOT.test(t), 'Review, the file could not be fetched: the card says so before the tap', t.slice(0, 300));
  await tap(page, { sel: '#gn-stage [aria-label="Escuchar el audio"], #gn-stage [aria-label="Se reproduce en silencio"]' }, 500);
  t = await text(page);
  check(/Transcripción/.test(t) && /No se pudo cargar el audio: leé lo que se dice\./.test(t) && !NOT.test(t), 'Review: the tap opens the transcript under «No se pudo cargar el audio: leé lo que se dice.»', t.slice(0, 380));
  await shutAll(ctx);

  /* the placement check: a listening question; its two plays are counted, so nothing starts by itself */
  const PL = /\/gn-sound-pl\.js$/;
  const HEARP = { aria: 'Escuchar el audio' };
  const toListening = async (page) => {
    await tap(page, 'Saltear esta parte', 500);
    for (let i = 0; i < 20 && !(await page.locator('#gn-stage [aria-label="Escuchar el audio"]').count()); i++) {
      await page.locator('#gn-stage button[aria-pressed]').first().tap({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(150);
      await tap(page, 'Siguiente', 350);
    }
    return (await page.locator('#gn-stage [aria-label="Escuchar el audio"]').count()) > 0;
  };
  /* the listening question on show, found by its options, and whether its clip exists (asked once the file is in) */
  const itemNow = (page) => page.evaluate(() => {
    const C = window.gnCourse;
    const shown = [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => b.textContent.replace(/^\s*\d+\s*/, '').replace(/\s+/g, ' ').trim());
    const it = window.__gnExtra.placement.items.find((x) => x.options.map((o) => C.plain(o).replace(/\s+/g, ' ').trim()).join('|') === shown.join('|'));
    return it ? { id: it.clip || it.id, has: window.gnSound.has(it.clip || it.id), lines: (it.audio || []).filter((l) => Array.isArray(l) && l[1]).map((l) => C.plain(l[1]).replace(/\s+/g, ' ').trim()) } : null;
  });
  const plOpts = (page) => page.evaluate(() => [...document.querySelectorAll('#gn-stage button[aria-pressed]')].map((b) => b.disabled));
  ({ ctx, page } = await open('?gntest&screen=Placement&level=A1', PL, 'hold', 'the placement check'));
  check(await toListening(page), 'the placement check reaches a listening question');
  t = await text(page);
  check((await stateOf(page, 'pl.1')) === 'coming' && /Cargando el audio…/.test(t) && !NOT.test(t) && !/Transcripción/.test(t) && (await plOpts(page)).every(Boolean), 'the placement check, its sound still on its way: the player says «Cargando el audio…», the options stay shut, the exchange is not shown', t.slice(0, 300));
  await tap(page, HEARP, 500);
  t = await text(page);
  check((await lives(page)).includes('Cargando el audio…') && !/Transcripción/.test(t) && (await plOpts(page)).every(Boolean) && !/una vez más/.test(t), 'the placement check: the play button, tapped, waits: said politely, nothing shown, and no play is counted', await lives(page));
  await shot(page, 'V18-placement-waiting');
  release();
  await page.waitForFunction(() => window.gnCourse.soundState('pl.1') !== 'coming', null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  const item = await itemNow(page);
  pl = await playing(page);
  t = await text(page);
  check(!!item && !/Cargando el audio/.test(t) && !(pl.at > 0 && pl.on) && (await plOpts(page)).every(Boolean) && (item.has ? /Podés escucharlo dos veces\./.test(t) && (await tags(page)).length === 1 : /Todavía no está grabado: tocá y leé lo que se dice\./.test(t)), 'the placement check: when the file arrives nothing starts by itself (the two plays are counted): the line says the clip can be heard twice, with its tag (or, for a question the voice does not say, that it is not recorded)', { item, pl, t: t.slice(0, 260) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Placement&level=A1', PL, 'fail', 'the placement check'));
  await toListening(page);
  await until(page, 'pl.1', 'failed');
  await page.waitForTimeout(300);
  t = await text(page);
  check(/No se pudo cargar el audio: tocá y leé lo que se dice\./.test(t) && !NOT.test(t), 'the placement check, the file could not be fetched: the player says so', t.slice(0, 300));
  await tap(page, HEARP, 500);
  t = await text(page);
  check(/Transcripción/.test(t) && /No se pudo cargar el audio: leé lo que se dice\./.test(t) && !(await plOpts(page)).every(Boolean), 'the placement check: the tap opens the exchange and the options under «No se pudo cargar el audio: leé lo que se dice.»', t.slice(0, 380));
  await shutAll(ctx);

  /* the level exam: the pause before the listening part (its sound check, its start button), and the part's clock */
  const X = /\/gn-sound-a1-x\.js$/;
  const exams = encodeURIComponent(JSON.stringify({ A1: { level: 'A1', partial: true, apto: false, done: ['P1'], parts: { P1: { right: 2, of: 3 } }, a: {}, picks: {}, text: {}, take: {}, rate: {}, used: { P1: 600 }, started: h.iso(0), until: h.iso(6) } }));
  const examUrl = '?gntest&screen=LevelExam&level=A1&exams=' + exams;
  const START = { sel: '#gn-stage button:has-text("Empezar la parte 2")' };
  ({ ctx, page } = await open(examUrl, X, 'hold', 'the level exam'));
  /* the briefing asks the engine about the listening part's clips and draws no tag: nothing is said of the voice there */
  await page.waitForTimeout(600);
  await tap(page, 'Seguir con la parte 2', 700);
  t = await text(page);
  check((await stateOf(page, 'a1x.4')) === 'coming' && /LA PARTE QUE SIGUE\s*cargando el audio…/.test(t) && (t.match(/Cargando el audio…/g) || []).length === 2 && (await shut(page, START)) && !NOT.test(t) && !/Sin audio/.test(t), 'the level exam\'s pause, the part\'s sound still on its way: «cargando el audio…» in the head of the part that follows, the sound check and the start button both wait', t.slice(0, 420));
  await tap(page, { aria: 'Reproducir el sonido de prueba' }, 300);
  await tap(page, START, 500, true);
  t = await text(page);
  const clock1 = await page.evaluate(() => (document.querySelector('#gn-stage [role="timer"]') || {}).textContent || '');
  check(/Te queda de pausa|Es la hora/.test(t) && !/Parte 2 de 5/.test(t) && !/Transcripción/.test(t) && (await lives(page)).filter((l) => l === 'Cargando el audio…').length === 2, 'the level exam: tapped while the sound is on its way, the part does not start (no clock of the part runs, no transcript opens): both lines say «Cargando el audio…», politely', { lives: await lives(page), clock1 });
  await shot(page, 'V19-exam-pause-waiting');
  release();
  await page.waitForFunction(() => window.gnCourse.soundState('a1x.4') !== 'coming', null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  const xIn = (await stateOf(page, 'a1x.4')) === 'in' && (await stateOf(page, 'a1x.5')) === 'in';
  t = await text(page);
  pl = await playing(page);
  check(/Te queda de pausa|Es la hora/.test(t) && !/Cargando el audio|cargando el audio/.test(t) && !(pl.at > 0 && pl.on) && !(await shut(page, START)) && (xIn ? (await tags(page)).length === 1 && /Podés empezar antes/.test(t) : /leés lo que se dice/.test(t)), 'the level exam: when the file arrives the pause is as it should be (the tag, the button open) and nothing has started by itself', { xIn, t: t.slice(0, 300) });
  await tap(page, START, 900);
  t = await text(page);
  check(xIn ? /Parte 2 de 5 · cada audio suena dos veces/.test(t) && (await tags(page)).length === 1 : /Parte 2 de 5 · sin audio/.test(t), 'the level exam: the part then starts at the learner\'s tap, with its audio', t.slice(0, 200));
  await shutAll(ctx);
  ({ ctx, page } = await open(examUrl, X, 'fail', 'the level exam'));
  await until(page, 'a1x.4', 'failed');
  await tap(page, 'Seguir con la parte 2', 700);
  t = await text(page);
  check(/No se pudo cargar el audio/.test(t) && /En la parte 2 leés lo que se dice y elegís tu respuesta\./.test(t) && !/grabaciones están en preparación/.test(t) && !NOT.test(t), 'the level exam\'s pause, the file could not be fetched: it says the audio could not be loaded and that the part will be read (not that the recordings are still being made)', t.slice(0, 420));
  await tap(page, START, 900);
  t = await text(page);
  check(/Parte 2 de 5 · sin audio/.test(t) && /Transcripción/.test(t) && /No se pudo cargar el audio: leé lo que se dice\./.test(t) && !NOT.test(t), 'the level exam: the part is then read from its transcript, under «No se pudo cargar el audio: leé lo que se dice.»', t.slice(0, 380));
  await shutAll(ctx);

  /* Hablar: the menu, a round of «Escuchá y elegí» (its cards fall on a clock), the model of «Repetí y compará» */
  const SP = /\/gn-sound-sp\.js$/;
  const cardY = (page) => page.evaluate(() => { const b = [...document.querySelectorAll('#gn-stage button')].filter((x) => { const r = x.getBoundingClientRect(); return r.width > 110 && r.height > 60 && r.y < 600 && r.y > 60; }); return b.length ? Math.round(b[0].getBoundingClientRect().y) : null; });
  ({ ctx, page } = await open('?gntest&screen=Hablar&level=A1', SP, 'hold', 'Hablar'));
  t = await text(page);
  check((await stateOf(page, 's0')) === 'coming' && /al acabar\. Cargando el audio…/.test(t) && !/no están grabados|no tienen? audio|sin sonar/.test(t), 'Hablar\'s menu, the game\'s sound still on its way: it says «Cargando el audio…», not that the audios are not recorded', t.slice(-260));
  await tap(page, 'Empezar', 1600);
  const y1 = await cardY(page);
  t = await text(page);
  check((await lives(page)).includes('Cargando el audio…') && /La ronda espera: nada cae mientras tanto/.test(t) && !/La palabra ·/.test(t) && !NOT.test(t), 'Hablar, «Escuchá y elegí»: the round holds: the dock says «Cargando el audio…» and that nothing falls meanwhile; no word is shown in place of the sound', t.slice(-260));
  /* a tap on a card now would be a guess: it counts for nothing */
  if (y1 != null) await page.touchscreen.tap(100, y1 + 40);
  await page.waitForTimeout(1500);
  const y2 = await cardY(page);
  t = await text(page);
  check(y1 != null && y2 === y1 && !/Esa no|Elegiste|Vuelve después/.test(t), `Hablar: while the round holds nothing falls (the first card stays at ${y1} px for 1.5 s) and a tap on a card counts for nothing: no clock runs against the player`, { y1, y2, t: t.slice(-200) });
  await shot(page, 'V20-hablar-round-held');
  release();
  await page.waitForFunction(() => window.gnCourse.soundState('s0') !== 'coming', null, { timeout: 8000 }).catch(() => {});
  let went = '';
  for (let i = 0; i < 16 && !went; i++) { await page.waitForTimeout(250); const now = await text(page); const tg = (await tags(page)).length; if (!/La ronda espera/.test(now) && (tg === 1 || /La palabra ·/.test(now))) went = tg === 1 ? 'voiced' : 'written'; }
  pl = await playing(page);
  t = await text(page);
  check(!!went && !/La ronda espera/.test(t) && !(await lives(page)).includes('Cargando el audio…') && (went === 'written' || pl.at >= 0), 'Hablar: when the file arrives the round goes on by itself: the word of the first card plays under its tag (or, for a pair the voice does not say, is shown), and no «Cargando» is left', { went, pl, t: t.slice(-200) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Hablar&level=A1', SP, 'hold', 'Hablar, the model'));
  await tap(page, 'Repetí y compará', 300);
  await tap(page, 'Empezar', 1500);
  await tap(page, { aria: 'Escuchar el modelo: cargando el audio' }, 500);
  t = await text(page);
  check((await lives(page)).includes('Cargando el audio…') && !/Se escribe ·|Modelo ·/.test(t) && !NOT.test(t), 'Hablar, «Repetí y compará»: «Escuchar», tapped while the model is on its way, says «Cargando el audio…» and runs no stand-in', await lives(page));
  release();
  await page.waitForFunction(() => window.gnCourse.soundState('s0') !== 'coming', null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
  pl = await playing(page);
  t = await text(page);
  check(!(await lives(page)).includes('Cargando el audio…') && !(pl.at > 0 && pl.on) && (await page.locator('#gn-stage [aria-label^="Escuchar el modelo"]').count()) === 1, 'Hablar: when the file arrives the line goes and the model does not play by itself (a model heard counts as help: the learner asks for it)', { pl, lives: await lives(page) });
  await shutAll(ctx);
  ({ ctx, page } = await open('?gntest&screen=Hablar&level=A1', SP, 'fail', 'Hablar'));
  await until(page, 's0', 'failed');
  await page.waitForTimeout(300);
  t = await text(page);
  check(/No se pudo cargar el audio: cada botón de sonido se ilumina sin sonar y se muestra la palabra\./.test(t) && !/no están grabados/.test(t), 'Hablar\'s menu, the file could not be fetched: it says the audio could not be loaded', t.slice(-300));
  await tap(page, 'Empezar', 2200);
  t = await text(page);
  check(/La palabra ·/.test(t) && /No se pudo cargar el audio\./.test(t) && (await tags(page)).length === 0 && !NOT.test(t), 'Hablar: the round then shows each word, and its first card says the audio could not be loaded', t.slice(-260));
  await shutAll(ctx);

  part = 'V6 the sound stored ahead of time';
  ctx = await phone(browser);
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  page = await newPage(ctx, 'voice: stored ahead');
  net.hits.length = 0;
  await go(page, '?sw');
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
  await page.waitForTimeout(1200);
  const soundHits = () => net.hits.filter((x) => /\/gn-sound-(?!index)/.test(x)).map((x) => x.split('/').pop());
  const stored = () => page.evaluate(async () => { const out = []; for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) if (/[?&]h=/.test(r.url)) out.push(r.url.split('/').pop().replace(/\?.*$/, '')); return out.sort(); });
  const settle = async (n) => { let got = await stored(); for (let i = 0; i < 60 && got.length < n; i++) { await page.waitForTimeout(250); got = await stored(); } await page.waitForTimeout(2500); return stored(); };
  const all = await page.evaluate(() => (window.__gnSoundFiles || []).slice().sort());
  check((await screenOf(page)) === 'Goal' && soundHits().length === 0 && (await stored()).length === 0, 'a first visit, on the goal screen and with no plan yet: no sound file is asked of the server and none is stored', soundHits());
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ v: 1, started: true, level: 'A1', plan })]);
  await reload(page);
  const ahead = (await page.evaluate((k) => window.gnCourse.soundAhead(JSON.parse(localStorage.getItem(k))), KEY)).sort();
  check(JSON.stringify(ahead) === JSON.stringify(['gn-sound-a1-u01.js', 'gn-sound-a1-u02.js', 'gn-sound-sp.js']), 'with a plan in unit 1, the sound to have ahead is unit 1\'s, unit 2\'s and the speaking game\'s', ahead);
  let got = await settle(ahead.length);
  check(JSON.stringify(got) === JSON.stringify(ahead), `once there is a plan the worker stores those three files and no other of the level's ${all.length}: not the whole level in a first session`, got);
  let asked = soundHits();
  check(asked.length === ahead.length && ahead.every((f) => asked.filter((x) => x === f).length === 1), 'each of the three went over the line once, and no other sound file was asked for', asked);
  /* the learner moves on to unit 2: unit 3's file follows, and nothing else */
  const next = await page.evaluate(() => { const C = window.gnCourse; const done = {}; const tests = {}; C.sessions().filter((x) => x.unit === 1).forEach((x) => { if (x.kind === 'test') tests[x.id] = { id: x.id, score: 18, of: 20, at: Date.now() }; else done[x.id] = { g: 3, ks: 1, kw: 1, k: 1, r: 1 }; }); return { done, tests }; });
  net.hits.length = 0;
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(Object.assign({ v: 1, started: true, level: 'A1', plan }, next))]);
  await reload(page);
  const unitNow = await page.evaluate((k) => { const C = window.gnCourse; return C.view(Object.assign(C.fresh(), JSON.parse(localStorage.getItem(k)), { screen: 'Main' })).session.unit; }, KEY);
  const ahead2 = (await page.evaluate((k) => window.gnCourse.soundAhead(JSON.parse(localStorage.getItem(k))), KEY)).sort();
  got = await settle(ahead.length + 1);
  asked = soundHits();
  /* Progreso's page on the voice says what this phone does with the sound, as it now is */
  await tap(page, { sel: '#gn-stage nav a:has-text("Progreso")' }, 600);
  await page.locator('#gn-stage button[aria-haspopup="dialog"]:has-text("Voz sintética")').tap();
  await page.waitForTimeout(500);
  const sizeLine = (await page.locator('#gn-stage [role="dialog"]').textContent()).replace(/\s+/g, ' ');
  check(/guarda el sonido de a poco, para usarlo sin conexión: tu unidad, la siguiente y Hablar \(cerca de \d+,\d MB por unidad\)\. Lo demás se baja cuando lo abrís\./.test(sizeLine) && !/queda guardado en este/.test(sizeLine), 'Progreso\'s page on the voice says what is stored: the unit in use, the next one and Hablar, and that the rest comes when it is opened (not that the whole level is kept)', sizeLine.slice(-460));
  await tap(page, 'Listo', 400);
  check(unitNow === 2 && JSON.stringify(ahead2) === JSON.stringify(['gn-sound-a1-u02.js', 'gn-sound-a1-u03.js', 'gn-sound-sp.js']) && JSON.stringify(got) === JSON.stringify([...new Set(ahead.concat(ahead2))].sort()) && JSON.stringify(asked) === JSON.stringify(['gn-sound-a1-u03.js']), 'when the learner moves on to unit 2, the file of unit 3 follows: it alone is fetched, once, and the level exam\'s, the placement check\'s and the later units\' files are still not', { unitNow, ahead2, got, asked });
  await ctx.close();

  part = 'V7 the voice turned off: what each screen says';
  const off = async (url, label) => { const r = await open(url + '&voice=off', null, '', label + ', the voice off'); return r; };
  ({ ctx, page } = await off('?gntest&screen=Listening&level=A1&cur=a1u01d1', 'Listening'));
  t = await text(page);
  check(/Apagaste la voz sintética: se reproduce en silencio\./.test(t) && !NOT.test(t), 'Listening, the voice off: the status line says the learner turned the voice off, not that the audio is not recorded', t.slice(0, 300));
  await tap(page, PLAY, 700);
  t = await text(page);
  check(/Transcripción/.test(t) && /Apagaste la voz sintética: leé lo que se dice\. La activás de nuevo en Progreso\./.test(t) && !NOT.test(t), 'Listening: the transcript opens under «Apagaste la voz sintética: leé lo que se dice. La activás de nuevo en Progreso.»', t.slice(0, 380));
  await ctx.close();
  ({ ctx, page } = await off('?gntest&screen=Words&level=A1&cur=a1u01d1', 'Words'));
  t = await text(page);
  check(/apagaste la voz sintética\. La activás de nuevo en Progreso\./.test(t) && /MIRÁ Y ELEGÍ/.test(t) && !NOT.test(t), 'Words, the voice off: the sound step is read and says why, and where the voice is turned on again', t.slice(0, 260));
  await tap(page, PAIR, 500);
  t = await text(page);
  check(/La palabra: /.test(t) && /Apagaste la voz sintética: la activás de nuevo en Progreso\./.test(t) && !NOT.test(t), 'Words: a pair shows its word and says the voice is turned off', t.slice(0, 420));
  await ctx.close();
  ({ ctx, page } = await off('?gntest&screen=Review&level=A1&m=' + mistake('a1u01d1.r1'), 'Review'));
  t = await text(page);
  check(/Apagaste la voz sintética: tocá y leé lo que se dice\./.test(t) && !NOT.test(t), 'Review, the voice off: the play card says so', t.slice(0, 300));
  await ctx.close();
  ({ ctx, page } = await off('?gntest&screen=Hablar&level=A1', 'Hablar'));
  t = await text(page);
  check(/Apagaste la voz sintética: cada botón de sonido se ilumina sin sonar y se muestra la palabra\. La activás de nuevo en Progreso\./.test(t) && !/no están grabados/.test(t), 'Hablar\'s menu, the voice off: it says the learner turned the voice off and where to turn it on again (not «los audios todavía no están grabados»)', t.slice(-320));
  await tap(page, 'Empezar', 2200);
  t = await text(page);
  check(/La palabra ·/.test(t) && /Apagaste la voz sintética: la activás de nuevo en Progreso\./.test(t) && !NOT.test(t), 'Hablar: the round shows each word, and its first card says the voice is turned off', t.slice(-260));
  await ctx.close();
  ({ ctx, page } = await off(examUrl, 'the level exam'));
  await tap(page, 'Seguir con la parte 2', 700);
  t = await text(page);
  check(/Apagaste la voz sintética/.test(t) && /En la parte 2 leés lo que se dice y elegís tu respuesta\. La activás de nuevo en Progreso\./.test(t) && !/grabaciones están en preparación/.test(t), 'the level exam\'s pause, the voice off: it says so, and that the part will be read', t.slice(0, 420));
  await ctx.close();
  ({ ctx, page } = await off('?gntest&screen=Placement&level=A1', 'the placement check'));
  await toListening(page);
  t = await text(page);
  check(/Apagaste la voz sintética: tocá y leé lo que se dice\./.test(t) && !NOT.test(t), 'the placement check, the voice off: a listening question\'s player says so', t.slice(0, 300));
  await ctx.close();

  part = 'V8 the note for a screen reader is said when a tag is drawn';
  ({ ctx, page } = await open(examUrl, null, '', 'the level exam\'s briefing'));
  await clipIn(page, 'a1x.4');
  await page.waitForTimeout(900);
  const said0 = await notes(page);
  check((await tags(page)).length === 0 && said0.length === 0, 'the level exam\'s briefing asks the engine about the listening part\'s clips and draws no tag: nothing is said of the voice there', said0);
  await tap(page, 'Seguir con la parte 2', 900);
  const said1 = await notes(page);
  const xClips = await page.evaluate(() => window.gnSound.kind('a1x.4') === 'synthetic');
  check(!xClips || ((await tags(page)).length === 1 && said1.length === 1 && /un programa, no una persona/.test(said1[0])), 'at the pause, where the tag stands in the head of the part that follows, the note is said, once', { tags: (await tags(page)).length, said1 });
  await ctx.close();

  part = 'V9 the model\'s strip in Hablar, and a clip that will not start';
  /* Hablar, «Repetí y compará»: in the comparison the «Modelo» strip plays the model's clip (it once only moved its
     bars). The signs come in an order of the round's own and the voice need not say every one, so the check takes
     the first sign whose model has a strip to play; a sign without a clip has a row that says why, and is passed
     with «Igual». Every play asked of the player is written down from the start of the round */
  ({ ctx, page } = await open('?gntest&screen=Hablar&level=A1', null, '', 'Hablar, the comparison'));
  await page.waitForFunction(() => window.gnCourse.soundState('s0') !== 'coming', null, { timeout: 15000 }).catch(() => {});
  await tap(page, 'Repetí y compará', 300);
  await tap(page, 'Empezar', 1500);
  await page.evaluate(() => { const s = window.gnSound; const play = s.play; window.__plays = []; s.play = function (key, from) { window.__plays.push(key); return play.call(this, key, from); }; });
  const sayIt = page.locator('#gn-stage button[aria-label="Decir la frase en voz alta: tu voz todavía no se graba"]');
  const endIt = page.locator('#gn-stage button[aria-label="Terminar"]');
  const panel = page.locator('#gn-stage [role="region"][aria-labelledby="hab-cmp-h"]');
  const strip = panel.locator('button[aria-label="Escuchar el modelo"]');
  const rows = [];
  let model = null;
  for (let n = 0; n < 6 && !model; n++) {
    /* the sign said aloud (in the app nothing is recorded) and the try ended: the comparison opens */
    let saying = false;
    for (let k = 0; k < 12 && !saying; k++) { await sayIt.tap({ timeout: 1500 }).catch(() => {}); saying = await endIt.waitFor({ timeout: 700 }).then(() => true, () => false); }
    if (!saying) break;
    await page.waitForTimeout(400);
    await endIt.tap();
    await panel.waitFor({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    rows.push(((await panel.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 160));
    if (!(await strip.count())) { await tap(page, exact('Igual'), 1700); continue; }
    const before = await page.evaluate(() => ({ plays: window.__plays.slice(), at: window.gnSound.at() }));
    await strip.tap();
    await page.waitForTimeout(450);
    const after = await page.evaluate(async () => {
      const s = window.gnSound;
      s.on();
      await new Promise((r) => setTimeout(r, 220));
      const key = window.__plays[window.__plays.length - 1] || '';
      const sign = key ? (window.__gnExtra.speaking.phrases || [])[+key.slice(1)] : null;
      return { plays: window.__plays.slice(), key, has: s.has(key), ms: s.ms(key), at: s.at(), on: s.on(), sign: sign ? window.gnCourse.norm(sign.gn) : '' };
    });
    model = { before, after, lit: await strip.getAttribute('aria-pressed'), signOnShow: !!after.sign && (await text(page)).includes(after.sign) };
    await shot(page, 'V25-hablar-model-strip');
  }
  if (!model) pass('Hablar: no sign of this build has a clip of its model (' + rows.length + ' looked at): there is no strip to play');
  else {
    check(model.lit === 'true' && model.after.plays.length === model.before.plays.length + 1 && /^s\d+$/.test(model.after.key) && model.signOnShow, 'Hablar, «Repetí y compará»: a tap on the comparison\'s «Modelo» strip asks the player for the clip of the sign on show', model);
    check(model.after.has && model.after.on && model.after.at > 0 && model.after.at <= model.after.ms + 400, 'and the clip is really playing: the audio clock runs and the player is some way into it (the strip used to move its bars in silence)', model.after);
  }
  await ctx.close();

  /* The placement check: a clip that is there and will not start is not a clip that is not recorded. On a phone the
     audio can be held elsewhere (a call: an iPhone reports its output «interrupted»); here an audio output that
     decodes every clip and never runs stands for it. The player waits 1.2 s for sound, then shows what is said,
     line by line, and its line says that the audio could not be played */
  ctx = await phone(browser);
  await ctx.addInitScript(VOZ);
  await ctx.addInitScript(() => {
    class Stuck {
      constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; }
      resume() { return Promise.resolve(); }
      close() { return Promise.resolve(); }
      addEventListener() {}
      removeEventListener() {}
      decodeAudioData(data, ok) { const buffer = { duration: 2 }; if (ok) ok(buffer); return Promise.resolve(buffer); }
      createBufferSource() { return { buffer: null, onended: null, connect() {}, start() {}, stop() {} }; }
    }
    window.AudioContext = Stuck;
    window.webkitAudioContext = Stuck;
  });
  page = await newPage(ctx, 'voice: the placement check, an audio output that never runs');
  await go(page, '?gntest&screen=Placement&level=A1');
  await page.waitForFunction(() => window.gnCourse.soundState('pl.1') !== 'coming', null, { timeout: 15000 }).catch(() => {});
  /* the first listening question that has a clip (the voice does not say every one: such a question is read,
     answered and passed) */
  let q = (await toListening(page)) ? await itemNow(page) : null;
  for (let i = 0; i < 8 && q && !q.has; i++) {
    await tap(page, HEARP, 400);
    q = null;
    for (let k = 0; k < 12 && !q; k++) {
      await page.locator('#gn-stage button[aria-pressed]:not([disabled])').first().tap({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(150);
      if (!(await page.locator('#gn-stage').locator('button, a').filter({ hasText: 'Siguiente' }).count())) break;
      await tap(page, 'Siguiente', 350);
      if (await page.locator('#gn-stage [aria-label="Escuchar el audio"]').count()) q = await itemNow(page);
    }
  }
  if (!q || !q.has) pass('the placement check: no listening question of this build has a clip: there is none to start');
  else {
    await tap(page, HEARP, 0);
    const told = await page.waitForFunction(() => [...document.querySelectorAll('#gn-stage [aria-live]')].some((el) => /No se pudo reproducir el audio: así se dice\./.test(el.textContent || '')), null, { timeout: 6000 }).then(() => true, () => false);
    t = await text(page);
    check(told && q.lines.some((l) => t.includes(l)) && !NOT.test(t) && !/No se pudo cargar el audio|Transcripción|sin grabación/.test(t), 'the placement check, a clip that is there and will not start: after a moment the player shows what is said and its live line says «No se pudo reproducir el audio: así se dice.» (not that the audio is not recorded, nor that it could not be loaded)', { q: q.id, lives: await lives(page), t: t.slice(0, 320) });
    await shot(page, 'V26-placement-will-not-start');
  }
  await ctx.close();
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
  parts.push(['V', partV]);
  parts.push(['S', partS]);
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
