/**
 * Service worker do gerador de licenças.
 *
 * Estratégia: cache primeiro. Depois de instalado no celular, o app abre e assina
 * licenças sem rede nenhuma — que é o cenário real (loja do cliente, sinal ruim).
 * A rede só é consultada em segundo plano, para pegar versões novas.
 */
const CACHE = 'softia-licencas-v6';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

function guardar(req, resp) {
  if (resp && resp.status === 200 && resp.type === 'basic') {
    const copia = resp.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
  }
  return resp;
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  const ehHTML = req.mode === 'navigate' || req.destination === 'document';
  if (ehHTML) {
    // Rede primeiro para o app: pega atualizações na hora; cai pro cache offline.
    e.respondWith(
      fetch(req).then((resp) => guardar(req, resp))
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  // Demais recursos: cache primeiro (ícones, manifest).
  e.respondWith(
    caches.match(req).then((cacheado) => {
      const rede = fetch(req).then((resp) => guardar(req, resp)).catch(() => cacheado);
      return cacheado || rede;
    })
  );
});
