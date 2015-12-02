'use strict';

importScripts('scripts/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'myveggies-cache-v1';
var urlsToCache = [
  '/'
];

self.addEventListener('install', function(event) {
  console.log("SW install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("SW activate");
});

self.addEventListener('fetch', function(event) {
  console.log("SW fetch");
  event.respondWith(
    caches.match(event.request).then(function(response) {
        // Return from cache
        if (response) {
          // fetch latest copy of json from network
          if (String(event.request.url).indexOf("veggies.json") >= 0) {
              fetch(event.request).then(function(networkResponse) {
                caches.open(CACHE_NAME).then(function(cache) {
                  cache.put(event.request, networkResponse.clone());
                });
              });
          }
          return response;
        }

        // Cache new responses
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
        });
      })
    );
});

self.addEventListener('push', function(event) {  
  console.log('Received a push message', event);

  var title = 'Yay a message.';  
  var body = 'We have received a push message.';  
  var icon = '/images/icon-192x192.png';  
  var tag = 'myveggies-notification';

  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,  
      tag: tag  
    })  
  );  
});

self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
