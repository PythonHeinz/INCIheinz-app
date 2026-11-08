const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const o={};
S.expert=true;save();tbsLoad();await W();
go('check');await W();let t=document.body.innerText;o.cardOpen=/noch nicht dem Katalog zugeordnet/.test(t);o.n=ckOpenL().length;o.badge=/ · \d+ offen/.test(t);
// Rohstoff ohne Katalog anlegen
const it=mk(null,{name:'Mein Spezialöl',kind:'v',total:0});it.unk=true;it.kat='Pflanzenöl';S.items.push(it);save();go('check');await W();t=document.body.innerText;o.n2=ckOpenL().length;o.cardTxt=(t.match(/\d+ Rohstoffe? (ist|sind) noch nicht dem Katalog zugeordnet/)||[''])[0];o.badgePfl=/Pflanzenöl[\s\S]{0,40}offen/.test(t);
// Kategorie
go('check','Pflanzenöl');await W();t=document.body.innerText;o.listTop=/Mein Spezialöl/.test(t)&&/noch ohne Katalogeintrag/.test(t);o.cc=/ohne Katalog/.test(document.getElementById('cc').textContent);o.openBtns=document.querySelectorAll('#cl .ckrow.on .lnk').length;
// Zuordnen
ckLinkSheet(it.id);await W();t=document.body.innerText;o.hits=/Katalog-Treffer/.test(t)&&document.querySelectorAll('.hit').length;
const c=CAT.find(c=>c.k==='Pflanzenöl'&&!S.items.some(i=>i.cid===c.id));ckLinkDo(it.id,c.id);await W();o.linked=it.cid===c.id;o.inci=it.inci===c.i||!c.i;o.nAfter=ckOpenL().length;
// eigener bestätigen (Tonka)
const tk=S.items.find(i=>/Tonka Mazerat/.test(i.name));ckEigen(tk.id);await W();o.eig=tk.eig===true;o.nFinal=ckOpenL().length;
go('check');await W();o.allDone=/Alles zugeordnet/.test(document.body.innerText);
// Doppelte Zuordnung wird verhindert
const it2=mk(null,{name:'Jojoba x',kind:'v',total:0});S.items.push(it2);const dupc=S.items.find(i=>i.cid).cid;ckLinkDo(it2.id,dupc);await W();o.dupBlocked=!it2.cid;
// Öffnen-Link
go('check','Ätherisches Öl');await W();const lnk=document.querySelector('#cl .ckrow.on .lnk');o.openLink=!!lnk;lnk.click();await W();o.opened=R.page==='artikel'||/Rohstoff/.test(document.body.innerText);
// Abwählen weiter möglich
go('check','Ätherisches Öl');await W();toggleCat('K0167');await W();o.untick=!S.items.some(i=>i.cid==='K0167');
return o});
console.log(JSON.stringify(r,null,1));console.log('errors:',errs);await b.close()})();
