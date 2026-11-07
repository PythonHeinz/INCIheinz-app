const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:412,height:900}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{const W=()=>new Promise(x=>setTimeout(x,350));const r={};S.expert=true;S.items=[];S.rez=[];S.chg=[];S.tm={};
localStorage.setItem('inciheinz-ki-key','K');localStorage.setItem('inciheinz-ki-cfg',JSON.stringify({model:'m',ok:true}));
const arg=CAT.find(c=>/^argan/i.test(c.n)),zit=CAT.find(c=>/^zitronens/i.test(c.n)),gly=CAT.find(c=>/^glycerin/i.test(c.n));r.found=[!!arg,!!zit,!!gly];
r.catLen=CAT.map(c=>c.id+'|'+c.n).join('\n').length;
let calls=[];window.KI_MOCK=async(s,u,m,o)=>{calls.push({s:s.slice(0,30),len:u.length,max:o&&o.max});
 if(/Du hilfst, ein Rezept/.test(s)){const d=JSON.parse(u.match(/<daten>\n([\s\S]*?)\n<\/daten>/)[1]);r.sentZiele=d.ziele;r.sentIng=d.zutaten.map(z=>z.name);r.sentTexteN=d.texte.length;r.hasKat=/<katalog>/.test(u);
  return JSON.stringify({zutaten:d.zutaten.map(z=>/argan/i.test(z.name)?{k:z.k,id:arg.id,uebersetzung:{}}:/citric/i.test(z.name)?{k:z.k,id:zit.id}:/Red/.test(z.name)?{k:z.k,id:null,uebersetzung:{de:'Roter Farbstoff Nr. 40 (wasserlöslich)',es:'Colorante rojo n.º 40'}}:{k:z.k,id:'ERFUNDEN123',uebersetzung:{de:'x <b>y</b>',es:'z'}}),
   texte:d.texte.map(t=>({k:t.k,uebersetzung:{de:t.text==='Dry phase'?'Trockenphase':t.text==='Put on your dust mask.'?'Staubmaske aufsetzen.':'Übersetzt: '+t.text.slice(0,20),es:t.text==='Dry phase'?'Fase seca':'ES '+t.text.slice(0,10)}}))})}
 return JSON.stringify({name:'Shampoo Bars',sprache:'en',ergibt_g:100,phasen:[{typ:'',name:'Dry phase',z:[{name:'argan oil',menge:10,einheit:'g'},{name:'citric acid',menge:2,einheit:'g'}]},{typ:'',name:'Wet phase',z:[{name:'Red #40 water soluble dye',menge:0.04,einheit:'g'},{name:'Stock Fragrance',menge:3,einheit:'g'}]}],schritte:['Put on your dust mask.','Stir until uniform.'],hinweise:[{art:'Tipp',text:'Change the dry phase and adjust pH.'}]})};
sheetRzImport('Shampoo Bars\nirgendein Text');await W();await rzKiRun();await W();
const t=document.getElementById('sheet').innerText;r.calls=calls.length;r.max=calls[1]&&calls[1].max;r.ziele=r.sentZiele;
r.prev={mapped:/2 von 4 Zutaten/.test(t),orig:/Sprache des Originals: Englisch/.test(t),ki:/nicht geprüft/.test(t),dryDE:/Trockenphase/.test(t),argan:/Argan/i.test(t)};
r.tmPre=RZIM.tm?Object.keys(RZIM.tm).length:0;r.fake=RZIM.d.phasen.flatMap(p=>p.z).find(z=>/Stock/.test(z.name)).cid||'none';
rzImportOpen();await W();r.tmS=Object.keys(S.tm).length;
// Editor in DE: Phase
const m=document.getElementById('main').innerText;r.edDE=/Trockenphase/.test(m)&&/Roter Farbstoff/.test(m);
rzDoSave&&0;
// Sprache EN: Original
setLang('en');await W();let m2=document.getElementById('main').innerText;r.edEN=/Dry phase/.test(m2)&&/Red #40/.test(m2);
setLang('es');await W();let m3=document.getElementById('main').innerText;r.edES=/Fase seca/.test(m3)&&/Colorante rojo/.test(m3);
setLang('de');await W();r.back=/Trockenphase/.test(document.getElementById('main').innerText);
// Round trip: speichern und lesen
save();await W();r.persist=JSON.stringify(S).includes('Trockenphase');
// Zweiter Lauf: Quelle=App-Sprache -> keine Ziele
LANG='en';calls=[];window.KI_MOCK=async(s,u)=>{calls.push(1);if(/Du hilfst, ein Rezept/.test(s)){const d=JSON.parse(u.match(/<daten>\n([\s\S]*?)\n<\/daten>/)[1]);r.z2=d.ziele;r.t2=d.texte.length;return JSON.stringify({zutaten:[],texte:[]})}return JSON.stringify({name:'X',sprache:'en',phasen:[{name:'A',z:[{name:'Zzzx',menge:5,einheit:'g'}]}]})};
sheetRzImport('x');await W();await rzKiRun();await W();r.calls2=calls.length;
// Fehler der 2. Anfrage
LANG='de';calls=[];window.KI_MOCK=async(s)=>{if(/Du hilfst, ein Rezept/.test(s))throw kiErr('limit');return JSON.stringify({name:'X',sprache:'en',phasen:[{name:'A',z:[{name:'Zzzx',menge:5,einheit:'g'}]}]})};
sheetRzImport('x');await W();await rzKiRun();await W();const t3=document.getElementById('sheet').innerText;r.failOk=/Das habe ich erkannt/i.test(t3)&&/nicht möglich/.test(t3);
return r});console.log(JSON.stringify(out,null,1),errs);await b.close()})();
