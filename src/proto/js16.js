/* ---------- v1.1: Menüs aufgeräumt, Rückgängig im Kontext, Packungsgrößen ---------- */
const shEl=()=>document.getElementById('sheet');
const rowH=x=>`<div class="row" style="padding:6px 2px" onclick="${x[3]}"><div style="width:32px;display:flex;justify-content:center">${ic(x[0],x[4]||'var(--pri)')}</div><div class="t"><b${x[4]?` style="color:${x[4]}"`:''}>${x[1]}</b>${x[2]?`<div class="s">${x[2]}</div>`:''}</div>${ic('chev','var(--sub)',18)}</div>`;

/* Mehr-Menü */
sheetMehr=function(){const g=(t,a)=>`<div class="cap" style="margin:12px 0 0">${t}</div>`+a.map(x=>rowH([x[0],x[1],'',x[2]])).join('');
openSheet(g('Arbeiten',[['tag','Etiketten &amp; Druck',"sheetLabels()"],['cart','Einkaufsliste',"tab('einkauf');closeSheet()"],['stat','Statistik',"closeSheet();go('stat')"]])+g('Daten',[['import','Import',"sheetImport()"],['export','Export',"sheetExport()"],['shield','Sicherung',"sheetBackup()"],['refresh','Katalog aktualisieren',"sheetCatUpd()"]])+g('App',[['gear','Einstellungen',"sheetSettings()"],['book','Anleitung',"sheetHilfe()"],['info','Info',"sheetInfo()"]]))};

/* Import: erst erklären, dann Dateiauswahl */
function sheetImport(){openSheet(`<h2>Import</h2><div class="s" style="margin-bottom:6px">Hol Listen in dein Lager. Neue Rohstoffe werden angelegt, bei vorhandenen kommen neue Preise dazu. Du siehst vorher eine Vorschau, es wird nichts ohne Bestätigung geändert.</div>
<div class="cap" style="margin:12px 0 2px">Diese Formate kann die App lesen</div>
<div style="font-size:.9rem;line-height:1.5"><b>Excel</b> (.xlsx), erstes Tabellenblatt<br><b>CSV, TSV, Text</b> (.csv, .tsv, .txt), Trennzeichen werden erkannt</div>
<div class="cap" style="margin:12px 0 2px">Typische Quellen</div>
<div style="font-size:.9rem;line-height:1.5">Preisliste eines Lieferanten<br>Deine bisherige Lagerliste in Excel<br>Bestellung oder Rechnung als Tabelle<br>Export aus einer anderen App</div>
<div class="cap" style="margin:12px 0 2px">Diese Spalten werden erkannt</div>
<div class="s">Name, INCI, Kategorie, Menge, Einheit, Preis, Datum, Lieferant, EAN, MHD, Verwendung, Notiz. Die Überschriften müssen nicht exakt so heißen.</div>
<div class="cap" style="margin:12px 0 2px">Noch keine Tabelle?</div>
<div class="s">Die Vorlage ist eine leere CSV-Datei mit den richtigen Spalten und einer Beispielzeile. Du speicherst sie, füllst sie in Excel oder Google Sheets aus und wählst sie dann mit „Datei auswählen“. Beim Speichern der Vorlage wird nichts importiert.</div>
<div class="hint" style="margin:10px 0 0">Eine Sicherung der ganzen App lädst du unter Mehr › Sicherung.</div>
<input type="file" id="imp" accept=".xlsx,.csv,.tsv,.txt,text/csv,text/plain" style="display:none" onchange="doImport(this)">
<div class="btns"><button class="btn" onclick="$('#imp').click()">Datei auswählen</button><button class="btn sec" onclick="impTpl()">Vorlage herunterladen</button></div>`)}
function impTpl(){dlFile('inciheinz-vorlage.csv','﻿Name;INCI;Kategorie;Menge;Einheit;Preis;Datum;Lieferant;EAN;MHD;Verwendung;Notiz\r\n"Sheabutter Bio";"Butyrospermum Parkii Butter";"Butter & Wachs";250;g;5,90;05.11.2026;"Beispiel-Shop";;;"Körperbutter";\r\n','text/csv;charset=utf-8');toast('Vorlage gespeichert')}

/* Export: nur Tabellen, mit PDF */
sheetExport=function(){openSheet(`<h2>Export</h2><div class="s" style="margin-bottom:6px">Tabellen zum Bestellen, Weitergeben oder Weiterarbeiten. Formate: Excel, CSV, PDF oder Text zum Teilen per E-Mail oder Messenger.</div>`+[['cart','Einkaufsliste','Nach Lieferant oder als ganze Liste','sheetExpShop()'],['export','Bestandstabelle','Mit Filter und Spaltenauswahl','sheetExpStock()']].map(x=>rowH(x)).join('')+`<div class="hint" style="margin:10px 0 0">Eine Sicherung der ganzen App speicherst du unter Mehr › Sicherung.</div>`)};
fmtRadios=function(){return `<div class="cap" style="margin:14px 0 2px">Format</div>`+[['xlsx','Excel (.xlsx)','öffnet sich überall korrekt'],['csv','CSV (.csv)','UTF-8 mit Semikolon, für Tabellen-Programme'],['pdf','PDF','zum Ansehen, Drucken oder Senden'],['txt','Text','kopieren oder per E-Mail und Messenger teilen']].map(f=>`<label class="chk" style="align-items:flex-start;margin-top:10px"><input type="radio" name="xf" value="${f[0]}" ${XF===f[0]?'checked':''} onchange="XF=this.value"> <span>${f[1]}<br><span class="s">${f[2]}</span></span></label>`).join('')};
const outFile1=outFile;
outFile=function(base,head,rows,fmt,txt,sheet){if(fmt==='pdf'){pdfOut(base,head,rows,sheet);return}return outFile1(base,head,rows,fmt,txt,sheet)};
function pdfOut(base,head,rows,title){const h=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(base)}</title><style>body{font:12px/1.4 sans-serif;margin:16px;color:#111}h1{font-size:16px;margin:0 0 10px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}</style></head><body><h1>${esc(title||'INCIheinz')} · ${dde(today())}</h1><table><tr>${head.map(x=>`<th>${esc(x)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(String(csvNum(v==null?'':v)))}</td>`).join('')}</tr>`).join('')}</table></bo`+`dy></ht`+`ml>`;
closeSheet();const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){toast('Drucken nicht möglich')}setTimeout(()=>f.remove(),120000)};f.srcdoc=h}

/* Sicherung: Backup speichern, laden, Rückgängig, Löschen */
sheetBackup=function(){const bk=S.lastBackup?'Letzte Sicherung: '+dde(S.lastBackup):'Noch keine Sicherung erstellt.';
openSheet(`<h2>Sicherung</h2><div class="s" style="margin-bottom:6px">Deine Daten liegen nur auf diesem Gerät, es gibt keine Cloud. Ein Backup ist eine einzige Datei mit allem, auch den Fotos. Du brauchst sie für ein neues Handy oder nach dem Löschen der App-Daten.</div><div class="s" style="font-weight:600">${bk}</div>
<div style="margin-top:6px">${rowH(['shield','Backup speichern','Datei im Ordner „Downloads“, danach an einen sicheren Ort kopieren',"doBackup()"])}${rowH(['import','Backup laden','Stellt den Stand einer Sicherungsdatei wieder her (.json)',"$('#impb').click()"])}${UNDO?rowH(['refresh','Letzte Änderung rückgängig',esc(UNDO.label),"closeSheet();doUndo(true)"]):''}</div>
<input type="file" id="impb" accept=".json,application/json" style="display:none" onchange="doImport(this)">
<div style="height:26px"></div><div class="cap" style="margin:0 0 2px;color:var(--err)">Gefahrenbereich</div>${rowH(['trash','Alle Daten löschen','Speichere vorher ein Backup',"sheetClear()",'var(--err)'])}`)};

/* Einstellungen: Bereiche klar trennen */
const sheetSettings1=sheetSettings;
sheetSettings=function(){sheetSettings1();const s=shEl();if(!s)return;s.querySelectorAll('.cap').forEach(c=>{c.style.cssText+=';font-size:1rem;font-weight:700;color:var(--pri);letter-spacing:0;text-transform:none;border-bottom:2px solid var(--muted);padding-bottom:6px;margin-bottom:8px'});
s.querySelectorAll('div').forEach(d=>{const h=d.getAttribute('style')||'';if(/^height:(18|22)px$/.test(h.trim())){d.style.height='30px'}})};

/* Rückgängig: bleibt bis zum Schließen oder Seitenwechsel, mit Namen */
function undoOffer(label,snap,now,bar){hideUndo();UNDO={label,snap,post:hsh(now)};if(bar)showUndo()}
function showUndo(){hideUndo();const d=document.createElement('div');d.id='undob';d.style.cssText='position:fixed;left:12px;right:12px;bottom:88px;z-index:130;background:#24332b;color:#fff;border-radius:12px;padding:8px 6px 8px 14px;display:flex;gap:6px;align-items:center;font-size:.88rem;box-shadow:0 6px 20px rgba(0,0,0,.25)';
d.innerHTML=`<span style="flex:1;overflow-wrap:anywhere">${esc(UNDO.label)}</span><button style="background:transparent;color:#bfe3cf;border:1px solid #5f7a6b;border-radius:10px;padding:7px 12px;font:inherit;font-weight:600">Rückgängig</button><button aria-label="Schließen" style="background:transparent;border:0;color:#fff;padding:6px 10px;font-size:1.1rem">✕</button>`;
const b=d.querySelectorAll('button');b[0].onclick=()=>{hideUndo();doUndo(true)};b[1].onclick=hideUndo;document.body.appendChild(d);clearTimeout(showUndo.t);showUndo.t=setTimeout(hideUndo,6000)}
['go','tab','back'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){hideUndo();return f.apply(this,arguments)}});
const UNDO_BAR=new Set(['doDel','delVessel','impGo','restoreAll','restoreMerge','prodApply','delFoto','delLief','delShop']);
let TOASTED=0;
function toast(t){TOASTED=1;const e=$('#toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',1800)}
function undoWrap(n,label){const f=window[n];if(typeof f!=='function')return;window[n]=function(){const a0=arguments[0];const it=typeof a0==='string'&&getI?getI(a0):null;const lb=it&&it.name?'„'+it.name+'“: '+label:label;const snap=JSON.stringify(S);TOASTED=0;const r=f.apply(this,arguments);const fin=()=>{const now=JSON.stringify(S);if(now!==snap){undoOffer(lb,snap,now,UNDO_BAR.has(n));if(!UNDO_BAR.has(n)&&!TOASTED)toast('✓ '+lb)}};if(r&&typeof r.then==='function')r.then(fin);else fin();return r}}

/* Packungsgrößen als Auswahl bei der Einkaufsliste */
const sheetShop1=sheetShop;
sheetShop=function(id){sheetShop1(id);const i=getI(id),s=shEl();if(!i||!s)return;const m=new Map();i.bezug.forEach(b=>{if(!(b.menge>0))return;const k=Math.round(b.menge*1000)/1000;const o=m.get(k);if(!o||b.preis<o.preis)m.set(k,b)});
const L=[...m.entries()].sort((a,b)=>a[0]-b[0]).slice(0,6);if(!L.length)return;
const chips=L.map(([k,b])=>{const u=pickU(k,i.kind);const v=Math.round(k/U[u].f*1000)/1000;return `<button type="button" class="pill" onclick="packPick(${v},'${u}','${esc(b.lief||'').replace(/'/g,"\\'")}')">${nf(v,3)} ${u}${b.preis>0?' · '+eur(b.preis):''}</button>`}).join(' ');
const two=s.querySelector('.two');if(two)two.insertAdjacentHTML('beforebegin',`<div class="cap" style="margin:12px 0 4px">Erhältliche Packungen</div><div style="display:flex;gap:8px;flex-wrap:wrap">${chips}</div>`)};
function packPick(v,u,lief){const a=document.getElementById('f1'),b=document.getElementById('f2'),c=document.getElementById('f3');if(a)a.value=String(v).replace('.',',');if(b)b.value=u;if(c&&lief&&[...c.options].some(o=>o.value===lief||o.text===lief))c.value=lief}

/* Neuer Rohstoff mit Foto */
const sheetNeu2=sheetNeu;
sheetNeu=function(pre,ean,foto){sheetNeu2(pre,ean,foto);const s=shEl();if(!s)return;const p=[...s.querySelectorAll('button.pill')].find(b=>/Produktseite/.test(b.textContent));if(!p)return;
if(NEU.foto){p.insertAdjacentHTML('beforebegin',`<img src="${NEU.foto}" alt="" style="width:44px;height:44px;border-radius:10px;object-fit:cover;vertical-align:middle;margin:8px 8px 0 0">`);p.textContent='Foto ändern'}else p.textContent='Mit Foto anlegen';p.setAttribute('onclick','neuFoto()')};
function neuFoto(){const pre=val('n1'),ean=NEU.ean;photoPick('cam');PH.neu={pre,ean}}
const cropOk1=cropOk;
cropOk=function(){if(PH&&PH.neu){const n=PH.neu;const cv=document.createElement('canvas');cv.width=cv.height=480;cropDraw(cv);const d=cv.toDataURL('image/jpeg',.82);try{URL.revokeObjectURL(PH.url)}catch(_){}PH.img=null;PH.neu=null;sheetNeu(n.pre,n.ean,d);return}return cropOk1()};
