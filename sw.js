/* Clock In Page: keeps the app working with no signal.
   Bump CACHE when index.html changes so tablets pick the new page up. */
const CACHE = 'clock-in-page-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

/* Cache first, so a cold start with no signal still opens.
   Each hit also refreshes the cache in the background for the next visit. */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });

    /* cache: 'reload' skips the browser cache, so a new page is noticed
       straight away rather than after GitHub's ten minute cache expires */
    const fresh = fetch(request, { cache: 'reload' }).then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    }).catch(() => null);

    if (cached) return cached;

    const response = await fresh;
    if (response) return response;

    return (await cache.match('./index.html')) || Response.error();
  })());
});
