const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,200));const r={};
const it=mk(CM['K1016'],{kind:'m',total:100});S.items.push(it);go('artikel',it.id);await W();
const w=document.getElementById('warnbox');r.w=w?w.innerText.slice(0,160):null;r.bg=w&&getComputedStyle(w).backgroundColor;r.col=w&&getComputedStyle(w).color;
// counts for Dichte
r.dens=CAT&&CAT.filter(c=>c.d).length;r.total=CAT.length;r.sap=CAT.filter(c=>c.sap_naoh||c.sap_koh).length;r.was=CAT.filter(c=>c.was).length;r.tkl=CAT.filter(c=>c.tensidklasse).length;r.jod=CAT.filter(c=>c.jodzahl).length;r.smp=CAT.filter(c=>c.schmelzpunkt).length;r.rzf=CAT.filter(c=>c.rzf!=null&&c.rzf!=='').length;r.h=CAT.filter(c=>c.haerte).length;r.wc=CAT.filter(c=>c.w).length;
return r});console.log(JSON.stringify(out),errs);await b.close()})();
