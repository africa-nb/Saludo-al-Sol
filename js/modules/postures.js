/**
 * =====================================================
 * MÓDULO DE POSTURAS
 * =====================================================
 */

"use strict";

import { POSTURES } from "../../data/postures.js";
import { moverMarcador } from "./clock.js";


/* ==========================================
   CONFIGURACIÓN
========================================== */

const NORMAL_RADIUS = 37.5;
const ACTIVE_RADIUS = 31.5;

const NORMAL_SCALE = 1;
const ACTIVE_SCALE = 1.6;

/* ==========================================
   ESTADO DEL MÓDULO
========================================== */

let posturaActiva = 0;
let tarjetas = [];


/* ==========================================
   UTILIDADES
========================================== */

function obtenerIndicacionRespiracion(tipo){

    switch(tipo){

        case "inhale":
            return "INHALA";

        case "exhale":
            return "EXHALA";

        case "hold":
            return "RETÉN";

        default:
            return "";

    }

}

/* ==========================================
   CREACIÓN DE LAS POSTURAS
========================================== */



export function crearPosturas() {

    const container = document.getElementById("postures");

    if (!container) {

        console.error("No existe #postures");

        return;

    }

    container.innerHTML = "";

    const TOTAL = POSTURES.length;
    const RADIUS = 38; // porcentaje del contenedor


    POSTURES.forEach((posture, index) => {

        const angle = ((360 / TOTAL) * index - 90) * Math.PI / 180;

        const x = 50 + RADIUS * Math.cos(angle);
        const y = 50 + RADIUS * Math.sin(angle);

        const card = document.createElement("article");

        card.className = "posture-card";

        card.dataset.angle = angle;
        card.dataset.index = index;

        posicionarTarjeta(card, angle, NORMAL_RADIUS);

        card.innerHTML = `
            <div class="posture-header">${posture.name}</div>

            <img
                class="posture-image"
                src="${posture.image}"
                alt="${posture.name}">

            <p class="posture-subtitle">${posture.subtitle}</p>

            <div class="breathing-label breathing-${posture.breathing}">
                ${obtenerIndicacionRespiracion(posture.breathing)}
            </div>
        `;

        container.appendChild(card);
        tarjetas.push(card);

    });

    activarPostura(0);
    console.log("✔ Posturas creadas");

}

function posicionarTarjeta(card, angle, radius) {

    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    card.style.left = `${x}%`;
    card.style.top = `${y}%`;

}

export function reiniciarPosturas() {

    posturaActiva = 0;

    activarPostura(0);

}


export function activarPostura(indice){
   //Borrar la postura activa anterior
    tarjetas.forEach(card => {

        card.classList.remove("active");
        card.classList.remove(
            "resp-inhale",
            "resp-exhale",
            "resp-hold"
        );

        posicionarTarjeta(
            card,
            Number(card.dataset.angle),
            NORMAL_RADIUS
        );

    });

    //Crear la nueva postura activa
    const actual = tarjetas[indice];

    posicionarTarjeta(actual,Number(actual.dataset.angle),ACTIVE_RADIUS);
    actual.classList.add("active");
    actual.classList.add(`resp-${POSTURES[indice].breathing}`);

    posturaActiva = indice;

    moverMarcador(indice);

}

export function siguientePostura() {

    let siguiente = posturaActiva + 1;

    if (siguiente >= tarjetas.length) {

        siguiente = 0;

    }

    activarPostura(siguiente);

}

export function anteriorPostura() {

    let anterior = posturaActiva - 1;

    if (anterior < 0) {

        anterior = tarjetas.length - 1;

    }

    activarPostura(anterior);

}