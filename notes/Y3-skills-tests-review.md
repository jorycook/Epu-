# Y3 · Vocabulary scenes, writing, reading, listening, week test, notebook, review, mock exam, sound (Yaoki → Guarani)

Everything below was read from the real source (paths in §9). Yaoki root =
`/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki` (read-only). Values in `code` are
copied from the files. "Verified" = computed by running the real `course.js` / `yk-write.js` with the real course data in
Node (today = 2026-11-03). Guarani or Spanish strings marked **[revisar]** need a native speaker's or teacher's check;
**[decide]** marks a product decision; **[verify]** a fact to check on a device. Companion notes: Y1 (wiring, engine,
plan, shared tokens, Goal/Main/Today/Readiness) and Y2 (grammar loop, Exam runner, content format) in the same folder.
Where they already decided something for the Guarani app (namespace `window.gnCourse`, Scene → `Words.dc.html`, Andika
for Guarani sentences, `<html lang="es">` + `lang="gn"` spans, levels A1–B2, ✓ for right), this file follows them.

---

## 0. At a glance (read this first)

1. **Eighteen canvas boards are mine (eleven components plus seven view wrappers of MockRun); eight components live in
   the prototype.** Row 3 "Exam skills, week test, review":
   `11 · Kanji in a scene` (Scene), `12 · Reading skill`, `13 · Listening`, `14 · Week test`, `15 · Mistake notebook`,
   `16 · Notebook review`. Row 4 "Mock exam: the real format, briefing to result": `17 · Mock exam tab` (Mock),
   `18 · Mock briefing` (MockRun) and seven boards that are MockRun mounted with a `view` prop (`19 · Paper: vocabulary`,
   `20 · Answer sheet`, `21 · Paper: reading`, `22 · Break and sound check`, `23 · Paper: listening`,
   `24 · Mini mock result`, `25 · Answers and reasons`), plus `26 · Full mock result` (MockFull, static, not in the
   prototype). Row 5 "Writing: stroke order, by finger": `27 · Kanji lesson: writing` (SceneWrite = Scene with
   `moment="write"`) and `28 · Writing pad (part of 27)` (Write, a child component, 358×470, radius 24). In the
   prototype (`App.dc.html` SCREENS): Scene, Reading, Listening, WeekTest, Notebook, Review, Mock, MockRun.
2. **The words lesson (Scene) is one artboard with three steps** in one state machine: 学習 the scene (tap words on a
   navy "sign board", see reading, meaning, kanji parts, hear it) → 書く writing (each NEW kanji three times: traced,
   faint, from memory; then each word of 2+ kanji one kanji at a time) → 本番 one exam-format question. Progress:
   `ks: 1` scene read, `kw: 1` all written, `k: 1` lesson done. Next stays shut until the current kanji/word is written.
   What was written is saved additively (`wrote` string, `wroteWords` array) across levels, so nothing is asked twice;
   kanji of the levels below (`C.below()`) count as known.
3. **The writing pad = `Write.dc.html` (panel) + `yk-write.js` (engine, `window.ykWrite`).** Panel props: `task`
   (`{kind:'kanji', c}` | `{kind:'word', w, cells:[{c, write, known}]}` | `{kind:'show', c}`), `tkey` (a new key restarts),
   `finished(result)`, `size` (pad px, clamp 180–320, Scene passes 270), `strip` (false hides the stroke-order strip).
   Rules: a stroke counts when in order, same direction, close, right shape and roughly right length; **after 2 misses
   the stroke is shown in yellow from its start; after 4 it is written in for the learner**; a stroke drawn backwards is
   diagnosed; a phone-cancelled stroke is not held against the learner. Guarani has no strokes: §8.3 specifies the
   replacement spelling pad with the same props and the same help rules.
4. **Reading and Listening are one question each, explained.** Reading: a passage card + one question, a count-up
   stopwatch against an advisory limit (90 s), a strategy tip ("drill only"), Check, then a verdict sheet; the passage's
   `^clue^` signposts light up (`#FFE9B0`) after checking. Listening: a play button + 22-bar waveform that fills in
   time with the real audio; answers stay locked until the clip has played; Replay and a slow take (`ゆっくり 0.8×`);
   after answering, the script and a reason for every reply appear. Both save `prog: { r: 1 }` and send a wrong pick to
   the notebook.
5. **Mistake notebook spacing (verified):** a miss is due tomorrow (step 0); a right answer moves it to +3 days (step 1),
   then +7 days (step 2); the third right in a row clears it (卒業); a wrong answer at any step resets to step 0, due
   tomorrow; a new miss of the same question replaces its entry. `C.STEPS = [1, 3, 7]`. The review session is a
   snapshot of what was due when it opened; each answer is recorded at once (`reviewed(src, right)`).
6. **Mini mock = the real paper cut short:** briefing → section 1 (vocabulary, grammar, reading: 9 questions on ONE
   10:00 clock that never pauses, free navigation, flags, an answer sheet with ovals, submit locks the section, auto
   submit at 0:00) → 1:00 break with a sound check → section 2 listening (3 questions, paced by the audio, plays once,
   no going back, 8 s / 6 s answer time) → result (○/✕ per question, time per section) → answers and reasons in four
   area tabs. Every miss and every blank goes to the notebook. ~15 minutes, 12 questions.
7. **Sound = `sound.js` (`window.ykSound`) + clip registries.** Clips are `window.__ykClips[key] = { ms, b }` (MP3 as
   base64 in JS, main app) or `{ ms, u: 'audio/<key>.mp3' }` (file fetched on first play, N1 app). The length `ms` is
   known before decoding, so screens can time themselves. A screen calls, inside a tap: `snd.has(key) && snd.unlock()
   && snd.play(key)`; when that is false, or when no sound comes out (`on()`/`at()`), it falls back to a **silent
   stand-in** of fixed length, so nothing ever hangs. iPhone quirks are handled (unlock inside a tap, "interrupted"
   state, a "running" output whose clock does not move, stop and release on `visibilitychange`).
8. **Clips are made by text-to-speech** (Kokoro-82M; narrator `jf_gongitsune`, man `jm_kumo`, woman `jf_alpha`), MP3
   24 kHz mono 32 kbit/s, silence trimmed and padded, a number said together with its choice, slow takes synthesized at
   speed 0.8 with stretched gaps (`l_drill_slow` is 16,437 ms vs 12,990 ms; N1 `l.u1l1.slow` 18,600 vs 14,600). Kokoro has no Guarani voice, and
   espeak-ng's Guarani (`gn`) phonemizer drops the puso and flattens g̃ and nd (**verified**, §8.8): Guarani model audio
   must be recorded by native speakers.
9. **Offline:** the app is stored at install; sound is "lazy": a unit's sound file (or an N1 clip) is stored the first
   time it is used, and the whole chosen level is requested in the background (`postMessage({ keepLevel })`); every
   lazy file carries a content hash so a new build keeps unchanged files.
10. **Every board shows a designed moment when opened alone** (no `props.go`): Scene with three words found; SceneWrite
    at its first new kanji, second time, ~60% of strokes in; Write with 書 the second time, 6 of 10 strokes; Reading
    with option 2 picked at 0:48; Listening answered right with the script open; WeekTest at 18/24; Notebook with two
    items due and one tomorrow; Review at item 1 of 2 answered (wrong, despite its comment, verified); Mock fresh;
    MockRun at the moment its `view` tweak names, and a touch makes that moment come alive (its clock starts).
11. **Must-change for Guarani (detail §8):** kanji/stroke writing → a spelling pad for the letters Spanish lacks (nasal
    vowels ã ẽ ĩ õ ũ ỹ, g̃, the puso ', stress accents, digraphs mb nd ng nt ch rr, y as a vowel), with an in-app
    keyboard (the iOS Spanish keyboard has no ẽ ĩ ũ ỹ g̃ **[verify]**); kanji parts in the word card → morphemes
    (root + affixes) and a syllable line with the stressed syllable; furigana → tap-to-gloss; JLPT item types, mondai
    numbers, scaled scores and the daruma → the course's own types, a level check ("prueba de nivel") and the new
    mascot; Japanese teacher stamps → Spanish/Guarani praise; ○ → ✓; U+3000 label separator → a styled gap; review of
    listening items must replay the audio (Yaoki only shows the script); recorded clips, ASCII clip keys, one stand-in
    helper.

---

## 1. Shared look of these screens (exact values; Y1 §5.0 has the full token list)

**Frame.** Root `width: 390px; height: 844px; box-sizing: border-box; background: #F4F5F9; color: #1B2440; font-family:
'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif; line-break: strict; display: flex; flex-direction:
column; overflow: hidden`. Lesson screens (Scene, Reading, Review, WeekTest) pad `50px 16px 34px` (top 50 = status bar,
bottom 34 = home indicator). Listening, Notebook and Mock pad only `padding-top: 50px` (sections carry `margin: … 16px`;
sheets and the tab bar carry their own bottom 34/30 px). MockRun and MockFull start with a navy band that holds the 50 px
(`padding: 50px 16px 10px; background: #1B2440; color: #FFFFFF`).

**Helmet (every screen).** `<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">`
and `body{margin:0}` `button{font:inherit;color:inherit;cursor:pointer}` `a{color:#2F4FD0;text-decoration:none}a:hover{color:#1B2440}`
`rt{font-size:9px;font-weight:400;color:#5A6382}` (+ `button:disabled{cursor:default}` in Mock/MockRun).

**Keyframes used here.**
- `@keyframes yk-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}` (sheets 240 ms ease-out;
  Review's verdict box 220 ms)
- `@keyframes yk-fade{from{opacity:0}to{opacity:1}}` (scrims, 160 ms)
- `@keyframes yk-stamp{0%{opacity:0;transform:scale(1.8) rotate(-20deg)}55%{opacity:1;transform:scale(.92) rotate(-9deg)}100%{opacity:1;transform:scale(1) rotate(-9deg)}}`
  (500 ms ease-out both; WeekTest's big stamp `550ms ease-out 150ms both`)
- `@keyframes yk-pop{0%{transform:scale(1)}45%{transform:scale(1.04)}100%{transform:scale(1)}}` (Write's pad, 360 ms
  ease-out, when a time is written)

**Header row of a lesson.** `display: flex; align-items: center; gap: 10px; height: 44px`; close `<a>` 44×44,
`margin-left: -10px`, X icon `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2440"
stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`; a 12 px progress bar
(`border-radius: 6px; background: #DDE1EC`, fill `#2F4FD0`, fill radius `0 6px 6px 0`) or Scene's step bar; a right
label 12/800 (red `#C7361E` in Scene, indigo `#2F4FD0` elsewhere).

**Primary CTA.** `height: 54px; border-radius: 16px; background: #2F4FD0; border: 2px solid #1B2440;
box-shadow: 0 4px 0 #1B2440; color: #FFFFFF; font-size: 17px; font-weight: 800`. Disabled look:
`border: 2px solid #C9D0E3; background: #DDE1EC; color: #5A6382; box-shadow: none` (Review uses `background: #EEF0F6`). Verdict-coloured
Next: same shape, `background` = teal `#0B7A6B` (right) or red `#C7361E` (wrong). Dark CTA (week test start, Submit):
`background: #1B2440; box-shadow: 0 4px 0 #2F4FD0`.

**Option buttons (choice look, used by Reading/Review/MockRun).** Idle `border: 2px solid #1B2440; background: #FFFFFF;
box-shadow: 0 3px 0 #1B2440; font-weight: 700`. Picked before checking: `border: 2.5px solid #2F4FD0;
background: #E8ECFB; box-shadow: none; font-weight: 800; transform: translateY(3px)` (pressed into its shadow). Right
after checking: `border: 2.5px solid #0B7A6B; background: #E0F3EF`. Wrong pick: `border: 2.5px solid #C7361E;
background: #FDEBE6`. Others after checking (Review): `border: 2px solid #DDE1EC; color: #5A6382; font-weight: 700`.

**Marks.** Right = a CIRCLE (the Japanese ○): `<svg viewBox="0 0 24 24" fill="none" stroke="#0B7A6B"
stroke-width="3.5"><circle cx="12" cy="12" r="8.5"/></svg>` (r 9 at 30 px). Wrong = cross `M6 6l12 12M18 6L6 18` (big:
`M5 5l14 14M19 5L5 19`) `stroke="#C7361E" stroke-width="3.5" stroke-linecap="round"`. Notebook icon (24×24, stroke 2.2):
`<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M6 3v18M3 7h3M3 12h3M3 17h3M10 8h5"/>`. Stopwatch:
`<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>`. Speaker: `<path d="M4 9v6h4l5 4V5L8 9H4z"/><path
d="M16.5 9a4 4 0 0 1 0 6"/>` (Scene) / `<path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0
1 0 11"/>` (MockRun). Play triangle: `M8 5l11 7-11 7z` (filled). Flag: `M5 21V4M5 4h12l-2.5 4 2.5 4H5`. Pencil: `M4 20l4-1
11-11-3-3L5 16z` + `M14 7l3 3`. Lightbulb (hint): `M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6
1.1-2.2A6 6 0 0 0 12 3z`. Replay: `M4 12a8 8 0 1 0 2.4-5.7` + `M4 4v4.5h4.5`. Earphones: `M4 14v-2a8 8 0 0 1 16 0v2` + two
rects `x="2.5" y="14" width="4.5" height="7" rx="1.5"` / `x="17" …`. Star (weak spot, `fill="#F2B43A"` stroke ink 2):
`M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z`. Padlock (13 px, stroke 2.8): `<rect x="5"
y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`. Answer sheet: `<rect x="4" y="3" width="16"
height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>`.

**The verdict sheet** (Reading, Listening): slides up from the bottom, `border-radius: 26px 26px 0 0; border-top: 2px
solid #1B2440; padding: 16px 16px 34px; animation: yk-up 240ms ease-out; background: #E0F3EF (right) | #FDEBE6 (wrong)`;
inside: verdict row (30 px mark + `せいかい！ Correct` / `おしい！ Not quite` at 20/800 with the English in a 14/700 span),
a white explanation box (`border-radius: 16px; padding: 12px 14px; background: #FFFFFF`, heading 12/800 `#5A6382`),
optional notebook line, verdict-coloured Next.

**Area tag colours** (`C.area(type)`): vocab `文字・語彙` `{ tagBg: '#FDEBE6', tagColor: '#C7361E' }`; grammar `文法`
`{ '#E8ECFB', '#2F4FD0' }`; listening `聴解` `{ '#E0F3EF', '#0B7A6B' }`; reading `読解` (the fallback) `{ '#FFF4D6',
'#1B2440' }`. Decided by regexes on the Japanese type name: `/漢字|表記|語形成|文脈|言い換え|用法|語彙/` → vocab, `/文法/`
→ grammar, `/課題|ポイント|概要|即時|発話|聴/` → listening, else reading.

**Bilingual label pattern (verified character).** Japanese + U+3000 IDEOGRAPHIC SPACE + English, same element:
`つぎへ　Next`, `こたえる　Check`, `解説　Why`, `週テスト　WEEK TEST` (kicker: English in capitals), `今日の復習　Due
today`, `はじめる　Start the test`. A few use an ASCII space (`復習 REVIEW`, `練習 DRILL`, `もう一度 Replay`, `ゆっくり
0.8×`). Headings: Japanese 26/800 + `<span style="font-size: 15px; font-weight: 700; color: #5A6382">` English. Verdicts:
Japanese big + English small span. Marks with no English: `済` (done), `準備中` (in preparation), `卒業` (cleared), `苦手`
(weak spot, with English beside it).

**Scene-specific colours** (not in Y1's list): sign board `#1B2440`; word chip border `#6E7BA8` (solid when found,
dashed when not); selected chip `background: #2A3560; color: #F2B43A; outline: 3px solid #F2B43A;
box-shadow: 0 0 0 5px #1B2440`. Pad greys (yk-write.js): model stroke trace `#D3D8E5`, faint `#EBEDF3`, next stroke `#9EA9C8`, grid
`#DDE1EC`, numbers `#5A6382`, ink `#1B2440`, miss `#C7361E`, hint `#F2B43A`, start dot `#C7361E`. Disabled text
`#9AA1B5`. Chip grey / row rule `#EEF0F6`. Scrim `rgba(27, 36, 64, 0.5)`. Pass-mark tracks `#D9E0F8`.

---

## 2. Mistake notebook: spacing and review rules (exact, verified)

Engine: `yaoki/project/course.js`.

```js
var STEPS = [1, 3, 7];   /* a mistake comes back after 1 day, then 3, then 7; the next right answer clears it */
/* an entry: { src: item id, wrong: what was chosen, at: when, step: 0-2 (how many right in a row), due: 'YYYY-MM-DD' } */
C.miss = function (list, m, now) {
  var today = C.today(now);
  var entry = { src: m.src, wrong: m.wrong, at: now || Date.now(), step: 0, due: C.addDays(today, STEPS[0]) };
  return [entry].concat((list || []).filter(function (x) { return x.src !== m.src; }));
};
C.due = function (list, now) { var today = C.today(now); return (list || []).filter(function (x) { return !x.cleared && (x.due || '') <= today; }); };
C.reviewed = function (list, src, right, now) {   /* right: a step on (the third right in a row clears); wrong: back to 1 day */
  …if (!right) return { …x, step: 0, due: today + 1, at: now, last: 'wrong' };
  var step = (x.step || 0) + 1;
  if (step >= 3) return { …x, step: 3, cleared: true, at: now, last: 'right' };
  return { …x, step: step, due: today + STEPS[step], at: now, last: 'right' };
};
```

Walk (verified): miss on 11-03 → `{step 0, due 11-04}` · right on 11-04 → `{step 1, due 11-07}` · right on 11-07 →
`{step 2, due 11-14}` · right on 11-14 → `{step 3, cleared: true}` (its `due` is left as it was). A wrong answer at any
point → `{step 0, due tomorrow, last: 'wrong'}`. So a question leaves after **three right answers in a row**, the first
one day after the miss; minimum 11 days from the miss to clearing.

Rules around it:
- **Who reports a miss** (`props.miss({ src, wrong })`, handler → `C.miss(st.mistakes, m, C.now())`): Drill and Exam
  (incl. the week test; a blank is `'無解答'`), Scene's exam question (`wrong: o`, the raw option string), Reading
  (`wrong: OPTIONS[pick].short`, i.e. `item.short[k]` or the plain option), Listening (`wrong: SHORT[n]`, only if the
  item has an `id`), MockRun at the end of a run (`src: MOCK.prefix + n`, e.g. `mock3`, `n5mock3`; `wrong:
  (it.short || it.options)[a - 1]` or `'無解答'`). Compare's check reports nothing.
- **One entry per question:** a new miss of the same `src` replaces the old entry (back to step 0, newest first).
- **What the notebook shows:** `app.mistakes` = this level's mistakes only (ids carry the level prefix; for N2 also ids
  starting `mock` or `listening`), filtered to items that still exist (`C.item(m.src)`). Due = not cleared and
  `due <= today`. "Cleared today" = cleared and `m.at > now - 864e5` (last 24 h).
- **The review session** (`Review.dc.html`): `this.items = C.due(app.mistakes, now).filter((m) => C.item(m.src)).map((m)
  => ({ ...m }))` in the constructor, a snapshot: answering moves an entry on in the saved state immediately
  (`props.reviewed(entry.src, right)` on the pick), but the session list does not change under the learner. One try per
  item; star items are asked "as on the paper" (four numbered tiles, the answer is the tile for ★).
- **Time estimate:** `'about ' + Math.max(1, Math.round(due.length * 0.6)) + ' min'` (0.6 min per item).
- **Sound by unit:** `C.view()` also asks for the sound file of every unit a notebook mistake comes from
  (`C.needSound(LEVEL, unitOfId(m.src))`), though Review itself never plays a clip (see §7 pitfalls).

---

## 3. Mock exam: structure and timing (exact)

**Mini mock (all levels, `MockRun.dc.html`).** 12 questions, "約15分" (about 15 minutes), the two N2 test sections in the
real order:

| | Section 1 `言語知識（文字・語彙・文法）・読解` | Break | Section 2 `聴解` |
|---|---|---|---|
| Questions | 9 (N2: 漢字読み, 表記, 語形成, 文脈規定, 用法, 文の文法1, 文の文法2, 内容理解（短文）, 統合理解) | | 3 (課題理解, 概要理解, 即時応答; N5: 課題理解, ポイント理解, 即時応答) |
| Clock | ONE section clock: N2 `total: 600` s (10:00); other levels `60 * paper.length` s | `bt: 60` s, counts down, does not auto-start | none: "paced by the audio" |
| Navigation | free: Previous/Next, answer sheet jumps, flags; tap a filled oval again to clear it | can start early | forward only; "The audio plays once. You cannot go back to a question." |
| End | Submit (sheet) or auto-submit at 0:00 (`timeUp`) | "つぎの科目へ　Start section 2" | after the last part of the last question |

**Listening parts and timing** (`PARTS`; with sound a spoken part lasts `ykSound.ms(clip) + 400` ms (clip + a breath),
a silent part `wait`; without sound every part takes its `sim` stand-in):

```js
10: [{ k: 'q', ja: '質問', en: 'the question', clip: 'm10_q', sim: 2000 }, { k: 'talk', ja: '話', en: 'the conversation', clip: 'm10_talk', sim: 4200 },
     { k: 'q2', ja: '質問', en: 'the question again', clip: 'm10_q2', sim: 1600 }, { k: 'ans', ja: '解答', en: 'answer time', wait: 8000, sim: 6000 }],
11: [{ k: 'talk', ja: '話', en: 'the talk', clip: 'm11_talk', sim: 4200 }, { k: 'choices', ja: '質問・選択肢', en: 'the question and the four choices', clip: 'm11_q', sim: 4000 },
     { k: 'ans', ja: '解答', en: 'answer time', wait: 8000, sim: 6000 }],
12: [{ k: 'line', ja: '文', en: 'the line', clip: 'm12_line', sim: 1600 }, { k: 'replies', ja: '返事 1・2・3', en: 'the three replies', clip: 'm12_replies', sim: 3400 },
     { k: 'ans', ja: '解答', en: 'answer time', wait: 6000, sim: 5000 }],
```

Clip lengths (N2, `sound-mock.js`): `m_check` 3,540 ms (sound check), `m10_q` 14,080, `m10_talk` 34,080, `m10_q2`
5,050, `m11_talk` 33,990, `m11_q` 23,000, `m12_line` 9,260, `m12_replies` 12,180. So the N2 listening section runs
about 2:35 with sound. Other levels' parts come from `content/<lv>/mini.json` (`parts: [{k, ja, en, sim, lines |
wait}]`, clips named `<lv>mock<n>_<k>`, e.g. `n5mock10_q`).

**Who answers when in listening:** choices can be picked (and changed) at any moment while the question is on screen,
also during the audio; the question then moves on by itself. 課題理解 prints its choices; 概要理解 and 即時応答 print
nothing (big number buttons only).

**Interruptions** (listening only; the section 1 clock and the break follow real time and keep running when the app
is put aside): the section pauses and shows a sheet when the page is hidden, when the timer was frozen for more than 3 s,
when the clip stopped after it had started, or when a cued clip has not started after 3 s (where sound has worked
before on this page) or 5 s (where it was already heard in this run). Where sound has never worked (a viewer that blocks
audio), the run switches to timing alone after 1.2 s, at the same point of the part, and says so (`音声は再生されません
No sound here`). "Continue" restarts a spoken part **2 s before** the furthest point heard (`Math.max(0, Math.min(pt,
ms) - 2000)`) "so the sentence is whole"; the answer time goes on from where it stood. "Continue without sound" holds for
that run only.

**Result.** Score = right answers / 12; section rows show ○/✕ per question, `"8:32 of 10:00"` for section 1 and
`"paced by the audio"` for listening. Saved: `save({ mock: { a, used, done: true, score } })` (`a` = answers by question
number, `used` = seconds used per section). The Mock tab then shows the last result; "Again" sets `mock.again = true` so
MockRun opens at the briefing and the old result stays on the card until a new run is handed in; leaving the second run
early sets `again: false` back. Quitting a run saves nothing ("Nothing from this run is saved, and the clock keeps
running while you decide").

**Full mock (N2 only, shown locked on the Mock tab, a static result board MockFull):** `言語知識（文字・語彙・文法）・
読解` 105 min + `聴解` 50 min, "合計 101問 · 155分", "2 h 35 min, plus a break" (a 10-minute break: "In a full mock the
break is 10 minutes."); scoring = three sections out of 60 (語彙・文法 together, 読解, 聴解), total /180, overall pass mark
90, section minimum (基準点) 19/60. "Mock 1 unlocks after week 4", "Mock 2 after week 7" (hard-coded dates and day counts).

---

## 4. Sound system

### 4.1 Where clips live and how they are named

Registry: `window.__ykClips = window.__ykClips || {}`; each clip file is a script that adds entries:
`c['l_drill'] = { ms: 12990, b: 'SUQz…' };` (MP3 as base64; main app) or, N1 (`audio/clips.js`, 1,493 entries),
`c['l.u1l1'] = { ms: 14600, u: 'audio/l.u1l1.mp3' };` and `c['l.u1l1.slow'] = { ms: 18600, u: 'audio/l.u1l1.slow.mp3' };`
(a file next to `sound.js`, fetched when first played). `ms` = clip length in milliseconds (rounded to 10 ms by the N1
maker), available before decoding.

| Key pattern (main app) | What it says | Examples (verified) |
|---|---|---|
| `s_<lv>u<U>d<D>_<wordId>` (N2: `s_u<U>d<D>_<id>`, and unprefixed sample words) | one scene word, said after a carrier phrase and cut out | `s_n5u1d1_name` 840 ms, `s_u3d1_closed` 910, `s_resid` 1150 |
| `x_<lv>u<UU>d<D>_p<point>_<example>` (N2: `x_u03d1_p1_1`) | a teach-page example sentence | `x_n5u01d1_p1_1` 1980 ms |
| `l_<lv>u<U>d<D>` (N2: `l_u3d1`) | a day's listening lesson: all its lines in one clip | `l_n5u1d1` 15,970 ms |
| `<lv>mock<n>_<part>` (N2: `m<n>_<part>`) | a mini mock listening part | `n5mock10_q`, `n5mock12_replies`, `m11_talk` |
| `m_check` | the sound check | 3,540 ms |
| `l_drill`, `l_drill_slow` | the Readiness sample drill and its slow take | 12,990 / 16,437 ms |
| `t_ex1`, `t_ex2`, `r_item` | sample teach examples; a review item clip (`r_item` is never played by any screen) | |

N1 app (dotted, named by what they say, `yaoki-n1/SCREENS.md` "Sound"): `g.<lesson>.<pattern 0-2>.<example 0-1>`,
`w.<lesson>.<word 0-19>` (word + its example sentence), `l.<lesson>` (line + three numbered replies), `l.<lesson>.slow`
(the same at 0.8×), `l.<lesson>.<part>` (parts of a longer item: `q`, `talk`, `q2`, `choices`), `m<mock>.<n>.<part>`.

Files: main app N2 clips load with the page (`sound-course.js`, `sound-lessons.js`, `sound-mock.js`); N5–N3 have one file
per unit, `sound-course-n5-u03.js`, and unit 0 holds the level's mini mock (`sound-course-n5-u00.js`). Counts in the
unit files: 1,440 scene words, 600 teach examples, 90 listening lessons.

### 4.2 `sound.js` API (`window.ykSound`), all of it

| Call | Does |
|---|---|
| `has(key)` | a clip under this name and a way to play it (`AC && clips[key] && (!failed || stale)`) |
| `ms(key)` | the clip's length in ms (0 if none), known before decoding |
| `unlock()` | call inside a tap: replaces a stale output, makes/resumes the AudioContext; returns whether there is one |
| `play(key, from)` | stops whatever plays, then decodes (cached per key) and starts the clip `from` ms in; returns `true` if it is trying, `false` if it cannot. Async: a decode that finishes for an older request is ignored (`turn` counter) |
| `on()` | is sound really coming out? true once the output is `running` AND its clock has advanced; false again if the clock stood still for 700 ms (an iPhone can report "running" and play nothing; the output is then marked stale) |
| `worked()` | has sound ever come out since the page opened (then a silence now is an interruption, not a mute device) |
| `at()` | ms into the current clip by the audio clock (stands still when nothing is heard); -1 before it starts |
| `over()` | ms since the current clip ended by itself; -1 while playing or when stopped |
| `ready(keys)` | decode ahead so the first clip starts on the beat |
| `halt()` / `stop()` | stop the current source / stop and invalidate pending starts |
| `retire()` | the screen gave up on this output: the next tap makes a new one |

Internals worth copying: `context()` resumes on any state but `running`/`closed` (iPhones report `interrupted` after a
call or time in the background); decoding failure marks the output `failed` (no more offers until a new output); on
`visibilitychange` → hidden: `api.stop(); drop()` (close the context so nothing plays to nobody and the phone's other
audio resumes). Every screen works without it: "when a clip or the browser's audio is missing, play() returns false and
the screen falls back to its silent waveform."

### 4.3 How a screen plays a clip (three patterns)

**a) A short word (Scene's play button):**
```js
play: () => {
  clearTimeout(this.timer);
  const snd = window.ykSound;
  const key = cur.clip;
  const sound = !!(key && snd && snd.has(key) && snd.unlock() && snd.play(key));
  this.setState({ playing: true });
  this.timer = setTimeout(() => this.setState({ playing: false }), sound ? snd.ms(key) + 150 : 1200);
},
```
The button is lit (`#F2B43A`, else `#E8ECFB`) while the clip plays, or for 1.2 s when there is no sound. `hush()`
(`clearTimeout` + `ykSound.stop()`) runs on every step change and word tap, and in `componentWillUnmount`.

**b) A listening drill (Listening's `play(rate)`):** inside the tap, `sound = snd.has(key) && snd.unlock() &&
snd.play(key)` with `key = rate === 1 ? it.clip : it.slowClip || it.clip`; then an 80 ms interval:
- without sound, the waveform fills over a stand-in time `2600 / rate` ms;
- with sound, progress = `snd.at() / snd.ms(key)`; `heard` turns true once `on()` and `at() > 0`;
- the sound stopped after it started (`heard && (!on || at < 0)`) → done, stop (it can be played again);
- it never started: give up after 1.2 s, or 4 s where sound has worked before (`snd.worked()`), and continue silently;
- `snd.over() >= 0` → done. Done sets `{ playing: false, played: true, progress: 1 }`, which unlocks the answers.

**c) A paced exam section (MockRun):** `begin()` (the tap that starts the run) calls `snd.unlock()` and
`snd.ready(MOCK_CLIPS)` so listening clips decode while section 1 is answered; `startListening()` (also a tap) unlocks,
cues part 0 and readies all clips; a 100 ms tick follows `heardMs()` (`snd.at()`) for spoken parts and the wall clock
for silent ones, moves part → part → question, and pauses as described in §3. The sound check (`playCheck`) plays
`m_check`, fills 14 bars over the clip length, and afterwards asks `snd.on()`: if no sound came out it says "No sound in
this viewer, so the listening section will run on timing alone." instead of asking "聞こえましたか。".

### 4.4 Slow takes

A slow take is a **separate clip synthesized slower**, not `playbackRate`: `make-sound.py` makes `l.<id>.slow` with
`clip(parts, 0.8)`: Kokoro `speed = 0.8` and every silence divided by the speed (`silence(p / speed)`), so pauses stretch
too. Main app: only `l_drill_slow` (ratio 12,990 / 16,437 = 0.79); the day lessons have no `slowClip`, so their
ゆっくり button is hidden (`hasSlow: !!it.slowClip`). N1: every quick-response item has `l.<id>.slow`, and the N1
stand-in for a missing slow clip is 1.25× the normal stand-in (150 ms per character + 600 ms + 1000 ms per reply).

### 4.5 Preloading and loading by unit

- `snd.ready(keys)` before the clips are needed (MockRun: at Start, at listening start, at resume, at the sound check).
- Main app per-unit files: `C.needSound(lv, unit)` adds `<script async src="sound-course-<lv>-u<NN>.js">` once per file
  (resolved next to `course.js`); `C.view()` asks for the current unit, unit 0 (the mini mock), and every unit a notebook
  mistake comes from. Until the file has loaded, `has(key)` is false and screens use their stand-in.
- N1: `sound.js` fetches `clip.u` on first play (`fetch(here + clip.u)`, `here` = the folder of `sound.js`); a fetch that
  fails offline is "not the output's fault" (the decode cache entry is dropped, `failed` is not set).

### 4.6 Offline (`yaoki-app/src/sw.js`, README "Offline sound")

- Install stores every app file under a versioned cache name (`'yaoki:' + HOME + ':' + VERSION`).
- Sound is `LAZY`: `lazyKey(f) = f + '?h=' + LAZY[f]` (content hash). On fetch, a lazy file is served from the cache,
  else copied from an earlier build's cache if its hash matches, else fetched (`cache: 'reload'`) and stored.
- Background: the app posts `{ keepLevel: 'n5' }` once a level is chosen (main app, regex `/^n[345]$/`; N2's sound is in
  the install) or `{ keepLevel: 'n1' }` once there is a plan (N1); the worker stores all of that level's lazy files, one
  by one, ignoring failures ("offline: try again next time").
- Main app: one file per unit; N1: 1,493 MP3 files (~52 MB, "eight times the rest of the app"), so the first opening
  stores about 6 MB "and cannot fail on one of 1,493 files".

### 4.7 How the clips are made (`tools/course_clips.py`, `tools/pack_course_sound.py`, `yaoki-n1/make-sound.py`, `tools/remake_clips.py`)

- Model: Kokoro-82M (`KPipeline(lang_code='j', repo_id='hexgrad/Kokoro-82M')`, `kokoro` 0.9.4, `misaki[ja]`, UniDic,
  Python 3.10–3.12, ffmpeg). Voices: narrator `jf_gongitsune`, man `jm_kumo` (both built from Koniwa recordings, CC BY
  3.0), woman `jf_alpha` (N1). Speaker codes in content: `N` narrator, `M` man, `F` woman; in N1 scripts `男`/`女`.
- Text handling: a respelling table `SAY` (written form → what the voice is given; the screen keeps the written form);
  text cut at `。？！` into sentences and at `、` into pieces, the model's own pause marks put back (`PAUSE = {'、': ',',
  '。': '.', '？': '?', '！': '!'}`), because Kokoro's Japanese front end drops 、 and 。.
- Audio shaping: each sentence's model silence trimmed (threshold 0.01; keep 30 ms before, 80 ms after); a clip = 0.1 s
  silence + parts + 0.2 s silence; 0.5 s between conversation lines; 0.8 s after a narrator's intro; **1.0 s before each
  numbered choice, and the number said with its choice as one sentence** (`NUM = ['いち、', 'に、', 'さん、', 'よん、']`:
  "said alone, いち comes out unclear"); in a quick-response item the replies are said by the other speaker.
- Encoding: MP3, 24 kHz, mono, 32 kbit/s (`libmp3lame -b:a 32k`); `ms = round(len / SR * 100) * 10`.
- Incremental: N1 keeps `audio/clips.json` with a 12-hex SHA-1 signature of `[parts, speed]` per clip; only changed
  clips are remade; files no longer named are deleted; `audio/clips.js` is regenerated.
- Main app QA (`course_clips.py`, using a `build.py` that is not in the repo): each clip is transcribed by two speech
  recognisers and stored in a manifest (`text`, `heard1`, `heard2`, e.g. `tts-clips/u03-manifest.json`) for a reviewer
  to compare; scene words are said after a carrier phrase that is then cut off (falls back to the word alone when the cut
  fails). `pack_course_sound.py` packs only the clips the course still names, one JS file per unit (N2: one file), and
  lists named-but-missing clips.
- Licence line shipped: "The spoken clips are synthetic placeholders made with Kokoro-82M (Apache-2.0)."

---

## 5. The writing pad (`Write.dc.html` + `yk-write.js` + `strokes.js`)

### 5.1 `yk-write.js` (`window.ykWrite`)

API: `has(c)`, `paths(c)` (SVG path data per stroke, 109×109 box), `count(c)`, `pad(el, opts)` → controller, `draw(el, c,
size)` (the kanji written out into an empty element), `strip(el, c, size)` (one small picture per stroke, the strokes
before in ink and the new one in red), `match(points, c, i, o)` → `{ ok, backwards }`, `tap(point, c, i)`, `points(c, i)`,
`BOX = 109`. Data: `window.__ykStrokes = { "一": "M11,54.2c…", … }` (strokes joined by `|`; KanjiVG r20240807, CC
BY-SA 3.0, made by `tools/make-strokes.py`).

Pad `opts`: `char`; `mode` `'trace'` (all strokes grey `#D3D8E5`, the next one darker `#9EA9C8`, a red dot r 2.5 at its
start) | `'faint'` (strokes `#EBEDF3`, no dot) | `'memory'` (only the grid) | `'show'` (written out, no writing); `played`
(play the stroke order before the first stroke can be written); `done` (strokes already in: a designed moment);
`leniency` (1; memory 1.15); callbacks `onStroke(i, {misses, helped})`, `onMiss(i, {misses, backwards})`,
`onDone({misses, helped})`, `onPlay(playing)`. Controller: `set(opts)` (new char/mode/restart starts afresh),
`play()`, `stopPlay()`, `hint()`, `restart()`, `destroy()`, `state()` → `{ i, n, misses, helped, playing, done }`.

Look: SVG `viewBox 0 0 109 109`, ink width `4.2`; grid two dashed centre lines (`stroke #DDE1EC`, width 0.6,
`stroke-dasharray 2.2 2.2`, from 3 to 106); a kanji with no strokes shows as Klee One 78 in `#D3D8E5` and counts as
written at once.

Judging (`fits`, thresholds "at leniency 1, in box units": `LIMIT = { avg: 16, avgFree: 30, ends: 22, endsFree: 30,
shape: 0.4, len: 0.35, lenPad: 2.7 }`): average distance to the stroke ≤ 16 (30 for the first stroke from memory, which
has nothing to place it by); both ends within 22; drawn pieces point the same way on average (cosine > 0); length ratio
`(len + 2.7) / (strokeLen + 2.7) ≥ 0.35`; shape (both normalized, compared by Fréchet distance, turned ±π/16 and ±π/32)
≤ 0.4. If it fits better reversed → `backwards`. If it runs closer to a LATER stroke it must fit this one more tightly
(leniency × `0.6 * (closest + avg) / (2 * avg)`). A touch that hardly moves counts only on a dot stroke (length < 16,
within 7 units, nearer than any later stroke). The method follows Hanzi Writer (MIT).

Help: `HINT_AFTER = 2` (the stroke is drawn in yellow `#F2B43A`, width 5.6, from a red dot r 2.8, over `520 + len*6` ms,
and stays faint until written); `HELP_AFTER = 4` (420 ms later the stroke is written in for the learner: `helped`).

Timing (all × 0.05 when `window.__ykWriteFast`): accepted stroke drawn in 180 ms (helped 420 ms) while the finger's line
fades in 260 ms; a miss turns the finger's line red and fades it in 480 ms; `onDone` 240 ms after the last stroke
(helped 460 ms); stroke order: each stroke drawn in `260 + len*8` ms with its number (6.2 px, 700, `#5A6382`, placed just
behind the start), 110 ms between strokes, 450 ms after the last; touching the pad during the stroke order stops it.

Input: Pointer Events (`pointerdown/move/up/cancel`, `getCoalescedEvents`, `setPointerCapture`), points kept ≥ 0.4 units
apart; `touchstart`/`touchmove` `preventDefault` (`passive: false`) so the page never scrolls or zooms under the finger;
a `pointercancel` stroke (a call, a system gesture) is removed and not counted. `window.__ykWriteAuto` (checks only) writes
the kanji out at once. The SVG carries `role="img"`, `aria-label` "Writing pad for 書: stroke 3 of 10" (or "書, written"),
and `data-char/mode/at/n/done` for tests.

### 5.2 `Write.dc.html`, the panel (canvas `28 · Writing pad (part of 27)`, `<title>Writing practice</title>`, 358×470)

Root: `data-yk-write="1"`, `width: 100%; max-width: 358px; margin: 0 auto; display: flex; flex-direction: column; gap:
10px`. Top to bottom:

1. **Three times** (kanji task): `role="list" aria-label="Write it three times"`, grid 3 columns gap 6; each item 34 px,
   radius 10, 12 px, a 17 px dot with the number or ✓, label `なぞる` / `うすく` / `見ないで` (Trace / Faint / From
   memory). Now: `border 2px solid #2F4FD0; bg #E8ECFB; color #1B2440; 800`, dot ring indigo; done: `border 2px solid
   #E0F3EF; bg #E0F3EF; color #0B7A6B`, dot filled teal with white ✓; to come: `border 2px solid #DDE1EC`, transparent,
   muted 700. `aria-label` "1: Trace, done" / ", now", `aria-current="step"`.
   **Word cells** (word task): `role="list"`, centered row; cells 46 px (≤ 7 characters; else 40 px), gap 6 (4), radius
   12. Given kana: `#F4F5F9`, `2px solid #DDE1EC`, Klee One 26 (22) `#5A6382`. Kanji to write: `2px dashed #C9D0E3`;
   now: `2.5px solid #2F4FD0`, `#E8ECFB`; written: `2px solid #1B2440`, shadow `0 3px 0 #1B2440`, the kanji drawn in
   38 (32) px by `ykWrite.draw`. Labels "住, written" / "writing now" / "to write" / "given".
2. **The pad** (`ref` + `data-yk-pad`): `size × size` px (Scene: 270), `border-radius: 22px; background: #FFFFFF; border:
   2px solid #1B2440; overflow: hidden; touch-action: none; user-select: none`; shadow `0 4px 0 #1B2440`, while a time
   is being celebrated `0 0 0 4px #E0F3EF, 0 4px 0 #1B2440` + `animation: yk-pop 360ms ease-out`.
3. **The line under the pad**: `aria-live="polite"`, min-height 36, 13/700, centered, colour by tone (miss `#C7361E`,
   good/finished `#0B7A6B`, else ink). Copy (exact):
   - per time: `Trace it, starting at the red dot · stroke 3 of 10` · `Again, over faint lines · stroke 7 of 10` ·
     `Now from memory · stroke 1 of 10`; word: `Write 住 from memory · stroke 1 of 7` / `Trace 票: it is new to you ·
     stroke 1 of 11`;
   - playing: `書き順 Watch the order. Touch the pad to start writing.`; show: `書き順 The stroke order.` /
     `書きました Written already. Play the stroke order to see it again.`;
   - misses: `Not quite. Try stroke 3 again.` · after 2: `Follow the yellow line for stroke 3, from the red dot.` ·
     backwards: `Stroke 3 goes the other way: start from its other end.` · helped: `Stroke 3 was written in for you. On
     to the next.`;
   - a time done: `きれい！ Neat.` (no misses, no help) / `できた！ Done.`; task done: `できた！ Written three times.` /
     `できた！ 住民票 is written.`
4. **Three buttons**, grid 3 × 44 px, radius 12, `2px solid #1B2440`, 13/800: `書き順` (play triangle; `aria-label="Play
   the stroke order"`, `aria-pressed` while playing, background `#F2B43A` then), `ヒント` (`Show the next stroke`;
   `aria-disabled` while showing, finished, celebrating or playing: border `#DDE1EC`, text `#9AA1B5`), `もう一度`
   (`Start this one again`; restarts the current time from stroke 1; after the last time, the last time again).
5. **Stroke-order strip** (`strip !== false` and strokes exist): label `書き順　Stroke order · 10 strokes` 11/800 muted;
   a horizontally scrolling row of 36 px frames (`radius 8; border 1.5px solid #DDE1EC`), gap 4, `role="img"`
   `aria-label="The stroke order of 書, 10 strokes"`. **While writing from memory it keeps its place but is hidden**
   (`visibility: hidden`, label adds ` · hidden for now`), so the layout never jumps.

Flow: a time written → celebrate 750 ms (`pause()`; 60 ms fast) → next time (or next kanji of the word); after the last,
`props.finished({ misses, helped })` once. Time 1 (`trace`) plays the stroke order first (`played: rep === 0 &&
!t.moment`); a word's new kanji is traced after its stroke order, a known one written from memory. Designed moment
alone: `書` (or `学`, `字`), time 2, `Math.floor(10 * 0.6) = 6` strokes in (verified: 書 has 10 strokes).

### 5.3 The writing queue (in Scene)

```js
/* each new kanji before the first word that has it, then the word itself when it has two kanji or more */
queue(scene, wrote, words)   // wrote = app.wrote + C.below(); words = app.wroteWords
// for each word: its kanji that have strokes; skip 々, any in `wrote`, any already queued; push { kind: 'kanji', c, part, on, mean, word }
// then, if the word has ≥ 2 kanji and is not in `words`: push { kind: 'word', w, word }
```
The part shown for a new kanji is the `parts` entry equal to it, else the part containing it (`住民` for 住), else the
kanji alone. Worked out once when the lesson opens. Verified sizes: N2 `u03d4` (fresh learner) = 11 items (3 kanji: 票
11 strokes, 再 6, 請 15; 8 words); N5 `n5u01d1` = 21 items (14 kanji, 7 words). `C.below()` length: N5 0, N4 103, N3 286,
N2 728 kanji.

---

## 6. Screen specs

Navigation idiom on every screen: `const nav = (to) => (e) => { const go = this.props.go; if (go) { e.preventDefault();
go(to); } };` on real `<a href="X.dc.html">` links (on the canvas the link moves Play to that board; in the prototype
`go()` switches screen). Props: `go`, `app` (= `C.view(state)`), `save(patch)`, `miss({src, wrong})`, `reviewed(src,
right)` (Review), and `view` / `moment` for designed moments. Inside the prototype (`props.go` set) a screen starts fresh;
alone it shows its designed moment.

### 6.1 Scene — canvas `11 · Kanji in a scene`, `<title>Kanji in a scene</title>`, in the prototype

**Purpose.** Day N's second lesson (Today's card 2, steps `学習 Learn` / `書く Write` / `本番 Exam-style`): learn 8 words
of a real-life scene (N2 u03d4: `市役所で` At the city office: 住民票, 証明書, 再発行, 番号札, 申請書, 記入例, 手数料, 本人確認),
write their new kanji, answer one exam question on them.

**Head scripts.** `support.js`, `sound.js`, `course-n2/n5/n4/n3.js`, `course.js`, `sound-course.js`,
`sound-lessons.js`, `strokes.js`, `yk-write.js`.

**Layout (top to bottom).** Root padding `50px 16px 34px`.
1. Header (44 px, gap 10): close link → Today (`aria-label="Close lesson"`); **step bar**: `role="group"`
   `aria-label="Step 1 of 3"`, grid `repeat(3, minmax(0, 1fr))` gap 6; each segment a `<button>` 44 px tall (transparent)
   holding a 10 px pill, radius 5, `#C7361E` for steps up to the current one, `#DDE1EC` after; `aria-current="step"`,
   `aria-disabled` for steps not reached, `aria-label` "The scene" / "Writing" / "The exam question" (+ ", not yet
   open"); a step already reached can be reopened by tapping its segment. Right label 12/800 `#C7361E`: `学習 LEARN` /
   `書く WRITE` / `本番 EXAM`.
2. **Step 学習 (scene)** — a scroll box (`flex-grow: 1; min-height: 0; overflow-y: auto; margin: 0 -16px; padding: 0 16px
   8px`):
   - Title (margin-top 6, gap 2): h1 26/800 lh 1.3 `市役所で` + span 15/700 muted `At the city office`; line 13/500 muted
     `Tap every sign you would have to read. 3 of 8 found.` (`intro` default `Tap every word you would have to read.`).
   - **Sign board** (`lang="ja"`): margin-top 12, padding 12, radius 20, `#1B2440`, grid 2 columns gap `12px 10px`. Each
     word a `<button aria-pressed>`: 46 px tall, padding `0 10px`, radius 10, 17/800, nowrap; not yet found
     `border: 2px dashed #6E7BA8`, found `2px solid #6E7BA8`, text white on transparent; selected: `#2A3560`, text
     `#F2B43A`, `outline: 3px solid #F2B43A`, `box-shadow: 0 0 0 5px #1B2440`. A found word that is not selected
     wears a badge: 18 px circle at `right: -7px; top: -7px`, `border: 2px solid #C7361E; background: #FFFFFF`, red
     9/800 `済`.
   - **Word card** (margin-top 12, padding `12px 14px`, radius 18, white, `2px solid #1B2440`, shadow `0 4px 0
     #1B2440`, gap 8): row (gap 12) = the word in Klee One 600 lh 1.1 at 40 px (≤ 2 characters), 34 px (3), 28 px (≥ 4);
     reading 16/800; gloss 13/500 muted; a 44 px round play button (`aria-label="Play the word"`, `2px solid #1B2440`,
     background `#E8ECFB`, `#F2B43A` while playing, `transition: background 150ms`). Below, its **parts** in a 2-column
     grid gap 8: tiles `padding: 8px 10px; radius 12; background: #F4F5F9`, the part in Klee One 26/600, its reading
     12/800, its meaning 12/500 muted (e.g. 住民 じゅうみん residents · 票 ヒョウ slip, ballot).
   - **What comes next** (margin-top 12, padding `10px 14px`, radius 16, `#FFF4D6`, pencil icon 22): 12.5/700 lh 1.45
     `Next you write: 3 new kanji, three times each, and 8 words, one kanji at a time.` (singular forms `1 new kanji,
     three times`, `1 word, one kanji at a time`; nothing to write: `You have written every kanji and word here before.
     Next, the exam question.`).
   - CTA (margin-top 10): `つぎへ　Next: write` / `つぎへ　Next: the exam question`.
3. **Step 書く (writing)**: header (margin-top 6, baseline): h1 `書く` + span `Write it three times` / `Write the word` /
   `All written`; count chip (`role="img"`, padding `2px 8px`, radius 8, `#E8ECFB`, `#2F4FD0`, 12/800) `1 / 11` or `済`
   (`aria-label` "Writing 1 of 11" / "All written"). Info card (margin-top 8, padding `10px 12px`, radius 16, white,
   `2px solid #DDE1EC`, gap 12): big glyph in Klee One (kanji 44 px; word 34/28/24 px for ≤2/3/≥4 characters); kind
   11/800 red `新しい漢字　New kanji · 11 strokes` or `ことば　The word, one kanji at a time`; reading 14/800 + meaning
   (margin-left 10, 500 muted); context 12/500 muted `in 住民票（じゅうみんひょう） residence certificate`. Then the
   panel: `<dc-import name="Write" task="{{ wTask }}" tkey="{{ wKey }}" finished="{{ wFinished }}" size="{{ wSize }}"
   hint-size="358px,480px">` (margin-top 10; `wKey` = `'k:票:0'`-style, `wSize` 270). Next button (outside the scroll,
   margin-top 10, 54 px): locked (`aria-disabled`, grey look) `書いてから　Write it three times first` / `書いてから　Write
   the word first`; open (indigo) `つぎへ　Next kanji: 再` / `つぎへ　Next: the word 住民票` / `つぎへ　Next: the exam
   question`. Nothing to write: a quiet card `ぜんぶ書きました` (18/800) + `You have already written every kanji and word
   of this scene. On to the exam question.`
4. **Step 本番 (exam question)**: h1 `本番` + span `Exam-style`; line `One question on the words of 市役所で, the way the
   exam asks it.`; card (margin-top 14, padding `12px 14px 14px`, radius 18, `#FFF4D6`, gap 8): before answering a kicker
   12/800 `試験ではこう出る　How the exam asks it · 語形成`; after answering a verdict line (14 px ○ teal / ✕ red,
   `role="img" aria-label="Correct"|"Wrong"`) `せいかい！ 1 再` or `おしい！ 正解は 1 再。 Saved to your notebook.` +
   explanation 12/500; the question in Klee One 17/600 (`C.plain(q)`: markup removed); options grid (gap 6; one row
   when every option is ≤ 3 characters, 2 columns ≤ 9, else 1), buttons 44 px radius 12 `2px solid #1B2440` white 15/800
   `1 再`. After answering: a verdict-coloured `つぎへ　Next` link.

**States.** step ∈ scene | write | check; `reached` (furthest step); scene: `found[]`, `sel`, `playing`; write: `queue`,
`qi`, `qDone`, `mine` (kanji written in this lesson), `mineW`; check: `quiz` (null or the 1-based pick; one try).
Opening step: `props.moment === 'write' ? 1 : p.k ? 0 : p.kw ? 2 : p.ks ? 1 : 0` (a finished lesson reopens at the
scene; a lesson part-way through opens where it was left).

**Reads / writes.** Reads `app.day.scene` (`ja, en, intro, words[{id, word, reading, gloss, parts[[part, reading,
meaning]], clip}], check`), `app.prog`, `app.wrote`, `app.wroteWords`, `C.below()`, `ykWrite`. Writes: leaving the scene
`save({ prog: { ks: 1 } })` (or `{ ks: 1, kw: 1 }` when nothing is to be written, going straight to the question); each
kanji finished `save({ wrote: c })`; each word `save({ wroteWords: [w] })` (both additive, kept for all levels); the
last Next of writing `save({ prog: { kw: 1 } })`; a wrong pick `miss({ src: check.id, wrong: option })`; the final Next
`save({ prog: { k: 1 } })` → Today. Note: the learner may leave the scene step without finding every word (the count is
informative only).

**Designed moment.** Alone: N2 u03d4, the first three words found, the third (再発行) selected; in the prototype only the
first word is open and found.

**Clever.** The writing queue places a new kanji right before the first word that has it; nothing written before (any
level) is asked again; the Next button names what comes next; the lesson part-way reopens where it was left.

### 6.2 SceneWrite — canvas `27 · Kanji lesson: writing`, `<title>Kanji lesson: writing</title>` (canvas only)

The same component at its writing step: `<dc-import name="Scene" moment="write" hint-size="390px,844px">` inside a
390×844 frame. `moment: 'write'` opens step 2 and marks the first queue item `moment: true`, so the pad shows time 2
(faint) with ~60% of the strokes already in (`Math.floor(n * 0.6)`; for 票, 6 of 11). Same head scripts as Scene.

### 6.3 Write — canvas `28 · Writing pad (part of 27)` — see §5.2.

### 6.4 Reading — canvas `12 · Reading skill`, `<title>Reading skill</title>`, in the prototype

**Purpose.** Day N's third lesson on reading days: one exam-type reading item with a strategy, done against a soft time
limit, then explained (the "skill" of the day: `筆者の考え` The writer's view, `内容理解（短文）`, `情報検索` …).

**Layout.** Root padding `50px 16px 34px`.
1. Header (44 px, gap 10): close → Today (`aria-label="Close lesson"`); a 12 px bar whose fill is **hard-coded at 25%**
   (`role="img" aria-label="Reading skill: 筆者の考え"`); a clock chip 32 px, radius 16, white, `2px solid #DDE1EC`,
   13/800, stopwatch icon 15 (`#2F4FD0`): `0:48` + span 11/700 muted `/ 1:30`.
2. Chip row (margin-top 6, gap 8): chip `読解スキル · 筆者の考え` (padding `4px 10px`, radius 10, `#E8ECFB`, `#2F4FD0`,
   12/800) + the ask 12/700 muted (`Where is the writer's own view?`).
3. Scroll box (`flex: 1 1 auto; min-height: 120px; overflow-y: auto`):
   - Passage card (`lang="ja"`, margin-top 10, padding `12px 16px`, radius 20, white, `2px solid #1B2440`, Klee One
     16/600, lh 1.7, `white-space: pre-line`): segments from `C.rich(passage, { clue: checked ? 'mark' : null })`; ruby
     kept (`rt` 9 px); a clue segment gets `background: #FFE9B0; padding: 0 3px; border-radius: 4px; transition:
     background 300ms` once checked (u03d4: `しかし` and `のではないだろうか` light up).
   - Question `<h1>` 17/800 (margin-top 14).
   - Options (margin-top 10, column gap 9): 46 px buttons, radius 14, padding `0 14px`, 15 px, the number 12/800; looks
     per §1. **After checking only the right answer and the wrong pick stay**, with ○ (`aria-label="Correct answer"`) or
     ✕ (`"Your answer, wrong"`), to make room for the explanation.
   - Before checking: a tip box (margin-top 16, padding `10px 14px`, radius 16, `#FFF4D6`): `コツ　STRATEGY · drill
     only` 11/800 + the strategy 13/500.
4. Before checking: `こたえる　Check` (54 px; `disabled` until an option is picked; the pick can be changed freely).
5. After checking: the verdict sheet (§1) with `margin: 0 -16px -34px; padding: 16px 16px 34px; max-height: 520px`:
   wrong adds `正解　2` (13/800) at the right; the box `解説　Why` + explanation + (wrong) a ✕ line with the reason for
   the picked option (`why[pick]`); (wrong) `Saved to your mistake notebook. It comes back tomorrow.` with the notebook
   icon; `つぎへ　Next` (teal/red) → Today.

**States.** asking (no pick) → asking (picked) → checked right | checked wrong. Clock `t` counts up from 0 by real time
(200 ms interval; follows a clock set back; stands still while the answer is up; caps at 9:59); **the limit
(`skill.seconds`, 90) is advisory: nothing changes when it passes.**

**Reads / writes.** `app.day.skill` (`kind: 'reading', ja, en, ask, seconds, passage, strategy, item{id, q, options,
short, answer, explain, why[]}`). Check with a wrong pick → `miss({ src: item.id, wrong: short })`; Next → `save({ prog:
{ r: 1 } })` → Today.

**Designed moment.** Alone: option 2 picked at 0:48, not yet checked (the right answer is 2).

### 6.5 Listening — canvas `13 · Listening`, `<title>Listening</title>`, in the prototype

**Purpose.** Day N's third lesson on listening days (`即時応答` Quick response, `発話表現` Expressions, `ポイント理解`,
`課題理解`), and the sample drill reached from Readiness (`SAMPLE`: a 即時応答 item, clip `l_drill`, slow `l_drill_slow`).

**Layout.** Root `padding-top: 50px`.
1. Header (44 px, padding `0 16px`): close (`aria-label="Close drill"`) → Today (day) or Readiness (sample); spacer;
   badge 12/800 indigo `練習 DRILL`.
2. Scroll box (`flex: 1 1 auto; min-height: 120px; overflow-y: auto; padding-bottom: 12px`):
   - Title block (padding `6px 16px 0`, gap 2): kicker 12/800 muted `聴解 · 即時応答　Quick response`; h1 20/800 lh 1.35
     the ask (`いちばんいい返事は？`); note 13/500 muted: `Nothing is printed until you answer, just like the exam.` /
     `The choices are printed, as on the paper.` / for 発話表現 `The picture: <situation>` ("発話表現 shows a picture on
     the paper; here a line describes it").
   - Player card (margin `12px 16px 0`, padding 14, radius 20, white, `2px solid #1B2440`, gap 12): a 60 px round play
     button (`aria-label="Play audio"`, `2px solid #1B2440`, shadow `0 4px 0 #1B2440`, background `#2F4FD0` with a white
     triangle, `#F2B43A` with an ink triangle while playing); a 40 px waveform of 22 bars, 4 px wide, radius 2, heights
     `[10, 20, 30, 16, 34, 24, 12, 28, 38, 22, 14, 26, 32, 18, 10, 24, 30, 20, 12, 26, 16, 8]`, filled `#2F4FD0` up to the
     progress else `#C9D0E3` (`aria-hidden`). Row below: `もう一度 Replay` (44 px, radius 12, `2px solid #1B2440`, white,
     13/800), `ゆっくり 0.8×` (only with a slow clip), right `drill only` 11/700 muted.
   - Answers (margin `12px 16px 0`, grid gap 10; one column when printed, else one column per choice): buttons min-height
     58, radius 16, padding `6px 12px`; not printed: the number only, 22 px, centered; printed: number + text 15 px.
     Before playing: `disabled`, `border 2px solid #DDE1EC`, muted 700; after playing: `2px solid #1B2440`, shadow `0 3px 0
     #1B2440`, 800; answered: right teal, wrong pick red, with 20 px ○/✕ marks. One try.
   - Before playing: `まず聞いてください　Listen first, then choose 1, 2 or 3.` (12/700 muted, centered).
3. After answering, the sheet (flex-shrink 0, `max-height: 540px`, padding `16px 16px 34px`, §1): verdict row; right: a
   gold badge `3問連続正解` ("3 in a row", **hard-coded**, `#F2B43A`, `2px solid #1B2440`, radius 10, 12/800); wrong: a
   white badge with the notebook icon `ノートに保存`. White box: `スクリプト　Script` + the script lines (Klee One 16/600, lh
   1.9; for 即時応答 only the line), then for each reply a row: ○/✕ 16 px, **`1 そんなにつまらなかった？`** (800) + a
   `your pick` chip on the wrong pick (`#FDEBE6`, 11/800, radius 6) + the reason 13/500. With printed choices the reasons
   come first and the long script after (CSS `order`). `つぎへ　Next` → Today (day; `save({ prog: { r: 1 } })`) or
   Readiness (sample).

**States.** not played (answers locked) → playing (button gold, waveform filling) → played (answers open) → answered
right | wrong (sheet). Replay and slow take allowed at any time; the answer cannot be changed.

**Reads / writes.** `app.day.skill` when `kind === 'listening'` (`item{id, type, q, script[], options, short, printed,
answer, why[], clip, slowClip?}`, `situation`), else `SAMPLE`. Wrong pick → `miss({ src: it.id, wrong: SHORT[n] })`.

**Designed moment.** Alone: the sample drill played, answered 1 (right), sheet open with script and reasons.

**Sound.** §4.3 b (stand-in `2600 / rate` ms when there is no sound).

### 6.6 WeekTest — canvas `14 · Week test`, `<title>Week test result</title>`, in the prototype

**Purpose.** Day 7 of each week: the intro to the week test (24 questions in exam formats, one 20-minute clock) and,
afterwards, its result. The test itself runs on `Exam.dc.html` with `set: 'test'` (Y2 §5.5): `seconds: 1200`, band
`週テスト　WEEK TEST`, note `Exam format, one clock for the whole test. Answers come at the end.`, no readings or
highlights, star items asked as on the paper; on finish every wrong or blank item goes to the notebook; its result Next
saves `{ result: { id: sid, score, of, used, areas, at } }` (`areas` = right/of per `C.area(type).key`) and goes back to
WeekTest. All 31 written week tests (N5 8, N4 10, N3 12, N2 1) have exactly 24 items and **none is a listening item**
(verified; N5 u01: 漢字読み 2, 表記 2, 文脈規定 2, 言い換え類義 2, 文の文法1 7, 文の文法2 3, 内容理解（短文） 4, 情報検索 2), so the
listening bar appears only in the designed moment (Exam has no audio).

**Layout.** Root padding `50px 16px 34px`. Header (44 px): close (`aria-label="Close"`) → Main (`save({ cur: null })`);
centered title 15/800 `第3週 · 週テスト`; 34 px spacer.
- **Intro** (no result yet, test written): kicker 12/800 red `週テスト　WEEK TEST`; h1 26/800 lh 1.3 `原因・理由　Cause and
  reason` (unit ja + U+3000 + en); 13/500 muted lh 1.5 `24 questions in the exam's own formats, on one 20-minute clock. No
  hints and no furigana; answers and reasons at the end. Every mistake goes into your notebook.`; card (margin-top 14,
  padding `14px 16px`, radius 20, white, `2px solid #1B2440`, gap 8) `分野別　By area` (14/800) + one row per area present:
  `文法 Grammar` (13/700 + 500 muted) … `10問` (14/800); spacer; dark CTA `はじめる　Start the test` →
  Exam (`save({ cur: sid, set: 'test' })`).
- **Not written:** a quiet card `準備中　This week test is not written yet.`
- **Result:** row (margin-top 6, gap 12): `正解数　Correct answers` 12/700 muted; score `<h1>` 56/800 lh 1.05 + `/ 24`
  20/700 muted; `18:40 of 20:00 · no hints` 12/500 muted. Right: the **teacher's stamp**, 124 px circle, `border: 4px
  solid #E2452B; padding: 5px; transform: rotate(-9deg); animation: yk-stamp 550ms ease-out 150ms both`, an inner circle
  `2px solid #E2452B`, red `#C7361E` 800 lh 1.35: ≥ 80% `たいへん / よく / できました` (15 px), ≥ 60% `よく / できました` (17 px),
  else `がんばり / ましょう` (17 px); `role="img"` `aria-label` "Stamp: excellent" / "Stamp: well done" / "Stamp: keep at
  it". Strip (margin-top 14, padding `10px 14px`, radius 16, `#FDEBE6`): a 30 px tilted `済` circle + `スタンプカード完成
  Week 3: 7 of 7` (13/800; **hard-coded "7 of 7"**). By-area card (margin-top 12, gap 11): each area a `role="img"` row
  (`aria-label` "Grammar: 5 of 8"): label + `5 / 8` (14/800), an 8 px bar (`#D9E0F8` track, `#2F4FD0` fill, radius `0 4px
  4px 0`), and below 50% a chip (`padding: 4px 10px; radius 10; #FFF4D6`, 12/800, gold star icon) `苦手　Weak spot`.
  Mistakes line (quiet card, notebook icon 24): `6 mistakes went into your notebook, each with its explanation.` (`1
  mistake went …`). Spacer; `間違いを見る　Review mistakes` → Notebook; text link (44 px, 15/800 ink) `第4週へ　On to week
  4` (or `もどる　Back` after the last unit) → Main (`save({ cur: null })`).

**Reads / writes.** `app.unit` (`n, ja, en, test[]`), `app.tests[sid]`; writes `cur` and `set` as above.

**Designed moment.** Alone: N2 unit 3, result 18 of 24 in 18:40 (`used: 1120`), areas vocab 7/8, grammar 5/8, reading
3/4, listening 3/4 → 75% → `よく できました`, no weak spot, 6 mistakes.

### 6.7 Notebook — canvas `15 · Mistake notebook`, `<title>Mistake notebook</title>`, in the prototype (a tab)

**Purpose.** The second tab: what is due today, the spacing rule, and every open mistake with what was chosen and the
right answer.

**Layout.** Root `padding-top: 50px`.
1. Header (44 px, padding `0 16px`): h1 22/800 `間違いノート` + span 14/700 muted `Mistake notebook`.
2. **Due card** (when due > 0): margin `8px 16px 0`, padding `14px 16px 16px`, radius 20, white, `2px solid #1B2440`,
   shadow `0 4px 0 #1B2440`, gap 10: `今日の復習　Due today` 12/700 muted; count 44/800 lh 1.1 + `items · about 1 min`
   (14/700 muted); right column 12/700 the areas due (`文字・語彙 1`, `聴解 1`); CTA link 50 px radius 14 indigo shadow
   `0 3px 0 #1B2440` 16/800 `復習する　Review now` → Review.
   **Caught-up card** (due = 0): same shell, `0` + `items · all caught up` (or `items · nothing in the notebook yet`),
   then 13/800 `おつかれさま！` (or `まだありません`) + 500 muted `Next review: tomorrow` / `in N days` / `Mistakes appear
   here with their explanations.`; a 56 px `済` stamp (`3px solid #E2452B`, red 24/800, `yk-stamp 500ms`, `aria-hidden`).
3. Explainer (margin `14px 16px 0`, gap 6): 12/500 muted `A mistake leaves the notebook after three correct answers in a
   row, each a little further apart.`; a 4-column strip (gap 6, 11/800 centered, cells padding `7px 0`, radius 10,
   `#E8ECFB`; the last `#E0F3EF`): `あした<br>1 day` · `3日後<br>3 days` · `1週間後<br>7 days` · `卒業<br>cleared`.
4. List head (margin `14px 16px 0`, 14/800): `ノート　In the notebook · 3`.
5. List (scroll, padding `0 16px 12px`, gap 8), newest first. Row card (padding `10px 14px`, radius 16, white, `2px solid
   #DDE1EC`, gap 5): top row: area tag (padding `2px 8px`, radius 8, 11/800, area colours, the item type text e.g.
   `漢字読み`), due label 11/700 muted (`due today` / `back tomorrow` / `in N days`), three 10 px pips (`role="img"`
   `aria-label="1 of 3 correct in a row"`; done = filled teal, else `2px solid #C9D0E3` ring); the question quoted in
   Klee One 15/600 (one line, ~21 characters + `…`; underlined words keep a 2 px underline; star items as `…<last 8
   chars> ＿ ＿ ★ ＿ <first 10 chars>`); answer line 13/800: ✕ (red, `aria-label="You answered"`) + what was chosen
   (muted) → arrow → ○ (teal, `aria-label="Correct answer"`) + the right answer (`short` or option).
   Then, if any were cleared in the last 24 h: a teal box (`#E0F3EF`, radius 16) with a `卒業` chip (`#0B7A6B` white
   11/800) + `Cleared today: 1 item left the notebook.`
6. Tab bar (Y1 §5.0): Path → Main, Notebook (`aria-current="page"`), Mock exam → Mock, Readiness → Readiness
   (`aria-disabled`, `#B9BFD0`, no navigation for levels other than N2).

**Reads.** `app.mistakes`, `app.level`; pure render (no state). **Designed moment** (verified): three mistakes: today's
drill item `u03d4.d1` (文の文法1, chose `あまり`, back tomorrow, 0 pips), `mock1` (漢字読み, chose `やしなって`, step 1,
due today), `mock12` (即時応答, chose `遅れないように気をつけます`, step 2, due today) → `2 items · about 1 min`, `文字・語彙
1`, `聴解 1`, `In the notebook · 3`.

### 6.8 Review — canvas `16 · Notebook review`, `<title>Notebook review</title>`, in the prototype

**Purpose.** Re-ask every item due today, one by one, show where it moves on the 1/3/7/cleared track, and sum up.

**Layout.** Root padding `50px 16px 34px`.
1. Header (44 px, gap 10): close (`aria-label="Leave the review"`) → Notebook; 12 px bar (`transition: width 250ms
   ease-out`; width = items answered / total; `role="img"` `aria-label="Item 1 of 2"`); `復習 REVIEW` 12/800 indigo.
2. Session (scroll box): meta row (margin-top 6, gap 8): area tag (padding `3px 9px`, radius 8, 12/800), `1 / 2` 12/700
   muted, three 11 px pips (streak; `aria-label="1 of 3 correct in a row"`), `in a row` 11/700 muted.
   Context box when the item has a passage or script (padding `10px 14px`, radius 16, white, `2px solid #DDE1EC`):
   `スクリプト　The script (read it this time)` or `本文　The text` (11/800 muted) + the text (Klee One 14/600, lh 1.75,
   pre-line). **A listening item is reviewed by reading its script; no sound plays.**
   Question card (margin-top 10, padding `14px 16px`, radius 18, white, `2px solid #1B2440`, Klee One 600, lh 2, 20 px;
   17 px when longer than 30 characters; ruby kept, highlights off, underlines kept).
   Options (margin-top 12, grid gap `10px 8px`; one column if any option is longer than 7 characters, else 2): min-height
   54, radius 14, padding `6px 12px`, 16 px, number 12 px muted; one try (`disabled` after answering).
   Verdict box after answering (margin-top 12, padding `12px 14px`, radius 16, white, `2px solid #DDE1EC`, `yk-up 220ms`):
   22 px mark + `せいかい！ Correct` / `おしい！ Not quite` (17/800 + 13/700) + right `正解　2 おぎなって` (13/800); the reason
   13/500; `前回　Last time you chose: やしなって` 12/700 muted.
3. **The track** (`role="img"`, `aria-label` = "Review spacing: 1 day, 3 days, 7 days, cleared. " + the note): 4 cells
   (gap 6, 11/800, padding `5px 0`, radius 10, `transition: background 200ms`, default `#E8ECFB` with a transparent 2 px
   border): `あした<br>1 day` · `3日後<br>3 days` · `1週間後<br>7 days` · `卒業<br>cleared`. Before answering the cell of
   the current step is outlined (white, `2px solid #1B2440`); after answering the cell it moves to fills with the tone
   (wrong: the first cell, `あした`, in `#C7361E`; moved on: the next cell in `#2F4FD0`; cleared: `卒業` in `#0B7A6B`),
   white text. Note below (min-height 34, lh 17 px;
   12/700 muted before, 13/800 ink after): `Now at 3 days. Right: on to 7 days. Wrong: back to 1 day.` → `Back to the
   start. It returns tomorrow.` / `2 of 3 in a row. Next time: in 7 days.` / `3 of 3 in a row. 卒業！ It leaves your
   notebook.`
4. Next (margin-top 8, 54 px; `disabled` until answered, look `#EEF0F6` / `2px solid #C9D0E3`): `つぎへ　Next`, on the last
   `おわる　Finish`.
5. **Summary**: centered 96 px `済` stamp (`4px solid #E2452B`, red 40/800, `yk-stamp`), h1 26/800 `復習おわり`, 14/500
   muted `Review done. All 2 items for today.` (`Nothing is due today.` when empty); stats card (margin-top 24, padding
   `6px 16px`, radius 20, white, `2px solid #1B2440`): rows (padding `12px 0`, rule `2px solid #EEF0F6` between) of a 26/800
   number (right-aligned, width 40) + Japanese 15/800 + English 12/500 muted: `つぎのステップへ` moved one step further
   apart · `卒業` cleared: out of the notebook · `あしたもう一度` back to the start, due tomorrow; spacer (`flex-grow: 2`);
   `ノートへ　Back to the notebook` → Notebook.

**Reads / writes.** `app.mistakes` (snapshot of due); `props.reviewed(src, right)` on each pick.

**Designed moment** (verified): two items due (`mock1` step 1, `u03d4.d1` step 0); item 1 is answered with option 1 =
`やしなって`, which is WRONG (answer 2 `おぎなって`), so it shows the "back to 1 day" path, though the code comment says
"the first answered right".

### 6.9 Mock — canvas `17 · Mock exam tab`, `<title>Mock</title>`, in the prototype (a tab)

**Layout.** Root `padding-top: 50px`.
1. Header (44 px, padding `0 16px`, gap 8): h1 22/800 `模擬試験` + span 14/700 muted `Mock exam · N2`; chip 36 px, radius
   18, white, `2px solid #DDE1EC`: calendar icon 16 indigo + `あと39日` (14/800, **hard-coded**).
2. Lede (margin `8px 16px 0`, 13/500 muted lh 1.5): N2 `Two full papers at real length: one halfway through the plan, one
   about a week before the exam.`; other levels `The mini mock shows the N5 paper in miniature. Full N5 papers come
   later.`
3. **Mini mock card** (hero card, margin `12px 16px 0`, padding `14px 16px 16px`, gap 10): `ミニ模試` 20/800 + `Mini mock`
   13/700 muted; chip 28 px radius 14 `#FFF4D6` `2px solid #1B2440` 12/800 `12問 · 約15分`. Fresh: 13/500 lh 1.5 with a bold
   lead `実際の試験と同じ形式を、短時間で体験できます。` + `Both sections, the break and a result, in the real format. Open any
   time.`; CTA link 50 px radius 14 `はじめる　Start` → MockRun. Taken: a 44 px `済` circle (`3px solid #E2452B`, rotate
   −9°), `前回の結果　Last result` 12/700 muted, score 28/800 + `/ 12`; two 50 px buttons: white `結果を見る　Result` →
   MockRun (reopens the finished run at its result), indigo `もう一度　Again` → MockRun (briefing; `save({ mock: { …mock,
   again: true } })`).
4. **Full mocks** (N2 only): quiet card `第1回 模試` 20/800 + `Mock 1`; locked chip (28 px, radius 14, `#F4F5F9`, `2px solid
   #C9D0E3`, 12/800 muted, padlock 13) `10日後` (`role="img" aria-label="Locked. Opens in 10 days."`); `第4週が終わると受け
   られます` 14/800 + `Unlocks after week 4 · 11月7日（土）` 12/500 muted; a 2 px rule; the two papers: number 12/800 indigo,
   name 13/700 nowrap + English 11/500, minutes 16/800 + `分`, an 8 px bar (`#E8ECFB` / `#2F4FD0`) at 100% and 47.6%
   (105 and 50 min); `合計 101問 · 155分` 13/800 + `2 h 35 min, plus a break`. A second quiet card `第2回 模試 · Mock 2`,
   `Unlocks after week 7 · 11月28日（土）`, chip `31日後`.
5. Tab bar (Mock current).

**Reads / writes.** `app.mock`, `app.level`; writes `mock.again`. **Designed moment:** fresh (never taken).

### 6.10 MockRun — canvas `18 · Mock briefing` + the view boards 19–25, `<title>Mock run</title>`, in the prototype

One component, eight views (`data-props` `"view": {"editor": "enum", "options": ["intro", "paper", "sheet", "reading",
"break", "listening", "result", "answers"], "default": "intro"}`); the wrappers `MockPaper/MockSheet/MockReading/
MockBreak/MockListening/MockResult/MockAnswers.dc.html` are `<dc-import name="MockRun" view="…">` in a 390×844 frame
(`<title>`s: Mock paper, Mock answer sheet, Mock paper, reading, Mock break, Mock paper, listening, Mock result, Mock
answers). The root `<div>` is `position: relative` (for overlays) and has `onClick="{{ wake }}"`: a designed moment
stands still until touched, then its clock runs from there (listening: starts the audio).

**Band** (navy, `padding: 50px 16px 10px`): left control: a quit `<button aria-label="Quit the mock">` (X) while running,
a back link to Mock (`aria-label="Back to the mock exam tab"`) on intro and result, a back button to the result
(`"Back to the result"`) on answers; title 16/800 nowrap + subtitle 11/500 `#C9D0E3` (`ミニ模試` / `Mini mock · N2`;
`言語知識・読解` / `Section 1 of 2`; `休憩` / `Break`; `聴解` / `Listening · the audio plays once` (or `· no sound here,
timing only`); `ミニ模試　結果` / `Mini mock result`; `解答と解説` / `Answers and reasons`); on the paper a clock pill
(`role="timer"`, `aria-label="Time left in this section: 7:32"`, 36 px, radius 18, 18/800 tabular-nums, white with ink
text; **at ≤ 30 s `#E2452B` with white text**) and an answer-sheet button (`aria-label="Open the answer sheet"`, 44 px,
radius 12, `2px solid #5A6382`, white text 13/800, sheet icon + `3/9`).

**intro (briefing):** h1 23/800 nowrap `試験と同じ形式で、12問` + 13/500 muted `The real format, cut short: both sections in
order, one break, one result. About 15 minutes.`; the daruma (64 px, `role="img" aria-label="Yaoki, a daruma with one eye
painted"`); plan card (radius 18, padding `6px 14px`, `2px solid #1B2440`): section rows (26 px navy square with the
number, `言語知識（文字・語彙・文法）・読解` 14/800 + English 11/500, right `9問` 13/800 + `10分` 11/500; listening `3問` +
`音声が終わるまで`) with a dashed divider `休憩 1分　Break` between; rules (kicker 11/800 red `模試のルール　HOW IT RUNS`, rows
ja 13/800 width 34 + en 13/500): `時間` "Section 1 has one clock for vocabulary, grammar and reading. You divide it yourself,
and it never pauses." · `提出` "Once you submit a section, you cannot go back." · `聴解` "The audio plays once and sets the
pace." · `結果` "Mistakes go to your notebook with the reasons."; tip (`#FFF4D6`, radius 14, earphone icon) `静かな場所と
イヤホンを用意してください。 Find a quiet place and put your earphones in.`; CTA `はじめる　Start section 1`.

**paper:** header row: `問題1　漢字読み` 12/800 indigo + `3 / 9` 12/700 muted; the rubric 12/500 (the paper's instruction
in Japanese). Question by kind (a 24 px navy square holds the question number): `word` (white card
`2px solid #1B2440`, radius 18, padding `14px 16px`, Klee One 18/600 lh 1.9; underlined words `2px solid #1B2440`; a blank 40×22
with a bottom rule; ★ slot) · `usage` (the word alone, Klee One 22) · `passage` (lead + a `2px solid #C9D0E3` box, Klee
One 14/600 lh 1.7) · `pair` (A/B texts with 22 px circled tags, Klee One 13/600); passage/pair then show the ask (14/800).
Options: column (gap 10 for word items, else 7), radius 12, padding `0 12px`, min-height 50 (word) / 60 (usage) / 44,
16/15 (Klee One for usage)/14 px; each with an **answer-sheet oval** (30×22, radius 11, `2px solid #1B2440`; filled navy
with a white number when chosen); chosen = indigo pressed look; **tapping the chosen option again rubs it out**. Flag
toggle (right, 44 px, radius 12): `あとで見直す　Flag` (on: `2px solid #1B2440`, `#FFE9B0`, gold flag). Bottom grid
`1.1fr 1.6fr`: `まえへ　Previous` (white; grey on the first) and `つぎへ　Next` (indigo; on the last `解答用紙へ　Answer
sheet`, 15 px). A long question scrolls inside its own box (`data-paper-scroll`); the next question starts at its top.

**sheet (overlay):** scrim `rgba(27, 36, 64, 0.5)` with `yk-fade 160ms`, an invisible full-size button above (`aria-label=
"Close the answer sheet"`); dialog (`role="dialog" aria-modal="true" aria-label="Answer sheet"`, padding `10px 16px
34px`, `yk-up`): grabber 40×5 `#C9D0E3`; h2 18/800 `解答用紙` + span `Answer sheet`; `3 / 9 answered`; a table
(`2px solid #1B2440`, radius 14) of 46 px row buttons (`aria-label="Question 3, 語形成, answer 2"` / "not answered"): number 15/800,
four ovals (chosen: navy filled; else `2px solid #C9D0E3` muted), the type 11/700 muted, a gold flag if flagged; the
current question row `#F4F5F9`; a row jumps to its question. Notes: blanks in red `未解答が6問あります。`; `提出すると、この
科目にはもどれません。 After you submit, you cannot come back to this section.`; buttons `1fr 1.4fr`: `もどる　Back` (white)
and dark `提出する　Submit`.

**break:** time-up banner (`#FDEBE6`): `時間切れです。 Time ran out, so your answers were handed in as they were.`; daruma
72 px; `休憩の残り時間　Break left` (at 0: `時間です　Time to start`) + break clock 56/800 tabular (`role="timer"`; red at
0); `水を飲んで、目を休めましょう。 Drink some water and rest your eyes.`; next-section card (`つぎの科目　NEXT SECTION`);
before listening the **sound check** card (52 px play button `aria-label="Play the test sound"`, `音量チェック　Sound check`,
14 bars `[8, 14, 20, 12, 18, 22, 10, 16, 20, 12, 8, 18, 14, 10]`, notes `イヤホンをつけて、音量を調節してください。 Set your
volume before the audio starts.` → `Playing the test sound…` → `聞こえましたか。 If not, turn it up and play it again.` or
`音声を再生できません。 No sound in this viewer, so the listening section will run on timing alone.`); `You can start early.
In a full mock the break is 10 minutes.`; CTA `つぎの科目へ　Start section 2`.

**listening:** header row (`問題4　即時応答` + `3 / 3`) and rubric; player card (radius 18, padding `12px 14px`): number
square, 24 bars `[10, 18, 26, 14, 30, 22, 12, 28, 36, 20, 14, 26, 32, 18, 10, 24, 30, 18, 12, 22, 34, 16, 26, 12]` filled
by the share of the question's audio heard, a speaker icon (indigo while a voice plays, `#C9D0E3` otherwise); **phase
pills** (`role="img" aria-label="Now: the conversation"`, 26 px, radius 8, 11/800): current spoken part indigo/white,
current answer time gold/ink, past `#E8ECFB`/indigo, future `#F4F5F9`/muted (`質問 · 話 · 質問 · 解答`; replies/choices
pills `flex: 1.8 1 0`). Choices: printed (課題理解) as 48 px option buttons with ovals; spoken only as 64 px number buttons
(radius 16, 24/800, `aria-label="Reply 1"` / `"Choice 1"`) + `選択肢は音声だけです　The choices are spoken, not printed.`
(gist: `質問も選択肢も音声だけです　The question and the choices are spoken, not printed.`). Footer (radius 14, padding
`10px 12px`): `音声が流れています　Audio playing` (`#E8ECFB`, indigo progress) / `解答時間　Answer now` + seconds left
(`#FFE9B0`, an ink bar draining) / `音声は再生されません　No sound here`; small print `音声は一度だけです。まえの問題にはもど
れません。 The audio plays once. You cannot go back to a question.`
Pause sheet (`role="dialog" aria-label="Listening paused"`): `音声が止まりました` "The audio stopped because the app was
interrupted. When you continue, it picks up a moment before the place where it stopped." / `一時停止しました` "The section
paused because the app was interrupted. When you continue, it goes on from where it stopped." / `音声を再生できません` "The
sound would not start. If a call or another app is using it, end that first and try again. Without sound, the section runs
on timing alone."; buttons `つづける　Continue` (or `もう一度試す　Try again`), `音声なしで続ける　Continue without sound`
(no-start only), red link `中止する　Quit`. Quit sheet (`aria-label="Quit the mock?"`): `模試を中止しますか？`, "Quit the
mock? Nothing from this run is saved, and the clock keeps running while you decide.", `つづける　Continue`, `中止する　Quit`.

**result:** `正解数　Correct answers` + 52/800 score `/ 12`, daruma 64; section card (radius 18, padding `2px 14px`): per
section a navy number square, `言語知識・読解` 14/800, a row of 15 px ○/✕ marks (`role="img"` "7 of 9 correct"), right
`7 / 9` 17/800 + `8:32 of 10:00` or `paced by the audio` 11/500; note (`#E8ECFB`, radius 14) `ミニ模試は形式の練習です。 The
mini teaches the format, so your Readiness estimate stays as it is. A full mock gives three scores out of 60 and a pass
judgement.`; `3 mistakes saved to your notebook. They come back tomorrow.`; CTA `解答と解説　Answers and reasons`; link
`とじる　Close` → Mock.

**answers:** `role="tablist" aria-label="Areas"` of four 46 px tabs (radius 12; selected navy with white text; `文字・語彙` +
`4 / 5`), so each list fits one screen; rows (padding `8px 14px 9px`, radius 16, `2px solid #DDE1EC`): 15 px ○/✕
(`aria-label` "Correct"/"Wrong"), `3 · 語形成` 12/800, on a wrong row `あなたの答え：未` right-aligned (ellipsis), the ask
(passage/pair/listening), the sentence with the answer marked in place (`#FFE9B0`, e.g. `補って（おぎなって）`) or `3　参加者の
リストを直す`, the reason 12/500; listening rows add `スクリプトを見る　Show the script` (`aria-expanded`) opening the script
with speaker tags (男/女/1/2/3, 11/800 muted).

**State.** `BASE = { view: 'intro', live: false, sec: 0, i: 0, answers: {}, flags: {}, t: SECS[0].total, used: [null],
sheet: false, quit: false, paused: false, noStart: false, timeUp: false, next: 1, bt: 60, checkP: 0, checking: false,
checkMs: 2000, checkSound: true, sound: false, li: 0, ph: 0, pt: 0, tab: 0, open: null }`. Section clock and break use
deadlines (`paperEnds = Date.now() + t * 1000`), a 100 ms tick, and shift deadlines back when the phone's clock is set
back. **Double-tap guard:** `settled()` ignores taps within 350 ms of a screen change ("Answer sheet, Submit and Start
section 2 share one spot"). Levels: N2's mock is written in the file (`MOCK_N2`); other levels' are built from course
items `<lv>mock1…12` (`mockFrom(level)`), section 1 = `60 * paper.length` s.

**Designed moments (`DESIGNED`):** paper = question 3 of 9 with 1–3 answered, 2 flagged, 7:32 left; sheet = the same with
the sheet open; reading = question 9 (統合理解, the A/B pair) at 2:08; break = 0:42 left, section 1 used 8:32; listening =
question 2 of 3 at its talk, 1.9 s in; result and answers = `SAMPLE = { 1: 2, 2: 3, 3: 2, 4: 4, 5: 3, 6: 1, 7: 3, 8: 4, 9: 2,
10: 3, 11: 4, 12: 3 }` → 9 of 12, slips on 3, 5 and 11.

### 6.11 MockFull — canvas `26 · Full mock result`, `<title>Full mock result</title>` (canvas only, static)

A designed result for a full N2 mock (no props used). Navy band: back link (`aria-label="Back to the mock exam tab"`) →
Mock; `第1回 模試　結果` 16/800 + `Mock 1 result · 11月7日（土）`. Body padding `12px 16px 34px`:
- Hero card: `予想得点　Estimated total` + 46/800 total `/ 180`; chip (34 px, radius 17, `#E0F3EF`, `2px solid #0B7A6B`, ○)
  `合格圏`; a 14 px bar (`#D9E0F8`/`#2F4FD0`) with the pass mark at 50% (a 2×22 px ink tick at `top: -4px`) and labels `0`
  · `合格点 90` · `180` (11/700); `The total clears 90 and every section clears 19.`
- Sections card (quiet): `得点区分　Scoring sections` + a 2×14 ink tick + `基準点 19 / 60`; three rows (`言語知識 Vocabulary,
  grammar`, `読解 Reading`, `聴解 Listening`) with `42/60`, `39/60`, `32/60` (verified) and 8 px bars with the 19/60 tick at
  31.7%.
- `問題別　BY QUESTION TYPE` (11/800 red) + `65 / 101 correct`; a 2-column grid of groups (header rows 12/800 with a 2 px ink
  bottom rule and the tally) and type rows (12/500, lh 18 px); a type under 50% gets `#FDEBE6` and a red 800 tally
  (verified: 用法 2/5, 主張理解（長文） 1/3, 概要理解 2/5, 統合理解 1/3). Score per section = `round(right / all * 60)`,
  grammar counted with vocabulary; total 113.
- `時間切れ：言語知識・読解　2 questions left blank.` with a red stopwatch.
- Buttons: `間違い 36問　Review` (indigo) → Notebook, `合格判定へ　Readiness` (white) → Readiness.

---

## 7. Worth keeping, and not to copy

**Keep (clever, proven on phones):**
1. One component per flow with a `view`/`moment` prop: the playable screen and its designed moments are the same code.
2. Clocks on deadlines (`Date.now()` + seconds), immune to throttled timers and robust to the phone's clock going back;
   section clocks keep running in the background; listening pauses instead of playing to nobody.
3. Sound that keeps time with the audio clock (`at()`, `on()`, `over()`), a silent stand-in when sound is missing, and
   "resume 2 s before the cut".
4. iPhone audio hygiene: unlock in a tap; resume on "interrupted"; replace a dead output at the next tap; stop and close on
   hide.
5. The double-tap guard where controls of two screens share one spot.
6. Mark-sheet semantics (ovals, tap again to clear, flags, blanks warning, submit locks) and answers reviewed by area.
7. The reading clue reveal (the signposts light up after checking): the strategy is taught by the answer.
8. After checking, only the right answer and the wrong pick stay, to make room for the reason; a reason for every option.
9. The notebook's snapshot session, and the track that says before you answer where the item goes if right or wrong.
10. Scaffolding that fades (trace → faint → memory), adaptive help (yellow after 2 misses, written in after 4), a diagnosis
    of the commonest error (backwards), and hidden aids that keep their place (`visibility: hidden`).
11. Nothing asked twice (additive `wrote`/`wroteWords`, levels below known), and Next that says why it is shut.
12. Keys named by what they say; `ms` stored with the clip; remake only what changed; ASR double-check of synthetic clips.
13. Lazy, hash-keyed offline sound, requested for the chosen level only.

**Do not copy (verified in the source):**
1. Reading's progress fill is a hard-coded `width: 25%`; Listening's `3問連続正解` badge shows on every right answer;
   WeekTest's `Week N: 7 of 7` is hard-coded; Mock's `あと39日`, `10日後`, `31日後`, `11月7日（土）`, `11月28日（土）` are
   hard-coded; MockFull is a static board.
2. Review's designed moment contradicts its comment (it shows a wrong answer); MockReading's comment says "section 2".
3. Review never plays sound (it loads `sound.js` and two clip files); `r_item` is shipped but never played.
4. Main app Listening answers and Reading's Check use `disabled` (not focusable, no reason given); N1 uses
   `aria-disabled` + labels (better). Reading's clock has no `role="timer"`. Verdict sheets are not announced (no focus move,
   no `aria-live`) in Reading, Listening and Review.
5. Clip key padding is inconsistent (`s_n5u1d1_…`, `l_n5u1d1` vs `x_n5u01d1_…`).
6. Scene's exam question shows `C.plain(q)`, which drops the `_underline_` of the word asked about.
7. Scene's miss sends the raw option string (could carry markup); others send `short`/plain labels.
8. Notebook's quote cuts code units (`g.t.slice(0, room)`): it would split a combining mark (g̃) in two.
9. `C.area()` reads Japanese type names with regexes.
10. Keyframes ignore `prefers-reduced-motion`.
11. The pad is finger-only (no keyboard or VoiceOver way to write), and `yk-write.js` builds its SVG with
    `createElementNS/appendChild`, against the canvas rule "all UI is `<x-dc>` markup, never script-built".
12. N1's Listening uses `<sc-if value="{{ !x.right }}">`, an expression in a hole, which the format says fails silently.

---

## 8. Adapting to Guarani for Spanish speakers

Context: Spanish-speaking learners (likely Paraguayan), Paraguayan Guarani (avañe'ẽ), Spanish UI with Guarani accents.
Y1 §6 and Y2 §9 hold the cross-cutting decisions (levels, fonts, `lang`, engine helpers `norm/fold/chars`, item-type
taxonomy, label terms); this section covers my screens.

### 8.1 What carries over as is

- The three-step words lesson (learn the scene → write → one exam-format question), its step bar, progress `ks/kw/k`,
  the queue idea (new unit of form before the first word that has it; nothing asked twice; levels below known), "Next
  stays shut until written" with a reason on the button.
- The writing panel's contract (`task`, `tkey`, `finished`, `size`, `strip`), its three passes with fading aids, the help
  rules (yellow after 2 misses, filled in after 4), the message line under the pad, the three buttons and the strip that
  hides in memory mode without moving the layout.
- Reading: passage + one question + advisory stopwatch + strategy tip + clue reveal + verdict sheet with reasons.
- Listening: play → answers unlock; replay; slow take; nothing printed for spoken-choice types; script and reasons after
  answering; stand-in when sound is missing.
- Week test intro and result (by-area bars, weak-spot chip, mistakes line, stamp); the Exam runner (Y2).
- Notebook and Review exactly (1/3/7 days, three in a row, snapshot session, track, summary stats).
- The mock flow (briefing → paper with one clock → sheet/submit → break with sound check → listening paced by audio →
  result → answers by area), its interruption handling, double-tap guard and designed `view`s.
- The sound engine API and its iPhone handling; lazy hash-keyed offline sound; the clip-making discipline (keys named by
  what they say, `ms` in the registry, gaps, numbered choices, signatures, a check sheet per clip).
- The visual system (Y1 §5.0) and the hard-shadow tactile style.

### 8.2 What must change, and why

| Yaoki | Why it cannot carry over | Guarani version |
|---|---|---|
| Kanji written stroke by stroke (`yk-write.js`, `strokes.js`, `wrote`, `wroteWords`, `below`) | Guarani is written in the Latin alphabet: there is nothing to draw | A **spelling pad** for the letters a Spanish speaker does not have or spells differently (§8.3), with an in-app keyboard; saved `typedLetters`, `typedWords`, `belowLetters` |
| Kanji parts in the word card (`[part, on-reading, meaning]`) | no kanji | **morphemes**: `parts: [["óga", "casa"], ["-pe", "en (lugar)"]]` (root + affixes, the heart of an agglutinative language) **[revisar examples]**; plus a **syllable line with the stressed syllable** (`ó·ga·pe`), since stress and nasality decide spelling |
| Readings (furigana, `rt` 9 px) in passages and the review question | nothing needs a reading | glosses on demand: tap (or hold, as in Yaoki Reader) a word to see its Spanish meaning and morpheme split; dropped in exam conditions ("sin glosas") |
| Klee One for target text | no ẽ and no U+0303 (Y1 §6.5, verified) | Andika (400/700) for Guarani words, sentences, cells and keys; M PLUS Rounded 1c (or Nunito) for UI |
| `lang="ja"` spans, `line-break: strict` | | `<html lang="es">`, `lang="gn"` on Guarani text (chips, cells, passage, options, script); drop `line-break: strict`; `overflow-wrap: anywhere` where long agglutinated words can sit |
| JLPT item types and mondai numbers (`問題1　漢字読み`), Japanese rubrics, `C.area()` regexes | no JLPT | the course's own types in Spanish (Y2 §9.3 e: `Escritura`, `Pronunciación`, `Vocabulario · contexto`, `Gramática · forma`…, `Lectura · …`, `Escucha · …`) with an explicit `area` code; "Parte 1 · Escritura"; rubrics in Spanish (A1–A2), Guarani later **[decide]** |
| Japanese teacher stamps (`たいへん よく できました` …), `済` marks | Japanese school culture and script | praise a Paraguayan class would use, Guarani first: ≥ 80% `¡Iporãiterei!` / ¡Excelente!, ≥ 60% `¡Iporã!` / ¡Muy bien!, else `¡Ñañeha'ã jey!` / ¡A seguir practicando! **[revisar]**; done mark ✓ or `Oĩma` (Y1/Y2) |
| ○ for right | a Japanese convention | ✓ (`M5 12l5 5 9-10`, Y1) in teal; keep ✗ in red |
| U+3000 between the two languages | a full-width CJK space; Andika may not hold it | a styled gap: `<span lang="gn">Iporã</span><span style="margin-left: 8px">¡Correcto!</span>`, or `Iporã · ¡Correcto!`; Spanish alone must be enough |
| Daruma mascot (MockRun briefing, break, result) | a Japanese custom | the new mascot (Y1 open question) at 64/72 px with its own `aria-label` |
| Scaled JLPT scores (180, pass 90, 19 per section), "合格圏", two dated full mocks, `あと39日` | no such exam or date | a **prueba de nivel** (mini, the same flow) and, optionally, a longer **prueba final del nivel** with plain percentages per area and the course's own pass line (e.g. 60% per area) **[decide]**; dates only from a target date if the learner set one |
| Review of a listening item = reading the script | for Guarani the sound IS the point (nasality, puso, stress) | replay the clip in review (a play button, normal and slow), the transcript behind a toggle after answering |
| TTS clips (Kokoro), ASR double-check | no Kokoro Guarani voice; espeak-ng `gn` mispronounces the features taught (§8.8, verified); no reliable Guarani ASR **[verify]** | recordings by native speakers; a native listener's check sheet instead of ASR |
| Code-unit string slicing, kana-tuned widths (`> 7` characters → 1 column, 46 px cells ≤ 7) | combining marks and long Latin words | grapheme helpers (`C.chars`, Y1), width rules in §8.4–8.6 |

### 8.3 The spelling pad (replaces the writing pad): `Spell.dc.html` + `gn-spell.js`

**Goal.** Make the learner produce, letter by letter, exactly the spellings Spanish gets wrong: the six nasal vowels `ã ẽ
ĩ õ ũ ỹ`, `g̃` (g + U+0303, no precomposed form), the puso `'` (glottal stop), the stress accent on a non-final syllable
(`á é í ó ú ý`), the digraph letters `ch mb nd ng nt rr` (single letters of the achegety), `y` as a vowel, and the
consonants whose Spanish spelling differs (`k` not c/qu, `h` for Spanish j, `j` for Spanish y/ll) **[revisar list with
the curriculum]**. Like Yaoki, keep it short: only the hard letters are typed; plain letters are given (as Yaoki gives kana).

**Files (follow the canvas rules better than Yaoki did).** `gn-spell.js` holds only pure functions (no DOM): `cells(word)`
(split into achegety graphemes after NFC + one puso: longest match over `mb nd ng nt ch rr g̃` then single graphemes
with their marks), `kind(g)` → `nasal | stress | puso | digraph | plain | special`, `confusers(g)`, `judge(typed, want)`
→ `{ ok, why }`, `syllables(word)` with the stressed one marked, and `stressOf(word)`. `Spell.dc.html` renders cells,
keys and messages as markup (`<sc-for>`, real `<button>`s); no SVG, no script-built UI, no global keydown handler.
`gn-letters.js` holds the per-level letter list (`letters`, `below`), letter names and Spanish notes.

**Props (same contract as Write).** `task`: `{ kind: 'letter', c: 'ẽ', model: "ñe'ẽ", cells }` (a new letter, three
passes, in the first scene word that has it) | `{ kind: 'word', w, cells: [{ c, write, known }] }` (the word once: each
hard letter typed, from memory if known, copied if new; plain letters given) | `{ kind: 'show', c }` (a letter already
learned: shown, heard on request); `tkey`; `finished({ misses, helped })`; `size` (panel width, 358 default); `strip`
(false hides the syllable strip).

**Queue (in `Words.dc.html`, the Scene counterpart):** for each scene word, its hard letters not yet practised
(`typedLetters`, not in `belowLetters`) as `letter` items right before it, then the word itself as a `word` item if it
has at least one hard letter and is not in `typedWords`. As in Yaoki, the step shrinks as the learner advances (from A2 up
all letters are "below": words only).

**Layout (358 px wide; about the same height as Write's 470).**
1. Pass chips (letter items; grid 3, 34 px, radius 10, same looks as `REPS`): `Copiar` · `Con pistas` · `De memoria`
   (Guarani accents optional **[revisar]**). Word items show the word's cells only.
2. **Cells** (`role="list"`, Andika 700): one cell per grapheme; size `min(46, floor((358 − gap·(n − 1)) / n))` px with gap
   6 (4 when n > 7), never below 30 px; above 11 cells wrap to a second row (Yaoki's 40 px fallback would overflow at 9
   cells: 9 × 40 + 8 × 4 = 392 > 358). Given letter: `#F4F5F9`, `2px solid #DDE1EC`, muted. To type: `2px dashed #C9D0E3`;
   current: `2.5px solid #2F4FD0`, `#E8ECFB`, with a small red dot `#C7361E` at its top in `Copiar` (the "start here" dot);
   typed: ink letter, `2px solid #1B2440`, shadow `0 3px 0 #1B2440`. Model letter inside a cell: `Copiar` `#9EA9C8` for the
   current cell and `#D3D8E5` for later ones (Yaoki's trace greys); `Con pistas` `#EBEDF3`; `De memoria` none, and **the
   cells after the current one are not drawn**, so neither the length nor the place of a puso is given away.
3. **Keyboard** (real buttons, Andika 22/700, 46×44 px, radius 12, `2px solid #1B2440`, shadow `0 3px 0 #1B2440`, 2 rows
   of up to 7, gap 6): the graphemes this item needs plus, for each, its confusers, in a stable shuffled order fixed per
   item (as Yaoki's star `bank`). Confusers (pedagogical, Spanish interference): `a ↔ ã ↔ á`, `e ↔ ẽ ↔ é`, `i ↔ ĩ ↔ í`,
   `o ↔ õ ↔ ó`, `u ↔ ũ ↔ ú`, `y ↔ ỹ ↔ ý` (and `y ↔ i/u`), `g ↔ g̃`, `'` (puso) vs the next vowel, `mb ↔ m/b`, `nd ↔ n/d`,
   `ng ↔ n/g`, `nt ↔ n/t`, `rr ↔ r`, `k ↔ c/qu`, `h ↔ j`, `j ↔ y/ll`. Spanish-only letters (c, qu, ll, z) appear only as
   traps **[decide]**. In `Copiar` the right key wears the red dot as well; in the other passes no key is marked.
   Each key `aria-label` names the letter in Spanish: "e nasal", "a con acento", "puso", "g nasal", "eme be" **[revisar
   letter names: a, ã, che, e, ẽ, ge, g̃e, he, i, ĩ, je, ke, le, me, mbe, ne, nde, nge, nte, ñe, o, õ, pe, re, rre, se, te,
   u, ũ, ve, y, ỹ, puso]**. The iOS system keyboard is not used: it has no ẽ ĩ ũ ỹ g̃ **[verify on device]**, it covers
   half the screen, and smart punctuation turns `'` into `’`.
4. **The line under the cells** (`aria-live="polite"`, 13/700, min-height 36, tone colours as Write). Copy (voseo shown;
   `tú` is the alternative **[decide]**, all **[revisar]**):
   - prompts: `Copiá la palabra, letra por letra · letra 2 de 4` · `Otra vez, con pistas suaves · letra 2 de 4` · `Ahora de
     memoria: escuchá y escribí`; word items `Escribí ẽ de memoria` / `Copiá ẽ: es nueva para vos`;
   - by confusion (from `judge().why`): `Esta vocal es nasal: lleva tilde (ẽ).` · `Esta vocal no es nasal: va sin tilde.` ·
     `Esta sílaba lleva el acento: é.` · `El acento no va en esta sílaba.` · `Acá va el puso ('), el corte de la voz.` ·
     `Acá no hay puso.` · `Es g̃, la g nasal: con tilde.` · `mb es una sola letra: tocá mb.` · `En guaraní no se usa c: se
     escribe k.` · `Es y, la vocal guaraní (no es i ni u).` · otherwise `Esa no. Probá la letra 3 otra vez.`;
   - help: after 2 misses on a cell its letter and its key light up yellow `#F2B43A`: `Seguí la letra amarilla.`; after 4
     the letter is filled in (`helped`): `La letra 3 se escribió por vos. Seguimos.`;
   - done: a pass without misses `¡Iporã! Sin errores.`; with misses `¡Oĩma! Listo.`; task `¡Oĩma! Tres veces.` / `¡Oĩma!
     ñe'ẽ está escrita.`; show `Ya la escribiste. Tocá Escuchar para oírla otra vez.`
5. **Three buttons** (grid 3 × 44 px, as Write): `Escuchar` (plays the word clip, gold while playing, `aria-pressed`;
   replaces 書き順), `Pista` (shows the next letter in yellow; `aria-disabled` when not writing), `Otra vez` (this pass
   again from the first letter).
6. **Syllable strip** (replaces the stroke-order strip): `Sílabas · ñe·'ẽ` (11/800 muted) and the word in syllables, the
   stressed syllable in red `#C7361E` (as the new stroke is red in Yaoki's strip) **[revisar the stress rules: final
   stress unmarked, written accents, nasal syllables]**; in `De memoria` it keeps its place, hidden, label ` · oculta por
   ahora`. A slow, syllable-by-syllable clip (`w.<sid>.<id>.slow`) can play from a tap on the strip.

**Timing and look carried from Yaoki:** a correct key fills its cell with a 180 ms pop; a wrong key flashes the cell red
(`#C7361E`) and fades it in 480 ms (the miss look of a stroke); a finished pass celebrates 750 ms with
`0 0 0 4px #E0F3EF, 0 4px 0 #1B2440` + `yk-pop 360ms` on the cell row; the next pass starts by itself. In `De memoria` the word
plays first (dictation), as `played` plays the stroke order before time 1.

**What is kept.** `typedLetters` (array of graphemes: g̃ and digraphs are several code points, so not a string) and
`typedWords` (array), additive, for all levels, saved at once by `finished` (`save({ typedLetters: [c] })`,
`save({ typedWords: [w] })`), exactly like `wrote`/`wroteWords`.

**Accessibility (better than Yaoki's pad):** everything is buttons and text; the current cell has `aria-current="true"`
and an `aria-label` ("letra 3 de 4, por escribir"); the line under the cells is `aria-live`; the whole pad works with
VoiceOver and Switch Control. Keys stay at least 44 px tall.

**Designed moments.** Spell alone: `ñe'ẽ` **[revisar]**, pass 2 (`Con pistas`), the puso cell typed, the `ẽ` cell
current, keys `' ẽ e é ĩ` shown. WordsWrite (the counterpart of SceneWrite): the first letter item of the sample day at
pass 2, part-way.

### 8.4 Words (the Scene counterpart): `Words.dc.html`, canvas `11 · Palabras en una escena`

- Keep the navy sign board (`#1B2440`, 2 columns) and the chip looks; chips in M PLUS Rounded 1c 17/800 (Y1 verified it
  covers ã ẽ ĩ õ ũ ỹ and U+0303) with `lang="gn"`; allow 2 lines (`min-height: 46px` instead of `height`) for two-word
  phrases (`Mba'éichapa reiko?`); found badge = a ✓ in the 18 px red-ringed circle instead of `済`.
- Scene ideas from Paraguayan daily life (a market stall, a bus in Asunción, the family kitchen, the school, the
  "municipalidad") **[content decision]**.
- Word card: the word on its own line (Andika 700; 40 px up to 6 graphemes, 34 px up to 10, 28 px longer, `overflow-wrap:
  anywhere`); the syllable line with the stressed syllable (`ko·kué·pe`) 16/800 instead of the reading; the Spanish
  gloss 13/500; the play button; the **morpheme tiles** (2 columns: the piece in Andika 22/700, its Spanish meaning or
  function 12/500, e.g. `kokue` chacra · `-pe` en) **[revisar]**.
- What-next line: `Después vas a escribir: 1 letra nueva (ẽ) y 3 palabras.` / `Ya escribiste todas las letras y palabras de
  esta escena. Ahora, la prueba.`
- Steps: `Aprender` / `Escribir` / `Prueba` (Y1), right label red 12/800 `APRENDER`. Step 3 kicker `Así se pregunta en la
  prueba · Escritura`; options laid out by width (one row only if every option fits about 6 characters, 2 columns up to
  about 14, else 1); keep the `_underline_` of the word asked about (fix pitfall 6).
- Clip per word `w.<sid>.<wordId>` (normal) and `w.<sid>.<wordId>.slow` (syllable-paced).

### 8.5 Reading and Listening

- **Reading:** passage in Andika 16/400–700, lh 1.7, `lang="gn"`; tap a word for its Spanish gloss and morpheme split
  (Yaoki Reader's pattern) in practice, not in exam conditions; clue markup `^…^` on Guarani discourse markers (e.g.
  `ha katu` "pero", `upévare` "por eso", `che aimo'ã` "creo") **[revisar]**; skill names in Spanish (`Idea principal`,
  `Opinión del autor`, `Buscar información` on a notice or timetable, `Texto corto`); chip `Lectura · Opinión del autor`;
  `Pista · solo en la práctica` (Y2) for the strategy box; Check `Comprobar` (Guarani accent `Embohovái`, Y2); fix the
  progress bar to the real step and give the clock `role="timer"`.
- **Listening:** types `Respuesta rápida` (e.g. `—Mba'éichapa?` → `Iporã, ha nde?` **[revisar]**), `Expresiones`,
  `Comprensión de puntos`, `Tarea`; keep "nothing printed" (`No hay nada escrito hasta que respondas, como en la prueba.`);
  `Repetir` and `Más despacio 0.8×` (a real slow recording, §8.8); a real streak instead of `3問連続正解` (or none); after
  answering, the script with speaker tags and a `Ver traducción` toggle (Spanish under each line) — learners of a
  language with heavy Spanish mixing (jopara) benefit from seeing which words were Guarani; answer buttons with
  `aria-disabled` + `aria-label="Respuesta 1"` and a reason while locked (`Escuchá primero`).
- Speaker tags: `Narrador`, `Kuña` (mujer), `Kuimba'e` (hombre) **[revisar]**, or Spanish only; aria-labels in Spanish.

### 8.6 Week test, notebook and review (copy)

- **Week test** (`Prueba de la semana`; Guarani accent `Arapokõindy` "semana" from Y2 **[revisar]**): intro `24 preguntas
  con el formato de la prueba, un solo reloj de 20 minutos. Sin pistas ni glosas; respuestas y explicaciones al final. Cada
  error va a tu cuaderno.`; `Por área` with `Vocabulario`, `Gramática`, `Lectura`, `Escucha`; result `Respuestas correctas`,
  `18:40 de 20:00 · sin pistas`, the stamp (§8.2), the stamp-card line computed from real stamps (`Semana 3: 7 de 7`),
  `Punto débil` chip, `6 errores fueron a tu cuaderno, cada uno con su explicación.`, `Ver errores`, `A la semana 4`.
  Consider adding listening items to the week test (Exam would need a play button per listening item, played once)
  **[decide]**; the designed moment should show one weak spot so the chip is designed.
- **Notebook** (`Cuaderno de errores`): `Para repasar hoy`, `2 · unos 2 min`, `Repasar ahora`; caught up `¡Al día!` /
  `Todavía no hay nada` + `Próximo repaso: mañana` / `en 3 días`; explainer `Un error sale del cuaderno después de tres
  respuestas correctas seguidas, cada vez más espaciadas.`; track cells `mañana` · `en 3 días` · `en 1 semana` ·
  `¡aprendido!` (Guarani accent for "mañana": `ko'ẽrõ` **[revisar]**); rows `Elegiste: …` → ✓ `…`; due labels `para hoy`
  / `vuelve mañana` / `en 4 días`; cleared `Aprendidos hoy: 1 salió del cuaderno.`. Quote: cut at a word boundary,
  grapheme-safe, about 32 characters at Andika 15 px (Latin needs more characters than 21 kana for one line).
- **Review** (`Repaso`): `1 / 2`, `seguidas`; context `Transcripción` (shown after answering for listening items, with a
  play button before) or `El texto`; verdict `¡Iporã! ¡Correcto!` / `¡Haimete! Casi` (Y2), `Respuesta: 2 …`, `La vez pasada
  elegiste: …`; track note `Ahora en 3 días. Si acertás: a 1 semana. Si no: vuelve a mañana.` / `Vuelve al inicio: mañana
  otra vez.` / `2 de 3 seguidas. Próxima vez: en 1 semana.` / `3 de 3 seguidas. ¡Aprendido! Sale del cuaderno.`; summary
  `Repaso terminado` + `Avanzaron un paso`, `Aprendidos: salen del cuaderno`, `Vuelven mañana`; `Al cuaderno`. Fix the
  designed moment so it matches its intent (answered right, moving to 1 semana) or say it shows the wrong path.
- Options in Review: 2 columns only if every option fits about 14 characters at 16 px, else one column (Y2 §9.3 h).

### 8.7 Mock exam → prueba de nivel

- Mock tab (`Prueba` in the tab bar, Y1): `Prueba de nivel · A1` card `12 preguntas · unos 15 min`, `La prueba en pequeño:
  las dos partes, la pausa y un resultado. Cuando quieras.` → `Empezar`; taken: `Último resultado 9 / 12`, `Ver resultado`,
  `Otra vez`. A longer `Prueba final del nivel` unlocks after the last week (no hard-coded dates; if the learner set a
  target date, show `faltan N días`) **[decide]**.
- Run: part 1 `Vocabulario, gramática y lectura` (9 preguntas, one 10:00 clock, `Pregunta 3 de 9`, rubric in Spanish),
  `Hoja de respuestas` with ovals, `Marcar para revisar`, `Anterior` / `Siguiente`, `Entregar` (`Después de entregar, no
  podés volver a esta parte.`, `Te faltan 6 preguntas.`), time up `Se terminó el tiempo: tus respuestas se entregaron como
  estaban.`; pause `Pausa · 1 min` with `Tomá agua y descansá la vista.` and the sound check (`Prueba de sonido`, a short
  Guarani greeting clip `c.check`, `¿Se escuchó? Si no, subí el volumen y probá otra vez.`); part 2 `Escucha` paced by the
  audio (`El audio suena una sola vez. No podés volver a una pregunta.`, `Tiempo para responder`); result by part; answers
  in four area tabs; `Ver la transcripción`.
- Spoken choice numbers: in Guarani (`peteĩ, mokõi, mbohapy, irundy`) or Spanish (common in jopara) **[decide, revisar]**;
  record the number together with its choice, with 1.0 s before it, as Yaoki does.
- Replace the daruma and the JLPT score board; keep "the mini teaches the format" as `La prueba de nivel es práctica de
  formato.`

### 8.8 Sound for Guarani

- **Voices: record.** Kokoro-82M has no Guarani voice. espeak-ng ships a Guarani voice, but its phonemes miss what the
  app teaches (**verified**, espeak-ng via `espeakng_loader` 0.2.4, voice `gn`, IPA mode): `ñe'ẽ → ɲeˈẽ` (puso dropped),
  `Mba'éichapa → mbaˈeiʃˌapa` (puso dropped), `g̃uahẽ → ɡˌuahˈẽ` (g̃ not nasal), `ndajapói → ŋdˌaʝapˈoi` (nd read as ŋd),
  `mitãnguéra → mitˈãŋɡuˈeɾa`, `óga → ˈoɣa`, `kokuépe → kˌokuˈepe`. A synthetic placeholder would teach the wrong sounds,
  so every model clip (words, examples, listening, letters) needs a native speaker, ideally one woman and one man plus a
  narrator, as Yaoki's three voices. Until recordings exist, ship no clip: every screen already works silently.
- **Registry:** `window.__gnClips[key] = { ms, u: 'audio/<key>.mp3' }` (the N1 file style: no 1.33× base64 overhead,
  each file cached on first play), listed in `audio/clips.js`; `window.gnSound` with the same API as `ykSound`; the N1
  `sound.js` (fetch + decode) is the one to port.
- **Keys (ASCII only, level-prefixed, one padding rule):** `x.<sid>.<point>.<example>` (teach example), `w.<sid>.<wordId>`
  and `w.<sid>.<wordId>.slow` (scene word, syllable-paced), `l.<sid>` and `l.<sid>.slow` (listening lesson), `l.<sid>.<part>`
  (parts of a longer item), `m.<lv>.<n>.<part>` (prueba de nivel), `k.<letterId>` (a letter's model, e.g. `k.e-nasal`),
  `c.check` (sound check). Word ids ASCII (`nee` for ñe'ẽ), never the Guarani spelling in a file name.
- **Stand-in** when a clip is missing: one helper in the engine, `standIn(text, rate)`, so every screen agrees. Y1 wrote
  "600 ms + 120 ms per character", Y2 "600 + 70 ms per letter"; for clear teaching speech of about 10–12 letters a second,
  **600 ms + 85 ms per grapheme (spaces included), divided by `rate`** sits between them; Yaoki's own stand-ins are 1.2 s
  for a word and 2.6 s / rate for a listening line (main app) and 150 ms per character + 600 ms (N1, kana).
- **Slow takes:** record them (the same speaker, naturally slower, pauses longer), never `playbackRate` (which also lowers
  pitch on some devices) **[verify]**; label `Más despacio 0.8×`; for words, a syllable-by-syllable take (`o·ñe·'ẽ`) is
  the pronunciation aid Spanish speakers need for nasality and the puso.
- **Processing (as Yaoki's maker):** trim silence to 30 ms before and 80 ms after the voice; pad 0.1 s before and 0.2 s
  after; 0.5 s between lines; 0.8 s after a narrator intro; 1.0 s before each numbered choice; answer time 8 s (four
  choices) / 6 s (three replies); deliver MP3 24 kHz mono 32 kbit/s (proven on iPhone) from 48 kHz WAV masters with even
  loudness **[decide target]**; store `ms` rounded to 10 ms; a signature per clip so only changed lines are re-recorded or
  re-cut.
- **QA:** a check sheet per unit (text, file, length, a native listener's ✓ and note) replaces Yaoki's two-recogniser
  manifest; check every nasal vowel, puso and stressed syllable against the written form.
- **Offline:** per-unit (or per-file) lazy storage with content hashes, background request for the chosen level only; the
  `keepLevel` regexes (`/^n[345]$/`, `/^n\d$/`) become `/^(a1|a2|b1|b2)$/` (Y1's level names) **[decide]**.

### 8.9 Label terms for these screens (Spanish always; Guarani accent only where confident; all **[revisar]**)

| Yaoki | Spanish | Guarani accent (confidence) |
|---|---|---|
| `つぎへ　Next` | Siguiente | `Tenonde` (low; else Spanish only) |
| `せいかい！ Correct` / `おしい！ Not quite` | ¡Correcto! / Casi | `¡Iporã!` (high) / `¡Haimete!` (high) (Y2) |
| `解説　Why` | Por qué | `Mba'ére` (high) (Y2) |
| `スクリプト　Script` | Transcripción | — |
| `もう一度 Replay` / `ゆっくり 0.8×` | Repetir / Más despacio 0.8× | `Jey` "otra vez" (medium) |
| `間違いノート` | Cuaderno de errores | — |
| `今日の復習　Due today` | Para repasar hoy | `Ko árape` "hoy" (medium, Y1) |
| `復習する　Review now` / `復習 REVIEW` | Repasar ahora / REPASO | — |
| `あした · 3日後 · 1週間後 · 卒業` | mañana · en 3 días · en 1 semana · ¡aprendido! | `ko'ẽrõ` "mañana" (medium) |
| `週テスト　WEEK TEST` | PRUEBA DE LA SEMANA | `Arapokõindy` "semana" (medium, Y2) |
| `分野別　By area` / `苦手　Weak spot` | Por área / Punto débil | — |
| `模擬試験` / `ミニ模試` | Prueba / Prueba de nivel | — |
| `解答用紙` / `提出する` / `あとで見直す` | Hoja de respuestas / Entregar / Marcar para revisar | — |
| `休憩` / `音量チェック` | Pausa / Prueba de sonido | — |
| `済` | Listo (✓) | `Oĩma` (medium, Y1/Y2) |
| `書く` / `なぞる · うすく · 見ないで` | Escribir / Copiar · Con pistas · De memoria | — |
| `書き順 · ヒント · もう一度` (pad buttons) | Escuchar · Pista · Otra vez | — |

### 8.10 Open questions

- Which letters count as "hard" (taught as letter items) at A1, and whether Spanish-only trap keys (c, qu, ll, z) belong on
  the keyboard.
- Whether the word item types every letter (full dictation) at higher levels instead of only the hard ones.
- Who records (how many voices; Guarani narrator or Spanish narrator at A1), and the loudness target.
- Whether week tests get listening items (Exam with audio) and whether a final level test exists, with what pass line.
- Spanish register (voseo vs tú) for every instruction and message above.
- Stress-accent rules to encode in `syllables()` / `stressOf()` (final stress unmarked; written acute; nasal syllables).

---

## 9. Source files read

- Screens (all in full unless noted): `yaoki/project/Scene.dc.html`, `SceneWrite.dc.html`, `Write.dc.html`,
  `Reading.dc.html`, `Listening.dc.html`, `WeekTest.dc.html`, `Notebook.dc.html`, `Review.dc.html`, `Mock.dc.html`,
  `MockFull.dc.html`, `MockPaper/MockSheet/MockReading/MockBreak/MockListening/MockResult/MockAnswers.dc.html`,
  `MockRun.dc.html` (83 KB: template, data, lifecycle, tick, listening and result logic, renderVals); context:
  `Exam.dc.html` (week-test set, finish, areas), `App.dc.html` (SCREENS), `Today.dc.html` and `Main.dc.html` (routes in),
  `canvas.json`; N1 diffs: `yaoki-n1/project/Listening.dc.html`, `yaoki-n1/project/sound.js`.
- Engines: `yaoki/project/sound.js` (all), `yk-write.js` (all), `course.js` (notebook, area, needSound, view, handlers),
  head of `sound-lessons.js`, clip keys of `sound-mock.js`, `sound-course.js`, `sound-course-n5-u01.js` and all unit
  files; head of `strokes.js`.
- Tools: `tools/course_clips.py`, `tools/pack_course_sound.py`, `tools/remake_clips.py`, `yaoki-n1/make-sound.py`,
  `tts-clips/u03-manifest.json` (head); `yaoki-app/src/sw.js`, `yaoki-app/src/yk-app.js` (sound requests),
  `yaoki-app/build.mjs` (screen lists).
- Docs: `README.md` (What is where, Offline sound, Writing practice, Tests, The N1 app, Licences), `content/README.md`,
  `content/n5/mini.json`, `yaoki-n1/SCREENS.md` ("Sound"), `docs/licenses.txt` (Voices); course data for `u03d4`,
  `n5u01d1`–`d6` skills, week tests, `mock*` items.
- Canvas format: `artifact-files/25ff9d90-…/artifact-type/reference/format.md`, `artifact-files/25ff9d90-…/SKILL.md`.
- Companion notes: `notes/Y1-plan-state.md` (§0, §3.6–3.8, §5.0, §6), `notes/Y2-lesson-loop.md` (§0, §9).
- Verification scripts (scratch, not deliverables): `scratchpad/y3check.js`, `scratchpad/y3check2.js`; espeak-ng check
  with the scratch venv `scratchpad/tts/venv` and `scratchpad/tts/scripts/ipa.py`.
