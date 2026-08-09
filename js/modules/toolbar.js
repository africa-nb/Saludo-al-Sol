/**
 * =====================================================
 * BARRA DE HERRAMIENTAS
 * =====================================================
 */

"use strict";

import { abrirConfiguracion } from "./settingsDialog.js";
import { EVENTS } from "./events.js";
import {

    iniciarSesion,
    pausarSesion,
    finalizarSesion,
    reanudarSesion,
    obtenerEstadoSesion,
    SESSION_STATE

} from "./session.js";


/* ==========================================
   ICONOS
========================================== */

const PLAY_ICON = `
<svg viewBox="0 0 24 24" class="toolbar-icon">
    <path d="M8 5 L19 12 L8 19 Z"/>
</svg>
`;

const PAUSE_ICON = `
<svg viewBox="0 0 24 24" class="toolbar-icon">
    <rect x="6" y="5" width="4" height="14"/>
    <rect x="14" y="5" width="4" height="14"/>
</svg>
`;


/* ==========================================
   UTILIDADES
========================================== */

function cambiarIcono(boton, icono) {

    // Evita animar si ya tiene ese icono
    if (boton.innerHTML.trim() === icono.trim()) {
        return;
    }

    boton.style.opacity = "0";

    setTimeout(() => {

        boton.innerHTML = icono;

        boton.style.opacity = "1";

    }, 100);

}


/* ==========================================
   ACTUALIZAR TOOLBAR
========================================== */

function actualizarToolbar() {

    const btnStart = document.getElementById("btn-start");
    const btnStop = document.getElementById("btn-stop");

    switch (obtenerEstadoSesion()) {

        case SESSION_STATE.STOPPED:

            btnStart.disabled = false;
            btnStart.title = "Iniciar";
            cambiarIcono(btnStart, PLAY_ICON);

            btnStop.disabled = true;

            break;


        case SESSION_STATE.PREPARING:

            btnStart.disabled = true;
            btnStart.title = "Preparando...";
            cambiarIcono(btnStart, PLAY_ICON);

            btnStop.disabled = true;

            break;


        case SESSION_STATE.RUNNING:

            btnStart.disabled = false;
            btnStart.title = "Pausar";
            cambiarIcono(btnStart, PAUSE_ICON);

            btnStop.disabled = false;

            break;


        case SESSION_STATE.PAUSED:

            btnStart.disabled = false;
            btnStart.title = "Reanudar";
            cambiarIcono(btnStart, PLAY_ICON);

            btnStop.disabled = false;

            break;

    }
}

/* ==========================================
   CREAR TOOLBAR
========================================== */

export function crearToolbar() {

    const toolbar = document.getElementById("toolbar");

    if (!toolbar) return;

    toolbar.innerHTML = `

        <div class="toolbar-group">

            <button
                id="btn-start"
                class="toolbar-button"
                title="Iniciar">

                ${PLAY_ICON}

            </button>

            <button
                id="btn-stop"
                class="toolbar-button"
                title="Finalizar">

                <svg
                    viewBox="0 0 24 24"
                    class="toolbar-icon">

                    <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"/>

                </svg>

            </button>

        </div>


        <div id="session-info">

            <span id="cycle-counter">
                ☀ 0
            </span>

            <span id="session-timer">
                ⏱ 00:00
            </span>

        </div>


        <div class="toolbar-group">

            <button
                id="btn-settings"
                class="toolbar-button"
                title="Configuración">

                <svg
                    class="toolbar-icon"
                    viewBox="0 0 24 24">

                    <path
                        fill="currentColor"
                        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.95l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54a7.2 7.2 0 0 0-1.63.95l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.49a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.17a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.71 1.63.95l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.24 1.13-.56 1.63-.95l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z"/>

                </svg>

            </button>

        </div>

    `;

    document
        .getElementById("btn-start")
        .addEventListener("click", () => {

            switch (obtenerEstadoSesion()) {

                case SESSION_STATE.STOPPED:

                    iniciarSesion();
                    break;

                case SESSION_STATE.RUNNING:

                    pausarSesion();
                    break;

                case SESSION_STATE.PAUSED:

                    reanudarSesion();
                    break;

            }

        

        });


    document
        .getElementById("btn-stop")
        .addEventListener("click", () => {

            finalizarSesion();


        });


    document
        .getElementById("btn-settings")
        .addEventListener(
            "click",
            abrirConfiguracion
        );


  /*  document.addEventListener(

        "session-state-changed",

        actualizarToolbar
    );
    */


    document.addEventListener(

    EVENTS.SESSION_STATE_CHANGED,

    actualizarToolbar

    );

}