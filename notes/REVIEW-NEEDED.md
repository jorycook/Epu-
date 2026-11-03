# What still needs a native speaker

Every Guarani string in this design was checked by two independent reviewers (spelling and morphology; meaning, Spanish
and answer keys), against the research notes and real Guarani text (Common Voice sentences, the AmericasNLP and Jojajovai
corpora, Firefox, MediaWiki and LibreOffice localisations, Apertium's dictionary), and a blind solver answered every
question without the keys (101 of 103 agreed; the two others had no passage in the export and were confirmed right).
What follows could not be settled that way. A native teacher, ideally with the Academia de la Lengua Guaraní's 2016
spelling rules and its dictionary at hand, should rule on it before the lessons ship.

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
- [a1u01-d2] d6 «Iporã, ha peẽ?»: «ha nde» swapped for «ha peẽ»; no hit in the corpora or on the web. Also «Luis ha Marta:» as one speaker label, with two people asking «Mba'éichapa reiko?» together.
- [a1u01-d2] Reading «Ore roñe'ẽ guaraníme: che, che sy ha che ru.»: a list after a colon following the verb has no parallel in the corpora.
- [a1u01-d2] pyta «talón; quedarse» (4th sound pair): only Apertium gives the noun sense; the corpora have the verb. A native should confirm «talón», or drop the pair.
- [a1u01-d2] New ja-/ña- connect row: «verbo nasal» is not defined on day 2 (nasal harmony is A2). Please check that it reads clearly.
- [a1u01-d3] -gua stress: Paraguaigua follows SPL and Apertium, but ABC writes paraguáigua, távagua and tendágua. A native speaker or the Academy text should confirm that -gua is tonic.
- [a1u01-d3] Mbo'ehára héra Rosa / Temimbo'e pyahu héra Sofía: the noun + héra + name pattern is attested in usage, but teachers may prefer the textbook noun-possessor form (mbo'ehára réra Rosa).
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
- [a1u01-d6-test] «Héẽ, che Luis» for 'Sí, soy Luis' (compare form): confirm it sounds natural.
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
- [crosscheck] In the d2 reading, the new last line 'Ana' sits right after 'Ha nde?'. A reader could take it as a vocative ('¿y vos, Ana?'), though a message start addressed to Marta and a name alone on the last line read as a signature, as in the exam's 'Jajotopáta.\nRosa'. If a reviewer prefers, add the taught farewell first: 'Ha nde? Jajotopáta.\nAna'.
- [crosscheck] Two doubts stay open in doubts.json: Argentina-gua with a hyphen rests on usage, not a confirmed Academy rule, and the d4.d5 split rei- + kuaa follows the school analysis of aireal verbs.
