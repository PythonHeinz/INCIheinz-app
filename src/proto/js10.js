/* ---------- XLSX lesen (v1.0.1) ---------- */
async function inflRaw(u8){const ds=new DecompressionStream('deflate-raw');const w=ds.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer())}
async function unzipFiles(buf){const u=new Uint8Array(buf),dv=new DataView(buf);let e=u.length-22;while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw 0;const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out={};
for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);const name=new TextDecoder().decode(u.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;
if(!/^xl\/(sharedStrings\.xml|worksheets\/[^/]+\.xml|workbook\.xml)$/.test(name))continue;const ln=dv.getUint16(lo+26,true),lx=dv.getUint16(lo+28,true);const d=u.subarray(lo+30+ln+lx,lo+30+ln+lx+csz);out[name]=new TextDecoder().decode(meth===0?d:await inflRaw(d))}return out}
function xmlText(s){return s.replace(/<[^>]+>/g,'').replace(/&#(x?)([0-9a-fA-F]+);/g,(m,x,n)=>String.fromCodePoint(parseInt(n,x?16:10))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&')}
function colIx(r){let n=0;for(const c of r.replace(/\d/g,''))n=n*26+c.charCodeAt(0)-64;return n-1}
async function xlsxRows(buf){const f=await unzipFiles(buf);const sh=Object.keys(f).filter(k=>/worksheets\//.test(k)).sort()[0];if(!sh)throw 0;
const ss=[];(f['xl/sharedStrings.xml']||'').replace(/<si>([\s\S]*?)<\/si>/g,(m,a)=>{ss.push(xmlText(a.replace(/<rPh[\s\S]*?<\/rPh>/g,'')));return m});
const rows=[];f[sh].replace(/<row\b[^>]*>([\s\S]*?)<\/row>/g,(m,a)=>{const r=[];a.replace(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,(mm,at,b)=>{const ref=(at.match(/\br="([A-Z]+\d+)"/)||[])[1];const t=(at.match(/\bt="(\w+)"/)||[])[1];let v='';b=b||'';if(t==='inlineStr')v=xmlText(b);else{const x=(b.match(/<v>([\s\S]*?)<\/v>/)||[])[1];if(x!=null){v=t==='s'?ss[+x]||'':xmlText(x);if(!t||t==='n')v=v.replace('.',',')}}
const ix=ref?colIx(ref):r.length;while(r.length<ix)r.push('');r[ix]=v;return mm});rows.push(r);return m});
return rows.filter(r=>r.some(c=>String(c).trim()!==''))}
/* ---------- Aufnahme-/Änderungsdatum ---------- */
function hsh(s){let h=5381;for(let k=0;k<s.length;k++)h=((h<<5)+h+s.charCodeAt(k))|0;return String(h)}
function stampAll(){const t=today();(S.items||[]).forEach(i=>{const c=Object.assign({},i,{chg:'',h:'',foto:i.foto?i.foto.length:0});const h=hsh(JSON.stringify(c));if(i.h!==h){if(i.h)i.chg=t;i.h=h}})}

function codeLabel(s){const own=ownId(s);if(own)return own.name;const code=s.replace(/\s+/g,'');const h=S.items.find(i=>i.ean&&(i.ean===code||i.ean===s));return h?h.name:s}
function camDone(cs){if(cs.length===1){handleCode(cs[0]);return}openSheet(`<h2>${cs.length} Codes erkannt</h2><div class="s" style="margin-bottom:6px">Wähle, welcher Code gelten soll.</div>`+cs.map(c=>`<div class="hit" onclick="closeSheet();handleCode(${attr(c)})"><b>${esc(codeLabel(c))}</b><div class="s" style="font-family:ui-monospace,Menlo,Consolas,monospace">${esc(c)}</div></div>`).join('')+`<div class="btns"><button class="btn sec" onclick="closeSheet();camStart()">Nochmal scannen</button></div>`)}
function tierHist(i,o){const a=i.bezug.filter(y=>y.lief===o.lief&&(y.nr||'')===(o.nr||'')&&Math.round(y.menge*1000)===Math.round(o.menge*1000)).sort((x,y)=>x.datum<y.datum?-1:x.datum>y.datum?1:0).reverse();if(a.length<2)return '';return `<div class="cap" style="margin:14px 0 2px">Bisherige Preise</div>`+a.map(y=>`<div class="kv"><span>${dde(y.datum)}</span><span>${eur(y.preis)}</span></div>`).join('')}
