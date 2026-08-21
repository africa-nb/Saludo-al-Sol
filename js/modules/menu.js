/**
 * =====================================================
 * MENÚ PRINCIPAL
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import {
    abrirConfiguracion
} from "./settingsDialog.js";

import {
    abrirEstadisticas
} from "./statisticsDialog.js";



/* ==========================================
   ICONOS
========================================== */

/*
 * Icono de configuración.
 *
 * Es el mismo engranaje utilizado
 * actualmente en toolbar.js.
 */

const SETTINGS_ICON = `

    <svg
        class="toolbar-icon menu-option-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >

        <path
            fill="currentColor"
            d="
                M19.14 12.94
                c.04-.31.06-.63.06-.94
                s-.02-.63-.06-.94
                l2.03-1.58
                a.5.5 0 0 0 .12-.64
                l-1.92-3.32
                a.5.5 0 0 0-.6-.22
                l-2.39.96
                a7.2 7.2 0 0 0-1.63-.95
                l-.36-2.54
                A.5.5 0 0 0 13.9 2
                h-3.8
                a.5.5 0 0 0-.49.42
                l-.36 2.54
                a7.2 7.2 0 0 0-1.63.95
                l-2.39-.96
                a.5.5 0 0 0-.6.22
                L2.71 8.49
                a.5.5 0 0 0 .12.64
                l2.03 1.58
                c-.04.31-.06.63-.06.94
                s.02.63.06.94
                l-2.03 1.58
                a.5.5 0 0 0-.12.64
                l1.92 3.32
                a.5.5 0 0 0 .6.22
                l2.39-.96
                c.5.39 1.05.71 1.63.95
                l.36 2.54
                a.5.5 0 0 0 .49.42
                h3.8
                a.5.5 0 0 0 .49-.42
                l.36-2.54
                c.58-.24 1.13-.56 1.63-.95
                l2.39.96
                a.5.5 0 0 0 .6-.22
                l1.92-3.32
                a.5.5 0 0 0-.12-.64
                l-2.03-1.58
                Z

                M12 15.5
                A3.5 3.5 0 1 1 15.5 12
                A3.5 3.5 0 0 1 12 15.5
                Z
            "
        ></path>

    </svg>

`;


/*
 * Icono de estadísticas.
 */

const STATISTICS_ICON = `

    <svg
        class="toolbar-icon menu-option-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >

        <rect
            x="4"
            y="12"
            width="4"
            height="8"
            rx="1"
            fill="currentColor"
        ></rect>

        <rect
            x="10"
            y="8"
            width="4"
            height="12"
            rx="1"
            fill="currentColor"
        ></rect>

        <rect
            x="16"
            y="4"
            width="4"
            height="16"
            rx="1"
            fill="currentColor"
        ></rect>

    </svg>

`;


/*
 * Icono de historial.
 */

const HISTORY_ICON = `

    <svg
        class="toolbar-icon menu-option-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >

        <path
            d="
                M5 4
                h11
                a2 2 0 0 1 2 2
                v14
                H7
                a2 2 0 0 1-2-2
                Z
            "
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
        ></path>

        <path
            d="
                M7 4
                v16
            "
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
        ></path>

        <path
            d="
                M10 8
                h5
                M10 12
                h5
                M10 16
                h4
            "
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
        ></path>

    </svg>

`;



/* ==========================================
   CREAR MENÚ
========================================== */

export function crearMenu() {

    const toolbar =
        document.getElementById(
            "toolbar"
        );


    if (!toolbar) {

        console.error(
            "No existe el elemento #toolbar"
        );

        return;

    }


    /*
     * Si el menú ya existe no lo volvemos
     * a crear.
     */

    if (
        document.getElementById(
            "menu-container"
        )
    ) {

        return;

    }


    /*
     * El antiguo botón de configuración
     * ya no se utiliza.
     */

    const botonConfiguracion =
        document.getElementById(
            "btn-settings"
        );


    if (botonConfiguracion) {

        botonConfiguracion.remove();

    }


    /* ==========================================
       CONTENEDOR DEL MENÚ
    ========================================== */

    const contenedor =
        document.createElement(
            "div"
        );


    contenedor.id =
        "menu-container";


    /*
     * Se añade directamente a #toolbar
     * para que permanezca en el extremo
     * derecho de la barra.
     */

    toolbar.appendChild(
        contenedor
    );


    /* ==========================================
       BOTÓN DEL MENÚ
    ========================================== */

    const boton =
        document.createElement(
            "button"
        );


    boton.id =
        "btn-menu";


    boton.className =
        "toolbar-button";


    boton.type =
        "button";


    boton.setAttribute(
        "aria-label",
        "Abrir menú"
    );


    boton.setAttribute(
        "aria-expanded",
        "false"
    );


    boton.setAttribute(
        "aria-haspopup",
        "true"
    );


    boton.innerHTML = `

        <svg
            class="toolbar-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >

            <path
                d="
                    M4 6
                    h16
                    M4 12
                    h16
                    M4 18
                    h16
                "
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            ></path>

        </svg>

    `;


    contenedor.appendChild(
        boton
    );


    /* ==========================================
       PANEL DEL MENÚ
    ========================================== */

    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "main-menu";


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    panel.innerHTML = `

        <button
            type="button"
            class="menu-option"
            id="menu-settings"
        >

            ${SETTINGS_ICON}

            <span>
                Configuración
            </span>

        </button>


        <button
            type="button"
            class="menu-option"
            id="menu-statistics"
        >

            ${STATISTICS_ICON}

            <span>
                Estadísticas
            </span>

        </button>


        <button
            type="button"
            class="menu-option"
            id="menu-history"
        >

            ${HISTORY_ICON}

            <span>
                Historial
            </span>

        </button>

    `;


    contenedor.appendChild(
        panel
    );


    /* ==========================================
       ABRIR / CERRAR MENÚ
    ========================================== */

    boton.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();

            alternarMenu();

        }
    );


    /* ==========================================
       CERRAR AL PULSAR FUERA
    ========================================== */

    document.addEventListener(
        "click",
        evento => {

            if (
                !contenedor.contains(
                    evento.target
                )
            ) {

                cerrarMenu();

            }

        }
    );


    /* ==========================================
       ESCAPE
    ========================================== */

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                cerrarMenu();

            }

        }
    );


    /* ==========================================
       CONFIGURACIÓN
    ========================================== */

    document
        .getElementById(
            "menu-settings"
        )
        .addEventListener(
            "click",
            () => {

                cerrarMenu();

                abrirConfiguracion();

            }
        );


    /* ==========================================
       ESTADÍSTICAS
    ========================================== */

    document
        .getElementById(
            "menu-statistics"
        )
        .addEventListener(
            "click",
            () => {

                cerrarMenu();

                abrirEstadisticas();

            }
        );


    /* ==========================================
       HISTORIAL
    ========================================== */

    document
        .getElementById(
            "menu-history"
        )
        .addEventListener(
            "click",
            () => {

                cerrarMenu();

                /*
                 * El módulo de historial todavía
                 * se implementará.
                 */

                document.dispatchEvent(

                    new CustomEvent(
                        "open-history"
                    )

                );

            }
        );


    console.log(
        "✔ Menú creado"
    );

}


/* ==========================================
   ALTERNAR MENÚ
========================================== */

function alternarMenu() {

    const panel =
        document.getElementById(
            "main-menu"
        );


    const boton =
        document.getElementById(
            "btn-menu"
        );


    if (
        !panel ||
        !boton
    ) {

        return;

    }


    const abierto =
        panel.getAttribute(
            "aria-hidden"
        ) === "false";


    if (abierto) {

        cerrarMenu();

    } else {

        abrirMenu();

    }

}


/* ==========================================
   ABRIR
========================================== */

function abrirMenu() {

    const panel =
        document.getElementById(
            "main-menu"
        );


    const boton =
        document.getElementById(
            "btn-menu"
        );


    if (
        !panel ||
        !boton
    ) {

        return;

    }


    panel.setAttribute(
        "aria-hidden",
        "false"
    );


    panel.classList.add(
        "visible"
    );


    boton.setAttribute(
        "aria-expanded",
        "true"
    );

}


/* ==========================================
   CERRAR
========================================== */

export function cerrarMenu() {

    const panel =
        document.getElementById(
            "main-menu"
        );


    const boton =
        document.getElementById(
            "btn-menu"
        );


    if (
        !panel ||
        !boton
    ) {

        return;

    }


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    panel.classList.remove(
        "visible"
    );


    boton.setAttribute(
        "aria-expanded",
        "false"
    );

}