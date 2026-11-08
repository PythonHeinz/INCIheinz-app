const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const o={};
S.expert=true;save();tbsLoad();await W();
const rav=S.items.find(i=>i.cid==='K0167');o.rav=!!rav&&rav.tb;
go('check','Ätherisches Öl');await W();
toggleCat('K0167');await W();o.removedTest=!S.items.some(i=>i.cid==='K0167');
toggleCat('K0167');await W();o.backOn=S.items.some(i=>i.cid==='K0167');
toggleCat('K0167');await W();o.offAgain=!S.items.some(i=>i.cid==='K0167');
// Artikel mit Menge bleibt gesperrt
const b2=S.items.find(i=>i.tb==='sonja'&&i.cid);b2.total=20;b2.unk=false;const id=b2.cid;toggleCat(id);await W();o.keptWithQty=S.items.some(i=>i.cid===id);
// eigene Notiz sperrt
const c2=S.items.find(i=>i.tb==='sonja'&&i.cid&&i.unk);c2.notiz='meine Notiz';const id2=c2.cid;toggleCat(id2);await W();o.keptWithNote=S.items.some(i=>i.cid===id2);
// normal angehakter Artikel (ohne Testbestand) lässt sich abwählen
const x=CAT.find(c=>!S.items.some(i=>i.cid===c.id));toggleCat(x.id);await W();const on=S.items.some(i=>i.cid===x.id);toggleCat(x.id);await W();o.plain=[on,!S.items.some(i=>i.cid===x.id)];
return o});
console.log(JSON.stringify(r));console.log('errors:',errs);await b.close()})();
