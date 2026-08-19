/**
 * =====================================================
 * MOTOR DE SESIÓN
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";
import { EVENTS } from "./events.js";

import {
    siguientePostura,
    activarPostura,
    reiniciarPosturas,
    notificarCambioPostura,
    obtenerPosturaActiva
} from "./postures.js";


import {
    reiniciarCiclos,
    obtenerCiclos
} from "./cycleCounter.js";

import {
    iniciarCronometro,
    pausarCronometro,
    reanudarCronometro,
    detenerCronometro,
    obtenerTiempoSesion
} from "./sessionTimer.js";

import { hablar } from "./speech.js";

import {
    solicitarWakeLock,
    liberarWakeLock
} from "./wakeLock.js";


/* ==========================================
   ESTADOS
========================================== */

export const SESSION_STATE = {

    STOPPED: "STOPPED",

    PREPARING: "PREPARING",

    RUNNING: "RUNNING",

    PAUSED: "PAUSED"

};


/* ==========================================
   VARIABLES
========================================== */

let estado = SESSION_STATE.STOPPED;

let temporizador = null;

let instanteInicioRespiracion = 0;

let tiempoRestante = 0;

/*
 * Identifica la preparación actual.
 *
 * Si se pulsa Finalizar mientras estamos
 * hablando, incrementamos este valor para
 * invalidar la preparación anterior.
 */

let idPreparacion = 0;


/* ==========================================
   EVENTOS
========================================== */

document.addEventListener(
    EVENTS.SESSION_COMPLETE,
    completarSesion
);


function notificarCambioEstado() {

    document.dispatchEvent(

        new CustomEvent(

            EVENTS.SESSION_STATE_CHANGED,

            {
                detail: {
                    estado
                }
            }

        )

    );

}


/* ==========================================
   INICIAR SESIÓN
========================================== */

export function iniciarSesion() {

    if (estado !== SESSION_STATE.STOPPED) {
        return;
    }

    console.log("▶ Sesión iniciada");


    /*
     * Mantenemos la pantalla encendida
     * durante toda la práctica.
     *
     * No esperamos la Promise porque el
     * Wake Lock no debe bloquear el inicio
     * de la sesión.
     */

    solicitarWakeLock();


    /*
     * Empezamos una sesión nueva.
     */

    reiniciarCiclos();

    reiniciarPosturas();

    /*
     * Entramos en la fase de preparación.
     */

    estado =
        SESSION_STATE.PREPARING;

    notificarCambioEstado();

    const preparacionActual =
        ++idPreparacion;

    iniciarPreparacion(
        preparacionActual
    );

}

/* ==========================================
   PREPARACIÓN
========================================== */

async function iniciarPreparacion(id) {

    const duracionMinima =
        SETTINGS.breathingTime * 1000;

    const inicioPreparacion =
        Date.now();

    /*
     * La locución comienza inmediatamente.
     */

    const locucion =
        hablar(
            // "Para comenzar ponte en la postura de la montaña e inhala."
            "Colócate de pie en postura de la montaña, con los pies firmes sobre la esterilla, la espalda estirada y los brazos relajados a los lados del cuerpo. Prepárate para comenzar el Saludo al Sol. Sigue las posturas de la imagen y escucha mi voz. Te indicaré cuándo inhalar, exhalar o retener. Inhala y comenzamos.",
            true
        );

    /*
     * Esperamos simultáneamente:
     *
     * 1. Que termine la locución.
     * 2. Que haya transcurrido al menos
     *    un tiempo de respiración.
     */

    await Promise.all([

        locucion,

        esperar(duracionMinima)

    ]);

    /*
     * Comprobamos que esta preparación
     * sigue siendo válida.
     */

    if (
        id !== idPreparacion ||
        estado !== SESSION_STATE.PREPARING
    ) {

        return;

    }

    /*
     * Por seguridad calculamos si todavía
     * queda tiempo mínimo.
     */

    const transcurrido =
        Date.now() - inicioPreparacion;

    const restante =
        duracionMinima - transcurrido;

    if (restante > 0) {

        await esperar(restante);

    }

    /*
     * Volvemos a comprobar el estado.
     */

    if (
        id !== idPreparacion ||
        estado !== SESSION_STATE.PREPARING
    ) {

        return;

    }

    /*
     * Ahora sí comienza realmente
     * el primer ciclo.
     */

    comenzarPrimerCiclo();

}


/* ==========================================
   COMIENZO DEL PRIMER CICLO
========================================== */

function comenzarPrimerCiclo() {

    console.log("☀ Comienza el primer ciclo");

    estado = SESSION_STATE.RUNNING;

    /*
     * El cronómetro comienza aquí,
     * justo cuando termina la preparación
     * y empieza realmente el Saludo al Sol.
     */

    iniciarCronometro();

    notificarCambioEstado();

    /*
     * La primera postura ya está activa visualmente,
     * pero su evento se produjo durante PREPARING.
     *
     * Lo volvemos a emitir ahora que la sesión
     * está realmente en RUNNING.
     */

    notificarCambioPostura();

    programarCambio(
        SETTINGS.breathingTime * 1000
    );
}


/* ==========================================
   PAUSAR SESIÓN
========================================== */

export function pausarSesion() {

    if (estado !== SESSION_STATE.RUNNING) {
        return;
    }

    estado =
        SESSION_STATE.PAUSED;


    /*
     * Al pausar la práctica dejamos que
     * el teléfono vuelva a gestionar
     * automáticamente el apagado de pantalla.
     */

    liberarWakeLock();

    notificarCambioEstado();

    pausarCronometro();

    const transcurrido =
        Date.now() -
        instanteInicioRespiracion;

    tiempoRestante =
        SETTINGS.breathingTime * 1000 -
        transcurrido;

    if (tiempoRestante < 0) {

        tiempoRestante = 0;

    }

    clearTimeout(temporizador);

    console.log(
        "⏸ Sesión pausada"
    );

}


/* ==========================================
   REANUDAR SESIÓN
========================================== */

export function reanudarSesion() {

    if (estado !== SESSION_STATE.PAUSED) {
        return;
    }

    console.log(
        "▶ Reanudar"
    );


    estado =
        SESSION_STATE.RUNNING;


    /*
     * Volvemos a mantener la pantalla
     * encendida.
     */

    solicitarWakeLock();


    notificarCambioEstado();

    reanudarCronometro();

    programarCambio(
        tiempoRestante
    );

}

/* ==========================================
   FINALIZAR SESIÓN
========================================== */

export function finalizarSesion() {

    /*
     * Guardamos los datos de la sesión
     * ANTES de reiniciar nada.
     */

    const ciclos =
        obtenerCiclos();

    const tiempo =
        obtenerTiempoSesion();

    const postura =
        obtenerPosturaActiva();


    /*
     * Ya no necesitamos mantener
     * la pantalla encendida.
     */

    liberarWakeLock();


    /*
     * Invalidamos cualquier preparación
     * que pudiera estar pendiente.
     */

    idPreparacion++;

    clearTimeout(temporizador);

    temporizador = null;


    /*
     * Finalizamos el estado de la sesión.
     */

    estado =
        SESSION_STATE.STOPPED;

    notificarCambioEstado();


    /*
     * Comunicamos el resultado de la sesión
     * antes de reiniciar sus datos.
     */

    document.dispatchEvent(

        new CustomEvent(
            EVENTS.SESSION_FINISHED,

            {
                detail: {

                    ciclos,

                    tiempo,

                    postura:
                        postura
                            ? postura.name
                            : ""

                }
            }
        )

    );


    /*
     * Ahora sí detenemos y reiniciamos
     * la sesión para dejarla preparada
     * para un nuevo START.
     */

    detenerCronometro();

    reiniciarPosturas();

    reiniciarCiclos();


    console.log(
        "■ Sesión finalizada",
        {
            ciclos,
            tiempo,
            postura:
                postura
                    ? postura.name
                    : ""
        }
    );

}


/* ==========================================
   SESIÓN COMPLETADA
========================================== */

/* ==========================================
   SESIÓN COMPLETADA
========================================== */

function completarSesion() {

    clearTimeout(temporizador);
    
    /*
     * La práctica ha terminado.
     * Liberamos la pantalla.
     */

    liberarWakeLock();

    /*
     * Guardamos los datos de la sesión
     * antes de reiniciar nada.
     */

    const ciclos =
        obtenerCiclos();

    const tiempo =
        obtenerTiempoSesion();

    const postura =
        obtenerPosturaActiva();


    /*
     * La sesión ha terminado
     * al completar el ciclo previsto.
     */

    estado =
        SESSION_STATE.STOPPED;

    notificarCambioEstado();


    /*
     * Comunicamos el resultado completo.
     */

    document.dispatchEvent(

        new CustomEvent(

            EVENTS.SESSION_FINISHED,

            {

                detail: {

                    ciclos,

                    tiempo,

                    postura:
                        postura
                            ? postura.name
                            : ""

                }

            }

        )

    );


    /*
     * Ahora sí detenemos el cronómetro
     * y dejamos las posturas preparadas
     * para una nueva sesión.
     */

    detenerCronometro();

    reiniciarPosturas();

}

/* ==========================================
   BUCLE PRINCIPAL
========================================== */

function avanzar() {

    if (estado !== SESSION_STATE.RUNNING) {
        return;
    }

    siguientePostura();

    programarCambio(
        SETTINGS.breathingTime * 1000
    );

}


/* ==========================================
   TEMPORIZACIÓN
========================================== */

function programarCambio(duracion) {

    clearTimeout(temporizador);

    instanteInicioRespiracion =
        Date.now();

    temporizador = setTimeout(

        avanzar,

        duracion

    );

}


/* ==========================================
   CAMBIO DE CONFIGURACIÓN
========================================== */

export function actualizarTiempoRespiracion() {

    if (estado !== SESSION_STATE.RUNNING) {
        return;
    }

    programarCambio(
        SETTINGS.breathingTime * 1000
    );

}


/* ==========================================
   UTILIDAD
========================================== */

function esperar(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}


/* ==========================================
   CONSULTA
========================================== */

export function obtenerEstadoSesion() {

    return estado;

}