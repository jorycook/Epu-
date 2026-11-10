#!/usr/bin/env python3
"""Synthetic voice for the course's clips: a stand-in until native recordings exist (notes G4 §4.2 and §6).
What it says well, what it does not, and every number measured are in sound/VOICE.md. Read that before shipping a clip.

Reads sound/<level>/manifest.json (tools/sound-list.mjs), says every row that is recorded (not put together from lines,
not the tone, not said already under another key) and writes into a folder: one WAV per key (16 kHz, mono, 16 bit),
voices.json (the credits, marked synthetic, with the licence), manifest.json (the manifest it was given without the rows
that stay silent) and, with --verify, tts-report.csv and tts-report.json. Then tools/make-sound.mjs turns the folder
into the app's sound files.

usage:  python3 tools/make-tts.py --out <folder> [--manifest sound/A1/manifest.json] [--only <key or pattern> ...]
                                  [--voices F,M,N] [--verify [both|ivan|mms]] [--tries N] [--takes <tts-report.json>]
                                  [--redo] [--seed N] [--pitch F=0,M=-2]
        python3 tools/make-tts.py --dry-run [--only ...]     what would be said, and every check: no model, no --out
        then:   node tools/make-sound.mjs <folder> --manifest <folder>/manifest.json --kind synthetic

The voices: Meta's MMS-TTS, one VITS model a language (36 M weights, 145 MB each; a CPU is enough).
  facebook/mms-tts-grn   Guarani, one male speaker (median pitch 143 Hz, measured). The manifest's F is this voice as
                         it is and M the same voice 2 semitones lower (ffmpeg's rubberband, formants kept), so that the
                         two speakers of a dialogue differ: F is not a woman's voice. More costs accuracy: a shift
                         upward takes single words from 14 % to 22 % CER on the large recogniser, 3 semitones down
                         take sentences from 15 % to 20 % on the independent one; M's 2 semitones cost 1 to 3 points.
  facebook/mms-tts-spa   Spanish: the narrator (lang "es"), as it is; and a line of F or M that is nothing but a
                         Spanish number the Guarani model cannot say («Diez mil.» comes back «ndiehmi»), unshifted.
  Licence: CC BY-NC 4.0, NON-COMMERCIAL USE ONLY, with attribution (Pratap et al. 2023, "Scaling Speech Technology to
  1,000+ Languages", Meta AI). Clips made with these models may not ship in a paid or ad-funded app. The licence goes
  into voices.json, and from there into the sound files' headers and the sound index.
  Hosts: huggingface.co (small files) and us.aws.cdn.hf.co (the weights), with HF_HUB_DISABLE_XET=1 (the Xet hosts are
  not needed); or a filled Hugging Face cache (HF_HOME) with HF_HUB_OFFLINE=1. Python packages: torch, transformers,
  numpy, soundfile. ffmpeg with rubberband, for M only.

The text. The models know their own symbols only (lower-case letters, the puso, a dash) and their tokenizer drops
everything else without a word, so the text is prepared here and checked against the models' vocabularies (kept below,
and compared with the models' own when they load):
  - NFC, lower case, single spaces, the puso as U+0027 (the tokenizer drops ’ and ʼ: the word would lose its puso);
  - g̃ is not a symbol of the Guarani model: it is written the way the model's training text wrote it, the tilde on the
    vowel (hag̃ua → haguã, ko'ág̃a → ko'ágã) or left to the nasal vowel that follows (og̃uahẽ → oguahẽ);
  - Spanish names, numbers and loans inside Guarani lines are respelled from sound/respell.json, for the synthesis text
    only (Juan → huan, Lucía → lusía, Marta → márta): the screens keep the course's spelling;
  - . ? ! … ; : end a sentence (a pause of 0.42 s); a comma makes no pause; ¿ ¡ « » and double quotes are left out.
    The models have no punctuation at all: a question is not said differently from a statement;
  - a digit is said in words in a Spanish line and stops the run in a Guarani one (the model says «1» as noise);
  - anything else stops the run before the first clip, with the key and the character named. Nothing is dropped
    silently. So does a word the Guarani model would misread (letters outside Guarani spelling, a name in the middle
    of a sentence) that sound/respell.json does not list.

How a clip is said. Both models garble a short utterance said on its own (ka'a comes back as «haha», «uno» as «gono»),
so every sentence is said after a carrier, «ha upéi he'i —» ("and then he said:"), in one utterance, and the carrier
is cut off at the pause the model makes for the dash, with the model's own alignment (a hook on its duration
predictor); the clip starts 10 ms inside the place of its first letter, because the model hums before it. A line of
two words or fewer is said with the model's noise scale at 0.33 instead of 0.667 (measured: 145 single words go from
19.7 % to 17.8 % CER on the independent recogniser); the duration noise stays at 0.8. Slow takes (rows with "slow",
keys ending in .slow) are said at 0.8 of the speaking rate. Each clip's seed comes from its key, so a rebuild gives
the same audio (checked: 568 clips said twice an hour apart came out the same).

--verify sends each clip back through the speech recognisers found in the cache and writes what each heard and its
character error rate (CER) against the text that was said:
  ivan  ivangtorre/wav2vec2-xlsr-300m-guarani (1.2 GB): independent of the voice; 8.6 % CER on real Guarani speech.
  mms   facebook/mms-1b-all, adapter grn (3.9 GB, about 5 GB of memory): from the same project and data as the voice,
        so it flatters it (6.1 % on the same real speech). Spanish lines are judged by its spa adapter alone.
With --tries N (3 under --verify), a clip that is not heard as written is said again with the next seed and the best
take is kept, a take heard as the other word of its sound pair counting as the worst; the seed used is in the report,
and --takes <tts-report.json> says the same takes again without the recognisers. A recogniser cannot tell whether a
vowel is nasal, a puso is a glottal stop or a stress is right: sound/VOICE.md has what was measured for each sound the
course teaches. The clips that must stay silent are named in sound/silent.json (today: the sound pairs that differ by
a nasal vowel alone): they are not said, and <out>/manifest.json leaves them out, so the screens keep their written
stand-in there.

The first draft of this tool could also drive a Piper voice. No Guarani Piper voice exists to test it with, so that
path is gone (git history has it).
"""
import argparse
import csv
import datetime
import fnmatch
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = {'gn': 'facebook/mms-tts-grn', 'es': 'facebook/mms-tts-spa'}
LICENCE = 'CC BY-NC 4.0 (Meta MMS-TTS: non-commercial use only; Pratap et al. 2023)'
RATE = 16000        # the models' sampling rate
FRAME = 256         # samples per model frame: 16 ms

# The symbols of each model (its vocab.json). A model whose own list differs stops the run.
SYMBOLS = {
    'gn': " '-0123456789_abcdefghijklmnopqrstuvxyzáãéíñóõúýĩũẽỹ—",
    'es': " 0123456789_abcdefghijklmnopqrstuvxyzáéíñóúü—",
}
# Symbols a model has but that are never sent as text: the digits (1 comes out as noise, and 3 is the Guarani model's
# blank), the underscore and the hyphen (no sound of their own) and the dash, which the tool itself uses for a pause.
NOT_TEXT = set('0123456789_-—')
LETTERS = {lang: set(s) - NOT_TEXT - {' '} for lang, s in SYMBOLS.items()}

PUSO = dict.fromkeys(map(ord, "’‘ʼ´`ʹʻ′"), "'")
STOPS = '.?!…;:'          # the end of a sentence: a pause
COMMAS = ',—–'            # the end of a phrase: no pause is made for it (see Voice.say)
MUTE = '¿¡«»"“”'          # written, not said
TILDE = '\u0303'            # the combining tilde of g̃
NASAL = {'a': 'ã', 'e': 'ẽ', 'i': 'ĩ', 'o': 'õ', 'u': 'ũ', 'y': 'ỹ'}
ACUTE = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y'}
VOWELS = 'aeiouyáéíóúýãẽĩõũỹ'

VOICES = {          # the manifest's voices: which model, and how far its pitch is moved (semitones, formants kept)
    'F': {'lang': 'gn', 'semitones': 0.0},          # the model as it is: a shift upward costs single words 3 to 8 points of CER
    'M': {'lang': 'gn', 'semitones': -2.0},         # costs 1 point on sentences and 3 on lines of one to four words; 3 semitones cost more
    'N': {'lang': 'es', 'semitones': 0.0},
}
CARRIER = {          # said before every sentence and cut off; the next one is tried when the model makes no pause after the first
    'gn': ["ha upéi he'i", "upéi he'i chupe", "ko ñe'ẽ"],          # "and then he said", "then he said to him", "this word"
    'es': ['y entonces dijo', 'y luego le dijo'],
}
PAUSE = {'stop': 0.42}                     # seconds of silence between two sentences of a line (longer in a slow take)
SLOW = 0.8                                 # speaking rate of a slow take
LEAD = -0.01                               # a sentence starts 10 ms inside the place the model's alignment gives its first symbol (it hums before)
NOISE_WORD = 0.33                          # the model's noise_scale for a line of one or two words (its default, 0.667, for the rest)
RECOGNISERS = {'ivan': 'ivangtorre/wav2vec2-xlsr-300m-guarani', 'mms': 'facebook/mms-1b-all'}


# ---------- the text ----------
def clean(text):
    """NFC, one puso, single spaces (every Unicode space, the no-break one too: the tokenizer would glue the words)."""
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', str(text or '')).translate(PUSO)).strip()


def es_number(n):
    """0 … 999 999 in Spanish words."""
    units = ('cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete '
             'dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete '
             'veintiocho veintinueve').split()
    tens = dict(zip(range(30, 100, 10), 'treinta cuarenta cincuenta sesenta setenta ochenta noventa'.split()))
    hundreds = dict(zip(range(100, 1000, 100), 'ciento doscientos trescientos cuatrocientos quinientos seiscientos setecientos ochocientos novecientos'.split()))
    if n < 30:
        return units[n]
    if n < 100:
        return tens[n - n % 10] + (' y ' + units[n % 10] if n % 10 else '')
    if n == 100:
        return 'cien'
    if n < 1000:
        return hundreds[n - n % 100] + (' ' + es_number(n % 100) if n % 100 else '')
    if n < 1000000:
        head = 'mil' if n // 1000 == 1 else re.sub(r'uno$', 'ún', es_number(n // 1000)) + ' mil'
        return head + (' ' + es_number(n % 1000) if n % 1000 else '')
    raise ValueError(f'{n}: write the number in words')


def load_respell(path):
    """sound/respell.json → {'words': {word: synthesis spelling}, 'stems': [starts of names said as written],
    'spanish': {Spanish number words}, 'es_only': {words the Guarani voice cannot say at all}}; empty when there is no file."""
    data = {}
    if path and os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
    words, es_only = {}, set()
    for w, v in (data.get('words') or {}).items():
        words[clean(w).lower()] = clean(v['say'] if isinstance(v, dict) else v).lower()
        if isinstance(v, dict) and v.get('voice') == 'es':
            es_only.add(clean(w).lower())
    return {'words': words, 'stems': [strip_acutes(clean(x).lower()) for x in data.get('as_written') or []],
            'spanish': {clean(x).lower() for x in data.get('spanish') or []}, 'es_only': es_only}


NO_RESPELL = {'words': {}, 'stems': [], 'spanish': set(), 'es_only': set()}


def strip_acutes(w):
    return ''.join(ACUTE.get(c, c) for c in w)


def g_tilde(word):
    """g̃ is not a symbol of the model. Its training text wrote these words with the tilde on a vowel, so: the tilde
    goes to the first vowel after the g̃ (a u before another vowel is skipped: g̃ua → guã), unless a nasal vowel already
    follows in the word (og̃uahẽ → oguahẽ) or that vowel carries the acute (hag̃uáicha → haguáicha: the nasality is lost)."""
    while 'g' + TILDE in word:
        i = word.index('g' + TILDE)
        rest = word[i + 2:]
        if not any(c in 'ãẽĩõũỹ' for c in rest):
            j = 1 if rest[:1] == 'u' and rest[1:2] and rest[1] in VOWELS else 0
            if rest[j:j + 1] and rest[j] in NASAL:
                rest = rest[:j] + NASAL[rest[j]] + rest[j + 1:]
        word = word[:i] + 'g' + rest
    return word


def odd_spelling(word):
    """Why a word is not plain Guarani spelling (so the Guarani model would misread it), or ''."""
    w = word.replace('ch', 'S').replace('mb', 'M').replace('nd', 'N').replace('ng', 'G').replace('nt', 'T')
    why = []
    found = sorted(set(re.findall(r'[cqzxwbdf]', w)))
    if found:
        why.append('the letter' + ('s ' if len(found) > 1 else ' ') + ', '.join(found))
    if word[-1] not in VOWELS:
        why.append('it ends in a consonant')
    if re.search(r"[cdfghjklmnpqrstvxzñbSMNGT]{2}", w.replace('rr', 'r')):
        why.append('two consonants in a row')
    return '; '.join(why)


def prepare(text, lang, respell=NO_RESPELL):
    """The text of a row → (sentences, notes, problems).
    sentences: [[phrase, …], …], each phrase in the model's own letters, the phrases of a sentence a comma apart;
    notes: what was respelled; problems: what cannot be said (the run stops on any)."""
    words_table, stems = respell['words'], respell['stems']
    letters = LETTERS[lang]
    t = clean(text)
    notes, problems = [], []
    if lang == 'es':
        def number(m):
            try:
                return ' ' + es_number(int(re.sub(r'\D', '', m.group()))) + ' '
            except ValueError as e:
                problems.append(str(e))
                return ' '
        t = clean(re.sub(r'\d{1,3}(?:\.\d{3})+(?!\d)|\d+', number, t))
    sentences, phrase, word = [[]], [], ''
    at_start = True          # the next word opens a sentence (its capital says nothing about it being a name)

    def end_word():
        nonlocal word, at_start
        raw, word = word.strip("'-"), ''
        if not raw:
            return
        first, at_start = at_start, False
        w = raw.lower()
        if lang == 'gn':
            bare = w.replace(TILDE, '')
            if w in words_table:
                if words_table[w] != w:
                    notes.append(f'{raw} → {words_table[w]}')
                w = words_table[w]
            elif '-' in w:
                problems.append(f'the hyphenated word «{raw}» is not in sound/respell.json (say how it is said: a loan with its suffix)')
                return
            elif w in respell['spanish']:
                problems.append(f'the Spanish number «{raw}» inside a Guarani sentence is not in sound/respell.json (the Guarani voice needs its stress written: ochenta → ochénta)')
                return
            else:
                known = any(strip_acutes(bare).startswith(s) for s in stems)
                if not known and odd_spelling(bare):
                    problems.append(f'«{raw}» is not Guarani spelling ({odd_spelling(bare)}) and not in sound/respell.json: the Guarani voice would misread it')
                elif not known and raw[0].isupper() and not first:
                    problems.append(f'the name «{raw}» is not in sound/respell.json (its "words", or "as_written" if the Guarani reading is right)')
                if TILDE in w:
                    said = g_tilde(w)
                    notes.append(f'{raw} → {said}')
                    w = said
        bad = list(dict.fromkeys(c for c in w if c != ' ' and c not in letters))
        for c in bad:
            problems.append(f'the character {c!r} (U+{ord(c):04X} {unicodedata.name(c, "?")}) in «{raw}» is not a symbol of the {lang} voice')
        if not bad:
            phrase.extend(w.split())

    def end_phrase():
        nonlocal phrase
        if phrase:
            sentences[-1].append(' '.join(phrase))
        phrase = []

    for i, ch in enumerate(t + ' '):
        joins = ch == '-' and word and t[i + 1:i + 2].isalpha()          # a hyphen inside a word: Argentina-gua
        if ch.isalpha() or ch == TILDE or ch == "'" or joins:
            word += ch
            continue
        end_word()
        if ch == ' ':
            continue
        if ch in STOPS:
            end_phrase()
            if sentences[-1]:
                sentences.append([])
            at_start = True
        elif ch in COMMAS or ch == '-':
            end_phrase()
        elif ch in MUTE:
            if ch in '«"“¿¡':
                at_start = True          # a quotation, a question open with a capital of their own
        elif ch.isdigit():
            problems.append(f'the digit {ch}: write the number in words (the Guarani voice says a digit as noise)')
        else:
            problems.append(f'the character {ch!r} (U+{ord(ch):04X} {unicodedata.name(ch, "?")}) has no rule: it is neither said nor a pause')
    end_phrase()
    sentences = [s for s in sentences if s]
    if not sentences and not problems:
        problems.append('nothing to say')
    return sentences, notes, list(dict.fromkeys(problems))


def synthesis_text(sentences):
    """What the voice is asked to say, as one line (for the listing and for the round trip)."""
    return ' . '.join(' , '.join(s) for s in sentences)


def spoken(sentences):
    return ' '.join(' '.join(s) for s in sentences)


# ---------- the rows ----------
def select(manifest, voices, only):
    """The rows that are recorded (one WAV each), in the manifest's recording order."""
    rows = [r for r in manifest.get('clips', []) if r.get('order') and not r.get('same') and not r.get('parts') and not r.get('tone')]
    rows = [r for r in rows if r.get('voice') in voices]
    if only is not None:
        rows = [r for r in rows if any(r['key'] == p or fnmatch.fnmatchcase(r['key'], p) for p in only)]
    return sorted(rows, key=lambda r: r['order'])


def lang_of(row, respell=NO_RESPELL):
    """Which model says a row: the Spanish one for the narrator, and for a line of the Guarani voices that is nothing
    but a Spanish number (the words of sound/respell.json's "spanish" list) with a word in it that the Guarani voice
    cannot say (marked "voice": "es": diez, mil) or was never tried with (no entry). «Diez mil.» goes to the Spanish
    voice; «Veinte.», which the Guarani voice says right, stays."""
    if row.get('lang') == 'es' or VOICES.get(row.get('voice'), {}).get('lang') == 'es':
        return 'es'
    words = re.findall(r"[^\W\d_]+(?:'[^\W\d_]+)*", clean(row.get('text', '')).lower())
    numbers = [w for w in words if not (w == 'y' and len(words) > 2)]          # «treinta y cinco»; a lone y is Guarani: water
    if numbers and all(w in respell['spanish'] for w in numbers) and any(w in respell['es_only'] or w not in respell['words'] for w in numbers):
        return 'es'
    return 'gn'


def is_slow(row):
    return bool(row.get('slow')) or row['key'].endswith('.slow')


def seed_of(key, base=0, attempt=0):
    return (zlib.crc32(key.encode('utf-8')) + base + 7919 * attempt) & 0x7FFFFFFF


PAIR_KEY = re.compile(r'^(.*\.s\d+)([ab])$|^(p\d+\.)([01])$')


def partner_key(key):
    """The other word of a sound pair (…s0a ↔ …s0b, p3.0 ↔ p3.1), or None."""
    m = PAIR_KEY.match(key)
    if not m:
        return None
    return m.group(1) + ('b' if m.group(2) == 'a' else 'a') if m.group(1) else m.group(3) + ('1' if m.group(4) == '0' else '0')


def contrast_of(a, b):
    """What sets the two words of a pair apart, when it is one thing: 'nasal' (only a tilde on a vowel), 'puso' (only
    the puso, with or without the acute moving), 'y-i', 'y-u', 'stress' (only the acute), else ''."""
    a, b = clean(a).lower(), clean(b).lower()
    oral = lambda w: ''.join({v: k for k, v in NASAL.items()}.get(c, c) for c in w)
    plain = lambda w: strip_acutes(w)
    if a == b:
        return ''
    if plain(oral(a)) == plain(oral(b)) and oral(a) != a or plain(oral(a)) == plain(oral(b)) and oral(b) != b:
        return 'nasal'
    if plain(a).replace("'", '') == plain(b).replace("'", '') and a.count("'") != b.count("'"):
        return 'puso'
    if plain(a) == plain(b):
        return 'stress'
    if len(a) == len(b):
        diff = {(x, y) for x, y in zip(plain(a), plain(b)) if x != y}
        if diff and diff <= {('y', 'i'), ('i', 'y')}:
            return 'y-i'
        if diff and diff <= {('y', 'u'), ('u', 'y')}:
            return 'y-u'
    return ''


def load_silent(path):
    """sound/silent.json: which rows stay without audio. {"contrasts": ["nasal", …], "keys": ["pattern", …], "texts": […]}"""
    if not path or not os.path.exists(path):
        return {'contrasts': [], 'keys': [], 'texts': []}
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    return {'contrasts': list(data.get('contrasts') or []), 'keys': list(data.get('keys') or []), 'texts': [clean(t).lower() for t in data.get('texts') or []]}


def apply_silence(manifest, rules):
    """→ (the manifest without the rows that stay silent, {key: why}). Silent: the two words of a sound pair whose
    contrast is listed (the voice does not render it), the keys and the texts named. A recording a silent row held for
    other rows (the same word in a scene) passes to the first of them; a clip put together from a silent line is left
    out as a whole. The screens then keep their written stand-in for exactly those keys."""
    rows = [dict(r) for r in manifest.get('clips', [])]
    by_key = {r['key']: r for r in rows}
    why = {}
    for r in rows:
        if r.get('parts') or r.get('tone'):
            continue
        key = r['key']
        if any(key == p or fnmatch.fnmatchcase(key, p) for p in rules['keys']):
            why[key] = 'named in silent.json'
        elif clean(r.get('text', '')).lower() in rules['texts']:
            why[key] = 'its text is named in silent.json'
        else:
            other = by_key.get(partner_key(key) or '')
            c = contrast_of(r.get('text', ''), other.get('text', '')) if other else ''
            if c and c in rules['contrasts']:
                why[key] = f'a pair of the contrast «{c}»'
    moved = {}
    for r in rows:
        if r['key'] in why and r.get('order') and not r.get('same'):
            heirs = [q for q in rows if q.get('same') == r['key'] and q['key'] not in why]
            if heirs:
                heirs[0].pop('same')
                heirs[0]['order'] = r['order']
                moved[r['key']] = heirs[0]['key']
                for q in heirs[1:]:
                    q['same'] = heirs[0]['key']
    for r in rows:
        if r.get('parts'):
            r['parts'] = [moved.get(k, k) for k in r['parts']]
            if any(k in why for k in r['parts']):
                why[r['key']] = 'put together from a line that stays silent'
    out = dict(manifest)
    out['clips'] = [r for r in rows if r['key'] not in why]
    out['silent'] = why
    return out, why


# ---------- sound ----------
def np_():
    import numpy
    return numpy


def level_db(x, n=160, hop=80):
    """level per 5 ms (10 ms window), dB"""
    np = np_()
    if len(x) < n:
        x = np.pad(x, (0, n - len(x)))
    k = 1 + (len(x) - n) // hop
    idx = np.arange(n)[None, :] + hop * np.arange(k)[:, None]
    return 20 * np.log10(np.sqrt((x[idx] ** 2).mean(axis=1)) + 1e-9)


def trim_ends(x, floor=-45.0, keep=0.01):
    """where the sound starts and ends: (a, b) in samples, leaving out what is more than `floor` dB under the loudest 10 ms"""
    e = level_db(x)
    on = np_().where(e > e.max() + floor)[0]
    if not len(on):
        return 0, len(x)
    return max(0, int(on[0]) * 80 - int(keep * RATE)), min(len(x), int(on[-1]) * 80 + 160 + int(keep * RATE))


def trim(x, floor=-45.0, keep=0.01):
    """cut the silence at both ends"""
    a, b = trim_ends(x, floor, keep)
    return x[a:b]


def quiet_run(x, a, b, floor):
    """the longest stretch quieter than `floor` dB inside samples [a, b): (start, end) in samples, or None"""
    np = np_()
    e = level_db(x[a:b])
    best, start = None, None
    for i, q in enumerate(np.append(e < floor, False)):
        if q and start is None:
            start = i
        elif not q and start is not None:
            if best is None or i - start > best[1] - best[0]:
                best = (start, i)
            start = None
    if best is None:
        return None
    return a + best[0] * 80, min(b, a + best[1] * 80 + 80)


def rubberband(x, semitones):
    """pitch moved with ffmpeg's rubberband, the tempo and the formants kept (with the formants moved, a number said by
    the Spanish voice came back as other words)"""
    if abs(semitones) < 1e-6:
        return x
    import soundfile as sf
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, 'a.wav'), os.path.join(d, 'b.wav')
        sf.write(a, x, RATE, subtype='FLOAT')
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'rubberband=pitch={2 ** (semitones / 12):.6f}:pitchq=quality:formant=preserved',
                            '-ar', str(RATE), '-ac', '1', '-c:a', 'pcm_f32le', b], capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError('ffmpeg rubberband: ' + (r.stderr or '').strip().split('\n')[-1])
        y, _ = sf.read(b, dtype='float32')
    return y


class Voice:
    """One MMS-TTS model (VITS, through transformers) with a hook on its duration predictor: every utterance comes with
    the model's own alignment, which is what the carrier is cut off with and what the pauses are set by."""

    def __init__(self, lang, name=None):
        try:
            import torch
            from transformers import AutoTokenizer, VitsModel
        except ImportError as e:
            raise SystemExit(f'the voices need the packages torch and transformers in this Python ({e})') from e
        self.torch, self.lang, self.name = torch, lang, name or MODELS[lang]
        torch.set_num_threads(min(3, torch.get_num_threads()))
        try:
            self.tok = AutoTokenizer.from_pretrained(self.name)
            self.model = VitsModel.from_pretrained(self.name).eval()
        except Exception as e:  # noqa: BLE001 — the reason is what the owner needs: a host that is not allowed, a cache that is empty
            raise SystemExit(f'the voice {self.name} could not be loaded: {e}\n(hosts: huggingface.co and us.aws.cdn.hf.co, with HF_HUB_DISABLE_XET=1; or a filled cache in HF_HOME with HF_HUB_OFFLINE=1)') from e
        own = set(self.tok.encoder)
        if own != set(SYMBOLS[lang]):
            raise SystemExit(f'{self.name} has other symbols than this tool was written for: extra {sorted(own - set(SYMBOLS[lang]))}, missing {sorted(set(SYMBOLS[lang]) - own)}. Update SYMBOLS and check the text rules.')
        cfg = self.model.config
        frame = 1
        for r in cfg.upsample_rates:
            frame *= r
        if cfg.sampling_rate != RATE or frame != FRAME:
            raise SystemExit(f'{self.name}: {cfg.sampling_rate} Hz and {frame} samples a frame, not {RATE} and {FRAME}')
        self._log_duration = None
        self.model.duration_predictor.register_forward_hook(lambda m, i, o: setattr(self, '_log_duration', o.detach()))

    def run(self, text, seed, rate=1.0, noise=None):
        """text in the model's symbols → (samples, [(symbol, start sample, end sample)])"""
        torch = self.torch
        ids = self.tok(text, return_tensors='pt', normalize=False)
        tokens = self.tok.convert_ids_to_tokens(ids['input_ids'][0])
        if ''.join(tokens[1::2]) != text:
            raise ValueError(f'the tokenizer changed the text: {text!r} → {"".join(tokens[1::2])!r}')
        default = self.model.noise_scale
        if noise is not None:
            self.model.noise_scale = noise
        torch.manual_seed(seed)
        try:
            with torch.no_grad():
                wave = self.model(**ids, speaking_rate=rate).waveform[0].numpy().astype('float32')
        finally:
            self.model.noise_scale = default
        frames = torch.ceil(torch.exp(self._log_duration) * (1.0 / rate))[0, 0].numpy()
        edges = np_().concatenate([[0], np_().cumsum(frames)]) * FRAME
        spans = []          # each symbol with half of the blank on either side of it
        n = len(tokens)
        for i in range(1, n, 2):
            a = edges[i - 1] if i == 1 else (edges[i - 1] + edges[i]) / 2
            b = edges[i + 2] if i + 2 >= n else (edges[i + 1] + edges[i + 2]) / 2
            spans.append((tokens[i], int(a), int(min(b, len(wave)))))
        return wave, spans

    def say(self, sentences, seed, rate=1.0, noise='auto', marks=None):
        """The sentences of one row → samples. Each sentence is one utterance after a carrier, cut off at the pause the
        model makes for the dash; the sentences are PAUSE['stop'] apart. A comma makes no pause (measured: a pause
        inside a sentence costs more than it gives, the voice starts badly after each one). `marks`, a list, receives
        where each symbol sits in the result: (symbol, start sample, end sample)."""
        np = np_()
        out, at = [], 0
        for n, phrases in enumerate(sentences):
            words = ' '.join(phrases)
            use = (NOISE_WORD if len(words.split()) <= 2 else None) if noise == 'auto' else noise
            for carrier in CARRIER[self.lang]:
                wave, spans = self.run(f'{carrier} — {words}', seed + n, rate, use)
                d = len(carrier) + 1                   # the dash, between two spaces
                quiet = quiet_run(wave, spans[d - 1][1], spans[d + 1][2], level_db(wave).max() - 38)
                if quiet is not None and quiet[1] - quiet[0] >= int(0.08 * RATE):
                    break                              # a pause of 80 ms or more: the cut is clean
            else:
                raise ValueError(f'no clear pause after any carrier (before «{words}»): the cut would not be clean')
            cut = (quiet[0] + quiet[1]) // 2
            a, b = trim_ends(wave[cut:])
            if LEAD is not None:                        # nothing before the sentence's first symbol: the model often hums there
                a = min(max(a, spans[d + 2][1] - cut - int(LEAD * RATE)), b - 1)
            if n:
                gap = int(PAUSE['stop'] / rate * RATE)
                out.append(np.zeros(gap, dtype='float32'))
                at += gap
            out.append(wave[cut + a:cut + b])
            if marks is not None:
                for sym, sa, sb in spans[d + 2:]:
                    marks.append((sym, max(0, sa - cut - a) + at, max(0, min(sb, cut + b) - cut - a) + at))
            at += b - a
        return np.concatenate(out)


def finish(x, semitones):
    """the voice's pitch, the ends trimmed, a ceiling on the peak"""
    np = np_()
    x = trim(rubberband(x, semitones))
    peak = float(np.abs(x).max()) if len(x) else 0.0
    if peak > 0.97:
        x = x * (0.97 / peak)
    ramp = min(len(x) // 2, int(0.004 * RATE))          # 4 ms in and out: no click at the cut
    if ramp:
        x[:ramp] *= np.linspace(0, 1, ramp, dtype='float32')
        x[-ramp:] *= np.linspace(1, 0, ramp, dtype='float32')
    return x


def write_wav(path, x):
    import soundfile as sf
    sf.write(path, np_().clip(x, -1, 1), RATE, subtype='PCM_16')


# ---------- the round trip ----------
def normal(s):
    """lower case, no punctuation, one apostrophe, NFC, g̃ as g, single spaces: both sides of the comparison"""
    s = unicodedata.normalize('NFC', s).translate(PUSO).lower().replace(TILDE, '')
    return re.sub(r'\s+', ' ', re.sub(r"[^\w' ]|[\d_]", ' ', s)).strip()


def edits(a, b):
    if a == b:
        return 0
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def cer(said, heard):
    """(edits, length of what was said) on the normalised strings"""
    a, b = normal(said), normal(heard)
    return edits(a, b), max(1, len(a))


class Recogniser:
    """A CTC speech recogniser from the cache; 'mms' takes the adapter of the line's language."""

    def __init__(self, which):
        import torch
        from transformers import AutoProcessor, Wav2Vec2ForCTC, Wav2Vec2Processor
        self.torch, self.which, self.lang = torch, which, 'grn'
        name = RECOGNISERS[which]
        if which == 'mms':
            self.proc = AutoProcessor.from_pretrained(name, target_lang='grn')
            self.model = Wav2Vec2ForCTC.from_pretrained(name, target_lang='grn', ignore_mismatched_sizes=True).eval()
        else:
            self.proc = Wav2Vec2Processor.from_pretrained(name)
            self.model = Wav2Vec2ForCTC.from_pretrained(name).eval()

    def can(self, lang):
        return self.which == 'mms' or lang == 'gn'

    def hear(self, x, lang='gn'):
        np, torch = np_(), self.torch
        if self.which == 'mms':
            want = 'spa' if lang == 'es' else 'grn'
            if want != self.lang:
                self.proc.tokenizer.set_target_lang(want)
                self.model.load_adapter(want)
                self.lang = want
        pad = np.zeros(int(0.15 * RATE), dtype='float32')        # a clip cut at the first sound is heard worse
        inputs = self.proc(np.concatenate([pad, x, pad]), sampling_rate=RATE, return_tensors='pt')
        with torch.no_grad():
            logits = self.model(**inputs).logits
        return self.proc.batch_decode(torch.argmax(logits, dim=-1))[0]


def load_recognisers(which):
    """the recognisers asked for that are there: {name: Recogniser}; a missing one is said, not fetched"""
    want = ['ivan', 'mms'] if which in ('both', 'auto') else [which]
    out = {}
    for w in want:
        try:
            out[w] = Recogniser(w)
        except Exception as e:  # noqa: BLE001 — not in the cache, or no memory for it: the report says which judged
            print(f'  (recogniser {w}, {RECOGNISERS[w]}, is not available: {str(e).splitlines()[0][:120]})')
    return out


# ---------- the run ----------
def parse_args(argv=None):
    p = argparse.ArgumentParser(description='synthetic voice for the course clips (a stand-in: the screens mark it «voz sintética»)')
    p.add_argument('--manifest', default=os.path.join('sound', 'A1', 'manifest.json'), help='the clip list (tools/sound-list.mjs)')
    p.add_argument('--out', default='', help='the folder for the WAVs, voices.json, manifest.json and the report (not needed with --dry-run)')
    p.add_argument('--respell', default=os.path.join('sound', 'respell.json'), help='names, numbers and loans as the Guarani voice must read them')
    p.add_argument('--silent', default=os.path.join('sound', 'silent.json'), help='which clips stay without audio (pairs of a contrast the voice does not render); "none" for no rule')
    p.add_argument('--voices', default='F,M,N', help='which voices of the manifest to say')
    p.add_argument('--only', nargs='*', default=None, help='only these keys (shell patterns allowed: "a1u01d1.*")')
    p.add_argument('--redo', action='store_true', help='say again the keys whose WAV exists')
    p.add_argument('--dry-run', action='store_true', help='list what would be said and run every check; load no model, write nothing')
    p.add_argument('--verify', nargs='?', const='auto', default='', choices=['auto', 'both', 'ivan', 'mms'],
                   help='send every clip back through the recognisers in the cache (both by default) and write tts-report.csv and .json')
    p.add_argument('--tries', type=int, default=0, help='with --verify: how many seeds to try for a clip that is not heard as written (default 3)')
    p.add_argument('--takes', default='', help='a tts-report.json of an earlier run: its seeds are used again, so the same takes come out without the recognisers')
    p.add_argument('--seed', type=int, default=0, help='added to every clip\'s own seed: another number, another take of everything')
    p.add_argument('--pitch', default='', help='semitones per voice, e.g. "F=0,M=-3" (the default is in VOICES)')
    a = p.parse_args(argv)
    if not a.dry_run and not a.out:
        p.error('--out is needed (or --dry-run)')
    return a


def in_root(path):
    return path if os.path.isabs(path) else os.path.join(ROOT, path)


def matches(key, patterns):
    return any(key == p or fnmatch.fnmatchcase(key, p) for p in patterns)


def main(argv=None):
    a = parse_args(argv)
    with open(in_root(a.manifest), encoding='utf-8') as f:
        source = json.load(f)
    respell_path = in_root(a.respell)
    respell = load_respell(respell_path)
    manifest, silent = apply_silence(source, load_silent('' if a.silent == 'none' else in_root(a.silent)))
    voices = [v.strip() for v in a.voices.split(',') if v.strip()]
    pitch = {v: VOICES[v]['semitones'] for v in VOICES}
    for part in filter(None, a.pitch.split(',')):
        v, _, n = part.partition('=')
        pitch[v.strip()] = float(n)
    unknown = sorted({r.get('voice') for r in select(manifest, [r.get('voice') for r in manifest.get('clips', [])], a.only)} - set(VOICES) - {None})
    if unknown:
        print(f'voices of the manifest this tool has no voice for (their rows are skipped): {", ".join(unknown)}')
    rows = select(manifest, [v for v in voices if v in VOICES], a.only)
    quiet = [r for r in source.get('clips', []) if r['key'] in silent and (a.only is None or matches(r['key'], a.only))]

    # every check first: the run stops before a single clip if any row cannot be said
    plan, bad = [], []
    for r in rows:
        lang = lang_of(r, respell)
        sentences, notes, problems = prepare(r['text'], lang, respell)
        if lang == 'es' and VOICES[r['voice']]['lang'] != 'es':
            notes.append('a Spanish number: said by the Spanish voice, unshifted')
        plan.append((r, lang, sentences, notes))
        for pr in problems:
            bad.append((r['key'], r['text'], pr))
    count = {v: sum(1 for r in rows if r['voice'] == v) for v in voices}
    print(f'{manifest.get("level", "?")}: {len(rows)} clips to say ({", ".join(f"{v} {n}" for v, n in count.items())}; {sum(1 for r in rows if is_slow(r))} slow takes), '
          f'{len(quiet)} rows left silent by {os.path.basename(a.silent)}; Guarani {MODELS["gn"]}, Spanish {MODELS["es"]}; {LICENCE}')
    if a.dry_run:
        for r, lang, sentences, notes in plan:
            print(f'  {r["order"]:4d}  {r["key"]:26s} [{r["voice"]}{" slow" if is_slow(r) else ""}] {r["text"]}\n        says: {synthesis_text(sentences)}' + (f'      ({"; ".join(notes)})' if notes else ''))
        for r in quiet:
            print(f'  silent {r["key"]:26s} {r.get("text", "")}  ({silent[r["key"]]})')
    if bad:
        print(f'\n{len(bad)} thing{"s" if len(bad) != 1 else ""} cannot be said. Nothing was written. Fix the text, or add the word to {os.path.relpath(respell_path, ROOT)}:', file=sys.stderr)
        for key, text, pr in bad:
            print(f'  x {key}  «{text}»: {pr}', file=sys.stderr)
        return 2
    if a.dry_run:
        print('dry run: every check passed; no model loaded, nothing written.')
        return 0

    np = np_()
    import soundfile as sf
    os.makedirs(a.out, exist_ok=True)
    engines = {}
    recognisers = load_recognisers(a.verify) if a.verify else {}
    tries = max(1, a.tries or (3 if recognisers else 1))
    known = {}
    if a.takes:
        with open(a.takes, encoding='utf-8') as f:
            known = {c['key']: c['seed'] for c in json.load(f).get('clips', []) if c.get('seed') is not None}
    by_key = {r['key']: r for r in manifest.get('clips', [])}
    said_of = {r['key']: spoken(sentences) for r, _, sentences, _ in plan}

    def judge(x, lang, said, key):
        """what each recogniser hears, its CER, and a score: the CERs added up, plus one for each recogniser that
        hears the other word of the clip's pair instead"""
        other = by_key.get(partner_key(key) or '')
        target = spoken(prepare(other['text'], 'gn', respell)[0]) if other else None
        heard, rates, wrong = {}, {}, []
        for name, rec in recognisers.items():
            if rec.can(lang):
                heard[name] = rec.hear(x, lang)
                e, n = cer(said, heard[name])
                rates[name] = e / n
                if target and normal(target) != normal(said) and normal(heard[name]) == normal(target):
                    wrong.append(name)
        return {'heard': heard, 'cer': rates, 'as_partner': wrong, 'score': sum(rates.values()) + len(wrong), 'partner': other['text'] if other else ''}

    report, made, failed, skipped = [], 0, [], 0
    for r, lang, sentences, notes in plan:
        key = r['key']
        path = os.path.join(a.out, key + '.wav')
        rate = SLOW if is_slow(r) else 1.0
        said = said_of[key]
        best, last = None, ''
        if os.path.exists(path) and not a.redo:
            skipped += 1
            if not recognisers:
                continue
            x, sr = sf.read(path, dtype='float32')           # a clip that is there is judged as it is
            best = dict(judge(x, lang, said, key), seed=None, attempt=0, x=x)
        else:
            if lang not in engines:
                engines[lang] = Voice(lang)
            seeds = [known[key]] if key in known else [seed_of(key, a.seed, n) for n in range(tries + 2)]
            for n, seed in enumerate(seeds):
                if n >= tries and best is not None:
                    break                        # the two extra seeds are only for a take whose cut was not clean
                try:
                    x = finish(engines[lang].say(sentences, seed, rate), pitch.get(r['voice'], 0.0) if VOICES[r['voice']]['lang'] == lang else 0.0)
                except ValueError as err:        # no clear pause after any carrier: the next seed
                    last = str(err)
                    continue
                take = dict(judge(x, lang, said, key), seed=seed, attempt=n, x=x)
                if best is None or take['score'] < best['score']:
                    best = take
                if take['score'] == 0:
                    break
            if best is None:
                failed.append((key, last))
                print(f'  x {key}: {last}', flush=True)
                continue
            write_wav(path, best['x'])
            made += 1
        x = best['x']
        row = {'key': key, 'voice': r['voice'], 'lang': lang, 'slow': is_slow(r), 'text': r['text'], 'said': said, 'seconds': round(len(x) / RATE, 2),
               'peak': round(float(np.abs(x).max()), 3), 'seed': best['seed'], 'take': best['attempt'] + 1}
        for name, h in best['heard'].items():
            row[f'heard_{name}'] = h
            row[f'cer_{name}'] = round(best['cer'][name], 3)
        if best['partner']:
            row['partner'] = best['partner']
            row['heard_as_partner'] = ', '.join(best['as_partner'])
        report.append(row)
        heard = ''.join(f'  {n}: «{normal(h)}» {100 * best["cer"][n]:.0f}%' for n, h in best['heard'].items())
        print(f'  {r["order"]:4d}  {key:26s} [{r["voice"]}{" slow" if rate != 1 else ""}] {len(x) / RATE:5.2f} s  {said}{heard}' + (f'  (take {best["attempt"] + 1})' if best['attempt'] else ''), flush=True)

    used = sorted({r['voice'] for r, _, _, _ in plan})
    credits = {
        'kind': 'synthetic',
        'model': ' + '.join(MODELS[l] for l in sorted({VOICES[v]['lang'] for v in used}, reverse=True)),
        'licence': LICENCE,
        'made': datetime.date.today().isoformat(),
        'note': 'synthetic stand-ins made by tools/make-tts.py (see sound/VOICE.md): the screens say «voz sintética»; the studio\'s recordings (CC BY 4.0) replace them',
        'voices': {v: {'name': f'MMS-TTS {"guaraní" if VOICES[v]["lang"] == "gn" else "castellano"} (Meta AI)' + (f', tono {pitch[v]:+g} semitonos' if pitch[v] else ''),
                       'kind': 'synthetic', 'model': MODELS[VOICES[v]['lang']], 'licence': LICENCE} for v in used},
    }
    with open(os.path.join(a.out, 'voices.json'), 'w', encoding='utf-8') as f:
        json.dump(credits, f, ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(f'{made} clips written to {a.out} ({skipped} were there already, {len(failed)} failed); voices.json marks them synthetic; manifest.json is the manifest without its {len(silent)} silent rows.')
    if recognisers and report:
        write_report(a.out, report, list(recognisers))
    print(f'Next: node tools/make-sound.mjs {a.out} --manifest {os.path.join(a.out, "manifest.json")} --kind synthetic')
    return 1 if failed else 0


def write_report(out, report, names):
    """tts-report.csv (one row a clip) and tts-report.json (the rows, the totals, the pairs that are not told apart)"""
    fields = ['key', 'voice', 'lang', 'slow', 'text', 'said', 'seconds', 'peak', 'seed', 'take'] + [f'{p}_{n}' for n in names for p in ('heard', 'cer')] + ['partner', 'heard_as_partner']
    with open(os.path.join(out, 'tts-report.csv'), 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        w.writeheader()
        w.writerows(report)
    totals = {}
    for n in names:
        for label, pick in (('words', lambda r: ' ' not in r['said']), ('sentences', lambda r: ' ' in r['said'])):
            for lang in ('gn', 'es'):
                rows = [r for r in report if pick(r) and r['lang'] == lang and f'cer_{n}' in r]
                if not rows:
                    continue
                e = sum(cer(r['said'], r[f'heard_{n}'])[0] for r in rows)
                c = sum(cer(r['said'], r[f'heard_{n}'])[1] for r in rows)
                totals[f'{n} {lang} {label}'] = {'clips': len(rows), 'cer': round(e / c, 4), 'heard_exactly': sum(1 for r in rows if r[f'cer_{n}'] == 0)}
    by_key = {r['key']: r for r in report}
    same, swapped = [], [r['key'] for r in report if r.get('heard_as_partner')]
    for r in report:                       # a pair whose two words every recogniser hears as one and the same
        other = by_key.get(partner_key(r['key']) or '')
        if other and r['key'] < other['key'] and normal(r['said']) != normal(other['said']):
            heard = [(normal(r.get(f'heard_{n}', '')), normal(other.get(f'heard_{n}', ''))) for n in names if f'heard_{n}' in r and f'heard_{n}' in other]
            if heard and all(x == y for x, y in heard):
                same.append(f'{r["key"]} / {other["key"]} ({r["text"]} / {other["text"]})')
    with open(os.path.join(out, 'tts-report.json'), 'w', encoding='utf-8') as f:
        json.dump({'made': datetime.date.today().isoformat(), 'recognisers': {n: RECOGNISERS[n] for n in names}, 'totals': totals,
                   'heard_as_partner': swapped, 'pairs_heard_the_same': same, 'clips': report}, f, ensure_ascii=False, indent=1)
    print('round trip (CER against the text that was said; a recogniser is no judge of nasal vowels, the puso or the stress):')
    for k, v in totals.items():
        print(f'  {k:22s} {100 * v["cer"]:5.1f} %  ({v["heard_exactly"]} of {v["clips"]} heard exactly)')
    if swapped:
        print('  heard as the other word of its pair: ' + ', '.join(f'{k} ({by_key[k]["text"]} as {by_key[k]["partner"]})' for k in swapped))
    if same:
        print('  pairs every recogniser hears as one word: ' + '; '.join(same))
    print(f'  written: {os.path.join(out, "tts-report.csv")}, tts-report.json')


if __name__ == '__main__':
    try:
        sys.exit(main())
    except BrokenPipeError:          # the listing was piped into head
        os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())
        sys.exit(0)
