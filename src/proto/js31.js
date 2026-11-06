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
Object.keys(VW).forEach(k=>{const [lab,key,show,dir,full]=VW[k];
COLS[k]=[lab,i=>{const v=key(i);return v==null?'':show(v,i)}];
SORTS[k]=[full,dir];SKEY[k]=key;
if(!COLX.includes(k))COLX.push(k);if(!SXP.includes(k))SXP.push(k);CWID[k]=CWID[k]||(k==='sein'||k==='was'?90:72);
GAPS['v_'+k]=['Ohne '+full,i=>key(i)==null]});
const VGAPS=Object.keys(VW).map(k=>'v_'+k);
/* Lückenfinder: Werte-Lücken nur im Expertenmodus, mit Anzahl (so sieht man sofort, wie viele Rohstoffe schon einen Wert haben) */
pickGap=function(){const own=S.items;const base=Object.keys(GAPS).filter(k=>!VGAPS.includes(k));
const rows=[['','Kein Filter']].concat(base.map(k=>[k,GAPS[k][0]+' ('+own.filter(GAPS[k][1]).length+')']));
if(S.expert)rows.push(['__w','Fehlende Werte …']);
pick('Lücken finden',rows,Q.gap,v=>{if(v==='__w'){setTimeout(pickGapW,30);return}Q.gap=v;Q.view='liste';lager()})};
function pickGapW(){const own=S.items;pick('Wert fehlt bei',VGAPS.map(k=>[k,GAPS[k][0].replace('Ohne ','')+' ('+own.filter(GAPS[k][1]).length+' ohne, '+(own.length-own.filter(GAPS[k][1]).length)+' mit)']),Q.gap,v=>{Q.gap=v;Q.view='liste';const k=v.slice(2);if(COLS[k]&&!Q.xcol)Q.xcol=k;lager()})}
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
