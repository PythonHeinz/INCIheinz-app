const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:860}})).newPage();
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));S.expert=true;S.mut='de';S.tm={};demoLoad();await W();const r=rzAll()[0];r.vers[r.vers.length-1].d.lang='en';tab('rez');await W();rzOpen(r.id);await W();});
await p.screenshot({path:'/tmp/rz.png'});
await p.evaluate(async()=>{sheetRzTr(R.id,'es')});await p.waitForTimeout(500);await p.screenshot({path:'/tmp/tr.png'});await b.close()})();
