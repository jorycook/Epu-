// Checks the sound path end to end in Chromium: the fixture recordings (check/fixtures/sound, short tones named by clip
// key) are turned into sound files by tools/make-sound.mjs, marked synthetic, the app is built with them into
// epua-app/dist-sound (never into docs/), and the built app is checked for: the Words sound step playing a clip (has()
// true, its wording in the recorded state, and the «voz sintética» note), Hablar's note, a dialogue put together for
// Listening, the unit file fetched when its unit is in use and not at install, stored by the offline worker after that
// first use and served from the store with no connection, the whole level stored once there is a plan, and the studio
// page (recording with a fake microphone, the take kept, the zip exported). Screenshots go to check/out/.
// usage: node check/sound-test.js      (from the repository root; needs ffmpeg, playwright and the fonts in fonts-src/)
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const APPDIR = path.join(ROOT, 'epua-app');
const DIST = path.join(APPDIR, 'dist-sound');
const OUT = path.join(__dirname, 'out');
const PORT = +(process.env.PORT || 8786);
const BASE = 'http://localhost:' + PORT + '/';
const UNIT = './assets/gn-sound-a1-u01.js';
let fails = 0;
const ok = (cond, msg, detail) => { if (!cond) { fails += 1; console.log('  FAIL: ' + msg + (detail !== undefined ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 300) : '')); } else console.log('  ok: ' + msg); };
const note = (msg) => console.log(msg);
fs.mkdirSync(OUT, { recursive: true });

/* ---------- 1. the files: the fixtures through make-sound.mjs into a copy of project/, and the app built from it ---------- */
note('1. the sound files and the build');
const PROJECT = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-project-'));
process.on('exit', () => fs.rmSync(PROJECT, { recursive: true, force: true }));
fs.cpSync(path.join(ROOT, 'project'), PROJECT, { recursive: true });
const made = execFileSync(process.execPath, [path.join(ROOT, 'tools/make-sound.mjs'), path.join(ROOT, 'check/fixtures/sound'), '--out', PROJECT, '--kind', 'synthetic'], { encoding: 'utf8' });
ok(/made \d+ clips/.test(made) && fs.existsSync(path.join(PROJECT, 'gn-sound-a1-u01.js')), 'make-sound.mjs makes the unit file from the fixtures', made.split('\n').find((l) => /^made/.test(l)));
ok(/still missing/.test(made) && /not put together/.test(made), 'make-sound.mjs reports the recordings still missing and the dialogues it could not put together');
const index = fs.readFileSync(path.join(PROJECT, 'gn-sound-index.js'), 'utf8');
const listed = JSON.parse(/__gnSoundFiles = (\[[^\]]*\])/.exec(index)[1]);
ok(listed.includes('gn-sound-a1-u01.js') && listed.includes('gn-sound-sp.js'), 'the index lists the files written', listed);
const unitJs = fs.readFileSync(path.join(PROJECT, 'gn-sound-a1-u01.js'), 'utf8');
ok(/c\['a1u01d1\.s0a'\] = \{ ms: \d+, kind: 'synthetic', voice: 'F', b: '[A-Za-z0-9+/=]+' \};/.test(unitJs), 'a clip registers as { ms, kind, voice, b } under its key');
ok(/c\['a1u01d1\.r1'\] = \{ ms: \d+, kind: 'synthetic', voice: 'N\+F\+M', cues: \[[\d, ]+\], b: /.test(unitJs), 'a dialogue is put together from its lines, with cues');
ok(/c\['a1u01d1\.s2a'\] = c\['a1u01d1\.s1b'\];/.test(unitJs), 'a text said already is registered under its other key by reference');
execFileSync(process.execPath, ['build.mjs'], { cwd: APPDIR, env: { ...process.env, EPUA_OUT: 'dist-sound', EPUA_DOCS: '', EPUA_PROJECT: PROJECT, EPUA_BUILD_DATE: 'sound test' }, stdio: 'ignore' });
const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
const FILES = JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
const LAZY = JSON.parse(sw.match(/const LAZY = (\{[\s\S]*?\});/)[1]);
ok(fs.existsSync(path.join(DIST, 'assets/gn-sound-a1-u01.js')) && fs.existsSync(path.join(DIST, 'assets/gn-sound-index.js')), 'the build ships the unit files and the index');
ok(!FILES.includes(UNIT) && FILES.includes('./assets/gn-sound-index.js'), 'sw.js installs the index but not the unit file');
ok(Object.keys(LAZY).length === listed.length && /^[0-9a-f]{10}$/.test(LAZY[UNIT] || ''), 'sw.js lists every sound file apart, under a hash of its content', LAZY);
ok(fs.existsSync(path.join(DIST, 'estudio/index.html')) && fs.existsSync(path.join(DIST, 'estudio/A1/manifest.json')) && JSON.parse(fs.readFileSync(path.join(DIST, 'estudio/lista.json'), 'utf8'))[0].level === 'A1', 'the build puts the studio and the clip lists in estudio/');
ok(!FILES.some((f) => f.startsWith('./estudio/')), 'the studio is not part of the install');
ok(!fs.existsSync(path.join(ROOT, 'docs/assets/gn-sound-a1-u01.js')), 'docs/ holds no fixture sound (the test build is dist-sound)');
const lic = fs.readFileSync(path.join(DIST, 'licenses.txt'), 'utf8');
ok(/== Sound ==[\s\S]*gn-sound-a1-u01\.js[\s\S]*synthetic/.test(lic), 'licenses.txt names the sound files and the synthetic voices');

/* ---------- the site, served as GitHub Pages serves it; every request is noted ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const hits = [];
const serve = () => new Promise((done) => {
  const server = http.createServer((req, res) => {
    hits.push(req.url);
    let p = decodeURIComponent(new URL(req.url, BASE).pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(DIST, p);
    if (!f.startsWith(DIST) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); return; }
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
const control = (page, what) => (what.aria ? page.locator(`#gn-stage [aria-label="${what.aria}"]`) : page.locator('#gn-stage').locator('button, a').filter({ hasText: what })).first();
const tap = async (page, what, wait = 450) => { await control(page, what).tap({ timeout: 5000 }); await page.waitForTimeout(wait); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') });
const clipsLoaded = (page, key) => page.waitForFunction((k) => !!(window.__gnClips && window.__gnClips[k]), key, { timeout: 8000 }).then(() => true, () => false);

(async () => {
  const server = await serve();
  const browser = await chromium.launch({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const phone = () => browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'es-PY' });

  /* ---------- 2. Words: the sound step with clips ---------- */
  note('2. Words plays a clip');
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    const logs = [];
    page.on('pageerror', (e) => logs.push(String(e)));
    hits.length = 0;
    await page.goto(BASE + '?gntest&screen=Words&level=A1&cur=a1u01d1');
    await ready(page);
    ok(await clipsLoaded(page, 'a1u01d1.s0a'), 'the unit\'s sound file is fetched when the unit is in use (the clips register in window.__gnClips)');
    ok(hits.some((u) => /gn-sound-a1-u01\.js/.test(u)), 'the unit file came from the server after the page opened', hits.filter((u) => /gn-sound/.test(u)));
    const snd = await page.evaluate(() => ({ has: window.gnSound.has('a1u01d1.s0a'), kind: window.gnSound.kind('a1u01d1.s0a'), ms: window.gnSound.ms('a1u01d1.s0a'), none: window.gnSound.kind('nothing.here'), listening: window.gnSound.has('a1u01d1.r1'), lms: window.gnSound.ms('a1u01d1.r1') }));
    ok(snd.has && snd.ms > 300, 'gnSound.has() is true for a pair\'s word and knows its length', snd);
    ok(snd.kind === 'synthetic' && snd.none === '', 'gnSound.kind() says synthetic for the fixture clip and nothing for a missing key', snd);
    ok(snd.listening && snd.lms > 4000, 'the listening item\'s dialogue is one clip the screens can ask for', snd);
    const t0 = await text(page);
    ok(/escuchá la diferencia en cada par/.test(t0) && !/todavía no están grabados/.test(t0), 'the sound step\'s intro is the recorded one (not «los audios todavía no están grabados»)', t0.slice(0, 200));
    ok(/Tocá el parlante: suena una de las dos/.test(t0), 'the first pair asks to listen, not to read the word shown', t0.slice(0, 300));
    const played = await page.evaluate(() => { let r = null; const p = window.gnSound.play; window.gnSound.play = function (k, f) { r = p.call(this, k, f); return r; }; return true; });
    await tap(page, { aria: 'Escuchar la palabra del par 1' }, 700);
    const t1 = await text(page);
    await shot(page, 'sound-words-pair');
    ok(/¿Cuál escuchaste\?/.test(t1) && !/no está grabado/.test(t1), 'after the play the pair asks which word was heard (the clip played, no «no está grabado»)', t1.slice(0, 300));
    ok(/Voz sintética/.test(t1), 'the sound step says «voz sintética» for a synthetic clip', t1.slice(0, 300));
    const state = await page.evaluate(() => ({ at: window.gnSound.at(), over: window.gnSound.over(), ctx: !!(window.AudioContext || window.webkitAudioContext) }));
    ok(played && state.ctx, 'play() went through the player (an AudioContext exists in this browser)', state);
    ok(logs.length === 0, 'no page errors on Words', logs);
    await ctx.close();
  }

  /* ---------- 3. Hablar ---------- */
  note('3. Hablar says «voz sintética»');
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    await page.goto(BASE + '?gntest&screen=Hablar&level=A1');
    await ready(page);
    ok(await clipsLoaded(page, 'p0.0'), 'the speaking game\'s sound file is fetched when the screen opens');
    await tap(page, 'Empezar', 800);
    let seen = '';
    for (let i = 0; i < 12 && !/Voz sintética/.test(seen); i++) { seen = await text(page); if (!/Voz sintética/.test(seen)) await page.waitForTimeout(350); }
    await shot(page, 'sound-hablar');
    ok(/Voz sintética/.test(seen), 'the round\'s status line says «voz sintética» when the first clip plays', seen.slice(0, 300));
    await ctx.close();
  }

  /* ---------- 4. lazy and offline: the worker stores a unit file after first use, the level once there is a plan ---------- */
  note('4. stored after first use, served offline');
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    hits.length = 0;
    await page.goto(BASE + '?sw&browser');
    await ready(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    ok(!hits.some((u) => /gn-sound-a1-u01\.js\?v=/.test(u)), 'the install does not ask for the unit file', hits.filter((u) => /gn-sound/.test(u)));
    ok(await clipsLoaded(page, 'a1u01d1.s0a'), 'on the goal screen the engine fetches the first unit\'s file (the lesson will need it)');
    const stored = async () => page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).map((r) => r.url).filter((u) => /h=/.test(u)); });
    /* the very first page is not under the worker's control yet (its own fetch went straight to the network); from the
       next opening on, a file the engine fetches goes through the worker and is stored */
    ok((await stored()).length === 0, 'the first opening, not yet controlled by the worker, stored no sound file');
    await page.reload();
    await ready(page);
    ok(await clipsLoaded(page, 'a1u01d1.s0a'), 'opened again, the engine fetches the unit file through the worker');
    let lazy = await stored();
    for (let i = 0; i < 20 && !lazy.some((u) => /gn-sound-a1-u01\.js\?h=/.test(u)); i++) { await page.waitForTimeout(250); lazy = await stored(); }
    ok(lazy.length === 1 && /gn-sound-a1-u01\.js\?h=/.test(lazy[0]), 'the worker stored the unit file under its hash after that first use, and nothing else yet', lazy);
    /* a plan: the app then asks the worker for the rest of the level's sound */
    await tap(page, 'hablar con mi familia');
    await tap(page, 'casa');
    await tap(page, 'Siguiente');
    await tap(page, 'Empezar en A1');
    await tap(page, 'Tejé el primer hilo', 900);
    await tap(page, 'Empezar', 700);
    for (let i = 0; i < 40 && lazy.length < Object.keys(LAZY).length; i++) { await page.waitForTimeout(250); lazy = await stored(); }
    ok(lazy.length === Object.keys(LAZY).length, `with a plan, every sound file of the level is stored (${Object.keys(LAZY).length})`, lazy);
    await ctx.setOffline(true);
    hits.length = 0;
    await page.reload();
    await ready(page);
    ok(await clipsLoaded(page, 'a1u01d1.s0a'), 'offline, the unit file is served from the store and the clips register again');
    const spOffline = await page.evaluate(() => fetch('./assets/gn-sound-sp.js').then((r) => r.ok, () => false));
    ok(spOffline, 'offline, a sound file stored in the background is served too');
    ok(hits.length === 0, 'offline, nothing reached the server', hits);
    await shot(page, 'sound-offline');
    await ctx.setOffline(false);
    await ctx.close();
  }

  /* ---------- 5. the studio ---------- */
  note('5. the studio records, keeps and exports');
  {
    const ctx = await phone();
    await ctx.grantPermissions(['microphone'], { origin: BASE.replace(/\/$/, '') });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + 'estudio/');
    await page.waitForTimeout(800);
    const who = await page.locator('#who').textContent();
    ok(/Nivel A1 · \d+ clips/.test(who || ''), 'the studio loads the clip list of the level', who);
    const body = await page.locator('body').textContent();
    ok(/CC BY 4\.0/.test(body) && /nombre o seudónimo/.test(body), 'the studio states the rights (CC BY 4.0, credit by name or pseudonym)');
    await page.fill('#name', 'Prueba');
    await page.check('#agree');
    await page.selectOption('#voice', 'F');
    await page.click('#begin');
    await page.waitForTimeout(300);
    const line = await page.locator('#text').textContent();
    const key = await page.locator('#key').textContent();
    ok(/\S/.test(line || '') && /^a1u01d1\./.test(key || ''), 'the first line of the woman\'s voice shows, with its key', { line, key });
    const gn = await page.evaluate(() => document.getElementById('text').getAttribute('lang'));
    ok(gn === 'gn', 'the line is marked Guarani (the Guarani face)');
    await page.click('#rec');
    await page.waitForTimeout(900);
    await page.click('#rec');
    await page.waitForTimeout(1200);
    const take = await page.locator('#takeText').textContent();
    ok(/Toma guardada/.test(take || ''), 'a take is recorded with the (fake) microphone and kept', take);
    await shot(page, 'sound-studio');
    const kept = await page.evaluate(() => new Promise((done) => { const r = indexedDB.open('epua-estudio', 1); r.onsuccess = () => { const t = r.result.transaction('tomas').objectStore('tomas').getAll(); t.onsuccess = () => done(t.result.map((x) => ({ key: x.key, type: x.type, size: x.blob && x.blob.size }))); }; r.onerror = () => done(null); }));
    ok(Array.isArray(kept) && kept.length === 1 && kept[0].key === key && kept[0].size > 0, 'the take is in IndexedDB under its key (a session can be resumed)', kept);
    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('#export')]);
    const zipPath = path.join(OUT, 'sound-studio-export.zip');
    await download.saveAs(zipPath);
    const names = execFileSync('python3', ['-I', '-c', 'import sys, zipfile; z = zipfile.ZipFile(sys.argv[1]); print("\\n".join(i.filename + " " + str(i.file_size) + " " + str(i.compress_type) for i in z.infolist())); z.testzip()', zipPath], { encoding: 'utf8' }).trim().split('\n');
    ok(names.some((n) => n.startsWith(key + '.')) && names.some((n) => n.startsWith('voices.json')) && names.some((n) => n.startsWith('tomas.csv')) && names.every((n) => n.endsWith(' 0')), 'the zip holds the take named by key, voices.json and tomas.csv, stored (Python reads it)', names);
    ok(errors.length === 0, 'no page errors in the studio', errors);
    const studio = fs.readFileSync(path.join(DIST, 'estudio/index.html'), 'utf8');
    ok(!/<script[^>]*src=|https?:\/\/|\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(studio), 'the studio loads no script and names no other site');
    await ctx.close();
  }

  await browser.close();
  server.close();
  console.log(fails ? `\n${fails} check(s) failed` : '\nsound path: all checks passed');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
