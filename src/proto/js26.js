/* ---------- Rezeptbuch: Rezeptseite, Versionen, Dialoge in der Mitte ---------- */
{const st=document.createElement('style');st.textContent=`.dlgdim{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:60}
.dlg{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(380px,calc(100% - 28px));max-height:82vh;overflow:auto;background:var(--surf,#fff);color:var(--txt);border-radius:22px;padding:20px 18px 16px;z-index:61;box-shadow:0 12px 40px rgba(0,0,0,.28)}
.dlg h2{margin:0 36px 12px 0;font-size:1.15rem}.dlg .x{position:absolute;right:6px;top:6px;width:40px;height:40px;background:none;border:0;color:var(--sub);display:flex;align-items:center;justify-content:center;cursor:pointer}
.rz-ab{display:grid;gap:4px;margin-top:12px}.rz-ab button{background:none;border:0;padding:4px 0;display:flex;flex-direction:column;align-items:center;gap:4px;font:inherit;font-size:.68rem;color:var(--sub);cursor:pointer;min-width:0}
.rz-ab .ci{position:relative;width:44px;height:44px;border-radius:50%;background:var(--muted);color:var(--pri);display:flex;align-items:center;justify-content:center}
.rz-ab .ci i{position:absolute;top:-4px;right:-4px;font-style:normal;font-size:.62rem;min-width:18px;height:18px;border-radius:9px;background:var(--pri);color:var(--onpri);display:flex;align-items:center;justify-content:center;padding:0 4px}
.rz-ab.sm{margin-top:10px}.rz-ab.sm .ci{width:40px;height:40px}
.dtile{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:1.5px solid var(--line);background:var(--surf,#fff);border-radius:16px;padding:14px;margin-top:10px;font:inherit;color:var(--txt);cursor:pointer}
.dtile.on{border-color:var(--pri);background:var(--muted)}.dtile .ci{flex:none;width:44px;height:44px;border-radius:50%;background:var(--muted);color:var(--pri);display:flex;align-items:center;justify-content:center}
.dtile b{display:block}.dtile .s{font-size:.8rem}
.dr{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--line)}.dr:last-child{border:0}
.dr .dot{flex:none;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;margin-top:1px}
.dr .add{background:#dcefd9;color:#2e6b2a}.dr .del{background:#f6dcd7;color:#9b3326}.dr .chg{background:#f5e6c4;color:#8a5a00}.dr .inf{background:var(--muted);color:var(--sub)}
.dr .dl{font-size:.8rem;color:var(--sub)}.dd{display:inline-block;padding:1px 8px;border-radius:99px;font-size:.74rem;background:var(--muted);margin-left:6px}
.dch{display:inline-block;padding:2px 10px;border-radius:99px;background:var(--muted);font-weight:600;font-size:.82rem}`;document.head.appendChild(st)}
function closeDlg(){['dlgdim','dlg'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()})}
function openDlg(html){closeDlg();$('#app').insertAdjacentHTML('beforeend',`<div class="dlgdim" id="dlgdim" onclick="closeDlg()"></div><div class="dlg" id="dlg" role="dialog"><button class="x" onclick="closeDlg()" aria-label="Schließen">${ic('x','currentColor',22)}</button>${html}</div>`);try{if(typeof trWalk==='function'&&LANG!=='de')trWalk(document.getElementById('dlg'))}catch(e){}}
const RZIC={eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',cmp:'<path d="M7 4v14M3 14l4 4 4-4M17 20V6M13 10l4-4 4 4"/>',star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z"/>',ban:'<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',pen:'<path d="M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16z"/>'};
const rzSvg=(k,c,s)=>`<svg width="${s||22}" height="${s||22}" viewBox="0 0 24 24" fill="none" stroke="${c||'currentColor'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${RZIC[k]}</svg>`;
const rzAb=(items,cls)=>`<div class="rz-ab ${cls||''}" style="grid-template-columns:repeat(${items.length},1fr)">${items.map(a=>`<button onclick="${a[3]}" title="${a[4]||a[1]}" aria-label="${a[4]||a[1]}"><span class="ci">${a[0]}${a[2]?`<i>${a[2]}</i>`:''}</span><span>${a[1]}</span></button>`).join('')}</div>`;
/* Rezeptseite: Aktionen als Symbole wie beim Artikel */
{const rv=rzView;rzView=function(){rv();const r=rzGet(R.id);if(!r)return;const vn=R.ver||rzCurV(r).n;const nch=rzChgAll().filter(x=>x.rez===r.id).length;const lk=document.querySelector('#main .rz-lk');if(!lk)return;
lk.outerHTML=rzAb([[ic('list','currentColor',22),'Chargen',nch||'',`rzChgOf('${r.id}')`,nch?'Chargen ('+nch+')':'Noch keine Chargen'],[ic('kopieren','currentColor',22),'Als Kopie','',`rzFork('${r.id}',${vn})`,'Als neues Rezept speichern'],[ic('kamera','currentColor',22),'Foto','',`rzPhotoMenu('${r.id}')`,r.photo?'Foto ändern':'Foto hinzufügen']]).replace('class="rz-ab "','class="rz-ab" style="width:264px;max-width:100%"').replace(/style="grid-template-columns:repeat\(3,1fr\)"/,'');
const ab=document.querySelector('#main .rz-ab');if(ab)ab.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:12px;max-width:300px'}}
/* Versionen: Aktionen geordnet und platzsparend */
{const vl=rzVerl;rzVerl=function(){vl();const r=rzGet(R.id);if(!r)return;const cur=rzCurV(r);document.querySelectorAll('#main details.rz-v').forEach(d=>{const b=d.querySelector('.rz-lk button');if(!b)return;const m=/rzOpen\('([^']+)',(\d+)\)/.exec(b.getAttribute('onclick')||'');if(!m)return;const id=m[1],n=+m[2];
const it=[[rzSvg('eye'),'Ansehen','',`rzOpen('${id}',${n})`,'Diese Version ansehen'],[rzSvg('pen'),'Bearbeiten','',`rzEdit('${id}',${n})`,'Als Ausgangspunkt bearbeiten'],[ic('kopieren','currentColor',20),'Als Kopie','',`rzFork('${id}',${n})`,'Als neues Rezept speichern']];
if(n!==cur.n)it.push([rzSvg('cmp'),'Vergleichen','',`rzDiffSheet('${id}',${n})`,'Mit aktueller Version vergleichen']);it.push([rzSvg('star'),'Markieren','',`rzMarkMenu('${id}',${n})`,'Version markieren']);
d.querySelector('.rz-lk').outerHTML=rzAb(it,'sm')});try{if(LANG!=='de')trWalk($('#main'))}catch(e){}}}
/* Vergleich als grafischer Dialog in der Mitte */
function rzDiffParse(L){const o=[];const seen={};L.forEach(x=>{let m;seen[x]=(seen[x]||0)+1;if(seen[x]>1)return;
if(m=/^\+ (.+) ([\d.,]+) g$/.exec(x))o.push({g:'Zutaten',k:'add',t:m[1],d:m[2]+' g'});
else if(m=/^− (.+)$/.exec(x))o.push({g:'Zutaten',k:'del',t:m[1]});
else if(m=/^(.+): ([\d.,]+) → ([\d.,]+) g$/.exec(x)){const a=parseFloat(m[2].replace(/\./g,'').replace(',','.')),b=parseFloat(m[3].replace(/\./g,'').replace(',','.'));o.push({g:'Zutaten',k:'chg',t:m[1],d:m[2]+' → '+m[3]+' g',dl:isNaN(a+b)?'':(b>=a?'+':'−')+nf(Math.abs(b-a),2)+' g'})}
else if(m=/^Name: (.+) → (.+)$/.exec(x))o.push({g:'Rezept',k:'chg',t:'Name',d:m[1]+' → '+m[2]});
else if(m=/^Geändert: (.+)$/.exec(x))o.push({g:'Ablauf und Hinweise',k:'chg',t:m[1]});
else if(m=/^Neu: (.+)$/.exec(x))o.push({g:'Ablauf und Hinweise',k:'add',t:m[1]});
else if(m=/^Entfernt: (.+)$/.exec(x))o.push({g:'Ablauf und Hinweise',k:'del',t:m[1]});
else if(m=/^Eckdaten: (.+)$/.exec(x))o.push({g:'Eckdaten',k:'chg',t:m[1]});
else o.push({g:'Aufbau',k:'inf',t:x})});
Object.keys(seen).forEach(x=>{if(seen[x]>1){const e=o.find(y=>(y.k==='chg'&&y.g==='Ablauf und Hinweise'&&('Geändert: '+y.t)===x));if(e)e.n=seen[x]}});return o}
rzDiffSheet=function(id,n){const r=rzGet(id);const a=rzVer(r,n).d,b=rzCurV(r).d;const L=rzDiff(a,b);const o=rzDiffParse(L);const gs=[];o.forEach(x=>{if(!gs.includes(x.g))gs.push(x.g)});
const sym={add:'+',del:'−',chg:'↔',inf:'•'};
openDlg(`<h2>Versionen vergleichen</h2><div style="margin-bottom:6px"><span class="dch">v${n}</span> <span class="s">→</span> <span class="dch">v${rzCurV(r).n} aktuell</span></div>`+(o.length?gs.map(g=>`<div class="cap" style="margin:14px 0 2px">${g}</div>`+o.filter(x=>x.g===g).map(x=>`<div class="dr"><span class="dot ${x.k}">${sym[x.k]}</span><div style="min-width:0"><div class="nm">${esc(x.t)}${x.dl?`<span class="dd">${x.dl}</span>`:''}${x.n>1?`<span class="dd">${x.n}×</span>`:''}</div>${x.d?`<div class="dl">${esc(x.d)}</div>`:''}</div></div>`).join('')).join('')+`<div class="s" style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap"><span>+ neu</span><span>↔ geändert</span><span>− entfernt</span></div>`:'<div class="s" style="padding:10px 0">Kein Unterschied.</div>')+`<div class="btns"><button class="btn sec" onclick="closeDlg()">Schließen</button></div>`)}
/* Markieren als Dialog in der Mitte, zwei Möglichkeiten */
rzMarkMenu=function(id,n){const v=rzVer(rzGet(id),n);openDlg(`<h2>Version v${n} markieren</h2><button class="dtile ${v.st==='fav'?'on':''}" onclick="rzMark('${id}',${n},'fav')"><span class="ci">${rzSvg('star','currentColor',22)}</span><span><b>Als Favorit markieren</b><span class="s">${v.st==='fav'?'Markiert. Erneut tippen entfernt die Markierung.':'Die Version, die dir am besten gefällt'}</span></span></button><button class="dtile ${v.st==='bad'?'on':''}" onclick="rzMark('${id}',${n},'bad')"><span class="ci">${rzSvg('ban','currentColor',22)}</span><span><b>Als nicht verwendbar markieren</b><span class="s">${v.st==='bad'?'Markiert. Erneut tippen entfernt die Markierung.':'Nicht weiterverfolgen'}</span></span></button>`)}
rzMark=function(id,n,st){const v=rzVer(rzGet(id),n);v.st=v.st===st?'':st;save();closeDlg();rzVerl()};
