// Офлайн-кэш оболочки. Контент курса и личные данные лежат в localStorage,
// в кэш не попадают и наружу не уходят.
const V = "pitanie-v1";
const SHELL = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "assets/exercises/01-heel-to-toe-rocking.jpg",
  "assets/exercises/02-heel-drops.jpg",
  "assets/exercises/03-butterfly.jpg",
  "assets/exercises/04-japanese-vibration.jpg",
  "assets/exercises/05-knees-to-chest.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
