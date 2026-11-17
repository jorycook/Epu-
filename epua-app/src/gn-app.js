/* Epu'ã app
 * Everything the installed app needs around the screens: fitting the 390 by 844 design to the phone,
 * saved progress (and a text code that moves it to another copy: Safari and the Home Screen app keep theirs apart),
 * the first-visit page that explains how to put the app on the Home Screen (an iPhone's Share menu, an Android phone's
 * own install question), the system's back gesture, what a screen reader and a keyboard need around the screens (the
 * page's title, where focus goes, what lies behind an open sheet, zoom), the screens that load after the first ones,
 * and the iPhone's audio and screen-lock quirks. The screens themselves are the design canvas's files (see
 * yk-runtime.js); the course, and the one memory every screen reads, are gn-course.js (window.gnCourse). */
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
  var SCREENS = '%SCREENS%'.split(',');

  /* the first screen appears once its typeface is in (so the text does not jump), or after a moment at the latest;
     until then the page shows its own first paint (index.html's #gn-splash). A start on a screen that is not in the
     first file (see "the screens that come later") also waits for that screen */
  var shown = false;
  var facesIn = false;
  var firstIn = true;
  function open() { if (!shown && facesIn && firstIn) { shown = true; root.classList.add('gn-ready'); } }
  function reveal() { facesIn = true; open(); }
  setTimeout(reveal, 900);
  /* something the screens are told through an event on the document, as the engine tells them of a sound file (gnsound) */
  function say(name) { try { document.dispatchEvent(new Event(name)); } catch (e) {} }

  /* ---------- the screens that come later ----------
     The first file (assets/screens.js) holds the shell, the install page and the screens a visit starts on; the others
     (assets/screens-more.js, nearly seven times its size) come in once the page has loaded, or at once when one of
     them is asked for sooner. Until they are in, the shell shows a waiting note in place of such a screen; if the
     file cannot be fetched it says so and offers to try again. */
  var MORE = './assets/screens-more.js';
  function allIn() { for (var i = 0; i < SCREENS.length; i++) if (!window.YK.has(SCREENS[i])) return false; return true; }
  var more = allIn() ? 'in' : 'no';   /* 'no': not asked for yet · 'coming' · 'in' · 'failed' */
  var moreWaits = [];
  var focusLater = false;   /* a screen was asked for before it was in: its heading takes the focus once it is drawn */
  function moreSettled() {
    say('gnscreens');
    var list = moreWaits;
    moreWaits = [];
    list.forEach(function (fn) { try { fn(); } catch (e) {} });
    /* the sound files that waited for the screens (see below) */
    var files = soundWaits;
    soundWaits = [];
    files.forEach(function (f) { try { needSound.call(C, f); } catch (e) {} });
    if (focusLater && more === 'in') { focusLater = false; setTimeout(function () { focusScreen(); syncHistory(); }, 60); }
  }
  function getMore() {
    if (more === 'in' || more === 'coming') return;
    more = 'coming';
    var tag = document.createElement('script');
    tag.src = MORE;
    tag.onload = function () { more = allIn() ? 'in' : 'failed'; moreSettled(); };
    tag.onerror = function () { more = 'failed'; if (tag.parentNode) tag.parentNode.removeChild(tag); moreSettled(); };
    document.head.appendChild(tag);
  }
  /* fn runs once the file is in, or has failed */
  function whenMore(fn) { if (more === 'in' || more === 'failed') fn(); else moreWaits.push(fn); }
  window.addEventListener('load', getMore);
  window.addEventListener('online', function () { if (more === 'failed') getMore(); });
  /* The screens first, then the sound they play. The engine asks for a unit's sound file as soon as a screen reads the
     course (gn-course.js, needSoundFile): with the very first screen, before the page has loaded. No screen of the
     first file plays a clip, and one unit's sound is larger than all the later screens together: on a first visit it
     kept the page loading, and the later screens waiting behind it, for seconds on a slow connection. So a sound file
     asked for before the later screens are in waits for them, or for word that they cannot be fetched. */
  var needSound = C.needSoundFile;
  var soundWaits = [];
  var soundSeen = [];   /* the sound files the screens have asked for in this visit (keepLevelSound, below) */
  if (typeof needSound === 'function') {
    C.needSoundFile = function (f) {
      if (f && soundSeen.indexOf(f) < 0) soundSeen.push(f);
      if (more === 'in' || more === 'failed') needSound.call(C, f);
      else if (soundWaits.indexOf(f) < 0) soundWaits.push(f);
    };
    /* The wait is not cut short when a later screen is asked for sooner: on a slow connection the sound would then
       share the line with the screen the learner is waiting for, which would come later, and the sound no sooner. A
       control that is asked for a clip of a file that waits here says that its audio is loading (the engine's
       C.soundState counts a file it has asked for, held here or not, as on its way). */
  }

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
  /* The save says which form it is in (v). A save with a higher number was written by a newer build of the app: this
     build reads what it understands of it and never writes over it (later, below), and the shell asks the learner to
     open the app again. */
  var SAVE_V = 1;
  var later = false;
  function fromLater(s) { return !!s && typeof s.v === 'number' && s.v > SAVE_V; }
  /* The top-level fields of a save that this build does not know (a newer build's, in the same form) are kept as they
     are and written back with every save: an older copy of the app, still open in another tab or stored on the phone,
     does not strip what a newer one saved. A name that could reach an object's own workings is never carried. */
  var extras = '';
  function extrasOf(s) {
    var out = '';
    Object.keys(s || {}).forEach(function (k) {
      if (k === 'v' || FIELDS.indexOf(k) >= 0 || k === '__proto__' || k === 'constructor' || k === 'prototype') return;
      var text;
      try { text = JSON.stringify(s[k]); } catch (e) { text = undefined; }
      if (text !== undefined) out += ',' + JSON.stringify(k) + ':' + text;
    });
    return out;
  }

  /* What is read back is checked field by field against the course before a screen sees it: a level, a session or a
     question the course does not have, a broken entry or the data of some other version is left out, never thrown over.
     The fields are the state gnCourse.fresh() starts from (seen, the days with study, among them), and the two the
     screens add to it: profile (the goal screen's answers) and exposure (the progress screen's "lo usé" of the week).
     A save from before a field existed loads as before: the field starts empty. */
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
    var out = { start: p.start, target: dateOk(target) ? target : null, pace: p.pace === 'steady' ? 'steady' : 'fit', minutes: MINUTES.indexOf(p.minutes) >= 0 ? p.minutes : 30 };
    /* a plan made again part way through the level: how many sessions were behind it (a first plan has none) */
    if (whole(p.from, 1, 2000) != null) out.from = p.from;
    return out;
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
  /* a week test's result, or a mini exam's (a1m1: kept with the tests): the score, the time it took and the score by area */
  function testOk(t, id) {
    t = obj(t);
    if (!t || !(sessionOk(id, true) || (typeof id === 'string' && C.mini && (C.mini(id) || {}).ready))) return null;
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
    /* the listening part was read from its transcript (no clips yet): the result and the teacher's text say so */
    p2Read: function (b) { return b === true ? true : null; },
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
  /* the days with study ('YYYY-MM-DD'): real dates, each once, oldest first, the last 800 at most (as the engine keeps them) */
  function seenOk(list) {
    var out = [];
    (Array.isArray(list) ? list : []).forEach(function (d) { if (dateOk(d) && out.indexOf(d) < 0) out.push(d); });
    return out.sort().slice(-800);
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
    /* what the exam-style runner asks: a day's three questions, a week test, or a mini exam */
    s.set = from.set === 'test' || from.set === 'mini1' || from.set === 'mini2' ? from.set : 'day';
    s.placement = placementOk(from.placement);
    /* the words spelled with the Guarani keys, at every level: only ever more */
    s.typed = C.addTyped([], words(from.typed, 20000, 80));
    s.profile = profileOk(from.profile);
    s.exposure = exposureOk(from.exposure);
    /* the days with study (a save from before the app kept them has none: the record starts today) */
    s.seen = seenOk(from.seen);
    /* …and when such a save already holds things studied, it is marked, for good: its count of days begins later than
       its learner did, and Progreso says since when it runs («3 días con estudio desde el 16/11») instead of passing
       for the whole count. A learner who starts with the record is never marked: the first thing studied puts its
       day in the record in the same change. */
    s.seenLate = from.seenLate === true || (!s.seen.length && C.studied(s));
    /* the synthetic voice's switch (Progreso): on unless the save says false, so a save from before the switch
       existed, or one that holds anything else there, loads with the voice on */
    s.voice = from.voice !== false;
    return s;
  }

  function start() {
    var s = null;
    try {
      var from;
      var screen = null;
      if (restored) {
        /* the app opened again on a progress code (see importProgress) */
        from = restored;
        restored = null;
      } else if (TEST) {
        /* ?gntest&screen=Main&level=A1&plan={…}&done={…}&m=[…] (and cur, tp, set, tests, exams, placement, typed,
           profile, exposure, seen, now, voice=off): any screen in any state, from the address. A screen other than Goal
           gets a plan starting today when the address gives none */
        var json = function (name, fallback) { try { var v = JSON.parse(query.get(name) || 'null'); return v == null ? fallback : v; } catch (e) { return fallback; } };
        if (query.get('now')) window.__gnNow = +query.get('now');
        screen = query.get('screen') || 'Goal';
        from = { started: screen !== 'Goal', level: query.get('level') || null, plan: json('plan', null), plans: json('plans', {}), cur: query.get('cur') || null, done: json('done', {}), tests: json('tests', {}), exams: json('exams', {}), mistakes: json('m', []), tp: +(query.get('tp') || 0), set: query.get('set') || 'day', placement: json('placement', null), typed: json('typed', []), profile: json('profile', null), exposure: json('exposure', null), seen: json('seen', []), voice: query.get('voice') !== 'off' };
        if (from.started && !from.plan) from.plan = { start: C.today(C.now()), target: null, pace: 'fit', minutes: 30 };
      } else {
        var text = stored();
        from = load(text) || {};
        /* the first start of this tab: what it reads is where its own saving starts from (see remember) */
        if (!begun) { lastSaved = text; newer = null; later = fromLater(from); extras = extrasOf(from); }
      }
      s = checked(from);
      /* the app opens on the week path once the goal is set, else on the goal screen: never in the middle of a lesson */
      s.screen = screen && SCREENS.indexOf(screen) >= 0 ? screen : s.started && s.plan ? 'Main' : 'Goal';
    } catch (e) {
      console.warn('[epua] the saved progress could not be read: starting afresh', e);
      s = C.fresh();
    }
    C.setLevel(s.level || 'A1');
    /* a start on a screen of the later file (the test hooks): fetch it now, and show the app once it is in */
    if (!begun && !window.YK.has(s.screen)) {
      firstIn = false;
      getMore();
      whenMore(function () { firstIn = true; open(); });
    }
    if (!begun) { begun = true; sent = fieldTexts(s); held = sent; }
    /* the player hears of the learner's switch before anything asks for sound (the engine says it again at every view) */
    try { if (window.gnSound && window.gnSound.synthetic) window.gnSound.synthetic(s.voice !== false); } catch (e) {}
    /* a learner with a plan: the level's sound is stored for offline use from the start of the visit (remember asks
       again at each change, for a first visit, where the worker is not in charge yet) */
    keepLevelSound(s);
    return s;
  }
  var FIELDS = ['started', 'level', 'plans', 'plan', 'cur', 'done', 'tests', 'exams', 'mistakes', 'tp', 'set', 'placement', 'typed', 'profile', 'exposure', 'seen', 'seenLate', 'voice'];
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
    return '{"v":' + SAVE_V + FIELDS.map(function (k) { return parts[k] === undefined ? '' : ',' + JSON.stringify(k) + ':' + parts[k]; }).join('') + extras + '}';
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
      } else if (k === 'seen') {
        /* the days with study of both tabs */
        out.seen = seenOk((Array.isArray(base.seen) ? base.seen : []).concat(Array.isArray(mine) ? mine : []));
      } else out[k] = mine;
    });
    return out;
  }
  /* the offline copy stores the level's sound in the background once the learner has a plan (see sw.js): a file the
     engine fetched already is kept as it is, the others come in while the app is open. Megabytes, so not behind the
     back of a learner who pays for data by the megabyte: when the browser says the learner saves data
     (navigator.connection.saveData), nothing is asked for ahead: only the file of the unit that is opened is fetched
     (the engine asks for it, and the worker stores it then). The worker is told the files the screens have asked
     for, and no level: the one the page fetched before the worker was in charge (the first unit's, on a first
     visit) is stored from the browser's own copy, so that unit plays offline too. Nor is anything fetched while the
     synthetic voice is turned off and no other voice exists (gnCourse.soundWanted). Progreso's «Voz sintética» says
     what the sound weighs (sound, below). */
  var soundKept = '';
  var filesKept = '';   /* the files last named to the worker for a learner who saves data */
  function savesData() {
    try { var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection; return !!(c && c.saveData); } catch (e) { return false; }
  }
  /* the bytes of each sound file, as the build found them (build.mjs fills this in) */
  var SOUND_BYTES = {};
  try { SOUND_BYTES = JSON.parse('%SOUND_BYTES%') || {}; } catch (e) { SOUND_BYTES = {}; }
  function keepLevelSound(s) {
    var lv = String((s && s.plan && s.level) || '').toLowerCase();
    if (!/^[abc][12]$/.test(lv)) return;
    if (C.soundWanted && !C.soundWanted()) return;
    var saving = savesData();
    var named = soundSeen.join(' ');
    if (saving ? !named || named === filesKept : lv === soundKept) return;
    try {
      var sw = navigator.serviceWorker && navigator.serviceWorker.controller;
      if (!sw) return;
      if (saving) { sw.postMessage({ keepFiles: soundSeen.slice() }); filesKept = named; }
      else { sw.postMessage({ keepLevel: lv }); soundKept = lv; }
    } catch (e) {}
  }
  /* Ask the browser to keep what is saved: without that it may clear a site's data when the phone runs short of room.
     Asked once the learner has a plan to lose. Chrome and Safari answer by themselves; Firefox puts the question to the
     learner, so there it is asked once only. (It does not lift Safari's one-week rule for a page left in the browser:
     see "a page left in the browser" below.) */
  var askedToKeep = false;
  function keepForGood(s) {
    if (askedToKeep || TEST || !canSave || !(s.started && s.plan)) return;
    askedToKeep = true;
    try {
      var st = navigator.storage;
      if (!st || !st.persist || !st.persisted) return;
      if (/Gecko\/\d/.test(navigator.userAgent || '')) {
        if (localStorage.getItem(KEY + '.asked')) return;
        localStorage.setItem(KEY + '.asked', '1');
      }
      st.persisted().then(function (kept) { return kept || st.persist(); }).catch(function () {});
    } catch (e) {}
  }
  function remember(s) {
    if (!s) return;
    keepLevelSound(s);
    keepForGood(s);
    var now = fieldTexts(s);
    /* what the screens hold, for a progress code where nothing is saved (the test hooks, a browser that keeps nothing) */
    held = now;
    /* A paste can be taken back while nothing was done on the pasted progress. The first change that is more than a
       place in the course (PLACE: the session picked, a lesson's page, whose questions are asked) withdraws the offer:
       «Deshacer» stores the old save again as it was, and would throw away whatever was studied since. */
    var since = sent || now;
    if (before && FIELDS.some(function (k) { return !PLACE[k] && now[k] !== since[k]; })) { before = null; say('gnnotice'); }
    if (TEST || !canSave || later) return;
    var was = sent || now;
    sent = now;
    var dirty = !same(now, was) || !wrote;
    if (!dirty) return;
    var there = stored();
    var out = s;
    var parts = now;
    if (there !== lastSaved) {
      /* another tab saved since this one last read: a newer build's save is left alone; any other keeps the fields
         this build does not know */
      var theirs = load(there);
      if (fromLater(theirs)) { later = true; lastSaved = there; newer = checked(theirs); tell(); return; }
      extras = extrasOf(theirs);
    }
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
    extras = '';
    later = false;
    try { localStorage.removeItem(KEY); } catch (e) {}
  }
  /* another tab saved: keep what it saved, to take at the next quiet moment */
  window.addEventListener('storage', function (e) {
    if (TEST || !canSave || e.key !== KEY || e.newValue == null || e.newValue === lastSaved) return;
    var theirs = load(e.newValue);
    lastSaved = e.newValue;
    if (fromLater(theirs)) later = true;
    else extras = extrasOf(theirs);
    newer = checked(theirs || {});
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

  /* ---------- moving progress to another copy of the app ----------
     On an iPhone the app on the Home Screen keeps its own storage, apart from Safari's: what was done in one is not in
     the other. Progress moves as a text code instead: EPUA1: and, in base64, the save as remember() writes it (only the
     fields that hold something; the rest read back as a fresh start has them). importProgress reads a code with the
     checks start() uses, saves it and opens the app again on it; a code it cannot read, or one that holds nothing,
     changes nothing. */
  var CODE = 'EPUA1:';
  var held = null;       /* the fields the screens hold now, as remember() saves them (JSON per field) */
  var restored = null;   /* the state a code brought, for the next start() */
  /* what the last code replaced, kept until the app is opened again or something is studied on the new progress
     (remember withdraws it then): the paste is the one tap that throws progress away, so the shell offers to take it
     back (undoPaste) */
  var before = null;
  /* the fields that only say where the learner is in the course: a change of these is no study */
  var PLACE = { cur: 1, tp: 1, set: 1 };
  function toBase64(text) {
    var bytes = new TextEncoder().encode(text);
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function fromBase64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  /* what this copy holds: what is saved here (with what another tab of it saved), else what the screens hold */
  function holding() {
    var text = !TEST && canSave ? stored() : null;
    var from = text ? load(text) : null;
    if (!from && held) { try { from = JSON.parse(textOf(held)); } catch (e) { from = null; } }
    return checked(from || {});
  }
  /* a state with something to move: a fresh start, or answers that were all taken back, hold nothing */
  function holdsSomething(s) {
    var some = function (x) { return !!x && Object.keys(x).length > 0; };
    var p = s.profile;
    var x = s.exposure;
    return !!(s.started || s.plan || some(s.plans) || some(s.done) || some(s.tests) || some(s.exams) || s.mistakes.length || s.placement || s.typed.length ||
      (p && (p.why.length || p.work || p.where.length || p.understand != null || p.speak != null)) || (x && x.with.length));
  }
  function exportProgress() {
    var parts = fieldTexts(holding());
    var empty = fieldTexts(checked({}));
    var out = {};
    FIELDS.forEach(function (k) { if (parts[k] !== undefined && parts[k] !== empty[k]) out[k] = parts[k]; });
    return CODE + toBase64(textOf(out));
  }
  /* the code in what was pasted: it may come inside a message, broken over lines, or in the address-safe alphabet */
  function readCode(code) {
    var m = /EPUA1:\s*([A-Za-z0-9+\/_=-][A-Za-z0-9+\/_=\s-]*)/.exec(String(code == null ? '' : code));
    if (!m) return null;
    /* the pieces it was broken into, joined again: all of them, or a few fewer when words follow the code */
    var pieces = m[1].trim().split(/\s+/);
    var counts = [];
    for (var n = pieces.length; n > 0 && n >= pieces.length - 8; n--) counts.push(n);
    if (counts.indexOf(1) < 0) counts.push(1);
    for (var i = 0; i < counts.length; i++) {
      try {
        var from = JSON.parse(fromBase64(pieces.slice(0, counts[i]).join('').replace(/-/g, '+').replace(/_/g, '/')));
        if (obj(from) && from.v === 1) return from;
      } catch (e) { /* not this way */ }
    }
    return null;
  }
  function importProgress(code) {
    /* a newer build's save is never written over, by a code either */
    if (later) return false;
    var from = readCode(code);
    var s = null;
    try { s = from ? checked(from) : null; } catch (e) { s = null; }
    if (!s || !holdsSomething(s)) return false;
    /* what the code replaces: the save as it is stored (or what the screens hold, where nothing is saved) */
    var had = holding();
    var was = { text: !TEST && canSave ? stored() : null, parts: fieldTexts(had), extras: extras };
    extras = extrasOf(from);
    var parts = fieldTexts(s);
    if (!TEST && canSave) {
      var text = textOf(parts);
      try { localStorage.setItem(KEY, text); } catch (e) { extras = was.extras; return false; }
      lastSaved = text;
    }
    before = holdsSomething(had) ? was : null;
    /* what this tab holds from now on is the code's progress, as saved */
    newer = null;
    sent = parts;
    held = parts;
    wrote = true;
    try { window.__gnGoalDraft = null; } catch (e) {}
    restored = s;
    /* the screen that asked is still in its tap: the app opens again just after, on the week path once there is a plan */
    setTimeout(function () { show('Shell'); }, 0);
    return true;
  }
  /* take the last paste back: the progress it replaced is stored again as it was, and the app opens again on it */
  function undoPaste() {
    var was = before;
    before = null;
    if (!was || later) return false;
    var mine = extras;
    extras = was.extras;
    var s = null;
    try { s = checked((was.text ? load(was.text) : null) || JSON.parse(textOf(was.parts))); } catch (e) { s = null; }
    if (!s) { extras = mine; return false; }
    if (!TEST && canSave) {
      try {
        if (was.text == null) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, was.text);
      } catch (e) { extras = mine; return false; }
      lastSaved = was.text;
    }
    var parts = fieldTexts(s);
    newer = null;
    sent = parts;
    held = parts;
    /* what is stored again is the old save, in whatever form it was: the next change writes it in the app's own */
    wrote = false;
    try { window.__gnGoalDraft = null; } catch (e) {}
    restored = s;
    setTimeout(function () { show('Shell'); }, 0);
    return true;
  }

  /* ---------- a page left in the browser ----------
     On an iPhone or an iPad, Safari deletes what a page saved once the page has not been opened for seven days of
     browser use (WebKit's documented rule; it is said of Safari only); the app on the Home Screen is exempt. The
     install page says so to whoever goes on in the browser. A learner who keeps the same tab open does not see that
     page again, so the week path (where there is a plan to lose) says it too, once a week at most: the tab remembers
     when it was last said. */
  var WEEK = 7 * 864e5;
  function toldAt() { try { return +sessionStorage.getItem(KEY + '.told') || 0; } catch (e) { return 0; } }
  function told() { try { sessionStorage.setItem(KEY + '.told', String(Date.now())); } catch (e) {} }
  function clearsSoon() {
    if (TEST || !canSave || later || !(iPhone || iPad) || standalone || browser !== 'Safari') return false;
    var at = toldAt();
    /* a tab that was never told starts its week now */
    if (!at) { told(); return false; }
    return Date.now() - at >= WEEK;
  }

  /* ---------- fit the design to the screen ---------- */
  /* where the 390 by 844 design goes in a vw by vh area, by Yaoki's rules */
  function placeOf(vw, vh) {
    var s = vw / W;
    var need = H * s;   /* the height the whole design takes at full width */
    var sx = s;
    var sy = s;
    var tx = 0;
    var ty = 0;
    var boxed = false;
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
    return { sx: sx, sy: sy, tx: tx, ty: ty, boxed: boxed };
  }
  /* The learner may pinch the page larger (see "zoom" below). While it is enlarged the browser reports a smaller
     window: the design keeps the place it had, and is fitted again once the page is back to its own size. */
  function zoomed() { var vv = window.visualViewport; return !!vv && Math.abs((vv.scale || 1) - 1) > 0.01; }
  var seen = null;   /* the area the design was last fitted to */
  function fit() {
    if (zoomed() && seen) return;
    var vw = view.clientWidth;
    var vh = Math.min(view.clientHeight, window.innerHeight || view.clientHeight);
    if (!vw || !vh) return;
    seen = [vw, vh];
    var sx, sy, tx, ty;
    var boxed = false;
    if (fluid) {
      /* the Add to Home Screen page: full width, as tall as the browser leaves */
      sx = sy = Math.min(vw / W, 1.25);
      stage.style.height = Math.round(vh / sx) + 'px';
      tx = (vw - W * sx) / 2;
      ty = 0;
    } else {
      stage.style.height = H + 'px';
      var at = placeOf(vw, vh);
      sx = at.sx; sy = at.sy; tx = at.tx; ty = at.ty; boxed = at.boxed;
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
  document.addEventListener('pointerdown', function () { touched = true; mayPush = true; }, true);
  document.addEventListener('keydown', function () { touched = true; mayPush = true; }, true);
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

  /* ---------- for a screen reader and a keyboard: the page's title, focus, an open sheet ---------- */
  /* each screen's name in the page's title, after the app's: what a screen reader says the page is */
  var APP_TITLE = document.title;
  var NAMES = { Goal: 'Tu meta', Placement: 'Prueba de ubicación', Main: 'Camino de la semana', Today: 'Lecciones del día', Levels: 'Niveles', Progress: 'Progreso', Teach: 'La regla', Compare: 'Comparar las formas', Drill: 'Práctica', Exam: 'Examen del día', Words: 'Palabras', Reading: 'Lectura', Listening: 'Escucha', WeekTest: 'Prueba de la semana', Notebook: 'Cuaderno', Review: 'Repaso del cuaderno', ExamTab: 'Examen', LevelExam: 'Examen de nivel', Leer: 'Leer', Escribir: 'Escribir', Hablar: 'Hablar' };
  /* the screen on show: the shell's host holds the screen's host */
  function screenEl() { return stage.querySelector('.sc-host .sc-host'); }
  function inView(el) { return !!el && el.getClientRects().length > 0; }
  /* focus on something that is no tab stop of its own (a heading, a sheet), without moving anything: a browser that
     does not know preventScroll would scroll a list to its heading, so every box round it is put back where it was */
  var focusMoved = false;   /* the app has moved the focus since the last tap */
  function focusOn(el) {
    if (!el) return;
    focusMoved = true;
    try {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      var boxes = [];
      for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) boxes.push([p, p.scrollTop, p.scrollLeft]);
      /* a heading that has the focus already takes it afresh, so a screen reader says it again */
      if (document.activeElement === el) el.blur();
      el.focus({ preventScroll: true });
      boxes.forEach(function (b) {
        if (b[0].scrollTop !== b[1]) b[0].scrollTop = b[1];
        if (b[0].scrollLeft !== b[2]) b[0].scrollLeft = b[2];
      });
    } catch (e) {}
  }
  /* a new screen: its heading takes the focus, so a screen reader says where the learner now is and the next Tab starts
     at the top of the screen (a tap used to leave the focus nowhere) */
  function focusScreen() {
    var el = screenEl();
    if (!el || openSheet) return;
    focusOn(el.querySelector('h1') || el.querySelector('h2') || el.firstElementChild || el);
  }
  /* A tap that takes its own control away and leads to another page of the same screen (a lesson's «Siguiente» to
     its next step) used to leave the focus nowhere: the heading of the screen takes it, as on a new screen, so a screen
     reader starts the new page from its top. Not when the screen says itself what the tap did, in a live region that
     was there before (an answer checked, an exam ended: moving the focus could cut that short); only where the screen
     shows an <h1> (a round of a game and a question page of an exam have none: there every tap would say the same
     thing again); and only if nothing else has taken the focus. */
  var liveWas = [];   /* the screen's live regions and what they said when the tap began */
  function liveNow() {
    var el = screenEl();
    var list = el ? el.querySelectorAll('[aria-live], [role="status"], [role="alert"]') : [];
    var out = [];
    for (var i = 0; i < list.length; i++) out.push([list[i], list[i].textContent || '']);
    return out;
  }
  function spoke() {
    for (var i = 0; i < liveWas.length; i++) {
      var now = liveWas[i][0].isConnected ? liveWas[i][0].textContent || '' : '';
      if (now.trim() && now !== liveWas[i][1]) return true;
    }
    return false;
  }
  function focusAfter(c) {
    if (focusMoved || openSheet || !c || (c.isConnected && inView(c)) || spoke()) return;
    var el = screenEl();
    var head = el ? el.querySelector('h1') : null;
    var active = document.activeElement;
    if (head && inView(head) && (!active || active === document.body || active === head || !active.isConnected)) focusOn(head);
  }
  /* An open sheet (role="dialog" aria-modal="true"): what lies behind it is out of reach of a keyboard and a screen
     reader (inert), the sheet takes the focus, and when it closes the focus goes back to the control that opened it.
     The sheet's own scrim (the button just before it, which closes it) stays in reach. The shell hears `gnnotice`
     when a sheet opens or closes: its notice is not drawn over a sheet. */
  var CONTROL = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  var openSheet = null;
  var opener = null;
  var behind = [];
  var lastTapped = null;
  function sheetNow() {
    var all = stage.querySelectorAll('[role="dialog"][aria-modal="true"]');
    return all.length ? all[all.length - 1] : null;
  }
  function scrimOf(sheet) {
    var x = sheet ? sheet.previousElementSibling : null;
    return x && (x.tagName === 'BUTTON' || x.tagName === 'A') ? x : null;
  }
  function syncSheet() {
    var sheet = sheetNow();
    if (sheet === openSheet) return;
    var flipped = !sheet !== !openSheet;
    behind.forEach(function (el) { el.removeAttribute('inert'); });
    behind = [];
    if (sheet) {
      if (!openSheet) {
        /* the control that opened it: the one in focus, when a control is (a keyboard, or a browser that gives a
           tapped button the focus); else the control tapped last. An iPhone leaves the focus where it was when a
           button is tapped: on the heading the app gave it to when the screen opened, which opened nothing. */
        var active = document.activeElement;
        opener = active && active !== document.body && stage.contains(active) && active.matches && active.matches(CONTROL) ? active : lastTapped;
      }
      var scrim = scrimOf(sheet);
      for (var x = sheet; x && x !== stage && x.parentElement; x = x.parentElement) {
        var around = x.parentElement.children;
        for (var i = 0; i < around.length; i++) {
          var el = around[i];
          if (el !== x && el !== scrim && !el.hasAttribute('inert')) { el.setAttribute('inert', ''); behind.push(el); }
        }
      }
      openSheet = sheet;
      focusOn(sheet.querySelector('h1, h2, h3') || sheet);
    } else {
      var back = opener;
      openSheet = null;
      opener = null;
      /* back to the control that opened the sheet, or, if that is gone, to the screen's heading */
      if (back && back.isConnected && inView(back) && !/^(INPUT|TEXTAREA)$/.test(back.tagName)) { focusMoved = true; try { back.focus({ preventScroll: true }); } catch (e) {} }
      else focusScreen();
    }
    if (flipped) say('gnnotice');
    syncHistory();
  }
  if (window.MutationObserver) new MutationObserver(syncSheet).observe(stage, { childList: true, subtree: true });

  /* ---------- the system's back ----------
     The phone's back gesture or key (Android), or the browser's back, does what the screen's own X or back arrow does:
     it closes an open sheet, steps back in the goal screen, leaves a lesson for the day and the day for the week path.
     From the week path it leaves the app, as it always did. For that the tab's history holds one entry for each step
     the app is away from the screen it opens on. An entry is added when a tap leads deeper, never after a back (a
     browser skips entries a page adds without a touch), and taken off when a tap leads back up: the history is never
     deeper than the app, so back from the week path leaves at the first press. The address does not change.
     When a back is answered without a step up (a control that asks first, as the level exam's X does; a sheet that
     stays open), the app is deeper than the history once more, and nothing may be added: the app then steps forward
     again onto the entry the back has just left, which adds nothing, so the next back is caught as well and never
     falls out of the app from inside a screen. */
  /* where each screen's way back leads when it shows no back control of its own */
  var UP = { Goal: 'Main', Placement: 'Goal', Today: 'Main', Levels: 'Main', Progress: 'Main', Notebook: 'Main', ExamTab: 'Main', WeekTest: 'Main',
    Teach: 'Today', Compare: 'Today', Drill: 'Today', Exam: 'Today', Words: 'Today', Reading: 'Today', Listening: 'Today',
    Review: 'Notebook', LevelExam: 'ExamTab', Leer: 'Progress', Escribir: 'Progress', Hablar: 'Progress' };
  var home = 'Main';      /* the screen the app opens on: the week path, or the goal screen until there is a plan */
  var route = null;       /* the shell's go(screen) */
  var mayPush = false;    /* there was a touch since the last back: an entry added now is one the browser honours */
  var popTo = -1;         /* the depth a step of the app's own (back, or forward again) is on its way to (-1: none is) */
  var histWas = 0;        /* the depth of the entry the page was last known to be on */
  var ahead = false;      /* the entry a back of the learner's has just left is still there, one step forward */
  var settled = false;    /* the first page of this visit is up */
  var stepWas = 1;        /* the goal screen's step when it was last looked at */
  var placedFrom = 0;     /* how many steps into the goal screen the placement check was opened */
  var installUp = false;  /* the install page is up because the week path's notice opened it (showInstall) */
  function depthOf(name) {
    var d = 0;
    for (var x = name; x && x !== home && UP[x] && d < 6; x = UP[x]) d += 1;
    return d;
  }
  /* The screen's own way back: the control it marks data-gn-back (the X or the arrow at the left of its header; in a
     round of Hablar, the round's own X, which is drawn another way). A screen that marks none is read by the design's
     recipe: the 44 px control with a negative left margin. A control inside a sheet is the sheet's, not the screen's. */
  function backControl() {
    var el = screenEl();
    if (!el) return null;
    var fit = function (c) { return inView(c) && !c.disabled && c.getAttribute('aria-disabled') !== 'true' && !c.closest('[role="dialog"]'); };
    var marked = el.querySelectorAll('[data-gn-back]');
    for (var k = 0; k < marked.length; k++) if (fit(marked[k])) return marked[k];
    var list = el.querySelectorAll('a, button');
    for (var i = 0; i < list.length; i++) if (parseFloat(list[i].style.marginLeft) < 0 && fit(list[i])) return list[i];
    return null;
  }
  /* the goal screen's step (1 to 3), read from the name of its step bar: its back arrow goes one step back */
  function stepNow() {
    var el = screenNow === 'Goal' ? screenEl() : null;
    var bar = el ? el.querySelector('[aria-label^="Paso "]') : null;
    var m = bar ? /^Paso (\d+) de \d+/.exec(bar.getAttribute('aria-label') || '') : null;
    return m ? Math.max(1, +m[1]) : 1;
  }
  /* The goal screen's way back, when it is a link, leaves the screen and names where it leads (a step back inside the
     screen is a button). That is its first step, and its third when it was opened on a plan that exists (the week
     path's date chip, Progreso's «Rearmar mi plan»): then it is the door back to the plan, not the last of three
     steps, and its back leads, as «Cancelar» does, to the screen that opened it. The screen is one step under the
     screen so named, whatever its step bar says: back from the door is one press, onto the week path or Progreso. */
  function goalLeavesFor() {
    if (screenNow !== 'Goal') return null;
    var own = backControl();
    var m = own && own.tagName === 'A' ? /^([A-Za-z]+)\.dc\.html?$/.exec(own.getAttribute('href') || '') : null;
    return m && m[1] !== 'Goal' && SCREENS.indexOf(m[1]) >= 0 ? m[1] : null;
  }
  function depthNow() {
    /* the install page opened from the week path is one step from it */
    if (installUp) return 1;
    if (!screenNow) return 0;
    var out = goalLeavesFor();
    var d = out ? depthOf(out) + 1 : depthOf(screenNow) + stepNow() - 1;
    /* the placement check opens from a step of the goal screen and closes back to that step: one deeper than it */
    if (screenNow === 'Placement') d += placedFrom;
    if (!d && backControl()) d = 1;
    return d + (sheetNow() ? 1 : 0);
  }
  function histDepth() {
    var st = null;
    try { st = history.state; } catch (e) {}
    return st && typeof st.gn === 'number' && st.gn > 0 ? st.gn : 0;
  }
  function syncHistory() {
    /* One step at a time, and nothing else until it has arrived: the history only says where it is once a step has
       landed, and a second step asked for before that would go an entry too far, out of the app. Nothing but its
       arrival ends the wait (no clock does), and several levels are taken one by one, each from where the history
       then says it is. */
    if (popTo >= 0) return;
    try {
      var want = depthNow();
      var have = histDepth();
      if (want > have && mayPush) {
        for (var i = have + 1; i <= want; i++) history.pushState({ gn: i }, '');
        histWas = want;
        ahead = false;
      } else if (want > have && ahead) {
        /* after a back that was answered without a step up: forward again, once, onto the entry it left (the one
           entry known to be there) */
        ahead = false;
        popTo = have + 1;
        history.forward();
      } else if (want < have) {
        popTo = have - 1;
        history.back();
      }
    } catch (e) {}
  }
  function goBack() {
    /* the install page the week path's notice opened: back to the week path, nothing chosen */
    if (installUp) { show('Shell'); return; }
    var sheet = sheetNow();
    if (sheet) {
      /* back closes a sheet by its scrim; a sheet with no scrim says itself which of its buttons back is (a pause's
         Continuar carries data-gn-back); one that says nothing asks for an answer, and back leaves it open */
      var out = scrimOf(sheet) || sheet.querySelector('[data-gn-back]');
      if (out && !out.disabled) out.click();
      return;
    }
    var own = backControl();
    if (own) { own.click(); return; }
    var up = screenNow !== home ? UP[screenNow] : null;
    if (up === 'Main' && home !== 'Main') up = home;
    if (up && route) route(up);
  }
  window.addEventListener('popstate', function () {
    var at = histDepth();
    /* the app's own step, landed where it was sent (a tap may meanwhile have led deeper again) */
    var own = popTo >= 0 && at === popTo;
    /* a step down: only that can be a back (a step up is the browser's forward, or a step forward of the app's own
       that a back of the learner's overtook) */
    var down = at < histWas;
    popTo = -1;
    histWas = at;
    /* a step down that is not the app's, onto an entry lower than the app is deep: the learner went back */
    if (!own && down && at < depthNow()) {
      mayPush = false;
      ahead = true;
      goBack();
      setTimeout(syncHistory, 120);
    } else syncHistory();
  });
  /* a page brought back as it was left (the browser kept it whole): nothing is on its way any more */
  window.addEventListener('pageshow', function (e) { if (e.persisted) { popTo = -1; histWas = histDepth(); syncHistory(); } });
  /* A page that starts on an entry which still says it is deep (a reload in a lesson, the same address opened again):
     the entry forgets its depth, and the app starts level on its first screen. The entries under it stay where they
     are (after such a reload, back from the week path takes a press for each of them before it leaves), but the depth
     the app counts from here on is made only of entries this page added itself: a step back of the app's own can
     never land on another page. */
  try { if (histDepth()) history.replaceState(null, ''); } catch (e) {}

  function onScreen(name, about) {
    var arrived = name !== screenNow;
    /* the placement check, opened from a step of the goal screen (its second: «Hacer la prueba») */
    if (arrived && name === 'Placement') placedFrom = screenNow === 'Goal' ? Math.max(0, stepWas - 1) : 0;
    screenNow = name;
    if (about && about.home) home = about.home;
    wantAwake = !!AWAKE[name];
    syncLock();
    if (theme && arrived) theme.setAttribute('content', INK[name] ? '#1B2440' : '#F4F5F9');
    if (arrived) {
      /* the exam-style questions are a day's, a week test's or a mini exam's (about.set, the shell's state) */
      var set = String((about && about.set) || '');
      var title = name !== 'Exam' ? NAMES[name] : set === 'test' ? NAMES.WeekTest : /^mini/.test(set) ? 'Mini examen' : NAMES.Exam;
      document.title = APP_TITLE + (title ? ' · ' + title : '');
      root.classList.toggle('gn-nozoom', !!NOZOOM[name]);
      /* not on the screen a visit opens with: nothing was tapped yet */
      focusLater = settled && !window.YK.has(name);
      if (settled) focusScreen();
      stepWas = stepNow();
    }
    syncHistory();
    if (arrived) restartIfUpdated(false);
  }

  /* Before the screen hears of a tap (a screen draws what the tap did as soon as its own handler returns, ahead of the
     listener below): the control tapped, for the way back from the sheet it may open (an iPhone does not give a tapped
     button the focus), and nothing has moved the focus since the tap yet (focusAfter) */
  var tapped = null;
  document.addEventListener('click', function (e) {
    focusMoved = false;
    var c = e.target && e.target.closest ? e.target.closest('a, button, input, textarea') : null;
    tapped = c && stage.contains(c) ? c : null;
    if (tapped) lastTapped = tapped;
    liveWas = tapped ? liveNow() : [];
  }, true);
  document.addEventListener('click', function (e) {
    /* a link to another screen file means nothing here: if a screen did not handle the tap, swallow it */
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && !e.defaultPrevented && /\.dc\.html?([?#].*)?$/.test(a.getAttribute('href') || '')) e.preventDefault();
    var c = tapped;
    /* once the screen has drawn what the tap did: the history as deep as the app, and, when the tap led to another
       step of the goal screen (a page of its own, with its own heading), the focus on that step's heading; when it
       took its own control away without leading to another screen or a sheet, the focus on the screen's heading */
    setTimeout(function () {
      syncHistory();
      var step = stepNow();
      if (step !== stepWas) { stepWas = step; focusScreen(); }
      else focusAfter(c);
    }, 0);
  });
  /* zoom: the learner may pinch any screen larger, the way the browser does it. The two games played with both thumbs
     (Escribir, Hablar) are the exception: two fingers down at once would zoom by accident (the page's nozoom class
     takes the pinch away in app.css; older iPhones tell the page of a pinch with gesturestart). A double tap never
     zooms: every screen answers a tap at once (touch-action: manipulation). */
  var NOZOOM = { Escribir: 1, Hablar: 1 };
  document.addEventListener('gesturestart', function (e) { if (NOZOOM[screenNow]) e.preventDefault(); });
  document.addEventListener('dblclick', function (e) { e.preventDefault(); });

  /* ---------- which page to open ---------- */
  /* opened from its own icon: an iPhone says so itself, an installed app elsewhere by the way it is displayed */
  var shownAs = function (mode) { return !!(window.matchMedia && window.matchMedia('(display-mode: ' + mode + ')').matches); };
  var standalone = navigator.standalone === true || shownAs('standalone') || shownAs('fullscreen') || shownAs('minimal-ui');
  var ua = navigator.userAgent || '';
  var iPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var iPhone = /iPhone|iPod/.test(ua);
  var android = /Android/.test(ua);
  /* A page opened inside another app (a link tapped in Instagram, Facebook or TikTok opens in that app's own
     browser): Android says so itself ("wv"); on an iPhone or an iPad such a page, unlike every browser there, does
     not name Safari. What it saves stays inside that app: neither the phone's browser nor the app on the Home Screen
     sees it, and the page cannot be installed from there. The install page says so. */
  var inApp = !standalone && (android ? /; wv\)/.test(ua) : (iPhone || iPad) && !/Safari\/|CriOS|FxiOS|EdgiOS/.test(ua));
  /* the browser the page is open in, by the name the learner knows it: on an iPhone or an iPad, Safari unless it says
     otherwise; on Android, Chrome unless it says otherwise (a page opened inside another app has no name) */
  var browser = inApp ? 'el navegador' : /CriOS/.test(ua) ? 'Chrome' : /FxiOS/.test(ua) ? 'Firefox' : /EdgiOS/.test(ua) ? 'Edge' : iPhone || iPad ? 'Safari'
    : !android ? 'el navegador' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox\//.test(ua) ? 'Firefox' : /EdgA\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : 'el navegador';
  var skipInstall = TEST || (LOCAL && query.has('browser'));
  /* «Seguir en el navegador» is remembered for the visit (this tab) and, with its date, for a week: a learner who stays
     in the browser is not met by the install page at every visit, and is offered the Home Screen again a week later
     (a browser may empty what it keeps for a site left alone for a week: the icon is the safer home for progress) */
  var BROWSER_KEY = KEY + '.browser';
  var BROWSER_DAYS = 7;
  try { if (sessionStorage.getItem(BROWSER_KEY)) skipInstall = true; } catch (e) {}
  try {
    var chose = +localStorage.getItem(BROWSER_KEY);
    if (chose > 0 && Math.abs(C.now() - chose) < BROWSER_DAYS * 864e5) skipInstall = true;
  } catch (e) {}
  /* a phone or a tablet in its browser first gets the page that says how to put the app on the Home Screen */
  var wantInstall = ((iPhone || iPad || android) && !standalone && !skipInstall) || (LOCAL && query.has('install'));

  /* Android: the browser says when it can install the app (beforeinstallprompt). The page keeps that offer for the
     install page's own button, and so the browser's strip does not come up over the screens; appinstalled says the app
     is on the Home Screen. Where the offer never comes (Firefox, a browser inside another app), the install page shows
     the browser's menu steps instead. */
  var installOffer = null;
  var installed = false;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installOffer = e;
    say('gninstall');
  });
  window.addEventListener('appinstalled', function () {
    installOffer = null;
    installed = true;
    say('gninstall');
  });
  /* the browser's own question, once per offer: 'accepted', 'dismissed', or 'steps' when there is no offer to put */
  function askInstall() {
    var offer = installOffer;
    installOffer = null;
    if (!offer || typeof offer.prompt !== 'function') { say('gninstall'); return Promise.resolve('steps'); }
    try {
      offer.prompt();
      return Promise.resolve(offer.userChoice).then(function (choice) {
        var yes = !!choice && choice.outcome === 'accepted';
        if (yes) installed = true;
        say('gninstall');
        return yes ? 'accepted' : 'dismissed';
      }, function () { say('gninstall'); return 'dismissed'; });
    } catch (x) {
      say('gninstall');
      return Promise.resolve('steps');
    }
  }

  function show(name, over) {
    fluid = name === 'Install';
    /* over: the install page opened from the week path (showInstall), one step from it for the system's back */
    installUp = fluid && !!over;
    root.classList.toggle('gn-fluid', fluid);
    preact.render(null, stage);
    /* the install page is no screen of the shell's: while it is up the page's title is the app's alone, and the shell
       names its screen afresh when it comes back */
    if (fluid) { screenNow = ''; document.title = APP_TITLE; root.classList.remove('gn-nozoom'); }
    fit();
    window.YK.mount(name, {}, stage);
  }

  /* whether this copy can be kept for offline use is only known once the browser has been asked (further down) */
  var offline = 'never';
  window.gnApp = {
    version: (window.__gnBuild || 'development build'),
    standalone: standalone,
    /* a masculine noun: the screens write "en este <device>" */
    device: iPad ? 'iPad' : iPhone ? 'iPhone' : android && /Mobile/.test(ua) ? 'celular' : 'dispositivo',
    browser: browser,
    android: android,
    /* the copy on the Home Screen keeps its progress apart from this page's: so it is on an iPhone and an iPad, and
       for a page opened inside another app (inApp); an Android phone's installed app and its browser share what is
       saved */
    apart: iPhone || iPad || inApp,
    inApp: inApp,
    /* Android's install: 'ready' while the browser's offer is in hand (askInstall puts its question), 'done' once the
       app is installed, else 'steps' (the browser's own menu); the document hears gninstall when that changes */
    installState: function () { return installed ? 'done' : installOffer ? 'ready' : 'steps'; },
    askInstall: askInstall,
    /* the height of the design as fitted to this screen, in the design's pixels (the install page is as tall as the browser leaves) */
    room: function () { return parseFloat(stage.style.height) || H; },
    /* the size the screens are drawn at in this window (1 is the design's own): in Safari on a small iPhone they come out
       much smaller than from the Home Screen, and the install page says so */
    appScale: function () {
      var vw = view.clientWidth;
      var vh = Math.min(view.clientHeight, window.innerHeight || view.clientHeight);
      if (zoomed() && seen) { vw = seen[0]; vh = seen[1]; }
      return vw && vh ? placeOf(vw, vh).sx : 1;
    },
    start: start,
    remember: remember,
    forget: forget,
    /* the sound of a level, for the page that explains the voice (Progreso): bytes, of the files a learner at that
       level ends up with (its units', its exam's, and the placement check's and the speaking game's, which belong to
       no level); unit, of one unit's file on average; saving, the browser says the learner saves data, so only the
       unit that is opened is fetched; kept, this copy stores the level's sound for use without a connection */
    sound: function (lv) {
      var p = String(lv || '').toLowerCase();
      var bytes = 0;
      var units = [];
      Object.keys(SOUND_BYTES).forEach(function (f) {
        var n = +SOUND_BYTES[f] || 0;
        if (f.indexOf('gn-sound-' + p + '-') === 0 || /^gn-sound-(pl|sp)\.js$/.test(f)) bytes += n;
        if (f.indexOf('gn-sound-' + p + '-u') === 0) units.push(n);
      });
      var sum = units.reduce(function (a, b) { return a + b; }, 0);
      return { bytes: bytes, unit: units.length ? Math.round(sum / units.length) : 0, saving: savesData(), kept: offline !== 'never' && !savesData() };
    },
    saving: function () { return canSave && !TEST; },
    /* the browser refuses to keep anything (outside the test hooks, which save nothing on purpose) */
    refused: function () { return !canSave && !TEST; },
    /* another tab saved: fn is called; catchUp(screen) then gives the state to take, at a quiet moment (or null) */
    watch: function (fn) { watchers.push(fn); return function () { watchers = watchers.filter(function (f) { return f !== fn; }); }; },
    catchUp: catchUp,
    /* the progress as a text code to paste in another copy of the app (Safari and the Home Screen app keep theirs apart),
       and the way back: true once the code's progress is saved and the app opens again on it, false for a code that does
       not read (nothing is changed then); whether this copy holds any progress to move */
    exportProgress: exportProgress,
    importProgress: importProgress,
    hasProgress: function () { return holdsSomething(holding()); },
    /* the last paste can still be taken back (until the app is opened again, keepPaste, or the first thing studied
       on the pasted progress: remember withdraws the offer then): undoPaste stores the progress it replaced again and
       opens the app on it */
    pasted: function () { return !!before; },
    undoPaste: undoPaste,
    keepPaste: function () { before = null; },
    /* a sheet is open on the screen: the shell does not draw its notice over it. The document hears gnnotice when
       that changes, and when the offer to take a paste back is withdrawn */
    sheetOpen: function () { return !!openSheet; },
    /* what is saved was written by a newer build of the app: this one shows what it understands and saves nothing */
    later: function () { return later; },
    /* an iPhone's browser deletes what a page saved when the page is not opened for a week: true when it is time to
       say so again on the week path; told() once it was said. showInstall opens the install page again, which says
       what to do about it (the steps to the Home Screen, and the code that takes the progress there): its heading takes
       the focus, and «Seguir en el navegador» leads back to the week path; so does the system's back, with nothing
       chosen (the page is one step from the week path, and the week path says its notice again) */
    clearsSoon: clearsSoon,
    told: told,
    showInstall: function () {
      /* the notice that asks is still in its tap */
      setTimeout(function () { show('Install', true); focusOn(stage.querySelector('h1')); syncHistory(); }, 0);
    },
    /* 'yes' once every file of the app is stored on the device, 'no' until then, 'never' where that cannot happen */
    offline: function () { return offline; },
    /* the screens of the later file: 'in', 'coming', 'no' (not asked for yet) or 'failed'; getScreens asks for them
       now (again, after a failure); the document hears gnscreens when that changes */
    screens: function () { return more; },
    getScreens: getMore,
    /* the shell says which screen is on show (about.home: the screen the app opens on; about.set: whose questions
       the exam-style screen is asking), and hands over its go(screen) for the system's back */
    onScreen: onScreen,
    route: function (fn) { route = fn; },
    useBrowser: function () {
      try { sessionStorage.setItem(BROWSER_KEY, '1'); } catch (e) {}
      try { localStorage.setItem(BROWSER_KEY, String(C.now())); } catch (e) {}
      /* the install page has just said what the browser does with a page left alone for a week */
      told();
      show('Shell');
    },
  };

  try {
    var first = wantInstall ? 'Install' : 'Shell';
    /* the first file of screens did not arrive: the page's own first paint stays up and says so (index.html), where
       an empty stage would say nothing a learner can read */
    if (window.YK.has(first)) show(first);
    else { firstIn = false; if (typeof window.__gnStuck === 'function') window.__gnStuck(); }
  } catch (e) {
    console.error('[epua] could not start', e);
    stage.textContent = 'Epu\'ã no pudo arrancar. Cerrá la app y abrila de nuevo.';
    reveal();
  }
  settled = true;
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
    var registered = false;
    var register = function () {
      if (registered) return;
      registered = true;
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        /* look for a newer copy each time the app comes back to the front */
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reg.update().catch(function () {}); });
      }).catch(function () {
        /* the browser refused (private browsing, for one): say nothing about offline use rather than promise it */
        if (offline === 'no') offline = 'never';
      });
    };
    /* the worker stores every file by asking for it at the address the page uses, so what the browser has just
       downloaded for the page is not downloaded again (see sw.js): it is registered once the page has all its files,
       the later screens included (or after a while, if those are slow to come) */
    var soon = function () { getMore(); whenMore(register); setTimeout(register, 15000); };
    if (document.readyState === 'complete') soon();
    else window.addEventListener('load', soon);
  }
})();
