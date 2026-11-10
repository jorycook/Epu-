# The synthetic voice: what it says, how well, and what must stay silent

Epu'ã has no recordings yet. `tools/make-tts.py` makes stand-in clips with a voice model, for the screens to play
marked «voz sintética» until the studio's recordings replace them. This file is the record of that voice: the model
and its licence, how the text is prepared, the voices, every number that was measured, what each sound the course
teaches scored, what must stay without audio, what a native speaker should listen to first, and how to make the clips
again. Date of the measurements: 2026-11-10.

**Nobody listened to any of this.** Every judgement below was made by machine: two speech recognisers, distances between
clips, measures on the model's own alignment, and pictures of the waveform and the spectrogram. A machine can tell that
two clips differ, that a gap of silence sits between two vowels, where a vowel's formants are, whether a consonant is
voiced. It cannot tell whether a vowel sounds nasal to a Guarani ear, whether the stress falls where a speaker puts
it, or whether the voice is pleasant. Where the machine could not tell, this file says so.

## In one screen

- **Verdict: ship with exclusions.** Sentences come back from the independent recogniser at @@SENT_IVAN@@ % CER (real
  Guarani speech scores 8.6 % on the same recogniser), single words at @@WORD_IVAN@@ %.
- **Silent:** the sound pairs that differ only by a nasal vowel (pyta / pytã, pytu / pytũ, oke / okẽ, tupa / Tupã,
  téra / térã, porã / póra), in «Sonido y letra» and in Hablar. The voice makes the two words different, but by pitch
  and brightness, not by anything a machine can call nasal, and the recognisers hear pyta / pytã and téra / térã as
  one word. `sound/silent.json` names the rule; today it silences @@SILENT_ROWS@@ rows of the A1 manifest.
- **Rendered, by every measure:** the puso, the y, the soft r, mb and nd as one sound, the ch as «sh», the h, the v.
- **Rendered in part:** the nasal vowels (above), the g̃ (the model has no such letter), the stress (the acute works;
  the final stress of a word without a mark cannot be shown), the j (never the Spanish jota in the course's words, but
  *jasy* came back as «hasy»), nasal harmony (the spelling carries it; the rest cannot be told).
- **Not rendered:** f («Sofía» comes back as «sosía»), a last l («mil» as «mi»), and often an l at the start of a
  word («Lucas» as «nukas»). None is a sound the course teaches.
- **The voice is one man.** F is the model as it is; M is the same voice two semitones lower. F is not a woman's voice.
- **The licence is non-commercial** (CC BY-NC 4.0). These clips may not ship in an app that is sold or carries ads.

## The models and the licence

| | Guarani | Spanish (the narrator) |
|---|---|---|
| Model | `facebook/mms-tts-grn` | `facebook/mms-tts-spa` |
| What it is | VITS, one speaker, 16 kHz, 36.3 M weights, 145 MB | the same architecture |
| Made by | Meta AI, Massively Multilingual Speech (MMS) | the same |
| Licence | CC BY-NC 4.0 | CC BY-NC 4.0 |

The model cards name no speaker and no training text. The vocabulary (lower-case letters, no punctuation, an em dash)
and the MMS paper point to recordings of read Bible text; what the recognisers hear agrees (*kesu* comes back as
«Jesús»).

**Attribution the licence requires** (CC BY-NC 4.0, section 3(a)): the creator, a notice of the licence with its
address, a link to the material, and a note that it was changed. The line for the app's licences page:

> Voz sintética: MMS-TTS guaraní y castellano (`facebook/mms-tts-grn`, `facebook/mms-tts-spa`), de Meta AI: Pratap et
> al., «Scaling Speech Technology to 1,000+ Languages», 2023. Licencia CC BY-NC 4.0, solo para uso no comercial:
> https://creativecommons.org/licenses/by-nc/4.0/. Audio generado con esos modelos y modificado (recortes, tono) por
> `tools/make-tts.py`. Sin garantías.

`make-tts.py` writes the model and the licence into `voices.json`; `make-sound.mjs` copies them into the header of every
sound file and into `gn-sound-index.js` (`window.__gnSoundVoices`). The app's `licenses.txt` does not carry the line
yet: that file is made by the app build.

**What «non-commercial» means for this app.** The licence allows use that is "not primarily intended for or directed
towards commercial advantage or monetary compensation". A free app without ads, as Epu'ã is today, fits. The clips may
not ship once the app is sold, sits behind a subscription, carries advertising, or is given to a company as part of a
paid service; they must be replaced by the studio's recordings (CC BY 4.0) first. Anyone who copies the clips takes
them under the same terms, so the repository and the app must say that these clips are CC BY-NC 4.0 and not CC BY 4.0
like the recordings the plan foresees. This is the tool's reading of the licence, not legal advice. The recognisers
were used to measure only: nothing of them ships.

## How the text is prepared

The models read letters, not phonemes, and know only their own symbols. The Guarani model has 53:

```
space ' - — _ 0-9 a b c d e f g h i j k l m n o p q r s t u v x y z á é í ó ú ý ã ẽ ĩ õ ũ ỹ ñ
```

There is no w, no g̃, no punctuation. The Spanish model has 45: the same without the apostrophe, the hyphen, the nasal
vowels and ý, plus ü. The models' tokenizer lower-cases the text and **drops every character it does not know without a
word**. What that does to the course's text, tried one by one:

| In the course's text | What the tokenizer does | What `make-tts.py` does |
|---|---|---|
| Capitals (also Ñ, Á, Ã) | lower-cases them | the same |
| The puso as `'` U+0027 | keeps it: it is a symbol | keeps it |
| The puso as `’` U+2019 or `ʼ` U+02BC | drops it: *mba’éichapa* becomes «mbaéichapa» | turns every puso-like mark into U+0027 first |
| g̃ and G̃ (g + U+0303) | drops the tilde: *hag̃ua* becomes «hagua» | writes the word as the model's training text did (below) |
| ã ẽ ĩ õ ũ ỹ, precomposed | keeps them | keeps them |
| The same vowels in NFD (a + U+0303) | drops the tilde: *porã* becomes «pora» | normalises to NFC first |
| á é í ó ú ý | keeps them: the model uses them for the stress (measured below) | keeps them |
| ñ | keeps it | keeps it |
| `¿ ? ¡ ! , . : ; « » …` | drops them all: no pause, no question | `. ? ! … ; :` end a sentence (a pause of 0.42 s); the rest is left out, by rule |
| The dash `—` | keeps it: the model makes a pause for it (median 0.57 s, from 0.18 to 0.99) | uses it itself, to cut the carrier off; a dash in the text ends a phrase |
| The hyphen `-` and `_` | keeps them: 40 to 64 ms, no sound of their own | a hyphenated word must be in `sound/respell.json` |
| Digits | keeps them: «1» comes out as noise, «5» as «sĩ»; 3 is the model's blank | Spanish line: said in words (1 → uno); Guarani line: the run stops |
| No-break space, tab, line break | drops them: the two words are glued | every space becomes one space |
| w, ç, ü and anything else | drops it | the run stops and names the key and the character |

In the A1 manifest (497 recorded rows, 2026-11-10) the characters the Guarani model does not know are `.` `?` `,` `!`
`«` `»` and the combining tilde of g̃ (in 14 rows: Tereg̃uahẽ, ko'ág̃a, og̃uahẽ, ag̃aite, Ag̃uahẽma); in the narrator's
lines `¿` `?` `.` and the digits 1, 2, 3. Every other Guarani string of `content/a1/parts` and `content/extra` was read
too: they add `·` `→` `+` `…` `/` `:` `=` and digits, in rules and forms that are not clips; if one becomes a clip, the
tool stops on it.

**A question is not said differently.** Neither model has a question mark. Guarani marks most questions with -pa or
piko, so little is lost there; «Iporã, ha nde?» and the narrator's «¿Qué responde el hombre?» come out as statements.

**g̃.** The model's training text wrote these words the other way the notes describe (G1 §5): the tilde on a vowel.
The corpora agree (*haguã* 6,846 against *hag̃ua* 3,219; *ko'ágã* 1,609 against *ko'ág̃a* 408; *oguahẽ* 1,557 against
*og̃uahẽ* 138). So for the voice, and only for the voice: the tilde goes to the first vowel after the g̃ (*hag̃ua* →
haguã, *ko'ág̃a* → ko'ágã, *ag̃aite* → agãite), unless a nasal vowel already follows (*og̃uahẽ* → oguahẽ,
*Tereg̃uahẽ* → tereguahẽ). A g̃ before a vowel with an acute (*hag̃uáicha*) loses its nasality: no such word is in the
course today.

**Spanish inside Guarani lines: `sound/respell.json`.** The voice reads letters the Guarani way: c before i as «ch» or
«k», an unmarked word with the stress on its last vowel. Each word below was said three times or more inside «che réra
…» and heard by both recognisers; the acoustic check of the stress is under «Stress».

| In the course | Said as | Why, and what came back |
|---|---|---|
| Juan | huan | The jota. After «che réra» the model says the name with an h by itself (it knows the Bible's names), but after «mba'éichapa» it came out «joan». With h it is the same every time. |
| José | hose | The same. Heard «josé» either way. |
| Lucas | lúkas | k for c, and the acute keeps the stress on the u (the independent recogniser writes «…úkas» in 6 takes of 6 with it, in 1 of 6 without). |
| Lucía | lusía | As «lucía» it was heard «luchía», «lukía»; as «lusía», «lusía». |
| Luis | luis | As written. Heard «nuis», «luis», «ndúi». |
| Marta, Mateo, Nilda, Pedro, Ramona, Rosa, Ana, Carlos | márta, matéo, nílda, pédro, ramóna, rósa, ána, kárlos | The acute keeps the Spanish stress. With it the recognisers write the accent (ána: 12 hearings of 12; rósa: 8 of 12; ramóna: 6 of 6 by the large one); without it, never. Nilda and Carlos stay poor (ld and rl are not Guarani clusters). |
| Sofía, Tomás | sofía, tomás | As written. **Sofía is heard «sosía» every time**: the voice has no f. |
| Luque | lúke | Heard «núke», «lúke»; as «luque», «nupie». |
| Argentina-gua | arhentinagua | h for the g before e, one word, no acute: -gua takes the stress. Heard «ahentinagua». |
| diez, mil, veinte, doce (inside a Guarani sentence) | dies, mil, véinte, dóse | véinte is heard right 6 times of 6; dóse as «ndose». **«Diez mil» fails in every spelling tried** («liesmi», «ndiehmi»): the voice has no d without n and drops a last l. |

So **a line that is nothing but a Spanish number («Diez mil.», «Veinte.») is said by the Spanish voice**, in the pitch
of the speaker whose line it is. The price is the answer of a listening question in unit 4 (a1u04d5.r1), and the
Spanish model says it right. The cost: for that one line the seller has another man's voice. The words that make a
line Spanish are listed in `respell.json` under "spanish".

Names that are Guarani spelling are said as written and listed under "as_written" (Itaugua, Ka'akupe, Paraguái,
Paraguay, Ypakarai, Ñemby, Tovatĩ, Itakuruvi), with any suffix. A word the tool does not find in the table stops the
run when it has letters outside Guarani spelling (c without h, q, z, x, w, f, b without m, d without n, two consonants
in a row, a consonant at the end) or is a capitalised word in the middle of a sentence. It cannot catch a Spanish name
that opens a sentence and happens to be Guarani spelling («Elena oho»).

## How a clip is said

**A carrier, cut off.** Both models garble a short utterance said on its own. 42 words of the course, two seeds each:

| How the word is said | Independent recogniser: CER, heard exactly | Large recogniser |
|---|---|---|
| alone | 32.8 %, 18 of 84 | 33.1 %, 22 of 84 |
| after a dash alone | 62.0 %, 4 | 63.0 %, 4 |
| twice, the second kept | 50.9 %, 11 | 47.0 %, 18 |
| after «ha upéi he'i —», the carrier cut off | 23.5 %, 31 | 16.9 %, 47 |

Alone, *ka'a* comes back as «haha», *pira* as «tira», *po* as «ho», *vaka* as «va'a»: the first consonant is lost. The
Spanish model does the same («uno» alone: «uono», «gorlo», «gono»; after «y entonces dijo —»: «uno» 3 times of 3). So
every sentence is said after a carrier, "and then he said:", in one utterance, and the carrier is cut off in the middle
of the pause the model makes for the dash. Where the pause is comes from the model's own alignment (a hook on its
duration predictor gives the place of every letter, to 16 ms). When the model makes no clear pause (it does not before
*kuéra*, a word it knows as an ending), the next carrier is tried: «upéi he'i chupe —», then «ko ñe'ẽ —». The clip
starts 10 ms inside the place of its first letter: the model often hums before it, and with the hum *che* and *chipa*
were heard «iche», «ichipa» (44 takes: heard exactly 17 → 21 by the independent recogniser, 27 → 28 by the large one).
For sentences the carrier neither helps nor hurts (20 sentences, two seeds: 12.8 % alone, 11.4 % with it on the
independent recogniser; 4.8 % and 5.8 % on the large one).

**Pauses.** Each sentence of a line is its own utterance, 0.42 s apart. A comma makes no pause. Measured on 16 lines
with commas or two sentences, two seeds each:

| | Independent | Large |
|---|---|---|
| one utterance, a pause at every comma and full stop | 19.7 % | 8.3 % |
| sentence by sentence, no pause at a comma (what the tool does) | 14.3 % | 8.3 % |
| the whole line without any pause | 13.0 % | 6.2 % |

The voice starts badly after each pause it makes («ha nde» after a pause is heard «a nde»), so every pause costs.

**Noise.** The model has two noise settings; the defaults are 0.667 (`noise_scale`) and 0.8 (`noise_scale_duration`).
For a line of one or two words the first is set to 0.33: on the 145 single words of the probe the CER falls from 19.7 %
to 17.8 % (independent) and from 17.2 % to 14.1 % (large). For sentences no setting was better than the default by more
than the seed-to-seed noise, so they keep it. The duration noise keeps its default everywhere (0.4 gave 27.8 % against
26.4 % on 56 words).

**Slow takes** (keys ending in `.slow`) are said at 0.8 of the speaking rate: @@SLOW_RATE@@ vowels a second against
@@SENT_RATE@@. Single words are not slowed: at 0.8 their CER rose from 26.4 % to 37.0 % (56 takes).

**Seeds.** Each clip's seed is the CRC-32 of its key, so a rebuild gives the same audio: 572 clips of the probe were
made twice, an hour apart, and came out the same within one step of the 16-bit scale. With `--verify`, a clip that is
not heard as written is said again with the next seed (three in all) and the best take is kept; a take heard as the
other word of its sound pair counts as the worst. The seed used is in `tts-report.json`, and `--takes` says the same
takes again without the recognisers.

## The voices

The Guarani model is one man. Median pitch @@PITCH_MODEL@@ (autocorrelation, voiced frames of @@PITCH_N@@ probe
clips).

| Voice of the manifest | What it is | Median pitch |
|---|---|---|
| F, «mujer, voz principal» | the Guarani model as it is | @@PITCH_F@@ |
| M, «hombre» | the same, 2 semitones lower (ffmpeg's rubberband, the formants moving with the pitch) | @@PITCH_M@@ |
| N, «narrador» | the Spanish model as it is | @@PITCH_N_ES@@ |

**F is not a woman's voice**, and the two speakers of a dialogue are two semitones apart, no more. That is what the
measurements leave. The same 73 words and 19 sentences, shifted with rubberband ("moved": the formants move with the
pitch, a smaller or larger speaker; "kept": rubberband holds them):

| Shift | Words: independent, large | Sentences: independent, large |
|---|---|---|
| none | 16.8 %, 13.9 % | 15.4 %, 6.4 % |
| +3 semitones, moved | 19.9 %, 22.4 % | 15.8 %, 7.0 % |
| +3, kept | 22.7 %, 31.2 % | 17.7 %, 6.4 % |
| +2, moved | 19.6 %, 21.6 % | 14.6 %, 7.2 % |
| +2, kept | 20.2 %, 22.4 % | 15.0 %, 6.8 % |
| −2, moved | | 16.8 %, 6.8 % |
| −2, kept | | 15.8 %, 6.6 % |
| −3, moved | | 20.7 %, 7.6 % |
| −3, kept | | 19.7 %, 7.0 % |

Any shift upward costs single words 3 to 8 points: with the formants moved up, u is heard as o and y as e (*yvytu* →
«yvyto», *ku'a* → «ko'a»). F says every word and every pair of the course, so F is not shifted. M says lines of
dialogue only, and sentences bear 2 semitones either way but not 3. A woman's voice needs another model or a person.

## What was measured, and with what

**The two recognisers.**

- `ivangtorre/wav2vec2-xlsr-300m-guarani`, "independent" above: XLS-R 300M fine-tuned on the 293 Guarani training clips
  of the AmericasNLP 2022 speech set (its card; short read sentences). Nothing of MMS in it. On 40 held-out clips of
  real speech from the same set it scores **8.6 % CER** here (0.2 % on clips it was trained on; its card gives 17.6 %
  on the competition's test set). It writes capitals and full stops, is weak on single words, and has habits of its
  own: *tupa* is «supa», *porã* «morã», *po* «yo».
- `facebook/mms-1b-all` with the Guarani adapter, "large" above: from the same project and the same kind of data as
  the voice, so it flatters it. **6.1 % CER** on the same 40 clips of real speech. It prefers a word of its Bible to
  what was said: *kesu* is «Jesús» in every take. The narrator's Spanish is judged by its Spanish adapter alone.

Both sides of every comparison are put in lower case, without punctuation, with one apostrophe, in NFC, g̃ as g. The
CER is the edit distance over the length of the text that was said (the respelled text: «huan», not «Juan»).

**The probe**: 189 clips in the scratch folder of the measuring session (not in the repository): the 145 words of
every sound pair of A1 units 1 to 4 and of Hablar (64 pairs) and of each taught sound, 15 sentences of the lessons, 4
slow takes, and the narrator's 25 Spanish lines. Each word was made with two seeds.

@@PROBE_TABLE@@

**Distances.** For every pair, the two words were compared by MFCC with DTW (13 coefficients, 25 ms windows, the mean
taken out), against the distance between two seeds of the same word:

@@PAIR_SUMMARY@@

**The acoustic study**: measures on the stretch of each letter, from the model's alignment, six or ten seeds a word
(about 1,700 utterances; no recogniser). Its tables are under each sound below.

**Pictures**: waveform and spectrogram of 24 pairs, with the letters where the model puts them, were looked at one by
one. What they show is said under each sound.

## Each sound the course teaches

| Sound | Rendered? | The evidence |
|---|---|---|
| The six oral vowels, with the y | **yes** | @@ROW_Y@@ |
| The nasal vowels ã ẽ ĩ õ ũ ỹ | **partly: different, not shown to be nasal** | @@ROW_NASAL@@ |
| The puso | **yes** | @@ROW_PUSO@@ |
| g̃ | **partly** | @@ROW_G@@ |
| j | **yes**, with one word to watch | @@ROW_J@@ |
| h | **yes** | @@ROW_H@@ |
| The soft r, also at the start; rr | **yes** for r, **partly** for rr | @@ROW_R@@ |
| mb, nd, ng, nt as one sound | **yes** | @@ROW_MB@@ |
| ch | **yes**, as «sh» | @@ROW_CH@@ |
| v | **partly: cannot tell lip from teeth** | @@ROW_V@@ |
| Stress: last vowel unless an acute says otherwise | **partly** | @@ROW_STRESS@@ |
| Nasal harmony | **cannot tell** beyond the spelling | @@ROW_HARMONY@@ |

@@CONTRAST_DETAIL@@

## What must stay without audio

`sound/silent.json` holds the rule, and `make-tts.py` obeys it: the rows are not said, and the manifest the tool writes
next to its WAVs leaves them out, so `make-sound.mjs` registers no clip for them and the screens keep their written
stand-in.

@@SILENT_LIST@@

A word that is silent as half of a pair is still said where it is a word of a scene (*mitã*, *porã*, *Tupã*): there it
is a word said imperfectly, marked «voz sintética», not a lesson in telling two sounds apart.

Not silenced, and flawed: the lines with Sofía (heard «sosía») and Nilda, Lucas, Luis (the l), and «Diez mil.», said
by the Spanish voice. To silence one, add its key or its text to `silent.json`.

## What a native speaker should listen to first

1. **One nasal pair, before anything else:** *pyta* / *pytã* and *oke* / *okẽ*. If the second word of each sounds
   nasal to you, the rule in `silent.json` can go and the nasal steps get their audio back. If it only sounds higher,
   the rule stays.
2. **The puso words:** *ka'a*, *mbo'y*, *so'o*, *mba'e*. In *ka'i* the gap is clean; in *mbo'y* and *so'o* the voice
   creaks through it, and the recognisers hear an h («mbohy»).
3. **The y:** *yta*, *yvyty*, *sa'y*, *py*. The formants say it is the right vowel; an ear must agree.
4. **The stress:** *óga* against *ogakuéra*, *koty* against *kotýpe*, and the names (Ana, Rosa, Ramona). The acute
   makes the vowel longer and lower in pitch, with the rise after it. Is that where you hear the stress?
5. **g̃:** *ko'ág̃a*, *ag̃aite*, *og̃uahẽ*, Tereg̃uahẽ.
6. **The start of single words:** *ru*, *réra*, *vaka*, *jagua*, *aju*, *ñu*. The voice starts with a short hum before
   r, v, ñ; the recognisers hear «yru», «uvaka».
7. **The names and the Spanish:** Juan, Lucía, Sofía, Nilda, Luis; «Diez mil.» in the seller's line.
8. **The two voices of a dialogue:** is M different enough from F?
9. **ch:** is «sh» what the course wants (notes G1 leave it open)?

## How to make the clips again

```
# once: the environment (Python 3.10 or later; CPU is enough; about 300 MB of models, 5 GB more for the recognisers)
python3 -m venv venv && venv/bin/pip install torch transformers soundfile numpy
export HF_HUB_DISABLE_XET=1        # hosts: huggingface.co and us.aws.cdn.hf.co

node tools/sound-list.mjs A1                                   # the clip list
venv/bin/python tools/make-tts.py --dry-run                    # what would be said; stops on anything it cannot say
venv/bin/python tools/make-tts.py --out /tmp/voz --verify      # the clips, each heard back; about @@TIME@@
node tools/make-sound.mjs /tmp/voz --manifest /tmp/voz/manifest.json --kind synthetic
```

- `--verify` needs the recognisers in the Hugging Face cache (`ivangtorre/wav2vec2-xlsr-300m-guarani`, 1.2 GB;
  `facebook/mms-1b-all` with `adapter.grn.safetensors` and `adapter.spa.safetensors`, 3.9 GB, about 5 GB of memory).
  Without it the tool says each clip once, with its own seed.
- `--takes /tmp/voz/tts-report.json` makes the same takes again without the recognisers.
- `--only 'a1u01d1.*' p3.0` for a part; `--redo` to say again what is there.
- The manifest to give `make-sound.mjs` is the one in the output folder, not `sound/A1/manifest.json`: it is the same
  list without the silent rows.
- A new name or a Spanish word in the content stops the run until it is in `sound/respell.json`.

@@SAMPLE_RUN@@
