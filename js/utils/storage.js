/**
 * =====================================================
 * ALMACENAMIENTO LOCAL
 * =====================================================
 */

"use strict";
import { SETTINGS } from "../../data/settings.js";

export function cargarConfiguracion() {

    const datos = localStorage.getItem("saludoAlSolSettings");

    if (!datos) return;

    Object.assign(
        SETTINGS,
        JSON.parse(datos)
    );
    console.log("Configuración cargada:", SETTINGS);

}

export function guardarSettings(settings) {

    localStorage.setItem(
        "saludoAlSolSettings",
        JSON.stringify(settings)
    );

}

