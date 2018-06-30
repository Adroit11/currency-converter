importScripts('/assets/js/idb.js');

const appName = 'currency-converter'     
const version = 'v1'            
const cacheName = appName + version

// Cache resources
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('installing cache app shell : ' + cacheName)
      return cache.addAll([
          '/currency-converter/',
          '/currency-converter/index.html',
          '/currency-converter/assets/css/style.css',
          '/currency-converter/assets/js/app.js',
          '/currency-converter/assets/js/idb.js',
          '/currency-converter/assets/img/currency.jpeg',
          'https://free.currencyconverterapi.com/api/v5/currencies'
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

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cacheResponse) {
      return cacheResponse || fetch(event.request);
    })
  );
});
