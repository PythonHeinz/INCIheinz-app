/* ---------- Neue Werte als Spalten, Sortierung und Lückenfinder im Lager ---------- */
function numMid(s){const m=String(s==null?'':s).replace(/,/g,'.').match(/\d+(?:\.\d+)?/g);if(!m)return null;const a=m.slice(0,2).map(parseFloat);return a.reduce((x,y)=>x+y,0)/a.length}
function densOf(i){if(i&&i.dens>0)return i.dens;const c=i&&i.cid&&CM[i.cid];return c&&c.d>0?c.d:0}
const VW={
dens:['Dichte',i=>{const d=densOf(i);return d>0?d:null},v=>nf(v,3),-1,'Dichte'],
was:['WAS %',i=>{const w=wasOf(i);return w.v===''?null:numMid(w.v)},(v,i)=>esc(String(wasOf(i).v).slice(0,14)),-1,'WAS'],
tkl:['Tensid',i=>{const t=(i.tkl||(i.cid&&CM[i.cid]&&CM[i.cid].tensidklasse)||'').toString();return t?t.toLowerCase():null},(v)=>esc(v),1,'Tensidklasse'],
sapn:['NaOH',i=>{const f=fettOf(i).sapn.v;return f===''?null:numMid(f)},(v,i)=>esc(fettOf(i).sapn.v),1,'NaOH-Bedarf'],
sapk:['KOH',i=>{const f=fettOf(i).sapk.v;return f===''?null:numMid(f)},(v,i)=>esc(fettOf(i).sapk.v),1,'Verseifungszahl'],
iod:['Jodzahl',i=>{const f=fettOf(i).iod.v;return f===''?null:numMid(f)},(v,i)=>esc(fettOf(i).iod.v),1,'Jodzahl'],
smp:['Schmelz',i=>{const f=fettOf(i).smp.v;return f===''?null:numMid(f)},(v,i)=>esc(fettOf(i).smp.v),1,'Schmelzpunkt'],
rzf:['RZF',i=>{const f=swOf(i).rzf.v;return f===''?null:numMid(f)},(v,i)=>esc(swOf(i).rzf.v),1,'Ranziditätsfaktor'],
hae:['Härte',i=>{const f=swOf(i).hae.v;return f===''?null:numMid(f)},(v,i)=>esc(swOf(i).hae.v),-1,'Härte'],
sein:['Einsatz',i=>{const f=swOf(i).sein.v;return f===''?null:String(f).toLowerCase()},(v,i)=>esc(swOf(i).sein.v),1,'Einsatz in Seife'],
spr:['Spreit',i=>{const s=i.spr!=null&&String(i.spr).trim()!==''?i.spr:(i.cid&&CM[i.cid]&&CM[i.cid].spr);return s==null||s===''?null:(numMid(s)==null?String(s).toLowerCase():numMid(s))},(v,i)=>esc(String(i.spr||'').slice(0,12)),1,'Spreitwert']};
/* Ausschlussregeln: Lücken zählen nur bei Rohstoffen, für die der Wert überhaupt sinnvoll ist */
const APPL={sapn:FZKAT,sapk:FZKAT,iod:FZKAT,smp:FZKAT,rzf:FZKAT,hae:FZKAT,sein:FZKAT,spr:['Pflanzenöl','Ester & Emollient'],was:['Tensid','Emulgator'],tkl:['Tensid','Emulgator']};
const appl=(k,i)=>!APPL[k]||APPL[k].includes(i.kat);
Object.keys(VW).forEach(k=>{const [lab,key,show,dir,full]=VW[k];
COLS[k]=[lab,i=>{const v=key(i);return v==null?'':show(v,i)}];
SORTS[k]=[full,dir];SKEY[k]=key;
if(!COLX.includes(k))COLX.push(k);if(!SXP.includes(k))SXP.push(k);CWID[k]=CWID[k]||(k==='sein'||k==='was'?90:72);
GAPS['v_'+k]=['Ohne '+full,i=>appl(k,i)&&key(i)==null]});
const VGAPS=Object.keys(VW).map(k=>'v_'+k);
/* Lückenfinder: Werte-Lücken nur im Expertenmodus, mit Anzahl (so sieht man sofort, wie viele Rohstoffe schon einen Wert haben) */
pickGap=function(){const own=S.items;const base=Object.keys(GAPS).filter(k=>!VGAPS.includes(k)&&k!=='tg_none'&&k.indexOf('t:')!==0);
const rows=[['','Kein Filter']].concat(base.map(k=>[k,GAPS[k][0]+' ('+own.filter(GAPS[k][1]).length+')']));
rows.splice(1,0,['__t','Schlagwort …'],['tg_none','Ohne Schlagwort ('+own.filter(GAPS.tg_none[1]).length+')']);
if(S.expert)rows.push(['__w','Fehlende Werte …']);
pick('Lücken finden',rows,Q.gap,v=>{if(v==='__w'){setTimeout(pickGapW,30);return}if(v==='__t'){setTimeout(pickGapT,30);return}Q.gap=v;Q.view='liste';lager()})};
function pickGapW(){const own=S.items;pick('Wert fehlt bei',VGAPS.map(k=>[k,GAPS[k][0].replace('Ohne ','')+' ('+own.filter(GAPS[k][1]).length+' ohne, '+(own.filter(i=>appl(k.slice(2),i)).length-own.filter(GAPS[k][1]).length)+' mit)']),Q.gap,v=>{Q.gap=v;Q.view='liste';const k=v.slice(2);if(COLS[k]&&!Q.xcol)Q.xcol=k;lager()})}
/* Gap-Spalte automatisch einblenden, wenn nach einem Wert gefiltert wird */
{const vc=viewCols;viewCols=function(){const r=vc.apply(this,arguments);if(S.expert&&Q.gap&&Q.gap.startsWith('v_')){const k=Q.gap.slice(2);if(COLS[k]&&!r.includes(k)){if(r.length>=8)r.pop();r.push(k)}}return r}}

/* ---------- Rezepte: Ablauf in einzelne Arbeitsschritte aufteilen (je Schritt ein Modul), Phase wenn erkennbar ---------- */
function stepParts(text){const t=String(text||'').replace(/\r/g,'').trim();if(!t)return [];
const re=/(?:^|[\s])(\d{1,2})\s*[.)]\s+(?=\S)/g;const hits=[];let m;while((m=re.exec(t))){hits.push({n:+m[1],i:m.index+(m[0].length-m[0].trimStart().length),e:re.lastIndex})}
let want=1;const lead=hits.length&&hits[0].n===2&&hits[0].i>2;if(lead)want=2;const seq=[];for(const h of hits){if(h.n===want){seq.push(h);want++}}
if(lead&&seq.length>=1){const o=[t.slice(0,seq[0].i).trim().replace(/[\s;]+$/,'')].concat(seq.map((h,k)=>t.slice(h.e,k+1<seq.length?seq[k+1].i:t.length).trim().replace(/[\s;]+$/,'')));return o.filter(Boolean)}
if(seq.length>=2&&seq[0].n===1){const pre=t.slice(0,seq[0].i).trim();const out=seq.map((h,k)=>t.slice(h.e,k+1<seq.length?seq[k+1].i:t.length).trim().replace(/[\s;]+$/,'')).filter(Boolean);if(pre&&out.length)out[0]=out[0];return out}
const ls=t.split('\n').map(x=>x.replace(/^\s*(?:schritt\s*)?\d{0,2}\s*[.)\-:•*·–]?\s*/i,'').trim()).filter(Boolean);return ls.length>=2?ls:[t]}
const PHK=[[/wasser/i,/wasser|aqua|hydro/i],[/öl|oel|fett|butter|wachs/i,/öl|oel|fett|butter|wachs|schmelz/i],[/wirkstoff|konservier|duft|abk(ü|ue)hl|zusatz/i,/wirkstoff|konservier|duft|abk(ü|ue)hl|zusatz/i]];
function stepPhase(text,phasen){if(!phasen||phasen.length<2)return '';const t=String(text);
const ex=/phase\s*([a-d])\b/i.exec(t);if(ex){const p=phasen.find(p=>p.typ===ex[1].toUpperCase());if(p)return p.name}
const hit=phasen.filter(p=>{const nm=p.name||'';return PHK.some(([a,b])=>a.test(nm)&&b.test(t))});return hit.length===1?hit[0].name:''}
function splitMods(mod,phasen){const out=[];(mod||[]).forEach(m=>{if(m&&(m.t==='schritt'||m.t==='notiz')&&!m.split){const ps=stepParts(m.text);if(m.t==='schritt'&&(ps.length>1||m.titel==='Herstellung')){const gen=!m.titel||/^(herstellung|ablauf|zubereitung|arbeitsschritt)$/i.test(m.titel);ps.forEach(tx=>{const ph=stepPhase(tx,phasen);out.push(Object.assign({},m,{id:uid(),titel:ph||(gen?'':m.titel),text:tx,split:1}))});return}}
out.push(m)});return out}
try{DEMO.rez.forEach(r=>{r.mod=splitMods(r.mod,r.phasen)})}catch(e){}
function rzMigSteps(){if(!S||S.migSteps||!Array.isArray(S.rez))return;let n=0;S.rez.filter(r=>r.demo).forEach(r=>(r.vers||[]).forEach(v=>{if(v.d&&Array.isArray(v.d.mod)){const a=v.d.mod.length;v.d.mod=splitMods(v.d.mod,v.d.phasen);n+=v.d.mod.length-a}}));S.migSteps=1;if(n)save()}
{const l=load;load=async function(){const r=await l.apply(this,arguments);try{rzMigSteps()}catch(e){}return r}}
{const p=rzParse;rzParse=function(){const r=p.apply(this,arguments);try{if(r&&r.d)r.d.mod=splitMods(r.d.mod,r.d.phasen)}catch(e){}return r}}

/* ---------- Artikelseite: Überschriften der Freitextfelder hierarchisch klar, Hilfetext immer in zweiter Zeile ---------- */
function fldHead(el,bold){if(!el||el.dataset.fh)return;const t=el.textContent.trim();const k=t.indexOf(' · ');const ti=k<0?t:t.slice(0,k),hi=k<0?'':t.slice(k+3);
el.dataset.fh=1;el.innerHTML=`<span style="display:block;font-size:.74rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ink,inherit)">${esc(ti)}</span>${hi?`<span style="display:block;font-size:.78rem;font-weight:400;text-transform:none;letter-spacing:0;color:var(--sub);margin-top:2px">${esc(hi)}</span>`:''}`}
{const a2=artikel;artikel=function(i){a2.apply(this,arguments);try{
if(R.edit){['f_beschr','f_verw','f_notiz'].forEach(id=>{const e=document.getElementById(id);const l=e&&e.closest('label');const sp=l&&l.querySelector('span');if(sp)fldHead(sp)})}
else{document.querySelectorAll('#af2 .txt').forEach(b=>{const s=b.querySelector(':scope > .s');if(!s)return;const t=s.textContent.trim();if(!/^(Beschreibung|Verwendung|Notiz)/.test(t))return;fldHead(s);s.style.marginBottom='4px';if(/^Notiz/.test(t))b.style.fontWeight='600'})}
if(LANG!=='de')trWalk(document.getElementById('main')||document.body)}catch(e){}}}

/* ---------- Schlagwörter (Tags) ---------- */
const TAGS_BASE=['Favorit','Bio','Vegan','Nachbestellen','Aufbrauchen','Testen','Seife','Creme','Lotion','Lippenpflege','Haarpflege','Gesichtspflege','Körperpflege','Duschgel','Shampoo','Deo','Badezusatz','Peeling','Geschenk','Sommer','Winter'];
GAPS.tg_none=['Ohne Schlagwort',i=>!(i.tags&&i.tags.length)];
const tagsUsed=()=>{const m={};S.items.forEach(i=>(i.tags||[]).forEach(t=>m[t]=(m[t]||0)+1));return m};
const tagsAll=()=>{const u=tagsUsed();const seen=new Set();return TAGS_BASE.concat(S.tags||[],Object.keys(u)).filter(t=>t&&!seen.has(FOLD(t))&&seen.add(FOLD(t)))};
function pickGapT(){const u=tagsUsed();const ks=Object.keys(u).sort((a,b)=>a.localeCompare(b,'de'));
if(!ks.length){toast('Noch kein Schlagwort vergeben');return}
pick('Schlagwort',ks.map(t=>[t,t+' ('+u[t]+')']),'',v=>tagGo(v))}
function tagGo(t){const k='t:'+t;GAPS[k]=['Schlagwort: '+t,i=>(i.tags||[]).includes(t)];Q.gap=k;Q.view='liste';Q.xcol='tags';if(R.id||R.name!=='lager')stack=[];go('lager','');lager()}
COLS.tags=['Schlagwörter',i=>esc((i.tags||[]).join(', '))];SORTS.tags=['Schlagwörter',1];SKEY.tags=i=>(i.tags&&i.tags.length)?i.tags.slice().sort((a,b)=>a.localeCompare(b,'de')).join(', ').toLowerCase():null;
if(!COLX.includes('tags'))COLX.push('tags');if(!SXP.includes('tags'))SXP.push('tags');CWID.tags=140;
{const f0=fields;fields=function(i){const f=f0.apply(this,arguments);f.a=(f.a||'')+' '+((i&&i.tags)||[]).join(' ');return f}}
function tgDraw(){const e=document.getElementById('tgchips'),sel=document.getElementById('tgsel');if(!e||!sel)return;const cur=window.__tg||[];const on=new Set(cur.map(FOLD));
sel.innerHTML=cur.length?cur.map(t=>`<span class="pill" style="background:var(--pri);color:#fff;border-color:var(--pri);display:inline-flex;align-items:center;gap:6px">${esc(t)}<button type="button" data-t="${esc(t)}" onclick="tgTog(this.dataset.t)" aria-label="Entfernen" style="background:none;border:0;color:#fff;font-size:1rem;line-height:1;padding:0 0 0 2px">×</button></span>`).join(''):'<span class="s">Noch keine Schlagwörter</span>';
e.innerHTML=tagsAll().filter(t=>!on.has(FOLD(t))).map(t=>`<button type="button" class="pill" data-t="${esc(t)}" onclick="tgTog(this.dataset.t)">${esc(t)}</button>`).join('');try{if(LANG!=='de'){trWalk(e);trWalk(sel)}}catch(x){}}
function tgTog(t){const a=window.__tg=window.__tg||[];const k=a.findIndex(x=>FOLD(x)===FOLD(t));if(k>=0)a.splice(k,1);else a.push(t);tgDraw()}
function tgAdd(){const e=document.getElementById('tgnew');const t=(e.value||'').trim().replace(/[,;]+/g,' ').slice(0,30);if(!t)return;S.tags=S.tags||[];if(!tagsAll().some(x=>FOLD(x)===FOLD(t)))S.tags.push(t);const a=window.__tg=window.__tg||[];if(!a.some(x=>FOLD(x)===FOLD(t)))a.push(t);e.value='';tgDraw()}
{const a3=artikel;artikel=function(i){a3.apply(this,arguments);try{
if(R.edit){const n=document.getElementById('f_notiz');const l=n&&n.closest('label');if(l&&!document.getElementById('tgbox')){window.__tg=(i.tags||[]).slice();
l.insertAdjacentHTML('afterend',`<div id="tgbox" class="fld"><span><span style="display:block;font-size:.74rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase">Schlagwörter</span><span style="display:block;font-size:.78rem;color:var(--sub);margin-top:2px">Zum Sortieren, Filtern und Suchen. Ein Tipp auf einen Vorschlag übernimmt ihn, mit × nimmst du ihn zurück.</span></span><div id="tgsel" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;padding:10px;border:1px solid var(--line);border-radius:12px;min-height:44px"></div><div class="s" style="margin-top:4px">Vorschläge</div><div id="tgchips" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div><div style="display:flex;gap:8px"><input id="tgnew" placeholder="Eigenes Schlagwort" maxlength="30" onkeydown="if(event.key==='Enter'){event.preventDefault();tgAdd()}"><button type="button" class="pill" onclick="tgAdd()">Hinzufügen</button></div></div>`);tgDraw()}}
else if(i.tags&&i.tags.length){const box=document.getElementById('af2');if(box&&!document.getElementById('tgview')){box.insertAdjacentHTML('beforeend',`<div id="tgview" class="txt" style="margin-top:10px"><div class="s"><span style="display:block;font-size:.74rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase">Schlagwörter</span></div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">${i.tags.map(t=>`<button type="button" class="pill" data-t="${esc(t)}" onclick="tagGo(this.dataset.t)">${esc(t)}</button>`).join('')}</div></div>`)}}
if(LANG!=='de')trWalk(document.getElementById('main')||document.body)}catch(e){}}}
{const s9=saveArt;saveArt=function(id){const i=getI(id);if(i&&document.getElementById('tgbox')&&window.__tg){i.tags=window.__tg.slice();const tg=new Set(S.tags||[]);i.tags.forEach(t=>{if(!TAGS_BASE.includes(t))tg.add(t)});S.tags=[...tg]}return s9.apply(this,arguments)}}

/* ---------- Form: kein Katalog-Hinweis mehr (Bestätigungsstatus wird nicht gepflegt) ---------- */
{const a4=artikel;artikel=function(i){a4.apply(this,arguments);try{
const sp=document.getElementById('pk_form')&&document.getElementById('pk_form').closest('.fld')&&document.getElementById('pk_form').closest('.fld').querySelector('span');if(sp&&sp.textContent.indexOf(' · ')>0)sp.textContent='Form';
const af1=document.getElementById('af1');if(af1)[...af1.querySelectorAll('.kv .s')].forEach(e=>{if(e.textContent.trim()==='Vorschlag aus dem Katalog, ungeprüft')e.remove()})}catch(e){}}}

/* ---------- Spalten-Menü: gewählte Spalten oben (Reihenfolge), Gruppen darunter einklappbar, Schlagwörter als Spalten ---------- */
function ensureTagCols(){tagsAll().forEach(t=>{const k='tag:'+t;if(COLS[k])return;COLS[k]=[t,i=>(i.tags||[]).includes(t)?ic('check','var(--pri)',16):''];SORTS[k]=[t,-1];SKEY[k]=i=>(i.tags||[]).includes(t)?1:null;CWID[k]=72;if(!SXP.includes(k))SXP.push(k)})}
{const lb0=lbody;lbody=function(){try{ensureTagCols()}catch(e){}return lb0.apply(this,arguments)}}
pickSort=function(){pick('Sortieren nach',Object.keys(SORTS).filter(k=>k.indexOf('tag:')!==0&&(S.expert||!SXP.includes(k))).map(k=>[k,SORTS[k][0]]),Q.sort,v=>{Q.sort=v;Q.dir=SORTS[v][1];xcOf(v);lbody()})};
const CGRP=[['Bestand und Preise',['menge','preis','min','mhd','ordered','neu','chg','lief']],['Artikeldaten',['kat','form','ean','inci','verw','dens']],['Seifen- und Fettwerte',['sapn','sapk','iod','smp','rzf','hae','sein','spr']],['Tensidwerte',['was','tkl']],['Schlagwörter',['tags']]];
let CCO=null,CCOPEN={};
const cLab=k=>k.indexOf('tag:')===0?k.slice(4):(COLS[k]?(COLS[k][0]==='€/100'?'Preis je 100 g/ml':COLS[k][0]):k);
function sheetColsX2(){ensureTagCols();if(!CCO)CCO=(S.cols||['menge']).filter(k=>COLS[k]);
const grp=CGRP.map(([n,ks])=>[n,n==='Schlagwörter'?ks.concat(tagsAll().map(t=>'tag:'+t)):ks.slice()]);
openSheet(`<h2>Spalten anzeigen</h2><div class="s" style="margin-bottom:8px">Bis zu 8 Spalten neben dem Namen. Die Spalte, nach der du sortierst, wird automatisch ergänzt.</div>
<div class="cap" style="margin:6px 0">Gewählt (${CCO.length} von 8)</div><div style="border:1px solid var(--line);border-radius:12px;padding:2px 12px">${CCO.length?CCO.map((k,n)=>`<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${esc(cLab(k))}</span><button class="ib" aria-label="Nach oben" onclick="ccMv(${n},-1)" style="width:36px;height:36px">↑</button><button class="ib" aria-label="Nach unten" onclick="ccMv(${n},1)" style="width:36px;height:36px">↓</button><button class="ib" aria-label="Entfernen" onclick="ccTog(CCO[${n}])" style="width:36px;height:36px">×</button></div>`).join(''):'<div class="s" style="padding:8px 0">Keine Spalte gewählt, es wird die Menge gezeigt.</div>'}</div>
<div class="cap" style="margin:14px 0 6px">Spalte hinzufügen</div>${grp.map(([n,ks])=>{const c=ks.filter(k=>CCO.includes(k)).length;return `<details class="acc" ${CCOPEN[n]?'open':''} ontoggle="CCOPEN['${n}']=this.open"><summary>${n}${c?` <small>${c}</small>`:''}</summary><div class="in">${ks.map(k=>`<label class="chk" style="padding:7px 0;margin:0;border-bottom:1px solid var(--line)"><input type="checkbox" ${CCO.includes(k)?'checked':''} data-k="${esc(k)}" onchange="ccTog(this.dataset.k)"><span>${esc(cLab(k))}</span></label>`).join('')}</div></details>`}).join('')}
<div class="btns"><button class="btn" onclick="ccSave()">Fertig</button></div>`);try{if(LANG!=='de')trWalk(document.getElementById('sheet'))}catch(e){}}
function ccTog(k){const n=CCO.indexOf(k);if(n>=0)CCO.splice(n,1);else{if(CCO.length>=8){toast('Höchstens 8 Spalten');sheetColsX2();return}CCO.push(k)}const y=(document.getElementById('sheet')||{}).scrollTop||0;sheetColsX2();const sh=document.getElementById('sheet');if(sh)sh.scrollTop=y}
function ccMv(n,d){const m=n+d;if(m<0||m>=CCO.length)return;const t=CCO[n];CCO[n]=CCO[m];CCO[m]=t;const y=(document.getElementById('sheet')||{}).scrollTop||0;sheetColsX2();const sh=document.getElementById('sheet');if(sh)sh.scrollTop=y}
function ccSave(){S.cols=CCO.length?CCO.slice(0,8):['menge'];CCO=null;save();closeSheet();lbody()}
{const sc0=sheetCols;sheetCols=function(){if(S.expert){CCO=null;sheetColsX2()}else sc0.apply(this,arguments)}}
