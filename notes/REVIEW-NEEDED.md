# What still needs a native speaker

Every Guarani string in this design was checked by two independent reviewers (spelling and morphology; meaning, Spanish
and answer keys), against the research notes and real Guarani text (Common Voice sentences, the AmericasNLP and Jojajovai
corpora, Firefox, MediaWiki and LibreOffice localisations, Apertium's dictionary), and a blind solver answered every
question without the keys: for unit 1 and the extras 101 of 103 agreed (the two others had no passage in the export and
were confirmed right); for units 2, 3 and 4 all 92 of each unit agreed, and four questions were rewritten after that
(they are named below). What follows could not be settled that way. A native teacher, ideally with the Academia de la
Lengua Guaraní's 2016 spelling rules and its dictionary at hand, should rule on it before the lessons ship.

The sections from «Settle first» to «Everything the reviewers listed» are about A1 unit 1 and the extras. Units 2, 3 and
4 come after them: first what touches more than one of the three, then a section for each unit. The last section,
«Entre unidades (1 a 4)», is what the cross-unit reading of the four units left open; where it says that a line above
is out of date, it is the one to follow.

## The mascot's name (before anything ships)

The first mascot, the armadillo Tatu'i, was dropped because *tatu* is Paraguayan vulgar slang for "vagina". Its
replacement is **Kaguare**, the southern tamandua, "el oso melero" (notes G8). Three independent screens found no vulgar
or sexual sense of *kaguare*, but spoken slang does not always show up in writing, and that is how *tatu* got through.
Before the name ships, put the ten questions of G8 §5 to several urban Paraguayans aged 18 to 35 and to a Guarani
teacher. They cover: the first thing the name brings to mind; the joke friends would make with it; any sexual,
body-part or insulting sense; *tĩkaguare* ("kaguare-nose"); the "perezoso" gloss; the sound-alike *cagaré*; songs, memes
and nicknames; *oso melero*; the spelling and stress ka-gua-RE; and a control question on *tatu*.

## Settle first (they touch several files)

1. **Héẽ** ('sí'): the course writes Héẽ everywhere (Firefox, Common Voice); the corpora also have heẽ. If the norm is heẽ,
   change it in days 4, 6 and the week test together.
2. **-gua is tonic** (Paraguaigua, as SPL and Apertium write it; ABC Color writes Paraguáigua). The unit follows SPL.
3. **Argentina-gua** with a hyphen after an unadapted Spanish name is usage, not a confirmed Academy rule.
4. **Aireal verbs**: day 4 splits reikuaápa as rei- + kuaa + -pa (the school analysis); day 1 leaves reiko unsplit.
   Choose one analysis before A1 unit 5 teaches ai-/rei-/oi-.
5. **g̃ and spacing in Tereg̃uahẽ porãite** (newspapers write Tereguahẽ; Common Voice joins the two words).
6. **The puso pairs** for listening: confirm and record ka'i/kái (also a stress difference), po'i/poi, mbo'y/mboy,
   sevo'i/sevói; and pyta 'talón' (only Apertium gives the noun sense).
7. **Weekday names**: sources disagree on Sunday-first and Monday-first; the app shows Spanish day names until the
   Academia's list is confirmed.

## Composed lines to confirm

Built from attested parts but not found as such: Jajotopáta ko ka'aru; Iporã, ha peẽ?; Ha mbo'ehára?; Ha'ekuéra
Paraguaigua; Aguyje ndéve (attested only inside longer lines); peñe'ẽ / peñe'ẽpa / oñe'ẽpa; Ko'ẽrõ ka'aru oĩta y;
Ag̃uahẽma che rógape; Ko árape ndahái amba'apo, che sy hasýgui; Peñongatu y ko árape; Rehosépa chendive?; the reader's
amomaitei che sy ha che rúpe (-pe on the last person only); Mbo'ehára héra Rosa (noun + héra + name).

## Interface words

The interface Guarani comes only from real localisations, each with a confidence mark (brief/BRIEF-design.md §6). Medium:
Jepo (saltar), Aranduchauka (examen), Jeku'e (progreso), ¡Eku'e péicha!, ¡Vy'apavẽ! (Firefox for Android writes
¡Vy'apavẽmante!). No attested word exists for racha, sello, pista, cuaderno, gramática, vocabulario, pronunciación,
mediación, unidad, nivel or constancia: they stay Spanish until a native speaker coins or confirms them. The name Epu'ã
and the mascot's name Kaguare need a native and a trademark check (for Kaguare, the questions in G8 §5). The proverb "Ho'a pokõi jey, opu'ã poapy jey" is composed
and is on no screen.

## Everything the reviewers listed


- [a1u01-d1] Jajohecha / Jajoecha / Jajuecha peve: I removed it from day 1 without settling the spelling. Unit-test item a1u01t.2's explain (u01-test.json l.14, not my file) still says 'hasta la vista es Jajohecha peve'; that file's fixer should drop the clause or change the spelling once a native speaker or the Academy dictionary confirms it.
- [a1u01-d1] reiko: day 1 now glosses it unsplit, but u01-d4.json still splits re- + iko (lines 51/61) and builds re + ikuaa + pa. One analysis (re-+iko or rei-+ko) has to be chosen before A1 U5.
- [a1u01-d1] Same false syllable rule elsewhere: u01-d5.json l.36 ('Sin tilde, una palabra guaraní lleva el acento al final...') should say 'última vocal'. u01-d2.json calls ~ just 'tilde' and should say 'tilde nasal (~)'.
- [a1u01-d1] Composed Guarani a native should confirm: 'Jajotopáta ko ka'aru' (parts attested: ko ka'aru in AN and CV); replying to 'Jajotopáta' with 'Jajotopáta' (new p2 connect row, also used by test item a1u01t.13); and that the distractors 'Iporã, ha che?', 'Iporã, ha maitei?' and 'Mba'éichapa, ha nde?' are clearly wrong.
- [a1u01-d1] Analyses at confidence M: -icha atonic (mba'e + -icha + -pa), and topa as an established loan meaning 'encontrar' (Apertium).
- [a1u01-d1] The sound pairs ka'a/ka'i, pira/pire, pire/piru and po/py are checked in the dictionary but not in G1 §10. Record them with a native speaker; the y in py especially.
- [a1u01-d1] Drill d6 and exam e3 now build the same word (ja + jo + topáta) in different sentences. Day 1 has no third safe build: a 4-tile split allows taja-jo-topa, and the obvious sentence builds allow two orders.
- [a1u01-d2] peñe'ẽ (new p2 example «Peẽ peñe'ẽ guaraníme.» and d4 option «Peẽ peñe'ẽ»): 0 tokens in ANLP, CV and Jojajovai. It rests on Wiktionary's conjugation table and on pe- keeping its shape before nasal roots.
- [a1u01-d2] d6 «Iporã, ha peẽ?»: «ha nde» swapped for «ha peẽ»; no hit in the corpora or on the web. Also «Vicente ha Teresa:» as one speaker label, with two people asking «Mba'éichapa reiko?» together.
- [a1u01-d2] Reading «Ore roñe'ẽ guaraníme: che, che sy ha che ru.»: a list after a colon following the verb has no parallel in the corpora.
- [a1u01-d2] pyta «talón; quedarse» (4th sound pair): only Apertium gives the noun sense; the corpora have the verb. A native should confirm «talón», or drop the pair.
- [a1u01-d2] New ja-/ña- connect row: «verbo nasal» is not defined on day 2 (nasal harmony is A2). Please check that it reads clearly.
- [a1u01-d3] -gua stress: Paraguaigua follows SPL and Apertium, but ABC writes paraguáigua, távagua and tendágua. A native speaker or the Academy text should confirm that -gua is tonic.
- [a1u01-d3] Mbo'ehára héra Rosa / Temimbo'e pyahu héra Karina: the noun + héra + name pattern is attested in usage, but teachers may prefer the textbook noun-possessor form (mbo'ehára réra Rosa).
- [a1u01-d3] 'Ha mbo'ehára?' (c1) is a composed follow-up and is not attested as such.
- [a1u01-d3] Argentina-gua with a hyphen is usage, not a confirmed Academy rule. Argentina-ygua is also attested; accept both if an item is ever typed.
- [a1u01-d3] d5 and e3 accept only 'Mba'éichapa nde réra?'. Would a native speaker also accept 'Nde réra mba'éichapa?'
- [a1u01-d3] u01-d4.json skill.es should become 'Comprensión de puntos clave' to match d3.
- [a1u01-d4] Héẽ vs heẽ/hẽe: the Academy spelling is still unconfirmed (WebSearch found nothing). Héẽ implies stress on the first e. If the norm is heẽ, every Héẽ changes in d4, d6 and the week test.
- [a1u01-d4] d3: «Mba'éichapa» is the new wrong option. A native should confirm that «Mba'éichapa ovale ko kesu?» cannot pass as «¿a cómo está este queso?». It has 0 corpus hits.
- [a1u01-d4] sevo'i «lombriz» / sevói «cebolla» needs a native recording. The meaning of sevo'i rests on Apertium and corpus context only, with no aligned gloss. Its stress (sevo'i on the i, sevói on the o) is inferred from rules R1/R2.
- [a1u01-d4] ka'i / kái: confirm that kái means «quemar(se)» and that its stress is on the a, then record the pair.
- [a1u01-d4] Aireal verbs: d4 now uses the school analysis (rei- + kuaa). The U5 author must present ai-/rei-/oi- the same way, or the d5 tiles must change. Confirm that «Con verbos como kuaa, «vos» es rei- y no re-» is acceptable at U1.
- [a1u01-d4] Prices: «se suelen decir en castellano» has support in G5 §3.6, but G2 §4 found no source on spoken usage. Is «Diez mil» natural in a Guarani conversation at a market stall?
- [a1u01-d4] Confirm that the Academy teaches the split ma-ndi-'o, with nd as one letter.
- [a1u01-d4] Not in my file: extra/speaking.json still has [po'i, poi] marked «puso» (same opói/opoi doubt) and [ka'i, kái]. The u01-d6 sound pairs have ka'i/kái without a note that the stress changes.
- [a1u01-d4] The new d6 is a 2-tile word build (mboy + pa). The order is forced but easy: the item mainly teaches the accent that appears in full (mboýpa).
- [a1u01-d5] 'Aguyje ndéve' on its own (p1 example, the d5 and e1 answers) is attested only inside longer lines (Common Voice 'Aguyje ndéve katu.', 'Aguyjémante ndéve.'). Please confirm it sounds natural without katu or mante.
- [a1u01-d5] 'Ikatúpa aporandumi ndéve peteĩ mba'e?' is word for word from Common Voice, but has no Spanish gloss there. The gloss «¿Te puedo preguntar una cosa?» and '-mi = más suave' are mine (and G5's).
- [a1u01-d5] -ve in ndéve and -pa in Ikatúpa are taught as atonic, so the stem keeps the stress and takes the accent mark. For -ve this rests on G2 at confidence M (Apertium plus corpus).
- [a1u01-d5] Cheñyrõmi is split as che- 'me' + ñyrõ 'perdonar' + -mi, glossed «perdoname» (unchanged from before).
- [a1u01-d5] Spacing: Common Voice writes 'Tereg̃uahẽporãite' joined; the app teaches it as two words, as Jojajovai libro_gn does. Please confirm the norm.
- [a1u01-d5] Tereré custom: the sources say «gracias». Do people speaking Guarani in a ronda use aguyje the same way?
- [a1u01-d5] ka'ay 'se toma caliente': one web page says ka'ay can also be cold. Please confirm.
- [a1u01-d5] Outside my file: day 6 r1's passage still has the unconfirmed 'Iporã, aguyje.'
- [a1u01-d5] Outside my file: day 6 e3 is the same ikatu+pa build as the new day 5 e3, only in a different frame.
- [a1u01-d5] Outside my file: extra/exam-a1.json writes «chipas» and «una chipa», while days 4 and 5 write «chipá».
- [a1u01-d6-test] Héẽ: the spelling of 'sí' has no settled norm (G2 says «por normar»). Corpus: héẽ 89 tokens, heẽ 8, hẽẽ 3, hẽe 1. Kept Héẽ in all days. If the Academia's dictionary gives heẽ, change every day together.
- [a1u01-d6-test] Paraguaigua: SPL, the seminars and Apertium treat -gua as stressed; ABC Color and the hackathon subset do not (Paraguáigua). The unit writes Paraguaigua. G2 §2.3 still lists -gua as unstressed with paraguáigua and needs a fix. Later lessons should write Paraguaipegua and upepegua.
- [a1u01-d6-test] Ha'ekuéra Paraguaigua (d6.d1) is composed. The pattern pronoun + place-gua is attested (Che Paraguaigua, Ore Alemaniagua), but not with ha'ekuéra. Also confirm that bare ha'e is safely wrong for a plural.
- [a1u01-d6-test] peñe'ẽpa (t.13) and oñe'ẽpa (d6.d5, t.11) are regular but not in the corpora. pe- does stay pe- before nasal stems (peñeha'ã, pemoñe'ẽ are attested).
- [a1u01-d6-test] «Che sy.» as Ana's bare answer when showing a photo (t.5, replacing Ha'e che sy): is it natural?
- [a1u01-d6-test] «Héẽ, che Vicente» for 'Sí, soy Vicente' (compare form): confirm it sounds natural.
- [a1u01-d6-test] karai Juan rendered as «don Juan» (t.2).
- [extras-exam-placement] pl.5 'Ko árape ndahái amba'apo, che sy hasýgui.' is composed. Causal -gui after a clause with its subject first follows 'ára ivaígui' (ABC), and hasýgui is attested only in ABC. Is it natural, or would a speaker say 'che sy hasy rupi'? ndahái itself has only 2 hits (jj:anlp).
- [extras-exam-placement] P3 'Ko'ẽrõ ka'aru oĩta y.' is composed: 'ko'ẽrõ ka'aru' has no hits, though its twin 'ko'ẽrõ pyhareve' is in SPL.
- [extras-exam-placement] pl.3 'Ag̃uahẽma che rógape.': ag̃uahẽma has no hits (og̃uahẽma 5, ag̃uahẽ 8), and the g̃u/gu spelling is still open (G1 §5).
- [extras-exam-placement] Unchanged forms that are regular but have no hits: 'Peñongatu y ko árape' (pe- imperative, compare peju, peñeha'ã) and 'Rehosépa chendive?' (formed like rehoséramo).
- [extras-exam-placement] Level, not Guarani: in pl.3, pl.4 and pl.5 a learner can still rule out the wrong options with A1 knowledge (-ta, che sy), so the A2/B1 form is in the text but does not alone decide the answer. A reviewer may want distractors that turn on -ma or -gui.
- [extras-reader-speaking-typing] pyta 'talón' comes only from Apertium line 1264 and an unsigned Scribd list. Jojajovai has no aligned line, and two WebSearches found nothing for 'talón'. They confirmed only pytã 'rojo' (for example the [Wiktionary Swadesh list](https://en.wiktionary.com/wiki/Appendix:Guaran%C3%AD_Swadesh_list); also [Wiktionary pytũ](https://www.wiktionary.com/wiki/pyt%C5%A9)). The verb sense 'quedarse' is safe. Days 2 and 6 (not my files) gloss it "talón" only, and day 2's note says «pyta es «talón»». Their owners should change these to match.
- [extras-reader-speaking-typing] tapỹi 'choza' is M: there are dictionary entries and Common Voice uses, but no aligned gloss. Is 'choza' the best Spanish here, or would Paraguayan 'rancho' be better? Day 2's note uses «choza» too.
- [extras-reader-speaking-typing] ka'i/kái also differ in stress and in number of syllables. A native speaker should confirm a cleaner third puso pair (he'ẽ/heẽ and sevo'i/sevói are only M–H).
- [extras-reader-speaking-typing] tereg̃uahẽ porãite: the Academy's norm for g̃ (g̃uahẽ or guahẽ) and for the spacing (Common Voice joins the two words) is still open. The typing board does not read the accept list yet.
- [extras-reader-speaking-typing] kái: day 6 glosses it 'quemar', while day 4 and speaking.json say 'quemarse'. It is intransitive (J:abc 'Okái ñu' = 'El incendio…'), so day 6 should probably be aligned to 'quemarse'.
- [extras-reader-speaking-typing] Reader: would a Paraguayan answer just «Iporã.»? And in 'amomaitei che sy ha che rúpe', -pe appears only on the last of the two persons: a native speaker should confirm this. The text now has 5 sentences plus a 3-turn greeting. If each quoted turn counts as a sentence it is 7, over the brief's 4–6.
- [crosscheck] Héẽ: the course writes Héẽ everywhere, and G5 rates that high (Firefox, Common Voice). The G1/G2 corpora have heẽ (and once hẽe) and say the spelling is not settled. I kept Héẽ because the course has no second spelling to unify, but it needs a native or Academia ruling.
- [crosscheck] Argentina-gua (day 3) has a hyphen, but the G2 example Ore Alemaniagua is written joined. Which form does SPL use for Spanish place names?
- [crosscheck] The Spanish now says 'chipá' everywhere, masculine as in day 5's 'un chipá'. Paraguayan Spanish often says 'la chipa'. Please confirm the app's Spanish choice.
- [crosscheck] I rendered 'Mba'éichapa. Mba'épa reipota?' as 'Hola, ¿qué tal? ¿Qué querés?' because the woman answers Iporã. Day 3's 'Mba'éichapa.' stays 'Hola.'.
- [crosscheck] In t.2, 'karai Juan' = 'don Juan', but day 1 teaches karai only as 'señor'. Is karai the natural title before a first name?
- [crosscheck] Placement pl.5 has 'Ko árape ndahái amba'apo': ko árape vs ko'árape is still an open question in G5, and I read 'ndahái amba'apo' as 'no voy a trabajar'.
- [crosscheck] Some sound pairs are not in G1's verified list: oke/okẽ (days 2 and 5), and day 1's ka'a/ka'i, pira/pire, pire/piru and po/py.
- [crosscheck] Most of the solver's flags come from /tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/build/tools/blind-export.mjs, not from the items. It leaves out `full` (all the build spelling and capitalization reports), its plain() strips the `_…_` underline (e1, k1), and the extras visitor drops task-level passages (a1x.1-3 cannot be answered). I left the tool alone because it is outside this step. A repeat blind check needs the export to keep the underscores, attach t.passage and show `full`, or the same false flags will come back.
- [crosscheck] --check writes nothing, so /tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/canvas/project/gn-course-a1.js still has the old d1.e1 explain and the unsigned d2 passage. They reach the screens after a full `node tools/build-course.mjs`.
- [crosscheck] In the d2 reading, the new last line 'Ana' sits right after 'Ha nde?'. A reader could take it as a vocative ('¿y vos, Ana?'), though a message start addressed to Teresa and a name alone on the last line read as a signature, as in the exam's 'Jajotopáta.\nRosa'. If a reviewer prefers, add the taught farewell first: 'Ha nde? Jajotopáta.\nAna'.
- [crosscheck] Two doubts stay open in doubts.json: Argentina-gua with a hyphen rests on usage, not a confirmed Academy rule, and the d4.d5 split rei- + kuaa follows the school analysis of aireal verbs.

## Units 2 to 4: settle first (they touch more than one unit)

The sections above are about A1 unit 1 and the extras. From here on the file is about units 2, 3 and 4: first the
rulings that touch more than one of them, then a section for each unit in three groups (spelling and forms; composed
sentences; pedagogy and keys). An id such as a1u03d4.e2 is one item: unit 3, day 4, the second exam-style question (p a
grammar point, c the compare check, d a drill item, k the question that closes the words lesson, r the reading or
listening item; a1u03t.5 is question 5 of the week test). u03-d4 is the day's file, content/a1/parts/u03-d4.json. The
counts are the reviewers' own, in the corpora named at the top of this file, quoted as they reported them.

1. **Héẽ** (item 1 of «Settle first», above). The new units write it the same way: a1u02d1.d3, a1u02d5.r1 and
   a1u02t.20; in unit 3, a1u03d1.p1, day 4 throughout (a1u03d4.p1, .p2, .c1, .d3, .e2 and .r1, the passage and the
   note of upéicha), the passage of u03-d6 with a1u03d6.r1, and a1u03t.10, t.18, t.19 and t.20; in unit 4, a1u04d3.r1,
   a1u04d5.d3, a1u04d5.r1, a1u04t.19 and the compare of u04-d4. If the norm is heẽ, they change with unit 1.
2. **-gua takes the stress** (item 2 above). The new units say it as a rule, «-gua sí se lleva el acento»
   (the compare of u02-d3; in other words in a1u03d5.p2 and a1u03d5.d4), and build on it: Paraguaigua (a1u03d3.p1, the
   note of Paraguái in u03-d5, the compare of u04-d1, a1u04d2.p2), Itauguagua (the compare of u02-d4, a1u02d4.c1,
   a1u02d4.e1) and the wrong options ñugua (a1u02d3.c1) and tetãgua (a1u02d6.d3). The reviewers found the Itauguá
   word only as ABC Color's «artesana Itauguágua».
3. **A word stressed on its last vowel takes no mark, also in place names.** Unit 3 day 5 teaches the Academy's rule
   (Itaugua, Ka'akupe, Ypakarai, ñanduti, terere, guarani) and units 2 to 4 write by it, but Guarani texts often keep
   the Spanish accent; the day's fixer counted Itaugua 8 against Itauguá 45, ñanduti 42 against ñandutí 28, Ypakarai
   41 against Ypakaraí 18, terere 68 against tereré 14, guarani 1799 against guaraní 373. The word notes of u03-d5
   admit it, the watch of a1u03d5.p1 still says «El guaraní no la marca», and two keys count as wrong a spelling that
   Guarani texts print: a1u03d6.e2 (Ka'akupé) and a1u03t.13 (Ypakaraí and ñandutí; its stem says «Según la regla del
   acento del guaraní»). The Academia's list of place names should also confirm Itakuruvi (a1u02d4.p1 and the word
   Itakuruvígui, typed in the spelling step of u02-d4; one Common Voice token and one textbook example) and Tovatĩ (a
   scene word, typed, and a sound pair of u03-d5; Tovatĩme 19 tokens, but G2 cites Tobatĩme, with b, from school
   material).
4. **ñanduti or ñandutĩ.** The course writes an oral i, as the corpora do (they have no ñandutĩ at all): the scene
   word of u02-d4 (kept out of its typed step), an option of a1u02t.5, the scene word of u03-d5, whose note says
   «Quiere decir «telaraña»», the watch of a1u03d5.p1 and a1u03t.13. Against it: the RAE's etymology, ñandutĩ, «araña
   blanca», and a lexicographer's newspaper column that says the Guarani word is nasal. If the Academia writes
   ñandutĩ, all of them change.
5. **g̃** (item 5 above). Unit 3 writes og̃uahẽ, ko'ág̃a and ag̃aite (days 2, 4, 5 and 6, a1u03t.4 and the note
   of a1u03t.15 to t.17; the sound step of day 4 is «La g̃»), and the notice of u04-d2 ends «Tapeg̃uahẽ porãite».
   Newspapers write oguahẽ and ko'ágã; in the session's corpus the grader counted ko'ágã 1591, ko'ág̃a 193 and
   ko'ãga 2. The notes say so, and the keys a1u03d4.k1 (ko'ág̃a) and a1u03d6.k1 (og̃uahẽ) offer neither newspaper
   spelling as a wrong option; but the typed steps take only the course's spelling. ag̃aite, «enseguida, ahora mismo»,
   rests on two Common Voice lines and Apertium, and ag̃a is glossed «luego, pronto».
6. **piko: joined or apart, and what it adds.** Unit 3 writes it apart (a1u03d4.p2, a1u03d4.d3, the compare of u03-d4
   and of u03-d6, a1u03t.10) and adds that it is also seen joined (Ndépiko). Unit 4 writes Mávapiko joined and says
   «con nde va suelto» (a1u04d4.p1 and the note of Mávapa in u04-d4). That is corpus usage (mávapiko 5 against máva
   piko 0, mba'épiko 12 against 1, nde piko 5 against ndepiko 0, yet ndépiko 4), not a rule read in the Academy's
   text. The nuance unit 3 gives it, «suele sumar sorpresa o duda», is hedged because the SPL also uses piko in neutral
   questions; the same point says that the Spanish of Paraguay says «pio».
7. **ha'e as «es», and the sentence without it.** Unit 3 day 3 teaches both: the bare sentence (Che mbo'ehára, Ana
   pohanohára, Che ru chokokue ha che sy ñemuhára) and ha'e between two nouns (Ana ha'e che sy, Che ru ha'e
   chokokue). G2 rates the second M, and which one the Academia teaches for a noun subject is open. The watch of
   a1u03d3.p1 puts a cross on «Che ha'e mbo'ehára» (a Guarani textbook lists «Che ha'e Ignacio» as Spanish syntax,
   yet ABC Color writes «che ha'e jey senador»): a teacher should confirm the cross. Keys that depend on it:
   a1u03d3.c1 and a1u03t.9 (ha'e between two nouns), and a1u03t.19, where «Héẽ, ha'e chokokue» is wrong as «él es
   agricultor»: a speaker who says «Che ha'e…» should confirm it cannot be heard as «soy agricultor». Unit 4 uses both
   shapes: «Pe karai ha'e che ru» (a1u04d3.p1), and without ha'e «Pe karai che ramói», «Ko'ã mitã che membykuéra» and
   «Umi mokõi mitãkuña che angirũ memby» (the passages of u04-d6 and of a1u04t.15 to t.17).
8. **mitãkuña and mitãrusu.** Unit 3 glosses them «chica, muchacha joven» and «muchacho, joven» (the scene of
   u03-d3); unit 4 says «niña» (the scenes of u04-d2 and u04-d4, a1u04d2.e2; «las dos nenas» in a1u04d6.r1) and
   «joven, adolescente» (u04-d2). The sources differ too (AmericasNLP «un o una joven», «la chica»; Apertium
   «adolescente», «niño»). One gloss for both units; and -rusu, «grande», as a part of mitãrusu rests only on Apertium
   compounds.
9. **«el chipá» in the Spanish** (in unit 1's list too). The new units keep it masculine with the stress at the
   end (a1u02d4.p1, a1u02d4.p2, a1u02d6.e2, the note of Ndaipóri in u02-d6, a1u03d4.d4, a1u03t.17, a1u04d5.d3,
   a1u04d6.e2), while Paraguayan Spanish usually says «la chipa». The Spanish also writes plain «chipa» (a1u03d1.d3,
   the scene intros of u03-d3 and u04-d4), and the plural is «dos chipás» in a1u04d5.d3 and a1u04d5.k1 but «dos
   chipá» in a1u04d6.e2. One choice for the course.
10. **Pairs for the sound steps and the speaking list.** Only two pairs of units 2 to 4 are minimal pairs from G1 §10,
    tupa / Tupã and pytu / pytũ in u02-d4, and both are unit 1's (u01-d2); every other pair contrasts words, and its
    note says so.
    - po'i / poi: the stress of poi is not settled, so the pair may differ in stress as well as in the puso, like
      ka'i / kái. ABC Color writes opói (AmericasNLP: opói 19, opóiva 17, opóivo 8, ojepói 7, against opoíha 2,
      opoíma 1, ndopoíri 1); Common Voice has only apoíta, apoíma and opoírõguare; Apertium's spelling (poi; jopoi
      «separación» beside jopói «regalo») points to po-í. The pair left the sound steps of unit 3 (it was in days 1
      and 6); content/extra/speaking.json still lists it as a «puso» pair. A native speaker should rule before it is
      recorded or called a minimal pair.
    - Candidates, none recorded and none in G1's list: kambu / kamby and ku'a / ky'a (y against u; on corpus evidence
      both are minimal: omokambúva and kambýre, ku'ápe and ky'águi, with the last vowel of the root stressed on both
      sides; ku'a «cintura» has aligned glosses); jasy «luna, mes» / hasy «duele, está enfermo» (j against h); rajy /
      ra'y (j against the puso). jasy / hasy stood in u03-d2 and che rajy / che ra'y in u04-d1 before the sound
      round, and kambu / kamby and ku'a / ky'a were tried in u03-d2 during it; all came out when those days got other
      foci.
    - Words that stand alone in the pairs and deserve a native ear when they are recorded: ramói without che (u04-d1,
      u04-d6; glossed «abuelo (con che)»), pochy, ro'y and y'uhéi without che- (u03-d1, u03-d6), ógagui (u04-d4,
      u04-d6; 2 hits in AmericasNLP), ndahái (u02-d5; 2 hits in Jojajovai) and Tovatĩme (u03-d5).
11. **«Mba'éichapa?» with a question mark** as the greeting (the message of u02-d2, a1u04d5.r1, the note of a1u03t.15
    to t.17): the course's convention since unit 1; Common Voice writes «Mba'éichapa.» with a full stop.

Four questions were rewritten by the fixer of the sound round after its checker had read the days, so no reviewer and
no blind solver has seen them: a1u03d1.k1, a1u03d2.k1, a1u04d1.k1 and a1u04d4.k1. They need a first reading.

## A1 unit 2, «¿Quién sos? Verbos de acción»

### Spelling and forms

- **Paraguay for Asunción.** The unit tells the learner that Paraguay, with the stress on the y, is Asunción
  (Paraguaýpe, Paraguaýgui) and that Paraguái is the country: a1u02d4.p1, .d1, .d3, .k1 and .r1, the scene word and
  the passage of u02-d4, a1u02d6.d1, the passage of u02-d6 with a1u02d6.r1, and a1u02t.19. The corpora agree
  (Paraguaýpe 570, Paraguaýgui 28). Confirm that an A1 learner can be told so, and that the Academia does not prefer
  another form for «de Asunción».
- **Forms that are regular but thin in the corpora.** Shown in the rule rows only: ndaguatái and ndereguatái
  (a1u02d5.p1; 0 hits each, ndoguatái 21), nasẽi (a1u02d5.p2; only as ABC Color's nasêi) and pehendu (a1u02d2.p2; one
  hit, a poem title), with hendu taken as a nasal root on ñahendu 5 against jahendu 0 (a1u02d2.p1). In items: rejúpa
  (1 hit; a1u02d1.p2, .d5, .e3, a1u02t.20), rehópa (1 hit; a1u02d1.d3, a1u02d5.d1, .r1, a1u02t.12), ohópa
  (a1u02d1.d6), reñe'ẽpa (0 hits; a1u02d5.c1, the question unit 1 teaches), ajeroky 2 and apurahéi 3 (a1u02d1.e1 is
  an exam item), ñasẽ (the key of a1u02t.4, not printed in the days), peñe'ẽ (an option of a1u02t.8, open since
  unit 1), kokuégui (1 hit; a scene word of u02-d4, a1u02d6.c1) and Itauguágui (3 tokens, one ABC sentence;
  a1u02d4.c1, .d5, .e1, the chat of a1u02d4.r1, the scene word typed in u02-d4 and u02-d6, a1u02t.15 to t.17, and
  a1u03d5.r1).
- **ñúme** as a common noun (a1u02d3.p2, .c1, .e1, the scene word and a sound pair of u02-d3, the key of a1u02t.10):
  22 tokens, 20 of them in place names. The form follows the rule (G1 §6.3, G2 §2.5); a native should confirm it for
  «en el campo».
- **The loans of the day 2 sound step**, vúrro, karréta and arro (the pairs of u02-d2; vúrro again in u02-d6), are
  attested only in Apertium and Common Voice; the Academy's rule for spelling Spanish loans was not read.
- **How the j is described**: «la y de «yo» en boca de un paraguayo, o la j inglesa de «John»» (the sound note and
  the note of ajapo in u02-d1, a1u02d1.k1; unit 3 repeats the first half). It follows G1 §1; a Paraguayan teacher
  should confirm that this is the sound the recordings will model.
- **ko'ápe** (a scene word of u02-d3) carries no analysis: the corpus has ko'a as a free word (ko'a rupi, ko'águi)
  but no dictionary glosses it. A native speaker could give the make-up.
- **«Peẽ pepurahéi» read as present**, «Ustedes cantan» (a1u02d2.p2): its one attestation is glossed in the past.

### Composed sentences

Every sentence of the unit is original, as the brief asks: the word forms are attested, the combinations are the
authors'. A native reader should go through them once. First those where the pattern itself is the doubt:

- **A verb-first answer with the subject after it**: «Ou che sy.» in answer to «Mávapa ou?» (a1u02d1.p2), and «Ou
  che ru», the key of a1u02d1.c1. Neither has a corpus hit; the attested order has the subject first («che túva ou
  cherógape»), though news text has the verb first. If it is not a natural answer, the fixer's fallback for the item
  is «Che ru (   ) ko pyhare.». The same order is in «Moõguipa ou nde sy?» (a1u02d4.e3).
- **No -ta in plans for later today.** With ko ka'aru, ko pyhare and ko pyhareve the verbs of the whole unit go
  without the future mark, which is unit 6: «Rejúpa ko pyhare?» (a1u02d1.p2), Roju before «ko ka'aru, ña Ramona» (the
  key of a1u02d2.e2), «Rehópa Ka'akupépe ko ka'aru?» (a1u02t.12). Do they read as natural?
- **«Ñañe'ẽ guaraníme!»** as an invitation to change language (a1u02d2.d6): the bare ña- form is attested as
  «hablemos» (SPL «Ñañe'ẽ Tekombo'ére»), this use is not.
- **«omba'apo ógape»** for «trabaja en casa», of a third person (the chat of a1u02t.15 to t.17; «oĩ ógape» in
  a1u02d3.p1 and the compare of u02-d3): the bare form is attested for one's own home; hógape is A2.
- **«Che aju Itakuruvígui»** (a1u02d4.p1): «che aju» has no corpus line; the frame is ABC's «Che aju ko'ápe».
- **«Aguyje mante»**, «gracias nomás» (a scene word of u02-d5): is it natural at the end of a rainy-day visit?
- **A cat that comes out of the tatakua** (a1u02t.5: «Mbarakaja osẽ» and the key tatakuágui): does it read naturally?

The others the reviewers named, day by day:

- Day 1: Nde remba'apo heta; Mávapa okaru? Che akaru (a1u02d1.p1); Rosa ou ko pyhareve; Vicente oho ko ka'aru, ha che
  aha ko pyhare (a1u02d1.p2); Ana, rehópa ko ka'aru? Héẽ, aha ko ka'aru (.d3); Che ru oho ko ka'aru, ha che sy ou ko
  pyhare (.d4); Vicente, rejúpa ko pyhare? (.d5); Nde sy ohópa ko ka'aru? (.d6); Rejúpa ko ka'aru, Vicente? (.e3); Mba'épa
  rejapo, Vicente? (.r1, a1u02t.18).
- Day 2: Ñande jakaru ko ka'aru; Ore romba'apo ko pyhareve; Ore roju ko ka'aru ha roho ko pyhare (a1u02d2.p1); Peẽ
  pejeroky ko pyhare; Ha'ekuéra omba'apo heta (a1u02d2.p2); Peẽ pekaru ko ka'aru (.d5); and the message, «Ko ka'aru
  jakaru ha jajeroky. Oĩ chipa ha so'o. Peju!» (a1u02d2.r1).
- Day 3: Che ru oĩ kotýpe (a1u02d3.p1); Ha'ekuéra omba'apo ñúme; Vicente oho Ñembýpe, ha Rosa oho ñúme; Che sy omba'apo
  ko tetãme, Paraguáipe (a1u02d3.p2); Che ru omba'apo ñúme (.e1).
- Day 4: Chipa osẽ tatakuágui; Rosa ou Paraguaýgui; Vicente osẽ mbo'ehaógui ko ka'aru (a1u02d4.p1); Moõguipa osẽ ko
  chipa? Tatakuágui (a1u02d4.p2, .d4); Moõguipa peju? Roju mbo'ehaógui (a1u02d4.p2); Moõguipa reju, Vicente? (.d6,
  a1u02t.11); and the chat of the reading (a1u02d4.r1).
- Day 5: Ko pyhareve ndahái; Che sy ndohói mbo'ehaópe; Ndajapói mba'eve; Vicente ndoúi ko ka'aru: oky (a1u02d5.p1);
  Namba'apói ko pyhare; Che ru nosẽi ógagui: oky (a1u02d5.p2); Rehópa kokuépe ko pyhareve, Juan? (.d1); Juan
  nomba'apói kokuépe ko pyhareve (.e3); Rehópa mbo'ehaópe ko ka'aru, Vicente? Nahániri, ndahái. Oky. (.r1).
- Day 6: in exam-style items, Che sy ndohói Itauguápe ko ka'aru (a1u02d6.e1), Ñande jajapo chipa ko ka'aru (.e2) and
  Che ru nomba'apói kokuépe ko pyhareve (.e3); also Aju kokuégui (.c1); Ha'ekuéra oho Paraguaýpe ko pyhareve (.d1);
  Ñande ñañe'ẽ guaraníme, Vicente (.d2); Che ru oĩ tetãme (.d3); Moõpa reho, Vicente? (.d4); Che sy ndoúi ko pyhare (.d5);
  Che sy oĩ kotýpe (.d6); Ndaipóri chipa (the note of Ndaipóri); and in the chat of a1u02d6.r1, Moõpa reho, Ana?,
  Akaru ha añe'ẽ guaraníme and Ha'e ndohói: omba'apo Paraguaýpe.
- Week test: Moõpa peho ko pyhareve? (a1u02t.9); Che ru oĩ ñúme (t.10); Vicente ndohói mbo'ehaópe ko ka'aru (t.14); and
  the chat of t.15 to t.17 (Aha mbo'ehaópe; Aju Itauguágui, che jarýi rógagui; Ha'e ndoúi ko pyhareve).

### Pedagogy and keys

- **ro- is also «yo a vos»** before a transitive root (rohayhu). The unit keeps it on roju, roho, rokaru, romba'apo
  and roñe'ẽ (a1u02d2.p1, .d1, .d2, .e1, .e2, the scene of u02-d2, a1u02t.8): confirm that they read only as
  «nosotros, sin vos».
- **a1u02d2.e2** (key Roju): Ana calls her grandmother about herself and Vicente. A strict reader could have her announce
  only Vicente, which would make Ou right.
- **«Moõpagui no existe»** (a1u02d4.p2, .d3, .d6, .e2) rests on 0 corpus hits against moõguipa 16.
- **Wrong options that do turn up in the corpora**: ndomba'apói (a1u02d5.d2; 1 hit against nomba'apói 11), Naikuaái (a1u02d5.k1;
  1 against ndaikuaái 63) and ndoú (a1u02d5.d4; 4 loose hits, probably «ndou mo'ãi» written apart). Tatakuáme
  (a1u02d4.d4) has no hit: confirm that it reads as wrong and not as a slip.
- **a1u02d6.c1**: with the wrong option Aha the answer reads «Aha kokuégui», a sentence on its own («voy de la
  chacra»), wrong only as the answer to «Moõguipa reju?». Is that clear enough?
- **ou as a single tile** (a1u02d6.d5, tiles nd, ou, i; day 1 says that «viene» is ou, «sin j»): a teacher may prefer
  to show it as the third person of ju.
- **Day 2 builds only two-tile words** (a1u02d2.d5, .d6, .e3). No verb with a plural prefix and the question -pa is
  attested (pehópa, pejúpa, jahápa and others: 0), so pejerokýpa and ñañe'ẽpa were taken out. A teacher who confirms
  one such form gives the day its accent practice back.
- **guata, «caminar», as the model root** (a1u02d1.p1): its first dictionary senses are nouns (viaje, paseo, paso).
- **The chunk «che jarýi rógape»** (a1u02d3.p1, the chats of u02-d4 and u02-d6; rógagui in a1u02t.15 to t.17) comes
  two units before unit 4 teaches the owner-first order, and before A2 teaches t-, r-, h-.
- **Ndaikuaái and Ndaipóri as whole words** (the scenes of u02-d5 and u02-d6): ndaikuaái is split nd- + ai- + kuaa +
  -i before unit 5 teaches ai- (item 4 of «Settle first»), and Ndaipóri is said to end «en -ri», with no analysis.
- **Repeats**: a1u02d6.e3 is a1u02d5.e3 with another subject; a1u02t.14 asks for the form and the place of
  a1u02d5.e2; a1u02t.9 is a1u02d2.c1 with a time added; a1u02t.19 mirrors a1u02d6.c1.
- **Said from general knowledge**: that Ñemby is «una ciudad cerca de Asunción» (a1u02d3.p2), and in the sound note
  of u02-d5 that ng and nt go «casi siempre» inside the word (a corpus finding). And two choices in the Spanish:
  «pieza» first for koty and «monte» first for ka'aguy (the scene of u02-d3).

## A1 unit 3, «¿Cómo estás? Predicados chendales»

### Spelling and forms

- **che-, nde-, ne- joined to a state.** The unit writes the person mark joined to a state (chekane'õ, ndepochy,
  nekane'õ, cheakãrasy, nachemandu'ái) and apart for possession (che sy), and tells the learner «En otros textos lo
  vas a ver separado, che kane'õ: se dice igual» (a1u03d1.p1). Common Voice, Firefox, the SPL seminars and textbook
  lines join them (chemandu'a 17 joined against 2 apart, chepochy 2 against 0, chekane'õ 2 against 0, chevare'a 2
  against 1); ABC Color and the Jesuit course «Hablemos el guaraní» (CEPAG) write them apart. The Academia's 2016
  rule 4 was never read. If the norm separates them, days 1, 2, 4 and 6 and the week test change together. The fixers
  put this first.
- **nekane'õ** has no hit as a plain positive (a1u03d1.p1, a1u03d1.d6, a1u03d4.p2, the chat of a1u03d4.r1, the note
  of the word in u03-d1 and u03-d6). It rests on nde becoming ne before a nasal word (CEPAG's set che, ne, ñane, ore,
  pene; «Nanekane'õi araka'eve»). nderasy (a1u03d6.d1, a1u03t.7) and ndevare'a (a1u03d1.d3), wrong options that the
  text glosses as real forms, are by rule too. chekane'õiterei, «muy cansado» (the note of chekane'õ in u03-d1, the
  message of a1u03d2.r1), has two Common Voice hits.
- **The «no» around che-.** nachemandu'ái is attested (and ndachemandu'ái twice), ndachevare'ái only inside
  «Ndachevare'áietevoi», nachekane'õi not at all (it is in an example and in the watch of a1u03d4.p2). The rule
  taught, na- before a nasal word and nda- before an oral one, decides a1u03d4.d4, where nachevare'ái is a wrong
  option; it is also in a1u03d4.d6, a1u03d4.e3, a1u03d6.e1 and a1u03t.14.
- **Questions with -pa that are regular but have no hit as whole words**: Ikane'õpa (a1u03d4.p1, a1u03d4.e2,
  a1u03t.12), Nekane'õpa (a1u03d4.p2, the chat of a1u03d4.r1), Og̃uahẽpa (a1u03d4.p1, a1u03d4.d5, a1u03d6.d6 and both
  chats), Nemandu'ápa (a1u03d4.d6, a1u03d6.e1), Ndepochýpa and Ipochýpa (a1u03d6.d3, a1u03t.18). Their models are
  attested: hasýpa, oĩpa, reikuaápa, revy'ápa, nderesaráipa.
- **y'uhéi** (the scene word, the sound pairs and a1u03d1.k1 in u03-d1; u03-d6): the puso spelling is the corpora's
  (yuhéi only in one Apertium entry) and chey'uhéi has one hit. CEPAG gives the pronunciation «che i'uhei», so the
  wrong option chei'uhéi of a1u03d1.k1 is how the word sounds: it is wrong as spelling only.
- **ijy'uhéi** (a1u03d1.p2), the one glimpse of i- before a vowel, is attested only in CEPAG; ij- before y is regular
  in the corpora.
- **tasy, cherasy, hasy** (a1u03d1.p2, a1u03d1.d4, a1u03d6.d1, a1u03t.7): tasy is in the dictionary only, and «Irasy
  no existe» rests on 0 hits and the CEPAG paradigm. hasy is also «es difícil», which the unit does not say.
- **pohanohára** against pohãnohára (u03-d3, where it is typed, u03-d4, u03-d6, a1u03t.3): 149 tokens (AmericasNLP,
  ABC, SPL) against 63 (Common Voice, blogs). The Academia's dictionary form is unknown; the word's note names the
  other spelling.
- **kaigue**, «desgano», chekaigue «estoy desganado» (a scene word of u03-d1, a1u03t.1): from Common Voice
  («Chekaigue.», twice) and web glosses; Apertium has «quemadura, quemazón».
- **«Tengo calor».** The note of haku gives chembyry'ái (u03-d1): the joined word has no corpus hit (CEPAG writes che
  mbyry'ái); «Haku chéve», which it replaced, had one. «Ajépa ro'y», «qué frío» (the note of chero'y), has one too.
- **vare'a or ñembyahýi** for hunger (the scene word of u03-d1 and its note; chevare'a is used in days 2, 4 and 6 and
  the test): CEPAG teaches only ñembyahýi, and a newspaper column calls vare'a «angurria». Which word leads?
- **ajahu**, «me baño» (u03-d2 throughout: the sound focus names it and it is the key of a1u03d2.k1): the first
  person has one hit (Common Voice «Aháta ajahu.»); the verb itself is solid (ojahu, rejahu).
- **chekaru and chevy'a.** The watches say «chekaru no es «como»» and «Chevy'a no es «estoy contento»» (a1u03d2.p1,
  a1u03d2.p2); a1u03t.8 says chekaru is «soy comilón» (CEPAG, Apertium karu «comilón, glotón»), and the note of akaru
  in u02-d1 says «karu también es «almuerzo»». chekaru has no corpus hit; what a speaker hears in it is not settled.
- **aime with a state or a role.** The note of aime (u03-d2) says «Aime porãiterei», «estoy muy bien», is said and
  «aime kane'õ» is not; «aime chokokue» is a wrong option of a1u03d3.d1. Both rest on 0 tokens.
- **upéicha**, «así», and «Héẽ, upéicha», «sí, así es» (a1u03d4.p2, a1u03d4.d3, the scene word, a1u03t.10): one
  aligned line; «Upéicha.» alone as a reply has no hit.
- **«Añetépa?»** as a one-word «¿de verdad?» (a1u03d4.p2, the key of a1u03d4.e1, the chats of u03-d4 and u03-d6): the
  form is attested, its use as a reply is not confirmed.
- **jaguarete** split as jagua «perro» + -ete «verdadero» (the scene of u03-d5): the traditional etymology, not in
  the notes.
- **The stressed syllable in capitals** (a1u03d5.c1, .d1, .d2 and the word notes of u03-d5: na-HÁ-ni-ri,
  mbo-'e-HÁ-ra, pu-ra-HÉI, To-va-TĨ, i-ka-TÚ-pa) follows the written accent, not a recording. jarýi was left unsplit
  (ja-RÝ-i or ja-RÝI).
- **ch** (the sound step of u03-d1): the note says «más bien como «sh», aunque también vas a oír la ch castellana»
  (G1 §1; PHOIBLE has both [ʃ] and [tʃ]). Which of the two the recorded voice should model is still G1's open
  question 3.
- **«Mamá»** signs the Guarani note of a1u03t.15 to t.17 and names the speaker in the chat of u03-d4; Common Voice
  writes «Mama».

### Composed sentences

As in unit 2, every sentence is original. The nominal sentences are item 7 of the list above. Then those where the
pattern is the doubt:

- **Ndépa + noun**: «Ndépa pohanohára?» (a1u03d4.p1, a1u03d4.c1), «Ndépa mbo'ehára?» (the compare of u03-d4 and of
  u03-d6), «Ndépa chokokue, Juan?» (a1u03t.19), after «¿Ndépa jagua térã ava?» (a blog story) and «Ndépa moõgua»
  (Common Voice).
- **Nde piko + noun**: «Nde piko mbo'ehára?» (a1u03d4.p2), «Nde piko pohanohára?» (a1u03d4.d3), «Nde piko chokokue,
  Teresa?» (a1u03t.10). It is attested only with ha'e («nde piko ha'e che sy?»).
- **«Ha'épa nde ru?»** (a1u03t.20): ha'épa is attested only in indirect questions. A teacher may prefer «Nde rúpa
  ha'e?».
- **«Revy'ápa, Ana?»** (a1u03d6.d5): Revy'ápa is attested only with an object after it.
- **ndaha'éi after a subject**: «Che ndaha'éi mbo'ehára» (a1u03d3.p2), «Vicente ndaha'éi mbo'ehára, ha'e pohanohára»
  (a1u03d3.p2, a1u03d3.d5), «Rosa ndaha'éi che sy» (the compare of u03-d6), after ABC's «che ndaha'éi abogado». A
  proper name before ndaha'éi has no hit.
- **«Mba'éichapa, kuñakarai.»** (a1u03d3.r1): kuñakarai used to address someone.
- **«Che jarýi ovy'a»** (a1u03t.11) is composed, and that ivy'a and chevy'a are not said rests on 0 hits (the corpus
  has ivy'apavẽ and chevy'apavẽ, from the noun).
- **«karai Juan»** for «don Juan» (a1u03d5.p1), as in unit 1.

The others the reviewers named, day by day:

- Day 1: Chevare'a ha chey'uhéi; Nekane'õ, Vicente. Héẽ, chekane'õ ha chero'y (a1u03d1.p1); Che sy ikane'õ; Ana ipochy;
  Ha'e ivare'a; Mitã ivare'a; Che ru hasy (a1u03d1.p2); Chero'y ha chevare'a (.e1); Chekane'õ ha chey'uhéi; Jaha, oĩ
  terere (.r1).
- Day 2: Apu'ã ha ajahu; Akaru ha ake; Che sy opurahéi ha che ru ojeroky; Ko'ág̃a amba'apo (a1u03d2.p1); Chevare'a ha
  akaru (.d5); Chepochy ha aha (.e2); Apu'ã ha amba'apo (.e3); and the message, «Ko'ág̃a ajahu ha akaru.
  Chekane'õiterei.» (a1u03d2.r1).
- Day 3: Ndaha'éi che sy, ha'e che jarýi (a1u03d3.p2); Ndaha'éi che irũ (.e1); Ndaha'éi che ru, ha'e che angirũ
  (.e3); and the listening: Ha'e che sy, Vicente. Ha'e mbo'ehára. Ha Moisés ha'e che irũ. Ha'e pohanohára (.r1).
- Day 4: Rejúpa ko pyhare? (a1u03d4.p1); Og̃uahẽ pohanohára; Og̃uahẽ piko Ana?; Ndépiko mbo'ehára? (a1u03d4.p2);
  Hasýpa nde ru? (.d1); Reipotápa chipa? (.d4); Che ndaha'éi pohanohára (the note of ndaha'éi); and the chat: Nde
  jarýi hasy. Ha nde? Nekane'õpa? Nahániri. Chevare'a (.r1).
- Day 5: Jagua okaru; Che róga ituicha; Purahéi iporã (a1u03d5.p1); Aha Itauguápe; Aju Paraguáigui; Reikuaápa
  Ypakarai?; Aike mbo'ehaópe (a1u03d5.p2); Aha Ypakaraípe (.d5); Reikuaápa Ka'akupe? (.d6); Vicente oho Ka'akupépe
  (.e3); Aju Itauguágui. Ko'ág̃a aha Ka'akupépe. Ha che aha Ypakaraípe (.r1).
- Day 6: Ndaha'éi che jarýi, ha'e che sy (a1u03d6.e3); Ko'ág̃a akaru (the compare); and the chat: Che sy ikane'õ ha
  che jarýi hasy. Chey'uhéi. Oĩpa terere? (a1u03d6.r1).
- Week test: Che sy pohanohára (a1u03t.3); Teresa ha'e che sy (t.9); che ñemuhára (t.10); che chokokue (t.19); and the
  note of t.15 to t.17: Aha mbo'ehaópe. Nde ru og̃uahẽ ko'ág̃a: ikane'õ ha ivare'a. Oĩ chipa ha terere.

### Pedagogy and keys

- **Wrong options that rest on absence** (0 tokens in the three corpora): chepu'ã and ipu'ã (a1u03d2.d1), chevy'a and
  ivy'a (a1u03d2.d2, a1u03t.11), chemba'apo (a1u03d2.d3, a1u03d6.d2), amandu'a (a1u03d2.d4), apochy (a1u03d2.e2) and
  repochy, as Repochýpa (a1u03d6.d3). «Ani ndepochy» and «Ani rekyhyje» support pochy as a state and kyhyje as an
  action. A native should confirm that none of them is in use.
- **Wrong options with stray corpus hits**: karái 3 (a1u03d5.d1), nahaniri 3 (a1u03d5.d2), mbo'ehaope 2 (a1u03d5.d3),
  mba'eichapa 15 (a1u03d5.e1) and tetáme 1 (a1u03d5.e2), each against 54 to 968 tokens of the form with its mark.
- **a1u03d3.d1**: no native has heard the wrong option «aime chokokue». The fixer's safe swap is «ochokokue».
- **a1u03d1.d5 and a1u03d1.e3 build the same word** (che + akã + rasy) in two frames, and a1u03t.6 asks its meaning.
- **Day 1 practises only states.** Its syllabus title names «cualidades»; the first quality, ikatupyry, comes on
  day 3.
- **The week test no longer keys nde- / ne-**, which stays in days 1, 4 and 6. Its items share options with the
  days: t.10 has the four words of a1u03d4.d3, t.7 three options of a1u03d1.d4 and a1u03d6.d1, t.11 three of
  a1u03d2.d2, and t.12 is the model sentence of day 4.
- **The two rewritten questions**, a1u03d1.k1 and a1u03d2.k1 (see the end of the list above), have had no reader.
- **Said from sources outside the notes**: that Tovatĩ is «un pueblo de oleros y ceramistas, cerca de Caacupé» and
  that Caacupé is where people go on pilgrimage in December (the word notes of u03-d5 and u03-d6; the fixer found the
  date, 8 December, in ABC Color and ACI Prensa).

## A1 unit 4, «Mi familia»

### Spelling and forms

- **ramói, tamói: ói or õi.** The word runs through the unit: a1u04d1.p2, .d6 and .r1, the scene word, which is
  typed, a1u04d4.d5 and .r1, a1u04d5.p2, the message of u04-d6, a1u04t.7. The corpora and Apertium write ói (ramói 18,
  tamói 6, ramõi and tamõi 0); a kinship article of the UnB writes tamõi and ramõi, and Apertium glosses tamói
  «chamán». The Academia's dictionary was not reached. Since the sound round the word carries more: the focus of
  u04-d1 is «La tilde en dos vocales juntas: jarýi, ramói», and ramói is the key of the rewritten a1u04d1.k1.
- **memby, ra'y, rajy by who speaks.** The unit says the mother says memby and the father ra'y and rajy (the intro and
  the scene of u04-d1, a1u04d5.e1, a1u04t.1), and the cast follows it (Rosa says che memby, Vicente and Juan che rajy:
  a1u04d4.p1, a1u04d4.r1, a1u04d3.r1). The forms are attested; the rule comes from Wiktionary, a kinship article and
  question-and-answer pages, later backed by corpus lines (ABC: «…Raúl Cubas Grau rajy ha senadora Mirtha Gusinky
  membykuña»), not by a school grammar. Can a mother say «che rajy» today? If she can, rajy leaves the options of
  a1u04t.4, and ra'y those of a1u04d5.d4.
- **tembireko and ména** (the note of che rembireko in u04-d1 and u04-d6): tembireko as the bare word has one Common
  Voice hit, and Apertium glosses it «esposo», a likely slip. «che ména» is attested; ne ména and nde ména are not, so
  ména stays in the note.
- **ne before a nasal word** (a1u04d1.p2, .d2, .d6, .e2, a1u04d6.d1, a1u04t.7, t.20): ne memby, ne ramói, ne angirũ,
  ne rembireko. ne angirũ is attested and nde angirũ has no hit; ne rembireko has few. The watch says «Nde memby se
  entiende, pero no se escribe así». ñane before memby, which the explanation of a1u04d2.e1 calls for («ñande se
  vuelve ñane»), has 0 tokens.
- **Which syllables count as nasal for -nguéra** (a1u04d2.p2 and the note of mymbakuéra): «mb, nd y ng son otras
  letras, y no cuentan», so memby and mymba take -kuéra. It rests on the phonology (G1 §6.1) and on counts (75 tokens
  of mb, nd or ng + vowel + kuéra, none with -nguéra); the Academia's wording was not read. Loans keep -kuéra after a
  nasal (guaranikuéra 18 against guaraninguéra 1): the rule is stated for Guarani nouns, and the day pluralises no loan.
  Regular plurals with few tokens: ryguasukuéra (the key of a1u04d6.d2), mitãkuñanguéra (the key of a1u04d2.e2),
  mbarakajakuéra (a note in u04-d3).
- **Final stress in vaka, kavaju and kesu** (the sound note and the word notes of u04-d3: «va-ká», «ka-va-jú»): the
  suffixed forms in the corpora (kavajúre, vakáre, kesúre) say so, and G1's open question 5 can close once a native
  speaker confirms. The clips must model it.
- **yvyramáta**, the tree as a plant (the note of yvyra in u04-d3): 48 aligned lines, not in Apertium, not checked
  against a norm text.
- **areko, rereko, oguereko** are taught whole on day 5, before unit 5 teaches the verbs of this kind (a1u04d5.p1,
  .p2, .d5, .e3, a1u04d6.e3, a1u04t.12, t.14). ABC Color writes oreko. Confirm that it does not clash with how unit 5
  will analyse them.
- **Spanish numbers with Guarani nouns** (a1u04d5.p2): «Che ramói oguereko ochenta ary», «doce mitã», «mil tapicha»,
  and «Veinte.» as the answer to an age. In writing the corpora use digits («oreko 80 ary») or mil, seis, siete («mil
  tapicha», «siete yryvu»); spelled-out «ochenta ary» has no hit, and whether speech says «ochenta ary» or «ochenta
  años» needs a native. The passages of u04-d6 and a1u04t.15 to t.17 now write «80 ary» and «60 ary»; day 5 still
  spells it out. «De seis en adelante» is the course's convention (G5 §3.6 has Spanish numbers from 4 up).
- **Prices** (a1u04d5.p2, .d3, .e2, a1u04t.19): «en la charla el precio se dice entero en castellano» is the
  syllabus's claim (G5 §3.6; G2 §4 has no source on spoken usage, as unit 1's list says). «Pa mil» and «Po mil» as
  wrong mixes rest on 0 hits.

### Composed sentences

As in unit 2, every sentence is original. Those where the pattern is the doubt:

- **Mávapa + ko, pe, amo + noun**: «Mávapa pe karai?», «Mávapa ko mitã?», «Mávapa amo kuñataĩ?» (a1u04d4.p1),
  «Mávapa pe kuña?» (a1u04d4.c1, a1u04t.18), «Mávapa amo karia'y?» (a1u04d4.d4, a1u04d6.c1), «Mávapa amo kuña?»
  (a1u04d4.e2), «Mávapa pe kuñataĩ?» (the chat of a1u04d4.r1), «Mávapa pe karia'y?» (a1u04t.11). Common Voice has
  these questions with -piko. «Mávapa pe» + noun is attested (22 tokens); «Mávapa ko» and «Mávapa amo» + noun are
  not.
- **«Mba'épa he'ise «ramói»?»**, with the word after the verb (a1u04d4.p2, .d3, .d5, .e1, the chat of a1u04d4.r1,
  a1u04t.5): the frame is attested (SPL, Common Voice «Mba'épa he'ise.»), the quoted word is added.
- **«Mboýpa ne memby?»** (a1u04d5.p1, a1u04d5.d1, the chat of a1u04t.15 to t.17) has one attested model («Mboýpa
  ndera'y?», «¿Cuántos hijos tienes?»).
- **«Mboy arýpa oguereko ne memby?»** and «…nde ru?» (a1u04d5.e3, a1u04t.14) are made on Common Voice's «Mboy arýpa
  rereko.».
- **«Maitei, sy ha tuvakuéra.»** (the notice of a1u04d2.r1): «sy ha tuvakuéra» for «padres» is attested; Maitei
  before a common noun has no parallel. Is a notice to parents headed this way, and is one -kuéra at the end of «sy
  ha túva» clear to an A1 reader?
- **A name after héra**: «Ha'e che ru, héra Santiago.», «Che ramói, héra Casimiro.», «Héra Genaro.» (a1u04d1.r1), «Che
  memby, héra Samanta.» (a1u04d4.r1), «Pe karai che ramói, héra José.» (a1u04d6.r1), «Che ru, héra Santiago.»
  (a1u04t.15 to t.17): the lines as they stand since the people were renamed.
- **Owner chains**: «che angirũ memby» (a1u04d6.r1; no hit), «Che rajy mbarakaja» (a1u04d3.r1), «Moõpa ne ramói
  róga?» (a1u04d1.d6), «Moõpa nde ru róga?» (a1u04d1.e3), «Aha che ru rógape» (a1u04d1.d5).
- **-pe for the person spoken to**: «Mbo'ehára oñe'ẽ mitãnguérape» (a1u04d2.d5), «Che sy oñe'ẽ kuñanguérape»
  (a1u04d2.e3), «Che sy oñe'ẽ mitãnguérape» (a1u04d6.d5). It is attested once, in a headline («Cartes oñe'ẽ
  kuñanguérape»); with a noun the corpora mostly use ndive. And «Aguyje mbo'eharakuérape» (a1u04t.13), after Common
  Voice's «Aguyje maymávape.».
- **In the shop** (a1u04d5.r1): «Mokõi kesu, aguyje» as an order and «Héẽ, oĩ.» as an answer.
- **Two examples come from the hackathon part of Jojajovai**, its weakest: «Mokõi kuña opurahéi» (the compare of
  u04-d5) and «Jareko peteĩ jagua» (a1u04d5.p1).

The others the reviewers named, day by day:

- Day 1: Che róga iporã; Ha'e che ra'y; Aha che jarýi rógape; Che sy ha che ru oñe'ẽ guaraníme (a1u04d1.p1, .e1).
- Day 2: Mbo'eharakuéra oñe'ẽ guaraníme (a1u04d2.p1, .d6); Kuñanguéra opurahéi; Che angirũnguéra Paraguaigua;
  Mitãnguéra okaru korapýpe (a1u04d2.p2); Che angirũnguéra oĩ ko'ápe (.d3); Ogakuéra iporã (.d4).
- Day 3: Pe karai ha'e che ru (a1u04d3.p1); Umi kavaju oĩ korapýpe; Umi jagua oyta; Ko'ã óga ituicha; Umi mitã oho
  mbo'ehaópe (a1u04d3.p2); Ko'ã ryguasu ituicha (.e2); Umi kavaju ha ko'ã vaka oĩ korapýpe (.e3; «ko'ã vaka» has no
  hit); and the talk in the yard (.r1). «Umi jagua oyta» is given as «Esos perros nadan»; its source glosses «pueden
  nadar».
- Day 4: Mba'épa oĩ korapýpe? (a1u04d4.p2, a1u04d6.d6); Ha pe karai? (a1u04d4.r1, a1u04t.15 to t.17); Ha'e che rajy
  (a1u04d4.p1).
- Day 5: Oĩ mbohapy apyka; Areko mbohapy memby (a1u04d5.p1, .e1); and the talk in the shop (.r1). «Mboýpa ovale ko
  kesu» and «Mboy arýpa rereko» are Common Voice's own.
- Day 6: Mba'éichapa héra ne rembireko, Juan? (a1u04d6.d1); Ryguasukuéra oĩ korapýpe (.d2); Amo kavaju ituicha (.d3);
  Oĩ irundy mitã (.d4); Ko'ã chipa iporã (.e2); and the message with the photo (.r1).
- Week test: Oĩ irundy apyka (a1u04t.6); Amo yvyra ituicha (t.9); Ko'ã apyka iporã (t.10); Che memby oguereko po ary
  (t.12); Mboýpa ovale ko kamby? (t.19); and the chat of t.15 to t.17.

### Pedagogy and keys

- **A plural after a number is counted as wrong**: the watch of a1u04d5.p1 (mokõi mitãnguéra), a1u04d5.c1, a1u04d5.d4,
  a1u04d6.d4 (irundy mitãnguéra) and a1u04t.12 (arykuéra). G2 gives it as a rule, and the reviewers counted some
  1,450 to 1,600 lines of number + bare noun against a handful with -kuéra. Confirm that it is rejected and not only
  redundant, and that the number goes first («kuña mokõi» appears once, in ABC Color). If the plural is accepted,
  the fixer's way out is the spelling slip «mitãnguera» as the wrong option of a1u04d6.d4, and day 5 follows.
- **umi for what the speaker is touching** (a1u04t.10, a1u04d3.d3, a1u04d3.e2, a1u04d6.e2): umi also serves as a plain
  plural article (ABC «umi mitã», «los jóvenes»). Confirm that «Umi apyka iporã» is wrong for chairs the speaker
  touches; if it is not, the four items change together. In a1u04d3.d4, the blind solver's one unsure answer, the stem
  says the children are with Rosa but not where Juan stands.
- **pe or amo for someone in a photo.** a1u04d6.c1 asks «(   ) amo karia'y?» about «el muchacho de la foto»; day 4 and
  the test use pe for a photo (a1u04d4.c1, the chat of a1u04d4.r1, a1u04t.11, a1u04t.18).
- **Mitãkuñakuéra as a wrong option** (a1u04d2.e2): wrong by the norm and by the counts (mitãkuñanguéra 12,
  kuñanguéra 269, kuñakuéra 0), but ABC Color printed it once. If it passes as usage, the fixer's swap is
  «Mitakuñakuéra».
- **a1u04t.7** has no line of context: «che» is wrong only because Juan would be asking Rosa his own grandfather's
  name. A line such as «(Juan le pregunta a Rosa por el abuelo de ella.)», as in the drills of day 1, would close it.
- **a1u04t.4** stands on the memby rule above.
- **Two-tile builds** (mba'e + pa, máva + pa, ary + pa: a1u04d4.d5, .d6, .e3, a1u04d5.d5, .e3, a1u04d6.d6, .e3): word
  order is free in short sentences, so few longer builds were safe. They teach mostly the spelling.
- **Point 1 of day 3** (ko, pe, amo) has the least drill the brief allows, two items (a1u04d3.d1, .d2), beside .c1
  and .e1.
- **pe, umi and ko'ã where Spanish says «el, los, las»** (a1u04d3.p2) is given as a warning from aligned corpus lines,
  not as a rule. The same point takes umi with or without the plural on the noun (umi kavaju, umi mitãnguéra).
- **The two rewritten questions**, a1u04d1.k1 and a1u04d4.k1 (see the end of the list above), have had no reader.

## Entre unidades (1 a 4)

Units 2, 3 and 4 were written side by side by teams that knew only unit 1. An inventory and two auditors then read
the four units against one another (98 findings), and a fixer made 327 changes, 322 in content/a1/parts and five in
the extras: one cast with one set of facts, one gloss for a word, one way of writing a cross-reference, a greeting, a
plural and a stressed syllable, and other frames where one item printed what the next one asked. 73 items changed;
none of them has been before a reviewer or a blind solver since (the list is at the end). What follows is what those
changes leave for a native teacher. The words in which the learner is told a rule are the fixer's, not a grammar's.

### Rulings

1. **mitãkuña, mitãrusu, karia'y, kuñataĩ** (item 8 of «Units 2 to 4: settle first»). The four now have one gloss each
   in every list: mitãkuña «niña, chica» (u03-d3, u04-d2, u04-d4), mitãrusu «joven, adolescente» (u03-d3, u04-d2),
   karia'y «muchacho, hombre joven» (u04-d4; «mozo» was avoided, it is also a waiter), kuñataĩ «chica, muchacha»
   (u01-d2, a1u04d4.p1). The cast follows them: Rosa's daughter of five is a mitãkuña (a1u04d4.r1, a1u04t.12), Juan's
   daughter a kuñataĩ (a1u04d4.p1), his son a karia'y (a1u04d6.c1), the friend of Ana in a1u04t.11 a karia'y. Which
   ages does each word cover, and is «niña, chica» right for mitãkuña (the SPL uses it for «niña», the news for
   «joven»)?
2. **piko** (item 6). Unit 4 now says what unit 3 says: «Con nde lo viste suelto, Nde piko, y también se escribe
   pegado: Ndépiko», and after máva joined, Mávapiko (a1u04d4.p1, the note of Mávapa in u04-d4). Still usage (mávapiko
   5 against máva piko 0; nde piko 5, ndépiko 4), not the Academy's rule 4.
3. **The first part of the «no» before ha'e, ikatu and che-.** The learner is now told that it is nda- (na- before a
   nasal word) and that «esa a no es la a- de «yo»» (a1u03d3.p2, a1u03d4.p2, the hint of a1u03d3.d5, a1u03d6.c1). G2
   reads ndaikatúi as nd-a-ikatu-i, «no puedo». Is the sentence true as it stands for ndaha'éi, for ndaikatúi and for
   ndachevare'ái, or should a learner be told something else?
4. **ñane.** «Ñande hace lo mismo: ñane» is now in the rule row of a1u04d1.p2, because three explanations lean on it
   (a1u04d1.d2, a1u04d2.e1, a1u04d6.d1). ñane retã and ñane ñe'ẽ are attested; ñane memby has no token.
5. **Where the person goes in a question.** a1u03d4.p1 now says that with a state the person may come after it
   («Ikane'õpa nde ru?») or before it («Nde sy oñe'ẽpa guaraníme?»). Both orders are in the corpora (Common Voice «ha
   ne membykuéra moõpa oĩ», «Moõpa nde róga.»). Is either one marked?
6. **«Moõpa nde róga?» without a verb.** The row of a1u04d1.p2 now says that the house goes without a verb and a
   person with oĩ («Moõpa oĩ nde sy?»). Corpus: Moõpa oĩ 14 lines, Moõpa opyta nde róga 8, Moõpa nde róga 2. Is
   «Moõpa oĩ nde róga?» also said, and should the lesson prefer opyta?
7. **A bare verb read as past.** The note of og̃uahẽ (u03-d4) now says «El verbo no cambia para el pasado: og̃uahẽ es
   «llega» y también «llegó». El pasado se estudia en la unidad 6». And the note of aime (u03-d2) links it to unit 2:
   «Con él o ella ya lo conocés: oĩ». Confirm both wordings (oime is not shown).
8. **ru and pyta in the sound pairs.** ru is now glossed «padre (con che, nde)» (u02-d2, u02-d6), as unit 4 says that
   it does not stand alone (túva does); pyta is «talón; quedarse» in u01-d6 as in u01-d2. «Talón» still rests on one
   dictionary.
9. **«chipá», «chipás»** (item 9) and **the greeting with its question mark** (item 11). The Spanish now writes «el
   chipá», plural «chipás», in every place, and «Mba'éichapa?» takes the question mark also before another sentence
   («Mba'éichapa? Che réra Ana.», a1u01d3; «Mba'éichapa, kuñakarai?», a1u03d3.r1; the two spoken samples of
   content/extra/exam-a1.json). Paraguayan Spanish also says «la chipa», and Common Voice writes «Mba'éichapa.».
10. **po'i / poi** stays in content/extra/speaking.json as a «puso» pair. An auditor asked to take the row out until
    the stress of poi is settled (item 10 above); it was kept because G1 §10 rates the pair H, and the brief asks
    only for pairs G1 has verified. A native speaker should hear it before it is recorded.
11. **«Mbo'ehaópe.» as an answer** to «Moõpa reñe'ẽ guaraníme?» (a1u01d4.c1, in place of «Che rógape.», which the
    learner could not read yet), and **«Mokõi.»** alone as the answer to «Mboýpa ne memby, Rosa?» (a1u04d5.d1, as in
    the chat of a1u04t.15 to t.17): are both natural one-word answers?
12. **Stress shown in capitals** for the loans: va-KA, ka-va-JU (the sound note and two word notes of u04-d3; they
    were «va-ká», «ka-va-jú»). The doubt about where the stress of vaka and kavaju falls is the one of unit 4's list.

### Composed sentences that are new

As everywhere in the course, the word forms are attested and the sentences are the authors'. A native reader should
go through these once:

- Unit 1: Héra Moisés. Ha'e Argentina-gua (a1u01d3.d4); Mboýpa ovale ko mandi'o? (a1u01d4.d6; «Ko mandi'o» is Common
  Voice's).
- Unit 2: Rehópa ko pyhare, Rosa? (a1u02d1.e3); Roju ko ka'aru, che jarýi (a1u02d2.e2: «che jarýi» said to the
  grandmother, where it was «ña Ramona»); Ore romba'apo ko ka'aru (a1u02d2.e3); Moõpa remba'apo? with no name
  (a1u02d3.r1); Aju Itakuruvígui (a1u02d4.d5; a textbook line); Moõguipa peju? (a1u02d4.d6); Moõpa reho, Juan?
  (a1u02d4.e2); Aju kokuégui (a1u02d4.e3, as in a1u02d6.c1); Ko ka'aru ndahái távape (a1u02d6.e3; ndahái has two
  corpus lines).
- Unit 3: Vicente pohanohára (a1u03d3.p1); Ndaha'éi che angirũ (a1u03d3.e1); Ha'e mbo'ehára (a1u03d3.e3, a build of
  mbo'e + hára); Mba'éichapa, kuñakarai? (a1u03d3.r1); Ndépa ñemuhára? Nahániri, che chokokue (a1u03d4.c1); Nahániri,
  ndahái (a1u03d4.p2); Che ru hasy (a1u03d6.d1); Ikane'õpa nde sy, Juan? (a1u03d6.d6; Ikane'õpa has no token as a
  whole word); Ikatúpa aike? Nahániri, ndaikatúi (a1u03t.14: ndaikatúi has 96 corpus lines and «Ndaikatúi.» alone
  three, the pair of lines none); and «Ndépa chokokue, Juan?» said by «Vecina» (a1u03t.19).
- Unit 4: Ha'e che sy. Ha'e che ru, héra Santiago. Héra Genaro (a1u04d1.r1); Peju! Tapeg̃uahẽ porãite (the notice of
  a1u04d2.r1; Peju! alone has no corpus line); Ko vaka ivare'a (a1u04d3.p1, the compare and the note of vaka);
  Umi ryguasu ituicha (the key of a1u04d3.e2, hens far from both); Mávapa ha'e? Ha'e che rembireko; Mávapa amo
  kuñataĩ? Ha'e che rajy, now asked by Rosa and answered by Juan (a1u04d4.p1); Mba'épa jajapo ko ka'aru?; Mba'épa
  rejapo ko pyhare? Aha che jarýi rógape (a1u04d4.p2); Mávapa pe mitãkuña? Che memby, héra Samanta. Ha pe karai?
  Ndaha'éi che ru, ha'e che ramói (the chat of a1u04d4.r1); Mboy arýpa rereko? Treinta (a1u04d5.p2); Areko mbohapy
  memby, now said by Ramona (a1u04d5.p1, a1u04d5.e1); Itauguápe ogakuéra iporã (a1u04d6.d5); Pe chipa iporã (the key
  of a1u04d6.e2); Pe karai che ramói, héra José (a1u04d6.r1); Mávapa pe karia'y? Che angirũ (a1u04t.11); Tania ha
  Genaro (a1u04t.15 to t.17).

### Pedagogy and keys

- **Keys that changed.** a1u01d2.e2 now keys Ñande ñañe'ẽ (two pupils, one speaks to the other of both), with the
  wrong option «Peẽ peñe'ẽ», a form with no corpus token. a1u02d4.e2 keys Moõpa («Moõpa reho, Juan?»); a1u02d4.r1
  asks where Rosa goes (Ñembýpe). a1u04d3.e2 keys Umi for two hens far from both speakers, and a1u04d6.e2 keys Pe
  for one chipá in the listener's hand; so the doubt of unit 4's list, umi as wrong for what the speaker touches,
  now touches only a1u04d3.d3 and a1u04t.10. a1u04d5.e2 has «Ndaipóri.» as a wrong reply to «Mboýpa ovale ko so'o?».
- **Left as they are.** A day's exam-style build still has the tiles of its drill build in a1u01d1 (ja + jo +
  topáta), a1u01d3 (the sentence Mba'éichapa nde réra?), a1u03d1 (che + akã + rasy) and a1u04d5 (ary + pa, built
  four times with a1u04d6.e3 and a1u04t.14): those days have no other build that is safe. A teacher who confirms one
  longer build for any of them gives the day a second one.
- **The cast**, for whoever reads the lines for sense: Ana is a teacher in Itauguá with two small children, Tania and
  Genaro; her father is Santiago, her grandfather Casimiro, her grandmother doña Ramona, her mother has no name.
  Vicente is her friend, a doctor of thirty, the son of Teresa. Rosa is a teacher with two children, Samanta and
  Tomás, and a grandfather José. Juan is a farmer with a wife, a daughter and a son. Moisés is a young doctor from
  Argentina who is learning Guarani. Vicente still goes to «la escuela» and has a teacher in six places of units 2 and
  3 (a1u02d4.p1, a1u02d4.d2, a1u02d5.r1, a1u02t.11, a1u02t.14, a1u03d6.c1).
- **Names changed on 10 November, for the synthetic voice**: Luis → Vicente, Lucas → Moisés, Carlos → Santiago (the
  exam's sample speaker → Jacinto), Pedro → Casimiro, Mateo → Genaro, Diego → Tito, Lucía → Sara, Nilda → Susana, Sofía
  → Karina, Elena → Samanta, Clara → Tania, Mirta → María, Marta → Teresa. The voice has no l, f or d and no rt, rl,
  ld or dr, and neither recogniser heard the old names right in most takes (`sound/VOICE.md`, «The names of the
  people»); the lines above quote the new names. Only names changed, in 157 items and in 21 examples, 4 compare forms,
  a rule row and the exam's sample answers: no key, no order of options and no other word moved, and no reviewer or
  blind solver has read the items since. For a native reader: are Casimiro for a grandfather, Genaro for a small boy and Tito for a young man names you
  would expect, and does a visitor called Sara or a pupil called Karina sound right in Caacupé and in a Guarani class?

### Lines above that are out of date

- «Units 2 to 4: settle first»: item 6 (unit 4 no longer says «con nde va suelto»); item 8 (one gloss each, see 1);
  item 9 (no «dos chipá» and no plain «chipa» in the Spanish); item 11 (the question mark also in unit 1, days 3 and
  4).
- Unit 2: «Moõguipa ou nde sy?» is gone (a1u02d4.e3 builds kokuégui); Roju now stands before «ko ka'aru, che jarýi»;
  a1u02d1.e3 is «Rehópa ko pyhare, Rosa?»; a1u02d4.d5 builds Itakuruvígui and a1u02d4.d6 stands in «Moõguipa peju?»;
  a1u02d6.e3 is «Ko ka'aru ndahái távape» and no longer repeats a1u02d5.e3.
- Unit 3: jaguarete has no parts; a1u03d4.c1 asks «Ndépa ñemuhára?»; a1u03d3.e1 is «Ndaha'éi che angirũ» and
  a1u03d3.e3 builds mbo'ehára; a1u03d6.d6 builds Ikane'õpa, not Og̃uahẽpa; a1u03t.14 builds ndaikatúi, not
  nachemandu'ái; in a1u03t.19 a new neighbour asks, not Rosa.
- Unit 4: only Juan says che rajy (a1u04d4.p1); «Mávapa pe mitãkuña?», not «pe kuñataĩ», in the chat of a1u04d4.r1;
  the names after héra are Santiago, Casimiro, Genaro, Samanta and José, and Ana's mother has none; «Treinta.», not
  «Veinte.», as Vicente's age; tapicha is glossed; «Ko vaka iky'a» is «Ko vaka ivare'a»; a1u04d4.e3 builds mba'e + icha
  + pa and a1u04d6.d5 builds ogakuéra («Che sy oñe'ẽ mitãnguérape» is gone; a1u04d2.d5 keeps «Mbo'ehára oñe'ẽ
  mitãnguérape»);
  a1u04d6.e2 is «Pe chipa iporã».

### Items changed since the last blind solve

Question, options, tiles, key or explanation (60): a1u01d1.d1, a1u01d2.e2, a1u01d3.d1, .d3, .d4, .d6, .e2, .r1,
a1u01d4.c1, .d6, .e2, .r1, a1u01d5.e2, a1u02d1.e3, a1u02d2.e2, .e3, a1u02d3.c1, .r1, a1u02d4.d5, .d6, .e2, .e3, .r1,
a1u02d5.d3, a1u02d6.e3, a1u03d1.d2, .d3, a1u03d3.d3, .d4, .d5, .e1, .e3, .r1, a1u03d4.c1, .d4, .e3, a1u03d6.c1, .d1,
.d3, .d6, a1u03t.14, t.19, a1u04d1.c1, .d4, .r1, a1u04d2.r1, a1u04d3.e2, a1u04d4.e3, .r1, a1u04d5.d1, .d6, .e1, .e2,
a1u04d6.d5, .e2, .r1, a1u04t.11, t.15, t.16, t.17. Only the highlight taken out of the solution shown after the
answer (13): a1u01d2.e3, a1u01d4.e3, a1u01d5.e3, a1u01d6.e3, a1u01t.13, t.14, a1u02d3.e3, a1u02d5.e3, a1u02t.14,
a1u03d2.e3, a1u03d5.e3, a1u03d6.e3, a1u04d2.e3.
