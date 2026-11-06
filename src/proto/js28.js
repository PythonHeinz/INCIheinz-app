/* ---------- Einsatzkonzentration am Rohstoff und Rechner „Dosierung prüfen“ ---------- */
/* Datenmodell: i.dmin / i.dmax = Einsatz in % der Gesamtmenge (0 oder leer = nicht gesetzt).
   Ersatzweise liest die App e0 / e1 aus dem Katalog (CM[cid]), sobald der Katalog diese Felder enthält. */
function einsatzOf(i){if(!i)return {lo:0,hi:0,src:''};const lo=i.dmin>0?i.dmin:0,hi=i.dmax>0?i.dmax:0;if(lo||hi)return {lo,hi,src:'own'};const c=i.cid&&CM[i.cid];if(c&&(c.e0>0||c.e1>0))return {lo:c.e0>0?c.e0:0,hi:c.e1>0?c.e1:0,src:'cat'};return {lo:0,hi:0,src:''}}
const einsatzTxt=e=>e.lo&&e.hi?(e.lo===e.hi?nf(e.lo,2)+' %':nf(e.lo,2)+' bis '+nf(e.hi,2)+' %'):e.lo?'ab '+nf(e.lo,2)+' %':e.hi?'bis '+nf(e.hi,2)+' %':'';
{const a0=artikel;artikel=function(i){a0.apply(this,arguments);const box=document.querySelector('#af2');if(!box)return;const e=einsatzOf(i);
if(R.edit){const lab=document.getElementById('f_verw');const host=lab&&lab.closest('label');const h=`<div class="hint">Felder mit „Vorschlag aus dem Katalog“ gelten, bis du etwas änderst. Dein Text hat immer Vorrang.</div><div class="cap" style="margin:12px 0 2px">Einsatzkonzentration</div><div class="two"><label class="fld"><span>von (%)</span><input id="f_e0" inputmode="decimal" value="${i.dmin>0?nf(i.dmin,2):''}" placeholder="${e.src==='cat'&&e.lo?nf(e.lo,2):'z. B. 2'}"></label><label class="fld"><span>bis (%)</span><input id="f_e1" inputmode="decimal" value="${i.dmax>0?nf(i.dmax,2):''}" placeholder="${e.src==='cat'&&e.hi?nf(e.hi,2):'z. B. 4'}"></label></div><div class="hint">Anteil an der Gesamtmenge im Rezept, den du für diesen Rohstoff als passend ansiehst, zum Beispiel aus dem Datenblatt. Die App gibt keine eigenen Grenzen vor. Wenn nur ein Wert eingetragen ist, wird nur diese Seite geprüft.</div>`;if(host)host.insertAdjacentHTML('afterend',h);else box.insertAdjacentHTML('beforeend',h)}
else if(einsatzTxt(e)){const h=`<div class="txt"><div class="s">Einsatzkonzentration</div>${einsatzTxt(e)}${e.src==='cat'?' <span class="s">· Richtwert aus dem Katalog, ungeprüft</span>':''}</div>`;const t=[...box.querySelectorAll('.txt')].find(x=>/Verwendung/.test(x.innerText));const ph=[...box.children].find(x=>/Noch nichts eingetragen/.test(x.innerText)&&!x.classList.contains('txt'));if(ph)ph.remove();if(t)t.insertAdjacentHTML('afterend',h);else box.insertAdjacentHTML('beforeend',h)}}}
{const s0=saveArt;saveArt=function(id){const i=getI(id);const a=document.getElementById('f_e0'),b=document.getElementById('f_e1');if(i&&a&&b&&val('f_name').trim()){const lo=num(a.value)||0,hi=num(b.value)||0;if(lo&&hi&&lo>hi){toast('„von“ darf nicht größer sein als „bis“');return}i.dmin=lo;i.dmax=hi}return s0.apply(this,arguments)}}
/* Dosierung prüfen */
function dosPage(){const X=RCH.dos,m=$('#main');const all=rzAll();let h=rumBack+`<div class="rz-t" style="font-size:1.25rem">Dosierung prüfen</div>`;
if(!all.length){m.innerHTML=h+`<div class="card rz-empty"><div class="s" style="font-size:.92rem">Lege zuerst ein Rezept an, dann kannst du es hier prüfen.</div><div class="btns"><button class="btn" onclick="rzEdit(null)">Rezept anlegen</button></div></div>`;return}
const r=rzGet(X.id);if(!r){X.id=null;h+=`<div class="s" style="margin:4px 0 8px">Welches Rezept willst du prüfen?</div><div class="search"><span style="padding:0 6px 0 12px;display:flex">${ic('search','var(--sub)',18)}</span><input value="${esc(X.q)}" placeholder="Rezept suchen" oninput="RCH.dos.q=this.value;dosList()"></div><div id="doslist" style="margin-top:12px"></div>`;m.innerHTML=h;dosList();try{if(LANG!=='de')trWalk(m)}catch(x){}return}
const v=rzCurV(r),d=v.d,sum=rzSum(d);
h+=`<div class="card" style="margin-top:10px"><div class="row" onclick="RCH.dos.id=null;dosPage()"><div class="t"><b class="nm">${esc(d.name)}</b><div class="s">Version ${v.n} · ${nf(sum,2)} g</div></div><span class="lnk">Ändern</span></div></div>`;
if(!(sum>0)){m.innerHTML=h+'<div class="s" style="padding:12px 4px">Dieses Rezept hat noch keine Mengen.</div>';return}
const rows=[];d.phasen.forEach(p=>p.z.forEach(z=>{if(!(z.g>0))return;const i=rzItem(z);const e=einsatzOf(i);const pc=z.g/sum*100;const eps=1e-9;let st='ok';if(!i)st='frei';else if(!(e.lo||e.hi))st='leer';else if(e.lo&&pc<e.lo-eps)st='low';else if(e.hi&&pc>e.hi+eps)st='high';rows.push({z,i,e,pc,st,n:rzName(z)||'Zutat'})}));
const grp=k=>rows.filter(x=>x.st===k);const bad=rows.filter(x=>x.st==='low'||x.st==='high').sort((a,b)=>b.pc-a.pc);window.__dos=rows;
const R2=v=>nf(Math.round(v*100)/100,2);const rw=x=>x.e.src==='cat'?' · Katalog-Richtwert':'';
const line=x=>{const b=x.st==='low'||x.st==='high';const dl=x.st==='low'?x.e.lo-x.pc:x.st==='high'?x.pc-x.e.hi:0;return `<div class="row" style="border-left:4px solid ${b?'var(--err)':'#5E9440'}" onclick="dosAct(${rows.indexOf(x)})"><div class="t"><b class="nm">${esc(x.n)}</b><div class="s">im Rezept ${R2(x.pc)} % · Bereich ${einsatzTxt(x.e)||'–'}${rw(x)}</div>${b?`<div class="s" style="color:var(--err)">${R2(dl)} %-Punkte ${x.st==='low'?'unter der Untergrenze':'über der Obergrenze'}</div>`:''}</div>${b?`<b style="color:var(--err)">${x.st==='low'?'zu niedrig':'zu hoch'}</b>`:ic('check','#5E9440',20)}</div>`};
h+=`<div class="rz-ban ${bad.length?'':'ok'}" style="margin-top:14px;${bad.length?'background:#F8E4E0;color:var(--err)':''}"><b>${bad.length?(bad.length===1?'1 Zutat außerhalb deines Bereichs':bad.length+' Zutaten außerhalb deines Bereichs'):'Alle hinterlegten Bereiche passen'}</b><div class="s">${grp('ok').length+bad.length} von ${rows.length} Zutaten haben einen Einsatzbereich.</div></div>`;
if(bad.length)h+=`<div class="cap" style="margin:16px 0 6px;color:var(--err)">Prüfen</div><div class="card">${bad.map(line).join('')}</div>`;
if(grp('ok').length)h+=`<div class="cap" style="margin:16px 0 6px;color:#2F5420">Im Bereich</div><div class="card">${grp('ok').map(line).join('')}</div>`;
const miss=rows.filter(x=>x.st==='leer'||x.st==='frei');
if(miss.length)h+=`<div class="cap" style="margin:16px 0 6px">Ohne Einsatzbereich</div><div class="card">${miss.map(x=>`<div class="row" ${x.i?`onclick="dosAct(${rows.indexOf(x)})"`:''}><div class="t"><b class="nm">${esc(x.n)}</b><div class="s">im Rezept ${nf(Math.round(x.pc*100)/100,2)} %${x.i?'':' · nicht im Lager'}</div></div>${x.i?'<span class="lnk">Eintragen</span>':''}</div>`).join('')}</div>`;
h+=`<div class="hint" style="margin:10px 0 30px">Geprüft wird der Anteil an der Gesamtmenge des Rezepts gegen den Bereich, den du am Rohstoff eingetragen hast. Die App enthält keine eigenen Grenzwerte.</div>`;
m.innerHTML=h;try{if(LANG!=='de')trWalk(m)}catch(x){}}
function dosList(){const X=RCH.dos,q=FOLD(X.q||'');const l=rzAll().slice().sort((a,b)=>FOLD(rzCurV(a).d.name)<FOLD(rzCurV(b).d.name)?-1:1).filter(r=>!q||FOLD(rzCurV(r).d.name).includes(q));const e=document.getElementById('doslist');if(!e)return;
e.innerHTML=l.length?`<div class="card">${l.map(r=>{const v=rzCurV(r);return `<div class="row" onclick="RCH.dos.id='${r.id}';dosPage()"><div class="t"><b class="nm">${esc(v.d.name)}</b><div class="s">Version ${v.n} · ${nf(rzSum(v.d),2)} g${r.demo?' · Testrezept':''}</div></div>${ic('chev','var(--sub)',18)}</div>`}).join('')}</div>`:'<div class="s" style="padding:10px 4px">Nichts gefunden.</div>'}
function dosAct(n){const x=(window.__dos||[])[n];if(!x||!x.i)return;const r=rzGet(RCH.dos.id);const bad=x.st==='low'||x.st==='high';
openDlg(`<h2 class="nm">${esc(x.n)}</h2><div class="s" style="margin:4px 0 12px">${bad?`Im Rezept ${nf(Math.round(x.pc*100)/100,2)} %, dein Bereich ${einsatzTxt(x.e)}. Was stimmt nicht: der Bereich oder die Menge im Rezept?`:x.st==='leer'?`Im Rezept ${nf(Math.round(x.pc*100)/100,2)} %. Für diesen Rohstoff ist noch kein Einsatzbereich eingetragen.`:`Im Rezept ${nf(Math.round(x.pc*100)/100,2)} %, dein Bereich ${einsatzTxt(x.e)}.`}</div>
<button class="dtile" onclick="dosGo('${x.i.id}',1)"><span class="ci">${ic('pencil','currentColor',22)}</span><span><b>${x.st==='leer'?'Einsatzbereich eintragen':'Bereich am Rohstoff ändern'}</b><span class="s">Öffnet den Rohstoff im Bearbeiten-Modus.</span></span></button>
${r?`<button class="dtile" onclick="closeDlg();rzOpen('${r.id}')"><span class="ci">${ic('book','currentColor',22)}</span><span><b>Rezept ansehen</b><span class="s">Menge im Rezept prüfen oder ändern.</span></span></button>`:''}`);try{if(LANG!=='de')trWalk(document.getElementById('dlg'))}catch(e){}}
function dosGo(id,edit){closeDlg();stack.push(R);R={name:'artikel',id,edit:!!edit};draw()}

/* Katalogvorschläge: b = Beschreibung/Funktion, v = Verwendung, f = Form, d = Dichte (g/ml).
   Sie werden in den Rohstoff kopiert, wenn dessen Feld leer ist. it.fc merkt sich den kopierten Katalogwert.
   Solange das Feld noch genau diesem Wert entspricht, folgt es späteren Katalogänderungen; sobald der Nutzer etwas ändert, gilt sein Wert. */
const CATP=[['beschr','b'],['verw','v'],['form','f'],['dens','d']];
function catFillOne(it){const c=it&&it.cid&&CM[it.cid];if(!c)return 0;let n=0;CATP.forEach(([x,y])=>{const cv=c[y];if(cv==null||cv===''||cv===0)return;if(y==='f'&&!FORMS.includes(cv))return;const cur=it[x];const empty=x==='dens'?!(cur>0):!cur;it.fc=it.fc||{};const same=it.fc[x]!==undefined&&it.fc[x]===cur;if(empty||same){if(cur!==cv){it[x]=cv;n++}it.fc[x]=cv}});return n}
function catFill(){let n=0;S.items.forEach(it=>{n+=catFillOne(it)});return n}
function catFillDens(){return catFill()}
{const m0=mk;mk=function(c,o){const it=m0.apply(this,arguments);catFillOne(it);return it}}
{const l0=loadCatX;loadCatX=function(){l0.apply(this,arguments);try{if(catFill())save()}catch(e){}}}
const fcSame=(i,x)=>!!(i.fc&&i.fc[x]!==undefined&&i.fc[x]===i[x]);
const VTAG=' · Vorschlag aus dem Katalog, ungeprüft';
{const a1=artikel;artikel=function(i){a1.apply(this,arguments);const box=document.getElementById('af2'),af1=document.getElementById('af1');if(!box)return;
if(R.edit){const lb=document.getElementById('f_beschr'),lv=document.getElementById('f_verw');
if(lb){lb.placeholder='z. B. Emulgator für Öl-in-Wasser-Cremes';const sp=lb.closest('label').querySelector('span');if(sp)sp.textContent='Beschreibung / Funktion'+(fcSame(i,'beschr')?VTAG:'')}
if(lv){const sp=lv.closest('label').querySelector('span');if(sp&&fcSame(i,'verw'))sp.textContent+=VTAG}
if(af1&&fcSame(i,'form')){const sp=af1.querySelector('#pk_form')&&af1.querySelector('#pk_form').closest('.fld').querySelector('span');if(sp)sp.textContent='Form'+VTAG}}
else{[...box.querySelectorAll('.txt .s')].forEach(e=>{const t=e.textContent.trim();if(t==='Beschreibung')e.textContent='Beschreibung / Funktion'+(fcSame(i,'beschr')?VTAG:'');else if(t==='Verwendung / Wirkweise'&&fcSame(i,'verw'))e.textContent+=VTAG});
if(af1&&fcSame(i,'form')){const kv=[...af1.querySelectorAll('.kv')].find(k=>k.firstChild&&k.firstChild.textContent==='Form');if(kv&&kv.lastElementChild)kv.lastElementChild.insertAdjacentHTML('beforeend','<div class="s">Vorschlag aus dem Katalog, ungeprüft</div>')}}}}

/* ---------- Katalog 1.3: Fettkennzahlen, Rechtshinweis, zusammengeführte Einträge ---------- */
const CIDMAP={K0194:'K0222'};
function cidRemap(){let n=0;(S.items||[]).forEach(i=>{if(CIDMAP[i.cid]){i.cid=CIDMAP[i.cid];n++}});(S.rez||[]).forEach(r=>(r.phasen||[]).forEach(p=>(p.z||[]).forEach(z=>{if(CIDMAP[z.cid]){z.cid=CIDMAP[z.cid];n++}})));return n}
{const l1=loadCatX;loadCatX=function(){l1.apply(this,arguments);try{if(cidRemap())save()}catch(e){}}}
const dz=s=>String(s).replace(/(\d)\.(\d)/g,'$1,$2');
{const a2=artikel;artikel=function(i){a2.apply(this,arguments);if(R.edit)return;const c=i&&i.cid&&CM[i.cid];if(!c)return;const box=document.getElementById('af2');if(!box)return;
if(c.w){const w=document.createElement('div');w.id='warnbox';w.setAttribute('role','alert');w.style.cssText='background:#FBE9E7;border:1.5px solid var(--err);color:#7A1F16;border-radius:12px;padding:10px 12px;margin:0 0 12px;font-size:14px;line-height:1.4';w.innerHTML='<b>Rechtlicher Hinweis</b><br>'+esc(c.w);box.insertAdjacentElement('beforebegin',w)}
const rows=[['Verseifungszahl (mg KOH/g)',c.sap_koh],['NaOH-Bedarf (g je g Fett)',c.sap_naoh],['Jodzahl',c.jodzahl],['Schmelzpunkt',c.schmelzpunkt]].filter(r=>r[1]!=null&&r[1]!=='');
if(rows.length){const h=`<div class="txt" id="fettbox"><div class="s">Fettkennzahlen</div>${rows.map(r=>`<div class="kv"><span>${r[0]}</span><span>${esc(dz(r[1]))}</span></div>`).join('')}<div class="s">Richtwerte aus dem Katalog, ungeprüft</div>${c.sap_quelle?'<div class="s">'+esc(c.sap_quelle)+'</div>':''}</div>`;box.insertAdjacentHTML('beforeend',h)}}}
