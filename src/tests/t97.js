const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const r={};
r.demo=DEMO.rez.slice(0,2).map(x=>x.mod.map(m=>m.titel+'|'+m.text));
r.cnt=DEMO.rez.map(x=>x.mod.length).join(',');
r.p=stepParts('1. Wasser erhitzen. 2. Öle schmelzen; 3. Zusammengeben.');
r.ph=splitMods([{id:'a',t:'schritt',titel:'Herstellung',text:'1. Wasserphase auf 70 °C erhitzen. 2. Fettphase schmelzen. 3. Phase A in Phase B rühren.'}],[{typ:'A',name:'Phase A · Wasserphase'},{typ:'B',name:'Phase B · Fett-/Ölphase'}]).map(m=>m.titel+'|'+m.text);
// Migration der schon geladenen Demo-Rezepte
S.rez=[{id:'r1',demo:'T01',vers:[{n:1,d:{phasen:[],mod:[{id:'x',t:'schritt',titel:'Herstellung',text:'1. A tun. 2. B tun.'}]}}]}];S.migSteps=0;rzMigSteps();r.mig=S.rez[0].vers[0].d.mod.length;
const pr=rzParse('Rezept: Test\nZutaten:\n10 g Bienenwachs\nZubereitung:\n1. Schmelzen. 2. Abfüllen.');r.imp=pr.d.mod.map(m=>m.t+'|'+m.text);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
