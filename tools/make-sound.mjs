// Turns a folder of recordings into the sound files the app plays: project/gn-sound-a1-u01.js (one per unit),
// gn-sound-pl.js (the placement check), gn-sound-a1-x.js (the level exam) and gn-sound-sp.js (the speaking game), each
// registering its clips in window.__gnClips as { ms, kind, voice, b } (b: a small mono MP3 as base64; cues on a clip put
// together from lines: where each line ends, in ms), plus the index project/gn-sound-index.js that names the files that
// exist, for the engine and the app build.
//
// usage: node tools/make-sound.mjs <folder> [--manifest sound/A1/manifest.json] [--out project] [--kind human|synthetic]
//                                  [--only <key> ...] [--dry-run]
//        --only is for a trial: the files written then hold those clips alone (a full run writes the whole set again).
// The folder holds one recording per clip key, <key>.wav | .mp3 | .m4a | .webm | .ogg | .flac | .aac (the studio page's
// zip, unpacked, or the owner's own files), and may hold voices.json, the credits: { "F": { "name": "…", "licence":
// "CC BY 4.0" }, "M": …, "N": … } (the studio writes it), or for a synthetic set { "kind": "synthetic", "model": "…",
// "licence": "…", "voices": { … } } (tools/make-tts.py writes it). --kind marks every clip of this run; a voice's own
// kind in voices.json wins. Needs ffmpeg and ffprobe.
//
// Each recording is mixed down to mono, trimmed of its silence (what is quieter than -45 dB at either end, 60 ms of it
// kept at the start), brought to the same loudness (-16 LUFS integrated, the usual target on a phone, peaks under
// -1.5 dBTP, by one gain: nothing is compressed; it is measured on the mono mix, the signal that is encoded), given
// 80 ms of air before and 150 ms after, and encoded as mono MP3 at 32 kb/s and 24 kHz, the format of Yaoki's clips
// (every browser plays MP3; Safari on iOS does not decode Opus for Web Audio). A take that is silence all along (under
// 100 ms left once trimmed) makes no clip: it is reported with the recordings still missing. A clip the manifest puts
// together from lines (a dialogue) is the lines in order with a quarter second between them; the test tone of the level
// exam (c.check) is made here, at about the level of the voices (-20 LUFS). A row with "same" is the recording of
// another key, registered under both names. Whatever recording is missing is reported at the end, and a file is written
// only for a group that has clips.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
/* the arguments: --name value options, --only followed by keys, --dry-run, and the folder */
const opts = { only: null };
const loose = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--dry-run') opts.dry = true;
  else if (a === '--only') { opts.only = new Set(); while (process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) opts.only.add(process.argv[++i]); }
  else if (a === '--manifest' || a === '--out' || a === '--kind') opts[a.slice(2)] = process.argv[++i];
  else if (a.startsWith('--')) { console.error(`unknown option ${a}`); process.exit(2); }
  else loose.push(a);
}
const opt = (name, fallback) => (opts[name] !== undefined ? opts[name] : fallback);
const FOLDER = loose[0];
const MANIFEST = path.resolve(ROOT, opt('manifest', 'sound/A1/manifest.json'));
const OUT = path.resolve(ROOT, opt('out', 'project'));
const DRY = !!opts.dry;
const ONLY = opts.only;
if (!FOLDER || !fs.existsSync(FOLDER) || !fs.statSync(FOLDER).isDirectory()) { console.error('usage: node tools/make-sound.mjs <folder of recordings> [--manifest sound/A1/manifest.json] [--out project] [--kind human|synthetic] [--only key …] [--dry-run]'); process.exit(2); }
const EXT = ['wav', 'mp3', 'm4a', 'webm', 'ogg', 'flac', 'aac', 'mp4', 'opus', 'caf'];
const LOUDNESS = -16;   /* LUFS, integrated */
const PEAK = -1.5;      /* dBTP */
const HEAD = 80;        /* ms of air before a clip */
const TAIL = 150;       /* and after it */
const GAP = 0.25;       /* s between the lines of a dialogue, besides their own air */
const LEAST = 100;      /* ms a take must leave once trimmed: one that never rises over the trim's threshold leaves 0 to 60 (what the trim keeps before a last blip), no voice */
const RATE = 24000;

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const rows = manifest.clips || [];
const byKey = {};
rows.forEach((r) => { byKey[r.key] = r; });
/* the credits */
let credits = {};
const vfile = path.join(FOLDER, 'voices.json');
if (fs.existsSync(vfile)) { try { credits = JSON.parse(fs.readFileSync(vfile, 'utf8')); } catch (e) { console.error(`voices.json does not read: ${e.message}`); process.exit(1); } }
const voices = credits.voices || credits;
const KIND = opt('kind', credits.kind === 'synthetic' ? 'synthetic' : 'human');
if (KIND !== 'human' && KIND !== 'synthetic') { console.error('--kind must be human or synthetic'); process.exit(2); }
const kindOf = (voice) => { const v = voices[voice] || {}; return v.kind === 'synthetic' || v.kind === 'human' ? v.kind : KIND; };
const voiceCredit = (voice) => { const v = voices[voice] || {}; return { name: v.name || (kindOf(voice) === 'synthetic' ? credits.model || 'voice model' : ''), kind: kindOf(voice), licence: v.licence || credits.licence || '', model: v.model || (kindOf(voice) === 'synthetic' ? credits.model || '' : '') }; };

/* ---------- ffmpeg ---------- */
const run = (cmd, a) => { const r = spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); if (r.error) throw r.error; return r; };
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); execFileSync('ffprobe', ['-version'], { stdio: 'ignore' }); } catch (e) { console.error('ffmpeg and ffprobe are needed'); process.exit(1); }
const seconds = (f) => parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).stdout) || 0;
/* every pass over a recording starts by mixing it down to mono, in one fixed way (as double, so nothing clips on the
   way): the loudness is then measured on the very signal that is encoded. A stereo take measured on its two channels
   came out 3 dB under the target once mixed down, and 6 dB under with the voice on one side only */
const MONO = 'aformat=sample_fmts=dbl:channel_layouts=mono';
const TRIM = MONO + ',silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse';
/* one recording → a trimmed, levelled, padded mono WAV at 24 kHz */
function prepare(src, wav) {
  const probe = run('ffmpeg', ['-hide_banner', '-nostats', '-v', 'info', '-i', src, '-af', `${TRIM},loudnorm=I=${LOUDNESS}:TP=${PEAK}:LRA=11:print_format=json`, '-f', 'null', '-']);
  const m = /\{[^{}]*"input_i"[^{}]*\}/.exec(probe.stderr || '');
  let gain = 0;
  let i = NaN;
  let tp = NaN;
  if (m) {
    const meas = JSON.parse(m[0]);
    i = parseFloat(meas.input_i);
    tp = parseFloat(meas.input_tp);
  }
  if (!isFinite(i)) {
    /* a clip under half a second has no integrated loudness: its mean level (RMS) stands in, aimed 4 dB lower than
       the target, about where speech at -16 LUFS sits */
    const vd = run('ffmpeg', ['-hide_banner', '-nostats', '-i', src, '-af', `${TRIM},volumedetect`, '-f', 'null', '-']).stderr || '';
    const mean = parseFloat((/mean_volume:\s*(-?[\d.]+)/.exec(vd) || [])[1]);
    const max = parseFloat((/max_volume:\s*(-?[\d.]+)/.exec(vd) || [])[1]);
    if (isFinite(mean)) i = mean + 4;
    if (!isFinite(tp) && isFinite(max)) tp = max;
  }
  if (isFinite(i)) gain = LOUDNESS - i;
  if (isFinite(tp)) gain = Math.min(gain, PEAK - tp);   /* never past the peak ceiling */
  gain = Math.max(-30, Math.min(30, gain));
  const r = run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-af', `${TRIM},volume=${gain.toFixed(2)}dB,adelay=delays=${HEAD}:all=1,apad=pad_dur=${TAIL / 1000}`, '-ar', String(RATE), '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  if (r.status !== 0) throw new Error(`ffmpeg could not read ${path.basename(src)}: ${(r.stderr || '').trim().split('\n').pop()}`);
  return { gain, s: seconds(wav) };
}
/* lines → one WAV, with the point where each line ends */
function join(parts, wav) {
  const a = [];
  parts.forEach((p) => { a.push('-i', p); });
  const chain = parts.map((p, i) => (i < parts.length - 1 ? `[${i}:a]apad=pad_dur=${GAP}[a${i}]` : `[${i}:a]anull[a${i}]`)).join(';');
  const r = run('ffmpeg', ['-v', 'error', '-y', ...a, '-filter_complex', `${chain};${parts.map((p, i) => `[a${i}]`).join('')}concat=n=${parts.length}:v=0:a=1[out]`, '-map', '[out]', '-ar', String(RATE), '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  if (r.status !== 0) throw new Error(`ffmpeg could not join: ${(r.stderr || '').trim().split('\n').pop()}`);
  const cues = [];
  let at = 0;
  parts.forEach((p, i) => { at += seconds(p); cues.push(Math.round(at * 1000)); if (i < parts.length - 1) at += GAP; });
  return cues;
}
/* the level exam's test tone: three soft notes going up, so the learner sets the volume before the listening part. The
   joined notes are measured and brought to TONE by one gain, about the level of the voices: a tone much quieter than
   the speech (it was 18 dB under it) has the learner turn the volume up too far */
const TONE = -20;       /* LUFS, integrated: a little under the speech's -16, since a pure tone sounds harder at the same loudness */
function tone(wav) {
  const notes = [523.25, 659.25, 783.99];
  const a = [];
  notes.forEach((f) => { a.push('-f', 'lavfi', '-i', `sine=frequency=${f}:duration=0.32:sample_rate=${RATE}`); });
  const chain = notes.map((f, i) => `[${i}:a]afade=t=in:d=0.02,afade=t=out:st=0.24:d=0.08,volume=0.35,apad=pad_dur=${i < notes.length - 1 ? 0.12 : 0.4}[a${i}]`).join(';');
  const joined = `${chain};[a0][a1][a2]concat=n=3:v=0:a=1`;
  const probe = run('ffmpeg', ['-hide_banner', '-nostats', '-v', 'info', ...a, '-filter_complex', `${joined},loudnorm=I=${TONE}:TP=${PEAK}:LRA=11:print_format=json[out]`, '-map', '[out]', '-f', 'null', '-']);
  const m = /\{[^{}]*"input_i"[^{}]*\}/.exec(probe.stderr || '');
  const meas = m ? JSON.parse(m[0]) : {};
  let gain = isFinite(parseFloat(meas.input_i)) ? TONE - parseFloat(meas.input_i) : 0;
  if (isFinite(parseFloat(meas.input_tp))) gain = Math.min(gain, PEAK - parseFloat(meas.input_tp));   /* never past the peak ceiling */
  const r = run('ffmpeg', ['-v', 'error', '-y', ...a, '-filter_complex', `${joined},volume=${gain.toFixed(2)}dB[out]`, '-map', '[out]', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  if (r.status !== 0) throw new Error('ffmpeg could not make the tone');
}
function mp3(wav, out) {
  const r = run('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-codec:a', 'libmp3lame', '-b:a', '32k', '-ar', String(RATE), '-ac', '1', out]);
  if (r.status !== 0) throw new Error(`ffmpeg could not encode: ${(r.stderr || '').trim().split('\n').pop()}`);
  return { ms: Math.round(seconds(out) * 1000), b: fs.readFileSync(out).toString('base64') };
}

/* ---------- the recordings ---------- */
const have = {};
for (const f of fs.readdirSync(FOLDER)) {
  const m = /^(.+)\.([A-Za-z0-9]+)$/.exec(f);
  if (!m || !EXT.includes(m[2].toLowerCase())) continue;
  if (!byKey[m[1]]) { console.log(`  ? ${f}: no clip of that key in the manifest`); continue; }
  have[m[1]] = path.join(FOLDER, f);
}
const wanted = (r) => !ONLY || ONLY.has(r.key);
const missing = [];
const silent = [];     /* the recordings that hold nothing but silence: counted with the missing ones, never made into a clip */
const made = {};       /* key → { ms, kind, voice, b, cues? } */
const wavs = {};       /* key → the prepared WAV (parts of a dialogue are needed again) */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));
const tmp = (key, ext) => path.join(TMP, key.replace(/[^\w.-]/g, '_') + '.' + ext);
let n = 0;
for (const r of rows) {
  if (r.same || r.parts || !wanted(r)) continue;
  if (r.tone) {
    if (DRY) { console.log(`  tone  ${r.key}`); continue; }
    tone(tmp(r.key, 'wav'));
    wavs[r.key] = tmp(r.key, 'wav');
    made[r.key] = Object.assign({ kind: 'human', voice: '-' }, mp3(wavs[r.key], tmp(r.key, 'mp3')));
    continue;
  }
  if (!have[r.key]) { missing.push(r); continue; }
  n++;
  if (DRY) { console.log(`  ${String(n).padStart(4)}  ${r.key}  [${r.voice}, ${kindOf(r.voice)}]  ${path.basename(have[r.key])}`); continue; }
  try {
    const p = prepare(have[r.key], tmp(r.key, 'wav'));
    const left = Math.max(0, Math.round(p.s * 1000) - HEAD - TAIL);   /* what the trim left of the take, without the air put round it */
    if (left < LEAST) {
      /* nothing but silence (it would be a clip of air alone): not made, and reported with the recordings still missing */
      console.log(`  x ${r.key}: ${path.basename(have[r.key])} is silent, ${left} ms left after trimming: no clip made`);
      silent.push(r);
      missing.push(r);
      continue;
    }
    if (p.s < 0.35) console.log(`  ! ${r.key}: only ${(p.s * 1000).toFixed(0)} ms after trimming: is ${path.basename(have[r.key])} silent?`);
    wavs[r.key] = tmp(r.key, 'wav');
    made[r.key] = Object.assign({ kind: kindOf(r.voice), voice: r.voice }, mp3(wavs[r.key], tmp(r.key, 'mp3')));
    process.stdout.write(`  ${String(n).padStart(4)}  ${r.key}  ${made[r.key].ms} ms  gain ${p.gain >= 0 ? '+' : ''}${p.gain.toFixed(1)} dB\n`);
  } catch (e) {
    console.log(`  x ${r.key}: ${e.message}`);
    missing.push(r);
  }
}
/* the dialogues, from their lines */
const incomplete = [];
for (const r of rows) {
  if (!r.parts || !wanted(r)) continue;
  const parts = r.parts.map((k) => { const c = byKey[k]; return c && c.same ? c.same : k; });
  const lacking = parts.filter((k) => !wavs[k]);
  if (lacking.length) { incomplete.push({ row: r, lacking }); continue; }
  if (DRY) { console.log(`  join  ${r.key}  (${parts.length} lines)`); continue; }
  const wav = tmp(r.key, 'wav');
  const cues = join(parts.map((k) => wavs[k]), wav);
  wavs[r.key] = wav;
  made[r.key] = Object.assign({ kind: parts.some((k) => made[k].kind === 'synthetic') ? 'synthetic' : 'human', voice: r.voice, cues }, mp3(wav, tmp(r.key, 'mp3')));
  process.stdout.write(`        ${r.key}  ${made[r.key].ms} ms, ${parts.length} lines\n`);
}

/* ---------- the files ---------- */
const groups = {};
rows.forEach((r) => { (groups[r.file] = groups[r.file] || []).push(r); });
const written = [];
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const today = new Date().toISOString().slice(0, 10);
for (const file of Object.keys(groups).sort()) {
  const list = groups[file];
  const own = list.filter((r) => !r.same && made[r.key]);
  const alias = list.filter((r) => r.same && made[r.same]);
  if (!own.length && !alias.length) continue;
  if (DRY) { console.log(`  would write ${file}: ${own.length} clips, ${alias.length} shared`); continue; }
  const used = {};
  [...own, ...alias].forEach((r) => { used[r.voice] = true; });
  const who = Object.keys(used).filter((v) => v !== '-' && !v.includes('+')).map((v) => { const c = voiceCredit(v); return `${v} ${c.name || '?'}${c.kind === 'synthetic' ? ' (synthetic' + (c.model ? ', ' + c.model : '') + ')' : ''}${c.licence ? ', ' + c.licence : ''}`; });
  const lines = [
    `/* Epu'ã sound, ${file.replace(/^gn-sound-|\.js$/g, '')}: ${own.length} clips${alias.length ? ` (+ ${alias.length} shared with another key)` : ''}, made by tools/make-sound.mjs on ${today} — do not edit by hand.`,
    `   Voices: ${who.join('; ') || 'not stated'}. Each clip: { ms, kind: 'human' | 'synthetic', voice, b: MP3 as base64${own.some((r) => made[r.key].cues) ? ', cues: where each line ends' : ''} }. Played by gn-sound.js. */`,
    '(function () {',
    'var c = window.__gnClips = window.__gnClips || {};',
  ];
  own.sort((a, b) => (a.key < b.key ? -1 : 1)).forEach((r) => {
    const m = made[r.key];
    lines.push(`c['${esc(r.key)}'] = { ms: ${m.ms}, kind: '${m.kind}', voice: '${esc(m.voice)}'${m.cues ? ', cues: [' + m.cues.join(', ') + ']' : ''}, b: '${m.b}' };`);
  });
  alias.sort((a, b) => (a.key < b.key ? -1 : 1)).forEach((r) => {
    const m = made[r.same];
    const here = byKey[r.same] && byKey[r.same].file === file;
    /* the same recording under its other name: a reference inside one file, a copy across files (the other may not be loaded) */
    lines.push(here ? `c['${esc(r.key)}'] = c['${esc(r.same)}'];` : `c['${esc(r.key)}'] = { ms: ${m.ms}, kind: '${m.kind}', voice: '${esc(m.voice)}', b: '${m.b}' };`);
  });
  lines.push('})();');
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, file), lines.join('\n') + '\n');
  written.push(`${file} (${own.length} clips${alias.length ? ' + ' + alias.length + ' shared' : ''}, ${Math.round(fs.statSync(path.join(OUT, file)).size / 1024)} KB)`);
}
/* the index: every sound file that exists in the output folder, and the credits of the voices (kept across runs) */
if (!DRY) {
  const index = path.join(OUT, 'gn-sound-index.js');
  let known = {};
  if (fs.existsSync(index)) { try { known = JSON.parse((/__gnSoundVoices = (\{[\s\S]*?\});/.exec(fs.readFileSync(index, 'utf8')) || [, '{}'])[1]); } catch (e) { known = {}; } }
  Object.keys(made).forEach((k) => { const v = made[k].voice; if (v && v !== '-' && !v.includes('+')) known[v] = voiceCredit(v); });
  const files = fs.readdirSync(OUT).filter((f) => /^gn-sound-(?:[abc][12]-(?:u\d\d|x)|pl|sp)\.js$/.test(f)).sort();
  fs.writeFileSync(index, [
    '/* Which sound files exist, for the engine (gn-course.js fetches a unit\'s file, gn-sound-a1-u01.js, when the unit is in',
    '   use) and the app build (which ships them, stored on the phone after first use). Made by tools/make-sound.mjs from the',
    '   files it writes next to this one: do not edit by hand. No file is listed until recordings exist. */',
    `window.__gnSoundFiles = ${JSON.stringify(files)};`,
    `window.__gnSoundVoices = ${JSON.stringify(known)};`,
    '',
  ].join('\n'));
  written.push(`gn-sound-index.js (${files.length} file${files.length === 1 ? '' : 's'})`);
}

/* ---------- the report ---------- */
const count = Object.keys(made).length;
const outName = path.relative(ROOT, OUT).startsWith('..') ? OUT : path.relative(ROOT, OUT);
console.log(`\n${DRY ? 'would make' : 'made'} ${DRY ? n : count} clips from ${FOLDER}${written.length ? '; written to ' + outName + '/: ' + written.join(', ') : ''}${ONLY ? ' (--only: the files hold these clips alone)' : ''}`);
if (incomplete.length) console.log(`${incomplete.length} clip${incomplete.length === 1 ? '' : 's'} not put together, lines missing: ` + incomplete.map((x) => `${x.row.key} (${x.lacking.join(', ')})`).join('; '));
if (silent.length) console.log(`${silent.length} recording${silent.length === 1 ? ' is' : 's are'} silent (under ${LEAST} ms left after trimming) and made no clip: ` + silent.map((r) => `${r.key} (${path.basename(have[r.key])})`).join(', '));
if (missing.length) {
  const by = {};
  missing.forEach((r) => { by[r.voice] = (by[r.voice] || 0) + 1; });
  console.log(`${missing.length} of the manifest's ${rows.filter((r) => !r.same && !r.parts && !r.tone && wanted(r)).length} recordings still missing (${Object.entries(by).map(([v, c]) => `${v} ${c}`).join(', ')}${silent.length ? `; ${silent.length} of them recorded but silent` : ''}):`);
  missing.slice(0, 40).forEach((r) => console.log(`  - ${r.key}  [${r.voice}]  ${r.text}  (${r.where})${silent.includes(r) ? '  — the take is silent' : ''}`));
  if (missing.length > 40) console.log(`  … and ${missing.length - 40} more (see the manifest's order column)`);
} else if (!ONLY) console.log('every recording of the manifest is in: nothing is missing');
