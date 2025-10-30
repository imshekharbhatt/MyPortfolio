const CACHE_NAME = "shekhar-portfolio-v1.2";
const urlsToCache = [
  "/",
  "/index.html",
  "/portfolioassets/style.css",
  "/portfolioassets/main.js",
  "/portfolioassets/images/shekhar-profile-image.png",
  "/portfolioassets/documents/shekhar-bhatt-cv.pdf",
  "https://unicons.iconscout.com/release/v4.0.8/css/line.css",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
  "https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
