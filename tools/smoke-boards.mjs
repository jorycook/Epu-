// Logic smoke test for the canvas boards: loads the engine and the level data in a sandbox, then for each board builds
// its Component the way the canvas does (no props, or its moment props) and the way the prototype does (App's props from
// a fresh state and from the SAMPLE state), and calls renderVals(). It never renders markup. It reports exceptions and,
// for each hole name used in the markup, whether renderVals returned it (a missing top-level name renders blank).
// Usage: node tools/smoke-boards.mjs [Board.dc.html …]   (default: every board in canvas/project)
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const P = path.join(ROOT, 'project');
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.basename(f)) : fs.readdirSync(P).filter((f) => f.endsWith('.dc.html'));

function makeWindow() {
  const listeners = {};
  const doc = {
    getElementsByTagName: () => [], querySelector: () => null, querySelectorAll: () => [], elementFromPoint: () => null,
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }), head: { appendChild() {} }, body: { appendChild() {} },
    documentElement: { appendChild() {} }, addEventListener: (t, f) => { listeners[t] = f; }, removeEventListener() {},
    fonts: { ready: Promise.resolve() }, visibilityState: 'visible',
  };
  const win = { document: doc, navigator: { userAgent: 'node' }, addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {}, requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    performance: { now: () => 0 }, Intl, Date, Math, JSON, console, Promise, Object, Array, String, Number, Boolean, RegExp, Error, Map, Set, Symbol, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, atob: (s) => Buffer.from(s, 'base64').toString('binary') };
  win.window = win;
  win.self = win;
  const ctx = vm.createContext(win);
  for (const f of ['gn-sound.js', 'gn-course-a1.js', 'gn-course-a2.js', 'gn-course-b1.js', 'gn-course-b2.js', 'gn-course-c1.js', 'gn-course-c2.js', 'gn-course.js', 'gn-spell.js', 'gn-extra.js']) {
    const p = path.join(P, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  }
  vm.runInContext(`class DCLogic { constructor(props) { this.props = props || {}; this.state = this.state || {}; } setState(u) { const p = typeof u === 'function' ? u(this.state, this.props) : u; this.state = Object.assign({}, this.state, p || {}); } forceUpdate() {} }`, ctx);
  return ctx;
}

const SAMPLE_JS = `(function () { const C = window.gnCourse; const T = C.today(C.now()); const full = { g: 3, k: 1, r: 1 };
  return { screen: 'Main', level: 'A1', started: true, plan: { start: C.addDays(T, -3), target: C.addDays(T, 60), pace: 'fit', minutes: 30 },
    plans: {}, done: { a1u01d1: full, a1u01d2: full, a1u01d3: full, a1u01d4: { g: 1 } }, tests: {}, exams: {},
    mistakes: [{ src: 'a1u01d2.d1', wrong: 'ore', at: 0, step: 0, due: T }], cur: 'a1u01d4', tp: 0, set: 'day',
    placement: { comp: 'A2', prod: 'A1', start: 'A1' }, typed: [] }; })()`;

let bad = 0;
for (const f of files.sort()) {
  const src = fs.readFileSync(path.join(P, f), 'utf8');
  const m = /<script type="text\/x-dc" data-dc-script data-props='([^']*)'>([\s\S]*?)<\/script>/.exec(src);
  if (!m) { console.log(`${f}: no logic block`); bad++; continue; }
  const markup = (/<x-dc>([\s\S]*)<\/x-dc>/.exec(src) || [])[1] || '';
  // top-level names used in holes (outside sc-for items): rough: first segment of each dotted hole
  const holes = new Set([...markup.matchAll(/\{\{\s*([A-Za-z_$][\w$]*)/g)].map((x) => x[1]));
  const loopVars = new Set([...markup.matchAll(/<sc-for\b[^>]*\bas="([A-Za-z_$][\w$]*)"/g)].map((x) => x[1]));
  ['true', 'false', 'null', '$index'].forEach((x) => holes.delete(x));
  loopVars.forEach((x) => holes.delete(x));
  // the props a moment board passes: read them from its dc-import of a sibling (name, then attributes)
  const runs = [];
  runs.push({ label: 'alone', props: {} });
  const ctx0 = makeWindow();
  const view = (s) => vm.runInContext(`window.gnCourse.view(${s})`, ctx0);
  runs.push({ label: 'app:fresh', state: 'window.gnCourse.fresh()' });
  runs.push({ label: 'app:sample', state: SAMPLE_JS });
  // moment props: every other board that imports this one with literal attributes (view="result", demo="6", …)
  const stem = f.replace(/\.dc\.html$/, '');
  for (const g of fs.readdirSync(P).filter((x) => x.endsWith('.dc.html') && x !== f)) {
    const gs = fs.readFileSync(path.join(P, g), 'utf8');
    for (const im of gs.matchAll(new RegExp(`<dc-import\\s+name="${stem}"([^>]*)>`, 'g'))) {
      const props = {};
      for (const a of im[1].matchAll(/([a-z][\w-]*)="([^"{]*)"/g)) {
        if (a[1] === 'hint-size') continue;
        props[a[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = a[2];
      }
      if (Object.keys(props).length) runs.push({ label: `moment from ${g} ${JSON.stringify(props)}`, props });
    }
  }
  for (const run of runs) {
    const ctx = makeWindow();
    try {
      let props = run.props || {};
      if (run.state) {
        vm.runInContext(`var __st = ${run.state}; var __h = window.gnCourse.handlers(() => __st, (fn) => { __st = Object.assign({}, __st, fn(__st)); });`, ctx);
        props = vm.runInContext(`({ app: window.gnCourse.view(__st), go: __h.go, save: __h.save, miss: __h.miss, reviewed: __h.reviewed, level: __h.level })`, ctx);
      }
      ctx.__props = props;
      const out = vm.runInContext(`${m[2]}\n;(function(){ const c = new Component(__props); if (c.componentDidMount) { try { c.componentDidMount(); } catch (e) { throw new Error('componentDidMount: ' + e.message); } } const v = c.renderVals(); return { keys: Object.keys(v || {}), v }; })()`, ctx, { filename: f, timeout: 3000 });
      const missing = [...holes].filter((h) => !out.keys.includes(h));
      if (missing.length) { console.log(`${f} [${run.label}]: holes not returned by renderVals: ${missing.join(', ')}`); bad++; }
      else console.log(`${f} [${run.label}]: ok (${out.keys.length} values)`);
    } catch (e) {
      bad++;
      console.log(`${f} [${run.label}]: THROWS ${e && e.message ? e.message.split('\n')[0] : e}`);
    }
  }
}
console.log(bad ? `\n${bad} problem(s)` : '\nall boards ran');
if (bad) process.exitCode = 1;
