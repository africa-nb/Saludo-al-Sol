/**
 * =====================================================
 * SALUDO AL SOL
 * Archivo principal de la aplicación
 *
 * Autora: África Núñez Bazán
 * =====================================================
 */

"use strict";

import { crearReloj }
    from "./modules/clock.js";

import { crearPosturas }
    from "./modules/postures.js";

import { crearToolbar }
    from "./modules/toolbar.js";

import { SETTINGS }
    from "../data/settings.js";

import { cargarConfiguracion }
    from "./utils/storage.js";

import { reiniciarCiclos }
    from "./modules/cycleCounter.js";

import "./modules/speech.js";


console.log("APP CARGADA");


/* ==========================================
   INICIALIZACIÓN
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Cargar la configuración guardada
         * antes de crear la interfaz.
         */

        cargarConfiguracion();


        /*
         * Crear los elementos principales
         * de la aplicación.
         */

        crearToolbar();

        crearReloj();

        crearPosturas();


        /*
         * Preparar el contador para una
         * nueva sesión.
         */

        reiniciarCiclos();

    }
);


/* ==========================================
   PWA
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(registro => {

                    console.log(
                        "✔ Service Worker registrado:",
                        registro.scope
                    );

                })
                .catch(error => {

                    console.error(
                        "✖ Error registrando Service Worker:",
                        error
                    );

                });

        }
    );

}
