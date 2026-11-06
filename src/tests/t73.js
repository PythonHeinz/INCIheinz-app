const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};
const W=()=>p.waitForTimeout(250);
await p.evaluate(()=>{S.expert=true;demoLoad()});
const txt=()=>p.evaluate(()=>{const s=document.getElementById('sheet');return s?s.innerText.replace(/\s+/g,' ').trim():null});
const rows=()=>p.evaluate(()=>[...document.querySelectorAll('#sheet .row')].map((r,i)=>({i,on:r.getAttribute('onclick')||'',t:r.innerText.split('\n')[0]})));
for(const w of ['lager','rez']){
 await p.evaluate(w=>{tab(w);sheetMehr()},w);await W();const base=await txt();const rs=await rows();
 chk(w+': Mehr offen',!!base&&rs.length>3);
 for(const r of rs){await p.evaluate(w=>{tab(w);sheetMehr()},w);await W();
  if(!/^(sheet|rz|lb)/.test(r.on)||/Undo|Rueck/.test(r.on))continue;
  await p.evaluate(i=>document.querySelectorAll('#sheet .row')[i].click(),r.i);await W();
  const t1=await txt();if(t1===null){console.log(w,'->Seite',r.t);continue}
  const hasBk=await p.evaluate(()=>!!document.querySelector('#sheet .bk'));chk(w+' '+r.t+': Pfeil',hasBk);
  if(hasBk){await p.evaluate(()=>document.querySelector('#sheet .bk').click());await W();chk(w+' '+r.t+': zurück zu Mehr',(await txt())===base)}
  // zweite Ebene
  await p.evaluate(w=>{tab(w);sheetMehr()},w);await W();await p.evaluate(i=>document.querySelectorAll('#sheet .row')[i].click(),r.i);await W();
  const r2=await rows();
  for(const q of r2){if(!/^(sheet|rz|lb)/.test(q.on)||/Undo|Rueck|Rück|Katalog|Demo|demo|Lang|Foto|Datei|pick|file|Backup|Sicher/i.test(q.on+q.t))continue;
   await p.evaluate(()=>{});const before=await txt();await p.evaluate(i=>document.querySelectorAll('#sheet .row')[i].click(),q.i);await W();
   const t2=await txt();if(t2===null||t2===before){await p.evaluate(w=>{tab(w);sheetMehr()},w);await W();await p.evaluate(i=>document.querySelectorAll('#sheet .row')[i].click(),r.i);await W();continue}
   const bk2=await p.evaluate(()=>{const n=document.querySelector('#sheet .bk');if(n)n.click();return !!n});chk(w+' '+r.t+' › '+q.t+': Pfeil',bk2);await W();
   chk(w+' '+r.t+' › '+q.t+': zurück',(await txt())===before);
  }}
}
// Einstellung ändern: Fenster bleibt, Pfeil bleibt
await p.evaluate(()=>{tab('lager');sheetMehr()});await W();
await p.evaluate(()=>{[...document.querySelectorAll('#sheet .row')].find(r=>/Einstellungen/.test(r.innerText)).click()});await W();
await p.evaluate(()=>{[...document.querySelectorAll('#sheet .row')].find(r=>/Mengeneinstellungen/.test(r.innerText)).click()});await W();await p.evaluate(()=>accSet('l',0));await W();
chk('Einstellungen nach Änderung offen mit Pfeil',await p.evaluate(()=>!!document.querySelector('#sheet .bk')&&/Mengeneinstellungen/.test(document.getElementById('sheet').innerText)));
await p.evaluate(()=>document.querySelector('#sheet .bk').click());await W();chk('zurück zur Einstellungen-Liste',await p.evaluate(()=>/Sprache/.test(document.getElementById('sheet').innerText)));await p.evaluate(()=>document.querySelector('#sheet .bk').click());await W();chk('zurück ins Mehr',/Statistik/.test(await txt()||''));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
