`use strict`;

const CACHE_NAME = `brinquedo-app-estatico`;

const FILES_TO_CACHE = [
    `css/bootstrap.min.css`,
    `css/style.css`,
    `icons/favicon.ico`,
    `icons/152.png`,
    `imgs/logo.png`,
    `imgs/offline.png`,
    `imgs/bg001.jpg`,
    `imgs/bg002.jpg`,
    `imgs/cat_icon.jpg`,
    `js/app.js`,
    `js/bootstrap.bundle.min.js`,
    `offline.html`
];

self.addEventListener(`install`, (event) => {
    console.log(`Service Worker em instalação`);

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log(`adicionando arquivos no cache estatico`);
            console.log(FILES_TO_CACHE);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener(`activate`, (event) =>{
    console.log(`Service Worker em ativação`);
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) =>{
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }))
        })
    );

    self.clients.claim();
});

/**
 * Definição de experiência offline
 */
self.addEventListener(`fetch`, (event) =>{
    if(event.request.mode !== `navigate`){
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match(`offline.html`);
            });
        })
    );
});
