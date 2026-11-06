const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(300);return r};const o={};
// Regal-Check
o.ck=await T(()=>{go('check',CAT.find(c=>/lavendel/i.test(c.n)).k);return {link:document.body.innerText.includes('Alle übernehmen'),cnt:document.querySelector('#cc').textContent}});
await p.screenshot({path:'s65a.png'});
o.ck2=await T(()=>{CK.q='lavendel';ckList();ckAll();const h=document.querySelector('#sheet h2,.sheet h2');return h&&h.textContent});
o.ck3=await T(()=>{ckAllDo();return {n:S.items.length,cc:document.querySelector('#cc').textContent}});
// INCI bestätigen + Lagerort + Speichern unten
o.i=await T(()=>{const it=S.items[S.items.length-1];window.__it=it;it.ist='ungeprüft';it.inci=it.inci||'Lavandula Angustifolia Oil';artikel(it);return document.body.innerText.includes('Als geprüft bestätigen')});
o.i2=await T(()=>{inciConfirm(__it.id);inciConfirmDo(__it.id);return __it.ist});
o.e=await T(()=>{R.edit=true;artikel(__it);return {bar:!!document.getElementById('sb22'),dis:document.getElementById('esv2').disabled,ort:!!document.getElementById('pk_ort')}});
await p.screenshot({path:'s65b.png',fullPage:false});
o.e2=await T(()=>{ED.ort='Regal';dirty();return document.getElementById('esv2').disabled});
o.e3=await T(()=>{document.getElementById('esv2').click();return {ort:__it.ort,bar:!!document.getElementById('sb22'),edit:R.edit,txt:document.body.innerText.includes('Lagerort')}});
o.e4=await T(()=>{R.edit=true;artikel(__it);dirty();tab('lager');return {sheet:document.body.innerText.includes('Änderungen verwerfen')}});
o.gap=await T(()=>GAPS.ort[1](__it));
console.log(JSON.stringify(o));console.log(errs);await b.close()})();
