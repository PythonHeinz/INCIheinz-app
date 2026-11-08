/* Regal-Check: Zuordnung zum Katalog sichtbar machen.
   "Offen" = Rohstoff ohne Katalogverknüpfung (kein i.cid), den der Nutzer nicht als eigenen bestätigt hat (i.eig).
   Start: Karte mit Zahl (oder Haken), Kategorien mit "n offen". Kategorie: offene Rohstoffe oben, "Öffnen" an jedem Lagerartikel. */
const ckOpenL=()=>S.items.filter(i=>!i.cid&&!i.eig&&i.tb!=='sonja');
function ckOpenCard(){const n=ckOpenL().length;
return n?`<div class="card" style="padding:12px 14px;margin:0 0 12px;border-left:4px solid var(--pri)"><b>${n} ${n===1?'Rohstoff ist':'Rohstoffe sind'} noch nicht dem Katalog zugeordnet</b><div class="s" style="margin-top:2px">Das sind Einträge nur mit Namen, ohne Katalogdaten wie INCI und Kategorie.</div><div class="btns" style="margin-top:8px"><button class="btn" onclick="ckOpenSheet()">Jetzt zuordnen</button></div></div>`
:`<div class="card" style="padding:12px 14px;margin:0 0 12px"><b>Alles zugeordnet</b><div class="s" style="margin-top:2px">Alle Rohstoffe im Lager sind mit dem Katalog verknüpft oder von dir als eigene bestätigt.</div></div>`}
function ckOpenSheet(){const l=ckOpenL().sort((a,b)=>a.name.localeCompare(b.name,'de'));
if(!l.length){closeSheet();toast('Alles zugeordnet');return}
openSheet(`<h2>Noch zuzuordnen</h2><div class="s" style="margin-bottom:6px">Tippe einen Rohstoff an und wähle den passenden Katalogeintrag.</div>${l.map(i=>`<div class="row" style="padding:8px 2px" onclick="ckLinkSheet('${i.id}')"><div class="t"><b>${esc(i.name)}</b><div class="s">${esc(i.kat||'')} · ohne Katalog</div></div>${ic('chev','var(--sub)',16)}</div>`).join('')}`)}
function ckLinkSheet(id){const i=getI(id);if(!i)return;const terms=i.name.toLowerCase().replace(/[()®™,]/g,' ').split(/\s+/).filter(x=>x.length>1);
const l=terms.length?CAT.map(c=>({c,s:score({n:c.n,a:c.a,i:c.i,k:''},terms)})).filter(x=>x.s).sort((a,b)=>b.s-a.s||a.c.n.length-b.c.n.length).slice(0,6).map(x=>x.c):[];
openSheet(`<h2>${esc(i.name)}</h2><div class="s">Welcher Katalogeintrag passt?</div><div class="cap" style="margin:12px 0 2px">Katalog-Treffer</div>${l.length?l.map(c=>{const used=S.items.some(x=>x.cid===c.id);return `<div class="hit" ${used?'style="opacity:.55"':`onclick="ckLinkDo('${i.id}','${c.id}')"`}><b>${esc(c.n)}</b><div class="s">Katalog · ${esc(c.k)}${used?' · schon im Lager':''}</div></div>`}).join(''):'<div class="hint" style="padding:8px 0">Kein Treffer im Katalog.</div>'}
<div class="btns col" style="margin-top:12px"><button class="btn sec" onclick="ckEigen('${i.id}')">Bleibt eigener Rohstoff</button><button class="btn sec" onclick="closeSheet();go('artikel','${i.id}')">Rohstoff öffnen und bearbeiten</button><button class="btn sec" onclick="ckOpenSheet()">Zurück</button></div>`)}
function ckLinkDo(id,cid){const i=getI(id),c=CM[cid];if(!i||!c)return;if(S.items.some(x=>x.cid===cid&&x!==i)){toast('Dieser Katalogeintrag ist schon im Lager');return}
i.cid=cid;delete i.eig;if(!i.inci&&c.i)i.inci=c.i;try{catFillOne(i)}catch(e){}save();toast('Zugeordnet: '+c.n);if(ckOpenL().length)ckOpenSheet();else closeSheet();draw()}
function ckEigen(id){const i=getI(id);if(!i)return;i.eig=true;save();toast('Bleibt eigener Rohstoff');if(ckOpenL().length)ckOpenSheet();else closeSheet();draw()}
(function(){const c0=check;check=function(){c0.apply(this,arguments);try{const m=document.getElementById('main');if(!m)return;
if(!R.id){const first=m.firstElementChild;if(first)first.insertAdjacentHTML('afterend',ckOpenCard());
const open=ckOpenL();m.querySelectorAll('.row[data-k]').forEach(r=>{const k=r.dataset.k;const n=open.filter(i=>i.kat===k).length;if(n){const s=r.querySelector('.s');if(s)s.textContent+=' · '+n+' offen'}})}}catch(e){}}})();
(function(){const l0=ckList;ckList=function(){l0.apply(this,arguments);try{const box=document.getElementById('cl');if(!box)return;const cat=R.id;
const q=CK.q.trim().toLowerCase();const open=ckOpenL().filter(i=>i.kat===cat&&(!q||i.name.toLowerCase().includes(q)));
const cc=document.getElementById('cc');if(cc&&open.length)cc.textContent+=' · '+open.length+' ohne Katalog';
box.querySelectorAll('.ckrow.on').forEach(r=>{const m=(r.getAttribute('onclick')||'').match(/toggleCat\('([^']+)'\)/);const own=m&&S.items.find(i=>i.cid===m[1]);if(!own)return;
r.insertAdjacentHTML('beforeend',`<span class="lnk" style="padding:6px 4px 6px 10px;font-size:.8rem;flex:none" onclick="event.stopPropagation();go('artikel','${own.id}')">Öffnen</span>`);const tg=r.querySelector('.tg');if(tg)r.appendChild(tg)});
if(open.length)box.insertAdjacentHTML('afterbegin',open.map(i=>`<div class="row ckrow" style="background:var(--surf2,transparent)" onclick="ckLinkSheet('${i.id}')"><div class="t"><b>${esc(i.name)}</b><div class="s">im Lager · noch ohne Katalogeintrag</div></div><span class="badge u" style="flex:none">zuordnen</span></div>`).join(''))}catch(e){}}})();
