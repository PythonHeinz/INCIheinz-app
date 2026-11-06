/* ---- Teilen statt nur Herunterladen (nur Exporte) ---- */
let SHARE22=0;
function dl22(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
function dlBlob(name,blob){if(SHARE22&&navigator.share&&navigator.canShare){try{const f=new File([blob],name,{type:blob.type||'application/octet-stream'});if(navigator.canShare({files:[f]})){navigator.share({files:[f]}).catch(e=>{if(!e||e.name!=='AbortError')dl22(name,blob)});return}}catch(_){}}dl22(name,blob)}
{const o=outFile;outFile=function(){SHARE22=1;try{return o.apply(this,arguments)}finally{SHARE22=0}}}
/* ---- Regal-Check: alle angezeigten übernehmen ---- */
function ckAll(){const cat=R.id;const terms=CK.q.trim().toLowerCase().split(/\s+/).filter(Boolean);let l=CAT.filter(c=>c.k===cat);if(terms.length)l=l.filter(c=>score({n:c.n,a:c.a,i:c.i,k:''},terms));
const add=l.filter(c=>!S.items.some(i=>i.cid===c.id));if(!add.length){toast('Alles schon im Lager');return}window.__ckadd=add.map(c=>c.id);
openSheet(`<h2>${add.length} Rohstoffe übernehmen?</h2><div class="s">Sie kommen ins Lager, die Mengen bleiben offen. Du kannst sie danach einzeln wieder abwählen.</div><div class="btns"><button class="btn" onclick="ckAllDo()">Übernehmen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function ckAllDo(){const ids=window.__ckadd||[];ids.forEach(id=>{if(!S.items.some(i=>i.cid===id)&&CM[id])S.items.push(mk(CM[id],{unk:true}))});save();closeSheet();ckList();toast(ids.length+' Rohstoffe übernommen')}
/* ---- INCI: manuell bestätigen ---- */
function inciConfirm(id){const i=getI(id);openSheet(`<h2>INCI als geprüft bestätigen?</h2><div style="overflow-wrap:anywhere;margin:8px 0;padding:10px;border:1px solid var(--line);border-radius:12px">${esc(i.inci)}</div><div class="s">Vergleiche den Text mit Etikett oder Datenblatt. Eingefügter Text allein ist noch keine Prüfung.</div><div class="btns"><button class="btn" onclick="inciConfirmDo('${id}')">Stimmt, geprüft</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function inciConfirmDo(id){const i=getI(id);i.ist='geprüft';i.chg=today();save();closeSheet();draw();toast('INCI als geprüft bestätigt')}
/* ---- Lagerort am Artikel ---- */
const ortOf=i=>i.ort||((i.vessels.find(v=>v.ort)||{}).ort)||'';
function pickArtOrt(){pick('Lagerort',[['','– kein Lagerort –']].concat(S.orte.map(o=>[o,o])),ED.ort||'',v=>{ED.ort=v;$('#pk_ort').innerHTML=`<span>${esc(v||'–')}</span><span style="color:var(--sub)">▾</span>`;dirty()})}
/* ---- Speichern unten und Warnung beim Verlassen ---- */
{const a0=artikel;artikel=function(){a0.apply(this,arguments);const o=document.getElementById('sb22');if(o)o.remove();if(R.edit){const d=document.createElement('div');d.id='sb22';d.className='sb22bar';d.innerHTML='<button class="btn" id="esv2" disabled onclick="document.getElementById(\'esv\').click()">Speichern</button>';document.body.appendChild(d)}}}
{const d0=draw;draw=function(){const e=document.getElementById('sb22');if(e)e.remove();return d0.apply(this,arguments)}}
{const d1=dirty;dirty=function(){d1();const b=document.getElementById('esv2');if(b)b.disabled=false}}
function guard22(){const b=document.getElementById('esv');if(R.edit&&b&&!b.disabled){cancelEdit();return true}return false}
{const t0=tab;tab=function(){if(guard22())return;return t0.apply(this,arguments)};const b0=back;back=function(){if(guard22())return;return b0.apply(this,arguments)}}
/* ---- Produktseite lesen: bekannten Lieferanten aus dem Text vorwählen ---- */
{const p0=prodRead;prodRead=function(){const n=s=>String(s||'').toLowerCase().replace(/[^a-z0-9äöüß]/g,'');const t=n(val('pt'));const m=Object.keys(S.lief).find(l=>n(l).length>2&&t.includes(n(l)));if(m)BZPRE=m;try{return p0.apply(this,arguments)}finally{BZPRE=''}}}
