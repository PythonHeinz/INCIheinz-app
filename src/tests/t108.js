const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const r={};S.expert=true;S.items=[];S.rez=[];S.chg=[];demoLoad();await W();
r.navZ=getComputedStyle(document.querySelector('nav')).zIndex;
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
// Bild-Datei erzeugen
const mkF=async(c)=>{const cv=document.createElement('canvas');cv.width=300;cv.height=200;const x=cv.getContext('2d');x.fillStyle=c;x.fillRect(0,0,300,200);return new Promise(r=>cv.toBlob(b=>r(new File([b],'a.png',{type:'image/png'})),'image/png'))};
const fs=[await mkF('#fff'),await mkF('#eee'),await mkF('#ddd')];
// Rezept 3 Fotos
let seen=null;window.KI_MOCK=async(s,u,m,o)=>{seen={n:(o.images||[]).length,sys:s,user:u};return JSON.stringify({name:'Handcreme',ergibt_g:100,phasen:[{name:'A',z:[{name:'Wasser',menge:80,einheit:'g'},{name:'Glycerin',menge:20,einheit:'g'}]}],schritte:['Mischen']})};
sheetRzImport();await W();r.btnMulti=/bis 5/.test(document.getElementById('sheet').innerText);
await rzKiPhotoRun(fs);await W();r.rzImgs=seen.n;r.rzMultiText=/aufeinanderfolgende/.test(seen.user);r.prev=/Handcreme/i.test(document.getElementById('sheet').innerText);
// langer Text 20000 Zeichen
sheetRzImport(('Zeile mit Text\n').repeat(1500));await W();seen=null;window.KI_MOCK=async(s,u)=>{seen={len:u.length,web:/Webseite/.test(s)};return JSON.stringify({name:'X',phasen:[{name:'A',z:[{name:'Wasser',menge:10,einheit:'g'}]}]})};
await rzKiRun();await W();r.longSent=seen&&seen.len;r.webHint=seen&&seen.web;
sheetRzImport('x\n'.repeat(25000));await W();await rzKiRun();r.tooLong=document.getElementById('er').textContent;
// Artikel Screenshots
const it=S.items[0];sheetProduct(it.id);await W();r.prodBtn=/Screenshots mit KI/i.test(document.getElementById('sheet').innerText);
window.KI_MOCK=async(s,u,m,o)=>{seen={n:(o.images||[]).length};return JSON.stringify({name:it.name,inci:'AQUA',artikelnr:'123',form:'flüssig',ean:'',preise:[{menge:100,einheit:'ml',preis:4.5}]})};
await prodKiImgRun(fs);await W();const t=document.getElementById('sheet').innerText;r.prodImgs=seen.n;r.prodPrev=/Das wurde gefunden/i.test(t)&&/AQUA/.test(t)&&/bisher/i.test(t);
// KI aus
localStorage.removeItem('inciheinz-ki-key');localStorage.removeItem('inciheinz-ki-cfg');sheetProduct(it.id);await W();r.prodBtnOff=/Screenshots mit KI/i.test(document.getElementById('sheet').innerText);
LANG='en';localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));sheetProduct(it.id);await W();r.en=document.getElementById('sheet').innerText.match(/Screenshots with AI[^\n]*/)?.[0];
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
