# Design brief, part 1: how every artboard is built

This part is fixed. Part 2 (BRIEF-design.md) gives the name, the look, the words and each board's spec.
The Guarani app is a sibling of the user's Yaoki suite: it copies Yaoki's structure, wiring, component recipes and
exact numbers, and changes the language, the colour accent, the mascot and the content. When in doubt, open the Yaoki
board named in your spec and do what it does.

## 1. Where things are

- Canvas root (the folder holding `project/`): `CANVAS=/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/canvas`.
  Write your artboards ONLY as `$CANVAS/project/<Name>.dc.html` (ASCII file names: letters, digits, `_`, `.`, `-`).
- Shared files already there (read them, never change them): `project/gn-course.js` (the engine, `window.gnCourse`),
  `project/gn-sound.js` (the player, `window.gnSound`; no clips exist yet, so `has()` is always false and every sound
  control uses its silent stand-in), `project/gn-course-a1.js` … `gn-course-c2.js` (the level data, built from content).
- Yaoki's boards to copy from: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki/yaoki/project/*.dc.html`
  (main app), `.../ref/Yaoki/yaoki-n1/project/*.dc.html` (N1 app), Reader canvas `.../artifact-files/7ec88b87-7732-468d-876e-3ad7ca541b29/project/`,
  Mascot canvas `.../artifact-files/25ff9d90-eba8-42aa-8494-ff9e80353214/project/`, Yaoki Typing and Speaking `.../ref/Yaoki/docs/typing/`, `.../docs/speaking/`.
- Notes about Yaoki and about Guarani: `.../scratchpad/notes/*.md` (Y1 plan & engine, Y2 lesson loop, Y3 skills/tests/review,
  Y4 reader/typing/speaking, Y5 platform & brand; G1 sounds & fonts, G2 grammar, G3 learners, G4 data & licences,
  G5 culture/naming/microcopy, G6 CEFR & level exam, G7 six-level syllabus).
- The Design canvas format: `.../artifact-files/25ff9d90-eba8-42aa-8494-ff9e80353214/artifact-type/reference/format.md` and `.../SKILL.md` beside it.

## 2. The artboard format: rules that fail silently if broken

- Skeleton: `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>…</title><script src="./support.js"></script>`
  then this board's own scripts, then `</head><body><x-dc><helmet>…</helmet> ROOT </x-dc><script type="text/x-dc" data-dc-script data-props='…'>class Component extends DCLogic { … }</script></body></html>`.
  Keep the `<script src="./support.js"></script>` line EXACTLY, first in the head.
- Scripts in the head, in this order, only those the board needs: `./gn-sound.js`, `./gn-course-a1.js`, `./gn-course-a2.js`,
  `./gn-course-b1.js`, `./gn-course-b2.js`, `./gn-course-c1.js`, `./gn-course-c2.js`, `./gn-course.js`. A board that reads
  the course loads ALL six level files, then the engine. A board must load everything it needs to render on its own
  (an imported board too: App imports boards, and each must still open alone).
- Helmet: the font link (section 4, exactly), then `<style>` with `body{margin:0}`, `button{font:inherit;color:inherit;cursor:pointer}`,
  `a{color:#2F4FD0;text-decoration:none}a:hover{color:#1B2440}`, `rt{font-size:9px;font-weight:500;color:#5A6382}`,
  the keyframes the board uses (section 5) and the reduced-motion rule. Nothing else in the helmet; every other style is inline.
- Root: fixed `width: 390px; height: 844px; box-sizing: border-box; overflow: hidden; background: #F4F5F9; color: #1B2440;
  font-family: 'Nunito', 'Avenir Next', sans-serif`; keep the top 50 px and bottom 34 px empty
  for the phone's own bars (no fake status bar, no fake keyboard, no home indicator drawn).
- Holes `{{ a.b }}` are dotted lookups into `renderVals()` ONLY: never `{{ a + b }}`, `{{ !x }}`, `{{ f() }}`, `{{ x ? y : z }}`.
  Compute everything in `renderVals()` and return it by name. Attributes: `x="{{ v }}"` passes the raw value.
- Control flow: `<sc-if value="{{ cond }}" hint-placeholder-val="{{ false }}">…</sc-if>`, `<sc-for list="{{ items }}" as="it" hint-placeholder-count="3">…</sc-for>`;
  ALWAYS set the hint attributes. Per-item handlers and styles are precomputed on each item in `renderVals()`.
- Events: `onClick="{{ fn }}"`, `onPointerDown`, `onInput`, … (JSX camelCase, whole value). No global keydown handlers.
- All UI is `<x-dc>` markup. Never build UI in script (`innerHTML`, `appendChild`, `document.createElement` for UI).
- Close every non-void element; quote every attribute. `class`→`className` and `for`→`htmlFor` are mapped for you.
- `data-props` is single-quoted JSON: escape `&` as `&amp;`, a literal `'` as `&#39;`, `"` inside strings as `\"`.
  Declare every callback/object prop with `{"editor": null}` and always `"$preview":{"width":390,"height":844}`.
  Tweaks are levers, not copy: declare almost none.
- Child boards: `<dc-import name="Keyboard" … hint-size="358px,470px"></dc-import>` (never self-closing, never capitalised tags,
  never a prop called `name`). Props are kebab-case in markup, camelCase in `this.props`.
- Links between boards: `<a href="Today.dc.html" onClick="{{ toToday }}" style="…button look…">`; the `<a>` IS the button
  (a `<button>` inside an `<a>` swallows the click).
- No network except the Google Fonts css2 link; no `<iframe>`, `<object>`, `<embed>`; icons are inline stroke SVG
  (never emoji); decorative SVG `aria-hidden="true"`, meaningful SVG `role="img" aria-label="…"`.
- Accessibility as drawn: real `<button>`, `<a href>`, `<input>` with a `<label>`; `aria-label` on icon-only buttons;
  `aria-pressed` on toggles; `role="dialog" aria-modal="true"` on sheets; touch targets at least 44 px; text contrast 4.5:1
  (3:1 from 24 px). `lang="es"` on the root document; wrap Guarani in `<span lang="gn">` (Guarani text blocks: `lang="gn"` on the container).
- Never use `{{ … }}` inside `<title>` or `<style>`.

## 3. Wiring (copy Yaoki exactly)

- ONE board holds the whole flow: `App.dc.html` keeps one state (`window.gnCourse.fresh()`), builds handlers with
  `window.gnCourse.handlers(() => this.state, (fn) => this.setState(fn))`, and shows one screen at a time:
  `<sc-if value="{{ at.Main }}" hint-placeholder-val="{{ false }}"><div style="animation: gn-in 220ms ease-out"><dc-import name="Main" go="{{ go }}" app="{{ app }}" save="{{ save }}" miss="{{ miss }}" reviewed="{{ reviewed }}" level="{{ level }}" hint-size="390px,844px"></dc-import></div></sc-if>`
  with `app: window.gnCourse.view(state)`.
- Every screen receives the same props: `go(screen)`, `app` (= `gnCourse.view(state)`), `save(patch)`, `miss({src, wrong})`,
  `reviewed(src, right)`, `level(lv)` (switch level). Guard every call: `if (this.props.save) this.props.save(…)`.
- Navigation idiom, identical in every file:
  `const nav = (to) => (e) => { const go = this.props.go; if (go) { e.preventDefault(); go(to); } };`
  On the canvas (no `go`) the link moves Play to that board; inside App, `go()` switches the shared screen.
  A control that does nothing in both worlds: `(e) => { if (this.props.go) e.preventDefault(); }`.
- Designed moment: opened alone, every board shows its most telling state:
  `const app = this.props.app || C.view(SAMPLE)` where SAMPLE is built RELATIVE TO TODAY so it never drifts:
  `const T = C.today(C.now());` and dates from `C.addDays(T, n)`. The shared sample for the plan boards is in part 2.
- Moment boards: a small board that imports a screen with a `view` prop to show another state (as Yaoki's ExamResult
  imports Exam with `view="result"`). Its head loads the same scripts as the imported board.
- `save(patch)` merges; progress (`prog`) only moves forward. See the engine below.

## 4. Typefaces (both on Google Fonts, both draw every Guarani letter, checked by rendering)

Copy this link EXACTLY into every helmet (it asks Google Fonts for one file per weight holding only the characters the
app uses, which keeps the combining tilde of g̃ and G̃ on its letter; the split default files draw a capital G̃ in a system
serif). It is in `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/build/fontlink-html.txt`
(already escaped for an HTML attribute: `&amp;`). Read that file and paste its one line as
`<link href="<the line>" rel="stylesheet">`. Do not edit the character list; never add other font links.
- UI (Spanish and short Guarani labels): `font-family: 'Nunito', 'Avenir Next', sans-serif` with weights 500 (body), 700
  (secondary), 800 (titles, buttons). Nunito replaces Yaoki's M PLUS Rounded 1c (M PLUS misplaces the tilde of g̃).
- Guarani sentences, examples, options, tiles, passages, cells, keys (the role Klee One plays in Yaoki):
  `font-family: 'Andika', 'Nunito', sans-serif`, 400 or 700.
- Characters to expect: a e i o u y · ã ẽ ĩ õ ũ ỹ · á é í ó ú ý · ñ · g̃ (g + U+0303) · the puso ' (U+0027) · mb nd ng nt rr ch;
  Spanish ¿ ¡ ü. Text is NFC; the puso is always U+0027 in data. Never split g̃ (use `gnCourse.chars`/`cut`). Never break a
  line at the puso; long agglutinated words may need `overflow-wrap: anywhere`. Do not use U+3000 or other wide spaces
  between the two languages (Nunito lacks them): use ` · ` or a margin.

## 5. Tokens and recipes (Yaoki's exact values; accent names in part 2)

Colours (Yaoki, kept): ground `#F4F5F9` · card `#FFFFFF` · ink `#1B2440` · muted `#5A6382` · line `#DDE1EC` · dashed `#C9D0E3`
· graph grid `#E6E9F3` · chip grey `#EEF0F6` · disabled text `#9AA1B5` · primary indigo `#2F4FD0` · indigo tint `#E8ECFB`
· indigo track `#D9E0F8` · right teal `#0B7A6B` on `#E0F3EF` · wrong red `#C7361E` on `#FDEBE6` (track `#F8D6CC`) · gold `#F2B43A`
· gold tint `#FFF4D6` · highlight `#FFE9B0` · overlay `rgba(27, 36, 64, 0.5)`.
The accent that replaces Yaoki's daruma vermilion (stamps, ritual, mascot) is defined in part 2.

Type sizes: 52/800 score · 34 Teach form (Andika 700) · 26/800 h1 (lh 1.25) · 22/800 · 20/800 · 18/800 sheet h2 · 17/800 primary CTA
· 16/800 card titles · 15/800 header · 14 · 13 labels · 12 secondary · 11 kickers and tab labels · bodies 13/500 lh 1.45.

Surfaces: hero card `border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; border-radius: 20px; background: #FFFFFF`;
quiet card `border: 2px solid #DDE1EC` (no shadow); info box `background: #E8ECFB; border-radius: 16px; padding: 12px 14px`;
cards in lessons `border-radius: 18px; padding: 12px 14px`; bottom sheet `border-radius: 26px 26px 0 0; border-top: 2px solid #1B2440; padding: 18px 20px 34px; background: #F4F5F9`.

Buttons: primary CTA `height: 54px; border-radius: 16px; background: #2F4FD0; border: 2px solid #1B2440; box-shadow: 0 4px 0 #1B2440; color: #FFFFFF; font-size: 17px; font-weight: 800`
(ritual CTA: the same in the accent text colour; dark CTA `background: #1B2440; box-shadow: 0 3px 0 #2F4FD0`; destructive outline:
white, `2px solid #C7361E`, red text, 50 px). Card CTA 48 px, radius 14, shadow `0 3px 0 #1B2440`, 16px/800.
Options `border-radius: 14px; border: 2px solid #1B2440; box-shadow: 0 3px 0 #1B2440; background: #FFFFFF`; selected: `2.5px solid #2F4FD0`,
`background: #E8ECFB`, no shadow, `transform: translateY(3px)`. Chips `padding: 4px 10px; border-radius: 10px; font-size: 12px; font-weight: 800`.
Selectable chip on: `2px solid #1B2440`, `#2F4FD0`, shadow `0 3px 0 #1B2440`, white; off: `2px solid #DDE1EC`, white, ink; not written:
`2px dashed #DDE1EC`, `#F4F5F9`, `#9AA1B5`. Progress segments 10 px radius 5; bars 12 px radius 6. Close X: 44×44 with `margin-left: -10px`.

Keyframes (prefix gn-):
`@keyframes gn-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}` (screen change, 220ms ease-out) ·
`@keyframes gn-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}` (sheets, 240ms) ·
`@keyframes gn-fade{from{opacity:0}to{opacity:1}}` (overlays, 160ms) ·
`@keyframes gn-stamp{0%{opacity:0;transform:scale(1.8) rotate(-20deg)}55%{opacity:1;transform:scale(.92) rotate(-9deg)}100%{opacity:1;transform:scale(1) rotate(-9deg)}}` (500ms ease-out both) ·
and always `@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}`.

Icons (24×24 viewBox, `fill="none" stroke-linecap="round" stroke-linejoin="round"`): back `M15 5l-7 7 7 7` (2.6) · next `M9 5l7 7-7 7` ·
close `M6 6l12 12M18 6L6 18` (2.6) · calendar `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>` ·
path tab `<circle cx="6" cy="19" r="2.5"/><path d="M8.5 19h9a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15.5"/><circle cx="18" cy="5" r="2.5"/>` ·
notebook `<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5"/>` ·
exam (stopwatch) `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>` · progress (target) `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>` ·
padlock `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>` · play `<path d="M7 4.5v15l13-7.5z"/>` (filled) ·
speaker `M4 9v6h4l5 4V5L8 9H4z` + `M16.5 9a4 4 0 0 1 0 6` · wrong × `M6 6l12 12M18 6L6 18` (red, 3.5) ·
right ✓ `M5 12.5l4.5 4.5L19 7.5` (teal, 3.2) — Guarani has no ○ mark, use the tick · star `M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z` (gold fill, ink 1.8) ·
microphone `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>` · book (reader) `<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19v2H6"/>` ·
keyboard `<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>`.

Tab bar (Main, Notebook, Exam tab, Progress): `<nav aria-label="Principal">`, `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 6px 8px 30px; background: #FFFFFF; border-top: 2px solid #DDE1EC`;
each tab an `<a>` 50 px tall, column, gap 2px, 11px/700 `#5A6382`, icon 24 stroke 2.2; current tab `aria-current="page"`, `#2F4FD0`, 800, stroke 2.4.

Graph paper (path regions, as in Yaoki): `background-image: linear-gradient(#E6E9F3 1px, transparent 1px), linear-gradient(90deg, #E6E9F3 1px, transparent 1px); background-size: 26px 26px`.

## 6. The engine (`window.gnCourse`, `project/gn-course.js`): what screens call

Same names and meanings as Yaoki's `ykCourse` unless noted. `const C = window.gnCourse;`
- Levels: `C.ORDER` = `['A1','A2','B1','B2','C1','C2']`; `C.level()`, `C.setLevel(lv)`, `C.withLevel(lv, fn)`, `C.meta(lv)` → `{ name, can }`
  (Spanish CEFR name and a one-line can-do), `C.levels()` → `[{ level, name, can, ready, written, days, units }]`, `C.nextLevel(lv)`, `C.levelOf(id)`.
- Ids: sessions `a1u03d4` (unit 3 day 4), `a1u03t` (week test); items `a1u01d1.p1` (point), `.c1` (compare check), `.d1…` (drill),
  `.e1…` (exam-style), `.k1` (words check), `.r1` (skill item), `a1u01t.1…` (week test). `C.sid(unit, day|'t')`, `C.parse(id)` → `{ level, unit, day }`.
- Course: `C.units()`, `C.unit(n)` → `{ n, gn, es, days[6], test[ids] }`, `C.sessions()` → `[{ id, unit, day, kind: 'study'|'review'|'test', ready, title }]`,
  `C.session(id)`, `C.day(id)`, `C.item(id)`.
- Progress: `done[sid] = { g: 0..3, ks, kw, k, r }`; `C.complete(state, s)`; `C.progress(state, lv)` → `{ units: [{ n, es, gn, of, done, full }], unitsDone, stamps, exam, passed }`.
- Plan: `plan = { start, target: 'YYYY-MM-DD' | null, pace: 'fit'|'steady', minutes: 15|30|45 }`. No target = one session a day.
  With a target, the last 7 days are kept for review and the level exam. `C.plan(settings)`, `C.status(state, now)` →
  `{ plan, next, dueToday, perDay, daysLeft (null without target), stamps, today, behind, target }`, `C.fits(settings)`, `C.today(now)`,
  `C.now()`, `C.addDays(iso, n)`, `C.daysBetween(a, b)`, `C.dateEs(iso, withYear)` ("domingo, 6 de diciembre de 2026"), `C.dateGn(iso)` (Guarani, or '' until verified).
- Notebook: `C.miss(list, m, now)`, `C.due(list, now)`, `C.reviewed(list, src, right, now)`; spacing `C.STEPS` = [1, 3, 7]; three rights clear an entry.
- Level exam: `C.PARTS` (P1 Lectura, P2 Escucha, P3 Mediación, P4 Escritura, P5 Oral, with `group` and `how`), `C.examResult(parts, mode)` →
  `{ groupC, groupP, apto, comprension, mode }` (Apto: ≥60 % in each group, no part under 40 %; group C alone → Constancia de comprensión).
- Placement: `C.placed(comp, prod)` → `{ comp, prod, start }` (the plan starts at the production level).
- Week-test waiver: `C.waives(placement, score, of)` is true when a learner placed higher in comprehension than in production scores at least `C.WAIVE` (80 %) on a week test; `C.waived(testId)` lists that unit's study days whose reading or listening lesson then counts as done. `handlers.save` applies it when a week test's result is saved, as the placement result promises.
- Text: `C.rich(src, opt)` → segments `{ t, r, ruby, plain, bg, pad, ws, line }` (markup: `{highlight}` also inside words, `[base|gloss]`,
  `_underline_`, `^clue^`; opt `ruby:false` drops glosses, `hl:false`, `clue:'line'|'mark'`); `C.plain(src)`; `C.norm(s)` (NFC, one puso);
  `C.fold(s)` (for matching); `C.chars(s)` (graphemes); `C.cut(s, n)`; `C.spell(typed, answer)` → `{ ok, near, issues: [{ k: 'puso'|'nasal'|'acento'|'letras', more }], at }`
  and `C.spellNote(issue)` → "Falta el puso (')", "Falta la tilde nasal (~)", "Falta el acento (´)", "Revisá las letras" (or the "Sobra…" forms).
- Areas: `C.area(key)` → `{ key, es, tagBg, tagColor }` for `vocab` Palabras, `grammar` Gramática, `reading` Lectura, `listening` Escucha,
  `mediation` Mediación, `sound` Sonido y letra. Week test results store `areas: { vocab: { right, of }, … }`.
- State: `C.fresh()` → `{ screen: 'Goal', started, level, plans, plan, cur, done, tests, exams, mistakes, tp, set, placement, typed }`;
  `save` keys: plain keys are copied (`cur`, `tp`, `set`, `level`, `plan`, `placement`, `screen`); `prog` merges into the current session
  with Math.max; `result` stores a week test at `tests[result.id]`; `exam` stores a level exam result at `exams[level]` (a pass is never replaced
  by a fail); `typed` adds words spelled with the Guarani keyboard.
- `C.view(state)` → `{ status, plan, plans, sid, session, unit, day, prog, done, tests, exams, exam, tp, set, mistakes, typed, placement, profile, exposure, level, meta, levels, progress }` (`plans`: the other levels' plans; `profile`: the goal's answers; `exposure`: the «lo usé» marks).
- Sound: `window.gnSound` — `has(key)`, `ms(key)`, `unlock()`, `play(key)`, `stop()`, `on()`, `at()`. No clips exist: a sound control
  checks `has()` and otherwise lights up as "playing" for `600 + C.plain(text).length * 120` ms (Yaoki's silent stand-in), showing the
  words being said. Clip keys: `<item or example id>` (e.g. `a1u01d1.p1.x0` = point 1, example 0; `a1u01d1.r1` = listening item).

## 7. Content: the shape the screens read

`C.day(id)` returns a day:
```
{ title, grammar: { points: [Point ×2] ([] on the review day 6), compare: { intro, forms: [{ form, tag, mark: 'dot'|'down'|'up', gn, es }], check: Item },
                    drill: [Item ≥4], exam: [Item ×3] },
  words: { gn?, es, intro, sound?: { focus, letters: [..], note, pairs?: [[gnA, esA, gnB, esB]] }, words: [{ id, gn, es, parts?: [[gn, es]], note? }],
           spell?: [word ids to type in the Write step], check: Item },
  skill: reading:   { kind: 'reading', es, ask, seconds, passage (gn, markup), strategy, item: Item }
         listening: { kind: 'listening', es, situation, ask, item: Item (+ script: [[speaker, gn]]), audio: [[N|M|F, gn]] } }
Point = { id, form (gn), gloss (es), connect: [{ pos (es), rule (gn with {hl}) }], examples: [{ gn, es, parts?: [[gn, es]] }], watch: { note (es), bad (gn), good (gn) } }
Item  = choice: { id, kind: 'choice', area, label, q (with "(   )" blank or _underlined_ word, ^clue^), options, answer (1-based), why[] | explain, short? }
        build:  { id, kind: 'build', area, label, join: 'word'|'sentence', before, after, tiles (right order), bank (display order), hint?, full, es, explain }
                (Yaoki's ★ "star" item becomes Guarani "build": join 'word' glues morphemes into one word — nd + a + guata + i → ndaguatái;
                 the joined spelling to show is `full`, never the raw concatenation, because accents move; join 'sentence' puts word tiles in order)
        spell:  { id, kind: 'spell', area, prompt (es), answer (gn), accept? }
```
Units: `C.unit(n)` → `{ n, gn, es, days, test }`; the syllabus of all six levels is loaded (titles for every day); a day is written when it has `grammar`
(`session.ready`). Unwritten days show "En preparación" and are locked, as Yaoki's 準備中.

## 8. Quality bar

- Copy Yaoki's exact numbers; change only what the Guarani spec says to change. Spanish copy is short and plain, like Yaoki's English.
- Every Guarani string on a board comes from the content (through the engine) or from the verified glossary in part 2. Never invent Guarani.
  If you need a Guarani word that is in neither, use Spanish and say so in your final report.
- Each board opens alone in its designed moment, AND works inside App with the shared props.
- Before you finish: re-read your file against section 2 (holes, hints, closing tags, quotes, data-props escaping, head scripts) and fix it.
  You may syntax-check the logic class by extracting it into a scratch .js file and running `node --check`; do not render or screenshot.
