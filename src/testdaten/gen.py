# Erzeugt proto/testdaten.js (Testrezepte + Testlager). Eigene Rezepturen, nicht aus Buch/Seite übernommen.
import json,re,unicodedata,sys
H='/home/claude/inciheinz-app'
cat=json.load(open(H+'/katalog.json'))['items']
def F(s): return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s.lower()).encode('ascii','ignore').decode())
byn={F(x['n']):x for x in cat}
W='Wasser'
# Phasen: A Wasser, B Fett, C kühl, D pH, P = Pulver/Mischung
R=[]
def rez(name,zweck,ergibt,ph,phasen,steps,grad='einfach',zeit='30 min'):
    R.append(dict(name=name,zweck=zweck,ergibt=ergibt,ph=ph,phasen=phasen,steps=steps,grad=grad,zeit=zeit))
S_FETT=[('Zutaten der Fettphase im Wasserbad schmelzen und mischen.','Wasserphase getrennt auf gleiche Temperatur bringen.'),]
def emu(b): return ['Fett- und Wasserphase getrennt auf etwa 70 °C erwärmen.','Wasserphase in die Fettphase geben und mit dem Stabmixer emulgieren.','Unter Rühren abkühlen, bei unter 40 °C Phase C einrühren, pH prüfen und abfüllen.']
ANH=['Feste Bestandteile im Wasserbad schmelzen.','Flüssige Öle einrühren, kurz abkühlen lassen.','In saubere Gefäße füllen und fest werden lassen.']
PUL=['Alle Pulver abwiegen und gründlich mischen.','Trocken in ein sauberes Gefäß füllen.']
TEN=['Tenside und Wasser vorsichtig mischen, nicht schäumen.','Gelbildner einstreuen und quellen lassen.','Übrige Zutaten einrühren, pH prüfen und abfüllen.']
rez('Lippenbalsam Jojoba-Kakao','Lippenpflege',20,'',[('B',[('Jojobaöl BIO kalt gepresst',8),('Shea Butter Bio',5),('Bienenwachs',3.6),('Kakaobutter Bio',3),('Vitamin E',0.4)])],ANH)
rez('Körperbutter Mango','Körperpflege, wasserfrei',100,'',[('B',[('Shea Butter Bio',40),('Mangobutter raffiniert',20),('Kokosöl',14),('Aprikosenkernöl raffiniert',23),('Vitamin E',1),('Rosmarinextrakt (Antioxidans)',1),('Lavendel Spike ätherisches Öl',1)])],['Butter und Kokosöl im Wasserbad schmelzen, Öl und Zusätze einrühren.','Im Kühlschrank anziehen lassen, dann cremig aufschlagen.','In ein Glas füllen.'])
rez('Lotion Bar Kakao','Körperpflege, fester Stift',60,'',[('B',[('Kakaobutter Bio',15),('Bienenwachs',14),('Mandelöl',22),('Kokosöl',8),('Vitamin E',0.5)])],ANH)
rez('Vegane Pflegestange Candelilla','Körperpflege, vegan, fest',60,'',[('B',[('Candelillawachs',7),('Mangobutter raffiniert',18),('Sonnenblumenöl',22),('Kokosöl',12),('Tocopherol',0.5)])],ANH)
rez('Handcreme Olivem','Handpflege, Creme',100,'5,0 – 5,5',[('A',[(W,66.5),('Glycerin',3),('D-Panthenol',1),('Xanthan',0.3)]),('B',[('Olivem 1000 MB',5),('Mandelöl',12),('Shea Butter Bio',6),('Cetearylalkohol',1.5)]),('C',[('Phenoxyethanol + Ethylhexylglycerin',1),('Vitamin E',0.5)]),('D',[('Milchsäure 80%ig',0.2)])],emu(0),'mittel','45 min')
rez('Gesichtscreme leicht Montanov','Gesichtspflege, leichte Emulsion',100,'5,0',[('A',[(W,60),('Rosenwasser DAB',14),('Glycerin',3),('Sodium PCA',1),('Natriumlaktat 60%ig',1.5)]),('B',[('Montanov 68',4),('Jojobaöl BIO kalt gepresst',5),('Squalan',3),('Dicaprylylcarbonat',4),('Cetearylalkohol',1)]),('C',[('Geogard ECT',1),('Vitamin E',0.5),('Alpha-Bisabolol',0.3)]),('D',[('Zitronensäure',0.1)])],emu(0),'mittel','45 min')
rez('Nachtcreme reichhaltig','Gesichtspflege, reichhaltige Emulsion',100,'5,0 – 5,5',[('A',[(W,55),('Aloe-Vera-Wasser',12),('Glycerin',3),('Betain HT',1.5),('Inulin',1)]),('B',[('Polyglyceryl-3 Methylglucose Distearat',4),('Cetearylalkohol',2),('Mangobutter raffiniert',5),('Nachtkerzenöl BIO kalt gepresst',4),('Hagebuttenöl Rosa rubiginosa',3),('Jojobaöl BIO kalt gepresst',5)]),('C',[('Ectoin',0.5),('Magnesiumascorbylphosphat',1),('Rokonsal BSB-N',1),('Vitamin E',0.5)])],emu(0),'anspruchsvoll','60 min')
rez('Körperlotion fluid','Körperpflege, Lotion',200,'5,5',[('A',[(W,160),('Glycerin',6),('Xanthan',0.4),('Aloe-Vera-Wasser',10)]),('B',[('Softfeel GSC Palm oil free',6),('Cetearylalkohol',3),('Sonnenblumenöl',12),('Traubenkernöl',8)]),('C',[('Natriumbenzoat',1),('Kaliumsorbat',0.6),('Vitamin E',0.5)]),('D',[('Milchsäure 80%ig',0.5)])],emu(0),'mittel','45 min')
rez('Fußcreme Urea','Fußpflege, Emulsion',100,'5,0',[('A',[(W,58),('Harnstoff (Urea)',10),('Glycerin',3),('Natriumlaktat 60%ig',2)]),('B',[('Montanov L',4),('Avocadoöl',8),('Shea Butter Bio',6),('Bienenwachs',1.5)]),('C',[('Geogard ECT',1),('Pfefferminze Aroma',0.5)])],emu(0),'mittel','45 min')
rez('Gesichtsöl Hagebutte-Argan','Gesichtspflege, Öl-Serum',30,'',[('B',[('Arganöl kaltgepresst BIO',10),('Jojobaöl BIO kalt gepresst',8),('Hagebuttenöl Rosa rubiginosa',6),('Wiesenschaumblumenöl',4),('Granatapfelkernöl CO2 Extrakt BIO',1),('Vitamin E',0.5)])],['Alle Öle in einem sauberen Gefäß mischen.','In eine dunkle Flasche abfüllen.'],'einfach','10 min')
rez('Hyaluron-Gel Serum','Gesichtspflege, Gel',100,'5,0',[('A',[(W,60),('Aloe-Vera-Wasser',25),('Glycerin',4),('Xanthan transparent',0.5),('Hyaluronsäure',0.3),('Betain HT',2)]),('C',[('D-Panthenol',1.5),('Natriumlaktat 60%ig',1),('Phenoxyethanol + Ethylhexylglycerin',1),('Phytosphingosin',0.2)])],['Xanthan in Glycerin anrühren und in das Wasser einrühren, quellen lassen.','Übrige Zutaten einrühren und abfüllen.'],'einfach','20 min')
rez('Gesichtswasser Rose-Hamamelis','Gesichtspflege, Tonic',100,'5,0',[('A',[('Rosenwasser DAB',70),('Hamameliswasser',22),('Glycerin',2),('Betain HT',1),('D-Panthenol',0.5)]),('C',[('Softfeel 1388 eco',1)]),('D',[('Milchsäure 80%ig',0.1)])],['Alle Zutaten mischen.','pH prüfen und in eine Sprühflasche füllen.'],'einfach','10 min')
rez('Tonmaske Rose','Gesichtsmaske, Pulver',50,'',[('',[('Weiß Tonerde (Kaolin)',25),('Grüne Tonerde',15),('Rosenpulver',5),('Reismehl',5)])],PUL,'einfach','10 min')
rez('Joghurtmaske Pulver','Gesichtsmaske, Pulver',50,'',[('',[('Joghurtpulver',20),('Weiß Tonerde (Kaolin)',20),('Rosenpulver',3),('Inulin',7)])],PUL,'einfach','10 min')
rez('Badekugeln Zitrus','Badezusatz, Pulver',200,'',[('',[('Natron',80),('Zitronensäure',40),('Maisstärke',30),('Epsomsalz',30),('Mandelöl',10),('Kakaobutter Bio',10)])],['Pulver mischen.','Geschmolzene Butter und Öl untermischen, in Formen pressen.','Trocknen lassen.'],'mittel','40 min')
rez('Badesalz Lavendel','Badezusatz, Pulver',200,'',[('',[('Epsomsalz',100),('Salz Meer',80),('Natron',10),('Lavendelblüten',6),('Mandelöl',4)])],PUL,'einfach','10 min')
rez('Zuckerpeeling Mandel','Körperpflege, Peeling',200,'',[('',[('Zuckerkristalle',100),('Mandelöl',50),('Kokosöl',40),('Vitamin E',1),('Orangenschale getrocknet',5)])],['Kokosöl schmelzen, mit Mandelöl mischen.','Zucker und Orangenschale unterrühren, in ein Glas füllen.'],'einfach','10 min')
rez('Lippenpeeling Honig','Lippenpflege, Peeling',30,'',[('',[('Zuckerkristalle',12),('Mandelöl',8),('Bienenwachs',2),('Honig',5),('Vitamin E',0.3)])],['Wachs im Öl schmelzen, abkühlen lassen.','Honig und Zucker unterrühren.'],'einfach','15 min')
rez('Deocreme Natron','Körperpflege, Creme',100,'',[('B',[('Kokosöl',30),('Shea Butter Bio',20),('Pfeilwurzelstärke',20),('Weiß Tonerde (Kaolin)',10),('Natron',8),('Rosmarinextrakt (Antioxidans)',0.5),('Vitamin E',0.5)])],['Öl und Butter schmelzen, abkühlen lassen.','Pulver einrühren, bis die Masse cremig ist.'],'einfach','20 min')
rez('Deostick fest','Körperpflege, Stift',100,'',[('B',[('Kokosöl',30),('Shea Butter Bio',15),('Candelillawachs',10),('Pfeilwurzelstärke',20),('Natron',10),('Vitamin E',1)])],ANH,'mittel','30 min')
rez('Haarspülung Cetyl-BTMS','Haarpflege, Spülung',100,'4,0 – 4,5',[('A',[(W,80),('Glycerin',2),('D-Panthenol',1),('Hydrolysiertes Erbsenprotein',1)]),('B',[('BTMS 50',4),('Cetearylalkohol',2),('Arganöl kaltgepresst BIO',2)]),('C',[('Phenoxyethanol + Ethylhexylglycerin',1)]),('D',[('Zitronensäure',0.2)])],emu(0),'mittel','40 min')
rez('Haarmaske reichhaltig','Haarpflege, Kur',100,'4,0 – 4,5',[('A',[(W,76),('Glycerin',2),('D-Panthenol',2),('Seidenprotein',1)]),('B',[('BTMS Pellets',5),('Stearylalkohol',3),('Shea Butter Bio',3),('Avocadoöl',4)]),('C',[('Rokonsal BSB-N',1)]),('D',[('Milchsäure 80%ig',0.3)])],emu(0),'mittel','45 min')
rez('Haaröl Buriti-Jojoba','Haarpflege, Öl',50,'',[('B',[('Jojobaöl BIO kalt gepresst',20),('Mandelöl',15),('Rizinusöl',8),('Buritiöl',5),('Vitamin E',0.5)])],['Alle Öle mischen.','In eine Flasche füllen.'],'einfach','10 min')
rez('Shampoo mild Glucosid','Haarreinigung',200,'5,0 – 5,5',[('A',[(W,140),('Xanthan',1),('Glycerin',4)]),('B',[('Kokosglucosid',30),('Kokosbetain',16)]),('C',[('D-Panthenol',2),('Natriumbenzoat',1),('Kaliumsorbat',0.6)]),('D',[('Zitronensäure',0.4)])],TEN,'einfach','25 min')
rez('Duschgel Glucosid-Betain','Körperreinigung',200,'5,0 – 5,5',[('A',[(W,145),('Glycerin',6),('Xanthan',1.6),('Aloe-Vera-Wasser',10)]),('B',[('Kokosglucosid',24),('Kokosbetain',14)]),('C',[('D-Panthenol',1),('Rokonsal BSB-N',2)]),('D',[('Zitronensäure',0.3)])],TEN,'einfach','25 min')
rez('Körperöl trocken','Körperpflege, Öl',100,'',[('B',[('Dicaprylylcarbonat',30),('Mandelöl',30),('Traubenkernöl',20),('Wiesenschaumblumenöl',15),('Crambeöl',4),('Vitamin E',1)])],['Alle Öle mischen und abfüllen.'],'einfach','10 min')
rez('Reinigungsöl emulgierend','Gesichtsreinigung, Öl',100,'',[('B',[('Traubenkernöl',45),('Jojobaöl BIO kalt gepresst',25),('Polyglyceryl-10 Oleat',15),('Squalan',10),('Vitamin E',1)])],['Öle und Emulgator mischen, bis die Mischung klar ist.','In eine Pumpflasche füllen.'],'einfach','10 min')

stock=[];seen={}
def pack(c,kind):
    k=c['k'];n=c['n']
    if k=='Pflanzenöl': return 100,.92
    if k=='Ätherisches Öl': return 10,.9
    if k=='Hydrolat & Wasser': return 100,1.0
    if k=='Tensid': return (250,1.05) if kind=='v' else (250,0)
    if k=='Ton & Mineral': return 250,0
    if k=='Butter & Wachs': return 100,0
    if k=='Kräuter & Blüten': return 100,0
    if k in('Konservierung',): return (50,1.05) if kind=='v' else (50,0)
    if k in('Emulgator',): return 100,0
    if k=='Säure/pH': return 100,0
    if k=='Gelbildner': return 50,0
    if k=='Duft/Aroma': return 10,.9
    if k=='Wirkstoff': return (50,1.05) if kind=='v' else (50,0)
    if n in('Zuckerkristalle','Salz Meer','Epsomsalz'): return 1000,0
    return 100,0
SPEC={'Glycerin':(250,1.26),'Zuckerkristalle':(1000,0),'Salz Meer':(1000,0),'Epsomsalz':(1000,0),'Natron':(500,0),'Maisstärke':(250,0),'Kokosöl':(200,.92),'Mandelöl':(250,.92),'Sonnenblumenöl':(250,.92),'Traubenkernöl':(250,.92),'Zitronensäure':(100,0),'Aloe-Vera-Wasser':(250,1.0),'Rosenwasser DAB':(250,1.0),'Hamameliswasser':(250,1.0),'Honig':(250,1.4),'Joghurtpulver':(100,0),'Reismehl':(250,0),'Orangenschale getrocknet':(50,0),'Lavendelblüten':(50,0),'Pfeilwurzelstärke':(100,0),'Mangobutter raffiniert':(100,0),'Shea Butter Bio':(250,0),'Dicaprylylcarbonat':(100,.9),'Rizinusöl':(100,.96)}
used=[]
for r in R:
    for t,zs in r['phasen']:
        for n,g in zs:
            if n==W: continue
            f=F(n)
            if f not in byn: sys.exit('FEHLT im Katalog: '+n)
            c=byn[f]
            if c['id'] not in seen:
                seen[c['id']]=1; kind='v' if c['u']=='ml' else 'w'
                p,d=SPEC.get(n) or pack(c,kind)
                if kind=='v' and not d: d=1.0
                stock.append(dict(cid=c['id'],total=p,kind=kind,dens=d,pack=p))
mx={}
for r in R:
    tot=sum(g for t,zs in r['phasen'] for n,g in zs)
    for t,zs in r['phasen']:
        for n,g in zs:
            if n!=W: mx[F(n)]=max(mx.get(F(n),0),g)
for s in stock:
    c=next(x for x in cat if x['id']==s['cid']); need=mx[F(c['n'])]
    g=need*(s['dens'] or 1) if s['kind']=='v' else need
    if s['total']*(s['dens'] if s['kind']=='v' and s['dens'] else 1)<g*1.3: sys.exit('zu wenig '+c['n'])
def mkrez(r,i):
    ph=[]
    sm=sum(g for t,zs in r['phasen'] for n,g in zs);k=1
    for t,zs in r['phasen']:
        nm={'A':'Phase A · Wasserphase','B':'Phase B · Fett-/Ölphase','C':'Phase C · Wärmeempfindliche Phase','D':'Phase D · pH-Einstellung','':'Pulvermischung' if not any(x[0]=='B' for x in r['phasen']) else 'Zutaten'}[t]
        ph.append(dict(typ=t,name=nm,z=[dict(cid=byn[F(n)]['id'] if n!=W else '',name=n if n==W else '',g=round(g*k,2)) for n,g in zs]))
    return dict(key='T%02d'%(i+1),name=r['name'],zweck=r['zweck'],ph=r['ph'],ergibt=round(sm),zeit=r['zeit'],grad=r['grad'],phasen=ph,mod=[dict(t='schritt',titel='Herstellung',text=' '.join('%d. %s'%(k+1,s) for k,s in enumerate(r['steps'])))])
D=dict(rez=[mkrez(r,i) for i,r in enumerate(R)],stock=stock)
open(H+'/src/proto/testdaten.js','w',encoding='utf-8').write('const DEMO='+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(R),'Rezepte',len(stock),'Lagerartikel')
