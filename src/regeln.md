# Regeln für den Katalog (Entwurf)

1. Ein Eintrag = ein INCI-Stoff. Handelsnamen kommen in `aliasse`, nicht in `name_de`.
2. Kein Markenname und kein Händlername im Hauptnamen.
3. Einzelne Fakten (Stoffname, INCI, Kategorie, Form) dürfen übernommen werden. Keine Übernahme ganzer Sortimente, Preislisten oder Texte einzelner Shops.
4. Jede Angabe bekommt in `quelle_intern` einen Herkunftsnachweis (mindestens: wo gesehen, Datum).
5. `inci_status` = geprüft nur, wenn gegen Datenblatt/Etikett oder zwei unabhängige Quellen abgeglichen und in `inci_pruefquelle` vermerkt.
6. `kurzbeschreibung`: ein Satz, eigene Formulierung, sachlich, keine Heil- oder Wirkversprechen. Texte aus Wikipedia nur mit Lizenzprüfung (CC BY-SA: Namensnennung, Weitergabe unter gleicher Lizenz).
7. Keine Preise im Katalog. Der Preis gehört dem Nutzer.
8. Nicht im Katalog: Rezepte, Heilaussagen und eigene Dosierungsempfehlungen der App. Ausnahme (ab Katalog 1.1.2): Form `f`, Beschreibung/Funktion `b`, Verwendung `v`, Dichte `d` und Einsatzbereich `e0`/`e1` als sachliche Richtwerte mit Herkunftsvermerk (`eq`, `bq`), immer „ungeprüft“; der Nutzer kann sie am Rohstoff überschreiben. Siehe `KATALOG_ERWEITERUNG.md`.
9. Werbung mit Zahlen („1500 geprüft“) nur, wenn sie stimmen: Anzahl = Zeilen mit inci_status=geprüft.
10. Eine Beschreibung braucht mindestens zwei unabhängige Quellen. Wikipedia dient nur als Faktenquelle, Sätze werden neu formuliert.
11. Wirkungen stehen nicht als Aussage der App im Katalog. Ausnahme: knappe Eigenschaftsbegriffe im Feld `v` (z. B. schaumverstärkend, rückfettend) als „ungeprüfter Katalogvorschlag“, nie Heil- oder Gesundheitsaussagen. Sie gehören in das Notizfeld des Nutzers, mit Hinweis „ohne Gewähr“.
12. Texte aus Herstellerseiten, Shops und Blogs werden nicht übernommen, auch nicht gekürzt. Übernommen werden Namen, INCI, Funktion und Tensidklasse.
13. INCI aus einer Liste ohne Datenblatt bleibt „ungeprüft“. Erst eine zweite unabhängige Quelle setzt „geprüft“.
