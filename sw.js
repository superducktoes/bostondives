const staticBostonDivesAssets = "bostondives-bar"
const assets = [
    "/",
    "index.html",
    "mapping.js",
    "about.html",
    "stylesheet.css",
    "sw.js",
    "stats.js",
    "stats.html",
    "manifest.json",
    "/libraries/leaflet-messagebox.css",
    "/libraries/leaflet-messagebox.js",
    "/images/beer_logo.svg",
    "/images/closest.png",
    "/images/directions.png",
    "/images/drankhere.png",
    "/images/food.png",
    "/images/icons8-beer-64.png",
    "/images/icons8-twitter-circled-50.png",
    "/images/insta.svg",
    "/images/notes.png",
    "/images/query_bars.png"
]

self.addEventListener("install", installEvent => {
    caches.delete(staticBostonDivesAssets);

    console.log(assets);

    installEvent.waitUntil(
        console.log(assets);
        caches.open(staticBostonDivesAssets).then(cache => {
            cache.addAll(assets)
        }).catch(console.log)
    )
    console.log(assets);
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        }).catch(console.log)
    )
})