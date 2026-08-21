/**
 * =====================================================
 * DIÁLOGO DE HISTORIAL
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import {
    cargarHistorial,
    borrarHistorial
} from "../utils/storage.js";


/* =====================================================
   ABRIR HISTORIAL
===================================================== */

/**
 * Crea y muestra el panel de historial.
 *
 * Arquitectura:
 *
 * #dialogs
 *      └── #history-dialog
 *              └── #history-window
 *
 * El comportamiento es equivalente al diálogo
 * de configuración.
 */

export function abrirHistorial() {

    const dialogs =
        document.getElementById(
            "dialogs"
        );


    if (!dialogs) {

        console.warn(
            "No se encontró el contenedor #dialogs."
        );

        return;

    }


    /*
     * Eliminamos cualquier diálogo anterior
     * que pudiera encontrarse dentro de #dialogs.
     */

    dialogs.innerHTML = "";


    /* =================================================
       CREAR DIÁLOGO
    ================================================= */

    const dialog =
        document.createElement(
            "div"
        );


    dialog.id =
        "history-dialog";


    dialog.setAttribute(
        "aria-hidden",
        "true"
    );


    dialog.innerHTML = `

        <div
            id="history-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
        >

            <div class="history-header">

                <h2
                    id="history-title"
                    class="history-title"
                >
                    Historial
                </h2>


                <button
                    type="button"
                    id="history-close"
                    class="dialog-close"
                    aria-label="Cerrar historial"
                    title="Cerrar"
                >

                    <svg
                        viewBox="0 0 24 24"
                        class="toolbar-icon"
                        aria-hidden="true"
                    >

                        <path
                            d="
                                M6 6
                                L18 18
                                M18 6
                                L6 18
                            "
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        ></path>

                    </svg>

                </button>

            </div>


            <div
                id="history-content"
            ></div>


            <div
                class="history-actions"
            >

                <button
                    type="button"
                    id="history-clear"
                    class="history-clear-button"
                >
                    Borrar historial
                </button>

            </div>

        </div>

    `;


    dialogs.appendChild(
        dialog
    );


    /* =================================================
       ACTUALIZAR CONTENIDO
    ================================================= */

    actualizarHistorial();


    /* =================================================
       MOSTRAR
    ================================================= */

    requestAnimationFrame(
        () => {

            dialog.setAttribute(
                "aria-hidden",
                "false"
            );


            dialog.classList.add(
                "visible"
            );

        }
    );


    /* =================================================
       BOTÓN CERRAR
    ================================================= */

    const botonCerrar =
        document.getElementById(
            "history-close"
        );


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarHistorial
        );

    }


    /* =================================================
       BOTÓN BORRAR
    ================================================= */

    const botonBorrar =
        document.getElementById(
            "history-clear"
        );


    if (botonBorrar) {

        botonBorrar.addEventListener(
            "click",
            gestionarBorradoHistorial
        );

    }


    /* =================================================
       CERRAR AL PULSAR FUERA
    ================================================= */

    dialog.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                dialog
            ) {

                cerrarHistorial();

            }

        }
    );


    /* =================================================
       BLOQUEAR SCROLL
    ================================================= */

    document.body.classList.add(
        "dialog-open"
    );


    /* =================================================
       FOCO
    ================================================= */

    if (botonCerrar) {

        botonCerrar.focus();

    }

}


/* =====================================================
   CERRAR HISTORIAL
===================================================== */

/**
 * Cierra el diálogo de historial.
 */

export function cerrarHistorial() {

    const dialog =
        document.getElementById(
            "history-dialog"
        );


    if (!dialog) {

        return;

    }


    dialog.setAttribute(
        "aria-hidden",
        "true"
    );


    dialog.classList.remove(
        "visible"
    );


    document.body.classList.remove(
        "dialog-open"
    );


    /*
     * Esperamos a que termine la animación
     * antes de eliminar el elemento.
     */

    setTimeout(
        () => {

            if (
                dialog &&
                dialog.parentElement
            ) {

                dialog.remove();

            }

        },
        250
    );

}


/* =====================================================
   ACTUALIZAR HISTORIAL
===================================================== */

/**
 * Lee nuevamente el historial desde localStorage
 * y actualiza el contenido del panel.
 */

function actualizarHistorial() {

    const contenedor =
        document.getElementById(
            "history-content"
        );


    if (!contenedor) {

        return;

    }


    const historial =
        cargarHistorial();


    if (
        !Array.isArray(historial) ||
        historial.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="history-empty">

                <p>
                    Todavía no hay sesiones registradas.
                </p>

                <span>
                    Cuando realices una práctica,
                    aparecerá aquí.
                </span>

            </div>

        `;


        actualizarEstadoBotonBorrar(
            false
        );


        return;

    }


    /*
     * Copiamos el array para no modificar
     * directamente el historial almacenado.
     *
     * La sesión más reciente aparece primero.
     */

    const sesiones =
        [...historial].sort(

            (
                a,
                b
            ) => {

                return (
                    obtenerTiempoFecha(
                        b.fecha
                    ) -
                    obtenerTiempoFecha(
                        a.fecha
                    )
                );

            }

        );


    contenedor.innerHTML = `

        <div class="history-list">

            ${sesiones
                .map(
                    crearFilaHistorial
                )
                .join("")
            }

        </div>

    `;


    actualizarEstadoBotonBorrar(
        true
    );

}


/* =====================================================
   CREAR FILA
===================================================== */

function crearFilaHistorial(
    sesion
) {

    const fecha =
        obtenerFecha(
            sesion.fecha
        );


    const ciclos =
        obtenerNumero(
            sesion.ciclos
        );


    const tiempo =
        obtenerNumero(
            sesion.tiempo
        );


    const completada =
        sesion.tipo ===
        "completada";


    const textoTipo =
        completada
            ? "Completada"
            : "Detenida";


    const claseTipo =
        completada
            ? "completed"
            : "stopped";


    const textoCiclos =
        ciclos === 1

            ? "1 Saludo al Sol"

            : `${ciclos} Saludos al Sol`;


    return `

        <article
            class="history-item"
        >

            <div
                class="history-info"
            >

                <strong
                    class="history-cycles"
                >
                    ${textoCiclos}
                </strong>


                <span
                    class="
                        history-session-type
                        ${claseTipo}
                    "
                >
                    ${textoTipo}
                </span>

            </div>


            <span
                class="history-date"
            >
                ${formatearFecha(
                    fecha
                )}
            </span>


            <span
                class="history-time"
            >
                ${formatearDuracion(
                    tiempo
                )}
            </span>

        </article>

    `;

}


/* =====================================================
   BORRAR HISTORIAL
===================================================== */

function gestionarBorradoHistorial() {

    const historial =
        cargarHistorial();


    if (
        !Array.isArray(historial) ||
        historial.length === 0
    ) {

        return;

    }


    const confirmar =
        window.confirm(
            "¿Quieres borrar todo el historial de sesiones?\n\nEsta acción no se puede deshacer."
        );


    if (!confirmar) {

        return;

    }


    borrarHistorial();


    actualizarHistorial();

}


/* =====================================================
   ESTADO DEL BOTÓN BORRAR
===================================================== */

function actualizarEstadoBotonBorrar(
    hayDatos
) {

    const boton =
        document.getElementById(
            "history-clear"
        );


    if (!boton) {

        return;

    }


    boton.disabled =
        !hayDatos;

}


/* =====================================================
   OBTENER FECHA
===================================================== */

function obtenerFecha(
    valor
) {

    if (!valor) {

        return null;

    }


    const fecha =
        new Date(
            valor
        );


    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return null;

    }


    return fecha;

}


/* =====================================================
   OBTENER TIEMPO DE FECHA
===================================================== */

function obtenerTiempoFecha(
    valor
) {

    const fecha =
        obtenerFecha(
            valor
        );


    if (!fecha) {

        return 0;

    }


    return fecha.getTime();

}


/* =====================================================
   OBTENER NÚMERO
===================================================== */

function obtenerNumero(
    valor
) {

    const numero =
        Number(
            valor
        );


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return 0;

    }


    return numero;

}


/* =====================================================
   FORMATEAR FECHA
===================================================== */

function formatearFecha(
    fecha
) {

    if (
        !fecha ||
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return "Fecha desconocida";

    }


    return fecha.toLocaleDateString(
        "es-ES",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   FORMATEAR DURACIÓN
===================================================== */

function formatearDuracion(
    milisegundos
) {

    const tiempo =
        obtenerNumero(
            milisegundos
        );


    if (
        tiempo <= 0
    ) {

        return "0 s";

    }


    const totalSegundos =
        Math.floor(
            tiempo / 1000
        );


    const horas =
        Math.floor(
            totalSegundos / 3600
        );


    const minutos =
        Math.floor(
            (totalSegundos % 3600) / 60
        );


    const segundos =
        totalSegundos % 60;


    if (
        horas > 0
    ) {

        return `${horas} h ${minutos} min`;

    }


    if (
        minutos > 0
    ) {

        return `${minutos} min ${segundos} s`;

    }


    return `${segundos} s`;

}


/* =====================================================
   TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key !==
            "Escape"
        ) {

            return;

        }


        const dialog =
            document.getElementById(
                "history-dialog"
            );


        if (
            dialog &&
            dialog.getAttribute(
                "aria-hidden"
            ) === "false"
        ) {

            cerrarHistorial();

        }

    }
);
