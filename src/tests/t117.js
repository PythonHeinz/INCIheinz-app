const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:860}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const r={};S.expert=true;S.items=[];S.rez=[];
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
sheetInv();await W();const t=document.getElementById('invt');t.value='Rechnung Text ABC';t.dispatchEvent(new Event('input',{bubbles:true}));
document.getElementById('dim').click();await W();r.stay=!!document.getElementById('sheet');
document.querySelector('#sheet .x').click();await W();r.closed=!document.getElementById('sheet');r.draftGone=!localStorage.getItem('inciheinz-draft-invt');
sheetInv();await W();const t2=document.getElementById('invt');t2.value='Neuer Text 123';t2.dispatchEvent(new Event('input',{bubbles:true}));
// versehentlich geschlossen ohne X (Neuaufbau)
document.getElementById('dim').remove();document.getElementById('sheet').remove();sheetInv();await W();r.restored=document.getElementById('invt').value;
document.getElementById('invt').value='';closeSheet();
sheetBackup();await W();r.bk=!!document.querySelector('#sheet .bk');
return r});console.log(JSON.stringify(out,null,1),errs);
await p.evaluate(()=>{localStorage.clear();sheetAppSet();sheetBackup()});await p.waitForTimeout(400);await p.screenshot({path:'/tmp/bk.png'});await b.close()})();
