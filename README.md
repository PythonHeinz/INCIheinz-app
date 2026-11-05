# INCIheinz

Privates Rohstofflager für Naturkosmetik (PWA). Alle Daten bleiben auf dem Gerät.

Live: https://pythonheinz.github.io/inciheinz-app/

## Katalogpflege

`katalog.json` ist die Pflegequelle des Katalogs. Struktur: `version`, `date`, `items[]` mit
`id`, `n` (Name), `i` (INCI), `k` (Kategorie), `s` (geprüft/ungeprüft), `u`, `a`, `h`,
optional `q` (Quelle, Text oder Link) und `p` (Prüfdatum, `JJJJ-MM-TT`).
Änderung einchecken und `version`/`date` erhöhen. In der App: Mehr › Katalog aktualisieren.
Nutzerdaten (Mengen, Preise, Fotos, eigene INCI-Änderungen) bleiben dabei unberührt.
