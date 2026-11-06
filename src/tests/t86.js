const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
let ok=0,bad=0;const chk=(n,c)=>{if(c)ok++;else{bad++;console.log('FEHLER:',n)}};const W=()=>p.waitForTimeout(300);
const id=await p.evaluate(()=>{const it=mk(CM['K0068'],{});S.items.push(it);return it.id});
await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},id);await W();
let r=await p.evaluate(()=>({k:document.getElementById('f_sapk')&&document.getElementById('f_sapk').placeholder,j:document.getElementById('f_iod')&&document.getElementById('f_iod').placeholder}));
chk('Felder im Bearbeiten mit Katalog-Platzhalter',r.k==='185–200'&&r.j==='98');
await p.evaluate(()=>{document.getElementById('f_sapk').value='190';document.getElementById('f_smp').value='-5 °C'});
await p.evaluate(id=>saveArt(id),id);await W();
r=await p.evaluate(id=>{const i=getI(id);const f=fettOf(i);return {k:i.sapk,sapk:f.sapk,sapn:f.sapn,iod:f.iod,mid:fettNum(f.sapk.v),m2:fettNum('185–200'),m3:fettNum('0,132–0,143')}},id);console.log(JSON.stringify(r));
chk('eigener Wert gespeichert',r.k==='190'&&r.sapk.src==='own');chk('NaOH berechnet 0,135',r.sapn.src==='calc'&&r.sapn.v==='0.135');chk('Jodzahl vom Katalog',r.iod.src==='cat'&&r.iod.v==='98');chk('Mitte',r.m2===192.5&&Math.abs(r.m3-0.1375)<1e-9);
await p.evaluate(id=>{go('artikel',id);R.edit=false;draw()},id);await W();
let t=await p.evaluate(()=>document.getElementById('fettbox').innerText);console.log(t.replace(/\n/g,' | '));
chk('Anzeige eigener Wert',/190/.test(t)&&/eigener Wert/.test(t)&&/berechnet/.test(t)&&/Jodzahl\s*\|?\s*98/.test(t.replace(/\n/g,' ')));
// leeren -> Katalog
await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},id);await W();
await p.evaluate(()=>{['sapk','smp'].forEach(k=>document.getElementById('f_'+k).value='')});await p.evaluate(id=>saveArt(id),id);await W();
r=await p.evaluate(id=>fettOf(getI(id)).sapk.src,id);chk('leer = Katalog',r==='cat');
// Artikel ohne Fettbezug: kein Block
const id2=await p.evaluate(()=>{const it=mk(CM['K0798'],{});S.items.push(it);return it.id});
await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},id2);await W();
chk('kein Block bei Tensid',await p.evaluate(()=>!document.getElementById('f_sapk')));
await p.evaluate(()=>{LANG='en'});await p.evaluate(id=>{go('artikel',id);R.edit=true;draw()},id);await W();
chk('EN',await p.evaluate(()=>/Saponification value/.test(document.body.innerText)&&/Leave empty to use the catalog/.test(document.body.innerText)));
console.log('ok',ok,'bad',bad,errs);await b.close()})();
