# INCIheinz – Übergabe für neue Chats

## Was das ist
Privates Rohstofflager für Naturkosmetik (PWA, eine HTML-Datei, Vanilla-JS). Deutsch als Quellsprache, EN/ES per Übersetzungstabelle. Daten nur auf dem Gerät (IndexedDB). Streng Lager: keine Rezepte, keine Wirk- oder Gesundheitsversprechen. Erste App einer geplanten „Heinz“-Familie. Erste Nutzerin: Freundin des Entwicklers. Tests auf Pixel 9 Pro.

- Live: https://pythonheinz.github.io/INCIheinz-app/ (Repo PythonHeinz/INCIheinz-app, Branch main)
- Neue Versionen erreichen das Handy per Update-Hinweis bzw. beim zweiten App-Start.

## Stand (Entwicklungsphase abgeschlossen für)
Lager (Liste/Übersicht, Spalten, Sortierung, Zurücksetzen), Eingabe (Scan/Produktseite/manuell), Neu, Einkauf (Packungsgrößen), Mehr (Import, Export, Sicherung, Einstellungen, Anleitung, Info), Statistik-Kacheln, Undo, Ampel-Symbole (INCI geprüft, unter Minimum, nicht vorrätig, Haltbarkeit). Als Nächstes: Design-Reviews je Seite, dann neue Module.

## Quellen & Build
Alles liegt im Repo unter `src/`. Neuer Chat:
1. Repo klonen (add_repo PythonHeinz/INCIheinz-app), `cd src && ./build.sh`
2. Ergebnis: `/mnt/user-data/outputs/netlify/{index.html,sw.js,katalog.json}`
3. Test: Playwright gegen `file:///mnt/user-data/outputs/netlify/index.html` (Beispiele in `src/tests/`)
4. Veröffentlichen: die drei Dateien ins Repo-Wurzelverzeichnis kopieren, committen, `git push origin HEAD:main`.

Pipeline: `tpl5_pre6.html` → `patch7.py` (R(alt,neu,anzahl) = exakter Ersatz mit Zählprüfung; hängt js7…js17 an, führt `p7b.py` aus) → `patch6.py` (Symbole) → `patch4.py` (i18n über `i18n7.py`: N7-Wörterbuch, P7-Regex) → `build_netlify.py`. Prüfung `node --check chk.js`.

## Fallstricke
- R()-Patches treffen auch Text in neuen js-Dateien: gepatchte Strings nicht in js16/js17 wiederholen; Zählfehler = AssertionError.
- Strings mit `'` in p7b.py als `r'''…'''` schreiben (sonst verschwinden Anführungszeichen).
- Literales `</body></html>` in JS-Strings bricht den Build → `'</bo'+'dy></ht'+'ml>'`.
- Funktionsdeklarationen werden gehoistet; spätere Neudefinitionen (js16/js17) überschreiben frühere.
- Neue sichtbare Texte immer in `i18n7.py` (N7/P7) übersetzen (EN/ES).
- Pfade im Build sind absolut (`/mnt/user-data/...`); `build.sh` legt sie an.

## Wichtige Strukturen
Zustand `S` (IndexedDB), Ansichtszustand `Q`, `viewCols()`, `COLS/CWID/cellSt`, `statusIcons(i)`/`ampel(i)`, `toast()`, Undo: `UNDO`, `undoWrap`, `UNDO_BAR` (nur zerstörende Aktionen). Mehr-Menü in js16 (`sheetMehr`). Katalog `katalog.json` (Pflege siehe README, Regeln in `src/regeln.md`).

## Designregeln des Entwicklers
- App soll ruhig sein: keine selbst wechselnden Texte, kein Tabellen-Eindruck, wo Symbole reichen.
- Artikelname klar lesbar, nie kleiner; Zeilen mit festen Spaltenbreiten (kein Springen beim Sortieren).
- Leere Werte als leere Zellen, nicht „–“/„?“. Wenig „…“.
- Feedback bei Routineänderungen als Toast oben; Undo-Leiste nur bei zerstörenden Aktionen (6 s).
- Statussymbole stehen immer unter dem Namen; Statusspalten (INCI) nicht als Spalte, Haltbarkeitsdatum bleibt optionale Spalte; Export enthält alle Spalten.
- Nur auf dem Lagerbestand arbeiten, keine Heil-/Wirkaussagen.

## Offene Punkte
Siehe `src/PORTIERUNG.md` (Store-Portierung, Google Play zuerst, kein reiner Web-Wrapper; Apple später), `src/STORE_VORBEREITUNG.md`, `IDEEN_SPAETER.md` (konfigurierbares Dashboard).
Außerdem: INCI-Katalog überwiegend noch „ungeprüft“; Übersetzungen EN/ES nicht muttersprachlich geprüft; Barrierefreiheit nicht geprüft; Dichte nicht in Statistik/Gefäßen; Fotos im selben Zustandssatz, nur manuelle Sicherung; eigene Domain; „vor Version 1.0“-Hinweis entfernen; Migration der Netlify-Daten der Freundin; dunkles Design; Symbolsatz überprüfen.

## Nächstes Modul: Rezeptbuch
Rezepte aus Lagerrohstoffen (Menge je Rezept, Kosten aus Preisen, „was kann ich jetzt machen?“, Verwendung eines Rohstoffs über alle Rezepte, Reichweite). Querauswertung der Zutaten (z. B. wo ein Rohstoff am meisten vorkommt). Keine Gesundheits- oder Wirkversprechen. Kachelideen: `IDEEN_SPAETER.md`. Rezepte als eigener Bereich/Tab, Bezug zum Lager über Rohstoff-IDs.
