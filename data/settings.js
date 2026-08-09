/**
 * =====================================================
 * CONFIGURACIÓN GLOBAL
 * =====================================================
 */

"use strict";

export const SETTINGS = {

    // Duración de una respiración (segundos)
    breathingTime: 4,

    // Valores permitidos para la duración de la respiración
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

    // Voz
    speech: true,

    // Sonidos
    sounds: true,

    // Cuenta atrás inicial
    countdown: true,

    // Número de ciclos (0 = infinito)
    totalCycles: 0,

    //Valores permitidos para el número de ciclos
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