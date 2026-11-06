const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(250);
await p.evaluate(()=>{S.expert=true;demoLoad();tab('rez')});await W();
// Katalog-Update mit neuen Feldern simulieren
const r=await p.evaluate(async()=>{
 const its=S.items.filter(i=>i.cid&&CM[i.cid]);const a=its[0],b2=its[1];a.dens=0;b2.dens=0.95;
 const items=CAT.map(c=>{const x=Object.assign({},c);if(c.id===a.cid){x.d=0.93;x.e0=1;x.e1=5}if(c.id===b2.cid){x.d=0.5;x.e0=2;x.e1=3}return x});
 window.fetch=async()=>({ok:true,json:async()=>({version:'9.9',date:'2026-11-07',items})});
 await sheetCatUpd();await new Promise(r=>setTimeout(r,300));
 const txt=document.getElementById('cu').innerText;catApply();
 return {txt,ida:a.id,idb:b2.id,da:getI(a.id).dens,db:getI(b2.id).dens,e:einsatzOf(getI(a.id)),cm:CM[a.cid].e1}});
chk('Update erkennt neue Angaben',/ergänzte Angaben/.test(r.txt));
chk('leere Dichte aus Katalog gefüllt',Math.abs(r.da-0.93)<1e-9);
chk('eigene Dichte bleibt',Math.abs(r.db-0.95)<1e-9);
chk('Einsatz-Fallback aus Katalog',r.e.lo===1&&r.e.hi===5&&r.e.src==='cat');
// Anzeige Richtwert
await p.evaluate(id=>{go('artikel',id)},r.ida);await W();
chk('Artikel zeigt Richtwert',/Richtwert aus dem Katalog/.test(await p.evaluate(()=>document.getElementById('main').innerText)));
// eigene Werte haben Vorrang
const pr=await p.evaluate(id=>{const i=getI(id);i.dmin=2;i.dmax=3;return einsatzOf(i)},r.ida);chk('eigene Werte vor Katalog',pr.lo===2&&pr.src==='own');
// Dosierung: Farben + Richtwert
await p.evaluate(()=>{tab('rez');tab('bau');rchOpen('dos')});await W();
const rid=await p.evaluate(()=>rzAll().find(x=>rzCurV(x).d.phasen.flatMap(p=>p.z).some(z=>z.g>0&&rzItem(z)&&rzItem(z).id))&&rzAll()[0].id);
await p.evaluate(({id,a})=>{const r=rzAll().find(r=>rzCurV(r).d.phasen.flatMap(p=>p.z).some(z=>rzItem(z)&&rzItem(z).id===a))||rzAll()[0];getI(a).dmin=0;getI(a).dmax=0.01;RCH.dos.id=r.id;dosPage()},{id:rid,a:r.ida});await W();
const col=await p.evaluate(()=>({red:!!document.querySelector('#main .row[style*="--err"]'),b:getComputedStyle(document.querySelector('#main .cap')).color}));
console.log(JSON.stringify(col));
await p.screenshot({path:'/tmp/s_dos2.png',fullPage:true});
console.log('ok',ok,'bad',bad,errs);await b.close()})();
