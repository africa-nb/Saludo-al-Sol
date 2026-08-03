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


console.log("APP CARGADA");


/* Inicialización de la aplicación */
document.addEventListener("DOMContentLoaded", () => {

    console.log(document.getElementById("clock-svg"));
    console.log(document.getElementById("postures"));

    // Cargar configuración guardada
    const configuracion = cargarConfiguracion();
    if (configuracion) {

        Object.assign(
            SETTINGS,
            configuracion
        );

    }

    // Crear la interfaz de usuario
    crearToolbar();
    crearReloj();
    crearPosturas();
    iniciarSesion();
    

});