const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(250);
const txt=()=>p.evaluate(()=>document.getElementById('main').innerText.replace(/\n+/g,' | '));
const set=(o)=>p.evaluate(o=>{Object.keys(o).forEach(k=>{RCH.v[k]=o[k]});rchRes()},o);
// Übersicht
await p.evaluate(()=>{RCH={tool:null,v:{},ord:[],u:'g'};go('rez');});
await p.evaluate(()=>{RCH.tool=null;rzBau()});await W();
let t=await txt();console.log(t.slice(0,700));
chk('keine Planung mehr',!/in Planung/.test(t));
// Alkohol
await p.evaluate(()=>rchOpen('alk'));await W();t=await txt();chk('alk',/Alkohol\s*\|?\s*72,92 ml/.test(t.replace(/\|/g,''))||/72,92/.test(t));console.log(t.slice(0,300));
// Tropfen
await p.evaluate(()=>rchOpen('trp'));await set({n:'20',tot:'100'});t=await txt();console.log(t.slice(0,260));chk('trp 0,9 g',/0,9/.test(t)&&/0,9 %/.test(t));
await set({n:'',pct:'1'});t=await txt();chk('trp 22',/22,2 Tropfen/.test(t));
// Emulgator
await p.evaluate(()=>rchOpen('emu'));await W();t=await txt();console.log(t.slice(0,300));chk('emu 75/20/5',/Wasserphase \| 75 g/.test(t)&&/Emulgator \| 5 g/.test(t)&&/Fette, Wachse \| 20 g/.test(t));
// HLB
await p.evaluate(()=>rchOpen('hlb'));await set({h1:'15',h2:'5',ht:'10',m:'10'});t=await txt();console.log(t.slice(0,300));chk('hlb 50 %',/50 %/.test(t)&&/5 g/.test(t));
await set({ht:'20'});t=await txt();chk('hlb außerhalb',/außerhalb/.test(t));
// Preis
await p.evaluate(()=>rchOpen('prv'));await set({pa:'5',ma:'100',pb:'12',mb:'200'});t=await txt();console.log(t.slice(0,300));chk('prv B günstiger',/Angebot A ist günstiger/.test(t)&&/5 €/.test(t)&&/6 €/.test(t));
// MHD
await p.evaluate(()=>rchOpen('mhd'));await set({dt:'2026-11-30',mo:'3'});t=await txt();console.log(t.slice(0,200));chk('mhd',/28\.02\.2027/.test(t)||/dt/.test(''));
// Kalkulation
const rid=await p.evaluate(()=>{const c=CAT.find(x=>x.n==='Olivenöl');const it=mk(c,{kind:'m',total:2000,preis:0});S.items.push(it);rchOpen('sei');RCH.sei.fats=[{id:it.id,p:'100'}];RCH.sei.amt='500';seiTake();rzSave();rzDoSave();const r=rzAll()[0];return r&&r.id});console.log('rezept',rid);
await p.evaluate(()=>rchOpen('kal'));
if(rid){await set({rid:rid,n:'10',pk:'1',et:'0.5',mk:'50'});t=await txt();console.log(t.slice(0,400));chk('kal',/Kosten je Charge/.test(t)&&/je Gefäß/.test(t)&&/Aufschlag/.test(t))}
// WAS
const ids=await p.evaluate(()=>{const c=CAT.filter(x=>x.k==='Tensid').slice(0,2);return c.map(x=>{const it=mk(x,{kind:'m',total:1000});S.items.push(it);return it.id})});
await p.evaluate(ids=>{rchOpen('was');RCH.was=[{id:ids[0],p:'60'},{id:ids[1],p:'40'}];rzBau()},ids);await W();
await p.evaluate(ids=>{xOwn(ids[0],'was','30');xOwn(ids[1],'was','50')},ids);await set({tot:'200',t:'12'});t=await txt();console.log(t.slice(0,500));
chk('was: 12 % von 200 = 24 g WAS: 0,6*24/0,3=48 und 0,4*24/0,5=19,2',/48 g/.test(t)&&/19,2 g/.test(t)&&/Wasserphase/.test(t));
chk('was am Artikel',await p.evaluate(ids=>getI(ids[0]).was===30,ids));
// Spreitwert
const oi=await p.evaluate(()=>{const c=CAT.filter(x=>x.k==='Pflanzenöl').slice(0,2);return c.map(x=>{const it=mk(x,{kind:'m',total:1000});S.items.push(it);return it.id})});
await p.evaluate(o=>{rchOpen('spr');RCH.spr=[{id:o[0],p:'50'},{id:o[1],p:'50'}];rzBau()},oi);await W();
await p.evaluate(o=>{xOwn(o[0],'spr','400');xOwn(o[1],'spr','1200')},oi);t=await txt();console.log(t.slice(0,500));
chk('spr mittel 800',/800 mm²/.test(t)&&/Niedrigspreitend \| 50 %/.test(t) );
// EN
await p.evaluate(()=>{LANG='en';rchOpen('emu')});await W();t=await txt();console.log('EN',t.slice(0,500));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
