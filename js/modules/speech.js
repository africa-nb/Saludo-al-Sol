/**
 * =====================================================
 * MOTOR DE VOZ
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import { EVENTS } from "./events.js";


/* =====================================================
   ESTADO
===================================================== */

let sesionActiva = false;

/*
 * Identifica la locución actualmente gestionada
 * por este módulo.
 *
 * Permite invalidar correctamente una locución
 * anterior cuando comienza otra.
 */

let idLocucion = 0;


/* =====================================================
   ELEMENTO DEL MENSAJE EN PANTALLA
===================================================== */

/*
 * El mensaje de sesión utiliza un único elemento.
 *
 * No existe un overlay y una ventana independientes.
 *
 * El propio #session-message funciona como:
 *
 * - fondo oscurecido
 * - contenedor del diálogo
 * - elemento accesible para lectores de pantalla
 *
 * dialogs.css genera visualmente la ventana interior
 * mediante ::before.
 */

function obtenerPanelMensaje() {

    return document.getElementById(
        "session-message"
    );

}


/* =====================================================
   MOSTRAR MENSAJE EN PANTALLA
===================================================== */

export function mostrarMensaje(texto) {

    const panel =
        obtenerPanelMensaje();


    if (!panel) {

        console.warn(
            "No existe #session-message"
        );

        return;

    }


    /*
     * Colocamos directamente el texto
     * dentro del panel.
     */

    panel.textContent =
        texto;


    /*
     * Indicamos que el mensaje
     * está visible.
     */

    panel.setAttribute(
        "aria-hidden",
        "false"
    );


    panel.classList.add(
        "visible"
    );

}


/* =====================================================
   OCULTAR MENSAJE EN PANTALLA
===================================================== */

export function ocultarMensaje() {

    const panel =
        obtenerPanelMensaje();


    if (!panel) {
        return;
    }


    /*
     * Ocultamos el panel.
     */

    panel.classList.remove(
        "visible"
    );


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Limpiamos el texto.
     */

    panel.textContent =
        "";

}


/* =====================================================
   EVENTOS
===================================================== */

document.addEventListener(
    EVENTS.SESSION_STATE_CHANGED,
    manejarCambioEstado
);


document.addEventListener(
    EVENTS.POSTURE_CHANGED,
    manejarCambioPostura
);


document.addEventListener(
    EVENTS.SESSION_FINISHED,
    manejarFinSesion
);


/* =====================================================
   ESTADO DE LA SESIÓN
===================================================== */

function manejarCambioEstado(evento) {

    const estado =
        evento.detail.estado;


    /*
     * Solo consideramos activa la sesión
     * cuando está realmente RUNNING.
     */

    sesionActiva =
        estado === "RUNNING";


    /*
     * Si la sesión deja de estar activa,
     * cancelamos cualquier indicación
     * respiratoria pendiente.
     *
     * El mensaje final se gestiona
     * independientemente mediante
     * SESSION_FINISHED.
     */

    if (!sesionActiva) {

        /*
         * No ocultamos aquí el mensaje final,
         * porque SESSION_FINISHED puede haber
         * sido emitido inmediatamente antes.
         */

    }


    console.log(
        "🔊 Estado de voz:",
        estado
    );

}


/* =====================================================
   CAMBIO DE POSTURA
===================================================== */

function manejarCambioPostura(evento) {

    if (!sesionActiva) {
        return;
    }


    const respiracion =
        evento.detail.respiracion;


    console.log(
        "🔵 Speech - respiración:",
        respiracion
    );


    let indicacion =
        "";


    switch (respiracion) {

        case "inhale":

            indicacion =
                "Inhala";

            break;


        case "exhale":

            indicacion =
                "Exhala";

            break;


        case "hold":

            indicacion =
                "Retén";

            break;


        default:

            return;

    }


    /*
     * Las indicaciones respiratorias
     * son únicamente de voz.
     *
     * NO se muestran en el panel.
     *
     * La tarjeta de la postura activa
     * ya muestra visualmente la
     * indicación correspondiente.
     */

    hablar(
        indicacion
    );

}


/* =====================================================
   SÍNTESIS DE VOZ
===================================================== */

/*
 * @param {string} texto
 * @param {boolean} mostrarEnPantalla
 *
 * mostrarEnPantalla:
 *
 * false → solo voz
 *
 * true  → voz + mensaje visual
 */

export function hablar(
    texto,
    mostrarEnPantalla = false
) {

    /*
     * Cada llamada obtiene un identificador único.
     *
     * Cuando comienza una nueva locución,
     * todas las anteriores quedan invalidadas.
     */

    const idActual =
        ++idLocucion;


    return new Promise(resolve => {


        /* ==============================================
           COMPROBAR DISPONIBILIDAD
        ============================================== */

        if (
            !(
                "speechSynthesis"
                in window
            )
        ) {

            console.warn(
                "La síntesis de voz no está disponible"
            );


            /*
             * Si esta locución debía mostrar
             * el panel, no dejamos ningún
             * mensaje visible.
             */

            if (mostrarEnPantalla) {

                ocultarMensaje();

            }


            resolve();

            return;

        }


        /* ==============================================
           CANCELAR LOCUCIÓN ANTERIOR
        ============================================== */

        /*
         * Solo puede existir una locución
         * activa al mismo tiempo.
         *
         * El identificador anterior ya ha
         * quedado invalidado al incrementar
         * idLocucion.
         */

        window.speechSynthesis.cancel();


        /* ==============================================
           CREAR LOCUCIÓN
        ============================================== */

        const mensaje =
            new SpeechSynthesisUtterance(
                texto
            );


        mensaje.lang =
            "es-ES";


        mensaje.rate =
            1;


        mensaje.pitch =
            1;


        mensaje.volume =
            1;


        /* ==============================================
           COMPROBAR LOCUCIÓN ACTUAL
        ============================================== */

        function esLocucionActual() {

            return (
                idActual === idLocucion
            );

        }


        /* ==============================================
           COMIENZO DE LA LOCUCIÓN
        ============================================== */

        mensaje.onstart = () => {

            /*
             * Una locución anterior no puede
             * modificar el panel de la nueva.
             */

            if (
                !esLocucionActual()
            ) {

                return;

            }


            /*
             * El mensaje visual solo aparece
             * cuando esta locución lo solicita.
             */

            if (mostrarEnPantalla) {

                mostrarMensaje(
                    texto
                );

            }

        };


        /* ==============================================
           FIN DE LA LOCUCIÓN
        ============================================== */

        mensaje.onend = () => {

            /*
             * La Promise de esta locución
             * siempre debe resolverse.
             */

            if (
                esLocucionActual()
            ) {

                /*
                 * Solo la locución actual
                 * puede modificar el panel.
                 */

                if (mostrarEnPantalla) {

                    ocultarMensaje();

                }

            }


            resolve();

        };


        /* ==============================================
           CANCELACIÓN / ERROR
        ============================================== */

        mensaje.onerror = () => {

            console.warn(
                "Error en la síntesis de voz"
            );


            /*
             * Una locución anterior puede
             * haber sido cancelada porque
             * comenzó otra.
             *
             * En ese caso no debe tocar
             * el panel de la nueva locución.
             */

            if (
                esLocucionActual()
            ) {

                if (mostrarEnPantalla) {

                    ocultarMensaje();

                }

            }


            /*
             * Incluso en caso de error,
             * nunca dejamos la Promise pendiente.
             */

            resolve();

        };


        /* ==============================================
           INICIAR LOCUCIÓN
        ============================================== */

        window.speechSynthesis.speak(
            mensaje
        );

    });

}

/* =====================================================
   GESTIÓN DEL FIN DE LA SESIÓN
===================================================== */

function manejarFinSesion(evento) {

    const ciclos =
        evento.detail.ciclos;


    const tiempo =
        evento.detail.tiempo;


    const postura =
        evento.detail.postura;


    console.log(
        "🔊 Sesión finalizada:",
        ciclos,
        "ciclos en",
        tiempo,
        "ms",
        "postura:",
        postura
    );


    /*
     * Creamos el mensaje final.
     */

    const mensajeFinal =
        crearMensajeFinal(
            postura,
            ciclos,
            tiempo
        );


    /*
     * El mensaje final:
     *
     * 1. Se muestra en pantalla.
     * 2. Se pronuncia.
     * 3. Permanece visible mientras habla.
     * 4. Desaparece al terminar.
     */

    hablar(
        mensajeFinal,
        true
    );

}


/* =====================================================
   CREACIÓN DEL MENSAJE FINAL
===================================================== */

function crearMensajeFinal(
    postura,
    ciclos,
    tiempo
) {

    /* ==================================================
       CONVERSIÓN DEL TIEMPO
    ================================================== */

    const totalSegundos =
        Math.floor(
            tiempo / 1000
        );


    const horas =
        Math.floor(
            totalSegundos / 3600
        );


    const minutos =
        Math.floor(
            (totalSegundos % 3600) / 60
        );


    const segundos =
        totalSegundos % 60;


    let partes = [];


    /* ==================================================
       HORAS
    ================================================== */

    if (horas > 0) {

        partes.push(

            `${horas} ${
                horas === 1
                    ? "hora"
                    : "horas"
            }`

        );

    }


    /* ==================================================
       MINUTOS
    ================================================== */

    if (minutos > 0) {

        partes.push(

            `${minutos} ${
                minutos === 1
                    ? "minuto"
                    : "minutos"
            }`

        );

    }


    /* ==================================================
       SEGUNDOS
    ================================================== */

    if (
        segundos > 0 ||
        partes.length === 0
    ) {

        partes.push(

            `${segundos} ${
                segundos === 1
                    ? "segundo"
                    : "segundos"
            }`

        );

    }


    /* ==================================================
       DURACIÓN
    ================================================== */

    const duracion =
        partes.join(
            " y "
        );


    /* ==================================================
       SALUDOS COMPLETADOS
    ================================================== */

    const saludos =
        ciclos === 1

            ? "1 Saludo al Sol"

            : `${ciclos} Saludos al Sol`;


    /* ==================================================
       MENSAJE FINAL
    ================================================== */

    return `Sesión finalizada en ${postura}. Has completado ${saludos} en ${duracion}.`;

}