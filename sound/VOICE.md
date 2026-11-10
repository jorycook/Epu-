# The synthetic voice: what it says, how well, and what must stay silent

Epu'ã has no recordings yet. `tools/make-tts.py` makes stand-in clips with a voice model, for the screens to play
marked «voz sintética» until the studio's recordings replace them. This file is the record of that voice: the model
and its licence, how the text is prepared, the voices, every number that was measured, what each sound the course
teaches scored, what must stay without audio, what a native speaker should listen to first, and how to make the clips
again. The measurements are of 2026-11-10.

**Nobody listened to any of this.** Every judgement below was made by machine: two speech recognisers, distances
between clips, measures on the model's own alignment, and pictures of the waveform and the spectrogram. A machine can
tell that two clips differ, that a gap of silence sits between two vowels, where a vowel's formants are, whether a
consonant is voiced. It cannot tell whether a vowel sounds nasal to a Guarani ear, whether the stress falls where a
speaker puts it, or whether the voice is pleasant. Where the machine could not tell, this file says so.

## In one screen

- **Verdict: ship with exclusions.** Sentences come back from the independent recogniser at 15.3 % CER (real Guarani
  speech scores 8.6 % on the same recogniser) and single words at 17.2 %; from the large one at 6.5 % and 13.4 %.
- **Silent:** the sound pairs that differ only by a nasal vowel (pyta / pytã, pytu / pytũ, oke / okẽ, tupa / Tupã,
  téra / térã, porã / póra), in «Sonido y letra» and in Hablar. The voice makes the two words different, but by pitch,
  not by anything a machine can call nasal, and the recognisers hear pyta / pytã as one word. `sound/silent.json` holds
  the rule; today it silences 26 of the A1 manifest's 732 rows.
- **Rendered, by every measure:** the puso, the y, the soft r, mb and nd as one sound, the ch as «sh», the h.
- **Rendered in part:** the nasal vowels (above); the g̃ (the model has no such letter); the stress (the acute works;
  the final stress of a word without a mark cannot be shown); the j (never the Spanish jota in the course's words, but
  *jasy* came back as «hasy»); the v (a soft voiced sound, not a b: lip or teeth cannot be told); rr.
- **Cannot tell:** nasal harmony, beyond the spelling.
- **Not rendered:** f («Sofía» comes back «sosía»), a last l («mil» as «mi»), and often an l at the start of a word
  («Lucas» as «nukas»). None is a sound the course teaches.
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
and the MMS paper point to recordings of read Bible text, and what the recognisers hear agrees: *kesu* comes back as
«Jesús», and the model says «Juan» and «Pedro» the Spanish way without being told.

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
paid service: the studio's recordings (CC BY 4.0) must replace them first. Anyone who copies the clips takes them
under the same terms, so the repository and the app must say that these clips are CC BY-NC 4.0, not CC BY 4.0 like
the recordings the plan foresees. This is the tool's reading of the licence, not legal advice. The recognisers were
used to measure only: nothing of them ships.

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
| The same vowels decomposed (a + U+0303) | drops the tilde: *porã* becomes «pora» | normalises to NFC first |
| á é í ó ú ý | keeps them: the model uses them for the stress (measured below) | keeps them |
| ñ | keeps it | keeps it |
| `¿ ? ¡ ! , . : ; « » …` | drops them all: no pause, no question | `. ? ! … ; :` end a sentence (a pause of 0.42 s); the rest is left out, by rule |
| The dash `—` | keeps it: the model makes a pause for it (median 0.57 s, from 0.18 to 0.99) | uses it itself, to cut the carrier off; a dash in the text ends a phrase |
| The hyphen `-` and `_` | keeps them: 40 to 64 ms, no sound of their own | a hyphenated word must be in `sound/respell.json` |
| Digits | keeps them: «1» comes out as noise, «5» as «sĩ»; 3 is the model's blank | Spanish line: said in words (1 → uno); Guarani line: the run stops |
| No-break space, tab, line break | drops them: the two words are glued | every space becomes one space |
| w, ç, ü and anything else | drops it | the run stops and names the key and the character |

In the A1 manifest (497 recorded rows) the characters the Guarani model does not know are `.` `?` `,` `!` `«` `»` and
the combining tilde of g̃ (Tereg̃uahẽ, ko'ág̃a, og̃uahẽ, ag̃aite, Ag̃uahẽma); in the narrator's lines `¿` `?` `.` and the
digits 1, 2, 3. Every other Guarani string of `content/a1/parts` and `content/extra` was read too: they add `·` `→`
`+` `…` `/` `:` `=` and digits, in rules and forms that are not clips. If one becomes a clip, the tool stops on it.

**A question is not said differently.** Neither model has a question mark. Guarani marks most questions with -pa or
piko, so little is lost there; «Iporã, ha nde?» and the narrator's «¿Qué responde el hombre?» come out as statements.

**g̃.** The model's training text wrote these words the other way the notes describe (G1 §5): the tilde on a vowel.
The corpora agree (*haguã* 6,846 against *hag̃ua* 3,219; *ko'ágã* 1,609 against *ko'ág̃a* 408; *oguahẽ* 1,557 against
*og̃uahẽ* 138). So for the voice, and only for the voice: the tilde goes to the first vowel after the g̃ (*hag̃ua* →
haguã, *ko'ág̃a* → ko'ágã, *ag̃aite* → agãite), unless a nasal vowel already follows (*og̃uahẽ* → oguahẽ,
*Tereg̃uahẽ* → tereguahẽ). A g̃ before a vowel with an acute (*hag̃uáicha*) would lose its nasality: no such word is
in the course today.

**Spanish inside Guarani lines: `sound/respell.json`.** The voice reads letters the Guarani way: c before i as «ch» or
«k», a word without a mark with the stress on its last vowel. Each word below was said three times or more inside «che
réra …» and heard by both recognisers; the measure of the stress is under «Stress».

| In the course | Said as | Why, and what came back |
|---|---|---|
| Juan | huan | The jota. After «che réra» the model says the name with an h by itself, but after «mba'éichapa» it came back «joan». With h it is the same every time. |
| José | hose | The same. Heard «josé» either way. |
| Lucas | lúkas | k for c, and the acute keeps the stress on the u: with it the independent recogniser writes «…úkas» in 6 takes of 6, without it in 1 of 6. |
| Lucía | lusía | As «lucía» it came back «luchía», «lukía»; as «lusía», «lusía». |
| Luis | luis | As written. Came back «nuis», «luis», «ndúi». |
| Marta, Mateo, Nilda, Pedro, Ramona, Rosa, Ana, Carlos | márta, matéo, nílda, pédro, ramóna, rósa, ána, kárlos | The acute keeps the Spanish stress. With it the recognisers write the accent (ána: 12 hearings of 12; rósa: 8 of 12; ramóna: 6 of 6 by the large one); without it, in none. Nilda and Carlos stay poor: ld and rl are not Guarani clusters. |
| Sofía, Tomás | sofía, tomás | As written. **Sofía comes back «sosía» every time**: the voice has no f. |
| Luque | lúke | Came back «núke», «lúke»; as «luque», «nupie». |
| Argentina-gua | arhentinagua | h for the g before e, one word, no acute: -gua takes the stress. Came back «ahentinagua». |
| ochenta, veinte, doce (inside a Guarani sentence, or alone) | ochénta, véinte, dóse | véinte comes back right 6 times of 6, ochénta as «…chénta», dóse as «ndose». |
| diez, mil | the Spanish voice | **«Diez mil» fails in each of the eight spellings tried** («riesmi», «ndiehmi»): the Guarani voice has no d without n and drops a last l. |

So **a line that is nothing but a Spanish number with diez or mil in it («Diez mil.») is said by the Spanish voice**,
at that voice's own pitch. The price is the answer of a listening question in unit 4 (a1u04d5.r1), and the Spanish
model says it right («diez mil» in 11 takes of 12; with its pitch moved two semitones down for the seller's voice, in
none of 10). The
cost: for that one line the seller has another man's voice. «Veinte.», which the Guarani voice says right, stays with
it. The rule is in `respell.json`: "spanish" lists the number words, and "voice": "es" marks the ones the Guarani voice
cannot say; a number word with no entry at all goes to the Spanish voice too when the line is only a number, and stops
the run when it sits inside a Guarani sentence.

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
of the pause the model makes for the dash. Where the pause is comes from the model's own alignment: a hook on its
duration predictor gives the place of every letter, to 16 ms. When the model makes no clear pause (it does not before
*kuéra*, which it knows as an ending), the next carrier is tried: «upéi he'i chupe —», then «ko ñe'ẽ —». The clip
starts 10 ms inside the place of its first letter: the model often hums before it, and with the hum *che* and *chipa*
came back «iche», «ichipa» (44 takes: heard exactly 17 → 21 by the independent recogniser, 27 → 28 by the large one).
For sentences the carrier neither helps nor hurts (20 sentences, two seeds: 12.8 % alone and 11.4 % with it on the
independent recogniser; 4.8 % and 5.8 % on the large one).

**Pauses.** Each sentence of a line is its own utterance, 0.42 s from the next. A comma makes no pause. Measured on 16
lines with commas or two sentences, two seeds each:

| | Independent | Large |
|---|---|---|
| one utterance, a pause at every comma and full stop | 19.7 % | 8.3 % |
| sentence by sentence, no pause at a comma (what the tool does) | 14.3 % | 8.3 % |
| the whole line without any pause | 13.0 % | 6.2 % |

The voice starts badly after each pause it makes («ha nde» after a pause comes back «a nde»), so every pause costs.

**Noise.** The model has two noise settings; the defaults are 0.667 (`noise_scale`) and 0.8 (`noise_scale_duration`).
For a line of one or two words the first is set to 0.33: on the 145 single words of the probe the CER falls from 19.7 %
to 17.8 % (independent) and from 17.2 % to 14.1 % (large). For sentences no setting beat the default by more than the
seed-to-seed noise, so they keep it. The duration noise keeps its default everywhere (0.4 gave 27.8 % against 26.4 %
on 56 words).

**Slow takes** (keys ending in `.slow`) are said at 0.8 of the speaking rate: 5.0 vowels a second against 5.9. Single
words are not slowed: at 0.8 their CER rose from 26.4 % to 37.0 % (56 takes).

**Seeds.** Each clip's seed is the CRC-32 of its key, so a rebuild gives the same audio: 568 word clips of the probe
were said twice, an hour apart, and came out the same (no sample further apart than 0.0002 of full scale). With
`--verify`, a clip that is not heard as written is said again with the next seed (three in all) and the best take is
kept; a take heard as the other word of its sound pair counts as the worst. The seed used is in `tts-report.json`, and
`--takes` says the same takes again without the recognisers (six clips made that way were the same files, byte for
byte).

## The voices

The Guarani model is one man: median pitch 143 Hz (autocorrelation over the voiced frames of 164 probe clips; 104 to
181 Hz between the 10th and the 90th percentile).

| Voice of the manifest | What it is | Median pitch |
|---|---|---|
| F, «mujer, voz principal» | the Guarani model as it is | 143 Hz (149 Hz on the sentences) |
| M, «hombre» | the same, 2 semitones lower (ffmpeg's rubberband, formants kept) | 134 Hz: 1.9 semitones under F on the same sentences |
| N, «narrador» | the Spanish model as it is | 139 Hz |

**F is not a woman's voice**, and the two speakers of a dialogue are two semitones apart, no more. That is what the
measurements leave. The same 73 words and 19 sentences, shifted with rubberband ("moved": the formants move with the
pitch, a smaller or a larger speaker; "kept": rubberband holds them):

| Shift | Words: independent, large | Sentences: independent, large |
|---|---|---|
| none | 16.8 %, 13.9 % | 15.4 %, 6.4 % |
| +3 semitones, moved | 19.9 %, 22.4 % | 15.8 %, 7.0 % |
| +3, kept | 22.7 %, 31.2 % | 17.7 %, 6.4 % |
| +2, moved | 19.6 %, 21.6 % | 14.6 %, 7.2 % |
| +2, kept | 20.2 %, 22.4 % | 15.0 %, 6.8 % |
| −2, moved | | 16.8 %, 6.8 % |
| −2, kept (M) | | 15.8 %, 6.6 % |
| −3, moved | | 20.7 %, 7.6 % |
| −3, kept | | 19.7 %, 7.0 % |

Any shift upward costs single words 3 to 8 points: with the formants moved up, u comes back as o and y as e (*yvytu* →
«yvyto», *ku'a* → «ko'a»). F says every word and every pair of the course, so F is not shifted. M says lines of
dialogue only. Sentences bear 2 semitones down but not 3, and short lines bear them less well than long ones: on 16
lines of one to four words, three seeds each, M's shift took the CER from 15.6 % to 18.4 % (independent) and from 7.8 %
to 9.9 % (large). That is the price of telling the two speakers apart at all. A line the Spanish voice says for F or M
is not shifted. A woman's voice needs another model, or a person.

## What was measured, and with what

**The two recognisers.**

- `ivangtorre/wav2vec2-xlsr-300m-guarani`, "independent" above: XLS-R 300M fine-tuned on the 293 Guarani training clips
  of the AmericasNLP 2022 speech set (its card: short read sentences). Nothing of MMS is in it. On 40 held-out clips
  of real speech from the same set it scores **8.6 % CER** here (0.2 % on clips it was trained on; its card gives
  17.6 % on the competition's test set). It writes capitals and full stops, is weak on single words, and has habits of
  its own: *tupa* is «supa» or «kupa», *porã* «morã», *po* «yo».
- `facebook/mms-1b-all` with the Guarani adapter, "large" above: from the same project and the same kind of data as
  the voice, so it flatters it. **6.1 % CER** on the same 40 clips of real speech. It prefers a word of its Bible to
  what was said: *kesu* is «Jesús» in every take. The narrator's Spanish is judged by its Spanish adapter alone.

Both sides of every comparison are put in lower case, without punctuation, with one apostrophe, in NFC, g̃ as g. The
CER is the edit distance over the length of the text that was said (the respelled text: «huan», not «Juan»).

**The probe**: 189 clips, made by the tool's own code, in the scratch folder of the measuring session (not in the
repository): the 145 words of every sound pair of A1 units 1 to 4 and of Hablar (64 pairs) and of each taught sound,
15 sentences of the lessons, 4 slow takes, and the narrator's 25 Spanish lines. Each word was said with two seeds.

| Clips, as the tool writes them | Independent: CER, heard exactly | Large |
|---|---|---|
| 145 single words (F) | 17.2 %, 66 | 13.4 %, 80 |
| the same words, another seed | 15.8 %, 68 | 14.4 %, 72 |
| 15 sentences in F | 15.3 %, 2 | 6.5 %, 6 |
| the same sentences in M | 17.4 %, 0 | 7.0 %, 6 |
| 4 slow takes in F (in M) | 19.5 % (14.6 %) | 7.3 % (8.5 %) |
| 25 narrator lines, Spanish adapter | | 2.3 %, 15 |
| for comparison: 40 clips of real Guarani speech | 8.6 % | 6.1 % |

Against the spelling on the screen instead of the text that was said (Juan, not huan), the 15 sentences score 17.2 %
and 6.5 %.

**Lengths, peaks, silences** of the same clips: single words 0.24 to 0.89 s (median 0.53), 4.5 vowels a second;
sentences 1.43 to 3.75 s (median 2.54), 5.9 vowels a second, 9 pauses between sentences in 8 clips; the narrator's
lines 0.41 to 6.42 s, 6.3 vowels a second. Peaks: median 0.82 of full scale for words, 0.91 for sentences, never over
0.97. Silence before the first sound at most 90 ms and after the last at most 105 ms (measured 40 dB under the loudest
part: a soft first consonant counts as silence here). `make-sound.mjs` then trims, levels and pads every clip.

**Distances.** For every pair, the two words were compared by MFCC with DTW (13 coefficients, 25 ms windows, the mean
taken out), against the distance between two seeds of the same word:

| What sets the pair apart | Pairs | Told apart by independent, large | Heard as one word by both | Distance against the seed distance: median (lowest) |
|---|---|---|---|---|
| a nasal vowel | 6 | 5, 2 | 1 (pyta / pytã) | ×1.57 (×1.33, téra / térã) |
| the puso | 4 | 4, 4 | 0 | ×1.80 (×1.51, mbo'y / mboy) |
| y against i | 2 | 2, 2 | 0 | ×2.08 (×1.78) |
| y against u | 4 | 4, 4 | 0 | ×2.56 (×2.30) |
| two different words, to compare | 48 | 48, 48 | 0 | ×3.17 (×2.15) |

"Told apart" means the two transcriptions differ, not that each is right: both words of a pair are heard exactly in 13
(independent) and 14 (large) of the 48 pairs of different words.

**The acoustic study**: measures on the stretch of each letter, from the model's alignment, six or ten seeds a word
(about 2,500 utterances; no recogniser). Its numbers are under each sound below.

**Pictures**: waveform and spectrogram, with the letters where the model puts them, were drawn for 24 pairs; 12 of
them (the six kinds of pair above, the nasal ones first) and some twenty single words were looked at one by one. What
they show is said under each sound.

**The whole path.** `make-tts.py` was run on 40 keys of the manifest with `--verify` (3 minutes on four shared CPUs)
and `make-sound.mjs` on its folder: 7 sound files and the index, 80 keys registered (40 recordings, 35 that share one,
4 dialogues put together with their cues, the test tone), none of the silent keys among them, every clip marked
synthetic with the model and the licence in the file's header. The 35 Guarani clips, taken back out of the files as
the MP3s the app plays, score 8.2 % and 6.2 %, as the WAVs did (7.9 % and 6.2 %). With three seeds to choose from, the
40 clips score 6.8 % (words) and 8.2 % (sentences) on the independent recogniser, 10.2 % and 4.9 % on the large one;
15 of the 40 clips took a second or third take.

## Each sound the course teaches

| Sound | Rendered? | In short |
|---|---|---|
| The six oral vowels, with the y | **yes** | y has its own place between i and u, and every y pair is told apart |
| The nasal vowels ã ẽ ĩ õ ũ ỹ | **partly** | different from the oral vowel, but by pitch; not shown to be nasal; ã is never heard as nasal in pytã and térã |
| The puso | **yes** | a fall of 17 dB between the vowels in single words, 48 dB in a sentence; none without the puso |
| g̃ | **partly** | no such letter; written the old way, the g and its vowel differ from a plain g's in every take |
| j | **yes**, one word to watch | voiced, never the jota in the course's 27 words; *jasy* came back «hasy» |
| h | **yes** | 72 ms of breath between vowels; heta, ha, hendu heard right |
| The soft r, also at the start; rr | **yes** for r, **partly** for rr | one tap in 35 takes of 36; rr is longer, a trill in under half the takes |
| mb, nd, ng, nt as one sound | **yes** | a nasal hum and a stop in one syllable, no vowel before it |
| ch | **yes**, as «sh» | noise without a closure, lower than s |
| v | **partly** | voiced and soft, not a b; lip or teeth cannot be told |
| Stress: the last vowel unless an acute says otherwise | **partly** | the acute lengthens its vowel and the recognisers write it; the final stress of an unmarked word shows in nothing measured |
| Nasal harmony | **cannot tell** | the spelling carries it and the voice says what is written |

**The y.** F1 and F2 of y are 358 and 1,428 Hz: as high in the mouth as i (316, 2,320) and u (402, 684), and halfway
between them from front to back, where the sixth vowel belongs (24 takes a vowel; a 731 and 1,290, e 446 and 1,957,
o 517 and 771). All 6 pairs that differ by y against i or u are told apart by both recognisers; both words are heard
exactly in the 2 y / i pairs by the large one and in 3 of the 4 y / u pairs by the independent one. On the pictures of
ita / yta and yvytu / yvyty the second formant of y sits at 1,500 to 1,700 Hz, that of i at 2,400, that of u at 800. A
last y sometimes comes back as e (*ky'a* → «kéi a»).

**The nasal vowels.** In single words the last vowel of the nasal word is apart from its oral twin's in every take of
21 pairs out of 22 (40 mel bands, ten seeds a word; median 2.7 times the distance between seeds; hu / hũ in 85 % of
takes). But what differs is the pitch: in the six pairs of the course the nasal vowel is 1.4 to 3.9 semitones higher.
The formants do not move (pyta 792 and 1,250 Hz; pytã 787 and 1,287), and the pictures of pyta / pytã, tupa / Tupã and
téra / térã show no nasal hum and no weakened first formant; téra and térã look alike. Inside a sentence the
difference shrinks to 1.1 to 1.4 times the seed distance. The recognisers hear pytũ, okẽ, peteĩ and ñe'ẽ with their
nasal vowel, porã and mokõi in half the hearings; pytã came back «pyta» from both in every take and setting tried, térã
as «téra», akã as «haka», michĩ as «miche», tapỹi as «tapýi», Tupã as «tupa» from the large one. A learner asked to hear «el aire por la nariz» would be listening to pitch. So the pairs stay
silent, and a native ear decides (first item of the list below).

**The puso.** The level falls between the two vowels by a median of 17 dB in single words (72 takes of 12 words; 10 dB
or more in 92 % of them) and of 48 dB inside a sentence (every take); in the same words written without the puso it
falls 1.5 dB, never 10. All 4 puso pairs are told apart by both recognisers. The pictures: in *ka'i* a silent gap of
90 ms; in *mbo'y* 120 ms of creak, 15 to 20 dB down, which both recognisers write as h («mbohy»); *kái* and *mboy* run
through without a break. The large recogniser writes the puso-less *mboy* as «mbo'y».

**g̃.** Written as the model's training text did, the g and the vowel after it are apart from those of the same word
with a plain g and an oral vowel in every take of 6 words (the g: 1.9 to 3.3 times the seed distance), also where the
nasal vowel comes two syllables later (oguahẽ): the nasality reaches back. The large recogniser writes a nasal
consonant there («angãite», «ko'ana»); the independent one writes *hag̃ua* with its g̃ and wrote «ko'ág̃a» once. Whether that g is the nasal g the
course describes or an ng, a machine cannot say.

**j.** Between vowels it is voiced all through, without noise above 2.5 kHz (24 dB under the low band), with a fall of
20 dB as for a stop in half the takes: a voiced sound of the palate, never the voiceless jota. The 27 words with j in
the course's clips, said alone twice: the j is heard as j in 87 hearings of 108, as d, t or y in 20 (*aju* → «adu»,
*roju* → «royu»), as h in 1. One word that is not a clip today, *jasy*, came back «hasy» from both recognisers in every
take, and its picture shows a noisy, h-like start: the model knows the jota from the Bible's names, and *jasy* looks
like one. `--verify` would flag it («heard as the other word of its pair») if the pair jasy / hasy returns.

**h.** Between vowels a stretch of 72 ms, 9 dB under the vowel, with breath noise (high band 14 dB under the low,
against 25 for j and r): it sounds. *heta*, *ha*, *hasy*, *aha*, *hendu* are heard right by both recognisers; on the
picture of *heta* the h is 100 ms of noise before the e. After a pause inside a line the independent recogniser loses
it («ha nde» → «a nde»), one reason the tool makes no pause at a comma.

**r and rr.** One fall of the level, 56 ms long, in 35 takes of 36, at the start of the word too (*ru*, *réra*, *roju*:
44 to 60 ms): a tap, never a trill. rr is 2.7 times as long (152 ms) with two falls in 8 takes of 18: a short trill at
times, a long tap at others. At the start of a single word the tap comes after a short voiced hum, which the
recognisers write as a vowel or take for an l («yru», «lu»).

**mb, nd, ng, nt.** mb is twice as long as m (132 ms against 64) with a deeper fall (19 dB against 9), voiced all
through; nt ends in a voiceless stop (a fall of 51 dB). At the start of a single word, mb and nd begin with 20 to 60 ms
of nasal hum (the band from 1 to 4 kHz is 25 to 32 dB under the band below 500 Hz, as for a plain m or n; a written e
before them gives 12 to 18) and then open: no vowel before them, one syllable. *mba'eve*, *ndaipóri*, *mbarakaja*,
*ndaikuaái*, *mba'éichapa* are heard right by both recognisers. The model says a bare b or d the same way: «doce»
comes back «ndose».

**ch.** Noise without any closure before it (no near-silence in 24 takes; t, k and p have 52 to 80 ms of it), centred
at 4.0 kHz against 5.0 kHz for s, 120 ms long: «sh», not the Spanish ch. *che* and *chipa* are heard right. Notes G1
leave open which of the two the course wants; the voice has decided for «sh».

**v.** Voiced all through, without noise (the high band 35 dB under the low), with a shallow fall (13 dB; p, t and k
fall 47 to 54): a soft continuing sound, not a b. *vaka* is heard right by both. Whether the lip touches the teeth, as
the course describes, a machine cannot tell.

**Stress.** The acute works. Inside a sentence the vowel with the acute is longer than the same vowel without it, by a
median of 34 ms against the word's last vowel (13 words of 14; in a second frame 36 ms, 10 words of 10), and the
recognisers write the accent where it is written and nowhere else (ána: 12 hearings of 12, none without). Its pitch is
lower than the next vowel's, not higher (3.4 semitones lower than in the unmarked form): the rise comes after it. For a
word without a mark, nothing measured shows the last vowel as the stressed one: in a sentence it is the longer one in
4 words of 18, the louder in 7, the higher in 6. Alone, the last vowel of every word is long anyway.

**Nasal harmony.** The course writes it (ña-, -me, n-) and the voice says what is written: *ñañe'ẽ*, *ógape* and
*tetãme* are heard right by the large recogniser, *jakaru* as «jacaru». Whether the unmarked vowels beside ñ, m and n
are nasal: the measure used went one way in three comparisons and the other way in two. No answer.

## What must stay without audio

`sound/silent.json` holds the rule and `make-tts.py` obeys it: the rows are not said, and the manifest the tool writes
next to its WAVs leaves them out, so `make-sound.mjs` registers no clip for them and the screens keep their written
stand-in.

The rule today: **the two words of a sound pair that differ only by a nasal vowel.** In the manifest of 2026-11-10 that
is 26 keys:

- «Sonido y letra», unit 1 day 2, «Las vocales nasales», all four pairs: `a1u01d2.s0a` to `a1u01d2.s3b` (pytu / pytũ,
  oke / okẽ, tupa / Tupã, pyta / pytã);
- unit 1 day 5, all three pairs: `a1u01d5.s0a` to `a1u01d5.s2b` (okẽ / oke, porã / póra, téra / térã);
- unit 1 day 6, the first pair: `a1u01d6.s0a`, `a1u01d6.s0b` (pyta / pytã);
- unit 2 day 4, the first two pairs: `a1u02d4.s0a` to `a1u02d4.s1b` (tupa / Tupã, pytu / pytũ);
- Hablar, the three pairs marked «nasal»: `p0.0`, `p0.1`, `p1.0`, `p1.1`, `p2.0`, `p2.1`.

The rule is by what the pair teaches, not by key, so it holds when the manifest is made again. A word that is silent
as half of a pair is still said where it is a word of a scene (*mitã*, *okẽ*, *téra*): there it is a word said
imperfectly and marked «voz sintética», not a lesson in telling two sounds apart.

Not silenced, and flawed: the lines with Sofía (heard «sosía»), with Nilda, Lucas and Luis (the l), and «Diez mil.»,
said by the Spanish voice. To silence one, add its key or its text to `silent.json`.

## What a native speaker should listen to first

1. **Two nasal pairs, before anything else:** *pyta* / *pytã* and *oke* / *okẽ*. If the second word of each sounds
   nasal to you, the rule in `silent.json` can go (run the tool with `--silent none` to hear them) and the nasal steps
   get their audio. If it only sounds higher, the rule stays.
2. **The puso words:** *ka'a*, *mbo'y*, *so'o*, *mba'e*. In *ka'i* the gap is clean; in *mbo'y* the voice creaks
   through it, and the recognisers hear an h.
3. **The y:** *yta*, *yvyty*, *sa'y*, *py*. The formants say it is the right vowel; an ear must agree.
4. **The stress:** *óga* against *ogakuéra*, *koty* against *kotýpe*, and the names (Ana, Rosa, Ramona). The acute
   makes its vowel longer and lower, with the rise after it. Is that where you hear the stress? And do *terere* and
   *aguyje* sound stressed at the end?
5. **g̃:** *ko'ág̃a*, *ag̃aite*, *og̃uahẽ*, Tereg̃uahẽ.
6. **The start of single words:** *ru*, *réra*, *vaka*, *jagua*, *aju*, *ñu*, *po*, *kesu*. The voice starts with a
   short hum before r, v and ñ, and the recognisers disagree on the first consonant of *po* and *kesu*.
7. **The names and the Spanish:** Juan, Lucía, Sofía, Nilda, Luis; «Diez mil.» in the seller's line; «ochenta».
8. **The two voices of a dialogue:** is M different enough from F?
9. **ch:** is «sh» what the course wants?

## How to make the clips again

```
# once: Python 3.10 or later with torch, transformers, soundfile and numpy; ffmpeg with rubberband. A CPU is enough.
export HF_HUB_DISABLE_XET=1        # hosts: huggingface.co and us.aws.cdn.hf.co

node tools/sound-list.mjs A1                             # the clip list
python3 tools/make-tts.py --dry-run                      # what would be said; stops on anything it cannot say
python3 tools/make-tts.py --out /tmp/voz --verify        # the clips, each heard back
node tools/make-sound.mjs /tmp/voz --manifest /tmp/voz/manifest.json --kind synthetic
```

- The two voices are 145 MB each. `--verify` needs the recognisers in the Hugging Face cache as well
  (`ivangtorre/wav2vec2-xlsr-300m-guarani`, 1.2 GB; `facebook/mms-1b-all` with `adapter.grn.safetensors` and
  `adapter.spa.safetensors`, 3.9 GB, about 6 GB of memory with both loaded). Without it the tool says each clip once,
  with its own seed, and writes no report.
- Time: 40 clips took 3 minutes with `--verify` on four shared CPUs, so the 487 clips of A1 take about 40 minutes;
  without it, about a second a clip.
- `--takes /tmp/voz/tts-report.json` makes the same takes again without the recognisers.
- `--only 'a1u01d1.*' p3.0` for a part; `--redo` to say again what is there; `--silent none` to say the silent pairs
  too, for a listener.
- The manifest to give `make-sound.mjs` is the one in the output folder, not `sound/A1/manifest.json`: it is the same
  list without the silent rows.
- A new name, a Spanish word or a new character in the content stops the run until `sound/respell.json` has it.

The scripts, logs, pictures and clips of the measurements are in the scratch folder of the session that made them
(`…/scratchpad/voice`: `SETUP.md`, `scripts/`, `work/*.log`, `probe/`, `pics/`, `sample/`, `sample-out/`), not in the
repository.
