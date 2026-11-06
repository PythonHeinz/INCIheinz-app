const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};
const T=async(f,a)=>{const r=await p.evaluate(f,a);await p.waitForTimeout(250);return r};
const txt=()=>p.evaluate(()=>document.getElementById('sheet')?document.getElementById('sheet').innerText:'');
await T(()=>{tab('lager');sheetMehr()});let t=await txt();
chk('Lager: kein Bestellliste/Arbeiten',!/bestellliste/i.test(t)&&!/^arbeiten/im.test(t));chk('Lager: Statistik zuerst',/^\s*statistik/i.test(t));
await T(()=>{closeSheet();tab('rez');sheetMehr()});t=await txt();
chk('Rezept: kein Arbeiten, Statistik zuerst',!/^arbeiten/im.test(t)&&/^\s*statistik/i.test(t));chk('Rezepte teilen',/rezept teilen/i.test(t)&&!/rezepte sichern/i.test(t));chk('Module & Ablauf',/module & ablauf/i.test(t));
await T(()=>sheetRzSet());t=await txt();chk('Rundung nicht in Rezept-Voreinst.',!/rundung/i.test(t));
chk('Modul-Icons',await p.evaluate(()=>document.querySelectorAll('#sheet label.chk svg').length)>=5);
// Ablauf umsortieren per Griff
const first=await p.evaluate(()=>rzAbl()[0]);const n0=await p.evaluate(()=>rzAbl().length);
const g=await p.$$('#rzablc .rz-grip');chk('Griffe',g.length===n0);
const bb=await g[0].boundingBox(),bl=await g[2].boundingBox();
await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bl.x+bl.width/2,bl.y+bl.height/2+20,{steps:8});await p.mouse.up();await p.waitForTimeout(300);
const after=await p.evaluate(()=>rzAbl());chk('Reihenfolge geändert',after[0]!==first&&after.length===n0&&after.includes(first));
// Genauigkeit
await T(()=>sheetAppSet());t=await txt();chk('Genauigkeit in Einstellungen',/genauigkeit der mengen/i.test(t)&&/lager \(mengen/i.test(t)&&/rezeptbuch \(rechner/i.test(t));
await T(()=>accSet('r',1));chk('Rundung Rezept=1',await p.evaluate(()=>rzStep())===1);
await T(()=>accSet('l',0));const f=await p.evaluate(()=>fmt(12.34,'w'));chk('fmt ganze g: '+f,f==='12 g');
await T(()=>accSet('l',2));const f2=await p.evaluate(()=>fmt(12.34,'w'));chk('fmt 2 Dez: '+f2,/12,34/.test(f2));
// Rezept Statistik zurück
await T(()=>{S.expert=true;sheetAppSet()});t=await txt();chk('Rückgängig-Zeile',/rückgängig/i.test(t));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
