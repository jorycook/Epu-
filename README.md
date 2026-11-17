# Epu'ã: a Guarani course for Spanish speakers, built on Yaoki

Epu'ã ("¡Levantate!") is a phone app that teaches Paraguayan Guarani (avañe'ẽ) to Spanish speakers. It is modelled on
the Yaoki suite: the course of Yaoki's main app, the plan of days of its N1 app, Yaoki Reader, Yaoki Typing and Yaoki
Speaking. The material is divided among the six levels of the Common European Framework (A1, A2, B1, B2, C1 and C2), all
in one app: one level menu, one plan, one mistake notebook, and an exam at the end of each level. The design lives on the
design canvas "Epu'ã Guaraní App" (https://claude.ai/artifact/TysCAZdWadFE5kHVbAhYnY); the files in `project/` are copies of
the canvas's files, as `yaoki/project/` is for Yaoki.

The name answers 七転び八起き. Its tagline, "Epu'ã ha eñepyrũjey" ("Levantate y empezá de nuevo"), is attested word for word
in real Guarani text. The mascot is Kaguare, a southern tamandua (in Spanish, el oso melero), the anteater found all over
Paraguay. When a tamandua is threatened it stands up on its hind legs, leaning on its tail: knocked over in the games,
Kaguare gets back up that way ("Opu'ã", se levantó). The first mascot, an armadillo named Tatu'i, was dropped because
*tatu* is Paraguayan vulgar slang for "vagina"; notes G8 hold the research behind the new one, whose name still needs a
native speaker's check.

## What is where

| Folder | What it holds |
|---|---|
| `project/` | The canvas's files: 42 boards (`*.dc.html`), the index (`canvas.json`) and the shared scripts. `gn-course.js` is the course engine (the counterpart of Yaoki's `course.js`, as `window.gnCourse`); `gn-course-a1.js` … `gn-course-c2.js` are the six levels' data, made from `content/`; `gn-extra.js` holds the placement check, the A1 level exam, the reader's text and the typing and speaking lists; `gn-spell.js` is the spelling helper (the letters of the alphabet, the keys a word needs, why a typed letter is off); `gn-sound.js` is Yaoki's sound player under new names. |
| `content/` | The course as data. `levels.json` is the syllabus of all six levels (52 units, the title of every study day and, for the units written, each day's sound focus). `a1/parts/` holds A1 units 1 to 4 day by day, each with its week test (`u01-d1.json` … `u04-test.json`); `a1/u01.json` … `a1/u04.json` are the units assembled from them; `extra/` holds the extras. |
| `tools/` | `build-course.mjs` checks the content and writes the level files; `assemble-unit.mjs` merges a unit's day files; `lint-board.mjs` checks a board for the format rules that fail silently; `smoke-boards.mjs` runs each board's logic against the engine and the data, the way the canvas and the prototype call it, without rendering; `blind-export.mjs` exports every question without its answer for a blind solver; `sound-list.mjs`, `make-sound.mjs` and `make-tts.py` are the sound path (see Sound). |
| `sound/` | The clip lists: `A1/manifest.json` (every clip the course needs, by key, with its text, voice, place and recording order; read by the tools and the studio) and `A1/lista.csv` (the same, for a spreadsheet). `A1/voz/` holds the synthetic voice's takes for A1 units 1 to 4: 440 clips as FLAC, the seed of each and what two speech recognisers heard of it, and in `left-out/` the 63 clips that stay silent, kept for a native listener (CC BY-NC 4.0, non-commercial; see Sound). `VOICE.md` is the record of that voice, `respell.json` how it is given Spanish names and numbers, `silent.json` what it must not say. A person's recordings will not live in the repository: `make-sound.mjs` turns either kind into `project/gn-sound-*.js`. |
| `brief/` | The design brief the boards were built from: `BRIEF-core.md` (format, wiring, typefaces, tokens, engine, content shape), `BRIEF-design.md` (language, look, mascot, the verified Guarani glossary), `BOARDS.md` (every board's spec), `CONTENT-BRIEF.md` (how the lessons are written), the font link, and `mascot/` (Kaguare's final art: `SPEC.md`, `spec.json` with every SVG, and `sheet.png`). |
| `notes/` | The research the design rests on. Y1 to Y5 map the Yaoki suite (plan and engine, the lesson loop, skills and tests, the satellites, platform and brand). G1 to G8 are the Guarani research, with a source and a confidence mark on every claim: sounds, spelling, fonts and keyboards; a verified grammar reference; learners and prior art; data, audio and licences; culture, naming and UI words; the CEFR and the level exam; the six-level syllabus; and G8, the second mascot (Kaguare: which anteater, its names, three slang screens). |
| `epua-app/` | The installable app around the screens: `src/` (Yaoki's runtime, the shell, the first-visit page, the offline worker, the page and the manifest), `studio/` (the recording studio page), `build.mjs`, `fonts.py`, `fetch-fonts.sh` and `check/app-check.js`. |
| `docs/` | The built app, for GitHub Pages. This is all a phone needs. `docs/estudio/` is the recording studio, next to the app and not part of it. |
| `check/` | Two checks of the built app in Chromium, as GitHub Pages serves it: `flows-test.js` (a learner's flows by taps, saved progress, two tabs, saved data that does not fit, the last written week to its end, the review put in front of the day and its size, the plan made again, the days with study and the return after days away, the end of the written path with the first mini exam, an exam closed on its result page, the voice of the clips (the tag «voz sintética» wherever a synthetic clip is offered, a clip really playing, the speaker named by the clip's cues, the clips the voice must not say and a build without sound, Progreso's page on the voice and its switch; the words lesson's note per word; a sound file held back or refused by the test's own server on each of the eight screens that play clips: waiting, arrived, failed, too long in coming; what the worker has stored once there is a plan and when the learner moves on to the next unit; what each screen says with the voice off), and the app around the screens: an Android phone's way in, the system's back, focus and zoom, a paste taken back, the screens that load later) and `platform-test.js` (phone sizes, iPhone and Android, the install page in each browser, the Home Screen, the page's first paint, offline (with the sound that is stored ahead: the unit in use, the next one and the speaking game's, each downloaded once and no other file of the level; the two screens whose sound comes only when they open going without it), updates, the manifest and icons, the typefaces, every screen's frame, tap targets, headings, languages; the screens with a learner in unit 1, with one in the last written week, with one back after days and behind the plan (Progreso's list measured against its fold) and with one at the end of the written path, and the shell's own notices). Their screenshots go to `check/out/`, which is not kept. |

## Build and check

Needs Node 22.

```
node tools/assemble-unit.mjs a1 2      # merge one unit's day files into its unit file (here A1 unit 2, into content/a1/u02.json)
node tools/build-course.mjs            # check every content file and write project/gn-course-*.js and gn-extra.js
node tools/build-course.mjs --check    # check only
node tools/lint-board.mjs project/*.dc.html
node tools/smoke-boards.mjs            # every board, alone, inside the prototype with a fresh state, with the sample state, and in each moment another board imports it with
```

The build stops a file that is not in Unicode NFC, writes the puso as anything but the apostrophe U+0027, carries a
combining tilde outside g̃, has unbalanced markup, an answer out of range, options that repeat once their marks are
removed, a build item whose `full` does not match its tiles, a day without its parts, a title that differs from the
syllabus, or an arrow outside a «Cómo se forma» rule (the interface typeface has none). Ids carry the level
(`a1u01d4.d5`, `a1u01t.12`), so items never clash across levels.

## The app

`epua-app/` makes the installable web app (an iPhone's Home Screen app, an Android phone's installed app) from the
canvas's screens, the way Yaoki's `yaoki-app/` does. It plays
the 21 screens of the prototype board (`App.dc.html`) and the spelling pad inside Words, as they are in `project/`, on
Yaoki's screen runtime (Preact). Around them it has its own shell (the prototype board's routing, with the progress kept
on the phone and checked against the course each time the app opens), a first-visit page that explains how to put it on
the Home Screen, and an offline copy of every file. The build copies the screens as they are and changes nothing in
`project/`; it stops when a screen the shell routes has no way in from another screen.

Needs Node 22 and Python 3 with `fonttools` and `brotli`.

```
cd epua-app
npm install                # preact and sharp
bash fetch-fonts.sh        # Nunito and Andika, into ../fonts-src (once)
node build.mjs             # checks the content, writes dist/ and replaces ../docs with it
node check/app-check.js    # the app in Chromium: the first-visit page, every screen, a first day, saved progress, phone sizes, offline, updates
cd ..
node check/flows-test.js   # a learner's flows, by taps, against docs/ (about 7 minutes)
node check/platform-test.js   # phones, offline, updates, fonts, frames, tap targets and languages, against docs/ (about 8 minutes)
```

The build makes Nunito's 500, 700 and 800 from its variable font, cuts both typefaces down to the characters the app
shows, and stops if either lacks a Guarani letter. Andika's Reserved Font Names may not be used for a modified copy, so
its subsets are named EpuaText, and the app's copies of the screens say `'EpuaText'` where the canvas says `'Andika'`.
The licences are in `docs/licenses.txt`.

`docs/` is the built site. Every address in it is relative, so any https folder works. To put it on the web: Settings →
Pages → Deploy from a branch, the branch that holds `docs/`, folder `/docs`; the app is then at
https://jorycook.github.io/epu-/. The empty `.nojekyll` file tells GitHub to serve the files as they are. A new build has
a new version; a phone that has the app fetches it by itself and switches to it on the week path or the goal screen,
never in a lesson.

On the iPhone: open the address in Safari, tap Share (Compartir), then Add to Home Screen (Agregar a pantalla de
inicio), then open Epu'ã from its icon once while online. After that it works offline. In Safari the app first shows a
page that says the same, with a button to go on in the browser; that choice is remembered for a week, and then the
page is offered once more (a browser may empty what it keeps for a site left alone for a week, so the icon is the
safer home). Progress is kept on the phone only, by each copy of
the app (the folder's address is part of its name). Two tabs of the app share it: what one tab saves is added to what
the other saved, never written over it, and each tab takes the other's changes at its next quiet moment (the week path,
the goal, a tab). A browser that keeps nothing gets a notice on the goal screen and the week path.

On an Android phone: open the address in Chrome. The install page is shown there too, with Android's own steps (the
browser's menu, «Instalar app»); as soon as Chrome offers to install the app, the page shows one button, «Instalar
Epu'ã», which puts Chrome's own question. On Android the installed app and the browser share what is saved, so the
page says so and offers no code to copy. A browser other than Chrome (Samsung Internet, Firefox) is sent to Chrome
when its menu has no «Instalar app»; Chrome keeps its own storage, so the app installed from there starts empty: when
that browser already holds progress, the page promises the same progress only for an install made from it («Instalada
desde Samsung Internet, tu progreso es el mismo…»), and a row offers the code for the other way («Desde Chrome la app
empieza vacía: llevá tu progreso con este código»). A page opened inside another app (a link tapped in Instagram,
Facebook or TikTok opens in that app's own browser) cannot be installed from there, and what it saves stays inside
that app: the steps then start with the way out of it («Abrí esta página en Chrome» on Android; on an iPhone, where
such a page has no Share menu of Safari's, «Abrí esta página en Safari», then «En Safari, tocá Compartir»), and on
both systems the page says where the progress stays and offers its code when there is some to take along. Where a
browser's bars leave the screens under 0.85 of
the design's size (a Galaxy A15 in Chrome draws them at 0.81, against 0.92 from its icon; an iPhone 14 in Safari at
0.83, an iPhone SE at 0.69), the page says the app looks smaller there and larger from the Home Screen. The manifest
carries a second pair of icons for Android's launchers (`"purpose": "maskable"`): the same art at 80 %, standing on
the tile's bottom edge, so the whole face lies inside the circle every launcher keeps (at full size a launcher's mask
cut the ear and the tip of the snout).

The system's back (Android's gesture or key, a browser's back button) does what the screen's own X or back arrow
does: it closes an open sheet, steps back in the goal screen, leaves a lesson for the day and the day for the week
path, and from the week path it leaves the app. Each screen marks its own way back for the app (`data-gn-back`, on
the X or the arrow of its header and on the round's X of the two games; BRIEF-core §2), and the system's back
presses it: where that control asks first (the pause of Escribir and Hablar, «¿Salir del examen?», «¿Salir de la
prueba?» in a week test or a mini exam part way), the system's back asks first too. A sheet closes by its scrim; a
sheet with no scrim stays open, unless it marks the button back should mean (the pause's «Continuar»). For all that
the tab's history holds one entry for each step the app is away from the screen it opens on: added when a tap leads
deeper, taken off, one at a time, when a tap leads back up. When a back is answered without a step up (a sheet that
opens, or stays), the app steps forward again onto the entry the back has just left, so back pressed again and again
with no touch in between never falls out of the app from inside a screen. The address never changes.
`check/flows-test.js` compares the system's back with a tap on the screen's own control on every routed screen and
in a round or an exam under way. (It is checked through Chromium's history; a phone's own gesture is still to be
tried on a phone.)

A first visit shows something at once and downloads the app once. The page carries its own first paint (the icon, the
name, «Cargando…») and asks for the four faces of the first screen straight away. Only the screens a visit starts on
are loaded with the page (`assets/screens.js`: the shell, the install page, the goal screen, the week path and the
day, about 57 kB as the web host sends them); the other eighteen and the spelling pad (`assets/screens-more.js`, about
310 kB) come in once the page is up, and a screen asked for sooner gets a waiting note (with the way back, «Tapykue ·
Volver», after five seconds: on a connection that stalls an app from the Home Screen has no back of its own), or, if
the file cannot be fetched, a note that says so with a way to try again. A first paint that never ends says so too:
when one of the page's own scripts cannot be fetched, «Cargando…» gives way to «No se pudo cargar. Revisá tu conexión
y abrí la página de nuevo.»; when the app is still not up after 20 seconds, to «Está tardando…». A unit's
sound comes after the screens, and none before there is a plan: a first visit, still on the goal screen, fetches no
sound at all. With a plan the engine asks for the unit's file with the first screen, but no screen of the first file
plays a clip and one unit's sound (about 450 kB as sent) is larger than all the later screens together, so the app
holds that request back until the screens are in, or until the learner asks for a screen of the later file: then the
sound sets out at once (`gnApp.soundNow`, called by the shell), and a control that is asked for a clip meanwhile says
«Cargando el audio…» (see «Sound»). That second rule trades one wait for another, and only matters where the later
screens are not stored yet and there is a plan already (a new phone after a paste). Measured so on 17 November
(Chromium, a cold cache, the learner tapping straight through to the first lesson, CPU slowed four times): at
1.6 Mbit/s the lesson is up at 5.6 s instead of 4.5 s and its clip is in at 6.6 s instead of 6.8 s, so the lesson
waits for its sound for 1.1 s instead of 2.3 s; at 400 kbit/s the lesson is up at 21.3 s instead of 15.1 s and the
clip is in at 24.3 s either way, so the wait is 3.1 s instead of 9.3 s. The sound shares the line with the screens:
it is not in sooner, the lesson is up later. Holding the request until the screens are in (the one call of
`soundNow` in the shell's `fetchScreen` taken out) gives the first figures back.
The offline worker stores every file under a hash of its content: on a first visit it takes what the browser has just
downloaded for the page instead of downloading it again, a new build downloads only the files that changed, and a file
that is not this build's is never stored (it is asked for again, past every copy; if that fails the install waits).
A sound file is stored the same way, the first time it is used or when the app names it to the worker: once, however
many ask for it at the same moment, and from the browser's own copy when the page fetched it before the worker was in
charge. The level's sound is megabytes (seven files, 3.7 MB as they are and 2.3 MB as a host sends them, for A1 today),
so the whole of it is never fetched behind the learner's back. Once there is a plan the app names three files to have
ahead of time, for use without a connection (`gnCourse.soundAhead`): the unit in use, the unit after it, and the
speaking game's (47 kB as sent), the practice that should work anywhere; when the learner moves on to a unit, the one
after it follows. The level exam's and the placement check's files are fetched the first time their screen opens, and
stored then. Measured on 17 November as a host sends the files: a first session fetches 39 files and 1.79 MB, 1.03 MB
of it sound (units 1 and 2 and Hablar), and none of the sound before the plan is made; until then it fetched 43 files
and 3.00 MB, 2.26 MB of it sound, all seven files, the first of them on the goal screen. When the browser says the
learner saves data (`navigator.connection.saveData`) nothing is named ahead: only the file of the unit that is opened
is fetched and stored, and Progreso's «Voz sintética» says so; it says what the phone stores in the other case too, and
what a unit weighs. A sound file that could not be fetched is asked for again once from the next screen, and at once when the
browser says the connection is back; none is fetched while the learner has the synthetic voice turned off.

Saved progress is looked after. Once there is a plan the app asks the browser to keep what is saved
(`navigator.storage.persist`). In Safari on an iPhone the install page, and once a week the week path of a tab kept
open, say that Safari deletes what a page saved when the page is not opened for a week; the week path's notice has a
button, «Qué hacer», that opens the install page again (the steps to the Home Screen, and the code that takes the
progress there; that page is one step from the week path, and the system's back leads back with nothing chosen). A
pasted progress code can be taken back («Deshacer», on the week path and the goal screen) until something is studied
on the pasted progress or the app is opened again: the first thing done withdraws the offer, so taking a paste back
never throws study away. A save written by a newer build is read as far as this build understands it and never
written over (the week path asks to open the app again; a progress code pasted then is refused with that reason),
and fields a newer build added to the save are kept as they are. These notices cover no control: on the week path
the notice is laid exactly over the week's card (the box the screen marks `data-gn-note`), on the goal screen it
sits above the bottom buttons, and it is not drawn while a sheet is open.

For a screen reader and a keyboard: the page's title names the screen («Epu'ã · Camino de la semana»), a new screen's
heading takes the focus (every screen opens on an `<h1>`, and the stage is the page's `<main>`), an open sheet takes
the focus and puts what is behind it out of reach until it closes, and the focus then returns to the control that
opened it: the control tapped, also where a tapped button gets no focus of its own, as on an iPhone (played in
Chromium by a tap that moves no focus; VoiceOver itself is still to be tried on a phone). A tap that takes its own
control away and leads to another page of the same screen (a lesson's next step) puts the focus on that page's
heading instead of nowhere, unless the screen says itself what the tap did, in a live region (an answer checked, an
exam ended). The app's notice comes before the screen in the reading order, and the week test's result names
itself in its heading («Prueba de la semana: 17 de 20»). (Three states inside a screen still start without an
`<h1>`: the questions of the placement check and of the level exam, and Hablar's round; `platform-test.js` lists
them, and there a tap inside the screen leaves the focus where the browser puts it.) The page can be pinched larger; only the two games played with both thumbs (Escribir, Hablar) keep two fingers
from zooming.

## How the app works

- **Who it is for first:** urban, Spanish-dominant Paraguayans of about 18 to 35 who understand some Guarani but do not
  speak it ("entiendo pero no hablo"); then professionals who must serve Guarani speakers (health, justice, public
  counters), the diaspora and the Argentines of the Litoral, and foreigners living in Paraguay (notes G3).
- **The goal screen has three real steps:** why and where (up to two reasons and the places); where you start (two
  separate scales, understanding and speaking; a gap of two steps or more offers the placement check); your plan (level,
  minutes a day, an optional target date, the ritual). The placement check (12 to 15 minutes) gives a two-part profile,
  such as Comprensión B1 · Producción A2, and the plan starts at the production level.
- **The week and the day are Yaoki's:** five study days, a review day and a week test. A study day is three lessons:
  grammar (teach, compare, drill, exam-style), words (at A1 and A2 a short "Sonido y letra" step, then the scene, then
  spelling with the Guarani keyboard, then one exam-format question) and a reading or listening item. A word typed once
  is not asked again, except on the review day, which asks for the week's hard words once more. A mistake comes back
  after 1, 3 and 7 days; three right answers in a row clear it. The week path shows one week: the week of the session in
  use, else of the next one due, and once every written week is whole, the last of them. An exam-style run (a day's
  step, a week test, a mini exam) is saved when it ends, its errors and its result in the same moment: however its
  result page is left, or the app closed on it, the exam stays taken. Left part way, a week test or a mini exam with
  something answered asks first («¿Salir de la prueba? Si salís ahora se pierden tus respuestas…»), by its cross and
  by the system's back alike; a day's three questions are left at once.
- **The review that waits is put in front of the day.** The Cuaderno tab carries the number due today on the four tab
  bars, and the week path's callout and the day's page a row, «Antes de empezar: 3 para repasar · unos 2 min», that
  opens the review; the review ends with «Seguir con el día 4». A day's review has a size: a third of the minutes a day
  chosen with the goal, at 0.6 minutes a question (8, 16 or 25 questions for 15, 30 or 45 minutes), the oldest first;
  what is left waits for the next days, and the notebook says so («Hay 45 esperando. Hoy van las 16 más viejas…»). In
  the notebook an entry that is due keeps what was answered and holds its right answer back until it is reviewed, and
  the review shows a choice's options in another order than the lesson's, the right answer where neither the lesson
  nor the day before had it. The review's cross closes it to the screen it was opened from (the week path's row, the
  day's row or the notebook).
- **The plan can be made again.** The date chip on the week path («faltan 40 días», or «a tu ritmo») opens the goal
  screen at its third step, with «Guardar el plan» and «Cancelar»; behind the plan or past its date, Progreso offers
  the same door («Epu'ã ha eñepyrũjey», «Rearmar mi plan»). A plan made again starts today at the session the learner
  had reached, and lays out only what is left (`plan.from`). The door is one step from the screen that opened it: its
  arrow, «Cancelar» and the system's back lead back there in one press, with nothing saved (the first-run questions
  are not walked through again).
- **Days with study, and the return.** The app keeps the days on which something was done (a lesson step, a test, a
  review answer, a practice section opened); opening the app is not study. The week path shows the last seven days,
  Progreso counts them («12 días con estudio · volviste 2 veces»), and after two days or more away the week path
  greets the learner back: Kaguare up on his hind legs, «Opu'ã · Se levantó», and where to start (the review that
  waits, called «algo corto» only while it takes five minutes or less; or, after a week or more, the last review day
  sealed) before the next new day. A save from before the app kept the days, which already holds things studied, is
  marked (`seenLate`): its count begins on the day of the update, and Progreso says so («3 días con estudio desde el
  16/11»); no earlier day is made up from the moments the save does carry.
- **Six levels:** A1 Acceso 8 units, A2 Plataforma 10, B1 Umbral 10, B2 Avanzado 10, C1 Dominio operativo eficaz 8,
  C2 Maestría 6: 52 units, 260 study days. A1 and A2 hold the core morphology; B1 and B2 clauses, word formation,
  evidentials and Jopara as grammar; C1 register and the State's Guarani (the Constitution, Ley 4251, legal and
  administrative Guarani, the media, the Academy's new words); C2 literature, oral tradition, the other Guarani
  varieties (to know, not to master), proverbs and humour, and translation (notes G7).
- **The level exam** follows the DELE: five parts (reading, listening, mediation, writing, speaking) in two groups;
  Apto needs 60 % in each group and no part under 40 %. Reading, listening and Guarani-to-Spanish mediation are scored by
  the app; writing, speaking and Spanish-to-Guarani mediation are rated against a rubric and sample answers, by the learner
  (rated again after 48 hours, the lower score kept) or by a teacher. No CEFR framework or certificate exists for Guarani
  anywhere (notes G6), so the app calls its result a constancia, never a certificate. Before it, each half of a level
  has a mini exam: 20 of that half's week-test questions (6 words, 8 grammar, 3 reading, 3 listening, as many from each
  unit) on a 20-minute clock, open once the last of those week tests is done. A1's first one exists (units 1 to 4);
  where the written path ends, the week path's card and Progreso's next step name it while it is open and not taken.
- **Read, type, speak** are sections of the same app, not separate installs, reached from Progreso ("Más práctica":
  Emoñe'ẽ · Leer, Ehai · Escribir, Eñe'ẽ · Hablá), from a sealed day («¿Un rato más?») and, where the written path
  ends, from the week path's card («Mientras tanto», with the notebook); each closes to the screen it was opened
  from. Leer shows a text and, while a phrase is held, its parts (prefix, root, suffix) with Spanish glosses, the
  word's meaning and the grammar pattern; never the
  translation of the whole sentence. Escribir is the typing game, on the phone, with the app's own keyboard (the Guarani
  row ã ẽ ĩ õ ũ ỹ g̃ ' first). Hablar has no speech recognition, because no phone or browser recognises Guarani: the learner
  hears a word and picks it from its minimal pair, or says a phrase aloud, compares it with the model and rates the take
  (recording the learner's voice is still to come: today the app says so, and on the canvas a button stands in for it).
- **The voice is a program's for now, and the app says so.** Until a person records the course, its audio is a
  synthetic voice: every control that plays one carries the small tag «voz sintética», Progreso explains what it is,
  what it does badly and that recordings by native speakers will replace it, and a switch there turns it off. What
  the voice says badly is not said at all: those words and phrases show written, with «todavía no está grabado». A
  clip that is still on its way says «Cargando el audio…» and waits, one that could not be loaded says so, and with
  the voice off the screens say that the learner turned it off, and where it is turned on again.
- **It rewards accuracy, getting up again and showing up, never speed:** no leaderboards, no lives, no timers in practice.

## The look

Yaoki's system is kept exactly: the ground, the ink, the indigo, the teal for right and red for wrong, gold for tests,
2 px ink outlines with hard offset shadows, the radii, the type scale, the graph paper, the tab bar, the 50 px and 34 px
left for the phone's bars. The accent that Yaoki gives to the daruma's vermilion becomes tajy (lapacho) pink: `#C2336F`
for rings and marks, `#B02A63` for text and the ritual button, `#FCE4EE` for tints. Kaguare's fur is `#EDC27C` and his
vest a warm near-black, `#2A2120`.

Each level is a ñandutí, the lace rosette of Itauguá, that Kaguare wears pinned to his black vest. Before the goal it is
only its frame, the radial threads with nothing woven; setting the goal weaves the hub and the first ring round it
("Tejé el primer hilo"); each unit finished fills a petal; passing the
level exam weaves the rim. `gnCourse.rosette()` draws it the same way on every screen. The done stamp is a pink ring with a tick, the
comeback stamp says Opu'ã ("se levantó"), and a clean answer earns ¡Iporãiterei!.

The interface is set in Nunito and Guarani text in Andika (SIL's literacy face). Yaoki's own faces do not work here:
M PLUS Rounded 1c puts the tilde of g̃ over the next letter, and Klee One lacks ỹ. The canvas loads both through one Google
Fonts link that asks for only the characters the app uses, which keeps g and its combining tilde in the same file: with
Google's default split files, Chrome draws g̃ (and a capital G̃) in a fallback font.

## The words

The interface is Spanish, in the voseo of Paraguay and the River Plate ("Elegí", "Escuchá", "Tocá"). Guarani appears
first where Yaoki puts Japanese first, but only words taken from real localisations (Firefox, MediaWiki, LibreOffice,
Common Voice): Ñepyrũ · Empezar, Upeigua · Siguiente, Tapykue · Volver, Ehendu · Escuchar, Jehechajey · Repaso, Oĩma ·
Listo, Opu'ã · Se levantó. Where no attested Guarani exists (racha, sello, cuaderno, gramática, nivel, constancia), the word
stays Spanish. The glossary, with its sources and confidence, is in `brief/BRIEF-design.md`.

The app names its variety, guaraní paraguayo, teaches standard spelling (the Academy's alphabet of 2015) and the Guarani
people speak today, Spanish loans included.

## What is written

- **The syllabus of all six levels:** every unit and the title of every study day, so each level's week path exists;
  days not written (A1 units 5 to 8 and the five other levels) show "En preparación", as Yaoki's 準備中.
- **A1 units 1 to 4, in full:** half of the level. Each unit is five study days, the review day and a 20-question week
  test, 92 items; `node tools/build-course.mjs --check` counts 24 days written (the four review days among them) and
  368 items.
  - Unit 1, "Mba'éichapa · Saludos y sonidos": greetings and farewells; saying who (che, nde, and the two "nosotros",
    ñande and ore); che réra; questions with -pa; Aguyje and courtesy.
  - Unit 2, "¿Quién hace qué?": the person prefixes a-, re-, o-; ja-/ña-, ro- and pe- for the plural; -pe/-me, "en, a";
    -gui, "de, desde"; the negation nd-…-i.
  - Unit 3, "¿Cómo estás?": che-/nde- for states and qualities, with no "estar"; areal "yo hago" against chendal "a mí
    me pasa"; the nominal sentence, with no "ser"; yes-or-no questions with -pa and piko, and their answers; stress and
    the accent mark.
  - Unit 4, "Mi familia": possession with che and nde; the plural -kuéra, -nguéra after a nasal; the demonstratives ko,
    pe, amo; máva, "quién", and mba'e, "qué"; the numbers 1 to 5, and Spanish numbers in speech.

  The titles a learner reads (the week path, the day's heading, Progreso) say what the day lets you do or say, with the
  form after a colon where it helps to find the day again: "Decir quién hace qué: a-, re-, o-", "Decir que no: nd-…-i",
  "Mi mamá, tu papá: che sy, nde ru". The grammar's own names for the points (prefijos areales, predicados chendales,
  oración nominal) stand beside each title in `notes/G7-six-level-syllabus.md`, for editors; a lesson uses one only
  where it explains it. A day's file carries the title of `content/levels.json` word for word: the build stops when
  they differ.

  Every study day's sound step has a focus of its own, 20 in all and none repeated: unit 1 covers the oral vowels, the
  nasal vowels, the y, the puso and typing the Guarani letters; units 2 to 4 cover j and h, the soft r, ch, ñ, g̃, v, k,
  the letters mb, nd, ng, nt, the u that always sounds, nasal harmony, the nasal tilde, and stress and the accent mark
  (where stress falls without a mark, with a suffix, on two vowels together, and when -kuéra takes it).
- **The extras:** a placement check (8 can-do statements and 6 questions), a reduced A1 level exam (all five parts, with
  sample answers and the rubric), an original reading text for the reader, 8 minimal pairs for the speaking game and a
  word list for the typing game.

Every Guarani string was checked by two independent reviewers (spelling and morphology; meaning, Spanish and the answer
keys), with corpus counts where the notes had no answer, and the questions were answered by a blind solver who never saw
the keys. Units 2 to 4 went through this file by file: each of a unit's seven files (its six days and the week test)
had the two reviewers and then a fixer, and once the unit was whole a blind solver answered its 92 questions; in each of
the three units all 92 answers matched the keys. After that the sound steps of units 2 to 4 were reworked so that no
focus repeats, in a round with one checker and a fixer. The fixer also rewrote four questions (`a1u03d1.k1`,
`a1u03d2.k1`, `a1u04d1.k1`, `a1u04d4.k1`): they were written after the checker's reading and have not been put to a
blind solver. The lessons are original. They still need a native teacher's review before they ship: the doubts the
reviewers could not settle are listed in `notes/REVIEW-NEEDED.md`, unit by unit.

## Sound

A1 units 1 to 4 and the extras have sound: 358 clips in seven files (`project/gn-sound-*.js`), 3.7 MB, 10.8 minutes.
**The voice is synthetic**, a stand-in until a person records the course: Meta's MMS-TTS models for Guarani and for
Spanish, one man's voice for every speaker (the man's lines are the same voice lower), under **CC BY-NC 4.0,
non-commercial use only**. These clips may not ship in an app that is sold or carries advertising. Nobody has listened
to them: two speech recognisers heard every take back, and `sound/VOICE.md` is the record of what the voice renders,
what it does not, and what a native speaker should hear first.

418 of the 475 keys a screen can ask for have a clip. The other 57 are silent on purpose, because the voice does not
render what they teach or because a question would be unfair with it: the sound pairs that differ only by a nasal
vowel, mbo'y / mboy, the pairs of «La r, siempre suave», tetã / tetãme, óga / ogakuéra, twelve words and short clips
that both recognisers hear wrong, two of the twelve listening lessons (unit 1 day 3, unit 2 day 5), one of the
placement's three listening items, and the slower version of every listening lesson but one. There, as on the canvas's
other boards and in the levels that are not written, a sound control uses Yaoki's silent stand-in (it lights up for as
long as the text would take to say) and says that the audio is not recorded yet. The path, for this voice and for a
person's recordings:

```
node tools/sound-list.mjs A1                       # every clip A1 needs → sound/A1/manifest.json and lista.csv, with the count
python3 tools/make-tts.py --dry-run                # the whole list as the synthetic voice would say it; stops on anything it cannot say
# after any change in content/, sound/respell.json or sound/silent.json: say only the clips whose text, voice or respelling changed, keep every other take, make the files again
node tools/build-course.mjs && node tools/sound-list.mjs A1 && python3 tools/make-tts.py --out sound/A1/voz --verify --changed && node tools/make-sound.mjs sound/A1/voz --manifest sound/A1/voz/manifest.json --kind synthetic
node tools/make-sound.mjs <folder of recordings>   # a person's recordings → project/gn-sound-a1-u01.js … and gn-sound-index.js; reports what is still missing
node tools/make-sound.mjs check/fixtures/sound --out /tmp/x --dry-run   # a trial with the test fixtures (short tones)
node check/sound-test.js                           # the whole path in Chromium, with the fixtures, in epua-app/dist-sound
```

- **The list.** `tools/sound-list.mjs` walks the built course (`project/gn-course-a1.js`, `gn-extra.js`) and writes one
  row per clip with the key the screens ask `window.gnSound` for (`a1u01d1.p1.x0` an example, `a1u01d1.w.maitei` a word,
  `a1u01d1.s0a` a word of a sound pair, `a1u01d1.r1` a listening item and `a1u01d1.r1.slow` its slower take, `pl.3` and
  `a1x.4` the placement's and the exam's listening items, `p2.1` and `s0` the speaking game's, `c.check` the exam's test
  tone), the text, its Spanish, the voice (F the woman, the main voice; M the man; N the narrator, in Spanish), where it is
  used and the recording order. A text said already by the same voice is listed with `same` and not recorded again; a
  dialogue is recorded one line at a time (`<key>.l0`, `.l1` …, each line its own voice) and put together by the tool.
  Both words of every «Sonido y letra» pair are listed, though the Words step plays only one of the two (its target, the
  same every time): the other word's row carries `"unused": true`. It stays in the list, and is recorded, because a pair
  needs both voices if its words, and with them the word that plays, ever change; the recordings no screen plays today
  come last in the recording order, after the slower takes, and say so in their place of use («hoy no suena»).
  A1 units 1 to 4 and the extras come to 502 recordings for 736 keys; 82 of the keys are unused, and 25 of the
  recordings serve only those. The list keeps the day it was made while nothing in it changes, so making it again
  from the same course gives the same file.
- **The studio.** `docs/estudio/` (source `epua-app/studio/index.html`) is a page in Spanish for a native speaker: it loads
  the list, shows one line at a time (the Guarani big, in the Guarani face; the Spanish small; the voice and the key),
  records it with the browser's recorder (Safari on the iPhone gives `audio/mp4`, Chrome `audio/webm`), plays it back,
  keeps every take in the browser (IndexedDB, so a session goes on another day) and exports them all as one zip named by
  key, with `voices.json` (name, CC BY 4.0, as notes G4 §6 plans) and `tomas.csv`. It is served next to the app and is not
  part of the install nor of the offline copy. It loads nothing from another site.
- **The files.** `tools/make-sound.mjs <folder>` takes the unpacked zip (or any folder of
  `<key>.wav|flac|mp3|m4a|webm|ogg` with an optional `voices.json`), mixes each take down to mono, trims silence and
  levels it with ffmpeg by one gain, nothing compressed: −16 LUFS by the measure of BS.1770, taken on the mono mix that
  is encoded as if the take played in a loop, so a word of 300 ms is levelled like a sentence and a stereo take comes
  out as loud as a mono one; and no clip over −1.5 dBTP, the peak being taken on the clip's MP3 decoded again. A take
  whose peaks leave no room for both stops at the ceiling and stays quieter, and the run says how many did (279 of the
  synthetic voice's 440, by 1.1 LU at the median: `sound/VOICE.md`, «The sound files»). It pads 80 ms before and 150 ms
  after, encodes mono MP3 at 32 kb/s and 24 kHz (what Safari on iOS decodes for Web Audio; Opus it does not) and writes
  `project/gn-sound-a1-u01.js` (one file per unit), `gn-sound-pl.js`, `gn-sound-a1-x.js` and `gn-sound-sp.js`, each
  registering `window.__gnClips[key] = { ms, kind: 'human' | 'synthetic', voice, b }` (`ms` the length of the decoded
  clip; `b` the MP3 as base64, the field Yaoki's player reads; `cues` on a dialogue, where each line ends), and the
  index `project/gn-sound-index.js` (`window.__gnSoundFiles`, `window.__gnSoundVoices`). Only a key a screen can ask
  for gets a clip: a line of a dialogue is heard inside the clip put together from it, and of the two words of a sound
  pair one plays. A file whose clips did not change is left as it is, the day in its first line too, so the hash under
  which a phone stores it stays the same. It reports the keys still
  missing; a take that is silence all along (under 100 ms left after the trim) makes no clip and is listed with them. The
  exam's test tone (`c.check`) is made by the tool, at −20 LUFS, about the level of the voices, so the volume set on it
  suits the listening part. `App.dc.html` loads the index with the course; the engine (`gnCourse.needSound`) fetches a
  unit's file next to `gn-course.js` when the unit is first in use, and the placement's, the exam's or the speaking game's
  file when that screen opens (the first two also when the notebook holds a mistake made there, for Review to play), so
  the phone never holds every unit's sound at once. The app build ships the files but does not install
  them: `sw.js` stores each the first time it is fetched and, once there is a plan, the three the app names ahead of
  time (the unit in use, the unit after it, the speaking game's: «The app», above), under a hash of its content, so a
  new build keeps the unchanged ones. The canvas's other boards keep their stand-ins.
- **The screens** follow the state of a clip, which the engine says in one word (`gnCourse.soundState(key)`), on all
  eight boards that play clips (Teach, Words, Spell, Listening, Review, Placement, LevelExam, Hablar). *in*: they play
  it and keep time with it. *none* (nothing is recorded, or the voice must not say it): the stand-in, with «todavía no
  está grabado». *coming* (its sound file is asked for and not in yet: a slow line, the first lesson of a unit): the
  control waits, with a dashed grey look of its own and «cargando el audio…» where the tag goes; tapped, it says
  «Cargando el audio…» in its own line, politely, and gives nothing away: no stand-in runs, no transcript and no word
  shows, no answer opens, and no clock runs (the placement check counts no play, the level exam's pause holds its
  sound check and its start button, «Escuchá y elegí» lets nothing fall). When the file arrives the control is ready
  with no note left; where a play is free and can be repeated (an example, a word, a pair, «Escuchar» in the spelling
  pad, the listening lesson, the notebook's play card) the clip that was tapped then plays by itself, as a player
  does after loading, and a second tap or anything else calls that off; where plays are counted or the audio sets the
  pace (the placement check, the level exam, the model in Hablar, which counts as help) the learner starts it.
  *failed* (the file could not be fetched, or is not in 20 s after a control began to wait: the largest unit's file,
  0.6 MB as sent, takes 12 s at 400 kbit/s, the slowest line measured, where unit 1's took 9.5 s; 20 s covers down to
  250 kbit/s): the stand-in, with «No se pudo cargar el audio». A stand-in that has shown something (a transcript, a
  pair's word, a card of Hablar) stays for that item while the screen is open: nothing flips back under the learner
  when the file arrives late. *off* (the learner turned the voice off): the stand-in, with «Apagaste la voz sintética:
  … La activás de nuevo en Progreso.», in Hablar's menu too. The words are the engine's (`gnCourse.soundNote`,
  `soundWhy`), the same on every screen. The words lesson's note belongs to the word it is true of: every silent word
  says it on its own card, and it goes when another word is picked. Listening's «Más despacio 0.8×», shut for a
  lesson whose clip has no slower take, says «Todavía no hay versión lenta», not that something is not recorded.
  **Every screen that offers a synthetic clip says so**, with one small grey tag, «voz
  sintética», next to the control and there before anything is tapped (`gnCourse.synth(key)`, true when
  `gnSound.kind(key)` is `synthetic`): in the head of Teach's examples, of each sound pair and of the notebook's play
  card, beside a scene word's meaning, under «Escuchar» in the spelling pad, at the end of the status line in
  Listening and the placement check, in the level exam's pause and listening part, and in Hablar's dock and
  comparison. It is never in a live region: a screen reader hears what it means once a visit, from the shell, when a
  tag is really drawn (not when a screen merely asks about a clip), and the shell's region is emptied again eight
  seconds later. The pattern for a new screen, the tag and the states, is a few lines (`brief/BRIEF-core.md` §6). Listening's status line and the notebook's play
  card name who is speaking by the clip's own cues, since the two voices of a dialogue are one voice a little apart.
  **Progreso explains the voice** («Voz sintética», in its header): a program's, not a person's, not yet checked by a
  native speaker; what it does badly (the nasal vowels, whose pairs stay silent; one voice for both speakers of a
  dialogue; Spanish names and numbers; and, at times, the stressed syllable, the puso after o, u and y, and the r
  that opens a word); that some words wait in silence for a person's recording; that recordings will replace it; what
  this phone stores of the sound; the credit, with «Licencias», a second page of the sheet that shows the whole of
  `licenses.txt` (one step back from it, by «Volver», a tap outside or the system's back, is the sheet); and a switch, «Usar la voz sintética», saved with the progress (`voice`): off, the player has no
  synthetic clip (`gnSound.synthetic(false)`) and every screen shows its written stand-in.
- **The synthetic voice.** `tools/make-tts.py` says every recorded row of the list with Meta's MMS-TTS
  (`facebook/mms-tts-grn` for Guarani, `facebook/mms-tts-spa` for the narrator; a CPU is enough): each line after a
  carrier phrase that is cut off, every take heard back by two speech recognisers, the best of three kept, and what
  both hear wrong left out. The takes live in `sound/A1/voz` (440 clips as FLAC, 10.2 MB, with the seed of each and
  what was heard; 63 more in `left-out/`, every recording that stays silent, kept for a native listener). They cannot
  be made again sample for sample on another machine, so that folder is kept and added to: `--verify --changed` says
  only what a change of the content touches. Tried on 16 November, six days after the files were made: with nothing
  changed the line above said nothing, loaded no model and left every file of `sound/` and `project/` byte for byte as
  it was (2 minutes 41 seconds, nearly all of it `make-sound.mjs` encoding again); with one text changed, one clip was
  said in 15 seconds and one of the seven sound files was written anew.
  `sound/respell.json` is how the voice is given Spanish names and numbers, `sound/silent.json` what it must not say
  and why. A listener's verdict goes into `silent.json`, and the same line applies it: a clip that is freed there comes
  back from `left-out/` as it is, the very file that was heard, without the voice being run.
  The voice has no f, no dependable l and no bare d, which is why the people of the course have the names
  they have. A synthetic voice teaches the very sounds the course corrects, so the app marks it, a native speaker's
  list of what to hear first is in `sound/VOICE.md`, and the studio's recordings replace it. The licence's notice is
  in `sound/A1/voz/README.md`, in every sound file's header and in the app's `licenses.txt`.
- **The plan.** Notes G4 §6 estimate 3,850 to 6,200 clips for the six levels, about 11 hours of finished audio, two main
  voices plus guest voices, contracts that cover performer rights, and release under CC BY 4.0. Record A1 first.

## Licences

The typefaces are Nunito (SIL Open Font License 1.1) and Andika (SIL Open Font License 1.1, with the Reserved Font Names
"Andika" and "SIL": a subset that is not SIL's own file must be renamed). The sound player is Yaoki's. The lessons, the
reading text and the sample answers were written for the app.

The clips of the synthetic voice (`sound/A1/voz`, `project/gn-sound-*.js`) were made with Meta AI's MMS-TTS models and
are under **CC BY-NC 4.0**, not CC BY 4.0 like the recordings by a person that are to replace them. The credit the
licence asks for, which the app build writes into `licenses.txt` (it stops on a voice model it has no credit for) and
Progreso's «Voz sintética» gives in short:

> Voz sintética: MMS-TTS guaraní y castellano, de Meta AI (https://huggingface.co/facebook/mms-tts-grn y
> https://huggingface.co/facebook/mms-tts-spa): Pratap et al., «Scaling Speech Technology to 1,000+ Languages», 2023.
> Licencia CC BY-NC 4.0, solo para uso no comercial: https://creativecommons.org/licenses/by-nc/4.0/. Audio generado
> con esos modelos y modificado (recortes, tono) por `tools/make-tts.py`. Sin garantías.

What non-commercial means here: in a free app without advertising, as Epu'ã is today, the clips may be used and
passed on, with that credit and under the same terms; in an app that is sold, sits behind a subscription or carries
advertising they may not, and a person's recordings must replace them first (`sound/VOICE.md`, «The models and the
licence»; a reading of the licence, not legal advice). Notes G4 cover the open data that could feed later work
(Apertium's Guarani–Spanish dictionary under GPL-3.0, Wiktionary, Common Voice Guarani under CC0, Vikipetã under CC BY-SA)
and the copyright terms that apply to Guarani literature (life plus 70 years in Paraguay; US terms differ for works first
published from 1931).
