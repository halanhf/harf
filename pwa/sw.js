// offline support for the installed app. the page is fetched network-first so a new version shows up on the next open;
// fonts and icons are cache-first because they never change under the same name
const CACHE="harf-v__BUILD__";
const SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png","./icons/favicon-32.png",
  "./fonts/amiri-arabic-400-normal.woff2","./fonts/amiri-arabic-700-normal.woff2","./fonts/readex-pro-latin-400-normal.woff2","./fonts/readex-pro-latin-500-normal.woff2","./fonts/readex-pro-latin-600-normal.woff2","./fonts/readex-pro-latin-ext-400-normal.woff2"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("harf-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url); if(u.origin!==location.origin) return; // never cache anything from other sites
  if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){
    e.respondWith(fetch(r).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put("./index.html",copy)); } return res; })
      .catch(()=>caches.match("./index.html").then(m=>m||caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok&&/\/(fonts|icons)\//.test(u.pathname)){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(r,copy)); } return res; })));
});
