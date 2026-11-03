# G5 · Culture and lesson themes, the app's name and mascot, verified Guarani UI microcopy

Notes, 3 Nov 2026, for the six-level (A1–C2) Paraguayan Guarani app modelled on Yaoki [1].

**Method (read first).** WebFetch and curl failed for every Paraguayan press, government, dictionary and Wiktionary host tried (list in §7), and the shared web-search budget ran out near the end, so a few items are marked *not checked*. The evidence comes from two places:
- **Search-result pages.** The URL cited is the page the search surfaced.
- **Real Guarani text from GitHub** (raw.githubusercontent.com and `git clone` work):
  - the Guarani localisations of Firefox desktop (FX) [2], Firefox for Android (FA) [3] and Common Voice (CV) [4];
  - Common Voice's 5,882 contributed Guarani sentences (CVS) [5];
  - MediaWiki core, which is the Guarani Wikipedia interface (MW) [6];
  - LibreOffice's Paraguayan Guarani UI and locale data (LO) [7][8], and CLDR (CL) [9];
  - the AmericasNLP 2021 Guarani–Spanish parallel corpus (ANLP), about 27,000 pairs, mostly ABC Color news [10].

  For localisations I matched each string to its English source by key. For ANLP the Spanish side of each pair gives the meaning, so a Guarani word's sense is shown by its translation, not by my gloss.

**Marks.** **High** means two or more independent sources agree, or a localisation and real text agree. **Medium** means one good source, or several weak ones. **Low** means one weak source. **Composed** means I built it from attested parts; it must not ship without native review. I invented no Guarani: every composed line is labelled. Glosses marked *(gloss mine)* are my Spanish for an attested Guarani sentence.

**Characters.** I write the puso as ' and g̃ as g + U+0303. The sources differ, and the app must accept all of these:
- Firefox and the Common Voice UI use ’ (U+2019).
- CLDR's exemplar set uses ʼ (U+02BC).
- The Common Voice sentences mostly use ', with ʼ and ’ mixed in.
- The ABC Color corpus writes nasal vowels with a circumflex (î, ê) and g̃ as ĝ (U+011D).

CLDR's exemplar set is exactly the Academy's 33 letters: a ã ch e ẽ g g̃ h i ĩ j k l m mb n ñ nd ng nt o õ p r rr s t u ũ v y ỹ ʼ. It names the language **avañe’ẽ** [9].

---

## 0. Decisions in one screen

1. **Name.**
   - **"Ñapu'ã"** is grammatically right: pu'ã is nasal, so the inclusive prefix is ña-, and "ñapu'ãta" is attested. But it is the name of the 2020 COVID economic-recovery plan of Mario Abdo Benítez's government, **"Ñapu'ã Paraguay"** [12][13][14]. The First Lady's office also ran a programme called **"Ñapu'ãke"** [15]. As an app name it would read as a government slogan.
   - **Recommended: "Epu'ã"** ("¡Levantate!"), an attested imperative. Pair it with a line attested word for word in Common Voice, **"Epu'ã ha eñepyrũjey"** ("Levantate y empezá de nuevo") [5].
   - The brand and trademark check for "Epu'ã" is *not done*.
2. **Mascot (superseded: see G8).** *Tatu* is Paraguayan vulgar slang for "vagina", printed as such in the Krivoshein–Acosta dictionary, so the mascot is now Kaguare, a southern tamandua (G8). The first choice was a **tatu bolita** (three-banded armadillo, *Tolypeutes matacus*). It is the only Paraguayan armadillo that rolls into an almost perfect ball [23], which fits Yaoki's knock-over-and-pop-up mechanic.
   - Caveat: FIFA's 2014 World Cup mascot Fuleco was a three-banded armadillo (the Brazilian species) [25].
   - The **karumbe** (tortoise) fits as the slow-listening icon.
3. **The proverb** "Ho'a pokõi jey, opu'ã poapy jey" ("se cae siete veces, se levanta ocho") is built entirely from attested parts, but it is **composed**, and the numerals 7 and 8 are school register. It needs a native check.
4. **Weekdays.** Two mappings are in use, and they conflict.
   - LibreOffice's Paraguayan locale, the ABC Color Guarani news and the University of Kansas Acceso course all make **arateĩ = domingo … arapokõi = sábado** [8][10][16].
   - Some learner sites make arateĩ = lunes [17].
   - Settle this with the Academia. Everyday Guarani speech uses Spanish day names ("Ko lune…") [10].
5. **UI policy.** Use a Spanish-first interface with Guarani labels taken from real localisations ("Ehendu · Escuchar"); §3 has 93 rows (100+ terms), 64 of them rated high. On input, normalise ' ’ ʼ ´, ĝ → g̃ and circumflex → tilde.
6. **Respect.**
   - Call the variety *guaraní paraguayo (avañe'ẽ)*.
   - The six Guarani-family Indigenous peoples (Aché, Avá Guaraní, Mbya, Paĩ Tavyterã, Guaraní Ñandéva, Guaraní Occidental) speak their own languages. The 2022 census counted about 140,000 Indigenous people in 19 peoples [38].
   - Use no sacred texts or feathers as decoration.
7. **Look.**
   - Ñandutí's radial "sun/wheel" geometry for progress rings.
   - Ao po'i cotton cream for paper; the fine black-and-white stripes of the poncho para'i.
   - Lapacho pink and yellow, and red earth.
   - Avoid a palette dominated by pure party red or blue. Colorados and liberales are *kolo'o* and *choguy* in the news corpus [10]; the party colours themselves are general knowledge, not checked.

---

## 1. The name

### 1.1 What the sources show about pu'ã ("levantarse")

| Form | Meaning in context (Spanish from the source unless marked) | Source | Conf. |
|---|---|---|---|
| apu'ã | "me levanté": *péicha apu'ã ha añorãirõ* = "así que me levanté y di pelea"; *Apu'ã aimehágui* | ANLP, CVS | high |
| epu'ã | imperative: *Epu'ã ha ejesareko yvytyrusúre…* = "Levántate y mira por las montañas…"; *Epu'ã ha eñembo'y porã* = "Póngase en posición de firmes"; **epu'ã ha eñepyrũjey** | ANLP, CVS | high |
| opu'ã | "se levanta": *opo sapy'a opu'ã jagua* = "el perro se levanta violentamente". Also "se alza", in a political sense: *Si pueblo opu'ã, umi anguja oho* = "Si el pueblo se levanta, las ratas se van". Also "contra": *movilización … opu'ãva tiranía* | ANLP | high |
| ñapu'ã | 1pl inclusive: *Kupyju opurahéi mboyve ñapu'ãta* ("nos levantaremos antes de que cante el kupyju", gloss mine) | CVS | high |
| opu'ã jey | "se recupera": *ikatu haguã opu'ã jey economía rural ha urbana* | ANLP | high |
| (oñe)mopu'ã (jey) | causative "construir, (re)levantar": *oñemopu'ã haguã mo'ehaokory* ("para construir aulas") | ANLP | high |
| akãrapu'ã | "progreso, desarrollo": *añeakãrapu'ã* = "podría progresar". CV renders "Today's progress" as *Mboýpa ñañakãrapu'ã ko árape* | ANLP, CV | high |
| Akã Pu'ã | name of a coalition for conscientious objection ("Articulación Akã Pu'ã") | ANLP | medium |

### 1.2 Candidates

| Candidate | Grammar and meaning | Associations found | Verdict |
|---|---|---|---|
| **Ñapu'ã** | ña- + pu'ã: "nos levantamos (vos y yo)"; correct by nasal harmony | **Ñapu'ã Paraguay**: the 2020 recovery plan of the Abdo Benítez government, about US$1.37 bn [11], with a public monitoring site [12][13][14]. **Ñapu'ãke**: a programme of the First Lady's office (OPD) with 68,155 beneficiaries [15]. Unofficial subsidy pages on Facebook [15] | Avoid as the app name. Excellent as an A1 sentence for ñande vs. ore |
| **Epu'ã** | imperative: "¡Levantate!" | none found (no brand search was possible) | **Recommended**, after trademark and native checks |
| Opu'ã jey | "se levanta otra vez; se recupera" | economic-recovery wording; opu'ã also means "rise up against". A Christian "resurrection" sense is *not checked* | Good tagline or stamp; weaker as a name |
| Pu'ã | bare root, not said on its own | "Akã Pu'ã" coalition; the protest sense | Avoid as a name |
| Poapy | "ocho": *poapy aravo* = "ocho horas" [10] | none found ("Po Paraguay" is an unrelated maker of 3D-printed prostheses) | A nod to the 八 in Yaoki, but bookish. Use it for a badge, not the app |

### 1.3 "Fall seven times, get up eight" in Guarani

| Piece | Evidence |
|---|---|
| ho'a "(se) cae" | *ha ho'a omanoite voi* = "y cayó muerto"; *ama ho'áva* = "lluvia que cae". Other persons: *ja'a* "hemos caído", *re'a* "caíste", *ho'áta hikuái* "van a caer" [10][5] |
| pokõi 7, poapy 8 | *pokõi yvykandu* = "siete lomas"; *Oguereko pokõi ary*; *peteĩ ary poapy jasy* = "un año y ocho meses" [10][5] |
| numeral + jey = "N veces" | *ohapejoko mokõi jey* = "detener en dos ocasiones"; *oñembyatýva mbohapy jey arapokõindýpe* = "se reúne tres veces por semana"; *heta jey* = "muchas veces"; *sa jey* = "cien veces"; *peteĩ jey* = "una vez más" [10] |

All three of these lines are **composed**:
- **A.** *Ho'a pokõi jey, opu'ã poapy jey.* "Se cae siete veces, se levanta ocho." This is closest to the Japanese.
- **B.** *Ja'a pokõi jey, ñapu'ã poapy jey.* "Caemos siete veces, nos levantamos ocho." Warmer, but it carries the Ñapu'ã association.
- **C.** *Re'a pokõi jey, epu'ã poapy jey.* "Te caés siete veces: levantate ocho." This is the coach's voice and matches the name Epu'ã.

**Caveats.**
- *Jey* also means "otra vez", so a native should judge whether "opu'ã poapy jey" sounds like "eight times".
- Search results say the Guarani numerals from 4 up are mostly academic, and that speech uses Spanish numbers [18]. Native speakers may hear the line as school Guarani.
- The attested fallback is *Epu'ã ha eñepyrũjey* [5].

---

## 2. The mascot

> **Superseded on 3 Nov 2026 by G8.** This section records the first choice, the tatu bolita named Tatu'i. The owner rejected it: *tatu* is Paraguayan vulgar slang for "vagina" (the Krivoshein–Acosta dictionary prints "tatu. s. Armadillo. 2. Vulva."), a sense this section's screen did not find. The mascot is now Kaguare, a southern tamandua.

| Candidate | Guarani | Why it fits | Associations and sensitivities | Verdict |
|---|---|---|---|---|
| **Tatu bolita** (*Tolypeutes matacus*) | *tatu* "armadillo" (high: Spanish *tatú* is borrowed from Paraguayan Guarani [28]). Paraguayan usage is *tatú bolita* [22][23]. Species names are reported only weakly: *tatu apara* (Ruiz de Montoya 1639, via a blog transcription) and *tatú-apepú* (an Argentine fauna blog) [24], both low | The only Paraguayan armadillo that rolls into an almost perfect ball [23]; a Chaco species [22]; the "squashed flat, pops back up" mechanic of Yaoki's Falling game [1] | FIFA's Fuleco (2014) was a three-banded armadillo [25]. Armadillos are hunted. Avoid the look of the *tatu ai* (*Cabassous*): one source ties its name to eating the dead [24]. An Ava Guaraní/Chané myth has the trickster Aguara kill the armadillo Tatu-tunpa [26]; do not borrow it. A slang sense of *tatu* was **not found but not ruled out**; ask | **Recommended.** Working name *Tatu'i*: -'i is the regular diminutive (*marandu'i* "aviso", *aravo'i* "minuto", *jehai'i* "nota" [3][2]), but "tatu'i" itself is unattested |
| **Karumbe** (tortoise) | *karumbe* (high: LO's turtle emoji [7]; *karumbe guasu* in a Chaco fauna list; *karumbe* = "tortugas" [10]) | Slow and steady daily practice. A tortoise rights itself when flipped. A turtle is the usual icon for slow playback | A traditional vehicle of Villarrica, in use since 1940, is also called the *karumbe* [27]: a charming local tie (I recall it is horse-drawn; not checked). Slowness clashes with the speed games | **Secondary character**: the "Ehendu mbeguemi" (escuchar despacio) button |
| Kururu (toad) / ju'i (frog) | *kururu* [5]; *ju'i* [7] | the star of *he'i kururu* sayings (§4.4) | *kururu guasu* = "ametralladora pesada" in the corpus [10]; ugliness in sayings | Use for proverb lessons only |

---

## 3. UI microcopy glossary (Spanish → Guarani)

Each source is a real localisation string (key-matched to English) or real text. The Guarani is shown with ' normalised.

### 3.1 Actions and navigation

| Español | Guaraní | Variants seen | Src | Conf. |
|---|---|---|---|---|
| Empezar | Ñepyrũ (imperative Eñepyrũ) | Ñepyrũha "inicio" | LO (12×), FA, CV, FX | high |
| Continuar | Eku'ejey / Ku'ejey | — | FA (6×), CV | high |
| Siguiente | Upeigua | Tenonde | FX, CV | high |
| Anterior | Mboyvegua | — | FX, MW | high |
| Atrás / Volver | Tapykue | Guevijey, Tapykuevegua, Atukupegua (FX wizard); Ejevy "volvé" (MW) | FA, CV, FX | high |
| Cerrar | Mboty / Emboty | — | FA (10×), LO, CV | high |
| Listo, hecho | Oĩma | Apopyre, Japopyre | FA, MW ("OK") | high |
| Terminar | Mbopaha | Emohu'ã "finalizá"; Momba (LO) | FX | medium |
| Cancelar | Heja | Mbotove (MW, CV) | FX, FA, CV | high |
| Aceptar | Moneĩ | — | FX, FA | high |
| Sí / No | Héẽ / Nahániri | — | FX, FA, CV | high |
| Guardar / Guardado | Ñongatu / Ñongatupyre | — | FX, FA, CV, LO | high |
| Borrar | Mboguete | Embogue. **Avoid LO's *Juka*** ("matar") | FA (15×), CV | high |
| Agregar | Mbojuaju / Embojuaju | Moĩ (LO) | FA, CV | high |
| Editar | Mbosako'i | Jehaijey (MW) | FA, FX, CV | high |
| Buscar | Heka / Eheka | — | FX, FA, CV, MW | high |
| Ayuda | Pytyvõ | Pytyvõhára (MW) | FX, CV, LO | high |
| Ajustes | Ñemboheko | Ñemyatyrõ, Jeporavorã, Poravorã | FA, FX, CV | high |
| Menú | Poravoha | Poravorã | FX (14), FA, CV | high |
| Compartir | Moherakuã | — | FA | high |
| Deshacer | Mboguevi | — | FA, FX | high |
| Saltar (omitir) | Jepo | Ehejarei (FA), Ehasa "pasá" (FX) | CV, FX | medium |
| Ahora no / Más tarde | Ani ko'ág̃a / Ag̃ave, Upéi | — | FA | high |
| Más información | Eikuaave | Kuaave | FA, FX | high |
| Copia de seguridad / Restaurar | Ñongatujey / Eguerujey | Embojevy | FX, FA | medium |
| Descargar | Emboguejy | — | FA | high |
| Bloqueado | Jokopyre | Joko "bloquear, detener" | FA, LO, CV | medium (sense is "blocked") |
| Nuevo | Pyahu | — | FA, LO, ANLP (153) | high |
| Otra vez | -jey / jey | — | FA, CV, ANLP | high |
| Intentá de nuevo | Eha'ã jey | Eha'ã jey ag̃amieve "más tarde" | FA, CV | high |

### 3.2 Feedback, rewards and Yaoki's stamps

| Español [Yaoki slot] | Guaraní | Variants seen | Src | Conf. |
|---|---|---|---|---|
| ¡Muy bien! [はなまる] | ¡Iporãiterei! | ¡Oĩ porãiterei! ("Great!") | CVS, CV | high |
| ¡Muy bien hecho! [たいへんよくできました] | ¡Iporãitereíma ne rembiapo! | ¡Emba'apo porã! ("Nice work") | CV, FX | medium-high |
| ¡Bien! | ¡Iporã! | ¡Oĩ porã! ("It's great!") | FX, FA | high |
| ¡Seguí así! | ¡Eku'e péicha! | — | FX (one string) | medium |
| ¡Buen comienzo! / ¡Ya casi! / ¡Mitad del camino! | ¡Eñepyrũ porã! / ¡Oĩpotaite! / ¡Eiméma tape ku'ápe! | ¡Ñepyrũ guasu! (FX) | FA | medium |
| ¡Felicitaciones! | ¡Vy'apavẽmante! | *vy'apavẽ* alone = "felicidad" (ANLP, CVS) | FA | medium |
| Correcto | Oĩ porã | Hekoitépe "correctamente" (ANLP); Heko katu (LO) | FA, ANLP | medium |
| Error / Incorrecto | Jejavy (noun); ojavy "se equivocó" | Heko katu'ỹ (LO); Javy (FA) | LO, ANLP | medium |
| Gracias / Muchas gracias | Aguyje / Aguyjevete | Aguyje mante | CV, CVS, FA | high |
| Perdón | Cheñyrõmi | Rombyasy "lo sentimos" (CV) | CVS | high |
| Bienvenido/a; bienvenidos | Tereg̃uahẽ porãite; Tapeg̃uahẽ porãite | Eg̃uahẽ porãite (FA, MW) | CVS | high |
| [起] Se levantó | **Opu'ã** | Apu'ã "me levanté" | ANLP, CVS | high (as a stamp: composed use) |
| [済] Listo | **Oĩma** | ¿Oĩmbáma? "¿listo?" | FA, MW, FX | high |
| Line after a fall | **Epu'ã ha eñepyrũjey** | — | CVS, verbatim | high |
| Racha [連続] | — (gap) | CV's "Streaks" = *Jehupytyrã*, a mistranslation ("meta"). Use "{n} jey", an attested pattern | CV, ANLP | low |
| Meta / Meta cumplida | Jehupytyrã / Ojehupytymáva | *jehupytyrã* ↔ "objetivo" (ANLP) | CV, ANLP | high |
| Meta semanal / por día | Jehupytyrã arapokõindypegua / ára ñavõme | — | CV | high |
| Progreso / Paso | Jeku'e / jeku'e | ¡Tuicha emotenonde! ("Great progress!") | CV, FA | medium-high |
| Camino | Tape | — | LO, FA | high |

### 3.3 Course and study words

| Español | Guaraní | Notes | Src | Conf. |
|---|---|---|---|---|
| Lección, clase | Mbo'epy | *KÁRMA MBO'EPY* = "LECCIÓN DE KARMA" | ANLP | medium-high |
| Escuela / docente / alumno | Mbo'ehao / Mbo'ehára / Temimbo'e | — | ANLP | high |
| Examen | Aranduchauka | *heta aranduchauka rire* = "tras aprobar rigurosos exámenes" | ANLP | medium |
| Práctica | Ñembokatupyry ("capacitación") | *jepokuaa* "costumbre, práctica" | FA, ANLP | medium |
| Repaso / Repasar | Jehechajey / Ehechajey | — | CV, LO | high |
| Pregunta / Respondé | Porandu / Embohovái | — | CV, FA | high |
| Palabra | Ñe'ẽ | also "lengua"; pl. *ñe'ẽkuéra* | CV, LO, ANLP | high |
| Oración (gramatical), frase | Ñe'ẽjoaju | also spelled *ñe'ẽjuaju*. **Spanish "oración" (rezo) is *ñembo'e*** | CV (95 strings), ANLP | high |
| Texto | Moñe'ẽrã | — | LO (60×), FX, FA | high |
| Significado | He'iséva; ¿Mba'épa he'ise? | — | ANLP | medium-high |
| Ejemplo | Techapyrã | — | LO, ANLP (30), FA | high |
| Traducción | Ñe'ẽasa / Ñemoñe'ẽasa | — | FX, FA | high |
| Diccionario | Ñe'ẽryru | — | FX, LO | high |
| Biblioteca | Arandukarenda | Arandukaty, Arandukakoty, Mba'erysýi | FA, FX, ANLP | high (pick one) |
| Nivel / Unidad | *nivel*, *unidad* | kept in Spanish inside Guarani news text | ANLP, LO | medium |
| Cuaderno | — (gap) | LO keeps "cuaderno"; *jehai'i* = "nota" (FA) | LO, FA | low |
| Gramática / Vocabulario | — (gap) | *Ñe'ẽtekuaa* for grammar is from memory and **not checked** | — | low |
| Constancia / certificado | Mboajepyre | FX uses it for web certificates | FX | medium-low |

### 3.4 Skills, sound and speech

| Español | Guaraní | Src | Conf. |
|---|---|---|---|
| Escuchar (noun: comprensión auditiva) | Ehendu (Ñehendu) | CV; FA *kuatiarogue ñehendu*; ANLP | high |
| Escuchar otra vez | Ehendujey | CV | high |
| Escuchar despacio | *Ehendu mbeguemi* (**composed**: *mbeguemi* attested as "despacito" in *Eporohetũ mbeguemi*; *mbegue* = "lento") | CV + CVS | low |
| Hablá (ahora) | Eñe'ẽ (ko'ág̃a) | CV, FA | high |
| Leer (noun: lectura) | Emoñe'ẽ (Ñemoñe'ẽ) | CV, MW, ANLP | high |
| Escribir (noun: escritura) | Ehai (Jehai) | CV, ANLP | high |
| Conversación | Ñemongeta | MW, ANLP | high |
| Pronunció bien / pronunciación | *ombohyapu porã* / *ñe'ẽ ñembohyapu* | CV | medium-low |
| The four exam skills | Ñehendu · Ñemoñe'ẽ · Jehai · Ñe'ẽ (or Ñemongeta) | assembled from the rows above; the MEC's own names were **not checked** | medium |
| Mediación | — (gap; keep the Spanish) | — | — |
| Sonido / ruido | Mba'epu / tyapu | FA, FX, CV | high |
| Silenciar / Activar sonido | Mokirirĩ / Mba'epu mbojevy | FX | high |
| Reproducir / Detener / Pausa | Mbopu / Joko / Mombyta | CV, FX | medium-high |
| Grabá tu voz | Eñongatu nde ahy'o | CV | medium |
| Micrófono | Ñe'ẽatãha | FA. FX uses the same word for "altavoz"; CV has *ñe'ẽmbotuichaha* | medium-low |
| Activado / Desactivado | Hendy / Ogue | FA | high |
| Notificaciones | Ñemomarandu | FA | high |
| Cuenta / perfil | Mba'ete | FX, FA, CV | high |
| Tema claro / oscuro | Tesakã / Ypytũ | FA | high |

### 3.5 Time

| Español | Guaraní | Src | Conf. |
|---|---|---|---|
| Día / Semana / Mes / Año | Ára / Arapokõindy / Jasy / Ary | FX, FA, CV, ANLP. LO's "Año = Ára" is an error | high |
| Hora / Minuto / Segundo | Aravo / Aravo'i / Aravo'ive | FX | high |
| Hoy | Ko árape (also written Ko'árape, Ko'ára, Ko ára) | FA, FX, CV | high (fix one spelling) |
| Mañana (next day) / Ayer | Ko'ẽrõ / Kuehe | FA, ANLP (87) | high |
| Mañana (time of day) | Pyhareve | ANLP (114) | high |
| ¡Hasta mañana! | *Jajotopáta ko'ẽrõ* (**composed** from two attested parts); *Ko'ẽrõ peve* (pattern only, unattested) | CVS, FA | medium-low |
| Calendario | Arapapaha | FX | medium |

### 3.6 Days, months, numbers 1–31

**Days.** The Spanish counts are from ANLP.

| Guaraní | Sunday-first [8][10][16] | Note |
|---|---|---|
| arateĩ | domingo (42/52) | learner sites: "lunes" [17] |
| arakõi | lunes (27/27) | — |
| araapy | martes (8/9) | — |
| ararundy | miércoles (24/30) | — |
| arapo | jueves (6/6) | — |
| arapoteĩ | viernes (30/33) | — |
| arapokõi | sábado (20/30) | — |

Note that *arapokõindy* "semana" means "seven days".

**Months** (high). Sources: LO [8], ANLP (for example jasyrundy → abril 46/49, jasypakõi → diciembre 43/44), and FA (*14 jasyapy mboyve* = "before March 14").

| Mes | Guaraní | Mes | Guaraní |
|---|---|---|---|
| enero | Jasyteĩ | julio | Jasypokõi |
| febrero | Jasykõi | agosto | Jasypoapy |
| marzo | Jasyapy | septiembre | Jasyporundy |
| abril | Jasyrundy | octubre | Jasypa |
| mayo | Jasypo | noviembre | Jasypateĩ |
| junio | Jasypoteĩ | diciembre | Jasypakõi |

**Numbers.**

| N | Guaraní | N | Guaraní | N | Guaraní |
|---|---|---|---|---|---|
| 1 | peteĩ | 12 | pakõi | 23 | mokõipa mbohapy |
| 2 | mokõi | 13 | paapy (Omniglot: pa'apy) | 24 | mokõipa irundy* |
| 3 | mbohapy | 14 | parundy | 25 | mokõipa po* |
| 4 | irundy | 15 | papo | 26 | mokõipa poteĩ* |
| 5 | po | 16 | papoteĩ | 27 | mokõipa pokõi* |
| 6 | poteĩ | 17 | papokõi | 28 | mokõipa poapy* |
| 7 | pokõi | 18 | papoapy | 29 | mokõipa porundy* |
| 8 | poapy | 19 | paporundy | 30 | mbohapypa |
| 9 | porundy | 20 | mokõipa | 31 | mbohapypa peteĩ* |
| 10 | pa | 21 | mokõipa peteĩ | | |
| 11 | pateĩ | 22 | mokõipa mokõi | | |

Sources: 4–16 come from a run of CVS sentences (*Oguereko pa ary.* … *Oguereko papoteĩ ary.*) [5]. 6, 7, 8, 9, 12 and 20 are confirmed against Spanish in ANLP. 17–23 and 30 come from Omniglot and two other tables via search [18]. * = follows the stated rule (no space up to 19 and in the tens; a space before the unit from 21) but is not attested.

**Usage.** Speakers use Spanish numerals from 4 upwards [18]. Prices and times appear that way even inside Guarani text (*11:00 aravo*, *G. 98 millones*) [10].

### 3.7 Gaps

No attested Guarani was found for: racha, sello, pista, cuaderno, gramática, vocabulario, mediación, unidad, nivel.

Options:
- Keep the Spanish word.
- Use an attested near-synonym: for the hint button *Pytyvõ* ("ayuda"); for a streak count "{n} jey".
- Have a native speaker coin one.

---

## 4. Lesson themes rooted in everyday Paraguay

### 4.1 Greetings and courtesy (A1 U1)

| Guaraní | Español | Evidence | Conf. |
|---|---|---|---|
| Mba'éichapa? | ¡Hola! ¿Cómo estás? (literally "¿cómo?") | a traveller guide (general greeting) [19]; 92 CVS sentences use the word; G7 [43] | high |
| Mba'éichapa reiko? | ¿Cómo estás? (¿cómo andás?) | CVS *Mba'éichapa reiko.*; an Italian course [19] | high |
| Iporã, ha nde? | Bien, ¿y vos? | CVS *Iporã. Ha nde. Mba'éichapa reiko.* | high |
| Mba'éichapa nde pyhareve? | Buen día | CVS (verbatim); Q&A sites | high |
| Mba'éichapa nde ka'aru? | Buenas tardes | ANLP *– Mba'éichapa nde ka'aru pa'i.* = "Qué tal la tarde, cura". Some sites write *ne ka'aru* | medium-high |
| Mba'éichapa nde pyhare? | Buenas noches | Q&A site only (via search) | low |
| Maitei; Maitei horyvéva | Saludos; saludos cordiales | CVS *Maitei horyvéva ndéve.*; *Che maitei nde jarýi ha nde taitaguasúpe.* | high |
| Aguyje; Aguyjevete; Aguyje mante | Gracias; muchas gracias; gracias nomás | CVS, CV | high |
| Jajotopáta | Nos vemos | CVS *Jajotopáta ko pyhare.* (esta noche); *Jajotopáta kurive.* (al rato) | high (with the accent) |
| Jajohecha peve | Hasta que nos veamos | CVS | high |
| Tereg̃uahẽ porãite | Bienvenido/a | CVS; FA and MW have *Eg̃uahẽ porãite* | high |
| Ikatúpa aike? | ¿Puedo pasar? | CVS; also *Ikatúpa aporandumi ndéve peteĩ mba'e* ("¿te puedo preguntar algo?", gloss mine) | high |
| Cheñyrõmi | Disculpá, perdoná | CVS *Cheñyrõmi.*; *Cheñyrõke ña Dominga.* | high |
| Che réra … / Mba'éichapa nde réra? | Me llamo … / ¿Cómo te llamás? | G7 [43]; CVS *Mba'éichapa nde sy réra.* | high |
| Mba'eteko? | ¿Qué tal? (colloquial) | ANLP *Ha ko'áĝa piko, mba'eteko?* = "Y ahora, ¿qué piensa?" | medium (sense varies) |

**Spelling point for "Sonido y letra".** Guarani writes final stress unmarked, while Spanish marks it. Compare Guarani *terere* (CVS, 44 times) with Spanish *tereré*, *ñanduti* with *ñandutí*, and *Paraguái* with *Paraguay*.

### 4.2 Themes by domain

Vocabulary is attested, with the source's Spanish where one exists; (g) = gloss mine.

| Theme (level) | Attested vocabulary | Cultural hook (verified) |
|---|---|---|
| Familia (A1) | *sy* madre, *memby* hijo/a, *jarýi* abuela, *taitaguasu* abuelo, *hembireko* esposa (all g; the *memby* vs. *ta'ýra* split by the parent's sex was not checked) [5] | the family mate: *okay'u hembireko ndive* ("tomaba mate con su esposa", g) |
| Comida y bebida (A1–A2) | *tembi'u* comida; *chipa*, *chipa guasu*, *sópa paraguái* (CVS: *sopa paraguaya*); *mbeju*; *mandi'o*, *avati*, *kumanda*; *ka'ay he'ẽ* = "mate dulce"; *kure ñandy* (grasa de cerdo, g); *kamby* (leche, g) [10][5] | Tereré: UNESCO Representative List 2020 (15.COM), "Prácticas y saberes tradicionales del tereré en la cultura del pohã ñana, bebida ancestral guaraní en Paraguay" [33]; national drink by Ley 4261/2011 [33]; prized in the Chaco War for lack of water [10]. *Vori vori* and *so'o josopy* were **not found** in reachable sources |
| Mercado (A1–A2) | *pohã ñana* = yuyos; the yuyeros' stalls; money *viru*, *pirapire* [10][4] | Mercado 4 makes 100 litres of carrulim [32]; prices in Spanish numerals |
| Transporte (A2) | *mba'yru*, *mba'yrumýi* (vehículo, auto, g), *kavaju*, *kamiõ*, *tape*, *ruta* [5]; *línea 15-2* [10] | Villarrica's karumbe [27] |
| Casa (A1–A2) | *óga/róga*, *ogaygua* (los de la casa, g), *korapy*, *kosina*, *okẽ*, *apyka*, *tata* [5] | stories told around the fire: *tata jerére* [10] |
| Escuela (A2) | *mbo'ehao*, *mbo'ehára*, *temimbo'e*, *mbo'epy*, *aranduka*, *arandukakoty*, *aranduchauka* [10] | Día del Idioma Guaraní (§4.3) |
| Trabajo (A2–B1) | *mba'apo*, *tembiapo*, *aravo* (*poapy aravo* = "ocho horas") [10] | — |
| Salud y pohã ñana (B1) | *pohã*, *pohã ñana*, *pohãnohára* (sanador, médico, g), *hasy* (*tapicha hasýva* = "pacientes") [10][5] | Carrulim on 1 August (§4.3). **Present remedies as culture, not as medical advice**: doctors urge moderation [32] |
| Naturaleza y animales (A2) | *tatu, karumbe guasu, jurumi, jaguarete, ka'i, mborevi, ñandu, charata, tagua* (Cerro León list) [10]; *kururu, ju'i, mbói, panambi, tajy, yvyra, ka'aguy, ama* [5][7][10] | Tajy is the national tree: Ley 4631/2012 covers all *Tabebuia* and *Handroanthus* [37] |
| Fiestas (A2–B1) | *San Juan ára*; *kambuchi jejoka* (CVS); *Arareñói* = Navidad (*Arareñói niko ñyrõ ára* = "La Navidad es el tiempo del perdón") [10] | §4.3 |
| Música (B1–C1) | *purahéi* canción, *purahéi apohára* compositor, *ñe'ẽpapára* poeta [10]; *arpa paraguaya mbopuha* [5] | guarania and authors in G7 [43] |
| Artesanía (B1) | *ñanduti*, *ao po'i*, *kambuchi* (cántaro) [5][10] | §5 |
| Leyendas (B1–C2) | *Jasy Jatere, pombéro, luisõ, póra, pláta yvyguy*, told "around the fire with mate dulce" [10]; *Perurimá* (*ko'ã káso Perurimá* = "Los casos de Perurimá") [10] | the seven sons of Tau and Kerana: Teju Jagua, Mbói Tu'i, Moñái, Jasy Jatere, Kurupi, Ao Ao and Luisõ, spread by Narciso R. Colmán [39]. **Sensitive:** Tau's abduction of Kerana and Kurupi as an abductor of women [39]; adapt for the audience |

### 4.3 Calendar of customs

| Date | Custom | Source |
|---|---|---|
| Holy Week | food preparation starts on Holy Wednesday: *Pe ararundy (miércoles) voi guive oñemba'apóma tembi'u aporã* = "El miércoles santo bien temprano se inicia un gran trabajo colectivo a fin de preparar los alimentos tradicionales" | [10] |
| 19 June | Día del Árbol (tajy) | [37] |
| 24 June | **San Juan Ára**: *pelota tata* (a burning ball of rags), *toro candil*, *yvyra sỹi* (greasy pole), *kambuchi jejoka* (breaking the jar), *Judas kái* (burning an effigy, often of a politician), *tata ári jehasa* (walking on embers) | [30] |
| 1 August | **Carrulim** (*ca*ña, *ru*da, *lim*ón): seven sips on an empty stomach to keep away bad luck; declared intangible heritage by the SNC in 2019 | [32] |
| 25 August | **Día del Idioma Guaraní**. The 1967 Constitution made Guarani a *national* language, and the Asociación de Profesores de Lengua Guaraní chose the date in 1979. Guarani has been *official* since 1992. Some outlets wrongly say it was official in 1967 | [29] |
| 1 October | **Karai Octubre**: eat *jopara* (beans and locro) to ward off scarcity. Note that *jopara* also means "mezcla" | [31][5] |
| 8 December | pilgrimage to Caacupé, the patron saint [42] (CVS: *Og̃uahẽkuri hikuái Ka'akupépe oguata rire Itakuruvi guive*). The date is from memory and **not checked** | [5][42] |

A national ñandutí day was set by law; its date was *not checked* [34].

### 4.4 Ñe'ẽnga (proverbs)

- **What they are.** Última Hora, quoting Mario Rubén Álvarez, describes ñe'ẽnga as "short sayings and comparisons, often humorous, drawn from popular experience". Their meaning lies beyond the literal words, and they are common in the countryside and in urban neighbourhoods of migrants from the interior [20].
- **The standard collection** is Domingo Adolfo Aguilera, *Ñe'enga: Dichos populares paraguayos* (CEPAG, 1996) [21]. Source the B2–C2 proverb lessons from it, with a native reviewer.
- **Verified so far.**
  - The *he'i* type ("…, dijo el sapo"), all with **glosses mine**, attested in CVS [5]:
    - *Kóvape ajokáta che rye, he'i kururu ohechárõ kamiõ ilu rendy oúvo* ("Con esto lleno la panza, dijo el sapo al ver venir un camión con las luces encendidas").
    - *Aguapyhápevoi aju, he'i kururu oñeme'ẽrõ chupe apyka* ("Justo a sentarme vine, dijo el sapo cuando le ofrecieron una silla").
  - G7 [43] has three more from one source, including *Ivai la cuadro, he'i kururu…*.
  - A Jopara refrán with its source's Spanish [10]: *Ñandejára oporoñyrõ imarangatúgui, yvypóra oñeha'ã operdona haguã… pero naturaleza no perdonái avavépe* = "Dios perdona porque es bueno, el hombre se esfuerza por perdonar… pero la naturaleza no perdona".
- **Not verified.** Última Hora glosses "quien mucho habla, mucho se equivoca", "la basura esconde el fuego" and *paila rembe* "persona molesta" [20], but the search snippets did not show the Guarani text.

### 4.5 Paraguayan Guarani and the Indigenous Guarani peoples

- **The facts.**
  - The 2022 census counted about 140,000 Indigenous people (UNICEF: 140,039, 2.3%) in 19 peoples and 5 language families [38].
  - The Guarani family comprises the Aché, Avá Guaraní, Mbya, Paĩ Tavyterã, Guaraní Ñandéva and Guaraní Occidental [38].
  - Paĩ Tavyterã land at Yvy Pyte has faced invasions since 2021 [38].
  - Two Indigenous languages are weakening under the influence of Guarani and Spanish [38]: Paraguayan Guarani is itself a majority language that puts pressure on others.
  - The "alianza hispano-guaraní" is a national founding myth [41].
- **What follows for the app.**
  1. Name the variety (*guaraní paraguayo, avañe'ẽ*), and add a "Sobre el guaraní" page that names the six peoples and says that their languages are not "dialects" of the course language.
  2. Treat the Tau–Kerana monsters as Paraguayan folklore spread by a 20th-century author, not as Indigenous religion.
  3. Do not use Indigenous sacred texts or terms (*Ayvu Rapyta*, *ñe'ẽ porã*) for gamification or decoration. The C2 awareness unit in G7 should quote published scholarship and credit its sources.
  4. Do not dress the mascot in feathers or headdresses, and do not use Andean motifs, which are not Paraguayan.
  5. Use Indigenous voices or images only with the community's consent.

---

## 5. Visual culture for the look

| Element | Verified facts | Use in the app |
|---|---|---|
| **Ñandutí** | Needle lace on frames, in white thread or bright colours. Itauguá is its capital, Pirayú another centre. Itauguá motifs are round, "like suns or wheels". Motif (*dechado*) names include *ara sape, arasa poty, avati poty, buey pypore, hesa cuatro, hesa ocho, takuru, farol*. *Jehesa'o* is removing the lace from the cloth. The name is glossed "tela de araña" (the RAE: from *ñandutĩ* "araña blanca") [34] | Radial ñandutí geometry for Yaoki's stage rings and the progress dial. Each level's ring can take a named *dechado*, with its name shown as a learning item. Keep it as line art, not doily clutter |
| **Ao po'i** | "Tela fina o prenda delicada"; from Yataity del Guairá in the 19th century; native cotton, all handmade; denomination of origin (DINAPI, 2019) [35]; public servants wear it on Fridays [35] | Cream cotton texture for the paper and notebook; fine embroidery borders for cards. A "viernes de ao po'i" theme day |
| **Poncho para'i de 60 listas** | Piribebuy; UNESCO Urgent Safeguarding List, December 2023; three parts: body, fringes and *fajita* (guarda). A local legend ties the name to 60 soldiers buried in white and black ponchos [36] | Fine black-and-white stripes as a divider or the plan's week bar. Respect its war memory: not for jokes or "fail" screens |
| **Tajy (lapacho)** | National tree (Ley 4631/2012); a "winter bloom"; *tajy sa'yju* is named in the press (*sa'yju* = "amarillo", not checked); Día del Árbol on 19 June [37]. *Pytãũ* means "morado" [3] | Pink/magenta and yellow accents; a seasonal skin from July to September |
| **Mburukuja** | Its status as national flower was **not confirmed**. Radio Mburukuja is the station of the murdered journalist Santiago Leguizamón [10] | A decorative flower, but make no "national flower" claim |
| **Yvy pytã (tierra colorada)** | A Paraguayan fashion brand's collection *Yvy pyta* is glossed "tierra roja / colorada" [40]; Yvy Pytã is also a district in Canindeyú [10] | Terracotta as the base warm colour |

**Authentic, not touristic.** Draw on everyday objects (termo and guampa, the chipa basket, the market's yuyos), real motif names, red-earth roads and the lapacho season.

Avoid:
- generic "tribal" zigzags and feathers;
- Andean llamas and panpipes;
- flag-waving;
- a palette dominated by pure Colorado red or Liberal blue (*kolo'o* and *choguy* in the news [10]).

**Proposed palette** (my proposal, not from a source): tierra colorada #A8432A, tajy pink #D9467A, tajy sa'yju #E8B92F, ao po'i cream #F4EDE0, poncho black #1E1B18, ka'a green #5E7D3A.

---

## 6. Sources

1. Yaoki README: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/ref/Yaoki/README.md`
2. Firefox gn: https://github.com/mozilla-l10n/firefox-l10n/tree/main/gn (files: toolkit/toolkit/global/wizard.ftl, datetimebox.ftl, notification.ftl, alert.ftl, videocontrols.ftl; toolkit/chrome/global/commonDialogs.properties, dialog.properties; browser/browser/backupSettings.ftl, protections.ftl, newtab/newtab.ftl, translations.ftl, browser.ftl, profiles.ftl, preferences/preferences.ftl). English source: https://github.com/mozilla-l10n/firefox-l10n-source
3. Firefox for Android gn: https://raw.githubusercontent.com/mozilla-l10n/android-l10n/main/mozilla-mobile/fenix/app/src/main/res/values-gn/strings.xml
4. Common Voice gn UI: https://github.com/common-voice/common-voice/tree/main/web/locales/common-voice/gn (pages/contribute/{listen,speak,write,common}.ftl, pages/{dashboard,home,common,about,error}.ftl)
5. Common Voice Guarani sentences: https://github.com/common-voice/common-voice/blob/main/server/data/gn/sentence-collector.txt
6. MediaWiki gn: https://raw.githubusercontent.com/wikimedia/mediawiki/master/languages/i18n/gn.json
7. LibreOffice gug UI: https://github.com/LibreOffice/translations/tree/master/source/gug (svx, vcl, svtools, cui, sw, sc, basctl, extras/source/autocorr/emoji.po)
8. LibreOffice gug_PY locale: https://raw.githubusercontent.com/LibreOffice/core/master/i18npool/source/localedata/data/gug_PY.xml
9. CLDR gn: https://raw.githubusercontent.com/unicode-org/cldr/main/common/main/gn.xml
10. AmericasNLP 2021 Guarani–Spanish: https://github.com/AmericasNLP/americasnlp2021/tree/main/data/guarani-spanish (train and dev). Related: the Jojajovai corpus has an SPL subset, https://github.com/pln-fing-udelar/jojajovai, but its CSV was not at the documented path
11. Plan de Recuperación Económica (29 Jun 2020), US$1,372.3 m for Ñapu'ã Paraguay: https://www.aguilarcastillolove.com/assets/covid-19/paraguay/documents/29.06.2020%20Gobierno%20Nacional%20-%20Plan%20de%20Recuperación%20Económica.pdf
12. La Nación, Ñapu'ã plan: https://www.lanacion.com.py/negocios/2020/10/26/gobierno-presenta-su-plan-napua-paraguay-con-el-objetivo-de-tener-la-retraccion-mas-baja-de-la-region/
13. Agencia IP: https://www.ip.gov.py/ip/2020/11/09/para-volver-a-la-senda-del-crecimiento-economico-y-a-niveles-optimos-fiscales-se-debe-aplicar-el-plan-napua-paraguay/
14. Infonegocios: https://infonegocios.com.py/nota-principal/napu-a-paraguay-cuales-son-las-claves-de-la-reactivacion-economica
15. Agencia IP, Ñapu'ãke: https://ip.gov.py/ip/napuake-ayuda-a-mejorar-la-calidad-alimentaria-de-68-155-personas-de-poblaciones-vulnerables ; Facebook page: https://www.facebook.com/pytyvosubsidio/
16. KU Acceso, almanaque guaraní: https://acceso.ku.edu/new/transcripts/u8/8_almanaque_guarani_clase.docx
17. Polyglot Club, days: https://polyglotclub.com/wiki/Language/Paraguayan-guarani/Vocabulary/Days-of-the-Week/sq
18. Omniglot numbers: https://omniglot.com/language/numbers/guarani.htm ; https://www.languagesandnumbers.com/how-to-count-in-guarani/en/gug/ ; https://polyglotclub.com/wiki/Language/Paraguayan-guarani/Vocabulary/Counting-and-Numbers/sq
19. https://www.qsl.net/zp4kfx/Linux/Guarani_1.html ; https://www.mustseespots.com/es/paraguay/articles/conceptos-basicos-del-idioma-guarani-para-viajeros-a-paraguay-frases-esenciales/
20. Última Hora, ñe'ẽnga: https://www.ultimahora.com/los-neenga-del-paraguay-la-sabiduria-popular-que-trasciende
21. Guarani bibliography (Aguilera 1996): https://www.staff.uni-mainz.de/lustig/texte/guarbibl.doc
22. https://xenarthrans.org/journal/wp-content/uploads/IUCN-SSC-ASASG_Xenarthra-26_01_Smith_FieldNote.pdf ; https://www.pybio.org/wp-content/uploads/2015/01/2-8-Un-tatu-bolita-Tolypeutes-matacus-Desmarest-1804-con-una-amputación-de-la-pierna-delantera-de-Paraguay.pdf
23. Paraguay Salvaje: https://x.com/ParaguaySalvaje/status/1067858459905929217?lang=es
24. https://faunayfloradelargentinanativa.blogspot.com/2011/03/quirquincho-bola-tolypeutes-matacus.html ; http://guaranime.blogspot.com/2012/06/tatu.html ; https://wehd.com/93/Tatou.html ; https://dictionary.com/browse/tatouay
25. Fuleco: https://www.jb.com.br/esportes/noticias/2012/11/26/amp/mascote-da-copa-de-2014-se-chamara-fuleco.html ; https://ihu.unisinos.br/noticias/531973-tatu-em-extincao-reaparece-nos-campos-do-mundial-da-fifa
26. Guarani mythology (Aguara and Tatu-tunpa): https://en.wikipedia.org/wiki/Guarani_mythology (via search)
27. Karumbe of Villarrica: https://www.ultimahora.com/karumbe-el-transporte-villarrica-1940-n1122980
28. *tatú*: https://kaikki.org/dictionary/Spanish/meaning/t/ta/tat%C3%BA.html
29. https://www.abc.com.py/edicion-impresa/locales/2019/08/25/hoy-se-conmemora-el-dia-nacional-del-idioma-guarani/ ; https://www.ip.gov.py/ip/2021/08/25/hoy-se-celebra-el-dia-del-idioma-guarani-2/ ; https://www.lanacion.com.py/espectaculo/2024/08/25/el-dia-del-idioma-guarani-y-el-legado-de-un-gran-impulsor/
30. https://www.abc.com.py/nacionales/2023/06/22/los-origenes-de-la-fiesta-de-san-juan-en-paraguay/ ; https://www.abc.com.py/nacionales/2025/06/17/llegan-las-fiestas-de-san-juan-en-paraguay-quien-es-tu-candidato-a-judas-kai/ ; https://www.lanacion.com.py/la-nacion-del-finde/2023/06/24/fiestas-de-san-juan-para-comer-rico-y-divertirse/
31. https://www.hoy.com.py/nacionales/jopara-sabrosa-tradicion-para-espantar-al-karai-octubre ; https://www.lanacion.com.py/pais/2024/09/30/karai-octubre-para-espantar-a-la-miseria-hoy-se-come-jopara/
32. https://www.lanacion.com.py/pais/2019/07/29/declaran-al-carrulim-como-patrimonio-cultural-del-paraguay/ ; https://www.abc.com.py/nacionales/2026/07/31/el-tradicional-carrulim-entre-la-herencia-ancestral-la-evolucion-comercial-y-la-mirada-medica/ ; https://www.abc.com.py/nacionales/2024/07/29/en-el-mercado-4-preparan-100-litros-de-carrulim/
33. https://ich.unesco.org/es/RL/prácticas-y-saberes-tradicionales-del-terere-en-la-cultura-del-poha-ñana-01603 ; https://www.cultura.gov.py/wp-content/uploads/2020/12/Boletín-Mensual-Diciembre-2020.pdf ; https://www.abc.com.py/nacionales/2020/12/18/terere-como-patrimonio-del-mundo-ahora-el-compromiso-es-extender-la-tradicion/
34. https://www.lanacion.com.py/pais/2021/10/10/dia-nacional-del-nanduti-la-flor-en-el-tejido-de-aranas/ ; https://www.ecured.cu/Ñandutí ; https://seer.ufrgs.br/EspacoAmerindio/article/download/106630/59639 ; https://www.ultimahora.com/congreso-sanciona-ley-que-establece-el-dia-nacional-del-nanduti-n1151576
35. https://www.dinapi.gov.py/portal/v3/index.php/assets/boletines/pdf-boletines/RECONOCIMIENTO-DE-AO-PO-I30DEAGOSTODE2019.pdf ; https://asunciontimes.com/?p=31689 ; https://misionesonline.net/2021/12/16/ao-poi-paraguay-viernes/ ; https://notife.com/paraguay-trabajadores-publicos-deberan-vestirse-los-dias-viernes-con-un-un-tejido-patrimonial
36. https://ich.unesco.org/en/USL/ancestral-and-traditional-techniques-for-the-elaboration-of-the-poncho-para-i-de-60-listas-from-the-city-of-piribebuy-republic-of-paraguay-01992?USL=01992 ; https://infonegocios.com.py/infoarte/tejiendo-historia-rosa-segovia-maestra-artesana-que-mantiene-vivo-el-arte-del-poncho-para-i-de-60-listas ; https://asunciontimes.com/?p=27585
37. https://www.bacn.gov.py/leyes-paraguayas/2712/ley-n-4631-declara-rbol-nacional-al-lapacho-tajy-br ; https://www.abc.com.py/ciencia/2025/06/19/dia-del-arbol-en-paraguay-por-que-el-tajy-es-simbolo-nacional/ ; https://asunciontimes.com/?p=15879
38. https://www.ultimahora.com/son-solo-140-000-personas ; https://www.unicef.org/paraguay/doce-datos-sobre-la-población-indígena-de-paraguay ; CERD report: https://www.mre.gov.py/simoreplus/Adjuntos/Informes/Versión%20preliminar%20-%20VII%20al%20X%20Informe%20Periódico%20Combinado%20PARAGUAY%20-%20CERD.pdf ; https://www.culturalsurvival.org/es/node/14170 ; https://www.ultimahora.com/dos-lenguas-aborigenes-paraguayas-se-debilitan-por-influencia-del-guarani-y-del-castellano
39. https://en.wikipedia.org/wiki/Tau_(mythology) (via search); https://www.abc.com.py/periodismo-joven/te-animas-a-tentarle-al-pombero-por-la-noche-1493990.html
40. https://infonegocios.com.py/default/yvy-pyta-la-nueva-coleccion-de-vro-inspirada-en-nuestra-tierra-colorada
41. https://www.lanacion.com.py/reportaje/2021/08/25/el-mito-fundacional-de-la-alianza-hispano-guarani-en-la-identidad-paraguaya/
42. Virgen de Caacupé, patrona del Paraguay: https://www.aciprensa.com/noticias/entronizan-mosaico-de-la-virgen-de-caacupe-patrona-de-paraguay-en-los-jardines-vaticanos-13507
43. G7 notes: `/tmp/claude-0/-home-user/430b6c9f-00ab-547a-bf2b-cc44a7533d75/scratchpad/notes/G7-six-level-syllabus.md`

## 7. Hosts not reached

| Group | Hosts |
|---|---|
| Failed via curl and/or WebFetch | omniglot.com, www.abc.com.py, www.ultimahora.com, www.lanacion.com.py, www.ip.gov.py, acceso.ku.edu, docs.verbix.com, livingdictionaries.app, duome.eu, www.qsl.net, en.wikibooks.org, www.wiktionary.com, en.wiktionary.com |
| Wiktionary mirrors, also failed | wiki.neonvagabond.xyz, kaweah.freedombox.rocks |
| Also failed | glosbe.com, www.languagesandnumbers.com, wiki.riteme.site, wikis.swarthmore.edu, www.naclo.org, es.scribd.com, www.pybio.org, xenarthrans.org, ich.unesco.org, www.cultura.gov.py, www.mec.gov.py, www.senatur.gov.py, www.visitparaguay.travel, www.ine.gov.py, www.mre.gov.py, www.bacn.gov.py, www.mitic.gov.py |
| Needs an attached repository | api.github.com |
| Not tried (the brief lists them as blocked) | spl.gov.py, translatewiki.net, Pontoon, Hugging Face |

The web-search budget also ran out before these could be checked: the Academy grammar's title, the MEC's names for the skills, "Ko'ẽrõ peve", the spelling of vori vori, the mburukuja's status, and the colour symbolism of the poncho.

---

## Recommendations for the app

1. **Name it "Epu'ã"**, subject to a trademark and native check, with the tagline *Epu'ã ha eñepyrũjey* (attested) and the composed proverb *Ho'a pokõi jey, opu'ã poapy jey* once a native speaker has approved it. Keep "Ñapu'ã" as an A1 example sentence for ñande vs. ore. Do not use it as a brand, because of the 2020 plan.
2. **Mascot (superseded: see G8): a tatu bolita** (working name *Tatu'i*). It rolls into a ball when hit and pops up again, stamped **Opu'ã**. The karumbe is the slow-listening button. Design it so that it does not resemble Fuleco.
3. **Spanish-first UI with Guarani labels** taken only from the high- and medium-confidence rows of §3. Store them in one string table with a `source` and `confidence` field for each, and show the Guarani as the learning layer ("Ehendu · Escuchar").
4. **Map Yaoki's slots:**

   | Yaoki | Guarani |
   |---|---|
   | 済 | Oĩma |
   | 起 | Opu'ã |
   | はなまる | ¡Iporãiterei! |
   | たいへんよくできました | ¡Iporãitereíma ne rembiapo! |
   | Continue | Eku'ejey |
   | Try again | Eha'ã jey |
   | Listen again | Ehendujey |
   | Skip | Jepo |
   | Week | Arapokõindy |
   | Goal | Jehupytyrã |
   | Streak and stamp | Spanish labels, until native terms exist |

5. **Normalise text** in search, typing and speech matching: ' ’ ʼ ´ → one puso; ĝ → g̃ (g + U+0303); î ê â ô û ŷ → ĩ ẽ ã õ ũ ỹ; NFC. Choose one display form for the puso. Test that the font draws g̃ and ỹ well, and remember that iOS Smart Punctuation turns ' into ’.
6. **Weekdays.** Show the Spanish day names in the plan; teach *arateĩ…arapokõi* in A1 U5 as the formal series, with the Sunday-first mapping and a note on the conflict until the Academia confirms.
7. **Numbers.** Teach 1–10 actively in A1 and the rest receptively. Teach Spanish numerals inside Guarani for prices and times, which is how people speak.
8. **Culture units** follow §4.2–4.3: greetings, then tereré and food, then the market, San Juan, Karai Octubre, carrulim, crafts and legends. Each culture fact carries its URL in the content file.
9. **Representation.** Add a "Sobre el guaraní" page (§4.5). Use no sacred material as decoration. Adapt the folklore content for the audience.
10. **Look.** Ñandutí rings for progress, ao po'i paper, poncho stripes for the week bar, a lapacho season skin, a terracotta base. No flags, feathers, Andean motifs or party-colour dominance.

## Open questions / needs a native speaker

1. Does *Epu'ã* work as an app name, and as a character's name? Is it free of brands? Is *Tatu'i* natural, or would *Tatumi* or a personal name be better?
2. Is "Ho'a pokõi jey, opu'ã poapy jey" natural, or does *jey* read as "otra vez"? Would speakers prefer version B or C, or Spanish numerals?
3. Does *opu'ã jey* carry a religious ("resucitó") or partisan echo?
4. Does *tatu* (or *tatu'i*) have any slang or double meaning in Paraguay?
5. Which weekday mapping do the Academia de la Lengua Guaraní and the MEC teach?
6. Which spellings should the app fix: *ko árape* or *ko'árape*; *ñe'ẽjoaju* or *ñe'ẽjuaju*; *nde* or *ne ka'aru*; *paapy* or *pa'apy*; ' or ’ or ʼ?
7. Native terms are needed for racha, sello, pista, cuaderno, gramática (is *ñe'ẽtekuaa* right?), vocabulario, pronunciación, mediación, unidad and nivel; for the MEC's names of the four skills; and for "Hasta mañana" (*Ko'ẽrõ peve*?).
8. Is *Jepo* or *Ehasa* the better label for "skip"? Is *Oĩ porã* the right feedback word for "¡Correcto!", and *Ojavy* for "Incorrecto"?
9. The ñe'ẽnga lessons need a collection with sources (Aguilera 1996), and the *he'i kururu* glosses here need checking.
10. Which motifs and colours do the artisans of Itauguá, Yataity and Piribebuy consider respectful to reproduce digitally? Is credit or licensing needed?
11. Is the mburukuja the national flower, and what is the date of the national ñandutí day?
