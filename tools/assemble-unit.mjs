// Merge one unit's day files (content/<lv>/parts/uNN-d1.json … uNN-d6.json, uNN-test.json) into content/<lv>/uNN.json.
// Usage: node tools/assemble-unit.mjs a1 1
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const [lv, nArg] = process.argv.slice(2);
const n = Number(nArg);
if (!lv || !n) { console.error('usage: node tools/assemble-unit.mjs a1 1'); process.exit(2); }
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'levels.json'), 'utf8'))[lv.toUpperCase()];
const u = L.units.find((x) => x.n === n);
const nn = String(n).padStart(2, '0');
const dir = path.join(ROOT, 'content', lv, 'parts');
const out = { n, gn: u.gn || '', es: u.es, days: {}, test: [] };
for (let d = 1; d <= 6; d++) {
  const f = path.join(dir, `u${nn}-d${d}.json`);
  if (fs.existsSync(f)) {
    try { out.days[String(d)] = JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { console.error(`x ${f}: not valid JSON: ${e.message}`); process.exitCode = 1; }
  }
}
const tf = path.join(dir, `u${nn}-test.json`);
if (fs.existsSync(tf)) {
  try { out.test = JSON.parse(fs.readFileSync(tf, 'utf8')); }
  catch (e) { console.error(`x ${tf}: not valid JSON: ${e.message}`); process.exitCode = 1; }
}
fs.writeFileSync(path.join(ROOT, 'content', lv, `u${nn}.json`), JSON.stringify(out, null, 1));
console.log(`${lv}/u${nn}.json: days ${Object.keys(out.days).join(', ') || 'none'}; test ${out.test.length} items`);
