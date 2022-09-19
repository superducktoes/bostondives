const staticBostonDivesAssets = "bostondives-bar"
const assets = [
    "index.html",
    "mapping.js",
    "about.html",
    "locations.json",
    "libraries/leaflet-messagebox.css",
    "libraries/leaflet-messagebox.js"
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