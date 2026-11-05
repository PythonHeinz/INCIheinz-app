t=open('tpl3.html',encoding='utf-8').read()
def cut(a,b,new):
    global t
    i=t.index(a);j=t.index(b)
    t=t[:i]+new+t[j:]
# draw(): remove savebar
t=t.replace("""<main id="main"></main><div class="savebar" id="sb"><span>Ungespeicherte Änderungen</span><button class="btn g" onclick="draw()">Verwerfen</button><button class="btn" onclick="saveArt('${i.id}')">Speichern</button></div>`+navb('lager');artikel(i)}""","""<main id="main"></main>`+navb('lager');artikel(i)}""")
t=t.replace("function go(name,id){stack.push(R);R={name,id:id||null};draw()}","function go(name,id){stack.push(R);R={name,id:id||null,edit:false};draw()}")
cut("/* ---------- Artikel ---------- */","/* ---------- Bezug, Einkaufsliste ---------- */",r'''/* ---------- Rohstoff-Seite ---------- */
let ED={};
function artikel(i){const m=$('#main');const edit=!!R.edit;ED={kat:i.kat,form:i.form};
const vs=vsum(i),rest=Math.max(0,i.total-vs),pct=i.total?Math.min(100,vs/i.total*100):0;const ch=cheapest(i);
const bz={};i.bezug.forEach(x=>{(bz[x.lief]=bz[x.lief]||[]).push(x)});
const rows=Object.keys(bz).map(l=>{const a=bz[l].sort((x,y)=>x.datum<y.datum?1:-1);const x=a[0];const isb=ch&&ch.x===x;return `<div class="row" style="padding:8px 2px" onclick="sheetBezug('${i.id}','${x.id}')"><div class="t"><b>${esc(l)}</b><div class="s">${esc(x.nr||'')} · ${a.length>1?a.length+' Preise, zuletzt ':''}${dde(x.datum)}</div></div><div style="font-size:.88rem;${isb?'color:var(--pri);font-weight:600':''}">${priceTxt(x).t}</div></div>`}).join('');
const ist=i.ist==='geprüft'?'<span class="badge">INCI geprüft</span>':!i.inci?'<span class="badge u">INCI fehlt</span>':'<span class="badge u">INCI ungeprüft</span>';
const vrow=i.vessels.map(v=>{const st=v.amount<=0?'leer':v.amount>=v.cap-1e-9?'voll':'angebrochen';return `<div class="row" style="padding:6px 2px" onclick="sheetVessel('${i.id}','${v.id}')"><div class="chip">${vic(v.typ,'var(--pri)',22)}</div><div class="t"><b>${vname(v)}</b><div class="s">${fmt(v.amount,i.kind)} / ${fmt(v.cap,i.kind)}${v.ort?' · '+esc(v.ort):''}</div></div><span class="badge ${st==='voll'?'':'u'}">${st}</span></div>`}).join('');
const sel=(id,inner)=>`<button type="button" class="selbtn" id="${id}" onclick="${id==='pk_kat'?'pickKat()':'pickForm()'}">${inner}</button>`;
const katInner=`<span style="display:flex;align-items:center;gap:8px">${cic(ED.kat,'var(--pri)',18)}${esc(ED.kat)}</span><span style="color:var(--sub)">▾</span>`;
const formInner=`<span>${esc(ED.form||'–')}</span><span style="color:var(--sub)">▾</span>`;
const none='<span class="s">–</span>';
const stamm=edit?`<label class="fld"><span>Name des Rohstoffs (genauer Produktname)</span><input id="f_name" value="${esc(i.name)}"></label>
<label class="fld"><span>INCI-Bezeichnung</span><textarea id="f_inci" rows="2" placeholder="z. B. Simmondsia Chinensis Seed Oil">${esc(i.inci)}</textarea></label>
<div style="display:flex;gap:8px;margin-top:8px"><a class="pill" target="_blank" rel="noopener" href="#" onclick="this.href='https://www.google.com/search?q='+encodeURIComponent((val('f_name')||'')+' INCI')">Im Web suchen</a><button class="pill" type="button" onclick="sheetPaste()">Aus Text übernehmen</button></div>
<label class="chk"><input type="checkbox" id="f_ok" ${i.ist==='geprüft'?'checked':''}> INCI geprüft (z. B. mit Datenblatt oder Etikett)</label>
<div class="two"><div class="fld"><span>Kategorie</span>${sel('pk_kat',katInner)}</div><div class="fld"><span>Form</span>${sel('pk_form',formInner)}</div></div>`
:`<div class="kv"><span>INCI</span><span>${i.inci?esc(i.inci):none}</span></div><div class="kv"><span></span><span>${ist}</span></div><div class="kv"><span>Kategorie</span><span style="display:flex;gap:6px;align-items:center;justify-content:flex-end">${cic(i.kat,'var(--pri)',16)}${esc(i.kat)}</span></div><div class="kv"><span>Form</span><span>${esc(i.form||'–')}</span></div>`;
const tx=(l,v)=>v?`<div class="txt"><div class="s">${l}</div>${esc(v)}</div>`:'';
const eigen=edit?`<label class="fld"><span>Beschreibung</span><textarea id="f_beschr" placeholder="Eigene Beschreibung …">${esc(i.beschr)}</textarea></label>
<label class="fld"><span>Verwendung / Wirkweise</span><textarea id="f_verw" placeholder="z. B. Einsatz 1–5 % in der Fettphase, Massageöl">${esc(i.verw)}</textarea></label>
<label class="fld"><span>Notiz</span><textarea id="f_notiz">${esc(i.notiz)}</textarea></label>
<div class="hint">Diese Texte schreibst du selbst. Sie bleiben auf deinem Gerät und werden bei der Suche gefunden.</div>`
:(tx('Beschreibung',i.beschr)+tx('Verwendung / Wirkweise',i.verw)+tx('Notiz',i.notiz)||`<div class="s">Noch nichts eingetragen. Mit ${ic('pencil','currentColor',13)} oben kannst du eigene Texte ergänzen.</div>`);
const mhdb=edit?`<div class="two"><label class="fld"><span>Mindesthaltbar bis</span><input id="f_mhd" type="date" value="${esc(i.mhd)}"></label><label class="fld"><span>Mindestmenge (${BASE[i.kind]})</span><input id="f_min" inputmode="decimal" value="${i.min?nf(i.min):''}"></label></div>
<label class="fld"><span>Quelle (Shop-Link oder Lieferant)</span><input id="f_quelle" value="${esc(i.quelle)}" placeholder="https://…"></label>`
:`<div class="kv"><span>Mindesthaltbar bis</span><span>${dde(i.mhd)}${soon(i)?' '+ic('alarm','var(--ambt)',15):''}</span></div><div class="kv"><span>Mindestmenge</span><span>${i.min?fmt(i.min,i.kind):'–'}</span></div><div class="kv"><span>Quelle</span><span>${i.quelle?(/^https?:/.test(i.quelle)?`<a class="lnk" target="_blank" rel="noopener" href="${esc(i.quelle)}">Link öffnen ›</a>`:esc(i.quelle)):'–'}</span></div>`;
m.innerHTML=(edit?`<div class="editbar"><button class="ib" onclick="cancelEdit()" aria-label="Abbrechen">${ic('x','var(--txt)',22)}</button><span id="et">Bearbeiten</span><button class="btn" id="esv" disabled onclick="saveArt('${i.id}')">Speichern</button></div>`:'')+
`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="min-width:0"><div class="cap">${esc(i.kat)}</div><div style="font-size:1.35rem;font-weight:600;letter-spacing:-.02em;margin-top:4px;overflow-wrap:anywhere">${esc(i.name)}</div></div>${edit?'':`<button class="ib" style="margin:-4px -8px 0 0" onclick="R.edit=true;draw()" aria-label="Bearbeiten">${ic('pencil','var(--pri)',22)}</button>`}</div>
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px"><span class="s" style="overflow-wrap:anywhere">${esc(i.inci||'')}</span>${ist}</div>
${i.hint?`<div class="s" style="color:var(--ambt);margin-top:6px">${esc(i.hint)}</div>`:''}
<div class="card" style="margin-top:14px;padding:16px"><div class="s">Gesamtbestand</div><div style="font-size:1.9rem;font-weight:600;letter-spacing:-.02em;color:var(--pri)">${fmt(i.total,i.kind)}</div><div class="bar"><div style="width:${pct}%"></div></div>
<div style="display:flex;margin-top:12px;border-top:1px solid var(--line);padding-top:10px"><div style="flex:1"><b style="font-weight:600">${fmt(vs,i.kind)}</b><div class="s">in Gefäßen</div></div><div style="width:1px;background:var(--line)"></div><div style="flex:1;padding-left:16px"><b style="font-weight:600">${fmt(rest,i.kind)}</b><div class="s">ohne Gefäß</div></div></div>
<div class="btns" style="margin-top:14px"><button class="btn sec" onclick="sheetMenge('${i.id}')">Bestand ändern</button><button class="btn" onclick="sheetShop('${i.id}')">Auf Einkaufsliste</button></div>
<div style="display:flex;justify-content:space-between;margin-top:6px"><button class="lnk" onclick="used('${i.id}')">Aufgebraucht</button><button class="lnk" onclick="toast('Etikettendruck kommt in einer späteren Version')">Etikett</button></div></div>
<details class="acc" open><summary>Gefäße<small>${i.vessels.length?i.vessels.length:''}</small></summary><div class="in">${vrow||'<div class="s" style="margin-bottom:6px">Keine Gefäße – nur nötig, wenn du Teilmengen getrennt verwalten willst.</div>'}<button class="lnk" onclick="sheetVessel('${i.id}')">+ Gefäß hinzufügen</button></div></details>
<details class="acc" open><summary>INCI &amp; Stammdaten</summary><div class="in" id="af1">${stamm}</div></details>
<details class="acc" open><summary>Meine Angaben</summary><div class="in" id="af2">${eigen}</div></details>
<details class="acc"><summary>Haltbarkeit, Quelle &amp; Minimum</summary><div class="in" id="af3">${mhdb}</div></details>
<details class="acc"><summary>Bezugsquellen &amp; Preise<small>${i.bezug.length||''}</small></summary><div class="in">${rows||'<div class="s" style="margin-bottom:6px">Noch kein Bezug erfasst.</div>'}<button class="lnk" onclick="sheetBezug('${i.id}')">+ Bezug / neuer Preis</button>${i.ordered?`<div class="hint">Zuletzt bestellt: ${dde(i.ordered)}</div>`:''}</div></details>
${edit?'':`<div style="text-align:center;margin-top:18px"><button class="lnk" style="color:var(--err)" onclick="sheetDel('${i.id}')">Rohstoff entfernen</button></div>`}`;
if(edit)['af1','af2','af3'].forEach(k=>{const e=$('#'+k);e.addEventListener('input',dirty);e.addEventListener('change',dirty)})}
function dirty(){const b=$('#esv');if(b){b.disabled=false;b.textContent='Speichern *'}const t=$('#et');if(t)t.textContent='Bearbeiten *'}
function cancelEdit(){const b=$('#esv');if(b&&!b.disabled){openSheet(`<h2>Änderungen verwerfen?</h2><div style="font-size:.9rem">Deine Änderungen an diesem Rohstoff wurden noch nicht gespeichert.</div><div class="btns"><button class="btn danger" onclick="R.edit=false;draw()">Verwerfen</button><button class="btn" onclick="closeSheet()">Weiter bearbeiten</button></div>`)}else{R.edit=false;draw()}}
function pickKat(){pick('Kategorie',CATS.map(c=>[c,c,cic(c,'var(--pri)',20)]),ED.kat,v=>{ED.kat=v;$('#pk_kat').innerHTML=`<span style="display:flex;align-items:center;gap:8px">${cic(v,'var(--pri)',18)}${esc(v)}</span><span style="color:var(--sub)">▾</span>`;dirty()})}
function pickForm(){pick('Form',FORMS.map(f=>[f,f||'–']),ED.form,v=>{ED.form=v;$('#pk_form').innerHTML=`<span>${esc(v||'–')}</span><span style="color:var(--sub)">▾</span>`;dirty()})}
function saveArt(id){const i=getI(id);const n=val('f_name').trim();if(!n){toast('Der Name darf nicht leer sein');return}
i.name=n;i.inci=val('f_inci').trim();i.ist=$('#f_ok').checked&&i.inci?'geprüft':i.inci?'ungeprüft':'eigen';i.kat=ED.kat;i.form=ED.form;i.beschr=val('f_beschr');i.verw=val('f_verw');i.notiz=val('f_notiz');i.mhd=val('f_mhd');i.quelle=val('f_quelle').trim();i.min=num(val('f_min'))||0;R.edit=false;save();draw();toast('Gespeichert')}
function used(id){const i=getI(id);i.total=0;i.vessels.forEach(v=>v.amount=0);save();draw();toast('Als aufgebraucht markiert')}
function parseInci(text){const t=String(text||'');const m=t.match(/(?:INCI(?:[- ](?:Deklaration|Bezeichnung|Name|Liste))?|Inhaltsstoffe|Ingredients|Zusammensetzung)\s*[:：]\s*([^\n]+)/i);return m?m[1].replace(/https?:\/\/\S+/g,'').replace(/\s+/g,' ').trim().replace(/[.;]+$/,''):''}
function sheetPaste(){
openSheet(`<h2>INCI aus Text übernehmen</h2><div class="hint" style="margin:0 0 8px">Kopiere den Text der Produktseite oder nur die Zeile mit den Inhaltsstoffen und füge ihn hier ein. Gesucht wird nach „INCI:“, „Inhaltsstoffe:“ oder „Ingredients:“. Bitte das Ergebnis kurz prüfen.</div><textarea id="pt" rows="6" style="width:100%;border:1px solid var(--line);border-radius:12px;padding:10px;font:inherit" placeholder="Text hier einfügen"></textarea><div class="err" id="er"></div><div class="btns"><button class="btn" id="pg">Übernehmen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);
$('#pg').onclick=()=>{const r=parseInci(val('pt'));if(!r){$('#er').textContent='Keine INCI-Zeile gefunden. Bitte von Hand eintragen.';return}closeSheet();$('#f_inci').value=r;$('#f_ok').checked=false;dirty();toast('INCI übernommen – bitte prüfen')}}
function sheetMenge(id){const i=getI(id);const u=pickU(i.total,i.kind);openSheet(`<h2>Bestand ändern</h2>
<div class="two"><label class="fld"><span>Gesamtmenge</span><input id="f1" inputmode="decimal" value="${nf(i.total/U[u].f,3)}"></label><label class="fld u"><span>Einheit</span><select id="f2">${allUnits(u)}</select></label></div>
<div class="hint">Einheiten: Feststoff (mg, g, kg), Flüssigkeit (ml, l), Länge (mm, cm), Stück oder Tropfen.</div>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveMenge('${id}')">Speichern</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function saveMenge(id){const i=getI(id);const u=val('f2');const t=num(val('f1'));if(t==null||t<0){$('#er').textContent='Bitte eine Menge eingeben.';return}
const nk=U[u].k;if(nk!==i.kind&&i.vessels.length){$('#er').textContent='Die Einheitenart lässt sich nicht ändern, solange Gefäße angelegt sind. Bitte zuerst die Gefäße entfernen.';return}
const tb=toB(t,u);if(tb<vsum(i)-1e-9){$('#er').textContent=`Die Gesamtmenge liegt unter der Summe der Gefäße (${fmt(vsum(i),i.kind)}). Bitte zuerst den Füllstand eines Gefäßes anpassen.`;return}
const chg=nk!==i.kind;if(chg){i.kind=nk;i.min=0;i.bezug.forEach(b=>b.kind=nk)}i.total=tb;save();draw();if(chg)toast('Preise bitte prüfen')}
/* ---------- Gefäße ---------- */
let VS={typ:'dose',ort:''};
const ortBtn=()=>`<button type="button" class="selbtn" id="vo" onclick="pickOrt()"><span>${esc(VS.ort||'–')}</span><span style="color:var(--sub)">▾</span></button>`;
function pickOrt(){pick('Lagerort',[['','– kein Lagerort –']].concat(S.orte.map(o=>[o,o])),VS.ort,v=>{VS.ort=v;$('#vo').innerHTML=`<span>${esc(v||'–')}</span><span style="color:var(--sub)">▾</span>`})}
function sheetVessel(id,vid){const i=getI(id);const v=vid?i.vessels.find(x=>x.id===vid):null;
if(v){VS.ort=v.ort||'';const u=pickU(v.cap,i.kind);openSheet(`<h2>${vname(v)}</h2><div class="s" style="margin-bottom:6px">Nenninhalt ${fmt(v.cap,i.kind)}</div>
<label class="fld"><span>Füllstand (${u})</span><input id="fz" inputmode="decimal" value="${nf(v.amount/U[u].f,3)}"></label>
<input type="range" id="fr" min="0" max="${v.cap/U[u].f}" step="${v.cap/U[u].f>=20?1:.1}" value="${v.amount/U[u].f}" style="margin-top:12px">
<div class="fld"><span>Lagerort</span>${ortBtn()}</div>
<div class="hint">Wenn du den Füllstand änderst, passt sich der Gesamtbestand an.</div>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveFill('${id}','${vid}','${u}')">Speichern</button><button class="btn danger" onclick="delVessel('${id}','${vid}')">Gefäß entfernen</button></div><div class="hint">Beim Entfernen bleibt der Inhalt im Vorrat.</div>`);
$('#fr').oninput=e=>$('#fz').value=nf(e.target.value,3);$('#fz').oninput=e=>{const n=num(e.target.value);if(n!=null)$('#fr').value=n};return}
const u=defUnit(i.kind);VS.typ=i.kind==='p'?'stueck':'dose';VS.ort='';
openSheet(`<h2>Gefäß hinzufügen</h2><div class="vt" id="vt">${Object.keys(VT).map(k=>`<button type="button" data-t="${k}" class="${k===VS.typ?'on':''}">${vic(k,'currentColor',26)}${VT[k].n}</button>`).join('')}</div>
<div class="two" style="align-items:end"><label class="fld"><span>Anzahl</span><input id="vn" inputmode="numeric" value="1"></label><label class="fld"><span>Nenninhalt</span><input id="vc" inputmode="decimal" placeholder="200"></label><label class="fld u" style="flex:0 0 28%"><span>Einheit</span><select id="vu">${unitSel(i.kind,u)}</select></label></div>
<label class="fld"><span>Aktueller Füllstand (je Gefäß)</span><input id="vf" inputmode="decimal" placeholder="voll"></label><input type="range" id="vr" min="0" max="100" value="100" style="margin-top:10px">
<div class="s" style="margin-top:2px">Leer lassen = voll. Der Regler setzt den Füllstand in Prozent.</div>
<div class="fld"><span>Lagerort</span>${ortBtn()}</div>
<div class="hint">Der Inhalt der neuen Gefäße wird zum Gesamtbestand addiert.</div>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveVessel('${id}')">Speichern</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);
document.querySelectorAll('#vt button').forEach(b=>b.onclick=()=>{VS.typ=b.dataset.t;document.querySelectorAll('#vt button').forEach(x=>x.classList.toggle('on',x===b))});
$('#vr').oninput=e=>{const c=num(val('vc'));if(c>0)$('#vf').value=nf(c*e.target.value/100,3);else $('#vf').value=''}}
function saveVessel(id){const i=getI(id);const n=Math.max(1,Math.round(num(val('vn'))||1));const u=val('vu');const c=num(val('vc'));if(!(c>0)){$('#er').textContent='Bitte den Nenninhalt eingeben.';return}
const cap=toB(c,u);let f=val('vf').trim()===''?cap:toB(num(val('vf'))||0,u);if(f>cap+1e-9){$('#er').textContent='Der Füllstand ist größer als der Nenninhalt.';return}
i.total+=n*f;
let nr=Math.max(0,...i.vessels.filter(v=>v.typ===VS.typ).map(v=>v.nr));for(let k=0;k<n;k++)i.vessels.push({id:uid(),typ:VS.typ,nr:++nr,cap,amount:f,ort:VS.ort});
save();draw();toast(n+(n>1?' Gefäße':' Gefäß')+' hinzugefügt')}
function saveFill(id,vid,u){const i=getI(id);const v=i.vessels.find(x=>x.id===vid);const n=num(val('fz'));if(n==null||n<0){$('#er').textContent='Bitte einen Füllstand eingeben.';return}const nb=toB(n,u);if(nb>v.cap+1e-9){$('#er').textContent='Der Füllstand ist größer als der Nenninhalt ('+fmt(v.cap,i.kind)+').';return}
i.total=Math.max(0,i.total+(nb-v.amount));v.amount=nb;v.ort=VS.ort;save();draw()}
function delVessel(id,vid){const i=getI(id);i.vessels=i.vessels.filter(x=>x.id!==vid);save();draw()}
''')
# ---- Einkauf suggestions
t=t.replace("""const head=`<div style="display:flex;justify-content:space-between;align-items:center"><span class="cap">${rows.length} Artikel auf der Liste</span><button class="lnk" onclick="sheetAddShop()">+ Artikel</button></div>""","""const sug=S.items.filter(needs);
const sugc=sug.length?`<div class="card" style="padding:12px 14px;margin-top:12px;display:flex;align-items:center;gap:12px">${ic('pie','var(--ambt)',24)}<div style="flex:1;font-size:.85rem"><b style="font-weight:600">${sug.length}</b> unter Mindestbestand, noch nicht auf der Liste</div><button class="btn" style="height:38px;font-size:.82rem" onclick="addSuggest()">Alle übernehmen</button></div>`:'';
const head=`<div style="display:flex;justify-content:space-between;align-items:center"><span class="cap">${rows.length} Posten auf der Liste</span><button class="lnk" onclick="sheetAddShop()">+ Rohstoff</button></div>""")
t=t.replace("""<button onclick="E.mode='lief';einkauf()">Nach Lieferant</button></div>`;""","""<button onclick="E.mode='lief';einkauf()">Nach Lieferant</button></div>${sugc}`;""")
t=t.replace("""<button class="${E.mode==='lief'?'on':''}" onclick="E.mode='lief';einkauf()">Nach Lieferant</button></div>`;""","""<button class="${E.mode==='lief'?'on':''}" onclick="E.mode='lief';einkauf()">Nach Lieferant</button></div>${sugc}`;""")
t=t.replace("Die Einkaufsliste ist leer.<br>Füge Artikel über „+ Artikel“ oder auf der Artikelseite hinzu.","Die Einkaufsliste ist leer.<br>Füge Rohstoffe über „+ Rohstoff“ oder auf der Rohstoff-Seite hinzu.")
t=t.replace("function setLief(id,l)","""function sugAmount(i){return i.min>0?Math.max(i.min*2-i.total,i.min):(i.kind==='w'||i.kind==='v'?100:1)}
function addSuggest(){S.items.filter(needs).forEach(i=>{const c=cheapest(i);S.shop.push({id:uid(),item:i.id,menge:sugAmount(i),lief:c?c.x.lief:''})});save();einkauf();toast('Auf die Liste übernommen')}
function setLief(id,l)""",1)
# ---- Neu hits ranking
t=t.replace("const l=CAT.filter(c=>(c.n+' '+c.a).toLowerCase().includes(q)).slice(0,6);","const terms=q.split(/\\s+/).filter(Boolean);const l=CAT.map(c=>({c,s:score({n:c.n,a:c.a,i:c.i,k:''},terms)})).filter(x=>x.s).sort((a,b)=>b.s-a.s||a.c.n.length-b.c.n.length).slice(0,6).map(x=>x.c);")
# ---- Mehr: Einstellungen
t=t.replace("""g('App',[['gear','Einstellungen',soonT]""","""g('App',[['gear','Einstellungen',"sheetSettings()"]""")
t=t.replace("function sheetClear()","""function sheetSettings(){openSheet(`<h2>Einstellungen</h2><div class="cap" style="margin:0 0 4px">Lagerorte</div><div class="s" style="margin-bottom:6px">Diese Orte kannst du bei Gefäßen auswählen.</div>${S.orte.map((o,n)=>`<div class="row" style="padding:0 2px;cursor:default"><div class="t"><b>${esc(o)}</b></div><button class="ib" style="color:var(--sub)" onclick="delOrt(${n})" aria-label="Entfernen">${ic('x','var(--sub)',20)}</button></div>`).join('')||'<div class="s">Noch keine Orte.</div>'}
<div style="display:flex;gap:8px;margin-top:12px"><input id="no" placeholder="Neuer Lagerort, z. B. Schuhkarton" style="flex:1;min-width:0;height:46px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit"><button class="btn" onclick="addOrt()">Hinzufügen</button></div>`)}
function addOrt(){const v=val('no').trim();if(!v)return;if(!S.orte.includes(v))S.orte.push(v);save();sheetSettings()}
function delOrt(n){S.orte.splice(n,1);save();sheetSettings()}
function sheetClear()""")
t=t.replace("Version 0.2 (Bedienkonzept)","Version 0.3 (Bedienkonzept)")
# terminology
for a,b in [("Neuer Artikel","Neuer Rohstoff"),("Artikel entfernen?","Rohstoff entfernen?"),("Artikel zur Einkaufsliste","Rohstoff zur Einkaufsliste"),("Artikel im Lager suchen","Rohstoff im Lager suchen"),("Artikel zum Hinzufügen",""),("Als eigenen Artikel anlegen","Als eigenen Rohstoff anlegen"),("Eigener Artikel angelegt","Eigener Rohstoff angelegt"),("Alle Artikel</div>","Alle Rohstoffe</div>"),(">Alle Artikel<",">Alle Rohstoffe<"),("Nach Lieferant sortiert","nach Lieferant sortiert"),("Keine Artikel","Keine Rohstoffe")]:
    t=t.replace(a,b)
t=t.replace("Der Katalog enthält '+CAT.length","Der Katalog enthält '+CAT.length")
open('tpl4.html','w',encoding='utf-8').write(t)
