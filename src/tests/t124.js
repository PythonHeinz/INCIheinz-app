const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const out=await p.evaluate(async()=>{const W=(t=450)=>new Promise(x=>setTimeout(x,t));const r={};
// Rezept löschen + Rückgängig
const n0=S.rez.length;const id=S.rez[0].id;tab('rez');await W();rzOpen(id);await W();
r.hasLink=!!document.querySelector('#main [onclick^="rzDelAsk"]');
rzDelAsk(id);await W();r.ask=document.body.innerText.includes('Rezept löschen?');
shEl().querySelector('.btns .btn').click();await W();
r.deleted=[n0,S.rez.length,R.name];r.undo=!!UNDO;
doUndo(true);await W();r.restored=S.rez.length===n0;
// Einstellungen
sheetAppSet();await W();const sh=shEl().innerText;r.settingsRow=sh.includes('Meine Sprache (Zielsprache)');r.noChips=!shEl().querySelector('#mutset')&&!shEl().querySelector('.pill');
[...shEl().querySelectorAll('.row')].find(e=>e.innerText.includes('Zielsprache')).click();await W();
r.sub=shEl().innerText.slice(0,40);[...shEl().querySelectorAll('.pill')].find(e=>e.innerText==='English').click();await W();r.mut=S.mut;S.mut='de';save();
closeSheet();await W();
// Guide-Pfad
r.links=kiLinks('<b>Mehr › Einstellungen › Hilfe › Anleitung</b> und <b>fett</b>').match(/kipath/g).length;
kiPathGo('Mehr › Einstellungen › Hilfe › Anleitung');await W(2600);
r.guide=shEl()?shEl().innerText.slice(0,60):'kein Sheet';r.toast=(document.getElementById('toast')||{}).innerText;r.nav=[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>e.innerText.split('\n')[0]).slice(0,12);
return r});
console.log(JSON.stringify(out,null,1),errs);await b.close()})();
