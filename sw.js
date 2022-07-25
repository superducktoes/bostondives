self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("sw-cache").then(function(cache) {
            return cache.add("index.html");
        })
    );
});

self.addEventListener("fetch", function(e) {
    e.resoindWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});
