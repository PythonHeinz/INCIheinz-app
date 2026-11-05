/* Testdaten: Rezepte + Lager laden/entfernen (nur Expertenmodus, nie automatisch) */
const DEMO_NOTE='Testdaten – Zusammensetzung nicht geprüft, nicht zum Nachmischen';
function demoCount(){return {r:(S.rez||[]).filter(x=>x.demo).length,i:S.items.filter(x=>x.demo).length}}
const sheetSettings2=sheetSettings;
sheetSettings=function(){sheetSettings2();const s=shEl();if(!s||!S.expert)return;const c=demoCount();
s.insertAdjacentHTML('beforeend',`<div style="height:22px"></div><div class="cap" style="font-size:1rem;font-weight:700;color:var(--pri);letter-spacing:0;text-transform:none;border-bottom:2px solid var(--muted);padding-bottom:6px;margin-bottom:8px">Testdaten</div><div class="s" style="margin-bottom:8px">${DEMO.rez.length} Beispielrezepte mit passendem Lager zum Ausprobieren. Deine eigenen Daten bleiben unberührt.${c.r||c.i?` Geladen: ${c.r} Rezepte, ${c.i} Rohstoffe.`:''}</div><div class="btns"><button class="btn" onclick="demoAsk()">Testdaten laden</button>${c.r||c.i?'<button class="btn sec" onclick="demoRmAsk()">Testdaten entfernen</button>':''}</div>`)};
function demoAsk(){openSheet(`<h2>Testdaten laden?</h2><div style="font-size:.92rem">Es werden ${DEMO.rez.length} Beispielrezepte angelegt und die dafür nötigen Rohstoffe in üblichen Packungsgrößen als vorhanden eingetragen. Bei Rohstoffen, die du schon hast, wird höchstens eine fehlende Dichte ergänzt. Die Zusammensetzungen sind nicht geprüft und nicht zum Nachmischen gedacht. Du kannst alles wieder entfernen.</div><div class="btns"><button class="btn" onclick="demoLoad()">Laden</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function demoLoad(){const snap=JSON.stringify(S);if(!S.rez)S.rez=[];const ex=new Set(S.rez.filter(r=>r.demo).map(r=>r.demo));
const today10=new Date().toISOString().slice(0,10);const mh=new Date();mh.setMonth(mh.getMonth()+20);const mhd=mh.toISOString().slice(0,10);
const idOf={};DEMO.stock.forEach(s=>{const c=CM[s.cid];if(!c)return;let it=S.items.find(x=>x.cid===s.cid)||S.items.find(x=>FOLD(x.name)===FOLD(c.n));
if(!it){it=mk(c,{kind:s.kind,total:s.total,dens:s.dens||0,min:Math.round(s.total*0.2),mhd,demo:true,vessels:[{id:uid(),typ:s.kind==='v'?'flasche':'dose',nr:1,cap:s.pack,amount:s.total,ort:'Regal'}],verw:'Testdaten'});S.items.push(it)}
else if(it.kind==='v'&&!(it.dens>0)&&s.dens)it.dens=s.dens;
idOf[s.cid]=it.id});
let nr=0;DEMO.rez.forEach(r=>{if(ex.has(r.key))return;const now=new Date().toISOString();
const d={name:r.name,zweck:r.zweck,ph:r.ph,ergibt:r.ergibt,zeit:r.zeit,grad:r.grad,phasen:r.phasen.map(p=>({id:uid(),typ:p.typ,name:p.name,z:p.z.map(z=>({id:uid(),item:z.cid?idOf[z.cid]||'':'',cid:z.cid||'',name:z.name||'',g:z.g}))})),mod:r.mod.map(m=>({id:uid(),t:m.t,titel:m.titel,text:m.text}))};
S.rez.push({id:uid(),created:now,demo:r.key,vers:[{n:1,date:now,note:DEMO_NOTE,diff:[],from:0,st:'',d}]});nr++});
save();closeSheet();undoOffer('Testdaten geladen',snap,JSON.stringify(S),true);tab('rez');toast(nr+' Rezepte geladen')}
function demoRmAsk(){const c=demoCount();openSheet(`<h2>Testdaten entfernen?</h2><div style="font-size:.92rem">Entfernt ${c.r} Testrezepte samt ihren Chargen und ${c.i} Testrohstoffe. Alles, was du selbst angelegt hast, bleibt.</div><div class="btns"><button class="btn danger" onclick="demoRm()">Entfernen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function demoRm(){const snap=JSON.stringify(S);const ids=new Set(S.rez.filter(r=>r.demo).map(r=>r.id));S.rez=S.rez.filter(r=>!r.demo);if(S.chg)S.chg=S.chg.filter(c=>!ids.has(c.rez));
const mine=new Set();S.rez.forEach(r=>r.vers.forEach(v=>v.d.phasen.forEach(p=>p.z.forEach(z=>z.item&&mine.add(z.item)))));
S.items=S.items.filter(i=>!i.demo||mine.has(i.id));
save();closeSheet();undoOffer('Testdaten entfernt',snap,JSON.stringify(S),true);tab('rez');toast('Testdaten entfernt')}
