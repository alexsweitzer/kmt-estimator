// ============================================================
// KMT Employee Portal — Service Worker
// Upload this to your repo ROOT, next to index.html, named exactly: sw.js
// It must sit at the same level as index.html for iOS to accept it.
// ============================================================

const CACHE = 'kmt-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // activate immediately on update
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Receive a push and show a notification
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: 'Kentmorr Marine Transport', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Kentmorr Marine Transport';
  const options = {
    body: data.body || '',
    icon: data.icon || 'icon-192.png',
    badge: data.badge || 'icon-192.png',
    tag: data.tag || undefined,      // same tag replaces an older notification
    data: { url: data.url || './' }, // where to go when tapped
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Tapping the notification focuses/opens the portal
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
