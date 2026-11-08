const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const o={};
S.expert=true;save();sheetSetTest();await W();
const t=document.body.innerText;o.headings=[/Testbestand Heinz/.test(t),/Testbestand Sonja/.test(t),/Testdaten laden/.test(t),/Testbestand Sonja laden/.test(t),/Testbestand Sonja entfernen/.test(t)];
o.rows=TBS.rows.length;o.before=S.items.length;
tbsAsk();await W();o.ask=/Testbestand Sonja laden\?/.test(document.body.innerText);
tbsLoad();await W();
const sj=S.items.filter(i=>i.tb==='sonja');o.loaded=sj.length;o.unk=sj.filter(i=>i.unk).length;o.cat=sj.filter(i=>i.cid).length;o.own=sj.filter(i=>!i.cid).map(i=>i.name);
o.kinds=[sj.filter(i=>i.kind==='v').length,sj.filter(i=>i.kind==='w').length];
o.noteSample=(sj.find(i=>i.name==='Vitamin E')||{}).notiz;
o.demoUntouched=S.items.filter(i=>i.demo).length;
// zweites Laden: nichts Neues
tbsAsk();await W();o.again=/Nichts Neues/.test(document.body.innerText);closeSheet();await W();
// Menge eintragen und Rezeptverwendung simulieren
const a=sj[0],bb=sj[1];a.total=50;a.unk=false;
S.rez=S.rez||[];S.rez.push({id:uid(),demo:false,vers:[{n:1,d:{name:'X',phasen:[{id:uid(),typ:'B',name:'B',z:[{id:uid(),item:bb.id,cid:bb.cid,name:bb.name,g:5}]}],mod:[]}}]});
sheetSetTest();await W();o.rmBtn=/Testbestand Sonja entfernen/.test(document.body.innerText);o.countTxt=(document.body.innerText.match(/Geladen: \d+ Rohstoffe, davon \d+ ohne Menge/)||[''])[0];
tbsRmAsk();await W();o.rmAsk=document.body.innerText.match(/Entfernt \d+ Rohstoffe[^\n]*\n?[^\n]*/)[0];
tbsRm();await W();
o.after=S.items.length;o.keptA=S.items.some(i=>i.id===a.id);o.keptB=S.items.some(i=>i.id===bb.id);o.tbLeft=S.items.filter(i=>i.tb).length;
o.expected=o.before+2;
return o});
console.log(JSON.stringify(r,null,1));
// Englisch
const en=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,500));S.lang='en';try{setLang&&setLang('en')}catch(e){}save();return typeof setLang});
console.log('setLang',en,'errs',errs);await b.close()})();
