const staticBostonDivesAssets = "bostondives-bar"
const assets = [
    "/index.html",
    "/about.html",
    "/locations.json",
    "/manifest.json",
    "/mapping.js",
    "/robots.txt",
    "/stats.html",
    "/stats.js",
    "/stylesheet.css",
    "/sw.js",
    "/libraries/leaflet-messagebox.css",
    "/libraries/leaflet-messagebox.js",
    "/images/beer-svgrepo-com.svg",
    "/images/closest.png",
    "/images/directions.png",
    "/images/drankhere.png",
    "/images/food.png",
    "/images/icons8-beeer-64.png",
    "/images/icons8-twitter-circled-50.png",
    "/images/insta.svg",
    "/images/notes.png",
    "/images/query_bars.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticBostonDivesAssets).then(cache => {
            cache.addAll(assets)
        }).catch(console.log)
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        }).catch(console.log)
    )
})