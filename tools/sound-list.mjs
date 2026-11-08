// Lists every spoken clip the course needs: the keys the screens ask the sound player for (window.gnSound.has / play),
// with the text to say, its Spanish, the voice, where it is used and a suggested recording order.
// Writes sound/<LEVEL>/manifest.json (what tools/make-sound.mjs, tools/make-tts.py and the studio page read) and
// sound/<LEVEL>/lista.csv (the same, for a spreadsheet). Usage: node tools/sound-list.mjs [A1]
//
// The keys are the screens' own (see brief/BRIEF-core.md): Teach plays <point id>.x<n> for example n of a point; Words
// and Spell play <session id>.w.<word id> for a word of the scene and <session id>.s<n>a | b for the two words of
// sound pair n; Listening, Review, Placement and LevelExam play the item's id (a1u01d1.r1, pl.3, a1x.4), and
// Listening also <id>.slow when a slower take exists; LevelExam plays c.check, a test tone, before its listening part;
// Hablar plays p<n>.0 | 1 for the two words of speaking pair n and s<n> for sign n. One recording serves every place the
// same text is said by the same voice: a later row with the same text carries "same": the first row's key, and is not
// recorded again. A dialogue (a listening script, an example with several speakers) is recorded one line at a time
// (<key>.l<n>, each line its own voice) and put together by make-sound.mjs into the clip the screen asks for
// (a row with "parts"). The week test, the reader and Escribir ask for no clips.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const P = path.join(ROOT, 'project');
const LEVEL = (process.argv[2] || 'A1').toUpperCase();
const lv = LEVEL.toLowerCase();
const SLOW = LEVEL === 'A1' || LEVEL === 'A2';   /* the slower takes of the listening lessons (notes G4 §6: at A1–A2) */

const ctx = vm.createContext({ window: {} });
ctx.window.window = ctx.window;
for (const f of [`gn-course-${lv}.js`, 'gn-extra.js']) vm.runInContext(fs.readFileSync(path.join(P, f), 'utf8'), ctx);
const W = ctx.window;
const course = (W.__gnCourses || {})[LEVEL];
if (!course) { console.error(`no level ${LEVEL} in project/gn-course-${lv}.js`); process.exit(1); }
const X = W.__gnExtra || {};

/* ---------- text ---------- */
const PUSO = /[’‘ʼ´`ʹʻ]/g;
const norm = (s) => String(s == null ? '' : s).normalize('NFC').replace(PUSO, "'");
const plain = (s) => norm(s).replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1').replace(/[{}_^]/g, '').replace(/\s+/g, ' ').trim();
/* the same text said the same way: case and spacing aside, but punctuation kept (a question is said differently) */
const sameText = (s) => plain(s).toLowerCase();
/* who says a line written "Name: text" (the speakers the A1 content names; an unknown name is the woman's voice) */
const MEN = /^(juan|luis|carlos|pedro|josé|jose|hombre|vendedor|ñandejára|don\b|profesor|señor|tío|abuelo|papá|hermano|hijo)/i;
const WOMEN = /^(rosa|ana|marta|lucía|lucia|nilda|sofía|sofia|ramona|mujer|ña\b|profesora|señora|tía|abuela|mamá|hermana|hija|vecina)/i;
const voiceOfName = (name) => (/^narrador|^narradora/i.test(name) ? 'N' : MEN.test(name) ? 'M' : WOMEN.test(name) ? 'F' : 'F');
const CODE = { N: 'N', F: 'F', M: 'M', NARRADOR: 'N', MUJER: 'F', HOMBRE: 'M' };
/* a script line as the content writes it: [code, text, es] or "Who: text" */
function lineOf(l) {
  if (Array.isArray(l)) {
    const code = String(l[0] == null ? '' : l[0]).trim();
    return { voice: CODE[code.toUpperCase()] || voiceOfName(code), text: plain(l[1]), es: plain(l[2] == null ? '' : l[2]) };
  }
  const t = plain(l);
  const m = /^([^:]{1,24}):\s+([\s\S]*)$/.exec(t);
  return m ? { voice: voiceOfName(m[1].trim()), text: m[2].trim(), es: '' } : { voice: 'F', text: t, es: '' };
}
const looksSpanish = (t) => /[ñ]|¿|\b(el|la|los|las|de|del|que|qué|un|una|en|es|y|con|por|para|cómo|dónde)\b/i.test(t) && !/[ãẽĩõũỹ'g̃]/.test(t);

/* ---------- the list ---------- */
const rows = [];
const byText = {};     /* voice|text → the key of the first row that says it */
let order = 0;
function add(row) {
  if (row.parts || row.tone) { rows.push(row); return row; }
  const id = row.voice + '|' + (row.slow ? 'slow|' : '') + sameText(row.text);
  if (byText[id]) row.same = byText[id];
  else { byText[id] = row.key; row.order = ++order; }
  rows.push(row);
  return row;
}
const unitFile = (n) => `gn-sound-${lv}-u${String(n).padStart(2, '0')}.js`;
/* a dialogue or a single line: the rows of its lines, and the clip the screen plays, put together from them */
function script(key, lines, where, file, voiceEs) {
  const keys = [];
  const parsed = lines.map(lineOf).filter((l) => l.text);
  parsed.forEach((l, n) => {
    const k = `${key}.l${n}`;
    const lang = l.voice === 'N' || (voiceEs && looksSpanish(l.text)) ? 'es' : 'gn';
    const r = add({ key: k, voice: l.voice, text: l.text, es: l.es, lang, where: `${where} · línea ${n + 1} de ${parsed.length}`, file });
    keys.push(r.same || k);
  });
  add({ key, parts: keys, voice: [...new Set(parsed.map((l) => l.voice))].join('+'), text: parsed.map((l) => l.text).join(' / '), es: parsed.map((l) => l.es).filter(Boolean).join(' / '), where, file });
  return parsed;
}

for (const u of course.units) {
  const file = unitFile(u.n);
  (u.days || []).forEach((d, i) => {
    if (!d || !d.grammar) return;
    const day = i + 1;
    const sid = `${lv}u${String(u.n).padStart(2, '0')}d${day}`;
    const at = `U${u.n} D${day}`;
    /* the examples of each grammar point (Teach): one clip each; an example with several speakers is lines */
    (d.grammar.points || []).forEach((p, pi) => {
      (p.examples || []).forEach((x, n) => {
        const key = x.clip || `${p.id}.x${n}`;
        const gn = norm(x.gn);
        const lines = gn.split('\n').map((s) => s.trim()).filter(Boolean);
        const spoken = lines.length > 1 && lines.every((s) => /^[^:]{1,24}:\s+/.test(s));
        if (spoken) script(key, lines, `${at} · punto ${pi + 1}, ejemplo ${n + 1} (diálogo)`, file);
        else {
          const m = /^([^:]{1,24}):\s+([\s\S]*)$/.exec(plain(gn));
          add({ key, voice: m ? voiceOfName(m[1]) : 'F', text: m ? m[2].trim() : plain(gn), es: plain(x.es), lang: 'gn', where: `${at} · punto ${pi + 1}, ejemplo ${n + 1}`, file });
        }
      });
    });
    /* the words of the scene (Words, and Spell's dictation) */
    const w = d.words || {};
    (w.words || []).forEach((x, n) => add({ key: `${sid}.w.${x.id}`, voice: 'F', text: plain(x.gn), es: plain(x.es), lang: 'gn', where: `${at} · palabra ${n + 1} de la escena «${plain(w.es)}»`, file }));
    /* the sound step's minimal pairs: the two words of each pair */
    ((w.sound && w.sound.pairs) || []).forEach((p, n) => {
      if (!Array.isArray(p) || p.length < 4) return;
      add({ key: `${sid}.s${n}a`, voice: 'F', text: plain(p[0]), es: plain(p[1]), lang: 'gn', where: `${at} · par ${n + 1}, palabra a (${plain(w.sound.focus)})`, file });
      add({ key: `${sid}.s${n}b`, voice: 'F', text: plain(p[2]), es: plain(p[3]), lang: 'gn', where: `${at} · par ${n + 1}, palabra b (${plain(w.sound.focus)})`, file });
    });
    /* the listening lesson: its script line by line, and the slower take of the Guarani lines */
    const sk = d.skill;
    if (sk && sk.kind === 'listening' && sk.item) {
      const key = sk.item.clip || sk.item.id;
      const lines = Array.isArray(sk.audio) && sk.audio.length ? sk.audio : sk.item.script || [];
      const parsed = script(key, lines, `${at} · escucha «${plain(sk.es)}»`, file, true);
      if (SLOW && parsed.length) {
        const keys = parsed.map((l, n) => {
          if (l.voice === 'N') return byText['N|' + sameText(l.text)] || `${key}.l${n}`;   /* the narrator's Spanish is not said again */
          const k = `${key}.l${n}.slow`;
          const r = add({ key: k, voice: l.voice, text: l.text, es: l.es, lang: 'gn', slow: true, where: `${at} · escucha «${plain(sk.es)}» · línea ${n + 1} de ${parsed.length}, versión lenta`, file });
          return r.same || k;
        });
        add({ key: `${key}.slow`, parts: keys, slow: true, voice: [...new Set(parsed.map((l) => l.voice))].join('+'), text: parsed.map((l) => l.text).join(' / '), es: '', where: `${at} · escucha «${plain(sk.es)}», versión lenta`, file });
      }
    }
  });
}
/* the placement check's listening items */
((X.placement && X.placement.items) || []).forEach((it, n) => {
  if (!it || !Array.isArray(it.audio) || !it.audio.length) return;
  script(it.clip || it.id, it.audio, `Ubicación · pregunta ${n + 1}`, 'gn-sound-pl.js', true);
});
/* the level exam's listening part, and its test tone */
const exam = X[`exam-${lv}`];
const xfile = `gn-sound-${lv}-x.js`;
if (exam && exam.parts && exam.parts.P2) {
  let n = 0;
  (exam.parts.P2.tasks || []).forEach((t) => (t.items || []).forEach((it) => {
    n++;
    if (Array.isArray(it.audio) && it.audio.length) script(it.id, it.audio, `Examen ${LEVEL} · escucha ${n}`, xfile, true);
  }));
  add({ key: 'c.check', tone: true, voice: '-', text: '(tono de prueba: lo hace make-sound.mjs)', es: '', where: `Examen ${LEVEL} · prueba de sonido antes de la escucha`, file: xfile });
}
/* the speaking game: the two words of each pair, and the signs */
if (LEVEL === 'A1' && X.speaking) {
  (X.speaking.pairs || []).forEach((p, k) => {
    if (!Array.isArray(p) || p.length < 4) return;
    add({ key: `p${k}.0`, voice: 'F', text: plain(p[0]), es: plain(p[1]), lang: 'gn', where: `Hablá · par ${k + 1}, palabra a (${p[4] || ''})`.replace(' ()', ''), file: 'gn-sound-sp.js' });
    add({ key: `p${k}.1`, voice: 'F', text: plain(p[2]), es: plain(p[3]), lang: 'gn', where: `Hablá · par ${k + 1}, palabra b (${p[4] || ''})`.replace(' ()', ''), file: 'gn-sound-sp.js' });
  });
  (X.speaking.phrases || []).forEach((p, i) => add({ key: `s${i}`, voice: 'F', text: plain(p.gn), es: plain(p.es), lang: 'gn', where: `Hablá · cartel ${i + 1}`, file: 'gn-sound-sp.js' }));
}
/* the slower takes come last in the recording order */
rows.filter((r) => r.slow && r.order).sort((a, b) => a.order - b.order).forEach((r) => { r.order = ++order; });
const recorded = rows.filter((r) => r.order);
const slowN = recorded.filter((r) => r.slow).length;
const byVoice = {};
recorded.forEach((r) => { byVoice[r.voice] = (byVoice[r.voice] || 0) + 1; });

/* ---------- the files ---------- */
const OUT = path.join(ROOT, 'sound', LEVEL);
fs.mkdirSync(OUT, { recursive: true });
const files = [...new Set(rows.map((r) => r.file))];
const manifest = {
  level: LEVEL,
  made: new Date().toISOString().slice(0, 10),
  about: 'Every clip the course needs: key (what the screens ask gn-sound.js for), voice (F the woman, the main voice; M the man; N the narrator, in Spanish), text, es, lang, where, file (the unit file make-sound.mjs puts it in), order (the suggested recording order; none for a row with "same", said already under that key, for a row with "parts", put together from those keys, and for the tone). Rights: notes/G4-resources-licensing.md §6, CC BY 4.0.',
  voices: { F: 'mujer, voz principal: palabras, ejemplos, pares y carteles', M: 'hombre: sus líneas de los diálogos', N: 'narrador en castellano: consignas y números de las opciones' },
  files,
  count: { rows: rows.length, toRecord: recorded.length, slow: slowN, byVoice, composed: rows.filter((r) => r.parts).length, same: rows.filter((r) => r.same).length },
  clips: rows,
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
const cell = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = [['orden', 'clave', 'voz', 'texto', 'castellano', 'idioma', 'uso', 'archivo', 'igual_que', 'partes'].join(',')];
rows.forEach((r) => csv.push([r.order || '', r.key, r.voice, r.text, r.es, r.lang || '', r.where, r.file, r.same || '', r.parts ? r.parts.join(' ') : ''].map(cell).join(',')));
fs.writeFileSync(path.join(OUT, 'lista.csv'), '﻿' + csv.join('\n') + '\n');
console.log(`${LEVEL}: ${rows.length} rows; ${recorded.length} clips to record (${Object.entries(byVoice).map(([v, n]) => `${v} ${n}`).join(', ')}; ${slowN} of them slower takes), ${manifest.count.same} said already, ${manifest.count.composed} put together from lines, 1 tone; files: ${files.join(', ')}`);
console.log(`written: ${path.relative(ROOT, path.join(OUT, 'manifest.json'))}, ${path.relative(ROOT, path.join(OUT, 'lista.csv'))}`);
