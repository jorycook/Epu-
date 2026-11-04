/* Epu'ã app
 * Everything the installed app needs around the screens: fitting the 390 by 844 design to the phone,
 * saved progress, the first-visit page that explains how to put the app on the Home Screen, and the iPhone's
 * audio and screen-lock quirks. The screens themselves are the design canvas's files (see yk-runtime.js);
 * the course, and the one memory every screen reads, are gn-course.js (window.gnCourse). */
(function () {
  'use strict';
  var W = 390;
  var H = 844;
  var TOP = 50;   /* the design keeps its top 50 px empty for the status bar */
  var GAP = 8;    /* what is left of that zone when the system draws the status bar itself */
  /* and its bottom 34 px for the home indicator: whatever the screen's shape, the design ends at the bottom edge of
     the screen, so that strip is always the phone's own and nothing of the design is cut off there (see fit) */
  var query = new URLSearchParams(location.search);
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  /* test hooks, on a developer's machine only: the start state comes from the address, and nothing is saved */
  var TEST = LOCAL && query.has('gntest');
  var view = document.getElementById('gn-view');
  var stage = document.getElementById('gn-stage');
  var root = document.documentElement;
  var fluid = false;
  /* saved data is kept per copy of the app: two copies under one web address must not share or delete each other's */
  var HOME = location.pathname.replace(/[^/]*$/, '');
  var KEY = 'epua.v1:' + HOME;
  var C = window.gnCourse;
  /* the screens the shell can show, as the canvas's prototype board routes them (the build fills them in) */
  var SCREENS = 'Goal,Placement,Main,Today,Levels,Progress,Teach,Compare,Drill,Exam,Words,Reading,Listening,WeekTest,Notebook,Review,ExamTab,LevelExam,Leer,Escribir,Hablar'.split(',');

  /* the first screen appears once its typeface is in (so the text does not jump), or after a moment at the latest */
  var shown = false;
  function reveal() { if (!shown) { shown = true; root.classList.add('gn-ready'); } }
  setTimeout(reveal, 900);

  /* ---------- saved progress ---------- */
  var canSave = false;
  try {
    localStorage.setItem(KEY + '.probe', '1');
    localStorage.removeItem(KEY + '.probe');
    canSave = true;
  } catch (e) { canSave = false; }

  /* what is saved, as text, and read back as an object (null when there is nothing, or nothing an object) */
  function load(text) {
    if (!canSave) return null;
    try {
      var s = JSON.parse(text || 'null');
      return s && typeof s === 'object' && !Array.isArray(s) ? s : null;
    } catch (e) { return null; }
  }

  /* What is read back is checked field by field against the course before a screen sees it: a level, a session or a
     question the course does not have, a broken entry or the data of some other version is left out, never thrown over.
     The fields are the state gnCourse.fresh() starts from, and the two the screens add to it: profile (the goal
     screen's answers) and exposure (the progress screen's "lo usé" of the week). */
  function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : null; }
  function dateOk(d) { return typeof d === 'string' && /^\d{4}-\d\d-\d\d$/.test(d) && C.addDays(d, 0) === d; }
  function whole(n, lo, hi) { return typeof n === 'number' && Math.floor(n) === n && n >= lo && n <= hi ? n : null; }
  function amount(n) { return typeof n === 'number' && isFinite(n) && n >= 0 ? n : null; }
  /* a moment, as Date.now() gives it */
  function when(n) { return typeof n === 'number' && isFinite(n) && n > 0 ? n : null; }
  function word(x, max) { return typeof x === 'string' && x && x.length <= (max || 40) ? x : null; }
  function words(x, most, max) {
    var out = [];
    (Array.isArray(x) ? x : []).forEach(function (w) { w = word(w, max); if (w && out.indexOf(w) < 0 && out.length < most) out.push(w); });
    return out;
  }
  /* an object whose values pass keep (keep gives the value to store, or null to leave it out) */
  function each(x, keep) {
    var out = {};
    Object.keys(obj(x) || {}).forEach(function (k) { var v = keep(x[k], k); if (v != null) out[k] = v; });
    return out;
  }
  function levelOk(x) { return typeof x === 'string' && C.ORDER.indexOf(x) >= 0 ? x : null; }
  /* a session of the syllabus (every day of all six levels exists, written or not); kind 'test' for the week tests */
  function sessionOk(id, test) {
    var s = typeof id === 'string' ? C.session(id) : null;
    return !!s && (s.kind === 'test') === !!test;
  }

  /* the plan: { start, target (or null: one session a day), pace, minutes }, as the goal screen makes it */
  var MINUTES = [15, 30, 45];
  function planOk(p) {
    p = obj(p);
    if (!p || !dateOk(p.start)) return null;
    /* the engine also takes the target under its Yaoki name, exam */
    var target = p.target !== undefined ? p.target : p.exam;
    return { start: p.start, target: dateOk(target) ? target : null, pace: p.pace === 'steady' ? 'steady' : 'fit', minutes: MINUTES.indexOf(p.minutes) >= 0 ? p.minutes : 30 };
  }
  /* a study session's progress: g the grammar steps (0 to 3), ks kw k the words lesson, r the reading or listening */
  var PROG = { g: 3, ks: 1, kw: 1, k: 1, r: 1 };
  function progOk(p, id) {
    p = obj(p);
    if (!p || !sessionOk(id, false)) return null;
    var out = null;
    Object.keys(PROG).forEach(function (k) {
      var n = amount(p[k]);
      if (n >= 1) { out = out || {}; out[k] = Math.min(PROG[k], Math.floor(n)); }
    });
    return out;
  }
  /* a week test's result: the score, the time it took and the score by area */
  function testOk(t, id) {
    t = obj(t);
    if (!t || !sessionOk(id, true)) return null;
    var of = whole(t.of, 1, 1000);
    var score = whole(t.score, 0, 1000);
    if (of == null || score == null || score > of) return null;
    var areas = each(t.areas, function (x, a) {
      x = obj(x);
      var right = x && whole(x.right, 0, 1000);
      var all = x && whole(x.of, 1, 1000);
      return C.area(a).key === a && right != null && all != null && right <= all ? { right: right, of: all } : null;
    });
    return { id: id, score: score, of: of, used: whole(t.used, 0, 86400) || 0, areas: areas, at: when(t.at) || 0 };
  }
  /* a level exam: a result (or a sitting put aside, partial), with the answers it keeps to show them again.
     What it holds is kept as LevelExam wrote it; each field it reads is checked, and one that does not fit is left out */
  var PARTS = C.PARTS.map(function (p) { return p.key; });
  var EXAM_FIELDS = {
    mode: function (m) { return m === 'teacher' || m === 'self' ? m : null; },
    groupC: function (n) { return typeof n === 'number' && n >= 0 && n <= 1 ? n : null; },
    groupP: function (n) { return typeof n === 'number' && n >= 0 && n <= 1 ? n : null; },
    at: when,
    recheck: function (d) { return dateOk(d) ? d : null; },
    started: function (d) { return dateOk(d) ? d : null; },
    until: function (d) { return dateOk(d) ? d : null; },
    /* the parts handed in, P1 to P5 */
    done: function (list) { return Array.isArray(list) ? words(list, PARTS.length).filter(function (k) { return PARTS.indexOf(k) >= 0; }) : null; },
    /* each part's score: right of, or self of selfOf for the parts rated against the rubric */
    parts: function (x) {
      return obj(x) ? each(x, function (p, k) {
        p = obj(p);
        if (!p || PARTS.indexOf(k) < 0) return null;
        var q = {};
        ['right', 'of', 'self', 'selfOf'].forEach(function (f) { if (amount(p[f]) != null) q[f] = p[f]; });
        return Object.keys(q).length ? q : null;
      }) : null;
    },
    /* the options chosen, the facts picked in mediation, the texts written, the takes, the ratings, the time in each part */
    a: function (x) { return obj(x) ? each(x, function (n) { return whole(n, 1, 20); }) : null; },
    picks: function (x) { return obj(x) ? each(x, function (list) { return Array.isArray(list) ? list.filter(function (n) { return whole(n, 0, 50) != null; }) : null; }) : null; },
    text: function (x) { return obj(x) ? each(x, function (t) { return typeof t === 'string' ? C.norm(t).slice(0, 4000) : null; }) : null; },
    take: function (x) { return obj(x) ? each(x, amount) : null; },
    used: function (x) { return obj(x) ? each(x, amount) : null; },
    rate: function (x) {
      x = obj(x);
      var score = function (n) { return whole(n, 0, 3); };
      return x ? { P4: each(x.P4, score), P5: each(x.P5, score) } : null;
    },
  };
  function examOk(e, lv, inner) {
    e = obj(e);
    if (!e || (e.level !== undefined && e.level !== lv)) return null;
    var out = {};
    Object.keys(e).forEach(function (k) {
      if (k === 'prev') return;
      var v = EXAM_FIELDS[k] ? EXAM_FIELDS[k](e[k]) : e[k];
      if (v != null) out[k] = v;
    });
    out.level = lv;
    out.apto = e.apto === true;
    out.comprension = e.comprension === true;
    out.partial = e.partial === true;
    out.again = e.again === true;
    /* a sitting put aside carries the last finished result, so the tab can still show it */
    if (!inner && e.prev) out.prev = examOk(e.prev, lv, true);
    return out;
  }
  /* the questions of the extras (the level exam, the placement check), which the notebook can show again */
  var extraIds = null;
  function extraHas(src) {
    if (!extraIds) {
      extraIds = {};
      (function visit(v, depth) {
        if (!v || typeof v !== 'object' || depth > 8) return;
        if (Array.isArray(v)) { v.forEach(function (x) { visit(x, depth + 1); }); return; }
        if (typeof v.id === 'string' && ['choice', 'build', 'spell'].indexOf(v.kind) >= 0) extraIds[v.id] = true;
        Object.keys(v).forEach(function (k) { visit(v[k], depth + 1); });
      })(window.__gnExtra, 0);
    }
    return Object.prototype.hasOwnProperty.call(extraIds, src);
  }
  /* a mistake in the notebook: { src: the question's id, wrong: what was answered, at, step (right answers in a row),
     due: the day it comes back, cleared, last } */
  function mistakesOk(list) {
    var seen = {};
    return (Array.isArray(list) ? list : []).map(function (m) {
      m = obj(m);
      if (!m || typeof m.src !== 'string' || seen[m.src] || !(C.item(m.src) || extraHas(m.src))) return null;
      seen[m.src] = true;
      var out = { src: m.src, wrong: C.norm(typeof m.wrong === 'string' || typeof m.wrong === 'number' ? String(m.wrong) : '').slice(0, 300), at: when(m.at) || C.now(), step: whole(m.step, 0, 3) || 0, due: dateOk(m.due) ? m.due : C.today(C.now()) };
      if (m.cleared === true) out.cleared = true;
      if (m.last === 'right' || m.last === 'wrong') out.last = m.last;
      return out;
    }).filter(Boolean);
  }
  /* the placement check's profile: understanding and speaking, and the level the plan starts at */
  function placementOk(p) {
    p = obj(p);
    if (!p || !levelOk(p.comp) || !levelOk(p.prod)) return null;
    var placed = C.placed(p.comp, p.prod);
    var self = obj(p.self);
    return { comp: placed.comp, prod: placed.prod, start: placed.start, self: self && levelOk(self.comp) && levelOk(self.prod) ? { comp: self.comp, prod: self.prod } : null, measured: p.measured !== false, at: when(p.at) || 0 };
  }
  /* the goal screen's answers: up to two reasons, the work, the places, and the two self-ratings (0 to 4) */
  function profileOk(p) {
    p = obj(p);
    return p ? { why: words(p.why, 2), work: word(p.work), where: words(p.where, 8), understand: whole(p.understand, 0, 4), speak: whole(p.speak, 0, 4) } : null;
  }
  /* the week's "lo usé": the Monday of the week and where Guarani was used */
  function exposureOk(x) {
    x = obj(x);
    return x && dateOk(x.week) ? { week: x.week, with: words(x.with, 8) } : null;
  }

  function checked(from) {
    var s = C.fresh();
    s.started = from.started === true;
    s.level = levelOk(from.level);
    s.plan = planOk(from.plan);
    /* the plans of the other levels, kept for a return to them */
    s.plans = each(from.plans, function (p, lv) { return levelOk(lv) ? planOk(p) : null; });
    s.cur = sessionOk(from.cur, false) || sessionOk(from.cur, true) ? from.cur : null;
    s.done = each(from.done, progOk);
    s.tests = each(from.tests, testOk);
    s.exams = each(from.exams, function (e, lv) { return levelOk(lv) ? examOk(e, lv, false) : null; });
    s.mistakes = mistakesOk(from.mistakes);
    s.tp = whole(from.tp, 0, 50) || 0;
    s.set = from.set === 'test' ? 'test' : 'day';
    s.placement = placementOk(from.placement);
    /* the words spelled with the Guarani keys, at every level: only ever more */
    s.typed = C.addTyped([], words(from.typed, 20000, 80));
    s.profile = profileOk(from.profile);
    s.exposure = exposureOk(from.exposure);
    return s;
  }

  function start() {
    var s = null;
    try {
      var from;
      var screen = null;
      if (TEST) {
        /* ?gntest&screen=Main&level=A1&plan={…}&done={…}&m=[…] (and cur, tp, set, tests, exams, placement, typed,
           profile, exposure, now): any screen in any state, from the address. A screen other than Goal gets a plan
           starting today when the address gives none */
        var json = function (name, fallback) { try { var v = JSON.parse(query.get(name) || 'null'); return v == null ? fallback : v; } catch (e) { return fallback; } };
        if (query.get('now')) window.__gnNow = +query.get('now');
        screen = query.get('screen') || 'Goal';
        from = { started: screen !== 'Goal', level: query.get('level') || null, plan: json('plan', null), plans: json('plans', {}), cur: query.get('cur') || null, done: json('done', {}), tests: json('tests', {}), exams: json('exams', {}), mistakes: json('m', []), tp: +(query.get('tp') || 0), set: query.get('set') || 'day', placement: json('placement', null), typed: json('typed', []), profile: json('profile', null), exposure: json('exposure', null) };
        if (from.started && !from.plan) from.plan = { start: C.today(C.now()), target: null, pace: 'fit', minutes: 30 };
      } else {
        var text = stored();
        from = load(text) || {};
        /* the first start of this tab: what it reads is where its own saving starts from (see remember) */
        if (!begun) { lastSaved = text; newer = null; }
      }
      s = checked(from);
      /* the app opens on the week path once the goal is set, else on the goal screen: never in the middle of a lesson */
      s.screen = screen && SCREENS.indexOf(screen) >= 0 && window.YK.has(screen) ? screen : s.started && s.plan ? 'Main' : 'Goal';
    } catch (e) {
      console.warn('[epua] the saved progress could not be read: starting afresh', e);
      s = C.fresh();
    }
    C.setLevel(s.level || 'A1');
    if (!begun) { begun = true; sent = fieldTexts(s); }
    return s;
  }
  var FIELDS = ['started', 'level', 'plans', 'plan', 'cur', 'done', 'tests', 'exams', 'mistakes', 'tp', 'set', 'placement', 'typed', 'profile', 'exposure'];
  /* each field as it is saved, in JSON (undefined: not saved) */
  function fieldTexts(s) {
    var out = {};
    FIELDS.forEach(function (k) {
      var v = s[k];
      /* a second sitting of the level exam that is still open is not a result yet: the last result is what is kept */
      if (k === 'exams' && obj(v)) v = each(v, function (e) { return e && e.again && !e.partial ? Object.assign({}, e, { again: false }) : e; });
      out[k] = v === undefined ? undefined : JSON.stringify(v);
    });
    return out;
  }
  function textOf(parts) {
    return '{"v":1' + FIELDS.map(function (k) { return parts[k] === undefined ? '' : ',' + JSON.stringify(k) + ':' + parts[k]; }).join('') + '}';
  }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function readBack(text) { return checked(load(text) || {}); }

  /* Two tabs of the app (two Safari tabs, or the app and a tab) share what is saved. Each tab saves after every change,
     so what one tab has not saved yet is only its last change. When another tab has saved in the meantime, that change
     is added to what the other tab saved, never written over it: a session's steps keep the larger value, a mistake or a
     result the change touched replaces its own entry only, words typed are added. The tab then takes the merged state
     at its next quiet moment (the week path, the goal, a tab); in a lesson it keeps the lesson's place (level, plan,
     session) until then. */
  var lastSaved = null;   /* the text of the save as this tab last read or wrote it */
  var sent = null;        /* the fields this tab last handed to remember(), as saved (JSON per field) */
  var newer = null;       /* the merged state the tab has not taken yet, or null */
  var wrote = false;      /* the first change rewrites the save in the form the app reads (whatever was there) */
  var begun = false;      /* start() has run once: later calls (a check reading the save back) change nothing here */
  var watchers = [];
  function same(a, b) {
    for (var i = 0; i < FIELDS.length; i++) if (a[FIELDS[i]] !== b[FIELDS[i]]) return false;
    return true;
  }
  /* what s changed since the last call, applied to base (another tab's save) */
  function replay(base, s, now, was) {
    var out = {};
    FIELDS.forEach(function (k) { out[k] = base[k]; });
    var before = function (k) { try { return was[k] === undefined ? undefined : JSON.parse(was[k]); } catch (e) { return undefined; } };
    var changed = function (a, b) { return JSON.stringify(a) !== JSON.stringify(b); };
    FIELDS.forEach(function (k) {
      if (now[k] === was[k]) return;
      var mine = s[k];
      var old = before(k);
      if (k === 'done' || k === 'tests' || k === 'exams' || k === 'plans') {
        var merged = Object.assign({}, obj(base[k]) || {});
        Object.keys(obj(mine) || {}).forEach(function (id) {
          if (!changed(mine[id], (obj(old) || {})[id])) return;
          if (k === 'done' && obj(merged[id]) && obj(mine[id])) {
            var both = Object.assign({}, merged[id]);
            Object.keys(mine[id]).forEach(function (p) { both[p] = Math.max(both[p] || 0, mine[id][p] || 0); });
            merged[id] = both;
          } else merged[id] = mine[id];
        });
        out[k] = merged;
      } else if (k === 'mistakes') {
        var list = (Array.isArray(base.mistakes) ? base.mistakes : []).slice();
        var had = {};
        (Array.isArray(old) ? old : []).forEach(function (m) { if (m && m.src) had[m.src] = JSON.stringify(m); });
        var fresh = [];
        (Array.isArray(mine) ? mine : []).forEach(function (m) {
          if (!m || !m.src || had[m.src] === JSON.stringify(m)) return;
          var at = -1;
          list.forEach(function (x, i) { if (x && x.src === m.src) at = i; });
          if (at >= 0) list[at] = m; else fresh.push(m);
        });
        out.mistakes = fresh.concat(list);
      } else if (k === 'typed') {
        out.typed = C.addTyped(base.typed, mine);
      } else out[k] = mine;
    });
    return out;
  }
  function remember(s) {
    if (TEST || !canSave || !s) return;
    var now = fieldTexts(s);
    var was = sent || now;
    sent = now;
    var dirty = !same(now, was) || !wrote;
    if (!dirty) return;
    var there = stored();
    var out = s;
    var parts = now;
    if (newer || there !== lastSaved) {
      /* another tab saved since this one last did: add this change to what it saved */
      var base = newer && there === lastSaved ? newer : readBack(there);
      out = replay(base, s, now, was);
      parts = fieldTexts(out);
      newer = same(parts, now) ? null : out;
    }
    var text = textOf(parts);
    wrote = true;
    if (text === there) { lastSaved = there; return; }
    try { localStorage.setItem(KEY, text); lastSaved = text; } catch (e) { canSave = false; }
    if (newer) tell();
  }
  function forget() {
    lastSaved = null;
    newer = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
  }
  /* another tab saved: keep what it saved, to take at the next quiet moment */
  window.addEventListener('storage', function (e) {
    if (TEST || !canSave || e.key !== KEY || e.newValue == null || e.newValue === lastSaved) return;
    lastSaved = e.newValue;
    newer = readBack(e.newValue);
    tell();
  });
  function tell() { watchers.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  /* the screens where the state can change under the learner's eyes without harm */
  var QUIET = { Main: 1, Goal: 1, Notebook: 1, ExamTab: 1, Progress: 1, Levels: 1 };
  /* the newer state for a screen to take now (or null): the fields as the other tab saved them, merged with this one's */
  function catchUp(screen) {
    if (!newer || !QUIET[screen]) return null;
    var next = {};
    FIELDS.forEach(function (k) { next[k] = newer[k]; });
    /* the week path needs a plan: if the other tab left this level without one, its goal screen */
    next.screen = screen === 'Main' && !(next.started && next.plan) ? 'Goal' : screen;
    newer = null;
    /* what this tab now holds is what is saved: taking it is no change of its own */
    sent = fieldTexts(next);
    C.setLevel(next.level || 'A1');
    return next;
  }

  /* ---------- fit the design to the screen ---------- */
  function fit() {
    var vw = view.clientWidth;
    var vh = Math.min(view.clientHeight, window.innerHeight || view.clientHeight);
    if (!vw || !vh) return;
    var s = vw / W;
    var need = H * s;   /* the height the whole design takes at full width */
    var sx = s;
    var sy = s;
    var tx = 0;
    var ty = 0;
    var boxed = false;
    if (fluid) {
      /* the Add to Home Screen page: full width, as tall as the browser leaves */
      sx = sy = Math.min(s, 1.25);
      stage.style.height = Math.round(vh / sx) + 'px';
      tx = (vw - W * sx) / 2;
    } else {
      stage.style.height = H + 'px';
      if (Math.abs(vh / need - 1) <= 0.02) {
        /* phones with a notch are all within half a percent of the design's shape: stretch to fill exactly */
        sy = vh / H;
      } else if (need > vh && (need - vh) / s <= TOP - GAP + 0.03 * H) {
        /* the screen is shorter by about a status bar, because the system keeps that strip for itself:
           leave out the design's own empty top zone instead of shrinking everything.
           When the strip is taller than the zone, the rest is taken up by a squeeze of at most 3%. */
        var crop = Math.min(TOP - GAP, (need - vh) / s);
        sy = vh / (H - crop);
        ty = -crop * sy;
      } else if (need > vh && vw <= 520) {
        /* a much shorter screen (an older phone, a browser with its bars): the design cannot keep the full width.
           Its empty top zone is left out here too, and the rest is as large as the height allows, centred */
        sx = sy = vh / (H - (TOP - GAP));
        tx = (vw - W * sx) / 2;
        ty = -(TOP - GAP) * sy;
      } else {
        /* any other shape (a tablet, a laptop window, a very tall screen): the whole design, in proportion, centred */
        sx = sy = Math.min(s, vh / H);
        tx = (vw - W * sx) / 2;
        ty = (vh - H * sy) / 2;
        boxed = true;
      }
    }
    stage.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + sx.toFixed(5) + ',' + sy.toFixed(5) + ')';
    root.classList.toggle('gn-boxed', boxed && vw > 520);
    /* a phone held sideways: the design is upright only, so say so instead of showing it tiny */
    var sideways = !fluid && boxed && vw > vh && vh < 560 && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    root.classList.toggle('gn-sideways', !!sideways);
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 60); setTimeout(fit, 400); });
  window.addEventListener('pageshow', fit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(view);
  /* an iPhone can report the height of the screen late when the app opens from the Home Screen */
  setTimeout(fit, 120);
  setTimeout(fit, 600);

  /* ---------- iPhone audio and screen lock ---------- */
  /* Sound made with Web Audio is treated as a ring tone unless the page says it is playback:
     without this the silent switch mutes the listening questions (once there are recordings). */
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

  /* keep the screen awake where the learner listens or works through a timed part without touching it:
     the listening lesson, the notebook review, the level exam and the speaking game */
  var AWAKE = { Listening: 1, Review: 1, LevelExam: 1, Hablar: 1 };
  var wantAwake = false;
  var lock = null;
  var asking = false;
  function syncLock() {
    if (!navigator.wakeLock || !navigator.wakeLock.request) return;
    if (wantAwake && !lock && !asking && document.visibilityState === 'visible') {
      asking = true;
      navigator.wakeLock.request('screen').then(function (l) {
        asking = false;
        lock = l;
        l.addEventListener('release', function () { if (lock === l) lock = null; });
        if (!wantAwake) syncLock();
      }).catch(function () { asking = false; });
    } else if (!wantAwake && lock) {
      var old = lock;
      lock = null;
      old.release().catch(function () {});
    }
  }
  document.addEventListener('visibilitychange', syncLock);

  /* ---------- a newer copy of the app ---------- */
  var screenNow = '';
  var updateReady = false;
  var restarting = false;
  var touched = false;
  document.addEventListener('pointerdown', function () { touched = true; }, true);
  document.addEventListener('keydown', function () { touched = true; }, true);
  /* Switch to a newer stored copy at a quiet moment only: on the week path or the goal screen, never in a
     lesson or an exam. Just after opening it may happen before anything was tapped; later it waits for the
     next return to the week path, and not at all if progress could not be saved across the restart. */
  function restartIfUpdated(justOpened) {
    if (!updateReady || restarting) return;
    if (screenNow !== 'Main' && screenNow !== 'Goal' && screenNow !== '') return;
    if (justOpened ? touched : !canSave) return;
    restarting = true;
    location.reload();
  }
  /* the strip the system draws for its status bar takes the page's theme colour: ink above the level exam's ink band */
  var INK = { LevelExam: 1 };
  var theme = document.querySelector('meta[name="theme-color"]');
  function onScreen(name) {
    var arrived = name !== screenNow;
    screenNow = name;
    wantAwake = !!AWAKE[name];
    syncLock();
    if (theme && arrived) theme.setAttribute('content', INK[name] ? '#1B2440' : '#F4F5F9');
    if (arrived) restartIfUpdated(false);
  }

  /* a link to another screen file means nothing here: if a screen did not handle the tap, swallow it */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && !e.defaultPrevented && /\.dc\.html?([?#].*)?$/.test(a.getAttribute('href') || '')) e.preventDefault();
  });
  /* no pinch zoom, no double-tap zoom: the design already fills the screen */
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('dblclick', function (e) { e.preventDefault(); });

  /* ---------- which page to open ---------- */
  var standalone = navigator.standalone === true || !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var ua = navigator.userAgent || '';
  var iPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var iPhone = /iPhone|iPod/.test(ua);
  var skipInstall = TEST || (LOCAL && query.has('browser'));
  try { if (sessionStorage.getItem(KEY + '.browser')) skipInstall = true; } catch (e) {}
  var wantInstall = ((iPhone || iPad) && !standalone && !skipInstall) || (LOCAL && query.has('install'));

  function show(name) {
    fluid = name === 'Install';
    root.classList.toggle('gn-fluid', fluid);
    preact.render(null, stage);
    fit();
    window.YK.mount(name, {}, stage);
  }

  /* whether this copy can be kept for offline use is only known once the browser has been asked (further down) */
  var offline = 'never';
  window.gnApp = {
    version: (window.__gnBuild || 'development build'),
    standalone: standalone,
    device: iPad ? 'iPad' : iPhone ? 'iPhone' : 'dispositivo',
    start: start,
    remember: remember,
    forget: forget,
    saving: function () { return canSave && !TEST; },
    /* the browser refuses to keep anything (outside the test hooks, which save nothing on purpose) */
    refused: function () { return !canSave && !TEST; },
    /* another tab saved: fn is called; catchUp(screen) then gives the state to take, at a quiet moment (or null) */
    watch: function (fn) { watchers.push(fn); return function () { watchers = watchers.filter(function (f) { return f !== fn; }); }; },
    catchUp: catchUp,
    /* 'yes' once every file of the app is stored on the device, 'no' until then, 'never' where that cannot happen */
    offline: function () { return offline; },
    onScreen: onScreen,
    useBrowser: function () {
      try { sessionStorage.setItem(KEY + '.browser', '1'); } catch (e) {}
      show('Shell');
    },
  };

  try {
    show(wantInstall ? 'Install' : 'Shell');
  } catch (e) {
    console.error('[epua] could not start', e);
    stage.textContent = 'Epu\'ã no pudo arrancar. Cerrá la app y abrila de nuevo.';
    reveal();
  }
  /* the faces the first screen draws with: the interface's titles and body, and the Guarani text (Main's unit title is
     EpuaText 700), asked for together so the first screen does not change face as it appears */
  try {
    Promise.all(["800 16px 'Nunito'", "500 16px 'Nunito'", "700 16px 'EpuaText'", "400 16px 'EpuaText'"].map(function (f) { return document.fonts.load(f, 'Epu\'ã'); })).then(reveal, reveal);
  } catch (e) { reveal(); }

  /* ---------- offline copy ---------- */
  if ('serviceWorker' in navigator && !TEST && (location.protocol === 'https:' || (LOCAL && query.has('sw')))) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      /* the very first install is not an update */
      if (hadController) {
        updateReady = true;
        if (performance.now() < 5000) restartIfUpdated(true);
      }
      hadController = true;
    });
    offline = 'no';
    navigator.serviceWorker.ready.then(function () { offline = 'yes'; }).catch(function () {});
    var register = function () {
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        /* look for a newer copy each time the app comes back to the front */
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reg.update().catch(function () {}); });
      }).catch(function () {
        /* the browser refused (private browsing, for one): say nothing about offline use rather than promise it */
        if (offline === 'no') offline = 'never';
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);
  }
})();
