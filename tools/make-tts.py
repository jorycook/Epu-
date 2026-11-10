#!/usr/bin/env python3
"""Synthetic voice for the course's clips: a stand-in until native recordings exist (notes G4 §4.2 and §6).
What it says well, what it does not, and every number measured are in sound/VOICE.md. Read that before shipping a clip.

Reads sound/<level>/manifest.json (tools/sound-list.mjs), says every row that is recorded (not put together from lines,
not the tone, not said already under another key) and writes into a folder: one WAV per key (16 kHz, mono, 16 bit),
voices.json (the credits, marked synthetic, with the licence), manifest.json (the manifest it was given without the rows
that stay silent), takes.json (the seed and the cut of every clip, and what was left out) and, with --verify,
tts-report.csv and tts-report.json. Then tools/make-sound.mjs turns the folder into the app's sound files.

usage:  python3 tools/make-tts.py --out <folder> --verify [both|ivan|mms] [--manifest sound/A1/manifest.json]
                                  [--only <key or pattern> ...] [--voices F,M,N] [--tries N] [--redo] [--seed N] [--pitch F=0,M=-2]
        python3 tools/make-tts.py --out <folder> --takes <takes.json>     the same clips again, without the recognisers
        python3 tools/make-tts.py --dry-run [--only ...]                  what would be said, and every check: no model, no --out
        then:   node tools/make-sound.mjs <folder> --manifest <folder>/manifest.json --kind synthetic
Ship only a folder made with --verify, or with --takes from one: without the recognisers nothing is left out by ear.

The voices: Meta's MMS-TTS, one VITS model a language (36 M weights, 145 MB each; a CPU is enough).
  facebook/mms-tts-grn   Guarani, one male speaker (median pitch 143 Hz on words, 150 Hz on sentences, measured). The
                         manifest's F is this voice as it is and M the same voice 2 semitones lower (ffmpeg's
                         rubberband, formants held: half held, the spectral envelope still moves 0.9 semitone), so that
                         the two speakers of a dialogue differ: F is not a woman's voice. The model's own pitch wanders
                         from line to line by more than those 2 semitones, so a line of three words or more in a
                         dialogue with both voices is moved towards its voice's pitch (TOWARDS: F up by at most 2
                         semitones towards 150 Hz, M down by 2 to 3 towards 126 Hz). More costs accuracy: a shift
                         upward takes single words from 14 % to 22 % CER on the large recogniser, 3 semitones down
                         take sentences from 15 % to 20 % on the independent one.
  facebook/mms-tts-spa   Spanish: the narrator (lang "es"), as it is; and a line of F or M that is nothing but a
                         Spanish number the Guarani model cannot say («Diez mil.» comes back «ndiehmi»), unshifted.
  Licence: CC BY-NC 4.0, NON-COMMERCIAL USE ONLY, with attribution (Pratap et al. 2023, "Scaling Speech Technology to
  1,000+ Languages", Meta AI). Clips made with these models may not ship in a paid or ad-funded app. The licence goes
  into voices.json, and from there into the sound files' headers and the sound index.
  Hosts: huggingface.co (small files) and us.aws.cdn.hf.co (the weights), with HF_HUB_DISABLE_XET=1 (the Xet hosts are
  not needed); or a filled Hugging Face cache (HF_HOME) with HF_HUB_OFFLINE=1. Python packages: torch, transformers,
  numpy, soundfile. ffmpeg with rubberband, for the pitch.

The text. The models know their own symbols only (lower-case letters, the puso, a dash) and their tokenizer drops
everything else without a word, so the text is prepared here and checked against the models' vocabularies (kept below,
and compared with the models' own when they load):
  - NFC, lower case, single spaces, the puso as U+0027 (the tokenizer drops ’ and ʼ: the word would lose its puso);
  - g̃ is not a symbol of the Guarani model: the tilde is written on the vowel after it (hag̃ua → haguã, ko'ág̃a →
    ko'ágã) or left to the nasal vowel that follows (og̃uahẽ → oguahẽ); the independent recogniser then writes g̃
    for it in 14 takes of 15, and in none for a plain g;
  - Spanish names, numbers and loans inside Guarani lines are respelled from sound/respell.json, for the synthesis text
    only (Juan → huan, Vicente → visénte, Teresa → terésa, Ana → ãna): the screens keep the course's spelling;
  - . ? ! … ; : end a sentence (a pause of 0.42 s); a comma makes no pause; ¿ ¡ « » and double quotes are left out.
    The models have no punctuation at all: a question is not said differently from a statement;
  - a digit is said in words in a Spanish line and stops the run in a Guarani one (the model says «1» as noise);
  - anything else stops the run before the first clip, with the key and the character named. Nothing is dropped
    silently. So does a word the Guarani model would misread (letters outside Guarani spelling, a name in the middle
    of a sentence) that sound/respell.json does not list.

How a clip is said. Both models garble a short utterance said on its own (ka'a comes back as «haha», «uno» as «gono»),
so every sentence is said after a carrier, «ha upéi he'i» ("and then he said"), in one utterance, and the carrier is
cut off. Two cuts (Voice.say):
  - after a pause: «ha upéi he'i — …»; the cut is in the pause the model makes for the dash, found with the model's own
    alignment (a hook on its duration predictor), and the clip starts 10 ms inside the place of its first letter,
    because the model hums before it. This is the cut of every sentence but the ones below.
  - run in: «ha upéi he'i …» without dash or pause, for a line of one or two words that opens with p, t, k or j; the
    cut is in the closure of that consonant, 25 ms before its burst (40 ms for j, whose closure is voiced and belongs
    to the sound). After a pause the model opens such a word badly (kesu came back «hechu» and «Jesús», ka'aru
    «haarou», jagua with a voiceless start); in running speech the closure and the burst are there. Measured on 156
    takes: both recognisers hear wrong letters in 13 run-in takes against 31 after a pause. The price: the word comes
    at the end of the carrier's phrase and is lower and shorter (median pitch 99 Hz against 136 Hz, 0.43 s against
    0.52 s on 16 words); shorter carriers and a shift upward both cost more than they give. A longer line that opens
    with one of these letters keeps the cut after a pause for its first take and has the run-in cut for its second.
A line of two words or fewer is said with the model's noise scale at 0.33 instead of 0.667 (measured: 145 single words
go from 19.7 % to 17.8 % CER on the independent recogniser); the duration noise stays at 0.8. A slow take (a row with
"slow", a key ending in .slow) is the normal take of the same line said again, with its seed, its cut and its pitch, at
a lower speaking rate: the same seed draws the same lengths, so every sound is as long or longer. With a seed of its
own, one slow take in six came out no slower than the normal one. The rate is 0.8, then 0.74, then 0.68, until what is
said (from the first sound to the last, by the model's alignment) takes 1.15 times as long as in the normal take: the
model rounds every length up to whole frames of 16 ms, so 0.8 gives 1.1 to 1.25 times the length. Each clip's first
seed comes from its key, so a rebuild on the same machine gives the same audio; the seed, the cut and the rate of
every clip are in takes.json. The samples depend on the thread count in the sixth decimal (THREADS, 3), and M's pitch
shift turns that into another waveform: ship the WAVs that were verified, or make them again with the same thread count.

--verify sends each clip back through the speech recognisers found in the cache and writes what each heard and its
character error rate (CER) against the text that was said:
  ivan  ivangtorre/wav2vec2-xlsr-300m-guarani (1.2 GB): independent of the voice; 11.0 % CER on 93 clips of real
        Guarani speech it was not trained on.
  mms   facebook/mms-1b-all, adapter grn (3.9 GB, about 5 GB of memory): from the same project and data as the voice,
        so it flatters it (6.5 % on the same real speech). Spanish lines are judged by its spa adapter alone.
With --tries N (3 under --verify), a clip that is not heard as written is said again (the other cut, then the next
seed) and the best take is kept, a take heard as the other word of its sound pair counting as the worst. Then --verify
leaves out by itself (left_out_by_ear) every Guarani clip of one or two words that a learner hears on its own and that
both recognisers hear with wrong letters, with the other word of its pair; the clips go to <out>/left-out/ for a
listener, the rows leave <out>/manifest.json, and sound/silent.json's "keep" frees one once a person has heard it. It
flags, without leaving them out, the words of a sound pair with a mark (puso, tilde, acute) that no recogniser writes.
--takes <takes.json> says the same takes again without the recognisers and leaves the same rows out; it stops if a clip
has no take in the file. A recogniser cannot tell whether a vowel is nasal, a puso is a glottal stop or a stress is
right: sound/VOICE.md has what was measured for each sound the course teaches. The clips that must stay silent
whatever a recogniser hears are named in sound/silent.json: they are not said, and <out>/manifest.json leaves them out,
so the screens keep their written stand-in there.

The first draft of this tool could also drive a Piper voice. No Guarani Piper voice exists to test it with, so that
path is gone (git history has it).
"""
import argparse
import csv
import datetime
import fnmatch
import json
import math
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
THREADS = 3         # the samples depend on it in the sixth decimal, and M's pitch shift turns that into another waveform
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

VOICES = {          # the manifest's voices: which model, and how far its pitch is moved (semitones, rubberband with the formants held)
    'F': {'lang': 'gn', 'semitones': 0.0},          # the model as it is: a shift upward costs single words 3 to 8 points of CER
    'M': {'lang': 'gn', 'semitones': -2.0},         # costs 1 point on sentences and 3 on lines of one to four words; 3 semitones cost more
    'N': {'lang': 'es', 'semitones': 0.0},
}
# The model's own pitch wanders from line to line (medians from 113 to 178 Hz) by more than M's two semitones, so in one
# exchange in four the man's line came out no lower than the woman's. A line of three words or more in a dialogue that has
# both voices is therefore moved towards its voice's pitch, within limits that sentences bear: (Hz, least, most semitones).
TOWARDS = {'F': (150.0, 0.0, 2.0), 'M': (126.0, -3.0, -2.0)}
CARRIER = {          # said before every sentence and cut off; the next one is tried when the model makes no pause after the first
    'gn': ["ha upéi he'i", "upéi he'i chupe", "ko ñe'ẽ"],          # "and then he said", "then he said to him", "this word"
    'es': ['y entonces dijo', 'y luego le dijo'],
}
PAUSE = {'stop': 0.42}                     # seconds of silence between two sentences of a line (longer in a slow take)
SLOW = (0.8, 0.74, 0.68)                   # speaking rates of a slow take: the first that makes it SLOWER
SLOWER = 1.15                              # a slow take's sounds must take this many times as long as its normal take's
LEAD = -0.01                               # a sentence starts 10 ms inside the place the model's alignment gives its first symbol (it hums before)
RUN_IN = {'p': 0.025, 't': 0.025, 'k': 0.025, 'j': 0.040}          # the first letters a run-in take can be cut at (Voice.after_vowel), and how long before the release it starts
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


NO_RULES = {'contrasts': [], 'keys': [], 'texts': [], 'keep': []}


def load_silent(path):
    """sound/silent.json: which rows stay without audio. {"contrasts": ["nasal", …], "keys": ["pattern", …], "texts": […],
    "keep": ["pattern or text", …]}; "keep" names what --verify must not leave out by itself (a person heard it)."""
    if not path or not os.path.exists(path):
        return dict(NO_RULES)
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    return {'contrasts': list(data.get('contrasts') or []), 'keys': list(data.get('keys') or []),
            'texts': [clean(t).lower() for t in data.get('texts') or []], 'keep': [clean(t) for t in data.get('keep') or []]}


def kept_by_hand(row, rules):
    """True for a row that sound/silent.json's "keep" names, by key, by pattern or by text"""
    text = clean(row.get('text', '')).lower()
    return any(row['key'] == p or fnmatch.fnmatchcase(row['key'], p) or text == p.lower() for p in rules.get('keep', []))


def apply_silence(manifest, rules, more=None):
    """→ (the manifest without the rows that stay silent, {key: why}). Silent: the two words of a sound pair whose
    contrast is listed (the voice does not render it), the keys and the texts named, and the keys of `more` ({key: why}:
    what --verify left out). A recording a silent row held for other rows (the same word in a scene) passes to the first
    of them; a clip put together from a silent line is left out as a whole. The screens then keep their written stand-in
    for exactly those keys."""
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
        elif more and key in more:
            why[key] = more[key]
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


LINE = re.compile(r'\.l\d+(?:\.slow)?$')          # a line of a dialogue or of a listening item (tools/sound-list.mjs): never played on its own


def left_out_by_ear(manifest, report, names, rules):
    """What --verify leaves out by itself, and what it flags → ({key: why}, [lines that stay], [pair words flagged]).
    Left out: a Guarani clip of one or two words that a learner hears on its own (a scene word, a word of a pair, a
    short example, a word to write from dictation) and whose kept take every recogniser hears with wrong letters
    (`letters`: acutes, tildes and spaces aside). Two recognisers must have judged. The other word of a pair goes with
    it, a pair being one lesson, unless the word left out is the one no screen plays. A line of a dialogue stays,
    whatever was heard: the dialogue needs it; it is listed.
    Flagged, not left out: a word of a sound pair with a mark (the puso, a nasal tilde, an acute) that no recogniser
    writes at all. The recognisers leave marks out of real speech too, so a person decides (sound/silent.json: "keys").
    sound/silent.json's "keep" frees a row from being left out once a person has heard it."""
    clips = manifest.get('clips', [])
    by_key = {r['key']: r for r in clips}
    sharers = {}
    for r in clips:
        if r.get('same'):
            sharers.setdefault(r['same'], []).append(r['key'])
    out, stays, flags = {}, [], []
    for row in report:
        key = row['key']
        judged = [n for n in names if f'heard_{n}' in row]
        if row['lang'] != 'gn' or len(judged) < 2 or key not in by_key:
            continue
        heard = ' / '.join(f'«{normal(row[f"heard_{n}"])}»' for n in judged)
        users = [key] + sharers.get(key, [])
        if row.get('sentences', 1) == 1 and len(row['said'].split()) <= 2 and all(letters(row[f'heard_{n}']) != letters(row['said']) for n in judged):
            for k in users:
                if kept_by_hand(by_key[k], rules):
                    continue
                if LINE.search(k):
                    stays.append(f'{k} «{by_key[k].get("text", "")}» is heard with wrong letters by every recogniser ({heard}) and stays, as a line of a dialogue')
                else:
                    out[k] = f'heard with wrong letters by every recogniser: {heard}'
        missing = [kind for kind, n in marks_in(row['said']).items() if n and not any(marks_in(row[f'heard_{m}'])[kind] for m in judged)]
        if missing:
            flags += [f'{k} «{by_key[k].get("text", "")}»{" (no screen plays it today)" if by_key[k].get("unused") else ""}: no recogniser writes its {" or its ".join(missing)} ({heard})'
                      for k in users if partner_key(k) and k not in out]
    for k in list(out):                                   # the other word of a pair goes with it, unless the one left out is the one no screen plays
        p = partner_key(k)
        if p and p in by_key and p not in out and not by_key[k].get('unused') and not kept_by_hand(by_key[p], rules):
            out[p] = f'the other word of its pair, «{by_key[k].get("text", "")}», was left out'
    return out, stays, flags


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


def median_pitch(x, lo=65.0, hi=350.0):
    """median pitch of the voiced 40 ms frames of a clip, Hz (autocorrelation); 0.0 when nothing is voiced"""
    np = np_()
    n, hop = int(0.040 * RATE), int(0.010 * RATE)
    a, b = int(RATE / hi), int(RATE / lo)
    win = np.hanning(n)
    wc = np.correlate(win, win, 'full')[n - 1:]
    wc = wc / wc[0] + 1e-9
    found = []
    for s in range(0, len(x) - n, hop):
        frame = x[s:s + n]
        if np.sqrt((frame ** 2).mean()) < 0.01:
            continue
        frame = (frame - frame.mean()) * win
        ac = np.fft.irfft(np.abs(np.fft.rfft(frame, 2 * n)) ** 2)[:n]
        if ac[0] <= 1e-9:
            continue
        nac = ac / ac[0] / wc
        i = a + int(np.argmax(nac[a:b]))
        if nac[i] >= 0.45:
            found.append(RATE / i)
    return float(np.median(found)) if found else 0.0


def two_voice_lines(manifest):
    """the keys of the recordings that are lines of a dialogue with both a woman's and a man's line"""
    by_key = {r['key']: r for r in manifest.get('clips', [])}
    out = set()
    for r in manifest.get('clips', []):
        lines = [k for k in r.get('parts') or [] if by_key.get(k, {}).get('voice') in ('F', 'M')]
        if {by_key[k]['voice'] for k in lines} == {'F', 'M'}:
            out.update(lines)
    return out


def rubberband(x, semitones):
    """pitch moved with ffmpeg's rubberband, the tempo kept and the formants held (formant=preserved; measured, the
    spectral envelope still moves by about half the shift). With the formants moved, a number said by the Spanish voice
    came back as other words."""
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
        torch.set_num_threads(min(THREADS, torch.get_num_threads()))
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

    def after_pause(self, words, seed, rate, noise):
        """One sentence after a carrier and a dash, cut in the pause the model makes for the dash → (samples, where the
        piece starts, where it ends, the sentence's symbols with their places). The piece starts 10 ms inside the place
        of its first symbol: the model often hums before it."""
        for carrier in CARRIER[self.lang]:
            wave, spans = self.run(f'{carrier} — {words}', seed, rate, noise)
            d = len(carrier) + 1                   # the dash, between two spaces
            quiet = quiet_run(wave, spans[d - 1][1], spans[d + 1][2], level_db(wave).max() - 38)
            if quiet is not None and quiet[1] - quiet[0] >= int(0.08 * RATE):
                break                              # a pause of 80 ms or more: the cut is clean
        else:
            raise ValueError(f'no clear pause after any carrier (before «{words}»): the cut would not be clean')
        cut = (quiet[0] + quiet[1]) // 2
        a, b = trim_ends(wave[cut:])
        if LEAD is not None:
            a = min(max(a, spans[d + 2][1] - cut - int(LEAD * RATE)), b - 1)
        return wave, cut + a, cut + b, spans[d + 2:]

    def after_vowel(self, words, seed, rate, noise):
        """One sentence that opens with p, t, k or j, said right after the carrier, without a dash and without a pause,
        and cut in the closure of its first consonant, RUN_IN[letter] before the release → as after_pause, or None when
        the consonant shows no closure. After a pause the model often opens a word badly (kesu comes back «hechu»,
        ka'aru «haarou»); in running speech the closure and the burst are there, and the closure is a clean place to cut."""
        np = np_()
        for carrier in CARRIER[self.lang][:2]:
            wave, spans = self.run(f'{carrier} {words}', seed, rate, noise)
            d = len(carrier)                       # the space between the carrier and the sentence
            e = level_db(wave)
            va, vb = spans[d - 1][1], spans[d - 1][2]          # the carrier's last vowel
            i0, i1 = (va + vb) // 2 // 80, min(len(e) - 1, spans[d + 1][2] // 80 + 8)
            if i1 - i0 < 4:
                continue
            low = i0 + int(np.argmin(e[i0:i1]))
            if e[low] > float(e[va // 80:max(va // 80 + 1, vb // 80)].max()) - 15:
                continue                           # no closure worth the name
            rise = next((i for i in range(low + 1, min(len(e), i1 + 20)) if e[i] >= e[low] + 12), None)
            if rise is None:
                continue
            a = max((va + vb) // 2, rise * 80 - int(RUN_IN[words[0]] * RATE))
            b = a + trim_ends(wave[a:])[1]
            return wave, a, b, spans[d + 1:]
        return None

    def say(self, sentences, seed, rate=1.0, noise='auto', marks=None, run_in=False, cuts=None):
        """The sentences of one row → samples. Each sentence is one utterance after a carrier: cut off at the pause
        the model makes for the dash or, with run_in and for a sentence that opens with p, t, k or j, in the closure of
        that consonant (after_vowel). The sentences are PAUSE['stop'] apart. A comma makes no pause (measured: a pause
        inside a sentence costs more than it gives, the voice starts badly after each one). `marks`, a list, receives
        where each symbol sits in the result: (symbol, start sample, end sample); `cuts`, a list, how each sentence
        was cut: 'closure' or 'pause'."""
        np = np_()
        out, at = [], 0
        for n, phrases in enumerate(sentences):
            words = ' '.join(phrases)
            use = (NOISE_WORD if len(words.split()) <= 2 else None) if noise == 'auto' else noise
            piece = self.after_vowel(words, seed + n, rate, use) if run_in and words[0] in RUN_IN else None
            if cuts is not None:
                cuts.append('closure' if piece else 'pause')
            wave, a, b, spans = piece or self.after_pause(words, seed + n, rate, use)
            if n:
                gap = int(PAUSE['stop'] / rate * RATE)
                out.append(np.zeros(gap, dtype='float32'))
                at += gap
            out.append(wave[a:b].copy())
            if marks is not None:
                for sym, sa, sb in spans:
                    marks.append((sym, max(0, sa - a) + at, max(0, min(sb, b) - a) + at))
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
    """lower case, no punctuation, one apostrophe, NFC, single spaces, and g̃ written the way the voice is given it
    (g_tilde: a recogniser that hears «ag̃aite» for agãite heard it right): both sides of the comparison"""
    s = unicodedata.normalize('NFC', s).translate(PUSO).lower()
    s = re.sub(r'\s+', ' ', re.sub(r"[^\w'̃ ]|[\d_]", ' ', s)).strip()
    return ' '.join(g_tilde(w) for w in s.split()).replace(TILDE, '')


ORAL = str.maketrans('áéíóúýãẽĩõũỹ', 'aeiouyaeiouy')


def letters(s):
    """the letters alone: `normal` without acutes, tildes and spaces. The recognisers leave an acute or a tilde out of
    real speech too (the independent one writes the ó of real speech in 42 % of its places and the õ in 46 %; the large
    one in 92 % and 62 %), so a missing mark is not a wrong letter; the puso is one. A c that is not ch is the k the
    recognisers sometimes write the Spanish way («jacaru», «carai»)."""
    return re.sub(r'c(?!h)', 'k', normal(s).translate(ORAL).replace(' ', ''))


MARKS = {'puso': "'", 'tilde': 'ãẽĩõũỹ', 'acute': 'áéíóúý'}


def marks_in(s):
    """how many of each taught mark a text has: {'puso': n, 'tilde': n, 'acute': n}"""
    s = normal(s)
    return {kind: sum(s.count(c) for c in chars) for kind, chars in MARKS.items()}


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
        torch.set_num_threads(min(THREADS, torch.get_num_threads()))
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
    p.add_argument('--out', default='', help='the folder for the WAVs, voices.json, manifest.json, takes.json and the report (not needed with --dry-run)')
    p.add_argument('--respell', default=os.path.join('sound', 'respell.json'), help='names, numbers and loans as the Guarani voice must read them')
    p.add_argument('--silent', default=os.path.join('sound', 'silent.json'), help='which clips stay without audio (pairs of a contrast the voice does not render); "none" for no rule')
    p.add_argument('--voices', default='F,M,N', help='which voices of the manifest to say')
    p.add_argument('--only', nargs='*', default=None, help='only these keys (shell patterns allowed: "a1u01d1.*")')
    p.add_argument('--redo', action='store_true', help='say again the keys whose WAV exists')
    p.add_argument('--dry-run', action='store_true', help='list what would be said and run every check; load no model, write nothing')
    p.add_argument('--verify', nargs='?', const='auto', default='', choices=['auto', 'both', 'ivan', 'mms'],
                   help='send every clip back through the recognisers in the cache (both by default), keep the best of --tries takes, leave out '
                        'the short clips both hear wrong, and write tts-report.csv and .json')
    p.add_argument('--tries', type=int, default=0, help='with --verify: how many seeds to try for a clip that is not heard as written (default 3)')
    p.add_argument('--takes', default='', help='the takes.json (or tts-report.json) of an earlier run: its seeds are used again and what it left out stays out, '
                                               'so the same clips come out without the recognisers')
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


def load_takes(path):
    """takes.json or tts-report.json of a run → {'clips': {key: its row}, 'left_out': {key: why}, 'with': what it was made
    with, 'verified': whether recognisers heard it}; empty when there is no file"""
    if not path or not os.path.exists(path):
        return {'clips': {}, 'left_out': {}, 'with': {}, 'verified': False}
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    return {'clips': {c['key']: c for c in data.get('clips', []) if 'left_out' not in c}, 'left_out': dict(data.get('left_out') or {}),
            'with': data.get('with') or {}, 'verified': bool(data.get('verified', 'recognisers' in data))}


def made_with():
    """what the samples depend on besides the seed: the library and how many threads it computes with"""
    import torch
    import transformers
    return {'torch': torch.__version__, 'transformers': transformers.__version__, 'threads': torch.get_num_threads()}


def main(argv=None):
    a = parse_args(argv)
    with open(in_root(a.manifest), encoding='utf-8') as f:
        source = json.load(f)
    respell_path = in_root(a.respell)
    respell = load_respell(respell_path)
    rules = dict(NO_RULES) if a.silent == 'none' else load_silent(in_root(a.silent))
    # what an earlier --verify run left out stays out: the run named by --takes, or else this folder's own last one
    # (a run with --verify judges afresh what it says or finds: everything, or the keys of --only)
    before = load_takes(os.path.join(a.out, 'takes.json') if a.out else '')
    given = load_takes(a.takes) if a.takes else None
    if a.takes and not given['clips']:
        print(f'{a.takes}: no takes in it', file=sys.stderr)
        return 2
    earlier = dict(given['left_out']) if given else dict(before['left_out'])
    if a.verify and not given:
        earlier = {k: v for k, v in earlier.items() if a.only is not None and not matches(k, a.only)}
    earlier = {k: v if v.startswith('left out') else f'left out by --verify: {v}' for k, v in earlier.items()}
    manifest, silent = apply_silence(source, rules, earlier)
    voices = [v.strip() for v in a.voices.split(',') if v.strip()]
    pitch = {v: VOICES[v]['semitones'] for v in VOICES}
    own_pitch = set()          # the voices whose pitch --pitch fixes: their lines are not moved one by one
    for part in filter(None, a.pitch.split(',')):
        v, _, n = part.partition('=')
        pitch[v.strip()] = float(n)
        own_pitch.add(v.strip())
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
          f'{len(quiet)} rows left silent ({sum(1 for r in quiet if silent[r["key"]].startswith("left out"))} of them by an earlier --verify, the rest by '
          f'{os.path.basename(a.silent)}); Guarani {MODELS["gn"]}, Spanish {MODELS["es"]}; {LICENCE}')
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
    said_of = {r['key']: spoken(sentences) for r, _, sentences, _ in plan}

    def as_before(r, key):
        """True when the clip in the folder was made from the text and for the voice the row has now"""
        old = before['clips'].get(key)
        return old is None or (old.get('said') == said_of[key] and old.get('voice') == r['voice'])

    # A recording whose row has gone silent since the folder was made (sound/silent.json changed) passes to the row that
    # holds it now, a line of a dialogue with the same words: the take is the same, under its new key.
    held = {(c.get('text'), c.get('voice'), bool(c.get('slow'))): c for c in before['clips'].values()
            if c['key'] in silent and os.path.exists(os.path.join(a.out, c['key'] + '.wav'))}
    for r, _, _, _ in plan:
        path, donor = os.path.join(a.out, r['key'] + '.wav'), held.get((r['text'], r['voice'], is_slow(r)))
        if donor and not os.path.exists(path) and donor.get('said') == said_of[r['key']]:
            with open(os.path.join(a.out, donor['key'] + '.wav'), 'rb') as f, open(path, 'wb') as g:
                g.write(f.read())
            before['clips'][r['key']] = dict(donor, key=r['key'], recorded_as=donor['key'])
    to_say = [r['key'] for r, _, _, _ in plan if a.redo or not os.path.exists(os.path.join(a.out, r['key'] + '.wav')) or not as_before(r, r['key'])]
    if given:
        unknown = [k for k in to_say if given['clips'].get(k, {}).get('seed') is None or given['clips'][k].get('said') != said_of[k]]
        if unknown:
            print(f'--takes {a.takes} has no take of {len(unknown)} clip{"s" if len(unknown) != 1 else ""} (not in it, found without a seed, or the text changed since): '
                  f'{", ".join(unknown[:12])}{" …" if len(unknown) > 12 else ""}. Nothing was written. Say them with --verify (no --takes), or name the others with --only.', file=sys.stderr)
            return 2
    engines = {}
    recognisers = load_recognisers(a.verify) if a.verify else {}
    tries = max(1, a.tries or (3 if recognisers else 1))
    by_key = {r['key']: r for r in manifest.get('clips', [])}
    in_two_voices = two_voice_lines(manifest)
    done = {}          # key → this run's row of the report: its seed and its length are what a slow take is made from

    def judge(x, lang, said, key, short):
        """what each recogniser hears, its CER, and a score: the CERs added up, plus one for each recogniser that
        hears the other word of the clip's pair instead, plus one when the clip is short and every recogniser hears
        wrong letters (such a take is left out in the end: another one may do better)"""
        other = by_key.get(partner_key(key) or '')
        target = spoken(prepare(other['text'], 'gn', respell)[0]) if other else None
        heard, rates, wrong, off = {}, {}, [], []
        for name, rec in recognisers.items():
            if rec.can(lang):
                heard[name] = rec.hear(x, lang)
                e, n = cer(said, heard[name])
                rates[name] = e / n
                if target and normal(target) != normal(said) and normal(heard[name]) == normal(target):
                    wrong.append(name)
                if letters(heard[name]) != letters(said):
                    off.append(name)
        all_off = short and len(heard) >= 2 and len(off) == len(heard)
        return {'heard': heard, 'cer': rates, 'as_partner': wrong, 'letters_wrong': off, 'score': sum(rates.values()) + len(wrong) + (1 if all_off else 0),
                'partner': other['text'] if other else ''}

    def normal_take(key):
        """for a slow take: the key of the take at the normal rate it is the slow version of, and that take's row (this
        run's, or the folder's from an earlier run: its seed, its cut, its pitch) or None when there is none"""
        base = by_key.get(key[:-len('.slow')]) if key.endswith('.slow') else None
        if base is None:
            return None, None
        k = base.get('same') or base['key']
        old = done.get(k) or (before['clips'].get(k) if os.path.exists(os.path.join(a.out, k + '.wav')) else None)
        if old is None or old.get('seed') is None or old.get('said') != said_of.get(key, old.get('said')):
            return k, None
        return k, old

    def body(marks):
        """seconds from the start of the first sound to the start of the last one, by the model's alignment: the length of
        what is said, without the silence before the first burst and the dying away of the last sound, which the trim
        of a clip cuts as it finds them"""
        return (marks[-1][1] - marks[0][1]) / RATE if len(marks) > 1 else 0.0

    report, made, failed, skipped = [], 0, [], 0
    for r, lang, sentences, notes in plan:
        key = r['key']
        path = os.path.join(a.out, key + '.wav')
        slow = is_slow(r)
        said = said_of[key]
        short = lang == 'gn' and len(sentences) == 1 and len(said.split()) <= 2
        placed = key in in_two_voices and r['voice'] in TOWARDS and VOICES[r['voice']]['lang'] == lang and len(said.split()) >= 3 and r['voice'] not in own_pitch
        base_key, base = normal_take(key) if slow else (None, None)
        best, last = None, ''
        old = before['clips'].get(key, {})
        if key not in to_say:
            skipped += 1
            x, sr = sf.read(path, dtype='float32')           # a clip that is there is judged as it is
            best = dict(judge(x, lang, said, key, short) if recognisers else {'heard': {}, 'cer': {}, 'as_partner': [], 'letters_wrong': [], 'partner': ''},
                        seed=old.get('seed'), attempt=(old.get('take') or 1) - 1 if old.get('seed') is not None else None, x=x)
        else:
            if lang not in engines:
                engines[lang] = Voice(lang)
            base_body = None
            if given:
                takes_to_try = [(given['clips'][key]['seed'], given['clips'][key].get('cut') == 'closure', given['clips'][key].get('rate') or (SLOW[0] if slow else 1.0))]
            elif base:
                # A slow take is the normal take of the same line said again, with its seed and its cut, at a lower rate:
                # the same seed draws the same lengths, and each sound is then as long or longer. The rate goes down
                # until what is said takes SLOWER times as long (the model rounds every length up to whole frames of
                # 16 ms, so 0.8 of the rate gives 1.1 to 1.25 times the length). No other seed is tried: with a seed of
                # its own, one slow take in six came out no slower than the normal one.
                normal_marks = []
                engines[lang].say(sentences, base['seed'], 1.0, run_in=base.get('cut') == 'closure', marks=normal_marks)
                base_body = body(normal_marks)
                takes_to_try = [(base['seed'], base.get('cut') == 'closure', rate) for rate in SLOW]
            else:
                # Each seed is another take. A line that opens with p, t, k or j can also be cut two ways (Voice.say): both
                # are tried with a seed before the next seed, the run-in cut first for a line of one or two words (measured
                # on those: both recognisers hear wrong letters in 13 takes of 156, against 31 after a pause).
                own = [seed_of(base_key or key, a.seed, n) for n in range(tries + 2)]
                opens = [' '.join(sn)[0] for sn in sentences] if lang == 'gn' else []
                ways = [False] if not any(c in RUN_IN for c in opens) else ([True, False] if short and opens[0] in RUN_IN else [False, True])
                takes_to_try = [(sd, way, SLOW[0] if slow else 1.0) for sd in own for way in ways]
            tried = set()
            n = -1
            tried_takes = []
            for seed, run_in, rate in takes_to_try:
                if best is not None and (best.get('too_fast') is False or (n + 1 >= tries and not best.get('too_fast'))):
                    break                        # a slow take that is slow enough; or the takes --tries allows (the extra ones are for a cut that was not clean)
                cuts, marks = [], []
                try:
                    raw = engines[lang].say(sentences, seed, rate, run_in=run_in, cuts=cuts, marks=marks)
                except ValueError as err:        # no clear pause after any carrier: the next take
                    last = str(err)
                    continue
                cut = 'closure' if 'closure' in cuts else 'pause'
                if (seed, cut, rate) in tried:
                    continue                     # the consonant showed no closure: this is the take after a pause again
                tried.add((seed, cut, rate))
                n += 1
                semitones = pitch.get(r['voice'], 0.0) if VOICES[r['voice']]['lang'] == lang else 0.0
                hz = median_pitch(raw)
                if given and given['clips'][key].get('semitones') is not None:
                    semitones = given['clips'][key]['semitones']          # the same take again: the pitch it was given then
                elif base and base.get('semitones') is not None and base_body:
                    semitones = base['semitones']          # the slow take of a line keeps the pitch its normal take was given
                elif placed and hz:              # a line of a dialogue with both voices: towards its voice's own pitch
                    aim, least, most = TOWARDS[r['voice']]
                    semitones = round(max(least, min(most, 12 * math.log2(aim / hz))), 2)
                x = finish(raw, semitones)
                take = dict(judge(x, lang, said, key, short) if recognisers else {'heard': {}, 'cer': {}, 'as_partner': [], 'letters_wrong': [], 'partner': '', 'score': 0},
                            seed=seed, attempt=n, x=x, semitones=semitones, cut=cut, rate=rate)
                if base_body:
                    take['ratio'] = body(marks) / base_body
                    take['too_fast'] = take['ratio'] < SLOWER
                    take['score'] = -take['ratio']          # the slowest that was tried, if none is slow enough
                tried_takes.append(dict({'seed': seed, 'cut': cut, 'rate': rate, 'semitones': semitones, 'seconds': round(len(x) / RATE, 2)},
                                        **{f'heard_{k}': v for k, v in take['heard'].items()}, **{f'cer_{k}': round(v, 3) for k, v in take['cer'].items()}))
                if best is None or take['score'] < best['score']:
                    best = take
                if take['score'] == 0 and not base_body:
                    break
            if best is None:
                failed.append((key, last))
                print(f'  x {key}: {last}', flush=True)
                continue
            write_wav(path, best['x'])
            made += 1
        x = best['x']
        row = {'key': key, 'voice': r['voice'], 'lang': lang, 'slow': slow, 'text': r['text'], 'said': said, 'sentences': len(sentences), 'seconds': round(len(x) / RATE, 2),
               'peak': round(float(np.abs(x).max()), 3), 'seed': best['seed'], 'take': None if best['attempt'] is None else best['attempt'] + 1,
               'semitones': best['semitones'] if 'semitones' in best else old.get('semitones'), 'hz': round(median_pitch(x)),
               'cut': best['cut'] if 'cut' in best else old.get('cut'), 'rate': best['rate'] if 'rate' in best else old.get('rate')}
        if 'ratio' in best:
            row['slow_ratio'] = round(best['ratio'], 2)
        elif key not in to_say and old.get('slow_ratio'):
            row['slow_ratio'] = old['slow_ratio']
        if key not in to_say and old.get('recorded_as'):
            row['recorded_as'] = old['recorded_as']
        if key in to_say and recognisers:
            row['tried'] = tried_takes          # every take that was heard, the kept one among them: what one take alone scores
        for name, h in best['heard'].items():
            row[f'heard_{name}'] = h
            row[f'cer_{name}'] = round(best['cer'][name], 3)
        if best['heard']:
            row['letters_wrong'] = ', '.join(best['letters_wrong'])
        if best['partner']:
            row['partner'] = best['partner']
            row['heard_as_partner'] = ', '.join(best['as_partner'])
        report.append(row)
        done[key] = row
        heard = ''.join(f'  {n}: «{normal(h)}» {100 * best["cer"][n]:.0f}%' for n, h in best['heard'].items())
        print(f'  {r["order"]:4d}  {key:26s} [{r["voice"]}{" slow" if slow else ""}] {len(x) / RATE:5.2f} s  {said}{heard}' + (f'  (take {best["attempt"] + 1})' if best['attempt'] else '')
              + ('  (run in)' if row['cut'] == 'closure' else '') + (f'  ({row["semitones"]:+g} st)' if row['semitones'] else '')
              + (f'  (×{row["slow_ratio"]:.2f} the normal take)' if 'slow_ratio' in row else ''), flush=True)

    # what the recognisers leave out: short clips heard wrong by both, pair words whose taught mark neither writes
    names = list(recognisers)
    left, stays, flags = left_out_by_ear(manifest, report, names, rules) if recognisers else ({}, [], [])
    if left:
        manifest, silent = apply_silence(source, rules, {**earlier, **{k: 'left out by --verify: ' + v for k, v in left.items()}})
        mine = {(row['text'], row['voice'], row['slow']): row for row in report}
        for r in select(manifest, [v for v in voices if v in VOICES], a.only):          # a line of a dialogue that shared a recording now left out: the take is its own
            path, donor = os.path.join(a.out, r['key'] + '.wav'), mine.get((r['text'], r['voice'], is_slow(r)))
            if donor and not os.path.exists(path):
                with open(os.path.join(a.out, donor['key'] + '.wav'), 'rb') as f, open(path, 'wb') as g:
                    g.write(f.read())
                report.append(dict(donor, key=r['key'], recorded_as=donor['key']))
        for row in report:
            if row['key'] in silent:
                row['left_out'] = silent[row['key']]
    left_out = {k: v for k, v in silent.items() if v.startswith('left out')}
    for key in silent:                                     # what stays silent is kept for a listener, outside the folder make-sound.mjs reads
        if os.path.exists(os.path.join(a.out, key + '.wav')):
            os.makedirs(os.path.join(a.out, 'left-out'), exist_ok=True)
            os.replace(os.path.join(a.out, key + '.wav'), os.path.join(a.out, 'left-out', key + '.wav'))

    used = sorted({r['voice'] for r in select(manifest, [v for v in voices if v in VOICES], None)})          # every voice of the folder, not only this run's keys

    def tone(v):
        """how far the voice's pitch is moved, for the credits (in Spanish, as the screens show them)"""
        if v in TOWARDS and v not in own_pitch:
            least, most = sorted((abs(TOWARDS[v][1]), abs(TOWARDS[v][2])))
            if pitch[v] or least:
                return f', tono {least:g} a {most:g} semitonos más {"grave" if TOWARDS[v][2] <= 0 else "agudo"}'
            return f'; en los diálogos, hasta {most:g} semitonos más {"grave" if TOWARDS[v][2] <= 0 else "agudo"}' if most else ''
        return f', tono {pitch[v]:+g} semitonos' if pitch[v] else ''
    credits = {
        'kind': 'synthetic',
        'model': ' + '.join(MODELS[l] for l in sorted({VOICES[v]['lang'] for v in used}, reverse=True)),
        'licence': LICENCE,
        'made': datetime.date.today().isoformat(),
        'note': 'synthetic stand-ins made by tools/make-tts.py (see sound/VOICE.md): the screens say «voz sintética»; the studio\'s recordings (CC BY 4.0) replace them',
        'voices': {v: {'name': f'MMS-TTS {"guaraní" if VOICES[v]["lang"] == "gn" else "castellano"} (Meta AI)' + tone(v),
                       'kind': 'synthetic', 'model': MODELS[VOICES[v]['lang']], 'licence': LICENCE} for v in used},
    }
    with open(os.path.join(a.out, 'voices.json'), 'w', encoding='utf-8') as f:
        json.dump(credits, f, ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    # takes.json: what every clip of the folder was made with (this run's, and the earlier ones' that are still there)
    fields = ('key', 'voice', 'lang', 'slow', 'text', 'said', 'seconds', 'seed', 'take', 'cut', 'rate', 'semitones', 'hz', 'slow_ratio', 'recorded_as')
    takes = {k: c for k, c in before['clips'].items() if os.path.exists(os.path.join(a.out, k + '.wav'))}
    takes.update({row['key']: {f: row[f] for f in fields if row.get(f) is not None} for row in report if 'left_out' not in row})
    with open(os.path.join(a.out, 'takes.json'), 'w', encoding='utf-8') as f:
        json.dump({'made': datetime.date.today().isoformat(), 'with': made_with() if engines or recognisers else before['with'],
                   'verified': bool(recognisers) or bool(given) or (before['verified'] and not made),
                   'about': 'the seed and the cut of every clip in this folder, for --takes; left_out: what --verify left out by itself (those clips, and the ones sound/silent.json names, are in left-out/)',
                   'left_out': left_out, 'clips': sorted(takes.values(), key=lambda c: c['key'])}, f, ensure_ascii=False, indent=1)
    print(f'{made} clips written to {a.out} ({skipped} were there already, {len(failed)} failed); voices.json marks them synthetic; '
          f'manifest.json is the manifest without its {len(silent)} silent rows ({len(left_out)} of them left out by --verify); takes.json has every seed.')
    earlier_report = {}
    if os.path.exists(os.path.join(a.out, 'tts-report.json')):
        with open(os.path.join(a.out, 'tts-report.json'), encoding='utf-8') as f:
            earlier_report = json.load(f)
    if recognisers and report:
        if a.only is not None and earlier_report:          # a part was verified: the rest of the folder's report stays
            mine = {row['key'] for row in report} | {row.get('recorded_as') for row in report}
            report = [row for row in earlier_report.get('clips', []) if row['key'] not in mine] + report
            stays = [line for line in earlier_report.get('stays_as_a_line', []) if line.split(' ')[0] not in mine] + stays
            flags = [line for line in earlier_report.get('pair_marks_unheard', []) if line.split(' ')[0] not in mine] + flags
            for row in report:
                if row['key'] in silent:
                    row['left_out'] = silent[row['key']]
        write_report(a.out, report, names, left_out, stays, flags)
    elif not recognisers and earlier_report and (not made or given):          # nothing new was said, or the same takes again: the folder's report follows its manifest
        rows_before = earlier_report.get('clips', [])
        have = {row['key'] for row in rows_before}
        same_take = {(row['text'], row['voice'], row['slow']): row for row in rows_before}
        for c in takes.values():                           # a line that holds a recording now: its row is the row of the take it inherited
            donor = same_take.get((c.get('text'), c.get('voice'), c.get('slow')))
            if c['key'] not in have and donor:
                rows_before.append(dict(donor, key=c['key'], recorded_as=donor['key']))
        for row in rows_before:
            row.pop('left_out', None)
            if row['key'] in silent:
                row['left_out'] = silent[row['key']]
        write_report(a.out, rows_before, list(earlier_report.get('recognisers', {})), left_out,
                     [line for line in earlier_report.get('stays_as_a_line', []) if line.split(' ')[0] not in silent],
                     [line for line in earlier_report.get('pair_marks_unheard', []) if line.split(' ')[0] not in silent], earlier_report)
    elif not given and (made or not before['verified']):
        print('Not verified: no recogniser heard ' + ('the clips made now' if before['verified'] else 'these clips') + ', so nothing was left out by ear. Ship a folder made with --verify, or with --takes from one.')
    print(f'Next: node tools/make-sound.mjs {a.out} --manifest {os.path.join(a.out, "manifest.json")} --kind synthetic')
    return 1 if failed else 0


def write_report(out, report, names, left_out, stays, flags, made=None):
    """tts-report.csv (one row a clip) and tts-report.json (the rows, the totals, what was left out and what was flagged);
    `made`, an earlier report, lends its date and its machine when the report is only brought up to date"""
    fields = (['key', 'voice', 'lang', 'slow', 'text', 'said', 'seconds', 'peak', 'seed', 'take', 'cut', 'rate', 'semitones', 'hz', 'slow_ratio'] + [f'{p}_{n}' for n in names for p in ('heard', 'cer')]
              + ['letters_wrong', 'partner', 'heard_as_partner', 'recorded_as', 'left_out'])
    with open(os.path.join(out, 'tts-report.csv'), 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        w.writeheader()
        w.writerows(report)
    kept = [r for r in report if 'left_out' not in r]
    totals = {}
    for n in names:
        for label, pick in (('words', lambda r: ' ' not in r['said']), ('sentences', lambda r: ' ' in r['said'])):
            for lang in ('gn', 'es'):
                rows = [r for r in kept if pick(r) and r['lang'] == lang and f'cer_{n}' in r]
                if not rows:
                    continue
                e = sum(cer(r['said'], r[f'heard_{n}'])[0] for r in rows)
                c = sum(cer(r['said'], r[f'heard_{n}'])[1] for r in rows)
                totals[f'{n} {lang} {label}'] = {'clips': len(rows), 'cer': round(e / c, 4), 'heard_exactly': sum(1 for r in rows if r[f'cer_{n}'] == 0)}
    by_key = {r['key']: r for r in kept}
    same, swapped = [], [r['key'] for r in kept if r.get('heard_as_partner')]
    for r in kept:                         # a pair whose two words every recogniser hears as one and the same
        other = by_key.get(partner_key(r['key']) or '')
        if other and r['key'] < other['key'] and normal(r['said']) != normal(other['said']):
            heard = [(normal(r.get(f'heard_{n}', '')), normal(other.get(f'heard_{n}', ''))) for n in names if f'heard_{n}' in r and f'heard_{n}' in other]
            if heard and all(x == y for x, y in heard):
                same.append(f'{r["key"]} / {other["key"]} ({r["text"]} / {other["text"]})')
    slow = [r for r in kept if 'slow_ratio' in r]
    too_fast = [f'{r["key"]} (×{r["slow_ratio"]:.2f})' for r in slow if r['slow_ratio'] < SLOWER]
    no_seed = [r['key'] for r in kept if r.get('seed') is None]
    with open(os.path.join(out, 'tts-report.json'), 'w', encoding='utf-8') as f:
        json.dump({'made': (made or {}).get('made') or datetime.date.today().isoformat(), 'with': (made or {}).get('with') or made_with(),
                   'recognisers': {n: RECOGNISERS[n] for n in names}, 'totals': totals,
                   'left_out': left_out, 'stays_as_a_line': stays, 'pair_marks_unheard': flags, 'heard_as_partner': swapped, 'pairs_heard_the_same': same,
                   'slow_takes_not_slower': too_fast, 'found_without_a_seed': no_seed, 'clips': report}, f, ensure_ascii=False, indent=1)
    print('round trip of the clips that stay (CER against the text that was said; a recogniser is no judge of how nasal a vowel is or where the stress falls):')
    for k, v in totals.items():
        print(f'  {k:22s} {100 * v["cer"]:5.1f} %  ({v["heard_exactly"]} of {v["clips"]} heard exactly)')
    if left_out:
        print(f'  left out, {len(left_out)} rows (the clips are in left-out/ for a listener; sound/silent.json "keep" frees one):')
        for k, v in left_out.items():
            print(f'    {k}: {v}')
    for line in stays:
        print(f'  {line}')
    if flags:
        print(f'  words of a sound pair with a mark no recogniser writes ({len(flags)}; not left out: listen, then name the pair in sound/silent.json or leave it):')
        for line in flags:
            print(f'    {line}')
    if swapped:
        print('  heard as the other word of its pair: ' + ', '.join(f'{k} ({by_key[k]["text"]} as {by_key[k]["partner"]})' for k in swapped))
    if same:
        print('  pairs every recogniser hears as one word: ' + '; '.join(same))
    if slow:
        print(f'  slow takes: {len(slow)}, {sorted(r["slow_ratio"] for r in slow)[len(slow) // 2]:.2f} times as long as the normal take (median)' + (f'; less than {SLOWER:.2f} times: {", ".join(too_fast)}' if too_fast else ''))
    if no_seed:
        print(f'  found in the folder without a seed (--takes cannot make them again): {", ".join(no_seed[:10])}{" …" if len(no_seed) > 10 else ""}')
    print(f'  written: {os.path.join(out, "tts-report.csv")}, tts-report.json')


if __name__ == '__main__':
    try:
        sys.exit(main())
    except BrokenPipeError:          # the listing was piped into head
        os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())
        sys.exit(0)
