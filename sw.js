self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("sw-cache").then(function(cache) {
            const urls = ["index.html", "mapping.js", "about.html", "stylesheet.css", "/libraries", "/images"]
            return cache.addAll(urls)
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.resoindWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
