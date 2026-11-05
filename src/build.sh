#!/bin/bash
# Baut INCIheinz aus den Quellen. Aufruf aus dem Ordner src/ des Repos.
set -e
H="$(cd "$(dirname "$0")" && pwd)"
mkdir -p /mnt/user-data/uploads/lager-app /mnt/user-data/outputs/netlify /mnt/user-data/outputs/proto /home/claude/work/proto
cp "$H/uploads_lager-app/qr.js" /mnt/user-data/uploads/lager-app/
[ -f /mnt/user-data/outputs/netlify/sw.js ] || cp "$H/../sw.js" /mnt/user-data/outputs/netlify/sw.js
cp -r "$H/symbole" /mnt/user-data/outputs/
cp "$H/katalog_master.json" /home/claude/work/
# Vorlage für die Artefakt-Vorschau (wird von build_netlify.py gelesen und überschrieben)
grep -q "const CAT=" /mnt/user-data/outputs/proto/index.html 2>/dev/null || cp "$H/../index.html" /mnt/user-data/outputs/proto/index.html
cp "$H"/proto/*.* /home/claude/work/proto/
cd /home/claude/work/proto
python3 patch7.py && python3 patch6.py && python3 patch4.py && python3 build_netlify.py
node --check chk.js && echo "Build OK -> /mnt/user-data/outputs/netlify/"
