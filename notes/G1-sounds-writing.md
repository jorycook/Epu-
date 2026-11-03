# G1 · Sounds and writing of Paraguayan Guarani for Spanish speakers, and the fonts and keyboards for it

For the agents who write the Guarani lessons (A1–C2) and build the app. Date: 2026-11-03.

**How this was checked (read first).**
- **Web.** Only 3 WebSearch calls were possible before the turn's shared search budget ran out. Nearly every host was blocked (list in §13). So the Academia's own texts (2015 alphabet, 2016 spelling rules, 2018 grammar, 2020 dictionary) and Estigarribia 2020 were **not read**. Only search-result summaries of them were seen [1][2][12].
- **Data used instead** (all from `raw.githubusercontent.com`, analysed with my scripts):
  - Unicode CLDR's Guarani locale [3], and CLDR's copy of the Windows Guarani keyboard [4] with Keyman's port of it [5].
  - PHOIBLE phoneme inventories [6].
  - Apertium's Guarani sound rules [7] and its Guarani–Spanish dictionary [8].
  - Three corpora of real Guarani: AmericasNLP 2021 Guarani–Spanish (26,032 aligned sentence pairs, mostly news) [9]; Common Voice Guarani sentences (5,882) [10]; Mozilla Firefox Guarani localisation (10 files) [11].
- **Fonts** were tested hands-on with fontTools, HarfBuzz and headless Chrome (§12).
- **Confidence marks.**
  - **H**: two independent sources agree, for example the dictionary [8] plus an aligned corpus line [9] whose Spanish side carries the gloss.
  - **M**: one source plus consistent usage, or my own knowledge.
  - **L**: my knowledge only. Do not put L forms in lessons before a native speaker checks them.
- **Where things are.**
  - Scripts: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/fonts-check/scripts/`
  - Outputs (screenshots, counts, the minimal-pair list): `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/fonts-check/out/`
  - Downloaded data: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/fonts-check/dl-corpora/`

## 0. Decisions in one screen

1. **Fonts.**
   - Yaoki's two faces break Guarani. In M PLUS Rounded 1c the tilde of g̃ lands on the next letter, so *ag̃a* reads as "agã". Klee One lacks ỹ and draws U+0303 as a spacing "˜".
   - Use **Nunito** for the interface: rounded, all checks pass. Use **Andika** for Guarani text (Mali if a handwritten feel is wanted).
   - Self-host one subset per weight with Yaoki's `fonts.py`. Do not load Guarani through Google's css2 API: Chrome then draws g̃ in a system fallback font (§12).
2. **Storage.** Unicode NFC; nasal vowels precomposed (ã ẽ ĩ õ ũ ỹ). **g̃ = U+0067 U+0303**: Unicode has no precomposed g̃. **Puso = U+0027**.
3. **Answer checking.** Normalise the puso variants (’ ʼ ´ ‘ `) and the stand-ins (ĝ for g̃; circumflex and diaeresis vowels for nasal vowels). Real texts use all of them (§11). Treat a missing tilde or a missing puso as a real error, because both change meaning (*pyta/pytã*, *ka'i/kái*). Treat accent slips as near misses. The full spec is in §11.3.
4. **Typing.** Every exercise gets an in-app key row: ã ẽ ĩ õ ũ ỹ g̃ ' plus á é í ó ú ý ñ.
   - Windows has a built-in "Guarani" layout (AltGr + vowel gives the nasal vowel; AltGr + g gives g̃) [4][5].
   - Keyman's "Guarani Basic" runs on iPhone, Android, Mac, Windows, Linux and the web [5].
   - Gboard and iOS support could **not** be verified.
5. **Teach these early** (A1 unit 1 already plans them; see G7):
   - y [ɨ] and the six nasal vowels;
   - the puso;
   - **stress falls on the last syllable unless written otherwise**, which is the reverse of the Spanish habit;
   - j, h, ch and initial r are not Spanish sounds;
   - mb, nd, ng at the start of a word.
   - Nasal harmony comes at A2, with the corpus-verified alternations in §6.3.
6. **Two spellings co-exist** for some nasal words: *hag̃ua/haguã*, *ko'ág̃a/ko'ágã*, *og̃uahẽ/oguahẽ*. Teach one (Academia norm to confirm), accept both.
7. **32 minimal pairs** (12 at H) and two triplets for listening drills are in §10, marked H or M.

## 1. The alphabet (Achegety)

- **Count and status.** The Academia de la Lengua Guaraní approved a 33-letter alphabet in November 2015: "33 fonemas y otros tantos grafemas" [1]. The 2016 spelling rules fix the alphabet at 33 letters, the use of the tilde for nasal stress and the written accent on non-nasal words [2]. (H for the count.)
- **Make-up.** 12 vowels; 20 consonants, including the digraphs ch, mb, nd, ng, nt, rr; and the puso.
- **Cross-checks.** CLDR's Guarani exemplar set lists the same letters and adds b c d f q w x z as auxiliary letters for foreign words [3]. A Wikibooks summary lists the nasal vowels and the digraphs MB, NG, NT, and puts the apostrophe last [12].
- **Order. (M)** The order below is the commonly published one, with the puso last. Where nd, ng, nt sit relative to ñ is from memory: confirm it against the Academia's text. There is no CLDR collation for Guarani (`common/collation/gn.xml` does not exist), and `Intl.Collator('gn')` is unsupported in Node: the app needs its own sort key.
- **Letter names. (L, unverified)** Names are usually built as consonant + e (che, ge, g̃e, he, je, ke, le, me, mbe, ne, nde, nge, nte, ñe, pe, re, rre, se, te, ve). Vowels are named by their sound, and the last letter is "puso".

IPA is from PHOIBLE [6]: SAPhon inventory 2084, "Paraguayan Guaraní"; SPA inventory 119 and UPSID 345, "Guarani". Examples come from Apertium's dictionary [8] and are attested in [9]–[11]. The explanations for learners are in Spanish.

| Letra | IPA | Para el hispanohablante | Ejemplo (glosa) |
|---|---|---|---|
| a | [a] | como a | *ára* 'día' |
| ã | [ã] | a nasal: el aire sale también por la nariz, **sin** cerrar con n | *akã* 'cabeza' |
| ch | [ʃ] (SAPhon); [tʃ] (SPA, UPSID) | más bien «sh»; la ch castellana también se oye | *che* 'yo; mi' |
| e | [e] | como e | *heta* 'mucho' |
| ẽ | [ẽ] | e nasal | *ñe'ẽ* 'lengua; hablar' |
| g | [ɣ] | siempre suave, como la g de «agua», también a principio de palabra | *jagua* 'perro' |
| g̃ | [ɣ̃] (SPA, alófono nasal) | la g suave de «agua» con aire por la nariz | *ko'ág̃a* 'ahora' |
| h | [h] ~ [x] | **se pronuncia**: una j suave, aspirada, como la j del castellano paraguayo; nunca muda | *ha* 'y', *heta* |
| i | [i] | como i | *ita* 'piedra' |
| ĩ | [ĩ] | i nasal | *peteĩ* 'uno' |
| j | [dʒ] (SAPhon); [ɟ ~ z̻ ~ j] (SPA) | como la y enfática de «¡yo!» o la j inglesa de «John»; **nunca** la jota castellana | *jasy* 'luna; mes' |
| k | [k]; ku + vocal [kʷ] | c de «casa»; «kua» como «cua» de «cuarto» | *kuña* 'mujer', *kuarahy* 'sol' |
| l | [l] | como l; casi solo en préstamos y nombres | (préstamos) |
| m | [m] | como m | *mitã* 'niño' |
| mb | [ᵐb] | la «mb» de «también», pero en una sola sílaba y también al inicio de palabra | *mba'e* 'cosa; qué', *mbói* 'víbora' |
| n | [n] | como n | *nde* 'tú; tu' |
| nd | [ⁿd] | la «nd» de «onda», también al inicio | *ndéve* 'a ti' |
| ng | [ᵑɡ] | la «ng» de «tengo» | *angu'a* 'mortero; tambor' (glosa por [8] y [9] L5365) |
| nt | [ⁿt] (M: falta en PHOIBLE) | la «nt» de «canto»; sobre todo en el sufijo *-nte* 'solo' | *mante* 'solamente', *upéinte* |
| ñ | [ɲ] | como ñ | *ñande* 'nosotros (incl.)' |
| o | [o] | como o | *óga* 'casa' |
| õ | [õ] | o nasal | *mokõi* 'dos' |
| p | [p] | como p | *po* 'mano', *py* 'pie' |
| r | [ɾ] | **siempre** la r suave de «caro», también al inicio | *ru* 'padre', *porã* 'lindo' |
| rr | [r] | rr de «perro»; solo en préstamos | *vúrro* 'burro', *karréta* 'carreta' |
| s | [s] | como s | *sy* 'madre' |
| t | [t] | como t | *tata* 'fuego' |
| u | [u] | como u; «gu, ku + vocal» = [ɣʷ, kʷ] como en «agua», «cuarto» | *ru*, *upe* 'ese' |
| ũ | [ũ] | u nasal | *pytũ* 'oscuro' |
| v | [ʋ] (SAPhon); [β ~ v] (SPA) | ni la b ni la v castellanas: el labio inferior roza los dientes, sin fricción | *vaka* 'vaca', *yvy* 'tierra' |
| y | [ɨ] | sexta vocal: di «i» y lleva la lengua hacia atrás, hacia «u», sin redondear los labios | *y* 'agua' |
| ỹ | [ɨ̃] | y nasal | *tapỹi* 'choza' |
| ' (puso) | [ʔ] | un corte de la voz entre dos vocales, como en «¡oh-oh!» | *ka'i* 'mono', *mba'e* |

Notes:
- The PHOIBLE inventories differ in analysis. SAPhon lists /mb nd ŋɡ/ but not /m n ɲ/: the plain nasals are presumably treated as nasal variants of the prenasalised stops, and j and ñ as one phoneme. SPA lists j as allophones of /ɲ/ [6]. This is the nasal harmony of §6 seen from the phonology side.
- ch: SAPhon gives [ʃ]; SPA and UPSID give [tʃ]. **Which one the app's audio should model needs a native speaker.**

## 2. Vowels

- **Inventory.** All three PHOIBLE inventories give **12 vowel phonemes**: a e i o u ɨ, and nasal ã ẽ ĩ õ ũ ɨ̃ [6]. (H)
- **Five are Spanish.** a e i o u can be taught as the Spanish vowels.
- **The sixth vowel, y [ɨ].** It is the one with no Spanish model, and it is frequent (*y* 'agua', *yvy* 'tierra', *ky'a* 'sucio', *sy* 'madre').
- **Nasal vowels** are distinctive (pairs in §10). Spanish speakers tend to add an [n] or [ŋ] after the vowel instead of lowering the velum (§9).
- **Falling diphthongs.** Words such as *kái*, *mbói*, *Paraguái* carry the acute on their first vowel, because unmarked stress would fall on the last vowel. Counts: *mbói* 34 aligned uses in [9]; *Paraguáipe* 297 against *Paraguaipe* 0 in [9]+[10]. (H)

## 3. The puso (')

- **Sound and status.** The puso is the glottal stop [ʔ] [6], and the Academia counts it as a letter of the alphabet [1][12]. (H)
- **Where it goes. (H)** In writing it appears **only between two vowels**:
  - Common Voice: 4,472 of 4,474 puso tokens are vowel + ' + vowel.
  - Firefox: 1,731 of 1,732. None is word-initial [10][11].
- **Characters in real texts.**
  - It is written with an apostrophe-like character: U+0027 ', U+2019 ’ or U+02BC ʼ. The letter's own code point would be U+02BC, which CLDR's exemplar set uses [3].
  - CLDR's own strings mix the characters: *avañe’ẽ* with U+2019 next to *koʼẽrõ* with U+02BC [3].
  - Counts for each corpus are in §11.2.
- **What it does.**
  - It separates syllables and is what Spanish speakers drop.
  - Dropping it merges the two vowels and can change the word: *ka'i* 'mono' against *kái* 'quemar(se)'; *po'i* 'delgado' against *poi* 'soltar'; *he'ẽ* 'dulce' against *heẽ* 'sí'.
  - More pairs are in §10.

## 4. Stress and the written accent

Rules R1–R3 were stated in the search summaries of Wikipedia mirrors [13] and of the 2016 rules [2]. Everything else is inferred from corpus counts [9][10][11] and from Apertium's spelling rules [7]. The rules:

- **R1. No mark means stress on the last vowel.** *ha'e* 1,170 tokens unmarked; *jagua*, *kuña*, *aguyje*, *ka'aguy*. (H)
- **R2. Stress elsewhere takes an acute on the stressed vowel.** *óga*, *kóva*, *téra*, *mba'éichapa* (371 against *mba'eichapa* 15), *mbo'ehára* (315 against 4). (H)
- **R3. A stressed nasal vowel carries the tilde, which marks both nasality and stress.** No acute is added: *mitã*, *pytã*, *tetãme* (stress on *tã*). (H)
- **R4. A nasal word with stress on a non-final oral vowel writes both marks.** *térã* 'o' (203 tokens), *ko'ágã* (news spelling of *ko'ág̃a*). (M)
- **R5. Vowels next to m, n, ñ (and mb, nd, ng, nt) are not marked.**
  - Examples: *kuña* 227 against *kuñã* 0; *ñande* 425 against *ñãnde* 0.
  - Writing ~ on every nasal vowel is a learner error. (H for the pattern)
- **R6. Atonic suffixes leave the stress on the stem.** The stressed vowel is now not last, so it takes the acute.
  - Apertium's list of atonic suffixes [7]: -pe/-me, -gui, -re, -ma, -nte, -mi, -kuri, -ta, -ra'e, -ne, -niko, -va, -pa, -icha.
  - Corpus counts (marked form against unmarked):

    | Marked form | Count | Unmarked form | Count |
    |---|---|---|---|
    | *kokuépe* | 5 | *kokuepe* | 0 |
    | *ka'aguýpe* | 15 | *ka'aguype* | 0 |
    | *oguatáma* | 3 | *oguatama* | 0 |
    | *ohóta* | 50 | *ohota* | 0 |
    | *aháta* | 18 | *ahata* | 0 |
    | *ohókuri* | 48 | *ohokuri* | 0 |
    | *ojapóva* | 547 | *ojapova* | 0 |
    | *ojapóvo* | 83 | *ojapovo* | 0 |

  - **This answers G7's open question: -ta is atonic.** (H)
- **R7. Tonic suffixes take the stress, and the stem loses its acute.** *óga* + *-kuéra* gives *ogakuéra* (4 against *ógakuéra* 0). *-se* is tonic: *ojaposéva* 7 against *ojapóseva* 0, as G7's source said for *a-ha-se*. *heta* + *-ve*: *hetave* 118, *hetavéva* 18. (M–H)
- **R8. One written acute per word**, on the main stress. Apertium's rule "change tonal vowel to atonal if tonal in affix" [7] says the same. (M)
- **R9. Within Guarani text the language is *guarani*, unaccented** (140 tokens). Writers in Spanish habits also write *guaraní* (76): Spanish accent rules leaking in (§9).

**For the course:**
- Teach R1 and R2 on day 1 as «al revés del castellano»: in Spanish, an unmarked word ending in a vowel is stressed on the penultimate; in Guarani, on the last syllable.
- Teach R6 and R7 with the first suffixes (-pe, -ta, -kuéra) at A1–A2.

## 5. The nasal tilde, nasal words and what to write

- **The tilde is written once, on the stressed nasal vowel** (R3). Example: *ñe'ẽ*.
- **No tilde next to nasal consonants.** Vowels next to m, n, ñ, mb, nd, ng, nt, g̃ are nasal by position and go unmarked (R5).
- **g̃ exists for words whose nasality sits on the g's syllable.** Two conventions co-exist, with counts across the three corpora:

  | Nasality on g̃ (Common Voice + Firefox) | Count | Nasality on the vowel (news) | Count | ĝ stand-in (news) | Count |
  |---|---|---|---|---|---|
  | *hag̃ua* 'para (que)' | 307 | *haguã* | 2,640 | *haĝua* | 437 |
  | *ko'ág̃a* 'ahora' | 75 | *ko'ágã* | 663 | *ko'áĝa* | 68 |
  | *og̃uahẽ* 'llega' | 41 | *oguahê*, *oguahë* | 216, 400 | | |

  - Apertium's dictionary lists both kinds [8].
  - G7 also met *haguã* in its source.
  - **Which one is the Academia's norm is open** (see Open questions). Accept both.
- **Other g̃ words in [10][11]:** *ag̃aite* 'ahora mismo', *g̃uarã* 'para', *g̃uaig̃ui* (gloss to check).

## 6. Nasal harmony

### 6.1 What it is (M: the literature was not readable here)

- **Source.** Estigarribia's grammar treats nasal harmony in §2.2.3, p. 39 (syllables §2.2.1 p. 35; stress §2.2.2 p. 36) [12].
- **Summary from my knowledge of that literature, to confirm.**
  - A **nasal root** has a nasal vowel or a nasal consonant.
  - Nasality spreads from it **leftwards** across the word, through voiceless consonants. Prefixes therefore take a nasal shape.
  - Some suffixes also agree with a nasal end of the word.
  - mb, nd, ng are the oral shapes of m, n, ñ/ŋ, so prenasalised stops alternate with plain nasals.
- **Lessons rely only on the observable alternations.** Those are verified next.

### 6.2 Rule of thumb for lesson writers (M, fits every count below)

- **Prefixes.** Use the nasal form when the stem has a nasal vowel or a nasal consonant anywhere: *ñamba'apo*, *ñahendu*, *oñembo'e*, *omoñe'ẽ*, *mopotĩ*. Otherwise use the oral form: *jahecha*, *ojehecha*, *ombohasa*.
- **Suffixes -pe/-me and -kuéra/-nguéra.** Look at the **last syllable** of the word.
  - A nasal last syllable takes -me and -nguéra: *tetãme*, *kuñáme*, *guaraníme*, *mitãnguéra*.
  - An oral last syllable takes -pe and -kuéra: *ógape*, *mbo'ehárape* (29 against *mbo'eharáme* 0), and **-pe after -nguéra** (*mitãnguérape* 23 against *mitãngueráme* 0).
- **Exception.** *guaranikuéra* (8; *guaraninguéra* 0) beside *guaraníme* (44). Names and loans may not follow the plural rule. Ask a native speaker.

### 6.3 Verified alternations

Counts are summed over [9]+[10]+[11]. The two independent sources for each row are the corpus counts and Apertium's two-level rules [7].

| Alternation | Use | Oral context (count) | Nasal context (count) | Wrong form (count) | Conf. |
|---|---|---|---|---|---|
| **ja-/ña-** | 1st pl. incl. (verb) | *jahecha* 28, *jaha* 25, *jajapo* 9 | *ñahendu* 3, *ñamba'apo* 4, *ñañe'ẽ* 3, *ñambyasy* 8 | *jamba'apo* 0, *jañe'ẽ* 0, *ñahecha* 0 | H |
| **ñande/ñane** | 1st pl. incl. (possessive) | *ñande ru* 55, *ñande róga* 4 | *ñane retã* 54, *ñane mba'e* 4 | *ñane ru* 0, *ñande retã* 2 | H |
| **nde/ne** | 2nd sg. (possessive) | *nde róga* 6, *nde réra* 3, *nde ru* 9 | *ne ñe'ẽ* 4, *ne memby* 5 | *ne róga* 0, *nde ñe'ẽ* 0 | M–H |
| **je-/ñe-** | reflexive, passive | *ojehecha* 274, *ojejapo* 67, *ojeheka* 10 | *oñembo'e* 32, *oñemoĩ* 8, *ñemoñe'ẽ* 21 | *oñehecha* 0, *ojembo'e* 0 | H |
| **jo-/ño-** | reciprocal | *ojohayhu* 1 | *oñomongeta* 166 | *ojomongeta* 0 | H (*jo-* M) |
| **mbo-/mo-** | causative | *ombohasa* 76, *omboguata* 69, *ombo'e* 23, *ombopiro'y* 7 | *omoñe'ẽ* 3, *mopotĩ* 5, *omongaru* 5, *omoĩ* 8, *omomba'e* 160 | *omohasa* 0, *mboñe'ẽ* 0, *mbopotĩ* 0 | H |
| **nd-…-i / n-…-i** | negation | *ndaikuaái* 33, *ndohechái* 19, *ndaha'éi* 276 | *namba'apói* 8, *noñe'ẽi* 3, *naiporãi* 14 | *ndamba'apói* 0, *naikuaái* 0, *ndaiporãi* 0 | H |
| **-pe/-me** | 'en, a' | *ógape* 45, *ka'aguýpe* 15, *távape* 70 | *tetãme* 487, *mitãme* 18, *kuñáme* 7, *ñúme* 14, *ñe'ẽme* 14 | *tetãpe* 0, *kuñápe* 0 | H |
| **-kuéra/-nguéra** | plural | *ogakuéra* 4 | *mitãnguéra* 85, *tetãnguéra* 22, *kuñanguéra* 161 | *mitãkuéra* 0, *kuñakuéra* 0 | H |
| **tembi-/temi-** | 'lo que se …' | *tembi'u* 'comida' 66 | *temimbo'e* 'alumno' 366 | *tembimbo'e* 1 | H |

- **-gua 'de (lugar)' does not alternate:** *tetãgua* 14, *tetãngua* 0.
- **Do not invent** alternations for other suffixes without checking.

## 7. Syllables

- **Open syllables (M–H).**
  - Native syllables are **(C)V**. The consonant slot can hold a prenasalised stop (mb, nd, ng, nt) or a labialised velar (ku-, gu- + vowel).
  - There are no syllable-final consonants, so every native word ends in a vowel.
  - In Common Voice, about 2.5% of tokens end in a consonant [10]. Those are names, Spanish words and a tokenisation artefact of g̃ (§11.3).
- **Vowel sequences are common.** They come with or without a puso: *ka'aguy*, *kuarahy*, *mba'e*.

## 8. Spanish loanwords

Patterns attested in Apertium's dictionary [8] and in the corpora (M; the Academia's rules for loans were not reached):
- **Adapted loans take Guarani spelling and stress rules.** *kesu* 'queso', *kavaju* 'caballo', *kamisa* 'camisa', *vaka* 'vaca', *asuka* 'azúcar', *arro* 'arroz', *sevói* 'cebolla', *vúrro* 'burro', *karréta* 'carreta'. The spelling changes:
  - c/qu → k;
  - ll → j;
  - b → v;
  - z → s;
  - final consonants dropped.
- **Stress in loans.** Non-final stress is written with the acute (*vúrro*, *karréta*, *arriéro*). The stress of *vaka*, *kavaju*, *mesa/mesápe* (8) needs a native speaker.
- **Unadapted Spanish words and names keep Spanish spelling.** They take Guarani suffixes **after a hyphen**: *potrero-pe*, *Ramiro-re*, *institución-pe*, *Producto-kuéra*. Counts: 6,907 such hyphens in [9] and 66 in [10]. Lessons can use this for mixed (jopara) speech.

## 9. Typical mistakes of Spanish speakers, and fixes

"Evidence" says whether the corpora show the mistake. The fixes are standard pronunciation-teaching techniques, not taken from a Guarani teaching source. A Guarani teacher should confirm them. The Spanish lines are ready to use.

| Error típico | Evidence | Cómo corregirlo | Ejercicio en la app |
|---|---|---|---|
| y leída como i o u (*yta* → «ita») | inference (L) | «Di "i", mantén los labios estirados y lleva la lengua hacia atrás como para "u"» | pares *ita/yta*, *upe/ype*, *kamby/kambu* |
| Vocal nasal con n añadida («pytán») o sin nasalidad (*pytã* → *pyta*) | inference (L) | «Tápate la nariz: en *pyta* no cambia nada, en *pytã* sí. No cierres la boca al final» | *pyta/pytã*, *pytu/pytũ*, *téra/térã* |
| Omitir el puso (*mba'e* → «mbae», *ka'i* → «kái») | inference (L) | «Corta la voz como en "¡oh-oh!"; dos vocales, dos golpes» | *ka'i/kái*, *po'i/poi*, *he'ẽ/heẽ* |
| Acento llano por costumbre (*jagua* → «JA-gua») | inference (L) | «Sin tilde, el acento va al final» | palmadas, «¿dónde está el acento?» |
| Tildes a la castellana (*guaraní* dentro del texto guaraní; olvidar la de *ógape*) | **corpus**: *guaraní* 76 frente a *guarani* 140; *mba'eichapa* 15 frente a 371 | «En guaraní se marca lo que **no** es final» | dictado con R1–R7 |
| j como jota castellana | inference (L) | «Como la y fuerte de "¡yo!"» | escuchar y repetir *jagua*, *jasy* |
| h muda (*heta* → «eta») | inference (L) | «La h suena: un soplo» | *ha*, *heta*, *hendu* |
| ch como «chico» | PHOIBLE shows both [ʃ] and [tʃ] | «Se aceptan [ʃ] y [tʃ] hasta que lo decida un hablante nativo» | (ninguno) |
| r inicial vibrante (*ru* → «rru») | inference (L) | «Siempre la r de "caro"» | *ru*, *réra*, *ára* |
| Vocal de apoyo ante mb, nd, ng («emba'e») o perder la nasal («ba'e») | inference (L) | «Empieza con un zumbido "mmm" y suéltalo en b, todo en una sílaba» | *mba'e*, *ndéve*, *mbói* |
| Tilde nasal de más (*kuñã*, *ñãnde*) | corpus: such forms are 0, so a learner error | «Junto a m, n, ñ no se pone ~» | marcar dónde va la ~ |
| -pe por -me y ja- por ña- | corpus: such forms are 0 | §6.2 | completar con -pe/-me |
| Circunflejo, diéresis o ĝ en lugar de ~ (*peteî*, *oguahë*, *haĝua*) | **corpus**: 20,636 circumflex and 3,550 diaeresis vowels in [9] | enseñar el teclado (§11.1) | aceptar con aviso |
| c, qu, b, ll o z del castellano en palabras adaptadas | inference (M); CLDR lists b c d f q w x z only as auxiliary [3] | «*kesu*, *vaka*, *kavaju*» | dictado de préstamos |

## 10. Minimal pairs for listening drills

**How each pair was checked.**
- Pairs were found automatically in Apertium's dictionary [8]: 114 oral/nasal, 41 y/i, 58 y/u, 30 puso and 42 stress candidates; the full list is `out/minimal-pairs.txt`.
- Many candidates are only spelling variants (*moroti/morotĩ*) and were dropped.
- The kept pairs were checked against the aligned corpus [9]: the Guarani word occurs and the Spanish line carries the gloss.
- Abbreviations:
  - "Ap n": line n of [8].
  - "AN Ln": line n of [9]'s `train.gn` and `train.es`.
  - "CV": attested in [10].
- **H**: dictionary + aligned gloss. **M**: dictionary + attestation without an aligned gloss, or my knowledge. **Record every pair with a native speaker before use.**

**A. Oral or nasal vowel**

| Par | Glosas | Fuentes | Conf. |
|---|---|---|---|
| *pyta* / *pytã* | 'talón; quedarse' / 'rojo' | Ap 1264, 13790 / Ap 1279; AN L3743 'en rojo'; CV | H |
| *pytu* / *pytũ* | 'aliento, respiración' / 'oscuro, oscuridad' | Ap 3464, 4865 / Ap 2405, 11374; AN L3617 'estaba oscuro' | H |
| *tupa* / *Tupã* | 'cama' / 'Dios' | Ap 1652 / Ap 1655; AN L4427 'enviados de Dios'; CV | H |
| *téra* / *térã* | 'nombre' / 'o' (conj.) | Ap 1711 / Ap 141; AN L720 'es el nombre', L140 'un o una joven' | H |
| *porã* / *póra* | 'lindo, bien' / 'fantasma' (also differs in stress) | Ap 9100 / Ap 3514; AN L3356 'del fantasma' | H |
| *hi'a* / *hi'ã* | 'da fruto' / 'parece; desear' | Ap 14535 / Ap 17087; AN L4933 'frutos'; CV *hi'ã* | M–H |
| *ku* / *kũ* | 'ese, aquel' / 'lengua (órgano)' | Ap 10342 / Ap 3801; CV | M |
| *tata* / *tatã* | 'fuego' / 'dureza, firmeza' | Ap 1394 / Ap 4725; *tatã* not in the corpora | M |
| *aky* / *akỹ* | 'verde, tierno' / 'mojado' | Ap 8775 / Ap 9331; no corpus | M |
| *karai* / *karãi* | 'señor' / 'arañar, rascar' | Ap 718 / Ap 13002; AN L2259 'Señor' | M |

**B. y against i**

| Par | Glosas | Fuentes | Conf. |
|---|---|---|---|
| *ita* / *yta* | 'piedra' / 'nadar' | Ap 519 / Ap 13924; AN L2745 'le ordenó nadar' | H |
| *sa'i* / *sa'y* | 'poco, pequeño' / 'color' | Ap 11509 / Ap 1326; AN L974 'poco o mucho', L1024 'colores' | H |
| *mimbi* / *mimby* | 'brillar' / 'flauta' | Ap 10555 / Ap 3275 (Ap also glosses *mimbi* 'flauta'); thin corpus | M |

**C. y against u**

| Par | Glosas | Fuentes | Conf. |
|---|---|---|---|
| *upe* / *ype* | 'ese' / 'pato' | Ap 8714 / Ap 1757; CV both | M–H |
| *aku* / *aky* | 'caliente' / 'tierno, verde' | Ap 9328 / Ap 8775; AN L6352 'cocido caliente' | M–H |
| *kamby* / *kambu* | 'leche' / 'mamar' | Ap 708 / Ap 705; AN L198 'la leche derramada' | M–H |
| *hendu* / *hendy* | 'oír, escuchar' / 'arder' | Ap 12790 / Ap 12792; AN L954 'escucharlo'; CV *hendy* | H |
| *yvytu* / *yvyty* | 'viento' / 'cerro' | Ap 1825 / Ap 1833; AN L672 'viento', L124 'cerros' | H |
| *ku'a* / *ky'a* | 'cintura' / 'sucio' | Ap 829 / Ap 8946; AN L1413 *iky'a* 'está sucio' | M–H |
| *py* / *pu* | 'pie' / 'sonido' | Ap 1243 / Ap 3219; CV | M |
| *ru* / *ry* | 'padre' / 'líquido, jugo' | Ap 5628 / Ap 2982; AN L152 'Padre nuestro' | M |

Triplet: *aku* / *aky* / *akỹ* ('caliente' / 'tierno' / 'mojado').

**D. With or without the puso**

| Par | Glosas | Fuentes | Conf. |
|---|---|---|---|
| *ka'i* / *kái* | 'mono' / 'quemar(se)' | Ap 751 / Ap 14908; AN L387 'quema'; CV *ka'i* | H |
| *po'i* / *poi* | 'delgado, fino' / 'soltar, dejar' | Ap 11141 / Ap 16217; AN L6038 'largo fino'; CV *opoi* | H |
| *mbo'y* / *mboy* | 'collar' / '¿cuántos?' | Ap 988 / Ap 8976; AN L6829 'cuánto'; CV *mbo'y* | H |
| *he'ẽ* / *heẽ* | 'dulce' / 'sí' | Ap 9702 / Ap 12122; CV both | M–H |
| *ku'a* / *kua* | 'cintura' / 'agujero' | Ap 829 / Ap 770; AN L1413 *ikuápa* 'tiene goteras' | M |
| *sevo'i* / *sevói* | 'lombriz' / 'cebolla' | Ap 1330 / Ap 1331; AN L2954 'cebollas'; CV *sevo'i* | M–H |

Triplet: *kua* / *kuã* / *ku'a* ('agujero' / 'dedo' / 'cintura'). *kuã* is attested in AN L17890 "*ndoiporúi ikuã*" = 'no usó el dedo' (M).

**E. Stress position** (rare in Guarani; all M, and none is H)

| Par | Glosas | Fuentes |
|---|---|---|
| *ápe* / *ape* | 'aquí' / 'superficie, lomo' | Ap 12040 / Ap 342–345; AN L6034 'aquí y allá' |
| *tapia* / *tápia* | 'siempre' / 'pared' (préstamo) | Ap 12521 / Ap 3450; AN L28 'siempre' |
| *hai* / *hái* | 'escribir' / 'agrio' | Ap 12713 / Ap 8873; AN L407 'escribió' |
| *jopói* / *jopoi* | 'regalo' / 'separación' | Ap 674 / Ap 2428 |
| *kuéra* / *kuera* | plural, 'ellos' / 'sano, sanar' | Ap 10354 / Ap 16768; CV *jakuera hag̃ua* |

## 11. Typing and Unicode

### 11.1 Keyboards

- **Windows: built-in "Guarani" layout (H).**
  - Facts: KBDGN.DLL, KLID 00000474, from Windows 10. Sources are CLDR's dump of it [4] and Keyman's port, which says it was "imported with permission from the Windows 10 keyboard" [5].
  - Base: the Latin-American Spanish layout (ñ key, ´ dead key, ¿).
  - Nasal vowels: **AltGr + a e i o u y** gives **ã ẽ ĩ õ ũ ỹ** (with Shift, the capitals).
  - g̃: **AltGr + g** gives **g + U+0303** (Shift gives G + U+0303).
  - Dead keys: AltGr + the "+" key (US "]") is the ~ dead key; ~ + vowel gives the precomposed nasal vowels.
  - Puso: the key right of 0 types **U+0027**.
  - How to add it in Settings was not verified, because learn.microsoft.com is blocked.
- **Keyman "Guarani Basic"** (SIL, free) runs on Windows, macOS, Linux, the web, iPhone, iPad and Android [5]. (H)
  - The desktop layout is the Windows one.
  - The touch layout has a ~ key and a ´ key (long-press gives `). Long-press g gives g̃, and long-press n gives ñ. The apostrophe is in the long-press menu of the "." key.
  - This is the one verified way to get every Guarani letter on a phone.
- **Not verified** (search budget exhausted; the vendors' help sites are blocked):
  - whether **Gboard** has a Guarani keyboard or layout;
  - whether **iOS** or **macOS** have one.
  - From memory, to test on devices (L): the Spanish keyboards' long-press offers ã, õ and ñ but not ẽ, ĩ, ũ, ỹ or g̃; and iOS "Smart Punctuation", on by default, turns ' into ’ (U+2019).
  - **So the app must not rely on the system keyboard.**

### 11.2 What real texts contain (my counts)

| Text | ' U+0027 | ’ U+2019 | ʼ U+02BC | ´ U+00B4 | g + U+0303 | ĝ U+011D | nasal ~ (precomposed) | circumflex â ê î… | diaeresis ë ÿ… |
|---|---|---|---|---|---|---|---|---|---|
| AmericasNLP train [9] (mostly news) | 31,188 | 4,939 | 0 | 134 | 0 | 715 | 20,613 | 20,636 | 3,550 |
| Common Voice gn [10] | 3,852 | 82 | 569 | 0 | 444 | 0 | 4,398 | 0 | 0 |
| Firefox gn, 10 files [11] | 111 | 1,868 | 8 | 0 | 322 | 0 | 2,427 | 0 | 0 |
| Apertium dictionary [8] | 6 | 2 | 3,465 | 2 | 10 | 0 | 4,046 | 6 | 39 |

- Every possible puso character occurs.
- The news text writes nasal vowels with a circumflex as often as with a tilde. AmericasNLP's dev set has no tilde vowels at all: 1,296 circumflex vowels.
- ĝ stands in for g̃ (*haĝua*).
- Common Voice also has 12 decomposed vowel + U+0303 sequences and two Greek homoglyphs: ῦ U+1FE6 written for ỹ.

### 11.3 What the app stores and accepts

- **Store.** Use NFC. Nasal vowels are precomposed (U+00E3, U+1EBD, U+0129, U+00F5, U+0169, U+1EF9; capitals U+00C3, U+1EBC, U+0128, U+00D5, U+0168, U+1EF8). Write g̃ as U+0067 U+0303 (NFC keeps it as two code points; tested in Node). Write the puso as U+0027, the project's convention and what the Windows layout types.
- **Code pitfalls (tested).**
  - `/\p{L}/u` and `\w` do not match U+0303, so they split *hag̃ua* into "hag" + "ua". Use `/[\p{L}\p{M}'’ʼ]+/gu` for words.
  - Use `Intl.Segmenter` (granularity grapheme) for letter-by-letter feedback: *ag̃a* is 3 graphemes. Word segmentation keeps *mba'e*, *mba’e*, *mbaʼe* and *ko'ág̃a* whole.
  - `toUpperCase()` gives *AG̃A*.
- **Normalise every typed answer**, then compare with the item's accepted forms:
  1. NFC; trim; collapse spaces; drop final . ! ?; ignore case unless capitals are tested.
  2. Map ’ ʼ ‘ ´ ` ′ ʻ ʹ to ' (U+0027).
  3. Map ĝ to g̃ and Ĝ to G̃, and ῦ to ỹ. Mark these as "variant".
  4. Map circumflex vowels (â ê î ô û ŷ) and diaeresis vowels (ä ë ï ö ü ÿ) to the tilde vowels. Count the answer correct with a note: «se escribe con ~: peteĩ».
  5. Accept the item's listed variant spellings (*hag̃ua/haguã*, *ko'ág̃a/ko'ágã*, *og̃uahẽ/oguahẽ*).
  6. If only acute accents differ, it is a **near miss**: correct for meaning items, an error in dictation and spelling items, with the R-rule shown.
  7. If a tilde is missing or added on a vowel, or the puso is missing or added, it is **wrong**: the meaning changes. Show the minimal pair as the hint.
- **Inputs.** Set `autocapitalize="none" autocorrect="off" spellcheck="false"`, and still normalise as above.

## 12. Fonts (hands-on)

### 12.1 Method

- **Files.**
  - Original files from `raw.githubusercontent.com/google/fonts/main/ofl/…`, downloaded 2026-11-03.
  - The Google Fonts API copies from `fonts.gstatic.com`, at API versions mplusrounded1c v22, kleeone v14, andika v27, nunito v32, baloo2 v23, quicksand v37, lexend v26, atkinsonhyperlegiblenext v7, notosans v42, fredoka v17 and mali v13.
  - Same results from both sources.
- **Checks.**
  - The cmap for ã ẽ ĩ õ ũ ỹ Ã Ẽ Ĩ Õ Ũ Ỹ á é í ó ú ý Á…Ý ñ Ñ ' and U+0303.
  - GPOS `mark` lookups for g + U+0303 and G + U+0303.
  - `ccmp`/`locl` routes.
  - HarfBuzz shaping, measuring where the tilde lands. "dx" is the shift of the tilde's centre from the base letter's centre, as a fraction of the base's width; "gap" is the space between the base's top and the tilde's bottom.
  - Rendering in headless Chrome, with DevTools `CSS.getPlatformFontsForNode` to see which font file drew each cluster.
- **Scripts:** `check_fonts.py`, `gf_subsets.py`, `render_test.js`, `render_probe.js`, `subset_like_yaoki.py`.
- **Screenshots:** `out/row-00.png` (M PLUS) to `out/row-14.png`, and `out/big.png`.

### 12.2 Results

| Font | Precomposed Guarani letters | U+0303 | g̃ (g + U+0303) | G̃ | ʼ U+02BC | Verdict |
|---|---|---|---|---|---|---|
| **M PLUS Rounded 1c** 500/700/800 (Yaoki UI) | all | yes | **no anchor**: tilde 1.6–1.7 base widths to the right, so *ag̃a* reads "agã" | collides with G | yes | fails on g̃ |
| **Klee One** 400/600 (Yaoki text) | **no ỹ Ỹ** | **spacing** "˜" (advance 500) | "g˜" | "G˜" | yes | fails |
| **Andika** 400/700 | all | yes | anchored: dx +6%, gap 7% em | anchored | yes | **passes** |
| **Nunito** (variable 200–1000) | all | yes | anchored: dx +5%, gap 10% em | anchored, with a case tilde | yes | **passes** |
| Baloo 2 | all | yes | no anchor: dx +22% | collides: gap −6% em | yes | fails on g̃ |
| Quicksand | all | yes | anchored: +4% | anchored | yes | passes |
| Lexend | all | yes | anchored: +3% | anchored | yes | passes |
| Atkinson Hyperlegible Next | **lacks ẽ ĩ ũ ỹ Ẽ Ĩ Ũ Ỹ** | yes | anchored | anchored | **no** | partial: Chrome rebuilds the missing letters from base + mark |
| Noto Sans | all | yes | anchored: +1% | anchored | yes | passes |
| Fredoka | **lacks ẽ ĩ ũ ỹ Ẽ Ĩ Ũ Ỹ** | yes | anchored | anchored | **no** | fails: *ĩ* is drawn with the i's dot under the tilde |
| **Mali** 400/700 | all | yes | anchored: −1%, gap 4% em | anchored | yes | passes |

No font has a precomposed or `ccmp` ligature for g̃. Every pass relies on GPOS mark-to-base anchors.

### 12.3 Two traps

1. **Google Fonts css2 split.**
   - The css2 API splits each family into files by `unicode-range`. *g* sits in "latin" and U+0303 in "vietnamese", and ẽ is in "vietnamese" only.
   - So for Nunito, Andika and M PLUS Rounded 1c loaded through css2, **Chrome draws g̃ and G̃ with a system fallback font**: DevTools reports "Liberation Serif (system): 2 glyphs".
   - Precomposed ẽ etc. come out right.
   - Pages that link Google Fonts directly (Yaoki's reader, typing game and design canvas do) show g̃ in a different face. Not tested on Safari.
2. **Self-hosting works.**
   - Yaoki's `fonts.py` keeps `ccmp`, `mark` and `mkmk`. A subset made with its options keeps the g̃ anchors.
   - Measured sizes: Nunito variable 24 KB (all weights in one file), Andika 400 10 KB, Mali 11 KB, Quicksand 18 KB.
   - **Licences.** Andika has the Reserved Font Names "Andika" and "SIL" (its OFL.txt). Under the OFL a subset may count as a Modified Version, so either rename the subset's name records (for example "Ñe'ẽ Text") or check SIL's current OFL-FAQ on subsetting. Quicksand and Lexend also have RFNs. Nunito, Mali and Noto Sans have none.

### 12.4 Recommendation

- **Interface: Nunito**, weights 500/700/800 to mirror Yaoki's M+ weights.
  - It has rounded terminals, so it keeps Yaoki's rounded look.
  - It covers everything, with anchored tildes on g̃ and a separate tilde for capitals, and has U+02BC.
  - One variable file serves every weight.
- **Guarani text: Andika 400/700**, replacing Klee One. Use it for sentences, reading passages, dictation and the alphabet chart.
  - SIL's literacy face: single-storey a and g, as in handwriting, and I, l, 1 distinct.
  - Its tilde is large and high (gap 7% em), so nasal vowels stay readable at small sizes.
  - It anchors marks on any base.
- **If the team wants Klee One's hand-drawn feel, use Mali.** It passes every check, but its tilde on g̃ sits tight (gap 4% em).
- **Keep M PLUS Rounded 1c only if** it is patched with a GPOS anchor for g/G (fontTools feaLib). Simpler not to.

## 13. Hosts I could not reach

- **WebFetch** (DNS refused): discovery.ucl.ac.uk, learn.microsoft.com.
- **curl** (proxy 403): library.oapen.org, directory.doabooks.org, www.uclpress.co.uk, ebooks.mpdl.mpg.de, oalib-perpustakaan.upi.edu, www.jstor.org, muse.jhu.edu, www.scienceopen.com, books.openedition.org, www.semanticscholar.org, core.ac.uk, www.wikiwand.com, ipfs.ssi.eecc.de, kwx.liehendr.com, cavac.at, www.ultimahora.com, www.lanacion.com.py, www.bacn.gov.py, www.mec.gov.py, www.cultura.gov.py, revistas.uni.edu.py, dialnet.unirioja.es, www.redalyc.org, ri.conicet.gov.ar, support.google.com, support.apple.com, keyman.com, www.unicode.org, www.omniglot.com, phoible.org, glottolog.org, www.scielo.org.ar, scielo.isciii.es, www.scielo.br, www.academia.edu, www.researchgate.net, www.ateneoguarani.edu.py, www.spl.gov.py, es.wikibooks.org, www.rae.es, www.duolingo.com.
- **GitHub API** (`gh api repos/google/fonts`): "GitHub access to this repository is not enabled for this session".
- **WebSearch:** the per-turn budget (200 calls shared by all agents) was used up after 3 calls.
- **Reachable:** raw.githubusercontent.com, fonts.googleapis.com, fonts.gstatic.com, pypi.org.
- **What to allow next.** Allowing discovery.ucl.ac.uk (Estigarribia 2020) and the Academia's or SPL's sites would let §1, §4–§7 be checked against the norm.

## 14. Sources

1. ABC Color (via search summary): alphabet approved by the Academia in Nov 2015, 33 phonemes and graphemes. https://www.abc.com.py/espectaculos/literatura/publican-en-paraguay-la-primera-gramatica-oficial-del-idioma-guarani-1731069.html
2. Última Hora (via search summary; the page's date is unclear): the Academia's *Reglas ortográficas*, with 33 letters, the tilde for nasal stress and the accent on non-nasal words. https://www.ultimahora.com/academia-presentara-hoy-las-reglas-ortograficas-del-guarani-n1022022
3. Unicode CLDR, Guarani locale (exemplar characters; strings). https://raw.githubusercontent.com/unicode-org/cldr/main/common/main/gn.xml
4. CLDR release-38, Windows Guarani keyboard. https://raw.githubusercontent.com/unicode-org/cldr/release-38/keyboards/windows/gn-t-k0-windows.xml
5. Keyman "Guarani Basic" (SIL): https://raw.githubusercontent.com/keymanapp/keyboards/master/release/basic/basic_kbdgn/README.md ; source/basic_kbdgn.kmn ; source/basic_kbdgn.keyman-touch-layout (same folder)
6. PHOIBLE data, inventories 2084 (SAPhon), 119 (SPA), 345 (UPSID). https://raw.githubusercontent.com/phoible/dev/master/data/phoible.csv
7. Apertium Guarani two-level rules. https://raw.githubusercontent.com/apertium/apertium-grn/master/apertium-grn.grn.twol
8. Apertium Guarani–Spanish dictionary (line numbers as downloaded 2026-11-03). https://raw.githubusercontent.com/apertium/apertium-grn-spa/master/apertium-grn-spa.grn-spa.dix
9. AmericasNLP 2021 Guarani–Spanish data. https://raw.githubusercontent.com/AmericasNLP/americasnlp2021/main/data/guarani-spanish/train.gn ; …/train.es ; …/dev.gn
10. Common Voice Guarani sentences. https://raw.githubusercontent.com/common-voice/common-voice/main/server/data/gn/sentence-collector.txt
11. Mozilla Firefox Guarani localisation (browser.ftl, preferences.ftl, newtab.ftl, appmenu.ftl, menubar.ftl, aboutPrivateBrowsing.ftl, protections.ftl, sidebarMenu.ftl, aboutAddons.ftl, textActions.ftl). https://raw.githubusercontent.com/mozilla-l10n/firefox-l10n/main/gn/
12. Search summaries: Estigarribia 2020, *A Grammar of Paraguayan Guarani* (UCL Press, CC BY 4.0, DOI 10.14324/111.9781787352872; table of contents only), https://discovery.ucl.ac.uk/10107709/1/A-Grammar-of-Paraguayan-Guarani.pdf ; Wikibooks, orthography (mirror), https://kwx.liehendr.com/content/wikibooks_en_all_maxi_2021-03/A/Guarani/Orthography_and_pronunciation ; 33-letter achegety with the puso, https://es.scribd.com/document/638530465/Untitled
13. Search summary of Wikipedia mirrors on the tilde and accent rules: https://wikiwand.com/en/Guarani_language ; https://cavac.at/cavacopedia/Guarani%20language
14. Google Fonts: `https://fonts.googleapis.com/css2?family=<Family>` (css2 API) and `https://raw.githubusercontent.com/google/fonts/main/ofl/<family>/` (files and OFL.txt). Google's language data for Guarani: https://raw.githubusercontent.com/googlefonts/lang/main/Lib/gflanguages/data/languages/gn_Latn.textproto (puso as U+02BC; its sample text has typos, so do not reuse it).
15. Yaoki font build: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki/yaoki-app/fonts.py`, `fetch-fonts.sh`.

## Recommendations for the app

1. **Fonts.** Nunito for the interface and Andika for Guarani text, as self-hosted subsets via `fonts.py`; add U+0303 and U+02BC to its character list explicitly. Rename the Andika subset or confirm SIL's position. Never ship Guarani with Klee One or unpatched M PLUS Rounded 1c. Add a build check that shapes "g̃ G̃ ỹ Ỹ ẽ" and fails when U+0303 has no anchor; `check_fonts.py` already does this.
2. **Character bar.** Every typing field gets a key row: ã ẽ ĩ õ ũ ỹ g̃ ' plus á é í ó ú ý ñ. The g̃ key inserts g + U+0303.
   - A1 unit 1, lesson 5 ("teclear") teaches the bar first. It then shows the Windows layout (AltGr) and Keyman for phones.
   - It does not promise Gboard or iOS support until someone has tested it.
3. **Answer checker** as in §11.3. Store per item: accepted forms, variant spellings, and which differences are errors in that item's skill (meaning, spelling or dictation).
4. **Content conventions for lesson writers.** NFC; ' for the puso; g̃ as g + U+0303; stress and tilde by R1–R8; nasal harmony only from the §6.3 table. One spelling per word (pick between *hag̃ua* and *haguã* once the norm is confirmed), with the other listed as accepted.
5. **Pronunciation strand (A1–A2).**
   - Order: y; the nasal vowels; the puso; final stress; j, h, ch, r; mb, nd, ng, nt; g̃. Then nasal harmony.
   - Drills: the §10 pairs as same/different, which-one and dictation items. Use H pairs first; M pairs only after a native speaker confirms them.
6. **Audio.** Record every minimal pair with a native speaker; text-to-speech should not be trusted for the puso or nasal vowels. Confirm ch [ʃ] or [tʃ].
7. **Sorting.** Write a custom Guarani collation (§1) for the glossary and the alphabet chart.

## Open questions / needs a native speaker

1. **Alphabet order and names.** The official order (where nd, ng, nt sit relative to ñ; the puso last) and the letter names (§1). These need the Academia's Achegety text.
2. **The g̃ and nasal spelling norm.** Is the Academia's norm (2016 rules, 2020 dictionary) *hag̃ua* or *haguã*, *ko'ág̃a* or *ko'ágã*, *og̃uahẽ* or *oguahẽ*? Gloss of *g̃uaig̃ui*?
3. **ch:** is it [ʃ] or [tʃ] in standard Paraguayan speech, and which should the app model? The written h: [h] or [x]?
4. **Pairs still at M.** Confirm, and record, the M pairs:
   - *tata/tatã*, *aky/akỹ*, *karai/karãi*, *ku/kũ*;
   - *ype*, *kuã*, *ku'a/kua*, *sevo'i/sevói*, *mimbi/mimby*, *ru/ry*, *py/pu*;
   - all the stress pairs (§10 E).
5. **Stress of adapted loans.** *vaka*, *kavaju*, *kamisa*, *mesa* (*mesápe*).
6. **Limits of nasal harmony.** *guaranikuéra* beside *guaraníme*: do names and loans keep the oral plural? Which other suffixes alternate?
7. **The Academia's rules for unadapted Spanish words.** The hyphen before suffixes (*potrero-pe*), italics, accents.
8. **The Academia's puso character** in its digital texts: U+0027, U+2019 or U+02BC?
9. **Device tests.** Gboard (Guarani in the language list?); iOS and macOS long-press sets; iOS Smart Punctuation inside the app's inputs; backspace over g̃ (deletes the tilde only, or both?); Safari with the css2 split.
10. **Spanish speakers' errors.** Teacher confirmation of the errors and fixes in §9, which are inferred.
