const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const vals={alk:{c1:'96',c2:'70',m:'100'},trp:{n:'20',tot:'100',pct:'1'},emu:{},hlb:{h1:'15',h2:'5',ht:'10',m:'10'},prv:{pa:'5',ma:'100',pb:'12',mb:'200'},mhd:{dt:'2026-11-30',mo:'3'},kal:{},was:{},spr:{}};
const out=await p.evaluate(async vals=>{LANG='en';const r={};for(const k of Object.keys(vals)){rchOpen(k);Object.assign(RCH.v,vals[k]);if(k==='kal'){const rr=rzAll()[0];if(rr)RCH.v.rid=rr.id}rzBau();await new Promise(x=>setTimeout(x,100));rchRes();
const w=document.createTreeWalker(document.getElementById('main'),NodeFilter.SHOW_TEXT);const l=[];let n;while(n=w.nextNode()){const t=n.nodeValue.trim();if(t&&/[äöüÄÖÜß]|\b(und|der|die|das|mit|ist|für|von|bis|aus|zu|Menge|Wasser|Gramm|Rezept)\b/.test(t))l.push(t)}r[k]=l}return r},vals);
console.log(JSON.stringify(out,null,1));await b.close()})();
