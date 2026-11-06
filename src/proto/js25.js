/* ---------- Einheitliche Rückwege in allen Fenstern: Pfeil oben links ---------- */
let SNAVPEND=null,SNAV=[],SNAVT='',SNAVH='',SNAVCLICK=false,SNAVRAW=false;
{const st=document.createElement('style');st.textContent='.sheet .bk{position:absolute;left:8px;top:6px;width:44px;height:44px;background:none;border:0;color:var(--sub);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}';document.head.appendChild(st)}
document.addEventListener('click',e=>{SNAVCLICK=!!(e.target&&e.target.closest&&e.target.closest('#sheet'))},true);
const sheetTitleOf=h=>{const m=/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(h||'');return m?m[1].replace(/<[^>]*>/g,'').trim():''};
const closeSheetRaw=closeSheet,openSheetRaw=openSheet;
closeSheet=function(){SNAV=[];SNAVT='';SNAVH='';closeSheetRaw()};
openSheet=function(html){const cur=document.getElementById('sheet');const t=sheetTitleOf(html);let keep=SNAV.slice();
if(!cur)keep=SNAVPEND||[];else if(!SNAVRAW&&SNAVCLICK&&SNAVH&&(!t||t!==SNAVT)){const c=cur.cloneNode(true);c.querySelectorAll('.x,.grab,.bk').forEach(n=>n.remove());keep.push({h:c.innerHTML,t:SNAVT})}
openSheetRaw(html);SNAV=keep;SNAVT=t;SNAVH=html;
if(SNAV.length){const s=document.getElementById('sheet');if(s)s.insertAdjacentHTML('afterbegin','<button class="bk" onclick="sheetBack()" aria-label="Zurück">'+ic('back','currentColor',22)+'</button>')}};
function sheetBack(){const s=SNAV.pop();if(!s){closeSheet();return}SNAVRAW=true;const keep=SNAV.slice();try{openSheet(s.h)}finally{SNAVRAW=false}SNAV=keep;
const sh=document.getElementById('sheet');if(sh){const b=sh.querySelector('.bk');if(b&&!SNAV.length)b.remove();else if(!b&&SNAV.length)sh.insertAdjacentHTML('afterbegin','<button class="bk" onclick="sheetBack()" aria-label="Zurück">'+ic('back','currentColor',22)+'</button>')}
try{if(typeof trWalk==='function'&&LANG!=='de')trWalk(sh)}catch(e){}}
{const dr=draw;draw=function(){const pend=SNAV.slice();dr.apply(this,arguments);SNAVPEND=pend;setTimeout(()=>{SNAVPEND=null},0)}}
