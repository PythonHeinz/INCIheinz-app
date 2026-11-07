/* Dokumentsprache für Druck, PDF und Teilen */
var DOCL=null;
function withLang(l,fn){const o=LANG,ol=LOC;try{LANG=l;LOC=locOf(l);return fn()}finally{LANG=o;LOC=ol}}
const DOC_LANGS=[['de','Deutsch'],['en','English'],['es','Español']];
/* Vor dem Lesen: Texte des Rezepts in die Dokumentsprache bringen (Übersetzungsspeicher, dann Wörterbuch) */
function docTr(s){return (typeof s==='string'&&s.trim())?trStr(s):s}
function docData(d,l){return withLang(l,()=>{const c=JSON.parse(JSON.stringify(d));['name','zweck','ergibt'].forEach(k=>{if(c[k])c[k]=docTr(c[k])});
(c.phasen||[]).forEach(p=>{p.name=docTr(p.name);(p.z||[]).forEach(z=>{if(!z.item&&!z.cid)z.name=docTr(z.name)})});
(c.mod||[]).forEach(m=>{if(m.titel)m.titel=docTr(m.titel);if(m.text)m.text=docTr(m.text)});return c})}
const DOC_HEAD=/^(Zutaten gesamt|Zutaten|Phasen|Zubereitung)$/;
function docTextLines(txt,l){return withLang(l,()=>txt.split('\n').map(z=>{if(!z.trim())return z;if(DOC_HEAD.test(z))return trStr(z);
let m=z.match(/^(Einsatzzweck|Ziel-pH|Ergibt|Zeitaufwand|Schwierigkeit|Haltbarkeit|Abfüllung|Hinweis|Notiz|INCI \(Entwurf\)|Summe): (.*)$/);if(m)return trStr(m[1])+': '+m[2];
m=z.match(/^Version (\d+)(.*)$/);if(m)return trStr('Version')+' '+m[1]+m[2];
m=z.match(/^([\d.,]+ g )(.+)$/);if(m)return m[1]+trStr(m[2]);return z}).join('\n'))}
{const _t=rzTextOf;rzTextOf=function(id,vn){if(!DOCL)return _t(id,vn);const r=rzGet(id),v=rzVer(r,vn||rzCurV(r).n),old=v.d;v.d=docData(old,DOCL);try{return docTextLines(_t(id,vn),DOCL)}finally{v.d=old}}}
{const _p=rzPdf;rzPdf=function(id,vn,o){if(!DOCL)return _p(id,vn,o);return withLang(DOCL,()=>_p(id,vn,o))}}
{const _w=pdfWrap;pdfWrap=function(s,w,sz,b){return _w(DOCL?TT(String(s==null?'':s)):s,w,sz,b)}}
{const _d=rzPrintDoc;rzPrintDoc=function(css,title,body){if(!DOCL)return _d(css,title,body);const l=DOCL;const doc=new DOMParser().parseFromString('<bo'+'dy>'+body+'</bo'+'dy>','text/html');withLang(l,()=>{trWalk(doc.body)});
return _d(css,withLang(l,()=>trStr(title)),doc.body.innerHTML)}}
const docRun=(L,fn)=>{DOCL=L||LANG;try{return fn()}finally{DOCL=null}};
{const _g=rzPubGo;rzPubGo=function(){const k=RZX&&RZX.kind;return docRun(RZX&&RZX.lang,()=>_g())}}
{const _s=rzShareGo;rzShareGo=function(dl){return docRun(RZS&&RZS.lang,()=>_s(dl))}}
function docLangHtml(cur,fn){return `<div class="cap" style="margin:14px 0 6px">Sprache des Dokuments</div><div class="tb" style="gap:8px;flex-wrap:wrap">${DOC_LANGS.map(x=>`<button type="button" class="pill ${cur===x[0]?'on':''}" style="width:auto;height:auto" onclick="${fn}('${x[0]}')">${x[1]}</button>`).join('')}</div><div class="s" style="margin-top:6px">Texte ohne Übersetzung erscheinen in ihrer Originalsprache. Übersetzungen pflegst du am Rezept.</div>`}
function docLangPick(o,l){o.lang=l;const s=shEl();if(!s)return;s.querySelectorAll('#doclang .pill').forEach((b,i)=>b.classList.toggle('on',DOC_LANGS[i][0]===l))}
function docLangPut(o,fn){const s=shEl();if(!s||s.querySelector('#doclang'))return;if(!o.lang)o.lang=LANG;const b=s.querySelector('.btns');const d=document.createElement('div');d.id='doclang';d.innerHTML=docLangHtml(o.lang,fn);if(b)b.parentNode.insertBefore(d,b);else s.appendChild(d);try{trWalk(d)}catch(e){}}
function rzxLang(l){docLangPick(RZX,l)}function rzsLang(l){docLangPick(RZS,l)}
{const _o=sheetRzPub;sheetRzPub=function(k,keep){_o(k,keep);if(RZX&&(k==='card'||k==='book'||k==='txt'))docLangPut(RZX,'rzxLang')}}
{const _o=sheetRzShare;sheetRzShare=function(id){_o(id);if(RZS)docLangPut(RZS,'rzsLang')}}
/* Zielsprache (Muttersprache) global in den App-Einstellungen */
function mutSet(l){S.mut=l;save();sheetAppSet()}
{const _a=sheetAppSet;sheetAppSet=function(){_a();const s=shEl();if(!s||s.querySelector('#mutset'))return;const b=s.querySelector('[onclick*="pickLang"]');if(!b)return;
const d=document.createElement('div');d.id='mutset';d.innerHTML=`<div style="height:26px"></div>${scap('Meine Sprache (Zielsprache)')}<div class="tb" style="gap:8px;flex-wrap:wrap">${DOC_LANGS.map(x=>`<button type="button" class="pill ${mutL()===x[0]?'on':''}" style="width:auto;height:auto" onclick="mutSet('${x[0]}')">${x[1]}</button>`).join('')}</div><div class="s" style="margin-top:6px">In diese Sprache übersetzt die KI fremdsprachige Rezepte beim Import und bei „Übersetzen“. Die Sprache der App stellst du oben ein.</div>`;b.insertAdjacentElement('afterend',d);try{trWalk(d)}catch(e){}}}
/* Artikeldaten aus KI-Lesungen: Freitexte in der Zielsprache, Original bleibt als Quelle erhalten */
function kiProdSys(){const l=langName(mutL());return KI_PROD_SYS+` Sprache der Ausgabe ist ${l}: name, sonstige.name und Freitext in sonstige.wert schreibst du auf ${l}. Der Name ist die übliche Bezeichnung des Rohstoffs in dieser Sprache, ohne Marke, Shop-Zusätze und Packungsgröße. In name_original steht der Name wörtlich wie im Dokument. INCI-Bezeichnungen, Zahlen, Einheiten, CAS-Nummern und H-Sätze bleiben unverändert.`}

/* Zahlen- und Datumsformat folgen der Dokumentsprache */
{const _c=rzCardHtml;rzCardHtml=function(id,vn,o){return DOCL?withLang(DOCL,()=>_c(id,vn,o)):_c(id,vn,o)}}
{const _t2=rzTextOf;rzTextOf=function(id,vn){return DOCL?withLang(DOCL,()=>_t2(id,vn)):_t2(id,vn)}}
