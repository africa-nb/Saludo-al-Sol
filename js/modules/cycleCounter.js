"use strict";

import { SETTINGS } from "../../data/settings.js";
import { EVENTS } from "./events.js";

let ciclos = 0;


/* ==========================================
   EVENTOS
========================================== */

function notificarCambioCiclo() {

    document.dispatchEvent(

        new CustomEvent(

            EVENTS.CYCLE_CHANGED,

            {

                detail: {

                    ciclos,

                    total: SETTINGS.totalCycles

                }

            }

        )

    );

}


/* ==========================================
   CONTADOR
========================================== */

export function reiniciarCiclos() {

    ciclos = 0;

    actualizarContadorVisual();

    notificarCambioCiclo();

}

export function incrementarCiclos() {

    ciclos++;

    actualizarContadorVisual();

    notificarCambioCiclo();

    if (

        SETTINGS.totalCycles > 0 &&

        ciclos >= SETTINGS.totalCycles

    ) {

        document.dispatchEvent(

            new Event(EVENTS.SESSION_COMPLETE)

        );

    }

}

export function obtenerCiclos() {

    return ciclos;

}


/* ==========================================
   INTERFAZ
========================================== */

function actualizarContadorVisual() {

    const contador =
        document.getElementById("cycle-counter");

    if (!contador) return;

    contador.textContent =

        SETTINGS.totalCycles > 0

            ? `☀ ${ciclos} / ${SETTINGS.totalCycles}`

            : `☀ ${ciclos}`;

}

export function actualizarContador() {

    actualizarContadorVisual();

}