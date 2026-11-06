const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,150));const r={};
demoLoad&&0;
if(!S.items.length){S.items.push(mk(CM['K0787'],{kind:'m',total:100}),mk(CM['K0556'],{kind:'m',total:100}))}
const n0=S.items.length;sheetLabels();await W();
r.hasSearch=!!document.getElementById('lbq');r.emptyMsg=document.getElementById('lbl').innerText.slice(0,40);
const nm=S.items[0].name.slice(0,4);const q=document.getElementById('lbq');q.value=nm;q.oninput&&0;lbSearch(nm);await W();
r.res=document.getElementById('lbres').querySelectorAll('.row').length;
document.getElementById('lbres').querySelector('.row').click();await W();
r.sel=Object.keys(LB.sel).filter(k=>LB.sel[k]).length;r.list=document.getElementById('lbl').querySelectorAll('.row').length;r.head=document.getElementById('lbhead').textContent;r.btn=document.getElementById('lbgo').textContent;
document.getElementById('lbl').querySelector('button.ib').click();await W();
r.after=Object.keys(LB.sel).filter(k=>LB.sel[k]).length;
LANG='en';sheetLabels();await W();r.en=document.getElementById('lbhead').textContent;
return r});
console.log(JSON.stringify(out),errs);await b.close()})();
