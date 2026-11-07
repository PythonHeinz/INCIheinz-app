const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,250));const r={};
let net=0;const of=window.fetch;window.fetch=function(u){if(String(u).includes('googleapis'))net++;return of.apply(this,arguments)};
S.items=[];sheetRzImport();await W();r.btnOff=!!document.getElementById('rzkib');
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
sheetRzImport();await W();r.btnOn=!!document.getElementById('rzkib');
document.getElementById('rzit').value='Handcreme\nAlles zusammen: 66 g Wasser, ein Löffel Glycerin, 10 ml Mandelöl, 5% Sheabutter\nAchtung: heilt Ekzeme\nRühren und fertig';
let seen='';
window.KI_MOCK=async(s,u,m,o)=>{seen=u+'|'+(o&&o.json);return '```json\n'+JSON.stringify({name:'Handcreme',zweck:'Handpflege',ergibt_g:100,phasen:[{typ:'A',name:'',z:[{name:'Wasser',menge:66,einheit:'g'},{name:'Glycerin',menge:1,einheit:'el'},{name:'Mandelöl',menge:10,einheit:'ml'},{name:'Sheabutter',menge:5,einheit:'%'},{name:'Duftstoff',menge:null,einheit:''}]}],schritte:['Rühren und fertig','Diese Creme heilt Ekzeme'],hinweise:[{art:'Achtung',text:'Nicht in die Augen'}]})+'\n```'};
await rzKiRun();await W();
const t=document.getElementById('sheet').innerText;
r.preview=t.includes('Das habe ich erkannt');r.kiHint=t.includes('Von der KI vorgeschlagen');r.sent=seen.includes('<text>')&&seen.endsWith('true');
r.warn=t.match(/Bitte prüfen:[^\n]*/)?.[0];
const d=RZIM.d;const z=d.phasen[0].z;r.g=z.map(x=>x.name+':'+x.g).join(' | ');r.mods=d.mod.map(m=>m.t+':'+m.text.slice(0,30));
r.noWirk=!JSON.stringify(d).includes('heilt');
rzImportOpen();await W();r.editor=R.name==='reze'&&RE.d.phasen[0].z.length;
/* Fehlerfälle */
sheetRzImport();await W();document.getElementById('rzit').value='x';
window.KI_MOCK=async()=>'kein json';await rzKiRun();await W();r.badFmt=document.getElementById('er').innerText;
window.KI_MOCK=async()=>JSON.stringify({phasen:[]});await rzKiRun();await W();r.badSchema=document.getElementById('er').innerText;
window.KI_MOCK=async()=>{throw kiErr('limit',429)};await rzKiRun();await W();r.limit=document.getElementById('er').innerText;
/* R0 bleibt unverändert und ohne KI */
localStorage.removeItem('inciheinz-ki-key');localStorage.removeItem('inciheinz-ki-cfg');
sheetRzImport();await W();document.getElementById('rzit').value='Creme\n30 g Sheabutter\n70 g Wasser';rzImportRun();await W();r.r0=document.getElementById('sheet').innerText.includes('Das habe ich erkannt')&&!document.getElementById('sheet').innerText.includes('KI');

/* A2 Foto */
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
sheetRzImport();await W();r.photoBtn=!!document.querySelector('.kifb');
const cv=document.createElement('canvas');cv.width=2400;cv.height=1800;cv.getContext('2d').fillRect(0,0,2400,1800);
const blob=await new Promise(x=>cv.toBlob(x,'image/png'));const file=new File([blob],'r.png',{type:'image/png'});
let imgSeen=null;window.KI_MOCK=async(s,u,m,o)=>{imgSeen=o&&o.image;return JSON.stringify({name:'Foto-Creme',phasen:[{typ:'',name:'',z:[{name:'Wasser',menge:50,einheit:'g'},{name:'Öl',menge:null,einheit:''}]}],schritte:[],hinweise:[]})};
await rzKiPhotoRun(file);await W();
r.imgMime=imgSeen&&imgSeen.mime;r.imgSmall=imgSeen&&imgSeen.data.length<1.5e6;r.photoCleared=window.KI_PHOTO===null;
r.fotoPrev=document.getElementById('sheet').innerText.includes('Von der KI vorgeschlagen');r.fotoNote=RZIM.d.mod.some(m=>/Foto\/Handschrift/.test(m.text))&&!RZIM.d.mod.some(m=>/Aus Text mit KI/.test(m.text));
window.KI_MOCK=async()=>{throw kiErr('netz')};sheetRzImport();await W();await rzKiPhotoRun(file);await W();r.photoErr=document.getElementById('er').innerText;r.photoCleared2=window.KI_PHOTO===null;
localStorage.removeItem('inciheinz-ki-key');localStorage.removeItem('inciheinz-ki-cfg');
r.net=net;
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
