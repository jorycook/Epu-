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
// zip, unpacked, the owner's own files, or the folder tools/make-tts.py keeps the synthetic voice in, sound/A1/voz,
// whose clips are FLAC and which comes with the manifest to give here: sound/A1/voz/manifest.json), and may hold
// voices.json, the credits: { "F": { "name": "…", "licence": "CC BY 4.0" }, "M": …, "N": … } (the studio writes it), or
// for a synthetic set { "kind": "synthetic", "model": "…", "licence": "…", "voices": { … } } (tools/make-tts.py writes
// it). --kind marks every clip of this run; a voice's own kind in voices.json wins. Needs ffmpeg and ffprobe.
//
// Each recording is mixed down to mono, trimmed of its silence (what is quieter than -45 dB at either end, 60 ms of it
// kept at the start), brought to the same loudness by one gain (nothing is compressed), given 80 ms of air before and
// 150 ms after, and encoded as mono MP3 at 32 kb/s and 24 kHz, the format of Yaoki's clips (every browser plays MP3;
// Safari on iOS does not decode Opus for Web Audio). The loudness is -16 LUFS, the usual target on a phone, by the
// measure of BS.1770 taken on the trimmed mono mix as if it played in a loop (loudnessOf: a word of 300 ms has no
// loudness by the standard's blocks of 400 ms), unless the peak ceiling comes first: no clip peaks over -1.5 dBTP, and
// the peak is taken on the clip's MP3 decoded again (mp3). A take whose peaks stand more than 14.5 dB over its
// loudness cannot have both, so it stops at the ceiling and stays quieter than the target: the run says how many did.
// A clip's ms is the length of its decoded MP3. A take that is silence all along (under 100 ms left once trimmed)
// makes no clip: it is reported with the recordings still missing. A clip the manifest puts together from lines (a
// dialogue) is the lines in order with a quarter second between them; the test tone of the level exam (c.check) is
// made here, at about the level of the voices (-20 LUFS). A row with "same" is the recording of another key,
// registered under both names. Only the keys a screen can ask for get a clip (asked): a line makes none of its own
// (it is heard inside the clip put together from it), nor does the word of a sound pair that does not play. Whatever
// recording is missing is reported at the end, and a file is written only for a group that has clips. A file that
// would change in nothing but the day in its first line is left as it is: the app stores each file on the phone under
// a hash of its content, so a run that changes one unit's clips leaves the other units' files, and their hashes, alone.
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
const LOUDNESS = -16;   /* LUFS, integrated (loudnessOf) */
const PEAK = -1.5;      /* dBTP, of the decoded MP3 */
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
/* sound as numbers: what ffmpeg makes of a file (with these arguments), as 32-bit floats */
function samples(a) {
  const r = spawnSync('ffmpeg', ['-v', 'error', ...a, '-f', 'f32le', '-'], { maxBuffer: 1024 * 1024 * 1024 });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`ffmpeg: ${String(r.stderr || '').trim().split('\n').pop()}`);
  const b = r.stdout;
  return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.length - (b.length % 4)));
}
/* The loudness of a take, in LUFS: the measure of ITU-R BS.1770 (the K weighting, blocks of 400 ms a tenth of a second
   apart, a gate at -70 LUFS and one 10 LU under the mean of what passes it), taken on the trimmed take as if it played
   in a loop until three seconds had passed. A take of three seconds or more is measured as it is, which is the standard
   itself. The loop is what makes the measure work on a word of 300 ms: the standard's blocks of 400 ms do not fit in
   it. ffmpeg's loudnorm, which the tool measured with before, gives no loudness at all for a clip under about half a
   second; the mean level stood in, and those words came out 4 LU quieter than the rest (po at -22 LUFS where the
   words of half a second and more were at -18; the 13 clips under half a second of the synthetic voice rose by 3.7
   LU). Measured on the 440 takes of sound/A1/voz: looped, a take sits 3.1 to 3.4 LU under its loud tenths of a
   second (the 90th percentile of its 100 ms blocks) whether it lasts 0.3 s or 5 s, and for the 38 takes of 2.5 s or
   more the looped measure and the standard differ by 0.0 LU at the median, 0.24 at most. */
const KFS = 48000;        /* the rate the K weighting's coefficients are given for */
const KW = [[1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585], [1, -2, 1, -1.99004745483398, 0.99007225036621]];
function kWeighted(x, passes) {
  /* the two filters of BS.1770 in a row; with passes = 2 the take runs through twice and the second pass is kept: what
     the filters give once the loop has been going round */
  const y = new Float64Array(x.length);
  const st = KW.map(() => [0, 0, 0, 0]);
  for (let p = 0; p < passes; p++) {
    for (let n = 0; n < x.length; n++) {
      let v = x[n];
      for (let k = 0; k < KW.length; k++) {
        const c = KW[k];
        const s = st[k];
        const o = c[0] * v + c[1] * s[0] + c[2] * s[1] - c[3] * s[2] - c[4] * s[3];
        s[1] = s[0]; s[0] = v; s[3] = s[2]; s[2] = o;
        v = o;
      }
      y[n] = v;
    }
  }
  return y;
}
const toLufs = (meanSquare) => (meanSquare > 0 ? -0.691 + 10 * Math.log10(meanSquare) : -Infinity);
function loudnessOf(x) {
  if (!x.length) return -Infinity;
  const reps = Math.ceil((3 * KFS) / x.length);
  const y = kWeighted(x, reps > 1 ? 2 : 1);
  const total = y.length * reps;
  /* the energy up to each sample of one round of the loop; a block's energy is a difference of two of these */
  const cum = new Float64Array(y.length + 1);
  for (let n = 0; n < y.length; n++) cum[n + 1] = cum[n] + y[n] * y[n];
  const upTo = (n) => Math.floor(n / y.length) * cum[y.length] + cum[n % y.length];
  const block = Math.round(0.4 * KFS);
  const hop = Math.round(0.1 * KFS);
  const z = [];
  for (let a = 0; a + block <= total; a += hop) z.push((upTo(a + block) - upTo(a)) / block);
  if (!z.length) z.push(cum[y.length] / y.length);
  const mean = (list) => list.reduce((s, v) => s + v, 0) / list.length;
  const loud = z.filter((v) => toLufs(v) > -70);
  if (!loud.length) return -Infinity;
  const gate = toLufs(mean(loud)) - 10;
  const kept = loud.filter((v) => toLufs(v) > gate);
  return toLufs(mean(kept.length ? kept : loud));
}
const db = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
const peakOf = (x) => { let m = 0; for (let n = 0; n < x.length; n++) { const v = Math.abs(x[n]); if (v > m) m = v; } return m; };
/* a clip as it ships, decoded: how long it is, by its samples, and its true peak (the peak of the wave between the
   samples too: ffmpeg's resampler at four times the rate, the oversampling BS.1770 asks for) */
function decoded(file) {
  const own = samples(['-i', file, '-ac', '1', '-ar', String(RATE)]);
  const fine = samples(['-i', file, '-ac', '1', '-ar', String(4 * RATE)]);
  return { ms: Math.round((own.length / RATE) * 1000), tp: db(Math.max(peakOf(own), peakOf(fine))) };
}
/* one recording → a trimmed, levelled, padded mono WAV at 24 kHz. The gain is the one that brings the take's loudness
   to the target, or less when the take's own peak would pass the ceiling (fit() then sees to the peak of the MP3) */
function prepare(src, wav) {
  let x;
  try { x = samples(['-i', src, '-af', TRIM, '-ar', String(KFS), '-ac', '1']); } catch (e) { throw new Error(`ffmpeg could not read ${path.basename(src)}: ${e.message}`); }
  const i = loudnessOf(x);
  const tp = db(peakOf(x));
  let gain = isFinite(i) ? LOUDNESS - i : 0;
  const wanted = gain;
  if (isFinite(tp)) gain = Math.min(gain, PEAK - tp);   /* never past the peak ceiling */
  gain = Math.max(-30, Math.min(30, gain));
  const r = run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-af', `${TRIM},volume=${gain.toFixed(2)}dB,adelay=delays=${HEAD}:all=1,apad=pad_dur=${TAIL / 1000}`, '-ar', String(RATE), '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  if (r.status !== 0) throw new Error(`ffmpeg could not read ${path.basename(src)}: ${(r.stderr || '').trim().split('\n').pop()}`);
  return { gain, short: Math.max(0, wanted - gain), lufs: i, s: seconds(wav) };
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
/* a prepared WAV → the clip, as MP3. Two things are taken from the MP3 decoded again, not from the WAV: its length (ms:
   the file's own duration counts the encoder's padding and was 61 ms longer than what a player gets), and its true
   peak. At 32 kb/s the MP3 peaks up to a decibel higher than the WAV it was made from, so a WAV that kept the ceiling
   gave a clip that passed it: fit() brings the WAV down by what the MP3 is over, and a tenth of a decibel more, and
   encodes again until the decoded clip holds the ceiling. The WAV itself is changed, so a dialogue put together from
   it has the line at the level of the line's own clip. One gain, as before: nothing is compressed */
const fitted = [];      /* what fit() had to lower: { wav, by } */
let highest = -Infinity;  /* the highest true peak among the clips made, dBTP */
function mp3(wav, out) {
  let lowered = 0;
  let d = null;
  for (let turn = 0; turn < 8; turn++) {
    const r = run('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-codec:a', 'libmp3lame', '-b:a', '32k', '-ar', String(RATE), '-ac', '1', out]);
    if (r.status !== 0) throw new Error(`ffmpeg could not encode: ${(r.stderr || '').trim().split('\n').pop()}`);
    d = decoded(out);
    if (!(d.tp > PEAK)) break;
    const by = d.tp - PEAK + 0.1;
    const lower = wav.replace(/\.wav$/, '.fit.wav');
    const f = run('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-af', `volume=${(-by).toFixed(2)}dB`, '-c:a', 'pcm_s16le', lower]);
    if (f.status !== 0) throw new Error(`ffmpeg could not lower the peak: ${(f.stderr || '').trim().split('\n').pop()}`);
    fs.renameSync(lower, wav);
    lowered += by;
  }
  if (d.tp > PEAK) throw new Error(`the true peak stays at ${d.tp.toFixed(2)} dBTP, over the ceiling of ${PEAK}`);
  if (lowered) fitted.push({ wav, by: lowered });
  if (d.tp > highest) highest = d.tp;
  return { ms: d.ms, tp: d.tp, lowered, b: fs.readFileSync(out).toString('base64') };
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
/* The keys a screen can ask the player for (tools/sound-list.mjs lists every clip; the screens ask for these): a clip put
   together from lines, the tone, and every recording but two kinds: a line of a put-together clip (<key>.l<n> and
   <key>.l<n>.slow), which is only ever heard inside its clip, and the word of a sound pair that does not play (a row
   with "unused"). A recording that no such key holds, neither its own nor one that shares it ("same"), makes no clip
   of its own: its sound is inside the put-together clip already, or nothing plays it. Shipped all the same, as they
   were, those recordings took a third of the files of A1 (1.32 of 4.08 MB of MP3). */
const LINE = /\.l\d+(?:\.slow)?$/;
const asked = (r) => !!(r.parts || r.tone) || (!r.unused && !LINE.test(r.key));
const direct = new Set();   /* the recordings a key the screens ask for holds */
rows.forEach((r) => { if (!r.parts && !r.tone && asked(r)) direct.add(r.same || r.key); });
const taken = {};      /* key → { kind, voice } of every recording that was read: a dialogue is as synthetic as its lines */
const missing = [];
const silent = [];     /* the recordings that hold nothing but silence: counted with the missing ones, never made into a clip */
const made = {};       /* key → { ms, kind, voice, b, cues? } */
const held = [];       /* the recordings the peak ceiling keeps under the loudness target: { key, under: LU } */
const wavs = {};       /* key → the prepared WAV (parts of a dialogue are needed again) */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'epua-sound-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));
const tmp = (key, ext) => path.join(TMP, key.replace(/[^\w.-]/g, '_') + '.' + ext);
let n = 0;
for (const r of rows) {
  if (r.same || r.parts || !wanted(r)) continue;
  if (r.tone) {
    if (DRY) { console.log(`  tone  ${r.key}`); made[r.key] = { kind: 'human', voice: '-' }; continue; }
    tone(tmp(r.key, 'wav'));
    wavs[r.key] = tmp(r.key, 'wav');
    made[r.key] = Object.assign({ kind: 'human', voice: '-' }, mp3(wavs[r.key], tmp(r.key, 'mp3')));
    continue;
  }
  if (!have[r.key]) { missing.push(r); continue; }
  n++;
  if (DRY) {
    /* a dry run reads no recording: it takes each one that is there as good (a silent take shows only in a real run) */
    console.log(`  ${String(n).padStart(4)}  ${r.key}  [${r.voice}, ${kindOf(r.voice)}]  ${path.basename(have[r.key])}${direct.has(r.key) ? '' : '  (no clip of its own: no screen asks for this key)'}`);
    wavs[r.key] = have[r.key];
    if (direct.has(r.key)) made[r.key] = { kind: kindOf(r.voice), voice: r.voice };
    continue;
  }
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
    taken[r.key] = { kind: kindOf(r.voice), voice: r.voice };
    const own = direct.has(r.key);   /* a clip of its own, or only a line inside the clip that is put together from it */
    if (own) made[r.key] = Object.assign({ kind: kindOf(r.voice), voice: r.voice }, mp3(wavs[r.key], tmp(r.key, 'mp3')));
    const lowered = own ? made[r.key].lowered : 0;
    const under = p.short + lowered;   /* how far the peak ceiling keeps the clip under the loudness target */
    if (under > 0.05) held.push({ key: r.key, under });
    process.stdout.write(`  ${String(n).padStart(4)}  ${r.key}  ${own ? made[r.key].ms : Math.round(p.s * 1000)} ms  take ${p.lufs.toFixed(1)} LUFS  gain ${p.gain - lowered >= 0 ? '+' : ''}${(p.gain - lowered).toFixed(1)} dB${under > 0.05 ? `  (the peak ceiling keeps it ${under.toFixed(1)} LU under the target)` : ''}${own ? '' : '  (no clip of its own: no screen asks for this key)'}\n`);
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
  if (DRY) { console.log(`  join  ${r.key}  (${parts.length} lines)`); made[r.key] = { kind: 'human', voice: r.voice, cues: [] }; continue; }
  const wav = tmp(r.key, 'wav');
  const cues = join(parts.map((k) => wavs[k]), wav);
  wavs[r.key] = wav;
  made[r.key] = Object.assign({ kind: parts.some((k) => taken[k] && taken[k].kind === 'synthetic') ? 'synthetic' : 'human', voice: r.voice, cues }, mp3(wav, tmp(r.key, 'mp3')));
  process.stdout.write(`        ${r.key}  ${made[r.key].ms} ms, ${parts.length} lines\n`);
}

/* ---------- the files ---------- */
const groups = {};
rows.forEach((r) => { (groups[r.file] = groups[r.file] || []).push(r); });
const written = [];
const wrote = {};
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const today = new Date().toISOString().slice(0, 10);
const asItWas = [];     /* the files that are byte for byte what they were: nothing in them changed, so they keep their date */
const undated = (s) => s.replace(/ on \d{4}-\d{2}-\d{2} — do not edit by hand\./, ' on (a day) — do not edit by hand.');   /* a file's text without the day in its first line */
for (const file of Object.keys(groups).sort()) {
  const list = groups[file];
  /* what the file registers: for each clip that was made, the keys of this file that the screens ask for and that hold
     it. The first carries the MP3 (the clip's own key, when it is among them), the others point at that one: the same
     recording under another name. A key of another file gets a copy of its own there (the other file may not be loaded) */
  const holders = {};
  list.forEach((r) => { const k = r.same || r.key; if (made[k] && asked(r)) (holders[k] = holders[k] || []).push(r); });
  const own = [];
  const alias = [];
  Object.keys(holders).forEach((k) => {
    const them = holders[k].sort((a, b) => (a.key === k ? -1 : b.key === k ? 1 : a.key < b.key ? -1 : 1));
    them.forEach((r, i) => (i === 0 ? own.push({ r, m: made[k] }) : alias.push({ r, of: them[0].key })));
  });
  if (!own.length) continue;
  if (DRY) { console.log(`  would write ${file}: ${own.length} clips, ${alias.length} shared`); continue; }
  const used = {};
  own.forEach((x) => String(x.m.voice).split('+').forEach((v) => { used[v] = true; }));
  const who = Object.keys(used).filter((v) => v !== '-').sort().map((v) => { const c = voiceCredit(v); return `${v} ${c.name || '?'}${c.kind === 'synthetic' ? ' (synthetic' + (c.model ? ', ' + c.model : '') + ')' : ''}${c.licence ? ', ' + c.licence : ''}`; });
  const lines = [
    `/* Epu'ã sound, ${file.replace(/^gn-sound-|\.js$/g, '')}: ${own.length} clips${alias.length ? ` (+ ${alias.length} shared with another key)` : ''}, made by tools/make-sound.mjs on ${today} — do not edit by hand.`,
    `   Voices: ${who.join('; ') || 'not stated'}. Each clip: { ms, kind: 'human' | 'synthetic', voice, b: MP3 as base64${own.some((x) => x.m.cues) ? ', cues: where each line ends' : ''} }. Played by gn-sound.js. */`,
    '(function () {',
    'var c = window.__gnClips = window.__gnClips || {};',
  ];
  own.sort((a, b) => (a.r.key < b.r.key ? -1 : 1)).forEach((x) => {
    const m = x.m;
    lines.push(`c['${esc(x.r.key)}'] = { ms: ${m.ms}, kind: '${m.kind}', voice: '${esc(m.voice)}'${m.cues ? ', cues: [' + m.cues.join(', ') + ']' : ''}, b: '${m.b}' };`);
  });
  alias.sort((a, b) => (a.r.key < b.r.key ? -1 : 1)).forEach((x) => { lines.push(`c['${esc(x.r.key)}'] = c['${esc(x.of)}'];`); });
  lines.push('})();');
  fs.mkdirSync(OUT, { recursive: true });
  /* A file whose clips are what they were keeps the day it was made, and with it every byte. The app stores a sound file
     on the phone under a hash of its content (epua-app/build.mjs, sw.js): written again with nothing new but the day's
     date, every file would be fetched again by every phone after a rebuild that changed one clip, or none */
  const text = lines.join('\n') + '\n';
  const target = path.join(OUT, file);
  const same = fs.existsSync(target) && undated(fs.readFileSync(target, 'utf8')) === undated(text);
  if (same) asItWas.push(file);
  else fs.writeFileSync(target, text);
  wrote[file] = true;
  written.push(`${file} (${own.length} clips${alias.length ? ' + ' + alias.length + ' shared' : ''}, ${Math.round(fs.statSync(target).size / 1024)} KB${same ? ', as it was' : ''})`);
}
/* a whole run leaves no file behind that it did not write: a group whose clips are all gone (silent now) has no file */
if (!DRY && !ONLY) {
  Object.keys(groups).forEach((file) => {
    if (file && !wrote[file] && fs.existsSync(path.join(OUT, file))) { fs.unlinkSync(path.join(OUT, file)); console.log(`  ${file}: none of its clips is left, the file was removed`); }
  });
}
/* the index: every sound file that exists in the output folder, and the credits of the voices (kept across runs) */
if (!DRY) {
  const index = path.join(OUT, 'gn-sound-index.js');
  let known = {};
  if (fs.existsSync(index)) { try { known = JSON.parse((/__gnSoundVoices = (\{[\s\S]*?\});/.exec(fs.readFileSync(index, 'utf8')) || [, '{}'])[1]); } catch (e) { known = {}; } }
  Object.keys(taken).forEach((k) => { const v = taken[k].voice; if (v && v !== '-' && !v.includes('+')) known[v] = voiceCredit(v); });
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
console.log(`\n${DRY ? 'would make' : 'made'} ${count} clips from ${DRY ? `the ${n} recordings of ` : ''}${FOLDER}${written.length ? '; written to ' + outName + '/: ' + written.join(', ') : ''}${ONLY ? ' (--only: the files hold these clips alone)' : ''}`);
if (!DRY && Object.keys(wrote).length) console.log(`${asItWas.length} of the ${Object.keys(wrote).length} sound files are byte for byte what they were, their date too${asItWas.length ? ' (no clip in them changed: a phone that has them keeps them)' : ''}${asItWas.length < Object.keys(wrote).length ? `; written anew: ${Object.keys(wrote).filter((f) => !asItWas.includes(f)).sort().join(', ')}` : ''}`);
if (!DRY && count) {
  held.sort((a, b) => b.under - a.under);
  /* one gain cannot bring a take to the target when its peaks stand more than the target's distance from the ceiling over
     its loudness (14.5 dB for -16 LUFS and -1.5 dBTP): such a take stops at the ceiling and stays quieter. How many, how
     far, and the target that nearly all of this folder's takes would reach, for whoever sets LOUDNESS */
  const medianOf = (list) => list.slice().sort((a, b) => a - b)[Math.floor(list.length / 2)];
  const levelled = Object.keys(taken).length;   /* the recordings that were read and levelled */
  let within = '';
  for (let lower = 1; lower <= 8 && !within; lower++) { const left = held.filter((h) => h.under > lower + 0.05).length; if (left <= levelled * 0.05) within = `; a target of ${LOUDNESS - lower} LUFS would be out of reach for ${left}`; }
  const inner = Object.keys(taken).filter((k) => !made[k]);
  if (inner.length) console.log(`${inner.length} of the ${levelled} recordings make no clip of their own, because no screen asks for their key: ${inner.filter((k) => LINE.test(k)).length} lines, heard inside the clips put together from them, and ${inner.filter((k) => !LINE.test(k)).length} words of sound pairs that do not play`);
  console.log(`levels: ${levelled - held.length} of the ${levelled} recordings are at ${LOUDNESS} LUFS (BS.1770, measured on the take in a loop)${held.length ? `; the peak ceiling keeps ${held.length} under it, by ${medianOf(held.map((h) => h.under)).toFixed(1)} LU at the median, ${held.filter((h) => h.under > 2).length} by more than 2 LU (the furthest: ${held.slice(0, 5).map((h) => `${h.key} ${h.under.toFixed(1)}`).join(', ')})${within}` : ''}. `
    + `The highest true peak of a clip, decoded from its MP3: ${highest.toFixed(2)} dBTP (ceiling ${PEAK})${fitted.length ? `; ${fitted.length} clip${fitted.length === 1 ? ' was' : 's were'} lowered after encoding, by ${Math.max(...fitted.map((f) => f.by)).toFixed(1)} dB at most, because the MP3 peaked higher than its WAV` : ''}. ms is the length of each decoded MP3.`);
}
if (incomplete.length) console.log(`${incomplete.length} clip${incomplete.length === 1 ? '' : 's'} not put together, lines missing: ` + incomplete.map((x) => `${x.row.key} (${x.lacking.join(', ')})`).join('; '));
if (silent.length) console.log(`${silent.length} recording${silent.length === 1 ? ' is' : 's are'} silent (under ${LEAST} ms left after trimming) and made no clip: ` + silent.map((r) => `${r.key} (${path.basename(have[r.key])})`).join(', '));
if (missing.length) {
  const by = {};
  missing.forEach((r) => { by[r.voice] = (by[r.voice] || 0) + 1; });
  console.log(`${missing.length} of the manifest's ${rows.filter((r) => !r.same && !r.parts && !r.tone && wanted(r)).length} recordings still missing (${Object.entries(by).map(([v, c]) => `${v} ${c}`).join(', ')}${silent.length ? `; ${silent.length} of them recorded but silent` : ''}):`);
  missing.slice(0, 40).forEach((r) => console.log(`  - ${r.key}  [${r.voice}]  ${r.text}  (${r.where})${silent.includes(r) ? '  — the take is silent' : ''}`));
  if (missing.length > 40) console.log(`  … and ${missing.length - 40} more (see the manifest's order column)`);
} else if (!ONLY) console.log('every recording of the manifest is in: nothing is missing');
