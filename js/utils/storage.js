/**
 * =====================================================
 * ALMACENAMIENTO LOCAL
 * =====================================================
 *
 * Gestiona:
 *
 * - Configuración de la aplicación.
 * - Historial de sesiones.
 *
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";


/* ==========================================
   CLAVES DE ALMACENAMIENTO
========================================== */

const STORAGE_KEY =
    "saludoAlSolSettings";


const HISTORY_STORAGE_KEY =
    "saludoAlSolHistory";


/* ==========================================
   CONFIGURACIÓN
========================================== */

/**
 * Carga la configuración guardada
 * desde localStorage.
 *
 * Solo se recuperan las propiedades
 * que actualmente forman parte de SETTINGS.
 */

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
         * Duración de la respiración.
         */

        if (
            typeof configuracion.breathingTime ===
            "number"
        ) {

            SETTINGS.breathingTime =
                configuracion.breathingTime;

        }


        /*
         * Opciones de duración de la respiración.
         */

        if (
            Array.isArray(
                configuracion.breathingOptions
            )
        ) {

            SETTINGS.breathingOptions =
                configuracion.breathingOptions;

        }


        /*
         * Número de ciclos.
         */

        if (
            typeof configuracion.totalCycles ===
            "number"
        ) {

            SETTINGS.totalCycles =
                configuracion.totalCycles;

        }


        /*
         * Opciones de número de ciclos.
         */

        if (
            Array.isArray(
                configuracion.cycleOptions
            )
        ) {

            SETTINGS.cycleOptions =
                configuracion.cycleOptions;

        }


        /*
         * Indicaciones por voz.
         */

        if (
            typeof configuracion.speech ===
            "boolean"
        ) {

            SETTINGS.speech =
                configuracion.speech;

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

/**
 * Guarda únicamente las propiedades
 * de SETTINGS que forman parte de la
 * configuración persistente.
 */

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
            settings.cycleOptions,

        speech:
            settings.speech

    };


    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            configuracion
        )

    );

}


/* ==========================================
   HISTORIAL
========================================== */

/**
 * Carga todas las sesiones almacenadas.
 *
 * Si no existe historial todavía,
 * devuelve un array vacío.
 *
 * Si los datos almacenados están dañados,
 * también devuelve un array vacío para
 * evitar que la aplicación se bloquee.
 */

export function cargarHistorial() {

    const datos =
        localStorage.getItem(
            HISTORY_STORAGE_KEY
        );


    if (!datos) {

        return [];

    }


    try {

        const historial =
            JSON.parse(datos);


        /*
         * El historial debe ser siempre
         * un array.
         */

        if (
            !Array.isArray(
                historial
            )
        ) {

            console.warn(
                "El historial almacenado no tiene un formato válido."
            );


            return [];

        }


        return historial;

    } catch (error) {

        console.warn(
            "No se pudo cargar el historial de sesiones.",
            error
        );


        return [];

    }

}


/* ==========================================
   GUARDAR SESIÓN
========================================== */

/**
 * Añade una sesión al historial.
 *
 * La sesión debe contener:
 *
 * - id
 * - fecha
 * - ciclos
 * - tiempo
 * - breathingTime
 * - tipo
 *
 * tipo:
 *
 * - "completada"
 * - "detenida"
 */

export function guardarSesion(
    sesion
) {

    if (
        !sesion ||
        typeof sesion !== "object"
    ) {

        console.warn(
            "No se puede guardar una sesión inválida."
        );


        return;

    }


    const historial =
        cargarHistorial();


    historial.push(
        sesion
    );


    localStorage.setItem(

        HISTORY_STORAGE_KEY,

        JSON.stringify(
            historial
        )

    );


    console.log(
        "Sesión guardada en el historial:",
        sesion
    );

}


/* ==========================================
   BORRAR HISTORIAL
========================================== */

/**
 * Elimina todas las sesiones almacenadas.
 *
 * Esta función queda preparada para
 * utilizarla posteriormente desde la
 * interfaz de estadísticas/historial.
 */

export function borrarHistorial() {

    localStorage.removeItem(
        HISTORY_STORAGE_KEY
    );


    console.log(
        "Historial de sesiones eliminado."
    );

}