# The synthetic voice of A1, take by take

These are the clips `tools/make-tts.py` said for A1 units 1 to 4 and the extras, each heard back by two speech
recognisers. They are a stand-in until a person records the course, and **nobody has listened to them**:
`sound/VOICE.md` says what the voice renders, what it does not, and what a native speaker should hear first.

**Licence: CC BY-NC 4.0, non-commercial use only**, with attribution. The clips were made with Meta AI's MMS-TTS models
`facebook/mms-tts-grn` (Guarani) and `facebook/mms-tts-spa` (Spanish, the narrator): Pratap et al., «Scaling Speech
Technology to 1,000+ Languages», 2023; https://creativecommons.org/licenses/by-nc/4.0/. They were cut and, for the man's
lines, lowered in pitch by the tool. They may not ship in an app that is sold or carries advertising. The rest of the
repository is not under this licence.

| | |
|---|---|
| `<key>.flac` | 438 clips, one per recorded row of `manifest.json`: 16 kHz, mono, 16 bit, FLAC (lossless), 10.2 MB. The key is the clip's key in the course (`sound/A1/manifest.json`). |
| `left-out/` | 65 clips that stay silent in the app, kept for a listener: every recording that `sound/silent.json` names (the words of the nasal pairs among them, said on 16 November for this purpose) or that the recognisers left out, of the take or of its MP3. `sound/VOICE.md`, «What must stay without audio», has the reason for each. 1.5 MB. |
| `manifest.json` | The clip list without the rows that stay silent: the list to give `tools/make-sound.mjs`, not `sound/A1/manifest.json`. Its last sentence states the licence of these clips (CC BY-NC 4.0), not that of the studio's recordings. |
| `takes.json` | The seed, the cut, the rate and the pitch of every clip, the libraries and the thread count they were made with, and what `--verify` left out. |
| `tts-report.json`, `tts-report.csv` | What each recogniser heard of every clip, and of every take that was tried. The CSV has one row a clip, with its key, its text and, in the last column, why a clip is in `left-out/`. |
| `voices.json` | The credits `tools/make-sound.mjs` copies into the app's sound files. |
| `mp3-heard.json` | What each recogniser hears in the app's MP3 of every line, three ways (`tools/hear-sound.py`): the record of the ear's test on what ships, and what lets a later run hear only the clips that changed. |

Do not edit a file here by hand, and do not make the folder again from nothing: on another machine, or with another
thread count, the model gives other samples, and the verified takes would be lost. After a change of the content, of
`sound/respell.json` or of `sound/silent.json`:

```
node tools/build-course.mjs && node tools/sound-list.mjs A1
python3 tools/make-tts.py --out sound/A1/voz --verify --changed     # says only what is new or changed, keeps the rest
node tools/make-sound.mjs sound/A1/voz --manifest sound/A1/voz/manifest.json --kind synthetic
python3 tools/hear-sound.py sound/A1/voz                            # hears the clips whose MP3 is new, as the app plays them
```

**For a listener.** A clip in `left-out/` that sounds right to you can play in the app: say so in `sound/silent.json`
(take its entry out of "keys", "texts" or "contrasts" if one names it; name it under "keep" if it is a slow take or a
clip of one or two words; the file's first entry explains), then run the four lines above. The clip comes back from
`left-out/` as it is, the very file you heard: nothing is said again for it, and the voice is not needed. (The last
line then hears the clip's MP3, which is new to it, and for that it loads the recognisers; "keep" makes it leave the
clip alone whatever they write.)
