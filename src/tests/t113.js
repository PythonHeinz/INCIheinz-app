const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const r={};S.items=[];S.rez=[];S.chg=[];
const arg=CAT.find(c=>/^argan/i.test(c.n));
S.tm={'Shampoo Bars':{src:'en',de:'Shampoo-Stücke',es:'Barras de champú',st:{de:'hand',es:'hand'}},'Stir until uniform.':{src:'en',de:'Bis zur Gleichmäßigkeit rühren.',st:{de:'ki'}}};
const d={name:'Shampoo Bars',lang:'en',zweck:'',ph:'',ergibt:100,zeit:'',grad:'',phasen:[{id:'p',typ:'',name:'Phase A · Wasserphase',z:[{id:'z1',name:'Argan',g:10,cid:arg&&arg.i}]}],mod:[{t:'schritt',titel:'',text:'Stir until uniform.'},{t:'hinweis',titel:'',text:'Only in English'}]};
S.rez.push({id:'r1',created:new Date().toISOString(),vers:[{n:1,date:new Date().toISOString(),note:'',diff:[],d}]});
const id='r1';
DOCL='es';r.txtEs=rzTextOf(id);DOCL=null;
DOCL='de';r.txtDe=rzTextOf(id);DOCL=null;
r.txtPlain=rzTextOf(id);r.dAfter=JSON.stringify(rzCurV(rzGet(id)).d)===JSON.stringify(d);
let pr;const _pd=rzPrintDoc;
// HTML über rzPrintDoc abfangen
window.__h=null;const orig=document.body.appendChild.bind(document.body);
RZX={kind:'card',ids:new Set([id]),fmt:'pdf',o:{foto:1,eck:1,ablauf:1,inci:1,sh:1},lang:'es'};
const cap=[];const oc=document.createElement.bind(document);document.createElement=function(t){const e=oc(t);if(t==='iframe')Object.defineProperty(e,'srcdoc',{set(v){cap.push(v)},get(){return ''}});return e};
rzPubGo();await W();document.createElement=oc;r.htmlEs=(cap[0]||'').replace(/<style>[\s\S]*?<\/style>/,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,500);r.docl=DOCL;
// PDF
DOCL='es';const blob=rzPdf(id,1,{});DOCL=null;r.pdf=blob&&blob.size>500;
sheetRzPub('card');await W();r.sel=!!document.querySelector('#doclang');r.selTxt=document.getElementById('doclang')&&document.getElementById('doclang').innerText;
sheetRzShare(id);await W();r.sel2=!!document.querySelector('#doclang');r.lang=LANG;
return r});
console.log(JSON.stringify(out,null,1));console.log('ERR',errs);await b.close()})()
