//setting variable for caching
//then installing a service worker
// where we cache necessary data

const restaurant_cache = 'restaurant_cache-v1';
const urlsToCache = [
    '/',
    '/css/styles.css',
    '/js/',
    '/js/swregistration.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js',
    '/index.html',
    '/restaurant.html'
];

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(restaurant_cache)
            .then (function(cache){
                return cache.addAll(urlsToCache);
            })
    );
});

// listen to all fetch requests 
// try to find matching content from cache
// otherwise request it from the network
// at the same time save new stuff to cache as well

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
             } 
             
             const fetchRequest = event.request.clone();
             
             return fetch(fetchRequest)
             .then(function (response){
                 if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                 const responseToCache = response.clone();

                 caches.open(restaurant_cache)
                 .then(function(cache){
                        cache.put (event.request, responseToCache);
                    });

                return response;
             });
        })
    );
});

// if there's an updated service worker, let's delete old cache and use new version

self.addEventListener ('activate', function (event) {
    event.waitUntil (caches.keys()
    .then (function(cacheList){
        return Promise.all (
            cacheList.filter (function (cacheItem){
                return cacheItem.startsWith ('restaurant_') && cacheItem != restaurant_cache;
            }).map(function (cacheItem){
                return cache.delete(cacheItem);
            })
        );
    })
    );
});