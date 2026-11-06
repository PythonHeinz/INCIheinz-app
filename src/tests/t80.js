const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(250);
await p.evaluate(()=>{S.expert=true;demoLoad();tab('rez')});await W();
// Rezept mit zwei Lagerzutaten wählen
const info=await p.evaluate(()=>{const r=rzAll().find(r=>{const d=rzCurV(r).d;return d.phasen.flatMap(p=>p.z).filter(z=>z.g>0&&rzItem(z)).length>=2});const d=rzCurV(r).d,sum=rzSum(d);const zs=d.phasen.flatMap(p=>p.z).filter(z=>z.g>0&&rzItem(z));return {id:r.id,a:zs[0].item||rzItem(zs[0]).id,b:rzItem(zs[1]).id,pa:zs[0].g/sum*100,pb:zs[1].g/sum*100}});
// 1) Artikelseite: Felder im Bearbeiten-Modus, Speichern
await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},info.a);await W();
chk('Felder von/bis im Editor',await p.evaluate(()=>!!document.getElementById('f_e0')&&!!document.getElementById('f_e1')));
await p.evaluate(pa=>{const a=document.getElementById('f_e0'),b=document.getElementById('f_e1');a.value=String(Math.round((pa+1)*10)/10).replace('.',',');b.value=String(Math.round((pa+3)*10)/10).replace('.',',');a.dispatchEvent(new Event('input',{bubbles:true}))},info.pa);await W();
await p.evaluate(()=>saveArt(R.id));await W();
chk('gespeichert (zu niedrig)',await p.evaluate(id=>getI(id).dmin>0&&getI(id).dmax>getI(id).dmin,info.a));
chk('Ansicht zeigt Einsatzkonzentration',/Einsatzkonzentration/.test(await p.evaluate(()=>document.getElementById('main').innerText)));
// von>bis wird abgelehnt
await p.evaluate(()=>{R.edit=true;draw()});await W();
await p.evaluate(()=>{document.getElementById('f_e0').value='9';document.getElementById('f_e1').value='2';saveArt(R.id)});await W();
chk('von>bis abgelehnt',await p.evaluate(()=>R.edit===true));
await p.evaluate(()=>{R.edit=false;draw()});await W();
// zweite Zutat: im Bereich
await p.evaluate(({b,pb})=>{const i=getI(b);i.dmin=pb-1;i.dmax=pb+1},info);
await p.evaluate(()=>{tab('rez');tab('bau');rchOpen('dos')});await W();
chk('Auswahlliste',/Welches Rezept willst du prüfen/i.test(await p.evaluate(()=>document.getElementById('main').innerText)));
await p.evaluate(id=>{RCH.dos.id=id;dosPage()},info.id);await W();
const t=await p.evaluate(()=>document.getElementById('main').innerText);
chk('Meldung zu niedrig',/zu niedrig/i.test(t)&&/außerhalb deines Bereichs/.test(t));
chk('Im Bereich gelistet',/im bereich/i.test(t));
chk('Ohne Einsatzbereich gelistet',/ohne einsatzbereich/i.test(t));
await p.screenshot({path:'/tmp/s_dos.png',fullPage:true});
// zu hoch
await p.evaluate(({a,pa})=>{const i=getI(a);i.dmin=0;i.dmax=pa-1},info);await p.evaluate(()=>dosPage());await W();
chk('Meldung zu hoch',/zu hoch/i.test(await p.evaluate(()=>document.getElementById('main').innerText)));
// Dialog: zwei Wege
await p.evaluate(()=>dosAct(window.__dos.findIndex(x=>x.st==='high')));await W();
chk('Dialog mit zwei Wegen',await p.evaluate(()=>document.querySelectorAll('#dlg .dtile').length===2));
await p.evaluate(id=>dosGo(id,1),info.a);await W();chk('Rohstoff im Bearbeiten-Modus',await p.evaluate(()=>R.name==='artikel'&&R.edit===true));
await p.evaluate(()=>{R.edit=false;back();});await W();
console.log('ok',ok,'bad',bad,errs);await b.close()})();
