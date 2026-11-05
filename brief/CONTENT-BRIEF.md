# Content brief: writing the Guarani lessons (A1, unit 1 and the prototype's other content)

You write lessons for a phone app that teaches Paraguayan Guarani (avañe'ẽ) to Spanish speakers. It is modeled on the
Yaoki suite (a JLPT app): a unit is a week of 5 study days, a review day (día 6, "Repaso de la semana") and a week test
(día 7). Each study day has three lessons: grammar (teach → compare → drill → exam-style), words (a scene of words,
then spelling them with the Guarani keyboard, then one exam-format question) and a skill item (reading or listening).
At A1–A2 the words lesson starts with a short "Sonido y letra" step (one sound or spelling feature, with minimal pairs).
The course covers the six CEFR levels A1–C2 in one app; you are writing level A1.

## Files and the build

- Folder: `/home/user/epu-` (`$B`).
- Syllabus (titles you must use exactly): `$B/content/levels.json` → `A1.units[0]` (unit 1, "Mba'éichapa · Saludos y sonidos"):
  days 1–5 `days[]` and their sound focus `sound[]`; day 6 title "Repaso de la semana".
- Your output: the unit file `$B/content/a1/u01.json` is assembled from per-day files you write as
  `$B/content/a1/parts/u01-d<N>.json` (one JSON object: the day), and `u01-test.json` (the week test array).
  The assembler (`node $B/tools/assemble-unit.mjs a1 1`) merges them into `u01.json`; then `node $B/tools/build-course.mjs --check`
  validates everything. Run both and fix every error before you finish. Warnings deserve a look.
- The JSON shape is below and in `$B/brief/BRIEF-core.md` §7. Yaoki's real examples: `$B/notes/Y2-lesson-loop.md` §6.2–6.4.

## The Guarani: accuracy first

- Read before writing: `$B/notes/G1-sounds-writing.md` (alphabet, nasal harmony, stress and accent rules, puso, minimal pairs),
  `$B/notes/G2-grammar-reference.md` (verified forms, examples, the SPELLING OF SUFFIXED FORMS section),
  `$B/notes/G5-culture-naming-microcopy.md` (greetings and formulas, verified with confidence marks), `$B/notes/G7-six-level-syllabus.md` (A1 plan).
  If a notes file does not exist yet, rely on the others and on what you can confirm with WebSearch (load it with ToolSearch "select:WebSearch").
- Standard Paraguayan Guarani in the Academia de la Lengua Guaraní's spelling (alphabet 2015): a e i o u y; ã ẽ ĩ õ ũ ỹ; á é í ó ú ý
  only where the rules put a written accent; ñ; g̃ (g + U+0303); the puso as the apostrophe ' (U+0027) only; digraphs ch mb nd ng nt rr.
  Text in Unicode NFC (precomposed ã ẽ ĩ õ ũ ỹ). Never ’ or ´ for the puso.
- Use only forms you can stand behind: well-attested greetings, pronouns, common verbs and nouns. Prefer short, common, natural
  sentences a Paraguayan teacher would write on the board. If you are not sure a form exists or is spelled so, do not use it:
  pick a form you are sure of. Mark nothing as fact that you have not checked.
- Jopara (mixing with Spanish) is how many people speak; at A1 teach standard forms, and where everyday speech differs, say so
  in a Spanish note (e.g. people say "Mba'éichapa" and also "¿Qué tal?"). Spanish loanwords that are established Guarani
  (spelled the Guarani way) are fine.
- Respect: Paraguayan Guarani is a national language spoken by most Paraguayans; never exoticise it, never mock Jopara.

## The Spanish

- The learner reads Spanish. Write it plain, warm and short, the way Yaoki writes English: short sentences, no jargon
  beyond what a learner needs (prefijo, sufijo, nasal, acento, puso are fine), no em dashes, no exclamation marks except
  in praise. Use the voseo of Paraguay and the River Plate (vos sabés, elegí, escuchá, tocá) for instructions to the learner.
- Explanations work with the sentence in front of the learner ("Acá habla de dos personas y el que escucha está incluido: ñande").
- Translations: natural Spanish, faithful to the Guarani (not word for word, but never adding meaning).

## The rules of a good item (from Yaoki, keep them all)

1. Exactly one right answer; every wrong option clearly wrong to a native speaker; every build item fits only one order.
2. No false rules: a reason never teaches something that is not true in general.
3. Original sentences (no copies from textbooks or past exams).
4. Level: only A1 grammar and words, leaning on the day's points and the days before; most sentences short.
5. Support (glosses `[base|gloss]`, highlights `{…}`) in teach, compare and drill text; none in exam-style items, the words
   check, reading passages and questions.
6. Drill choice items have `why` (one line per option, the right one included); exam-style items one `explain`.
7. Drill: 6 items = 4 choice (4 options) + 2 build, at least two on each point; `^…^` marks the clue in every choice sentence;
   build items need `hint`, `full`, `es`, `explain`, and `bank` not in the right order.
8. Compare: one-sentence `intro`; three forms (the day's two points and one earlier point or a common confusion, or for
   day 2 ñande / ore and the Spanish "nosotros"); `mark` dot (neutral) / down (negative) / up (more); `tag` = a short Spanish label;
   a 3-option `check`.
9. Before finishing: re-read as a strict examiner; try every wrong option and every other tile order; list your doubts.

## Items for Guarani (what changes from Yaoki)

- The blank is written `(   )` (parenthesis, three spaces, parenthesis) in Guarani sentences; `_x_` underlines a word asked about.
- `build` replaces Yaoki's ★ star item:
  - `join: "word"`: tiles are the morphemes of ONE word in order, glued without spaces; `full` is the correctly spelled word
    (accents move when suffixes join, so `full` is the spelling to show), e.g. tiles `["nd", "a", "guata", "i"]`, full `"{nd}aguatá{i}"`
    — only if you have verified that spelling. This is the Guarani-specific skill: agglutination and nasal harmony.
  - `join: "sentence"`: word tiles in order with spaces; `before` and `after` around them.
  - The build check compares `full` with before + tiles + after ignoring accents, spaces and punctuation, so `full` must
    contain exactly those letters.
- `area` on every item: `vocab`, `grammar`, `reading`, `listening`, `mediation` or `sound`.
- `label` on every item: a short Spanish label of the item type, e.g. "Elegí la forma", "Armá la palabra", "Armá la oración",
  "Qué significa", "Cómo se escribe", "Qué escuchaste", "Respuesta rápida", "Buscar el dato".
- Listening: `audio` is a list of lines `[speaker, text]` with speaker `N` (narrador, in Spanish at A1), `F` (mujer) or `M` (hombre);
  the item's `script` repeats the lines as `["Narrador: …", "Mujer: …"]`. No clips exist yet; the screens show a silent
  stand-in. Keep each line short.
- Mediation at A1: relay one concrete fact in Spanish from a Guarani sign or message (G6 notes), as a choice item, `area: "mediation"`.

## Day shape (one file per day: `$B/content/a1/parts/u01-d<N>.json`)

```json
{
  "title": "<exactly the syllabus title>",
  "grammar": {
    "points": [
      { "id": "a1u01d<N>.p1", "form": "<the Guarani form, short>", "gloss": "<Spanish, short>",
        "connect": [ { "pos": "<Spanish: what it attaches to / when>", "rule": "<Guarani pattern with {highlight}>" } ],
        "examples": [ { "gn": "<Guarani sentence with {highlight}>", "es": "<Spanish>", "parts": [["<morpheme>", "<Spanish gloss>"]] } ],
        "watch": { "note": "<Spanish: the mistake a Spanish speaker makes>", "bad": "<wrong Guarani>", "good": "<right Guarani>" } },
      { "id": "a1u01d<N>.p2", … }
    ],
    "compare": { "intro": "…", "forms": [ { "form": "…", "tag": "…", "mark": "dot", "gn": "…", "es": "…" } ×3 ],
                 "check": { "id": "a1u01d<N>.c1", "kind": "choice", "area": "grammar", "label": "…", "q": "…", "options": [3], "answer": 1, "why": [3] } },
    "drill": [ 4 choice + 2 build, ids a1u01d<N>.d1 … d6 ],
    "exam": [ 2 choice with explain + 1 build without hint, ids a1u01d<N>.e1 … e3 ]
  },
  "words": {
    "gn": "<optional Guarani scene title>", "es": "<Spanish scene title>", "intro": "<one line: where we are>",
    "sound": { "focus": "<the day's sound focus from the syllabus>", "letters": ["ẽ", "…"], "note": "<Spanish, 2-3 short sentences>",
               "pairs": [ ["<gn A>", "<es A>", "<gn B>", "<es B>"] ] },
    "words": [ { "id": "<ascii id>", "gn": "<word or short phrase>", "es": "<Spanish>", "parts": [["<piece>", "<meaning>"]], "note": "<optional>" } ×6-8 ],
    "spell": ["<ids of 3-4 words to type in the spelling step: those with the day's hard letters>"],
    "check": { "id": "a1u01d<N>.k1", "kind": "choice", "area": "vocab", "label": "Cómo se escribe", "q": "…_x_…", "options": [4], "answer": 1, "explain": "…" }
  },
  "skill": { "kind": "listening", "es": "<title>", "situation": "<Spanish>", "ask": "<Spanish question>",
             "item": { "id": "a1u01d<N>.r1", "kind": "choice", "area": "listening", "label": "…", "q": "…", "options": [3], "answer": 1, "why": [3], "script": ["…"] },
             "audio": [ ["F", "…"], ["M", "…"] ] }
}
```
(a reading skill instead: `{ "kind": "reading", "es", "ask", "seconds": 60-90, "passage": "<Guarani, short, with ^clue^>", "strategy": "<Spanish tip>", "item": {…} }`)

Sound pairs: only REAL minimal pairs you have verified (G1 lists them with sources). If a focus has no safe pair, give contrasting
words instead and say so in the note; never invent a word to make a pair. Day 5's focus is typing: its `letters` are the keys
ã ẽ ĩ õ ũ ỹ g̃ and ', and its words are chosen to need them.

## The review day and the week test (`u01-d6.json`, `u01-test.json`)

- Day 6 "Repaso de la semana": `points: []`; `compare.forms` holds the week's look-alikes (3-4 forms); drill 6 items mixing the
  week; exam 3; words and skill as on any day (a reading: a short chat or sign using the week's greetings).
- Week test: 20 items, ids `a1u01t.1` … `a1u01t.20`, each with `explain` (no `why`): 6 vocab, 8 grammar, 3 reading (with `passage`
  repeated on each item that reads it, and `short` labels), 3 listening-as-text (a written "respuesta rápida": which reply fits),
  build items allowed. Answers spread over positions 1-4.

## Report

When you finish, return: the files written, the build result (paste the last lines), and DOUBTS: every Guarani form you are less
than sure of, with why (under 150 words). Reviewers will check those first.

## Extras (one author): `$B/content/extra/*.json` → `gn-extra.js` (`window.__gnExtra.<file name>`)

Every item inside is checked like a lesson item (ids must start with the prefix given). Keep it small: these files feed
designed moments on the canvas, not a full course. Same accuracy rules.

- `placement.json` (prefix `pl.`): `{ "self": [8 × { "id": "pl.s1", "level": "A1"|"A2"|"B1"|"B2", "skill": "comp"|"prod", "es": "<can-do in voseo: Entiendo saludos y preguntas simples si me hablan despacio.>" }],
  "items": [6 × choice items with an extra "level" field, ids pl.1 … pl.6: two A1, two A2, two B1; at least two are listening
  items with "audio": [["F", "<Guarani>"]] and "script"; options 3 at A1-A2, 4 at B1] , "production": { "es": "<prompt: Presentate en 30 segundos: tu nombre, de dónde sos y qué hacés.>", "seconds": 45 } }`
- `exam-a1.json` (prefix `a1x.`): the A1 level exam, reduced for the prototype:
  `{ "level": "A1", "minutes": 81, "parts": {
     "P1": { "minutes": 25, "tasks": [ { "es": "<instructions>", "passage": "<a short Guarani sign or message>", "items": [3 choice items] } ] },
     "P2": { "minutes": 20, "tasks": [ { "es": "<instructions>", "items": [2 listening choice items with audio + script] } ] },
     "P3": { "minutes": 10, "tasks": [ { "es": "Tu vecina no habla guaraní. ¿Qué 3 datos le pasarías?", "passage": "<a Guarani notice>", "points": [ { "es": "<a fact in Spanish>", "key": true|false } ×6 ] } ] },
     "P4": { "minutes": 15, "tasks": [ { "es": "<prompt: Escribí un mensaje de 20 a 30 palabras…>", "samples": [ { "level": "below"|"at"|"above", "gn": "<sample answer>", "es": "<what it shows>" } ×3 ] } ] },
     "P5": { "minutes": 11, "tasks": [ { "es": "<prompt: Presentate…>", "seconds": 60, "samples": [3 as P4] } ] } },
   "rubric": [ { "key": "cumplimiento", "es": "Cumplimiento de la tarea" }, { "key": "coherencia", "es": "Coherencia" }, { "key": "alcance", "es": "Alcance" }, { "key": "correccion", "es": "Corrección" }, { "key": "fluidez", "es": "Fluidez (oral)" }, { "key": "inteligibilidad", "es": "Se entiende (oral)" } ] }`
- `reader.json` (prefix `rd.`): one original short text for the reader's designed moment, A1-A2 level, 4-6 sentences, built from
  the unit's greetings and words: `{ "works": [ { "id": "rd.ana", "title": "<Guarani title>", "es": "<Spanish title>", "level": "A1",
  "about": "<one Spanish sentence>", "phrases": [ { "t": "<the phrase as written, one word with its suffixes, or a short noun phrase>",
  "tail": "<punctuation or space after it>", "words": [ { "t": "<word>", "m": [["<morpheme>", "<Spanish gloss>", "p|r|s|c|x"]], "e": "<Spanish meaning of the word>" } ],
  "g": ["<pattern>", "<Spanish>"] | null, "n": "<optional Spanish note>" } ] } ] }` (kinds: p prefix, r root, s suffix, c postposition, x particle).
  A phrase's words joined with spaces must equal `t`. Only morpheme splits you are sure of; when unsure, give the whole word as one root.
- `speaking.json` (prefix `sp.`): `{ "pairs": [ [ "<gn A>", "<es A>", "<gn B>", "<es B>", "<contrast: nasal|puso|acento|y>" ] ], "phrases": [ { "gn": "…", "es": "…" } ] }`
  — pairs ONLY if verified as real minimal pairs (G1); 4-8 pairs; phrases 6 from the unit.
- `typing.json` (prefix `ty.`): `{ "letters": ["ã","ẽ","ĩ","õ","ũ","ỹ","g̃","'"], "words": [ { "gn": "…", "es": "…" } ×12 from unit 1 ] }`.
