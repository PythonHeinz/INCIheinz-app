# INCIheinz: Liste für die Portierung (Store-Version)

Was die Web-/PWA-Version bewusst nicht umsetzt oder nur als Übergang löst.

## Speicher und Daten
- Nativer Speicher statt IndexedDB: Daten als Datei/Datenbank (z. B. SQLite) im App-Speicher, nicht als ein Gesamt-Blob.
- Fotos als eigene Dateien, in der Datenbank nur der Verweis. Heute liegen sie als Base64 im Zustand und werden bei jedem Speichern mitgeschrieben.
- Inkrementelles Speichern (nur geänderte Datensätze) statt Gesamtzustand.
- Automatische Sicherung/Export in einen vom Nutzer gewählten Ordner. Der monatliche Sicherungshinweis ist nur in der Web-Version vorgesehen.
- Mehrstufiges Rückgängig: Web hat genau einen Schritt (Snapshot des Gesamtzustands). Nativ besser über ein Änderungsprotokoll.
- Wiederherstellung nach Gerätewechsel (Backup einlesen) prüfen, inklusive Fotos.

## Katalog
- Katalog als versionierte Datei mit Update-Mechanismus über die Store-Version, Daten getrennt vom Programm.
- Katalogstoffe vor Auslieferung INCI-verifizieren und überwiegend als „geprüft“ markieren. Quellenfelder sind nicht nötig; „INCI geprüft“ im eigenen Lager bleibt Verantwortung der Nutzer.
- Produktfotos später für einen veröffentlichten Katalog wiederverwenden (in der Liste bewusst nicht angezeigt).
- Klare Trennung „Mein Lager“ und „Vorschlagskatalog“ beibehalten.

## Bedienung und Oberfläche
- Barrierefreiheit (Screenreader-Beschriftungen, Fokusreihenfolge, Kontraste, Schriftgrößen, große Touchziele) nur in der Store-Version, vorher Audit.
- Zwei-Fenster-/Tablet-Layout (Liste und Detail nebeneinander) nur Store-Version.
- Eigenes Symbolset aus einem Guss, Dark Design.
- Native Kamera-Integration statt Datei-Auswahl für „Bild lesen“ und Scannen; nativer Barcode-Scanner.
- Spanische und englische Texte durch Muttersprachler prüfen.
- Tilesdetails (Statistik-Kacheln): Layout und Datenwert einzeln prüfen, optionales Ein-/Ausblenden.

## OCR
- Tesseract im Web läuft über WASM (ca. 7–10 MB Sprachdaten, bei Bedarf geladen). Nativ prüfen: ML Kit / Apple Vision, dann ohne Download.

## Einheiten und Preise
- Dichte (Expertenmodus) fließt noch nicht in Statistik und Gefäße ein.
- Preisverlauf: Ein Wert pro Tag (günstigster gültiger); Währungen nur eine.

## Store-Anforderungen
- Datenschutzerklärung (Daten nur lokal, kein Server), Datensicherheitsangaben (Play) und App-Privacy-Angaben (Apple).
- Keine Gesundheits-/Wirkversprechen in Texten (aktuell reine Lagerhaltung).
- Kamera-Berechtigung mit Begründungstext; Dateizugriff nur auf gewählte Ordner.
- Eigene Domain, Dokumentation, „vor Version 1.0“-Hinweis entfernen.

## Spätere Funktionen (nicht Web)
- Großer Etikettenbereich für verkäufliche/verschenkbare Produkte (Motiv, Name, Menge).
- Rezeptbuch mit Kreuzauswertung: Wo wird ein Rohstoff verwendet (z. B. SCI in welchen Rezepten, Shampoo vs. Creme), Verbrauch je Rezept.
- Migration der Daten der Freundin aus den alten Netlify-Apps.
