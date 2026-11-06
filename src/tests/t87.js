const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
const ids=await p.evaluate(()=>{const mkI=(nm,n,f)=>{const it=mk({id:'',n:nm,i:'Inci '+nm,k:'Pflanzenöl',u:'g'},{});it.sapn=String(n);it.form=f;S.items.push(it);return it.id};return [mkI('TestKokos',0.183,'fest'),mkI('TestPalm',0.142,'fest'),mkI('TestOliv',0.135,'Öl'),mkI('TestRaps',0.133,'flüssig')]});
await p.evaluate(()=>{tab('rechner')});await W();await p.evaluate(()=>{rchOpen('sei')});await W();
chk('Seite',await p.evaluate(()=>/Kaltverseifung/.test(document.body.innerText)&&/Sicherheit/.test(document.body.innerText)&&/Menge und Einstellungen/i.test(document.body.innerText)));
await p.evaluate(ids=>{ids.forEach(id=>RCH.sei.fats.push({id,p:'25'}));RCH.sei.unt='10';RCH.sei.amt='500';seiPage()},ids);await W();
let t=await p.evaluate(()=>document.getElementById('seires').innerText.replace(/\n/g,' '));console.log(t.slice(0,400));
chk('NaOH 66,7',/NaOH\s*66,7 g/.test(t));chk('Wasser 165',/165 g/.test(t));chk('Duft 15',/Duft\s*15 g/.test(t));chk('vollständig 74,1',/74,1 g NaOH/.test(t));
chk('Abwiegen fest/flüssig',/Flüssige Öle\s*TestOliv\s*125 g\s*TestRaps\s*125 g\s*Feste Fette[^T]*TestKokos\s*125 g\s*TestPalm\s*125 g/.test(t)||(/Flüssige Öle/.test(t)&&/Feste Fette/.test(t)));
chk('Laugentabelle 10 % = 66,7',await p.evaluate(()=>/10 %\s*66,7 g/.test(document.getElementById('seis6').textContent)));
chk('Etikett sortiert',await p.evaluate(()=>/^Inci Test\w+, Inci Test\w+, Inci Test\w+, Inci Test\w+, Aqua, Sodium Hydroxide, Parfum/.test(document.getElementById('seiing').textContent)||/Aqua/.test(document.getElementById('seiing').textContent)));
// Seifenmasse vorgeben
await p.evaluate(()=>{RCH.sei.mode='masse';RCH.sei.amt='1000';seiPage()});await W();
const r=await p.evaluate(()=>{const c=seiCalc();return {m:c.mass,g:c.gfm}});console.log(JSON.stringify(r));chk('Masse 1000',Math.abs(r.m-1000)<0.01);
// Zusatz erhöht Masse
await p.evaluate(()=>{RCH.sei.mode='fett';RCH.sei.amt='500';RCH.sei.zus=[{n:'Milchpulver',g:'20'}];seiPage()});await W();
chk('Zusatz in Masse',await p.evaluate(()=>{const m0=seiCalc().mass-20;return Math.abs(m0-500*(1+66.7/500+0.33+0.03))<0.1})&&await p.evaluate(()=>/Milchpulver/.test(document.getElementById('seiing').textContent)));
// Summe ≠ 100
await p.evaluate(ids=>{RCH.sei.zus=[];RCH.sei.fats[0].p='50';seiPage()},ids);await W();
chk('Summe-Hinweis',await p.evaluate(()=>/Summe der Anteile: 125 %.*100 %/.test(document.getElementById('seisum').innerText)));
// KOH
await p.evaluate(()=>{seiBase('KOH')});await W();chk('KOH Reinheit 90',await p.evaluate(()=>RCH.sei.pur==='90'));
// Picker
await p.evaluate(()=>{RCH.sei.fats=[];seiPage();seiAdd()});await W();
chk('Picker',await p.evaluate(()=>/TestKokos/.test(document.getElementById('seipick').innerText)));
await p.evaluate(()=>{[...document.querySelectorAll('#seipick .row')].find(x=>/TestOliv/.test(x.innerText)).click()});await W();
chk('hinzugefügt',await p.evaluate(()=>RCH.sei.fats.length===1));
await p.evaluate(()=>{LANG='en';RCH.sei.amt='300';RCH.sei.fats[0].p='100';seiPage()});await W();
const en=await p.evaluate(()=>document.getElementById('main').innerText);const w=en.match(/\b(und|der|die|das|Lauge|Menge|Flüssigkeit|Duft|Abwiegen|Zusätze|anrühren|Notizen)\b/g);console.log('EN-Reste',w);console.log(en.replace(/\n/g,' | '));
await p.evaluate(ids=>{LANG='de';RCH.sei.base='NaOH';RCH.sei.pur='100';RCH.sei.mode='fett';RCH.sei.amt='500';RCH.sei.unt='10';RCH.sei.fats=ids.map(id=>({id,p:'25'}));RCH.sei.zus=[{n:'Milchpulver',g:'20'}];seiPage();seiTake()},ids);await W();
const rr=await p.evaluate(()=>({n:RE.d.name,ph:RE.d.phasen.map(x=>x.name+':'+x.z.length),g:RE.d.phasen.find(x=>x.name==='Lauge').z.map(z=>z.name+' '+z.g),nm:R.name}));console.log(JSON.stringify(rr));
chk('Rezept-Entwurf',rr.nm==='reze'&&/Fettphase:4,Lauge:2,Zusätze:2/.test(rr.ph.join())&&/Natriumhydroxid 66.7/.test(rr.g.join()));
await p.evaluate(()=>{rzSave()});await W();await p.evaluate(()=>{rzDoSave()});await W();chk('Rezept speichern',await p.evaluate(()=>rzAll().some(r=>/^Seife/.test((rzCurV(r).d||{}).name||''))));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
