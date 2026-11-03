# Y2 · The grammar lesson loop and the content format (Yaoki → Guarani)

Read from the real source (paths in §10). Values in `code` are copied from the files. "Verified bug" = checked in the canvas file AND in the shipped app bundle `docs/assets/screens.js`.
Yaoki root = `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki` (READ-ONLY).

---

## 0. At a glance (read this first)

1. **A study day is three lessons**, shown as three cards on the "Today" hub: Grammar (`g` 0..3), Kanji & words (`k` 0/1, sub-steps `ks`, `kw`), Reading or Listening (`r` 0/1). The day is complete when `g>=3 && k>=1 && r>=1`. This file covers the **grammar lesson**:
   **Teach page 1 → Teach page 2 → Compare (+ quick check) → Drill (≥4 items: choice + star, hints, a reason for every option) → Exam-style (3 items, 2:30 clock, no aids) → result (same Exam screen) → back to Today.**
2. **Progress is one integer per lesson and only moves forward** (`Math.max` merge): leaving Compare for the Drill writes `g:1`, finishing the Drill writes `g:2`, closing the exam result writes `g:3`. Only the teach-page index `tp` is saved inside a step; the drill item index is not (leaving mid-drill restarts it).
3. **Six artboards in canvas row 2** ("Learn, drill, then exam-style"): `5 · Teach page`, `6 · Compare similar grammar`, `7 · Drill with explanation`, `8 · Star sentence`, `9 · Exam-style step`, `10 · Exam-style result`. In the playable prototype only Teach, Compare, Drill and Exam are screens: **Star is a static showcase** of the star item (the Drill renders star items itself) and **ExamResult is Exam mounted with `view="result"`**.
4. **Every screen takes the same four props** — `app` (= `C.view(state)`), `go(screen)`, `save(patch)`, `miss({src, wrong})` — from one prototype artboard that owns the state. Controls are real `<a href="X.dc.html">` links (canvas Play follows them) intercepted by `nav()` when `go` exists. **Opened alone, every artboard shows a "designed moment"** (N2 week 3 day 4, `u03d4`, in its most telling state).
5. **Two item kinds.** `choice`: `q` with a `（　　）` blank or `_underlined_` word, `options`, 1-based `answer`, `why` (one line per option, the right one included) or `explain`. `star` (sentence building): `before`, `after`, 4 `tiles` in the right order, `star` (0..3), `bank` (display order), `hint`, `full`, `explain`. The same star item is **built tile by tile in the drill** and **asked "as on the paper" (which numbered tile goes on ★) in exam conditions and in the notebook**.
6. **Scaffolding is removed step by step**: Teach (readings, highlights, audio, watch-out box) → Drill (readings and highlights, hint for star items, the `^clue^` revealed after answering, every option explained) → Exam (no readings, no highlights, no hints, a clock, answers only at the end).
7. **Every wrong answer** in the Drill and the Exam (and every unanswered exam item) goes to the mistake notebook: `miss({src: item id, wrong: label of what was chosen})`; it comes back after 1, 3, 7 days; three right in a row clears it. Compare's quick check records nothing and can be re-picked freely.
8. **Content is JSON** (`content/<level>/units.json` + `uNN.json`), checked and compiled by `tools/build-course.mjs` into `yaoki/project/course-<level>.js` (`window.__ykCourses[LEVEL]`). Screens read it only through the engine `course.js` (`window.ykCourse`: `rich`, `plain`, `day`, `unit`, `item`, `view`, `handlers`, …).
9. **Inline markup**: `{highlight}`, `[base|ruby]`, `_underline_`, `^clue^`, parsed by `C.rich()` into segments; each screen picks options (`ruby:false`, `hl:false`, `clue:'line'|'mark'`).
10. **For Guarani**: the loop, step machine, props contract, designed-moment pattern, item kinds, validation discipline and QA pipeline carry over unchanged. What changes: ruby/furigana and kanji levels disappear (ruby can become an optional gloss/morpheme line); highlights must work **inside** words (affixes such as `{nd}ajapó{i}`, `óga{pe}`); options and tiles are Latin words (retune width thresholds); text needs NFC and puso normalization; nasal harmony and stress marks change at suffix boundaries (tile joins can break); Guarani word order is freer (star items need fixed-order constructions and a blind native check); Spanish UI with Guarani-first bilingual labels; a font that renders `ã ẽ ĩ õ ũ ỹ g̃ ñ ' á é í ó ú ý`; an app-defined item-type taxonomy instead of JLPT types. Details in §9.

---

## 1. The step machine of a study day

### 1.1 The state (course.js)

```
state = C.fresh() = { screen: 'Goal', started: false, level: null, plans: {}, mocks: {}, plan: null, cur: null,
                      done: {}, tests: {}, mistakes: [], tp: 0, set: 'day', mock: null, wrote: '', wroteWords: [] }
done[sessionId] = { g: 0..3, k: 0|1, r: 0|1, ks: 0|1, kw: 0|1 }
```

| Key | Meaning | Written by |
|---|---|---|
| `done[sid].g` | grammar step: 0 nothing yet, 1 teach pages read, 2 drill done, 3 exam-style done (course.js comment: "grammar step 0-3 (teach read, drill done, exam-style done)") | Compare → `save({prog:{g:1}})`; Drill (last item) → `{g:2}`; Exam result (day) → `{g:3}` |
| `done[sid].ks` / `kw` / `k` | words lesson: scene read / everything written / the exam question answered (lesson done) | Scene: `save({prog: s.queue.length ? {ks:1} : {ks:1, kw:1}})`, `save({prog:{kw:1}})`, `save({prog:{k:1}})` |
| `done[sid].r` | reading or listening lesson done | Reading / Listening: `save({prog:{r:1}})` |
| `tp` | which teach page is open (0 = first pattern, 1 = second) | Today → `save({tp:0})`; Teach → `save({tp: tp + 1})`; Main → `save({cur, tp:0, set})` |
| `set` | `'day'` = the day's exam-style step, `'test'` = the week test (which set Exam asks) | Today → `save({set:'day'})`; Main / WeekTest → `'test'` |
| `cur` | session picked on the week path (else the next one due) | Main, WeekTest |
| `tests[sid]` | week test result `{id, score, of, used, areas, at}` | Exam (test) → `save({result:{…}})` |
| `mistakes[]` | notebook entries `{src, wrong, at, step: 0-2, due: 'YYYY-MM-DD', cleared?, last?}` | `miss()`, `reviewed()` |

`save(patch)` (in `C.handlers`): copies plain top-level keys (`tp`, `set`, `cur`, …); merges `patch.prog` into `done[C.current(st, status)]` key by key with `Math.max` ("steps only ever move forward: going back over a lesson never undoes it"); stores `patch.result` at `tests[result.id]`. `C.complete(state, s)`: a test is done when `tests[s.id]` exists; any other session when `p.g >= 3 && p.k >= 1 && p.r >= 1`.

### 1.2 Transition table (the grammar lesson)

| From | Control (exact label) | Writes | Goes to |
|---|---|---|---|
| Main (week path) | today's card `はじめる　Start` or a node | `save({cur: s.id, tp: 0, set: s.kind === 'test' ? 'test' : 'day'})` | `Today` (or `WeekTest` for day 7) |
| Today, g=0 | grammar card link (aria "Grammar: open the teach page") or `はじめる　Start with the teach page` | `save({tp: 0})` | `Teach`, or `Compare` when the day has no points (まとめ day) |
| Today, g=1 | `つづける　Continue the drill` | — | `Drill` (starts again at item 1) |
| Today, g=2 | `本番へ　Start exam-style` (navy button, blue shadow) | `save({set: 'day'})` | `Exam` |
| Today, g=3 | no button; the card shows the 済 stamp | — | — |
| Teach, tp=0 | `つぎへ　Next: 〜あまり` (`'つぎへ　Next: ' + next form`) | `save({tp: 1})` (no navigation: the same screen re-renders with pattern 2, stops its audio) | — |
| Teach, tp=1 | `似ている文法へ　Compare` | — | `Compare` |
| Teach / Compare / Drill | X, aria "Close lesson" | — | `Today` |
| Compare | `練習へ　Start the drill` | `save({prog: {g: 1}})` | `Drill` |
| Drill, item answered, not last | `つぎへ　Next` | local state only | next item |
| Drill, Check with a wrong answer | `こたえる　Check` | `miss({src: it.id, wrong})` | sheet opens |
| Drill, last item answered | `おわる　Finish the drill` | `save({prog: {g: 2}})` | `Today` |
| Exam, not last | `つぎへ　Next` (disabled until an option is picked) | local | next question |
| Exam, last | `おわる　Finish` | `miss()` for each wrong or unanswered item | result view (same screen) |
| Exam, clock reaches 0 | — | same as Finish, with `t = 0` | result view, `時間切れ　Time is up` in red |
| Exam result | `つぎへ　Next` | day: `save({prog: {g: 3}})`; test: `save({result: {...}})` | `Today` (day) / `WeekTest` (test) |
| Exam | X (aria "Leave the exam-style step") | nothing saved | `Today` (day) / `Main` (test) |

Order is suggested, not enforced: all three Today cards are links at all times; the "next" card (`next = g < 3 ? 1 : k < 1 ? 2 : r < 1 ? 3 : 0`) gets `border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440`, the others `2px solid #DDE1EC`, no shadow.

### 1.3 Today, as far as the loop is concerned (Today.dc.html, "3 · Today's spread")

- Top bar 44px: back chevron (aria "Back to the week path") → Main; centred `第3週 · 4日目` (15px/800).
- Kicker `今日の見開き　TODAY'S SPREAD` (12px/800 #2F4FD0), h1 = day title (26px/800, lh 1.25), sub `Learn the page, drill it with hints, then answer exam-style with the clock on.` (13px/500 #5A6382). That sentence is the whole loop in one line.
- Card 1 (grammar): icon square 46×46, r14, bg #E8ECFB, color #2F4FD0, `文` 22px/800; line `文法　Grammar · 2 patterns` (or `文法　Grammar · the week side by side` on the まとめ day); title; three pills `学習 Learn`, `練習 Drill`, `本番 Exam-style`; one CTA by g (h48, r14, 16px/800).
  - Pill states by g: g0 `now,todo,todo`; g1 `done,now,todo`; g2 `done,done,now`; g3 all `done`.
  - Pill looks: done `{border: 2px solid #E0F3EF, bg: #E0F3EF, color: #0B7A6B, weight 800, tick}`; now `{2px solid #2F4FD0, #2F4FD0, #FFFFFF, 800}`; todo `{2px solid #DDE1EC, transparent, #5A6382, 700}`. Pill box: `height 32px; border-radius 10px; font-size 12px; flex: 1 1 auto; padding 0 6px; nowrap; gap 5px`; tick = 13px circle r9 stroke currentColor 3.5.
  - 済 stamp when done: 34×34 circle, `border: 2.5px solid #E2452B`, color #C7361E, 14px/800, absolute top 12 right 12, `rotate(-9deg)` (card 2 `7deg`, card 3 `-5deg`).
- Card 2 (words): `字` on #FDEBE6/#C7361E, pills `学習 Learn`, `書く Write`, `本番 Exam-style` from `ks`/`kw`/`k`. Card 3 (skill): `読`/`聴` on #FFF4D6, pills all-or-nothing on `r`.
- Bottom: not complete → dashed 済 circle + `Finish all three lessons to stamp day {n} on your card.` on #FDEBE6; complete → 済 stamp animated `yk-stamp 500ms ease-out both`, `{n}日目 完了！`, `Day {n} is stamped on your card.`, `もどる　Back` → Main.

### 1.4 The k and r parts (other agents' screens, how they plug in)

- **k (Kanji in a scene, `Scene.dc.html`)**: 学習 the scene (tap the words; `ks:1`), 書く writing each new kanji three times and each word kanji by kanji (`kw:1`; also `save({wrote})`, `save({wroteWords})`), 本番 one exam-format question (`scene.check`; wrong → `miss`), then `save({prog:{k:1}})` → Today.
- **r (Reading or Listening, `Reading.dc.html` / `Listening.dc.html`)**: one skill lesson (`skill.item`; wrong → `miss({src, wrong: short label})`), then `save({prog:{r:1}})` → Today.
- Grammar, words and skill are independent; only the stamp needs all three.

### 1.5 The まとめ (summary) day = day 6

- Session kind `'matome'`; title is fixed by the build: `まとめ：似ている文法` ("summary: similar grammar").
- `grammar.points` is `[]` → Today's grammar line reads `文法　Grammar · the week side by side`, and the grammar card opens **Compare directly** (Teach is skipped). Compare still shows all three progress segments filled and says "Teach page 3 of 3".
- `compare.forms` covers the week (usually 3 forms; one N5 day has 10), `intro` says how to tell them apart; the drill (≥4, usually 6: four choice, two star) mixes the whole week; 3 exam items; scene and skill as on any day.

### 1.6 The week test = day 7

- Session kind `'test'`, id `u03t` (N2) / `n5u01t`. Main opens `WeekTest` (intro): kicker `週テスト　WEEK TEST`, h1 = unit title, `{count} questions in the exam's own formats, on one 20-minute clock. No hints and no furigana; answers and reasons at the end. Every mistake goes into your notebook.`, a `分野別　By area` card with counts, and `はじめる　Start the test` (navy) → `save({cur: sid, set: 'test'})` → `Exam`.
- Exam in `test` mode: `seconds: 1200`, every `unit.test` item (24 in written units), dots shrink to `gap: 2px` when there are more than 6 questions. Result → `save({result: {id: app.sid, score, of, used, areas: {vocab|grammar|reading|listening: {right, of}}, at: Date.now()}})` → WeekTest result view (score 56px, teacher's stamp by share: ≥0.8 `たいへん よく できました`, ≥0.6 `よく できました`, else `がんばり ましょう`; a bar per area; `苦手　Weak spot` under 50%; `間違いを見る　Review mistakes` → Notebook; `第{n+1}週へ　On to week {n+1}` → Main with `save({cur: null})`).

### 1.7 The props contract and the patterns to copy

- `data-props` of every loop screen: `'{"go":{"editor":null},"app":{"editor":null},"save":{"editor":null},"miss":{"editor":null},"$preview":{"width":390,"height":844}}'`. Exam adds a Tweak: `"view":{"editor":"enum","options":["question","result"],"default":"question"}`.
- Each screen's `<head>` loads `./support.js` (canvas runtime, line kept exactly), then the course data files and `./course.js` (Teach also `./sound.js`, `./sound-course.js`, `./sound-lessons.js`). Star loads only `support.js` (hard-coded content).
- Navigation helper, identical in every file:
  `const nav = (to) => (e) => { const go = this.props.go; if (go) { e.preventDefault(); go(to); } };`
  Every control is `<a href="Target.dc.html" onClick="{{ toTarget }}">` styled as a button: on the canvas the href moves Play to that artboard; in the prototype `go()` switches the shared screen.
- Designed moment: `const app = this.props.app || { sid: 'u03d4', day: C.day('u03d4'), unit: C.unit(3), tp: 0 };` and in constructors `props && props.go ? <real start state> : <designed-moment state>`.
- Prototype (`App.dc.html`, "Prototype · play the whole flow", x −470): `this.state = window.ykCourse.fresh(); this.h = window.ykCourse.handlers(() => this.state, (fn) => this.setState(fn));` and one `<sc-if value="{{ at.Teach }}"><div style="animation: yk-in 220ms ease-out"><dc-import name="Teach" go="{{ go }}" app="{{ app }}" save="{{ save }}" miss="{{ miss }}" reviewed="{{ reviewed }}" hint-size="390px,844px"></dc-import></div></sc-if>` per screen; `app: window.ykCourse.view(s)`. Screens played: `Goal, Main, Today, Teach, Compare, Drill, Exam, Scene, Reading, WeekTest, Notebook, Review, Mock, MockRun, Readiness, Listening` (not Star, not ExamResult).
- `app` fields the loop screens read (from `C.view`): `sid`, `session`, `unit` (`{n, ja, en, days, test}`), `day`, `prog` (= `done[sid]`), `tp`, `set`, `level`, `tests`, `mistakes`.
- The engine provides data and handlers only; all UI is `<x-dc>` markup (the canvas rule "never script-built UI").

---

## 2. The shared look of these screens (exact values)

**Frame**: root `width: 390px; height: 844px; box-sizing: border-box; padding: 50px 16px 34px; background: #F4F5F9; color: #1B2440; font-family: 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif; line-break: strict; display: flex; flex-direction: column; overflow: hidden` (Drill: `padding-top: 50px` only, so its answer sheet can bleed). 50px = status bar, 34px = home indicator. Canvas frames: `w 390, h 844, radius 44, is_interactive: true`; row 2 at `y 1284`, x = 0, 470, 940, 1410, 1880, 2350 (80px gaps); row title note `"Learn, drill, then exam-style"` (`kind: title1`, `x 0, y 984, maxW 2740`).

**Helmet** (every screen): `<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">` and `body{margin:0}` `button{font:inherit;color:inherit;cursor:pointer}` `rt{font-size:9px;font-weight:400;color:#5A6382}` `a{color:#2F4FD0;text-decoration:none}a:hover{color:#1B2440}`.

| Role | Hex | Where |
|---|---|---|
| ink (text, borders, hard shadows) | `#1B2440` | everything; also the exam band and the exam CTA |
| ground | `#F4F5F9` | page; pos chip in Teach; empty plain slot |
| surface | `#FFFFFF` | cards, options, tiles |
| primary | `#2F4FD0` | CTAs, progress, kickers, selected option border |
| primary tint | `#E8ECFB` | chips, selected option bg, Compare check panel, placed tile bg, play button |
| muted text | `#5A6382` | secondary text, option numbers, rt |
| line / disabled | `#DDE1EC` | secondary card borders, empty progress, disabled button bg, exam row borders |
| dashed | `#C9D0E3` | empty slot and gone-tile dashes, disabled button border |
| right | `#0B7A6B` on `#E0F3EF` | right icons, right option, right sheet, right Next button |
| wrong | `#C7361E` on `#FDEBE6` | wrong icons, picked-wrong option, wrong sheet, wrong Next, low clock, Compare kicker, hint label |
| mascot red | `#E2452B` | daruma body, 済 stamps |
| gold | `#F2B43A` | star fill, playing example button, clue underline |
| highlight | `#FFE9B0` | `{pattern}` highlight, tile on the star slot |
| cream | `#FFF4D6` | watch-out card, empty star slot, "up" tag |
| (week test bar track) | `#D9E0F8` | WeekTest |

**Type**: UI M PLUS Rounded 1c 500/700/800; target-language text Klee One 600 (`'Klee One', 'Hiragino Mincho ProN', serif`) with `lang="ja"` on its container. Kickers 12px/800; bodies 13px/500 lh 1.45; secondary English 12px/500 #5A6382; buttons 17px/800; options 16px; drill question 18px lh 2.1; exam question 18px lh 1.9; Teach form h1 34px Klee One 600 lh 1.3; Compare h1 26px/800; star prompt h1 22px/800 lh 1.35; exam score 44px/800; rt 9px/400.

**Shapes**: cards `border-radius: 18px; padding: 12px 14px`, primary border `2px solid #1B2440`, secondary `2px solid #DDE1EC`. Primary CTA: `height: 54px; border-radius: 16px; background: #2F4FD0; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; color: #FFFFFF; font-weight: 800; font-size: 17px` (hard offset shadow, no blur = "pressable"). Options `border-radius: 14px`, `2px solid #1B2440`, `box-shadow: 0 3px 0 #1B2440`; selected = `2.5px` border, no shadow (Exam also `transform: translateY(3px)`: it sinks into its shadow). Chips `padding: 4px 10px; border-radius: 10px; 12px/800`. Bottom sheet `border-radius: 26px 26px 0 0; border-top: 2px solid #1B2440`. Progress segments `height 10px; border-radius 5px`; bar `height 12px; border-radius 6px`. Close X: 44×44 link with `margin-left: -10px` (the glyph lines up with the 16px gutter).

**Keyframes**: `@keyframes yk-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}` (answer sheet, `240ms ease-out`); `@keyframes yk-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}` (screen change in App, `220ms ease-out`); `@keyframes yk-stamp{0%{opacity:0;transform:scale(1.8) rotate(-20deg)}55%{opacity:1;transform:scale(.92) rotate(-9deg)}100%{opacity:1;transform:scale(1) rotate(-9deg)}}` (Today, WeekTest).

**Icons** (inline SVG, `viewBox="0 0 24 24"`, `fill="none"`):
- close: 22px, `stroke="#1B2440" stroke-width="2.6" stroke-linecap="round"`, `M6 6l12 12M18 6L6 18`, `aria-hidden`.
- wrong ×: `stroke="#C7361E" stroke-width="3.5" stroke-linecap="round"`, `M6 6l12 12M18 6L6 18` (verdict 30px: `M5 5l14 14M19 5L5 19`).
- right ○ (Japanese maru): `stroke="#0B7A6B" stroke-width="3.5"`, `<circle cx="12" cy="12" r="8.5"/>` (verdict 30px: r 9).
- star: `fill="#F2B43A" stroke="#1B2440" stroke-width="1.8" stroke-linejoin="round"`, `M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z`.
- speaker: 20px, stroke 2.2 round, `M4 9v6h4l5 4V5L8 9H4z` + `M16.5 9a4 4 0 0 1 0 6`.
- notebook: 18px, stroke 2.2, `M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z` + `M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5`.
- stopwatch: 15px, `stroke="currentColor" stroke-width="2.6"`, `<circle cx="12" cy="13" r="8"/>` + `M12 9v4l2.5 2.5M9 2h6`.
- compare tags (12px): down = minus `M5 12h14` stroke #C7361E 4; up = arrow `M12 19V5M6 11l6-6 6 6` stroke #1B2440 3.2; dot = `<circle cx="12" cy="12" r="5"/>` fill #2F4FD0.
- mascot in the hint bubble (48px, `role="img" aria-label="Yaoki"`), a daruma with one eye painted:
  `<svg viewBox="0 0 100 100" width="48" height="48" role="img" aria-label="Yaoki" style="flex-shrink: 0"><path d="M50 6c26 0 40 20 40 46 0 24-16 42-40 42S10 76 10 52C10 26 24 6 50 6z" fill="#E2452B"/><ellipse cx="50" cy="42" rx="27" ry="23" fill="#FFF6EA"/><circle cx="39" cy="42" r="8" fill="#fff" stroke="#1B2440" stroke-width="2.5"/><circle cx="61" cy="42" r="8" fill="#fff" stroke="#1B2440" stroke-width="2.5"/><circle cx="61" cy="42" r="4" fill="#1B2440"/><path d="M28 30c6-5 14-5 19 0M53 30c5-5 13-5 19 0" stroke="#1B2440" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M44 55c4 3 8 3 12 0" stroke="#1B2440" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 74h24M42 82h16" stroke="#F2B43A" stroke-width="3.5" stroke-linecap="round"/></svg>`

**Bilingual label pattern**: target language first, learner's language second.
- Section labels and buttons: `JA + U+3000 ideographic space + English` in sentence case: `接続　How it connects`, `例文　Examples`, `注意　Watch out`, `練習へ　Start the drill`, `こたえる　Check`, `つぎへ　Next`, `おわる　Finish the drill`, `解説　Why each option`, `解説　The sentence`, `タイル　Tiles`, `時間切れ　Time is up`, `本番 おわり　Exam-style done`.
- Kickers: `JA + U+3000 + ENGLISH CAPS` in a colour: `似ている文法　COMPARE` (#C7361E), `確認　QUICK CHECK` (#2F4FD0), `本番　EXAM-STYLE`, `週テスト　WEEK TEST`, `今日の見開き　TODAY'S SPREAD`, `ヒント　HINT · drill only` (11px/800 #C7361E).
- Step tags top right: `JA + ASCII space + CAPS`: `学習 LEARN`, `練習 DRILL` (12px/800 #2F4FD0).
- Verdicts: `おしい！` / `せいかい！` (20px/800) + `<span style="font-size: 14px; font-weight: 700">Not quite</span>` / `Correct`.
- `·` (U+00B7 with spaces) joins sub-parts: `HINT · drill only`, `QUICK CHECK · じこしょうかい`, `第3週 · 4日目`, compare tags `悪い結果 · just because`.
- Long instructions are English only (`Put the four tiles in order. Your answer is the tile on the star.`, `No hints, no furigana. Answers come at the end.`, `Saved to your mistake notebook. It comes back tomorrow.`).
- (N1 app improvement worth copying: the Japanese part of a label is wrapped in `<span lang="ja">` so screen readers switch voice.)

---

## 3. Item kinds and their mechanics

### 3.1 `choice`

| Field | Rule | Shown where |
|---|---|---|
| `id` | unique across all levels (`n5u01d1.d1`, `u03d4.c1`, `n5u01t.7`) | notebook key (`miss.src`) |
| `kind` | `"choice"` | — |
| `type` | the exam item type it practises (`文の文法1`, `漢字読み`, `表記`, `文脈規定`, `言い換え類義`, `用法`, `語形成`, `読解・情報検索`, `読解・内容理解（短文）`, `発話表現` …) | Drill head (`type + '　' + label`), Exam kind line and result row title, notebook tag colour via `C.area(type)`, week-test areas |
| `label` | optional short English/Japanese label (`Choose the form`, `Kanji reading`, Compare: a scene name like `じこしょうかい`) | after the type; Compare `確認　QUICK CHECK · label` |
| `q` | the sentence, with `（　　）` (full-width parentheses around two U+3000 spaces) for the blank or `_word_` underlined; may contain `^clue^`, `{…}`, `[base\|reading]`, `\n` | Drill (rich: readings, highlights, underline; clue underlined after Check), Compare (rich), Exam (readings, highlights and underline dropped), Review (rich, `hl:false`) |
| `options` | ≥2 (content: 3 in compare checks and listening, 4 elsewhere); unique, also once readings are removed | Drill/Exam/Review as `C.plain(label)`; Compare as raw label |
| `answer` | 1-based | — |
| `why` | one line per option, the right one included; the right one may be `""`; a wrong option's line may be empty only if `explain` exists | Drill: every non-empty line with ○/× icon and `your pick`; Compare: the picked option's line; Exam result: `why[answer-1]` when there is no `explain` |
| `explain` | one paragraph (string or `null`); required when `why` is missing | Drill: only for star items or choice items without `why`; Exam result (preferred); Compare fallback; Review |
| `short` | optional shorter option labels, one per option | notebook / review "right answer" label |
| `passage` | optional reading text (week-test reading items; the same text repeated on each item that uses it) | Exam: a scroll box above the question, `C.plain`, `white-space: pre-line` |
| `script`, `printed`, `clip` | listening items only (`clip` added by the build) | Listening, Review |
| context added by the build | `unit`, `day`, `step` (`compare`, `drill`, `exam`, `scene`, `skill`, `test`, `mock`) | `C.item(id)` |

Content convention (all levels, counted over 186 written days): compare checks have 3 options and `why`; drill choice items 4 options and `why`; exam-style and week-test items 4 options and `explain` (4 exam items also carry `why`). Drill order is mostly `C C C C S S` (choice ×4, star ×2); exam order is always `C C S`.

### 3.2 `star` (文の文法2, "build the sentence")

| Field | Rule | Shown where |
|---|---|---|
| `before`, `after` | text around the four blanks (may carry readings) | Drill sentence card (readings kept, highlights off), Exam (plain), Review (plain) |
| `tiles` | exactly 4, **in the right order**, all different | Drill slots and bank (readings kept, highlights off) |
| `star` | 0..3, the position that carries ★ | Drill: that slot is drawn as the dashed star slot and its tile gets the #FFE9B0 fill; Exam: that blank shows `★` |
| `bank` | permutation of 0..3, not 0,1,2,3: the order the tiles are shown | Drill bank (2×2 grid); Exam/Review option order |
| `hint` | drill items only (exam star items have none) | Drill only, in the mascot bubble, while asking |
| `full` | the whole sentence with markup; plain text without spaces must equal `before + tiles + after` | Drill answer sheet (rich, highlight on); Exam result row |
| `explain` | required | Drill sheet; Exam result row |

**Asked as on the paper** (Exam and Review): `options = bank.map(t => C.plain(tiles[t]))`, `answer = bank.indexOf(star) + 1`, `starQ: true`; the question shows `before`, four blank lines (40×22, `border-bottom: 2px solid #1B2440`), the star one with a centred `★` (15px), then `after`. In the Drill the learner must get **all four in order**; in exam conditions only the tile on ★ counts.

### 3.3 Hints and clues

- **Star items**: `hint` in a speech bubble from the mascot, label `ヒント　HINT · drill only`; shown while asking (`starAsking && hasHint`), gone after Check, never in the Exam. (N1's Star screen shows a `button aria-expanded` "hint" first and opens the bubble on tap with `aria-live="polite"`: hint on request.)
- **Choice items have no hint field.** Their help is the `^clue^`: the words in the sentence that decide the answer. Plain while asking; after Check the Drill renders it with a gold underline (`clue: 'line'` → `border-bottom: 3px solid #F2B43A`); Reading highlights it instead (`clue: 'mark'`). The reasons then point back at the evidence ("the next sentence says she teaches Japanese").

### 3.4 Reasons

- Drill sheet head `解説　Why each option` (choice) or `解説　The sentence` (star). Choice: one row per non-empty `why` line: ○ (right) or × icon, `<strong>N option</strong>`, a `your pick` chip (`padding: 1px 6px; border-radius: 6px; background: #FDEBE6; 11px/800`) on the wrongly picked option, then the reason (13px/500 lh 1.4). Star: the `full` sentence (Klee One 16px lh 2, pattern highlighted) and `explain`.
- Compare: one line, the picked option's `why` (or `explain`), prefixed `せいかい！ ` or `おしい！ `.
- Exam result: per question the full sentence with the right answer highlighted (`full`, or `q` with `（　　）` replaced by `{answer}`) and `explain || why[answer-1]`.

### 3.5 Timers

- Exam `SETS`: `day: { seconds: 150, title: '本番　EXAM-STYLE', note: 'No hints, no furigana. Answers come at the end.' }`, `test: { seconds: 1200, title: '週テスト　WEEK TEST', note: 'Exam format, one clock for the whole test. Answers come at the end.' }`.
- Real-time deadline: `this.ends = Date.now() + t*1000`, checked every 200 ms, `t = ceil((ends − now)/1000)`; "the clock follows real time, so it keeps running when the app is put aside"; if the phone clock jumps back more than 1 s the deadline moves back with it. At 0 → `finish(0)`. The timer starts only inside the prototype (`componentDidMount` returns when there is no `go`).
- Clock pill: `height 32px; padding 0 10px; border-radius 16px; background #FFFFFF; 13px/800; border 2px solid` #DDE1EC, ink #1B2440; at `t <= 30` both turn #C7361E. Format `m:ss`. Result shows `used of total`, e.g. `1:48 of 2:30`.
- Teach audio buttons: lit for the clip's length (`snd.ms(key)`), or `600 + C.plain(text).length * 120` ms when there is no clip or no sound.
- (Reading skill items carry `seconds` 60–120; another screen.)

### 3.6 Retries and locking

| Screen | Before answering | After answering |
|---|---|---|
| Compare check | tap any option | **not locked**: tapping another option re-grades and shows that option's reason; nothing recorded |
| Drill choice | tap to select (blue), tap another to change; `こたえる　Check` disabled until a pick | locked (`pick` ignored once checked); one try; Next moves on |
| Drill star | tap a bank tile → fills the first empty slot; tap a placed tile → back to the bank; Check disabled until 4 placed | locked (tiles cannot be taken back) |
| Star showcase | same | tapping a placed tile takes it back AND reopens the question (`checked: false`) — differs from the Drill |
| Exam | pick, change freely; Next disabled until a pick; no going back | grading only at the end |
| Review (notebook) | one tap answers and records | locked |

### 3.7 Mistakes (`props.miss`)

- Shape `miss({ src: <item id>, wrong: <what was chosen, plain text> })`.
- Drill choice: `wrong = C.plain(options[pick-1])`. Drill star: the plain text of the tile put on the ★ slot, or `'順番が違う'` ("the order is wrong") when that tile was right and the order elsewhere was not. Exam: for every item with `answers[n] !== answer`: the chosen option's text or `'無解答'` (no answer), so running out of time records every unanswered item.
- `C.miss(list, m, now)` puts `{src, wrong, at, step: 0, due: today + 1}` first and drops older entries with the same `src`. Review spacing `STEPS = [1, 3, 7]`: right moves a step on, the third right in a row clears it; wrong goes back to 1 day. Review re-asks via `C.item(src)` (any level, star asked as on paper).
- On screen: Drill wrong sheet `Saved to your mistake notebook. It comes back tomorrow.`; Exam result `1 mistake saved to your notebook. It comes back tomorrow.` / `{n} mistakes saved to your notebook. They come back tomorrow.`.

### 3.8 Option layout rules

- Drill choice: `long = options.some(o => C.plain(o).length > 7)` → `grid-template-columns: 1fr`, else `repeat(2, minmax(0, 1fr))`; gap `10px 8px`.
- Compare check: all options in one row, `repeat(<n>, minmax(0, 1fr))`, gap 8.
- Exam: always one column (`flex-direction: column; gap: 10px`).
- Review: same rule as Drill.

---

## 4. Text markup and `C.rich()`

| Markup | Meaning | Rendering |
|---|---|---|
| `{ばかりに}` | the pattern being taught | segment `bg: '#FFE9B0', pad: '0 3px', ws: 'nowrap'` (off with `hl:false`) |
| `[油断\|ゆだん]` | ruby: reading over the kanji | `ruby: true, r: reading`; with `ruby:false` only the base is kept |
| `_補って_` | the word a question asks about | `line: '2px solid #1B2440'` |
| `^大事な試験を^` | clue | plain unless `clue:'line'` (`3px solid #F2B43A` underline) or `clue:'mark'` (highlight) |

`C.rich(src, opt)` → array of `{ t, r, ruby, plain, bg, pad, ws, line }`. `{`/`}` toggle highlight (no nesting), `_` and `^` toggle, `[` starts ruby only when a `|` comes before the next `]`. `C.plain(src)` = `src.replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1').replace(/[{}_^]/g, '')` (labels, aria, notebook).

The standard rich-text snippet (copy as is):

```html
<sc-for list="{{ x.segs }}" as="g" hint-placeholder-count="3"><sc-if value="{{ g.ruby }}" hint-placeholder-val="{{ false }}"><ruby style="background: {{ g.bg }}; border-radius: 4px">{{ g.t }}<rt>{{ g.r }}</rt></ruby></sc-if><sc-if value="{{ g.plain }}" hint-placeholder-val="{{ true }}"><span style="background: {{ g.bg }}; border-radius: 4px; padding: {{ g.pad }}; white-space: {{ g.ws }}; border-bottom: {{ g.line }}">{{ g.t }}</span></sc-if></sc-for>
```

| Where | Call | Effect |
|---|---|---|
| Teach connect rule, examples | `C.rich(c.rule)`, `C.rich(x.ja)` | readings + highlight |
| Compare form example, check q | `C.rich(f.ja)`, `C.rich(it.q)` | readings + highlight |
| Drill q | `C.rich(it.q, { clue: checked ? 'line' : null })` | readings, highlight, underline; clue underlined after Check |
| Drill star before/after/tiles | `C.rich(x, { hl: false })` mapped to `{t, r, ruby, plain}` | readings only |
| Drill star full | `C.rich(it.full)` | highlight on |
| Exam q | `C.rich(q.q, { ruby: false, hl: false })` mapped to `{t, text: true, ws: 'normal'}` | plain text (underline lost too: see §8) |
| Exam passage | `C.plain(q.passage)` | plain, `pre-line` |
| Exam result row | `C.rich(full)` mapped to `{t, bg, pad}` | highlight only, no readings |
| Review q | `C.rich(q.q, { hl: false })` | readings, underline |

---

## 5. Screen specs

### 5.1 Teach — `Teach.dc.html`, title `Teach page`, canvas `5 · Teach page`

**Purpose**: the first contact with each of the day's two patterns; one pattern per page, the second replaces the first on the same screen.

**Layout, top to bottom** (root padding 50/16/34):
1. Top bar `height 44px; gap 10px`: close X → Today (aria `Close lesson`); progress = `grid-template-columns: repeat(3, minmax(0, 1fr)); gap 6px`, three segments `height 10px; border-radius 5px`, `#2F4FD0` for index ≤ tp else `#DDE1EC` (`role="img" aria-label="Teach page {tp+1} of 3"`; segment 3 = Compare); tag `学習 LEARN`.
2. Scroll area `flex-grow: 1; min-height: 0; overflow-y: auto; margin: 0 -16px; padding: 0 16px 12px` (scrollbar at the screen edge, content on the gutter).
3. Heading row `margin-top 6px; align-items: flex-end; gap 12px`: left `h1` = `pt.form` (Klee One 34px/600 lh 1.3) over `pt.gloss` (15px/700 #5A6382); right two chips (`padding: 4px 10px; border-radius: 10px; background: #E8ECFB; color: #2F4FD0; 12px/800; nowrap`): level (`N2`) and unit (`原因・理由`).
4. Card `接続　How it connects` (`margin-top 14px; padding 12px 14px; radius 18px; #FFFFFF; border 2px solid #1B2440; gap 8px`; label 12px/800 #5A6382). Per `connect` row: `pos` chip (`width: 72px; padding: 4px 0; border-radius: 8px; background: #F4F5F9; 12px/800; text-align: center; flex-shrink: 0`) + rule (Klee One 16px/600, rich, highlight on the form).
5. Card `例文　Examples` (`margin-top 12px`, same box with `border: 2px solid #DDE1EC`, gap 10px). Per example: play button (`44×44; border-radius 50%; border 2px solid #1B2440; background #E8ECFB`, `#F2B43A` while playing, `transition: background 150ms`; speaker 20px; aria `Play example {n}`) + text column: Japanese (`lang="ja"`, Klee One 16px/600 lh 1.8, rich) over English (12px/500 #5A6382 lh 1.4).
6. Card `注意　Watch out` (`margin-top 12px; padding 12px 14px; radius 18px; background #FFF4D6`, no border, gap 6px): label 12px/800; `watch.note` 13px/500 lh 1.45; × row (16px icon, `role="img" aria-label="Wrong"`) + `watch.bad` (Klee One 15px/600); ○ row (`aria-label="Right"`) + `watch.good`.
7. Fixed CTA under the scroll area (`margin-top 10px`, primary 54px): `つぎへ　Next: {next form}` on page 1, `似ている文法へ　Compare` on page 2.

**States**: page 1 / page 2 (`app.tp`); example n playing (button gold) / idle. **Interactions**: play toggles (second tap stops; `ykSound.has/unlock/play/stop/ms`); page change stops audio (`componentDidUpdate` on `app.tp`); unmount stops audio. **Reads** `app.day.grammar.points`, `app.tp`, `app.level`, `app.unit.ja`. **Writes** `save({tp: tp+1})`. **Designed moment**: N2 `u03d4`, pattern 1 `〜ばかりに` / `just because … (bad result)`, connect `動・い形 普通形 ＋ {ばかりに}`, `な形 〜な／〜だった ＋ {ばかりに}`, `名詞 〜である／〜だった ＋ {ばかりに}`, two examples with clips `t_ex1`, `t_ex2`, the watch-out with `おかげで`; CTA `つぎへ　Next: 〜あまり`. **A11y**: real `<button>`s with aria-labels; ○/× marks have `role="img"` + labels; Japanese containers `lang="ja"`; the progress is one labelled image. **Clever**: one screen for both pages (`tp` in shared state); the audio fallback still gives feedback with no sound; the watch-out box shows the typical mistake next to its correction.

### 5.2 Compare — `Compare.dc.html`, title `Compare similar grammar`, canvas `6 · Compare similar grammar`

**Purpose**: the last "learn" page: the day's two patterns side by side with a look-alike, then one quick check before drilling. On the まとめ day it is the only learn page.

**Layout**:
1. Top bar as Teach, all three segments `#2F4FD0`, static aria `Teach page 3 of 3`, tag `学習 LEARN`.
2. Scroll area as Teach. Header (`margin-top 6px; gap 2px`): kicker `似ている文法　COMPARE` (12px/800 #C7361E); h1 `どれを使う？` ("which do I use?", 26px/800 lh 1.3); `intro` (13px/500 #5A6382 lh 1.45).
3. One card per form (`margin-top 10px; padding 12px 14px; radius 18px; #FFFFFF; border 2px solid #1B2440; gap 4px`): row = form (Klee One 20px/600, grows) + tag chip (`padding 4px 10px; radius 10px; 12px/800; gap 5px`; bg by `mark`: `down #FDEBE6`, `up #FFF4D6`, `dot #E8ECFB`; icon minus / up arrow / dot); example (Klee One 15px/600 lh 1.9, rich, `lang="ja"`); English (12px/500 #5A6382).
4. Quick-check panel (`margin-top 14px; padding 12px 14px 14px; radius 18px; background #E8ECFB; gap 8px`): asking → `確認　QUICK CHECK · {label}` (12px/800 #2F4FD0); answered → ○ or × (14px, aria `Correct`/`Wrong`) + `せいかい！ {why}` / `おしい！ {why}` (12px/800). Question (Klee One 15px/600 lh 1.9, rich). Options grid, one row (`repeat(n, minmax(0, 1fr)); gap 8px`): `height 46px; padding 0; radius 14px; 14px/800; aria-pressed`. Looks: default `2px solid #1B2440 / #FFFFFF / 0 3px 0 #1B2440`; answered: right `2.5px solid #0B7A6B / #E0F3EF / none`, picked wrong `2.5px solid #C7361E / #FDEBE6 / none`, others `2px solid #DDE1EC / #FFFFFF / none / color #5A6382`.
5. Fixed CTA `練習へ　Start the drill`.

**States**: unanswered / answered right / answered wrong (re-pickable). **Reads** `app.day.grammar.compare`. **Writes** `save({prog:{g:1}})` on the CTA. **Designed moment**: `u03d4` compare unanswered: intro `All three give a cause. What changes is how that cause leads to what follows.`, forms `〜ばかりに` (down, `悪い結果 · just because`), `〜あまり` (up, `〜すぎて · so much that`), `〜だけに` (dot, `なおさら · all the more`), check `合格発表の日`: `うれしさの（　　）、思わず大声を出した。` [ばかりに, あまり, だけに]. **A11y**: `aria-pressed` options; result icon labelled; the note sits in the panel above the question. **Clever**: the tag chip names each form's nuance in two words of Japanese plus an English gloss, with an icon for the direction of meaning (bad result / too much / neutral).

### 5.3 Drill — `Drill.dc.html`, title `Drill with explanation`, canvas `7 · Drill with explanation`

**Purpose**: practice with support: readings on, hints for star items, one try per item, every option explained, mistakes saved.

**Layout** (root padding-top 50 only):
1. Top bar (`padding 0 16px`): close X; progress bar (`flex-grow 1; height 12px; border-radius 6px; background #DDE1EC; overflow hidden`; fill `height 12px; border-radius 0 6px 6px 0; background #2F4FD0; transition: width 300ms; width = round((i + (checked ? 1 : 0)) / n × 100)%`; `role="img" aria-label="Question {i+1} of {n}"`); tag `練習 DRILL`.
2. Content (`flex-grow 1; min-height 0; overflow-y auto; padding 6px 16px 12px; gap 8px`): head `{type}　{label}` (12px/800 #5A6382).
   - **Choice**: question card (`padding 10px 14px; radius 18px; #FFFFFF; border 2px solid #1B2440`; Klee One 18px/600 lh 2.1; rich). Options (`grid; gap 10px 8px`; 2 cols or 1 col by the >7-character rule): `<button aria-pressed>` `min-height 50px; padding 6px 12px; radius 14px; display flex; gap 8px; 16px; text-align left`: number (12px, numColor), label (grows), and after Check a ○ (`aria-label="Correct answer"`) or × (`aria-label="Your answer, wrong"`). Looks: default `{2px solid #1B2440, #FFFFFF, 0 3px 0 #1B2440, ink, 800, num #5A6382}`; selected `{2.5px solid #2F4FD0, #E8ECFB, none, 800, num #2F4FD0}`; checked: right `{2.5px solid #0B7A6B, #E0F3EF}`, picked wrong `{2.5px solid #C7361E, #FDEBE6}`, others `{2px solid #DDE1EC, #FFFFFF, color #5A6382, 700}`.
   - **Star**: h1 `★に入るのはどれ？` (22px/800); `Put the four tiles in order. Your answer is the tile on the star.` (13px/500 #5A6382); sentence card (`margin-top 6px; padding 16px 12px; radius 20px; #FFFFFF; border 2px solid #1B2440; flex-wrap; align-items center; gap 10px 8px`; Klee One 17px/600): `before`, four slots, `after`. Filled slot = `<button>` (`height 50px; min-width 48px; padding 0 10px; radius 12px; border 2px solid #1B2440; box-shadow 0 3px 0 #1B2440; 16px/600; nowrap`; bg `#FFE9B0` on the star position, else `#E8ECFB`; aria `On the star: {tile}. Tap to take it back` / `Placed: {tile}. Tap to take it back`). Empty star slot: `role="img" aria-label="Empty star slot"`, `76×50; radius 12px; border 2.5px dashed #1B2440; background #FFF4D6` with the 24px star. Empty slot: `aria-label="Empty slot"`, `76×50; border 2.5px dashed #C9D0E3; background #F4F5F9`. While asking: hint row (`margin-top 6px; align-items: flex-end; gap 10px`): mascot 48px + bubble (`padding 10px 14px; border-radius: 16px 16px 16px 4px` (the tail corner); #FFFFFF; border 2px solid #1B2440; gap 2px): `ヒント　HINT · drill only` + hint (13px/700 lh 1.45). Then `タイル　Tiles` (margin-top 8px) and a 2×2 grid (gap 10px): bank tile `<button aria-label="{plain tile}">` `height 54px; radius 14px; border 2px solid #1B2440; #FFFFFF; box-shadow 0 4px 0 #1B2440; 18px/600`; a used tile leaves a dashed placeholder (`2px dashed #C9D0E3`, `aria-hidden`).
3. Asking: footer `padding 0 16px 34px`, `<button disabled="{{ notReady }}">こたえる　Check</button>` 54px: ready `{2px solid #1B2440, #2F4FD0, #FFFFFF, 0 4px 0 #1B2440}`, not ready `{2px solid #C9D0E3, #DDE1EC, #5A6382, none}`.
4. Checked: bottom sheet replaces the footer (`flex-shrink 0; max-height 470px; overflow-y auto; padding 16px 16px 34px; border-radius 26px 26px 0 0; border-top 2px solid #1B2440; gap 10px; animation yk-up 240ms ease-out`; bg `#E0F3EF` right / `#FDEBE6` wrong): verdict row (30px icon `aria-hidden` + `せいかい！ Correct` / `おしい！ Not quite`; when wrong, right side `正解` + (★ icon for star) + answer, 13px/800, `max-width 62%`); explanation card (`padding 12px 14px; radius 16px; #FFFFFF; gap 8px`) per §3.4; when wrong the notebook line; Next `<a>` 54px coloured `#0B7A6B` / `#C7361E` (`つぎへ　Next`, last `おわる　Finish the drill`).

**States**: choice: no pick / picked / checked right / checked wrong; star: 0–3 placed / 4 placed (Check ready) / checked right / checked wrong; last item vs not. **Reads** `app.day.grammar.drill`. **Writes** `miss`, `save({prog:{g:2}})`. **Designed moment** (`{ i: 0, pick: 2, checked: true }`): `u03d4.d1` `寝坊した（　　）、^大事な試験を受けられなかった^。` answered `2 あまり` → red sheet, clue underlined gold, `正解　1 ばかりに`, four reasons with `your pick` on 2, notebook line, red `つぎへ　Next`, bar at 17% ("Question 1 of 6"). **A11y**: real buttons; Check uses the `disabled` attribute; option state via `aria-pressed` and labelled icons; slots and tiles have aria-labels naming their text; the verdict is text (icons hidden). Missing: no focus move or live region when the sheet opens. **Clever**: the sheet's colour and the Next button's colour carry the verdict; reasons for every option incl. the right one; the clue appears only after answering; `順番が違う` distinguishes "wrong tile on ★" from "right tile, wrong order".

### 5.4 Star — `Star.dc.html`, title `Star sentence`, canvas `8 · Star sentence`

**Purpose on the canvas**: a close-up of the star item mid-build. Not a prototype screen in the main app (the Drill renders star items); the N1 app ships its own data-driven Star screen.

**Layout**: root padding 50/16/34; top bar with a static bar (`width 50%`, aria `Question 6 of 10`) and `練習 DRILL`; header `文の文法2　Build the sentence` / `★に入るのはどれ？` / instruction; sentence card `margin-top 16px` with `面接では、緊張` + 4 slots + `言い間違えてしまった。` (before/after `nowrap`); hint bubble `margin-top 16px`: `あまり comes after a noun with の. Which tile can sit right after 緊張?`; a spacer; `タイル　Tiles` + 2×2 bank in the order C B D A (`自分の`, `あまり`, `名前まで`, `の`); Check `margin-top 22px`. Checked sheet `margin: 0 -16px -34px` (bleeds), static `正解★自分の`, the sentence with `あまり` highlighted, explain `緊張 takes の before あまり, so the first two tiles are fixed. 自分の has to sit right before 名前まで.`.

**Designed moment**: `slots: ['A', 'B', null, null]` (`の`, `あまり` placed; the star slot, position 2, empty and dashed; `自分の`, `名前まで` still in the bank; two dashed placeholders). Inside the prototype all four start in the bank. **Writes** (unused in the app): `miss({src: 'star', …})` and `save({g: Math.max(app.g, 2)})` — a stale top-level `g`, not `prog`. Treat this artboard as presentation only (§8).

### 5.5 Exam — `Exam.dc.html`, title `Exam-style step`, canvas `9 · Exam-style step`

**Purpose**: retrieval under exam conditions at the end of the day's grammar (3 items, 2:30) and, with `app.set === 'test'`, the week test (all unit items, 20:00). One clock, no hints, no readings, no feedback until the end.

**Layout, question view**:
1. Top bar 44px: close X (aria `Leave the exam-style step`) → Today (day) / Main (test); dots (`grid; repeat(n, minmax(0, 1fr)); gap 6px`, `2px` when n > 6; `height 10px; radius 5px`; answered `#2F4FD0`, current `#1B2440`, rest `#DDE1EC`; aria `Question {i+1} of {n}` / `Finished`); clock pill (§3.5).
2. Band (`margin-top 6px; padding 8px 12px; radius 12px; background #1B2440; color #FFFFFF; gap 1px`): `本番　EXAM-STYLE` (12px/800) + `No hints, no furigana. Answers come at the end.` (11px/500 #DDE1EC); test: `週テスト　WEEK TEST` + `Exam format, one clock for the whole test. Answers come at the end.`.
3. Kind `{type}　{label}` (`margin-top 16px`, 12px/800 #5A6382).
4. Passage, if any (`margin-top 8px; max-height 260px; overflow-y auto; padding 12px 14px; radius 16px; #FFFFFF; border 2px solid #DDE1EC`; Klee One 15px/600 lh 1.85; `white-space: pre-line`).
5. Question card (`margin-top 8px; padding 14px 16px; radius 18px; #FFFFFF; border 2px solid #1B2440`; Klee One 18px/600 lh 1.9): plain text, or for star items before + 4 blanks (one `★`) + after.
6. Options (`margin-top 14px`, column, gap 10px): `<button aria-pressed>` `height 50px; padding 0 14px; radius 14px; gap 10px; 16px`; number 12px/800; off `{2px solid #1B2440, #FFFFFF, 0 3px 0 #1B2440, 700, num #5A6382, none}`; on `{2.5px solid #2F4FD0, #E8ECFB, none, 800, num #2F4FD0, translateY(3px)}`.
7. Spacer, then `<button disabled="{{ noPick }}">` 54px `つぎへ　Next` / `おわる　Finish` (ready/disabled looks as Drill's Check).

**Result view** (`done`): row (`margin-top 12px; align-items: flex-end; gap 12px`): left label (12px/700, `#5A6382`; `本番 おわり　Exam-style done`, `週テスト おわり　Week test done`, or `時間切れ　Time is up` in `#C7361E`) over score `h1` 44px/800 lh 1.1 + `/ 3` 18px/700 #5A6382; right `1:48 of 2:30` (12px/700 #5A6382). Rows (`margin-top 10px; flex-grow 1; min-height 0; overflow-y auto; margin 0 -16px; padding 0 16px 8px; gap 8px`): per question a card (`padding 10px 14px; radius 16px; #FFFFFF; border 2px solid #DDE1EC; gap 4px`): header 12px/800 with ○/× (15px, labelled), `{n} · {type}`, and when wrong `あなたの答え：{option}` (or `無解答`) in #5A6382; the full sentence with the answer highlighted (Klee One 15px/600 lh 1.6); the reason (12px/500 lh 1.45). Notebook line when anything is wrong; primary `つぎへ　Next`.

**States**: question (none picked / picked; normal clock / ≤30 s red) and result (all right / some wrong / time up), × day/test. **Reads** `app.set`, `app.day.grammar.exam` or `app.unit.test`, `app.sid`. **Writes** `miss` per wrong item at finish; `save({prog:{g:3}})` (day) or `save({result})` (test, with `areas` via `C.area(type).key`). **Designed moments**: `view: 'question'` → `{ i: 1, answers: [2, 1, null], t: 102 }` (question 2 of 3, `のあまり` picked and pressed in, clock `1:42`); `view: 'result'` → `{ i: 2, answers: [2, 1, 4], t: 42, done: true }` (2 / 3, `1:48 of 2:30`, question 3 wrong: the star item asked as numbered tiles `信頼を, ついた, 友人の, ばかりに`, the learner chose 4 `ばかりに`, right is 3 `友人の`). **A11y**: real buttons, `aria-pressed`, labelled icons and dots; the clock has no live region (fine: no audible ticking). **Clever**: one component serves day and week test (`SETS`) and question and result (`view`); the real-time deadline; star items asked as on the paper from the same data; the pressed-in selected option.

### 5.6 ExamResult — `ExamResult.dc.html`, title `Exam-style result`, canvas `10 · Exam-style result`

Whole file body: `<div style="width: 390px; height: 844px; overflow: hidden; background: #F4F5F9"><dc-import name="Exam" view="result" hint-size="390px,844px"></dc-import></div>`, `data-props='{"$preview":{"width":390,"height":844}}'`, a `renderVals()` returning `{}`. Comment: "the same component as the exam-style step, shown at its result moment". **Pattern to keep**: a second artboard that mounts the same component in another state, so the canvas shows both moments with one source of truth.

---

## 6. Content format

### 6.1 Files

| File | Holds |
|---|---|
| `content/<lv>/units.json` | `{ level, about, units: [{ n, ja, en, days: [5 study-day titles] }] }` |
| `content/<lv>/uNN.json` | `{ days: { "1": …, …, "6": … }, test: [ items ] }`; days not written yet are left out (shown as 準備中) |
| `content/<lv>/mini.json` | the mini mock's items (`{ items: [...] }`) |
| `content/<lv>/drafts/` | the writing brief (`BRIEF.md`), per-day drafts, blind-check files |
| `content/<lv>/review/` | review sheets (`uNN-review.html`) and flags for the native reviewer |
| generated `yaoki/project/course-<lv>.js` | `window.__ykCourses.N5 = { level, units: [{ n, ja, en, days: [6 days; an unwritten day is just {title}], test }], items: { <id>: { ...item, unit, day, step } }, below };` after initialising `window.__ykCourses` (N2 also sets `window.__ykCourseData`) |

Real `units.json` (N5, first unit):

```json
{
  "level": "N5",
  "about": "The N5 course (draft): 8 units, one area of basic grammar each. Every unit has 5 study days with two grammar points, a まとめ day and a week test. Titles only here; each unit's lessons are in uNN.json.",
  "units": [
    { "n": 1, "ja": "名詞の文", "en": "Saying what things are", "days": ["〜は〜です・〜じゃありません", "〜か・〜も", "これ／それ／あれ・この／その／あの", "〜の・〜と", "〜ね・〜よ"] },
    …
  ]
}
```

**Ids**: points `<pre>uNNdD.p1|p2`, compare check `.c1`, drill `.d1…d6`, exam `.e1…e3`, scene check `.k1`, skill item `.r1`; week test `<pre>uNNt.1…24`. `<pre>` = `n5`, `n4`, `n3`, and empty for N2 (`u03d4.d1`). Sessions: `<pre>uNNdD` (D 1–6) and `<pre>uNNt`. Clip names added by the build: examples `x_<point id>_<n>` (non-alphanumerics → `_`), scene words `s_<day>_<word id>`, listening `l_<day>`.

### 6.2 A study day — shape

```
"<1..5>": {
  "title":   = the syllabus title, exactly
  "grammar": {
    "points":  [ exactly 2 × { id, form, gloss, connect: [2–3 × {pos, rule}], examples: [2 × {ja, en, clip?}], watch: {note, bad, good} } ],
    "compare": { intro, forms: [3 × {form, tag, mark: "dot"|"down"|"up", ja, en}], check: <choice item, 3 options, why> },
    "drill":   [ ≥4 items (content: 6 = 4 choice with why + 2 star with hint), at least two on each point ],
    "exam":    [ exactly 3 items: 2 choice with explain + 1 star (no hint), no readings ]
  },
  "scene":  { ja, en, intro, words: [≥4 (content: 8) × {id, word, reading, gloss, parts: [[part, reading, meaning], …], clip?}], check: <choice item> },
  "skill":  reading:   { kind: "reading", ja, en, ask, seconds, passage, strategy, item: <choice item with short, why, explain> }
            listening: { kind: "listening", ja, en, situation?, ask, item: <choice item with script, printed, short, why>, audio: [[N|M|F, text, respelling|null], …] }
}
```

**Real example: N5 unit 1, day 1** (verbatim; only the scene's word list is cut from 8 to 2):

```json
"1": {
  "title": "〜は〜です・〜じゃありません",
  "grammar": {
    "points": [
      {
        "id": "n5u01d1.p1", "form": "〜は〜です", "gloss": "A is B",
        "connect": [
          {"pos": "Noun (the topic), then noun (what it is)", "rule": "〜 ＋ は ＋ 〜 ＋ {です}"},
          {"pos": "Another person's name + さん", "rule": "〜さん ＋ は ＋ 〜 ＋ {です}"}
        ],
        "examples": [
          {"ja": "わたし{は}[学生|がくせい]{です}。", "en": "I am a student."},
          {"ja": "ルイスさん{は}ブラジル[人|じん]{です}。", "en": "Luis is Brazilian."}
        ],
        "watch": {"note": "The little word after the topic is written は but said わ. Write it with は.", "bad": "わたしわがくせいです。", "good": "わたしはがくせいです。"}
      },
      {
        "id": "n5u01d1.p2", "form": "〜じゃありません", "gloss": "A is not B",
        "connect": [
          {"pos": "Noun", "rule": "〜 ＋ {じゃありません}"},
          {"pos": "Noun, more formal", "rule": "〜 ＋ {ではありません}"}
        ],
        "examples": [
          {"ja": "わたしは[先生|せんせい]{じゃありません}。", "en": "I am not a teacher."},
          {"ja": "ルイスさんはかいしゃいん{じゃありません}。", "en": "Luis is not a company employee."}
        ],
        "watch": {"note": "じゃありません takes the place of です. Keep じゃ (or では): without it, せんせいありません does not mean \"not a teacher\".", "bad": "わたしはせんせいありません。", "good": "わたしはせんせいじゃありません。"}
      }
    ],
    "compare": {
      "intro": "Three polite endings after a noun: one says it is, two say it is not.",
      "forms": [
        {"form": "〜です", "tag": "そうです · it is", "mark": "dot", "ja": "わたしは[学生|がくせい]{です}。", "en": "I am a student."},
        {"form": "〜じゃありません", "tag": "ちがいます · it is not", "mark": "down", "ja": "わたしは[先生|せんせい]{じゃありません}。", "en": "I am not a teacher."},
        {"form": "〜ではありません", "tag": "かたい · it is not (formal)", "mark": "down", "ja": "わたしはかいしゃいん{ではありません}。", "en": "I am not a company employee. (more formal)"}
      ],
      "check": {"id": "n5u01d1.c1", "kind": "choice", "type": "文の文法1", "label": "じこしょうかい", "q": "マリアさんは[先生|せんせい]（　　）。^[日本語|にほんご]をおしえます^。", "options": ["ですか", "です", "じゃありません"], "answer": 2, "why": ["This asks whether she is a teacher, but the speaker already knows: the next sentence says she teaches Japanese.", "Maria teaches Japanese, so she is a teacher: use です.", "This says she is not a teacher, but the next sentence says she teaches Japanese."], "explain": null}
    },
    "drill": [
      {"id": "n5u01d1.d1", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "はじめまして。わたし（　　）^ルイスです^。", "options": ["で", "は", "を", "へ"], "answer": 2, "why": ["で shows where something happens, as in がっこうで. It cannot mark the topic.", "は marks the topic, the person you talk about: わたし. Then ルイスです says who that is.", "を marks the thing an action is done to, as in パンをたべます. There is no action here.", "へ shows the direction you go, as in がっこうへいきます. It cannot mark the topic."], "explain": null},
      {"id": "n5u01d1.d2", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "わたしは^[中国人|ちゅうごくじん]^（　　）。", "options": ["です", "ます", "は", "を"], "answer": 1, "why": ["中国人 is a noun, and です after a noun says what someone is.", "ます goes after a verb, as in たべます. 中国人 is a noun.", "は marks a topic. The sentence still needs an ending after 中国人.", "を marks the thing an action is done to. There is no action, and no ending."]},
      {"id": "n5u01d1.d3", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "わたしは[先生|せんせい]（　　）。^[学生|がくせい]です^。", "options": ["です", "ます", "を", "じゃありません"], "answer": 4, "why": ["先生です would say I am a teacher, but the next sentence says I am a student.", "ます goes after a verb. 先生 is a noun.", "を marks the thing an action is done to. The sentence would have no ending.", "The next sentence says I am a student, so I am not a teacher: 先生じゃありません."], "explain": null},
      {"id": "n5u01d1.d4", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "ルイスさんは[日本人|にほんじん]（　　）。^ブラジル[人|じん]です^。", "options": ["ありません", "ではありません", "です", "ですか"], "answer": 2, "why": ["Without では, ありません here would mean \"there is none\", not \"is not\".", "Luis is Brazilian, so he is not Japanese. ではありません is the formal way to say \"is not\".", "日本人です would say he is Japanese, but the next sentence says he is Brazilian.", "This asks whether he is Japanese, but the next sentence already says what he is: Brazilian."], "explain": null},
      {"id": "n5u01d1.d5", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "はじめまして。", "after": "。", "tiles": ["わたしは", "[日本語|にほんご]の", "[先生|せんせい]", "です"], "star": 1, "bank": [3, 0, 2, 1], "hint": "Start with the topic and は. です comes at the very end.", "full": "はじめまして。わたし{は}[日本語|にほんご]の[先生|せんせい]{です}。", "explain": "わたしは is the topic, so it comes first. 日本語の tells what kind of teacher, so it sits right before 先生, and です closes the sentence."},
      {"id": "n5u01d1.d6", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "わたしは", "after": "。", "tiles": ["[学校|がっこう]の", "[先生|せんせい]", "では", "ありません"], "star": 2, "bank": [1, 3, 0, 2], "hint": "Which tiles make \"is not\"? They come after the noun.", "full": "わたしは[学校|がっこう]の[先生|せんせい]{ではありません}。", "explain": "学校の tells what kind of teacher, so it sits right before 先生. では and ありません together mean \"is not\" (more formal than じゃありません), and they follow the noun."}
    ],
    "exam": [
      {"id": "n5u01d1.e1", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "A「マリアさんは　先生ですか。」\nB「いいえ、先生（　　）。学生です。」", "options": ["ます", "ありません", "じゃありません", "です"], "answer": 3, "explain": "いいえ and 学生です show that Maria is not a teacher, so 先生じゃありません. 先生です says the opposite, ます goes after a verb, not a noun, and ありません without じゃ does not mean \"is not\" here."},
      {"id": "n5u01d1.e2", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "ルイスさん（　　）　ブラジル人です。", "options": ["に", "で", "は", "を"], "answer": 3, "explain": "は marks ルイスさん as the topic, and ブラジル人です says what he is. を marks the thing an action is done to, に marks a time or a place to go, and で marks where something happens. None of them can mark the topic."},
      {"id": "n5u01d1.e3", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "わたしの", "after": "。かいしゃいんです。", "tiles": ["父は", "日本語の", "先生", "じゃありません"], "star": 2, "bank": [3, 1, 0, 2], "full": "わたしの父は日本語の{先生}じゃありません。かいしゃいんです。", "explain": "父は, 日本語の, 先生, じゃありません. わたしの goes with 父, the topic. 日本語の tells what kind of teacher, and じゃありません comes last, after the noun."}
    ]
  },
  "scene": {
    "ja": "じこしょうかいカード", "en": "A self-introduction card",
    "intro": "Tap each word on the card you fill in on your first day at the language school.",
    "words": [
      {"id": "name", "word": "名前", "reading": "なまえ", "gloss": "name", "parts": [["名", "な", "name"], ["前", "まえ", "front, before"]]},
      {"id": "country", "word": "国", "reading": "くに", "gloss": "country", "parts": [["国", "くに", "country"]]},
      … (8 words in all)
    ],
    "check": {"id": "n5u01d1.k1", "kind": "choice", "type": "漢字読み", "label": "How the exam asks it", "q": "わたしは　日本語学校の　_学生_です。", "options": ["がっせい", "かくせい", "がくせ", "がくせい"], "answer": 4, "explain": "学生 is がくせい, with a long せい at the end. 学 becomes がっ only before some sounds, as in 学校 (がっこう), not here. かくせい has the wrong first sound, and がくせ drops the い."}
  },
  "skill": {
    "kind": "listening", "ja": "発話表現", "en": "Expressions",
    "situation": "On her first day at a language school, a student with a name tag that says リン meets her new teacher.",
    "ask": "はじめて　先生に　あいました。何と　いいますか。",
    "item": {"id": "n5u01d1.r1", "kind": "choice", "type": "発話表現", "q": "はじめて　先生に　あいました。何と　いいますか。", "script": ["ナレーター：はじめて　先生に　あいました。何と　いいますか。", "ナレーター：1", "女：どうも　ありがとう。リンです。", "ナレーター：2", "女：はじめまして。リンです。よろしく　おねがいします。", "ナレーター：3", "女：はじめまして。リンさんですか。"], "options": ["どうも　ありがとう。リンです。", "はじめまして。リンです。よろしく　おねがいします。", "はじめまして。リンさんですか。"], "printed": false, "short": ["ありがとう。リンです", "はじめまして。リンです", "リンさんですか"], "answer": 2, "why": ["ありがとう is for thanks. The teacher has not done anything for her yet.", "", "She is Lin. リンさんですか asks the teacher if the teacher is Lin."]},
    "audio": [
      ["N", "はじめて　先生に　あいました。何と　いいますか。", "はじめて　せんせいに　あいました。なんと　いいますか。"],
      ["N", "1", "いち"],
      ["F", "どうも　ありがとう。リンです。", null],
      ["N", "2", "に"],
      ["F", "はじめまして。リンです。よろしく　おねがいします。", null],
      ["N", "3", "さん"],
      ["F", "はじめまして。リンさんですか。", null]
    ]
  }
}
```

Note in this real data: readings `[学生|がくせい]` everywhere in teach/compare/drill text, none in exam items (`先生`, `ブラジル人`); full-width spaces between phrases only in exam-format text (the N5 paper's habit); `^clue^` in every drill choice `q`; `"explain": null` is allowed next to `why`.

### 6.3 The まとめ day — shape and real example

Same shape as a study day, with `"title": "まとめ：似ている文法"` and `"points": []`; `compare.forms` holds the week's look-alikes; the build does not count points on day 6.

**Real example: N5 unit 1, day 6** (verbatim; only the 8 scene words are left out):

```json
"6": {
  "title": "まとめ：似ている文法",
  "grammar": {
    "points": [],
    "compare": {
      "intro": "To tell the ten apart, look at what sits next to the blank: between two nouns you need の or と, after the topic you need は or も, before a noun この (これ stands alone), and at the very end です, じゃありません, か, ね or よ.",
      "forms": [
        {"form": "〜は／〜も", "tag": "ちがう・おなじ · topic or \"too\"", "mark": "dot", "ja": "[今日|きょう]{は}[休|やす]みです。あした{も}[休|やす]みです。", "en": "Today is a day off. Tomorrow is a day off too."},
        {"form": "これ／この", "tag": "ひとりで・＋もの · alone or + noun", "mark": "dot", "ja": "{これ}はわたしのペンです。{この}ペンは[安|やす]いです。", "en": "This is my pen. This pen is cheap."},
        {"form": "〜の／〜と", "tag": "どんな・AとB · of or and", "mark": "dot", "ja": "これは[日本語|にほんご]{の}[本|ほん]{と}ノートです。", "en": "These are a Japanese book and a notebook."}
      ],
      "check": {"id": "n5u01d6.c1", "kind": "choice", "type": "文の文法1", "label": "がっこうで", "q": "A：この[白|しろ]いノートは^だれの^ですか。B：[先生|せんせい]（　　）です。", "options": ["と", "の", "も"], "answer": 2, "why": ["先生とです would mean \"with the teacher\". A asked whose notebook it is.", "A asks だれの, \"whose\". 先生のです answers it: it is the teacher's.", "先生もです would mean \"the teacher too\". It does not say whose the notebook is."]}
    },
    "drill": [
      {"id": "n5u01d6.d1", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "[今週|こんしゅう]は[休|やす]みです。^[来週|らいしゅう]^（　　）^[休|やす]みです^。", "options": ["も", "を", "と", "か"], "answer": 1, "why": ["This week is a day off, and next week is the same, so も: \"next week too\".", "を marks the thing an action is done to. 休みです is not an action.", "と joins two nouns, as in 今週と来週は休みです. Here 来週 stands alone before 休みです, so と has nothing to join.", "来週か休みです is not a sentence. A question か goes at the very end, after です."], "explain": null},
      {"id": "n5u01d6.d2", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "^[先週|せんしゅう]^（　　）テストはどれですか。", "options": ["これ", "この", "の", "と"], "answer": 3, "why": ["これ stands alone and never comes before a noun. 先週これテスト is not Japanese.", "この points at a thing near you. It cannot come right after 先週.", "先週のテスト is \"last week's test\": の joins the two nouns.", "と means \"and\". 先週とテスト would be \"last week and the test\"."], "explain": null},
      {"id": "n5u01d6.d3", "kind": "choice", "type": "文の文法1", "label": "Choose the ending", "q": "（^ふたりでカレンダーを[見|み]ています^。）A「わあ、[毎日|まいにち]クラスがあります（　　）。」B「^ほんとうですね^。」", "options": ["か", "を", "よ", "ね"], "answer": 4, "why": ["か asks. A can see the answer, and B replies by agreeing, not answering.", "を marks the thing an action is done to. It cannot end a sentence.", "よ tells news the other person does not know. B is looking at the same calendar.", "Both can see the calendar, so A shares what they both see: ね. B agrees."], "explain": null},
      {"id": "n5u01d6.d4", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "^[父|ちち]は[先生|せんせい]です^。[母|はは]^も^[先生|せんせい]（　　）。", "options": ["を", "です", "じゃありません", "ます"], "answer": 2, "why": ["を marks the thing an action is done to. The sentence would have no ending.", "も says the mother is the same as the father. He is a teacher, so she is a teacher too: 先生です.", "This would say she is not a teacher. That does not match も after \"father is a teacher\".", "ます goes after a verb. 先生 is a noun."], "explain": null},
      {"id": "n5u01d6.d5", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "すみません、", "after": "ですか。", "tiles": ["この", "クラスは", "[何時|なんじ]", "から"], "star": 0, "bank": [2, 0, 3, 1], "hint": "この is followed by a noun. Which tile is a noun?", "full": "すみません、{この}クラスは[何時|なんじ]からですか。", "explain": "この needs a noun right after it, and クラスは is the topic. Then 何時から asks the start time, and ですか closes the question."},
      {"id": "n5u01d6.d6", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "A「[午後|ごご]もクラスがありますか。」B「はい、", "after": "よ。」", "tiles": ["[午後|ごご]は", "[中山|なかやま][先生|せんせい]の", "クラス", "です"], "star": 2, "bank": [3, 1, 0, 2], "hint": "Start with the topic. Whose class is it?", "full": "A「[午後|ごご]もクラスがありますか。」B「はい、[午後|ごご]は[中山|なかやま][先生|せんせい]{の}クラスですよ。」", "explain": "午後は is the topic, so it comes first. 中山先生の tells whose class, so it sits right before クラス. です closes the sentence, and よ after it tells A something new."}
    ],
    "exam": [
      {"id": "n5u01d6.e1", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "マリアさん（　　）　トムさんは　この　学校の　学生です。", "options": ["を", "の", "と", "も"], "answer": 3, "explain": "と joins two people: マリアさんとトムさん are both students here. の would make Tom \"Maria's Tom\", which makes no sense. マリアさんも　トムさんは does not work: for both you would need マリアさんも　トムさんも. を marks the thing an action is done to."},
      {"id": "n5u01d6.e2", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "A「あしたは　休みですか。」\nB「いいえ、あしたも　クラスが　あります（　　）。」", "options": ["よ", "を", "ね", "か"], "answer": 1, "explain": "A did not know and asked, so B tells new information: よ. ね is for something both people already know, but A just asked. か would turn B's answer into a question, and を cannot end a sentence."},
      {"id": "n5u01d6.e3", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "A「これは　あなたの　かさですか。」B「いいえ、", "after": "。友だちのです。」", "tiles": ["それは", "わたしの", "かさ", "じゃありません"], "star": 1, "bank": [2, 3, 0, 1], "full": "A「これは　あなたの　かさですか。」B「いいえ、それは{わたしの}かさじゃありません。友だちのです。」", "explain": "それは, わたしの, かさ, じゃありません. それは is the topic: the umbrella is near A, so B says それ. わたしの goes before かさ, and じゃありません comes last, after the noun."}
    ]
  },
  "scene": {"ja": "日本語学校のカレンダー", "en": "The week's calendar at a language school", "intro": "Tap each word on the calendar by the front door of your language school.", "words": [ …8 words… ], "check": {"id": "n5u01d6.k1", "kind": "choice", "type": "表記", "label": "How the exam asks it", "q": "あしたの　_ごご_は　テストが　あります。", "options": ["午後", "後午", "午前", "五後"], "answer": 1, "explain": "ごご is 午後: 午 (noon) and 後 (after). 午前 is ごぜん, the morning. 五後 uses 五, the number five, not 午. 後午 has the two kanji the wrong way round."}},
  "skill": {
    "kind": "reading",
    "ja": "情報検索",
    "en": "Finding information",
    "ask": "Which line of the notice holds the one fact you need?",
    "seconds": 90,
    "passage": "さくら日本語学校\n今週の　かいわの　クラス\n十二日（月）　午後　二時〜三時\n十三日（火）　^午前^　十時〜十一時\n十五日（木）　午後　二時〜三時\n^十六日（金）　午前^　十時〜十一時\n※　^十三日は　先生が　休みです。クラスは　ありません。^",
    "strategy": "Read the question first, then look only at the lines with 午前, and check the note at the bottom.",
    "item": {"id": "n5u01d6.r1", "kind": "choice", "type": "読解・情報検索", "q": "リンさんは　午前の　かいわの　クラスに　出たいです。何日に　学校へ　行きますか。", "options": ["十二日", "十三日", "十五日", "十六日"], "short": ["12日", "13日", "15日", "16日"], "answer": 4, "explain": "Only two lines say 午前: the 13th and the 16th. The note says the teacher is off on the 13th and there is no class, so Lin goes on the 16th.", "why": ["The class on the 12th is 午後, in the afternoon.", "The 13th has a morning class, but the note says the teacher is off and there is no class.", "The class on the 15th is 午後, in the afternoon.", ""]}
  }
}
```

### 6.4 The week test — shape and real examples

Shape: `"test": [ 24 items ]` in `uNN.json`, each a full choice or star item with `explain` (no `why`); reading items carry `passage` and `short`; the same passage is repeated on each item that reads it. N5 unit 1 mix: 漢字読み 2, 表記 2, 文脈規定 2, 言い換え類義 2, 文の文法1 7, 文の文法2 3, 読解 6 (areas: vocab 8, grammar 10, reading 6). No readings (`[x|y]`) anywhere; full-width spaces between phrases.

**Real examples: N5 unit 1 week test** (verbatim; 8 of the 24 items, one per type):

```json
"test": [
  {"id": "n5u01t.1", "kind": "choice", "type": "漢字読み", "label": "Kanji reading", "q": "わたしの　_国_は　ブラジルです。", "options": ["こく", "まち", "しま", "くに"], "answer": 4, "explain": "国 on its own is くに. こく is how 国 sounds inside longer words such as 中国, never alone. まち (town) and しま (island) are other words with other kanji."},
  {"id": "n5u01t.3", "kind": "choice", "type": "表記", "label": "Kanji spelling", "q": "_でんしゃ_で　学校へ　行きます。", "options": ["雨車", "電東", "雨東", "電車"], "answer": 4, "explain": "でんしゃ is 電車: 電 (electricity) with 車 (car). 雨 looks like the top of 電 but is あめ (rain), and 東 looks like 車 but is ひがし (east). Only 電車 is a word."},
  {"id": "n5u01t.5", "kind": "choice", "type": "文脈規定", "label": "Word in context", "q": "あしたは　学校が　（　　）です。", "options": ["休み", "名前", "入口", "電話"], "answer": 1, "explain": "学校が休みです means there is no school tomorrow. A school cannot be a name (名前), an entrance (入口) or a telephone (電話)."},
  {"id": "n5u01t.7", "kind": "choice", "type": "言い換え類義", "label": "Same meaning", "q": "_この　本は　ふるいです_。", "options": ["この　本は　あたらしいです。", "この　本は　あたらしくないです。", "この　本は　大きくないです。", "この　本は　たかくないです。"], "answer": 2, "explain": "ふるい (old) means the same as あたらしくない (not new). 大きくない is about size and たかくない about price, and あたらしい says the opposite."},
  {"id": "n5u01t.9", "kind": "choice", "type": "文の文法1", "label": "Choose the form", "q": "A「それは　日本の　お金ですか。」B「いいえ、日本の　お金（　　）。中国の　お金です。」", "options": ["ですよ", "じゃ　ありません", "です", "ですか"], "answer": 2, "explain": "B says いいえ and then names Chinese money, so B says it is not Japanese money: じゃありません. です and ですよ would say it is Japanese money, which clashes with いいえ, and ですか would ask a question back instead of answering."},
  {"id": "n5u01t.16", "kind": "star", "type": "文の文法2", "label": "Build the sentence", "before": "A「それは　何ですか。」B「", "after": "よ。」", "tiles": ["これは", "日本の", "おかし", "です"], "star": 2, "bank": [2, 0, 3, 1], "full": "A「それは　何ですか。」B「これは　日本の　{おかし}ですよ。」", "explain": "これは, 日本の, おかし, です. A says それ, so B, who holds it, says これは. 日本の describes おかし, so it comes just before it, and です goes before よ at the end."},
  {"id": "n5u01t.19", "kind": "choice", "type": "読解・内容理解（短文）", "label": "Short passage", "q": "これは　何の　おかしですか。", "options": ["お母さんの　国の　おかし", "りんごの　おかし", "バナナの　おかし", "マリアさんの　国の　おかし"], "answer": 3, "passage": "マリアさん\nきのうは　ありがとう　ございました。これは　わたしの　国の　おかしです。りんごの　おかしじゃ　ありません。バナナの　おかしです。とても　あまいですよ。二つ　あります。一つは　マリアさんの、一つは　お母さんのです。\nキム", "short": ["お母さんの国", "りんご", "バナナ", "マリアさんの国"], "explain": "キム writes バナナのおかしです right after saying it is not an apple sweet (りんごのおかしじゃありません). It is from キム's country (わたしの国), not マリア's, and お母さん is マリア's mother, who gets one of the two sweets."},
  {"id": "n5u01t.21", "kind": "choice", "type": "読解・情報検索", "label": "Finding information", "q": "リンさんは　日本語の　本が　ほしいです。何かいへ　行きますか。", "options": ["一かい", "三かい", "四かい", "五かい"], "answer": 4, "passage": "山川デパート\n五かい　本や・きっさてん\n四かい　子どもの　ふく・おもちゃ\n三かい　男の　人の　ふく\n二かい　女の　人の　ふく・かばん\n一かい　花や・くつ\nちか一かい　魚・やさい・おかし\n出口は　一かいの　東口と　西口です。", "short": ["一かい", "三かい", "四かい", "五かい"], "explain": "Books are sold at the bookshop (本や), on 五かい. 一かい has flowers and shoes, 三かい has men's clothes, and 四かい has children's clothes and toys."}
]
```

### 6.5 Authoring rules that are not in the build (content/n5/drafts/BRIEF.md)

The course is drafted by agents from a brief and reviewed by a native teacher. Rules worth carrying over:
1. Every item has exactly one right answer; every wrong option clearly wrong to a native speaker; every star item fits in only one order ("check each tile against every other slot").
2. No false rules: a reason must not teach a rule that is not true in general.
3. All sentences original (no textbook or past-paper copies); natural, polite style unless the point needs plain forms.
4. Level: only the level's grammar and vocabulary; lean on the day's points and earlier units; most sentences under 20 characters.
5. Support text (readings) in teach, compare and drill text; none in exam-style items, the scene check, reading passages and questions.
6. Drill choice items have `why` (one line per option, the right one included); exam-style items one `explain` covering the right answer and why the others fail.
7. Drill: 6 items = 4 choice (4 options) + 2 star, at least two on each point; `^…^` marks the clue in every choice sentence; star items need `hint`, `full`, `explain`, `star`, `bank` not 0,1,2,3.
8. Compare: one-sentence intro; three forms (the two new points + one earlier point or common confusion); `mark` dot (neutral) / down (negative meaning) / up ("more"); `tag` = short target-language label · English gloss; a 3-option check.
9. Explanations: plain short English, no em-dashes, "explain with the sentence in front of the learner".
10. Before finishing: re-read as a strict examiner, try every wrong option and every other tile order; report doubts in under 150 words so they are flagged amber for the reviewer.

---

## 7. What the build checks (tools/build-course.mjs), and the QA pipeline

**Markup** (every checked string): even number of `_` and of `^`; `{ }` balanced and never nested; every `[...]` is exactly `[base|reading]` (one `|`, both sides non-empty).

**Every item**: has an `id`, unique across **all** levels (`allIds` is never reset between levels — hence the `n5` prefixes); has a `type`; `kind` is `choice` or `star`; markup checked in `explain` and `hint`.

**choice**: `q` present (markup checked); ≥2 options; `answer` in 1..n; options all different **and still different once readings and markup are removed**; markup checked in each option; `why`, if present, has one line per option; `short`, if present, one per option; `why` or `explain` required; a wrong option's `why` line may be empty only if `explain` exists; `q` must contain `（　　）`, an `_underlined_` part or `★` unless the type matches `/読解|内容理解|主張|情報検索|課題|概要|即時|ポイント|統合|用法|発話/`.

**star**: exactly 4 tiles; `star` in 0..3; `bank` lists 0..3 once each and is not already 0,1,2,3; tiles all different; `full` and `explain` required; markup checked in `full`; `plain(full)` with ASCII and ideographic spaces removed equals `before + tiles.join('') + after` with the same removal ("spaces between phrases (as the N5 paper writes) do not count").

**Days**: day title equals the syllabus title (days 1–5 from `units.json`, day 6 `まとめ：似ている文法`); every point has `form` and `gloss`; connect rules and example sentences markup-checked; every example has an `en`; days 1–5 have exactly 2 points; compare forms' `ja` checked and `compare.check` validated as an item; drill ≥4 items; exam exactly 3; a scene with ≥4 words and a valid `scene.check`; a skill of kind `reading` or `listening`, passage markup-checked, `skill.item` valid; a listening skill has `audio` lines `[N|M|F, text, respelling or null]`. Clip names are filled in when missing.

**Level script check** (N5/N4/N3): every string except the label keys `type, label, title, tag, id, clip, kind, step, form` (and the skill's own `ja`/`en`) may only use the level's kanji (ruby base text included). **Strokes**: every kanji of every scene word must exist in `strokes.js`. Week-test and mini-mock items are validated the same way. Any problem → exit 1 with the list; nothing is written.

**QA pipeline** (content/README.md "Before content goes to the reviewer"): (1) build passes; (2) `content-sweep.js` opens every lesson screen of every written day, gives every possible answer and checks each explanation fits with nothing cut off (screens are only inspected once animations settle); (3) blind check: `tools/blind-export.py` writes the questions without answers, a solver who never saw the answers solves them, `blind-compare.py` diffs, any disagreement or second defensible answer is fixed or flagged; (4) a review sheet per unit goes to the native reviewer. Plus `tools/balance-answers.py`: rotates options so right answers spread over positions 1–4 by a hash of the item id (moves `why`, `short` and "option N" references with them; leaves spoken-order and numeric options alone; `--even` deals positions out evenly).

---

## 8. Yaoki defects and weak spots not to copy

1. **Exam drops the underline** (verified bug): question text is mapped to `{ t, text: true, ws: 'normal' }`, so `_国_` in week-test vocabulary items (漢字読み, 表記, 言い換え類義) shows no underline. Keep `line` in exam conditions; drop only support (readings) and highlights.
2. **Raw markup in the drill's answer line** (verified bug): `answerLabel: star ? it.tiles[it.star] : …` is not passed through `C.plain`; 101 of 372 drill star items have markup in the star tile (`[日本語|にほんご]の`). Always `plain()` labels. Same for Compare option labels (rendered raw).
3. **Newlines collapse** in Drill and Exam question cards (no `pre-line`), so `A「…」\nB「…」` runs together. Use `white-space: pre-line` or render turns as lines.
4. The exam close button's aria-label is hard-coded `Leave the exam-style step` even in week-test mode (`SETS.leave` exists but is unused).
5. Standalone Teach cannot reach page 2 (Next calls `preventDefault` and `save` is absent). Fall back to local state when there is no `save`.
6. Drill progress inside the step is not saved: "つづける　Continue the drill" restarts at item 1. Either save the index or label it honestly.
7. Star.dc.html is hard-coded, allows retry after checking (unlike the Drill) and saves a stale top-level `g`. Build the showcase from course data (or mount Drill with an item index).
8. The Teach `pos` chip is a fixed 72px column, designed for N2's short labels (`動・い形`); N5–N3 content uses long English (`Noun (the topic), then noun (what it is)`, up to 127 characters), which wraps into a tall narrow column. Stack a long `pos` above the rule.
9. No focus management or live region when the answer sheet opens; no `lang` on the Japanese part of bilingual labels (the N1 app adds `<span lang="ja">`).
10. Option layout uses a character count tuned to kana (`> 7`), and Compare forces all options into one row.
11. The N1 Star uses `{{ !hintOpen }}` in an `sc-if`; the format rules say expressions in holes fail silently. Compute a `hintClosed` flag instead.

---

## 9. Adapting to Guarani for Spanish speakers

Context: the learner reads Spanish (likely Paraguayan; the user's own day-flow test pins time to "noon in Asunción"), learns Paraguayan Guarani (avañe'ẽ). Every Guarani string below is **illustrative and must be checked by a native speaker**, exactly as Yaoki's content goes to a native reviewer.

### 9.1 What carries over as is

- The loop and its order (Teach ×2 → Compare + check → Drill → Exam-style → result), the three-lesson day, `g` 0..3 with forward-only `Math.max` saves, `tp`, `set: 'day' | 'test'`, the まとめ day (Compare first, the week's look-alikes) and the 20-minute week test.
- The props contract (`app, go, save, miss`), `nav()` on real links, the designed-moment pattern, the single prototype artboard, ExamResult as `dc-import` of Exam with `view="result"`, the `view` Tweak.
- Both item kinds with every mechanic: one try in the drill, reasons for every option incl. the right one, `your pick`, explain fallback, hint only in the drill (better: on request, as N1), the clue revealed after answering, Check disabled until ready, verdict-coloured sheet and Next, numbered "as on the paper" star in exam conditions.
- The exam clock logic (real-time deadline, red under 30 s, time-up path, unanswered recorded), answers only at the end, and the mistake notebook contract (`miss({src, wrong})`, 1/3/7 days, three right in a row clears, "order wrong" as its own label).
- Content as JSON validated at build time, generated `course-<level>.js`, ids, answer-position balancing, blind solve, native review sheet, content sweep, the drafting brief.
- The tactile visual language (2px ink borders, hard offset shadows, pressed state, 44px targets) if the visual direction keeps it.

### 9.2 What must change, and why

| Yaoki feature | Why it does not carry | Guarani replacement |
|---|---|---|
| Furigana `[漢字\|かな]`, "no furigana" in exam conditions | Guarani is written in a phonemic Latin alphabet; nothing needs a reading | Optional support line: `[word\|gloss]` with a Spanish gloss or a morpheme split (`[ndajapói\|nd·a·japo·i]`), shown in Teach/Compare/Drill, dropped in the exam ("sin ayudas"); or tap/hold-to-gloss (as Yaoki Reader) |
| Kanji level lists, `kanjiCheck`, `below`, strokes check, writing practice | No logographic script | A vocabulary-level list (lemmas/roots per level) as warnings; an alphabet check (§9.3 d) |
| Patterns are separate words/particles (`は`, `ばかりに`) highlighted whole | Guarani marks much grammar with prefixes, suffixes and enclitics inside the word: `a-/re-/o-/ja-/ña-/ro-/pe-`, `nd-…-i`, `-pe/-me`, `-gui`, `-ndive`, `-kuéra/-nguéra`, `-ta`, `-ma`, `-pa` | Highlight **inside** words: `{nd}ajapó{i}`, `óga{pe}`, `tetã{me}`, `mitã{nguéra}`; render intra-word highlights with `padding: 0` (Yaoki's `0 3px` would open gaps inside the word) |
| Orthography: kana | Guarani needs nasal vowels `ã ẽ ĩ õ ũ ỹ`, `g̃` (no precomposed form: U+0067 + U+0303), `y` as a vowel, the puso `'` (glottal stop), acute stress marks `á é í ó ú ý`, `ñ`, digraphs `ch mb nd ng nt rr` | NFC normalization, one canonical puso character, a font that renders all of them (§9.3 f) |
| Morphophonology is invisible to tile joining | Accents appear and nasal allomorphs switch at suffix boundaries: `kokue` → `kokuépe`, `ajapo` → `ndajapói`, `tetã` + `-pe` → `tetãme`, `ja-` → `ña-` before nasal roots, `nd-` → `n-` (`añe'ẽ` → `nañe'ẽi`) | Star tiles in **surface form** (as they appear in the sentence); a "build the word" variant uses surface pieces (`nda` + `japó` + `i` = `ndajapói`) |
| Star items rely on Japanese's fixed order | Guarani word order is freer (SVO/SOV, pro-drop), so a 4-tile sentence often has more than one acceptable order | Build star items on fixed-order constructions: possessor + noun (`che róga`), demonstrative + noun (`ko óga`), noun + adjective (`óga tuicha`), the postposition on the last word of the noun phrase (`ko tetã porãme`), `ikatu`/`ndaikatúi` + verb; the blind native solve is mandatory |
| JLPT item types (`文の文法1`, `漢字読み`, …) and `C.area` regexes | No JLPT | An app-defined taxonomy in Spanish (§9.3 e) |
| English explanations, Japanese-first labels | The learner reads Spanish | Spanish (`es`) explanations and UI; Guarani-first bilingual labels (§9.3 g) |
| Kana-tuned widths (`> 7` chars → 1 column; Compare options in one row; 72px pos chip; `nowrap` tiles) | Latin words are wider per letter and agglutinated words get long | Width-based thresholds (§9.3 h), `overflow-wrap: anywhere` on tiles/options |
| ○ = right, × = wrong (maru/batsu) | A Japanese convention; Spanish speakers read ✓ as right | ✓ check for right (keep ✗ for wrong) |
| `line-break: strict`, `lang="ja"`, Klee One / M PLUS Rounded 1c | Japanese typography | `<html lang="es">`, `lang="gn"` on Guarani containers and label parts, Guarani-capable fonts |
| Kokoro TTS for clips | No Guarani voice | Native recordings (best) or an MMS-type Guarani TTS; the screens already degrade without clips (use about 600 + 70 ms per letter for the silent fallback instead of 120 ms per kana) |
| Teacher's stamp phrases (`たいへん よく できました`) | Japanese school culture | A local equivalent (WeekTest/visual agent) |

### 9.3 Concrete suggestions

**a) Content keys.** Same shapes, with `ja` → `gn` and `en` → `es`: examples `{gn, es, clip?}`; compare forms `{form, tag, mark, gn, es}`; scene `{gn, es, intro, …}`; skill `{kind, gn, es, …}`; `gloss`, `note`, `hint`, `why`, `explain`, `intro`, `strategy` in Spanish; `watch.bad`/`watch.good` in Guarani. Level prefix in ids, e.g. `a1u01d1.d1` (sessions `a1u01d1`, `a1u01t`).

**b) Markup v2** (keep the parser, change rendering):

| Markup | Guarani use |
|---|---|
| `{…}` | the pattern, also inside words: `Che {nd}aikuaá{i}.` → render with `padding: 0`, `border-radius: 3px`, still `#FFE9B0`-style highlight |
| `_…_` | the word or affix a question asks about (also kept in exam conditions, see §8.1) |
| `^…^` | the clue (unchanged) |
| `[base\|annotation]` | optional: a Spanish gloss or `·`-separated morpheme split over a Guarani word in Teach/Compare/Drill (rt ≥10px, not 9px); dropped with `ruby:false` in the exam |
| `（　　）` | keep as the canonical blank token (the build and balancer already know it), but have `rich()` emit a `{blank: true}` segment so every screen draws the same blank box (the exam's 40×22 underline) instead of printing full-width parentheses in Latin text; a blank can sit inside a word for an affix (`tetã（　　）`) |

**c) Engine (`gn-course.js`, the `course.js` counterpart).** Keep `rich`, `plain`, `sessions`, `day`, `unit`, `item`, `complete`, `plan`, `status`, `miss`, `due`, `reviewed`, `view`, `handlers`, `area`. Add `norm(s)` = NFC + canonical puso, used by `plain()`, option uniqueness and any answer comparison. Make `rich()` set `pad: '0'` when a highlight touches letters on either side, and carry `lang` per segment if mixed text appears.

**d) Validation v2** (keep every structural rule of §7; change or add):
- Keep: balanced markup, answer range, `why`/`short` lengths, a reason for every wrong option, star = 4 tiles / star 0..3 / bank permutation not identity / tiles unique / `full` + `explain`, 2 points on days 1–5, ≥4 drill, exactly 3 exam, titles match the syllabus, unique ids, every example has a translation (`es`).
- Change: "unique once readings are removed" → unique after `norm()` (accents and tildes kept: they are meaningful); the `full` = before + tiles + after check compares after `norm()` with whitespace removed; the blank-exemption regex uses the new type names; `kanjiCheck` → vocabulary-level warnings; drop the strokes check.
- Add: refuse non-NFC text; one puso character only (refuse `’`, `ʼ`, `‘` and the acute `´` typed as a puso, or normalize them, consistently); `g̃` must be U+0067 U+0303; warn on letters outside the Guarani alphabet + accepted loans (catches Spanish words slipping in); warn when two options differ only by diacritics (legitimate for spelling items, but the reviewer should see them).

**e) Item types and areas** (replace JLPT types; `C.area` keys stay `vocab`, `grammar`, `reading`, `listening`):

| Type (Spanish) | Asks | Yaoki counterpart | Area |
|---|---|---|---|
| `Gramática · forma` | choose the form (affix, particle, person prefix) | 文の文法1 | grammar |
| `Gramática · orden` | build the sentence (★) | 文の文法2 | grammar |
| `Gramática · palabra` (optional) | build the word from surface pieces (★) | new | grammar |
| `Vocabulario · contexto` | word in context | 文脈規定 | vocab |
| `Vocabulario · mismo significado` | closest meaning | 言い換え類義 | vocab |
| `Vocabulario · uso` | which sentence uses the word right | 用法 | vocab |
| `Escritura` | the right spelling: nasal tilde, puso, acute, `ñ`, `g̃` | 表記 | vocab |
| `Pronunciación` | which syllable is stressed / which word is nasal (audio options) | 漢字読み | vocab |
| `Lectura · …`, `Escucha · …` | as Yaoki's skills | 読解, 聴解 | reading, listening |

**f) Fonts** (only Google Fonts `css2` links are allowed on the canvas). Klee One's role (the textbook face for the target language) needs a face with full combining-mark support: **Andika** (SIL, designed for literacy, correct mark placement incl. `g̃`) is the strongest candidate; **Gentium Book Plus** or **Charis SIL** for a serif textbook feel. For the UI, a rounded sans with Vietnamese/extended Latin coverage (e.g. **Nunito**, 500/700/800) — check whether M PLUS Rounded 1c covers `ẽ ĩ ũ ỹ g̃`. Test string on an iPhone before committing: `Ñañe'ẽ guaraníme · ã ẽ ĩ õ ũ ỹ g̃ G̃ · á é í ó ú ý · kokuépe · ndajapói · mitãnguéra`.

**g) Labels: Guarani first, Spanish second.** Same pattern as Yaoki: kickers `GN + space + ESPAÑOL EN MAYÚSCULAS`, buttons `GN · Español`, verdict `GN` big + Spanish small, long instructions in Spanish only, `<span lang="gn">` around the Guarani part. Candidate terms (confidence in brackets; all need the native check):

| Yaoki | Guarani candidate | Spanish |
|---|---|---|
| `せいかい！ Correct` | `¡Iporã!` [high] | ¡Correcto! |
| `おしい！ Not quite` | `¡Haimete!` ("casi") [high] | Casi |
| `例文　Examples` | `Techapyrã` [high] | Ejemplos |
| `注意　Watch out` | `¡Ñatende!` [high] | Atención |
| `確認　QUICK CHECK` | `Porandu` ("pregunta") [high] | PREGUNTA RÁPIDA |
| `練習 DRILL` | `Tembiapo` ("trabajo, tarea") [medium] | PRÁCTICA |
| `おわる　Finish` / `本番 おわり` | `Opáma` ("ya terminó") [high] | Terminar / Prueba terminada |
| `週テスト　WEEK TEST` | `Arapokõindy` ("semana") + a word for test [week: medium; test: verify] | PRUEBA DE LA SEMANA |
| `解説　Why` | `Mba'ére` ("por qué") [high] | Por qué |
| `似ている文法　COMPARE` | `Ñembojoja` ("comparación") [medium] | COMPARAR |
| `本番　EXAM-STYLE` | `Ñeha'ã` ("intento, prueba") [low: verify] | PRUEBA |
| `学習 LEARN` | `Ñembo'e` / `Mbo'epy` ("estudio, lección") [low: verify] | APRENDER |
| `済` stamp | `Oĩma` ("ya está, listo") [medium] | Listo |
| `ヒント　HINT · drill only` | — | Pista · solo en la práctica |
| `タイル　Tiles` | — | Fichas |
| `こたえる　Check` | `Embohovái` ("respondé") [medium] | Comprobar |

Spanish register: Paraguayan voseo reads local (`Elegí la forma`, `Ordená las cuatro fichas. Tu respuesta es la ficha de la estrella.`, `Guardado en tu cuaderno de errores. Vuelve mañana.`, `Sin pistas ni ayudas. Las respuestas, al final.`, `Tu respuesta:` for `あなたの答え：`, `Sin respuesta` for `無解答`, `Orden equivocado` for `順番が違う`); a product decision, `tú` is the neutral alternative.

**h) Layout thresholds for Latin text.** Drill/Review options: 2 columns only if every option fits in about 15 characters at 16px (a 2-column button is ~175px wide minus 24px padding and the number); otherwise 1 column. Compare check: one row only when every option is ≤ 10 characters, else a column. Teach `pos`: `min-width: 72px` with auto width, or stacked above the rule when longer than ~12 characters. Star tiles and slots: allow `overflow-wrap: anywhere` and `min-width: 0` so a long word (`mbo'ehaópe`, `mitãnguéra`) never overflows the 390px frame. Keep `white-space: pre-line` for two-speaker questions.

**i) Grammar that makes strong Teach/Compare/Watch-out pages for Spanish speakers** (these are where Spanish interferes):
- Negation is two pieces, `nd-…-i` (`ndajapói`, `ndaikuaái`, `ndaikatúi`), and `n-…-i` with nasal verbs (`nañe'ẽi`): watch-out bad `Che ndajapo.` / good `Che ndajapói.` (Spanish has one "no" in front only).
- `-pe` vs `-me` (`ógape`, `Paraguáipe` vs `tetãme`, `guaraníme`), and the accent that appears (`kokue` → `kokuépe`).
- Two "nosotros": `ñande` / `ja-, ña-` (inclusive) vs `ore` / `ro-` (exclusive) — a Compare page Spanish cannot model.
- Person prefixes `a- re- o- ja-/ña- ro- pe- o-` with `che nde ha'e ñande ore peẽ ha'ekuéra`; areal vs aireal (`aiko`, `reiko`, `oiko`) vs chendal (`che…`) verbs.
- Plural `-kuéra` / `-nguéra` (`jaguakuéra`, `mitãnguéra`).
- Possessed nouns with t/r/h (`téra` → `che réra` → `héra`; `óga` → `che róga` → `hóga`).
- Tense/aspect suffixes and particles (`-ta` future, `-ma` already, `hína` progressive, `-se` want).
- Questions with `-pa` / `-piko` (`Reñe'ẽpa guaraníme?`, `Mba'éichapa?`).

**j) The same JSON shape in Guarani** (illustrative wording, for the designed moments and the screen writers; every string to be checked):

```json
{
  "id": "a1u01d1.p2", "form": "nd- … -i", "gloss": "no (negación del verbo)",
  "connect": [
    {"pos": "Verbo oral", "rule": "{nd} + ajapo + {i} → {nd}ajapó{i}"},
    {"pos": "Verbo nasal", "rule": "{n} + añe'ẽ + {i} → {n}añe'ẽ{i}"}
  ],
  "examples": [
    {"gn": "Che {nd}aikuaá{i}.", "es": "Yo no sé."},
    {"gn": "{N}añe'ẽ{i} guaraníme.", "es": "No hablo guaraní."}
  ],
  "watch": {"note": "La negación tiene dos partes: nd- (n- con verbos nasales) adelante y -i al final.", "bad": "Che ndajapo.", "good": "Che ndajapói."}
}
```

```json
{"id": "a1u01d1.d1", "kind": "choice", "type": "Gramática · forma", "label": "Elegí la forma",
 "q": "—¿Reñe'ẽpa guaraníme? —^Nahániri^, che（　　）guaraníme.",
 "options": ["añe'ẽ", "nañe'ẽi", "ndañe'ẽi", "nañe'ẽ"], "answer": 2,
 "why": ["añe'ẽ dice que sí lo hablás, pero la respuesta empieza con nahániri (no).",
         "ñe'ẽ es nasal: la negación lleva n- adelante y -i al final.",
         "nd- va con verbos orales, como ndajapói. Con ñe'ẽ, que es nasal, va n-.",
         "Falta la -i del final: la negación tiene dos partes."]}
```

```json
{"id": "a1u01d1.d5", "kind": "star", "type": "Gramática · orden", "label": "Armá la frase",
 "before": "Che", "after": ".", "tiles": ["aiko", "ko", "tetã", "porãme"], "star": 2, "bank": [3, 1, 0, 2],
 "hint": "-me va pegado a la última palabra del grupo. ¿Qué va justo después de ko?",
 "full": "Che aiko ko {tetã} porãme.",
 "explain": "aiko es el verbo. ko va antes del sustantivo tetã, porã va después, y -me se pega a la última palabra del grupo: porãme."}
```

(The star example only demonstrates the mechanics — fixed order inside the noun phrase, the postposition on its last word, join check `Che + aiko ko tetã porãme + .` passing once spaces are removed. A real day keeps every item on the day's two points.)

**k) Designed moments for the Guarani canvas.** Pick one fully written sample day and default every loop artboard to it, mirroring Yaoki's choices: Teach on pattern 1 (a pattern with an intra-word highlight and an accent that appears, e.g. negation); Compare unanswered; Drill on item 1 answered wrong and explained (clue underlined, `your pick`, ✓/✗ reasons); Star with two tiles placed and the hint open; Exam on question 2 of 3 with an option pressed in at 1:42; ExamResult at 2 / 3, 1:48 of 2:30, the star item wrong.

**l) Fix list from §8 to build in from the start**: keep the underline in exam conditions; `plain()` every label; `pre-line` for dialogue; mode-aware close labels; local fallback for standalone paging; save the drill index (or say "Empezar de nuevo"); data-driven Star showcase; stack long `pos`; focus the sheet's verdict (or `aria-live="polite"`) when it opens; `lang="gn"` spans in labels; no expressions in holes.

---

## 10. Source files read

- Screens: `yaoki/project/Teach.dc.html`, `Compare.dc.html`, `Drill.dc.html`, `Star.dc.html`, `Exam.dc.html`, `ExamResult.dc.html`; context: `Today.dc.html`, `App.dc.html`, `WeekTest.dc.html`, `Main.dc.html` (session opening), `Review.dc.html` (notebook re-ask), `canvas.json`.
- Engine: `yaoki/project/course.js` (rich, plain, sessions, complete, plan, miss/due/reviewed, fresh, view, handlers, area); `sound.js` (API only).
- Content: `content/README.md`, `content/n5/units.json`, `content/n5/u01.json` (days 1 and 6 and the test in full), `content/n2/u03.json` (the designed-moment day `u03d4`), `content/n5/drafts/BRIEF.md`.
- Tools: `tools/build-course.mjs`, `tools/balance-answers.py`, `tools/blind-export.py`; checks `check/flow-test.js`, `check/content-sweep.js` (opening).
- Shipped app (to confirm bugs): `docs/assets/screens.js`; app screen lists in `yaoki-app/build.mjs` (main app plays no Star; the N1 app has its own data-driven Star in `yaoki-n1/project/Star.dc.html`).
- Canvas format: `artifact-files/25ff9d90-…/SKILL.md`, `artifact-type/reference/format.md`.
