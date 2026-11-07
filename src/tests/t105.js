const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,250));const r={};
r.eanGood=eanOk('4006381333931');r.eanBad=eanOk('4006381333932');r.eanFind=eanFind('Art 123 EAN 4006381333931 und 4006381333932 sowie 12345').join(',');
r.parseEan=parseProduct('Produktname: Sheabutter\nArtikelnummer: A1\nBarcode 4006381333931\nINCI: Butyrospermum Parkii Butter').ean;
const raw=`Kräuterhaus Muster GmbH
Musterstraße 12
80331 München
Tel. 089 123456
info@kraeuterhaus.de
IBAN DE89 3704 0044 0532 0130 00
Kundennummer 99887
Max Mustermann
Rechnung Nr. R-2025-0815 vom 14.03.2025
1 x Sheabutter Bio 250 g EAN 4006381333931 7,90 €
2 x Jojobaöl 100 ml 8,50 € 17,00 €
Versand 4,90 €
Vielen Dank für Ihren Einkauf`;
const f=kiFilter(raw,'inv');r.kept=f.kept+'/'+f.total;r.noPrivate=!/IBAN|Musterstraße|80331|Tel\.|info@|Kundennummer/.test(f.text);r.hasPos=/Sheabutter/.test(f.text)&&/Jojobaöl/.test(f.text)&&/R-2025/.test(f.text)&&/4006381333931/.test(f.text);r.noName=!/Mustermann/.test(f.text);
S.items=[];S.inv=[];S.expert=true;
const sh=mk(null,{name:'Sheabutter Bio',kind:'w',total:500,ean:'4006381333931'});const jo=mk(null,{name:'Jojobaöl',kind:'v',total:100});sh.bezug=[];jo.bezug=[];S.items.push(sh,jo);
sheetInv();await W();r.offNoRow=!document.getElementById('sheet')?.innerText.includes('Rechnung einlesen')?'(Sheet ohne KI trotzdem direkt geöffnet)':'';
try{await kiCall('s','u')}catch(e){r.offErr=e.message}
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
sheetMehr();await W();r.mehrRow=document.getElementById('sheet').innerText.includes('Rechnung einlesen');
sheetInv();await W();document.getElementById('invt').value=raw;invStep();await W();
const ta=document.getElementById('kisend');r.sendNoPrivate=!/IBAN|Musterstraße/.test(ta.value);r.sendInfo=document.getElementById('sheet').innerText.match(/\d+ von \d+ Zeilen/)?.[0];
let sent='';window.KI_MOCK=async(s,u,m,o)=>{sent=u;return JSON.stringify({lieferant:'Kräuterhaus Muster',rechnungsnr:'R-2025-0815',datum:'2025-03-14',positionen:[{bez:'Sheabutter Bio 250 g',anzahl:1,packung_menge:250,packung_einheit:'g',preis_einzel:7.9,preis_gesamt:7.9,ean:'4006381333931'},{bez:'Jojobaöl 100 ml',anzahl:2,packung_menge:100,packung_einheit:'ml',preis_einzel:null,preis_gesamt:17,ean:''},{bez:'Unbekanntes Zeug',anzahl:1,packung_menge:null,packung_einheit:'',preis_einzel:3,preis_gesamt:3,ean:''}],versand:4.9,rabatt:null})};
await kiSendGo();await W();r.sentClean=!/IBAN|Musterstraße|Mustermann/.test(sent);
const t=document.getElementById('sheet').innerText;r.prev=t.includes('Das habe ich gefunden');r.versand=/Versandkosten: 4,90/.test(t);
r.rows=INV.rows.map(x=>(x.it?getI(x.it).name:'-')+':'+x.on+':'+x.p.preis+':'+x.p.m).join(' | ');
const tot0=sh.total+'/'+jo.total;
invCommit();await W();
r.sheBezug=sh.bezug.map(b=>b.datum+' '+b.preis+' '+b.menge+' '+b.kind).join(';');r.joBezug=jo.bezug.map(b=>b.datum+' '+b.preis+' '+b.menge).join(';');r.src=sh.bezug[0].src;
r.stockSame=tot0===(sh.total+'/'+jo.total);r.inv=JSON.stringify(S.inv.map(x=>[x.nr,x.versand,x.n]));
/* Duplikat */
INV.rows.forEach(x=>x.on=true);invPrev();await W();r.dupWarn=document.getElementById('sheet').innerText.includes('schon eingelesen');
invCommit();await W();r.dupBlocked=document.getElementById('er').innerText;r.nBezug=sh.bezug.length;
/* Einheit passt nicht */
const o2=invCheck({lieferant:'X',rechnungsnr:'1',datum:'2025-01-01',positionen:[{bez:'Jojobaöl',anzahl:1,packung_menge:100,packung_einheit:'g',preis_einzel:5}]});INV={res:o2,rows:o2.pos.map(p=>{const mm=invMatch(p);return {p,it:mm.it?mm.it.id:'',sure:mm.sure,on:!(mm.it&&mm.it.kind!==p.kind)}})};r.kindOff=INV.rows[0].on===false;
/* Prüfer */
for(const bad of [null,{},{positionen:[]},{positionen:[{bez:''}]}]){try{invCheck(bad);r['bad'+JSON.stringify(bad)]='kein Fehler'}catch(e){}}
r.futureDate=invCheck({datum:'2999-01-01',positionen:[{bez:'a',preis_einzel:1,packung_menge:1,packung_einheit:'g'}]}).datum==='';
/* A3 Produktseite */
sheetProduct(sh.id);await W();r.prodBtn=[...document.querySelectorAll('#sheet .btn')].some(x=>x.innerText.includes('KI'));
document.getElementById('pt').value='Sheabutter Bio\nTel 0123 456\nINCI: Butyrospermum parkii butter\nPreis 250 g 7,90 EUR\nEAN 4006381333931\nkontakt@shop.de';prodKiStep();await W();
r.prodSendClean=!/kontakt@|Tel 0123/.test(document.getElementById('kisend').value);
window.KI_MOCK=async()=>JSON.stringify({name:'Sheabutter Bio',inci:'Butyrospermum Parkii Butter<script>',artikelnr:'A1',form:'fest',ean:'4006381333932',preise:[{menge:250,einheit:'g',preis:7.9},{menge:5,einheit:'foo',preis:1},{menge:100,einheit:'ml',preis:-3}]});
await kiSendGo();await W();r.prodPrev=document.getElementById('sheet').innerText.includes('Das wurde gefunden');r.prodR=JSON.stringify({inci:PP.r.inci,ean:PP.r.ean,offers:PP.r.offers.length,form:PP.r.form});
/* KI aus */
localStorage.removeItem('inciheinz-ki-key');localStorage.removeItem('inciheinz-ki-cfg');
sheetMehr();await W();r.mehrOff=document.getElementById('sheet').innerText.includes('Rechnung einlesen');
sheetProduct();await W();r.prodBtnOff=[...document.querySelectorAll('#sheet .btn')].some(x=>x.innerText.includes('KI'));
LANG='en';sheetInv();await W();r.en=document.getElementById('sheet').innerText.slice(0,30);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
