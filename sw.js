/* PhotoBooth service worker: caches the app so it opens instantly and works offline. Bump V to ship an update. */
const V='photobooth-v32';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  if(r.mode==='navigate'){e.respondWith(caches.match('./index.html').then(hit=>{const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('./index.html',cp))}return res}).catch(()=>hit);return hit||net}));return}
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
    return hit||net;
  }));
});
