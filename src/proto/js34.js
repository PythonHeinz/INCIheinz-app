/* ---------- KI-Funktion B: App-Guide (Konzept §3, erste Probe) ----------
   Wissensquelle ist nur die mitgelieferte Landkarte der App (wissen/app-landkarte.md). Es werden keine Lager- oder Rezeptdaten gesendet.
   Der Guide liest nur und schreibt nichts. Der Nutzer kann keine eigenen Quellen hinzufügen. */
let KI_MAP=null,KI_GQ='',KI_GA='';
async function kiMap(){if(KI_MAP)return KI_MAP;let t=window.KI_MAPTEXT;if(!t){const r=await fetch('wissen/app-landkarte.md?t='+Date.now());if(!r.ok)throw kiErr('wissen');t=await r.text()}
const i=t.indexOf('\n## 9.');KI_MAP=(i>0?t.slice(0,i):t);return KI_MAP}
const KI_GUIDE_SYS=l=>`Du bist der App-Guide der App INCIheinz (Rohstofflager und Rezeptbuch für Naturkosmetik). Beantworte Fragen zur Bedienung der App ausschließlich anhand der folgenden Landkarte. Nenne Menüwege so, wie sie in der Landkarte stehen. Erfinde keine Knöpfe, Seiten oder Funktionen. Steht etwas nicht in der Landkarte, sage, dass du es nicht sicher weißt, und verweise auf Mehr › Einstellungen › Hilfe › Anleitung. Antworte kurz, in Schritten, in der Sprache der Frage (App-Sprache: ${l}). Gib keine Wirk- oder Gesundheitsversprechen und keine Rezeptempfehlungen, du erklärst nur die App.\n\nLandkarte der App:\n`;
function sheetGuide(){const on=kiOn();
setSub('App-Guide',`<div class="s" style="margin-bottom:8px">Frage, wie etwas in der App geht. Es wird nur deine Frage mit der Beschreibung der App gesendet, keine Lager- oder Rezeptdaten. Antworten einer KI können falsch sein. Maßgeblich ist die Anleitung.</div>
<label class="fld"><span>Deine Frage</span><textarea id="kigq" rows="3" placeholder="Zum Beispiel: Wie ändere ich die Menge im Lager?">${esc(KI_GQ)}</textarea></label>
<div class="btns"><button class="btn" id="kigb" onclick="kiAsk()">Fragen</button></div>
<div id="kiga" class="card" style="padding:12px 14px;margin-top:12px;display:${KI_GA?'block':'none'};line-height:1.5">${KI_GA}</div>`)}
const kiFmt=t=>esc(t).replace(/`([^`]+)`/g,'$1').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,;:!?]|$)/g,'$1<i>$2</i>').replace(/\n/g,'<br>');
async function kiAsk(){const q=document.getElementById('kigq');const v=(q&&q.value||'').trim();if(!v||KI_BUSY)return;KI_GQ=v;KI_BUSY=true;const b=document.getElementById('kigb'),a=document.getElementById('kiga');if(b){b.disabled=true;b.textContent='Denke nach …'}
let out;try{const map=await kiMap();out=kiFmt(await kiCall(KI_GUIDE_SYS(LANG)+map,v.slice(0,600)))}catch(e){out=esc(e&&e.message==='wissen'?'Die Beschreibung der App ist gerade nicht erreichbar. Bist du online?':kiErrText(e))}
KI_BUSY=false;KI_GA=out;if(b){b.disabled=false;b.textContent='Fragen'}if(a){a.style.display='block';a.innerHTML=out}}
/* Eintrag im Mehr-Menü, nur wenn die KI freigeschaltet ist */
(function(){const o=sheetMehr;sheetMehr=function(){o.apply(this,arguments);if(!kiOn())return;const s=shEl();if(s)s.insertAdjacentHTML('beforeend',mcap('KI')+rowH(['flask','App-Guide','Fragen zur Bedienung',"sheetGuide()"]))}})();
