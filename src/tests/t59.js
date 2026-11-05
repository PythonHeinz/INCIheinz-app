// Rezeptbuch: sammelt Texte, die in EN noch nicht übersetzt sind
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(200);return r};
const set=new Set();
const grab=async()=>{(await p.evaluate(()=>{LANG='en';const out=[];const root=document.getElementById('app');const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('.nm,textarea,script,style'))continue;const s=n.nodeValue.trim();if(!s||!/[A-Za-zÄÖÜäöüß]{3}/.test(s))continue;if(trStr(s)===s)out.push(s)}
root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{['placeholder','aria-label','title'].forEach(a=>{const s=e.getAttribute(a);if(s&&/[A-Za-zÄÖÜäöüß]{3}/.test(s)&&trStr(s)===s&&!e.closest('.nm'))out.push(s)})});LANG='de';return out})).forEach(s=>set.add(s))};
await T(()=>{const it=S.items.filter(i=>i.kind==='w'&&i.total>=50).slice(0,2);
 const mkz=(i,g)=>({id:uid(),item:i.id,cid:i.cid||'',name:i.name,g});
 const c=CAT.find(x=>!S.items.some(i=>i.cid===x.id));
 S.rez=[{id:'r1',created:new Date().toISOString(),vers:[{n:1,date:new Date().toISOString(),note:'Erste Fassung',diff:[],from:0,st:'',d:{name:'Testcreme',zweck:'Körperpflege',ph:'5,5',ergibt:'3 Tiegel',zeit:'45 min',grad:'mittel',phasen:[{id:uid(),typ:'A',name:'Phase A · Wasserphase',z:[{id:uid(),item:'',cid:'',name:'Wasser',g:60}]},{id:uid(),typ:'B',name:'Phase B · Fett-/Ölphase',z:[mkz(it[0],20),mkz(it[1],5),{id:uid(),item:'',cid:c.id,name:c.n,g:15}]}],mod:[{id:uid(),t:'schritt',titel:'Erhitzen',text:'x'},{id:uid(),t:'hinweis',titel:'H',text:'y'}]}},{n:2,date:new Date().toISOString(),note:'mehr Öl',diff:['Sheabutter: 20 → 25 g'],from:1,st:'fav',d:null}]}];
 S.rez[0].vers[1].d=JSON.parse(JSON.stringify(S.rez[0].vers[0].d));S.rez[0].vers[1].d.phasen[1].z[0].g=25;
 S.chg=[{id:'c1',rez:'r1',ver:1,date:new Date().toISOString(),total:100,note:'',stars:3,abz:true,lines:[{n:'Wasser',item:'',soll:60,ist:61}]}]});
const pages=[()=>tab('rez'),()=>{RZF='mix';tab('rez')},()=>{RZF='alle';tab('mbar')},()=>tab('chgs'),()=>{stack=[];go('rezv','r1')},()=>{R={name:'rezv',id:'r1',ver:1};RC={id:null};draw()},()=>{rzEdit('r1');document.querySelectorAll('details.acc').forEach(d=>d.open=true)},()=>{rzEdit(null)},()=>{R={name:'verl',id:'r1'};draw()},()=>{R={name:'chg',id:'c1'};draw()},()=>{R={name:'misch',id:'r1',ver:1};RM=null;draw()},
()=>{R={name:'rezv',id:'r1',ver:1};draw();go('artikel',S.rez[0].vers[0].d.phasen[1].z[0].item)}];
for(const f of pages){await T(f);await grab()}
const sheets=[()=>{rzEdit('r1');RE.d.phasen[1].z[0].g=30;rzAddPhase()},()=>rzAddMod(),()=>rzPickZ(1,-1),()=>rzZMenu(1,0),()=>rzPhMenu(1),()=>rzSave(),()=>{RE.d.name='';RE.id=null;rzSave()},()=>{R={name:'misch',id:'r1',ver:1};RM=null;draw();RM.touched=true;rmFinish()},()=>{R={name:'verl',id:'r1'};draw();rzMarkMenu('r1',2)},()=>rzDiffSheet('r1',1),()=>{R={name:'reze',id:'r1'};RE.dirty=true;rzWorld('lager')},()=>{R={name:'chg',id:'c1'};draw();rzChgDel('c1')}];
for(const f of sheets){try{await T(f);await grab()}catch(e){console.log('ERR sheet',e.message)}}
console.log(JSON.stringify([...set],null,0));console.log('errors',errs);await b.close()})();
