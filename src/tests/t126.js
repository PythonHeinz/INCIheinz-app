const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const o={};
S.expert=true;save();
o.rows=TBS.rows.length;o.snKeys=Object.keys(TBS.sn).length;
o.noBio=!TBS.rows.some(r=>/Biokons|Leucidal|Dermofeel|Hyaluron/.test(r[0]));
tbsLoad();await W();
const sj=S.items.filter(i=>i.tb==='sonja');o.loaded=sj.length;o.withSn=sj.filter(i=>i.sn&&i.sn.length).length;o.withAlt=sj.filter(i=>i.alt&&i.alt.length).length;
o.noBioLoaded=!sj.some(i=>/Biokons|Leucidal/.test(i.name));
const cet=sj.find(i=>i.name==='Cetylalkohol');o.cetAlt=cet&&cet.alt;o.cetSn=cet&&cet.sn.map(x=>x[0]);
// Artikelansicht
go('artikel',cet.id);await W();
let t=document.body.innerText;o.hasBox=!!document.getElementById('snbox');o.hint=/Sonjas Notizen/.test(t);o.closed=!document.getElementById('snbox').open;
o.noRawText=!/Kleinstemulsionen/.test(document.getElementById('snbox').innerText.slice(0,0))
snOpen();await W();o.open=document.getElementById('snbox').open;o.txt=/Konsistenzgeber/.test(document.getElementById('snbox').innerText);o.alt=/Cetylalkohol green MB/.test(document.getElementById('snbox').innerText);
// Artikel ohne Notizen: kein Block
const no=sj.find(i=>!(i.sn&&i.sn.length)&&!(i.alt&&i.alt.length));go('artikel',no.id);await W();o.noBoxWithout=!document.getElementById('snbox');
// Bearbeiten: kein Block
go('artikel',cet.id);await W();
// Entfernen behält Notizen an Artikeln mit Menge
const a=sj.find(i=>i.sn&&i.sn.length);a.total=10;a.unk=false;tbsRm();await W();
o.keptSn=!!(S.items.find(i=>i.id===a.id)||{}).sn;o.tbLeft=S.items.filter(i=>i.tb).length;
return o});
console.log(JSON.stringify(r,null,1));console.log('errors:',errs);await b.close()})();
