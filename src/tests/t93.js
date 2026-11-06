const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{LANG='en';S.expert=true;const r={};const scan=el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const l=[];let n;while(n=w.nextNode()){const t=n.nodeValue.trim();if(t&&/[äöüÄÖÜß]|\b(und|der|die|das|mit|ist|für|von|bis|aus|zu|Menge|Wasser|Anleitung|Info|Sicherung)\b/.test(t))l.push(t)}return l};
const W=()=>new Promise(x=>setTimeout(x,150));
for(const f of ['sheetAppSet','sheetSetSich','sheetSetMengen','sheetSetHilfe','sheetSetExp','sheetSetTest']){window[f]();await W();const s=document.getElementById('sheet');try{trWalk(s)}catch(e){}r[f]=scan(s)}
const it=mk(CM['K0787'],{kind:'m',total:100});S.items.push(it);go('artikel',it.id);R.edit=true;draw();await W();r.artikelEdit=scan(document.getElementById('main'));R.edit=false;draw();await W();r.artikel=scan(document.getElementById('main'));
rchOpen('was');RCH.was=[{id:it.id,p:'100'}];RCH.v.tot='100';RCH.v.t='10';rzBau();await W();r.was=scan(document.getElementById('main'));return r});
console.log(JSON.stringify(out,null,1));await b.close()})();
