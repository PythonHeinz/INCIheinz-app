const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
const ids=await p.evaluate(()=>{const mkI=(nm,n)=>{const it=mk({id:'',n:nm,i:'',k:'Pflanzenöl',u:'g'},{});it.sapn=String(n);S.items.push(it);return it.id};return [mkI('TestKokos',0.183),mkI('TestPalm',0.142),mkI('TestOliv',0.135),mkI('TestRaps',0.133)]});
await p.evaluate(()=>{tab('rechner')});await W();
await p.evaluate(()=>{rchOpen('sei')});await W();
chk('Seite',await p.evaluate(()=>/Kaltverseifung/.test(document.body.innerText)&&/Sicherheit/.test(document.body.innerText)));
await p.evaluate(ids=>{ids.forEach(id=>RCH.sei.fats.push({id,g:'125'}));RCH.sei.unt='10';seiPage()},ids);await W();
let t=await p.evaluate(()=>document.getElementById('seires').innerText);console.log(t.replace(/\n/g,' | '));
chk('NaOH 66,7 g',/NaOH\s*66,7 g/.test(t.replace(/\n/g,' ')));chk('Wasser 165',/165 g/.test(t));chk('Duft 15',/15 g/.test(t));chk('vollständig 74,1',/74,1 g NaOH/.test(t));
await p.evaluate(()=>{RCH.sei.base='KOH';RCH.sei.pur='100';seiPage()});await W();
// KOH aus NaOH: n/0.713*1000 → Summe = 74.125/0.713 = 103.96 *0.9
t=await p.evaluate(()=>document.getElementById('seires').innerText.replace(/\n/g,' '));console.log(t.slice(0,160));chk('KOH 93,6',/KOH\s*93,6 g/.test(t));
// Picker
await p.evaluate(()=>{RCH.sei.fats=[];seiPage();seiAdd()});await W();
chk('Picker zeigt TestKokos',await p.evaluate(()=>/TestKokos/.test(document.getElementById('seipick').innerText)));
await p.evaluate(()=>{const r=[...document.querySelectorAll('#seipick .row')].find(x=>/TestOliv/.test(x.innerText));r.click()});await W();
chk('Fett hinzugefügt',await p.evaluate(()=>RCH.sei.fats.length===1&&/TestOliv/.test(document.getElementById('seifats').innerText)));
await p.evaluate(()=>{LANG='en';seiPage()});await W();
chk('EN',await p.evaluate(()=>/Cold process|Saponification|Safety/.test(document.body.innerText)));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
