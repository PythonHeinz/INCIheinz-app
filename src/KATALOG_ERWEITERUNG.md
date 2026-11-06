# Katalog erweitern: Dichte und Einsatzbereich (Anleitung für den Katalog-Chat)

Ziel: Zu möglichst vielen Rohstoffen die Dichte und den Einsatzbereich (von/bis in %) im Katalog ergänzen. Du änderst nur die Katalogdateien, nie den App-Code.

## Wo die Tabelle liegt
- Maßgeblich: `katalog.json` in der Wurzel des Repos GitHub **PythonHeinz/INCIheinz-app** (Branch main). Eine identische Kopie liegt in `src/katalog_master.json`. Beide immer gleich halten (die App baut aus `src/katalog_master.json`).
- Auf dem PC des Nutzers: `C:\Users\Andreas\Toolsbyclaude\INCI-App-Projekt\repo\` (vor der Arbeit `git pull`).
- `src/katalog_naturkosmetik.csv` ist veraltet (Stand 0.4) und wird **nicht** gepflegt.
- Aufbau: `{"version":"1.1.0","date":"2026-11-05","items":[{id,n,i,s,k,u,a,h}, …]}`, 1020 Einträge. `id` (z. B. K0448) ändert sich nie.

## Neue Felder je Eintrag (seit Katalog 1.1.1 in jedem Eintrag vorhanden, leer = `null`)
| Feld | Bedeutung | Format |
|---|---|---|
| `d` | Dichte in g/ml, Mittelwert aus den gefundenen Angaben | Zahl, 3 Nachkommastellen, 0,1 bis 3 |
| `e0` | Einsatz von, in % der Gesamtmenge im Rezept | Zahl > 0 |
| `e1` | Einsatz bis, in % | Zahl ≥ `e0`, höchstens 100 |
| `eq` | Herkunftsvermerk, kurz | Text bis 200 Zeichen |

## Regeln
1. Nur **leere** (`null`) Felder füllen, nie Vorhandenes überschreiben, keine bestehenden Felder ändern.
2. Aus Suchtexten nur **Zahlen** übernehmen, keine Sätze kopieren (Regel 12 in `regeln.md`). In `eq` steht eine eigene Kurzfassung, z. B. „Websuche 2026-11-07, ungeprüft; 2–3 % mit Gelbildner, 3–4 % allein“.
3. Mehrere Anwendungsfälle: `e0` = kleinster, `e1` = größter genannter Wert; die Einzelfälle kurz in `eq`. Mehrere Dichten (Temperatur, Form): Mittelwert in `d`, Spanne in `eq`.
4. Unsichere, widersprüchliche oder unplausible Angaben: Feld **leer lassen**. Lieber keine Zahl als eine falsche. Gilt besonders für Konservierer, Säuren und Laugen.
5. Alles Automatische gilt als **ungeprüft**. Die App zeigt es als „Richtwert aus dem Katalog, ungeprüft“; eigene Werte des Nutzers haben Vorrang.
6. Keine Wirk- oder Gesundheitsaussagen, keine Rezepte.
7. Dichte bei festen Pulvern ohne sinnvolle Dichte leer lassen.

## Abschluss
- Prüfen: JSON gültig, 1020 Einträge (oder mehr), keine `id` geändert, nur die neuen Felder hinzugekommen, Plausibilität (`e0` ≤ `e1`).
- Die Felder sind bereits angelegt (alle `null`); du fügst keine Spalten hinzu. Die Fassung, die du vorfindest, ist 1.1.1.
- `version` auf 1.2.0 und `date` setzen, in beide Dateien schreiben, committen („Katalog 1.2.0: Dichte und Einsatzbereiche, ungeprüft“), nach main pushen.
- Die App übernimmt die neuen Felder über Mehr › Katalog aktualisieren. Bereits eingetragene Dichten und Einsatzbereiche des Nutzers bleiben unverändert; leere Dichten werden aus dem Katalog gefüllt.
- Nicht gleichzeitig mit einem App-Build arbeiten: vor dem Start `git pull`, nach dem Push dem Nutzer Bescheid geben. Der App-Chat holt die Änderung mit `git pull`.
