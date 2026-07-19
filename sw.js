const CACHE_NOME = 'refeitorio-v3';
const ARQUIVOS_BASE = ['./index.html', './manifest.json'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(ARQUIVOS_BASE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NOME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  // Sempre tenta a rede primeiro (dados do cardápio mudam o tempo todo);
  // só cai pro cache se estiver offline.
  evento.respondWith(
    fetch(evento.request).catch(() => caches.match(evento.request))
  );
});
