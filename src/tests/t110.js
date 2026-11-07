const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const r={};S.expert=true;S.items=[];S.rez=[];S.chg=[];
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
const c=CAT.find(c=>/sonnenblumen/i.test(c.n))||CAT.find(c=>c.sap_naoh);const it=mk(c,{kind:'w',total:100});S.items.push(it);const oldN=it.notiz||'';
const cv=document.createElement('canvas');cv.width=100;cv.height=100;const f=await new Promise(r=>cv.toBlob(b=>r(new File([b],'a.png',{type:'image/png'})),'image/png'));
window.KI_MOCK=async()=>JSON.stringify({name:it.name,inci:'',artikelnr:'',form:'',ean:'',preise:[],dichte:'920 kg/m³',verseifungszahl:'188-194 mg KOH/g',naoh_bedarf:'9',jodzahl:'125–140',schmelzpunkt:'-17 bis -16 °C',sonstige:[{name:'pH-Wert',wert:'5,5'},{name:'Flammpunkt',wert:'> 250 °C'},{name:'Wirkung',wert:'heilt Ekzeme'},{name:'x',wert:''}]});
sheetProduct(it.id);await W();await prodKiImgRun([f]);await W();const t=document.getElementById('sheet').innerText;
r.title=/Technische Werte/i.test(t);r.dens=/0,92/.test(t);r.sapk=/188–194/.test(t);r.noSapnBad=!/NaOH-Bedarf[^\n]*\n9/.test(t);r.smp=/-17–-16/.test(t);r.sonst=/pH-Wert: 5,5; Flammpunkt: > 250/.test(t);r.noWirk=!/heilt/.test(t);
// Jodzahl abwählen
document.getElementById('px_iod').checked=false;prodApply();await W();const i2=getI(it.id);r.applied={dens:i2.dens,sapk:i2.sapk,iod:i2.iod||'',notiz:i2.notiz.slice(0,80)};r.fz=fettOf(i2).sapk.v;
// Lieferant fehlt -> kein Anwenden
window.KI_MOCK=async()=>JSON.stringify({name:it.name,preise:[{menge:100,einheit:'g',preis:3}],dichte:'0,5 g/ml'});sheetProduct(it.id);await W();await prodKiImgRun([f]);await W();document.getElementById('pp_l').value='';prodApply();await W();r.stillOpen=/Das wurde gefunden/i.test(document.getElementById('sheet').innerText);r.densUnchanged=getI(it.id).dens===0.92;
LANG='en';sheetProduct(it.id);await W();return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
