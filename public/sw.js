const CACHE_NAME = 'mario-hacker-news-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/static/js/bundle.js',
  'sockjs-node/info',
  'sockjs-node/718/yzsjlzx4/websocket',
  'https://hacker-news.firebaseio.com/v0',
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache - public');
        return cache.addAll(urlsToCache);
      })
      .catch(function (err) {
        console.log('Error: ' + err);
      })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('fetch caught:', event.request);

  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
