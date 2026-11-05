const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const o={};const id=S.items[0].id;S.shop=[];
sheetShop(id);document.getElementById('f1').value='10';saveShop(id);o.toast=document.getElementById('toast').textContent;o.bar1=!!document.getElementById('undob');o.tp=getComputedStyle(document.getElementById('toast')).top;
doDel(S.items[1].id);o.bar2=!!document.getElementById('undob');return o});
await p.waitForTimeout(6500);console.log(r,await p.evaluate(()=>!!document.getElementById('undob')),errs);await b.close()})();
