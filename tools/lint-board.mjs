// Static checks for a Design canvas artboard (.dc.html): the format rules that fail silently.
// Usage: node tools/lint-board.mjs <file.dc.html> [more files]   (exit 1 when an error is found)
// It reads the file only: it never renders. Errors (x) must be fixed; warnings (!) deserve a look.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const FONT = fs.existsSync(path.join(ROOT, 'fontlink-html.txt')) ? fs.readFileSync(path.join(ROOT, 'fontlink-html.txt'), 'utf8').trim() : null;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SVG_SELF = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop', 'use', 'feGaussianBlur', 'feOffset']);
let failed = false;

for (const file of process.argv.slice(2)) {
  const errs = [], warns = [];
  const E = (m) => errs.push(m), W = (m) => warns.push(m);
  const src = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  if (!/^<!doctype html>/i.test(src.trim())) E('does not start with <!doctype html>');
  const htmlTag = /<html([^>]*)>/i.exec(src);
  if (!htmlTag) E('no <html> tag'); else if (!/lang="es"/.test(htmlTag[1])) W('<html> should carry lang="es"');
  const head = (/<head>([\s\S]*?)<\/head>/i.exec(src) || [])[1] || '';
  const scripts = [...head.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)].map((m) => m[1]);
  if (scripts[0] !== './support.js') E('the first head script must be exactly <script src="./support.js"></script>');
  for (const s of scripts.slice(1)) {
    if (!s.startsWith('./')) W(`head script ${s} is not a relative ./ file`);
    else if (!fs.existsSync(path.join(dir, s.slice(2))) && !/gn-(course-[abc][12]|extra)\.js$/.test(s)) E(`head script ${s} does not exist next to the board`);
  }
  if (!/<title>[^{}<]+<\/title>/.test(head)) E('<title> missing, empty or holding a hole');
  const xdc = (/<x-dc>([\s\S]*)<\/x-dc>/.exec(src) || [])[1];
  if (!xdc) { E('no <x-dc> … </x-dc>'); }
  const helmet = xdc ? (/<helmet>([\s\S]*?)<\/helmet>/.exec(xdc) || [])[1] : null;
  if (!helmet) E('no <helmet> inside <x-dc>');
  else {
    const links = [...helmet.matchAll(/<link[^>]*href="([^"]+)"[^>]*>/g)].map((m) => m[1]);
    const fonts = links.filter((h) => /fonts\.googleapis\.com/.test(h));
    if (FONT && fonts.length !== 1) E(`expected exactly one Google Fonts link (the brief's), found ${fonts.length}`);
    else if (FONT && fonts[0] !== FONT) E('the Google Fonts link differs from build/fontlink-html.txt (copy it exactly)');
    if (/\{\{/.test((/<style>([\s\S]*?)<\/style>/.exec(helmet) || [])[1] || '')) E('a {{ hole }} inside <style>');
    if (!/prefers-reduced-motion/.test(helmet) && /@keyframes/.test(helmet)) W('keyframes without a prefers-reduced-motion rule');
  }
  const logicTag = /<script type="text\/x-dc" data-dc-script data-props='([^']*)'>([\s\S]*?)<\/script>/.exec(src);
  if (!logicTag) E(`no <script type="text/x-dc" data-dc-script data-props='…'> block (single-quoted data-props)`);
  else {
    const raw = logicTag[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    try {
      const props = JSON.parse(raw);
      if (!props.$preview) W('data-props has no $preview');
      for (const [k, v] of Object.entries(props)) if (k !== '$preview' && (!v || !('editor' in v))) W(`data-props "${k}" has no editor key`);
    } catch (e) { E(`data-props is not valid JSON after decoding entities: ${e.message}`); }
    const code = logicTag[2];
    if (!/class\s+Component\s+extends\s+DCLogic/.test(code)) E('logic must declare class Component extends DCLogic');
    if (/\b(innerHTML|outerHTML|insertAdjacentHTML|appendChild|createElement)\b/.test(code)) W('logic touches the DOM (innerHTML/appendChild/createElement): UI must be markup');
    if (/\b(import|export)\s/.test(code)) E('logic uses import/export');
    if (/addEventListener\(\s*['"]key(down|up|press)/.test(code)) E('global key handler in logic');
    try { new vm.Script(`(function(){ class DCLogic { constructor(p){ this.props = p || {}; } setState(){} forceUpdate(){} }\n${code}\n})`, { filename: file }); }
    catch (e) { E(`logic does not parse: ${e.message}`); }
  }
  if (xdc) {
    // holes: dotted lookups or literals only
    for (const m of xdc.matchAll(/\{\{([^}]*)\}\}/g)) {
      const h = m[1].trim();
      if (!/^([A-Za-z_$][\w$]*(\.[\w$]+)*|true|false|null|-?\d+(\.\d+)?|'[^']*'|"[^"]*")$/.test(h)) E(`hole is not a dotted lookup: {{ ${h} }}`);
    }
    for (const m of xdc.matchAll(/<sc-if\b([^>]*)>/g)) { if (!/hint-placeholder-val=/.test(m[1])) E(`sc-if without hint-placeholder-val: <sc-if${m[1].slice(0, 60)}>`); if (!/value="\{\{[^}]+\}\}"/.test(m[1])) E('sc-if without value="{{ … }}"'); }
    for (const m of xdc.matchAll(/<sc-for\b([^>]*)>/g)) { if (!/hint-placeholder-count=/.test(m[1])) E(`sc-for without hint-placeholder-count: <sc-for${m[1].slice(0, 60)}>`); if (!/list="\{\{[^}]+\}\}"/.test(m[1]) || !/\bas="[A-Za-z_$][\w$]*"/.test(m[1])) E('sc-for needs list="{{ … }}" and as="name"'); }
    for (const m of xdc.matchAll(/<dc-import\b([^>]*?)(\/?)>/g)) {
      if (m[2] === '/') E('self-closing <dc-import/>');
      if (!/\bname="[A-Za-z0-9_-]+"/.test(m[1])) E('dc-import without name');
      else { const n = /\bname="([^"]+)"/.exec(m[1])[1]; if (!fs.existsSync(path.join(dir, n + '.dc.html'))) W(`dc-import name="${n}": ${n}.dc.html not found (yet)`); }
      if (!/hint-size="/.test(m[1])) E('dc-import without hint-size');
    }
    for (const m of xdc.matchAll(/\bon[A-Z][A-Za-z]*="([^"]*)"/g)) if (!/^\{\{\s*[A-Za-z_$][\w$.]*\s*\}\}$/.test(m[1])) E(`event attribute is not a single hole: ${m[0].slice(0, 60)}`);
    for (const m of xdc.matchAll(/\shref="([^"#][^"]*\.dc\.html)"/g)) if (!fs.existsSync(path.join(dir, m[1]))) W(`link to ${m[1]}: not found (yet)`);
    if (/<(iframe|object|embed)\b/i.test(xdc)) E('iframe/object/embed are not allowed');
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(xdc.replace(/<!--[\s\S]*?-->/g, ''))) E('emoji or dingbat characters in markup (use inline SVG icons)');
    if (/<[a-z][\w-]*\s[^>]*\s[a-zA-Z-]+=[^"'\s>{][^\s>]*/.test(xdc)) W('an attribute value may be unquoted');
    // tag balance (rough): non-void HTML elements and sc-*/dc-* tags
    const stack = [];
    const body = xdc.replace(/<!--[\s\S]*?-->/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
    for (const m of body.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
      const [, close, tag, , self] = m;
      const t = tag.toLowerCase();
      if (VOID.has(t) || self === '/' || (SVG_SELF.has(tag) && self === '/')) continue;
      if (!close) stack.push(t);
      else {
        const top = stack.pop();
        if (top !== t) { E(`tag mismatch: </${t}> closes <${top || 'nothing'}>`); break; }
      }
    }
    if (stack.length && !errs.some((x) => x.startsWith('tag mismatch'))) E(`unclosed tags: ${stack.slice(-5).join(', ')}`);
    const root = /<\/helmet>\s*<(div|main|section)\b[^>]*style="([^"]*)"/.exec(xdc);
    if (root && !/width:\s*\d+px/.test(root[2])) W('the root has no fixed px width (phone boards are 390 × 844)');
  }
  if (/　/.test(src)) W('U+3000 ideographic space (Nunito lacks it: use " · " or a margin)');
  if (/M PLUS Rounded|Klee One/.test(src)) E('Yaoki fonts referenced (use Nunito and Andika)');
  if (/[’ʼ](?=\p{L})/u.test(src.replace(/<!--[\s\S]*?-->/g, ''))) W('a curly apostrophe inside a word: the puso is U+0027');
  const label = path.basename(file);
  if (errs.length || warns.length) {
    console.log(`${label}: ${errs.length} error(s), ${warns.length} warning(s)`);
    errs.forEach((e) => console.log('  x ' + e));
    warns.forEach((w) => console.log('  ! ' + w));
  } else console.log(`${label}: ok`);
  if (errs.length) failed = true;
}
if (failed) process.exitCode = 1;
