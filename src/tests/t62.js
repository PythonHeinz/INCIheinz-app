// Änderungen nach QA-Bericht: Dichte fehlt, Mischbar-Logik, Module, Werkbank, Mehr-Menü, Versionsliste
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:860},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(250);return r};
await T(()=>{S.expert=true;demoLoad()});
const mandel=await T(()=>{const i=S.items.find(x=>FOLD(x.name)==='mandelol');i.dens=0;save();return i.id});
console.log('Chip Handcreme',await T(()=>{const r=S.rez.find(x=>x.vers[0].d.name==='Handcreme Olivem');return rzStat(r).t}));
await T(()=>{const r=S.rez.find(x=>x.vers[0].d.name==='Handcreme Olivem');rzOpen(r.id)});
console.log(await T(()=>document.getElementById('rzban').innerText.replace(/\n/g,'|')));
await p.screenshot({path:'/tmp/t/e1.png'});
await T(()=>rzDens(window.__m=S.items.find(x=>FOLD(x.name)==='mandelol').id,'draw()'));await T(()=>{document.getElementById('dn').value='0,92'});await T(()=>rzDensSave());
console.log('nach Dichte',await T(()=>document.getElementById('rzban').innerText.replace(/\n/g,'|')));
// Mischbar-Tab, Filter-Chip weg
await T(()=>tab('rez'));console.log('Chip-Leiste',await T(()=>document.querySelectorAll('#main .pill').length));
await T(()=>tab('mbar'));console.log(await T(()=>document.getElementById('main').innerText.replace(/\n/g,'|').slice(0,120)));
// Editor: Module
await T(()=>{const r=S.rez[0];rzEdit(r.id)});
await T(()=>{RZINS=null;rzNewMod('hinweis');rzNewMod('schritt');RZINS=0;rzNewMod('notiz')});
console.log('Module',await T(()=>RE.d.mod.map(m=>m.t+':'+m.titel).join(',')));
await T(()=>{document.querySelectorAll('details.acc')[1].open=true});await p.screenshot({path:'/tmp/t/e2.png'});
// Werkbank
await T(()=>back());
await T(()=>{const r=S.rez.find(x=>x.vers[0].d.name==='Handcreme Olivem');rzMischStart(r.id,1)});await p.screenshot({path:'/tmp/t/e3.png'});
await T(()=>{const el=document.querySelector('.rm-ist');el.value='3,1';el.dispatchEvent(new Event('input'))});
console.log('auto-check',await T(()=>document.querySelector('.rm-r input[type=checkbox]').checked));
await T(()=>rmFinish());console.log('Abzug default',await T(()=>(document.querySelector('input[name=rmab]:checked')||{}).value));
await T(()=>closeSheet());
await T(()=>{S.items.forEach(i=>{if(i.demo)i.unk=true});save()});await T(()=>rmFinish());console.log('ohne Bestand',await T(()=>(document.querySelector('input[name=rmab]:checked')||{}).value),await T(()=>document.getElementById('sheet').innerText.replace(/\n/g,'|').slice(0,200)));
await T(()=>closeSheet());
// Versionsliste + Mehr
await T(()=>{S.items.forEach(i=>{if(i.demo)i.unk=false});const r=S.rez[0];go('verl',r.id)});await p.screenshot({path:'/tmp/t/e4.png'});
await T(()=>tab('rez'));await T(()=>sheetMehr());console.log('Mehr',await T(()=>document.getElementById('sheet').innerText.replace(/\n/g,'|').slice(0,200)));await p.screenshot({path:'/tmp/t/e5.png'});
await T(()=>closeSheet());console.log('Buchdruck',await T(()=>{try{const x=rzCardHtml(S.rez[0].id,1);return x.body.length>100}catch(e){return e.message}}));
console.log('Fehler',errs);await b.close()})();
