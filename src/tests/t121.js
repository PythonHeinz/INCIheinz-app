const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,400));const r={};
const id=S.rez[0].id;const v=S.rez[0].vers[0];v.d.lang='en';v.d.mod=[{id:uid(),t:'hinweis',titel:'Tipp',text:'My sodium lactate is a 60% solution.'}];S.tm=S.tm||{};S.tm['My sodium lactate is a 60% solution.']={src:'en',en:'My sodium lactate is a 60% solution.',de:'Mein Natriumlactat ist eine 60-%-Lösung.',st:'ki'};
S.mut='de';save();tab('rez');await W();rzEdit(id);await W();r.banner=!!document.getElementById('rzedlang');
rzEdAdoptAsk();await W();rzEdAdoptGo();await W();const d=rzCurV(rzGet(id)).d;r.after=[d.lang,d.olang,d.mod[0].text,!document.getElementById('rzedlang'),R.name,RE.d.mod[0].text];
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
