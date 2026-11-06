/* ---------- Rezeptbuch Platz 2: Rechner ---------- */
P.calc='<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>';
let RCH={tool:null,v:{},ord:[],u:'g'};
const RCHT={proz:{ic:'pie',t:'Prozent und Gramm',s:'Gesamtmenge, Anteil und Menge: zwei Werte eingeben, der dritte rechnet sich'},
drei:{ic:'calc',t:'Dreisatz',s:'Wenn A zu B passt, wie viel passt dann zu C?'},
vd:{ic:'flask',t:'Verdünnen',s:'Aus einer starken Lösung eine schwächere ansetzen, zum Beispiel Milchsäure 80 % auf 10 %'},
unit:{ic:'cube',t:'Einheiten umrechnen',s:'g, kg, mg, oz, lb, ml, l und fl oz, mit Dichte auch zwischen Gewicht und Volumen'}};
function rzBau(){const m=$('#main');if(!RCH.tool){m.innerHTML=`<div class="rz-t" style="font-size:1.25rem">Rechner</div><div class="s" style="margin:4px 0 12px">Kleine Helfer fürs Mischen, ohne ein Rezept anzulegen.</div><div class="card">${Object.keys(RCHT).map(k=>rowH([RCHT[k].ic,RCHT[k].t,RCHT[k].s,`rchOpen('${k}')`])).join('')}</div>
<div class="cap" style="margin:18px 0 6px">In Planung</div><div class="card"><div class="row" style="opacity:.6"><div class="t"><b>Tensidrechner</b><div class="s">Mischungen aus Tensiden ansetzen</div></div></div><div class="row" style="opacity:.6"><div class="t"><b>Kaltverseifung</b><div class="s">Laugen- und Fettmengen für Seifen berechnen</div></div></div></div>`;return}
const t=RCHT[RCH.tool];m.innerHTML=`<button class="lnk" style="margin:-4px 0 6px;padding:6px 0" onclick="RCH.tool=null;rzBau()">‹ Alle Rechner</button><div class="rz-t" style="font-size:1.25rem">${t.t}</div><div class="s" style="margin:4px 0 8px">${t.s}</div>${rchForm()}<div id="rchres" style="margin-top:14px"></div>`;rchRes()}
function rchOpen(k){RCH={tool:k,v:{},ord:[],u:'g'};rzBau()}
const rchF=(k,l,u,ph)=>`<label class="fld"><span>${l}</span><div class="inwu"><input inputmode="decimal" value="${esc(RCH.v[k]||'')}" placeholder="${ph||''}" oninput="rchIn('${k}',this.value)"><b>${u}</b></div></label>`;
const RCHU={mg:[0.001,'m'],g:[1,'m'],kg:[1000,'m'],oz:[28.349523,'m'],lb:[453.59237,'m'],ml:[1,'v'],l:[1000,'v'],'fl oz':[29.573530,'v']};
function rchForm(){const k=RCH.tool;
if(k==='proz')return rchF('tot','Gesamtmenge','g')+rchF('pct','Anteil','%')+rchF('g','Menge','g')+'<div class="s">Gib zwei Werte ein, der dritte wird berechnet.</div>';
if(k==='drei')return rchF('a','Wenn diese Menge …','g')+rchF('b','… dazu passt …','g')+rchF('c','… was passt dann zu dieser Menge?','g');
if(k==='vd')return rchF('c1','Stärke der Ausgangslösung','%')+rchF('c2','Gewünschte Stärke','%')+rchF('m2','Gewünschte Gesamtmenge','g');
return rchF('v','Wert','')+`<div class="tb" style="gap:6px;flex-wrap:wrap;margin:6px 0 10px">${Object.keys(RCHU).map(u=>`<button type="button" class="pill ${RCH.u===u?'on':''}" style="width:auto;height:auto" onclick="RCH.u='${u}';rzBau()">${u}</button>`).join('')}</div>`+rchF('d','Dichte (optional)','g/ml','z. B. 0,92')}
function rchIn(k,v){RCH.v[k]=v;if(RCH.tool==='proz'){RCH.ord=RCH.ord.filter(x=>x!==k);if(String(v).trim()!=='')RCH.ord.push(k)}rchRes()}
const rn=x=>nf(Math.round(x*1000)/1000,3);
function rchRes(){const e=document.getElementById('rchres');if(!e)return;const V=k=>num(RCH.v[k]);const box=(a,b)=>`<div class="rz-ban ok"><div class="s">${a}</div><b style="font-size:1.4rem">${b}</b></div>`;let h='';const t=RCH.tool;
if(t==='proz'){const ks=['tot','pct','g'];const set=RCH.ord.slice(-2);if(set.length===2){const miss=ks.find(x=>!set.includes(x));const tot=V('tot'),pct=V('pct'),g=V('g');let r=null;
if(miss==='g'&&tot!=null&&pct!=null)r=tot*pct/100;if(miss==='pct'&&tot&&g!=null)r=g/tot*100;if(miss==='tot'&&pct&&g!=null)r=g/pct*100;
if(r!=null&&isFinite(r))h=box({tot:'Gesamtmenge',pct:'Anteil',g:'Menge'}[miss],rn(r)+(miss==='pct'?' %':' g'))}}
else if(t==='drei'){const a=V('a'),b=V('b'),c=V('c');if(a&&b!=null&&c!=null)h=box('Das ergibt',rn(b*c/a)+' g')}
else if(t==='vd'){const c1=V('c1'),c2=V('c2'),m2=V('m2');if(c1&&c2!=null&&m2!=null){if(!(c1>c2)||!(c2>0))h='<div class="s">Die Ausgangslösung muss stärker sein als die gewünschte Stärke.</div>';else{const m1=m2*c2/c1;h=box('Ausgangslösung',rn(m1)+' g')+`<div class="s" style="margin-top:8px">Dazu ${rn(m2-m1)} g Wasser, zusammen ${rn(m2)} g. Gerechnet nach Gewicht.</div>`}}}
else{const v=V('v'),d=V('d');if(v!=null){const f=RCHU[RCH.u];const base=v*f[0];const rows=Object.keys(RCHU).filter(u=>RCHU[u][1]===f[1]&&u!==RCH.u).map(u=>[u,base/RCHU[u][0]]);
if(d>0){const o=f[1]==='m'?'v':'m';Object.keys(RCHU).filter(u=>RCHU[u][1]===o).forEach(u=>rows.push([u,(f[1]==='m'?base/d:base*d)/RCHU[u][0]]))}
h=`<div class="card">${rows.map(r=>`<div class="row"><div class="t"><b>${rn(r[1])} ${r[0]}</b></div></div>`).join('')}</div>`+(d>0?'':'<div class="s" style="margin-top:8px">Mit Dichte rechnet die App auch zwischen Gewicht und Volumen.</div>')}}
e.innerHTML=h}
