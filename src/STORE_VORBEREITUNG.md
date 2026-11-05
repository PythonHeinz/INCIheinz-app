# INCIheinz: Store-Vorbereitung (Entwurf, Google Play)

Alles hier ist ein Entwurf. Vor der Nutzung prüfen, ob es zur fertigen App passt. Rechtliche Texte sind keine Rechtsberatung. Anbieterdaten (Name, Anschrift, E-Mail) musst du selbst einsetzen.

## 1. Store-Eintrag

**App-Name (max. 30 Zeichen):** INCIheinz

**Kurzbeschreibung (max. 80 Zeichen):**
Dein Rohstofflager für Naturkosmetik: Bestand, Preise, INCI. Alles auf dem Gerät.

**Vollständige Beschreibung (Entwurf):**
INCIheinz ist ein Lager für Rohstoffe der Hobby-Naturkosmetik. Du hältst fest, was du hast, wie viel davon übrig ist und was es gekostet hat.

- Rohstoffe mit INCI-Bezeichnung, Menge, Gefäßen und Füllstand erfassen
- Preise mehrerer Lieferanten vergleichen, Preisverlauf und Statistik
- Einkaufsliste und Bestellstatus
- Produktseiten oder Verpackungen per Kamera einlesen (Texterkennung direkt auf dem Gerät)
- Vorschlagskatalog mit gängigen Rohstoffen; in dein Lager kommt nur, was du auswählst
- Import und Export (CSV/Excel), Sicherung als Datei
- Deutsch, Englisch, Spanisch

Deine Daten bleiben auf deinem Gerät. Es gibt kein Benutzerkonto, keine Werbung und keine Weitergabe.

INCIheinz ist eine reine Lagerverwaltung. Die App gibt keine Rezepte, keine Anwendungs- oder Wirkungsaussagen und keine Sicherheitsbewertungen.

(Englisch und Spanisch erstelle ich, sobald der Text steht.)

**Kategorie:** Produktivität oder Lifestyle (Entscheidung offen).
**Kontakt für den Store:** E-Mail-Adresse, Website (Datenschutzseite genügt zunächst).

## 2. Grafiken, die du später brauchst
- App-Symbol 512×512 PNG
- Funktionsgrafik 1024×500
- mindestens 2 Handy-Screenshots (besser 4 bis 8), optional Tablet-Screenshots
- Die Screenshots erstellen wir aus der fertigen App, mit Beispieldaten ohne echte Marken.

## 3. Datensicherheit (Play Console, Formular „Datensicherheit“)
Ausgangslage: Die App sendet nichts an Server. Die Antworten gelten nur, solange das so bleibt.

| Frage | Antwort |
|---|---|
| Erhebt oder teilt die App Nutzerdaten? | Nein (alles bleibt auf dem Gerät) |
| Daten verschlüsselt übertragen? | Nicht zutreffend, keine Übertragung |
| Nutzer können Löschung verlangen? | Löschen durch Deinstallation; in der App „Alle Daten löschen“ ergänzen |
| Datenschutzerklärung (URL) | Pflicht, Entwurf unten |

Zu prüfen bei der Portierung: Jede Bibliothek (z. B. Kamera, OCR, Update-Dienste) auf Datenübertragung prüfen. Bei Google ML Kit (Texterkennung auf dem Gerät) die Angaben zum Datenschutz nachlesen. Sobald etwas gesendet wird (Absturzberichte, Analyse), ändern sich die Antworten.

## 4. Berechtigungen und Begründungstexte
| Berechtigung | Wofür | Text |
|---|---|---|
| Kamera | Produktseite, Verpackung, Barcode lesen | „INCIheinz nutzt die Kamera, um Verpackungen und Barcodes einzulesen. Die Bilder werden nur auf deinem Gerät verarbeitet.“ |
| Dateizugriff | Sicherung und Import | über den Systemdialog zur Dateiauswahl, keine breite Speicherberechtigung anfordern |
| Internet | Katalogupdate (falls aktiv) | nur nennen, wenn die App es nutzt |

## 5. Inhaltsfreigabe und Zielgruppe
- Zielgruppe: Erwachsene (18+). Das vermeidet zusätzliche Auflagen für Kinder-Apps.
- Fragebogen zur Inhaltsfreigabe: keine Gewalt, keine nutzergenerierten Inhalte, die andere sehen, kein Glücksspiel. Die Einstufung ergibt sich aus deinen Antworten.
- Gesundheitsangaben: Die App macht keine. Das muss auch so bleiben: keine „hilft bei…“-Texte, keine Sicherheitsbewertung von Inhaltsstoffen.

## 6. Datenschutzerklärung (Entwurf, Deutsch)

**Datenschutzerklärung für die App INCIheinz**
Stand: [Datum]

**Verantwortlicher:** [Vor- und Nachname], [Straße, PLZ Ort], [E-Mail]

**Kurzfassung:** INCIheinz speichert alle Daten ausschließlich lokal auf deinem Gerät. Wir betreiben keinen Server, auf den deine Daten übertragen werden. Es gibt kein Benutzerkonto, keine Werbung und keine Analysewerkzeuge.

**Welche Daten verarbeitet die App?** Alle Angaben, die du selbst einträgst: Rohstoffe, Mengen, Preise, Lieferanten, Notizen und Fotos. Sie liegen im Speicher der App auf deinem Gerät.

**Kamera und Bilder:** Aufnahmen und ausgewählte Bilder werden nur für die Texterkennung auf dem Gerät verwendet. Sie werden nicht hochgeladen.

**Katalog:** Der Vorschlagskatalog ist eine Liste, die mit der App mitgeliefert wird. [Falls die App Updates online abruft: Dabei wird deine IP-Adresse vom Hosting-Anbieter technisch verarbeitet. Es werden keine Inhalte deines Lagers übertragen.]

**Sicherungen:** Sicherungsdateien erstellst und speicherst du selbst. Wohin du sie kopierst (Cloud, E-Mail, Speicherkarte), entscheidest du. Für diese Ablage bist du verantwortlich.

**Weitergabe an Dritte:** Findet nicht statt.

**Speicherdauer und Löschung:** Die Daten bleiben, bis du sie in der App löschst oder die App deinstallierst. Bei der Deinstallation werden sie entfernt. Eine Sicherungsdatei bleibt bestehen, bis du sie löschst.

**Deine Rechte:** Da wir keine personenbezogenen Daten von dir erhalten, können wir keine Auskunft zu gespeicherten Daten geben. Alle deine Daten kannst du jederzeit in der App einsehen, exportieren und löschen. Bei Fragen erreichst du uns unter [E-Mail].

**Änderungen:** Wir passen diese Erklärung an, wenn sich die App ändert.

*Hinweis zur Veröffentlichung:* Die Erklärung braucht eine öffentliche URL. Das geht auf GitHub Pages (eigene Seite `privacy.html` im selben Repo). Später auf eigener Domain.

## 7. Recht und Konto
- Als Privatperson verkaufst du nicht, solange die App kostenlos ist und ohne Werbung läuft. Sobald Einnahmen entstehen (Bezahl-App, In-App-Käufe, Werbung), gelten Impressumspflicht und steuerliche Pflichten. Das vor der Preisgestaltung klären (Steuerberatung).
- Im Play-Konto erscheint dein Name bzw. deine Anschrift öffentlich, sobald du Einnahmen hast. Bei Privatkonto bedenken.
- Marken: Im Katalog und in Screenshots keine geschützten Produktnamen oder Logos verwenden, nur generische Rohstoffnamen und INCI-Bezeichnungen.

## 8. Checkliste vor dem ersten Upload
1. Play-Konto angelegt, Identität bestätigt
2. Datenschutzseite online (URL)
3. Store-Eintrag mit Texten und Grafiken (DE, ggf. EN/ES)
4. Datensicherheit und Inhaltsfreigabe ausgefüllt
5. Interner Test mit eigenen Geräten
6. Geschlossener Test: 12 Tester, 14 Tage am Stück
7. Antrag auf Produktionszugriff
