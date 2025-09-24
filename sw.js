// T9 Digital Service Worker
// Version 1.0.0

const CACHE_NAME = 't9digital-v1.0.0';
const STATIC_CACHE_NAME = 't9digital-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 't9digital-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    // Add other critical assets
];

// Assets to cache on first access
const DYNAMIC_ASSETS = [
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap',
    'https://fonts.gstatic.com/',
    // Analytics
    'https://www.google-analytics.com/',
    'https://www.googletagmanager.com/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old cache versions
                        if (cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('t9digital-')) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim(); // Take control of all clients
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Skip Google Analytics requests when offline
    if (url.hostname === 'www.google-analytics.com' ||
        url.hostname === 'www.googletagmanager.com') {
        event.respondWith(
            fetch(request).catch(() => {
                // Return empty response when analytics is unavailable
                return new Response('', { status: 200 });
            })
        );
        return;
    }

    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same-origin requests - use cache-first strategy
        event.respondWith(cacheFirst(request));
    } else if (url.hostname === 'fonts.googleapis.com' ||
               url.hostname === 'fonts.gstatic.com') {
        // Google Fonts - use stale-while-revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // External resources - use network-first strategy
        event.respondWith(networkFirst(request));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Service Worker: Serving from cache', request.url);
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Cache-first failed', error);

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html') ||
                   new Response('Offline - Please check your connection', {
                       status: 503,
                       headers: { 'Content-Type': 'text/plain' }
                   });
        }

        throw error;
    }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale-while-revalidate strategy (for fonts)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Silently fail for fonts
        return cachedResponse;
    });

    return cachedResponse || fetchPromise;
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);

    if (event.tag === 'contact-form-submit') {
        event.waitUntil(syncContactForm());
    }
});

// Sync contact form submissions when back online
async function syncContactForm() {
    try {
        // Get pending form submissions from IndexedDB
        const pendingSubmissions = await getPendingSubmissions();

        for (const submission of pendingSubmissions) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submission.data)
                });

                if (response.ok) {
                    await removePendingSubmission(submission.id);
                    console.log('Service Worker: Form submission synced successfully');
                }
            } catch (error) {
                console.error('Service Worker: Failed to sync form submission', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'New update from T9 Digital',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/icons/view.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/close.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('T9 Digital', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');

    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Cache management utilities
async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name =>
        name.startsWith('t9digital-') &&
        name !== STATIC_CACHE_NAME &&
        name !== DYNAMIC_CACHE_NAME
    );

    return Promise.all(oldCaches.map(name => caches.delete(name)));
}

// IndexedDB utilities for offline form storage
async function getPendingSubmissions() {
    // Implementation for IndexedDB operations
    return [];
}

async function removePendingSubmission(id) {
    // Implementation for removing synced submissions
    return true;
}

console.log('Service Worker: Loaded successfully');