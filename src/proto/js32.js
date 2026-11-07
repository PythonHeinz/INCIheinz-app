/* ---------- Bewertungsformular in der Charge: Kriterien und Nachbewertungen ----------
   Neue optionale Felder an der Charge: c.k={kons,duft,aus,haut} (1-5), c.bew=[{id,date,stars,k,note}].
   Die Erstbewertung (c.stars, c.note) bleibt unverändert. */
const BEWK=[['kons','Konsistenz'],['duft','Duft'],['aus','Aussehen'],['haut','Hautgefühl']];
let rzBewOpen=false,rzBN=null;
const bewAll=c=>c.bew||(c.bew=[]);
const bewLatest=c=>{const a=(c.bew||[]).slice().sort((x,y)=>x.date<y.date?1:-1);return a[0]||null};
const bewDots=(n,fn)=>[1,2,3,4,5].map(k=>`<button onclick="${fn},${k})" aria-label="${k} von 5" style="background:none;border:0;font-size:1.5rem;line-height:1;color:var(--pri);padding:2px 5px;cursor:pointer">${k<=(n||0)?'●':'○'}</button>`).join('');
const bewAvg=k=>{const v=BEWK.map(x=>(k||{})[x[0]]).filter(x=>x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
(function(){
const oList=rzChgs;
rzChgs=function(){oList();const rows=document.querySelectorAll('#main .row[onclick*="name:\'chg\'"]');rows.forEach(r=>{const m=(r.getAttribute('onclick')||'').match(/id:'([^']+)'/);if(!m)return;const c=rzChgAll().find(x=>x.id===m[1]);const b=c&&bewLatest(c);const e=r.querySelector('.rz-st');if(b&&b.stars&&e)e.textContent=rzStars(b.stars)})};
const oChg=rzChg;
rzChg=function(){oChg();const c=rzChgAll().find(x=>x.id===R.id);if(!c)return;const lab=document.querySelector('#main label.fld');if(!lab)return;
const k=c.k||{};const bl=(c.bew||[]).slice().sort((x,y)=>x.date<y.date?1:-1);
const body=`<div class="s" style="margin-bottom:6px">Wie war das Ergebnis im Einzelnen? Alle Angaben sind freiwillig.</div>`+BEWK.map(x=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0"><span>${x[1]}</span><span id="bk-${x[0]}">${bewDots(k[x[0]],`bewK('${c.id}','${x[0]}'`)}</span></div>`).join('')
+(bl.length?`<div class="cap" style="margin:14px 0 6px">Nachbewertungen</div>`+bl.map(b=>`<div class="rz-dl" style="padding:8px 0;align-items:flex-start"><span><b>${dde(b.date)}</b> <span class="rz-st">${b.stars?rzStars(b.stars):''}</span>${b.note?`<div class="s">${esc(b.note)}</div>`:''}</span><button class="lnk" style="color:var(--err)" onclick="bewDel('${c.id}','${b.id}')">Entfernen</button></div>`).join(''):'')
+`<div style="margin-top:12px"><button class="btn sec" onclick="bewSheet('${c.id}')">Nachbewertung hinzufügen</button></div>`;
const st=bewAvg(k);
lab.insertAdjacentHTML('afterend',`<details class="acc" id="bewacc"${rzBewOpen?' open':''} ontoggle="rzBewOpen=this.open"><summary>Bewertung${bl.length||st?` <small>${bl.length?bl.length+' Nachbewertung'+(bl.length>1?'en':''):'Kriterien'}</small>`:''}</summary><div class="in">${body}</div></details>`)};
})();
function bewK(id,key,n){const c=rzChgAll().find(x=>x.id===id);if(!c)return;c.k=c.k||{};c.k[key]=c.k[key]===n?0:n;save();rzBewOpen=true;const e=document.getElementById('bk-'+key);if(e)e.innerHTML=bewDots(c.k[key],`bewK('${id}','${key}'`)}
function bewDel(id,bid){const c=rzChgAll().find(x=>x.id===id);if(!c)return;c.bew=bewAll(c).filter(b=>b.id!==bid);save();rzBewOpen=true;draw()}
function bewSheet(id){rzBN={id,date:today(),stars:0,k:{},note:''};bewSheetDraw()}
function bewSheetDraw(){const b=rzBN;openSheet(`<h2>Nachbewertung</h2><div class="s" style="margin-bottom:8px">Wie wirkt das Ergebnis nach einiger Zeit?</div>
<label class="fld"><span>Datum</span><input type="date" value="${b.date}" onchange="rzBN.date=this.value||today()"></label>
<div class="cap" style="margin:12px 0 4px">Gesamt</div><div class="rz-stars" id="bnst">${[1,2,3,4,5].map(n=>`<button onclick="bewNS(${n})" aria-label="${n} Sterne">${n<=b.stars?'★':'☆'}</button>`).join('')}</div>
${BEWK.map(x=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0"><span>${x[1]}</span><span id="bn-${x[0]}">${bewDots(b.k[x[0]],`bewNK('${x[0]}'`)}</span></div>`).join('')}
<label class="fld"><span>Notiz</span><textarea oninput="rzBN.note=this.value" placeholder="Was ist nach Wochen anders?">${esc(b.note)}</textarea></label>
<div class="btns"><button class="btn" onclick="bewSave()">Speichern</button></div>`)}
function bewNS(n){rzBN.stars=rzBN.stars===n?0:n;document.getElementById('bnst').innerHTML=[1,2,3,4,5].map(k=>`<button onclick="bewNS(${k})" aria-label="${k} Sterne">${k<=rzBN.stars?'★':'☆'}</button>`).join('')}
function bewNK(key,n){rzBN.k[key]=rzBN.k[key]===n?0:n;document.getElementById('bn-'+key).innerHTML=bewDots(rzBN.k[key],`bewNK('${key}'`)}
function bewSave(){const b=rzBN,c=rzChgAll().find(x=>x.id===b.id);if(!c)return;bewAll(c).push({id:uid(),date:b.date,stars:b.stars,k:b.k,note:b.note});save();rzBewOpen=true;closeSheet();toast('Nachbewertung gespeichert');draw()}
