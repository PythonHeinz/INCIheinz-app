t=open('tpl5.html',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global t
    assert a in t,a[:60]
    t=t.replace(a,b,cnt)
# CSS
rep('</style>','''.tg{width:30px;height:30px;border-radius:50%;border:1.8px solid var(--line);display:flex;align-items:center;justify-content:center;flex:none;background:var(--surf)}.tg.on{background:var(--pri);border-color:var(--pri)}
.pillbtn{border:1px solid var(--line);background:var(--muted);color:var(--sub);border-radius:99px;padding:3px 10px;font-size:.7rem}
</style>''')
# icon
rep("Object.assign(P,{alarm:","Object.assign(P,{checklist:'<path d=\"M4 6l2 2 3-3M4 14l2 2 3-3M12 7h8M12 15h8\"/>',alarm:")
# unk handling
rep("function normI(i){const b={verw:'',","function normI(i){const b={unk:false,verw:'',")
rep("const low=i=>i.total<=0||(i.min>0&&i.total<=i.min);","const low=i=>i.unk?false:(i.total<=0||(i.min>0&&i.total<=i.min));")
rep("if(i.total<=0)h+=`<span title=\"leer\">","if(i.total<=0&&!i.unk)h+=`<span title=\"leer\">")
rep("else if(low(i))h+=onList(i)","else if(low(i)||i.unk&&onList(i))h+=onList(i)")
rep("if(i.total<=0&&onList(i))h+=","if(i.total<=0&&!i.unk&&onList(i))h+=")
rep("const COLS={menge:['Menge',i=>fmt(i.total,i.kind)]","const COLS={menge:['Menge',i=>i.unk?'?':fmt(i.total,i.kind)]")
rep("const GAPS={","const GAPS={unk:['Menge unbekannt',i=>i.unk],")
# article page total
rep('<div style="font-size:1.9rem;font-weight:600;letter-spacing:-.02em;color:var(--pri)">${fmt(i.total,i.kind)}</div>','<div style="font-size:1.9rem;font-weight:600;letter-spacing:-.02em;color:var(--pri)">${i.unk?\'?\':fmt(i.total,i.kind)}</div>${i.unk?\'<div class="s">Menge unbekannt – trage sie mit „Bestand ändern“ nach.</div>\':\'\'}')
rep("i.total=tb;save();draw();if(chg)","i.total=tb;i.unk=false;save();draw();if(chg)") if "i.total=tb;save();draw();if(chg)" in t else None
rep("const chg=nk!==i.kind;if(chg){i.kind=nk;i.min=0;i.bezug.forEach(b=>b.kind=nk)}i.total=tb;save();draw();if(chg)","const chg=nk!==i.kind;if(chg){i.kind=nk;i.min=0;i.bezug.forEach(b=>b.kind=nk)}i.total=tb;i.unk=false;save();draw();if(chg)") if "const chg=nk!==i.kind;if(chg){i.kind=nk;i.min=0;i.bezug.forEach(b=>b.kind=nk)}i.total=tb;save();draw();if(chg)" in t else None
rep("function used(id){const i=getI(id);i.total=0;","function used(id){const i=getI(id);i.unk=false;i.total=0;")
rep("i.total+=n*f;\nlet nr","i.unk=false;i.total+=n*f;\nlet nr")
rep("if(n>0&&$('#b3').checked)i.total+=toB(n,val('b2'));","if(n>0&&$('#b3').checked){i.total+=toB(n,val('b2'));i.unk=false}")
# persistence of list settings
rep("function lbody(){const b=$('#lb');","function syncQ(){const u={sort:Q.sort,dir:Q.dir,view:Q.view};if(JSON.stringify(u)!==JSON.stringify(S.ui||{})){S.ui=u;save()}}\nfunction lbody(){syncQ();const b=$('#lb');")
rep("S.items=(S.items||[]).map(normI);S.shop","if(S.ui){Q.sort=S.ui.sort||'name';Q.dir=S.ui.dir||1;Q.view=S.ui.view||'uebersicht'}S.items=(S.items||[]).map(normI);S.shop")
# Regal-Check: route, entry, screen
rep("else if(R.name==='scan')v.innerHTML","else if(R.name==='check')v.innerHTML=header('REGAL-CHECK',1)+`<main id=\"main\"></main>`+navb('lager'),check();\nelse if(R.name==='scan')v.innerHTML")
rep('<div class="cap" style="margin:18px 0 8px">Kategorien</div>${own.length?','<div class="card" style="margin-top:12px"><div class="row" onclick="go(\'check\',\'\')"><div class="chip">${ic(\'checklist\',\'var(--pri)\',20)}</div><div class="t"><b>Regal-Check</b><div class="s">Katalog durchgehen und markieren, was du hast</div></div>${ic(\'chev\',\'var(--sub)\',16)}</div></div>\n<div class="cap" style="margin:18px 0 8px">Kategorien</div>${own.length?')
rep('<br><button class="btn" style="margin-top:12px" onclick="sheetNeu()">Ersten Rohstoff anlegen</button>','<br><button class="btn" style="margin-top:12px" onclick="go(\'check\',\'\')">Regal-Check starten</button>')
rep("/* ---------- Rohstoff-Seite","""/* ---------- Regal-Check ---------- */
let CK={q:''};
function check(){const m=$('#main');const cat=R.id;
if(!cat){const cats={};CAT.forEach(c=>(cats[c.k]=cats[c.k]||[]).push(c));
m.innerHTML=`<div style="font-size:1.2rem;font-weight:600;letter-spacing:-.02em">Regal-Check</div><div class="s" style="margin:6px 0 14px">Wähle eine Kategorie, geh dein Regal durch und tippe auf alles, was du hast. Mengen und Details trägst du später nach.</div><div class="card">${Object.keys(cats).sort((a,b)=>a.localeCompare(b,'de')).map(k=>{const have=cats[k].filter(c=>S.items.some(i=>i.cid===c.id)).length;return `<div class="row" data-k="${esc(k)}" onclick="go('check',this.dataset.k)"><div class="chip">${cic(k,'var(--pri)',20)}</div><div class="t"><b>${esc(k)}</b></div><div class="s">${have} / ${cats[k].length}</div>${ic('chev','var(--sub)',16)}</div>`}).join('')}</div>`;return}
CK.q='';m.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><span class="chip">${cic(cat,'var(--pri)',20)}</span><div style="font-size:1.1rem;font-weight:600;letter-spacing:-.02em">${esc(cat)}</div></div><div class="search" style="margin-top:12px"><span class="ib" style="color:var(--sub);width:40px">${ic('search','var(--sub)',19)}</span><input id="ck" placeholder="In dieser Kategorie suchen …" autocomplete="off"></div><div class="s" id="cc" style="margin:10px 2px 6px"></div><div class="card" id="cl" style="overflow:hidden"></div>`;
$('#ck').oninput=e=>{CK.q=e.target.value;ckList()};ckList()}
function ckList(){const cat=R.id;const terms=CK.q.trim().toLowerCase().split(/\\s+/).filter(Boolean);let l=CAT.filter(c=>c.k===cat);const total=l.length;const have=l.filter(c=>S.items.some(i=>i.cid===c.id)).length;
if(terms.length)l=l.map(c=>({c,s:score({n:c.n,a:c.a,i:c.i,k:''},terms)})).filter(x=>x.s).sort((a,b)=>b.s-a.s||a.c.n.length-b.c.n.length).map(x=>x.c);else l.sort((a,b)=>a.n.localeCompare(b.n,'de'));
$('#cc').textContent=have+' / '+total+' im Lager';
$('#cl').innerHTML=l.map(c=>{const on=S.items.some(i=>i.cid===c.id);return `<div class="row" onclick="toggleCat('${c.id}')"><div class="t"><b>${esc(c.n)}</b><div class="s" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.i||'')}</div></div><span class="tg ${on?'on':''}">${on?ic('check','#fff',18):''}</span></div>`}).join('')||'<div style="padding:20px;text-align:center;color:var(--sub)">Nichts gefunden.</div>'}
function toggleCat(id){const own=S.items.find(i=>i.cid===id);
if(own){const bare=own.unk&&!own.vessels.length&&!own.bezug.length&&!own.verw&&!own.beschr&&!own.notiz&&!own.quelle;if(!bare){toast('Hat schon Daten – bitte auf der Rohstoff-Seite entfernen');return}S.items=S.items.filter(i=>i!==own);S.shop=S.shop.filter(s=>s.item!==own.id)}
else{S.items.push(mk(CM[id],{unk:true}))}
save();ckList()}
/* ---------- Rohstoff-Seite""")
# Expertenmodus in Einstellungen + Spanisch
rep("""onclick="addOrt()">Hinzufügen</button></div>`)}""","""onclick="addOrt()">Hinzufügen</button></div><div style="height:22px"></div><label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert?'checked':''} onchange="S.expert=this.checked;save();sheetSettings()"> Expertenmodus (Entwickleroptionen)</label>${S.expert?`<div class="card" style="padding:4px 14px;margin:8px 0 18px">${[['Einheitensystem: metrisch (SI)'],['Dichte je Rohstoff (ml ↔ g)'],['Menüleiste anpassen']].map(x=>`<div class="kv"><span>${x[0]}</span><span class="pillbtn">in Vorbereitung</span></div>`).join('')}</div>`:'<div style="height:14px"></div>'}`)}""")
open('tpl5.html','w',encoding='utf-8').write(t)
print('patched')
