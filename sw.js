const CACHE='inciheinz-v1.0';
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
