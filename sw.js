/* Solo recursos del juego. Los vídeos del tráiler no se precargan. */
const CACHE='magdaleno-mobile-0.10.1';
const FILES=['./','./index.html','./styles.css','./mobile.css','./campaign.css','./story.css','./src/story-data.js','./src/story.js','./src/campaign.js','./manifest.webmanifest','./src/data.js','./assets/bounds.js','./src/core.js','./src/render.js','./src/enemies.js','./src/visuals.js','./src/powers.js','./src/melee.js','./src/game.js','./src/chapter.js','./src/soundtrack.js','./src/mobile.js','./assets/marcelo.png','./assets/ruzio.png','./assets/pulga.png','./assets/tobi.png','./assets/pallo.png','./assets/carabinero.webp','./assets/matahombres.webp','./assets/icon-192.png','./assets/icon-512.png','./movil.html','./etapa2.html','./etapa2.css','./src/runner-data.js','./src/runner-render.js','./src/runner.js','./assets/cote.png'];
FILES.push('./etapa4.html','./etapa4.css','./src/etapa4-data.js','./src/etapa4-draw.js','./src/etapa4.js');
FILES.push('./trailer.html','./etapa3.html','./etapa3.css','./src/scooter-data.js','./src/scooter-assists.js','./src/scooter-render.js','./src/scooter.js');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('magdaleno-mobile-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!FILES.some(file=>new URL(file,self.registration.scope).pathname===url.pathname))return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request,{ignoreSearch:true}).then(response=>response||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
