const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const NEW=JSON.parse(fs.readFileSync('/mnt/user-data/outputs/netlify/katalog.json','utf8'));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
const r0=await p.evaluate(()=>{S.expert=true;demoLoad();return {n:CAT.length,items:S.items.length}});
chk('eingebetteter Katalog 1044',r0.n===1044);
// Altzustand simulieren: neue Einträge raus, Vorschlagsfelder leer, Nutzerfelder leeren
const r1=await p.evaluate(()=>{const newIds=CAT.filter(c=>/^K10(4[6-9]|5\d|6\d|70)$/.test(c.id)).map(c=>c.id);
 CAT.splice(0,CAT.length,...CAT.filter(c=>!newIds.includes(c.id)));newIds.forEach(i=>delete CM[i]);
 CAT.forEach(c=>{['f','b','v','d','e0','e1','eq','bq'].forEach(k=>c[k]=null)});
 S.items.forEach(i=>{if(i.cid&&CM[i.cid]){i.beschr='';i.verw='';i.form='';i.dens=0;delete i.fc}});
 S.items.find(i=>i.cid&&CM[i.cid]).beschr='Eigener Text bleibt';window.__own=S.items.find(i=>i.cid&&CM[i.cid]).id;S.catfix={};S.catadd=[];return {n:CAT.length,newIds:newIds.length}});
chk('Altzustand 1019',r1.n===1019&&r1.newIds===25);
await p.evaluate(NEW=>{window.fetch=async()=>({ok:true,json:async()=>NEW})},NEW);
await p.evaluate(()=>sheetCatUpd());await p.waitForTimeout(800);
const t=await p.evaluate(()=>document.getElementById('cu').innerText);console.log(t.replace(/\n/g,' | ').slice(0,200));
chk('25 neue Einträge gemeldet',/25 neue Einträge/.test(t));
chk('ergänzte Angaben gemeldet',/ergänzte Angaben/.test(t));
await p.evaluate(()=>catApply());await W();
const r2=await p.evaluate(()=>({n:CAT.length,filled:S.items.filter(i=>i.fc&&Object.keys(i.fc).length).length,own:getI(window.__own).beschr,form:S.items.filter(i=>i.form).length,fcOwn:getI(window.__own).fc&&getI(window.__own).fc.beschr}));
console.log(JSON.stringify(r2));
chk('Katalog 1044 nach Update',r2.n===1044);chk('Vorschläge übernommen',r2.filled>0);chk('Nutzertext bleibt',r2.own==='Eigener Text bleibt');
// Neue Einträge nutzbar: Rohstoff aus Katalog anlegen
const r3=await p.evaluate(()=>{const it=mk(CM['K1046'],{});return {n:it.name,f:it.form,d:it.dens,b:it.beschr}});console.log(JSON.stringify(r3));chk('neuer Eintrag anlegbar',/Zitronensäure/.test(r3.n));
await p.evaluate(()=>{tab('lager')});await W();chk('Lager öffnet',await p.evaluate(()=>document.getElementById('main').innerText.length>50));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
