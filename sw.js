const CACHE = "sucheng-v25";
const ASSETS = ["./","index.html","css/app.css","css/wuse.css","js/app.js","js/a.js","js/b1.js","js/b2.js","js/data.js","js/slang.js","js/pools.js","js/s0.js","js/s1.js","js/s2.js","js/s3.js","js/s4.js","js/s5.js","manifest.json","icon.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
