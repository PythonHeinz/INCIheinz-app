const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,250));const r={};
let net=0;const of=window.fetch;window.fetch=function(u){if(String(u).includes('googleapis'))net++;return of.apply(this,arguments)};
r.offStart=kiOn();
try{await kiCall('s','u');r.offCall='kein Fehler'}catch(e){r.offCall=e.message}
sheetAppSet();await W();r.kiRow=document.getElementById('sheet').innerText.includes('KI-Funktionen');
sheetMehr();await W();r.guideRowOff=document.getElementById('sheet').innerText.includes('App-Guide');
sheetKI();await W();
document.getElementById('kikey').value='FAKE';window.KI_MOCK=async()=>{throw kiErr('key',403)};await kiCheckBtn();await W();r.badKey=document.getElementById('kimsg').innerText;r.onAfterBad=kiOn();
sheetKI();await W();document.getElementById('kikey').value='GOODKEY';window.KI_MOCK=async()=>'ok';await kiCheckBtn();await W();r.goodMsg=document.getElementById('kimsg').innerText;r.onAfterGood=kiOn();r.keyInS=JSON.stringify(S).includes('GOODKEY');r.keyInBackup=JSON.stringify(S).includes('GOODKEY');
window.KI_MAPTEXT='# Landkarte\n## 1. Navigation\nMehr oeffnet das Menue.\n## 9. Technische Zuordnung\nGEHEIM';let sysSeen='';
window.KI_MOCK=async(s,u)=>{sysSeen=s+'||'+u;return '**Schritt 1:** Mehr tippen.'};
sheetMehr();await W();r.guideRowOn=document.getElementById('sheet').innerText.includes('App-Guide');
sheetGuide();await W();document.getElementById('kigq').value='Wie finde ich das Menue?';await kiAsk();await W();
r.answer=document.getElementById('kiga').innerHTML;r.mapCut=!sysSeen.includes('GEHEIM');r.mapIn=sysSeen.includes('Mehr oeffnet');r.noUserData=!sysSeen.includes(S.items[0]?S.items[0].name:'@@');
kiRemove();await W();r.onAfterRemove=kiOn();r.keyGone=localStorage.getItem('inciheinz-ki-key');
try{await kiCall('s','u');r.afterRemove='kein Fehler'}catch(e){r.afterRemove=e.message}
r.netCalls=net;
/* Testsatz */
S.expert=true;demoLoad();await W();demoKiLoad();await W();
r.chg=S.chg.filter(c=>c.demo==='ki').length;
const t5=S.rez.find(x=>x.demo==='T05');r.t5vers=t5.vers.length;
const bad=S.chg.filter(c=>c.rez===t5.id&&c.ver===2).map(c=>c.stars);r.t5v2=bad.join(',');
const t1=S.rez.find(x=>x.demo==='T01');const over=S.chg.filter(c=>c.rez===t1.id).filter(c=>c.lines.some(l=>l.ist-l.soll>1.5)).length;r.over=over;
const jo=S.items.find(i=>i.cid==='K0071');r.jojoba=jo.bezug.filter(x=>x.demo).map(x=>x.preis).join(',');
r.bewCount=S.chg.filter(c=>c.bew&&c.bew.length).length;
const n0=S.chg.length;demoKiLoad();await W();r.noDouble=S.chg.length===n0;
demoKiRm();await W();r.afterRm=S.chg.filter(c=>c.demo==='ki').length;r.t5after=t5.vers.length;
demoKiLoad();await W();demoRm();await W();r.afterDemoRm=(S.chg||[]).length;
LANG='en';sheetKI();await W();r.en=document.getElementById('sheet').innerText.slice(0,40);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
