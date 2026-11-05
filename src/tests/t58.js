// Rezeptbuch: Grundablauf (Anlegen, Rechner/Anker, Mischbarkeit, Version, Mischen, Abzug, Charge)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
const out=process.env.OUT||'/tmp/t';
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(250);return r};
const log=(...a)=>console.log(...a);
// Lagerdaten vorbereiten
await T(()=>{S.items.forEach(i=>{i.dens=i.kind==='v'?0.92:i.dens});});
log('items',await T(()=>S.items.length),await T(()=>S.items.slice(0,6).map(i=>i.name+':'+i.kind+':'+i.total+':'+i.unk).join(' | ')));
await T(()=>tab('rez'));await p.screenshot({path:out+'/r1_leer.png'});
log('leer',await T(()=>document.getElementById('main').innerText.replace(/\n/g,'|').slice(0,120)));
// Editor
await T(()=>rzEdit(null));
await T(()=>{const it=S.items.filter(i=>i.kind==='w'&&i.total>=50).slice(0,3);window.__it=it.map(i=>i.id);
 RE.d.name='Testcreme';RE.d.phasen=[{id:uid(),typ:'A',name:'Phase A · Wasserphase',z:[{id:uid(),item:'',cid:'',name:'Wasser',g:60}]},{id:uid(),typ:'B',name:'Phase B · Fett-/Ölphase',z:it.map((i,n)=>({id:uid(),item:i.id,cid:i.cid||'',name:i.name,g:[20,10,10][n]}))}];
 RE.d.mod=[{id:uid(),t:'schritt',titel:'Erhitzen',text:'Beide Phasen erwärmen.',o:true},{id:uid(),t:'hinweis',titel:'',text:'Nicht an der Augenpartie.',o:false}];RE.dirty=true;rzEd()});
await p.screenshot({path:out+'/r2_editor.png'});
await T(()=>rzSave());await p.screenshot({path:out+'/r3_save.png'});
await T(()=>{document.getElementById('rn').value='Erste Probe';rzDoSave()});
log('nach save',await T(()=>R.name+' v'+rzCurV(S.rez[0]).n));
await p.screenshot({path:out+'/r4_view.png'});
// Anker: 27 g für 2. Zutat
const info=await T(()=>{const r=S.rez[0];return {have:rzHave(r.vers[0].d.phasen[1].z[0]).g,sum:rzSum(r.vers[0].d)}});log('have/sum',JSON.stringify(info));
await T(()=>{const e=document.getElementById('rza_1_0');e.value='5';e.dispatchEvent(new Event('input'))});
log('total nach Anker',await T(()=>document.getElementById('rz_tot').value),'anchor',await T(()=>RC.anchor));
await p.screenshot({path:out+'/r5_anker.png'});
// Version 2
await T(()=>{rzEdit(S.rez[0].id);RE.d.phasen[1].z[0].g=25;RE.dirty=true;rzEd();rzSave()});
log('diff',await T(()=>RE.pending.diff.join(' ; ')));await p.screenshot({path:out+'/r6_vsheet.png'});
await T(()=>{document.getElementById('rn').value='mehr Öl';rzDoSave()});
log('versionen',await T(()=>S.rez[0].vers.map(v=>v.n+':'+v.note).join(',')));
await T(()=>{stack.push(R);R={name:'verl',id:S.rez[0].id};draw()});await p.screenshot({path:out+'/r7_versionen.png'});
// Mischen
await T(()=>{const id=S.rez[0].id;stack=[{name:'rez',id:null}];rzMischStart(id,2)});await p.screenshot({path:out+'/r8_misch.png'});
const before=await T(()=>window.__it.map(id=>getI(id).total));
await T(()=>{RM.touched=true;rmFinish()});await p.screenshot({path:out+'/r9_fertig.png'});
await T(()=>rmDone());
const after=await T(()=>window.__it.map(id=>getI(id).total));
log('vorher',before,'nachher',after,'charge',await T(()=>S.chg.length+' '+R.name));
await p.screenshot({path:out+'/r10_charge.png'});
await T(()=>doUndo(false));log('undo',await T(()=>window.__it.map(id=>getI(id).total)),await T(()=>(S.chg||[]).length));
await T(()=>tab('mbar'));await p.screenshot({path:out+'/r11_mbar.png'});
await T(()=>{go('artikel',window.__it[0])});await p.screenshot({path:out+'/r12_artikel.png'});
await T(()=>tab('lager'));await p.screenshot({path:out+'/r13_lager.png'});
log('errors',errs);await b.close()})();
