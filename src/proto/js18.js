
/* =====================================================================
   Rezeptbuch v1 (js18: Daten, Rechner, Mischbarkeit, Navigation, Liste, Ansicht)
   Seiten: rez (Liste), rezv (Rezept), reze (Editor), verl (Versionen),
           misch (Werkbank), mbar (Mischbar), chgs (Chargenbuch), chg (Charge)
   Daten: S.rez[] (Rezepte mit Versionen), S.chg[] (Chargen)
   ===================================================================== */
const RZP={rez:1,rezv:1,reze:1,verl:1,misch:1,mbar:1,bau:1,chgs:1,chg:1,rzstat:1};
let RE=null,RC={id:null,ver:0,total:0,anchor:null},RM=null,RZQ='',RZF='alle',RZ_CB=null;
const rzAll=()=>S.rez=S.rez||[];
const rzChgAll=()=>S.chg=S.chg||[];
const rzGet=id=>rzAll().find(r=>r.id===id);
const rzCurV=r=>r.vers[r.vers.length-1];
const rzVer=(r,n)=>r.vers.find(v=>v.n===n)||rzCurV(r);
const rzClone=o=>JSON.parse(JSON.stringify(o));
const rzEmpty=()=>({name:'',zweck:'',ph:'',ergibt:'',zeit:'',grad:'',phasen:[{id:uid(),typ:'',name:'Zutaten',pool:true,z:[]}],mod:[]});
const rzSum=d=>d.phasen.reduce((s,p)=>s+p.z.reduce((a,z)=>a+(+z.g||0),0),0);
const rzIv=x=>String(Math.round((+x||0)*100)/100).replace('.',LANG==='de'?',':'.');
const rzStep=()=>S.rezStep||0.1;
const rzR=x=>{const s=rzStep();return Math.round(x/s)*s};
const rzG=x=>nf(Math.round(rzR(x)*100)/100,2);
const RZPH={A:'Wasserphase',B:'Fett-/Ölphase',C:'Wärmeempfindliche Phase',D:'pH-Einstellung','':'Eigene Phase'};
const RZMT={schritt:['Arbeitsschritt','list'],hinweis:['Hinweis','info'],abfuell:['Abfüllung & Verpackung','drop'],halt:['Haltbarkeit','refresh'],notiz:['Notiz','book']};
const RZABL0=['Einwiegen & Erhitzen','Emulgieren','Abkühlen & sanft rühren','Wirkstoffe einrühren','Qualitätskontrolle'];
const rzAbl=()=>Array.isArray(S.rzAbl)&&S.rzAbl.length?S.rzAbl:RZABL0;
const rzMinOf=s=>{const t=String(s==null?'':s).trim().toLowerCase().replace(',','.');let m=t.match(/^(\d+(?:\.\d+)?)\s*(min|m|minuten?)?$/);if(m)return +m[1];m=t.match(/^(\d+(?:\.\d+)?)\s*(h|std|stunden?)\s*(?:(\d+)\s*(?:min|m)?)?$/);if(m)return Math.round(+m[1]*60+(+m[3]||0));return null};
const rzZeit=s=>{const n=rzMinOf(s);if(n==null)return String(s||'');if(n>=60){const h=Math.floor(n/60),m=Math.round(n%60);return h+' h'+(m?' '+m+' min':'')}return Math.round(n)+' min'};
/* Dichte je Zutat (Lager, sonst Wasser = 1) und Volumenrechnung */
const rzDensZ=z=>{const i=rzItem(z);if(i&&i.dens>0)return i.dens;return /^(wasser|aqua|dest|h2o|h₂o)/i.test(rzName(z)||'')?1:0};
const rzVolBase=d=>d.phasen.reduce((s,p)=>s+p.z.reduce((a,z)=>{const g=+z.g||0,dn=rzDensZ(z);return a+(g>0&&dn>0?g/dn:0)},0),0);
const rzVolMiss=d=>{const o=[];d.phasen.forEach(p=>p.z.forEach(z=>{if((+z.g||0)>0&&!(rzDensZ(z)>0)&&!o.some(x=>x.n===rzName(z)))o.push({n:rzName(z),i:rzItem(z)})}));return o};
const rzVolOk=d=>rzSum(d)>0&&!rzVolMiss(d).length;

/* ---------- Zutat ↔ Lager ---------- */
function rzItem(z){if(z.item){const i=getI(z.item);if(i)return i}
if(z.cid){const i=S.items.find(x=>x.cid===z.cid);if(i)return i}
const f=FOLD(z.name);return f?(S.items.find(x=>FOLD(x.name)===f)||null):null}
const rzName=z=>{const i=rzItem(z);return i?i.name:(z.name||(z.cid&&typeof CM!=='undefined'&&CM[z.cid]?CM[z.cid].n:''))};
function rzInciOf(z){const i=rzItem(z);if(i)return i.inci||'';const c=z.cid&&CM[z.cid];if(c)return c.i||'';return /^(wasser|aqua|dest|h2o|h₂o)/i.test(z.name||'')?'Aqua':''}
function rzHave(z){const i=rzItem(z);if(!i)return z.cid?{k:'nein'}:{k:'frei'};if(i.unk)return {k:'unb',i};
let g=null;if(i.kind==='w')g=i.total;else if(i.kind==='v'&&i.dens>0)g=i.total*i.dens;if(g==null)return {k:'unb',i,dens:i.kind==='v'};return {k:'ok',g,i}}
function rzCheck(d,total){const sum=rzSum(d);const rows=[];let max=Infinity;const miss=[],low=[];
d.phasen.forEach((p,pi)=>p.z.forEach((z,zi)=>{const need=sum>0?(+z.g||0)/sum*total:0;const h=rzHave(z);let st='frei';
if(h.k==='ok'){st=h.g<=1e-9?'fehlt':h.g+1e-9<need?'knapp':'ok';if(z.g>0)max=Math.min(max,h.g/((+z.g)/sum));if(st==='fehlt')miss.push({z,need});else if(st==='knapp')low.push({z,need,fehlt:need-h.g})}
else if(h.k==='nein'){st='fehlt';miss.push({z,need})}else if(h.k==='unb')st=h.dens?'dens':'unb';
rows.push({z,pi,zi,need,have:h.k==='ok'?h.g:null,st,item:h.i||rzItem(z)})}));
return {rows,sum,miss,low,max:max===Infinity?null:max,ok:!miss.length&&!low.length}}
function rzCost(rows){let c=0,n=0;rows.forEach(x=>{const i=x.item;if(!i){if(x.z.cid)n++;return}const ch=cheapest(i);if(!ch){n++;return}let pg=ch.p/100;
if(i.kind==='v'){if(i.dens>0)pg=pg/i.dens;else{n++;return}}else if(i.kind!=='w'){n++;return}c+=pg*x.need});return {c,n}}
function rzInci(d){const m={};d.phasen.forEach(p=>p.z.forEach(z=>{const k=FOLD(rzName(z));if(!k)return;(m[k]=m[k]||{z,g:0}).g+=(+z.g||0)}));
const list=Object.values(m).sort((a,b)=>b.g-a.g);const parts=[],un=[],no=[];
list.forEach(x=>{const i=rzItem(x.z);const t=rzInciOf(x.z).trim();if(!t){no.push(rzName(x.z));parts.push(rzName(x.z)+' [INCI fehlt]')}else{parts.push(t.replace(/\s*,\s*/g,', '));if(i&&i.ist!=='geprüft')un.push(i.name)}});
return {text:parts.join(', '),un,no}}
function rzUses(itemId){const it=getI(itemId);if(!it)return [];return rzAll().filter(r=>rzCurV(r).d.phasen.some(p=>p.z.some(z=>{const i=rzItem(z);return i&&i.id===itemId}))).map(r=>r)}
function rzMixInfo(r){const d=rzCurV(r).d;const sum=rzSum(d);return {d,sum,c:rzCheck(d,sum||100)}}

/* ---------- Kopf mit Logo und Registern, Navigation ---------- */
header=function(sub,bk){const w=RZP[R.name]?'rez':'lager';
return `<header class="h2"><div class="hr">${bk?`<button class="ib" onclick="back()" aria-label="Zurück">${ic('back')}</button>`:'<div style="width:44px"></div>'}<div class="logo"><div class="ring">${ic('drop','var(--pri)',17)}</div><div><b>INCI<span>heinz</span></b><small>${sub}</small></div></div><div style="width:44px"></div></div>
<div class="reg"><button class="${w==='lager'?'on':''}" onclick="rzWorld('lager')">Lager</button><button class="${w==='rez'?'on':''}" onclick="rzWorld('rez')">Rezeptbuch</button></div></header>`};
function rzDirty(){return (R.name==='reze'&&RE&&RE.dirty)||(R.name==='misch'&&RM&&RM.touched)}
function rzAsk(title,text,ok,fn){RZ_CB=fn;openSheet(`<h2>${title}</h2><div style="font-size:.92rem">${text}</div><div class="btns"><button class="btn" onclick="const f=RZ_CB;RZ_CB=null;closeSheet();f()">${ok}</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function rzWorld(w){const f=()=>{RE=null;RM=null;draftClear();tab(w==='rez'?'rez':'lager')};
if(rzDirty())rzAsk('Ungespeicherte Arbeit','Wenn du jetzt wechselst, gehen die Änderungen verloren.','Trotzdem wechseln',f);else f()}
const back18=back;back=function(){if(rzDirty()){rzAsk('Ungespeicherte Arbeit','Wenn du zurückgehst, gehen die Änderungen verloren.','Verwerfen',()=>{RE=null;RM=null;draftClear();back18()});return}
if(R.name==='reze'||R.name==='misch'){RE=null;RM=null}back18()};
function rznav(a){const it=(k,l,i)=>`<button class="${a===k?'on':''}" onclick="tab('${k}')">${ic(i)}<span>${l}</span></button>`;
return `<nav>${it('rez','Rezepte','book')}${it('bau','Rechner','calc')}<div style="flex:1;display:flex;flex-direction:column;align-items:center"><button class="plus" onclick="rzNew()" aria-label="Neues Rezept">${ic('plus','#fff',26)}</button><span style="font-size:.68rem;font-weight:500;color:var(--sub);margin-top:2px">Neu</span></div>${it('chgs','Chargen','list')}<button onclick="sheetMehr()">${ic('more')}<span>Mehr</span></button></nav>`}
const draw18=draw;
draw=function(){const rz=!!RZP[R.name];$('#app').classList.toggle('rez',rz);if(!rz)return draw18.apply(this,arguments);
const v=$('#view');closeSheet();$('#app').classList.remove('artpg');
const sub={rez:'REZEPTBUCH',bau:'REZEPTBUCH',mbar:'MISCHBAR',chgs:'CHARGENBUCH',rzstat:'STATISTIK'}[R.name]||'REZEPTBUCH';
const bk=!['rez','mbar','bau','chgs'].includes(R.name)||(R.name==='chgs'&&!!R.rez);
const nav=['reze','misch'].includes(R.name)?'':rznav(R.name==='verl'||R.name==='rezv'||R.name==='rzstat'?'rez':R.name==='chg'?'chgs':R.name);
v.innerHTML=header(sub,bk)+`<main id="main"></main>`+nav;
({rez:rzList,rezv:rzView,reze:rzEd,verl:rzVerl,misch:rzMisch,mbar:rzMbar,bau:rzBau,chgs:rzChgs,chg:rzChg,rzstat:rzStatPage})[R.name]();
if(R.name!=='misch')rzWake(false)};
let RZW=null;async function rzWake(on){try{if(on&&navigator.wakeLock&&!RZW){RZW=await navigator.wakeLock.request('screen')}else if(!on&&RZW){RZW.release();RZW=null}}catch(_){RZW=null}}
function rzOpen(id,ver){stack.push(R);R={name:'rezv',id,ver:ver||0,edit:false};RC={id:null,ver:0,total:0,anchor:null};draw()}

/* ---------- Liste ---------- */
function rzStat(r){const m=rzMixInfo(r);const c=m.c;
if(c.ok)return c.rows.some(x=>x.st==='unb')?{t:'Menge offen',cls:'unk',c}:{t:'mischbar',cls:'ok',c};const n=c.miss.length+c.low.length;return {t:'fehlt '+n,cls:'err',c}}
function rzList(){const m=$('#main');const all=rzAll().slice().sort((a,b)=>rzCurV(b).date<rzCurV(a).date?-1:1);
if(!all.length){m.innerHTML=`<div class="card rz-empty"><div class="rz-t" style="margin-bottom:6px">Dein Rezeptbuch</div><div class="s" style="font-size:.92rem;line-height:1.5">Schreibe Rezepte mit Zutaten aus deinem Lager. Die App rechnet Mengen um, zeigt, ob du alles da hast, und merkt sich jede Version.</div><div class="btns"><button class="btn" onclick="rzEdit(null)">Erstes Rezept anlegen</button></div></div>`;return}
const q=FOLD(RZQ);let l=all.filter(r=>!q||FOLD(rzCurV(r).d.name+' '+rzCurV(r).d.zweck).includes(q));
const st=l.map(r=>[r,rzStat(r)]);if(RZF==='mix')l=st.filter(x=>x[1].cls==='ok').map(x=>x[0]);
const nmix=all.filter(r=>rzStat(r).cls==='ok').length;m.innerHTML=`<div class="search"><span style="padding:0 6px 0 12px;display:flex">${ic('search','var(--sub)',18)}</span><input id="rzq" value="${esc(RZQ)}" placeholder="Rezept suchen" oninput="RZQ=this.value;rzList2()"></div><div class="seg"><button class="${RZF==='mix'?'':'on'}" onclick="RZF='alle';rzList()">Alle <i>${all.length}</i></button><button class="${RZF==='mix'?'on':''}" onclick="RZF='mix';rzList()">Mischbar <i>${nmix}</i></button></div>
<div id="rzl" style="margin-top:12px"></div>`;rzList2()}
function rzList2(){const q=FOLD(RZQ);let l=rzAll().slice().sort((a,b)=>rzCurV(b).date<rzCurV(a).date?-1:1).filter(r=>!q||FOLD(rzCurV(r).d.name+' '+rzCurV(r).d.zweck).includes(q));
const rows=l.map(r=>[r,rzStat(r)]).filter(x=>RZF!=='mix'||x[1].cls==='ok');const box=document.getElementById('rzl');if(!box)return;
box.innerHTML=rows.length?`<div class="card">${rows.map(([r,s])=>{const v=rzCurV(r),n=rzChgAll().filter(c=>c.rez===r.id).length;
return `<div class="row" onclick="rzOpen('${r.id}')"><div class="t"><b class="nm rz-rn">${esc(v.d.name)}</b><div class="s">Version ${v.n} · ${nf(rzSum(v.d))} g${n?` · ${n} ${n===1?'Charge':'Chargen'}`:''}</div></div><span class="rz-chip ${s.cls}">${s.t}</span></div>`}).join('')}</div>`:`<div class="s" style="padding:16px 4px">${RZF==='mix'?'Aktuell ist kein Rezept komplett mischbar.':'Nichts gefunden.'}</div>`}
function rzMbar(){const m=$('#main');const all=rzAll().map(r=>({r,s:rzStat(r)}));
const ok=all.filter(x=>x.s.cls==='ok'),unk=all.filter(x=>x.s.cls==='unk'),near=all.filter(x=>x.s.cls==='err'&&x.s.c.miss.length+x.s.c.low.length<=2).sort((a,b)=>(a.s.c.miss.length+a.s.c.low.length)-(b.s.c.miss.length+b.s.c.low.length)),far=all.filter(x=>!ok.includes(x)&&!near.includes(x)&&!unk.includes(x));
if(!all.length){m.innerHTML=`<div class="card rz-empty"><div class="s" style="font-size:.92rem">Hier siehst du, welche Rezepte du jetzt aus deinem Lager mischen kannst. Lege zuerst ein Rezept an.</div><div class="btns"><button class="btn" onclick="rzEdit(null)">Rezept anlegen</button></div></div>`;return}
const row=(x,sub)=>`<div class="row" onclick="rzOpen('${x.r.id}')"><div class="t"><b class="nm rz-rn">${esc(rzCurV(x.r).d.name)}</b><div class="s">${sub}</div></div>${ic('chev','var(--sub)',18)}</div>`;
const sec=(t,l,f)=>l.length?`<div class="cap" style="margin:16px 0 8px">${t}</div><div class="card">${l.map(f).join('')}</div>`:'';
const miss=x=>x.s.c.miss.map(a=>rzName(a.z)).concat(x.s.c.low.map(a=>rzName(a.z)));
m.innerHTML=sec('Jetzt mischbar',ok,x=>row(x,x.s.c.max?'bis zu '+nf(Math.floor(x.s.c.max))+' g möglich':'alle Zutaten vorhanden'))+sec('Menge im Lager offen',unk,x=>row(x,'bei einer Zutat ist keine Menge eingetragen'))+sec('Fast mischbar',near,x=>row(x,'es fehlt: '+esc(miss(x).join(', '))))+sec('Es fehlt mehr',far,x=>row(x,esc(miss(x).length+' Zutaten fehlen oder reichen nicht')))}

/* ---------- Rezept ansehen mit Rechner ---------- */
function rzBan(c){if(c.ok){const u=c.rows.filter(x=>x.st==='unb').length,dn=c.rows.filter(x=>x.st==='dens');return {cls:u?'':'ok',h:u?'Menge im Lager offen':'Mischbar mit deinem Lager',s:[c.max!=null?'Reicht für bis zu '+nf(Math.floor(c.max))+' g.':'',u?`Bei ${u} Zutat${u>1?'en':''} ist keine Menge eingetragen.`:'',dn.length?`Dichte fehlt bei: ${dn.map(x=>esc(x.item.name)).join(', ')}. Trag sie ein, dann wird die Menge geprüft.`:''].filter(Boolean).join('</div><div>')}}
const l=c.miss.map(a=>esc(rzName(a.z))).concat(c.low.map(a=>esc(rzName(a.z))+' (−'+rzG(a.fehlt)+' g)'));
return {cls:'err',h:'Noch nicht mischbar',s:'Es fehlt: '+l.join(', ')+(c.max>0?'. Mit deinem Lager gehen höchstens '+nf(Math.floor(c.max))+' g.':'')}}
function rzView(){const r=rzGet(R.id);if(!r){tab('rez');return}const cur=rzCurV(r);const vn=R.ver||cur.n;const v=rzVer(r,vn);const d=v.d;
if(RC.id!==r.id||RC.ver!==vn)RC={id:r.id,ver:vn,total:Math.round(rzSum(d)*100)/100||100,anchor:null,unit:'g'};
const m=$('#main');const c=rzCheck(d,RC.total);const ban=rzBan(c);const cost=rzCost(c.rows);const inci=rzInci(d);const nch=rzChgAll().filter(x=>x.rez===r.id).length;
const meta=[d.zweck&&`<div class="kv"><span>Einsatzzweck</span><span class="nm">${esc(d.zweck)}</span></div>`,d.ph&&`<div class="kv"><span>Ziel-pH</span><span class="nm">${esc(d.ph)}</span></div>`,d.ergibt&&`<div class="kv"><span>Ergibt</span><span class="nm">${esc(d.ergibt)}</span></div>`,d.zeit&&`<div class="kv"><span>Zeitaufwand</span><span class="nm">${esc(rzZeit(d.zeit))}</span></div>`,d.grad&&`<div class="kv"><span>Schwierigkeit</span><span>${esc(d.grad)}</span></div>`].filter(Boolean).join('');
const ml=rzUnitOn(d),vok=rzVolOk(d),vm=rzVolMiss(d);
m.innerHTML=`${r.photo?`<button class="rz-photo" onclick="rzPhotoMenu('${r.id}')" aria-label="Foto ändern"><img src="${r.photo}" alt=""></button>`:''}<div class="rz-t nm">${esc(d.name)}</div>
<div class="s" style="margin-top:4px">Version ${vn} · ${dde(v.date.slice(0,10))}${nch?` · ${nch} ${nch===1?'Charge':'Chargen'}`:''}${v.st==='fav'?' · <b style="color:var(--pri)">Favorit</b>':v.st==='bad'?' · verworfen':''}</div>
${vn!==cur.n?`<div class="rz-old">Das ist eine ältere Version. <button class="lnk" onclick="rzOpen('${r.id}')">Zur aktuellen Version (v${cur.n})</button></div>`:''}
${v.note?`<div class="rz-note nm">${esc(v.note)}</div>`:''}
<div class="btns"><button class="btn" onclick="rzMischStart('${r.id}',${vn})">Mischen</button><button class="btn sec" onclick="rzEdit('${r.id}',${vn})">Bearbeiten</button><button class="btn sec" onclick="stack.push(R);R={name:'verl',id:'${r.id}'};draw()">Versionen</button></div>
<div class="rz-lk" style="margin-top:6px"><button class="lnk" onclick="rzChgOf('${r.id}')">${nch?`Chargen (${nch})`:'Noch keine Chargen'}</button><button class="lnk" onclick="rzFork('${r.id}',${vn})">Als neues Rezept speichern</button>${r.photo?'':`<button class="lnk" onclick="rzPhotoMenu('${r.id}')">Foto hinzufügen</button>`}</div>
<div class="rz-ban ${ban.cls}" id="rzban"><b>${ban.h}</b><div>${ban.s}</div></div>
<div class="card rz-calc"><div style="padding:12px 14px 4px"><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px"><label class="fld" style="margin:0;flex:1"><span>Gesamtmenge (${ml?'ml':'g'})</span><input id="rz_tot" inputmode="decimal" value="${rzIv(rzTotShow(d))}" oninput="rzTot(this.value)"></label>${vok?`<div class="seg2" role="group" aria-label="Einheit"><button class="${ml?'':'on'}" onclick="rzUnit('g')">g</button><button class="${ml?'on':''}" onclick="rzUnit('ml')">ml</button></div>`:''}</div><div class="s" style="margin-top:6px">Ändere die Gesamtmenge, alle Zutaten rechnen sich mit. Mengen im Rezept änderst du unter Bearbeiten.${!vok&&vm.length&&rzSum(d)>0?` Anzeige in ml geht, sobald bei allen Zutaten die Dichte bekannt ist (fehlt bei ${esc(vm.map(x=>x.n).join(', '))}).`:''}</div></div>
${d.phasen.map((p,pi)=>`<div class="rz-ph-h">${p.typ?`<span class="rz-badge">${p.typ}</span>`:''}<span class="nm">${esc(p.name)}</span></div>${p.z.map((z,zi)=>rzCalcRow(c,pi,zi)).join('')}`).join('')}
<div class="rz-sum" id="rzsum">${rzSumTxt(c,cost)}</div></div>
${c.miss.concat(c.low).some(a=>rzItem(a.z))?`<div class="btns"><button class="btn sec" onclick="rzToShop()">Fehlendes auf die Einkaufsliste</button></div>`:''}
<details class="acc"><summary>INCI-Deklaration <small>Entwurf</small></summary><div class="in"><div class="rz-inci nm">${esc(inci.text)||'–'}</div>
${inci.un.length||inci.no.length?`<div class="hint" style="margin-top:8px">${inci.no.length?'Ohne INCI: '+esc(inci.no.join(', '))+'. ':''}${inci.un.length?'INCI nicht geprüft bei: '+esc(inci.un.join(', '))+'.':''}</div>`:''}
<div class="hint" style="margin-top:8px">Sortiert nach Anteil, größter zuerst. Prüfe vor dem Verkauf selbst, was für dein Produkt gilt.</div><div class="btns"><button class="btn sec" onclick="xtCopyStr(rzInci(rzCurD()).text)">${ic('copy','currentColor',18)} Kopieren</button></div></div></details>
${meta?`<details class="acc"><summary>Eckdaten</summary><div class="in">${meta}</div></details>`:''}
${d.mod.length?`<details class="acc"><summary>Ablauf und Hinweise <small>${d.mod.length}</small></summary><div class="in">${d.mod.map((x,n)=>`<div class="rz-mv"><div class="rz-mvh">${x.t==='schritt'?`<span class="rz-badge">${d.mod.slice(0,n+1).filter(y=>y.t==='schritt').length}</span>`:''}<b class="nm">${esc(x.titel||RZMT[x.t][0])}</b>${x.t!=='schritt'?`<span class="s"> · ${RZMT[x.t][0]}</span>`:''}</div>${x.text?`<div class="nm" style="white-space:pre-wrap;font-size:.92rem">${esc(x.text)}</div>`:''}</div>`).join('')}</div></details>`:''}
<div class="btns"><button class="btn sec" onclick="rzPrint('${r.id}',${vn})">Rezeptkarte drucken</button><button class="btn sec" onclick="sheetRzShare('${r.id}')">Rezept teilen</button></div>`}
const rzUnitOn=d=>RC.unit==='ml'&&rzVolOk(d);
const rzTotShow=d=>{const s=rzSum(d)||1;return rzUnitOn(d)?RC.total/s*rzVolBase(d):RC.total};
function rzUnit(u){RC.unit=u;rzView()}
const rzCurD=()=>{const r=rzGet(R.id);return rzVer(r,R.ver||rzCurV(r).n).d};
function xtCopyStr(t){try{navigator.clipboard.writeText(t).then(()=>toast('Kopiert'),()=>toast('Kopieren nicht möglich'))}catch(e){toast('Kopieren nicht möglich')}}
function rzSumTxt(c,cost){const d=rzVer(rzGet(RC.id),RC.ver).d;const ml=rzUnitOn(d);return `<div class="kv"><span>Summe</span><span>${ml?rzIv(rzTotShow(d))+' ml · ':''}${rzG(RC.total)} g</span></div>${cost.c>0?`<div class="kv"><span>Kosten ca.</span><span>${eur(cost.c)}${RC.total>0?` · ${eur(cost.c/RC.total*100)} je 100 g`:''}</span></div>${cost.n?`<div class="s">${cost.n} Zutat${cost.n>1?'en':''} ohne Preis nicht eingerechnet.</div>`:''}`:''}`}
const rzShow=(z,need,ml)=>{if(ml){const dn=rzDensZ(z);return {v:rzIv(Math.round(need/dn*10)/10),u:'ml'}}return {v:rzIv(rzR(need)),u:'g'}};
function rzCalcRow(c,pi,zi){const x=c.rows.find(a=>a.pi===pi&&a.zi===zi);const z=x.z;const key=pi+'.'+zi;const d=rzVer(rzGet(RC.id),RC.ver).d;const sh=rzShow(z,x.need,rzUnitOn(d));
return `<div class="rz-r ${RC.anchor===key?'anc':''}" id="rzr_${pi}_${zi}"><div class="rz-n" ${x.item?(x.st==='dens'?`onclick="rzDens('${x.item.id}','draw()')"`:`onclick="go('artikel','${x.item.id}')"`):''}><span class="dot ${rzDot(x.st)}"></span><div style="min-width:0"><b class="nm">${esc(rzName(z)||'Zutat')}</b><div class="s" id="rzs_${pi}_${zi}">${rzStTxt(x)}</div></div></div><input class="rz-a" id="rza_${pi}_${zi}" inputmode="decimal" value="${sh.v}" readonly tabindex="-1" aria-label="Menge (nur Anzeige)"><span class="rz-u">${sh.u}</span></div>`}
const rzDot=st=>st==='ok'?'ok':st==='knapp'?'warn':st==='fehlt'?'err':'';
function rzStTxt(x){if(x.st==='ok')return 'Lager: '+fmt(x.item.total,x.item.kind);if(x.st==='knapp')return `Lager: ${rzG(x.have)} g · es fehlen ${rzG(x.need-x.have)} g`;
if(x.st==='fehlt')return x.item?'nicht vorrätig':'nicht im Lager';if(x.st==='unb')return 'Menge im Lager unbekannt';if(x.st==='dens')return 'Lager: '+fmt(x.item.total,'v')+' · Dichte fehlt, tippen zum Eintragen';return x.z.cid?'':''}
function rzUpd(skip){const r=rzGet(RC.id);if(!r)return;const d=rzVer(r,RC.ver).d;const c=rzCheck(d,RC.total);const cost=rzCost(c.rows);const ml=rzUnitOn(d);
c.rows.forEach(x=>{const k=x.pi+'_'+x.zi;const inp=document.getElementById('rza_'+k);if(inp&&('rza_'+k)!==skip)inp.value=rzShow(x.z,x.need,ml).v;const s=document.getElementById('rzs_'+k);if(s)s.textContent=rzStTxt(x);
const row=document.getElementById('rzr_'+k);if(row){const dot=row.querySelector('.dot');if(dot)dot.className='dot '+rzDot(x.st);row.classList.toggle('anc',RC.anchor===x.pi+'.'+x.zi)}});
const t=document.getElementById('rz_tot');if(t&&skip!=='rz_tot')t.value=rzIv(rzTotShow(d));const ban=rzBan(c);const b=document.getElementById('rzban');if(b){b.className='rz-ban '+ban.cls;b.innerHTML=`<b>${ban.h}</b><div>${ban.s}</div>`}
const s=document.getElementById('rzsum');if(s)s.innerHTML=rzSumTxt(c,cost)}
function rzTot(v){const n=num(v);if(!(n>0))return;const d=rzVer(rzGet(RC.id),RC.ver).d;RC.total=rzUnitOn(d)?n/rzVolBase(d)*rzSum(d):n;RC.anchor=null;rzUpd('rz_tot')}
function rzAnch(pi,zi,v){let n=num(v);const r=rzGet(RC.id);const d=rzVer(r,RC.ver).d;const z=d.phasen[pi].z[zi];if(rzUnitOn(d))n=n*rzDensZ(z);if(!(n>0)||!(z.g>0))return;RC.total=n/z.g*rzSum(d);RC.anchor=pi+'.'+zi;rzUpd('rza_'+pi+'_'+zi)}
function rzToShop(){const r=rzGet(RC.id);const d=rzVer(r,RC.ver).d;const c=rzCheck(d,RC.total);let n=0;
c.miss.concat(c.low).forEach(a=>{const i=rzItem(a.z);if(!i||!'wv'.includes(i.kind))return;let need=a.fehlt!=null?a.fehlt:a.need;if(i.kind==='v')need=i.dens>0?need/i.dens:0;if(!(need>0))return;
if(S.shop.some(s=>s.item===i.id))return;S.shop.push({id:uid(),item:i.id,menge:Math.ceil(need),lief:''});n++});save();toast(n?n+' Posten auf der Einkaufsliste':'Nichts hinzugefügt, die Zutaten stehen schon auf der Liste oder sind nicht im Lager')}

/* ---------- Artikelseite: Verwendung in Rezepten ---------- */
const artikel18=artikel;
artikel=function(i){artikel18.apply(this,arguments);if(R.edit)return;const u=rzUses(i.id);if(!u.length)return;const m=$('#main');if(!m)return;
const rows=u.map(r=>{const info=rzMixInfo(r);const z=info.d.phasen.flatMap(p=>p.z).filter(z=>{const it=rzItem(z);return it&&it.id===i.id});const g=z.reduce((s,a)=>s+(+a.g||0),0);const base=info.sum;const h=rzHave(z[0]);
const n=h.k==='ok'&&g>0?Math.floor(h.g/g):null;return `<div class="row" onclick="rzOpen('${r.id}')"><div class="t"><b class="nm">${esc(rzCurV(r).d.name)}</b><div class="s">${nf(g/base*100,1)} % im Rezept${n!=null?` · reicht für ${n} ${n===1?'Ansatz':'Ansätze'} à ${nf(base)} g`:''}</div></div>${ic('chev','var(--sub)',18)}</div>`}).join('');
m.insertAdjacentHTML('beforeend',`<div class="cap" style="margin:18px 0 8px">Verwendet in Rezepten</div><div class="card" style="margin-bottom:16px">${rows}</div>`)};

/* ---------- Sicherung: Rezepte beim Zusammenführen übernehmen ---------- */
const restoreMerge18=restoreMerge;
restoreMerge=function(){const d=IMP&&IMP.json;restoreMerge18.apply(this,arguments);try{if(d){rzAll();(d.rez||[]).forEach(r=>{if(!S.rez.find(x=>x.id===r.id))S.rez.push(r)});rzChgAll();(d.chg||[]).forEach(c=>{if(!S.chg.find(x=>x.id===c.id))S.chg.push(c)});save()}}catch(e){}};
