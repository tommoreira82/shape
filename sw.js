const CACHE='shape-v3-20261025';
const FILES=['./index.html','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('shape-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,url=new URL(r.url);if(r.method!=='GET'||url.origin!==self.location.origin)return;
if(r.mode==='navigate'||url.pathname.endsWith('/index.html')){e.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return response}).catch(()=>caches.match(r).then(hit=>hit||caches.match('./index.html'))));return;}
e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return response})))
});