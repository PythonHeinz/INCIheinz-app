/* ---------- Import: Preise zu vorhandenen Rohstoffen + Datumsspalte ---------- */
COLMAP.datum=['datum','preisdatum','stand','erfasstam','preisstand'];
const NK=s=>FOLD(s).replace(/[^a-z0-9]/g,'');
function pDate2(v){if(typeof v==='number'||/^\d{5}(\.\d+)?$/.test(String(v).trim())){const n=Math.floor(parseFloat(v));if(n>30000&&n<80000){const d=new Date(Date.UTC(1899,11,30)+n*864e5);return d.toISOString().slice(0,10)}}return pDate(v)}
const csvPlan0=csvPlan;
csvPlan=function(rows){const p=csvPlan0(rows);if(p.error)return p;
const head=rows[0].map(h=>FOLD(h).replace(/[^a-z0-9]/g,''));const col={};Object.keys(COLMAP).forEach(k=>{for(let i=0;i<head.length;i++)if(COLMAP[k].includes(head[i])&&col[k]==null)col[k]=i});
const byN={},byE={};S.items.forEach(i=>{byN[NK(i.name)]=i;if(i.ean)byE[i.ean]=i});
p.upd=[];p.dup=0;
for(let r=1;r<rows.length;r++){const row=rows[r];const g=k=>col[k]==null?'':String(row[col[k]]==null?'':row[col[k]]).trim();
const name=g('name');if(!name)continue;const ean=g('ean').replace(/\s+/g,'');const it=byN[NK(name)]||(ean&&byE[ean])||null;if(!it)continue;
const eh=g('einheit');const u=Object.keys(U).find(x=>FOLD(x)===FOLD(eh));const mg=pNum(g('menge'));const pr=pNum(g('preis').replace(/[€\s]/g,''));if(!u||!(mg>0)||pr==null)continue;
const q=g('quelle');const lief=q&&!/^https?:/i.test(q)?q:'Import';const dt=pDate2(col.datum==null?'':row[col.datum])||today();const kind=U[u].k;
if(kind!==it.kind){p.dup++;continue}
const m=toB(mg,u);const same=it.bezug.concat(p.upd.filter(x=>x.it===it).map(x=>x.b)).some(b=>b.lief===lief&&Math.round(b.menge*1000)===Math.round(m*1000)&&Math.abs(b.preis-pr)<0.005&&b.datum===dt);
if(same){p.dup++;continue}
p.upd.push({it,b:{id:uid(),lief,nr:'',preis:pr,menge:m,kind,datum:dt}})}
return p};
sheetImpPrev=function(){const p=IMP.plan;const n=p.neu.length,u=(p.upd||[]).length;if(!n&&!u){sheetMsg('Nichts Neues','Alle '+p.schon+' Einträge sind schon im Lager.'+(p.dup?' Die Preise dazu sind ebenfalls schon vorhanden.':''));return}
const names=[...new Set((p.upd||[]).map(x=>x.it.name))];
openSheet(`<h2>Tabelle einlesen</h2><div style="font-size:1rem;font-weight:600">${n} neu, ${p.schon} schon vorhanden${u?', '+u+' Preise zum Ergänzen':''}</div><div class="s" style="margin-top:4px">Schon vorhandene Rohstoffe werden nicht verändert. Nur neue Preise (mit Datum) kommen zu den Bezugsquellen dazu.</div>
${n?`<div class="card" style="margin-top:10px;padding:4px 14px">${p.neu.slice(0,6).map(i=>`<div class="kv"><span>${esc(i.name)}</span><span class="s">${i.unk?'Menge offen':fmt(i.total,i.kind)}</span></div>`).join('')}${n>6?`<div class="s" style="padding:8px 0">… und ${n-6} weitere</div>`:''}</div>`:''}
${u?`<div class="cap" style="margin:12px 0 2px">Neue Preise für</div><div class="card" style="padding:4px 14px">${names.slice(0,6).map(nm=>`<div class="kv"><span>${esc(nm)}</span><span class="s">${p.upd.filter(x=>x.it.name===nm).length} Preise</span></div>`).join('')}${names.length>6?`<div class="s" style="padding:8px 0">… und ${names.length-6} weitere</div>`:''}</div>`:''}
<div class="btns"><button class="btn" onclick="impGo()">Übernehmen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)};
impGo=function(){const p=IMP.plan;p.neu.forEach(i=>S.items.push(i));(p.upd||[]).forEach(x=>{x.it.bezug.push(x.b)});adoptLief();save();closeSheet();tab('lager');toast(p.neu.length+' neu, '+(p.upd||[]).length+' Preise ergänzt')};

function lagerCatHits(q){const terms=q.toLowerCase().split(/\s+/).filter(Boolean);const l=CAT.map(c=>({c,s:score({n:c.n,a:c.a,i:c.i,k:''},terms)})).filter(x=>x.s&&!S.items.some(i=>i.cid===x.c.id)).sort((a,b)=>b.s-a.s||a.c.n.length-b.c.n.length).slice(0,4).map(x=>x.c);if(!l.length)return '';return `<div class="cap" style="margin:14px 0 4px;text-align:left">Vorschläge aus dem Katalog</div>`+l.map(c=>`<div class="hit" style="text-align:left" onclick="sheetNeu('${c.id}');pickHit('${c.id}')"><b>${esc(c.n)}</b><div class="s">${esc(c.k)} · zum Lager hinzufügen</div></div>`).join('')}

function catSrc(i){const c=i.cid&&CM[i.cid];if(!c||(!c.q&&!c.p))return '';if(i.inci&&c.i&&i.inci!==c.i)return `<div class="s" style="margin-top:6px">Eigene Änderung gegenüber dem Katalog.</div>`;return `<div class="s" style="margin-top:6px">${c.q?'Quelle: '+(/^https?:\/\//i.test(c.q)?`<a href="${esc(c.q)}" target="_blank" rel="noopener">${esc(c.q.replace(/^https?:\/\/(www\.)?/i,'').split('/')[0])}</a>`:esc(c.q)):''}${c.q&&c.p?' · ':''}${c.p?'geprüft am '+dde(c.p):''}</div>`}
