/* ================= v1.0: Produktseite einfügen ================= */
const LBLRE=/^\s*(Produktname|Name|Artikelnummer|Artikel-?Nr\.?|Herkunft|Erscheinungsbild|Funktion|Beschreibung|Anwendung|Hersteller|Verwendung|Lieferzeit|Inhalt|EAN|GTIN|Dosierung|Besonderheit|Eigenschaften|Aussehen|Geruch|Haltbarkeit|Lagerung|Ideal for|Country of origin|Origin|Storage|Nutritional declaration|Energy|Best before|Net weight|Allergens|Usage|Description|Ingredientes|Almacenamiento|Conservación|País de origen|Origen|Contenido|Modo de empleo|Uso)\b[^:\n]{0,20}[:：]/i;
function parseInci(text){const lines=String(text||'').split(/\r?\n/);
for(let n=0;n<lines.length;n++){const m=lines[n].match(/^\s*(?:INCI(?:[- ](?:Deklaration|Bezeichnung|Name|Liste))?|Inhaltsstoffe|Ingredients|Ingredientes|Composición|Zusammensetzung)\s*[:：]\s*(.*)$/i);if(!m)continue;
let acc=m[1].trim();for(let k=n+1;k<lines.length&&k<n+8;k++){const l=lines[k].trim();if(!l)break;if(LBLRE.test(l))break;if(acc&&/[.;]$/.test(acc)&&!/,$/.test(acc))break;acc+=(acc?' ':'')+l;const cut=acc.search(/[.;]\s+[A-ZÄÖÜ][a-zäöü]/);if(cut>0){acc=acc.slice(0,cut+1);break}if(acc.length>700)break}
acc=acc.replace(/https?:\/\/\S+/g,'').replace(/\s+/g,' ').trim().replace(/[.;]+$/,'');if(acc)return acc}
return ''}
function parseProduct(text){const t=String(text||'').replace(/ /g,' ');const r={name:'',inci:parseInci(t),nr:'',form:'',ean:'',url:'',offers:[]};
let m=t.match(/Produktname\s*[:：]\s*(.+)/i);if(m)r.name=m[1].trim();
m=t.match(/Artikel(?:nummer|-?\s?Nr\.?)\s*[:：]\s*([^\s|]+)/i);if(m)r.nr=m[1].trim();
if(!r.name){const ls=t.split(/\r?\n/).map(x=>x.trim());const k=ls.findIndex(x=>/^Artikel(?:nummer|-?\s?Nr)/i.test(x));if(k>0){for(let j=k-1;j>=0;j--){if(ls[j]&&ls[j].length<80){r.name=ls[j];break}}}}
m=t.match(/(?:EAN|GTIN)\s*[:：]?\s*(\d{8,14})/i);if(m)r.ean=m[1];
m=t.match(/https?:\/\/[^\s)>"']+/);if(m)r.url=m[0];
m=t.match(/(?:Erscheinungsbild|Aussehen|Konsistenz)\s*[:：]\s*(.+)/i);const ap=m?m[1]:'';
if(ap){if(/pulver/i.test(ap))r.form='Pulver';else if(/granulat/i.test(ap))r.form='Granulat';else if(/wachs|pellet/i.test(ap))r.form='Wachs/Pellets';else if(/paste|gel|creme|pastös/i.test(ap))r.form='Paste/Gel';else if(/öl\b/i.test(ap))r.form='Öl';else if(/flüssig|viskos|klar/i.test(ap))r.form='flüssig';else if(/fest|butter/i.test(ap))r.form='fest'}
const re=/(\d+(?:[.,]\d+)?)\s?(kg|mg|ml|g|l)(?![a-zäöüA-Z])\s*[|:\-–—]?\s*(\d+(?:[.,]\d+)?)\s*(?:€|EUR)/gi;const seen={};let x;
while((x=re.exec(t))){const mg=pNum(x[1]),pr=pNum(x[3]);const u=x[2].toLowerCase();if(!(mg>0)||pr==null||!U[u])continue;const k=mg+u+pr;if(seen[k])continue;seen[k]=1;r.offers.push({m:mg,u,p:pr})}
if(!r.name){const ls=t.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);const f=ls.find(x=>x.length<110&&!/[:：]\s*$/.test(x)&&!/^(inci|artikel|auswahl|produkt|preis|angebot|grundpreis|inkl|zzgl|€)/i.test(x));if(f){const q=f.match(/^(.*?)[\s,–-]+(\d+(?:[.,]\d+)?)\s?(kg|mg|ml|g|l)\s*$/i);if(q&&q[1].length>2){r.name=q[1].trim();r.fq={m:pNum(q[2]),u:q[3].toLowerCase()}}else r.name=f}}
if(!r.offers.length){const q0=r.fq||(()=>{const f=t.split(/\r?\n/).map(x=>x.trim()).find(x=>x);const q=f&&f.match(/(\d+(?:[.,]\d+)?)\s?(kg|mg|ml|g|l)\s*$/i);return q?{m:pNum(q[1]),u:q[2].toLowerCase()}:null})();
if(q0&&q0.m>0&&U[q0.u]){const rx=/(?:€\s*(\d+(?:[.,]\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR))/g;let y,best=null;while((y=rx.exec(t))){const tail=t.slice(y.index+y[0].length,y.index+y[0].length+14);const head=t.slice(Math.max(0,y.index-14),y.index);if(/^\s*\/\s*\d/.test(tail)||/^\s*(?:EUR)?\s*\/\s*\d/.test(tail)||/grundpreis|uvp|statt/i.test(head))continue;const p=pNum(y[1]||y[2]);if(p!=null&&p>0){best=p;break}}if(best!=null)r.offers.push({m:q0.m,u:q0.u,p:best})}}
return r}
let PP=null;
function sheetProduct(id){PP={id:id||null};openSheet(`<h2>Aus Produktseite übernehmen</h2><div class="hint" style="margin:0 0 8px">Öffne die Produktseite deines Lieferanten, kopiere den Text (oder die wichtigen Teile) und füge ihn hier ein. Die App liest nur Fakten aus: Name, INCI, Artikelnummer, Form und Preise. Beschreibungstexte werden nicht übernommen. Du siehst vorher eine Vorschau.</div><textarea id="pt" rows="8" style="width:100%;border:1px solid var(--line);border-radius:12px;padding:10px;font:inherit;background:#fff" placeholder="Text hier einfügen"></textarea><div class="err" id="er"></div><div class="btns"><button class="btn" onclick="prodRead()">Auslesen</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function prodRead(){const r=parseProduct(val('pt'));if(!r.name&&!r.inci&&!r.offers.length&&!r.nr){$('#er').textContent='Es wurden keine verwertbaren Angaben gefunden. Kopiere bitte etwas mehr Text der Seite, z. B. mit Produktname, INCI und Preisen.';return}PP.r=r;prodPrev()}
function prodPrev(){const r=PP.r,i=PP.id?getI(PP.id):null;
const ck=(k,l,v,old)=>v?`<label class="chk" style="align-items:flex-start;margin-top:10px"><input type="checkbox" id="pp_${k}" checked> <span><b style="font-weight:600">${l}</b><br><span style="overflow-wrap:anywhere">${esc(v)}</span>${old&&old!==v?`<br><span class="s">bisher: ${esc(old)}</span>`:''}</span></label>`:'';
const ls=Object.keys(S.lief).sort((a,b)=>a.localeCompare(b));
openSheet(`<h2>Das wurde gefunden</h2><div class="s">Abgewählte Angaben werden nicht übernommen.</div>
${ck('name','Name',r.name,i&&i.name)}${ck('inci','INCI',r.inci,i&&i.inci)}${ck('nr','Artikelnummer (beim Bezug)',r.nr)}${ck('form','Form',r.form,i&&i.form)}${ck('ean','EAN',r.ean,i&&i.ean)}${ck('url','Link (Quelle)',r.url,i&&i.quelle)}
${r.offers.length?`<div class="cap" style="margin:16px 0 0">Preise</div>${r.offers.map((o,n)=>`<label class="chk" style="margin-top:8px"><input type="checkbox" id="po_${n}" checked> ${nf(o.m,3)} ${o.u} · ${eur(o.p)}</label>`).join('')}<label class="fld"><span>Lieferant für diese Preise</span><select id="pp_l" onchange="if(this.value==='__n')prodNewLief()">${liefOpts(BZPRE)}</select></label>`:''}
<div class="err" id="er"></div><div class="btns"><button class="btn" onclick="prodApply()">${i?'Übernehmen':'Rohstoff anlegen'}</button><button class="btn sec" onclick="closeSheet()">Abbrechen</button></div>`)}
function prodNewLief(){LIEFCB=n=>{BZPRE=n||'';prodPrev();BZPRE=''};sheetLiefEdit(null)}
function prodApply(){const r=PP.r;const on=k=>{const e=document.getElementById('pp_'+k);return e&&e.checked};
const offs=r.offers.filter((o,n)=>document.getElementById('po_'+n)&&document.getElementById('po_'+n).checked);const lief=offs.length?val('pp_l'):'';
if(offs.length&&(!lief||lief==='__n')){$('#er').textContent='Bitte einen Lieferanten für die Preise wählen oder die Preise abwählen.';return}
let it=PP.id?getI(PP.id):null;
if(!it){const nm=on('name')&&r.name?r.name:(r.name||'Neuer Rohstoff');const c=CAT.find(x=>FOLD(x.n)===FOLD(nm))||null;const kind=offs.length&&U[offs[0].u].k==='v'?'v':'w';it=c?mk(c,{kind}):mk(null,{name:nm,kind});it.unk=true;S.items.push(it)}
else if(on('name')&&r.name)it.name=r.name;
if(on('inci')&&r.inci){it.inci=r.inci;it.ist='ungeprüft'}
if(on('form')&&r.form)it.form=r.form;if(on('ean')&&r.ean)it.ean=r.ean;if(on('url')&&r.url)it.quelle=r.url;
offs.forEach(o=>it.bezug.push({id:uid(),lief,nr:on('nr')?r.nr:'',preis:o.p,menge:toB(o.m,o.u),kind:U[o.u].k,datum:today()}));
adoptLief();save();closeSheet();stack=[];R={name:'artikel',id:it.id,edit:false};draw();toast(PP.id?'Übernommen – bitte kurz prüfen':'Rohstoff angelegt – bitte kurz prüfen')}
