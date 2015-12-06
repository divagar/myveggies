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
    //check cache
    caches.match(event.request).then(function(response) {

        // check the json response from n/w first and fallback to cache
        var url = String(event.request.url);
        var fetchRequest = event.request.clone();
        if (url.indexOf("json") >= 0) {
          return fetch(fetchRequest).then(function(networkResponse) {
            cacheResponse(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function(){
            return response;
          });
        }
        // Return from cache
        if (response) {
          return response;
        }

        // Cache new responses
        return fetch(fetchRequest).then(function(response) {
            //cache dynamic request
            if (url.indexOf("json") >= 0 || url.indexOf("fonts") >=0 ||
                  url.indexOf("twitter") >=0  ) {
                cacheResponse(event.request, response.clone());
                return response;
            }

            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            cacheResponse(event.request, response.clone());
            return response;
        });
      })
    );
});

function cacheResponse(request, response) {
  caches.open(CACHE_NAME).then(function(cache) {
    cache.put(request, response);
  });
}

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
