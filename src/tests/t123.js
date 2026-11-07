const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const r={};
const bw=CAT.find(c=>/^Bienenwachs/i.test(c.n));const wa=S.items.length;
S.items.push(mk(null,{name:'Tamanuöl BIO',kind:'w',total:100}));
RZIM={d:{name:'Test Salbe',zweck:'',ph:'',ergibt:'',zeit:'',grad:'',phasen:[{id:uid(),typ:'B',name:'Phase B · Fett-/Ölphase',z:[{id:uid(),item:'',cid:'',name:'Tamanuöl BIO',g:7},{id:uid(),item:'',cid:bw?bw.id:'',name:bw?bw.n:'Bienenwachs',g:3},{id:uid(),item:'',cid:'',name:'Joh.',g:12.6}]}],mod:[{id:uid(),t:'schritt',titel:'Erhitzen',text:'Alles schmelzen.'}]}};
rzImportOpen();await W();
r.flags=[RE.d.phasen.every(p=>p.imp),RE.d.phasen.every(p=>p.z.every(z=>z.imp)),RE.d.mod[0].imp];
r.banner=document.getElementById('rzimpb')&&document.getElementById('rzimpb').innerText.slice(0,40);
r.refs=[...document.querySelectorAll('.rz-ref')].map(e=>e.querySelector('.rz-st').className+'|'+e.querySelector('.nm').textContent);
r.greyColor=getComputedStyle(document.querySelector('.rz-ref .nm')).color;
r.okBtns=document.querySelectorAll('.rz-ref .rz-ok').length;
window.__shot1=1;return r});
await p.screenshot({path:'/tmp/shots/a.png'});
// Menü der Textzutat "Joh."
const out2=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const r={};
const refs=[...document.querySelectorAll('.rz-ref')];const j=refs.find(e=>e.textContent.includes('Joh.'));j.click();await W();
r.menu=document.querySelector('.sheet,#sheet,[class*=sheet]')?document.body.innerText.includes('Als neuen Rohstoff anlegen'):null;
rzNewRaw(0+RE.d.phasen.findIndex(p=>p.z.some(z=>z.name==='Joh.')),RE.d.phasen.find(p=>p.z.some(z=>z.name==='Joh.')).z.findIndex(z=>z.name==='Joh.'));await W();
document.getElementById('rznn').value='Johanniskraut mazerat Olivenöl';rzNewRawGo();await W();
const jz=RE.d.phasen[RE.d.phasen.length-1].z.find(z=>z.name==='Johanniskraut mazerat Olivenöl');
r.new=[!!jz,jz&&!jz.imp,jz&&!!jz.item,S.items.some(i=>i.name==='Johanniskraut mazerat Olivenöl'&&i.unk)];
r.refs=[...document.querySelectorAll('.rz-ref')].map(e=>e.querySelector('.rz-st').className.replace('rz-st ','')+'|'+e.querySelector('.nm').textContent+'|imp='+e.classList.contains('imp'));
// bestätigen einzeln
const tz=RE.d.phasen[RE.d.phasen.length-1].z.find(z=>z.name==='Tamanuöl BIO');rzConfirmZ(tz.id);await W();
r.afterConfirm=RE.d.phasen.flatMap(p=>p.z).filter(z=>z.imp).length;
// Entfernen über Menü
const bz=RE.d.phasen[RE.d.phasen.length-1].z.findIndex(z=>/Bienenwachs/i.test(rzName(z)));const pidx=RE.d.phasen.length-1;
const before=RE.d.phasen[pidx].z.length;rzZDel(pidx,bz);await W();r.deleted=before-RE.d.phasen[pidx].z.length;
// Picker: neu anlegen aus Suche
RZPK={pi:pidx,zi:-1};rzPickZ(pidx,-1);await W();document.getElementById('rzpq').value='Sheabutter Test';rzPickList();await W();
r.pickNew=document.getElementById('rzpl').innerText.includes('als neuen Rohstoff anlegen');
rzSetZ('n');await W();r.pickedNew=S.items.some(i=>i.name==='Sheabutter Test');
// Alle bestätigen
rzConfirmAll();await W();r.left=rzImpCount(RE.d);r.bannerGone=!document.getElementById('rzimpb');
RE.d.name='Test Salbe';rzSave();await W();
const rc=S.rez[S.rez.length-1];r.saved=!!rc&&JSON.stringify(rc).indexOf('"imp"')<0;
return r});
console.log(JSON.stringify(out,null,1));console.log(JSON.stringify(out2,null,1),errs);await b.close()})();
