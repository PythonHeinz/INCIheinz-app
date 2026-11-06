const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900},acceptDownloads:true})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
await p.evaluate(()=>{S.expert=true;demoLoad();tab('rez')});
const id=await p.evaluate(()=>{const r=rzAll().find(x=>rzCurV(x).d.phasen.length>=2)||rzAll()[0];return r.id});
const info=await p.evaluate(id=>{const d=rzCurV(rzGet(id)).d;return {np:d.phasen.length,n:d.phasen.reduce((a,p)=>a+p.z.length,0)}},id);console.log(info);
// Editor
await p.evaluate(id=>rzEdit(id,0),id);await W();
const refs=await p.evaluate(()=>document.querySelectorAll('#main .rz-ref').length);
chk('Gesamtliste zeigt zugeordnete Zutaten',refs>0);
await p.evaluate(()=>{document.getElementById('main').scrollTop=620});await W();await p.screenshot({path:'/tmp/s_ed.png'});
await p.evaluate(()=>back());await W();await p.evaluate(()=>{const b=[...document.querySelectorAll('.btn')].find(x=>/Verwerfen|Trotzdem/.test(x.innerText));b&&b.click()});await W();
// Rezeptseite readonly
await p.evaluate(id=>{R={name:'rezv',id,ver:0};draw()},id);await W();
chk('Mengen schreibgeschützt',await p.evaluate(()=>{const a=[...document.querySelectorAll('input.rz-a')];return a.length>0&&a.every(x=>x.readOnly)}));
chk('Gesamtmenge editierbar',await p.evaluate(()=>!document.getElementById('rz_tot').readOnly));
// Text-Export und Import
const txt=await p.evaluate(id=>rzTextOf(id),id);console.log(txt.slice(0,500));
chk('Text mit Kopfliste',/Zutaten gesamt/.test(txt)||info.np<2);
const n=await p.evaluate(t=>{const d=rzParse(t);const dd=d.d||d;return (dd.phasen||[]).reduce((a,p)=>a+p.z.length,0)},txt).catch(e=>-1);console.log('Import Zutaten',n,'Original',info.n);
chk('Import ohne Doppelung',n===info.n);
// Karte
const html=await p.evaluate(id=>rzCardHtml(id,rzCurV(rzGet(id)).n).body,id);chk('Karte mit Kopfliste',info.np<2||/<h2>Phasen<\/h2>/.test(html));
// PDF
const sz=await p.evaluate(async id=>{const bl=rzPdf(id,rzCurV(rzGet(id)).n,{});return bl.size},id);chk('PDF ok',sz>1500);
const dl=await p.evaluate(async id=>{const bl=rzPdf(id,rzCurV(rzGet(id)).n,{});const ab=new Uint8Array(await bl.arrayBuffer());let s='';for(const c of ab)s+=String.fromCharCode(c);return btoa(s)},id);require('fs').writeFileSync('/tmp/t76.pdf',Buffer.from(dl,'base64'));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
