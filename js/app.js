/**
 * =====================================================
 * SALUDO AL SOL
 * Archivo principal de la aplicación
 *
 * Autora: África Núñez Bazán
 * Desarrollo asistido por ChatGPT
 * Versión: 2.0.0
 * =====================================================
 */

"use strict";

/**
 * Clase principal de la aplicación
 */
class SaludoAlSol {

    constructor() {

        console.log("====================================");
        console.log("☀️ SALUDO AL SOL");
        console.log("Versión 2.0.0");
        console.log("Autora: África Núñez Bazán");
        console.log("Aplicación iniciada correctamente.");
        console.log("====================================");

        this.inicializar();

    }

    inicializar() {

        this.inicializarInterfaz();
        this.cargarConfiguracion();

    }

    inicializarInterfaz() {

        console.log("✔ Interfaz preparada.");

    }

    cargarConfiguracion() {

        console.log("✔ Configuración cargada.");

    }

}

/**
 * Esperar a que el documento esté listo
 */

document.addEventListener("DOMContentLoaded", () => {

    new SaludoAlSol();

});