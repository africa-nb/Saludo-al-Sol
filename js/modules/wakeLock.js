/**
 * =====================================================
 * CONTROL DE PANTALLA ACTIVA
 * =====================================================
 *
 * Mantiene la pantalla del dispositivo encendida
 * durante una sesión de Saludo al Sol.
 *
 * Utiliza la Screen Wake Lock API.
 */

"use strict";


/* ==========================================
   ESTADO
========================================== */

/*
 * Referencia al bloqueo actual.
 *
 * WakeLockSentinel queda invalidado cuando
 * el sistema lo libera, por lo que debemos
 * solicitar uno nuevo cuando sea necesario.
 */

let wakeLock = null;


/*
 * Indica si actualmente necesitamos
 * mantener la pantalla encendida.
 *
 * Es independiente de wakeLock porque el
 * sistema puede liberar el bloqueo
 * automáticamente.
 */

let mantenerPantallaActiva = false;


/*
 * Evita solicitudes simultáneas de Wake Lock.
 */

let solicitudPendiente = null;


/* ==========================================
   COMPROBAR DISPONIBILIDAD
========================================== */

export function wakeLockDisponible() {

    return (
        "wakeLock" in navigator
    );

}


/* ==========================================
   SOLICITAR WAKE LOCK
========================================== */

export async function solicitarWakeLock() {

    /*
     * Indicamos que la sesión necesita
     * mantener la pantalla activa.
     */

    mantenerPantallaActiva = true;


    /*
     * Si el navegador no dispone de la API,
     * simplemente continuamos.
     *
     * La sesión NO debe detenerse porque
     * esta función no esté disponible.
     */

    if (!wakeLockDisponible()) {

        console.warn(
            "⚠ Screen Wake Lock no disponible"
        );

        return false;

    }


    /*
     * Si ya tenemos un bloqueo activo,
     * no necesitamos solicitar otro.
     */

    if (
        wakeLock &&
        !wakeLock.released
    ) {

        return true;

    }


    /*
     * Si ya hay una solicitud en curso,
     * esperamos esa misma solicitud.
     */

    if (solicitudPendiente) {

        return solicitudPendiente;

    }


    /*
     * Solo podemos solicitar Wake Lock
     * cuando el documento está visible.
     */

    if (
        document.visibilityState !==
        "visible"
    ) {

        return false;

    }


    /* ==================================
       SOLICITUD
    ================================== */

    solicitudPendiente =
        (async () => {

            try {

                const nuevoWakeLock =
                    await navigator.wakeLock.request(
                        "screen"
                    );


                /*
                 * Guardamos la referencia.
                 */

                wakeLock =
                    nuevoWakeLock;


                console.log(
                    "🔆 Pantalla activa"
                );


                /*
                 * El sistema puede liberar
                 * el Wake Lock automáticamente.
                 */

                wakeLock.addEventListener(
                    "release",
                    () => {

                        /*
                         * Solo limpiamos la referencia
                         * si sigue siendo el bloqueo
                         * que tenemos almacenado.
                         */

                        if (
                            wakeLock ===
                            nuevoWakeLock
                        ) {

                            wakeLock = null;

                        }


                        console.log(
                            "🔆 Wake Lock liberado por el sistema"
                        );


                        /*
                         * Si seguimos necesitando
                         * mantener la pantalla activa,
                         * volveremos a solicitarlo cuando
                         * la página vuelva a ser visible.
                         */

                    }
                );


                return true;

            } catch (error) {

                console.warn(
                    "⚠ No se pudo activar Wake Lock:",
                    error
                );


                wakeLock = null;

                return false;

            } finally {

                solicitudPendiente =
                    null;

            }

        })();


    return solicitudPendiente;

}


/* ==========================================
   LIBERAR WAKE LOCK
========================================== */

export async function liberarWakeLock() {

    /*
     * A partir de este momento ya NO queremos
     * mantener la pantalla activa.
     */

    mantenerPantallaActiva = false;


    /*
     * Si no hay bloqueo activo,
     * no hay nada que liberar.
     */

    if (!wakeLock) {

        return;

    }


    /*
     * Guardamos la referencia antes de
     * ponerla a null.
     */

    const bloqueo =
        wakeLock;


    wakeLock = null;


    try {

        await bloqueo.release();

        console.log(
            "🌙 Pantalla vuelve a su comportamiento normal"
        );

    } catch (error) {

        console.warn(
            "⚠ Error al liberar Wake Lock:",
            error
        );

    }

}


/* ==========================================
   VISIBILIDAD DEL DOCUMENTO
========================================== */

/*
 * Android puede liberar el Wake Lock cuando
 * la página deja de estar visible.
 *
 * Cuando volvemos a la aplicación,
 * intentamos recuperarlo si la sesión
 * todavía está activa.
 */

document.addEventListener(
    "visibilitychange",
    async () => {

        /*
         * Solo nos interesa cuando la página
         * vuelve a estar visible.
         */

        if (
            document.visibilityState !==
            "visible"
        ) {

            return;

        }


        /*
         * Si la sesión ya no necesita
         * mantener la pantalla activa,
         * no hacemos nada.
         */

        if (
            !mantenerPantallaActiva
        ) {

            return;

        }


        /*
         * Volvemos a solicitar el Wake Lock.
         */

        await solicitarWakeLock();

    }
);


/* ==========================================
   CONSULTA
========================================== */

export function pantallaActiva() {

    return (
        wakeLock !== null &&
        !wakeLock.released
    );

}