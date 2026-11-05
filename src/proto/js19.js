
/* =====================================================================
   Rezeptbuch v1 (js19: Editor, Versionen, Werkbank, Chargen, Druck)
   ===================================================================== */
const RZF2={zweck:'Einsatzzweck',ph:'Ziel-pH',ergibt:'Ergibt',zeit:'Zeitaufwand',grad:'Schwierigkeit'};
const RZGRAD=['leicht','mittel','anspruchsvoll'];

/* ---------- Editor ---------- */
function rzEdit(id,ver){const r=id?rzGet(id):null;const bn=r?(ver||rzCurV(r).n):0;
RE={id:id||null,base:bn,d:r?rzClone(rzVer(r,bn).d):rzEmpty(),dirty:false};
if(R.name==='reze')R={name:'reze',id:id||null};else{stack.push(R);R={name:'reze',id:id||null}}draw()}
const rzPc=(z,sum)=>sum>0&&z.g>0?nf((+z.g)/sum*100,1)+' %':'';
function rzEd(){const m=$('#main');const st=m.scrollTop;const d=RE.d;const sum=rzSum(d);
const eck=(d.zweck||d.ph||d.ergibt||d.zeit||d.grad);
m.innerHTML=`<label class="fld" style="margin-top:0"><span>Rezeptname</span><input id="re_name" class="rz-nameinp" value="${esc(d.name)}" placeholder="z. B. Körperbutter" oninput="rzF('name',this.value)"></label>
<details class="acc" ${eck?'open':''}><summary>Eckdaten <small>optional</small></summary><div class="in">
<label class="fld"><span>Einsatzzweck</span><input value="${esc(d.zweck)}" oninput="rzF('zweck',this.value)" placeholder="z. B. Körperpflege, Handcreme"></label>
<div class="two"><label class="fld"><span>Ziel-pH</span><input value="${esc(d.ph)}" oninput="rzF('ph',this.value)" placeholder="z. B. 5,5"></label><label class="fld"><span>Zeitaufwand</span><input value="${esc(d.zeit)}" oninput="rzF('zeit',this.value)" placeholder="z. B. 45 min"></label></div>
<label class="fld"><span>Ergibt</span><input value="${esc(d.ergibt)}" oninput="rzF('ergibt',this.value)" placeholder="z. B. 3 Tiegel"></label>
<div class="fld"><span>Schwierigkeit</span><div class="tb" style="margin-top:0;gap:6px">${RZGRAD.map(g=>`<button type="button" class="pill ${d.grad===g?'on':''}" style="width:auto;height:auto" onclick="rzF('grad','${d.grad===g?'':g}');rzEd()">${g}</button>`).join('')}</div></div></div></details>
<div class="cap" style="margin:18px 0 8px">Zutaten <span style="text-transform:none;letter-spacing:0;font-weight:400">in der Reihenfolge der Verwendung</span></div>
${d.phasen.map((p,pi)=>`<div class="card rz-ph" id="rzph_${pi}"><div class="rz-phh">${p.typ?`<span class="rz-badge">${p.typ}</span>`:''}<input value="${esc(p.name)}" placeholder="Name der Phase" oninput="rzPh(${pi},this.value)"><button class="ib" style="width:36px;height:36px" onclick="rzPhMenu(${pi})" aria-label="Phase">${ic('more')}</button></div>
${p.z.map((z,zi)=>`<div class="rz-zr"><button class="rz-zn" onclick="rzZMenu(${pi},${zi})"><span class="nm">${esc(rzName(z))||'Zutat wählen'}</span>${rzHave(z).k==='nein'?'<small class="amb">nicht im Lager</small>':''}</button><input class="rz-g" id="rzg_${pi}_${zi}" inputmode="decimal" value="${z.g?rzIv(z.g):''}" placeholder="0" oninput="rzZg(${pi},${zi},this.value)"><span class="rz-u">g</span><span class="rz-pc" id="pc_${pi}_${zi}">${rzPc(z,sum)}</span></div>`).join('')}
<button class="lnk" style="padding:10px 14px" onclick="rzPickZ(${pi},-1)">+ Zutat</button></div>`).join('')}
<div class="rz-sumline"><span>Summe</span><b id="rzsumE">${nf(sum,2)} g</b></div>
<div class="tb" style="gap:8px;flex-wrap:wrap"><button class="pill" style="width:auto;height:auto" onclick="rzAddPhase()">+ Phase</button>${sum>0&&Math.abs(sum-100)>0.001?`<button class="pill" style="width:auto;height:auto" onclick="rzNorm100()">Auf 100 g umrechnen</button>`:''}</div>
<div class="cap" style="margin:22px 0 8px">Ablauf und Hinweise <span style="text-transform:none;letter-spacing:0;font-weight:400">optional</span></div>
${d.mod.map((x,mi)=>`<details class="acc" ${x.o?'open':''} ontoggle="rzModO(${mi},this.open)"><summary><span>${ic(RZMT[x.t][1],'var(--pri)',18)} ${x.t==='schritt'?'Schritt '+d.mod.slice(0,mi+1).filter(y=>y.t==='schritt').length:RZMT[x.t][0]}${x.titel?` <small class="nm">${esc(x.titel)}</small>`:''}</span></summary><div class="in">
<label class="fld" style="margin-top:0"><span>Titel</span><input value="${esc(x.titel)}" oninput="rzMod(${mi},'titel',this.value)" placeholder="${x.t==='schritt'?'z. B. Erhitzen':'Überschrift'}"></label>
<label class="fld"><span>Text</span><textarea oninput="rzMod(${mi},'text',this.value)" placeholder="Zwei, drei Sätze reichen.">${esc(x.text)}</textarea></label>
<div class="rz-lk" style="justify-content:flex-end"><button class="lnk" onclick="rzModMove(${mi},-1)">Nach oben</button><button class="lnk" onclick="rzModMove(${mi},1)">Nach unten</button><button class="lnk" style="color:var(--err)" onclick="rzModDel(${mi})">Entfernen</button></div></div></details>`).join('')}
<div class="tb"><button class="pill" style="width:auto;height:auto" onclick="rzAddMod()">+ Modul</button></div><div style="height:70px"></div>`;
m.scrollTop=st;
const v=$('#view');const old=document.getElementById('rzbar');if(old)old.remove();
v.insertAdjacentHTML('beforeend',`<div class="rz-bar" id="rzbar"><button class="btn sec" onclick="back()">Abbrechen</button><button class="btn" onclick="rzSave()">Speichern</button></div>`)}
function rzF(f,v){RE.d[f]=v;RE.dirty=true}
function rzPh(pi,v){RE.d.phasen[pi].name=v;RE.dirty=true}
function rzModO(mi,o){if(RE&&RE.d.mod[mi])RE.d.mod[mi].o=o}
function rzMod(mi,f,v){RE.d.mod[mi][f]=v;RE.dirty=true}
function rzZg(pi,zi,v){const n=num(v);RE.d.phasen[pi].z[zi].g=n>0?n:0;RE.dirty=true;rzPcAll()}
function rzPcAll(){const d=RE.d,sum=rzSum(d);d.phasen.forEach((p,pi)=>p.z.forEach((z,zi)=>{const e=document.getElementById('pc_'+pi+'_'+zi);if(e)e.textContent=rzPc(z,sum)}));const s=document.getElementById('rzsumE');if(s)s.textContent=nf(sum,2)+' g'}
function rzNorm100(){const d=RE.d,sum=rzSum(d);if(!(sum>0))return;const k=100/sum;d.phasen.forEach(p=>p.z.forEach(z=>z.g=Math.round(z.g*k*1000)/1000));RE.dirty=true;rzEd()}
function rzAddPhase(){const used=RE.d.phasen.map(p=>p.typ);const o=['A','B','C','D'].map(t=>`<div class="row" style="padding:0 2px" onclick="rzNewPhase('${t}')"><span class="rz-badge">${t}</span><div class="t"><b>${RZPH[t]}</b>${used.includes(t)?'<div class="s">schon vorhanden</div>':''}</div></div>`).join('');
openSheet(`<h2>Phase hinzufügen</h2>${o}<div class="row" style="padding:0 2px" onclick="rzNewPhase('')"><span class="rz-badge" style="background:var(--muted);color:var(--sub)">+</span><div class="t"><b>Eigene Phase</b></div></div>`)}
function rzNewPhase(t){const d=RE.d;const only=d.phasen.length===1&&!d.phasen[0].z.length&&!d.phasen[0].typ&&d.phasen[0].name==='Zutaten';
const p={id:uid(),typ:t,name:t?'Phase '+t+' · '+RZPH[t]:'Neue Phase',z:[]};if(only)d.phasen[0]=p;else d.phasen.push(p);RE.dirty=true;closeSheet();rzEd()}
function rzPhMenu(pi){const n=RE.d.phasen.length;openSheet(`<h2>${esc(RE.d.phasen[pi].name)||'Phase'}</h2>${pi>0?`<div class="row" onclick="rzPhMove(${pi},-1)"><div class="t"><b>Nach oben</b></div></div>`:''}${pi<n-1?`<div class="row" onclick="rzPhMove(${pi},1)"><div class="t"><b>Nach unten</b></div></div>`:''}${n>1||RE.d.phasen[pi].z.length?`<div class="row" onclick="rzPhDel(${pi})"><div class="t"><b style="color:var(--err)">Phase entfernen</b></div></div>`:''}`)}
function rzPhMove(pi,dr){const a=RE.d.phasen;const j=pi+dr;if(j<0||j>=a.length)return;[a[pi],a[j]]=[a[j],a[pi]];RE.dirty=true;closeSheet();rzEd()}
function rzPhDel(pi){const p=RE.d.phasen[pi];const f=()=>{RE.d.phasen.splice(pi,1);if(!RE.d.phasen.length)RE.d.phasen.push({id:uid(),typ:'',name:'Zutaten',z:[]});RE.dirty=true;rzEd()};
if(p.z.length)rzAsk('Phase entfernen?','Die Phase und ihre '+p.z.length+' Zutat'+(p.z.length>1?'en':'')+' werden aus diesem Entwurf entfernt.','Entfernen',f);else{closeSheet();f()}}
function rzZMenu(pi,zi){const z=RE.d.phasen[pi].z[zi];const n=RE.d.phasen[pi].z.length;
openSheet(`<h2 class="nm">${esc(rzName(z))}</h2><div class="row" onclick="closeSheet();rzPickZ(${pi},${zi})"><div class="t"><b>Andere Zutat wählen</b></div></div>${zi>0?`<div class="row" onclick="rzZMove(${pi},${zi},-1)"><div class="t"><b>Nach oben</b></div></div>`:''}${zi<n-1?`<div class="row" onclick="rzZMove(${pi},${zi},1)"><div class="t"><b>Nach unten</b></div></div>`:''}<div class="row" onclick="rzZDel(${pi},${zi})"><div class="t"><b style="color:var(--err)">Entfernen</b></div></div>`)}
function rzZMove(pi,zi,dr){const a=RE.d.phasen[pi].z;const j=zi+dr;if(j<0||j>=a.length)return;[a[zi],a[j]]=[a[j],a[zi]];RE.dirty=true;closeSheet();rzEd()}
function rzZDel(pi,zi){RE.d.phasen[pi].z.splice(zi,1);RE.dirty=true;closeSheet();rzEd()}
let RZPK={pi:0,zi:-1};
function rzPickZ(pi,zi){const z=zi>=0?RE.d.phasen[pi].z[zi]:null;if(zi>=0&&!rzName(z)){}RZPK={pi,zi};
openSheet(`<h2>Zutat wählen</h2><div class="search"><span style="padding:0 6px 0 12px;display:flex">${ic('search','var(--sub)',18)}</span><input id="rzpq" placeholder="Name suchen" autocomplete="off" oninput="rzPickList()"></div><div id="rzpl" style="margin-top:6px"></div>`);rzPickList();setTimeout(()=>{const e=document.getElementById('rzpq');if(e)e.focus()},60)}
function rzPickList(){const q=FOLD(val('rzpq'));const own=S.items.filter(i=>!q||FOLD(i.name).includes(q)||FOLD(i.inci).includes(q)).sort((a,b)=>a.name.localeCompare(b.name)).slice(0,40);
const have=new Set(S.items.map(i=>i.cid).filter(Boolean));const cat=q.length>=2?CAT.filter(c=>!have.has(c.id)&&FOLD(c.n).includes(q)).slice(0,8):[];
const box=document.getElementById('rzpl');if(!box)return;
box.innerHTML=own.map(i=>`<div class="hit" onclick="rzSetZ('i','${i.id}')"><b class="nm">${esc(i.name)}</b><div class="s">${esc(i.kat||'')} · ${i.unk?'Menge unbekannt':fmt(i.total,i.kind)}</div></div>`).join('')
+cat.map(c=>`<div class="hit" onclick="rzSetZ('c','${c.id}')"><b class="nm">${esc(c.n)}</b><div class="s">Katalog · nicht im Lager</div></div>`).join('')
+(q?`<div class="hit" onclick="rzSetZ('t')"><b>„<span class="nm">${esc(val('rzpq').trim())}</span>“ als freien Text verwenden</b><div class="s">ohne Lagerbezug, z. B. Wasser</div></div>`:'')
+(!own.length&&!q?'<div class="s" style="padding:12px 2px">Dein Lager ist noch leer. Tippe einen Namen, um etwas aus dem Katalog zu wählen.</div>':'')}
function rzSetZ(k,id){const d=RE.d,p=d.phasen[RZPK.pi];let z,zi=RZPK.zi;if(zi>=0)z=p.z[zi];else{z={id:uid(),item:'',cid:'',name:'',g:0};p.z.push(z);zi=p.z.length-1}
if(k==='i'){const i=getI(id);z.item=i.id;z.cid=i.cid||'';z.name=i.name}else if(k==='c'){const c=CM[id];z.item='';z.cid=c.id;z.name=c.n}else{const t=val('rzpq').trim();if(!t)return;z.item='';z.cid='';z.name=t}
RE.dirty=true;closeSheet();rzEd();const e=document.getElementById('rzg_'+RZPK.pi+'_'+zi);if(e&&!z.g)e.focus()}
function rzAddMod(){openSheet(`<h2>Modul hinzufügen</h2><div class="vt" style="flex-wrap:wrap;gap:8px">${Object.keys(RZMT).map(k=>`<button type="button" style="flex:0 0 calc(33.3% - 6px)" onclick="rzNewMod('${k}')">${ic(RZMT[k][1],'currentColor',26)}${RZMT[k][0]}</button>`).join('')}</div>
<div class="row" style="padding:0 2px;margin-top:10px" onclick="rzAblauf()"><div class="t"><b>Standard-Ablauf einfügen</b><div class="s">${RZABL.length} Schritte zum Ausfüllen: ${esc(RZABL.join(', '))}</div></div></div>`)}
function rzNewMod(t){RE.d.mod.push({id:uid(),t,titel:'',text:'',o:true});RE.dirty=true;closeSheet();rzEd()}
function rzAblauf(){RZABL.forEach(x=>RE.d.mod.push({id:uid(),t:'schritt',titel:x,text:'',o:false}));RE.dirty=true;closeSheet();rzEd()}
function rzModMove(mi,dr){const a=RE.d.mod;const j=mi+dr;if(j<0||j>=a.length)return;[a[mi],a[j]]=[a[j],a[mi]];RE.dirty=true;rzEd()}
function rzModDel(mi){RE.d.mod.splice(mi,1);RE.dirty=true;rzEd()}

/* ---------- Speichern als neue Version ---------- */
function rzClean(d){const c=rzClone(d);c.name=(c.name||'').trim();c.phasen.forEach(p=>{p.z=p.z.filter(z=>rzName(z).trim()||z.g>0)});c.mod=c.mod.filter(m=>(m.titel||'').trim()||(m.text||'').trim()).map(m=>{delete m.o;return m});return c}
const rzNorm=d=>JSON.stringify(Object.assign({},d,{mod:d.mod.map(m=>{const x=Object.assign({},m);delete x.o;return x})}));
function rzMap(d){const m={};d.phasen.forEach(p=>p.z.forEach(z=>{const n=rzName(z);if(!n)return;const k=z.item||(z.cid?'c'+z.cid:'n'+FOLD(z.name));(m[k]=m[k]||{n,p:0}).p+=(+z.g||0)}));return m}
function rzDiff(a,b){const L=[];if(a.name!==b.name)L.push('Name: '+a.name+' → '+b.name);const A=rzMap(a),B=rzMap(b);
Object.keys(B).forEach(k=>{if(!A[k])L.push('+ '+B[k].n+' '+nf(B[k].p,2)+' g');else if(Math.abs(A[k].p-B[k].p)>=0.005)L.push(B[k].n+': '+nf(A[k].p,2)+' → '+nf(B[k].p,2)+' g')});
Object.keys(A).forEach(k=>{if(!B[k])L.push('− '+A[k].n)});
const ka=Object.keys(A).filter(k=>B[k]).join(),kb=Object.keys(B).filter(k=>A[k]).join();if(ka!==kb)L.push('Reihenfolge der Zutaten geändert');
if(a.phasen.map(p=>p.name).join('|')!==b.phasen.map(p=>p.name).join('|'))L.push('Phasen geändert');
const s=m=>m.t+'\n'+m.titel+'\n'+m.text;const sa=a.mod.map(s);
b.mod.forEach(m=>{if(!sa.includes(s(m))){const nm=m.titel||RZMT[m.t][0];L.push((a.mod.some(o=>o.t===m.t&&o.titel===m.titel)?'Geändert: ':'Neu: ')+nm)}});
a.mod.forEach(m=>{if(!b.mod.some(o=>o.t===m.t&&o.titel===m.titel))L.push('Entfernt: '+(m.titel||RZMT[m.t][0]))});
Object.keys(RZF2).forEach(f=>{if((a[f]||'')!==(b[f]||''))L.push('Eckdaten: '+RZF2[f])});return L}
function rzSave(){const d=rzClean(RE.d);if(!d.name){toast('Bitte einen Rezeptnamen eingeben');const e=document.getElementById('re_name');if(e)e.focus();return}
if(!d.phasen.some(p=>p.z.length)){toast('Bitte mindestens eine Zutat eintragen');return}
const r=RE.id?rzGet(RE.id):null;const prev=r?rzCurV(r).d:null;
if(prev&&rzNorm(prev)===rzNorm(d)){toast('Keine Änderung zum Speichern');return}
let diff=prev?rzDiff(prev,d):[];if(prev&&!diff.length)diff=['Mengenbasis oder Anordnung angepasst'];
RE.pending={d,diff};const n=r?rzCurV(r).n+1:1;
openSheet(`<h2>${r?'Neue Version v'+n:'Rezept speichern'}</h2>${diff.length?`<div class="cap">Das hat sich geändert</div><div class="rz-diff nm">${diff.slice(0,10).map(x=>`<div>${esc(x)}</div>`).join('')}${diff.length>10?`<div class="s">und ${diff.length-10} weitere</div>`:''}</div>`:''}
<label class="fld"><span>${r?'Was hast du geändert oder ausprobiert?':'Notiz zur ersten Fassung'}</span><textarea id="rn" placeholder="${r?'z. B. weniger Öl, damit es besser einzieht':'optional'}"></textarea></label>
<div class="hint">Jede Speicherung bleibt als eigene Version erhalten. Du kannst später jede Version wieder öffnen.</div>
<div class="btns"><button class="btn" onclick="rzDoSave()">${r?'Als v'+n+' speichern':'Speichern'}</button><button class="btn sec" onclick="closeSheet()">Zurück</button></div>`)}
function rzDoSave(){const {d,diff}=RE.pending;const note=val('rn').trim();let r=RE.id?rzGet(RE.id):null;const now=new Date().toISOString();
if(!r){r={id:uid(),created:now,vers:[]};rzAll().push(r)}
const n=r.vers.length?rzCurV(r).n+1:1;r.vers.push({n,date:now,note:note||(n===1?'Erste Fassung':''),diff:n===1?[]:diff,d,from:RE.base||0,st:''});
save();const id=r.id;RE=null;closeSheet();stack=[{name:'rez',id:null}];R={name:'rezv',id,ver:0};RC={id:null,ver:0,total:0,anchor:null};draw();toast(n===1?'Rezept gespeichert':'Version v'+n+' gespeichert')}

/* ---------- Versionen ---------- */
function rzVerl(){const r=rzGet(R.id);if(!r){tab('rez');return}const m=$('#main');const cur=rzCurV(r);
m.innerHTML=`<div class="rz-t nm" style="font-size:1.25rem">${esc(cur.d.name)}</div><div class="s">${r.vers.length} Version${r.vers.length>1?'en':''}</div><div style="margin-top:12px">${r.vers.slice().reverse().map(v=>{const nc=rzChgAll().filter(c=>c.rez===r.id&&c.ver===v.n).length;
return `<div class="card rz-v" style="margin-bottom:10px"><div class="rz-vh"><b>v${v.n}</b><span class="s">${dde(v.date.slice(0,10))} ${v.date.slice(11,16)}</span>${v.n===cur.n?'<span class="badge">aktuell</span>':''}${v.st==='fav'?'<span class="badge">Favorit</span>':''}${v.st==='bad'?'<span class="badge u">verworfen</span>':''}${nc?`<span class="badge">${nc}× gemischt</span>`:''}</div>
${v.note?`<div class="nm" style="margin-top:6px">${esc(v.note)}</div>`:''}${v.from&&v.from!==v.n-1?`<div class="s" style="margin-top:4px">aufbauend auf v${v.from}</div>`:''}
${v.diff&&v.diff.length?`<div class="rz-diff nm">${v.diff.slice(0,6).map(x=>`<div>${esc(x)}</div>`).join('')}${v.diff.length>6?`<div class="s">und ${v.diff.length-6} weitere</div>`:''}</div>`:''}
<div class="rz-lk"><button class="lnk" onclick="rzOpen('${r.id}',${v.n})">Ansehen</button><button class="lnk" onclick="rzEdit('${r.id}',${v.n})">Als Ausgangspunkt bearbeiten</button>${v.n!==cur.n?`<button class="lnk" onclick="rzDiffSheet('${r.id}',${v.n})">Unterschied zur aktuellen</button>`:''}<button class="lnk" onclick="rzMarkMenu('${r.id}',${v.n})">Markieren</button></div></div>`}).join('')}</div>`}
function rzDiffSheet(id,n){const r=rzGet(id);const a=rzVer(r,n).d,b=rzCurV(r).d;const L=rzDiff(a,b);
openSheet(`<h2>v${n} → v${rzCurV(r).n}</h2><div class="rz-diff nm" style="border:0;padding:0">${L.length?L.map(x=>`<div>${esc(x)}</div>`).join(''):'<div class="s">Kein Unterschied.</div>'}</div>`)}
function rzMarkMenu(id,n){const v=rzVer(rzGet(id),n);openSheet(`<h2>Version v${n} markieren</h2><div class="row" onclick="rzMark('${id}',${n},'fav')"><div class="t"><b>Favorit</b><div class="s">Die Version, die dir am besten gefällt</div></div>${v.st==='fav'?ic('check','var(--pri)',18):''}</div><div class="row" onclick="rzMark('${id}',${n},'bad')"><div class="t"><b>Verworfen</b><div class="s">Nicht weiterverfolgen</div></div>${v.st==='bad'?ic('check','var(--pri)',18):''}</div>${v.st?`<div class="row" onclick="rzMark('${id}',${n},'')"><div class="t"><b>Markierung entfernen</b></div></div>`:''}`)}
function rzMark(id,n,st){const v=rzVer(rzGet(id),n);v.st=v.st===st?'':st;save();closeSheet();rzVerl()}

/* ---------- Werkbank (Mischen) ---------- */
function rzMischStart(id,vn){stack.push(R);R={name:'misch',id,ver:vn};RM=null;draw()}
function rzMisch(){const r=rzGet(R.id);if(!r){tab('rez');return}const v=rzVer(r,R.ver);const d=v.d;
if(!RM||RM.id!==r.id||RM.ver!==v.n){RM={id:r.id,ver:v.n,total:(RC.id===r.id&&RC.ver===v.n)?RC.total:(Math.round(rzSum(d)*100)/100||100),ist:{},done:{},steps:{},touched:false};rzWake(true)}
const m=$('#main');const steps=d.mod.filter(x=>x.t==='schritt');
m.innerHTML=`<div class="rz-t nm" style="font-size:1.3rem">${esc(d.name)}</div><div class="s">Version ${v.n} · Mischen</div>
<div class="card" style="padding:12px 14px;margin-top:12px"><label class="fld" style="margin:0"><span>Gesamtmenge (g)</span><input id="rm_tot" inputmode="decimal" value="${rzIv(RM.total)}" oninput="rmTot(this.value)"></label></div>
<div class="rz-prog" id="rm_prog"></div><div id="rm_list"></div>
${steps.length?`<div class="cap" style="margin:18px 0 8px">Arbeitsschritte</div><div class="card">${steps.map((x,n)=>`<label class="rm-s"><input type="checkbox" ${RM.steps[x.id]?'checked':''} onchange="rmStep('${x.id}',this.checked)"><div><b class="nm">${n+1}. ${esc(x.titel||'Schritt')}</b>${x.text?`<div class="nm" style="font-size:.9rem;white-space:pre-wrap">${esc(x.text)}</div>`:''}</div></label>`).join('')}</div>`:''}<div style="height:80px"></div>`;
rmList();
const old=document.getElementById('rzbar');if(old)old.remove();
$('#view').insertAdjacentHTML('beforeend',`<div class="rz-bar" id="rzbar"><button class="btn sec" onclick="back()">Abbrechen</button><button class="btn" onclick="rmFinish()">Fertig gemischt</button></div>`)}
function rmRows(){const r=rzGet(RM.id);const d=rzVer(r,RM.ver).d;return {d,c:rzCheck(d,RM.total)}}
function rmList(){const {d,c}=rmRows();const box=document.getElementById('rm_list');if(!box)return;
box.innerHTML=d.phasen.map((p,pi)=>`<div class="cap nm" style="margin:16px 0 8px;text-transform:none;letter-spacing:0;font-size:.9rem">${esc(p.name)}</div><div class="card">${p.z.map((z,zi)=>{const x=c.rows.find(a=>a.pi===pi&&a.zi===zi);const soll=rzR(x.need);const ist=RM.ist[z.id];
return `<div class="rm-r"><input type="checkbox" ${RM.done[z.id]?'checked':''} onchange="rmChk('${z.id}',this.checked)" aria-label="Eingewogen"><div class="t"><b class="nm">${esc(rzName(z)||'Zutat')}</b><div class="s"><span class="dot ${rzDot(x.st)}"></span>${rzStTxt(x)||'&nbsp;'}</div></div><div class="rm-soll">${rzG(soll)}<small> g</small></div><input class="rm-ist" inputmode="decimal" placeholder="${rzIv(soll)}" value="${ist!=null?rzIv(ist):''}" oninput="rmIst('${z.id}',this.value)" aria-label="Ist-Einwaage"></div>`}).join('')}</div>`).join('');rmProg()}
function rmProg(){const {d}=rmRows();const all=d.phasen.flatMap(p=>p.z);const n=all.filter(z=>RM.done[z.id]).length;const e=document.getElementById('rm_prog');if(e)e.innerHTML=`<div class="s" style="margin:12px 0 4px">${n} von ${all.length} Zutaten eingewogen</div><div class="bar" style="margin-top:0"><div style="width:${all.length?n/all.length*100:0}%"></div></div>`}
function rmTot(v){const n=num(v);if(!(n>0))return;RM.total=n;RM.ist={};rmList()}
function rmChk(zid,on){RM.done[zid]=on;RM.touched=true;rmProg()}
function rmIst(zid,v){const n=num(v);if(n>=0&&String(v).trim()!=='')RM.ist[zid]=n;else delete RM.ist[zid];RM.touched=true}
function rmStep(id,on){RM.steps[id]=on;RM.touched=true}
function rzBase(i,g){if(!i||i.unk||!(g>0))return null;if(i.kind==='w')return g;if(i.kind==='v'&&i.dens>0)return g/i.dens;return null}
function rzTake(i,g){const b=rzBase(i,g);if(b==null)return;i.total=Math.max(0,i.total-b);let ex=vsum(i)-i.total;if(ex>1e-9)for(const v of i.vessels){if(ex<=0)break;const t=Math.min(v.amount,ex);v.amount-=t;ex-=t}}
function rmFinish(){const {d,c}=rmRows();const lines=c.rows.map(x=>({x,use:RM.ist[x.z.id]!=null?RM.ist[x.z.id]:rzR(x.need)}));
const undone=lines.filter(l=>!RM.done[l.x.z.id]).length;
const prev=lines.filter(l=>l.x.item).map(l=>{const i=l.x.item;const b=rzBase(i,l.use);
if(b==null)return `<div class="rz-dl"><span class="nm">${esc(i.name)}</span><span class="s">nicht abziehbar (${i.unk?'Menge unbekannt':'Dichte fehlt'})</span></div>`;
return `<div class="rz-dl"><span class="nm">${esc(i.name)}</span><span>−${rzG(l.use)} g${b>i.total+1e-9?' <small class="amb">Lager reicht nicht</small>':''}</span></div>`}).join('');
openSheet(`<h2>Fertig gemischt</h2>${undone?`<div class="hint" style="margin:0 0 8px">${undone} Zutat${undone>1?'en sind':' ist'} noch nicht abgehakt. Es gelten die Sollwerte, wenn du keine Ist-Einwaage eingetragen hast.</div>`:''}
<div class="cap">Lagerabzug</div>${prev||'<div class="s">Keine Zutat aus dem Lager.</div>'}
<label class="chk"><input type="radio" name="rmab" value="1" checked> Menge vom Lager abziehen</label><label class="chk"><input type="radio" name="rmab" value="0"> Nur die Charge speichern, nichts abziehen</label>
<label class="fld"><span>Notiz zur Charge</span><textarea id="rmnote" placeholder="optional, z. B. Konsistenz, Duft"></textarea></label>
<div class="btns"><button class="btn" onclick="rmDone()">Charge speichern</button><button class="btn sec" onclick="closeSheet()">Zurück</button></div>`)}
function rmDone(){const {d,c}=rmRows();const r=rzGet(RM.id);const lines=c.rows.map(x=>({x,use:RM.ist[x.z.id]!=null?RM.ist[x.z.id]:rzR(x.need)}));
const ab=(document.querySelector('input[name=rmab]:checked')||{}).value==='1';const note=val('rmnote').trim();const snap=JSON.stringify(S);
const ch={id:uid(),rez:r.id,ver:RM.ver,date:new Date().toISOString(),total:RM.total,note,stars:0,abz:ab,lines:lines.map(l=>({n:rzName(l.x.z),item:l.x.item?l.x.item.id:'',soll:rzR(l.x.need),ist:l.use}))};
if(ab)lines.forEach(l=>rzTake(l.x.item,l.use));rzChgAll().push(ch);save();RM=null;rzWake(false);closeSheet();stack=[{name:'chgs',id:null}];R={name:'chg',id:ch.id};draw();
if(ab)undoOffer('Abzug vom Lager',snap,JSON.stringify(S),true);else toast('Charge gespeichert')}

/* ---------- Chargenbuch ---------- */
const rzStars=n=>'★'.repeat(n||0)+'☆'.repeat(5-(n||0));
function rzChgs(){const m=$('#main');const l=rzChgAll().slice().sort((a,b)=>a.date<b.date?1:-1);
if(!l.length){m.innerHTML=`<div class="card rz-empty"><div class="rz-t" style="margin-bottom:6px">Chargenbuch</div><div class="s" style="font-size:.92rem;line-height:1.5">Jedes Mal, wenn du ein Rezept mischst, entsteht hier eine Charge: mit Datum, den Mengen, die du wirklich eingewogen hast, deiner Bewertung und deinen Notizen.</div></div>`;return}
m.innerHTML=`<div class="card">${l.map(c=>{const r=rzGet(c.rez);return `<div class="row" onclick="stack.push(R);R={name:'chg',id:'${c.id}'};draw()"><div class="t"><b class="nm rz-rn">${esc(r?rzVer(r,c.ver).d.name:'Gelöschtes Rezept')}</b><div class="s">${dde(c.date.slice(0,10))} · v${c.ver} · ${nf(c.total)} g</div></div><span class="rz-st">${c.stars?rzStars(c.stars):''}</span></div>`}).join('')}</div>`}
function rzChg(){const c=rzChgAll().find(x=>x.id===R.id);if(!c){tab('chgs');return}const r=rzGet(c.rez);const m=$('#main');const d=r?rzVer(r,c.ver).d:null;
m.innerHTML=`<div class="rz-t nm">${esc(d?d.name:'Gelöschtes Rezept')}</div><div class="s" style="margin-top:4px">Charge vom ${dde(c.date.slice(0,10))}, ${c.date.slice(11,16)} Uhr · Version ${c.ver} · ${nf(c.total)} g · ${c.abz?'vom Lager abgezogen':'ohne Lagerabzug'}</div>
<div class="cap" style="margin:18px 0 6px">Wie ist es geworden?</div><div class="rz-stars" id="rzst">${[1,2,3,4,5].map(n=>`<button onclick="rzStar('${c.id}',${n})" aria-label="${n} Sterne">${n<=(c.stars||0)?'★':'☆'}</button>`).join('')}</div>
<label class="fld"><span>Notizen</span><textarea oninput="rzChgNote('${c.id}',this.value)" placeholder="Konsistenz, Duft, Hautgefühl, was du beim nächsten Mal ändern willst">${esc(c.note)}</textarea></label>
<div class="cap" style="margin:18px 0 6px">Eingewogen</div><div class="card">${c.lines.map(l=>`<div class="rz-dl" style="padding:8px 14px"><span class="nm">${esc(l.n)}</span><span>${rzG(l.ist)} g${Math.abs(l.ist-l.soll)>0.001?` <small class="s">Soll ${rzG(l.soll)}</small>`:''}</span></div>`).join('')}</div>
<div class="btns">${r?`<button class="btn sec" onclick="rzOpen('${r.id}',${c.ver})">Rezept ansehen</button><button class="btn sec" onclick="rzMischStart('${r.id}',${c.ver})">Noch einmal mischen</button>`:''}</div>
<div style="text-align:center;margin-top:14px"><button class="lnk" style="color:var(--err)" onclick="rzChgDel('${c.id}')">Charge löschen</button></div>`}
function rzStar(id,n){const c=rzChgAll().find(x=>x.id===id);c.stars=c.stars===n?0:n;save();const e=document.getElementById('rzst');if(e)e.innerHTML=[1,2,3,4,5].map(k=>`<button onclick="rzStar('${id}',${k})" aria-label="${k} Sterne">${k<=c.stars?'★':'☆'}</button>`).join('')}
let rzNT=null;function rzChgNote(id,v){const c=rzChgAll().find(x=>x.id===id);c.note=v;clearTimeout(rzNT);rzNT=setTimeout(save,500)}
function rzChgDel(id){rzAsk('Charge löschen?','Der Eintrag wird entfernt. Mengen, die vom Lager abgezogen wurden, kommen nicht zurück.','Löschen',()=>{S.chg=rzChgAll().filter(x=>x.id!==id);save();back()})}

/* ---------- Rezeptkarte drucken ---------- */
function rzPrint(id,vn){const r=rzGet(id);const v=rzVer(r,vn);const d=v.d;const sum=rzSum(d)||1;const inci=rzInci(d);
const sh=[];d.phasen.forEach(p=>p.z.forEach(z=>{const i=rzItem(z);const t=((i&&CM[i.cid]&&CM[i.cid].sh)||(i&&i.sh)||'').trim();if(t&&!sh.some(a=>a[0]===rzName(z)))sh.push([rzName(z),t])}));
const css='body{font:13px/1.5 Georgia,serif;margin:20px;color:#111}h1{font-size:24px;margin:0 0 2px}h2{font:600 11px/1 sans-serif;letter-spacing:.12em;text-transform:uppercase;margin:18px 0 6px;padding-bottom:4px;border-bottom:1px solid #888}table{border-collapse:collapse;width:100%}td{padding:3px 6px;border-bottom:1px solid #ddd;vertical-align:top}td.r{text-align:right;white-space:nowrap}.s{color:#555;font-size:11px;font-family:sans-serif}.p{font:600 12px sans-serif;margin:10px 0 2px}p{margin:2px 0 8px;white-space:pre-wrap}';
const meta=[d.zweck&&'Einsatzzweck: '+d.zweck,d.ph&&'Ziel-pH: '+d.ph,d.ergibt&&'Ergibt: '+d.ergibt,d.zeit&&'Zeitaufwand: '+d.zeit,d.grad&&'Schwierigkeit: '+d.grad].filter(Boolean).join(' · ');
const h=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(d.name)}</title><style>${css}</style></head><body><h1>${esc(d.name)}</h1><div class="s">Version ${v.n} · ${dde(v.date.slice(0,10))}${meta?' · '+esc(meta):''}</div>
<h2>Zutaten</h2>${d.phasen.map(p=>`${p.typ||d.phasen.length>1?`<div class="p">${esc(p.name)}</div>`:''}<table>${p.z.map(z=>`<tr><td>${esc(rzName(z))}</td><td class="r">${nf(z.g,2)} g</td><td class="r s">${nf(z.g/sum*100,1)} %</td></tr>`).join('')}</table>`).join('')}<div class="s" style="margin-top:4px">Summe ${nf(sum,2)} g</div>
${d.mod.length?`<h2>Ablauf und Hinweise</h2>${d.mod.map((x,n)=>`<div class="p">${x.t==='schritt'?d.mod.slice(0,n+1).filter(y=>y.t==='schritt').length+'. ':''}${esc(x.titel||RZMT[x.t][0])}${x.t!=='schritt'&&x.titel?` <span class="s">(${RZMT[x.t][0]})</span>`:''}</div>${x.text?`<p>${esc(x.text)}</p>`:''}`).join('')}`:''}
${inci.text?`<h2>INCI-Deklaration (Entwurf)</h2><p>${esc(inci.text)}</p>`:''}
${sh.length?`<h2>Hinweise zu Rohstoffen</h2>${sh.map(a=>`<div class="p">${esc(a[0])}</div><p>${esc(a[1])}</p>`).join('')}`:''}
<div class="s" style="margin-top:18px">INCIheinz · privates Rezeptbuch</div></bo`+`dy></ht`+`ml>`;
const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){toast('Drucken nicht möglich')}setTimeout(()=>f.remove(),120000)};f.srcdoc=h}
