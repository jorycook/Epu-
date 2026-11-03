// SVG sheet: every inline <svg> of the given boards, with its holes filled from the board's own renderVals() (the
// prototype's sample state by default; RUN=alone for the canvas view) and loop holes from the first item of their list,
// on one HTML page at the size each board draws it. Then screenshot it with tools/shot.mjs. For checking art without the
// canvas runtime. Usage: node tools/svg-sheet.mjs out.html Board.dc.html …
// Deep hole check (a companion of smoke-boards.mjs): like the smoke test, but it follows every dotted hole to its end
// ({{ a.b.c }}, and loop holes through the first item of their list) and writes the holes that do not resolve, per board
// and run, to a JSON file, so two runs (before and after an edit) can be compared. Usage: node tools/deep-holes.mjs out.json [Board …]
// Original header of the smoke test follows.
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
const OUTF = process.argv[2];
const RUN = process.env.RUN || 'app:sample';
const files = process.argv.slice(3).length ? process.argv.slice(3).map((f) => path.basename(f)) : fs.readdirSync(P).filter((f) => f.endsWith('.dc.html'));

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



function get(o, segs) { let v = o; for (const s of segs) { if (v == null) return undefined; v = v[s]; } return v; }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let html = '<!doctype html><meta charset="utf-8"><title>SVG sheet</title><style>body{margin:16px;font:12px Nunito,sans-serif;color:#1B2440;background:#FFFFFF}section{margin:0 0 18px}h2{font-size:15px;margin:10px 0 6px}.row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end}figure{margin:0;padding:6px;border:1px solid #DDE1EC;border-radius:8px;background:#F4F5F9;display:flex;flex-direction:column;align-items:center;gap:4px}figcaption{font-size:10px;color:#5A6382;max-width:220px;text-align:center}</style>';
for (const f of files.sort()) {
  const src = fs.readFileSync(path.join(P, f), 'utf8');
  const m = /<script type="text\/x-dc" data-dc-script data-props='([^']*)'>([\s\S]*?)<\/script>/.exec(src);
  if (!m) continue;
  const markup = (/<x-dc>([\s\S]*)<\/x-dc>/.exec(src) || [])[1] || '';
  const loops = {};
  for (const x of markup.matchAll(/<sc-for\b[^>]*\blist="\{\{\s*([\w$.]+)\s*\}\}"[^>]*\bas="([A-Za-z_$][\w$]*)"/g)) (loops[x[2]] = loops[x[2]] || []).push(x[1]);
  const run = RUN === 'alone' ? { props: {} } : { state: RUN === 'app:fresh' ? 'window.gnCourse.fresh()' : SAMPLE_JS };
  const ctx = makeWindow();
  let v = {};
  try {
    let props = run.props || {};
    if (run.state) {
      vm.runInContext(`var __st = ${run.state}; var __h = window.gnCourse.handlers(() => __st, (fn) => { __st = Object.assign({}, __st, fn(__st)); });`, ctx);
      props = vm.runInContext(`({ app: window.gnCourse.view(__st), go: __h.go, save: __h.save, miss: __h.miss, reviewed: __h.reviewed, level: __h.level })`, ctx);
    }
    if (process.env.PROPS) Object.assign(props, JSON.parse(process.env.PROPS));
    ctx.__props = props;
    v = vm.runInContext(`${m[2]}\n;(function(){ const c = new Component(__props); if (c.componentDidMount) { try { c.componentDidMount(); } catch (e) {} } return c.renderVals(); })()`, ctx, { filename: f, timeout: 3000 }) || {};
  } catch (e) { html += `<p>${esc(f)}: renderVals threw ${esc(e.message)}</p>`; }
  const first = (lp, depth) => {
    const segs = lp.split('.');
    if (depth < 5 && loops[segs[0]] && !(segs[0] in v)) { for (const outer of loops[segs[0]]) { const it = first(outer, depth + 1); const a = get(it, segs.slice(1)); if (Array.isArray(a) && a.length) return a[0]; } return undefined; }
    const a = get(v, segs); return Array.isArray(a) && a.length ? a[0] : undefined;
  };
  const fill = (s) => s.replace(/\{\{\s*([A-Za-z_$][\w$]*(?:\.[\w$]+)*)\s*\}\}/g, (_, p) => {
    const segs = p.split('.');
    let val;
    if (loops[segs[0]] && !(segs[0] in v)) { for (const lp of loops[segs[0]]) { const it = first(lp, 0); if (it !== undefined) { val = get(it, segs.slice(1)); if (val !== undefined) break; } } }
    else val = get(v, segs);
    if (val === undefined || val === null || typeof val === 'function') return '';
    return typeof val === 'object' ? '' : String(val);
  });
  const svgs = [...markup.matchAll(/<svg\b[\s\S]*?<\/svg>/g)];
  const keep = process.env.ALL ? svgs : svgs.filter((x) => (process.env.MATCH ? new RegExp(process.env.MATCH, 'i') : /aria-label|viewBox="0 0 100 100"|viewBox="0 0 125 112"|viewBox="0 0 140 84"/).test(x[0]));
  html += `<section><h2>${esc(f)} <small>(${keep.length} of ${svgs.length} svg)</small></h2><div class="row">`;
  for (const x of keep) {
    const line = markup.slice(0, x.index).split('\n').length;
    let s = fill(x[0]).replace(/width="100%"/, 'width="160"');
    const lab = (/aria-label="([^"]*)"/.exec(s) || [])[1] || '';
    html += `<figure>${s}<figcaption>${esc(f.replace('.dc.html', ''))}:${line} ${esc(lab).slice(0, 120)}</figcaption></figure>`;
  }
  html += '</div></section>';
}
fs.writeFileSync(OUTF, html);
console.log('wrote ' + OUTF);
