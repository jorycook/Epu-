#!/usr/bin/env python3
"""Synthetic voice for the course's clips, as a fallback until native recordings exist (notes G4 §4.2 and §6).

Reads sound/<level>/manifest.json (tools/sound-list.mjs), says every clip that is recorded (not put together from
lines, not the tone, not said already under another key) with a voice model, and writes one WAV per key into a folder,
plus voices.json marking the set as synthetic with the model's name and licence. Then tools/make-sound.mjs turns the
folder into the app's sound files, every clip marked kind "synthetic", which the screens say so about ("voz sintética").

usage:  python3 tools/make-tts.py --out <folder> [--manifest sound/A1/manifest.json] [--model <name or path>]
                                  [--es-model <name or path>] [--voices F,M,N] [--only <key> ...] [--redo] [--dry-run]
        --dry-run lists what would be said and checks nothing else (no model is loaded: it runs anywhere).

Two engines, chosen from --model:
  MMS-TTS (default)  a Hugging Face model id: facebook/mms-tts-gug (Paraguayan Guarani) is tried first, then
                     facebook/mms-tts-grn (Guarani). Needs the venv packages transformers and torch, and the hosts
                     huggingface.co (the model card and config) and its file hosts, cdn-lfs.huggingface.co and
                     cas-bridge.xethub.hf.co (the weights, about 140 MB each), unless the model is already in the Hugging
                     Face cache (HF_HOME) or given as a local folder. Meta's MMS models are CC-BY-NC 4.0: NON-COMMERCIAL
                     USE ONLY, so clips made with them may not ship in a paid or ad-funded app, and the licence is written
                     into voices.json and shown in the app's licenses.txt.
  Piper              a path to a Piper voice (<voice>.onnx, with <voice>.onnx.json beside it), such as the "T2" Guarani
                     voice of the public-domain guarani-voice project (github.com/josemiad/guarani-voice; its trained
                     weights are not in that repository: the owner exports them with `guanani train tts-pick`, or trains
                     them). Needs the venv package piper-tts (1.8, with its espeak-ng data) and no network at all. A T2
                     voice in "letters" mode takes lower-case text with the stressed vowel marked, as that project's
                     guanani/tts.py does; a voice in phoneme mode goes through espeak-ng (gn), which drops the puso and
                     nasalises badly: say so in the review. The weights' licence is whatever the project states for them.
  Spanish lines      the narrator's lines (lang "es") are skipped unless --es-model names a Spanish model or voice
                     (facebook/mms-tts-spa, or a Piper es_* voice).

Every synthetic clip is a stand-in: notes G4 says a synthetic placeholder would teach the very sounds the course corrects,
so the app marks them and the recordings in the studio replace them.
"""
import argparse
import json
import os
import re
import sys
import unicodedata
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MMS_DEFAULT = ['facebook/mms-tts-gug', 'facebook/mms-tts-grn']
MMS_LICENCE = 'CC-BY-NC 4.0 (Meta MMS: non-commercial use only)'
PUSO = dict.fromkeys(map(ord, "’‘ʼ´`ʹʻ"), "'")


def normalise(text):
    """NFC, one puso, single spaces: the course's own rule, so the model sees the text the screens show."""
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', str(text or '')).translate(PUSO)).strip()


def piper_letters(text):
    """Text for a Piper voice trained on letters (guarani-voice T2): lower case, the acute accent as the IPA stress mark."""
    nfd = unicodedata.normalize('NFD', text.lower())
    return ''.join({'́': 'ˈ', '͂': '̃'}.get(c, c) for c in nfd if c not in '¡¿“”«»')


def parse_args(argv=None):
    p = argparse.ArgumentParser(description='synthetic voice for the course clips (a fallback: the screens mark it)')
    p.add_argument('--manifest', default=os.path.join('sound', 'A1', 'manifest.json'), help='the clip list (tools/sound-list.mjs)')
    p.add_argument('--out', required=True, help='the folder for the WAVs and voices.json (then: node tools/make-sound.mjs <folder>)')
    p.add_argument('--model', default='', help='a Hugging Face MMS-TTS id, or a path to a Piper .onnx voice (default: mms-tts-gug, then grn)')
    p.add_argument('--es-model', default='', help='the model for the Spanish lines of the narrator (skipped without it)')
    p.add_argument('--voices', default='F,M,N', help='which voices of the manifest to say (all three come out in the one synthetic voice)')
    p.add_argument('--only', nargs='*', default=None, help='only these keys')
    p.add_argument('--redo', action='store_true', help='say again the keys whose WAV exists')
    p.add_argument('--dry-run', action='store_true', help='list what would be said; load no model, write nothing')
    p.add_argument('--seed', type=int, default=0, help='MMS is stochastic: the seed makes a run repeatable')
    return p.parse_args(argv)


def engine_of(model):
    """'piper' for a path to a .onnx voice (or a folder holding one), else 'mms'."""
    if not model:
        return 'mms'
    if model.endswith('.onnx') or os.path.isdir(model):
        return 'piper'
    return 'mms'


def piper_voice_file(model):
    if os.path.isdir(model):
        found = [f for f in sorted(os.listdir(model)) if f.endswith('.onnx')]
        if not found:
            raise SystemExit(f'no .onnx voice in {model}')
        model = os.path.join(model, found[0])
    if not os.path.exists(model + '.json'):
        raise SystemExit(f'{model}.json is missing beside the voice (Piper needs both files)')
    return model


def select(manifest, voices, only):
    """The rows that are recorded (one WAV each), in the manifest's recording order."""
    rows = [r for r in manifest.get('clips', []) if r.get('order') and not r.get('same') and not r.get('parts') and not r.get('tone')]
    rows = [r for r in rows if r.get('voice') in voices]
    if only is not None:
        want = set(only)
        rows = [r for r in rows if r['key'] in want]
    return sorted(rows, key=lambda r: r['order'])


def write_wav(path, samples, rate):
    """float32 samples in -1..1 → 16-bit mono WAV."""
    import array
    pcm = array.array('h', (max(-32768, min(32767, int(round(float(s) * 32767)))) for s in samples))
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())


class MMS:
    """facebook/mms-tts-<lang>: a VITS model through transformers."""

    def __init__(self, candidates, seed):
        try:
            from transformers import AutoTokenizer, VitsModel
            import torch
        except ImportError as e:
            raise SystemExit(f'MMS-TTS needs the packages transformers and torch in this Python ({e}): pip install transformers torch') from e
        self.torch = torch
        self.seed = seed
        last = None
        for name in candidates:
            try:
                self.tok = AutoTokenizer.from_pretrained(name)
                self.model = VitsModel.from_pretrained(name).eval()
                self.name = name
                break
            except Exception as e:  # noqa: BLE001 — the next candidate is tried, the last error is reported
                last = e
        else:
            raise SystemExit(f'no MMS model could be loaded ({", ".join(candidates)}): {last}')
        self.rate = int(self.model.config.sampling_rate)
        self.licence = MMS_LICENCE

    def say(self, text):
        inputs = self.tok(text, return_tensors='pt')
        self.torch.manual_seed(self.seed)
        with self.torch.inference_mode():
            wav = self.model(**inputs).waveform[0].float().cpu().numpy()
        return wav.tolist(), self.rate


class Piper:
    """a Piper .onnx voice through piper-tts (CPU)."""

    def __init__(self, voice_path):
        try:
            from piper import PiperVoice
        except ImportError as e:
            raise SystemExit(f'a Piper voice needs the package piper-tts in this Python ({e}): pip install piper-tts') from e
        self.voice = PiperVoice.load(voice_path, voice_path + '.json')
        self.name = os.path.basename(voice_path)
        self.rate = int(self.voice.config.sample_rate)
        self.letters = getattr(getattr(self.voice.config, 'phoneme_type', None), 'value', None) == 'text'
        self.licence = 'as stated by the voice\'s author (not read from the file)'

    def say(self, text):
        if self.letters:
            if re.search(r'\d', text):
                raise ValueError('a letters voice was not trained on digits: write the number in words')
            text = piper_letters(text)
        chunks = [c.audio_float_array for c in self.voice.synthesize(text)]
        if not chunks:
            raise ValueError('nothing came out of the voice')
        out = []
        for c in chunks:
            out.extend(float(x) for x in c)
        return out, self.rate


def load_engine(model, seed):
    if engine_of(model) == 'piper':
        return Piper(piper_voice_file(model))
    return MMS([model] if model else MMS_DEFAULT, seed)


def main(argv=None):
    a = parse_args(argv)
    manifest_path = a.manifest if os.path.isabs(a.manifest) else os.path.join(ROOT, a.manifest)
    with open(manifest_path, encoding='utf-8') as f:
        manifest = json.load(f)
    voices = [v.strip() for v in a.voices.split(',') if v.strip()]
    rows = select(manifest, voices, a.only)
    gn = [r for r in rows if r.get('lang', 'gn') != 'es']
    es = [r for r in rows if r.get('lang', 'gn') == 'es']
    print(f'{manifest.get("level", "?")}: {len(rows)} clips to say ({len(gn)} Guarani, {len(es)} Spanish{"" if a.es_model else ", skipped without --es-model"}) with {a.model or " / ".join(MMS_DEFAULT)}'
          + (f' and {a.es_model}' if a.es_model else ''))
    if a.dry_run:
        for r in gn + (es if a.es_model else []):
            print(f'  {r["order"]:4d}  {r["key"]:28s} [{r["voice"]}] {r["text"]}')
        print('dry run: no model loaded, nothing written. Next: node tools/make-sound.mjs <folder> --kind synthetic')
        return 0
    os.makedirs(a.out, exist_ok=True)
    engine = load_engine(a.model, a.seed)
    es_engine = load_engine(a.es_model, a.seed) if a.es_model else None
    made, failed, skipped = 0, [], 0
    for r in rows:
        e = engine if r.get('lang', 'gn') != 'es' else es_engine
        if e is None:
            continue
        path = os.path.join(a.out, r['key'] + '.wav')
        if os.path.exists(path) and not a.redo:
            skipped += 1
            continue
        try:
            samples, rate = e.say(normalise(r['text']))
            write_wav(path, samples, rate)
            made += 1
            print(f'  {r["order"]:4d}  {r["key"]:28s} {len(samples) / rate:5.2f} s  {r["text"]}', flush=True)
        except Exception as err:  # noqa: BLE001 — one bad line must not stop the run
            failed.append((r['key'], str(err)))
            print(f'  x {r["key"]}: {err}', flush=True)
    credits = {
        'kind': 'synthetic',
        'model': engine.name + (f' + {es_engine.name}' if es_engine else ''),
        'licence': engine.licence,
        'made': __import__('datetime').date.today().isoformat(),
        'note': 'synthetic stand-ins: the screens say "voz sintética"; replace them with the studio\'s recordings (CC BY 4.0)',
        'voices': {v: {'name': engine.name, 'kind': 'synthetic', 'model': engine.name, 'licence': engine.licence} for v in voices if v != 'N'},
    }
    if es_engine:
        credits['voices']['N'] = {'name': es_engine.name, 'kind': 'synthetic', 'model': es_engine.name, 'licence': es_engine.licence}
    with open(os.path.join(a.out, 'voices.json'), 'w', encoding='utf-8') as f:
        json.dump(credits, f, ensure_ascii=False, indent=1)
    print(f'{made} clips written to {a.out} ({skipped} were there already, {len(failed)} failed); voices.json marks them synthetic.')
    print(f'Next: node tools/make-sound.mjs {a.out} --manifest {a.manifest} --kind synthetic')
    return 1 if failed and not made else 0


if __name__ == '__main__':
    sys.exit(main())
