#!/bin/bash
# Downloads the two typefaces the build cuts its font files from (both SIL Open Font License 1.1),
# from the Google Fonts repository, into ../fonts-src. About 1.6 MB. Run once before the first build.
#   Nunito (the interface): the variable font, Nunito[wght].ttf; fonts.py makes its 500, 700 and 800 from it.
#   Andika (Guarani text): the Regular and the Bold.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="${1:-$HERE/../fonts-src}"
BASE="https://raw.githubusercontent.com/google/fonts/main/ofl"
mkdir -p "$DEST/nunito" "$DEST/andika"
# the address with [ and ] written out (curl would read them as a range), the file under its own name
get() { echo "  $1"; curl -fsSL -o "$DEST/$1" "$BASE/$(printf '%s' "$1" | sed 's/\[/%5B/g; s/\]/%5D/g')"; }
get "nunito/Nunito[wght].ttf"
get nunito/OFL.txt
get andika/Andika-Regular.ttf
get andika/Andika-Bold.ttf
get andika/OFL.txt
# the files this build was last made from (first 16 characters of each SHA-256)
cat > "$DEST/expected.sha256.txt" <<'EOF'
bb55a5ca5c204233  nunito/Nunito[wght].ttf
202b96b1f174a4a4  andika/Andika-Regular.ttf
4361126189a2d0e0  andika/Andika-Bold.ttf
EOF
cd "$DEST"
CHANGED=0
while read -r want file; do
  have="$(sha256sum "$file" | cut -c1-16)"
  if [ "$have" != "$want" ]; then echo "note: $file differs from the copy the last build used (a newer release of the typeface?)"; CHANGED=1; fi
done < expected.sha256.txt
[ "$CHANGED" = 0 ] && echo "typefaces ready in $DEST, same files as the last build"
exit 0
