const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{if(!sessionStorage.getItem('x')){localStorage.setItem('inciheinz-fresh','1');sessionStorage.setItem('x','1')}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const o={};
S.items.push(mk(null,{name:'Basilikum ätherisch',kind:'v',total:5}));rzAltSeedLoad();
let got=null;const dl=dlFile;dlFile=(n,c)=>{got=c};doBackup();dlFile=dl;
const bj=JSON.parse(got);o.backupAlts=Object.keys(bj.alts||{}).length;
/* Spalte */
o.cols=Object.keys(XCOLS).includes('alt');o.txt=rzAltTxt(S.items.find(i=>i.name==='Basilikum ätherisch'));
/* Wiederherstellen alles ersetzen */
S.alts={};IMP={json:JSON.parse(got)};restoreAll();await W();o.afterAll=Object.keys(S.alts||{}).length;
/* nur ergänzen */
S.alts={x:{von:'X',zu:['Y'],ed:1}};IMP={json:JSON.parse(got)};restoreMerge();await W();o.afterMerge=Object.keys(S.alts).length;o.keepX=!!S.alts.x;
/* Persistenz */
save();await W();
return o});
console.log(JSON.stringify(r,null,1));
await p.reload();await p.waitForTimeout(1500);
console.log('nach Reload:',await p.evaluate(()=>Object.keys(S.alts||{}).length));
console.log('errors:',errs);await b.close()})();
