const appName = 'currency-converter'     
const version = 'v1'            
const cacheName = appName + version

// Cache resources
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('installing cache app shell : ' + cacheName)
      return cache.addAll([
          '/',
          '/index.html',
          '/assets/css/style.css',
          '/assets/js/app.js',
          '/assets/img/currency.jpeg'
        ])
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('deleting cache : ' + key);
          return caches.delete(key);
        }
      }))
    })
  )
})

self.addEventListener('fetch', event => {
  const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

  // If contacting API, fetch and then cache the new data
  if (event.request.url.indexOf(url) === 0) {
    event.respondWith(
      fetch(event.request).then(response =>
        caches.open(cacheName).then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        }),
      ),
    );
  } else {
    // Respond with cached content if they are matched
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request)),
    );
  }
});