const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900},acceptDownloads:true})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};
const T=async(f,a)=>{const r=await p.evaluate(f,a);await p.waitForTimeout(250);return r};
await T(()=>{S.expert=true;demoLoad();tab('rez')});
// Zurück-Bug: Daten-Export -> Chargenprotokoll -> Zurück
await T(()=>sheetRzExport('data'));await T(()=>sheetRzPub('chg'));await T(()=>{[...document.querySelectorAll('.btn.sec')].find(x=>x.textContent==='Zurück').click()});
let h=await p.evaluate(()=>document.querySelector('.sheet,#sheet,.modal')?document.body.innerText:'');
chk('Zurück -> Rezepte exportieren',/Rezepte exportieren/.test(h)&&!/drucken/i.test(h.split('Rezepte exportieren')[0].slice(-40)));
chk('JSON im Export',/Rezeptdaten \(\.json\)/.test(h));
await T(()=>sheetRzExport('pub'));await T(()=>sheetRzPub('chg'));await T(()=>{[...document.querySelectorAll('.btn.sec')].find(x=>x.textContent==='Zurück').click()});
h=await p.evaluate(()=>document.body.innerText);chk('Zurück -> drucken',/Rezepte & Chargen drucken/i.test(h)||/Rezepte &amp; Chargen drucken/.test(h));
// Menü
await T(()=>sheetMehr());h=await p.evaluate(()=>document.body.innerText);chk('Menü Rezept teilen',/Rezept teilen/.test(h)&&!/Rezepte teilen/.test(h));
// PDF
const res=await p.evaluate(async()=>{const r=rzAll().find(x=>x.photo)||rzAll()[0];const bl=rzPdf(r.id,rzCurV(r).n,{foto:1,eck:1,ablauf:1,inci:1});const ab=new Uint8Array(await bl.arrayBuffer());let s='';ab.slice(0,8).forEach(c=>s+=String.fromCharCode(c));return {size:ab.length,head:s,photo:!!r.photo,b64:btoa(String.fromCharCode(...ab.slice(0,0)))}});
chk('PDF Kopf',res.head.startsWith('%PDF-1.4'));chk('PDF Größe',res.size>1500);console.log(res);
// Download
await T(()=>sheetRzShare());
const [dl]=await Promise.all([p.waitForEvent('download'),p.evaluate(()=>rzShareGo())]);
await dl.saveAs('/tmp/share.pdf');chk('Dateiname .pdf',/\.pdf$/.test(dl.suggestedFilename()));console.log(dl.suggestedFilename());
// Rezeptseite Button
await T(()=>{const r=rzAll()[0];go('rzview',r.id)});
console.log('ok',ok,'bad',bad,errs);await b.close()})();
