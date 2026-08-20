/**
 * =====================================================
 * CONFIGURACIÓN GLOBAL
 * Proyecto: Saludo-al-Sol
 * =====================================================
 */

"use strict";

export const SETTINGS = {

    /*
     * Duración de cada postura/respiración
     * en segundos.
     */
    breathingTime: 4,


    /*
     * Valores permitidos para la duración
     * de la respiración.
     */
    breathingOptions: [
        2,
        3,
        3.5,
        4,
        4.5,
        5,
        6,
        7,
        8,
        9,
        10
    ],


    /*
     * Activar o desactivar las indicaciones
     * mediante síntesis de voz.
     */
    speech: true,


    /*
     * Número de ciclos de la práctica.
     *
     * 0 = práctica indefinida.
     */
    totalCycles: 0,


    /*
     * Valores permitidos para el número
     * de ciclos.
     */
    cycleOptions: [
        0,
        3,
        6,
        9,
        12,
        27,
        54,
        108
    ]

};
