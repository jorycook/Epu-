/* Guarani course engine: the course engine of the Yaoki suite, for Guarani taught in Spanish.
 * The lessons themselves are data (gn-course-a1.js … gn-course-c2.js, made from content/*.json by tools/build-course.mjs).
 * This file is what every screen uses to read them: the six levels of the Common European Framework (A1 to C2) in one
 * app, the list of study sessions, the plan that lays them out on the calendar (up to a target date, or one a day),
 * the learner's progress, the mistake notebook's review spacing, the end-of-level exam, the placement check, the
 * small text markup the content is written in, and the Guarani text helpers (one puso, tildes kept, letters counted
 * as a reader sees them). It works the same on the design canvas and in the app. */
(function () {
  var C = window.gnCourse = window.gnCourse || {};
  var DAY = 86400000;
  var STEPS = [1, 3, 7];            /* a mistake comes back after 1 day, then 3, then 7; the third right answer in a row clears it */
  var DAYS_PER_UNIT = 7;            /* 5 study days, the review day (repaso), the week test */
  var EXAM_WEEK = 7;                /* with a target date, the last week before it is kept for review and the level exam */

  /* ---------- levels ----------
     The six levels of the CEFR (MCER) in one app. Each level's lessons are their own data file, all loaded side by
     side; one level is current at a time (state.level). Session and item ids carry the level: a1u03d4, a1u03t, b2u01d2. */
  var ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  var META = {
    A1: { name: 'Acceso', can: 'Saludás, te presentás y pedís lo básico, si te hablan despacio.' },
    A2: { name: 'Plataforma', can: 'Resolvés compras, turnos y caminos, y contás lo que hiciste.' },
    B1: { name: 'Umbral', can: 'Seguís noticias y charlas sobre temas conocidos y das tu opinión con razones.' },
    B2: { name: 'Avanzado', can: 'Entendés la radio y la tele en guaraní y en jopara, y argumentás con soltura.' },
    C1: { name: 'Dominio operativo eficaz', can: 'Leés leyes e informes, elegís el registro y mediás en salud, justicia y administración.' },
    C2: { name: 'Maestría', can: 'Entendés literatura, humor e ironía, y traducís lo que casi no se puede traducir.' }
  };
  var LEVEL = 'A1';
  function all() { return window.__gnCourses || {}; }
  function dataOf(lv) { return all()[lv] || { units: [], items: {} }; }
  function data() { return dataOf(LEVEL); }
  function prefix(lv) { return String(lv || 'A1').toLowerCase(); }
  C.ORDER = ORDER;
  C.level = function () { return LEVEL; };
  C.setLevel = function (lv) { if (lv && ORDER.indexOf(lv) >= 0) LEVEL = lv; else if (!lv) LEVEL = 'A1'; return LEVEL; };
  C.meta = function (lv) { return META[lv || LEVEL] || META.A1; };
  /* run fn with another level current, for screens that compare levels (the goal screen, the level menu) */
  C.withLevel = function (lv, fn) { var was = LEVEL; C.setLevel(lv); try { return fn(); } finally { LEVEL = was; } };
  /* the levels of the app, in course order: whether any of their days are written, and how big they are */
  C.levels = function () {
    return ORDER.map(function (lv) {
      var d = all()[lv];
      var ready = 0;
      var days = 0;
      if (d) d.units.forEach(function (u) { (u.days || []).forEach(function (x) { days++; if (x && x.grammar) ready++; }); });
      return { level: lv, name: META[lv].name, can: META[lv].can, ready: ready > 0, written: ready, days: days, units: d ? d.units.length : 0 };
    });
  };
  /* the level a session or item id belongs to */
  C.levelOf = function (id) { var m = /^([abc][12])/i.exec(id || ''); return m ? m[1].toUpperCase() : 'A1'; };
  /* the level after this one, or null after C2 */
  C.nextLevel = function (lv) { var i = ORDER.indexOf(lv || LEVEL); return i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : null; };

  /* ---------- Guarani text ----------
     One puso everywhere: the apostrophe U+0027. Typed text may bring ’ ‘ ʼ ´ ` instead (a phone's smart punctuation
     turns ' into ’), so everything typed or compared goes through norm(). Tildes are kept: a and ã are different
     letters. Unicode has no single g̃: it is g + U+0303 and stays two code points after NFC, so text is cut and
     counted by graphemes (chars), never by code units. */
  var PUSO = /[’‘ʼ´`ʹʻ]/g;
  C.norm = function (s) {
    var t = String(s == null ? '' : s);
    if (t.normalize) t = t.normalize('NFC');
    return t.replace(PUSO, "'");
  };
  /* for matching typed answers: one puso, NFC, lower case, single spaces, no end punctuation */
  C.fold = function (s) {
    return C.norm(s).toLowerCase().replace(/\s+/g, ' ').replace(/^[\s¿¡"«]+|[\s.,;:!?"»]+$/g, '');
  };
  /* the letters as a reader sees them: g̃ and ẽ are one each */
  C.chars = function (s) {
    var t = C.norm(s);
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try { return Array.from(new Intl.Segmenter('gn', { granularity: 'grapheme' }).segment(t), function (x) { return x.segment; }); } catch (e) {}
    }
    return t.match(/[\s\S][̀-ͯ]*/g) || [];
  };
  /* a slice of text that never cuts a letter in two (for quotes in the notebook) */
  C.cut = function (s, n) {
    var cs = C.chars(s);
    return cs.length > n ? cs.slice(0, Math.max(1, n - 1)).join('') + '…' : cs.join('');
  };
  var NASAL = { 'ã': 'a', 'ẽ': 'e', 'ĩ': 'i', 'õ': 'o', 'ũ': 'u', 'ỹ': 'y', 'Ã': 'A', 'Ẽ': 'E', 'Ĩ': 'I', 'Õ': 'O', 'Ũ': 'U', 'Ỹ': 'Y' };
  var ACUTE = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ý': 'Y' };
  function strip(s, what) {
    var t = s;
    if (what.puso) t = t.replace(/'/g, '');
    if (what.nasal) t = t.replace(/[ãẽĩõũỹÃẼĨÕŨỸ]/g, function (c) { return NASAL[c]; }).replace(/̃/g, '');
    if (what.acento) t = t.replace(/[áéíóúýÁÉÍÓÚÝ]/g, function (c) { return ACUTE[c]; }).replace(/́/g, '');
    return t;
  }
  function count(s, re) { var m = s.match(re); return m ? m.length : 0; }
  /* Check a typed Guarani word against the answer and name what is off, the way a teacher would: the puso, the nasal
     tilde, the accent, or other letters. ok is exact (after norm and case); near means only marks are off.
     issues: [{ k: 'puso' | 'nasal' | 'acento' | 'letras', more: true when the learner put one too many }] */
  C.spell = function (typed, answer) {
    var a = C.fold(typed);
    var b = C.fold(answer);
    if (a === b) return { ok: true, near: false, issues: [], at: -1 };
    var keys = ['puso', 'nasal', 'acento'];
    var sets = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
    for (var i = 0; i < sets.length; i++) {
      var what = {};
      sets[i].forEach(function (k) { what[keys[k]] = true; });
      if (strip(a, what) === strip(b, what)) {
        var issues = sets[i].map(function (k) {
          var key = keys[k];
          var re = key === 'puso' ? /'/g : key === 'nasal' ? /[ãẽĩõũỹ̃]/g : /[áéíóúý́]/g;
          return { k: key, more: count(a, re) > count(b, re) };
        });
        return { ok: false, near: true, issues: issues, at: firstDiff(a, b) };
      }
    }
    return { ok: false, near: false, issues: [{ k: 'letras', more: false }], at: firstDiff(a, b) };
  };
  function firstDiff(a, b) {
    var x = C.chars(a), y = C.chars(b);
    for (var i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) return i;
    return -1;
  }
  /* what to tell the learner about each issue (Spanish, short) */
  C.spellNote = function (issue) {
    if (!issue) return '';
    if (issue.k === 'puso') return issue.more ? 'Sobra un puso (\')' : 'Falta el puso (\')';
    if (issue.k === 'nasal') return issue.more ? 'Sobra una tilde nasal (~)' : 'Falta la tilde nasal (~)';
    if (issue.k === 'acento') return issue.more ? 'Esta palabra no lleva acento escrito' : 'Falta el acento (´)';
    return 'Revisá las letras';
  };

  /* ---------- text markup ----------
     {ndajapói}        highlighted (the form being taught; works inside a word: {nd}ajapo{i}, óga{pe})
     [ñande|incl.]     a small gloss above the base (shown on demand; never in exam conditions)
     _réra_            underlined (the word a question asks about)
     ^ko'ẽrõ^          a clue: plain until the answer is shown, then marked (clue:'line' underlines it, clue:'mark' highlights it)
     Options: ruby:false drops glosses (exam conditions), hl:false shows highlights as plain text. */
  C.rich = function (src, opt) {
    opt = opt || {};
    var out = [];
    var hl = false;
    var line = false;
    var clue = false;
    var buf = '';
    function seg(t, r, blank) {
      if (!t && !blank) return;
      var on = (hl && opt.hl !== false) || (clue && opt.clue === 'mark');
      out.push({
        t: t,
        r: r || '',
        ruby: !!r,
        plain: !r && !blank,
        blank: !!blank,
        bg: on ? '#FFE9B0' : 'transparent',
        pad: on ? '0 2px' : '0',
        ws: on ? 'nowrap' : 'normal',
        line: line ? '2px solid #1B2440' : clue && opt.clue === 'line' ? '3px solid #F2B43A' : 'none'
      });
    }
    function flush() { seg(buf); buf = ''; }
    var s = C.norm(src);
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      /* the blank of a question, "(   )": one segment with blank: true, drawn by every screen as the same empty box */
      if (ch === '(' && s.slice(i, i + 5) === '(   )') { flush(); seg('', '', true); i += 4; continue; }
      if (ch === '{' || ch === '}') { flush(); hl = ch === '{'; continue; }
      if (ch === '_') { flush(); line = !line; continue; }
      if (ch === '^') { flush(); clue = !clue; continue; }
      if (ch === '[') {
        var end = s.indexOf(']', i);
        var bar = s.indexOf('|', i);
        if (end > i && bar > i && bar < end) {
          flush();
          var base = s.slice(i + 1, bar);
          var gloss = s.slice(bar + 1, end);
          if (opt.ruby === false) seg(base);
          else seg(base, gloss);
          i = end;
          continue;
        }
      }
      buf += ch;
    }
    flush();
    return out;
  };
  /* the same text with all markup removed, for labels, the notebook and screen readers */
  C.plain = function (src) {
    return C.norm(src).replace(/\[([^|\]]*)\|[^\]]*\]/g, '$1').replace(/[{}_^]/g, '');
  };
  /* A Spanish line that quotes Guarani (a day's title, a sound focus): its pieces in order, [{ t, gn, es }], so a screen
     that builds a line of its own around it can wrap the Guarani in lang="gn". Only what is surely Guarani is marked: a
     word with a letter Spanish never writes (ã ẽ ĩ õ ũ ỹ, ý, g̃) or with a puso between two letters. A word that could
     be either (óga, che) stays with the Spanish around it. */
  var TILDE = String.fromCharCode(0x303), ACCENT = String.fromCharCode(0x301); /* the combining tilde (of g̃) and acute */
  var LETTER = '[A-Za-záéíóúýüñÁÉÍÓÚÝÜÑãẽĩõũỹÃẼĨÕŨỸ' + TILDE + ACCENT + ']';
  var WORD = new RegExp(LETTER + '+(?:\'' + LETTER + '+)*', 'g');
  var GN_ONLY = new RegExp('[ãẽĩõũỹÃẼĨÕŨỸýÝ]|[gG]' + TILDE + '|\'');
  C.mixed = function (src) {
    var t = C.plain(src);
    var out = [];
    var at = 0;
    function push(text, gn) {
      if (!text) return;
      var last = out[out.length - 1];
      var before = out[out.length - 2];
      /* two Guarani words with only a space between them are one piece (ã ẽ ĩ) */
      if (gn && last && before && before.gn && /^\s+$/.test(last.t)) { out.pop(); before.t += last.t + text; }
      else if (last && last.gn === gn) last.t += text;
      else out.push({ t: text, gn: gn, es: !gn });
    }
    t.replace(WORD, function (w, k) {
      if (!GN_ONLY.test(w)) return w;
      push(t.slice(at, k), false);
      push(w, true);
      at = k + w.length;
      return w;
    });
    push(t.slice(at), false);
    return out;
  };

  /* ---------- how wide a text sets ----------
     The width of a text in ems, from the two typefaces' own advance widths at their heavy weights (in hundredths of an
     em: Andika 700 for Guarani, Nunito 800 for the interface when ui is true). A screen asks before it draws: does this
     word fit its button, at this size? If not it steps the size down or stacks the options, and the word stays whole
     (Compare's and Drill's options, the sound pairs, the words question, the week path's labels, Teach's button). A mark
     over a letter adds no width (ã as a, g̃ as g); kerning is left out; the lighter weights set a little narrower, so for
     them the figure errs on the safe side. */
  var EMS = [{
    a: [61, 59, 50, 62, 54, 39, 58, 60, 31, 33, 56, 31, 86, 61, 57, 60, 59, 49, 51, 43, 61, 54, 77, 58, 54, 52],
    A: [73, 68, 68, 73, 59, 59, 72, 74, 51, 50, 70, 55, 91, 75, 73, 62, 75, 67, 61, 62, 73, 72, 104, 67, 67, 61],
    n: 61,
    o: { ' ': 27, "'": 31, '-': 44, '.': 35, ',': 32, ':': 35, ';': 35, '!': 38, '¡': 38, '?': 53, '¿': 53, '(': 42, ')': 42, '«': 64, '»': 64, '·': 37, '…': 81, '/': 53, '–': 54, '—': 87, '"': 53, '+': 59, '=': 59, '~': 54, '→': 100 }
  }, {
    a: [56, 61, 48, 61, 55, 38, 62, 60, 27, 27, 56, 33, 89, 60, 59, 61, 61, 41, 49, 40, 59, 53, 86, 56, 53, 48],
    A: [75, 70, 68, 77, 60, 57, 74, 78, 30, 37, 69, 57, 88, 75, 80, 66, 80, 70, 64, 63, 74, 73, 112, 68, 63, 62],
    n: 60,
    o: { ' ': 28, "'": 26, '-': 44, '.': 26, ',': 26, ':': 26, ';': 26, '!': 26, '¡': 26, '?': 47, '¿': 47, '(': 38, ')': 38, '«': 52, '»': 52, '·': 26, '…': 78, '/': 33, '–': 50, '—': 100, '"': 48, '+': 60, '=': 60, '~': 60 }
  }];
  C.ems = function (s, ui) {
    var T = EMS[ui ? 1 : 0];
    var t = C.norm(s);
    if (t.normalize) t = t.normalize('NFD');
    var w = 0;
    for (var i = 0; i < t.length; i++) {
      var c = t.charCodeAt(i);
      if (c >= 0x300 && c <= 0x36f) continue;
      if (c >= 97 && c <= 122) w += T.a[c - 97];
      else if (c >= 65 && c <= 90) w += T.A[c - 65];
      else if (c >= 48 && c <= 57) w += T.n;
      else w += T.o[t[i]] != null ? T.o[t[i]] : 60;
    }
    return w / 100;
  };
  /* the widest word of a text, in ems: what must fit on one line for no word to be broken. A hyphen inside a word is a
     place a line may turn (Argentina-gua); one that leads a suffix (-kuéra) stays with it */
  C.wordEms = function (s, ui) {
    var m = 0;
    C.plain(s).split(/\s+/).forEach(function (w) {
      w.replace(/([^-])-(?=[^-])/g, '$1- ').split(' ').forEach(function (p) { m = Math.max(m, C.ems(p, ui)); });
    });
    return m;
  };

  /* ---------- the course ---------- */
  C.units = function () { return data().units || []; };
  C.unit = function (n) {
    var us = C.units();
    for (var i = 0; i < us.length; i++) if (us[i].n === n) return us[i];
    return null;
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function sid(u, d) { return prefix(LEVEL) + 'u' + pad(u) + (d === 't' ? 't' : 'd' + d); }
  C.sid = sid;
  /* every study session in order: for each unit, days 1 to 5, the review day and then its week test */
  C.sessions = function () {
    var list = [];
    C.units().forEach(function (u) {
      for (var d = 1; d <= 6; d++) {
        var day = (u.days || [])[d - 1] || null;
        list.push({ id: sid(u.n, d), unit: u.n, day: d, kind: d === 6 ? 'review' : 'study', ready: !!(day && day.grammar), title: day ? day.title : '' });
      }
      list.push({ id: sid(u.n, 't'), unit: u.n, day: 7, kind: 'test', ready: !!(u.test && u.test.length), title: 'Prueba de la semana' });
    });
    return list;
  };
  C.session = function (id) {
    var lv = C.levelOf(id);
    return C.withLevel(lv, function () {
      var list = C.sessions();
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    });
  };
  /* which unit and day an id names, at any level: { level, unit, day } (day 't' for the week test) */
  C.parse = function (id) {
    var m = /^([abc][12])u(\d+)(?:d(\d)|(t))/i.exec(id || '');
    return m ? { level: m[1].toUpperCase(), unit: +m[2], day: m[4] ? 't' : +m[3] } : null;
  };
  C.day = function (id) {
    var p = C.parse(id);
    if (!p || p.day === 't') return null;
    var us = dataOf(p.level).units || [];
    for (var i = 0; i < us.length; i++) if (us[i].n === p.unit) return us[i].days ? us[i].days[p.day - 1] || null : null;
    return null;
  };
  /* any question by its id, at any level: lesson items, week test items, exam items */
  C.item = function (id) {
    var c = all();
    var own = (dataOf(C.levelOf(id)).items || {})[id];
    if (own) return own;
    for (var k in c) if (c[k].items && c[k].items[id]) return c[k].items[id];
    return null;
  };

  /* ---------- progress ----------
     done[sessionId] = { g: grammar step 0-3 (teach read, drill done, exam-style done), ks, kw, k: words learnt, written,
     answered (k is the lesson done), r: reading or listening 0/1 }; a week test is done when tests[id] holds its result */
  C.complete = function (state, s) {
    if (!s) return false;
    if (s.kind === 'test') return !!(state.tests && state.tests[s.id]);
    var p = (state.done || {})[s.id] || {};
    return p.g >= 3 && p.k >= 1 && p.r >= 1;
  };
  /* how far a level has come: units with every session complete, stamps, and the level exam */
  C.progress = function (state, lv) {
    return C.withLevel(lv || LEVEL, function () {
      var us = C.units();
      var done = 0;
      var stamps = 0;
      var units = us.map(function (u) {
        var list = C.sessions().filter(function (s) { return s.unit === u.n; });
        var n = list.filter(function (s) { return C.complete(state, s); }).length;
        stamps += n;
        if (list.length && n === list.length) done++;
        return { n: u.n, es: u.es, gn: u.gn || '', of: list.length, done: n, full: list.length > 0 && n === list.length };
      });
      var ex = (state.exams || {})[lv || LEVEL] || null;
      return { level: lv || LEVEL, units: units, unitsDone: done, stamps: stamps, exam: ex, passed: !!(ex && ex.apto) };
    });
  };

  /* ---------- the plan ----------
     settings: { start: 'YYYY-MM-DD', target: 'YYYY-MM-DD' | null, pace: 'fit' | 'steady', minutes: 15 | 30 | 45, from? }
     no target:  one session a day, at the learner's own pace
     fit:        every session fits before the target, with the last week kept for review and the level exam; days double up when time is short
     steady:     one session a day, whatever the target
     from:       a plan made again part way through the level (the goal screen, reached from the week path's date chip
                 or from Progreso) starts today at the session the learner had reached: from is how many sessions were
                 already behind them. Those keep the days just before start, one a day, and only the rest is laid out
                 from start. A first plan has none (0): every session from start, as before.
     minutes:    the size of a day; a review sitting is a third of it (C.sitting) */
  function dayNo(iso) {
    var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || '');
    if (!m) return null;
    return Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY);
  }
  function iso(n) {
    var d = new Date(n * DAY);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  C.today = function (now) {
    var d = now ? new Date(now) : new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };
  C.daysBetween = function (a, b) { var x = dayNo(a), y = dayNo(b); return x == null || y == null ? 0 : y - x; };
  C.addDays = function (a, n) { var x = dayNo(a); return x == null ? a : iso(x + n); };
  function targetOf(settings) { return settings ? settings.target || settings.exam || null : null; }
  /* how many sessions a plan made again leaves behind its start (0 for a first plan), never more than there are */
  function fromOf(settings, n) {
    var f = settings ? Math.floor(+settings.from || 0) : 0;
    return f > 0 ? Math.min(n, f) : 0;
  }
  C.plan = function (settings) {
    var list = C.sessions();
    var n = list.length;
    var start = dayNo(settings && settings.start) || dayNo(C.today(C.now()));
    var target = dayNo(targetOf(settings));
    var from = fromOf(settings, n);
    var rest = n - from;
    var room = target != null ? target - start - EXAM_WEEK : rest;
    if (target != null && room < 1) room = Math.max(1, target - start);
    var squeeze = target != null && settings && settings.pace !== 'steady' && room < rest;
    return list.map(function (s, k) {
      var j = k - from;
      var at = j < 0 ? start + j : squeeze ? start + Math.floor((j * room) / rest) : start + j;
      return Object.assign({}, s, { date: iso(at) });
    });
  };
  /* how the plan stands today: the session to do next, how far ahead or behind, how many days are left */
  C.status = function (state, now) {
    var plan = C.plan(state.plan || {});
    var today = C.today(now);
    var next = null;
    for (var i = 0; i < plan.length; i++) {
      if (plan[i].ready && !C.complete(state, plan[i])) { next = plan[i]; break; }
    }
    var dueToday = plan.filter(function (s) { return s.date <= today && s.ready && !C.complete(state, s); }).length;
    var perDay = 1;
    /* sessions a day, over the part of the plan that is laid out from its start (all of it, for a first plan) */
    var k0 = Math.min(fromOf(state.plan, plan.length), Math.max(0, plan.length - 1));
    if (plan.length - k0 > 1) {
      var span = C.daysBetween(plan[k0].date, plan[plan.length - 1].date) + 1;
      perDay = Math.max(1, Math.round((plan.length - k0) / Math.max(1, span)));
    }
    var target = targetOf(state.plan);
    var left = target ? C.daysBetween(today, target) : null;
    var stamps = plan.filter(function (s) { return C.complete(state, s); }).length;
    var behind = next && next.date < today ? C.daysBetween(next.date, today) : 0;
    return { plan: plan, next: next, dueToday: dueToday, perDay: perDay, daysLeft: left, stamps: stamps, today: today, behind: behind, target: target };
  };
  /* can the whole level (what is left of it, for a plan made again) be done one session a day before the target? */
  C.fits = function (settings) {
    var target = targetOf(settings);
    if (!target) return true;
    var room = C.daysBetween((settings && settings.start) || C.today(C.now()), target) - EXAM_WEEK;
    var n = C.sessions().length;
    return room >= n - fromOf(settings, n);
  };
  /* the sessions a learner has behind them at a level: those complete in a row from the first (what a plan made again
     starts after) */
  C.reached = function (state, lv) {
    return C.withLevel(lv || LEVEL, function () {
      var list = C.sessions();
      var k = 0;
      while (k < list.length && C.complete(state || {}, list[k])) k++;
      return k;
    });
  };

  /* ---------- the mistake notebook ----------
     an entry: { src: item id, wrong: what was chosen or typed, at: when, step: 0-2 (how many right in a row), due: 'YYYY-MM-DD' } */
  C.miss = function (list, m, now) {
    var today = C.today(now);
    var entry = { src: m.src, wrong: C.norm(m.wrong), at: now || Date.now(), step: 0, due: C.addDays(today, STEPS[0]) };
    return [entry].concat((list || []).filter(function (x) { return x.src !== m.src; }));
  };
  C.due = function (list, now) {
    var today = C.today(now);
    return (list || []).filter(function (x) { return !x.cleared && (x.due || '') <= today; });
  };
  /* the answer in a review: right moves it a step on (the third right in a row clears it), wrong sends it back to 1 day */
  C.reviewed = function (list, src, right, now) {
    var today = C.today(now);
    return (list || []).map(function (x) {
      if (x.src !== src) return x;
      if (!right) return Object.assign({}, x, { step: 0, due: C.addDays(today, STEPS[0]), at: now || Date.now(), last: 'wrong' });
      var step = (x.step || 0) + 1;
      if (step >= 3) return Object.assign({}, x, { step: 3, cleared: true, at: now || Date.now(), last: 'right' });
      return Object.assign({}, x, { step: step, due: C.addDays(today, STEPS[step]), at: now || Date.now(), last: 'right' });
    });
  };
  /* ---------- a review sitting ----------
     A day's review has a size: a third of the plan's minutes a day, at the notebook's own rate of 0.6 minutes a question
     (8, 16 or 25 questions for 15, 30 or 45 minutes; 16 with no plan). A learner back after two weeks is not met by every
     mistake at once: the oldest due go first and the rest stay due for the next days. What was answered in a review
     today counts against the day's size (an entry answered in a review carries `last`, and `at` says when).
     → { due: all that are due, size: the day's size, done: reviewed today, n: how many today's sitting still asks,
         items: those entries (in the notebook's order), more: one more sitting's entries once the day's is done (for a
         learner who asks for more), minutes: what the n take } */
  var REVIEW_RATE = 0.6;
  C.reviewMinutes = function (n) { return Math.max(1, Math.round((n || 0) * REVIEW_RATE)); };
  C.sittingSize = function (plan) {
    var m = plan && +plan.minutes > 0 ? +plan.minutes : 30;
    return Math.max(1, Math.floor(m / 3 / REVIEW_RATE));
  };
  C.sitting = function (list, plan, now) {
    var today = C.today(now);
    var due = C.due(list, now);
    var size = C.sittingSize(plan);
    var done = (list || []).filter(function (x) { return x && x.last && x.at && C.today(x.at) === today; }).length;
    var oldest = due.slice().sort(function (a, b) {
      return (a.due || '') < (b.due || '') ? -1 : (a.due || '') > (b.due || '') ? 1 : (a.at || 0) - (b.at || 0);
    });
    /* the oldest n of what is due, asked in the notebook's own order */
    function take(n) { var pick = oldest.slice(0, Math.max(0, n)); return due.filter(function (x) { return pick.indexOf(x) >= 0; }); }
    var items = take(size - done);
    return { due: due.length, size: size, done: done, n: items.length, items: items, more: items.length ? [] : take(size), minutes: C.reviewMinutes(items.length) };
  };

  /* ---------- the end-of-level exam ----------
     Five parts, as in the DELE: P1 lectura and P2 auditiva (scored by the app), P3 mediación (its Guarani-to-Spanish
     part scored by the app, its Spanish-to-Guarani part by the learner or a teacher), P4 escrita and P5 oral (rubric,
     self-assessed or teacher-marked). Two groups: C (comprensión: P1 + P2 + receptive mediation) and P (producción:
     P4 + P5 + productive mediation). Apto = at least 60 % in each group and no part under 40 %. Passing group C alone
     earns a Constancia de comprensión. The result is the app's constancia, never an official certificate. */
  C.PARTS = [
    { key: 'P1', es: 'Comprensión de lectura', short: 'Lectura', group: 'C', how: 'auto' },
    { key: 'P2', es: 'Comprensión auditiva', short: 'Escucha', group: 'C', how: 'auto' },
    { key: 'P3', es: 'Mediación', short: 'Mediación', group: 'CP', how: 'auto+rubric' },
    { key: 'P4', es: 'Expresión e interacción escritas', short: 'Escritura', group: 'P', how: 'rubric' },
    { key: 'P5', es: 'Expresión e interacción orales', short: 'Oral', group: 'P', how: 'rubric' }
  ];
  /* parts: { P1: { right, of }, P2: {…}, P3: { right, of, self, selfOf }, P4: { self, selfOf }, P5: { self, selfOf } } */
  C.examResult = function (parts, mode) {
    function pct(r, o) { return o > 0 ? r / o : 0; }
    var p = parts || {};
    var c = [p.P1, p.P2, p.P3 && { right: p.P3.right, of: p.P3.of }].filter(function (x) { return x && x.of; });
    var q = [p.P4 && { right: p.P4.self, of: p.P4.selfOf }, p.P5 && { right: p.P5.self, of: p.P5.selfOf }, p.P3 && p.P3.selfOf ? { right: p.P3.self, of: p.P3.selfOf } : null].filter(function (x) { return x && x.of; });
    function sum(list) { var r = 0, o = 0; list.forEach(function (x) { r += x.right || 0; o += x.of || 0; }); return pct(r, o); }
    var gC = sum(c);
    var gP = q.length ? sum(q) : null;
    var floor = c.concat(q).every(function (x) { return pct(x.right || 0, x.of) >= 0.4; });
    var comp = gC >= 0.6 && c.every(function (x) { return pct(x.right || 0, x.of) >= 0.4; });
    var apto = comp && gP != null && gP >= 0.6 && floor;
    return { groupC: gC, groupP: gP, apto: apto, comprension: comp, mode: mode || 'self' };
  };

  /* ---------- placement ----------
     the result of the placement check: a two-part profile; the plan starts at the production level */
  /* the placement's waiver (the "prueba de dispensa", notes G6 §5): a learner who understands more than they speak (the
     placement put comprensión above producción) may take a unit's week test first; with 80 % or more, the comprehension
     lessons of that unit (each day's reading or listening, the r step) count as done */
  C.WAIVE = 0.8;
  C.waives = function (placement, score, of) {
    if (!placement || !(of > 0) || !(score / of >= C.WAIVE)) return false;
    return ORDER.indexOf(placement.comp) > ORDER.indexOf(placement.prod);
  };
  /* the sessions of a unit whose comprehension lesson the waiver marks done */
  C.waived = function (testId) {
    var at = C.parse(testId);
    if (!at) return [];
    return C.withLevel(at.level, function () {
      return C.sessions().filter(function (s) {
        var d = s.unit === at.unit && s.kind !== 'test' && s.ready ? C.day(s.id) : null;
        return !!(d && d.skill && (d.skill.kind === 'reading' || d.skill.kind === 'listening'));
      }).map(function (s) { return s.id; });
    });
  };
  C.placed = function (comp, prod) {
    var c = ORDER.indexOf(comp), p = ORDER.indexOf(prod);
    if (c < 0) c = 0;
    if (p < 0) p = 0;
    return { comp: ORDER[c], prod: ORDER[p], start: ORDER[Math.min(c, p)] };
  };

  /* ---------- the app's one memory ----------
     The prototype frame on the canvas and the installed app both keep this state and hand the same props to
     the screens: app (what to show), go (change screen), save (record progress), miss (a wrong answer). */
  C.now = function () { return window.__gnNow || Date.now(); };
  C.fresh = function () {
    return { screen: 'Goal', started: false, level: null, plans: {}, plan: null, cur: null, done: {}, tests: {}, exams: {}, mistakes: [], tp: 0, set: 'day', placement: null, typed: [], seen: [] };
  };
  /* ---------- the days with study ----------
     seen: the days ('YYYY-MM-DD', oldest first) on which the learner did something the app records (a lesson step, a
     test, a part of the level exam, a review answer, a mistake, a word typed) or opened one of the practice sections
     (Leer, Escribir, Hablar). Opening the app is not study: nothing is written for it. One list for all levels, the
     last SEEN_KEEP days at most. sawDay gives the list with today in it (the same list when it already is). */
  var SEEN_KEEP = 800;
  function seenList(seen) {
    var out = [];
    (Array.isArray(seen) ? seen : []).forEach(function (d) { if (typeof d === 'string' && dayNo(d) != null && out.indexOf(d) < 0) out.push(d); });
    return out.sort();
  }
  C.sawDay = function (seen, now) {
    var today = C.today(now);
    if (Array.isArray(seen) && seen.indexOf(today) >= 0) return seen;
    return seenList(seen).concat([today]).sort().slice(-SEEN_KEEP);
  };
  /* What the days say, for the week path and Progreso. A day of return is a day with study after one or more days
     without (Opu'ã, se levantó). week: the last seven days, today last, each { date, kind }: 'study', 'back' (a day of
     return), 'missed', 'today' (today, nothing done yet) or 'none' (before the record began: the app does not know).
     count: days with study; returns: days of return; gap: days since the last day with study (0 when that is today, or
     when there is no record yet); away: that gap when it is two days or more, the moment the week path greets the
     learner back; back: today is a day of return. A day later than today (a clock set back) is left out. */
  C.days = function (seen, now) {
    var today = C.today(now);
    var list = seenList(seen).filter(function (d) { return d <= today; });
    var has = {};
    var back = {};
    var returns = 0;
    list.forEach(function (d, i) {
      has[d] = true;
      if (i > 0 && C.daysBetween(list[i - 1], d) >= 2) { back[d] = true; returns++; }
    });
    var first = list[0] || null;
    var last = list[list.length - 1] || null;
    var week = [];
    for (var n = 6; n >= 0; n--) {
      var d = C.addDays(today, -n);
      week.push({ date: d, kind: has[d] ? (back[d] ? 'back' : 'study') : n === 0 ? 'today' : !first || d < first ? 'none' : 'missed' });
    }
    var gap = last && !has[today] ? C.daysBetween(last, today) : 0;
    return { week: week, count: list.length, returns: returns, last: last, gap: gap, away: gap >= 2 ? gap : 0, back: !!back[today], today: !!has[today] };
  };
  /* words the learner has spelled right with the Guarani keyboard: kept for all levels at once, only ever growing */
  C.addTyped = function (had, add) {
    var out = Array.isArray(had) ? had.slice() : [];
    (Array.isArray(add) ? add : [add]).forEach(function (w) { var t = C.norm(w); if (t && out.indexOf(t) < 0) out.push(t); });
    return out;
  };
  /* the session a screen works on: the one picked on the week path, else the next one due. With nothing written left to
     do (every written week whole), it is the last day written, never the first: the path then stays on the last week
     done, and a lesson screen opened from Progreso still has a day to show (a week test has none) */
  C.current = function (state, status) {
    var s = state.cur ? C.session(state.cur) : null;
    if (s && s.ready && C.levelOf(s.id) === LEVEL) return s.id;
    if (status.next) return status.next.id;
    var list = C.sessions().filter(function (x) { return x.ready; });
    var days = list.filter(function (x) { return x.kind !== 'test'; });
    return days.length ? days[days.length - 1].id : list.length ? list[list.length - 1].id : null;
  };
  /* ---------- sound by unit ----------
     Each unit's clips are one file (gn-sound-a1-u03.js, made by tools/make-sound.mjs), fetched next to gn-course.js when
     the unit is first in use, so the phone never holds every unit's sound at once; the placement check (gn-sound-pl.js),
     the level exam (gn-sound-a1-x.js) and the speaking game (gn-sound-sp.js) have files of their own, fetched when their
     screen opens. A file registers its clips in window.__gnClips, which gn-sound.js plays. Only files the index lists in
     window.__gnSoundFiles (gn-sound-index.js) are asked for: until the recordings exist there are none, and every sound
     control falls back to its silent stand-in. In the app the offline worker stores a file the first time it is fetched. */
  var soundAsked = {};
  C.soundFile = function (lv, unit) { return 'gn-sound-' + prefix(lv) + '-u' + pad(unit) + '.js'; };
  /* the files of the screens outside the units: 'pl' the placement check, 'x' the level's exam, 'sp' the speaking game */
  C.soundExtra = function (what, lv) { return what === 'x' ? 'gn-sound-' + prefix(lv || LEVEL) + '-x.js' : 'gn-sound-' + what + '.js'; };
  C.needSoundFile = function (f) {
    var listed = window.__gnSoundFiles || [];
    if (!f || soundAsked[f] || listed.indexOf(f) < 0 || typeof document === 'undefined') return;
    soundAsked[f] = true;
    var base = '';
    var tags = document.getElementsByTagName('script');
    for (var i = 0; i < tags.length; i++) { var src = tags[i].getAttribute('src') || ''; if (/(^|\/)gn-course\.js$/.test(src)) base = src.replace(/gn-course\.js$/, ''); }
    var el = document.createElement('script');
    el.async = true;
    el.src = base + f;
    /* the clips arrived: a screen that is open may want to draw its controls again */
    el.onload = function () { try { document.dispatchEvent(new CustomEvent('gnsound', { detail: { file: f } })); } catch (e) {} };
    (document.head || document.body || document.documentElement).appendChild(el);
  };
  C.needSound = function (lv, unit) { C.needSoundFile(C.soundFile(lv, unit)); };
  var EXTRA_SOUND = { Placement: 'pl', PlacementResult: 'pl', LevelExam: 'x', ExamTab: 'x', Hablar: 'sp', HablarCompare: 'sp' };
  C.view = function (state) {
    C.setLevel(state.level || 'A1');
    var status = C.status(state, C.now());
    var sid = C.current(state, status);
    var session = null;
    status.plan.forEach(function (p) { if (p.id === sid) session = p; });
    var unitN = session ? session.unit : C.units().length ? C.units()[0].n : 1;
    C.needSound(LEVEL, unitN);
    /* the units the notebook will ask about, and the screens with sound of their own. A mistake of the level exam
       (a1x.4) or of the placement check (pl.3) is no unit's: its clip is in the exam's or the placement's file, which
       the notebook needs as well (pl. ids carry no level and are kept with A1, as levelOf has it) */
    (state.mistakes || []).forEach(function (m) {
      var at = C.parse(m.src);
      var x = at ? null : /^([abc][12])x\./i.exec(m.src || '');
      if (at) { if (at.level === LEVEL) C.needSound(LEVEL, at.unit); }
      else if (x) { if (x[1].toUpperCase() === LEVEL) C.needSoundFile(C.soundExtra('x', LEVEL)); }
      else if (/^pl\./.test(m.src || '') && C.levelOf(m.src) === LEVEL) C.needSoundFile(C.soundExtra('pl'));
    });
    if (EXTRA_SOUND[state.screen]) C.needSoundFile(C.soundExtra(EXTRA_SOUND[state.screen], LEVEL));
    /* the notebook shows this level's mistakes; the others wait for a return to their level */
    var mine = (state.mistakes || []).filter(function (m) { return C.levelOf(m.src) === LEVEL; });
    var sit = C.sitting(mine, state.plan, C.now());
    return {
      status: status,
      plan: state.plan,
      /* the other levels' plans, kept for a return to them (the level menu and the goal screen offer the way back) */
      plans: state.plans || {},
      sid: sid,
      session: session,
      unit: C.unit(unitN),
      day: C.day(sid),
      prog: (state.done || {})[sid] || {},
      done: state.done || {},
      tests: state.tests || {},
      exams: state.exams || {},
      exam: (state.exams || {})[LEVEL] || null,
      tp: state.tp || 0,
      set: state.set || 'day',
      mistakes: mine,
      /* the review that waits today (the tab bars' mark on Cuaderno, the week path's and the day's «para repasar»): n is
         what today's sitting asks, of the `due` that are due; size is a sitting, done what was reviewed today */
      review: { n: sit.n, due: sit.due, size: sit.size, done: sit.done, minutes: sit.minutes },
      /* the days with study: the last seven, the counts, and whether the learner is back after days away (C.days) */
      seen: state.seen || [],
      days: C.days(state.seen, C.now()),
      typed: state.typed || [],
      placement: state.placement || null,
      /* what the goal screen asked (why, where, the two self-ratings) and the weekly "lo usé" log, kept as given */
      profile: state.profile || null,
      exposure: state.exposure || null,
      level: LEVEL,
      meta: C.meta(LEVEL),
      levels: C.levels(),
      progress: C.progress(state, LEVEL)
    };
  };
  /* the practice sections outside the plan of days: they record nothing of their own, so opening one is what marks the
     day as a day with study */
  var PRACTICE = { Leer: 1, Escribir: 1, Hablar: 1 };
  /* today added to the days with study, as a change to merge into the state (nothing when today is there already) */
  function sawToday(st, out) {
    var seen = C.sawDay(st.seen, C.now());
    if (seen !== st.seen) out.seen = seen;
    return out;
  }
  C.handlers = function (get, set) {
    return {
      go: function (to) {
        set(function (st) {
          var out = { screen: to, started: st.started || to !== 'Goal' };
          return PRACTICE[to] ? sawToday(st, out) : out;
        });
      },
      /* change level: this level's plan is put aside and the other level's comes back (or its goal screen, the first time) */
      level: function (lv) {
        set(function (st) {
          var was = st.level || 'A1';
          if (lv === was) return { screen: st.plan ? 'Main' : 'Goal' };
          var plans = Object.assign({}, st.plans || {});
          plans[was] = st.plan;
          var back = plans[lv] || null;
          return { level: lv, plans: plans, plan: back, cur: null, tp: 0, screen: back ? 'Main' : 'Goal' };
        });
      },
      save: function (patch) {
        set(function (st) {
          C.setLevel(st.level || 'A1');
          var out = {};
          Object.keys(patch).forEach(function (k) { if (k !== 'prog' && k !== 'result' && k !== 'typed' && k !== 'exam') out[k] = patch[k]; });
          /* words spelled are added to what is kept, never put in its place */
          if (patch.typed) out.typed = C.addTyped(st.typed, patch.typed);
          /* the goal screen can set a new level: the old level's plan is kept for a return */
          if (patch.level && patch.level !== (st.level || 'A1')) {
            var plans = Object.assign({}, st.plans || {});
            plans[st.level || 'A1'] = st.plan;
            out.plans = plans;
            C.setLevel(patch.level);
          }
          var sid = patch.prog ? C.current(st, C.status(st, C.now())) : null;
          if (patch.prog && sid) {
            var done = Object.assign({}, st.done || {});
            var had = done[sid] || {};
            var next = Object.assign({}, had);
            /* steps only ever move forward: going back over a lesson never undoes it */
            Object.keys(patch.prog).forEach(function (k) { next[k] = Math.max(had[k] || 0, patch.prog[k]); });
            done[sid] = next;
            out.done = done;
          }
          if (patch.result) {
            var tests = Object.assign({}, st.tests || {});
            tests[patch.result.id] = patch.result;
            out.tests = tests;
            /* the waiver: with the placement's profile and 80 % or more, the unit's comprehension lessons count as done */
            if (C.waives(st.placement, patch.result.score, patch.result.of)) {
              var credited = Object.assign({}, out.done || st.done || {});
              C.waived(patch.result.id).forEach(function (id) {
                var was2 = credited[id] || {};
                credited[id] = Object.assign({}, was2, { r: Math.max(was2.r || 0, 1) });
              });
              out.done = credited;
            }
          }
          /* a level exam result is kept per level; a better result never gives way to a worse one */
          if (patch.exam) {
            var exams = Object.assign({}, st.exams || {});
            var lv = patch.exam.level || st.level || 'A1';
            var had2 = exams[lv];
            if (!had2 || !had2.apto || patch.exam.apto) exams[lv] = patch.exam;
            out.exams = exams;
          }
          /* a lesson step, a test, words typed or a part of the level exam handed in (not the tab's «Otra vez», which
             only marks the result it already has): today is a day with study */
          var handedIn = !!patch.exam && (!(st.exams || {})[patch.exam.level || st.level || 'A1'] || (st.exams || {})[patch.exam.level || st.level || 'A1'].at !== patch.exam.at);
          if ((patch.prog && sid) || patch.result || patch.typed || handedIn) sawToday(st, out);
          return out;
        });
      },
      miss: function (m) { set(function (st) { return sawToday(st, { mistakes: C.miss(st.mistakes, m, C.now()) }); }); },
      reviewed: function (src, right) { set(function (st) { return sawToday(st, { mistakes: C.reviewed(st.mistakes, src, right, C.now()) }); }); }
    };
  };

  C.STEPS = STEPS;
  C.DAYS_PER_UNIT = DAYS_PER_UNIT;
  C.EXAM_WEEK = EXAM_WEEK;

  /* the area of an item, its Spanish name and the colours of its tag (week test results are kept by area) */
  var AREAS = {
    vocab: { key: 'vocab', es: 'Palabras', tagBg: '#FCE4EF', tagColor: '#A3134F' },
    grammar: { key: 'grammar', es: 'Gramática', tagBg: '#E8ECFB', tagColor: '#2F4FD0' },
    reading: { key: 'reading', es: 'Lectura', tagBg: '#FFF4D6', tagColor: '#1B2440' },
    listening: { key: 'listening', es: 'Escucha', tagBg: '#E0F3EF', tagColor: '#0B7A6B' },
    mediation: { key: 'mediation', es: 'Mediación', tagBg: '#EEF0F6', tagColor: '#1B2440' },
    sound: { key: 'sound', es: 'Sonido y letra', tagBg: '#FCE4EF', tagColor: '#A3134F' }
  };
  C.area = function (key) { return AREAS[key] || AREAS.grammar; };
  C.AREAS = ['vocab', 'grammar', 'reading', 'listening', 'mediation'];

  /* ---------- the mini exams ----------
     Each level has two (the Examen tab): the first after the first half of its units, the second after the second half.
     A mini exam needs no writing of its own: it is 20 of its units' week-test questions, by area as a week test (6
     Palabras, 8 Gramática, 3 Lectura, 3 Escucha), dealt in turn from each unit so that every unit gives as many (5 each
     for 4 units), and from each unit's questions of an area the ones spread evenly through its list. Always the same
     20: a result can be compared with the one before. It is ready once every one of its units has its week test
     written; the Examen tab opens it when the last of those tests is done, the exam-style runner asks it (set 'mini1',
     'mini2') and its result is kept with the tests, at tests[id] (a1m1, a1m2).
     → [{ n, id, units: [unit numbers], after: the last of them, ready, items: [item ids], seconds }] */
  var MINI_SHAPE = [['vocab', 6], ['grammar', 8], ['reading', 3], ['listening', 3]];
  var MINI_SECONDS = 1200;
  C.minis = function (lv) {
    return C.withLevel(lv || LEVEL, function () {
      var us = C.units();
      var mid = Math.max(1, Math.ceil(us.length / 2));
      return [1, 2].map(function (n) {
        var units = us.filter(function (u, k) { return n === 1 ? k < mid : k >= mid; });
        var ready = units.length > 0 && units.every(function (u) { return !!(u.test && u.test.length); });
        var items = [];
        if (ready) {
          var pools = units.map(function (u) {
            var by = {};
            u.test.forEach(function (id) { var it = C.item(id); if (it) { var a = C.area(it.area).key; (by[a] = by[a] || []).push(id); } });
            return by;
          });
          var turn = 0;
          MINI_SHAPE.forEach(function (shape) {
            var area = shape[0];
            var give = units.map(function () { return 0; });
            for (var c = 0, tries = 0; c < shape[1] && tries < shape[1] * units.length * 2; tries++) {
              var k = turn++ % units.length;
              if ((pools[k][area] || []).length > give[k]) { give[k]++; c++; }
            }
            units.forEach(function (u, k2) {
              var pool = pools[k2][area] || [];
              for (var i = 0; i < give[k2]; i++) items.push(pool[Math.min(pool.length - 1, Math.floor(((i + 0.5) * pool.length) / give[k2]))]);
            });
          });
        }
        return { n: n, id: prefix(LEVEL) + 'm' + n, units: units.map(function (u) { return u.n; }), after: units.length ? units[units.length - 1].n : 0, ready: ready && items.length > 0, items: items, seconds: MINI_SECONDS };
      });
    });
  };
  /* a mini exam by its id (a1m1) or by the runner's set name (mini1, at the current level), or null */
  C.mini = function (key) {
    var m = /^([abc][12])m([12])$/i.exec(key || '');
    var s = m ? null : /^mini([12])$/.exec(key || '');
    if (!m && !s) return null;
    return C.minis(m ? m[1].toUpperCase() : LEVEL)[+(m ? m[2] : s[1]) - 1] || null;
  };

  /* ---------- the level's ñandutí ----------
     Each level is a ñandutí (the lace rosette of Itauguá) that Kaguare, the southern tamandua, wears pinned to his
     black vest. Before the goal it is only its frame, quiet and unwoven: the radial threads (the warp) stretched inside
     the dashed outer circle, the petals white. Setting the goal weaves the first thread ("Tejé el primer hilo"): the
     hub, and with it the cross-thread ring the petal tips are tied to. Every unit finished fills one petal between two
     threads. Passing the level exam weaves the scalloped rim: the rosette is whole.
     The shapes come back as path strings for an SVG with viewBox "-24 -24 48 48", so every screen draws the same thing
     (the recipe in BRIEF-design.md §3): <path d={rimD}> (shown when rim), <path d={off}> (petals still to do),
     <path d={on}> (petals done), <path d={spokes}>, <circle r="4"> (the hub, filled when hub). n = the level's units,
     done = units finished.
     The drawing ("arasape", the Itauguá sun): one radial thread per unit, from under the hub to the frame (r 19.3); a
     cross-thread ring (r 15.4) that the petal tips are tied to, part of the first thread woven (while hub is false and
     no unit is done, spokes holds the radial threads alone); one petal per unit between two threads, a pointed lace
     leaf (r 6.8 to 14.8, 37 % of its sector wide) with a midrib along its axis; the rim, round scallops bulging out from
     the frame to r 21.3, about a dozen around: round(13 / n) per unit (two per unit up to 8 units, one from 9 up: 16 for
     8, 12 for 6 or 12, 10 for 10, 9 for the games' stage ring).
     The games (Hablar, Escribir) stroke only spokes and rimD around a white disc r 15 (stroke 2.5), so between r 16.25
     and the frame the spokes string must hold nothing but the radial threads (the ring sits under the disc) and the rim
     must stay a bold flower of one scallop per unit there, or the stamp turns into a cog.
     Two things the boards impose on the strings. The spokes path is stroked with no fill attribute, so nothing in it
     may enclose an area (a closed shape there would fill black): the threads are lines and the ring is a circle traced
     out and back in quarter arcs (the stroke of a path's self-overlap reads as one line). An open subpath inside a petal
     adds stroke only, never fill: that is how the midrib is drawn, in the petal's own stroke colour.
     Painted extent, stroke included: r 20.0 before the pass (the frame circle), r 22.0 whole for any unit count (the
     scallops all reach r 21.3), inside the brooch discs (the mascot's 9.4 / 0.42 = 22.4; the icon's 8.0 / 0.345 = 23.2,
     where the whole rosette is baked: Icon.dc.html, Rules.dc.html and brief/mascot carry these strings literally). */
  C.rosette = function (n, done, opts) {
    opts = opts || {};
    var N = Math.max(3, n || 8), D = Math.min(N, done || 0), TAU = 2 * Math.PI;
    var R_RING = 15.4;                           /* the cross-thread ring the petal tips are tied to (under the games' disc) */
    var R_EDGE = 19.3;                           /* the frame: the threads end there and the scallops meet there */
    var R_OUT = 21.3;                            /* how far the scallops reach at their middle */
    var R_BASE = 6.8, R_TIP = 14.8, X_W = 10.8;  /* the petal: base, tip and widest point along its axis */
    var L = R_TIP - R_BASE;                      /* the petal's length */
    var M = Math.max(1, Math.round(13 / N));     /* scallops per unit: about a dozen around, one per unit from 9 units up */
    var hw = Math.min(4.4, 2 * X_W * Math.sin(Math.PI / N) * 0.37); /* the petal's half-width: 37 % of the sector */
    function f(x) { return String(Math.round(x * 100) / 100); }
    function pt(r, a) { return f(r * Math.cos(a)) + ' ' + f(r * Math.sin(a)); }
    function ring(r) { /* a circle traced clockwise and back in quarter arcs: stroked, never filled */
      var p = f(r), m = f(-r), A = 'A' + p + ' ' + p + ' 0 0 ';
      return 'M' + p + ' 0' + A + '1 0 ' + p + A + '1 ' + m + ' 0' + A + '1 0 ' + m + A + '1 ' + p + ' 0' +
        A + '0 0 ' + m + A + '0 ' + m + ' 0' + A + '0 0 ' + p + A + '0 ' + p + ' 0';
    }
    var bare = opts.hub === false && D === 0;    /* nothing woven yet: the warp alone, without the cross-thread ring */
    var on = '', off = '', spokes = bare ? '' : ring(R_RING), rim = '';
    for (var k = 0; k < N; k++) {
      var a0 = -Math.PI / 2 + (k * TAU) / N, a1 = a0 + TAU / N, am = a0 + Math.PI / N;
      var ca = Math.cos(am), sa = Math.sin(am);
      var lp = function (x, y) { return f(x * ca - y * sa) + ' ' + f(x * sa + y * ca); }; /* petal coordinates: x out along its axis, y across */
      /* the petal: a pointed leaf along the sector's middle, then its midrib as an open subpath */
      var d = 'M' + lp(R_BASE, 0) +
        'C' + lp(R_BASE + 0.17 * L, hw * 0.6) + ' ' + lp(X_W - 0.22 * L, hw) + ' ' + lp(X_W, hw) +
        'C' + lp(X_W + 0.25 * L, hw) + ' ' + lp(R_TIP - 0.21 * L, hw * 0.38) + ' ' + lp(R_TIP, 0) +
        'C' + lp(R_TIP - 0.21 * L, -hw * 0.38) + ' ' + lp(X_W + 0.25 * L, -hw) + ' ' + lp(X_W, -hw) +
        'C' + lp(X_W - 0.22 * L, -hw) + ' ' + lp(R_BASE + 0.17 * L, -hw * 0.6) + ' ' + lp(R_BASE, 0) + 'Z' +
        'M' + pt(R_BASE + 0.25 * L, am) + 'L' + pt(R_BASE + 0.75 * L, am);
      if (k < D) on += d; else off += d;
      spokes += 'M' + pt(3.4, a0) + 'L' + pt(R_EDGE, a0); /* the radial thread, from under the hub to the frame */
      for (var j = 0; j < M; j++) { /* the rim: M round scallops per unit, from the frame out to R_OUT */
        var b0 = a0 + (j * (a1 - a0)) / M, b1 = a0 + ((j + 1) * (a1 - a0)) / M, half = (b1 - b0) / 2;
        var c = 2 * R_EDGE * Math.sin(half);                         /* the scallop's chord */
        var s = Math.min(R_OUT - R_EDGE * Math.cos(half), 0.36 * c); /* its height: to R_OUT, at most 0.36 of the chord */
        var sr = f((s * s + (c * c) / 4) / (2 * s));                 /* the arc's radius */
        rim += (k === 0 && j === 0 ? 'M' + pt(R_EDGE, b0) : '') + 'A' + sr + ' ' + sr + ' 0 0 1 ' + pt(R_EDGE, b1);
      }
    }
    return {
      view: '-24 -24 48 48',
      on: on || 'M0 0',
      off: off || 'M0 0',
      spokes: spokes,
      rimD: rim + 'Z',
      hub: opts.hub !== false,
      rim: !!opts.rim,
      count: N,
      done: D
    };
  };

  /* ---------- dates ----------
     Spanish from the browser (Intl knows it); Guarani from the table below, since browsers carry no Guarani calendar
     names. The table is filled by the build from the verified microcopy (content/microcopy.json); until then it is empty
     and dates show in Spanish only. */
  C.dateEs = function (isoDate, withYear) {
    var n = dayNo(isoDate);
    if (n == null) return '';
    var d = new Date(n * DAY);
    try {
      return new Intl.DateTimeFormat('es', withYear === false ? { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' } : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
    } catch (e) {
      return isoDate;
    }
  };
  C.dateGn = function (isoDate) {
    var t = window.__gnCalendar;
    var n = dayNo(isoDate);
    if (!t || n == null) return '';
    var d = new Date(n * DAY);
    var wd = t.days && t.days[d.getUTCDay()];
    var mo = t.months && t.months[d.getUTCMonth()];
    return wd && mo ? wd + ', ' + d.getUTCDate() + ' ' + mo : '';
  };
})();
