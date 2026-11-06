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
