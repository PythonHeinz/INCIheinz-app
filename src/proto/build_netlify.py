import re,subprocess,os
subprocess.check_call(['python3','patch6.py']);subprocess.check_call(['python3','patch4.py'],stdout=subprocess.DEVNULL)
old=open('/mnt/user-data/outputs/proto/index.html',encoding='utf-8').read()
cat=re.search(r'const CAT=(\[.*?\]);\n',old,re.S).group(1)
import json as _jj
_mp='/home/claude/work/katalog_master.json'
if os.path.exists(_mp): cat=_jj.dumps(_jj.load(open(_mp,encoding='utf-8'))['items'],ensure_ascii=False,separators=(',',':'))
t=open('tpl6.html',encoding='utf-8').read().replace('__CAT__',cat,1)
open('/mnt/user-data/outputs/proto/index.html','w',encoding='utf-8').write(t)   # Artefakt-Vorschau
open('built.html','w',encoding='utf-8').write(t)
open('chk.js','w',encoding='utf-8').write(re.findall(r'<script>(.*?)</script>',t,re.S)[-1])
V='1.0'
head='''<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#2C5E3B">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="INCIheinz">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
'''
head+='''<style>html.nlb #app{height:calc(100% - 72px)}html.nlb body::after{content:"";position:fixed;left:0;right:0;bottom:0;height:72px;background:#2C5E3B;z-index:0}</style>
<script>if(/\\.netlify\\.app$/.test(location.hostname))document.documentElement.classList.add('nlb')</script>
'''
import time as _t
n=t.replace('</head>',head+'<meta name="inci-build" content="'+_t.strftime('%Y%m%d-%H%M%S')+'">'+'</head>',1)
n=n.replace('</body>',"<script>if('serviceWorker' in navigator&&location.protocol.startsWith('http')){window.addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}})}</script>\n</body>",1)
n=n.replace('Version 0.3 (Bedienkonzept)','Version %s (Web-App)'%V)
d='/mnt/user-data/outputs/netlify/'
open(d+'index.html','w',encoding='utf-8').write(n)
sw=open(d+'sw.js',encoding='utf-8').read()
sw=re.sub(r"const CACHE='[^']*'","const CACHE='inciheinz-v%s'"%V,sw)
open(d+'sw.js','w',encoding='utf-8').write(sw)

sw=sw.replace("if(e.request.method!=='GET')return;","if(e.request.method!=='GET'||e.request.url.indexOf('katalog.json')>=0)return;")
SW2="""const CACHE='inciheinz-v%s';
const OCRC='inciheinz-ocr';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&x!==OCRC).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||e.request.url.indexOf('katalog.json')>=0)return;
  if(e.request.url.indexOf('/ocr/')>=0){
    e.respondWith(caches.open(OCRC).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
""" % V
open(d+'sw.js','w',encoding='utf-8').write(SW2)
try:
    import json as _j
    _c=_j.loads(cat)
    import os,shutil
    if os.path.exists('/home/claude/work/katalog_master.json'):
        shutil.copy('/home/claude/work/katalog_master.json',d+'katalog.json')
    else:
        open(d+'katalog.json','w',encoding='utf-8').write(_j.dumps({'version':'0.3','items':_c},ensure_ascii=False,separators=(',',':')))
    print('katalog.json',len(_c))
except Exception as ex:
    print('katalog.json FAILED',ex)
