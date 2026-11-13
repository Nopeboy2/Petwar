// Cache các file tĩnh để chơi được khi mất mạng. Ưu tiên mạng, rơi về cache (sửa code không bị kẹt bản cũ).
const CACHE = 'pokiwar-lite-v13';
const FILES = ['./', 'index.html', 'style.css', 'engine.js', 'data/config.js', 'data/pets.js', 'data/bosses.js',
  'ui/app.js', 'ui/battle.js', 'ui/audio.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'data/art.js', 'data/elements.js', 'data/suggest.js', 'data/items.js', 'data/shop.js',
  'assets/ui/avatar_frame.webp', 'assets/ui/bg_sanh.webp', 'assets/ui/btn_gold.webp', 'assets/ui/btn_purple.webp', 'assets/ui/badge_lv.webp', 'assets/ui/bar_track.webp', 'assets/ui/bar_fill.webp', 'assets/ui/chip_bar.webp', 'assets/ui/icon_coin.webp', 'assets/bag-ui/item_gem.webp', 'assets/ui/icon_bag.png', 'assets/ui/icon_gear.webp', 'assets/ui/icon_paw.png', 'assets/ui/icon_shield.png', 'assets/ui/icon_shop.webp', 'assets/ui/icon_swords.png', 'assets/ui/panel_leaf.webp', 'assets/ui/pedestal.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
