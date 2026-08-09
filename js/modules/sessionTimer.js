/**
 * =====================================================
 * CRONÓMETRO DE LA SESIÓN
 * =====================================================
 */

"use strict";

/* ==========================================
   VARIABLES
========================================== */

let inicio = null;
let tiempoAcumulado = 0;
let temporizador = null;


/* ==========================================
   FORMATEO
========================================== */

function formatearTiempo(ms) {

    const totalSegundos = Math.floor(ms / 1000);

    const horas = Math.floor(totalSegundos / 3600);

    const minutos = Math.floor(
        (totalSegundos % 3600) / 60
    );

    const segundos = totalSegundos % 60;

    if (horas > 0) {

        return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

    }

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

}


/* ==========================================
   OBTENER TIEMPO
========================================== */

export function obtenerTiempoSesion() {

    let tiempo = tiempoAcumulado;

    if (inicio !== null) {

        tiempo += Date.now() - inicio;

    }

    return tiempo;

}


/* ==========================================
   ACTUALIZACIÓN
========================================== */

function actualizarCronometro() {

    const reloj =
        document.getElementById("session-timer");

    if (!reloj) return;

    const tiempo = obtenerTiempoSesion();

    reloj.textContent =
        `⏱ ${formatearTiempo(tiempo)}`;

}


/* ==========================================
   CRONÓMETRO
========================================== */

export function iniciarCronometro() {

    clearInterval(temporizador);

    tiempoAcumulado = 0;

    inicio = Date.now();

    actualizarCronometro();

    temporizador = setInterval(

        actualizarCronometro,

        250

    );

}


export function pausarCronometro() {

    if (inicio === null)
        return;

    tiempoAcumulado +=
        Date.now() - inicio;

    inicio = null;

    clearInterval(temporizador);

    temporizador = null;

}


export function reanudarCronometro() {

    if (inicio !== null)
        return;

    inicio = Date.now();

    actualizarCronometro();

    temporizador = setInterval(

        actualizarCronometro,

        250

    );

}


export function detenerCronometro() {

    clearInterval(temporizador);

    temporizador = null;

    inicio = null;

    tiempoAcumulado = 0;

    actualizarCronometro();

}