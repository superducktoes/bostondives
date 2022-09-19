self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open("sw-cache").then(function (cache) {
            const urls = [
                "index.html",
                "about.html",
                "locations.json",
                "manifest.json",
                "mapping.js",
                "robots.txt",
                "stats.html",
                "stats.js",
                "stylesheet.css",
                "sw.js",
                "./libraries/leaflet-messagebox.css",
                "./libraries/leaflet-messagebox.js",
                "./images/beer-svgrepo-com.svg",
                "./images/closest.png",
                "./images/directions.png",
                "./images/drankhere.png",
                "./images/food.png",
                "./images/icons8-beeer-64.png",
                "./images/icons8-twitter-circled-50.png",
                "./images/insta.svg",
                "./images/notes.png",
                "./images/query_bars.png"
            ]
            return cache.addAll(urls)
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.resoindWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
