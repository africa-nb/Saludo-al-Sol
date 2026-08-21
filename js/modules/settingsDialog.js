/**
 * =====================================================
 * DIÁLOGO DE CONFIGURACIÓN
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";

import { guardarSettings }
    from "../utils/storage.js";

import { actualizarContador }
    from "./cycleCounter.js";

import { actualizarTiempoRespiracion }
    from "./session.js";


/* ==========================================
   ABRIR DIÁLOGO
========================================== */

export function abrirConfiguracion() {

    const dialogs =
        document.getElementById(
            "dialogs"
        );


    dialogs.innerHTML = `

        <div id="settings-overlay">

            <div id="settings-window">

                <h2>Configuración</h2>


                <h3>Duración de la respiración</h3>

                <div id="breathing-options"></div>


                <h3>Número de Saludos al Sol</h3>

                <div id="cycle-options"></div>


                <h3>Indicaciones por voz</h3>

                <div id="speech-option">

                    <label>

                        <input
                            type="checkbox"
                            id="speech-enabled"
                            ${
                                SETTINGS.speech
                                    ? "checked"
                                    : ""
                            }>

                        Activar indicaciones por voz

                    </label>

                </div>


                <div class="settings-buttons">

                    <button id="btn-cancel">
                        Cancelar
                    </button>

                    <button id="btn-save">
                        Guardar
                    </button>

                </div>

            </div>

        </div>

    `;


    /* ==========================================
       TIEMPO DE RESPIRACIÓN
    ========================================== */

    const opciones =
        document.getElementById(
            "breathing-options"
        );


    SETTINGS.breathingOptions.forEach(
        valor => {

            opciones.innerHTML += `

                <label>

                    <input
                        type="radio"
                        name="breathing"
                        value="${valor}"
                        ${
                            valor ===
                            SETTINGS.breathingTime
                                ? "checked"
                                : ""
                        }>

                    ${valor} segundos

                </label>

                <br>

            `;

        }
    );


    /* ==========================================
       NÚMERO DE CICLOS
    ========================================== */

    const cycleOptions =
        document.getElementById(
            "cycle-options"
        );


    SETTINGS.cycleOptions.forEach(
        valor => {

            cycleOptions.innerHTML += `

                <label>

                    <input
                        type="radio"
                        name="cycles"
                        value="${valor}"
                        ${
                            valor ===
                            SETTINGS.totalCycles
                                ? "checked"
                                : ""
                        }>

                    ${
                        valor === 0
                            ? "Infinito"
                            : `${valor} saludos`
                    }

                </label>

                <br>

            `;

        }
    );


    /* ==========================================
       BOTÓN CANCELAR
    ========================================== */

    document
        .getElementById("btn-cancel")
        .addEventListener(
            "click",
            cerrarConfiguracion
        );


    /* ==========================================
       BOTÓN GUARDAR
    ========================================== */

    document
        .getElementById("btn-save")
        .addEventListener(
            "click",
            guardarConfiguracion
        );

}


/* ==========================================
   CERRAR
========================================== */

function cerrarConfiguracion() {

    document.getElementById(
        "dialogs"
    ).innerHTML = "";

}


/* ==========================================
   GUARDAR CONFIGURACIÓN
========================================== */

function guardarConfiguracion() {

    const seleccionTiempo =
        document.querySelector(
            "input[name='breathing']:checked"
        );


    const seleccionSaludos =
        document.querySelector(
            "input[name='cycles']:checked"
        );


    const seleccionVoz =
        document.getElementById(
            "speech-enabled"
        );


    if (
        !seleccionTiempo ||
        !seleccionSaludos ||
        !seleccionVoz
    ) {

        return;

    }


    const nuevoTiempo =
        Number(
            seleccionTiempo.value
        );


    const nuevosSaludos =
        Number(
            seleccionSaludos.value
        );


    const nuevaVoz =
        seleccionVoz.checked;


    const cambiaTiempo =
        nuevoTiempo !==
        SETTINGS.breathingTime;


    const cambiaSaludos =
        nuevosSaludos !==
        SETTINGS.totalCycles;


    /* ==========================================
       ACTUALIZAR CONFIGURACIÓN
    ========================================== */

    SETTINGS.breathingTime =
        nuevoTiempo;


    SETTINGS.totalCycles =
        nuevosSaludos;


    SETTINGS.speech =
        nuevaVoz;


    /* ==========================================
       GUARDAR EN ALMACENAMIENTO
    ========================================== */

    guardarSettings(
        SETTINGS
    );


    /* ==========================================
       CERRAR DIÁLOGO
    ========================================== */

    cerrarConfiguracion();


    /* ==========================================
       ACTUALIZAR CONTADOR
    ========================================== */

    if (cambiaSaludos) {

        actualizarContador();

    }


    /* ==========================================
       ACTUALIZAR RESPIRACIÓN
    ========================================== */

    if (cambiaTiempo) {

        actualizarTiempoRespiracion();

    }

}