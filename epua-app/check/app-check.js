// Checks the installable app in Chromium, the way a phone opens it: the first-visit page, every screen, a first study
// day's grammar lesson, saved progress (and saved data that does not fit), fitting the design to different phones,
// working offline and picking up a new build at a quiet moment.
// usage (from epua-app/, after npm install and bash fetch-fonts.sh):
//   node check/app-check.js            builds a test copy into dist-test (dist/ and ../docs are not touched), serves it
//                                      on localhost:$PORT (8781 by default) and checks it
//   node check/app-check.js ../docs    checks a built folder as it is (no build, so no update check)
// Screenshots go to check/out/. Exit code 1 when a check fails. Safari itself cannot run here: Chromium with an iPhone's
// screen and user agent stands in for it, so what only Safari does (Add to Home Screen, its bars) is still to be seen
// on a phone.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium, devices } = require('playwright');

const APPDIR = path.join(__dirname, '..');
const GIVEN = process.argv[2] ? path.resolve(process.argv[2]) : null;
const TESTNAME = process.env.EPUA_TESTDIR || 'dist-test';
const DIR = GIVEN || path.join(APPDIR, TESTNAME);
const PORT = +(process.env.PORT || 8781);
const BASE = 'http://localhost:' + PORT + '/';
const OUT = path.join(__dirname, 'out');
/* saved progress is kept under the folder the app is served from */
const KEY = 'epua.v1:/';
const SCREENS = ['Goal', 'Placement', 'Main', 'Today', 'Levels', 'Progress', 'Teach', 'Compare', 'Drill', 'Exam', 'Words', 'Reading', 'Listening', 'WeekTest', 'Notebook', 'Review', 'ExamTab', 'LevelExam', 'Leer', 'Escribir', 'Hablar'];
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';

let fails = 0;
const ok = (cond, msg) => { if (!cond) { fails += 1; console.log('  FAIL: ' + msg); } };
const note = (msg) => console.log(msg);
const build = (env) => execFileSync(process.execPath, ['build.mjs'], { cwd: APPDIR, env: { ...process.env, EPUA_OUT: TESTNAME, EPUA_DOCS: '', EPUA_BUILD_DATE: 'test build', ...env }, stdio: 'ignore' });

/* a plain static server, as GitHub Pages serves the folder: every file as it is, 404 for anything else */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const serve = () => new Promise((done) => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, BASE).pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(DIR, p);
    if (!f.startsWith(DIR) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(f).pipe(res);
  });
  server.listen(PORT, '127.0.0.1', () => done(server));
});

async function ready(page) {
  await page.waitForSelector('#gn-stage > .sc-host', { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}
const text = async (page) => ((await page.locator('#gn-stage').textContent()) || '').replace(/\s+/g, ' ');
/* a button or link by its text (or a selector), as a learner finds it */
const control = (page, what) => (/^[a-z]*\[|^#|^nav /.test(what) ? page.locator(what) : page.locator('#gn-stage').locator('button, a').filter({ hasText: what })).first();
const click = async (page, what, wait = 450) => { await control(page, what).click({ timeout: 5000 }); await page.waitForTimeout(wait); };
const tap = async (page, what, wait = 450) => { await control(page, what).tap({ timeout: 5000 }); await page.waitForTimeout(wait); };
const saved = async (page) => JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY)) || 'null');
const screenName = (page) => page.evaluate(() => { const h = document.querySelector('#gn-stage > .sc-host'); const inner = h && h.querySelector('.sc-host'); return inner ? inner.getAttribute('data-sc-name') : h ? h.getAttribute('data-sc-name') : null; });
const logicErrors = (page) => page.evaluate(() => [...document.querySelectorAll('.sc-logic-error')].map((e) => e.textContent.slice(0, 200)));
const watch = (page, logs) => {
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + String(e).slice(0, 200)));
};
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') });
/* where the design sits on the screen, and the highest thing in it that a learner can see */
const placed = (page) => page.evaluate(() => {
  const stage = document.querySelector('#gn-stage');
  const b = stage.getBoundingClientRect();
  const nav = stage.querySelector('nav');
  let top = Infinity;
  let what = '';
  /* text kept for screen readers only (a 1 px box clipped to nothing) is not seen */
  const unseen = (el) => { for (let p = el; p && p !== stage; p = p.parentElement) { const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); if ((cs.clip && cs.clip !== 'auto') || (r.width <= 1 && r.height <= 1 && cs.overflow === 'hidden')) return true; } return false; };
  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim() || unseen(n.parentElement)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.width && r.height && r.top < top) { top = r.top; what = n.nodeValue.trim().slice(0, 20); }
  }
  for (const el of stage.querySelectorAll('button, a, svg')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.height && r.top < top) { top = r.top; what = el.tagName.toLowerCase() + ' ' + (el.getAttribute('aria-label') || ''); }
  }
  const cls = document.documentElement.classList;
  return { x: b.x, y: b.y, w: b.width, h: b.height, bottom: b.bottom, navBottom: nav ? nav.getBoundingClientRect().bottom : null, top, what, boxed: cls.contains('gn-boxed'), sideways: cls.contains('gn-sideways') };
});

/* what a learner can see in the bottom 34 px of a screen (below 810), which the design keeps for the phone's home
   indicator: a warning, not a failure (the screens are the canvas's; the tab bar is the one thing meant to reach there) */
const padOf = (page, name) => page.evaluate((name) => {
  const rootEl = document.querySelector('#gn-stage .sc-host[data-sc-name="' + name + '"] > div');
  if (!rootEl) return [];
  const top = rootEl.getBoundingClientRect().top;
  const out = [];
  for (const el of rootEl.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    if (el.closest('svg') && tag !== 'svg') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!own && !/^(button|a|input|textarea|svg|img)$/.test(tag)) continue;
    let seen = r.bottom;
    let gone = false;
    for (let p = el.parentElement; p && p !== rootEl; p = p.parentElement) {
      if (getComputedStyle(p).overflowY !== 'visible') { const b = p.getBoundingClientRect(); seen = Math.min(seen, b.bottom); if (r.top >= b.bottom - 0.5) gone = true; }
    }
    const bottom = seen - top;
    if (!gone && bottom > 810.5 && bottom <= 844.5 && !el.closest('nav') && getComputedStyle(el).visibility !== 'hidden') out.push(tag + ' "' + (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 24) + '" b=' + Math.round(bottom));
  }
  return out;
}, name);

/* a learner part way through A1 unit 1, dated from today (the plan boards' sample) */
const day = (n) => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const FULL = { g: 3, k: 1, r: 1 };
const SAMPLE = { level: 'A1', plan: { start: day(-3), target: day(60), pace: 'fit', minutes: 30 }, done: { a1u01d1: FULL, a1u01d2: FULL, a1u01d3: FULL, a1u01d4: { g: 1 } }, m: [{ src: 'a1u01d2.d1', wrong: 'ore', at: Date.now() - 864e5, step: 0, due: day(0) }], cur: 'a1u01d4', placement: { comp: 'A2', prod: 'A1', start: 'A1', measured: true } };
const address = (o) => Object.keys(o).map((k) => '&' + k + '=' + encodeURIComponent(typeof o[k] === 'string' ? o[k] : JSON.stringify(o[k]))).join('');

/* answer a lesson's questions as the course has them: a choice by its number and text, a build by its tiles in order;
   wrong: the first question is answered wrong on purpose (its mistake goes to the notebook) */
async function answer(page, list, opts) {
  for (let i = 0; i < list.length; i++) {
    const it = list[i];
    if (it.kind === 'choice') {
      const k = opts.wrong && i === 0 ? (it.answer % it.options.length) + 1 : it.answer;
      await click(page, k + it.plain[k - 1], 300);
    } else if (it.kind === 'build') {
      for (const t of it.tiles) await click(page, `[aria-label="${t}"]`, 200);
    } else throw new Error('this check cannot answer a ' + it.kind + ' item yet: ' + it.id);
    if (opts.check) await click(page, opts.check, 350);
    await click(page, i < list.length - 1 ? opts.next : opts.last, 450);
  }
}
const items = (page, sid, part) => page.evaluate(([sid, part]) => {
  const C = window.gnCourse;
  const g = C.day(sid).grammar;
  return (part === 'drill' ? g.drill : g.exam).map((it) => ({ id: it.id, kind: it.kind, answer: it.answer, options: it.options, plain: (it.options || []).map((o) => C.plain(o)), tiles: (it.tiles || []).map((t) => C.plain(t)) }));
}, [sid, part]);

(async () => {
  if (!GIVEN) { note('building the test copy into ' + TESTNAME + ' …'); build({}); }
  if (!fs.existsSync(path.join(DIR, 'index.html'))) throw new Error('no app in ' + DIR);
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const browser = await chromium.launch();

  // ---------- 1. the first-visit page on an iPhone ----------
  {
    const ctx = await browser.newContext({ ...devices['iPhone 14'], userAgent: IPHONE });
    const page = await ctx.newPage();
    const logs = [];
    watch(page, logs);
    await page.goto(BASE);
    await ready(page);
    const t = await text(page);
    ok(t.includes("Agregá Epu'ã a tu pantalla de inicio") && t.includes('Tocá Compartir') && t.includes('«Agregar a pantalla de inicio»') && t.includes('desde su ícono'), 'Safari on an iPhone should get the Add to Home Screen page, got ' + t.slice(0, 120));
    ok(t.includes('en este iPhone'), 'the install page should name the device');
    ok((await page.locator('#gn-stage svg[aria-label="Kaguare, el oso melero"]').count()) === 1, 'the install page should show Kaguare');
    const box = await page.evaluate(() => { const r = document.querySelector('#gn-stage').getBoundingClientRect(); const root = document.querySelector('#gn-stage > .sc-host > div'); return { w: Math.round(r.width), h: Math.round(r.height), vw: innerWidth, vh: innerHeight, sh: root.scrollHeight, ch: root.clientHeight }; });
    ok(box.w === box.vw && Math.abs(box.h - box.vh) <= 1, 'the install page should fill the browser, got ' + JSON.stringify(box));
    ok(box.sh <= box.ch + 1, 'the install page should fit without scrolling on an iPhone 14 in Safari, got ' + JSON.stringify(box));
    await shot(page, 'install-iphone14');
    await click(page, 'Seguir en el navegador', 600);
    ok((await screenName(page)) === 'Goal', 'Seguir en el navegador should open the app on the goal screen, at ' + (await screenName(page)));
    await page.reload();
    await ready(page);
    ok((await screenName(page)) === 'Goal', 'the install page should not come back in the same visit');
    ok(logs.length === 0, 'console problems on the install page: ' + JSON.stringify(logs.slice(0, 5)));
    await ctx.close();

    // from the Home Screen icon there is no install page
    const ctx2 = await browser.newContext({ ...devices['iPhone 14'], userAgent: IPHONE, viewport: { width: 390, height: 844 } });
    const page2 = await ctx2.newPage();
    await page2.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
    await page2.goto(BASE);
    await ready(page2);
    ok((await screenName(page2)) === 'Goal', 'opened from the Home Screen, the app should start at once');
    await ctx2.close();

    // a short phone: the page scrolls instead of squeezing; an iPad says iPad
    const ctx3 = await browser.newContext({ ...devices['iPhone SE'] });
    const page3 = await ctx3.newPage();
    await page3.goto(BASE);
    await ready(page3);
    ok((await text(page3)).includes('Seguir en el navegador'), 'install page on a short phone');
    await shot(page3, 'install-se');
    await ctx3.close();
    const ctx4 = await browser.newContext({ ...devices['iPad (gen 7)'] });
    const page4 = await ctx4.newPage();
    await page4.goto(BASE);
    await ready(page4);
    ok((await text(page4)).includes('en este iPad'), 'the install page on an iPad should say iPad');
    await ctx4.close();
    note('first-visit page: checked');
  }

  // ---------- 2. every screen, alone, fresh and with a learner part way through ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    for (const name of SCREENS) {
      for (const [label, extra] of [['fresh', ''], ['sample', address(SAMPLE)]]) {
        const page = await ctx.newPage();
        const logs = [];
        watch(page, logs);
        await page.goto(BASE + '?gntest&screen=' + name + extra);
        await ready(page);
        const shown = await screenName(page);
        const errors = await logicErrors(page);
        const chars = (await text(page)).trim().length;
        ok(shown === name && !errors.length && chars > 20, `${name} (${label}) should show, got ${shown}, ${chars} characters, errors ${JSON.stringify(errors)}`);
        ok(logs.length === 0, `${name} (${label}): console problems ${JSON.stringify(logs.slice(0, 3))}`);
        if (label === 'sample') await shot(page, 'screen-' + name);
        for (const w of await padOf(page, name)) note(`  PAD WARNING ${name} (${label}): ${w}`);
        await page.close();
      }
    }
    await ctx.close();
    note(`every screen (${SCREENS.length}, fresh and part way): checked`);
  }

  // ---------- 3. a first study day: the goal, the week path, the grammar lesson, and progress kept ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const logs = [];
    watch(page, logs);
    await page.addInitScript(() => {
      window.__locks = [];
      if (navigator.wakeLock && navigator.wakeLock.request) {
        const req = navigator.wakeLock.request.bind(navigator.wakeLock);
        navigator.wakeLock.request = (t) => { window.__locks.push(t); return req(t); };
      }
    });
    await page.goto(BASE);
    await ready(page);
    ok((await text(page)).includes('¿Para qué querés aprender guaraní?'), 'a first visit should open on the goal screen');
    ok((await page.evaluate(() => Object.keys(localStorage))).length === 0, 'nothing should be in storage before the first tap, got ' + JSON.stringify(await page.evaluate(() => Object.keys(localStorage))));
    await click(page, 'hablar con mi familia');
    await click(page, 'casa');
    await click(page, 'Siguiente');
    await click(page, 'sé de qué se habla en casa');
    await click(page, 'frases hechas');
    await click(page, 'Empezar en A1');
    await shot(page, 'flow-goal-plan');
    await click(page, 'Tejé el primer hilo', 900);
    await click(page, 'Empezar', 700);
    ok((await screenName(page)) === 'Main' && (await text(page)).includes("Mba'éichapa"), 'Empezar should lead to the week path of A1 unit 1');
    const s0 = await saved(page);
    ok(s0 && s0.started === true && s0.level === 'A1' && s0.plan && s0.plan.start === day(0) && s0.plan.target === null && s0.plan.minutes === 30, 'the plan should be saved, got ' + JSON.stringify(s0 && s0.plan));
    ok(s0 && s0.profile && s0.profile.why.join() === 'familia' && s0.profile.where.join() === 'casa' && s0.profile.understand === 2 && s0.profile.speak === 1, 'the goal screen\'s answers should be saved, got ' + JSON.stringify(s0 && s0.profile));
    await shot(page, 'flow-main');
    await click(page, 'Empezar', 600);
    ok((await screenName(page)) === 'Today', 'the week path should open the day, at ' + (await screenName(page)));
    await click(page, 'Empezar con la regla', 600);
    ok((await screenName(page)) === 'Teach', 'the day should open the teach page');
    await click(page, 'Siguiente:', 500);
    await click(page, 'Comparar', 600);
    ok((await screenName(page)) === 'Compare', 'the teach pages should lead to the comparison');
    const check = await page.evaluate(() => { const C = window.gnCourse; const it = C.day('a1u01d1').grammar.compare.check; return C.plain(it.options[it.answer - 1]); });
    await click(page, check, 400);
    await click(page, 'A la práctica', 600);
    ok((await screenName(page)) === 'Drill', 'the comparison should lead to the drill');
    await answer(page, await items(page, 'a1u01d1', 'drill'), { wrong: true, check: 'Respondé', next: 'Siguiente', last: 'Terminar la práctica' });
    ok((await screenName(page)) === 'Today', 'the drill should end on the day, at ' + (await screenName(page)));
    await click(page, 'Al examen', 600);
    ok((await screenName(page)) === 'Exam', 'the day should open the exam-style step');
    await answer(page, await items(page, 'a1u01d1', 'exam'), { wrong: false, next: 'Siguiente', last: 'Terminar' });
    ok((await text(page)).includes('Examen terminado'), 'the exam-style step should end on its result');
    await shot(page, 'flow-exam-result');
    await click(page, 'Siguiente', 600);
    ok((await screenName(page)) === 'Today', 'the result should lead back to the day');
    await shot(page, 'flow-today-after');
    const s1 = await saved(page);
    ok(s1 && s1.done && s1.done.a1u01d1 && s1.done.a1u01d1.g === 3, 'the grammar lesson should be saved as done (g 3), got ' + JSON.stringify(s1 && s1.done));
    ok(s1 && s1.mistakes.length === 1 && s1.mistakes[0].src === 'a1u01d1.d1' && s1.mistakes[0].due === day(1), 'the drill\'s mistake should be saved, due tomorrow, got ' + JSON.stringify(s1 && s1.mistakes));
    ok(s1 && Object.keys(s1).sort().join() === ['v', 'started', 'level', 'plans', 'plan', 'cur', 'done', 'tests', 'exams', 'mistakes', 'tp', 'set', 'placement', 'typed', 'profile', 'exposure'].sort().join(), 'only the course\'s fields should be saved, got ' + Object.keys(s1 || {}).join());
    await page.reload();
    await ready(page);
    ok((await screenName(page)) === 'Main', 'opened again, the app should be on the week path, at ' + (await screenName(page)));
    await click(page, 'nav a:has-text("Cuaderno")', 600);
    const nb = await text(page);
    ok((await screenName(page)) === 'Notebook' && nb.includes('Jajotopáta'), 'the notebook should hold the mistake after reopening, got ' + nb.slice(0, 160));
    await shot(page, 'flow-notebook');
    // the screen is kept awake in the level exam, not on the tabs
    ok((await page.evaluate(() => window.__locks.length)) === 0, 'no wake lock outside the listening and exam screens');
    await click(page, 'nav a:has-text("Examen")', 600);
    ok((await screenName(page)) === 'ExamTab', 'the exam tab should open');
    await click(page, '#gn-stage a[href="LevelExam.dc.html"]', 600);
    ok((await screenName(page)) === 'LevelExam', 'the exam tab should open the level exam, at ' + (await screenName(page)));
    ok((await page.evaluate(() => window.__locks.length)) >= 1, 'the level exam should ask to keep the screen awake');
    const tint = () => page.evaluate(() => document.querySelector('meta[name="theme-color"]').getAttribute('content'));
    ok((await tint()) === '#1B2440', 'in the level exam the status-bar strip should take the ink of its band, got ' + (await tint()));
    await click(page, '#gn-stage a[href="ExamTab.dc.html"]', 600);
    ok((await tint()) === '#F4F5F9', 'outside the level exam the strip should be the ground colour, got ' + (await tint()));
    ok(page.url() === BASE, 'the app should never leave its address, at ' + page.url());
    ok(logs.length === 0, 'console problems in the first day: ' + JSON.stringify(logs.slice(0, 5)));
    await ctx.close();
    note('a first study day, saved progress, wake lock: checked');
  }

  // ---------- 4. saved data that does not fit: left out, never thrown over ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const open = async (value) => {
      const page = await ctx.newPage();
      const logs = [];
      watch(page, logs);
      await page.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); } }, [KEY, value]);
      await page.goto(BASE);
      await ready(page);
      return { page, logs };
    };
    for (const junk of ['not json', '[]', 'null', '42', '{"started":true}', '{"started":true,"plan":{"start":"tomorrow"}}']) {
      const { page, logs } = await open(junk);
      ok((await screenName(page)) === 'Goal' && !(await logicErrors(page)).length && logs.length === 0, `saved ${junk} should open the goal screen cleanly, got ${await screenName(page)} ${JSON.stringify(logs)}`);
      await page.close();
    }
    const mixed = { started: true, level: 'Z9', plan: { start: day(-2), target: '2026-02-31', pace: 'quick', minutes: 7 }, plans: { B1: { start: day(-9), target: null, pace: 'steady', minutes: 45 }, Q1: { start: day(0) } },
      done: { a1u01d1: { g: 99, k: '1', r: 1, x: 5 }, a1u99d1: { g: 1 }, nonsense: 3 }, tests: { a1u01t: { score: 5, of: 3 }, a1u01d2: { score: 1, of: 2 } },
      exams: { A1: { apto: 'yes', parts: 'x', done: ['P1', 'P9'], mode: 'robot', at: -4 }, ZZ: {} },
      mistakes: [{ src: 'nope' }, { src: 'a1u01d2.d1', wrong: { a: 1 }, step: 9, due: 'x' }, null, { src: 'a1u01d2.d1', wrong: 'twice' }],
      typed: [1, 'ñande', '', 'ñande'], placement: { comp: 'B3', prod: 'A1' }, profile: { why: 'x', understand: 9 }, exposure: { week: 'x' }, cur: 'a1u77d1', tp: -1, set: 'other' };
    const { page, logs } = await open(JSON.stringify(mixed));
    ok((await screenName(page)) === 'Main' && !(await logicErrors(page)).length, 'a mixed save with a plan should open on the week path, at ' + (await screenName(page)) + ' ' + JSON.stringify(await logicErrors(page)));
    const s = await page.evaluate(() => window.gnApp.start());
    ok(s.level === null && s.plan.start === day(-2) && s.plan.target === null && s.plan.pace === 'fit' && s.plan.minutes === 30, 'the plan should be kept with what fits, got ' + JSON.stringify([s.level, s.plan]));
    ok(JSON.stringify(s.plans) === JSON.stringify({ B1: { start: day(-9), target: null, pace: 'steady', minutes: 45 } }), 'only the plans of real levels should be kept, got ' + JSON.stringify(s.plans));
    ok(JSON.stringify(s.done) === JSON.stringify({ a1u01d1: { g: 3, r: 1 } }), 'progress should keep only real sessions and steps, got ' + JSON.stringify(s.done));
    ok(JSON.stringify(s.tests) === '{}', 'a week test result that cannot be should be left out, got ' + JSON.stringify(s.tests));
    ok(Object.keys(s.exams).join() === 'A1' && s.exams.A1.apto === false && s.exams.A1.done.join() === 'P1' && !('parts' in s.exams.A1) && !('mode' in s.exams.A1) && !('at' in s.exams.A1), 'the level exam should keep what fits, got ' + JSON.stringify(s.exams));
    ok(s.mistakes.length === 1 && s.mistakes[0].src === 'a1u01d2.d1' && s.mistakes[0].wrong === '' && s.mistakes[0].step === 0 && s.mistakes[0].due === day(0), 'mistakes should keep only real questions, once each, got ' + JSON.stringify(s.mistakes));
    ok(JSON.stringify(s.typed) === '["ñande"]' && s.placement === null && s.exposure === null && s.cur === null && s.tp === 0 && s.set === 'day', 'the rest should be put right, got ' + JSON.stringify([s.typed, s.placement, s.exposure, s.cur, s.tp, s.set]));
    ok(s.profile && s.profile.why.length === 0 && s.profile.understand === null, 'the profile should keep what fits, got ' + JSON.stringify(s.profile));
    await click(page, 'nav a:has-text("Cuaderno")', 600);
    ok(!(await logicErrors(page)).length && (await text(page)).includes('Cuaderno'), 'the notebook should open with what was kept');
    ok(logs.length === 0, 'console problems with mixed saved data: ' + JSON.stringify(logs.slice(0, 5)));
    await page.close();
    await ctx.close();
    note('saved data that does not fit: checked');
  }

  // ---------- 5. the design fills every recent iPhone ----------
  {
    const phone = (w, h) => browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    for (const [name, w, h] of [['iPhone 13 mini', 375, 812], ['iPhone 14', 390, 844], ['iPhone 15/16', 393, 852], ['iPhone 16 Pro', 402, 874], ['iPhone 11', 414, 896], ['iPhone 14 Plus', 428, 926], ['iPhone 16 Pro Max', 440, 956]]) {
      const ctx = await phone(w, h);
      const page = await ctx.newPage();
      await page.goto(BASE + '?gntest&screen=Main');
      await ready(page);
      const r = await placed(page);
      ok(Math.abs(r.x) < 0.5 && Math.abs(r.y) < 0.5 && Math.abs(r.w - w) < 0.5 && Math.abs(r.h - h) < 0.5, `${name} ${w}x${h}: the design should fill the screen exactly, got ${JSON.stringify(r)}`);
      ok(Math.abs(r.navBottom - h) < 0.6, `${name}: the tab bar should end at the bottom edge, got ${r.navBottom}`);
      if (w === 402) await shot(page, `fit-${w}x${h}`);
      await ctx.close();
    }
    // when the system keeps a strip for the status bar, the design gives up its own empty top zone instead of shrinking
    for (const [name, w, full, bar] of [['iPhone 13 mini', 375, 812, 50], ['iPhone 14', 390, 844, 47], ['iPhone 15/16', 393, 852, 59], ['iPhone 16 Pro Max', 440, 956, 62]]) {
      const h = full - bar;
      const ctx = await phone(w, h);
      const page = await ctx.newPage();
      await page.goto(BASE + '?gntest&screen=Main');
      await ready(page);
      const r = await placed(page);
      const squeeze = (r.h / 844) / (r.w / 390);
      ok(Math.abs(r.x) < 0.5 && Math.abs(r.w - w) < 0.5 && Math.abs(r.bottom - h) < 0.6 && Math.abs(r.navBottom - h) < 0.6, `${name} under a ${bar} px status bar: full width and the tab bar at the bottom edge, got ${JSON.stringify(r)}`);
      ok(r.y < 0 && r.y >= -42 * (w / 390) - 0.5 && squeeze > 0.9695 && squeeze < 1.0005, `${name} under a status bar: only the empty top zone may go, within a 3% squeeze, got y=${r.y} squeeze=${squeeze.toFixed(4)}`);
      ok(r.top >= 0, `${name} under a status bar: "${r.what}" is cut off at the top (${r.top})`);
      await ctx.close();
    }
    // every screen keeps its content clear of the top edge at the tightest of those sizes
    {
      const ctx = await phone(393, 793);
      const page = await ctx.newPage();
      for (const name of SCREENS) {
        await page.goto(BASE + '?gntest&screen=' + name + address(SAMPLE));
        await ready(page);
        const r = await placed(page);
        ok(r.top >= 0 && Math.abs(r.bottom - 793) < 0.6, `${name} at 393x793: "${r.what}" at ${r.top.toFixed(1)}, design bottom ${r.bottom}`);
      }
      await ctx.close();
    }
    // a much shorter screen: the empty top zone is left out and the rest is as large as the height allows; a tap still lands
    for (const [name, w, h] of [['iPhone SE in Safari', 375, 553], ['Safari tab on iPhone 14', 390, 664]]) {
      const ctx = await phone(w, h);
      const page = await ctx.newPage();
      await page.goto(BASE + '?gntest&screen=Main');
      await ready(page);
      const r = await placed(page);
      const k = r.w / 390;
      ok(Math.abs(r.w / r.h - 390 / 844) < 0.002 && Math.abs(k - h / 802) < 0.002 && Math.abs(r.bottom - h) < 0.6 && Math.abs((r.x * 2 + r.w) - w) < 1 && r.top >= 0, `${name}: in proportion, as tall as the screen without the top zone, centred, got ${JSON.stringify(r)}`);
      await tap(page, 'nav a:has-text("Cuaderno")', 500);
      ok((await screenName(page)) === 'Notebook', `${name}: a tap on the tab bar should work at this size`);
      await ctx.close();
    }
    // a wide window shows the whole design in a phone frame; a phone held sideways gets a note
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(BASE + '?gntest&screen=Main');
      await ready(page);
      const r = await placed(page);
      ok(r.boxed && Math.abs(r.w / r.h - 390 / 844) < 0.002 && Math.abs((r.x * 2 + r.w) - 1280) < 1 && Math.abs((r.y * 2 + r.h) - 800) < 1, 'a laptop window should show the design whole, centred, in a phone frame, got ' + JSON.stringify(r));
      await shot(page, 'fit-laptop');
      await ctx.close();
      const ctx2 = await phone(844, 390);
      const page2 = await ctx2.newPage();
      await page2.goto(BASE + '?gntest&screen=Main');
      await ready(page2);
      const side = await page2.evaluate(() => ({ cls: document.documentElement.classList.contains('gn-sideways'), card: getComputedStyle(document.querySelector('#gn-sideways')).display, text: document.querySelector('#gn-sideways').textContent }));
      ok(side.cls && side.card === 'flex' && side.text.includes('Girá el celular'), 'a phone held sideways should show the note, got ' + JSON.stringify(side));
      await shot(page2, 'sideways');
      await page2.setViewportSize({ width: 390, height: 844 });
      await page2.waitForTimeout(500);
      const up = await placed(page2);
      ok(!up.sideways && Math.abs(up.h - 844) < 0.5, 'turned upright again, the app should fill the screen, got ' + JSON.stringify(up));
      await ctx2.close();
    }
    note('screen sizes: checked');
  }

  // ---------- 6. offline, and picking up a new build ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const logs = [];
    watch(page, logs);
    await page.goto(BASE + '?sw');
    await ready(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    const stored = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return { keys, urls: (await c.keys()).map((r) => r.url) }; });
    const sw = fs.readFileSync(path.join(DIR, 'sw.js'), 'utf8');
    const listed = JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
    const version = sw.match(/const VERSION = '([0-9a-f]+)'/)[1];
    ok(stored.keys.length === 1 && stored.keys[0] === 'epua:/:' + version, 'the offline copy should be one store named after the folder and the version, got ' + JSON.stringify(stored.keys));
    ok(stored.urls.length === listed.length && stored.urls.every((u) => u.includes('v=' + version)), `the offline copy should hold all ${listed.length} files, each asked for under this version, got ${stored.urls.length}`);
    const onDisk = [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : onDisk.push('./' + path.relative(DIR, path.join(d, e.name)).split(path.sep).join('/'))));
    walk(DIR);
    const missing = onDisk.filter((f) => !['./sw.js', './.nojekyll'].includes(f) && !listed.includes(f));
    ok(missing.length === 0 && listed.filter((f) => f !== './' && !onDisk.includes(f)).length === 0, 'sw.js should list exactly the files of the build, unlisted: ' + JSON.stringify(missing));
    const v1 = await page.evaluate(() => window.__gnBuild);
    {
      const other = await ctx.newPage();
      const inside = await other.goto(BASE + 'anything-here');
      ok(inside.status() === 200 && (await other.locator('#gn-stage').count()) === 1, 'an unknown address in the app folder should open the app, got ' + inside.status());
      await other.close();
    }
    await click(page, 'hablar con mi familia');
    await click(page, 'casa');
    await click(page, 'Siguiente');
    await click(page, 'Empezar en A1');
    await click(page, 'Tejé el primer hilo', 900);
    await click(page, 'Empezar', 700);
    await ctx.setOffline(true);
    await page.reload();
    await ready(page);
    ok((await screenName(page)) === 'Main', 'offline, the app should still open (on the week path, since the goal was set)');
    const fontsOk = await page.evaluate(async () => {
      const got = [];
      for (const w of ["500 16px 'Nunito'", "700 16px 'Nunito'", "800 16px 'Nunito'", "400 16px 'EpuaText'", "700 16px 'EpuaText'"]) { try { const faces = await document.fonts.load(w, "g̃ãẽĩõũỹ'"); got.push(faces.length === 1 && faces[0].status === 'loaded'); } catch (e) { got.push(false); } }
      return got;
    });
    ok(fontsOk.every(Boolean), 'offline, all five font files should load from the stored copy, got ' + JSON.stringify(fontsOk));
    await click(page, 'Empezar', 600);
    await click(page, 'Empezar con la regla', 600);
    ok((await screenName(page)) === 'Teach', 'offline, a lesson should open');
    await shot(page, 'offline-teach');
    ok(logs.filter((l) => !/Failed to load resource/.test(l)).length === 0, 'console problems offline: ' + JSON.stringify(logs.slice(0, 5)));
    await ctx.setOffline(false);

    if (!GIVEN) {
      // a new build: stored, and switched to at a quiet moment only (the week path), never in a lesson
      build({ EPUA_APP_VERSION: '0.1-test-update', EPUA_BUILD_DATE: 'update test' });
      await page.evaluate(() => navigator.serviceWorker.getRegistration().then((r) => r.update()));
      await page.waitForTimeout(2500);
      ok((await page.evaluate(() => window.__gnBuild)) === v1 && (await screenName(page)) === 'Teach', 'a new build should not restart the app in the middle of a lesson');
      await click(page, '[aria-label="Cerrar la lección"]', 600);
      await click(page, '[aria-label="Volver al camino de la semana"]', 600);
      await page.waitForFunction((old) => window.__gnBuild && window.__gnBuild !== old, v1, { timeout: 15000 }).catch(() => {});
      await ready(page);
      const v2 = await page.evaluate(() => window.__gnBuild);
      ok(v2 !== v1 && /0\.1-test-update/.test(v2), `back on the week path the app should restart into the new build, was "${v1}", now "${v2}"`);
      ok((await screenName(page)) === 'Main', 'after the restart the app should be on the week path, progress kept');
      const caches2 = await page.evaluate(() => caches.keys());
      ok(caches2.length === 1 && caches2[0] !== stored.keys[0], 'the old stored copy should be removed, got ' + JSON.stringify(caches2));
      // a newer build found just as the app opens, before anything is tapped, is switched to at once
      build({ EPUA_APP_VERSION: '0.1-test-update-2', EPUA_BUILD_DATE: 'update test' });
      await page.reload();
      await page.waitForFunction((old) => window.__gnBuild && window.__gnBuild !== old, v2, { timeout: 15000 }).catch(() => {});
      await ready(page);
      ok(/0\.1-test-update-2/.test(await page.evaluate(() => window.__gnBuild)), 'opened with a newer build waiting, the app should switch to it before the first tap');
      ok(logs.filter((l) => !/Failed to load resource/.test(l)).length === 0, 'console problems during updates: ' + JSON.stringify(logs.slice(0, 5)));
      build({});
    }
    await ctx.close();
    note(GIVEN ? 'offline: checked (no update check on a given folder)' : 'offline and updates: checked');
  }

  await browser.close();
  server.close();
  console.log(fails ? `APP CHECK: ${fails} problem(s)` : 'APP CHECK PASS');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
