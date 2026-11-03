# G4 · Resources and licensing: dictionaries, corpora, audio, speech technology, texts and fonts

Notes, 3 Nov 2026, for the six-level (A1–C2) Paraguayan Guarani app for Spanish speakers, modelled on Yaoki [1].

**Yaoki's parts and their Guarani counterparts.** JMdict/KANJIDIC2 → no open Guarani–Spanish dictionary exists; the nearest are Apertium's GPL lexicon and about 1,000 Wiktionary senses per edition (§3). kuromoji → Apertium's `apertium-grn` analyser, run at build time. KanjiVG → nothing needed (Latin script). Kokoro-82M → no usable Guarani voice, so every clip is a native recording (§4, §6). Aozora Bunko → a small public-domain shelf, official texts, and Vikipetã fetched live (§5). The browser's speech recognition → none hears Guarani (§4). Google Fonts → still fine, once g̃ is checked.

**Method.** Measured in this session from raw.githubusercontent.com: the Jojajovai corpus and its annotation sample, Common Voice's release statistics, Apertium's two lexicons, espeak-ng's Guarani rule and phoneme files, Whisper's language list, the FLORES and Tatoeba-Challenge tables, and Mainumby's licence. Everything else comes from WebSearch result pages, and the URL cited is the page the search surfaced. The session's shared web-search budget ran out before I could check Gasser's papers, the Jojajovai paper's description of its sources, XNLI's licence and Leipzig's terms; those points are marked *not re-verified*. The permission system refused to let me run espeak-ng (an npm WASM build) to hear test words, so the espeak findings come from its rule files. **Confidence:** high = measured here, or two independent sources; medium = one good source; low = inference. Every Guarani word in these notes was found in at least two independent sources (Apertium's dictionary and the Jojajovai corpus, plus others where noted). No Guarani sentence was composed.

---

## 1. Resource table (most decision-relevant first)

### A. Reader lookups: dictionary and morphology

| # | Resource | Size and quality | Licence | Use in the app | Caveats · confidence |
|---|---|---|---|---|---|
| A1 | **Apertium Guarani–Spanish dictionary** (`apertium-grn-spa.grn-spa.dix`) [25] | 16,975 entries: 5,367 nouns, 4,439 verbs, 3,928 adjectives, 3,061 proper names. 6,585 distinct Guarani noun, verb and adjective lemmas. The puso is written ʼ (U+02BC); nasal vowels are precomposed (measured) | GPL-3.0 | Coverage layer of the lookup dictionary, reviewed in order of word frequency | Built for machine translation: one-word equivalents, no examples. Some pairs are wrong or partial: *purahéi* → «músico» beside «canción» and «cantar»; *upévo* has no Spanish equivalent. Where the entries came from is not documented. · high |
| A2 | **`apertium-grn` analyser** (Kuznetsova & Tyers 2021) [25][26] | Its lexicon (`.lexc` file) has 4,446 nouns, 2,556 verbs, 1,654 adjectives, 459 adverbs, 6,148 proper names and 58 postpositions; HFST two-level rules. Naive coverage is 86 % on Wikipedia and 91 % on the Bible [26] | GPL-3.0 | Build-time lemmatiser and morpheme splitter (kuromoji's role) | Needs lttoolbox, HFST and vislcg3 at build time. It has no browser runtime, and it does not rank ambiguous analyses. · high |
| A3 | **Wiktionary data, extracted by kaikki.org** [24] | English edition: Paraguayan Guarani 1,119–1,144 senses, Mbyá 513. Spanish edition: Guaraní 1,046 senses (2025 extraction), with Spanish glosses (e.g. *ka'aguy* «bosque, monte», *mba'e* «cosa, algo») | CC BY-SA 4.0 + GFDL (Wiktionary's terms; *not re-verified*) | Extra glosses (the Spanish edition's can be used as they are), IPA, etymology | Small. kaikki.org was not reachable from here, so its files are untested. · medium |
| A4 | **Mainumby** (Michael Gasser) [27] | Spanish→Guarani computer-assisted translation, v2.3. Its Python package `kuaa` holds the Guarani lexicon, the morphology FSTs (ParaMorfo) and multiword "groups". The repository is about 327 MB | GPL-3.0-or-later ("Copyleft, 2019, Michael Gasser") | Reference for verb generation and multiword expressions; a test oracle | Server-side Python with no README; where its data came from is not documented. · high for the licence, medium for the content |
| A5 | **ParaMorfo 1.1** (17 Jun 2014) [28][26] | Python 3 analysis and generation of Guarani verbs, nouns and adjectives, "focused mostly on the form generation" [26]. The mirror repository is about 117 MB | Not stated in the mirror's README | Cross-check of A2 | Unmaintained. · medium |
| A6 | **The Academy's *Diccionario de la lengua guaraní del Paraguay*** (DLGP) [31] | Approved Nov 2020; monolingual and synchronic. About 2,000 entries according to Última Hora, against 5,000 planned in 2019 (La Nación; the 2019 project was named *Guarani Paraguái Ñe'ẽryru*, one source). A corrected and enlarged edition followed. It is listed on the SPL's dictionaries page | All rights reserved | Spelling reference for the course authors; link out; ask the Academy for a licence | Not open data. · medium |
| A7 | **Poder Judicial, *Diccionario General Bilingüe*** (2023, PDF) [35] | — | Rights reserved: a dictionary is not a judicial text (§5.1) | Link to it; ask | · medium |
| A8 | **SPL, *Vocabularios del Guaraní al Español*** (datos.gov.py, 12 Nov 2021) [33]; the SPL's 11 free online dictionaries and apps [32]; the government's translator [34] | — | No licence shown; the CKAN mirror sets "open" to false | Ask the SPL (a possible partner); link out | · low |
| A9 | Others: LibreOffice/hunspell `gug-PY` (4,215 words, thesaurus of 904; listed as GPL, but its files carry MPL headers) [30]; GiellaLT `lang-grn` (66 lemmas, maturity "Undefined", LICENSE reads "FIXME": not usable) [29]; the SENATICS translator repository (no licence) and the Sugar Labs dictionary (GPL-2.0, 634 KB) [46] | | | Spell-check tests at most | |

### B. Audio and speech

| # | Resource | Size and quality | Licence | Use in the app | Caveats · confidence |
|---|---|---|---|---|---|
| B1 | **Common Voice Guarani (`gn`)**, Scripted Speech v27.0, 11 Sep 2026 [3] | 33.02 h, of which 5.16 h are validated. 25,864 clips: 4,048 validated, 21,596 still waiting for votes. 314 contributors; 5,894 validated sentences; 684 MB of MP3; average clip 4.6 s. Voices: 46 % women, 33 % men, 20 % unstated; 54 % in their twenties; no accent tags. For comparison, v17.0 (Mar 2024) had 27.56 h, 3.66 h validated and 164 contributors. Guarani has been in the dataset since v7.0 (2021); it is not in Spontaneous Speech v5.0 | CC0 | Data to train and test speech models; optionally a "community voices" listening set from B1 up, after a native speaker checks it | Read crowd-written sentences, recorded on home microphones. Since Oct 2025 the dataset can only be downloaded from Mozilla Data Collective, with an account and its terms [4]. · high |
| B2 | **MMS-TTS Guarani**, `facebook/mms-tts-grn` [7][8] | A VITS model of about 36 M parameters (from a card derived from it [9]), one voice; MMS voices were trained on read religious texts (from the MMS paper, *not opened here*) | CC BY-NC 4.0 ("The MMS code and model weights are released under the CC-BY-NC 4.0 license") [7] | A placeholder in prototypes only | Non-commercial. How well it speaks Paraguayan Guarani has not been evaluated. A third-party copy tagged MIT [9] cannot remove Meta's NC terms. sherpa-onnx documents how to convert it to ONNX [10]. · high for the licence, low for quality |
| B3 | **espeak-ng's `gn` voice** [5][6] | Formant synthesis; rules from 2016 by "ChrisLeo" (Christian Leo M.). Stress falls on the final syllable (`STRESSPOSN_1R`). It maps ã ẽ ĩ õ ũ ỹ, and the legacy â î ô û ŷ, to nasal phonemes. The puso `'` becomes `_!`, a 35 ms pause that is not a glottal stop. **g̃ written as g + U+0303 is not in the rules**: only ĝ (U+011D) and ğ are, both read as `n.`. There is no nasal harmony, and v is read [b]/[β] | GPL-3.0-or-later; the npm WASM build is 18.5 MB, also GPL-3.0-or-later | An emergency "read this aloud" voice, labelled as synthetic | Robotic. Changing g̃ → ĝ and ’ ʼ → ' before synthesis should help (*untested*). The user's own test (it ignored the puso and did not nasalise g̃) matches the rules. · high (rules read) |
| B4 | **Speech recognition** [11]–[18] | No list consulted includes Guarani: Web Speech API, iOS dictation, Gboard voice typing. Whisper has no Guarani language token (its source was checked). Community fine-tunes on Common Voice Guarani report, on their own cards: Whisper-base WER 53.9–58.9 % (CER 12–13 %), Whisper-small CER 9.3 %, wav2vec2 XLS-R-300m WER 39.8–53 %. MMS-1b-all (1 B parameters) lists `grn` | XLS-R Apache-2.0, Whisper MIT; the fine-tunes' licences vary; MMS is CC BY-NC 4.0 | None at launch; research toward checking single words (§4.3) | Not good enough to score speech. · medium (lists seen only in search snippets) |
| B5 | **Commercial Guarani TTS or ASR** [15][18] | None found. Google Translate has handled Guarani text since May 2022; no Guarani speech output was found | — | — | The search was cut short when the budget ran out. · low |

### C. Texts and corpora

| # | Resource | Size and quality | Licence | Use in the app | Caveats · confidence |
|---|---|---|---|---|---|
| C1 | **Vikipetã** (gn.wikipedia.org) [22][23] | About 6,000 articles: 6,034 in a statistics table of unclear date, with 31 active users; older counts give 3,091–4,095 | CC BY-SA 4.0 (Wikipedia's terms; *not re-verified*) | The reader's "add from Vikipetã", like Yaoki's Aozora button | The MediaWiki Action API answers anonymous requests from other web pages when `origin=*` is set [23]. Quality is uneven: stubs, coined words. · medium |
| C2 | **Public-domain literature** (§5.2) | Ortiz Guerrero, E. R. Fernández, Correa, Colmán | Public domain in Paraguay; US status depends on the publication year | Library, C1–C2 | Few digital texts; old spelling |
| C3 | **Official texts** [40][44] | The Constitution (official Guarani translation, 1992), Ley 4251 (bilingual), decrees and rulings in Guarani | Not protected (Ley 1328/98, art. 8), provided the source is cited and the text is left unchanged | Library, C1 | The Spanish text prevails in case of doubt (Constitution) |
| C4 | **Jojajovai** [2] | 30,855 sentence pairs from 8 sources: abc 16,492; spl 4,788; blogs 2,444; seminario 2,179; anlp 2,000; libro_gn 1,423; libro_td 1,016; hackaton 513. The CSV is 16.9 MB. Native speakers checked a sample of 400 pairs: 85 % match fully and 8 % do not match. The abc pairs are mostly Jopara (55 of 75 checked) or *jehe'a* (15); the other sources are mostly standard Guarani | MIT for the compilation, but the texts belong to their owners (ABC Color, blogs, books) | Internal only: word frequencies, tests for the analyser and the normaliser, register examples to paraphrase | Mixed character encodings (§3.1). · high |
| C5 | **FLORES-200 `grn_Latn`** [19] | 3,001 sentences translated from 842 English web articles (dev, devtest and a hidden test split), about 21 words each | CC BY-SA 4.0 | C1 reading snippets; tests of machine translation | Translationese; who translated it is unknown |
| C6 | **Tatoeba** [20][21] | 791 Guarani–Spanish pairs (Tatoeba-Challenge 2023: test 661, dev 130) and 222 English–Guarani | CC BY 2.0 FR (*not re-verified*) | Candidate example sentences | Small; contributors' quality varies |
| C7 | **GUA-SPA** (IberLEF 2023) [36] | 1,500 texts of about 25,000 tokens in all, from news and tweets, each token tagged gn, es, ne or mix | No licence in the repository | Internal tests of a token tagger that tells Guarani from Spanish | — |
| C8 | **AmericasNLP 2021** [37] | Training data: Chiruzzo et al. 2020's news (Jojajovai's abc). Dev and test: the AmericasNLI translations of XNLI (Jojajovai's anlp) | No licence file; XNLI is CC BY-NC 4.0 (*not re-verified*) | Internal only | |
| C9 | Leipzig Corpora `grn` (14,612 sentences, 2017) [39]; JOSA (3,941 Jopara tweets, published as IDs only) [38] | | Leipzig's terms not checked; the tweets fall under Twitter's terms | Word frequencies only | |

### D. Fonts and input (brief: another researcher checks glyph coverage)

| # | Resource | Licence | Note |
|---|---|---|---|
| D1 | Google Fonts: **Andada Pro** (Huerta Tipográfica, "designed to support indigenous languages of Latin America", served by Google Fonts), **Noto Sans** [45]. Yaoki's M PLUS Rounded 1c and Klee One are Japanese faces [1] | OFL 1.1 | g̃ has no precomposed character, so it needs a font with mark positioning, and a subset made with fontTools must keep the `ccmp`/`mark`/`mkmk` features and U+0303 |
| D2 | Keyboard layouts: `huertatipografica/teclado-Guarani` and `giellalt/keyboard-grn` [45] | MIT | Phones' Spanish keyboards have no ỹ or g̃ key, so search and the typing game must accept fallbacks (§3.1) |

---

## 2. What the table means (read first)

1. **Guarani has no JMdict.** What is open is Apertium's GPL lexicon (about 6,600 content lemmas with Spanish equivalents) and about 1,000 Wiktionary senses per edition. The Academy's dictionary is closed. The app needs **its own reviewed glossary**, with Apertium for coverage.
2. **No usable Guarani voice exists.** MMS-TTS is non-commercial and nobody has evaluated it; espeak-ng is robotic and mishandles the puso and g̃. **Every teaching clip must be a native recording** (§6).
3. **Phones cannot hear Guarani.** Yaoki Speaking (the browser's recognition plus matching by sound) has no Guarani recogniser to build on, so speaking practice starts without ASR.
4. **Text normalisation is required.** One corpus writes the same word five ways (§3.1).
5. **The free texts are:** official texts (verbatim), Vikipetã (live, CC BY-SA), and a small public-domain shelf, with a US caution for authors who died after 1945.
6. **Ship only** CC0, CC BY, CC BY-SA, GPL-3.0 and our own material; keep NC material (MMS, XNLI) and all-rights-reserved material out (§7).

---

## 3. Reader lookups

### 3.1 Normalise every text before lookup (measured on Jojajovai's Guarani side)

- **Nasal vowels written with substitute characters**, the legacy of old fonts. Circumflexes: î 6,411, ê 5,172, â 3,023, û 1,464, ô 1,029. Diaereses: ë 1,181, ÿ 846, ï 558, ä 194. These sit beside the proper tilde forms: ẽ 9,266, ĩ 3,008, ỹ 1,043. The word pairs make it plain: *ñe'ê*/*ñe'ë* (121) against *ñe'ẽ* (2,463 with every puso variant); *tetâ*/*tetä* (78) against *tetã* (1,019); *porâ*/*porä* (90) against *porã* (279); *mokôi* (59) against *mokõi* (415); *oî*/*oï* (494) against *oĩ* (361). The ABC subset writes î and ÿ almost everywhere. · high
- **g̃**: *haĝua* (799) against *hag̃ua* (567), so ĝ (U+011D) stands in for g̃ (g + U+0303). · high
- **The puso** comes in five forms: ' (U+0027), ’ (U+2019, 19,608 times), ꞌ (U+A78C, 1,134), ´ (U+00B4, 219) and ʼ (U+02BC, Apertium's choice). espeak-ng adds ʻ (U+02BB). · high
- **Proposed mapping**, to be checked by a native speaker: â ä → ã; ê ë → ẽ; î ï → ĩ; ô ö → õ; û → ũ; ŷ ÿ → ỹ; ĝ ğ → g̃; ’ ʼ ꞌ ´ ʻ → '; then Unicode NFC (g̃ stays two code points). **Leave ü alone**, since Spanish uses it (*itaugüeño* appears in the corpus). espeak-ng's own rules map â î ô û ŷ the same way [5], which supports this reading. Search should also try a second, ASCII-folded pass (*ñe'e*, *hagua*, *g~*) for phone keyboards.

### 3.2 Build the dictionary file the way Yaoki built `jm-1.txt`

1. **The core is the course's own glossary**: every scene word, with a Spanish gloss written for the app, a register tag (`jopara | estándar | guaraniete`, from G7's plan [49]) and a native check. We own it.
2. **Apertium's dictionary for coverage** (A1): rank its 6,585 lemmas by frequency (counted on Jojajovai and Vikipetã) and review them from the top, about 3,000–5,000 before launch. Mark which Spanish glosses come from Apertium. Hide unreviewed entries, or label them «glosa automática».
3. **Wiktionary through kaikki** (A3) for Spanish glosses, IPA and notes on Mbyá or Old Guarani. Keep only senses under the Paraguayan Guarani heading.
4. **Morphology at build time:** run `apertium-grn` over every library text, every course text and the corpus vocabulary, and ship a table from each form to its lemma and morphemes, plus a per-text analysis for the library (as Yaoki does for its library chapters). On text the learner pastes in, the page first looks a word up as written, then normalised, then strips the common person prefixes, the negation circumfix, the tense suffixes and the postpositions (from A2's affix lexicons) and labels the result «análisis probable». Mainumby/ParaMorfo (A4, A5) can generate conjugation tables to check A2 against.
5. **Licence of the file:** anything derived from Apertium is GPL-3.0, so the dictionary file is GPL-3.0. CC BY-SA 4.0 material (Wiktionary) can go into a GPLv3 file (CC lists GPLv3 as one-way compatible with BY-SA 4.0 [47]; *not re-verified*). Publish our own glosses separately under CC BY 4.0 so others can reuse them. The app's code arguably keeps its own licence if the dictionary is a separate data file loaded at run time; list it in `licenses.txt` as Yaoki lists JMdict [1].

---

## 4. Audio, TTS and ASR

### 4.1 Common Voice (B1)
It is useful, but it is no source of teaching models. With only 5.16 validated hours (4,048 clips) and 21,596 clips waiting for votes, validation is the bottleneck [3]. To get it: create a Mozilla Data Collective account, accept its terms, and download the `gn` tarball (684 MB). It contains `validated.tsv`, `validated_sentences.tsv`, `clip_durations.tsv` and the clips [3][4]. The clips are CC0, so they may ship with no attribution; credit the dataset anyway, and never try to identify a speaker. Possible uses: (a) training and testing data for §4.3; (b) at B1 and above, a "voces de la comunidad" set for dictation or "which sentence did you hear?", using validated clips whose transcripts a native speaker has checked.

### 4.2 TTS
- **espeak-ng (B3)** is the only open engine that runs in a browser (npm `espeak-ng`, 18.5 MB of WASM [6]), but it is formant speech: no nasal harmony, the puso turned into a pause, and g̃ missing unless changed to ĝ first [5]. Use it at most as an opt-in «voz sintética» button in the reader, loaded only when tapped (18.5 MB is three times Yaoki N1's 6 MB first download [1]). The audio it produces is generally not covered by the GPL (*not re-checked*), but bundling the engine puts that part of the app under GPL terms. Writing espeak phoneme input ourselves (`[[…]]`) could handle the puso and nasal spreading (*untested*).
- **MMS-TTS (B2)**: the quality is unknown and the NC licence binds the clips. A free app with no ads is arguably non-commercial, but NC would block any later paid tier or sponsorship, and others' commercial reuse of our data. Use it only for internal placeholders (timing screens before the recordings exist), and have a native speaker rate it before deciding anything more.
- **Commercial engines:** none found (B5). **Kokoro** has no Guarani voice (from memory, *not re-checked*); its Spanish voices could read Spanish prompts, but they do not sound Paraguayan.
- **Later:** a permissive voice of our own. The commissioned recordings (§6), with every speaker's separate consent, could train a single-speaker VITS model from scratch, giving output we own. This is why the main voices should record in one consistent setup.

### 4.3 ASR
- **None on phones** (B4). The Web Speech API passes audio to Apple or Google, and neither lists Guarani [16][17]. Confirm on a device with `lang="gn-PY"` (the spec's error code for this is `language-not-supported`, though a browser may simply fail).
- **Open models** are weak for open speech: WER 40–59 % on their own test sets [13][14]. Checking a single known word is an easier task than open recognition: score the learner's audio against the target word's letters with a CTC model (forced alignment). Base it on XLS-R (Apache-2.0) fine-tuned on Common Voice (CC0) plus our recordings, so it stays permissive, rather than on MMS (NC). It runs in a browser through transformers.js or onnxruntime-web [48], but a 300 M-parameter model is heavy for an iPhone. This is research; G6 already rules out auto-scoring speech in the exams [49].
- **"Spanish ear" experiment:** run `es-PY` recognition and match by sound. Expect failures on y [ɨ], nasality and the puso; try it only as a test. · low

---

## 5. Literature and state texts

### 5.1 The law
- **Term: life + 70 years**, counted from the death of the last surviving co-author (Ley 1328/98, art. 47) [40]. The previous law, Ley 94/51, gave life + 50 [40]. Whether the term runs to 31 December of the 70th year was **not confirmed**. Safe rule: a work is free from 1 January of the year after the 70th anniversary of the death. · high for the term, low for the counting rule
- **Official texts are free**: "textos oficiales de carácter legislativo, administrativo o judicial" and their official translations are not protected, **provided the source is cited and the texts are respected** (art. 8) [40]. Ley 4046/2010 amended the law, and the consolidated wording was not seen [40]. Dictionaries, textbooks, news agency stories and SPL materials are not "official texts" in this sense, so they need permission. · medium-high
- **Recordings are protected separately** (Ley 5247/2014, amending arts. 126 and 130): performers for 70 years from the year after fixation, phonogram producers for 70 years from 1 January after first publication [40]. The music has its own term (the composer's life + 70). So **lyrics by a public-domain author may be shown, but recordings and arrangements may not be bundled**. · high
- **US hosting** (GitHub Pages, as for Yaoki [1]): the US restored Paraguayan copyrights on **1 Jan 1996** (URAA) [41]. Under the life + 50 rule then in force, authors who died in **1945 or earlier** were already free in Paraguay, so the US did not restore them. Authors who died from **1946** on had their works first published from **1931** restored in the US, for **95 years from publication**. Works published up to 1930 are free in the US now. · medium; ask a lawyer

### 5.2 Authors

| Author | Dates [42] | Free in Paraguay | US caution | Texts online [43] | Spelling |
|---|---|---|---|---|---|
| Manuel Ortiz Guerrero | 1894 or 1897 – 8 May 1933 (one source: 5 Aug) | since 1984 | none: free before 1996 | individual lyrics: *Panambi verá*; *Nde rendápe aju* (G7) or *Ñe rendápe ajú* (a search snippet), so that title's spelling is unconfirmed. Set to music by J. A. Flores (d. 1972), whose music stays protected | partly old |
| Narciso R. Colmán «Rosicrán» | 1876–1954 | since 1 Jan 2025 | works published from 1931 (e.g. the 1937 edition) until 95 years after publication | *Ocara potÿ* (1917, 1921; the first book of poems in Guarani published in Paraguay); *Ñande ĭpĭ cuéra* (1929; 1937 edition *Ñande ipi güera*; modern *Ñande Ypykuéra*). Not found online in full; studied in a UNL thesis and a 2022 article | his own: c for k, ĭ/ÿ for y |
| Emiliano R. Fernández | 1894 – 15 Sep 1949 | since 1 Jan 2020 | Chaco War songs (from 1932) stay US-protected for 95 years after publication (a song published in 1932 is free in the US from 2028); *Che la reina* (1928, per G7) is free in the US | about 2,000 songs, "only a very small part" published accessibly; most appeared in the magazine *Ocara Poty Cue-mi* (from 1922). Single songs are on portalguarani.com; Chaco texts on W. Lustig's Mainz pages (his notes are his own copyright) | old, Spanish-based |
| Julio Correa | 1890–1953 | since 1 Jan 2024 | plays from 1933 on, if published from 1931: US-protected for 95 years from publication | *Sandía yvyguy* (staged 1933) and about 11–20 plays; no online text found | mixed with Jopara |
| War press, *Cacique Lambaré* (1867–68, all in Guarani) and *Cabichuí* | — | yes | free | an article index at Mainz; few issues survive; a *Cabichuí* facsimile exists in print | 19th-century |

Ruled out: Bible translations (copyrighted) and modern authors such as Zarratea or Delgado (permission only).

### 5.3 Old spelling
The titles above show the problem: c and qu for k (*cuéra*, *Ocara*), gü for gu (*güera*), and ĭ or ÿ for y [ɨ]. The 2015 alphabet came later (G6 [49]). Show each public-domain text twice, **in its original spelling and in a modern version made by a native editor**. The modern version is our own work, so license it CC BY-SA 4.0. Type the texts from scans of public-domain editions. Web transcriptions (portalguarani, Lustig) are for locating texts and checking them, not for copying.

---

## 6. Recording plan (native recordings are required)

**Assumptions:** G7's 260 study days [49]. Each day has 2 grammar points with 2 examples each, a scene of 8 words, and a listening item every other day; there is a 4-clip listening part in each week test, about 15 clips in each level exam, and A1–A2 sound drills (puso, nasal and oral vowels, y, stress). For scale, Yaoki N1 has 1,493 clips (about 52 MB) for one level [1].
"Lean" = each word and its example sentence in one clip. "Full" = the word alone, the sentence alone, and slow takes (re-recorded, not time-stretched) at A1–A2.

| Level | Days | Clips, lean–full | Finished audio (estimate) | Voices |
|---|---|---|---|---|
| A1 | 40 | 770–1,130 (incl. about 200 drills) | about 85–95 min | 2 main (a woman and a man) + 2 for dialogues |
| A2 | 50 | 760–1,210 | about 100–110 min | the same, + 1–2 |
| B1 | 50 | 680–1,130 | about 115–120 min | + 2 (an older speaker, a rural speaker) |
| B2 | 50 | 680–1,130 | about 140 min | + 2 (a young urban Jopara speaker, a radio-style speaker) |
| C1 | 40 | 550–910 | about 130 min | + a newsreader, a speech |
| C2 | 30 | 410–680 | about 110 min | + readers of poetry and theatre |
| **Total** | 260 | **about 3,850–6,200** | **about 11 h** | **8–12 voices** |

These are rough estimates (my own). At about 35 KB per clip, as in Yaoki, the total is about 130–220 MB, stored one unit at a time [1].

- **Process:** freeze the scripts and have a second native speaker check them → record a 50-clip pilot → record under a native director, at 48 kHz/24-bit mono WAV, in one room with one microphone per main voice → a reviewer who is not one of the speakers listens to every clip (puso, nasality, stress, register) → retakes → normalise loudness (around −16 LUFS, a common mobile target; rule of thumb) → MP3 files named by clip id, like Yaoki's (`w.<lesson>.<n>`), each stored with its text, speaker, register tag, speed and take. Allow about 3 studio hours per finished hour plus editing (rule of thumb): about 30–40 studio hours in all. Record A1 first; each later level is recorded before it is released. The screens already run without clips, using Yaoki's silent stand-in (Y1/Y2 notes [49]).
- **Contracts, one per speaker, reviewed by a Paraguayan lawyer:** (1) assignment, or an exclusive worldwide perpetual licence, of the rights in the recordings and the performance (Ley 1328, performers' rights as amended by Ley 5247/2014), covering online and offline distribution, editing, cutting, and future versions of the app; (2) credit by name or pseudonym; (3) a **separate opt-in, separately paid, for training a synthetic voice**; (4) the right to publish the clips under **CC BY 4.0**; (5) consent to process the voice as personal data under the law in force (*law not checked*). Scripts based on CC BY-SA text (e.g. Vikipetã) make their recordings CC BY-SA.

---

## 7. Licensing consequences for a free app

| Licence | Resources | Ship it? | Obligations |
|---|---|---|---|
| CC0 | Common Voice | yes | none (credit as a courtesy; Mozilla Data Collective's terms: never try to identify speakers) |
| CC BY 2.0 FR | Tatoeba | yes | author and link with each sentence (keep the sentence ids) |
| CC BY-SA 4.0 (+ GFDL) | Vikipetã, Wiktionary, FLORES | yes | attribution and a licence link with each text; data files made from them under CC BY-SA 4.0, or GPLv3 [47] |
| GPL-3.0 | Apertium, Mainumby, espeak-ng | yes | data files made from them under GPL-3.0, with their sources; keep espeak-ng.wasm a separate optional file |
| MIT over others' texts | Jojajovai | not verbatim | research use; paraphrase |
| CC BY-NC 4.0 | MMS-TTS and MMS ASR; anything from XNLI | avoid | binds the app and anyone who reuses our data |
| No licence / all rights reserved | the Academy's, the Judiciary's and the SPL's dictionaries and data, GUA-SPA, news, song recordings, modern authors | no | link out, or ask |
| Official texts (art. 8) | laws, decrees, rulings, the Constitution's official translation | yes | cite the source; do not change the text |
| Public domain (life + 70) | Ortiz Guerrero; Colmán, Fernández and Correa for works published up to 1930 | yes | see the US caution in §5.1 |

---

## Recommendations for the app

**The reader's lookups**
1. Ship a normaliser (§3.1) and run it on every text, search and stored item. Store the puso as U+0027 unless the native review chooses ʼ.
2. Ship one dictionary file built as in §3.2: the course glossary first, then reviewed Apertium entries, then Wiktionary senses, with the source marked on each entry. License the file GPL-3.0, and publish our own glosses separately under CC BY 4.0.
3. Run `apertium-grn` at build time over the library and course texts, and ship each text's analysis with it; use affix stripping on pasted text, labelled «análisis probable».

**Listening clips**
4. **Commission native recordings for every teaching clip** (§6): about 3,850–6,200 clips, about 11 h finished, 8–12 voices, two main voices recorded consistently, contracts with an opt-in for synthetic-voice training, and the clips released under CC BY 4.0.
5. Use MMS-TTS only as an internal placeholder, and espeak-ng only as an opt-in reader button labelled «voz sintética», with g̃ → ĝ applied first. Neither may serve as a model to imitate.
6. From B1, optionally add checked Common Voice clips (CC0) as "community voices".

**Speaking practice**
7. At launch, no ASR: the learner records, plays it back beside the native clip (shadowing), and goes through a self-check list (puso, nasal vowel, stress, y), with G6's optional family listener.
8. As research: word-level checking with an XLS-R (Apache-2.0) model fine-tuned on Common Voice and our recordings, run on the device, tested on learners' speech before it shows any score. Do not count on the Web Speech API.

**The reader's library**
9. Shelves: (a) original graded readers written for the app, A1–B2, recorded (the main shelf); (b) public-domain literature (§5.2: Ortiz Guerrero first; Colmán and Fernández for works published up to 1930) in original and modernised spelling; (c) official texts, verbatim and with their source (the Constitution, Ley 4251, decrees and rulings in Guarani); (d) "from Vikipetã", fetched through the MediaWiki API with `origin=*`, cached in the browser, with attribution and the CC BY-SA 4.0 notice on each text; (e) links only to news, radio, songs and the SPL and Academy dictionaries.
10. List every third-party part in `licenses.txt`, as Yaoki does [1]. Ask the Academy, the SPL and the Judiciary for permission; a partnership with the SPL could open up its vocabularies (A8).

---

## Open questions / needs a native speaker

1. The puso: which character the app stores and shows (U+0027, ’ or ʼ).
2. Check the mapping in §3.1, especially ë → ẽ, ï → ĩ and ä → ã, and odd cases such as *ära*.
3. Review Apertium's top 3,000–5,000 glosses (e.g. *purahéi* → «músico»?), and tag coined words against everyday ones (*pumbyry* «teléfono» against what people actually say, *celu*, per G7 [49]).
4. Rate by ear `facebook/mms-tts-grn` and espeak-ng (with g̃ → ĝ): are they intelligible, do they sound Paraguayan, and are they ever acceptable?
5. The register and accent of the main voices (Central or interior; Jopara or standard, item by item).
6. Modern spellings for the public-domain titles and texts (*Ñande Ypykuéra*; *Ocara potÿ*'s modern form is unconfirmed), and the modernised editions themselves.
7. Which Common Voice sentences and clips are good enough for learners (transcript errors, non-Paraguayan sentences).
8. Legal: the wording of art. 8 after Ley 4046/2010; whether the term runs to the end of the year; the US analysis for Fernández, Correa and Colmán; the personal-data clause for voices; and whether NC terms apply to MMS output.
9. Technical: does gn.wikipedia serve plain-text extracts (`prop=extracts`) and answer `origin=*` from an iPhone? Is any Guarani recognition available on current iOS or Android? (Test on a device.)

---

## Hosts not reached (curl and WebFetch both failed)

huggingface.co; kaikki.org; tatoeba.org and downloads.tatoeba.org; Wikimedia (gn.wikipedia.org, dumps, commons, www.mediawiki.org, meta, www.wikidata.org); Mozilla (commonvoice.mozilla.org, datacollective.mozillafoundation.org, www.mozilla.org); Meta (dl.fbaipublicfiles.com, ai.meta.com); aclanthology.org; arxiv.org; apertium.org and its wiki; giellalt.github.io; opus.nlpl.eu; object.pouta.csc.fi; zenodo.org; www.openslr.org; openlanguagedata.org; docs.cloud.google.com (cloud.google.com redirects there); support.apple.com and www.apple.com; support.google.com; learn.microsoft.com; docs.aws.amazon.com; elevenlabs.io; www.narakeet.com; Paraguayan state sites (spl, bacn, pj, csj, datos, paraguay, senatics, mec, cultura, ip and dinapi, all under .gov.py); www.wipo.int (WIPO Lex's S3 bucket returned 403); www.sice.oas.org; www.portalguarani.com; www.staff.uni-mainz.de; www.cervantesvirtual.com; www.gutenberg.org; HathiTrust; bndigital.bn.gov.br; Paraguayan press (lanacion, abc, ultimahora); paraguayologia.com; lexilogos.com; the Leipzig corpus hosts; universaldependencies.org; glosbe.com; SIL, Ethnologue and Glottolog; unicode.org; fonts.google.com; cdn.jsdelivr.net; unpkg.com; codeberg.org; ResearchGate; Academia.edu; core.ac.uk; dialnet.unirioja.es; scielo.org.py; the Indiana University hosts; www.fing.edu.uy; axl.cefan.ulaval.ca; www.fpune.edu.py.
**Reachable:** raw.githubusercontent.com, api.github.com (search; per-repository endpoints are gated), pypi.org, registry.npmjs.org, fonts.googleapis.com, espeak.sourceforge.net, gitlab.com, storage.googleapis.com. The shared WebSearch budget (200 calls) ran out during this task.

---

## References

1. Yaoki README (local): /tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki/README.md
2. Jojajovai: https://github.com/pln-fing-udelar/jojajovai (README, LICENSE, data/jojajovai_all.csv, data/jojajovai_sample_annotations.csv)
3. Common Voice metadata: https://github.com/common-voice/cv-dataset (README; datasets/scripted-speech/README.md, CHANGELOG.md, cv-corpus-27.0-2026-09-11.json, cv-corpus-17.0-2024-03-15.json; datasets/spontaneous-speech/README.md, sps-corpus-5.0-2026-09-11.json)
4. https://mozilladatacollective.com/organization/cmfh0j9o10006ns07jq45h7xk ; https://huggingface.co/spaces/mozilla-foundation/README/blob/main/README.md
5. espeak-ng: https://github.com/espeak-ng/espeak-ng (dictsource/gn_rules, dictsource/gn_list, phsource/ph_guarani, phsource/phonemes, espeak-ng-data/lang/sai/gn, src/libespeak-ng/tr_languages.c, ChangeLog.md, docs/languages.md, COPYING)
6. https://www.npmjs.com/package/espeak-ng (registry metadata: GPL-3.0-or-later; a .wasm of 18.5 MB)
7. https://github.com/facebookresearch/fairseq/blob/main/examples/mms/README.md ; the paper: https://research.facebook.com/publications/scaling-speech-technology-to-1000-languages/ (not opened)
8. https://huggingface.co/facebook/mms-tts-grn ; https://huggingface.co/facebook/mms-tts
9. https://huggingface.co/joselobenitezg/mms-grn-tts
10. https://k2-fsa.github.io/sherpa/onnx/tts/mms.html ; https://huggingface.co/Symmetris-labs/tts-mms
11. https://huggingface.co/facebook/mms-1b-all
12. https://github.com/openai/whisper/blob/main/whisper/tokenizer.py
13. https://huggingface.co/adrianSauer/whisper-base-wer ; https://huggingface.co/adrianSauer/whisper-base-wer-extension ; https://huggingface.co/adrianSauer/whisper-base-cer ; https://huggingface.co/adrianSauer/whisper-small-dv
14. https://huggingface.co/adrianSauer/wav2vec2-wer ; https://huggingface.co/Kghate/wav2vec2-large-xls-r-300m-guarani-colab
15. https://blog.google/products/translate/24-new-languages/ ; https://en.mercopress.com/2022/05/13/google-s-translating-tool-adds-guarani-aymara-and-quechua-to-its-menu
16. https://www.apple.com/ios/feature-availability/ ; https://developer.apple.com/forums/thread/119940
17. https://www.notebookcheck.net/Google-s-voice-typing-now-supports-119-languages.241576.0.html ; https://blog.google/products/search/type-less-talk-more/
18. https://docs.cloud.google.com/translate/docs/languages ; https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages (not reachable)
19. https://github.com/facebookresearch/flores/blob/main/flores200/README.md ; https://github.com/facebookresearch/flores/blob/main/README.md ; https://github.com/openlanguagedata/flores ; https://huggingface.co/datasets/openlanguagedata/flores_plus
20. https://github.com/Helsinki-NLP/Tatoeba-Challenge/blob/master/data/README.md
21. https://tatoeba.org/en/terms_of_use (not reachable; the licence is given from memory)
22. https://en.wikipedia.org/wiki/Guarani_Wikipedia ; https://rising.globalvoices.org/wikipedia-case-studies/vikipeta-wikipedia-in-guarani/ ; https://globalvoices.org/2013/08/26/wikipedia-in-guarani/ ; https://meta.wikimedia.org/wiki/Wikipedia_en_Lenguas_Ind%C3%ADgenas/Casos_de_estudio/Vikipet%C3%A3
23. https://www.mediawiki.org/wiki/Manual:CORS ; https://www.mediawiki.org/wiki/API:Cross-site_requests ; https://phabricator.wikimedia.org/T210790
24. https://kaikki.org/dictionary/index.html ; https://kaikki.org/dictionary/alphabetical.html ; https://kaikki.org/eswiktionary/index.html ; https://kaikki.org/eswiktionary/Guaran%C3%AD/pos-noun/ao--arahaku.html ; https://github.com/tatuylonen/wiktextract
25. https://github.com/apertium/apertium-grn (README, COPYING, apertium-grn.grn.lexc) ; https://github.com/apertium/apertium-grn-spa (README, COPYING, apertium-grn-spa.grn-spa.dix)
26. Kuznetsova & Tyers 2021: https://aclanthology.org/2021.americasnlp-1.9 ; https://www.aclweb.org/anthology/2021.americasnlp-1.9.pdf
27. https://github.com/hltdi/mainumby (LICENSE.txt, setup.py)
28. https://github.com/LowResourceLanguages/hltdi-morphology
29. https://github.com/giellalt/lang-grn
30. https://extensions.libreoffice.org/extensions/guarani-dictionary-and-thesaurus ; https://lists.freedesktop.org/archives/libreoffice-commits/2015-December/107572.html
31. https://www.ip.gov.py/ip/2020/11/05/historico-la-academia-de-la-lengua-guarani-aprueba-primer-diccionario/ ; https://www.lanacion.com.py/pais_edicion_impresa/2019/01/25/elaboran-1er-diccionario-monolingue-en-guarani ; https://www.ultimahora.com/academia-la-lengua-guarani-lanza-nueva-version-diccionario-n2988284 ; https://www.lanacion.com.py/gran-diario-domingo/2025/10/05/dos-lenguas-dos-caminos-una-misma-meta/ ; https://spl.gov.py/es/diccionarios/
32. https://www.ultimahora.com/gobierno-paraguayo-ofrece-diccionarios-de-guarani-espanol-y-otros-recursos-en-linea
33. https://data.amerigeoss.org/en/dataset/vocabularios-del-guarani-al-espanol ; https://www.datos.gov.py/dataset/vocabularios-del-guarani-al-espa%C3%B1ol/resource/5ffa19ec-3363-44cc-a26a-c42bf98dbeef
34. https://www.paraguay.gov.py/traductor-guarani ; https://x.com/Miticpy/status/1298355994288885760
35. https://www.pj.gov.py/descargar/ID3-416_02_diccionario_general_bilingue_dplj_2023_original.pdf (as cited in G6/G7)
36. https://github.com/pln-fing-udelar/gua-spa-2023 ; https://arxiv.org/pdf/2309.06163
37. https://github.com/AmericasNLP/americasnlp2021 ; https://github.com/abteen/americasnli
38. https://github.com/mmaguero/josa-corpus
39. https://curl.corpora.uni-leipzig.de/languages/grn
40. Ley 1328/98: https://www.bacn.gov.py/leyes-paraguayas/908/derecho-de-autor-y-derechos-conexos ; Commons summary (art. 47, art. 8, URAA date), read through a mirror: https://blogs.ashmolean.org/commons.wikimedia.org/wiki/Commons_Copyright_rules_by_territory/Paraguay.html ; art. 8: http://www.sice.oas.org/int_prop/nat_leg/paraguay/L132898a.asp ; https://download.osmand.net/wiki/Commons:Unprotected_works/Americas ; https://www.cibepyme.com/minisites/paraguay/es/propiedad-intelectual/derechos-de-autor/ ; Ley 94/51: https://www.bacn.gov.py/leyes-paraguayas/973/ley-n-94-por-la-cual-se-aprueba-el-decreto-de-ley-n-3642-del-31-de-marzo-de-1951-que-protege-las-creaciones-cientificas-literarias-y-artisticas-y-se-crea-el-registro-publico-de-derechos-intelectuales-br ; Ley 5247/2014: https://www.bacn.gov.py/leyes-paraguayas/2994/modifica-los-articulos-126-y-130-de-la-ley-n-132898-de-derecho-de-autor-y-derechos-conexos ; https://www.wipo.int/wipolex/en/legislation/details/21436 ; Ley 4046/2010 amendment: https://www.wipo.int/wipolex/en/legislation/details/3558
41. https://commons.wikimedia.org/wiki/Commons:URAA-restored_copyrights
42. https://en.wikipedia.org/wiki/Emiliano_R._Fern%C3%A1ndez ; https://es.hispanopedia.com/wiki/Emiliano_R._Fern%C3%A1ndez ; https://en.wikipedia.org/wiki/Manuel_Ortiz_Guerrero ; https://www.biografiasyvidas.com/biografia/o/ortiz_guerrero.htm ; https://www.fhuc.unl.edu.ar/posgrado/wp-content/uploads/sites/8/2018/08/tesis_DH_Villalba-Rojas.pdf ; https://revistas.udec.cl/index.php/atenea/article/download/12615/11571/34882 ; https://revistas.unal.edu.co/index.php/lthc/article/view/102105 ; https://www.biografiasyvidas.com/biografia/c/correa_julio.htm ; https://en.wikipedia.org/wiki/Julio_Correa ; https://dictionnaire.artcena.fr/print/pdf/node/9746
43. https://www.portalguarani.com/409_emiliano_r_fernandez/12092_desengano__cancion_de_emiliano_r_fernandez.html ; https://www.staff.uni-mainz.de/lustig/texte/chactext.doc ; https://www.staff.uni-mainz.de/lustig/guarani/cacique/tabla.htm ; https://en.wikipedia.org/wiki/Lambar%C3%A9_(chieftain) ; https://saber.unioeste.br/index.php/rlhm/article/download/11148/7975/39949 ; https://biblio.co.nz/book/cabichui-periodico-guerra-triple-alianza-escobar/d/1394174284
44. https://www.staff.uni-mainz.de/lustig/texte/guarbibl.doc ; https://www.fpune.edu.py/v2/assets/docs/marcoLegal/leyes/1-%20Constituci%C3%B3n%20Nacional%201992.pdf ; https://www.pj.gov.py/notas/14583-entregan-la-constitucion-nacional-en-idioma-guarani ; https://spl.gov.py/files/legal/Ley%204251%20-%20bilingue.pdf
45. https://github.com/huertatipografica/Andada-Pro ; https://fonts.googleapis.com/css2?family=Andada+Pro (answered from here) ; https://github.com/huertatipografica/teclado-Guarani ; https://github.com/giellalt/keyboard-grn
46. https://github.com/SENATICS/traductor-espanhol-guarani ; https://github.com/richarn/Dictionary-Guarani---Spanish
47. https://creativecommons.org/share-your-work/licensing-considerations/compatible-licenses/ (not opened; from memory)
48. https://www.npmjs.com/package/@huggingface/transformers (Apache-2.0) ; https://www.npmjs.com/package/onnxruntime-web (MIT) ; https://pypi.org/project/sherpa-onnx/ (Apache-2.0) ; https://pypi.org/project/piper-tts/ (GPL-3.0-or-later)
49. Earlier notes (local): /tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/notes/G6-cefr-framework.md ; G7-six-level-syllabus.md ; Y1-plan-state.md ; Y2-lesson-loop.md
