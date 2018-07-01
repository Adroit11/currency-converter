const staticCache = 'static-v17';
const dynamicCache = 'dynamic-v2';

  const StaticFileToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/app.js',
  '/assets/js/idb.js',
  '/assets/img/currency.jpeg',
  'https://free.currencyconverterapi.com/api/v5/currencies'
  ];
  
  // cache assets
  self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(staticCache)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(StaticFileToCache);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== staticCache && key !== dynamicCache) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});
//fetch cache 
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
      .then(cache => {
        cache.put(event.request, response.clone());
        return response;
      })).catch(event => {
      //console.log('Service Worker error caching and fetching');
    }))
  );
});