#!/usr/bin/env python3
"""The ear's test on what ships: every clip of the app's sound files, decoded from its MP3 and heard by the recognisers.

tools/make-tts.py --verify judges a take, the FLAC in the takes' folder. The learner hears something else: the take
trimmed, levelled, given its air and encoded as MP3 at 32 kb/s by tools/make-sound.mjs. A review found four short clips
whose takes had passed and whose MP3 both recognisers heard with wrong letters (sound/VOICE.md, «The ear's test on what
ships»). So this tool reads the sound files themselves (project/gn-sound-*.js), decodes every clip, cuts a clip that is
put together from lines at its cues, and has both recognisers of make-tts.py hear every line three ways:

  padded    the clip as it ships, with the 150 ms of silence the recogniser is given round a take (--verify's hearing);
  trimmed   the clip without its air (cut where it rises over -45 dBFS, 10 ms kept), with the same 150 ms;
  bare      the clip as it ships and nothing round it: what the phone plays.

Three, because a recogniser's writing of a short clip moves with the silence round it, and that says nothing about
the clip. A verdict needs two hearings of the three: a line is HEARD WRONG when, in two hearings or more, every
recogniser writes letters that are not the line's (make-tts.py's `letters`: acutes, tildes and spaces aside).

What is done with that (sound/VOICE.md has the reasons):
  short    a Guarani clip of one or two words that a learner hears on its own (a scene word, the word of a pair that
           plays, a short example, a sign of Hablar) and that is heard wrong: the rule --verify applies to the take.
  word     a line that holds a word the voice must not say alone (sound/silent.json: "texts" and "words"), when in two
           hearings or more every recogniser writes that very word with wrong letters: the app does not say inside a
           sentence a word it will not say alone.
  form     a Teach example whose point is one letter or one small word (sound/silent.json: "forms" names, for its key,
           the line as its lesson says it must NOT be said, "not", and the words whose stress its lesson marks with an
           acute, "acute"): when in two hearings or more every recogniser's writing is nearer to a wrong line than to
           the line itself (form), or no recogniser writes the acute of a marked word (stress).
A clip that fails is said again with other seeds, by make-tts.py's own code and in a copy of the takes' folder, each
new take made into its MP3 by make-sound.mjs and heard the same three ways. A take passes when it passes --verify,
its MP3 fails none of the rules, and its lines are not heard worse as a whole than those of the take it replaces
(the letters each recogniser writes in each hearing, added up: a take that mends the word a rule looks at and spoils
another is no gain). Up to --tries seeds (12) are tried, the key's own first, each with the cut of the take it
replaces and with the slow take of its line, which is said again with the same seed and judged afresh wherever it
waits; the search ends at the first passing take that every recogniser hears right in every place the rules look
at, and otherwise the passing take with the fewest wrong hearings there is kept (among equals, the one whose lines
are written with the fewest letters off, then the first seed). It replaces the old one in the folder, as `make-tts.py
--only <key> --redo --seed <7919 n> --tries 1 --verify` writes it. If none passes, the clip is silenced: its key goes
into sound/silent.json's "keys", with the reason, what was heard and what each seed gave, the other word of its pair
with it, and make-tts.py then moves the take to left-out/ for a listener. One kind of line is never silenced here: a
line of a listening item (a lesson's, the placement's, the exam's). Silencing it takes the whole item's audio, which
is a person's decision (name the line under "keys"); until then it stays, and is listed.
sound/silent.json's "keep" frees a key from all of this once a person has heard the clip and found it right.
Every other line that is heard wrong stays as it is and is listed for the native listener (--list).

usage:  python3 tools/hear-sound.py <takes folder> [--project project] [--tries 12]     hear, say again, silence, rebuild
        python3 tools/hear-sound.py <takes folder> --check        hear and judge only: nothing is said, written or silenced; exit 1 if a clip fails
                                                                  (--save keeps what was heard in the record all the same)
        python3 tools/hear-sound.py <takes folder> --list         the lines every recogniser hears wrong in one hearing or more, as the table of
                                                                  sound/VOICE.md (from the record; no model)
The documented line calls it last, after make-sound.mjs (sound/VOICE.md, «How to make the clips again»).

What was heard is kept in <takes folder>/mp3-heard.json, one row a line, under the checksum of the MP3 it was heard
in: a run on sound files whose clips did not change hears nothing, loads no model and writes nothing.
"""
import argparse
import base64
import datetime
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location('make_tts', os.path.join(HERE, 'make-tts.py'))
tts = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tts)

HEARINGS = ('padded', 'trimmed', 'bare')
NEEDED = 2          # hearings of the three in which every recogniser must be wrong for a verdict
TRIES = 12          # seeds tried for a clip that fails, the take it has among them
GAP = 250           # ms between the lines of a put-together clip (tools/make-sound.mjs)
CLIP = re.compile(r"^c\['((?:[^'\\]|\\.)+)'\] = \{ ms: (\d+), kind: '(\w+)', voice: '([^']*)'(?:, cues: \[([\d, ]*)\])?, b: '([A-Za-z0-9+/=]+)' \};$", re.M)
ALIAS = re.compile(r"^c\['((?:[^'\\]|\\.)+)'\] = c\['((?:[^'\\]|\\.)+)'\];$", re.M)
ITEM = re.compile(r'(?:\.r\d+|^pl\.\d+|^[abc][12]x\.\d+)(?:\.slow)?$')          # a listening item: a lesson's, the placement's, the exam's
RECORD = 'mp3-heard.json'


# ---------- the sound files ----------
def sound_files(project):
    """every clip of the app's sound files → ({key: {'ms', 'cues', 'b', 'file', 'sha'}}, {key: the key it points at})"""
    clips, alias = {}, {}
    for f in sorted(os.listdir(project)):
        if not re.match(r'^gn-sound-(?:[abc][12]-(?:u\d\d|x)|pl|sp)\.js$', f):
            continue
        with open(os.path.join(project, f), encoding='utf-8') as fh:
            text = fh.read()
        for m in CLIP.finditer(text):
            key = m.group(1).replace("\\'", "'").replace('\\\\', '\\')
            clips[key] = {'ms': int(m.group(2)), 'cues': [int(c) for c in m.group(5).split(',')] if m.group(5) else None, 'b': m.group(6),
                          'file': f, 'sha': hashlib.sha1(base64.b64decode(m.group(6))).hexdigest()}
        for m in ALIAS.finditer(text):
            alias[m.group(1).replace("\\'", "'")] = m.group(2).replace("\\'", "'")
    return clips, alias


def decode(b64):
    """a clip's MP3 → its samples at the recognisers' rate (16 kHz, mono), as ffmpeg decodes it"""
    np = tts.np_()
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'mp3', '-i', 'pipe:0', '-ac', '1', '-ar', str(tts.RATE), '-f', 'f32le', '-'], input=base64.b64decode(b64), capture_output=True)
    if r.returncode:
        raise RuntimeError('ffmpeg could not decode a clip: ' + r.stderr.decode('utf-8', 'replace').strip().split('\n')[-1])
    return np.frombuffer(r.stdout, dtype='<f4').copy()


def trimmed(x):
    """a clip without its air: from its first sample over -45 dBFS to its last, 10 ms kept at either end"""
    np = tts.np_()
    idx = np.nonzero(np.abs(x) > 10 ** (-45 / 20))[0]
    keep = int(0.01 * tts.RATE)
    return x[max(0, idx[0] - keep): idx[-1] + keep] if len(idx) else x


# ---------- the lines ----------
def kind_of(key, line):
    """what a clip is to the learner: 'item' (a listening item), 'dialogue' (a Teach example with several speakers),
    'example' (a Teach example of one line), 'word' (a scene word, a word of a pair, a pair or a sign of Hablar)"""
    if ITEM.search(key):
        return 'item'
    if line is not None:
        return 'dialogue'
    return 'example' if re.search(r'\.p\d+\.x\d+$', key) else 'word'


def lines_of(manifest, clips, alias, respell):
    """Every line as it ships → [{'id', 'key', 'line', 'recording', 'keys', 'voice', 'lang', 'text', 'said', 'short', 'kind',
    'sha', 'from', 'to'}], in the list's order: a clip of one recording whole, a clip put together from lines one row a
    line (cut at the cues). The same audio under several keys (a word of two scenes, a file's own copy) is one row,
    `keys` naming them all."""
    rows = manifest.get('clips', [])
    by_key = {r['key']: r for r in rows}
    out, seen = [], {}
    for r in rows:
        key = r['key']
        c = clips.get(key) or clips.get(alias.get(key, ''))
        if c is None or r.get('tone'):
            continue
        if r.get('parts'):
            cues = c['cues'] or []
            if len(cues) != len(r['parts']):
                raise SystemExit(f'{key}: {len(cues)} cues in {c["file"]} for {len(r["parts"])} lines in the list: make the sound files again')
            base = key[:-len('.slow')] if key.endswith('.slow') else key
            # a line's own row is <clip>.l<n> (<clip>.l<n>.slow in a slower version), whichever row holds its recording
            own = [next((k for k in ([f'{base}.l{i}.slow'] if key != base else []) + [f'{base}.l{i}'] if k in by_key), p) for i, p in enumerate(r['parts'])]
            pieces = [(i, by_key[p], own[i], (cues[i - 1] + GAP) if i else 0, cues[i]) for i, p in enumerate(r['parts'])]
        else:
            pieces = [(None, r, key, 0, c['ms'])]
        for i, row, own_key, a, b in pieces:
            lang = tts.lang_of(row, respell)
            sentences, _, problems = tts.prepare(row['text'], lang, respell)
            if problems:
                raise SystemExit(f'{row["key"]}: {problems[0]}')
            said = tts.spoken(sentences)
            audio = (c['sha'], a, b)
            if audio in seen:
                seen[audio]['keys'].append(key)
                continue
            line = {'id': key if i is None else f'{key}#{i + 1}', 'key': key, 'line': None if i is None else i + 1, 'recording': row.get('same') or row['key'], 'keys': [key],
                    'voice': row['voice'], 'lang': lang, 'text': row['text'], 'said': said, 'slow': bool(row.get('slow')),
                    'short': lang == 'gn' and i is None and len(sentences) == 1 and len(said.split()) <= 2, 'kind': kind_of(key, i),
                    'sha': c['sha'], 'from': a, 'to': b, 'b': c['b'], 'row': own_key}
            seen[audio] = line
            out.append(line)
    return out


# ---------- what was heard, and what it means ----------
def es_letters(s):
    """the letters of a Spanish line, for the narrator: no accents, c and z before e and i as the s they are said as"""
    import unicodedata
    s = unicodedata.normalize('NFD', unicodedata.normalize('NFC', s).lower().replace('ñ', '\0'))
    s = ''.join(ch for ch in s if not unicodedata.combining(ch)).replace('\0', 'ñ')
    s = re.sub(r'[^a-zñ]', '', s)
    return re.sub(r'c(?=[ei])|z', 's', s)


def judges(line):
    return [n for n in ('ivan', 'mms') if n in line.get('heard', {})]


def wrong_in(line, h):
    """the recognisers that write letters other than the line's in hearing h (0, 1, 2). The line's letters are those of
    the line as the voice is given it or as the course writes it: «juan» for huan is the name heard right"""
    if line['lang'] == 'es':
        return [n for n in judges(line) if es_letters(line['heard'][n][h]) != es_letters(line['said'])]
    return [n for n in judges(line) if not tts.right_letters(line['heard'][n][h], line['said'], line['text'])]


def all_wrong(line, h):
    """True when every recogniser that heard the line writes wrong letters in hearing h; a Guarani line needs two judges"""
    j = judges(line)
    return len(j) >= (1 if line['lang'] == 'es' else 2) and len(wrong_in(line, h)) == len(j)


def heard_wrong(line):
    """the verdict on a whole line: wrong for every recogniser in NEEDED hearings of the three or more"""
    return sum(all_wrong(line, h) for h in range(len(HEARINGS))) >= NEEDED


def align(said, heard):
    """the edits that turn `said` into `heard` (two strings of letters) → (at, before): at[i] is the place in `heard`
    of what stands for letter i of `said` (-1 when it is missing), before[i] the places of what was put in right
    before it (before[len(said)]: after the last letter). A tie goes to a letter kept or changed, then to one dropped."""
    n, m = len(said), len(heard)
    d = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        d[i][0] = i
    for j in range(m + 1):
        d[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i][j] = min(d[i - 1][j - 1] + (said[i - 1] != heard[j - 1]), d[i - 1][j] + 1, d[i][j - 1] + 1)
    at, before = [-1] * n, [[] for _ in range(n + 1)]
    i, j = n, m
    while i > 0 or j > 0:
        if i > 0 and j > 0 and d[i][j] == d[i - 1][j - 1] + (said[i - 1] != heard[j - 1]):
            at[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif i > 0 and d[i][j] == d[i - 1][j] + 1:
            i -= 1
        else:
            before[i].insert(0, j - 1)
            j -= 1
    return at, before


LIKE = set('aeiouy')          # the vowels, as `letters` leaves them


def marked(text):
    """a text as it is compared, its marks kept: `normal` without its spaces, as long as its `letters`"""
    return tts.normal(text).replace(' ', '')


RESPELL = None          # sound/respell.json, once a run has read it (main): a word silent.json names is looked for as the voice is given it


def as_said(word):
    """a word of the course as the voice is given it (Argentina-gua → arhentinagua), in words"""
    if RESPELL is not None:
        sentences, _, problems = tts.prepare(word, 'gn', RESPELL)
        if sentences and not problems:
            return tts.spoken(sentences).split()
    return tts.normal(word).split()


def place_of(line, word):
    """where a word (or a phrase) of the line stands in the line's letters → (first, its letters) or None"""
    said_words = line['said'].split()
    target = as_said(word)
    at = next((k for k in range(len(said_words) - len(target) + 1) if [tts.letters(w) for w in said_words[k:k + len(target)]] == [tts.letters(w) for w in target]), None)
    if at is None:
        return None
    return sum(len(tts.letters(w)) for w in said_words[:at]), ''.join(tts.letters(w) for w in target)


def word_heard(line, word, h, name):
    """what recogniser `name` wrote in hearing h in the place of `word` (a word or a phrase of the line as it is said) →
    (its letters, the word's letters, what was written with its marks), or None when the line does not hold the word.
    What was put in right before the word's first letter or after its last one may belong to its neighbours and is
    left aside; what was put in inside it counts. A puso written between two like vowels that the word has side by
    side (héẽ heard «he'ẽ») is the break the two vowels are said with, not a letter too many."""
    where = place_of(line, word)
    if where is None:
        return None
    first, want = where
    heard = line['heard'][name][h]
    plain, full = tts.letters(heard), marked(heard)
    at, before = align(tts.letters(line['said']), plain)
    places = [j for k in range(first, first + len(want)) for j in (before[k] if k > first else []) + ([at[k]] if at[k] >= 0 else [])]
    got = ''.join(plain[j] for j in places)
    mended = got
    for k in range(len(want) - 1):
        if want[k] == want[k + 1] and want[k] in LIKE:
            mended = mended.replace(want[k] + "'" + want[k], want[k] + want[k])
    return (mended if mended == want else got), want, ''.join(full[j] for j in places)


def acute_heard(line, word, h, name):
    """whether recogniser `name` wrote, in hearing h, the acute the line's word carries (the first one), on the vowel
    that stands for it → True, False, or None when the word has no acute or the line does not hold it"""
    said_words = [w for w in tts.normal(line['said']).split()]
    target = ' '.join(as_said(word))
    if target not in said_words or not any(c in tts.ACUTE for c in target):
        return None
    k = said_words.index(target)
    first = sum(len(tts.letters(w)) for w in said_words[:k])
    inside = next(i for i, c in enumerate(target.replace(' ', '')) if c in tts.ACUTE)
    heard = line['heard'][name][h]
    at, _ = align(tts.letters(line['said']), tts.letters(heard))
    j = at[first + inside]
    return j >= 0 and marked(heard)[j] == target[inside]


def word_wrong(line, word):
    """the verdict on one word of a line: in NEEDED hearings or more every recogniser writes other letters in its place"""
    j = judges(line)
    if len(j) < 2 or word_heard(line, word, 0, j[0]) is None:
        return False
    count = 0
    for h in range(len(HEARINGS)):
        got = [word_heard(line, word, h, n) for n in j]
        count += all(g[0] != g[1] for g in got)
    return count >= NEEDED


def nearer_to(line, other, respell):
    """the verdict on a form: in NEEDED hearings or more every recogniser's writing is nearer to `other` (the line as
    its lesson says it must not be said) than to the line itself, in letters"""
    j = judges(line)
    if len(j) < 2:
        return False
    bad = tts.letters(tts.spoken(tts.prepare(other, 'gn', respell)[0]))
    good = tts.letters(line['said'])
    count = 0
    for h in range(len(HEARINGS)):
        count += all(tts.edits(bad, tts.letters(line['heard'][n][h])) < tts.edits(good, tts.letters(line['heard'][n][h])) for n in j)
    return count >= NEEDED


def acute_unheard(line, word):
    """the verdict on a marked stress: in NEEDED hearings or more no recogniser writes the acute of the word"""
    j = judges(line)
    if len(j) < 2 or acute_heard(line, word, 0, j[0]) is None:
        return False
    return sum(not any(acute_heard(line, word, h, n) for n in j) for h in range(len(HEARINGS))) >= NEEDED


def flawed_words(raw):
    """the words the voice must not say alone: silent.json's "texts" (words that are silent wherever they are a clip)
    and "words" (the flawed word of a clip that is silent by key)"""
    return list(dict.fromkeys([tts.clean(t).lower() for t in (raw.get('texts') or [])] + [tts.clean(t).lower() for t in (raw.get('words') or [])]))


def fails(line, raw, respell):
    """why a line fails, as a list: 'short', 'word «…»', 'form «…»'; empty when it passes. Only Guarani lines can fail."""
    if line['lang'] != 'gn' or not line.get('heard') or line.get('slow'):
        return []
    out = []
    if line['short'] and heard_wrong(line):
        out.append('short')
    for w in flawed_words(raw):
        if word_wrong(line, w):
            out.append(f'word «{w}»')
    forms = raw.get('forms') or {}
    for k in dict.fromkeys(line['keys'] + [line['row'], line['recording']]):
        entry = forms.get(k)
        for other in (entry.get('not', []) if isinstance(entry, dict) else entry or []):
            if nearer_to(line, other, respell) and f'form «{other}»' not in out:
                out.append(f'form «{other}»')
        for word in (entry.get('acute', []) if isinstance(entry, dict) else []):
            if acute_unheard(line, word) and f'stress «{word}»' not in out:
                out.append(f'stress «{word}»')
    return out


def show(line, h=None):
    """what each recogniser wrote, in one hearing or in all three"""
    hs = range(len(HEARINGS)) if h is None else [h]
    return ' | '.join(f'{n}: ' + ' / '.join(f'«{tts.normal(line["heard"][n][k]) if line["lang"] == "gn" else line["heard"][n][k]}»' for k in hs) for n in judges(line))


# ---------- the record ----------
def load_record(folder):
    path = os.path.join(folder, RECORD)
    if not os.path.exists(path):
        return {}
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def ident(line):
    """what a hearing belongs to: the MP3, the stretch of it, and the line that was to be heard there"""
    return (line['sha'], line['from'], line['to'], line['lang'], line['said'])


def cached(record):
    """what an earlier run heard → {ident: {'heard', 'tried'?}}"""
    return {ident(c): {k: c[k] for k in ('heard', 'tried') if c.get(k)} for c in record.get('clips', []) if c.get('heard')}


def hear(lines, memo, quiet=False):
    """fills line['heard'] = {recogniser: [padded, trimmed, bare]} for every line, from `memo` where the MP3 is the one
    that was heard, with the recognisers for the rest (which `memo` then holds too) → how many lines were heard now"""
    todo = []
    for line in lines:
        got = memo.get(ident(line))
        if got:
            line['heard'] = got['heard']
            if got.get('tried'):
                line['tried'] = got['tried']          # this very clip failed before and was said again without success: not again
        else:
            todo.append(line)
    if not todo:
        return 0
    if not quiet:
        print(f'{len(todo)} line{"s" if len(todo) != 1 else ""} to hear in the app\'s MP3s ({len(lines) - len(todo)} are as they were heard before); loading the recognisers …', flush=True)
    recognisers = tts.load_recognisers('both')
    if len(recognisers) < 2:
        raise SystemExit('both recognisers are needed (ivangtorre/wav2vec2-xlsr-300m-guarani and facebook/mms-1b-all, in the Hugging Face cache): nothing was judged')
    hear_with(todo, recognisers, quiet)
    for line in todo:
        memo[ident(line)] = {'heard': line['heard']}
    return len(todo)


def hear_with(todo, recognisers, quiet=False, audio=None):
    """the lines of `todo` heard by the recognisers, three ways each. `audio`: {sha: samples} for clips that are not in
    the sound files (a trial); else each clip is decoded from line['b']."""
    cache = dict(audio or {})

    def samples(line):
        if line['sha'] not in cache:
            cache[line['sha']] = decode(line['b'])
        x = cache[line['sha']]
        return x[int(line['from'] * tts.RATE / 1000): int(line['to'] * tts.RATE / 1000)]
    for line in todo:
        line['heard'] = {}
    # one recogniser, then the other; the large one's Guarani lines before its Spanish ones (it changes its adapter once)
    for name, rec in recognisers.items():
        for lang in ('gn', 'es'):
            if not rec.can(lang):
                continue
            for n, line in enumerate([t for t in todo if t['lang'] == lang]):
                x = samples(line)
                line['heard'][name] = [rec.hear(x, lang), rec.hear(trimmed(x), lang), rec.hear(x, lang, pad=0)]
                if not quiet and n % 60 == 0:
                    print(f'  {name} {lang}: {n} …', flush=True)
    return len(todo)


def write_record(folder, lines, record, raw, respell, dry=False):
    """<folder>/mp3-heard.json: one row a line, with what was heard and the verdict. The file keeps its day while nothing
    else in it changes → True when it was written anew"""
    rows = []
    for line in lines:
        row = {k: line[k] for k in ('id', 'key', 'line', 'row', 'recording', 'keys', 'voice', 'lang', 'kind', 'text', 'said', 'sha', 'from', 'to')}
        if line.get('slow'):
            row['slow'] = True
        row['heard'] = line['heard']
        row['wrong'] = [wrong_in(line, h) for h in range(len(HEARINGS))]
        if heard_wrong(line):
            row['heard_wrong'] = True
        why = fails(line, raw, respell)
        if why:
            row['fails'] = why
            if line.get('tried'):
                row['tried'] = line['tried']
        rows.append(row)
    data = {'made': datetime.date.today().isoformat(),
            'about': 'What each recogniser hears in the app\'s MP3 of every line (tools/hear-sound.py): a clip of one recording whole, a clip put together from lines cut at its cues. '
                     'heard: for each recogniser what it wrote in three hearings: ' + ', '.join(HEARINGS) + ' (the clip as it ships with 150 ms of silence round it; without its air; as it ships '
                     'and nothing round it). wrong: for each hearing, the recognisers whose letters are not the line\'s. heard_wrong: every recogniser wrong in two hearings of the three or more. '
                     'fails: why the clip may not ship as it is (short, a word silent.json names, a form its lesson calls wrong); a row with fails is a line of a listening item that a person '
                     'has not ruled on, or is named under "keep". tried: the seeds it was said again with, none of which passed (it is not said again while its MP3 is this one). '
                     'sha: the SHA-1 of the MP3 that was heard; a line whose MP3 is the same is not heard again.',
            'recognisers': dict(tts.RECOGNISERS), 'hearings': list(HEARINGS), 'needed': NEEDED, 'clips': rows}
    same = bool(record) and {**record, 'made': ''} == {**data, 'made': ''}
    if same:
        return False
    if not dry:
        with open(os.path.join(folder, RECORD), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
            f.write('\n')
    return True


# ---------- saying a clip again, and silencing it ----------
def quietly(argv):
    """make-tts.py's own run, its listing kept out of the way → (exit code, what it printed)"""
    import contextlib
    import io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        try:
            code = tts.main(argv)
        except SystemExit as e:
            code = e.code if isinstance(e.code, int) else 1
            buf.write(str(e))
    return code, buf.getvalue()


def make_sound(folder, out, only=None):
    """tools/make-sound.mjs on a takes' folder → what it printed; `only`: the clips of a trial"""
    args = ['node', os.path.join(HERE, 'make-sound.mjs'), folder, '--manifest', os.path.join(folder, 'manifest.json'), '--kind', 'synthetic', '--out', out]
    if only:
        args += ['--only'] + sorted(only)
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        raise SystemExit('make-sound.mjs failed: ' + (r.stderr or r.stdout).strip().split('\n')[-1])
    return r.stdout


def users_of(manifest, recording):
    """the rows that play a recording → (the rows that hold it, their own or through "same"; the clips put together from it)"""
    rows = manifest.get('clips', [])
    holders = [r for r in rows if not r.get('parts') and not r.get('tone') and (r.get('same') or r['key']) == recording]
    return holders, [r for r in rows if recording in (r.get('parts') or [])]


def doubts(line, raw, respell):
    """how far a line is from being heard right where the rules look: the number of (recogniser, hearing) pairs that
    write wrong letters for a short clip, for a word silent.json names, or nearer to a form its lesson calls wrong.
    0 for a line every recogniser hears right in every hearing; a take with fewer doubts is the better take."""
    j = judges(line)
    n = 0
    if line['short']:
        n += sum(len(wrong_in(line, h)) for h in range(len(HEARINGS)))
    for w in flawed_words(raw):
        if place_of(line, w) is not None:
            n += sum(1 for h in range(len(HEARINGS)) for r in j if (lambda g: g[0] != g[1])(word_heard(line, w, h, r)))
    forms = raw.get('forms') or {}
    good = tts.letters(line['said'])
    for k in dict.fromkeys(line['keys'] + [line['row'], line['recording']]):
        entry = forms.get(k)
        for other in (entry.get('not', []) if isinstance(entry, dict) else entry or []):
            bad = tts.letters(tts.spoken(tts.prepare(other, 'gn', respell)[0]))
            n += sum(1 for h in range(len(HEARINGS)) for r in j if tts.edits(bad, tts.letters(line['heard'][r][h])) < tts.edits(good, tts.letters(line['heard'][r][h])))
        for word in (entry.get('acute', []) if isinstance(entry, dict) else []):
            if acute_heard(line, word, 0, j[0]) is not None:
                n += sum(1 for h in range(len(HEARINGS)) for r in j if not acute_heard(line, word, h, r))
    return n


def letters_off(lines):
    """how far lines are from their letters as a whole: the edits between what was written and the line (as the voice
    is given it or as the course writes it, whichever is nearer), every recogniser and every hearing added up"""
    return sum(min(tts.edits(tts.letters(x['said']), tts.letters(h)), tts.edits(tts.letters(x['text']), tts.letters(h))) for x in lines for hs in x['heard'].values() for h in hs)


def retake_of(folder, recording, paths):
    """what is said again with a recording, read once from the folder as it is → (the keys: the recording, and the
    slow take of every line that plays it; those of the slow takes that the folder holds now; the cut of the take that
    is replaced: 'pause', 'closure' or None). A slow take is its line's normal take said again more slowly, with the
    same seed (make-tts.py), so it goes with its line also when it waits in left-out/: said again and judged afresh, it
    stays the slow version of the take that is in the folder, which is what a listener is asked to compare it with."""
    with open(paths['list'], encoding='utf-8') as f:
        listed = json.load(f)['clips']
    by = {r['key']: r for r in listed}
    slow = []
    for r in listed:
        base = by.get(r['key'][:-len('.slow')]) if r['key'].endswith('.slow') and not r.get('parts') and not r.get('tone') else None
        if base is not None and (base.get('same') or base['key']) == recording:
            slow.append(r.get('same') or r['key'])
    slow = list(dict.fromkeys(slow))
    with open(os.path.join(folder, 'manifest.json'), encoding='utf-8') as f:
        here = {r['key'] for r in json.load(f)['clips']}
    with open(os.path.join(folder, 'takes.json'), encoding='utf-8') as f:
        cut = next((c.get('cut') for c in json.load(f)['clips'] if c['key'] == recording), None)
    return [recording] + slow, [k for k in slow if k in here], cut if cut in ('pause', 'closure') else None


def say_again(folder, said, cut, n, paths):
    """make-tts.py's own run for take n of a recording, in `folder`: the key's own seed plus 7919 n, one take, heard by
    the recognisers, with its slow take where it has one and with the cut of the take it replaces (a word that was
    kept cut after a pause because it trails off when run in, tetãme and ko'ág̃a, must not come back run in)
    → (exit code, what it printed)"""
    return quietly(['--out', folder, '--manifest', paths['list'], '--silent', paths['silent'], '--respell', paths['respell'],
                    '--only', *said, '--redo', '--seed', str(7919 * n), '--tries', '1', '--verify'] + (['--cut', cut] if cut else []))


def try_seeds(folder, recording, now, retake, raw, respell, paths, tries, log):
    """Says a recording again with other seeds, in a copy of the takes' folder: each take must pass --verify, is made
    into its MP3 by make-sound.mjs with every clip it is heard in, and is heard three ways. A take passes when it
    fails no rule and is not heard worse as a whole than the take it replaces (`now`: the recording's lines as they
    are heard in the sound files; letters_off). That second condition is there because a take can mend the word a
    rule looks at and spoil another: seed 11 of «Che ru chokokue ha che sy ñemuhára.» was the first that both
    recognisers heard with its «ñemuhára», and both then wrote «chukokue» in every hearing. The take that is kept is
    the passing one that leaves the fewest doubts; among equals, the one whose lines are written with the fewest
    letters off, then the first seed. The search ends at the first passing take without any doubt → (the number of
    its seed or None, what each try gave). Seed n is the key's own seed plus 7919 n: the take make-tts.py makes with
    --seed <7919 n> --tries 1, and with the cut of the take it replaces. `retake` is what retake_of gave: the slow
    takes go with their line, and a take with which a slow take the folder holds now would be left out does not pass
    (the listening lesson would lose its slower version)."""
    work = tempfile.mkdtemp(prefix='epua-hear-')
    tried = []
    was = letters_off(now)
    said, slow_here, cut = retake
    try:
        shutil.copytree(folder, os.path.join(work, 'voz'))
        voz = os.path.join(work, 'voz')
        with open(os.path.join(voz, 'manifest.json'), encoding='utf-8') as f:
            manifest = json.load(f)
        _, joined = users_of(manifest, recording)
        only = {recording} | {r['key'] for r in joined} | {k for r in joined for k in r['parts']}
        for n in range(tries):
            code, printed = say_again(voz, said, cut, n, paths)
            with open(os.path.join(voz, 'takes.json'), encoding='utf-8') as f:
                takes = json.load(f)
            take = next((c for c in takes['clips'] if c['key'] == recording), None)
            if code or take is None or recording in takes.get('left_out', {}):
                why = (takes.get('left_out', {}).get(recording) or printed.strip().split('\n')[-1])[:160]
                tried.append({'n': n, 'passed': False, 'why': 'the take: ' + why, 'brief': 'the take does not pass --verify'})
                log(f'      seed {n}: the take does not pass --verify ({why})')
                continue
            if any(k in takes.get('left_out', {}) for k in slow_here):
                tried.append({'n': n, 'seed': take['seed'], 'passed': False, 'why': 'the slow take the folder has of it would be left out (heard worse than the line)'})
                log(f'      seed {n}: its slow take, which the folder has, would be left out')
                continue
            out = os.path.join(work, f'js{n}')
            make_sound(voz, out, only)
            clips, alias = sound_files(out)
            with open(os.path.join(voz, 'manifest.json'), encoding='utf-8') as f:
                trial = [x for x in lines_of(json.load(f), clips, alias, respell) if x['recording'] == recording and not x['slow']]
            hear_with(trial, tts.load_recognisers('both'), quiet=True)
            if {x['id'] for x in trial} != {x['id'] for x in now}:          # a take that made no clip (silent once trimmed) is no candidate
                tried.append({'n': n, 'seed': take['seed'], 'passed': False, 'why': 'its clips could not all be made (' + ', '.join(sorted({x['id'] for x in now} ^ {x['id'] for x in trial})) + ')'})
                log(f'      seed {n}: {tried[-1]["why"]}')
                continue
            bad = [(x, fails(x, raw, respell)) for x in trial]
            bad = [(x, why) for x, why in bad if why]
            left = sum(doubts(x, raw, respell) for x in trial)
            off = letters_off(trial)
            why = '; '.join(f'{x["id"]}: {", ".join(why)}' for x, why in bad)
            if not bad and off > was:
                why = f'heard worse as a whole than the take it replaces: {off} letters off, against {was}'
            tried.append({'n': n, 'seed': take['seed'], 'cut': take.get('cut'), 'passed': bool(trial) and not why, 'doubts': left, 'off': off, 'heard': {x['id']: x['heard'] for x in trial}, 'why': why})
            log(f'      seed {n} ({take["seed"]}, {take.get("cut")}): ' + ('passes' if not why else f'fails ({why})') + f', {left} doubt{"s" if left != 1 else ""}, {off} letter{"s" if off != 1 else ""} off: '
                + '; '.join(f'{x["id"]} {show(x)}' for x in trial))
            if trial and not why and left == 0:
                break
        good = sorted((t for t in tried if t['passed']), key=lambda t: (t['doubts'], t['off'], t['n']))
        return (good[0]['n'] if good else None), tried
    finally:
        shutil.rmtree(work, ignore_errors=True)


def seeds_told(tried):
    """what each seed gave, in a sentence for sound/silent.json: the seeds that gave the same are named together
    («0 to 10: word «ñemuhára»; 11: heard worse as a whole …»)"""
    out, i = [], 0
    brief = lambda t: t.get('brief') or t['why']
    while i < len(tried):
        j = i
        while j + 1 < len(tried) and brief(tried[j + 1]) == brief(tried[i]):
            j += 1
        out.append((str(tried[i]['n']) if i == j else f'{tried[i]["n"]} to {tried[j]["n"]}' if j > i + 1 else f'{tried[i]["n"]} and {tried[j]["n"]}') + f': {brief(tried[i])}')
        i = j + 1
    return '; '.join(out)


def rows_to_silence(manifest, recording):
    """Which keys go into silent.json's "keys" for a recording that may not ship: every row that plays it, with the
    other word of a pair, but the lines of listening items (a person rules on those) → (keys, the item lines kept)"""
    holders, _ = users_of(manifest, recording)
    by_key = {r['key']: r for r in manifest.get('clips', [])}
    keys, kept = [], []
    for r in holders:
        if tts.LINE.search(r['key']) and ITEM.search(tts.LINE.sub('', r['key'])):
            kept.append(r['key'])
            continue
        keys.append(r['key'])
        p = tts.partner_key(r['key'])
        if p and p in by_key:
            keys.append(p)
    return list(dict.fromkeys(keys)), kept


def silence(path, keys, reason):
    """names keys in sound/silent.json, with the reason: the file is read, added to and written as JSON"""
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    new = [k for k in keys if not tts.matches(k, data.get('keys', []))]
    if not new:
        return []
    data.setdefault('keys', []).extend(new)
    why = data.setdefault('why', {})
    by = why.pop('by', None)
    why[', '.join(new)] = reason
    if by is not None:
        why['by'] = by
    write_silent(path, data)
    return new


def write_silent(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write('\n')


# ---------- the run ----------
def parse_args(argv=None):
    p = argparse.ArgumentParser(description="the ear's test on the app's sound files: every clip decoded from its MP3 and heard three ways")
    p.add_argument('folder', help='the takes\' folder the sound files were made from (sound/A1/voz)')
    p.add_argument('--project', default='project', help='where the sound files are (project)')
    p.add_argument('--list-file', default='', help='the clip list the folder was made from (default: manifest.json next to the folder)')
    p.add_argument('--silent', default=os.path.join('sound', 'silent.json'))
    p.add_argument('--respell', default=os.path.join('sound', 'respell.json'))
    p.add_argument('--tries', type=int, default=TRIES, help=f'seeds to try for a clip that fails (default {TRIES})')
    p.add_argument('--check', action='store_true', help='hear and judge only: say nothing again, silence nothing, write nothing; exit 1 if a clip fails')
    p.add_argument('--save', action='store_true', help='with --check: keep what was heard in the record all the same (the next run then hears nothing again)')
    p.add_argument('--list', action='store_true', help='print the lines to hear first (every recogniser wrong in one hearing of the three or more) as the table of sound/VOICE.md, from the record')
    return p.parse_args(argv)


def kept_by_hand(line, manifest, rules):
    by_key = {r['key']: r for r in manifest.get('clips', [])}
    return any(k in by_key and tts.kept_by_hand(by_key[k], rules) for k in dict.fromkeys(line['keys'] + [line['row'], line['recording']]))


def times_wrong(row):
    """in how many of the three hearings every recogniser wrote wrong letters for a line of the record (judged here,
    from what was heard: a record written by an earlier state of the rules is read by today's)"""
    return sum(all_wrong(row, h) for h in range(len(HEARINGS))) if row.get('heard') else 0


def table(record, source):
    """The lines to hear first, for the native listener, laid out for the studio page (docs/estudio): one table a
    voice, in the studio's own order (the list's recording order for that voice), each row with its place there, the
    key the studio shows under the line, the text, what each recogniser wrote in the three hearings (once where they
    agree) and in how many of the three every recogniser wrote wrong letters. Two of three or more is the tool's
    «heard wrong»; a line with one such hearing is listed too, because one hearing is what a review of the files
    goes by (the review of 16 November heard each clip once, padded). A line that is said in several clips stands
    once, under the key of its recording, with the hearings of the clip in which it fared worst."""
    out = []
    worst = {}
    for c in record.get('clips', []):
        n = times_wrong(c)
        if n and not c.get('slow') and (c['recording'] not in worst or n > times_wrong(worst[c['recording']])):
            worst[c['recording']] = c
    for voice, name in (('F', 'la voz de mujer'), ('M', 'la voz de hombre'), ('N', 'el narrador')):
        order = [r['key'] for r in sorted((r for r in source.get('clips', []) if r.get('order') and not r.get('same') and not r.get('parts') and not r.get('tone') and r.get('voice') == voice),
                                          key=lambda r: r['order'])]
        place = {k: n + 1 for n, k in enumerate(order)}
        listed = {r['key']: r for r in source.get('clips', [])}
        # the key the studio shows the line under: the list's own recording row (in the folder a recording passes to
        # another key while the row it was listed under is silent: ñu is `a1u02d3.s2a` in the list, `a1u03d3.s1a` here)
        studio = lambda c: (listed.get(c['recording'], {}).get('same') or c['recording'])
        rows = sorted((c for c in worst.values() if c['voice'] == voice), key=lambda c: place.get(studio(c), 10 ** 6))
        if not rows:
            continue
        out += ['', f'*{name[0].upper() + name[1:]}* (in the studio: «Qué voz grabás» → {voice}; {len(order)} lines; {sum(1 for c in rows if times_wrong(c) >= NEEDED)} of these {len(rows)} are heard wrong):', '',
                '| Line in the studio | Key | Text | Independent recogniser | Large recogniser | Wrong for ' + ('both' if voice != 'N' else 'it') + ' in |', '|---|---|---|---|---|---|']
        for c in rows:
            cell = lambda n: ' / '.join(dict.fromkeys(f'«{tts.normal(h) if c["lang"] == "gn" else h.strip()}»' for h in c['heard'].get(n, []))) or '—'
            used = sorted({x['key'] for x in record.get('clips', []) if x['recording'] == c['recording'] and x['key'] != c['recording'] and times_wrong(x) and not x.get('slow')})
            if studio(c) != c['recording']:
                used = sorted(set(used) | {c['key']})
            out.append(f'| {place.get(studio(c), "?")} | `{studio(c)}`' + (f' (heard in `{"`, `".join(used)}`)' if used else '') + f' | {c["text"]} | {cell("ivan")} | {cell("mms")} | {times_wrong(c)} of {len(HEARINGS)} |')
    return '\n'.join(out).strip()


def main(argv=None):
    a = parse_args(argv)
    folder = a.folder.rstrip('/')
    paths = {'list': tts.in_root(a.list_file) if a.list_file else os.path.join(os.path.dirname(os.path.abspath(folder)), 'manifest.json'),
             'silent': tts.in_root(a.silent), 'respell': tts.in_root(a.respell)}
    project = tts.in_root(a.project)
    record = load_record(folder)
    if a.list:
        with open(paths['list'], encoding='utf-8') as f:
            print(table(record, json.load(f)))
        return 0
    global RESPELL
    respell = RESPELL = tts.load_respell(paths['respell'])
    said_again, silenced, kept_items = [], [], []
    settled = set()          # the recordings this run has dealt with: said again, silenced, or left to a person
    memo = cached(record)    # what was heard, by MP3: the record's, and this run's as it goes
    for turn in range(4):
        with open(os.path.join(folder, 'manifest.json'), encoding='utf-8') as f:
            manifest = json.load(f)
        with open(paths['silent'], encoding='utf-8') as f:
            raw = json.load(f)
        rules = tts.load_silent(paths['silent'])
        clips, alias = sound_files(project)
        lacking = [r['key'] for r in manifest.get('clips', []) if (r.get('parts') or (not r.get('unused') and not tts.LINE.search(r['key']))) and not r.get('tone')
                   and r['key'] not in clips and r['key'] not in alias]
        if lacking:
            raise SystemExit(f'the sound files in {project} lack {len(lacking)} clip{"s" if len(lacking) != 1 else ""} the folder\'s list has ({", ".join(lacking[:6])}{" …" if len(lacking) > 6 else ""}): '
                             f'run tools/make-sound.mjs on {folder} first')
        lines = lines_of(manifest, clips, alias, respell)
        heard_now = hear(lines, memo)
        failing = [(line, fails(line, raw, respell)) for line in lines]
        failing = [(line, why) for line, why in failing if why and not kept_by_hand(line, manifest, rules)]
        todo = {}
        for line, why in failing:
            todo.setdefault(line['recording'], []).append((line, why))
        # a line of a listening item that failed before, was said again without success and waits for a person: not again
        waiting = {k for k, group in todo.items() if all(line.get('tried') and line['kind'] == 'item' for line, _ in group)}
        todo = {k: group for k, group in todo.items() if k not in waiting}
        gn = [x for x in lines if x['lang'] == 'gn']
        print(f'{len(lines)} lines in {len(clips)} clips of {len({c["file"] for c in clips.values()})} sound files ({heard_now} heard now, the rest as recorded): '
              f'{sum(1 for x in gn if x["short"])} clips of one or two words, {sum(1 for x in gn if x["short"] and heard_wrong(x))} of them heard wrong; '
              f'{sum(1 for x in gn if heard_wrong(x))} of the {len(gn)} Guarani lines heard wrong in all (wrong letters for both recognisers in {NEEDED} hearings of {len(HEARINGS)} or more); '
              f'{len(todo)} recording{"s" if len(todo) != 1 else ""} may not ship as {"they are" if len(todo) != 1 else "it is"}'
              + (f', and {len(waiting)} line{"s" if len(waiting) != 1 else ""} of listening items wait{"" if len(waiting) != 1 else "s"} for a person' if waiting else '') + '.')
        for k, group in todo.items():
            for line, why in group:
                print(f'  x {line["id"]} [{line["kind"]}] «{line["text"]}»: {", ".join(why)}; {show(line)}')
        if a.check or not todo:
            break
        changed = False
        for recording, group in todo.items():
            tried = []
            n = None
            if recording in settled:
                print(f'  {recording} «{group[0][0]["text"]}»: the take that passed in its trial fails in the sound files as they are: no more seeds')
            else:
                print(f'  {recording} «{group[0][0]["text"]}»: saying it again, up to {a.tries} seeds …', flush=True)
                now = [x for x in lines if x['recording'] == recording and not x['slow']]
                retake = retake_of(folder, recording, paths)
                n, tried = try_seeds(folder, recording, now, retake, raw, respell, paths, a.tries, print)
            again = recording in settled
            settled.add(recording)
            if n is not None:
                kept = next(t for t in tried if t['n'] == n)
                code, printed = say_again(folder, retake[0], retake[2], n, paths)
                if code:
                    raise SystemExit(f'{recording}: make-tts.py could not write the take that passed (seed {n}): {printed.strip().splitlines()[-1]}')
                said_again.append((recording, n, kept))
                print(f'    kept: seed {n} ({kept["seed"]}), the best of {len(tried)} tried ({kept["doubts"]} doubt{"s" if kept["doubts"] != 1 else ""} left, {kept["off"]} letter{"s" if kept["off"] != 1 else ""} off, '
                      f'against {letters_off(now)} for the take it replaces); the folder has the take')
                changed = True
                continue
            heard = '; '.join(f'{line["id"]}: {show(line)}' for line, _ in group)
            keys, items = rows_to_silence(manifest, recording)
            reason = (f'«{group[0][0]["text"]}»: in the app\'s MP3, ' + '; '.join(dict.fromkeys(w for _, why in group for w in why)) + f' ({heard}). '
                      + (f'The take that had passed in its trial fails in the sound files (tools/hear-sound.py, {datetime.date.today().isoformat()})' if again else
                         f'Said again with {len(tried)} seed{"s" if len(tried) != 1 else ""} (tools/hear-sound.py, {datetime.date.today().isoformat()}), and no take passed: {seeds_told(tried)[:1500]}')
                      + '. The take waits in left-out/.')
            if keys:
                new = silence(paths['silent'], keys, reason)
                if new:
                    silenced.append((recording, new, reason))
                    print(f'    no take passed: silenced in {os.path.relpath(paths["silent"], ROOT)}: {", ".join(new)}')
                    changed = True
            if items:
                kept_items.append((recording, items))
                for line, _ in group:
                    if line['kind'] == 'item':
                        line['tried'] = {'seeds': len(tried) or a.tries, 'on': datetime.date.today().isoformat(), 'gave': seeds_told(tried)[:1500]}
                        memo[ident(line)]['tried'] = line['tried']
                print(f'    no take passed, and it is a line of a listening item ({", ".join(items)}): it stays, for a person to rule on (name the line under "keys" to silence its item, or under "keep")')
        if not changed:
            break
        # the folder follows silent.json (the takes that are silent now go to left-out/), and the sound files follow the folder
        code, printed = quietly(['--out', folder, '--manifest', paths['list'], '--silent', paths['silent'], '--respell', paths['respell'], '--changed'])
        if code:
            raise SystemExit('make-tts.py --changed failed after the changes: ' + printed.strip().splitlines()[-1])
        print('  making the sound files again …', flush=True)
        print('  ' + [l for l in make_sound(folder, project).splitlines() if 'sound files are' in l][-1])
    else:
        print('four rounds did not settle it: run the tool again', file=sys.stderr)
    with open(paths['silent'], encoding='utf-8') as f:
        raw = json.load(f)
    wrote = False if a.check and not a.save else write_record(folder, lines, record, raw, respell)
    left = [(line, fails(line, raw, respell)) for line in lines]
    left = [(line, why) for line, why in left if why]
    for recording, n, t in said_again:
        print(f'said again: {recording}, seed {n} ({t["seed"]}): ' + '; '.join(f'{k} ' + ' | '.join(f'{r}: ' + ' / '.join(f'«{tts.normal(x)}»' for x in hs) for r, hs in h.items()) for k, h in t['heard'].items()))
    for recording, keys, reason in silenced:
        print(f'silenced: {", ".join(keys)}: {reason}')
    for line, why in left:
        print(f'stays, and fails ({", ".join(why)}): {line["id"]} «{line["text"]}»' + (' (named under "keep")' if kept_by_hand(line, manifest, tts.load_silent(paths["silent"])) else ' (a line of a listening item: a person rules)' if line['kind'] == 'item' else ''))
    print(f'{RECORD}: ' + ('written' if wrote else 'not written (--check)' if a.check and not a.save else 'as it was'))
    if a.check:
        return 1 if any(not kept_by_hand(line, manifest, tts.load_silent(paths['silent'])) and line['kind'] != 'item' for line, _ in left) else 0
    return 0


if __name__ == '__main__':
    sys.exit(main())
