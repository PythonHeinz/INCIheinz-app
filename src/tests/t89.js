const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
const ids=await p.evaluate(()=>{const names=['Kokosöl','Olivenöl','Shea Butter Bio','Kakaobutter Bio','Rapsöl','Avocadoöl','Traubenkernöl','Babassuöl raffiniert'];const o={};names.forEach(n=>{const c=CAT.find(x=>x.n===n);if(!c){o[n]=null;return}const it=mk(c,{kind:'m',total:2000});S.items.push(it);o[n]=it.id});return o});console.log(JSON.stringify(ids));
chk('Artikel da',Object.values(ids).every(x=>x));
await p.evaluate(()=>{rchOpen('sei')});await W();
await p.evaluate(ids=>{const X=RCH.sei;X.mode='fett';X.amt='500';X.fats=[{id:ids['Kokosöl'],p:'30'},{id:ids['Olivenöl'],p:'50'},{id:ids['Shea Butter Bio'],p:'20'}];seiPage()},ids);await W();
let t=await p.evaluate(()=>document.getElementById('seis9')&&document.getElementById('seis9').textContent);console.log(t);
chk('Eigenschaften da',/Härte/.test(t)&&/Ranziditätsfaktor/.test(t)&&/Anteil stark reinigender/.test(t));
// Härte: .3*100+.5*87+.2*94 = 92.3 ; RZF .3*0+.5*30+.2*13=17.6
chk('Härte 92',/Härte\s*92/.test(t)&&/sehr hart/.test(t));chk('RZF 18',/\(RZF\)\s*18/.test(t)&&/gut haltbar/.test(t));chk('Reinigend 30 %',/30 %/.test(t));
// Avocado farbig
await p.evaluate(ids=>{RCH.sei.fats.push({id:ids['Avocadoöl'],p:'10'});seiPage()},ids);await W();
t=await p.evaluate(()=>document.getElementById('seis9').textContent);chk('Farbige Fette',/Farbige Fette/.test(t)&&/Avocado/.test(t));
// Vorschläge
for(const g of ['weiss','rueck','rein']){
 const r=await p.evaluate(g=>{RCH.sei.goal=g;const R_=seiSugCalc(g);return {n:R_.list.length,N:R_.N,l:R_.list.map(o=>o.sel.map((i,t)=>i.name+' '+o.pc[t]).join(', ')+' | H'+Math.round(o.h)+' R'+Math.round(o.r)+' rein'+Math.round(o.rein)),sc:R_.list.map(o=>o.sc)}},g);console.log(g,JSON.stringify(r,null,0));
 chk('Vorschlag '+g,r.n>=1)}
let r=await p.evaluate(()=>{const o=seiSugCalc('weiss').list[0];return {h:o.h,r:o.r,hasAvo:o.sel.some(i=>/Avocado/.test(i.name)),sum:o.pc.reduce((a,b)=>a+b,0)}});
chk('weiß: Härte 80–90, kein Avocado, 100 %',r.h>=79.9&&r.h<=90.1&&!r.hasAvo&&r.sum===100);
r=await p.evaluate(()=>{const o=seiSugCalc('rein').list[0];return o.rein});chk('rein: >=25 %',r>=25);
r=await p.evaluate(()=>{const o=seiSugCalc('rueck').list[0];return o.rein});chk('rück: <=10 %',r<=10);
// Dialog + Übernehmen
await p.evaluate(()=>{RCH.sei.goal='rein';seiSug()});await W();
t=await p.evaluate(()=>document.getElementById('dlg').textContent);chk('Dialog',/Vorschlag aus meinem Bestand/.test(t)&&/Übernehmen/.test(t)&&/Reinigungskraft/.test(t));
await p.evaluate(()=>seiSugTake(0));await W();
r=await p.evaluate(()=>({n:RCH.sei.fats.length,s:RCH.sei.fats.reduce((a,z)=>a+(+z.p),0),u:RCH.sei.unt}));chk('übernommen',r.n>=1&&r.s===100&&r.u==='8');
// Bestand reicht nicht: 100 g Kokos, 3000 g Menge
await p.evaluate(ids=>{getI(ids['Kokosöl']).total=100;getI(ids['Babassuöl raffiniert']).total=100;RCH.sei.amt='3000';RCH.sei.mode='fett'},ids);
r=await p.evaluate(ids=>{const lim=[ids['Kokosöl'],ids['Babassuöl raffiniert']];return seiSugCalc('rein').list.every(o=>o.sel.every((i,t)=>!lim.includes(i.id)||3000*o.pc[t]/100<=100))},ids);chk('Bestand begrenzt',r);
// EN
await p.evaluate(()=>{LANG='en';seiPage()});await W();
t=await p.evaluate(()=>document.getElementById('seis9').textContent);console.log(t);
chk('EN Eigenschaften',/Hardness/.test(t)&&!/Härte/.test(t));
await p.evaluate(()=>seiSug());await W();t=await p.evaluate(()=>document.getElementById('dlg').textContent);console.log(t.slice(0,400));chk('EN Dialog',/Suggestion from my stock/i.test(t));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
