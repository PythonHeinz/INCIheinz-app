// sucht deutsche Reste in EN und ES
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const T=async f=>{try{await p.evaluate(f)}catch(e){}await p.waitForTimeout(250)};
await T(()=>{S.expert=true;demoLoad()});
const DE=/\b(und|der|die|das|für|mit|oder|ein|eine|dein|deine|deiner|nicht|wird|werden|zum|zur|von|bei|aus|dir|du|im|Diese|Rezept|Rohstoff|Lager|Einstellungen|speichern|laden|Mengen|Wähle|auswählen|noch)\b/;
const out={};
for(const lang of ['en','es']){await T(()=>{});await p.evaluate(l=>{setLang(l);closeSheet()},lang);
const pages=[()=>tab('lager'),()=>tab('rez'),()=>go('stat'),()=>{tab('rez');rzStatSheet()},()=>{tab('rez');rzOpen(S.rez[0].id)},()=>{tab('rez');rzEdit(null)}];
const sheets=[()=>{tab('lager');sheetMehr()},()=>{tab('rez');sheetMehr()},()=>sheetAppSet(),()=>sheetLagerSet(),()=>sheetRzSet(),()=>sheetLabels(),()=>sheetImport(),()=>sheetExport(),()=>sheetRzImport(),()=>sheetRzExport('pub'),()=>sheetRzExport('data'),()=>sheetRzPub('card'),()=>sheetRzPub('json'),()=>sheetBackup(),()=>sheetHilfe(),()=>sheetInfo()];
const res=new Set();
for(const f of [...pages,...sheets]){await T(f);await p.waitForTimeout(150);(await p.evaluate(re=>{const root=document.getElementById('app');const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const o=[];let n;while(n=w.nextNode()){const e=n.parentElement;if(!e||e.closest('.nm,textarea,script,style'))continue;const s=n.nodeValue.trim();if(s.length>3&&new RegExp(re).test(s))o.push(s.slice(0,110))}return o},DE.source)).forEach(s=>res.add(s));}
out[lang]=[...res]}
await p.evaluate(()=>setLang('de'));
console.log(JSON.stringify(out,null,0));console.log(errs);await b.close()})();
