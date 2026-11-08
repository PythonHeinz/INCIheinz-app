/* ---------- Phasen als Arbeitsschritte im Ablauf (Ansicht, Karte, Text-Export) ---------- */
function rzPhModText(p){return 'Zutaten: '+p.z.map(z=>(rzName(z)||'Zutat')+(z.g>0?' '+rzG(z.g)+' g':'')).join(', ')}
function rzPhMissing(d){return d.phasen.filter(p=>!p.pool&&p.z.length&&!(d.mod||[]).some(m=>m.ph===p.id))}
function rzPhMods(d){const miss=rzPhMissing(d);if(!miss.length)return 0;d.mod=d.mod||[];const add=miss.map(p=>({id:uid(),t:'schritt',titel:p.name||'Phase',text:rzPhModText(p),ph:p.id}));d.mod=add.concat(d.mod);return add.length}
function rzPhModsDo(){const n=rzPhMods(RE.d);RE.dirty=true;rzEd();toast(n+(n===1?' Schritt':' Schritte')+' aus den Phasen angelegt. Ergänze, was du tust.')}
{const o=rzImportOpen;rzImportOpen=function(){if(RZIM&&RZIM.d)try{rzPhMods(RZIM.d)}catch(e){}return o.apply(this,arguments)}}
{const o=rzEd;rzEd=function(){o.apply(this,arguments);try{const n=rzPhMissing(RE.d).length;const b=document.querySelector('#rz_mods ~ .tb');if(n&&b&&!document.getElementById('rzphm')){const x=document.createElement('button');x.id='rzphm';x.className='pill';x.style.cssText='width:auto;height:auto';x.textContent='Phasen in den Ablauf übernehmen';x.onclick=rzPhModsDo;b.appendChild(x);if(typeof trWalk==='function'&&LANG!=='de')trWalk(b)}}catch(e){}}}
