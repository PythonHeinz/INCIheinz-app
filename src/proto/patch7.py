import re
t=open('tpl5_pre6.html',encoding='utf-8').read()
def R(a,b,cnt=1):
    global t
    n=t.count(a)
    assert n==cnt,(n,a[:80])
    t=t.replace(a,b)
qr=open('/mnt/user-data/uploads/lager-app/qr.js',encoding='utf-8').read()
js=open('js7.js',encoding='utf-8').read()+'\n'+open('js8.js',encoding='utf-8').read()+'\n'+open('js9.js',encoding='utf-8').read()+'\n'+open('js10.js',encoding='utf-8').read()+'\n'+open('js11.js',encoding='utf-8').read()+'\n'+open('js12.js',encoding='utf-8').read()+'\n'+open('js13.js',encoding='utf-8').read()+'\n'+open('js14.js',encoding='utf-8').read()+'\n'+open('js15.js',encoding='utf-8').read()+'\n'+open('js16.js',encoding='utf-8').read()+'\n'+open('js17.js',encoding='utf-8').read()+'\n'+open('js18.js',encoding='utf-8').read()+'\n'+open('js19.js',encoding='utf-8').read()

R('<button class="lnk" onclick="sheetAddShop()">+ Rohstoff</button></div>','<span><button class="lnk" style="margin-right:16px" onclick="sheetExpShop()">Export</button><button class="lnk" onclick="sheetAddShop()">+ Rohstoff</button></span></div>')
R("else if(L>=3&&wst(f.i,t))b=50;","else if(L>=2&&L<=5&&inits(f).includes(t))b=55;else if(ABBR[t]&&String(f.i||'').toLowerCase().includes(ABBR[t]))b=55;else if(L>=3&&wst(f.i,t))b=50;")
R("function score(f,terms){","const ABBR={cab:'cocamidopropyl betaine',apg:'glucoside',smct:'methyl cocoyl taurate',scg:'cocoyl glutamate',sga:'sodium cocoyl glycinate',btms:'behentrimonium',cmc:'cellulose gum',pca:'pca'};\nconst initC={};function inits(f){const k=(f.i||'')+'|'+(f.n||'');if(initC[k])return initC[k];const ini=s=>String(s||'').split(/[\\s\\/\\-]+/).filter(w=>/^[A-Za-z]/.test(w)).map(w=>w[0]).join('').toLowerCase();return initC[k]=String(f.i||'').split(',').map(ini).concat([ini(String(f.n||'').replace(/\\(.*?\\)/g,''))]).filter(Boolean)}\nfunction score(f,terms){")
R(".slice(0,6).map(x=>x.c);",".slice(0,10).map(x=>x.c);")

R("onclick=\"toast('Etikettendruck kommt in einer späteren Version')\">Etikett</button>","onclick=\"labelFor('${i.id}')\">Etikett</button>")
R("${edit?'':`<div style=\"text-align:center;margin-top:18px\"><button class=\"lnk\" style=\"color:var(--err)\"","${edit?'':`<div class=\"card\" style=\"margin-top:14px;padding:14px;display:flex;gap:14px;align-items:center\"><div style=\"width:88px;height:88px;flex:none;border:1px solid var(--line);border-radius:8px;overflow:hidden\">${QR.toSVG('INCIHEINZ:'+i.id,{margin:1})}</div><div style=\"min-width:0\"><div class=\"s\">Artikelcode</div><div style=\"font:700 1.05rem ui-monospace,Menlo,Consolas,monospace;letter-spacing:.06em\">${esc(i.id.toUpperCase())}</div><div class=\"s\" style=\"margin-top:2px\">Derselbe QR-Code steht auf dem Etikett.</div><button class=\"lnk\" style=\"margin-top:4px\" onclick=\"labelFor('${i.id}')\">Etikett drucken</button></div></div>`}\n${edit?'':`<div style=\"text-align:center;margin-top:18px\"><button class=\"lnk\" style=\"color:var(--err)\"")
CSSX=''
# QR + new js
# data model
R("function normI(i){const b={unk:false,","function normI(i){const b={ean:'',foto:'',gedr:'',unk:false,")
R("S.shop=S.shop||[];S.lief=S.lief||{};if(!S.orte)","S.shop=S.shop||[];S.lief=S.lief||{};adoptLief();loadCatX();if(!S.orte)")
# routing scan
R("navb('scan'),scan()}","navb('scan'),scan2()}")
# Mehr menu
R("['tag','Etiketten &amp; Druck',soonT]","['tag','Etiketten &amp; Druck',\"sheetLabels()\"]")
R("['export','Export',\"doExport()\"]","['export','Export',\"sheetExport()\"]")
R("['shield','Sicherung',\"doExport()\"]","['shield','Sicherung',\"sheetBackup()\"]")
R("['refresh','Katalog aktualisieren',soonT]","['refresh','Katalog aktualisieren',\"sheetCatUpd()\"]")
R("['book','Anleitung',soonT]","['book','Anleitung',\"sheetHilfe()\"]")
R('accept=".json,.txt"','accept=".json,.csv,.xlsx,.txt,.tsv,text/csv,application/json"')
R("function doExport()","function doExportOld()")
R("function doImport(inp)","function doImportOld(inp)")
# Lieferanten
R("function sheetBezug(id,bid){","function sheetBezug0(id,bid){")
old='''<label class="fld"><span>Lieferant</span><input id="f1" list="dl" value="${esc(old?old.lief:'')}" placeholder="z. B. Dragon Spice"><datalist id="dl">${ls.map(l=>`<option>${esc(l)}</option>`).join('')}</datalist></label>'''
new='''<label class="fld"><span>Lieferant</span><select id="f1" onchange="if(this.value==='__n')newLiefFromBezug('${id}','${bid||''}')">${liefOpts(BZPRE||(old?old.lief:''))}</select></label>'''
R(old,new)
R("if(!l){$('#er').textContent='Bitte einen Lieferanten angeben.';return}if(!(p>=0)","if(!l||l==='__n'){$('#er').textContent='Bitte einen Lieferanten angeben.';return}if(!(p>=0)")
R('''<div style="height:22px"></div><label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert''','''<div style="height:22px"></div><div class="cap" style="margin:0 0 4px">Lieferanten</div><div class="s" style="margin-bottom:6px">Versandkosten und Webseite je Lieferant. Neue legst du auch direkt bei der Bezugsquelle an.</div>${liefsHtml()}<button class="pill" style="margin-top:10px" onclick="LIEFCB=null;sheetLiefEdit(null)">+ Lieferant hinzufügen</button><div style="height:22px"></div><label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert''')
# EAN
R('''<div class="two"><div class="fld"><span>Kategorie</span>${sel('pk_kat',katInner)}''','''<label class="fld"><span>EAN / Barcode (optional)</span><input id="f_ean" inputmode="numeric" value="${esc(i.ean)}" placeholder="z. B. 4012345678901"></label>
<div class="two"><div class="fld"><span>Kategorie</span>${sel('pk_kat',katInner)}''')
R('''<div class="kv"><span>Form</span><span>${esc(i.form||'–')}</span></div>`;''','''<div class="kv"><span>Form</span><span>${esc(i.form||'–')}</span></div>${i.ean?`<div class="kv"><span>EAN / Barcode</span><span style="overflow-wrap:anywhere">${esc(i.ean)}</span></div>`:''}`;''')
R("i.quelle=val('f_quelle').trim();i.min=","i.quelle=val('f_quelle').trim();i.ean=val('f_ean').trim();i.min=")
# hero + list thumb
R('''<div class="card" style="margin-top:14px;padding:16px"><div class="s">Gesamtbestand</div>''','''${heroHtml(i)}
<div class="card" style="margin-top:14px;padding:16px"><div class="s">Gesamtbestand</div>''')
R('<div class="c1"><div class="nm">${esc(i.name)}</div>','<div class="c1"><div class="nm">${i.foto?`<img class="pic" src="${i.foto}" alt="">`:\'\'}${esc(i.name)}</div>')
# sheetNeu ean/foto
R("function sheetNeu(pre){NEU={c:null};","function sheetNeu(pre,ean,foto){NEU={c:null,ean:ean||'',foto:foto||''};")
R("save();closeSheet();stack=[];R={name:'artikel',id:it.id,edit:!c&&!NEU.c};","if(NEU.ean&&!it.ean)it.ean=NEU.ean;if(NEU.foto)it.foto=NEU.foto;save();closeSheet();stack=[];R={name:'artikel',id:it.id,edit:!c&&!NEU.c};")
# CSS
css='''
.pic{width:30px;height:30px;border-radius:7px;object-fit:cover;vertical-align:middle;margin-right:8px}
.hero{margin-top:14px}.btns.col{flex-direction:column}.btns.col .btn{flex:none;width:100%}\n.hero img{width:100%;max-width:240px;aspect-ratio:1;object-fit:cover;border-radius:16px;display:block;margin:0 auto;border:1px solid var(--line)}
.camov{position:absolute;inset:0;background:#000;z-index:40;display:flex;flex-direction:column}.camov video{flex:1;width:100%;min-height:0;object-fit:cover}
.camfr{position:absolute;left:50%;top:40%;width:240px;height:240px;margin:-120px 0 0 -120px;border:3px solid #7FC59B;border-radius:18px;pointer-events:none}
.camtx{position:absolute;top:24px;left:0;right:0;text-align:center;color:#fff;font-size:.9rem}.cambt{padding:14px;display:flex;gap:10px;background:#000}
details.ac{border-bottom:1px solid var(--line)}details.ac summary{padding:14px 2px;font-weight:600;cursor:pointer;list-style:none;display:flex;justify-content:space-between}details.ac summary::after{content:'▾';color:var(--sub)}details.ac[open] summary::after{content:'▴'}details.ac p{margin:0 0 14px;font-size:.92rem;line-height:1.5}
.label{display:flex;align-items:center;gap:1.5mm;padding:1.5mm;overflow:hidden;background:#fff;color:#000;border:1px dashed #aaa;box-sizing:border-box;break-inside:avoid}
.label .lq{flex:none}.label .lq svg{display:block;width:100%;height:100%}.label .lt{min-width:0;line-height:1.1}
.label .ln{font-weight:700;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word}
.label .lc{font:700 6pt/1 ui-monospace,Menlo,Consolas,monospace;margin-top:.8mm;letter-spacing:.06em}
.label .lin{margin-top:.8mm;color:#222;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;word-break:break-word;line-height:1.1}
.label .ln{font-size:calc(var(--fs,7pt)*var(--k,1));hyphens:auto;-webkit-hyphens:auto;overflow-wrap:break-word;word-break:normal}\n.size-S{--fs:6.5pt;width:38mm;height:21mm}.size-S .lq{width:17mm;height:17mm}.size-S .lin{font-size:4.6pt;-webkit-line-clamp:2}
.size-M{--fs:7.5pt;width:48mm;height:25mm}.size-M .lq{width:21mm;height:21mm}.size-M .lin{font-size:5pt;-webkit-line-clamp:3}
.size-L{--fs:9.5pt;width:63mm;height:38mm}.size-L .lq{width:30mm;height:30mm}.size-L .ln{-webkit-line-clamp:3}.size-L .lin{font-size:6.5pt;-webkit-line-clamp:5}
#prt{display:none}
@media print{@page{size:A4;margin:8mm}html,body{height:auto!important;overflow:visible!important;background:#fff!important}#app{display:none!important}#prt{display:block!important}.lsheet{display:flex;flex-wrap:wrap;gap:2mm;align-content:flex-start}}
'''
R("const uid=()=>",qr+"\nconst uid=()=>")
R("(async()=>{await load();",js+"\n(async()=>{await load();")
exec(open('p7b.py',encoding='utf-8').read().replace('css+=','CSSX+='))
css+=CSSX
css+=open('css18.css',encoding='utf-8').read()
i=t.find('</style>')
assert i>0
t=t[:i]+css+t[i:]
open('tpl5_pre7.html','w',encoding='utf-8').write(t)
print('ok',len(t))
