const CACHE_NAME       = "pharmacore-v1";
const OFFLINE_CACHE    = "pharmacore-offline-v1";
const FLASHCARD_CACHE  = "pharmacore-flashcards-v1";

const STATIC_ASSETS = ["/", "/manifest.json", "/offline.html"];
const OFFLINE_API_ROUTES = ["/api/flashcards", "/api/chapters"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![CACHE_NAME, OFFLINE_CACHE, FLASHCARD_CACHE].includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).then((response) => {
        if (OFFLINE_API_ROUTES.some((r) => url.pathname.startsWith(r))) {
          const clone = response.clone();
          caches.open(FLASHCARD_CACHE).then((c) => c.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  if (request.destination === "image" || request.destination === "font" || url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request) || caches.match("/offline.html")));
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Pharma Core", {
      body: data.body || "You have a new notification",
      icon: "/icons/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
