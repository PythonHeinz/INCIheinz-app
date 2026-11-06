# Katalog erweitern: Form, Beschreibung/Funktion, Verwendung, Dichte, Einsatzbereich (Anleitung für den Katalog-Chat)

Ziel: Zu möglichst vielen Rohstoffen die Angaben unten recherchieren, neutral und knapp bewerten und in die vorbereiteten Felder des Katalogs eintragen. Du änderst nur die Katalogdateien, nie den App-Code, und baust die App nicht.

## Wo die Tabelle liegt
- Maßgeblich: `katalog.json` in der Wurzel des Repos GitHub **PythonHeinz/INCIheinz-app** (Branch main). Identische Kopie: `src/katalog_master.json`. Beide immer gleich halten (die App baut aus `src/katalog_master.json`).
- Auf dem PC: `C:\Users\Andreas\Toolsbyclaude\INCI-App-Projekt\repo\` (vor der Arbeit `git pull`).
- `src/katalog_naturkosmetik.csv` ist veraltet (Stand 0.4) und wird nicht gepflegt.
- Aufbau: `{"version":"1.1.2","date":"…","items":[{id,n,i,s,k,u,a,h, d,e0,e1,eq, b,v,f,bq}, …]}`, 1020 Einträge. `id` (z. B. K0448) ändert sich nie.
- Katalog = Referenzdaten. Die Daten des Nutzers (Lager, eigene Texte) liegen getrennt auf seinem Gerät und werden von dir nie berührt.

## Felder (seit Katalog 1.1.2 in jedem Eintrag vorhanden, leer = `null`)
| Feld | Bedeutung in der App | Format |
|---|---|---|
| `f` | **Form**, in der der Rohstoff vorliegt | genau einer dieser Werte: `flüssig`, `Öl`, `fest`, `Wachs/Pellets`, `Pulver`, `Granulat`, `getrocknet`, `Paste/Gel` |
| `b` | **Beschreibung / Funktion**: was der Stoff technisch ist oder tut | ein knapper Ausdruck oder Satz, bis 120 Zeichen, z. B. „Emulgator für Öl-in-Wasser-Cremes“, „Lösungsvermittler für Fettalkohol-Emulsionen“, „Mildes Tensid“ |
| `v` | **Verwendung / Wirkweise**: Einsatzkonzentration je Anwendungsfall, falls es mehrere gibt, plus ein knapper Eigenschaftsbegriff | bis 250 Zeichen, z. B. „2–3 % mit Gelbildner, 3–4 % als alleiniger Emulgator; schaumverstärkend“ |
| `d` | **Dichte** in g/ml, Mittelwert der gefundenen Angaben | Zahl, 3 Nachkommastellen, 0,1 bis 3 |
| `e0` / `e1` | **Einsatz von / bis** in % der Gesamtmenge im Rezept | Zahlen, `e0` ≤ `e1` ≤ 100 |
| `eq` | Herkunftsvermerk für `d`, `e0`, `e1` | Text bis 200 Zeichen |
| `bq` | Herkunftsvermerk für `f`, `b`, `v` und Validierungsstufe | Text bis 200 Zeichen |

## Wie die App die Werte nutzt (wichtig für deine Bewertung)
- Der Nutzer sieht deine Werte als „Vorschlag aus dem Katalog, ungeprüft“ in seinen Rohstoff-Feldern. Er kann alles ändern; **sein Wert hat immer Vorrang**, auch bei späteren Katalog-Updates. Unveränderte Vorschläge folgen dagegen späteren Katalogkorrekturen.
- `e0`/`e1` prüft der Rechner „Dosierung prüfen“ gegen den Rezeptanteil. Ein falscher Wert löst also falsche Warnungen aus. Lieber leer als falsch.
- Exporte übernehmen den Vorschlag, wenn der Nutzer nichts geändert hat, sonst seinen Text.

## Regeln
1. Nur **leere** (`null`) Felder füllen, nie Vorhandenes überschreiben, keine bestehenden Felder (`n`, `i`, `k` …) ändern.
2. Aus Suchtexten nur Fakten und Zahlen übernehmen, keine Sätze kopieren (Regel 12 in `regeln.md`). `b` und `v` sind eigene, neutrale Formulierungen.
3. `f`: nur die Werte der Liste. Passt keiner sicher, leer lassen.
4. `v`: Konzentrationen je Anwendungsfall, dazu höchstens ein Eigenschaftsbegriff aus der Recherche (z. B. „schaumverstärkend“, „rückfettend“, „konsistenzgebend“). Keine Heil-, Krankheits- oder Gesundheitsaussagen (z. B. „heilt“, „lindert“, „gegen Akne“). Haut- und Pflegeeigenschaften nur als Eigenschaft des Rohstoffs und nur, wenn mehrere Quellen sie nennen.
5. Mehrere Anwendungsfälle: `e0` = kleinster, `e1` = größter genannter Wert, die Einzelfälle in `v`. Mehrere Dichten (Temperatur, Form): Mittelwert in `d`, Spanne in `eq`.
6. Unsichere, widersprüchliche oder unplausible Angaben: Feld **leer lassen**. Besonders vorsichtig bei Konservierern, Säuren, Laugen und Duftstoffen (Sicherheitsrelevanz).
7. Alles Automatische ist **ungeprüft**. Dichte bei festen Pulvern ohne sinnvolle Dichte leer lassen.
8. Jede Angabe braucht einen Herkunftsvermerk (`eq`/`bq`): Art der Quelle, Datum, Validierungsstufe. Keine Markennamen als Quelle nötig, aber nachvollziehbar.
9. Keine Rezepte, keine Preise.

## Empfohlener Ablauf mit Validierungsstufen (mit dem Nutzer abstimmen)
1. Analyse: für welche Kategorien welche Felder sinnvoll sind.
2. Pilot mit etwa 20 Einträgen, Durchsicht durch den Nutzer, Regeln nachschärfen.
3. Stapelweise je Kategorie in einer eigenen Arbeitsdatei (nicht direkt in `katalog.json`). Je Eintrag Validierungsstufe festhalten, zum Beispiel: Stufe 1 eine Quelle, Stufe 2 mindestens zwei unabhängige Quellen stimmen überein, Stufe 3 durch den Nutzer bestätigt.
4. Plausibilitätsprüfung (Formelwerte, Bereiche, Spannen, Kategorie passt zur Form).
5. Zusammenführen nur gültiger Werte, Version auf 1.2.0, `date` setzen, in beide Dateien schreiben.
6. Prüfen: JSON gültig, Anzahl der Einträge unverändert, keine `id` geändert, nur die vorgesehenen Felder gefüllt.
7. Commit („Katalog 1.2.0: …, ungeprüft“), nach main pushen. Der Nutzer testet in der App mit Mehr › Katalog aktualisieren. Eigene Werte und Texte des Nutzers bleiben dabei unverändert.
- Nicht gleichzeitig mit einem App-Build arbeiten: vor dem Start `git pull`, nach dem Push dem Nutzer Bescheid geben.
