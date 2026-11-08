/* Lagerliste: Kennzeichnung und Legende.
   Tag "ohne Katalog" (Rohstoff ohne Katalogverknüpfung, noch nicht bestätigt) bzw. "eigen" (als eigener Rohstoff bestätigt); verknüpfte Rohstoffe tragen kein Tag.
   Unter der Liste: "Symbole erklärt" öffnet die Legende. */
function lgTag(i){return i.cid?'':i.eig||i.tb==='sonja'?'<span class="badge" style="font-size:.66rem;padding:1px 7px;margin-left:4px">eigen</span>':'<span class="badge u" style="font-size:.66rem;padding:1px 7px;margin-left:4px">ohne Katalog</span>'}
function lgLegend(){const ro=(ico,t,d)=>`<div class="row" style="padding:8px 2px;align-items:flex-start"><div style="width:74px;flex:none;display:flex;justify-content:center;padding-top:2px;white-space:nowrap">${ico}</div><div class="t"><b>${t}</b><div class="s">${d}</div></div></div>`;
openSheet(`<h2>Symbole erklärt</h2><div class="cap" style="margin:6px 0 0">Bestand</div>
${ro(ic('emptyc','var(--ambt)',18),'leer','Der Bestand ist 0. Der Rohstoff ist angelegt, aber aufgebraucht.')}
${ro(ic('pie','var(--ambt)',18),'knapp','Der Bestand liegt unter der Mindestmenge.')}
${ro(ic('cart','var(--pri)',18),'auf der Einkaufsliste','Der Rohstoff steht auf deiner Einkaufsliste.')}
${ro(ic('alarm','var(--ambt)',18),'läuft ab','Das Ablaufdatum (MHD) ist bald erreicht.')}
${ro('<b>?</b>','Menge offen','Der Rohstoff ist im Lager, die Menge ist noch nicht eingetragen. Das geht mit „Bestand ändern“ oder im Regal-Check.')}
<div class="cap" style="margin:12px 0 0">Katalog</div>
${ro('<span class="badge u" style="font-size:.66rem;padding:1px 7px">ohne Katalog</span>','ohne Katalog','Der Rohstoff hat nur einen Namen und ist noch keinem Katalogeintrag zugeordnet. Ihn zuzuordnen geht im Regal-Check unter „Jetzt zuordnen“.')}
${ro('<span class="badge" style="font-size:.66rem;padding:1px 7px">eigen</span>','eigen','Eigener Rohstoff, den es nicht im Katalog gibt, zum Beispiel eine Eigenkreation.')}
${ro('<span class="s">kein Tag</span>','mit Katalog verknüpft','Der Rohstoff ist ein angelegter Artikel mit Katalogdaten wie INCI und Kategorie.')}
<div class="hint" style="margin-top:8px">Zutaten in einem Rezept, die nicht im Lager sind, stehen dort nur als Text und zeigen „fehlt“, bis du den Rohstoff anlegst.</div>
<div class="btns"><button class="btn" onclick="closeSheet()">Schließen</button></div>`)}
(function(){const l0=lager;lager=function(){l0.apply(this,arguments);try{const m=document.getElementById('main');if(!m||R.name!=='lager')return;
m.querySelectorAll('.tr').forEach(r=>{const mm=(r.getAttribute('onclick')||'').match(/go\('artikel','([^']+)'\)/);const it=mm&&S.items.find(i=>i.id===mm[1]);if(!it)return;const t=lgTag(it);if(!t)return;const tt=r.querySelector('.nm .t');if(tt)tt.insertAdjacentHTML('afterend',t)});
if(!document.getElementById('lgleg'))m.insertAdjacentHTML('beforeend','<div style="text-align:center;margin:10px 0 4px"><a href="#" class="lnk" id="lgleg" onclick="lgLegend();return false">Symbole erklärt</a></div>')}catch(e){}}})();
