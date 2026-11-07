# Erzeugt proto/testdaten_ki.js: Chargen, Nachbewertungen und Preisverläufe für die Testrezepte T01..T27.
# Deterministisch (fester Zufallswert). Alle Daten sind erfunden, nicht fachlich geprüft, nicht zum Nachmischen.
# Eingebaute Wahrheiten (Sollliste in TRUTH), die die Auswertung finden muss:
#  W1  T05 Handcreme: ab Version 2 (Zutatentausch) drei schlechtere Chargen in Folge
#  W2  T01 Lippenbalsam: eine Charge mit Einwaage 2 g über Soll
#  W3  K0071 Jojobaöl: Preissprung von rund 45 % beim letzten Kauf
#  W4  K0008 Sheabutter: Lieferantenwechsel, neuer Lieferant etwa 15 % günstiger
#  W5  T12 Gesichtswasser: nur zwei Chargen (zu wenig Daten, Auswertung muss vorsichtig bleiben)
import json,random
H='/home/claude/inciheinz-app/src/proto/'
t=open(H+'testdaten.js',encoding='utf-8').read()
D=json.loads(t[t.find('{'):t.rfind('}')+1])
rnd=random.Random(20261107)
keys=['T01','T02','T03','T05','T06','T09','T10','T12','T17','T19','T21','T24']
chg=[]
def add(key,ver,off,stars,note,delta=None,k=None,bew=None):
    chg.append(dict(key=key,ver=ver,off=off,stars=stars,note=note,delta=delta or {},k=k or {},bew=bew or []))
NOTES=['','','läuft gut','etwas fest','Duft schwach','schön cremig','']
for key in keys:
    if key in('T05','T12'):continue
    n=6 if key in('T01','T02','T06') else 4
    for i in range(n):
        off=230-int(i*(200/n))-rnd.randint(0,6)
        s=rnd.choice([4,4,5,3,5])
        add(key,1,off,s,rnd.choice(NOTES),k=dict(kons=rnd.randint(3,5),duft=rnd.randint(3,5),aus=rnd.randint(3,5),haut=rnd.randint(3,5)))
# W1: T05 erst gut (v1), dann drei schlechtere (v2)
for i,(off,s) in enumerate([(200,5),(170,4),(140,5)]):add('T05',1,off,s,'')
for i,(off,s) in enumerate([(100,2),(70,2),(40,3)]):add('T05',2,off,s,'körnig' if s==2 else 'wieder etwas fest',k=dict(kons=2,duft=4,aus=3,haut=3))
# W2: Einwaage 2 g über Soll
add('T01',1,12,4,'Shea zu viel eingewogen',delta={'1':2.0})
# W5: zu wenig Daten
add('T12',1,60,4,'');add('T12',1,20,5,'')
# Nachbewertungen für einige Chargen
for c in chg:
    if c['key'] in('T02','T06') and c['off']>120 and len(c['bew'])==0 and rnd.random()<0.6:
        c['bew'].append(dict(off=c['off']-35,stars=rnd.choice([3,4,5]),note='nach 5 Wochen',k=dict(kons=rnd.randint(3,5),duft=rnd.randint(2,4))))
chg.sort(key=lambda c:-c['off'])
bezug=[]
def b(cid,lief,preis,menge,off):bezug.append(dict(cid=cid,lief=lief,preis=preis,menge=menge,off=off))
# W3: Jojobaöl
for off,p in[(240,8.5),(170,8.7),(100,8.9),(20,12.9)]:b('K0071','Dragon Spice',p,100,off)
# W4: Sheabutter
for off,p in[(230,7.8),(160,7.9),(90,8.0)]:b('K0008','Dragon Spice',p,250,off)
for off,p in[(40,6.8),(5,6.7)]:b('K0008','Spinnrad',p,250,off)
for off,p in[(200,3.2),(120,3.3),(30,3.3)]:b('K0002','Spinnrad',p,100,off)
swap=dict(key='T05',frm='K0034',to='K0222')   # Zutatentausch in Version 2
TRUTH=dict(W1='T05 ab Version 2 schlechter',W2='T01 Einwaage +2 g',W3='K0071 Preissprung',W4='K0008 Lieferantenwechsel',W5='T12 zu wenig Daten')
out='/* erzeugt von src/testdaten/gen_ki.py, erfundene Daten, nicht fachlich geprüft */\nconst DEMOKI='+json.dumps(dict(chg=chg,bezug=bezug,swap=swap,truth=TRUTH),ensure_ascii=False)+';\n'
open(H+'testdaten_ki.js','w',encoding='utf-8').write(out)
print(len(chg),'Chargen',len(bezug),'Käufe')
