self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("sw-cache").then(function(cache) {
            const urls = ["./index.html"]
            return cache.add("./index.html")
        })
    );
});

self.addEventListener("fetch", functoin(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
