/**
 * =====================================================
 * SALUDO AL SOL
 * Archivo principal de la aplicación
 * =====================================================
 */

"use strict";

import { crearReloj } from "./modules/clock.js";
import { crearPosturas, siguientePostura } from "./modules/postures.js";
import { iniciarSesion } from "./modules/session.js";
import { abrirConfiguracion } from "./modules/settingsDialog.js";
import { crearToolbar } from "./modules/toolbar.js";
import { SETTINGS } from "../data/settings.js";
import { cargarConfiguracion } from "./utils/storage.js";
import { reiniciarCiclos } from "./modules/cycleCounter.js";
import "./modules/speech.js";


console.log("APP CARGADA");


/* Inicialización de la aplicación */
document.addEventListener("DOMContentLoaded", () => {

    console.log(document.getElementById("clock-svg"));
    console.log(document.getElementById("postures"));

    // Cargar configuración guardada
    cargarConfiguracion();

    // Crear la interfaz de usuario
    crearToolbar();
    crearReloj();
    crearPosturas();
   
    console.log("Antes de reiniciar:", SETTINGS.totalCycles);

    reiniciarCiclos();

    console.log("Después de reiniciar:", SETTINGS.totalCycles);
    

});

/* ==========================================
   PWA
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
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

    });

}

