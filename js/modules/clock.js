/**
 * =====================================================
 * MÓDULO DEL RELOJ
 * =====================================================
 */

"use strict";

const SIZE = 1000;
const CENTER = 500;
const RADIUS = 420;
const MARKER_RADIUS = 130;
const TOTAL = 11;

let marker = null;


/**
 * Dibuja el reloj SVG
 */
export function crearReloj() {

    const svg = document.getElementById("clock-svg");

    if (!svg) {

        console.error("No existe el elemento #clock-svg");

        return;

    }

    
    // Limpiar por si volvemos a dibujar
    svg.innerHTML = "";

    // Configuración del SVG
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

    /* ==========================================
       CÍRCULO PRINCIPAL
    ========================================== */

    const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    circle.setAttribute("cx", CENTER);
    circle.setAttribute("cy", CENTER);
    circle.setAttribute("r", RADIUS);

    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#E5C27B");
    circle.setAttribute("stroke-width", "3");

    svg.appendChild(circle);

    /* ==========================================
       PUNTOS DE LAS POSTURAS
    ========================================== */

    for (let i = 0; i < TOTAL; i++) {

        const angle = ((360 / TOTAL) * i - 90) * Math.PI / 180;

        const x = CENTER + Math.cos(angle) * RADIUS;
        const y = CENTER + Math.sin(angle) * RADIUS;

        const mark = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        mark.setAttribute("cx", x);
        mark.setAttribute("cy", y);
        mark.setAttribute("r", "8");
        mark.setAttribute("fill", "#D97706");

        svg.appendChild(mark);

    }

    /* ==========================================
       MARCADOR ACTIVO
    ========================================== */

    marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );
    /* marker.style.filter =
    "drop-shadow(0 0 6px rgba(239,68,68,.9)) " +
    "drop-shadow(0 0 12px rgba(239,68,68,.6))"; */
    
    marker.setAttribute("id", "active-marker");

    marker.setAttribute("cx", CENTER);
    marker.setAttribute("cy", CENTER - MARKER_RADIUS);

    marker.setAttribute("r", "10");

    marker.setAttribute("fill", "#EF4444");
    marker.setAttribute("stroke", "#FFFFFF");
    marker.setAttribute("stroke-width", "4");

    svg.appendChild(marker);

    console.log("✔ Reloj SVG creado");

}

export function moverMarcador(indice) {

    if (!marker) return;

    const angle =
        ((360 / TOTAL) * indice - 90) * Math.PI / 180;

    const x = CENTER + Math.cos(angle) * MARKER_RADIUS;
    const y = CENTER + Math.sin(angle) * MARKER_RADIUS;

    marker.setAttribute("cx", x);
    marker.setAttribute("cy", y);

}