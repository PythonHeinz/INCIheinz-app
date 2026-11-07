/* ---------- Auffälligkeiten (Konzept §5.2, R0): Regeln und Statistik, ohne KI ----------
   Liest Chargen, Versionen, Bewertungen, Preise und Bestand. Schreibt nichts. Hinweise zum Nachsehen, keine Ursachenbehauptung. */
const AUS_MIN_CHG=3;
const ausTol=()=>{const t=Number(S.ausTol);return t>=0&&isFinite(t)&&S.ausTol!==''&&S.ausTol!=null?t:1};
const ausAvg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const ausZ=z=>z.item&&getI(z.item)?getI(z.item).name:(z.name||(z.cid&&CM[z.cid]?CM[z.cid].n:''));
const ausKey=z=>z.item||z.cid||z.name||'';
const ausRName=r=>{const v=rzCurV(r);return (v&&v.d&&v.d.name)||'Rezept'};
function ausData(){const out=[];const tol=ausTol();const chg=rzChgAll();
rzAll().forEach(r=>{const nm=ausRName(r);const cs=chg.filter(c=>c.rez===r.id).sort((a,b)=>a.date<b.date?-1:1);const rated=cs.filter(c=>c.stars>0);let swapped=false;
/* Einwaage-Abweichung */
cs.forEach(c=>(c.lines||[]).forEach(l=>{const d=l.ist-l.soll;if(Math.abs(d)>tol&&Math.abs(d)>0.0005)out.push({typ:'einwaage',sev:2,rez:nm,date:c.date.slice(0,10),t:'Einwaage weicht ab: '+l.n,d:'Soll '+nf(l.soll,2)+' g, Ist '+nf(l.ist,2)+' g · '+dde(c.date.slice(0,10))})}));
/* Zutatentausch und Bewertung davor/danach */
for(let k=1;k<r.vers.length;k++){const a=r.vers[k-1],b=r.vers[k];const A=new Map(),B=new Map();a.d.phasen.forEach(p=>p.z.forEach(z=>{if(ausKey(z))A.set(ausKey(z),ausZ(z))}));b.d.phasen.forEach(p=>p.z.forEach(z=>{if(ausKey(z))B.set(ausKey(z),ausZ(z))}));
const gone=[...A].filter(x=>!B.has(x[0])).map(x=>x[1]),neu=[...B].filter(x=>!A.has(x[0])).map(x=>x[1]);if(!gone.length&&!neu.length)continue;
const t=gone.length&&neu.length?'Zutatentausch in Version '+b.n+': '+neu.join(', ')+' statt '+gone.join(', '):neu.length?'Zutat neu in Version '+b.n+': '+neu.join(', '):'Zutat entfernt in Version '+b.n+': '+gone.join(', ');
const before=rated.filter(c=>c.ver===a.n).map(c=>c.stars),after=rated.filter(c=>c.ver===b.n).map(c=>c.stars);let d='',sev=1;
if(before.length>=2&&after.length>=2){d='Davor ø '+nf(ausAvg(before),1)+' ★ ('+before.length+' Chargen), danach ø '+nf(ausAvg(after),1)+' ★ ('+after.length+' Chargen)';if(ausAvg(after)<=ausAvg(before)-1){sev=3;swapped=true}}
out.push({typ:'tausch',sev,rez:nm,date:(b.date||'').slice(0,10),t,d,n2:sev===3?'Zeitlichen Zusammenhang prüfen. Ob der Tausch die Ursache ist, zeigen die Daten nicht.':''})}
/* Bewertungstrend ohne Versionswechsel */
if(!swapped&&rated.length>=5){const last=rated.slice(-3).map(c=>c.stars),prev=rated.slice(0,-3).map(c=>c.stars);if(ausAvg(last)<=ausAvg(prev)-1)out.push({typ:'trend',sev:2,rez:nm,date:rated[rated.length-1].date.slice(0,10),t:'Bewertung sinkt: '+nm,d:'Letzte 3 Chargen ø '+nf(ausAvg(last),1)+' ★, davor ø '+nf(ausAvg(prev),1)+' ★'})}
/* zu wenig Daten */
if(cs.length>0&&cs.length<AUS_MIN_CHG)out.push({typ:'wenig',sev:0,rez:nm,date:'',t:'Zu wenig Chargen: '+nm,d:'Erst '+cs.length+' '+(cs.length===1?'Charge':'Chargen')+'. Ab '+AUS_MIN_CHG+' Chargen sind Aussagen möglich.'})});
/* Preis und Bezug */
S.items.forEach(i=>{const bz=(i.bezug||[]).filter(b=>b.kind===i.kind&&b.preis>0&&b.menge>0).sort((x,y)=>x.datum<y.datum?-1:x.datum>y.datum?1:0);if(bz.length<2)return;
const l=bz[bz.length-1],p=bz[bz.length-2];const U=x=>x.preis/x.menge*100;const pct=(U(l)/U(p)-1)*100;
if(l.lief===p.lief&&pct>=20)out.push({typ:'preis',sev:pct>=30?3:2,rez:'',date:l.datum,t:'Preissprung '+i.name+': '+pctT(pct),d:l.lief+': '+eur(U(l))+' je 100 g/ml, vorher '+eur(U(p))});
for(let k=bz.length-1;k>0;k--){if(bz[k].lief!==bz[k-1].lief){const n2=bz[k],o2=bz[k-1],pc=(U(n2)/U(o2)-1)*100;if(Math.abs(pc)>=10)out.push({typ:'lieferant',sev:2,rez:'',date:n2.datum,t:'Lieferantenwechsel '+i.name,d:'Neu bei '+n2.lief+': '+eur(U(n2))+' je 100 g/ml, vorher bei '+o2.lief+': '+eur(U(o2))});break}}});
/* Bestand: abgelaufen */
const t0=new Date().toISOString().slice(0,10);S.items.forEach(i=>{if(i.mhd&&i.mhd<t0&&i.total>0)out.push({typ:'abgelaufen',sev:1,rez:'',date:i.mhd,t:i.name+' ist abgelaufen',d:'MHD '+dde(i.mhd)})});
return out.sort((a,b)=>b.sev-a.sev||(a.date<b.date?1:-1))}
const ausSev=['var(--sub)','var(--sub)','var(--ambt)','var(--err)'];
function ausRow(f){return `<div class="rz-dl" style="padding:8px 0;align-items:flex-start"><span><span style="color:${ausSev[f.sev]}">●</span> <b>${esc(f.t)}</b><div class="s">${esc(f.d)}</div>${f.n2?`<div class="s">${esc(f.n2)}</div>`:''}</span></div>`}
function sheetAus(){const L=ausData();const rez=[...new Set(L.filter(f=>f.rez).map(f=>f.rez))];const rest=L.filter(f=>!f.rez);
const pr=rest.filter(f=>f.typ==='preis'||f.typ==='lieferant'),be=rest.filter(f=>f.typ==='abgelaufen');
setSub('Auffälligkeiten',`<div class="s" style="margin-bottom:8px;line-height:1.5">Alles wird auf diesem Gerät berechnet. Das sind Hinweise zum Nachsehen, kein Urteil und kein Beweis für Ursachen.</div>
<label class="fld"><span>Toleranz bei der Einwaage (g)</span><input type="number" inputmode="decimal" min="0" step="0.1" value="${ausTol()}" onchange="S.ausTol=this.value===''?'':parseFloat(this.value);save();sheetAus()"></label>`
+(L.length?'':`<div class="card" style="padding:12px 14px;margin-top:10px"><b>Keine Auffälligkeiten gefunden</b><div class="s">Dafür braucht die App Chargen mit Bewertung und Preise mit Datum.</div></div>`)
+rez.map(n=>`<div class="cap" style="margin:14px 0 2px">${esc(n)}</div>`+L.filter(f=>f.rez===n).map(ausRow).join('')).join('')
+(pr.length?`<div class="cap" style="margin:14px 0 2px">Preise und Lieferanten</div>`+pr.map(ausRow).join(''):'')
+(be.length?`<div class="cap" style="margin:14px 0 2px">Bestand</div>`+be.map(ausRow).join(''):''))}
(function(){const o=stat;stat=function(){o.apply(this,arguments);const w=document.querySelector('#main .wgs');if(!w)return;const L=ausData().filter(f=>f.sev>0);
w.insertAdjacentHTML('afterbegin',`<div class="card wg w2" onclick="sheetAus()"><h3>Auffälligkeiten</h3>${L.length?`<div class="big">${L.length}</div>`+L.slice(0,2).map(f=>`<div style="margin-top:4px;font-size:.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span style="color:${ausSev[f.sev]}">●</span> ${esc(f.t)}</div>`).join(''):'<div class="s">Keine gefunden</div>'}</div>`)}})();
