/* js47: Import-Bestätigung im Rezept-Editor (grau bis bestätigt), Zutatenkopf bearbeitbar,
   Status je Zutat (im Lager / im Katalog / nur Text), Ersetzen, schnell neu anlegen, Entfernen.
   Flags: z.imp, p.imp, m.imp (nur im Entwurf, werden beim Speichern entfernt). */
{const st=document.createElement('style');st.textContent=`
.rz-zr.imp .nm,.rz-zr.imp .rz-g,.rz-zr.imp .rz-pc,.rz-ref.imp .nm,.rz-ref.imp .rgm,.rz-ph.imp .rz-phh input,.rz-dw.imp summary .rz-sl,.rz-dw.imp .in input,.rz-dw.imp .in textarea{color:#C2570C}
.rz-zr.imp:focus-within .nm,.rz-zr.imp:focus-within .rz-g,.rz-zr.imp:focus-within .rz-pc,.rz-ph.imp .rz-phh input:focus,.rz-dw.imp:focus-within summary .rz-sl,.rz-dw.imp .in input:focus,.rz-dw.imp .in textarea:focus,.rz-dw.imp[open] summary .rz-sl{color:var(--txt)}
.rz-ref .rkat{display:block;font-size:.72rem;font-weight:400;color:var(--sub);margin-top:1px}.rz-ref.imp .rkat{color:var(--sub)}
.rz-st{display:inline-block;width:12px;height:12px;border-radius:50%;flex:none;border:2px solid var(--pri);box-sizing:border-box}
.rz-st.l{background:var(--pri)}.rz-st.t{border-style:dashed;border-color:var(--sub)}
.rz-leg{display:flex;gap:14px;flex-wrap:wrap;padding:8px 12px;font-size:.74rem;color:var(--sub);border-top:1px solid var(--line)}.rz-leg span{display:inline-flex;align-items:center;gap:6px}
.rz-ref .rz-ok,.rz-phh .rz-ok{width:40px;height:40px;flex:none;border:0;background:none;color:var(--pri);display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;margin:-6px -4px -6px 0}
.rz-txt{color:var(--sub);font-size:.74rem}
.rz-impb{display:flex;gap:12px;align-items:center;background:var(--muted);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin:14px 0 0}.rz-impb>div{flex:1;min-width:0}.rz-impb .s{margin-top:2px;line-height:1.4}
.rz-okb{flex:1;height:44px;border:0;border-radius:12px;background:var(--muted);color:var(--pri);font:inherit;font-weight:600;cursor:pointer}
`;document.head.appendChild(st)}

/* Zustand einer Zutat: l = Rohstoff im Lager, k = nur im Katalog, t = nur Text */
function rzZState(z){if(rzItem(z))return 'l';if(z.cid)return 'k';return 't'}
const rzStDot=s=>`<i class="rz-st ${s}" aria-hidden="true"></i>`;
function rzFindZ(id){let r=null;RE.d.phasen.forEach(p=>p.z.forEach(z=>{if(z.id===id)r=z}));return r}
function rzImpCount(d){let n=0;d.phasen.forEach(p=>{if(!p.pool&&p.imp)n++;p.z.forEach(z=>{if(z.imp)n++})});d.mod.forEach(m=>{if(m.imp)n++});return n}
function rzMarkImp(d){d.phasen.forEach(p=>{p.imp=true;p.z.forEach(z=>{z.imp=true})});(d.mod||[]).forEach(m=>{m.imp=true});return d}
function rzUnmark(d){d.phasen.forEach(p=>{delete p.imp;p.z.forEach(z=>{delete z.imp})});d.mod.forEach(m=>{delete m.imp});return d}

/* Import: alles startet grau */
{const o=rzImportOpen;rzImportOpen=function(){if(RZIM&&RZIM.d)rzMarkImp(RZIM.d);return o.apply(this,arguments)}}
/* Speichern: Flags entfernen; bei grauen Resten einmal nachfragen */
{const o=rzClean;rzClean=function(d){return rzUnmark(o.apply(this,arguments))}}
{const o=rzSave;rzSave=function(){const n=RE?rzImpCount(RE.d):0;if(n>0&&!RE.impAck){RE.impAck=true;rzAsk('Noch nicht bestätigte Einträge',n+(n===1?' Eintrag aus dem Import ist':' Einträge aus dem Import sind')+' noch nicht bestätigt. Sie werden so gespeichert.','Trotzdem speichern',()=>o());return}return o.apply(this,arguments)}}

/* Zutatenzeile: grau, wenn unbestätigt; Hinweis zum Status */
function rzRowHtml(pi,zi,z,sum){const dn=rzDensZ(z);const s=rzZState(z);return `<div class="rz-zr${z.imp?' imp':''}"><button class="rz-zn" onclick="rzZMenu(${pi},${zi})"><span class="nm">${esc(rzName(z))||'Zutat wählen'}</span>${s==='k'?'<small class="amb">nicht im Lager</small>':s==='t'?'<small class="rz-txt">nur Text</small>':''}${rzAltTag(pi,zi,z)}</button><input class="rz-g" id="rzg_${pi}_${zi}" inputmode="decimal" value="${rzZv(z)}" placeholder="0" oninput="rzZg(${pi},${zi},this.value)"><button class="rz-un ${z.u==='ml'?'on':''}" onclick="rzZU(${pi},${zi})" aria-label="Einheit wechseln, ${dn>0?'g oder ml':'ml braucht die Dichte'}">${z.u==='ml'?'ml':'g'}</button><span class="rz-pc" id="pc_${pi}_${zi}">${rzPc(z,sum)}</span></div>`}

/* Kopfliste: antippen öffnet das Menü (ersetzen, anlegen, entfernen); Symbol zeigt den Status */
const rzKatOf=z=>{const i=rzItem(z);if(i&&i.kat)return {k:i.kat,s:0};const c=z.cid&&CM[z.cid];if(c&&c.k)return {k:c.k,s:0};if(/^(wasser|aqua|dest|h2o|h₂o)/i.test(z.name||''))return {k:'Hydrolat & Wasser',s:0};if(z.kat)return {k:z.kat,s:1};return null};
function rzRefRows(sum){const d=RE.d;let h='',any=false;d.phasen.forEach((p,pi)=>{if(p.pool)return;p.z.forEach((z,zi)=>{any=true;const s=rzZState(z);
h+=`<div class="rz-ref${z.imp?' imp':''}" onclick="rzZMenu(${pi},${zi})">${rzStDot(s)}<span class="nm">${esc(rzName(z)||'Zutat')}${(()=>{const k=rzKatOf(z);return k?`<small class="rkat">${esc(k.k)}${k.s?' · Vorschlag':''}</small>`:''})()}${rzAltTag(pi,zi,z)}</span><span class="rgm">${z.g>0?rzG(z.g)+' g':''}</span><span class="rtag">${esc((p.name||'Phase').split(' · ')[0])}</span>${z.imp?`<button class="rz-ok" onclick="event.stopPropagation();rzConfirmZ('${z.id}')" aria-label="Zutat bestätigen">${ic('check','currentColor',22)}</button>`:''}</div>`})});
return h+(any?`<div class="rz-leg"><span>${rzStDot('l')}im Lager</span><span>${rzStDot('k')}im Katalog</span><span>${rzStDot('t')}nur Text</span></div>`:'')}

/* Menü einer Zutat (Phasenzeile und Kopfliste) */
function rzZMenu(pi,zi){const ph=RE.d.phasen[pi],z=ph.z[zi],n=ph.z.length,s=rzZState(z);
const info=s==='l'?'Rohstoff im Lager':s==='k'?'Aus dem Katalog, noch nicht im Lager':'Nur Text, kein Rohstoff hinterlegt';
openSheet(`<h2 class="nm">${esc(rzName(z)||'Zutat')}</h2><div class="s" style="margin-bottom:4px;display:flex;align-items:center;gap:8px">${rzStDot(s)}${info}</div>
${z.imp?`<div class="row" onclick="rzConfirmZ('${z.id}')"><div class="t"><b>Bestätigen</b><div class="s">So übernehmen</div></div>${ic('check','var(--pri)',18)}</div>`:''}
<div class="row" onclick="closeSheet();rzPickZ(${pi},${zi})"><div class="t"><b>Anderen Rohstoff wählen</b><div class="s">Aus Lager oder Katalog</div></div></div>
${s!=='l'?`<div class="row" onclick="rzNewRaw(${pi},${zi})"><div class="t"><b>Als neuen Rohstoff anlegen</b><div class="s">Nur der Name, Menge offen</div></div></div>`:''}
${RE.d.phasen.length>1?`<div class="row" onclick="rzMoveSheet(${pi},${zi})"><div class="t"><b>In andere Phase verschieben</b></div></div>`:''}${zi>0?`<div class="row" onclick="rzZMove(${pi},${zi},-1)"><div class="t"><b>Nach oben</b></div></div>`:''}${zi<n-1?`<div class="row" onclick="rzZMove(${pi},${zi},1)"><div class="t"><b>Nach unten</b></div></div>`:''}<div class="row" onclick="rzZDel(${pi},${zi})"><div class="t"><b style="color:var(--err)">Entfernen</b></div></div>`)}

/* Rohstoff schnell anlegen: nur Name, Menge offen */
function rzRawMake(nm){nm=String(nm||'').replace(/\s+/g,' ').trim();if(!nm)return null;const f=FOLD(nm);
let it=S.items.find(i=>FOLD(i.name)===f);if(it)return it;
const c=CAT.find(c=>FOLD(c.n)===f);it=c?mk(c,{kind:'w',total:0}):mk(null,{name:nm,kind:'w',total:0});
it.unk=true;it.verw=(it.verw?it.verw+' · ':'')+'Aus Rezept angelegt, Menge offen';S.items.push(it);save();return it}
let RZNR=null;
function rzNewRaw(pi,zi){const z=RE.d.phasen[pi].z[zi];RZNR={pi,zi};
openSheet(`<h2>Als Rohstoff anlegen</h2><div class="s" style="margin-bottom:6px">Nur der Name. Menge und Details trägst du später im Lager nach.</div><label class="fld"><span>Name</span><input id="rznn" value="${esc(rzName(z))}" autocomplete="off" onkeydown="if(event.key==='Enter')rzNewRawGo()"></label><div class="btns"><button class="btn" onclick="rzNewRawGo()">Anlegen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);
setTimeout(()=>{const e=document.getElementById('rznn');if(e){e.focus();e.select()}},60)}
function rzNewRawGo(){const t=val('rznn').trim();if(!t){toast('Bitte einen Namen eingeben');return}const it=rzRawMake(t);if(!it)return;const z=RE.d.phasen[RZNR.pi].z[RZNR.zi];
z.item=it.id;z.cid=it.cid||'';z.name=it.name;delete z.imp;RE.dirty=true;RZNR=null;closeSheet();rzEd();toast('Rohstoff angelegt, Menge offen')}

/* Auswahl: bei unbekannter Zutat Suche mit dem Text starten, "neu anlegen" anbieten */
{const o=rzPickZ;rzPickZ=function(pi,zi){o.apply(this,arguments);const z=zi>=0?RE.d.phasen[pi].z[zi]:null;if(z&&rzZState(z)!=='l'){const e=document.getElementById('rzpq'),nm=rzName(z);if(e&&nm){e.value=nm;rzPickList()}}}}
{const o=rzPickList;rzPickList=function(){o.apply(this,arguments);const box=document.getElementById('rzpl'),t=val('rzpq').trim();if(!box||!t)return;
if(S.items.some(i=>FOLD(i.name)===FOLD(t)))return;const last=box.lastElementChild;const h=`<div class="hit" onclick="rzSetZ('n')"><b>„<span class="nm">${esc(t)}</span>“ als neuen Rohstoff anlegen</b><div class="s">Nur der Name, Menge offen</div></div>`;if(last)last.insertAdjacentHTML('beforebegin',h);else box.insertAdjacentHTML('beforeend',h)}}
{const o=rzSetZ;rzSetZ=function(k,id){const p=RE.d.phasen[RZPK.pi];const z0=RZPK.zi>=0?p.z[RZPK.zi]:null;
if(k==='n'){const t=val('rzpq').trim();if(!t)return;const it=rzRawMake(t);if(!it)return;k='i';id=it.id;toast('Rohstoff angelegt, Menge offen')}
if(z0)delete z0.imp;return o.call(this,k,id)}}

/* Bestätigen */
function rzConfirmZ(id){const z=rzFindZ(id);if(z)delete z.imp;RE.dirty=true;closeSheet();rzEd()}
function rzConfirmPh(id){const p=RE.d.phasen.find(x=>x.id===id);if(p)delete p.imp;RE.dirty=true;rzEd()}
function rzConfirmMod(id){const x=RE.d.mod.find(y=>y.id===id);if(x)delete x.imp;RE.dirty=true;rzEd()}
function rzConfirmAll(){rzUnmark(RE.d);RE.dirty=true;rzEd()}

/* Phasenkarte: grau, Häkchen im Kopf */
{const o=rzPhCard;rzPhCard=function(p,pi,sum,isPool,hasRest){let h=o.apply(this,arguments);if(isPool||!p.imp)return h;
h=h.replace('class="card rz-ph','class="card rz-ph imp');
return h.replace('<button class="ib" style="width:36px;height:36px" onclick="rzPhMenu(',`<button class="rz-ok" onclick="rzConfirmPh('${p.id}')" aria-label="Phase bestätigen">${ic('check','currentColor',22)}</button><button class="ib" style="width:36px;height:36px" onclick="rzPhMenu(`)}}

/* Editor: Hinweisband, graue Module mit Bestätigen-Knopf */
{const o=rzEd;rzEd=function(){o.apply(this,arguments);try{if(!RE)return;const m=$('#main');const n=rzImpCount(RE.d);
if(n>0){const c=m.querySelector('.cap');if(c)c.insertAdjacentHTML('beforebegin',`<div class="rz-impb" id="rzimpb"><div><b>${n===1?'1 Eintrag noch nicht bestätigt':n+' Einträge noch nicht bestätigt'}</b><div class="s">Orange heißt: noch nicht von dir geprüft. Antippen zum Prüfen, Ersetzen oder Löschen, das Häkchen bestätigt.</div></div><button class="btn" style="width:auto;flex:none;padding:0 16px" onclick="rzConfirmAll()">Alle bestätigen</button></div>`)}
RE.d.mod.forEach(x=>{if(!x.imp)return;const e=m.querySelector('.rz-dw[data-id="'+x.id+'"]');if(!e)return;e.classList.add('imp');const bar=e.querySelector('.rz-mt');if(bar)bar.insertAdjacentHTML('afterbegin',`<button type="button" class="rz-okb" onclick="rzConfirmMod('${x.id}')">Bestätigen</button>`)})}catch(e){}}}
