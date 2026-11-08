# Design brief, part 2: the Guarani app's look, words and boards

Read part 1 (`BRIEF-core.md`) first: format rules, wiring, typefaces, tokens, engine, content shape.

## 1. The app in one paragraph

**Epu'ã** ("¡Levantate!", an attested Guarani imperative; G5 §1) — canvas "Epu'ã Guaraní App". Tagline, attested word
for word in real Guarani text: **"Epu'ã ha eñepyrũjey"** ("Levantate y empezá de nuevo"). The name answers Yaoki's
七転び八起き: you fall, you get up and start again. ("Ñapu'ã" was rejected: it was the government's 2020 recovery plan.). A phone app (an installable web app, like Yaoki) that teaches Paraguayan Guarani to Spanish speakers, built
on the Yaoki suite: the course of Yaoki's main app and the plan-to-a-date of its N1 app now hold all six CEFR levels,
A1 to C2, in ONE app (one level menu, one plan, one notebook), and the satellites (reader, typing, speaking) are
sections of the same app. Who it is for first: urban, Spanish-dominant Paraguayans aged 18–35 who understand some Guarani
but do not speak it ("entiendo pero no hablo"); then professionals who must serve Guarani speakers (health, justice,
public counters), the diaspora and Argentines of the Litoral, and foreigners living in Paraguay (notes G3).
It rewards accuracy, getting up again and showing up, never speed: no leaderboards, no lives, no timers in practice.

## 2. Language of the screens

- Spanish UI, Rioplatense/Paraguayan voseo for instructions ("Elegí", "Escuchá", "Tocá", "Empezá", "vos sabés").
- Guarani first where Yaoki puts Japanese first, but ONLY words from the glossary in §6 (verified) or from the content.
  Pattern: `<span lang="gn">Guarani</span>` then the Spanish in the same element after ` · `, or a muted Spanish span
  (`font-size: 12-13px; font-weight: 700; color: #5A6382`). Spanish alone must always be enough.
- Kickers in upper-case Spanish with middle dots: `HOY · 3 LECCIONES`, `SEMANA 1 · DÍA 4`, `PRUEBA DE LA SEMANA`.
- Accessible names are Spanish (`aria-label="e nasal"`), Guarani text in live regions is followed by its Spanish.
- The app names its variety: "guaraní paraguayo"; it teaches the Guarani people speak today, standard spelling, with
  Spanish loans that everyone uses, and labels academic forms when they differ (G3 recommendation 2).

## 3. The look: Yaoki's system with a Paraguayan accent

Everything in part 1 §5 stays (ground, ink, indigo, teal, gold, radii, borders, hard shadows, type scale, graph paper,
the tab bar). What changes is the accent that Yaoki gives to the daruma's vermilion and its 済 stamp:

| Role | Yaoki | Epu'ã | Contrast |
|---|---|---|---|
| Accent art (stamp rings, rosettes, ritual marks, mascot rosette) | daruma red `#E2452B` | tajy (lapacho) pink `#C2336F` | 5.25 on white, 4.82 on ground |
| Accent text (stamp text, kickers, ritual CTA background with white text) | `#C7361E` | `#B02A63` | white on it 6.25; on white 6.25; on tint 5.20 |
| Accent tint (backgrounds, done petals, praise boxes) | `#FDEBE6` | `#FCE4EE` | ink on it 12.72; muted 4.93 |
| Accent track (bars, light fills) | `#F8D6CC` | `#F8D3E2` | — |
| Mascot fur (Kaguare) | daruma face `#FFF6EA` | `#EDC27C` (far limbs and inner ear `#D49A55`, eye ring `#C98E4E`, claws `#FBF3E6`) | art only |
| Mascot vest | — | `#2A2120`, a warm near-black (9.43 against the fur); the ink outline stays on top | art only |
| App icon tile | gold / indigo | tajy pink `#C2336F` (Icon board explores a ka'a green `#2F7A35` option) | — |

Errors keep Yaoki's red: wrong `#C7361E` on `#FDEBE6`. Right stays teal `#0B7A6B` on `#E0F3EF`; the right mark is the tick ✓
(`M5 12.5l4.5 4.5L19 7.5`), never Yaoki's ○. Primary action stays indigo `#2F4FD0`. Gold `#F2B43A` (also tajy sa'yju,
the yellow lapacho) marks tests and clues. No palette dominated by pure party red or blue.

Motifs, used sparingly and always flat (no gradients): the ñandutí rosette (concentric rings and radial threads, the
lace of Itauguá) as the stamp and the progress mark, worn on the tamandua's black vest like lace on dark cloth; graph
paper as in Yaoki (the school notebook). Never emoji, never flags, no tourist clichés.

### The stamps and marks (replacing 済 試 はなまる 起)

- Done (day stamped; replaces 済): a ring `2.5px solid <accent art>` with the ✓ tick inside in `<accent text>`, tilted as Yaoki's
  (`rotate(-9deg)`, per-slot tilts as Main's SPOTS). Mini version 20×20 in the stamps chip.
- Week test node / slot (replaces 試): radius 12–18 square, `2.5–3px solid #1B2440`, gold `#F2B43A` when ready, white when
  done (with ✓), `#E6E9F3` when not written; its mark is the stopwatch icon (exam), never a letter.
- Clean answer and stage ring (replaces はなまる): the ñandutí rosette — see `RosetteSVG` in §5.
- Comeback (replaces 起: a card missed and later answered clean): an up-arrow badge (`M12 19V5M6 11l6-6 6 6`, stroke 3) in a
  teal ring, label "Se levantó".
- "En preparación" (replaces 準備中) for unwritten days and levels; "faltan N días" (replaces あとN日).

### The ritual (replaces the daruma's painted eyes)

Yaoki paints the daruma's first eye when the goal is set and the second when the exam is passed. Here Kaguare wears a
ñandutí pinned to his black vest for the level: on the Goal screen the learner weaves its hub, the first thread ("Tejé el primer hilo"); every unit
finished fills a petal (the level's rosette fills as the units are done: Levels and Progress show it); passing the level
exam (Apto) weaves its rim. Before the goal, the rosette is only its frame: the dashed outer circle, the sun of radial threads
with their cross-thread ring, and the petals white.

### The level's ñandutí (one recipe, every screen)

`C.rosette(units, unitsDone, { hub, rim })` returns path strings for `viewBox="-24 -24 48 48"`. Draw it exactly so (holes in
SVG attributes work, as Yaoki's `points="{{ redPath }}"`; do not put `sc-if`/`sc-for` inside an `<svg>`):
```html
<svg viewBox="-24 -24 48 48" width="40" height="40" role="img" aria-label="{{ ro.label }}"><circle r="19.5" fill="none" stroke="#C9D0E3" stroke-width="1" stroke-dasharray="1.6 2.2" opacity="{{ ro.frameOpacity }}"/><path d="{{ ro.rimD }}" fill="#FCE4EE" stroke="#C2336F" stroke-width="1.4" stroke-linejoin="round" opacity="{{ ro.rimOpacity }}"/><path d="{{ ro.off }}" fill="#FFFFFF" stroke="#DDE1EC" stroke-width="0.9"/><path d="{{ ro.on }}" fill="#F8D3E2" stroke="#C2336F" stroke-width="1.1"/><path d="{{ ro.spokes }}" stroke="#C2336F" stroke-width="0.8" stroke-linecap="round"/><circle r="4" fill="{{ ro.hubFill }}" stroke="#C2336F" stroke-width="1.2"/></svg>
```
```js
const r = C.rosette(units, unitsDone, { hub: goalSet, rim: passed });
const ro = Object.assign(r, { frameOpacity: passed ? 0 : 1, rimOpacity: passed ? 1 : 0, hubFill: goalSet ? '#C2336F' : '#FFFFFF',
  label: 'Ñandutí del nivel A1: ' + unitsDone + ' de ' + units + ' unidades' + (passed ? ', nivel aprobado' : '') });
```
Before the goal: frame only (no hub). Goal ritual: the hub fills ("Tejé el primer hilo"). Each unit: a petal. Apto: the rim.

What the strings draw (the "arasape" rosette, the Itauguá sun): `spokes` is one radial thread per unit from under the hub to
the frame (r 19.3) plus a cross-thread ring (r 17.25) under the rim; `on` and `off` are one pointed lace leaf per unit between
two threads (r 6.8 to 15.75), each with its midrib as an open subpath; `rimD` is a ring of tight scallops bulging out from the
frame, `round(24 / units)` per unit (24 around for 6, 8 or 12 units, 20 for 10). Two rules keep the recipe valid: the spokes
path is stroked with no `fill`, so nothing in it may enclose an area (the ring is a circle traced out and back; a closed shape
there would fill black), and an open subpath inside a petal adds stroke only, never fill. Painted extent, stroke included:
r 20.0 before the pass (the frame circle), r 21.5 whole (r 21.7 for 10 units), inside the brooch discs (the mascot's
9.4 / 0.42 = 22.4; the icon's 8.0 / 0.36 = 22.2). It stays legible at 20 px (the brooch at 48 px): frame = a pink wheel,
hub = a dot, each unit = a pink leaf, whole = a filled scalloped disc. The same whole 8-unit rosette is baked literally into
the icon poses (`brief/mascot/spec.json` icon-pink and icon-green, `Icon.dc.html`, `Rules.dc.html`): regenerate those strings
from `C.rosette(8, 8, { hub: true, rim: true })` whenever the drawing changes.

## 4. Words in this brief come from verified sources

Guarani in the UI: §6 glossary only (each with confidence). Lesson Guarani: the content files only.

## 5. The mascot: Kaguare, the southern tamandua (el oso melero)

**Kaguare** is a southern tamandua (*Tamandua tetradactyla*), the anteater found in every Paraguayan department; in
Spanish copy he is "el oso melero" (G8). The name is the animal's everyday Guarani name, with K and no accent mark
(stress ka-gua-RE); in visible text it carries `lang="gn"`. Labels read "Kaguare, el oso melero". Never "Kaguare'i" (a
cluster of place names in Guairá, and Portuguese "cagarei"), never "Caguaré" (Spanish "cagaré"), never "perezoso" (the
dictionary's first gloss, and the app is called ¡Levantate!), and no etymology on screen. The first mascot, the armadillo
Tatu'i, was dropped because *tatu* is Paraguayan vulgar slang for "vagina" (G5 §2, G8). The name still needs a native
speaker's check (G8 §5).

Why he fits: when a tamandua is threatened it stands up on its hind legs, leaning on its tail like the third leg of a
tripod. Knocked over in the games, Kaguare gets back up that way: that pose is "Opu'ã · Se levantó", the app's name in
the third person. His black vest is where he wears the level's ñandutí, pinned like a brooch (§3).

**The art** is in `brief/mascot/` (`SPEC.md` for people, `spec.json` for code, `sheet.png` to look at): exact SVGs, all in
a `0 0 100 100` viewBox, flat fills, ink outlines `#1B2440` (3 on the body and head, 2.8 on limbs and tail, 2.2 on the
brooch ring), side view facing right, no ids, defs, gradients, masks or clipPaths (any number of copies can share a
board). Use them as they are; do not redraw the animal.

| Pose | Where | Notes |
|---|---|---|
| standing | Goal 104 px (ritual), Main and Progress 60, hints 48, results 72, Escribir at 90 %, Hablar at 75 % | feet on y 83, centre near x 50; the brooch at (45, 60.2); eight switchable face parts as `data-part` (eye-open, eye-closed, eye-happy, mouth-normal, mouth-o, mouth-happy, sweat, sparks): show one eye and one mouth at a time |
| fallen ("Ho'a", se cayó) | the games, when a card reaches him | on his back, dazed (a spiral eye, never X eyes), on the same ground line; 49.8 units tall so the stars fit above him; brooch at (40.2, 65.6) |
| rising ("Opu'ã · Se levantó") | the brand board; the middle step of every fall in the games | the tripod stance made friendly: arms up and open, palms out, tail planted; brooch at (48.6, 60) |
| cheering ("¡Vy'apavẽ!") | level passed, results, clean runs | arms up, happy eyes, open smile, three gold sparks; brooch at (48.6, 60) |
| studying ("Mbo'epy · Lección") | the brand board | head lowered over an open notebook; brooch at (45, 60.2) |
| oops ("Eha'ã jey · Intentá de nuevo") | a wrong answer in a lesson (72 px) | sitting back, paw at the cheek, closed happy eyes, a sweat drop; brooch at (48.2, 61.4) |
| fallen mini | the games' "Caídas" chips (20 px), the notebook's wrong line (36 px) | decorative, `aria-hidden` |
| icon on pink, icon on yerba green | the app icon (1024 master), 29 to 256 px | the bust over the vest with the brooch, an ink border and a hard ink offset shadow |
| thumbs | Hablar's two "Cómo jugar" cards (140×84 scenes) | simplified heavy-stroke versions |

**The brooch.** A white disc r 10.5 with a 2.2 ink ring on the vest. The boards nest the level's rosette from
`C.rosette()` in it as `<g transform="translate(cx cy) scale(0.42)">` (0.36 in the icon), in place of the stand-in (four
pink threads, a ring and a hub) that the SVGs carry when no engine is present.

**The games.** The fall is fallen → rising → standing: a card that reaches him crossfades standing → fallen (the stars
orbit above), getting up crossfades fallen → rising for about 0.3 s (¡Opu'ã!), then rising → standing with the springy
squash, stretch and small hop; all three layers share the feet line and the origin 50% 83%. The dodge is a sidestep and a
lean, never a roll. Cards land on his head and back, never on his snout (Escribir's REACH 50; Hablar's YH 43). The umbrella
stick ends on his crown, behind him. `spec.json` → `games` has every number.

**What the art and the words never do** (from the slang screens and the culture research, G8): make his nose the joke
(*Tĩkaguare*, "kaguare-nose", is a recorded taunt), show a tongue, show him as a pet (no collar, leash, cuddling, sweets
or honey), make the claws menacing, give him a bushy tail (that is the jurumi), make smell or road jokes, or put
feathers, headdresses or anything that suggests an Indigenous costume on him.
The karumbe (tortoise) is the icon of the slow-listening button (a simple 24-px stroke icon: a dome over four stubby legs).

## 6. Glossary (UI Guarani, verified)

Use ONLY these Guarani words in the interface (G5 §3, from real localisations: Firefox, MediaWiki, LibreOffice, Common
Voice; conf. high unless marked). Pattern: `<span lang="gn">Guarani</span> · Spanish` on buttons and headings, or the
Spanish alone. For anything not here, Spanish only.

- Actions: Ñepyrũ · Empezar · Eku'ejey · Continuar · Upeigua · Siguiente · Tapykue · Volver · Mboty · Cerrar · Oĩma · Listo ·
  Heja · Cancelar · Moneĩ · Aceptar · Héẽ / Nahániri · Sí / No · Ñongatu · Guardar · Mboguete · Borrar · Mbojuaju · Agregar ·
  Heka · Buscar · Pytyvõ · Ayuda (also for the hint button) · Ñemboheko · Ajustes · Poravoha · Menú · Jepo · Saltar (medium) ·
  Eha'ã jey · Intentá de nuevo · Pyahu · Nuevo · Eikuaave · Más información.
- Feedback: ¡Iporã! · ¡Bien! / ¡Correcto! · ¡Iporãiterei! · ¡Muy bien! (the clean answer, Yaoki's はなまる) ·
  ¡Iporãitereíma ne rembiapo! · ¡Muy bien hecho! (medium-high; top praise) · ¡Eku'e péicha! · ¡Seguí así! (medium) ·
  ¡Vy'apavẽ! · ¡Felicitaciones! (medium: vy'apavẽ is attested as 'felicidad'; Firefox for Android writes ¡Vy'apavẽmante!;
  used for a level passed) · Aguyje · Gracias · Oĩma · Listo (the done stamp, Yaoki's 済) · Opu'ã · Se levantó
  (the comeback stamp, Yaoki's 起) · Epu'ã ha eñepyrũjey · Levantate y empezá de nuevo (the line after a fall) ·
  Jehupytyrã · Meta · Jeku'e · Progreso (medium-high) · Tape · Camino.
- Course: Mbo'epy · Lección · Jehechajey · Repaso · Porandu · Pregunta · Embohovái · Respondé · Ñe'ẽ · Palabra ·
  Ñe'ẽjoaju · Oración · Moñe'ẽrã · Texto · Techapyrã · Ejemplo · Ñe'ẽasa · Traducción · Ñe'ẽryru · Diccionario ·
  Arandukarenda · Biblioteca · Aranduchauka · Examen (medium).
- Skills: Ehendu · Escuchar (noun Ñehendu) · Ehendujey · Escuchar otra vez · Eñe'ẽ · Hablá · Emoñe'ẽ · Leer (noun Ñemoñe'ẽ) ·
  Ehai · Escribir (noun Jehai) · Ñemongeta · Conversación · Mba'epu · Sonido · Mbopu · Reproducir · Joko · Detener.
- Time: Ára · Día · Arapokõindy · Semana · Jasy · Mes · Ary · Año · Ko árape · Hoy · Ko'ẽrõ · Mañana · Kuehe · Ayer ·
  Aravo · Hora · Aravo'i · Minuto. Months: Jasyteĩ enero, Jasykõi febrero, Jasyapy marzo, Jasyrundy abril, Jasypo mayo,
  Jasypoteĩ junio, Jasypokõi julio, Jasypoapy agosto, Jasyporundy septiembre, Jasypa octubre, Jasypateĩ noviembre,
  Jasypakõi diciembre. Weekday names in Guarani are disputed (Sunday-first vs Monday-first): show Spanish day names.
- Numbers 1-10: peteĩ, mokõi, mbohapy, irundy, po, poteĩ, pokõi, poapy, porundy, pa (prices and times are said in Spanish).
- No attested Guarani (keep Spanish): racha, sello, pista, cuaderno, gramática, vocabulario, pronunciación, mediación, unidad,
  nivel, constancia. Use "Pytyvõ · Ayuda" for the hint button if you want Guarani there.
- Composed lines needing a native check, NEVER on a screen: "Ho'a pokõi jey, opu'ã poapy jey"; "Ehendu mbeguemi".

## 7. The boards

Every phone board: 390×844, `radius: 44`, `is_interactive: true`. Columns 470 px apart; rows 1284 px apart.
File → canvas title → Yaoki model → spec notes. "Moment board" = imports the component with a `view`/`demo` prop.

The full board list, layout and per-board specs are in `BOARDS.md` beside this file. Read it.
