import re,glob,os,json
SYM='/mnt/user-data/outputs/symbole'
SY={}
for f in sorted(glob.glob(SYM+'/*.svg')):
    s=open(f,encoding='utf-8').read()
    s=re.sub(r'<metadata>.*?</metadata>','',s,flags=re.S)
    inner=re.search(r'<svg[^>]*>(.*)</svg>',s,re.S).group(1)
    inner=re.sub(r'<circle cx="50" cy="50" r="42"[^>]*/>','',inner)       # Hintergrundkreis entfernen
    inner=inner.replace('#2c5e3b','currentColor')
    inner=re.sub(r'stroke-width="([\d.]+)"',lambda m:'stroke-width="%s"'%round(float(m.group(1))*2.2,1),inner)
    inner=re.sub(r'\s+',' ',inner).strip()
    SY[os.path.basename(f)[:-4]]=inner
t=open('tpl5_pre7.html',encoding='utf-8').read()
def rep(a,b):
    global t
    assert a in t,a[:70]
    t=t.replace(a,b,1)
js="const SY=%s;\nconst SYA={tag:'etikett',export:'export',import:'import',shield:'sicherung',refresh:'katalog-aktualisieren',trash:'loeschen',gear:'einstellungen',book:'anleitung',info:'info',pumpe:'spender',web:'web-suchen',link:'link-oeffnen',copy:'kopieren',cam:'kamera',barcode:'barcode',photo:'foto'};\nconst syv=(k,c,s,w)=>`<svg width=\"${s}\" height=\"${s}\" viewBox=\"14 14 72 72\" fill=\"none\" stroke=\"${c||'currentColor'}\" color=\"${c||'currentColor'}\" stroke-linecap=\"round\" stroke-linejoin=\"round\">${SY[k]}</svg>`;\n"%json.dumps(SY,ensure_ascii=False)
rep("const ic=(n,c,s=22)=>`",js+"const ic0=(n,c,s=22)=>`")
rep("const vic=(t,c,s=26)=>`","const ic=(n,c,s=22)=>{const k=SYA[n]||n;return SY[k]?syv(k,c,s):ic0(n,c,s)};\nconst vic0=(t,c,s=26)=>`")
# vic nach vic0 definieren
i=t.index("const vic0=")
j=t.index("\n",i)
t=t[:j+1]+"const vic=(t,c,s=26)=>{const k=SYA[t]||t;return SY[k]?syv(k,c,s):vic0(t,c,s)};\nconst oic=(o,c,s=22)=>{const n=o.toLowerCase().replace('ü','ue');const k=['regal','schrank','schublade','kuehlschrank','karton'].find(x=>n.includes(x));return k?syv(k,c,s):ic('drop',c,s)};\n"+t[j+1:]
# Einsatzorte
rep('rel="noopener" href="#" onclick="this.href=','rel="noopener" href="#" onclick="this.href=') 
t=t.replace('+\' INCI\')">Im Web suchen</a>','+\' INCI\')">${ic(\'web\',\'currentColor\',18)} Im Web suchen</a>',1) if '+\' INCI\')">Im Web suchen</a>' in t else t
t=t.replace('>Link öffnen ›</a>','>${ic(\'link\',\'currentColor\',16)} Link öffnen ›</a>')
t=t.replace('onclick="cp()">Kopieren</button>','onclick="cp()">${ic(\'copy\',\'currentColor\',18)} Kopieren</button>')
rep("function scan(){$('#main').innerHTML=`<div class=\"scan\"><div class=\"vf\"></div>","function scan(){$('#main').innerHTML=`<div class=\"scan\"><div class=\"vf\"></div><div style=\"display:flex;gap:22px;justify-content:center;margin-bottom:14px;color:#fff\">${ic('cam','#fff',40)}${ic('barcode','#fff',40)}${ic('photo','#fff',40)}</div>")
rep("const viewCols=()=>{const ex=(S.cols||['menge']).slice();const sc=SORTS[Q.sort]&&COLS[Q.sort]?Q.sort:null;if(sc&&!ex.includes(sc))ex.push(sc);return COLORDER.filter(k=>ex.includes(k)).slice(0,3)};","const viewCols=()=>{let ex=(S.cols||['menge']).slice();const xc=Q.xcol;if(xc&&COLS[xc]&&!ex.includes(xc)){if(ex.length>=(S.expert?8:3))ex=ex.slice(0,(S.expert?7:2));ex.push(xc)}return S.expert?ex.filter(k=>COLS[k]).slice(0,8):COLORDER.filter(k=>ex.includes(k)).slice(0,3)};\nconst xcOf=k=>{if(COLS[k])Q.xcol=k};")
rep("function setSort(k){if(Q.sort===k)Q.dir*=-1;else{Q.sort=k;Q.dir=SORTS[k][1]}lbody()}","function setSort(k){if(Q.sort===k)Q.dir*=-1;else{Q.sort=k;Q.dir=SORTS[k][1];xcOf(k)}lbody()}")
rep("v=>{Q.sort=v;Q.dir=SORTS[v][1];lbody()})}","v=>{Q.sort=v;Q.dir=SORTS[v][1];xcOf(v);lbody()})}")
rep("Q.dir=S.ui.dir||1}","Q.dir=S.ui.dir||1;if(COLS[Q.sort])Q.xcol=Q.sort}")
rep("ic('trash','var(--sub)',17)","ic('trash','var(--sub)',22)")
open('tpl5.html','w',encoding='utf-8').write(t)
print(len(SY),'Symbole eingebettet;',len(json.dumps(SY))//1024,'KB')
