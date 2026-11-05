from i18n_en import EN,PATS as PEN
vals=[l.rstrip('\n') for l in open('es_vals.txt',encoding='utf-8')]
keys=list(EN.keys())
assert len(vals)==len(keys)
ES=dict(zip(keys,vals))
NEW={ # de: (en, es)
"Regal-Check":("Shelf check","Revisión de estantes"),
"REGAL-CHECK":("SHELF CHECK","REVISIÓN DE ESTANTES"),
"Katalog durchgehen und markieren, was du hast":("Go through the catalog and mark what you have","Recorre el catálogo y marca lo que tienes"),
"Wähle eine Kategorie, geh dein Regal durch und tippe auf alles, was du hast. Mengen und Details trägst du später nach.":("Choose a category, go through your shelf and tap everything you have. You can add quantities and details later.","Elige una categoría, recorre tu estante y toca todo lo que tienes. Las cantidades y los detalles los añades después."),
"In dieser Kategorie suchen …":("Search in this category …","Buscar en esta categoría …"),
"Hat schon Daten – bitte auf der Rohstoff-Seite entfernen":("Already has data – please remove it on the raw material page","Ya tiene datos: quítala en la página de la materia prima"),
"Regal-Check starten":("Start shelf check","Iniciar revisión de estantes"),
"Menge unbekannt":("Quantity unknown","Cantidad desconocida"),
"Menge unbekannt – trage sie mit „Bestand ändern“ nach.":("Quantity unknown – add it with “Change stock”.","Cantidad desconocida: añádela con „Cambiar existencias“."),
"Expertenmodus (Entwickleroptionen)":("Expert mode (developer options)","Modo experto (opciones de desarrollador)"),
"Einheitensystem: metrisch (SI)":("Unit system: metric (SI)","Sistema de unidades: métrico (SI)"),
"Dichte je Rohstoff (ml ↔ g)":("Density per raw material (ml ↔ g)","Densidad por materia prima (ml ↔ g)"),
"Menüleiste anpassen":("Customize menu bar","Personalizar la barra de menú"),
"in Vorbereitung":("in preparation","en preparación"),
}
for k,(e,s) in NEW.items(): EN[k]=e; ES[k]=s
PES=[
(r"^(\d+) Posten auf der Liste$",r"\1 artículos en la lista"),
(r"^Noch (.+) bis versandkostenfrei$",r"Faltan \1 para el envío gratis"),
(r"^Summe inkl\. (.+) Versand$",r"Total con \1 de envío"),
(r"^Aktuell im Lager: (.+)\. Du kannst den Rohstoff auch setzen, wenn noch etwas da ist\.$",r"Ahora en existencias: \1. También puedes ponerla si aún queda algo."),
(r"^Nenninhalt (.+)$",r"Volumen nominal \1"),
(r"^Füllstand \((.+)\)$",r"Nivel (\1)"),
(r"^Mindestmenge \((.+)\)$",r"Cantidad mínima (\1)"),
(r"^Versand: (.+)$",r"Envío: \1"),
(r"^Nur (.+)$",r"Solo \1"),
(r"^(\d+) Posten$",r"\1 artículos"),
(r"^„(.+)“ neu anlegen$",r"Crear „\1“"),
(r"^„(.+)“ wird mit allen Gefäßen, Texten und Preisen aus deinem Lager gelöscht\. Der Katalog bleibt unverändert\.$",r"„\1“ se eliminará de tus existencias junto con todos los envases, textos y precios. El catálogo no cambia."),
(r"^(\d+) Gefäße? hinzugefügt$",r"\1 envase(s) añadido(s)"),
(r"^Die Gesamtmenge liegt unter der Summe der Gefäße \((.+)\)\. Bitte zuerst den Füllstand eines Gefäßes anpassen\.$",r"El total es menor que la suma de los envases (\1). Ajusta primero el nivel de un envase."),
(r"^Der Füllstand ist größer als der Nenninhalt \((.+)\)\.$",r"El nivel es mayor que el volumen nominal (\1)."),
(r"^Tippe einen Namen – der Katalog enthält (\d+) Einträge\.$",r"Escribe un nombre – el catálogo contiene \1 entradas."),
(r"^Zuletzt bestellt: (.+)$",r"Último pedido: \1"),
(r"^Katalog 0\.3 · (\d+) Einträge$",r"Catálogo 0.3 · \1 entradas"),
]
PATS=PEN
from i18n7 import N7,P7
for k,(e,s) in N7.items():
    if k not in EN: EN[k]=e
    if k not in ES: ES[k]=s
for a,e,s in P7:
    PATS.insert(0,(a,e)); PES.insert(0,(a,s))
