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

let wakeLock = null;

let mantenerPantallaActiva = false;

let solicitudPendiente = null;

/*
 * Identifica la solicitud de Wake Lock actual.
 *
 * Permite invalidar una solicitud que todavía
 * esté pendiente cuando la sesión se pausa
 * o finaliza.
 */
let idSolicitud = 0;


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
     * La sesión quiere mantener la pantalla
     * activa.
     */
    mantenerPantallaActiva = true;


    /* ======================================
       COMPROBACIONES
    ====================================== */

    if (!wakeLockDisponible()) {

        console.warn(
            "❌ Wake Lock no disponible en este navegador"
        );

        return false;

    }


    /*
     * La página debe estar visible.
     */

    if (
        document.visibilityState !==
        "visible"
    ) {

        console.warn(
            "⚠ Wake Lock no solicitado porque la página no está visible"
        );

        return false;

    }


    /*
     * Si ya existe un Wake Lock válido,
     * no solicitamos otro.
     */

    if (
        wakeLock &&
        !wakeLock.released
    ) {

        console.log(
            "🔆 Wake Lock ya estaba activo"
        );

        return true;

    }


    /*
     * Evitamos solicitudes duplicadas.
     */

    if (solicitudPendiente) {

        return solicitudPendiente;

    }


    /* ======================================
       IDENTIFICAR SOLICITUD
    ====================================== */

    const idActual =
        ++idSolicitud;


    /* ======================================
       SOLICITAR BLOQUEO
    ====================================== */

    solicitudPendiente =
        (async () => {

            try {

                console.log(
                    "🔆 Solicitando navigator.wakeLock.request('screen')..."
                );


                const nuevoWakeLock =
                    await navigator.wakeLock.request(
                        "screen"
                    );


                /*
                 * Comprobamos que esta solicitud
                 * siga siendo válida.
                 *
                 * Si la sesión se pausó o terminó
                 * mientras request() estaba pendiente,
                 * no conservamos el Wake Lock.
                 */

                if (
                    idActual !== idSolicitud ||
                    !mantenerPantallaActiva
                ) {

                    await nuevoWakeLock.release();

                    return false;

                }


                wakeLock =
                    nuevoWakeLock;


                console.log(
                    "✅ WAKE LOCK ACTIVADO"
                );


                console.log(
                    "🔆 Tipo:",
                    wakeLock.type
                );


                /*
                 * El sistema puede liberar
                 * automáticamente el Wake Lock.
                 */

                wakeLock.addEventListener(
                    "release",
                    () => {

                        console.warn(
                            "⚠ WAKE LOCK LIBERADO POR EL SISTEMA"
                        );


                        /*
                         * Solo eliminamos la referencia
                         * si corresponde al bloqueo actual.
                         */

                        if (
                            wakeLock ===
                            nuevoWakeLock
                        ) {

                            wakeLock = null;

                        }

                    }
                );


                return true;

            } catch (error) {

                /*
                 * Solo limpiamos la referencia si
                 * corresponde a la solicitud actual.
                 */

                if (
                    idActual === idSolicitud
                ) {

                    wakeLock = null;

                }


                console.error(
                    "❌ ERROR AL SOLICITAR WAKE LOCK"
                );


                console.error(
                    "Nombre:",
                    error?.name
                );


                console.error(
                    "Mensaje:",
                    error?.message
                );


                console.error(
                    "Error completo:",
                    error
                );


                if (
                    error?.name ===
                    "NotAllowedError"
                ) {

                    console.warn(
                        "⚠ Android/navegador ha rechazado el Wake Lock."
                    );

                    console.warn(
                        "Puede deberse a visibilidad, batería, ahorro de energía, permisos o política del navegador."
                    );

                }


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
     * La sesión ya no quiere mantener
     * la pantalla activa.
     */

    mantenerPantallaActiva =
        false;


    /*
     * Invalidamos cualquier solicitud
     * que todavía estuviera pendiente.
     */

    idSolicitud++;


    /*
     * Si no hay Wake Lock activo,
     * no hay nada más que liberar.
     */

    if (!wakeLock) {

        console.log(
            "🌙 No había Wake Lock que liberar"
        );

        return;

    }


    const bloqueo =
        wakeLock;


    wakeLock = null;


    try {

        await bloqueo.release();


        console.log(
            "🌙 Wake Lock liberado correctamente"
        );

    } catch (error) {

        console.warn(
            "⚠ Error al liberar Wake Lock:",
            error
        );

    }

}


/* ==========================================
   RECUPERACIÓN AL VOLVER A LA APLICACIÓN
========================================== */

document.addEventListener(
    "visibilitychange",
    async () => {

        console.log(
            "👁 Visibilidad:",
            document.visibilityState
        );


        /*
         * Solo recuperamos el bloqueo cuando
         * volvemos a la aplicación.
         */

        if (
            document.visibilityState !==
            "visible"
        ) {

            return;

        }


        /*
         * Si la sesión ya no necesita mantener
         * la pantalla activa, no hacemos nada.
         */

        if (
            !mantenerPantallaActiva
        ) {

            return;

        }


        console.log(
            "🔆 Intentando recuperar Wake Lock..."
        );


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