/* ---------- Sicherheit in der Bedienung: Rückgängig, Doppelte, Datenstatus ---------- */
let UNDO=null;
function undoWrap(n,label){const f=window[n];if(typeof f!=='function')return;window[n]=function(){const snap=JSON.stringify(S);const r=f.apply(this,arguments);const fin=()=>{const now=JSON.stringify(S);if(now!==snap)undoOffer(label,snap,now)};if(r&&typeof r.then==='function')r.then(fin);else fin();return r}}
function undoOffer(label,snap,now){UNDO={label,snap,post:hsh(now)};const e=document.getElementById('toast');if(e)e.style.display='none';showUndo()}
function hideUndo(){const b=document.getElementById('undob');if(b)b.remove()}
function showUndo(){hideUndo();const d=document.createElement('div');d.id='undob';d.style.cssText='position:fixed;left:16px;right:16px;bottom:88px;z-index:130;background:#24332b;color:#fff;border-radius:12px;padding:10px 12px 10px 14px;display:flex;gap:10px;align-items:center;font-size:.88rem;box-shadow:0 6px 20px rgba(0,0,0,.25)';
d.innerHTML=`<span style="flex:1">${esc(UNDO.label)}</span><button style="background:transparent;color:#bfe3cf;border:1px solid #5f7a6b;border-radius:10px;padding:7px 12px;font:inherit;font-weight:600">Rückgängig</button>`;
d.querySelector('button').onclick=()=>{hideUndo();doUndo(true)};document.body.appendChild(d);clearTimeout(showUndo.t);showUndo.t=setTimeout(hideUndo,9000)}
function doUndo(ask){if(!UNDO)return;if(ask&&hsh(JSON.stringify(S))!==UNDO.post){openSheet(`<h2>Rückgängig machen?</h2><div style="font-size:.92rem">Seit „${esc(UNDO.label)}“ wurde noch etwas geändert. Wenn du zurückgehst, gehen diese späteren Änderungen auch verloren.</div><div class="btns"><button class="btn" onclick="closeSheet();doUndo(false)">Trotzdem zurückgehen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`);return}
const u=UNDO;UNDO=null;hideUndo();S=JSON.parse(u.snap);save();closeSheet();stack=[];draw();toast(u.label+': rückgängig gemacht')}
function undoRow(){return UNDO?`<div class="row" style="padding:0 2px" onclick="closeSheet();doUndo(true)"><div style="width:32px;display:flex;justify-content:center">${ic('refresh','var(--pri)')}</div><div class="t"><b>Letzte Änderung rückgängig</b><div class="s">${esc(UNDO.label)}</div></div>${ic('chev','var(--sub)',18)}</div>`:''}
['saveArt:Rohstoff bearbeitet','used:Als aufgebraucht markiert','saveMenge:Menge geändert','saveVessel:Gefäß hinzugefügt','saveFill:Füllstand geändert','delVessel:Gefäß entfernt','saveBezug:Preis gespeichert','saveShop:Auf die Einkaufsliste gesetzt','doDel:Rohstoff gelöscht','delShop:Von der Einkaufsliste entfernt','doBought:Als bestellt markiert','impGo:Import übernommen','restoreAll:Sicherung eingelesen','restoreMerge:Sicherung ergänzt','prodApply:Produktdaten übernommen','delFoto:Foto entfernt','setFoto:Foto gespeichert','saveLief:Lieferant gespeichert','delLief:Lieferant entfernt','saveNeu:Rohstoff angelegt'].forEach(x=>{const i=x.indexOf(':');undoWrap(x.slice(0,i),x.slice(i+1))});

/* Doppelte erkennen */
const NKd=s=>FOLD(String(s||'')).replace(/[^a-z0-9]/g,'');
function dupOf(name,ean,cid){const a=NKd(name);return S.items.find(i=>{if(cid&&i.cid===cid)return true;if(ean&&i.ean&&i.ean===ean)return true;const b=NKd(i.name);if(!a||!b)return false;if(a===b)return true;const mn=Math.min(a.length,b.length),mx=Math.max(a.length,b.length);return mn>=5&&mn/mx>=.6&&(a.includes(b)||b.includes(a))})||null}
const saveNeu1=saveNeu;
saveNeu=function(own){const name=val('n1').trim();if(name&&!NEU.dupOk){const c=!own&&NEU.c?CM[NEU.c]:(!own?CAT.find(x=>FOLD(x.n)===FOLD(name)):null);const d=dupOf(name,'',c&&c.id);if(d){const cat=c&&d.cid===c.id;
const e=$('#er');if(e){e.innerHTML=`<div style="color:var(--txt);background:var(--surf2,#f3f6f4);border-radius:10px;padding:10px 12px;margin-top:8px"><b>„${esc(d.name)}“ ist schon in deinem Lager.</b><div class="s" style="margin:4px 0 8px">${cat?'Wenn du weitermachst, wird die Menge zum vorhandenen Rohstoff addiert.':'Möchtest du stattdessen diesen öffnen?'}</div><button class="pill" onclick="closeSheet();go('artikel','${d.id}')">Vorhandenen öffnen</button> <button class="pill" onclick="NEU.dupOk=1;saveNeu(${own?1:0})">${cat?'Menge addieren':'Trotzdem neu anlegen'}</button></div>`;return}}}
return saveNeu1(own)};
undoWrap('saveNeu','Rohstoff angelegt');
const prodApply1=prodApply;
prodApply=function(){if(!PP.id&&!PP.dupOk){const r=PP.r||{};const d=dupOf(r.name,r.ean,null);if(d){const e=$('#er');if(e){e.innerHTML=`<div style="color:var(--txt);background:var(--surf2,#f3f6f4);border-radius:10px;padding:10px 12px;margin-top:8px"><b>„${esc(d.name)}“ ist schon in deinem Lager.</b><div class="s" style="margin:4px 0 8px">Du kannst die Angaben dort übernehmen. Du siehst vorher, was sich ändert.</div><button class="pill" onclick="PP.id='${d.id}';prodPrev()">In „${esc(d.name).slice(0,28)}“ übernehmen</button> <button class="pill" onclick="PP.dupOk=1;prodApply()">Trotzdem neu anlegen</button></div>`;return}}}
return prodApply1()};
undoWrap('prodApply','Produktdaten übernommen');

/* Datenstatus und Sicherungshinweis (nur Web-Version) */
function dayDiff(d){return Math.floor((new Date(today()+'T12:00:00')-new Date(d+'T12:00:00'))/864e5)}
function backupNote(){if(S.items.length<3)return '';const last=S.lastBackup;const dd=last?dayDiff(last):999;if(dd<=30)return '';if(S.backupNag&&dayDiff(S.backupNag)<7)return '';
return `<div id="bknote" class="card" style="padding:12px 14px;margin:0 0 12px;border-color:var(--amb,#d9a441)"><div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:1"><b style="font-size:.92rem">${last?'Letzte Sicherung vor '+dd+' Tagen':'Noch keine Sicherung erstellt'}</b><div class="s" style="margin-top:2px">Deine Daten liegen nur auf diesem Gerät. Sichere sie regelmäßig, damit nichts verloren geht.</div><div style="margin-top:8px"><button class="pill" onclick="sheetBackup()">Jetzt sichern</button> <button class="pill" onclick="S.backupNag=today();save();this.closest('#bknote').remove()">Später</button></div></div></div></div>`}
const lager1=lager;
lager=function(){lager1();const m=$('#main');if(m&&R.name==='lager'){const h=backupNote();if(h)m.insertAdjacentHTML('afterbegin',h)}};
const sheetBackup1=sheetBackup;
sheetBackup=function(){sheetBackup1();const h=document.querySelector('#sheet h2,.sheet h2');if(h)h.insertAdjacentHTML('afterend',`<div class="hint" style="margin:0 0 10px">Wo liegen meine Daten? Nur auf diesem Gerät, in dieser App. Es gibt keinen Server und keine Cloud. Die Sicherung ist deine einzige Kopie, wenn das Gerät verloren geht.</div>`)};

/* Ampel-Zeile im Kopf der Artikelseite */
Object.assign(P,{cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',inciok:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2.2 2.2L15 10"/>',stock:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',warn:'<path d="M12 3L2 20h20L12 3z"/><path d="M12 10v4M12 17.2v.1"/>'});
const AMP={g:['var(--pri)','#E3F0E8'],a:['var(--ambt)','#FBF1E0'],r:['var(--err)','#FDECEA'],n:['var(--sub)','#EEF1EF']};
function ampel(i){const dd=i.mhd?Math.floor((new Date(i.mhd+'T12:00:00')-new Date(today()+'T12:00:00'))/864e5):null;
const L=[
i.ist==='geprüft'?['inciok','g','INCI geprüft']:!i.inci?['inciok','r','INCI fehlt']:['inciok','a','INCI nicht geprüft'],
i.unk?['pie','n','Menge unbekannt']:(i.min>0&&i.total<=i.min?['pie','r','Menge unter Mindestbestand']:['pie','g',i.min>0?'Menge über Mindestbestand':'Menge in Ordnung']),
i.unk?['stock','n','Menge unbekannt']:(i.total<=0?['stock','r','Nicht vorrätig']:['stock','g','Vorrätig']),
dd==null?['cal','n','Kein Haltbarkeitsdatum']:dd<0?['cal','r','Haltbarkeit abgelaufen ('+dde(i.mhd)+')']:dd<=30?['cal','a','Läuft bald ab ('+dde(i.mhd)+')']:['cal','g','Haltbar bis '+dde(i.mhd)]];
return `<div style="display:flex;gap:10px;margin-top:10px">${L.map(x=>`<button type="button" class="ib" style="width:40px;height:40px;border-radius:50%;background:${AMP[x[1]][1]};display:flex;align-items:center;justify-content:center;margin:0" aria-label="${esc(x[2])}" onclick="toast(this.getAttribute('aria-label'))">${ic(x[0],AMP[x[1]][0],22)}</button>`).join('')}</div>`}
