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
| `<key>.flac` | 440 clips, one per recorded row of `manifest.json`: 16 kHz, mono, 16 bit, FLAC (lossless), 10.2 MB. The key is the clip's key in the course (`sound/A1/manifest.json`). |
| `left-out/` | 53 clips that stay silent in the app, kept for a listener: the ones `sound/silent.json` names and the ones the recognisers left out. `sound/VOICE.md`, «What must stay without audio», has the reason for each. 1.4 MB. |
| `manifest.json` | The clip list without the rows that stay silent: the list to give `tools/make-sound.mjs`, not `sound/A1/manifest.json`. |
| `takes.json` | The seed, the cut, the rate and the pitch of every clip, the libraries and the thread count they were made with, and what `--verify` left out. |
| `tts-report.json`, `tts-report.csv` | What each recogniser heard of every clip, and of every take that was tried. |
| `voices.json` | The credits `tools/make-sound.mjs` copies into the app's sound files. |

Do not edit a file here by hand, and do not make the folder again from nothing: on another machine, or with another
thread count, the model gives other samples, and the verified takes would be lost. After a change of the content:

```
node tools/build-course.mjs && node tools/sound-list.mjs A1
python3 tools/make-tts.py --out sound/A1/voz --verify --changed     # says only what is new or changed, keeps the rest
node tools/make-sound.mjs sound/A1/voz --manifest sound/A1/voz/manifest.json --kind synthetic
```
