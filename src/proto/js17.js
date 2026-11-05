/* ---------- v1.2: Suchhinweis, Sprache fürs Trennen ---------- */
const draw17=draw;draw=function(){document.documentElement.lang=LANG||'de';return draw17.apply(this,arguments)};
const lager17=lager;
lager=function(){lager17.apply(this,arguments);const q=document.getElementById('q');if(!q)return;const bar=q.closest('.search');if(!bar)return;
const rm=()=>{const h=document.getElementById('qh');if(h)h.remove()};
q.addEventListener('focus',()=>{if(q.value||document.getElementById('qh'))return;bar.insertAdjacentHTML('afterend','<div id="qh" class="hint" style="margin:6px 4px 0">Suche nach Name, INCI, Kategorie, Verwendung, Beschreibung oder Notiz</div>')});
q.addEventListener('input',()=>{if(q.value)rm()});q.addEventListener('blur',()=>setTimeout(rm,150))};

/* Lücken ruhig darstellen: kein „–“ und kein „?“ in Listenzellen */
Object.keys(COLS).forEach(k=>{const f=COLS[k][1];COLS[k][1]=i=>{const v=f(i);return (v==='–'||v==='?')?'':v}});
COLS.inci[1]=i=>i.inci?ic('check','var(--pri)',16):'';

function lagerDirty(q){return !!(Q.cat||Q.seg||q||Q.gap||Q.xcol||Q.sort!=='name'||Q.dir!==1||JSON.stringify(S.cols||['menge'])!=='["menge"]')}
function lagerReset(){Q.cat='';Q.seg=0;Q.q='';Q.gap='';Q.xcol='';Q.sort='name';Q.dir=1;S.cols=['menge'];save();lager()}
/* Tastatur: Eingabefeld in Fenstern nach oben holen, damit Treffer sichtbar bleiben */
document.addEventListener('focusin',e=>{const t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName)&&t.closest&&t.closest('#sheet')){setTimeout(()=>{try{t.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){}},350)}});
