import json,re,sys
sys.path.insert(0,'.')
import i18n_es as X
from i18n_es import EN,ES,PATS,PES
EN.pop('Noch',None);ES.pop('Noch',None)
t=open('tpl5.html',encoding='utf-8').read()
cv=lambda P:[[a,re.sub(r'\\(\d)',r'$\1',b)] for a,b in P]
pats=cv(PATS);pes=cv(PES)
t=t.replace("const CAT=__CAT__;","const CAT=__CAT__;\nlet LANG='de',LOC='de-DE';\nconst LANGS={en:{dict:%s,pats:%s},es:{dict:%s,pats:%s}};\nconst locOf=l=>l==='en'?'en-GB':l==='es'?'es-ES':'de-DE';"%(json.dumps(EN,ensure_ascii=False),json.dumps(pats,ensure_ascii=False),json.dumps(ES,ensure_ascii=False),json.dumps(pes,ensure_ascii=False)),1)
t=t.replace("const nf=(n,d=2)=>Number(n).toLocaleString('de-DE',{maximumFractionDigits:d});","const nf=(n,d=2)=>Number(n).toLocaleString(LOC,{maximumFractionDigits:d});")
t=t.replace("const eur=n=>Number(n).toLocaleString('de-DE',{","const eur=n=>Number(n).toLocaleString(LOC,{")
t=t.replace("new Date(d).toLocaleDateString('de-DE')","new Date(d).toLocaleDateString(LOC)")
t=t.replace("S.items=(S.items||[]).map(normI);","LANG=S.lang||'de';LOC=locOf(LANG);S.items=(S.items||[]).map(normI);")
i18n=r'''
/* ---------- Sprache ---------- */
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function prep(d){if(d.fb)return;d.fb=Object.keys(d.dict).filter(k=>k.length>=5).sort((a,b)=>b.length-a.length).map(k=>[new RegExp('(?<![\\p{L}])'+reEsc(k)+'(?![\\p{L}])','gu'),d.dict[k]]);d.pr=d.pats.map(p=>[new RegExp(p[0]),p[1]])}
const tmGet=s=>{const k=s.trim();if(!k)return null;const a=S.tm&&S.tm[k],b=typeof RZIM!=='undefined'&&RZIM&&RZIM.tm&&RZIM.tm[k];const e=a||b;return e&&e[LANG]?e[LANG]:null};
const tmOn=()=>{if(typeof RZIM!=='undefined'&&RZIM&&RZIM.tm)return true;for(const k in (S.tm||{}))return true;return false};
function trStr(s){const tv=tmGet(s);if(tv!==null)return s.replace(s.trim(),()=>tv);if(LANG==='de')return s;const d=LANGS[LANG];if(!d)return s;prep(d);const k=s.trim();if(!k)return s;const r=d.dict[k];if(r!==undefined)return s.replace(k,()=>r);
for(const [re,rep] of d.pr)if(re.test(k))return s.replace(k,()=>k.replace(re,rep));
let out=k;for(const [re,rep] of d.fb)out=out.replace(re,()=>rep);return out===k?s:s.replace(k,()=>out)}
function trWalk(root){if((LANG==='de'&&!tmOn())||!root)return;if(root.nodeType===3){trNode(root);return}if(root.nodeType!==1)return;
const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const l=[];while(n=w.nextNode())l.push(n);l.forEach(trNode);
const els=root.matches&&root.matches('[placeholder],[aria-label],[title],optgroup')?[root]:[];root.querySelectorAll('[placeholder],[aria-label],[title],optgroup').forEach(e=>els.push(e));
els.forEach(e=>['placeholder','aria-label','title','label'].forEach(a=>{if(e.hasAttribute(a)){const v=e.getAttribute(a),r=trStr(v);if(r!==v)e.setAttribute(a,r)}}))}
function trNode(n){const p=n.parentElement;if(!p||/^(TEXTAREA|SCRIPT|STYLE)$/.test(p.tagName))return;const v=n.nodeValue;if(!v.trim())return;const tv=tmGet(v);if(tv!==null){n.nodeValue=v.replace(v.trim(),()=>tv);return}if(p.classList.contains('nm')||LANG==='de')return;const r=trStr(v);if(r!==v)n.nodeValue=r}
let OBS=null;
function startI18n(){const app=$('#app');OBS=new MutationObserver(ms=>{if(LANG==='de'&&!tmOn())return;OBS.disconnect();ms.forEach(m=>{if(m.type==='characterData')trWalk(m.target);else m.addedNodes.forEach(trWalk)});OBS.observe(app,{childList:true,subtree:true,characterData:true})});OBS.observe(app,{childList:true,subtree:true,characterData:true})}
function setLang(l){LANG=l;LOC=locOf(l);S.lang=l;document.documentElement.lang=l;save();closeSheet();draw();trWalk($('#app'))}
function pickLang(){pick('Sprache',[['de','Deutsch'],['en','English'],['es','Español']],LANG,setLang)}
'''
t=t.replace("/* ---------- Neu ---------- */",i18n+"/* ---------- Neu ---------- */",1)
t=t.replace("""function sheetSettings(){openSheet(`<h2>Einstellungen</h2>""","""function sheetSettings(){openSheet(`<h2>Einstellungen</h2><div class="cap" style="margin:0 0 4px">Sprache</div><button class="selbtn" onclick="pickLang()"><span>${{de:'Deutsch',en:'English',es:'Español'}[LANG]||'Deutsch'}</span><span style="color:var(--sub)">▾</span></button><div style="height:18px"></div>""")
t=t.replace("(async()=>{await load();if(!S.seeded){seed();save()}draw()})();","(async()=>{await load();if(!S.seeded){seed();save()}startI18n();document.documentElement.lang=LANG;draw();trWalk($('#app'))})();")
open('tpl6.html','w',encoding='utf-8').write(t)
# strings table
import csv
rows=[('de','en','es')]+[(k,EN[k],ES.get(k,'')) for k in sorted(EN)]
with open('/mnt/user-data/outputs/textbausteine.csv','w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f,delimiter=';');w.writerows(rows)
print(len(EN))
