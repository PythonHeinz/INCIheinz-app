/* ---------- Alternativen im Lager vorschlagen und nach Freigabe ersetzen (js53) ----------
   Nur Vorschläge. Die Zutat ändert sich erst, wenn der Nutzer eine Alternative bestätigt. Rückgängig im Editor möglich.
   Quellen: 1 Regeln (RZALT_REGELN, erweiterbar), 2 Sonjas Tauschstoff-Liste (i.alt / TBS.sn), 3 gleiche Katalog-Kategorie. */
const RZALT_REGELN=[['xanthan','guarkern'],['zitronensaure','milchsaure']];
{const st=document.createElement('style');st.textContent=`.ralt{display:block;font-size:.74rem;font-weight:600;color:#C2570C;margin-top:2px}.ralt.sw{font-weight:400}.ralt u{text-decoration:underline}
.ra-r small{display:block;color:var(--sub);font-size:.78rem;margin-top:2px}.ra-w{color:#C2570C;font-size:.82rem;margin-top:6px}`;document.head.appendChild(st)}
const rzAltStock=i=>!!i&&(i.unk||(+i.total>0));
function rzAltMissing(z){const i=rzItem(z);if(!i)return !/^(wasser|aqua|dest|h2o|h₂o)/i.test(z.name||'');const h=rzHave(z);return h.k==='ok'&&h.g<=0}
function rzAlts(z){if(!z||!rzAltMissing(z))return [];const own=rzItem(z);const nm=FOLD(rzName(z));const out=[];const add=(i,why)=>{if(!i||i===own||!rzAltStock(i)||out.some(o=>o.i===i))return;out.push({i,why})};
RZALT_REGELN.forEach(g=>{if(g.some(k=>nm.includes(k)))S.items.forEach(i=>{const f=FOLD(i.name);if(g.some(k=>!nm.includes(k)&&f.includes(k)))add(i,'Regel')})});
let al=(own&&own.alt)||[];if(!al.length&&typeof TBS!=='undefined'){const e=TBS.sn&&TBS.sn[rzName(z)];if(e&&e.a)al=e.a}
al.filter(a=>/[A-Za-zÄÖÜäöüß]{3}/.test(a)&&a.length<60).forEach(a=>{const fa=FOLD(a);S.items.forEach(i=>{const f=FOLD(i.name);if(f===fa||(fa.length>=5&&f.includes(fa)))add(i,'Sonjas Liste')})});
const k=rzKatOf(z);if(k&&!k.s){const n0=out.length;S.items.filter(i=>(i.kat||(i.cid&&CM[i.cid]&&CM[i.cid].k))===k.k).slice(0,40).forEach(i=>{if(out.length-n0<6)add(i,'Gleiche Kategorie')})}
return out}
function rzAltTag(pi,zi,z){if(z.sw)return `<small class="ralt sw" onclick="event.stopPropagation();rzAltUndo(${pi},${zi})">ersetzt: ${esc(z.sw.von)} · <u>Zurück</u></small>`;
const n=rzAlts(z).length;return n?`<small class="ralt" onclick="event.stopPropagation();rzAltOpen(${pi},${zi})">Alternativen im Lager: ${n}</small>`:''}
function rzAltOpen(pi,zi){const z=RE.d.phasen[pi].z[zi];const L=rzAlts(z);if(!L.length){closeSheet();return}
openSheet(`<h2 class="nm">Alternativen für ${esc(rzName(z))}</h2><div class="s" style="margin-bottom:6px">Das sind nur Vorschläge. Im Rezept ändert sich erst etwas, wenn du eine Alternative bestätigst.</div>`+L.map(o=>{const h=rzHave({item:o.i.id});return `<div class="row ra-r" onclick="rzAltAsk(${pi},${zi},'${o.i.id}')"><div class="t"><b class="nm">${esc(o.i.name)}</b><small>${o.why} · ${h.k==='ok'?'im Lager '+rzG(h.g)+' g':'im Lager, Menge unbekannt'}</small></div></div>`}).join('')+`<div class="hint" style="margin-top:10px">Ob ein Tausch fachlich passt, prüfst du selbst. Mengen und Eigenschaften können sich ändern.</div>`)}
function rzAltAsk(pi,zi,id){const z=RE.d.phasen[pi].z[zi];const i=getI(id);if(!i)return;const h=rzHave({item:i.id});const low=h.k==='ok'&&z.g>0&&h.g<z.g;
openSheet(`<h2>Ersetzen?</h2><div class="nm" style="margin:6px 0"><b>${esc(rzName(z))}</b> wird durch <b>${esc(i.name)}</b> ersetzt.</div><div class="s">Die Menge bleibt ${z.g>0?rzG(z.g)+' g':'unverändert'}. Du kannst den Tausch im Editor mit „Zurück“ rückgängig machen. Gespeichert wird erst, wenn du das Rezept speicherst.</div>${low?`<div class="ra-w">Im Lager sind nur ${rzG(h.g)} g.</div>`:''}
<div class="btns" style="margin-top:14px"><button class="btn" onclick="rzAltDo(${pi},${zi},'${id}')">Ersetzen</button><button class="btn sec" onclick="rzAltOpen(${pi},${zi})">Zurück</button></div>`)}
function rzAltDo(pi,zi,id){const z=RE.d.phasen[pi].z[zi];const i=getI(id);if(!i)return;z.sw={von:rzName(z),item:z.item||'',cid:z.cid||'',name:z.name||''};z.item=i.id;z.cid=i.cid||'';z.name=i.name;RE.dirty=true;closeSheet();rzEd();toast('Ersetzt durch '+i.name)}
function rzAltUndo(pi,zi){const z=RE.d.phasen[pi].z[zi];if(!z.sw)return;z.item=z.sw.item;z.cid=z.sw.cid;z.name=z.sw.name;delete z.sw;RE.dirty=true;rzEd()}
{const o=rzZMenu;rzZMenu=function(pi,zi){o.apply(this,arguments);try{const z=RE.d.phasen[pi].z[zi];const n=rzAlts(z).length;const sh=document.querySelector('#sheet .row, .sheet .row');if(n&&sh&&!document.getElementById('rzalm')){const r=document.createElement('div');r.className='row';r.id='rzalm';r.onclick=()=>rzAltOpen(pi,zi);r.innerHTML=`<div class="t"><b>Alternativen im Lager (${n})</b><div class="s">Vorschläge, du bestätigst</div></div>`;sh.parentNode.insertBefore(r,sh);if(LANG!=='de'&&typeof trWalk==='function')trWalk(r)}}catch(e){}}}
