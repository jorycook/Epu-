# Y1 · Plan screens, prototype wiring and the course engine (Yaoki → Guarani)

Source read in full (all paths under `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki/`):
`yaoki/project/App.dc.html`, `Goal.dc.html`, `Main.dc.html`, `Today.dc.html`, `Readiness.dc.html`, `course.js` (386 lines),
`yaoki-app/src/Shell.dc.html`, `yaoki-app/src/yk-app.js`, `yaoki-n1/SCREENS.md`, `README.md`; plus, for exactness,
`yaoki/project/canvas.json`, `yk-runtime.js`, `app.css`, `index.html`, the save/miss call sites of every other screen,
`yaoki-n1/project/n1.js` (plan part), N1 `Main`/`Goal`/`Readiness` logic, and the canvas `format.md` / `SKILL.md`.
Numbers marked "verified" were computed by running `course.js` (pure logic) in a VM with the real course data, with
today = 2026-11-03. Guarani strings marked **[revisar]** must be checked by a native speaker or teacher before use.

---

## 0. The ten things that matter most

1. **One artboard holds the whole flow.** `App.dc.html` keeps ONE state object (`window.ykCourse.fresh()`), and shows
   one screen at a time with `<sc-if value="{{ at.X }}">` + `<dc-import name="X" …>`. Every screen gets the SAME five
   props: `go`, `app`, `save`, `miss`, `reviewed` (the installed app's Shell adds `menu`). Copy this pattern exactly.
2. **Every screen is also a standalone artboard** that shows a "designed moment": `const app = this.props.app || <sample>`.
   The sample is built with the real engine (`C.view({...sample state...})`) or a small literal (`{ sid, day, prog }`).
3. **Navigation works in both worlds with one idiom**: an `<a href="X.dc.html" onClick="{{ toX }}">` styled as the
   button, and `nav = (to) => (e) => { const go = this.props.go; if (go) { e.preventDefault(); go(to); } }`.
   On the canvas (no `go`) the link moves Play to the other artboard; inside App/app, `go()` switches screen.
4. **The plan is settings, not a list of days**: `plan = { start, exam, pace: 'fit'|'steady', minutes }`. Dates are
   recomputed every render by `C.plan()`. Progress (`done`, `tests`) is keyed by session id, independent of the plan,
   so re-planning never loses progress. (The N1 app is the opposite: a stored list of days with progress inside.)
5. **A week = 7 sessions**: days 1–5 study, day 6 まとめ (review/compare), day 7 week test. Sessions = units × 7.
6. **Completion**: a study session is complete when `g >= 3 && k >= 1 && r >= 1`; a test when `tests[id]` exists.
   `save({ prog })` only ever raises values (`Math.max`). Stamps = complete sessions.
7. **Notebook spacing**: a miss is due after 1 day; right answers push it to +3 then +7 days; the 3rd right in a row
   clears it; a wrong answer sends it back to step 0, +1 day.
8. **Levels**: each level has its own plan and mini-mock result (swapped on switch); progress and mistakes coexist
   (ids carry the level). A level with no written day is disabled ("準備中"); a day not written shows "N日目 · 準備中"
   and is locked; Readiness is hard-gated to N2 (`lv !== 'N2'`) in three nav bars.
9. **Look**: ground `#F4F5F9`, ink `#1B2440`, indigo `#2F4FD0`, daruma red `#E2452B` (art/borders) / `#C7361E` (text),
   gold `#F2B43A`; 2px ink borders with hard offset shadows `0 4px 0 #1B2440`; radii 14/16/20/22/26; M PLUS Rounded 1c
   500/700/800; top 50 px and bottom 34 px left empty for the phone's bars; bilingual labels "日本語　English".
10. **Guarani must-changes for this area** (detail in §6): Klee One cannot render ẽ or g̃ (no vietnamese subset; verified)
    → use e.g. Andika for target-language sentences, keep M PLUS Rounded 1c for UI (it covers ã ẽ ĩ õ ũ ỹ + U+0303,
    verified); the exam date becomes an optional target date (the engine already supports `exam: null`); JLPT levels →
    A1–B2-style levels; the static N2 Readiness → computed from week-test area results (already stored); kanji writing
    (`wrote`, `wroteWords`, `below`) → spelling practice of nasal vowels/puso/g̃; NFC + puso-normalising text helpers;
    Spanish UI with Guarani accents (`lang="es"` root, `lang="gn"` spans); fix the drifting designed moment and the
    Today id-regex bug (§6.6).

---

## 1. Wiring: the prototype artboard and the app around it

### 1.1 `App.dc.html` (canvas title "Prototype · play the whole flow")

Head (order matters only in that data must exist before render; `support.js` line must be exact and first):
```html
<script src="./support.js"></script>
<script src="./sound.js"></script>
<script src="./course-n2.js"></script><script src="./course-n5.js"></script>
<script src="./course-n4.js"></script><script src="./course-n3.js"></script>
<script src="./course.js"></script>
<script src="./sound-course.js"></script><script src="./sound-mock.js"></script><script src="./sound-lessons.js"></script>
<script src="./strokes.js"></script><script src="./yk-write.js"></script>
```
Helmet: Google Fonts link `https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600&display=swap`,
then `body{margin:0} button{font:inherit;color:inherit;cursor:pointer} a{color:#2F4FD0;text-decoration:none}a:hover{color:#1B2440}
rt{font-size:9px;font-weight:400;color:#5A6382} @keyframes yk-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`.

Body: a 390×844 root `position: relative; overflow: hidden; background: #F4F5F9; color: #1B2440; font-family: 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif`,
then ONE line per screen (16 screens, in this order: Goal, Main, Today, Teach, Compare, Drill, Exam, Review, Mock, MockRun,
Scene, Reading, WeekTest, Notebook, Readiness, Listening):
```html
<sc-if value="{{ at.Goal }}" hint-placeholder-val="{{ true }}"><div style="animation: yk-in 220ms ease-out"><dc-import name="Goal" go="{{ go }}" app="{{ app }}" save="{{ save }}" miss="{{ miss }}" reviewed="{{ reviewed }}" hint-size="390px,844px"></dc-import></div></sc-if>
```
(only Goal has `hint-placeholder-val="{{ true }}"`; all others `{{ false }}`, so the streaming placeholder is the Goal screen).
The wrapper div re-mounts on each screen change, so every screen enters with `yk-in` (fade + 10 px rise, 220 ms).

Logic (whole thing):
```js
const SCREENS = ['Goal','Main','Today','Teach','Compare','Drill','Exam','Scene','Reading','WeekTest','Notebook','Review','Mock','MockRun','Readiness','Listening'];
class Component extends DCLogic {
  constructor(props) { super(props);
    this.state = window.ykCourse.fresh();                                   // one shared memory
    this.h = window.ykCourse.handlers(() => this.state, (fn) => this.setState(fn)); }
  renderVals() { const s = this.state; const at = {}; SCREENS.forEach((n) => { at[n] = s.screen === n; });
    return { at, app: window.ykCourse.view(s), go: this.h.go, save: this.h.save, miss: this.h.miss, reviewed: this.h.reviewed }; }
}
```
`data-props='{"$preview":{"width":390,"height":844}}'`. Note: App passes no `menu` and no `level` handler; on the canvas
the level is changed by going back to Goal (Main's level chip falls back to `nav('Goal')`). Star.dc.html exists as an
artboard but is not in the main app's SCREENS (the ★ question is inside Drill); N1 adds 'Star'.

### 1.2 The props contract (what each screen receives)

| prop | type | what it is | declared in the screen's `data-props` |
|---|---|---|---|
| `go(to)` | fn | switch screen (`to` = screen name); also sets `started` | `"go":{"editor":null}` |
| `app` | object | `C.view(state)`: everything a screen reads (§2.4) | `"app":{"editor":null}` |
| `save(patch)` | fn | merge a patch into the shared state, with rules (§2.5) | `"save":{"editor":null}` |
| `miss({src, wrong})` | fn | put a wrong answer in the notebook | `"miss":{"editor":null}` |
| `reviewed(src, right)` | fn | record a notebook review answer | declared only in Review |
| `menu()` | fn | Shell only: open the menu sheet (Main's level chip) | Main only |

Every screen guards each call: `if (this.props.save) this.props.save(...)`, `if (this.props.miss) …`, so the standalone
artboard never throws. Callbacks/objects are declared `{"editor": null}` (no Tweaks control). Exam and MockRun also take a
`view` enum tweak (question/result; intro…answers) used by "moment boards" (§1.4).

### 1.3 Navigation idiom (copy verbatim)

```js
const nav = (to) => (e) => { const go = this.props.go; if (go) { e.preventDefault(); go(to); } };
```
- Markup: `<a href="Today.dc.html" onClick="{{ toToday }}" style="…button look…">…</a>` (the `<a>` IS the button; a
  `<button>` inside an `<a>` swallows the click).
- Handlers that also save: `toExam: (e) => { if (this.props.save) this.props.save({ set: 'day' }); nav('Exam')(e); }`.
- A control that must do nothing on the canvas AND in the app (a locked node, a disabled tab):
  `(e) => { if (this.props.go) e.preventDefault(); }` or `(e) => e.preventDefault()`.
- In the installed app, `yk-app.js` swallows any click on an unhandled `a[href$=".dc.html"]`, so a forgotten handler
  never navigates the page away.
- Pure local-state controls (Goal's "paint the eye", the date sheet) are `<button onClick>` and work on the canvas too.

### 1.4 Designed moments (how a screen looks when opened alone)

| screen | fallback when `this.props.app` is missing | what the board shows |
|---|---|---|
| Main | `C.view({ plan: { start: '2026-10-11', exam: '2026-12-06', pace: 'fit' }, done: { u03d1: {g:3,k:1,r:1}, u03d2: {…}, u03d3: {…} }, cur: 'u03d4' })` | N2 week 3 "原因・理由 / Cause and reason", days 1–3 stamped 済, day 4 big blue "today" node with callout "今日 TODAY · 3 lessons · 2 a day", days 5–6 locked, gold 試 test; chips: 3 stamps, live days-left (あと33日 on 2026-11-03) |
| Today | `{ sid: 'u03d4', day: C.day('u03d4'), prog: { g: 1 } }` | "第3週 · 4日目", title 〜ばかりに・〜あまり, grammar card active with pills done/now/todo and "つづける　Continue the drill"; words card 市役所で　At the city office · 8 words; reading 筆者の考え　The writer's view; footer "Finish all three lessons to stamp day 4 on your card." |
| Goal | level = `props.app.level` or `C.level()` (N2); local state `{ level, pace: 30, fit: 'fit', painted: false, sheet: false }` | blank-eyed daruma, N2 selected, 30分 selected, exam 2026年12月6日（日）, live days-left; for N2 the plan does not fit, so the 全部入れる/1日1回 pair shows |
| Readiness | none: fully static markup | 99/180, three sections 44/38/17, "Not passing yet" |
| Teach, WeekTest, Notebook, Exam | similar samples (u03d4 first pattern; 18/24 result; three mistakes; mid-question `{ i: 1, answers: [2,1,null], t: 102 }`) | — |

**Moment boards**: a tiny artboard imports a screen with a moment prop, e.g. `ExamResult.dc.html` is a 390×844 root
holding only `<dc-import name="Exam" view="result" hint-size="390px,844px"></dc-import>` (head loads the same scripts as
Exam). Use this to show Main/Today at other states (e.g. "all done", "no target date") without duplicating markup.

Caveat to fix in the Guarani copy: Main's sample uses fixed dates while `today` is live, so the board drifts (daysLeft
changes daily and becomes "試験後" after 6 Dec 2026). Build sample dates relative to `C.today(C.now())` (§6.4).

### 1.5 The installed app: `Shell.dc.html` + `yk-app.js` + `yk-runtime.js`

- The build (`yaoki-app/build.mjs`, `LEVELS.N2.screens`) takes the screens App plays (+ Write) and the app's own `Shell`
  and `Install`; `yk-runtime.js` renders the same `.dc.html` files with Preact (holes, `sc-if`, `sc-for`, `dc-import`,
  logic class with props/state/setState/renderVals/lifecycle). Shell replaces App in the app.
- Shell's state: `{ ...window.ykApp.start(), menu: false, confirm: false, testing: false, tested: false, heard: false }`;
  handlers from `ykCourse.handlers`. `componentDidMount` → `ykApp.onScreen(screen)`; `componentDidUpdate` →
  `ykApp.remember(state)` + `ykApp.onScreen(screen)`.
- Shell passes to every screen: `go app save miss reviewed menu` (`menu="{{ openMenu }}"`), no hint attributes.
- `ykApp` API: `start()` (initial state: saved progress, or test state from the URL on localhost with `?yktest`),
  `remember(s)` (save if changed), `forget()`, `saving()`, `offline()` ('yes'|'no'|'never'), `onScreen(name)`,
  `version`, `standalone`, `hosted`, `device`, `useBrowser()`.
- Saved under `localStorage['yaoki.v1:' + <path of the page>]` (per copy of the app). Written: `{ v: 2, started, level,
  plans, mocks, plan, cur, done, tests, mistakes, mock (with again:false), wrote, wroteWords }`; only when the JSON text
  changed. NOT saved: `screen` (reopens on Main if `started`, else Goal), `tp`, `set`.
- Load validation: plan must have ISO `start` and `exam` (pace normalised to 'fit' unless 'steady'; minutes default 30);
  level must be a written level (else 'N2' if started, else null); plans/mocks kept only for written levels; mistakes
  dropped if `C.item(src)` is null, fields normalised (`due` must be ISO, else today); `cur` kept only if
  `C.session(cur)` exists; `tp` 0|1; `set` 'test'|'day'; `wrote` filtered to CJK kanji (+々) deduplicated; `wroteWords`
  strings ≤ 16 chars deduplicated; v0.1 migrations (old mistake names, `g/k/r` → `done.u03d4`).
- Fit: the 390×844 design is scaled to the phone; within 2% of the shape it is stretched; if the phone keeps a status
  strip, the design's empty top 50 px (minus 8) is cropped instead of shrinking; wide screens show it boxed (radius
  30px, ring `0 0 0 3px #1B2440`, shadow `0 20px 50px rgba(27,36,64,0.28)`, page `#C9D0E3`); a phone held sideways
  shows "縦向きでお使いください / Turn the phone upright".
- Wake lock on `MockRun`, `Listening`, `Review`; theme colour `#1B2440` on MockRun else `#F4F5F9`; a new version is
  swapped in only on Main or Goal (never mid-lesson); no pinch or double-tap zoom; `audioSession.type = 'playback'` so
  the silent switch does not mute listening.

### 1.6 Canvas layout conventions (`yaoki/project/canvas.json`)

- Every phone board: `{ w: 390, h: 844, radius: 44, is_interactive: true, title: "N · Name" }`; columns 470 px apart
  (390 + 80), rows 1284 px apart; the Prototype board sits LEFT of the first row at `x: -470, y: 0`.
- Row 1 (this area): Goal x0 "1 · Set the goal", Main x470 "2 · Week path", Today x940 "3 · Today's spread",
  Readiness x1410 "4 · Readiness". A `title1` note per row ≥ 223 px above it: `{ x: 0, y: -300, text: "Plan: a goal, a
  week, a day", kind: "title1", maxW: 1800 }` (other rows: "Learn, drill, then exam-style", "Exam skills, week test,
  review", "Mock exam: the real format, briefing to result", "Writing: stroke order, by finger").
- `order` starts with `Main.dc.html` (the format requires the entry artboard to be named Main.dc.html); App is last.
- Format rules that bite here: holes are dotted lookups only (compute in `renderVals`); attributes `{{ x }}` pass raw
  values (functions, booleans for `disabled`/`aria-pressed`); always set `hint-placeholder-val` / `hint-placeholder-count`;
  no script-built UI; inline stroke SVG icons, never emoji; real `<button>`/`<a href>`; icon-only buttons get
  `aria-label`; decorative SVG `aria-hidden="true"`, meaningful SVG `role="img" aria-label`; no fake status bar; every
  imported board must load in its own `<head>` what it needs to render alone; file paths ASCII only (letters, digits,
  `_`, `.`, `-`): no ñ, tildes or apostrophes in file names. SKILL.md says an imported board's helmet should hold only
  font links, `@font-face` and `body{margin:0}` (+ font-family/color on the root); Yaoki also keeps `button`, `a`, `rt`
  rules and keyframes there, and it works; keep keyframes in the helmet (they are needed) but nothing else unusual.

---

## 2. ENGINE API REFERENCE (`window.ykCourse`, `yaoki/project/course.js`)

An IIFE: `var C = window.ykCourse = window.ykCourse || {}`. Constants: `DAY = 86400000`, `STEPS = [1, 3, 7]`,
`DAYS_PER_UNIT = 7`, `ORDER = ['N5','N4','N3','N2']`, module-global `LEVEL = 'N2'` (mutable: the current level).

### 2.1 The data the engine reads

`window.__ykCourses[LV]` (one generated file per level; `window.__ykCourseData` is a legacy alias for N2):
```
{ level: 'N5',
  units: [ { n: 1, ja: '名詞の文', en: 'Saying what things are',
             days: [ day × 6 ],             // day 6 = まとめ (its grammar has points: [] and a compare page)
             test: [ item × 24 ] } ],       // [] when not written
  items: { '<id>': item, … },               // every question by id (780 for N5)
  below: '…kanji of the levels below…' }
day  = { title: '〜は〜です・〜じゃありません',
         grammar: { points: [ { id, form, gloss, connect: [{pos, rule}], examples: [{ja, en, clip}], watch } ] /* 2 per day */,
                    compare: { intro, forms, check }, drill: [item × 6 (8 on day 6)], exam: [item × 3] },
         scene:   { ja, en, intro, words: [ { id, word, reading, gloss, parts: [[kanji, reading, meaning]], clip } × 8 ], check },
         skill:   { kind: 'reading'|'listening', ja, en, situation, ask, item, audio } }
          // a day with no `grammar` = not written yet
item = { id: 'n5u01d1.e1', kind: 'choice'|'star'|…, type: '文の文法1', label, q, options: [4], answer: 1-4, why?, explain? }
```
Item id patterns (N5): `n5u01d1.c1` compare check, `.d1–d6` drill, `.e1–e3` exam-style, `.k1` scene check, `.r1`
reading/listening, `n5u01t.1–24` week test, `n5mock1–12` mini mock. N2 ids have no prefix (`u03d4.d1`, `mock1`).
Units per level: N5 8, N4 10, N3 12, N2 12 (only unit 3 written) → sessions 56 / 70 / 84 / 84 (verified).

### 2.2 Every function

**Levels**
| function | signature → result | semantics |
|---|---|---|
| `C.level()` | → `'N2'` | the current level (module global `LEVEL`) |
| `C.setLevel(lv)` | `(string?)` → level | sets LEVEL if that level's data is loaded; `setLevel()` with no arg resets to N2; an unknown level is ignored |
| `C.withLevel(lv, fn)` | → `fn()`'s result | runs fn with another level current, then restores (Goal uses it to preview a level) |
| `C.levels()` | → `[{ level, ready, days, units }]` in ORDER | `ready` = at least one day with grammar; `days` = written days count. Verified: N5 48, N4 60, N3 72, N2 6 days; all `ready: true` |
| `C.levelOf(id)` | `('n5u01d1.e1')` → `'N5'` | from the `n<digit>` prefix; anything else → `'N2'` |
| `C.below()` | → string | kanji of the levels below the current (writing practice treats them as known) |

**Text markup** (content strings use a tiny markup)
| markup | meaning |
|---|---|
| `{ばかりに}` | highlighted: the pattern being taught → `bg #FFE9B0`, `pad '0 3px'`, `ws 'nowrap'` (off with `hl:false`) |
| `[油断|ゆだん]` | ruby: base with reading (dropped with `ruby:false`, "exam conditions") |
| `_補って_` | underlined: the word a question asks about → `line '2px solid #1B2440'` |
| `^大事な試験^` | clue: plain until the answer is shown; `clue:'line'` → `3px solid #F2B43A` underline, `clue:'mark'` → highlight |

- `C.rich(src, opt?)` → array of segments `{ t, r, ruby, plain, bg, pad, ws, line }`; opt `{ ruby: false, hl: false, clue: 'line'|'mark' }`.
  Example (verified): `'わたし{は}[学生|がくせい]_です_^ね^'` with `{clue:'line'}` → わたし plain; は bg #FFE9B0; 学生 ruby がくせい; です line 2px ink; ね line 3px gold.
  Screens render segments with `<sc-for>` and `<ruby>…<rt>` (rt 9px/400 #5A6382).
- `C.plain(src)` → string with all markup removed (labels, notebook, screen readers).

**The course**
| function | result |
|---|---|
| `C.units()` | the current level's units |
| `C.unit(n)` | unit with `n`, or null |
| `C.sessions()` | every session in order: per unit, days 1–6 then the test: `{ id, unit, day: 1-7, kind: 'study' (1-5) / 'matome' (6) / 'test' (7), ready, title }` (test title '週テスト') |
| `C.sid(u, d)` | session id: `prefix + 'u' + 2-digit unit + ('t' or 'd' + day)`; prefix `''` for N2, else `'n5'` etc. (`n5u03d4`, `n5u03t`, `u03d4`) |
| `C.session(id)` | the session object (current level) or null |
| `C.day(id)` | the day's content for a study session id (any level, regex `^(?:n\d)?u(\d+)d(\d)$`) or null |
| `C.item(id)` | any question by id, looked up in its own level first, then in every level |

**Progress**: `C.complete(state, s)` → for a test `!!state.tests[s.id]`; else `p.g >= 3 && p.k >= 1 && p.r >= 1`
where `p = state.done[s.id] || {}`.

**Dates and the plan**
| function | result / semantics |
|---|---|
| `C.today(now?)` | device-local date `'YYYY-MM-DD'` (getFullYear/getMonth/getDate) |
| `C.daysBetween(a, b)` | whole days b − a (UTC day numbers of ISO strings); 0 if either is invalid |
| `C.addDays(a, n)` | ISO date a + n days |
| `C.plan(settings)` | the sessions, each with `date` (§3.2) |
| `C.status(state, now?)` | `{ plan, next, dueToday, perDay, daysLeft, stamps, today }` (§3.3) |
| `C.fits(settings)` | can every session go one a day before the exam, keeping the last week? |
| `C.now()` | `window.__ykNow || Date.now()` (tests pin time with `?now=`) |

**Notebook**
| function | result |
|---|---|
| `C.miss(list, { src, wrong }, now?)` | new list with `{ src, wrong, at: now, step: 0, due: today + 1 }` first; any older entry of the same src removed |
| `C.due(list, now?)` | entries not cleared with `due <= today` |
| `C.reviewed(list, src, right, now?)` | right: step+1, due today + STEPS[step]; step 3 → `cleared: true`; wrong: step 0, due +1, `last: 'wrong'`; also sets `at`, `last` |

**State, view, handlers**: `C.fresh()`, `C.current(state, status)`, `C.view(state)`, `C.handlers(get, set)` (§2.3–2.5).

**Writing practice**: `C.addWrote(had, add)` → string of unique characters (code points) in first-seen order;
`C.addWords(had, add)` → array of unique non-empty strings. Both only grow.

**Sound by unit**: `C.soundFile(lv, unit)` → `''` for N2, else `'sound-course-n5-u03.js'`; `C.needSound(lv, unit)`
appends that script once (next to course.js) when a unit is first in use; `view()` asks for the current unit, unit 0
(the level's mini mock) and every unit the notebook's mistakes come from.

**Exam areas**: `C.area(type)` → `{ key, ja, en, tagBg, tagColor }` by regex on the Japanese question type:
`vocab` 文字・語彙 Kanji, vocabulary `#FDEBE6/#C7361E`; `grammar` 文法 Grammar `#E8ECFB/#2F4FD0`; `listening` 聴解
Listening `#E0F3EF/#0B7A6B`; else `reading` 読解 Reading `#FFF4D6/#1B2440`.

Exports: `C.STEPS`, `C.DAYS_PER_UNIT`.

### 2.3 The state shape

`C.fresh()`:
```js
{ screen: 'Goal', started: false, level: null, plans: {}, mocks: {}, plan: null, cur: null,
  done: {}, tests: {}, mistakes: [], tp: 0, set: 'day', mock: null, wrote: '', wroteWords: [] }
```
| key | type / values | written by |
|---|---|---|
| `screen` | screen name | `go(to)`; `level()` handler |
| `started` | bool: goal set | `go(to !== 'Goal')` |
| `level` | `'N5'…'N2'` or null (view treats null as N2) | Goal `save({level})`, menu `level()` |
| `plan` | `{ start, exam, pace: 'fit'|'steady', minutes: 20|30|45 }` or null | Goal `save({ level, plan: { start: today, exam, pace, minutes }, cur: null })` |
| `plans` | `{ [level]: plan|null }` other levels' plans, put aside | level switch |
| `mocks` / `mock` | per-level / current mini-mock result `{ a, used, done: true, score, again? }` | MockRun, Mock |
| `cur` | session id picked on the path, or null | Main `save({ cur, tp: 0, set })`, WeekTest `save({cur: sid, set:'test'})` and `save({cur: null})` |
| `done` | `{ [sessionId]: { g: 0-3, k: 0-1, r: 0-1, ks?: 1, kw?: 1 } }` | `save({ prog })` from Compare (g 1), Drill (g 2), Exam (g 3), Scene (ks, kw, k 1), Reading/Listening (r 1) |
| `tests` | `{ [testId]: { id, score, of, used (s), areas: { vocab|grammar|reading|listening: { right, of } }, at } }` | Exam in test mode `save({ result })` |
| `mistakes` | `[{ src, wrong, at, step, due, cleared?, last? }]` | `miss`, `reviewed` |
| `tp` | teach page index (0, 1) | Teach `save({tp: tp+1})`, Today/Main reset to 0 |
| `set` | `'day'` (3 exam-style q, 150 s) / `'test'` (week test, 1200 s) | Today, Main, WeekTest |
| `wrote`, `wroteWords` | kanji written 3×, words written out (all levels) | Scene `save({ wrote, wroteWords })` |

### 2.4 The `app` object every screen reads (`C.view(state)`)

`view()` first calls `C.setLevel(state.level || 'N2')`, then returns:
```
{ status,               // C.status(state, C.now())
  plan: state.plan,     // the settings
  sid,                  // C.current(state, status): cur if ready, else status.next, else first ready session
  session,              // that session with its date (from status.plan)
  unit,                 // C.unit(session.unit) (or the first unit)
  day,                  // C.day(sid): the day's content (null for a test)
  prog,                 // state.done[sid] || {}
  done, tests, tp, set, mock, wrote, wroteWords,
  mistakes,             // only this level's (levelOf(src) === LEVEL; N2 also keeps 'mock…'/'listening…' ids)
  level, levels }       // C.levels()
```
Screens read: Main `status.plan/next/perDay/daysLeft/stamps/today`, `unit`, `sid`, `done`, `tests`, `level`; Today
`sid`, `day`, `prog`; Goal only `level`; Shell `levels`, `level`. `status.dueToday` is computed but no screen uses it.

### 2.5 The handlers object (`C.handlers(get, set)`)

`set(fn)` is the artboard's functional `setState`; each handler returns a patch merged into state. `get` is unused.
- `go(to)` → `{ screen: to, started: st.started || to !== 'Goal' }`.
- `level(lv)` (menu only) → same level: `{ screen: st.plan ? 'Main' : 'Goal' }`; else `plans[was] = st.plan`,
  `mocks[was] = st.mock`, then `{ level: lv, plans, plan: plans[lv] || null, mocks, mock: mocks[lv] || null, cur: null,
  tp: 0, screen: back ? 'Main' : 'Goal' }`.
- `save(patch)`: copies every key except `prog`, `result`, `wrote`, `wroteWords` as is; then
  - `wrote` → `C.addWrote(st.wrote, patch.wrote)`; `wroteWords` → `C.addWords(…)` (added, never replaced);
  - `level` different from the current → old plan into `plans`, old mock into `mocks`, `mock` restored for the new
    level unless the patch sets it, `C.setLevel(patch.level)`;
  - `prog` → applied to `C.current(st, C.status(st, C.now()))` (the session on screen), each key raised with
    `Math.max(had[k] || 0, patch.prog[k])` ("going back over a lesson never undoes it");
  - `result` → `tests[result.id] = result`.
- `miss(m)` → `{ mistakes: C.miss(st.mistakes, m, C.now()) }`.
- `reviewed(src, right)` → `{ mistakes: C.reviewed(st.mistakes, src, right, C.now()) }`.
- `menu` is NOT a handler: Shell's `openMenu` is passed as the `menu` prop.

Verified sequence: fresh → `save({level:'N5', plan, cur:null})` + `go('Main')` → `{screen:'Main', started:true,
level:'N5', plans:{N2:null}}`; `save({prog:{g:1}})`, `save({prog:{g:3,k:1}})`, `save({prog:{g:2}})` → `done.n5u01d1 =
{g:3,k:1}`; `level('N4')` → Goal with plan null and N5's plan kept; `level('N5')` → Main with the plan back.

### 2.6 Flow of the day through the screens (who saves what, and where they go)

```
Main ──node/card──▶ Today   (save {cur, tp:0, set:'day'})        Main ──試 node──▶ WeekTest (save {cur, tp:0, set:'test'})
Today ─文 card / Start─▶ Teach (save {tp:0}; a まとめ day with no points goes straight to Compare)
Teach ─Next─▶ Teach (save {tp: tp+1}) … last page ─▶ Compare ─▶ (save prog g:1) Drill ─Finish─▶ (save prog g:2) Today
Today ─本番へ─▶ Exam (save {set:'day'}) ─done─▶ (save prog g:3) Today
Today ─字 card─▶ Scene: 学習 (save ks:1; ks+kw when nothing to write) → 書く (save kw:1) → 本番 (save k:1) ─▶ Today
Today ─読/聴 card─▶ Reading / Listening ─done─▶ (save prog r:1) Today
WeekTest ─Start─▶ (save {cur: sid, set:'test'}) Exam ─done─▶ (save {result}) WeekTest ─On to week n+1─▶ (save {cur:null}) Main
every wrong answer ─▶ miss({src: item id, wrong}) (Exam: 無解答 when blank)       Readiness ─Drill─▶ Listening (no save unless the day's skill is listening)
```

---

## 3. The plan algorithm, progress, stamps and the notebook

### 3.1 Sessions
`C.sessions()`: for each unit, days 1–6 (`kind` study, day 6 matome) then the week test (day 7). `ready` = day has
`grammar` (test: `test.length > 0`). Unwritten sessions are still in the list and still get dates.

### 3.2 `C.plan(settings)` (exact)
```
n     = sessions.length
start = dayNo(settings.start) || dayNo(today)
exam  = dayNo(settings.exam)                       // null when no exam
room  = exam != null ? exam - start - 7 : n        // the last 7 days before the exam are kept for mock exams
if (exam != null && room < 1) room = max(1, exam - start)
squeeze = settings.pace !== 'steady' && room < n
date(k) = squeeze ? start + floor(k * room / n) : start + k
```
So 'fit' only ever compresses (two or more sessions on a day); it never spreads sessions out when there is spare time.
'steady' is always one a day, even past the exam. No exam → one a day from start.

### 3.3 `C.status(state, now)`
- `next` = first session that is `ready` and not complete (date ignored: the learner may run ahead).
- `dueToday` = count of ready, incomplete sessions dated ≤ today (unused by screens).
- `perDay` = `max(1, round(plan.length / span))`, span = days from first to last session date + 1 (a whole-plan
  average, shown on Main's callout as " · 2 a day" when > 1).
- `daysLeft` = `daysBetween(today, plan.exam)` when there is an exam, else null.
- `stamps` = number of complete sessions (study days and tests) in the level's plan.

`C.current(state, status)`: `state.cur` if that session is ready, else `status.next`, else the first ready session.
After a day is finished, `cur` still points at it, but Main's "today" node is `id === sid || id === next` on an
incomplete session, so the path moves on by itself.

### 3.4 Goal's numbers
`fitsOneADay = C.fits({ start: today, exam, pace })` (room = days to exam − 7 ≥ sessions); `room = max(1, days − 7)`;
`reach = min(units, floor(room / 7))`. Three plan notes:
- fits: `"Each unit: 6 study days, then a timed week test. One session a day, " + sessions + " in all, with the last week kept for mock exams."`
- does not fit, 'fit': `sessions + " sessions in " + room + " days: some days have two. The last week is kept for mock exams."`
- does not fit, 'steady': `"One session a day. By the exam you reach unit " + reach + " of " + units + "; the rest carries on afterwards."`

### 3.5 Worked examples (verified, today = 2026-11-03)
| case | sessions | first → last date | perDay | daysLeft | notes |
|---|---|---|---|---|---|
| Main designed moment (N2, 10-11 → 12-06, fit) | 84 | 2026-10-11 → 2026-11-28 | 2 | 33 | room 49; u03d4 dated 2026-10-20 ≤ today → "今日 TODAY"; 35 dates hold 2+ sessions |
| N5, today → 2026-12-06, fit | 56 | 11-03 → 11-28 | 2 | 33 | room 26; Goal note "56 sessions in 26 days…" |
| N5, same, steady | 56 | 11-03 → 12-28 | 1 | 33 | Goal note "…you reach unit 3 of 8…" |
| N5, no exam | 56 | 11-03 → 12-28 | 1 | null | Main's days-left chip renders empty |
| N5, exam 2027-07-04 | 56 | 11-03 → 12-28 | 1 | 243 | fits; nothing spread out |
| N5, exam in 5 days | 56 | 11-03 → 11-07 | 11 | 5 | no guard: 11 sessions a day |

### 3.6 Progress and completion (g / k / r)
- `g` grammar: 0 nothing; 1 teach pages read (saved by Compare); 2 drill done (Drill); 3 exam-style done (Exam).
- `k` words/kanji lesson: `ks` scene learned, `kw` writing done, `k: 1` its exam question done (Scene).
- `r` skill: reading or listening done (Reading/Listening).
- Complete = `g >= 3 && k >= 1 && r >= 1`. Today's "next card" order: grammar until g = 3, then words, then skill.
- Week test complete = a result in `tests`. `C.area` buckets each test item, so results carry per-area right/of.

### 3.7 Stamps
- Main: chip with the count (`status.stamps`), the week's 7-slot stamp card (済 per complete day, tilted per slot),
  and 済 nodes on the path; the red line runs through the stamped nodes.
- Today: when all three lessons are done, a 50 px 済 stamp lands with `yk-stamp` (500 ms) beside "4日目 完了！ / Day 4 is
  stamped on your card." Before that: a dashed 済 and "Finish all three lessons to stamp day N on your card."
- WeekTest result: "スタンプカード完成　Week N: 7 of 7" and a teacher's stamp by score (≥ 80% たいへん/よく/できました,
  ≥ 60% よく/できました, else がんばり/ましょう).

### 3.8 Notebook spacing (verified)
miss on 11-03 → due 11-04 (step 0) · right on 11-04 → step 1, due 11-07 (+3) · right on 11-07 → step 2, due 11-14 (+7)
· right on 11-14 → step 3, `cleared: true` · a wrong answer at any step → step 0, due tomorrow, `last: 'wrong'`.
A new miss of the same question replaces its entry (back to step 0). The notebook shows `pips` = step (0–3, teal
`#0B7A6B`), "due today", "back tomorrow", "in N days", and "卒業 · cleared".

### 3.9 How the N1 app's plan of days differs (an upgrade path, not the default)
- The plan IS a list of days stored in state (`app.plan = { v, start, exam, pace (30/45/60 min), set, days: [{ d, t:
  0 study | 1 week test | 2 review, wk, g, k: [], w: [], r, l, p: {progress} }], cov, of, open, tests, mocks, past }`).
- Calendar: start to the day before the exam in 7-day weeks (test on every 7th day). Five content streams (grammar
  25 min, kanji 1, words 1.5, reading 6, listening 3 minutes each) are spread over study days at 85% of the daily
  minutes; ~10% of days (≤ 12) are reserved as review days when there are ≥ 20 study days; when time is short every
  stream is cut by the same share (`cov.f < 1`) and the Goal card warns in red.
- Progress per day in `plan.days[i].p` (`g`, `k`, `r`, `l`, `t`, `v`), saved with `N.mark(plan, i, {...})`; `plan.open`
  (set by `N.withOpen`) replaces `cur`. "Change the plan" in the menu re-plans what is left (`N.replan`), keeping past
  days and a credit of what was learnt; missed days become "予定なし" empty days.
- N1 Main adds: previous/next week arrows (44 px buttons, faded `opacity .35` at the ends), a "N日遅れ / N days behind"
  marker, an "Open day N early?" sheet for days after today, an exam node at the end of the last week, "試験おつかれさま
  · Next goal" after the exam, a callout sized to its title (up to 3 lines), the stamp re-pressed on a just-finished
  day, `role="img"` + `aria-label` on the chips ("3 days stamped", "33 days to the exam"), `lang="ja"` on Japanese.
- N1 Readiness is computed: per part learnt vs planned (with a "planned by today" tick), pace (behind/ahead/on
  schedule/Today done in tinted chips), week-test chips, mocks.
- Recommendation for Guarani: keep the main-app engine (content is written as units of days; simpler; self-paced),
  and borrow N1's UI refinements (week arrows, behind marker, after-target state, chip labels, computed Readiness).

---

## 4. Levels: switching and gating

- **What a level is**: a data file `window.__ykCourses[LV]`; `C.levels()` lists ORDER with `ready` (any written day).
- **Goal**: four level buttons (N5 N4 N3 N2); a level with no written day is `disabled`, dashed, grey, with a 9 px
  "準備中" under its name and `aria-label "N2, not written yet"`. Picking only changes Goal's local state; the plan text
  is computed for the picked level with `C.withLevel`. "はじめる Start" saves `{ level, plan, cur: null }` (the old level's
  plan and mock go aside) and goes to Main. Under the buttons: "N1は別のアプリです。 N1 has its own app."
- **Menu (app only)**: the same four buttons in the sheet; tap → close the menu → `h.level(lv)` (its plan comes back,
  or its Goal screen the first time). Note under them: "Each level keeps its own plan and notebook. The course is being
  written unit by unit; days not written yet are marked 準備中."
- **Canvas**: no menu; Main's level chip (`this.props.menu || nav('Goal')`) goes to Goal.
- **Per day**: unwritten sessions get dates but show "N日目 · 準備中" on the path, are locked (aria ", not written yet"),
  their test node is grey `#E6E9F3`; `status.next` skips them; when nothing written is left, Main's card reads
  "The next day opens when it is written." WeekTest has a not-ready state when `unit.test` is empty.
- **Readiness gate** (`lv !== 'N2'`): Main's tab turns `#B9BFD0`, label "判定 準備中", `aria-disabled`, click prevented;
  Mock's and Notebook's tabs are disabled the same way but keep the label "Readiness". Mock shows full mocks only for N2.
- **Per-level data**: plans and mini-mock results are swapped; `done`, `tests`, `mistakes`, `wrote` coexist (ids carry
  the level); the notebook view filters to the current level; sound is fetched per level and unit; `below` names the
  lower levels' kanji.
- Load validation drops a saved level, plan or mock of a level that is no longer written.

---

## 5. Screen specs

### 5.0 Shared tokens (copy exactly)

**Colours**: ground `#F4F5F9` · card `#FFFFFF` · ink `#1B2440` · muted text `#5A6382` · line `#DDE1EC` · line-2/dashed
`#C9D0E3` · graph grid `#E6E9F3` · indigo `#2F4FD0` · indigo tint `#E8ECFB` · indigo track `#D9E0F8` · daruma red
`#E2452B` (stamp borders, art; 4.10:1 on white, so never small text) · red text `#C7361E` · red tint `#FDEBE6` · red
track `#F8D6CC` · gold `#F2B43A` · gold tint `#FFF4D6` · highlight `#FFE9B0` · teal `#0B7A6B` · teal tint `#E0F3EF` ·
chip grey `#EEF0F6` · disabled text `#9AA1B5`, `#B9BFD0` (disabled only) · face `#FFF6EA` · overlay `rgba(27, 36, 64, 0.5)`.
Contrast (computed): ink on ground 14.0; muted on white 5.93 / on ground 5.44 / on indigo tint 5.03; white on indigo
6.67; white on red text 5.28; red text on red tint 4.58; teal on teal tint 4.55; ink on gold 8.28.

**Type**: `font-family: 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif`, weights 500 (body), 700
(secondary), 800 (titles, buttons); `line-break: strict` on roots. Klee One 400/600 ('Klee One', 'Hiragino Mincho
ProN', serif) is used for Japanese example and question text in other screens. Sizes: 52/800 score · 26/800 h1
(lh 1.25; unit title 1.2) · 22/800 Readiness h1 · 20/800 pace, done node · 18/800 sheet h2 · 17/800 primary CTA,
date · 16/800 card titles · 15/800 header, chips · 14 · 13 labels · 12 secondary · 11 kickers, tab labels · 10 mini
stamp · 9/700 "準備中".

**Surfaces**: hero card `border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; border-radius: 20px; background: #FFF`;
quiet card `border: 2px solid #DDE1EC` no shadow; info box `#E8ECFB` radius 16 padding 12px 14px; sheet radius
`26px 26px 0 0`, `border-top: 2px solid #1B2440`, padding `10px 20px 34px` (Goal) / `18px 20px 34px` (menu).

**Buttons**: primary CTA 54 px, radius 16, `background #2F4FD0; border 2px solid #1B2440; box-shadow 0 4px 0 #1B2440;
color #FFF; 800 17px` (ritual CTA same in `#C7361E`; destructive outline: white bg, `2px solid #C7361E`, red text 15px,
50 px). Card CTA 48 px radius 14 shadow `0 3px 0 #1B2440` 16px. Dark CTA `background #1B2440; box-shadow 0 3px 0
#2F4FD0`. Selectable chip `look(on)`: on `{ border: '2px solid #1B2440', bg: '#2F4FD0', shadow: '0 3px 0 #1B2440',
color: '#FFFFFF' }`, off `{ border: '2px solid #DDE1EC', bg: '#FFFFFF', shadow: 'none', color: '#1B2440' }`, not
written `{ border: '2px dashed #DDE1EC', bg: '#F4F5F9', color: '#9AA1B5' }`.

**Keyframes**: `yk-in` from `opacity:0; translateY(10px)` (220 ms ease-out, each screen) · `yk-up` from `opacity:0;
translateY(28px)` (240 ms, sheets) · `yk-fade` from `opacity:0` (160 ms, overlays) · `yk-stamp` `0%{opacity:0;
transform:scale(1.8) rotate(-20deg)} 55%{opacity:1; transform:scale(.92) rotate(-9deg)} 100%{opacity:1;
transform:scale(1) rotate(-9deg)}` (500 ms ease-out both). None of these honour reduced motion in the main app.

**Icons** (24×24 viewBox, `fill="none" stroke-linecap="round" stroke-linejoin="round"`):
back `M15 5l-7 7 7 7` (stroke 2.6) · next `M9 5l7 7-7 7` · calendar `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`
(indigo 2.4) · Path tab `<circle cx="6" cy="19" r="2.5"/><path d="M8.5 19h9a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15.5"/><circle cx="18" cy="5" r="2.5"/>`
· Notebook `<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5"/>` ·
Mock `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>` · Readiness `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>`
· padlock `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>` (20 px, `#5A6382`, 2.4)
· play `<path d="M7 4.5v15l13-7.5z"/>` (filled white, 18 px) · cross `M6 6l12 12M18 6L6 18` (red, 3) · the "done" tick
in pills is a CIRCLE `<circle cx="12" cy="12" r="9"/>` (stroke 3.5, 13 px): the Japanese ○ mark for "right".

**Mascot SVG** (viewBox 0 0 100 100): body `<path d="M50 6c26 0 40 20 40 46 0 24-16 42-40 42S10 76 10 52C10 26 24 6 50 6z" fill="#E2452B"/>`,
face `<ellipse cx="50" cy="42" rx="27" ry="23" fill="#FFF6EA"/>`, eyes `<circle cx="39|61" cy="42" r="8" fill="#fff" stroke="#1B2440" stroke-width="2.5"/>`,
pupil `<circle cx="61" cy="42" r="4" fill="#1B2440"/>` (his own LEFT eye = the viewer's right, painted when the goal
is set; the other when you pass), brows `M28 30c6-5 14-5 19 0M53 30c5-5 13-5 19 0` (3), mouth `M44 55c4 3 8 3 12 0`
(2.5), gold beard `M38 74h24M42 82h16` (`#F2B43A`, 3.5). Sizes: 104 (Goal), 60 (Main, Readiness), 56 (N1 Main).

**Bilingual label pattern** (target language first, then the learner's language):
- same element, separated by U+3000 IDEOGRAPHIC SPACE, same style: "はじめる　Start", "片目を入れる　Paint the first
  eye", "決定　Confirm", "レベル　Level", "試験日　Exam date", "1日の勉強時間　Daily study time", "今日の見開き　TODAY'S
  SPREAD", "文法　Grammar · 2 patterns", "つづける　Continue the drill", "本番へ　Start exam-style", "もどる　Back",
  "とじる　Close", "最初からやり直す　Start over", "キャンセル　Cancel", "音量チェック　Sound check", "次の一手　NEXT MOVE";
- heading + muted span: `<h2>試験日をえらぶ <span style="font-size: 13px; font-weight: 700; color: #5A6382">Choose your exam date</span></h2>`;
- big over small (two lines): "2026年12月6日（日）" 17/800 over "Sunday 6 December 2026" 12/500 muted; unit "原因・理由"
  26/800 over "Cause and reason" 13/500 muted; "20分" 20/800 over "かるく Light" 12;
- kickers with middle dots: "第3週 · Week 3 of 12", "今日 TODAY · 3 lessons · 2 a day", "第3週 · 済 DONE";
- marks with no English: 済 (done), 試 (test), あとN日 (N days left), 準備中 (in preparation), 未発表 (not announced);
- sentence + sentence: "片目が入りました。 One eye in. One to go.";
- `lang="ja"` on some Japanese spans (more consistently in N1), roots `lang="en"`.

**Safe zones**: top 50 px empty (status bar); bottom 34 px empty (home indicator; tests warn when content enters it).
Screens with the tab bar set only `padding-top: 50px` and the bar's own `padding: 6px 8px 30px`.

**Tab bar** (Main, Readiness, Notebook, Mock): `<nav aria-label="Main">`, `display: grid; grid-template-columns: repeat(4,
minmax(0, 1fr)); padding: 6px 8px 30px; background: #FFFFFF; border-top: 2px solid #DDE1EC`; each tab an `<a>` 50 px
tall, column, gap 2px, 11px/700 `#5A6382`, icon 24 stroke 2.2; the current tab `aria-current="page"`, `#2F4FD0`, 800,
stroke 2.4. Tabs: Path → Main, Notebook → Notebook, Mock exam → Mock, Readiness → Readiness (gated, §4).

### 5.1 App (Prototype) — see §1.1
Purpose: play the whole flow on the canvas with shared state. States: one per screen. Writes: everything via handlers.
Starts on Goal (fresh state). A reload on the canvas starts over (no persistence on the canvas).

### 5.2 Goal — canvas title "1 · Set the goal" (`<title>Set the goal</title>`)
Purpose: the first screen; the learner picks a level, sees the exam date, picks daily time, sees what the plan means,
then performs the ritual (paint one eye) and starts. Also reachable from Main's level chip on the canvas.

Layout (root `padding: 50px 20px 34px`, flex column, `position: relative`), top to bottom:
1. Bar, 44 px, gap 12: back `<button aria-label="Back">` 44×44, `margin-left: -10px`, no border, chevron (NO handler:
   inert); step bar = grid of 3 × 8 px pills, radius 4, gap 6, two `#2F4FD0` + one `#DDE1EC`, `role="img"
   aria-label="Step 2 of 3"` (static decoration).
2. Hero, `margin-top: 8px`, gap 16: mascot 104×104 (`role="img"`, label "Yaoki, a daruma with both eyes still blank" →
   "…with one eye painted"; pupil `opacity` 0→1 with `transition: opacity 300ms ease-out`); column gap 4: h1 26/800
   lh 1.25 "目標を決めよう"; blank: 14/500 muted lh 1.45 "Set a goal and Yaoki gets one eye. He gets the other when you
   pass." · painted: 14/700 `#C7361E` "片目が入りました。 One eye in. One to go."
3. Level, `margin-top: 20px`, gap 8: label 13/800 "レベル　Level"; grid 4, gap 8, buttons 48 px radius 14 16/800
   column lh 1.1 (`aria-pressed`, `disabled`, `aria-label`, `look()` incl. not-written look + "準備中" 9/700); note
   12/500 muted "<span lang="ja">N1は別のアプリです。</span> N1 has its own app."
4. Exam date, `margin-top: 16px`: label "試験日　Exam date"; `<button aria-haspopup="dialog">` 68 px, padding 0 16,
   radius 16, `2px solid #1B2440`, white, gap 12: calendar 24; column "2026年12月6日（日）" 17/800 + "Sunday 6 December
   2026" 12/500 muted; chip `padding: 6px 10px; border-radius: 10px; background: #FDEBE6; color: #C7361E` 14/800
   "あと33日" (empty when ≤ 0).
5. Daily time, `margin-top: 18px`: label "1日の勉強時間　Daily study time"; grid 3, gap 8, buttons 76 px radius 16, column
   gap 2: 20/800 "20分"/"30分"/"45分" over 12px "かるく Light"/"ふつう Regular"/"しっかり Solid" (on: white 700; off:
   muted 500). Saved as `plan.minutes` but unused by the main engine.
6. Plan box, `margin-top: 14px`, padding 12px 14px, radius 16, `#E8ECFB`, gap 8: title 15/800 "12ユニット　Your 12-unit
   plan"; when it does not fit: grid 2 of 48 px buttons radius 14 padding 0 6 — "全部入れる" (lang ja, 14/800) / "Fit it
   all in" (11/700) and "1日1回" / "One a day"; note 12/500 lh 1.45 (§3.4).
7. `flex-grow: 1` spacer.
8. CTA: blank → `<button>` "片目を入れる　Paint the first eye" (red `#C7361E` primary); painted → `<a href="Main.dc.html">`
   "はじめる　Start" (indigo primary, flex centred).
9. Sheet (when open): full-screen overlay `rgba(27,36,64,0.5)` + `yk-fade 160ms`; transparent `<button aria-label="Close">`
   fills the space above; `role="dialog" aria-modal="true" aria-label="Choose your exam date"`, `yk-up 240ms`, gap 12:
   grabber 40×5 radius 3 `#C9D0E3`; h2 "試験日をえらぶ" + span "Choose your exam date"; 12/500 muted "The JLPT is held
   twice a year, in July and in December."; selected option `<button aria-pressed>` 68 px, padding 0 14, radius 16,
   `2.5px solid #2F4FD0`, `#E8ECFB`, radio 22 px (`2px solid #1B2440`, white, inner 10 px `#2F4FD0` dot), date lines,
   days-left chip; unavailable option `<button disabled>` `2px dashed #C9D0E3`, `#F4F5F9`, muted: "2027年7月" / "July
   2027 · date not announced yet" + chip `#EEF0F6` 13/800 "未発表"; "決定　Confirm" primary (margin-top 4).

States: blank / painted × sheet closed / open × level (each written level; unwritten disabled) × pace 20/30/45 × fits
(note only) / does not fit with 'fit' / 'steady'.
Interactions: level → `setState({level})` (no-op if unwritten); date button → sheet; Close/Confirm/selected option →
close; pace → `setState({pace})`; fit pair → `setState({fit})`; Paint → `setState({painted: true})`; Start →
`save({ level, plan: { start: today, exam: '2026-12-06', pace: fit, minutes: pace }, cur: null })` then `go('Main')`.
Reads: `app.level`, `C.levels()`, `C.withLevel(level, () => C.fits/units/sessions)`. Clever: the two-step ritual makes
committing to a goal a moment; the fit/one-a-day choice only appears when it matters.

### 5.3 Main (week path) — canvas title "2 · Week path" (`<title>Week path</title>`)
Purpose: home base. Shows the current unit as a path of its 7 sessions, what is stamped, and today's session with a
Start callout. Tabs to the notebook, mock and readiness.

Layout (root `padding-top: 50px`, column):
1. Bar 44 px, padding 0 16, gap 8: level chip `<button aria-label="Level N2, change level">` 44 px, padding 0 16, radius
   22, `2px solid #1B2440`, white, 16/800, text = level → `menu` or Goal; spacer; stamps chip 44 px padding 0 12 radius
   22 white `2px solid #DDE1EC` gap 6: mini 済 20×20 circle `2px solid #C7361E`, red 10/800, `rotate(-10deg)` + count
   15/800; days-left chip: calendar 18 + 15/800 "あと33日" | "今日が試験" | "試験後" | "" (no exam).
2. Unit card, `margin: 12px 16px 8px; padding: 14px 16px 16px`, hero card, gap 12: row gap 12 (column gap 2: 12/700
   muted "第3週 · Week 3 of 12"; 26/800 lh 1.2 unit.ja; 13/500 muted unit.en) + mascot 60 (one eye). Stamp card: grid
   7, gap 6, `role="img"` aria "Stamp card: 3 of 6 days stamped, day 4 is next, day 7 is the week test"; slots 40 px:
   stamped `2.5px solid #E2452B`, red 16/800 済, rotate(tilt) · now `2.5px dashed #2F4FD0`, `#E8ECFB`, indigo 16/800
   day number · later `2.5px solid #DDE1EC`, muted 15/700 · test radius 12, `2.5px solid #1B2440`, 15/800, bg white
   (done) / gold, 済/試.
3. Path region (~486 px), `position: relative; flex-grow: 1`, graph paper `background-image: linear-gradient(#E6E9F3
   1px, transparent 1px), linear-gradient(90deg, #E6E9F3 1px, transparent 1px); background-size: 26px 26px`.
   SVG 390×478 (aria-hidden): dotted polyline `64,34 104,98 132,162 104,250 64,326 110,386 180,438` (`#C9D0E3`, 6, round,
   `stroke-dasharray="1 13"`) + red polyline (`#E2452B`, 6) through the points up to the last done node.
   Node spots `{x, y, lx, ly, tilt}`: (38,8,102,16,-8°) (78,72,142,80,7°) (106,136,170,144,-5°) (78,224,142,232,6°)
   (38,300,102,324,-6°) (84,360,148,366,5°) (150,408,224,412,0°).
   Nodes: done `<a href="Today.dc.html">` 52 px circle `3px solid #E2452B`, white, red 20/800 済, rotated · today `<a>` 68
   px (spot −8,−8) `3px solid #1B2440`, `#2F4FD0`, shadow `0 5px 0 #1B2440`, white 26/800 day number · locked `<div
   role="img">` 52 px `3px solid #C9D0E3`, `#E6E9F3`, padlock · test `<a href="WeekTest.dc.html">` 60 px radius 18 `3px
   solid #1B2440` shadow `0 4px 0 #1B2440` 22/800, bg white (done) / gold `#F2B43A` (ready) / `#E6E9F3` (not written),
   mark 済/試. Labels at (lx, ly), `max-width: 366 − lx`: 11/700 muted "4日目" (+ " · 準備中"); 14px title (800 ink if
   done/today/test, else 700 muted); test: "週テスト" + 11/500 "exam format · timed".
   Callout beside today's node: `left: 150px; width: 224px; padding: 12px 14px 14px; border-radius: 18px; white;
   2px solid #1B2440` (no shadow), `top = clamp(spot.y − 26, 0, 370)`; labels it would cover are hidden; kicker 11/800
   indigo nowrap "今日 TODAY · 3 lessons · 2 a day" (次 NEXT when its date is after today); title 16/800; `<a>` 44 px
   radius 14 indigo shadow `0 3px 0` 15/800 "はじめる　Start". All-done variant (no today node): kicker in red
   "第3週 · 済 DONE" / "N日目 · 済 DONE", title, 12/500 note "The week test is next. Tap 試." / "The next day opens when
   it is written."
4. Tab bar (§5.0), Path current.

States: per node done / today / locked / not written / test (ready, done, not written); callout today / next / all done
/ none; chips with or without days left; level N2 vs others (Readiness tab). Interactions: done or today node → `save({
cur: s.id, tp: 0, set: 'day' })` + Today; test node (if written) → `save({ cur, tp: 0, set: 'test' })` + WeekTest; locked
→ nothing; level chip → menu (app) / Goal (canvas); tabs → Main, Notebook, Mock, Readiness (or nothing).
Reads `app.status`, `app.unit`, `app.sid`, `app.done`, `app.tests`, `app.level`. Only the current unit is shown (no way
to browse earlier weeks). Clever: one reusable spot table; the callout hides labels it would cover; tilted stamps; the
red line grows along the dotted route.

### 5.4 Today (today's spread) — canvas title "3 · Today's spread" (`<title>Today's spread</title>`)
Purpose: one day's three lessons as cards, the next one emphasised, and the stamp when all three are done.

Layout (root `padding: 50px 16px 34px`, column):
1. Header 44 px: `<a href="Main.dc.html" aria-label="Back to the week path">` 44×44, `margin-left: -8px`, chevron;
   centred 15/800 "第3週 · 4日目"; 36 px spacer.
2. Intro `margin-top: 8px`, gap 4: 12/800 indigo "今日の見開き　TODAY'S SPREAD"; h1 26/800 lh 1.25 day title; 13/500
   muted lh 1.5 "Learn the page, drill it with hints, then answer exam-style with the clock on."
3. Grammar card (`margin-top: 16px`, padding 14, radius 20, white, gap 12; next card: `2px solid #1B2440` + `0 4px 0
   #1B2440`, else `2px solid #DDE1EC`): `<a href="Teach.dc.html" aria-label="Grammar: open the teach page">` row: tile
   46×46 radius 14 `#E8ECFB` indigo 22/800 "文" (aria-hidden); 12/700 muted "文法　Grammar · 2 patterns" (まとめ: "文法　Grammar
   · the week side by side"); 16/800 title; done stamp 34 px `2.5px solid #E2452B` red 14/800 済 at top 12 right 12
   rotate(−9°) `role="img" aria-label="Lesson done"`. Pills row gap 6: 32 px, radius 10, 12px, `flex: 1 1 auto`, padding
   0 6, nowrap — done `#E0F3EF` bg+border, teal, 800, ○ tick · now indigo bg+border, white, 800 · todo `2px solid
   #DDE1EC`, transparent, muted 700; labels 学習 Learn / 練習 Drill / 本番 Exam-style. CTA 48 px radius 14: g0 "はじめる
   Start with the teach page" → Teach (save tp 0); g1 "つづける　Continue the drill" → Drill; g2 dark "本番へ　Start
   exam-style" → Exam (save set 'day'); none when g = 3.
4. Words card: the whole card `<a href="Scene.dc.html">` (`margin-top: 14px`): tile `#FDEBE6` red "字"; "文字・語彙　Kanji
   and words · 8 words"; "市役所で　At the city office"; stamp rotate(7°); pills 学習 Learn / 書く Write / 本番 Exam-style
   (from ks, kw, k).
5. Skill card: `<a href="Reading.dc.html">` (→ Listening on a listening day; `margin-top: 12px`): tile `#FFF4D6` ink
   "読"/"聴"; "読解　Reading"/"聴解　Listening"; skill.ja + "　" + skill.en; stamp rotate(−5°); pills all todo or all done.
6. Spacer; footer: open → row padding 12px 14px radius 16 `#FDEBE6` gap 12: dashed 40 px 済 (`2.5px dashed #C7361E`) +
   13/700 "Finish all three lessons to stamp day 4 on your card." · all done → hero-ish card (radius 18, shadow `0 4px 0`):
   50 px 済 `3px solid #E2452B` red 21/800 with `animation: yk-stamp 500ms ease-out both`; "4日目 完了！" 16/800; "Day 4
   is stamped on your card." 12/500; `<a>` 46 px "もどる　Back" → Main.

States: g 0/1/2/3 × ks/kw/k × r; next card 1/2/3/none; matome day (no patterns → Compare); listening vs reading day.
Reads `app.sid`, `app.day`, `app.prog`; writes `tp`, `set`. Bug: the day label uses `/^u(\d+)d(\d)$/` on `app.sid`, so
any N5–N3 session (`n5u01d1`) falls back to "第3週 · 4日目" and "day 4" (verified) — derive from `app.session`.
Accessibility gap: the pills say nothing to a screen reader about their state.

### 5.5 Readiness — canvas title "4 · Readiness" (`<title>Readiness</title>`)
Purpose: "am I ready to pass?" Static, hard-coded N2 values; the only logic is navigation.

Layout (root `padding-top: 50px`): bar 44 px padding 0 16: h1 22/800 "合格判定" + span 14/700 muted "Readiness · N2";
chip 36 px radius 18 calendar 16 + 14/800 "あと39日". Score card (`margin: 8px 16px 0; padding: 14px 16px`, hero, gap 10):
12/700 muted "予想得点　Estimated total"; "99" 52/800 lh 1.1 + "/ 180" 18/700 muted; mascot 60; total bar (`role="img"
aria-label="Estimated total 99 of 180. Overall pass mark 90."`): 14 px track radius 7 `#D9E0F8`, fill 55% `#2F4FD0`
radius `0 4px 4px 0`, pass tick 2×22 ink at 50% (top −4); scale 11/700 muted "0" · ink "合格点 90" centred · "180";
verdict box padding 10px 12px radius 12 `#FDEBE6`: cross 22 + 13/700 lh 1.4 "Not passing yet. The total clears 90, but
one section under its line fails the whole exam." Sections card (`margin: 14px 16px 0`, quiet, gap 12): "得点区分　Scoring
sections" 14/800 + legend tick 2×14 ink + 11/700 muted "基準点 19 / 60"; rows (each `role="img"` with a full sentence,
e.g. "Listening: 17 of 60, 2 points under the pass mark of 19"): 13/700 name + 500 muted gloss, 16/800 score + 11/700
"/60"; bar 12 px radius 6 (`#D9E0F8`/`#2F4FD0`, failing `#F8D6CC`/`#C7361E`), tick at 31.7% (19/60), top −3, 2×18;
failing chip `padding: 2px 8px; border-radius: 8px; background: #FDEBE6` 11/800 with an 11 px cross "2 under the line".
Next-move card (`margin: 14px 16px 0; padding: 12px 14px`, radius 18, `2px solid #1B2440`, no shadow): 11/800 red
"次の一手　NEXT MOVE"; 14/800 "聴解: 2 more points clear the line"; 12/500 muted "Quick-response drills · 10 min"; `<a>`
46 px padding 0 16 radius 14 red `#C7361E` shadow `0 3px 0` 15/800 "Drill" → Listening. Footnote 11/500 muted lh 1.5
"Estimated from your week tests. The real exam reports scaled scores, so read this as a guide, not a promise." Tab bar
with Readiness current. Clever: pass-mark ticks on every bar; the failing section is red and has a one-tap fix.

### 5.6 Shell / menu (installed app only, `yaoki-app/src/Shell.dc.html`)
Frame: 390×844 root, same font, `line-break: strict`; one `sc-if` + `dc-import` per screen (with `menu`), each in the
`yk-in` wrapper; keyframes yk-in/up/fade in its helmet.
Menu sheet (open from Main's level chip): overlay + transparent `<button aria-label="Close the menu">`; `role="dialog"
aria-modal="true" aria-label="Menu"`, padding `18px 20px 34px`, gap 12, `yk-up`:
1. Head: h2 `lang="ja"` 18/800 "メニュー" + 13/700 muted "Menu" + spacer + chip "PROTOTYPE" (`padding: 2px 10px;
   border-radius: 10px; background: #E8ECFB; color: #2F4FD0`, 11/800).
2. Level box padding 12px 14px radius 16 `#F4F5F9` gap 8: "レベル　Level · N5" 13/800; grid 4 gap 8 of 44 px buttons
   radius 12 15/800 (current indigo, no shadow; others white `2px solid #DDE1EC`; unwritten dashed, `#9AA1B5`, +準備中);
   aria "N4, current level" / ", not written yet"; note 12/500 muted (§4). (N1 instead: a description box and "試験日・
   勉強時間を変える　Change the plan" → Goal.)
3. Sound check: row padding 12px 14px radius 16 `2px solid #DDE1EC` gap 12: `<button aria-label="Play the test sound">`
   48 px circle `2px solid #1B2440`, shadow `0 3px 0`, bg `#2F4FD0` (gold `#F2B43A` while playing, `transition:
   background 150ms`), white triangle; "音量チェック　Sound check" 13/800; note 12/500 muted: "Plays a short test
   sentence." → "Playing the test sound…" → "No sound? Turn the volume up and check the silent switch." / "This browser
   would not play the sound."
4. 12/500 muted: "Your progress is saved on this device only." (or "…cannot be saved here, so it is lost when the app
   closes.") + "The app is stored for offline use." / "It is not stored for offline use yet: open it once while online."
5. "最初からやり直す　Start over" (outline red, 50 px) → confirm state; "とじる　Close" primary.
6. 10/500 muted centred lh 1.5: version, font/voice/stroke credits, JLPT trademark notice, "The lessons are original."
Confirm state: box padding 14px 16px radius 16 `#FDEBE6` gap 4: `lang="ja"` 15/800 red "最初からやり直しますか？"; 13/500 lh
1.5 "Start over? This clears what is saved on this device: your goal, today's lessons, the mistakes you added and the
mini mock result."; red primary "最初からやり直す　Start over" (→ `ykApp.forget()` + `fresh()`); 48 px text button
"キャンセル　Cancel".

---

## 6. Adapting to Guarani for Spanish speakers

### 6.1 What carries over as-is
- The whole wiring: one Prototype artboard with shared state, `sc-if` per screen, `dc-import` with the same props, the
  `yk-in` entrance, the dual-mode `nav`, designed moments, moment boards, per-screen `<head>` scripts, canvas.json
  geometry (390×844, radius 44, 470/1284 pitch, Prototype at x −470, row titles), `is_interactive: true`.
- The engine's API and semantics (sessions, plan fit/steady, status, current, view, handlers with monotonic progress
  and additive sets, notebook 1/3/7 + three rights, per-level plans swapped on switch, ready-gating).
- The week rhythm (5 study days, a review/compare day, a week test) and the day's three lessons (grammar, words,
  reading or listening) with their three steps.
- The visual system (§5.0): palette, borders, hard shadows, radii, type sizes, keyframes, graph-paper path, tab bar,
  sheets, the stamp mechanics. M PLUS Rounded 1c can stay (see 6.5).
- Accessibility habits: real buttons and links, `aria-pressed`, `aria-haspopup="dialog"`, `role="dialog"
  aria-modal`, sentence `aria-label`s on bars and stamp cards, 44 px targets, empty top 50 / bottom 34 px.

### 6.2 What must change, and why
| Yaoki | why it cannot carry over | Guarani version |
|---|---|---|
| JLPT levels N5→N2 (+N1 app) | no JLPT; descending numbers mean nothing here | four ascending levels, e.g. A1 A2 B1 B2 (MCER, familiar to Spanish speakers) **[decide]**; ORDER `['A1','A2','B1','B2']`; default level = A1, not the last |
| fixed exam sessions (first Sunday of July/December), 2026-12-06 hard-coded | no fixed, widely-sat Guarani exam to plan to | optional **fecha meta** (target date): "a mi ritmo" (no date → steady, `exam: null`, already supported), presets (1, 3, 6 months) or a real `<input type="date">` with a `<label>` |
| last week "kept for mock exams" | no paper to rehearse | keep the 7-day reserve only with a target date and call it repaso + prueba de nivel; or set the reserve in data |
| Readiness = JLPT scaled scores, hard-coded N2 | no such scoring | computed "¿Cómo voy?": per area right/of summed from `tests[*].areas` (already stored by the week test), with a target line (e.g. 60%) per area, a pace line (behind/ahead, as N1), and a next-move link to the weakest area; gate by "has a week-test result" (show an empty state before), never by level name |
| kanji, kana, furigana (`[基|よみ]` ruby), stroke-order writing, `wrote`, `wroteWords`, `below`, strokes.js, yk-write.js | Guarani uses the Latin alphabet; nothing to write by stroke | repurpose ruby to `[palabra|glosa]` (Spanish gloss, or a morpheme break) shown on demand; "exam conditions" = no glosses; replace the writing step with spelling of nasal vowels, puso and g̃ (an in-app letter strip, since the phone's Spanish keyboard does not offer every Guarani letter, notably ẽ ĩ ũ ỹ g̃ **[verify on device]**); keep an additive `typed` set for words spelled |
| 済 / 試 / 復 / 準備中 / 未発表 / あとN日 marks, the ○ "right" tick | Japanese marks, unreadable here | stamp: a check ✓ in the red circle or a short Guarani word (e.g. "Oĩma" ≈ "ya está" **[revisar]**); test node: an icon (flag/pencil) + "Prueba"; "pronto"/"en preparación"; "faltan 33 días"; tick = ✓ path `M5 12l5 5 9-10` |
| daruma + eye-painting ritual | a Japanese custom | keep the two-step ritual on Goal but with the new mascot's own gesture (e.g. a ñandutí whose first ring is woven when the goal is set and completed when the level is passed) **[decide with the mascot owner]** |
| `C.area()` regexes on Japanese type names | data will not be in Japanese | an explicit `area` code per item (`vocab`, `grammar`, `reading`, `listening`, maybe `speaking`) with Spanish names and the same tag colours |
| bilingual ja + en, `lang="en"` root, `line-break: strict` | the learner reads Spanish | Guarani accent + Spanish: `<html lang="es">`, `lang="gn"` on Guarani spans; Spanish must be enough alone; drop the Japanese fallback font |
| Klee One for target-language text | no ẽ, no combining tilde (no vietnamese subset; verified) | a Latin text face with the vietnamese subset (verified on Google Fonts: Andika 400/700, Lora, Nunito); Andika (SIL, made for literacy) suits learners |
| N2 legacy: ids without prefix, `__ykCourseData`, LEVEL default 'N2', OLD id map, v0.1 migration, mock/listening N2 filter | history of Yaoki only | uniform ids with level prefix (`a1u03d4`, `a1u03t`, `a1mock1`), `levelOf` on `/^([abc][12])/i`, no migrations |
| Japanese TTS clips (Kokoro) | phones have no Guarani system voice and no Guarani speech recognition **[verify]** | recorded clips by native speakers; every sound control keeps Yaoki's silent stand-in (`ykSound.has(key)` else light up for about 600 ms + 120 ms per character) |

### 6.3 Engine changes (concrete)
- Namespace: `window.gnCourse` with the SAME function names and signatures as `ykCourse` (screens port mechanically);
  data in `window.__gnCourses = { A1: {...}, … }`; files `gn-course.js` + `gn-course-a1.js`… under `project/`, linked
  relatively after `./support.js`. Saved-progress key distinct from `yaoki.v1:` (Yaoki Typing/Speaking read that key).
- Data shape: keep `units[{ n, gn, es, days[6], test[] }]`, day `{ title, grammar, words (was scene), skill }`, items by
  id with `area`; Spanish fields named `es`, Guarani `gn`.
- `sid()`: one rule for all levels; `levels()` unchanged; `setLevel()` with no argument → first level.
- Text helpers to add next to `rich`/`plain`:
  - `C.norm(s)`: `s.normalize('NFC')` (ẽ typed as e + U+0303 becomes U+1EBD; g̃ stays g + U+0303 because Unicode has no
    precomposed g̃);
  - `C.fold(s)`: for answer matching: NFC, lower case, every puso variant (' U+0027, ’ U+2019, ‘ U+2018, ʼ U+02BC, ´,
    `) to one; tildes stay significant (a ≠ ã); a difference only in an acute accent can be reported as a near miss
    (the way Yaoki Speaking names near misses);
  - `C.chars(s)`: grapheme-safe splitting (`Intl.Segmenter`, fallback `/\P{M}\p{M}*/gu`), used wherever text is cut or
    counted: Notebook's 21-character quote slices code units and would cut g̃ in two; `C.addWrote` uses `Array.from`.
  - Markup: keep `{hl}`, `_ask_`, `^clue^`; `[base|reading]` becomes `[palabra|glosa]`; consider a morpheme mark
    (e.g. `a·guata·ta`) that a screen can show as separated or joined.
- `C.plan()` as is (target optional). Optional: honour `minutes` (N1-style) later; add a Goal warning when `perDay > 2`.
- `C.view()`: same fields; `level` default A1.
- `C.status()`: add `behind` (days the next session is late) for an N1-style marker.
- Dates for labels: Spanish via `Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', year:
  'numeric' })` → "domingo, 6 de diciembre de 2026" (verified); Guarani by a small table (Node's ICU has no Guarani
  data and falls back to English "December Sunday"; assume browsers are the same): days arateĩ (lunes), arakõi, araapy, ararundy, arapo, arapoteĩ, arapokõi (domingo); months jasyteĩ … jasypa
  (octubre), jasypateĩ, jasypakõi (diciembre) **[revisar]**.

### 6.4 Screen by screen
- **App**: same file and SCREENS idea; rename only kanji-specific screens (Scene → `Words.dc.html`); ASCII file names;
  canvas title "Prototipo · todo el recorrido". Head loads `./support.js`, the level data files, `./gn-course.js`, then
  sound. Canvas row 1 titles e.g. "1 · Meta", "2 · Camino de la semana", "3 · El día de hoy", "4 · ¿Cómo voy?" and the
  row note "Plan: una meta, una semana, un día".
- **Goal**: heading in Spanish with an optional Guarani line; level buttons A1–B2 (unwritten: dashed + "pronto"); "Fecha
  meta" field opening the sheet (options "A mi ritmo, sin fecha", presets, "Elegir fecha" with a native date input);
  daily time 15/30/45 min (Spanish: Suave / Normal / Intenso); plan box texts rewritten in Spanish from §3.4's three
  cases plus a fourth "sin fecha: una sesión por día, N en total"; ritual CTA then "Empezar" (with a Guarani accent such
  as "Jaha　¡Vamos!" **[revisar]**). Wire the Back button (to Main when a plan exists) or remove it; make the step bar
  real or drop it. Replace "N1 has its own app" with one line about the level scale.
- **Main**: keep layout and spot table; kicker "Semana 3 de 8" (Guarani "Arapokõindy 3" as accent **[revisar]**); node
  labels "Día 4" + the day's title (a Guarani form such as "-ta: futuro"); allow `overflow-wrap: anywhere` and a
  2-line clamp on titles (long agglutinated words); budget the callout kicker: 192 px of inner width fits about 28
  characters at 11/800, so "HOY · 3 lecciones · 2 por día" is at the edge; prefer "HOY · 3 lecciones". Hide the days-left
  chip (or show "a mi ritmo") when there is no target. Add N1's week arrows so earlier weeks can be reopened, and the
  "behind" marker if a target exists. Tabs: Camino, Cuaderno, Prueba, ¿Cómo voy?
  Designed moment relative to today, so it never drifts:
  ```js
  const T = C.today(C.now());
  const full = { g: 3, k: 1, r: 1 };
  const done = {}; ['a1u01d1','a1u01d2','a1u01d3','a1u01d4','a1u01d5','a1u01d6','a1u02d1','a1u02d2','a1u02d3','a1u02d4','a1u02d5','a1u02d6','a1u03d1','a1u03d2','a1u03d3'].forEach((id) => { done[id] = full; });
  const sample = { level: 'A1', plan: { start: C.addDays(T, -17), exam: C.addDays(T, 60), pace: 'fit' }, done,
    tests: { a1u01t: { id: 'a1u01t', score: 20, of: 24, areas: {} }, a1u02t: { id: 'a1u02t', score: 18, of: 24, areas: {} } }, cur: 'a1u03d4' };
  const app = this.props.app || C.view(sample);   // 17 stamps, week 3, day 4 dated today ("HOY")
  ```
  (with 56 sessions and 77 days, room 70 ≥ 56, so session k is dated start + k and a1u03d4, k = 17, is today; this
  holds for any level of up to 10 units, i.e. ≤ 70 sessions; with more, lengthen the target).
- **Today**: kicker "HOY" (+ Guarani "Ko árape" **[revisar]**); three cards: Gramática, Palabras (with its steps Aprender /
  Escribir / Prueba: the spelling step), Lectura or Escucha; tiles with a Latin glyph or inline icon instead of 文/字/読/聴
  (e.g. "ẽ" for words shows a nasal vowel); pills Aprender / Practicar / Prueba with ✓; footer "Terminá las tres
  lecciones para sellar el día 4." / done "¡Día 4 completo!". Derive week and day from `app.session`, not from the id.
  Add the pill states to the accessible name.
- **Readiness → ¿Cómo voy?**: same card language (hero card, bars with target ticks, red for below the line, next-move
  card linking to the fix), data from week tests and progress; empty state before the first week test; footnote that it
  is a guide.
- **Shell**: menu in Spanish ("Menú"), level box A1–B2 with the per-level note, sound check with a short Guarani
  greeting clip (stand-in when missing), the saved/offline notes, "Empezar de nuevo" with confirm, "Cerrar", credits
  (typefaces, who recorded the voices, original lessons).

### 6.5 Typography and characters (verified against Google Fonts' CSS, 2026-11-03)
- Guarani needs: a e i o u y; nasal ã ẽ ĩ õ ũ ỹ; stressed á é í ó ú ý; ñ; g̃ (g + U+0303); the puso '; plus ¿ ¡ for
  Spanish; and the capitals.
- M PLUS Rounded 1c: `latin` (U+0000-00FF: ã õ á…ý ñ ¿ ¡ '), `latin-ext` (ĩ ũ), `vietnamese` (U+0128-0129,
  U+0168-0169, U+0303, U+1EA0-1EF9: ẽ ỹ Ẽ Ỹ and the combining tilde). The canvas's `css2` link loads subsets by
  `unicode-range`, so this works without changes. How well the combining tilde sits on g is not guaranteed: look at g̃
  at 14–26 px before relying on it.
- Klee One: only cyrillic, greek-ext, latin, latin-ext: no ẽ (U+1EBD) and no U+0303, so ñe'ẽ and g̃ would mix fonts.
- Replacement for the Klee One role (target-language sentences): Andika (400/700; latin, latin-ext, vietnamese,
  cyrillic), or Lora / Nunito (both with vietnamese). Link e.g.
  `family=M+PLUS+Rounded+1c:wght@500;700;800&family=Andika:wght@400;700`.
- Data: store one puso character everywhere (U+0027 is simplest); never break a line at it; accept every variant in
  typed answers (iOS smart punctuation turns ' into ’).

### 6.6 Pitfalls found in the Yaoki source (do not copy)
1. Today's day label regex `/^u(\d+)d(\d)$/` ignores the level prefix: every N5–N3 day reads "第3週 · 4日目" (verified).
2. Designed moments with fixed dates and a live today drift (Main shows "試験後" after 6 Dec 2026); Readiness shows a
   hard-coded "あと39日".
3. Goal's Back button has no handler; its "Step 2 of 3" bar is decoration.
4. `plan.minutes` is saved but unused; `status.dueToday` is computed but unused.
5. No guard when the exam is days away (11 sessions a day for N5 with 5 days left).
6. Main's empty days-left chip when there is no exam; the stamp row's test slot is gold even when the test is not
   written while the node is grey; the Readiness tab label differs between Main ("判定 準備中") and Mock/Notebook.
7. `tp` is restored as 0 or 1 only, while Teach draws 3 dots and says "of 3" (days have 2 patterns): size both from
   the data.
8. The engine's current level is a module global changed by `view()`; any code path that renders without `view()`
   sees whatever level was set last (on a standalone board, N2).
9. Code-unit slicing (Notebook quote) and code-point sets (`addWrote`) break combining marks: use grapheme helpers.
10. Skill card `href` is always Reading.dc.html, even on a listening day (canvas-only effect).
11. Animations do not honour `prefers-reduced-motion`; add a reduced-motion rule for the stamp and sheet keyframes.

### 6.7 Guarani facts these screens rely on (for copy and examples; content belongs to the curriculum notes)
- Official alphabet (achegety) of 33 letters: a, ã, ch, e, ẽ, g, g̃, h, i, ĩ, j, k, l, m, mb, n, nd, ng, nt, ñ, o, õ,
  p, r, rr, s, t, u, ũ, v, y, ỹ, ' (puso) **[revisar]**. y is a vowel; mb nd ng nt are single letters (matters for
  spelling drills and tile splits).
- Stress usually on the last syllable; an acute marks it elsewhere (óga "casa", kóva "esto"). Nasality spreads (nasal
  harmony): suffixes alternate, e.g. locative -pe / -me (ógape, tetãme), negation nd-…-i / n-…-i (ndaguatái, nañe'ẽi)
  **[revisar every example]**.
- Agglutinative verbs: person prefixes a- re- o- ja-/ña- ro- pe- (aguata, reguata, oguata, jaguata, roguata, peguata);
  tense/aspect suffixes such as -ta (aguatáta), particles such as kuri **[revisar]**. "We" inclusive ñande vs exclusive
  ore has no Spanish counterpart: a natural Compare page.
- Text facts (verified in Node): `'ẽ'.normalize('NFC')` is ẽ (U+1EBD), but g̃ stays two code points after NFC;
  `Intl.Segmenter` keeps g̃ as one grapheme.
- Everyday speech mixes Spanish (jopara); decide the register the course teaches and say so in the Goal or menu note.

### 6.8 Open questions for the design
- Level names (A1–B2 MCER vs Básico/Intermedio) and how many to show as chips at launch.
- Target date: presets only, or a free date picker; what "pasar" (painting the second eye) means without an exam (a
  final level check?).
- Mascot and its goal ritual (replaces the daruma's eyes on Goal, Main, Readiness).
- Spanish register: neutral "tú" or Paraguayan "vos" (affects every button).
- Who records the Guarani audio, and whether any speech recognition is possible (affects a Speaking counterpart).
