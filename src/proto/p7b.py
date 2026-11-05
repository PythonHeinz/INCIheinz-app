# executed inside patch7.py (uses R, t)
R("function draw(){const v=$('#view');closeSheet();","function draw(){const v=$('#view');closeSheet();$('#app').classList.toggle('artpg',R.name==='artikel');")
inci_edit='''<label class="fld"><span>INCI-Bezeichnung</span><textarea id="f_inci" rows="2" placeholder="z. B. Simmondsia Chinensis Seed Oil">${esc(i.inci)}</textarea></label>
<div style="display:flex;gap:8px;margin-top:8px"><a class="pill" target="_blank" rel="noopener" href="#" onclick="this.href='https://www.google.com/search?q='+encodeURIComponent((val('f_name')||'')+' INCI')">Im Web suchen</a><button class="pill" type="button" onclick="sheetPaste()">Aus Text übernehmen</button></div>
<label class="chk"><input type="checkbox" id="f_ok" ${i.ist==='geprüft'?'checked':''}> INCI geprüft (z. B. mit Datenblatt oder Etikett)</label>
'''
R(inci_edit,'')
view_inci='''<div class="kv"><span>INCI</span><span>${i.inci?esc(i.inci):none}</span></div><div class="kv"><span></span><span>${ist}</span></div>'''
R(view_inci,'')
box="const inciBox=edit?`"+inci_edit+"`:`<div style=\"overflow-wrap:anywhere;line-height:1.45\">${i.inci?esc(i.inci):none}</div>${catSrc(i)}<div style=\"display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px\">${ist}<button class=\"pill\" type=\"button\" onclick=\"sheetProduct('${i.id}')\">Aus Produktseite übernehmen</button></div>`;\nconst tx=(l,v)=>v?"
R("const tx=(l,v)=>v?",box)
R('<details class="acc" open><summary>INCI &amp; Stammdaten</summary><div class="in" id="af1">${stamm}</div></details>','<details class="acc" open><summary>INCI</summary><div class="in" id="af0">${inciBox}</div></details>\n<details class="acc" open><summary>Stammdaten</summary><div class="in" id="af1">${stamm}</div></details>')
R("if(edit)['af1','af2','af3']","if(edit)['af0','af1','af2','af3']")
R('<div class="cap" style="margin:14px 0 2px">Katalog-Treffer</div><div id="hits"></div>','<div class="cap" style="margin:14px 0 2px">Katalog-Treffer</div><div id="hits"></div><button class="pill" style="margin-top:8px" onclick="sheetProduct(null)">Aus Produktseite übernehmen</button>')
css+='''
#app.artpg{--bg:#DCE4DD;--line:#BFCCC2}
#app.artpg .card,#app.artpg details.acc{background:#FCFBF7;box-shadow:0 1px 2px rgba(30,38,33,.10)}
#app.artpg .fld input,#app.artpg .fld textarea,#app.artpg .fld select,#app.artpg .selbtn{background:#fff;border-color:#AEBDB2}
#app.artpg .fld input:focus,#app.artpg .fld textarea:focus{border-color:var(--pri)}
'''

# ---- v1.0.1: Preisstaffeln (je Lieferant+Nr.+Menge eine Zeile, jeweils letzter Preis)
R("const cheapest=i=>{let b=null;i.bezug.filter(x=>x.kind===i.kind).forEach(x=>{const p=per(x).v;if(!b||p<b.p)b={p,x}});return b};",
"const tiers=i=>{const m={};i.bezug.slice().sort((a,b)=>a.datum<b.datum?-1:a.datum>b.datum?1:0).forEach(x=>{m[x.lief+'|'+(x.nr||'')+'|'+Math.round(x.menge*1000)]=x});return Object.values(m)};\nconst cheapest=i=>{let b=null;tiers(i).filter(x=>x.kind===i.kind).forEach(x=>{const p=per(x).v;if(!b||p<b.p)b={p,x}});return b};")
R("const bz={};i.bezug.forEach(x=>{(bz[x.lief]=bz[x.lief]||[]).push(x)});","const bz={};tiers(i).sort((a,b)=>a.lief.localeCompare(b.lief)||a.menge-b.menge).forEach(x=>{const k=x.lief+'|'+(x.nr||'')+'|'+Math.round(x.menge*1000);bz[k]=[x]});")
R("const rows=Object.keys(bz).map(l=>{const a=bz[l].sort((x,y)=>x.datum<y.datum?1:-1);const x=a[0];","const rows=Object.keys(bz).map(l=>{const x=bz[l][0];const a=i.bezug.filter(y=>y.lief===x.lief&&(y.nr||'')===(x.nr||'')&&Math.round(y.menge*1000)===Math.round(x.menge*1000));")
R("<div class=\"t\"><b>${esc(l)}</b><div class=\"s\">${esc(x.nr||'')} · ${a.length>1?a.length+' Preise, zuletzt ':''}${dde(x.datum)}</div></div>","<div class=\"t\"><b>${esc(x.lief)} · ${fmt(x.menge,x.kind)}</b><div class=\"s\">${esc(x.nr||'')}${x.nr?' · ':''}${a.length>1?a.length+' Preise, zuletzt ':''}${dde(x.datum)}</div></div>")
R("const b=i.bezug.filter(x=>x.lief===l).sort((a,b)=>a.datum<b.datum?1:-1)[0];return b&&b.kind===i.kind?s.menge*b.preis/b.menge:null};","const b=tiers(i).filter(x=>x.lief===l&&x.kind===i.kind).sort((a,b)=>per(a).v-per(b).v)[0];return b?s.menge*b.preis/b.menge:null};")

# ---- v1.0.2: Datum Aufnahme / letzte Änderung
R("function normI(i){const b={ean:'',foto:'',gedr:'',unk:false,","function normI(i){const b={neu:'',chg:'',h:'',ean:'',foto:'',gedr:'',unk:false,")
R("function mk(c,o){return normI(Object.assign({id:uid(),","function mk(c,o){return normI(Object.assign({neu:today(),id:uid(),")
R("async function save(){try{","async function save(){try{stampAll()}catch(_){}try{")
R("ordered:['Bestellt',i=>shortD(i.ordered)],","ordered:['Bestellt',i=>shortD(i.ordered)],neu:['Neu seit',i=>shortD(i.neu)],chg:['Geändert',i=>shortD(i.chg||i.neu)],")
R("const COLORDER=['menge','mhd','ordered','preis','inci','verw'];","const COLORDER=['menge','mhd','ordered','neu','chg','preis','inci','verw'];")
R("ordered:['Zuletzt bestellt',-1],","ordered:['Zuletzt bestellt',-1],neu:['Zuletzt aufgenommen',-1],chg:['Zuletzt geändert',-1],")
R("if(k==='ordered')return i.ordered||null;","if(k==='ordered')return i.ordered||null;if(k==='neu')return i.neu||null;if(k==='chg')return i.chg||i.neu||null;")
R("${i.ean?`<div class=\"kv\"><span>EAN / Barcode</span><span style=\"overflow-wrap:anywhere\">${esc(i.ean)}</span></div>`:''}`;","${i.ean?`<div class=\"kv\"><span>EAN / Barcode</span><span style=\"overflow-wrap:anywhere\">${esc(i.ean)}</span></div>`:''}<div class=\"kv\"><span>Aufgenommen</span><span>${i.neu?dde(i.neu):'vor Version 1.0'}</span></div><div class=\"kv\"><span>Zuletzt geändert</span><span>${(i.chg||i.neu)?dde(i.chg||i.neu):'–'}</span></div>`;")


# ---- v1.0.3
css+="""
.th{align-items:center}.th span{white-space:nowrap}
.c2{flex:0 0 62px!important}.th .c2{display:flex!important;justify-content:flex-end;align-items:center;font-size:.62rem;letter-spacing:.03em}
.lead{flex:0 0 22px;display:flex;align-items:center;justify-content:center}
.ph{flex:0 0 34px;height:34px}.ph .pic{width:34px;height:34px;margin:0;border-radius:9px;display:block;object-fit:cover}
.tr{min-height:58px}.tr .nm{display:flex;align-items:center;gap:6px}.tr .nm .ri{flex:none;display:inline-flex;margin:0;gap:5px}.tr .nm .t{min-width:0}
input::placeholder,textarea::placeholder{color:#C3CBC5;opacity:1}
"""
R('<div class="th"><span class="c1 ${Q.sort===\'name\'','<div class="th">${(window.AF=false,\'\')}<span class="lead"></span>${AF?\'<span class="ph"></span>\':\'\'}<span class="c1 ${Q.sort===\'name\'')
R('<div class="c1"><div class="nm">${i.foto?`<img class="pic" src="${i.foto}" alt="">`:\'\'}${esc(i.name)}</div><div class="ri"><span title="${esc(i.kat)}">${cic(i.kat,\'var(--sub)\',15)}</span>${statusIcons(i)}</div>','<div class="lead" title="${esc(i.kat)}">${cic(i.kat,\'var(--sub)\',20)}</div>${AF?`<div class="ph">${i.foto?`<img class="pic" src="${i.foto}" alt="">`:\'\'}</div>`:\'\'}<div class="c1"><div class="nm"><span class="t">${esc(i.name)}</span><span class="ri">${statusIcons(i)}</span></div>')
R("CAM={st:await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false}),det:new BarcodeDetector({formats:sup}),on:true};","CAM={st:await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false}),det:new BarcodeDetector({formats:sup}),on:true,seen:{},t0:0};")
R("const tick=async()=>{if(!CAM||!CAM.on)return;try{const r=await CAM.det.detect(v);if(r.length){const raw=r[0].rawValue;camStop();handleCode(raw);return}}catch(e){}setTimeout(tick,200)};tick()}","const tick=async()=>{if(!CAM||!CAM.on)return;try{const r=await CAM.det.detect(v);const now=Date.now();r.forEach(x=>{const c=String(x.rawValue||'').trim();if(c&&!CAM.seen[c]){CAM.seen[c]=1;if(!CAM.t0)CAM.t0=now;if(navigator.vibrate)try{navigator.vibrate(30)}catch(_){}}});if(CAM.t0){const cs=Object.keys(CAM.seen);const fr=document.querySelector('.camfr'),tx=document.querySelector('.camtx');if(fr)fr.classList.add('ok');if(tx)tx.innerHTML=cs.map(c=>'✓ '+esc(codeLabel(c))).join('<br>');if(now-CAM.t0>=1500){camStop();camDone(cs);return}}}catch(e){}setTimeout(tick,150)};tick()}")
R('<div class="hint">Jeder Preis wird mit Datum gespeichert, so entsteht ein Preisverlauf.','${old?tierHist(i,old):\'\'}<div class="hint">Jeder Preis wird mit Datum gespeichert, so entsteht ein Preisverlauf.')
css+=".camfr.ok{border-color:#3FD07A!important;box-shadow:0 0 0 3px rgba(63,208,122,.45)}\n"

# ---- v1.1: Statistik-Seite
css+="""
.wgs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.wg{padding:12px 14px;cursor:pointer;min-width:0;overflow:hidden}.wg.w2{grid-column:span 2}
.wg h3{margin:0 0 8px;font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--sub);font-weight:500}
.big{font-size:1.5rem;font-weight:600;letter-spacing:-.02em}
"""
R("navb('scan'),scan2()}","navb('scan'),scan2()\nelse if(R.name==='stat')v.innerHTML=header('STATISTIK',1)+`<main id=\"main\"></main>`+navb('lager'),stat()}")
R("""['cart','Bestellliste',"closeSheet();tab('einkauf')"],""","""['cart','Bestellliste',"closeSheet();tab('einkauf')"],['stat','Statistik',"closeSheet();go('stat')"],""")

R("<span>Nichts gefunden.</span>${q?`<br><button class=\"btn\" style=\"margin-top:12px\" onclick=\"sheetNeu(Q.q)\">„${esc(q)}“ neu anlegen</button>`:''}","<span>Nicht im Lager.</span>${q?lagerCatHits(q):''}${q?`<br><button class=\"btn\" style=\"margin-top:12px\" onclick=\"sheetNeu(Q.q)\">„${esc(q)}“ neu anlegen</button>`:''}")

R("const unitsOf=k=>Object.keys(U).filter(u=>U[u].k===k);","const unitsOf=k=>Object.keys(U).filter(u=>U[u].k===k&&(S.expert||!EXPU[u]));")
R("${g[1].map(u=>`<option value=\"${u}\" ${u===sel?'selected':''}>${u}</option>`).join('')}</optgroup>`).join('')}","${g[1].filter(u=>S.expert||!EXPU[u]||u===sel).map(u=>`<option value=\"${u}\" ${u===sel?'selected':''}>${u}</option>`).join('')}</optgroup>`).join('')}")
R("function fmt(b,k){b=+b||0;if(k==='w')","function fmt(b,k){b=+b||0;if(S.expert&&S.imp){const r=fmtImp(b,k);if(r)return r}if(k==='w')")
R("const pickU=(b,k)=>k==='w'&&b>=1000?'kg'","const pickU=(b,k)=>S.expert&&S.imp&&IMPK[k]?impU(b,k):k==='w'&&b>=1000?'kg'")
R("unitSel(i.kind,u)","unitSelD(i,u)",3)
R("const i=getI(id);const u=val('f2');const t=num(val('f1'));if(t==null||t<0){$('#er').textContent='Bitte eine Menge eingeben.';return}","const i=getI(id);let u=val('f2');let t=num(val('f1'));{const c=densC(i,t,u);if(c){t=c.n;u=c.u}}if(t==null||t<0){$('#er').textContent='Bitte eine Menge eingeben.';return}")
R("menge:toB(m,val('f5')),kind:U[val('f5')].k,datum:today()}","menge:bzM(i,m,val('f5')),kind:bzK(i,val('f5')),datum:today()}")
R("menge:toB(a,val('f2')),lief:val('f3')}","menge:densB(getI(id),a,val('f2')),lief:val('f3')}")
R("i.total+=toB(n,val('b2'));","i.total+=densB(i,n,val('b2'));")
R("i.min=num(val('f_min'))||0;R.edit=false;","i.min=num(val('f_min'))||0;if(document.getElementById('f_dens'))i.dens=num(val('f_dens'))||0;R.edit=false;")
R("<label class=\"fld\"><span>Notiz</span><textarea id=\"f_notiz\">","${S.expert&&(i.kind==='w'||i.kind==='v')?`<label class=\"fld\"><span>Dichte in g/ml (optional)</span><input id=\"f_dens\" inputmode=\"decimal\" value=\"${i.dens?nf(i.dens,3):''}\"></label><div class=\"hint\">Mit Dichte kannst du Menge und Preise in g oder ml eingeben, z. B. 0,92 für Öl.</div>`:''}<label class=\"fld\"><span>Notiz</span><textarea id=\"f_notiz\">")
R("${S.expert?`<div class=\"card\" style=\"padding:4px 14px;margin:8px 0 18px\">${[['Einheitensystem: metrisch (SI)'],['Dichte je Rohstoff (ml ↔ g)'],['Menüleiste anpassen']].map(x=>`<div class=\"kv\"><span>${x[0]}</span><span class=\"pillbtn\">in Vorbereitung</span></div>`).join('')}</div>`:'<div style=\"height:14px\"></div>'}","${S.expert?expertCard():'<div style=\"height:14px\"></div>'}")
R("function normI(i){const b={neu:'',","function normI(i){const b={dens:0,neu:'',")
R("save();draw();if(U[val('f5')]&&0){}}","save();draw()}")

R("<div class=\"card\" style=\"overflow:hidden\"><div class=\"th\">${(window.AF","<div class=\"card ${cols.length>3?'sc':''}\" style=\"overflow:${cols.length>3?'auto':'hidden'};--w:${colW(cols)}px\"><div class=\"th\">${(window.AF")
R("<span class=\"c2 ${Q.sort===k?'on':''}\" onclick=","<span class=\"c2 ${Q.sort===k?'on':''}\" style=\"${cellSt(k)}\" onclick=")
R("<div class=\"c2\" style=\"font-size:.82rem\">${COLS[k][1](i)}</div>","<div class=\"c2\" style=\"font-size:.82rem;${cellSt(k)}\">${COLS[k][1](i)}</div>")

css+=".card.sc{-webkit-overflow-scrolling:touch}.card.sc .th,.card.sc .tr{min-width:var(--w)}.card.sc .c1{position:sticky;left:0;z-index:2;background:var(--surf,#fff);flex:0 0 150px!important;min-width:150px;box-shadow:6px 0 6px -6px rgba(0,0,0,.15)}"

R("if(k==='mhd')return i.mhd||null;return 0}","if(k==='mhd')return i.mhd||null;if(SKEY[k])return SKEY[k](i);return 0}")
R("pick('Sortieren nach',Object.keys(SORTS).map(","pick('Sortieren nach',Object.keys(SORTS).filter(k=>S.expert||!SXP.includes(k)).map(")

R("onclick=\"sheetCols()\" aria-label=\"Spalten\">${ic('grid','var(--pri)',18)}","onclick=\"sheetCols()\" aria-label=\"Spalten\">${ic('cols','var(--pri)',18)}")

R("const today=()=>new Date().toISOString().slice(0,10);","const today=()=>{const d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};const pdt=d=>new Date(String(d).length===10?d+'T12:00:00':d);")
R("const dde=d=>d?new Date(d).toLocaleDateString('de-DE'):'–';","const dde=d=>d?pdt(d).toLocaleDateString('de-DE'):'–';")
R("const shortD=d=>d?new Date(d).toLocaleDateString(LOC,","const shortD=d=>d?pdt(d).toLocaleDateString(LOC,")
R("d.transaction('kv','readwrite').objectStore('kv').put(S,'state')}catch(e){try{localStorage.setItem('inciheinz',JSON.stringify(S))}catch(_){}}}","{const tx=d.transaction('kv','readwrite');tx.objectStore('kv').put(S,'state');tx.onerror=tx.onabort=()=>toast('Speichern fehlgeschlagen. Bitte eine Sicherung erstellen.')}}catch(e){try{localStorage.setItem('inciheinz',JSON.stringify(S))}catch(_){toast('Speichern nicht möglich. Bitte eine Sicherung erstellen.')}}}")
R("return l.slice().sort((a,b)=>{const x=key(a),y=key(b);","const KC=new Map(l.map(i=>[i.id,key(i)]));return l.slice().sort((a,b)=>{const x=KC.get(a.id),y=KC.get(b.id);")

R("Mengen und Details trägst du später nach.</div>","Mengen und Details trägst du später nach.</div><div class=\"hint\" style=\"margin:-6px 0 12px\">Der Katalog ist nur eine Vorschlagsliste. Erst was du antippst, kommt in dein Lager.</div>")
R('<div class="cap" style="margin:14px 0 2px">Katalog-Treffer</div><div id="hits"></div><button class="pill"','<div class="cap" style="margin:14px 0 2px">Vorschläge aus dem Katalog</div><div id="hits"></div><button class="pill"')

R("<span class=\"s\" style=\"overflow-wrap:anywhere\">${esc(i.inci||'')}</span>${ist}</div>","<span class=\"s\" style=\"overflow-wrap:anywhere\">${esc(i.inci||'')}</span></div>${ampel(i)}")

R("it('scan','Scannen','scan')","it('scan','Eingabe','scan')")
R("header('SCANNEN')","header('EINGABE')")

R("${cats[k].length} · ${Object.keys(sums).map(x=>fmt(sums[x],x)).join(' + ')}","${cats[k].length}${Object.keys(sums).some(x=>sums[x]>0)?' · '+Object.keys(sums).filter(x=>sums[x]>0).map(x=>fmt(sums[x],x)).join(' + '):''}")
R("class=\"card ${cols.length>3?'sc':''}\" style=\"overflow:","class=\"card ${cols.length>3?'sc':''}\" style=\"overflow:")
css+="#toast{top:60px!important;bottom:auto!important;text-align:center;background:#24332b!important}.nm{display:block!important;overflow-wrap:break-word!important;word-break:normal!important;-webkit-hyphens:auto;hyphens:auto}.nm .t{display:block;overflow-wrap:break-word;word-break:normal;-webkit-hyphens:auto;hyphens:auto}.ri{margin-top:3px}.card.nl .lead{display:none}.card.nl .th,.card.nl .tr{padding-left:12px;padding-right:12px;gap:6px}.card.sc .nm{overflow-wrap:break-word!important}"
R('<span class="ri">${statusIcons(i)}</span>','${statusIcons(i)?`<span class="ri">${statusIcons(i)}</span>`:\'\'}')
R('m.innerHTML=head+body+`<button class="btn" style="width:100%;margin-top:16px" onclick="sheetExport()">Bestellliste exportieren …</button>`}','m.innerHTML=head+body}')
R("${esc(p.x)} · ${p.c!=null?eur(p.c):'–'}","${esc(p.x)}${p.c!=null?' · '+eur(p.c):''}")
R("<div style=\"font-size:.88rem\">${c!=null?eur(c):'–'}</div>","<div style=\"font-size:.88rem\">${c!=null?eur(c):''}</div>")
R("${l?eur(total):'–'}","${l?eur(total):''}")

R(r'''${Q.cat||Q.seg||q||Q.gap?` · <a href="#" class="lnk" onclick="Q.cat='';Q.seg=0;Q.q='';Q.gap='';lager();return false">Filter zurücksetzen</a>`:''}''',r'''${lagerDirty(q)?` · <a href="#" class="lnk" onclick="lagerReset();return false">Zurücksetzen</a>`:''}''')
R("unk:['Menge unbekannt',","unk:['Ohne Menge',")
R("inciOpen:['INCI nicht geprüft',","inciOpen:['INCI ungeprüft',")
R('<meta name="viewport" content="width=device-width,initial-scale=1">','<meta name="viewport" content="width=device-width,initial-scale=1,interactive-widget=resizes-content">')

R("const COLORDER=['menge','mhd','ordered','neu','chg','preis','inci','verw'];","const COLORDER=['menge','mhd','ordered','neu','chg','preis','verw'];")
