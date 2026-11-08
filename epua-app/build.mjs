// Builds the installable Epu'ã web app into dist/ from the design canvas's screen files, and puts a copy in ../docs
// (the folder GitHub Pages serves).
// usage: node build.mjs        (after npm install, for preact and sharp, and bash fetch-fonts.sh, for the typefaces)
//
// What it does:
//   0. checks the course content (node ../tools/build-course.mjs --check: a content error stops the build), and that the
//      screens and scripts are the ones the canvas's prototype board, App.dc.html, plays and loads;
//   1. takes those 21 screens and the spelling pad shown inside Words (Spell), plus the app's own shell and install page
//      (src/*.dc.html), and turns each into one YK.define(...) call in assets/screens.js (template text + logic class);
//      every routed screen must have a way in from another screen (a link to it, or go / nav to it);
//   2. gathers the small style rules the screens declare into assets/screens.css;
//   3. cuts the two typefaces down to the characters used (fonts.py), names the Andika subsets EpuaText in the app's
//      copies of the screens (the canvas's files keep 'Andika'), and draws the icons;
//   4. copies the runtime, the sound player and the course's scripts, the page and the manifest, and writes the licences;
//      with them the sound files that exist (project/gn-sound-*.js, by unit) and, in estudio/, the recording studio
//      (studio/) with the clip lists it reads (../sound/<level>/manifest.json);
//   5. writes sw.js with the exact list of files and a hash of their content, so the whole app is stored on the phone
//      for offline use, and a new build replaces it; the sound files are listed apart, stored when first used;
//   6. replaces ../docs with the build.
// Settings, all optional: EPUA_OUT (the output folder, relative to epua-app/, default dist), EPUA_DOCS (where the copy
// for the web goes, default ../docs when EPUA_OUT is not set; empty: no copy), EPUA_APP_VERSION (default 0.1),
// EPUA_BUILD_DATE (default today), EPUA_PROJECT and EPUA_FONTS (where the screens and the typefaces are).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const PROJECT = path.resolve(HERE, process.env.EPUA_PROJECT || '../project');
const FONTS = path.resolve(HERE, process.env.EPUA_FONTS || '../fonts-src');
const SRC = path.join(HERE, 'src');
const OUT = path.resolve(HERE, process.env.EPUA_OUT || 'dist');
const DOCS = process.env.EPUA_DOCS !== undefined ? (process.env.EPUA_DOCS ? path.resolve(HERE, process.env.EPUA_DOCS) : null) : process.env.EPUA_OUT ? null : path.join(REPO, 'docs');
const APP_VERSION = process.env.EPUA_APP_VERSION || '0.1';

/* the app: its name on the Home Screen, what it is in one line, the icon's tile */
const APP = { name: "Epu'ã", about: 'Guaraní paraguayo para hispanohablantes, del A1 al C2.', tile: '#C2336F' };
/* the 21 screens the prototype board (App.dc.html) routes, in its order, and the one shown inside another
   (Words' spelling pad); the build checks them against the board */
const SCREENS = ['Goal', 'Placement', 'Main', 'Today', 'Levels', 'Progress', 'Teach', 'Compare', 'Drill', 'Exam', 'Words', 'Reading', 'Listening', 'WeekTest', 'Notebook', 'Review', 'ExamTab', 'LevelExam', 'Leer', 'Escribir', 'Hablar'];
const INSIDE = ['Spell'];
const OWN = ['Shell', 'Install'];
/* the sound player, loaded first (Yaoki's, under new names; no clips exist, so every sound control uses its silent
   stand-in), then the course: the six levels' data, the engine, the spelling helper and the extras (placement, level
   exam, the reader's text, the typing and speaking lists). The same scripts, in the same order, as App.dc.html */
const SOUND = 'gn-sound.js';
const SCRIPTS = ['gn-course-a1.js', 'gn-course-a2.js', 'gn-course-b1.js', 'gn-course-b2.js', 'gn-course-c1.js', 'gn-course-c2.js', 'gn-course.js', 'gn-spell.js', 'gn-extra.js', 'gn-sound-index.js'];
/* the clips: one file per unit (gn-sound-a1-u01.js) and one each for the placement check, a level's exam and the speaking
   game, made by tools/make-sound.mjs, which also writes the index (gn-sound-index.js, loaded with the course). They are
   shipped but not installed: the engine fetches a file when its unit or screen is in use, and the offline worker stores it
   then (lazy, as Yaoki's unit sound), so the first download stays small */
const UNIT_SOUND = fs.readdirSync(PROJECT).filter((f) => /^gn-sound-(?:[abc][12]-(?:u\d\d|x)|pl|sp)\.js$/.test(f)).sort();
const isLazy = (f) => /^\.\/assets\/gn-sound-(?:[abc][12]-(?:u\d\d|x)|pl|sp)\.js$/.test(f);
/* the recording studio (studio/, a page for a native speaker) and the clip lists it reads (../sound/<level>/manifest.json)
   go to estudio/ next to the app: the same site, not part of the install, never stored by the worker */
const STUDIO = path.join(HERE, 'studio');
const SOUND_LISTS = path.join(REPO, 'sound');

const read = (f) => fs.readFileSync(f, 'utf8');
const write = (rel, data) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const copy = (from, rel) => write(rel, fs.readFileSync(from));
const fail = (msg) => { console.error('build.mjs: ' + msg); process.exit(1); };

/* Andika has the Reserved Font Names "Andika" and "SIL": its subsets are a Modified Version, and fonts.py names them
   EpuaText. The screens name the family as the canvas loads it, 'Andika'; the app's copies name it 'EpuaText', in style
   attributes ('Andika', 'Nunito'), in script strings ('700 26px "Andika"', 'Andika, Nunito, sans-serif') and in rules.
   An Andika in plain words (a comment) is left alone. */
const TEXT_FACE = 'EpuaText';
const ownFace = (text) => text.replace(/(['"])Andika(?=\1|,)/g, '$1' + TEXT_FACE);
const namesAndika = (text) => /(['"])Andika\b|font(-family)?:[^;"'{}]*\bAndika\b/.test(text);

/* the app's own files carry a few marks for what this build fills in */
const tags = (dir, list) => list.map((f) => `\n<script src="${dir}${f}"></script>`).join('');
let ART = {};
const fill = (text) => text
  .replace(/%SCRIPTS%/g, tags('./assets/', SCRIPTS)).replace(/%SCREENS%/g, SCREENS.join(','))
  .replace(/%KAGUARE%/g, () => ART.kaguare || '').replace(/%ICON%/g, () => ART.icon || '')
  .replace(/%APP_DESCRIPTION%/g, APP.name + ': ' + APP.about.charAt(0).toLowerCase() + APP.about.slice(1))
  .replace(/%APP_ABOUT%/g, APP.about).replace(/%APP_NAME%/g, APP.name);
/* the app's own text files as this app has them, for the typefaces to read (in a folder of their own, removed after the build) */
const TEXT = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-text-'));
process.on('exit', () => fs.rmSync(TEXT, { recursive: true, force: true }));
const ownText = (file, text) => { const to = path.join(TEXT, path.basename(file)); fs.writeFileSync(to, text === undefined ? fill(read(file)) : text); return to; };

/* one screen file -> its template, the style rules in its <helmet>, and its logic script */
function parts(file, own) {
  const text = ownFace(own ? fill(read(file)) : read(file));
  const body = text.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
  const logic = text.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/);
  if (!body || !logic) fail(file + ': not a screen file');
  const helmet = body[1].match(/<helmet>([\s\S]*?)<\/helmet>/);
  const rules = [];
  if (helmet) {
    for (const m of helmet[1].matchAll(/<style>([\s\S]*?)<\/style>/g)) {
      for (const line of m[1].split('\n').map((l) => l.trim()).filter(Boolean)) {
        /* the screens write one whole rule per line; anything else would be cut apart here, so stop instead */
        if (!line.endsWith('}') || (line.match(/\{/g) || []).length !== (line.match(/\}/g) || []).length) fail(file + ': a helmet style rule must sit on one line: ' + line.slice(0, 60));
        rules.push(line);
      }
    }
    const other = helmet[1].replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '').trim();
    if (other) fail(file + ': the build does not know what to do with this in the helmet: ' + other.slice(0, 80));
  }
  if (/<\/script/i.test(logic[1])) fail(file + ': logic contains a closing script tag');
  return { text, template: body[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '').trim(), rules, logic: logic[1].trim() };
}
const importsOf = (text) => [...text.matchAll(/<dc-import\s+name="([^"]+)"([^>]*)>/g)].map((m) => ({ name: m[1], props: [...m[2].matchAll(/([a-zA-Z][\w-]*)="([^"]*)"/g)].filter((a) => !a[1].startsWith('hint-')).map((a) => a[1] + '=' + a[2]).sort().join(' ') }));
const headScripts = (text) => [...((/<head>([\s\S]*?)<\/head>/i.exec(text) || [])[1] || '').matchAll(/<script\s+src="\.\/([^"]+)"\s*><\/script>/g)].map((m) => m[1]).filter((f) => f !== 'support.js');

/* 0: the content, and the screens against the prototype board */
try {
  execFileSync(process.execPath, [path.join(REPO, 'tools/build-course.mjs'), '--check'], { stdio: 'inherit' });
} catch (e) {
  fail('the content check failed (see above): the app is not built from content the check refuses');
}
/* the level files the screens read (project/gn-course-*.js, gn-extra.js) are made from content/ by the same tool: say so
   when they are older than the content, since the app ships them as they are, like the canvas */
{
  const fresh = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-course-'));
  try {
    execFileSync(process.execPath, [path.join(REPO, 'tools/build-course.mjs')], { stdio: 'ignore', env: { ...process.env, GN_OUT: fresh } });
    const stale = fs.readdirSync(fresh).filter((f) => !fs.existsSync(path.join(PROJECT, f)) || read(path.join(PROJECT, f)) !== read(path.join(fresh, f)));
    if (stale.length) console.log(`note: ${stale.join(', ')} in ${path.relative(REPO, PROJECT)}/ differ from what content/ makes now: run node tools/build-course.mjs (and publish the canvas) to bring them up to date`);
  } catch (e) {
    console.log('note: could not compare the level files with content/ (' + e.message.split('\n')[0] + ')');
  } finally {
    fs.rmSync(fresh, { recursive: true, force: true });
  }
}
{
  const board = read(path.join(PROJECT, 'App.dc.html'));
  const routed = importsOf(board);
  if (routed.map((r) => r.name).join() !== SCREENS.join()) fail(`App.dc.html routes ${routed.map((r) => r.name).join(', ')}; the build has ${SCREENS.join(', ')}: bring SCREENS (here, in src/Shell.dc.html and in its routes) in line with the board`);
  if (headScripts(board).join() !== [SOUND, ...SCRIPTS].join()) fail(`App.dc.html loads ${headScripts(board).join(', ')}; the build loads ${[SOUND, ...SCRIPTS].join(', ')}`);
  const shell = read(path.join(SRC, 'Shell.dc.html'));
  if (JSON.stringify(importsOf(shell)) !== JSON.stringify(routed)) fail('src/Shell.dc.html must show the same screens with the same props as App.dc.html');
  const listed = /const SCREENS = \[([^\]]*)\]/.exec(shell);
  if (!listed || listed[1].replace(/['\s]/g, '') !== SCREENS.join()) fail('the SCREENS list in src/Shell.dc.html differs from the build\'s');
}
/* the index names exactly the sound files present (both are make-sound.mjs's): a stale index would ask for a file that is not there */
{
  const listed = JSON.parse((/__gnSoundFiles = (\[[^\]]*\])/.exec(read(path.join(PROJECT, 'gn-sound-index.js'))) || [, '[]'])[1]);
  if (listed.join() !== UNIT_SOUND.join()) fail(`gn-sound-index.js lists ${listed.join(', ') || 'no sound file'} and ${path.relative(REPO, PROJECT)}/ holds ${UNIT_SOUND.join(', ') || 'none'}: run node tools/make-sound.mjs to bring them in line`);
  if (!fs.existsSync(path.join(STUDIO, 'index.html'))) fail('studio/index.html is missing');
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });

/* the mascot's art for the install page and the icons (brief/mascot/spec.json; the art is used as it is) */
const spec = JSON.parse(read(path.join(REPO, 'brief/mascot/spec.json')));
const pose = (name) => { const p = spec.poses && spec.poses[name]; if (!p || !/^<svg\b/.test(p.svg || '')) fail('brief/mascot/spec.json has no ' + name + ' pose'); return p.svg; };
const sized = (svg, size, extra) => svg.replace(/^<svg\b/, `<svg width="${size}" height="${size}"${extra || ''}`).replace(/^<svg((?:(?!xmlns=)[^>])*)>/, '<svg xmlns="http://www.w3.org/2000/svg"$1>');
/* the Home Screen icon: the tile's rounded square becomes a full square of the same pink, since iOS rounds the corners itself */
const TILE = /<rect width="100" height="100" rx="[\d.]+" fill="(#[0-9A-Fa-f]{6})"\/>/;
const iconArt = pose('icon-pink');
const tile = TILE.exec(iconArt);
if (!tile || tile[1].toUpperCase() !== APP.tile) fail('the icon-pink pose no longer starts on its ' + APP.tile + ' tile: look at brief/mascot/spec.json and the icons here');
const iconSquare = iconArt.replace(TILE, `<rect width="100" height="100" fill="${tile[1]}"/>`);
ART = {
  kaguare: sized(pose('standing'), 96, ' style="display: block"'),
  icon: sized(iconSquare.replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"'), 30, ' style="display: block"'),
};

/* 1 and 2: screens.js and screens.css */
const rules = new Set();
const defs = [];
const textSources = [];
const screenTexts = {};
const known = new Set([...SCREENS, ...INSIDE, ...OWN]);
for (const name of [...SCREENS, ...INSIDE, ...OWN]) {
  const own = OWN.includes(name);
  const file = path.join(own ? SRC : PROJECT, name + '.dc.html');
  const p = parts(file, own);
  screenTexts[name] = p.template + '\n' + p.logic;
  for (const im of importsOf(p.text)) if (!known.has(im.name)) fail(`${name}.dc.html shows ${im.name}, which the app does not have: add it to INSIDE`);
  if (!own) for (const f of headScripts(p.text)) if (f !== SOUND && !SCRIPTS.includes(f)) fail(`${name}.dc.html loads ${f}, which the app does not load`);
  p.rules.forEach((r) => rules.add(r));
  textSources.push(own ? ownText(file) : file);
  defs.push(`YK.define(${JSON.stringify(name)}, ${JSON.stringify(p.template)}, function (DCLogic) {\n${p.logic}\n;return (typeof Component !== "undefined" && Component) || undefined;\n});`);
}
/* every screen the app routes has a way in from another screen (its file named as a link, or go / nav to it): a screen
   that only the test hooks can open is one a learner never finds */
for (const name of SCREENS) {
  const way = new RegExp(`\\b${name}\\.dc\\.html\\b|\\b(?:nav|go)\\([^()]*['"]${name}['"]|\\bto:\\s*['"]${name}['"]`);
  const from = Object.keys(screenTexts).filter((n) => n !== name && way.test(screenTexts[n]));
  if (!from.length) fail(`no screen leads to ${name}: give another screen a link to ${name}.dc.html (or a go('${name}')), or take ${name} out of the routes`);
}
write('assets/screens.js', `/* Generated by build.mjs from the design canvas's screen files and src/*.dc.html. Do not edit: change the screen file and rebuild. */\n(function () {\nvar YK = window.YK;\n${defs.join('\n')}\n})();\n`);
/* hover colours only where there is a pointer that hovers: after a tap, a phone would leave the link tinted */
const css = [...rules].map((r) => r.replace(/(a:hover\{[^}]*\})/g, '@media (hover:hover){$1}'));
write('assets/screens.css', `/* Generated by build.mjs: the style rules the screens declare. */\n${css.join('\n')}\n`);

/* 3: typefaces and icons */
/* every file that puts words on the screen: the screens, the course's scripts, the app's own code, the page (its
   sideways note), and the characters the canvas asks Google Fonts for (its font link), so the app has all of them too */
const link = /fonts\.googleapis\.com\/css2\?[^"]*?[?&]text=([^&"]*)/.exec(read(path.join(PROJECT, 'App.dc.html')).replace(/&amp;/g, '&'));
const fontSources = [...textSources, ...[SOUND, ...SCRIPTS].map((f) => path.join(PROJECT, f)), ownText(path.join(SRC, 'gn-app.js')), ownText(path.join(SRC, 'index.html'))];
if (link) fontSources.push(ownText('canvas-font-text.txt', decodeURIComponent(link[1])));
for (const f of ['nunito/Nunito[wght].ttf', 'andika/Andika-Regular.ttf', 'andika/Andika-Bold.ttf', 'nunito/OFL.txt', 'andika/OFL.txt']) if (!fs.existsSync(path.join(FONTS, f))) fail(`${path.join(FONTS, f)} is missing: run bash fetch-fonts.sh first`);
try {
  process.stdout.write(execFileSync('python3', [path.join(HERE, 'fonts.py'), FONTS, path.join(OUT, 'assets'), ...fontSources], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
} catch (e) {
  process.stdout.write(e.stdout || '');
  fail('fonts.py stopped (see above)');
}

const require = createRequire(import.meta.url);
const sharp = require('sharp');
/* drawn at 1024 and scaled down, as the icon board shows them; the Home Screen icons are opaque (iOS would draw the
   see-through parts of one black), the favicon keeps its rounded corners */
const png = async (rel, svg, size, opaque) => {
  let img = sharp(Buffer.from(sized(svg, 1024))).resize(size, size);
  if (opaque) img = img.flatten({ background: APP.tile });
  write(rel, await img.png({ compressionLevel: 9 }).toBuffer());
};
await png('icons/apple-touch-icon.png', iconSquare, 180, true);
await png('icons/icon-192.png', iconSquare, 192, true);
await png('icons/icon-512.png', iconSquare, 512, true);
/* the favicon: the 32 px rosette drawn on the icon board (project/Icon.dc.html), a white disc with pink threads on pink */
const favicons = [...read(path.join(PROJECT, 'Icon.dc.html')).matchAll(/<svg viewBox="0 0 100 100" width="32" height="32"[^>]*>[\s\S]*?<\/svg>/g)].map((m) => m[0]);
if (favicons.length !== 1) fail(`project/Icon.dc.html should draw one 32 px favicon, found ${favicons.length}`);
const favicon = favicons[0].replace(/^<svg[^>]*>/, '<svg viewBox="0 0 100 100">');
await png('icons/favicon-32.png', favicon, 32);

/* 4: runtime, sound player and course, page, manifest, licences */
const preactDir = path.join(HERE, 'node_modules/preact');
const preactVersion = JSON.parse(read(path.join(preactDir, 'package.json'))).version;
copy(path.join(preactDir, 'dist/preact.min.js'), 'assets/preact.min.js');
copy(path.join(SRC, 'yk-runtime.js'), 'assets/yk-runtime.js');
write('assets/app.css', ownFace(read(path.join(SRC, 'app.css'))));
write('assets/gn-app.js', ownFace(fill(read(path.join(SRC, 'gn-app.js')))));
for (const f of [SOUND, ...SCRIPTS, ...UNIT_SOUND]) copy(path.join(PROJECT, f), 'assets/' + f);
/* the studio, and the clip list of every level that has one (sound/<level>/manifest.json), with an index of them */
for (const f of fs.readdirSync(STUDIO)) copy(path.join(STUDIO, f), 'estudio/' + f);
const soundLevels = fs.existsSync(SOUND_LISTS) ? fs.readdirSync(SOUND_LISTS).filter((d) => fs.existsSync(path.join(SOUND_LISTS, d, 'manifest.json'))).sort() : [];
for (const lv of soundLevels) copy(path.join(SOUND_LISTS, lv, 'manifest.json'), `estudio/${lv}/manifest.json`);
write('estudio/lista.json', JSON.stringify(soundLevels.map((lv) => { const m = JSON.parse(read(path.join(SOUND_LISTS, lv, 'manifest.json'))); return { level: lv, file: `${lv}/manifest.json`, clips: (m.count || {}).toRecord || 0, made: m.made || '' }; })) + '\n');
write('index.html', fill(read(path.join(SRC, 'index.html'))));
write('manifest.webmanifest', fill(read(path.join(SRC, 'manifest.webmanifest'))));
/* the typefaces' copyright lines, as their licence files give them, and the licence (one text: the files differ only in line ends) */
const oflOf = (dir) => {
  const text = read(path.join(FONTS, dir, 'OFL.txt')).replace(/\r\n?/g, '\n');
  const at = text.indexOf('This Font Software is licensed');
  if (at < 0) fail(path.join(FONTS, dir, 'OFL.txt') + ' is not the SIL Open Font License');
  return { head: text.slice(0, at).trim(), body: text.slice(at).trim() };
};
const nunito = oflOf('nunito');
const andika = oflOf('andika');
const oflBodies = nunito.body.replace(/\s+/g, ' ') === andika.body.replace(/\s+/g, ' ') ? [nunito.body] : [nunito.body, andika.body];
/* the clips' credits, from the index make-sound.mjs writes: each voice's name, what made it and its licence */
const soundVoices = (() => { try { return JSON.parse((/__gnSoundVoices = (\{[\s\S]*?\});/.exec(read(path.join(PROJECT, 'gn-sound-index.js'))) || [, '{}'])[1]); } catch (e) { return {}; } })();
const soundLicence = UNIT_SOUND.length ? [
  '== Sound ==',
  `Spoken clips: ${UNIT_SOUND.join(', ')} (assets/), each fetched when its unit or screen is in use and stored on the`,
  'phone from then on. Voices: ' + (Object.keys(soundVoices).map((v) => `${v}: ${soundVoices[v].name || 'not named'} (${soundVoices[v].kind === 'synthetic' ? 'synthetic, ' + (soundVoices[v].model || 'a voice model') : 'a recording'}; ${soundVoices[v].licence || 'licence not stated'})`).join('; ') || 'not stated') + '.',
  'A clip made by a voice model is marked synthetic in the file, and the screens say so (voz sintética). The sound',
  'player (assets/gn-sound.js) is the player of the Yaoki apps, under new names.',
  '',
] : [
  '== Sound ==',
  'No recordings exist yet: every sound control uses a silent stand-in. The sound player (assets/gn-sound.js) is the',
  'player of the Yaoki apps, under new names.',
  '',
];
write('licenses.txt', [
  "Epu'ã app: licencias de terceros · third-party licences",
  '',
  '== Preact ' + preactVersion + ' (MIT) ==',
  read(path.join(preactDir, 'LICENSE')).trim(),
  '',
  '== Typefaces (SIL Open Font License 1.1) ==',
  'Nunito (the interface): ' + nunito.head.replace(/\s+/g, ' '),
  'Andika (Guarani text): ' + andika.head.replace(/\s+/g, ' '),
  'Both are included as subsets holding only the characters this app shows; Nunito\'s 500, 700 and 800 are instances of',
  'its variable font. A subset is a Modified Version under the licence, and Andika\'s Reserved Font Names "Andika" and',
  '"SIL" may not be the name of a Modified Version: the app\'s subsets of Andika are therefore renamed EpuaText (the files',
  'assets/fonts/epuatext-400.woff2 and epuatext-700.woff2, the font family \'EpuaText\' in the app\'s style sheets, where',
  'the design canvas names it Andika). EpuaText is not SIL\'s Andika, and SIL International does not endorse this app.',
  '',
  ...oflBodies.flatMap((b) => [b, '']),
  '== Mascot and content ==',
  'Kaguare, el oso melero (a southern tamandua), the mascot, its poses and the app icon were drawn for this app, as were',
  'the ñandutí rosettes. The lessons, the questions, the reading text and the sample answers were written for this app',
  'and are original; the Guarani of the interface uses only words from real localisations (Firefox, MediaWiki,',
  'LibreOffice, Common Voice). Every Guarani string was checked by two independent reviewers; the course still needs a',
  'native teacher\'s review. The level exam\'s result is the app\'s own constancia: no CEFR framework or certificate exists',
  'for Guarani, and the app issues no official certificate.',
  '',
  ...soundLicence,
].join('\n'));

/* every file the app ships names the text face by its new name */
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
for (const f of walk(OUT).filter((f) => /\.(js|css|html)$/.test(f))) if (namesAndika(read(f))) fail(path.relative(OUT, f) + ' still names the font family Andika: the app ships it as ' + TEXT_FACE);

/* 5: version stamp and the offline worker */
const day = process.env.EPUA_BUILD_DATE || new Date().toISOString().slice(0, 10);
const hash = crypto.createHash('sha256');
hash.update(APP_VERSION + '|' + day);
/* the studio is not the app: a change to it is no new version of the app on the phones */
const rel = (f) => './' + path.relative(OUT, f).split(path.sep).join('/');
const isStudio = (f) => f.startsWith('./estudio/');
for (const f of walk(OUT).sort()) { if (isStudio(rel(f))) continue; hash.update(path.relative(OUT, f)); hash.update(fs.readFileSync(f)); }
const digest = hash.digest('hex').slice(0, 10);
write('assets/build.js', `/* Generated by build.mjs. */\nwindow.__gnBuild = ${JSON.stringify(`${APP.name} ${APP_VERSION} · ${day} · ${digest.slice(0, 6)}`)};\n`);
const files = walk(OUT).map(rel).filter((f) => f !== './sw.js' && !isStudio(f)).sort();
/* the sound that is stored when used, not at install (sw.js); each file's own hash lets a new build keep the unchanged ones */
const lazy = {};
files.filter(isLazy).forEach((f) => { lazy[f] = crypto.createHash('sha256').update(fs.readFileSync(path.join(OUT, f))).digest('hex').slice(0, 10); });
write('sw.js', fill(read(path.join(SRC, 'sw.js'))).replace('__VERSION__', digest).replace('__FILES__', JSON.stringify(['./', ...files.filter((f) => !isLazy(f))], null, 1)).replace('__LAZY__', JSON.stringify(lazy, null, 1)));
/* GitHub Pages: serve the files as they are */
write('.nojekyll', '');

const size = walk(OUT).reduce((n, f) => n + fs.statSync(f).size, 0);
console.log(`built ${APP.name}: ${walk(OUT).length} files, ${(size / 1024 / 1024).toFixed(2)} MB, version ${digest}, in ${path.relative(REPO, OUT)}`);

/* 6: the copy GitHub Pages serves: docs/ is replaced entirely, so nothing of an older build stays behind */
if (DOCS) {
  const inside = (a, b) => { const r = path.relative(a, b); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };
  if (!inside(REPO, DOCS) || DOCS === REPO || inside(DOCS, HERE) || inside(DOCS, PROJECT) || inside(OUT, DOCS) || inside(DOCS, OUT)) fail('EPUA_DOCS must be a folder of its own inside the repository, not ' + DOCS);
  fs.rmSync(DOCS, { recursive: true, force: true });
  fs.cpSync(OUT, DOCS, { recursive: true });
  console.log(`copied to ${path.relative(REPO, DOCS)}/`);
}
