/* ---------- Einstellungen (Mehr › Einstellungen): schlanke Liste, jede Auswahl öffnet eine eigene Seite mit Pfeil zurück zur Liste ---------- */
const setSub=(t,body)=>openSheet(`<h2>${t}</h2>${body}`);
const setMain=function(){const L={de:'Deutsch',en:'English',es:'Español'}[LANG]||'Deutsch';
return (`<h2>Einstellungen</h2><div class="s" style="margin-bottom:8px">Diese Einstellungen gelten für die ganze App, im Lager und im Rezeptbuch.</div>`
+rowH(['waves','Sprache',L,"pickLang()"])
+rowH(['shield','Sichern und zurücknehmen','Sicherung der ganzen App, letzte Änderung rückgängig',"sheetSetSich()"])
+rowH(['refresh','Katalog',(S.catmeta&&S.catmeta.version?'Katalog '+esc(S.catmeta.version):'Grundkatalog der App')+' · '+CAT.length+' Einträge',"sheetCatUpd()"])
+rowH(['cube','Mengeneinstellungen','Genauigkeit der Mengen',"sheetSetMengen()"])
+rowH(['book','Hilfe','Anleitung und Info',"sheetSetHilfe()"])
+rowH(['gear','Expertenmodus',S.expert?'An':'Aus',"sheetSetExp()"])
+(S.expert?rowH(['flask','Testbetrieb','Testdaten laden und entfernen',"sheetSetTest()"]):''))};
sheetAppSet=function(){SETCTX='app';openSheet(setMain())};
/* Die Liste, zu der der Pfeil zurückführt, wird beim Schließen der Unterseite aus dem Zwischenspeicher geholt: dort auffrischen */
const setNavFix=()=>{const x=SNAV[SNAV.length-1];if(x&&x.t==='Einstellungen')x.h=setMain()};
function sheetSetSich(){setSub('Sichern und zurücknehmen',rowH(['shield','Sicherung der ganzen App','Backup speichern und laden',"sheetBackup()"])+(UNDO?rowH(['refresh','Letzte Änderung rückgängig',esc(UNDO.label),"closeSheet();doUndo(true)"]):rowH(['refresh','Letzte Änderung rückgängig','Noch nichts zum Zurücknehmen','','var(--sub)'])))}
function sheetSetMengen(){setSub('Mengeneinstellungen',accHtml())}
function sheetSetHilfe(){setSub('Hilfe',rowH(['book','Anleitung','',"sheetHilfe()"])+rowH(['info','Info','',"sheetInfo()"]))}
function sheetSetExp(){setSub('Expertenmodus',`<label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert?'checked':''} onchange="S.expert=this.checked;save();setNavFix();sheetSetExp()"> Expertenmodus (Entwickleroptionen)</label>${S.expert?expertCard():'<div class="s" style="margin-top:8px">Schaltet zusätzliche Einheiten und den Testbetrieb frei.</div>'}`)}
function sheetSetTest(){setSub('Testbetrieb',`<div class="s" style="margin-bottom:6px">Zum Ausprobieren. Testdaten sind nicht geprüft und nicht zum Nachmischen gedacht.</div>${demoBlockHtml()}`)}
accSet=function(w,v){if(w==='l')S.lagerDec=v;else S.rezStep=v;save();try{draw()}catch(e){}sheetSetMengen()};
