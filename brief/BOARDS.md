# The boards (canvas layout and specs)

Paths: `$Y` = `.../scratchpad/ref/Yaoki/yaoki/project` (Yaoki main app boards), `$N` = `.../scratchpad/notes`.
Every phone board is 390×844, radius 44, `is_interactive: true`. Row titles are canvas notes (written by the lead).
The sample state for plan boards (designed moment, relative to today, never drifting):
```js
const C = window.gnCourse; const T = C.today(C.now());
const full = { g: 3, k: 1, r: 1 };
const SAMPLE = { level: 'A1', started: true, plan: { start: C.addDays(T, -3), target: C.addDays(T, 60), pace: 'fit', minutes: 30 },
  done: { a1u01d1: full, a1u01d2: full, a1u01d3: full, a1u01d4: { g: 1 } }, tests: {}, exams: {},
  mistakes: [{ src: 'a1u01d3.d1', wrong: '', at: C.now() - 86400000, step: 0, due: T } /* one due today; Notebook and Review read theirs from the lessons */],
  cur: 'a1u01d4', placement: { comp: 'A2', prod: 'A1', start: 'A1' }, typed: [], seen: [C.addDays(T, -3), C.addDays(T, -2), C.addDays(T, -1)] };
// unit 1 ("Mba'éichapa · Saludos y sonidos"), days 1-3 stamped (three days with study), day 4 ("Preguntar con -pa") is today, its
// grammar teach page read, and one mistake of day 3 is due for review: the Cuaderno tab says 1 on the four tab bars.
```

**The voice's tag, on every board that plays a clip.** The clips of A1 units 1 to 5 are a synthetic voice's
(`sound/VOICE.md`). A board on its own loads no sound file and shows its silent stand-ins; in the prototype and the app,
wherever a control's clip is a voice model's, the tag «voz sintética» stands next to it from the start: a grey chip
(`#5A6382` on `#EEF0F6`, 11 px/800, radius 8), never in a live region, hidden by its `sc-if` on the canvas. The
recipe and the two lines a new board needs are in BRIEF-core.md §6 (`gnCourse.synth`); where the tag goes is said
with each board below. A control without a clip keeps its stand-in and its «todavía no está grabado», which is also
true of a clip the voice must not say (`sound/silent.json`). The prototype board says what the tag means once, for a
screen reader, in a 1-px live region of its own (`gnCourse.voiceNote()`, on the document's `gnvoice`), as the app's
shell does: when a tag is really drawn (it carries `data-gn-voice="tag"`), not when a board only asks about a clip,
and the region is emptied again eight seconds later.

**A clip that is not there, on every board that plays one.** «No clip» is not one thing, and each board asks the
engine which (`gnCourse.soundState(key)`, BRIEF-core.md §6) instead of `gnSound.has()` alone:
- *coming*, its sound file is asked for and not in yet. The control waits, with a look of its own
  (`gnCourse.SOUND_WAIT`: a dashed `#9AA1B5` edge on the ground `#F4F5F9`, its icon and label in `#5A6382`, no hard
  shadow) and a chip «cargando el audio…» (the tag's recipe) where the tag goes, or «Cargando el audio…» in the
  line a player has for its status. Tapped, it lights nothing, runs no stand-in, shows no word and no transcript,
  opens no answer and counts nothing, and says «Cargando el audio…» in its own live line (so that a screen reader
  hears it once, at the tap); where a play starts by itself later its icon beats slowly (`gn-wait`, 1.4 s). No clock
  runs meanwhile. When the file arrives (`gnsound`) the control is ready, the tag in the chip's place, no note left.
- *failed*, the file could not be fetched, or is not in 20 s after a control began to wait. The board's written
  stand-in, with «No se pudo cargar el audio» where «todavía no está grabado» would stand.
- *off*, the learner turned the voice off. The stand-in, with «Apagaste la voz sintética: … La activás de nuevo en
  Progreso.»
- *none*, as before: «todavía no está grabado».
A stand-in that has shown something stays for that item while the board is open, whatever arrives later. Whether a
tapped clip plays by itself when its file arrives is said with each board: it does where a play is free and can be
repeated, and a second tap, another control or leaving calls it off; it does not where plays are counted or the audio
sets the pace. The words are the engine's (`gnCourse.soundNote(state, then)`, `gnCourse.soundWhy(state)`). The canvas
alone has no sound index: every key is *none* there, and the designed wording stays.

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
  Opened again on a plan that exists (Main's date chip, Progreso's «Rearmar mi plan»: the app only), step 3 is the way
  to change the plan: the line under the heading reads "El plan se arma de nuevo desde hoy. Lo que ya hiciste queda
  hecho." (its second sentence only once a session is done), the plan box counts what is left ("Te quedan 48 de 56 sesiones", its note worked out on those), and the
  buttons are "Heja · Cancelar" (white, back to the screen that opened it, nothing saved) and "Ñongatu · Guardar el
  plan" (indigo, then the week path): the plan saved starts today at the session the learner had reached (`plan.from`,
  the engine's `C.reached`). This state is a door, not the last of three steps: the header's arrow is then a link that
  does what "Cancelar" does ("Volver al camino sin cambiar el plan", or "Volver a Progreso…": the screen that opened
  the door writes its name in the draft, `from`), where steps 2 and 3 of a first run have the button that steps
  back; so nobody who came to change a date is walked back through "¿Desde dónde empezás?", and the app counts the
  door one step under the screen it leads back to (gn-app.js reads the link's `href`).
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
While a listening question's clip is on its way the player waits («Cargando el audio…», the options shut, the
exchange not shown, no play counted), and nothing starts by itself when it arrives, because the two plays are counted:
the line then says «Podés escucharlo dos veces.». A clip that could not be loaded, or a voice turned off, is read from
the exchange like a clip that is not recorded, and the line says which («No se pudo cargar el audio: leé lo que se
dice.»); a question that has been read stays read. A clip that will not start (the phone's audio held elsewhere) says
«No se pudo reproducir el audio: así se dice.»
A listening question whose clip is a voice model's carries the tag at the end of the player's line («Podés escucharlo
dos veces.»), outside that line's live region.

## Row 2 · y 1284 · "Every day: a week, a day, six levels, how you are doing"

| x | File | Canvas title | Model |
|---|---|---|---|
| 0 | `Main.dc.html` | 6 · Week path | `$Y/Main.dc.html` ($N/Y1 §5.3) |
| 470 | `Today.dc.html` | 7 · Today's spread | `$Y/Today.dc.html` ($N/Y1 §5.4) |
| 940 | `Levels.dc.html` | 8 · Six levels in one app | the Shell menu's level box ($N/Y1 §5.6) grown into a full screen |
| 1410 | `Progress.dc.html` | 9 · How am I doing | `$Y/Readiness.dc.html` ($N/Y1 §5.5, §6.4) |

**Main**: Yaoki's layout and SPOTS exactly. The unit's title on the card is the screen's `<h1>`. Level chip "A1" (→ `go('Levels')`); stamps chip with the mini ✓ stamp; the
date chip, an ink-bordered link like the level chip, is the door back to the plan ("faltan 60 días", or "a tu ritmo"
with no date; on the canvas it shows GoalPlan, in the app the goal screen at step 3). Unit card: kicker "Semana 1 de 8", the unit's Guarani title big (`unit.gn`,
Andika 700 26px, `lang="gn"`; 22 px from 14 letters on and 18 px from 18, two lines at most) when it has one, else the
Spanish; the Spanish under it 13/500 muted; Kaguare 60 px with the level rosette (rings = units done). Stamp card of 7 slots (✓ stamps; test slot with the stopwatch). The card carries
`data-gn-note="place"`: it holds no control, so the app lays its notice exactly over it (BRIEF-core §2; the path below
is full to its last node). Path nodes: done ✓
stamp (accent ring, 52 px), today (indigo 68 px, day number), locked (padlock, 52 px), test (stopwatch, 60 px, gold
when ready). Labels: "Día 4" + the day title (14px; two lines at most, one for day 6, which has the test node right
below; `overflow-wrap: anywhere`); test "Prueba de la semana" + "formato de examen".
Callout kicker "HOY · 3 LECCIONES" (or "SIGUIENTE"), title, "Empezar". A day's title is Spanish that may quote Guarani
("Más de uno: ogakuéra, mitãnguéra"): in the labels and in the callout it is drawn in the pieces of `C.mixed(title)`, the
words that can only be Guarani in `<span lang="gn">`, and all the pieces inside one `<span>`, so the clamped box
(`display: -webkit-box`) keeps a single child; the label's line count and the callout's height are still reckoned from the
whole title (`C.ems`), which the pieces spell letter for letter. Tabs: Camino (Main) · Cuaderno (Notebook) · Examen
(ExamTab) · Progreso (Progress). Designed moment: SAMPLE.
What the callout adds (it grows upward, over the days done, so the labels of the days to come stay in view; the nodes
sit on top of it where they meet). Its height is reckoned from its lines before it is drawn (20 px a line of title,
17.4 px a line of small print: 12 px at 1.45; the sum rounded up to a whole pixel), and it never ends below y 404 of
the path, 4 px above the week-test node:
- The review that waits (`app.review.n` > 0): a row above the button, accent tint, 44 px, "Antes de empezar · 2 min" over
  "3 para repasar", → Review.
- A day of return (`app.days.away` ≥ 2: two days or more without study and nothing done yet today): the kicker gives way
  to the comeback mark (the up arrow in a teal ring) and "Opu'ã · Se levantó", the title is "¡Volviste!", the line
  offers something short ("Empezá con algo corto: 4 para repasar, 2 minutos."; a sitting of more than five minutes is
  not called short: "Empezá por el repaso: 25 para repasar, 15 minutos."), the button is "Jehechajey · Repasar",
  and quiet buttons follow: "Repasar la semana 1" (after seven days or more: the last review day sealed) and "Seguir
  con el día 5" ("Seguir: semana 2, día 1" when the week on show is whole and the day is in the next one). With nothing
  due the button is the review day ("Repasar la semana 1", under the line "Empezá por el repaso de la semana 1, que
  ya sellaste.": a review day is three lessons, so it is named and not called short), or the day itself ("Lo que
  hiciste sigue acá. Sigue el día 5."). In the
  unit card Kaguare takes the rising pose that day, before and after the first thing done (`app.days.back`).
- Where the written path ends (the card with no button: the week whole, the next day or week not written): a kicker
  "MIENTRAS TANTO" and four tiles, Cuaderno (with "3 para hoy"; "16 hoy" from ten on, so the tile's second line
  stays one line) · Emoñe'ẽ Leer · Ehai Escribir · Eñe'ẽ Hablar. A mini
  exam that is open and not taken yet (`gnCourse.minis`: the week test it waits for is done, no result at its id) is
  named first, above the kicker: a gold tile, 44 px, the stopwatch, "Mini examen 1" over "20 preguntas · 20 min", →
  the Examen tab. On a day
  of return this card too opens with the comeback mark and "¡Volviste!". A practice section opened here, or from a
  sealed day's "¿Un rato más?", closes to the screen that opened it (the engine's `go` keeps the door; the three boards
  still ask for Progreso, which is where the canvas alone takes them).
"Últimos 7 días", bottom left of the path beside the test node: seven 14-px marks, today last (`app.days.week`): a day
with study (accent disc), a day of return (teal ring, up arrow), a day missed (grey ring), today still to come (dashed
indigo), a day before the record began (a faint dot: nothing is claimed). Its accessible name says what is drawn
("Tus últimos 7 días: 2 días con estudio. Hoy todavía no."; "Hoy ya estudiaste.", "Hoy volviste."). A faint dot is
not a day without study: when any of the seven days is before the record began (a new learner's first week, a save
from before the app kept the days) the name counts only the days on record and says since when, the month as a word
("…: 1 día con estudio desde el 16 de noviembre; de antes no hay registro. Hoy ya estudiaste.", `gnCourse.dayEs`),
and with no day on record yet it counts none ("…: todavía no hay ningún día registrado. Hoy todavía no.").

**Today**: Yaoki's layout. Header "Semana 1 · Día 4" (derive from `app.session`, not the id). Kicker "HOY · TRES LECCIONES",
h1 the day title (in the pieces of `C.mixed`, its Guarani words in `<span lang="gn">`, as on the week path), sub "Aprendé la regla, practicala con ayuda y después respondé como en el examen." Cards:
1 Gramática (tile 46×46 indigo tint with "-pa" in Andika 700? no: a short glyph-free icon is clearer: the grammar tile shows
the day's first form, e.g. "-pa", in Andika 700 18px; 15 px for four or five letters, 13 px when five letters hold a
wide one, an M or a w, so that «Moõpa» is not cut by the tile's edges, 12 px beyond), "Gramática · 2 formas", the points' forms as title; pills Aprender ·
Practicar · Examen (done ✓ teal / now indigo / todo); CTAs "Empezar con la regla" / "Seguir con la práctica" / "Al examen".
2 Palabras (accent tint tile showing the day's hard letter, e.g. "'" or "ẽ"): "Palabras · 7 · Sonido y letra: el puso";
title the scene; pills Sonido · Aprender · Escribir · Examen at A1-A2 (Sonido only when `words.sound`).
3 Lectura or Escucha (gold tint tile with the book or speaker icon). Footer: dashed stamp + "Terminá las tres lecciones para
sellar el día 4." / done: stamp animated + "¡Día 4 completo!" + "Volver", and under it "¿Un rato más?" with three tiles
(Emoñe'ẽ Leer · Ehai Escribir · Eñe'ẽ Hablar). With a review waiting, the line under the title gives way to the same
row as Main's, 48 px with the notebook icon: "Antes de empezar" (nothing of the day done yet) or "También hoy", over
"3 para repasar · unos 2 min", → Review. Designed moment: SAMPLE (grammar at g=1: Practicar now; one to review).

**Levels** (the one-app level menu, from the level chip; also reachable from the menu): title "Seis niveles, una app"
(+ "Niveles de referencia para el guaraní" 12/500 muted), a vertical list of six level cards A1…C2, each: code 22/800,
Spanish name 15/800, the can-do line (12/500), units 8/10/10/10/8/6 and days written, the level's rosette (40 px; rings =
units done; full + teal ✓ ring when Apto), a progress line "3 de 56 sesiones · Semana 1" for the current level, "Examen de
nivel: Apto · autoevaluado" when passed, "En preparación" (dashed card, muted) for unwritten levels; the current level has the
hero look. Tapping a level → `this.props.level(lv)` (keeps each level's plan; Goal the first time). A footnote: "Cada nivel
termina con un examen de cinco partes. El resultado es una constancia de la app, no un certificado oficial." Designed moment:
A1 current (3 days stamped), A2 to C2 en preparación except the syllabus counts.

**Progress** ("¿Cómo voy?", replaces Readiness, computed, never hard-coded): header "¿Cómo voy?" with "Progreso · A1"
beside it; hero card: the level's rosette 96 px with its rings (88 px while the row "Rearmar mi plan" shows, below),
the kicker "Ñandutí del nivel A1", "Unidad 1 de 8" over "3 de 56 sesiones", a pace line (with a target: "Vas al día" /
"2 días atrás"; without: "A tu ritmo"; beside it "faltan 40 días", "falta 1 día", "hoy es la fecha" or "fecha
pasada", as the week path's chip says it), the days with study on one line ("12 días con estudio · volviste 2
veces", from `app.days`; the returns only while they fit beside the count: the line has 216 px, 224 with the row)
and, behind the plan or past its date, an accent-tint row: "Epu'ã ha
eñepyrũjey" over "Levantate y empezá de nuevo." with the button "Rearmar mi plan" (→ the goal screen at step 3, which
closes back to Progreso; GoalPlan on the canvas). On time the five cards fill the screen to the pixel, so while that
row shows the screen makes room for it and nothing is cut at the fold: the hero card draws in (no kicker, the
rosette 88 px, padding 8 px) and the two lines of small print ("Es una guía…" under the bars, "Lo marcás vos…" over
the chips) are left out; every control and number stays. A save from before the app kept the days (`app.days.since`,
the first day on record of a learner the app marked `seenLate`) says since when its count runs, "3 días con estudio
desde el 16/11", while the record is young: for its first 30 days, when the count is far under what the learner did.
That note and the returns never fit the line together, so after those days the line reads as everyone's, returns
and all. The line's accessible name (`role="img"`, as the area rows) leaves nothing out for want of room: it always
says since when such a count runs, the month as a word and the year once it has turned ("3 días con estudio desde el
16 de noviembre. Volviste una vez.", `gnCourse.dayEs`), and carries the returns whenever there are any. "Por área" card: bars for Palabras, Gramática, Lectura, Escucha (right/of summed from
the week tests' `tests[*].areas`; a mini exam asks their questions again and is left out), a 60 % target tick on each, an area under the line in red with a chip; empty state
before the first week test ("Después de tu primera prueba de la semana vas a ver acá cómo te va en cada área."); "Próximo
paso" card linking to the weakest area (red CTA "Practicar"), else to the next session, else, with no day left to do,
to a mini exam that is open and not taken yet ("Sigue: Mini examen 1 · 20 preguntas, 20 min", "Abrir" → the Examen
tab); the exposure log (G6 §6, G3 "Lo usé"): "Esta semana usé el
guaraní con alguien" toggle chips (familia · trabajo · calle · WhatsApp), self-reported, never checked; footnote "Es una
guía, calculada con tus pruebas de la semana." Designed moment: show the empty state? No: show a sample with week-test
areas from a1u01t (vocab 5/6, grammar 6/8, reading 3/3, listening 1/3 under the line) so the bars and the red chip are designed.
**Voz sintética, the one place that explains the voice.** While the sound index names a voice model
(`gnCourse.synthVoice()`: the prototype and the app; a board on its own loads no index and draws none of this), the
header carries a quiet button at its right end, the speaker and «Voz sintética» (44 px, `2px solid #DDE1EC`; the
speaker's wave becomes a cross when the voice is off; its accessible name says which). It opens a sheet: «Voz
sintética»; what it is («Los audios de la app los dice un programa (los modelos MMS, de Meta), no una persona. Todavía
no los revisó ningún hablante nativo.»); a white card «Qué hace mal» with four lines (the nasal vowels: the pairs that
differ only by one stay without audio; the dialogues: one voice, a man's, for both speakers, his a little lower; the
names and numbers in Spanish; and «A veces falla en la sílaba fuerte, en el puso (') después de o, u, y, y en la r al
empezar una palabra.», what `sound/VOICE.md` marks as rendered in part or not); that some words and phrases stay silent
on purpose and wait for a person, where the screens say «todavía no está grabado», and that recordings by native
speakers will replace the voice; in the app, what this phone does with the sound (`gnApp.sound`: «Este iPhone guarda
el sonido de a poco, para usarlo sin conexión: tu unidad, la siguiente y Hablar (cerca de 0,9 MB por unidad). Lo
demás se baja cuando lo abrís.», or, when the browser says the learner saves data, that it comes one unit at a
time, or, with the voice off, that none is fetched); the switch «Usar la voz sintética» (Leer's switch recipe,
`role="switch"`; `save({ voice })`, saved with the progress, on by default: off, the player has no synthetic clip and
every screen shows its written stand-in and says that the voice is off); the credit (MMS-TTS, Meta AI, CC BY-NC 4.0)
with, in the app, a quiet button «Licencias» beside it (44 px); «Oĩma · Listo». The sheet fits both phone sizes
without scrolling (773 px of the 784 it may take): a line added there must make room for itself. «Licencias» turns
the sheet to its second page: the heading «Licencias», the whole of the app's `licenses.txt` in a white box that
scrolls (11 px, `lang="en"`, its paragraphs joined again so that the box wraps them; `gnApp.licences()` reads the
file, which the offline copy holds), and «Tapykue · Volver». One step back from it is the sheet's first page: by
«Volver», by a tap on the scrim, and by the system's back, which presses the scrim (so the scrim's handler steps
back a page before it closes the sheet).

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
- A day that is not written: Teach, Compare, Build and Words (its scene) draw "En preparación" and a line that names
  the day by its title ("«Hay, está y no hay: oĩ, ndaipóri»: todavía estamos escribiendo esta lección.", "Las palabras
  de «…» todavía se están escribiendo. Volvé pronto."). The title is Spanish that may quote Guarani, so the line is
  drawn in the pieces of `C.mixed`, its Guarani in `<span lang="gn">`, as on the week path. No flow of the prototype
  or the app leads to that state (the engine hands a screen written days only: `C.current`), so
  `tools/smoke-boards.mjs` stands each board once on such a day and stops a line that prints its Guarani as plain text.
- Teach: opened for a review day, which has no points (the day page leads to Compare there, so only a kept link gets
  here): a card with the day's kicker, «Hoy no hay reglas nuevas» as the screen's `<h1>`, a line and "Comparar".
  Otherwise: form h1 in Andika 700 34px with `lang="gn"`; "Cómo se forma" rows (pos stacked above the rule when longer than ~12
  characters); "Ejemplos" with play buttons (the stand-in, or the clip: the card's head then carries the tag «voz sintética»
  at its right end, one tag for the card, while any of its examples has a synthetic clip; an example without one says
  why under itself once tapped: «Este audio todavía no está grabado.», «No se pudo cargar el audio.» or «Apagaste la
  voz sintética: la activás de nuevo en Progreso.», the note of that tap, which stays until another example is
  played. While the unit's sound is on its way the head says «cargando el audio…», the buttons wait, a tapped one
  says «Cargando el audio…» under its example and plays by itself when the file is in) and, per example, an optional "Partes" line: the morphemes as small
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
- Drill: the header's "PRÁCTICA" is the screen's `<h1>` (a build item's title is a second one, under it). Choice and build items; build items render as morpheme or word tiles (bank 2 columns; slots; for `join: 'word'` the
  slots sit tight with a hairline between, the joined spelling `full` shown in the answer sheet); verdicts "¡Correcto!" /
  "Casi" (+ Guarani from the glossary if verified); sheet head "Por qué cada opción" / "La palabra" / "La oración"; wrong →
  `miss({ src, wrong })` and "Guardado en tu cuaderno de errores. Vuelve mañana."; last → "Terminar la práctica" +
  `save({ prog: { g: 2 } })`. Designed moment: a1u01d4 item 1 answered wrong and explained. The sheet is at most 522 px
  tall: longer reasons scroll inside their white box and the button to go on stays in view under them. Options sit two
  by two only while every option's longest word fits its half-width button with the mark in (`gnCourse.wordEms`).
- Build: the build item showcase, data-driven (first build item of a1u01d4's drill), two tiles placed and the hint open.
- Exam: day set 150 s "EXAMEN · SIN AYUDAS" (the ink band's title, the screen's `<h1>`; the result's score is a second heading under it), "Sin pistas ni glosas. Las respuestas, al final."; week test set 1200 s; clock pill
  `role="timer"`; build items asked as tiles in order (the whole order counts here, not a single starred tile: Guarani words
  are short in tiles); result view: score, "1:48 de 2:30", rows with ✓/✗, the full sentence, explain; "Siguiente"
  leads on. Everything is saved when the exam ends ("Terminar", or the clock at 0), in one moment: the misses to the
  notebook and `save({ prog: { g: 3 } })` (day) or `save({ result })` (test, mini exam). The result page only shows
  it, and goes on showing the exam that was taken while the app's memory moves on: left by its button, by its cross,
  by the system's back, or with the app closed on it, the exam stays taken. Leaving part way is another matter: a
  day's three questions are left at once, but a week test or a mini exam with something answered is twenty questions
  on one clock, and its cross asks first, as the level exam's does: a sheet, "¿Salir de la prueba?" ("¿Salir del
  mini examen?"), "Si salís ahora se pierden tus respuestas: la prueba empieza de nuevo, desde la primera pregunta.
  El reloj sigue mientras decidís.", "Eku'ejey · Seguir con la prueba" and "Salir sin guardar"; its scrim goes on
  with the test. The system's back presses the cross, so it asks too. (On the canvas alone the cross is a link, and
  the sheet shows in the prototype.) Designed moment: question 2 of 3 with an option pressed, 1:42.
  A third set, the mini exams (`set: 'mini1'` or `'mini2'`, from the Examen tab): the band reads "MINI EXAMEN 1", the
  questions are `gnCourse.mini`'s 20 on a 20-minute clock, the result is saved under its own id (`a1m1`) when the
  exam ends, and both ways out of the result page (the cross and "Siguiente") lead back to the Examen tab.
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
  size, 22 px or as much less as the longer one needs to stay whole in its tile (never under 15). A pair whose clip is
  a voice model's carries the tag «voz sintética» at the right end of its head («PAR 2 DE 3»). In the prototype and the
  app a pair without a clip shows the word its speaker stands for («Tocá el parlante: te mostramos la palabra.»); with
  every pair so, the step is read («MIRÁ Y ELEGÍ», «…estos pares todavía no tienen audio.», or «…no se pudo cargar
  el audio de estos pares.», or «…apagaste la voz sintética. La activás de nuevo en Progreso.»); with some, it is heard
  and its first line counts them («Un par todavía no tiene audio: ahí te mostramos la palabra.»). While the unit's
  sound is on its way a pair waits: «cargando el audio…» in its head, its speaker in the waiting look; tapped, its
  line says «Cargando el audio…», its word is not shown and its two options stay shut, and its clip plays by itself
  when the file is in. A pair whose word has been shown stays read while the lesson is open. In the scene, a word's
  note («Este audio todavía no está grabado.», or the other two reasons) belongs to that word: it shows on its card
  for every word without a clip once its speaker is tapped, and goes when another word is picked or a clip plays; a
  word tapped while its clip is on its way says «Cargando el audio…» and plays when it is in.
- Aprender: Yaoki's navy sign board (`#1B2440`, 2 columns of chips, M PLUS 17/800, `lang="gn"`, min-height 46 so two-word
  phrases fit); tap a chip → the word card: the word (Andika 700, 40/34/28 px by length), syllables with the stressed one in
  `#C7361E` (from `gnSpell` helpers if present, else omit), the Spanish 13/500, play button, "Partes" tiles (2 columns: piece
  in Andika 22/700, meaning 12/500). The Spanish has a line of its own under the word and the speaker; the tag «voz
  sintética» stands at that line's right end, under the speaker, when the word's clip is a voice model's. Found badge ✓. "Después vas a escribir 3 palabras con letras nuevas: ', ẽ."
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
  2 misses (yellow) and 4 (filled in); buttons Escuchar · Pista · Otra vez (the tag «voz sintética» centred under
  «Escuchar» when the word's clip is a voice model's; «cargando el audio…» in its place, and «Escuchar» in the waiting
  look, while the clip is on its way: tapped, the line says «Cargando el audio…» and the word plays when it is in;
  the dictation that opens the third time, which no tap asked for, simply goes without); the syllable strip if syllables are available.
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
  reading (the review day), unanswered, clock running. A word that can be tapped is a box of its own in its line, and
  a line may break at a box's edge, so the signs that touch it go with it in a group that does not break: the stop,
  comma or colon after it and an opening ¿ or « before it (only where a space or the passage's end is on their other
  side; a hyphen or a colon between two words stays put). Without that the timetable of unit 5 day 3 showed
  «mbo'ehao» and, a line below, its stop alone; `check/platform-test.js` now fails on a closing sign that starts a
  line without its word, on any screen.
- Listening: play → answers unlock; "Repetir"; "Más despacio" (a recorded slow take; disabled when missing, with what
  is true under it: "Todavía no hay versión lenta" where the lesson's clip plays and has no slower take, "Todavía no
  está grabado" where the lesson has no clip, "Cargando…", "No se pudo cargar", "La voz está apagada"). The player
  follows the clip's state: on its way, the play button waits and the status line says «Cargando el audio…», no
  transcript opens and the answers stay shut («Escuchá primero…»), and a tap is kept: the clip plays by itself when
  the file is in; not loaded, or the voice off, the status line says so («No se pudo cargar el audio: se reproduce en
  silencio.») and the first tap opens the transcript under «No se pudo cargar el audio: leé lo que se dice.»; once the
  transcript has opened the lesson stays read; nothing printed until answered ("No hay nada escrito hasta que respondas, como en el examen."); after: the
  script with speaker tags (Narrador / Mujer / Hombre) and "Ver traducción"; stand-in highlights each line as it "plays".
  Designed moment: a1u01d1's listening, played once, an answer picked. The status line under the waveform names the line
  and its speaker while it plays («Línea 2 de 5 · Mujer», «Respuesta 1 de 3 · Hombre»): with a clip it keeps time by
  the clip's own cues (`gnSound.cues`, `gnCourse.cueLine`), with the stand-in by the lines' lengths. The tag «voz
  sintética» stands at that line's right end when the clip is a voice model's.
- WeekTest: intro ("Prueba de la semana", 20 preguntas, one 20-minute clock, "Por área" counts, "Empezar la prueba" → Exam set
  'test') and result (score 56px, the result's `<h1>`: for a screen reader it says what it is, "Prueba de la semana: 16 de 20",
  the words clipped to 1 px and the drawn "/ 20" hidden from it; the praise stamp by share ≥ 0.8 / ≥ 0.6 / else with Spanish "¡Excelente!" / "¡Muy bien!" /
  "Seguí practicando" and the Guarani accent from the glossary, bars per area with "Punto débil", "6 errores fueron a tu
  cuaderno", "Ver errores", "A la semana 2"). Designed moment: the result of a1u01t, 16/20 with Escucha weak. The
  onward button names the next week only when this week is whole and the next session due is in another week; a test
  taken early, or the test of the last written week, reads "Tapykue · Volver" and leads back to its own week.
- Notebook: "Cuaderno de errores": "Para repasar hoy" count + "Repasar ahora"; the track (mañana · en 3 días · en 1 semana ·
  ¡aprendido!); rows with the quote (grapheme-safe `C.cut`, ~32 characters), "Elegiste: …" → ✓ "…", the due label; caught-up
  state. Designed moment: 3 mistakes from a1u01d2-d3 (one due today). The count is today's sitting (`gnCourse.sitting`:
  a third of the plan's minutes a day, the oldest due first); with more waiting it says so ("Hay 45 esperando. Hoy van
  las 16 más viejas; las otras 29 quedan para los próximos días."; with one left of the sitting, "Hoy va la más
  vieja"), those rows read "en espera", and once the day's
  sitting is done the card says "listo por hoy · Quedan 29 para los próximos días." with a quiet "Repasar 16 más". A row
  that is due keeps "Elegiste: …" and holds the right answer back ("→ la respuesta, al repasar") until it is reviewed.
  Each piece of a row's quote carries its own `lang`, worked out on the whole question before it is cut: a line's own
  language, Guarani inside « » on a Spanish line, and the words that can only be Guarani (`gnCourse.mixed`).
- Review: the header's "REPASO" is the screen's `<h1>`. One due item at a time (choice / build asked in order / spell typed with a small pad), verdict, the track note
  ("Ahora en 3 días. Si acertás: en 1 semana."), summary. Designed moment: item 1 of 2 answered right. It asks today's
  sitting (or one more, when today's is done). Inside the prototype and the app a choice's options come in another
  order than the lesson's, and the right answer's place is set by rule: never the place the lesson gave it and, with
  three options or more, never the place it had at the question's last turn on the track. The track's steps (1, 3
  and 7 days) are all odd, so the answer takes two of the other places in turn, one on even days and one on odd days
  (which two, by the item): one, three or seven days later it stands elsewhere. A review made late by an odd number
  of days finds it where it was (nothing is kept of where an answer stood). The rest are dealt by `gnSpell.shuffle`,
  seeded by the item and the day, and the buttons are numbered as shown. An item whose audio numbers its replies
  keeps its order, and so does the canvas board. The header's cross leaves for the
  screen the review was opened from (`app.opener`: the notebook, the week path's row or the day's row; the notebook
  on the canvas). The
  summary's button is "Eku'ejey · Seguir con el día 4" (the next session of the plan; "Seguir con la prueba" for a week
  test), with "Tapykue · Volver al cuaderno" as a text link under it, and it says what still waits ("Quedan 12 para los
  próximos días."). A listening item's play card («Ehendu · Escuchar») follows the clip's state as Listening's
  player does (waiting with «Cargando el audio…» and the options shut, the clip playing by itself when the file is in;
  «No se pudo cargar el audio: tocá y leé lo que se dice.»; an item read stays read) and carries the tag «voz sintética» at the right
  end of its title when the clip is a voice model's, and while the clip plays its note names who is speaking, by the
  clip's cues («Sonando… Línea 2 de 5 · Hombre»: two items can only be answered by knowing it): the name stands beside
  the note, outside its live region.

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

- ExamTab: under the title, "Cada nivel termina con un examen de cinco partes. Antes, dos mini exámenes repasan con
  reloj lo que ya hiciste." (a mini exam is week-test questions on a clock: it does not show the level exam's format,
  and the line does not say so); "Examen de nivel · A1" card: "5 partes · unos 80 minutos · podés hacerlo en varios días"; the five parts listed with
  minutes and how they are scored ("la app corrige" / "te evaluás con una guía" / "o tu docente"); two mini-exams, each
  made of the week tests of its half of the level (`gnCourse.minis`): not written yet, "20 min · mejor después de la
  unidad 8" and the chip "En preparación"; written but behind a week test still to take, "20 preguntas · 20 min" and the
  chip "Después de la semana 4"; open, "20 preguntas de las semanas 1 a 4 · 20 min" and the button "Empezar" (→ Exam,
  `save({ set: 'mini1' })`); taken, "Último resultado: 18 de 20 · martes 10 de noviembre" and "Otra vez"; last result if any; a line: "Es una constancia de la app, no un certificado oficial.
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
  computed by `C.examResult`. Where the listening part's clips are a voice model's, the tag «voz sintética» stands in
  the pause before it, at the right end of «LA PARTE QUE SIGUE», and in the part itself in the audio's card, between
  the waveform and the speaker mark. The part's audio is asked of the engine over all its clips (`p2State`): while
  their sound file is on its way the pause waits: «cargando el audio…» in that head, the sound check and «Empezar la
  parte 2» in the waiting look (the button `aria-disabled`), «Cargando el audio…» in the line of each, and a tap on
  either starts nothing, then or later (an exam's part begins at the learner's tap; the pause's own clock is a rest,
  not a deadline); the part's clock does not run before the part begins. With a clip missing, not loaded, or the
  voice off, the whole part is read from its transcript (as when nothing is recorded), and the pause, the band and
  the transcript's note say which («No se pudo cargar el audio», «Apagaste la voz sintética»); the result and the
  teacher's text say that the recordings are being made only where the sound index has no file for the exam.

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
- Escribir: the phone typing game ($N/Y4 §6.4 for every detail): an `<h1>` for screen readers only ("Ehai · Escribir", not drawn: the round has no title), HUD, the route stage with Kaguare at the left and word cards
  coming from the right, the info line (Guarani + Spanish), the in-app keyboard ("Teclado común" with the Guarani row
  ã ẽ ĩ õ ũ ỹ g̃ '), named near misses via `gnSpell`, the fall (Kaguare is knocked over, the stars, "Vuelve después de 2
  tarjetas") and the rise (he gets up on his hind legs: "¡Opu'ã! · ¡Se levantó!"), the clean-run chip with the rosette. Words: the A1 unit 1 words.
  The round's X opens the pause ("Pausa": "Eku'ejey · Continuar", "Salir de la ronda"), a sheet with no scrim; its
  "Continuar" carries `data-gn-back="sheet"`, so in the app the system's back pauses the round and, pressed again,
  goes on with it (BRIEF-core §2). Hablar's pause is the same.
- Hablar: no speech recognition (phones do not recognise Guarani): judge 1 "Escuchá y elegí" (a clip plays, two or three
  falling things carry the word and its minimal-pair partners, tap the right one) and judge 3 "Repetí y compará" (record, then
  Modelo / Vos strips and "¿Sonó igual?" Igual · Casi · Otra vez). The canvas grants no microphone: a "Simular toma" button
  cycles the states. Pairs: only verified ones (`window.__gnExtra.speaking.pairs`). The round's X is a round floating
  button over the game (no header recipe, no negative margin): it carries `data-gn-back="screen"`, which is how the
  app's back finds it and opens the pause, as a tap does. The status line is drawn in pieces
  (`C.mixed`): a hint that names a Guarani letter («la tilde nasal (ã)») carries it in `lang="gn"`. While the card in
  play has a synthetic clip, the tag «voz sintética» stands at the right end of the dock's second line (the line that
  says what is sounding), and under «Modelo» in the comparison; a card without a clip shows its word («La palabra ·»)
  and no tag. In the prototype and the app the menu's note says what is true of the audio: none at all («…cada botón
  de sonido se ilumina sin sonar.»), or «Los audios los dice una voz sintética. Todavía no tienen audio 4 de los 8
  pares: ahí se muestra la palabra.» (a pair with one silent word is counted apart: «…ni una de las dos palabras de
  otro par…»; that word's card shows the word, the other one sounds), or «Cargando el audio…», or «No se pudo cargar
  el audio: cada botón de sonido se ilumina sin sonar y se muestra la palabra.», or «Apagaste la voz sintética: … La
  activás de nuevo en Progreso.» While the game's sound file is on its way «Escuchá y elegí» holds: the first pair
  stays at the top, nothing falls, no hint is raised, a tap on a card counts for nothing, the dock says «Cargando el
  audio…» and «La ronda espera: nada cae mientras tanto», its big button in the waiting look; the round goes on by
  itself when the file is in, since it plays each word itself. In «Repetí y compará» the round goes on (the sign is
  read) and «Escuchar» waits: tapped, the dock says «Cargando el audio…», nothing stands in and nothing is counted as
  help, and the model does not play by itself later. A card shown written stays so for the round. The comparison's
  «Modelo» strip plays the model's clip; where there is none its row says why («Todavía no está grabado», «Cargando
  el audio…», «No se pudo cargar el audio», «Apagaste la voz sintética»).

## Row 8 · y 8988 · "Kaguare: mascot, icon and the ñandutí rule"

| x | File | Frame | Canvas title | Model |
|---|---|---|---|---|
| 0 | `Mascot.dc.html` | 1440×480 | 39 · Kaguare's moments | Mascot canvas `Mascot.dc.html` |
| 1520 | `Icon.dc.html` | 1120×640 | 40 · App icon on a Home Screen | Mascot canvas `Icon.dc.html` + `HomeScreen.dc.html` |
| 2720 | `Rules.dc.html` | 720×560 | 41 · Colours and the ñandutí rule | Mascot canvas `Rules.dc.html` |

(Not phone boards: no radius 44; `is_interactive` only if something works.)
