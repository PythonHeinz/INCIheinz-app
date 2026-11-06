/* Mengenmodell: Die Gesamtmenge (i.total) ist die einzige Wahrheit. Gefäße beschreiben nur Verpackung,
   Nenninhalt und Lagerort. Sie ändern die Menge nie, außer wenn noch gar keine Menge eingetragen ist. */
function sheetVessel(id,vid){const i=getI(id);const v=vid?i.vessels.find(x=>x.id===vid):null;
if(v){VS.ort=v.ort||'';const u=pickU(v.cap,i.kind);
openSheet(`<h2>${vname(v)}</h2><div class="two" style="align-items:end"><label class="fld"><span>Nenninhalt</span><input id="vc" inputmode="decimal" value="${nf(v.cap/U[u].f,3)}"></label><label class="fld u" style="flex:0 0 28%"><span>Einheit</span><select id="vu">${unitSelD(i,u)}</select></label></div>
<div class="fld"><span>Lagerort</span>${ortBtn()}</div>
<div class="hint">Die Menge des Rohstoffs bleibt unverändert.</div>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveVessEdit('${id}','${vid}')">Speichern</button><button class="btn danger" onclick="delVessel('${id}','${vid}')">Gefäß entfernen</button></div>`);return}
const pre=!i.unk&&i.total>0&&!i.vessels.length;const u=pre?pickU(i.total,i.kind):defUnit(i.kind);VS.typ=i.kind==='p'?'stueck':i.kind==='v'?'flasche':'dose';VS.ort='';
openSheet(`<h2>Gefäß hinzufügen</h2><div class="vt" id="vt">${Object.keys(VT).map(k=>`<button type="button" data-t="${k}" class="${k===VS.typ?'on':''}">${vic(k,'currentColor',26)}${VT[k].n}</button>`).join('')}</div>
<div class="two" style="align-items:end"><label class="fld"><span>Anzahl</span><input id="vn" inputmode="numeric" value="1"></label><label class="fld"><span>Nenninhalt</span><input id="vc" inputmode="decimal" placeholder="200" value="${pre?nf(i.total/U[u].f,3):''}"></label><label class="fld u" style="flex:0 0 28%"><span>Einheit</span><select id="vu">${unitSelD(i,u)}</select></label></div>
<div class="fld"><span>Lagerort</span>${ortBtn()}</div>
<div class="hint">Die Menge des Rohstoffs bleibt unverändert. Ist noch keine Menge eingetragen, setzt die App Anzahl × Nenninhalt.</div>
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="saveVessel('${id}')">Speichern</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);
document.querySelectorAll('#vt button').forEach(b=>b.onclick=()=>{VS.typ=b.dataset.t;document.querySelectorAll('#vt button').forEach(x=>x.classList.toggle('on',x===b))})}
function saveVessel(id){const i=getI(id);const n=Math.max(1,Math.round(num(val('vn'))||1));const u=val('vu');const c=num(val('vc'));if(!(c>0)){$('#er').textContent='Bitte den Nenninhalt eingeben.';return}
const cap=toB(c,u);const setQ=i.unk||!(i.total>0);if(setQ){i.total=n*cap;i.unk=false}
let nr=Math.max(0,...i.vessels.filter(v=>v.typ===VS.typ).map(v=>v.nr));for(let k=0;k<n;k++)i.vessels.push({id:uid(),typ:VS.typ,nr:++nr,cap,ort:VS.ort});
save();draw();toast(n+(n>1?' Gefäße':' Gefäß')+' hinzugefügt')}
function saveVessEdit(id,vid){const i=getI(id);const v=i.vessels.find(x=>x.id===vid);const c=num(val('vc'));if(!(c>0)){$('#er').textContent='Bitte den Nenninhalt eingeben.';return}
v.cap=toB(c,val('vu'));v.ort=VS.ort;save();draw();toast('Gefäß geändert')}
function rzTake(i,g){const b=rzBase(i,g);if(b==null)return;i.total=Math.max(0,i.total-b)}
