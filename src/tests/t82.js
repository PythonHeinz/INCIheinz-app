const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(250);
await p.evaluate(()=>{S.expert=true;demoLoad();tab('lager')});await W();
const ids=await p.evaluate(()=>{const its=S.items.filter(i=>i.cid&&CM[i.cid]&&!CM[i.cid].f&&!CM[i.cid].b&&!CM[i.cid].v&&!(CM[i.cid].d>0));const [a,b,c]=its;a.beschr='';a.verw='';a.form='';b.beschr='Mein eigener Text';b.form='Pulver';c.beschr='';c.form='';
 const upd=(x,o)=>Object.assign(CM[x.cid],o);
 upd(a,{b:'Emulgator für Öl-in-Wasser-Cremes',v:'2 bis 3 % mit Gelbildner; schaumverstärkend',f:'Pulver',d:0.9});upd(b,{b:'Katalogtext B',f:'Öl'});upd(c,{f:'Quatsch'});
 const n=catFill();return {a:a.id,b:b.id,c:c.id,n,ra:{be:a.beschr,v:a.verw,f:a.form},rb:{be:b.beschr,f:b.form},rc:c.form}});
chk('leere Felder gefüllt',ids.ra.be==='Emulgator für Öl-in-Wasser-Cremes'&&ids.ra.f==='Pulver'&&/schaumverstärkend/.test(ids.ra.v));
chk('eigener Text/Form bleiben',ids.rb.be==='Mein eigener Text'&&ids.rb.f==='Pulver');
chk('ungültige Form ignoriert',ids.rc===''||ids.rc===undefined);
// Ansicht
await p.evaluate(id=>go('artikel',id),ids.a);await W();
const t=await p.evaluate(()=>document.getElementById('main').innerText);
chk('Label Beschreibung / Funktion + Tag',/Beschreibung \/ Funktion/.test(t)&&/Vorschlag aus dem Katalog/i.test(t));
// Bearbeiten
await p.evaluate(()=>{R.edit=true;draw()});await W();
chk('Edit: Label umbenannt',/Beschreibung \/ Funktion/.test(await p.evaluate(()=>document.getElementById('af2').innerText)));
// Nutzer ändert -> Vorrang, Katalogänderung überschreibt nicht
await p.evaluate(()=>{document.getElementById('f_beschr').value='Mein Text';saveArt(R.id)});await W();
const r2=await p.evaluate(id=>{CM[getI(id).cid].b='Neuer Katalogtext';CM[getI(id).cid].v='Neu v';catFill();const i=getI(id);return {be:i.beschr,v:i.verw}},ids.a);
chk('Nutzertext hat Vorrang',r2.be==='Mein Text');
chk('unveränderter Vorschlag folgt dem Katalog',r2.v==='Neu v');
// Export-Zeile
const ex=await p.evaluate(()=>{XS.cols.beschr=1;XS.cols.verw=1;XS.cols.dmin=1;XS.cols.dens=1;return Object.keys(XCOLS).includes('beschr')});chk('Export-Spalte vorhanden',ex);
console.log('ok',ok,'bad',bad,errs);await b.close()})();
