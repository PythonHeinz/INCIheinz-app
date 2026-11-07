# INCIheinz – Übergabe für neue Chats

## Was das ist
Privates Rohstofflager für Naturkosmetik (PWA, eine HTML-Datei, Vanilla-JS). Deutsch als Quellsprache, EN/ES per Übersetzungstabelle. Daten nur auf dem Gerät (IndexedDB). Streng Lager: keine Rezepte, keine Wirk- oder Gesundheitsversprechen. Erste App einer geplanten „Heinz“-Familie. Erste Nutzerin: Freundin des Entwicklers. Tests auf Pixel 9 Pro.

- Live: https://pythonheinz.github.io/INCIheinz-app/ (Repo PythonHeinz/INCIheinz-app, Branch main)
- Neue Versionen erreichen das Handy per Update-Hinweis bzw. beim zweiten App-Start.

## Stand
Eine App mit zwei Seiten (Lager und Rezeptbuch, Register im Kopf). Aktueller Stand, Commit und offene Punkte: `STAND.md` (zusammengeführt, 06.11.2026). Mengenmodell: Gesamtmenge `i.total` ist die einzige Wahrheit, Gefäße beschreiben nur Verpackung, Nenninhalt und Lagerort. Lagerort liegt am Artikel (`i.ort`). INCI wird nur vom Nutzer als „geprüft“ bestätigt.

## Quellen & Build
Alles liegt im Repo unter `src/`. Neuer Chat:
1. Repo klonen (add_repo PythonHeinz/INCIheinz-app), `cd src && ./build.sh`
2. Ergebnis: `/mnt/user-data/outputs/netlify/{index.html,sw.js,katalog.json}`
3. Test: Playwright gegen `file:///mnt/user-data/outputs/netlify/index.html` (Beispiele in `src/tests/`)
4. Veröffentlichen: die drei Dateien ins Repo-Wurzelverzeichnis kopieren, committen, `git push origin HEAD:main`.

Pipeline: `tpl5_pre6.html` → `patch7.py` (R(alt,neu,anzahl) = exakter Ersatz mit Zählprüfung; hängt js7…js19 an und `css18.css` an das Stylesheet, führt `p7b.py` aus) → `patch6.py` (Symbole) → `patch4.py` (i18n über `i18n7.py`: N7-Wörterbuch, P7-Regex) → `build_netlify.py`. Prüfung `node --check chk.js`.

## Fallstricke
- Build aus sauberem Klon: `src/proto/es_vals.txt` (spanische Texte in Reihenfolge der EN-Schlüssel) ist Teil des Repos; `build.sh` legt die nötigen Ordner und Startdateien selbst an.
- R()-Patches treffen auch Text in neuen js-Dateien: gepatchte Strings nicht in js16/js17 wiederholen; Zählfehler = AssertionError.
- Strings mit `'` in p7b.py als `r'''…'''` schreiben (sonst verschwinden Anführungszeichen).
- Literales `</body></html>` in JS-Strings bricht den Build → `'</bo'+'dy></ht'+'ml>'`.
- Funktionsdeklarationen werden gehoistet; spätere Neudefinitionen (js16/js17) überschreiben frühere.
- Neue sichtbare Texte immer in `i18n7.py` (N7/P7) übersetzen (EN/ES).
- Pfade im Build sind absolut (`/mnt/user-data/...`); `build.sh` legt sie an.
- `src/proto/build_netlify.py` liest den Katalog aus `/home/claude/work/katalog_master.json`: nach jeder Katalogänderung `src/katalog_master.json` dorthin kopieren, sonst wird ein alter Katalog gebaut.
- `viewCols` ist `let` (patch6.py), damit js31.js es umhüllen kann; Listenfunktionen (`pickGap`, `pickSort`, `sheetCols`, `lbody`) werden in js31.js überschrieben, nicht in chk.js.
- Neue Spalten/Sortierungen: `COLS`, `SORTS`, `SKEY`, `CWID`, `COLX`, `SXP` ergänzen (Beispiel `VW` in js31.js); Lückenfilter in `GAPS`, Ausschlussregeln in `APPL`.

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

## Rezeptbuch (v1 + Korrekturrunde 06.11.: Zutaten-Sammelphase, Entwurf, Import/Export, Menüs; siehe ENTWICKLUNGSVERLAUF, Quellen `src/proto/js18.js`, `js19.js`, `css18.css`)
- **Navigation:** Kopf aller Seiten: Logo mittig, darunter Register „Lager | Rezeptbuch“ (`rzWorld`). Rezeptbuch hat eigenes warmes Theme (`#app.rez` überschreibt die CSS-Variablen) und eigene Tab-Leiste (Rezepte, Mischbar, Neu, Chargen, Mehr). Wechsel mit ungespeicherter Arbeit (Editor, Werkbank) fragt nach (`rzDirty`, `rzAsk`).
- **Seiten (`R.name`):** `rez` Liste, `rezv` Rezept mit Rechner, `reze` Editor, `verl` Versionen, `misch` Werkbank, `mbar` Mischbar, `chgs` Chargenbuch, `chg` Charge.
- **Daten:** `S.rez[]` = `{id, created, vers:[{n, date, note, diff[], from, st:''|'fav'|'bad', d}]}`; `d` = `{name, zweck, ph, ergibt, zeit, grad, phasen:[{id, typ:'A'|'B'|'C'|'D'|'', name, z:[{id, item, cid, name, g}]}], mod:[{id, t:'schritt'|'hinweis'|'abfuell'|'halt'|'notiz', titel, text}]}`. Mengen sind Gramm; Anteile (%) werden berechnet. `S.chg[]` = Chargen `{id, rez, ver, date, total, note, stars, abz, lines:[{n,item,soll,ist}]}`. Beides ist automatisch in Sicherung/Wiederherstellung (ganzes `S`); `restoreMerge` ist erweitert.
- **Lagerbezug:** `rzItem(z)` löst über Artikel-ID, Katalog-ID (`cid`) oder Namen auf. Ohne Lagerbezug (z. B. Wasser) zählt eine Zutat nicht als fehlend; Katalogzutat ohne Lagerartikel zählt als fehlend. ml-Artikel brauchen `dens` (Dichte), sonst „Menge unbekannt“.
- **Rechner:** jedes Mengenfeld ist ein Anker (`rzAnch`), Gesamtmenge ebenso (`rzTot`). Rundung `S.rezStep` (Standard 0,1 g, noch ohne Einstellung in der Oberfläche).
- **Versionen:** jedes Speichern erzeugt eine neue Version (`rzSave`/`rzDoSave`) mit Notiz und automatischer Differenz (`rzDiff`, in Gramm). Bearbeiten einer alten Version legt eine neue Version obenauf (`from`).
- **Werkbank:** `rmFinish`/`rmDone`. Lagerabzug nur nach Bestätigung (Auswahl „abziehen“ / „nur Charge speichern“), mit Undo-Leiste (`undoOffer`). Abzug über `rzTake` (ändert nur die Gesamtmenge `i.total`; Gefäße sind rein beschreibend); nicht abgezogen wird bei `unk` oder fehlender Dichte.
- **INCI-Entwurf:** `rzInci` sortiert nach Anteil; Warnung bei ungeprüfter oder fehlender INCI.
- **Druck:** `rzPrint` (Rezeptkarte). Rohstoff-Sicherheitshinweise werden gedruckt, sobald der Katalog das Feld `sh` (oder ein Artikel `sh`) enthält.
- **Eingriffe ins Grundgerüst:** `header()`, `draw()`, `back()` überschrieben bzw. umhüllt; `artikel()` hängt „Verwendet in Rezepten“ an; `restoreMerge()` umhüllt.
- **Noch nicht in v1:** Einheiten außer g, Alternativzutaten, Foto je Charge, Rezepte in Statistik und Export, INCI-Etikett aus dem Rezept, Phasenvorschlag aus Katalogfeldern, Einstellung der Rundung.
- **Gewünschte Katalogfelder für Rezeptfunktionen:** `dens` (Dichte), Phase/Löslichkeit (wasser-, öllöslich, dispergierbar), Funktionsklasse (z. B. Emulgator, Konservierer), Aktivgehalt bei Lösungen (z. B. Milchsäure 80 %), pH der Lösung, Schmelzpunkt, Allergenkennzeichnung, `sh` (Sicherheitshinweis, eigene Formulierung), Ersatzstoffe. Hinweis: `regeln.md` Nr. 8 schließt Dosierungen im Katalog aus.

## Katalogpflege in eigenen Chats
`katalog.json` (Repo-Wurzel) ist die Pflegequelle (identisch mit `src/katalog_master.json`); `src/katalog_naturkosmetik.csv` ist veraltet (Stand 0.4) und wird nicht mehr gepflegt; einzige Pflegequelle ist die JSON-Datei. Ab Katalog 1.1.2 hat jeder Eintrag zusätzlich die Vorschlagsfelder `f` (Form), `b` (Beschreibung/Funktion), `v` (Verwendung), `d` (Dichte), `e0`/`e1` (Einsatz %), `eq`/`bq` (Herkunft); ab Katalog 1.3.0 außerdem `sap_koh`, `sap_naoh`, `jodzahl`, `schmelzpunkt`, `sap_quelle` (Fettkennzahlen, als Text) und `w` (rechtlicher Hinweis, in der App roter Kasten); ab 1.4.0 Seifenwerte `rzf`, `haerte`, `seifenfarbe`, `schaum`, `seifeneinsatz`, `sq` (nach Neumann); die App kopiert sie in leere Rohstofffelder (`it.fc` merkt den kopierten Wert, der Nutzerwert hat Vorrang), siehe `src/KATALOG_ERWEITERUNG.md`. Regeln: `src/regeln.md`. Nach Änderungen `version`/`date` erhöhen, neu bauen (`src/build.sh`; `build_netlify.py` übernimmt `katalog_master.json`), pushen. Vorher beide Katalogdateien synchron halten. Eine anderswo geführte Tabelle (Rechner/Google Sheets) muss dem Chat angehängt oder verbunden werden.

## Ordner auf dem Rechner (filesbyclaude / Toolsbyclaude)
Jeder neue Chat im Projekt bekommt die Desktop-Verbindung zu `C:\Users\Andreas\Toolsbyclaude`.
- Zuerst `INDEX.md` im Wurzelordner lesen (eine Zeile pro Projekt, Zweck, Ort, Stand), danach `INCI-App-Projekt/STAND.md`.
- Maßgebliche Version = GitHub-Repo (PythonHeinz/INCIheinz-app, main). `INCI-App-Projekt/repo/` ist die Offline-Kopie; vor der Arbeit `git pull`.
- Ältere Ordner: `lager-app/` ist die erste Version (v0.1.0, abgelöst); `INCI-App-Projekt/netlify/` ist ein alter Build-Stand (nicht ausliefern).
- **Abschlussregel:** Am Ende jedes Chats `INCI-App-Projekt/STAND.md` (fertig / offen / nächster Schritt, letzter Commit, Datum) und die Zeile in `INDEX.md` aktualisieren, `UEBERGABE.md` im Ordner mit der Repo-Fassung abgleichen.
- Chatname = Projektname (z. B. „INCIheinz – Rezeptbuch“).

## Arbeitsweise für Modul-Chats (verbindlich)
**Start:**
1. `INDEX.md` (Wurzelordner Toolsbyclaude) lesen, dann `INCI-App-Projekt/STAND.md`, dann `INCI-App-Projekt/ENTWICKLUNGSVERLAUF.md`.
2. In `INCI-App-Projekt/repo/` zuerst `git pull`.
3. Bauen mit `repo/src/build.sh`; testen (Playwright, Beispiele in `src/tests/`); am Ende selbst nach `main` pushen (Repo ggf. mit Schreibrecht per `add_repo` anhängen).

**Während der Arbeit:**
- Genau ein Chat baut zur selben Zeit (Absprache des Entwicklers).
- Ein Modul ändert bestehende Seiten nur über deklarierte Stellen: neuer Tab, neuer Menüeintrag, neue Datenfelder. Alles andere ist ein Eingriff ins Grundgerüst und wird in `STAND.md` unter „Berührt Grundgerüst“ gemeldet.
- Neue Daten eines Moduls müssen in Sicherung/Wiederherstellung, Import/Export (falls sinnvoll) und Statistik berücksichtigt werden; neue Texte in `i18n7.py` (EN/ES).
- Designprinzipien aus `ENTWICKLUNGSVERLAUF.md` einhalten; keine Wirk-/Gesundheitsversprechen.
- **Landkarte pflegen (verbindlich, beschlossen 07.11.2026):** Wer eine Ansicht, ein Menü oder ein Datenfeld ändert, dokumentiert das im selben Commit in `src/APP_LANDKARTE.md` (Pfad, Zweck, Elemente, Datenfelder; implementierungsneutral). Die Landkarte ist die Grundlage für den späteren KI-Guide (`src/KI_KONZEPT.md`).

**Ende:**
1. `INCI-App-Projekt/STAND.md`: Modulstatus (fertig / offen / nächster Schritt), letzter Commit, Datum, Abschnitt „Berührt Grundgerüst“.
2. Neue Entscheidungen in `ENTWICKLUNGSVERLAUF.md` (Ordner und Repo `src/`) ergänzen.
3. Zeile in `INDEX.md` aktualisieren; `UEBERGABE.md` im Ordner und im Repo gleich halten.
4. Der Entwickler meldet „Modul X fertig“ im Haupt-Chat „INCIheinz“ (Grundgerüst); dort erfolgt die Querprüfung (Navigation, i18n, Sicherung, Statistik).

## Testdaten (Rezeptbuch) und Katalog 1.1.0 – 2026-11-05
- Katalog 1.1.0: +14 Rohstoffe (K1032–K1045; z. B. Joghurtpulver, Reismehl, Inulin, Maltodextrin, Calciumchlorid, Erythrit, Lactobionsäure, Magnesiumascorbylphosphat, Hydrolysiertes Erbsenprotein, Phytosphingosin, Wiesenschaumblumenöl, Crambeöl, Buritiöl, Kokoswasser), alle „ungeprüft“, INCI aus Fachwissen, nicht belegt. Quelle: Abgleich der Rohstoffe aus Buch (Käser) und humblebee-Enzyklopädie mit dem Katalog; er deckte fast alles schon ab. Aus den Quellen wurden nur Rohstoffnamen genutzt, keine Rezepte und Texte.
- Neuer Build-Schritt: build_netlify.py bettet die CAT-Liste jetzt aus src/katalog_master.json ein (vorher aus der alten index.html).
- Testdaten: 27 eigene Beispielrezepte (src/testdaten/gen.py → src/proto/testdaten.js, js20.js). Mehr › Einstellungen (nur Expertenmodus) › „Testdaten laden“ / „Testdaten entfernen“. Lädt Rezepte (Version 1, Hinweis „nicht geprüft, nicht zum Nachmischen“) und die nötigen Rohstoffe in üblichen Packungsgrößen (Markierung demo:true bei Rohstoff, demo:Schlüssel beim Rezept); vorhandene Rohstoffe bleiben, nur fehlende Dichte wird ergänzt. Rückgängig-Leiste vorhanden. Test: src/tests/t60.js (alle Rezepte mischbar, INCI vollständig, Entfernen, Rückgängig).
- Nie automatisch für normale Nutzer geladen.

## QA-Auswertung Rezeptbuch (06.11.2026)
Aus einem externen Bericht (Video-Auswertung) übernommen: Mischbar-Logik (Menge eingetragen = verfügbar, solange sie reicht; fehlende Dichte zählt nicht als „nicht vorhanden“, Hinweis mit Eintrag per Tipp in Rezeptansicht, Werkbank und Abschluss; Zustand „Menge offen“ nur wenn gar keine Menge eingetragen ist; Wasser frei), Filter-Chip „Mischbar“ entfernt (Tab bleibt), Ziffern mit tabular-nums, Hinweis-Modul startet mit „Achtung“ (Chips Achtung/Tipp/Sicherheit), Modulkarte mit Icon-Leiste ▲ ▼ 🗑 (44 px) und „+“ zum Einfügen an Ort und Stelle, Auto-Häkchen und Enter-Weiterschalten in der Werkbank, Lagerabzug standardmäßig aus wenn nichts abziehbar, Mehr-Menü im Rezeptbereich (Rezeptbuch drucken, Rezepte sichern), kompakte Versionsliste mit Aufklappen, Speichern-Dialog mit einklappbarer Notiz.
Verworfen: „In aktueller Version überschreiben“ (widerspricht der Versionierung: jedes Speichern = neue Version), Bottom-Bar auf 3 Tabs, Anker-Schloss (Anker-Rechner existiert, Mengenfelder nur sichtbarer gemacht). Die Charge-Notiz war entgegen dem Bericht schon editierbar; eingewogene Mengen bleiben bewusst gesperrt. Test: src/tests/t62.js.

## Regeln für Änderungen (Mehrere Chats)
Vor der ersten Änderung: `git pull`, `git log`, STAND.md Abschnitt „Aktive Arbeit“ lesen; bei Eintrag unter 24 Stunden oder berührtem Fremdmodul den Nutzer fragen. Eigene Zeile in „Aktive Arbeit“ eintragen und sofort committen. Nach der Änderung: `src/APP_LANDKARTE.md` (bei geänderter Ansicht, Menü oder Datenfeld), ENTWICKLUNGSVERLAUF.md, STAND.md (Zeile entfernen, Nächste Aufgaben anpassen), UEBERGABE.md, INDEX.md pflegen, pushen, im Projektordner `git pull`. Nur ein Chat baut gleichzeitig; Katalogdateien nie parallel ändern.
