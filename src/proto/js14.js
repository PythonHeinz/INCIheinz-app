/* ---------- Expertenmodus: Einheiten, Dichte, Menüleiste ---------- */
const EXPU={oz:1,lb:1,'fl oz':1,in:1,ft:1};const IMPK={w:1,v:1,l:1};
Object.assign(U,{oz:{k:'w',f:28.349523125},lb:{k:'w',f:453.59237},'fl oz':{k:'v',f:29.5735295625},in:{k:'l',f:25.4},ft:{k:'l',f:304.8}});
GROUPS[0][1].push('oz','lb');GROUPS[1][1].push('fl oz');GROUPS[2][1].push('in','ft');
function fmtImp(b,k){if(k==='w')return b>=453.59237?nf(b/453.59237)+' lb':nf(b/28.349523125)+' oz';if(k==='v')return nf(b/29.5735295625)+' fl oz';if(k==='l')return b>=304.8?nf(b/304.8)+' ft':nf(b/25.4)+' in';return ''}
function impU(b,k){return k==='w'?(b>=453.59237?'lb':'oz'):k==='v'?'fl oz':(b>=304.8?'ft':'in')}
function densC(i,n,u){if(!i||!(i.dens>0)||n==null||!U[u])return null;const k=U[u].k;if(k===i.kind||!'wv'.includes(k)||!'wv'.includes(i.kind))return null;const b=n*U[u].f;return {n:k==='w'?b/i.dens:b*i.dens,u:BASE[i.kind]}}
function densB(i,n,u){const c=densC(i,n,u);return c?c.n*U[c.u].f:toB(n,u)}
const bzM=(i,m,u)=>densB(i,m,u);const bzK=(i,u)=>densC(i,1,u)?i.kind:U[u].k;
function unitSelD(i,sel){let l=unitsOf(i.kind);if(i.dens>0&&'wv'.includes(i.kind))l=l.concat(unitsOf(i.kind==='w'?'v':'w'));return l.map(u=>`<option value="${u}" ${u===sel?'selected':''}>${u}</option>`).join('')}
function expertCard(){return `<div class="card" style="padding:12px 14px;margin:8px 0 18px"><div class="cap" style="margin:0 0 2px">Einheitensystem</div>
<label class="chk" style="margin:6px 0"><input type="radio" name="us" ${!S.imp?'checked':''} onchange="setImp(0)"> Metrisch (g, ml, cm)</label>
<label class="chk" style="margin:6px 0"><input type="radio" name="us" ${S.imp?'checked':''} onchange="setImp(1)"> Imperial (oz, lb, fl oz, in, ft)</label>
<div class="s">Die Einheiten oz, lb, fl oz, in und ft stehen im Expertenmodus bei jeder Eingabe zur Verfügung. Preise je 100 g/ml bleiben metrisch.</div>
<div class="cap" style="margin:16px 0 2px">Dichte</div><div class="s">Trage beim Bearbeiten eines Rohstoffs die Dichte in g/ml ein. Dann kannst du Mengen und Preise wahlweise in g oder ml angeben, die App rechnet um.</div>
<div class="cap" style="margin:16px 0 2px">Listenspalten</div><div class="s">In der Listenansicht wählst du über den Spalten-Knopf bis zu 8 Spalten, ordnest sie und blätterst seitlich. Zusätzlich gibt es Kategorie, Form, Lieferant, Mindestmenge, EAN und Dichte.</div></div>`}

/* Listenspalten (Expertenmodus) */
Object.assign(COLS,{kat:['Kategorie',i=>esc(i.kat||'–')],form:['Form',i=>esc(i.form||'–')],lief:['Lieferant',i=>{const c=cheapest(i);return c?esc(c.x.lief):'–'}],min:['Mindest',i=>i.min>0?fmt(i.min,i.kind):'–'],ean:['EAN',i=>esc(i.ean||'–')],dens:['Dichte',i=>i.dens>0?nf(i.dens,3)+' g/ml':'–']});
const COLX=['kat','form','lief','min','ean','dens'];const CWID={kat:104,form:84,lief:80,min:70,ean:112,dens:84,menge:60,preis:64,mhd:64,ordered:64,inci:84,verw:96};
const cw=k=>CWID[k]||62;
const cellSt=k=>`flex:0 0 ${cw(k)}px!important;width:${cw(k)}px;min-width:0;display:block!important;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`;
const colW=cols=>cols.length>3?170+cols.reduce((a,k)=>a+cw(k)+8,0)+60:0;
let CCL=[];
function colsAll(){const ex=S.cols||['menge'];const all=COLORDER.concat(COLX);return ex.filter(k=>all.includes(k)).concat(all.filter(k=>!ex.includes(k)))}
function sheetColsX(){const ex=S.cols||['menge'];if(!CCL.length)CCL=colsAll().map(k=>({k,on:ex.includes(k)}));
openSheet(`<h2>Spalten anzeigen</h2><div class="s" style="margin-bottom:6px">Bis zu 8 Spalten neben dem Namen, in der Reihenfolge von oben nach unten. Mehr als drei Spalten blätterst du seitlich. Die Spalte, nach der du sortierst, wird automatisch ergänzt.</div>${CCL.map((c,n)=>`<div class="chk" style="padding:6px 0;border-bottom:1px solid var(--line);margin:0;display:flex;align-items:center;gap:8px"><input type="checkbox" ${c.on?'checked':''} onchange="CCL[${n}].on=this.checked"><span style="flex:1">${COLS[c.k][0]==='€/100'?'Preis je 100 g/ml':COLS[c.k][0]}</span><button class="ib" aria-label="Nach oben" onclick="colMv(${n},-1)" style="width:36px;height:36px">↑</button><button class="ib" aria-label="Nach unten" onclick="colMv(${n},1)" style="width:36px;height:36px">↓</button></div>`).join('')}<div class="btns"><button class="btn" onclick="saveColsX()">Fertig</button></div>`)}
function colMv(n,d){const m=n+d;if(m<0||m>=CCL.length)return;const t=CCL[n];CCL[n]=CCL[m];CCL[m]=t;sheetColsX()}
function saveColsX(){const v=CCL.filter(c=>c.on).map(c=>c.k).slice(0,8);S.cols=v.length?v:['menge'];CCL=[];save();closeSheet();lbody()}
const sheetCols0=sheetCols;
sheetCols=function(){if(S.expert){CCL=[];sheetColsX()}else sheetCols0()};

const SXP=['form','lief','min','ean','dens'];
Object.assign(SORTS,{form:['Form',1],lief:['Lieferant',1],min:['Mindestmenge',-1],ean:['EAN',1],dens:['Dichte',-1]});
const SKEY={form:i=>(i.form||'').toLowerCase()||null,lief:i=>{const c=cheapest(i);return c?String(c.x.lief).toLowerCase():null},min:i=>i.min>0?i.min:null,ean:i=>i.ean||null,dens:i=>i.dens>0?i.dens:null};

P.cols='<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>';

/* ---------- Robustheit: dauerhafter Speicher, Update-Hinweis ---------- */
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(_){}
function showUpd(res){if(document.getElementById('updb'))return;const d=document.createElement('div');d.id='updb';d.style.cssText='position:fixed;left:12px;right:12px;bottom:150px;z-index:120;background:#24332b;color:#fff;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;font-size:.9rem;box-shadow:0 6px 20px rgba(0,0,0,.25)';
d.innerHTML='<span style="flex:1">Neue Version verfügbar.</span><button style="background:#fff;color:#24332b;border:0;border-radius:10px;padding:8px 14px;font:inherit;font-weight:600">Aktualisieren</button>';
d.querySelector('button').onclick=async()=>{try{const ks=(await caches.keys()).filter(k=>k.startsWith('inciheinz-v'));for(const k of ks){const c=await caches.open(k);await c.put(new URL('index.html',location.href).href,res.clone());await c.put(new URL('./',location.href).href,res.clone())}}catch(e){}location.reload()};document.body.appendChild(d)}
async function chkUpd(){try{if(!navigator.onLine||!location.protocol.startsWith('http'))return;const r=await fetch('index.html?u='+Date.now(),{cache:'no-store'});if(!r.ok)return;const t=await r.clone().text();const m=t.match(/name="inci-build" content="([^"]+)"/);const cur=document.querySelector('meta[name="inci-build"]');if(!m||!cur||m[1]===cur.content)return;showUpd(r)}catch(e){}}
setTimeout(chkUpd,3000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chkUpd()});
