/* ---------- Rezept teilen: echtes PDF (eigener, kleiner PDF-Schreiber) ---------- */
const PDFX={A:[0.31,0.43,0.35],G:[0.42,0.42,0.42],K:[0.1,0.1,0.1],L:[0.82,0.84,0.82]};
const CP1252={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159,8239:32,160:32,8201:32,8202:32};
function pdfHex(s){let h='';for(const ch of String(s)){let c=ch.codePointAt(0);if(c>255||(c>=128&&c<160))c=CP1252[c]||63;else if(c<32)c=32;h+=(c<16?'0':'')+c.toString(16)}return '<'+h+'>'}
let PDFCTX=null;
function pdfW(s,sz,b){if(!PDFCTX)PDFCTX=document.createElement('canvas').getContext('2d');PDFCTX.font=(b?'bold ':'')+'100px Arial, Helvetica, "Liberation Sans", sans-serif';return PDFCTX.measureText(String(s)).width*sz/100}
function pdfWrap(s,w,sz,b){const out=[];String(s==null?'':s).split(/\r?\n/).forEach(par=>{if(!par.trim()){out.push('');return}let line='';par.split(/\s+/).filter(Boolean).forEach(word=>{const t=line?line+' '+word:word;if(pdfW(t,sz,b)<=w||!line)line=t;else{out.push(line);line=word}
while(pdfW(line,sz,b)>w&&line.length>1){let k=line.length-1;while(k>1&&pdfW(line.slice(0,k),sz,b)>w)k--;out.push(line.slice(0,k));line=line.slice(k)}});out.push(line)});return out}
function pdfJpeg(url){const m=/^data:image\/jpe?g;base64,(.+)$/.exec(url||'');if(!m)return null;const bin=atob(m[1]);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
let i=2;while(i<u.length){if(u[i]!==0xFF){i++;continue}const mk=u[i+1];if(mk>=0xC0&&mk<=0xC3){return {data:u,h:u[i+5]*256+u[i+6],w:u[i+7]*256+u[i+8],n:u[i+9]}}const len=u[i+2]*256+u[i+3];i+=2+len}return null}
function pdfBuild(pages,imgs){const enc=new TextEncoder();const parts=[];let off=0;const offs=[];const add=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);off+=b.length};
const nI=imgs.length;const firstImg=5;const firstPage=firstImg+nI;const N=pages.length;
const obj=(n,body)=>{offs[n]=off;add(n+' 0 obj\n'+body+'\nendobj\n')};
add('%PDF-1.4\n%âãÏÓ\n');offs.length=0;
obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
obj(2,'<< /Type /Pages /Kids ['+pages.map((_,k)=>(firstPage+k*2)+' 0 R').join(' ')+'] /Count '+N+' >>');
obj(3,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
obj(4,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
imgs.forEach((im,k)=>{offs[firstImg+k]=off;add((firstImg+k)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+im.w+' /Height '+im.h+' /ColorSpace /'+(im.n===1?'DeviceGray':'DeviceRGB')+' /BitsPerComponent 8 /Filter /DCTDecode /Length '+im.data.length+' >>\nstream\n');add(im.data);add('\nendstream\nendobj\n')});
const xo=imgs.map((_,k)=>'/Im'+k+' '+(firstImg+k)+' 0 R').join(' ');
pages.forEach((c,k)=>{const pn=firstPage+k*2;obj(pn,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>'+(xo?' /XObject << '+xo+' >>':'')+' >> /Contents '+(pn+1)+' 0 R >>');
offs[pn+1]=off;add((pn+1)+' 0 obj\n<< /Length '+c.length+' >>\nstream\n'+c+'\nendstream\nendobj\n')});
const total=firstPage+N*2;const xr=off;let x='xref\n0 '+total+'\n0000000000 65535 f \n';for(let n=1;n<total;n++)x+=String(offs[n]).padStart(10,'0')+' 00000 n \n';
add(x+'trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF');return new Blob(parts,{type:'application/pdf'})}
const TT=s=>{try{return typeof trStr==='function'?trStr(s):s}catch(e){return s}};
function rzPdf(id,vn,o){o=Object.assign({foto:1,eck:1,ablauf:1,inci:1},o||{});const r=rzGet(id);const v=rzVer(r,vn||rzCurV(r).n);const d=v.d;const sum=rzSum(d)||1;
const M=54,CW=487,TOP=54,BOT=788;const pages=[];const imgs=[];let c='',y=TOP;
const col=a=>a.join(' ');
const T=(x,yy,s,sz,b,cl,al)=>{if(s===''||s==null)return;let xx=x;if(al==='r')xx=x-pdfW(s,sz,b);c+='BT /'+(b?'F2':'F1')+' '+sz+' Tf '+col(cl||PDFX.K)+' rg '+xx.toFixed(2)+' '+(842-yy).toFixed(2)+' Td '+pdfHex(s)+' Tj ET\n'};
const LN=(x1,yy,x2,cl,w)=>{c+=col(cl||PDFX.L)+' RG '+(w||0.5)+' w '+x1+' '+(842-yy)+' m '+x2+' '+(842-yy)+' l S\n'};
const newPage=()=>{if(c)pages.push(c);c='';y=TOP};
const need=h=>{if(y+h>BOT)newPage()};
const para=(s,sz,b,cl,x,w,lh)=>{x=x==null?M:x;w=w||CW;lh=lh||sz*1.45;pdfWrap(s,w,sz,b).forEach(l=>{need(lh);T(x,y+sz,l,sz,b,cl);y+=lh})};
const head=s=>{need(40);y+=14;T(M,y+9,s.toUpperCase().split('').join(String.fromCharCode(8201)),8.5,true,PDFX.A);y+=15;LN(M,y,M+CW,PDFX.A,0.8);y+=10};
// Foto als Banner
if(o.foto&&r.photo){const im=pdfJpeg(r.photo);if(im){imgs.push(im);const k=imgs.length-1;const bh=165;const sc=Math.max(CW/im.w,bh/im.h);const dw=im.w*sc,dh=im.h*sc;const px=M+(CW-dw)/2,py=842-(y+bh)+(bh-dh)/2;
c+='q '+M+' '+(842-y-bh)+' '+CW+' '+bh+' re W n '+dw.toFixed(2)+' 0 0 '+dh.toFixed(2)+' '+px.toFixed(2)+' '+py.toFixed(2)+' cm /Im'+k+' Do Q\n';y+=bh+22}}
// Titel
pdfWrap(d.name||'Rezept',CW,26,true).forEach(l=>{need(32);T(M,y+24,l,26,true,PDFX.K);y+=31});
T(M,y+11,TT('Version')+' '+v.n+'  ·  '+dde(v.date.slice(0,10)),9.5,false,PDFX.G);y+=18;LN(M,y,M+CW,PDFX.A,1.2);y+=4;
// Eckdaten
if(o.eck){const cells=[[TT('Einsatzzweck'),d.zweck],[TT('Ergibt'),d.ergibt],[TT('Zeitaufwand'),d.zeit&&rzZeit(d.zeit)],[TT('Schwierigkeit'),d.grad],[TT('Ziel-pH'),d.ph],[TT('Gesamtmenge'),nf(sum,2)+' g']].filter(a=>a[1]);
for(let i=0;i<cells.length;i+=3){const row=cells.slice(i,i+3);const cw=CW/3;const ls=row.map(a=>pdfWrap(a[1],cw-12,11,true));const h=14+Math.max(...ls.map(l=>l.length))*14+8;need(h);y+=8;
row.forEach((a,k)=>{const x=M+k*cw;T(x,y+8,a[0].toUpperCase(),7.5,false,PDFX.G);ls[k].forEach((l,j)=>T(x,y+23+j*14,l,11,true,PDFX.K))});y+=h-8}}
// Zutaten
head(TT('Zutaten'));
d.phasen.forEach(p=>{const showName=p.typ||d.phasen.length>1;if(showName){need(40);y+=6;T(M,y+11,TT(p.name),11,true,PDFX.K);y+=18}
p.z.forEach(z=>{need(18);T(M+2,y+12,rzName(z),10.5,false,PDFX.K);T(M+CW-62,y+12,nf(z.g,2)+' g',10.5,false,PDFX.K,'r');T(M+CW,y+12,nf(z.g/sum*100,1)+' %',9,false,PDFX.G,'r');y+=18;LN(M,y,M+CW)})});
need(24);y+=6;T(M+2,y+12,TT('Summe'),10.5,true,PDFX.K);T(M+CW-62,y+12,nf(sum,2)+' g',10.5,true,PDFX.K,'r');y+=20;
// Ablauf und Hinweise
if(o.ablauf&&d.mod.length){const steps=d.mod.filter(m=>m.t==='schritt'),notes=d.mod.filter(m=>m.t!=='schritt');
if(steps.length){head(TT('Zubereitung'));steps.forEach((m,n)=>{const ls=pdfWrap([m.titel,m.text].filter(Boolean).join('\n'),CW-26,10.5,false);need(Math.min(ls.length,3)*15+10);y+=3;T(M+2,y+13,(n+1)+'.',10.5,true,PDFX.A);
let first=true;ls.forEach(l=>{need(15);T(M+26,y+13,l,10.5,first&&!!m.titel,PDFX.K);first=false;y+=15});y+=5})}
if(notes.length){head(TT('Hinweise'));notes.forEach(m=>{const lab=RZMT[m.t]?TT(RZMT[m.t][0]):'';const ls=pdfWrap(m.text||'',CW-12,10.5,false);need(34);y+=3;T(M+2,y+10,((m.titel&&m.titel!==lab)?m.titel+' · ':'')+lab,9,true,PDFX.A);y+=15;ls.forEach(l=>{need(15);T(M+2,y+12,l,10.5,false,PDFX.K);y+=15});y+=6})}}
// INCI
if(o.inci){const inci=rzInci(d).text;if(inci){head(TT('INCI-Deklaration (Entwurf)'));para(inci,9.5,false,PDFX.G,M+2,CW-4,14)}}
if(c)pages.push(c);
// Fußzeile
const N=pages.length;const ft=pages.map((p,k)=>{c='';LN(M,806,M+CW);T(M,822,'INCIheinz  ·  '+TT('privates Rezeptbuch'),8,false,PDFX.G);T(M+CW,822,TT('Seite')+' '+(k+1)+' / '+N,8,false,PDFX.G,'r');return p+c});
return pdfBuild(ft,imgs)}
let RZS=null;
function rzShareName(n){const a=String(n||'Rezept').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/Ä/g,'Ae').replace(/Ö/g,'Oe').replace(/Ü/g,'Ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');return (a||'Rezept')+'.pdf'}
function sheetRzShare(id){const all=rzAll();if(!all.length){sheetMsg('Noch keine Rezepte','Lege zuerst ein Rezept an, dann kannst du es hier teilen.');return}
if(id)RZS={id,fixed:1,o:{foto:1,eck:1,ablauf:1,inci:0}};else{RZS={id:(RZS&&rzGet(RZS.id)?RZS.id:(all.filter(r=>!r.demo)[0]||all[0]).id),o:(RZS&&RZS.o)||{foto:1,eck:1,ablauf:1,inci:0}}}
const L=all.slice().sort((a,b)=>FOLD(rzCurV(a).d.name)<FOLD(rzCurV(b).d.name)?-1:1);const opts=[['foto','Foto'],['eck','Eckdaten'],['ablauf','Ablauf und Hinweise'],['inci','INCI-Entwurf']];
openSheet(`<h2>Rezept teilen</h2><div class="s">Dein Rezept als gestaltetes PDF, zum Zeigen oder Verschicken, zum Beispiel per Messenger oder E-Mail.</div>
${RZS.fixed?`<div style="margin-top:14px;font-weight:600" class="nm">${esc(rzCurV(rzGet(RZS.id)).d.name)}</div>`:`<div class="cap" style="margin:14px 0 2px">Welches Rezept?</div><div style="max-height:30vh;overflow:auto">${L.map(r=>{const v=rzCurV(r);return `<label class="chk" style="padding:8px 0;border-bottom:1px solid var(--line);margin:0;align-items:flex-start"><input type="radio" name="rzsr" ${RZS.id===r.id?'checked':''} onchange="RZS.id='${r.id}'"> <span><span class="nm">${esc(v.d.name)}</span>${r.demo?' <span class="s">Testrezept</span>':''}<br><span class="s">Version ${v.n}${r.photo?' · Foto':''}</span></span></label>`}).join('')}</div>`}
<div class="cap" style="margin:14px 0 6px">Das soll enthalten sein</div><div class="tb" style="gap:8px;flex-wrap:wrap">${opts.map(x=>`<button type="button" class="pill ${RZS.o[x[0]]?'on':''}" style="width:auto;height:auto" onclick="RZS.o['${x[0]}']=RZS.o['${x[0]}']?0:1;this.classList.toggle('on')">${x[1]}</button>`).join('')}</div>
<div class="btns"><button class="btn" onclick="rzShareGo()">Als PDF teilen</button><button class="btn sec" onclick="rzShareGo(1)">Als Datei speichern</button><button class="btn sec" onclick="sheetBack()">Zurück</button></div>`)}
function rzShareGo(dl){const r=RZS&&rzGet(RZS.id);if(!r){toast('Bitte ein Rezept wählen');return}
let blob;try{blob=rzPdf(r.id,rzCurV(r).n,RZS.o)}catch(e){console.error(e);toast('PDF konnte nicht erstellt werden');return}
const nm=rzShareName(rzCurV(r).d.name);SHARE22=dl?0:1;try{dlBlob(nm,blob)}finally{SHARE22=0}closeSheet();toast(dl?'PDF gespeichert':'PDF erstellt')}
