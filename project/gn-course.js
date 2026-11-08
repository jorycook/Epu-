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
     settings: { start: 'YYYY-MM-DD', target: 'YYYY-MM-DD' | null, pace: 'fit' | 'steady', minutes: 15 | 30 | 45 }
     no target:  one session a day, at the learner's own pace
     fit:        every session fits before the target, with the last week kept for review and the level exam; days double up when time is short
     steady:     one session a day, whatever the target */
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
  C.plan = function (settings) {
    var list = C.sessions();
    var n = list.length;
    var start = dayNo(settings && settings.start) || dayNo(C.today(C.now()));
    var target = dayNo(targetOf(settings));
    var room = target != null ? target - start - EXAM_WEEK : n;
    if (target != null && room < 1) room = Math.max(1, target - start);
    var squeeze = target != null && settings && settings.pace !== 'steady' && room < n;
    return list.map(function (s, k) {
      var at = squeeze ? start + Math.floor((k * room) / n) : start + k;
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
    if (plan.length > 1) {
      var span = C.daysBetween(plan[0].date, plan[plan.length - 1].date) + 1;
      perDay = Math.max(1, Math.round(plan.length / Math.max(1, span)));
    }
    var target = targetOf(state.plan);
    var left = target ? C.daysBetween(today, target) : null;
    var stamps = plan.filter(function (s) { return C.complete(state, s); }).length;
    var behind = next && next.date < today ? C.daysBetween(next.date, today) : 0;
    return { plan: plan, next: next, dueToday: dueToday, perDay: perDay, daysLeft: left, stamps: stamps, today: today, behind: behind, target: target };
  };
  /* can the whole level be done one session a day before the target? */
  C.fits = function (settings) {
    var target = targetOf(settings);
    if (!target) return true;
    var room = C.daysBetween((settings && settings.start) || C.today(C.now()), target) - EXAM_WEEK;
    return room >= C.sessions().length;
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
    return { screen: 'Goal', started: false, level: null, plans: {}, plan: null, cur: null, done: {}, tests: {}, exams: {}, mistakes: [], tp: 0, set: 'day', placement: null, typed: [] };
  };
  /* words the learner has spelled right with the Guarani keyboard: kept for all levels at once, only ever growing */
  C.addTyped = function (had, add) {
    var out = Array.isArray(had) ? had.slice() : [];
    (Array.isArray(add) ? add : [add]).forEach(function (w) { var t = C.norm(w); if (t && out.indexOf(t) < 0) out.push(t); });
    return out;
  };
  /* the session a screen works on: the one picked on the week path, else the next one due */
  C.current = function (state, status) {
    var s = state.cur ? C.session(state.cur) : null;
    if (s && s.ready && C.levelOf(s.id) === LEVEL) return s.id;
    if (status.next) return status.next.id;
    var list = C.sessions().filter(function (x) { return x.ready; });
    return list.length ? list[0].id : null;
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
    /* the units the notebook will ask about, and the screens with sound of their own */
    (state.mistakes || []).forEach(function (m) { var at = C.parse(m.src); if (at && at.level === LEVEL) C.needSound(LEVEL, at.unit); });
    if (EXTRA_SOUND[state.screen]) C.needSoundFile(C.soundExtra(EXTRA_SOUND[state.screen], LEVEL));
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
      /* the notebook shows this level's mistakes; the others wait for a return to their level */
      mistakes: (state.mistakes || []).filter(function (m) { return C.levelOf(m.src) === LEVEL; }),
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
  C.handlers = function (get, set) {
    return {
      go: function (to) { set(function (st) { return { screen: to, started: st.started || to !== 'Goal' }; }); },
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
          return out;
        });
      },
      miss: function (m) { set(function (st) { return { mistakes: C.miss(st.mistakes, m, C.now()) }; }); },
      reviewed: function (src, right) { set(function (st) { return { mistakes: C.reviewed(st.mistakes, src, right, C.now()) }; }); }
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

  /* ---------- the level's ñandutí ----------
     Each level is a ñandutí (the lace rosette of Itauguá) that Kaguare, the southern tamandua, wears pinned to his
     black vest. Before the goal it is only its frame: a sun of radial threads with one cross-thread ring, the petals
     white, and a dashed rim. Setting the goal weaves the hub (the first thread). Every unit finished fills one petal
     between two threads. Passing the level exam weaves the scalloped rim: the rosette is whole.
     The shapes come back as path strings for an SVG with viewBox "-24 -24 48 48", so every screen draws the same thing
     (the recipe in BRIEF-design.md §3): <path d={rimD}> (shown when rim), <path d={off}> (petals still to do),
     <path d={on}> (petals done), <path d={spokes}>, <circle r="4"> (the hub, filled when hub). n = the level's units,
     done = units finished.
     The drawing ("arasape", the Itauguá sun): one radial thread per unit, from under the hub to the frame (r 19.3); a
     cross-thread ring (r 15.4) that the petal tips are tied to; one petal per unit between two threads, a pointed lace
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
     scallops all reach r 21.3), inside the brooch discs (the mascot's 9.4 / 0.42 = 22.4; the icon's 8.0 / 0.36 = 22.2). */
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
    var on = '', off = '', spokes = ring(R_RING), rim = '';
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
