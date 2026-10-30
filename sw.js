/* Solo recursos del juego. Los vídeos del tráiler no se precargan. */
const CACHE='magdaleno-mobile-0.4.0';
const FILES=['./','./index.html','./styles.css','./mobile.css','./manifest.webmanifest','./src/data.js','./assets/bounds.js','./src/core.js','./src/render.js','./src/visuals.js','./src/game.js','./src/chapter.js','./src/soundtrack.js','./src/mobile.js','./assets/marcelo.png','./assets/ruzio.png','./assets/pulga.png','./assets/tobi.png','./assets/pallo.png','./assets/carabinero.png','./assets/matahombres.png','./assets/icon-192.png','./assets/icon-512.png','./movil.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('magdaleno-mobile-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!FILES.some(file=>new URL(file,self.registration.scope).pathname===url.pathname))return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(response=>response||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
