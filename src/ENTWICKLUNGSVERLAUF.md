# INCIheinz – Entwicklungsverlauf und Entscheidungen (Stand 05.11.2026)

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
