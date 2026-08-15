/**
 * =====================================================
 * MÓDULO DEL CÍRCULO
 * =====================================================
 *
 * Dibuja únicamente el círculo exterior.
 *
 * Las imágenes de las posturas se gestionan
 * desde postures.js.
 *
 * La postura activa se identifica mediante
 * el resaltado de su propia imagen.
 */

"use strict";


/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

const SIZE = 1000;

const CENTER = 500;

const RADIUS = 420;


/* =====================================================
   CREAR CÍRCULO
   ===================================================== */

export function crearReloj() {

    const svg =
        document.getElementById("clock-svg");


    if (!svg) {

        console.error(
            "No existe el elemento #clock-svg"
        );

        return;

    }


    /*
     * Limpiar el SVG por si volvemos
     * a dibujar el círculo.
     */

    svg.innerHTML = "";


    /*
     * Configuración del SVG.
     */

    svg.setAttribute(
        "viewBox",
        `0 0 ${SIZE} ${SIZE}`
    );


    /* =================================================
       CÍRCULO PRINCIPAL
       ================================================= */

    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    circle.setAttribute(
        "cx",
        CENTER
    );


    circle.setAttribute(
        "cy",
        CENTER
    );


    circle.setAttribute(
        "r",
        RADIUS
    );


    circle.setAttribute(
        "fill",
        "none"
    );


    /*
     * Utilizamos las variables del
     * sistema de diseño.
     */

    const css =
        getComputedStyle(
            document.documentElement
        );


    const COLOR_BORDER =
        css
            .getPropertyValue(
                "--color-border"
            )
            .trim();


    circle.setAttribute(
        "stroke",
        COLOR_BORDER
    );


    circle.setAttribute(
        "stroke-width",
        "3"
    );


    svg.appendChild(
        circle
    );


    console.log(
        "✔ Círculo SVG creado"
    );

}
