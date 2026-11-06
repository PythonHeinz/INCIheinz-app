// Korrekturrunde 06.11. (nachts): Editor/Phasen, Minuten, Ziehen, Entwurf, Zurück-Geste, Tastatur, Menüs, Import, Export, Umrechnen
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:860},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///mnt/user-data/outputs/netlify/index.html');await p.waitForTimeout(1500);
const T=async(f,a)=>{const r=await p.evaluate(f,a);await p.waitForTimeout(250);return r};
let ok=0,bad=0;const chk=(n,c)=>{if(c){ok++}else{bad++;console.log('FEHLER:',n)}};
await T(()=>{S.expert=true;demoLoad()});
// --- Neues Rezept: Zutatenliste oben, danach Phasen mit Zuordnung
await T(()=>tab('rez'));await T(()=>rzEdit(null));
chk('Leerzustand: Zutatenliste (Pool) vorhanden',await T(()=>RE.d.phasen.length===1&&RE.d.phasen[0].pool&&/Zutaten/.test(document.getElementById('main').innerText)));
await p.screenshot({path:'/tmp/t/g1.png'});
await T(()=>{RZPK={pi:0,zi:-1};rzPickZ(0,-1)});await T(()=>{document.getElementById('rzpq').value='wasser';rzPickList()});await T(()=>rzSetZ('t'));await T(()=>rzZg(0,0,'80'));
await T(()=>{RZPK={pi:0,zi:-1};rzSetZ('i',window.__id=S.items.find(i=>i.kind==='v'&&i.dens>0).id)});await T(()=>rzZg(0,1,'20'));
await T(()=>{RZPK={pi:0,zi:-1};rzSetZ('i',S.items.find(i=>i.kind==='w').id)});await T(()=>rzZg(0,2,'10'));
chk('3 Zutaten oben, Summe 110',await T(()=>RE.d.phasen[0].z.length===3&&rzSum(RE.d)===110));
// Phase A anlegen: Zuordnungs-Fenster zeigt die Zutaten aus der Liste
await T(()=>rzNewPhase('A'));
chk('Zuordnen-Fenster öffnet sich mit 3 Zutaten',await T(()=>/Zutaten zuordnen/.test(document.getElementById('sheet').innerText)&&document.querySelectorAll('#sheet input[type=checkbox]').length===3));
await p.screenshot({path:'/tmp/t/g1b.png'});
await T(()=>{const c=document.querySelectorAll('#sheet input[type=checkbox]')[0];c.checked=true;c.dispatchEvent(new Event('change'))});await T(()=>rzAssignDo());
chk('Wasser in Phase A, Liste hat noch 2',await T(()=>RE.d.phasen[1].z.length===1&&RE.d.phasen[0].z.length===2));
await T(()=>rzNewPhase('B'));await T(()=>{[...document.querySelectorAll('#sheet input[type=checkbox]')].slice(0,2).forEach(c=>{c.checked=true;c.dispatchEvent(new Event('change'))})});await T(()=>rzAssignDo());
chk('Rest in Phase B, Liste leer',await T(()=>RE.d.phasen[2].z.length===2&&RE.d.phasen[0].z.length===0));
chk('Leere Liste wird nicht gezeigt, Phasen sichtbar',await T(()=>!document.querySelector('.rz-pool')&&document.querySelectorAll('.rz-ph').length===2));
// Phasenmenü nicht leer
await T(()=>rzPhMenu(1));chk('Phasenmenü hat Inhalt',await T(()=>/phase entfernen/i.test(document.getElementById('sheet').innerText)&&/art der phase/i.test(document.getElementById('sheet').innerText)));
await T(()=>rzPhType(2,'C'));chk('Typ wechselt Namen',await T(()=>RE.d.phasen[2].typ==='C'&&/Wärmeempfindliche/.test(RE.d.phasen[2].name)));
// Zutat in andere Phase verschieben
await T(()=>rzMoveOne(2,0,1));chk('Zutat verschoben',await T(()=>RE.d.phasen[1].z.length===2&&RE.d.phasen[2].z.length===1));
await T(()=>rzMoveOne(1,1,2));
chk('Summe',await T(()=>rzSum(RE.d)===110));
// Einheit ml
const vz=await T(()=>RE.d.phasen.flatMap((p,pi)=>p.z.map((z,zi)=>[pi,zi,z])).find(a=>rzDensZ(a[2])>0&&a[2].g===20));
await T(([a,b])=>rzZU(a,b),[vz[0],vz[1]]);chk('ml-Modus',await T(([a,b])=>RE.d.phasen[a].z[b].u==='ml',[vz[0],vz[1]]));
await T(([a,b])=>rzZg(a,b,'25'),[vz[0],vz[1]]);chk('ml rechnet in g',await T(([a,b])=>{const z=RE.d.phasen[a].z[b];return Math.abs(z.g-25*rzDensZ(z))<1e-9},[vz[0],vz[1]]));
await T(([a,b])=>rzZU(a,b),[vz[0],vz[1]]);
// Zeit
await T(()=>rzF('zeit','45'));chk('Zeit 45',await T(()=>rzZeit('45')==='45 min'&&rzZeit('45 min')==='45 min'&&rzZeit('90')==='1 h 30 min'&&rzZeit('1 h')==='1 h'));
// Umrechnen auf 85 g
await T(()=>rzScaleSheet());await T(()=>{document.getElementById('rzs_t').value='85'});await T(()=>rzScaleDo());
chk('umgerechnet 85',await T(()=>Math.abs(rzSum(RE.d)-85)<0.01));
await p.screenshot({path:'/tmp/t/g2.png'});
// Module + Ziehen
await T(()=>{RZINS=null;rzNewMod('schritt');rzNewMod('hinweis');rzNewMod('notiz')});
const order0=await T(()=>RE.d.mod.map(m=>m.t).join());
await T(()=>{document.querySelectorAll('#rz_mods details').forEach(d=>d.open=false);document.getElementById('rz_mods').scrollIntoView({block:'center'})});await p.waitForTimeout(200);
const g0=await p.$$('.rz-dw .rz-grip');const bb=await g0[0].boundingBox();const bb2=await g0[2].boundingBox();
await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width/2,bb.y+60,{steps:5});await p.mouse.move(bb.x+bb.width/2,bb2.y+bb2.height+20,{steps:12});await p.waitForTimeout(150);await p.mouse.up();await p.waitForTimeout(300);
const order1=await T(()=>RE.d.mod.map(m=>m.t).join());
chk('Modul gezogen ('+order0+' -> '+order1+')',order0!==order1&&order1.split(',')[2]==='schritt');
await p.screenshot({path:'/tmp/t/g3.png'});
// Phase ziehen
await T(()=>document.getElementById('rz_phs').scrollIntoView({block:'center'}));const gp=await p.$$('.rz-ph .rz-grip');const pb=await gp[0].boundingBox();const pb2=await (await p.$('#rzph_2')).boundingBox();
const pn0=await T(()=>RE.d.phasen.map(x=>x.typ).join());
await p.mouse.move(pb.x+pb.width/2,pb.y+pb.height/2);await p.mouse.down();await p.mouse.move(pb.x+5,pb.y+40,{steps:4});await p.mouse.move(pb.x+5,pb2.y+pb2.height-10,{steps:10});await p.waitForTimeout(150);await p.mouse.up();await p.waitForTimeout(300);
chk('Phase gezogen',await T(()=>RE.d.phasen.map(x=>x.typ).join())!==pn0);
// Name, Entwurf
await T(()=>{document.getElementById('re_name').value='Testcreme Nacht';rzF('name','Testcreme Nacht')});
await p.waitForTimeout(1500);
chk('Entwurf gespeichert',await T(()=>!!JSON.parse(localStorage.getItem('inciheinz-draft')||'null')));
// Neuladen: Entwurf wird angeboten
await T(()=>save());await p.waitForTimeout(500);
await p.reload();await p.waitForTimeout(2200);
chk('Entwurf-Hinweis nach Neustart',await T(()=>/Entwurf gefunden/.test(document.getElementById('sheet')?document.getElementById('sheet').innerText:'')));
await p.screenshot({path:'/tmp/t/g4.png'});
await T(()=>draftRestore());
chk('Entwurf wiederhergestellt',await T(()=>R.name==='reze'&&RE.d.name==='Testcreme Nacht'&&RE.d.mod.length===3&&RE.d.phasen.length===3));
// Zurück-Geste im Editor: fragt nach, schließt nicht
await p.goBack();await p.waitForTimeout(500);
chk('Zurück-Geste fragt nach',await T(()=>/Ungespeicherte Arbeit/.test(document.getElementById('sheet')?document.getElementById('sheet').innerText:'')));
await p.goBack();await p.waitForTimeout(400);
chk('Zurück schließt Fenster, Editor bleibt',await T(()=>!document.getElementById('sheet')&&R.name==='reze'));
// Tastatur: Leiste weg
await p.focus('#re_name');await p.setViewportSize({width:390,height:520});await p.waitForTimeout(300);
chk('Leiste weg bei Tastatur',await T(()=>getComputedStyle(document.getElementById('rzbar')).display==='none'));
await p.screenshot({path:'/tmp/t/g5.png'});
await p.evaluate(()=>document.activeElement.blur());await p.setViewportSize({width:390,height:860});await p.waitForTimeout(300);
chk('Leiste zurück',await T(()=>getComputedStyle(document.getElementById('rzbar')).display!=='none'));
// Speichern
await T(()=>rzSave());await T(()=>rzDoSave());
chk('Rezept gespeichert, Entwurf weg',await T(()=>R.name==='rezv'&&S.rez.some(r=>rzCurV(r).d.name==='Testcreme Nacht')&&!localStorage.getItem('inciheinz-draft')));
const rid=await T(()=>R.id);
// Ansicht: ml, Fork, Chargen
await p.screenshot({path:'/tmp/t/g6.png'});
await T(()=>{S.items.forEach(i=>{if(!(i.dens>0))i.dens=0.92});});
await T(()=>draw());chk('ml-Schalter da',await T(()=>!!document.querySelector('.seg2')));
await T(()=>rzUnit('ml'));chk('ml-Gesamtmenge',await T(()=>/Gesamtmenge \(ml\)/.test(document.getElementById('main').innerText)));
await T(()=>{document.getElementById('rz_tot').value='50';rzTot('50')});
chk('ml-Eingabe rechnet',await T(()=>{const d=rzCurD();return Math.abs(RC.total/rzSum(d)*rzVolBase(d)-50)<0.01}));
await T(()=>rzUnit('g'));
await T(()=>rzFork(R.id,0));chk('Fork öffnet neuen Entwurf',await T(()=>R.name==='reze'&&RE.id===null&&/Kopie/.test(RE.d.name)));
await T(()=>{RE.dirty=false;RE=null;back()});
await T(()=>rzChgOf(R.id));chk('Chargen-Seite gefiltert',await T(()=>R.name==='chgs'&&R.rez&&/Noch keine Charge/.test(document.getElementById('main').innerText)));
// Menüs
await T(()=>tab('rez'));await T(()=>sheetMehr());
const mr=await T(()=>document.getElementById('sheet').innerText);
chk('Rezept-Mehr hat Import/Export/Einstellungen/App',/drucken & gestalten/i.test(mr)&&/statistik/i.test(mr)&&/daten/i.test(mr)&&/import/i.test(mr)&&/rezepte teilen/i.test(mr)&&/voreinstellungen rezeptbuch/i.test(mr)&&/für die ganze app/i.test(mr)&&!/katalog aktualisieren/i.test(mr)&&!/chargenbuch/i.test(mr)&&!/lagerorte/i.test(mr));
await p.screenshot({path:'/tmp/t/g7.png'});
await T(()=>tab('lager'));await T(()=>sheetMehr());
const ml=await T(()=>document.getElementById('sheet').innerText);
chk('Lager-Mehr hat Lager-Einstellungen+App',/lagerorte/i.test(ml)&&/drucken & gestalten/i.test(ml)&&/etiketten/i.test(ml)&&/voreinstellungen lager/i.test(ml)&&/für die ganze app/i.test(ml)&&/einstellungen/i.test(ml)&&!/rezepte teilen/i.test(ml)&&!/katalog aktualisieren/i.test(ml));
await T(()=>sheetAppSet());chk('Einstellungen ohne Lagerorte',await T(()=>{const t=document.getElementById('sheet').innerText;return /sprache/i.test(t)&&!/lagerorte/i.test(t)&&!/lieferanten/i.test(t)}));
await T(()=>sheetLagerSet());chk('Lager-Einstellungen',await T(()=>/Lagerorte/.test(document.getElementById('sheet').innerText)));
await T(()=>{document.getElementById('no').value='Keller';addOrt()});chk('Ort hinzugefügt bleibt in Lager-Einstellungen',await T(()=>S.orte.includes('Keller')&&/Lager-Einstellungen/.test(document.getElementById('sheet').innerText)));
await T(()=>sheetRzSet());await T(()=>rzModTog('notiz',false));await T(()=>rzStepSet(0.5));
chk('Rundung gesetzt',await T(()=>S.rezStep===0.5&&S.rzModOff.includes('notiz')));
await T(()=>{S.rezStep=0.1;S.rzModOff=[]});
// Import
const txt='Handcreme Test\nPhase A: Wasserphase\n80 g Wasser\n5 g Glycerin\nPhase B: Ölphase\nSheabutter 20 g\nMandelöl 15 ml\nZubereitung\n1. Phase A und B erwärmen.\n2. Zusammenrühren und abkühlen lassen.\nTipp: Nicht zu heiß werden lassen.\nHaltbarkeit: 3 Monate';
const pr=await T(t=>{const r=rzParse(t);return {n:r.d.name,ph:r.d.phasen.map(p=>p.typ+':'+p.z.map(z=>z.name+'='+z.g).join('|')),mod:r.d.mod.map(m=>m.t).join(),warn:r.warn}},txt);
console.log(JSON.stringify(pr));
chk('Import: Name, 2 Phasen, 4 Zutaten',pr.n==='Handcreme Test'&&pr.ph.length===2&&pr.ph[0].startsWith('A:')&&pr.ph[1].startsWith('B:'));
chk('Import: Schritte+Hinweis+Haltbarkeit',pr.mod==='schritt,schritt,hinweis,halt');
const pr2=await T(()=>{const r=rzParse('Mein Balsam\n30 g Sheabutter\nKakaobutter 20 g\n10 ml Jojobaöl\n5 EL Wasser');return {ph:r.d.phasen.map(p=>p.name+':'+p.z.length),warn:r.warn}});
chk('Import ohne Phasen: eine Liste',pr2.ph.length===1&&pr2.ph[0]==='Zutaten:4');console.log(JSON.stringify(pr2));
await T(()=>tab('rez'));await T(()=>sheetRzImport());await T(t=>{document.getElementById('rzit').value=t;rzImportRun()},txt);
chk('Import-Vorschau',await T(()=>/Das habe ich erkannt/.test(document.getElementById('sheet').innerText)));
await p.screenshot({path:'/tmp/t/g8.png'});
await T(()=>rzImportOpen());chk('Import öffnet Editor',await T(()=>R.name==='reze'&&RE.d.name==='Handcreme Test'&&RE.dirty));
await T(()=>{RE.dirty=false;RE=null;draftClear();back()});
// Export
await T(()=>sheetRzExport());await p.screenshot({path:'/tmp/t/g9.png'});
await T(()=>sheetRzPub('card'));chk('Pub-Auswahl vorbelegt',await T(()=>RZX.ids.size>0&&![...RZX.ids].some(id=>rzGet(id).demo)||RZX.ids.size===rzAll().length));
await p.screenshot({path:'/tmp/t/g10.png'});
chk('Text einer Rezeptkarte',await T(()=>{const t=rzTextOf(rzAll()[0].id);return /Zutaten/.test(t)&&/ g /.test(t)}));
// Rundreise Text -> Parser
console.log(await T(()=>{const r=rzAll().find(x=>rzCurV(x).d.name==='Testcreme Nacht');return rzTextOf(r.id)+'\n#### '+JSON.stringify(rzParse(rzTextOf(r.id)).d.phasen.map(p=>[p.name,p.z.map(z=>z.name+'='+z.g)]))+' '+rzSum(rzCurV(r).d)}));
chk('Rundreise Text->Import',await T(()=>{const r=rzAll().find(x=>rzCurV(x).d.name==='Testcreme Nacht');const t=rzTextOf(r.id);const q=rzParse(t);return q.d.name==='Testcreme Nacht'&&q.d.phasen.length===2&&Math.abs(rzSum(q.d)-rzSum(rzCurV(r).d))<0.1}));
await T(()=>closeSheet());
console.log('Fehler in Konsole:',JSON.stringify(errs));
console.log('ok',ok,'bad',bad);await b.close();process.exit(bad||errs.length?1:0)})();
