/**
 * =====================================================
 * ESTADÍSTICAS
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

import {
    cargarHistorial,
} from "../utils/storage.js";


/* =====================================================
   CONSTANTES
===================================================== */

const DIAS_SEMANA =
    7;


/* =====================================================
   OBTENER HISTORIAL
===================================================== */

/**
 * Obtiene todas las sesiones almacenadas.
 *
 * Se devuelve una copia del historial para evitar
 * modificar accidentalmente los datos originales.
 */

export function obtenerDatosHistorial() {

    const historial =
        cargarHistorial();


    if (!Array.isArray(historial)) {

        return [];

    }


    return [
        ...historial
    ];

}


/* =====================================================
   FECHA DE UNA SESIÓN
===================================================== */

/**
 * Convierte la fecha almacenada en un objeto Date.
 *
 * Si la fecha no es válida devuelve null.
 */

function obtenerFechaSesion(
    sesion
) {

    if (
        !sesion ||
        !sesion.fecha
    ) {

        return null;

    }


    const fecha =
        new Date(
            sesion.fecha
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
   ÚLTIMOS 7 DÍAS
===================================================== */

/**
 * Devuelve las sesiones realizadas durante
 * los últimos 7 días, incluyendo el día actual.
 */

export function obtenerSesionesUltimos7Dias() {

    const historial =
        obtenerDatosHistorial();


    const ahora =
        new Date();


    /*
     * Ponemos el inicio del día actual
     * a las 00:00:00.
     */

    const inicioHoy =
        new Date(
            ahora.getFullYear(),
            ahora.getMonth(),
            ahora.getDate()
        );


    /*
     * Retrocedemos seis días.
     *
     * De esta forma tenemos:
     *
     * hoy + 6 días anteriores = 7 días.
     */

    const inicioPeriodo =
        new Date(
            inicioHoy
        );


    inicioPeriodo.setDate(
        inicioPeriodo.getDate() -
        (DIAS_SEMANA - 1)
    );


    return historial.filter(
        sesion => {

            const fecha =
                obtenerFechaSesion(
                    sesion
                );


            if (!fecha) {
                return false;
            }


            return fecha >= inicioPeriodo;

        }
    );

}


/* =====================================================
   SESIONES DEL MES
===================================================== */

/**
 * Devuelve las sesiones realizadas durante
 * el mes actual.
 */

export function obtenerSesionesMesActual() {

    const historial =
        obtenerDatosHistorial();


    const ahora =
        new Date();


    const inicioMes =
        new Date(
            ahora.getFullYear(),
            ahora.getMonth(),
            1
        );


    return historial.filter(
        sesion => {

            const fecha =
                obtenerFechaSesion(
                    sesion
                );


            if (!fecha) {
                return false;
            }


            return fecha >= inicioMes;

        }
    );

}


/* =====================================================
   NÚMERO DE SESIONES
===================================================== */

/**
 * Cuenta las sesiones de una colección.
 */

export function obtenerNumeroSesiones(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return 0;

    }


    return sesiones.length;

}


/* =====================================================
   TOTAL DE SALUDOS
===================================================== */

/**
 * Suma todos los Saludos al Sol realizados.
 */

export function obtenerTotalCiclos(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return 0;

    }


    return sesiones.reduce(

        (
            total,
            sesion
        ) => {

            const ciclos =
                Number(
                    sesion.ciclos
                );


            if (
                Number.isFinite(
                    ciclos
                )
            ) {

                return total + ciclos;

            }


            return total;

        },

        0

    );

}


/* =====================================================
   TIEMPO TOTAL
===================================================== */

/**
 * Suma el tiempo total de práctica.
 *
 * El historial almacena el tiempo en milisegundos.
 */

export function obtenerTiempoTotal(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return 0;

    }


    return sesiones.reduce(

        (
            total,
            sesion
        ) => {

            const tiempo =
                Number(
                    sesion.tiempo
                );


            if (
                Number.isFinite(
                    tiempo
                )
            ) {

                return total + tiempo;

            }


            return total;

        },

        0

    );

}


/* =====================================================
   MEDIA DE SALUDOS POR SESIÓN
===================================================== */

/**
 * Calcula la media de Saludos al Sol
 * realizados por sesión.
 */

export function obtenerMediaCiclos(
    sesiones
) {

    const numeroSesiones =
        obtenerNumeroSesiones(
            sesiones
        );


    if (
        numeroSesiones === 0
    ) {

        return 0;

    }


    return (
        obtenerTotalCiclos(
            sesiones
        ) /
        numeroSesiones
    );

}


/* =====================================================
   MEDIA DE DURACIÓN POR SESIÓN
===================================================== */

/**
 * Calcula la duración media de una sesión.
 *
 * El resultado se expresa en milisegundos.
 */

export function obtenerMediaTiempo(
    sesiones
) {

    const numeroSesiones =
        obtenerNumeroSesiones(
            sesiones
        );


    if (
        numeroSesiones === 0
    ) {

        return 0;

    }


    return (
        obtenerTiempoTotal(
            sesiones
        ) /
        numeroSesiones
    );

}


/* =====================================================
   DÍAS PRACTICADOS
===================================================== */

/**
 * Cuenta los días diferentes en los que se realizó
 * al menos una sesión.
 *
 * Dos o más sesiones realizadas el mismo día
 * cuentan como un único día practicado.
 */

export function obtenerDiasPracticados(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return 0;

    }


    const dias =
        new Set();


    sesiones.forEach(
        sesion => {

            const fecha =
                obtenerFechaSesion(
                    sesion
                );


            if (!fecha) {
                return;
            }


            /*
             * Utilizamos la fecha local para que
             * el día mostrado al usuario coincida
             * con su calendario.
             */

            const clave =
                [
                    fecha.getFullYear(),
                    fecha.getMonth(),
                    fecha.getDate()
                ].join("-");


            dias.add(
                clave
            );

        }
    );


    return dias.size;

}


/* =====================================================
   SESIONES COMPLETADAS
===================================================== */

/**
 * Cuenta las sesiones que finalizaron
 * automáticamente.
 */

export function obtenerSesionesCompletadas(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return [];

    }


    return sesiones.filter(
        sesion =>
            sesion.tipo ===
            "completada"
    );

}


/* =====================================================
   SESIONES DETENIDAS
===================================================== */

/**
 * Cuenta las sesiones que fueron detenidas
 * manualmente por el usuario.
 */

export function obtenerSesionesDetenidas(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        return [];

    }


    return sesiones.filter(
        sesion =>
            sesion.tipo ===
            "detenida"
    );

}


/* =====================================================
   ESTADÍSTICAS DE UN PERIODO
===================================================== */

/**
 * Construye un resumen estadístico completo
 * para un conjunto de sesiones.
 */

export function calcularEstadisticas(
    sesiones
) {

    if (!Array.isArray(sesiones)) {

        sesiones = [];

    }


    const numeroSesiones =
        obtenerNumeroSesiones(
            sesiones
        );


    const totalCiclos =
        obtenerTotalCiclos(
            sesiones
        );


    const tiempoTotal =
        obtenerTiempoTotal(
            sesiones
        );


    const mediaCiclos =
        obtenerMediaCiclos(
            sesiones
        );


    const mediaTiempo =
        obtenerMediaTiempo(
            sesiones
        );


    const diasPracticados =
        obtenerDiasPracticados(
            sesiones
        );


    const completadas =
        obtenerSesionesCompletadas(
            sesiones
        );


    const detenidas =
        obtenerSesionesDetenidas(
            sesiones
        );


    return {

        sesiones:
            numeroSesiones,

        ciclos:
            totalCiclos,

        tiempo:
            tiempoTotal,

        mediaCiclos,

        mediaTiempo,

        diasPracticados,

        completadas:
            completadas.length,

        detenidas:
            detenidas.length

    };

}


/* =====================================================
   ESTADÍSTICAS DE LOS ÚLTIMOS 7 DÍAS
===================================================== */

/**
 * Calcula el resumen de los últimos 7 días.
 */

export function obtenerEstadisticasUltimos7Dias() {

    const sesiones =
        obtenerSesionesUltimos7Dias();


    return calcularEstadisticas(
        sesiones
    );

}


/* =====================================================
   ESTADÍSTICAS DEL MES ACTUAL
===================================================== */

/**
 * Calcula el resumen del mes actual.
 */

export function obtenerEstadisticasMesActual() {

    const sesiones =
        obtenerSesionesMesActual();


    return calcularEstadisticas(
        sesiones
    );

}


/* =====================================================
   ESTADÍSTICAS MENSUALES
===================================================== */

/**
 * Devuelve las estadísticas agrupadas por mes.
 *
 * Se utiliza todo el historial disponible.
 *
 * Cada mes contiene:
 *
 * - número de sesiones
 * - total de Saludos al Sol
 * - tiempo total
 * - media de Saludos por sesión
 * - media de duración por sesión
 * - días practicados
 */

export function obtenerEstadisticasMensuales() {

    const historial =
        obtenerDatosHistorial();


    const meses =
        new Map();


    historial.forEach(
        sesion => {

            const fecha =
                obtenerFechaSesion(
                    sesion
                );


            if (!fecha) {
                return;
            }


            const año =
                fecha.getFullYear();


            const mes =
                fecha.getMonth();


            const clave =
                `${año}-${String(
                    mes + 1
                ).padStart(2, "0")}`;


            if (
                !meses.has(
                    clave
                )
            ) {

                meses.set(

                    clave,

                    []

                );

            }


            meses
                .get(clave)
                .push(sesion);

        }
    );


    const resultado = [];


    meses.forEach(

        (
            sesiones,
            clave
        ) => {

            const estadisticas =
                calcularEstadisticas(
                    sesiones
                );


            const [año, mes] =
                clave
                    .split("-")
                    .map(Number);


            resultado.push({

                año,

                mes,

                clave,

                ...estadisticas

            });

        }

    );


    /*
     * Orden cronológico descendente:
     * el mes más reciente aparece primero.
     */

    resultado.sort(

        (
            a,
            b
        ) => {

            if (
                a.año !==
                b.año
            ) {

                return (
                    b.año -
                    a.año
                );

            }


            return (
                b.mes -
                a.mes
            );

        }

    );


    return resultado;

}


/* =====================================================
   ESTADÍSTICAS GENERALES
===================================================== */

/**
 * Devuelve todos los bloques de estadísticas
 * que utilizará posteriormente la interfaz.
 */

export function obtenerEstadisticas() {

    return {

        ultimos7Dias:
            obtenerEstadisticasUltimos7Dias(),

        mesActual:
            obtenerEstadisticasMesActual(),

        mensuales:
            obtenerEstadisticasMensuales()

    };

}