const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
    "/", // Root

    // HTML files
    "/index.html",
    "/about.html",
    "/contact.html",
    "/portfolio.html",
    "/service.html",

    // CSS files
    "/bootstrap.css",
    "/font-awesome.min.css",
    "/responsive.css",
    "/style.css",
    "/style.css.map",
    "/style.scss",

    // JS files
    "/js/app.js",

    // WebP Images
    "/images/about-img.webp",
    "/images/client.webp",
    "/images/hero-bg.webp",
    "/images/p1.webp",
    "/images/p2.webp",
    "/images/p3.webp",
    "/images/s1.webp",
    "/images/s2.webp",
    "/images/s3.webp",
    "/images/s4.webp",
    "/images/s5.webp",
    "/images/s6.webp",
    "/images/slider-bg.webp",

    // Fonts
    "/fonts/fontawesome-webfont.ttf",
    "/fonts/fontawesome-webfont.woff",
    "/fonts/fontawesome-webfont.woff2"
];

// Install event: Caches the assets
self.addEventListener("install", (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: All assets cached');
                return self.skipWaiting(); // Force activation
            })
            .catch((error) => {
                console.error('Service Worker: Caching failed', error);
            })
    );
});

// Fetch event: Serve cached or fetch from network
self.addEventListener("fetch", (event) => {
    if (event.request.method !== 'GET') return;

    const requestURL = new URL(event.request.url);

    // Ignore non-HTTP(s) requests like chrome-extension://
    if (!requestURL.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }

                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type !== 'basic'
                        ) {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        // Optional: Offline fallback
                    });
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});
