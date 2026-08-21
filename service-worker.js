"use strict";

/*
=====================================================
SERVICE WORKER
SALUDO AL SOL
=====================================================
*/

const CACHE_NAME = "saludo-al-sol-v1";

const ARCHIVOS_PRINCIPALES = [

    /* Aplicación */
    "./",
    "./index.html",
    "./manifest.json",

    /* CSS */
    "./css/design-system.css",
    "./css/reset.css",
    "./css/variables.css",
    "./css/fonts.css",
    "./css/layout.css",
    "./css/header.css",
    "./css/toolbar.css",
    "./css/panels.css",
    "./css/clock.css",
    "./css/posture-card.css",
    "./css/animations.css",
    "./css/dialogs.css",
    "./css/footer.css",
    "./css/responsive.css",

    /* Datos */
    "./data/postures.js",
    "./data/settings.js",

    /* JavaScript */
    "./js/app.js",

    "./js/modules/clock.js",
    "./js/modules/postures.js",
    "./js/modules/toolbar.js",
    "./js/modules/session.js",
    "./js/modules/sessionTimer.js",
    "./js/modules/cycleCounter.js",
    "./js/modules/speech.js",
    "./js/modules/events.js",
    "./js/modules/wakeLock.js",
    "./js/modules/header.js",
    "./js/modules/footer.js",
    "./js/modules/statistics.js",
    "./js/modules/audio.js",
    "./js/modules/animation.js",
    "./js/modules/settingsDialog.js",

    /* Utilidades */
    "./js/utils/storage.js",

    /* Iconos PWA */
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",

    /* Imágenes de las posturas */
    "./assets/images/01.png",
    "./assets/images/02.png",
    "./assets/images/03.png",
    "./assets/images/04.png",
    "./assets/images/05.png",
    "./assets/images/06.png",
    "./assets/images/07.png",
    "./assets/images/08.png",
    "./assets/images/09.png",
    "./assets/images/10.png",
    "./assets/images/11.png"

];

/* ==========================================
   INSTALACIÓN
========================================== */

self.addEventListener("install", event => {

    console.log("PWA: instalando Service Worker");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(
                    ARCHIVOS_PRINCIPALES
                );

            })

    );

    self.skipWaiting();

});

/* ==========================================
   ACTIVACIÓN
========================================== */

self.addEventListener("activate", event => {

    console.log("PWA: Service Worker activado");

    event.waitUntil(

        caches.keys()

            .then(claves => {

                return Promise.all(

                    claves

                        .filter(
                            clave => clave !== CACHE_NAME
                        )

                        .map(
                            clave => caches.delete(clave)
                        )

                );

            })

    );

    self.clients.claim();

});

/* ==========================================
   PETICIONES
========================================== */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(respuesta => {

                if (respuesta) {

                    return respuesta;

                }

                return fetch(event.request);

            })

    );

});