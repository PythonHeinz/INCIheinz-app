# INCIheinz – Konzept KI-Funktionen

**Status:** Entwurf in Abschnitten (07.11.2026), noch kein Code. Wird abschnittsweise mit dem Entwickler abgestimmt; Kommentare stehen am Ende jedes Abschnitts. Erst nach seinem „Go“ wird gebaut.
**Zweck:** Alle Chats sollen wissen, was bei KI geplant ist, warum und in welcher Reihenfolge. Bis zum Go ändert sich am App-Code nichts.
**Rückfallstand:** Die letzte Fassung ohne KI bleibt unverändert erhalten (Abschnitt 8).

---

## 1. Leitbild und Grundsätze

### 1.1 Was KI hier sein soll
KI ist in INCIheinz kein Chatfenster, das auf alles antwortet, sondern ein Helfer für die **Datenpflege und die Rezeptarbeit**. Der Engpass einer Rohstoff- und Rezeptdatenbank ist nicht die Abfrage, sondern dass Daten nicht gepflegt werden, weil niemand gern abtippt. KI lohnt sich dort, wo aus unstrukturierten Eingaben (Handschrift, Foto, Fließtext, Händlerseite) strukturierte Daten werden und der Nutzer nur noch bestätigt.

### 1.2 Was keine KI braucht
Alles, was die App mit Filtern und Regeln schon kann, bleibt Regelwerk: „Habe ich noch Sheabutter?“, Lagerfilter, Dosierungsprüfung, Summenprüfung, Haltbarkeit, Preisvergleich, Rechner. Gründe: schneller, nachvollziehbar, offline, privat, kein unnötiger Energieverbrauch. Das Regelwerk ist immer R1, KI kommt erst danach und nur bei Bedarf.

### 1.3 Die vier Funktionsgruppen (Überblick, Details in den Abschnitten 3 bis 6)
| Gruppe | Kurz | Nutzen |
|---|---|---|
| A Erfassen | Handschriftliche Rezepte, Fotos, Texte und Tabellen werden zu Rezept (Phasen, Schritte, Hinweise) und werden Lagerartikeln zugeordnet | größter Hebel, weil Datenpflege der Engpass ist |
| B App-Guide | Die KI kennt die Landkarte der App und erklärt, wo etwas zu finden ist und welche Formate gehen | Einstieg, Anleitung, weniger Rückfragen |
| C Auswerten | Muster und Abweichungen in Chargen, Versionen, Preisen und Bewertungen erkennen und erklären | setzt gepflegte Daten voraus |
| D Rezept-Chat | Rezepte per Chat oder Sprache entwickeln, mit Lager- und Katalogartikeln, vom Rechner geprüft; Mischbarkeit nach Bestand | Endausbau |

### 1.4 Grundsätze (verbindlich für alle KI-Funktionen)
1. **Regeln vor KI.** Erst Filter, Regelwerk und lokale Suche, dann KI. KI-Aufruf nur, wenn die Regeln nicht reichen.
2. **Der Mensch bestätigt.** Die KI schreibt nie still in den Zustand `S`. Jede Änderung geht über einen Vorschlag mit Vorher/Nachher und eine Bestätigung. Das entspricht dem heutigen Muster („Übernehmen?“, Entwurf im Editor, Speichern nur per Knopf).
3. **Der Rechner rechnet.** Mengen, Verseifung, Überfettung, HLB, WAS, Kosten und Summen berechnet ausschließlich der Code der App. Die KI schlägt Zutaten und Anteile vor, der Rechner prüft und meldet Fehler zurück.
4. **Gesamtmenge bleibt Wahrheit.** `i.total` bleibt die einzige Mengenquelle. Die KI ändert keine Mengen am Lager; Lagerabzug nur über den bestehenden Weg (`rzTake`, mit Bestätigung).
5. **IDs statt Namen.** Die KI bekommt und liefert Artikel-IDs bzw. Katalog-IDs (`cid`), keine freien Namen. Was nicht zuordenbar ist, wird als „nicht zugeordnet“ gezeigt und vom Nutzer gewählt.
6. **Grenzen im Code.** Einsatzbereiche (`dmin/dmax`, `e0/e1`), Laugenunterschuss und Sicherheitsgrenzen bei Seife werden im Code geprüft. Ein Vorschlag außerhalb der Grenzen wird nicht angezeigt oder deutlich markiert.
7. **Keine Wirk- oder Gesundheitsversprechen.** Gilt auch für KI-Texte. KI-Antworten werden vor der Anzeige gegen eine Sperrliste geprüft und im Prompt entsprechend angewiesen. Bei Laugen und Seife immer der Sicherheitshinweis, keine Zusage „garantiert sicher“.
8. **Vorschläge sind gekennzeichnet.** Von der KI stammende Werte erreichen höchstens Stufe 1; durch Übernahme des Nutzers werden sie Stufe 2, als verifiziert gelten sie erst nach seiner Bestätigung (Stufe 3, siehe 1.7). Quelle und Herkunft („KI-Vorschlag“, Modell, Datum) werden am Wert vermerkt.
9. **Datenschutz offen sagen.** Sobald Daten an einen Cloud-Dienst gehen, gilt der Satz „Daten bleiben auf dem Gerät“ für diese Anfrage nicht. KI-Funktionen sind deshalb **standardmäßig aus** und schaltbar (Mehr › Einstellungen); vor der ersten Nutzung steht ein klarer Hinweis, welche Daten gesendet werden. In der Testphase nutzt der Entwickler sein eigenes Konto; vor einer Veröffentlichung wird neu entschieden, welche Daten die App sendet (siehe Abschnitt 9).
10. **Funktioniert auch mit wenig Daten.** Der Dashboard-Status (rot/gelb/grün) sperrt die KI nicht. Bei rot/gelb zeigt sie den Hinweis „Ergebnisse sind begrenzt, weil Daten fehlen“ und nennt, welche Lücken (z. B. fehlende Seifenwerte) die Antwort verschlechtern. Besonders A (Erfassen) soll von Anfang an nutzbar sein.
11. **Nur Hilfsmittel.** Die App ersetzt keine Fachprüfung (Sicherheitsbewertung, Kosmetikrecht). Das steht in den Hinweisen, nicht in jedem Satz.

### 1.5 Rechenstufen (R0 bis R2)
| Rechenstufe | Was | Beispiel | Kosten/Energie |
|---|---|---|---|
| R0 | Regelwerk im Code | Filter, Lückenfinder, Rechner, Parser | keine |
| R1 | Kleines lokales Modell (z. B. 2–3B per Ollama) | Texte gliedern, einfache Zuordnung, App-Guide | niedrig, privat |
| R2 | Großes Cloud-Modell (z. B. Gemini Flash) | Bild-/Handschrifterkennung, Rezeptentwurf, Auswertung mit Schlüssen | höher, Daten verlassen das Gerät |
Jede Funktion legt fest, ab welcher Rechenstufe sie sinnvoll ist (Tabelle in Abschnitt 2). Der Nutzer kann je Funktion die höchste erlaubte Rechenstufe wählen.

### 1.6 Abgrenzung zum Bestand
Die App hat bereits ein Regelwerk für Import: Text-, Foto- und Datei-Import mit Bestätigung (`rzParse`, `splitMods`, OCR im Ordner `ocr/`, Rezept-Import als Text/Foto/json), den Lückenfinder und die Dosierungsprüfung. KI ersetzt diese nicht, sondern **hängt sich als zusätzliche Rechenstufe in dieselbe Bestätigungsstrecke**. Dadurch bleibt die Berührung des Grundgerüsts klein.

### 1.7 Vertrauensstufen: Was als verifiziert gilt (Beschluss 07.11.2026, präzisiert)
Es gelten die Validierungsstufen aus `KATALOG_ERWEITERUNG.md` (Stufe 1 eine Quelle, Stufe 2 zwei unabhängige Quellen, Stufe 3 vom Nutzer bestätigt). Für alles, was die KI liefert:
| Stufe | Bedeutung | Wo sichtbar | Wer setzt sie |
|---|---|---|---|
| **1** | KI-Vorschlag oder KI-Recherche, **vor** der Übernahme. Mehr kann die KI allein nie erreichen. | nur in der **Vorschau** (mit Haken zum Übernehmen), nicht im Artikel | KI |
| **2** | Der Nutzer hat den Wert mit Haken **übernommen**. Ebenso zählen Katalogwerte mit zwei unabhängigen Quellen. | **in den Eingabe- und Wertfeldern des Artikels, grau** (unbestätigt, aber mit dem der Nutzer arbeiten und rechnen kann) | Nutzer (Übernehmen) bzw. Katalog |
| **3** | Der Nutzer hat den Wert **geprüft und bestätigt** oder selbst eingetragen bzw. überschrieben. Erst jetzt gilt er als verifiziert. | **schwarz** (Siegel) | Nutzer (Bestätigen/Überschreiben) |
Grundsätze:
- Übernommene KI-Werte sind sofort nutzbar (Rechner, Listen, Filter), bleiben aber **grau**, bis der Nutzer sie bestätigt oder überschreibt. Der Nutzer entscheidet selbst, welche Werte er mit Stufe 3 auszeichnet und welche grau mitgerechnet werden.
- Grau ist die bestehende Darstellung für Vorschlagswerte (Katalog) und wird hier erweitert: grau = unbestätigt (Stufe 2), schwarz = bestätigt oder eigener Wert (Stufe 3).
- **Stufe 2 gilt nicht als verifiziert.** Qualitätsanzeige (Dashboard rot/gelb/grün), Vollständigkeit und die Gewichtung in Funktion C und D unterscheiden „ausgefüllt“ von „bestätigt“. Ein Lückenfilter „KI-Werte, noch nicht bestätigt“ zeigt, was noch zu prüfen ist.
- **Rezepte** laufen genauso: KI-Entwurf in der Vorschau (Stufe 1), gespeichert als „KI-Entwurf, nicht geprüft“ (Stufe 2), nach Mischen und gutem Ergebnis vom Nutzer bestätigt (Stufe 3; die App bietet den Knopf an, entscheidet aber nie selbst).
- **Bestätigen** geschieht per Knopf nach dem Muster von „INCI als geprüft bestätigen“ (`inciConfirm`); der Dialog nennt, wo der Wert verwendet wurde und wie die Charge bewertet ist. Die Herkunft („KI, Modell, Datum“) bleibt auch nach Stufe 3 am Wert sichtbar.
- **Datenmodell (additiv):** je betroffenem Wert Stufe, Quelle, Modell und Datum (Umsetzung beim Bau; die Katalogfelder `eq`/`bq` kennen Herkunft und Validierungsstufe bereits).
- „Stufe“ meint in diesem Papier immer diese Validierungsstufen. Die Rechenstufen heißen R0 bis R2.

### Kommentare zu Abschnitt 1
- 07.11.2026, Entwickler: Nachdem KI-Werte und KI-Rezepte als „ungeprüft“ bzw. „durch KI erstellt“ gekennzeichnet sind, soll der Nutzer sie nach dem Mischen und erfolgreichem Test bestätigen können; dann erreichen sie „Stufe 2“. → eingearbeitet in 1.7; Benennung der Stufen ist offen (siehe dort).

---

## 2. Architektur (gemeinsame Grundlage für A bis D)

### 2.1 Eine Dienst-Schicht, austauschbare Anbieter
Neue Datei `js33.js` (KI-Dienst) mit einer einzigen Schnittstelle, z. B. `ki.ask({funktion, kontext, werkzeuge, bild})`. Dahinter Anbieter-Adapter:
- `gemini` (Cloud, direkter `fetch()` aus dem Browser, Modellname als Einstellung, damit Modellwechsel keine Codeänderung braucht),
- `ollama` (lokal, passend zu Heinz UI; ob der Zugriff aus der PWA auf Termux auf dem Pixel sauber läuft, wird vor dem Bau getestet),
- `aus` (Standard).
Alle Funktionen sprechen nur die Schnittstelle an; welcher Anbieter antwortet, ist Einstellung.

### 2.2 Einstellungen
Neuer Eintrag „KI-Assistent (experimentell)“ in der Einstellungsliste (`js30.js`, Mechanik `SNAV`). In der Testphase nur bei eingeschaltetem Expertenmodus sichtbar; das Mehr-Menü selbst bleibt unverändert. Inhalt: Schalter je Funktion (A bis D), Anbieter und Modellname, API-Schlüssel, Datenhinweis, Tageslimit für Anfragen, Knopf „Was wird gesendet?“ (Vorschau des Kontextpakets).

### 2.3 API-Schlüssel
- **Nicht in `S`.** `S` wandert in Sicherung, Export und Teilen; der Schlüssel darf dort nie landen. Eigener `localStorage`-Schlüssel, von Sicherung und Wiederherstellung ausgenommen.
- Der Entwickler trägt den Schlüssel selbst in das Einstellungsfeld ein. Er wird nie im Chat, im Repo, in Testskripten oder in `ENTWICKLUNGSVERLAUF.md` genannt.
- In Google AI Studio den Schlüssel auf die App-Adresse und ein Kontingent beschränken.
- Die Tests laufen mit gemocktem `fetch`, ohne echten Schlüssel.

### 2.4 Kontextpakete (Datenminimierung)
Je Funktion baut ein Kontext-Builder ein schlankes JSON aus `S` und dem Katalog. Nur, was die Funktion braucht:
- Artikel: ID, Katalog-ID, Name, INCI, Kategorie, Bestand > 0 (ja/nein, Menge in Basiseinheit), Dichte, Einsatzbereich (`dmin/dmax`, `e0/e1`), Seifen- und Tensidwerte, Tags.
- Nicht standardmäßig: Preise, Lieferanten, Fotos, Notizfelder (nur wenn eine Funktion sie ausdrücklich braucht, z. B. C).
- Rezept: Phasen, Zutaten mit ID und Gramm, Ablauf, Version, Bewertung.
- 180 Artikel passen problemlos in eine Anfrage; bei mehr wird nach Funktion/Kategorie vorgefiltert (Regel vor KI).

### 2.5 Werkzeuge (Function Calling)
Es gibt **keine schreibenden Werkzeuge**. Die KI darf nur:
- **Lesen/Rechnen lassen** (die App führt aus und gibt das Ergebnis zurück): `lager_suche`, `katalog_suche`, `artikel_details`, `rezept_lesen`, `chargen_lesen`, `rechne_dosierung`, `rechne_emulgator`, `rechne_seife` (Kaltverseifung), `summen_check`.
- **Vorschläge abgeben** (landen nur in der Vorschau): `vorschlag_rezept` (Struktur wie Rezeptmodell `d`: Phasen, Zutaten mit ID und Gramm, Module), `vorschlag_artikelwert` (Artikel-ID, Feld, Wert, Quelle, Begründung).
Die Schleife (KI ruft Rechner, Rechner antwortet, KI korrigiert) ist auf wenige Runden begrenzt.

### 2.6 Prüfer vor der Anzeige
Jeder Vorschlag läuft durch `kiCheck()`: IDs existieren, Mengen positiv, Summe passt zur Gesamtmenge, Dosierung innerhalb des Bereichs, Seifenregeln (Laugenunterschuss, Verseifungszahlen vorhanden), Sperrliste für Wirk- und Gesundheitsaussagen im Text. Ergebnis: in Ordnung / mit Warnung / abgelehnt (dann geht die Fehlermeldung zurück an die KI oder wird dem Nutzer erklärt).

### 2.7 Vorschau und Übernahme (ein Muster für alles)
Eine gemeinsame Vorschau `kiPreview`: Vorher/Nachher, Warnungen aus dem Prüfer, Quelle („KI-Vorschlag, Modell, Datum“). Übernahme öffnet wie beim Rezept-Import (`rzImportOpen`) einen **Entwurf im Editor**; gespeichert wird nur mit „Speichern“ (neue Version, Notiz „aus KI-Vorschlag“). Artikelwerte werden als „KI-Vorschlag, ungeprüft“ gesetzt und erst durch den Nutzer bestätigt.

### 2.8 Wissen und Recherche
- **Wissensbasis in der App:** überarbeitete, komprimierte Texte aus der Fachliteratur und eigene Regeln (Abschnitt 6), durchsuchbar und der KI als Kontext zugänglich. Nur eigene Zusammenfassungen, keine Buchtexte (Urheberrecht).
- **Websuche:** nur bei Cloud-Anbieter und eingeschalteter Funktion (z. B. Gemini mit Suchanbindung). Antworten tragen Quellenangaben. Eine Recherche wird nie automatisch zur Regel; „Als feste Regel merken“ legt nach Bestätigung einen Eintrag in der Wissensbasis an, damit später nicht erneut gesucht werden muss.

### 2.9 Fehlerverhalten und Kostenschutz
Kein Netz, falscher Schlüssel, Kontingent leer, Zeitüberschreitung: klare Meldung, die App arbeitet unverändert weiter. Keine stillen Wiederholungen, Tageslimit, Anzeige der Anfragen heute. Ist KI aus, findet **kein einziger Netzwerkaufruf** statt (Testfall).

### 2.10 Eingriffe ins Grundgerüst (für STAND.md „Berührt Grundgerüst“)
Neu: `js33.js` (Dienst, Kontext-Builder, Prüfer), `js34.js` (Oberfläche, Vorschau), Eintrag in der Einstellungsliste (`js30.js`), Einstiegsknöpfe (Import-Dialog, Rezeptseite, Hilfe), Ausnahme des KI-Schlüssels in Sicherung und `restoreMerge`, Übersetzungen in `i18n7.py`, Tests ab t101. Die Anbindung an `patch7.py`/Build-Reihenfolge ist beim Bau zu prüfen (Fallstrick: spätere Dateien überschreiben frühere Funktionen).

### Kommentare zu Abschnitt 2
(noch keine)

---

## 3. Funktion A: Erfassen (Rezepte und Artikel)

### 3.1 Ziel
Der Nutzer muss nicht lesen und tippen. Ein handschriftliches Rezept, ein Foto, ein Text aus der Zwischenablage oder eine Händlerseite wird zu einem **Vorschlag** im Datenmodell der App; der Nutzer prüft und bestätigt. Das ist der Hebel gegen das Kernproblem jeder Datenbank: ungepflegte Daten.

### 3.2 Was schon da ist (R0, bleibt erste Wahl)
Text-, Foto- und Dateiimport mit Bestätigung: Rezept-Import als Text/Foto/json (`rzParse`, `rzImportRun`, `rzImportPrev`, `rzImportOpen` in `js23.js`, `splitMods` in `js31.js`), lokale Texterkennung (Tesseract im Ordner `ocr/`), Artikelimport aus Tabellen (`COLMAP` in `js7.js`), Katalogabgleich. KI ergänzt nur dort, wo diese Regeln scheitern: schlechte Fotos, Handschrift, ungewohnte Formate.

### 3.3 Ablauf Rezept-Erfassung
1. **Eingabe:** Foto (Kamera/Galerie), Text oder Datei im vorhandenen Import-Dialog.
2. **R0:** vorhandene Regeln lesen, Ergebnis mit Güte bewerten (Anteil erkannter Zutaten, Summe plausibel, Warnliste `warn`).
3. **Angebot, kein Zwang:** Ist die Güte schlecht, erscheint „Mit KI genauer lesen“. Es wird nichts automatisch an die Cloud gesendet.
4. **KI-Aufruf:** Bild oder Text plus Kandidatenliste der Artikel. Aufgabe: Rezept in das Rezeptmodell (`d`) zerlegen: Name, Zweck, Phasen (A/B/C/D), Zutaten mit Rohbezeichnung, Menge und Einheit, Arbeitsschritte, Hinweise, Haltbarkeit, Abfüllung.
5. **Zuordnung zu Artikeln:** zuerst lokale Ähnlichkeitssuche (Name, INCI, Synonyme, Tags, Katalog). Die KI wählt nur aus den Kandidaten oder meldet „keiner passt“, nie freie Namen. Statusampel je Zeile: sicher / bitte prüfen / nicht gefunden. Bei „nicht gefunden“ wählt der Nutzer: Lagerartikel, Katalogartikel anlegen oder ohne Lagerbezug (z. B. Wasser).
6. **Einheiten:** Prozent, Gramm, ml, Löffel, „Teile“ rechnet die App um (ml nur mit Dichte); Unklares wird markiert, nicht geraten.
7. **Prüfer** (Abschnitt 2.6): Summe, Phasen, Dosierung, fehlende Konservierung als Hinweis.
8. **Vorschau, Entwurf, Speichern** nach dem gemeinsamen Muster (2.7). **Das Originalfoto wird nicht gespeichert** und nach der Übernahme oder dem Verwerfen gelöscht (Beschluss 07.11.2026); es gibt dafür in der ersten Version keine Option. Am Rezept bleibt nur der Vermerk „aus Foto/Handschrift erfasst“.

### 3.4 Module und Sicherheitshinweise
Arbeitsschritte, Hinweise (Achtung/Tipp/Sicherheit), Haltbarkeit und Abfüllung werden als Module vorgeschlagen. Die KI übernimmt Hinweise aus der Vorlage, **ergänzt aber keine eigenen Wirk- oder Gesundheitsaussagen**. Sicherheitshinweise, die die App von sich aus ergänzt (z. B. bei Lauge), kommen aus festen App-Texten, nicht von der KI.

### 3.5 Artikel-Erfassung
Quellen: Produktseite (Text), Foto von Etikett oder Datenblatt, Rechnung/Bestellung. Zielfelder: INCI, Form, Dichte, Einsatzbereich, Preis, Menge, Lieferant, Datum, Charge/MHD, Beschreibung. Gleiche Strecke: erst die vorhandenen Regeln, KI als Fallback, Vorschau mit Haken je Feld. Werte sind „ungeprüft“; INCI bleibt ungeprüft, bis der Nutzer bestätigt (bestehende Regel). Rechnungen werden in 3.10 beschrieben.

### 3.6 Modellstufen
- Bild und Handschrift: **R2** (Cloud). Kleine lokale Modelle erkennen Handschrift nicht verlässlich. Vor dem Senden steht der Hinweis, dass das Foto an den Anbieter geht.
- Reiner Text (Gliederung, Zuordnung): **R1** (lokal) möglich und wählbar.

### 3.7 Qualität und Test
Testsatz aus etwa zehn Beispielen (verschiedene Handschriften, Bildschirmfotos, Fließtext, Tabelle) mit Sollergebnis. Messwerte: Anteil richtig erkannter Zutaten und Mengen, Zuordnungsquote, Anteil „bitte prüfen“. Der Originaltext bleibt im Entwurf einsehbar, es geht nichts verloren. Playwright-Tests mit gemockter Antwort prüfen den Ablauf, nicht die Erkennungsqualität; die Qualität misst der Entwickler mit echten Vorlagen.

### 3.8 Hinweise und offene Fragen
- Gedacht ist die private Nutzung für den eigenen Bestand; die Hilfe sagt das knapp, ohne Rechtsberatung.
- Beschlossen (07.11.2026): Originalfotos werden nicht dauerhaft gespeichert. Erst nach einer Store-Portierung (mehr Speicherplatz) wird neu entschieden.
- Offen: Mehrseitige Rezepte (mehrere Fotos in einer Anfrage)? Umgang mit Rezepten, die Zutaten ohne Menge nennen („etwas Öl“)?
- Für die Erfassung des Bestands (180 Zutaten, morgen) ist A nicht nötig; dort reicht der vorhandene Import.

### 3.9 Teilschritte
A1 Rezept aus Text · A2 Rezept aus Foto/Handschrift · A3 Artikel aus Text/Foto · A4 Rechnungen mit mehreren Positionen, auch rückwirkend (3.10).

### 3.10 Rechnungen und rückwirkende Preise (A4, Wunsch des Entwicklers)
Digitale Rechnungen (PDF, Foto, Text aus einer E-Mail, Tabelle) können jederzeit eingelesen werden; die Preise werden **mit dem Rechnungsdatum** in den Preisverlauf der Artikel eingetragen, auch für zurückliegende Rechnungen.
1. **Eingabe:** eine oder viele Dateien nacheinander. Je Rechnung eine Vorschau, am Ende eine Sammelbestätigung.
2. **Positionen:** Bezeichnung, Menge, Einheit, Einzel- oder Gesamtpreis, Rechnungsdatum, Lieferant, Rechnungsnummer, Versandkosten.
3. **Zuordnung** zu Artikeln wie in 3.3 (lokale Ähnlichkeit zuerst, Ampel, Nutzer wählt bei Unsicherheit). Der Preis wird als Bezugsquelle mit Datum am Artikel eingefügt; Preis je 100 g/ml rechnet die App aus (Rechner, nicht KI). Herkunftsvermerk „aus Rechnung vom …“.
4. **Bestand wird dabei nicht verändert** (Standard: aus). Alte Rechnungen dürfen den heutigen Lagerbestand nicht erhöhen. „Bestand buchen“ ist nur für eine aktuelle Lieferung gedacht und muss ausdrücklich gewählt werden.
5. **Doppelte vermeiden:** Gemerkt werden Lieferant, Rechnungsnummer und Datum (additives Feld); eine schon erfasste Rechnung wird erkannt und nicht doppelt eingetragen.
6. **Versandkosten und Rabatte:** getrennt ausweisen und nicht stillschweigend auf Artikelpreise umlegen; Positionen mit Rabatt oder Paketpreis werden als „bitte prüfen“ markiert.
7. **Datenschutz, lokale Vorfilterung (beschlossen 07.11.2026, Version 1):** Rechnungen enthalten Name, Adresse, Kundennummer, Bankdaten. Der Text (digitaler PDF-Text oder lokale Texterkennung, OCR) wird **lokal vorgefiltert, bevor etwas gesendet wird**: Er wird auf die wesentlichen Artikeldaten beschnitten, nämlich Bezeichnung, Menge, Einheit, Preis (Einzel und Gesamt), Datum, Lieferant, Rechnungsnummer; Gramm, Mengen und Preise bleiben natürlich erhalten. Adress-, Konto-, Telefon- und Kundendaten werden verworfen. Vor dem Senden zeigt die App, was gesendet wird. Nur bei Fotos ohne lokale Texterkennung ginge das Bild vollständig an den Anbieter (R2); das wird vorher gesagt. Dieselbe Vorstufe gilt für „Produktseite lesen“.
8. **Das Rechnungsfoto wird wie Originalfotos nicht gespeichert** (Beschluss zu 3.3).

### Kommentare zu Abschnitt 3
- 07.11.2026, Entwickler: Rechnungen kommen meist digital; sie sollen jederzeit zu allen Artikeln eingelesen werden und anhand des Rechnungsdatums rückwirkend Preise eintragen; viele Rechnungen liegen schon vor. → eingearbeitet in 3.10.

---

## 4. Funktion B: App-Guide und Landkarte der App

### 4.1 Ziel
Der Nutzer fragt „Wie lege ich …?“, „Wo finde ich …?“, „Welche Formate kann ich importieren?“ und bekommt eine Antwort samt Knopf, der an die richtige Stelle springt. Der Guide **erklärt nur und ändert nichts**.

### 4.2 Die Landkarte: `src/APP_LANDKARTE.md`
Eine Textdatei, die Struktur und Funktion der App beschreibt, für Menschen, andere Chats und die KI gleichermaßen lesbar. Sie wird mit diesem Konzept zusammen angelegt (eigenes Dokument, erster Entwurf aus dem Code). Aufbau:
1. **Navigation:** Lager-Leiste, Rezeptbuch-Leiste, Mehr-Menüs, Einstellungsliste, Wechsel Lager | Rezeptbuch.
2. **Eintrag je Ansicht:** Pfad (z. B. „Lager › Artikel › Menü Seifenwerte“), interner Name (`R.name`), Zweck, Elemente (Knöpfe, Kacheln, Felder, Filter, Spalten), Aktionen, beteiligte Datenfelder, Voraussetzungen, „siehe auch“.
3. **Rechner-Hub:** je Rechner Zweck, Eingaben, Ergebnis, benötigte Artikelwerte.
4. **Formate:** Import, Export, Sicherung (Text, Foto, CSV/Excel, json, PDF) mit dem, was jeweils erwartet wird.
5. **Begriffe:** kurzes Glossar (Gesamtmenge, Anker, Mischbar, ungeprüft, Expertenmodus …).
6. **Aufgaben-Rezepte:** typische Abläufe in Schritten („Neuen Rohstoff aus Foto anlegen“, „Rezept umrechnen“).
Die Beschreibung ist **implementierungsneutral** formuliert, damit sie nach einem Umbau (SQLite, native App) weiter gilt.

### 4.3 Pflege und Prüfung
- Teilweise **automatisch aus dem Code** erzeugt (Skript im Repo): Tab-Listen, Rechner-Hub (`RCHT`), Spalten (`COLS`), Lückenfilter (`GAPS`), Sortierungen (`SORTS`), Schlagwörter (`TAGS_BASE`), Einstellungsliste. Die erklärenden Texte sind von Hand geschrieben.
- **Build-Prüfung:** Taucht ein Rechner, eine Spalte oder ein Menüeintrag im Code auf, der in der Landkarte fehlt, warnt der Build.
- **Neue Arbeitsregel (beschlossen 07.11.2026, in `UEBERGABE.md` aufgenommen):** Wer eine Ansicht, ein Menü oder ein Datenfeld ändert, dokumentiert das im selben Commit in der Landkarte.

### 4.4 Wie der Guide antwortet
1. **R0:** Volltextsuche in der Landkarte (ohne KI) als Hilfe-Suche; liefert Treffer mit Sprungknopf.
2. **R1 (lokal) oder 2:** Die KI bekommt Frage, aktuelle Ansicht (`R.name`) und einen Auszug der Landkarte (nach Stichworten gewählt, klein gehalten). Antwort kurz, mit „Gehe zu …“-Knopf, der eine vorhandene Navigationsfunktion aufruft. Die KI klickt nie selbst.
3. Antwort in der Sprache der App (DE/EN/ES). Die Landkarte ist deutsch; die Übersetzung übernimmt das Modell.
4. Kein Kontext aus Nutzerdaten nötig: Der Guide sendet **keine Lager- oder Rezeptdaten**, nur Frage, Ansicht und Landkartenauszug. Er ist die datenschutzärmste KI-Funktion und eignet sich als erste Probe für Dienst-Schicht und Einstellungen.

### 4.5 Eingriffe
Hilfe-Seite (Einstellungen › Hilfe) bekommt Suchfeld und „Frag die App“; Landkarte wird beim Build als Textdatei eingebunden (Größe klein halten, Ziel unter etwa 10 000 Token im Auszug); Sprungknöpfe nutzen vorhandene Navigation (`go`).

### 4.6 Grenzen
Fachfragen zu Rezepten und Rohstoffen („Ist Zutat X geeignet?“) gehören nicht in den Guide, sondern in Funktion C und D. Der Guide sagt dann, wo man das findet.

### Kommentare zu Abschnitt 4
(noch keine)

---

## 5. Funktion C: Auswerten, Muster und Alternativen

### 5.1 Ziel
Aus gepflegten Daten (Chargen, Bewertungen, Versionen, Preise) Auffälligkeiten finden und erklären: „Seit drei Chargen gefällt dir die Creme weniger; der Unterschied zu den guten ist …“. Voraussetzung ist, dass die Daten dafür **erfasst** werden. Das entscheidet sich ab dem Start der echten Erfassung (siehe 5.5).

### 5.2 R0: Auffälligkeiten ohne KI (Regeln und Statistik)
- **Einwaage-Abweichung:** Soll gegen Ist je Zutat in der Charge (`lines[].soll/ist`), Auffälligkeit ab einer einstellbaren Toleranz.
- **Zutatentausch:** andere Artikel-ID in `lines[].item` zwischen Chargen oder Versionen desselben Rezepts.
- **Versionsunterschied:** Differenz in Gramm zwischen Versionen (`rzDiff`), gegenübergestellt zu den Bewertungen (`stars`, `st` fav/bad).
- **Preis und Bezug:** Preisänderung mit Datum (Preisverlauf besteht), Lieferantenwechsel.
- **Bestand:** Reichweite, Ladenhüter, abgelaufene Ware.
Ausgabe als Tabelle „Auffälligkeiten“ je Rezept und als Dashboard-Kachel. Das ist die Grundlage, auf der die KI später nur noch erklärt.

### 5.3 R1: lokales Modell
Fasst die Auffälligkeiten in lesbare Sätze, sortiert nach Wichtigkeit, formuliert Rückfragen („Welche Charge war die letzte gute?“). Kein Schlussfolgern über Ursachen.

### 5.4 R2: Schlüsse mit Belegen
Das Cloud-Modell bekommt die Auffälligkeitstabelle und die Bewertungen und liefert **Hypothesen mit Beleg**:
- nennt, welche Chargen verglichen wurden und welche Zahlen den Unterschied zeigen,
- nennt die **Datenmenge** und wie sicher der Schluss deshalb ist; bei wenigen Chargen ausdrücklich „Hinweis, kein Beleg“,
- formuliert nie eine Wirk- oder Gesundheitsaussage; es geht um Rezeptur, Einwaage, Rohstoff und Prozess.
Beispielantwort: „Charge 7 bis 9 (je 2 bis 3 Sterne) haben gemeinsam: Zutat X wurde durch Y ersetzt; Einwaage Z war 1,8 g über Soll. Chargen 3 bis 6 (4 bis 5 Sterne) nicht. Das spricht für, beweist aber nichts (6 Chargen).“

### 5.5 Datengrundlage: heute und Lücken
**Heute vorhanden:** Charge mit Datum, Version, Gesamtmenge, Notiz, Sternen (`stars`), Abzug, Zeilen mit Soll und Ist; Rezeptversionen mit Differenz und Kennzeichnung gut/schlecht; Preise mit Datum.
**Lücken, die spätere Auswertungen schwächen** (Daten lassen sich hinterher nicht nachtragen):
1. **Bewertungskriterien je Charge**, optional und kurz: z. B. Konsistenz, Duft, Hautgefühl (als persönliches Urteil), Stabilität/Aussehen. Heute nur ein Gesamtstern plus Freitext.
2. **Nachbewertung** nach einigen Wochen (Trennung, Geruch, Konsistenz im Verlauf).
3. **Herkunft der eingewogenen Ware:** welches Gebinde, welche Bezugsquelle, Charge/MHD des Rohstoffs (heute nur die Artikel-ID).
4. **Prozessangaben**, optional: Temperatur, Rührzeit, Rührgerät.
**Das berührt das Datenmodell des Rezeptbuchs (`S.chg`).** Änderungen müssen rückwärtskompatibel sein (fehlende Felder = leer) und in Sicherung, Import/Export und Statistik berücksichtigt werden. Weil die echte Erfassung beginnt, bevor Funktion C gebaut ist, wird Punkt 1 vorgezogen (Beschluss unten).

### 5.6 Alternativen und Recherche zwischen Rezeptbuch und Artikeldaten (C2)
Anfrage: „Ersatz für Zutat X in Rezept Y“.
1. **R0:** lokaler Vorschlag nach Kategorie, Funktion, Phase, Einsatzbereich, ähnlichen Seifen-/Fettwerten oder Tensidklasse, Bestand > 0.
2. **KI:** ordnet die Kandidaten, begründet knapp, weist auf Folgen hin (Phase, Dosierung, Seifenwerte), gibt ggf. einen `vorschlag_rezept` als neue Version zurück (Vorschau, Entwurf, Speichern).
3. Sucht die KI außerhalb des Lagers (Websuche, Wissensbasis), wird das als „nicht im Lager“ gekennzeichnet; sie zeigt Quellen.

### 5.7 Voraussetzung und Qualitätsanzeige
Die Auswertung läuft auch bei roter/gelber Dashboard-Anzeige, nennt aber die Lücken („Für Chargen fehlen Bewertungskriterien“) und die Datenmenge am Anfang der Antwort.

### Kommentare zu Abschnitt 5
(noch keine)
**Beschluss 07.11.2026 (Entwickler): Das Bewertungsformular je Charge kommt.** Es muss nicht direkt nach dem Mischen ausgefüllt werden; die Nutzerin soll Chargen auch Wochen später nachbewerten und dabei immer mehr dokumentieren. Entwurf, mit dem Entwickler vor dem Bau zu bestätigen:
- **Aufbau:** In der Charge ein einklappbarer Block „Bewertung“ mit den vorhandenen Sternen und der vorhandenen Notiz als **Erstbewertung**, dazu optionale Kriterien (Konsistenz, Duft, Aussehen, Anwendung als persönliches Urteil), jeweils einfache Skala oder Symbol, alles freiwillig.
- **Nachbewertung:** „Nachbewertung hinzufügen“ legt einen datierten Eintrag an (Datum, Sterne, Kriterien, Notiz). Mehrere Einträge je Charge sind möglich; die Chargenliste zeigt die jüngste Sternzahl.
- **Datenmodell (additiv):** `c.bew[]` mit `{date, stars, k:{…}, note}`. Die bestehenden Felder `c.stars` und `c.note` bleiben gültig und gelten als Erstbewertung. Fehlende Felder = leer. Sicherung, Wiederherstellung und Export berücksichtigen das Feld.
- **Idee, nicht beschlossen:** Filter „noch nicht nachbewertet“ in der Chargenliste (ohne Erinnerungsmeldungen).

---

## 6. Funktion D: Rezept-Chat (Rezepte entwickeln)

### 6.1 Ziel
Der Nutzer beschreibt per Text oder Diktat, was er herstellen will („feste Seife, besonders schaumig, 500 g“, „leichte Gesichtscreme, 100 g“). Die App liefert einen **berechneten Rezeptentwurf aus Lager und Katalog**, den er prüft und als neues Rezept speichert.

### 6.2 Ablauf
1. Wunsch (Produktart, Menge, gewünschte Eigenschaften der Rezeptur wie schaumig, weiß, mild, fest).
2. Kurze Rückfragen der KI, nur wenn nötig.
3. KI wählt Zutaten aus dem Kandidatenpaket (Lagerartikel und Katalogartikel, siehe 6.6) und schlägt Anteile vor.
4. **Rechner prüft** über die Werkzeuge (2.5); Fehler und Warnungen gehen zurück an die KI, die korrigiert (wenige Runden).
5. Prüfer (2.6), Vorschau (2.7), **Entwurf im Editor**, Speichern als **neues Rezept**, Version 1, Vermerk „KI-Entwurf, nicht geprüft“.
6. Was vom Chat gespeichert wird, regelt 6.12: allgemeine Chats sind Wegwerf-Chats, ein Rezept-Chat hängt als Markdown-Datei am entstandenen Rezept.

### 6.3 Rollenverteilung
| KI | App-Code (Rechner, Prüfer) |
|---|---|
| Auswahl der Zutaten, Anteile, Ablaufentwurf, Erklärung in Worten | alle Zahlen: Lauge, Wasser, Überfettung, Härte/RZF, HLB, Summen, Kosten, Dosierung, Mischbarkeit |
Die KI rechnet nichts selbst. Jede Zahl in der Vorschau stammt vom Rechner.

### 6.4 Seife (Kaltverseifung)
Harte Regeln im Code:
- Nur Fette, für die im Lager oder Katalog eine Verseifungszahl vorliegt. Fehlt der Wert, wird das Fett **nicht verwendet** und im Ergebnis genannt („Wert fehlt, bitte nachtragen“); das zeigt zugleich die Qualitätslücke.
- Laugenunterschuss nur im festgelegten Bereich; Anteile summieren auf 100 %; Obergrenzen je stark reinigendem Fett; Gesamtmenge ist `i.total`-treu.
- Laugenmenge und Wasser ausschließlich vom Rechner; Pflicht-Sicherheitshinweis aus festen App-Texten.
- Baut auf dem vorhandenen **Seifenrechner (Teil A/B) und „Vorschlag aus meinem Bestand“** (`seiSugCalc`) auf: Das Regelwerk liefert Kandidaten, die KI wählt, begründet und passt an den Wunsch an.
- Welche Seifenart möglich ist, ergibt sich aus den vorhandenen Werten (6.13), nicht aus einer festen Vorgabe.
- Ehrlich formuliert: Die **Rechnung** ist exakt, soweit die Eingangswerte stimmen. Härte, Schaum und Haltbarkeit sind **Näherungen aus Buchwerten**; es gibt keine Zusage „perfekt“ oder „garantiert sicher“.

### 6.5 Kosmetik (Emulsion, Öl, Tensid und andere)
Phasen und Mengen aus dem Rezeptmodell; Emulgatoranteil über Emulgator-/HLB-Rechner; Dosierung gegen Einsatzbereiche; Hinweis, wenn eine wasserhaltige Rezeptur keine Konservierung enthält (Regel, kein Sicherheitsversprechen); Ablaufmodule aus den vorhandenen Standard-Abläufen der App, von der KI angepasst, ohne neue Sicherheits- oder Wirkaussagen.

### 6.6 Lager und Katalog: Planen mit allen Artikeln, Mischbarkeit nach Bestand (Beschluss 07.11.2026)
Zwei getrennte Fragen:
- **Planen/Rechnen:** Beim Entwerfen eines neuen Rezepts ist es **egal, ob ein Rohstoff im Lager ist**. Es muss mit allen Artikeln des Katalogs gerechnet werden können, auch mit „fiktiven“ Artikeln, die nur im Katalog stehen.
- **Mischbar:** Ob das Rezept jetzt gemischt werden kann, beurteilt allein der **Bestand**, wie in der Rezeptansicht.
Umsetzung:
1. **Fiktive Artikel:** Aus einem Katalogeintrag wird bei Bedarf ein Artikel im Speicher gebaut (wie beim Anlegen aus dem Katalog), ohne ihn im Lager zu speichern. Werte (Verseifungszahl, Härte, WAS, Einsatzbereich, Dichte) kommen aus dem Katalog; Werte am Lagerartikel haben Vorrang. Ein Rezept verknüpft Katalogzutaten schon heute über die Katalog-ID; sie zählen dann als „fehlt“.
2. **Werkzeuge:** `rechne_*` und `summen_check` nehmen Lager-ID oder Katalog-ID an; `katalog_suche` ergänzt `lager_suche`. Der Prüfer behandelt beide gleich und zeigt je Zeile „im Lager“ oder „nur Katalog“.
3. **Kandidaten vorfiltern (R0):** Der Katalog (über 1000 Einträge) geht nie vollständig in eine Anfrage. Lokal werden nach Produktart, Funktion, Phase und vorhandenen Werten einige Dutzend bis wenige Hundert Kandidaten gewählt; Lagerartikel stehen vorn und werden bevorzugt.
4. **Der Entwurf zeigt den Bestand:** „mischbar“ oder „nicht mischbar“ mit der Liste der fehlenden Zutaten; die KI darf Zutaten außerhalb des Lagers vorschlagen, wenn sie zum Gelingen beitragen, mit Begründung (Beschluss 07.11.2026, oben).
5. **Einkaufsliste:** Fehlende Zutaten lassen sich über 6.11 auf die Einkaufsliste setzen. Nie still.
6. **Katalogwerte sind Vorschläge:** Rechnungen mit Katalogwerten tragen den Hinweis „Katalogwert, nicht bestätigt“ (bei Seife siehe 6.13, Punkt 6).
7. **Optional:** Wer nur mit dem Bestand planen will, schaltet im Chat „nur Lager“ ein.

### 6.7 Wissensbasis (RAG) und Recherche
- **Inhalt:** eigene, komprimierte Wissenskarten aus der Fachliteratur und eigene Regeln, z. B. `{id, thema, aussage, quelle (Buch, Seite), status geprüft/ungeprüft, stichworte}`. **Nur eigene Zusammenfassungen, Zahlen und Regeln, keine Buchabschnitte** (Urheberrecht).
- **Herkunft:** Auszüge aus dem Notebook des Nutzers (Neumann, Käser, Rührkunde, weitere Bücher) sowie Regeln, die der Nutzer aus Recherchen mit „Als feste Regel merken“ übernimmt.
- **Technik:** zunächst einfache lokale Stichwortsuche; die besten Karten gehen als Kontext in die Anfrage. Ein Vektorindex ist nicht nötig, solange die Basis klein ist.
- **Beispiel einer Wissenskarte:** Die KI recherchiert, wie man Seife besonders schaumig bekommt. Statt den Chat aufzuheben, speichert der Nutzer das Ergebnis als kleine Karte: Titel („Schaum bei Stückseife“), Aussage in eigenen Worten und Zahlen, Quelle (Buch mit Seite oder Webadresse), Datum, Stufe (1 bis 3). Beim nächsten Mal findet der Chat die Karte lokal und braucht nicht erneut zu suchen; der Nutzer kann sie ändern oder löschen.
- **Austausch mit NotebookLM:** Der Lagerexport für NotebookLM besteht. In Gegenrichtung können Notebook-Antworten als Text eingefügt und über die Erfassungsstrecke (Funktion A) als Wissenskarten bestätigt werden.
- **Websuche** wie 2.8: nur mit Quellen, nie automatisch zur Regel.

### 6.8 Sprache
Diktat läuft über die Tastatur des Handys; das braucht keine Entwicklung. Eine eigene Spracherkennung in der App ist nicht Teil der ersten Version.

### 6.9 Qualitätsanzeige
Der Chat funktioniert auch bei rot/gelb. Er nennt zu Beginn, was die Qualität bremst (z. B. „12 Fette ohne Verseifungszahl, nicht verwendet“).

### 6.10 Offene Fragen
Die Seifenart wird nicht vorab festgelegt: Der Rezept-Chat richtet sich nach der Datenlage (6.13). Offen sind Standardwerte für Laugenunterschuss und Wasseranteil? Duftstoffe und Farbstoffe in Seife (Grenzen aus Katalog `e1`)?

### 6.11 Einkaufsliste aus dem Chat
Der Nutzer sagt „setz mir die fehlenden Zutaten auf die Einkaufsliste“ oder die KI schlägt es nach einem Rezeptentwurf vor.
- Neues Vorschlags-Werkzeug `vorschlag_einkauf`: je Posten Artikel (ID, Katalog-ID oder Freitext), Menge und Einheit, Lieferant, Begründung (z. B. Rezept).
- **Menge:** Der Bedarf kommt vom Rechner (Rezeptbedarf minus Bestand), nicht von der KI; die Einkaufsvorschläge der App (knapp, nicht bestellt) bleiben als R0 erhalten.
- **Lieferant:** nur aus den bekannten Lieferanten und Bezugsquellen des Artikels; der günstigste ergibt sich aus dem Preisvergleich (R0). Unbekannt bleibt leer.
- Vorschau, Bestätigung, dann Eintrag in die vorhandene Einkaufsliste (dieselben Funktionen wie „+ Rohstoff“). Es wird nichts bestellt oder gebucht.

### 6.12 Chats: was gespeichert wird und was nicht
| Art | Behandlung |
|---|---|
| **Rezept-Chat** (Rezept wurde im Chat erstellt) | Der Verlauf hängt als **Markdown-Datei** am entstandenen Rezept (an der Version, die aus dem Chat entstand). Schreibgeschützt: ansehen, kopieren, exportieren, löschen. Teil der Sicherung. **Kein offenes Fortsetzen.** Auf Wunsch lässt sich die Datei als **Ausgangstext für einen neuen Rezept-Chat** verwenden: Sie wird in einen frischen Chat gelegt (bei Länge gekürzt oder zusammengefasst). |
| **Allgemeine Chats** (Guide, Fragen, Recherche) | **Wegwerf-Chats.** Verlauf in der Sitzung sichtbar und kopierbar; nichts wird gespeichert, nichts angehängt. |
| **Artikel** | Es werden **keine** Chats an Artikel gehängt (beschlossen 07.11.2026). |
Vorschläge zur Entscheidung (weitere mögliche Anhänge, bewusst klein gehalten):
1. **Auswertungs-Chat zu einem Rezept** („Warum ist die Creme schlechter geworden?“) kann auf Wunsch als Markdown am Rezept hängen, getrennt vom Entstehungs-Chat und mit Datum. **Wird in der Testphase ausprobiert** (Beschluss 07.11.2026) und danach bewertet.
2. **Chat zu einer Charge** (Nachbewertung): Statt den Chat anzuhängen, schlägt die KI eine kurze Zusammenfassung für die Notiz der Nachbewertung vor, die der Nutzer bestätigt.
3. **Recherche mit Ergebnis** wird nicht als Chat, sondern über „Als feste Regel merken“ eine Wissenskarte (2.8, 6.7).
4. **Einkaufs-Chat** endet in der Einkaufsliste (6.11), nicht in einem gespeicherten Chat.
Technisch bleibt der Rezept-Chat ein Textfeld (`v.chat`, Markdown) und bläht den Zustand kaum auf. **Es bleiben keine Chats beim Sprachmodell offen:** Die App sendet bei jeder Antwort den bisherigen Verlauf selbst mit; ein „offenes Kontextfenster“ beim Anbieter gibt es nicht. Der Kontext wird begrenzt, indem lange Verläufe gekürzt oder zusammengefasst werden und beim Wiederaufnehmen nur der gespeicherte Text als Ausgang dient.

### 6.13 Funktionsbereitschaft und Hilfe bei fehlenden Werten (Beschluss 07.11.2026)
Die App bietet schon Funktionen (Kaltverseifung, Tensidrechner, Dosierungsprüfung, Spreitwert-Check, Kalkulation, Rezept umrechnen), die ohne Werte am Artikel nichts oder wenig liefern. Der Chat soll das erkennen, darauf hinweisen und beim Beschaffen der Werte helfen. Damit klärt sich auch, welche Seifenarten möglich sind.
1. **Funktionsvoraussetzungen:** Für jede Funktion ist hinterlegt, welche Artikelwerte sie braucht (z. B. Kaltverseifung: Verseifungszahl bzw. NaOH-Bedarf, Härte, Ranziditätsfaktor, Einsatz in Seife; Tensidrechner: WAS; Spreitwert-Check: Spreitwert; Dosierung: Einsatzbereich; Kalkulation: Preise; Umrechnen mit ml: Dichte). Die Tabelle liegt maschinenlesbar im Code und in der Landkarte (Spalte „braucht Werte“, beim Bau aus dem Code zu erfassen).
2. **Bereitschaftsprüfung (R0, ohne KI):** Werkzeug `funktions_check(funktion)` meldet: bereit / eingeschränkt (z. B. „9 von 14 Fetten im Lager mit Verseifungszahl“) / nicht möglich, dazu die fehlenden Felder und die betroffenen Artikel. Die Lückenfilter der Lagerliste nutzen dieselben Regeln.
3. **Der Chat erklärt die Folgen:** „Für eine feste Stückseife aus deinem Bestand fehlen bei Olivenöl, Kokosöl und Sheabutter Härte und Ranziditätsfaktor. Mit diesen drei Werten kann ich einen berechneten Vorschlag machen.“ Gleiches für andere Funktionen und Produktarten.
4. **Der Chat hilft beim Beschaffen:** Er nennt die üblichen Quellen für den jeweiligen Wert: Datenblatt oder Händlerseite des Rohstoffs (über „Produktseite lesen“), Etikett, die Wissensbasis aus den Fachbüchern des Nutzers, bei Bedarf Recherche im Web mit Quellenangabe. Er erklärt kurz, was der Wert bedeutet und woran man ihn erkennt, ohne Messverfahren zu verlangen, die zu Hause nicht möglich sind.
5. **Wege in den Artikel:** Gefundene Werte kommen als `vorschlag_artikelwert` in die Vorschau (Stufe 1), der Nutzer übernimmt (Stufe 2) und bestätigt später (Stufe 3). Ohne Übernahme ändert sich nichts.
6. **Sicherheit bei Seife (beschlossen 07.11.2026):** Die Laugenberechnung hängt direkt an der Verseifungszahl; ein falscher Wert macht die Seife unbrauchbar oder ätzend. Ziel ist, dass **alle Rechner funktionieren**, damit der Nutzer sieht, mit welchem Wert gerechnet wird. Deshalb rechnet der Seifenrechner auch mit Werten der **Stufe 2** und zeigt dazu einen deutlichen Warnhinweis („Wert nicht bestätigt, vor dem Sieden mit dem Datenblatt abgleichen“). Jede Zeile nennt den verwendeten Wert, seine Stufe (grau/schwarz) und die Quelle. Fehlt ein Wert ganz, wird das Fett nicht verwendet und die Lücke genannt.
7. **Nutzen über den Chat hinaus:** Dieselbe Bereitschaftsprüfung speist die Qualitätsanzeige im Dashboard und den App-Guide (Funktion B: „Warum kann ich das noch nicht?“).

### Kommentare zu Abschnitt 6
- 07.11.2026, Entwickler: Mischbarkeit nur nach Bestand; beim Erstellen neuer Rezepte darf der Bestand keine Rolle spielen, es muss mit allen fiktiven Artikeln aus dem Katalog gerechnet werden können. → 6.6 neu gefasst.
- 07.11.2026, Entwickler: Die Seifenthematik soll der Rezept-Chat klären. Sobald ihm Werte vorliegen, kann er Funktionen ausführen, die die App schon bietet; fehlen Werte, soll er darauf hinweisen und helfen, wie und woher man sie bekommt. → eingearbeitet in 6.13; Entscheidung 5 damit erledigt.
- 07.11.2026, Entwickler: Fehlende Zutaten sollen im Chat auf jeden Fall vorschlagbar sein (6.6); Einkaufslisten aus dem Chat mit Artikel, Menge und Lieferant (6.11); Rezept-Chats hängen als Markdown am Rezept, kein Fortsetzen; allgemeine Chats sind Wegwerf-Chats; keine Chats an Artikel (6.12). → eingearbeitet.

---

## 7. KI-Testsatz (Testdaten für die Entwicklung)

### 7.1 Zweck
Ein ladbarer Datensatz, mit dem jede KI-Funktion getestet werden kann, bevor genug echte Daten da sind. Er liegt wie die bestehenden Testrezepte unter **Mehr › Einstellungen › Testbetrieb** (Expertenmodus), lässt sich laden und wieder entfernen und trägt die Markierung `demo` (Rückgängig-Leiste wie heute).

### 7.2 Inhalt
- **Artikel:** etwa 40 Rohstoffe mit vollständigen Werten (Öle und Fette mit Verseifungszahl, Härte, RZF; Emulgatoren; Konservierer; Tenside mit WAS), dazu einige **absichtlich lückenhafte** Artikel, damit Qualitätshinweise und „Wert fehlt“ getestet werden.
- **Rezepte:** die vorhandenen 27 Testrezepte plus einige bewertete Rezepte mit mehreren Versionen (gut/schlecht).
- **Chargen:** rund 60 über einige Monate, mit Soll/Ist, Sternen, Notiz und (falls beschlossen) Bewertungskriterien und Nachbewertung.
- **Preise:** Preisverläufe mit Datum, ein Lieferantenwechsel, ein deutlicher Preisanstieg.

### 7.3 Eingebaute „Wahrheiten“
Der Satz enthält bekannte Muster, die Funktion C finden **muss** (mit Sollliste im Test): z. B. drei schlechtere Chargen nach einem Zutatentausch, eine Einwaage 2 g über Soll, ein Preissprung bei einem Öl. So lässt sich prüfen, ob Auffälligkeiten (R0) und Erklärung (R1/R2) das Richtige zeigen und bei zu wenig Daten vorsichtig bleiben.

### 7.4 Erzeugung
Deterministischer Generator `src/testdaten/gen_ki.py` (fester Zufallswert), Ausgabe nach `src/proto/` wie `testdaten.js`. Die Daten sind erfunden, tragen den Hinweis „nicht fachlich geprüft, nicht zum Nachmischen“.

### 7.5 Vorlagen für Funktion A (Erfassen)
Etwa zehn Beispielvorlagen (Fließtext, Tabelle, Bildschirmfoto, Handschrift) mit Sollergebnis. Fotos echter, privater Rezepte gehören **nicht** ins öffentliche Repo (GitHub Pages setzt ein öffentliches Repo voraus, Prüfung der Sichtbarkeit offen); sie bleiben im Projektordner auf dem Rechner. Im Repo liegen nur selbst erzeugte Beispiele.

### Kommentare zu Abschnitt 7
(noch keine)

---

## 8. Rückfallstand und Versionierung

### 8.1 Rückfallstand „ohne KI“
Vor jeder Änderung wird der heutige, getestete Stand eingefroren:
- Branch `ohne-ki` auf dem Stand von main vor den KI-Arbeiten (Commit 788a9d5; ein Tag ließ sich nicht hochladen),
- GitHub-Release mit den drei gebauten Dateien (`index.html`, `sw.js`, `katalog.json`),
- Offline-Kopie im Projektordner: `INCI-App-Projekt/archiv/ohne-ki-2026-11-07/` mit gebautem Stand und Commit-Nummer,
- Zeile in `STAND.md` und `INDEX.md`.
Dieser Stand wird nie überschrieben und ist jederzeit als Notbremse nutzbar.
**Status 07.11.2026:** Der Rückfallstand ist der Branch `ohne-ki` auf Commit 788a9d5 (angelegt und auf GitHub vorhanden). Der Tag `ohne-ki-2026-11-07` liegt nur lokal, das Hochladen von Tags wurde von der Umgebung abgelehnt (HTTP 403); er wird nicht gebraucht. Dieser Branch wird nie weiterentwickelt.

### 8.2 Warum nicht einfach auf main weiterarbeiten
GitHub Pages liefert main aus, die installierten PWAs (deine und die deiner Freundin) holen sich Updates selbst. Jeder Push erreicht damit sofort den **echten Test**. Außerdem liegen alle Daten in einer Datenbank pro Adresse (`inciheinz-proto`); eine zweite Fassung unter derselben Adresse würde dieselben Echtdaten verwenden.

### 8.3 Entwicklung (Beschluss 07.11.2026)
- **Zunächst wird auf der Ursprungsversion (main) weitergearbeitet.** Solange der Rückfallstand `ohne-ki` bekannt und unverändert ist, ist das in Ordnung. Das gilt auch für kleine additive Änderungen vor dem KI-Bau, etwa das Bewertungsformular.
- Ein eigener **KI-Branch** (`ki`) wird angelegt, sobald KI-Code entsteht („bald“). Er bekommt dann eine **eigene Datenbank** (z. B. `inciheinz-ki`), eigenen Cache-Namen im Service Worker und ein eigenes Manifest („INCIheinz KI-Test“), damit echte Daten unberührt bleiben. Daten kommen nur per Sicherung/Wiederherstellung oder Testsatz hinein. Dafür bekommt der Build einen Parameter (z. B. `KI_TEST=1`).
- Hintergrund bleibt 8.2: Pages liefert main aus, die installierten PWAs holen sich Updates selbst und alle Daten liegen in einer Datenbank pro Adresse (`inciheinz-proto`).
- Übernahme von `ki` nach main erst nach dem Go. KI ist dann standardmäßig aus.
**Alternative** (eigenes Repo `INCIheinz-KI`) bleibt zurückgestellt.

### 8.4 Regeln für das Datenmodell
- Nur **additive** Felder (keine Umbenennung, kein Löschen). Eine Sicherung aus der KI-Fassung muss in der Fassung ohne KI einspielbar sein, unbekannte Felder werden ignoriert. Dafür kommt ein Testfall (Sicherung Hin und Zurück).
- KI-Schlüssel und KI-Einstellungen bleiben außerhalb von `S` und der Sicherung (2.3).

### 8.5 Regression
Die vorhandenen Tests t83 bis t100 laufen unverändert gegen beide Fassungen. Neue Tests ab t101 prüfen: KI aus bedeutet keine Netzwerkaufrufe; Schlüssel nicht in Sicherung; Rückfall-Sicherung kompatibel; jede KI-Änderung geht nur über die Vorschau.

### 8.6 Notbremse
Gerät die KI-Fassung außer Kontrolle: Branch verwerfen, Tag `ohne-ki-2026-11-07` ist der Stand. Ein globaler Schalter „KI aus“ (Build-Parameter) deaktiviert alle KI-Einstiege, falls einzelne Teile schon in main liegen.

### Kommentare zu Abschnitt 8
(noch keine)

---

## 9. Reihenfolge, Risiken, offene Entscheidungen

### 9.1 Vorgeschlagene Reihenfolge
0. Rückfallstand anlegen (8.1). Vor allem anderen.
1. **Landkarte** `APP_LANDKARTE.md` mit Build-Prüfung. Keine App-Änderung nötig, hilft sofort allen Chats.
2. Entscheidung **Bewertungsformular je Charge** (5.5), klein und möglichst vor Start der Erfassung.
3. **KI-Testsatz** (Abschnitt 7).
4. **Dienst-Schicht, Einstellungen, Schlüssel** (`js33.js`, `js34.js`) mit Mock-Tests.
5. **B App-Guide** als erste Probe (keine Nutzerdaten).
6. **C, R0:** Tabelle „Auffälligkeiten“ (nützt auch ohne KI).
7. **A1/A2:** Rezepte aus Text, dann aus Foto/Handschrift.
8. **A3/A4:** Artikel, Rechnungen.
9. **C mit KI** und **C2 Alternativen**.
10. **D Rezept-Chat:** Seife zuerst, dann Kosmetik; Wissensbasis.
D steht zuletzt, weil es Datenqualität, Wissensbasis und die Rechner-Werkzeuge voraussetzt.

### 9.2 Risiken
| Risiko | Gegenmaßnahme |
|---|---|
| Daten gehen an einen Cloud-Dienst | Opt-in, Datenhinweis, Datensparsamkeit, „Was wird gesendet?“, R1 lokal wo möglich |
| Falsche oder erfundene Angaben | Prüfer, Rechner rechnet, IDs statt Namen, „ungeprüft“-Kennzeichnung, Bestätigungsweg |
| Sicherheit bei Lauge und Seife | feste Sicherheitstexte, Grenzen im Code, keine Zusage „sicher“ |
| Wirk- und Gesundheitsaussagen | Sperrliste, Anweisung im Prompt, Prüfer |
| Kosten und Kontingent | Tageslimit, Anzeige, Beschränkung des Schlüssels |
| Mehrere Chats gleichzeitig am Grundgerüst | „Aktive Arbeit“ in STAND.md, Eintrag je Chat, nur ein Chat baut |
| Modell- oder Preisänderung beim Anbieter | Modellname als Einstellung, Anbieter austauschbar |
| Urheberrecht bei Fachbüchern | nur eigene Zusammenfassungen, Zahlen und Regeln |
| Handschrift wird schlecht gelesen | Vorschau mit Ampel, Original einsehbar, Messung am Testsatz |
| App wird größer (Landkarte, Wissen) | Größe beobachten, Wissen ggf. als eigene Datei laden |
| Echte Daten durch Testfassung gefährdet | eigener Datenbankname, Branch, Tag als Rückfall |

### 9.3 Datenschutz bei einer späteren Veröffentlichung
In der Testphase nutzt der Entwickler sein eigenes Konto. Vor einer Veröffentlichung wird neu entschieden: welche Daten gesendet werden, welcher Anbieter und Tarif (Verwendung der Eingaben durch den Anbieter prüfen), Einwilligung und Hinweise, Auswirkungen auf die Store-Portierung (`PORTIERUNG.md`). Bis dahin gilt: KI standardmäßig aus.

### 9.4 Offene Entscheidungen für das Go
| Nr | Frage | Status |
|---|---|---|
| 1 | Vertrauensstufen für KI-Werte: Stufe 1 KI, 2 übernommen, 3 bestätigt (1.7) | beschlossen 07.11.2026 |
| 2 | Bewertungsformular je Charge vor dem Start der Erfassung (5.5) | grundsätzlich beschlossen 07.11.2026; Details und Bauzeitpunkt offen |
| 3 | KI-Testfassung: erst auf main weiter, später Branch `ki` mit eigener Datenbank (8.3) | beschlossen 07.11.2026; Zeitpunkt des KI-Branchs offen |
| 10 | Rückfallstand als Branch `ohne-ki` (8.1) | erledigt 07.11.2026 |
| 4 | Originalfoto beim Rezeptimport: nicht speichern, danach löschen (3.3, 3.8) | beschlossen 07.11.2026 |
| 5 | Seifenart zuerst | erledigt: richtet sich nach der Datenlage über den Rezept-Chat (6.13) |
| 13 | Laugenberechnung mit Stufe-2-Werten und Warnhinweis (6.13) | beschlossen 07.11.2026 |
| 6 | Chatverlauf: Rezept-Chat als Markdown am Rezept, sonst Wegwerf (6.12) | beschlossen 07.11.2026 |
| 11 | Rechnungen: lokale Vorfilterung des Rohtextes in Version 1 (3.10) | beschlossen 07.11.2026; Versandkosten getrennt ausweisen weiterhin offen |
| 12 | Weitere Chat-Anhänge laut Vorschlägen 1 bis 4 (6.12) | Vorschlag 1 (Auswertungs-Chat) wird in der Testphase ausprobiert; 2 bis 4 offen |
| 7 | Arbeitsregel „Landkarte im selben Commit pflegen“ in `UEBERGABE.md` (4.3) | beschlossen 07.11.2026, aufgenommen |
| 8 | Reihenfolge 9.1 so in Ordnung | offen |
| 9 | Anbieter und Modell für den Test (Gemini; Modellname vor dem Bau prüfen) | offen |

### Kommentare zu Abschnitt 9
(noch keine)

---

## 10. Beschlussprotokoll
Hier trägt der Chat nach jedem Kommentar des Entwicklers Datum, Abschnitt und Beschluss ein. Nach dem finalen „Go“ steht hier die Freigabe mit Datum.
- 07.11.2026: Konzept in Abschnitten begonnen; Kommentar zu Abschnitt 1 eingearbeitet (1.7).
- 07.11.2026: Landkarte `APP_LANDKARTE.md` als Erstentwurf aus der laufenden App erzeugt (Lücken in Abschnitt 10 der Landkarte).
- 07.11.2026: Rückfallstand: Tag `ohne-ki-2026-11-07` auf Commit 788a9d5 lokal angelegt, Push des Tags abgelehnt (403). Ersatz offen (Branch `ohne-ki` oder Tag/Release von Hand auf GitHub).
- 07.11.2026, Entwickler: Originalfoto beim Import wird nicht gespeichert, sondern danach gelöscht; erst nach Store-Portierung neu entscheiden. Arbeitsregel „Ansicht, Menü oder Datenfeld ändern heißt Landkarte im selben Commit pflegen“ bestätigt und in `UEBERGABE.md` aufgenommen (Entscheidungen 4 und 7).
- 07.11.2026, Entwickler: Bewertungsformular je Charge gewünscht (Nachbewertung Wochen später, mehrere Einträge); fehlende Zutaten im Chat vorschlagbar; Einkaufsliste aus dem Chat; Rechnungen digital und rückwirkend mit Rechnungsdatum; Rezept-Chat als Markdown am Rezept, allgemeine Chats Wegwerf, keine Chats an Artikel. Eingearbeitet in 3.10, 5.5, 6.6, 6.11, 6.12.
- 07.11.2026, Entwickler: Vertrauensstufen für KI-Werte festgelegt (KI höchstens Stufe 1, Übernahme durch den Nutzer Stufe 2, Bestätigung Stufe 3 als Siegel; verifiziert erst nach Prüfung und Bestätigung durch den Nutzer) → 1.7. Branch `ohne-ki` als Rückfallstand angelegt (Commit 788a9d5); es wird zunächst auf main weitergearbeitet, ein KI-Branch mit eigener Datenbank folgt, sobald KI-Code entsteht → 8.1, 8.3.
- 07.11.2026, Entwickler: Seifenart wird nicht vorab festgelegt; der Rezept-Chat prüft die Datenlage, weist auf fehlende Werte hin und hilft bei Beschaffung (6.13).
- 07.11.2026, Entwickler: Mischbarkeit wird nach Bestand beurteilt; beim Erstellen neuer Rezepte spielt der Bestand keine Rolle, es muss mit allen fiktiven Katalogartikeln gerechnet werden können → 6.6 neu gefasst (auch 2.5, 6.2, 1.3).
- 07.11.2026, Entwickler: Stufen präzisiert: Übernommene KI-Werte stehen grau in den Feldern (Stufe 2), bestätigte oder überschriebene schwarz (Stufe 3), Stufe 1 nur in der Vorschau (1.7). Rezept-Chat als Markdown darf als Ausgangstext eines neuen Chats dienen; keine offenen Chats beim Sprachmodell (6.12). Auswertungs-Chat in der Testphase ausprobieren. Lokale Vorfilterung des OCR-Rohtextes bei Rechnungen und Produktseiten beschlossen (3.10). Seifenrechner rechnet mit Stufe 2 und Warnhinweis, alle Rechner sollen funktionieren (6.13).
- Finales Go: offen.


## Nachtrag 07.11.2026 (Freigaben)
- EAN aus Rohtexten (OCR, Produktseiten, Rechnungen) auslesen: gewünscht. Umsetzung deterministisch (R0): 13-stellige Zahl mit Prüfziffer; die lokale Vorfilterung behält EAN-Zeilen immer.
- Versandkosten auf Rechnungen werden getrennt ausgewiesen: beschlossen.
- Umsetzungsreihenfolge §9.1 bestätigt. Alle nicht kommentierten Vorschläge, die Chat-Anhang-Vorschläge, Chargen-Notiz, Einkaufs-Chat und die Kontextkomprimierung sind freigegeben.
- Bewertungsformular in der Charge ist gebaut (js32.js; KI-Dateien heißen deshalb js33/js34). Kriterien: Konsistenz, Duft, Aussehen, Hautgefühl. Filter "noch nicht nachbewertet" bleibt Idee.
- Finales Go: offen.

## Nachtrag 07.11.2026 (Entscheidungen und Umsetzung Stufen 3 bis 5)
- Kein Branch `ki`: KI-Funktionen werden auf main in derselben App entwickelt. Der Branch `ohne-ki` bleibt nur das Archiv der Version ohne KI (für eine App ohne KI für die Freundin).
- Freischaltung: Mehr › Einstellungen › KI-Funktionen, immer sichtbar. Schlüssel eintragen, "Schlüssel prüfen"; nach erfolgreicher Prüfung ist die KI an. Schlüssel entfernen = KI sofort aus (keine KI, auch keine lokale, nur Texterkennung).
- Modell: Standard `gemini-3.8-flash` (im Menü änderbar). Die Prüfung ruft das Modell einmal auf; "nicht gefunden" meldet einen falschen Modellnamen.
- Wissensbasis: stark komprimierte Textdateien aus den Fachbüchern, auf dem Server der App abgelegt (Ordner `wissen/`). Der Nutzer kann keine eigenen Quellen hinzufügen. Erste Datei: `wissen/app-landkarte.md` (wird beim Build aus APP_LANDKARTE.md erzeugt, ohne Abschnitt 9).
- Gebaut: Stufe 3 KI-Testsatz (`src/testdaten/gen_ki.py` → `testdaten_ki.js`, 55 Chargen, Nachbewertungen, Preisverläufe, fünf Muster W1 bis W5, laden/entfernen im Testbetrieb), Stufe 4 Dienst-Schicht (`js33.js`), Stufe 5 App-Guide (`js34.js`).
- Filter "noch nicht nachbewertet": bleibt für die letzte Ausbaustufe.
