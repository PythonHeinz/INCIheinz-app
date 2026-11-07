const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,500));const r={};
const rr=S.rez.filter(x=>x.bsp&&x.bsp[0]==='K');r.n=rr.length;
for(const x of rr.slice(0,40)){stack=[];go('rezv',x.id);await W()}
const x=rr.find(y=>/Handcreme/.test(y.vers[0].d.name));stack=[];go('rezv',x.id);await W();r.txt=document.getElementById('main').innerText.slice(0,500);
rzEdit(x.id);await W();r.edit=!!document.getElementById('re_name');
const cids=new Set();rr.forEach(y=>y.vers[0].d.phasen.forEach(p=>p.z.forEach(z=>z.cid&&cids.add(z.cid))));r.cids=cids.size;r.missing=[...cids].filter(c=>!CM[c]);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
