# G2 · Referencia gramatical verificada A1–B2 (guaraní paraguayo para hispanohablantes)

Notas del 3-11-2026 para quienes redactan las lecciones. Siguen el orden de G7 (A1–B2).

**Método.** Tres tipos de evidencia:
- **Normas y gramáticas**, solo vía extractos de WebSearch: WebFetch quedó bloqueado en todos los hosts (lista al final) y el cupo de WebSearch se agotó a mitad del trabajo.
- **Apertium-grn** (Kuznetsova y Tyers 2021) [Ap], archivos `lexc`/`twol` leídos en raw.githubusercontent.com.
- **El corpus Jojajovai** (Chiruzzo et al. 2022) [J], 30.855 pares guaraní–castellano, con recuentos por subcorpus: `spl` (Secretaría de Políticas Lingüísticas, el más normativo), `sem` (seminarios), `abc` (ABC Color), `blog`, `anlp` (AmericasNLP) y `hk` (traducciones colaborativas, el de menor calidad).

**Marcas.**
- **Confianza:** **A** = dos o más fuentes independientes coinciden (norma o gramática + corpus); **M** = una fuente más el corpus, o solo un corpus abundante; **B** = una sola fuente débil.
- **(sin verificar)** = forma derivada por regla que no hallé atestiguada.
- **No compuse ninguna oración guaraní.** Todas las citas son literales; [sic] marca grafías que no siguen la norma, y la forma normalizada va entre corchetes.
- Los "errores típicos" son análisis propio: deben validarlos docentes.

---

## 1. Preguntas abiertas de G7: respuestas

| Punto | Respuesta | Evidencia | Conf. |
|---|---|---|---|
| Imperativo positivo | Prefijos **e-** (vos; sustituye a re-) y **pe-** (ustedes; igual que en el indicativo). Aireales: **ei-**/**pei-**. Ejemplos: *eju* 'vení', *ejapo* 'hacelo', *eipe'a* 'quitá', *Eñeha'ã jey* / *Peñeha'ã jey* 'intentá(lo) de nuevo'. La forma *eguapy* 'sentate' es regular pero **no la hallé atestiguada**. Solo admiten **e-** los verbos activos (\**e-mandu'a*): con los chendales se usa ñe-/mo- (*e-ñe-mo-mandu'a*). | [UNC][Imp][ABCt][Ap][J:hk, abc, td] | A (*eguapy*: M) |
| Matices del imperativo | **-na** (pedido): *embojoapýna*, *ehaína* 'por favor agregá/escribí' [J:td]. **-ke** (orden enérgica): *ejúke*, *Eku'éke* 'seguí' [J]. **-py** (apuro, 'pues'): *Eguatapy* [UNC], *Jahápy* [J:hk]. **-mi** (afectivo): *emañami*, *ehenoimi* [J]. | [UNC (-ke/-na)][GR][J] | A/M |
| Prohibitivo | **ani** + forma de indicativo **re-/pe-** (+ **-tei**, opcional): *Ani rekyhyje* 'No temas', *Ani reñemyrõ* 'No odies' [J:blog]; *Anitei pejerúre paridad* 'No pidan paridad' [J:abc]; *ani re-ho-tei* 'no vayas' [Est en G7]. En blogs y en interfaces aparece también **ani + e-** (*ani eñongatu*); conviene enseñarlo solo como variante. | [Est][J] | A |
| Exhortativo 'vamos a…' | La 1.ª persona inclusiva sola, **ja-/ña-**: *Jaha che rógape* 'vayamos a mi casa' [J:hk]. Con **-ke**/**-py**: *Ñaipytyvõke ñande rapichápe* 'ayudemos a nuestro prójimo', *ñamomba'éke* 'valoremos' [J:abc]; *Jahápy che rógape* 'vámonos a mi casa' [J:hk]. Exhortativo con **-na**: no atestiguado. Hauck: *jaha* 'vamos' se usa incluso en castellano paraguayo. | [Est][Hau][J] | A |
| Optativo / yusivo | **t-** + prefijo de persona [Est]: **ta-** (yo), **tere-** (vos), **to-** (él/ellos), **taja-/taña-** (nosotros incl.), **toro-** (excl.), **tape-** (ustedes). Ejemplos: *Toho Óscar González Daher* 'que se vaya…' [J:abc]; *Ñandejára toime ñanendive* 'que Dios esté con nosotros', *tojejapo ko'ẽ* 'hágase la luz' [J:hk]; *opavave tajaikove ñane ñe'ẽ teépe* 'que todos vivamos en nuestra lengua' [J:spl]; *ta-'upe-icha-ke-na* '¡que así sea!' [Est]; *tereho* 'andá' [Guasch, en búsqueda]. Negación: -'ỹ tónico [Est] (sin ejemplo) o *ani* (*ani hasy* 'que no enferme' [J:abc]). | [Est][Ap][ABCt][J] | A (paradigma) / M (*taja-*) |
| -ramo / -rõ | 'si, cuando'. Sufijos átonos que se escriben unidos: *rehoséramo* 'si querés irte', *nomanóiramo* 'si no muere' [J]; *Akarúrõ* 'si como' [ITC]. **-rõ** es la forma breve (*ko'ẽrõ* 'mañana', *upéicharõ* 'entonces'). Tras sustantivo significa 'como, en calidad de': *Pápa pyahúrõ* 'como nuevo Papa' [J:blog]. *ramo* tónico y suelto = 'recién'. | [GR][Lus][WLes][ITC][J] | A |
| -vo | 'al + infinitivo / gerundio' (simultaneidad). Es átono y se escribe unido: *Omanóvo Pío XII* 'al morir Pío XII', *ombotývo caja* 'al cerrar la caja', *Omoherakuãvo* 'al publicar' [J]. Wikipedia lo describe además como progresivo (*amba'apóvo*). | [GE][GR][WPes][J] | A |
| jave | 'cuando, mientras, durante'. Se escribe **separado**: *Oky jave* 'cuando llueve' [ABC 2026], *Upe enfrentamiento jave* 'durante el enfrentamiento', *14:30 aravo jave* [J:abc]. | [ABC][duome][J] | A |
| rire | 'después de', separado: *peteĩ jasy rire* 'un mes después', *Heta ary rire* [J:abc]. Para el uso contrafactual 'si (hubiera)' ver B2-U4. | [ABCp][UNA][WLes][J] | A |
| mboyve | 'antes de', separado: *ojupi mboyve vehículo-pe* 'antes de subir al vehículo', *“oho mboyve”* 'antes de partir' [J:abc]. | [ABCp][J] | A |
| hag̃ua | 'para (que)' con verbos, separado: *Che aju ko'ápe añembosarái hag̃ua* 'Vengo aquí para jugar' [ABCp]; *jaha hag̃ua* 'para irnos' [UNA]. Grafías viejas: *haguã*, *haĝua*. | [ABCp][UNA][Ap][J] | A |
| Comparación | Se forma con **-ve** (tónico) y **-gui**: *marakajakuéra hekoporãve jaguakuéragui* 'los gatos son más mansos que los perros' [J:hk]; *opaga hetave ymavégui* 'paga más que antes' [J:abc]. El superlativo es **-ve + -va**: *táva tuichavéva* 'la ciudad más grande' [J:hk]. | [CEPAG][UNA][J] | A |
| -'ỹ privativo | 'sin, no-'. Es tónico y lleva puso: *avy'a'ỹta* 'seré infeliz' [J:hk]; *hekope'ỹ* 'ilícito' [J:abc]; *ate'ỹ* 'perezoso', *jyva'ỹ* 'sin brazo' [WLes, en búsqueda]. | [Est][J] | M |
| Nominalizadores | **-ha** (agente, lugar, instrumento; 'que'): *keha* 'dormitorio', *mondaha* 'ladrón', *jo'oha* 'pala' [Neo]; *aikuaa rohayhuha* 'sé que te amo' [J:hk]. **-hára** (agente): *mbo'ehára*, *pohanohára* 'médico' [Neo][ABC]. **-pyre** ('lo ‑ado'): *jehaipyre* [J:sem], significado por confirmar. **-kue/-ngue** ('ex-'): *peteĩ abogado-kue* 'un ex abogado' [Ton]. **-rã** ('futuro'): *tembiaporã* 'tarea por hacer' [J:sem]. | [Neo][Ton][J] | A (-ha, -hára) / M (-kue, -rã) / B (-pyre) |
| -pota | 'a punto de'; tónico: *Ajukapota* 'estoy por matar' [WPes]; *ho'apotáiko* '¿está por caerse?' [GR]. Variante **-mbota**: tras verbos en -po según [WPes][ITC] (*ajapombota*), tras raíz nasal según [Ap]. | [WPes][GR][ITC][Ap] | M |
| -ne | Probabilidad o conjetura; átono: *Mávapa oñangarekóne chemembykuérare amanorire* '¿quién cuidará a mis hijas cuando muera?' [J:hk]; *¿Mavaitévapa reiporúne?* '¿cuál elegiría?' [J:spl]; *oiméne* 'quizás'. | [GE][WPes][Ap][J] | A |
| -mi | Tiene dos valores. (1) Pasado habitual, átono: *Valentín ndaje omomendámi…* 'cuentan que Valentín casaba…' [J:blog]. (2) Diminutivo o afectivo, tónico en el imperativo: *emañami*, *eiporavomína*. | [GR ("átono y tónico")][Ap][ABCt][J] | M |
| -kuri / -va'ekue | **kuri**: pasado (reciente en la tradición escolar). Es átono, unido o suelto: *ahákuri* 'fui', *He'íkuri añete* 'dijo la verdad', *Tom ovy'a kuri* [J]. **-va'ekue** (= -va + -kue): pasado lejano o relativo de pasado, unido "al lexema" [ABCt]: *ha'eva'ekue delegado* 'fue delegado' [J:abc], *repurahéi va'ekue* 'cantaste' [J:hk]. El guaraní no tiene tiempo obligatorio: un verbo sin marca puede ser pasado. | [ABCt][Ton][Ap][J] | A |
| hína | Progresivo o continuo ('estar + -ndo'), suelto: *ro'u hina* [sic: hína] 'estamos comiendo' [J:hk]; *Che amba'apo aína/hína gueteri* 'Estoy trabajando todavía' [WLes]. Formas personales: *aína, reína, hína, ñaína, roína, peína* [Ap]. | [WLes][Ap][J] | A (M las personales) |
| -ma | 'ya'; átono: *jasy osẽma* 'ya salió la luna', *rohótama* 'ya nos vamos' [J:hk], *Oñemoañetéma* [J:abc]. Con negación, **nd-…-ve-i-ma** = 'ya no': *ndaikatuvéima aguata* 'ya no puedo caminar' [J:hk/sem]. | [GE][WPes][Ap][J] | A |
| gueteri | 'todavía', suelto: *rohayhu gueteri* 'aún te amo' [J:hk]; *Ne'ĩra gueteri…* 'todavía no…' [J:hk][dicc.]; *namendaséi gueteri* 'todavía no quiero casarme' [J:blog]. | [ABC adverbios][WLes][Ap][J] | A |
| -se | Desiderativo, **tónico**: *ahase* (no \**a-há-se*) 'quiero ir' [Clo]; *aikose* 'quiero vivir'; *ojaposéva* 'que quiere hacer'; *ndaikuaaséi* 'no quiero saber' [J]. | [Clo][Lus][J] | A |
| -kuaa | 'saber hacer': *Moõpiko rejapokuaa upéva?* '¿Dónde aprendiste a hacer eso?' [J:anlp]; *che sy otembi'u'apokuaa* 'mi madre sabe cocinar' [J:hk]. Distinto del verbo aireal *aikuaa* 'sé, conozco'. | [Ap][J] | M |
| -pa | (1) Pregunta, átono: *Mba'éichapa?*, *Reikuaápa?*, *Mboýpa?*. En pregunta indirecta = 'si': *Ndoikuaái oĩpa quórum* 'No sabe si habrá quórum' [J:abc]. (2) 'Todo, por completo', **tónico**: *Che ha'epáma* 'Ya lo dije todo' [J:hk], *okaipáva* 'que se quemó del todo' [J]. | [GR][Ap][J] | A / M |
| Números en A1 | 1–10 guaraníes más cifras castellanas para precios y horas (§4). | [Ap][J] | A / M |

---

## 2. Ortografía de las formas sufijadas (SPELLING OF SUFFIXED FORMS)

### 2.1 Qué dice la norma

- **Las reglas de la Academia.** La Academia de la Lengua Guaraní aprobó las reglas ortográficas (*Guarani Ñe'ẽ Jehairã Mbojojahakuéra*) el 10-08-2016 y las presentó el 7-09-2016 [Acad]. Son cuatro: (1) alfabeto de 33 letras; (2) uso del acento; (3) nasalidad; (4) unión de partículas. Su presidente dijo que "se vienen usando en los últimos 50 años". **No pude leer el texto oficial**: lo que sigue viene de material docente que lo reproduce [UNA][ABCo], de gramáticas [Est][Lus][GR][GE] y del uso.
- **Regla del acento** [UNA][ABCo][Lus]:
  - El acento recae sobre una **vocal**.
  - Si la tónica es la última vocal de la palabra, no se tilda (*guata, ñani, ao*).
  - Si no es la última, la tilde es obligatoria (*ára, purahéi, óga*).
  - Cada palabra lleva **una sola** tilde, y esa tilde es **móvil**: *pirapire → pirapirére → oñembopirapirevéta*.
  - Si hay dos tónicas, se tilda la de la derecha, siempre que no sea final (*mbo'ehára*).
- **Cálculo**: raíces siempre tónicas [Lus]; prefijos siempre átonos [Est][GR][GE]; sufijos tónicos o átonos por naturaleza; el acento principal lo lleva el **último morfema tónico** [Est][GR].
- **Nasalidad** [UNA][ABCo]:
  - Sobre una vocal con tilde nasal (ã ẽ ĩ õ ũ ỹ) **nunca** va acento agudo, ni siquiera si es tónica: *mokõi, ko'ẽrõ, akãme, pytũma, ñasẽva*. La tilde nasal "suple" al acento.
  - Una vocal que solo se nasaliza por una consonante vecina (m, n, ñ, mb, nd, ng, nt) se escribe sin virgulilla y se tilda con normalidad: *kuñáme*, *kuñáre* [J:spl/blog].
  - Una palabra puede llevar a la vez un acento y una virgulilla átona: *térã* 'o' (529 casos contra 22 de *terã* [J]).
- **Unión** [ABCo parte 4][UNA][ABCp]:
  - Prefijos y sufijos se unen al lexema y forman una sola palabra (*Oporogueroguataseténiko*).
  - Una partícula que se antepone al lexema se escribe aparte.
  - Las **posposiciones monosilábicas** van **unidas**: -pe/-me, -gui, -re, -gua, -ndi (*ógape, oúre, túvandi*).
  - Las **polisilábicas** van **separadas**: rehe, ndive, guive, peve, rupi, ári, gotyo, hag̃ua, g̃uarã, rire, mboyve (*ou rehe, amo guive, ndéve g̃uarã, jaha hag̃ua, apyka ári*).
  - Los posesivos van separados: *che róga, ñane retã* (*ñane retã* aparece 128 veces en [J:spl]; las formas unidas son raras).

### 2.2 Procedimiento para escribir una forma sufijada

1. Marcar la vocal tónica de la raíz: por defecto la última (*japo, guata*); algunas raíces la tienen antes y se escriben con tilde (*óga, túva, ára, purahéi*).
2. Recorrer los sufijos (tabla 2.3). Cada sufijo **tónico** se lleva el acento; los **átonos** no.
3. La sílaba tónica final es la del último elemento tónico. Si no es la última vocal de la palabra, se escribe tilde, salvo que esa vocal ya tenga virgulilla. Se borra cualquier tilde anterior: *óga + kuéra → ogakuéra*; *mbo'ehára + kuéra → mbo'eharakuéra* (12 casos contra 0 [J]).
4. Elegir los alomorfos nasales (§2.5) y aplicar la regla de unión y separación.

### 2.3 Sufijos y partículas: tónicos, átonos y separados

**Átonos.** La tilde cae sobre la última vocal tónica anterior. Se escriben unidos.

| Sufijo | Valor | Ejemplo verificado | Fuentes | Conf. |
|---|---|---|---|---|
| -pe / -me | 'en, a'; objeto humano | *ógape, kotýpe, kuñáme, tetãme* | [UNA][ABCp][GE][GR][Ap][J] | A |
| -gui | 'de, desde'; causa; 'que' (comparación) | *Chorégui, tetãgui, ymavégui* | [ABCp][GE][GR][Ap] | A |
| -re | 'por, sobre, a causa de' | *ka'aguýre, oúre, pirapirére* | [UNA][ABCp][GE][GR] | A |
| -ve | dativo de los pronombres | *chéve, ndéve* | [Ap][J] | M |
| -ndi | 'con' | *túvandi* | [UNA][J] | M |
| -ta | prospectivo o futuro | *aháta, oikóta* (164 contra 1), *jeýta* | [Est][Clo][WPes][Ap][J] | A |
| kuri | pasado | *ahákuri, ojapókuri*; también suelto (*aha kuri*) | [Lus][Ap][J] | A (tilde) / B (unión) |
| -ma | 'ya' | *ojapóma* (23 contra 0), *rohótama* | [GE][GR][WPes][Ap][J] | A |
| -ne | conjetura | *oñangarekóne, oiméne* | [GE][GR][WPes][Ap] | A |
| -va | 'que'; relativo; hábito | *ojapóva* (501 contra 0) | [GE][GR][Ap][J] | A |
| -vo | 'al + infinitivo' | *ojuhúvo, ombotývo, Omanóvo* | [GE][GR][WPes][J] | A |
| -pa | pregunta | *Mba'éichapa* (464 contra 11), *reikuaápa* | [GR][Ap][J] | A |
| -i | negación | *ndaikatúi* (68 contra 1), *ndaipóri* (204 contra 5) | [GE][GR][J] | A |
| -ramo / -rõ | 'si, cuando'; 'como' | *rehoséramo, nomanóiramo, akarúrõ, pyahúrõ* | [GR][Lus][ITC][J] | A |
| -nte | 'solo, nomás' | *ehónte, akóinte* | [GR][Ap][J] | A |
| -icha | 'como' | *potýicha* [J:hk] | [GR][Ap] | M |
| -ke, -na, -py, -tei | matices del imperativo | *ejúke, Eku'éke, embojoapýna, Jahápy*; *rehótei* (sin verificar) | [GR][ABCt][J] | A/M |
| -mi | pasado habitual | *omomendámi* | [GR][J] | M |
| -jepi | 'solía' | *oñembyatýjepi, oipyhýjepi* | [J:blog] | B |
| -ngo, -ko, -iko | énfasis y pregunta | *Upévango* | [GR][Ap] | M |

**Tónicos.** El sufijo se lleva el acento y desaparece la tilde de la raíz. Se escriben unidos.

| Sufijo | Valor | Ejemplo verificado | Fuentes | Conf. |
|---|---|---|---|---|
| -se | 'querer' | *ahase, ojaposéva* (11 contra 0), *ndaikuaaséi*; *ahasékuri* | [Clo][Lus][J] | A |
| -ve | 'más' | *tuichave, tuichavéva* (54 contra 0), *hetavéva, oñembopirapirevéta*. ABC Color escribe a menudo *hetáve*; SPL y seminarios, *hetave*. | [CEPAG][UNA][J] | A |
| -kuéra / -nguéra | plural | *ogakuéra, mbo'eharakuéra, tuvakuéra* (12 contra 1) | [Ap][UNA][J] | A |
| -gua / -ygua | 'de (procedencia)' | *Paraguaigua* (SPL 52, seminarios 6, libro_gn 1 *Che Paraguaigua*; *paraguáigua* 0 en esos tres), *ko'ag̃agua*. Ante un sufijo átono el acento queda en -guá: *reheguáva* (262 contra 0), *tavayguápe* (45 contra 0), *paraguaiguápe* (19). ABC Color escribe a menudo la tilde de la raíz (*paraguáigua*, *távagua*, *tendágua*), como con *hetáve*. Corregido el 3-11: antes figuraba entre los átonos, con *paraguáigua* [J:hk]. | [Ap: twol, *óga* + *gua* → *ogagua*][J] | A |
| -pa | 'todo' | *ha'epáma, okaipáva, oguerekopáva* | [GR][J] | M |
| -ha | nominalizador; 'que' | SPL, seminarios y anlp escriben *ikatuha, oikoha, ndaiporiha*; ABC Color, *ikatúha*. **Decisión pendiente.** | [GR no lo lista como átono][J] | M |
| -hára | agente | *mbo'ehára* (300 contra 2), *pohanohára* | [UNA][Neo][J] | A |
| -kue / -ngue, -rã | 'ex-'; 'futuro' | *tembiapokue, tembiaporã, pehẽngue* (la raíz nunca lleva tilde) | [J] | M |
| -va'ekue, -va'erã | pasado lejano; obligación | *ojapova'ekue* (25 contra 0), *ojapova'erã* (18 contra 0) | [ABCt][J] | A |
| -pota / -mbota | 'a punto de' | *ho'apotáiko* | [GR] | M |
| -'ỹ | 'sin, no-' | *avy'a'ỹta* | [Est][J] | M |
| -mi | afectivo, imperativo | *emañami, ehenoimi, eiporavomína* | [GR][J] | M |
| -mimi | acción intermitente | sin ejemplo | [ABCt] | M |
| -ite / -iterei, -ete / -eterei | intensivo | *iporãitereíva, ipotĩetereíva* | [Ap][J] | M |

La variante del intensivo depende de la vocal anterior: **-ite/-iterei** tras a, e, o; **-ete/-eterei** tras i, u, y (*hasyeterei, imichĩeterei*) [Ap][J].

**Palabras aparte.** Llevan su propio acento y se escriben separadas: hína, gueteri, jey, ra'e, ndaje, niko, jepe, avei, katu, y las posposiciones polisilábicas (jave, rire, mboyve, hag̃ua, rehe, ndive, guive, peve, rupi, ári, gotyo, g̃uarã) [UNA][ABCp][J]. En el uso, *hína*, *mo'ãi* y *kuri* aparecen tanto unidas como sueltas; la norma no se halló.

### 2.4 Ejemplos verificados de palabras sufijadas

Fuentes de cada ejemplo: N = norma o material docente [UNA][ABCo][ABCp][Lus]; G = gramática o estudio [Est][Clo][GR]; C = corpus [J], con recuento.

| # | Forma | Análisis | Significado | Evidencia | Conf. |
|---|---|---|---|---|---|
| 1 | aháta | a-ha-ta | voy a ir | G [Est][Clo] (-ta átono); C 4:1 | A |
| 2 | ahase | a-ha-se | quiero ir | G [Clo] (\*a-há-se); C | A |
| 3 | rehoséramo | re-ho-se-ramo | si querés irte | C [J:anlp] | A |
| 4 | ahasékuri | a-ha-se-kuri | quise ir | N [Lus/Ojeda] | M |
| 5 | ahákuri | a-ha-kuri | fui | C [J:hk, anlp] | A |
| 6 | ógape | óga-pe | en (la) casa | N [UNA][ABCp]; C 22:0 | A |
| 7 | tetãme | tetã-me | en el país | C 460 contra 0 *tetãpe* | A |
| 8 | akãme | akã-me | en la cabeza | N [UNA][ABCo] | A |
| 9 | ko'ẽrõ | ko'ẽ-rõ | mañana | N [UNA][ABCo]; C 184:2 | A |
| 10 | kuñáme | kuña-me | a la mujer | C [J:spl] (6:2) | M |
| 11 | mitãnguérape | mitã-nguéra-pe | a los niños | N [UNA] (*mitãnguéra*); C 25:0 | A |
| 12 | ogakuéra | óga-kuéra | las casas | G [Ap][Tyers, en búsqueda] | M |
| 13 | mbo'eharakuéra | mbo'ehára-kuéra | los profesores | C 12:0 | M |
| 14 | pirapirére | pirapire-re | por dinero | N [UNA/ABCo] | A |
| 15 | oñembopirapirevéta | o-ñe-mbo-pirapire-ve-ta | se enriquecerá más | N [UNA/ABCo] | A |
| 16 | ojapóva | o-japo-va | el que hace | C 501:0 | A |
| 17 | ojaposéva | o-japo-se-va | el que quiere hacer | C 11:0 | A |
| 18 | tuichavéva | tuicha-ve-va | el más grande | C 54:0 | A |
| 19 | Mba'éichapa | mba'éicha-pa | ¿cómo? | C 464:11 | A |
| 20 | ndaikatúi | nd-a-ikatu-i | no puedo | C 68:1 | A |
| 21 | nomanóiramo | n-o-mano-i-ramo | si no muere | C [J:blog] | M |
| 22 | pytũma | pytũ-ma | ya anocheció | N [Lus/Ojeda] | M |
| 23 | ha'epáma | ha'e-pa-ma | ya lo dije todo | C [J:hk] | M |
| 24 | ojapova'erã | o-japo-va'erã | ha de hacer | N [ABCt] (unido); C 18:0 | A |

### 2.5 Armonía nasal de los afijos

Una raíz nasal es la que tiene una vocal con virgulilla o una consonante nasal (m, n, ñ, g̃) o prenasal (mb, nd, ng, nt).

**Prefijos.** Cambian según la nasalidad de la raíz.

| Afijo | Raíz oral | Raíz nasal | Ejemplos (C = corpus) | Conf. |
|---|---|---|---|---|
| ja- (1.ª pl. incl.) | ja- | ña- | *jaguata* / *ñañe'ẽ, ñamba'apo* (C 8:0, 6:0) | A |
| je- (reflexivo, pasiva) | je- | ñe- | *ojejapo* / *oñembyaty, oñemoĩ, oñembo'e* (C 26:0) | A |
| jo- (recíproco) | jo- | ño- | *ojojuhu* / *oñomongeta* (C 183:0), *oñoñe'ẽ* | A |
| mbo- (causativo) | mbo- | mo- | *ombopiro'y, ombojegua* / *omopotĩ, omombe'u* (C 392:0), *omoñepyrũ* | A |
| nd-…-i (negación) | nda-, ndere-, ndo-, ndaja-, ndoro-, ndape- [Ap] | na-, nere-, no-, naña-, noro-, nape- [Ap] | *ndohói, ndoikói, ndere'úi* / *nañe'ẽi, noñe'ẽi, nomba'apói, naiporãi* (atestiguados: na-, no-; el resto, por regla) | A |
| ñande, nde, pende (posesivos, chendales) | ñande, nde, pende | ñane, ne, pene | *ñande rapicha* / *ñane retã, ñane ñe'ẽ, ne memby, mba'éichapa ne ko'ẽ* | A |
| tembi- ('lo que se…') | tembi- | temi- | *tembiapo, tembi'u* / *temimbo'e* (C 355:1) | A |
| i- (3.ª persona chendal) | i-; ij- ante vocal | iñ- ante vocal nasal | *iporã, ijare* / *iñakã, iñe'ẽ* | M |

**Sufijos.** Deciden por la **última sílaba**: *mitãnguéra-pe*, *temimbo'é-pe*, *Paraguái-pe*, pero *ñú-me*, *kuñá-me*.

| Sufijo | Tras sílaba oral | Tras sílaba nasal | Ejemplos (C = corpus) | Conf. |
|---|---|---|---|---|
| -pe | -pe | -me | *ógape* / *Tobatĩme, kuñáme, ñúme* [ABCp][UNLP] | A |
| -kuéra | -kuéra | -nguéra | *apykakuéra* / *mitãnguéra, angirũnguéra* [UNA] | A |
| -kue | -kue | -ngue | *ogakue* / *akãngue* [tarjetas], *pehẽngue* [C] | M |
| peve, pegua | peve, pegua | meve, megua | [Ap][ABCp] | M |
| -pota | -pota | -mbota | ver §1 | M |

**Sin cambio** (C): -gui (*tetãgui*), -re (*akãre*), -va (*oĩva*), -ta, -se, -ma (*osẽma*), -ve (*porãve*), -ramo, -vo (*Omoherakuãvo*). Tampoco cambian rire y mboyve: "se usan con palabras orales y nasales" [ABCp].

### 2.6 Variación real y política de corrección

ABC Color trata -ve, -ha y a menudo -gua como átonos (*hetáve*, *ikatúha*, *paraguáigua*); SPL no (*hetave*, *ikatuha*, *Paraguaigua*). Además, *kuri*, *hína* y *mo'ãi* aparecen unidas o sueltas, y *g̃* alterna con *ĝ* o *gã* (*ko'ág̃a* 162 frente a *ko'ágã* 471, casi todo de ABC).

**Propuesta.**
- El texto de la app sigue el uso de SPL: -ve, -ha y -gua tónicos, *kuri* y *hína* sueltas, -va'ekue y -va'erã unidas, *ko'ág̃a*.
- El corrector acepta la otra variante, pero sin reconocerla como norma.

---

## 3. Referencia por nivel (orden de G7)

Formato de cada punto: **Nombre en castellano** (unidad y día de G7). Regla y formas. Ejemplos (fuente). Error previsible y contraste con el castellano. Confianza.

### A1

**U1 · Pronombres personales.** *che, nde, ha'e, ñande* (incl.), *ore* (excl.), *peẽ, ha'ekuéra* [Ap]. Ejemplos: *Ore Alemaniagua* 'somos de Alemania'; *ha'ekuéra oñe'ẽ karaiñe'ẽme* 'ellas hablan español' [J:hk]. **Error:** usar *ñande* para todo 'nosotros'. El castellano no distingue si el oyente está incluido. **A**

**U1 · Pregunta con -pa** (y saludos). -pa es átono y se pega a la palabra preguntada [Ap, cita Est p.76]. Ejemplos: *Mba'éichapa?*; *Maitei Tom, mba'éichapa ne ko'ẽ* 'hola Tom, buenos días' [J:hk]; *Moõpiko rejapokuaa upéva?* [J:anlp]. **Error:** escribir *Mba'eichapa* sin tilde, o confiar solo en la entonación. **A**

**U2 · Prefijos areales.** *a-, re-, o-, ja-/ña-, ro-, pe-, o-* [Ap][WPes]. Irregulares [Ap]: 'ir' *aha / reho / oho*; 'venir' *aju / reju / ou / jaju / roju / peju*; 'comer' *ha'u / re'u / ho'u*; 'decir' *ha'e / he'i / ja'e / peje*. Ejemplos: *che apurahéi* 'yo canto', *añañi pyharevekue* 'corro por las mañanas', *Tom ojeroky* 'Tom baila' [J:hk]. **Error:** raíz sin prefijo (*\*che guata*). En castellano la persona va al final (*camin-o*); en guaraní, al principio (*a-guata*). **A**

**U2 · -pe/-me 'en, a'.** Además marca el objeto humano (*Ñaipytyvõke ñande rapichápe*). Ejemplos: *Akañy ka'aguýpe* 'me perdí en el bosque', *Ho'a ysyrype* 'se cayó al río' [J:hk], *tetãme* [J]. **Error:** usar *-pe* tras nasal (\**tetãpe*: 0 casos). En guaraní es posposición; en castellano, preposición. **A**

**U2 · -gui 'de, desde'** (también causa). Ejemplos: *ha'e osẽ jahuhágui* 'salió de la tina' [J:hk]; *Choré-gui* [ABCp]; *okyhyjégui* 'por temor' [J:abc]. **A**

**U2 · Negación nd-…-i.** Formas orales y nasales en §2.5. Ejemplos: *ndaikuaái* 'no sé'; *Mba'ére ndere'úi ka'avo?* '¿por qué no comes verdura?'; *ta'angambyry ndoikói* 'la tele no funciona'; *nahániri, ndaha'éi che róga* 'no, no es mi casa' [J:hk]. La -i se pone antes de -ma, -kuri y -ramo (*ndaikuaáikuri*, *nomanóiramo*). **Error:** poner solo una de las dos partes; olvidar *na-/no-* ante raíz nasal. El castellano pone un único "no" delante. **A**

**U3 · Predicados chendales.** Estados y cualidades llevan *che-, nde-, i-* (3.ª persona: *i-/ij-/iñ-/h-*), sin verbo 'ser/estar'. Ejemplos: *che kyra* 'estoy gordo', *che mboriahu* 'soy pobre', *Che róga iporã* 'mi casa es bonita', *Pe jagua ijare* 'ese perro apesta' [J:hk]. Negación: *naiporãi* 'no es bueno' [J:anlp]. **Error:** \**akyra* con prefijo areal, o \**ha'e iporã* con "ser" calcado. **A**

**U3 · Oración nominal.** Con dos sustantivos, el uso escrito emplea *ha'e*: *paraguái ha'e peteĩ tetã Sudamérikagua* [J:hk]. Con adjetivo no se usa *ha'e* (*Che róga ituicha*). Su estatus normativo está por confirmar. **M**

**U3 · Preguntas sí/no.** *-pa* o *piko*. Ejemplos: *nde piko ha'e che sy?* '¿sos mi madre?' [J:hk]; *Reikuaápa?* [J]. Respuestas: *nahániri* 'no' (33 casos); 'sí' se escribe *heẽ* (4) o *hẽe* (1), grafía por normar. **M**

**U4 · Posesión.** *che/nde/i-* + sustantivo, separados (§2.1): *eju che rógape* 'vení a mi casa', *mba'éicha ejuhu che róga* '¿cómo encontraste mi casa?' [J:hk]. **Error:** \**che óga* (ver t-/r-/h- en A2). **A**

**U4 · Plural -kuéra/-nguéra.** Es opcional y no se usa tras un numeral: *poteĩ koty oguereko cheróga* [sic: che róga] 'mi casa tiene seis habitaciones', *mokõi aravo* [J]. Ejemplos: *mitãnguéra oho mbo'ehaópe pyharevekue* 'los niños van a la escuela a la mañana'; *guyrakuéra opurahéi kuri yvágape* [J:hk]. **Error:** pluralizarlo todo, como en castellano. **A**

**U4 · Demostrativos.**
- *ko* 'este', *pe* 'ese', *amo* 'aquel'; plurales *ko'ã*, *umi*.
- Pronombres *kóva, péva, amóva, upéva*; en el habla, *kóa, upéa* [Ap].

Ejemplos: *Pe jagua opo* 'ese perro saltó', *umi arai hũ* 'esas nubes oscuras' [J:hk]. **A**

**U4 · Interrogativos.** *máva* 'quién', *mba'e* 'qué', *moõ* 'dónde', *araka'e* 'cuándo', *mba'ére* 'por qué', *mboy* 'cuántos'. Ejemplos: *máva ha'e* '¿quién es?', *moõpe oiko John* '¿dónde vive John?', *mboy temimbo'e oĩ mbo'ehaópe* '¿cuántos alumnos hay en la escuela?' [J:hk]. **A**

**U5 · Prefijos aireales.** *ai-, rei-, oi-, jai-/ñai-, roi-, pei-* [Ap]. Verbos: *ikuaa, ipota, iporu, iko*. Ejemplos: *aiko távape* 'vivo en la ciudad', *mboy guavirana'a reipota?* '¿cuántas manzanas querés?', *Nañaikotevẽi hese* 'no los necesitamos' [J:hk]. Imperativo *ei-*: *eipe'a* [J:td]. **Error:** \**akuaa* (perder la -i-). **A**

**U6 · Futuro con -ta.** Es átono, así que la raíz lleva tilde. Tonhauser lo analiza como prospectivo, no como tiempo puro. Ejemplos: *aháta che rógape* 'me voy a mi casa'; *nde ru ojapóta mbohapy kílo chipa* 'tu padre va a hacer tres kilos de chipá'; *Kuarahy omimbi jeýta* 'el sol volverá a brillar' [J:hk]; *Oñehesa'ỹijóta ko'ẽrõ* 'se analizará mañana' [J:abc]. **Error:** escribir *ahata*; calcar "voy a + verbo" (*aháta aju* 'voy a venir' figura como calco en un artículo sobre el castellano paraguayo, vía búsqueda). **A**

**U6 · Pasado con kuri.** Ejemplos en §1. **Error:** marcar todo pasado, como obliga el castellano. **A**

**U6 · Palabras de tiempo.** *kuehe* 'ayer', *ko'ẽrõ* 'mañana', *ko'ág̃a* 'ahora', *ko árape* 'hoy' [Ap][J]. Ejemplos: *ko árape aime che rógape* 'hoy estoy en mi casa'; *kalo oñemoarandu guarani ñe'ẽme kuehe guive* 'Carlos aprende guaraní desde ayer' [J:hk]. **A**

**U6 · Futuro negativo nd-…-mo'ãi.** *nde ndachejukamo'ãi* 'no me matarás' [J:blog]; *ndokýiramo ndotykymo'ãi* 'si no llueve no gotea' (ñe'ẽnga) [J:hk]; *ndoike mo'ãi* 'no se incluirá' [J:abc] (unido o suelto). **A**

**U7 · oĩ / ndaipóri.** 'Hay' o 'está' (ubicación). Ejemplos: *Ko tavaguasu oĩ Estados Unidospe* 'esta ciudad está en EE. UU.', *ndaipóri y* 'no hay agua', *Mbovy ovetã oĩ?* '¿cuántas ventanas hay?' [J:hk]. **Error:** usar *ha'e* para la ubicación. El castellano distingue "hay" y "está"; el guaraní usa *oĩ* para ambos. **A**

**U7 · -se 'querer'.** Ver §1. Negación: *che namanoséi* 'yo no quería morir' [J:hk]. **A**

**U7 · -na 'por favor'.** Ver §1. **M**

**U8 · Imperativo, -ke/-py, ani, -ndive.** Ver §1. -ndive se escribe separado; su forma breve *-ndi* va unida. Ejemplos: *eju orendive* 'vení con nosotros' [J:blog]; *che aiko che ru ha che sy ndive* 'vivo con mis padres' [J:hk]; *túvandi* [UNA]. **A**

### A2

**U1 · Sustantivos de tres formas t-/r-/h-.** *óga / che róga / hóga*; *tetã / ñane retã*; *túva / che ru / itúva*. Ejemplos: *ou hógape jey* 'volvieron a su casa' [J:abc]; *imandu'ájepi itúvare* 'recordaba a su padre' [J:blog]. **A**

**U1 · hikuái 'ellos', tras el verbo.** Ejemplos: *he'i hikuái ko'ã manifestante* 'dijeron los manifestantes' [J:abc]; *Ombopujepi hikuái* 'tocaban (ellos)' [J:blog]. **A**

**U2 · -kue / -rã / -va'ekue.** Ver §1 y §2.3. **M–A**

**U3 · hína, -ma, -pa 'todo'.** Ver §1.

**U3 · jey 'otra vez'.** Ejemplos: *Eñeha'ã jey* 'intentá de nuevo', *Peñeha'ã jey* 'inténtenlo otra vez' [J:hk]. **A**

**U4 · aipota, ikatu, aikuaa.** Ejemplos:
- *ndaipotái upéva* 'no quiero eso' [J:hk].
- *Ikatu reho nde rógape* 'podés irte a casa' [J:anlp].
- *ndaikatúi*; *ikatúramo añe'ẽ pa ñe'ẽme* 'si pudiera hablar diez idiomas' [J:hk].
- *aikuaa* 'sé'.

-pota y *jaha*: ver §1. **A**

**U5 · Posposiciones polisilábicas** (separadas): *rupi* 'por' (*opárupi* 'por todas partes' [J:spl]); *peve* 'hasta' (*ko'ág̃a peve*); *guive* 'desde' (*arakõi guive* 'desde el lunes'); *rehe* 'por, en, a' (*Omaña porã che rehe* 'me miró fijamente'; 3.ª persona *hese*); *ári* 'sobre' (*apyka ári* [UNA]). Unidas: *-guýpe* 'debajo de' (*poyviguýpe* 'bajo las sábanas') y *-gua/-pegua* 'de, procedente de' (*Japongua*, *Brasil-pegua*) [J:hk]. **Error:** anteponerlas, como las preposiciones castellanas. **A**

**U6 · Diminutivo y aumentativo.** Diminutivo *-'i/-mi*: *mitã'i*, *Pende py imichĩmi* 'sus pies son pequeñitos'. Aumentativo *-guasu*: *tavaguasu* 'ciudad'. Ejemplos [J]. **A**

**U6 · Cantidad y conjunciones.** *heta* 'mucho' (*Areko heta viru* [J:anlp]); *mbovy* 'pocos'; *sa'i* 'poco'; *ha* 'y'; *térã* 'o' (*Tuicha térã michĩ* [J:hk]). **A**

**U7 · Chendales de malestar.** *chekane'õ* 'estoy cansado' [J:hk] (¿unido o *che kane'õ*? ver Open questions); *hasyeterei* 'es muy difícil' [J:hk]. Consejos con -mi: ver §1. Las demás formas de G7 están sin verificar. **M**

**U7 · mboyve / rire.** Ver §1.

**U8 · upe 'ese', ku 'aquel (ya mencionado)'.** Ejemplos: *Upe enfrentamiento jave* [J:abc]; *iporã ku ñu potýicha* 'era hermosa como una flor del campo' [J:hk]. **M**

**U8 · Armonía nasal II.** Ver §2.5. **A**

**U10 · he'i 'dice, dijo'.** Ejemplos: *ha'e he'i upéva* 'ella dijo eso' [J:hk]; *–… –he'i Pali* [J:blog]. Discurso directo con la fórmula "X, *he'i* Y". **A**

**U10 · -hára 'el que hace'.** *mbo'ehára* 'profesor', *pohanohára* 'médico' [Neo][ABC]. **A**

### B1

**U1 · Comparar.** -ve…-gui y el superlativo -ve + -va: ver §1. Más ejemplos: *Tom ombopuporãve pe yvyrapu Mary-gui* 'Tom toca el xilófono mejor que Mary'; *florencia ha'e táva iporãvéva italia-pe* [J:hk]. Igualdad con -icha: *potýicha* 'como una flor'. Intensivos *-ite/-ete, -iterei/-eterei*: §2.3. **Error:** traducir "más" con el castellano *más* o con *hetave* delante del adjetivo. Las formas *-vete* y *-rasa* de G7 están **sin verificar**. **A / M**

**U2 · Si y cuando.** -ramo/-rõ, -vo, jave, mboyve, rire: ver §1. **A**

**U3 · Para qué y por qué.**
- **Finalidad, hag̃ua** (ver §1). Ejemplo: *Peteĩ yvyránte oñeikotevẽ ojejapo hag̃ua sua tata'i* 'se necesita solo un árbol para hacer un millón de fósforos' [J:blog].
- **Causa con -gui** sobre el verbo: *okyhyjégui* 'por temor' [J:abc].
- **Causa con -re**: *oúre* 'porque viene' [UNA].
- **Causa en pasado, *haguére***: *peju haguére* 'por haber venido' [J:abc].

**A**

**U4 · Relativo -va.** Ejemplos: *opa ava oĩva'ekue ko'ápe ohóma* 'toda la gente que estaba aquí se fue' [J:hk]; *Pe omba'apóva formal* 'el que trabaja en blanco' [J:abc]. Relativo de futuro: *-va'erã* o *-tava* (G7). *-tava* está **sin verificar**. **Error:** buscar un pronombre "que" separado. **A**

**U5 · Completivas.**
- *-ha* 'que': *He'i oĩha discusión* [J:abc]; *aikuaa rohayhuha*.
- *hague* 'que' en pasado: *aikuaa moõpa aime ha asẽ porã hague* 'sabía dónde estaba y que había salido bien' [J:abc].
- Pregunta indirecta con -pa: *Ndoikuaái oĩpa quórum*.
- *ndaje* 'dicen que': ver B2.

**A**

**U6 · Hacer palabras.** -ha, -hára, -pyre, *tembi-/temi-* (*tembi'u* 'comida', *temimbo'e* 'alumno') y -'ỹ: ver §1. **A / B**

**U7 · je-/ñe- y jo-/ño-.**
- Pasiva o impersonal: *Mba'éichapa oje'e kesu Alemanpe* '¿cómo se dice queso en alemán?'; *singapur-pe oñeñe'ẽ inglés-pe* 'en Singapur se habla inglés' [J:hk].
- Reflexivo: *Ani rejepy'apy* 'no te preocupes' [J:blog, anlp]. El corpus tiene la variante *Ani ejepy'apy* [J:hk].
- Recíproco: *jajohayhu* (G7); *oñomongeta* 'conversan'; *umi ojohayhúvape* 'a los enamorados' [J:blog].

**A**

**U8 · Causativos mbo-/mo- y -uka.**
- Con intransitivos, *mbo-/mo-*: *Kuarahy omokã yvy* 'el sol secó la tierra' [J:hk]; *omopotĩ* 'limpia'.
- Con transitivos, *-uka*: *nohechaukái hemiandu* 'no muestra sus sentimientos' [J:hk].

El causativo sociativo (*guero-/-ro-*) está **sin verificar**. **A**

**U9 · Énfasis y foco.**
- *niko* y su forma breve *-ngo*: *Ndaha'éi jagua, péva niko jaguakuña ra'e* 'no es perro: ¡era una perra!' [J:blog]; *Upévango hína…* [J:blog].
- *-nte* 'solo': *ehónte* 'andá nomás'.
- *avei* 'también': *che rohayhu avei* 'también te amo'.
- *katu* 'en cambio, pero'.
- *-voi* 'mismo, ya', unida: *oĩvoi* [J:blog].

**A / M**

**U10 · Costumbres.**
- *-va* de hábito: *Che akaruva pyharevépe* [sic, se esperaría *akarúva*] 'suelo comer de mañana' [WPes].
- *-mi* de hábito pasado: *omomendámi* [J:blog].
- *-jepi* 'solía': *Boligua-ygua oipyhýjepi marandu* 'los bolivianos solían captar los mensajes' [J:blog].

**M**

### B2

**U1–2 · Evidenciales.**
- *ra'e* (descubrimiento o sorpresa; equivale al "había sido" paraguayo, G7): *Ndaha'éi jagua, péva niko jaguakuña ra'e*; *che rechaga'u ra'e* 'resulta que me extrañaste' [J:hk].
- *ndaje* y su forma breve *-je* (lo que dicen otros): *Ñavõ 15 ára ndaje omano peteĩ ñe'ẽ* 'dicen que cada 15 días muere una lengua'; *Upérõje isy ojerurékuri…* 'entonces, cuentan, su madre pidió…' [J:blog].
- *nipo* (duda): aparece en *Are guivéma nipo ra'e…* [J:blog]; su valor está por confirmar.

**A / M**

**U3 · Deber, probabilidad y frustración.**
- *-va'erã* (obligación): *Poyvy ojehupiva'erã media asta* 'la bandera deberá izarse a media asta' [J:abc].
- *-ne* (probabilidad): ver §1.
- *-mo'ã*: como 'casi' (frustrativo), **sin ejemplo verificado**. Atestiguado solo en el futuro negativo y en el contrafactual (U4).

**A / B**

**U4 · Concesión e irreal.**
- **Concesión:** *-ramo jepe / -rõ jepe* 'aunque': *iporãramo jepe imemby kuña, namendaséi gueteri* 'por más que su hija sea linda, todavía no quiero casarme'; *Upéicharõ jepe* 'aun así' [J:blog]; *Eku'éke, jepémo maymave oha'ãrõ reñeme'ẽ* 'seguí, aunque todos esperen que abandones' [J:blog].
- **Condicional irreal:** *-mo'ã* en la principal, *-rire* o *-ramo* en la condición.
  - *Cherupi rire, apytu'uva'erãmo'ã* 'si me hubieras alzado, habría descansado' [GI].
  - *ỹramo heta ojojukarei ramo'ã hikuái* 'si no, se habrían matado inútilmente' [J:spl].
  - *Iporãva'erãmo'ã…* 'ojalá pudiéramos…' [J:anlp].

**A / M**

**U5 · Incorporación nominal.** *che sy otembi'u'apokuaa* 'mi madre sabe cocinar' (literalmente 'comida-hacer-saber') [J:hk]. **M**

**U6 · Reduplicación.** *Pe jagua opo* 'saltó' frente a *opopo* 'brincó' [J:hk]; *Ojepokyty kyty* 'se frotaba (una y otra vez)' [J:blog]. **M**

**U7 · Foco con niko/ningo.** Ver B1-U9. **M**

**U8 · Gramática del jopara.** Raíces castellanas con morfología guaraní: *ejepreocupa* (*Leo, tereho ejapo radio, anive ejepreocupa…*), *oñesuspende*, *oapela* [J:abc]. Para el registro formal se reescriben con raíz guaraní (*ejepy'apy*). **A**

---

## 4. Números y hora en A1

- **1–10:** *peteĩ, mokõi, mbohapy, irundy, po, poteĩ, pokõi, poapy, porundy, pa* [Ap]. Son frecuentes en guaraní escrito: *peteĩ* 3.422 veces, *mokõi* 476, *pa* 42 en [J], incluido SPL.
- **Más allá del 10** [Ap][J]:
  - 11 *pateĩ* (no hallé *papeteĩ*), 12 *pakõi*, 15 *papo*, 16 *papoteĩ*.
  - 20 *mokõipa*, 30 *mbohapypa*, compuestos como *mokõipa pokõi* 27 [J:sem]; 100 *sa*, 1.000 *su*. Poco usados.
- **Días y meses** (sistema numeral, muy usado por SPL): *arateĩ* domingo, *arakõi* lunes, *araapy* martes, *ararundy* miércoles, *arapo* jueves, *arapoteĩ* viernes, *arapokõi* sábado; *jasyteĩ* enero … *jasypakõi* diciembre [Ap]. Ejemplo: *arapoteĩ 8 jasyporundýpe 18:00 aravo ramo* 'el viernes 8 de setiembre a las 18:00' [J:spl].
- **Hora:**
  - Por escrito: cifras + *aravo* ('hora'), con *ramo*, *jave* o *-pe*: *pyhareve 9:00 aravo jave* 'a las 9:00 de la mañana' [J:abc].
  - Duración: *mokõi aravo* 'dos horas'.
  - Pregunta: *mba'e aravo…* (*mba'e aravo epu'ã pyharevekue* '¿a qué hora te levantás a la mañana?' [J:hk]). La forma con *-pa* (*Mba'e aravópa?*) es regular pero **no la hallé**.
- **Números castellanos:** las noticias en guaraní usan cifras y castellano para cantidades grandes (*millones*: 443 veces en [J], casi todas de abc). Que en el habla se diga casi siempre en castellano el precio y la hora es afirmación de G6/G7, **sin fuente aquí**.

**Recomendación.** En A1, *peteĩ–po* (1–5) en U4 y hasta *pa* (10) en U5. Los días con *ára + numeral*. Cifras castellanas para precios, teléfonos y la hora, etiquetadas `registro: jopara`.

---

## Recommendations for the app

1. **Ortografía en el build.** Implementar el procedimiento de §2.2 y la tabla de §2.3 como comprobador. Debe marcar:
   - una forma con sufijo átono y raíz sin tilde (*ahata*);
   - una tilde sobre vocal con virgulilla;
   - dos tildes en una palabra;
   - *-pe* tras sílaba nasal;
   - *ja-/je-/jo-/mbo-/nd-* orales ante raíz nasal.
2. **Estilo de la casa:** el de SPL (§2.6). En la corrección de respuestas tecleadas, aceptar las variantes de ABC Color y las de unión o separación de *kuri*, *hína* y *mo'ãi*. Penalizar solo nasalidad, puso y prefijos.
3. **Paradigmas en la lección** de imperativo y optativo, con tres columnas: oral, nasal y aireal (formas atestiguadas: *eju / eñeha'ã / eipe'a*; *toho / toñe'ẽ / toiko*).
4. **Ejemplos.** Usar los de este documento con su campo `fuente`. Los de `[J:hk]` necesitan revisión nativa antes de llegar a examen: tienen errores (*ahata*, *hina*, *cheróga*).
5. **Comparar con el castellano** en cada lección:
   - "no" en dos partes (nd-…-i);
   - persona al principio del verbo;
   - posposiciones;
   - sin "ser/estar" ante adjetivo;
   - pasado no obligatorio;
   - *ñande/ore*.
6. **Tecleo:** g̃ como g + U+0303; puso como `'`; normalizar NFC.

## Open questions / needs a native speaker

1. **El texto de la Academia** (2016) y su gramática (2018): ¿qué lista oficial de sufijos tónicos y átonos dan? ¿-ve y -ha son tónicos (uso de SPL) o átonos (uso de ABC Color)?
2. **¿kuri, hína y mo'ãi** se escriben unidas o sueltas según la norma?
3. **Prohibitivo:** ¿*ani reho* o *ani eho*? ¿Es estándar *anitei*?
4. **Formas no halladas:** *eguapy*, *Mba'e aravópa?*, *rehótei*, *toho'ỹ*, exhortativo con *-na*.
5. **Condición de -mbota:** ¿tras -po o tras raíz nasal?
6. **Significados por confirmar:** -pyre (*jehaipyre*), -mo'ã como 'casi', *nipo*, *-tava*, *-vete*, *-rasa*, causativo sociativo.
7. **Grafías:** ¿'sí' es *heẽ* o *hẽe*? ¿Los chendales se escriben unidos (*chekane'õ*) o separados (*che kane'õ*)?
8. **Habla real:** ¿precios y hora en castellano? ¿Qué numerales usa de verdad un hablante de A1?
9. **Revisión docente:** validar los "errores previsibles" de §3 y normalizar los ejemplos del subcorpus hk.

---

## Fuentes

**Acceso.** Todo lo que no es [Ap] ni [J] lo vi a través de extractos de WebSearch. Hosts inaccesibles en esta sesión:
- youngconfspb.com, logos.it, ftyers.github.io, docs.verbix.com, core.ac.uk, lingbuzz.net, www.portalguarani.com, guaraniayvu.com, lenguaguarani.blogspot.com, acervo.socioambiental.org, dokumen.pub, escholarship.org, recursos.mec.edu.py.
- api.github.com: 403 para repositorios no adjuntos.
- Más los hosts que ya listó G7.

Se agotó el cupo de WebSearch: pedir una nueva sesión para cerrar los puntos M y B.

**Normas y material docente**
- [Acad] Reglas de la Academia (2016): https://www.lanacion.com.py/2016/09/05/aprueban-reglas-ortograficas-del-guarani/ ; https://www.ip.gov.py/ip/2016/09/08/se-presentaron-las-reglas-ortograficas-del-guarani/ ; https://cultura.gov.py/2016/09/ojekuaaukata-guarani-nee-jehaira-mbojojahakuera-se-presentaran-las-normas-ortograficas-del-guarani/
- [UNA] UNA, *Taller de Comunicación Institucional en Guaraní* (2020): https://www.una.py/wp-content/uploads/2020/09/Primer_Taller_de_Comunicacion_Institucional_en_Guarani_DRIC-SG_Septiembre2020.pdf
- [ABCo] ABC Escolar, ortografía y acentuación:
  - parte 4: https://www.abc.com.py/escolar/formacion-docente-continua/2025/04/15/mbojojahakuera-jehaikatura-guaranime-parte-4/ (partes 1–3: misma serie, 25-03, 01-04 y 08-04-2025);
  - acentuación: https://www.abc.com.py/escolar/tercer-ciclo/guarani/2025/04/29/acentuacion-en-guarani-clasificacion-reglas-de-acentuacion/ ;
  - nasalidad: https://www.abc.com.py/escolar/tercer-ciclo/guarani/2025/05/13/la-marca-de-la-nasalidad-en-guarani/
- [ABCp] ABC Escolar, posposiciones: https://www.abc.com.py/escolar/tercer-ciclo/guarani/2025/05/27/las-posposiciones-en-guarani-neeriregua/ ; https://www.abc.com.py/escolar/tercer-ciclo/guarani/2025/06/10/las-posposiciones-polisilabicas-en-guarani/
- [ABCt] ABC Escolar, tiempos, aspecto, adverbios e imperativo (2026):
  - https://www.abc.com.py/escolar/formacion-docente-continua/2026/05/26/neetevakuera-ara/
  - https://www.abc.com.py/escolar/formacion-docente-continua/2026/06/02/neetevakuera-ara/
  - https://www.abc.com.py/escolar/formacion-docente-continua/2026/06/09/neeteva-jeaporeko/
  - https://www.abc.com.py/escolar/formacion-docente-continua/2026/10/06/neeteja-neeteykeva/
  - https://www.abc.com.py/escolar/formacion-docente-continua/2026/08/18/neereko-oiko-saisaiva-ombaeapoukava-ha-apouka-pohyi/
  - lectura *Oky jave*: https://www.abc.com.py/escolar/segundo-ciclo/2026/10/19/guarani-jehechajey/
- [UNLP] Cátedra de guaraní de la UNLP, posposiciones: https://perio.unlp.edu.ar/catedras/guarani/2020/04/29/posposiciones-neeriregua/

**Gramáticas y estudios**
- [Est] Estigarribia 2020, *A Grammar of Paraguayan Guarani* (CC BY): https://discovery.ucl.ac.uk/10107709/1/A-Grammar-of-Paraguayan-Guarani.pdf ; capítulo de fonología: https://www.jstor.org/stable/pdf/j.ctv13xpscn.8.pdf
- [Clo] Clopper y Tonhauser 2013: https://www.asc.ohio-state.edu/clopper.1/pubs/clopper_ijal13.pdf
- [Ton] Tonhauser 2007 (tiempo nominal): https://people.umass.edu/scable/LING720-FA15/Handouts/13.Tonhauser-2007.pdf
- [Lus] Lustig, *Ortografía guaraní*: https://www.staff.uni-mainz.de/lustig/guarani/ortografia/ortografia.html ; Ojeda Aquino: http://nuestralenguaguarani.blogspot.com/2013/09/la-acentuacion-el-acento-agudo-se-usa.html
- [GR] Guarani Renda, *Prosodia*: https://guaranirenda.tripod.com/neepukuaa/prosodia.html
- [GE] *Guía de estilo para una ortografía razonada del guaraní* (ISBN 978-99953-99-06-1), vista solo en un extracto.
- [CEPAG] *Hablemos el guaraní*: "ve es sufijo tónico; va y [ma] son átonos", según un extracto con OCR defectuoso ("rna"). https://acervo.socioambiental.org/sites/default/files/documents/GIL00007.pdf
- [WPes] Wikipedia, *Idioma guaraní*: https://es.wikipedia.org/wiki/Idioma_guaran%C3%AD
- [WLes] Wikilibros: https://es.wikibooks.org/wiki/Guaran%C3%AD/Gram%C3%A1tica/Adverbios ; https://es.wikibooks.org/wiki/Guaran%C3%AD/Gram%C3%A1tica/Tiempos_verbales ; https://es.wikibooks.org/wiki/Guaran%C3%AD/Texto_completo
- [ITC] Britez Caballero, *Clase 2 Guaraní*: https://www.itc.edu.py/Clase%202%20Guaran%C3%AD.pdf
- [Neo] *Neologismos en guaraní paraguayo*: https://www.researchgate.net/publication/390420355_Neologismos_en_guarani_paraguayo
- [Imp] Imperativos y optativos: https://youngconfspb.com/download_file/view/143/230
- [UNC] UNC, préstamos gramaticales: https://cdr.lib.unc.edu/downloads/6w924n40s
- [Hau] Hauck 2022, el exhortativo: https://doi.org/10.3390/languages7030173
- [GI] *Guarani idiomática 2018*: https://www.slideshare.net/slideshow/guarani-idiomatica-2018/239322294
- Nasalización: https://escholarship.org/content/qt75s541nd/qt75s541nd.pdf ; https://escholarship.org/content/qt14z2t2fk/qt14z2t2fk_noSplash_c78e53963c1c970e43328d083e184e33.pdf ; tarjetas *kue/ngue* (fuente débil): https://quizlet.com/py/580272114/guarani-nee-nemboheko-guasu-flash-cards/
- Diccionarios y vocabularios: Guasch, *tereho* (portalguarani, en búsqueda); *jave*: https://duome.eu/vocabulary/es/gn/skills

**Herramientas y corpus**
- [Ap] Kuznetsova y Tyers 2021: https://aclanthology.org/2021.americasnlp-1.9.pdf ; datos: https://raw.githubusercontent.com/apertium/apertium-grn/master/apertium-grn.grn.lexc y https://raw.githubusercontent.com/apertium/apertium-grn/master/apertium-grn.grn.twol . Su lista de sufijos "átonos" en el `twol`: ma, nte, icha, gui, re, mi, kuri, ta, ra'e, ne, niko, va, pa, pe/me.
- [J] Jojajovai: https://github.com/pln-fing-udelar/jojajovai ; datos: https://raw.githubusercontent.com/pln-fing-udelar/jojajovai/master/data/jojajovai_all.csv
