# INCIheinz – Landkarte der App

**Stand:** 07.11.2026, erzeugt aus der laufenden App (Commit 788a9d5, Katalog 1.5.1) mit Expertenmodus und Testdaten. Erster Entwurf, siehe Abschnitt 10 („noch nicht erfasst“).
**Zweck:** Orientierung für Nutzer, andere Chats und den KI-Guide (Konzept: `KI_KONZEPT.md`, Abschnitt 4). Die Beschreibung ist **implementierungsneutral**; interne Namen stehen nur in Abschnitt 9.
**Pflege:** Wer eine Ansicht, ein Menü oder ein Datenfeld ändert, ergänzt diese Datei im selben Commit (Vorschlag, noch nicht beschlossen).

Schreibweise der Pfade: `Bereich › Ansicht › Element`.

---

## 1. Navigation

**Zwei Seiten in einer App.** Im Kopf aller Ansichten steht das Logo, darunter das Register **Lager | Rezeptbuch**. Wechsel mit ungespeicherter Arbeit (Rezept-Editor, Werkbank) fragt nach.

**Untere Leiste Lager (fünf Einträge):** Lager · Eingabe · Neuer Rohstoff (Mitte, Plus) · Einkauf · Mehr.
**Untere Leiste Rezeptbuch (fünf Einträge):** Rezepte · Rechner · Neues Rezept (Mitte) · Chargen · Mehr.

**Zurück:** Pfeil oben links in Unteransichten und in den Seiten der Einstellungen; Wischen nach links oder die Zurück-Geste des Geräts funktioniert in den meisten Ansichten.
**Mehr** öffnet ein Menü von unten (je Seite unterschiedlich, Abschnitt 2.10 und 3.7). **Einstellungen** liegt im Mehr-Menü (Abschnitt 4).

---

## 2. Lager

### 2.1 Lager-Übersicht
Pfad: `Lager › Lager` (Ansicht „Übersicht“).
- **Sicherungshinweis** oben, solange keine Sicherung besteht: „Jetzt sichern“ / „Später“.
- **Filter-Pille** „Alle | Knapp | Läuft ab“ mit Anzahl; filtert die Liste nach Status.
- **Umschalter** „Übersicht | Liste“.
- **Handlungsbedarf:** Kacheln „knapp, noch nicht bestellt“ (öffnet Einkaufsvorschläge bzw. Filter) und „läuft in 30 Tagen ab“ (Filter).
- **Regal-Check:** führt durch den Katalog nach Kategorien, damit man markiert, was man besitzt (Abschnitt 2.8).
- **Kategorien:** je Kategorie eine Kachel mit Anzahl und Gesamtmenge; Antippen öffnet die Liste dieser Kategorie.
- **Suche** „Rohstoff suchen …“ (Name, INCI, Schlagwörter und weitere Felder).

### 2.2 Lager-Liste
Pfad: `Lager › Lager` (Ansicht „Liste“).
- Zeile je Rohstoff mit festen Spaltenbreiten, Statussymbolen unter dem Namen (INCI geprüft/ungeprüft, Menge, Haltbarkeit).
- **Zurücksetzen** der Filter, **Suche**, **Lücken finden**, **Spalten**, **Sortieren** (Expertenmodus bietet alle).
- **Lücken finden:** Filter auf fehlende Angaben: Schlagwort, Menge, INCI (ungeprüft/ohne), Wirkweise, Beschreibung, Notiz, Bezugsquelle, Lagerort, MHD und „Fehlende Werte …“ (Dichte, WAS, Tensidklasse, NaOH-Bedarf, Verseifungszahl, Jodzahl, Schmelzpunkt, Ranziditätsfaktor, Härte, Einsatz in Seife, Spreitwert). Je Wert zeigt die Auswahl „n ohne, m mit“. Fachliche Ausschlussregeln: Seifen- und Fettwerte zählen nur bei Pflanzenöl, Butter & Wachs, Ester & Emollient, Seifenrohstoff; WAS und Tensidklasse nur bei Tensid und Emulgator; Dichte gilt für alle.
- **Spalten:** gewählte Spalten oben (↑ ↓ ×), darunter einklappbare Gruppen: Bestand und Preise, Artikeldaten, Seifen- und Fettwerte, Tensidwerte, Schlagwörter (jedes Schlagwort eine eigene Spalte).
- **Sortieren nach:** Name, Menge, Preis je 100 g/ml, zuletzt bestellt/aufgenommen/geändert, nächstes Ablaufdatum, Kategorie, INCI-Status, Wirkweise, Form, Lieferant, Mindestmenge, EAN, Dichte, WAS, Tensidklasse, NaOH-Bedarf, Verseifungszahl, Jodzahl, Schmelzpunkt, Ranziditätsfaktor, Härte, Einsatz in Seife, Spreitwert, Schlagwörter und je Schlagwort.
- Antippen einer Zeile öffnet die Artikelseite.

### 2.3 Artikelseite
Pfad: `Lager › Lager › (Rohstoff)`. Zwei Zustände: **Ansicht** und **Bearbeiten** („Bearbeiten“ oben rechts; im Bearbeiten „Abbrechen“ und „Speichern“; ungespeicherte Änderungen fragen beim Verlassen nach).
Aufbau von oben nach unten:
1. **Kopf:** Name, Kategorie, Statussymbole (INCI geprüft, Menge über Mindestbestand, vorrätig, haltbar bis …); Antippen eines Symbols erklärt es.
2. **Aktionen:** Foto hinzufügen · Bestand ändern · Auf Einkaufsliste · Aufgebraucht · Etikett.
3. **Gefäße:** Liste der Gefäße (Art, Nenninhalt, Lagerort), „+ Gefäß hinzufügen“. Gefäße beschreiben nur die Verpackung; die Gesamtmenge ändern sie nie.
4. **INCI:** Text, Prüfstatus; „Aus Produktseite übernehmen“, „Im Web suchen“, „Aus Text übernehmen“; „Als geprüft bestätigen“ setzt der Nutzer, eingefügter Text bleibt „ungeprüft“.
5. **Stammdaten:** Kategorie, Form, Lagerort, Name, EAN/Artikelcode.
6. **Meine Angaben:** Beschreibung/Funktion, Verwendung/Wirkweise, Notiz (Vorschlag aus dem Katalog trägt den Hinweis „ungeprüft“), Einsatzkonzentration (von/bis in %), **Schlagwörter** (Vorschläge zum Antippen plus eigene).
7. **Haltbarkeit, Quelle & Minimum:** MHD, Mindestmenge u. a.
8. **Bezugsquellen & Preise:** je Bezugsquelle Lieferant, Preis, Menge, Datum, Link; jeder Preis wird mit Datum gespeichert (Preisverlauf, Preis je 100 g/ml). Eintrag antippen = bearbeiten.
9. **Einklappbare Menüs am Ende (immer zu):** **Dichte** (g/ml; Dichte und Schüttdichte sind ein Feld), **Fettkennzahlen** (Verseifung: KOH, NaOH, Jodzahl, Schmelzpunkt), **Seifenwerte** (Härte, Ranziditätsfaktor, Seifenfarbe, Schaum, Einsatz in Seife), **Tensidwerte** (WAS-Gehalt, Tensidklasse). Eigene Werte haben Vorrang vor dem Katalogwert; Katalogwerte stehen grau als Vorschlag.
10. **Warnhinweis** (roter Kasten), wenn der Katalog einen rechtlichen Hinweis kennt (z. B. Wasserstoffperoxid, Hydroxide).
11. **Verwendet in Rezepten**, **Etikett drucken**, **Rohstoff entfernen** (mit Rückgängig).

### 2.4 Eingabe
Pfad: `Lager › Eingabe`.
- **Code scannen** (Barcode/QR vom Etikett oder der Verpackung).
- **Produktseite lesen:** Foto, Screenshot oder Text einer Lieferantenseite; „Auslesen“ liefert eine Vorschau, die bestätigt wird.
- **Code von Hand eingeben** (Artikelcode oder EAN), „Öffnen“.

### 2.5 Neuer Rohstoff
Pfad: `Lager › Neuer Rohstoff` (Mitte der Leiste).
Name eingeben, **Vorschläge aus dem Katalog** (übernimmt Kategorie, INCI und Vorschlagsfelder), „Mit Foto anlegen“, „Speichern“, „Als eigenen Rohstoff anlegen“.

### 2.6 Einkauf
Pfad: `Lager › Einkauf`.
Einkaufsliste mit Posten (Rohstoff, Bedarf, im Lager, Preis). Ansichten „Alle Rohstoffe | Nach Lieferant“. Je Posten: Lieferantenwahl mit Preis, „Gekauft“ (Bestand buchen), „Entfernen“. Oben „+ Rohstoff“ und „Export“ (Einkaufsliste).

### 2.7 Statistik
Pfad: `Lager › Mehr › Statistik`. Kacheln: Lagerwert, Einkauf, Kategorien, Vollständigkeit (Anteil ausgefüllter Felder), Ablaufkalender, Preisentwicklung (bis zu fünf Rohstoffe wählbar), Preisänderungen, günstigster Lieferant.

### 2.8 Regal-Check
Pfad: `Lager › Übersicht › Regal-Check`. Liste der Katalogkategorien mit „vorhanden / im Katalog“; je Kategorie den Katalog durchgehen und markieren, was man besitzt; „Alle übernehmen“.

### 2.9 Etiketten
Pfad: `Lager › Mehr › Etiketten`. Größen Klein 38×21, Mittel 48×25, Groß 63×38 mm; Suchzeile, Treffer kommen auf die **Druckliste** (Anzahl pro Etikett, Entfernen); „Alle“, „Keine“, „Noch nicht gedruckt“; „Drucken“.

### 2.10 Mehr-Menü Lager
`Lager › Mehr`, gegliedert in:
- **Statistik** (2.7)
- **Drucken & Gestalten:** Etiketten (2.9)
- **Daten:** **Import** (Artikel und Preise aus Listen), **Export** (Einkaufsliste, Bestandstabelle mit Filter und Spaltenauswahl)
- **Voreinstellungen Lager:** **Lagerorte & Lieferanten** (Orte für Gefäße, Lieferanten mit Versandkosten und Frei-ab-Betrag)
- **Für die ganze App:** **Einstellungen** (Abschnitt 4)

---

## 3. Rezeptbuch

### 3.1 Rezepte
Pfad: `Rezeptbuch › Rezepte`. Liste mit Suche; Filter „Alle | Mischbar“. Zeile: Name, Version, Menge, **Mischbar** (alle Zutaten in ausreichender Menge im Lager; Wasser frei; ohne Menge „Menge offen“; fehlende Dichte zählt nicht als „nicht vorhanden“, dazu ein Hinweis). Antippen öffnet die Rezeptseite.

### 3.2 Rezeptseite
Pfad: `Rezeptbuch › Rezepte › (Rezept)`.
- **Symbolaktionen:** Mischen · Bearbeiten · Versionen · Als Kopie · Foto.
- **Rechner mit Anker:** Gesamtmenge und jedes Mengenfeld sind Anker; ändert man einen Wert, rechnen die anderen mit (nur Anzeige, gespeichert wird im Editor).
- **Abschnitte:** Zutaten nach Phasen mit Mengen, Anteilen und Lagerstatus; **INCI-Deklaration (Entwurf)**; **Eckdaten**; **Ablauf und Hinweise**.
- **Weitergeben:** Rezeptkarte drucken · Rezept teilen (fertiges PDF).

### 3.3 Versionen
Pfad: `… › Rezeptseite › Versionen`. Liste v1, v2 … mit Datum, Notiz und Differenz in Gramm; „Als Ausgangspunkt bearbeiten“, „Als neues Rezept speichern“, „Version markieren“ (gut/schlecht). **Jedes Speichern erzeugt eine neue Version** mit Notiz „Was hast du geändert?“; eine Version wird nie überschrieben.

### 3.4 Neues Rezept / Bearbeiten (Editor)
Pfad: `Rezeptbuch › Neues Rezept` bzw. Rezeptseite › Bearbeiten.
- **Eckdaten (optional):** Name, Zweck/Kategorie, Ergibt (Menge), Zeit, Schwierigkeit (leicht, mittel, anspruchsvoll), Anzahl Behältnisse.
- **Zutaten:** „+ Zutat“ (einmal hier eintragen, Zuordnen zu Lagerartikel oder Katalog), Menge in g, Minuten, Umrechnen auf beliebige Menge, g/ml-Anzeige, Ziehen per Griff.
- **Phasen (optional):** „+ Phase“ (A, B, C, D oder frei benannt).
- **Ablauf und Hinweise (optional):** „+ Modul“: Arbeitsschritt, Hinweis (Achtung/Tipp/Sicherheit), Abfüllung, Haltbarkeit, Notiz; Module lassen sich verschieben (▲ ▼), löschen, einfügen.
- **Entwurf** bleibt erhalten, wenn man den Editor verlässt; Speichern-Leiste unten; Tastatur blendet sie aus.
- **Rezept-Import** (Mehr › Import): Text, Foto oder Datei wird in einen Entwurf umgewandelt, der im Editor geprüft und gespeichert wird.

### 3.5 Mischen (Werkbank) und Chargen
- **Mischen:** Rezept wählen → Menge → Zutaten abhaken, Ist-Gewichte eintragen (Enter schaltet weiter) → Abschluss: **Lagerabzug nur nach Bestätigung** („abziehen“ oder „nur Charge speichern“), mit Rückgängig-Leiste. Nicht abgezogen wird bei unbekannter Menge oder fehlender Dichte.
- **Chargen:** `Rezeptbuch › Chargen`. Liste aller gemischten Chargen (Rezept, Datum, Version, Menge, Sterne). Die Charge enthält Datum, Version, Gesamtmenge, Notiz, Sternebewertung („Wie ist es geworden?“), Lagerabzug und je Zutat Soll und Ist.

### 3.6 Rechner (Hub)
Pfad: `Rezeptbuch › Rechner`. Gruppen und Einträge:
| Gruppe | Rechner | Zweck |
|---|---|---|
| Mengen und Einheiten | Prozent und Gramm | Gesamtmenge, Anteil, Menge: zwei Werte eingeben, der dritte rechnet sich |
| | Dreisatz | Verhältnisrechnung |
| | Verdünnen | aus einer starken Lösung eine schwächere ansetzen |
| | Einheiten umrechnen | g, kg, mg, oz, lb, ml, l, fl oz (auch mit Dichte) |
| | Alkohol verdünnen | Vol.-% (z. B. 96 auf 70), Mengen in ml und g |
| | Tropfen und Gramm | Tropfengröße und Dichte, auch Tropfen für Ziel-% |
| | Preisvergleich | zwei Angebote, Preis je 100 g und kg |
| Für ein Rezept | Rezept umrechnen | Zielmenge oder Gefäße × Füllmenge, Verlustzuschlag; Übernahme als Entwurf/neue Version |
| | Rezeptanalyse | Anteile je Phase und Rohstoffart, Wasser/Öl/Emulgator/Konservierung |
| | Dosierung prüfen | Anteil je Zutat gegen den am Rohstoff eingetragenen Einsatzbereich |
| | Emulgatorrechner | Wasser-, Fettphase, Emulgator bezogen auf die Fettphase |
| | Kalkulation | Kosten je Charge und je 100 g, mit Verpackung, Etikett, Aufschlag |
| | HLB-Mischung | zwei Emulgatoren auf Ziel-HLB |
| | Haltbarkeit berechnen | Herstelldatum plus Monate |
| Tenside und Seife | Tensidrechner (WAS) | Ziel-WAS, Tensidanteile, WAS-Gehalt je Tensid |
| | Kaltverseifung | Öle, Laugenunterschuss, NaOH/KOH, Wasser; Teil B: Eigenschaften und „Vorschlag aus meinem Bestand“ |
| Öle und Pflege | Spreitwert-Check | Spreitwert je Öl, Grenzen anpassbar |
Rechner übernehmen Ergebnisse nie still: Übernahme öffnet immer einen Entwurf, gespeichert wird nur über „Speichern“. Bei Kaltverseifung steht ein Laugen-Sicherheitshinweis.

### 3.7 Mehr-Menü Rezeptbuch
`Rezeptbuch › Mehr`:
- **Statistik:** Rezepte, Chargen, häufige Zutaten
- **Drucken & Gestalten:** Rezepte & Chargen (Vorlage wählen, drucken)
- **Daten:** **Import** (Rezepte aus Text, Foto oder Datei), **Export** (Rezepte als Text, Chargentabelle), **Rezept teilen** (fertiges PDF)
- **Voreinstellungen Rezeptbuch:** **Module & Ablauf** (Bausteine und Standard-Ablauf)
- **Für die ganze App:** **Einstellungen**

---

## 4. Einstellungen
Pfad: `Mehr › Einstellungen` (Liste; jeder Eintrag öffnet eine eigene Seite, Pfeil zurück zur Liste):
- **Sprache:** Deutsch, English, Español (Katalogtexte `b`, `v`, `w` nicht übersetzt).
- **Sichern und zurücknehmen:** Sicherung der ganzen App (Backup speichern und laden; enthält Lager, Rezepte, Chargen); letzte Änderung rückgängig.
- **Katalog:** Grundkatalog der App (1050 Einträge), „Katalog aktualisieren“.
- **Mengeneinstellungen:** Anzeigegenauigkeit im Lager (ganze g/ml, 0,1 oder 0,01) und Rundung im Rezeptbuch/Werkbank (0,01 g, 0,1 g, 0,5 g, 1 g).
- **Hilfe:** Anleitung und Info.
- **Expertenmodus:** schaltet Spalten, Sortierungen, Lückenfinder-Werte und den Testbetrieb frei.
- **Testbetrieb** (nur im Expertenmodus): **Testdaten laden/entfernen** (27 Beispielrezepte und passende Rohstoffe; nicht fachlich geprüft, nicht zum Nachmischen).

---

## 5. Formate
| Vorgang | Format | Hinweis |
|---|---|---|
| Artikelimport | Excel (.xlsx, erstes Blatt), CSV/TSV/Text | Spalten: Name, INCI, Kategorie, Menge, Einheit, Preis, Datum, Lieferant, EAN, MHD, Verwendung, Notiz; Überschriften müssen nicht exakt stimmen; Vorschau vor Übernahme; Vorlage als leere CSV |
| Produktseite lesen | Foto, Screenshot, Text | lokale Texterkennung; Vorschau, Bestätigung |
| Rezeptimport | Text, Foto, Datei (.json) | Entwurf im Editor, Phasen und Arbeitsschritte werden erkannt |
| Export Lager | Einkaufsliste (nach Lieferant oder ganz), Bestandstabelle (Filter, Spaltenauswahl; enthält alle Spalten) | Tabelle/Excel; Export für Notebook-Programme |
| Export Rezeptbuch | Rezepte als Text, Chargentabelle, Rezept teilen als PDF, Rezeptkarte drucken | |
| Sicherung | Datei der ganzen App | Wiederherstellung führt zusammen |
| Etiketten | Druck, drei Größen | |

---

## 6. Datenfelder (Kurzüberblick)
- **Artikel:** Name, Kategorie, Form, INCI (+ Prüfstatus), Beschreibung, Verwendung, Notiz, Einsatz von/bis (%), Dichte, Fettkennzahlen (KOH, NaOH, Jodzahl, Schmelzpunkt), Seifenwerte (Härte, Ranziditätsfaktor, Farbe, Schaum, Einsatz), Tensidwerte (WAS, Klasse), Spreitwert, MHD, Mindestmenge, Lagerort, Schlagwörter, EAN/Code, Foto, **Gesamtmenge** (einzige Wahrheit), Gefäße, Bezugsquellen mit Preisverlauf.
- **Rezept:** Versionen mit Phasen, Zutaten (Gramm), Ablauf-Modulen, Eckdaten, Markierung gut/schlecht, Notiz und Differenz je Version.
- **Charge:** Rezept, Version, Datum, Menge, Soll/Ist je Zutat, Sterne, Notiz, Lagerabzug.
- **Katalog:** 1050 Einträge mit Vorschlagswerten, ungeprüft bis zur Bestätigung.

---

## 7. Begriffe
**Gesamtmenge:** die einzige Mengenquelle eines Artikels. **Gefäß:** Verpackung, ändert nie die Menge. **Anker:** Mengenfeld, an dem der Rechner festhält. **Mischbar:** alle Zutaten reichen. **Ungeprüft/geprüft:** Status von INCI und Katalogwerten; „geprüft“ setzt nur der Nutzer. **Eigener Wert:** Nutzerwert hat Vorrang vor Katalogvorschlag. **Expertenmodus:** erweiterte Ansichten. **Testdaten:** erfundene Beispiele, jederzeit entfernbar. **Phase (A bis D):** Zutatengruppe im Rezept. **RZF:** Ranziditätsfaktor. **WAS:** waschaktive Substanz.

---

## 8. Aufgaben-Rezepte
1. **Neuen Rohstoff anlegen:** `Neuer Rohstoff` → Name tippen → Katalogvorschlag wählen → Speichern; Menge über „Bestand ändern“ eintragen.
2. **Rohstoff aus Foto/Produktseite:** `Eingabe › Produktseite lesen` → Kamera oder Galerie → Auslesen → Vorschau prüfen → übernehmen.
3. **Vorhandenes erfassen:** `Übersicht › Regal-Check` → Kategorie → markieren → „Alle übernehmen“.
4. **Preise nachtragen:** Artikelseite › Bezugsquellen & Preise › Eintrag; viele auf einmal über `Mehr › Import`.
5. **Fehlende Werte finden:** `Lager › Liste › Lücken finden`.
6. **Rezept eintragen:** `Neues Rezept` → Zutaten, Phasen, Ablauf → Speichern (Version 1).
7. **Rezept aus Text/Foto:** `Rezeptbuch › Mehr › Import` → Entwurf prüfen → Speichern.
8. **Rezept ändern:** Rezeptseite › Bearbeiten → Speichern mit Notiz (neue Version).
9. **Mischen und bewerten:** Rezeptseite › Mischen → abhaken, Ist-Gewichte → Abschluss (Lager abziehen?) → Charge › Sterne.
10. **Rezept umrechnen:** `Rechner › Rezept umrechnen` → Rezept, Zielmenge → als Entwurf/neue Version.
11. **Seife planen:** `Rechner › Kaltverseifung` → Öle → Laugenunterschuss → „Vorschlag aus meinem Bestand“ möglich.
12. **Sichern:** `Mehr › Einstellungen › Sichern und zurücknehmen`.

---

## 9. Technische Zuordnung (nur für Chats und Werkzeuge)
| Ansicht | Interner Name (`R.name`) / Funktion |
|---|---|
| Lager-Übersicht, Liste | `lager` (`Q.view`, `Q.seg`, `Q.cat`, `Q.gap`) |
| Eingabe | `scan` (`camStart`, `sheetProduct`, `handleCode`) |
| Neuer Rohstoff | `sheetNeu`, `saveNeu` |
| Artikelseite | `artikel` (`R.edit`, `saveArt`, `sheetMenge`, `sheetVessel`, `sheetBezug`) |
| Einkauf | `einkauf` |
| Statistik | `stat` |
| Regal-Check | `check` |
| Etiketten, Import, Export, Lagerorte | `sheetLabels`, `sheetImport`, `sheetExpOpen`, `sheetLagerSet` |
| Einstellungen | `sheetAppSet`, `sheetSettings`, `sheetSetSich`, `sheetCatUpd`, `sheetSetMengen`, `sheetSetHilfe`, `sheetSetExp`, `sheetSetTest` |
| Rezepte Liste, Rezeptseite | `rez` (`rzList`), `rezv` (`rzOpen`) |
| Versionen | `verl` |
| Editor | `reze` (`rzEdit`) |
| Werkbank | `misch` |
| Chargen | `chgs`, `chg` |
| Rechner-Hub | `bau` (`RCHT`, `rzBau`, `RCX`) |
| Rezeptbuch Mehr | `sheetMehr` (Rezeptbuch), `sheetRzImport`, `sheetRzExport`, `sheetRzShare`, `sheetRzSet`, `rzStatSheet` |
| Spalten, Sortierung, Lücken | `COLS`, `SORTS`, `GAPS`, `VW`, `APPL`; `sheetCols`/`sheetColsX2`, `pickSort`, `pickGap` |
| Schlagwörter | `TAGS_BASE`, `S.tags`, `i.tags` |
Navigation: `tab(name)`, `go(name,id)`, `back()`, `rzWorld('lager'|'rez')`. Quellen: `src/proto/js*.js`.

---

## 10. Noch nicht erfasst (Lücken dieses Entwurfs)
Detailansichten und Unterdialoge, die der Erstentwurf nicht durchlaufen hat: Charge-Detail, Werkbank im Einzelnen, Module & Ablauf (Standard-Ablauf bearbeiten), Rezeptkarte/Rezepte & Chargen drucken, Rezept-Statistik, Anleitung und Info im Wortlaut, Bestand-ändern-Dialog (zwei Felder, Zu-/Abgang), Gefäß-Dialog, Bezugsquellen-Dialog, Produktseiten-Vorschau. Die Katalog-Funktionen („Katalog aktualisieren“) und die Rechner-Eingabefelder im Einzelnen sind nur oben im Überblick beschrieben. Dieser Abschnitt wird beim nächsten Durchlauf abgearbeitet; ein Build-Test, der Spalten, Rechner und Menüs gegen die Datei prüft, ist vorgesehen (Konzept 4.3).


## Nachtrag: Bewertung in der Charge (07.11.2026)
Die Chargenansicht hat unter den Notizen den Block "Bewertung" (aufklappbar): vier Kriterien (Konsistenz, Duft, Aussehen, Hautgefühl) je 1 bis 5 Punkte, eine Liste der Nachbewertungen und "Nachbewertung hinzufügen" (Datum, Sterne, Kriterien, Notiz). Die Chargenliste zeigt die Sterne der jüngsten Nachbewertung, sonst die Erstbewertung. Daten: c.k, c.bew[].


## Nachtrag: KI-Funktionen (07.11.2026)
Mehr › Einstellungen › KI-Funktionen: Modell und Schlüssel eintragen, "Schlüssel prüfen", "Schlüssel entfernen". Ist die KI freigeschaltet, erscheint im Mehr-Menü unter "KI" der Eintrag "App-Guide" (Frage eintippen, Antwort lesen; gesendet werden nur Frage und App-Beschreibung). Im Expertenmodus unter Testbetrieb gibt es zusätzlich "KI-Testsatz laden/entfernen".


## Nachtrag: Auffälligkeiten (07.11.2026)
Statistik hat die Kachel "Auffälligkeiten" (Anzahl und die zwei wichtigsten). Tippen öffnet die Tabelle: je Rezept (Zutatentausch mit Bewertung davor und danach, Einwaage-Abweichung, sinkende Bewertung, zu wenig Chargen), dann Preise und Lieferanten, dann Bestand (abgelaufen). Oben stellst du die Toleranz bei der Einwaage in Gramm ein. Die Hinweise sind keine Urteile.
Im Menü KI-Funktionen kannst du das Modell per Tipp wählen oder einen eigenen Namen eintragen.

## Nachtrag: Rezept-Chat und Meine Regeln (07.11.2026)
- Mehr › Rezept-Chat (nur bei KI an): Blatt mit Verlauf, Eingabefeld, Senden, Neuer Chat. Unter KI-Antworten: "Als Regel merken". Karten: Seifenrechnung, Rezeptvorschlag (Als Entwurf öffnen), Einkaufsliste (Auf die Einkaufsliste).
- Mehr › Einstellungen › KI-Funktionen › Meine Regeln: Liste eigener Regeln, neue Regel, Löschen.
- Rezeptversion kann ein Feld chat (Markdown des Gesprächs) tragen, S.kiRegeln neu, beides optional.
