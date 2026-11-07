const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));S.expert=true;demoLoad();await W();const m=document.getElementById('main');m.scrollTop=m.scrollHeight;await W();
const pl=document.querySelector('nav .plus').getBoundingClientRect();const pts=[[pl.left+5,pl.top+5],[pl.left+28,pl.top+28],[pl.right-5,pl.top+10],[pl.left-4,pl.top+14]];
return pts.map(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.closest('nav')?'nav':e.className||e.tagName):'none'})});
console.log(JSON.stringify(r));await b.close()})();
