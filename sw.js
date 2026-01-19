const CACHE_NAME = 'topdeal-v1';
const urlsToCache = [
  '/offer/1/',
  '/offer/1/css/styles.min.css',
  '/offer/1/images/hero.png',
  '/offer/1/images/trusted-review.png',
  '/offer/1/images/google-rerview.png',
  '/offer/1/images/check.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.log('Cache addAll failed:', error);
          // Continue without caching if some resources fail
          return Promise.resolve();
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});