/* js48: Rezept löschen, App-Guide-Pfade als Knöpfe */
/* ---------- Rezept löschen (Rezeptansicht, ganz unten) ---------- */
function rzDelAsk(id){const r=rzGet(id);if(!r)return;
rzAsk('Rezept löschen?',`<b class="nm">${esc(rzCurV(r).d.name||'')}</b><br>Das Rezept wird mit allen Versionen entfernt. Chargen bleiben im Chargenbuch. Du kannst es danach rückgängig machen.`,'Löschen',()=>rzDelDo(id))}
function rzDelDo(id){const snap=JSON.stringify(S);S.rez=(S.rez||[]).filter(r=>r.id!==id);save();const now=JSON.stringify(S);stack=[{name:'rez',id:null}];R={name:'rez',id:null};RC={id:null,ver:0,total:0,anchor:null};draw();undoOffer('Rezept gelöscht',snap,now,true)}
{const o=rzView;rzView=function(){o.apply(this,arguments);const r=rzGet(R.id);if(!r)return;const m=$('#main');if(!m)return;
m.insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:22px 0 10px"><button class="lnk" style="color:var(--err)" onclick="rzDelAsk('${r.id}')">Rezept löschen</button></div>`)}}

/* ---------- App-Guide: Menüpfade antippbar ---------- */
function kiLinks(h){return String(h).replace(/<b>([^<]*›[^<]*)<\/b>/g,(m,p)=>`<button type="button" class="lnk kipath" style="font-weight:700;text-align:left;display:inline" data-p="${p}" onclick="kiPathGo(this.dataset.p)">${p}</button>`)}
async function kiPathGo(path){const seg=String(path).split('›').map(x=>x.trim()).filter(Boolean);if(!seg.length)return;closeSheet();
const W=()=>new Promise(x=>setTimeout(x,420));await W();
for(let i=0;i<seg.length;i++){const f=FOLD(seg[i]);const root=(i>0&&shEl())||document;
const c=[...root.querySelectorAll('button,.row,.hit,[onclick]')].filter(e=>e.offsetParent!==null&&!e.classList.contains('kipath')).map(e=>({e,t:FOLD((e.innerText||'').split('\n')[0])})).filter(x=>x.t===f||x.t.startsWith(f)).sort((a,b)=>a.t.length-b.t.length);
if(!c.length){toast('Diesen Weg finde ich hier nicht. Bitte von Hand öffnen.');return}
c[0].e.click();await W()}}
