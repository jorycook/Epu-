# Y5 · Platform, visual language, mascot and icon, copy voice (Yaoki → Guarani)

Sources read in full or in the parts named: `yaoki-app/build.mjs`, every file of `yaoki-app/src/`, `fonts.py`, `fetch-fonts.sh`,
`docs/licenses.txt`, `check/` (all headers; `app-test.js`, `release-checks.sh`, `rt-check.js`, `setup-site.sh`, the runners
in full), all 29 `yaoki/project/*.dc.html` (palette, type, radii, borders and shadows counted by script over all of them),
`docs/typing/index.html` + `game.js` (stamps, tokens, Yaoki's poses), the reader's and Speaking's token blocks, the README,
and the Mascot & Icon canvas (`canvas.json`, Main, Icon, HomeScreen, Mascot, Logo, Rules; images known by alt text only).
Font claims in §7.3 were tested by rendering in headless Chrome (HarfBuzz shaping) on 2026-11-03, with the font files
from `google/fonts` (the source `fetch-fonts.sh` uses) and the live Google Fonts CSS. Safari was not tested.

---

## 0. The twelve things that matter most

1. **One set of screens, two runtimes.** Each screen is one `.dc.html` file. The canvas runs it with its own runtime
   (`support.js`); the installable app runs the same file with `yk-runtime.js` (Preact 10.29.8), after `build.mjs` turns
   each file into a `YK.define(name, template, logic)` call. Write Guarani screens only with the format's documented
   features (dotted `{{ path }}` holes, `sc-if`, `sc-for`, `dc-import`, a `DCLogic` class), so they can become an app later.
2. **Build constraints to respect from day one** (they fail the Yaoki build otherwise): a `<helmet>` holds only a Google
   Fonts `<link>` and `<style>` blocks whose rules each sit whole on one line; logic never contains `</script`; scrolling
   boxes are written exactly `overflow-y: auto` (app.css hides their scrollbar by matching that literal string).
3. **Layout invariants** (the checks enforce them): root 390×844; top 50 px empty (status bar); bottom 34 px kept clear
   (home indicator), except the tab bar; every `button`/`a` at least 44×44; nothing leaves the frame unless it sits inside
   an `overflow-y: auto` box; root `scrollHeight` equals 844.
4. **The look in one sentence:** stamp-card stationery. Cool paper ground `#F4F5F9`, white cards, navy ink `#1B2440`
   outlines at 2 px, hard offset shadows `0 4px 0 #1B2440` (never a blur), indigo `#2F4FD0` for action, daruma red
   `#E2452B` for shapes and rings but `#C7361E` for red text, gold `#F2B43A` for highlights, teal `#0B7A6B` for correct,
   radii 14/16/18/20 and 26 for sheets, M PLUS Rounded 1c 500/700/800 for UI and Klee One 600 for the target language.
   For Guarani, G5's warning that pure red or blue reads as party colours moves primary actions from indigo to an ink
   fill with a red-earth shadow, on ao po'i cream (§7.4); the structure (outlines, hard shadows, radii) stays.
5. **Tokens already have names:** Yaoki Typing, Reader and Speaking define them as CSS variables (`--ground`, `--card`,
   `--ink`, `--muted`, `--line`, `--line-strong`, `--outline`, `--hard`, `--accent`, `--accent-ink`, `--accent-soft`,
   `--on-accent`, `--mark`, `--note`, `--stamp`, `--scrim`, `--good`, `--good-soft`, `--bad`, `--bad-soft`, `--gold`,
   `--daruma`, `--grid`, `--ui`, `--jp`), with a dark set. Canvas artboards inline the hex values instead (format rule).
6. **Fonts for Guarani, verified by rendering.** M PLUS Rounded 1c cannot carry Guarani: in one font file (what the app
   build ships) the tilde of **g̃ lands on the next letter** and **G̃'s tilde floats off to the right**; its ASCII `'` (the
   puso) is drawn slanted. Klee One draws **spacing tildes** (g˜) and has **no ỹ / Ỹ**. Nunito and Andika render all of
   ã ẽ ĩ õ ũ ỹ g̃ and their capitals correctly. Recommendation: **Nunito 500/700/800 for UI, Andika 400/700 for Guarani
   text**. This corrects Y1 §6.5, which kept M PLUS Rounded 1c for UI.
7. **Google Fonts' subsets split g̃.** The combining tilde U+0303 is only in the `vietnamese` subset, `g`/`G` in `latin`.
   In Chrome, lowercase g̃ still positions well, but **capital G̃ falls back to a system serif** (true for M PLUS, Nunito
   and Andika alike). On the canvas, load fonts with a css2 **`text=`** link (one file; verified: G̃ correct) or as uploaded
   full files. In the app, `fonts.py` already makes one file per weight with the `mark`/`mkmk` features: correct.
8. **Licence trap:** Andika carries the Reserved Font Names "Andika" and "SIL". The Yaoki build subsets fonts under their
   own names; a subset is a Modified Version, so for Andika either rename the subset's family or ship SIL's unmodified
   web font. Nunito, M PLUS Rounded 1c and Klee One have no reserved names.
9. **The mascot** is a red daruma (egg shape, face oval, one eye painted) called Yaoki after 七転び八起き ("fall seven
   times, get up eight"). Six moments (blank, one eye, studying, a miss, back up, both eyes); the eye rule (his own left
   eye, on the viewer's right, at goal; the other at a pass); a strict colour set (ink, daruma red, gold, face, indigo).
   The Guarani app needs its own mascot, name and two-step ritual: G5 (culture and naming) recommends the name
   "Epu'ã" and a tatu bolita mascot ("Tatu'i"), which rolls into a ball when hit and pops up again, exactly Yaoki's
   mechanic; §7.6 gives the brand rules it must meet.
10. **Stamps carry the rewards:** 済 (done), 試 (week test node), 起 (comeback, Typing/Speaking), はなまる (a scalloped
    teacher's ring for a clean answer), and the teacher's hanko on test results (たいへんよくできました ≥80 %,
    よくできました ≥60 %, がんばりましょう below). Every recipe is in §3.12.
11. **Voice:** plain words, short sentences, no contractions, almost no em dashes, British spelling, honest about limits.
    Labels pair the target language and the learner's: `はじめる　Start` (U+3000 between). Feedback always says what
    happens next ("Saved to your mistake notebook. It comes back tomorrow.").
12. **Tests:** Playwright suites against the canvas runtime and against the app build, a per-board layout inspector,
    click-throughs, a content sweep of every answer, an app suite (saved progress, menu, install page, 8 iPhone sizes,
    status-bar strips, short and wide screens, sideways, offline, updates) and fault flags (`NOSOUND`, `HELDBACK`,
    `BADCLIPS`, `OMELETTE`, `FAST_MOCK`, `FAST_EXAM`). Note for the canvas step: the Design SKILL says never verify a
    canvas unless the user asks; the Yaoki checks belong to a later repository step.

---

## 1. Platform architecture

### 1.1 The parts and how they relate

```
Design canvas "Yaoki JLPT App" (claude.ai Design type)          repository (GitHub Pages from /docs)
  project/canvas.json, 29 *.dc.html, course*.js, sound*.js  ==copies==>  yaoki/project/  (same files)
  App.dc.html = prototype frame (one shared state)                          |
                                                                            v  yaoki-app/build.mjs
                                       dist/ = docs/:  index.html, manifest.webmanifest, sw.js, licenses.txt, .nojekyll,
                                       icons/*.png, assets/{preact.min.js, yk-runtime.js, app.css, screens.js, screens.css,
                                       fonts.css, fonts/*.woff2, yk-app.js, build.js, sound*.js, course*.js, ...}
                                       dist-preview/yaoki-app.html  (the same app as a private page inside Claude)
```

- README: "The design itself lives on the design canvas 'Yaoki JLPT App'; the screens here are copies of the canvas's
  files." Change a screen: edit `yaoki/project/X.dc.html`, rebuild, and publish the same file to the canvas.
- **Engine and data are plain scripts beside the screens** (`course.js` + `course-n5.js` … `course-n2.js`, `sound.js`
  + clip files, `strokes.js`, `yk-write.js`), loaded in each artboard's `<head>` after `<script src="./support.js">`
  as `<script src="./course.js"></script>`, and read as `window.ykCourse`, `window.ykSound`, `window.ykWrite`.
  (Y1 documents the engine API.) The Design SKILL discourages "your own `window.X`" for building UI; Yaoki uses globals
  for data and pure functions only and keeps all UI in markup. Keep that split.
- **Prototype frame:** `App.dc.html` (canvas) and `Shell.dc.html` (app) mount every screen as
  `<sc-if value="{{ at.X }}"><div style="animation: yk-in 220ms ease-out"><dc-import name="X" go="{{ go }}"
  app="{{ app }}" save="{{ save }}" miss="{{ miss }}" reviewed="{{ reviewed }}" ...></dc-import></div></sc-if>`.
  Shell adds `menu="{{ openMenu }}"`, the menu sheet, and saved progress (`ykApp.start()` / `ykApp.remember()`).
- **Dual-mode screens:** a link is `<a href="Today.dc.html" onClick="{{ toToday }}">`; the handler calls
  `e.preventDefault(); go('Today')` when `props.go` exists (inside the frame), else the link moves Play to that artboard.
  Opened alone, a screen shows its "designed moment" from sample data. **Moment boards** are tiny wrappers
  (`MockPaper.dc.html` = `<dc-import name="MockRun" view="paper" hint-size="390px,844px">`) that show one component in a
  given state as its own artboard (ExamResult, MockAnswers, MockBreak, MockListening, MockPaper, MockReading,
  MockResult, MockSheet, SceneWrite).

### 1.2 What `build.mjs` does, step by step

0. Runs `../tools/build-course.mjs` (content → `course-*.js`) and `make-strokes.py --check`.
1. For each screen (`LEVELS[...].screens`) and the app's own `Shell` and `Install` (`src/`): extracts the template
   (`<x-dc>` minus `<helmet>`), the helmet's style rules, and the logic script; writes
   `YK.define("Name", "<template>", function (DCLogic) { <logic> ;return (typeof Component !== "undefined" && Component)
   || undefined; });` into `assets/screens.js`. **Throws** if a helmet rule spans lines or braces do not balance
   ("a helmet style rule must sit on one line"), if the helmet holds anything but `<style>` and
   `<link href="https://fonts.googleapis.com…">`, or if the logic contains `</script`.
2. Gathers all helmet rules into `assets/screens.css` (deduplicated); `a:hover{…}` is wrapped in `@media (hover:hover)`
   so a tapped link is not left tinted on a phone.
3. Fonts: `fonts.py` over every text source (screens, the filled own files, the word data, `yk-app.js`, `index.html`).
   Icons: the daruma SVG drawn by `sharp` at five sizes (§4.6).
4. Copies `preact.min.js`, `yk-runtime.js`, `app.css`, the sound and data scripts; fills and writes `yk-app.js`,
   `index.html`, `manifest.webmanifest`; assembles `licenses.txt` (Preact MIT text, OFL text, voices, KanjiVG, Hanzi
   Writer, trademark notice).
5. Version: SHA-256 over every output file plus version and date, first 10 hex digits. Writes `assets/build.js`
   (`window.__ykBuild = "Yaoki prototype 0.1 · <date> · <6 hex>"`) and `sw.js` with the exact file list and the lazy
   files' content hashes. Writes `.nojekyll`.
6. Preview for Claude: `dist-preview/yaoki-app.html` = `<title>`, a Google Fonts link (M PLUS Rounded 1c 500/700/800,
   Klee One 400/600), `app.css` + `screens.css` inline, Preact from `cdn.jsdelivr.net/npm/preact@10.29.8`,
   `window.__ykHost = 'artifact'`, no offline, nothing installable.

Per-app settings live in `LEVELS` (N2 = main app: name `Yaoki`, full name `Yaoki JLPT`, tile `#F2B43A`; N1: `Yaoki N1`,
`Yaoki JLPT N1`, tile `#2F4FD0`), with screens, scripts, words (files whose text the fonts must hold), sounds, lazy
patterns, credits and licence lines. Shared files mark app-only lines with `<!-- #if N1 -->…<!-- #else -->…<!-- #end -->`
or `/* #if N1 */…/* #end */` (each mark alone on its line); placeholders `%APP_NAME%`, `%APP_FULL_NAME%`, `%APP_ABOUT%`,
`%TILE%`, `%CREDITS%`, `%EXTRA_SCRIPTS%`, `%ASYNC_SCRIPTS%` are filled.

### 1.3 `yk-runtime.js`: what the app's runtime supports

- Holes in text and attributes: `"{{ x }}"` gives the raw value (functions, numbers), `"a {{ x }} b"` a string; text
  holes render as `<span class="sc-interp">`. Boolean attributes (`disabled`, `hidden`, `checked`, …) with an empty
  value are `true`. `hint-*` and `data-dc-*` attributes are skipped; `helmet`, `script`, `style`, `link`, `meta` ignored.
- `<sc-if value>`, `<sc-for list as>` (with `$index`), `<dc-import name>` (other attributes become props, kebab → camel;
  only positional host styles pass: position, left/right/top/bottom/inset, width/height, z-index, transform).
- `DCLogic`: `props`, `state`, `setState(patch | fn, done)` (applied to `logic.state` at once, then redrawn),
  `forceUpdate()`, `componentDidMount/DidUpdate/WillUnmount`, `renderVals()`. Errors show a `.sc-logic-error` banner.
- It also evaluates `!x`, `===`, `!==`, `==`, `!=`, literals and `a[b]` in holes. **Do not use them**: the canvas format
  promises dotted lookups only ("never an expression"). Compute in `renderVals()`.

### 1.4 The app around the screens (`yk-app.js`, `app.css`, `index.html`)

- **Fit:** W 390, H 844, `TOP = 50` (the design's empty status-bar zone), `GAP = 8`. Within 2 % of the shape → stretch to
  fill. Shorter by about a status bar → leave out up to 42 px of the top zone and squeeze at most 3 %. Much shorter
  (width ≤ 520) → scale to the height without the top zone, centred. Anything else → whole design centred in a phone
  frame (`html.yk-boxed`: backdrop `#C9D0E3`, `border-radius: 30px; box-shadow: 0 0 0 3px #1B2440, 0 20px 50px
  rgba(27, 36, 64, 0.28)`); a touch phone held sideways gets `#yk-sideways` (`role="status"`: 縦向きでお使いください /
  "Turn the phone upright"). The Install page is "fluid": full width, at most 1.25× scale, as tall as the browser.
- **Saved progress:** `localStorage` key `'yaoki.v1:' + folder`, probed first; validated field by field on load; "Start
  over" clears it. Typing (`yaoki.typing.v1`) and Speaking (`yaoki.speaking.v1`) read the app's key and never write it.
- **Test hooks** only on localhost: `?yktest&screen=X&…` sets the start state from the address and saves nothing;
  `?browser` skips, `?install` forces the Install page; `?sw` allows the worker on localhost.
- **iPhone quirks:** `navigator.audioSession.type = 'playback'` (else the silent switch mutes Web Audio); a screen wake
  lock on `MockRun`, `Listening`, `Review`; `theme-color` switches to `#1B2440` on MockRun (ink band) and back to
  `#F4F5F9`; pinch and double-tap zoom prevented; a tap on an unhandled `*.dc.html` link is swallowed.
- **Install page** (`Install.dc.html`) on iPhone/iPad Safari when not standalone, once per visit (sessionStorage):
  three numbered steps (Tap Share · Tap Add to Home Screen · Open Yaoki from its icon) and "ブラウザで続ける　Continue
  in the browser". Must fit an iPhone 14 in Safari without scrolling (tested).
- **Updates:** a new worker → restart only at a quiet moment (Main, Goal), or at once within 5 s of opening before any
  tap; never in a lesson or a mock; not when progress cannot be saved.
- `index.html` meta: viewport `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no,
  viewport-fit=cover`; `theme-color #F4F5F9`; `color-scheme light`; `apple-mobile-web-app-capable yes`; status-bar style
  `default`; `format-detection telephone=no, date=no, address=no, email=no`; `robots noindex, nofollow`;
  `<noscript>Yaoki needs JavaScript to run.</noscript>`. The first screen is revealed once
  `"800 16px 'M PLUS Rounded 1c'"` (sample 目標) and the 500 weight are loaded, or after 900 ms.
- Manifest: `display standalone`, `orientation portrait`, `background_color`/`theme_color #F4F5F9`, `lang en`, icons
  192, 512 and 512 maskable.

### 1.5 Offline worker (`sw.js`)

Cache name `'yaoki:' + folder + ':' + VERSION`, so two apps under one site never touch each other's store. Install:
every file fetched as `file?v=VERSION` with `cache: 'reload'`; unchanged lazy files (sound) carried over from older
stores 50 at a time; `skipWaiting`. Activate: delete this folder's older stores; `clients.claim`. Fetch: cache-first
(`ignoreSearch`), navigations inside the folder get the cached `index.html`, folders below go to the network; lazy files
(`?h=<hash>`) stored on first use. Message `{ keepLevel: 'n5' }` stores a level's sound in the background.

### 1.6 Fonts and licences pipeline

`fetch-fonts.sh` downloads six files (~27 MB) from `raw.githubusercontent.com/google/fonts/main/ofl` and compares
SHA-256 prefixes. `fonts.py` keeps ASCII plus every character in the text sources (HTML entities and `\uXXXX`
expanded), subsets each face to WOFF2 with `layout_features = [ccmp, locl, liga, clig, calt, kern, mark, mkmk, rlig]`,
no hinting, `name_IDs [0, 1, 2, 3, 4, 6, 13, 14]`, and writes `fonts.css`
(`@font-face{font-family:'…';font-style:normal;font-weight:N;font-display:swap;src:url(./fonts/x.woff2)
format('woff2')}`), printing what each face lacks ("the system font draws them"). `docs/licenses.txt` sections:
Preact (MIT), Typefaces (OFL 1.1, "included as subsets holding only the characters this app shows"), Voices (Kokoro-82M,
Apache-2.0; two voices from Koniwa, CC BY 3.0), KanjiVG (CC BY-SA 3.0), Hanzi Writer (MIT), Trademarks and content.

---

## 2. Visual token table (exact values)

### 2.1 Colours: counts over the 29 canvas screens, and roles

Counted by script over every hex in `yaoki/project/*.dc.html` (style attributes and logic strings).

| Token (Typing CSS) | Hex | Count | Where it is used |
|---|---|---|---|
| `--ink` `--outline` `--hard` | `#1B2440` | 389 | root text colour; 2 px outlines (121 border uses); hard shadows (60); icon strokes (63); the ink band (MockRun header), the scene board, step-number discs |
| `--muted` | `#5A6382` | 195 | secondary text (170 `color` uses): kickers, meta, notes, ledes, inactive tab labels, `rt` |
| `--card` `--on-accent` | `#FFFFFF` | 182 | cards, sheets, quiet buttons (91 backgrounds); text on filled buttons (53) |
| `--accent` `--accent-ink` | `#2F4FD0` | 125 | primary buttons, selected option border 2.5 px, progress fills, kickers and links, the current tab, today's node, play buttons; the N1 tile |
| `--stamp` `--bad` | `#C7361E` | 80 | 済 text, ✕ marks, wrong option border 2.5 px, danger buttons, red kickers (WEEK TEST, HINT), "Paint the first eye" |
| `--line` | `#DDE1EC` | 57 | quiet 2 px borders, progress tracks, the tab bar's top border, todo pills, disabled button fill |
| `--ground` | `#F4F5F9` | 40 | every screen root; `theme-color`; manifest colours |
| `--good` | `#0B7A6B` | 40 | ○ marks, right option border 2.5 px, done-pill text, the Next button after a right answer, notebook pips |
| `--line-strong` | `#C9D0E3` | 34 | disabled borders, dashed empty slots, the dotted path, locked node ring, sheet grabber, waveform bars not yet played, sub-line on the ink band |
| `--accent-soft` | `#E8ECFB` | 29 | selected option fill, icon tiles (文), tags, play button idle, info card, "now" stamp slot |
| `--gold` | `#F2B43A` | 26 | daruma beard lines, star fill, "playing" state, test node 試, run chip, clue underline, the flag icon's fill; the main-app tile |
| `--bad-soft` | `#FDEBE6` | 21 | wrong feedback sheet, wrong option fill, alert cards, days-left badge, "your pick" tag, vocab tag |
| `--daruma` | `#E2452B` | 21 | daruma body; stamp rings (2.5/3/4 px); the red route on the week path; low-clock fill |
| `--good-soft` | `#E0F3EF` | 17 | right feedback sheet, right option fill, done pills, 卒業 tile, listening tag |
| (short `#fff`) | `#FFF` | 16 | daruma eye whites |
| `--note` | `#FFF4D6` | 11 | "Watch out" card, reading icon tile, empty star slot, info chips (12問 · 約15分), weak-spot tag |
| face | `#FFF6EA` | 8 | daruma face |
| `--mark` | `#FFE9B0` | 6 | highlighted pattern in text, the tile on the star, flag button on |
| score track | `#D9E0F8` | 6 | score-bar tracks (Readiness, MockFull, WeekTest) |
| rule | `#EEF0F6` | 5 | row rules in result lists, 未発表 chip, disabled Next fill |
| `--grid` | `#E6E9F3` | 4 | graph-paper lines (Main only), locked node fill, not-ready test node |
| disabled tab | `#B9BFD0` | 3 | a tab not open yet |
| disabled label | `#9AA1B5` | 3 | a level not written yet, a faded hint |
| board edge | `#6E7BA8` | 2 | word chips on the dark scene board (dashed, solid once found) |
| board selected | `#2A3560` | 1 | the selected word chip on the scene board |
| below-line track | `#F8D6CC` | 1 | score track of a section under its pass line (fill `#C7361E`) |
| scrim | `rgba(27, 36, 64, 0.5)` | 4 | behind sheets (Typing uses 0.45) |

Rules visible in the counts: the **two reds** have separate jobs (`#E2452B` 4.10:1 on white, shapes and rings only;
`#C7361E` 5.28:1, all red text); gold never carries text except ink on gold (8.28:1); the main app is light-only
(`<meta name="color-scheme" content="light">`). The Mascot canvas uses `#5A6380` for muted text (one digit off) and
graph paper `#E4E8F1` at 32 px; it is a presentation board, not an app screen.

**Dark set** (Typing, Reader, Speaking only; `@media (prefers-color-scheme: dark)` under `:root:not([data-theme="light"])`
and again under `:root[data-theme="dark"]`): ground `#12172A`, card `#1C233B`, ink `#E8EBF6`, muted `#A6AECA`, line
`#2C3554`, line-strong `#3B466C`, outline `#7B86B4`, hard `#05070F`, accent `#4560E0`, accent-ink `#A9B8FF`,
accent-soft `#262F58`, on-accent `#FFFFFF`, mark `#5E4B10`, note `#37301A`, stamp `#FF8D76`, scrim
`rgba(3, 5, 12, 0.6)`, good `#4FC7B2`, good-soft `#12342F`, bad `#FF8D76`, bad-soft `#3A1F1A`, grid `#1A2137`.

**Contrast, computed (WCAG):** ink on ground 14.04; muted on ground 5.44, on card 5.93, on accent-soft 5.03; accent
text on card 6.67, on accent-soft 5.66; white on accent 6.67, on `#C7361E` 5.28, on `#0B7A6B` 5.24; `#C7361E` on
bad-soft 4.58; `#0B7A6B` on good-soft 4.55; ink on gold 8.28; `#C9D0E3` on ink 9.92. Below 4.5 and only where allowed:
`#E2452B` rings 4.10 (non-text), white on `#E2452B` 4.10 (the 18 px/800 low clock), disabled `#9AA1B5` 2.37 and
`#B9BFD0` 1.84. Correct and wrong reds/greens have nearly the same lightness (L* 46 vs 47): Yaoki never relies on colour
alone (○/✕ plus words).

### 2.2 Type

- **Families:** UI `'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif` (on every root; MockRun switches
  back to `'M PLUS Rounded 1c', sans-serif` in 3 places inside Japanese passages); target-language text `'Klee One', 'Hiragino Mincho ProN', serif` (34 uses: example sentences, passages,
  options in Japanese, the Teach page's pattern heading, kanji, tiles). Link in each helmet:
  `https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600&display=swap`.
- **Weights** (count): 800 ×285 (titles, buttons, labels, numbers), 700 ×110 (secondary labels, English after Japanese),
  500 ×79 (body and notes), 600 ×36 (Klee One text), 400 ×15 (ruby `rt`, Klee One regular).
- **Sizes** (count → typical role): 9 ×17 (`rt` furigana, "準備中" under a chip), 10 ×2 (stamp in a header chip,
  version line), 11 ×69 (tab labels, small kickers, tags, chip text), **12 ×130** (kickers, section heads in cards,
  notes, pills), 13 ×78 (ledes, instructions, explanations), 14 ×45 (muted subtitles beside headings, chips), 15 ×36
  (list titles, small buttons, Japanese passage text), 16 ×38 (card titles, card buttons, options), 17 ×36 (full-width
  primary buttons), 18 ×15 (sheet titles, a passage), 20 ×11 (verdicts, pace numbers), 22 ×10 (tab-screen H1,
  question heads), 26 ×12 (lesson H1, unit title, today node), 34 ×1 (Teach pattern heading, Klee One), 44 ×3 (due
  count), 52 ×2 (Readiness total), 56 ×2 (test score); singles at 12.5, 19, 21, 23, 24, 28, 40, 46.
- **Line heights:** 1.45 ×31 (notes), 1.5 ×19 (ledes), 1.4, 1.3, 1.1, 1.35; Japanese passages with ruby 1.7–2.1.
- `rt{font-size:9px;font-weight:400;color:#5A6382}` in every helmet; `font-variant-numeric: tabular-nums` on clocks;
  `line-break: strict` on roots (a Japanese line-breaking rule).

### 2.3 Radii, borders, shadows, spacing

- **Radii** (count): 16px ×59 (primary buttons, small cards, sheets' inner panels), 14px ×33 (card buttons, options,
  icon tiles, level chips), 50% ×30 (stamps, round buttons, nodes), 18px ×27 (cards, path card), 4px ×26 (text
  highlight, thin bars), 12px ×23 (tiles, small buttons, alert rows), 20px ×21 (hero cards), 10px ×21 (pills, tags,
  badges), 8px ×10, 6px ×9, `26px 26px 0 0` ×8 (sheets), 5px ×7, `0 4px 4px 0` ×7 and `0 6px 6px 0` ×4 (bar fills),
  22px ×4 (44 px header chips), `16px 16px 16px 4px` ×2 (Yaoki's speech bubble). Device frames on the canvas: 44.
- **Borders** (style attributes + logic strings): `2px solid #1B2440` 103 + 24; `2px solid #DDE1EC` 25 + 14;
  `2px solid #C9D0E3` 5 + 10; `2px dashed #C9D0E3` 5; state borders at **2.5px** (`#2F4FD0` selected, `#0B7A6B` right,
  `#C7361E` wrong; 5 each); stamp rings `2.5px`/`3px`/`4px solid #E2452B`; nodes `3px solid #1B2440`;
  `border-top: 2px solid #1B2440` on sheets, `border-top: 2px solid #DDE1EC` on the tab bar.
- **Shadows: hard, offset straight down, no blur.** `0 4px 0 #1B2440` ×37 (+5 in logic), `0 3px 0 #1B2440` ×11
  (+6), `0 5px 0 #1B2440` ×1 (today's node), and the inverted exam button `0 4px 0 #2F4FD0` ×2 / `0 3px 0 #2F4FD0`.
  A pressed or selected control drops its shadow (`'none'` ×24 in logic). The Mascot canvas's boards use diagonal
  `5px 5px 0` / `6px 6px 0 #1B2440`; icons use an ink shadow shifted (3.5, 4.5) in 100-unit space. Only the boxed phone
  frame in `app.css` has a soft shadow. Typing/Reader add a press: `.btn:active { transform: translateY(3px);
  box-shadow: 0 1px 0 var(--hard); }` (the canvas screens have none).
- **Spacing:** side gutter 16 px (20 px on Goal and Install); root `padding: 50px 16px 34px` (or `padding-top: 50px`
  with a tab bar); gaps 6/8/10/12/14; card padding `14px 16px 16px` (hero) or `12px 14px`.

### 2.4 Motion (exact keyframes)

```css
@keyframes yk-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}      /* every screen: 220ms ease-out */
@keyframes yk-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}      /* sheets: 240ms ease-out */
@keyframes yk-fade{from{opacity:0}to{opacity:1}}                                               /* scrims: 160ms ease-out */
@keyframes yk-stamp{0%{opacity:0;transform:scale(1.8) rotate(-20deg)}55%{opacity:1;transform:scale(.92) rotate(-9deg)}100%{opacity:1;transform:scale(1) rotate(-9deg)}}
/* yk-stamp: 500ms ease-out both (day done, notebook caught up); 550ms ease-out 150ms both (week-test hanko) */
/* Typing/Speaking only: */
@keyframes yk-day { 0% { opacity: 0; transform: scale(1.8) rotate(-20deg); } 55% { opacity: 1; transform: scale(.92) rotate(var(--tilt, -9deg)); } 100% { opacity: 1; transform: scale(1) rotate(var(--tilt, -9deg)); } }
@keyframes yk-ring { from { opacity: .5; transform: scale(.9); } to { opacity: 0; transform: scale(1.35); } }   /* ink ring where the hanko lands: 400ms ease-out 452ms */
@keyframes yk-draw { from { stroke-dashoffset: 1; } }                                          /* はなまる drawn round the hanko: 900ms ease-out 750ms, path pathLength="1" */
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } .btn:active, .key.ok, .key.miss { transform: none; } }
```

Transitions: `background 150ms` (play buttons, sound check), `width 300ms` (progress fills), `opacity 300ms ease-out`
(the painted pupil on Goal), `transform 150ms` (Typing's switch). The canvas screens do not honour reduced motion
(Y1 pitfall 11); add the rule above.

### 2.5 Graph paper

Week path area only (Main): `background-image: linear-gradient(#E6E9F3 1px, transparent 1px), linear-gradient(90deg,
#E6E9F3 1px, transparent 1px); background-size: 26px 26px` over the ground. Mascot canvas boards:
`background-color: #F4F5F9; background-image: linear-gradient(#E4E8F1 1px, transparent 1px), linear-gradient(90deg,
#E4E8F1 1px, transparent 1px); background-size: 32px 32px`. Typing's scenes sit "under a faint graph paper".

---

## 3. Component recipes (inline styles, copied from the screens)

### 3.1 Screen root and helmet

```html
<helmet>
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">
<style>
body{margin:0}
button{font:inherit;color:inherit;cursor:pointer}
a{color:#2F4FD0;text-decoration:none}a:hover{color:#1B2440}
rt{font-size:9px;font-weight:400;color:#5A6382}
@keyframes yk-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
</style>
</helmet>
<div style="width: 390px; height: 844px; box-sizing: border-box; padding: 50px 16px 34px; background: #F4F5F9; color: #1B2440; font-family: 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif; line-break: strict; display: flex; flex-direction: column; overflow: hidden">
```

With a tab bar: `padding-top: 50px` only, the content in `flex-grow: 1`, the `<nav>` last. A scrolling middle:
`flex-grow: 1; min-height: 0; overflow-y: auto` (spell it exactly so).

### 3.2 Top bars and header chips

```html
<!-- lesson bar: close, progress, kicker -->
<div style="display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 16px; flex-shrink: 0">
<a href="Today.dc.html" onClick="{{ toToday }}" aria-label="Close lesson" style="width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2440" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></a>
<div role="img" aria-label="{{ barLabel }}" style="flex-grow: 1; height: 12px; border-radius: 6px; background: #DDE1EC; overflow: hidden"><div style="height: 12px; border-radius: 0 6px 6px 0; background: #2F4FD0; transition: width 300ms; width: {{ barW }}"></div></div>
<div style="font-size: 12px; font-weight: 800; color: #2F4FD0">練習 DRILL</div>
</div>
<!-- back + centred title -->
<a ... aria-label="Back to the week path" style="width: 44px; height: 44px; margin-left: -8px; display: flex; align-items: center; justify-content: center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B2440" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>
<div style="flex-grow: 1; text-align: center; font-size: 15px; font-weight: 800">{{ dayLabel }}</div><div style="width: 36px"></div>
<!-- tab-screen heading -->
<h1 style="margin: 0; flex-grow: 1; font-size: 22px; font-weight: 800">合格判定 <span style="font-size: 14px; font-weight: 700; color: #5A6382">Readiness · N2</span></h1>
<!-- header chips (Main): level chip opens the menu; stat chips -->
<button aria-label="{{ levelAria }}" onClick="{{ openMenu }}" style="height: 44px; padding: 0 16px; border-radius: 22px; border: 2px solid #1B2440; background: #FFFFFF; font-weight: 800; font-size: 16px">{{ levelLabel }}</button>
<div style="display: flex; align-items: center; gap: 6px; height: 44px; padding: 0 12px; border-radius: 22px; background: #FFFFFF; border: 2px solid #DDE1EC">…icon 18…<div style="font-weight: 800; font-size: 15px">{{ left }}</div></div>
<!-- on tab screens the same chip is height: 36px; border-radius: 18px; text 14px; icon 16 -->
```

### 3.3 Buttons

| Kind | Inline style (exact) |
|---|---|
| Primary, full width | `height: 54px; border-radius: 16px; background: #2F4FD0; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; color: #FFFFFF; font-weight: 800; font-size: 17px; display: flex; align-items: center; justify-content: center` |
| Primary in a card | `height: 48px; border-radius: 14px; background: #2F4FD0; border: 2px solid #1B2440; box-shadow: 0 3px 0 #1B2440; color: #FFFFFF; font-weight: 800; font-size: 16px` (path card: 44 px, 15 px; notebook: 50 px, 16 px) |
| Quiet (secondary) | `height: 50px; border-radius: 14px; background: #FFFFFF; border: 2px solid #1B2440; box-shadow: 0 3px 0 #1B2440; color: #1B2440; font-weight: 800; font-size: 15px; white-space: nowrap` (Install: 52 px, radius 16, shadow 4, 14 px) |
| Exam-style (dark) | `height: 54px; border-radius: 16px; background: #1B2440; border: 2px solid #1B2440; box-shadow: 0 4px 0 #2F4FD0; color: #FFFFFF; font-weight: 800; font-size: 17px` (in a card: 48/14, `0 3px 0 #2F4FD0`) |
| Danger, outline | `height: 50px; border-radius: 16px; background: #FFFFFF; border: 2px solid #C7361E; color: #C7361E; font-weight: 800; font-size: 15px` |
| Danger / ritual, solid | `height: 54px; border-radius: 16px; background: #C7361E; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; color: #FFFFFF; font-weight: 800; font-size: 17px` ("Start over" confirm; "片目を入れる　Paint the first eye") |
| Text button | `height: 48px; border: 0; background: transparent; font-size: 15px; font-weight: 800; color: #1B2440` |
| Disabled | `border: 2px solid #C9D0E3; background: #DDE1EC; color: #5A6382; box-shadow: none` (+ `disabled` attribute) |
| After an answer | primary shape with `background: #0B7A6B` (right) or `#C7361E` (wrong) |
| Small outline | `height: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid #1B2440; background: #FFFFFF; font-size: 13px; font-weight: 800; white-space: nowrap` (もう一度 Replay, ゆっくり 0.8×) |
| Play, small | `width: 44px; height: 44px; border-radius: 50%; border: 2px solid #1B2440; background: #E8ECFB` (playing `#F2B43A`)`; transition: background 150ms; padding: 0` + speaker icon 20 px |
| Play, large | `width: 60px; height: 60px; border-radius: 50%; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; padding: 0` bg `#2F4FD0` (playing `#F2B43A`), triangle `M8 5l11 7-11 7z` fill `#FFFFFF` (playing `#1B2440`) |

### 3.4 Answer options (Drill, the house pattern)

```html
<button onClick="{{ o.pick }}" aria-pressed="{{ o.on }}" style="min-height: 50px; padding: 6px 12px; border-radius: 14px; display: flex; align-items: center; gap: 8px; font-size: 16px; text-align: left; border: {{ o.border }}; background: {{ o.bg }}; box-shadow: {{ o.shadow }}; color: {{ o.color }}; font-weight: {{ o.weight }}"><span style="font-size: 12px; color: {{ o.numColor }}">{{ o.n }}</span><span style="flex-grow: 1">{{ o.label }}</span>…○ or ✕ icon 18…</button>
```

States (`renderVals`): idle `{ border: '2px solid #1B2440', bg: '#FFFFFF', shadow: '0 3px 0 #1B2440', color: '#1B2440',
weight: 800, numColor: '#5A6382' }` · picked `{ border: '2.5px solid #2F4FD0', bg: '#E8ECFB', shadow: 'none', …,
numColor: '#2F4FD0' }` · checked right `{ border: '2.5px solid #0B7A6B', bg: '#E0F3EF', shadow: 'none' }` · checked
wrong pick `{ border: '2.5px solid #C7361E', bg: '#FDEBE6', shadow: 'none' }` · the others `{ border: '2px solid
#DDE1EC', bg: '#FFFFFF', shadow: 'none', color: '#5A6382', weight: 700 }`. Two columns
(`repeat(2, minmax(0, 1fr))`, gap `10px 8px`) unless an option is longer than 7 characters (then `1fr`).

### 3.5 Selectable chips, radio rows, field buttons

- `look(on)` (Goal): on `{ border: '2px solid #1B2440', bg: '#2F4FD0', shadow: '0 3px 0 #1B2440', color: '#FFFFFF' }`,
  off `{ border: '2px solid #DDE1EC', bg: '#FFFFFF', shadow: 'none', color: '#1B2440' }`, not written
  `{ border: '2px dashed #DDE1EC', bg: '#F4F5F9', shadow: 'none', color: '#9AA1B5' }` + `<span style="font-size: 9px;
  font-weight: 700">準備中</span>`. Level chip: `height: 48px; border-radius: 14px; font-weight: 800; font-size: 16px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1` in a
  `repeat(4, minmax(0, 1fr))` grid, gap 8. Pace tile: `height: 76px; border-radius: 16px; … gap: 2px`, big 20/800,
  small 12 (700 white when on, 500 `#5A6382` off). Menu level chip: 44 px, radius 12, on `bg #2F4FD0`.
- Radio row (date sheet): `height: 68px; padding: 0 14px; border-radius: 16px; border: 2.5px solid #2F4FD0; background:
  #E8ECFB; display: flex; align-items: center; gap: 12px; text-align: left` with dot `width: 22px; height: 22px;
  box-sizing: border-box; border-radius: 50%; border: 2px solid #1B2440; background: #FFFFFF` holding a 10 px
  `#2F4FD0` disc; unavailable `border: 2px dashed #C9D0E3; background: #F4F5F9; color: #5A6382`, ring `#C9D0E3`.
- Field button (exam date): `height: 68px; padding: 0 16px; border-radius: 16px; border: 2px solid #1B2440;
  background: #FFFFFF; display: flex; align-items: center; gap: 12px; text-align: left`, calendar icon stroke
  `#2F4FD0` 2.4, value 17/800, English 12/500 muted, badge `padding: 6px 10px; border-radius: 10px; background: #FDEBE6;
  color: #C7361E; font-size: 14px; font-weight: 800`.

### 3.6 Cards

| Card | Style |
|---|---|
| Hero (one per screen) | `padding: 14px 16px 16px; border-radius: 20px; background: #FFFFFF; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; display: flex; flex-direction: column; gap: 12px` |
| Outlined content | `padding: 12px 14px; border-radius: 18px; background: #FFFFFF; border: 2px solid #1B2440; … gap: 8px` |
| Quiet content | `padding: 12px 14px; border-radius: 18px; background: #FFFFFF; border: 2px solid #DDE1EC; … gap: 10px` |
| Note ("注意　Watch out") | `padding: 12px 14px; border-radius: 18px; background: #FFF4D6; … gap: 6px` |
| Info (plan) | `padding: 12px 14px; border-radius: 16px; background: #E8ECFB; … gap: 8px` |
| Alert / nudge | `padding: 12px 14px; border-radius: 16px; background: #FDEBE6` (+ dashed 済 40 px) |
| Lesson card (Today) | `position: relative; padding: 14px; border-radius: 20px; background: #FFFFFF; gap: 12px`; the next-up card `border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440`, the others `2px solid #DDE1EC; none` |
| Icon tile in a card | `width: 46px; height: 46px; border-radius: 14px; font-size: 22px; font-weight: 800` on `#E8ECFB`/`#2F4FD0` (文), `#FDEBE6`/`#C7361E` (字), `#FFF4D6`/`#1B2440` (読/聴) |
| Step pill (in a lesson card) | `height: 32px; box-sizing: border-box; border-radius: 10px; font-size: 12px; flex: 1 1 auto; padding: 0 6px; white-space: nowrap`; done `2px solid #E0F3EF / #E0F3EF / #0B7A6B / 800` + ring 13 px, now `#2F4FD0` filled white 800, todo `2px solid #DDE1EC / transparent / #5A6382 / 700` |
| List row (notebook) | `padding: 10px 14px; border-radius: 16px; background: #FFFFFF; border: 2px solid #DDE1EC; gap: 5px`; pips 10 px circles, done `2px solid #0B7A6B` filled, to do `2px solid #C9D0E3` |

### 3.7 Sheets

```html
<div style="position: absolute; left: 0; top: 0; width: 390px; height: 844px; display: flex; flex-direction: column; background: rgba(27, 36, 64, 0.5); animation: yk-fade 160ms ease-out">
<button aria-label="Close" onClick="{{ closeSheet }}" style="flex-grow: 1; border: 0; padding: 0; background: transparent"></button>
<div role="dialog" aria-modal="true" aria-label="Choose your exam date" style="padding: 10px 20px 34px; border-radius: 26px 26px 0 0; border-top: 2px solid #1B2440; background: #FFFFFF; display: flex; flex-direction: column; gap: 12px; animation: yk-up 240ms ease-out">
<div aria-hidden="true" style="align-self: center; width: 40px; height: 5px; border-radius: 3px; background: #C9D0E3"></div>
<h2 style="margin: 0; font-size: 18px; font-weight: 800">試験日をえらぶ <span style="font-size: 13px; font-weight: 700; color: #5A6382">Choose your exam date</span></h2>
…
```

The menu sheet: `padding: 18px 20px 34px`, heading row `メニュー` 18/800 + "Menu" 13/700 muted + a `PROTOTYPE` tag.
**Feedback sheet** (inside the root, after the content): `flex-shrink: 0; max-height: 470px; overflow-y: auto; padding:
16px 16px 34px; border-radius: 26px 26px 0 0; border-top: 2px solid #1B2440; display: flex; flex-direction: column;
gap: 10px; animation: yk-up 240ms ease-out; background: #E0F3EF` (right) or `#FDEBE6` (wrong); verdict row: ○ or ✕ icon
30 px + `<div style="flex-grow: 1; font-size: 20px; font-weight: 800">せいかい！ <span style="font-size: 14px;
font-weight: 700">Correct</span></div>`; reasons in `padding: 12px 14px; border-radius: 16px; background: #FFFFFF;
gap: 8px`; then the 54 px button in `#0B7A6B` / `#C7361E`.

### 3.8 Switch (from Typing's CSS; no canvas screen has one)

CSS original: track `width: 52px; height: 30px; border-radius: 15px; border: 2px solid var(--outline); background:
var(--line)`, knob `top: 2px; left: 2px; width: 22px; height: 22px; border-radius: 50%; background: var(--card);
border: 2px solid var(--outline); transition: transform 150ms`; checked: track `var(--accent)`, knob
`translateX(22px)`; the row `min-height: 66px; padding: 10px 14px; border-radius: 16px; background: var(--card);
border: 2px solid var(--outline); font-size: 15px; font-weight: 800` with a 12/700 muted `small` line. Inline version
for an artboard:

```html
<button role="switch" aria-checked="{{ on }}" onClick="{{ toggle }}" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 66px; padding: 10px 14px; border-radius: 16px; background: #FFFFFF; border: 2px solid #1B2440; font-size: 15px; font-weight: 800; text-align: left">
<span>Label <small style="display: block; font-size: 12px; font-weight: 700; color: #5A6382">Explanation</small></span>
<span aria-hidden="true" style="position: relative; flex-shrink: 0; width: 52px; height: 30px; box-sizing: border-box; border-radius: 15px; border: 2px solid #1B2440; transition: background 150ms; background: {{ trackBg }}"><span style="position: absolute; top: 2px; left: 2px; width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #1B2440; transition: transform 150ms; transform: {{ knobX }}"></span></span>
</button>
<!-- trackBg: on ? '#2F4FD0' : '#DDE1EC'; knobX: on ? 'translateX(22px)' : 'none' -->
```

### 3.9 Tab bar (exact; current tab `#2F4FD0`, weight 800, icon stroke 2.4; others `#5A6382`, 700, 2.2)

```html
<nav aria-label="Main" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 6px 8px 30px; background: #FFFFFF; border-top: 2px solid #DDE1EC">
<a href="Main.dc.html" onClick="{{ toMain }}" aria-current="page" style="height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: #2F4FD0; font-size: 11px; font-weight: 800"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2.5"/><path d="M8.5 19h9a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15.5"/><circle cx="18" cy="5" r="2.5"/></svg>Path</a>
<a href="Notebook.dc.html" onClick="{{ toNotebook }}" style="height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: #5A6382; font-size: 11px; font-weight: 700"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5"/></svg>Notebook</a>
<a href="Mock.dc.html" onClick="{{ toMock }}" aria-disabled="{{ mockOff }}" style="… color: {{ mockInk }} …"><svg …stroke-width="2.2"…><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>{{ mockLabel }}</a>
<a href="Readiness.dc.html" onClick="{{ toReadiness }}" aria-disabled="{{ readyOff }}" style="… color: {{ readyInk }} …"><svg …stroke-width="2.2"…><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>{{ readyLabel }}</a>
</nav>
```

Inside a root with `overflow: hidden`, the nav is the last child; on Notebook it also has `flex-shrink: 0`. A tab not open
yet: label colour `#B9BFD0`, `aria-disabled`, handler `e.preventDefault()`. Its 30 px bottom padding is the one thing
allowed into the home-indicator zone.

### 3.10 Progress and scores

- Step dots: `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px` of `height: 10px;
  border-radius: 5px; background: #2F4FD0 | #DDE1EC` (Goal: 8 px, radius 4), with `role="img" aria-label="Step 2 of 3"`.
- Score bar with pass line: `<div style="position: relative; height: 12px"><div style="height: 12px; border-radius: 6px;
  background: #D9E0F8; overflow: hidden"><div style="width: 73.3%; height: 12px; border-radius: 0 4px 4px 0;
  background: #2F4FD0"></div></div><div style="position: absolute; left: 31.7%; top: -3px; width: 2px; height: 18px;
  background: #1B2440"></div></div>`; under the line: track `#F8D6CC`, fill `#C7361E`; the whole in `role="img"` with
  a sentence ("Reading: 38 of 60, above the pass mark of 19").
- Listening waveform: 22 bars `width: 4px; border-radius: 2px`, heights `[10, 20, 30, 16, 34, 24, 12, 28, 38, 22, 14, 26,
  32, 18, 10, 24, 30, 20, 12, 26, 16, 8]` px, played `#2F4FD0`, to come `#C9D0E3`.
- Clock chip: `role="timer" aria-label="{{ clockLabel }}" style="display: flex; align-items: center; gap: 6px; height:
  36px; padding: 0 12px; border-radius: 18px; font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums;
  flex-shrink: 0; background: #FFFFFF; color: #1B2440"` (low: `#E2452B` / `#FFFFFF`) + clock icon 16 stroke 2.6.

### 3.11 Week path and stamp card (Main)

- Path: `<svg width="390" height="478" viewBox="0 0 390 478" fill="none" aria-hidden="true" style="position: absolute;
  left: 0; top: 0"><polyline points="64,34 104,98 132,162 104,250 64,326 110,386 180,438" stroke="#C9D0E3"
  stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 13"/><polyline points="{{ redPath
  }}" stroke="#E2452B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>` over the graph paper.
- Nodes (absolute): done `width: 52px; height: 52px; box-sizing: border-box; border-radius: 50%; border: 3px solid
  #E2452B; background: #FFFFFF; color: #C7361E; font-weight: 800; font-size: 20px; transform: rotate(tilt)` with 済;
  today `68×68; border: 3px solid #1B2440; background: #2F4FD0; box-shadow: 0 5px 0 #1B2440; color: #FFFFFF;
  font-size: 26px` (the day number); locked `52×52; border: 3px solid #C9D0E3; background: #E6E9F3` + lock icon 20 px
  stroke `#5A6382`; test `60×60; border-radius: 18px; border: 3px solid #1B2440; box-shadow: 0 4px 0 #1B2440; font-size:
  22px`, bg `#F2B43A` (ready, mark 試) / `#FFFFFF` (done, 済) / `#E6E9F3` (not written). Tilts per day: -8, 7, -5, 6,
  -6, 5, 0 deg. Labels beside: day 11/700 muted, title 14 (800 ink when done or today, else 700 muted).
- Today's card beside the node: `position: absolute; left: 150px; width: 224px; box-sizing: border-box; padding: 12px
  14px 14px; border-radius: 18px; background: #FFFFFF; border: 2px solid #1B2440; gap: 4px`, kicker 11/800 `#2F4FD0`
  nowrap ("今日 TODAY · 3 lessons"), title 16/800, button 44 px.
- Stamp card row in the hero card: `display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px` with
  `role="img"` and a sentence label; slots 40 px tall: stamped `border-radius: 50%; border: 2.5px solid #E2452B; color:
  #C7361E; 800 16px; rotate(tilt)` 済; now `2.5px dashed #2F4FD0; background: #E8ECFB; color: #2F4FD0`; later
  `2.5px solid #DDE1EC; color: #5A6382; 700 15px`; test `border-radius: 12px; 2.5px solid #1B2440; bg #F2B43A|#FFFFFF`.

### 3.12 Stamps

- **済 (done)** sizes in use: header chip 20 px (`2px solid #C7361E`, 10 px, `rotate(-10deg)`), stamp-card slot 40 px,
  lesson corner 34 px (`2.5px solid #E2452B`, 14 px, `position: absolute; top: 12px; right: 12px`, rotate -9/7/-5),
  test row 30 px (`2.5px solid #C7361E`, 13 px, -8), mock 44 px (3 px, 19 px, -9), path node 52 px (3 px, 20 px), day-done
  50 px (3 px, 21 px, `animation: yk-stamp 500ms ease-out both`), caught-up 56 px (3 px, 24 px, animated), the "not
  yet" stamp 40 px `2.5px dashed #C7361E`. Recipe: `box-sizing: border-box; border-radius: 50%; border: Npx solid
  #E2452B; color: #C7361E; font-weight: 800; display: flex; align-items: center; justify-content: center;
  transform: rotate(-9deg)`; `role="img" aria-label="Lesson done"` or `aria-hidden` when the text says it.
- **試 (week test)**: the gold rounded-square node and slot above; README: "The week test is next. Tap 試."
- **The teacher's hanko** (WeekTest result; Typing result): `width: 124px; height: 124px; box-sizing: border-box;
  border-radius: 50%; border: 4px solid #E2452B; padding: 5px; transform: rotate(-9deg); animation: yk-stamp 550ms
  ease-out 150ms both; display: flex` holding `flex-grow: 1; border-radius: 50%; border: 2px solid #E2452B; color:
  #C7361E; font-weight: 800; line-height: 1.35; display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center` with lines `['たいへん', 'よく', 'できました']` at 15 px (≥ 80 %),
  `['よく', 'できました']` 17 px (≥ 60 %), `['がんばり', 'ましょう']` 17 px; labels "Stamp: excellent / well done / keep at it".
- **はなまる** (Typing/Speaking: a card with no miss and no hint; a stage's three rings): generator, verbatim:

```js
function hanamaruPath(R, n) {          // n scallops round a ring of radius R
  const f = (v) => String(Math.round(v * 100) / 100);
  const step = (2 * Math.PI) / n;
  const a = R * Math.sin(step / 2);
  let d = '';
  for (let i = 0; i < n; i++) {
    const t0 = i * step - Math.PI / 2;
    const t1 = t0 + step;
    if (!i) d += 'M' + f(R * Math.cos(t0)) + ' ' + f(R * Math.sin(t0));
    d += 'A' + f(a) + ' ' + f(a) + ' 0 0 1 ' + f(R * Math.cos(t1)) + ' ' + f(R * Math.sin(t1));
  }
  return d + 'Z';
}
```

  Small icon (`HANA_ICON`): `<svg width="18" height="18" viewBox="-13 -13 26 26" aria-hidden="true"><path
  d="M0 -9A3.08 3.08 0 0 1 5.79 -6.89A3.08 3.08 0 0 1 8.86 -1.56A3.08 3.08 0 0 1 7.79 4.5A3.08 3.08 0 0 1 3.08
  8.46A3.08 3.08 0 0 1 -3.08 8.46A3.08 3.08 0 0 1 -7.79 4.5A3.08 3.08 0 0 1 -8.86 -1.56A3.08 3.08 0 0 1 -5.79
  -6.89A3.08 3.08 0 0 1 0 -9Z" fill="none" stroke="#C7361E" stroke-width="2" stroke-linejoin="round"/><circle r="3.2"
  fill="none" stroke="#C7361E" stroke-width="2"/></svg>` (= `hanamaruPath(9, 9)`). Route node: `hanamaruPath(21, 9)`
  stroked 1.8 in `--stamp`, rotated -9°. Round the result hanko: `<svg class="hana-ring" viewBox="-84 -84 168 168"
  style="position: absolute; inset: -22.5%"><path pathLength="1" d="hanamaruPath(66, 12)"/></svg>`, stroke `--stamp`
  2.4, drawn by `yk-draw`.
- **起 (comeback)** in Typing/Speaking (canvas drawing): a white disc of radius `15k`, ring 2.5 in `--daruma`, the
  character in `--stamp` at `800 round(radius*1.05)px`, rotated -9°, inside an extra gold ring
  (`radius 15k + 3.5`, width 2); a weak spot typed clean adds a gold star with an ink stroke at (19, 12).
- Other marks: `新` 58 px circle `3px solid #E2452B`, `#C7361E` 26 px, `rotate(-10deg)`; `おすすめ` tag `padding: 4px
  12px; border: 2.5px solid #E2452B; border-radius: 8px; color: #C7361E; font-size: 15px; font-weight: 800; transform:
  rotate(-4deg)` (Mascot canvas).

### 3.13 Tags, badges, kickers

- Kicker: `font-size: 12px; font-weight: 800; color: #2F4FD0` (red `#C7361E` for the week test and hints; 11 px in the
  path card). Section head in a card: `font-size: 12px; font-weight: 800; color: #5A6382`. Form label: `font-size:
  13px; font-weight: 800`. Lede: `font-size: 13px; font-weight: 500; color: #5A6382; line-height: 1.5`. Small note:
  `font-size: 12px; font-weight: 500; color: #5A6382; line-height: 1.45`.
- Tag: `padding: 4px 10px; border-radius: 10px; background: #E8ECFB; color: #2F4FD0; font-size: 12px; font-weight: 800;
  white-space: nowrap`; `PROTOTYPE`: `padding: 2px 10px; …; font-size: 11px`. Area tags (notebook):
  `padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 800` with vocab `#FDEBE6/#C7361E`, grammar
  `#E8ECFB/#2F4FD0`, listening `#E0F3EF/#0B7A6B`, reading `#FFF4D6/#1B2440`.
- Info chip: `height: 28px; padding: 0 10px; border-radius: 14px; background: #FFF4D6; border: 2px solid #1B2440;
  font-size: 12px; font-weight: 800`; locked chip: same shape, `background: #F4F5F9; border: 2px solid #C9D0E3; color:
  #5A6382` + lock 13 px stroke 2.8, `role="img" aria-label="Locked. Opens in 10 days."`; run chip: `padding: 4px 10px;
  border-radius: 10px; background: #F2B43A; border: 2px solid #1B2440; font-size: 12px; font-weight: 800`; weak spot:
  `padding: 4px 10px; border-radius: 10px; background: #FFF4D6` + star 13; "your pick": `padding: 1px 6px;
  border-radius: 6px; background: #FDEBE6; font-size: 11px; font-weight: 800`; 卒業 badge: `padding: 2px 8px;
  border-radius: 8px; background: #0B7A6B; color: #FFFFFF; font-size: 11px; font-weight: 800`.

### 3.14 Text marks, speech bubble, ink band, scene board, tiles

- `C.rich` marks: `{pattern}` highlight `background: #FFE9B0; border-radius: 4px; padding: 0 3px; white-space: nowrap`;
  `_asked_` underline `border-bottom: 2px solid #1B2440`; `^clue^` after the answer `border-bottom: 3px solid #F2B43A`.
- Yaoki's hint: mascot 48 px + `flex-grow: 1; padding: 10px 14px; border-radius: 16px 16px 16px 4px; background:
  #FFFFFF; border: 2px solid #1B2440; gap: 2px`, kicker 11/800 `#C7361E` ("ヒント　HINT · drill only"), text 13/700 lh 1.45.
- Ink band (MockRun): `flex-shrink: 0; padding: 50px 16px 10px; background: #1B2440; color: #FFFFFF; display: flex;
  align-items: center; gap: 8px`, title 16/800 nowrap, sub 11/500 `#C9D0E3`, white icon strokes, sheet button
  `height: 44px; padding: 0 10px; border-radius: 12px; border: 2px solid #5A6382; background: none; color: #FFFFFF;
  font-size: 13px; font-weight: 800`.
- Scene board: `padding: 12px; border-radius: 20px; background: #1B2440; display: grid; grid-template-columns:
  repeat(2, minmax(0, 1fr)); gap: 12px 10px`, chips `height: 46px; padding: 0 10px; border-radius: 10px; font-size:
  17px; font-weight: 800; white-space: nowrap`, unfound `2px dashed #6E7BA8`, found solid, selected `background: #2A3560;
  color: #F2B43A; outline: 3px solid #F2B43A; box-shadow: 0 0 0 5px #1B2440`.
- Tiles (Star): bank tile `height: 54px; border-radius: 14px; border: 2px solid #1B2440; background: #FFFFFF;
  box-shadow: 0 4px 0 #1B2440; font-size: 18px; font-weight: 600`; used slot `2px dashed #C9D0E3`; placed tile `height:
  50px; min-width: 48px; padding: 0 10px; border-radius: 12px; border: 2px solid #1B2440; box-shadow: 0 3px 0 #1B2440;
  background: #FFE9B0` (on the star) or `#E8ECFB`; empty star slot `width: 76px; height: 50px; border: 2.5px dashed
  #1B2440; background: #FFF4D6` + star 24 (fill `#F2B43A`, stroke ink 1.8); empty slot `2.5px dashed #C9D0E3;
  background: #F4F5F9`.
- Install step: number disc `width: 30px; height: 30px; border-radius: 50%; background: #1B2440; color: #FFFFFF;
  font-size: 15px; font-weight: 800`, title 15/800, note 12/500 muted lh 1.4, icon 30 px stroke `#2F4FD0` 2.2, rows
  separated by `border-bottom: 2px solid #E9ECF4` inside a hero card (`padding: 4px 16px`).

### 3.15 Inline icon set (viewBox 0 0 24 24, `fill="none"`, `stroke-linecap="round"`, mostly `stroke-linejoin="round"`)

| Icon | Paths | Stroke | Used in |
|---|---|---|---|
| close ✕ | `M6 6l12 12M18 6L6 18` | 2.6 (bars), 3.5 (marks), 4 (small marks) | lesson bars, wrong marks |
| wrong ✕ large | `M5 5l14 14M19 5L5 19` | 3.5 | feedback verdict 30 px |
| right ○ | `<circle cx="12" cy="12" r="8.5"/>` (options, 16–20 px) / `r="9"` (verdict 30 px, pills 13 px) | 3.5–4, `#0B7A6B` | correct marks |
| back | `M15 5l-7 7 7 7` | 2.6 | back links |
| path (tab) | `<circle cx="6" cy="19" r="2.5"/><path d="M8.5 19h9a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15.5"/><circle cx="18" cy="5" r="2.5"/>` | 2.4 / 2.2 | tab bar |
| notebook | `<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5"/>` | 2.2–2.4 | tab bar, "saved to notebook" lines |
| clock (mock) | `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>` | 2.2–2.6 | tab bar, timers |
| target (readiness) | `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>` | 2.2–2.4 | tab bar |
| calendar | `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>` | 2.4, `#2F4FD0` | days-left chips, date field |
| lock | `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>` (chip: `M8 11V8a4 4 0 0 1 8 0v3`) | 2.4 / 2.8 | locked node, locked chip |
| speaker | `<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>` | 2.2 | play example |
| speaker loud | `<path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>` | 2.2 | mock sound check |
| play | `M8 5l11 7-11 7z` (Listening) · `M7 4.5v15l13-7.5z` (menu) · `M7 4.5v15l12-7.5z` (writing) | fill | play buttons |
| star | `M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z` | fill `#F2B43A`, stroke ink 1.8–2 | star slot, weak spot |
| arrow right | `M5 12h14M13 6l6 6-6 6` | 2.6 | notebook "wrong → right" |
| arrow up / minus / dot | `M12 19V5M6 11l6-6 6 6` (3.2) · `M5 12h14` (4) · `<circle cx="12" cy="12" r="5"/>` fill `#2F4FD0` | | Compare |
| answer sheet | `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>` | 2.2 | ink band |
| headphones | `<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="14" width="4.5" height="7" rx="1.5"/><rect x="17" y="14" width="4.5" height="7" rx="1.5"/>` | 2.2 | mock listening |
| flag | `M5 21V4M5 4h12l-2.5 4 2.5 4H5` | 2.4, fill `#F2B43A` when on | flag a question |
| pencil | `<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/>` | 2.2 | write step |
| bulb (hint) | `M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z` | 2.4 | writing pad |
| restart | `<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>` | 2.4 | writing pad |
| share (Install) | `<path d="M12 15V3M8 7l4-4 4 4"/><path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1"/>` | 2.2, `#2F4FD0` | Install |
| add (Install) | `<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>` | 2.2 | Install |
| settings (Typing) | `<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/>` | 2.4 | Typing's 設定 pill |

---

## 4. Mascot, icon and logo

### 4.1 What Yaoki is

A daruma (the Japanese roly-poly wish doll) named after 七転び八起き, "fall down seven times, get up eight": the toy
rights itself. The proverb and the mascot carry the suite's one idea, resilience plus a goal ritual, into the name,
the rewards (起 for a comeback), the copy and the games (he falls, gets up again, the card comes back later).

### 4.2 His moments (Mascot.dc.html, "Yaoki's moments")

| ja | en | Where | Image alt |
|---|---|---|---|
| 白い目 | Blank | Before a goal is set | Yaoki with both eyes blank |
| 片目 | One eye painted | Goal set: the week path, every day | Yaoki with one eye painted |
| 勉強中 | Studying | Lessons, the week test, mocks | Yaoki in a 合格 headband, brows set |
| 転んだ | A miss | A wrong answer, saved to the notebook | Yaoki tipped over, a drop of sweat |
| 起きた | Back up | 卒業: a notebook item cleared | Yaoki rocking back upright, laughing into his beard |
| 両目 | Both eyes painted | Readiness: a pass | Yaoki with both eyes painted, sparkles |

The screens draw only the one-eye daruma inline: Main 60, Goal 104 (the pupil fades in), Readiness 60, the Drill and
Star hint 48, MockRun 64/72/64, Install 76 plus a 20 px head on a tile-coloured square in step 3. Typing and Speaking animate him from the same drawing: breathing, blinking, a nod
per right key, worried brows when a card is close, a fall with dizzy stars, a hop and cheers at 5/10/20/40 clean in a
row (いいね！ すごい！ さすが！ かんぺき！), tricks (jump, spin, duck, smash) with sound words.

### 4.3 The rules (Rules.dc.html, "Colours and the eye rule")

- **"His own left eye first. That is the eye on your right. It is painted when the goal is set; the other one when you
  pass."** In the SVG the pupil is `<circle cx="61" cy="42" r="4" fill="#1B2440"/>` (viewer's right).
- **Colours:** Ink `#1B2440`, Daruma red `#E2452B`, Gold `#F2B43A`, Face `#FFF6EA`, Indigo · N1 `#2F4FD0` (swatches
  112×64, radius 12, `2px solid #1B2440`).
- **Sizes:** "Whole daruma from 40 px up · the close-up for the app icon · the favicon at 16 and 32 px".
- Goal copy that states the ritual: "Set a goal and Yaoki gets one eye. He gets the other when you pass." Then
  "片目が入りました。 One eye in. One to go." Labels: "Yaoki, a daruma with both eyes still blank" → "…with one eye
  painted".

### 4.4 The inline daruma (exact; viewBox 0 0 100 100)

```html
<svg viewBox="0 0 100 100" width="60" height="60" role="img" aria-label="Yaoki, a daruma with one eye painted"><path d="M50 6c26 0 40 20 40 46 0 24-16 42-40 42S10 76 10 52C10 26 24 6 50 6z" fill="#E2452B"/><ellipse cx="50" cy="42" rx="27" ry="23" fill="#FFF6EA"/><circle cx="39" cy="42" r="8" fill="#fff" stroke="#1B2440" stroke-width="2.5"/><circle cx="61" cy="42" r="8" fill="#fff" stroke="#1B2440" stroke-width="2.5"/><circle cx="61" cy="42" r="4" fill="#1B2440"/><path d="M28 30c6-5 14-5 19 0M53 30c5-5 13-5 19 0" stroke="#1B2440" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M44 55c4 3 8 3 12 0" stroke="#1B2440" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 74h24M42 82h16" stroke="#F2B43A" stroke-width="3.5" stroke-linecap="round"/></svg>
```

Typing's extra faces (same units): blink `M31 42c4 2 12 2 16 0M53 42c4 2 12 2 16 0`; dizzy `M33 37l10 5-10 5M67 37l-10
5 10 5`; grit `M43 56h14`; happy mouth `M41 54c5 5 13 5 18 0`; "o" mouth ellipse (50, 57, 3.2×4.2); sweat
`M84 18c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11z` (`#9FD3F5`, ink 2); brows worried `M28 32c6-2 13-5 19-9M53 23c6 4
13 7 19 9`, up `M28 27c6-6 14-6 19-1M53 26c5-5 13-5 19 1`, firm `M28 25c6 2 13 4 19 7M53 32c6-3 13-5 19-7`; shine
`M21 30c-5 8-6 19-4 29 1 3 5 2 5-1-1-9 0-18 4-24 2-3-3-7-5-4zM34 14c-3 1-6 3-8 5-2 2 1 5 3 3 2-2 4-3 6-4 3-1 2-5-1-4z`
(white at 0.5); blush ellipses at (31|69, 55) 5×3 `#F59A8A` 0.6; lacquer radial gradient `#FF7A5C → #E2452B →
#A82A17`; outline 4 in ink; the pupil moves `2.4×` toward where he looks. Under reduced motion only the face changes.

### 4.5 Now and new (Main.dc.html on the Mascot canvas)

"Now": the icon "a red egg-shaped daruma on gold" and the current mascot (the drawing above). "New" (stamped 新): the
icon "Yaoki's bearded face close up, one eye painted, 起 in gold"; the mascot "Yaoki as Bodhidharma, with crane brows, a
big nose, a full beard and moustache, one eye painted and 起 in gold on his belly". The canvas index also lists Baby
("1930s cartoon style") and Anime ("1960s–70s manga style") variants; their files were not provided.

### 4.6 The app icon

- **Built today** (`build.mjs`, verified in `docs/icons/`): the whole daruma with an ink shadow copy at
  `translate(3.5 4.5)`, body `#E2452B` stroked `#1B2440` 2.6, face stroked 2, eyes r 8 stroke 2.5, pupil r **4.2**, on
  a square tile `L.tile` (gold `#F2B43A` main, indigo `#2F4FD0` N1); drawn at 1024 and resized by sharp:
  `apple-touch-icon.png` 180 at share 0.7, `icon-192.png` 0.7, `icon-512.png` 0.7, `icon-512-maskable.png` 0.56,
  `favicon-32.png` 0.82; offset `(size − d)/2 − 1.5k` so the shadow is part of the centred mass.
- **Icon board** (Icon.dc.html): A "Close-up" marked おすすめ (recommended), red hood (main) and indigo hood (N1), shown
  at 256 (radius 57), 128 (29), 120 (27), 87 (19), 60 (13), 40 (9), 29 (6.5): radius ≈ 22.3 % of the side; favicons
  16 and 32 shown in a browser-tab mock (`height: 34px; padding: 0 16px 0 12px; border: 2px solid #1B2440;
  border-bottom: none; border-radius: 10px 10px 0 0; background: #F4F5F9`, label "Yaoki"). B "Whole daruma": on gold,
  N1 on indigo, at 176/112/60/40/29.
- **Home Screen check** (HomeScreen.dc.html, "actual size"): a 390×480 phone (`border: 3px solid #1B2440; border-radius:
  40px; padding: 34px 24px 0`), a 4-column grid of 100 px rows, `column-gap: 8px`, 60 px icons radius 13.4, labels
  11.5/500 white; 15 fictional apps (Kalendo, Snap, Postbox, Jotter, Wayfind, Sunny, Tunes, Tick, Shelf, Album, Purse,
  Steps, Listen, Daily, Folder) as white 2 px line icons on coloured tiles, Yaoki in sixth place; a wallpaper tweak with
  swatches `#3E4C6B`, `#7E8FAE`, `#E8E2D6`, `#1F2A2E`; versions A and B side by side.

### 4.7 Logo (Logo.dc.html)

Horizontal lock-up 540×190 on white: "the daruma, the name Yaoki with a vermilion dot on the i, and 七転び八起き with
八起 in vermilion"; stacked 231×300; on the dark ground `#1B2440` at 420×148; smallest 160 px wide (on a white plate
`padding: 14px 18px; border-radius: 14px`, caption "Smallest: 160 px wide" 13/700 `#C9D0E3`). The headline pattern
on the Mascot board: `ヤオキ` 30/800 + `Yaoki` 18/700 muted; `七転び<span style="color: #C7361E">八起</span>き` 18/700 +
"fall seven times, get up eight" 15/500 muted.

### 4.8 Presentation-board style (the Mascot canvas)

Cards `background: #FFFFFF; border: 2.5px solid #1B2440; border-radius: 18px` (20 for the large ones) with
`box-shadow: 5px 5px 0 #1B2440` (6px for the large ones); captions 20/800, 14/700, 12.5/500 muted; step badges "A"
(36 px, radius 10, ink fill, white letter) and "B" (white, `2.5px solid #1B2440`); a dashed divider `2px dashed #C9D0E3`.

---

## 5. Copy voice and accessibility

### 5.1 How the README is written

Plain declaratives that say what a thing does for the learner, then the detail; numbers stated exactly ("1,493 clips,
about 52 MB"); no marketing; no contractions (none in the README or the screens' copy; "does not", "cannot" instead);
one em dash in the whole README; colons and semicolons carry explanations; British spelling ("colour", "centred",
"licence", "practise"); names in code style; principles in one line ("The game rewards accuracy, getting up again and
showing up, never speed"); limits said plainly ("How a real phone hears is only found out on one"). Code comments read
the same way, from the learner's side ("a phone held sideways gets a note instead of a tiny upright app").

### 5.2 In-app copy patterns (all from the screens)

- **Buttons and section heads: target language, U+3000 ideographic space, then the learner's language in sentence
  case**: `はじめる　Start`, `こたえる　Check`, `つぎへ　Next`, `おわる　Finish the drill`, `もどる　Back`,
  `とじる　Close`, `決定　Confirm`, `キャンセル　Cancel`, `最初からやり直す　Start over`, `復習する　Review now`,
  `間違いを見る　Review mistakes`, `はじめる　Start with the teach page`, `つづける　Continue the drill`,
  `本番へ　Start exam-style`, `似ている文法へ　Compare`, `もう一度　Again`, `結果を見る　Result`,
  `ブラウザで続ける　Continue in the browser`, `片目を入れる　Paint the first eye`; heads `例文　Examples`,
  `注意　Watch out`, `接続　How it connects`, `解説　Why each option`, `分野別　By area`, `正解数　Correct answers`,
  `レベル　Level`, `試験日　Exam date`, `1日の勉強時間　Daily study time`, `音量チェック　Sound check`.
- **Kickers: target word, a space, the English in capitals**: `今日 TODAY`, `次 NEXT`, `済 DONE`, `練習 DRILL`,
  `学習 LEARN`, `復習 REVIEW`; longer ones with U+3000: `今日の見開き　TODAY'S SPREAD`, `週テスト　WEEK TEST`,
  `確認　QUICK CHECK`, `ヒント　HINT · drill only`, `コツ　STRATEGY · drill only`.
- **Headings:** the target-language title, then the English in a muted span (`間違いノート <span …>Mistake
  notebook</span>`, `模擬試験 <span>Mock exam · N2</span>`); lesson H1s are target-language only, with an English
  line under them.
- **Meta lines with middle dots:** `第3週 · Week 3 of 12`, `7日目 · 準備中`, `exam format · timed`, `今日 TODAY · 3 lessons
  · 2 a day`, `12問 · 約15分`, `基準点 19 / 60`.
- **Verdicts:** `せいかい！ Correct` / `おしい！ Not quite` (never "Wrong"); a streak chip `3問連続正解`.
- **Instructions:** imperative and short, one or two sentences: "Put the four tiles in order. Your answer is the tile on
  the star." "Learn the page, drill it with hints, then answer exam-style with the clock on." "Tap every word you would
  have to read." "Find a quiet place and put your earphones in."
- **Feedback says what happens next:** "Saved to your mistake notebook. It comes back tomorrow." "Back to the start. It
  returns tomorrow." "A mistake leaves the notebook after three correct answers in a row, each a little further apart."
  "Day 4 is stamped on your card." "Finish all three lessons to stamp day 4 on your card."
- **Explanations name the trap:** "Reply 1 hears 'being late', and reply 2 hears 'finish in an hour'." "Rents are low,
  not rising."
- **Honest status:** "Your progress is saved on this device only." "This browser would not play the sound." "The next
  day opens when it is written." "Estimated from your week tests. … read this as a guide, not a promise." "Quit the
  mock? Nothing from this run is saved, and the clock keeps running while you decide." `準備中` for what is not written.
- **Warm, never gushing:** "One eye in. One to go." Celebration lives in stamps and the mascot, not in adjectives.

### 5.3 Accessibility conventions (counts over the 29 screens)

- `lang="ja"` on every Japanese span (135 `lang` attributes) under `<html lang="en">`.
- `aria-label` (124) on every icon-only control ("Close lesson", "Back to the week path", "Play example 1", "Play
  audio", "Open the answer sheet") and on composed visuals; `role="img"` (69) with a full sentence for stamp cards,
  score bars, step dots, locked chips, the mascot ("Stamp card: 3 of 6 days stamped, day 4 is next, day 7 is the week
  test"); `aria-hidden="true"` (108) on decoration and on marks whose meaning the text already gives.
- `aria-pressed` (16) on options and chips; `aria-current="page"` on the current tab; `aria-disabled` on unopened tabs;
  `role="dialog" aria-modal="true" aria-label` on sheets, with a scrim button "Close"; `role="timer"` on clocks;
  `aria-live="polite"` on the writing pad's message; `role="tablist"`/`tab` + `aria-selected` in mock answers;
  `aria-expanded` on "Show the script"; `aria-haspopup="dialog"` on the date field; `role="status"` on the sideways note.
- Only real `<button>` and `<a href>`; `<nav aria-label="Main">`; taps ≥ 44×44 (tested); text ≥ 4.5:1 (§2.1); right and
  wrong always carry ○/✕ and words; every sound control has a silent stand-in (it lights for a moment).
- Typing/Reader add `:focus-visible { outline: 3px solid var(--accent-ink); outline-offset: 2px; }`, `.sr-only`, and the
  reduced-motion rule; the canvas screens have neither.
- Trade-off to revisit: zoom is disabled (`user-scalable=no`, gesture and double-tap prevented) because the design fills
  the screen.

---

## 6. Test strategy (`check/`)

- **Two sides, the same scripts.** Canvas side: `setup-site.sh` copies the published screens into `check/site/` with the
  canvas runtime as `support.js` and the @fontsource typefaces, and makes `TShell.dc.html` (App with its start state from
  the address); `run.sh <script>` serves it on `PORT` (8765). App side: `run-app.sh <script>` builds `dist-test`
  (`YK_BUILD_DATE='test build'`) and serves it; `YK_APP=1` makes `openBoard` open `index.html?yktest…` instead of a board.
- **Every board** (`rt-check.js` `inspect`): runtime and console errors; `OUT` (anything past 390 wide or 844 tall,
  outside a scrolling box), `SMALL` (a button or link under 43.5×43.5) fail; `PAD` warns about anything a learner sees
  in the bottom 34 px (below 810) except in `nav`; `root=844/844 unresolved=0` is the clean line (scrollHeight equals
  clientHeight, no unresolved holes); a screenshot per board, row sheets (`sheet.js`).
- **Suites:** `flow-test.js` (a day from goal to stamp, then the notebook review the next day), `e2e-mock.js` and
  `n3/n4/n5-mock.js`, `pause-test.js` (interruptions: clocks follow real time, taps cannot fall through, listening waits
  and resumes), `level-test.js`, `content-sweep.js` ("every written day, every answer… the layout check new content
  must pass"), `screens-app.js` (every app screen alone), `app-test.js` (below), `preview-test.js` (the Claude page in a
  stand-in host skeleton), `two-apps-test.js`, `offline-sound.js`, `lazy-sound.js`, `sound-test.js`, writing
  (`write-engine-test.js` on every kanji without a browser, `write-flow*.js` with touch input), Typing/Speaking engine
  tests in Node and page tests in Playwright.
- **`app-test.js`:** nothing in storage before the first tap; progress saved and restored after reload; the menu (sound
  check plays the 3,540 ms test clip; "check the silent switch" note; Start over asks first; Cancel); wake lock only in
  the mock; `theme-color` `#1B2440` in the mock, `#F4F5F9` outside; the Install page on iPhone 14 Safari (fills, no
  scroll, names the device; iPad says iPad; not again in the visit; standalone skips it); the design fills 8 iPhones
  exactly (375×812 … 440×956) with the tab bar on the bottom edge; under status-bar strips of 47–68 px only the top
  zone is cut and proportions stay within 3 %; short screens (375×647, 375×553, 390×664, 320×548); wide windows
  framed and centred; sideways note; offline (one store named after folder and version, all files under `v=`, all five
  font cuts load offline, a clip plays); a new build never restarts a lesson, restarts on the week path, switches at
  once if found before the first tap, and leaves another folder's store alone.
- **Fault flags:** `NOSOUND=1` (sound scripts empty), `HELDBACK=1` (audio context never starts), `BADCLIPS=1` (clips
  undecodable), `OMELETTE=1` (the canvas runtime's second mode), `FAST_MOCK=1`/`FAST_EXAM=1` (sed-patched clocks in the
  test copy only, with a `WARNING` if the patch misses), `YK_TESTDIR`/`PORT` for parallel runs.
- **Verdicts:** each script ends `X TEST PASS` or `X: n problem(s)`; runners grep `FAIL|PASS|PROBLEMS|problem\(s\)|…`
  (`release-checks.sh` prints only verdict lines, `all.sh`, `all-app.sh`, `all-both.sh` run the matrices).
- **For Guarani:** keep `inspect` as is; add a check that every Guarani string sits in a `lang="gn"` element, a glyph
  check (render ã ẽ ĩ õ ũ ỹ g̃ and capitals in each face and fail on a fallback face), text-helper tests (NFC, puso
  variants, grapheme-safe cuts), and run the content sweep early: Spanish labels are longer than the English ones Yaoki
  sized its `white-space: nowrap` buttons for.

---

## 7. Adapting to Guarani for Spanish speakers

### 7.1 What carries over unchanged

The platform (dual runtime, build, Shell/Install, fit, storage, offline worker, preview); the 390×844 frame, the 50/34
px zones and 44 px taps; the token roles and every recipe in §3; hard shadows and 2 px ink outlines; radii; motion;
the graph paper (it is also the Latin American "cuaderno cuadriculado"); the stamp mechanics (a ring stamp per done
day, a special node for the test, a mark for a comeback, a scalloped ring for a clean answer, a teacher's verdict
stamp by score band); the copy rules (§5.1–5.2) and accessibility conventions (§5.3); the test strategy.

### 7.2 Language, labels and separators

- `<html lang="es">` on every artboard and in `index.html`; Guarani in `<span lang="gn">` (ISO 639-1 `gn`);
  manifest `"lang": "es"`. Spanish must stand alone (Y1); Guarani is the accent, placed first as Yaoki places Japanese.
- **The U+3000 separator does not carry over:** Nunito has no U+3000, U+2002 or U+2003 (verified); Andika has U+2002/
  U+2003 only. Use the middle dot both fonts have, which is also G5's pattern ("Ehendu · Escuchar"):
  `<span lang="gn">Ehendu</span> · Escuchar`, or a styled gap (`<span lang="gn" style="margin-right: 6px">`). Kickers: Guarani in sentence case, Spanish in capitals (capital G̃ and the puso in all-caps
  Guarani hurt reading and, on Google subsets, rendering).
- Buttons in the infinitive (Spanish UI convention: Empezar, Comprobar, Continuar, Cerrar, Cancelar) avoid the tú/vos
  choice; body copy still needs one decision (Paraguayan and Rioplatense voseo "Tocá", "Escuchá" vs neutral "Toca").
- Replace `line-break: strict` (a Japanese rule) with `overflow-wrap: break-word`; Guarani words are long
  (agglutinative) and browsers have no Guarani hyphenation, so do not rely on `hyphens: auto`; never break at the puso.
- The ○ "right" mark is Japanese; Spanish-speaking school convention is the check ✓ (Y1 suggests `M5 12l5 5 9-10`).
  Keep ✕ for wrong, keep the word, keep both icons in their colours.
- Sideways note, `<noscript>`, the "could not start" line, Install steps, the menu and its credits all need Spanish.
  The iOS button names ("Compartir", "Agregar a inicio" or similar) must be copied from an iPhone set to Spanish
  **[verify on device]**.

### 7.3 Fonts (verified 2026-11-03, headless Chrome/HarfBuzz)

| Face | ã ẽ ĩ õ ũ ỹ (+caps) | g̃ in one file | G̃ in one file | `'` puso | Notes |
|---|---|---|---|---|---|
| M PLUS Rounded 1c 500/800 | all present | **tilde lands on the next letter** | **tilde floats right** | slanted | `mark`/`mkmk` features but no mark anchor on g |
| Klee One 600 | **no ỹ / Ỹ** | spacing tilde (g˜) | spacing tilde | ok | unusable for Guarani |
| **Nunito** (variable 200–1000) | all | correct | correct | straight | rounded, closest to M PLUS's feel; no reserved name |
| **Andika** 400/700 | all | correct | correct | straight | SIL literacy face: single-storey a and g; RFN "Andika", "SIL" |
| Quicksand, Varela Round | all | correct | correct | Quicksand curly | both have reserved names |
| Baloo 2 | all | acceptable (no anchors) | ok | ok | no Latin mark features |

- **Google Fonts css2 (the canvas's only allowed font source besides uploads):** `latin` covers U+0000-00FF, `latin-ext`
  U+0100-02BA (ĩ ũ) and U+1EF2-1EFF (ỹ), `vietnamese` U+0128-0129, U+0168-0169, **U+0300-0301, U+0303-0304**,
  U+1EA0-1EF9. With the split files, lowercase g̃ positions well but **capital G̃ is drawn in a system serif** for
  M PLUS, Nunito and Andika alike. Two fixes, both verified for Nunito 800: a single-file subset link
  `https://fonts.googleapis.com/css2?family=Nunito:wght@800&text=<every character the UI uses, URL-encoded, including
  U+0303 and U+0301>&display=swap` (returned one 12.7 KB file with `mark`/`mkmk`; G̃ correct), or full font files
  uploaded to the canvas (`@font-face` in the helmet with the `/_blob/` URL). Uploading a *subset* of Andika is a
  Modified Version under its RFN: rename it or upload SIL's unmodified file.
- **App build:** `fonts.py` makes one file per weight with `ccmp`/`mark`/`mkmk`: correct shaping. Change `FACES` to
  Nunito (either instance 500/700/800 with `fontTools.varLib.instancer` or ship the variable font with
  `font-weight: 200 1000`) and Andika (`Andika-Regular.ttf`, `Andika-Bold.ttf`; rename the subset family, e.g. in name
  IDs 1/4/6/16 and in `fonts.css`, or ship SIL's own web font); `fetch-fonts.sh` from
  `google/fonts/main/ofl/nunito/Nunito[wght].ttf` and `ofl/andika/`; the reveal check samples Guarani
  (`document.fonts.load("800 16px 'Nunito'", "ñe'ẽ g̃")`).
- Licences file: "Nunito: Copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito)";
  "Andika: Copyright (c) 2004-2022 SIL International, with Reserved Font Names "Andika" and "SIL"" (both OFL 1.1).
- Text data: NFC everywhere (ẽ becomes U+1EBD; g̃ stays g + U+0303), one puso character (Y1: U+0027), grapheme-safe
  cutting (Y1 `C.chars`). Store g̃ only as g + U+0303.

### 7.4 A Paraguayan palette: G5's colours on Yaoki's roles (contrast computed)

G5 warns that a palette dominated by pure red or pure blue reads as Paraguay's party colours (Colorado red, Liberal
blue) and asks for no flag-waving; it proposes tierra colorada `#A8432A`, tajy pink `#D9467A`, tajy sa'yju `#E8B92F`,
ao po'i cream `#F4EDE0`, poncho black `#1E1B18`, ka'a green `#5E7D3A`. Yaoki's indigo-blue actions plus vermilion
stamps would sit too close to that. Mapped onto Yaoki's token roles, so every recipe in §3 ports by swapping hex values:

| Role (Typing token) | Yaoki | Guarani | Numbers (WCAG) |
|---|---|---|---|
| `--ground` | `#F4F5F9` | ao po'i cream `#F4EDE0` | ink on it 14.72 |
| `--card` | `#FFFFFF` | `#FFFFFF` | |
| `--ink` `--outline` `--hard` | `#1B2440` | poncho black `#1E1B18` | 17.14 on card |
| `--muted` | `#5A6382` | warm grey `#6B6258` (computed) | 5.13 on cream, 5.98 on card |
| `--line` / `--line-strong` / `--grid` | `#DDE1EC` / `#C9D0E3` / `#E6E9F3` | `#DDD3C2` / `#C9BCA6` / `#E9E1D2` (proposal) | decorative, as Yaoki's are |
| primary action (`--accent` role) | `#2F4FD0` fill | **ink fill** `#1E1B18`, white text, hard shadow `0 4px 0 #A8432A` | white on ink 17.14; this is Yaoki's own exam-style recipe with a red-earth shadow |
| selected / current (`--accent-soft`, current tab) | `#E8ECFB` + 2.5 px indigo | tajy-yellow tint `#FBF0CC` + `2.5px solid #1E1B18`; current tab label in terracotta, 800 | ink on the tint 15.05; terracotta on white 6.00 |
| `--stamp` `--bad` (red text, wrong, danger, stamp rings) | `#C7361E` / `#E2452B` | tierra colorada `#A8432A` for both | 6.00 on card, 5.15 on cream, white on it 6.00; soft `#F6E2DA` (ink 13.72, terracotta on it 4.80) |
| `--good` | `#0B7A6B` | ka'a green `#5E7D3A` for fills, `#4E6B2E` for text | 4.70 / 6.06 on card; white on `#4E6B2E` 6.06; soft `#E6EEDB` (`#4E6B2E` on it 5.08) |
| `--gold` | `#F2B43A` | tajy sa'yju `#E8B92F`, always with an ink outline | ink on it 9.31; 1.58 against cream, so never without the outline |
| clean-answer ring (was はなまる) | `#C7361E` | tajy pink `#D9467A` for rings, `#C2336F` if pink text is needed | `#D9467A` 4.11 (shapes only); `#C2336F` 5.25; ink on soft `#FBE3EC` 14.12 |

Right and wrong (green L* 49, terracotta L* 42) stay apart by icon and word, as in Yaoki. G5 also asks for no flags,
feathers, Andean motifs or party-colour dominance; keep the national arms and seals and government logos out too. The
Guarani colour names are G5's; treat their spellings as **[revisar]** until its native review.

### 7.5 Motifs

- **Ñandutí for はなまる.** The ñandutí lace wheel is a scalloped ring with radial threads: Typing's `hanamaruPath`
  plus spokes and an inner ring makes one, and it reads at 30 px (rendered). Sketch (viewBox −21 −21 42 42, R 15, 12
  scallops, inner ring r 7; stroked here in `#C2336F`, and G5's `#D9467A` is fine for a ring):
  `<path d="M0 -15A3.88 3.88 0 0 1 7.5 -12.99A3.88 3.88 0 0 1 12.99 -7.5A3.88 3.88 0 0 1 15 0A3.88 3.88 0 0 1 12.99
  7.5A3.88 3.88 0 0 1 7.5 12.99A3.88 3.88 0 0 1 0 15A3.88 3.88 0 0 1 -7.5 12.99A3.88 3.88 0 0 1 -12.99 7.5A3.88 3.88 0
  0 1 -15 0A3.88 3.88 0 0 1 -12.99 -7.5A3.88 3.88 0 0 1 -7.5 -12.99A3.88 3.88 0 0 1 0 -15Z" fill="none"
  stroke="#C2336F" stroke-width="1.6" stroke-linejoin="round"/><path d="M1.81 -6.76L4.4 -16.43M4.95 -4.95L12.03
  -12.03M6.76 -1.81L16.43 -4.4M6.76 1.81L16.43 4.4M4.95 4.95L12.03 12.03M1.81 6.76L4.4 16.43M-1.81 6.76L-4.4
  16.43M-4.95 4.95L-12.03 12.03M-6.76 1.81L-16.43 4.4M-6.76 -1.81L-16.43 -4.4M-4.95 -4.95L-12.03 -12.03M-1.81
  -6.76L-4.4 -16.43" stroke="#C2336F" stroke-width="1.2" stroke-linecap="round"/><circle r="7" fill="#FFFFFF"
  stroke="#C2336F" stroke-width="1.6"/>`. Refine with the mascot owner (real ñandutí has woven concentric rings).
- **Six levels, six rosettes:** a level passed adds a rosette; A1–C2 together make a ñandutí cloth (a level-progress
  view in place of Readiness's single verdict). G5: each level's ring can take a named *dechado* (motif), shown as a
  learning item; keep it line art, not doily clutter.
- The week path can stay a route over graph paper; a red-earth route (tierra colorada) in place of Yaoki's red one.
- G5's other motifs: ao po'i cream as the paper (and fine embroidery borders for cards), the poncho para'i's fine
  black-and-white stripes as a divider or the week bar (never on "fail" screens: it carries a war memory), a lapacho
  season skin from July to September, everyday objects (termo and guampa, the chipa basket).

### 7.6 The mascot: the brand rules G5's choice must meet

What the Guarani mascot must do, from Yaoki: a name that is itself a lesson; a simple silhouette that holds at 29–40 px;
the inked-sticker style (2–2.6 ink outline, flat fills, gold accents, hard shadow); at most four colours plus ink; six
moments mapped to the same places; a two-step goal ritual seen on Goal, Main and the level result; a resilience story
the stamps can reuse.

- **G5's recommendation: a tatu bolita** (three-banded armadillo, working name *Tatu'i*), with the app named
  **"Epu'ã"** ("¡Levantate!", tagline *Epu'ã ha eñepyrũjey*, attested), both pending G5's native and trademark checks.
  From the brand side it fits better than any other candidate: rolled up it is nearly a circle, as simple a
  silhouette as the daruma's egg (good at 29 px), and "rolls into a ball when hit and pops up again" is Yaoki's fall and
  get-up, stamped **Opu'ã**. G5's cautions: do not let it resemble FIFA's 2014 mascot Fuleco (also a three-banded
  armadillo: avoid a blue shell on a yellow body); avoid the *tatu ai* look; no feathers or headdresses.
- **Moments mapped from Yaoki's six:** blank → rolled up, asleep (before a goal) · one eye → uncurled and looking out
  (goal set: the week path) · studying → walking with a guampa of tereré · a miss → knocked into a ball, a drop of sweat ·
  back up → popped up, laughing (a notebook item cleared, the Opu'ã stamp) · both eyes → standing tall with the level's
  completed ñandutí rosette (a level passed). **[proposal; settle with the mascot owner]**
- **The two-step ritual** (replaces painting the eyes): Y1 suggests a ñandutí whose first ring is woven when the goal
  is set and completed when the level is passed; it ties the mascot to G5's progress rings. Keep it two steps and say it
  in one line on Goal, as Yaoki does ("Set a goal and Yaoki gets one eye. He gets the other when you pass.").
- G5's secondary character: the **karumbe** (tortoise) on the slow-listening button ("Ehendu mbeguemi"). An earlier
  idea of mine, the capybara (*kapi'yva*, Spanish "carpincho"), is a fallback only if the tatu fails its checks.
- Avoid the frightening or adult figures of the myths (Luisõ, Kurupi, Jasy Jatere, Ao Ao, Pombero; G5 treats the
  Tau–Kerana family as 20th-century folklore, not Indigenous religion), sacred Indigenous objects and texts, and
  national symbols.
- Redo the Icon, Logo, Rules, Moments and Home Screen boards for him, with alt text that states the ritual state, and
  run the Home Screen check against the same 15 fictional apps.

### 7.7 Stamps and marks: what replaces the kanji

Words from G5's glossary (its confidence in brackets); the visuals are this note's.

| Yaoki | Meaning | Guarani app |
|---|---|---|
| 済 | done | **Oĩma** (high) in the ring. Four letters need more room than one kanji: legible in Nunito 800 at 16 px inside a 60 px disc (rendered); use ✓ in the 20–40 px stamps and the word from 50 px up **[check each size by rendering]** |
| 試 | week test node | an icon (flag or pencil) + "Prueba"; G5 has no attested Guarani term yet |
| 起 | comeback | **Opu'ã** (high as a word; composed use as a stamp), with the gold ring |
| はなまる | clean answer | the Oĩma stamp inside the ñandutí rosette (§7.5); its label **¡Iporãiterei!** (high) |
| たいへんよくできました / よくできました / がんばりましょう | teacher's stamp by score | **¡Iporãitereíma ne rembiapo!** (medium-high) / **¡Iporã!** (high) / a third band still to find (G5 lists ¡Eku'e péicha! "¡Seguí así!", medium), each with the Spanish under it |
| 連続 run | clean answers in a row | Spanish label until a native term exists (G5: "{n} jey" is the attested pattern) |
| 準備中 / 未発表 / あとN日 | not written / not announced / days left | "En preparación", "Pronto", "Faltan N días" |

### 7.8 Platform changes

The app name (G5: "Epu'ã", pending checks) and `short_name` (≤ 12 characters for the Home Screen label; the puso must
survive in the manifest and in `apple-mobile-web-app-title`), manifest `lang: es`, `theme-color` and manifest colours
from the new ground (`#F4EDE0`), storage key and cache
prefix distinct from `yaoki.v1:` / `yaoki:` (Typing and Speaking read the Yaoki key), `LEVELS` becomes the Guarani
app's single entry with A1–C2 inside it (one app, as the user decided), the icon SVG in `build.mjs` becomes the new
mascot's, the licences drop KanjiVG, Hanzi Writer, Kokoro and the JLPT notice and add the fonts above, the voices'
real speakers, and G6's line that the CEFR levels are the Council of Europe's and the app's result is a constancia, not
a certificate. `AWAKE` lists the Guarani listening screens.

### 7.9 Open questions

1. Mascot and ritual: G5's tatu bolita (Tatu'i) with the ñandutí ritual, once its native and slang checks pass; how far
   from Fuleco the drawing must stay.
2. UI face: Nunito (recommended) or keep M PLUS Rounded 1c and never show g̃/G̃ in UI text (fragile).
3. Primary action colour: ink fill with a red-earth shadow (recommended after G5's party-colour caution) or keep a
   blue; the current-tab treatment follows from it.
4. Canvas font loading: a `text=` link per family and weight, or uploaded full fonts. Test the chosen path on an iPhone
   (Safari was not tested here).
5. Tú or vos in body copy (G5's Spanish glosses use vos: "Levantate", "empezá", "Seguí así"); infinitive buttons
   either way.
6. App tile colour and name, settled on a Home Screen check board.
7. Every Guarani word in this file (Epu'ã, Tatu'i, Oĩma, Opu'ã, Iporãiterei, tajy, ka'a, ñandutí, kapi'yva) comes from
   G5's glossary or is marked; none reaches a screen without G5's native review.
8. Whether to keep zoom disabled, given low-vision learners.
