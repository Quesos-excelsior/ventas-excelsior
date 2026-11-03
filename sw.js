// Service worker: guarda la app para abrir rápido; los datos siempre se piden frescos.
const CACHE = 'ventas-excelsior-v1';
const APP = ['./', './index.html', './manifest.json', './logo.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('datos.enc.json')) { e.respondWith(fetch(e.request)); return; }   // datos: siempre de la red
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
                                  .catch(() => caches.match(e.request)));
});
