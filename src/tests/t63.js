const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(250);return r};
const out={};
await T(()=>{S.expert=true});
// 1 neuer Artikel mit 200 g, danach Dose
out.a=await T(()=>{const c=CAT[0];const it=mk(c,{kind:'w',total:200,vessels:[]});S.items.push(it);window.__id=it.id;save();artikel(it);return it.id});
out.a1=await T(()=>{sheetVessel(__id);return {vc:document.querySelector('#vc').value,vu:document.querySelector('#vu').value}});
out.a2=await T(()=>{document.querySelector('#vn').value='1';saveVessel(__id);const i=getI(__id);return {total:i.total,v:i.vessels.length,txt:document.body.innerText.match(/\d+ Gefäß[^\n]*/)?.[0]}});
// 2 Menge unbekannt + 2 Flaschen
out.b=await T(()=>{const it=mk(CAT[1],{kind:'v',total:0,unk:true,vessels:[]});S.items.push(it);window.__id2=it.id;save();artikel(it);sheetVessel(it.id);document.querySelector('#vn').value='2';document.querySelector('#vc').value='100';document.querySelector('#vu').value='ml';saveVessel(it.id);return {total:it.total,unk:it.unk,v:it.vessels.length}});
// 3 angebrochen
out.c=await T(()=>{const i=getI(__id2);i.total=160;save();artikel(i);return document.body.innerText.match(/\d+ Gefäße?[^\n]*/)?.[0]});
// 4 edit + delete
out.d=await T(()=>{const i=getI(__id2);const v=i.vessels[0];sheetVessel(i.id,v.id);document.querySelector('#vc').value='250';saveVessEdit(i.id,v.id);const t1=i.total,cap=v.cap;delVessel(i.id,i.vessels[1].id);return {t1,cap,left:i.vessels.length,total:i.total}});
// 5 Menge unter Summe der Gefäße
out.e=await T(()=>{const i=getI(__id2);sheetMenge(i.id);document.querySelector('#f1').value='50';document.querySelector('#f2').value='ml';saveMenge(i.id);return i.total});
// 6 Rezept-Abzug
out.f=await T(()=>{const i=getI(__id2);i.total=300;const r=typeof rzTake;return r});
// 7 Rezeptbuch + Lager rendern
out.g=await T(()=>{try{tab('lager');return 'ok'}catch(e){return e.message}});
console.log(JSON.stringify(out,null,1),errs);
await p.screenshot({path:'s63.png'});await b.close()})();
