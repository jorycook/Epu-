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
| `content/` | The course as data. `levels.json` is the syllabus of all six levels (52 units, the title of every study day). `a1/parts/` holds A1 unit 1 day by day and its week test; `a1/u01.json` is the unit assembled from them; `extra/` holds the extras. |
| `tools/` | `build-course.mjs` checks the content and writes the level files; `assemble-unit.mjs` merges a unit's day files; `lint-board.mjs` checks a board for the format rules that fail silently; `smoke-boards.mjs` runs each board's logic against the engine and the data, the way the canvas and the prototype call it, without rendering; `blind-export.mjs` exports every question without its answer for a blind solver; `sound-list.mjs`, `make-sound.mjs` and `make-tts.py` are the sound path (see Sound). |
| `sound/` | The clip lists: `A1/manifest.json` (every clip the course needs, by key, with its text, voice, place and recording order; read by the tools and the studio) and `A1/lista.csv` (the same, for a spreadsheet). The recordings themselves do not live in the repository: `make-sound.mjs` turns them into `project/gn-sound-*.js`. |
| `brief/` | The design brief the boards were built from: `BRIEF-core.md` (format, wiring, typefaces, tokens, engine, content shape), `BRIEF-design.md` (language, look, mascot, the verified Guarani glossary), `BOARDS.md` (every board's spec), `CONTENT-BRIEF.md` (how the lessons are written), the font link, and `mascot/` (Kaguare's final art: `SPEC.md`, `spec.json` with every SVG, and `sheet.png`). |
| `notes/` | The research the design rests on. Y1 to Y5 map the Yaoki suite (plan and engine, the lesson loop, skills and tests, the satellites, platform and brand). G1 to G8 are the Guarani research, with a source and a confidence mark on every claim: sounds, spelling, fonts and keyboards; a verified grammar reference; learners and prior art; data, audio and licences; culture, naming and UI words; the CEFR and the level exam; the six-level syllabus; and G8, the second mascot (Kaguare: which anteater, its names, three slang screens). |
| `epua-app/` | The installable app around the screens: `src/` (Yaoki's runtime, the shell, the first-visit page, the offline worker, the page and the manifest), `studio/` (the recording studio page), `build.mjs`, `fonts.py`, `fetch-fonts.sh` and `check/app-check.js`. |
| `docs/` | The built app, for GitHub Pages. This is all a phone needs. `docs/estudio/` is the recording studio, next to the app and not part of it. |
| `check/` | Two checks of the built app in Chromium, as GitHub Pages serves it: `flows-test.js` (a learner's flows by taps, saved progress, two tabs, saved data that does not fit) and `platform-test.js` (phone sizes, the Home Screen, offline, updates, the manifest and icons, the typefaces, every screen's frame, tap targets, languages). Their screenshots go to `check/out/`, which is not kept. |

## Build and check

Needs Node 22.

```
node tools/assemble-unit.mjs a1 1      # merge A1 unit 1's day files into content/a1/u01.json
node tools/build-course.mjs            # check every content file and write project/gn-course-*.js and gn-extra.js
node tools/build-course.mjs --check    # check only
node tools/lint-board.mjs project/*.dc.html
node tools/smoke-boards.mjs            # every board, alone, inside the prototype with a fresh state, with the sample state, and in each moment another board imports it with
```

The build stops a file that is not in Unicode NFC, writes the puso as anything but the apostrophe U+0027, carries a
combining tilde outside g̃, has unbalanced markup, an answer out of range, options that repeat once their marks are
removed, a build item whose `full` does not match its tiles, a day without its parts, or a title that differs from the
syllabus. Ids carry the level (`a1u01d4.d5`, `a1u01t.12`), so items never clash across levels.

## The app

`epua-app/` makes the installable iPhone web app from the canvas's screens, the way Yaoki's `yaoki-app/` does. It plays
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
node check/flows-test.js   # a learner's flows, by taps, against docs/ (about 6 minutes)
node check/platform-test.js   # phones, offline, updates, fonts, frames, tap targets and languages, against docs/ (about 6 minutes)
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
page that says the same, with a button to go on in the browser. Progress is kept on the phone only, by each copy of
the app (the folder's address is part of its name). Two tabs of the app share it: what one tab saves is added to what
the other saved, never written over it, and each tab takes the other's changes at its next quiet moment (the week path,
the goal, a tab). A browser that keeps nothing gets a notice on the goal screen and the week path.

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
  spelling with the Guarani keyboard, then one exam-format question) and a reading or listening item. A mistake comes back
  after 1, 3 and 7 days; three right answers in a row clear it.
- **Six levels:** A1 Acceso 8 units, A2 Plataforma 10, B1 Umbral 10, B2 Avanzado 10, C1 Dominio operativo eficaz 8,
  C2 Maestría 6: 52 units, 260 study days. A1 and A2 hold the core morphology; B1 and B2 clauses, word formation,
  evidentials and Jopara as grammar; C1 register and the State's Guarani (the Constitution, Ley 4251, legal and
  administrative Guarani, the media, the Academy's new words); C2 literature, oral tradition, the other Guarani
  varieties (to know, not to master), proverbs and humour, and translation (notes G7).
- **The level exam** follows the DELE: five parts (reading, listening, mediation, writing, speaking) in two groups;
  Apto needs 60 % in each group and no part under 40 %. Reading, listening and Guarani-to-Spanish mediation are scored by
  the app; writing, speaking and Spanish-to-Guarani mediation are rated against a rubric and sample answers, by the learner
  (rated again after 48 hours, the lower score kept) or by a teacher. No CEFR framework or certificate exists for Guarani
  anywhere (notes G6), so the app calls its result a constancia, never a certificate.
- **Read, type, speak** are sections of the same app, not separate installs, reached from Progreso ("Más práctica":
  Emoñe'ẽ · Leer, Ehai · Escribir, Eñe'ẽ · Hablá). Leer shows a text and, while a phrase is
  held, its parts (prefix, root, suffix) with Spanish glosses, the word's meaning and the grammar pattern; never the
  translation of the whole sentence. Escribir is the typing game, on the phone, with the app's own keyboard (the Guarani
  row ã ẽ ĩ õ ũ ỹ g̃ ' first). Hablar has no speech recognition, because no phone or browser recognises Guarani: the learner
  hears a word and picks it from its minimal pair, or says a phrase aloud, compares it with the model and rates the take
  (recording the learner's voice is still to come: today the app says so, and on the canvas a button stands in for it).
- **It rewards accuracy, getting up again and showing up, never speed:** no leaderboards, no lives, no timers in practice.

## The look

Yaoki's system is kept exactly: the ground, the ink, the indigo, the teal for right and red for wrong, gold for tests,
2 px ink outlines with hard offset shadows, the radii, the type scale, the graph paper, the tab bar, the 50 px and 34 px
left for the phone's bars. The accent that Yaoki gives to the daruma's vermilion becomes tajy (lapacho) pink: `#C2336F`
for rings and marks, `#B02A63` for text and the ritual button, `#FCE4EE` for tints. Kaguare's fur is `#EDC27C` and his
vest a warm near-black, `#2A2120`.

Each level is a ñandutí, the lace rosette of Itauguá, that Kaguare wears pinned to his black vest. Before the goal it is
only its frame; setting the goal weaves the hub ("Tejé el primer hilo"); each unit finished fills a petal; passing the
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
  days not written show "En preparación", as Yaoki's 準備中.
- **A1 unit 1, "Mba'éichapa · Saludos y sonidos", in full:** five study days (greetings and farewells; ñande and ore; che
  réra; questions with -pa; Aguyje and courtesy), the review day and a 20-question week test: 92 items. Its sound steps
  cover the oral vowels, the nasal vowels, the y, the puso and typing the Guarani letters.
- **The extras:** a placement check (8 can-do statements and 6 questions), a reduced A1 level exam (all five parts, with
  sample answers and the rubric), an original reading text for the reader, 8 minimal pairs for the speaking game and a
  word list for the typing game.

Every Guarani string was checked by two independent reviewers (spelling and morphology; meaning, Spanish and the answer
keys), with corpus counts where the notes had no answer, and the questions were answered by a blind solver who never saw
the keys. The lessons are original. They still need a native teacher's review before they ship: the doubts the reviewers
could not settle are listed in `notes/REVIEW-NEEDED.md`.

## Sound

No clip exists yet. Every sound control uses Yaoki's silent stand-in (it lights up for as long as the text would take to
say) and says so, until recordings exist; the path for them is built and tested:

```
node tools/sound-list.mjs A1                       # every clip A1 needs → sound/A1/manifest.json and lista.csv, with the count
node tools/make-sound.mjs <folder of recordings>   # → project/gn-sound-a1-u01.js … and gn-sound-index.js; reports what is still missing
node tools/make-sound.mjs check/fixtures/sound --out /tmp/x --dry-run   # a trial with the test fixtures (short tones)
python3 tools/make-tts.py --out <folder> --dry-run   # the synthetic fallback: what it would say (a model is needed to say it)
node check/sound-test.js                           # the whole path in Chromium, with the fixtures, in epua-app/dist-sound
```

- **The list.** `tools/sound-list.mjs` walks the built course (`project/gn-course-a1.js`, `gn-extra.js`) and writes one
  row per clip with the key the screens ask `window.gnSound` for (`a1u01d1.p1.x0` an example, `a1u01d1.w.maitei` a word,
  `a1u01d1.s0a` a word of a sound pair, `a1u01d1.r1` a listening item and `a1u01d1.r1.slow` its slower take, `pl.3` and
  `a1x.4` the placement's and the exam's listening items, `p2.1` and `s0` the speaking game's, `c.check` the exam's test
  tone), the text, its Spanish, the voice (F the woman, the main voice; M the man; N the narrator, in Spanish), where it is
  used and the recording order. A text said already by the same voice is listed with `same` and not recorded again; a
  dialogue is recorded one line at a time (`<key>.l0`, `.l1` …, each line its own voice) and put together by the tool.
  A1 unit 1 and the extras come to 146 recordings for 202 keys.
- **The studio.** `docs/estudio/` (source `epua-app/studio/index.html`) is a page in Spanish for a native speaker: it loads
  the list, shows one line at a time (the Guarani big, in the Guarani face; the Spanish small; the voice and the key),
  records it with the browser's recorder (Safari on the iPhone gives `audio/mp4`, Chrome `audio/webm`), plays it back,
  keeps every take in the browser (IndexedDB, so a session goes on another day) and exports them all as one zip named by
  key, with `voices.json` (name, CC BY 4.0, as notes G4 §6 plans) and `tomas.csv`. It is served next to the app and is not
  part of the install nor of the offline copy. It loads nothing from another site.
- **The files.** `tools/make-sound.mjs <folder>` takes the unpacked zip (or any folder of `<key>.wav|mp3|m4a|webm|ogg`
  with an optional `voices.json`), trims silence and levels loudness with ffmpeg (−16 LUFS, peaks under −1.5 dBTP), pads
  80 ms before and 150 ms after, encodes mono MP3 at 32 kb/s and 24 kHz (what Safari on iOS decodes for Web Audio; Opus
  it does not), measures each clip and writes `project/gn-sound-a1-u01.js` (one file per unit), `gn-sound-pl.js`,
  `gn-sound-a1-x.js` and `gn-sound-sp.js`, each registering `window.__gnClips[key] = { ms, kind: 'human' | 'synthetic',
  voice, b }` (`b` the MP3 as base64, the field Yaoki's player reads; `cues` on a dialogue, where each line ends), and the
  index `project/gn-sound-index.js` (`window.__gnSoundFiles`, `window.__gnSoundVoices`). It reports the keys still
  missing. `App.dc.html` loads the index with the course; the engine (`gnCourse.needSound`) fetches a unit's file next to
  `gn-course.js` when the unit is first in use, and the placement's, the exam's or the speaking game's file when that
  screen opens, so the phone never holds every unit's sound at once. The app build ships the files but does not install
  them: `sw.js` stores each the first time it is fetched and the rest of the level in the background once there is a plan,
  under a hash of its content, so a new build keeps the unchanged ones. The canvas's other boards keep their stand-ins.
- **The screens** change nothing when a clip exists (`has()` was always the test): they play it and keep time with it.
  One honest signal is new: when the clip's kind is `synthetic` (`gnSound.kind(key)`), the Words sound step and Hablar say
  «voz sintética».
- **The synthetic fallback.** `tools/make-tts.py` says every recorded row of the manifest with a voice model and writes
  WAVs plus a `voices.json` marked synthetic, for `make-sound.mjs --kind synthetic`: Meta's MMS-TTS (`facebook/mms-tts-gug`,
  then `grn`; CC BY-NC 4.0, non-commercial use only; needs huggingface.co and its file hosts) or a Piper voice given as a
  path (`.onnx` with its `.json`, such as the Guarani "T2" voice of the public-domain guarani-voice project, whose weights
  the owner exports or trains). No model is reachable from the build environment, so only its `--dry-run` was run. A
  synthetic placeholder would teach the very sounds the course corrects (Kokoro has no Guarani voice; espeak-ng drops the
  puso and does not nasalise g̃), so the app marks it and the studio's recordings replace it.
- **The plan.** Notes G4 §6 estimate 3,850 to 6,200 clips for the six levels, about 11 hours of finished audio, two main
  voices plus guest voices, contracts that cover performer rights, and release under CC BY 4.0. Record A1 first.

## Licences

The typefaces are Nunito (SIL Open Font License 1.1) and Andika (SIL Open Font License 1.1, with the Reserved Font Names
"Andika" and "SIL": a subset that is not SIL's own file must be renamed). The sound player is Yaoki's. The lessons, the
reading text and the sample answers were written for the app. Notes G4 cover the open data that could feed later work
(Apertium's Guarani–Spanish dictionary under GPL-3.0, Wiktionary, Common Voice Guarani under CC0, Vikipetã under CC BY-SA)
and the copyright terms that apply to Guarani literature (life plus 70 years in Paraguay; US terms differ for works first
published from 1931).
