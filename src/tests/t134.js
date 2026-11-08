const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:900}});await ctx.addInitScript(()=>{localStorage.setItem('inciheinz-fresh','1')});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const o={};
const Z=(n,g)=>({id:uid(),item:'',cid:'',name:n,g});
const kor=mk(null,{name:'Koriander ätherisch',kind:'v',total:0});kor.unk=true;S.items.push(kor);S.items.push(mk(null,{name:'Majoran süß',kind:'v',total:5}));S.items.push(mk(null,{name:'Teebaumöl',kind:'v',total:5}));
o.seedN=rzAltSeedLoad();o.keys=Object.keys(S.alts).length;
const d={name:'T',zweck:'',ph:'',ergibt:'',zeit:'',grad:'',phasen:[{id:uid(),typ:'',name:'Zutaten',pool:true,z:[]},{id:uid(),typ:'',name:'A',z:[Z('Basilikum',1),Z('Geogard 221',1)]}],mod:[]};
RE={id:null,base:0,d:rzPoolFix(d),dirty:true,photo:''};stack.push(R);R={name:'reze',id:null};draw();await W();
const z=RE.d.phasen[1].z;
o.alts=rzAlts(z[0]).map(a=>a.i.name+'/'+a.why);
rzAltOpen(1,0);await W();o.hasEditBtn=/Liste für diese Zutat bearbeiten/.test(document.getElementById('sheet').innerText);
const k=rzAltEnsure('Basilikum');o.key=k;
rzAltAdd(rzAltQ(k),'Teebaumöl');await W();o.after=rzAlts(z[0]).map(a=>a.i.name+'/'+a.why);
rzAltDel(rzAltQ(k),S.alts[k].zu.length-1);await W();o.afterDel=rzAlts(z[0]).map(a=>a.i.name);
rzAltEdit(rzAltQ(k));await W();o.edit=document.getElementById('sheet').innerText.replace(/\n+/g,' | ').slice(0,200);
rzAltPick(rzAltQ(k));await W();document.getElementById('raq').value='tee';rzAltPickList(rzAltQ(k));o.pick=document.getElementById('ral').innerText.replace(/\n+/g,' | ').slice(0,120);
closeSheet();
/* Artikel: Link */
R={name:'artikel',id:kor.id};go('artikel',kor.id);await W();o.artLink=!!document.getElementById('altlnk');
/* Seed entfernen: nicht geänderte weg, geänderte bleiben */
Object.keys(S.alts).forEach(x=>{if(S.alts[x].tb&&!S.alts[x].ed)delete S.alts[x]});o.restKeys=Object.keys(S.alts);
return o});
console.log(JSON.stringify(r,null,1));console.log('errors:',errs);await b.close()})();
