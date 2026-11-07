# INCIheinz – Entwicklungsverlauf und Entscheidungen (Stand 05.11.2026, ergänzt um Rezeptbuch)

Zweck: Hintergrund für andere Chats, damit sie nicht nachfragen müssen, warum etwas so ist. Quelle: Chat „INCIheinz“ (Hauptentwicklung). Maßgeblich bleibt der Code im Repo.

## Rahmen
- Privates Rohstofflager für Naturkosmetik, rein Lager (kein Rezept, keine Wirk-/Gesundheitsversprechen; Rezeptbuch ist als eigenes späteres Modul geplant, ebenfalls ohne Wirkversprechen).
- Erste App einer geplanten „Heinz“-Familie; erste Nutzerin ist die Freundin des Entwicklers (trägt Katalogartikel ein, die sie besitzt, und gibt Mengen ein; realistisch nur wenige Artikel mit Menge 0).
- Daten nur auf dem Gerät. Tests auf Pixel 9 Pro über GitHub Pages. Neue Versionen kommen per Update-Hinweis oder beim zweiten App-Start.
- Sprachen: Quelle Deutsch, EN/ES per Übersetzungstabelle (nicht muttersprachlich geprüft).

## Store-Entscheidungen
- Google Play zuerst, Konto legt der Entwickler an (neue persönliche Konten: Closed Test mit 12 Testern über 14 Tage). Apple später (Cloud-Build ohne Mac möglich, aber bezahlte Mitgliedschaft und Testgerät nötig; vorhanden: iPhone SE, Firmen-iPhone, altes iPad Pro).
- Keine reine Web-Hülle: Es muss eine echte native App mit nativer Speicherung/Kamera sein.
- Vorerst keine Portierung, weiter Web-Version testen und ausbauen. Gefälschte Testberichte für die 12 Tester wurden abgelehnt.
- Details: PORTIERUNG.md, STORE_VORBEREITUNG.md.

## Entscheidungen je Seite
**Tabs/Seiten:** Lager, Eingabe (früher „Scannen“; Name gewählt: kurz, griffig), Neu, Einkauf, Mehr. Eingabe enthält „Code scannen“, „Produktseite lesen“, manuellen Code. Foto-Einträge zusammengefasst, „Neu“ legt mit Foto an.
**Mehr-Menü:** Arbeiten (Etiketten & Druck, Bestellliste, Statistik), Daten (Import, Export, Sicherung, Katalog aktualisieren), App (Einstellungen, Anleitung, Info). Import/Export/Sicherung getrennt; Import erklärt Formate und bietet Vorlage; Export nur Tabellen (xlsx/csv/pdf/txt); „Alle Daten löschen“ liegt versteckt unter Sicherung (Gefahrenbereich).
**Einkauf:** Hinzufügen zur Einkaufsliste nur aus Einkauf oder Artikelseite. Packungsgrößen als Auswahl-Chips. Kein „–“ bei leeren Werten.
**Lager-Liste:** feste Spaltenbreiten (kein Springen beim Sortieren), Artikelname fett, klar lesbar, nie kleiner, Zeilenumbruch erlaubt. Standardansicht Name + Menge. Bis zu drei Spalten, sortierte Spalte wird ergänzt. Leere Werte als leere Zelle. Suchfeld mit Hinweis erst beim Fokus (App soll ruhig sein, keine selbst wechselnden Texte). „Zurücksetzen“-Link unten (nur sichtbar, wenn etwas vom Standard abweicht): setzt Filter, Suche, Spalten, Sortierung zurück. Filter „Lücken finden“ mit kurzen Labels (Ohne Menge, INCI ungeprüft …).
**Statussymbole (Ampel) unter dem Namen, immer sichtbar:** INCI geprüft, Menge unter Minimum, nicht vorrätig, Haltbarkeit (Kalender/Wecker-Symbol). Farben grün/amber/rot/neutral; Tippen zeigt Text. Es gibt bewusst keine Statusspalte „INCI“ in der Liste. Das Haltbarkeitsdatum bleibt als Spalte (Sortierung „Nächstes Ablaufdatum“), der Haltbarkeitsfilter bleibt. Export enthält alle Spalten.
**Rückmeldung:** Routineänderungen als Toast oben (1,8 s). Undo-Leiste (6 s, mit ✕) nur bei zerstörenden Aktionen; Undo über Schnappschuss. Duplikate werden erkannt.
**Statistik:** Kacheln; Vollständigkeits-Ring wechselt die Farbe nach Prozent (rot <40, orange <65, gelbgrün <80, grün ab 80). Konfigurierbare Kachelbibliothek ist Idee für später (IDEEN_SPAETER.md).
**Eingabefenster/Tastatur:** Viewport `interactive-widget=resizes-content`, Fenster passen sich der sichtbaren Höhe an, Eingabefeld scrollt nach oben, damit Treffer sichtbar bleiben (auf dem Pixel noch zu bestätigen).
**Katalog:** 1006 Stoffe, 25 „geprüft“; Regeln in regeln.md (keine fremden Texte, keine Preise, Quelle intern, „geprüft“ nur mit Datenblatt/Etikett oder zwei unabhängigen Quellen). Pflege durch weitere Chats; Ziel: ausgelieferte Version mit vielen geprüften Metadaten.

## Designprinzipien des Entwicklers
- UX soll Tabellen-Eindruck ausblenden; Symbole statt Spalten, wo möglich.
- App ruhig halten; wenig „…“; Hilfetexte nur bei Bedarf.
- Zerstörende Aktionen nie prominent, immer mit Undo.
- Lesbarkeit vor Dichte.

## Technik (Kurzfassung, Details UEBERGABE.md)
Einzel-HTML-PWA, Vanilla-JS, IndexedDB. Build: tpl5_pre6.html → patch7.py (R-Patches, js7–js17, p7b.py) → patch6.py → patch4.py (i18n7.py) → build_netlify.py. Fallstricke siehe UEBERGABE.md.

## Offene Punkte
Design-Reviews je Seite (Lager, Eingabe, Neu, Einkauf, Mehr), Rezeptbuch (inkl. Zutaten-Querauswertung), Produktetiketten-Bereich, Fotos getrennt speichern, automatische Sicherung, Barrierefreiheit, EN/ES-Prüfung, Dichte in Statistik/Gefäßen, eigene Domain, Hinweis „vor Version 1.0“ entfernen, Migration der Netlify-Daten der Freundin, dunkles Design, Symbolsatz, INCI-Prüfung des Katalogs.

## Rezeptbuch (Entscheidungen, 05.11.2026)
- **Eigener Bereich, kein Menüeintrag:** Kopf mit Logo mittig und darunter Register „Lager | Rezeptbuch“, damit die Nutzerin immer sieht, wo sie ist. Rezeptbuch hat ein warmes Papier-Theme, bleibt aber dieselbe App (gleiche Bausteine, gleiche Bedienlogik). Kein Umschalter, der Verwechslung begünstigt; bei ungespeicherter Arbeit wird vor dem Wechsel gefragt.
- **Aufbau wie eine Bedienungsanleitung:** Pflicht sind nur Name und Zutaten. Alles weitere sind Module aus einer Auswahl (Phase A–D oder eigene, Arbeitsschritt, Hinweis, Abfüllung, Haltbarkeit, Notiz), je mit Titel und zwei, drei Sätzen. Die App liefert Titel für einen Standard-Ablauf, aber keine inhaltlichen Empfehlungen (keine Temperaturen, keine Haltbarkeitsschätzungen).
- **Versionen sind zwingend:** Jedes Speichern erzeugt eine neue Version mit Notiz „Was hast du geändert?“ und automatischer Differenz. Begründung: Wer gern mischt, dokumentiert nicht; mit minimalem Aufwand entsteht ein Verlauf, der später auch eine KI-Auswertung ermöglicht („warum zieht die Creme nicht ein“). Eine Version wird nie überschrieben.
- **Charge statt nur Rezept:** Beim Mischen entsteht eine Charge (Ist-Einwaage, Bewertung, Notiz), verknüpft mit genau einer Version. So ist belegt, welche Version wirklich gemischt wurde.
- **Rechner:** Jedes Mengenfeld ist ein Anker. Wer nur 27 g einer Zutat hat, trägt 27 dort ein; Gesamtmenge und alle anderen Zutaten rechnen sich neu. Zusätzlich: Gesamtmenge vorgeben, „reicht für bis zu X g“.
- **Mischbarkeit:** Ampel je Zutat; Rezept „mischbar“ oder „es fehlt: …“; Seite „Mischbar“ (jetzt / fast). Fehlendes lässt sich auf die Einkaufsliste setzen.
- **Lagerabzug nur nach Bestätigung:** Gemischt gilt als verbraucht, unabhängig vom Erfolg. Abzug mit Undo; Wahl „nur Charge speichern“ bleibt möglich.
- **INCI-Deklaration:** Entwurf aus den Rohstoffen, nach Anteil sortiert, mit Warnung bei ungeprüfter INCI. Verkaufsargument der App; Etikettendruck aus dem Rezept folgt.
- **Sicherheitshinweise der Rohstoffe:** nur im Druck (Rezeptkarte), nicht während des Mischens. Quelle sind eigene Formulierungen im Katalog (Feld `sh`), nie Fremdtexte.
- **Geschäftsmodell (Absicht des Entwicklers):** kein Abo-Zwang; kleiner Einmalbetrag für lebenslange Nutzung oder niedriger Monatspreis. Nutzer können Inhalte (Verwendung, Wirkung) selbst per Kamera oder eingefügtem Text mit dem Lager abgleichen und selbstbestimmt festhalten, weil Quellen sich unterscheiden. Das ist die Nische der App.

## Testdaten (Rezeptbuch) und Katalog 1.1.0 – 2026-11-05
- Katalog 1.1.0: +14 Rohstoffe (K1032–K1045; z. B. Joghurtpulver, Reismehl, Inulin, Maltodextrin, Calciumchlorid, Erythrit, Lactobionsäure, Magnesiumascorbylphosphat, Hydrolysiertes Erbsenprotein, Phytosphingosin, Wiesenschaumblumenöl, Crambeöl, Buritiöl, Kokoswasser), alle „ungeprüft“, INCI aus Fachwissen, nicht belegt. Quelle: Abgleich der Rohstoffe aus Buch (Käser) und humblebee-Enzyklopädie mit dem Katalog; er deckte fast alles schon ab. Aus den Quellen wurden nur Rohstoffnamen genutzt, keine Rezepte und Texte.
- Neuer Build-Schritt: build_netlify.py bettet die CAT-Liste jetzt aus src/katalog_master.json ein (vorher aus der alten index.html).
- Testdaten: 27 eigene Beispielrezepte (src/testdaten/gen.py → src/proto/testdaten.js, js20.js). Mehr › Einstellungen (nur Expertenmodus) › „Testdaten laden“ / „Testdaten entfernen“. Lädt Rezepte (Version 1, Hinweis „nicht geprüft, nicht zum Nachmischen“) und die nötigen Rohstoffe in üblichen Packungsgrößen (Markierung demo:true bei Rohstoff, demo:Schlüssel beim Rezept); vorhandene Rohstoffe bleiben, nur fehlende Dichte wird ergänzt. Rückgängig-Leiste vorhanden. Test: src/tests/t60.js (alle Rezepte mischbar, INCI vollständig, Entfernen, Rückgängig).
- Nie automatisch für normale Nutzer geladen.

## QA-Auswertung Rezeptbuch (06.11.2026)
Aus einem externen Bericht (Video-Auswertung) übernommen: Mischbar-Logik (Menge eingetragen = verfügbar, solange sie reicht; fehlende Dichte zählt nicht als „nicht vorhanden“, Hinweis mit Eintrag per Tipp in Rezeptansicht, Werkbank und Abschluss; Zustand „Menge offen“ nur wenn gar keine Menge eingetragen ist; Wasser frei), Filter-Chip „Mischbar“ entfernt (Tab bleibt), Ziffern mit tabular-nums, Hinweis-Modul startet mit „Achtung“ (Chips Achtung/Tipp/Sicherheit), Modulkarte mit Icon-Leiste ▲ ▼ 🗑 (44 px) und „+“ zum Einfügen an Ort und Stelle, Auto-Häkchen und Enter-Weiterschalten in der Werkbank, Lagerabzug standardmäßig aus wenn nichts abziehbar, Mehr-Menü im Rezeptbereich (Rezeptbuch drucken, Rezepte sichern), kompakte Versionsliste mit Aufklappen, Speichern-Dialog mit einklappbarer Notiz.
Verworfen: „In aktueller Version überschreiben“ (widerspricht der Versionierung: jedes Speichern = neue Version), Bottom-Bar auf 3 Tabs, Anker-Schloss (Anker-Rechner existiert, Mengenfelder nur sichtbarer gemacht). Die Charge-Notiz war entgegen dem Bericht schon editierbar; eingewogene Mengen bleiben bewusst gesperrt. Test: src/tests/t62.js.

## Mengenmodell (06.11.2026, Hauptchat)
- **Gesamtmenge (`total`) ist die einzige Wahrheit.** Gefäße beschreiben nur Verpackungsart, Nenninhalt und Lagerort; sie ändern die Menge nie. Anders als vorher gibt es keinen Füllstand je Gefäß und keine Doppelzählung (200 g beim Anlegen + später eine Dose = weiter 200 g).
- Beim Hinzufügen des ersten Gefäßes ist der Nenninhalt mit der vorhandenen Menge vorbelegt. Ist noch keine Menge eingetragen, setzt die App Anzahl × Nenninhalt.
- „Angebrochen“ wird abgeleitet: Menge kleiner als Summe der Nenninhalte. Die App bildet den physischen Zustand nicht ab (zwei Gefäße à 100 g, 160 g übrig: eines ist angebrochen, mehr nicht).
- Migration: keine nötig. `total` enthielt schon alles; das alte Feld `amount` je Gefäß bleibt in alten Daten, wird aber ignoriert. Bestehende Backups laden unverändert.
- Rezeptbuch: der Lagerabzug (`rzTake`) ändert nur `total`.
- Code: `src/proto/js21.js` (neue Gefäß-Fenster, `rzTake`), R-Patches am Ende von `p7b.py`. Test: `src/tests/t63.js`.
- Offene Folgen (noch nicht umgesetzt): Lagerort gehört heute an Gefäße; ein Lagerort am Artikel ohne Gefäß fehlt noch. Gesamtmengen-Anpassungen aus dem QA-Bericht (Basiseinheit, Schnellbuchung +1 Gebinde) stehen noch aus.

## Umsetzung QA-Bericht, Teil 1 (06.11.2026, Hauptchat, js22.js)
- Export über das Teilen-Fenster von Android (`navigator.share` mit Datei), Download als Rückfall; gilt nur für Exporte, nicht für die Sicherung.
- Regal-Check: „Alle übernehmen“ (für die angezeigte Auswahl, mit Bestätigung), Suche bleibt oben stehen, Zeilen mindestens 56 px.
- INCI: Eingefügter Text bleibt „ungeprüft“; Knopf „Als geprüft bestätigen“ zeigt den Text und setzt erst nach Bestätigung des Nutzers auf geprüft.
- Lagerort am Artikel (`i.ort`, Auswahl im Bearbeiten); Anzeige, Lücken-Filter und Vollständigkeit nutzen `ortOf(i)` (Artikel-Lagerort, sonst der des ersten Gefäßes).
- Speichern unten im Bearbeiten-Modus (feste Leiste, blendet die Tab-Leiste aus); Warnung beim Verlassen mit offenen Änderungen über `tab()` und `back()`.
- Produktseite lesen: bekannter Lieferant im Text wird vorgewählt. Test t66.js.
- Bewusst nicht geändert: Mengen werden schon intern in Basiseinheit (g, ml) gespeichert, die Anzeige wechselt nur ab 1000 zu kg/l. Kachel / Filter in der Lager-Übersicht müssen am Bildschirm geprüft werden. Zurückgestellt: +1 Gebinde auf der Karte, konfigurierbare Dashboard-Kacheln (nach Gefäß-Entscheidung jetzt möglich, eigener Schritt).

## Rezeptbuch-Korrekturrunde (06.11.2026, js18/js19/js23, css23)
- Zutaten werden einmal oben erfasst (Sammel-Phase `pool:true`, Name „Zutaten“) und den Phasen per „Zuordnen“ zugewiesen; nicht zugeordnete bleiben in „Weitere Zutaten“. Dadurch bleibt der Import aus Text/Foto einfach: Phasen sind optional.
- Zeitaufwand ist eine Zahl in Minuten (Suffix „min“). Mengen bleiben intern Gramm; `z.u:'ml'` ist nur eine Anzeigewahl und braucht Dichte (`rzDensZ`). Die Werkbank bleibt in Gramm.
- Umrechnen auf beliebige Gesamtmenge (nicht nur 100 g).
- Eingaben gehen nicht mehr verloren: Entwurf automatisch in localStorage (`inciheinz-draft`), Wiederherstellen beim Start. Zurückwischen (Android) geht über die History-API einen Schritt zurück, schließt Fenster zuerst.
- Tastatur: Speicherleiste und Tab-Leiste werden ausgeblendet, solange ein Textfeld Fokus hat (`html.kb`); Mengen müssen nicht gespeichert werden.
- Module und Phasen per Finger verschieben, nur am farbig abgesetzten Griff.
- Neues Rezept aus einer Version („Als neues Rezept speichern“), Link zu den Chargen des Rezepts; Menüpunkt „Chargenbuch“ entfernt (gleiche Seite wie Tab Chargen).
- Foto des fertigen Produkts pro Rezept (nicht pro Version), max. 1000 px.
- Menüs: „Mehr“ je Bereich getrennt, unten „Für die ganze App“ (gleich in beiden). Lagerorte/Lieferanten nur im Lager, Module/Standard-Ablauf/Rundung nur im Rezeptbuch.
- Rezept-Import (Text, Foto per OCR, .json) und Export als Publikationen (Karte, Rezeptbuch, Chargenprotokoll, Text, JSON) mit Auswahl und Kurzbeschreibung. Gestaltung der Publikationen folgt zuletzt.
- Tests: `src/tests/t67.js` (43 Prüfungen), `t68.js` sammelt unübersetzte Texte.

## Mehr-Menüs v2 und Import-Parser (06.11.2026)
- Gleiche Gliederung in beiden Bereichen: Arbeiten, Daten, Voreinstellungen (je Bereich), „Für die ganze App“ = ein Eintrag „Einstellungen“ (Sprache, Sicherung der ganzen App, Rückgängig, Anleitung, Info, Expertenmodus mit Einheiten und Testdaten).
- Lager: Etiketten & Druck, Bestellliste, Statistik | Import, Export, Katalog aktualisieren | Lagerorte & Lieferanten. Rezeptbuch: Rezeptbücher & Druck (Rezeptkarte, Rezeptbuch), Statistik (neu) | Import, Export (Text, Chargenprotokoll), Rezeptdaten sichern | Module & Rundung.
- Sicherung der ganzen App liegt nur global. Rundung bleibt rezeptspezifisch (wirkt nur im Rechner und in der Werkbank).
- Fehler behoben: `expertCard()` hatte ein überzähliges `</div>`; der Testdaten-Block landete außerhalb des Fensters und stand dauerhaft unten auf der Seite.
- Import-Parser (`rzPre`): Trenner „|“, Phasen mitten im Satz, Zutaten per Komma (Dezimalkomma bleibt), Sätze als Schritte, „nach Bedarf“ als Zutat ohne Menge mit Hinweis.
- Geplant, noch nicht gebaut: Werkbank-Zettel, Etikett pro Charge, Layouts des Rezeptbuchs, Einkaufszettel, Kostenblatt, Versionsvergleich (IDEEN_SPAETER.md).

## Mehr-Menüs v3 (06.11.2026, nach Rückmeldung)
- Begriffe: Sicherung der ganzen App (global, Einstellungen) · „Rezepte sichern“ (nur Rezeptbuch; Lager hat bewusst kein Pendant, dort gilt Export als Liste plus Gesamtsicherung) · Export = Listen · Drucken & Gestalten = Auswahl, Vorlage, Druckmenü. „Publikation“ wird nicht mehr als Wort verwendet.
- Aufbau beider Menüs: Statistik (und im Lager Bestellliste) als Einzeleinträge oben, dann Drucken & Gestalten, Daten, Voreinstellungen, Für die ganze App (ein Eintrag Einstellungen).
- „Katalog aktualisieren“ und Testdaten sind Testbetrieb: nur unter Einstellungen im Expertenmodus. Im fertigen Betrieb aktualisiert sich der Katalog im Hintergrund, der Eintrag entfällt.
- Offen: Bestellliste im Menü ist dasselbe wie der Tab Einkauf (zu klären); Druckablauf (erst Rezepte wählen, dann Vorlage) ist noch umgekehrt umgesetzt.
- Menü-Test 06.11. (Stand v3.1): Überschrift „Arbeiten“ in beiden Menüs; „Letzte Änderung rückgängig“ immer sichtbar (ausgegraut ohne Änderung); Rezeptbuch-Statistik als eigene Seite mit Kacheln (Rezepte, Mischbar, Chargen, Einsatzzweck, häufigste Zutaten) wie im Lager. Rezeptkategorien offen (IDEEN_SPAETER.md).
- Menü v3.2: Statistik als eigener Eintrag (kein „Arbeiten“-Block), Bestellliste aus dem Lager-Menü entfernt (Einkauf-Tab ist die Stelle). „Rezepte sichern“ heißt „Rezepte teilen“. „Module & Ablauf“: feste Module mit Symbol, Standard-Ablauf per Griff umsortierbar. Genauigkeit der Mengen jetzt global unter Einstellungen, getrennt für Lager (ganze g/ml, 0,1, 0,01; wirkt auf `fmt`) und Rezeptbuch (`rezStep`). Test `t69.js`.
- Etiketten (Lager): mehrere Größen in einem Druck (Mehrfachauswahl, Stück je Rohstoff und Größe, je Größe ein eigener Bogen mit Seitenumbruch, Vorschau je Größe). Code am Ende von `js23.js`, Test `t70.js`. Noch offen: Etiketten für Gefäße/Kartons mit eigenem Inhalt (Menge, Datum), Etikettenvorlagen für Bogenpapier (Avery-Raster).
- Etiketten: Haken „Alle Größen platzsparend auf einem Bogen“ (Standard an, größte zuerst, zum Ausschneiden); ohne Haken je Größe ein Bogen. Optimale Platzierung für Raster-Etikettenpapier noch offen.
- Lager-Daten freigegeben (Import, Export). „Bestellliste“ heißt überall „Einkaufsliste“ (Menü Einkauf, Export, Texte). Einstellungsfenster bleiben nach einer Änderung offen (Genauigkeit, Sprache), beim Schließen steht die Ausgangsseite da. Sprachtest `t71.js` sucht deutsche Reste in EN/ES (leer).

## Rezept teilen als PDF, Zurück-Fix (06.11.2026)
- Zurück aus Export-Unterfenstern führt zur Liste, aus der man kam (Merker RZMODE: Drucken oder Daten).
- „Rezept teilen“ (Daten): ein Rezept wählen, Foto/Eckdaten/Ablauf/INCI-Entwurf an- oder abwählen, echte PDF-Datei (A4, eigener kleiner PDF-Schreiber in js24.js, Foto als Banner, Zutaten mit Anteilen, Zubereitung, Hinweise, Fußzeile mit Seitenzahl), Weitergabe über das Teilen-Menü des Geräts, sonst Download. Auch als Button auf der Rezeptseite. PDF-Beschriftungen folgen der App-Sprache.
- Rezeptdaten (.json) liegen jetzt im Export (Daten), Import liest sie weiterhin.
- Idee Redaktionssystem/Live-Vorschau in IDEEN_SPAETER.md notiert. Test: t72.js.

## Rückwege in allen Fenstern, Drucken/Export entflochten, PDF gehärtet (06.11.2026)
- js25.js: Alle Fenster, die aus einem anderen Fenster geöffnet werden, zeigen oben links einen Pfeil zurück (Mehr → Untermenü → Unterfenster). Der Pfeil führt in das vorherige Fenster, das X schließt alles. Einstellungen ändern (Sprache, Genauigkeit) lässt Fenster und Pfeil stehen. Die unteren „Zurück“-Buttons in Rezept teilen und im Export nutzen denselben Weg. Test: t73.js (läuft alle Menüeinträge zwei Ebenen tief durch).
- Drucken und Export getrennt: Chargenprotokoll (Drucken, nur PDF) und Chargentabelle (Export: Excel, CSV, Text). Rezeptkarte nur PDF, Text liegt im Export.
- Rezept teilen: Dateiname nur ASCII, Binär-Kommentar im PDF-Kopf, zusätzlich „Als Datei speichern“. PDF besteht qpdf, PyMuPDF und pypdf (strict).
- Offen: zweiter Platz der unteren Leiste im Rezeptbuch (Mischbar entfällt als Eintrag, wird Filter in der Rezeptliste).

## Rezeptbuch: Mischbar als Filter, Platz 2 Baustelle (06.11.2026)
- Mischbar ist kein Leisteneintrag mehr, sondern Filter „Alle / Mischbar“ (mit Zählern) oben in der Rezeptliste.
- Platz 2 der Leiste im Rezeptbuch („Bald“) zeigt vorerst „Hier ist eine Baustelle“, bis der Usability-Chat die Funktion festlegt. Test: t74.js.
- Menüs Mehr und Einstellungen in beiden Bereichen geprüft und abgeschlossen.

## Rezeptseite, Versionen, Dialoge (06.11.2026)
- Rezeptseite: Chargen (mit Zähler), Als Kopie und Foto als runde Symbole mit Beschriftung unter Mischen/Bearbeiten/Versionen, wie beim Artikel.
- Versionen: Aktionen als kompakte Symbolleiste (Ansehen, Bearbeiten, Als Kopie, Vergleichen, Markieren). „Unterschied zur aktuellen“ heißt jetzt „Vergleichen“ (mit aktueller Version).
- Neue Dialoge in der Bildschirmmitte (js26.js, openDlg): Versionsvergleich grafisch gruppiert (Zutaten, Ablauf und Hinweise, Eckdaten; + neu, ↔ geändert, − entfernt, Mengenänderung mit Delta, gleiche Einträge zusammengefasst) und Markieren mit genau zwei Kacheln (Favorit, nicht verwendbar; erneutes Tippen entfernt).
- Rezept teilen von der Rezeptseite fragt nicht mehr nach dem Rezept. Teilen ohne Titel-Parameter (Test gegen den Gmail-Anhangfehler). Tests: t75.js.
- „Werkbank“ ist nur ein interner Name im Code; in der App heißt es „Mischen“.

## Gesamte Zutatenliste, Mengen schreibgeschützt (06.11.2026)
- Editor: Die Liste „Zutaten“ bleibt vollständig. Zugeordnete Zutaten stehen weiter oben (in Reihenfolge der Phasen, mit Menge und Phasen-Marke, Tippen springt zur Phase), noch nicht zugeordnete sind darunter editierbar. Mengen bearbeitet man in der Phase bzw. in der Liste für Unzugeordnete.
- Veröffentlichungen (Rezeptkarte/Buch, PDF Rezept teilen, Text): bei mehreren Phasen zuerst die gesamte Zutatenliste mit Summe, dann „Phasen“ mit den Zutaten je Phase. Bei einer Gruppe (Küchenrezept-Stil) nur eine Liste. Text-Import ignoriert den Block „Zutaten gesamt“ (Test: kein Doppeln).
- Rezeptseite: Mengen der Zutaten nur noch Anzeige. Die Gesamtmenge bleibt als Umrechner editierbar (Änderung ist nicht gespeichert). Test: t76.js.

## Rechner auf Platz 2 im Rezeptbuch (06.11.2026)
- Platz 2 der Leiste heißt „Rechner“ (statt Baustelle): Hub mit Prozent und Gramm (zwei Werte rein, dritter rechnet sich), Dreisatz, Verdünnen (Ausgangs- und Zielstärke, nach Gewicht), Einheiten umrechnen (mg, g, kg, oz, lb, ml, l, fl oz, mit Dichte auch Gewicht/Volumen). Tensidrechner und Kaltverseifung stehen als „In Planung“. Datei js27.js, Test t77.js.

## Rechner-Menü vollständig angelegt (06.11.2026)
- Hub in vier Gruppen mit 14 Einträgen. Fertig: Prozent und Gramm, Dreisatz, Verdünnen, Einheiten umrechnen. In Planung (Seite mit Beschreibung und Rezeptbezug): Alkohol verdünnen, Tropfen und Gramm, Rezept umrechnen, Rezeptanalyse, Dosierung prüfen, Emulgatorrechner, Kalkulation, Tensidrechner (WAS), Kaltverseifung, Spreitwert-Check (später).
- Rückweg bei Rezeptbezug: „In Rezept übernehmen“ erzeugt einen vorbefüllten Entwurf im Editor, kein stilles Ändern.
- Reihenfolge zum Befüllen: Rezept umrechnen, Tensidrechner, Kaltverseifung, Emulgator, Dosierung, Analyse, Kalkulation, Alkohol, Tropfen.
- Quellen für Tensid und Seife: olionatura.de Tensidplanungsrechner und naturseife.com Seifenrechner, als Vorlagen vom Nutzer genannt. Lizenz vor dem Bau klären, die Umsetzung erfolgt mit eigenem Code und eigenen Daten (Verseifungszahlen aus neutralen Quellen).

## Rechner „Rezept umrechnen"
- Erster funktionierender Rezeptrechner: Rezept aus Liste wählen (Suche), dann Zielmenge oder Gefäße (Anzahl × Füllmenge, Verlustzuschlag Standard 10 %).
- Ergebnis: Ansatz, Faktor, Mengen je Phase (vorher/neu).
- Aktionen: Mit dieser Menge mischen · Als neues Rezept übernehmen · Als neue Version übernehmen (öffnet Entwurf im Editor, gespeichert wird nur über „Speichern").
- Test t78 (9 Checks), Regression t67–t77 grün.

## Rechner „Rezeptanalyse"
- Rezept aus Liste wählen (Suche), dann nur Anzeige: Kacheln (Wasser/Hydrolate, Öle/Butter/Wachs, Emulgator, Konservierung in %), Anteile je Phase, je Rohstoffart (Katalogkategorie aus Lager `kat` bzw. `CM[cid].k`, Freitext „Wasser/Aqua" erkannt, sonst „Ohne Zuordnung"), Zutaten nach Anteil.
- Keine Bewertung, keine Grenzwerte (Dosierung kommt als eigener Rechner). Test t79.

## Abstand am Listenende
- `main#main` unten 128 px (plus Safe-Area), mit Speicherleiste 136 px, in Lager und Rezeptbuch: der letzte Eintrag scrollt frei über den Neu-Knopf (vorher 100 px).

## Einsatzkonzentration und Rechner „Dosierung prüfen"
- Neues Rohstofffeld: `i.dmin` / `i.dmax` (Einsatz in % der Gesamtmenge, 0 = nicht gesetzt). Bearbeiten: Block „Einsatzkonzentration“ (von/bis) unter Verwendung/Wirkweise; Ansicht zeigt die Zeile. Nur eine Seite eingetragen → nur diese Seite wird geprüft. von > bis wird abgelehnt.
- Katalog-Vorbefüllung vorbereitet: `einsatzOf(i)` fällt auf `CM[cid].e0/e1` zurück, sobald der Katalog diese Felder bekommt (noch keine Daten, keine eigenen Grenzwerte in der App).
- Dosierung prüfen (`js28.js`): Rezept wählen → Anteil je Zutat an der Rezeptsumme gegen den Bereich: Prüfen (zu niedrig/zu hoch) · Im Bereich · Ohne Einsatzbereich. Tippen öffnet Dialog mit zwei Wegen: Rohstoff im Bearbeiten-Modus öffnen oder Rezept ansehen. Test t80.
- Offen: CSV-Export/-Import und Spalten der Lagerliste kennen das Feld noch nicht.

## Dosierung final, Katalogfelder Dichte/Einsatz vorbereitet
- Dosierung prüfen: Reihenfolge Prüfen (rot, mit Abstand in %-Punkten) → Im Bereich (grün) → Ohne Einsatzbereich. Katalogwerte werden als „Katalog-Richtwert“ gekennzeichnet.
- Katalog-Schema: optionale Felder `d` (Dichte g/ml), `e0`/`e1` (Einsatz %), `eq` (Herkunft). `catApply`/`sheetCatUpd` vergleichen und übernehmen sie jetzt (vorher nur n,i,k,h,a,u,s,q,p, neue Felder wären stumm ignoriert worden). Leere Nutzerdichte wird aus `d` gefüllt (beim Update, beim Start und bei neuen Rohstoffen via `mk`); eigene Werte bleiben. Einsatz: eigene `dmin/dmax` vor Katalog `e0/e1`.
- `regeln.md` Regel 8 angepasst (Ausnahme Richtwerte). Anleitung für den Katalog-Chat: `src/KATALOG_ERWEITERUNG.md` (Kopie auf dem PC in INCI-App-Projekt/). Tests t80, t81.

## Katalog 1.1.1: Spalten angelegt, Export/Import
- `katalog.json` und `src/katalog_master.json` (identisch): jeder der 1020 Einträge hat jetzt `d`, `e0`, `e1`, `eq` = `null`. Version 1.1.1. Die App ignoriert `null` (kein falsches „ergänzte Angaben“).
- Export: wählbare Spalten „Dichte (g/ml)“, „Einsatz von/bis (%)“; Import erkennt diese Überschriften und setzt Dichte/Einsatz am Rohstoff.
- CSV `src/katalog_naturkosmetik.csv` offiziell veraltet (UEBERGABE.md angepasst).

## Katalog 1.1.2: Vorschlagsfelder Form, Beschreibung/Funktion, Verwendung
- Neue Katalogfelder `f`, `b`, `v`, `bq` (alle `null`), zusammen mit `d`, `e0`, `e1`, `eq`. Version 1.1.2.
- Mechanismus (`js28.js`): `catFillOne/catFill` kopieren den Katalogwert in das leere Rohstofffeld (`beschr`, `verw`, `form`, `dens`) und merken ihn in `it.fc`. Solange das Feld unverändert dem kopierten Wert entspricht, folgt es Katalogänderungen; jede Änderung durch den Nutzer koppelt es ab (Vorrang). Läuft beim Start, bei neuen Rohstoffen (`mk`) und im Katalog-Update. Form nur aus der festen Liste.
- Anzeige: Label „Beschreibung / Funktion“ (Artikel, Export-Spalte), Hinweis „Vorschlag aus dem Katalog, ungeprüft“, solange unverändert. Einsatzbereich bleibt Live-Fallback (`einsatzOf`), Export übernimmt den wirksamen Wert.
- `regeln.md` Regeln 8 und 11 angepasst, `KATALOG_ERWEITERUNG.md` neu (Felder, Regeln, Ablauf mit Validierungsstufen). Test t82.

## Katalog 1.2.0 eingespielt (Pilot, 20 Einträge)
- Der Katalog-Chat hatte 175c8e4 lokal auf dem PC committet; sein Push war nicht möglich (keine GitHub-Anmeldung auf dem PC-Shell). Übernahme über ein git-Bundle, Hash erhalten, geprüft: nur die Felder f/b/v/d/e0/e1/eq/bq, nur leere Felder, 1020 IDs, Längen und Bereiche ok, beide Katalogdateien identisch.
- App neu gebaut (eingebetteter Katalog 1.2.0), Tests grün; t82 nutzt jetzt Katalogeinträge ohne echte Vorschlagswerte. Hinweis für spätere Katalog-Chats: Push von der Geräteshell geht nicht, Weg ist Bundle → App-Chat pusht.

## Katalog 1.2.17 eingespielt, 1.2.18 (Korrektur)
- Hauptlauf des Katalog-Chats (17 Commits, 1.2.1 bis 1.2.17, Hash erhalten) über ein Gesamt-Bundle vom PC übernommen und geprüft: 1034 Einträge (14 neu, K1046–K1059: Zitronensäure ×2, Natriumbenzoat ×2, Kokosbetain ×2, Natriumcocoylglutamat ×2, SCI ×3, Natriumlauroylglutamat, Olefinsulfonat, Natriumcocoylalaninat), keine ID entfernt oder geändert, nur leere Vorschlagsfelder gefüllt (520 Einträge), Längen und Bereiche ok, keine Dubletten, Duft-Kategorien unberührt.
- 1.2.18: K0760 Azelainsäure: Wirkaussage („Aufhellend/Anti-Akne“) aus `b` entfernt, neutral formuliert. Sonst keine Heil- oder Wirkaussagen gefunden („Heilton“ = Produktname).
- Test t83: Update von 1.1.x-Stand auf 1.2.x (14 neue Einträge, 506 ergänzte Angaben, Nutzertext bleibt).
- Offen aus dem Katalog-Chat: Tensidklasse/WAS als App-Felder, Schüttdichte vs. Dichte, K0194 (Dublette), K0538 (Umbenennung), K0474 (INCI prüfen), Spaltenagent für Verseifungszahl/Jodzahl/Schmelzpunkt.

## Katalog 1.3.0, Einstellungen, Fettkennzahlen, Rechtshinweis
- Mehr › Einstellungen hat immer den Abschnitt „Katalog“ mit „Katalog aktualisieren“ (Version, Anzahl); aus dem Expertenmodus entfernt. Test t84.
- Katalog 1.3.0 (1044 Einträge): K0194 Betain HT in K0222 Kokosbetain zusammengeführt (Alias „Betain HT“); die App leitet Lager- und Rezeptverweise `cid` K0194 → K0222 um (`CIDMAP`, `cidRemap` in js28, beim Laden); Testrezepte angepasst. K0538 heißt „Natriumbenzoat (auf der Haut verbleibend)“.
- 11 neue Artikel K1060–K1070 (PEG-120-Methylglucosedioleat Sirup/Flocken, SLS Pulver/Lösung, SLES-Paste, SLSA, Cocoylglycinat Pulver/Lösung, Cocoyl-/Lauroylsarcosinat-Lösung, Seifennudeln), meist nur Name, Form, Lieferform; alle ungeprüft.
- Neue Katalogspalten `sap_koh`, `sap_naoh`, `jodzahl`, `schmelzpunkt`, `sap_quelle` (87 Fette, Öle, Wachse, Stufe ≥ 2; Einzelquellen K0443, K0449, K0993 draußen) und `w` (Rechtlicher Hinweis, zunächst K0798 Cocamide DEA, Anhang III Nr. 60). Werte als Text (Spannen wie „185–200“). Das Update überträgt sie (Feldliste in js7).
- Anzeige am Artikel: Block „Fettkennzahlen“ mit Hinweis „ungeprüft“, roter Kasten „Rechtlicher Hinweis“. Tests t85 (Anzeige, Update 1.2.18 → 1.3.0, Umleitung), t83 angepasst.
- Offen: Tensidklasse/WAS und Schüttdichte als Felder, K0474 INCI, K0195 Dichte, Varianten Cocobetain/Kaliumcocoat, Fettwerte als Rechenfelder für Seifenrechner.

## Fettkennzahlen am Artikel editierbar (vor dem Seifenrechner)
- Am Rohstoff eigene Felder `sapk`, `sapn`, `iod`, `smp` (Text, Wert oder Spanne). Bearbeiten: Block „Fettkennzahlen“ für Pflanzenöl, Butter & Wachs, Ester & Emollient, Seifenrohstoff und überall, wo Werte vorhanden sind; Platzhalter zeigt den Katalogwert, leer = Katalog. Eigener Wert hat Vorrang (Live-Fallback wie bei `einsatzOf`).
- `fettOf(i)` liefert die wirksamen Werte mit Herkunft (`own`/`cat`/`calc`); NaOH wird aus eigener Verseifungszahl × 0,7130/1000 berechnet, wenn kein eigener NaOH-Wert steht. `fettNum(text)` liefert den Zahlenwert (Mitte einer Spanne). Der künftige Seifenrechner muss genau diese Funktionen nutzen, damit Artikelseite und Rechner dieselben Werte zeigen.
- Export um vier Spalten erweitert (wirksame Werte); Import liest sie noch nicht. Test t86.

## Rechner Kaltverseifung (sei), geführter Ablauf
- Aufbau in einklappbaren Abschnitten: 1 Menge und Einstellungen (Fettmenge oder Seifenmasse vorgeben, NaOH/KOH, Reinheit, Laugenunterschuss, Flüssigkeit, Duft), 2 Öle und Fette (Anteile in %, Summe wird auf 100 % umgerechnet), 3 Abwiegen (flüssig/fest nach `form`), 4 Lauge anrühren, 5 Zusätze, Laugentabelle 0–15 % (antippbar, farbige Bereiche), Inhaltsstoffe fürs Etikett (nach Menge sortiert, INCI), Notizen, „Als Rezept übernehmen“ (Fettphase, Lauge, Zusätze, Sicherheitshinweis; Speichern über den normalen Rezept-Dialog).
- Rechnet mit `fettOf`/`fettNum` (Werte der Artikelseite). Formel nach Neumann: Σ(Anteil × NaOH-Zahl) × (1 − Unterschuss) / Reinheit; KOH: Verseifungszahl/1000. Grundrezept 4 × 125 g, 10 % → 66,7 g NaOH. Seifenmasse vorgeben: Fett = Masse / (1 + Lauge + Flüssigkeit + Duft). Test t87 (16 Prüfungen).
- Regel des Nutzers (06.11.2026): Menüs wie Dichte oder Fettkennzahlen am Artikel sollen einklappbar sein und am Ende der langen Artikelseite stehen (kommt mit der Artikelseiten-Überarbeitung).
- Nächste Schritte in dieser Reihenfolge: Katalog 1.4 mit Fettsäureprofilen (Freigabe des Nutzers: Werte aus Neumann „Seifen sieden“ und Käser „Naturkosmetische Rohstoffe“ dürfen bei identifizierbarem Rohstoff als validiert eingetragen werden, Werte am Artikel editierbar), Artikelseiten überarbeiten, dann Teil B (Ziele weiß/rückfettend/reinigend, Vorschläge aus dem Bestand, Seifeneigenschaften).

## Katalog 1.4.0: Seifenwerte aus Neumann (Buchwerte als Stufe 2)
- Freigabe des Nutzers (06.11.2026): Werte aus Neumann „Seifen sieden“ und Käser „Naturkosmetische Rohstoffe“ gelten bei eindeutig identifizierbarem Rohstoff als validiert (Stufe 2, Buch).
- Fund: Neumann arbeitet selbst mit Härte-Zahl und Ranziditätsfaktor (RZF), je Öl mit Prozentanteil gewichtet (Summe = Wert der Mischung). Fettsäureprofile sind dafür nicht nötig; Teil B (Ziele, Eigenschaften, Vorschläge) rechnet mit diesen Buchwerten.
- Neue Katalogspalten: `rzf`, `haerte` (Zahl), `seifenfarbe`, `schaum`, `seifeneinsatz` (Text), `sq` (Herkunft der Seifenwerte). Alle bisher leer außer bei 13 Rohstoffen aus den Ölporträts (Kokosöl, Cupuaçu, Mangobutter, Sheabutter, Talg, Avocado-, Mandel-, Reiskeim-, Hanf-, Soja-, Traubenkern-, Jojobaöl, Sojawachs). Sojawachs K0443 ist damit nicht mehr Einzelquelle.
- Zusätzlich NaOH-Zahl (und wo klar lesbar Jodzahl/Schmelzpunkt) aus der Ölliste im Serviceteil für Aprikosenkern, Argan, Babassu, Baumwollsaat, Erdnuss, Haselnuss, Kakaobutter, Kürbiskern, Macadamia. Neumanns NaOH-Zahl überschreibt `sap_naoh`; die KOH-Spanne aus Datenblättern bleibt.
- Grenzen: Die OCR-Datei enthält nur 14 Ölporträts mit Seitenleiste und einen Teil der Tabelle (Härte/RZF-Spalten der Tabelle zu unleserlich, deshalb nicht übernommen). Fehlende Öle (Olive, Raps, Palm, Palmkern, Rizinus, Sonnenblume, Distel u. a.) brauchen besseren Text der Seiten 90–130 und 228–231. Nutzer um sauberen Scan oder Text bitten. Kokos/Olive/Palm/Raps-Werte sind für das Grundrezept wichtig.
- Update-Feldliste in js7 um die neuen Spalten erweitert. Anzeige am Artikel folgt mit der Überarbeitung der Artikelseiten (Menüs einklappbar, am Seitenende).

## Katalog 1.4.1: Werte aus dem Notebook „Seifen sieden“ (Neumann)
- Der Nutzer ließ ein Gemini-Notebook mit Neumann/Käser per Prompt abfragen (Rohstoffe 1–25, 51–75, 76–105 und Zusatzfrage). Block 26–50 fehlt noch: Kirschkernöl bis Rapsöl, darin Olivenöl, Palmöl, Palmkernöl, Rapsöl, Kürbiskernöl, Macadamia, Leinöl.
- Eingetragen (Buchwerte, Stufe 2): NaOH-Zahl, Jodzahl, Schmelzpunkt überschreiben Händlerwerte; RZF, Härte, Farbe, Schaum, Einsatz füllen nur leere Felder. KOH-Zahl nur wenn leer. Spaltenlesart der Ölliste (S. 228): NaOH, KOH, Schmelzpunkt, Jodzahl, RZF, Härte, Haltbarkeit, Herkunft (bestätigt durch Kokos, Argan, Aprikose).
- Betroffen: Aprikosenkern, Argan, Babassu, Baumwollsaat, Borretsch, Camelina (Leindotter), Kamelie/Teesaat, Distel (normal), Erdnuss, Hagebutten- und Wildrosenöl, Haselnuss, Kakaobutter, Lanolin, Palmitinsäure, Bienen-/Beerenwachs, Schmalz, Rizinus, Ringelblume, Sanddorn, Schwarzkümmel, Weizenkeim, Sonnenblume (normal), Kokos (KOH).
- Vier neue Artikel: Gänseschmalz, Straußenfett, Lorbeeröl (Fruchtöl), Jatrophaöl (K1071–K1074). Bei Konflikten blieb der vorhandene Wert aus dem Ölporträt (z. B. Avocado NaOH 0,1335 statt 0,133).
- Gruppenwerte ohne Einzelzahl (RZF „> 130“ bei Borretsch, Schwarzkümmel, Weizenkeim, Hagebutte) nicht als Zahl übernommen, Wildrosen-/Hagebuttenöl haben die Hagebuttenwerte (RZF 141,6).
- Nicht im Notebook: Amaranth, Baobab, Chia, Cranberry, Erdbeerkern, Hafer, Heidelbeer-, Himbeer-, Johannisbeerkern, Kalaharimelone, hydriertes Rizinusöl u. a.; Wachse wie Candelilla, Carnauba, Ceresin, Illipe, Kokum, Montan, Ozokerit, Salbutter ohne Seifenwerte.

## Katalog 1.4.2: Olivenöl, Palmöl, Rapsöl
- Aus dem Notebook (Neumann S. 94, 115, 135, 138): Olivenöl NaOH 0,135, Jod 78–98, RZF 30, Härte 87, Einsatz bis 100 %; Palmöl NaOH 0,142, RZF 19,7; Rapsöl NaOH 0,133, Jod 94–120, RZF 73,5, Härte 69, beige bis hellbraun, bis 25 %. Palmkernöl: keine Zahlen im Notebook.
- Widerspruch im Buch: Text nennt RZF 30 für Olivenöl, das Rechenbeispiel (Grundrezept) benutzt 27; übernommen 30. Rapsöl RZF 72 (S. 115) oder 73,5 (S. 94): 73,5.
- Das Notebook hat von den Rohstoffen 26–50 nur Olive, Palm, Palmkern und Raps beantwortet; die übrigen Öle dieses Blocks (Kürbiskern, Macadamia, Lein, Mais, Nachtkerze u. a.) stehen noch aus.

## Artikelseite: Dichte, Fettkennzahlen, Seifenwerte als einklappbare Menüs am Seitenende
- Drei eigene `details.acc`-Menüs, immer zugeklappt, nach „Bezugsquellen & Preise“ (in der Ansicht vor der Karte Artikelcode): Dichte (g/ml), Fettkennzahlen (Verseifung), Seifenwerte (Härte, RZF, Einsatz). Die losen Blöcke aus „Meine Angaben“ sind weg.
- Dichte ist jetzt auf der Bearbeitungsseite ein Feld (`f_dens`, speichert `i.dens`); der Dialog `rzDens` bleibt. Dichte und Schüttdichte bleiben ein Feld, die Unterscheidung nur in den internen Notizen.
- Seifenwerte als eigener korrigierbarer Wert je Artikel: `i.rzf`, `i.hae`, `i.sfar`, `i.sch`, `i.sein` vor Katalog (`rzf`, `haerte`, `seifenfarbe`, `schaum`, `seifeneinsatz`), Helfer `swOf(i)` (für Teil B). Leer = Katalogwert als Platzhalter. Ansicht zeigt „eigener Wert“ und die Quelle `sq`.
- Fettkennzahlen/Seifenwerte nur bei Fettkategorien oder wenn Werte vorhanden sind; Dichte immer.
- Test t88 (14 Prüfungen); t85/t86 lesen die Blöcke mit textContent (zugeklappt).

## Seifenrechner Teil B: Eigenschaften und Vorschlag aus dem Bestand
- Neuer Abschnitt „Eigenschaften der Seife“ (nach Abwiegen): Härte und Ranziditätsfaktor als nach Anteil gewichtete Summe der Werte je Öl (Methode Neumann), mit Einordnung (Härte 80–90 = Zielbereich für feste Seife, RZF ≤ 40 gut haltbar), Anteil stark reinigender Fette (Verseifungszahl ≥ 240, z. B. Kokos, Babassu), Hinweis auf farbige Fette. Fehlen Werte bei einzelnen Fetten, wird nur aus den Fetten mit Angaben gerechnet und das angezeigt (Abdeckung in %). Werte kommen aus `swOf` (eigener Wert vor Katalog).
- Button „Vorschlag aus meinem Bestand“ (Abschnitt Öle und Fette): Ziel Weiß / Rückfettend (milder) / Hohe Reinigungskraft. `seiSugCalc` durchsucht Kombinationen aus bis zu 4 Fetten des Bestands (5-%-Schritte, nur Fette mit Härte, RZF und Verseifungszahl, Jojoba o. ä. mit Verseifungszahl < 150 ausgeschlossen) und bewertet nach Zielbereich der Härte, RZF und Anteil reinigender Fette; höchstens 30 % je stark reinigendem Fett oder gemäß „bis N %“ im Seifeneinsatz. Ist eine Menge gesetzt, muss der Bestand reichen (g, bei ml nur mit Dichte). Die drei besten Vorschläge lassen sich übernehmen (setzt Ölliste und Laugenunterschuss: weiß 10, rückfettend 12, reinigend 8 %) und danach ändern.
- „Weiß“ ist nur eine Faustregel: ausgeschlossen werden Fette, deren Seifenfarbe gelb, grün, rot, braun oder dunkel genannt ist. „Rückfettend“ bedeutet milderer Härtebereich, höherer Laugenunterschuss, wenig reinigende Fette; keine Wirkaussagen.
- Grenzen: Nur 35 Katalogeinträge haben bisher Härte und RZF (Palmöl ohne Härte); je mehr Werte am Artikel oder im Katalog stehen, desto besser die Vorschläge.
- Test t89 (17 Prüfungen).

## Katalog 1.4.3: Notebook-Block 26–75 (+109–111)
- Aus der Liste für NotebookLM (111 Rohstoffe) kam Block 26–75 und der Schluss 109–111 zurück; 76–108 fehlen noch. Viele Antworten „nicht im Notebook“ oder nur „–“ (z. B. Haferöl, Heidelbeerkern, Himbeerkern, Illipe, Kirschkern, Kalahari, Montanwachs, Moringa, Mowrah, Neem, Papaya, Para, Pekan, Pistazie, Kaffeeöl, Kokum, Kukui, Mohn, Palmkern).
- Eingetragen (Buchwerte, Stufe 2): Kürbiskernöl (Schmelzpunkt, RZF 98, Härte 50, Seifenfarbe), Macadamia (Schmelzpunkt, RZF 3,7, Härte 95), Mangokernöl (NaOH 0,136, Jod 33–49, Schmelzpunkt, RZF 12, Härte 94, hellbeige, Schaum, Einsatz 10–25 % bis 40 %), Johannisbeerkernöl (Jod 160–175, Einsatz 5–10 %), Nachtkerzenöl (Jod 145–162, Einsatz 5–10 %), Pflaumenkernöl (KOH 188–199, Jod 90–108), Jasminwachs (Schmelzpunkt), Jojobabeads (Einsatz 5 %), Murumuru (Hinweis Einsatz).
- Regel diesmal: Käser-Spannen überschreiben vorhandene Händlerwerte nur, wenn sie enger sind oder der Händlerwert leer ist; sonst bleibt der vorhandene Wert (z. B. Japanwachs, Perilla, Pfirsichkern, MCT, Leinöl, Marula, Wiesenschaumblume).
- Gruppenwerte ohne Einzelzahl (RZF „> 130“, Härte „weich“ bei Johannisbeere/Nachtkerze) nicht übernommen. Auffällig: Macadamia und Kürbiskern haben im Notebook identische NaOH-/KOH-Zahlen (0,139 / 0,1946); bei Macadamia unverändert gelassen, bitte gelegentlich gegenprüfen.

## Katalog 1.4.4: Notebook-Block 76–108
- Damit ist die Liste von 111 Rohstoffen zurück. Eingetragen (Buchwerte, Stufe 2): Rizinusöl (KOH 176–187, Jod 82–90), Rosenwachs (NaOH 0,021, Jod 13, Schmelzpunkt 60 °C, RZF 0), Sacha-Inchi (Jod 192–199), Sanddorn Fruchtfleisch (Jod 60–70), Sanddornkern (KOH 185–200, Jod 160), Sesam (Jod 103–118), Sheaöl (KOH 180–200, Jod 65–90), Sojawachs (Schaum Rasierseife), Straußenfett (Schaum), Tamanu (Einsatz 10 %), Walnuss (Jod 141–155).
- Nicht übernommen: Sonnenblumenöl (Notebook nennt Werte nur für high oleic, der Katalogeintrag ist das normale Öl), Gruppenwerte (Schwarzkümmel, Weizenkeim RZF „> 130“, Härte „weich“/„hart“ als Text), „nicht im Notebook“ und „–“ (u. a. Hydriertes Rizinusöl, Rosenkernöl, Salbutter, Stearylalkohol, Tigernuss, Tomatenkern, Tsubaki, Ucuuba, Wassermelonenkern). Vorhandene Werte bleiben, wenn sie enger sind als die Käser-Spanne.

## Katalog 1.4.5: High-Oleic-Sorten als eigene Artikel
- Neu: K1075 Sonnenblumenöl (High Oleic) mit den Neumann-Werten aus dem Notebook (NaOH 0,1355, KOH 189,7, Jod 89–93, Schmelzpunkt -5 °C, RZF 22–30, Härte 85, weiß bis cremeweiß, bis 100 %) und K1076 Distelöl (High Oleic) ohne Zahlen (Werte stehen aus). Das bestehende Sonnenblumenöl und Distelöl bleiben die linolsäurereichen Sorten.
- Katalog 1050 Einträge. Tests t83/t85 auf 1050 bzw. 31 und 17 neue Einträge angepasst.
- Regel für weitere Sortenöle: ölsäure- und linolsäurereiche Sorten haben stark verschiedene Jodzahl, RZF und Härte und bekommen eigene Artikel (Kandidaten: Raps/Canola High Oleic, Erdnuss, Färberdistel).

## Rechner: alle Platzhalter mit Funktion (js29.js, noch nicht vom Nutzer getestet)
- Neu angelegt und funktionsfähig: Alkohol verdünnen (Vol.-%, Mengen in ml und g), Tropfen und Gramm (Tropfengröße und Dichte, auch Tropfen für Ziel-%), Emulgatorrechner (Wasserphase, Fettphase, Emulgator bezogen auf die Fettphase), Kalkulation (Rezept wählen, Rohstoffkosten über `rzCheck`/`rzCost`, Gefäß, Etikett, Aufschlag), Tensidrechner (WAS: Ziel-WAS, Tensidanteile, WAS-Gehalt je Tensid am Artikel als `i.was`), Spreitwert-Check (Spreitwert je Öl am Artikel als `i.spr`, Grenzen niedrig/mittel/hoch anpassbar, weil sie je Quelle verschieden sind).
- Zusätzlich neu: HLB-Mischung (zwei Emulgatoren auf Ziel-HLB), Preisvergleich (je 100 g und kg), Haltbarkeit berechnen (Herstelldatum plus Monate, Monatsende wird beachtet). Gruppe „Später“ heißt jetzt „Öle und Pflege“.
- Technik: kleines Gerüst `RCX[tool]` mit `def`, `f` (Felder), `pre`, `hint`, `r()`; `rzBau`, `rchOpen` und `rchRes` sind in js29 umhüllt. Die Felder `i.was` und `i.spr` stehen noch nicht auf der Artikelseite und im Export; Katalogfelder für WAS und Spreitwert fehlen weiterhin (Daten fehlen).
- Tests t90 (13 Prüfungen), t91 (Prüfung auf deutsche Reste in EN).
- Offen: Änderungswünsche für das Menü Einstellungen kamen als Audio (60 Minuten), die Datei ließ sich hier nicht transkribieren; Nutzer liefert den Inhalt als Text.

## Einstellungen schlank (js30.js) und WAS/Tensidklasse im Katalog 1.5.0
- Mehr › Einstellungen ist jetzt eine kurze Liste in der Reihenfolge Sprache (öffnet die Sprachauswahl), Sichern und zurücknehmen, Katalog, Mengeneinstellungen, Hilfe, Expertenmodus und, nur bei eingeschaltetem Expertenmodus, Testbetrieb (enthält das Laden und Entfernen der Testdaten). Jede Auswahl öffnet eine eigene Seite; der Pfeil oben links führt zurück zur Liste (Mechanik `SNAV` aus js25). Das Mehr-Menü selbst blieb unverändert. Änderungen in einer Unterseite (Genauigkeit, Expertenmodus) bleiben auf der Unterseite; die Liste dahinter wird bei Expertenmodus aufgefrischt (`setNavFix`).
- Wunsch kam als Sprachmemo; die Zuordnung „Testbetrieb“ und „Testdaten“ ist ein Eintrag Testbetrieb mit den Testdaten darin (Rückfrage beim Nutzer offen).
- Katalog 1.5.0: neue Felder `was` (WAS-Gehalt in %, 28 Tenside) und `tensidklasse` (61 Einträge) aus der Arbeitsliste des Katalog-Chats (`katalog_arbeit/*.json`). Vier Tenside mit mehreren Lieferformen im Text (Natriumcocoylglutamat, Natriumlauroylglutamat, Olefinsulfonat, Cocoylalaninat) werden vom Rechner nicht als Zahl genommen; die App fragt nach dem Wert der eigenen Ware. Katalogabgleich (`catApply`) kennt die Felder.
- Artikelseite: neues einklappbares Menü „Tensidwerte“ (WAS-Gehalt, Tensidklasse) am Seitenende, eigener Wert `i.was`/`i.tkl` vor Katalog, wie bei den Seifenwerten. Der Tensidrechner füllt den WAS-Gehalt aus dem Katalog vor (grau) und lässt Überschreiben zu.
- Tests t92 (22), t93 (Prüfung EN-Reste); t73, t84, t90 an die neue Struktur angepasst.

## Etikettendruck mit Suche, Warnhinweise, Werte-Spalten, Rezeptschritte (js30/js31, Katalog 1.5.1)
- Etikettendruck: Suchzeile über der Druckliste. Antippen eines Treffers setzt den Rohstoff auf die Druckliste (mit Entfernen-Knopf, Zähler, Vorschau). Die frühere Checkbox-Liste mit allen Rohstoffen ist ersetzt; Alle/Keine/Noch nicht gedruckt wirken weiter auf die Druckliste. Test t94.
- Katalog 1.5.1: Warnhinweise (`w`) für Wasserstoffperoxid (EU Anh. III Nr. 12), Kalium-/Natriumhydroxid, Cyclomethicon, Glykolsäure. Der rote Kasten „Warnhinweis“ auf der Artikelseite zeigt sie. Test t95. Wichtig: `build_netlify.py` liest den Katalog aus `/home/claude/work/katalog_master.json`, vor dem Bauen dorthin kopieren.
- Lager (Expertenmodus): neue Spalten und Sortierungen Dichte (auch aus dem Katalog), WAS, Tensidklasse, NaOH, KOH, Jodzahl, Schmelzpunkt, RZF, Härte, Einsatz in Seife, Spreitwert. Lücken finden › „Fehlende Werte …“ zeigt je Wert „n ohne, m mit“ und blendet die Spalte beim Filtern ein. Eigene Werte haben Vorrang vor dem Katalog. Test t96. Noch offen: Export-Spalten und Dashboard-Karten für diese Werte.
- Katalog-Abdeckung (1050 Artikel): Dichte 95, Verseifungszahl 95, WAS 28, Tensidklasse 61, Jodzahl 89, Schmelzpunkt 52, RZF 40, Härte 36, Warnhinweise 6.
- Rezepte: `splitMods` teilt Ablauf-Module mit „1. … 2. …“ in je ein Arbeitsschritt-Modul, Phase im Titel wenn eindeutig erkennbar (Text nennt „Phase X“ oder Phasenname passt). Gilt für Testrezepte (Daten und bereits geladene, einmalig über `S.migSteps`) und für jeden Rezeptimport (`rzParse`). Eigene Rezepte werden nicht umgebaut. Test t97.
- Lückenfinder mit Ausschlussregeln (`APPL` in js31.js): Seifen-/Fettwerte zählen nur bei Pflanzenöl, Butter & Wachs, Ester & Emollient, Seifenrohstoff; Spreitwert bei Pflanzenöl und Ester; WAS und Tensidklasse nur bei Tensid und Emulgator. Dichte gilt für alle. Testrezepte tragen weiter `r.demo`; eigene und aus Vorlagen erstellte Rezepte haben das Feld nicht.
- Artikelseite: Überschriften von Beschreibung/Funktion, Verwendung/Wirkweise und Notiz sind in Ansicht und Bearbeiten Versalien, fett und größer als der Text; der Hinweis „Vorschlag aus dem Katalog, ungeprüft“ steht immer in der zweiten Zeile. Notiz-Text ist halbfett (`fldHead` in js31.js). Test t98.
- Schlagwörter (js31.js): `i.tags` je Artikel, vorgegebene Liste `TAGS_BASE` (21 Begriffe) zum Antippen plus eigene (`S.tags`). Auf der Artikelseite beim Bearbeiten unter Notiz, in der Ansicht als Chips, die in die gefilterte Liste springen. Suche findet Schlagwörter; Lücken finden › „Schlagwort …“ und „Ohne Schlagwort“; Spalte und Sortierung „Schlagwörter“. Offen: Export-Spalte, mehrere Filter gleichzeitig. Test t99.
- Form: der Hinweis „Vorschlag aus dem Katalog, ungeprüft“ entfällt am Feld Form (Bestätigungsstatus wird nicht gepflegt); bei Beschreibung und Verwendung bleibt er.
- Schlagwörter beim Bearbeiten bleiben wie ursprünglich (Vorschläge zum Antippen, eigene hinzufügen); die Idee „Tags ins Notizfeld verschieben“ hat der Nutzer verworfen. Tags gibt es nur als Chips auf der Artikelseite, in Suche, Filter und Spalten.
- Spalten-Menü (Expertenmodus, `sheetColsX2` in js31.js): oben die gewählten Spalten mit ↑ ↓ ×, darunter einklappbare Gruppen Bestand und Preise, Artikeldaten, Seifen- und Fettwerte, Tensidwerte, Schlagwörter. Jedes Schlagwort ist eine eigene Spalte (Häkchen, sortierbar), Schlüssel `tag:Name` (`ensureTagCols`). Test t100.

## KI-Konzept und Landkarte der App (07.11.2026, nur Dokumente, kein App-Code)
- Neu: `src/KI_KONZEPT.md` (Konzept KI-Funktionen in Abschnitten 1 bis 10: Leitbild, Architektur, Funktionen A Erfassen, B App-Guide, C Auswerten, D Rezept-Chat, Testsatz, Rückfallstand, Reihenfolge und Risiken, Beschlussprotokoll) und `src/APP_LANDKARTE.md` (Struktur der App aus der laufenden Fassung ausgelesen; Lücken in deren Abschnitt 10). Beides ist Entwurf; gebaut wird erst nach dem finalen „Go“ des Entwicklers (Abschnitt 9.4 des Konzepts listet die offenen Entscheidungen).
- Entschieden/festgehalten: KI hängt sich in die vorhandene Import- und Bestätigungsstrecke; Regeln und Rechner bleiben Stufe R0 (Rechenstufen R0 bis R2, damit „Stufe“ nicht mit den Validierungsstufen des Katalogs kollidiert); KI schreibt nie still in `S`; API-Schlüssel nie in `S` und nie in der Sicherung; KI standardmäßig aus; KI-Testfassung soll mit eigenem Datenbanknamen laufen (Vorschlag), weil Pages main ausliefert und die PWAs sich selbst aktualisieren.
- Kommentar des Entwicklers zu Abschnitt 1 eingearbeitet (1.7: KI-Werte und KI-Rezepte werden nach Praxistest durch den Nutzer bestätigt; Benennung der Stufe offen).
- Rückfallstand: Branch `ohne-ki` auf Commit 788a9d5 (auf GitHub, nie weiterentwickeln). Der Tag `ohne-ki-2026-11-07` liegt nur lokal (Tag-Push 403). Weiterarbeit zunächst auf main; KI-Branch `ki` mit eigener Datenbank folgt, sobald KI-Code entsteht.
- Vertrauensstufen für KI-Werte beschlossen (Konzept 1.7): KI höchstens Stufe 1, Übernahme durch den Nutzer Stufe 2, Bestätigung Stufe 3; verifiziert erst nach Bestätigung.
- Beschlossen am 07.11.2026: Originalfoto beim KI-Import wird nicht gespeichert (gelöscht danach); Arbeitsregel „Landkarte im selben Commit pflegen“ steht jetzt in `UEBERGABE.md`.
- Offen: Entscheidungen 1 bis 3, 5, 6, 8 bis 10 im Konzept (Abschnitt 9.4), insbesondere ein optionales Bewertungsformular je Charge vor Start der echten Erfassung (Datenmodell Rezeptbuch, additiv).


## Bewertungsformular in der Charge (07.11.2026)
- Neu: src/proto/js32.js (Wrapper um rzChgs/rzChg aus js19.js), Eintrag in patch7.py, EN/ES in i18n7.py, Test src/tests/t101.js.
- Daten additiv und optional: c.k={kons,duft,aus,haut}, c.bew=[{id,date,stars,k,note}]. Erstbewertung c.stars/c.note unverändert; Export und Statistik (js23.js) unverändert.
- Tests: t101 ok, t83 bis t100 ohne Fehler.
- Offen: Filter "noch nicht nachbewertet" (nur Idee).


## KI Stufen 3 bis 5: Testsatz, Dienst-Schicht, App-Guide (07.11.2026)
- Neu: src/testdaten/gen_ki.py (erzeugt proto/testdaten_ki.js), proto/js33.js (kiCall, kiOn, Einstellungen KI-Funktionen, KI-Testsatz laden/entfernen), proto/js34.js (App-Guide, Mehr-Eintrag nur bei freigeschalteter KI), Zeile in js30.js (Einstellungsliste), patch7.py, i18n7.py, build.sh (erzeugt wissen/app-landkarte.md), Tests t102 (neu), t92 (erwartete Liste um KI-Funktionen ergänzt).
- Schlüssel und Modell liegen in eigenen localStorage-Einträgen (inciheinz-ki-key, inciheinz-ki-cfg), nicht in S, nicht in der Sicherung. Ohne Schlüssel kein Netzwerkaufruf (getestet: 0 Aufrufe).
- Offen: Modellname gemini-3.8-flash gegen die echte API prüfen (aus der Entwicklungsumgebung nicht erreichbar, beim ersten Prüfen mit deinem Schlüssel zeigt sich das). Nächste Stufe: C R0 Auffälligkeiten, danach A Erfassen.
