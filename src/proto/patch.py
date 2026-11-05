import re
t=open('tpl2.html',encoding='utf-8').read()
def cut(a,b,new):
    global t
    i=t.index(a);j=t.index(b)
    t=t[:i]+new+t[j:]
# ---- CSS
t=t.replace('</style>','''
.sheet .x{position:absolute;right:8px;top:6px;width:44px;height:44px;background:none;border:0;color:var(--sub);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}
.sheet h2{padding-right:44px;min-height:30px}
#dim2{z-index:30}#sheet2{z-index:31}
.selbtn{width:100%;height:46px;border:1px solid var(--line);border-radius:12px;padding:0 12px;background:var(--surf);font:inherit;font-size:.95rem;color:var(--txt);display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;cursor:pointer}
.tb .selbtn{height:40px;font-size:.82rem;border-radius:10px;padding:0 10px;flex:1;min-width:0}
.tb .selbtn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.editbar{position:sticky;top:-14px;z-index:12;margin:-14px -16px 12px;padding:6px 8px;background:var(--surf);border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px}
.editbar span{flex:1;font-size:.88rem;font-weight:500}
.editbar .btn{height:38px}
.btn:disabled{background:var(--line);color:#9aa8a0;cursor:default}
.nm{font-weight:500;font-size:.92rem;overflow-wrap:anywhere}
.ri{display:flex;gap:7px;align-items:center;margin-top:4px}
.kv{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);font-size:.88rem}.kv:last-child{border-bottom:0}.kv span:first-child{color:var(--sub);flex:none}.kv span:last-child{text-align:right;overflow-wrap:anywhere}
.txt{padding:9px 0;border-bottom:1px solid var(--line);font-size:.88rem;white-space:pre-wrap;overflow-wrap:anywhere}.txt:last-child{border-bottom:0}
.opt{display:flex;align-items:center;gap:12px;min-height:50px;padding:0 4px;border-bottom:1px solid var(--line);cursor:pointer;font-size:.92rem}
.opt.on{color:var(--pri);font-weight:500}.opt .ck{margin-left:auto}
</style>''',1)
# ---- icons
t=t.replace("const ic=(n,c,s=22)=>","""Object.assign(P,{alarm:'<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 2M5 4L3 6M19 4l2 2"/>',pie:'<path d="M12 12V4a8 8 0 1 0 8 8z"/><path d="M14.5 3.6A8 8 0 0 1 20.4 9.5" stroke-dasharray="2 2"/>',emptyc:'<circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/>',pencil:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',check:'<path d="M5 12l5 5 9-10"/>',spark:'<path d="M12 3c.8 4.6 2.4 6.2 7 7-4.6.8-6.2 2.4-7 7-.8-4.6-2.4-6.2-7-7 4.6-.8 6.2-2.4 7-7z"/>',mix:'<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',bubbles:'<circle cx="9" cy="14" r="5"/><circle cx="17" cy="7" r="3"/>',leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19l7-7"/>',dropper:'<path d="M10 3h4M12 3v3M9 6h6v2H9zM8 8h8v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/>',flower:'<circle cx="12" cy="7.5" r="3.2"/><circle cx="16.5" cy="12" r="3.2"/><circle cx="12" cy="16.5" r="3.2"/><circle cx="7.5" cy="12" r="3.2"/>',herb:'<path d="M12 21V8M12 12c-4 0-6-2-6-5 4 0 6 2 6 5zM12 15c4 0 6-2 6-5-4 0-6 2-6 5z"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2.2-.5-1.3.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="11" r="1"/>',cube:'<path d="M12 4l7 4v8l-7 4-7-4V8z"/><path d="M12 12l7-4M12 12v8M12 12L5 8"/>',waves:'<path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"/>',mountain:'<path d="M3 19l6-10 4 6 3-4 5 8z"/>',blob:'<path d="M8 5c3-2 8 0 9 4s3 5 0 8-8 3-11 0-3-8 2-12z"/>',plusc:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',swirl:'<path d="M4 9h10a3 3 0 1 0-3-3M4 15h14a3 3 0 1 1-3 3M4 12h7"/>',soap:'<rect x="4" y="8" width="16" height="9" rx="3"/><path d="M8 12h8"/>',layers:'<path d="M12 4l9 5-9 5-9-5zM3 14l9 5 9-5"/>',flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',dots:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>'});
const CI={'Ätherisches Öl':'drop','Wirkstoff':'spark','Emulgator':'mix','Tensid':'bubbles','Pflanzenöl':'leaf','Extrakt & Tinktur':'dropper','Duftstoff (Einzelkomponente)':'flower','Kräuter & Blüten':'herb','Farbstoff & Pigment':'palette','Butter & Wachs':'cube','Hydrolat & Wasser':'waves','Konservierung':'shield','Ton & Mineral':'mountain','Gelbildner':'blob','Zusatzstoff':'plusc','Duft/Aroma':'swirl','Seifenrohstoff':'soap','Ester & Emollient':'layers','Säure/pH':'flask','Sonstiges':'dots','Eigene':'user'};
const cic=(k,c,s=20)=>ic(CI[k]||'dots',c,s);
const ic=(n,c,s=22)=>""",1)
# ---- orte in load/normalize/seed
t=t.replace("S.shop=S.shop||[];S.lief=S.lief||{}}","S.shop=S.shop||[];S.lief=S.lief||{};if(!S.orte)S.orte=['Regal','Schrank','Schublade','Kühlschrank']}")
t=t.replace("i.vessels=i.vessels.map((v,n)=>v.typ?v:{id:v.id,typ:'glas',nr:n+1,cap:v.amount,amount:v.amount});return i}","i.vessels=i.vessels.map((v,n)=>v.typ?v:{id:v.id,typ:'glas',nr:n+1,cap:v.amount,amount:v.amount,ort:v.ort||''});return i}")
t=t.replace("const V=(typ,nr,cap,amount)=>({id:uid(),typ,nr,cap,amount});","const V=(typ,nr,cap,amount,ort)=>({id:uid(),typ,nr,cap,amount,ort:ort||'Regal'});")
t=t.replace("S.lief={'Dragon Spice':{frei:50,versand:5.9},'Spinnrad':{frei:60,versand:4.9}};","S.lief={'Dragon Spice':{frei:50,versand:5.9},'Spinnrad':{frei:60,versand:4.9}};S.orte=['Regal','Schrank','Schublade','Kühlschrank'];")
# ---- sheets with X and pick layer
cut("function openSheet(html)","const val=id=>",'''function openSheet(html){closeSheet();$('#app').insertAdjacentHTML('beforeend',`<div class="dim" id="dim" onclick="closeSheet()"></div><div class="sheet" id="sheet"><button class="x" onclick="closeSheet()" aria-label="Schließen">${ic('x','currentColor',22)}</button><div class="grab"></div>${html}</div>`)}
function closeSheet(){closePick();['dim','sheet'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()})}
function closePick(){['dim2','sheet2'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()})}
let PK=null;
function pick(title,opts,cur,cb){closePick();PK={opts,cb};$('#app').insertAdjacentHTML('beforeend',`<div class="dim" id="dim2" onclick="closePick()"></div><div class="sheet" id="sheet2" style="max-height:80%"><button class="x" onclick="closePick()" aria-label="Schließen">${ic('x','currentColor',22)}</button><div class="grab"></div><h2>${esc(title)}</h2>${opts.map((o,n)=>`<div class="opt ${o[0]===cur?'on':''}" onclick="doPick(${n})">${o[2]||''}<span>${esc(o[1])}</span>${o[0]===cur?`<span class="ck">${ic('check','var(--pri)',18)}</span>`:''}</div>`).join('')}</div>`)}
function doPick(n){const o=PK.opts[n],cb=PK.cb;closePick();cb(o[0])}
''')
# ---- search + lager
cut("/* ---------- Suche ---------- */","/* ---------- Artikel ---------- */",r'''/* ---------- Suche ---------- */
const wds=s=>String(s||'').toLowerCase().split(/[^a-zäöüß0-9]+/).filter(Boolean);
const wst=(s,t)=>wds(s).some(w=>w.startsWith(t));
function score(f,terms){let tot=0;for(const t of terms){let b=0;const L=t.length;
const nm=String(f.n||'').toLowerCase();
if(nm.startsWith(t))b=100;else if(wst(f.n,t))b=80;else if(wst(f.a,t))b=60;
else if(L>=3&&wst(f.i,t))b=50;else if(L>=3&&wst(f.k,t))b=20;
else if(L>=3&&(wst(f.v,t)||wst(f.b,t)||wst(f.z,t)))b=10;else if(L>=4&&((f.v||'')+(f.b||'')+(f.z||'')).toLowerCase().includes(t))b=6;
if(!b)return 0;tot+=b}return tot}
function fields(i){const c=i.cid?CM[i.cid]:null;return {n:i.name,i:i.inci,k:i.kat,a:c?c.a:'',v:i.verw,b:i.beschr,z:i.notiz+' '+i.quelle}}
function match(i,q){const terms=q.toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return {ok:true,s:0};const f=fields(i);const s=score(f,terms);if(!s)return {ok:false};
let hit='';const t=terms.find(t=>t.length>=3&&!wst(f.n,t)&&!wst(f.i,t)&&!wst(f.a,t));
if(t){for(const [lb,tx] of [['Verwendung',i.verw],['Beschreibung',i.beschr],['Notiz',i.notiz]]){const p=String(tx||'').toLowerCase().indexOf(t);if(p>=0){hit=lb+': …'+tx.slice(Math.max(0,p-14),p+30)+'…';break}}}
return {ok:true,s,hit}}
/* ---------- Lager ---------- */
const onList=i=>S.shop.some(s=>s.item===i.id);
const needs=i=>low(i)&&!onList(i);
function lager(){const m=$('#main');const own=S.items;
const nK=own.filter(needs).length,nS=own.filter(soon).length;
const sb=(n,ico,cnt,lab)=>`<button class="${Q.seg===n?'on':''}" onclick="Q.seg=${n};lager()" aria-label="${lab}" title="${lab}">${ico}<i>${cnt}</i></button>`;
m.innerHTML=`<div class="search"><span class="ib" style="color:var(--sub);width:40px">${ic('search','var(--sub)',19)}</span><input id="q" placeholder="Rohstoff suchen …" value="${esc(Q.q)}" autocomplete="off"></div>
<div style="display:flex;gap:8px;margin-top:10px;align-items:stretch"><div class="seg" style="flex:1;margin:0"><button class="${Q.seg===0?'on':''}" onclick="Q.seg=0;lager()">Alle<i>${own.length}</i></button>${sb(1,ic('pie','currentColor',19),nK,'Knapp')}${sb(2,ic('alarm','currentColor',19),nS,'Läuft ab')}</div>
<div class="seg" style="margin:0;flex:none;width:96px"><button class="${Q.view==='uebersicht'?'on':''}" onclick="Q.view='uebersicht';lager()" aria-label="Übersicht">${ic('grid','currentColor',18)}</button><button class="${Q.view==='liste'?'on':''}" onclick="Q.view='liste';lager()" aria-label="Liste">${ic('list','currentColor',18)}</button></div></div><div id="lb"></div>`;
$('#q').oninput=e=>{Q.q=e.target.value;lbody()};lbody()}
const SORTS={name:['Name',1],menge:['Menge',1],preis:['Preis je 100 g/ml',1],ordered:['Zuletzt bestellt',-1],mhd:['Nächstes Ablaufdatum',1],kat:['Kategorie',1]};
function sortList(l,sc){if(sc&&Q.sort==='name'&&Q.dir===1)return l.slice().sort((a,b)=>(sc.get(b.id)-sc.get(a.id))||(a.name.length-b.name.length)||a.name.localeCompare(b.name,'de'));
const k=Q.sort,d=Q.dir;const key=i=>{if(k==='name')return i.name.toLowerCase();if(k==='menge')return i.total;if(k==='kat')return i.kat+i.name;if(k==='preis'){const c=cheapest(i);return c?c.p:null}if(k==='ordered')return i.ordered||null;if(k==='mhd')return i.mhd||null;return 0};
return l.slice().sort((a,b)=>{const x=key(a),y=key(b);if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return (x<y?-1:x>y?1:0)*d||a.name.localeCompare(b.name,'de')})}
function setSort(k){if(Q.sort===k)Q.dir*=-1;else{Q.sort=k;Q.dir=SORTS[k][1]}lbody()}
function pickCatFilter(){const own=S.items;const cats=[...new Set(own.map(i=>i.kat))].sort((a,b)=>a.localeCompare(b,'de'));pick('Kategorie',[['','Alle Kategorien',ic('list','var(--sub)',20)]].concat(cats.map(c=>[c,c+' ('+own.filter(i=>i.kat===c).length+')',cic(c,'var(--pri)',20)])),Q.cat,v=>{Q.cat=v;lbody()})}
function pickSort(){pick('Sortieren nach',Object.keys(SORTS).map(k=>[k,SORTS[k][0]]),Q.sort,v=>{Q.sort=v;Q.dir=SORTS[v][1];lbody()})}
function statusIcons(i){let h='';if(i.total<=0)h+=`<span title="leer">${ic('emptyc','var(--ambt)',15)}</span>`;else if(low(i))h+=onList(i)?`<span title="auf der Einkaufsliste">${ic('cart','var(--pri)',15)}</span>`:`<span title="knapp">${ic('pie','var(--ambt)',15)}</span>`;if(i.total<=0&&onList(i))h+=`<span title="auf der Einkaufsliste">${ic('cart','var(--pri)',15)}</span>`;if(soon(i))h+=`<span title="läuft ab">${ic('alarm','var(--ambt)',15)}</span>`;return h}
function lbody(){const b=$('#lb');const own=S.items;const q=Q.q.trim();
const list=Q.view==='liste'||Q.seg!==0||q||Q.cat;
if(!list){const cats={};own.forEach(i=>{(cats[i.kat]=cats[i.kat]||[]).push(i)});const nK=own.filter(needs).length,nS=own.filter(soon).length;
b.innerHTML=`<div class="card" style="margin-top:14px"><div class="cap" style="padding:12px 16px 0">Handlungsbedarf</div><div style="display:flex"><div style="flex:1;padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px" onclick="Q.seg=2;lager()">${ic('alarm','var(--ambt)',26)}<b style="font-size:1.4rem;font-weight:600">${nS}</b></div><div style="width:1px;background:var(--line);margin:8px 0"></div><div style="flex:1;padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px" onclick="Q.seg=1;lager()">${ic('pie','var(--ambt)',26)}<b style="font-size:1.4rem;font-weight:600">${nK}</b></div></div><div class="s" style="padding:0 16px 12px;display:flex;gap:14px">${'<span style="display:flex;gap:5px;align-items:center">'+ic('alarm','var(--sub)',14)+'läuft in 30 Tagen ab</span><span style="display:flex;gap:5px;align-items:center">'+ic('pie','var(--sub)',14)+'knapp, noch nicht bestellt</span>'}</div></div>
<div class="cap" style="margin:18px 0 8px">Kategorien</div>${own.length?`<div class="card">${Object.keys(cats).sort().map(k=>{const sums={};cats[k].forEach(i=>sums[i.kind]=(sums[i.kind]||0)+i.total);return `<div class="row" data-k="${esc(k)}" onclick="Q.cat=this.dataset.k;Q.view='liste';lager()"><div class="chip">${cic(k,'var(--pri)',20)}</div><div class="t"><b>${esc(k)}</b></div><div class="s">${cats[k].length} · ${Object.keys(sums).map(x=>fmt(sums[x],x)).join(' + ')}</div>${ic('chev','var(--sub)',16)}</div>`}).join('')}</div>`:`<div class="card" style="padding:20px;text-align:center;color:var(--sub)">Noch nichts im Lager.<br><button class="btn" style="margin-top:12px" onclick="sheetNeu()">Ersten Rohstoff anlegen</button></div>`}
<div class="hint" style="margin-top:14px">Tipp: Oben rechts wechselst du auf die Listenansicht mit allen Rohstoffen als sortierbare Tabelle.</div>`;return}
let l=own.filter(i=>(Q.seg===0||(Q.seg===1&&needs(i))||(Q.seg===2&&soon(i)))&&(!Q.cat||i.kat===Q.cat));
const info=new Map(),sc=new Map();if(q)l=l.filter(i=>{const r=match(i,q);info.set(i.id,r);sc.set(i.id,r.s);return r.ok});
l=sortList(l,q?sc:null);
const third=Q.sort==='ordered'?'ordered':Q.sort==='mhd'?'mhd':'preis';
const arr=k=>Q.sort===k?(Q.dir>0?' ▲':' ▼'):'';
const th3={preis:'€/100',ordered:'Bestellt',mhd:'MHD'}[third];
b.innerHTML=`<div class="tb"><button class="selbtn" onclick="pickCatFilter()">${Q.cat?cic(Q.cat,'var(--pri)',18):ic('list','var(--sub)',18)}<span style="flex:1">${Q.cat?esc(Q.cat):'Alle Kategorien'}</span></button><button class="selbtn" style="flex:0 0 38%" onclick="pickSort()"><span style="flex:1">${SORTS[Q.sort][0]}</span></button><button onclick="Q.dir*=-1;lbody()" aria-label="Richtung">${Q.dir>0?'↑':'↓'}</button></div>
<div class="s" style="margin:10px 2px 6px">${l.length} / ${own.length}${Q.cat||Q.seg||q?` · <a href="#" class="lnk" onclick="Q.cat='';Q.seg=0;Q.q='';lager();return false">Filter zurücksetzen</a>`:''}</div>
${l.length?`<div class="card" style="overflow:hidden"><div class="th"><span class="c1 ${Q.sort==='name'?'on':''}" onclick="setSort('name')">Name${arr('name')}</span><span class="c2 ${Q.sort==='menge'?'on':''}" onclick="setSort('menge')">Menge${arr('menge')}</span><span class="c3 ${Q.sort===third?'on':''}" onclick="setSort('${third}')">${th3}${Q.sort===third?arr(third):''}</span></div>${l.map(i=>{const c=cheapest(i);const tv=third==='preis'?(c?eur(per(c.x).v):'–'):third==='ordered'?(i.ordered?dde(i.ordered).slice(0,6)+i.ordered.slice(2,4):'–'):(i.mhd?dde(i.mhd).slice(0,6)+i.mhd.slice(2,4):'–');const r=info.get(i.id)||{};
return `<div class="tr" onclick="go('artikel','${i.id}')"><div class="c1"><div class="nm">${esc(i.name)}</div><div class="ri"><span title="${esc(i.kat)}">${cic(i.kat,'var(--sub)',15)}</span>${statusIcons(i)}</div>${r.hit?`<div class="s" style="color:var(--pri);margin-top:3px;overflow-wrap:anywhere">${esc(r.hit)}</div>`:''}</div><div class="c2" style="font-size:.85rem">${fmt(i.total,i.kind)}</div><div class="c3 s" style="font-size:.8rem">${tv}</div></div>`}).join('')}</div><div class="hint" style="margin-top:8px;text-align:center">Spaltenköpfe antippen zum Sortieren · die Suche findet auch deine eigenen Texte</div>`:`<div class="card" style="padding:20px;text-align:center;color:var(--sub)">Nichts gefunden.${q?`<br><button class="btn" style="margin-top:12px" onclick="sheetNeu(Q.q)">„${esc(q)}“ neu anlegen</button>`:''}</div>`}`}
''')
open('tpl3.html','w',encoding='utf-8').write(t)
