/**
 * =====================================================
 * MOTOR DE VOZ
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";
import { EVENTS } from "./events.js";


/* =====================================================
   ESTADO
===================================================== */

let sesionActiva = false;


/* =====================================================
   ELEMENTO DEL MENSAJE EN PANTALLA
===================================================== */

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


    panel.textContent =
        texto;


    panel.setAttribute(
        "aria-hidden",
        "false"
    );


    panel.classList.add(
        "visible"
    );


    actualizarBotonConfiguracion(
        true
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


    panel.classList.remove(
        "visible"
    );


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    panel.textContent =
        "";


    actualizarBotonConfiguracion(
        false
    );

}


/* =====================================================
   ESTIMACIÓN DE DURACIÓN DE LOCUCIÓN
===================================================== */

/*
 * Cuando la voz está desactivada no podemos utilizar
 * SpeechSynthesis para conocer la duración real.
 *
 * Por tanto estimamos cuánto tardaría en pronunciarse
 * el mismo texto a velocidad normal (rate = 1).
 *
 * La estimación tiene en cuenta:
 *
 * - número de palabras
 * - pausas producidas por la puntuación
 *
 * Esta duración SOLO se utiliza cuando la voz está
 * desactivada.
 */

function estimarDuracionLocucion(texto) {

    const palabras =
        texto
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;


    /*
     * Aproximadamente 150 palabras por minuto
     * equivale a 400 ms por palabra.
     */

    const duracionPalabras =
        palabras * 400;


    /*
     * Añadimos pequeñas pausas para que la estimación
     * se aproxime mejor a una locución natural.
     */

    const pausasCortas =
        (
            texto.match(/[,;:]/g) || []
        ).length;


    const pausasLargas =
        (
            texto.match(/[.!?]/g) || []
        ).length;


    const duracionPausas =
        pausasCortas * 120 +
        pausasLargas * 350;


    /*
     * Pequeño margen inicial/final.
     */

    const margen =
        500;


    return Math.max(
        1000,
        duracionPalabras +
        duracionPausas +
        margen
    );

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


    sesionActiva =
        estado === "RUNNING";


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


    /*
     * Si la voz está desactivada no hacemos
     * absolutamente ninguna locución respiratoria.
     *
     * La indicación visual de la postura continúa
     * funcionando porque pertenece a postures.js.
     */

    if (!SETTINGS.speech) {
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
     * Las indicaciones respiratorias son
     * únicamente de voz.
     */

    hablar(
        indicacion
    );

}


/* =====================================================
   SÍNTESIS DE VOZ / MENSAJE VISUAL
===================================================== */

/*
 * @param {string} texto
 * @param {boolean} mostrarEnPantalla
 *
 * mostrarEnPantalla:
 *
 * false → solo voz
 *
 * true  → mensaje visual + voz
 *
 *
 * IMPORTANTE:
 *
 * SETTINGS.speech controla ÚNICAMENTE la voz.
 *
 * Si mostrarEnPantalla === true, el mensaje visual
 * siempre aparecerá, independientemente de si la voz
 * está activada o desactivada.
 */

export function hablar(
    texto,
    mostrarEnPantalla = false
) {

    return new Promise(resolve => {


        /* ==============================================
           DURACIÓN ESTIMADA
        ============================================== */

        const duracionEstimada =
            estimarDuracionLocucion(
                texto
            );


        /* ==============================================
           VOZ DESACTIVADA
        ============================================== */

        if (!SETTINGS.speech) {

            /*
             * El mensaje visual NO depende de la voz.
             */

            if (mostrarEnPantalla) {

                mostrarMensaje(
                    texto
                );


                /*
                 * Permanecemos visibles durante el tiempo
                 * estimado que habría durado la locución.
                 */

                setTimeout(() => {

                    ocultarMensaje();

                    resolve();

                }, duracionEstimada);

                return;

            }


            /*
             * Si no se solicita mensaje visual y la voz
             * está desactivada, no hay nada que esperar.
             */

            resolve();

            return;

        }


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
             * Aunque la síntesis no esté disponible,
             * el mensaje visual debe seguir funcionando.
             */

            if (mostrarEnPantalla) {

                mostrarMensaje(
                    texto
                );


                setTimeout(() => {

                    ocultarMensaje();

                    resolve();

                }, duracionEstimada);

                return;

            }


            resolve();

            return;

        }


        /* ==============================================
           CANCELAR LOCUCIÓN ANTERIOR
        ============================================== */

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
           COMIENZO DE LA LOCUCIÓN
        ============================================== */

        mensaje.onstart = () => {

            /*
             * El mensaje visual aparece únicamente
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

            if (mostrarEnPantalla) {

                ocultarMensaje();

            }


            resolve();

        };


        /* ==============================================
           ERROR DE LOCUCIÓN
        ============================================== */

        mensaje.onerror = error => {

            console.warn(
                "Error en la síntesis de voz:",
                error
            );


            /*
             * Si había mensaje visual, no lo dejamos
             * bloqueado indefinidamente.
             */

            if (mostrarEnPantalla) {

                ocultarMensaje();

            }


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
     * El mensaje final SIEMPRE se muestra.
     *
     * Si SETTINGS.speech === true:
     *
     *     mensaje + voz
     *
     * Si SETTINGS.speech === false:
     *
     *     mensaje durante la duración estimada
     *     de la locución.
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

/* =====================================================
   actualizarBotonConfiguracion
===================================================== */


function actualizarBotonConfiguracion(
    deshabilitado
) {

    const boton =
        document.getElementById(
            "btn-settings"
        );

    if (!boton) {
        return;
    }

    boton.disabled =
        deshabilitado;

}