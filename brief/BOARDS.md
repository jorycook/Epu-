# The boards (canvas layout and specs)

Paths: `$Y` = `.../scratchpad/ref/Yaoki/yaoki/project` (Yaoki main app boards), `$N` = `.../scratchpad/notes`.
Every phone board is 390×844, radius 44, `is_interactive: true`. Row titles are canvas notes (written by the lead).
The sample state for plan boards (designed moment, relative to today, never drifting):
```js
const C = window.gnCourse; const T = C.today(C.now());
const full = { g: 3, k: 1, r: 1 };
const SAMPLE = { level: 'A1', started: true, plan: { start: C.addDays(T, -3), target: C.addDays(T, 60), pace: 'fit', minutes: 30 },
  done: { a1u01d1: full, a1u01d2: full, a1u01d3: full, a1u01d4: { g: 1 } }, tests: {}, exams: {}, mistakes: [/* 2-3 entries, see Notebook */],
  cur: 'a1u01d4', placement: { comp: 'A2', prod: 'A1', start: 'A1' }, typed: [] };
// unit 1 ("Mba'éichapa · Saludos y sonidos"), days 1-3 stamped, day 4 ("Preguntar con -pa") is today, its grammar teach page read.
```

## Row 1 · y 0 · "Start: why you learn, where you start, your plan"

| x | File | Canvas title | Model |
|---|---|---|---|
| −470 | `App.dc.html` | Prototype · play the whole flow | `$Y/App.dc.html` |
| 0 | `Goal.dc.html` | 1 · Why and where | `$Y/Goal.dc.html` (+ G3 §Recommendations 3) |
| 470 | `GoalStart.dc.html` | 2 · Where you start | moment board: `<dc-import name="Goal" view="start">` |
| 940 | `Placement.dc.html` | 3 · Placement check | new (G6 §5); look of `$Y/Exam.dc.html` |
| 1410 | `PlacementResult.dc.html` | 4 · Placement result | moment board: Placement `view="result"` |
| 1880 | `GoalPlan.dc.html` | 5 · Level, goal and ritual | moment board: Goal `view="plan"` |

**Goal** (one component, three real steps; Yaoki's step bar becomes real: three 8-px pills, the current indigo):
- Step 1 "¿Para qué querés aprender guaraní?": up to two reasons (chips, `aria-pressed`): hablar con mi familia · mi trabajo
  (salud, justicia, atención al público, docencia, campo) · vivo en Paraguay · mis raíces · música y cultura · viajar · un
  requisito; then "¿Dónde lo vas a usar?": casa · trabajo · calle y mercado · WhatsApp · música · campo. One line in a muted info
  box: "Te enseñamos el guaraní paraguayo que se habla hoy, con las palabras del castellano que todos usan, y te mostramos
  la forma académica al lado." Next → step 2. Answers never lock content (they order examples and work scenes).
- Step 2 "¿Desde dónde empezás?": two separate 5-step scales with can-do wording (G3 §Recommendations 3):
  Entender: nada · saludos y palabras sueltas · sé de qué se habla en casa · casi todo, pero me cuesta hablar · todo;
  Hablar: nada · frases hechas · me defiendo · converso · con fluidez. Each step a 44-px row button. A gap of two steps or
  more shows a card "Entendés más de lo que hablás. La prueba de ubicación (12-15 min) te dice desde dónde empezar." with
  "Hacer la prueba" → Placement, and always "Empezar en A1" / "Elegir mi nivel" → step 3.
- Step 3 (Yaoki's Goal): level grid of the six levels (3 columns × 2 rows, 56-px buttons: "A1" 18/800 over its Spanish
  name 10/700; selected indigo look; a level whose days are not written yet: dashed + "En preparación", still selectable
  for browsing the syllabus? NO: disabled as Yaoki does; A1 is written in the prototype). Under the grid, the level's
  one-line can-do (`C.meta(lv).can`). "Fecha meta" field (68 px, calendar icon) opening a sheet: "A mi ritmo, sin fecha"
  (default), "En 3 meses", "En 6 meses", "Elegir una fecha" (a real `<input type="date">` with a `<label>`); with a date, the
  faltan-N-días chip. Minutes a day: 15 / 30 / 45 ("Suave" / "Normal" / "Intenso"). Plan box (`#E8ECFB`): "8 unidades · 56 sesiones"
  and the plan sentence (no date: "Una sesión por día, a tu ritmo: unas 8 semanas."; with a date that fits: "Entra todo,
  una sesión por día, y queda la última semana para repasar y rendir el examen de nivel."; when it does not fit, Yaoki's
  pair "Meter todo" / "Una por día" with the note). The ritual: Kaguare 104 px with the level's rosette as a frame only;
  CTA (accent text colour) "Tejé el primer hilo" → the first ring appears (300 ms) and the line "Primer hilo tejido.
  Cada unidad suma uno; el examen de nivel lo completa."; then "Empezar" (indigo) → `save({ level, plan: { start: T, target, pace, minutes }, cur: null })` + `go('Main')`.
- Moment boards: `GoalStart` = step 2 with Entender "sé de qué se habla en casa" and Hablar "frases hechas" picked, the
  placement card showing; `GoalPlan` = step 3, A1 selected, "A mi ritmo", 30 min, rosette frame, ritual CTA not yet tapped.
- Standalone `Goal` shows step 1 with "hablar con mi familia" and "casa" picked.

**Placement** (G6 §5; 12-15 min; Exam's look): header "Prueba de ubicación" + "Parte 2 de 3 · Comprensión" + progress
segments; one question at a time (choice items, 3 options at A1-A2, 4 from B1, with a listening item's play button using the
stand-in); no clock (it is not an exam); "Saltear esta parte" link; "Siguiente". Result view: two big level cards side by
side "Comprensión B1" / "Producción A2" (Andika for the level code? no: M PLUS 800), the sentence "Empezás en A2: tu plan
sigue tu nivel de producción. En cada unidad podés rendir primero la prueba de la semana: con 80 % o más, sus ejercicios
de comprensión cuentan como hechos." and "Empezar en A2" (→ Goal step 3 with A2 chosen) + "Elegir otro nivel". Content:
`window.__gnExtra.placement` (from `gn-extra.js`): `{ self: [...], items: [...] }`; designed moment: the first
listening item from the second block on (with the 6 items of `placement.json`: pl.1, "Pregunta 5 de 6"), an option picked.

## Row 2 · y 1284 · "Every day: a week, a day, six levels, how you are doing"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Main.dc.html` | 6 · Week path | `$Y/Main.dc.html` ($N/Y1 §5.3) |
| 470 | `Today.dc.html` | 7 · Today's spread | `$Y/Today.dc.html` ($N/Y1 §5.4) |
| 940 | `Levels.dc.html` | 8 · Six levels in one app | the Shell menu's level box ($N/Y1 §5.6) grown into a full screen |
| 1410 | `Progress.dc.html` | 9 · How am I doing | `$Y/Readiness.dc.html` ($N/Y1 §5.5, §6.4) |

**Main**: Yaoki's layout and SPOTS exactly. Level chip "A1" (→ `go('Levels')`); stamps chip with the mini ✓ stamp; the
days-left chip only with a target date. Unit card: kicker "Semana 1 de 8", the unit's Guarani title big (`unit.gn`,
Andika 700 26px, `lang="gn"`) when it has one, else the Spanish; the Spanish under it 13/500 muted; Kaguare 60 px with the
level rosette (rings = units done). Stamp card of 7 slots (✓ stamps; test slot with the stopwatch). Path nodes: done ✓
stamp (accent ring), today (indigo 68 px, day number), locked (padlock), test (stopwatch, gold when ready). Labels:
"Día 4" + the day title (14px; allow 2 lines, `overflow-wrap: anywhere`); test "Prueba de la semana" + "formato de examen".
Callout kicker "HOY · 3 LECCIONES" (or "SIGUIENTE"), title, "Empezar". Tabs: Camino (Main) · Cuaderno (Notebook) · Examen
(ExamTab) · Progreso (Progress). Designed moment: SAMPLE.

**Today**: Yaoki's layout. Header "Semana 1 · Día 4" (derive from `app.session`, not the id). Kicker "HOY · TRES LECCIONES",
h1 the day title, sub "Aprendé la regla, practicala con ayuda y después respondé como en el examen." Cards:
1 Gramática (tile 46×46 indigo tint with "-pa" in Andika 700? no: a short glyph-free icon is clearer: the grammar tile shows
the day's first form, e.g. "-pa", in Andika 700 18px), "Gramática · 2 formas", the points' forms as title; pills Aprender ·
Practicar · Examen (done ✓ teal / now indigo / todo); CTAs "Empezar con la regla" / "Seguir con la práctica" / "Al examen".
2 Palabras (accent tint tile showing the day's hard letter, e.g. "'" or "ẽ"): "Palabras · 7 · Sonido y letra: el puso";
title the scene; pills Sonido · Aprender · Escribir · Examen at A1-A2 (Sonido only when `words.sound`).
3 Lectura or Escucha (gold tint tile with the book or speaker icon). Footer: dashed stamp + "Terminá las tres lecciones para
sellar el día 4." / done: stamp animated + "¡Día 4 completo!" + "Volver". Designed moment: SAMPLE (grammar at g=1: Practicar now).

**Levels** (the one-app level menu, from the level chip; also reachable from the menu): title "Seis niveles, una app"
(+ "Niveles de referencia para el guaraní" 12/500 muted), a vertical list of six level cards A1…C2, each: code 22/800,
Spanish name 15/800, the can-do line (12/500), units 8/10/10/10/8/6 and days written, the level's rosette (40 px; rings =
units done; full + teal ✓ ring when Apto), a progress line "3 de 56 sesiones · Semana 1" for the current level, "Examen de
nivel: Apto · autoevaluado" when passed, "En preparación" (dashed card, muted) for unwritten levels; the current level has the
hero look. Tapping a level → `this.props.level(lv)` (keeps each level's plan; Goal the first time). A footnote: "Cada nivel
termina con un examen de cinco partes. El resultado es una constancia de la app, no un certificado oficial." Designed moment:
A1 current (3 days stamped), A2 to C2 en preparación except the syllabus counts.

**Progress** ("¿Cómo voy?", replaces Readiness, computed, never hard-coded): header "Progreso · A1"; hero card: the level's
rosette 104 px with its rings, "Unidad 1 de 8 · 3 de 56 sesiones", a pace line (with a target: "Vas al día" / "2 días atrás";
without: "A tu ritmo"); "Por área" card: bars for Palabras, Gramática, Lectura, Escucha (right/of summed from
`tests[*].areas` + exam-style results), a 60 % target tick on each, an area under the line in red with a chip; empty state
before the first week test ("Después de tu primera prueba de la semana vas a ver acá cómo te va en cada área."); "Próximo
paso" card linking to the weakest area (red CTA "Practicar"); the exposure log (G6 §6, G3 "Lo usé"): "Esta semana usé el
guaraní con alguien" toggle chips (familia · trabajo · calle · WhatsApp), self-reported, never checked; footnote "Es una
guía, calculada con tus pruebas de la semana." Designed moment: show the empty state? No: show a sample with week-test
areas from a1u01t (vocab 5/6, grammar 6/8, reading 3/3, listening 1/3 under the line) so the bars and the red chip are designed.

## Row 3 · y 2568 · "Learn, drill, then exam-style"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Teach.dc.html` | 10 · Teach page | `$Y/Teach.dc.html` ($N/Y2 §5.1) |
| 470 | `Compare.dc.html` | 11 · Compare: ñande and ore | `$Y/Compare.dc.html` ($N/Y2 §5.2) |
| 940 | `Drill.dc.html` | 12 · Drill with explanation | `$Y/Drill.dc.html` ($N/Y2 §5.3) |
| 1410 | `Build.dc.html` | 13 · Build the word | `$Y/Star.dc.html` ($N/Y2 §5.4), data-driven |
| 1880 | `Exam.dc.html` | 14 · Exam-style step | `$Y/Exam.dc.html` ($N/Y2 §5.5) |
| 2350 | `ExamResult.dc.html` | 15 · Exam-style result | moment board: Exam `view="result"` |

Loop rules: $N/Y2 §1.2 transition table, §2 shared look, §3 item mechanics, §9.3 (all of it, incl. the fix list l).
- Teach: form h1 in Andika 700 34px with `lang="gn"`; "Cómo se forma" rows (pos stacked above the rule when longer than ~12
  characters); "Ejemplos" with play buttons (stand-in) and, per example, an optional "Partes" line: the morphemes as small
  columns (Andika 15/700 over the Spanish gloss 11/700 muted) when the example has `parts`; "¡Atención!" box (gold tint) with
  the watch note and bad ✗ / good ✓ lines. Progress segments sized from the data (2 points + compare = 3). Designed moment:
  a1u01d4 point 1. Next "Siguiente: <next form>" / "Comparar"; the next form is named only when it fits the button
  whole (at 17 px, or 15 for a longer one: `gnCourse.ems`), else the button says "Siguiente" alone.
- Compare: canvas title says "ñande and ore": its designed moment is a1u01d2 (pronouns: ñande includes the listener, ore
  excludes them) with the check unanswered. Kicker "COMPARAR" (red as in Yaoki); forms with dot/down/up tags; "Pregunta
  rápida" check (re-pickable, records nothing); "A la práctica" → Drill, `save({ prog: { g: 1 } })`. No word is broken
  in two: the check's options share a row only while each fits its button whole (`gnCourse.ems`), else each gets a row,
  and the tick or cross sits on the button's corner (as in Words) and takes no room; a form stays whole beside its tag
  (one line up to 190 px, the tag wrapping in what is left).
- Drill: choice and build items; build items render as morpheme or word tiles (bank 2 columns; slots; for `join: 'word'` the
  slots sit tight with a hairline between, the joined spelling `full` shown in the answer sheet); verdicts "¡Correcto!" /
  "Casi" (+ Guarani from the glossary if verified); sheet head "Por qué cada opción" / "La palabra" / "La oración"; wrong →
  `miss({ src, wrong })` and "Guardado en tu cuaderno de errores. Vuelve mañana."; last → "Terminar la práctica" +
  `save({ prog: { g: 2 } })`. Designed moment: a1u01d4 item 1 answered wrong and explained. The sheet is at most 522 px
  tall: longer reasons scroll inside their white box and the button to go on stays in view under them. Options sit two
  by two only while every option's longest word fits its half-width button with the mark in (`gnCourse.wordEms`).
- Build: the build item showcase, data-driven (first build item of a1u01d4's drill), two tiles placed and the hint open.
- Exam: day set 150 s "EXAMEN · SIN AYUDAS", "Sin pistas ni glosas. Las respuestas, al final."; week test set 1200 s; clock pill
  `role="timer"`; build items asked as tiles in order (the whole order counts here, not a single starred tile: Guarani words
  are short in tiles); result view: score, "1:48 de 2:30", rows with ✓/✗, the full sentence, explain; "Siguiente" →
  `save({ prog: { g: 3 } })` (day) or `save({ result })` (test). Designed moment: question 2 of 3 with an option pressed, 1:42.
  A question that comes with a text to read (the week test's reading items) is set tighter (text 14 px, question 17 px,
  answers 48 px), so the text, the question and its four answers open in view together.

## Row 4 · y 3852 · "Words: sound and letter, the scene, spelling with the Guarani keyboard"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Sound.dc.html` | 16 · Sound and letter (A1-A2) | moment board: Words `view="sound"` |
| 470 | `Words.dc.html` | 17 · Words in a scene | `$Y/Scene.dc.html` ($N/Y3 §6.1, §8.4) |
| 940 | `WordsSpell.dc.html` | 18 · Words lesson: spelling | moment board: Words `view="spell"` (as `$Y/SceneWrite.dc.html`) |
| 1410 | `Spell.dc.html` | 19 · Spelling pad (part of 18) | `$Y/Write.dc.html` ($N/Y3 §8.3), frame 358×470, radius 24 |

- Words steps: Sonido (A1-A2 days with `words.sound`) → Aprender → Escribir → Examen; step chips at the top right
  ("SONIDO", "APRENDER", …); progress `ks` (learnt), `kw` (written), `k` (done).
- Sonido: the focus title (e.g. "El puso (')"), the letters big (Andika 700 40px tiles), the note, and the pairs as
  listen-and-choose cards: two words side by side with their Spanish, a big play button that plays one of them (stand-in), the
  learner taps which one they heard (✓/✗, no notebook); "Seguir" → Aprender. The two words of a pair are set at one
  size, 22 px or as much less as the longer one needs to stay whole in its tile (never under 15).
- Aprender: Yaoki's navy sign board (`#1B2440`, 2 columns of chips, M PLUS 17/800, `lang="gn"`, min-height 46 so two-word
  phrases fit); tap a chip → the word card: the word (Andika 700, 40/34/28 px by length), syllables with the stressed one in
  `#C7361E` (from `gnSpell` helpers if present, else omit), the Spanish 13/500, play button, "Partes" tiles (2 columns: piece
  in Andika 22/700, meaning 12/500). Found badge ✓. "Después vas a escribir 3 palabras con letras nuevas: ', ẽ."
- Escribir: imports `Spell` with a task per `words.spell` word; Next stays shut until written ("Escribí la palabra primero").
  A word typed before is not asked again, except on the review day (día 6): its list is the week's hard words, and it
  asks for them once more ("Después vas a escribir de nuevo 4 palabras de la semana."); once its writing step is done
  it asks for none.
- Examen: the words check (`words.check`), one exam-format question; then `save({ prog: { k: 1 } })` → Today. Its options
  take as many columns (all in a row, two, or one) as let every label, number and word, stay on one line.
- Spell (the pad; $N/Y3 §8.3 for every detail): props `task` (`{ kind: 'word', w, es }`), `tkey`, `finished({ misses, helped })`,
  `size`. Cells from `gnSpell.cells(w)` (Andika 700); only the hard letters are typed (`gnSpell.hard`), plain letters given;
  passes Copiar / Con pistas / De memoria; keyboard of real buttons from `gnSpell.keys(w, tkey)` (46×44, radius 12, Andika 22/700,
  `aria-label` = `gnSpell.name(k)`); the line under the cells (`aria-live="polite"`) with `gnSpell.note(why, want)`; help after
  2 misses (yellow) and 4 (filled in); buttons Escuchar · Pista · Otra vez; the syllable strip if syllables are available.
  Load `./gn-spell.js` in its head. Designed moment: "ñe'ẽ" pass 2, the puso cell typed, ẽ current.

## Row 5 · y 5136 · "Reading, listening, week test, notebook"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Reading.dc.html` | 20 · Reading | `$Y/Reading.dc.html` ($N/Y3 §6.4, §8.5) |
| 470 | `Listening.dc.html` | 21 · Listening | `$Y/Listening.dc.html` ($N/Y3 §6.5, §8.5) |
| 940 | `WeekTest.dc.html` | 22 · Week test | `$Y/WeekTest.dc.html` ($N/Y3 §6.6, §8.6) |
| 1410 | `Notebook.dc.html` | 23 · Mistake notebook | `$Y/Notebook.dc.html` ($N/Y3 §6.7, §8.6) |
| 1880 | `Review.dc.html` | 24 · Notebook review | `$Y/Review.dc.html` ($N/Y3 §6.8, §8.6) |

- Reading: passage Andika 16, lh 1.7, `lang="gn"`; tap a word for its Spanish (practice only); advisory stopwatch; strategy
  box "Pista · solo en la práctica"; clue marked after answering; verdict sheet with reasons. Designed moment: a1u01d6's
  reading (the review day), unanswered, clock running.
- Listening: play → answers unlock; "Repetir"; "Más despacio" (a recorded slow take; disabled with "Todavía no está grabado"
  when missing); nothing printed until answered ("No hay nada escrito hasta que respondas, como en el examen."); after: the
  script with speaker tags (Narrador / Mujer / Hombre) and "Ver traducción"; stand-in highlights each line as it "plays".
  Designed moment: a1u01d1's listening, played once, an answer picked.
- WeekTest: intro ("Prueba de la semana", 20 preguntas, one 20-minute clock, "Por área" counts, "Empezar la prueba" → Exam set
  'test') and result (score 56px, the praise stamp by share ≥ 0.8 / ≥ 0.6 / else with Spanish "¡Excelente!" / "¡Muy bien!" /
  "Seguí practicando" and the Guarani accent from the glossary, bars per area with "Punto débil", "6 errores fueron a tu
  cuaderno", "Ver errores", "A la semana 2"). Designed moment: the result of a1u01t, 16/20 with Escucha weak. The
  onward button names the next week only when this week is whole and the next session due is in another week; a test
  taken early, or the test of the last written week, reads "Tapykue · Volver" and leads back to its own week.
- Notebook: "Cuaderno de errores": "Para repasar hoy" count + "Repasar ahora"; the track (mañana · en 3 días · en 1 semana ·
  ¡aprendido!); rows with the quote (grapheme-safe `C.cut`, ~32 characters), "Elegiste: …" → ✓ "…", the due label; caught-up
  state. Designed moment: 3 mistakes from a1u01d2-d3 (one due today).
- Review: one due item at a time (choice / build asked in order / spell typed with a small pad), verdict, the track note
  ("Ahora en 3 días. Si acertás: en 1 semana."), summary. Designed moment: item 1 of 2 answered right.

## Row 6 · y 6420 · "Level exam: five parts, from the briefing to the constancia"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `ExamTab.dc.html` | 25 · Level exam tab | `$Y/Mock.dc.html` ($N/Y3 §6.9, §8.7) |
| 470 | `LevelExam.dc.html` | 26 · Briefing | `$Y/MockRun.dc.html` ($N/Y3 §6.10) + G6 §4 |
| 940 | `ExamReading.dc.html` | 27 · Part 1: reading | moment board: LevelExam `view="reading"` |
| 1410 | `ExamListening.dc.html` | 28 · Part 2: listening, after the sound check | moment board: `view="listening"` |
| 1880 | `ExamMediation.dc.html` | 29 · Part 3: mediation | moment board: `view="mediation"` |
| 2350 | `ExamSpeaking.dc.html` | 30 · Part 5: speak, then rate yourself | moment board: `view="speaking"` |
| 2820 | `ExamFull.dc.html` | 31 · Result: Apto and the constancia | moment board: `view="result"` |

- ExamTab: "Examen de nivel · A1" card: "5 partes · unos 80 minutos · podés hacerlo en varios días"; the five parts listed with
  minutes and how they are scored ("la app corrige" / "te evaluás con una guía" / "o tu docente"); two mini-exams ("Mini examen 1 ·
  20 min · mejor después de la unidad 4"); last result if any; a line: "Es una constancia de la app, no un certificado oficial.
  En Paraguay no hay hoy un examen oficial de guaraní por niveles." Taken state shows "Apto · autoevaluado".
- LevelExam (one component, every view): briefing (the five pruebas, two groups C and P, the rule: "Apto con 60 % en cada grupo y
  ninguna parte por debajo de 40 %", sittings over up to 7 days, "Empezar la parte 1"); reading paper (one clock for the part,
  "Pregunta 3 de 3", answer sheet with ovals, "Marcar para revisar", "Entregar"); break and sound check ("Pausa", "Prueba de
  sonido" with the stand-in); listening (paced by the audio, played twice at A1, "Tiempo para responder"); mediation (a Guarani
  notice → "¿Qué 3 datos le pasarías a tu vecina, en castellano?" key-point picking, auto-scored); writing (a form + a 20-30 word
  message, then self-rating against three sample answers below / at / above the level, rubric 0-3 per criterion: cumplimiento,
  coherencia, alcance, corrección); speaking (record yourself: the mic button with simulated states on the canvas, "Escuchate",
  then rate with the same rubric + fluidez and inteligibilidad; "Volvés a evaluarte en 48 horas y queda la nota más baja.");
  result (two group bars C and P with the 60 % line, each part's percentage, "Apto · autoevaluado" in the accent rosette stamp,
  or "Constancia de comprensión" when only group C passes; "Pedir corrección a un docente" (export) and "Ver respuestas").
  Content: `window.__gnExtra['exam-a1']` from `gn-extra.js`. Save the result with `save({ exam: { level, parts, apto, mode, at } })`
  computed by `C.examResult`.

## Row 7 · y 7704 · "Read, type, speak: the suite inside the app"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Leer.dc.html` | 32 · Read: hold a word (play this one) | Reader canvas `Main.dc.html` ($N/Y4 §2.2, §6.3) |
| 470 | `LeerHeld.dc.html` | 33 · Read: while holding a word | moment board: Leer `demo="<phrase index>"` |
| 940 | `LeerSettings.dc.html` | 34 · Read: what a hold shows | moment board: Leer `view="settings"` |
| 1410 | `Escribir.dc.html` | 35 · Type: catch the words before they reach Kaguare (Ehai · Escribir) | Yaoki Typing ($N/Y4 §3, §6.4) |
| 1880 | `EscribirFall.dc.html` | 36 · Type: Kaguare falls and gets up | moment board: Escribir `demo="fall"` |
| 2350 | `Hablar.dc.html` | 37 · Speak: hear and pick (Eñe'ẽ · Hablá) | Yaoki Speaking Falling ($N/Y4 §4, §6.5, judge 1) |
| 2820 | `HablarCompare.dc.html` | 38 · Speak: repeat and compare | moment board: Hablar `demo="compare"` (judge 3) |

- Leer: brand `<span lang="gn">Emoñe'ẽ</span> · Leer` (glossary). Hold-to-reveal exactly as the Reader canvas
  (pointer down/move/up, the lens above the finger, the dotted trail, looked-up chips by root, the finger disc in the demo);
  the lens rows: the phrase (Andika 700 26px), "Partes" (morphemes over Spanish glosses; roots ink, affixes muted), "Significado",
  "Gramática" pattern row (`#E8ECFB`, tag "Gramática"), "Nota". Settings sheet with the four switches (Partes de la palabra,
  Significado, Gramática, Pronunciación) and the promise box "No se muestra la traducción de la oración entera. Ves las piezas
  y armás la oración vos." Text from `window.__gnExtra.reader` (`gn-extra.js`).
- Escribir: the phone typing game ($N/Y4 §6.4 for every detail): HUD, the route stage with Kaguare at the left and word cards
  coming from the right, the info line (Guarani + Spanish), the in-app keyboard ("Teclado común" with the Guarani row
  ã ẽ ĩ õ ũ ỹ g̃ '), named near misses via `gnSpell`, the fall (Kaguare is knocked over, the stars, "Vuelve después de 2
  tarjetas") and the rise (he gets up on his hind legs: "¡Opu'ã! · ¡Se levantó!"), the clean-run chip with the rosette. Words: the A1 unit 1 words.
- Hablar: no speech recognition (phones do not recognise Guarani): judge 1 "Escuchá y elegí" (a clip plays, two or three
  falling things carry the word and its minimal-pair partners, tap the right one) and judge 3 "Repetí y compará" (record, then
  Modelo / Vos strips and "¿Sonó igual?" Igual · Casi · Otra vez). The canvas grants no microphone: a "Simular toma" button
  cycles the states. Pairs: only verified ones (`window.__gnExtra.speaking.pairs`).

## Row 8 · y 8988 · "Kaguare: mascot, icon and the ñandutí rule"

| x | File | Frame | Canvas title | Model |
|---|---|---|---|---|
| 0 | `Mascot.dc.html` | 1440×480 | 39 · Kaguare's moments | Mascot canvas `Mascot.dc.html` |
| 1520 | `Icon.dc.html` | 1120×640 | 40 · App icon on a Home Screen | Mascot canvas `Icon.dc.html` + `HomeScreen.dc.html` |
| 2720 | `Rules.dc.html` | 720×560 | 41 · Colours and the ñandutí rule | Mascot canvas `Rules.dc.html` |

(Not phone boards: no radius 44; `is_interactive` only if something works.)
