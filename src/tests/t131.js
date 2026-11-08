const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const o={};
const Z=(n,g)=>({id:uid(),item:'',cid:'',name:n,g});
const mkd=()=>({name:'Shampoo Bar',zweck:'',ph:'',ergibt:'',zeit:'',grad:'',phasen:[{id:uid(),typ:'',name:'Zutaten',pool:true,z:[]},{id:uid(),typ:'',name:'Dry phase',z:[Z('SCI',154),Z('SCS',112)]},{id:uid(),typ:'',name:'Wet phase',z:[Z('Glycerin',6),Z('Zitronensäure',2)]}],mod:[{id:uid(),t:'notiz',titel:'Notiz',text:'Aus Foto erfasst'}]});
/* 1 Import */
RZIM={d:mkd()};rzImportOpen();await W();
o.impMods=RE.d.mod.map(m=>m.t+':'+m.titel+':'+m.text+(m.imp?':imp':''));
o.impBtn=!!document.getElementById('rzphm');
/* 2 Bestehendes Rezept: Button */
const d=mkd();RE={id:null,base:0,d:rzPoolFix(d),dirty:true,photo:''};stack.push(R);R={name:'reze',id:null};draw();await W();
o.btn=!!document.getElementById('rzphm');
document.getElementById('rzphm').click();await W();
o.mods2=RE.d.mod.map(m=>m.titel);o.btn2=!!document.getElementById('rzphm');
/* 3 Ansicht + Karte */
const id=uid();S.rez.push({id,created:new Date().toISOString(),vers:[{n:1,date:new Date().toISOString(),note:'',diff:[],from:0,st:'',d:RE.d}]});
tab('rez');await W();rzOpen(id);await W();
document.querySelectorAll('details.acc').forEach(e=>e.open=true);
o.view=[...document.querySelectorAll('.rz-mv')].map(e=>e.innerText.replace(/\n/g,' '));
o.card=rzCardHtml(id,1).body.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').split('Ablauf und Hinweise')[1].slice(0,260);
return o});
console.log(JSON.stringify(r,null,1));console.log('errors:',errs);await b.close()})();
