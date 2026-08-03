/**
 * =====================================================
 * DIÁLOGO DE CONFIGURACIÓN
 * =====================================================
 */

"use strict";

import { SETTINGS } from "../../data/settings.js";
import { guardarSettings } from "../utils/storage.js";

export function abrirConfiguracion() {

    const dialogs = document.getElementById("dialogs");

    dialogs.innerHTML = `

        <div id="settings-overlay">

            <div id="settings-window">

                <h2>Configuración</h2>

                <h3>Duración de la respiración</h3>

                <div id="breathing-options"></div>

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

    const opciones = document.getElementById("breathing-options");

    SETTINGS.breathingOptions.forEach(valor => {

        opciones.innerHTML += `

            <label>

                <input
                    type="radio"
                    name="breathing"
                    value="${valor}"
                    ${valor === SETTINGS.breathingTime ? "checked" : ""}>

                ${valor} segundos

            </label><br>

        `;

    });

    document
        .getElementById("btn-cancel")
        .addEventListener("click", cerrarConfiguracion);

    document
        .getElementById("btn-save")
        .addEventListener("click", guardarConfiguracion);

}

function cerrarConfiguracion() {

    document.getElementById("dialogs").innerHTML = "";

}

function guardarConfiguracion() {

    const seleccion = document.querySelector(
        "input[name='breathing']:checked"
    );

    SETTINGS.breathingTime = Number(seleccion.value);

    console.log("Nuevo tiempo:", SETTINGS.breathingTime);

    cerrarConfiguracion();
    guardarSettings(SETTINGS);

}