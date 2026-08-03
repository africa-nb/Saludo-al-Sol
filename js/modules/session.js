/**
 * =====================================================
 * MÓDULO DE SESIÓN
 * Controla el desarrollo de una práctica
 * =====================================================
 */

"use strict";

import { siguientePostura } from "./postures.js";
import { SETTINGS } from "../../data/settings.js";

let temporizador = null;

export function iniciarSesion() {

    detenerSesion();

    temporizador = setTimeout(avanzar, SETTINGS.breathingTime * 1000);

}

function avanzar() {

    siguientePostura();

    temporizador = setTimeout(avanzar, SETTINGS.breathingTime * 1000);

}

export function detenerSesion() {

    if (temporizador !== null) {

        clearTimeout(temporizador);

        temporizador = null;

    }

}


