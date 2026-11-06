const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{S.lief['Dragon Spice']=S.lief['Dragon Spice']||{frei:50,versand:5};sheetProduct(null);document.querySelector('#pt').value='Jojobaöl Bio 100 ml\nHändler: dragon-spice.de\n100 ml | 7,90 €\nINCI: Simmondsia Chinensis Seed Oil';prodRead();const s=document.querySelector('#pp_l');return s?s.value:'kein Select'});
console.log(r,errs);await b.close()})();
