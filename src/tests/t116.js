const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,300));const r={};S.items=[];S.inv=[];
const jo=CAT.find(c=>/^jojoba/i.test(c.n));S.items.push(mk(jo,{kind:'v',total:50}));const n0=S.items.length;
const o=invCheck({lieferant:'Dragonspice',rechnungsnr:'1220984',datum:'2024-07-26',positionen:[
{bez:jo.n+', 100ml',anzahl:1,packung_menge:100,packung_einheit:'ml',preis_einzel:4.6},
{bez:'Geogard 221, 30ml',anzahl:1,packung_menge:30,packung_einheit:'ml',preis_einzel:2},
{bez:'Becherglas, 250ml',anzahl:1,packung_menge:250,packung_einheit:'ml',preis_einzel:4.3},
{bez:'Rabatt',anzahl:1,packung_menge:null,packung_einheit:'',preis_einzel:7.87}]});
INV={res:o,rows:o.pos.map(pp=>{const mm=invMatch(pp);const bad=pp.q.length||!mm.it||(mm.it.kind!==pp.kind);return {p:pp,it:mm.it?mm.it.id:'',sure:mm.sure,on:!bad}})};
invPrev();await W();const sh=document.getElementById('sheet');
r.dis=[...sh.querySelectorAll('[id^=inv_]')].map(e=>e.disabled);r.hint=/Bestand 0 angelegt/.test(sh.innerText);
sh.querySelector('label.chk input[onchange^=invAll]').click();await W();r.checked=[...sh.querySelectorAll('[id^=inv_]')].map(e=>e.checked);
invCommit();await W();r.items=S.items.length-n0;r.new=S.items.slice(n0).map(i=>i.name+'|'+i.bezug.length+'|'+(i.total||0)+'|'+i.unk);r.jo=S.items[0].bezug.length;r.err=(document.getElementById('er')||{}).innerText;
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
