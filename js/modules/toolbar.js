/**
 * =====================================================
 * BARRA DE HERRAMIENTAS
 * =====================================================
 */

"use strict";

import { abrirConfiguracion } from "./settingsDialog.js";

export function crearToolbar() {

    const toolbar = document.getElementById("toolbar");

    if (!toolbar) return;

    toolbar.innerHTML = `

        <button id="btn-start" class="toolbar-button">
            ▶
        </button>

        <button id="btn-pause" class="toolbar-button">
            ⏸
        </button>

        <button id="btn-stop" class="toolbar-button">
            ■
        </button>

        <button id="btn-settings" class="toolbar-button">
            ⚙
        </button>

    `;
    document
        .getElementById("btn-start")
        .addEventListener("click", () => {

            console.log("▶ Iniciar");

        });

    document
        .getElementById("btn-pause")
        .addEventListener("click", () => {
 
            console.log("⏸ Pausar");

        });

    document
        .getElementById("btn-stop")
        .addEventListener("click", () => {

            console.log("■ Finalizar");

        });

    document
        .getElementById("btn-settings")
        .addEventListener("click", abrirConfiguracion);

}