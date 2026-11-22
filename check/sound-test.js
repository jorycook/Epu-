// Checks the sound path end to end in Chromium: the fixture recordings (check/fixtures/sound, short tones named by clip
// key) are turned into sound files by tools/make-sound.mjs, marked synthetic (a stereo take must come out as loud as a
// mono one, a silent take must make no clip, the exam's test tone must be at about the level of the voices, a take of a
// fifth of a second must come out as loud as a second of the same note, a take kept as FLAC must be read, the stated
// length must be the decoded clip's, no clip may pass the peak ceiling once its MP3 is decoded, a take with one loud
// moment must reach the loudness target with that moment turned down, a take that peaks all along must stay under the
// target and be named, the clips as they ship must be at the target the tool states (the encoder's own step allowed
// for), a dry run must name what a real run would make, and a file whose clips did not change must keep every byte,
// its date too, when the tool runs again), the app is
// built with them into epua-app/dist-sound (never into docs/), and the built app is checked for: the Words sound step
// playing a clip (has() true, its wording in the recorded state, the tag «voz sintética» in the pair's head before the
// tap and what it means said once in the shell's live region), the player's switch for the synthetic voice (off, its
// clips count as missing), Hablar's tag, a dialogue put together for Listening, the unit file fetched when its unit is
// in use and not at install (none before there is a plan), stored by the offline worker after that first use and
// served from the store with no connection, the few files to have ahead stored once there is a plan and never the
// whole level (only the unit that is opened when the browser says the learner saves data), the level exam's file
// stored when its tab opens, a sound file that could not be fetched asked for again once from the next screen and when the
// connection comes back, the studio page (recording with a fake microphone, the take kept, the zip exported), and the
// notebook fetching the exam's and the placement's sound for a mistake made there. Screenshots go to check/out/.
// usage: node check/sound-test.js      (from the repository root; needs ffmpeg, playwright and the fonts in fonts-src/)
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync, spawnSync } = require('child_process');
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
ok(/c\['a1u01d1\.s0b'\] = \{ ms: \d+, kind: 'synthetic', voice: 'F', b: '[A-Za-z0-9+/=]+' \};/.test(unitJs), 'a clip registers as { ms, kind, voice, b } under its key');
ok(/c\['a1u01d1\.r1'\] = \{ ms: \d+, kind: 'synthetic', voice: 'N\+F\+M', cues: \[[\d, ]+\], b: /.test(unitJs), 'a dialogue is put together from its lines, with cues');
ok(/c\['a1u01d6\.w\.mbaeichapa'\] = c\['a1u01d1\.w\.mbaeichapa'\];/.test(unitJs), 'a text said already is registered under its other key by reference');
/* only what a screen can ask for is shipped: a line of a dialogue is heard inside the dialogue's clip, and of the two words
   of a sound pair one plays (its row in the list says which does not: "unused"). Their recordings took a third of the
   files. A word that plays and shares the recording of one that does not carries the clip itself */
ok(!/c\['a1u01d1\.r1\.l\d(?:\.slow)?'\]/.test(unitJs) && !/c\['a1u01d1\.p1\.x0\.l\d'\]/.test(unitJs), 'a line of a dialogue makes no clip of its own');
ok(!/c\['a1u01d1\.s0a'\]/.test(unitJs) && !/c\['a1u01d1\.s3b'\]/.test(unitJs) && !/c\['a1u01d1\.s2a'\]/.test(unitJs), 'the word of a sound pair that does not play makes no clip');
ok(/c\['a1u01d4\.w\.kaa'\] = \{ ms: \d+, kind: 'synthetic', voice: 'F', b: /.test(unitJs), 'a scene word that shares the recording of a pair\'s unplayed word carries the clip itself');
ok(/\n\d+ of the \d+ recordings make no clip of their own, because no screen asks for their key: \d+ lines[^\n]*and \d+ words of sound pairs that do not play/.test(made), 'make-sound.mjs says how many recordings make no clip of their own', made.split('\n').find((l) => /make no clip of their own/.test(l)));
/* the level of a clip as it ships: its MP3, decoded, and its integrated loudness in LUFS (ffmpeg's ebur128) */
const PROBE = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-probe-'));
process.on('exit', () => fs.rmSync(PROBE, { recursive: true, force: true }));
const lufs = (js, key) => {
  const m = new RegExp("c\\['" + key.replace(/\./g, '\\.') + "'\\] = \\{ ms: \\d+, [^}]*?b: '([A-Za-z0-9+/=]+)' \\};").exec(js);
  if (!m) return NaN;
  const mp3 = path.join(PROBE, 'clip.mp3');
  fs.writeFileSync(mp3, Buffer.from(m[1], 'base64'));
  const said = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', mp3, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '';
  const i = /I:\s+(-?[\d.]+) LUFS/.exec(said.slice(said.lastIndexOf('Summary:')));
  return i ? parseFloat(i[1]) : NaN;
};
/* three takes of the same second of tone (check/fixtures/sound/make-fixtures.mjs): mono, stereo, and stereo with the
   voice on the left channel only. Measured on its own two channels, a stereo take came out 3 dB (one side: 6 dB) under */
const level = { mono: lufs(unitJs, 'a1u01d1.w.maitei'), stereo: lufs(unitJs, 'a1u01d1.w.pyhareve'), oneSide: lufs(unitJs, 'a1u01d1.w.kaaru') };
ok(level.mono > -17.5 && level.mono < -15, 'a mono take of a second comes out at about −16 LUFS (measured with its air, which a gate of the standard does not take out of so short a clip)', level);
ok(Math.abs(level.stereo - level.mono) <= 0.5 && Math.abs(level.oneSide - level.mono) <= 0.5, 'a stereo take, and one with the voice on one channel only, come out as loud as the mono one', level);
/* a take that is silence all along (a hum under the trim threshold) */
ok(/\n1 recording is silent[^\n]*a1u01d1\.w\.ipora \(a1u01d1\.w\.ipora\.wav\)/.test(made) && /still missing \([^)\n]*; 1 of them recorded but silent\)/.test(made), 'a silent take is named in the summary and counted with the recordings still missing', made.split('\n').filter((l) => /silent/.test(l)).join(' | '));
ok(!/c\['a1u01d1\.w\.ipora'\]/.test(unitJs), 'and it makes no clip');
/* a clip as it ships, decoded: its samples at its own rate (24 kHz) and at four times that, for the peak between the samples */
const allJs = listed.map((f) => fs.readFileSync(path.join(PROJECT, f), 'utf8'));
const clipOf = (key) => {
  for (const js of allJs) {
    const m = new RegExp("c\\['" + key.replace(/\./g, '\\.') + "'\\] = \\{ ms: (\\d+), [^}]*?(?:cues: \\[([\\d, ]+)\\], )?b: '([A-Za-z0-9+/=]+)' \\};").exec(js);
    if (m) return { ms: +m[1], cues: m[2] ? m[2].split(',').map((n) => +n) : null, b: m[3] };
  }
  return null;
};
const pcm = (b64, rate) => {
  const mp3 = path.join(PROBE, 'clip.mp3');
  fs.writeFileSync(mp3, Buffer.from(b64, 'base64'));
  const out = spawnSync('ffmpeg', ['-v', 'error', '-i', mp3, '-ac', '1', '-ar', String(rate), '-f', 'f32le', '-'], { maxBuffer: 256 * 1024 * 1024 }).stdout;
  return new Float32Array(out.buffer.slice(out.byteOffset, out.byteOffset + out.length - (out.length % 4)));
};
const dB = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
const peak = (x) => { let m = 0; for (let i = 0; i < x.length; i++) { const v = Math.abs(x[i]); if (v > m) m = v; } return m; };
const truePeak = (b64) => dB(Math.max(peak(pcm(b64, 24000)), peak(pcm(b64, 96000))));
/* the level of the loudest tenth of a second of a clip, in dBFS (RMS): what a steady note sounds at, whatever its length */
const steady = (b64) => {
  const x = pcm(b64, 24000);
  const n = 2400;
  let sum = 0;
  let best = 0;
  for (let i = 0; i < x.length; i++) { sum += x[i] * x[i]; if (i >= n) sum -= x[i - n] * x[i - n]; if (i >= n - 1 && sum > best) best = sum; }
  return dB(Math.sqrt(best / n));
};
/* a take kept as FLAC (the synthetic voice's takes in sound/A1/voz are) */
ok(!!clipOf('a1u01d1.w.jajotopata') && fs.existsSync(path.join(ROOT, 'check/fixtures/sound/a1u01d1.w.jajotopata.flac')), 'a take kept as FLAC makes its clip like a WAV');
/* the same note for a fifth of a second and for a second: a word of 300 ms must not come out quieter than a sentence
   (levelled by ffmpeg's loudnorm, the short take came out 3.6 dB under the long one, and the shortest words of the
   synthetic voice up to 8 LU under the target) */
const long = clipOf('a1u01d1.w.maitei');
const short = clipOf('a1u01d1.w.jaryi');
const levels = { long: long ? steady(long.b) : NaN, short: short ? steady(short.b) : NaN };
ok(Math.abs(levels.short - levels.long) <= 1.5, 'a take of a fifth of a second comes out as loud as a second of the same note (within 1.5 dB)', levels);
/* the stated length is the decoded clip's (it was the MP3 file's own duration, 61 ms longer: the encoder's padding), and
   a dialogue's last cue, where its last line ends, is the end of the clip */
const lengths = ['a1u01d1.s0b', 'a1u01d1.w.maitei', 'a1u01d1.w.karai', 'a1u01d1.r1', 'c.check'].map((key) => { const c = clipOf(key); return { key, ms: c ? c.ms : NaN, decoded: c ? Math.round(pcm(c.b, 24000).length / 24) : NaN }; });
ok(lengths.every((l) => Math.abs(l.ms - l.decoded) <= 2), 'ms is the length of the clip once decoded, to 2 ms', lengths);
const dialogue = clipOf('a1u01d1.r1');
ok(!!dialogue && dialogue.cues.every((c, i) => c > (i ? dialogue.cues[i - 1] : 0)) && Math.abs(dialogue.cues[dialogue.cues.length - 1] - dialogue.ms) <= 30, 'a dialogue\'s cues rise to the end of the clip', dialogue && { ms: dialogue.ms, cues: dialogue.cues });
/* the peak ceiling, taken on the decoded MP3 of every clip: the take that peaks like a voice (make-fixtures.mjs) is set
   by the ceiling, not by the loudness target, and its MP3 peaks higher than its WAV (it came out at -0.8 dBTP) */
const keysOf = (js) => { const out = []; const re = /c\['([^']+)'\] = \{ ms: \d+/g; let m; while ((m = re.exec(js))) out.push(m[1]); return out; };
const peaks = [];
allJs.forEach((js) => keysOf(js).forEach((key) => peaks.push({ key, tp: +truePeak(clipOf(key).b).toFixed(2) })));
const over = peaks.filter((p) => !(p.tp <= -1.5));
ok(peaks.length >= 40 && over.length === 0, `no clip passes the ceiling of −1.5 dBTP once decoded (${peaks.length} clips, the highest at ${Math.max(...peaks.map((p) => p.tp))} dBTP)`, over);
/* the limiter. A take that peaks all along like a voice's pulses (make-fixtures.mjs: every pulse as high as the next)
   has no single peak to turn down: it stops at the ceiling, stays under the loudness target, and the tool says so on
   its line and names it among the clips that land more than 2 LU from the target */
const pulses = peaks.find((p) => p.key === 'a1u01d1.w.karai');
const lineOf = (key) => made.split('\n').find((l) => new RegExp('^\\s+\\d+\\s+' + key.replace(/\./g, '\\.') + '\\s').test(l)) || '';
ok(!!pulses && pulses.tp <= -1.5 && pulses.tp > -4 && /it stays \d+\.\d LU under the target/.test(lineOf('a1u01d1.w.karai')), 'the take that peaks like a voice all along stops at the ceiling, and the tool says it stays under the loudness target', { pulses, line: lineOf('a1u01d1.w.karai').trim().slice(0, 260) });
ok(/\nas they ship[^\n]*1 of them is more than 2 LU from the target: a1u01d1\.w\.karai -\d+\.\d\n/.test(made), 'and the tool names it, alone, as a clip that lands more than 2 LU from the target once decoded from its MP3', made.split('\n').find((l) => /^as they ship/.test(l)));
/* a take with one loud moment (a soft note that swells for a fiftieth of a second, 16 dB over its loudness): one gain
   would stop it at the ceiling 2 LU under the target. Its swell is turned down, by 3 dB at the most, and the take
   comes out as loud as the plain note of a second (before the limiter it came out 2.2 LU under it) */
const swell = { line: lineOf('a1u01d1.p1.x1'), lufs: lufs(unitJs, 'a1u01d1.p1.x1'), tp: (peaks.find((p) => p.key === 'a1u01d1.p1.x1') || {}).tp };
const turned = parseFloat((/its peaks turned down by (\d+\.\d) dB at the most, during (\d+) ms/.exec(swell.line) || [])[1]);
const during = parseFloat((/its peaks turned down by (\d+\.\d) dB at the most, during (\d+) ms/.exec(swell.line) || [])[2]);
ok(turned >= 1 && turned <= 3.05 && during > 10 && during < 120 && !/it stays/.test(swell.line), 'the take with one loud moment has that moment turned down, by 3 dB at the most and for a few hundredths of a second, and does not stay under the target', { turned, during, line: swell.line.trim().slice(0, 220) });
ok(Math.abs(swell.lufs - level.mono) <= 1 && swell.tp <= -1.5, 'it comes out as loud as the plain note (within 1 LU, measured with ffmpeg\'s ebur128), under the peak ceiling', { swell: swell.lufs, mono: level.mono, tp: swell.tp });
/* the clips as they ship are at the target the tool states: the encoder's own step (LAME scales by 0.95 at 32 kb/s,
   0.45 dB; the clips shipped that much under the target before) is measured and allowed for */
const shipped = /\nas they ship[^\n]*the (\d+) clips of one recording are at (-\d+\.\d) LUFS at the median, from (-\d+\.\d) to (-\d+\.\d); the (\d+) lines of the (\d+) clips put together are at (-\d+\.\d) LUFS at the median, from (-\d+\.\d) to (-\d+\.\d)\./.exec(made) || [];
ok(+shipped[2] >= -16.2 && +shipped[2] <= -15.8 && +shipped[4] <= -15.8 && +shipped[7] >= -16.3 && +shipped[8] >= -17 && +shipped[9] <= -15.8, 'decoded from their MP3s, the clips of one recording and the lines of the dialogues are at −16 LUFS at the median (the tool measures them, and says so)', shipped.slice(1));
ok(/\nlevels: \d+ of the \d+ recordings are brought to -16 LUFS as they ship[^\n]*the encoder's own step of -0\.\d\d dB allowed for[^\n]*2 of the \d+ had their highest peaks turned down[^\n]*1 stay under the target[^\n]*ms is the length of each decoded MP3/.test(made), 'make-sound.mjs sums up the levels: how many recordings reach the target, how many had peaks turned down, how many stay under it, and the encoder\'s step', made.split('\n').find((l) => /^levels/.test(l)));
/* the level exam's file: its test tone, and its first listening item, put together from two lines of its own and one a lesson says */
const examJs = fs.readFileSync(path.join(PROJECT, 'gn-sound-a1-x.js'), 'utf8');
const tone = lufs(examJs, 'c.check');
ok(tone > -22 && tone < -18 && Math.abs(tone - level.mono) < 6, 'the exam\'s test tone is at about the level of the voices (−20 LUFS; it was 18 dB under them)', { tone, voice: level.mono });
ok(/c\['a1x\.4'\] = \{ ms: \d+, kind: 'synthetic', voice: 'N\+F\+M', cues: \[[\d, ]+\], b: /.test(examJs), 'the exam\'s first listening item is put together, one of its lines from a lesson\'s recording');
/* a dry run reads no recording and writes nothing, and names what a real run would make: the dialogues it would put
   together and the files it would write (it used to report every dialogue as lacking all its lines, and no file) */
const DRYOUT = path.join(os.tmpdir(), 'epua-sound-dry-' + process.pid);
const dry = execFileSync(process.execPath, [path.join(ROOT, 'tools/make-sound.mjs'), path.join(ROOT, 'check/fixtures/sound'), '--out', DRYOUT, '--dry-run'], { encoding: 'utf8' });
ok(/\n {2}join {2}a1u01d1\.r1 {2}\(8 lines\)/.test(dry) && /\n {2}would write gn-sound-a1-u01\.js: \d+ clips, \d+ shared/.test(dry) && /\nwould make \d+ clips from the \d+ recordings of /.test(dry) && !/not put together[^\n]*[:;] a1u01d1\.r1 \(/.test(dry) && !fs.existsSync(DRYOUT), 'a dry run names the dialogues it would put together and the files it would write, and writes nothing', dry.split('\n').filter((l) => /^would make|would write|not put together/.test(l.trim())).join(' | ').slice(0, 280));
/* made again on another day: a file whose clips did not change keeps every byte, the day in its first line too. The app
   stores each sound file on the phone under a hash of its content, so a file written again with nothing new but the date
   would be fetched again by every phone (the seven files of A1 all were, 3.7 MB, when the tool was run on a later day
   with no clip changed). The files of the first run stand in for older ones here: a copy of them dated 2001 */
const AGAIN = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-again-'));
const TAKES = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-takes-'));
process.on('exit', () => { fs.rmSync(AGAIN, { recursive: true, force: true }); fs.rmSync(TAKES, { recursive: true, force: true }); });
const DAY = / on (\d{4}-\d{2}-\d{2}) — do not edit by hand\./;
const old = {};
listed.forEach((f) => { old[f] = fs.readFileSync(path.join(PROJECT, f), 'utf8').replace(DAY, ' on 2001-01-01 — do not edit by hand.'); fs.writeFileSync(path.join(AGAIN, f), old[f]); });
const now = (f) => fs.readFileSync(path.join(AGAIN, f), 'utf8');
const again = execFileSync(process.execPath, [path.join(ROOT, 'tools/make-sound.mjs'), path.join(ROOT, 'check/fixtures/sound'), '--out', AGAIN, '--kind', 'synthetic'], { encoding: 'utf8' });
ok(listed.every((f) => DAY.test(old[f]) && now(f) === old[f]) && new RegExp('\\n' + listed.length + ' of the ' + listed.length + ' sound files are byte for byte what they were').test(again), 'made again with no take changed, every sound file keeps every byte, the day in its first line too', again.split('\n').find((l) => /sound files are/.test(l)) || listed.filter((f) => now(f) !== old[f]));
/* one take replaced by another (in a copy of the fixtures): its unit's file is written anew, with the day it is made
   on, and every other file is left alone */
fs.cpSync(path.join(ROOT, 'check/fixtures/sound'), TAKES, { recursive: true });
fs.copyFileSync(path.join(TAKES, 'a1u01d1.p2.x1.wav'), path.join(TAKES, 'a1u01d1.p2.x0.wav'));
const anew = execFileSync(process.execPath, [path.join(ROOT, 'tools/make-sound.mjs'), TAKES, '--out', AGAIN, '--kind', 'synthetic'], { encoding: 'utf8' });
const others = listed.filter((f) => f !== 'gn-sound-a1-u01.js');
const unitDay = (DAY.exec(now('gn-sound-a1-u01.js')) || [])[1];
ok(now('gn-sound-a1-u01.js') !== old['gn-sound-a1-u01.js'] && !!unitDay && unitDay !== '2001-01-01' && others.length >= 2 && others.every((f) => now(f) === old[f]) && /written anew: gn-sound-a1-u01\.js\n/.test(anew), 'with one take replaced, its unit\'s file is written anew with the day\'s date, and the other files keep every byte', { unitDay, changed: listed.filter((f) => now(f) !== old[f]), said: anew.split('\n').find((l) => /sound files are/.test(l)) });
execFileSync(process.execPath, ['build.mjs'], { cwd: APPDIR, env: { ...process.env, EPUA_OUT: 'dist-sound', EPUA_DOCS: '', EPUA_PROJECT: PROJECT, EPUA_BUILD_DATE: 'sound test' }, stdio: 'ignore' });
const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
const FILES = JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
const LAZY = JSON.parse(sw.match(/const LAZY = (\{[\s\S]*?\});/)[1]);
ok(fs.existsSync(path.join(DIST, 'assets/gn-sound-a1-u01.js')) && fs.existsSync(path.join(DIST, 'assets/gn-sound-index.js')), 'the build ships the unit files and the index');
ok(!FILES.includes(UNIT) && FILES.includes('./assets/gn-sound-index.js'), 'sw.js installs the index but not the unit file');
ok(Object.keys(LAZY).length === listed.length && /^[0-9a-f]{10}$/.test(LAZY[UNIT] || ''), 'sw.js lists every sound file apart, under a hash of its content', LAZY);
ok(fs.existsSync(path.join(DIST, 'estudio/index.html')) && fs.existsSync(path.join(DIST, 'estudio/A1/manifest.json')) && JSON.parse(fs.readFileSync(path.join(DIST, 'estudio/lista.json'), 'utf8'))[0].level === 'A1', 'the build puts the studio and the clip lists in estudio/');
ok(!FILES.some((f) => f.startsWith('./estudio/')), 'the studio is not part of the install');
/* docs/ is the site as it is published: it may hold the real sound files (the app's build puts them there), never
   one made from the fixtures. A fixture file is known by its head, which names the fixtures' voices («Fixture F»,
   check/fixtures/sound/voices.json), and by being, byte for byte, a file this run has just built */
const DOCS_ASSETS = path.join(ROOT, 'docs/assets');
const isFixture = (f) => /Voices: [^\n]*Fixture [FMN]\b/.test(fs.readFileSync(f, 'utf8').slice(0, 1200));
const inDocs = fs.existsSync(DOCS_ASSETS) ? fs.readdirSync(DOCS_ASSETS).filter((f) => /^gn-sound-(?!index)[a-z0-9-]+\.js$/.test(f)) : [];
const fixtureInDocs = inDocs.filter((f) => isFixture(path.join(DOCS_ASSETS, f)) || (fs.existsSync(path.join(DIST, 'assets', f)) && fs.readFileSync(path.join(DOCS_ASSETS, f)).equals(fs.readFileSync(path.join(DIST, 'assets', f)))));
ok(isFixture(path.join(DIST, 'assets/gn-sound-a1-u01.js')), 'a sound file made from the fixtures is known by its head (it names the fixtures\' voices)');
ok(fixtureInDocs.length === 0, `docs/ holds no fixture sound: ${inDocs.length ? 'its ' + inDocs.length + ' sound files are not the fixtures\'' : 'it has no sound file'} (the test build is dist-sound)`, fixtureInDocs);
if (fs.existsSync(path.join(DOCS_ASSETS, 'gn-sound-index.js'))) ok(!/Fixture [FMN]\b/.test(fs.readFileSync(path.join(DOCS_ASSETS, 'gn-sound-index.js'), 'utf8')), 'docs/ does not hold the fixtures\' sound index either');
const lic = fs.readFileSync(path.join(DIST, 'licenses.txt'), 'utf8');
ok(/== Sound ==[\s\S]*gn-sound-a1-u01\.js[\s\S]*synthetic/.test(lic), 'licenses.txt names the sound files and the synthetic voices');
/* the fixtures' voices are marked synthetic and name no model: the licences say that no credit can be given, and
   never print the credit of a model that did not make them (the real voice's credit is checked on the real build:
   check/platform-test.js) */
ok(/marked synthetic and names no model: no credit can be given/.test(lic) && !/MMS-TTS|huggingface/.test(lic), 'licenses.txt gives the fixtures\' unnamed voice model no credit, and says so');
/* what each sound file weighs is in the app's own code, for the page that explains the voice (gnApp.sound) */
const appJs = fs.readFileSync(path.join(DIST, 'assets/gn-app.js'), 'utf8');
const bytes = JSON.parse((/SOUND_BYTES = JSON\.parse\('([^']*)'\)/.exec(appJs) || [, '{}'])[1]);
ok(listed.length > 0 && listed.every((f) => bytes[f] === fs.statSync(path.join(DIST, 'assets', f)).size), 'the build tells the app what each sound file weighs', bytes);

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
    /* every change of what the live regions say of the voice is written down (the shell empties its region a few
       seconds after the note, so «said once» is counted, not read off the page at one moment) */
    await ctx.addInitScript(() => {
      window.__voz = [];
      let last = '';
      const look = () => { const t = [...document.querySelectorAll('[aria-live]')].map((e) => (e.textContent || '').trim()).filter((x) => /^Voz sintética:/.test(x)).join(' | '); if (t !== last) { last = t; window.__voz.push(t); } };
      new MutationObserver(look).observe(document, { subtree: true, childList: true, characterData: true });
    });
    const page = await ctx.newPage();
    const logs = [];
    page.on('pageerror', (e) => logs.push(String(e)));
    hits.length = 0;
    await page.goto(BASE + '?gntest&screen=Words&level=A1&cur=a1u01d1');
    await ready(page);
    ok(await clipsLoaded(page, 'a1u01d1.s0b'), 'the unit\'s sound file is fetched when the unit is in use (the clips register in window.__gnClips)');
    ok(hits.some((u) => /gn-sound-a1-u01\.js/.test(u)), 'the unit file came from the server after the page opened', hits.filter((u) => /gn-sound/.test(u)));
    const snd = await page.evaluate(() => ({ has: window.gnSound.has('a1u01d1.s0b'), kind: window.gnSound.kind('a1u01d1.s0b'), ms: window.gnSound.ms('a1u01d1.s0b'), none: window.gnSound.kind('nothing.here'), listening: window.gnSound.has('a1u01d1.r1'), lms: window.gnSound.ms('a1u01d1.r1') }));
    ok(snd.has && snd.ms > 300, 'gnSound.has() is true for a pair\'s word and knows its length', snd);
    ok(snd.kind === 'synthetic' && snd.none === '', 'gnSound.kind() says synthetic for the fixture clip and nothing for a missing key', snd);
    ok(snd.listening && snd.lms > 4000, 'the listening item\'s dialogue is one clip the screens can ask for', snd);
    const t0 = await text(page);
    ok(/escuchá la diferencia en cada par/.test(t0) && !/todavía no (están grabados|tienen audio)/.test(t0), 'the sound step\'s intro is the recorded one (not «estos pares todavía no tienen audio»)', t0.slice(0, 200));
    /* the tag «voz sintética»: on each pair, before any tap, in no live region; what it means is said once, by the shell */
    const tags = () => page.evaluate(() => [...document.querySelectorAll('#gn-stage span')].filter((el) => !el.children.length && el.textContent.trim() === 'voz sintética' && el.getBoundingClientRect().width > 0).map((el) => ({ live: !!el.closest('[aria-live], [role="status"]'), head: (el.parentElement.textContent || '').trim().slice(0, 14) })));
    const notes = () => page.evaluate(() => window.__voz.filter(Boolean));
    const pairs = await page.evaluate(() => window.gnCourse.day('a1u01d1').words.sound.pairs.length);
    const tg0 = await tags();
    ok(tg0.length === pairs && tg0.every((x) => !x.live && /^PAR \d DE \d/.test(x.head)), `each of the ${pairs} pairs carries the tag «voz sintética» in its head before it is tapped, outside any live region`, tg0);
    await page.waitForFunction(() => window.__voz.some(Boolean), null, { timeout: 3000 }).catch(() => {});
    const said0 = await notes();
    ok(said0.length === 1 && /un programa, no una persona/.test(said0[0]) && /Progreso/.test(said0[0]) && !/\|/.test(said0[0]), 'what the tag means is said once, in the shell\'s live region, and names Progreso', said0);
    ok(/Tocá el parlante: suena una de las dos/.test(t0), 'the first pair asks to listen, not to read the word shown', t0.slice(0, 300));
    const played = await page.evaluate(() => { let r = null; const p = window.gnSound.play; window.gnSound.play = function (k, f) { r = p.call(this, k, f); return r; }; return true; });
    await tap(page, { aria: 'Escuchar la palabra del par 1' }, 700);
    const t1 = await text(page);
    await shot(page, 'sound-words-pair');
    ok(/¿Cuál escuchaste\?/.test(t1) && !/no está grabado/.test(t1), 'after the play the pair asks which word was heard (the clip played, no «no está grabado»)', t1.slice(0, 300));
    await tap(page, { aria: 'Escuchar la palabra del par 1' }, 500);
    await tap(page, { aria: 'Escuchar la palabra del par 2' }, 500);
    const tg1 = await tags();
    const said1 = await notes();
    const pairLines = await page.evaluate(() => [...document.querySelectorAll('#gn-stage [aria-live]')].map((el) => (el.textContent || '').trim()).filter((t) => /Cuál|parlante/.test(t)));
    ok(tg1.length === pairs && said1.length === 1 && said1[0] === said0[0] && pairLines.length >= 2 && !pairLines.some((l) => /sintética|programa/.test(l)), 'three taps later the tags are the same, the note was not said again, and no pair\'s live line speaks of the voice', { tg1: tg1.length, said1, pairLines });
    /* said, the note does not stay in the page: the region is emptied a few seconds later, and stays empty */
    await page.waitForFunction(() => window.__voz.length >= 2 && window.__voz[window.__voz.length - 1] === '', null, { timeout: 12000 }).catch(() => {});
    await tap(page, { aria: 'Escuchar la palabra del par 2' }, 400);
    const log = await page.evaluate(() => window.__voz.slice());
    ok(log.filter(Boolean).length === 1 && log[log.length - 1] === '', 'a few seconds after it was said the live region is empty again, and another tap does not bring the note back', log.map((x) => x.slice(0, 24)));
    const state = await page.evaluate(() => ({ at: window.gnSound.at(), over: window.gnSound.over(), ctx: !!(window.AudioContext || window.webkitAudioContext) }));
    ok(played && state.ctx, 'play() went through the player (an AudioContext exists in this browser)', state);
    /* the player's switch (the learner's, in Progreso): off, a synthetic clip counts as missing; on again, it is back */
    const sw = await page.evaluate(() => {
      const s = window.gnSound;
      const k = 'a1u01d1.s0b';
      const out = { was: s.synthetic(), cues: (s.cues('a1u01d1.r1') || []).length, none: s.cues(k) };
      s.synthetic(false);
      Object.assign(out, { off: s.synthetic(), has: s.has(k), kind: s.kind(k), ms: s.ms(k), play: s.play(k), any: s.any(), offCues: s.cues('a1u01d1.r1'), wanted: window.gnCourse.soundWanted(), synth: window.gnCourse.synth(k) });
      s.synthetic(true);
      Object.assign(out, { back: s.synthetic(), hasBack: s.has(k), kindBack: s.kind(k), anyBack: s.any(), wantedBack: window.gnCourse.soundWanted(), synthBack: window.gnCourse.synth(k) });
      return out;
    });
    ok(sw.was === true && sw.off === false && !sw.has && sw.kind === '' && sw.ms === 0 && sw.play === false && sw.any === false && sw.offCues === null && sw.wanted === false && sw.synth === false, 'gnSound.synthetic(false): a synthetic clip counts as missing (has, kind, ms, play, cues), no clip is left, and no sound file is wanted', sw);
    ok(sw.back === true && sw.hasBack && sw.kindBack === 'synthetic' && sw.anyBack && sw.wantedBack && sw.synthBack && sw.cues === 8 && sw.none === null, 'gnSound.synthetic(true): the clips are back; a dialogue has a cue for each of its lines and a word has none', sw);
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
    const menu = await text(page);
    ok(/Los audios los dice una voz sintética\./.test(menu) && !/se ilumina sin sonar/.test(menu), 'the menu says the audios are a synthetic voice\'s (not that every sound button lights up in silence)', menu.slice(-300));
    await tap(page, 'Empezar', 800);
    const dockTag = () => page.evaluate(() => [...document.querySelectorAll('#gn-stage span')].filter((el) => !el.children.length && el.textContent.trim() === 'voz sintética' && el.getBoundingClientRect().width > 0).map((el) => ({ live: !!el.closest('[aria-live], [role="status"]') })));
    let tagSeen = [];
    for (let i = 0; i < 12 && !tagSeen.length; i++) { tagSeen = await dockTag(); if (!tagSeen.length) await page.waitForTimeout(350); }
    const seen = await text(page);
    await shot(page, 'sound-hablar');
    ok(tagSeen.length === 1 && !tagSeen[0].live && !/este audio lo hizo un programa/.test(seen), 'while a card with a clip is in play, the dock carries the tag «voz sintética», outside its live lines (no sentence in the status line)', { tagSeen, seen: seen.slice(-300) });
    await ctx.close();
  }

  /* ---------- 4. lazy and offline: nothing before there is a plan; then the unit in use, the files to have ahead, and
     what a screen asks for when it opens: never the whole level ---------- */
  note('4. stored after first use and ahead of time, served offline');
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    hits.length = 0;
    await page.goto(BASE + '?sw&browser');
    await ready(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    const soundHits = () => hits.filter((u) => /gn-sound-(?!index)/.test(u));
    const names = (list) => list.map((u) => u.split('/').pop().replace(/\?.*$/, '')).sort();
    ok(!hits.some((u) => /gn-sound-a1-u01\.js\?v=/.test(u)), 'the install does not ask for the unit file', hits.filter((u) => /gn-sound/.test(u)));
    const stored = async () => page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).map((r) => r.url).filter((u) => /h=/.test(u)); });
    /* a first visit stands on the goal screen: there is no plan, so no megabyte of sound is fetched yet (this check
       asked for the opposite, «on the goal screen the engine fetches the first unit's file», until the review of the
       voice counted what a first session downloads) */
    await page.waitForTimeout(1500);
    ok(soundHits().length === 0 && (await stored()).length === 0 && !(await page.evaluate(() => window.gnSound.any())), 'on the goal screen, before there is a plan, no sound file is asked for and none is stored', soundHits());
    await page.reload();
    await ready(page);
    await page.waitForTimeout(800);
    ok(soundHits().length === 0, 'opened again, still without a plan: still none', soundHits());
    /* a plan: the unit in use is fetched (through the worker, which stores it), and the app names to the worker what
       to have ahead of time: that unit, the one after it where it exists, and the speaking game. Nothing else */
    await tap(page, 'hablar con mi familia');
    await tap(page, 'casa');
    await tap(page, 'Siguiente');
    await tap(page, 'Empezar en A1');
    await tap(page, 'Tejé el primer hilo', 900);
    await tap(page, 'Empezar', 700);
    ok(await clipsLoaded(page, 'a1u01d1.s0b'), 'with a plan, the engine fetches the file of the unit in use');
    const ahead = (await page.evaluate(() => { const st = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => /^epua\.v1:/.test(k) && !/\./.test(k.slice(8)))) || '{}'); return window.gnCourse.soundAhead(st); })).sort();
    const all = names(Object.keys(LAZY));
    ok(ahead.includes('gn-sound-a1-u01.js') && ahead.includes('gn-sound-sp.js') && ahead.length < all.length && !ahead.some((f) => /-(x|pl)\.js$/.test(f)), 'the sound to have ahead is the unit in use, the unit after it where there is one, and the speaking game: not the level exam\'s nor the placement check\'s', { ahead, all });
    let lazy = await stored();
    for (let i = 0; i < 40 && lazy.length < ahead.length; i++) { await page.waitForTimeout(250); lazy = await stored(); }
    /* long enough for the worker to have fetched the rest of the level, had it been asked to */
    await page.waitForTimeout(3000);
    lazy = await stored();
    ok(JSON.stringify(names(lazy)) === JSON.stringify(ahead), `with a plan, the worker stores those ${ahead.length} files, each under its hash, and no other of the level's ${all.length}`, names(lazy));
    const count = {};
    names(soundHits()).forEach((f) => { count[f] = (count[f] || 0) + 1; });
    ok(JSON.stringify(Object.keys(count).sort()) === JSON.stringify(ahead) && ahead.every((f) => count[f] === 1), 'each of them went over the line once, and no other sound file was asked of the server', count);
    /* the level exam's file comes when its tab opens, and the worker stores it then */
    await tap(page, 'Examen', 700);
    for (let i = 0; i < 40 && !lazy.some((u) => /gn-sound-a1-x\.js\?h=/.test(u)); i++) { await page.waitForTimeout(250); lazy = await stored(); }
    ok(lazy.some((u) => /gn-sound-a1-x\.js\?h=/.test(u)) && lazy.length === ahead.length + 1, 'opening the Examen tab fetches the level exam\'s sound file, and the worker stores it then (and only it)', names(lazy));
    await tap(page, 'Camino', 600);
    await ctx.setOffline(true);
    hits.length = 0;
    await page.reload();
    await ready(page);
    ok(await clipsLoaded(page, 'a1u01d1.s0b'), 'offline, the unit file is served from the store and the clips register again');
    const spOffline = await page.evaluate(() => fetch('./assets/gn-sound-sp.js').then((r) => r.ok, () => false));
    ok(spOffline, 'offline, a sound file stored ahead of time is served too');
    ok(hits.length === 0, 'offline, nothing reached the server', hits);
    await shot(page, 'sound-offline');
    await ctx.setOffline(false);
    await ctx.close();
  }

  /* ---------- 4b. a learner who pays for data by the megabyte ---------- */
  note('4b. when the browser says the learner saves data, only the unit that is opened is stored');
  {
    const ctx = await phone();
    /* Chrome's "Lite mode" / Data Saver, as a page sees it */
    await ctx.addInitScript(() => { try { Object.defineProperty(Navigator.prototype, 'connection', { get: () => ({ saveData: true, effectiveType: '3g' }), configurable: true }); } catch (e) {} });
    const page = await ctx.newPage();
    hits.length = 0;
    await page.goto(BASE + '?sw&browser');
    await ready(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    /* a first visit: the unit's file is fetched once there is a plan. The app names that file to the worker
       (keepFiles), which stores it; with data saving it names nothing to have ahead */
    ok(await page.evaluate(() => navigator.connection && navigator.connection.saveData === true), 'this phone\'s browser says the learner saves data');
    await tap(page, 'hablar con mi familia');
    await tap(page, 'casa');
    await tap(page, 'Siguiente');
    await tap(page, 'Empezar en A1');
    await tap(page, 'Tejé el primer hilo', 900);
    await tap(page, 'Empezar', 700);
    ok(await clipsLoaded(page, 'a1u01d1.s0b'), 'the unit that is opened still gets its sound');
    /* long enough for the worker to have fetched the rest of the level, had it been asked to (it takes under 2 s here) */
    await page.waitForTimeout(5000);
    const kept = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).map((r) => r.url).filter((u) => /h=/.test(u)); });
    ok(kept.length === 1 && /gn-sound-a1-u01\.js\?h=/.test(kept[0]), 'with a plan, on a first visit, only the file of the unit that is opened is stored: nothing is fetched ahead behind the back of a learner who saves data, not the next unit, not the speaking game', kept);
    const asked = hits.filter((u) => /gn-sound-(?!index)/.test(u));
    ok(asked.length > 0 && asked.every((u) => /gn-sound-a1-u01\.js/.test(u)), 'no other sound file was asked of the server', asked);
    await tap(page, 'Progreso', 600);
    await tap(page, 'Voz sintética', 600);
    const sheet = ((await page.locator('#gn-stage [role="dialog"]').textContent()) || '').replace(/\s+/g, ' ');
    ok(/ahorro de datos/.test(sheet) && /de a una unidad/.test(sheet) && /cerca de \d+,\d MB/.test(sheet), 'Progreso\'s page on the voice says so: with data saving on, the sound comes one unit at a time, and what a unit weighs', sheet.slice(-420));
    await shot(page, 'sound-savedata');
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

  /* ---------- 6. the notebook: a mistake made in the level exam or the placement check plays its clip ---------- */
  note('6. Review asks for the exam\'s and the placement\'s sound');
  for (const [src, file] of [['a1x.4', 'gn-sound-a1-x.js'], ['pl.1', 'gn-sound-pl.js']]) {
    const ctx = await phone();
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    hits.length = 0;
    const mistakes = [{ src, wrong: 'Sin responder', at: 0, step: 0, due: '2020-01-01' }];
    await page.goto(BASE + '?gntest&screen=Review&level=A1&m=' + encodeURIComponent(JSON.stringify(mistakes)));
    await ready(page);
    ok(await clipsLoaded(page, src), `with a ${src} mistake in the notebook, the engine fetches ${file} (its clip registers)`, hits.filter((u) => /gn-sound/.test(u)));
    ok(hits.some((u) => u.includes(file)), `${file} came from the server`, hits.filter((u) => /gn-sound/.test(u)));
    let seen = '';
    for (let i = 0; i < 12 && !/Escuchá primero/.test(seen); i++) { seen = await text(page); if (!/Escuchá primero/.test(seen)) await page.waitForTimeout(250); }
    await shot(page, 'sound-review-' + src.replace('.', '-'));
    ok(/Escuchá primero/.test(seen) && !/no está grabado/.test(seen), `Review offers the ${src} clip to listen to, not the silent stand-in`, seen.slice(0, 300));
    const has = await page.evaluate((k) => window.gnSound.has(k) && window.gnSound.ms(k) > 300, src);
    ok(has && errors.length === 0, `gnSound.has('${src}') is true, and no page errors`, errors);
    await ctx.close();
  }

  /* ---------- 7. a sound file that could not be fetched ---------- */
  note('7. a sound file that failed to load is asked for again: once from the next screen, and when the connection is back');
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    let down = true;
    let asked = 0;
    await page.route('**/assets/gn-sound-a1-u01.js', (route) => { asked += 1; if (down) route.abort('internetdisconnected'); else route.continue(); });
    await page.goto(BASE + '?gntest&screen=Main&level=A1');
    await ready(page);
    for (let i = 0; i < 40 && asked < 1; i++) await page.waitForTimeout(150);
    await page.waitForTimeout(500);
    ok(asked === 1 && !(await page.evaluate(() => window.gnSound.any())), 'with no connection the unit\'s sound file is asked for once and no clip arrives', asked);
    /* the screen is drawn again and again (as the shell does when a file comes in): nothing is asked again from it */
    await page.evaluate(() => { for (let i = 0; i < 6; i++) document.dispatchEvent(new Event('gnscreens')); });
    await page.waitForTimeout(700);
    ok(asked === 1, 'drawing the same screen again asks for nothing: the file is not fetched in a loop', asked);
    await tap(page, 'Cuaderno', 700);
    ok(asked === 2, 'the next screen asks once more (still no connection)', asked);
    await page.evaluate(() => { for (let i = 0; i < 6; i++) document.dispatchEvent(new Event('gnscreens')); });
    await page.waitForTimeout(500);
    ok(asked === 2, 'and only once', asked);
    down = false;
    await tap(page, 'Camino', 700);
    ok(asked === 3 && (await clipsLoaded(page, 'a1u01d1.s0b')), 'with the connection back, the next screen fetches the file and its clips register', asked);
    await tap(page, 'Cuaderno', 500);
    await tap(page, 'Camino', 500);
    ok(asked === 3, 'a file that is in is never asked for again', asked);
    await ctx.close();
  }
  {
    const ctx = await phone();
    const page = await ctx.newPage();
    let down = true;
    let asked = 0;
    await page.route('**/assets/gn-sound-a1-u01.js', (route) => { asked += 1; if (down) route.abort('internetdisconnected'); else route.continue(); });
    await page.goto(BASE + '?gntest&screen=Teach&level=A1&cur=a1u01d1');
    await ready(page);
    for (let i = 0; i < 40 && asked < 1; i++) await page.waitForTimeout(150);
    await page.waitForTimeout(400);
    const before = ((await page.locator('#gn-stage').textContent()) || '');
    down = false;
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    const back = await clipsLoaded(page, 'a1u01d1.p1.x0');
    await page.waitForTimeout(400);
    const after = ((await page.locator('#gn-stage').textContent()) || '');
    ok(asked === 2 && back && !/voz sintética/.test(before.replace(/Voz sintética:[^.]*\.[^.]*\./, '')) && /voz sintética/.test(after), 'when the browser says the connection is back, the file is asked for at once and the open screen gets its clips (the tag appears on the examples) without being left', { asked, back });
    await ctx.close();
  }

  await browser.close();
  server.close();
  console.log(fails ? `\n${fails} check(s) failed` : '\nsound path: all checks passed');
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
