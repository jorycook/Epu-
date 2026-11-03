# G3 · Learners and prior art: who learns Guarani from Spanish, and what already exists

Notes for the Guarani app (Yaoki model: one app, levels A1–C2). The level framework, placement test and exams are in `G6-cefr-framework.md` and are not repeated here. Compiled 2026-11-03.

**Method.**
- WebFetch could not reach `www.lanacion.com.py` or `www.abc.com.py` (ENOTFOUND: outside the session's allowed hosts). After those two failures I stopped fetching. Every claim below rests on WebSearch summaries of the URLs cited.
- To check primary sources, these hosts must be allowed: lanacion.com.py, abc.com.py, ultimahora.com, ine.gov.py, spl.gov.py, pj.gov.py, hoy.com.py, duolingo.com, duolingo.fandom.com, medwave.cl.
- Última Hora pages carry crawl dates ("jul 2026") that are not publication dates. I give a year only where the content fixes it.
- The turn's web-search budget ran out before the last check (voseo).
- Confidence marks: **H** an official figure or several consistent sources · **M** one credible source, or a search summary of one · **L** anecdotal, undated or conflicting.
- Persona details without a citation are design hypotheses.

## 0. The answer in one screen

1. **Design first for urban, Spanish-dominant Paraguayans aged about 18–35 who understand some Guarani but do not speak it** ("entiendo pero no hablo"). They are the largest group, school did not make them speakers, and they understand more than they can say, which is the profile G6's two-part placement was built for (§3, P1).
2. **Second: professionals who must serve Guarani speakers** (health, justice, public counters). Serve them with optional work scenes inside the same levels, not a separate app (P2).
3. **The diaspora and Argentines of the Litoral** share P1's needs and add family and music hooks (P3, P4).
4. **Foreigners living in Paraguay**, for a Spanish-language app, are mostly Argentines, and they are true beginners (P5).
5. **Teach the Guarani people speak, Spanish loans included, with the academic form labelled beside it.** The Education Minister calls school Guarani "muy académica, una lengua casi construida" (§2).
6. **No structured multi-level path exists for self-study.** Duolingo's course (2016) is the only gamified course from Spanish I found, and it has reportedly been withdrawn. Everything else is a dictionary, phrase app, children's game or classroom course (§4).
7. **Goal screen in three steps:** why and where; where you start (two self-ratings, then placement); your plan.
8. **Motivation:** keep Yaoki's rules on accuracy, getting up (起) and showing up. Add private speaking practice, a self-reported "lo usé" stamp and the August Guarani week. No leaderboards, no lives, no speed.

---

## 1. Demographics

### 1.1 Paraguay: language spoken at home (INE household survey, EPHC)

| Survey | Guarani | Guarani + Spanish | Spanish | Urban / rural | Source |
|---|---|---|---|---|---|
| EPHC 2022, Q4 | 32.6% (2,182,359) | 34.3% | 30.4% | — | [LN 2023](https://www.lanacion.com.py/gran-diario-domingo/2023/08/27/el-guarani-sigue-siendo-el-idioma-mas-fuerte-en-los-hogares/), [UH](https://www.ultimahora.com/cual-es-el-idioma-que-mas-hablan-los-paraguayos-n3049680) (H) |
| EPHC 2024 | "3 in 10" | 38.6% (38.7% in [LN 2025](https://www.lanacion.com.py/gran-diario-domingo/2025/03/02/el-bilinguismo-paraguayo-un-valor-cultural-a-custodiar/)) | — | Guarani: urban 16.3%, rural 53.1% | [ABC 2025](https://www.abc.com.py/nacionales/2025/08/25/ine-3-de-cada-10-paraguayos-solo-habla-guarani/) (M) |
| **EPHC 2025, annual (latest)** | **27.9%** (1,587,817) | **38.7%** (2,204,477) | **30.9%** (1,758,352) | urban 17.8% Guarani, 42.1% both; rural 53.4% Guarani, 30.1% both; other languages 2.2% | [LN 2026](https://www.lanacion.com.py/pais/2026/08/25/casi-el-28-de-los-paraguayos-habla-solo-en-guarani/), [UH](https://www.ultimahora.com/habla-guarani-el-38-7-de-la-poblacion-dice-ine), [Prensa Mercosur](https://prensamercosur.org/2026/02/20/habla-guarani-el-387-de-la-poblacion-dice-ine/) (H) |

- **What the EPHC measures:** the language spoken "most of the time" at home by people aged 5 and over. It leaves out Boquerón, Alto Paraguay, indigenous communities and collective dwellings ([UH](https://www.ultimahora.com/cual-es-el-departamento-donde-mas-se-habla-el-guarani)) (M).
  - It therefore undercounts how many people know Guarani. INE's census director puts the share who speak it "bien o mal" at about 80% ([LN 2025](https://www.lanacion.com.py/gran-diario-domingo/2025/03/02/el-bilinguismo-paraguayo-un-valor-cultural-a-custodiar/)) (M).
- **Urban homes that use only Spanish: about 38–40%.** This is my subtraction from the 2025 urban figures, not a published number.
- **Census 2022** (population about 6.1 million, [UH](https://www.ultimahora.com/censo-revela-que-poblacion-paraguaya-disminuyo-somos-6-109-644-habitantes-segun-el-ine)). According to the census director, the share who speak only Guarani fell from 27.7% in 2002 to 12.1% in 2022 ([LN 2025](https://www.lanacion.com.py/gran-diario-domingo/2025/03/02/el-bilinguismo-paraguayo-un-valor-cultural-a-custodiar/)) (M). The census counts monolingual speakers, unlike the EPHC's home language; I have not seen the tables.
- **By department:**
  - Asunción: 3% use Guarani as the main home language.
  - Central: 10% Guarani, plus 50% who use both ([UH](https://www.ultimahora.com/cual-es-el-departamento-donde-mas-se-habla-el-guarani)) (M).
  - Amambay: 37.6% Guarani, 29.7% Spanish ([LN 2026](https://www.lanacion.com.py/pais/2026/08/25/casi-el-28-de-los-paraguayos-habla-solo-en-guarani/)) (M).
- **Shift across generations.** Arnaldo Casco Villalba ran an online survey of 1,500 people (Oct–Nov 2024). It asked which language the respondent's parent mostly spoke to them; the share answering Guarani fell from 38% to 5% across three generations ([UH](https://www.ultimahora.com/en-tres-generaciones-uso-frecuente-de-guarani-bajo-de-38-a-5-segun-investigador)). The sample is not representative (L as a measure), but the signal is strong.
- **Doctors in training.** A study of 264 final-year medical students (Medwave 2018) found they knew less Guarani than the general population. The knowledge measure was 31.25% among students from the interior and 2.5% among those from the capital ([BVS](https://search.bvsalud.org/gim/resource/es/biblio-912112)) (M; the indicator still needs checking).

### 1.2 Outside Paraguay

- **Argentina.**
  - More than 522,000 Paraguayan-born residents in the 2022 census ([LN 2024](https://www.lanacion.com.py/pais/2024/01/17/mas-de-522000-paraguayos-viven-en-argentina-segun-ultimo-censo/)). They are 27% of the foreign-born, the largest group, and 73% of all migrants live in Buenos Aires city or province ([Hoy Día](https://hoydia.com.ar/informacion-general/mas-del-73-de-los-migrantes-residentes-en-argentina-viven-en-buenos-aires)) (H).
  - There is no count of Guarani speakers. The census asked about language only of people who identify as indigenous ([Íkala](https://revistas.udea.edu.co/index.php/ikala/article/view/359921), [Chubut](https://www.chubuteduca.ar/wp-content/uploads/2022/05/censo2022-reconocernos-originarias-os-actividades-eib.pdf)), so Paraguayan migrants' Guarani is not captured (my inference, M).
  - **Corrientes:**
    - Ley 5598 (2004) made Guarani an "idioma oficial alternativo" and required it to be taught ([Misiones Online](https://misionesonline.net/2004/11/22/el-guarani-ya-es-el-segundo-idioma-oficial-de-corrientes/)) (H).
    - An academic article says the law has not been regulated ([UNNE](https://revistas.unne.edu.ar/index.php/riie/article/view/7255/6744)) (M).
    - Carolina Gandulfo's study of a rural school describes a "discurso de la prohibición" aimed at children. Guarani is spoken but hidden, and the logic of "entiendo pero no hablo" still holds ([UNNE](https://revistas.unne.edu.ar/index.php/nor/article/view/1584/1352), [Billiken](https://billiken.lat/interesante/sabias-que-el-guarani-es-la-segunda-lengua-oficial-de-corrientes/), [Garabide](https://www.garabide.eus/english/words-of-the-world/carolina-gandulfo-the-children-were-silent-in-spanish-not-in-guarani-but-this-language-was-not-valued)) (M).
    - Chamamé, on UNESCO's intangible-heritage list since 2020, is sung in Spanish, in Guarani or in both, with the Guarani sapukai shout ([The Clinic](https://www.theclinic.cl/2020/12/16/conoce-el-chamame-el-baile-argentino-que-la-unesco-reconocio-como-patrimonio-inmaterial/), [Argentina.gob.ar](https://www.argentina.gob.ar/node/441472)) (M).
  - **Misiones and Formosa** are listed with Corrientes as provinces with school policies for Guarani ([SEDICI 2024](https://sedici.unlp.edu.ar/bitstream/handle/10915/197906/Documento_completo.pdf?sequence=1)) (M). Misiones' laws centre on **Mbya** Guarani, another Guarani language ([RDPL](https://revistas.unc.edu.ar/index.php/RDPL/article/view/8502/9369)) (M).
- **Bolivia.**
  - Guarani is one of 36 official native languages ([Spain MFA](https://www.exteriores.gob.es/documents/fichaspais/bolivia_ficha%20pais.pdf)) (M), and the 2024 census counted 43,870 speakers ([eju.tv](https://eju.tv/?p=4753273)) (M).
  - Bolivian varieties (Ava, Simba, Isoseño) are classified separately from Paraguayan Guarani ([Guarani languages](https://en.wikipedia.org/wiki/Guarani_languages)) (M).
  - So the app should always say "guaraní paraguayo".
- **Brazil.** Tacuru (Mato Grosso do Sul) has had Guarani as a co-official language since 2010 (Lei 848/2010). It is a Kaiowá area, not the app's variety ([Estudos Históricos](https://estudioshistoricos.org/25/eh2504.pdf)) (M).
- **Mercosur.**
  - Education ministers declared Guarani a "lengua histórica" in 1995, and a 2006 decision made it an "idioma del Mercosur", but not an official or working language ([Parlasur 2009](https://www.parlamentomercosur.org/innovaportal/file/3038/1/rec-01-2009-guarani---idioma-oficial.pdf), [ABC](https://www.abc.com.py/especiales/fin-de-semana/el-mercosur-en-deuda-con-el-guarani-629679.html), [Trinidad 2014](https://tprmercosur.org/pt/activ/2014_trinidad_gn_mercosur.pdf)) (M).
  - The NYT reported that the Parlasur adopted it as a working language in 2014 ([NYT via WRAL](https://www.wral.com/newfound-pride-in-guaran-a-language-long-disdained-in-paraguay/17238307/)) (L: conflicts with the above).
- **Spain.**
  - 162,633 Paraguayan citizens on 1 January 2025, about 60% of them women, with Madrid the largest community ([LN 2026](https://www.lanacion.com.py/politica/2026/03/02/paraguayos-residentes-en-espana-aguardan-con-gran-expectativa-visita-de-baruja/), [Wikipedia](https://en.wikipedia.org/wiki/Paraguayans_in_Spain)) (M).
  - 5,377 took Spanish nationality in 2024 and leave that count ([UH](https://www.ultimahora.com/mas-de-5-000-paraguayos-recibieron-la-nacionalidad-espanola-por-residencia-en-2024)) (M).
  - More than 700,000 Paraguayans live abroad in all ([Infonegocios](https://infonegocios.com.py/y-ademas/mas-de-700-000-paraguayos-viven-fuera-del-pais-donde-estan-y-como-es-su-perfil)) (M).
- **Foreigners in Paraguay.**
  - The 2022 census counted 156,804 (2.6%): Argentines 65,035 (41.5%) and Brazilians 53,580 (33%). Argentines have overtaken Brazilians, who were the largest group in 2002 ([Prensa Mercosur](https://prensamercosur.org/2025/06/10/revelan-que-en-paraguay-existen-un-poco-mas-de-156-000-inmigrantes/), [UH](https://www.ultimahora.com/datos-del-ine-detallan-que-hay-poco-mas-de-156-000-migran), [LPO](https://www.lapoliticaonline.com/paraguay/economia-py/por-primera-vez-los-argentinos-lideran-la-lista-de-migrantes-en-paraguay-1128/)) (H).
  - 79,482 of them are in work ([Infonegocios](https://infonegocios.com.py/plus/casi-80-000-extranjeros-trabajan-en-paraguay-estos-son-los-sectores-que-mas-los-emplean)) (M).

---

## 2. Attitudes

**Historical stigma.**
- After the 1870 war, the occupying forces banned Guarani, above all in schools; the insult "guarango" (ignorant, boorish) dates from then (David Galeano Olivera in [ABC](https://www.abc.com.py/edicion-impresa/suplementos/escolar/25-de-agosto-dia-del-idioma-guarani-1733100.html)) (M).
- One woman remembers being made to kneel on salt and maize for whole mornings for speaking Guarani in class ([NYT via WRAL](https://www.wral.com/newfound-pride-in-guaran-a-language-long-disdained-in-paraguay/17238307/)) (M).
- Saying "yo no hablo guaraní" signalled higher status ([LN 2023](https://www.lanacion.com.py/pais/2023/09/13/el-fracaso-de-mitre-el-triunfo-del-guarani/)) (M).
- The 1967 Constitution named Guarani a "lengua nacional" but not an official one ([ABC 2019](https://www.abc.com.py/edicion-impresa/locales/2019/08/25/hoy-se-conmemora-el-dia-nacional-del-idioma-guarani/), [LN 2018](https://www.lanacion.com.py/pais/2018/08/25/toikove-guarani-nee/)) (M). The World says it was "banned" under Stroessner ([The World 2024](https://theworld.org/stories/2024/10/01/guarani-is-identity-how-an-indigenous-paraguayan-language-has-endured-through-the-ages)) (L: conflicts with its legal status).
- The 1992 Constitution made it official alongside Spanish (art. 140) and set early teaching in the mother tongue (art. 77); bilingual education began in 1994 ([OEI](https://oei.int/downloads/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZ3REIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--f2054d51d7dec607cbd79686a460915c131d92d4/CLAVES%20COSTA%20RICA%20PARAGUAY%2014%2006%202021.pdf)) (H). The 2010 language law and its bodies are covered in G6.
- Some parents stopped passing Guarani on so their children would not be called "guarangos" and could aim higher ([UNRIC](https://unric.org/es/la-lengua-guarani-orgullo-de-un-pais/)) (M). Some now push English instead ([InfoNews](https://infonews.ca/?p=7329370)) (L).

**Stigma today.**
- In 2021 a Brazilian rancher in Curuguaty banned her staff from speaking Guarani, then retracted and apologised after public outrage ([ABC 2021](https://www.abc.com.py/nacionales/2021/03/01/empresaria-que-prohibio-guarani-en-su-estancia-se-retracta-y-pide-perdon/)) (H).
- A radio presenter apologised for her remarks about Guarani ([UH](https://www.ultimahora.com/locutora-pide-disculpas-sus-dichos-el-guarani-n420665)) (M).
- A Paraguayan boy at a school in Argentina wrote an apology because he "only speaks Guarani" ([ABC](https://www.abc.com.py/edicion-impresa/locales/disculpas-por-solo-hablar-guarani-conmociona-redes-1594981.html)) (M; date unknown).
- The language-policy minister links the lingering prejudice to poverty and rural life ([NYT via WRAL](https://www.wral.com/newfound-pride-in-guaran-a-language-long-disdained-in-paraguay/17238307/)) (M).

**School Guarani as part of the problem.**
- Parents complain that their children study Guarani for twelve years and still cannot speak it, and that they learn words no longer used in the street ([ABC 2022](https://www.abc.com.py/opinion/2022/09/06/como-aprender-guarani/)) (M).
- Teachers emphasise grammar and translation, with little speaking ([CONACYT](https://repositorio.conacyt.gov.py/handle/20.500.14066/4043)) (M).
- In November 2024 the Education Minister said "no hemos atinado", describing "una enseñanza muy académica, una lengua casi construida, donde perdemos el sabor, la dinámica y emocionalidad de la lengua" ([ABC 2024](https://www.abc.com.py/nacionales/2024/11/18/ministro-de-educacion-sostienen-que-no-se-ha-atinado-a-la-ensenanza-eficaz-del-guarani/)) (H).
- In 2023 the MEC dropped Guarani from the entrance exams for technical secondary schools, citing pupils' trouble writing it after the pandemic ([ABC 2023](https://www.abc.com.py/nacionales/2023/01/14/mec-elimino-el-guarani-de-los-examenes-de-ingreso-para-bachilleratos-tecnicos/), [Prensa Mercosur](https://prensamercosur.org/2023/01/15/mec-y-ateneo-acuerdan-medidas-tras-polemica-exclusion-del-guarani-de-examenes/)) (H).
- Teachers blame jopara for children's weak school Guarani ([ABC](https://www.abc.com.py/edicion-impresa/locales/el-jopara-dificulta-el-aprendizaje-de-guarani-y-castellano-afirman-maestros-1731503.html)) (M). Yet one study found favourable views of the academic variety and no clear diglossia in reported use ([Escobar 2019](https://vtechworks.lib.vt.edu/items/1bf2dd2a-8450-4eb4-8258-3775099b551e)) (M).

**Recent prestige.**
- Babies and businesses are given Guarani names ([NYT via WRAL](https://www.wral.com/newfound-pride-in-guaran-a-language-long-disdained-in-paraguay/17238307/)) (M).
- Google Translate added Guarani in 2022, text only; Google said quality "still lags far behind" ([Bloomberg Línea](https://www.bloomberglinea.com/2022/05/11/google-translate-agrega-quechua-guarani-y-aimara-a-su-repertorio-de-idiomas/), [MercoPress](https://en.mercopress.com/2022/05/13/google-s-translating-tool-adds-guarani-aymara-and-quechua-to-its-menu)) (H).
- Creators teach Guarani with humour on social media, for example Chera'a, the Facebook group "Curiosidades de la Lengua Guaraní", and @artlume.py on TikTok, who translates phrases his followers ask for ([ABC 2024](https://www.abc.com.py/nacionales/2024/08/25/el-idioma-guarani-en-las-redes-sociales-divulgadores-que-inspiran/), [LN 2024](https://www.lanacion.com.py/lnpop/2024/01/10/actor-paraguayo-se-popularizo-en-tiktok-por-ensenar-guarani/)) (M).
- Rap in jopara (Avakuete) plays at home and abroad ([Infonegocios](https://infonegocios.com.py/default/avakuete-el-proyecto-que-une-hip-hop-guarani-y-musica-paraguaya-en-una-sola-identidad)) (M).
- Every August the SPL runs a week for the language, "Rohayhu che ñe'ẽ", around the Día del Idioma Guaraní on 25 August ([IP](https://www.ip.gov.py/ip/?p=427527), [UH](https://www.ultimahora.com/paraguay-invita-hablar-guarani-una-semana-como-promocion-del-idioma-oficial-n1103311)) (M).
- UNA's medical faculty launched a national olympiad of medical Guarani with the Health Ministry and the SPL ([UH](https://www.ultimahora.com/a-sanar-desde-el-idioma-lanzan-primera-olimpiada-nacional-de-guarani-mdico)) (M).

**How heritage learners feel.**
- **Afraid of mistakes.** Nursing and obstetrics students at UNA felt ashamed to speak Guarani for fear of mispronouncing it and being mocked ([RUNIMED](https://alcideschaux.github.io/RUNIMED/full_papers/v0601-a01.pdf)) (M). A 2021 public talk opened by asking why so many people say they do not speak it well ([ABC 2021](https://www.abc.com.py/espectaculos/2021/06/17/tertulias-nocturnas-yo-no-se-hablar-bien-guarani/)) (M).
- **Passive.** "Entiendo pero no hablo" (Gandulfo, above).
  - A study at an Asunción school found Guarani use falling from one generation to the next and kept for private life, while still tied to national identity and closeness ([Walsh Lang](https://escholarship.org/uc/item/9k50224n)) (M).
  - Against this, young people in Fernando de la Mora said they feel free to speak either language anywhere ([PUCP](https://tesis.pucp.edu.pe/repositorio/handle/20.500.12404/12147)) (M).
- **Proud.** "El guaraní nos identifica" ([ABC youth column](https://www.abc.com.py/periodismo-joven/el-guarani-nos-identifica-y-lo-necesitamos-hoy-ani-jaheja-tapykuepe-nande-ne-1608523.html)) (M).
- **In Buenos Aires**, Paraguayan families' beliefs about Guarani, and the power relations behind them, shape whether it gets used ([Santacruz Ascurra 2022](https://ebuah.uah.es/dspace/handle/10017/55235)) (M).

**Implication.** Heritage learners carry two fears: that their Guarani "isn't real" (purism, school), and that people will laugh at them. So:
- a common Spanish loan is never marked wrong;
- learners practise speaking alone before they speak to anyone;
- getting up after a mistake earns a reward.

---

## 3. Personas

Starting levels are given as comprehension (C) and production (P), using G6's two-part profile.

**P1 · Urban, Spanish-dominant Paraguayan aged 18–35 with passive Guarani (design first)**
- **Who:** lives in Asunción or Central, in a home that uses both languages or only Spanish (§1.1), with Guarani-speaking grandparents; sat twelve years of school Guarani.
- **Goals:**
  - talk with grandparents and older relatives;
  - follow jokes, songs and voice notes;
  - feel fully Paraguayan;
  - an edge in public jobs, where the language law breaks ties in favour of the candidate stronger in both languages (G6 §1.1).
- **Start:** C A1–B1 on home topics, P A0–A1. The biggest gap of any persona. Knows grammar terms but has no fluency.
- **Situations:** family meals, tereré, football, the market, WhatsApp audios, banter at work.
- **What keeps them going:**
  - early listening wins that show how much they already know;
  - speaking practice in private;
  - small real wins ("I said it to my grandmother");
  - humour and the everyday register;
  - short sessions on the phone.

**P2 · A professional who must serve Guarani speakers**
- **Who:** doctors, nurses and midwives; prosecutors, judges and court staff; people at public counters; police (no training found, a hypothesis). Those raised in the capital start furthest behind (the Medwave gap, §1.1).
- **Evidence:**
  - Doctors without Guarani fall back on colleagues or nurses as interpreters ([UH](https://www.ultimahora.com/no-hablar-guarani-barrera-que-agudiza-acceso-la-salud-n1701843)) (M).
  - A prosecutor needed an interpreter in an oral trial ([Hoy 2026](https://www.hoy.com.py/especiales/2026/03/01/guarani-idioma-oficial-que-sigue-siendo-ninguneado-se-aplica-la-ley-de-lenguas)) (M), although the law guarantees assistance in one's own language in court (same source).
  - Since 2013 the judiciary must use both languages ([PJ](https://www.pj.gov.py/notas/8809-poder-judicial-implementa-oficialmente-el-uso-de-la-lengua-guarani)) (H). It offers a 40-hour virtual basic course and a diplomado ([PJ](https://www.pj.gov.py/notas/22652-curso-basico-de-guarani-juridico-para-funcionarios-judiciales-de-capital), [PJ](https://www.pj.gov.py/notas/29457-realizaran-diplomado-de-guarani-juridico-con-enfasis-en-comunicacion-social-paraguaya)) (H).
  - An older UNIFEM report describes training in Guarani and non-discrimination for 98 front-line civil servants, and a communicative Guarani course from the civil-service secretariat (SFP) ([UNIFEM](https://americalatinagenera.org/wp-content/uploads/2014/06/genero_raza_etnia_unifem_paraguay.pdf)) (M).
- **Goals:** take a medical history, explain a dose, ask for consent, take a statement, read someone their rights, serve a queue, earn trust.
- **Start:** C A0–B1, P A0–A1. Needs work vocabulary early: the body, pain, time, family, documents.
- **What keeps them going:**
  - direct relevance to the job and a can-do checklist for each situation;
  - accuracy, which here is patient safety;
  - G6's app constancia for the CV;
  - sessions that fit around shifts, and days off that never erase a stamp.
- **Adjacent:** the Paraguayan Medical Circle demands Spanish and Guarani certificates from foreign medical students, mostly Brazilian ([MercoPress 2026](https://en.mercopress.com/2026/01/14/pressure-mounts-for-foreign-med-students-in-paraguay-to-be-proficient-in-spanish-and-guarani), [ABC 2026](https://www.abc.com.py/nacionales/2026/01/12/guarani-en-los-hospitales-medicos-exigen-control-a-estudiantes-extranjeros/)) (M). They speak Portuguese, so they fall outside a Spanish-only app.

**P3 · An Argentine of the Litoral (Corrientes, Misiones, Formosa)**
- **Who:** speaks only Spanish, but local Spanish and chamamé carry Guarani words; grandparents who "understand but don't speak".
- **Goals:** understand chamamé lyrics and older relatives; regional identity; teachers and officials covered by Ley 5598.
- **Start:** islands of vocabulary. C A0–A1, P A0.
- **Situations:** the Fiesta Nacional del Chamamé in January ([Canal26](https://www.canal26.com/turismo/2025/12/17/fiesta-nacional-del-chamame-cuando-comienza-la-extensa-celebracion-de-diez-dias-en-corrientes/)) (M), family, trade and work across the border.
- **What keeps them going:** music and regional content.
- **Caveat:** Corrientes Guarani is "acorrentinado" (Gandulfo). The app teaches Paraguayan Guarani and must say so.

**P4 · The diaspora in Buenos Aires and Spain, and their children**
- **Who:** 522,000+ in Argentina and 162,633 in Spain (§1.2). Children who heard Guarani at home and answer in Spanish. Fluent parents are sponsors rather than learners.
- **Goals:** talk with family in Paraguay; keep a family language; pass it on to their own children; pride.
- **Start:** C A1–B2, P A0–A2.
- **Situations:** video calls, WhatsApp audios, community fiestas, football, food, polka and guarania.
- **What keeps them going:** something to send home, such as a phrase or an audio; nostalgia; identity.

**P5 · A foreigner living in Paraguay**
- **Who:** for a Spanish-language app, mostly Argentines (65,035), plus other Spanish speakers. Brazilians (53,580) need Spanish first.
- **Evidence:** expats say even basic Guarani builds rapport, but Spanish comes first ([Asunción Times](https://asunciontimes.com/?p=4511), [Matador](https://matadornetwork.com/abroad/how-i-learned-guarani-in-paraguay), [Jarnias](https://www.jarniascyril.com/?p=20012)) (L). Peace Corps trainees must pass benchmarks in Spanish and in Guarani ([Peace Corps](https://www.peacecorps.gov/ways-to-serve/service-assignments/browse-opportunities/peace-corps-volunteer/business-development-facilitator-10120br/)) (M).
- **Goals:** greetings and small talk; following what is said around them; rapport at work (farming, building, sales).
- **Start:** C A0, P A0.
- **What keeps them going:** survival phrases that work at once; humour; quickly understanding everyday mixed speech.

---

## 4. Prior art

**Duolingo, Guarani for Spanish speakers**
- **History:**
  - Work on the course began in October 2015; the beta opened on 30 August 2016, and the course left beta on 13 August 2018 ([Fandom](https://duolingo.fandom.com/wiki/Guarani_for_Spanish)) (M).
  - Duolingo announced it as "Duolingo's first indigenous language course" ([Duolingo on X](https://x.com/duolingo/status/776452085151895552)) (H). The [UH launch piece](https://www.ultimahora.com/ya-se-puede-aprender-guarani-duolingo-n1024328) carries a 2026 crawl date.
  - It is taught from Spanish only ([Deseret 2022](https://www.deseret.com/opinion/2022/11/6/23439435/opinion-guarani-language-preservation)) (M). At one point 139,000 people were learning it ([Inverse](https://inverse.com/article/32786-duolingo-preserve-extinct-endangered-languages)) (L; the attribution and date are unconfirmed).
- **Reception:** praised as free, eye-catching, fun and interactive ([LN 2016](https://www.lanacion.com.py/2016/10/05/cinco-sitios-estudiar-idiomas-desde-casa)) (M). A commenter says it does not teach the mixed Guarani people actually speak ([Talk:Jopara](https://www.wikipedia.com/wiki/Talk:Jopara)) (L).
- **Status:** reportedly withdrawn, with complaints on the Spanish forum and a petition ([blog](https://happilyevertravels.com/?p=13910), [Google Groups](https://groups.google.com/g/jeydistswamic/c/b5qcZJ-G_Zo), [Change.org](https://www.change.org/p/for-the-duolingo-esperanto-courses-por-la-esperanto-kursoj), [Duoplanet](https://duoplanet.com/duolingo-languages-list/)) (L; undated). **Verify in the app.** I found no source on whether it had audio.

**Other tools**

| Tool | What it is | Strength | Gap |
|---|---|---|---|
| **Guaraní Ayvu** (SPL, Academia and others, 2021) | Android trilingual dictionary with about 3,200 entries, each with a recording of the Guarani word, plus alphabet, grammar and spelling ([IP](https://www.ip.gov.py/ip/2021/06/22/presentan-app-que-traduce-el-guarani-castellano-ingles/)) (H) | audio, the official norm | a dictionary, not a course |
| **Ñañe'ẽ; Kachibot** (2019–21) | a study-and-play app; a robot for school classes ([LN 2019](https://www.lanacion.com.py/revista-vos/2019/11/14/guarani-en-el-telefono-movil/), [LN 2021](https://www.lanacion.com.py/revista-vos/2021/08/25/tres-maneras-divertidas-de-aprender-guarani/)) (M) | playful | made for children |
| **Jahuga; Guarani Translator Audio** | trivia and hangman; audio of phrases ([App Store](https://apps.apple.com/nl/app/jahuga/id1605499586?l=en-GB), [KBEW](https://lifestyle.kbew98country.com/story/252684/your-paraguayan-guarani-translator-launches-guarani-translator-audio-app/)) (L) | — | few users; phrase lists |
| **Poder Judicial** | legal Guarani courses; a bilingual dictionary based on everyday Guarani ([PJ](https://www.pj.gov.py/notas/22652-curso-basico-de-guarani-juridico-para-funcionarios-judiciales-de-capital); G6) (H) | domain focus, spoken register | court staff only |
| **El Granel, Asunción** (since 2015) | weekly 90-minute classes in "el guaraní que se habla en la calle y en el campo", separate groups for foreigners and Paraguayans, immersion trips ([LN 2022](https://www.lanacion.com.py/revista-vos/2022/02/04/imparten-cursos-cortos-para-aprender-el-guarani-que-se-habla-en-la-calle-y-en-el-campo/)) (M) | everyday register; the two audiences taught apart | in person |
| **Ateneo, UBA, UNNE, CEPAG** | their own level systems (G6 §1.2) | structure, certificates | classroom pace; no MCER levels |
| **Peace Corps course** | public-domain manual ([FSI site](https://www.fsi-language-courses.org/guarani/courses/peace-corps-guarani-language-course)) (M) | free to use | taught in English |
| **UNI "Active Guarani Learning Resource"** | open platform with units aligned to MCER A1–A2 ([AILA 2023](https://aila2023.dryfta.com/abstract-archive/abstract/public/1448/active-guarani-learning-resource)) (M) | the only MCER-aligned material found | A1–A2 only; current status unknown |
| **Social media** | short, funny lessons ([ABC 2024](https://www.abc.com.py/nacionales/2024/08/25/el-idioma-guarani-en-las-redes-sociales-divulgadores-que-inspiran/)) (M) | reach, tone | no path, no review |
| **Radio, YouTube** | Radio Nacional broadcasts in both languages ([Radiohear](https://radiohear.com/station/radio-nacional-del-paraguay-920-am-py)), and the Guarani writers' association once ran a programme there ([LN 2020](https://www.lanacion.com.py/gran-diario-domingo/2020/04/12/el-guarani-en-la-radio/)) (M). I found no current radio course and no leading YouTube course in Spanish; the one video course found teaches Mbya, in Portuguese ([Brasil de Fato](https://www.brasildefato.com.br/2026/01/19/ayvu-e-fala-e-e-amor-tambem-curso-online-ensina-lingua-e-cultura-mbya-guarani-a-partir-desta-terca-feira-20/)) | — | — |

**What the field lacks** (my synthesis):
- a self-study path on the phone that goes past beginner level (classroom courses with levels do exist, G6 §1.2);
- separate tracks for comprehension and production;
- native audio at every level;
- the spoken register;
- work situations;
- spaced review of the learner's own mistakes;
- patience with passive bilinguals.

Yaoki's model already supplies most of these.

---

## Recommendations for the app

1. **Personas, in order.**
   - P1 sets the default plan: A1–B1, with listening ahead of speaking.
   - P2 gets optional **"Para mi trabajo"** scenes from A2 (salud, justicia, atención al público), checked by practitioners such as UNA's medical Guarani chair and the judiciary's language office.
   - P3 and P4 use P1's path, with regional and family content.
   - P5 starts at A1, with survival phrases first.
2. **Say which Guarani the app teaches.** One line on the Goal screen says the app teaches the Guarani spoken today, with the Spanish words everyone uses, and shows the academic form beside it. Exercises accept both forms wherever native reviewers agree. "Guaraní paraguayo" is named everywhere.
3. **Goal screen: three real steps.** This makes Yaoki's decorative "Step 2 of 3" bar real.
   - **Step 1 · ¿Para qué? ¿Dónde?** Pick up to two reasons: hablar con mi familia · mi trabajo (salud / justicia / atención al público / docencia / campo) · vivo en Paraguay · mis raíces · música y cultura · viajar · un requisito. Then where they will use it: casa · trabajo · calle y mercado · WhatsApp · música · campo. The answers choose examples and order the work scenes; they never lock content.
   - **Step 2 · ¿Desde dónde empezás?** Two separate scales with can-do wording:
     - understanding: nada · saludos y palabras sueltas · sé de qué se habla en casa · casi todo, pero me cuesta hablar · todo;
     - speaking: nada · frases hechas · me defiendo · converso · con fluidez.
     A gap of two steps or more offers G6's placement test (12–15 minutes); "Empezar en A1" is always available.
   - **Step 3 · Tu plan** (Yaoki's Goal screen): level A1–C2, minutes a day, an optional target date ("a mi ritmo" by default), the ritual, start. An optional, skippable "¿Dónde vivís?" only chooses examples.
4. **Motivation.**
   - **Keep Yaoki's rules:**
     - the clean-run chip (accuracy);
     - the 起 stamp for an item missed once and later answered clean (getting up);
     - the seven-day stamp card, where days off never erase a stamp (showing up);
     - at most one stage ring a day;
     - never reward speed, and keep timers out of practice (exam timing is set in G6).
   - **Listening first** for P1 and P4: open each unit with listening items they can already get right.
   - **Shame-safe speaking:** record yourself, compare with the native clip, check yourself. Nothing is shared or ranked: no leaderboards, and no lives lost for mistakes.
   - **"Lo usé" stamp:** once a week, tap that you used a phrase with a real person (family, a patient, a client). It feeds G6's exposure log; it is self-reported, never checked and never required.
   - **Calendar:** the August Guarani week and 25 August for everyone; the January chamamé season for P3.
   - **Content as reward:** sayings, verses and jokes, chosen with native speakers, unlocked by stamps.
   - **P2:** a can-do checklist for each scene ("puedo preguntar dónde le duele") and G6's constancia.
5. **Any Guarani line in the UI** (stamps, the ritual, cheers) is written by a native speaker. These notes propose none.

## Open questions

1. Is Duolingo's Guarani course still live, and did it ever have audio? Check in the app; duolingo.com and the Fandom wiki could not be reached.
2. The INE census 2022 language tables: the question's wording, and the urban share of Spanish-only homes.
3. How much mixing with Spanish should be accepted, and who decides? Suggest a native-speaker panel, with the Academia's norm as the reference.
4. Spanish UI voice: vos or tú? Not sourced (the search budget ran out); decide with the user.
5. Would employers, the judiciary, the SFP or the medical association accept an app constancia? Is a partnership with the SPL possible?
6. The Litoral: any data on speakers? Should examples show Correntino usage, labelled?
7. A Portuguese interface later, for Brazilians in Paraguay?
8. Recordings: voices from Asunción and from the interior; consent and payment.
