const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const T=async f=>{const r=await p.evaluate(f);await p.waitForTimeout(250);return r};
const set=new Set();
const grab=async()=>{(await p.evaluate(()=>{LANG='en';const out=[];const root=document.getElementById('app');const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('.nm,textarea,script,style'))continue;const s=n.nodeValue.trim();if(s&&/[A-Za-zÄÖÜäöüß]{3}/.test(s)&&trStr(s)===s)out.push(s)}
root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{['placeholder','aria-label','title'].forEach(a=>{const s=e.getAttribute(a);if(s&&/[A-Za-zÄÖÜäöüß]{3}/.test(s)&&trStr(s)===s&&!e.closest('.nm'))out.push(s)})});LANG='de';return out})).forEach(s=>set.add(s))};
await T(()=>{const it=S.items.filter(i=>i.kind==='w'&&i.total>=50).slice(0,2);const mkz=(i,g)=>({id:uid(),item:i.id,cid:i.cid||'',name:i.name,g});
 S.rez=[{id:'r1',created:new Date().toISOString(),vers:[{n:1,date:new Date().toISOString(),note:'x',diff:[],from:0,st:'',d:{name:'Testcreme',zweck:'K',ph:'5,5',ergibt:'3',zeit:'45',grad:'mittel',phasen:[{id:uid(),typ:'A',name:'Wasserphase',z:[mkz(it[0],60)]},{id:uid(),typ:'B',name:'Fettphase',z:[mkz(it[1],40)]}],mod:[]}}]}];
 S.chg=[{id:'c1',rez:'r1',ver:1,date:new Date().toISOString(),total:100,note:'',stars:3,abz:true,lines:[{n:'Wasser',item:'',soll:60,ist:61}]}]});
const pages=[()=>tab('rez'),()=>{stack=[];go('rezv','r1')},()=>{R={name:'rezv',id:'r1',ver:1};RC={id:null};draw()},()=>{rzEdit('r1');document.querySelectorAll('details.acc').forEach(d=>d.open=true)},()=>{rzEdit(null)},()=>{tab('lager')}];
const sheets=[()=>{tab('rez');sheetMehr()},()=>sheetRzSet(),()=>sheetAppSet(),()=>sheetLagerSet(),()=>sheetRzImport(),()=>sheetRzExport(),()=>sheetRzPub('card'),()=>sheetRzPub('book'),()=>sheetRzPub('chg'),()=>sheetRzPub('txt'),()=>sheetRzPub('json'),()=>rzPhotoMenu(),()=>{rzEdit('r1');rzScaleSheet()},()=>{rzEdit('r1');rzAssign&&rzAssign(0)},()=>{rzEdit('r1');rzPhMenu(1)},()=>{rzEdit('r1');rzZMenu(1,0)},()=>{rzEdit('r1');rzMoveSheet&&rzMoveSheet(1,0)},()=>{rzEdit('r1');rzPhaseChooser&&rzPhaseChooser()},()=>{rzEdit('r1');RE.d.name='Neu';draftFlush();draftCheck()},()=>{tab('lager');sheetMehr()},()=>{tab('lager');sheetSettings&&sheetSettings()}];
for(const f of pages){try{await T(f);await grab()}catch(e){console.log('ERRp',e.message)}}
for(const f of sheets){try{await T(f);await grab();await T(()=>{try{closeSheet()}catch(e){}})}catch(e){console.log('ERRs',e.message.slice(0,100))}}
console.log(JSON.stringify([...set]));console.log('errors',errs);await b.close()})();
