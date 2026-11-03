// Guarani course build: checks every content file and writes the level data the screens read
// (project/gn-course-a1.js … gn-course-c2.js, each setting window.__gnCourses[LEVEL]).
// The syllabus of all six levels is content/levels.json; the written units are content/<level>/uNN.json.
// Run: node tools/build-course.mjs [--check]   (--check: report only, write nothing)
// Exit code 1 when any error is found. Warnings do not stop the build.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const OUT = process.env.GN_OUT || path.join(ROOT, 'project');
const CHECK_ONLY = process.argv.includes('--check');
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const AREAS = ['vocab', 'grammar', 'reading', 'listening', 'mediation', 'sound'];
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// ---------- Guarani text ----------
const BAD_PUSO = /[’‘ʼ´`ʹʻ]/;
const MARKUP = /[{}\[\]|_^]/g;
const ACUTE = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y' };
function plain(s) { return String(s ?? '').replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1').replace(/[{}_^]/g, ''); }
function fold(s) { return plain(s).normalize('NFC').toLowerCase().replace(/[áéíóúý]/g, (c) => ACUTE[c]).replace(/[\s.,;:!?¿¡"«»()-]+/g, ''); }
// every string in the content: NFC, one puso (U+0027), balanced markup
function checkText(where, s) {
  if (typeof s !== 'string') return;
  if (s.normalize('NFC') !== s) err(where, `not in Unicode NFC: ${JSON.stringify(s)}`);
  if (BAD_PUSO.test(s)) err(where, `puso must be the apostrophe U+0027: ${JSON.stringify(s)}`);
  if (/̃/.test(s.replace(/[gG]̃/g, ''))) err(where, `combining tilde U+0303 outside g̃ (use a precomposed vowel): ${JSON.stringify(s)}`);
  const braces = (s.match(/[{}]/g) || []).length;
  if (braces % 2) err(where, `unbalanced {highlight}: ${JSON.stringify(s)}`);
  if ((s.match(/\^/g) || []).length % 2) err(where, `unbalanced ^clue^: ${JSON.stringify(s)}`);
  if ((s.match(/_/g) || []).length % 2) err(where, `unbalanced _underline_: ${JSON.stringify(s)}`);
  const open = (s.match(/\[/g) || []).length, close = (s.match(/\]/g) || []).length;
  if (open !== close) err(where, `unbalanced [base|gloss]: ${JSON.stringify(s)}`);
  if (/\s{2,}/.test(s.replace(/\n/g, ' ').replace(/\( +\)/g, '()'))) warn(where, `double space: ${JSON.stringify(s)}`);
}
function walkText(where, v) {
  if (typeof v === 'string') checkText(where, v);
  else if (Array.isArray(v)) v.forEach((x, i) => walkText(`${where}[${i}]`, x));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walkText(`${where}.${k}`, x));
}

// ---------- items ----------
const seen = new Map();
function checkItem(where, it, ctx, opts = {}) {
  if (!it || typeof it !== 'object') { err(where, 'item missing'); return null; }
  if (!it.id || typeof it.id !== 'string') err(where, 'item without id');
  else {
    if (!it.id.startsWith(ctx.prefix)) err(where, `id ${it.id} should start with ${ctx.prefix}`);
    if (seen.has(it.id)) err(where, `duplicate id ${it.id} (also at ${seen.get(it.id)})`);
    seen.set(it.id, where);
  }
  if (!AREAS.includes(it.area)) err(where, `area must be one of ${AREAS.join(', ')} (got ${it.area})`);
  if (!it.label) warn(where, 'no label');
  if (it.kind === 'choice') {
    if (!it.q) err(where, 'choice without q');
    if (!Array.isArray(it.options) || it.options.length < 2) err(where, 'choice needs 2+ options');
    else {
      const n = it.options.length;
      if (opts.options && n !== opts.options) warn(where, `expected ${opts.options} options, has ${n}`);
      const folded = it.options.map((o) => fold(o));
      if (new Set(folded).size !== n) err(where, 'options repeat (after removing marks)');
      if (!(Number.isInteger(it.answer) && it.answer >= 1 && it.answer <= n)) err(where, `answer must be 1..${n}`);
      if (it.why != null) {
        if (!Array.isArray(it.why) || it.why.length !== n) err(where, 'why needs one line per option');
        else it.why.forEach((w, i) => { if (!w && i !== it.answer - 1 && !it.explain) err(where, `why[${i}] empty and no explain`); });
      }
      if (it.why == null && !it.explain) err(where, 'choice needs why or explain');
      if (it.short && (!Array.isArray(it.short) || it.short.length !== n)) err(where, 'short needs one label per option');
      if (/\(\s*\)/.test(it.q) === false && !/_[^_]+_/.test(it.q) && !opts.free) warn(where, 'q has no blank "(   )" and no _underlined_ word');
    }
  } else if (it.kind === 'build') {
    if (!['word', 'sentence'].includes(it.join)) err(where, 'build needs join: word | sentence');
    if (!Array.isArray(it.tiles) || it.tiles.length < 2 || it.tiles.length > 6) err(where, 'build needs 2-6 tiles');
    else {
      const n = it.tiles.length;
      if (!Array.isArray(it.bank) || it.bank.length !== n || [...it.bank].sort().join() !== [...Array(n).keys()].join()) err(where, 'bank must be a permutation of the tile indexes');
      else if (it.bank.every((b, i) => b === i)) err(where, 'bank must not be in the right order');
      if (new Set(it.tiles.map(fold)).size !== n) err(where, 'tiles repeat');
      if (!it.full) err(where, 'build needs full');
      else {
        const sep = it.join === 'word' ? '' : ' ';
        const joined = `${it.before || ''}${it.join === 'sentence' && it.before ? ' ' : ''}${it.tiles.join(sep)}${it.join === 'sentence' && it.after && !/^[.,;:!?]/.test(it.after) ? ' ' : ''}${it.after || ''}`;
        if (fold(joined) !== fold(it.full)) err(where, `full does not match before + tiles + after (ignoring accents and spaces): ${JSON.stringify(plain(it.full))} vs ${JSON.stringify(joined)}`);
      }
      if (!it.explain) err(where, 'build needs explain');
      if (!it.es) warn(where, 'build without es (the Spanish meaning)');
      if (opts.exam && it.hint) warn(where, 'exam build items take no hint');
    }
  } else if (it.kind === 'spell') {
    if (!it.prompt) err(where, 'spell needs prompt (the Spanish meaning)');
    if (!it.answer) err(where, 'spell needs answer');
    if (it.accept && !Array.isArray(it.accept)) err(where, 'accept must be a list');
  } else {
    err(where, `unknown kind ${it.kind}`);
  }
  walkText(where, it);
  return { ...it, ...ctx.tag };
}

// ---------- days ----------
function checkPoint(where, p, prefix) {
  if (!p.id || !p.id.startsWith(prefix)) err(where, `point id should start with ${prefix}`);
  for (const k of ['form', 'gloss']) if (!p[k]) err(where, `point needs ${k}`);
  if (!Array.isArray(p.connect) || p.connect.length < 1) err(where, 'point needs connect rows');
  if (!Array.isArray(p.examples) || p.examples.length < 2) err(where, 'point needs 2+ examples');
  else p.examples.forEach((e, i) => {
    if (!e.gn || !e.es) err(`${where}.examples[${i}]`, 'example needs gn and es');
    if (e.parts && !(Array.isArray(e.parts) && e.parts.every((x) => Array.isArray(x) && x.length === 2))) err(`${where}.examples[${i}]`, 'parts must be [[gn, es], ...]');
  });
  if (!p.watch || !p.watch.note) warn(where, 'point without watch note');
  walkText(where, p);
}
function checkDay(where, d, n, sid, items, title) {
  if (!d.title) err(where, 'day without title');
  if (title && d.title !== title) err(where, `title ${JSON.stringify(d.title)} differs from the syllabus ${JSON.stringify(title)}`);
  const g = d.grammar;
  if (!g) { err(where, 'day without grammar'); return; }
  const review = n === 6;
  if (review) { if (Array.isArray(g.points) && g.points.length) err(where, 'the review day has no points (points: [])'); }
  else if (!Array.isArray(g.points) || g.points.length !== 2) err(where, 'a study day has exactly 2 points');
  (g.points || []).forEach((p, i) => checkPoint(`${where}.grammar.points[${i}]`, p, sid + '.p'));
  if (!g.compare || !Array.isArray(g.compare.forms) || g.compare.forms.length < 2) err(where, 'compare needs 2+ forms');
  else {
    g.compare.forms.forEach((f, i) => { if (!f.form || !f.gn || !f.es || !['dot', 'down', 'up'].includes(f.mark)) err(`${where}.compare.forms[${i}]`, 'form needs form, gn, es, mark dot|down|up'); });
    walkText(`${where}.compare`, { intro: g.compare.intro, forms: g.compare.forms });
    const c = checkItem(`${where}.compare.check`, g.compare.check, { prefix: sid + '.c', tag: { step: 'compare' } }, { options: 3 });
    if (c) items[c.id] = c;
  }
  if (!Array.isArray(g.drill) || g.drill.length < 4) err(where, 'drill needs 4+ items');
  else g.drill.forEach((it, i) => { const c = checkItem(`${where}.grammar.drill[${i}]`, it, { prefix: sid + '.d', tag: { step: 'drill' } }); if (c) items[c.id] = c; });
  if (!Array.isArray(g.exam) || g.exam.length !== 3) err(where, 'exam needs exactly 3 items');
  else g.exam.forEach((it, i) => { const c = checkItem(`${where}.grammar.exam[${i}]`, it, { prefix: sid + '.e', tag: { step: 'exam' } }, { exam: true }); if (c) items[c.id] = c; });
  const w = d.words;
  if (!w) err(where, 'day without words');
  else {
    if (!w.es || !w.intro) err(`${where}.words`, 'words need es (scene title) and intro');
    if (!Array.isArray(w.words) || w.words.length < 4) err(`${where}.words`, 'words need 4+ words');
    else {
      const ids = new Set();
      w.words.forEach((x, i) => {
        if (!x.id || !x.gn || !x.es) err(`${where}.words.words[${i}]`, 'word needs id, gn, es');
        if (ids.has(x.id)) err(`${where}.words.words[${i}]`, `word id ${x.id} repeats`);
        ids.add(x.id);
        if (x.parts && !(Array.isArray(x.parts) && x.parts.every((p) => Array.isArray(p) && p.length === 2))) err(`${where}.words.words[${i}]`, 'parts must be [[gn, es], ...]');
      });
      (w.spell || []).forEach((s) => { if (!ids.has(s)) err(`${where}.words.spell`, `spell names unknown word ${s}`); });
    }
    if (w.sound) {
      if (!w.sound.focus || !w.sound.note) err(`${where}.words.sound`, 'sound needs focus and note');
      (w.sound.pairs || []).forEach((p, i) => { if (!(Array.isArray(p) && p.length === 4)) err(`${where}.words.sound.pairs[${i}]`, 'a pair is [gnA, esA, gnB, esB]'); });
    }
    walkText(`${where}.words`, { ...w, check: undefined });
    const c = checkItem(`${where}.words.check`, w.check, { prefix: sid + '.k', tag: { step: 'words' } });
    if (c) items[c.id] = c;
  }
  const s = d.skill;
  if (!s) err(where, 'day without skill');
  else {
    if (!['reading', 'listening'].includes(s.kind)) err(`${where}.skill`, 'kind must be reading | listening');
    if (!s.es || !s.ask) err(`${where}.skill`, 'skill needs es and ask');
    if (s.kind === 'reading' && !s.passage) err(`${where}.skill`, 'reading needs passage');
    if (s.kind === 'listening' && !(Array.isArray(s.audio) && s.audio.length)) err(`${where}.skill`, 'listening needs audio lines');
    walkText(`${where}.skill`, { ...s, item: undefined });
    const c = checkItem(`${where}.skill.item`, s.item, { prefix: sid + '.r', tag: { step: 'skill' } }, { free: true });
    if (c) items[c.id] = c;
  }
}

// ---------- levels ----------
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const syllabus = read(path.join(CONTENT, 'levels.json'));
const report = [];
for (const lv of LEVELS) {
  const L = syllabus[lv];
  if (!L) { err('levels.json', `level ${lv} missing`); continue; }
  const pre = lv.toLowerCase();
  const items = {};
  const units = (L.units || []).map((u) => {
    const unitFile = path.join(CONTENT, pre, `u${String(u.n).padStart(2, '0')}.json`);
    const written = fs.existsSync(unitFile) ? read(unitFile) : null;
    const titles = u.days || [];
    if (titles.length !== 5) err(`levels.json ${lv} unit ${u.n}`, 'needs 5 study-day titles');
    walkText(`levels.json ${lv} unit ${u.n}`, u);
    const days = [];
    for (let d = 1; d <= 6; d++) {
      const title = d === 6 ? (u.review || 'Repaso de la semana') : titles[d - 1];
      const w = written && written.days && written.days[String(d)];
      const sid = `${pre}u${String(u.n).padStart(2, '0')}d${d}`;
      if (w) { checkDay(`${pre}/u${String(u.n).padStart(2, '0')}.json day ${d}`, w, d, sid, items, title); days.push(w); }
      else days.push({ title });
    }
    let test = [];
    if (written && Array.isArray(written.test)) {
      const tid = `${pre}u${String(u.n).padStart(2, '0')}t`;
      if (written.test.length < 12) warn(`${pre}/u${String(u.n).padStart(2, '0')}.json test`, `only ${written.test.length} items (Yaoki's week tests have 24)`);
      test = written.test.map((it, i) => { const c = checkItem(`${pre}/u${String(u.n).padStart(2, '0')}.json test[${i}]`, it, { prefix: tid + '.', tag: { step: 'test', unit: u.n } }, { free: true }); if (c) items[c.id] = c; return c ? c.id : null; }).filter(Boolean);
    }
    if (written) {
      if (written.n !== u.n) err(`${pre}/u${String(u.n).padStart(2, '0')}.json`, `n ${written.n} differs from the syllabus ${u.n}`);
      if (written.es !== u.es) err(`${pre}/u${String(u.n).padStart(2, '0')}.json`, `es ${JSON.stringify(written.es)} differs from the syllabus ${JSON.stringify(u.es)}`);
    }
    return { n: u.n, gn: u.gn || '', es: u.es, days, test };
  });
  const out = { level: lv, name: L.name, units, items };
  const written = units.reduce((a, u) => a + u.days.filter((d) => d.grammar).length, 0);
  report.push(`${lv}: ${units.length} units, ${written} days written, ${Object.keys(items).length} items`);
  if (!CHECK_ONLY) {
    fs.mkdirSync(OUT, { recursive: true });
    const js = `/* ${lv} · ${L.name}: made by tools/build-course.mjs from content/ — do not edit by hand */\nwindow.__gnCourses = window.__gnCourses || {};\nwindow.__gnCourses.${lv} = ${JSON.stringify(out)};\n`;
    fs.writeFileSync(path.join(OUT, `gn-course-${pre}.js`), js);
  }
}

// ---------- extras: placement, level exams, the reader's library, typing and speaking lists ----------
// content/extra/<name>.json → project/gn-extra.js (window.__gnExtra.<name>). Items inside are checked like lesson items.
const EXTRA = path.join(CONTENT, 'extra');
if (fs.existsSync(EXTRA)) {
  const bag = {};
  for (const f of fs.readdirSync(EXTRA).filter((x) => x.endsWith('.json')).sort()) {
    const name = f.replace(/\.json$/, '');
    let data;
    try { data = read(path.join(EXTRA, f)); } catch (e) { err(`extra/${f}`, `not valid JSON: ${e.message}`); continue; }
    walkText(`extra/${f}`, data);
    // any object with kind choice/build/spell is an item: check it (ids must be unique and carry the file's prefix)
    const prefix = { placement: 'pl.', 'exam-a1': 'a1x.', reader: 'rd.', speaking: 'sp.', typing: 'ty.' }[name] || name + '.';
    (function visit(v, where) {
      if (Array.isArray(v)) v.forEach((x, i) => visit(x, `${where}[${i}]`));
      else if (v && typeof v === 'object') {
        if (['choice', 'build', 'spell'].includes(v.kind)) checkItem(where, v, { prefix, tag: {} }, { free: true });
        else Object.entries(v).forEach(([k, x]) => visit(x, `${where}.${k}`));
      }
    })(data, `extra/${f}`);
    bag[name] = data;
    report.push(`extra/${f}: ok`);
  }
  if (!CHECK_ONLY && Object.keys(bag).length) {
    fs.writeFileSync(path.join(OUT, 'gn-extra.js'), `/* placement, level exams, reader library, typing and speaking lists: made by tools/build-course.mjs from content/extra — do not edit by hand */\nwindow.__gnExtra = ${JSON.stringify(bag)};\n`);
  }
}
console.log(report.join('\n'));
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n` + warnings.map((w) => '  ! ' + w).join('\n'));
if (errors.length) { console.log(`\n${errors.length} error(s):\n` + errors.map((e) => '  x ' + e).join('\n')); process.exitCode = 1; }
else console.log(CHECK_ONLY ? '\nContent checks passed.' : `\nContent checks passed; level files written to ${OUT}`);
