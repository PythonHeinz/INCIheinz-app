const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const r={};S.expert=true;S.items=[];S.rez=[];S.chg=[];S.tm={};S.mut='de';
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
const arg=CAT.find(c=>/^argan/i.test(c.n)),zit=CAT.find(c=>/^zitronens/i.test(c.n));
let calls=[];const EXT=JSON.stringify({name:'Shampoo Bars',sprache:'en',ergibt_g:100,zweck:'Shampoo Bars',ph:'around 5.3',phasen:[{typ:'',name:'Dry phase',z:[{name:'argan oil',menge:10,einheit:'g'},{name:'citric acid',menge:2,einheit:'g'}]},{typ:'',name:'Wet phase',z:[{name:'Red #40 water soluble dye',menge:0.04,einheit:'g'},{name:'Stock Fragrance',menge:3,einheit:'g'}]}],schritte:['Put on your dust mask.','Stir until uniform.'],hinweise:[{art:'Tipp',text:'Change the dry phase and adjust pH.'}]});
const TRN={'Dry phase':{de:'Trockenphase',es:'Fase seca'},'Put on your dust mask.':{de:'Staubmaske aufsetzen.',es:'Póngase una mascarilla.'},'Red #40 water soluble dye':{de:'Roter Farbstoff Nr. 40 (wasserlöslich)',es:'Colorante rojo n.º 40'},'around 5.3':{de:'etwa 5,3',es:'alrededor de 5,3'}};
window.KI_MOCK=async(s,u,m,o)=>{calls.push(s.slice(0,22));
 if(/dem Rohstoffkatalog/.test(s)){const d=JSON.parse(u.match(/<daten>\n([\s\S]*?)\n<\/daten>/)[1]);r.sentIng=d.zutaten.map(z=>z.name);return JSON.stringify({zutaten:d.zutaten.map(z=>/argan/i.test(z.name)?{k:z.k,id:arg.id}:/citric/i.test(z.name)?{k:z.k,id:zit.id}:{k:z.k,id:'ERFUNDEN123'})})}
 if(/Du übersetzt Texte/.test(s)){const d=JSON.parse(u.match(/<daten>\n([\s\S]*?)\n<\/daten>/)[1]);r.tr={ziele:d.ziele,quelle:d.quelle,n:d.texte.length,gloss:d.glossar.length,texte:d.texte.map(t=>t.text)};
  return JSON.stringify({texte:d.texte.map(t=>({k:t.k,uebersetzung:Object.fromEntries(d.ziele.map(l=>[l,TRN[t.text]?TRN[t.text][l]:(l+': '+t.text.slice(0,12)+(t.text==='Stir until uniform.'?' <b>':''))]))}))})}
 return EXT};
sheetRzImport('Shampoo Bars\nirgendein Text');await W();await rzKiRun();await W();
let t=document.getElementById('sheet').innerText;r.calls=calls.length;
r.dbg=t.slice(-420);r.prev={mapped:/2 von 4 Zutaten/.test(t),orig:/Sprache des Originals:\s*Englisch/i.test(t),ki:/nicht geprüft/.test(t),dryDE:/Trockenphase/.test(t)};
r.ziele=r.tr.ziele;r.quelle=r.tr.quelle;r.gloss=r.tr.gloss;r.texte=r.tr.texte;r.fake=RZIM.d.phasen.flatMap(p=>p.z).find(z=>/Stock/.test(z.name)).cid||'none';
r.noEs=!Object.values(RZIM.tm).some(e=>e.es);r.htmlDropped=!RZIM.tm['Stir until uniform.'];
rzImportOpen();await W();r.tmS=Object.keys(S.tm).length;r.st=S.tm['Dry phase'].st;
r.edDE=/Trockenphase/.test(document.getElementById('main').innerText);
// speichern, Version enthält d.lang
RE.d.name=RE.d.name;rzSave&&0;
setLang('en');await W();r.en=/Dry phase/.test(document.getElementById('main').innerText);
setLang('es');await W();r.es=/Dry phase/.test(document.getElementById('main').innerText);  // Lücke: Original
setLang('de');await W();
// speichern über rzDoSave
RE.pending={d:rzClone(RE.d),diff:[]};document.body.insertAdjacentHTML('beforeend','<textarea id="rn"></textarea>');rzDoSave();await W();const rez=rzAll()[0];r.dLang=rez&&rezV(rez);function rezV(x){return x.vers[0].d.lang}
r.lk=(document.querySelector('#main .rz-lk')||{}).outerHTML;r.view=/Originalsprache:\s*Englisch/i.test(document.getElementById('main').innerText);r.trBtn=/Übersetzen/i.test(document.getElementById('main').innerText);
// Übersetzungsblatt Spanisch
sheetRzTr(rez.id,'es');await W();let sh=document.getElementById('sheet').innerText;r.shEs=/Originalsprache:\s*Englisch/i.test(sh)&&/leer/i.test(sh);r.sh=sh.slice(0,200);r.rows=document.querySelectorAll('textarea[data-tr]').length;
// Hand eintragen
const first=document.querySelector('textarea[data-tr="0"]');first.value='Barras de champú';trSave();await W();r.hand=S.tm['Shampoo Bars']&&S.tm['Shampoo Bars'].es+'|'+S.tm['Shampoo Bars'].st.es;
// KI füllt Lücken
calls=[];await trKiFill();await W();r.kiFill={calls:calls.length,ziele:r.tr.ziele,n:r.tr.n,keepHand:S.tm['Shampoo Bars'].es,st:S.tm['Dry phase']&&S.tm['Dry phase'].st&&S.tm['Dry phase'].st.es};
setLang('es');await W();r.esShown=/Barras de champú/.test(document.getElementById('main').innerText);setLang('de');await W();
// Sammelfunktion: zweites Rezept (deutsch, ohne TM)
S.rez.push({id:'r2',created:new Date().toISOString(),vers:[{n:1,date:new Date().toISOString(),note:'',diff:[],d:{name:'Handcreme',zweck:'Hände',ph:'',ergibt:100,zeit:'',grad:'',phasen:[{id:'p',typ:'',name:'Phase A · Wasserphase',z:[{id:'z',item:'',cid:'',name:'Wasser',g:100}]}],mod:[{id:'m',t:'schritt',titel:'',text:'Alles verrühren und abfüllen.'}]},from:0,st:''}]});
TRA.langs=['en','es'];calls=[];sheetTrAll();await W();r.info=document.getElementById('trinfo').innerText;await trAllGo();await W();r.batch={calls:calls.length,info:document.getElementById('trinfo').innerText,en:S.tm['Handcreme']&&S.tm['Handcreme'].en};
sheetTrAll();await W();r.infoAfter=document.getElementById('trinfo').innerText;
window.KI_MOCK=async()=>{throw kiErr('limit')};S.tm={};TRA.langs=['en'];sheetTrAll();await W();await trAllGo();await W();r.limitMsg=document.getElementById('er').textContent;
// Alle Sprachen beim Import
S.tm={};S.mut='de';window.KI_MOCK=async(s,u)=>{if(/dem Rohstoffkatalog/.test(s))return JSON.stringify({zutaten:[]});if(/Du übersetzt Texte/.test(s)){r.all=JSON.parse(u.match(/<daten>\n([\s\S]*?)\n<\/daten>/)[1]).ziele;return JSON.stringify({texte:[]})}return EXT};
sheetRzImport('x');await W();document.getElementById('rztall').checked=true;await rzKiRun();await W();
// Quelle = Zielsprache: keine Übersetzung
let tcalls=0;window.KI_MOCK=async(s)=>{if(/Du übersetzt Texte/.test(s))tcalls++;if(/dem Rohstoffkatalog/.test(s))return JSON.stringify({zutaten:[]});return EXT.replace('"en"','"de"')};
sheetRzImport('x');await W();await rzKiRun();await W();r.noTrSame=tcalls;
LANG='en';sheetTrAll();await W();r.enUI=document.getElementById('sheet').innerText.slice(0,60);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
