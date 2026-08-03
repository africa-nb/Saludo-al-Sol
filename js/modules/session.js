/**
 * =====================================================
 * MOTOR DE SESIÓN
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";
import {
    siguientePostura,
    reiniciarPosturas
} from "./postures.js";

/* ==========================================
   ESTADOS
========================================== */

export const SESSION_STATE = {

    STOPPED: "STOPPED",
    RUNNING: "RUNNING",
    PAUSED: "PAUSED"

};

/* ==========================================
   VARIABLES
========================================== */

let estado = SESSION_STATE.STOPPED;

let temporizador = null;

/* ==========================================
   SESIÓN
========================================== */

export function iniciarSesion() {

    if (estado === SESSION_STATE.RUNNING)
        return;

    console.log("▶ Sesión iniciada");

    estado = SESSION_STATE.RUNNING;

    avanzar();

}

export function pausarSesion() {

    if (estado !== SESSION_STATE.RUNNING)
        return;

    estado = SESSION_STATE.PAUSED;

    clearTimeout(temporizador);

    console.log("⏸ Sesión pausada");

}

export function finalizarSesion() {

    clearTimeout(temporizador);

    estado = SESSION_STATE.STOPPED;
    
    reiniciarPosturas();

    console.log("■ Sesión finalizada");

}

export function reanudarSesion() {

    if (estado !== SESSION_STATE.PAUSED)
        return;

    console.log("▶ Reanudar");

    estado = SESSION_STATE.RUNNING;

    avanzar();

}

/* ==========================================
   BUCLE
========================================== */

function avanzar() {

    if (estado !== SESSION_STATE.RUNNING)
        return;

    siguientePostura();

    temporizador = setTimeout(

        avanzar,

        SETTINGS.breathingTime * 1000

    );

}

/* ==========================================
   CONSULTA
========================================== */

export function obtenerEstadoSesion() {

    return estado;

}

