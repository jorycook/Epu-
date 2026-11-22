# The synthetic voice: what it says, how well, and what must stay silent

Epu'ã has no recordings by a person yet. `tools/make-tts.py` makes stand-in clips with a voice model, for the screens
to play marked «voz sintética» until the studio's recordings replace them. For A1 units 1 to 4 and the extras those
clips exist: the takes are kept in `sound/A1/voz`, and the app's sound files (`project/gn-sound-*.js`) are made from
them. This file is the record of that voice: the model and its licence, how the text is prepared, how a clip is said,
the voices, every number that was measured, what each sound the course teaches scored, what must stay without audio,
what a native speaker should listen to first, and how to make the clips again. The measurements are of 2026-11-10, in
three rounds: a first probe, an independent verification that refuted part of it, and a fix round. What the
verification refuted is corrected here, not kept. A trial of the people's names followed the same day, after which
thirteen people were renamed («The names of the people»); then the lines that had changed were said, what the rounds
had left open was settled, and the sound files were built («The run of 10 November, after the names»). That run was
cut off before its end. On 16 November its work was checked and finished («16 November», under «What was measured»):
every count, size and score of the folder and of the sound files below was measured again that day, from the files as
they are; the words of the nasal pairs were said once, so that every recording that stays silent waits as a clip for a
listener; and the tools learnt to bring such a clip back when a person frees it, and to leave a sound file alone when
none of its clips changed. On 17 November, after an independent review of the voice in the app, the clips' side was
mended («17 November», under «What was measured»): the clips are levelled as they ship, a second ear's test hears
every clip decoded from its MP3, what failed it was said again or silenced, and the lines the recognisers hear wrong
are laid out for a listener; the counts, sizes and scores of the folder and of the sound files were measured again
that day and are given where they stand.

**Nobody listened to any of this.** Every judgement below was made by machine: two speech recognisers, distances between
clips, measures on the model's own alignment, and pictures of the waveform and the spectrogram. A machine can tell that
two clips differ, that a gap of silence sits between two vowels, where a vowel's formants are, whether a consonant is
voiced, whether a closure and a burst are there. It cannot tell whether a vowel sounds nasal to a Guarani ear, whether
the stress falls where a speaker puts it, whether a j sounds like the «y de yo», or whether the voice is pleasant. Where
the machine could not tell, this file says so.

## In one screen

- **Verdict: ship with exclusions**, as a stand-in marked «voz sintética», in a free app without ads.
- **How well.** Of the 438 clips that stay, single words come back from the independent recogniser at 6.1 % CER and
  from the large one at 4.8 %, lines of two words or more at 9.2 % and 3.5 %, the slow takes that stay at 8.9 % and
  3.8 % (the best of up to three takes, or the take the ear's test on the MP3 kept; the first take alone of the same
  clips scores 8.7 % and 8.3 % on words, 12.6 % and 5.5 % on lines). Real Guarani speech scores 11.0 % and 6.5 % on
  the same recognisers.
- **Silent, by rule** (`sound/silent.json`): the pairs that differ only by a nasal vowel (pyta / pytã, pytu / pytũ, oke
  / okẽ, tupa / Tupã, téra / térã, porã / póra); mbo'y / mboy; the pairs of «La r, siempre suave»; tetã / tetãme; óga /
  ogakuéra; the words okẽ, ñúme, angirũ, roju, roho, chero'y, chemandu'a and ñemuhára wherever they are a clip; four
  short clips (Héẽ, «Ikatúpa aike?», «che irũ», «Aike mbo'ehaópe.»); three lines that a listening question turns
  on, each with its whole item («Ha'e Argentina-gua.», «Héẽ, ndahái.», «Ag̃uahẽma che rógape. Ka'aru aháta
  mbo'ehaópe.»); and, named by the ear's test on what ships on 17 November, three examples of Teach in which a word
  that is silent on its own was heard with the same flaw («Che réra Moisés. Che Argentina-gua.», «Héẽ, chekane'õ ha
  chero'y.» with its dialogue, «Che ru chokokue ha che sy ñemuhára.»): 69 rows.
- **Silent, by ear:** `--verify` leaves out by itself every short clip a learner hears on its own that both recognisers
  hear with wrong letters (4 rows today that the rule does not name, none of which a screen plays), and every slow
  take that is heard worse than the normal take of its line: 22 of the 47.
- **The same ear on what ships** (since 17 November, `tools/hear-sound.py`): every clip is decoded from its MP3 and
  heard three ways by both recognisers; a clip of one or two words that both hear with wrong letters in two hearings
  of three, an example heard as the form its own lesson calls wrong, and a line in which both mishear a word that is
  silent on its own are said again with up to twelve seeds, and silenced if no take passes. The first run said twelve
  recordings again and silenced the three examples named above. None of the 199 clips of one or two words is heard
  wrong now; 21 of the 374 Guarani lines at the normal rate still are (20 recordings, none of them a rule's case),
  and they are laid out for a listener, with what each recogniser wrote («What a native speaker should listen to
  first», 18).
- **In all,** 110 of the manifest's 736 rows have no clip for one of these reasons, 15 of them clips that are put
  together from a line that is silent; 60 of the 110 are keys a screen asks for today. Ten of the twelve listening
  lessons play (one of them has its slower version), two of the placement's three listening items, both of the level
  exam's, 19 of the 20 dialogues of Teach and 146 of its 150 examples in all. 438 clips are in the folder and 65 more
  in its `left-out/`, for a listener: every recording that stays silent waits there as a clip.
- **A person's verdict goes into `sound/silent.json`**, and one command applies it: a clip that is freed there comes
  back from `left-out/` as it is, the very file that was heard, without the voice being run («How to make the clips
  again»).
- **In the app:** seven sound files, 3.67 MB as they are and 2.25 MB as a server sends them gzipped: 355 clips, 10.7
  minutes. 415 of the 475 keys a screen can ask for have a clip. Every clip, and every line of a clip that is put
  together, ships within 2 LU of −16 LUFS (−17.8 to −15.8 by the review's measure, −16.0 at the median), and none
  peaks over −1.5 dBTP.
- **Rendered:** the y; the h; mb, nd, ng, nt as one sound; the ch; the v; the r inside a word; the ñ; the u that always
  sounds; the puso after a, e and i; the j between vowels and, run in, at the start of a word; the k, run in.
- **Rendered in part, or not shown:** the nasal vowels (the voice makes them different by pitch; ĩ is heard, ã and õ are
  not); the puso after o, u and y in some words (a creak heard as h: *mbo'y*); the g̃ (no such letter in the model); the
  stress (the acute moves length only; the final stress of an unmarked word shows in nothing measured); the j before u
  (a stop: *aju* as «adu»); the k before e (*okẽ*, *aike*).
- **Not rendered:** the r that opens a word said alone (a hum, not a tap); rr (one long tap, never a trill); *ñúme*. And
  outside what the course teaches: f («Sofía» as «sosía»), l («Luis» as «ndúi», «mil» as «mi»), ld, rl, tr, rt, dr, a
  bare d, a last r.
- **The people's names:** thirteen people whose names had one of those sounds (Luis, Lucas, Lucía, Nilda, Carlos, Sofía,
  Pedro, Marta, Mateo and four more) were given names the voice can say, on 10 November, and Ana and Ramona another
  spelling for the voice («The names of the people»). The 45 takes this touched were said again that day: in the
  Guarani clips that stay a person's name is said 48 times, and both recognisers hear its letters in 44 of them.
- **Cannot tell:** nasal harmony, beyond the spelling; whether the ch is «sh» or the Spanish ch.
- **The voice is one man.** F is the model as it is; M is the same voice two to three semitones lower. F is not a
  woman's voice. In a dialogue a longer line is moved towards its voice's pitch; even so the man's line is the higher
  one, or less than a semitone lower, in 7 to 11 exchanges of 45, depending on which pitch tracker counts («The
  voices»; before the lines were placed: 11 of 44 by the tool's own).
- **The licence is non-commercial** (CC BY-NC 4.0). These clips may not ship in an app that is sold or carries ads.
- **The takes are `sound/A1/voz`** (FLAC, lossless, 11.7 MB with what was left out). A fresh run on another machine
  gives other samples, so that folder is kept and added to: after a change of the content, `--verify --changed` says
  only the lines that are new or changed («How to make the clips again»). Run with nothing changed, on 16 November and
  again on 17 November with the ear's test at its end, the whole line said nothing, heard nothing and left every file
  as it was, byte for byte.

## The models and the licence

| | Guarani | Spanish (the narrator) |
|---|---|---|
| Model | `facebook/mms-tts-grn` | `facebook/mms-tts-spa` |
| Where | https://huggingface.co/facebook/mms-tts-grn | https://huggingface.co/facebook/mms-tts-spa |
| What it is | VITS, one speaker, 16 kHz, 36.3 M weights, 145 MB | the same architecture |
| Made by | Meta AI, Massively Multilingual Speech (MMS) | the same |
| Licence | CC BY-NC 4.0 | CC BY-NC 4.0 |

The model cards name no speaker and no training text. The vocabulary (lower-case letters, no punctuation, an em dash)
and the MMS paper point to recordings of read Bible text, and what the recognisers hear agrees: *kesu* comes back as
«Jesús» from the large recogniser, and the model says «Juan» and «Pedro» the Spanish way without being told.

**Attribution the licence requires** (CC BY-NC 4.0, section 3(a)): the creator, a notice of the licence with its
address, a link to the material, and a note that it was changed. The line for the app's licences page:

> Voz sintética: MMS-TTS guaraní y castellano, de Meta AI (https://huggingface.co/facebook/mms-tts-grn y
> https://huggingface.co/facebook/mms-tts-spa): Pratap et al., «Scaling Speech Technology to 1,000+ Languages», 2023.
> Licencia CC BY-NC 4.0, solo para uso no comercial: https://creativecommons.org/licenses/by-nc/4.0/. Audio generado
> con esos modelos y modificado (recortes, tono) por `tools/make-tts.py`. Sin garantías.

`make-tts.py` writes the model and the licence into `voices.json`; `make-sound.mjs` copies them into the header of every
sound file and into `gn-sound-index.js` (`window.__gnSoundVoices`), and the app build writes each voice's name, model
and licence from that index into the «Sound» part of its `licenses.txt`. Since 16 November the build writes the whole
line above there too, made from the models the index names, with what «non-commercial» means for the app (below); it
stops on a voice model it has no credit for. In the app, the sheet «Voz sintética» of Progreso gives the credit in
short (MMS-TTS, Meta AI, CC BY-NC 4.0), and the README has the line under «Licences». The takes themselves carry the
notice in `sound/A1/voz/README.md`.

**What «non-commercial» means for this app.** The licence allows use that is "not primarily intended for or directed
towards commercial advantage or monetary compensation". A free app without ads, as Epu'ã is today, fits. The clips may
not ship once the app is sold, sits behind a subscription, carries advertising, or is given to a company as part of a
paid service: the studio's recordings (CC BY 4.0) must replace them first. Anyone who copies the clips takes them under
the same terms, so the repository and the app must say that these clips are CC BY-NC 4.0, not CC BY 4.0 like the
recordings the plan foresees. This is the tool's reading of the licence, not legal advice. The recognisers were used to
measure only: nothing of them ships.

## How the text is prepared

The models read letters, not phonemes, and know only their own symbols. The Guarani model has 53:

```
space ' - — _ 0-9 a b c d e f g h i j k l m n o p q r s t u v x y z á é í ó ú ý ã ẽ ĩ õ ũ ỹ ñ
```

There is no w, no g̃, no punctuation. The Spanish model has 45: the same without the apostrophe, the hyphen, the nasal
vowels and ý, plus ü. The models' tokenizer lower-cases the text and **drops every character it does not know without a
word**. What that does to the course's text, tried one by one (the verification tried 38 more inputs made to break it:
decomposed vowels, five other apostrophes, G̃, ĝ, î, a no-break space, a tab, parentheses, a slash, digits, hyphenated
loans, unknown names; all behave as this table says):

| In the course's text | What the tokenizer does | What `make-tts.py` does |
|---|---|---|
| Capitals (also Ñ, Á, Ã) | lower-cases them | the same |
| The puso as `'` U+0027 | keeps it: it is a symbol | keeps it |
| The puso as `’` U+2019 or `ʼ` U+02BC | drops it: *mba’éichapa* becomes «mbaéichapa» | turns every puso-like mark into U+0027 first |
| g̃ and G̃ (g + U+0303) | drops the tilde: *hag̃ua* becomes «hagua» | writes the tilde on the vowel after it (below) |
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

In the A1 manifest of 2026-11-10 (736 rows, 502 of them recordings) the characters the Guarani model does not know are
`.` `?` `,` `!` `«` `»` and the combining tilde of g̃ (15 words in 14 rows: Tereg̃uahẽ, ko'ág̃a, og̃uahẽ, ag̃aite,
Ag̃uahẽma); in the narrator's lines `¿` `?` `.` and the digits 1, 2, 3. Every other Guarani string of `content/a1/parts`
and `content/extra` was read too (2,229 strings in 33 files): they add `·` `→` `+` `…` `/` `:` `=` and digits, in rules
and forms that are not clips. If one becomes a clip, the tool stops on it. A manifest with seven bad rows stopped with
exit 2, nothing written, each key and character named.

**A question is not said differently.** Neither model has a question mark. Guarani marks most questions with -pa or
piko, so little is lost there; «Iporã, ha nde?» and the narrator's «¿Qué responde el hombre?» come out as statements.

**g̃.** The model has no such letter and no combining tilde, so its training text cannot have given it one. For the
voice, and only for the voice, the tilde goes to the first vowel after the g̃ (*hag̃ua* → haguã, *ko'ág̃a* → ko'ágã,
*ag̃aite* → agãite), unless a nasal vowel already follows (*og̃uahẽ* → oguahẽ, *Tereg̃uahẽ* → tereguahẽ). That this is
how the model's training text wrote these words is an inference, not a fact: in the corpora on disk, which are not that
text, the spelling with the tilde on the vowel is the commoner one for two of the words (*haguã* 6,642 against *hag̃ua*
and *haĝua* 3,219; *ko'ágã* 1,587 against 406) and the rarer one for the other two (*oguahẽ* 5 against 87; *agãite* 6
against 66). What counts is what comes out: said this way, the independent recogniser, which has g̃ among its letters,
writes g̃ in 14 takes of 15 of *ag̃aite*, *ko'ág̃a* and *hag̃ua*, and in none of 15 takes of the same words given with a
plain g (the verification's measure). A g̃ before a vowel with an acute (*hag̃uáicha*) would lose its nasality: no such
word is in the course today.

**Spanish inside Guarani lines: `sound/respell.json`.** The voice reads letters the Guarani way: c before i as «ch» or
«k», a word without a mark with the stress on its last vowel. So a Spanish word is written for the voice as a Guarani
speaker would spell what is said: h for the jota, s for c and z, k for c and qu, the acute on the Spanish stress. The
spellings are sound; what the voice then says is another matter. Each word was said three times or more inside «che réra
…» and heard by both recognisers (the first round, and three more seeds each in the verification). The people's names
were then tried more widely, and thirteen people were given other names: «The names of the people», after this table.

| In the course | Said as | What came back |
|---|---|---|
| The people | | «The names of the people», below. |
| Luque | lúke | **Not rendered: the l** («ndúke», «núke» in 6 hearings of 6). It stands in one sample answer of the level exam, which is read, not said. |
| Argentina-gua | arhentinagua | h for the g before e, one word, no acute: -gua takes the stress. The r is lost: «ahentinagua» from both. |
| veinte, cuarenta, noventa | véinte, kuarénta, novénta | Right (the fix round, three seeds, alone in F and in M and inside «oguereko … ary»): véinte in 12 hearings of 12 alone; kuarénta in 5 takes of 6 (independent) and 6 of 6 (large, written «cuarenta»); novénta in 6 of 6 each. |
| ochenta | ochénta | Alone, right in 6 hearings of 6 by F; in M's voice the large recogniser heard «osénta» twice in 3. After a word that ends in o the first o is swallowed («oguereko chénta»). |
| treinta, cincuenta, sesenta, setenta, cien, doce | the Spanish voice when the line is only the number; inside a sentence tréinta, sinkuénta, sesénta, seténta, sien, dóse | **Not rendered:** tr («téinta» from the independent recogniser 6 times of 6), the n before k («cikenta»), a bare d («ndose» in 15 hearings of 18), *sien* («csien», «cén»); *sesenta* and *setenta* lose their first s for the large recogniser when F says them alone («esen a», «etenta»). |
| diez, mil | the Spanish voice | **«Diez mil» fails in each of the eight spellings tried** («riesmi», «ndiehmi»): no d without n, and a last l is dropped. |

**The names of the people.** No respelling repairs l, f or d. Until 10 November the manifest had Luis in 14 recorded
rows, Lucas in 5, Pedro in 3, and Lucía, Nilda, Carlos, Sofía and Mateo in 2 each, and Marta, Mirta, Diego, Elena and
Clara stood in text that is read. That day every name of the cast was tried the way the first rounds had tried names,
and more widely: inside «che réra …» (A), opening a sentence, «… oho ko ka'aru» (B), closing one, «mba'éichapa reiko …»
(C), and in a line of two words, «héra …» (D); three seeds each, the clip made by the tool's own code (the first take: a
carrier, a pause, the cut) and heard by both recognisers. A name counts as right when the stretch heard in its place has
its letters, marks aside, in the respelling or in the Spanish spelling («juan» for *huan*); a puso between the name and
the word before it is not counted. Thirteen names were not heard right by both recognisers in most takes, among them
three the first rounds had found right inside «che réra …», by the large recogniser (Pedro, Marta, Mateo):

| Until 10 November | Said as | Independent: A B C D | Large: A B C D | What came back | Now |
|---|---|---|---|---|---|
| Luis | luis | 0/3 0/3 0/3 0/3 = **0/12** | 2/3 1/3 0/3 0/3 = **3/12** | «nuis» ×6, «nui» ×2, «ndui» ×2, «nduis» ×2: the l that opens the word | Vicente |
| Lucas | lúkas | 0/3 0/3 0/3 0/3 = **0/12** | 0/3 2/3 3/3 0/3 = **5/12** | «nukas» ×4, «ndukas» ×3, «nduka» ×3, «joukas» ×2: the l | Moisés |
| Carlos | kárlos | 0/3 0/3 0/3 0/3 = **0/12** | 2/3 0/3 2/3 3/3 = **7/12** | «karios» ×4, «kalo» ×2, «kalos» ×2, «kallo»: rl | Santiago; the exam's sample speaker, Jacinto |
| Pedro | pédro | 0/3 0/3 0/3 0/3 = **0/12** | 2/3 3/3 3/3 3/3 = **11/12** | «petro» ×4, «peru» ×2, «peveru», «peteru»: the d, and dr | Casimiro |
| Mateo | matéo | 3/6 2/6 3/6 0/6 = **8/24** | 5/6 4/6 4/6 6/6 = **19/24** | «matevo» ×10, «mateva» ×2, «matero», «matiio»: e and o run together with a v between them | Genaro |
| Diego | diégo | 0/3 0/3 1/3 0/3 = **1/12** | 2/3 0/3 1/3 1/3 = **4/12** | «ndiego» ×4, «ndieg» ×2, «nliivo», «ndiigo»: the d | Tito |
| Lucía | lusía | 0/3 1/3 0/3 0/3 = **1/12** | 1/3 2/3 0/3 0/3 = **3/12** | «nusia» ×5, «nusi'a» ×4, «ndusia» ×2, «dusia» ×2: the l | Sara |
| Nilda | nílda | 0/3 0/3 0/3 0/3 = **0/12** | 1/3 0/3 0/3 0/3 = **1/12** | «ñivyva» ×2, «ñiva» ×2, «nigda» ×2, «niveha»: ld | Susana |
| Sofía | sofía | 0/3 0/3 0/3 0/3 = **0/12** | 0/3 1/3 1/3 0/3 = **2/12** | «sosia» ×9, «sosie» ×7, «sosive», «soviae»: the f | Karina |
| Elena | eléna | 0/3 1/3 1/3 0/3 = **2/12** | 0/3 1/3 0/3 0/3 = **1/12** | «relena» ×7, «evena» ×4, «erena» ×2, «rendema»: the l between vowels | Samanta |
| Clara | clara | 1/3 0/3 0/3 0/3 = **1/12** | 3/3 0/3 1/3 3/3 = **7/12** | «chara» ×5, «kyara» ×4, «kara» ×3, «kjara»: cl | Tania (first Jimena) |
| Mirta | mírta | 0/3 0/3 0/3 0/3 = **0/12** | 1/3 0/3 0/3 0/3 = **1/12** | «mita» ×11, «mikta» ×4, «milta» ×3, «milkta» ×2: rt | María |
| Marta | márta | 0/3 0/3 0/3 0/3 = **0/12** | 3/3 2/3 1/3 1/3 = **7/12** | «alta» ×4, «malta» ×3, «mata» ×3, «arta»: rt | Teresa |

So these thirteen people have other names now, in the whole course, written and spoken alike; the level exam's sample
speaker, who was a Carlos too, is Jacinto. The new names were chosen among 139 other first names tried the same way:
frame A first, and 36 of those that both recognisers heard right there in two takes of three or more went on to B, C and
D. The names now in use were then said with three more seeds. In all: 158 names in 178 spellings, 1,575 takes (1,410 in
F's voice, 135 in M's, 30 by the Spanish voice).

| Name | Said as | Independent: A B C D | Large: A B C D | When not right |
|---|---|---|---|---|
| Ana (kept) | ãna | 4/6 6/6 6/6 6/6 = **22/24** | 5/6 6/6 6/6 6/6 = **23/24** | «aga», «agna», «anaa» |
| Rosa (kept) | rósa | 6/6 3/6 6/6 6/6 = **21/24** | 6/6 5/6 6/6 6/6 = **23/24** | «ndosa» ×2, «oosa», «dosa» |
| Ramona (kept) | ramõna | 6/6 1/6 6/6 6/6 = **19/24** | 5/6 5/6 6/6 6/6 = **22/24** | «amona» ×2, «pamona», «ñamona», «yamorna» |
| Juan (kept) | huan | 5/6 0/6 3/6 5/6 = **13/24** | 6/6 0/6 6/6 6/6 = **18/24** | «voan» ×5, «po'an» ×2, «huam», «koan» |
| José (kept) | hose | 6/6 6/6 4/6 6/6 = **22/24** | 6/6 6/6 4/6 6/6 = **22/24** | «hosee», «hoseve», «joseae», «josea» |
| Tomás (kept) | tomás | 6/6 6/6 6/6 6/6 = **24/24** | 6/6 6/6 6/6 6/6 = **24/24** | — |
| Vicente (was Luis) | visénte | 5/6 4/6 6/6 5/6 = **20/24** | 6/6 4/6 6/6 6/6 = **22/24** | «misente» ×2, «guisente», «vyisente», «risente» |
| Moisés (was Lucas) | moisés | 3/6 2/6 5/6 6/6 = **16/24** | 6/6 6/6 6/6 6/6 = **24/24** | «moise» ×3, «moikseiks», «moiseks», «mboiseks» |
| Santiago (was Carlos) | santiágo | 6/6 2/6 5/6 6/6 = **19/24** | 6/6 6/6 6/6 6/6 = **24/24** | «sanqiago» ×2, «santiagvo», «satiago», «santiaago» |
| Casimiro (was Pedro) | kasimíro | 4/6 5/6 4/6 6/6 = **19/24** | 5/6 5/6 4/6 6/6 = **20/24** | «kasimivo», «kasimbiro», «kasimire», «kasimbro» |
| Genaro (was Mateo) | henáro | 4/6 3/6 4/6 6/6 = **17/24** | 4/6 3/6 6/6 6/6 = **19/24** | «henar» ×5, «henalo» ×2, «henalva», «heraro» |
| Tito (was Diego) | títo | 5/6 6/6 3/6 5/6 = **19/24** | 5/6 6/6 4/6 6/6 = **21/24** | «tita» ×7, «tiko» |
| Jacinto (the exam's sample speaker) | hasínto | 6/6 5/6 6/6 6/6 = **23/24** | 6/6 6/6 6/6 6/6 = **24/24** | «hasindo» |
| Sara (was Lucía) | sára | 6/6 0/6 5/6 6/6 = **17/24** | 6/6 6/6 6/6 6/6 = **24/24** | «ssara» ×6, «chara» |
| Susana (was Nilda) | susána | 5/6 6/6 5/6 6/6 = **22/24** | 6/6 6/6 6/6 6/6 = **24/24** | «susna», «susaga» |
| Karina (was Sofía) | karína | 5/6 3/6 6/6 6/6 = **20/24** | 6/6 3/6 6/6 6/6 = **21/24** | «kaina» ×4, «harina» ×2, «kar'ina» |
| Samanta (was Elena) | samánta | 6/6 5/6 6/6 6/6 = **23/24** | 6/6 6/6 6/6 6/6 = **24/24** | «ssamanta» |
| Tania (was Clara) | tánia | **10/12** (three seeds a frame) | **11/12** | The first choice was Jimena (hiména: 17/24 and 23/24), dropped by the lead because it is one sound from *iména*, «su marido»; Tamara (12/12, 12/12) was passed over as too like Tomás and Samanta, the other children of unit 4 |
| María (was Mirta) | maría | 3/6 6/6 0/6 4/6 = **13/24** | 5/6 6/6 2/6 4/6 = **17/24** | «marie» ×10, «mariae» ×4, «marive» ×2, «arive» |
| Teresa (was Marta) | terésa | 6/6 6/6 6/6 3/6 = **21/24** | 6/6 6/6 6/6 6/6 = **24/24** | «tersa» ×3 |

- **Ana and Ramona are written for the voice with a nasal vowel, not an acute: ãna, ramõna.** With the acute the n came
  back m or was lost: *ána* was right in 15 takes of 24 and 20 of 24 («ama» in 8 hearings of 48, «aga», «anda»), and
  *ramóna* in 8 of 24 and 12 of 24 («ramoma» in 23 hearings of 48; right in none of 6 takes after «héra»). The voice says a nasal vowel higher («The nasal vowels»,
  below), which marks the stress, and a vowel before n is nasal in speech anyway. Without any mark, *ramona* is heard
  right in 9 and 10 takes of 12, the stress unmarked; *ramónna*, *ramó na* and *ánna* were no better than the acute.
  Whether ãna and ramõna sound like the names is for a native ear (the list below).
- **Juan** is right inside and at the end of a sentence (13 takes of 18 and 18 of 18) and in none of 6 where it opens
  one («voan», «po'an», «koan»: the h that opens an utterance is lost). No recorded line opens with Juan, and none
  should. Sara opens a sentence badly for the independent recogniser alone («ssara», a long s).
- **María** is the weakest name in use (13 and 17 takes of 24: «marie» for the last two vowels). No clip says it today.
- **In M's voice** («maitei …», A and C, three seeds: 9 takes): Jacinto 9 and 9; Sara 8 and 9; Tito 7 and 8; Teresa 7
  and 9; Ana, as ãna, 7 and 8 (as ána, 4 and 7); Vicente 6 and 9; Moisés 6 and 9; Genaro 6 and 7; Casimiro 5 and 5
  («kasimio»); Ramona, as ramõna, 5 and 7; Susana 4 and 9 («chusana»); Santiago 0 and 9 («santiavo» for the independent
  recogniser in every take). Today M says Ana in two lines and Moisés in one. The Spanish voice, after «qué responde»:
  Vicente, Moisés, Santiago, Genaro and Tito in 3 takes of 3, Casimiro in 2, Jacinto in 1 («rasinto»).
- **What a name needs**, for the people of later units: syllables of one consonant and one vowel, with m, n, p, t, k, s,
  an r inside the word, the jota (given as h), v, nt or ns; the stress one before the end, marked with an acute, or at
  the end (José, Tomás, Moisés). What failed: l, f, d and b; every other cluster (rt: Marta «alta», Arturo «anturo»; dr;
  rm and rn: Norma, Carmen; st and kt: Néstor, Víctor; gn); a last r (César «sesa», Omar, Óscar, Javier) and most last n
  (Iván «iva», Simón «simom»; Juan is the exception); two vowels in a row in most names (Mateo «matevo», Mauro «maoro»,
  Noemí «no'emi», Ireneo, María «marie»; Mario and Sonia by half), though Santiago and Tania are heard right. A vowel at
  the start is a risk after a word that ends in a vowel (Andrés «randres», Atanasio «ratanasiva»), and a name that ends
  in o loses it before a verb in o- («henar oho»).
- **Heard right and not in use:** Tamara (12 and 12 takes of 12), Santino (11, 12), Josué (11, 11), Samira (10, 12),
  Jonás (10, 11), Vanesa (10, 9), Renata (16 and 20 of 24), Ciro (8, 9), Atanasio (7, 8), and Jimena (17 and 23 of 24), which was
  in use for a day. Each was left
  out because it looks or sounds like a name in use (Tamara and Tomás, Santino and Santiago, Josué and José, Jonás and
  Juan, Renata and Ramona, Vanesa and Vicente, Ciro and Casimiro; Jimena, said «hiména», is one sound from *iména*, «su marido»; Tania, now Ana's daughter, rhymes with her mother's name, which the lead accepted as the least of three flaws) or is rare (Samira, Atanasio); a new
  person may take one where that does not matter, and any other name goes through the same trial first. Heard right and
  unfit for another reason: Maite (next to *maitei*), Roque (*roke* is «dormimos»), Nery and Nancy (their y is not the
  sixth vowel), Aramí and Anahí (Guarani words; Anahí also looks like Ana).
- The scripts, the list of every name with what came back and the takes are in the scratch folder of that session,
  `…/scratchpad/voice-ship/names` (`try_names.py`, `judge.py`, `table.py`, `all-tried.txt`, `try/main.jsonl`,
  `try/wav/`).

**The renaming changed 35 recorded rows, and the new spellings of Ana and Ramona 10 more: those 45 were said again on 10
November** (38 of F, 4 of M, 3 of the narrator; 11 of them slow takes), and the other 423 clips of the verified folder
were kept as they were, byte for byte. Of the 34 said at the normal rate, 17 kept their first take, 11 the second and 6
the third. The 42 Guarani clips come back at 15.7 % and 4.3 % CER; under the old names the same rows scored 22.3 % and
7.1 %. In the Guarani clips that stay, a person's name is now said 48 times in 46 clips, and both recognisers hear its
letters in 45: Vicente in 12 of 12, Ana in 9 of 9, Rosa in 6 of 6, Juan in 5 of 6, Moisés in 3 of 4, Casimiro in 3 of
3, Sara in 2 of 2, Santiago in 1 of 2, Genaro, Karina, Ramona and Susana once each. The large recogniser hears all 48;
the independent one misses Juan in «Ndépa Juan? Nahániri, che Casimiro.» («hu ag»), Moisés in the man's «Maitei,
Moisés.» («mosés») and Santiago in «Ha'e che ru, héra Santiago.» («santiávo»). In the narrator's Spanish a name is
said 15 times and heard in 14 («Juan señala a un señor de la foto.» as «cuan señala»). Since 17 November one example
with Moisés is silent and one with Vicente is said whole («The ear's test on what ships»): a name is said 48 times in
46 clips and both hear its letters in 44, Vicente in 12 of 13 (the large recogniser writes «myisénte» in «Vicente
ndoúi ko ka'aru: oky.»), Moisés in 2 of 3, the others as above.

**Two lines that open with Vicente were said with further seeds.** In «Vicente oho Ñembýpe, ha Rosa oho ñúme.»
(`a1u02d3.p2.x2`) the take the run kept was heard «misénte» by both recognisers, and in «Vicente osẽ mbo'ehaógui ko
ka'aru.» (`a1u02d4.p1.x3`) by the large one. Nine more takes of each were heard. Over the twelve takes of each line
the independent recogniser hears the name in 6 and 6, the large one in 6 and 5: at the start of a sentence the v of
Vicente is there in one take of two. The seventh take is kept for the first line («visénte oho ñembype ha rosa
ohoñúme» and «yvisénte oho ñembýpe ha rosa oho ñúme»: the y is the hum the voice makes before a v that opens a word)
and the fifth for the second («visénte» from both). Their seeds are in `takes.json` like any other. A line of a later
unit should not open with Vicente where it can help it.

**A line that is nothing but a Spanish number goes to the Spanish voice when the Guarani voice cannot say it**: one of
its words is marked "voice": "es" in `respell.json` (diez, mil, treinta, cincuenta, sesenta, setenta, cien, doce) or has
no entry there at all. Prices and ages are said in Spanish in Paraguay, so the words are Spanish in either voice; what
changes is the speaker. «Diez mil.» is one recording, `a1u01d4.r1.l5` (and its slow take), used by the listening items
of unit 1 day 4 and unit 4 day 5 and by a Teach example of unit 4 day 5. The Spanish model says it right («diez mil» in
11 takes of 12; with its pitch moved two semitones down for the seller's voice, in none of 10), so it is not shifted:
for that one line the seller has another man's voice. «Treinta.», the answer in a Teach dialogue of unit 4 day 5
(`a1u04d5.p2.x1.l1`), goes the same way: the Guarani voice says «téinta», the Spanish one «treinta» in 2 takes of 3. A
number word with no entry stops the run when it sits inside a Guarani sentence.

Names that are Guarani spelling are said as written and listed under "as_written" (Itaugua, Ka'akupe, Paraguái,
Paraguay, Ypakarai, Ñemby, Tovatĩ, Itakuruvi), with any suffix. A word the tool does not find in the table stops the run
when it has letters outside Guarani spelling (c without h, q, z, x, w, f, b without m, d without n, two consonants in a
row, a consonant at the end) or is a capitalised word in the middle of a sentence. It cannot catch a Spanish name that
opens a sentence and happens to be Guarani spelling («Sara oho», «Tito oho»): every name of the cast is in the table for
that reason, and a new one has to be put there by hand, once it has been tried («The names of the people»).

## How a clip is said

**A carrier, cut off.** Both models garble a short utterance said on its own. 42 words of the course, two seeds each
(the first round; the verification repeated it on 39 words: 32.2 % and 35.6 % alone, 19.1 % and 16.6 % after the
carrier):

| How the word is said | Independent recogniser: CER, heard exactly | Large recogniser |
|---|---|---|
| alone | 32.8 %, 18 of 84 | 33.1 %, 22 of 84 |
| after a dash alone | 62.0 %, 4 | 63.0 %, 4 |
| twice, the second kept | 50.9 %, 11 | 47.0 %, 18 |
| after «ha upéi he'i —», the carrier cut off | 23.5 %, 31 | 16.9 %, 47 |

Alone, *ka'a* comes back as «haha», *pira* as «tira», *po* as «ho», *vaka* as «va'a»: the first consonant is lost. The
Spanish model does the same («uno» alone: «uono», «gorlo», «gono»; after «y entonces dijo —»: «uno» 3 times of 3). So
every sentence is said after a carrier, "and then he said", in one utterance, and the carrier is cut off. There are two
cuts.

*After a pause.* «ha upéi he'i — …»: the cut is in the middle of the pause the model makes for the dash. Where the pause
is comes from the model's own alignment: a hook on its duration predictor gives the place of every letter, to 16 ms.
When the model makes no clear pause (it does not before *kuéra*, which it knows as an ending), the next carrier is
tried: «upéi he'i chupe —», then «ko ñe'ẽ —». The clip starts 10 ms inside the place of its first letter: the model
often hums before it, and with the hum *che* and *chipa* came back «iche», «ichipa» (44 takes: heard exactly 17 → 21 by
the independent recogniser, 27 → 28 by the large one). Where the clip is cut does not cause the bad first consonants
that remain: the tool's cut, no cut, 30 ms earlier and 30 ms later give the same hearings (the verification, 117 clips a
cut). The model itself opens a word badly after a pause.

*Run in.* So a line of one or two words that opens with p, t, k or j is said without the dash, «ha upéi he'i …», in
running speech, and cut in the closure of its first consonant, 25 ms before the burst (40 ms before the release of a j).
The closure is found on the level between the carrier's last vowel and the end of the consonant: its lowest point, at
least 15 dB under the vowel, then the first rise of 12 dB. Measured in the fix round on the 78 such clips of the
manifest, two seeds each, the same seeds cut both ways:

| Opens with | Takes | Independent: after a pause → run in | Large: after a pause → run in |
|---|---|---|---|
| p | 48 | 15.6 % → 13.3 % | 9.3 % → 4.8 % |
| t | 30 | 12.4 % → 13.9 % | 8.9 % → 6.4 % |
| k | 58 | 10.3 % → 7.4 % | 13.6 % → 12.3 % |
| j | 20 | 8.3 % → 6.1 % | 9.4 % → 6.7 % |
| all | 156 | 11.7 % → 10.0 % | 10.8 % → 8.3 % |

Takes heard with the right letters: 95 → 110 (independent) and 110 → 127 (large); takes both recognisers hear with wrong
letters: 31 → 13. *ka'aru* went from «kaalo» / «haarou» to «ka'aru» in every hearing, *kamby* from «amby» / «hamby» to
«kamby», *peju* from «peiru» / «peitu» to «peju», *kesu* from «hechu» / «kechu» to «kesu» for the independent recogniser
(the large one writes «Jesú» whatever is said). The pictures show why: after a pause the k of *kesu* is a stretch of
noise with no closure and no burst; run in, it is a closure and a sharp burst, and the j of *jagua* is a voiced closure
with a release where the pause gave 80 to 110 ms of weak noise. Two other cuts were tried and dropped: where the
carrier's vowel ends, which left the vowel in the clip («ipira», «iporã»); and at the closure's quietest point, which
took the voiced closure off the j (*jagua* came back «iagua»). With the cut as it is, one recogniser or the other writes
a vowel before a run-in word in about one take in eight (18 and 20 of 140 takes of 28 words, five seeds each; the two
agree on 1), and in 2 and 1 of the 54 short run-in takes that were kept: if a trace of the carrier's last vowel is
there, it is faint. A line of three words or more keeps the cut after a pause for its first take, as measured before,
and has the run-in cut for its second. Words that open with r, v, ñ, a nasal or a vowel have no closure to cut in: they
keep the pause, and their flaws (below).

**What the run-in cut costs.** The word comes at the end of the carrier's phrase, not after a fresh start, and that is
audible: on 16 words, two seeds each, the median pitch of the word is 99 Hz run in against 136 Hz after a pause, and the
clip is 0.43 s long against 0.52 s. Over the manifest (the folder of 10 November), the single words that stay: 138 Hz
(median) and 0.66 s for the 122 cut after a pause, 105 Hz and 0.49 s for the 50 run in, which are heard no worse (5.0 % and 3.6 % against 6.2 % and
5.0 %). Shorter carriers raise the pitch a little («he'i» alone: 118 Hz) and lose what the cut gains (both recognisers
hear wrong letters in 4 takes of 29 with «he'i», in 1 of 32 with «ha upéi he'i», in 7 of 32 after a pause), and a shift
upward costs single words most, so the carrier stays and nothing is shifted. Whether a lower, shorter word sounds right
as a word said alone is for a native ear (the list below); what the measures say is that its first consonant is there.

**A word run in can trail off.** Run in, a word is the end of the carrier's phrase, and the voice lets a phrase die
away. In *tetãme* and *ko'ág̃a* the last syllable falls away over 0.4 s, to 30 dB and more under the first: the take
has one loud syllable, and its highest peak stands 19.6 dB over its loudness, where the 440 takes stand 14.9 dB at the
median. It is the cut, not the seed: twelve seeds of each word, run in, gave 18.0 to 19.8 dB; six seeds of each, cut
after a pause, 13.7 to 14.7. Both recognisers write the two cuts alike («tetame» and «tetãme», «ko'ág̃a» and «ko'ána»),
and `--verify` had kept the run-in takes only because that cut is tried first. Since 17 November the two words have
the take of their own seed cut after a pause (`--only <key> --redo --cut pause --tries 1 --verify`): that, and no
levelling, is what brings them to the loudness of the other clips («The sound files»: −16.0 and −15.8 LUFS as they
ship, where they were at −21.4 and −21.5). The next run-in clips by that measure are «Jajotopáta ko ka'aru.» (17.9
dB), *Jaha!* (17.2) and *ko'ã* (16.9), which ship at −17.3, −17.7 and −17.8 LUFS, within 2 LU of the target; whether a
run-in word sounds like a word said alone is on the listener's list.

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
seed-to-seed noise, so they keep it. The duration noise keeps its default everywhere (0.4 gave 27.8 % against 26.4 % on
56 words).

**Slow takes** (keys ending in `.slow`) are the normal take of the same line said again, **with its seed, its cut and
its pitch**, at a lower speaking rate. The model draws the length of every sound from noise, and that noise is larger
than a rate of 0.8: when each slow take had a seed of its own, 7 of 46 came out less than 10 % longer than the normal
take and 3 of them shorter (the verification). The same seed draws the same lengths, so every sound of the slow take is
as long as in the normal take or longer. How much longer depends on rounding: the model rounds each length up to whole
frames of 16 ms, so 0.8 of the rate gives 1.1 to 1.25 times the length. The rate therefore goes from 0.8 to 0.74 to 0.68
until what is said, from the first sound to the last by the model's alignment, takes 1.15 times as long as in the normal
take. The length of the clip is a poor measure of that: the trim cuts the silence before a first p, t or k and the dying
away of the last sound as it finds them, and a slow take whose sounds were 16 % longer came out 4 % longer as a clip. In
the fix round's run the 47 slow takes take 1.15 to 1.34 times as long as their normal takes in what is said (median
1.21): 36 at a rate of 0.8, 10 at 0.74, 1 at 0.68. They are heard less well than the normal takes of the same lines,
18.1 % and 8.3 % against 14.3 % and 4.7 %: slowed speech is harder for the recognisers, and a slow take is no longer
chosen among seeds as a normal take is (chosen among three seeds, the same lines' slow takes scored 15.8 % and 5.8 %,
and were not all slower). Single words are not slowed: at 0.8 their CER rose from 26.4 % to 37.0 % (56 takes).

**A slow take that is heard worse than its line is left out** (`--verify` does it by itself, since 10 November). A
slower version is there to make a line easier to catch. So the two takes of a line are compared by what the
recognisers wrote: the letters that are off (the edits between what was heard and what was said, spaces, acutes and
tildes aside, the two recognisers added up; spaces are left aside because slowed speech has a recogniser cut words
apart, «ypaka raípe»). Of the 47 slow takes, 23 are heard worse than their normal takes, 17 as well and 7 better; in
CER the 46 Guarani ones score 14.7 % and 5.9 % against 12.5 % and 4.4 % for the normal takes of the same lines. The 23
are in `left-out/`. They take 1.15 to 1.34 times as long as their normal takes in what is said (median 1.20): 37 at
a rate of 0.8, 9 at 0.74, 1 at 0.68. A listening lesson has a slower version only when every one of its slow lines
stays, which leaves one of the twelve, unit 2 day 1 («Amba'apo.», «Remba'apo.», «Omba'apo.»: the three replies are
heard better slow). «What must stay without audio» says what the screen does for the other eleven. On 17 November two
lines of listening lessons were said again with another seed («The ear's test on what ships»), and their slow takes
with them, as a slow take must be: «Mboýpa ovale ko kesu?», whose slow take is heard worse again and stays out, and
«Héẽ. Ha amo kavaju ituicha.», whose slow take is now heard as well as the line and is back in the folder. So 22 of
the 47 are heard worse, 18 as well and 7 better (14.9 % and 6.6 % against 12.5 % and 4.9 % for the normal takes of the
same 46 Guarani lines); each of the 47 has the seed of its normal take, and no lesson gained or lost a slower version.

**Takes and seeds.** Each clip's first seed is the CRC-32 of its key. With `--verify` a clip that is not heard as
written is said again, up to three takes in all (for a line that opens with p, t, k or j: the other cut with the same
seed, then the next seed), and the best take is kept; a take heard as the other word of its sound pair counts as the
worst. Every take that was heard is in `tts-report.json`, and the seed and the cut of the one that was kept are in
`takes.json`, also for a clip that a later run finds in the folder and does not say again. `--takes` says the same takes
again without the recognisers: 131 clips of the final folder made again that way (every slow take, 26 run-in takes, the
man's lines with their own pitch) came out the same files, byte for byte. On another machine, or with another thread
count, the samples differ («How to make the clips again»). The same held on 10 November: the 45 clips of the run came
out the same files in three runs that day (a trial of the names check and two runs here), and 13 clips of
`sound/A1/voz` said again from its `takes.json` (words, run-in words, the man's lines, slow takes, the narrator, the
Spanish number, the two lines with their own seeds) were the same FLAC files, byte for byte. And six days later, on 16
November, after the machine had been restarted: the same 13 keys said again from `takes.json` were the same files once
more, and the ten words of the nasal pairs came out the same files in two runs.

**A take belongs to a text, not to a key.** When the content changes, a row can move without its text changing (a line
more in a dialogue, an example renumbered). A clip of the folder whose own row is silent now, is gone, or says another
text passes to the row that says its text with its voice today; nothing is said again for it, and the report keeps
what the recognisers heard of it. `--changed` then says only the rows that still lack a take. Tried on a copy of the
folder (10 November, and again on 16 November): a key renamed, two rows that swap their texts and a row taken away
gave three clips that passed, none said, one clip whose key was gone (it is named, and `--prune` deletes it), and no
model loaded.

**A clip that a person frees comes back as it is.** Every recording that stays silent waits as a clip in the folder's
`left-out/`. When its row is silent no longer (its entry is gone from `sound/silent.json`, or "keep" names it there),
the tool moves that very file back into the folder, with the take the report has of it, and does not say the line
again: it is the clip the person heard, and on another machine the line said again would be another clip. This needs
neither the voice nor the recognisers. A rule comes before the ear, and "keep" overrides the ear only. So a clip that
`--verify` left out by itself (a slow take, a short clip) needs "keep" alone; a clip that a rule names needs its entry
taken out, and is then put to the ear's test from what the recognisers heard of it when it was made (the report): a
line of a dialogue comes back, and a clip of one or two words that both heard with wrong letters stays out, the run
saying so, until "keep" names it too. The other word of a pair comes back with its partner. Tried on copies of the
folder, 16 November: «Ha'e Argentina-gua.» taken out of
"keys" brought the line and its slow take back, the very files, and put the listening lesson of unit 1 day 3 together
again; named once more, both went back to `left-out/` and the folder was byte for byte what it had been. "keep" with a
slow take, a pair word and the one slow line that kept unit 3 day 1 without its slower version brought the three back,
and that slower version was put together. *Héẽ*, the scene word, taken out of "keys" stayed out by ear («he», «hé»)
with the advice to name it under "keep", and came back once it was. *mbo'y* and *mboy* taken out of "keys" stayed out
the same way («mbohy» from both), with the other word of each pair. *ñúme* taken out of "texts" and named under
"keep" came back with *ñu*, the other word of its pair. No model was loaded in any of these, and each took a third of
a second. In a run that also had one changed text to say, the freed clips came back while the recognisers heard the
new clip only.

## The voices

The Guarani model is one man: median pitch 143 Hz on single words and 150 Hz on sentences (104 to 181 Hz between the
10th and the 90th percentile of the voiced frames); the Spanish model 138 Hz.

| Voice of the manifest | What it is | Median pitch |
|---|---|---|
| F, «mujer, voz principal» | the Guarani model as it is; in a dialogue with both voices, moved up by at most 2 semitones | 139 Hz on words cut after a pause, 105 Hz on words run in, 151 Hz on lines |
| M, «hombre» | the same, 2 to 3 semitones lower (ffmpeg's rubberband, formants held) | 128 Hz on lines |
| N, «narrador» | the Spanish model as it is | 138 Hz |

**F is not a woman's voice.** That is what the measurements leave. The same 73 words and 19 sentences, shifted with
rubberband ("moved": the formants move with the pitch, a smaller or a larger speaker; "held": rubberband is asked to
hold them):

| Shift | Words: independent, large | Sentences: independent, large |
|---|---|---|
| none | 16.8 %, 13.9 % | 15.4 %, 6.4 % |
| +3 semitones, moved | 19.9 %, 22.4 % | 15.8 %, 7.0 % |
| +3, held | 22.7 %, 31.2 % | 17.7 %, 6.4 % |
| +2, moved | 19.6 %, 21.6 % | 14.6 %, 7.2 % |
| +2, held | 20.2 %, 22.4 % | 15.0 %, 6.8 % |
| −2, moved | | 16.8 %, 6.8 % |
| −2, held (M) | | 15.8 %, 6.6 % |
| −3, moved | | 20.7 %, 7.6 % |
| −3, held | | 19.7 %, 7.0 % |

Any shift upward costs single words 3 to 8 points (the verification, on 90 words: none 12.0 % and 11.6 %; +3 held 18.6 %
and 19.5 %; +3 moved 15.1 % and 16.0 %): with the formants moved up, u comes back as o and y as e (*yvytu* → «yvyto»,
*ku'a* → «ko'a»). F says every word and every pair of the course, so no word of F is shifted. Sentences bear 2 semitones
either way, and 3 down less well. "Formants held" is half true: with M's shift the pitch falls by 1.7 semitones (1.5 to
2.4) and the spectral envelope still by 0.9, about half (the verification, six sentences). Nothing sounds like a sped-up
tape: no word is shifted upward, and no line by more than 2 semitones.

**Two speakers in a dialogue.** A fixed shift does not make two speakers. The model's own pitch wanders from line to
line: in the verification's run the woman's lines had medians from 113 to 178 Hz and the man's, already shifted, from 98
to 168 Hz, so in the 28 dialogues the app plays with both speakers the man's line was *higher* than the woman's line
next to it in 6 of 41 neighbouring pairs and less than a semitone lower in 4 more: one exchange in four did not sound
like two people. So a line of three words or more in a dialogue that has both voices is now placed: its median pitch is
measured and the line is moved towards its voice's own pitch, F towards 150 Hz by 0 to 2 semitones upward, M towards 126
Hz by 2 to 3 semitones downward; shorter lines keep the fixed shift (0 and −2), because a shift upward costs short lines
most. In the fix round's run 11 of the woman's lines were moved up (6 of them by the full 2 semitones) and 14 of the
man's 43 down by more than 2 (8 of them by the full 3). In the dialogues the woman's lines then have medians from 123 to
198 Hz (median 154), the man's from 98 to 160 Hz (median 132), and in the 47 neighbouring pairs of a woman's and a man's
line the woman's is 2.7 semitones higher (median): the man's is the higher one in 4 pairs, less than a semitone lower in
3 more, 2 semitones or more lower in 31. Counted the same way on the clips of the verification's run, with the fixed
shift (this count finds 44 pairs there, the verification's own found 41): higher in 6, less than a semitone lower in 5,
2 semitones or more lower in 25. So, by this count, one exchange in seven still does not sound like two people; it was
one in four (another tracker counts more: the end of this section). The
seven that remain are lines of two words, which are not placed, a line the Spanish voice says, and lines the model says
very high: its questions with -pa («Mávapa ko mitã?» at 190 Hz) would need more than 3 semitones. Moving a line up costs
nothing that shows: the 9 lines moved up that the verification's run also has, unmoved, score 16.7 % and 4.7 % here and
16.3 % and 4.7 % there. They are hard lines either way (a name, «ha'e che sy»). A line the Spanish voice says for F or M
is not shifted. A woman's voice, and a second speaker that is more than a pitch apart, need another model, or a person.

After the run of 10 November (the renamed lines said again, three listening items silent): 30 clips are put together
with both voices, with 46 neighbouring pairs of a woman's and a man's line. The woman's line is 2.5 semitones higher
at the median; the man's is the higher one in 3 pairs («Mávapa ou?» before «Ou che sy.», «Mba'épa rejapo ko pyhare?»
before «Aha che jarýi rógape.», «Mba'éichapa, Juan?» before «Iporã, ha nde?»), less than a semitone lower in 4, and 2
semitones or more lower in 29. 13 of the woman's lines are moved up (6 by the full 2 semitones) and 14 of the man's 41
down by more than 2 (8 by the full 3). The woman's lines in those clips have medians from 123 to 198 Hz (median 154),
the man's from 98 to 160 Hz (median 131).

**The count hangs on the tracker, so it is a range.** Every count above is by the tool's own measure of pitch
(`median_pitch` in `make-tts.py`: the autocorrelation of 40 ms frames, 65 to 350 Hz, a frame voiced when its
normalised peak reaches 0.45, the median over the take). The review of 16 November counted with a tracker of its own
(40 ms frames under a Hann window, 70 to 320 Hz, voiced at 0.5, the peak refined by a parabola) on the lines cut from
the decoded MP3s, and found the man's line the higher one in 6 pairs and less than a semitone lower in 5, where this
file said 3 and 4: one exchange in four, not one in seven. Both were run on the files of 17 November: 29 clips are
put together with both voices (one dialogue of Teach is silent since that day), with 45 neighbouring pairs of a
woman's and a man's line.

| Tracker | The woman's line higher by (median) | The man's the higher one | Less than a semitone lower | 2 semitones or more lower |
|---|---|---|---|---|
| the tool's, on the takes | 2.5 semitones | 3 pairs | 4 | 30 |
| the review's, on the lines cut from the MP3s | 2.5 semitones | 6 | 5 | 27 |

The two agree on the median, and every one of the tool's 7 pairs is among the review's 11. The 4 the review adds are
«Ha'e che angirũ.» and «Ha'e che ru, héra Santiago.», each after the man's «Mávapa ha'e?» (the tool has the woman 2.0
and 2.3 semitones higher there, the review's tracker the man 1.7 and 0.9 higher), «Iporã. Oĩpa chipa?» after
«Mba'éichapa? Mba'épa reipota?» and «Héẽ, og̃uahẽ ko'ág̃a.» after «Og̃uahẽ piko Ana?». Over the 45 pairs the two
trackers differ by 0.6 semitone at the median and by up to 4.1: a short or creaky line has few voiced frames, and a
few frames decide its median. So the man's line is not the lower one, or is so by less than a semitone, in 7 to 11
exchanges of 45, between one in six and one in four; which tracker is nearer to an ear is for a listener (item 14 of
the list). In those 29 clips the woman's lines have medians from 125 to 198 Hz (median 154) and the man's from 98 to
160 Hz (median 132), by the tool's measure; 13 of the woman's lines are moved up and 14 of the man's 39 down by more
than 2 semitones.

## What was measured, and with what

Three rounds, all on 2026-11-10: the **first round** probed the voice and wrote the tool; an independent
**verification** ran the tool on the whole manifest, measured each sound again with code of its own, confirmed part of
the first round and refuted part (the puso, the r, the slow takes, the list of what must stay silent); the **fix round**
changed the tool and this file accordingly and measured what the changes touch. Where a number below was refuted, it is
gone; where two rounds measured the same thing, the larger sample is given.

**The two recognisers.**

- `ivangtorre/wav2vec2-xlsr-300m-guarani`, "independent" above: XLS-R 300M fine-tuned on the 293 Guarani training clips
  of the AmericasNLP 2022 speech set (its card: short read sentences). Nothing of MMS is in it. On the 93 held-out clips
  of real speech of the same set it scores **11.0 % CER** here (9.0 % on the first 40 of them; 0.2 % on clips it was
  trained on; its card gives 17.6 % on the competition's test set). It writes capitals and full stops, has g̃ among its
  letters, is weak on single words, and has habits of its own: *tupa* is «supa» or «kupa», *porã* «morã», *po* «yo».
- `facebook/mms-1b-all` with the Guarani adapter, "large" above: from the same project and the same kind of data as the
  voice, so it flatters it. **6.5 % CER** on the same 93 clips of real speech. It prefers a word of its Bible to what
  was said: *kesu* is «Jesús» or «Jesú» in every take. The narrator's Spanish is judged by its Spanish adapter alone.

Both sides of every comparison are put in lower case, without punctuation, with one apostrophe, in NFC, and a g̃ that
was heard is written the way the voice is given it (ag̃aite → agãite), so that it counts as right. Before the fix round
the tilde of a heard g̃ was dropped, and for *ag̃aite* the tool kept the one take both recognisers heard as «agaite»
over the take heard «ag̃aite». The CER is the edit distance over the length of the text that was said (the respelled
text: «huan», not «Juan»). "With the right letters" means the same letters once acutes, tildes and spaces are set aside:
the recognisers leave marks out of real speech too (the independent one writes the ó of real speech in 42 % of its 12
places and the õ in 46 % of 13; the large one in 92 % and 62 %), so a missing mark is not a wrong letter. The puso is a
letter, and a c that is not ch counts as the k the recognisers sometimes write the Spanish way («jacaru», «carai»).

What the recognisers do with real speech bounds what they can say about the voice: they write the puso in 83 % and 89 %
of its 63 places in the 93 real clips, the h in 93 % and 98 % of 99, the r in 96 % and 98 % of 132, the ã in 82 % and 96
% of 28. And a clip of one or two words of real speech is heard with wrong letters by both of them in 2 cases of 20: the
rule that leaves short clips out by ear (below) would silence one real clip in ten.

**The whole manifest, with the tool as it is now** (the fix round; the manifest of 2026-11-10, 12:33: 736 rows, 502
recordings, 492 of them said, the rest silent by rule; `--verify`, both recognisers):

| Clips | Independent: CER, with the right letters | Large |
|---|---|---|
| **The clips that stay, the take that was kept (best of up to three)** | | |
| 179 single words | 6.0 %, 149 | 4.6 %, 168 |
| 215 lines of two words or more | 10.2 %, 129 | 3.6 %, 168 |
| of them the woman's 179 | 9.8 %, 118 | 3.2 %, 145 |
| of them the man's 36, pitch 2 to 3 semitones down | 12.3 %, 11 | 5.5 %, 23 |
| 46 slow takes | 18.1 %, 9 | 8.3 %, 22 |
| 28 Spanish lines (the narrator, «Diez mil.», «Treinta.»), Spanish adapter | | 0.9 %, 23 |
| **Everything the run said, the first take alone** | | |
| 200 single words | 10.8 %, 130 | 9.7 %, 155 |
| 219 lines of two words or more | 13.9 %, 98 | 6.0 %, 137 |
| of them the woman's 183 | 13.7 %, 89 | 5.7 %, 117 |
| of them the man's 36 | 14.6 %, 9 | 7.6 %, 20 |
| 28 Spanish lines | | 2.9 %, 15 |
| **Everything the run said, the take that was kept** | | |
| 200 single words | 7.8 %, 154 | 6.1 %, 174 |
| 219 lines of two words or more | 10.3 %, 130 | 3.7 %, 169 |
| for comparison: 93 clips of real Guarani speech | 11.0 % | 6.5 % |

Of the clips said at the normal rate, 255 kept their first take, 127 the second and 64 the third. 56 of the 72 short
lines that open with p, t, k or j kept a run-in take, and 10 longer lines kept one as their second take. The first take
alone scores better on words than before the fixes (10.8 % and 9.7 %, against 12.0 % and 11.4 %): that is the run-in
cut. The man's lines score 2.5 and 2.3 points worse than the woman's when the best take is kept, and 0.9 and 1.9 points
worse when one take is: other lines, and a pitch moved 2 to 3 semitones down; the two cannot be told apart here (the
same 15 sentences said by both voices in the first round: 15.3 % and 6.5 % in F, 17.4 % and 7.0 % in M). The clips that
stay score better than everything that was said because the worst 24 were taken out: that is what the list of silent
rows is for, and why the figures to quote for the voice itself are those of the first take.

**The same, before the fixes** (the verification, on the manifest of 03:51 and its 487 clips): one take a clip, 212
single words 12.0 % and 11.4 %, 258 lines 14.9 % and 6.6 %, the man's lines 14.2 % and 7.6 %, 27 Spanish lines 2.7 %;
best of three takes, words 8.5 % and 6.7 %, lines 11.1 % and 4.2 %, Spanish 0.8 %. The verification's own CER function
gave the same figures as the tool's on every set.

**The first round's probe**: 189 clips made by the tool's own code as it then was: the 145 words of every sound pair of
A1 units 1 to 4 and of Hablar (64 pairs) and of each taught sound, 15 sentences of the lessons, 4 slow takes, and the
narrator's 25 Spanish lines. 145 single words: 17.2 % and 13.4 % (another seed: 15.8 % and 14.4 %); 15 sentences in F:
15.3 % and 6.5 %, in M: 17.4 % and 7.0 %; 25 narrator lines, Spanish adapter: 2.3 %.

**Distances.** For every pair of the probe the two words were compared by MFCC with DTW (13 coefficients, 25 ms windows,
the mean taken out), against the distance between two seeds of the same word:

| What sets the pair apart | Pairs | Distance against the seed distance: median (lowest) |
|---|---|---|
| a nasal vowel | 6 | ×1.57 (×1.33, téra / térã) |
| the puso | 4 | ×1.80 (×1.51, mbo'y / mboy) |
| y against i | 2 | ×2.08 (×1.78) |
| y against u | 4 | ×2.56 (×2.30) |
| two different words, to compare | 48 | ×3.17 (×2.15) |

A distance says that two clips differ, not that they differ in the right way: the nasal pairs differ by pitch, and mbo'y
/ mboy, the closest puso pair, is the one the recognisers do not tell apart (below).

**The acoustic measures**: on the stretch of each letter, from the model's alignment, five to thirty seeds a word, no
recogniser: the level and its falls, the share of the stretch that is voiced, the noise above 2.5 kHz, formants,
harmonics (A1−P0 for nasality), the number of closures (taps against trills), lengths. The first round made about 2,500
utterances; the verification measured again with code of its own. Their numbers are under each sound below.

**Pictures**: waveform and spectrogram, with the letters where the model puts them: 24 pairs in the first round, the
verification's own of each sound it doubted (ita / yta, yvytu / yvyty, pyta / pytã, tupa / Tupã, pytu / pytũ, mbo'y,
ka'i, ru, jagua, kesu, a slow take), and in the fix round the two cuts of *kesu*, *kamby*, *jagua* and *pira* and, from
the final folder, *ka'i*, *kái*, *mbo'y* and *mboy*, the kept takes of *kesu*, *kamby*, *jagua* and *aju*, and a line
with its slow take. What they show is said under each sound.

**The whole path, in the fix round.** `make-sound.mjs` was run on that round's folder with `--out` in the scratch
folder: 7 sound files and the index; 518 clips made (468 recordings, 49 dialogues and listening items put together with
their cues, the test tone) and every other key of the folder's manifest registered as a clip that shares one (671 keys
in all); every voice clip marked `synthetic`, with the model and CC BY-NC 4.0 in each file's header and in the index;
5.2 MB of MP3. Taken back out of the files: 24 kHz mono; 90 ms of air before the first sound (75 to 130) and 160 ms
after; loudness median −17.2 LUFS, from −24.2 to −16.2, the shortest words the quietest (*py*, *po*, *jaha* at −22 to
−24); 9 clips over −1.5 dBTP, the highest −0.7; the stated `ms` 61 ms longer than the decoded clip. Those three flaws
of `make-sound.mjs` are mended since («The sound files», below). The verification measured the MP3s against the WAVs on
its own run: 34 Guarani clips taken back out of the files scored 12.4 % and 4.9 %, and 12.2 % and 4.9 % as WAVs.

**The run of 10 November, after the names.** The course data and the clip list were made again from the renamed content
(736 rows, 502 recordings, as before) and the dry run stopped on nothing. On the verified folder,
`make-tts.py --verify --changed` said the 45 clips whose text or respelling had changed and kept the other 423: 5
minutes 36 seconds on four shared CPUs, both recognisers hearing each take (7 minutes 19 the second time, with the
machine busier; both runs gave the same 45 files). Two lines were then said with further seeds («The names of the
people»), every slow take was heard again and ruled on («How a clip is said»), and three lines of listening items
were named in `sound/silent.json` («What must stay without audio»). The folder was moved to `sound/A1/voz` as FLAC:
493 clips, 19.88 MB of WAV, are 11.58 MB (440 clips of 10.21 MB in the folder, 53 of 1.37 MB in `left-out/`), and
ffmpeg decodes each of the 493 to the very samples of the WAV it came from.

| The 440 clips of `sound/A1/voz` | Independent: CER, with the right letters | Large |
|---|---|---|
| **The take that was kept (best of up to three)** | | |
| 179 single words | 6.0 %, 149 | 4.6 %, 168 |
| 212 lines of two words or more | 9.4 %, 136 | 3.4 %, 172 |
| of them the woman's 178 | 9.0 %, 123 | 3.0 %, 149 |
| of them the man's 34, pitch 2 to 3 semitones down | 11.6 %, 13 | 4.9 %, 23 |
| 21 slow takes | 8.1 %, 13 | 3.2 %, 17 |
| 28 Spanish lines (25 of the narrator; «Diez mil.», its slow take and «Treinta.»), Spanish adapter | | 0.9 %, 23 |
| **The same clips, the first take alone** | | |
| 179 single words | 8.8 %, 126 | 8.4 %, 149 |
| 212 lines of two words or more | 12.8 %, 105 | 5.4 %, 142 |

Of the 418 clips said at the normal rate, 245 kept their first take, 114 the second and 59 the third (the two lines
that were given further seeds count among the first takes: each is the first take of the seed it was given); 64 kept
a run-in take, 54 of them lines of one or two words and 10 longer lines (until 17 November this sentence said 65: it
counted the one slow take that is run in, and the sentence is about the normal rate). Median pitch: F words cut after a pause 138 Hz (122 words), F words run in
105 Hz (50), F lines 151 Hz, M lines 128 Hz, the narrator 138 Hz. In the fix round's folder the lines scored 10.2 % and
3.6 % (215 lines); since then the renamed lines were said again and three lines that both recognisers heard with wrong
letters went out.

**16 November.** The run above was cut off while its tools were still being changed; what it had written was checked
six days later, from the files. The clip list made again from the course is the list of 10 November (736 rows, 502
recordings: F 410, M 67, N 25), and the dry run of the whole list stops on nothing. Each of the 493 FLAC files decodes
to the very samples of the WAV it was made from; against the folder as it stood before the run of 10 November, 448
clips have the samples they had and 45 have others: the 45 that run said, and no other. The table above, the counts of
«What must stay without audio» and every figure of «The sound files» were computed again from `sound/A1/voz` and from
`project/gn-sound-*.js`; where a figure of 10 November had been measured on the folder before its last changes, it is
corrected below. Then three things were done.

- *The words of the nasal pairs were said, for a listener.* The rule that keeps them silent is older than the first
  whole run, so ten of them had never been said and the first thing a native speaker is asked to hear was not in the
  folder. They were said once, with `--verify`: *pytu*, *pytũ*, *oke*, *tupa*, *Tupã*, *pyta*, *pytã*, *porã*, *póra*,
  *térã* (one minute for the ten, both recognisers hearing each take). What came back is what the measures above
  say: *pytũ* as «pytũ» and «petũ», *pytã* as «pyta» and «pytá», *Tupã* as «kupã» and «tupa», *térã* as «tera» and
  «térã», *porã* as «morã» and «porã». Under the rule they went to `left-out/` at once: no screen plays them, and the
  440 clips of the folder did not change. `left-out/` holds 63 clips now (1.44 MB), the folder with it 503 clips and
  624.9 seconds: 20.02 MB as WAV, 11.65 MB as FLAC. Every recording that stays silent has its clip there, but *okẽ* as
  a pair word, which waits under the scene word's key (`a1u01d5.w.oke`).
- *A clip that a person frees comes back from `left-out/`* («How a clip is said»). Before, taking an entry out of
  `sound/silent.json` had the line said again, and "keep" did nothing in a run with `--changed`.
- *A rebuild with no clip changed changes no file* («The sound files», below, and «How to make the clips again»).

**17 November: after a review of the voice in the app.** An independent review (16 November) took every clip back out
of the sound files, decoded it, cut the dialogues at their cues, had both recognisers hear every line and measured
loudness, peaks and pitch with code of its own; its scripts and data are in `…/scratchpad/voice-ship/review`. It
confirmed the counts, sizes and scores above and found six things on the clips' side. Each was mended the next day,
and each is told in its place:

- the ear's test judged the take, never the clip the app plays, and four short clips whose takes had passed were heard
  with wrong letters in their MP3s: «The ear's test on what ships», next;
- a Teach example said, by both recognisers, the form its own lesson calls wrong («nde ramói» for *ne ramói*), and
  lines held, with the same flaw, a word that is silent when it stands alone: the same section, and «What must stay
  without audio», 5;
- two clips were 4.7 LU quieter than the rest and lines of one dialogue up to 4 LU apart: «The sound files», *the
  levels*, and «How a clip is said», *a word run in can trail off*;
- the list in the takes' folder stated the licence of the studio's recordings, CC BY 4.0, for clips that are CC BY-NC
  4.0: `make-tts.py` now writes the clips' own licence into the copy it makes (`sound/A1/voz/manifest.json`), and the
  list it copies from (`sound/A1/manifest.json`) says that its sentence is about the recordings a person makes in the
  studio;
- two figures of this file did not come out of the files as stated (the run-in takes, and how often the man's line is
  not the lower one): both are corrected where they stand;
- and, found while the lessons' examples were being read for the second point: two Teach examples of unit 2 day 5
  had clips of their last word alone. «Vicente ndoúi ko ka'aru: oky.» and «Che ru nosẽi ógagui: oky.» have a colon,
  and `tools/sound-list.mjs` read everything before it as the name of a speaker, so the clip said «oky» (the first
  one in the man's voice) under the whole sentence on the screen. A speaker is now a name or a role of one word, or
  two with a title; the list has the two sentences whole (502 recordings as before: F 411, M 66, N 25), and both were
  said on 17 November.

The folder as that day left it, measured as the table of 10 November was (`tts-report.json`: what `--verify` heard
of each take):

| The 438 clips of `sound/A1/voz` | Independent: CER, with the right letters | Large |
|---|---|---|
| **The take that was kept** | | |
| 177 single words | 6.1 %, 148 | 4.8 %, 166 |
| 211 lines of two words or more | 9.2 %, 140 | 3.5 %, 173 |
| of them the woman's 178 | 8.9 %, 127 | 3.3 %, 150 |
| of them the man's 33, pitch 2 to 3 semitones down | 11.2 %, 13 | 4.6 %, 23 |
| 22 slow takes | 8.9 %, 13 | 3.8 %, 17 |
| 28 Spanish lines (25 of the narrator; «Diez mil.», its slow take and «Treinta.»), Spanish adapter | | 0.9 %, 23 |
| **The same clips, the first take alone** | | |
| 177 single words | 8.7 %, 126 | 8.3 %, 148 |
| 211 lines of two words or more | 12.6 %, 109 | 5.5 %, 144 |

There are two single words fewer and one line fewer than on 10 November: the two «oky» became sentences, and three
lines are silent. Of the 415 clips at the normal rate, 249 have their first take, 110 the second and 56 the third (a
take that the ear's test on the MP3 kept counts as a first take, being the first take of the seed it was given); 62
are run in, 52 of them lines of one or two words, now that *tetãme* and *ko'ág̃a* are cut after a pause. Median
pitch: F words cut after a pause 139 Hz (123 words), F words run in 105 Hz (48), F lines 151 Hz, M lines 128 Hz, the
narrator 138 Hz.

**The ear's test on what ships.** `--verify` hears the take, the FLAC of the folder. The learner hears the take
trimmed, levelled, given its air and encoded as MP3 at 32 kb/s, and at the edge the two are not heard alike: over the
whole set the review found ten recordings that both recognisers heard right as takes and wrong as MP3s, and three the
other way. So since 17 November a second tool, `tools/hear-sound.py`, runs after `make-sound.mjs`. It reads the sound
files themselves, decodes every clip, cuts a clip that is put together from lines at its cues, and has both
recognisers hear every line three ways, as the review did:

- *padded*: the clip as it ships, with the 150 ms of silence the recogniser is given round a take (the hearing of
  `--verify`);
- *trimmed*: the clip without its air (cut where it rises over −45 dBFS, 10 ms kept), with the same 150 ms;
- *bare*: the clip as it ships and nothing round it, which is what the phone plays.

*The rule: two hearings of three.* A line is **heard wrong** when, in two of the three hearings or in all three, both
recognisers write letters that are not the line's (the letters as everywhere in this file: acutes, tildes and spaces
aside; the line as the voice is given it or as the course writes it, so «juan» for *huan* is the name heard right).
Why three hearings, and why two: what a recogniser writes of a short clip moves with the silence round it, and that
says nothing about the clip. In the first hearing of everything, on 17 November (the takes of 16 November through the
new levelling: 415 lines in 358 clips, 43 minutes on four shared CPUs), the independent recogniser changed its verdict
on a clip of one or two words from one hearing to another in 23 of the 201 such clips, the large one in 32. Both were
wrong together in 4 clips in the padded hearing, in 13 in the trimmed one and in 8 in the bare one, and those are not
the same clips: 184 clips are never wrong for both, 11 in one hearing only, 4 in two and 2 in all three. One hearing
alone would make the rule a rule about padding (the padded hearing passes *mitãnguéra*, which both hear as
«mitãmbuéra» without the padding; the trimmed one fails eight clips that the two do not both hear wrong as the phone
plays them); a verdict in any one hearing would stop 17 clips, on top of the one real clip in ten that the take's rule
already costs; and asking for all three would pass a clip that both hear wrong as it is played (*aju*, «Aguyje mante»
and *mitãnguéra* are right for one recogniser with the padding and wrong for both without it). Two of three follows
the clip, not the padding: it stops 6.

*What is done with it.* The rule is applied in three places, each with its reason in «What must stay without audio»,
5:

- **a short clip**: a Guarani clip of one or two words that a learner hears on its own and that is heard wrong: the
  rule `--verify` applies to the take, applied to what plays;
- **a word**: a line that holds a word the voice must not say alone (`sound/silent.json`: "texts", and "words", the
  flawed word of each clip that is silent by key), when in two hearings of three both recognisers write that very
  word with wrong letters. What they wrote in the word's place is found by lining their letters up with the line's;
  a letter put in right before or after the word may be its neighbour's and is left aside, and a puso written
  between the two vowels of *Héẽ* is the break they are said with, not a letter too many;
- **a form**: a Teach example whose point is one letter or one small word. `sound/silent.json` lists these examples
  ("forms"): for each, the line as its lesson says it must *not* be said (*nde ramói* for *ne ramói*, *tetãpe* for
  *tetãme*, *ndañe'ẽi* for *nañe'ẽi*) and the words whose stress the lesson marks with an acute. The example fails
  when, in two hearings of three, both recognisers' writing is nearer to a wrong line than to the example itself, or
  when no recogniser writes the acute.

A clip that fails is said again, by `make-tts.py`'s own code and in a copy of the folder: up to twelve seeds, the
key's own first, each take made into its MP3 by `make-sound.mjs` with every clip it is heard in, and heard the same
three ways. A take passes on three conditions. It passes `--verify`. Its MP3 fails none of the rules. And its lines are
not heard worse as a whole than those of the take it replaces, by the letters each recogniser writes in each hearing,
added up: a take can mend the word a rule looks at and spoil another, and that is no gain (the case that showed it is
told below). The search ends at the first passing take that every recogniser hears right in every place the rules
look at; otherwise the passing take with the fewest wrong hearings there is kept and, among equals, the one whose
lines are written with the fewest letters off. It replaces the old one as `--only <key> --redo --seed <n> --tries 1
--verify` writes it, with two things carried over from the take it replaces: its cut (so that *tetãme* and *ko'ág̃a*
do not come back run in) and the slow take of its line, which is said again with the new seed and judged afresh
whether it was in the folder or in `left-out/`, so that it stays the slow version of the take a listener will compare
it with; a take with which a slow take that the folder holds would be left out does not pass. If no take passes, the
clip is silenced: the tool names its key in `sound/silent.json` with what was heard and what each seed gave, the other
word of its pair with it, and the take goes to `left-out/`. One kind of line it never silences: a line of a listening
item, a lesson's, the placement's or the exam's. Silencing it takes the whole item's audio, and that is a person's
decision; until then the item plays and the line is on the listener's list. What the tool heard of every line is
kept in `sound/A1/voz/mp3-heard.json`, under the checksum of the MP3 it was heard in, so a run on files whose clips
did not change hears nothing, loads no model and writes nothing.

*What the first run found and did (17 November).* The tool first heard the takes of 16 November as the new levelling
ships them (the 415 lines above). Then the documented line was run on the folder with what had to change: the two
examples of unit 2 day 5 were said whole, *tetãme* and *ko'ág̃a* were said again cut after a pause, the sound files
were made, and the four clips whose MP3 was new were heard. That left 415 lines, 199 of them clips of one or two words
(the two «oky» are sentences now): 6 short clips heard wrong, 33 of the 382 Guarani lines in all, and 15 recordings
that failed a rule:

- six short clips: *aju*, «Aguyje mante», *mitãkuña*, *ñu*, *mitãnguéra* and *guyrakuéra* (the last four are the
  review's four);
- one form: «Mba'éichapa héra ne ramói?», heard «nde ramói» by both (the review's);
- one stress: «Mboýpa ovale ko kesu?», whose acute neither recogniser wrote in two hearings of three (the recording
  plays in a Teach example, in a dialogue of unit 4 day 5 and in the listening lesson of unit 1 day 4);
- seven lines with a word that is silent when it stands alone: «Che réra Moisés. Che Argentina-gua.», «Che amba'apo
  mbo'ehaópe.» (its acute unwritten as well), «Héẽ, chekane'õ ha chero'y.», «Che ru chokokue ha che sy ñemuhára.»,
  «Ha'e che angirũ.», «Héẽ, upéicha.» and, in the listening lesson of unit 4 day 3, «Héẽ. Ha amo kavaju ituicha.».

Each was said again with up to twelve seeds: 142 takes over the fifteen recordings. 26 of them did not pass
`--verify`; the other 116 were made into their MP3s and heard three ways, and of those 35 passed, 73 failed a rule
again and 8 were heard worse as a whole than the take they would have replaced. Twelve recordings have a new take
since:

| Key | Text | The rule it failed | Seed kept (0 is the key's own), of those tried | The independent recogniser, in its MP3 now | The large recogniser | Letters off over the six hearings, before → now |
|---|---|---|---|---|---|---|
| `a1u01d4.p2.x3` | Mboýpa ovale ko kesu? | stress | 5, of 12 | «mboypa ova léko kesu» / «mboypa ovaléko kesu» | «mboýpa ovaleko jesús» / «mboýpa ovaleko kesu» / «mboýpa ovaléko kesú» | 11 → 6, over its three clips |
| `a1u02d1.w.aju` | aju | short clip | 7, of 12 | «aju» | «adu» | 5 → 3 |
| `a1u02d3.p1.x0` | Che amba'apo mbo'ehaópe. | word, stress | 5, of 12 | «che amba'apo mboeha ópe» / «che amba'apo mbo'eha ópe» | «che amba'apo mbo'ehaópe» | 8 → 1 |
| `a1u02d5.w.aguyjemante` | Aguyje mante | short clip | 7, of 12 | «aguje mante» | «aguyje mante» / «aguy je mante» | 5 → 3 |
| `a1u03d3.p2.x1.l1` | Ha'e che angirũ. | word | 4, of 5 | «ha'éche angiru» | «ha'ẽ che angiru» | 11 → 0 |
| `a1u03d3.w.mitakuna` | mitãkuña | short clip | 2, of 3 | «mitakuña» / «mitaku ña» | «mitakuña» | 5 → 0 |
| `a1u03d3.s1a` | ñu | short clip | 0, of 12 | «ju» / «u» | «ñu» | 6 → 3 |
| `a1u03d4.p2.x1.l2` | Héẽ, upéicha. | word | 6, of 7 | «he'ẽ upéicha» / «heẽ upéicha» | «he'ẽ upéicha» | 6 → 5 |
| `a1u04d1.p2.x3` | Mba'éichapa héra ne ramói? | form | 1, of 2 | «mba'eichapa héra ne ramoi» | «mba'eichapa héra ne ramói» | 7 → 0 |
| `a1u04d2.w.mitanguera` | mitãnguéra | short clip | 4, of 5 | «mitanguéra» | «mitã nguéra» | 14 → 0 |
| `a1u04d2.w.guyrakuera` | guyrakuéra | short clip | 3, of 12 | «muyrakuéra» | «guyra kuéra» | 9 → 3 |
| `a1u04d3.r1.l2` | Héẽ. Ha amo kavaju ituicha. | word | 6, of 12 | «he a amokavaju ituicha» / «he a amo kavaju ituicha» | «he'e ha amo kavaju ituicha» / «he ha amo kavaju ituicha» | 10 → 9 |

Each of the twelve passes, which is not the same as being heard right by both. In *aju* the large recogniser still
writes «adu» in every hearing, in «Aguyje mante» the independent one «aguje», in *ñu* «ju», in *guyrakuéra*
«muyrakuéra»: one recogniser hears the clip right in every hearing, the other in none, and the rule asks for no more
than the take's rule does. The puso both write in «he'ẽ upéicha» counts as a letter for the line and as the break
between the two vowels for the word, so that line passes the rule about *Héẽ* and still stands in the listener's
table; and in «Héẽ. Ha amo kavaju ituicha.» the large recogniser writes two vowels in two hearings of three while the
independent one writes «he a» in all. The twelve are on the listener's list for that (item 19).

Three recordings had no take that passed, and are silent since: «Che réra Moisés. Che Argentina-gua.»
(`a1u01d3.p2.x1`: «a hentiragua», «ahentinagua», the r of *Argentina* in none of twelve seeds), «Héẽ, chekane'õ ha chero'y.»
(`a1u03d1.p1.x3.l1`, and with it its dialogue, `a1u03d1.p1.x3`: one short vowel for both in twelve of twelve, and
«rohy» for *ro'y* in three of them) and «Che ru chokokue ha che sy ñemuhára.» (`a1u03d3.p1.x3`). The last is the case
behind the third condition. Eleven of its twelve seeds had «ñemohára» from both recognisers. The twelfth was the
first with *ñemuhára*, and both then wrote «chukokue» for *chokokue* in every hearing (as in eight of the twelve
seeds): 14 letters off over the six hearings, where the take it would have replaced has 9. The tool as it was first
written kept that take; a take that mends one word and spoils another is no longer kept, and the example is silent.
«What must stay without audio», 5, has what each of the three costs.

The sound files were then made again (four of the seven changed), the 29 lines whose MP3 was new were heard, and
nothing failed: 411 lines in 355 clips, none of the 199 clips of one or two words heard wrong, 21 of the 374 Guarani
lines at the normal rate heard wrong (8 examples of Teach, 6 lines of its dialogues and 7 lines of listening items;
20 recordings), none of the 4 slow lines, and 4 of the 33 Spanish lines by the one recogniser that judges them. The
whole run took 40 minutes on four shared CPUs (2,426 s: 100 s for the four clips that were said, 308 s for the sound
files, and 34 minutes for the ear's test with its 142 takes, the files made a second time and the 29 lines heard).
Run again at once with nothing changed, the whole line said nothing, heard nothing, loaded no model and left each of
the 576 files of `sound/` and `project/` as it was, by checksum and by `git status`: 6 minutes 10 seconds, all but
two seconds of it `make-sound.mjs` encoding every clip to find that nothing had changed (the ear's test took 1.4 s).

*What the MP3 does to a take, over the whole set.* For the 378 Guarani lines that play (4 of them slow), what
`--verify` heard of the take against the padded hearing of its MP3, which is the same hearing of the clip that ships:
the independent recogniser 8.2 % CER on the takes and 8.7 % on the MP3s, with the right letters in 285 and in 276;
the large one 3.9 % and 4.2 %, 332 and 328. 19 lines are wrong for both as takes and 25 as MP3s in that one hearing
(8 only as MP3s, 2 only as takes); by the rule of two hearings in three, 21. The MP3 costs half a point of CER, and
it moves single clips across the line in both directions, which is why the clip is heard and not only the take.


**The sound files.** `node tools/make-sound.mjs sound/A1/voz --manifest sound/A1/voz/manifest.json --kind synthetic`
wrote the app's files into `project/`. Three flaws the verification had measured in that tool were mended first, with
one waste the run of 10 November found and one that showed six days later; the figures in these five points are of 16
November (the files as they were that day, and the same 440 takes put through the tool as it was before, commit
206ec5f, both decoded with ffmpeg). A sixth point, the levels, was mended on 17 November, after the review: it is the
last of the list, and the table of the files and every figure after it are of the files as that change left them.

- *The loudness of a short word.* The tool measured with ffmpeg's `loudnorm`, which gives no loudness for a clip under
  about half a second; the mean level stood in, and those clips came out 4.7 LU under the rest (−22.3 LUFS at the
  median, the quietest −23.2, where the clips of half a second and more were at −17.6). The measure is now that of
  BS.1770 (K weighting, blocks of 400 ms, the two gates) taken on the trimmed take as if it played in a loop until
  three seconds had passed, which is the standard itself for a take of three seconds or more. On the 440 takes it puts
  a take 3.1 to 3.4 LU under its loud tenths of a second whether the take lasts 0.3 s or 5 s, and for the 38 takes of
  2.5 s or more it differs from the standard by 0.0 LU at the median, 0.24 at most. The 13 clips under half a second
  rose by 3.7 LU at the median (*po* from −22.2 to −18.5 LUFS, *kái* from −22.3 to −17.7, *ñu* from −22.5 to −17.8, as
  decoded from the files); the others moved by 0.01 LU at the median, 1.3 at most.
- *The peak ceiling.* The ceiling was kept on the take; the MP3, at 32 kb/s, peaks up to a decibel higher. The true
  peak is now taken on each clip's MP3 decoded again (four times oversampled), and a clip that passes −1.5 dBTP is
  encoded again until it holds. On 16 November the highest of the 358 clips decoded from the files was at −1.51 dBTP;
  made from the same takes with the tool as it was, 9 clips passed the ceiling, the highest at −0.74.
- *The length.* `ms` was the MP3 file's own duration, which counts the encoder's padding: 61 ms too long at the median
  (48 to 70). It is the length of the decoded clip now.
- *What no screen asks for.* The tool gave a clip to every recording: 543 clips in files of 5.49 MB, a third of it
  (1.32 of 4.08 MB of MP3) under keys no screen can ask for: the lines of dialogues and listening items, which are
  heard inside the clip put together from them, and the word of each sound pair that does not play. A recording now
  makes a clip of its own only when a key the screens ask for holds it: 293 of the 440 do, 130 lines and 17 unplayed
  pair words do not.
- *The day in the first line.* Every file says in its first line when it was made, and the app stores a sound file on
  the phone under a hash of its content. Run on 16 November with no clip changed, the tool wrote all seven files anew:
  the same clips, byte for byte, under a new date and so under seven new hashes, 3.71 MB for every phone to fetch
  again. A file whose clips are what they were is now left as it is, its date too. The same run now leaves all seven
  alone; with one take replaced, the file of that take's unit is written anew and the others are not (`check/sound-test.js`
  has both cases). The clip list keeps its date the same way while nothing in it changes (`tools/sound-list.mjs`).
- *The levels (17 November).* The review measured the clips as they ship, with code of its own: the measure of
  BS.1770 with its gates on each decoded MP3 without its air, in a loop. It found the 322 clips of one recording at
  −16.7 LUFS at the median, 272 of them within 2 LU of −16, *ko'ág̃a* and *tetãme* at −21.5 and −21.4, and lines of one
  dialogue up to 4 LU apart. Three causes, each measured.
  *The voice's peaks.* A take's highest peak stands 14.9 dB over its loudness at the median (12.9 to 17.2 between the
  5th and the 95th percentile of the 440 takes, 19.6 for the two words). One gain brings a take to −16 LUFS under a
  ceiling of −1.5 dBFS only if that distance is 14.5 dB or less, so 279 takes stopped at the ceiling, 68 of them more
  than 2 LU under the target, and the man's clips and lines, whose shifted pitch leaves them peakier, sat 1.1 LU
  under the woman's (−17.7 against −16.7 LUFS at the median, by the review's measure).
  *The encoder.* LAME turns everything it is given down by a fixed factor at this bit rate, 0.95: a second of a plain
  note, encoded as the clips are and decoded again, comes back 0.45 dB lower in level and in peak. A take brought to
  −16.0 LUFS shipped at −16.45, which is why the loudest clip of all was at −15.9 and the median clip at −16.7.
  *The run-in cut.* The two quietest words are the end of the carrier's phrase and trail off («How a clip is said»).
  What was changed in `tools/make-sound.mjs`. (a) The encoder's step is measured at the start of every run, and the
  gain and the ceiling allow for it: the target is the level of the clip as it ships. (b) Where the gain would carry a
  take's highest peaks over the ceiling, those peaks are turned down for a moment by a limiter that is slower than the
  voice's own pulses: its curve is the lowest gain any sample needs within 10 ms to either side, smoothed over the same
  width, so it starts down 20 ms before a peak, is at its lowest on the peak and is back 20 ms after; the gain is
  then raised by the little loudness the peaks took with them, and the two steps repeat until the take is at the
  target or the curve would go deeper than 3 dB. Three decibels trim a peak; they do not weigh the syllables of a word
  anew. A take that would need more stays under the target by the rest. (c) The peak of a clip is still taken on its
  MP3 decoded again, where it stands up to 1.6 dB over the WAV's; a recording that passes the ceiling there is no
  longer lowered as a whole but limited to a ceiling that much lower, which comes on top of the 3 dB, and in a clip
  put together from lines the line that holds the peak is fitted, not the whole dialogue lowered for its sake. (d) The
  loudness is measured on the sounding part of a take, without the quiet a trim keeps at its ends. (e) The run ends
  with the loudness of every clip, and of every line of a put-together clip, as decoded from its MP3, and names
  whatever lands more than 2 LU from the target; `check/sound-test.js` has a take with one loud moment that must
  reach the target and a take that peaks all along that must be named.
  Two things were tried and dropped. A phase rotator, which lowers peaks without touching any level, gives this
  voice too little: the best of 45 settings (four all-pass stages at 500 Hz) lowered the peaks by 1.0 dB at the mean,
  left 140 takes over the 14.5 dB and raised single takes by up to 1.7 dB. And a limiter left free to go to 8 dB
  brought every take within 2 LU of the target, but turned the first syllable of *tetãme* and the stressed one of
  *ko'ág̃a* down by 7.8 and 7.5 dB, 9 takes by more than 7 dB and 51 by more than 3: that is no longer trimming a peak. So the
  limiter stops at 3 dB, and *tetãme* and *ko'ág̃a*, which no levelling brings in cleanly, have the take of their own
  seed cut after a pause, whose peaks stand 14.7 and 13.9 dB over its loudness.
  What it gave is under *the levels as they ship*, below: by the review's own measure every clip and every line is
  within 2 LU of the target now.

`check/sound-test.js` holds a check for each of these, on fixture takes made for them (a fifth of a second of the note
that another take holds for a second; a take that peaks like a voice; a dialogue). Put to the tool as it was, the
first part of that test fails thirteen checks, among them each of the three flaws; and with the tool changed back in
one point at a time (the file's own duration for `ms`; no second encoding for the peak; no loudness for a short take;
every file written whatever it holds), the check of that point fails each time. One of the thirteen is the tool's dry
run, which reported every dialogue as lacking all its lines and named no file: `--dry-run` now reads no recording,
writes nothing and names what a real run would make (326 clips in seven files for `sound/A1/voz` as it is since 17
November, which is what the run makes).

| File | Size | Clips | Keys that point at a clip of the file | Audio |
|---|---|---|---|---|
| `gn-sound-a1-u01.js` | 729,040 bytes (440,742 gzipped) | 78 | 7 | 126.1 s |
| `gn-sound-a1-u02.js` | 895,548 (551,040) | 82 | 19 | 156.6 s |
| `gn-sound-a1-u03.js` | 826,380 (505,948) | 82 | 20 | 143.6 s |
| `gn-sound-a1-u04.js` | 1,001,354 (617,162) | 94 | 14 | 174.8 s |
| `gn-sound-a1-x.js`, the level exam | 93,912 (57,465) | 3 (two items and the test tone) | 0 | 17.0 s |
| `gn-sound-pl.js`, the placement check | 46,137 (29,835) | 2 | 0 | 8.3 s |
| `gn-sound-sp.js`, Hablar | 80,647 (47,458) | 14 | 0 | 13.1 s |
| all seven | 3,673,018 bytes (2,249,650) | 355 | 60 | 639.5 s, 10.7 minutes |

The files of 17 November, after the run of that day (on 16 November: 358 clips, 3,710,173 bytes, 10.8 minutes). 326
clips were made (291 recordings, 34 put together from lines, the tone); 29 of them are in a second file as well,
because that file may be the only one loaded. All seven are 3.67 MB as they are and 2.25 MB as a server sends them
gzipped; which of them a phone stores, and when, is under «What the screens say». Every voice clip is marked
`synthetic`, with the model and CC BY-NC 4.0 in each file's header and in the index. Unit 2's file grew (two examples
that were one word are sentences) and unit 1's and unit 3's shrank (three examples are silent); the other files hold
the clips they held, levelled anew, and a clip's size goes by its length alone.

*Which keys have no clip, and why.* The list has 736 keys. 475 are keys a screen can ask for, and 415 of them have a
clip. The other 60 are silent: 45 by the rule (15 words of nasal pairs, 14 words whose text is named, 16 named by
key, two of them the examples the ear's test on what ships named) and 15 clips that cannot be put together because a
line of theirs is out: the slower versions of eleven listening lessons (nine by the slow takes alone), two listening
lessons and one placement item (the three lines named in the rule), and one dialogue of Teach (its second line named
by the ear's test on what ships). The remaining 261 keys are ones no screen asks for: 179 lines, and the 82 words of
sound pairs that do not play.

*The levels as they ship.* The measure is the review's own, not the tool's: its code (`…/voice-ship/review/scripts`,
`extract.js` and `measure.py`, unchanged) takes every clip back out of the sound files, decodes it, cuts a clip that
is put together at its cues, and measures each clip and each line without its air, in a loop, by BS.1770 with its
gates; the peak is the true peak of the decoded MP3. On the files as the review found them and on the files of 17
November:

| | The files of 16 November | The files of 17 November |
|---|---|---|
| Clips of one recording | 322 | 320 |
| their loudness: median; 5th to 95th percentile; quietest to loudest | −16.7 LUFS; −18.8 to −16.1; −21.5 to −15.9 | −16.0 LUFS; −16.9 to −15.9; −17.8 to −15.8 |
| within 2 LU of −16; within 1 LU | 272; 196 | 320, every one; 308 |
| *ko'ág̃a*, *tetãme*, «Jajotopáta ko ka'aru.» | −21.5, −21.4, −19.8 | −15.8, −16.0, −17.3 |
| Lines of the clips put together | 122 lines in 35 clips | 120 lines in 34 clips |
| their loudness: median; quietest to loudest | −17.0; −20.8 to −16.0 | −16.0; −17.7 to −15.9 |
| within 2 LU of −16 | 94 | 120, every one |
| the widest gap between two lines of one clip; clips with more than 2 LU between two lines | 4.0 LU (`a1u03d1.p1.x3`); 11 | 1.7 LU (`a1u03d5.r1`); none |
| The woman's clips and lines; the man's; the narrator's (median) | −16.7; −17.7; −17.0 | −16.0; −16.0; −16.0 |
| Highest true peak; samples clipped | −1.50 dBTP; none | −1.50 dBTP; none |

By length of the sound in a clip, the median was −17.0 LUFS under 0.4 s (24 clips), −16.9 from 0.4 to 0.7 s (120),
−16.5 from 0.7 to 1.5 s (128) and −16.5 above (50); it is −16.2 (22 clips), −16.0 (122), −16.0 (124) and −16.0 (52).
The placement's `pl.5`, whose first line was at −20.1 and its last at −16.9, has its three lines at −17.3, −16.9
and −16.0; of the eight lines of unit 1 day 1's lesson, which fell from −16.1 to −19.9, none is quieter than −17.5.
The quietest clips now are *ko'ã* (−17.8), *Jaha!* (−17.7), *apyka* (−17.6) and the sign «Jajotopáta.» (−17.5): takes
whose peaks stand so far over their loudness that 3 dB of limiting does not bring them to the target.

The tool's own account of the same run agrees with it: 373 of the 438 recordings are at −16 LUFS as they ship; 271
had their highest peaks turned down, by 1.8 dB at the median and 4.4 at the most (3 for the take's own level, the
rest for what its MP3 peaked over its WAV), during 121 ms of a take at the median, 43.5 s of those takes' 353 s; 65
stay under the target, by 0.7 LU at the median and 22 of them by more than 1 LU, the furthest by 1.8 (the slow take
of «Jajotopáta ko ka'aru.», which plays nowhere today); 247 clips and lines were fitted to the ceiling after
encoding, by 1.6 dB at most; the highest true peak of a clip is −1.50 dBTP. What a limiter does to the sound of a
peak is not something these measures show: whether the 271 takes still sound like themselves at their loudest
moment is for a listener (item 16 of the list). The measure this file gave until 17 November (−17.3 LUFS at the
median, 71 % within 2 LU) took each clip with the quiet a trim keeps at its ends, which makes a short word look
quieter than it is; by that older measure the files of 17 November are at −16.7 at the median and 96 % within 2 LU.

*The MP3 against the take.* On 16 November a dozen clips of each file were taken back out, cut at their cues and
heard by the independent recogniser: 64 clips, 81 Guarani lines, 8.2 % CER where the takes they were made from score
7.9 %, the right letters in 61 lines where 62 of the takes have them. Since 17 November every line of every clip is
heard as it ships, by both recognisers and three ways: the figures for the whole set are under «The ear's test on
what ships».

## Each sound the course teaches

The numbers are the verification's unless a line says otherwise: its own measures on the model's alignment, five to
thirty seeds a word, and what the two recognisers wrote for each letter over the whole manifest ("places": every
occurrence of the letter in the 460 Guarani clips of its run, independent recogniser first), with the same count on 93
clips of real speech beside it where it matters. The fix round's own figures are marked.

| Sound | Rendered? | In short |
|---|---|---|
| The six oral vowels, with the y | **yes** | y has its own place between i and u, and every y pair is told apart both ways |
| The nasal vowels ã ẽ ĩ õ ũ ỹ | **partly** | different from the oral vowel, but by pitch; ĩ is heard, ũ often, ã and õ are not |
| The puso | **partly** | a clean gap after a, e and i; after o, u and y a creak that both recognisers take for an h in some words |
| g̃ | **partly** | no such letter in the model; given as a nasal vowel after g, the independent recogniser writes g̃ for it |
| j | **partly** | voiced between vowels and, run in, at the start of a word; before u it is a stop (*aju* «adu»); *jasy* starts like an h |
| h | **yes** | 75 ms of breath; heard as h in 92 % and 96 % of 252 places |
| The soft r | **yes** inside a word, **no** opening a word said alone | a tap inside (95 % and 97 % of 328 places); a hum before the vowel at the start (*ru* heard with r in 1 hearing of 18) |
| rr (loans) | **no** | one long tap, never a trill: two closures in 0 takes of 15, where the Spanish voice has two or more in 25 of 25 |
| mb, nd, ng, nt as one sound | **yes** | a nasal hum and a stop in one syllable, no vowel before it |
| ch | **yes**, as «sh» or ch | noise lower than s; whether it is «sh» or the Spanish ch a machine cannot tell, and the lesson accepts both |
| v | **yes**, with a reserve | voiced and soft, not a b; lip or teeth cannot be told; a hum before it when it opens a word |
| k | **partly** | a closure and a burst when run in; before e it is weak (*okẽ*, *aike*) |
| ñ | **yes**, one word aside | heard in 91 % and 96 % of 46 places; *ñúme* comes back «ndume», «nume» |
| The u that always sounds (ku, gu before a vowel) | **yes** | four pairs told apart both ways |
| Stress: the last vowel unless an acute says otherwise | **partly** | the acute moves length only, and not in every word (*óga*); the final stress of an unmarked word shows in nothing measured |
| Nasal harmony | **cannot tell** | the spelling carries it and the voice says what is written |

**The y.** F1 and F2 of the last vowel, 30 takes a vowel in the same frames (pi, py, pu; hendi, hendy, hendu): i 318 and
2,295 Hz, y 360 and 1,472, u 334 and 711. The y is as high in the mouth as i and u and halfway between them from front
to back, where the sixth vowel belongs. With six seeds a word, ita / yta, sa'i / sa'y, yvytu / yvyty and hendu / hendy
are told apart both ways by both recognisers, with no swap in 96 hearings; seven more y pairs likewise. The pictures of
ita / yta and yvytu / yvyty show the second formant of y near 1,600 Hz, of i near 2,300, of u under 1,000.

**The nasal vowels.** The nasal word differs from its oral twin, but what moves is the pitch: the nasal word's last
vowel is 1.4 to 4.4 semitones higher in all nine twins measured. A1−P0, a standard sign of nasality (the first
harmonic's peak against the nasal peak), falls 0 to 4.5 dB for a written ã and rises in *tupã* and *mitã*, where an a
after m or n in the same voice falls 8 to 10 dB: the voice can make a nasal vowel, next to a nasal consonant, and does
not make one for the tilde. The pictures of pyta / pytã, tupa / Tupã and pytu / pytũ show no nasal difference. By vowel:
ĩ is heard (*petĩ* 17 hearings of 18, never for *peti*; *oĩ* 12 of 18), ũ often (*pytũ* 17 of 22), ã and õ are not:
*pytã* 0 of 22, *tetã* 0 of 18, *akã* 1 of 18, *mokõ* 0 of 10; *Tupã*, *mitã* and *porã* are written nasal by the
independent recogniser only, which also writes «mitã» for *mita*. *okẽ* is heard right in 0 hearings of 22 («otẽ»,
«opẽ», «vote»): its k fails too. In words they know, the recognisers do write the tilde: over the clips that stay (the
fix round's run), ã in 95 % and 92 % of its 39 places (real speech: 82 % and 96 % of 28), ẽ in 69 % and 85 % of 48, ĩ in
77 % and 85 % of 26, õ in 32 % and 87 % of 31. It is in the pairs, where only the tilde tells two words apart, that they
do not. A learner asked to hear «el aire por la nariz» would be listening to pitch. So the pairs that differ only by a
nasal vowel stay silent, with *tetã* / *tetãme* and the word *okẽ*; a native ear decides (first item of the list below).

**The puso.** Over 15 words, five seeds each, the level falls by a median of 20.5 dB at the puso, and by 10 dB or more
in 91 % of takes; in the same words written without it, it falls 1.6 dB, never 10. *ka'i*, *sevo'i*, *po'i* and
*mandi'o* have a silent gap of 30 to 50 ms, on the measure and on the pictures. Over the manifest the recognisers write
the puso as often as for real speech (80 % and 91 % of 221 places, against 83 % and 89 % of 63). **After o, u and y
there is no gap in some words**: *mbo'y* has 0 ms of silence, is voiced through three quarters of the stretch, looks
like «mbohy» on the picture and is written «mbohy» in 9 and 8 takes of 11 (with its puso in 1 and 2). Its twin *mboy*
comes back «mbovy» from the independent recogniser in 10 takes of 11 and «mbo'y» from the large one in 3: that pair is
not told apart. The same h for the puso: *ro'y* and *avy'a* in 4 hearings of 10 each, *chero'y* and *chemandu'a* in the
takes that were kept. *po'i* was heard «poi» twice in 11 by the large recogniser. So of the four puso pairs of the
course three are told apart (ka'i / kái, sevo'i / sevói, po'i / poi), and mbo'y / mboy stays silent. In the fix round's
run the recognisers write the puso in 85 % and 96 % of its 221 places in the clips that stay; *mbo'y* was «mbohy» for
both again, *chero'y* «cherohy», *chemandu'a* «che manduha»; *avy'a* and *apu'ã* were heard with their puso by both.

**g̃.** Given as a nasal vowel after a plain g (above), the g and its vowel are apart from those of the same word with a
plain g and an oral vowel in every take of 6 words (the g: 1.9 to 3.3 times the distance between two seeds; the first
round), also where the nasal vowel comes two syllables later (oguahẽ). The independent recogniser writes g̃ there in 14
takes of 15 and in none of 15 for a plain g; the large one writes ng, n or gã in 9 of 15. Whether what it hears is the
nasal g the course describes or an ng, a machine cannot say. In the fix round's run the independent recogniser writes g̃
in 12 of the 14 recorded lines that have one («Ag̃aite», «Tereg̃uahẽ», «Ko'ág̃a», «Og̃uahẽpa»), and the large one hears
«angaite» and «ko'ána».

**j.** Between vowels it is voiced (80 to 88 % of the stretch) and without noise (the band above 2.5 kHz 24 dB under the
low band): a voiced sound of the palate, never the Spanish jota. **Before u it comes out as a stop**: *aju* is «adu»
from the large recogniser in 9 takes of 9 and «aju» from the independent one in 2 of 9; the j of *roju* is written j in
2 hearings of 20. **At the start of a word said after a pause it is voiceless and noisy** (6 to 8 dB of noise under the
low band, as for h; the picture of *jagua* shows 80 to 110 ms of weak noise before the vowel), though the recognisers
still write j for *jagua* (8 of 10), *jaha* and *jakaru* (10 of 10). The run-in cut repairs that for the words that open
a short clip (the fix round, five seeds a word): the j is voiced in 58 % of its stretch in *jagua* (12 % after a pause),
67 % in *jakaru* (10 %), 100 % in *jaha* (50 %), 83 % in *jarýi* (21 %), 73 % in *jajotopáta* (12 %), and the picture of
*jagua* shows a voiced closure and a release. Run in, five seeds: *jagua* is «jagua» 5 times of 5 for the independent
recogniser and «yagua» 4 times of 5 for the large one, which is the lesson's «y de yo» in other letters; *jaha* 5 and 3
of 5; *jarýi* 5 and 2 (the large one writes a vowel before it). Over the clips that stay the j is written j in 98 % and
94 % of its 83 places, and in all 17 clips that open with it (88 % by each recogniser before the fix). *jasy* is
voiceless either way (0 % and 0 %): after a pause it is heard «hasy» in 24 hearings of 24, run in «kasy» and «casy». The
model knows the jota from the Bible's names, and *jasy* looks like one. It is not in the course's clips; it must stay
out while this voice is in use. Whether a word-initial j sounds like the «y de yo» the lesson promises, a machine cannot
say: *aju*, *jagua* and *Jaha!* are on the native speaker's list.

**h.** About 75 ms, voiced in 18 % of the stretch, with breath noise 8 dB under the low band (24 dB for j): it sounds.
Heard as h in 92 % and 96 % of 252 places (real speech: 93 % and 98 %) and in 46 of 46 clips that begin with it; *aha*,
*ahendu*, *heta*, *hasy*, *ha*, *hendu*, *pyhare* 10 hearings of 10 each. *Héẽ* is the exception: the two vowels come
out as one short «he» or «hé» in 9 of its 14 rows.

**r and rr.** Inside a word the r is a tap, heard right in 95 % and 97 % of 328 places. **At the start of a word said
alone it is a hum of about 50 ms before the vowel, not a tap** (the picture of *ru*; no fall of the level in *roju*,
*roho* and 3 takes of 5 of *réra*): *ru* is heard with r in 1 hearing of 18 (nd, d or l otherwise), *roho* in 0 of 16,
*réra* in 3 of 16; over the manifest the r that opens a clip is right in 62 % and 88 % of 16 clips. An r has no closure
to cut in, so the run-in cut does not apply. **rr is never a trill**: by the verification's measure two closures in 0
takes of 15 of *karréta*, *arro* and *vúrro*, where the Spanish voice's rr has two or more in 25 of 25; it is one tap,
longer (128 to 184 ms). *arro* comes back «aro» from both recognisers. So in «La r, siempre suave» the words that play
show neither of the lesson's two points, and its pairs stay silent.

**mb, nd, ng, nt.** The first 60 ms of *mba'e*, *mba'eve*, *mboy*, *ndahái* and *ndaipóri* are a nasal hum (the band
from 1 to 4 kHz 25 to 31 dB under the band below 500 Hz), where *emba'e* and *endahái*, with a written e, give 14 to 18:
no vowel before the stop, one syllable. mb is heard in 96 % and 99 % of 118 places, nd in 92 % and 94 % of 52, nt in 7
of 7, ng in 5 and 6 of 8. A plain m before *a'e* is also heard mb (*ma'e* as «mba'e» in 7 hearings of 10): the
recognisers' vocabulary, most likely. The model says a bare b or d the same way: «doce» comes back «ndose».

**ch.** Voiceless noise of 94 to 184 ms centred at 3.7 to 4.5 kHz, against 4.4 to 5.7 kHz for s; heard as ch in 95 % and
99 % of 144 places. The measure of a closure does not separate it from the Spanish voice's ch (neither shows one), so
«sh rather than ch» can be neither confirmed nor refuted; notes G1 and the lesson accept both.

**v.** Voiced in 86 % of the stretch, without noise, as loud as the next vowel: a soft continuing sound, not a b. Heard
as v in 96 % and 98 % of 54 places. At the start of a word said alone a hum comes before it, which other seeds write y,
u, m or b (*vaka* clean in 2 hearings of 10; the take that was kept is heard right by both). Whether the lip touches the
teeth, as the course describes, a machine cannot tell.

**k.** The lesson («La k», unit 4 day 5) plays *kesu*. After a pause the model opens neither *kesu* nor *kamby* with a
k: written k in 1 hearing of 16 for *kesu* («hesu», «hechu», «Jesús») and in 2 of 16 for *kamby* («amby», «hamby»),
noise on the picture where the closure and the burst should be. Run in (the fix round), the closure and the burst are
there. Five seeds a word: *kesu* is «kesu» 5 times of 5 for the independent recogniser (the large one writes «Jesú»
every time, its Bible again), *kamby* «kamby» 4 times of 5 for each, *ka'aru* 4 of 5, *karai*, *koty* and *kuña* 5 of 5
(independent). Over the clips that stay the k is written k, or c, in 95 % and 95 % of its 224 places, and in 100 % and
94 % of the 35 clips that open with it (89 % and 77 % before the fix). Before e the k stays weak inside a word too: in
the verification's kept takes it is written k in 82 % and 71 % of 17 places (p, h, t, j otherwise: *aike* «aite», *okẽ*
«otẽ»), against 90 to 100 % before a, o, u and y.

**ñ.** Heard as ñ in 91 % and 96 % of 46 places. Before ú it fails: *ñúme* is «ndume» and «nume» in 6 hearings of 6.

**The u that always sounds.** Four pairs of the verification's own (ku and gu before a vowel against k and g alone) are
told apart both ways; *kuimba'e*, *ógagui* and *mitãnguéra* are heard with their u.

**Stress.** Single words, five seeds: the acute moves length only. The last vowel loses 50 to 110 ms against the one
before it in 13 twins of 15 (*koty* +230 ms, *kóty* +138), while level and pitch do not follow (1 dB or less; the
Spanish voice moves the level by 4 to 14 dB in canto / cantó). Without a mark the last vowel is the longer one, but 1 to
6 dB weaker and lower. The recognisers write the acute for *kotýpe* (10 hearings of 10; 0 for *kotype*), *akyhýje*,
*túva* and *téra*, and never for *óga* (0 of 16 hearings, and «ora» from the large one in 6 takes of 8), *áke*, *kóty*,
*jágua*, *karái*. The independent recogniser leaves an ó out of real speech in more than half of its places too (the
large one in 1 of 12), so this is weak evidence; but nothing measured shows the accent of *óga*, and the pairs whose
point it is stay silent.

**Nasal harmony.** The course writes it (ña-, -me, n-) and the voice says what is written: *ñañe'ẽ*, *ógape* and
*tetãme* are heard right by the large recogniser, *jakaru* as «jacaru». Whether the unmarked vowels beside ñ, m and n
are nasal: the first round's measure went one way in three comparisons and the other way in two. No answer.

**Sounds the course does not teach, and the voice does not have:** f («Sofía» as «sosía»); l, written l in 31 % and 55 %
of its 29 places in the clips that stay (n, nd, d otherwise), at the start of a word («Luis» as «ndúi»), between vowels
(«Elena» as «edéna») and at the end («mil» as «mi»); ld, rl, tr and a bare d; and, by the names trial, rt, dr, rm, rn,
st, kt and a last r. They were in the names the people had until 10 November, which is why those were changed, and are
in the Spanish numbers («How the text is prepared»); the l figures are of the verified run, before the change.

## What must stay without audio

A voice that says a taught sound wrong is worse than silence, and a question that the voice makes unfair is worse than
a question that is read. So five things keep a clip out: a rule, the recognisers' ear on the take, a person's decision
on what the tool flags, what was settled when the whole course was said, and, since 17 November, the same ear on the
clip as it ships. The rows that stay silent are not in the manifest the
tool writes next to its clips (`sound/A1/voz/manifest.json`), `make-sound.mjs` registers no clip for them, and the
screens keep their written stand-in there and say that the audio is not recorded yet.

**1. By rule: `sound/silent.json`.** These rows never play, whatever a recogniser hears, because the measures above
say the voice does not render what they teach. Each has been said once all the same, and its clip waits in
`left-out/`, for a listener. The file is read by `make-tts.py`; it holds contrasts, keys and texts, and the reason for
each. Since 17 November it is plain JSON that `tools/hear-sound.py` reads and adds to as well: that tool names keys
in it by itself, with what it heard (5, below), and reads from it two lists of its own, "words" (the flawed word of
each clip that is silent by key: *aike*, *irũ*, *mbo'ehaópe*, *Argentina-gua*, *Héẽ*) and "forms" (the examples of
Teach whose point is one letter or one small word: 5).

- **The two words of a sound pair that differ only by a nasal vowel** (`"contrasts": ["nasal"]`; decided from the two
  texts, so it holds when the manifest is made again). Today 26 rows: «Las vocales nasales», unit 1 day 2, all four
  pairs, `a1u01d2.s0a` to `a1u01d2.s3b` (pytu / pytũ, oke / okẽ, tupa / Tupã, pyta / pytã); unit 1 day 5, all three,
  `a1u01d5.s0a` to `a1u01d5.s2b` (okẽ / oke, porã / póra, téra / térã); unit 1 day 6, the first, `a1u01d6.s0a`,
  `a1u01d6.s0b`; unit 2 day 4, the first two, `a1u02d4.s0a` to `a1u02d4.s1b`; Hablar `p0.0` to `p2.1`.
- ***mbo'y* / *mboy***, the first pair of «El puso» and a pair of Hablar: `a1u01d4.s0a`, `a1u01d4.s0b`, `p4.0`, `p4.1`.
  The puso of *mbo'y* is a creak that both recognisers hear as h.
- **«La r, siempre suave»**, unit 2 day 2, all three pairs, `a1u02d2.s0a` to `a1u02d2.s2b` (ru / vúrro, nde réra /
  karréta, roju / arro), and its review pair in unit 2 day 6, `a1u02d6.s1a`, `a1u02d6.s1b`: the r that opens *ru* is a
  hum, and rr is one long tap.
- ***tetã* / *tetãme***, the fourth pair of «La tilde con sufijo», unit 2 day 3: `a1u02d3.s3a`, `a1u02d3.s3b`. The word
  that plays, *tetã*, is heard «teta».
- ***óga* / *ogakuéra***, the first pair of «El acento se mueve», unit 4 day 2, and its review pair in unit 4 day 6:
  `a1u04d2.s0a`, `a1u04d2.s0b`, `a1u04d6.s1a`, `a1u04d6.s1b`. The accent of *óga* shows in nothing measured.
- **Eight words, wherever they are a clip of their own** (`"texts"`): *okẽ* (`a1u01d5.w.oke`, and the two pair rows the
  nasal rule holds already), *ñúme* (`a1u02d3.w.nume`, `a1u02d3.s2b`), *angirũ* (`a1u01d2.w.angiru`, `a1u01d5.w.angiru`,
  `a1u04d4.w.angiru`, `a1u02d5.s1a`), *roju* (`a1u02d2.w.roju`), *roho* (`a1u02d2.w.roho`), *chero'y* (`a1u03d1.w.roy`,
  `a1u03d1.s1b`), *chemandu'a* (`a1u03d2.w.chemandua`), *ñemuhára* (`a1u03d3.w.nemuhara`). Both recognisers hear each
  with wrong letters in the best of three takes, in the verification's run and again in the fix round's, with other
  takes.
- **Four short clips, by key:** *Héẽ* as a scene word (`a1u01d6.w.hee`: one short vowel, «he»), «Ikatúpa aike?»
  (`a1u01d6.w.ikatupa`: «aite»), «che irũ» (`a1u03d3.w.cheiru`: «chairũ»), «Aike mbo'ehaópe.» (`a1u03d5.p2.x3`:
  «mbo'ehaúpe»). The same in both runs.
- **Three lines that a listening question turns on, each with its whole item** (named on 10 November; the reasons are
  under 4, below): «Ha'e Argentina-gua.» (`a1u01d3.r1.l5`, with it the listening lesson of unit 1 day 3), «Héẽ,
  ndahái.» (`a1u02d5.r1.l7`, the lesson of unit 2 day 5) and «Ag̃uahẽma che rógape. Ka'aru aháta mbo'ehaópe.»
  (`pl.3.l1`, the placement's second listening item). A clip that is put together from lines cannot be made without
  one of them, so naming a line silences its item, the slower version too.
- **Three examples of Teach, named by the ear's test on what ships** (17 November; the reasons are under 5, below):
  «Che réra Moisés. Che Argentina-gua.» (`a1u01d3.p2.x1`), «Héẽ, chekane'õ ha chero'y.» (`a1u03d1.p1.x3.l1`, with it
  the dialogue it closes, `a1u03d1.p1.x3`) and «Che ru chokokue ha che sy ñemuhára.» (`a1u03d3.p1.x3`).

*kesu*, *kamby* and *peju* were on the verification's list. Run in, they are heard right (above) and are said again.

**2. By ear: what `--verify` leaves out by itself.** A Guarani clip of one or two words that a learner hears on its own
(a scene word, a word of a pair, a short example, a word to write from dictation in Escribir) and whose best take both
recognisers hear with wrong letters is left out, with the other word of its pair (a pair is one lesson; if the word left
out is the one no screen plays, the other stays). The first round's tool had no such test: it only checked whether a
pair word was heard as its partner, raised no flag in the verification's run, and 14 clips with wrong letters went
through. The test errs towards silence: it would silence about one short clip in ten of real speech. In the run of
2026-11-10 it left out:

- the words the rule now names (*angirũ*, *okẽ*, *ñúme*, *roju*, *roho*, *chero'y*, *chemandu'a*, *ñemuhára*, *Héẽ*,
  «Ikatúpa aike?», «che irũ», «Aike mbo'ehaópe.»), and *mbo'y*, *ru*, *vúrro* and *arro* of the pairs it names: 27 rows
  with the other words of their pairs;
- four rows no screen plays today, which only the run's own list holds: *irũ* (`a1u03d3.s1b`, heard «iiru», «iro») and
  the unused words of three pairs whose other word is silent (`a1u02d3.s2a` ñu, `a1u02d5.s1b` mante, `a1u03d1.s1a`
  ro'y).

Not left out this time, though both recognisers heard them wrong in the verification's run: *kesu*, *kamby* and *peju*
(run in), and «Mboýpa ovale?» (another take, which one recogniser hears right).

The clips are in the folder's `left-out/` for a listener; `"keep"` in `silent.json` frees a key or a text once a person
has heard it and found it right, and the clip then comes back from `left-out/` as it is («How a clip is said», «How to
make the clips again»). A line of a dialogue is never left out this way: the dialogue needs it. The tool lists
the short lines that both recognisers hear with wrong letters and that stay. The fix round's run listed ten; what
became of each is under 4(c) and 4(d), and three were left: «Remba'apo.» and «Omba'apo.» (`a1u02d1.r1.l5`,
`a1u02d1.r1.l7`) and «Héẽ, upéicha.» (`a1u03d4.p2.x1.l2`), which was said again on 17 November (5), so two are left.

**A slow take that is heard worse than the normal take of its line is left out too**, since 10 November («How a clip is
said»): 22 of the 47 (23 until 17 November), with the slower version of every listening lesson that has one of them
among its lines.

**3. Flagged, for a person to decide.** `--verify` lists the words of a sound pair with a mark (the puso, a nasal tilde,
an acute) that no recogniser writes at all. The recognisers leave marks out of real speech too, so these are not left
out by the tool: the ones whose lesson is that very mark are in `silent.json` (the pairs of *óga* / *ogakuéra* and
*tetã* / *tetãme*), the others stay and are on the list below:

- *kái*, which plays in `a1u01d4.s1b` and `a1u01d6.s2b` and in Hablar's `p5.1`: «kai» from both. The pair ka'i / kái is
  told apart by its puso; what is not shown is the accent of *kái*.
- *óga*, in three pairs where no screen plays it and in `a1u04d4.s2a` («La u siempre suena», óga / jagua), where it
  plays but its accent is not the point: «oga» from both.

**4. Settled when the whole course was said (10 November).** The rounds had left four things open. Each was decided
from what the two recognisers wrote of the takes and from what the screens show while a clip plays
(`Listening.dc.html`, `Review.dc.html`, `Placement.dc.html` and `LevelExam.dc.html`, read that day).

*(a) Questions that hang on who is speaking.* The two voices are one man about two semitones apart, so a question that
can be answered only by telling the woman from the man would be unfair. What the learner has while a clip plays: in a
listening lesson, the situation in a sentence above the player and, under the waveform, a status line that names the
speaker of the line that is playing («Línea 3 de 5 · Hombre»), and no text until the answer is given; in the notebook,
since 16 November, the play card names the speaker the same way («Sonando… Línea 2 de 5 · Hombre»); in the placement
check and the level exam, nothing about the speaker and no text. The app plays 17 items as clips (twelve
listening lessons, three items of the placement check, two of the level exam; the week tests ask for no clip). In two
of them a wrong option is true of the other speaker:

- `a1u02d3.r1`, «¿Dónde trabaja el vecino?»: Rosa asks, the neighbour says «Amba'apo kokuépe. Ha nde?», Rosa says «Che
  amba'apo mbo'ehaópe, Itauguápe.». «En la escuela» and «En Itauguá» are Rosa's.
- `a1u03d5.r1`, «¿Adónde va la mujer?»: she says «Aju Itauguágui. Ko'ág̃a aha Ka'akupépe.», he says «Ha che aha
  Ypakaraípe.». «A Ypacaraí» is his.

**Both stay**, for three reasons that agree with one another. The lesson's status line names the right speaker during
the whole of each of their Guarani lines: since 16 November it keeps time by the clip's own cues (until then, by the
lines' lengths in letters, it named the right speaker during 84 % to 100 % of each of these lines and changed 0.2 to
0.8 s early). The man's line is the lower one in both clips: 133 Hz against 160 and 150 Hz in
the first (3.2 and 2.1 semitones), 105 Hz against 148 Hz in the second (5.9). And the order of the turns gives the same
answer as the voices: the narrator says «Rosa habla con un vecino» and she asks first; the sentence above the player
says «una mujer le cuenta a un hombre de dónde viene y adónde va», and only the first speaker says where she comes
from. In the notebook the play card names the speaker while the clip plays, by the same cues, and the learner has
seen the item's transcript once already. In the
other fifteen items one speaker alone says anything of the kind that is asked (the woman asks and the man answers:
`a1u03d1.r1`, `pl.3`, `a1x.4`, `a1x.5`), or the narrator numbers the replies (the three «respuesta rápida» lessons), or
the answer does not depend on who says it (what the stall has, what Moisés is, the grandfather's name, the animal that
is far, the price), or one voice speaks (`a1u01d3.r1`, `pl.1`, `pl.5`).

*(b) The placement check and the level exam.* They measure the learner: a clip that is not understood costs a wrong
placement or a failed exam, and neither screen shows a word of the exchange. A clip stays there only if its question
can be answered from what each recogniser wrote: no line heard with wrong letters by both, and the words the answer
turns on (the item's own explanation names them) there for both.

- `pl.1` **stays**: «Mba'éichapa reiko?» is written letter for letter by both.
- `pl.3` **is silent**: in the line that carries the answer, «Ag̃uahẽma che rógape. Ka'aru aháta mbo'ehaópe.», both
  hear wrong letters («aguahẽma he rogapea aru ahata mbo'ehaópe», «aguahẽma che rógape ha aru aháta mbo'ehaópe»), and
  neither hears the *ka'aru* that puts the school in the afternoon, which is what makes «En la escuela» wrong. Nine
  further takes did not mend it (the word has its k in 1 hearing of 20). The item is read from its transcript, as
  every item was before.
- `pl.5` **stays**: each of its three lines has the right letters for the large recogniser. The independent one is a
  letter off in two words (*hasýgui* as «ha segui», *jeýta* as «jeýpa») and has every other word the answer turns on:
  «ndahai amba'apo» rules out «hoy trabaja», «apytáta hendive» after «chesy» is «se queda con su mamá», and «ko'ẽro
  amba'apo» is «mañana … trabajar».
- `a1x.4` **stays**: of «Mbohapy chipa ha peteĩ kesu, aguyje.» the large recogniser has every letter, and the
  independent one writes «mbohapyichipa ha peteĩ ke suvauje»: both numbers and both things are there, and what it
  loses is *aguyje*.
- `a1x.5` **stays**: «Aiko távape, che sy ha che ru ndive.» has the right letters for both.

The exam's two clips go together: `LevelExam` takes the first item's clip as the sign that its listening part has
sound, so the part must have both or neither.

*(c) The short lines of dialogues that both recognisers hear with wrong letters, and the lines with Héẽ.* A dialogue
is one clip in the app. For each such line the questions were whether the exchange is still understood, and whether
the flawed word is one a question turns on.

- «Ha'e Argentina-gua.» (`a1u01d3.r1.l5`: «ha'e a hentinagua», «ha'e ahentinagua»): **silent, with its item.** The line
  carries the answer of unit 1 day 3 (¿Qué dato de la alumna nueva es correcto? Es de Argentina), and the flaw is in
  the answer's own word, in the take that was kept and in nine further takes. The lesson is read from its transcript.
- «Héẽ, ndahái.» (`a1u02d5.r1.l7`: «he ndahái», «héndahái»): **silent, with its item.** It is the third reply of unit 2
  day 5 (¿Qué responde Vicente?), wrong because it says «sí, no voy». With its *Héẽ* cut to one short vowel (9 takes
  of 10 for each recogniser) what is left is «ndahái», «no voy», which answers the question as well as the right
  reply does. «Nahániri, aha.», the second reply of the same item (`a1u02d5.r1.l5`: «nahániri 'aha»,
  «nahániri'aha»), only has a puso written before *aha* and would have stayed.
- «Remba'apo.» and «Omba'apo.» (`a1u02d1.r1.l5`, `a1u02d1.r1.l7`: «reimba'apo» and «rembápo», «ombaapo» and
  «ombáapo»): **stay.** They are the two wrong replies of unit 2 day 1. The three replies differ by their first
  syllable alone (a-, re-, o-) and both recognisers write that syllable in all three; what they miss is the puso
  further on. The right reply, «Amba'apo.», is «amba'apo» for the large recogniser and «ambarapo» for the other.
- «Héẽ, upéicha.» (`a1u03d4.p2.x1.l2`: «he upéicha», «hẽ upéicha»): **stays.** It closes a Teach example (Og̃uahẽ
  pohanohára. / Añetépa? / Héẽ, upéicha.) and no question is asked of it.
- **The other lines with Héẽ stay.** Nine lines that stay have the word. Both recognisers write it with two vowels in
  five of them, one of the two in two, neither in two («Héẽ, upéicha.» and «Héẽ. Ha amo kavaju ituicha.»). No question
  turns on the word: the answer of unit 4 day 3 is «amo kavaju» in that same line, which both write, and in unit 4
  day 5 («Héẽ, oĩ.») whether there is cheese is not what is asked.
- **Since 17 November** a line that holds *Héẽ* is put to the ear's test as it ships (5), because the word is silent
  when it stands alone. The two lines that neither recogniser heard with two vowels were said again, and each has a
  take in which one or both do; a third, «Héẽ, chekane'õ ha chero'y.», had none in twelve seeds and is silent with
  its dialogue. Eight lines that play have the word now: both recognisers write it with two vowels in five («Héẽ,
  upéicha.» among them), one of the two in three («Héẽ, che pohanohára.», «Héẽ, og̃uahẽ ko'ág̃a.» and «Héẽ. Ha amo
  kavaju ituicha.»: the large one each time), neither in none.

*(d) The slow takes.* A slow take stays only where it is heard at least as well as the normal take of its line («How
a clip is said»): 25 do (two of them belong to the items that are silent as a whole, so 23 are in the folder), 22 do
not, and all but one of the listening lessons have one of the 22 among their lines (until 17 November: 24 and 23).
Without its slower version a lesson's screen draws the button «Más despacio 0.8×» as off, with «Todavía no hay
versión lenta» under it (until 17 November: «Todavía no está grabado», which read as if the lesson's audio were
missing); the clip plays and repeats at its own speed, and nothing else changes. So the 22 are left out, and
of the ten lessons that play one has a slower version (unit 2 day 1). Putting a slower version together with normal
takes in the place of the slow ones would have the button promise a speed that the clip does not keep.

*The nine lessons that play and have no slower version.* Listening draws «Más despacio 0.8×» on every lesson; on these
nine it is off, with «Todavía no hay versión lenta» under it, and the clip plays at its own speed. Each lacks its slower
version for the same reason: one slow line or more was heard worse than the normal take of that line, and a slower
version is put together only when all of its slow lines stay. The lines that are out, with the letters off for the
independent and for the large recogniser, slow take against normal take:

| Lesson | Slow lines that were left out |
|---|---|
| Unit 1 day 1, `a1u01d1.r1` | «Iporã, ha nde?» (3 + 0 against 1 + 0: «iporãva a ndae») |
| Unit 1 day 4, `a1u01d4.r1` | «Nahániri. Oĩ kesu ha mandi'o.» (5 + 1 against 3 + 0); «Mboýpa ovale ko kesu?» (2 + 2 against 0 + 1: the line and its slow take were both said again on 17 November, and the slow one is heard worse again) |
| Unit 2 day 3, `a1u02d3.r1` | «Amba'apo kokuépe. Ha nde?» (2 + 0 against 1 + 0); «Che amba'apo mbo'ehaópe, Itauguápe.» (3 + 1 against 0 + 0) |
| Unit 3 day 1, `a1u03d1.r1` | «Jaha, oĩ terere.» (1 + 1 against 0 + 0: «tere'e» from both) |
| Unit 3 day 3, `a1u03d3.r1` | «Ha'e che sy, Vicente. Ha'e mbo'ehára.» (4 + 0 against 2 + 0); «Ha Moisés ha'e che irũ. Ha'e pohanohára.» (2 + 1 against 2 + 0) |
| Unit 3 day 5, `a1u03d5.r1` | «Aju Itauguágui. Ko'ág̃a aha Ka'akupépe.» (2 + 2 against 1 + 2) |
| Unit 4 day 1, `a1u04d1.r1` | «Ha'e che sy.», «Mávapa ha'e?», «Mba'éichapa héra ne memby?» (the independent recogniser hears «ndememby» in the slow take) and «Héra Genaro.» (1 + 0 against 0 + 0 each) |
| Unit 4 day 3, `a1u04d3.r1` | «Pe jagua iporã, Juan.» (3 + 3 against 0 + 1). Until 17 November also «Héẽ. Ha amo kavaju ituicha.» (3 + 1 against 2 + 1): said again that day with its line, its slow take is heard as well as the line and is in the folder |
| Unit 4 day 5, `a1u04d5.r1` | «Héẽ, oĩ.» (3 + 2 against 3 + 0); «Mboýpa ovale?» (2 + 1 against 0 + 1); «Mokõi kesu, aguyje.» (2 + 3 against 0 + 2) |

That is 17 of the 22 slow takes that are left out; the other 5 are lines of the two lessons that are silent as a
whole (unit 1 day 3 and unit 2 day 5). Each of the 22 waits in `left-out/`, and the normal take of its line is in the
folder, made with the same seed: a listener who finds a slow take no harder to follow than its line names it under
"keep" (item 12 of the list below), and a lesson gets its slower version back once every slow line of it is in the
folder. Unit 3 day 1, unit 3 day 5, unit 1 day 1 and now unit 4 day 3 each lack one slow line only.

**5. By the same ear on the clip as it ships (17 November).** `tools/hear-sound.py` hears every clip decoded from its
MP3 («The ear's test on what ships», under «What was measured», has the three hearings, the rule of two in three,
what a take must do to pass and the figures of its first run). It keeps a clip out in three cases, and each answers
something the review of 16 November found.

- *A clip of one or two words that both recognisers hear wrong as it plays.* This is the rule of 2, put to the MP3:
  a take can pass and its MP3 not, as four did. A clip that fails is said again, and if none of twelve seeds passes
  its key is named, with the other word of its pair. Six failed on 17 November (*aju*, «Aguyje mante», *mitãkuña*,
  *ñu*, *mitãnguéra*, *guyrakuéra*); each has a take that passes, and none is silent for it.
- *An example of Teach that says the form its own lesson calls wrong.* «Mba'éichapa héra ne ramói?» was heard «nde
  ramói» by both, in the lesson that teaches that *nde* loses its d before a nasal word. To find every such trap the
  lessons were read, each grammar point with its form, its rule rows, its warning and the day's compare rows. In 122
  of the 150 examples the point is one letter or one small word: a prefix (a-, re-, o-, ja- and ña-, pe-; che- with a
  state and a- with an action; i-), *nde* and *ne*, *réra* and *héra*, -pe and -me, -gui, -pa and *piko*, -kuéra and
  -nguéra, nd-…-i and n-…-i, *ko*, *pe* and *amo*, a stress the lesson writes. `sound/silent.json` lists them under
  "forms": for 116 keys the example as its lesson says it must *not* be said (209 wrong lines: *nde ramói* for *ne
  ramói*, *tetãpe* for *tetãme*, *ndosẽi* for *nosẽi*, *mitãkuéra* for *mitãnguéra*), and for 51 keys the word whose
  stress the lesson marks with an acute. An example fails when, in two hearings of three, the writing of both
  recognisers is nearer in letters to a wrong line than to the example, or neither writes the acute. Of the examples
  with a wrong line that play, one was nearer to it, the one the review found; it has a take that both write «ne
  ramói» in every hearing. The acute went unwritten in two, «Mboýpa ovale ko kesu?» and «Che amba'apo mbo'ehaópe.»;
  each has a take in which the large recogniser writes it in every hearing (the independent one writes the ý of
  *mboýpa* in none of twelve seeds; it leaves more than half the ó of real speech unwritten too). As the files are, 120 lines that play have a
  wrong line to be held against and 57 a marked stress: none is nearer to a wrong line, and none has its acute
  unwritten by both. The other 28 examples turn on a whole word, on the order of words or on a stress that is not
  written (a pronoun, a trade, a number, a set phrase, the owner before the thing, *jagua*), which the voice cannot
  turn into the lesson's wrong form by a letter.
  What this rule does not ask is that the word an example is about be heard right. A line in which both recognisers
  write any wrong letter is on the listener's list, not out, and two of those are examples whose point is a letter
  that both miss, though neither writes the lesson's wrong form: «Aguyje ndéve, Sara.» (the lesson: the y of *aguyje*
  is not an i; both write «aguje») and «Che ru nosẽi ógagui: oky.» (the n- of the negation; both write «mosẽi»).
  They head item 18 of the list. A rule that stopped every example whose own word is misheard was weighed and not
  made: it cannot tell the letter that is the point from a letter beside it («chey'uhéi» heard «che'uhéi» in an
  example about *che-*), and these two are for an ear.
- *A line that holds, with the same flaw, a word that is silent when it stands alone.* The app does not say inside a
  sentence a word it will not say alone. The words are the eight of "texts" and the five of "words"; a line fails
  when, in two hearings of three, both recognisers write that very word with wrong letters. Before the run 23 lines
  that play held one of the thirteen, and both miswrote it in seven. Four have a take that passes: «Che amba'apo
  mbo'ehaópe.», «Ha'e che angirũ.», «Héẽ, upéicha.» and «Héẽ. Ha amo kavaju ituicha.». Three had none in twelve seeds,
  and the tool named them:
  - «Che réra Moisés. Che Argentina-gua.» (`a1u01d3.p2.x1`), an example of -gua in unit 1 day 3. The other two
    examples of that point play («Che Paraguaigua.», «Mbo'ehára héra Rosa. Ha'e Paraguaigua.»).
  - «Héẽ, chekane'õ ha chero'y.» (`a1u03d1.p1.x3.l1`), the second line of a dialogue of Teach in unit 3 day 1
    («Nekane'õ, Vicente.» / «Héẽ, chekane'õ ha chero'y.», `a1u03d1.p1.x3`). A dialogue is one clip, so the first
    line goes with it. The point's other three examples play («Chekane'õ.», «Chevare'a ha chey'uhéi.», «Ndepochy,
    Juan.»), and *ne-* before a nasal word is still heard in unit 3 day 4 («Nekane'õpa?»).
  - «Che ru chokokue ha che sy ñemuhára.» (`a1u03d3.p1.x3`), in unit 3 day 3. The point's other three examples play.

  No listening item lost its audio. The one line of a listening item that failed, «Héẽ. Ha amo kavaju ituicha.» in
  unit 4 day 3, has a take that passes (its seventh seed). Had it had none, the tool would have left it playing and
  listed it for a person: naming a line of a listening item silences the whole item, here for a word that no answer
  turns on (the answer, «amo kavaju», is in the same line and both write it), and that is not the tool's to decide.
  After the run 20 lines that play hold one of the thirteen words, and in none do both miswrite it.

Where an example is silent the screen keeps its written stand-in: the example's control lights up for as long as the
line would take, says «Este audio todavía no está grabado.» when it is tapped, and the card keeps its tag «voz
sintética» for the examples that play, as it has done for «Aike mbo'ehaópe.» since 10 November. Each of the three
takes waits in `left-out/` under its key, and taking the key out of "keys" (or naming it under "keep") brings it back.

**In all:** 110 of the manifest's 736 rows have no clip: 69 by the rule (24 as the words of a nasal pair, 15 by their
text, among them *okẽ* in two nasal pairs, and 30 by key, three of them named by the ear's test on what ships), 26
left out by `--verify` (4 short clips by ear, 22 slow takes) and 15 clips that cannot be put together because a line
of theirs is out (eleven slower versions, two listening lessons, one placement item, one dialogue of Teach). 60 of the
110 are keys a screen asks for today; the other 50 are lines (28) and the words of sound pairs that do not play (22).
438 clips are in `sound/A1/voz` and 65 in its `left-out/`: of the 65 recordings of the list that stay silent, 64 wait
there under their own key (22 slow takes, 21 named by key, 10 words of nasal pairs, 7 named by their text, 4 left out
by ear) and one, *okẽ* as a pair word, under the key of the scene word (`a1u01d5.w.oke`), which is the 65th file.

A word that is silent as half of a pair is still said where it is a word of a scene (*mitã*, *téra*, *óga*), unless its
text is named: there it is a word said imperfectly and marked «voz sintética», not a lesson in telling two sounds apart.

**Not silenced, and flawed:** «Diez mil.» and «Treinta.» in another man's voice; «Remba'apo.», «Omba'apo.» and the
lines with a short *Héẽ* (4(c)); and the names the independent recogniser misses once each (Juan, Moisés in the man's
voice, Santiago: «The names of the people»). Until 10 November the lines with a name the voice cannot say were here
(Luis, Lucas, Lucía: the l; Nilda, Carlos: ld, rl; Sofía: the f): those people have other names now and their lines
were said again. Of the 391 Guarani clips that stayed at the normal rate on 10 November, both recognisers heard wrong
letters in 26 as takes: the two replies named above and 24 of the 212 longer lines, 15 of them lines of dialogues and
listening items. Since 17 November the count is of what plays, each line decoded from its MP3 and heard three ways:
21 of the 374 Guarani lines at the normal rate are heard wrong (8 examples of Teach, 6 lines of its dialogues, 7 lines
of listening lessons), none of them a clip of one or two words, and each is in the table of item 18 with what was
written. The seven lines of listening lessons are the two replies, «Chekane'õ ha chey'uhéi.», «Aju Itauguágui.
Ko'ág̃a aha Ka'akupépe.», «Héẽ. Ha amo kavaju ituicha.», «Ha ko mbarakaja?» (unit 4 day 3: «mbaraka'ja»,
«mbaraka'ia»; the answer is the horse, in the line before) and «Mba'éichapa? Oĩpa kesu?» (unit 4 day 5: «jesu» from
the large recogniser, the *oĩ* run into the word before it for the other; what is asked is how many cheeses and at
what price, which other lines say). Three of
those carry the answer of a listening lesson that plays, and each keeps the word that decides it: «Héẽ. Ha amo kavaju
ituicha.» in unit 4 day 3 (4(c)); in unit 3 day 1 the man's «Chekane'õ ha chey'uhéi.», which comes back «chikane'o ha
seyuhéi» and «che kane'õ ha che uhéi» (*y'uhéi* is damaged for both, *kane'õ* is there for both, and it alone picks
«Está cansado y tiene sed»); and in unit 3 day 5 «Aju Itauguágui. Ko'ág̃a aha Ka'akupépe.», which comes back «aju
itauguáguio'ágã aha ka'akupépe» and «aju itaguágui ko'ágã aha ka akupépe» (the place the woman goes to is there for
one, and without its puso for the other). The verification had
checked every listening item the same way: each stays answerable, the words that carry the answer being heard by at
least one recogniser. To silence a line, name its key in `silent.json`: the item it belongs to then goes silent as a
whole.

**What the screens say** (since 16 November, when the screens were gone through for it; the states of a clip since
17 November, after a review of the voice in the app). `make-sound.mjs` marks every
one of these clips `synthetic`, with the model and the licence in each file's header and in the index, and every
screen that offers such a clip carries the same small tag, «voz sintética», next to the control and before anything is
tapped (`gnCourse.synth`): Teach, Words (the pairs of its sound step, the words of its scene, the spelling pad),
Listening, the notebook's review, the placement check, the level exam (in the pause before its listening part and in
the part itself) and Hablar. So the placement's and the exam's listening items that stay (`pl.1`, `pl.5`, `a1x.4`,
`a1x.5`) say it too. A screen reader hears what the tag means once a visit, when a tag is really drawn (the level
exam's briefing, which only asks about its listening part, says nothing), and the sentence is taken out of the page
again eight seconds later. Progreso has the one page that explains the
voice, in a learner's words: a program's (Meta's MMS), not a person's, not yet checked by a native speaker; what it
does badly (the nasal vowels, whose pairs stay silent; one man's voice for both speakers of a dialogue; Spanish names
and numbers; and, from «In one screen», what is rendered in part or not: «A veces falla en la sílaba fuerte, en el
puso (') después de o, u, y, y en la r al empezar una palabra.»); that some words and phrases stay silent on purpose
because the program says them badly, wait for a person's recording and read «todavía no está grabado» meanwhile; that
recordings by native speakers will replace it; what the phone stores of the sound; the credit, with a second page
that shows the whole of the app's `licenses.txt`; and a switch, «Usar la voz sintética», saved with the progress: off,
the player has no synthetic clip and every screen shows its written stand-in. Listening's status line, which names the
speaker, keeps time by the clip's `cues`
now: over the ten lessons that play it shows a Guarani line's own row during the whole of the line for all 40 lines
(by the lines' lengths in letters: during 80 % or more for 28 of the 40, and during less than half for 2, the woman's
greeting of unit 1 day 1, 10 %, and «Diez mil.» in unit 4 day 5, 32 %), and each change of row comes 8 to 112 ms
after the middle of the quarter second of silence between two lines, before the next line's sound begins (measured
twice on 16 November in Chromium, the audio clock and the status line sampled every 40 ms: 14 to 112 ms in the
first run, 8 to 109 ms over the 47 changes of row of the second).

A screen says why a clip does not sound, in one of four ways, and no longer one sentence for all of them
(`gnCourse.soundState`, `soundNote`). Where a clip is silent by the rule of this document the screens still say
«todavía no está grabado», which is true of a person's recording; why some stay silent is said once, on Progreso's
page. Where the clip's sound file is still on its way (a slow line, the first lesson of a unit) the control waits and
says «Cargando el audio…»: it runs no stand-in, shows no transcript and no word, opens no answer, and no clock of a
game or an exam runs meanwhile; a clip the learner tapped then plays by itself where a play is free (Teach, Words, the
spelling pad, Listening, the notebook) and waits for a tap where plays are counted or the audio sets the pace (the
placement check, the level exam, the model in Hablar). Where the file could not be fetched, or is not in 20 seconds
after a control began to wait, the written stand-in says «No se pudo cargar el audio», and what it has shown stays
shown if the file arrives after all. Where the learner turned the voice off it says «Apagaste la voz sintética: … La
activás de nuevo en Progreso.» The limit of 20 seconds is set by the files: the largest unit's is 0.61 MB as a host
sends it, 12.3 s at 400 kbit/s, the slowest line measured (there unit 1's, 0.45 MB, was in 9.5 s after it was asked
for, and 2.5 s at 1.6 Mbit/s); 20 s leaves room down to 250 kbit/s. A learner with a plan is sent the file of the
unit in use, of the unit after it and of the speaking game ahead of time (1.03 MB as sent in a first session, where
all seven files, 2.26 MB, went before), and the rest when its screen opens; Listening's «Más despacio 0.8×», for the
nine lessons whose clip has no slower take, says «Todavía no hay versión lenta».

## What a native speaker should listen to first

The clips are FLAC files named by their key: the ones that stay silent in `sound/A1/voz/left-out/`, the rest in
`sound/A1/voz` itself and, as the app plays them, in the app. `tts-report.csv`, in the same folder, lists every clip
with its key and its text, and its last column says why a clip is in `left-out/`. What you find right goes into
`sound/silent.json` (its first entry says how), and the line of «How to make the clips again» then brings the clip
back as you heard it.

1. **Two nasal pairs, before anything else:** *pyta* / *pytã* (`left-out/a1u01d2.s3a.flac`, `a1u01d2.s3b.flac`) and
   *pytu* / *pytũ* (`a1u01d2.s0a.flac`, `a1u01d2.s0b.flac`); the other nasal words are next to them (*tupa*, *Tupã*,
   *oke*, *okẽ* as `a1u01d5.w.oke`, *porã*, *póra*, *térã*). If the second word of each pair sounds nasal to you, the
   rule can go ("nasal" out of `silent.json`'s "contrasts") and the nasal steps get their audio. If it only sounds
   higher, the rule stays.
2. **The puso:** *ka'i* and *sevo'i*, where the gap is clean, against *mbo'y*, *ro'y*, *chero'y*, *avy'a* and
   *chemandu'a*, where the voice creaks through and the recognisers hear an h.
3. **The y:** *yta*, *yvyty*, *sa'y*, *py*. The formants say it is the right vowel; an ear must agree.
4. **The stress:** *óga* against *ogakuéra*, *koty* against *kotýpe*, *kái*, and the names with an acute (Rosa, Vicente,
   Teresa). The acute makes its vowel longer, no louder and no higher. Is that where you hear the stress? And do
   *terere*, *ajahu* and *akyhyje* sound stressed at the end?
5. **g̃:** *ko'ág̃a*, *ag̃aite*, *og̃uahẽ*, Tereg̃uahẽ: a nasal g, an ng, or a plain g?
6. **The j:** *jagua* and *Jaha!* (run in: a voiced start), *aju* and *peju* (before u the recognisers hear a d). Does
   it sound like the «y de yo»?
7. **The k:** *kesu* and *kamby* (run in), *okẽ*, «Ikatúpa aike?»: is the k before e a k?
8. **The r:** *ru*, *réra*, *roho*, *roju* at the start of a word; *karréta*, *arro*.
9. **The start of other single words:** *vaka*, *ñu*, *ñúme*, *po*: a hum before v and ñ, and the independent recogniser
   hears «yo» for *po*.
10. ***Héẽ*:** one short vowel, or two? In `left-out/`, «Héẽ, ndahái.» (`a1u02d5.r1.l7`) decides whether the listening
    lesson of unit 2 day 5 gets its audio back.
11. **The three lines that keep a listening item silent** (`left-out/`): «Ha'e Argentina-gua.» (`a1u01d3.r1.l5`: is it
    Argentina to your ear?), «Héẽ, ndahái.», and the placement's «Ag̃uahẽma che rógape. Ka'aru aháta mbo'ehaópe.»
    (`pl.3.l1`: is *ka'aru* there?). A line that is right comes out of `silent.json`'s "keys", and its item plays.
    And the three examples of Teach that the ear's test on what ships named on 17 November (`left-out/` too): «Che
    réra Moisés. Che Argentina-gua.» (`a1u01d3.p2.x1`), «Héẽ, chekane'õ ha chero'y.» (`a1u03d1.p1.x3.l1`; its dialogue
    plays again once the line is out of "keys") and «Che ru chokokue ha che sy ñemuhára.» (`a1u03d3.p1.x3`: is it
    *ñemuhára*, or «ñemohára»?).
12. **Everything in `left-out/` that was left out by ear:** four short clips (the recognisers are wrong about one short
    clip in ten of real speech) and 22 slow takes, each with the normal take of its line in the folder, made with the
    same seed: is the slow one harder to follow? What sounds right to you goes into `silent.json`'s "keep". A
    listening lesson gets its slower version back once every slow line of it is in the folder.
13. **The names and the Spanish:** Ana and Ramona, which the voice is given as ãna and ramõna (a nasal vowel where the
    stress is: does it sound like the name, or like a nasal a and o?); Juan in «Ndépa Juan? Nahániri, che Casimiro.»;
    the new names, Vicente, Moisés, Santiago, Casimiro, Genaro, Sara, Susana and Karina, in their lines, and the two
    lines that open with Vicente (`a1u02d3.p2.x2`, `a1u02d4.p1.x3`); «Maitei, Moisés.» in the man's voice; «Diez mil.»
    and «Treinta.» in the seller's lines; «ochenta».
14. **The two voices of a dialogue:** is M different enough from F? In «¿Dónde trabaja el vecino?» (`a1u02d3.r1`) and
    «¿Adónde va la mujer?» (`a1u03d5.r1`) the answer depends on who says which line. And in the exchanges on which
    two pitch trackers disagree («The voices»), which line sounds lower to you: the man's «Mávapa ha'e?» or the
    woman's «Ha'e che angirũ.» after it (`a1u03d3.p2.x1`), and the same question before «Ha'e che ru, héra Santiago.»
    (`a1u04d1.r1`); «Mávapa ou?» before «Ou che sy.» (`a1u02d1.p2.x3`), where both trackers have the man higher?
15. **The answers that rest on a damaged word:** «Chekane'õ ha chey'uhéi.» (`a1u03d1.r1.l2`: is *y'uhéi* there?) and
    «Aju Itauguágui. Ko'ág̃a aha Ka'akupépe.» (`a1u03d5.r1.l1`).
16. **The levels** (as the app plays them; since 17 November every clip measures within 2 LU of the others): are the
    short words (*po*, *pira*, *Jaha!*) as loud as the sentences? Do *tetãme* (`a1u02d3.w.tetame`) and *ko'ág̃a*
    (`a1u03d2.w.koaga`), until then the quietest clips of all and since then cut after a pause, sound like the other
    words, at their start too? And the loudest moments of 271 takes are turned down for an instant, by 1.8 dB at the
    median and 3 at the most for the take's own level: do the clips where that goes the whole 3 dB still sound like
    themselves («Jajotopáta ko ka'aru.», *Jaha!*, «Ha che aha Ypakaraípe.» in `a1u03d5.r1`, the sign «Jajotopáta.»)?
17. **ch:** «sh», or the Spanish ch?
18. **The lines the recognisers hear wrong as the app plays them.** The table below has every line of which, in one
    hearing of the three or more, both recognisers wrote wrong letters in the clip decoded from its MP3 (for a
    Spanish line: the one recogniser that judges it): 45 recordings, of which 24 are heard wrong by the tool's rule,
    two hearings of three (14 of the woman's and 6 of the man's Guarani lines, «Treinta.», and 3 of the narrator's).
    `python3 tools/hear-sound.py sound/A1/voz --list` prints it from `sound/A1/voz/mp3-heard.json`. It is laid out
    for the studio page (`docs/estudio`, «El estudio»): choose the voice under «Qué voz grabás», open «Lista», and
    the first column is the line's number there; the key is the one the studio shows under the line, and the take is
    `sound/A1/voz/<key>.flac`. For each line: what each recogniser wrote in the three hearings (once where they agree)
    and in how many of the three both were wrong. Start with two examples whose point is a letter that neither
    recogniser writes: line 82, «Aguyje ndéve, Sara.» (the lesson is that *aguyje* has a y: is it there?), and line
    183, «Che ru nosẽi ógagui: oky.» (the n- of the negation: is it *nosẽi*, or «mosẽi»?); line 179, «Vicente ndoúi
    ko ka'aru: oky.», is new that day as well. A puso inside *Héẽ* («he'ẽ») counts as a wrong letter in this table,
    as it does for a take, though it is the break the two vowels are said with: «Héẽ, upéicha.» and «Héẽ, che
    mbo'ehára.» stand here for nothing else. A line you find wrong: if it is an example or a clip of its own, name
    its key under "keys" in `sound/silent.json`; if it is a line of a listening lesson, naming it silences the lesson,
    so say which word is wrong and whether the question can still be answered. A line you find right needs nothing.

*La voz de mujer* (in the studio: «Qué voz grabás» → F; 411 lines; 14 of these 30 are heard wrong):

| Line in the studio | Key | Text | Independent recogniser | Large recogniser | Wrong for both in |
|---|---|---|---|---|---|
| 2 | `a1u01d1.p1.x1` | Mba'éichapa reiko, Ana? | «mba'éichapa reiko ágã» | «mba'éichapa reiko ána» / «mba'éichapa reiko'ána» | 1 of 3 |
| 27 | `a1u01d2.w.cheru` | che ru | «che rou» | «ceru» / «cheru» | 1 of 3 |
| 47 | `a1u01d3.w.mboehara` | mbo'ehára | «mboehára» | «mbo'ehára» / «mboehára» | 1 of 3 |
| 50 | `a1u01d3.w.mboehao` | mbo'ehao | «mboéi havo» / «mboei havo» | «mbo'ehao» / «bo'ehao» | 1 of 3 |
| 64 | `a1u01d4.p1.x1` | Ikatúpa aike? Héẽ, ikatu. | «ikatúpa aikeeẽ ikatu» / «ikatúpa aikeheẽ ikatu» | «ikatúpa aike he'ẽ ikatu» | 1 of 3 |
| 72 | `a1u01d4.w.soo` | so'o | «su'o» / «ssu'o» | «so'o» / «soo» | 1 of 3 |
| 76 | `a1u01d4.w.mboypa` (heard in `a1u04d5.r1`) | Mboýpa ovale? | «mboy pa ovale» / «mboy pa ovae» / «mboypa ovale» | «mboýpa ovaye» / «mboýpa ovae» / «mboýpa ovage» | 1 of 3 |
| 82 | `a1u01d5.p1.x0` | Aguyje ndéve, Sara. | «aguje ndevesara» | «aguje ndéve sára» / «aguuje ndéve sára» | 3 of 3 |
| 86 | `a1u01d5.p2.x1` | Cheñyrõmi, ña Ramona. | «cheñirũmi ñaramona» / «cheñirũumi ñaramona» | «che ñerõ umi ñaramóna» | 3 of 3 |
| 139 | `a1u02d3.p1.x1` (heard in `a1u04d4.p2.x2`) | Aha che jarýi rógape. | «aha che jarei rógape» | «aha che jaréi rógape» / «aha che jarei rógape» | 3 of 3 |
| 162 | `a1u02d4.p1.x3` | Vicente osẽ mbo'ehaógui ko ka'aru. | «visénte osẽ mbo'eha ogui kokaaru» / «visénte osẽ mbo'eha ogui oka'aru» | «misénte osẽ mbo'ehaógui ko ka'aru» / «vĩsénte osẽ mbo'ehaógui ko ka'aru» | 2 of 3 |
| 168 | `a1u02d4.w.mooguipa` | Moõguipa reju? | «mooguipa reju» / «movoguipa reju» / «moõguipa reju» | «moõguipa reju» / «moõuipareju» | 1 of 3 |
| 179 | `a1u02d5.p1.x3` | Vicente ndoúi ko ka'aru: oky. | «visénte ndoikoka'aru oky» | «misénte ndoúi ko ka'aru oky» / «misénte ndoúi koka'aru oky» | 3 of 3 |
| 183 | `a1u02d5.p2.x3` | Che ru nosẽi ógagui: oky. | «cheru mosẽi ogaguiky» / «cheru mosẽi ogaguioky» | «che ru mosẽi ógagui oky» | 3 of 3 |
| 193 | `a1u03d1.p1.x1` | Chevare'a ha chey'uhéi. | «che vare'a ha chey uhéi» / «che vare'a ha che uhéi» | «chévare'a ha che 'uhéi» / «chevare'a ha che y'uhéi» / «chevare'a ha che 'uhéi» | 2 of 3 |
| 202 | `a1u03d1.w.yuhei` | chey'uhéi | «chey'uhái» / «che y'uhái» | «che y'uhéi» / «chey uhéi» / «chey'uhéi» | 1 of 3 |
| 242 | `a1u03d3.s2b` | ñe'ẽ | «je'ẽ» / «ñe'ẽ» | «ñe'ẽ» / «ñie'ẽ» | 1 of 3 |
| 248 | `a1u03d4.p2.x0.l1` (heard in `a1u03d4.p2.x0`) | Héẽ, che mbo'ehára. | «he'ẽche mbo'ehára» / «heẽche mbo'ehára» | «hẽ'ẽ che mbo'ehára» / «hẽ che mbo'ehára» / «hẽẽ che mbo'ehára» | 1 of 3 |
| 250 | `a1u03d4.p2.x1.l2` (heard in `a1u03d4.p2.x1`) | Héẽ, upéicha. | «he'ẽ upéicha» / «heẽ upéicha» | «he'ẽ upéicha» | 2 of 3 |
| 252 | `a1u03d4.p2.x3.l1` (heard in `a1u03d4.p2.x3`) | Héẽ, og̃uahẽ ko'ág̃a. | «he ogmuahéiko ágã» / «he oguãhéeiko ágã» / «he oguãhéiko ágã» | «hẽ'ẽ oguahẽ ko'ágã» / «he'ẽ oguahe ko'ágã» / «he'ẽ oguahẽ ko'ágã» | 3 of 3 |
| 254 | `a1u03d4.w.agaite` | ag̃aite | «agaite» / «anaite» | «agaite» / «anaite» | 1 of 3 |
| 276 | `a1u03d5.r1.l1` (heard in `a1u03d5.r1`) | Aju Itauguágui. Ko'ág̃a aha Ka'akupépe. | «aju itauguáguio'ágã aha ka'akupépe» | «aju itaguágui ko'ágã ahaka akupépe» / «aju itaguágui ko'ágã aha ka akupépe» | 3 of 3 |
| 286 | `a1u04d1.w.rajy` | che rajy | «che rajy» / «che raje» | «cheraje» / «chéraje» | 1 of 3 |
| 313 | `a1u04d3.p1.x2` | Amo óga ituicha. | «amo oga ituicha» / «amo ogaituicha» / «amo 'óga ituicha» | «amo'õra ituicha» / «amo'õga ituicha» | 1 of 3 |
| 319 | `a1u04d3.w.ryguasu` | ryguasu | «ndyguasu» / «ndayguasu» / «ndeyguasu» | «ry guasu» / «ly guasu» | 1 of 3 |
| 326 | `a1u04d3.r1.l3` (heard in `a1u04d3.r1`) | Ha ko mbarakaja? | «hako mbaraka'ja» | «ha ko mbaraka'ia» | 3 of 3 |
| 329 | `a1u04d4.p1.x3.l0` (heard in `a1u04d4.p1.x3`) | Mávapa amo kuñataĩ? | «mavapa amo okuñataẽ» / «mávapa amo okuñataẽ» / «máva pa amo okuñataẽ» | «mávapa amokuñataẽ» / «mávapa amokuñataẽi» | 3 of 3 |
| 341 | `a1u04d5.p1.x1` | Ha'e oguereko mokõi ary. | «ha'e oguereko mokõi ary» / «hae oguereko mokõi ary» | «ha'e oguereko mokõi ary» / «ha'e oguereko mokõi aly» | 1 of 3 |
| 345 | `a1u04d5.p2.x2` | Che ramói oguereko ochenta ary. | «che ramoi oguereko chénta ary» | «che ramói oguereko chénta ary» | 3 of 3 |
| 352 | `a1u04d5.r1.l1` (heard in `a1u04d5.r1`) | Mba'éichapa? Oĩpa kesu? | «mba'éichapaĩpa kesu» | «mba'éichapa oĩpa jesu» / «mba'éichapa oĩpa kesu» | 2 of 3 |

*La voz de hombre* (in the studio: «Qué voz grabás» → M; 66 lines; 7 of these 9 are heard wrong):

| Line in the studio | Key | Text | Independent recogniser | Large recogniser | Wrong for both in |
|---|---|---|---|---|---|
| 9 | `a1u02d1.r1.l5` (heard in `a1u02d1.r1`) | Remba'apo. | «reimba'apo» / «reimbaapo» | «rembápo» | 3 of 3 |
| 10 | `a1u02d1.r1.l7` (heard in `a1u02d1.r1`) | Omba'apo. | «ombaapo» | «ombaapo» / «ombáapo» | 3 of 3 |
| 13 | `a1u02d4.p2.x1.l0` (heard in `a1u02d4.p2.x1`) | Moõguipa reju, Ana? | «moõguipa reju ána» / «moõguipa reju na» | «moou ipareju ana» / «moouripareju ana» / «moouipareju ana» | 1 of 3 |
| 20 | `a1u03d1.r1.l2` (heard in `a1u03d1.r1`) | Chekane'õ ha chey'uhéi. | «chikane'o ha cheyuhéi» / «chikane'o ha csey uhéi» / «chikane'o ha cse yuhéi» | «che kane'õ ha che uhéi» | 3 of 3 |
| 24 | `a1u03d4.p1.x0.l1` (heard in `a1u03d4.p1.x0`) | Héẽ, che pohanohára. | «heiche pohãnohára» | «he'ẽ che pohanohára» | 3 of 3 |
| 31 | `a1u04d3.r1.l2` (heard in `a1u04d3.r1`) | Héẽ. Ha amo kavaju ituicha. | «he a amokavaju ituicha» / «he a amo kavaju ituicha» | «he'e ha amo kavaju ituicha» / «he ha amo kavaju ituicha» | 3 of 3 |
| 35 | `a1u04d4.p1.x3.l1` (heard in `a1u04d4.p1.x3`) | Ha'e che rajy. | «ha'eiche rajy» / «haeiche rajy» | «ha'eche raje» / «ha'e che raje» / «ha'e cheeraje» | 3 of 3 |
| 37 | `a1u04d5.p2.x1.l1` (heard in `a1u04d5.p2.x1`) | Treinta. | — | «trenta» / «treinta» | 2 of 3 |
| 38 | `a1u04d5.r1.l2` (heard in `a1u04d5.r1`) | Héẽ, oĩ. | «he'e romi» / «he'e rogmi» | «he'e oĩ» / «héeoi» / «heeoi» | 1 of 3 |

*El narrador* (in the studio: «Qué voz grabás» → N; 25 lines; 3 of these 6 are heard wrong):

| Line in the studio | Key | Text | Independent recogniser | Large recogniser | Wrong for it in |
|---|---|---|---|---|---|
| 8 | `a1u01d4.r1.l6` (heard in `a1u01d4.r1`) | ¿Qué hay en el puesto? | — | «qué hay en el puesto» / «que erahay en el puesto» | 1 of 3 |
| 10 | `a1u02d3.r1.l0` (heard in `a1u02d3.r1`) | En la ronda de tereré, Rosa habla con un vecino. ¿Dónde trabaja el vecino? | — | «es la ronda de terere rosa habla con un vecino dónde trabaja el vecino» / «e la ronda de terere rosa habla con un vecino dónde trabaja el vecino» | 3 of 3 |
| 14 | `a1u03d3.r1.l0` (heard in `a1u03d3.r1`) | En la fiesta de San Juan. Ana presenta a dos personas. ¿Qué es Moisés? | — | «en la fiesta de san juan ana presenta dos personas qué es moisés» | 3 of 3 |
| 18 | `a1u04d1.r1.l3` (heard in `a1u04d1.r1`) | Juan señala a un señor de la foto. | — | «cuan señala un señor de la foto» | 3 of 3 |
| 19 | `a1u04d1.r1.l8` (heard in `a1u04d1.r1`) | ¿Cómo se llama el abuelo de Ana? | — | «cómo se llama el abuelo de ana» / «cómo se llama el abuelo de ala» | 1 of 3 |
| 24 | `a1x.4.l0` (heard in `a1x.4`) | En la feria. ¿Qué pide el hombre? | — | «en la feria qué pide el hombre» / «en la feria qué pide el hombe» | 1 of 3 |

Of the 31 recordings the review of 16 November listed, 3 are silent since (item 11), 9 were said again (item 19; two
of them, «Héẽ, upéicha.» and «Héẽ. Ha amo kavaju ituicha.», are still in the table), 18 are in the table as they
were, and one is not there because one recogniser now writes its letters in every hearing: the man's «Jajotopáta ko
ka'aru.» (`a1u01d1.r1.l5`, line 2 of the man's voice in the studio: the independent recogniser writes «jajotopátako
ka'ãrũ», the large one «jajotopáta koka'ãvõ» and «…koka'árõ», where the review had «…koka'ãrõ» and «…koka'ãvõ»).

19. **The twelve recordings that were said again on 17 November** («The ear's test on what ships» has the table: the
    key, the seed and what each recogniser writes now). Each passes the rule; in five one recogniser still writes a
    wrong letter in every hearing: *aju* («adu»: the j before u, item 6), «Aguyje mante» («aguje»), *ñu* («ju»),
    *guyrakuéra* («muyrakuéra») and «Héẽ. Ha amo kavaju ituicha.» («he a amo»). And *mitãnguéra*, *mitãkuña* and «ne
    ramói», which both write right now: do they sound right?

## How to make the clips again

```
# once: Python 3.10 or later with torch, transformers, soundfile and numpy; ffmpeg with rubberband; Node 22. A CPU is enough.
export HF_HUB_DISABLE_XET=1        # hosts: huggingface.co and us.aws.cdn.hf.co

# after any change in content/, in sound/respell.json or in sound/silent.json, one line: it says only the clips whose
# text, voice or respelling changed, keeps the take of every other clip, moves what is silent now to left-out/ and
# what a person freed back from it, makes the app's sound files again (a file with no changed clip stays as it is),
# and hears every clip whose MP3 is new as the app plays it (a clip that fails there is said again or silenced)
node tools/build-course.mjs && node tools/sound-list.mjs A1 && python3 tools/make-tts.py --out sound/A1/voz --verify --changed && node tools/make-sound.mjs sound/A1/voz --manifest sound/A1/voz/manifest.json --kind synthetic && python3 tools/hear-sound.py sound/A1/voz

python3 tools/make-tts.py --dry-run                                # the whole list as it would be said; stops on anything it cannot say
python3 tools/make-tts.py --dry-run --out sound/A1/voz --changed   # what the line above would say, move or bring back, without doing it
python3 tools/hear-sound.py sound/A1/voz --check                   # the ear's test on the sound files as they are: judges, changes nothing
python3 tools/hear-sound.py sound/A1/voz --list                    # the lines both recognisers hear wrong in one hearing or more: the table of «What a native speaker should listen to first», 18
```

- **The takes are `sound/A1/voz`, and that folder is added to, never made again from nothing.** The samples depend on
  the machine: with another thread count (1 instead of the tool's 3) the model's output differs in the sixth decimal,
  F and N clips by one or two units of 32,768, and rubberband turns that into another waveform for M (the
  verification: 4 of 6 M clips differed, 3 of them transcribed differently). `takes.json` records the library versions
  and the thread count. On the machine of 10 November the same seed gave the same file every time it was tried, and
  again on 16 November, after a restart («How a clip is said», «Takes and seeds»), and on 17 November after another:
  29 takes said again from `takes.json` (the takes of that day's run, a listening lesson's lines, slow takes, the
  man's lines) were the same FLAC files, byte for byte, and the sound files made three times from the folder were
  the same eight files each time.
- **`--changed`** compares the list with the folder. A row keeps its clip when the clip was made from the text the
  voice is given for that row today (the respelled text) and for its voice; a clip whose row moved passes to the row
  that says its text now («How a clip is said»); the rows that then lack a take are said, each heard back, and the
  slow take of a line that is said again is said again with it. Nothing else is said or heard, and what an earlier
  `--verify` left out stays out for as long as its row is the row that was judged and "keep" does not name it.
- **Tried on 16 November, six days after the files were made.** *Nothing changed*, the line as it stands above, in the
  repository: no clip said, no model loaded (the voice tool's part takes a third of a second), all seven sound files
  «as they were», and not one file of `sound/` or `project/` different afterwards, by checksum and by `git status`.
  The whole line took 2 minutes 41 seconds, nearly all of it `make-sound.mjs` encoding every clip again to find that
  nothing had changed. *One text changed* (an example of unit 1 day 1, in a copy of the repository's `content/`,
  `tools/`, `sound/` and `project/`): one clip said, three takes of it heard by both recognisers in 15 seconds, the
  other 439 kept; in `sound/` the clip, the two clip lists, `takes.json` and the two reports changed, and of the sound
  files only `gn-sound-a1-u01.js` was written anew, the other six left byte for byte as they were. That line took 2
  minutes 58 seconds. (With the recognisers not yet in the machine's memory, the first such run of the day took 3
  minutes 39 seconds for its one clip.)
- **Tried on 17 November, with the ear's test at the end of the line.** *Nothing changed*, the line as it stands
  above, in the repository, right after the run of that day: no clip said, no line heard, no model loaded, all seven
  sound files «as they were» and `mp3-heard.json` «as it was»; of the 576 files of `sound/` and `project/` not one
  differs afterwards, by checksum, and `git status` is as clean as before. The whole line took 6 minutes 10 seconds:
  6 minutes 8 for `make-sound.mjs`, which now levels every take in its own code, limits it and fits it to its MP3's
  peaks (more than twice what it took on 16 November), and 1.4 s for `hear-sound.py`, which finds every MP3 under
  the checksum it heard it by. *The run that made that day's changes* (two examples said whole, two words said with
  the other cut, then the line's last two tools) took 40 minutes; what each part took is under «The ear's test on
  what ships».
- **`tools/hear-sound.py`** needs the folder's list, its `takes.json` and the sound files that were made from it (it
  stops, naming `make-sound.mjs`, when the files lack a clip the list has), and both recognisers whenever a clip's MP3
  is new to its record; with one recogniser it judges nothing. `--check` judges and changes nothing (exit 1 when a
  clip fails), `--check --save` also keeps what it heard, `--tries N` changes the twelve seeds. It names keys in
  `sound/silent.json` and rewrites that file as plain JSON, so the file is not laid out by hand any more. What it
  does to a clip that fails can be undone like any other silence: take the key out of "keys", or name it under
  "keep", and the take comes back from `left-out/` as it is; "keep" also stops the tool from saying a clip again
  that a person has heard and found right.
- **After a change of `sound/silent.json`** the same line does what is needed, and so does the voice tool alone, with
  or without `--verify`: a clip that is silent now goes to `left-out/` (a recording that a dialogue still needs passes
  to the dialogue's own key), and a clip that a person freed comes back from `left-out/` as it is («How a clip is
  said»). Nothing is said for either, and no model is loaded.
- The order of the line matters: the clip list is read from the built course, so `build-course.mjs` comes first.
- The two voices are 145 MB each. `--verify` needs the recognisers in the Hugging Face cache as well
  (`ivangtorre/wav2vec2-xlsr-300m-guarani`, 1.2 GB; `facebook/mms-1b-all` with `adapter.grn.safetensors` and
  `adapter.spa.safetensors`, 3.9 GB, about 6 GB of memory with both loaded). With `HF_HOME` set to a filled cache,
  `HF_HUB_OFFLINE=1` keeps the run off the network.
- **Ship only what `--verify` heard**, or what `--takes` made from it. Without the recognisers the tool says each clip
  once, leaves nothing out by ear, and says so.
- Time, on four shared CPUs with both recognisers: the 45 clips of 10 November took 5 minutes 36 seconds (three takes
  at most a clip); the 492 clips of the fix round, 46 minutes; the ten words of 16 November, one minute. Without the
  recognisers, 13 clips said again from `takes.json` took 1 minute 52 seconds on 16 November, most of it loading the
  two voices. `make-sound.mjs` took 2 minutes 19 seconds for the 440 clips on 10 November and 2 minutes 40 on 16
  November, with other work on the machine; since the levelling of 17 November, 5 to 6 minutes for the 438 (308 to
  368 s over five runs that day). The ear's test: 43 minutes to hear the 415 lines of the first files three ways
  with both recognisers; about twelve seconds for each take that is said again, made into its MP3 and heard (142
  takes in 28 minutes), so a little over two minutes for the twelve seeds of a clip that has no better take, and
  seven for a recording that plays in three clips.
- The folder holds one FLAC per key (16 kHz, mono, 16 bit; lossless, 58 % of the WAV), `voices.json`, `manifest.json`
  (the list without the silent rows: the one to give `make-sound.mjs`, not `sound/A1/manifest.json`), `takes.json`
  (the seed, the cut, the rate and the pitch of every clip, and what was left out), `tts-report.csv` and
  `tts-report.json` (what each recogniser heard, of every take), `mp3-heard.json` (what each heard of every line as
  the app plays it, three ways, under the checksum of its MP3: `hear-sound.py` writes it) and `left-out/`, the clips
  that stay silent, kept for a listener. A new folder is FLAC too (`--format wav` for WAV); `--format flac` or `--format wav` on a folder that
  holds the other format converts its clips, each read back and compared, and does nothing else. `make-sound.mjs`
  reads either.
- `--verify` without `--changed` hears every clip of the folder again and judges all of it afresh: what was left out
  by ear before is said and judged again too. That is for a change of the recognisers or of the rules of the ear, not
  for a change of the content or of `sound/silent.json`.
- `--takes sound/A1/voz/takes.json --out /tmp/voz2` says the same takes again without the recognisers and leaves the
  same rows out. It stops, before the first clip, if a clip of the manifest has no take in the file.
- `--only 'a1u01d1.*' p3.0` for a part; `--redo` to say again what is there; `--seed N --tries 1` with `--only` and
  `--redo` to keep one particular take of a line (the seeds a clip tries are its key's CRC-32 plus 7919 for each
  further take; name the line's slow take with it, `<key>.slow`, so that it is said again with the same seed: a slow
  take is its line's take said more slowly, and `tools/hear-sound.py` does this by itself); `--cut pause` or `--cut
  closure` with them to keep one of the two cuts of a line that opens with p, t, k or j; `--silent none` with a new
  folder to say everything as if no rule kept a row out (the clips of the silent rows are in `left-out/` already);
  `--prune` to delete the clips whose key the list no longer has.
- A new name, a Spanish word or a new character in the content stops the run until `sound/respell.json` has it, and a
  new name goes through the trial of «The names of the people» first.
- Another level: `node tools/sound-list.mjs A2`, then `--manifest sound/A2/manifest.json --out sound/A2/voz --verify`.

The scripts, logs, pictures and clips of the rounds are in the scratch folder of the session that made them, not in the
repository: `…/scratchpad/voice` (`SETUP.md`, `scripts/`, `work/`, `probe/`, `pics/`: the first round),
`…/scratchpad/voice/verify` (the verification), `…/scratchpad/voice/fix` (the fix round: `scripts/`, `logs/`, `pics/`;
`out/full` is the folder the run of 10 November was made on, as WAV), `…/scratchpad/voice-ship/names` (the names
trial), `…/scratchpad/voice-ship/say` (the run of 10 November: its logs, the folder before it, the scripts that
measured the sound files and the numbers above) and `…/scratchpad/voice-ship/finish` (16 November: `PROGRESS.md`,
`scripts/` with what measured the figures of that day, the logs of every trial named above under `sc/`, the tool as
it was under `old-tool/` and the four changed-back copies under `mut/`), `…/scratchpad/voice-ship/review` (the review
of 16 November: its scripts, the clips it took out of the files and what it measured) and
`…/scratchpad/voice-ship/fix-clips` (17 November: `PROGRESS.md`, `scripts/` with what measured the figures of that
day, `run2.log`, the log of the run, `second-rebuild.log`, the review's measure on the files before and after under
`measure-before/` and `measure-final/`, and the trials of the levelling).
