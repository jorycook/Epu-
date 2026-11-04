/* Guarani spelling: the letters of the achegety and how a typed letter differs from the one wanted.
 * Pure functions, no screen: the spelling pad (Spell.dc.html), the words lesson and the typing game read them.
 * A word is split into the letters a Guarani reader sees: the digraphs ch mb nd ng nt rr and g̃ are one letter each,
 * a vowel with its tilde or accent is one letter, the puso ' is a letter. */
(function () {
  var S = window.gnSpell = window.gnSpell || {};
  var DIGRAPHS = ['mb', 'nd', 'ng', 'nt', 'ch', 'rr'];
  var NASAL = 'ãẽĩõũỹ';
  var ACUTE = 'áéíóúý';
  var PLAIN_OF = { 'ã': 'a', 'ẽ': 'e', 'ĩ': 'i', 'õ': 'o', 'ũ': 'u', 'ỹ': 'y', 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y' };
  var NASAL_OF = { a: 'ã', e: 'ẽ', i: 'ĩ', o: 'õ', u: 'ũ', y: 'ỹ' };
  var ACUTE_OF = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý' };
  var GN = 'g̃';
  /* the alphabet in the Academy's order, with the names the keys say (Spanish speakers read them aloud) */
  S.ALPHABET = ['a', 'ã', 'ch', 'e', 'ẽ', 'g', GN, 'h', 'i', 'ĩ', 'j', 'k', 'l', 'm', 'mb', 'n', 'nd', 'ng', 'nt', 'ñ', 'o', 'õ', 'p', 'r', 'rr', 's', 't', 'u', 'ũ', 'v', 'y', 'ỹ', "'"];
  function norm(s) {
    var t = String(s == null ? '' : s);
    if (t.normalize) t = t.normalize('NFC');
    return t.replace(/[’‘ʼ´`]/g, "'");
  }
  S.norm = norm;
  /* the letters of a word, longest match first: "mbo'ehára" → mb·o·'·e·h·á·r·a */
  S.cells = function (word) {
    var t = norm(word);
    var out = [];
    var i = 0;
    while (i < t.length) {
      var two = t.slice(i, i + 2);
      var low = two.toLowerCase();
      if (low === GN || (low.charAt(0) === 'g' && t.charAt(i + 1) === '̃')) { out.push(t.slice(i, i + 2)); i += 2; continue; }
      if (DIGRAPHS.indexOf(low) >= 0) { out.push(two); i += 2; continue; }
      var c = t.charAt(i);
      var j = i + 1;
      while (j < t.length && /[̀-ͯ]/.test(t.charAt(j))) j++;
      out.push(t.slice(i, j));
      i = j;
    }
    return out;
  };
  /* what kind of letter it is, for the pad's colours and for choosing what the learner types */
  S.kind = function (g) {
    var c = norm(g).toLowerCase();
    if (c === "'") return 'puso';
    if (c === ' ') return 'space';
    if (NASAL.indexOf(c) >= 0 || c === GN) return 'nasal';
    if (ACUTE.indexOf(c) >= 0) return 'stress';
    if (DIGRAPHS.indexOf(c) >= 0) return 'digraph';
    if (c === 'y' || c === 'k' || c === 'h' || c === 'j') return 'special';
    if (/[.,;:!?¿¡\-]/.test(c)) return 'mark';
    return 'plain';
  };
  /* is this a letter Spanish spells differently or lacks, the ones the pad asks the learner to type? */
  S.hard = function (g) { var k = S.kind(g); return k === 'nasal' || k === 'stress' || k === 'puso' || k === 'digraph' || k === 'special'; };
  /* the keys that are easy to mix up with a letter (Spanish interference): shown beside the right key */
  S.confusers = function (g) {
    var c = norm(g).toLowerCase();
    var base = PLAIN_OF[c] || c;
    if ('aeiouy'.indexOf(base) >= 0 && base.length === 1) {
      var set = [base, NASAL_OF[base], ACUTE_OF[base]];
      if (base === 'y') set.push('i', 'u');
      return set.filter(function (x) { return x !== c; });
    }
    var map = { 'g': [GN], 'mb': ['m', 'b'], 'nd': ['n', 'd'], 'ng': ['n', 'g'], 'nt': ['n', 't'], 'rr': ['r'], 'r': ['rr'], 'k': ['c', 'qu'], 'h': ['j'], 'j': ['y', 'll'], 'ch': ['sh', 'y'], "'": [] };
    map[GN] = ['g', 'ng'];
    return map[c] || [];
  };
  /* compare one typed letter with the wanted one and say why it is off */
  S.judge = function (typed, want) {
    var a = norm(typed).toLowerCase(), b = norm(want).toLowerCase();
    if (a === b) return { ok: true, why: '' };
    var pa = PLAIN_OF[a] || a, pb = PLAIN_OF[b] || b;
    if (pa === pb) {
      if (NASAL.indexOf(b) >= 0) return { ok: false, why: 'nasal-missing' };
      if (NASAL.indexOf(a) >= 0) return { ok: false, why: 'nasal-extra' };
      if (ACUTE.indexOf(b) >= 0) return { ok: false, why: 'stress-missing' };
      if (ACUTE.indexOf(a) >= 0) return { ok: false, why: 'stress-extra' };
    }
    if (b === GN && a === 'g') return { ok: false, why: 'gn-missing' };
    if (b === "'") return { ok: false, why: 'puso-missing' };
    if (a === "'") return { ok: false, why: 'puso-extra' };
    if (DIGRAPHS.indexOf(b) >= 0 && b.indexOf(a) >= 0) return { ok: false, why: 'digraph' };
    if (b === 'k' && (a === 'c' || a === 'qu')) return { ok: false, why: 'k' };
    if (b === 'y' && (a === 'i' || a === 'u')) return { ok: false, why: 'y' };
    if (b === 'h' && a === 'j') return { ok: false, why: 'h' };
    return { ok: false, why: 'other' };
  };
  /* what the line under the pad says for each reason (Spanish, voseo) */
  S.note = function (why, want) {
    var w = norm(want);
    switch (why) {
      case 'nasal-missing': return 'Esta vocal es nasal: lleva tilde (' + w + ').';
      case 'nasal-extra': return 'Esta vocal no es nasal: va sin tilde.';
      case 'stress-missing': return 'Esta sílaba lleva el acento: ' + w + '.';
      case 'stress-extra': return 'El acento no va en esta sílaba.';
      case 'gn-missing': return 'Es g̃, la g nasal: con tilde.';
      case 'puso-missing': return 'Acá va el puso (\'), el corte de la voz.';
      case 'puso-extra': return 'Acá no hay puso.';
      case 'digraph': return w + ' es una sola letra: tocá ' + w + '.';
      case 'k': return 'En guaraní no se usa c ni qu: se escribe k.';
      case 'y': return 'Es y, la vocal guaraní (no es i ni u).';
      case 'h': return 'En guaraní la h suena como la j del castellano: se escribe h.';
      default: return 'Esa no. Probá otra vez.';
    }
  };
  /* the Spanish name a key says to a screen reader */
  S.name = function (g) {
    var c = norm(g).toLowerCase();
    var names = { 'ã': 'a nasal', 'ẽ': 'e nasal', 'ĩ': 'i nasal', 'õ': 'o nasal', 'ũ': 'u nasal', 'ỹ': 'y nasal', 'á': 'a con acento', 'é': 'e con acento', 'í': 'i con acento', 'ó': 'o con acento', 'ú': 'u con acento', 'ý': 'y con acento', "'": 'puso', 'ch': 'che', 'mb': 'mbe', 'nd': 'nde', 'ng': 'nge', 'nt': 'nte', 'rr': 'rre', 'ñ': 'eñe', 'y': 'y, vocal guaraní' };
    names[GN] = 'g nasal';
    return names[c] || c;
  };
  /* a stable shuffle (the same order every time for the same item), so keys do not jump between renders */
  S.shuffle = function (list, seed) {
    var out = list.slice();
    var h = 2166136261;
    var s = String(seed || '');
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    for (var k = out.length - 1; k > 0; k--) {
      h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
      var j = h % (k + 1);
      var tmp = out[k]; out[k] = out[j]; out[j] = tmp;
    }
    return out;
  };
  /* the keys for one word: its hard letters, each with its confusers, without repeats, in a stable order */
  S.keys = function (word, seed) {
    var keys = [];
    S.cells(word).forEach(function (g) {
      if (!S.hard(g)) return;
      var low = norm(g).toLowerCase();
      [low].concat(S.confusers(low)).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
    });
    return S.shuffle(keys, seed || word);
  };
})();
