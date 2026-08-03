/**
 * =====================================================
 * ALMACENAMIENTO LOCAL
 * =====================================================
 */

"use strict";

export function guardarSettings(settings) {

    localStorage.setItem(
        "saludoAlSolSettings",
        JSON.stringify(settings)
    );

}

export function cargarConfiguracion() {

    const datos = localStorage.getItem(
        "saludoAlSolSettings"
    );

    if (!datos) return null;

    return JSON.parse(datos);

}