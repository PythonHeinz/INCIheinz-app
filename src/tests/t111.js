const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));S.items=[];const c=CAT[0];const it=mk(c,{kind:'w',total:10,notiz:'Test <img src=x onerror="window.XSS=1"> ende'});S.items.push(it);R={name:'artikel',id:it.id,edit:false};draw();await W();return {xss:window.XSS||0,img:document.querySelectorAll('#main img[src="x"]').length,shown:/Test/.test(document.getElementById('main').innerText)}});
console.log(JSON.stringify(r),errs);await b.close()})();
