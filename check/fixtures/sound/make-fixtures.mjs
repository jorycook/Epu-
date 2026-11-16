// Makes the fixture "recordings" the sound path is tested with (tools/make-sound.mjs, check/sound-test.js): one short
// tone per clip key, each a different pitch, as 8 kHz mono WAV, named by the keys of sound/A1/manifest.json: the whole
// of A1 unit 1 day 1 (words, pairs, examples, the listening lines), the first speaking pair and sign, the first
// placement line and the exam's first item (its own lines and the line a lesson says already, so the item is put
// together whole). Seven of them are other takes, for what make-sound.mjs must get right (TAKES below): a 1 s mono
// take, the same take in stereo and with the voice on one channel only (the three must come out equally loud), a take
// that is silence all along (it must make no clip), a fifth of a second of the same note as the 1 s take (a short
// word must come out as loud as a long one), a take that peaks like a voice (its MP3 peaks higher than its WAV: the
// clip must hold the peak ceiling all the same) and a take kept as FLAC, as the synthetic voice's are in
// sound/A1/voz. They stand in for a voice and are never shipped: the test builds them into epua-app/dist-sound, never
// into docs/. Run it again whenever sound/A1/manifest.json is made again (the keys a recording is named by can
// change). Usage: node check/fixtures/sound/make-fixtures.mjs   (needs ffmpeg)
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'sound/A1/manifest.json'), 'utf8'));
/* the speaking game's words and signs are often a unit's words said already: their recordings are those keys */
const spoken = new Set(manifest.clips.filter((r) => /^[ps]\d/.test(r.key) && !r.parts && !r.tone).map((r) => r.same || r.key));
const WANT = (r) => /^a1u01d1\./.test(r.key) || spoken.has(r.key) || ['pl.1.l0'].includes(r.key) || /^a1x\.4\.l\d$/.test(r.key);
/* the lines the exam's first item is put together from: its own, and one a lesson says already (a row with "same").
   That one comes after the rest, so the others keep their pitch */
const exam = new Set((manifest.clips.find((r) => r.key === 'a1x.4') || {}).parts || []);
const recorded = manifest.clips.filter((r) => r.order && !r.same && !r.parts && !r.tone);
const rows = recorded.filter(WANT).concat(recorded.filter((r) => !WANT(r) && exam.has(r.key)));
/* the takes that are not the short mono tone (check/sound-test.js names the same keys): words of the first scene that
   no other key shares. LONG is a second of tone, long enough to have an integrated loudness, shaped like the others */
const LONG = ['-f', 'lavfi', '-i', 'sine=frequency=440:duration=1:sample_rate=8000'];
const SHAPE = 'afade=t=in:d=0.02,afade=t=out:st=0.94:d=0.06,volume=0.5';
/* a take that peaks like a voice: sixty harmonics of a low note nearly in phase, a train of sharp pulses 18 dB over
   its own loudness. Brought to the loudness target it would pass the peak ceiling, so the ceiling sets its level; and
   its MP3 at 32 kb/s peaks higher than the WAV it is made from (the clip came out at -0.8 dBTP for a ceiling of -1.5
   before make-sound.mjs took the peak from the decoded MP3) */
const PULSES = (() => {
  const terms = [];
  for (let h = 1; h <= 60; h++) terms.push(`cos(2*PI*${h * 97}*t+${(0.2 * Math.PI * Math.sin(h * h * 1.7)).toFixed(4)})`);
  return ['-f', 'lavfi', '-i', `aevalsrc='(${terms.join('+')})/60':s=16000:d=1`, '-af', SHAPE, '-ac', '1'];
})();
const TAKES = {
  'a1u01d1.w.maitei': [...LONG, '-af', SHAPE, '-ac', '1'],                                  /* mono, the reference */
  'a1u01d1.w.jaryi': ['-f', 'lavfi', '-i', 'sine=frequency=440:duration=0.22:sample_rate=8000', '-af', 'afade=t=in:d=0.02,afade=t=out:st=0.16:d=0.06,volume=0.5', '-ac', '1'],   /* the same note for a fifth of a second: a short word */
  'a1u01d1.w.karai': PULSES,                                                                 /* peaks like a voice: the ceiling sets its level */
  'a1u01d1.w.pyhareve': [...LONG, '-af', `${SHAPE},pan=stereo|c0=c0|c1=c0`],                /* stereo, the voice on both channels */
  'a1u01d1.w.kaaru': [...LONG, '-af', `${SHAPE},pan=stereo|c0=c0|c1=0*c0`],                 /* stereo, the voice on the left channel only */
  'a1u01d1.w.ipora': ['-f', 'lavfi', '-i', 'sine=frequency=120:duration=1:sample_rate=8000', '-af', 'volume=0.008', '-ac', '1'],   /* silent: a hum at -60 dB, under the trim threshold all along */
};
const FLAC = ['a1u01d1.w.jajotopata'];   /* kept as FLAC: make-sound.mjs must read it like a WAV */
const lost = Object.keys(TAKES).concat(FLAC).filter((k) => !rows.some((r) => r.key === k));
if (lost.length) { console.error(`the manifest no longer lists ${lost.join(', ')} as a recording of its own: name other keys in TAKES (and in check/sound-test.js)`); process.exit(1); }
for (const f of fs.readdirSync(HERE)) if (f.endsWith('.wav') || f.endsWith('.flac')) fs.unlinkSync(path.join(HERE, f));
rows.forEach((r, i) => {
  const hz = 330 + i * 23;
  const take = TAKES[r.key] || ['-f', 'lavfi', '-i', `sine=frequency=${hz}:duration=0.22:sample_rate=8000`, '-af', 'afade=t=in:d=0.02,afade=t=out:st=0.16:d=0.06,volume=0.5', '-ac', '1'];
  if (FLAC.includes(r.key)) execFileSync('ffmpeg', ['-v', 'error', '-y', ...take, '-c:a', 'flac', '-sample_fmt', 's16', path.join(HERE, r.key + '.flac')]);
  else execFileSync('ffmpeg', ['-v', 'error', '-y', ...take, '-c:a', 'pcm_s16le', path.join(HERE, r.key + '.wav')]);
});
fs.writeFileSync(path.join(HERE, 'voices.json'), JSON.stringify({ kind: 'human', licence: 'CC BY 4.0', note: 'test fixtures: short tones, not voices', voices: { F: { name: 'Fixture F', licence: 'CC BY 4.0' }, M: { name: 'Fixture M', licence: 'CC BY 4.0' }, N: { name: 'Fixture N', licence: 'CC BY 4.0' } } }, null, 1) + '\n');
console.log(`${rows.length} fixture tones written to ${path.relative(ROOT, HERE)} (${rows.map((r) => r.key).join(', ')})`);
