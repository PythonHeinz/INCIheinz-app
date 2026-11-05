/* ================= v0.8: Sicherung, Import, Lieferanten, Etiketten, Anleitung, Kamera ================= */
const FOLD=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
function adoptLief(){S.lief=S.lief||{};S.items.forEach(i=>i.bezug.forEach(b=>{if(b.lief&&!S.lief[b.lief])S.lief[b.lief]={frei:0,versand:0}}));(S.shop||[]).forEach(s=>{if(s.lief&&!S.lief[s.lief])S.lief[s.lief]={frei:0,versand:0}})}
function loadCatX(){S.catadd=S.catadd||[];S.catfix=S.catfix||{};S.catadd.forEach(c=>{if(!CM[c.id]){CAT.push(c);CM[c.id]=c}});Object.keys(S.catfix).forEach(id=>{if(CM[id])Object.assign(CM[id],S.catfix[id])})}
const attr=s=>esc(JSON.stringify(s));
/* ---------- Lieferanten ---------- */
let LIEFCB=null,LE=null,BZPRE='',BZST=null;
function liefsHtml(){const ls=Object.keys(S.lief).sort((a,b)=>a.localeCompare(b));return ls.map(l=>{const c=S.lief[l]||{};const sub=[c.versand?'Versand '+eur(c.versand):'',c.frei?'frei ab '+eur(c.frei):''].filter(Boolean).join(' · ');return `<div class="row" style="padding:0 2px" onclick="LIEFCB=null;sheetLiefEdit(${attr(l)})"><div class="t"><b>${esc(l)}</b>${sub?`<div class="s">${sub}</div>`:''}</div>${ic('chev','var(--sub)',18)}</div>`}).join('')||'<div class="s">Noch keine Lieferanten.</div>'}
function liefOpts(sel){const ls=Object.keys(S.lief).sort((a,b)=>a.localeCompare(b));return `<option value="">– wählen –</option>`+ls.map(l=>`<option value="${esc(l)}" ${l===sel?'selected':''}>${esc(l)}</option>`).join('')+`<option value="__n">+ Neuen Lieferanten anlegen …</option>`}
function sheetLiefEdit(l){const c=l?(S.lief[l]||{}):{};LE=l;openSheet(`<h2>${l?'Lieferant':'Neuer Lieferant'}</h2>
<label class="fld"><span>Name</span><input id="l1" value="${esc(l||'')}" placeholder="z. B. Dragon Spice"></label>
<div class="two"><label class="fld"><span>Versandkosten (€)</span><input id="l2" inputmode="decimal" value="${c.versand||''}"></label><label class="fld"><span>Kostenfrei ab (€)</span><input id="l3" inputmode="decimal" value="${c.frei||''}"></label></div>
<label class="fld"><span>Webseite (optional)</span><input id="l4" value="${esc(c.url||'')}" placeholder="https://…"></label>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveLief()">Speichern</button><button class="btn sec" onclick="liefBack()">Abbrechen</button></div>${l?`<div class="btns"><button class="btn danger" onclick="delLief()">Lieferant entfernen</button></div>`:''}`);if(!l)setTimeout(()=>{const e=$('#l1');e&&e.focus()},50)}
function liefBack(){const cb=LIEFCB;LIEFCB=null;if(cb)cb(null);else sheetSettings()}
function saveLief(){const n=val('l1').trim();if(!n){$('#er').textContent='Bitte einen Namen eingeben.';return}
if(n!==LE&&S.lief[n]){$('#er').textContent='Diesen Lieferanten gibt es schon.';return}
const c={versand:num(val('l2'))||0,frei:num(val('l3'))||0,url:val('l4').trim()};
if(LE&&n!==LE){delete S.lief[LE];S.items.forEach(i=>i.bezug.forEach(b=>{if(b.lief===LE)b.lief=n}));S.shop.forEach(s=>{if(s.lief===LE)s.lief=n})}
S.lief[n]=c;save();const cb=LIEFCB;LIEFCB=null;if(cb)cb(n);else sheetSettings()}
function delLief(){const l=LE;if(S.items.some(i=>i.bezug.some(b=>b.lief===l))||S.shop.some(s=>s.lief===l)){toast('Wird noch bei Rohstoffen verwendet');return}delete S.lief[l];save();sheetSettings()}
function sheetBezug(id,bid){const st=BZST;BZST=null;sheetBezug0(id,bid);BZPRE='';if(st)['f2','f3','f4','f5'].forEach(k=>{if(st[k]!=null)$('#'+k).value=st[k]})}
function newLiefFromBezug(id,bid){BZST={f2:val('f2'),f3:val('f3'),f4:val('f4'),f5:val('f5')};LIEFCB=n=>{BZPRE=n||'';sheetBezug(id,bid)};sheetLiefEdit(null)}
/* ---------- Sicherung / Export / Import ---------- */
function dlFile(name,text,mime){const b=new Blob([text],{type:mime});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
function doBackup(){closeSheet();dlFile('inciheinz-sicherung-'+today()+'.json',JSON.stringify(Object.assign({app:'inciheinz',v:1},S)),'application/json');toast('Sicherung gespeichert')}
function sheetExport(){openSheet(`<h2>Export</h2>`+[['shield','Sicherung (Datei)','Alles inklusive Fotos, zum Wiederherstellen','sheetBackup()'],['export','Bestandsliste (Tabelle)','CSV für Excel oder Tabellen','doCsv()']].map(x=>`<div class="row" style="padding:0 2px" onclick="${x[3]}"><div style="width:32px;display:flex;justify-content:center">${ic(x[0],'var(--pri)')}</div><div class="t"><b>${x[1]}</b><div class="s">${x[2]}</div></div>${ic('chev','var(--sub)',18)}</div>`).join(''))}
function doCsv(){closeSheet();const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';const rows=[['Name','INCI','Kategorie','Menge','Einheit','EAN','MHD','Verwendung','Notiz','Lieferant','Preis','Preis für Menge']];
S.items.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(i=>{const b=i.bezug.slice().reverse().sort((x,y)=>x.datum<y.datum?1:x.datum>y.datum?-1:0)[0];rows.push([i.name,i.inci,i.kat,i.unk?'':nf(i.total,3),BASE[i.kind],i.ean||'',i.mhd||'',i.verw,i.notiz,b?b.lief:'',b?nf(b.preis,2):'',b?nf(b.menge,3):''])});
dlFile('inciheinz-bestand-'+today()+'.csv','﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n'),'text/csv');toast('Tabelle gespeichert')}
function parseCSV(text){text=String(text||'').replace(/^﻿/,'');const first=text.split(/\r?\n/,1)[0]||'';let d=';',best=-1;[';',',','\t'].forEach(c=>{const n=first.split(c).length;if(n>best){best=n;d=c}});
const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const ch=text[i];if(q){if(ch==='"'){if(text[i+1]==='"'){cell+='"';i++}else q=false}else cell+=ch}else if(ch==='"')q=true;else if(ch===d){row.push(cell);cell=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);cell='';rows.push(row);row=[]}else cell+=ch}
if(cell!==''||row.length){row.push(cell);rows.push(row)}return rows.filter(r=>r.some(c=>String(c).trim()!==''))}
const COLMAP={name:['name','bezeichnung','produkt','produktname','zutat','rohstoff','artikel'],inci:['inci','incibezeichnung','incideklaration'],kategorie:['kategorie','gruppe','typ'],form:['form','konsistenz'],menge:['menge','bestand','anzahl'],einheit:['einheit'],preis:['preis','kosten'],quelle:['quelle','lieferant','shop','link','bezugsquelle'],verwendung:['verwendung','wirkweise','wirkung','anwendung'],mhd:['mhd','haltbarkeit','mindesthaltbarbis'],notiz:['notiz','bemerkung','anmerkung','kommentar'],beschreibung:['beschreibung','info'],ean:['ean','barcode','gtin','ean13']};
function pNum(s){s=String(s||'').replace(/[^\d,.\-]/g,'');if(!s)return null;if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');else s=s.replace(',','.');const n=parseFloat(s);return isNaN(n)?null:n}
function pDate(v){v=String(v||'').trim();const m=v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);if(m)return m[3]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2);return /^\d{4}-\d{2}-\d{2}$/.test(v)?v:''}
let IMP=null;
function csvPlan(rows){if(rows.length<2)return {error:'Die Datei enthält keine Datenzeilen.'};
const head=rows[0].map(h=>FOLD(h).replace(/[^a-z0-9]/g,''));const col={};Object.keys(COLMAP).forEach(k=>{for(let i=0;i<head.length;i++)if(COLMAP[k].includes(head[i])&&col[k]==null)col[k]=i});
if(col.name==null)return {error:'Keine Spalte „Name“ gefunden. Die erste Zeile braucht Überschriften, zum Beispiel: Name; INCI; Menge.'};
const haveN={},haveC={},haveE={};S.items.forEach(i=>{haveN[FOLD(i.name)]=1;if(i.cid)haveC[i.cid]=1;if(i.ean)haveE[i.ean]=1});
const kats=[...new Set(CAT.map(c=>c.k))];const neu=[];let schon=0,leer=0;const seen={};
for(let r=1;r<rows.length;r++){const row=rows[r];const g=k=>col[k]==null?'':String(row[col[k]]==null?'':row[col[k]]).trim();
const name=g('name');if(!name){leer++;continue}const key=FOLD(name);const c=CAT.find(x=>FOLD(x.n)===key)||null;const ean=g('ean').replace(/\s+/g,'');
if(haveN[key]||seen[key]||(c&&haveC[c.id])||(ean&&haveE[ean])){schon++;continue}seen[key]=1;
const eh=g('einheit');const u=Object.keys(U).find(x=>FOLD(x)===FOLD(eh))||'g';const mg=pNum(g('menge'));const kind=U[u].k;const total=mg>0?toB(mg,u):0;
const inci=g('inci');const kt=FOLD(g('kategorie'));const kat=kt?kats.find(k=>{const x=FOLD(k);return x===kt||x.startsWith(kt)||kt.startsWith(x)}):null;
let note=g('notiz');if(g('kategorie')&&!kat&&!c)note=(note?note+' · ':'')+'Kategorie (Import): '+g('kategorie');
const pr=pNum(g('preis').replace(/[€\s]/g,''));const q=g('quelle');
const o={kind,total,unk:mg==null,verw:g('verwendung'),beschr:g('beschreibung'),mhd:pDate(g('mhd')),ean,quelle:q};
let it;if(c){it=mk(c,o);if(inci&&FOLD(inci)!==FOLD(c.i)){it.inci=inci;it.ist='ungeprüft'}}else{it=mk(null,Object.assign(o,{name,inci,ist:inci?'ungeprüft':'eigen',kat:kat||'Eigene',form:FORMS_OK(g('form'))}))}
if(pr!=null&&mg>0){it.bezug.push({id:uid(),lief:q&&!/^https?:/i.test(q)?q:'Import',nr:'',preis:pr,menge:total,kind,datum:today()})}else if(pr!=null){note=(note?note+' · ':'')+'Preis (Import): '+nf(pr,2)+' €'}
it.notiz=note;neu.push(it)}
return {neu,schon,leer,cols:Object.keys(col).length}}
function FORMS_OK(f){return ['flüssig','fest','pulver','pastös'].find(x=>FOLD(x)===FOLD(f))||''}
function doImport(inp){const f=inp.files[0];if(!f)return;if(/\.xlsx$/i.test(f.name)){f.arrayBuffer().then(b=>{inp.value='';return xlsxRows(b)}).then(rows=>{const p=csvPlan(rows);if(p.error){sheetMsg('Einlesen nicht möglich',p.error);return}IMP={plan:p};sheetImpPrev()}).catch(()=>sheetMsg('Datei nicht lesbar','Die Excel-Datei konnte nicht gelesen werden. Speichere sie als .xlsx oder .csv.'));return}
f.text().then(t=>{inp.value='';t=t.replace(/^﻿/,'');
if(/^\s*\{/.test(t)){try{const d=JSON.parse(t);if(!Array.isArray(d.items))throw 0;IMP={json:d};sheetRestore()}catch(e){sheetMsg('Datei nicht lesbar','Das ist keine gültige Sicherungsdatei.')}return}
const p=csvPlan(parseCSV(t));if(p.error){sheetMsg('Einlesen nicht möglich',p.error);return}IMP={plan:p};sheetImpPrev()})}
function sheetMsg(h,t){openSheet(`<h2>${h}</h2><div style="font-size:.9rem">${esc(t)}</div><div class="btns"><button class="btn" onclick="closeSheet()">OK</button></div>`)}
function sheetImpPrev(){const p=IMP.plan;if(!p.neu.length){sheetMsg('Nichts Neues','Alle '+p.schon+' Einträge sind schon im Lager.');return}
openSheet(`<h2>Tabelle einlesen</h2><div style="font-size:1rem;font-weight:600">${p.neu.length} neu, ${p.schon} schon vorhanden</div><div class="s" style="margin-top:4px">Schon vorhandene Rohstoffe werden nicht verändert. Fehlende Angaben ergänzt du später in der App.</div>
<div class="card" style="margin-top:10px;padding:4px 14px">${p.neu.slice(0,8).map(i=>`<div class="kv"><span>${esc(i.name)}</span><span class="s">${i.unk?'Menge offen':fmt(i.total,i.kind)}</span></div>`).join('')}${p.neu.length>8?`<div class="s" style="padding:8px 0">… und ${p.neu.length-8} weitere</div>`:''}</div>
<div class="btns"><button class="btn" onclick="impGo()">${p.neu.length} hinzufügen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function impGo(){const p=IMP.plan;p.neu.forEach(i=>S.items.push(i));adoptLief();save();closeSheet();tab('lager');toast(p.neu.length+' Rohstoffe hinzugefügt')}
function sheetRestore(){const d=IMP.json;const n=d.items.length;openSheet(`<h2>Sicherung einlesen</h2><div style="font-size:1rem;font-weight:600">${n} Rohstoffe in der Datei</div><div class="s" style="margin-top:4px">Du hast aktuell ${S.items.length} Rohstoffe. Wähle, wie die Sicherung übernommen werden soll.</div>
<div class="btns col"><button class="btn" onclick="restoreMerge()">Nur neue Rohstoffe ergänzen</button><button class="btn danger" onclick="restoreAll()">Alles ersetzen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function restoreAll(){const d=IMP.json;delete d.app;delete d.v;S=d;S.items=S.items.map(normI);S.shop=S.shop||[];S.lief=S.lief||{};if(!S.orte)S.orte=['Regal','Schrank','Schublade','Kühlschrank'];S.seeded=true;adoptLief();loadCatX();save();closeSheet();tab('lager');toast('Sicherung eingelesen')}
function restoreMerge(){const d=IMP.json;const hn={},hc={};S.items.forEach(i=>{hn[FOLD(i.name)]=1;if(i.cid)hc[i.cid]=1});let n=0;d.items.map(normI).forEach(i=>{if((i.cid&&hc[i.cid])||hn[FOLD(i.name)])return;S.items.push(i);n++});
Object.keys(d.lief||{}).forEach(l=>{if(!S.lief[l])S.lief[l]=d.lief[l]});(d.orte||[]).forEach(o=>{if(!S.orte.includes(o))S.orte.push(o)});adoptLief();save();closeSheet();tab('lager');toast(n+' Rohstoffe ergänzt')}
/* ---------- Katalog aktualisieren ---------- */
let CU=null;
async function sheetCatUpd(){openSheet(`<h2>Katalog aktualisieren</h2><div class="s" style="margin-bottom:8px">Installiert: ${S.catmeta&&S.catmeta.version?'Katalog '+esc(S.catmeta.version)+(S.catmeta.date?' vom '+dde(S.catmeta.date):''):'Grundkatalog der App'} · ${CAT.length} Einträge</div><div id="cu" class="s">Suche nach einer neuen Katalogversion …</div>`);
try{const r=await fetch('katalog.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();if(!Array.isArray(d.items))throw 0;
const neu=d.items.filter(c=>!CM[c.id]);const fix=[],conf=[];
d.items.forEach(c=>{const o=CM[c.id];if(!o)return;const ch=['n','i','k','h','a','u','s','q','p'].some(k=>c[k]!=null&&c[k]!==o[k]);if(!ch)return;
fix.push(c);if(c.i!=null&&c.i!==o.i)S.items.forEach(it=>{if(it.cid===c.id&&it.inci&&it.inci!==o.i&&it.inci!==c.i)conf.push({it,c})})});
const inciN=fix.filter(c=>c.i!=null&&c.i!==CM[c.id].i).length;CU={neu,fix,conf,meta:{version:d.version||'',date:d.date||''}};
if(!neu.length&&!fix.length){$('#cu').innerHTML=`<div style="font-size:1rem;font-weight:600">Dein Katalog ist aktuell.</div><div class="s" style="margin-top:4px">Katalog ${esc(d.version||'')}${d.date?' vom '+dde(d.date):''} · ${CAT.length} Einträge</div><div class="btns"><button class="btn" onclick="closeSheet()">OK</button></div>`;return}
$('#cu').innerHTML=`<div style="font-size:1rem;font-weight:600">${neu.length} ${neu.length===1?'neuer Eintrag':'neue Einträge'}, ${inciN} ${inciN===1?'INCI-Korrektur':'INCI-Korrekturen'}</div><div class="s" style="margin-top:4px">Deine Mengen, Preise, Texte, Fotos und eigenen Änderungen bleiben unverändert.</div>
${conf.length?`<div class="cap" style="margin:14px 0 4px">Du hast die INCI selbst geändert</div><div class="s">Haken setzen = Katalog-Fassung übernehmen.</div>${conf.map((x,n)=>`<label class="chk" style="margin:8px 0 0;align-items:flex-start"><input type="checkbox" id="cf${n}"> <span><b>${esc(x.it.name)}</b><br><span class="s">Deine: ${esc(x.it.inci)}<br>Katalog: ${esc(x.c.i)}</span></span></label>`).join('')}`:''}
<div class="btns"><button class="btn" onclick="catApply()">Aktualisieren</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`}
catch(e){$('#cu').innerHTML=`<div style="font-size:.9rem">Es ist gerade kein Katalog-Update erreichbar. Prüfe die Internetverbindung und versuche es später noch einmal.</div><div class="btns"><button class="btn" onclick="closeSheet()">OK</button></div>`}}
function catApply(){const {neu,fix,conf}=CU;const ok=new Set();conf.forEach((x,n)=>{if($('#cf'+n)&&$('#cf'+n).checked)ok.add(x.it.id)});
const confIds=new Set(conf.map(x=>x.it.id));
fix.forEach(c=>{const o=CM[c.id];S.items.forEach(it=>{if(it.cid!==c.id||c.i==null||c.i===o.i)return;if(it.inci===o.i||!it.inci||ok.has(it.id)){it.inci=c.i}});
const f={};['n','i','k','h','a','u','s','q','p'].forEach(k=>{if(c[k]!=null)f[k]=c[k]});S.catfix[c.id]=Object.assign(S.catfix[c.id]||{},f);Object.assign(o,f)});
neu.forEach(c=>{S.catadd.push(c);CAT.push(c);CM[c.id]=c});S.catmeta=CU.meta;save();closeSheet();draw();toast('Katalog aktualisiert')}
/* ---------- Etiketten ---------- */
let LB={size:'M',sel:{},mark:true,only:false};
const LFIT={S:12,M:15,L:15};
function labelHtml(i,sz){const mw=Math.max(1,...String(i.name).split(/[\s\/]+/).map(w=>w.length));const k=Math.max(.6,Math.min(1,LFIT[sz]/mw));return `<div class="label size-${sz}" lang="de"><div class="lq">${QR.toSVG('INCIHEINZ:'+i.id,{margin:1})}</div><div class="lt"><div class="ln" style="--k:${k.toFixed(2)}">${esc(i.name)}</div><div class="lc">${esc(i.id.toUpperCase())}</div>${i.inci?`<div class="lin">${esc(i.inci)}</div>`:''}</div></div>`}
function sheetLabels(){if(!S.items.length){sheetMsg('Keine Rohstoffe','Lege zuerst Rohstoffe an, dann kannst du Etiketten drucken.');return}
openSheet(`<h2>Etiketten &amp; Druck</h2><div class="cap" style="margin:6px 0">Größe</div><div id="lbs" style="display:flex;gap:8px;flex-wrap:wrap"></div>
<div id="lbp" style="margin:12px 0 4px;overflow:hidden"></div>
<div class="cap" style="margin:12px 0 4px">Rohstoffe wählen</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px"><button class="pill" onclick="lbAll(1)">Alle</button><button class="pill" onclick="lbAll(0)">Keine</button><button class="pill" onclick="lbNew()">Noch nicht gedruckt</button></div>
<div id="lbl" style="max-height:34vh;overflow-y:auto;border:1px solid var(--line);border-radius:12px;padding:4px 12px"></div>
<label class="chk"><input type="checkbox" ${LB.mark?'checked':''} onchange="LB.mark=this.checked"> Danach als gedruckt markieren</label>
<div class="btns"><button class="btn" id="lbgo" onclick="lbPrint()">Drucken</button></div>
<div class="hint">Der Druckdialog deines Geräts öffnet sich. Wähle dort „Tatsächliche Größe“ bzw. 100 %, damit die Etiketten maßgetreu bleiben.</div>`);lbRender()}
function lbRender(){const SZ={S:'Klein 38×21',M:'Mittel 48×25',L:'Groß 63×38'};
$('#lbs').innerHTML=Object.keys(SZ).map(k=>`<button class="pill" style="${LB.size===k?'background:var(--pri);color:#fff;border-color:var(--pri)':''}" onclick="LB.size='${k}';lbRender()">${SZ[k]} mm</button>`).join('');
const l=S.items.slice().sort((a,b)=>a.name.localeCompare(b.name));
$('#lbl').innerHTML=l.map(i=>`<label class="chk" style="margin:0;padding:8px 0;align-items:center"><input type="checkbox" ${LB.sel[i.id]?'checked':''} onchange="LB.sel['${i.id}']=this.checked;lbRender2()"> <span style="min-width:0;overflow-wrap:anywhere">${esc(i.name)}${i.gedr?` <span class="s">· gedruckt ${dde(i.gedr)}</span>`:''}</span></label>`).join('');lbRender2()}
function lbRender2(){const l=S.items.filter(i=>LB.sel[i.id]);const first=l[0]||S.items[0];$('#lbp').innerHTML=first?`<div class="s" style="margin-bottom:4px">Vorschau</div>${labelHtml(first,LB.size)}`:'';$('#lbgo').textContent=l.length?`${l.length} ${l.length===1?'Etikett':'Etiketten'} drucken`:'Drucken'}
function lbAll(on){S.items.forEach(i=>LB.sel[i.id]=!!on);lbRender()}
function lbNew(){LB.sel={};S.items.forEach(i=>{if(!i.gedr)LB.sel[i.id]=true});lbRender()}
function lbPrint(){const l=S.items.filter(i=>LB.sel[i.id]);if(!l.length){toast('Bitte Rohstoffe auswählen');return}
let p=document.getElementById('prt');if(p)p.remove();p=document.createElement('div');p.id='prt';p.innerHTML=`<div class="lsheet">${l.map(i=>labelHtml(i,LB.size)).join('')}</div>`;document.body.appendChild(p);
const done=()=>{window.removeEventListener('afterprint',done);const e=document.getElementById('prt');if(e)e.remove();if(LB.mark){l.forEach(i=>i.gedr=today());save();if(document.getElementById('lbl'))lbRender()}};
window.addEventListener('afterprint',done);setTimeout(()=>window.print(),80)}
/* ---------- Anleitung ---------- */
const HILFE=[
['Überblick','INCIheinz ist dein privates Rohstofflager für Naturkosmetik: Du siehst, was da ist, was knapp wird, was bald abläuft und was du nachkaufen willst. Alle Daten bleiben auf diesem Gerät. Die App verwaltet nur dein Lager. Verwendung, Notizen und Beschreibungen schreibst du selbst.'],
['Rohstoffe anlegen','Tippe in der Mitte auf „Neu“. Gib einen Namen ein und wähle einen Katalogtreffer, dann kommen INCI und Kategorie automatisch mit. Findest du nichts, legst du einen eigenen Rohstoff an. Die Menge darf leer bleiben. Alles Weitere ergänzt du auf der Rohstoff-Seite über den Stift.'],
['Regal-Check','Unter „Lager“ findest du den Regal-Check: Kategorie wählen, Regal durchgehen und antippen, was du hast. Die Mengen sind dann zunächst „?“ und werden nachgetragen, wenn du sie kennst.'],
['Bestand, Gefäße und Preise','Mit „Bestand ändern“ buchst du Zu- und Abgänge. Gefäße sind optional und nur nötig, wenn du Teilmengen getrennt verwalten willst. Bei „Bezugsquelle“ trägst du Lieferant, Preis und Menge ein. Jeder Preis wird mit Datum gespeichert, daraus entstehen Preisverlauf und Preis je 100 g/ml.'],
['Lieferanten','Unter Mehr › Einstellungen verwaltest du deine Lieferanten mit Versandkosten, Grenze für kostenfreien Versand und Webseite. Neue Lieferanten legst du auch direkt bei der Bezugsquelle an. Die Lieferanten aus bereits erfassten Preisen werden automatisch übernommen.'],
['Einkaufsliste','Rohstoffe setzt du über „Auf Einkaufsliste“ oder die Kachel „Knapp“. Die Liste ist nach Lieferant gruppiert und zeigt Versandkosten. Mit „Gekauft“ wird die Menge im Lager gebucht.'],
['Etiketten drucken','Unter Mehr › Etiketten & Druck wählst du eine Größe (klein 38×21, mittel 48×25, groß 63×38 mm) und die Rohstoffe. Auf jedem Etikett stehen QR-Code, Artikelcode, Name und INCI. Gedruckt wird über den Druckdialog deines Geräts, am besten mit „Tatsächliche Größe“ auf Etikettenbogen oder Papier zum Ausschneiden.'],
['Eingabe und Fotos','Im Tab „Eingabe“ scannst du QR- und Barcodes und liest Produktseiten. Ein eigenes Etikett öffnet sofort den Rohstoff. Einen fremden Code, etwa den Barcode einer Verpackung, kannst du einem Rohstoff zuordnen oder dafür einen neuen anlegen. Ein Bild für einen Rohstoff änderst du auf der Artikelseite über das Kamera-Symbol, für einen neuen Rohstoff nimmst du es mit „+“ › „Mit Foto anlegen“ auf. Fotos bleiben auf dem Gerät.'],
['Sichern und Import','Unter Mehr › Sicherung speicherst du eine Datei mit allen Daten inklusive Fotos. Mache das regelmäßig und vor einem Handywechsel. Zum Wiederherstellen wählst du Mehr › Import und die Datei. Mit dem Import kannst du auch eine Tabelle (CSV) einlesen. Sie braucht Überschriften, mindestens „Name“, gern auch INCI, Menge, Einheit, Preis, Quelle oder EAN. Doppelte Einträge werden übersprungen, vor dem Einlesen siehst du eine Vorschau.'],
['Katalog aktualisieren','Unter Mehr › Katalog aktualisieren holt die App neue Katalogeinträge und INCI-Korrekturen. Deine Mengen, Preise, Texte und Fotos werden dabei nie verändert. Hast du eine INCI selbst geändert, fragt die App nach.'],
['Wenn etwas nicht klappt','Kamera geht nicht: Erlaube den Kamerazugriff in den Browser- oder App-Einstellungen oder gib den Code von Hand ein. Die Daten liegen im Browser dieses Geräts: Lösche keine Browserdaten, ohne vorher eine Sicherung zu machen. Zum Installieren wählst du im Browsermenü „Zum Startbildschirm hinzufügen“.']];
function sheetHilfe(){openSheet(`<h2>Anleitung</h2>`+HILFE.map((h,n)=>`<details class="ac" ${n===0?'open':''}><summary>${h[0]}</summary><p>${h[1]}</p></details>`).join(''))}
/* ---------- Scannen, Codes, Fotos ---------- */
let CAM=null,PH=null,FI=null;
function scan2(){$('#main').innerHTML=`<div style="font-size:1.2rem;font-weight:600;letter-spacing:-.02em">Eingabe</div><div class="s" style="margin:6px 0 14px">Codes scannen und Produktseiten lesen. Neue Rohstoffe legst du mit „+“ an.</div>
<div class="card" style="overflow:hidden">${[['barcode','Code scannen','Barcode oder QR-Code von Etikett oder Verpackung','camStart()'],['anleitung','Produktseite lesen','Foto, Screenshot oder Text einer Lieferantenseite',"sheetProduct(null)"]].map(x=>`<div class="row" onclick="${x[3]}"><div class="chip">${ic(x[0],'var(--pri)',22)}</div><div class="t"><b>${x[1]}</b><div class="s">${x[2]}</div></div>${ic('chev','var(--sub)',18)}</div>`).join('')}</div>
<div class="cap" style="margin:18px 0 6px">Code von Hand eingeben</div><div style="display:flex;gap:8px"><input id="mc" placeholder="Artikelcode oder EAN" style="flex:1;min-width:0;height:46px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit;background:var(--surf);color:var(--txt)"><button class="btn" onclick="handleCode(val('mc'))">Öffnen</button></div>`}
function ownId(raw){const s=String(raw||'').trim();const m=s.match(/^INCIHEINZ:([A-Za-z0-9]+)$/i)||s.match(/#\/i\/([A-Za-z0-9]{3,10})\s*$/);const id=(m?m[1]:s).toLowerCase();return S.items.find(i=>i.id.toLowerCase()===id)||null}
function handleCode(raw){const s=String(raw||'').trim();if(!s)return;const own=ownId(s);if(own){stack=[];R={name:'artikel',id:own.id,edit:false};draw();return}
const code=s.replace(/\s+/g,'');const hit=S.items.find(i=>i.ean&&(i.ean===code||i.ean===s));if(hit){stack=[];R={name:'artikel',id:hit.id,edit:false};draw();return}
sheetUnknown(s)}
function sheetUnknown(code){openSheet(`<h2>Unbekannter Code</h2><div class="card" style="padding:12px 14px;margin:6px 0 10px;overflow-wrap:anywhere;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.9rem">${esc(code)}</div><div class="s">Dieser Code gehört noch zu keinem Rohstoff. Neu anlegen?</div>
<div class="btns col"><button class="btn" onclick="sheetNeu('',${attr(code)})">Neuen Rohstoff anlegen</button><button class="btn sec" onclick="sheetFind('Zu welchem Rohstoff gehört der Code?',null,id=>{getI(id).ean=${attr(code)};save();closeSheet();stack=[];R={name:'artikel',id,edit:false};draw();toast('Code gespeichert')})">Vorhandenem Rohstoff zuordnen</button></div>`)}
function sheetFind(title,thumb,cb){FI={cb};openSheet(`<h2>${title}</h2>${thumb?`<div style="display:flex;gap:12px;align-items:center;margin:6px 0"><img src="${thumb}" style="width:64px;height:64px;border-radius:12px;object-fit:cover"><div class="s">Das Bild wird für diesen Rohstoff verwendet.</div></div>`:''}<input id="fq" placeholder="Rohstoff suchen …" style="width:100%;height:46px;border:2px solid var(--pri);border-radius:12px;padding:0 14px;font:inherit;font-size:.95rem;background:var(--surf);color:var(--txt);margin-top:8px"><div id="fl" style="margin-top:6px"></div>${thumb?`<button class="btn sec" style="width:100%;margin-top:10px" onclick="sheetNeu('',null,PH.data)">Neuen Rohstoff anlegen</button>`:''}`);$('#fq').oninput=findList;findList()}
function findList(){const q=FOLD(val('fq'));const l=S.items.filter(i=>!q||FOLD(i.name+' '+i.inci).includes(q)).sort((a,b)=>a.name.localeCompare(b.name)).slice(0,8);$('#fl').innerHTML=l.map(i=>`<div class="hit" onclick="FI.cb('${i.id}')"><b>${esc(i.name)}</b><div class="s">${esc(i.kat)}</div></div>`).join('')||'<div class="hint" style="padding:8px 0">Nichts gefunden.</div>'}
async function camStart(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!('BarcodeDetector' in window)){toast('Automatisches Scannen ist hier nicht möglich – bitte Code von Hand eingeben');const e=$('#mc');if(e)e.focus();return}
$('#app').insertAdjacentHTML('beforeend',`<div id="camov" class="camov"><video id="camv" playsinline muted></video><div class="camfr"></div><div class="camtx">Code in den Rahmen halten</div><div class="cambt"><button class="btn sec" style="flex:1" onclick="camStop()">Schließen</button></div></div>`);
try{const want=['qr_code','ean_13','ean_8','upc_a','upc_e','code_128','code_39'];let sup=want;try{const s=await BarcodeDetector.getSupportedFormats();sup=want.filter(f=>s.includes(f))}catch(_){}
CAM={st:await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false}),det:new BarcodeDetector({formats:sup}),on:true};
const v=$('#camv');v.srcObject=CAM.st;await v.play();
const tick=async()=>{if(!CAM||!CAM.on)return;try{const r=await CAM.det.detect(v);if(r.length){const raw=r[0].rawValue;camStop();handleCode(raw);return}}catch(e){}setTimeout(tick,200)};tick()}
catch(e){camStop();toast('Kamera nicht erlaubt oder nicht verfügbar')}}
function camStop(){if(CAM){CAM.on=false;try{CAM.st.getTracks().forEach(t=>t.stop())}catch(_){}CAM=null}const o=document.getElementById('camov');if(o)o.remove()}
function photoPick(mode,itemId){PH={item:itemId||null};const inp=document.createElement('input');inp.type='file';inp.accept='image/*';if(mode==='cam')inp.setAttribute('capture','environment');window._pi=inp;inp.onchange=()=>{const f=inp.files[0];if(f)photoLoad(f)};inp.click()}
function photoLoad(f){const url=URL.createObjectURL(f);const im=new Image();im.onload=()=>{PH.img=im;PH.url=url;PH.z=1;PH.cx=im.width/2;PH.cy=im.height/2;cropSheet()};im.onerror=()=>toast('Bild nicht lesbar');im.src=url}
function cropSide(){return Math.min(PH.img.width,PH.img.height)/PH.z}
function cropClamp(){const s=cropSide();PH.cx=Math.max(s/2,Math.min(PH.img.width-s/2,PH.cx));PH.cy=Math.max(s/2,Math.min(PH.img.height-s/2,PH.cy))}
function cropDraw(o){const cv=o||$('#cv');const c=cv.getContext('2d');const s=cropSide();c.fillStyle='#fff';c.fillRect(0,0,cv.width,cv.height);c.drawImage(PH.img,PH.cx-s/2,PH.cy-s/2,s,s,0,0,cv.width,cv.height)}
function cropSheet(){openSheet(`<h2>Ausschnitt wählen</h2><div class="s">Bild mit dem Finger verschieben, mit dem Regler vergrößern.</div><canvas id="cv" width="360" height="360" style="width:100%;max-width:300px;aspect-ratio:1;display:block;margin:10px auto;border-radius:14px;background:#000;touch-action:none"></canvas><input type="range" id="cz" min="1" max="4" step="0.05" value="1" style="width:100%"><div class="btns"><button class="btn" onclick="cropOk()">Weiter</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);
const cv=$('#cv');cropDraw();$('#cz').oninput=e=>{PH.z=+e.target.value;cropClamp();cropDraw()};let d=null;
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);d={x:e.clientX,y:e.clientY}};
cv.onpointermove=e=>{if(!d)return;const k=cropSide()/cv.getBoundingClientRect().width;PH.cx-=(e.clientX-d.x)*k;PH.cy-=(e.clientY-d.y)*k;d={x:e.clientX,y:e.clientY};cropClamp();cropDraw()};cv.onpointerup=cv.onpointercancel=()=>{d=null}}
function cropOk(){const cv=document.createElement('canvas');cv.width=cv.height=480;cropDraw(cv);PH.data=cv.toDataURL('image/jpeg',.82);try{URL.revokeObjectURL(PH.url)}catch(_){}PH.img=null;
if(PH.item){setFoto(PH.item,PH.data);return}sheetFind('Zu welchem Rohstoff?',PH.data,id=>setFoto(id,PH.data))}
function setFoto(id,data){const i=getI(id);if(!i)return;i.foto=data;save();closeSheet();stack=[];R={name:'artikel',id,edit:false};draw();toast('Foto gespeichert')}
function sheetFotoMenu(id){openSheet(`<h2>Foto</h2>`+[['kamera','Foto aufnehmen',`photoPick('cam','${id}')`],['foto','Foto aus Galerie',`photoPick('gal','${id}')`]].concat(getI(id)&&getI(id).foto?[['loeschen','Foto entfernen',`delFoto('${id}')`]]:[]).map(x=>`<div class="row" style="padding:0 2px" onclick="closeSheet();${x[2]}"><div style="width:32px;display:flex;justify-content:center">${ic(x[0],'var(--pri)')}</div><div class="t"><b>${x[1]}</b></div></div>`).join(''))}
function delFoto(id){const i=getI(id);i.foto='';save();draw()}
function heroHtml(i){return i.foto?`<div class="hero" onclick="sheetFotoMenu('${i.id}')"><img src="${i.foto}" alt=""></div>`:`<div style="margin-top:10px"><button class="pill" aria-label="Foto hinzufügen" title="Foto hinzufügen" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border-radius:50%" onclick="sheetFotoMenu('${i.id}')">${ic('kamera','var(--pri)',18)}</button></div>`}

function labelFor(id){LB.sel={};LB.sel[id]=true;sheetLabels()}
