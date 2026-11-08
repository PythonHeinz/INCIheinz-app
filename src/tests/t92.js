const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(250);
const sh=()=>p.evaluate(()=>{const s=document.getElementById('sheet');return s?{h:(s.querySelector('h2')||{}).textContent,t:s.innerText.replace(/\n+/g,' | '),bk:!!s.querySelector('.bk'),rows:[...s.querySelectorAll('.row .t b')].map(x=>x.textContent)}:null});
const clickRow=n=>p.evaluate(n=>{const r=[...document.querySelectorAll('#sheet .row')].find(x=>x.textContent.trim().startsWith(n));r.click()},n);
await p.evaluate(()=>sheetAppSet());await W();let s=await sh();console.log(JSON.stringify(s.rows));
chk('Liste ohne Experten',JSON.stringify(s.rows)===JSON.stringify(['Sprache','Meine Sprache (Zielsprache)','Sichern und zurücknehmen','Katalog','Mengeneinstellungen','Hilfe','KI-Funktionen','Expertenmodus']));
chk('Seite kurz',s.t.length<500);
await clickRow('Mengeneinstellungen');await W();s=await sh();chk('Mengen offen mit Zurück',s.h==='Mengeneinstellungen'&&s.bk&&/Lager \(Mengen anzeigen\)/i.test(s.t));
await p.evaluate(()=>accSet('l',1));await W();s=await sh();chk('bleibt in Mengen',s.h==='Mengeneinstellungen'&&s.bk);
await p.evaluate(()=>sheetBack());await W();s=await sh();chk('zurück zur Liste',s.h==='Einstellungen'&&!s.bk);
await clickRow('Sichern');await W();s=await sh();chk('Sichern-Seite',s.h==='Sichern und zurücknehmen'&&s.bk&&/Sicherung der ganzen App/.test(s.t));
await clickRow('Sicherung der ganzen App');await W();s=await sh();console.log(JSON.stringify([s.h,s.bk]));chk('Sicherung unter Sichern',/Sicherung/.test(s.h)&&s.bk);
await p.evaluate(()=>sheetBack());await W();s=await sh();chk('zurück zu Sichern',s.h==='Sichern und zurücknehmen'&&s.bk);
await p.evaluate(()=>sheetBack());await W();s=await sh();chk('zurück zur Liste 2',s.h==='Einstellungen');
await clickRow('Katalog');await W();s=await sh();chk('Katalogseite',/Katalog aktualisieren/.test(s.h)&&s.bk);
await p.evaluate(()=>sheetBack());await W();
await clickRow('Hilfe');await W();s=await sh();chk('Hilfe',s.h==='Hilfe'&&/Anleitung/.test(s.t)&&/Info/.test(s.t));
await p.evaluate(()=>sheetBack());await W();
await clickRow('Expertenmodus');await W();s=await sh();chk('Experten aus',s.h==='Expertenmodus');
await p.evaluate(()=>{const c=document.querySelector('#sheet input[type=checkbox]');c.click()});await W();s=await sh();chk('Experten an bleibt in Seite',s.h==='Expertenmodus'&&s.bk&&/Einheitensystem/i.test(s.t));
await p.evaluate(()=>sheetBack());await W();s=await sh();chk('Liste mit Testbetrieb',s.rows.includes('Testbetrieb')&&/An/.test(s.t));
await clickRow('Testbetrieb');await W();s=await sh();chk('Testbetrieb mit Testdaten',s.h==='Testbetrieb'&&/Testdaten laden/.test(s.t));
await p.evaluate(()=>{S.expert=false;closeSheet()});
// Mehr-Menü unverändert
await p.evaluate(()=>sheetMehr());await W();s=await sh();chk('Mehr hat Einstellungen',/Einstellungen/.test(s.t)&&/Für die ganze App/i.test(s.t));
await p.evaluate(()=>closeSheet());
// WAS aus Katalog
const id=await p.evaluate(()=>{const it=mk(CM['K0195'],{kind:'m',total:1000});S.items.push(it);return it.id});
await p.evaluate(id=>{rchOpen('was');RCH.was=[{id,p:'100'}];RCH.v.tot='100';RCH.v.t='10';rzBau()},id);await W();
let t=await p.evaluate(()=>document.getElementById('main').innerText.replace(/\n+/g,' | '));console.log(t.slice(0,420));
chk('WAS 53 % aus Katalog: 10 g WAS / 0,53 = 18,87 g',/18,87 g/.test(t));
chk('Platzhalter',await p.evaluate(()=>[...document.querySelectorAll('#main input')].some(i=>i.placeholder==='51–55 %')));
// Mehrfach-Lieferform: kein Rechnen
const id2=await p.evaluate(()=>{const it=mk(CM['K0787'],{kind:'m',total:1000});S.items.push(it);return it.id});
await p.evaluate(id2=>{RCH.was=[{id:id2,p:'100'}];rzBau()},id2);await W();t=await p.evaluate(()=>document.getElementById('main').innerText);chk('Mehrfach-Form gemeldet',/mehrere Lieferformen/.test(t));
// Artikelseite
await p.evaluate(id=>{go('artikel',id);R.edit=false;draw()},id);await W();
t=await p.evaluate(()=>{const d=[...document.querySelectorAll('#main > details.acc')].find(x=>/Tensidwerte/.test(x.querySelector('summary').textContent));return d&&d.textContent});console.log(t);
chk('Tensidwerte Ansicht',t&&/51–55/.test(t)&&/nichtionisch/.test(t)&&/Katalog/.test(t));
await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},id);await W();
await p.evaluate(()=>{f_was.value='48';f_tkl.value='nichtionisch'});await p.evaluate(id=>saveArt(id),id);await W();
chk('eigener WAS',await p.evaluate(id=>getI(id).was==='48'&&wasNum(getI(id))===48,id));
// EN
await p.evaluate(()=>{LANG='en';sheetAppSet()});await W();s=await sh();console.log(JSON.stringify(s.rows));chk('EN Liste',s.rows.includes('Language')&&s.rows.includes('Expert mode'));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
