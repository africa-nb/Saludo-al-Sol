/**
 * =====================================================
 * ALMACENAMIENTO LOCAL
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";


/* ==========================================
   CLAVE DE ALMACENAMIENTO
========================================== */

const STORAGE_KEY =
    "saludoAlSolSettings";


/* ==========================================
   CARGAR CONFIGURACIÓN
========================================== */

export function cargarConfiguracion() {

    const datos =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!datos) {
        return;
    }


    try {

        const configuracion =
            JSON.parse(datos);


        /*
         * Solo recuperamos las propiedades
         * que actualmente forman parte de SETTINGS.
         *
         * De esta forma evitamos que opciones
         * antiguas eliminadas del proyecto vuelvan
         * a incorporarse desde localStorage.
         */

        if (
            typeof configuracion.breathingTime ===
            "number"
        ) {

            SETTINGS.breathingTime =
                configuracion.breathingTime;

        }


        if (
            Array.isArray(
                configuracion.breathingOptions
            )
        ) {

            SETTINGS.breathingOptions =
                configuracion.breathingOptions;

        }


        if (
            typeof configuracion.totalCycles ===
            "number"
        ) {

            SETTINGS.totalCycles =
                configuracion.totalCycles;

        }


        if (
            Array.isArray(
                configuracion.cycleOptions
            )
        ) {

            SETTINGS.cycleOptions =
                configuracion.cycleOptions;

        }


        console.log(
            "Configuración cargada:",
            SETTINGS
        );

    } catch (error) {

        console.warn(
            "No se pudo cargar la configuración guardada.",
            error
        );

    }

}


/* ==========================================
   GUARDAR CONFIGURACIÓN
========================================== */

export function guardarSettings(
    settings
) {

    const configuracion = {

        breathingTime:
            settings.breathingTime,

        breathingOptions:
            settings.breathingOptions,

        totalCycles:
            settings.totalCycles,

        cycleOptions:
            settings.cycleOptions

    };


    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            configuracion
        )

    );

}
