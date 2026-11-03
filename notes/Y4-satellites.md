# Y4 · The suite's satellite apps: Reader, Typing, Speaking (Yaoki → Guarani)

Read from the real source (read-only clones), 2026-11-03:
`ref/Yaoki/README.md` ("The reader", "Yaoki Typing", "Yaoki Speaking"), `ref/Yaoki-reader/README.md`,
`ref/Yaoki/docs/reader/index.html`, `docs/reader/engine/analyzer.js`, `docs/reader/library/catalog.json`,
`docs/reader/library/mekawa-n5/1.txt` + `1.json`, the Reader canvas (`artifact-files/7ec88b87…/project/`: `canvas.json`,
`Main.dc.html`, `Held.dc.html`, `Settings.dc.html`), `docs/typing/index.html`, `engine.js`, `items.js`, `game.js`,
`scenes.js`, `sfx.js`/`music.js` headers, `docs/speaking/index.html`, `lessons.js`, `voice.js`, `listen.js`, `game.js`,
`world.js`, `places/yama.js` (header), `docs/assets/course-n5.js` (shape), `docs/assets/sound.js` (header),
`yaoki-app/src/yk-app.js` (state key), `Yaoki-reader/tools/icons.mjs`. Cross-checked with the other notes in this folder
(Y1 §6.5–6.7 for fonts and orthography, G6 §4.3 for speech scoring, G7 §4 for sourced Guarani examples).
Paths below are relative to `ref/Yaoki/` unless they start with `artifact-files/`.

---

## 0. Read this first (the things that matter most)

1. **Three satellites, one look, separate saves.** Reader (よむ, phone), Typing (タイピング, desktop only, JIS keyboard),
   Speaking (スピーキング, phone held upright). Each is a plain page with no build step, the main app's tokens and
   typefaces, its own `localStorage` key, and footer links (Typing and Speaking link to each other, the Reader and the
   app; the Reader links only to the app). Typing and Speaking **read** the main app's saved state
   (`yaoki.v1:/Yaoki/`) and **never write** it. **The main app never links to them** (verified: no reference in
   `yaoki/project/*.dc.html` or `yaoki-app/src/`). A Guarani design should link them from the app (menu, Today).
2. **Only the Reader has a canvas** (3 artboards, `.dc.html`, 390×844, radius 44). Its pattern is the one to copy:
   ONE component artboard (`Main.dc.html`) holds the whole interactive reader; the two other artboards are
   `<dc-import name="Main" demo="6">` and `<dc-import name="Main" view="settings">` "moment" boards that open the same
   component in a designed moment through props. Typing and Speaking exist only as `<canvas>`-drawn web pages.
3. **The Reader's idea**: the text is shown with its help hidden; hold a phrase and a "lens" card shows each word's
   reading (ruby), meaning, and any grammar pattern; let go and it hides. **A hold never shows a whole-sentence
   translation** (copy: "文の訳は出ません。 A hold never shows a whole-sentence translation. You get the pieces and put
   the sentence together yourself."). Looked-up phrases get a dotted underline and a count "n / N".
4. **For Guarani the lens keeps its frame but changes its content**: kanji/furigana have no counterpart (Guarani is a
   phonemic Latin script). The lens becomes **interlinear**: the phrase as written, then its **morphemes** (prefix ·
   root · suffix, e.g. `a- | guata | -ta`) each with a short **Spanish gloss** (`yo | caminar | futuro`), a
   **Gramática** row for the affix pattern, and an optional **Pronunciación** layer (stressed syllable, nasal
   syllables). Function morphemes take the Japanese particles' grey (`#5A6382`) but, unlike particles, get a gloss.
5. **The Reader's analysis format** (`{ v, paras: [[{ w:[{ s:[[text, ruby]], e, k, f }], h, t, g, d, n }]] }`) and its
   "a part may carry its whole analysis, made in advance, so it opens without the dictionary" rule are the way to ship
   Guarani: there is no kuromoji/IPADIC for Guarani, so the app's own library texts must come with **hand-made,
   native-reviewed analyses**; pasted texts get a best-effort rule-based analysis marked as unreliable.
6. **Typing becomes a phone game with its own on-screen keyboard of real `<button>`s.** Reasons: phones' system
   keyboards may not offer ẽ ĩ ũ ỹ g̃ (Y1: "[verify on device]"), phone keyboards send `keyCode 229`/`isComposing`
   (Yaoki Typing already refuses these: "Keys are not reaching the game"), iOS smart punctuation turns ' into ’, and the
   Design canvas forbids global keydown handlers. The Yaoki kana-input rule "a voiced kana is its kana and then ゛"
   maps exactly onto **vowel + ~ (combining tilde U+0303)** for nasal vowels and **g + ~** for g̃.
7. **Speaking cannot rely on speech recognition.** Yaoki listens with the Web Speech API in `ja-JP`
   (`listen.js`: `r.lang = 'ja-JP'; interimResults = true; maxAlternatives = 5; continuous = true`). Guarani is not
   known to be offered by Apple's or Google's recognisers **[verify on a phone]**, and G6 found community Guarani ASR at
   about 53–59 % WER and decided **"Do not auto-score Guarani speech."** So: perception rounds that are auto-scored
   ("Escuchá y elegí"), production rounds gated only by voice activity, and per-card **self-check** (model clip vs. the
   learner's own recording). Recording needs no network, unlike Yaoki's recognition.
8. **The reward system is shared, exact and portable** (Typing = Speaking): はなまる for a card done first time with no
   hint; 連続 clean run with cheers at 5, 10, 20, 40; 起 for a comeback; gold corner (≤ 1 card in 5) and star for weak
   spots; a weak item leaves the list after **3 clean in a row**; a 7-day stamp card filled by **practice time** (goal
   3/5/10 min; time stops 8 s after the last key or word; days off never erase a stamp); a stage ring for
   たいへんよくできました (≥ 80 % clean) **at most one a day**, three rings = the stage's はなまる. It rewards
   "accuracy, getting up again and showing up, never speed", and none of it touches the learning data.
9. **"Fall down seven times, get up eight" is the game loop**: a card that reaches the mascot knocks him over; he rights
   himself and the card **comes back after two other cards**; after **two** falls it **waits** in front of him with the
   answer shown and can be skipped, "so every round ends". Pace is measured from the player (moving averages, 15–20 %
   slack). Keep all of this; only the mascot, the marks and the words change.
10. **Shared course words and clips**: Typing and Speaking load `../assets/course-<lv>.js`
    (`window.__ykCourses[LV].units[].days[].scene.words[] = { word, reading, gloss, clip }`), dedupe by
    `word|reading`, and play the app's own clip on a cleared word via `window.ykSound` (`has/play/ms/over/unlock`),
    loading the week's `sound-course-<lv>-u<NN>.js` beside the round ("the round never waits for them"). No effect
    sound plays over a word's own clip; the music ducks.
11. **Fonts**: Klee One (the satellites' `--jp` face) has no ẽ and no U+0303 (Y1 §6.5, verified); use **Andika**
    400/700 for Guarani target text and keep **M PLUS Rounded 1c** 500/700/800 for UI (it covers ã ẽ ĩ õ ũ ỹ + U+0303
    via its vietnamese subset). Look at g̃ at 14–26 px before relying on it.
12. **Copy pattern**: target language first, learner's language second in muted: `<span lang="ja">とじる</span>　Close`
    (ideographic space U+3000 on the pages; a plain space on the canvas), headings `よむ <small>Reader</small>` with the
    small part 12–13 px/700 `#5A6382`. For Guarani: `<html lang="es">`, `lang="gn"` on Guarani spans, a Guarani accent
    plus Spanish, and **Spanish must be enough alone**; use a plain space or ` · `, not U+3000, between Latin words.
13. **Defects not to copy**: the Reader canvas's close button (`aria-label="Close reader"`) has no handler; Speaking's
    menu note uses an emoji ("🔊 きく") that the canvas forbids; the satellites draw everything on `<canvas>`, which a
    Design canvas artboard must instead build from markup.
14. **Ana is from Paraguay.** The Yaoki Library's learner serial 目川日記 (N5→N2) follows "Ana, a designer from Paraguay
    with a Japanese grandmother", who arrives in Mekawa with her grandmother's one-eyed daruma. A Guarani library could
    carry the mirror story (Ana's Paraguayan side) as its own learner serial **[decide; content needs a native writer]**.

---

## 1. The suite around the satellites

### 1.1 What each is

| App | Served at | For | Canvas | Saved key | Offline |
|---|---|---|---|---|---|
| Main app (N5–N2) | `docs/` | phone (PWA) | "Yaoki JLPT App" | `yaoki.v1:/Yaoki/` | own worker |
| Yaoki Reader (よむ) | `docs/reader/` (also the standalone repo Yaoki-reader, analysis v6 there, v5 here) | phone, single column ≤ 640 px | "Yaoki Reader: hold to reveal" | `localStorage` `yomu.*`, IndexedDB `yomu-reader` | the standalone has its own worker; the copy in Yaoki has none of its own (it sits inside the main app's worker scope `/Yaoki/`, which does not list its files) |
| Yaoki Typing (タイピング) | `docs/typing/` | desktop with a JIS keyboard; window ≥ 700 px | none | `yaoki.typing.v1` | none ("needs the network, or the browser's cache") |
| Yaoki Speaking (スピーキング) | `docs/speaking/` | phone or tablet held upright | none | `yaoki.speaking.v1` | none, and recognition needs the network |

Home-screen icons tell them apart by ground colour: main app gold, N1 indigo, Reader "Yaoki's daruma on the reader's
blue" `#2F4FD0` (`Yaoki-reader/tools/icons.mjs`, `GROUND = '#2F4FD0'`, daruma 70 % of the icon, 56 % for maskable,
82 % for the 32 px favicon, with a hard shadow `translate(3.5 4.5)` in `#1B2440`).

### 1.2 How they connect (exact)

- **The learner's place** (Typing and Speaking, identical code, `learnerPlace()`):
  ```js
  const root = location.pathname.replace(/typing\/(index\.html)?$/, '');   // speaking: /speaking\/(index\.html)?$/
  const s = JSON.parse(localStorage.getItem('yaoki.v1:' + root));
  const level = s.level || (s.started ? 'N2' : null);                       // legacy: no level = N2
  const m = /^(?:n\d)?u(\d+)/.exec(s.cur || '');                            // 'n5u03d4' → unit 3
  return { level, unit: m ? Number(m[1]) : null };
  ```
  The main app's key is `'yaoki.v1:' + location.pathname.replace(/[^/]*$/, '')` (`yaoki-app/src/yk-app.js`). Read only.
- **Defaults from it**: Typing starts in 語彙 course words if a place exists (else romaji かな); Speaking starts in
  語彙 if a place exists, else in あいうえお first steps ("where the page starts for someone new to it"). The level
  defaults to the app's level (else N5); the week list tags the app's current week `今　NOW` and adds
  "今 marks the week you are on in the Yaoki app."
- **Course words**: `loadScript('../assets/course-' + level.toLowerCase() + '.js')` →
  `window.__ykCourses[level].units` → per unit `{ n, ja, en, words }` built from every day's `scene.words`
  (`{ id, word, reading, gloss, parts, clip }` in the data; e.g. `{"word":"名前","reading":"なまえ","gloss":"name",
  "clip":"s_n5u1d1_name"}`), deduped by `word + '|' + reading`. Typing also drops a word its spelling rules cannot
  type. A unit with no words shows `準備中　Not written yet`, disabled, dashed. Load failure copy: "The N5 words could not
  be loaded. They come from the Yaoki app (../assets/), so open this page from the same site, online or with the app
  stored for offline use."
- **Clips**: `loadSound(level, n)` loads `../assets/sound.js` (if `window.ykSound` is absent) and
  `sound-course-<lv>-u<NN>.js` (N2: `sound-course.js` + `sound-lessons.js`), errors swallowed. On a cleared course
  word with 音 Sound on: `ykSound.play(clip)`; voice time `max(0.9 s, ykSound.ms(clip))`; music `duck`; Speaking also
  `L.quiet(ms)` so the game never hears its own voice.
- **Shared code**: Speaking loads Typing's `engine.js` (kana/kanji lists), `sfx.js`, `music.js`, `items.js` (lines and
  little items). Speaking's stages reuse Typing's lists (`E.KANA_STAGES`, `E.KANJI_STAGES`).
- **Links**: footers `<a class="linklike" href="../">Yaoki app</a>`, `../typing/` "Yaoki Typing", `../speaking/`
  "Yaoki Speaking", `../reader/` "Yaoki Reader" (Speaking adds `licenses.txt` "Licences"). Typing's touch note links to
  Speaking: "On a phone or tablet, Yaoki Speaking has you say the words out loud instead."

### 1.3 Shared tokens (exact; the satellites declare them on `:root`)

Light:
```css
--ground:#F4F5F9; --card:#FFFFFF; --ink:#1B2440; --muted:#5A6382; --line:#DDE1EC; --line-strong:#C9D0E3;
--outline:#1B2440; --hard:#1B2440; --accent:#2F4FD0; --accent-ink:#2F4FD0; --accent-soft:#E8ECFB; --on-accent:#FFFFFF;
--mark:#FFE9B0; --note:#FFF4D6; --stamp:#C7361E; --scrim:rgba(27,36,64,0.45);
/* Typing and Speaking add the game's answer colours: */
--good:#0B7A6B; --good-soft:#E0F3EF; --bad:#C7361E; --bad-soft:#FDEBE6; --gold:#F2B43A; --daruma:#E2452B; --grid:#E6E9F3;
--ui:'M PLUS Rounded 1c','Hiragino Maru Gothic ProN','Yu Gothic',system-ui,sans-serif;
--jp:'Klee One','Hiragino Mincho ProN','Yu Mincho',serif;   /* Reader: --jp-print 'Noto Serif JP' default, --jp-hand Klee One */
```
Dark (under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and again on
`:root[data-theme="dark"]`):
```css
--ground:#12172A; --card:#1C233B; --ink:#E8EBF6; --muted:#A6AECA; --line:#2C3554; --line-strong:#3B466C;
--outline:#7B86B4; --hard:#05070F; --accent:#4560E0; --accent-ink:#A9B8FF; --accent-soft:#262F58; --on-accent:#FFFFFF;
--mark:#5E4B10; --note:#37301A; --stamp:#FF8D76; --scrim:rgba(3,5,12,0.6);
--good:#4FC7B2; --good-soft:#12342F; --bad:#FF8D76; --bad-soft:#3A1F1A; --grid:#1A2137;   /* gold, daruma unchanged */
```
Body: `background var(--ground); color var(--ink); font-family var(--ui); font-size 15px; line-height 1.45;
font-weight 500; line-break: strict`. Focus: `:focus-visible { outline: 3px solid var(--accent-ink); outline-offset: 2px }`.
Typefaces from Google Fonts: `M+PLUS+Rounded+1c:wght@500;700;800` and `Klee+One:wght@400;600` (Reader adds
`Noto+Serif+JP:wght@400;500;600`). Theme colours: `<meta name="theme-color" content="#F4F5F9">` light,
`#12172A` dark. Viewport `width=device-width, initial-scale=1, viewport-fit=cover`; safe areas via
`env(safe-area-inset-top/bottom)`.

### 1.4 Shared components (exact CSS, as the pages write them)

| Piece | Values |
|---|---|
| `.bar` (header) | flex, gap 8, min-height 56 (Reader: padding-inline 16) |
| `.brand` | flex 1, 20px/800; `small` 13px/700 `--muted` → "よむ <small>Yaoki Reader</small>" |
| `.pill` | height 40, padding 0 14, radius 20, `--card`, 2px `--outline`, 13px/800, icon gap 6 (slider icon, stroke 2.4–2.6) |
| `.icon-btn` | 44×44, no border, radius 12 (Speaking's in-round one: 44 circle, 2px outline, card bg, `0 2px 0 var(--hard)`) |
| `.btn` (primary) | min-height 54, padding 8px 16–20px, radius 16, 2px `--outline`, `--accent` bg, `--on-accent` text, `box-shadow: 0 4px 0 var(--hard)`, 17px/800; `:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--hard) }`; `.quiet` card bg ink text; `.danger` card bg, `--stamp` text and border, no shadow; `:disabled` line bg, muted text, line-strong border, no shadow |
| `.linklike` | min-height 44, no border, `--accent-ink`, 13px/800, underline offset 3 |
| `.tag` | padding 2px 9px, radius 10, `--accent-soft` bg, `--accent-ink`, 11px/800; `.tag.gold`: `--gold` bg, `#1B2440` text, 2px outline, 12px |
| `.kicker` | 12px/800 `--accent-ink` (`.red` → `--stamp`), e.g. "タイピング　TYPING · JIS KEYBOARD" |
| `.card` | `--card`, 2px outline, radius 20, `0 4px 0 var(--hard)`, padding 14px 16px 16px |
| `.notebox` | padding 12px 14px, radius 16, `--note` bg, 13px/500, line-height 1.5, `b` 800 |
| `.pair` | column gap 2, padding 14px 16px, radius 16, `--note`; first line ja 18–20px/800, second 14–15px/700 |
| `.seg button` | min-height 46, padding 6px 14px, radius 14, 2px `--line`, card, 14px/800; `[aria-pressed=true]`: accent bg, outline border, on-accent, `0 3px 0 var(--hard)`; `.tile` column, min-width 96–104, `b` 20px/800 ("10<small>枚</small>"), `small` 700 |
| `.option` (stage/week tile) | grid `repeat(auto-fill, minmax(220px, 1fr))` on Typing, `minmax(150px, 1fr)` on Speaking, gap 10; tile padding 10px 14px 12px, radius 16, 2px `--line`, min-height 64; pressed: 2.5px `--accent-ink` + `--accent-soft`; disabled: muted, ground bg, dashed line-strong; parts `.o-kick` 12/700 muted, `.o-ja` 16/800, `.o-en` 13/700 muted, `.o-meta` 12/700 muted tabular ("20 prompts · 自己ベスト 85 keys/min" + rings) |
| `.switch` (settings toggle) | min-height 66, padding 10px 14px, radius 16, card, 2px outline, 15px/800; label `small` 12/700 muted; knob `input` 52×30 radius 15, 2px outline, `--line` → `--accent` checked, thumb 22×22 circle card fill 2px outline, `translateX(22px)`, 150 ms. Reader/canvas variant: `<button role="switch" aria-checked>` with a 52×30 knob and a 20×20 thumb, track `#2F4FD0` on, `#DDE1EC` off |
| sheet | scrim fixed full, `--scrim`, `animation: yk-fade 160ms ease-out`; sheet `width: min(640px,100%)`, `max-height: 92svh` (Reader 88 %), radius `26px 26px 0 0`, `border-top: 2px solid var(--outline)`, ground bg, padding `18px 16px calc(22px + env(safe-area-inset-bottom))`, gap 10–12, `animation: yk-up 240ms ease-out`; `h2` 18px/800 with `small` 13/700 muted; buttons full width; `role="dialog" aria-modal="true" aria-labelledby` |
| progress (in a round) | `.segs` one bar per card (flex 1, height 10, radius 5, `--line`; `.done` accent, `.skip` line-strong, `.now` ink; gap 4, `.many` (> 6) gap 2) or `.track` for > 20 cards (height 12, radius 6, fill accent `border-radius: 0 6px 6px 0`, width transition 300 ms); `role="img" aria-label="Card 3 of 20"` |
| `.chip` (HUD) | height 32, padding 0 8–10, radius 16, card, 2px `--line`, 14px/800 tabular; run chip `.zero` muted; `.step` gold bg, outline border, `#1B2440`, `0 2px 0 var(--hard)` ("gold at 5, 10, 20 and 40 in a row, never red") |
| hanko (result stamp) | 124×124 (Speaking 108, 96 at ≤ 400 px), radius 50 %, 4px `--daruma` border, padding 5, `rotate(-9deg)`, `animation: yk-stamp 550ms ease-out 150ms both`; inner div 2px daruma border, `--stamp` text 17px/800 (Speaking 15) line-height 1.35, `.three` (3-line text) 15px (Speaking 13); ink ring `inset:-8px`, 3px daruma, `yk-ring 400ms ease-out 452ms forwards`; はなまる ring `svg inset:-22.5%`, path stroke `--stamp` 2.4, `stroke-dasharray:1`, `yk-draw 900ms ease-out 750ms backwards` |
| rings (toward a stage's はなまる) | `.rings i` 12×12 circle 1.5px muted border; `.on` 2px daruma border + `radial-gradient(var(--stamp) 0 2px, transparent 2.5px)` |
| weak chips | height 36, padding 0 12, radius 18, `--note`, 15/800 (ja: Klee 17/600) with a 16 px icon: STAR (weak) or DONE 済 (graduated) |
| stamp card (`.daycard`) | 7 boxes 30×30 radius 8, 2px dashed line-strong, gap 6, date label 10/700 under each; stamped: solid `--line` border, inner `i` 24×24 circle 2.5px daruma, card fill, `--stamp` 12/800 "済", `rotate(var(--tilt))` with tilts `[-9, 6, -4, 8, -7, 5, -10]`; today's open box: 2px outline + `linear-gradient(to top, var(--gold) var(--fill), transparent var(--fill))`; new stamp `yk-day 500ms ease-out 750ms both`; `.mini` (on the result) boxes 24×24 r7, `i` 19×19 border 2, 10px |
| stats rows (result) | card `padding: 4px 16px`; row flex gap 12, padding 12px 0, `border-top: 2px solid var(--line)` (not the first); number `b` width 104 (Speaking 84) right-aligned 26px/800 (Speaking 22) tabular, `small` 14/700 muted; label 15/800 with `small` 12/700 muted |
| toast (Reader) | fixed, bottom `calc(76px + safe-area)`, padding 10px 16px, radius 14, `--ink` bg, `--ground` text, 13/700, 4.2 s |

Inline SVG pieces the pages reuse (copy exactly):
```js
// the teacher's はなまる: n scallops round a ring of radius R (nodes: R 21, n 9; icon: R 9, n 9 + inner circle r 3.2)
function hanamaruPath(R, n) {
  const f = (v) => String(Math.round(v * 100) / 100), step = (2 * Math.PI) / n, a = R * Math.sin(step / 2);
  let d = '';
  for (let i = 0; i < n; i++) {
    const t0 = i * step - Math.PI / 2, t1 = t0 + step;
    if (!i) d += 'M' + f(R * Math.cos(t0)) + ' ' + f(R * Math.sin(t0));
    d += 'A' + f(a) + ' ' + f(a) + ' 0 0 1 ' + f(R * Math.cos(t1)) + ' ' + f(R * Math.sin(t1));
  }
  return d + 'Z';
}
// HANA_ICON: <svg width=18 height=18 viewBox="-13 -13 26 26"><path class="hm" d=hanamaruPath(9,9) fill="none" stroke-width="2" stroke-linejoin="round"/><circle class="hm" r="3.2" fill="none" stroke-width="2"/></svg>   (.hm { stroke: var(--stamp) })
// STAR_ICON (weak spot): <svg 16 viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z" fill="#F2B43A" stroke="#1B2440" stroke-width="1.8" stroke-linejoin="round"/></svg>
// DONE_ICON (graduated): <svg 16 viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#E2452B" stroke-width="2.4"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="800" fill="#C7361E">済</text></svg>
// falls chip: the daruma tipped over: <g transform="translate(50 54) rotate(-70) scale(.92) translate(-50 -50)"> + body/face/eyes (strokes 4)
// timer chip: <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/> stroke 2.4
// close/pause: <path d="M6 6l12 12M18 6L6 18"/> stroke 2.6;  back: <path d="M15 5l-7 7 7 7"/>
// settings slider icon: <path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/>
```

### 1.5 Keyframes (identical in Typing and Speaking; Reader uses only press transforms)

```css
@keyframes yk-up    { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes yk-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes yk-in    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes yk-stamp { 0% { opacity: 0; transform: scale(1.8) rotate(-20deg); } 55% { opacity: 1; transform: scale(.92) rotate(-9deg); } 100% { opacity: 1; transform: scale(1) rotate(-9deg); } }
@keyframes yk-day   { 0% { opacity: 0; transform: scale(1.8) rotate(-20deg); } 55% { opacity: 1; transform: scale(.92) rotate(var(--tilt, -9deg)); } 100% { opacity: 1; transform: scale(1) rotate(var(--tilt, -9deg)); } }
@keyframes yk-ring  { from { opacity: .5; transform: scale(.9); } to { opacity: 0; transform: scale(1.35); } }
@keyframes yk-draw  { from { stroke-dashoffset: 1; } }
/* Speaking only: */
@keyframes yk-listen { 0% { opacity: .7; transform: scale(.92); } 100% { opacity: 0; transform: scale(1.22); } }
@keyframes yk-turn   { 0%, 30% { transform: rotate(90deg); } 60%, 100% { transform: rotate(0deg); } }
@keyframes yk-pulse  { from { transform: scale(1); } to { transform: scale(1.18); } }
.view { animation: yk-in 220ms ease-out; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } .btn:active { transform: none; } }
```
Canvas-drawn equivalents: a 済 lands on the yk-stamp curve in 0.32 s (`STAMP_T`), its ink ring 0.25 s, a clean card's
six ink drops 0.35 s.

### 1.6 The mascot in the satellites

**Drawing** (the app's 100-unit daruma; Typing at 62 %, Speaking at 60 %; "one eye painted, in every pose"):
```text
body  M50 6c26 0 40 20 40 46 0 24-16 42-40 42S10 76 10 52C10 26 24 6 50 6z   fill #E2452B (games: radial lacquer
      from (34,26,r4) to (50,54,r74): #FF7A5C 0, #E2452B .45, #A82A17 1), outline 4px #1B2440 (hero 0)
shine M21 30c-5 8-6 19-4 29 1 3 5 2 5-1-1-9 0-18 4-24 2-3-3-7-5-4zM34 14c-3 1-6 3-8 5-2 2 1 5 3 3 2-2 4-3 6-4 3-1 2-5-1-4z  white at 0.5
face  ellipse cx 50 cy 42 rx 27 ry 23 fill #FFF6EA
eyes  circles r 8 at (39,42) and (61,42), white, stroke #1B2440 2.5; pupil r 4 ONLY at (61,42) (his own left eye, the
      viewer's right), moved 2.4 units where he looks
brows M28 30c6-5 14-5 19 0M53 30c5-5 13-5 19 0  stroke 3, round caps
mouth M44 55c4 3 8 3 12 0  stroke 2.5   (Speaking's hero: an open mouth, ellipse cx 50 cy 57 rx 5 ry 6 filled — he is speaking)
gold  M38 74h24M42 82h16  stroke #F2B43A 3.5
faces: closed M31 42c4 2 12 2 16 0M53 42c4 2 12 2 16 0 · dizzy M33 37l10 5-10 5M67 37l-10 5 10 5 · grit M43 56h14 ·
       happy mouth M41 54c5 5 13 5 18 0 · "o" mouth ellipse (50,57) 3.2×4.2 · blush ellipses (31,55),(69,55) 5×3 #F59A8A 0.6 ·
       sweat M84 18c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11z fill #9FD3F5 stroke 2 ·
       brows worried M28 32c6-2 13-5 19-9M53 23c6 4 13 7 19 9 · up M28 27c6-6 14-6 19-1M53 26c5-5 13-5 19 1 ·
       firm M28 25c6 2 13 4 19 7M53 32c6-3 13-5 19-7 · dizzy stars: 3 gold stars orbiting the head
```
The menus' hero SVG (64×64, `role="img" aria-label="Yaoki, a daruma with one eye painted"`) is the flat version.
The Guarani mascot is decided elsewhere (Y1 suggests a ñandutí ritual); keep this **pose system** (face states driven
by game events) and the per-app hero variant (open mouth for the speaking app).

**Behaviours** (`yaokiPose()`; under reduced motion only the face changes):
- breathes (`sin(t·2π/2.2) × 0.022` on height, × 0.6 opposite on width), blinks every 2.2–5 s for 0.12 s;
- rocks along the route (± 5°), nods at each right key (0.12 s; Speaking 0.16 s per word heard);
- looks at the card being typed (pupil +2.4 units); **worried** (brows worried, mouth "o") when it is < 1.6 s away,
  **sweat** when < 0.9 s;
- **happy** (smile + blush) for 0.6 s after a clean card or a comeback;
- **hops** (stretch up, squash on landing, 0.4 s, 6 units; 8 from the third step; 10 at the end of a top round);
- **falls** (rotation to −1.35 rad in 0.22 s, dizzy eyes + "o" mouth + three orbiting stars), then **rights himself**
  halfway through the fall with a damped wobble `down · e^(−4.5u) · cos(11u)` and says the rise line;
- **tricks** past cleared cards (Typing): jump ぴょん (clean, 0.8 s), spin くるりん (clean in a run ≥ 5, 1.0 s, leaves
  star trail), duck ひょい (a card with a slip or hint sails over him, 0.9 s), smash どーん！ (a comeback, a weak spot
  typed clean, or a card that waited, 0.8 s). The sound word is drawn like a comic's lettering (ink edge, white edge,
  fill `--accent-ink`, or `--stamp` for the big one), 16 px (22 big), gone in 0.6 s. Speaking's own tricks: Falling
  パリン pop (clean), くるりん spin (run ≥ 5), ころころ dodge (not clean), どーん！ smash; Climb ぴょん hop, くるりん spin,
  よじよじ scramble (not clean), どーん！ super; a slip is ゴン.
- **an idle nudge**: once per card, after 3.5 s with nothing typed/said.

**His speech bubble**: left of him, above his head, clear of the cards; Japanese line 13 px (Klee 600, ink) over the
English 9 px (M PLUS 800, muted), a little item drawn at its left (24-unit sticker style), a rounded box (radius 10)
with its tail let into the bottom edge, a hard shadow 3 units down, 2px outline; pops from 0.8 to 1 in 0.15 s; lives
1.2–2 s; a newer line replaces the shown one unless that one matters more (`PRIORITY`: steps/record/end 3,
comeback/rise/halt/star/last 2, start/half/miss 1, idle 0). The first line of each occasion is always the same
(`いいね！`, `よいしょ！`); the others take turns.

**His lines** (`docs/typing/items.js` `LINES`; Japanese first, "about 7 characters, and 14 in English"; the item id
after each):

| occasion | lines (ja · en · item) |
|---|---|
| start | いくよ！ Let's go koinobori · よーい、どん！ Ready, go! flag · がんばろう！ Let's do this onigiri · しゅっぱつ！ Off we go kite · きょうもやるぞ Here we go pencil |
| half | はんぶん！ Halfway dango · おりかえし！ Halfway there mikan · いい調子！ Going well koinobori · あと半分！ Half to go tea · その調子！ Keep it up note |
| last | ラスト！ Last one flag · あと一枚！ One more card flag · これで最後！ This is it taiko · もうすぐゴール Nearly there kite · あとちょっと！ Almost there lantern |
| step0 (5 in a row) | いいね！ Nice sakura · ナイス！ Nice one sparkles · その調子！ Keep it up note · じょうず！ Good typing pencil · きれい！ Beautiful momiji |
| step1 (10) | すごい！ Great star · やるね！ You're good kendama · 絶好調！ On a roll koma · 止まらない！ Unstoppable kite |
| step2 (20) | さすが！ Brilliant fireworks · 名人だね！ A real master kendama · ノリノリ！ In the groove note · お見事！ Splendid fan |
| step3 (40) | かんぺき！ Spotless fuji · 達人の域！ Master level medal · 伝説だね！ Legendary crane · もう無敵！ Unbeatable star |
| comeback | もう大丈夫！ Got it now onigiri · 覚えたね！ You learned it pencil · 今度はできた！ Nailed it now sakura · リベンジ成功！ Rematch won! kendama |
| rise | よいしょ！ Up again sweat · 七転び八起き Fall 7, rise 8 otoshi · まだまだ！ Not done yet koma · へっちゃら！ I'm fine! heart · よいしょっと Up we get sweat |
| halt (a card waits) | ゆっくりでいい Take your time tea (Speaking: umbrella) · あわてないで No rush turtle · 待ってるよ I'll wait tea · ひと呼吸 Deep breath furin · 一歩ずつね Step by step turtle |
| star (weak spot clean) | にがて克服！ Weak spot down star · できたね！ You did it hanamaru · 苦手が得意に Now a strength sparkles · 成長してる！ You're growing koinobori |
| record | 新記録！ New record fan · 連続記録！ Best run medal · 記録更新！ Record broken fireworks · 最高記録！ Best ever fan |
| endGood / endOk / endTry | やったね！ Well done … お祭りだ！ Party time! / おつかれ！ Good work … ごほうびだね Treat time! / つぎがある！ Next time … あしたもやろう Again tomorrow |
| idle | うーん… Hmm… · だんご食べたい Dango, anyone? · おなかすいた… I'm hungry… · おーい？ Hello? · たい焼き… · お弁当まだ？ · おすし食べたい · 次のキーは？ What's next? · いっしょにやろ Let's do it |
| trick words | smash どーん！/ドカーン！/えいっ！/バーン！ · jump ぴょん！/ぴょーん！/ひらり！/ジャンプ！ · duck ひょいっ/さっ！/かわした！/すいっ · spin くるりん！/くるっ！/くるくるー/まわれー！ |
| Speaking's own (OWN_ONLY: idle, miss, halt) | idle 声に出して！ Say it out loud note · うーん… ; miss ん？ Hm? note · もういっかい！ Once more koma · おしい！ So close pencil · もう一度！ Again! kendama |

Items (小物, 36, "secular and everyday", drawn as stickers: flat soft fills, ink outline `#1B2440`, round joins, no
gradients, still at t = 0): sakura, star, sparkles, heart, note, sweat, hanamaru, flag, medal, fan, dango, onigiri,
taiyaki, tea, ramen, bento, sushi, mikan, kakigori, koinobori, furin, momiji, snowflake, fireworks, fuji, umbrella,
lantern, crane, kendama, koma, otoshi, kite, pencil, frog, turtle, taiko. Fill palette includes `daruma #E2452B`,
`gold #F2B43A`, `goldSoft #FFD978`, `pink #FFC6D3`, `green #9ED37E`, `blue #8DB4F2`, `wood #EBC48C`, `rice #FFFDF6`.

### 1.7 The reward system (Typing = Speaking, exact rules)

- **Clean card** = no miss, no hint, never fallen. It settles as 済 inside a はなまる (scalloped ring R 21, 9 scallops,
  stroke `--stamp` 1.8, tilted −9°). A card typed with a slip or a hint gets 済 without the はなまる.
- **連続** (clean run): +1 per clean card; a non-clean card ends it **quietly** ("no red, no sound of its own"); a fall
  ends it too. Steps `RUN_STEPS = [5, 10, 20, 40]` → chip turns gold, hop, cheer step0–3; the screen reader hears
  "N clean in a row." with the next card. The longest run is kept per stage (`run[stageKey]`), counted only in rounds
  without hints "always" and not weak-only; one longer than the record is cheered (record line) and tagged 記録更新.
- **起** (comeback): Typing: a card that knocked him over, typed with no miss and no hint when it comes back. Speaking
  Falling the same; **Climb: a card said right after one slip**. Stamped 起 (node with a 2px gold ring), smash trick,
  hop + comeback cheer. Result line `起き上がり ×n` or, if every fallen card came back clean and none was skipped,
  "七転び八起き！　Every card that knocked Yaoki over was typed clean when it came back."
- **Weak spots**: misses per kana/key (Typing) or per card text (Speaking) in `stats[bucket][key] = { miss, ok }`;
  `markOk` +1 per clean answer, **3 → deleted** ("like the app's mistake notebook"); a miss resets `ok` to 0 and
  re-adds. A round deals weak items earlier (`weight = random^(1/(1 + 2·weakness))`, every prompt once before any
  repeats, never the same card twice in a row). Up to `ceil(total/5)` cards holding a weak item get a **gold folded
  corner** (22-unit triangle top left, 1.5 outline diagonal; not in weak-only rounds, not with hints always); one done
  clean gets a **star** on its node and the star cheer. `苦手を練習　Weak spots (n)` deals only weak items, weakest
  first, `n = min(len, 2 × pool)`. Result: `苦手 Weak spots` chips (top 10 with ×count) + "Saved. They come first in a
  weak-spot round, and leave the list after three clean answers in a row."; `卒業 Off the weak list` chips with the
  済 icon + "3回つづけてノーミス　Three clean in a row took these off your weak spots." (`苦手ゼロ！` when none left).
- **The teacher's stamp** (hanko) by the share of clean cards: ≥ 0.8 → `たいへん<br>よく<br>できました`
  (aria "Stamp: excellent"), ≥ 0.6 → `よく<br>できました` ("Stamp: well done"), else `がんばり<br>ましょう`
  ("Stamp: keep at it"). The thump sound lands as the hanko touches (452 ms; never over a word's voice).
- **A stage's はなまる**: tier 0 in a counted round adds today's date to `seal[stageKey]` (at most one a day);
  3 dates = はなまる (ring drawn round the hanko, gold tag "はなまる！"). Copy: `はなまるまで 1/3　One of three rings
  towards this stage's はなまる: a ring comes with たいへんよくできました, one a day.` / `今日の分は済　Today's ring for
  this stage is in (1 of 3). The next one comes on another day.` / "Rings towards a stage's はなまる are not given with
  hints always on, or in weak-spot rounds." A top round offers `次のステージ　Next: <stage>` (not for course weeks,
  which "follow the app's own plan instead"). Rings show on the stage tiles (`.rings`, or the はなまる icon at 3).
- **Stamp card**: practice seconds accrue while `time − lastKey(or lastVoice) < 8 s`; credited at round end, on Quit
  and when the page is hidden; once today's seconds ≥ goal × 60 (goal 3, 5 or 10 min) today is stamped (once); 7
  stamps → `done++`, a new card. Copy: `スタンプカード　STAMP CARD · 3 / 7`, "**2:41** / 5:00　今日の練習　Typed today",
  `あと 2:19 で今日のスタンプ　2:19 more typing for today's stamp.`, `休んでも消えません　Days off never erase a stamp.`,
  `今日の分、済！　Today's stamp is in. See you tomorrow.`, `スタンプカード完成！　Card complete: seven days of practice.
  A new card starts next time.`, gold tag `完成 2枚　2 cards done`. Lowering the goal can stamp today at once; raising it
  never takes a stamp away.
- **Best**: Typing keeps right keys a minute per stage (`自己ベスト 85 keys/min`); Speaking keeps the best share of
  clean cards `{ clean, total }`. Only rounds without hints "always" and not weak-only count.

### 1.8 Screen reader and motion conventions

- The round's picture is `<canvas aria-hidden="true">`; what matters is said in one `<p id="sr-prompt" class="sr-only"
  aria-live="polite">` placed **outside** `#app` "so it is never hidden or inert while it speaks". Each card is said
  once, at most one every 2 s (a card that comes sooner is said when the 2 s are up), with "Weak spot." and the run step
  riding along; each fall with its answer and "Back after 2 cards"; the result in one sentence ("Round over. 17 of 20
  cards clean. Stamp: excellent. Longest clean run 9, a new record. 2 comebacks. …"). Japanese parts are wrapped in
  `<span lang="ja">` so they are read in a Japanese voice (`jaMarked()` marks kana/kanji runs inside English).
- `#status` (`role="status" aria-live="polite"`) carries miss notes; `#app.inert` while a sheet is open; focus goes to
  `#resume` on pause and to `#res-title` (`tabindex="-1"`) on the result.
- Reduced motion: no tricks, parallax or particles; cleared cards simply settle; a scene is one fixed frame; the round
  "cuts" instead of dashing to the next card. None of it changes the clean count, the pace, the bests or the weak spots.

---

## 2. Yaoki Reader (よむ)

### 2.1 Purpose and stance

"Read Japanese with the furigana hidden. Touch a phrase and hold it to see its reading, the meaning of each word and any
grammar pattern in it; let go and it hides again." Texts are pasted (≤ 30,000 characters), added from Aozora Bunko, or
from the Yaoki Library (works written for Yaoki), and analysed in the browser ("nothing is sent anywhere"). It is the
companion to the course: extensive reading (多読) with just-in-time help, and **no whole-sentence translation ever**.

### 2.2 The Reader canvas (`artifact-files/7ec88b87…/project/`) — the design to copy

`canvas.json`: title "Yaoki Reader: hold to reveal", `launch {view: canvas}`, note `t1` at (0, −300) "Reader: hold a
phrase to see its reading and meaning" `kind title1`, `maxW 1330`. Boards (all `w 390 h 844 radius 44
is_interactive true`, y 0): `Main.dc.html` x 0 "1 · Reader at rest (play this one)", `Held.dc.html` x 470
"2 · While holding a phrase", `Settings.dc.html` x 940 "3 · What a hold shows" (80 px between frames).

Every file's `<helmet>`: the fonts link `M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600`, and
```css
body{margin:0} button{font:inherit;color:inherit;cursor:pointer}
.yk-nosel{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:none}
```

**Moment boards** (`Held`, `Settings`): `<title>Reader, holding a phrase</title>` / `Reader, what a hold shows`;
root `<div style="width:390px;height:844px;overflow:hidden;background:#F4F5F9">` holding
`<dc-import name="Main" demo="6" hint-size="390px,844px">` / `<dc-import name="Main" view="settings" …>`; their logic
class returns `{}`. Comment: "the reader component at the moment a finger is holding the phrase 試験に合格したら; the
grey disc marks the finger".

**`Main.dc.html` "1 · Reader at rest"** (`<title>Reader, hold to reveal</title>`, `data-props
{"demo":{"editor":null},"view":{"editor":null},"$preview":{"width":390,"height":844}}`).

Purpose in the journey: the reading habit between lessons; shows how help stays hidden until asked for.

Layout, top to bottom (root: `position:relative; 390×844; box-sizing:border-box; padding:50px 16px 34px;
background:#F4F5F9; color:#1B2440; font-family:'M PLUS Rounded 1c','Hiragino Maru Gothic ProN',sans-serif;
line-break:strict; display:flex; flex-direction:column; overflow:hidden`):
1. **Header row** (flex, gap 10, height 44): close button 44×44, `margin-left:-10px`, no border, X icon 22 px stroke
   `#1B2440` 2.6, `aria-label="Close reader"` (**no handler**); title `よむ` 15px/800 + ` Reader` 12px/700 `#5A6382`
   (flex-grow 1); hint button (height 44, transparent, `aria-label="Hint settings"`, `onClick openSheet`) holding a pill
   span: height 32, padding 0 12, radius 16, white, 2px `#1B2440`, 13px/800, gap 6, slider icon 15 px stroke `#2F4FD0`
   2.6 + `ヒント`.
2. **Tag row** (margin-top 4, height 24, gap 8): tag `多読 · N3` (padding 3px 10px, radius 10, bg `#E8ECFB`, color
   `#2F4FD0`, 12px/800) + "Reading with the furigana hidden" 12px/700 `#5A6382`.
3. **Title** `<h1>` margin-top 6, 19px/800, line-height 26: `<span lang="ja">片目のだるま</span>` + " The one-eyed
   daruma" 12px/700 muted.
4. **How-to row** (margin-top 4, height 18, gap 6, 12px/700): target icon 16 px (circle r 9 stroke `#C7361E` 2.4 +
   filled circle r 3.5 `#C7361E`), `長押しで読み方と意味` + "Hold a phrase to peek" muted.
5. **The text box** (`class="yk-nosel" data-yk-box lang="ja"`, margin-top 10, padding 10px 14px, radius 20, white,
   2px `#1B2440`, font `'Klee One','Hiragino Mincho ProN',serif` 18px/600, **line-height 42px**; pointer handlers
   `onPointerMove move`, `onPointerUp/Cancel/Leave up`, `onContextMenu noMenu`): an `<sc-for items>` of phrases, each
   `<span style="white-space:nowrap"><button data-yk-i onPointerDown onFocus onBlur>` + trailing punctuation. Phrase
   button: `appearance:none; display:inline-block; padding:0 1px; border:0; border-bottom:{{c.line}};
   border-radius:6px 6px 0 0; background:{{c.bg}}; white-space:nowrap; outline-offset:1px`. Ruby segments
   `<ruby>{{g.t}}<rt style="font-size:9px;font-weight:400;color:#5A6382;visibility:{{g.vis}}">` (hidden unless held
   and ふりがな is on). States: rest `2px solid transparent` underline; **seen** `2px dotted #2F4FD0`; **held**
   bg `#FFE9B0` + `2px solid #1B2440`.
6. **The lens** (`<sc-if lensOn>`, `aria-live="polite"`): `position:absolute; left:-2px; right:-2px;
   bottom: calc(100% - (pos.y - 6)px)` (its bottom 6 px above the held phrase's top, i.e. it floats above the finger),
   z 5, `pointer-events:none`, padding 8px 14px 12px, radius 18, white, 2px `#1B2440`, `box-shadow:0 4px 0 #1B2440`,
   column gap 8. Words row: wrap, gap 2px 14px; each word a column: the word 26px/600 line-height 46 (ruby 11 px),
   colour `#1B2440`, or `#5A6382` for a particle (a word with no gloss); under it (switch 語の意味) `lang="en"` M PLUS
   12px/700 line-height 15, `max-width:170px`, centred, `min-height:15px` (a particle shows a space). Grammar row
   (switch 文法メモ, only when the phrase has a pattern): bg `#E8ECFB`, radius 10, padding 5px 10px, line-height 22,
   gap 8: `文法` 11px/800 `#2F4FD0`, the pattern 15px/600 (e.g. `〜たら`), its English 12px/700 line-height 16.
7. **The finger disc** (designed moment only, until the first real touch): `aria-hidden`, 58×58 circle at
   `(pos.x + pos.w/2 − 29, pos.y + 8)`, fill `rgba(27,36,64,0.16)`, 2px `rgba(27,36,64,0.5)`, z 6.
8. **Looked-up header** (margin-top 12, baseline row): `のぞいた語句` 13px/800 + " Looked up" 12/700 muted … count
   `{{seenCount}}` 13px/800 + ` / {{total}}` 11px/700 muted (total 26).
9. **Looked-up body**: none seen → dashed note (margin-top 8, padding 10px 14px, radius 14, 2px dashed `#C9D0E3`,
   12px/700 line-height 1.45 muted) "Nothing yet. Each phrase you look up is listed here and gets a dotted underline in
   the text."; some seen → chips (margin-top 8, `max-height:74px; overflow:hidden`, wrap gap 6), newest first, one
   per dictionary form: height 34, padding 0 10, radius 12, white, 2px `#DDE1EC`; Klee 15/600 base form + 11px/700
   muted reading (e.g. `合格 ごうかく`).
10. **The hint sheet** (`<sc-if sheet>`): scrim `<button aria-label="Close hint settings" onClick closeSheet>`
    390×844, z 20, `rgba(27,36,64,0.45)`; panel absolute bottom, z 21, padding 18px 16px 34px, radius 26 26 0 0,
    border-top 2px `#1B2440`, bg `#F4F5F9`, gap 10: `<h2>` 18px/800 `長押しで出すもの` + " What a hold shows" 13/700
    muted; three `<button role="switch" aria-checked>` rows (min-height 68, padding 10px 14px, radius 16, white, 2px
    ink, gap 12): `ふりがな Furigana` "Readings above the kanji, in the text and in the card."; `語の意味 Word meanings`
    "English under each word. Particles are left untranslated."; `文法メモ Grammar note` "The pattern inside the phrase,
    such as 〜ながら." (name 15/800, English 12/700 muted, description 12/500 line-height 1.4; knob 52×30 radius 15 2px
    ink, track `#2F4FD0`/`#DDE1EC`, thumb 20×20 white 2px ink, `justify-content: flex-end/flex-start`); note box bg
    `#FFF4D6`, radius 16, padding 10px 14px, 12/500 line-height 1.45: `<b>文の訳は出ません。</b> A hold never shows a
    whole-sentence translation. You get the pieces and put the sentence together yourself.`; close button height 54,
    margin-top 4, radius 16, 2px ink, bg `#2F4FD0`, white, `0 4px 0 #1B2440`, 17px/800 `とじる Close`.

State `{ held, pos, touched, seen, sheet, furi, mean, gram }`. Interactions: pointer-down on a phrase holds it
(measures `offsetLeft/Top/Width/Height`, adds it to `seen`); sliding moves the hold to the phrase under the finger
(`document.elementFromPoint` → `closest('[data-yk-i]')`); up/cancel/leave releases; keyboard focus holds, blur
releases (only when no pointer is down); the hint pill opens the sheet and drops the hold; each switch flips its key.
Nothing is saved (canvas only).

Designed moments: **Main** at rest (nothing held, `seen []`, dashed note, `0 / 26`); **Held** `demo=6` → phrase 7
`試験に合格したら、` held with lens 試験(しけん) exam · に (grey) · 合格(ごうかく)したら pass + `文法 〜たら when, once it
happens`, finger disc on it, `seen [1, 15, 6]` → chips 合格 ごうかく · 辞書 じしょ · 棚 たな, `3 / 26`; **Settings**
`view="settings"` → sheet open over the text at rest, all switches on. The demo's position is measured after layout,
again at 300 ms and 1,200 ms, and when `document.fonts.ready` resolves ("measured after layout, and again once the fonts
are in"); it clears on the first real touch.

The sample data (`renderVals()`): 26 phrases of the text 祖母の家の棚に、片目だけ黒いだるまが置いてある。…
少しずつ読めるようになってきた。, each `{ words: [w(segs, en)], g: [pattern, en], dict: [base, reading], tail }`;
`w()` with no English = particle. Patterns used: 〜てある, 〜たら, 〜のだ, 〜ながら, 〜ずに, 〜ている, 〜ようにしたら,
〜ようになってきた.

### 2.3 The real page (`docs/reader/index.html`): views and sheets

One column `#app { height:100%; max-width:640px; margin:0 auto }`; views are `<section class="view">` shown one at a time
by `show(view)` (`lib | add | aoz | ykl | read`; switching releases any hold). Each view: `.bar` header + `.scroll`
(`padding 4px 16px 28px`, gap 14).

| View | Header | Contents and states | Navigates |
|---|---|---|---|
| **Library** `#v-lib` | brand `よむ <small>Yaoki Reader</small>`; pill `ヒント` (`aria-label="Hint settings"`) | intro hint "Read Japanese with the furigana hidden. Touch a phrase to see its reading and meaning; let go and it hides again."; `.btn` `文を追加　Add a text` (plus icon); `.btn.quiet` `青空文庫から　From Aozora Bunko` (book icon); `.btn.quiet` `ヤオキ文庫から　Yaoki Library` (shelf icon); the text list (newest first, the built-in sample last with a `Sample` tag): `.text-card` button (padding 12px 14px, radius 18, 2px outline, `0 3px 0 var(--hard)`; title Japanese face 18/600 ellipsis; author 13/700; first 60 characters 14 muted; meta 12/700 "1,234 characters · looked up 12 of 340 phrases"), a trash `icon-btn` `aria-label="Delete <title>"` → inline confirm (2px dashed `--stamp` box): "Delete “title” and its looked-up list?" `Delete` (`.mini.danger`) / `Keep`; state line (pending "Looking for your saved texts." / local "Your texts are saved in this browser only. To read them on another device, save a backup here and load it there." / db "Your texts are saved with this page, so they are here on any device where you open it."); `Save a backup` / `Load a backup` (`.mini`, min-height 40, radius 12); links `Dictionary credits and limits` (sheet), `Yaoki app` (`../`) | add, Aozora, Yaoki Library, reader, sheets |
| **Add** `#v-add` | back `aria-label="Back to your texts"`; `文を追加 <small>Add a text</small>` 17 px | `<form novalidate>`: `<label for>` "Title (optional)" input maxlength 60; "Japanese text" textarea (min-height 220, Japanese face, line-height 1.8, placeholder `ここに文章を貼り付けてください。`), foot "Paste or type. Line breaks are kept." + counter `0 / 30,000` (turns `--stamp` over the limit); problem box `role="alert"` ("Paste some Japanese text first." / "This is 31,200 characters. The limit is 30,000, so add it in parts, such as one chapter at a time." / "This does not look like Japanese text." / "The dictionary did not load (…). Check your connection and press Read it again."); progress (12 px track + `role="status"` "Loading the dictionary: part 3 of 9. It is about 30 MB the first time." / "Reading your text."); submit `読む　Read it`; hint "Readings and meanings are added automatically on your device. They are sometimes wrong, mostly for names and words with more than one reading."; link "Or find a story or novel on Aozora Bunko". Title defaults to the first 16 characters | reader (on success), Aozora, back |
| **Aozora** `#v-aoz` | back; `青空文庫 <small>Aozora Bunko</small>` | search form `role="search"`, input placeholder `蜘蛛の糸、宮沢賢治、soseki`, debounced 200 ms; checkbox `Modern spelling only 新字新仮名` (22×22, accent-color); results as `.text-card`s (title + kind tag "Old spelling"; author); empty query → "Short works to start with" picks; counts "The first N of M works. Type more to narrow it down." / "N works."; file loader notebox; a work page (title 24 px, author, link "Its page on Aozora Bunko", old-spelling warning, "Fetching the text.", parts list) | work page, back |
| **Yaoki Library** `#v-ykl` | back; `ヤオキ文庫 <small>Yaoki Library</small>` | intro "Original works written for Yaoki, to read with the furigana hidden. New works are added here as they are written. The level is a rough guide to the vocabulary and kanji; with this reader you can try a work above your level."; works as cards (title + `JLPT N5` tag, author, `about`); a work page: title with reading (`work-h` 24/600 + `small` 15 muted), author, level tag, about, then the **parts list** (`ul.parts`, rows with `Part 2 of 8 · 8,816 characters` 13/800 + first line 14 muted; per-part `.mini` button `Add` / `Add and read` / `Read` (done style: accent-soft, accent-ink) / `Update` / `Update and read`), an add-all `.btn` (`Add all 8 parts` / `Add the other 3 parts` / `Update the 2 earlier parts` / `Add 3 parts, update 2` / `All parts are in your library`), a "Revised." notebox for earlier editions | reader, library |
| **Reader** `#v-read` | back `aria-label="Back to your texts"`; the text's title (Japanese face 17/600, ellipsis); pill `ヒント` | update notebox (`role="status"`: "**Revised.** This part has a new edition in the Yaoki Library. Update puts the new text here; its looked-up list starts over." + `Update`; or "**Earlier edition.** The new text of this part is already in your library as another copy, so you can delete this one."); `#passage lang="ja"`; while preparing a `.wait` box (`--note`, radius 16) "Preparing this text. The dictionary loads once per visit." + track; error "This text could not be prepared (…). Check your connection, go back and open it again."; **foot** (`border-top 2px var(--line)`, padding 8px 16px): `のぞいた語句 <small>Looked up</small>` 13/800, count `12 <small>/ 340</small>` 15/800, pill `一覧 List` | sheets, back |

Sheets (all `role="dialog" aria-labelledby`, one scrim `aria-label="Close"`; Escape closes; focus moves to the sheet's
first button and back to the opener on close):
- **Hints** `触れたときに出すもの <small>What a touch shows</small>`: the three switches (as on the canvas); `文字の大きさ
  Text size` seg of three `あ` buttons at 15/19/23 px (`aria-label` "Small/Medium/Large text"; sets `--read` to
  17/19/22 px); `書体 Typeface` seg: `明朝 Print` (Noto Serif JP) / `教科書体 Textbook` (Klee One), each with a 30 px 令
  sample, hint "Print matches books and documents. Textbook draws kanji the way you write them by hand, so a few look
  different, such as the 令 above."; the no-translation notebox ("A touch never shows…"); `とじる　Close`.
- **List** `のぞいた語句 <small>Looked up in this text</small>`: one row per base form, newest first (base form 18/600,
  reading 12/700 muted, gloss 13 on its own line; "No dictionary entry found."); empty "Nothing yet. Touch a phrase in
  the text and its main word is listed here."; `Clear this list` (quiet); `とじる　Close`.
- **Credits** "Dictionary credits and limits": JMdict, kuromoji/IPADIC, typefaces, **Limits** ("Everything is worked out
  by rule on your device, with no person checking it. … Grammar notes cover about ninety common patterns."), Aozora,
  Yaoki Library, "Your texts. … Only add text you are free to keep a copy of.", `licenses.txt`.

### 2.4 Hold to reveal (the real page's mechanics)

- Passage: Japanese face, `font-size: var(--read)` (19 px default), weight 500 (600 textbook), **line-height 2.2**,
  `line-break: strict`, `user-select: none`, `-webkit-touch-callout: none`, **`touch-action: pan-y`** (vertical scroll
  still works). Each phrase is a `<button class="ph" type="button" data-i>` inside a nowrap span with its lead and
  trailing punctuation; ruby `rt` absolutely placed above the base (`bottom: 100%`, 0.5 em, hidden until `.on`).
- Touch: `touchstart` on a phrase starts a **120 ms** timer ("a short wait, so a swipe still scrolls the text"); moving
  > 8 px before it fires cancels; once holding, `touchmove` (non-passive, `preventDefault`) slides the reveal to the
  phrase under the finger; `touchend` releases; a **quick tap** shows the phrase for **1,800 ms**; two fingers release.
  `contextmenu` is prevented. Mouse: press reveals, drag slides, mouseup releases (ignored within 900 ms of a touch).
  Keyboard: Tab to a phrase (`:focus-visible`) reveals it; focus leaving releases. Scrolling releases.
- Lens `#lens` (`position: fixed; z-index: 30; width: min(560px, calc(100% − 20px))`, centred, padding 8px 14px 12px,
  radius 18, 2px outline, `0 4px 0 var(--hard)`, `pointer-events: none`, `aria-live="polite"`): placed **10 px above**
  the phrase; if that would go under the bar (`read-scroll` top − 44 px), it flips **16 px below**. Rows: words
  (`.lw` gap 10px 14px; `.lj` 26 px line-height 46, rt 11 px; function words muted; `.le` gloss 12/700 line-height 15
  max-width 180 `text-wrap: balance`), grammar rows `.lg` (`文法` tag 11/800 accent-ink, pattern 15/600, English 12/700),
  story notes `.ln` (`--note` bg, `注` tag 11/800 muted, text 12/600). Switches hide rt (`body.no-furi`), glosses and
  notes (`body.no-mean`) or grammar (`body.no-gram`).
- Looked up: the first reveal of a phrase pushes its index to `seen`, adds the dotted underline (`.ph.seen
  { border-bottom: 2px dotted var(--accent-ink) }`), updates the count and saves after 1.5 s (and on back and
  `pagehide`). A re-analysis that changes the number of phrases resets the list with a toast ("The readings for this text
  were improved, and its phrases changed, so its looked-up list starts over.").

### 2.5 Data: the analysis, the overrides, the library

- **Engine API** (`docs/reader/engine/analyzer.js`, `VERSION = 5`): `YomuEngine.create(tokenizer, jmdictLines)` →
  `engine.analyze(text, overrides)` → `{ v, paras }`; also `YomuEngine.furi(surface, reading)` (furigana only over the
  kanji runs). Runs in a worker (`worker.js`, `boot.js`) or on the page or in Node. About 36 MB of dictionary the first
  time a text is analysed in a visit.
- **Shape**: `paras` = array of paragraphs; an empty array = a blank line (`p.gap`); a paragraph = chunks; a chunk =
  `{ w: [word], h?: lead punctuation (「『), t?: trailing (、。」), g?: [[pattern, gloss]], d?: [base, reading, gloss]
  (the looked-up list's entry), n?: [story notes] }` or `{ x: plain text }`; a word = `{ s: [[text, ruby]], e?: gloss,
  k?: key (base form the overrides use), f?: 1 (function word: grey, untranslated) }`. Prebuilt files add `pre: 1`,
  `rev: "74bbf7bdc990"`. Real example (目川日記 N5-1):
  ```json
  {"w":[{"s":[["かた",""],["目","め"]],"e":"one-eyed; one eye (of two)","k":"かた目"},{"s":[["です",""]],"f":1}],
   "t":"。","g":[["〜は〜です","A は B です: A is B."]],"d":["かた目","かため","one-eyed; one eye (of two)"],
   "n":["かた目 (片目): one eye. Only one of the daruma's eyes is painted."]}
  ```
- **Overrides** (a part's `glosses` file, all optional): `gl {key: gloss}`, `glx {'key#n': gloss}` (one occurrence),
  `rd {key: reading | [per kanji run]}`, `rdx`, `sf {surface: reading}`, `bf {key: [base, reading]}` (what the list
  shows), `bfx`. "The dictionary's first sense is often the wrong one (渡す is 'to ferry across' before it is 'to hand
  over')."
- **Grammar notes**: about 90 patterns `P(name, en, seq)` matched over token sequences (`〜ている is doing; ongoing
  state`, `〜たら when; if; once`, `〜ながら while doing`, `〜ずに without doing`, `〜ようになる come to; reach the
  point where`, …). One English line each, short.
- **Catalog** `docs/reader/library/catalog.json`: `{ about, works: [{ id, title, reading, level, added, about, by?,
  parts: [{ title?, file, glosses?, analysis? }] }] }`, newest first. Rules: ≤ 30,000 characters per part, plain UTF-8,
  no ruby; a part with its own `analysis` opens without the dictionary and the reader checks that the analysis shows
  exactly the part's text (else falls back); `rev` changes when the file does; a new edition keeps file names, shows
  `Update`, and resets the looked-up list. Works: **目川日記** N5 "はじめての春" (8), N4 "夏" (10), N3 (12), N2 (12),
  each chapter a part with its analysis; **始末書** N1 (3 parts, glosses files).
- **目川日記** (N5-1 opens "これは　わたしの　ノートです。日本語の　ノートです。"): N5 text is spaced between phrases
  (`　`), kana-heavy, with the learner's own notes ("『かた』は　『人』ですか。") and a "今日の日本語：" list at the end.
  "Ana, a designer from Paraguay with a Japanese grandmother, arrives in the small mountain town of Mekawa with her
  grandmother's one-eyed daruma … Ana's notebook is in the Japanese she has, and it grows chapter by chapter."

### 2.6 Saving and keys

`localStorage` `yomu.settings` (`{ furi, mean, gram, size: 0|1|2, face: 'print'|'hand' }`), `yomu.texts` (array of
`{ id, title, by, text, created, seen: [phrase indices], n: phrase count, av: analysis version, ov?, src?: analysis
file, part?: text file }`), `yomu.sample.seen`; IndexedDB `yomu-reader` store `an` (analysis by text id, kept in memory
too). As a Claude artifact it uses `window.claude.use('db')`, collection `texts` (`orderBy('created','desc').limit(200)`).
Backup file `yaoki-reader-backup-YYYY-MM-DD.json` = `{ app: 'yaoki-reader', version: 1, exported, texts }`; loading
skips texts already present; toasts "Saved 3 texts to a file. Load it on another device to read them there." /
"Loaded 2 texts. 1 was already here." / "That is not a Yaoki Reader backup."

### 2.7 Accessibility

Real buttons for every phrase (Tab reaches each), `aria-live="polite"` lens, icon buttons with `aria-label`s ("Back to
your texts", "Delete <title>", "Hint settings", "Close"), `role="switch" aria-checked` toggles, `aria-pressed` segments,
`role="alert"` problems, `role="status"` progress, `lang="ja"` on every Japanese span (the root is `lang="en"`), focus
returned to the opener when a sheet closes, Escape closes sheets, 44 px targets, reduced-motion rule for the progress
transition and press transforms.

### 2.8 Clever bits worth keeping

The 120 ms hold delay that keeps scrolling; slide-to-scan; the tap-peek; the lens that floats above the finger and flips
below; the **dotted underline as a reading trail** and the "n / N" count; the list keyed by base form; the no-translation
promise stated in the settings sheet; the canvas's **demo prop + finger disc** to stage a gesture on a static board;
prebuilt analyses for library texts; per-occurrence overrides for literary senses; editions that never silently change a
reader's copy.

---

## 3. Yaoki Typing (タイピング)

### 3.1 Purpose and platform

"A typing game for a computer with a Japanese (JIS) keyboard, in the app's look: cards come along Yaoki's route, and
typing a card stamps it 済." Desktop only: on a touch screen (until a key is pressed) or a window narrower than 700 px
the menu shows `パソコンとキーボードでどうぞ` "Yaoki Typing is made for a computer with a keyboard, in a window at least
700 pixels wide. On a phone or tablet, Yaoki Speaking has you say the words out loud instead." No phone layout.
`#app { max-width: 1040px; padding: 0 16px 28px }`.

### 3.2 Screens (views of one page)

**Menu** `#menu` (`aria-labelledby="menu-title"`, flex column gap 18):
1. Bar: brand `タイピング <small>Yaoki Typing</small>`; pill `設定` (`aria-haspopup="dialog"`).
2. Hero (gap 14): the 64 px daruma; kicker `タイピング　TYPING · JIS KEYBOARD`; `<h1 class="jp" lang="ja">`
   七転び八起き with ruby ななころ/やお (Klee 30/600, line-height 1.5); lede 14 muted "Fall down seven times, get up eight
   (八起き, yaoki). Type what is on each card before it reaches Yaoki. If one gets to him, he falls over, gets up again,
   and the card comes back later in the round."
3. Device note / layout note (`JIS配列用` "This practice follows a Japanese (JIS) keyboard. Your keyboard is set to
   another layout, … A card for a key you do not have waits in front of Yaoki; Tab skips it."), read with
   `navigator.keyboard.getLayoutMap()`.
4. Stamp card (`.card.daycard`, `role="group"`).
5. `入力方法　Input method` seg: `ローマ字 Romaji` / `記号 Symbol keys` / `かな入力 Kana input` + description; picking one
   returns to the stage last picked with it.
6. `ステージ　Stage`: groups with `<h3>` (`かな　Kana, words and phrases`, `語彙　Course words`, `漢字　Kanji
   (advanced)`), option tiles with counts, best and rings.
7. Course pick (when a course group is picked): `レベル　Level` seg N5 N4 N3 N2; `週　Week` option tiles (kick `第3週 ·
   Week 3 of 8`, the week's Japanese and English names, "40 words · 自己ベスト …", tag `今　NOW`, rings); note.
8. `ラウンド　Cards per round` tiles: `10枚 かるく Light`, `20枚 ふつう Regular` (default), `40枚 しっかり Solid`.
9. Actions: `はじめる　Start <kbd>Enter</kbd>` (disabled until the stage's items are ready), `苦手を練習　Weak spots (n)`
   (hidden with no weak items).
10. `はじめる前に　Before you play` notebox (keyboard layout, 英数 direct input, nn/wo rules, Esc/Backspace/Tab, the
    rewards, the tricks). Footer links.

**Round** `#play` (`aria-label="Round"`; `body.playing` hides the bar and footer):
- HUD (min-height 48, gap 8): pause/quit icon button `aria-label="Pause or quit (Esc)"`; progress segs
  (`role="img"`); run chip (はなまる icon + count, `title="連続　Clean cards in a row"`, sr "clean in a row"); falls chip
  (tipped daruma + count, `title="ころんだ　Falls"`); timer chip.
- Stage: `.stage-wrap` (height `clamp(204px, calc(100svh − 392px − var(--info-extra, 0px)), 360px)`, radius 20, 2px
  outline, ground bg; without the keyboard `clamp(204px, calc(100svh − 202px …), 400px)`) with `<canvas aria-hidden>`.
- `#info` (17/700 muted; word + reading in Klee 21/600 ink; gloss), `#status` (17/800; `.bad` red, `.warn` stamp),
  the on-screen JIS keyboard `#kb` (`aria-hidden`), `#next-line` (`次　NEXT · Shift + A` + finger
  `左手の小指　Left little finger`).

**Result** `#result` (`aria-labelledby="res-title"`, gap 16, max-width 640): kicker `結果　RESULT · <stage>`; `<h1
id="res-title" tabindex="-1" lang="ja">ラウンドおわり`; top row: `ノーミス　Clean cards` + big `17 / 20` (56/800) +
line "3:12 · 84 right keys a minute · 1 skipped" | hanko; stats card rows: `正しく打ったキー right keys, of all the keys
pressed` (`412 / 430`), `連続ノーミス longest run of clean cards in a row` (+ `記録更新 New record` or "· stage record
9"), `ころんだ falls` with variants ("falls: Yaoki stayed up all round", "falls; each card came back and was cleared",
…) and the 起 line, `ヒント hints shown when stuck` (or "—" "hints were on for every card"), `苦手カード cards with one
of your weak spots (gold corner), typed clean` (`2 / 4`); best line (`自己ベスト！` gold tag "New best on this stage: 84
right keys a minute."); seal line + next-stage button; 卒業 and 苦手 chip boxes; mini stamp card; actions `もう一度
Again <kbd>Enter</kbd>`, `苦手を練習　Weak spots`, `とじる　Close <kbd>Esc</kbd>`.

**Pause sheet** `一時停止 Paused`: "Nothing moves while this is open. If you quit, the misses so far stay in your weak
spots, and the round does not count for your best (自己ベスト). Your typing time so far still counts towards today's
stamp."; `つづける　Continue`, `設定　Settings`, `中止する　Quit the round` (danger). A hidden page pauses the round.

**Settings sheet** `設定 Settings`: `ヒント　Romaji and key hints` seg `いつも Always / 困ったら When stuck / なし
Never` + "When stuck: the kana being typed shows after a miss, or after 5 seconds before the first key (3 seconds
between keys); a second miss, or as long again, shows the whole spelling. A card where a hint showed is not counted
clean, so it gets 済 without a はなまる."; switch `キーボード Show the keyboard under the game`; switch `音 Say each
course word when it is cleared`; `効果音　Sound effects` `なし Off / しずか Quiet / ぜんぶ All` (+ copy); `音楽　Music`
`なし Off / 小さめ Soft / あり On`; `1日の目標　Daily goal` tiles `3分 かるく Light / 5分 ふつう Regular / 10分 しっかり
Solid` + "Only typing counts: not pauses, and not more than 8 seconds without a key."; `とじる　Close`.

### 3.3 Input methods and stages (`engine.js`)

- **ローマ字 Romaji**: かな `KANA_STAGES` — 清音 Basic kana (46), 濁音・拗音 Voiced and combined (+ がっこう school …),
  カタカナ Katakana (+ loanwords), 単語 Words (40: ねこ=cat …), 文 Phrases (11 short sentences with Japanese
  punctuation); 語彙 Course words; 漢字 Kanji (advanced) `KANJI_STAGES` — 一字 Single kanji (59), 熟語 Compound words
  (50), 上級熟語 Harder compounds (41), 四字熟語 Four-character idioms (24), 漢字の文 Sentences with kanji (25), items
  `text:reading=gloss`.
- **記号 Symbol keys**: one key a card: シフトなし Unshifted, シフト Shift, 句読点・かっこ Japanese punctuation, ぜんぶ.
- **かな入力 Kana input** (by physical key): キー rows ホームの段 Home row (A), 上の段 Upper row (Q), 下の段 Lower row
  (Z), 数字の段 Number row, シフト Small kana and marks, ぜんぶ; 語彙; 漢字. A word is typed key by key: a voiced kana is
  its kana and then ゛ (or ゜); small kana, を and 、。・「」 take Shift (`kanaKeys()` returns `steps`, `ends`, `bases`
  so a half-typed が shows か).
- Stage keys keep paces/bests/rings apart: `romaji:basic`, `kanji:yoji`, `keys-kanji:yoji`, `course:N4u3`,
  `keys-course:N4u3`, `symbol:punct`, `keys:home`.

### 3.4 Spelling rules (the part to mirror for Guarani)

- "A spelling is taken when Microsoft IME or Google 日本語入力 would turn it into the kana … The hint is always a
  spelling both accept. One rule is the game's own: ん at the end of a card takes `nn`, as there is no Enter to settle
  a lone n." Each kana lists its spellings, hint first (`'し': ['shi','si','ci']`); combined kana have joined
  spellings plus the spelled-out ones; っ doubles the next consonant actually typed; ん before a vowel/y/n takes `nn`.
- Matching is a prefix walk over tokens (`matchPrefix`, `isComplete`, `nextChars` for lighting keys, `spell` for the
  hint that continues from what was typed — "a player who typed 'sy' for しゃ is shown 'sya', not 'sha'").
- A refused key is blamed on the right kana (`blame()`), and a **named near miss** goes under the card
  (`NOTES`: `を = wo　(o is お)`, `ぢ = di　(ji is じ)`, `ん before a vowel, y or n = nn`, `ん at the end = nn`, …).
- Caps Lock or Shift: "Caps Lock or Shift is on. Romaji is typed in lower case." IME on: "英数にしてください。 Keys are
  not reaching the game: switch the input to 英数 (direct input)." (`e.isComposing || e.keyCode === 229 ||
  e.key === 'Process'`).

### 3.5 The round (mechanics, exact numbers)

- **World**: 240 logical units high, the route at y 168, cards 74 units high (radius 14), Yaoki at
  `view.yx = max(100, W − 1000)`; scale `s = clamp(ch/240, cw/520)` in [0.5, 1.6]. Graph paper 26-unit grid in `--grid`
  (32 % alpha over a scene); the route **traced red behind him** (5 px `--daruma`) and **dotted ahead** (`--line-strong`,
  dash [1, 12]) — "the app's map".
- **Cards**: the one being typed has a 3px outline and a 6-unit hard shadow ("stands up further"), the others 2px and 3;
  a fallen or flashing card is `--bad` 3px on `--bad-soft`. Word cards: reading on top (muted, at top+16) and the word
  (Klee 600, at top+44); the typed part turns `--good` by clipping; a hidden reading is a **dotted line of fixed length**
  ("its length the same for every card, so it tells nothing of the answer"). One-key cards: 32 px.
- Under the route (the band "stays a flat tint that keeps the text readable"): what was typed in green (20 px/800) and,
  with a hint, the rest of the spelling in grey; the newest letter pops ×1.3 for 0.12 s; after a fall `正解　answer` in
  red over the answer and `あとでもう一度　Back after 2 cards`; a waiting card `ゆっくりでいい　The world waits. Tab skips
  this card.`
- **Pacing**: per stage, moving averages (α 0.3) of reaction (shown → first right key, clamp 0.2–8 s) and keys a second
  (clamp 0.5–12); start values `romaji {r 1.0, p 1.6}`, `kanji {2.2, 1.6}`, `symbol {1.8, 1.6}`, `keys {2.5, 1.6}`,
  `kana {1.8, 1.2}`, `keys-kanji {2.5, 1.2}`. Round budget `T = clamp(1.4 × (rt + maxLen / min(p, 2)), 6, 40)` s; speed
  `max(12, run / T)`; spacing `max(prev.w + 30, speed × 1.15 × (rt + prev.len / p))`. A fall cuts `p × 0.8`.
- **Fall**: a live card past `yx + 26` knocks him over (fall length `min(3, 1.2 + 0.05 × len)` s; the world stops; rise
  halfway with よいしょ); it re-enters the queue **after two other cards** (more if more are on the route or another fallen
  card is due first), and the screen reader hears "Yaoki fell over and got up. It is <answer>. Back after 2 cards." A
  card that has fallen **twice** stops in front of him, its spelling shown, the world waits, `Tab` skips it.
- **Hints** (`hints` setting): 0 none → 1 the kana being typed (keys: row + finger) → 2 the whole spelling (keys: the
  key, lit). When stuck: a miss raises a level; 5 s before the first key, 3 s between keys (kanji 3.5 s) raise one.
  Always: level 2 from the start. Never: none, except after a fall. A kanji card's first hint shows its reading on the
  card and under the game and says it.
- **Finale**: the cleared cards still on the route hurry past him (≤ 4 s), then the result 0.8 s later.

### 3.6 Scenes, music, sound effects

- 12 scenes (`scenes.js`, cut-paper colours under faint graph paper; "moves with the route, changes over the round,
  follows the season of the real date, and turns to night in dark mode"): 下町 Old town, 竹林 Bamboo grove, 海 The sea,
  富士 Mt Fuji, 夜の街 Neon city, 田んぼ Rice terraces, 雪国 Snow country, 宇宙 Space, 海の中 Under the sea, 夏祭り Summer
  festival, 電車 Train line, 城下町 Castle town; `forStage(key)` maps each stage (course weeks go round in order); a
  finishing touch at the end (はなまる drawn round the sun or moon, "the station called やおき").
- Music (`music.js`, Web Audio, no files): a song per scene, chiptune with Japanese pentatonic scales; levels by run
  (run ≥ 10 → 3, ≥ 5 → 2, else 1); cues `step`, `fall`, `last`, `end`; ducks under a word's clip; 音楽 あり 0.6,
  小さめ 0.3, なし 0.
- SFX (`sfx.js`, yo scale D E G A B): `key` tick, `miss` knock (ぜんぶ only), `clear` stamp "pon" (rising with the
  streak), `streak`, `gold`, `fall` taiko "don", `up` bounce, `jump`, `spin`, `duck`, `smash`, `swish`, `result`.
  "No effect plays over a course word's own clip."

### 3.7 Settings and saved state (`yaoki.typing.v1`)

```js
{ mode: null, last: {}, stage: {}, level: null, unit: {}, hints: 'stuck', len: 20, kb: true, sound: true,
  best: {}, pace: {}, stats: {}, sfx: 'quiet', music: 'on', goal: 5, practice: null,
  stampCard: { days: [], done: 0, lastDay: null }, run: {}, seal: {} }
// best[stageKey] = keys/min; pace[stageKey] = { r, p }; stats[bucket][key] = { miss, ok } with buckets
// 'kana' (romaji + course: per kana; ん and っ on their own), 'kanji' (per word), 'symbol' (per key), 'keys' (per kana key, '+' = Shift);
// practice = { d: 'YYYY-MM-DD', s: seconds }; seal[stageKey] = ['YYYY-MM-DD', …]; run[stageKey] = longest clean run
```
Keys added later are sanitised so "an older save still loads". Storage refusal (private window) is caught.

### 3.8 Accessibility

`aria-label="Round"`; progress `role="img"`; chips with `title` + `sr-only` words; the sr-prompt line (§1.8);
`role="status"` miss notes; the keyboard picture and the canvas `aria-hidden`; Esc pauses; Enter starts/again; Tab skips
a waiting card; `aria-pressed` everywhere; a stamp-card `sr-only` sentence ("Stamp card: 3 of 7 days stamped. Today: 2
minutes 41 seconds of 5 minutes typed."); reduced motion honoured.

### 3.9 Clever bits

Accuracy-not-speed rewards; measured pacing; the comeback rule with a promise of how many cards later; a card that waits
"so every round ends"; hints as steps with timers; named near misses; the hidden-answer dotted line; per-stage records;
"days off never erase a stamp"; one ring a day; the screen-reader line throttle; music that follows the run; scenes that
follow the real season.

---

## 4. Yaoki Speaking (スピーキング)

### 4.1 Purpose and platform

"A game for a phone or tablet held upright, with no typing: each card carries a word, the player says it out loud, and
the phone's own speech recognition hears it." Two ways to play (遊び方): **ふってくる Falling** ("Things fall on Yaoki.
Say the word on each one before it lands on him.") and **のぼる Climb** ("Say the word on the ledge above, and Yaoki
jumps up to it. No hurry."). `#app { max-width: 640px; padding: env(top) 16px calc(28px + env(bottom)) }`.

### 4.2 Screens

**Menu** (gap 18; the start buttons in a **sticky bottom bar** `margin: 0 -16px; padding: 14px 16px calc(12px +
safe-bottom); background: linear-gradient(to top, var(--ground) 72%, transparent)` — "in reach of a thumb, as the menu
scrolls"):
1. Bar: `スピーキング <small>Yaoki Speaking</small>`, pill `設定`.
2. Hero: daruma with an **open mouth**; kicker `スピーキング　SPEAKING · SAY IT OUT LOUD`; h1 `声に出して` with ruby
   こえ/だ (Klee 28/600; 24 at ≤ 400 px); lede "Say it out loud. Each card carries a word; say it into your phone or
   tablet and Yaoki gets past it. If he doesn't, he falls over and gets up again (七転び八起き)."
3. `no-speech` pair (`このブラウザでは音声認識が使えません` "This browser cannot recognise speech. Open the page in
   **Safari** on an iPhone or iPad, or in **Chrome** on an Android phone or tablet."); desk note `スマホ・タブレット用　Made
   for a phone or tablet held upright. It works here too, with a microphone.`
4. `遊び方　How to play`: **two picture buttons** (`.ways` grid 1fr 1fr gap 10; `.way` radius 18, 2px line; pressed
   2.5px accent-ink + accent-soft + `0 3px 0 hard`; an inline SVG 120×70 of each — a ねこ rock falling on the daruma; a
   いぬ sign on a ledge with a dotted jump arc; `w-ja` 17/800, `w-en` 12/700 muted "**Falling.** Things fall on Yaoki…").
5. `練習　What to practise` seg: `あいうえお Learn kana`, `語彙 Course words`, `かな Kana`, `漢字 Kanji`, `あいさつ・文
   Phrases` + description.
6. Course pick (as Typing), stage tiles (grid minmax 150), or for あいうえお the **lesson tiles** (grouped `ひらがな
   Hiragana` / `カタカナ Katakana`; grid minmax 58 px gap 8; tile min-height 70 radius 14: the lesson's first kana Klee
   26/600, its romaji 12/800 muted ("ga…" for long ones), rings 8 px; sr "Lesson 3: sa shi su se so") and the **lesson
   chart** card: kicker `ひらがな 1　HIRAGANA · LESSON 1 OF 13 · best`; kana tiles (grid of 5, or 3 for や/わ/ゃ rows;
   min-height 76, radius 14, 2px outline, `0 3px 0 hard`; kana Klee 34/600, romaji 14/800 accent-ink; tap to hear, the
   tile turns accent-soft while it plays); the lesson note (`--note` box); `ことば　Words made of the kana so far` word
   tiles (Klee 22/600 + "*inu* · dog"); hint "Tap a kana or a word to hear it. In the round, each new kana is said for
   you first, with its sound in letters on the card: say it back. Then come the words and the kana again, to read
   without the letters (they show if you are stuck)." Single-sound stages add `ひとつの音　A sound on its own is the
   hardest thing for a phone to hear: say each one clearly, a little drawn out if need be. 単語 Words are easier for it.`
7. `ラウンド　Cards per round`: `5枚 ちょっと Short`, `10枚 ふつう Regular` (default), `20枚 しっかり Solid`.
8. **Mic test** card: kicker `マイクのテスト　TRY THE MICROPHONE`; quiet button (mic icon) `テスト　Test` ↔ `ストップ
   Stop`; output (`aria-live="polite"`) "Say こんにちは to check that your phone hears you." → `きいています…　Listening:
   say something, like こんにちは.` → `聞こえた　「こんにちは」　ばっちり！ The phone hears you well.` / "Nothing was heard.
   Check that the microphone is allowed, and speak a little louder." (8 s).
9. Stamp card; `はじめる前に` notebox (hold upright, Dictation on, the big button, hold to talk, "**🔊 きく** says the word
   for you to copy (it counts as a hint, but not on a lesson's new kana)", screen readers → hold to talk); sticky start
   bar `はじめる　Start` / `苦手を練習　Weak spots`.

**Round** (`body.playing`: the round fills the screen `100dvh`, the page cannot scroll):
- HUD floats over the top (`padding: calc(8px + safe-top) 12px 8px`, gap 6, `pointer-events` only on its children):
  round icon button (44 circle, 2px outline, card, `0 2px 0 hard`, `aria-label="Pause or quit"`); progress segs inside a
  white pill (padding 9px 10px, radius 16, 2px line, `0 2px 6px rgba(27,36,64,.12)`); run chip; falls chip; time chip.
- The world: `<canvas>` absolute, full screen.
- **Dock** over the foot: `padding: 6px 12px calc(6px + safe-bottom)`, `background: color-mix(in srgb, var(--card) 86%,
  transparent)`, `backdrop-filter: blur(10px)`, `border-top: 2px solid var(--outline)`, radius 24 24 0 0,
  `box-shadow: 0 -6px 20px rgba(27,36,64,0.14)`. Lines: `say-line` (min-height 20; romaji 15/800 accent-ink letter-spacing
  .02em when a hint shows; the gloss, or "A new kana: listen, then say it back."), `heard` (min-height 24:
  `聞こえた　「ねこです」　（ねこです）` — Klee 17/600, `.bad` red, `.good` green), `status` (13/800, two-line clamp:
  near-miss notes), then the **micbar** (grid `1fr auto 1fr`, gap 10): `きく` side button (min 64×56, radius 16, 2px line,
  11/800, speaker icon; `.playing` accent with a pulsing icon; `aria-label="Listen to the word (a hint)"`), the **mic**
  (84×84 circle, 3px outline, card, `0 4px 0 hard`; icon 34; label 10/800 `マイク` / `きいてる` / `押して話す` / `きいて`;
  `.on` accent bg with a ring `inset:-9px; 3px accent; yk-listen 1.6s infinite`; `.speech` ring 0.7 s and gold while
  the player speaks; `.held` pressed; `.warn` stamp colour; `aria-pressed`, `aria-label` "Listening. Tap to stop
  listening." / "Not listening. Tap to listen." / "… Hold to talk."), `スキップ` side button (`aria-label="Skip this card"`,
  disabled unless the card waits; `.ready` outline + shadow); `mic-state` line (12/800, `aria-live="polite"`):
  `きいています　Listening`, `じゅんび中　Starting to listen…`, `タップして話す　Tap the microphone to listen`, `よく聞いて
  Listen: the microphone is back on after the word`, `押して話す　Hold the microphone down while you speak`,
  `タップしてください　Listening stopped: tap the microphone to go on`, `マイクが使えません　The microphone is blocked …
  (Settings › General › Keyboard).`, `マイクがありません`, `オフライン　Speech recognition needs the internet: check the
  connection.`, `エラー`, `音声認識なし`.

**Result**: as Typing's, with `一回で言えた　Said right first time` (52 px), line "2:05 · 1 skipped · to the top";
rows 連続ノーミス, ころんだ ("times squashed" / Climb "slips back down the ledge; each time he got up again"), ヒント,
**`言えるまで` seconds on average from a card showing to its being said**, 苦手カード; plus **`聞こえたことば　What the
phone heard instead`**: the last six cards missed, `ねこ heard as 寝こ（ねこ）` rows (radius 14, 2px line; the heard text
red).

**Pause sheet** adds a reason notebox from the mic state (blocked, no mic, offline, stopped) — "the pause sheet says why
and what to do"; Continue tries again. **Upright overlay** `#upright` (fixed, full screen, a phone icon turning
`yk-turn 2.4s infinite`, pair `たてにしてください　Turn your phone upright to play.`) pauses the round when
`(orientation: landscape) and (max-height: 520px)`.

**Settings**: `マイク　Microphone` `ずっと聞く Hands-free` (default) / `押して話す Hold to talk` + copy; `ヒント　Readings
and romaji` (+ "When stuck: after a miss, or 6 seconds without a word, the reading and its romaji show; a second miss,
or 5 seconds more, says the word for you."); `音 Say each course word back when it is cleared`; 効果音 (ぜんぶ adds "a
knock when the phone heard another word"); 音楽 (default 小さめ; "It dips while you speak, so the phone hears you");
daily goal ("Only time speaking counts: not pauses, and not more than 8 seconds without a word.").

### 4.3 Modes, stages and the first steps

- `start` あいうえお Learn kana: 26 lessons (`lessons.js`), one per kana-table row (hiragana 13, katakana 13), each
  `{ kana: [...], marks?: ['っ'|'ー'], words: [{ text, kanji?, gloss }], note? }`; words only of kana taught so far
  (checked by a test); notes for what is new ("を sounds just like お; … ん is a sound of its own, like the n of 'sun'.",
  "Two small strokes ゛ make a sound voiced …", "A small っ is a short stop before the next sound: きって kit-te."). A
  lesson's round: its new kana first, in order, each **said for the player and shown with its letters** ("no hint"),
  to be said back; then, mixed, its words with meanings and its kana again without letters, plus up to 3 kana of earlier
  lessons, 10–25 cards. Lessons go round the four places.
- `course` 語彙 (as Typing; key `course:N5u3`, both ways to play together); `kana` かな: Typing's basic, voiced,
  katakana, words + **長い音・っ** 13 minimal pairs (26 cards; おばさん/おばあさん, きて/きって, さか/さっか,
  びよういん/びょういん, いえ/いいえ, ビル/ビール, じゆう/じゅう …; "neither of a pair is taken for the other");
  `kanji` 漢字 (Typing's five, reading hidden); `phrase` あいさつ・文: 25 greetings (with Hepburn romaji written out),
  Typing's sentences, 13 tongue twisters.

### 4.4 Falling and Climb

- **Falling**: things (by place) fall toward Yaoki at the bottom (ground 12 units above the dock); the lowest live thing
  in view is the target (gold frame); saying it breaks it (pop/spin/dodge/smash) and its 済 lands as a node; one that
  lands **squashes him** (1.7 s) and comes back after two cards; after two, it **stops on his umbrella** (red, gold
  ribs, stick down to him) with its reading shown; Skip passes it. Paced like Typing (`SLACK 1.2`, start paces `start
  {r 4.5, p 2}`, `course {2.6, 3}`, `kana {2.4, 3}`, `kanji {3.4, 3}`, `phrase {2.4, 3.5}` in beats a second; budget
  `T = clamp(1.35 × longest need, 5, 32)`). **Nothing falls before the phone has first listened.**
- **Climb**: one ledge per card (≥ 128 units apart), signs with the words, a summit above the last; the camera follows
  him up. A wrong word: he bumps his head (ゴン) and slips back (1.3 s); said after one slip → 起; said while he is still
  getting up or in the air → he jumps as soon as he can; after two slips or **20 s** on a sign the reading shows and Skip
  appears. No time counts as stuck before the phone has first listened.
- **Card layout** (`layoutCard`): size by length — ≤ 2 chars 34, ≤ 4 28, ≤ 7 24, ≤ 12 20, else 17 (down to 13 to fit 3
  lines); reading `clamp(round(size × 0.48), 11, 14)`; lesson letters `clamp(round(size × 0.5), 13, 18)`; pad 12; width
  ≥ 64 + 24, ≤ W − 12; room kept for a hidden reading "so it does not grow when it shows". Japanese wraps between any two
  characters but never before small kana/ー/closing punctuation nor after an opening bracket. The part heard so far turns
  green. Fallback plaque: radius 12; target gold frame 5px pulsing (`0.55 + 0.25 sin 4t`); hard shadow 5 (target) or 3 at
  30 % alpha; flash `--bad-soft` + `--bad`.

### 4.5 How what was heard is checked (`voice.js`) and listened for (`listen.js`)

- Recognition writes as a Japanese writer would (ねこ → 猫, に → 2), so each guess is read back into kana with
  `readings.js` (3,208 kanji, 1,758 single-kanji words, 10,967 whole words) and **compared by sound**: を=お, ぢ=じ,
  づ=ず, long vowels おう/おお/ー equal; everything else counts. A card of 1–2 kana must be all that was heard (with
  allowances: drawn out, said twice, です/でした after, えっと before); ≥ 3 kana may be inside what was heard but not
  inside a longer kanji word; long cards forgive 1 sound from 10 kana, 2 from 16. Near misses are named
  (`小さい「っ」 Small っ: a short stop before the next sound (kitte)`, `のばす音 A long sound: hold the vowel`,
  `みじかい音`, `大きい「や」`, `「が」（「か」ではなく）`, `「ん」 Say the ん`).
- What was heard is **used up** when a card clears (`consume()`), so the next card matches only what comes after; the
  game's own voice is never taken for the player's (`quiet(ms)` plus a 0.7 s echo margin); a pause mid-word waits for
  the rest (`CARRY 6000 ms`); a phone that repeats everything has the repeat cut off.
- Listening states `off | starting | on | tap | blocked | nomic | offline | error | unsupported`; hands-free restarts by
  itself with back-off; hold to talk listens while the button is held (pointer capture). Screen Wake Lock during a round.
  The first Start of a visit wakes the phone's voice silently (iPhone).

### 4.6 Hints and the model voice

Steps: 0 → 1 the reading and its Hepburn romaji → 2 **the word said for the player** (the app's clip for a course word,
else the device's Japanese voice at rate 0.8–0.85). When stuck: a miss, or 6 s, then 5 s more. `きく` says it any time
and counts as a hint (except on a lesson's new kana). Hands-free listening **pauses while the word is said** and resumes
after; nothing falls meanwhile and the time is not the player's. No Japanese voice (or none within 5 s the first time,
2.5 s after) → the reading and romaji instead, with "No Japanese voice on this phone, so the sound shows in letters." and
the chart says where a voice is added (Spoken Content on iPhone/iPad, Text-to-speech on Android).

### 4.7 Places (`world.js` + `places/*.js`)

Four woodblock-print places, each with falling things and a climb: 山 Mountain (rocks; rock ledges to the summit and its
flag), 団地 Apartment block (boxes, rubbish bags, flowerpots from windows; the fire ladder to the roof), 神社 Shrine
(hail; stone steps through torii to the bell), 森 Forest (acorns, pears, persimmons; branches to a nest with chicks).
"The word on each thing or sign on a pale label, and a gold frame round the one to say"; the label stays pale in both
themes. Sky follows the round, trees and weather the season, dark mode is night. Stages map to places (`OWN` table;
lessons go round `jinja, mori, yama, danchi`; course weeks by a hash of the key). Still parts are cached as pictures.

### 4.8 Settings and saved state (`yaoki.speaking.v1`)

```js
{ mode: null, stage: {}, level: null, unit: {}, style: 'fall', hints: 'stuck', len: 10, mic: 'free', sound: true,
  sfx: 'quiet', music: 'soft', goal: 5, best: {}, pace: {}, stats: {}, practice: null,
  stampCard: { days: [], done: 0, lastDay: null }, run: {}, seal: {} }
// best[key] = { clean, total }; stats[mode][card text] = { miss, ok }; style 'fall'|'climb'; len 5|10|20; mic 'free'|'hold'
```

### 4.9 Accessibility

As Typing, plus: "With a screen reader, hold to talk is the setting to choose: hands-free, the phone would hear the
screen reader read the card." Mic button `aria-pressed` and a sentence label; `mic-state` live; skip disabled until
useful; the pause sheet names the problem; the upright overlay; 44 px+ targets (mic 84, side buttons 64×56); reduced
motion keeps a static listening ring (`opacity .5; scale(1.08)`).

### 4.10 Clever bits

Nothing falls before the mic is ready; the game never hears itself; what was heard is used up per card; the heard line
shows what the phone thought; named near misses; "what the phone heard instead" on the result; the lesson rounds that
model each new sound first; the start bar in thumb reach; the dock over the game; the umbrella for a waiting card;
Climb's "no hurry" mode for a learner who is not ready for falling things.

---

## 5. Defects and gaps in the satellites (do not copy)

1. Reader canvas: the close `X` (`aria-label="Close reader"`) has no handler. On the Guarani canvas wire it with the
   dual-mode nav (`props.go`, else an `<a href>`), or drop it.
2. Reader canvas: phrases are `<button>`s without `type` and the lens is `aria-live` while the text box is
   `touch-action: none` (a long text could not scroll on the canvas). Keep texts short there, or use `pan-y`.
3. The main app has no entry to its satellites; Typing tells phone users to go elsewhere. Link them from the app.
4. Speaking's notebox uses the emoji 🔊; the canvas forbids emoji (use the inline speaker SVG).
5. The games draw on `<canvas>` with their own globals (`window.TypingItems`, `window.SpeakingWorld`); a Design canvas
   artboard must build its UI from markup ("all UI is `<x-dc>` markup, never script-built"), so the Guarani round is
   positioned divs/SVG driven by state, with `requestAnimationFrame` only for motion.
6. `learnerPlace()` assumes an unlevelled save is N2 (legacy); the Guarani reader of the app's state has no legacy.
7. Japanese-only wrapping/normalising logic (`NO_START`, kana folding, `jaMarked`) must not be ported blindly: Guarani
   needs grapheme-safe splitting (`Intl.Segmenter`; g̃ is g + U+0303 and must never be cut).

---

## 6. Adapting to Guarani for Spanish speakers

### 6.1 What carries over as-is

- The three-satellite idea, each a self-contained flow with its own save, reading (never writing) the main app's state,
  sharing its course words and clips, its tokens (§1.3), components (§1.4), keyframes (§1.5) and footer links.
- The canvas pattern: one component artboard per satellite + moment boards that `dc-import` it with `demo`/`view`
  props; a finger disc to stage a gesture; designed moments measured after fonts load.
- The Reader's interaction model (hold, slide, tap-peek, keyboard focus, lens above the finger, dotted trail, count,
  list by base form, settings switches, no sentence translation, prebuilt analyses, editions, backups).
- The whole reward system (§1.7) and the fall/rise/comeback/wait loop, measured pacing, hint steps, weak spots, the
  stamp card, rings, tiers, the sr-prompt line, reduced motion, the pause sheet, the settings structure (hints, sound,
  effects, music, daily goal, cards per round).
- Speaking's Falling and Climb, the dock, the mic button design and its states, the model-first lesson rounds, the
  "heard" line idea, Wake Lock, the upright overlay, the sticky start bar.

### 6.2 What must change, and why

| Yaoki | Why it cannot carry over | Guarani version |
|---|---|---|
| Furigana hidden and revealed (ruby over kanji) | Guarani is written phonemically in Latin letters; nothing needs a "reading" | The lens reveals **structure and meaning**: morphemes (prefix · root · suffix) with Spanish glosses, the affix pattern, optional stress/nasality marks (§6.3) |
| kuromoji + IPADIC + JMdict (36 MB), ~90 Japanese grammar patterns | no Guarani tokenizer or open dictionary of that kind is known **[verify licensing of any Guarani–Spanish dictionary]** | prebuilt, native-reviewed analyses for the app's own texts; a small rule-based segmenter (person prefixes, common suffixes, postpositions, negation frame) + a root lexicon for pasted texts, labelled as approximate; a Guarani pattern list with Spanish glosses |
| Aozora Bunko (17,344 public-domain works) | no equivalent Guarani corpus wired in; licences unknown | a library of works written for the app, by level (A1…), first; official texts (G7 §2: Ley 4251 bilingual edition, the Constitution in Guarani) only after a reuse check |
| JIS keyboard typing game, desktop only | the learner is on a phone; system keyboards differ and may lack ẽ ĩ ũ ỹ g̃; virtual keyboards send composition events | a **phone** typing game with its own on-screen keyboard of real buttons (§6.4) |
| Romaji/kana input methods | no transliteration in Guarani | two "input methods": **Teclado común** (Spanish QWERTY + Guarani keys: the way they will type later) and **Achegety** (one key per letter of the 33-letter alphabet, digraphs and the puso as single keys: the way to learn the alphabet) |
| Kanji stages (reading hidden, typed from the kanji) | no logograms | **Del castellano al guaraní**: the card shows the Spanish, the Guarani is the hidden answer (dotted line of fixed length), revealed by hint 1 |
| Web Speech recognition in `ja-JP`; the phone's Japanese TTS | Guarani recognition not offered by phones **[verify]**; community ASR ≈ 53–59 % WER (G6); no Guarani system voice **[verify]**; G6: "Do not auto-score Guarani speech" | perception rounds auto-scored; production rounds gated by voice activity and judged by **self-check** against native recordings; native clips only (§6.5) |
| Kana lessons (あいうえお, 26) | another writing system | **Achegety** lessons: oral vowels incl. y, nasal vowels, the puso, the nasal digraphs mb nd ng nt, g/g̃, ch, rr, stress (§6.5) |
| 長い音・っ minimal pairs | different contrasts | nasal/oral, puso/no puso, stress position, y vs i/u pairs, from a native speaker (§6.5) |
| 済 / 起 / はなまる / たいへんよくできました / 七転び八起き | Japanese school marks and a Japanese proverb | a check stamp, a "got up" stamp, a Paraguayan rosette (ñandutí) for はなまる, Spanish tiers with a Guarani accent (§6.6) **[decide with the mascot owner]** |
| Klee One (`--jp`) for target text | no ẽ, no U+0303 (Y1 §6.5, verified) | **Andika** 400/700 (or Lora/Nunito) for Guarani; M PLUS Rounded 1c for UI |
| `lang="en"` root, ja + en labels, U+3000 between | the learner reads Spanish | `<html lang="es">`, `lang="gn"` spans; Guarani accent + Spanish (§6.9) |
| Japanese items (dango, koinobori…), scenes (Fuji, shrine…) | culturally Japanese | Paraguayan everyday items and places (§6.6) |
| `yaoki.typing.v1`, `yaoki.speaking.v1`, `yomu.*`, reading `yaoki.v1:` | another app | new keys (§6.7); the main app's key per Y1 is distinct from `yaoki.v1:` |

### 6.3 Leer (the reader) — the lens for Guarani

**Label**: brand `<span lang="gn">Moñe'ẽ</span> <small>Leer</small>` **[revisar: moñe'ẽ "leer"]**; pill `Ayudas`.

**Phrases** (touch targets): one word with its clitics/postpositions, or a short noun phrase (`che rógape`), the
Guarani counterpart of the Japanese bunsetsu. Never split a phrase inside a word; spaces and punctuation separate them.

**While held, in the text**: the phrase gets the same highlight (`#FFE9B0` bg + 2px ink underline, radius 6 6 0 0). The
furigana's "something appears over the word" becomes **morpheme tints that do not reflow the text**: the root keeps the
mark colour, each affix a lighter tint (`#FFF4D6`) inside the same box (no inserted dots, so the line does not jump).

**The lens** (same frame: absolute/fixed card, padding 8px 14px 12px, radius 18, 2px ink, `0 4px 0 #1B2440`,
`aria-live="polite"`, floating above the finger, flipping below), rows:
1. **The phrase as written**, 26 px Andika 700 (line-height 46), words in a wrapping row (gap 2px 14px).
   Switch **Pronunciación** (default off at B1+, on at A1–A2 **[decide]**): the stressed vowel underlined 2px
   `#2F4FD0`; nasal syllables the spelling does not mark with a soft `#E8ECFB` tint **[revisar con fonólogo]**.
2. **Partes** (switch, the furigana switch's heir): under each word, its morphemes as small columns: the morpheme
   (Andika 15/700; roots `#1B2440`, affixes `#5A6382`) over its Spanish gloss (M PLUS 11/700, muted for affixes, ink for
   roots), with `-`/`·` marking where it attaches (`a-`, `-ta`, `-pe`, `nd-…-i` as a frame). Spanish loans (jopara)
   are tagged `castellano` and left unglossed, the counterpart of katakana "(foreign name or word)".
3. **Significado** (switch): the word's Spanish meaning (12/700, centred, `max-width 170`), like Yaoki's English under
   each word. Function words still get a short gloss (unlike Japanese particles), because postpositions carry what
   Spanish prepositions carry.
4. **Gramática** (switch): the pattern row (bg `#E8ECFB`, radius 10, tag `Gramática` 11/800 `#2F4FD0` in place of 文法,
   the pattern 15/700 Andika, its Spanish 12/700): e.g. `-ta　futuro: lo que va a pasar`, `-kuri　pasado`,
   `nd-…-i　no (negación)`, `-pa　pregunta`, `-pe　en, a (lugar)`, `-kuéra / -nguéra　plural (después de nasal)`
   **[revisar cada patrón]**.
5. **Nota** (the story's own notes, `--note` bg, tag `Nota`), e.g. "óga 'casa' cambia a róga después de che"
   **[revisar]**.

**Settings sheet** `<span lang="gn">…</span> Qué muestra al mantener apretado` **[revisar]** with four switches:
`Partes de la palabra` "Prefijos, raíz y sufijos, cada uno con lo que significa."; `Significado` "El castellano debajo de
cada palabra."; `Gramática` "El patrón que hay en la frase, como -ta (futuro)."; `Pronunciación` "La sílaba fuerte y las
sílabas nasales."; the size seg (17/19/22 px); the promise box: "**No se muestra la traducción de la oración entera.**
Ves las piezas y armás la oración vos." (vos vs. tú is an open question, Y1 §6.8); `Cerrar`. Drop the typeface seg
(it was about kanji forms).

**Looked-up list**: `Palabras que miraste`, one row per **root** (lemma) with its gloss (`guata — caminar`), newest first.
New idea worth adding: when a root is one of the course's words already studied (read from the main app's state), the row
and the lens show a small tag `Curso · Semana 3` (the Yaoki reader does not do this).

**Data shape** (keep the analyzer's frame, swap the word): chunk `{ w, h, t, g: [[pattern, es]], d: [root, '', es],
n }`; word
```json
{ "t": "aguatáta", "m": [["a-", "yo", "p"], ["guata", "caminar", "r"], ["-ta", "futuro", "s"]],
  "e": "voy a caminar", "k": "guata", "st": 5, "es": 0 }
```
(`m` = morphemes `[form, Spanish gloss, kind]` with kinds `p` prefix, `r` root, `s` suffix, `c` postposition/clitic,
`x` particle; `st` = index of the stressed vowel in `t`; `es: 1` = a Spanish word; all text NFC, puso U+0027). Prebuilt
files keep `pre: 1`, `rev`, and the rule that the analysis must show exactly the part's text. Override maps `gl`, `glx`,
`bf` carry over; `rd`/`rdx`/`sf` (readings) become `mx` (a morpheme split for one occurrence) **[decide]**.

**Demo data for the canvas** (built only from G7 §4's sourced examples; the combination and the name are composed; every
form needs native review): `Mba'éichapa? Iporã. Che réra Ana. Aha che rógape.` — phrases and lenses:
`Mba'éichapa` = mba'éicha "cómo" + -pa "pregunta" → "¿cómo estás?", Gramática `-pa　pregunta`; `Iporã` = i- (él, ella;
"está") + porã "lindo, bien" → "bien"; `Che réra` = che "mi" + réra "nombre" → "me llamo", Nota "téra → réra después de
che"; `Aha` = a- "yo" + ha "ir" → "voy", Gramática `a-　yo (primera persona)`; `che rógape` = che "mi" + róga "casa" +
-pe "a, en" → "a mi casa", Gramática `-pe　a, en (lugar)` **[revisar todo]**. A second line can show G7's `mitã →
mitãnguéra` to demo the nasal plural.

**Library**: `Biblioteca` with works written for the app by level (tag `A1`…), each part with its analysis; the first
item could be the Paraguayan side of Ana's story (the Yaoki serial's heroine is Paraguayan) **[decide; needs a native
writer]**. `Agregar un texto` (paste ≤ 30,000 characters) with an automatic, clearly labelled analysis: "Las partes y los
significados se calculan en tu teléfono y a veces fallan, sobre todo en nombres y palabras del castellano."

### 6.4 Escribir (typing on the phone)

**Label**: `<span lang="gn">Hai</span> <small>Escribir</small>` **[revisar: hai "escribir"]**. Portrait, 390×844.

**Layout** (top 50 and bottom 34 px kept empty, as in the main app):
- 50–94: HUD (44 px): pause (44, round), progress segs pill, run chip, falls chip, time chip (as Speaking's HUD).
- ~102–302: the route stage (radius 20, 2px outline; Yaoki's horizontal route works at a phone width: scale
  `min(1.6, h/240, 390/520 = 0.75)` → a 200 px stage holds the 240-unit world; mascot at the left, cards from the right).
- ~310–360: info line (the Guarani word, Andika 21/700, and its Spanish gloss 15/700 muted) and the status line
  (near-miss notes, 15/800).
- ~380–810: **the keyboard** (real `<button>`s, no global keydown handler), 6 px side padding, gap 5–6, keys 44 px tall,
  radius 10, 2px `--line`, card bg, 17/800 (Andika 700 for letters); states as Yaoki's `.key`: **next** = accent bg +
  outline + `0 3px 0 hard` (lit with hint 2), **ok** = `--good-soft` + `--good` (120 ms), **miss** = `--bad-soft` +
  `--bad`.

**Teclado común** (rows; widths are flex units):
```
row G (Guarani): ã  ẽ  ĩ  õ  ũ  ỹ  g̃  '        (8 keys; aria-labels "a nasal", "e nasal", …, "g nasal", "puso (corte de la voz)")
row 1:           q  w  e  r  t  y  u  i  o  p
row 2:           a  s  d  f  g  h  j  k  l  ñ
row 3:           ⇧(1.4)  z  x  c  v  b  n  m  ⌫(1.4)
row 4:           .,¿? (symbols layer, 1.2)   ´ (dead key, 1.2)   espacio (4)   ~ (combining, 1.2)
```
The symbols layer holds `, . ¿ ? ¡ ! -` and the digits, for the Frases stage; it toggles back after one key.
**Achegety** (one key per letter, alphabet order, digraphs and the puso as single keys; the Latin letters outside the
alphabet, b c d f q w x z, are absent): `a ã ch e ẽ g g̃ h i ĩ j k l m mb n nd ng nt ñ o õ p r rr s t u ũ v y ỹ '` (33)
**[revisar]**, laid out in 4 rows of 8–9 + ⌫ and space.

**Spelling rules** (the counterpart of "taken when either IME would turn it into the kana; the hint is a spelling both
accept"):
- Compare NFC; a nasal vowel may come from its key, or the vowel then `~` (U+0303, the way kana input types a voiced kana
  as its kana then ゛), or `~` then the vowel; **g̃ is always g + U+0303** (no precomposed form); a stressed vowel from
  `´` then the vowel (the Spanish PC habit) or the vowel then `´`; the puso from `'` (any of ' ’ ‘ ʼ accepted; stored as
  U+0027). The hint always shows the single key (row G) or the plainest sequence.
- Each **letter of the alphabet** is one unit for progress, blame and weak spots: digraphs `ch mb nd ng nt rr` count as
  one letter (like っ and ん "on their own"); a miss is blamed on the letter being typed.
- **Named near misses** under the card (the `NOTES` idea): "**ẽ** lleva tilde nasal: e + ~" / "Falta el **puso**: ka'a,
  no kaa" / "**óga** lleva acento: la fuerza va en la ó" / "**y** es vocal en guaraní" **[revisar ejemplos]**. Whether a
  missing acute is a miss or a near miss is for the orthography researcher (G6 §8); default: a miss, named.
- Capitals: a ⇧ key; cards are lower case except names; a sentence-initial capital accepted either way **[decide]**.

**Stages** (groups, as Yaoki's): `Letras` (one key a card: the row-G letters, then the digraphs — the 記号 Symbol keys
counterpart), `Palabras`, `Frases` (with ¿? ¡! and the puso), `Vocabulario del curso` (level + week list from the main
app, `Ahora` tag on the current week, clip played on clear), `Del castellano al guaraní` (advanced: hidden answer),
`Dictado` (hear the clip, type it; needs clips). Each stage keeps its own pace, best, run record and rings; the same
stage on the Achegety keyboard counts apart (`achegety:letras` vs `comun:letras`).

**Pacing for thumbs**: start `{ r: 1.8, p: 1.2 }` for words, `{ r: 2.6, p: 1.0 }` for the recall stage **[tune on a
phone]**; the rest of the formulas as §3.5.

**Hints**: level 1 = the letter being typed (and, on the Achegety keyboard, its row) shown under the card; level 2 = the
whole word, and the next key lit. Timers 5 s / 3 s as Yaoki; the recall stage's first hint reveals the Guarani word on
the card (the kanji-reading rule).

**Copy** (Spanish, with Guarani accents to be reviewed): `Empezar`, `Repasar puntos débiles (3)`, `Tarjetas por ronda:
10 Corta · 20 Normal · 40 Larga`, `Pausa`, `Seguir`, `Ajustes`, `Salir de la ronda`, `Resultado`, `Sin errores`,
`Racha más larga`, `Caídas`, `Ayudas`, `Puntos débiles`, `Ya lo sabés (3 veces seguidas sin error)`, `Tarjeta de sellos ·
3 / 7`, `Los días libres no borran ningún sello.`, fall caption `Correcto` + `Vuelve después de 2 tarjetas`, waiting card
`Despacio: el camino espera. Saltear.` (a `Saltear` button replaces Tab).

### 6.5 Hablar (speaking without recognition)

**Label**: `<span lang="gn">Ñe'ẽ</span> <small>Hablar</small>` **[revisar]**. Keep the menu (ways, modes, lessons,
cards per round, mic test, stamp card, sticky start bar), the round's HUD and dock, and the result; change the **judge**.
Make the judge a module with Yaoki's interface (`prepare(item)`, `check(t, input)` → `{ ok, fill, note }`) so a real
Guarani recogniser can plug in later.

Four judges (a setting per mode, defaults in brackets):
1. **Escuchá y elegí** (perception, auto-scored; Falling) [default for Falling]: the clip plays; 2–3 things fall, one with
   the heard word, the others its minimal-pair partners; tap the right one before it lands. Wrong tap = a miss (flash,
   the right one keeps falling); landing = squashed. Works offline, on the canvas, with a screen reader (real buttons on
   each thing), and trains what Spanish speakers miss: nasality, the puso, stress, y.
2. **Decilo antes de que caiga** (production, gated by voice activity; Falling): a Web Audio level detector hears speech
   of at least ~0.6 × the model clip's length **[tune]**; the thing breaks; each take is recorded (MediaRecorder,
   on-device, no network) and at the end a sheet `Escuchate` plays model ↔ you per card, and the learner marks the
   ones that did not sound right (those become weak spots). Never call a take wrong automatically.
3. **Repetí y compará** (production, self-check; Climb) [default for Climb]: Yaoki stands under a sign; the learner says
   it (or taps `Escuchar` first, a hint); a small sheet shows two waveform strips `Modelo` / `Vos` with play buttons and
   asks `¿Sonó igual?` → `Igual` (jump; clean if first try and no hint), `Casi` (scramble; not clean), `Otra vez` (bump
   ゴン and slip; after two, the sign waits and `Saltear` appears). The rhythm of Climb ("No hurry") suits this.
4. **Reconocimiento (experimental)**: only if a device or service recognises Guarani; off and hidden otherwise.

**Lessons (Achegety, the あいうえお counterpart)**: one lesson per letter group, each with a chart of letter tiles
(Andika 34/700 + a Spanish description of the sound, tap to hear the native clip), a note on what is new for a Spanish
speaker, and a few common words made only of letters taught so far (tap to hear). Suggested order: vocales orales
(a e i o u **y**), vocales nasales (ã ẽ ĩ õ ũ ỹ), el puso ('), consonantes como en castellano, j/h, ch, rr, mb nd ng nt,
g y g̃, el acento (final por defecto; tilde aguda cuando no es final: óga) **[revisar orden y descripciones con
fonólogo]**. Words come from the course content with native review; never invented here.

**Pairs stage** (the 長い音・っ counterpart, perception first): nasal/oral, puso/no puso, stress, y vs i/u. One candidate
only, to verify: `pyta` (talón) / `pytã` (rojo) **[revisar]**; the rest to be collected with a native speaker.

**Phrases**: `Saludos` from G7's sourced list (`Mba'éichapa? – Iporã.`, `Aguyje`, `Maitei`, `Jajotopáta`, `Che réra…`);
`Trabalenguas` only if a native speaker supplies them.

**Mic and recording copy** (Spanish): `Escuchando` / `Preparando…` / `Tocá el micrófono para hablar` / `Mantené apretado
mientras hablás` / `Escuchá: el micrófono vuelve después del audio` / `El micrófono está bloqueado para esta página.
Permitilo en los ajustes del navegador.` / `No se encontró un micrófono.`; mic test: `Decí «Mba'éichapa» para probar el
micrófono` → `Te escuché: 1,2 s.` (no recognition, so it reports a take, not words). The `no-speech` note becomes a
`no-mic` note (MediaRecorder or getUserMedia missing).

**Model voice**: native recordings only (no Guarani system voice **[verify]**); keep Yaoki's silent stand-in when a
clip is missing (Y1: light up ~600 ms + 120 ms per character) and say so: `Este audio todavía no está grabado.` A
community Guarani TTS exists (an MMS-based model on Hugging Face, `joselobenitezg/mms-grn-tts`); usable at most for
design stand-ins, licence and quality unverified, never shipped as the model.

**Canvas constraint**: the Design canvas grants no microphone, so the Hablar artboards **simulate** the ear: a demo prop
drives the states (listening, speaking, take recorded, compare sheet), and in Play the mic button cycles through them
(`Simular toma`), the way Yaoki's own test hands the page "what a phone's recognition would send".

### 6.6 Rewards, mascot, items, scenes in Paraguayan terms

Keep every rule of §1.7; rename and redraw the marks **[decide with the mascot owner]**:

| Yaoki | Guarani suggestion |
|---|---|
| 済 stamp (red ring, vermilion character, tilted −9°) | the same ring with a ✓ path `M5 12l5 5 9-10` (Y1), or a short Guarani word **[revisar]** |
| はなまる (scalloped ring, 9 scallops) | a **ñandutí** rosette (the same `hanamaruPath` ring plus radial threads), "three rings = the stage's ñandutí" |
| 起 (comeback) | an up-arrow stamp; the bubble says "¡Opu'ã!" ("se levantó") **[revisar]** |
| 連続 (clean run) | `Racha` (chip with the rosette icon) |
| たいへんよくできました / よくできました / がんばりましょう | `¡Excelente!` / `Muy bien` / `Seguí practicando`, each with a Guarani accent (e.g. `Iporã` for "bien", G7) **[revisar]** |
| 七転び八起き (title, rise line) | Spanish "Caer siete veces, levantarse ocho" until a Guarani saying is supplied **[buscar con hablante nativo]** |
| 苦手 / 卒業 / 苦手を練習 | `Puntos débiles` / `Ya lo sabés` / `Repasar puntos débiles` |
| items (dango, onigiri, koinobori, Fuji…) | chipa, sopa paraguaya, tereré (guampa and bombilla), mate, mandioca, mburucuyá, lapacho flowers, ñandutí, arpa, guitarra, pájaro campana, ñandu, carreta, hammock **[decide; keep them secular and everyday, as Yaoki's are]** |
| Typing scenes (12) / Speaking places (4) | e.g. a "compañía" village with its oga and kokue, a market, the riverside of Asunción, Lago Ypacaraí, the Chaco, a forest of lapachos; falling things such as mangos, coconuts or oranges from a tree; climbs up a hill to a chapel, a lapacho tree, a water tower **[decide; check cultural fit]** |

The mascot's lines become a Guarani exclamation first and Spanish second (the target language first, as Yaoki puts
Japanese first): only short, sourced or native-supplied lines (`¡Iporã!` "¡Bien!", `Aguyje` "Gracias", `Jajotopáta`
"Hasta luego" are in G7's sourced list); every other line **[native speaker]**.

### 6.7 Shared state, keys and files for the Guarani satellites

- **Read** the main app's saved state under its own key (Y1: distinct from `yaoki.v1:`; e.g. `gn.v1:<folder>`), never
  write it. Derive `{ level: 'A1'|…, unit }` from its `level` and `cur` (`/^(a1|a2|b1|b2|c1|c2)u(\d+)/`) — no legacy
  fallback.
- **Course words** from the engine data Y1 proposes (`window.__gnCourses[LEVEL].units[].days[]`, the day's words lesson
  replacing `scene`; fields `gn`, `es`, `clip`) **[align with Y1/Y2's final field names]**; dedupe by `gn|es`; drop a word
  the keyboard cannot type.
- **Clips** through the app's sound player (the `ykSound` API: `has(key)`, `play(key)`, `ms(key)`, `over()`, `unlock()`),
  one sound file per unit; the round never waits for them.
- **Own keys** (ASCII): `gn.leer.v1.settings`, `gn.leer.v1.texts`, IndexedDB `gn-leer` (analyses);
  `gn.escribir.v1`; `gn.hablar.v1` (+ recordings kept only for the round, in memory, never stored or sent). Same shapes
  as §3.7/§4.8 with `style: 'fall'|'climb'`, `judge: 'pick'|'say'|'compare'`, `keyboard: 'comun'|'achegety'`.
- **Files on the canvas** (mirroring `yaoki/project`): the shared `gn-course.js` (Y1) plus satellite support files
  linked relatively after `./support.js`: `gn-leer.js` (analysis helpers, demo texts), `gn-escribir.js` (alphabet,
  keyboards, accepted sequences, stages, notes), `gn-hablar.js` (judges, lessons, pairs). Text helpers per Y1 §6.3
  (`norm`, `fold`, `chars` with `Intl.Segmenter`).
- **One app or three?** On a phone, one PWA with the satellites as sections reachable from the menu and from Today (the
  reading lesson opens Leer with its text; the words lesson offers `Practicar escribiendo` / `Practicar hablando` with the
  week's words) avoids three installs and three offline copies; keep the separate saved keys **[decide]**.

### 6.8 Proposed artboards on the Guarani canvas

ASCII file names, 390×844, radius 44, `is_interactive: true`; each satellite = one component artboard holding its flow in
`state`, plus moment boards importing it; navigation with Y1's dual-mode idiom (`nav = (to) => (e) => { const go =
this.props.go; if (go) { e.preventDefault(); go(to); } }` on an `<a href>` styled as the button).

| File | Canvas title | Designed moment | Controls → targets |
|---|---|---|---|
| `Leer.dc.html` | "Leer · biblioteca (jugá esta)" | the library: two works (A1, A2) + the sample, one with a dotted-trail count | card → text view (state); `Agregar` → add view; `Ayudas` → sheet; back → `go('Main')` |
| `LeerTexto.dc.html` | "Leer · un texto en reposo" | `<dc-import name="Leer" view="text">`: demo text, nothing held, `0 / 6` | — |
| `LeerSostener.dc.html` | "Leer · sosteniendo una frase" | `view="text" demo="5"`: `che rógape` held, lens with che · róga · -pe, Gramática `-pe`, finger disc, 3 chips | — |
| `LeerAyudas.dc.html` | "Leer · qué muestra" | `view="settings"`: the four switches, the promise box | — |
| `Escribir.dc.html` | "Escribir · menú (jugá esta)" | menu: stamp card 3/7, keyboard choice, stages with rings | `Empezar` → round (state); result `Otra vez` / `Cerrar` |
| `EscribirRonda.dc.html` | "Escribir · en la ronda" | `demo="round"`: card `aguatáta` with `aguat` typed green, the `´` or `á` key lit, run 4, mascot looking at it, 7/20 | — |
| `EscribirCaida.dc.html` | "Escribir · se cayó y se levanta" | `demo="fall"`: mascot down with stars, red card, `Correcto: ndaguatái`, `Vuelve después de 2 tarjetas` **[revisar forma]** | — |
| `EscribirResultado.dc.html` | "Escribir · resultado" | `demo="result"`: `¡Excelente!` stamp, 17/20, racha 9 (récord), 2 levantadas, weak chips `ẽ ×2` `' ×1`, `Ya lo sabés: g̃`, ring 2/3, stamp card 4/7 (today new) | — |
| `Hablar.dc.html` | "Hablar · menú (jugá esta)" | menu with the two ways, the Achegety lesson chart (vocales nasales), mic test | `Empezar` → round |
| `HablarCae.dc.html` | "Hablar · escuchá y elegí" | `demo="pick"`: two mangos falling, `pyta` / `pytã`, audio playing, mic ring off **[revisar par]** | — |
| `HablarSube.dc.html` | "Hablar · subir" | `demo="climb"`: Yaoki on ledge 3, sign `Mba'éichapa?`, listening ring on | — |
| `HablarCompara.dc.html` | "Hablar · repetí y compará" | `demo="compare"`: the `¿Sonó igual?` sheet with Modelo/Vos strips | — |
| `HablarResultado.dc.html` | "Hablar · resultado" | `Dijiste bien a la primera 8/10`, `Escuchate` list of 2 takes | — |

Designed moments must not drift with the date (Y1 §6.6): compute the stamp card's days from `today`.

### 6.9 Bilingual label pattern (Guarani accent + Spanish)

- Root `<html lang="es">`; Guarani spans `lang="gn"`; screen readers will read Guarani with a Spanish voice, so every
  control's accessible name is Spanish (`aria-label="e nasal"`, not "ẽ"), and Guarani text in live regions is followed by
  its Spanish gloss.
- Brands and headings: `<span lang="gn">Moñe'ẽ</span> <small>Leer</small>` (Guarani 15–20/800, Spanish 12–13/700
  `#5A6382`), the exact layout of `よむ <small>Reader</small>`.
- Buttons: Spanish alone, or Guarani + Spanish separated by ` · ` (`Jaha · ¡Vamos!` **[revisar]**); never U+3000 between
  Latin words.
- Kickers: upper-case Spanish (`TARJETA DE SELLOS · 3 / 7`), with a Guarani word only where it teaches something.
- Length budget: Guarani words are long (agglutinative); allow `overflow-wrap: anywhere` only at morpheme boundaries in
  data-driven text, never inside a digraph, before a combining tilde, or at the puso.

---

## 7. Open questions (need a decision or a native speaker)

1. Morpheme split and glosses for every library text: who writes and reviews them, and which gloss style (plain Spanish
   words, as proposed, or abbreviations)?
2. Is there a Guarani–Spanish dictionary or lexicon the app may reuse (licence) for pasted texts?
3. Stress and nasality marks in the lens: which syllables count as nasal for a learner display, and is the default-final
   stress rule stated the way the Academia's 2016 rules state it?
4. Missing acute or missing tilde in typing: miss, or named near miss (G6 §8 "spelling tolerance")?
5. Do iOS and Android system keyboards offer ẽ ĩ ũ ỹ g̃ for Guarani or Spanish (Gboard has a Guarani layout?) — affects
   whether the in-app keyboard is required or optional **[verify on devices]**.
6. Does any phone recogniser accept Guarani (`gn`, `gn-PY`)? If one appears, which words can it judge reliably?
7. Minimal pairs for perception rounds, greetings, tongue twisters, the mascot's exclamations, the Guarani words for
   the satellites' names (moñe'ẽ, hai, ñe'ẽ) and the stamp words: all from a native speaker.
8. One PWA with sections, or separate installable satellites like Yaoki's?
9. The mascot's marks (ñandutí for はなまる, the ✓ stamp, the comeback mark) and the items/scenes list: cultural fit.
10. Spanish register in the UI: Paraguayan "vos" or neutral "tú" (Y1 §6.8) — affects every button above.
