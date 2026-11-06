/* =====================================================================
   js23: Entwurf, Zurück-Geste, Tastatur, Ziehen, Foto, Menüs, Rezept-Import/Export
   ===================================================================== */
/* ---------- Tastatur: Speichern-Leiste und Kopf weichen ---------- */
let HMAX=window.innerHeight;
const isTxt=e=>!!e&&((e.tagName==='INPUT'&&!/^(checkbox|radio|file|button|submit|range|color)$/i.test(e.type))||e.tagName==='TEXTAREA');
function kbSync(){const foc=isTxt(document.activeElement);if(!foc||window.innerHeight>HMAX)HMAX=window.innerHeight;document.documentElement.classList.toggle('kb',foc&&window.innerHeight<HMAX-120)}
['focusin','focusout','resize'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(kbSync,60)));

/* ---------- Zurück-Geste von Android: einen Schritt zurück, nie die App schließen ---------- */
let HD=0,HIGN=0,HBUSY=false,HT=null;
try{history.replaceState({n:0},'')}catch(_){}
const hDepth=()=>stack.length+(document.getElementById('sheet')?1:0)+(document.getElementById('sheet2')?1:0);
function hSync(){clearTimeout(HT);HT=setTimeout(hDo,30)}
function hDo(){if(HBUSY)return;const d=hDepth();try{if(d>HD){for(let k=HD+1;k<=d;k++)history.pushState({n:k},'');HD=d}else if(d<HD){HBUSY=true;HIGN=1;const k=HD-d;HD=d;history.go(-k)}}catch(_){HBUSY=false;HIGN=0}}
window.addEventListener('popstate',e=>{if(HIGN){HIGN=0;HBUSY=false;hSync();return}
const k=(e.state&&e.state.n)||0;HD=k;
if(document.getElementById('sheet2'))closePick();else if(document.getElementById('sheet'))closeSheet();else if(stack.length)back();
hSync()});
['openSheet','closeSheet','draw','pick','closePick'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){const r=f.apply(this,arguments);hSync();return r}});

/* ---------- Entwurf: nichts geht verloren, auch wenn Android die App beendet ---------- */
var OCRCB=null;
let DR_LAST='',DR_PEND=null;
const DR_KEY='inciheinz-draft';
function draftSnap(){if(R.name==='reze'&&RE&&RE.dirty)return JSON.stringify({v:1,kind:'reze',RE,R:{name:'reze',id:RE.id}});
if(R.name==='misch'&&RM&&RM.touched)return JSON.stringify({v:1,kind:'misch',RM,R:{name:'misch',id:R.id,ver:R.ver}});return ''}
function draftPut(s){const o=JSON.parse(s);o.t=Date.now();try{localStorage.setItem(DR_KEY,JSON.stringify(o))}catch(e){try{if(o.RE){o.RE.photo='';localStorage.setItem(DR_KEY,JSON.stringify(o))}}catch(_){}}}
function draftFlush(){const s=draftSnap();if(s&&s!==DR_LAST){DR_LAST=s;draftPut(s)}}
function draftClear(){DR_LAST='';DR_PEND=null;try{localStorage.removeItem(DR_KEY)}catch(_){}}
setInterval(()=>{const s=draftSnap();if(s){if(s!==DR_LAST){DR_LAST=s;draftPut(s)}}else if(!DR_PEND&&DR_LAST)draftClear()},1200);
window.addEventListener('pagehide',draftFlush);document.addEventListener('visibilitychange',()=>{if(document.hidden)draftFlush()});
function draftCheck(){let d=null;try{d=JSON.parse(localStorage.getItem(DR_KEY)||'null')}catch(_){}
if(!d||!d.kind||Date.now()-d.t>14*864e5||(d.kind==='misch'&&!rzGet(d.R.id))){if(d)draftClear();return}
if(RE||RM)return;DR_PEND=d;const dt=new Date(d.t);const when=dde(dt.toISOString().slice(0,10))+', '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0')+' Uhr';
const nm=d.kind==='reze'?(d.RE.d.name||''):(()=>{const r=rzGet(d.R.id);return r?rzCurV(r).d.name:''})();
openSheet(`<h2>Entwurf gefunden</h2><div style="font-size:.92rem;line-height:1.45">${d.kind==='reze'?'Dein Rezept':'Deine Mischung'}${nm?` <b class="nm">${esc(nm)}</b>`:''} war noch in Arbeit (${when}). Möchtest du dort weitermachen?</div><div class="btns"><button class="btn" onclick="draftRestore()">Weiter bearbeiten</button><button class="btn sec" onclick="draftDrop()">Verwerfen</button></div>`)}
function draftRestore(){const d=DR_PEND;DR_PEND=null;if(!d)return;closeSheet();
if(d.kind==='reze'){RE=d.RE;RE.dirty=true;stack=[{name:'rez',id:null}];R={name:'reze',id:RE.id}}else{RM=d.RM;stack=[{name:'rez',id:null}];R={name:'misch',id:d.R.id,ver:d.R.ver};rzWake(true)}draw()}
function draftDrop(){draftClear();closeSheet()}
(async()=>{for(let k=0;k<150;k++){let ok=false;try{ok=S&&S.seeded&&document.getElementById('view')&&document.getElementById('view').children.length}catch(_){}if(ok)break;await new Promise(r=>setTimeout(r,100))}try{draftCheck()}catch(_){}})();

/* ---------- Ziehen am Griff (Module und Phasen) ---------- */
let DRG=null;
function rzDrag(ev,sel,done){if(ev.button>0)return;ev.preventDefault();ev.stopPropagation();const g=ev.currentTarget;const item=g.closest(sel);if(!item)return;const cont=item.parentElement;const main=document.getElementById('main');
cont.classList.add('rz-dragging');const r0=item.getBoundingClientRect();
DRG={item,cont,sel,main,done,g,grab:Math.min(ev.clientY-r0.top,Math.max(r0.height-6,6)),y:ev.clientY,pid:ev.pointerId};item.classList.add('rz-drag-on');
window.addEventListener('pointermove',rzDragMove);window.addEventListener('pointerup',rzDragEnd);window.addEventListener('pointercancel',rzDragEnd);
try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}
DRG.timer=setInterval(rzDragTick,16);rzDragTick()}
function rzDragMove(ev){if(DRG)DRG.y=ev.clientY}
function rzDragTick(){const d=DRG;if(!d)return;const mr=d.main.getBoundingClientRect();if(d.y<mr.top+70)d.main.scrollTop-=12;else if(d.y>mr.bottom-70)d.main.scrollTop+=12;
d.item.style.transform='';const h=d.item.getBoundingClientRect().height;const cy=d.y-d.grab+h/2;
const sibs=[...d.cont.children].filter(e=>e!==d.item&&e.matches(d.sel));let before=null;for(const s of sibs){const r=s.getBoundingClientRect();if(cy<r.top+r.height/2){before=s;break}}
const cur=d.item.nextElementSibling&&d.item.nextElementSibling.matches(d.sel)?d.item.nextElementSibling:(()=>{let n=d.item.nextElementSibling;while(n&&!n.matches(d.sel))n=n.nextElementSibling;return n})();
if(before!==cur){if(before)d.cont.insertBefore(d.item,before);else d.cont.appendChild(d.item)}
d.item.style.transform='';const top0=d.item.getBoundingClientRect().top;d.item.style.transform=`translateY(${d.y-d.grab-top0}px)`}
function rzDragEnd(){const d=DRG;if(!d)return;DRG=null;clearInterval(d.timer);window.removeEventListener('pointermove',rzDragMove);window.removeEventListener('pointerup',rzDragEnd);window.removeEventListener('pointercancel',rzDragEnd);
d.item.style.transform='';d.item.classList.remove('rz-drag-on');d.cont.classList.remove('rz-dragging');
const ids=[...d.cont.children].filter(e=>e.matches(d.sel)).map(e=>e.dataset.id);d.done(ids)}

/* ---------- Foto des fertigen Produkts ---------- */
let RZPHCB=null;
function rzImgScale(f,max,q){return createImageBitmap(f).then(bm=>{const k=Math.min(1,max/Math.max(bm.width,bm.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(bm.width*k));c.height=Math.max(1,Math.round(bm.height*k));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bm,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q||.82)})}
function rzPhotoSheet(cb){RZPHCB=cb;openSheet(`<h2>Foto des fertigen Produkts</h2><div class="s" style="margin:4px 0 10px">Das Foto liegt nur auf deinem Gerät. Du kannst es später auf Rezeptkarten und in Publikationen verwenden.</div><div class="btns col"><button class="btn" onclick="rzPhotoGo('cam')">Kamera</button><button class="btn sec" onclick="rzPhotoGo('gal')">Galerie</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function rzPhotoGo(m){const i=document.createElement('input');i.type='file';i.accept='image/*';if(m==='cam')i.setAttribute('capture','environment');i.style.display='none';
i.onchange=async()=>{const f=i.files&&i.files[0];i.remove();if(!f)return;try{const u=await rzImgScale(f,1000,.82);closeSheet();const cb=RZPHCB;RZPHCB=null;if(cb)cb(u)}catch(e){toast('Das Bild konnte nicht gelesen werden')}};document.body.appendChild(i);i.click()}
function rzPhotoMenu(id){const r=rzGet(id);if(!r)return;
openSheet(`<h2>Foto</h2>${rowH(['photo',r.photo?'Foto ändern':'Foto hinzufügen','',`rzPhotoSheet(u=>{rzGet('${id}').photo=u;save();draw();toast('Foto gespeichert')})`])}${r.photo?rowH(['trash','Foto entfernen','',`closeSheet();delete rzGet('${id}').photo;save();draw()`,'var(--err)']):''}`)}

/* ---------- Mehr-Menüs: je Bereich eigene Einträge, unten die gemeinsamen Einstellungen ---------- */
let SETCTX='app';
const mcap=t=>`<div class="cap" style="margin:12px 0 0">${t}</div>`;
const mrows=a=>a.map(x=>rowH([x[0],x[1],x[3]||'',x[2]])).join('');
const mAppBlock=()=>mcap('Für die ganze App')+`<div class="s" style="margin:2px 0 2px">Gilt für Lager und Rezeptbuch gleichermaßen, hier und dort dasselbe.</div>`+mrows([['gear','Einstellungen',"sheetAppSet()",'Sprache, Expertenmodus'],['shield','Sicherung der ganzen App',"sheetBackup()",'Backup speichern und laden, Schritt zurück'],['book','Anleitung',"sheetHilfe()"],['info','Info',"sheetInfo()"]]);
sheetMehr=function(){const rz=document.getElementById('app')&&document.getElementById('app').classList.contains('rez');
if(rz)openSheet(mcap('Rezeptbuch')+mrows([['import','Rezepte importieren',"sheetRzImport()",'Aus Notizen: Text einfügen oder Foto lesen'],['export','Exportieren &amp; Publizieren',"sheetRzExport()",'Rezeptkarte, Rezeptbuch, Chargenprotokoll, Sicherung']])+mcap('Rezept-Einstellungen')+mrows([['gear','Module &amp; Rundung',"sheetRzSet()",'Welche Bausteine du beim Schreiben nutzt']])+mAppBlock());
else openSheet(mcap('Arbeiten')+mrows([['tag','Etiketten &amp; Druck',"sheetLabels()"],['cart','Einkaufsliste',"tab('einkauf');closeSheet()"],['stat','Statistik',"closeSheet();go('stat')"]])+mcap('Daten')+mrows([['import','Import',"sheetImport()"],['export','Export',"sheetExpOpen()"],['refresh','Katalog aktualisieren',"sheetCatUpd()"]])+mcap('Lager-Einstellungen')+mrows([['gear','Lagerorte &amp; Lieferanten',"sheetLagerSet()",'Orte für Gefäße, Versandkosten je Lieferant']])+mAppBlock())};
function sheetExpOpen(){sheetExport()}
const scap=t=>`<div class="cap" style="font-size:1rem;font-weight:700;color:var(--pri);letter-spacing:0;text-transform:none;border-bottom:2px solid var(--muted);padding-bottom:6px;margin:0 0 8px">${t}</div>`;
function sheetAppSet(){SETCTX='app';openSheet(`<h2>Einstellungen</h2><div class="s" style="margin-bottom:12px">Diese Einstellungen gelten für die ganze App, im Lager und im Rezeptbuch.</div>
${scap('Sprache')}<button class="selbtn" onclick="pickLang()"><span>${{de:'Deutsch',en:'English',es:'Español'}[LANG]||'Deutsch'}</span><span style="color:var(--sub)">▾</span></button>
<div style="height:26px"></div>${scap('Sichern und zurücknehmen')}${rowH(['shield','Sicherung der ganzen App','Backup speichern und laden',"sheetBackup()"])}${UNDO?rowH(['refresh','Letzte Änderung rückgängig',esc(UNDO.label),"closeSheet();doUndo(true)"]):''}
<div style="height:26px"></div><label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert?'checked':''} onchange="S.expert=this.checked;save();sheetAppSet()"> Expertenmodus (Entwickleroptionen)</label>${S.expert?expertCard():'<div style="height:14px"></div>'}${demoBlockHtml()}`)}
function sheetLagerSet(){SETCTX='lager';openSheet(`<h2>Lager-Einstellungen</h2>${scap('Lagerorte')}<div class="s" style="margin-bottom:6px">Diese Orte kannst du bei Artikeln und Gefäßen auswählen.</div>${S.orte.map((o,n)=>`<div class="row" style="padding:0 2px;cursor:default"><div class="t"><b>${esc(o)}</b></div><button class="ib" style="color:var(--sub)" onclick="delOrt(${n})" aria-label="Entfernen">${ic('x','var(--sub)',20)}</button></div>`).join('')||'<div class="s">Noch keine Orte.</div>'}
<div style="display:flex;gap:8px;margin-top:12px"><input id="no" placeholder="Neuer Lagerort, z. B. Schuhkarton" style="flex:1;min-width:0;height:46px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit"><button class="btn" onclick="addOrt()">Hinzufügen</button></div>
<div style="height:30px"></div>${scap('Lieferanten')}<div class="s" style="margin-bottom:6px">Versandkosten und Webseite je Lieferant. Neue legst du auch direkt bei der Bezugsquelle an.</div>${liefsHtml()}<button class="pill" style="margin-top:10px" onclick="LIEFCB=null;sheetLiefEdit(null)">+ Lieferant hinzufügen</button><div style="height:14px"></div>`)}
sheetSettings=function(){return SETCTX==='lager'?sheetLagerSet():sheetAppSet()};
/* Sicherung: Hinweis auf die getrennten Rezept-Exporte */

/* ---------- Rezept-Einstellungen: Module verwalten, Rundung ---------- */
function sheetRzSet(){SETCTX='rez';const off=S.rzModOff||[];
openSheet(`<h2>Module &amp; Ablauf</h2>${scap('Module')}<div class="s" style="margin-bottom:6px">Diese Bausteine bietest du beim Schreiben eines Rezepts an. Sie sind fest vorgegeben, weil die Dokumente zum Drucken sie verwenden. Bereits angelegte Module bleiben erhalten.</div>
${Object.keys(RZMT).map(k=>`<label class="chk" style="padding:8px 0;border-bottom:1px solid var(--line);margin:0;align-items:center"><input type="checkbox" ${off.includes(k)?'':'checked'} onchange="rzModTog('${k}',this.checked)"> <span style="display:inline-flex;width:28px;justify-content:center">${ic(RZMT[k][1],'var(--pri)',20)}</span> ${RZMT[k][0]}</label>`).join('')}
<div style="height:26px"></div>${scap('Standard-Ablauf')}<div class="s" style="margin-bottom:6px">Diese Titel setzt „Standard-Ablauf einfügen“ als leere Arbeitsschritte in ein Rezept ein. Zum Umsortieren ziehst du am Griff.</div>
<div id="rzablc">${rzAbl().map((x,n)=>`<div class="rz-aw" data-id="${n}" style="display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--line);background:var(--bg)"><span class="rz-grip" onpointerdown="rzDrag(event,'.rz-aw',rzAblOrder)">${rzGrip}</span><b class="nm" style="flex:1;padding:12px 2px">${esc(x)}</b><button class="ib" style="color:var(--sub)" onclick="rzAblDel(${n})" aria-label="Entfernen">${ic('x','var(--sub)',20)}</button></div>`).join('')}</div>
<div style="display:flex;gap:8px;margin-top:10px"><input id="rzab" placeholder="Neuer Schritt, z. B. Abfüllen" style="flex:1;min-width:0;height:46px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit"><button class="btn" onclick="rzAblAdd()">Hinzufügen</button></div>
${S.rzAbl?`<button class="lnk" style="margin-top:8px" onclick="S.rzAbl=null;save();sheetRzSet()">Auf Standard zurücksetzen</button>`:''}<div style="height:14px"></div>`)}
function rzAblOrder(ids){const a=rzAbl().slice();S.rzAbl=ids.map(n=>a[+n]);save()}
function rzModTog(k,on){const a=new Set(S.rzModOff||[]);if(on)a.delete(k);else a.add(k);S.rzModOff=[...a];save()}
function rzAblAdd(){const v=val('rzab').trim();if(!v)return;const a=rzAbl().slice();a.push(v);S.rzAbl=a;save();sheetRzSet()}
function rzAblDel(n){const a=rzAbl().slice();a.splice(n,1);S.rzAbl=a.length?a:null;save();sheetRzSet()}
function rzStepSet(v){S.rezStep=v;save();sheetRzSet()}

/* ---------- Rezepte importieren: Text oder Bild (Notizen) ---------- */
const RZI_U='kg|g|gr|mg|ml|l|%|prozent|tropfen|tr\\.?|el|tl|msp\\.?|prise|stk\\.?|stück';
const rzNum='\\d+(?:[.,]\\d+)?';
const rziA=new RegExp('^(?:[-•*·–]\\s*)?('+rzNum+')\\s*('+RZI_U+')\\s*(?:von\\s+|[:\\-–]\\s*)?(.+?)\\s*$','i');
const rziB=new RegExp('^(?:[-•*·–]\\s*)?([^\\d].*?)[\\s.:–\\-]*\\s('+rzNum+')\\s*('+RZI_U+')\\s*$','i');
const rziPhaseTyp=t=>{t=FOLD(t);if(/wasser|aqua|hydro/.test(t))return 'A';if(/oel|fett|lipid|butter|wachs|heiss|hei(ss|ß)/.test(t))return 'B';if(/kalt|abkuehl|wirkstoff|duft|konserv|waermeempfind/.test(t))return 'C';if(/\bph\b|ph-?einstell/.test(t))return 'D';return ''};
function rziAmount(n,u,name){u=u.toLowerCase().replace(/\.$/,'');let g=num(n)||0,warn='',un='';
if(u==='kg')g*=1000;else if(u==='mg')g/=1000;else if(u==='g'||u==='gr'){}else if(u==='%'||u==='prozent'){warn='Prozentwert als Gramm übernommen'}else if(u==='ml'||u==='l'){if(u==='l')g*=1000;un='ml'}
else{warn='Menge in „'+n+' '+u+'“ bitte in Gramm eintragen';g=0}
return {g,warn,un}}
function rziMatch(n){const f=FOLD(n);if(!f)return {k:'t'};const own=S.items.find(x=>FOLD(x.name)===f)||S.items.find(x=>{const o=FOLD(x.name);return o.length>=4&&(o.startsWith(f+' ')||f.startsWith(o+' '))});if(own)return {k:'i',i:own};
const c=CAT.find(c=>FOLD(c.n)===f)||CAT.find(c=>FOLD(c.n).startsWith(f+' '));if(c)return {k:'c',c};return {k:'t'}}
function rzParse(raw){const lines=String(raw||'').replace(/\r/g,'').split('\n').map(l=>l.replace(/[\u00a0\t]+/g,' ').trim()).filter(Boolean);
const d={name:'',zweck:'',ph:'',ergibt:'',zeit:'',grad:'',phasen:[],mod:[]};const warn=[];let cur=null,mode='z',ing=0;
const newPh=(typ,name)=>{cur={id:uid(),typ,name:name||(typ?'Phase '+typ+' · '+RZPH[typ]:'Zutaten'),z:[]};d.phasen.push(cur);return cur};
const addZ=(name,g,warnTxt,un)=>{if(!cur)newPh('','Zutaten');const m=rziMatch(name);const z={id:uid(),item:m.k==='i'?m.i.id:'',cid:m.k==='i'?(m.i.cid||''):m.k==='c'?m.c.id:'',name:m.k==='i'?m.i.name:m.k==='c'?m.c.n:name,g};
if(un==='ml'){const dn=m.k==='i'&&m.i.dens>0?m.i.dens:(/^(wasser|aqua|dest)/i.test(name)?1:0);if(dn>0)z.g=Math.round(g*dn*1000)/1000;else warn.push(name+': ml ohne Dichte als Gramm übernommen')}
if(warnTxt)warn.push(name+': '+warnTxt);cur.z.push(z);ing++};
for(let line of lines){let m;
if(/^(summe|gesamt|gesamtmenge|total|insgesamt)\b/i.test(line))continue;
if(/^(zutaten|inhaltsstoffe|zutatenliste)\s*:?$/i.test(line)){mode='z';continue}
if(/^(zubereitung|anleitung|herstellung|vorgehen|vorgehensweise|arbeitsschritte|ablauf|so geht['’]?s)\s*:?$/i.test(line)){mode='s';continue}
if(m=line.match(/^(?:rezept|name|titel)\s*:\s*(.+)$/i)){d.name=m[1].trim();continue}
if((m=line.match(/^(?:ergibt|menge|ausbeute)\s*:\s*(.+)$/i))&&!/^\d/.test(line)){d.ergibt=m[1].trim();continue}
if(m=line.match(/^(?:dauer|zeit|zeitaufwand)\s*:\s*(.+)$/i)){d.zeit=m[1].trim();continue}
if(m=line.match(/^(?:ziel-?)?ph(?:-wert)?\s*:\s*(.+)$/i)){d.ph=m[1].trim();continue}
if(m=line.match(/^(?:einsatz(?:zweck)?|zweck|verwendung)\s*:\s*(.+)$/i)){d.zweck=m[1].trim();continue}
if(m=line.match(/^haltbarkeit\s*:\s*(.+)$/i)){d.mod.push({id:uid(),t:'halt',titel:'Haltbarkeit',text:m[1].trim()});continue}
if(m=line.match(/^(achtung|tipp|hinweis|sicherheit|wichtig)\s*:\s*(.+)$/i)){const k=m[1].toLowerCase();d.mod.push({id:uid(),t:'hinweis',titel:k==='tipp'?'Tipp':k==='sicherheit'?'Sicherheit':'Achtung',text:m[2].trim()});continue}
if(m=line.match(/^abf(?:ü|ue)llung\s*:\s*(.+)$/i)){d.mod.push({id:uid(),t:'abfuell',titel:'Abfüllung',text:m[1].trim()});continue}
/* Zutat? */
const bare=line.replace(/^\d+\s*[.)]\s+/,'');let a=line.match(rziA)||bare.match(rziA),b=null;if(!a)b=line.match(rziB)||bare.match(rziB);
if(a&&mode==='z'){const r=rziAmount(a[1],a[2],a[3]);addZ(a[3].replace(/[.,;:]+$/,''),r.g,r.warn,r.un);continue}
if(b&&mode==='z'){const r=rziAmount(b[2],b[3],b[1]);addZ(b[1].replace(/[.,;:\-–]+$/,'').trim(),r.g,r.warn,r.un);continue}
/* Phase? */
if(m=line.match(/^phase\s*([a-d1-4])\b\s*[:.\-–·)]*\s*(.*)$/i)){const t=/[a-d]/i.test(m[1])?m[1].toUpperCase():'ABCD'[+m[1]-1];newPh(t,m[2]?'Phase '+t+' · '+m[2].replace(/:$/,'').trim():'');mode='z';continue}
if(m=line.match(/^([a-d])\s*[:.)]\s*(.{0,40})$/i)){const t=m[1].toUpperCase();newPh(t,m[2]?'Phase '+t+' · '+m[2].replace(/:$/,'').trim():'');mode='z';continue}
if(m=line.match(/^(wasser|öl|oel|fett|heiß|heiss|kalt|wirkstoff|abkühl|duft|konservier)[\wäöüß\- \/]{0,24}?(phase)\s*:?\s*$/i)){const t=rziPhaseTyp(line);newPh(t,line.replace(/:$/,''));mode='z';continue}
if(/^[^\d]{2,40}:$/.test(line)&&mode==='z'&&!/^(rezept|name|titel)/i.test(line)){const nm=line.slice(0,-1).trim();newPh(rziPhaseTyp(nm),nm);continue}
/* Schritt */
const sm=line.match(/^(?:schritt\s*)?\d+\s*[.)\-:]\s+(.+)$/i);
if(sm||mode==='s'||(ing>0&&line.length>25)){d.mod.push({id:uid(),t:'schritt',titel:'',text:(sm?sm[1]:line.replace(/^[-•*·–]\s*/,'')).trim()});continue}
if(!d.name&&!ing&&!cur){d.name=line.replace(/^#+\s*/,'');continue}
d.mod.push({id:uid(),t:'notiz',titel:'',text:line})}
d.phasen=d.phasen.filter(p=>p.z.length);
return {d,warn,ing}}

/* Vorverarbeitung: Fließtext in Zeilen zerlegen (Trenner |, Phasen mitten im Satz, Zutaten per Komma, Schritte als Sätze) */
function rzPre(raw){let t=String(raw||'').replace(/\r/g,'').replace(/^Zutaten gesamt[^\n]*\n(?:[^\n]+\n)*\n?/im,'').replace(/^Phasen[ \t]*\n/im,'').replace(/[ \t]+/g,' ').replace(/\s*[|¦]\s*/g,'\n');
const AMT=/\d[\d.,]*\s*(?:g|kg|mg|ml|l|%)(?![a-zäöü])/i;
t=t.replace(/(phase\s*[a-d1-4]\s*:)([^\n]*?)(?=phase\s*[a-d1-4]\s*:|\n|$)/gi,(m,h,r)=>AMT.test(r)?'\n'+h+'\n'+r.trim()+'\n':'\n'+h+r+'\n');
const HD=/^(zutaten|inhaltsstoffe|zutatenliste|zubereitung|anleitung|herstellung|vorgehen|vorgehensweise|arbeitsschritte|ablauf)\s*:\s*(.+)$/i;
let mode='z';const out=[];
const qs=x=>!AMT.test(x.replace(/\d+\s*%/g,''))&&/\b(nach bedarf|nach wunsch|q\.?\s?s\.?|tropfenweise)\b/i.test(x)&&x.length<70?'0 g '+x:x;
const splitC=l=>{const parts=[];let dp=0,cur='';for(let i=0;i<l.length;i++){const ch=l[i];if(ch==='(')dp++;if(ch===')')dp=Math.max(0,dp-1);if((ch===','||ch===';')&&!dp&&!(ch===','&&/\d$/.test(cur)&&/\d/.test(l[i+1]||''))){parts.push(cur);cur=''}else cur+=ch}parts.push(cur);return parts};
for(let l of t.split('\n')){l=l.trim();if(!l)continue;let m;
if(m=l.match(/^rezeptur\s*:\s*(.+)$/i)||l.match(/^rezept\s*:\s*(.+)$/i)){let n=m[1].trim();const q=n.match(/^(.*?)\s*\((\d[\d.,]*\s*(?:g|kg|ml))\)\s*$/i);if(q){n=q[1].trim();out.push('Rezept: '+n);out.push('Ergibt: '+q[2]);}else out.push('Rezept: '+n);continue}
if(m=l.match(HD)){out.push(m[1]+':');l=m[2].trim();mode=/^zut|^inh/i.test(m[1])?'z':'s'}
else if(/^(zubereitung|anleitung|herstellung|vorgehen|vorgehensweise|arbeitsschritte|ablauf|so geht['’]?s)\s*:?$/i.test(l)){mode='s';out.push(l);continue}
else if(/^(zutaten|inhaltsstoffe|zutatenliste)\s*:?$/i.test(l)){mode='z';out.push(l);continue}
if(mode==='s'&&l.length>40){l.split(/(?<!\b\d\.)(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9])/).forEach(x=>{if(x.trim())out.push(x.trim())});continue}
if(mode==='z'&&(l.match(new RegExp(AMT.source,'gi'))||[]).length>=2&&!/^(achtung|tipp|hinweis|haltbarkeit)/i.test(l)){splitC(l).forEach(x=>{x=x.trim().replace(/[.]+$/,'');if(x)out.push(qs(x))});continue}
if(mode==='z'&&qs(l)!==l){out.push(qs(l.replace(/[.]+$/,'')));continue}
out.push(mode==='z'?l.replace(/(\d)\.$/,'$1'):l)}
return out.join('\n')}
{const _p=rzParse;rzParse=function(raw){const r=_p(rzPre(raw));r.d.phasen.forEach(p=>p.z.forEach(z=>{if(!z.g){r.warn.push(z.name+': keine feste Menge, bitte ergänzen')}}));return r}}
let RZIM=null;
function sheetRzImport(txt){const hasOcr=!!window.OCRCB;
openSheet(`<h2>Rezept importieren</h2><div class="s" style="margin-bottom:6px">Hol ein Rezept aus deinen Notizen. Du siehst vorher eine Vorschau und kannst alles im Editor noch ändern. Es wird nichts gespeichert, bevor du es selbst speicherst.</div>
<div class="two" style="margin:8px 0"><button class="btn sec" onclick="rzOcr('cam')">Kamera</button><button class="btn sec" onclick="rzOcr('gal')">Galerie / Screenshot</button></div>
<label class="fld" style="margin-top:4px"><span>Oder Text einfügen</span><textarea id="rzit" style="min-height:170px" placeholder="Name des Rezepts&#10;Phase A: Wasserphase&#10;80 g Wasser&#10;Phase B: Ölphase&#10;Sheabutter 20 g&#10;1. Alles erwärmen …">${esc(txt||'')}</textarea></label><div class="s" id="er" style="color:var(--err);margin-top:4px"></div>
<div class="cap" style="margin:12px 0 2px">So liest die App deine Notizen</div>
<div style="font-size:.88rem;line-height:1.5">Phasen: „Phase A“, „Wasserphase“, „Ölphase“ oder eine Zeile mit Doppelpunkt am Ende<br>Zutaten: „30 g Sheabutter“ oder „Sheabutter 30 g“ (g, kg, ml, %)<br>Schritte: nummerierte Zeilen oder alles nach „Zubereitung“<br>Hinweise: Zeilen mit „Achtung:“, „Tipp:“, „Haltbarkeit:“<br>Zutaten werden mit deinem Lager und dem Katalog abgeglichen.</div>
<div class="btns"><button class="btn" onclick="rzImportRun()">Text auswerten</button><button class="btn sec" onclick="$('#rzif').click()">Rezeptdatei (.json) öffnen</button></div>
<input type="file" id="rzif" accept=".json,application/json" style="display:none" onchange="rzImportFile(this)">`)}
function rzOcr(m){OCRCB=t=>{sheetRzImport(t);if(!t.trim()){const e=document.getElementById('er');if(e)e.textContent='Im Bild wurde kein Text erkannt. Versuche ein schärferes Bild oder einen Screenshot.'}else toast('Text aus Bild gelesen. Bitte prüfen, dann auswerten.')};ocrPick(m)}
{const sp=sheetProduct;sheetProduct=function(){OCRCB=null;return sp.apply(this,arguments)}}
function rzImportRun(){const t=val('rzit');if(!t.trim()){$('#er').textContent='Bitte zuerst Text einfügen oder ein Foto lesen lassen.';return}
const r=rzParse(t);if(!r.ing){$('#er').textContent='Es wurden keine Zutaten mit Mengen erkannt. Eine Zutat pro Zeile, zum Beispiel „30 g Sheabutter“.';return}RZIM=r;rzImportPrev(t)}
function rzImportPrev(txt){const {d,warn}=RZIM;const nz=d.phasen.reduce((a,p)=>a+p.z.length,0);const ns=d.mod.filter(m=>m.t==='schritt').length;
const tag=z=>z.item?'<span class="s"> · im Lager</span>':z.cid?'<span class="s"> · aus Katalog</span>':'<span class="s"> · freier Text</span>';
openSheet(`<h2>Das habe ich erkannt</h2><div class="rz-t nm" style="font-size:1.2rem">${esc(d.name||'(ohne Namen)')}</div><div class="s" style="margin-bottom:8px">${d.phasen.length} Phase${d.phasen.length===1?'':'n'} · ${nz} Zutat${nz===1?'':'en'} · ${ns} Schritt${ns===1?'':'e'}</div>
<div style="max-height:46vh;overflow:auto">${d.phasen.map(p=>`<div class="cap nm" style="margin:10px 0 2px;text-transform:none;letter-spacing:0;font-size:.9rem">${esc(p.name)}</div>${p.z.map(z=>`<div class="rz-dl"><span class="nm">${esc(z.name)}${tag(z)}</span><span>${z.g>0?rzG(z.g)+' g':'<span class="amb">Menge fehlt</span>'}</span></div>`).join('')}`).join('')}</div>
${warn.length?`<div class="hint" style="margin-top:10px">Bitte prüfen: ${esc(warn.slice(0,6).join('; '))}${warn.length>6?' …':''}</div>`:''}
<div class="btns"><button class="btn" onclick="rzImportOpen()">Im Editor öffnen</button><button class="btn sec" onclick="sheetRzImport(${JSON.stringify(txt||'').replace(/</g,'\\u003c').replace(/"/g,'&quot;')})">Zurück zum Text</button></div>`)}
function rzImportOpen(){if(!RZIM)return;const d=RZIM.d;RZIM=null;RE={id:null,base:0,d:rzPoolFix(d),dirty:true,photo:''};closeSheet();if(R.name==='reze')R={name:'reze',id:null};else{stack.push(R);R={name:'reze',id:null}}draw();toast('Rezept übernommen. Prüfe die Angaben und speichere es.')}
function rzImportFile(inp){const f=inp.files&&inp.files[0];if(!f)return;f.text().then(t=>{inp.value='';let j;try{j=JSON.parse(t)}catch(e){j=null}
if(!j||!(j.rez||j.items)){$('#er').textContent='Diese Datei kann ich nicht lesen. Erwartet wird eine INCIheinz-Rezeptdatei (.json).';return}
if(!j.rez){$('#er').textContent='Das ist eine Sicherung der ganzen App. Lade sie unter Mehr › Sicherung der ganzen App.';return}
rzAll();rzChgAll();let nr=0,nc=0;j.rez.forEach(r=>{if(!S.rez.find(x=>x.id===r.id)){S.rez.push(r);nr++}});(j.chg||[]).forEach(c=>{if(!S.chg.find(x=>x.id===c.id)){S.chg.push(c);nc++}});
if(!nr&&!nc){$('#er').textContent='Alle Rezepte aus der Datei sind schon vorhanden.';return}save();closeSheet();tab('rez');toast(nr+' Rezept'+(nr===1?'':'e')+(nc?' und '+nc+' Charge'+(nc===1?'':'n'):'')+' übernommen')})}

/* ---------- Rezepte exportieren: Publikationen mit Auswahl, Format und Vorauswahl ---------- */
const RZPUB={
card:{ic:'tag',t:'Rezeptkarte',s:'Ein Rezept pro Seite, zum Drucken oder als PDF speichern',need:'Zutaten, Eckdaten, Ablauf und Hinweise, Foto',fm:[['pdf','PDF / Drucken','zum Ansehen, Drucken oder Senden']],opts:[['foto','Foto'],['eck','Eckdaten'],['ablauf','Ablauf und Hinweise'],['inci','INCI-Entwurf'],['sh','Hinweise zu Rohstoffen']]},
book:{ic:'book',t:'Rezeptbuch',s:'Mehrere Rezepte in einem Dokument, mit Titelseite und Inhaltsverzeichnis',need:'Zutaten, Eckdaten, Ablauf und Hinweise, Foto',fm:[['pdf','PDF / Drucken','zum Ansehen, Drucken oder Senden']],opts:[['foto','Foto'],['eck','Eckdaten'],['ablauf','Ablauf und Hinweise'],['inci','INCI-Entwurf'],['sh','Hinweise zu Rohstoffen']]},
chg:{ic:'list',t:'Chargenprotokoll',s:'Tabelle deiner Chargen mit Soll- und Ist-Mengen',need:'Chargen aus der Werkbank, Bewertung und Notizen',fm:[['xlsx','Excel (.xlsx)','öffnet sich überall korrekt'],['csv','CSV (.csv)','UTF-8 mit Semikolon, für Tabellen-Programme'],['pdf','PDF','zum Ansehen, Drucken oder Senden'],['txt','Text','kopieren oder teilen']],opts:[]},
txt:{ic:'export',t:'Rezepte als Text',s:'Gut lesbar, zum Kopieren oder Ablegen. Die App kann ihn über Import wieder einlesen',need:'Zutaten, Phasen, Ablauf und Hinweise, Eckdaten',fm:[['view','Anzeigen und kopieren','zum Einfügen in Messenger oder Notizen'],['file','Datei (.txt)','speichern oder teilen']],opts:[]},
json:{ic:'shield',t:'Rezeptdaten (.json)',s:'Ausgewählte Rezepte mit allen Versionen als Datei, zum Übertragen auf ein anderes Gerät. Die Sicherung der ganzen App liegt unter Einstellungen',need:'alles, was du im Rezeptbuch gepflegt hast',fm:[],opts:[['chg','Chargen'],['foto','Fotos']]}};
let RZX=null,RZMODE='pub';
const RZPUBM={pub:{chg:{t:'Chargenprotokoll',s:'Deine Chargen mit Soll- und Ist-Mengen als Dokument zum Drucken',fm:['pdf']}},data:{chg:{t:'Chargentabelle',s:'Tabelle deiner Chargen mit Soll- und Ist-Mengen, als Excel, CSV oder Text',fm:['xlsx','csv','txt']}}};
function rzpOf(k){const p=RZPUB[k];const o=(RZPUBM[RZMODE]||{})[k];if(!o)return p;return Object.assign({},p,{t:o.t,s:o.s,fm:p.fm.filter(f=>o.fm.includes(f[0]))})}
function sheetRzExport(){openSheet(`<h2>Exportieren &amp; Publizieren</h2><div class="s" style="margin-bottom:6px">Aus deinen Rezepten entstehen hier Dokumente zum Drucken, Weitergeben und Sichern. Jede Publikation nutzt die Module, die du im Rezept gepflegt hast. Je mehr du pflegst, desto vollständiger wird sie.</div>`+Object.keys(RZPUB).map(k=>{const p=RZPUB[k];return rowH([p.ic,p.t,p.s+'<br>Nutzt: '+p.need,`sheetRzPub('${k}')`])}).join('')+`<div class="hint" style="margin:10px 0 0">Die Gestaltung der Dokumente folgt in einem späteren Schritt. Eine Sicherung der ganzen App findest du unter Mehr › Sicherung der ganzen App.</div>`)}
function rzPubDefaultIds(kind){const all=rzAll();let l=all.filter(r=>!r.demo);if(!l.length)l=all.slice();if(kind==='chg')l=l.filter(r=>rzChgAll().some(c=>c.rez===r.id));return new Set(l.map(r=>r.id))}
function sheetRzPub(kind,keep){const p=rzpOf(kind);if(!rzAll().length){sheetMsg('Noch keine Rezepte','Lege zuerst ein Rezept an, dann kannst du es hier exportieren.');return}
if(!keep||!RZX||RZX.kind!==kind){const o={};p.opts.forEach(x=>o[x[0]]=1);RZX={kind,ids:rzPubDefaultIds(kind),fmt:p.fm.length?p.fm[0][0]:'',o}}
const L=rzAll().slice().sort((a,b)=>FOLD(rzCurV(a).d.name)<FOLD(rzCurV(b).d.name)?-1:1);
openSheet(`<h2>${p.t}</h2><div class="s">${p.s}.</div><div class="cap" style="margin:12px 0 2px">Dafür nutzt die App</div><div class="s">${p.need}.</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px"><span class="cap" style="margin:0">Welche Rezepte?</span><span><button class="lnk" style="margin-right:14px" onclick="rzxAll(1)">Alle</button><button class="lnk" onclick="rzxAll(0)">Keine</button></span></div>
<div style="max-height:30vh;overflow:auto;margin-top:4px">${L.map(r=>{const v=rzCurV(r);const nc=rzChgAll().filter(c=>c.rez===r.id).length;return `<label class="chk" style="padding:8px 0;border-bottom:1px solid var(--line);margin:0;align-items:flex-start"><input type="checkbox" data-id="${r.id}" ${RZX.ids.has(r.id)?'checked':''} onchange="rzxTog('${r.id}',this.checked)"> <span><span class="nm">${esc(v.d.name)}</span>${r.demo?' <span class="s">Testrezept</span>':''}<br><span class="s">${kind==='chg'?(nc?nc+(nc===1?' Charge':' Chargen'):'keine Charge'):'Version '+v.n+(r.photo?' · Foto':'')}</span></span></label>`}).join('')}</div>
<div id="rzxc" class="s" style="margin-top:8px"></div>
${p.fm.length>1?`<div class="cap" style="margin:14px 0 2px">Format</div>`+p.fm.map(f=>`<label class="chk" style="align-items:flex-start;margin-top:10px"><input type="radio" name="rzxf" value="${f[0]}" ${RZX.fmt===f[0]?'checked':''} onchange="RZX.fmt=this.value"> <span>${f[1]}<br><span class="s">${f[2]}</span></span></label>`).join(''):''}
${p.opts.length?`<div class="cap" style="margin:14px 0 6px">Das soll enthalten sein</div><div class="tb" style="gap:8px;flex-wrap:wrap">${p.opts.map(x=>`<button type="button" class="pill ${RZX.o[x[0]]?'on':''}" style="width:auto;height:auto" onclick="RZX.o['${x[0]}']=RZX.o['${x[0]}']?0:1;this.classList.toggle('on')">${x[1]}</button>`).join('')}</div>`:''}
<div class="btns"><button class="btn" onclick="rzPubGo()">Erstellen</button><button class="btn sec" onclick="sheetBack()">Zurück</button></div>`);rzxCnt()}
function rzxTog(id,on){if(on)RZX.ids.add(id);else RZX.ids.delete(id);rzxCnt()}
function rzxAll(on){RZX.ids=on?new Set(rzAll().map(r=>r.id)):new Set();sheetRzPub(RZX.kind,true)}
function rzxCnt(){const e=document.getElementById('rzxc');if(!e)return;const ids=[...RZX.ids].map(rzGet).filter(Boolean);const n=ids.length;let t=n+(n===1?' Rezept gewählt':' Rezepte gewählt');
if(RZX.kind==='chg')t+=' · '+rzChgAll().filter(c=>RZX.ids.has(c.rez)).length+' Chargen';else if(['card','book','txt'].includes(RZX.kind)&&n){const f=ids.filter(r=>r.photo).length,a=ids.filter(r=>rzCurV(r).d.mod.length).length;t+=` · Foto bei ${f}, Ablauf bei ${a}`}
e.textContent=t}
function rzTextOf(id,vn){const r=rzGet(id);const v=rzVer(r,vn||rzCurV(r).n);const d=v.d;const sum=rzSum(d);const L=[d.name,'Version '+v.n+' · '+dde(v.date.slice(0,10))];
if(d.zweck)L.push('Einsatzzweck: '+d.zweck);if(d.ph)L.push('Ziel-pH: '+d.ph);if(d.ergibt)L.push('Ergibt: '+d.ergibt);if(d.zeit)L.push('Zeitaufwand: '+rzZeit(d.zeit));if(d.grad)L.push('Schwierigkeit: '+d.grad);
const hl=rzHeadList(d);if(hl.multi){L.push('','Zutaten gesamt');hl.rows.forEach(x=>L.push(rzIv(x.g)+' g '+x.n));L.push('Summe: '+rzIv(sum)+' g','','Phasen')}else L.push('','Zutaten');d.phasen.forEach(p=>{if(!p.z.length)return;if(p.typ||d.phasen.length>1)L.push('',p.name+':');p.z.forEach(z=>L.push(rzIv(z.g)+' g '+rzName(z)))});if(!hl.multi)L.push('Summe: '+rzIv(sum)+' g');
const st=d.mod.filter(m=>m.t==='schritt');if(st.length){L.push('','Zubereitung');let n=0;d.mod.forEach(m=>{if(m.t==='schritt'){n++;L.push(n+'. '+[m.titel,m.text].filter(Boolean).join(': '))}})}
d.mod.filter(m=>m.t!=='schritt').forEach(m=>{const k={hinweis:m.titel||'Hinweis',halt:'Haltbarkeit',abfuell:'Abfüllung',notiz:m.titel||'Notiz'}[m.t];L.push('',k+': '+(m.text||''))});
const inci=rzInci(d).text;if(inci)L.push('','INCI (Entwurf): '+inci);return L.join('\n')}
function rzPubGo(){const p=RZPUB[RZX.kind];const ids=[...RZX.ids].filter(rzGet);if(!ids.length){toast('Bitte mindestens ein Rezept wählen');return}
const L=ids.map(rzGet).sort((a,b)=>FOLD(rzCurV(a).d.name)<FOLD(rzCurV(b).d.name)?-1:1);const o=RZX.o;
if(RZX.kind==='card'||RZX.kind==='book'){if(RZX.kind==='card'&&RZX.fmt==='txt'){sheetText(L.map(r=>rzTextOf(r.id)).join('\n\n----------\n\n'));return}
let css='';const pages=L.map((r,n)=>{const x=rzCardHtml(r.id,rzCurV(r).n,o);css=x.css;return '<div style="'+(n<L.length-1?'page-break-after:always':'')+'">'+x.body+'</div>'}).join('');
let front='';if(RZX.kind==='book'){front=`<div style="page-break-after:always;text-align:center;padding-top:70mm"><h1 style="font-size:34px">Mein Rezeptbuch</h1><div class="s">${L.length} Rezept${L.length===1?'':'e'} · ${dde(today())}</div></div><div style="page-break-after:always"><h2>Inhalt</h2>${L.map(r=>`<div style="padding:4px 0;border-bottom:1px solid #ddd">${esc(rzCurV(r).d.name)}</div>`).join('')}</div>`}
closeSheet();rzPrintDoc(css,RZX.kind==='book'?'INCIheinz Rezeptbuch':rzCurV(L[0]).d.name,front+pages);return}
if(RZX.kind==='chg'){const cs=rzChgAll().filter(c=>RZX.ids.has(c.rez)).sort((a,b)=>a.date<b.date?-1:1);if(!cs.length){toast('Für diese Auswahl gibt es noch keine Charge');return}
const head=['Datum','Rezept','Version','Gesamtmenge (g)','Zutat','Soll (g)','Ist (g)','Bewertung','Notiz'];const rows=[];
cs.forEach(c=>{const r=rzGet(c.rez);const nm=r?rzVer(r,c.ver).d.name:'Gelöschtes Rezept';c.lines.forEach((l,n)=>rows.push([dde(c.date.slice(0,10)),nm,'v'+c.ver,c.total,l.n,Math.round(l.soll*100)/100,Math.round(l.ist*100)/100,n===0&&c.stars?'★'.repeat(c.stars):'',n===0?c.note||'':'']))});
const txt=cs.map(c=>{const r=rzGet(c.rez);return (r?rzVer(r,c.ver).d.name:'Gelöschtes Rezept')+' · '+dde(c.date.slice(0,10))+' · v'+c.ver+' · '+nf(c.total)+' g'+(c.stars?' · '+'★'.repeat(c.stars):'')+'\n'+c.lines.map(l=>'  '+rzG(l.ist)+' g '+l.n+(Math.abs(l.ist-l.soll)>0.001?' (Soll '+rzG(l.soll)+' g)':'')).join('\n')+(c.note?'\n  Notiz: '+c.note:'')}).join('\n\n');
outFile('INCIheinz-Chargen-'+today(),head,rows,RZX.fmt,txt,'Chargen');return}
if(RZX.kind==='txt'){const txt=L.map(r=>rzTextOf(r.id)).join('\n\n----------\n\n');if(RZX.fmt==='file'){dl22('INCIheinz-Rezepte-'+today()+'.txt',new Blob(['﻿'+txt],{type:'text/plain;charset=utf-8'}));closeSheet();toast('Textdatei gespeichert')}else sheetText(txt);return}
if(RZX.kind==='json'){const rez=L.map(r=>{const c=rzClone(r);if(!o.foto)delete c.photo;return c});const d={app:'INCIheinz-Rezepte',v:2,date:new Date().toISOString(),rez,chg:o.chg?rzChgAll().filter(c=>RZX.ids.has(c.rez)):[]};
dl22('INCIheinz-Rezepte-'+today()+'.json',new Blob([JSON.stringify(d)],{type:'application/json'}));closeSheet();toast('Rezeptdaten gespeichert')}}
function rzPrintBook(){RZX={kind:'book',ids:rzPubDefaultIds('book'),fmt:'pdf',o:{foto:1,eck:1,ablauf:1,inci:1,sh:1}};rzPubGo()}


/* ---------- Mehr-Menüs v2: gleiche Gliederung in beiden Bereichen ---------- */
const mAppBlock2=()=>mcap('Für die ganze App')+mrows([['gear','Einstellungen',"sheetAppSet()",'Sprache, Sicherung, Rückgängig, Anleitung, Info, Expertenmodus']]);
sheetMehr=function(){const rz=document.getElementById('app')&&document.getElementById('app').classList.contains('rez');
if(rz)openSheet(mrows([['stat','Statistik',"rzStatSheet()",'Rezepte, Chargen, häufige Zutaten']])+mcap('Drucken &amp; Gestalten')+mrows([['book','Rezepte &amp; Chargen',"sheetRzExport('pub')",'Rezepte wählen, Vorlage wählen, drucken']])+mcap('Daten')+mrows([['import','Import',"sheetRzImport()",'Rezepte aus Text, Foto oder Datei'],['export','Export',"sheetRzExport('data')",'Listen: Rezepte als Text, Chargentabelle'],['export','Rezept teilen',"sheetRzShare()",'Ein fertiges Rezept als schönes PDF verschicken']])+mcap('Voreinstellungen Rezeptbuch')+mrows([['gear','Module &amp; Ablauf',"sheetRzSet()",'Bausteine und Standard-Ablauf']])+mAppBlock2());
else openSheet(mrows([['stat','Statistik',"closeSheet();go('stat')"]])+mcap('Drucken &amp; Gestalten')+mrows([['tag','Etiketten',"sheetLabels()",'Rohstoffe wählen, Vorlage wählen, drucken']])+mcap('Daten')+mrows([['import','Import',"sheetImport()",'Artikel und Preise aus Listen'],['export','Export',"sheetExpOpen()",'Listen: Einkaufsliste, Bestandstabelle']])+mcap('Voreinstellungen Lager')+mrows([['gear','Lagerorte &amp; Lieferanten',"sheetLagerSet()",'Orte für Gefäße, Versandkosten je Lieferant']])+mAppBlock2())};
sheetRzExport=function(mode){const pub=mode==='pub';RZMODE=pub?'pub':'data';const keys=Object.keys(RZPUB).filter(k=>pub?(k==='card'||k==='book'||k==='chg'):(k==='txt'||k==='chg'||k==='json'));
openSheet(`<h2>${pub?'Rezepte &amp; Chargen drucken':'Rezepte exportieren'}</h2><div class="s" style="margin-bottom:6px">${pub?'Du wählst ein Dokument, dann die Rezepte, dann geht es zum Drucken. Jedes Dokument nutzt die Module, die du im Rezept gepflegt hast. Je mehr du pflegst, desto vollständiger wird es.':'Listen und Dateien zum Auswerten oder Übertragen. Ein fertiges Rezept zum Zeigen oder Verschicken findest du unter „Rezept teilen“.'}</div>`+keys.map(k=>{const p=rzpOf(k);return rowH([p.ic,p.t,p.s+'<br>Nutzt: '+p.need,`sheetRzPub('${k}')`])}).join('')+(pub?`<div class="hint" style="margin:10px 0 0">Die Gestaltung der Dokumente folgt in einem späteren Schritt.</div>`:''))};
function rzStatData(){const all=rzAll(),chg=rzChgAll();const cnt={},zw={};let nv=0,mix=0;
all.forEach(r=>{nv+=r.vers.length;const v=rzCurV(r);const sn=new Set();(v.d.phasen||[]).forEach(p=>p.z.forEach(z=>{const nm=(S.items.find(i=>i.id===z.item)||{}).name||z.name;if(!nm||sn.has(nm))return;sn.add(nm);cnt[nm]=(cnt[nm]||0)+1}));const k=(v.d.zweck||'').trim()||'ohne Angabe';zw[k]=(zw[k]||0)+1;try{if(rzStat(r).cls==='ok')mix++}catch(e){}});
const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);const zwl=Object.entries(zw).sort((a,b)=>b[1]-a[1]);
const st=chg.filter(c=>c.stars>0);return {n:all.length,nv,mix,top,zw:zwl,nc:chg.length,avg:st.length?st.reduce((a,c)=>a+c.stars,0)/st.length:0,last:chg.slice().sort((a,b)=>a.date<b.date?1:-1)[0]}}
function rzStatSheet(){closeSheet();stack.push(R);R={name:'rzstat'};draw()}
function rzStatPage(){const D=rzStatData();window.RSD=D;const W=(k,t,body,w2)=>`<div class="card wg${w2?' w2':''}" ${k?`onclick="rzStatDet('${k}')"`:''}><h3>${t}</h3>${body}</div>`;const none=t=>`<div class="s">${t}</div>`;
$('#main').innerHTML=`<div style="font-size:1.2rem;font-weight:600;letter-spacing:-.02em">Statistik Rezeptbuch</div><div class="s" style="margin:6px 0 14px">Alles wird auf diesem Gerät berechnet. Tippe eine Kachel für Details.</div><div class="wgs">
${W('rez','Rezepte',D.n?`<div class="big">${D.n}</div><div class="s" style="margin-top:6px">${D.nv} Versionen insgesamt</div>`:none('Noch keine Rezepte'))}
${W('mix','Mischbar',D.n?`<div style="display:flex;align-items:center;gap:10px">${ring(Math.round(D.mix/D.n*100),76)}<div class="s" style="font-size:.8rem">${D.mix} von ${D.n} mit deinem Lager</div></div>`:none('Noch keine Rezepte'))}
${W('chg','Chargen',D.nc?`<div class="big">${D.nc}</div><div class="s" style="margin-top:6px">${D.avg?'Ø '+D.avg.toFixed(1).replace('.',',')+' Sterne':'noch ohne Bewertung'}</div>`:none('Noch keine Charge gemischt'))}
${W('zw','Nach Einsatzzweck',D.zw.length?`<div style="display:flex;align-items:center;gap:10px">${donut(D.zw.slice(0,7).map((k,n)=>({v:k[1],c:PAL[n]})),76)}<div class="s" style="font-size:.8rem">${D.zw.length} Einsatzzwecke</div></div>`:none('Noch keine Rezepte'),0)}
${W('top','Häufigste Zutaten',D.top.length?hbars(D.top.slice(0,4).map(x=>({l:x[0],v:x[1],t:x[1]+'×'}))):none('Noch keine Rezepte'),1)}
</div><div class="hint" style="margin-top:12px">Rezeptkategorien wie Shampoo, Creme oder Serum folgen. Bis dahin zählt der Einsatzzweck.</div>`}
function rzStatDet(k){const D=window.RSD||rzStatData();let h='';
if(k==='rez'||k==='mix'){h=`<h2>${k==='rez'?'Rezepte':'Mischbar'}</h2><div class="s">${k==='rez'?'Alle Rezepte im aktuellen Stand.':'Rezepte, für die dein Lager aktuell alles hat.'}</div>`+rzAll().filter(r=>k==='rez'||(()=>{try{return rzStat(r).cls==='ok'}catch(e){return false}})()).map(r=>`<div class="kv" style="cursor:pointer" onclick="closeSheet();rzOpen('${r.id}')"><span class="nm">${esc(rzCurV(r).d.name)}</span><span>v${rzCurV(r).n}</span></div>`).join('')}
else if(k==='chg'){h=`<h2>Chargen</h2>`+(rzChgAll().slice().sort((a,b)=>a.date<b.date?1:-1).slice(0,12).map(c=>{const r=rzGet(c.rez);return `<div class="kv"><span class="nm">${esc(r?rzCurV(r).d.name:'?')}</span><span>${String(c.date).slice(0,10)}</span></div>`}).join('')||'<div class="s">Noch keine Charge.</div>')}
else if(k==='zw'){h=`<h2>Nach Einsatzzweck</h2><div class="s">Aus dem Feld „Einsatzzweck“ der Rezepte. Echte Kategorien folgen.</div>`+D.zw.map(x=>`<div class="kv"><span class="nm">${esc(x[0])}</span><span>${x[1]}</span></div>`).join('')}
else{h=`<h2>Häufigste Zutaten</h2><div class="s">In wie vielen Rezepten ein Rohstoff vorkommt.</div>`+D.top.slice(0,20).map(x=>`<div class="kv"><span class="nm">${esc(x[0])}</span><span>${x[1]}×</span></div>`).join('')}
openSheet(h)}
sheetAppSet=function(){SETCTX='app';openSheet(`<h2>Einstellungen</h2><div class="s" style="margin-bottom:12px">Diese Einstellungen gelten für die ganze App, im Lager und im Rezeptbuch.</div>
${scap('Sprache')}<button class="selbtn" onclick="pickLang()"><span>${{de:'Deutsch',en:'English',es:'Español'}[LANG]||'Deutsch'}</span><span style="color:var(--sub)">▾</span></button>
<div style="height:26px"></div>${scap('Sichern und zurücknehmen')}${rowH(['shield','Sicherung der ganzen App','Backup speichern und laden',"sheetBackup()"])}${UNDO?rowH(['refresh','Letzte Änderung rückgängig',esc(UNDO.label),"closeSheet();doUndo(true)"]):rowH(['refresh','Letzte Änderung rückgängig','Noch nichts zum Zurücknehmen','','var(--sub)'])}
<div style="height:26px"></div>${scap('Katalog')}${rowH(['refresh','Katalog aktualisieren',(S.catmeta&&S.catmeta.version?'Katalog '+esc(S.catmeta.version):'Grundkatalog der App')+' · '+CAT.length+' Einträge',"sheetCatUpd()"])}<div style="height:26px"></div>${scap('Genauigkeit der Mengen')}${accHtml()}<div style="height:26px"></div>${scap('Hilfe')}${rowH(['book','Anleitung','',"sheetHilfe()"])}${rowH(['info','Info','',"sheetInfo()"])}
<div style="height:26px"></div>${scap('Expertenmodus')}<label class="chk" style="margin:0 0 4px"><input type="checkbox" ${S.expert?'checked':''} onchange="S.expert=this.checked;save();sheetAppSet()"> Expertenmodus (Entwickleroptionen)</label>${S.expert?expertCard()+scap('Testbetrieb')+demoBlockHtml():'<div style="height:14px"></div>'}`)};
sheetSettings=function(){return SETCTX==='lager'?sheetLagerSet():SETCTX==='rez'?sheetRzSet():sheetAppSet()};

{const _e=sheetExport;sheetExport=function(){_e();const s=shEl();if(s)s.innerHTML=s.innerHTML.replace('unter Mehr › Sicherung.','unter Mehr › Einstellungen › Sicherung der ganzen App.')}}

/* ---------- Genauigkeit der Mengen (global, getrennt für Lager und Rezeptbuch) ---------- */
function lagerDec(){return S.lagerDec==null?2:S.lagerDec}
{const _f=fmt;fmt=function(b,k){const d=lagerDec();if(d<2&&(+b||0)>=1){const m=Math.pow(10,d);b=Math.round(b*m)/m}return _f(b,k)}}
function accSet(w,v){if(w==='l')S.lagerDec=v;else S.rezStep=v;save();try{draw()}catch(e){}sheetAppSet()}
{const _sl=setLang;setLang=function(l){_sl(l);sheetAppSet();try{trWalk($("#app"))}catch(e){}}}
function accHtml(){const st=rzStep(),ld=lagerDec();
const pills=(arr,on,fn)=>`<div class="tb" style="gap:8px;flex-wrap:wrap">${arr.map(o=>`<button type="button" class="pill ${on(o[0])?'on':''}" style="width:auto;height:auto" onclick="${fn(o[0])}">${o[1]}</button>`).join('')}</div>`;
return `<div class="s" style="margin-bottom:6px">Getrennt einstellbar: im Lager reichen meist ganze Gramm oder Milliliter, im Rezeptbuch wiegst du genauer.</div>
<div class="cap" style="margin:8px 0 6px">Lager (Mengen anzeigen)</div>${pills([[0,'ganze g / ml'],[1,'0,1'],[2,'0,01']],v=>ld===v,v=>`accSet('l',${v})`)}
<div class="cap" style="margin:14px 0 6px">Rezeptbuch (Rechner und Werkbank)</div>${pills([[0.01,'0,01 g'],[0.1,'0,1 g'],[0.5,'0,5 g'],[1,'1 g']],v=>Math.abs(st-v)<1e-9,v=>`accSet('r',${v})`)}
<div class="s" style="margin-top:6px">Mit einer Küchenwaage wählst du 1 g oder 0,5 g, mit einer Feinwaage 0,01 g.</div>`}

/* ---------- Etiketten: mehrere Größen in einem Druck ---------- */
LB.sizes={M:1};LB.cnt={S:1,M:1,L:1};LB.mix=true;
const LBSZ={S:'Klein 38×21',M:'Mittel 48×25',L:'Groß 63×38'};
const lbSel=()=>Object.keys(LBSZ).filter(k=>LB.sizes[k]);
function lbSizeTog(k){if(LB.sizes[k]){if(lbSel().length>1)delete LB.sizes[k]}else LB.sizes[k]=1;lbRender()}
function lbCnt(k,d){LB.cnt[k]=Math.max(1,Math.min(20,(LB.cnt[k]||1)+d));lbRender2();lbCntShow()}
function lbCntShow(){lbSel().forEach(k=>{const e=document.getElementById('lbc_'+k);if(e)e.textContent=LB.cnt[k]})}
sheetLabels=function(){if(!S.items.length){sheetMsg('Keine Rohstoffe','Lege zuerst Rohstoffe an, dann kannst du Etiketten drucken.');return}
openSheet(`<h2>Etiketten</h2><div class="cap" style="margin:6px 0">Größen</div><div class="s" style="margin-bottom:6px">Du kannst mehrere wählen, zum Beispiel klein für die Flasche und groß für den Karton.</div><div id="lbs"></div>
<div id="lbp" style="margin:12px 0 4px;overflow:hidden"></div>
<div class="cap" style="margin:12px 0 4px">Rohstoffe wählen</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px"><button class="pill" onclick="lbAll(1)">Alle</button><button class="pill" onclick="lbAll(0)">Keine</button><button class="pill" onclick="lbNew()">Noch nicht gedruckt</button></div>
<div id="lbl" style="max-height:34vh;overflow-y:auto;border:1px solid var(--line);border-radius:12px;padding:4px 12px"></div>
<label class="chk"><input type="checkbox" ${LB.mark?'checked':''} onchange="LB.mark=this.checked"> Danach als gedruckt markieren</label>
<label class="chk"><input type="checkbox" ${LB.mix?'checked':''} onchange="LB.mix=this.checked"> Alle Größen platzsparend auf einem Bogen (zum Ausschneiden)</label>
<div class="btns"><button class="btn" id="lbgo" onclick="lbPrint()">Drucken</button></div>
<div class="hint">Der Druckdialog deines Geräts öffnet sich. Wähle dort „Tatsächliche Größe“ bzw. 100 %, damit die Etiketten maßgetreu bleiben. Ohne Haken beginnt jede Größe auf einem neuen Bogen, damit du das passende Etikettenpapier einlegen kannst.</div>`);lbRender()}
lbRender=function(){
$('#lbs').innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap">${Object.keys(LBSZ).map(k=>`<button class="pill" style="${LB.sizes[k]?'background:var(--pri);color:#fff;border-color:var(--pri)':''}" aria-pressed="${!!LB.sizes[k]}" onclick="lbSizeTog('${k}')">${LB.sizes[k]?'✓ ':''}${LBSZ[k]} mm</button>`).join('')}</div>
${lbSel().length>1||LB.cnt[lbSel()[0]]>1||1?lbSel().map(k=>`<div style="display:flex;align-items:center;gap:10px;margin-top:8px"><span style="flex:1;font-size:.9rem">${LBSZ[k]} mm · Stück je Rohstoff</span><button class="pill" style="width:40px;height:40px" onclick="lbCnt('${k}',-1)" aria-label="weniger">−</button><b id="lbc_${k}" style="min-width:22px;text-align:center">${LB.cnt[k]}</b><button class="pill" style="width:40px;height:40px" onclick="lbCnt('${k}',1)" aria-label="mehr">+</button></div>`).join(''):''}`;
const l=S.items.slice().sort((a,b)=>a.name.localeCompare(b.name));
$('#lbl').innerHTML=l.map(i=>`<label class="chk" style="margin:0;padding:8px 0;align-items:center"><input type="checkbox" ${LB.sel[i.id]?'checked':''} onchange="LB.sel['${i.id}']=this.checked;lbRender2()"> <span style="min-width:0;overflow-wrap:anywhere">${esc(i.name)}${i.gedr?` <span class="s">· gedruckt ${dde(i.gedr)}</span>`:''}</span></label>`).join('');lbRender2()};
lbRender2=function(){const l=S.items.filter(i=>LB.sel[i.id]);const first=l[0]||S.items[0];
$('#lbp').innerHTML=first?`<div class="s" style="margin-bottom:4px">Vorschau</div>${lbSel().map(k=>`<div style="margin-bottom:8px"><div class="s" style="font-size:.78rem">${LBSZ[k]} mm</div>${labelHtml(first,k)}</div>`).join('')}`:'';
const n=l.length*lbSel().reduce((a,k)=>a+(LB.cnt[k]||1),0);$('#lbgo').textContent=n?`${n} ${n===1?'Etikett':'Etiketten'} drucken`:'Drucken'};
lbPrint=function(){const l=S.items.filter(i=>LB.sel[i.id]);if(!l.length){toast('Bitte Rohstoffe auswählen');return}
const ks=lbSel();let p=document.getElementById('prt');if(p)p.remove();p=document.createElement('div');p.id='prt';
if(LB.mix&&ks.length>1){const o=['L','M','S'].filter(k=>LB.sizes[k]);p.innerHTML=`<div class="lsheet">${o.map(k=>l.map(i=>Array(LB.cnt[k]||1).fill(labelHtml(i,k)).join('')).join('')).join('')}</div>`}else p.innerHTML=ks.map((k,n)=>`<div class="lsheet" style="${n<ks.length-1?'break-after:page;page-break-after:always':''}">${l.map(i=>Array(LB.cnt[k]||1).fill(labelHtml(i,k)).join('')).join('')}</div>`).join('');document.body.appendChild(p);
const done=()=>{window.removeEventListener('afterprint',done);const e=document.getElementById('prt');if(e)e.remove();if(LB.mark){l.forEach(i=>i.gedr=today());save();if(document.getElementById('lbl'))lbRender()}};
window.addEventListener('afterprint',done);setTimeout(()=>window.print(),80)};
