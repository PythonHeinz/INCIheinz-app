// Testdaten: laden, alle Rezepte mischbar, entfernen, Rückgängig
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(250);return r};
const n0=await T(()=>S.items.length);
await T(()=>{S.expert=true;save();sheetSettings()});await p.screenshot({path:'/tmp/t/d1.png'});
await T(()=>demoAsk());await T(()=>demoLoad());
console.log('rez',await T(()=>S.rez.length),'items +',await T(n=>S.items.length,0)-n0);
const bad=await T(()=>{const o=[];S.rez.forEach(r=>{const v=r.vers[r.vers.length-1];const c=rzCheck(v.d,v.d.ergibt||100);if(!c.ok)o.push(v.d.name+': miss '+c.miss.map(x=>rzName(x.z))+' low '+c.low.map(x=>rzName(x.z)));
 const inc=rzInci(v.d);if(inc.no.length)o.push(v.d.name+' INCI fehlt '+inc.no)});return o});
console.log('Probleme',bad);
console.log('Erste',await T(()=>S.rez[0].vers[0].d.name));
await p.screenshot({path:'/tmp/t/d2.png'});
await T(()=>go('rezv',S.rez[4].id));await p.screenshot({path:'/tmp/t/d3.png'});
console.log(await T(()=>document.getElementById('main').innerText.replace(/\n/g,'|').slice(0,500)));
await T(()=>demoRm());console.log('nach Entfernen',await T(()=>S.rez.length),await T(()=>S.items.length)-n0);
await T(()=>doUndo(false));console.log('nach Undo',await T(()=>S.rez.length));
console.log('Fehler',errs);await b.close()})();
