/* ---------- KI: Dienst-Schicht, Einstellungen › KI-Funktionen, Testsatz (Konzept §2, §7) ----------
   Regeln: Ohne geprüften Schlüssel gibt es keine KI und keinen Netzwerkaufruf. Der Schlüssel liegt in einem eigenen
   localStorage-Eintrag, nie in S und nie in der Sicherung. Die KI schreibt nichts in die Daten. */
const KI_KEY='inciheinz-ki-key',KI_CFG='inciheinz-ki-cfg',KI_MODEL='gemini-3.8-flash',KI_MAXIN=60000;
const KI_MODELS=[['gemini-3.8-flash','3.8 Flash'],['gemini-3.6-flash','3.6 Flash'],['gemini-3.5-flash-lite','3.5 Flash-Lite']];
let KI_BUSY=false,KI_MSG='';
const kiLs=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}};
const kiCfg=()=>{try{return JSON.parse(kiLs(KI_CFG)||'{}')}catch(e){return {}}};
const kiModel=()=>(kiCfg().model||KI_MODEL);
const kiOn=()=>!!(kiLs(KI_KEY)&&kiCfg().ok);
function kiErr(code,status){const e=new Error(code);e.status=status;return e}
async function kiRaw(key,model,system,user,opts){
if(window.KI_MOCK)return window.KI_MOCK(system,user,model,opts);
if(String(system).length+String(user).length>((opts&&opts.max)||KI_MAXIN)||(opts&&(opts.images||(opts.image?[opts.image]:[])).reduce((a,x)=>a+x.data.length,0)>18e6))throw kiErr('zu-lang');
const ac=new AbortController();const to=setTimeout(()=>ac.abort(),40000);
try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(Object.assign({systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:user}].concat(((opts&&(opts.images||(opts.image?[opts.image]:[])))||[]).map(x=>({inlineData:{mimeType:x.mime,data:x.data}})))}]},opts&&opts.json?{generationConfig:{responseMimeType:'application/json'}}:{}))});
if(!r.ok)throw kiErr(r.status===400||r.status===403?'key':r.status===404?'modell':r.status===429?'limit':'dienst',r.status);
const j=await r.json();const p=((j.candidates||[])[0]||{}).content;const t=((p&&p.parts)||[]).map(x=>x.text||'').join('').trim();if(!t)throw kiErr('leer');return t}
catch(e){if(e.name==='AbortError')throw kiErr('zeit');if(e.message&&e.status)throw e;throw kiErr('netz')}finally{clearTimeout(to)}}
/* Einziger Weg zur KI. Wirft 'aus', wenn KI nicht freigeschaltet ist. */
async function kiCall(system,user,opts){if(!kiOn())throw kiErr('aus');return kiRaw(kiLs(KI_KEY),kiModel(),system,user,opts)}
function kiJson(t){let s=String(t||'').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();try{return JSON.parse(s)}catch(e){const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(s.slice(a,b+1))}catch(e2){}}}throw kiErr('format')}
const kiErrText=e=>({aus:'KI ist ausgeschaltet.',key:'Der Schlüssel wurde nicht akzeptiert.',modell:'Das Modell wurde nicht gefunden. Prüfe den Modellnamen.',limit:'Das Limit ist erreicht. Versuche es später noch einmal.',dienst:'Der Dienst antwortet gerade nicht.',leer:'Es kam keine Antwort.',zeit:'Zeitüberschreitung. Bist du online?',netz:'Keine Verbindung. Bist du online?','zu-lang':'Die Anfrage ist zu lang.',format:'Die Antwort der KI war nicht lesbar. Versuche es noch einmal.',pruef:'Die Antwort der KI passt nicht zur Aufgabe. Es wurde nichts übernommen.'}[e&&e.message]||'Es ging etwas schief.');
function rowKI(){return rowH(['flask','KI-Funktionen',kiOn()?'An · '+esc(kiModel()):'Aus',"sheetKI()"])}
function kiRow(){return rowKI()}
function sheetKI(){const on=kiOn();const has=!!kiLs(KI_KEY);
setSub('KI-Funktionen',`<div class="s" style="margin-bottom:10px;line-height:1.5">Die KI hilft beim Bedienen der App und später beim Erfassen und Auswerten. Sie ist nur an, wenn ein geprüfter Schlüssel hinterlegt ist. Ohne Schlüssel läuft die App wie bisher, nur mit Texterkennung.</div>
<div class="card" style="padding:12px 14px;margin-bottom:12px"><b>${on?'KI ist freigeschaltet':'KI ist aus'}</b><div class="s">${on?'Modell: '+esc(kiModel()):'Hinterlege einen Schlüssel und prüfe ihn.'}</div></div>
<label class="fld"><span>Modell</span><input id="kimodel" value="${esc(kiModel())}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
<div style="display:flex;flex-wrap:wrap;gap:6px;margin:-4px 0 8px">${KI_MODELS.map(m=>`<button class="pill" onclick="document.getElementById('kimodel').value='${m[0]}'">${m[1]}</button>`).join('')}</div>
<div class="s" style="margin-bottom:6px">Tippe ein Modell an oder trage einen eigenen Namen ein. Nach dem Prüfen siehst du die Antwortzeit, so kannst du Modelle vergleichen.</div>
<label class="fld"><span>Schlüssel (API-Key)</span><input id="kikey" type="password" placeholder="${has?'Schlüssel gespeichert, neu eingeben zum Ersetzen':'Schlüssel einfügen'}" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
<div id="kimsg" class="s" style="min-height:1.3em;margin:6px 0">${esc(KI_MSG)}</div>
<div class="btns"><button class="btn" id="kibtn" onclick="kiCheckBtn()">Schlüssel prüfen</button>${has?'<button class="btn sec" onclick="kiRemove()">Schlüssel entfernen</button>':''}</div>
<div class="s" style="margin-top:14px;line-height:1.5">Der Schlüssel bleibt nur auf diesem Gerät und ist nicht in der Sicherung. Bei einer Frage an die KI gehen der Fragetext und nur die dafür nötigen Angaben an Google. Beim App-Guide sind das deine Frage und die Beschreibung der App, keine Lager- oder Rezeptdaten. Wenn du den Schlüssel entfernst, ist die KI sofort aus.</div>`)}
async function kiCheckBtn(){if(KI_BUSY)return;const m=document.getElementById('kimodel'),k=document.getElementById('kikey');const model=((m&&m.value)||KI_MODEL).trim()||KI_MODEL;const key=((k&&k.value)||'').trim()||kiLs(KI_KEY)||'';
if(!key){KI_MSG='Bitte einen Schlüssel eintragen.';sheetKI();return}
KI_BUSY=true;const b=document.getElementById('kibtn');if(b){b.disabled=true;b.textContent='Prüfe …'}
try{const t0=Date.now();await kiRaw(key,model,'Antworte nur mit dem Wort ok.','Test');const sec=((Date.now()-t0)/1000).toFixed(1).replace('.',',');kiLs(KI_KEY,key);kiLs(KI_CFG,JSON.stringify({model,ok:true,checked:today()}));KI_MSG='Schlüssel geprüft, KI ist freigeschaltet. Antwortzeit '+sec+' s.'}
catch(e){kiLs(KI_CFG,JSON.stringify({model,ok:false}));KI_MSG=kiErrText(e)}
KI_BUSY=false;setNavFix();sheetKI()}
function kiRemove(){kiLs(KI_KEY,null);kiLs(KI_CFG,null);KI_MSG='Schlüssel entfernt, KI ist aus.';setNavFix();sheetKI()}

/* ---------- KI-Testsatz: Chargen, Nachbewertungen und Preisverläufe zu den Testrezepten (nur Expertenmodus) ---------- */
function demoKiCount(){return (S.chg||[]).filter(c=>c.demo==='ki').length}
function demoKiLoad(){if(!S.expert)return;if(!(S.rez||[]).some(r=>r.demo))demoLoad();if(demoKiCount()){toast('KI-Testsatz ist schon geladen');return}
const snap=JSON.stringify(S);rzChgAll();const day=864e5,now=Date.now();const iso=o=>new Date(now-o*day).toISOString().slice(0,16);
const rez=k=>S.rez.find(r=>r.demo===k);
const sw=DEMOKI.swap,rs=rez(sw.key);if(rs&&rs.vers.length<2){const d=JSON.parse(JSON.stringify(rs.vers[0].d));const it=S.items.find(x=>x.cid===sw.to);d.phasen.forEach(p=>p.z.forEach(z=>{if(z.cid===sw.frm&&it){z.cid=sw.to;z.item=it.id}}));rs.vers.push({n:2,date:iso(110),note:DEMO_NOTE+' · Zutatentausch',diff:[],from:1,st:'',d})}
let n=0;DEMOKI.chg.forEach(c=>{const r=rez(c.key);if(!r)return;const v=r.vers.find(x=>x.n===c.ver)||r.vers[0];const lines=[];v.d.phasen.forEach(p=>p.z.forEach(z=>{const cm=z.cid&&CM[z.cid];lines.push({n:z.name||(cm?cm.n:'Zutat'),item:z.item||'',soll:z.g,ist:z.g})}));
Object.keys(c.delta).forEach(i=>{if(lines[i])lines[i].ist=Math.round((lines[i].soll+c.delta[i])*100)/100});
const o={id:uid(),rez:r.id,ver:v.n,date:iso(c.off),total:Math.round(lines.reduce((a,l)=>a+l.ist,0)*100)/100,note:c.note,stars:c.stars,abz:0,lines,demo:'ki'};
if(c.k&&Object.keys(c.k).length)o.k=c.k;if(c.bew.length)o.bew=c.bew.map(b=>({id:uid(),date:iso(b.off).slice(0,10),stars:b.stars,k:b.k||{},note:b.note||''}));S.chg.push(o);n++});
let nb=0;DEMOKI.bezug.forEach(b=>{const it=S.items.find(x=>x.cid===b.cid);if(it){it.bezug.push({id:uid(),lief:b.lief,nr:'',preis:b.preis,menge:b.menge,kind:it.kind,datum:iso(b.off).slice(0,10),demo:1});nb++}});
save();closeSheet();undoOffer('KI-Testsatz geladen',snap,JSON.stringify(S),true);toast(n+' Chargen, '+nb+' Preise geladen')}
function demoKiRm(){const snap=JSON.stringify(S);S.chg=(S.chg||[]).filter(c=>c.demo!=='ki');S.items.forEach(i=>{i.bezug=(i.bezug||[]).filter(b=>!b.demo)});S.rez.forEach(r=>{if(r.demo&&r.vers.length>1)r.vers=r.vers.filter(v=>!/Zutatentausch$/.test(v.note||''))});save();closeSheet();undoOffer('KI-Testsatz entfernt',snap,JSON.stringify(S),true);toast('KI-Testsatz entfernt')}
(function(){const o=demoBlockHtml;demoBlockHtml=function(){const h=o();if(!h)return h;const c=demoKiCount();return h+`<div style="height:18px"></div><div class="s" style="margin-bottom:8px">KI-Testsatz: etwa 55 Chargen mit Nachbewertungen und Preisverläufe, mit eingebauten Auffälligkeiten zum Prüfen der Auswertung.${c?' Geladen: '+c+' Chargen.':''}</div><div class="btns"><button class="btn" onclick="demoKiLoad()">KI-Testsatz laden</button>${c?'<button class="btn sec" onclick="demoKiRm()">KI-Testsatz entfernen</button>':''}</div>`}})();
(function(){const o=demoRm;demoRm=function(){o.apply(this,arguments);S.items.forEach(i=>{i.bezug=(i.bezug||[]).filter(b=>!b.demo)});save()}})();
