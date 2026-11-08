// Makes the fixture "recordings" the sound path is tested with (tools/make-sound.mjs, check/sound-test.js): one short
// tone per clip key, each a different pitch, as 8 kHz mono WAV, named by the keys of sound/A1/manifest.json: the whole
// of A1 unit 1 day 1 (words, pairs, examples, the listening lines), the first speaking pair and sign, the first
// placement line and the exam's first item. They stand in for a voice and are never shipped: the test builds them into
// epua-app/dist-sound, never into docs/. Usage: node check/fixtures/sound/make-fixtures.mjs   (needs ffmpeg)
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
const rows = manifest.clips.filter((r) => r.order && !r.same && !r.parts && !r.tone && WANT(r));
for (const f of fs.readdirSync(HERE)) if (f.endsWith('.wav')) fs.unlinkSync(path.join(HERE, f));
rows.forEach((r, i) => {
  const hz = 330 + i * 23;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `sine=frequency=${hz}:duration=0.22:sample_rate=8000`, '-af', 'afade=t=in:d=0.02,afade=t=out:st=0.16:d=0.06,volume=0.5', '-ac', '1', '-c:a', 'pcm_s16le', path.join(HERE, r.key + '.wav')]);
});
fs.writeFileSync(path.join(HERE, 'voices.json'), JSON.stringify({ kind: 'human', licence: 'CC BY 4.0', note: 'test fixtures: short tones, not voices', voices: { F: { name: 'Fixture F', licence: 'CC BY 4.0' }, M: { name: 'Fixture M', licence: 'CC BY 4.0' }, N: { name: 'Fixture N', licence: 'CC BY 4.0' } } }, null, 1) + '\n');
console.log(`${rows.length} fixture tones written to ${path.relative(ROOT, HERE)} (${rows.map((r) => r.key).join(', ')})`);
