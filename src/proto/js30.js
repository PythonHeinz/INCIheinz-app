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

/* ---------- Etikettendruck: Rohstoffe über Suchzeile auswählen, Druckliste darunter ---------- */
function lbHead(){const n=S.items.filter(i=>LB.sel[i.id]).length;const h=document.getElementById('lbhead');if(h)h.textContent=n?`Druckliste · ${n} ${n===1?'Rohstoff':'Rohstoffe'}`:'Druckliste'}
function lbList(){const l=S.items.filter(i=>LB.sel[i.id]).sort((a,b)=>a.name.localeCompare(b.name,'de'));const e=document.getElementById('lbl');if(!e)return;
e.innerHTML=l.length?l.map(i=>`<div class="row" style="padding:4px 0;cursor:default;align-items:center"><div class="t" style="min-width:0"><span style="overflow-wrap:anywhere">${esc(i.name)}</span>${i.gedr?` <span class="s">· gedruckt ${dde(i.gedr)}</span>`:''}</div><button class="ib" style="color:var(--sub)" onclick="LB.sel['${i.id}']=false;lbList();lbRender2();lbSearch(window.__lbq||'')" aria-label="Entfernen">${ic('x','var(--sub)',20)}</button></div>`).join(''):'<div class="s" style="padding:8px 0">Noch nichts gewählt. Suche oben nach einem Rohstoff und tippe ihn an.</div>';lbHead()}
function lbSearch(v){window.__lbq=v;const e=document.getElementById('lbres');if(!e)return;const q=FOLD(String(v||'').trim());if(!q){e.innerHTML='';return}
const r=S.items.filter(i=>!LB.sel[i.id]&&(FOLD(i.name).includes(q)||FOLD(i.inci||'').includes(q))).sort((a,b)=>a.name.localeCompare(b.name,'de')).slice(0,12);
e.innerHTML=r.length?`<div style="border:1px solid var(--line);border-radius:12px;padding:2px 12px;margin-bottom:8px">${r.map(i=>`<div class="row" style="padding:8px 0;cursor:pointer" onclick="lbPickOne('${i.id}')"><div class="t" style="min-width:0"><span style="overflow-wrap:anywhere">${esc(i.name)}</span></div><span class="s">hinzufügen</span></div>`).join('')}</div>`:'<div class="s" style="margin-bottom:8px">Nichts gefunden oder schon in der Druckliste.</div>';try{if(LANG!=='de')trWalk(e)}catch(x){}}
function lbPickOne(id){LB.sel[id]=true;const q=document.getElementById('lbq');if(q)q.value='';window.__lbq='';lbSearch('');lbList();lbRender2()}
{const s5=sheetLabels;sheetLabels=function(){s5.apply(this,arguments);const l=document.getElementById('lbl');if(!l)return;
l.insertAdjacentHTML('beforebegin',`<div class="search" style="margin:4px 0 8px"><span style="padding:0 6px 0 12px;display:flex">${ic('search','var(--sub)',18)}</span><input id="lbq" placeholder="Rohstoff suchen" oninput="lbSearch(this.value)"></div><div id="lbres"></div><div class="cap" id="lbhead" style="margin:10px 0 4px">Druckliste</div>`);
l.style.maxHeight='32vh';lbList();try{if(LANG!=='de')trWalk(document.getElementById('sheet'))}catch(x){}}}
{const r5=lbRender;lbRender=function(){const l=document.getElementById('lbl');const keep=l?l.innerHTML:'';r5.apply(this,arguments);lbList()}}
