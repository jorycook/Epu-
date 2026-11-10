# The synthetic voice: what it says, how well, and what must stay silent

Epu'ã has no recordings yet. `tools/make-tts.py` makes stand-in clips with a voice model, for the screens to play marked
«voz sintética» until the studio's recordings replace them. This file is the record of that voice: the model and its
licence, how the text is prepared, how a clip is said, the voices, every number that was measured, what each sound the
course teaches scored, what must stay without audio, what a native speaker should listen to first, and how to make the
clips again. The measurements are of 2026-11-10, in three rounds: a first probe, an independent verification that
refuted part of it, and a fix round. What the verification refuted is corrected here, not kept. A trial of the people's
names followed the same day, after which thirteen people were renamed: «The names of the people».

**Nobody listened to any of this.** Every judgement below was made by machine: two speech recognisers, distances between
clips, measures on the model's own alignment, and pictures of the waveform and the spectrogram. A machine can tell that
two clips differ, that a gap of silence sits between two vowels, where a vowel's formants are, whether a consonant is
voiced, whether a closure and a burst are there. It cannot tell whether a vowel sounds nasal to a Guarani ear, whether
the stress falls where a speaker puts it, whether a j sounds like the «y de yo», or whether the voice is pleasant. Where
the machine could not tell, this file says so.

## In one screen

- **Verdict: ship with exclusions**, as a stand-in marked «voz sintética», in a free app without ads.
- **How well.** Of the clips that stay, single words come back from the independent recogniser at 6.0 % CER and from the
  large one at 4.6 %, lines of two words or more at 10.2 % and 3.6 %, their slow takes at 18.1 % and 8.3 % (the best of
  up to three takes; one take alone scores 10.8 % and 9.7 % on words, 13.9 % and 6.0 % on lines). Real Guarani speech
  scores 11.0 % and 6.5 % on the same recognisers.
- **Silent, by rule** (`sound/silent.json`): the pairs that differ only by a nasal vowel (pyta / pytã, pytu / pytũ, oke
  / okẽ, tupa / Tupã, téra / térã, porã / póra); mbo'y / mboy; the pairs of «La r, siempre suave»; tetã / tetãme; óga /
  ogakuéra; the words okẽ, ñúme, angirũ, roju, roho, chero'y, chemandu'a and ñemuhára wherever they are a clip; and four
  short clips (Héẽ, «Ikatúpa aike?», «che irũ», «Aike mbo'ehaópe.»): 61 rows.
- **Silent, by ear:** `--verify` leaves out by itself every short clip a learner hears on its own that both recognisers
  hear with wrong letters. In the run of 2026-11-10 that was 31 rows; all of them but 4, which no screen plays today,
  are now named in the rule. In all, 65 of the manifest's 736 rows are silent, 43 of them played by a screen today; 468
  of the 502 recordings are said, and no dialogue is dropped.
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
  spelling for the voice («The names of the people»). 45 takes of the verified folder are to be said again for that.
- **Cannot tell:** nasal harmony, beyond the spelling; whether the ch is «sh» or the Spanish ch.
- **The voice is one man.** F is the model as it is; M is the same voice two to three semitones lower. F is not a
  woman's voice. In a dialogue a longer line is moved towards its voice's pitch; even so the man's line is no lower than
  the woman's next to it in 7 exchanges of 47 (it was 11 of 44).
- **The licence is non-commercial** (CC BY-NC 4.0). These clips may not ship in an app that is sold or carries ads.
- **Ship the folder that was verified** (or one made with `--takes` from it on the same machine), not a fresh run
  without the recognisers.

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
sound file and into `gn-sound-index.js` (`window.__gnSoundVoices`). The app's `licenses.txt` does not carry the line
yet: that file is made by the app build.

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

**The renaming changes 35 recorded rows, and the new spellings of Ana and Ramona 10 more.** Their takes in the verified
folder are out of date: `--verify` on that folder says those 45 again and nothing else («How to make the clips again»).

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
clip is 0.43 s long against 0.52 s. Over the manifest, the single words that stay: 138 Hz (median) and 0.66 s for the
122 cut after a pause, 105 Hz and 0.49 s for the 50 run in, which are heard no worse (5.0 % and 3.6 % against 6.2 % and
5.0 %). Shorter carriers raise the pitch a little («he'i» alone: 118 Hz) and lose what the cut gains (both recognisers
hear wrong letters in 4 takes of 29 with «he'i», in 1 of 32 with «ha upéi he'i», in 7 of 32 after a pause), and a shift
upward costs single words most, so the carrier stays and nothing is shifted. Whether a lower, shorter word sounds right
as a word said alone is for a native ear (the list below); what the measures say is that its first consonant is there.

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

**Takes and seeds.** Each clip's first seed is the CRC-32 of its key. With `--verify` a clip that is not heard as
written is said again, up to three takes in all (for a line that opens with p, t, k or j: the other cut with the same
seed, then the next seed), and the best take is kept; a take heard as the other word of its sound pair counts as the
worst. Every take that was heard is in `tts-report.json`, and the seed and the cut of the one that was kept are in
`takes.json`, also for a clip that a later run finds in the folder and does not say again. `--takes` says the same takes
again without the recognisers: 131 clips of the final folder made again that way (every slow take, 26 run-in takes, the
man's lines with their own pitch) came out the same files, byte for byte. On another machine, or with another thread
count, the samples differ («How to make the clips again»).

## The voices

The Guarani model is one man: median pitch 143 Hz on single words and 150 Hz on sentences (104 to 181 Hz between the
10th and the 90th percentile of the voiced frames); the Spanish model 138 Hz.

| Voice of the manifest | What it is | Median pitch |
|---|---|---|
| F, «mujer, voz principal» | the Guarani model as it is; in a dialogue with both voices, moved up by at most 2 semitones | 138 Hz on words cut after a pause, 105 Hz on words run in, 151 Hz on lines |
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
2 semitones or more lower in 25. So one exchange in seven still does not sound like two people; it was one in four. The
seven that remain are lines of two words, which are not placed, a line the Spanish voice says, and lines the model says
very high: its questions with -pa («Mávapa ko mitã?» at 190 Hz) would need more than 3 semitones. Moving a line up costs
nothing that shows: the 9 lines moved up that the verification's run also has, unmoved, score 16.7 % and 4.7 % here and
16.3 % and 4.7 % there. They are hard lines either way (a name, «ha'e che sy»). A line the Spanish voice says for F or M
is not shifted. A woman's voice, and a second speaker that is more than a pitch apart, need another model, or a person.

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

**The whole path.** `make-sound.mjs` was run on the final folder with `--out` in the scratch folder, so nothing was
written to `project/` or `docs/`: 7 sound files and the index; 518 clips made (468 recordings, 49 dialogues and
listening items put together with their cues, the test tone) and every other key of the folder's manifest registered as
a clip that shares one (671 keys in all, none missing, none that the manifest does not have, no silent key); every voice
clip marked `synthetic`, with the model and CC BY-NC 4.0 in each file's header and in the index; 5.2 MB of MP3. Taken
back out of the files: 24 kHz mono; 90 ms of air before the first sound (75 to 130) and 160 ms after; loudness median
−17.2 LUFS, from −24.2 to −16.2, 72 % within 2 LU of the −16 target, the shortest words the quietest (*py*, *po*, *jaha*
at −22 to −24); 9 clips over −1.5 dBTP, the highest −0.7; the stated `ms` is 61 ms longer than the decoded clip. The
last three are for the owner of `make-sound.mjs`. The verification measured the MP3s against the WAVs on its own run: 34
Guarani clips taken back out of the files scored 12.4 % and 4.9 %, and 12.2 % and 4.9 % as WAVs.

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

A voice that says a taught sound wrong is worse than silence, so three things keep a clip out. The rows that stay silent
are not in the manifest the tool writes next to its WAVs, `make-sound.mjs` registers no clip for them, and the screens
keep their written stand-in there, as they do today for everything.

**1. By rule: `sound/silent.json`.** These rows are never said, whatever a recogniser hears, because the measures above
say the voice does not render what they teach. The file is read by `make-tts.py`; it holds contrasts, keys and texts,
and the reason for each.

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
has heard it and found it right. A line of a dialogue is never left out this way: the dialogue needs it. The short lines
both recognisers hear with wrong letters, which stay:

- «Ha'e Argentina-gua.» (`a1u01d3.r1.l5` and its slow take: «ha'e ahentinagua»);
- «Remba'apo.» and «Omba'apo.» (`a1u02d1.r1.l5`, `a1u02d1.r1.l7`: «reimba'apo», «ombaapo»);
- «Nahániri, aha.» (`a1u02d5.r1.l5`: «nahániri'aha»);
- «Héẽ, ndahái.» (`a1u02d5.r1.l7` and its slow take), «Héẽ, upéicha.» (`a1u03d4.p2.x1.l2`) and the slow take of «Héẽ,
  oĩ.» (`a1u04d5.r1.l2.slow`): the *Héẽ* again;
- the slow take of «Mboýpa ovale?» (`a1u04d5.r1.l3.slow`: «ovaye»).

**3. Flagged, for a person to decide.** `--verify` lists the words of a sound pair with a mark (the puso, a nasal tilde,
an acute) that no recogniser writes at all. The recognisers leave marks out of real speech too, so these are not left
out by the tool: the ones whose lesson is that very mark are in `silent.json` (the pairs of *óga* / *ogakuéra* and
*tetã* / *tetãme*), the others stay and are on the list below:

- *kái*, which plays in `a1u01d4.s1b` and `a1u01d6.s2b` and in Hablar's `p5.1`: «kai» from both. The pair ka'i / kái is
  told apart by its puso; what is not shown is the accent of *kái*.
- *óga*, in three pairs where no screen plays it and in `a1u04d4.s2a` («La u siempre suena», óga / jagua), where it
  plays but its accent is not the point: «oga» from both.

**In all:** 65 of the manifest's 736 rows are silent: 26 by the nasal rule, 22 by key, 13 more by text and 4 by ear
alone. 43 of the 65 are played by a screen today; the other 22 are the unused words of pairs. 468 of the 502 recordings
are said, and all 49 dialogues and listening items are put together: none is dropped.

A word that is silent as half of a pair is still said where it is a word of a scene (*mitã*, *téra*, *óga*), unless its
text is named: there it is a word said imperfectly and marked «voz sintética», not a lesson in telling two sounds apart.

**Not silenced, and flawed:** «Diez mil.» in another man's voice, and the short lines of dialogues listed above. Until
10 November the lines with a name the voice cannot say were here too (Luis, Lucas, Lucía: the l; Nilda, Carlos: ld, rl;
Sofía: the f): those people have other names now («The names of the people»), and their lines are to be said again. The
verification checked the 16 listening items of the manifest: each stays answerable, the words that carry the answer
being heard by at least one recogniser; 25 of the 130 listening lines (normal and slow) had wrong letters for both
recognisers, most of them in a name (that count is of the run before the names changed). To silence a line, name its
key in `silent.json`: the listening item it belongs to then goes silent as a whole.

**What the screens say.** `make-sound.mjs` marks every one of these clips `synthetic`, with the model and the licence in
each file's header and in the index. Of the screens, only the Words sound step, Spell and Hablar ask for a clip's kind
and say «voz sintética»; Teach, Listening, Review, Placement and LevelExam play the same clips without the note, among
them the placement's and the exam's listening items (`pl.1`, `pl.3`, `pl.5`, `a1x.4`, `a1x.5`). That is for the owner of
the screens to decide: say it there too, or keep `pl.*` and `a1x.*` silent until recordings exist (two patterns in
`silent.json`'s "keys" do it).

## What a native speaker should listen to first

The clips that stay silent are in the folder's `left-out/`, by key; the rest in the folder itself.

1. **Two nasal pairs, before anything else:** *pyta* / *pytã* and *pytu* / *pytũ* (run the tool with `--silent none` and
   a new folder to hear them). If the second word of each sounds nasal to you, the rule in `silent.json` can go and the
   nasal steps get their audio. If it only sounds higher, the rule stays.
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
10. ***Héẽ*:** one short vowel, or two?
11. **Everything in `left-out/` that was left out by ear:** the recognisers are wrong about one short clip in ten of
    real speech. What sounds right to you goes into `silent.json`'s "keep".
12. **The names and the Spanish:** Ana and Ramona, which the voice is given as ãna and ramõna (a nasal vowel where the
    stress is: does it sound like the name, or like a nasal a and o?); Juan; the new names, Vicente, Moisés, Santiago,
    Casimiro, Genaro, Sara, Susana and Karina, in their lines; «Diez mil.» in the seller's line; «ochenta».
13. **The two voices of a dialogue:** is M different enough from F?
14. **ch:** «sh», or the Spanish ch?

## How to make the clips again

```
# once: Python 3.10 or later with torch, transformers, soundfile and numpy; ffmpeg with rubberband. A CPU is enough.
export HF_HUB_DISABLE_XET=1        # hosts: huggingface.co and us.aws.cdn.hf.co

node tools/sound-list.mjs A1                             # the clip list
python3 tools/make-tts.py --dry-run                      # what would be said; stops on anything it cannot say
python3 tools/make-tts.py --out /tmp/voz --verify        # the clips, each heard back; leaves out what both recognisers hear wrong
node tools/make-sound.mjs /tmp/voz --manifest /tmp/voz/manifest.json --kind synthetic
```

- The two voices are 145 MB each. `--verify` needs the recognisers in the Hugging Face cache as well
  (`ivangtorre/wav2vec2-xlsr-300m-guarani`, 1.2 GB; `facebook/mms-1b-all` with `adapter.grn.safetensors` and
  `adapter.spa.safetensors`, 3.9 GB, about 6 GB of memory with both loaded).
- **Ship only a folder made with `--verify`**, or with `--takes` from one. Without the recognisers the tool says each
  clip once, leaves nothing out by ear, and says so.
- Time: the 492 clips of A1 took 46 minutes with `--verify` on four shared CPUs (three takes at most a clip, two
  recognisers); without the recognisers, about a second a clip.
- The folder holds one WAV per key, `voices.json`, `manifest.json` (the list without the silent rows: the one to give
  `make-sound.mjs`, not `sound/A1/manifest.json`), `takes.json` (the seed and the cut of every clip, and what was left
  out), `tts-report.csv` and `tts-report.json` (what each recogniser heard, of every take), and `left-out/`, the clips
  that stay silent, kept for a listener.
- `--takes /tmp/voz/takes.json --out /tmp/voz2` says the same takes again without the recognisers and leaves the same
  rows out (131 clips made that way from the final folder, every slow take among them, were the same files, byte for
  byte). It stops, before the first clip, if a clip of the manifest has no take in the file. **The samples depend on the
  machine**: with another thread count (1 instead of the tool's 3) the model's output differs in the sixth decimal, F
  and N clips by one or two units of 32,768, and rubberband turns that into another waveform for M (the verification: 4
  of 6 M clips differed, 3 of them transcribed differently). So ship the WAVs that were verified, or verify again;
  `takes.json` records the library versions and the thread count.
- After a change of `sound/silent.json`, run the tool again on the same folder without `--verify` and without `--redo`:
  it says nothing anew, moves the clips that are now silent to `left-out/`, passes a recording a dialogue still needs to
  the dialogue's own key, and writes the manifest again. After a change of the content, `--verify` on the same folder
  says only the lines that are new or whose text changed.
- **Owed since 10 November:** the people's new names and the new spellings of Ana and Ramona («The names of the people»)
  leave 45 takes of the verified folder out of date: 38 of F, 4 of M and 3 of the narrator, 11 of them slow takes (35
  whose text has a new name, and 10 with Ana or Ramona whose text is the same). Make the clip list again
  (`node tools/build-course.mjs`, then `node tools/sound-list.mjs A1`) and run `--verify` on that folder: it says those
  45 and keeps the other 423.
- `--only 'a1u01d1.*' p3.0` for a part; `--redo` to say again what is there; `--silent none` with a new folder to say
  the silent pairs too, for a listener.
- A new name, a Spanish word or a new character in the content stops the run until `sound/respell.json` has it.

The scripts, logs, pictures and clips of the three rounds are in the scratch folder of the session that made them, not
in the repository: `…/scratchpad/voice` (`SETUP.md`, `scripts/`, `work/`, `probe/`, `pics/`: the first round),
`…/scratchpad/voice/verify` (the verification) and `…/scratchpad/voice/fix` (the fix round: `scripts/`, `logs/`,
`pics/`, `out/full` the verified folder, `out/sound` what `make-sound.mjs` made of it).
