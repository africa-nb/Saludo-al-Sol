/**
 * =====================================================
 * PANEL DE ESTADÍSTICAS
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import {
    obtenerEstadisticas,
    obtenerSesionesUltimos7Dias
} from "./statistics.js";


/* =====================================================
   ABRIR ESTADÍSTICAS
===================================================== */

export function abrirEstadisticas() {

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
     * Creamos el diálogo utilizando exactamente
     * la misma arquitectura que Configuración.
     */

    dialogs.innerHTML = `

        <div
            id="statistics-overlay"
        >

            <div
                id="statistics-window"
            >

                <div
                    class="statistics-header"
                >

                    <h2
                        class="statistics-title"
                    >
                        Estadísticas
                    </h2>


                    <button
                        type="button"
                        id="statistics-close"
                        class="statistics-close"
                        aria-label="Cerrar estadísticas"
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
                    id="statistics-content"
                    class="statistics-content"
                ></div>

            </div>

        </div>

    `;


    /* =================================================
       ACTUALIZAR CONTENIDO
    ================================================= */

    actualizarEstadisticas();


    /* =================================================
       BOTÓN CERRAR
    ================================================= */

    const botonCerrar =
        document.getElementById(
            "statistics-close"
        );


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarEstadisticas
        );

    }


    /* =================================================
       CERRAR PULSANDO FUERA
    ================================================= */

    const overlay =
        document.getElementById(
            "statistics-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    overlay
                ) {

                    cerrarEstadisticas();

                }

            }
        );

    }


    /* =================================================
       ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        manejarEscape
    );

}


/* =====================================================
   CERRAR ESTADÍSTICAS
===================================================== */

export function cerrarEstadisticas() {

    const dialogs =
        document.getElementById(
            "dialogs"
        );


    if (!dialogs) {
        return;
    }


    dialogs.innerHTML = "";


    document.removeEventListener(
        "keydown",
        manejarEscape
    );

}


/* =====================================================
   ESCAPE
===================================================== */

function manejarEscape(
    evento
) {

    if (
        evento.key !==
        "Escape"
    ) {

        return;

    }


    cerrarEstadisticas();

}


/* =====================================================
   ACTUALIZAR ESTADÍSTICAS
===================================================== */

function actualizarEstadisticas() {

    const contenedor =
        document.getElementById(
            "statistics-content"
        );


    if (!contenedor) {
        return;
    }


    const estadisticas =
        obtenerEstadisticas();


    const sesionesUltimos7Dias =
        obtenerSesionesUltimos7Dias();


    contenedor.innerHTML = `

        ${crearBloqueUltimos7Dias(
            estadisticas.ultimos7Dias,
            sesionesUltimos7Dias
        )}


        ${crearBloqueMesActual(
            estadisticas.mesActual
        )}


        ${crearBloqueMensual(
            estadisticas.mensuales
        )}

    `;

}


/* =====================================================
   ÚLTIMOS 7 DÍAS
===================================================== */

function crearBloqueUltimos7Dias(
    estadisticas,
    sesiones
) {

    return `

        <section
            class="statistics-section"
        >

            <h3
                class="statistics-section-title"
            >
                Últimos 7 días
            </h3>


            <div
                class="statistics-cards"
            >

                ${crearTarjeta(
                    "Sesiones",
                    estadisticas.sesiones
                )}


                ${crearTarjeta(
                    "Saludos al Sol",
                    estadisticas.ciclos
                )}


                ${crearTarjeta(
                    "Tiempo de práctica",
                    formatearDuracion(
                        estadisticas.tiempo
                    )
                )}


                ${crearTarjeta(
                    "Días practicados",
                    estadisticas.diasPracticados
                )}

            </div>


            <div
                class="statistics-recent"
            >

                <h4>
                    Prácticas recientes
                </h4>


                ${crearHistorialReciente(
                    sesiones
                )}

            </div>

        </section>

    `;

}


/* =====================================================
   MES ACTUAL
===================================================== */

function crearBloqueMesActual(
    estadisticas
) {

    return `

        <section
            class="statistics-section"
        >

            <h3
                class="statistics-section-title"
            >
                Este mes
            </h3>


            <div
                class="statistics-cards"
            >

                ${crearTarjeta(
                    "Sesiones",
                    estadisticas.sesiones
                )}


                ${crearTarjeta(
                    "Días practicados",
                    estadisticas.diasPracticados
                )}


                ${crearTarjeta(
                    "Media de Saludos",
                    formatearNumero(
                        estadisticas.mediaCiclos
                    )
                )}


                ${crearTarjeta(
                    "Duración media",
                    formatearDuracion(
                        estadisticas.mediaTiempo
                    )
                )}

            </div>

        </section>

    `;

}


/* =====================================================
   RESUMEN MENSUAL
===================================================== */

function crearBloqueMensual(
    meses
) {

    if (
        !Array.isArray(meses) ||
        meses.length === 0
    ) {

        return `

            <section
                class="statistics-section"
            >

                <h3
                    class="statistics-section-title"
                >
                    Resumen mensual
                </h3>


                <p
                    class="statistics-empty"
                >
                    Todavía no hay datos mensuales.
                </p>

            </section>

        `;

    }


    return `

        <section
            class="statistics-section statistics-monthly"
        >

            <h3
                class="statistics-section-title"
            >
                Resumen mensual
            </h3>


            <div
                class="statistics-month-list"
            >

                ${meses
                    .map(
                        crearFilaMensual
                    )
                    .join("")
                }

            </div>

        </section>

    `;

}


/* =====================================================
   FILA MENSUAL
===================================================== */

function crearFilaMensual(
    mes
) {

    const nombreMes =
        obtenerNombreMes(
            mes.mes
        );


    return `

        <article
            class="statistics-month"
        >

            <div
                class="statistics-month-header"
            >

                <h4>
                    ${nombreMes}
                    ${mes.año}
                </h4>

            </div>


            <div
                class="statistics-month-data"
            >

                <div
                    class="statistics-month-item"
                >

                    <span>
                        Sesiones
                    </span>

                    <strong>
                        ${mes.sesiones}
                    </strong>

                </div>


                <div
                    class="statistics-month-item"
                >

                    <span>
                        Días practicados
                    </span>

                    <strong>
                        ${mes.diasPracticados}
                    </strong>

                </div>


                <div
                    class="statistics-month-item"
                >

                    <span>
                        Media de Saludos
                    </span>

                    <strong>
                        ${formatearNumero(
                            mes.mediaCiclos
                        )}
                    </strong>

                </div>


                <div
                    class="statistics-month-item"
                >

                    <span>
                        Duración media
                    </span>

                    <strong>
                        ${formatearDuracion(
                            mes.mediaTiempo
                        )}
                    </strong>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   HISTORIAL RECIENTE
===================================================== */

function crearHistorialReciente(
    sesiones
) {

    if (
        !Array.isArray(sesiones) ||
        sesiones.length === 0
    ) {

        return `

            <p
                class="statistics-empty"
            >
                No hay prácticas en los últimos 7 días.
            </p>

        `;

    }


    const ordenadas =
        [...sesiones].sort(

            (
                a,
                b
            ) => {

                return (
                    new Date(b.fecha) -
                    new Date(a.fecha)
                );

            }

        );


    return `

        <div
            class="statistics-recent-list"
        >

            ${ordenadas
                .map(
                    crearFilaReciente
                )
                .join("")
            }

        </div>

    `;

}


/* =====================================================
   FILA RECIENTE
===================================================== */

function crearFilaReciente(
    sesion
) {

    const fecha =
        new Date(
            sesion.fecha
        );


    const fechaTexto =
        formatearFecha(
            fecha
        );


    const ciclos =
        Number(
            sesion.ciclos
        );


    const tipo =
        sesion.tipo ===
        "completada"

            ? "Completada"

            : "Detenida";


    const claseTipo =
        sesion.tipo ===
        "completada"

            ? "completed"

            : "stopped";


    return `

        <article
            class="statistics-recent-item"
        >

            <div
                class="statistics-recent-main"
            >

                <strong>
                    ${fechaTexto}
                </strong>


                <span>
                    ${
                        ciclos === 1
                            ? "1 Saludo al Sol"
                            : `${ciclos} Saludos al Sol`
                    }
                </span>

            </div>


            <div
                class="statistics-recent-secondary"
            >

                <span>
                    ${formatearDuracion(
                        sesion.tiempo
                    )}
                </span>


                <span
                    class="
                        statistics-session-type
                        ${claseTipo}
                    "
                >
                    ${tipo}
                </span>

            </div>

        </article>

    `;

}


/* =====================================================
   TARJETA
===================================================== */

function crearTarjeta(
    etiqueta,
    valor
) {

    return `

        <div
            class="statistics-card"
        >

            <span
                class="statistics-card-label"
            >
                ${etiqueta}
            </span>


            <strong
                class="statistics-card-value"
            >
                ${valor}
            </strong>

        </div>

    `;

}


/* =====================================================
   DURACIÓN
===================================================== */

function formatearDuracion(
    milisegundos
) {

    const tiempo =
        Number(
            milisegundos
        );


    if (
        !Number.isFinite(tiempo) ||
        tiempo < 0
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


    if (horas > 0) {

        return `${horas} h ${minutos} min`;

    }


    if (minutos > 0) {

        return `${minutos} min ${segundos} s`;

    }


    return `${segundos} s`;

}


/* =====================================================
   NÚMERO
===================================================== */

function formatearNumero(
    numero
) {

    const valor =
        Number(
            numero
        );


    if (
        !Number.isFinite(
            valor
        )
    ) {

        return "0";

    }


    return valor.toLocaleString(
        "es-ES",
        {
            maximumFractionDigits: 1
        }
    );

}


/* =====================================================
   FECHA
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

        return "";

    }


    return fecha.toLocaleDateString(
        "es-ES",
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* =====================================================
   NOMBRE DEL MES
===================================================== */

function obtenerNombreMes(
    numeroMes
) {

    const fecha =
        new Date(
            2000,
            numeroMes - 1,
            1
        );


    return fecha.toLocaleDateString(
        "es-ES",
        {
            month: "long"
        }
    );

}


/* =====================================================
   EVENTO DEL MENÚ
===================================================== */

document.addEventListener(
    "open-statistics",
    abrirEstadisticas
);