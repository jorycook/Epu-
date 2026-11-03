// Export every question of the built course without its answer, for a blind solver (Yaoki's blind check).
// Writes build/blind/questions.json and build/blind/keys.json. Usage: node tools/blind-export.mjs
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const P = path.join(ROOT, 'project');
const ctx = vm.createContext({ window: {} });
ctx.window.window = ctx.window;
for (const f of ['gn-course-a1.js', 'gn-extra.js']) vm.runInContext(fs.readFileSync(path.join(P, f), 'utf8'), ctx);
const W = ctx.window;
const plain = (s) => String(s ?? '').replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1').replace(/[{}_^]/g, '');
const items = [];
const keys = {};
function add(it, context) {
  if (!it || !it.id) return;
  if (it.kind === 'choice') {
    items.push({ id: it.id, kind: 'choice', context, passage: it.passage ? plain(it.passage) : undefined, script: it.script ? it.script.map(plain) : undefined, q: plain(it.q), options: it.options.map(plain) });
    keys[it.id] = it.answer;
  } else if (it.kind === 'build') {
    const order = it.bank.map((b) => plain(it.tiles[b]));
    items.push({ id: it.id, kind: 'build', context, join: it.join, es: it.es, before: plain(it.before || ''), after: plain(it.after || ''), tiles_shuffled: order });
    keys[it.id] = it.tiles.map(plain);
  } else if (it.kind === 'spell') {
    items.push({ id: it.id, kind: 'spell', context, prompt: it.prompt });
    keys[it.id] = it.answer;
  }
}
const A1 = W.__gnCourses.A1;
for (const u of A1.units) {
  u.days.forEach((d, i) => {
    if (!d || !d.grammar) return;
    const ctxt = `A1 unidad ${u.n}, día ${i + 1}: ${d.title}`;
    const g = d.grammar;
    add(g.compare && g.compare.check, ctxt + ' (comparar)');
    (g.drill || []).forEach((it) => add(it, ctxt + ' (práctica)'));
    (g.exam || []).forEach((it) => add(it, ctxt + ' (examen)'));
    add(d.words && d.words.check, ctxt + ' (palabras)');
    if (d.skill && d.skill.item) add(Object.assign({}, d.skill.item, d.skill.kind === 'reading' ? { passage: d.skill.passage } : {}), ctxt + ` (${d.skill.kind === 'reading' ? 'lectura' : 'escucha'})`);
  });
  (u.test || []).forEach((id) => add(A1.items[id], `A1 unidad ${u.n}: prueba de la semana`));
}
const X = W.__gnExtra || {};
(function visit(v, where) {
  if (Array.isArray(v)) v.forEach((x) => visit(x, where));
  else if (v && typeof v === 'object') {
    if (['choice', 'build', 'spell'].includes(v.kind)) add(v, where);
    else Object.entries(v).forEach(([k, x]) => visit(x, where + '/' + k));
  }
})(X, 'extra');
fs.mkdirSync(path.join(ROOT, 'blind'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'blind', 'questions.json'), JSON.stringify(items, null, 1));
fs.writeFileSync(path.join(ROOT, 'blind', 'keys.json'), JSON.stringify(keys, null, 1));
console.log(`${items.length} questions exported (${items.filter((x) => x.kind === 'choice').length} choice, ${items.filter((x) => x.kind === 'build').length} build, ${items.filter((x) => x.kind === 'spell').length} spell)`);
