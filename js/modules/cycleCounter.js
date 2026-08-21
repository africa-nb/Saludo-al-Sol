/**
 * =====================================================
 * CONTADOR DE CICLOS
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";
import { EVENTS } from "./events.js";


/* ==========================================
   ESTADO
========================================== */

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

                    total:
                        SETTINGS.totalCycles

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


    /*
     * Si existe un número máximo de ciclos
     * y se ha alcanzado, notificamos que
     * la sesión debe finalizar.
     *
     * Un valor de 0 significa infinito.
     */

    if (

        SETTINGS.totalCycles > 0 &&

        ciclos >= SETTINGS.totalCycles

    ) {

        document.dispatchEvent(

            new Event(
                EVENTS.SESSION_COMPLETE
            )

        );

        return true;

    }


    return false;

}


export function obtenerCiclos() {

    return ciclos;

}


/* ==========================================
   INTERFAZ
========================================== */

function actualizarContadorVisual() {

    const contador =
        document.getElementById(
            "cycle-counter"
        );


    if (!contador) {
        return;
    }


    contador.textContent =

        SETTINGS.totalCycles > 0

            ? `☀ ${ciclos} / ${SETTINGS.totalCycles}`

            : `☀ ${ciclos}`;

}


export function actualizarContador() {

    actualizarContadorVisual();

}