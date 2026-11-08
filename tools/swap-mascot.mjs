// Swap Kaguare's art in the canvas boards. Every board holds instances of the mascot's poses pasted from
// brief/mascot/spec.json; when the spec changes, this tool finds each instance by matching the OLD spec's inner markup
// under the transformations the boards apply to it, and rebuilds it from the NEW spec's SVG for the same pose with the
// same transformations:
//   (a) the root <svg …> attributes (width, height, role, aria-label, style, a wider viewBox) are the board's own and stay;
//   (b) the eight data-part groups of the standing pose keep the opacity attribute the instance has (a hole such as
//       opacity="{{ masc.eyeO }}", a value, or none at all), whatever the spec ships;
//   (c) where the board nests the level's rosette in the brooch, the stand-in group <g class="rosette">…</g> was replaced
//       by <g transform="translate(cx cy) scale(s)">…engine markup with holes…</g>: the engine markup is kept and moved to
//       the NEW brooch centre (spec.poses[pose].rosette) at the instance's scale;
//   (d) the brand boards wrap the inner markup (in <g transform="translate(11 10)"> inside a 125×112 box) or tint the
//       icon's tile with a hole: the wrapper is outside the match and stays, the tile fill is copied.
// The two Hablar thumbs (spec.thumbs) are matched as fragments; the fallen-mini inside thumb-fallen is claimed by the thumb.
// It reports every instance it replaced, every mascot-looking SVG it could not match (the fur #EDC27C, the vest #2A2120
// or a data-part group, and no replacement inside it), and every path of the old art that remains anywhere.
// Deterministic: the same boards and specs give the same output. Exit code 1 when something is unmatched or left over.
// Usage: node tools/swap-mascot.mjs --old <old-spec.json> [--new brief/mascot/spec.json] [--check] [Board.dc.html …]
//   --check: report only, write nothing. Default boards: every project/*.dc.html.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const opt = (name, dflt) => { const i = args.indexOf(name); if (i < 0) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const CHECK = flag('--check');
const OLD_PATH = opt('--old', null);
const NEW_PATH = opt('--new', path.join(ROOT, 'brief/mascot/spec.json'));
if (!OLD_PATH) { console.error('usage: node tools/swap-mascot.mjs --old <old-spec.json> [--new spec.json] [--check] [Board.dc.html …]'); process.exit(2); }
const files = (args.length ? args : fs.readdirSync(path.join(ROOT, 'project')).filter((f) => f.endsWith('.dc.html')).map((f) => path.join(ROOT, 'project', f)))
  .map((f) => path.resolve(f)).sort();

const OLD = JSON.parse(fs.readFileSync(OLD_PATH, 'utf8'));
const NEW = JSON.parse(fs.readFileSync(NEW_PATH, 'utf8'));
const inner = (svg, what) => { const m = /^<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/.exec(svg || ''); if (!m) throw new Error(`${what}: not an <svg>…</svg> string`); return m[1]; };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const TILE = /<rect width="100" height="100" rx="22\.3" fill="(#[0-9A-Fa-f]{6}|\{\{[^}]*\}\})"\/>/;
const PART = /<g data-part="([^"]+)"( opacity="[^"]*")?>/g;
const STANDIN = /<g class="rosette"( transform="[^"]*")?>[\s\S]*?<\/g>/;

/* the templates: every pose's inner markup (the two icons differ only by the tile fill, so one template covers both),
   then the two thumbs as fragments; longest first, so a fragment that contains another (thumb-fallen holds the fallen
   mini) claims its span before the smaller one is tried */
for (const S of [OLD, NEW]) {
  const a = inner(S.poses['icon-pink'].svg, 'icon-pink').replace(TILE, '<tile/>'), b = inner(S.poses['icon-green'].svg, 'icon-green').replace(TILE, '<tile/>');
  if (a !== b) throw new Error('icon-pink and icon-green differ beyond the tile fill: give the tool one template per icon');
}
const TEMPLATES = [];
for (const key of Object.keys(OLD.poses)) {
  if (key === 'icon-green') continue;
  if (!NEW.poses[key]) throw new Error(`the new spec has no pose ${key}`);
  TEMPLATES.push({ key, old: inner(OLD.poses[key].svg, key), neu: inner(NEW.poses[key].svg, key), oldRos: OLD.poses[key].rosette, newRos: NEW.poses[key].rosette });
}
for (const key of Object.keys(OLD.thumbs || {})) {
  if (!NEW.thumbs || !NEW.thumbs[key]) throw new Error(`the new spec has no thumb ${key}`);
  TEMPLATES.push({ key: 'thumb-' + key, old: OLD.thumbs[key], neu: NEW.thumbs[key], oldRos: null, newRos: null });
}
TEMPLATES.sort((a, b) => b.old.length - a.old.length || a.key.localeCompare(b.key));

/* a template's matcher: the old inner markup as a regex, with the variable parts as capture groups */
function compile(t) {
  const tokens = new RegExp(`${PART.source}|${STANDIN.source}|${TILE.source}`, 'g');
  let src = '', last = 0, group = 1, m;
  t.slots = [];
  while ((m = tokens.exec(t.old))) {
    src += esc(t.old.slice(last, m.index));
    if (m[0].startsWith('<g data-part')) {
      src += `<g data-part="${esc(m[1])}"(?: opacity="([^"]*)")?>`;
      t.slots.push({ type: 'part', name: m[1], at: group++ });
    } else if (m[0].startsWith('<g class="rosette"')) {
      // the stand-in as shipped, or the engine's rosette nested in its place right after the disc
      src += `(?:${esc(m[0])}|<g transform="translate\\((-?[\\d.]+) (-?[\\d.]+)\\) scale\\((-?[\\d.]+)\\)">([\\s\\S]*?)<\\/g>)`;
      t.slots.push({ type: 'rosette', at: group });
      group += 4;
    } else {
      src += `<rect width="100" height="100" rx="22\\.3" fill="([^"]*)"\\/>`;
      t.slots.push({ type: 'tile', at: group++ });
    }
    last = m.index + m[0].length;
  }
  src += esc(t.old.slice(last));
  t.re = new RegExp(src, 'g');
}
TEMPLATES.forEach(compile);

/* the replacement: the new markup for the pose, with the instance's own face-part opacities, its nested rosette at the
   new brooch centre, and its tile fill */
function rebuild(t, m) {
  const parts = {}, notes = [];
  let engine = null, tile = null;
  for (const s of t.slots) {
    if (s.type === 'part') parts[s.name] = m[s.at];
    else if (s.type === 'rosette') { if (m[s.at] !== undefined) engine = { cx: m[s.at], cy: m[s.at + 1], s: m[s.at + 2], body: m[s.at + 3] }; }
    else tile = m[s.at];
  }
  let out = t.neu;
  out = out.replace(PART, (all, name) => {
    if (!(name in parts)) { notes.push(`new part ${name} kept as shipped`); return all; }
    const v = parts[name];
    return `<g data-part="${name}"${v === undefined ? '' : ` opacity="${v}"`}>`;
  });
  for (const name of Object.keys(parts)) if (!new RegExp(`<g data-part="${esc(name)}"`).test(t.neu)) notes.push(`old part ${name} has no group in the new art`);
  let desc;
  if (engine) {
    const r = t.newRos;
    if (!r) throw new Error(`${t.key}: the instance nests a rosette but the new spec gives no brooch for this pose`);
    if (t.oldRos && (+engine.cx !== +t.oldRos.cx || +engine.cy !== +t.oldRos.cy)) notes.push(`nested at (${engine.cx} ${engine.cy}), not at the old brooch (${t.oldRos.cx} ${t.oldRos.cy})`);
    if (+engine.s !== +r.s) notes.push(`scale ${engine.s} kept (the spec says ${r.s})`);
    if (!STANDIN.test(out)) throw new Error(`${t.key}: the new art has no stand-in group to nest the rosette in`);
    out = out.replace(STANDIN, () => `<g transform="translate(${r.cx} ${r.cy}) scale(${engine.s})">${engine.body}</g>`);
    const holes = [...new Set([...engine.body.matchAll(/\{\{\s*([\w$]+)\./g)].map((x) => x[1]))];
    desc = `rosette (${engine.cx} ${engine.cy}) → (${r.cx} ${r.cy}) scale ${engine.s}${holes.length ? ' holes ' + holes.join(',') : ''}`;
  } else desc = t.newRos ? 'stand-in rosette' : 'no brooch';
  if (tile !== null) { out = out.replace(TILE, () => `<rect width="100" height="100" rx="22.3" fill="${tile}"/>`); desc += `, tile ${tile}`; }
  const shown = Object.entries(parts).filter(([, v]) => v !== '0').map(([k, v]) => (v === undefined ? k : `${k}=${v.replace(/\s+/g, '')}`));
  if (Object.keys(parts).length) desc += `, parts: ${shown.join(' ') || '(all opacity 0)'}`;
  return { out, desc: desc + (notes.length ? ` [${notes.join('; ')}]` : '') };
}

/* paths of the old art that the new art does not share: none may remain after the swap */
const pathsOf = (S) => { const set = new Set(); const all = [...Object.values(S.poses).map((p) => p.svg), ...Object.values(S.thumbs || {}), ...Object.values(S.scenes || {})]; for (const s of all) for (const m of s.matchAll(/\sd="([^"]{40,})"/g)) set.add(m[1]); return set; };
const newPaths = pathsOf(NEW);
const OLD_ONLY = [...pathsOf(OLD)].filter((d) => !newPaths.has(d));
const lineOf = (s, i) => s.slice(0, i).split('\n').length;
const LOOKS = /#EDC27C|#2A2120|data-part="/;

let replaced = 0, unmatched = 0, leftovers = 0, written = 0;
const perPose = {};
for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  const claimed = [], edits = [];
  for (const t of TEMPLATES) {
    t.re.lastIndex = 0;
    let m;
    while ((m = t.re.exec(src))) {
      const start = m.index, end = start + m[0].length;
      if (claimed.some(([a, b]) => start < b && end > a)) continue;
      claimed.push([start, end]);
      const r = rebuild(t, m);
      edits.push({ start, end, text: r.out, line: lineOf(src, start), desc: `${t.key}: ${r.desc}` });
    }
  }
  edits.sort((a, b) => a.start - b.start);
  let out = src;
  for (const e of [...edits].reverse()) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  for (const e of edits) { console.log(`${rel}:${e.line} replaced ${e.desc}`); replaced++; const k = e.desc.split(':')[0]; perPose[k] = (perPose[k] || 0) + 1; }
  // mascot-looking SVGs with no replacement inside them
  for (const sm of src.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)) {
    if (!LOOKS.test(sm[0])) continue;
    const a = sm.index, b = a + sm[0].length;
    if (edits.some((e) => e.start >= a && e.end <= b)) continue;
    const root = sm[0].match(/^<svg\b[^>]*>/)[0].replace(/aria-label="[^"]*"/, 'aria-label="…"');
    console.log(`${rel}:${lineOf(src, a)} UNMATCHED mascot-looking svg (${sm[0].length} chars) ${root}`);
    unmatched++;
  }
  // paths of the old art anywhere in the result
  const seen = new Set();
  for (const d of OLD_ONLY) {
    let i = -1;
    while ((i = out.indexOf(d, i + 1)) >= 0) { const l = lineOf(out, i); if (!seen.has(l)) { seen.add(l); console.log(`${rel}:${l} LEFTOVER path of the old art: d="${d.slice(0, 48)}…"`); leftovers++; } }
  }
  if (out !== src && !CHECK) { fs.writeFileSync(file, out); written++; }
}
console.log(`${replaced} instance(s) replaced in ${files.length} board(s)${CHECK ? ' (check only, nothing written)' : `, ${written} board(s) written`}: ${Object.entries(perPose).map(([k, v]) => `${k} ×${v}`).join(', ') || 'none'}`);
console.log(`${unmatched} unmatched mascot-looking svg(s), ${leftovers} leftover line(s) with the old art's paths`);
if (unmatched || leftovers) process.exitCode = 1;
