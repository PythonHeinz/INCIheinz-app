const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{S.items.forEach(i=>{i.unk=true});Q.view='liste';Q.gap='verw';lager();const tr=document.querySelector('.tr');return [tr.getBoundingClientRect().height,[...tr.children].map(c=>c.className+':'+Math.round(c.getBoundingClientRect().height)),tr.querySelector('.c1').innerHTML.slice(0,300)]});
console.log(JSON.stringify(r));await b.close()})();
