/**
 * =====================================================
 * MOTOR DE VOZ
 * =====================================================
 */

"use strict";

import { EVENTS } from "./events.js";

/* ==========================================
   ESTADO
========================================== */

let sesionActiva = false;

/* ==========================================
   EVENTOS
========================================== */

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


/* ==========================================
   ESTADO DE LA SESIÓN
========================================== */

function manejarCambioEstado(evento) {

    const estado = evento.detail.estado;

    sesionActiva = estado === "RUNNING";

    console.log(
        "🔊 Estado de voz:",
        estado
    );

}

/* ==========================================
   CAMBIO DE POSTURA
========================================== */

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

    let indicacion = "";

    switch (respiracion) {

        case "inhale":

            indicacion = "Inhala";
            break;

        case "exhale":

            indicacion = "Exhala";
            break;

        case "hold":

            indicacion = "Retén";
            break;

        default:

            return;
    }

    hablar(indicacion);

}

/* ==========================================
   SÍNTESIS DE VOZ
========================================== */

export function hablar(texto) {

    return new Promise(resolve => {

        /*
         * Comprobamos que el navegador
         * dispone de síntesis de voz.
         */

        if (!("speechSynthesis" in window)) {

            console.warn(
                "La síntesis de voz no está disponible"
            );

            resolve();

            return;

        }

        /*
         * Si hubiera una locución anterior,
         * la cancelamos antes de comenzar
         * la nueva.
         */

        window.speechSynthesis.cancel();

        const mensaje =
            new SpeechSynthesisUtterance(texto);

        mensaje.lang = "es-ES";

        mensaje.rate = 1;
        mensaje.pitch = 1;
        mensaje.volume = 1;

        /*
         * La Promise se resuelve cuando
         * la locución ha terminado.
         */

        mensaje.onend = () => {

            resolve();

        };

        /*
         * Si se produce un error también
         * continuamos la sesión.
         */

        mensaje.onerror = () => {

            console.warn(
                "Error en la síntesis de voz"
            );

            resolve();

        };

        window.speechSynthesis.speak(mensaje);

    });

}

/* ==========================================
   GESTIÓN DEL FIN DE LA SESIÓN  
========================================== */

function manejarFinSesion(evento) {

    const ciclos = evento.detail.ciclos;
    const tiempo = evento.detail.tiempo;

    console.log(
        "🔊 Sesión completada:",
        ciclos,
        "ciclos en",
        tiempo,
        "ms"
    );

    hablar(
        crearMensajeFinal(ciclos, tiempo)
    );

}


/* ==========================================
   SÍNTESIS DE VOZ (creación del mensaje final)
========================================== */
function crearMensajeFinal(ciclos, tiempo) {

    const totalSegundos =
        Math.floor(tiempo / 1000);

    const horas =
        Math.floor(totalSegundos / 3600);

    const minutos =
        Math.floor(
            (totalSegundos % 3600) / 60
        );

    const segundos =
        totalSegundos % 60;


    let partes = [];


    if (horas > 0) {

        partes.push(
            `${horas} ${
                horas === 1
                    ? "hora"
                    : "horas"
            }`
        );

    }


    if (minutos > 0) {

        partes.push(
            `${minutos} ${
                minutos === 1
                    ? "minuto"
                    : "minutos"
            }`
        );

    }


    if (segundos > 0 || partes.length === 0) {

        partes.push(
            `${segundos} ${
                segundos === 1
                    ? "segundo"
                    : "segundos"
            }`
        );

    }


    const duracion =
        partes.join(" y ");


    const saludos =
        ciclos === 1
            ? "1 Saludo al Sol"
            : `${ciclos} Saludos al Sol`;


    return `Has completado ${saludos} en ${duracion}.`;

}